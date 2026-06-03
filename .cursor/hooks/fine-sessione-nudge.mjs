#!/usr/bin/env node
/**
 * Hook `stop` di Cursor — Nudge fine-sessione MIRATO per lo skill system comunicazione.
 *
 * SCOPO: gli agenti esecutori (Cursor) si dimenticano, a fine chat, di:
 *   1. scrivere la sezione «Dati comunicazione» (+ sottosezione «Analisi flusso prompt») nel report;
 *   2. segnare gli esiti delle voci Liv.2 del VOCABOLARIO usate in chat.
 * Diagnosi: motore Liv.2 fermo a zero da 4+ giorni (vedi EVOLUZIONE_SKILLS.md M4 + dossier revisore 02-06-26).
 *
 * PERCHÉ v2 (02-06-26): la v1 era un promemoria STATICO — stampava sempre lo stesso muro di testo e
 * delegava tutto il giudizio all'agente. Cioè la stessa «buona volontà» che già falliva. Questa v2
 * LEGGE LO STATO REALE: trova i Report-*.md toccati di recente e controlla se le sezioni obbligatorie
 * ci sono davvero. Così l'avviso è SPECIFICO («il report X non ha Dati comunicazione») e contabile.
 *
 * COMPORTAMENTO (aggiornato 03-06-26 — da `agent_message` passivo a `followup_message` ATTIVO):
 *  - report fresco con sezioni MANCANTI → rilancia un turno mirato (cosa manca) + procedura.
 *  - report fresco con sezioni PRESENTI → rilancia COMUNQUE 1 turno con la procedura + monito a
 *    verificare che siano PIENE e allineate, non solo presenti (Matteo: «ripeti anche se completo»).
 *  - nessun report fresco → silenzio (niente followup).
 *
 * PERCHÉ v3 (03-06-26): la v2 usava `agent_message`, che a `stop` (chat ormai chiusa) NON era
 * visibile all'agente — il nudge arrivava a vuoto (confermato dai report 03-06: «hook non
 * intercettato in chat»). Cursor permette a `stop` di emettere `followup_message`: AUTO-INVIA un
 * turno che riapre il loop, così l'agente RICEVE e RISPONDE al promemoria invece di ignorarlo.
 *
 * GUARDIA ANTI-LOOP: lo stdin dello `stop` porta `loop_count` (quante volte lo stop ha già
 * rilanciato in questa chat; parte da 0). Politica Matteo 03-06-26: **1 solo rilancio** →
 * se loop_count >= 1 l'hook tace. (Rete aggiuntiva: `loop_limit` in hooks.json.)
 *
 * LIMITE NOTO: gli hook `stop` NON girano sui Cloud Agents (solo IDE locale — limite Cursor). Per il
 * lavoro IDE di Matteo (caso normale, confermato 02-06-26) è la leva principale. Fallback Cloud =
 * checklist-di-chiusura nel prompt esecutore (da attivare se i Cloud Agent saltano comunque).
 *
 * INSTALLAZIONE: referenziato in .cursor/hooks.json sotto l'evento "stop".
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, sep, relative } from 'node:path'

/** Finestra entro cui un report è considerato «di questa sessione» (minuti).
 *  20 min: copre anche le chat dove il report è scritto a inizio sessione e la chat si chiude più
 *  tardi (così l'hook lo vede sia come nuovo sia come aggiornato). Non così largo da pescare report
 *  di sessioni davvero vecchie. Decisione Matteo 02-06-26 (reminder anche sugli aggiornamenti). */
const RECENT_MINUTES = 20
/** Marcatori che devono comparire in un report standard/deep (vedi APP_CONTEXT §7.1). */
const REQUIRED_MARKERS = [
  { label: 'Dati comunicazione', re: /dati\s+comunicazione/i },
  { label: 'Analisi flusso prompt', re: /analisi\s+flusso\s+prompt/i },
]
/** Report che NON sono di esecuzione: revisione/verifica/meta non hanno «Analisi flusso prompt».
 *  Escluderli evita falsi positivi (il caso del dossier revisore 02-06-26). */
