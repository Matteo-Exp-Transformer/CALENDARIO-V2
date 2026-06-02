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
 * ci sono davvero. Così l'avviso è SPECIFICO («il report X non ha Dati comunicazione») e contabile,
 * non generico. Decisione Matteo 02-06-26: **smart-allow** — avvisa in modo mirato ma NON blocca
 * (permission: allow). Niente rischio di falsi positivi che bloccano una chat legittima. Se in futuro
 * l'avviso mirato non basta, il salto a `deny` sui soli casi certi è già predisposto sotto (vedi NOTA).
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
 *  Stretta apposta: solo i file appena scritti dall'agente di QUESTA chat, per non
 *  allarmare su report di sessioni precedenti ancora «freschi» su disco. */
const RECENT_MINUTES = 10
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

  const recentReports = findRecentReports(root)
  const findings = auditReports(recentReports)

  // Caso 1: nessun report recente → silenzio. Niente muro di testo a ogni micro-chat.
  // (Le chat senza report — domande veloci, light — non devono ricevere il nudge.)
  if (recentReports.length === 0) {
    process.stdout.write(JSON.stringify({ permission: 'allow' }))
    process.exit(0)
  }

  // Istruzione QUALITATIVA — il pezzo che l'hook non può verificare ma DEVE chiedere.
  // L'hook controlla che le sezioni ESISTANO; questo blocco chiede all'agente di RIEMPIRLE col
  // contenuto che conta di più per lo skill system: la sua lettura del lavoro, non solo il "cosa".
  // Risponde all'osservazione di Matteo 02-06-26: «la presenza non basta, serve l'allineamento».
  const qualityInstruction = [
    'PRIMA DI CHIUDERE — il report deve contenere la TUA lettura della sessione (non solo cosa hai fatto):',
    '  1. Impressioni dell\'agente: cosa ha funzionato bene e cosa no LAVORANDO con lo skill system',
    '     (prompt chiari? skill giuste caricate? procedura scorrevole o macchinosa?).',
    '  2. Difficoltà incontrate + come le hai risolte (anche piccole — sono dati per migliorare il sistema).',
    '  3. Migliorie che TU suggeriresti (allo skill system, ai prompt, al processo) — come dato, non come modifica.',
    '  4. Errori e correzioni: cosa è andato storto, da cosa derivava, come si sarebbe evitato',
    '     (classifica la causa: bug preesistente / prompt ambiguo / errore agente / vincolo strutturale).',
    'Scrivilo come DATI e versione dell\'agente, NON come voto sintetico (il voto lo dà il revisore).',
  ]

  // Caso 2: report fresco presente ma TUTTE le sezioni ci sono → conferma + istruzione qualitativa.
  // Le sezioni "esistono" ma potrebbero essere vuote/sbrigative: l'agente va comunque stimolato a
  // riempirle con la sua lettura (la presenza del titolo non garantisce il contenuto).
  if (findings.length === 0) {
    const ok = [
      `✓ ${recentReports.length} report di oggi: sezioni obbligatorie presenti.`,
      '',
      ...qualityInstruction,
      '',
      'Se hai usato voci Liv.2 del VOCABOLARIO, segnane l\'esito (ok / domanda-superflua / corretto-da-Matteo).',
    ]
    process.stdout.write(
      JSON.stringify({ permission: 'allow', agent_message: ok.join('\n') })
    )
    process.exit(0)
  }

  // Caso 3: manca almeno una sezione obbligatoria → avviso mirato + istruzione qualitativa + Liv.2.
  const lines = ['⚠️ FINE-SESSIONE (skill system comunicazione) — controllo mirato sui report di oggi:', '']
  lines.push('SEZIONI OBBLIGATORIE MANCANTI (APP_CONTEXT §7.1) — completa prima di chiudere:')
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

  // NOTA salto futuro a enforcement vero: per bloccare i casi CERTI, sostituire 'allow' con 'deny'
  // SOLO quando findings.length > 0 (report esiste ma manca l'intestazione obbligatoria) e aggiungere
  // un campo agent_message con l'istruzione. I casi Liv.2 NON vanno mai a deny (falsi positivi).
  process.stdout.write(
    JSON.stringify({
      permission: 'allow',
      agent_message: lines.join('\n'),
    })
  )
  process.exit(0)
}

main()
