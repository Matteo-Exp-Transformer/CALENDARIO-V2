#!/usr/bin/env node
/** Coordina la validazione dei Report-*.md e Verbale-*.md aggiunti/modificati fra due commit Git. */
import { spawnSync } from 'node:child_process'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { REPORT_PATH_RE } from './adapter.mjs'

const EMPTY_TREE_SHA = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'
const ZERO_SHA_RE = /^0+$/
const scriptDir = dirname(fileURLToPath(import.meta.url))
const cliPath = join(scriptDir, 'cli.mjs')

function parseArgs(argv) {
  const args = { base: null, head: null, repo: process.cwd() }
  for (let index = 2; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--base') args.base = argv[++index]
    else if (arg === '--head') args.head = argv[++index]
    else if (arg === '--repo') args.repo = argv[++index]
    else if (arg === '--help' || arg === '-h') args.help = true
    else throw new Error(`opzione non riconosciuta: ${arg}`)
  }
  return args
}

function runGit(repoRoot, args, { allowFailure = false } = {}) {
  const result = spawnSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (!allowFailure && result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `git ${args[0]} fallito`).trim())
  }
  return result
}

function resolveRepoRoot(repo) {
  const requested = resolve(repo)
  return runGit(requested, ['rev-parse', '--show-toplevel']).stdout.trim()
}

function commitExists(repoRoot, revision) {
  if (!revision || ZERO_SHA_RE.test(revision)) return false
  return runGit(repoRoot, ['cat-file', '-e', `${revision}^{commit}`], { allowFailure: true }).status === 0
}

function resolveBase(repoRoot, base, head) {
  if (commitExists(repoRoot, base)) return base
  const parent = runGit(repoRoot, ['rev-parse', '--verify', `${head}^`], { allowFailure: true })
  if (parent.status === 0) {
    const resolved = parent.stdout.trim()
    process.stdout.write(`[mss-ci] base non disponibile; uso il parent di head ${resolved}\n`)
    return resolved
  }
  process.stdout.write('[mss-ci] base non disponibile e head senza parent; uso l\'albero Git vuoto\n')
  return EMPTY_TREE_SHA
}

function changedReports(repoRoot, base, head) {
  const result = runGit(repoRoot, [
    'diff', '--name-only', '-z', '--diff-filter=AM', base, head, '--',
  ])
  return result.stdout
    .split('\0')
    .filter(Boolean)
    .map((path) => path.replace(/\\/g, '/'))
    .filter((path) => REPORT_PATH_RE.test(path))
    .sort()
}

function validateReport(repoRoot, reportPath) {
  const absolute = isAbsolute(reportPath) ? reportPath : join(repoRoot, reportPath)
  process.stdout.write(`[mss-ci] valido ${reportPath}\n`)
  return spawnSync(
    process.execPath,
    [cliPath, '--mode', 'file', '--file', absolute, '--kind', 'report', '--require-capsule'],
    { cwd: repoRoot, stdio: 'inherit' },
  ).status ?? 1
}

function main() {
  let args
  try {
    args = parseArgs(process.argv)
  } catch (error) {
    process.stderr.write(`[mss-ci] ${error.message}\n`)
    process.exit(2)
  }
  if (args.help || !args.base || !args.head) {
    process.stdout.write(
      'Uso: node scripts/mss/validate-changed-reports.mjs --base <sha> --head <sha> [--repo <path>]\n',
    )
    process.exit(args.help ? 0 : 2)
  }

  try {
    const repoRoot = resolveRepoRoot(args.repo)
    if (!commitExists(repoRoot, args.head)) throw new Error(`head Git non valido: ${args.head}`)
    const base = resolveBase(repoRoot, args.base, args.head)
    const reports = changedReports(repoRoot, base, args.head)
    if (!reports.length) {
      process.stdout.write(
        `[mss-ci] OK: nessun Report-*.md o Verbale-*.md aggiunto o modificato fra ${base} e ${args.head}\n`,
      )
      process.exit(0)
    }

    process.stdout.write(
      `[mss-ci] ${reports.length} Report-*.md o Verbale-*.md aggiunti/modificati fra ${base} e ${args.head}\n`,
    )
    let failures = 0
    for (const report of reports) {
      if (validateReport(repoRoot, report) !== 0) failures++
    }
    if (failures) {
      process.stderr.write(`[mss-ci] ROSSO: ${failures}/${reports.length} report MSS non validi\n`)
      process.exit(1)
    }
    process.stdout.write(`[mss-ci] OK: ${reports.length}/${reports.length} report MSS validi\n`)
  } catch (error) {
    process.stderr.write(`[mss-ci] ${error.message}\n`)
    process.exit(2)
  }
}

main()
