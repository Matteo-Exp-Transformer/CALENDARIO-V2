#!/usr/bin/env node
/**
 * CLI MetaSkillSystem validator H-1.
 * Usage:
 *   node scripts/mss/cli.mjs --mode file --file path [--json]
 *   node scripts/mss/cli.mjs --mode worktree --file path [--kind report|jsonl|session_log]
 *   node scripts/mss/cli.mjs --mode staged --file path [--kind ...]
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { formatHuman } from './core.mjs'
import { validatePathContent, validateStagedMssFiles } from './adapter.mjs'
import { collectGitHeadHistory, collectStagedMssEntries } from './git-adapter.mjs'

function parseArgs(argv) {
  const out = { mode: 'file', json: false, kind: null, file: null, requireCapsule: false }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--json') out.json = true
    else if (a === '--require-capsule') out.requireCapsule = true
    else if (a === '--mode') out.mode = argv[++i]
    else if (a === '--file') out.file = argv[++i]
    else if (a === '--kind') out.kind = argv[++i]
    else if (a === '--help' || a === '-h') out.help = true
  }
  return out
}

function detectKind(file, explicit) {
  if (explicit) return explicit
  if (!file) return 'jsonl'
  if (file.endsWith('.jsonl')) return 'jsonl'
  if (/SESSION_LOG\.md$/i.test(file)) return 'session_log'
  if (/\.md$/i.test(file)) return 'report'
  return 'jsonl'
}

function gitShow(path) {
  return execFileSync('git', ['show', `:${path.replace(/\\/g, '/')}`], {
    encoding: null,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function main() {
  const args = parseArgs(process.argv)
  if (args.help || !args.file) {
    process.stdout.write(
      'Usage: npm run validate:mss -- --mode file|worktree|staged --file <path> [--kind report|jsonl|session_log] [--require-capsule] [--json]\n',
    )
    process.exit(args.help ? 0 : 2)
  }

  const workspaceRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
  }).trim()
  const file = resolve(args.file)
  const kind = detectKind(file, args.kind)
  const rel = file.replace(/\\/g, '/').startsWith(workspaceRoot.replace(/\\/g, '/'))
    ? file.slice(workspaceRoot.length).replace(/^[/\\]/, '').replace(/\\/g, '/')
    : args.file.replace(/\\/g, '/')

  let content
  let stagedContent
  let worktreeContent
  if (args.mode === 'staged') {
    try {
      stagedContent = gitShow(rel)
    } catch {
      stagedContent = null
    }
    try {
      worktreeContent = readFileSync(file, 'utf8')
    } catch {
      worktreeContent = null
    }
    content = stagedContent
  } else {
    content = readFileSync(file)
    worktreeContent = content
  }

  const input = {
    kind,
    file,
    content,
    workspaceRoot,
    requireCapsule: args.requireCapsule,
    stagedContent,
    worktreeContent: args.mode === 'staged' ? worktreeContent : undefined,
  }
  const historicalSnapshots = collectGitHeadHistory(workspaceRoot)
  let result
  if (args.mode === 'staged') {
    // Snapshot staged completo (parità pre-commit): non filtrare la vista al solo --file.
    const entries = collectStagedMssEntries(workspaceRoot)
    const results = validateStagedMssFiles(workspaceRoot, entries, { historicalSnapshots })
    const focused = results.filter(
      (entry) => entry.path === rel || entry.previousPath === rel,
    )
    const selected = focused.length ? focused : results
    const diagnostics = selected.flatMap((entry) => entry.result?.diagnostics || [])
    const denies = diagnostics.filter((d) => d.severity === 'deny')
    const warns = diagnostics.filter((d) => d.severity === 'warn')
    result = {
      ok: denies.length === 0,
      diagnostics,
      codes: diagnostics.map((d) => d.rule),
      denyCodes: denies.map((d) => d.rule),
      warnCodes: warns.map((d) => d.rule),
      summary: { deny: denies.length, warn: warns.length, bundles: 0 },
    }
  } else {
    result = validatePathContent({ ...input, historicalSnapshots })
  }

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
  } else {
    process.stdout.write(`${formatHuman(result)}\n`)
  }
  process.exit(result.ok ? 0 : 1)
}

main()