const NON_EXECUTION_REPORT = /Report-(revisione|verifica|meta|audit|analisi|dossier)/i

function readStdin() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => resolve(data))
    setTimeout(() => resolve(data), 500) // fail-open se stdin non arriva
  })
}

/** Ricava la root del workspace dallo stdin di Cursor, con fallback alla cwd. */
function resolveRoot(stdinRaw) {
  try {
    const parsed = JSON.parse(stdinRaw)
    const root =
      parsed.workspace_root || parsed.workspaceRoot || parsed.cwd || parsed.root
    if (root && typeof root === 'string') return root
  } catch {
    // stdin non-JSON o vuoto → cwd
  }
  return process.cwd()
}

/** Quante volte lo `stop` ha già auto-rilanciato in QUESTA conversazione (Cursor: parte da 0).
 *  loop_count === 0 → primo stop, possiamo rilanciare; >= 1 → siamo già nel turno rilanciato,
 *  dobbiamo tacere per non ciclare. È la guardia anti-loop (decisione Matteo: «rilancia 1 volta sola»). */
function resolveLoopCount(stdinRaw) {
  try {
    const parsed = JSON.parse(stdinRaw)
    if (typeof parsed.loop_count === 'number') return parsed.loop_count
  } catch {
    // stdin non-JSON → trattiamo come primo giro (0)
  }
  return 0
}

/** Elenca i Report-*.md sotto docs/Sessioni di lavoro modificati negli ultimi RECENT_MINUTES. */
function findRecentReports(root) {
  const base = join(root, 'docs', 'Sessioni di lavoro')
  const cutoff = Date.now() - RECENT_MINUTES * 60_000
  const out = []
  let dayDirs
  try {
    dayDirs = readdirSync(base, { withFileTypes: true })
  } catch {
    return out // cartella assente → niente da controllare
  }
  for (const day of dayDirs) {
    if (!day.isDirectory()) continue
    const dayPath = join(base, day.name)
    let files
    try {
      files = readdirSync(dayPath, { withFileTypes: true })
    } catch {
      continue
    }
    for (const f of files) {
      if (!f.isFile()) continue
      if (!/^Report-.*\.md$/i.test(f.name)) continue
      if (NON_EXECUTION_REPORT.test(f.name)) continue // revisione/verifica/meta: niente «Analisi flusso prompt»
      const full = join(dayPath, f.name)
      try {
        if (statSync(full).mtimeMs >= cutoff) out.push(full)
      } catch {
        // file sparito tra readdir e stat → ignora
      }
    }
  }
  return out
}

/** Per ogni report recente, quali marcatori obbligatori mancano. */
function auditReports(reports) {
  const findings = []
  for (const path of reports) {
    let content = ''
    try {
      content = readFileSync(path, 'utf8')
    } catch {
      continue
    }
    const missing = REQUIRED_MARKERS.filter((m) => !m.re.test(content)).map(
      (m) => m.label
    )
    if (missing.length) findings.push({ path, missing })
  }
  return findings
}

