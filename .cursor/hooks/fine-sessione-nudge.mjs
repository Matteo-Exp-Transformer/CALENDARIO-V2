#!/usr/bin/env node
/**
 * Hook `stop` di Cursor — Nudge fine-sessione per lo skill system comunicazione.
 *
 * SCOPO: i report di fine chat erano superficiali — sezioni presenti ma vuote, dati non allineati al
 * diff reale. Le versioni v1-v3 controllavano la PRESENZA DEL TITOLO di una sezione («c'è scritto
 * Dati comunicazione?»): un titolo con sotto il vuoto passava. Debole.
 *
 * v4 (04-06-26) — DA «titolo presente» A «risposta presente». Il report ora contiene la sezione 11
 * «Domande di chiusura» (vedi CHIUSURA_SESSIONE.md §11): 6 domande marcate `❓ Q…` con una riga
 * risposta `✅ R…`. L'hook estrae ogni coppia e verifica che la risposta NON sia vuota/placeholder.
 *   - risposta mancante → rilancia un turno MIRATO (quali R sono vuote) e CHIEDE di compilarle.
 *   - tutte le risposte presenti → silenzio: il controllo «mente fredda» vive nel pre-commit.
 *   - nessun report fresco → silenzio.
 *
 * v5 (04-06-26) — tre tarature decise con Matteo perché l'hook insisteva troppo e su troppi report:
 *   1. SOLO IL REPORT PIÙ RECENTE: `findRecentReports` ritorna unicamente il report con mtime più
 *      alto = la chat che si sta chiudendo. Prima revisionava TUTTI i Report-*.md toccati negli ultimi
 *      20 min → bloccava la chiusura di oggi per una R vuota in un report di un'altra sessione.
 *      v5.1 (05-06-26): aggiunto il FILTRO GIORNO (cartella `DD-MM-YY` = oggi) accanto al mtime.
 *      «Solo il più recente» da solo non bastava: se l'unico report fresco per mtime era un vecchio
 *      report ri-toccato dal filesystem, restava lui e murava l'AVVIO di una nuova chat. Ora un
 *      report conta solo se è di OGGI E recente.
 *   2. TETTO DURO A 3 NUDGE: `if (loopCount >= 3) return` all'inizio di main(), su QUALSIASI ramo.
 *      Prima il ramo «mancanti» poteva sforare (era fermato solo da loop_limit). Ora max 3, e basta.
 *   3. MENO FALSI «risposta mancante»: `PLACEHOLDER_RE` non scarta più le risposte brevi fra parentesi
 *      (es. «nessuno (nessuna skill copre il componente)»); una risposta vale se ha ≥3 alfanumerici
 *      (isSubstantive). L'auto-revisione vera del CONTENUTO la fa l'agente via self-review nel prompt
 *      di chiusura (CHIUSURA_SESSIONE.md), non l'hook: l'hook resta il guardiano meccanico.
 *
 * v6 (05-06-26) — separazione stop/commit: lo `stop` controlla SOLO report incompleti. Il ramo
 * «tutte le risposte presenti» non rilancia piu un followup, perche nel runtime Cursor osservato
 * `loop_count` puo mancare/resettarsi e il cold-check si ripete a ogni fine risposta. Il controllo
 * «mente fredda» si sposta al pre-commit (`fine-sessione-commit-check.mjs`).
 *
 * PERCHÉ le domande-a-risposta invece del titolo: per rispondere a Q2 (dati=diff?) e Q3 (file
 * correlati) l'agente DEVE rileggere il diff e i file → la verifica intelligente la fa lui (l'hook
 * non vede il diff), l'hook controlla solo che abbia risposto.
 *
 * GUARDIA ANTI-LOOP: `loop_count` (Cursor, parte da 0). Tetto duro a 3 per il solo caso
 * «risposte mancanti». Per report completo lo hook tace sempre.
 *
 * LIMITE NOTO: gli hook `stop` NON girano sui Cloud Agents (solo IDE locale). Fallback Cloud =
 * checklist-di-chiusura nel prompt esecutore.
 *
 * INSTALLAZIONE: referenziato in .cursor/hooks.json sotto "stop".
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, sep, relative } from 'node:path'

/** Finestra entro cui un report è «di questa sessione» (minuti). */
const RECENT_MINUTES = 20
/** Report che NON sono di esecuzione → la sezione domande-di-chiusura vale comunque, MA li includiamo
 *  lo stesso: Matteo 04-06 «vale per qualsiasi agente che fa un report». Manteniamo solo l'esclusione
 *  di file palesemente non-report se mai servisse (per ora: nessuna esclusione, tutti i Report-*). */
const EXCLUDE_REPORT = null

