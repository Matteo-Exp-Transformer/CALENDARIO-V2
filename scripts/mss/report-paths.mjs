/**
 * Percorsi report/verbale — owner unico per discovery su disco (D18).
 * Usato dagli hook stop Cursor/Claude; regex da adapter.mjs.
 */
import { readFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { REPORT_PATH_RE } from './adapter.mjs'
import { CONFIG, buildSessionSubpathRe } from './config.mjs'
import { detectReportMode } from './parse.mjs'
import { auditQuestions } from './report-questions.mjs'

const SESSION_SUBPATH_RE = buildSessionSubpathRe(CONFIG)

export function todaySessionFolder(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yy = String(date.getFullYear()).slice(-2)
  return `${dd}-${mm}-${yy}`
}

/** Segmenti sotto `<day>/` che iniziano con `_` = prove SK-4 / audit, non chiusura sessione. */
export function isStopHookProbePath(rel) {
  const normalized = rel.replace(/\\/g, '/')
  const m = normalized.match(SESSION_SUBPATH_RE)
  if (!m) return false
  return m[1].split('/').some((seg) => seg.startsWith('_'))
}

function walkReportPaths(dir, root, out) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkReportPaths(full, root, out)
      continue
    }
    if (!entry.isFile()) continue
    const rel = relative(root, full).replace(/\\/g, '/')
    if (!REPORT_PATH_RE.test(rel) || isStopHookProbePath(rel)) continue
    out.push(full)
  }
}

function isClosureCandidate(content) {
  const mode = detectReportMode(content)
  const { hasSection } = auditQuestions(content)
  return mode.requiresCapsule || mode.mode === 'light' || hasSection
}

/**
 * Report/Verbale freschi di OGGI, ricorsivo ma esclusi path probe (`_prova-*`, …).
 * Tra i candidati recenti restituisce al più UN path: il più recente che sembra un
 * report di chiusura (modalità standard/deep/invalid **oppure** sezione Q/R presente).
 * Fixture MSS/CLI senza modalità né Q/R non competono — evita falsi allarme stop-hook.
 */
export function findRecentReportFiles(root, { recentMinutes = 20, now = Date.now() } = {}) {
  const dayPath = join(root, ...CONFIG.sessionsDir.split('/'), todaySessionFolder(new Date(now)))
  const cutoff = now - recentMinutes * 60_000
  const paths = []
  walkReportPaths(dayPath, root, paths)
  const recent = []
  for (const full of paths) {
    try {
      const mtimeMs = statSync(full).mtimeMs
      if (mtimeMs >= cutoff) recent.push({ full, mtimeMs })
    } catch {
      /* sparito */
    }
  }
  if (recent.length === 0) return []
  recent.sort((a, b) => b.mtimeMs - a.mtimeMs)
  for (const { full } of recent) {
    let content = ''
    try {
      content = readFileSync(full, 'utf8')
    } catch {
      continue
    }
    if (isClosureCandidate(content)) return [full]
  }
  return []
}
