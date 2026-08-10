#!/usr/bin/env node
/**
 * Pre-commit fine-sessione + validator MSS H-1 sullo staged.
 *
 * - report incompleto: blocca
 * - artefatti MSS staged invalidi: blocca (deny)
 * - mente fredda una volta per signature staged
 */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { auditQuestions } from '../../scripts/mss/report-questions.mjs'
import { validateStagedMssFiles } from '../../scripts/mss/adapter.mjs'
import { collectGitHeadHistory, collectStagedMssEntries } from '../../scripts/mss/git-adapter.mjs'
import { detectReportMode } from '../../scripts/mss/parse.mjs'

const REPORT_RE = /^docs\/Sessioni di lavoro\/[^/]+\/Report-.*\.md$/i

function git(args, cwd = process.cwd()) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function hash(txt) {
  return createHash('sha256').update(txt).digest('hex')
}

function normalizePath(path) {
  return path.replace(/\\/g, '/')
}

function readState(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return { reviewedSignatures: [] }
  }
}

function writeState(path, state) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

function main() {
  let root = process.cwd()
  try {
    root = git(['rev-parse', '--show-toplevel']).trim()
  } catch {
    return
  }

  const staged = git(['diff', '--cached', '--name-only', '--diff-filter=ACMRD'], root)
    .split(/\r?\n/)
    .map((p) => normalizePath(p.trim()))
    .filter(Boolean)

  if (staged.length === 0) return

  const stagedReports = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR'], root)
    .split(/\r?\n/)
    .map((p) => normalizePath(p.trim()))
    .filter((p) => p && REPORT_RE.test(p))
  const reports = stagedReports.map((path) => {
    let content = ''
    try {
      content = git(['show', `:${path}`], root)
    } catch {
      fail(`PRE-COMMIT fine-sessione: non riesco a leggere il report staged: ${path}`)
    }
    return { path, content, mode: detectReportMode(content), ...auditQuestions(content) }
  })

  const closureReports = reports.filter((r) => r.mode.requiresCapsule || r.hasSection)
  const noSection = closureReports.filter((r) => !r.hasSection)
  const missing = closureReports.filter((r) => r.hasSection && r.unanswered.length)

  if (noSection.length || missing.length) {
    const lines = ['PRE-COMMIT fine-sessione: report incompleto, commit bloccato.', '']
    for (const r of noSection) {
      lines.push(`- ${r.path}`)
      lines.push('  manca la sezione "Domande di chiusura" con le 6 righe Q/R.')
    }
    for (const r of missing) {
      lines.push(`- ${r.path}`)
      lines.push(`  risposte vuote: ${r.unanswered.join(', ')}`)
    }
    lines.push('')
    lines.push('Completa il report, fai git add del file aggiornato e rilancia il commit.')
    fail(lines.join('\n'))
  }

  const mssEntries = collectStagedMssEntries(root)

  if (mssEntries.length) {
    const historicalSnapshots = collectGitHeadHistory(root)
    const results = validateStagedMssFiles(root, mssEntries, { historicalSnapshots })
    const denyLines = []
    for (const { path, result } of results) {
      const denies = result.diagnostics.filter((d) => d.severity === 'deny')
      if (!denies.length) continue
      denyLines.push(`- ${path}`)
      for (const d of denies.slice(0, 12)) {
        denyLines.push(`  [${d.rule}] ${d.fieldPath}`)
      }
    }
    if (denyLines.length) {
      fail(
        [
          'PRE-COMMIT MSS: artefatti MetaSkillSystem staged non validi (blocco pubblicazione, non edit).',
          '',
          ...denyLines,
          '',
          'Correggi, git add, rilancia. Motore: npm run validate:mss',
        ].join('\n'),
      )
    }
  }

  const stagedSignature = git(['diff', '--cached', '--binary'], root)
  const signature = hash(stagedSignature)

  const statePath = join(root, '.cursor', 'hooks', '.fine-sessione-commit-state.json')
  const state = readState(statePath)
  const reviewed = Array.isArray(state.reviewedSignatures) ? state.reviewedSignatures : []

  if (reviewed.includes(signature)) return

  reviewed.push(signature)
  const nextState = {
    reviewedSignatures: reviewed.slice(-50),
    lastPromptedAt: new Date().toISOString(),
    lastReports: reports.map((r) => r.path),
    lastStagedFiles: staged,
  }
  writeState(statePath, nextState)

  const lines = [
    'PRE-COMMIT fine-sessione: ultimo controllo a mente fredda richiesto.',
    '',
    'Prima di committare verifica:',
    '- il report della sessione esiste quando il lavoro e standard/deep;',
    '- i dati del report corrispondono al diff reale;',
    '- i file correlati/skill sono allineati;',
    '- Q1-Q6 sono coerenti con il lavoro svolto;',
    '- se non hai staged report, e una scelta voluta: light task, commit solo codice, o report gia committato separatamente.',
    '',
    'Ho registrato questa versione staged: dopo la revisione, rilancia lo stesso git commit.',
    'Se cambi lo stage, il controllo verra richiesto di nuovo per la nuova versione.',
  ]
  fail(lines.join('\n'))
}

main()