/** Marca una domanda di chiusura: `❓ Q1 — …` a INIZIO riga (con eventuale spazio o bullet markdown).
 *  L'ancora `^[\s>\-*]*` evita che un `❓Q` CITATO in mezzo a una risposta (es. «nel formato ❓Q/✅R»)
 *  venga scambiato per una nuova domanda — bug reale rilevato 04-06-26. */
const QUESTION_RE = /^[\s>\-*]*❓\s*Q\s*(\d+)?/i
/** Cattura le righe risposta: `✅ R1: testo` a INIZIO riga. Stessa ancora, stessa ragione. */
const ANSWER_RE = /^[\s>\-*]*✅\s*R\s*(\d+)?\s*:?(.*)/i
/** Una risposta è «vuota» se dopo `R:` non c'è sostanza: stringa vuota, soli trattini, o placeholder
 *  secco (todo/tbd/n.a./puntini/underscore). NON conta più come vuota una risposta breve fra parentesi
 *  tipo «nessuno (nessuna skill copre il componente)»: era un FALSO «risposta mancante» frequente —
 *  alleggerimento Matteo 04-06. Una risposta è accettata se contiene ≥3 caratteri alfanumerici. */
const PLACEHOLDER_RE = /^[\s\-–—_.·•]*$|^(todo|tbd|n\/?a|\.\.\.|_+)$/i
/** Conta i caratteri «di sostanza»: serve almeno qualche lettera/cifra perché la risposta valga. */
function isSubstantive(txt) {
  const alnum = (txt.match(/[\p{L}\p{N}]/gu) || []).length
  return alnum >= 3
}

/** Data di OGGI in `DD-MM-YY` = il nome delle cartelle giorno. Secondo filtro accanto al mtime:
 *  un report conta solo se è di oggi E recente. Il mtime da solo non basta — un vecchio report
 *  ri-toccato dal filesystem rientrava nella finestra e bloccava l'AVVIO di una chat di un altro
 *  giorno (bug 05-06-26). Il filtro giorno lo scarta a monte. */
