/**
 * Parser e perimetro dei path «vivi» nei docs — owner unico (D18).
 * Usato da `check-doc-paths.mjs` (validate:docs) e da `mss:move`.
 * Non ha side-effect: non scrive e non esce.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

/** Cartelle top-level sotto docs/ escluse dalla scansione «vivi». */
export const EXCLUDED_DOCS_DIRS = Object.freeze([
  'Sessioni di lavoro',
  '_lavoro',
  'Archivio',
  'Archives',
])

/** Marcatore di materiale copiato da un'altra repo (`mss:export`). */
export const VENDOR_MARKER = '.mss-vendored'

export const URL_OR_ANCHOR = /^(https?:|mailto:|tel:|ftp:|data:|#|\/\/)/i
export const REPO_FILE_EXT = /\.(md|mjs|js|ts|tsx|jsx|json|sql|ya?ml|sh|mdc|css|html|toml|env)$/i
export const REPO_PREFIX = /^(docs|scripts|src|supabase|tests|e2e|public|\.github|\.cursor)\//i
export const ALLOWED_LEGACY_TARGET = /(^|\/)(Sessioni di lavoro|Archivio)\//

const MD_LINK = /\[[^\]]*?\]\(([^)]+)\)/g
const INLINE_CODE = /`([^`\n]+)`/g
const BARE_PATH =
  /(?<![\w./`([])((?:docs|scripts|src|supabase|tests|e2e|public|\.github|\.cursor)\/[^\s)`'"<>|]+?\.(?:md|mjs|js|ts|tsx|jsx|json|sql|ya?ml|sh|mdc|css|html|toml|env))/gi

export const toPosix = (p) => String(p).split('\\').join('/')

export function relFromRepo(repoRoot, absPath) {
  return toPosix(relative(repoRoot, absPath))
}

export function cleanRef(raw) {
  let p = String(raw).trim()
  p = p.replace(/\s+["'].*$/, '').trim()
  p = p.split(/\s+/)[0]
  p = p.split('#')[0].split('?')[0]
  p = p.replace(/\\/g, '/')
  try {
    p = decodeURIComponent(p)
  } catch {
    /* lascia il path com'è se non è percent-encoding valido */
  }
  return p
}

/**
 * @param {'link'|'inline'} kind
 */
export function isCheckableTarget(rawClean, kind) {
  if (!rawClean) return false
  if (URL_OR_ANCHOR.test(rawClean)) return false
  if (/[*<>{}]/.test(rawClean)) return false
  if (!REPO_FILE_EXT.test(rawClean)) return false
  if (kind === 'inline') {
    const isRepoRel = REPO_PREFIX.test(rawClean)
    const isExplicitRel = /^\.{0,2}\//.test(rawClean)
    if (!isRepoRel && !isExplicitRel) return false
  }
  return true
}

/**
 * Candidati assoluti di un riferimento già pulito.
 * Canonica = prima voce (usata nei messaggi d'errore).
 */
export function resolveCandidates(p, fileAbs, kind, repoRoot) {
  if (p.startsWith('/')) {
    return [join(repoRoot, p.slice(1))]
  }
  const fromRepoRoot = join(repoRoot, p)
  const fromFileDir = resolve(dirname(fileAbs), p)
  if (REPO_PREFIX.test(p)) {
    return kind === 'link' ? [fromRepoRoot, fromFileDir] : [fromRepoRoot]
  }
  return [fromFileDir]
}

/** Estrae riferimenti locali da markdown (salta fenced code). */
export function extractRefs(content) {
  const refs = []
  const lines = content.split(/\r?\n/)
  let inFence = false
  let fenceMarker = ''

  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    const fenceMatch = line.match(/^\s*(```+|~~~+)/)
    if (fenceMatch) {
      const marker = fenceMatch[1][0]
      if (!inFence) {
        inFence = true
        fenceMarker = marker
      } else if (marker === fenceMarker) {
        inFence = false
        fenceMarker = ''
      }
      return
    }
    if (inFence) return

    let m
    MD_LINK.lastIndex = 0
    while ((m = MD_LINK.exec(line)) !== null) {
      refs.push({ raw: m[1], line: lineNo, kind: 'link' })
    }
    INLINE_CODE.lastIndex = 0
    while ((m = INLINE_CODE.exec(line)) !== null) {
      refs.push({ raw: m[1], line: lineNo, kind: 'inline' })
    }
    BARE_PATH.lastIndex = 0
    while ((m = BARE_PATH.exec(line)) !== null) {
      refs.push({ raw: m[1], line: lineNo, kind: 'inline' })
    }
  })
  return refs
}

/** Raccolta ricorsiva dei .md vivi sotto docs/. */
export function collectLiveDocs(docsRoot, { excludedDirs = EXCLUDED_DOCS_DIRS, vendorMarker = VENDOR_MARKER } = {}) {
  const out = []
  if (!existsSync(docsRoot)) return out
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) {
        const relToDocs = toPosix(abs).slice(toPosix(docsRoot).length + 1)
        const topSegment = relToDocs.split('/')[0]
        if (excludedDirs.includes(topSegment)) continue
        if (existsSync(join(abs, vendorMarker))) continue
        walk(abs)
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        out.push(abs)
      }
    }
  }
  walk(docsRoot)
  return out
}

/**
 * True se almeno una candidata del riferimento punta al file bersaglio.
 */
export function refPointsTo(cleaned, kind, fileAbs, targetAbs, repoRoot) {
  const candidates = resolveCandidates(cleaned, fileAbs, kind, repoRoot)
  const targetNorm = toPosix(resolve(targetAbs)).toLowerCase()
  return candidates.some((c) => toPosix(resolve(c)).toLowerCase() === targetNorm)
}

