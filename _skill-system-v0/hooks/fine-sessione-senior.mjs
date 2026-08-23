#!/usr/bin/env node
/**
 * Hook `Stop` di Claude Code — Nudge fine-sessione (gemello di `.cursor/hooks/fine-sessione-nudge.mjs`).
 *
 * v6 (23-08-26) — allineato al gemello Cursor; discovery ricorsiva (N1) via `report-paths.mjs`.
 *   - Q/R via `report-questions.mjs` (D18)
 *   - Q/R incomplete → blocca (CASO A)
 *   - Q/R ok → `validateRecentReportFile` (stesso motore di `npm run validate:mss`)
 *   - capsula deny → blocca con field path
 *   - Q/R ok + validatore verde → silenzio (niente blocco «mente fredda» duplicato su Q2/Q3/§12)
 *
 * DIFFERENZE da Cursor (sintassi piattaforma):
 *  - guardia anti-loop: `stop_hook_active` (bool)
 *  - output: `{"decision":"block","reason":"…"}` · `{}` / exit 0 = lascia chiudere
 */

import { readFileSync } from 'node:fs'
import { sep, relative } from 'node:path'
import { auditQuestions } from '../../scripts/mss/report-questions.mjs'
import { validateRecentReportFile } from '../../scripts/mss/adapter.mjs'
import { collectGitHeadHistory } from '../../scripts/mss/git-adapter.mjs'
import { detectReportMode } from '../../scripts/mss/parse.mjs'
import { findRecentReportFiles } from '../../scripts/mss/report-paths.mjs'

function readStdin() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (c) => (data += c))
    process.stdin.on('end', () => resolve(data))
    setTimeout(() => resolve(data), 500)
  })
}

function parseInput(stdinRaw) {
  try {
    const p = JSON.parse(stdinRaw)
    return {
      root: typeof p.cwd === 'string' ? p.cwd : process.cwd(),
      alreadyActive: p.stop_hook_active === true,
    }
  } catch {
    return { root: process.cwd(), alreadyActive: false }
  }
}

function findRecentReports(root) {
  return findRecentReportFiles(root)
}

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }))
  process.exit(0)
}
function pass() {
  process.exit(0)
}

async function main() {
  const stdinRaw = await readStdin().catch(() => '')
  const { root, alreadyActive } = parseInput(stdinRaw)

  if (alreadyActive) pass()

  const recentReports = findRecentReports(root)
  if (recentReports.length === 0) pass()

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
    const lines = ['⚠️ FINE-SESSIONE SENIOR — sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) incompleta:', '']
    for (const r of noSection) {
      lines.push(`  • ${relative(root, r.path).split(sep).join('/')}`)
      lines.push('    manca l\'INTERA sezione 11 (6 domande ❓Q + ✅R). Aggiungila e rispondi.')
    }
    for (const r of missing) {
      lines.push(`  • ${relative(root, r.path).split(sep).join('/')}`)
      lines.push(`    risposte vuote: ${r.unanswered.join(' · ')} — compilale (no «...», no «TODO», no vuoto).`)
    }
    lines.push('')
    lines.push('Domande in docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md §11 — formato `❓ Q… / ✅ R…`.')
    lines.push('Per Q2 (dati=diff) e Q3 (file correlati) DEVI rileggere diff e file prima di rispondere.')
    lines.push('Compila le risposte mancanti, poi conferma in 1 riga.')
    block(lines.join('\n'))
  }

  let historicalSnapshots = []
  try {
    historicalSnapshots = collectGitHeadHistory(root)
  } catch {
    /* fail-open */
  }

  const mssLines = []
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
      /* fail-open */
    }
  }

  if (mssLines.length) {
    block(
      [
        '⚠️ FINE-SESSIONE SENIOR — Capsula MetaSkillSystem non valida (stesso motore di `npm run validate:mss`):',
        '',
        ...mssLines,
        '',
        'Correggi i field path indicati senza inserire dati personali nei messaggi di errore.',
      ].join('\n'),
    )
  }

  pass()
}

main()
