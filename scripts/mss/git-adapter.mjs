/** Adapter Git: HEAD, staged e worktree per il core MSS. Nessuna regola contrattuale vive qui. */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isMssRelevantPath } from './adapter.mjs'

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

export function collectGitHeadHistory(root) {
  const raw = git(root, [
    'ls-tree', '-r', '--name-only', '-z', 'HEAD', '--',
    'docs/Sessioni di lavoro',
    'docs/MetaSkillSystem/fixtures/v0.1',
  ], { allowFailure: true }) || ''
  const paths = raw
    .split('\0')
    .filter(Boolean)
    .filter((path) =>
      /^docs\/Sessioni di lavoro\/[^/]+\/Report-.*\.md$/i.test(path) ||
      /\/eventi-light\/.+\.jsonl$/i.test(path) ||
      /^docs\/MetaSkillSystem\/fixtures\/v0\.1\//i.test(path),
    )
  const contents = batchShow(root, paths.map((path) => `HEAD:${path}`))
  return paths
    .map((path, index) => ({ path, content: contents[index] }))
    .filter((entry) => entry.content != null)
}