/**
 * Riscrive un pezzo di testo grezzo del riferimento verso il nuovo path,
 * preservando stile relativo vs repo-relative quando possibile.
 */
export function rewriteRefRaw(raw, fromAbs, toAbs, fileAbs, repoRoot) {
  const cleaned = cleanRef(raw)
  const fragmentMatch = String(raw).match(/([#?].*)$/)
  const suffix = fragmentMatch ? fragmentMatch[1].split(/\s+["']/)[0] : ''
  const titleMatch = String(raw).match(/(\s+["'].*)$/)
  const title = titleMatch ? titleMatch[1] : ''

  let replacement
  if (REPO_PREFIX.test(cleaned) || cleaned.startsWith('/')) {
    const rel = relFromRepo(repoRoot, toAbs)
    replacement = cleaned.startsWith('/') ? `/${rel}` : rel
  } else {
    let rel = toPosix(relative(dirname(fileAbs), toAbs))
    if (!rel.startsWith('.')) rel = `./${rel}`
    replacement = rel
  }

  // preserva percent-encoding solo se il grezzo lo usava già
  if (/%[0-9A-Fa-f]{2}/.test(raw) && replacement.includes(' ')) {
    replacement = replacement.split('/').map((seg) => encodeURIComponent(seg)).join('/')
  }

  return `${replacement}${suffix}${title}`
}

/**
 * Trova file vivi che citano `fromAbs` e prepara i contenuti aggiornati verso `toAbs`.
 * Non scrive.
 */
export function planLiveDocRewrites(repoRoot, fromAbs, toAbs, { docsRoot = join(repoRoot, 'docs') } = {}) {
  const updates = []
  const fromRel = relFromRepo(repoRoot, fromAbs)
  for (const fileAbs of collectLiveDocs(docsRoot)) {
    if (toPosix(resolve(fileAbs)).toLowerCase() === toPosix(resolve(fromAbs)).toLowerCase()) continue
    const before = readFileSync(fileAbs, 'utf8')
    const refs = extractRefs(before)
    let after = before
    const hits = []
    // sostituisci dal grezzo più lungo al più corto per evitare overlap parziali
    const ordered = [...refs].sort((a, b) => b.raw.length - a.raw.length)
    for (const { raw, line, kind } of ordered) {
      const cleaned = cleanRef(raw)
      if (!isCheckableTarget(cleaned, kind)) continue
      if (!refPointsTo(cleaned, kind, fileAbs, fromAbs, repoRoot)) continue
      const nextRaw = rewriteRefRaw(raw, fromAbs, toAbs, fileAbs, repoRoot)
      if (nextRaw === raw) continue
      const needle = kind === 'link' ? `](${raw})` : raw
      const repl = kind === 'link' ? `](${nextRaw})` : nextRaw
      if (!after.includes(needle) && kind === 'link') {
        // fallback: solo il target fra parentesi
        if (!after.includes(raw)) {
          return {
            ok: false,
            error: `riferimento non riscrivibile in ${relFromRepo(repoRoot, fileAbs)}:${line} → ${fromRel}`,
          }
        }
        after = after.replaceAll(raw, nextRaw)
      } else {
        if (!after.includes(needle)) {
          return {
            ok: false,
            error: `riferimento non riscrivibile in ${relFromRepo(repoRoot, fileAbs)}:${line} → ${fromRel}`,
          }
        }
        after = after.replaceAll(needle, repl)
      }
      hits.push({ line, from: cleaned, to: cleanRef(nextRaw) })
    }
    if (after !== before) {
      updates.push({
        file: relFromRepo(repoRoot, fileAbs),
        abs: fileAbs,
        before,
        after,
        hits,
      })
    }
  }
  return { ok: true, updates }
}

/**
 * Piano per stringhe path repo-relative in script / package.json (import e citazioni).
 */
export function planScriptPathRewrites(repoRoot, fromRel, toRel, { roots = ['scripts'] } = {}) {
  const updates = []
  const fromPosix = toPosix(fromRel)
  const toPosixPath = toPosix(toRel)
  if (fromPosix === toPosixPath) return { ok: true, updates }

  const files = []
  for (const rootRel of roots) {
    const absRoot = join(repoRoot, rootRel)
    if (!existsSync(absRoot)) continue
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const abs = join(dir, entry.name)
        if (entry.isDirectory()) {
          // L5 freeze: non riscriviamo sotto scripts/mss come «bersaglio di move»,
          // ma aggiornare *citazioni* verso un file docs spostato sì.
          walk(abs)
        } else if (entry.isFile() && /\.(mjs|js|cjs|json)$/i.test(entry.name)) {
          files.push(abs)
        }
      }
    }
    walk(absRoot)
  }

  const packageJson = join(repoRoot, 'package.json')
  if (existsSync(packageJson)) files.push(packageJson)

  for (const abs of files) {
    const before = readFileSync(abs, 'utf8')
    if (!before.includes(fromPosix)) continue
    const after = before.split(fromPosix).join(toPosixPath)
    if (after === before) continue
    updates.push({
      file: relFromRepo(repoRoot, abs),
      abs,
      before,
      after,
      hits: [{ line: 0, from: fromPosix, to: toPosixPath }],
    })
  }
  return { ok: true, updates }
}

/** Esiste come file (non directory). */
export function isExistingFile(abs) {
  try {
    return existsSync(abs) && statSync(abs).isFile()
  } catch {
    return false
  }
}
