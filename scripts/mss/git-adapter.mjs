/** Adapter Git: HEAD, staged e worktree per il core MSS. Nessuna regola contrattuale vive qui. */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isMssRelevantPath, REPORT_PATH_RE } from './adapter.mjs'
import { CONFIG, FIXTURES_ROOT } from './config.mjs'

function git(root, args, { allowFailure = false } = {}) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (error) {
    if (allowFailure) return null
    throw error
  }
}

function show(root, spec) {
  try {
    return execFileSync('git', ['show', spec], { cwd: root, encoding: null, stdio: ['ignore', 'pipe', 'pipe'] })
  } catch {
    return null
  }
}

function worktreeContent(root, path) {
  const absolute = join(root, path)
  if (!existsSync(absolute)) return null
  try {
    return readFileSync(absolute)
  } catch {
    return null
  }
}

function batchShow(root, specs) {
  if (!specs.length) return []
  let output
  try {
    output = execFileSync('git', ['cat-file', '--batch'], {
      cwd: root,
      encoding: null,
      input: Buffer.from(`${specs.join('\n')}\n`, 'utf8'),
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 128 * 1024 * 1024,
    })
  } catch {
    return specs.map(() => null)
  }
  const contents = []
  let offset = 0
  for (let i = 0; i < specs.length; i++) {
    const newline = output.indexOf(0x0a, offset)
    if (newline < 0) {
      contents.push(null)
      continue
    }
    const header = output.subarray(offset, newline).toString('utf8')
    offset = newline + 1
    if (header.endsWith(' missing')) {
      contents.push(null)
      continue
    }
    const match = header.match(/^[0-9a-f]+\s+blob\s+(\d+)$/i)
    if (!match) {
      contents.push(null)
      continue
    }
    const size = Number(match[1])
    contents.push(output.subarray(offset, offset + size))
    offset += size
    if (output[offset] === 0x0a) offset++
  }
  return contents
}

export function collectStagedMssEntries(root) {
  const raw = git(root, ['diff', '--cached', '--name-status', '-z', '--diff-filter=ACMRD']) || ''
  const tokens = raw.split('\0').filter((token) => token !== '')
  const entries = []
  for (let index = 0; index < tokens.length;) {
    const statusToken = tokens[index++]
    const status = statusToken[0]
    let previousPath = null
    let path
    if (status === 'R' || status === 'C') {
      previousPath = tokens[index++]
      path = tokens[index++]
    } else {
      path = tokens[index++]
    }
    if (!path) continue
    if (!isMssRelevantPath(path) && !(previousPath && isMssRelevantPath(previousPath))) continue
    entries.push({
      status,
      path,
      previousPath,
      content: status === 'D' ? null : show(root, `:${path}`),
      headContent: status === 'A' ? null : show(root, `HEAD:${previousPath || path}`),
      worktreeContent: status === 'D' ? null : worktreeContent(root, path),
    })
  }
  return entries
}

/**
 * Report/Verbale MSS sporchi nel worktree ma assenti dallo stage (M-E2-B / SK-4 B2/B3).
 * Entrano nel gate pre-commit come entry sintetiche validate sul contenuto worktree.
 * Non include JSONL/fixture unstaged (residuo E2 dichiarato in matrice).
 */
export function collectUnstagedMssReportEntries(root, { excludePaths = [] } = {}) {
  const excluded = new Set([...excludePaths].map((path) => path.replace(/\\/g, '/')))
  const dirty = new Set()

  const unstagedDiff = git(root, ['diff', '--name-only', '-z', '--diff-filter=ACMR'], { allowFailure: true }) || ''
  for (const path of unstagedDiff.split('\0').filter(Boolean)) dirty.add(path.replace(/\\/g, '/'))

  const untracked = git(root, ['ls-files', '--others', '--exclude-standard', '-z'], { allowFailure: true }) || ''
  for (const path of untracked.split('\0').filter(Boolean)) dirty.add(path.replace(/\\/g, '/'))

  const entries = []
  for (const path of [...dirty].sort()) {
    if (excluded.has(path)) continue
    if (!REPORT_PATH_RE.test(path)) continue
    const wt = worktreeContent(root, path)
    if (wt == null) continue
    const inIndex = show(root, `:${path}`)
    const inHead = show(root, `HEAD:${path}`)
    entries.push({
      status: inIndex == null && inHead == null ? 'A' : 'M',
      path,
      previousPath: null,
      // Valida il worktree: è l'artefatto che altrimenti resterebbe fuori gate.
      content: wt,
      headContent: inHead,
      worktreeContent: wt,
      unstagedOnly: true,
    })
  }
  return entries
}

/** Vista pre-commit: staged MSS + Report/Verbale unstaged-only (Opzione B E2-B). */
export function collectPrecommitMssEntries(root) {
  const staged = collectStagedMssEntries(root)
  const stagedPaths = staged.map((entry) => entry.path)
  const unstagedOnly = collectUnstagedMssReportEntries(root, { excludePaths: stagedPaths })
  return [...staged, ...unstagedOnly]
}

export function collectGitHeadHistory(root) {
  const raw = git(root, [
    'ls-tree', '-r', '--name-only', '-z', 'HEAD', '--',
    CONFIG.sessionsDir,
    FIXTURES_ROOT,
  ], { allowFailure: true }) || ''
  const paths = raw
    .split('\0')
    .filter(Boolean)
    .filter((path) => isMssRelevantPath(path))
  const contents = batchShow(root, paths.map((path) => `HEAD:${path}`))
  return paths
    .map((path, index) => ({ path, content: contents[index] }))
    .filter((entry) => entry.content != null)
}
