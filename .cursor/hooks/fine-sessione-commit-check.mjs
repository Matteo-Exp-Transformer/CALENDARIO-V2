#!/usr/bin/env node
/**
 * Pre-commit fine-sessione.
 *
 * Scatta a ogni commit:
 * - report incompleto: blocca il commit finche Q/R non sono complete;
 * - report completo o assente dallo stage: chiede una sola volta il controllo "mente fredda" per
 *   la versione staged del commit.
 *
 * La memoria e locale e non versionata: `.fine-sessione-commit-state.json`.
 */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const REPORT_RE = /^docs\/Sessioni di lavoro\/[^/]+\/Report-.*\.md$/i
const QUESTION_RE = /^[\s>\-*]*❓\s*Q\s*(\d+)?/i
const ANSWER_RE = /^[\s>\-*]*✅\s*R\s*(\d+)?\s*:?(.*)/i
const PLACEHOLDER_RE = /^[\s\-–—_.·•]*$|^(todo|tbd|n\/?a|\.\.\.|_+)$/i

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

function isSubstantive(txt) {
  const alnum = (txt.match(/[\p{L}\p{N}]/gu) || []).length
  return alnum >= 3
}

function auditQuestions(content) {
  const lines = content.split(/\r?\n/)
  const questions = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(QUESTION_RE)
    if (m) questions.push({ idx: i, num: m[1] || String(questions.length + 1) })
  }
  if (questions.length === 0) return { hasSection: false, unanswered: [] }

  const unanswered = []
  for (let q = 0; q < questions.length; q++) {
    const start = questions[q].idx
    const end = q + 1 < questions.length ? questions[q + 1].idx : lines.length
    let answerText = null
    for (let i = start; i < end; i++) {
      const a = lines[i].match(ANSWER_RE)
      if (!a) continue
      let txt = (a[2] || '').trim()
      if (!txt) {
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

  const staged = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR'], root)
    .split(/\r?\n/)
    .map((p) => normalizePath(p.trim()))
    .filter(Boolean)
  const stagedReports = staged.filter((p) => REPORT_RE.test(p))

  if (staged.length === 0) return

  const reports = stagedReports.map((path) => {
    let content = ''
    try {
      content = git(['show', `:${path}`], root)
    } catch {
      fail(`PRE-COMMIT fine-sessione: non riesco a leggere il report staged: ${path}`)
    }
    return { path, content, ...auditQuestions(content) }
  })

  const noSection = reports.filter((r) => !r.hasSection)
  const missing = reports.filter((r) => r.hasSection && r.unanswered.length)

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
