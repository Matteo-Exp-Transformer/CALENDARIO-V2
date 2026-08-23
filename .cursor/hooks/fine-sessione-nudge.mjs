#!/usr/bin/env node
/**
 * Hook `stop` di Cursor — Nudge fine-sessione per lo skill system comunicazione.
 *
 * Controlla Q/R sul report più recente di oggi (ricorsivo in sotto-cartelle, N1). Se presente una capsula MSS, invoca lo stesso
 * core H-1 usato dalla CLI (senza sostituire il comportamento Q/R).
 *
 * LIMITE NOTO: gli hook `stop` NON girano sui Cloud Agents (solo IDE locale).
 */

import { readFileSync } from 'node:fs'
import { sep, relative } from 'node:path'
import { auditQuestions } from '../../scripts/mss/report-questions.mjs'
import { validateRecentReportFile } from '../../scripts/mss/adapter.mjs'
import { collectGitHeadHistory } from '../../scripts/mss/git-adapter.mjs'
import { detectReportMode } from '../../scripts/mss/parse.mjs'
import { findRecentReportFiles } from '../../scripts/mss/report-paths.mjs'

const EXCLUDE_REPORT = null

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
  const all = findRecentReportFiles(root)
  if (all.length === 0 || !EXCLUDE_REPORT) return all
  const path = all[0]
  const name = path.split(/[/\\]/).pop() || ''
  if (EXCLUDE_REPORT.test(name)) return []
  return [path]
}

function send(obj) {
  process.stdout.write(JSON.stringify(obj))
  process.exit(0)
}

async function main() {
  const stdinRaw = await readStdin().catch(() => '')
  const root = resolveRoot(stdinRaw)
  const loopCount = resolveLoopCount(stdinRaw)

  if (loopCount >= 3) return send({})

  const recentReports = findRecentReports(root)
  if (recentReports.length === 0) return send({})

  const reports = recentReports.map((path) => {
    let content = ''
    try {
      content = readFileSync(path, 'utf8')
    } catch {
      /* vuoto */
    }
    return { path, content, mode: detectReportMode(content), ...auditQuestions(content) }
  })

  const closureReports = reports.filter((r) => r.mode.requiresCapsule || r.hasSection)
  const missing = closureReports.filter((r) => r.hasSection && r.unanswered.length)
  const noSection = closureReports.filter((r) => !r.hasSection)

  if (missing.length || noSection.length) {
    const lines = [
      '⚠️ FINE-SESSIONE — la sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) non è completa:',
      '',
    ]
    for (const r of noSection) {
      lines.push(`  • ${relative(root, r.path).split(sep).join('/')}`)
      lines.push(
        "    manca l'INTERA sezione 11 «Domande di chiusura» (le 6 domande ❓Q + ✅R). Aggiungila e rispondi.",
      )
    }
    for (const r of missing) {
      lines.push(`  • ${relative(root, r.path).split(sep).join('/')}`)
      lines.push(
        `    risposte vuote: ${r.unanswered.join(' · ')} — compilale (no «...», no «TODO», no risposta vuota).`,
      )
    }
    lines.push('')
    lines.push(
      'Le domande sono in docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md §11 — formato `❓ Q… / ✅ R…`.',
    )
    lines.push(
      'Per Q2 (dati=diff) e Q3 (file correlati) DEVI rileggere il diff e i file prima di rispondere: è il punto.',
    )
    lines.push('Compila TUTTE le risposte mancanti, poi conferma in 1 riga che le hai scritte.')
    return send({ followup_message: lines.join('\n') })
  }

  // Q/R ok → controllo MSS sullo stesso report. L'adapter richiede la capsula soltanto se la
  // modalità standard/deep è dichiarata o se la sezione è presente; light/legacy restano fail-open.
  const mssLines = []
  let historicalSnapshots = []
  try {
    historicalSnapshots = collectGitHeadHistory(root)
  } catch {
    /* fail-open: Git history unavailable */
  }
  for (const r of reports) {
    try {
      const result = validateRecentReportFile(root, r.path, { historicalSnapshots })
      const denies = result.diagnostics.filter((d) => d.severity === 'deny')
      if (denies.length) {
        mssLines.push(`  • ${relative(root, r.path).split(sep).join('/')}`)
        for (const d of denies.slice(0, 8)) {
          mssLines.push(`    [${d.rule}] ${d.fieldPath}`)
        }
      }
    } catch {
      /* fail-open: payload illeggibile */
    }
  }
  if (mssLines.length) {
    return send({
      followup_message: [
        '⚠️ FINE-SESSIONE — Capsula MetaSkillSystem non valida (stesso motore di `npm run validate:mss`):',
        '',
        ...mssLines,
        '',
        'Correggi i field path indicati senza inserire dati personali nei messaggi di errore.',
      ].join('\n'),
    })
  }

  return send({})
}

main()
