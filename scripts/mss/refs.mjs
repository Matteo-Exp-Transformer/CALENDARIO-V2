import { existsSync, realpathSync } from 'node:fs'
import { isAbsolute, normalize, resolve, sep } from 'node:path'
import { LOGICAL_REF_SCHEMAS, RULE } from './rules.mjs'

/**
 * Risolve un uri_or_path rispetto alla workspace.
 * Ritorna { ok, kind, resolved?, rule?, fieldPath }.
 */
export function resolveRef(uriOrPath, { workspaceRoot, baseDir, fieldPath = 'uri_or_path' }) {
  if (uriOrPath == null || uriOrPath === '') {
    return { ok: false, kind: 'missing', rule: RULE.REF_UNRESOLVABLE, fieldPath }
  }
  const raw = String(uriOrPath)

  for (const prefix of LOGICAL_REF_SCHEMAS) {
    if (raw.startsWith(prefix)) {
      const rest = raw.slice(prefix.length)
      if (!rest) return { ok: false, kind: 'logical', rule: RULE.REF_UNRESOLVABLE, fieldPath }
      return { ok: true, kind: 'logical', resolved: raw, fieldPath }
    }
  }

  // Qualunque altro schema e qualunque path assoluto sono fuori contratto. Anche
  // un path assoluto che oggi cade dentro la root non e portabile fra workspace.
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || isAbsolute(raw)) {
    return { ok: false, kind: 'path', rule: RULE.REF_TRAVERSAL, fieldPath }
  }

  const rawSegments = raw.split(/[/\\]/)
  if (raw.includes('\0') || rawSegments.includes('..')) {
    return { ok: false, kind: 'path', rule: RULE.REF_TRAVERSAL, fieldPath }
  }

  const root = realpathSync(resolve(workspaceRoot))
  const base = baseDir ? resolve(root, baseDir) : root
  const candidate = normalize(resolve(base, raw))

  const rootWithSep = root.endsWith(sep) ? root : root + sep
  if (candidate !== root && !candidate.startsWith(rootWithSep)) {
    return { ok: false, kind: 'path', rule: RULE.REF_TRAVERSAL, fieldPath }
  }

  try {
    if (!existsSync(candidate)) {
      return { ok: false, kind: 'path', rule: RULE.REF_UNRESOLVABLE, fieldPath, resolved: candidate }
    }
    // realpath sull'intero target controlla anche ogni symlink intermedio.
    const realNorm = normalize(realpathSync(candidate))
    if (realNorm !== root && !realNorm.startsWith(rootWithSep)) {
      return { ok: false, kind: 'path', rule: RULE.REF_TRAVERSAL, fieldPath }
    }
    return { ok: true, kind: 'path', resolved: realNorm, fieldPath }
  } catch {
    return { ok: false, kind: 'path', rule: RULE.REF_UNRESOLVABLE, fieldPath }
  }
}