async function main() {
  const stdinRaw = await readStdin().catch(() => '')
  const root = resolveRoot(stdinRaw)
  const loopCount = resolveLoopCount(stdinRaw)

  // GUARDIA ANTI-LOOP: se siamo GIÀ nel turno rilanciato (loop_count >= 1) → tace e basta.
  // Decisione Matteo 03-06-26: «rilancia 1 volta sola, poi taci». Senza questa guardia, ogni
  // followup_message farebbe ri-scattare lo stop → loop. (Cursor ha anche un loop_limit di rete,
  // ma la nostra politica è 1 solo rilancio, non 5.)
  if (loopCount >= 1) {
    process.stdout.write(JSON.stringify({}))
    process.exit(0)
  }

  const recentReports = findRecentReports(root)
  const findings = auditReports(recentReports)

  // Caso 1: nessun report recente → silenzio (niente followup). Le chat senza report — domande
  // veloci, light — non devono ricevere il rilancio.
  if (recentReports.length === 0) {
    process.stdout.write(JSON.stringify({}))
    process.exit(0)
  }

  // Istruzione QUALITATIVA — il pezzo che l'hook non può verificare ma DEVE chiedere.
  // L'hook controlla che le sezioni ESISTANO; questo blocco rimanda alla guida unica su COME
  // riempirle (single source of truth). Risponde a Matteo 02-06-26: «la presenza non basta, serve
  // l'allineamento» + «l'hook citi un file X con tutti i dettagli su come compilare il report».
  const qualityInstruction = [
    'PRIMA DI CHIUDERE — completa il report seguendo: docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (Parte A)',
    'In particolare la SEZIONE 8 «La tua lettura della sessione» (la più saltata): impressioni',
    'lavorando con lo skill system, difficoltà+soluzioni, migliorie che suggeriresti, errori+correzioni',
    'con causa classificata. Come DATI e versione dell\'agente, NON come voto sintetico (il voto è del revisore).',
    '',
    'Verifica anche: PROMPT VERBATIM di Matteo presenti (non solo sintesi) e ALLINEAMENTO SKILL fatto',
    '(se il diff ha cambiato un layout/comportamento documentato, la skill area va aggiornata in questa',
    'chiusura — NON è una domanda da fare a Matteo: vedi CHIUSURA_SESSIONE Parte A §5 + comandi-base).',
  ]

  // Caso 2: report fresco con TUTTE le sezioni presenti → rilancia COMUNQUE 1 volta.
  // Decisione Matteo 03-06-26: ripetere la procedura anche a report completo (la presenza del
  // titolo non garantisce il contenuto). Ora via followup_message: AUTO-INVIA un turno che l'agente
  // vede e a cui RISPONDE — non più agent_message passivo che a chat chiusa nessuno legge.
  if (findings.length === 0) {
    const ok = [
      `📄 FINE-SESSIONE — ${recentReports.length} report toccato/i. Prima che la chat chiuda, RILEGGI la`,
      'procedura e verifica che le sezioni siano PIENE e allineate, non solo presenti (no aggiornamenti',
      'superficiali). Poi conferma cosa hai verificato/corretto in 2-3 righe.',
      '',
      ...qualityInstruction,
      '',
      'Se hai usato voci Liv.2 del VOCABOLARIO, segnane l\'esito (ok / domanda-superflua / corretto-da-Matteo).',
    ]
    process.stdout.write(JSON.stringify({ followup_message: ok.join('\n') }))
    process.exit(0)
  }

  // Caso 3: manca almeno una sezione obbligatoria → rilancio mirato (cosa manca) + qualità + Liv.2.
  const lines = ['⚠️ FINE-SESSIONE (skill system comunicazione) — controllo mirato sui report di oggi:', '']
  lines.push('SEZIONI OBBLIGATORIE MANCANTI (APP_CONTEXT §7.1) — completa PRIMA di chiudere e conferma:')
  for (const f of findings) {
    const rel = relative(root, f.path).split(sep).join('/')
    lines.push(`  • ${rel}`)
    lines.push(`    manca: ${f.missing.join(' · ')}`)
  }
  lines.push('')
  lines.push(...qualityInstruction)
  lines.push('')
  // Il check Liv.2 resta un promemoria: l'hook non può sapere QUALI voci sono state usate in chat.
  lines.push('Hai usato VOCI Liv.2 del VOCABOLARIO in questa chat (es. «main dell\'app», «menù originale»,')
  lines.push('«revisiona e committa»)? Segna l\'esito nel campo «Dati Liv.2»: ok / domanda-superflua / corretto-da-Matteo.')

  process.stdout.write(JSON.stringify({ followup_message: lines.join('\n') }))
  process.exit(0)
}

main()
