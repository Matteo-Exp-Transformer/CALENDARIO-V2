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

  // Caso 2: report fresco presente ma TUTTE le sezioni ci sono → conferma minima, niente muro.
  // Il promemoria Liv.2 si mostra solo quando c'è già qualcosa da completare (sotto), per non
  // ripetere il muro a ogni chat con report a posto (rilievo debug 02-06-26).
  if (findings.length === 0) {
    process.stdout.write(
      JSON.stringify({
        permission: 'allow',
        agent_message: `✓ ${recentReports.length} report di oggi con le sezioni obbligatorie presenti. Se hai usato voci Liv.2 del VOCABOLARIO, ricorda di segnarne l'esito.`,
      })
    )
    process.exit(0)
  }

  // Caso 3: manca almeno una sezione obbligatoria → avviso mirato + (qui sì) promemoria Liv.2,
  // perché l'agente sta comunque per rimettere mano al report.
  const lines = ['⚠️ FINE-SESSIONE (skill system comunicazione) — controllo mirato sui report di oggi:', '']
  lines.push('SEZIONI OBBLIGATORIE MANCANTI (APP_CONTEXT §7.1) — completa prima di chiudere:')
  for (const f of findings) {
    const rel = relative(root, f.path).split(sep).join('/')
    lines.push(`  • ${rel}`)
    lines.push(`    manca: ${f.missing.join(' · ')}`)
  }
  lines.push('')
  // Il check Liv.2 resta un promemoria: l'hook non può sapere QUALI voci sono state usate in chat.
  lines.push('Già che rimetti mano al report: hai usato VOCI Liv.2 del VOCABOLARIO in questa chat')
  lines.push('(es. «main dell\'app», «menù originale», «revisiona e committa»)? Segna l\'esito nel campo')
  lines.push('«Dati Liv.2» della voce: ok / domanda-superflua / corretto-da-Matteo. È il motore di apprendimento.')

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