function todayFolder() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}-${mm}-${yy}`
}

function readStdin() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (c) => (data += c))
    process.stdin.on('end', () => resolve(data))
    setTimeout(() => resolve(data), 500)
  })
}

function resolveRoot(stdinRaw) {
  try {
    const p = JSON.parse(stdinRaw)
    const r = p.workspace_root || p.workspaceRoot || p.cwd || p.root
    if (r && typeof r === 'string') return r
  } catch {
    /* cwd */
  }
  return process.cwd()
}

function resolveLoopCount(stdinRaw) {
  try {
    const p = JSON.parse(stdinRaw)
    if (typeof p.loop_count === 'number') return p.loop_count
  } catch {
    /* 0 */
  }
  return 0
}

function findRecentReports(root) {
  const base = join(root, 'docs', 'Sessioni di lavoro')
  const cutoff = Date.now() - RECENT_MINUTES * 60_000
  const today = todayFolder()
  const out = []
  let dayDirs
  try {
    dayDirs = readdirSync(base, { withFileTypes: true })
  } catch {
    return out
  }
  for (const day of dayDirs) {
    if (!day.isDirectory()) continue
    // Solo la cartella di OGGI: un report di un altro giorno (es. 01-06) non scatta all'avvio di
    // una chat di oggi, anche se "fresco" per mtime. Primo dei due filtri (v5, 05-06-26).
    if (day.name !== today) continue
    const dayPath = join(base, day.name)
    let files
    try {
      files = readdirSync(dayPath, { withFileTypes: true })
    } catch {
      continue
    }
    for (const f of files) {
      if (!f.isFile() || !/^Report-.*\.md$/i.test(f.name)) continue
      if (EXCLUDE_REPORT && EXCLUDE_REPORT.test(f.name)) continue
      const full = join(dayPath, f.name)
      try {
        const mtimeMs = statSync(full).mtimeMs
        if (mtimeMs >= cutoff) out.push({ full, mtimeMs })
      } catch {
        /* sparito */
      }
    }
  }
  // Solo il report PIÙ RECENTE = quello della chat che si sta chiudendo. Decisione Matteo 04-06:
  // l'hook non deve più bloccare la chiusura di OGGI per una R vuota in un report di un'altra
  // sessione toccato nella stessa finestra di 20 min (era il «revisiona tutti» troppo invadente).
  if (out.length === 0) return []
  out.sort((a, b) => b.mtimeMs - a.mtimeMs)
  return [out[0].full]
}

/** Estrae lo stato delle domande di chiusura di un report.
 *  Ritorna { hasSection, unanswered: [labels] }.
 *  - Una domanda è «senza risposta» se la prima riga `✅ R…` che la segue è vuota/placeholder,
 *    OPPURE se non c'è alcuna riga risposta dopo di lei. */
function auditQuestions(content) {
  const lines = content.split(/\r?\n/)
  const questions = [] // { idx, label }
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(QUESTION_RE)
    if (m) {
      const num = m[1] || String(questions.length + 1)
      // etichetta breve = il testo della domanda, ripulito, troncato
      const label = lines[i].replace(/❓\s*/, '').trim().slice(0, 60)
      questions.push({ idx: i, num, label })
    }
  }
  if (questions.length === 0) return { hasSection: false, unanswered: [] }

  const unanswered = []
  for (let q = 0; q < questions.length; q++) {
    // Range della domanda: dalla sua riga (inclusa, per supportare Q e R sulla STESSA riga
    // `❓ Q1 … ✅ R1: testo`) fino alla riga PRIMA della domanda successiva (esclusa, così non
    // catturiamo la R della domanda dopo come risposta di questa).
    const start = questions[q].idx
    const end = q + 1 < questions.length ? questions[q + 1].idx : lines.length
    let answerText = null
    for (let i = start; i < end; i++) {
      const a = lines[i].match(ANSWER_RE)
      if (!a) continue
      // testo dopo i due punti sulla riga della R…
      let txt = (a[2] || '').trim()
      if (!txt) {
        // …oppure risposta multi-riga: prima riga non-vuota sotto, fino alla prossima Q o R.
        for (let j = i + 1; j < end; j++) {
          if (QUESTION_RE.test(lines[j]) || ANSWER_RE.test(lines[j])) break
          if (lines[j].trim()) {
            txt = lines[j].trim()
            break
          }
        }
      }
      answerText = txt
      break
    }
    if (answerText === null || PLACEHOLDER_RE.test(answerText) || !isSubstantive(answerText)) {
      unanswered.push(`Q${questions[q].num}`)
    }
  }
  return { hasSection: true, unanswered }
}

function send(obj) {
  process.stdout.write(JSON.stringify(obj))
  process.exit(0)
}

async function main() {
  const stdinRaw = await readStdin().catch(() => '')
  const root = resolveRoot(stdinRaw)
  const loopCount = resolveLoopCount(stdinRaw)

  // Tetto DURO: max 3 nudge in assoluto, su QUALSIASI ramo. Decisione Matteo 04-06: anche se restano
  // risposte vuote, dopo 3 rilanci l'hook tace e non muri la chiusura all'infinito. Questo rende il
  // limite vero (prima il ramo «mancanti» poteva sforare oltre, fermato solo da loop_limit in hooks.json).
  // Riportato a 3 (era 2) perché la vera causa dell'insistenza era «troppi report insieme», ora risolta
  // dal «solo il più recente» sotto: con un report solo, 3 è ampiamente sufficiente.
  if (loopCount >= 3) return send({})

  const recentReports = findRecentReports(root)

  // Nessun report fresco → silenzio.
  if (recentReports.length === 0) return send({})

  // Aggrega lo stato di tutti i report freschi.
  const reports = recentReports.map((path) => {
    let content = ''
    try {
      content = readFileSync(path, 'utf8')
    } catch {
      /* vuoto */
    }
    return { path, ...auditQuestions(content) }
  })

  const missing = reports.filter((r) => r.hasSection && r.unanswered.length)
  const noSection = reports.filter((r) => !r.hasSection)

  // CASO A: c'è almeno un report con risposte MANCANTI o sezione 11 ASSENTE → blocca/insiste.
  // Non ci fermiamo per loop_count qui: se l'agente ha compilato, al prossimo stop non rientra in A.
  // La rete dura contro il loop infinito è loop_limit in hooks.json.
  if (missing.length || noSection.length) {
    const lines = ['⚠️ FINE-SESSIONE — la sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) non è completa:', '']
    for (const r of noSection) {
      lines.push(`  • ${relative(root, r.path).split(sep).join('/')}`)
      lines.push('    manca l\'INTERA sezione 11 «Domande di chiusura» (le 6 domande ❓Q + ✅R). Aggiungila e rispondi.')
    }
    for (const r of missing) {
      lines.push(`  • ${relative(root, r.path).split(sep).join('/')}`)
      lines.push(`    risposte vuote: ${r.unanswered.join(' · ')} — compilale (no «...», no «TODO», no risposta vuota).`)
    }
    lines.push('')
    lines.push('Le domande sono in docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md §11 — formato `❓ Q… / ✅ R…`.')
    lines.push('Per Q2 (dati=diff) e Q3 (file correlati) DEVI rileggere il diff e i file prima di rispondere: è il punto.')
    lines.push('Compila TUTTE le risposte mancanti, poi conferma in 1 riga che le hai scritte.')
    return send({ followup_message: lines.join('\n') })
  }

  // CASO B: tutte le risposte presenti. Silenzio: il cold-check ora scatta al commit.
  return send({})
}

main()
