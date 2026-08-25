import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { decodeUtf8 } from './canonical.mjs'
import { resolveRef } from './refs.mjs'
import { RULE } from './rules.mjs'

const CAPSULE_HEADING_RE = /^#{1,6}\s+(?:\d+(?:-bis)?[.)]?\s+)?Capsula MetaSkillSystem\s*$/gim
const ANY_HEADING_RE = /^#{1,6}\s+/m
const JSONL_FENCE_RE = /```jsonl\s*\r?\n([\s\S]*?)```/gi
const MARKDOWN_JSONL_LINK_RE = /\[([^\]]*)\]\(([^)]+\.jsonl(?:#[^)]*)?)\)/gi
const EVENT_ID_RE = /`?event:(mss-evt-[a-zA-Z0-9-]+)`?/gi
const HISTORICAL_MODE_EXCEPTION = Object.freeze({
  path: 'docs/Sessioni di lavoro/09-08-26/Report-ciclo-metaskillsystem-v0-avvio-e-cattura-09-08-26.md',
  sha256: 'dc0f2cdb92627cf5cec757188178aa33d0ea8b35cd527c35d29126cd721b08a0',
})

function normalizedWorkspacePath(file, workspaceRoot) {
  if (!file || /^<.*>$/.test(String(file))) return null
  const root = resolve(workspaceRoot || process.cwd())
  const absolute = isAbsolute(file) ? resolve(file) : resolve(root, file)
  const rel = relative(root, absolute).replace(/\\/g, '/')
  return rel && !rel.startsWith('../') ? rel : null
}

function allowsHistoricalMode(markdown, { file, workspaceRoot } = {}) {
  if (normalizedWorkspacePath(file, workspaceRoot) !== HISTORICAL_MODE_EXCEPTION.path) return false
  const digest = createHash('sha256').update(String(markdown), 'utf8').digest('hex')
  return digest === HISTORICAL_MODE_EXCEPTION.sha256
}

export function detectReportMode(markdown, context = {}) {
  if (allowsHistoricalMode(markdown, context)) {
    return {
      mode: 'deep',
      declarations: [{ value: 'Meta/deep, esecuzione documentale', mode: 'deep', historical: true }],
      requiresCapsule: false,
      historical: true,
    }
  }
  const declarations = []
  const visible = String(markdown).replace(/<!--[\s\S]*?-->/g, '')
  let fence = null
  for (const rawLine of visible.split(/\r?\n/)) {
    const fenceMatch = rawLine.match(/^\s*(```|~~~)/)
    if (fenceMatch) {
      fence = fence ? null : fenceMatch[1]
      continue
    }
    if (fence) continue

    const line = rawLine.replace(/^\s*>\s?/, '').replace(/^\s*[-*+]\s+/, '').trim()
    for (const rawSegment of line.split(/\s+·\s+|\|/)) {
      const segment = rawSegment.trim()
      if (!segment) continue
      const candidate = /^\*\*Modalit[aà](?::)?\*\*/i.test(segment) || /^Modalit[aà]\s*:/i.test(segment)
      if (!candidate) continue
      const match = segment.match(/^(?:\*\*Modalit[aà]:\*\*|\*\*Modalit[aà]\*\*\s*:|Modalit[aà]\s*:)\s*(.*?)\s*$/i)
      const value = match?.[1]?.trim() || ''
      let mode = 'invalid'
      if (/^light$/i.test(value)) mode = 'light'
      else if (/^standard$/i.test(value)) mode = 'standard'
      else if (/^deep$/i.test(value) || /^meta\s*\/\s*deep$/i.test(value)) mode = 'deep'
      declarations.push({ value, mode })
    }
  }
  const modes = new Set(declarations.map((d) => d.mode))
  const mode = declarations.length === 0
    ? 'undeclared'
    : declarations.length === 1 && modes.size === 1
      ? [...modes][0]
      : 'invalid'
  return {
    mode,
    declarations,
    requiresCapsule: mode === 'standard' || mode === 'deep' || mode === 'invalid',
  }
}

export function parseJsonlText(text, { file = '<memory>', allowEmpty = false } = {}) {
  const diagnostics = []
  let decoded
  try {
    decoded = decodeUtf8(text)
  } catch {
    diagnostics.push({
      rule: RULE.UTF8_INVALID,
      severity: 'deny',
      file,
      fieldPath: 'bytes',
      message: 'Input is not valid UTF-8',
    })
    return { records: [], diagnostics }
  }
  const lines = decoded.replace(/^\uFEFF/, '').split(/\r?\n/)
  const records = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    try {
      records.push({ record: JSON.parse(line), line: i + 1, file })
    } catch {
      diagnostics.push({
        rule: RULE.PARSE_JSON,
        severity: 'deny',
        file,
        fieldPath: `line:${i + 1}`,
        message: 'JSONL line is not valid JSON',
      })
    }
  }
  if (!allowEmpty && records.length === 0 && diagnostics.length === 0) {
    diagnostics.push({
      rule: RULE.PARSE_JSON,
      severity: 'deny',
      file,
      fieldPath: 'bundle',
      message: 'JSONL bundle is empty',
    })
  }
  return { records, diagnostics }
}

/**
 * Trova le intestazioni «Capsula MetaSkillSystem» dichiarate da un markdown.
 *
 * Esportata perche' e' l'UNICA definizione nel repo di «questo report dichiara una capsula»:
 * il validator la usa per rifiutare un report con piu' sezioni capsula, `scripts/mss/capsule.mjs`
 * la usa per rifiutare l'append su un report che ne ha gia' una. Due definizioni divergenti erano
 * il difetto `N1` caso 1 (24-08-26): la guardia dell'attrezzo cercava la sottostringa
 * `## Capsula MetaSkillSystem` e non vedeva le intestazioni numerate che il validator conta
 * (`## 6-bis. Capsula MetaSkillSystem`, `## 6. Capsula MetaSkillSystem`, …). Risultato: l'attrezzo
 * usciva 0 e scriveva una SECONDA sezione, e `validate:mss` dopo diceva MSS-PARSE-JSONL-AMBIGUOUS.
 */
export function findCapsuleHeadings(markdown) {
  const headings = []
  const headingRe = new RegExp(CAPSULE_HEADING_RE)
  let headingMatch
  while ((headingMatch = headingRe.exec(String(markdown ?? '')))) {
    headings.push({ index: headingMatch.index, end: headingRe.lastIndex })
  }
  return headings
}

/** Quante sezioni capsula dichiara un markdown, secondo la definizione del validator. */
export function countCapsuleHeadings(markdown) {
  return findCapsuleHeadings(markdown).length
}

export function extractCapsulesFromMarkdown(markdown, file) {
  const diagnostics = []
  const headings = findCapsuleHeadings(markdown)

  if (headings.length > 1) {
    diagnostics.push({
      rule: RULE.PARSE_JSONL_AMBIGUOUS,
      severity: 'deny',
      file,
      fieldPath: 'Capsula MetaSkillSystem',
      message: 'Multiple MetaSkillSystem capsule sections found',
    })
    return { bundles: [], diagnostics, hasHeading: true }
  }

  if (headings.length === 0) {
    return { bundles: [], diagnostics, hasHeading: false }
  }

  const tail = markdown.slice(headings[0].end)
  const nextHeading = tail.search(ANY_HEADING_RE)
  const section = nextHeading >= 0 ? tail.slice(0, nextHeading) : tail
  const fences = []
  let fenceMatch
  const fenceRe = new RegExp(JSONL_FENCE_RE)
  while ((fenceMatch = fenceRe.exec(section))) fences.push(fenceMatch[1])

  if (fences.length > 1) {
    diagnostics.push({
      rule: RULE.PARSE_JSONL_AMBIGUOUS,
      severity: 'deny',
      file,
      fieldPath: 'Capsula MetaSkillSystem',
      message: 'Capsule section contains multiple jsonl fences',
    })
    return { bundles: [], diagnostics, hasHeading: true }
  }

  if (fences.length === 0) {
    diagnostics.push({
      rule: RULE.REPORT_NO_CAPSULE,
      severity: 'deny',
      file,
      fieldPath: 'Capsula MetaSkillSystem',
      message: 'Capsule heading present without a jsonl fence',
    })
    return { bundles: [], diagnostics, hasHeading: true }
  }

  const parsed = parseJsonlText(fences[0], { file })
  return {
    bundles: [{ source: 'report_capsule', ...parsed }],
    diagnostics: [...diagnostics, ...parsed.diagnostics],
    hasHeading: true,
  }
}

function decodeMarkdownTarget(value) {
  const withoutFragment = value.split('#')[0].trim().replace(/^<|>$/g, '')
  try {
    return decodeURIComponent(withoutFragment)
  } catch {
    return withoutFragment
  }
}

function logicalSessionEventIds(records) {
  const canonical = new Map()
  for (const entry of records) {
    if (entry.record?.record_type !== 'session_event') continue
    const key = `${entry.record.record_id || ''}|${entry.record.capture_key || ''}`
    const content = JSON.stringify(entry.record)
    if (!canonical.has(key)) canonical.set(key, content)
  }
  return new Set(
    [...canonical.values()]
      .map((content) => JSON.parse(content)?.event?.event_id)
      .filter(Boolean),
  )
}

export function parseLightSessionLog(markdown, { file, workspaceRoot }) {
  const diagnostics = []
  const links = []
  const baseDir = relative(workspaceRoot, dirname(file))

  for (const [lineIndex, line] of String(markdown).split(/\r?\n/).entries()) {
    const narratedEventIds = []
    let eventMatch
    const eventRe = new RegExp(EVENT_ID_RE)
    while ((eventMatch = eventRe.exec(line))) narratedEventIds.push(eventMatch[1])

    let linkMatch
    const linkRe = new RegExp(MARKDOWN_JSONL_LINK_RE)
    while ((linkMatch = linkRe.exec(line))) {
      links.push({
        kind: 'path',
        value: linkMatch[2],
        label: linkMatch[1] || '',
        line: lineIndex + 1,
        narratedEventIds,
      })
    }
  }

  if (links.length === 0) {
    const looksLight = /evento light/i.test(markdown) || /eventi-light/i.test(markdown) || /\.jsonl/i.test(markdown)
    if (looksLight) {
      diagnostics.push({
        rule: RULE.LIGHT_NO_EVENT,
        severity: 'deny',
        file,
        fieldPath: 'SESSION_LOG.light_link',
        message: 'Light row declared without a resolvable .jsonl link',
      })
    }
    return { bundles: [], diagnostics, links }
  }

  const bundles = []
  for (const link of links) {
    const target = decodeMarkdownTarget(link.value)
    const resolved = resolveRef(target, {
      workspaceRoot,
      baseDir,
      fieldPath: `SESSION_LOG.line:${link.line}.light_link`,
    })
    if (!resolved.ok) {
      diagnostics.push({
        rule: resolved.rule,
        severity: 'deny',
        file,
        fieldPath: resolved.fieldPath,
        message: 'Light jsonl link is unsafe or not resolvable',
      })
      continue
    }

    try {
      const text = readFileSync(resolved.resolved)
      const parsed = parseJsonlText(text, { file: resolved.resolved })
      bundles.push({ source: 'light_jsonl', path: resolved.resolved, ...parsed })
      diagnostics.push(...parsed.diagnostics)

      const actualEventIds = logicalSessionEventIds(parsed.records)
      if (
        link.narratedEventIds.length !== 1 ||
        actualEventIds.size !== 1 ||
        !actualEventIds.has(link.narratedEventIds[0])
      ) {
        diagnostics.push({
          rule: RULE.LIGHT_EVENT_MISMATCH,
          severity: 'deny',
          file,
          fieldPath: `SESSION_LOG.line:${link.line}.event_id`,
          message: 'Narrated event_id does not match the linked session_event',
        })
      }
    } catch {
      diagnostics.push({
        rule: RULE.LIGHT_NO_EVENT,
        severity: 'deny',
        file,
        fieldPath: `SESSION_LOG.line:${link.line}.light_link`,
        message: 'Light jsonl link could not be read',
      })
    }
  }

  return { bundles, diagnostics, links, workspaceRoot }
}

export function collectBundlesFromInput(input) {
  const diagnostics = []
  const bundles = []
  let content
  try {
    content = decodeUtf8(input.content)
  } catch {
    diagnostics.push({
      rule: RULE.UTF8_INVALID,
      severity: 'deny',
      file: input.file || '<input>',
      fieldPath: 'bytes',
      message: 'Input is not valid UTF-8',
    })
    return { bundles, diagnostics }
  }

  if (input.kind === 'jsonl' || input.kind === 'bundle') {
    const parsed = parseJsonlText(content, { file: input.file || '<bundle>' })
    bundles.push({ source: input.kind, path: input.file, ...parsed })
    diagnostics.push(...parsed.diagnostics)
  } else if (input.kind === 'report') {
    const mode = detectReportMode(content, { file: input.file, workspaceRoot: input.workspaceRoot })
    if (mode.mode === 'invalid') {
      diagnostics.push({
        rule: RULE.REPORT_MODE_INVALID,
        severity: 'deny',
        file: input.file || '<report>',
        fieldPath: 'Modalità',
        message: 'Report mode declaration is unknown, hybrid, duplicated or contradictory',
      })
    }
    if (mode.mode === 'light') {
      diagnostics.push({
        rule: RULE.LIGHT_NO_EVENT,
        severity: 'deny',
        file: input.file || '<report>',
        fieldPath: 'Modalità',
        message: 'Light closure must use a SESSION_LOG row linked to eventi-light JSONL, not a Report file',
      })
    }
    const extracted = mode.historical
      ? { bundles: [], diagnostics: [], hasHeading: true }
      : extractCapsulesFromMarkdown(content, input.file || '<report>')
    diagnostics.push(...extracted.diagnostics)
    const requiresCapsule = Boolean(input.requireCapsule) || mode.requiresCapsule
    if (
      extracted.bundles.length === 0 &&
      requiresCapsule &&
      !diagnostics.some((d) => d.rule === RULE.REPORT_NO_CAPSULE)
    ) {
      diagnostics.push({
        rule: RULE.REPORT_NO_CAPSULE,
        severity: 'deny',
        file: input.file || '<report>',
        fieldPath: 'Capsula MetaSkillSystem',
        message: 'Declared standard/deep report missing MetaSkillSystem capsule',
      })
    }
    bundles.push(...extracted.bundles)
  } else if (input.kind === 'session_log') {
    const extracted = parseLightSessionLog(content, {
      file: input.file || '<session_log>',
      workspaceRoot: input.workspaceRoot,
    })
    diagnostics.push(...extracted.diagnostics)
    bundles.push(...extracted.bundles)
  }

  return { bundles, diagnostics }
}
