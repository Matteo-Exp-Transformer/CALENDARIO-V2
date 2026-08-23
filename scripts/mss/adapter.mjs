/**
 * Adapter sottile: raccoglie input MSS e invoca il core.
 * Usato da hook stop/pre-commit senza duplicare regole.
 */
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { decodeUtf8 } from './canonical.mjs'
import { validateAppendOnlyRecords, validateGlobalRecordView, validateMss } from './core.mjs'
import { collectBundlesFromInput } from './parse.mjs'
import { PROTOCOL_ID, PROTOCOL_VERSION, REVISION_CURRENT, RULE, SCHEMA_CURRENT } from './rules.mjs'

export const REPORT_PATH_RE = /^docs\/Sessioni di lavoro\/.+\/(Report|Verbale)-.*\.md$/i
const LIGHT_JSONL_RE = /eventi-light\/.+\.jsonl$/i
const MSS_FIXTURE_RE = /^docs\/MetaSkillSystem\/fixtures\/v0\.1\/(.+\.(?:jsonl|md))$/i
const MSS_MANIFEST = 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json'
const MSS_FIXTURE_ROOT = 'docs/MetaSkillSystem/fixtures/v0.1'
const MSS_FIXTURE_TREE_RE = /^docs\/MetaSkillSystem\/fixtures\/v0\.1\//i
const FROZEN_CASES = Object.freeze([
  ['FX-V01', 'pass', 'FX-V01-bundle.jsonl', 'jsonl', []],
  ['FX-V02', 'pass', 'FX-V02-session-log.md', 'session_log', []],
  ['FX-V03', 'pass', 'FX-V03-amendment.jsonl', 'jsonl', []],
  ['FX-V04', 'pass', 'FX-V04-compact-retry.jsonl', 'jsonl', []],
  ['FX-I01', 'fail', 'FX-I01-schema.jsonl', 'jsonl', ['MSS-REVISION-UNKNOWN', 'MSS-SCHEMA-UNKNOWN']],
  ['FX-I02', 'fail', 'FX-I02-vital.jsonl', 'jsonl', ['MSS-VITAL-MISSING', 'MSS-VITAL-PLACEHOLDER']],
  ['FX-I03', 'fail', 'FX-I03-axis-in-event.jsonl', 'jsonl', ['MSS-EVENT-CONTAINS-AXIS']],
  ['FX-I04', 'fail', 'FX-I04-capture-collision.jsonl', 'jsonl', ['MSS-CAPTURE-KEY-COLLISION', 'MSS-RECORD-ID-COLLISION']],
  ['FX-I05', 'fail', 'FX-I05-ref.jsonl', 'jsonl', ['MSS-REF-UNRESOLVABLE']],
  ['FX-I06', 'fail', 'FX-I06-product-gate.jsonl', 'jsonl', ['MSS-PRODUCT-GATE']],
  ['FX-I07', 'fail', 'FX-I07-report-no-capsule.md', 'report', ['MSS-REPORT-NO-CAPSULE']],
  ['FX-I08', 'fail', 'FX-I08-session-log-bad.md', 'session_log', ['MSS-LIGHT-NO-EVENT']],
  ['FX-I09', 'fail', 'FX-I09-verifier.jsonl', 'jsonl', ['MSS-VERIFIER-NOT-INDEPENDENT']],
  ['FX-I10', 'warn', 'FX-I10-lock.jsonl', 'jsonl', ['MSS-LOCK-UNAUTHORIZED']],
])
const FROZEN_HASHES = Object.freeze({
  'FX-V01': 'd9192044ea1da2a5e61902b4bbf6d704aade50846d3fa9e6370705b7d3014e14',
  'FX-V02': '904ba7045f0f8fa91be13d6cf667826114c8f29bdcf93ff87fcb88c277f26554',
  'FX-V03': '04c41c82b8e8334095d64b746358875989e0cb0050f1a3c10febf4557033b3fc',
  'FX-V04': '1b54c20f90b5c49faa54048b26bc9391e37cefe1c2e807527009ce997a93ed5e',
  'FX-I01': '89471a45763320c7aef2e084e6b8d92ea5724ffd066836355f80b30c3289306a',
  'FX-I02': 'f5e43e30540e9357e1d064fc68803949fa9e8b9b765801542619a684a3b18a72',
  'FX-I03': 'e9af2609ae86818295070551006e76b25b5ac613e369d20b325a92472c358a7b',
  'FX-I04': 'd51f02a00fe305d594cebf9607081dbf7572da3e3dad56b88ee07aa73f2ee64f',
  'FX-I05': '743802bf26258494b930ab577c74200766b01610269e853b51bcc7cf97c7e2ab',
  'FX-I06': '954ab7fd23fce337d3907422cea475ec9b63957f087ffc5dd10d1d01e3a16a96',
  'FX-I07': '4f452e1731c0b5a465880c0a44b6f939a579314fcdfb21934b020454612ae179',
  'FX-I08': 'a7b7fe5057f51885559818dec8a265854e126c33879a3bfe662ab1ff7ee22621',
  'FX-I09': '24cc8d55f0ec9ea580ed7e8b6b40539db7bd39678b38f8226d58a532494b190b',
  'FX-I10': '4aa2b595a94026ac6ac19a064b855fa6b2173812ef593c5236cedc9d529c7598',
})
const FX_V02_LIGHT_HASH = '2428cc0c895c7f3e96af96162e4a20aaea863e7097d0623edfdf33726ed16a39'

function normalizePath(path) {
  return path.replace(/\\/g, '/')
}

function sha256(content) {
  return createHash('sha256').update(typeof content === 'string' ? content : Buffer.from(content)).digest('hex')
}

function sameBytes(left, right) {
  if (left == null || right == null) return left === right
  return Buffer.from(typeof left === 'string' ? Buffer.from(left, 'utf8') : left)
    .equals(Buffer.from(typeof right === 'string' ? Buffer.from(right, 'utf8') : right))
}

function artifactPath(workspaceRoot, file) {
  const root = resolve(workspaceRoot)
  const absolute = resolve(file)
  const rel = relative(root, absolute)
  return rel && !rel.startsWith('..') && !isAbsolute(rel) ? normalizePath(rel) : normalizePath(file)
}

function emptyResult(ok = true) {
  return {
    ok,
    diagnostics: [],
    codes: [],
    denyCodes: [],
    warnCodes: [],
    summary: { deny: 0, warn: 0, bundles: 0 },
  }
}

function adapterFailure(rule, file, fieldPath, message) {
  const diagnostic = { severity: 'deny', rule, file, fieldPath, message }
  return {
    ok: false,
    diagnostics: [diagnostic],
    codes: [rule],
    denyCodes: [rule],
    warnCodes: [],
    summary: { deny: 1, warn: 0, bundles: 0 },
  }
}

function resultFromDiagnostics(diagnostics, bundles = 0) {
  const denies = diagnostics.filter((d) => d.severity === 'deny')
  const warns = diagnostics.filter((d) => d.severity === 'warn')
  return {
    ok: denies.length === 0,
    diagnostics,
    codes: diagnostics.map((d) => d.rule),
    denyCodes: denies.map((d) => d.rule),
    warnCodes: warns.map((d) => d.rule),
    summary: { deny: denies.length, warn: warns.length, bundles },
  }
}

export function isMssRelevantPath(path) {
  const p = normalizePath(path)
  return (
    REPORT_PATH_RE.test(p) ||
    LIGHT_JSONL_RE.test(p) ||
    MSS_FIXTURE_RE.test(p) ||
    p === MSS_MANIFEST ||
    /\/SESSION_LOG\.md$/i.test(p) ||
    p === 'docs/SESSION_LOG.md'
  )
}

export function validatePathContent({
  workspaceRoot,
  file,
  content,
  kind,
  stagedContent,
  worktreeContent,
  requireCapsule = false,
  headContent,
  historicalRecords = [],
  historicalSnapshots = [],
  validateGlobal = true,
}) {
  const detected =
    kind ||
    (file.endsWith('.jsonl')
      ? 'jsonl'
      : /SESSION_LOG\.md$/i.test(file)
        ? 'session_log'
        : file.endsWith('.md')
          ? 'report'
          : 'jsonl')

  const historical = historicalRecords.length
    ? { records: historicalRecords, diagnostics: [] }
    : recordsFromSnapshots(workspaceRoot, historicalSnapshots)
  const currentPath = artifactPath(workspaceRoot, file)
  const externalHistory = historical.records.filter(
    (entry) => normalizePath(entry?.file || '') !== currentPath,
  )
  const headSnapshot = historicalSnapshots.find(
    (snapshot) => normalizePath(snapshot?.path || '') === currentPath,
  )
  const resolvedHeadContent = headContent ?? headSnapshot?.content ?? undefined
  const observed = validateMss(
    {
      kind: detected,
      file,
      content,
      workspaceRoot,
      requireCapsule,
      stagedContent,
      worktreeContent,
      headContent: resolvedHeadContent,
    },
    {
      workspaceRoot,
      lockSeverity: 'warn',
      historicalRecords: externalHistory,
      historicalSnapshots,
    },
  )
  if (!validateGlobal) {
    return resultFromDiagnostics([...observed.diagnostics, ...historical.diagnostics], observed.summary.bundles)
  }
  const current = recordsFromSnapshots(workspaceRoot, [{ path: currentPath, content }])
  const global = validateGlobalRecordView([...externalHistory, ...current.records])
  return resultFromDiagnostics([
    ...observed.diagnostics,
    ...historical.diagnostics,
    ...global.diagnostics,
  ], observed.summary.bundles)
}

export function validateRecentReportFile(workspaceRoot, reportPath, { historicalSnapshots = [] } = {}) {
  const content = readFileSync(reportPath)
  return validatePathContent({
    workspaceRoot,
    file: reportPath,
    content,
    kind: 'report',
    historicalSnapshots,
  })
}

function fixtureSnapshotPath(file) {
  const normalized = normalizePath(String(file || ''))
  if (!normalized || normalized.startsWith('/') || normalized.split('/').includes('..')) return null
  return `${MSS_FIXTURE_ROOT}/${normalized}`
}

function parseFixtureManifest(content, file, effectiveFixturePaths = null) {
  let manifest
  try {
    manifest = JSON.parse(decodeUtf8(content))
  } catch {
    let rule = RULE.PARSE_JSON
    try { decodeUtf8(content) } catch { rule = RULE.UTF8_INVALID }
    return { result: adapterFailure(rule, file, 'manifest', 'Fixture manifest is not valid UTF-8 JSON') }
  }
  if (!Array.isArray(manifest.frozen) || !Array.isArray(manifest.supplemental)) {
    return { result: adapterFailure(RULE.FIXTURE_EXPECTATION, file, 'manifest', 'Fixture manifest lists are missing') }
  }
  if (
    manifest.schema_version !== SCHEMA_CURRENT ||
    manifest.system_revision !== REVISION_CURRENT ||
    manifest.protocol_id !== PROTOCOL_ID ||
    manifest.protocol_version !== PROTOCOL_VERSION
  ) {
    return { result: adapterFailure(RULE.FIXTURE_PROTOCOL, file, 'manifest.protocol', 'Fixture manifest protocol is incompatible') }
  }
  const cases = [...manifest.frozen, ...manifest.supplemental]
  const ids = new Set()
  const byId = new Map()
  const byFile = new Map()
  for (const c of cases) {
    if (!c?.id || !c?.file || !['pass', 'fail', 'warn'].includes(c.expect)) {
      return { result: adapterFailure(RULE.FIXTURE_EXPECTATION, file, 'manifest', 'Fixture declaration is incomplete') }
    }
    if (byFile.has(c.file)) {
      return { result: adapterFailure(RULE.FIXTURE_EXPECTATION, file, `manifest.${c.file}`, 'Fixture file is declared twice') }
    }
    if (ids.has(c.id)) {
      return { result: adapterFailure(RULE.FIXTURE_PROTOCOL, file, `manifest.id:${c.id}`, 'Fixture ID is declared twice') }
    }
    ids.add(c.id)
    byId.set(c.id, c)
    byFile.set(c.file, c)
  }
  const expectedFrozen = new Map(FROZEN_CASES.map((c) => [c[0], c]))
  if (manifest.frozen.length !== FROZEN_CASES.length) {
    return { result: adapterFailure(RULE.FIXTURE_PROTOCOL, file, 'manifest.frozen', 'Frozen fixture denominator changed without protocol implementation') }
  }
  for (const c of manifest.frozen) {
    const expected = expectedFrozen.get(c.id)
    const actualCodes = uniqueSorted(c.codes || [])
    if (
      !expected || c.expect !== expected[1] || c.file !== expected[2] || c.kind !== expected[3] ||
      JSON.stringify(actualCodes) !== JSON.stringify(expected[4]) ||
      c.content_sha256 !== FROZEN_HASHES[c.id]
    ) {
      return { result: adapterFailure(RULE.FIXTURE_PROTOCOL, file, `manifest.frozen.${c.id}`, 'Frozen fixture meaning changed') }
    }
  }
  const fxV02 = manifest.frozen.find((c) => c.id === 'FX-V02')
  if (
    !Array.isArray(fxV02?.support_files) || fxV02.support_files.length !== 1 ||
    fxV02.support_files[0]?.file !== 'FX-V02-light.jsonl' ||
    fxV02.support_files[0]?.content_sha256 !== FX_V02_LIGHT_HASH
  ) {
    return { result: adapterFailure(RULE.FIXTURE_PROTOCOL, file, 'manifest.frozen.FX-V02.support_files', 'Frozen light support changed') }
  }
  for (const supplemental of manifest.supplemental) {
    if (!Object.hasOwn(supplemental, 'representation_of')) continue
    const target = supplemental.representation_of
    if (typeof target !== 'string' || !target || target === supplemental.id || !byId.has(target)) {
      return { result: adapterFailure(
        RULE.FIXTURE_PROTOCOL,
        file,
        `manifest.supplemental.${supplemental.id}.representation_of`,
        'Supplemental fixture relation target is missing or invalid',
      ) }
    }
  }
  if (effectiveFixturePaths) {
    for (const declaration of cases) {
      const declaredPath = fixtureSnapshotPath(declaration.file)
      if (!declaredPath || !effectiveFixturePaths.has(declaredPath)) {
        return { result: adapterFailure(
          RULE.FIXTURE_PROTOCOL,
          file,
          `manifest.${declaration.id}.file`,
          'Manifest fixture file is absent from the effective staged snapshot',
        ) }
      }
      for (const [index, support] of (declaration.support_files || []).entries()) {
        const supportPath = fixtureSnapshotPath(support?.file)
        if (!supportPath || !effectiveFixturePaths.has(supportPath)) {
          return { result: adapterFailure(
            RULE.FIXTURE_PROTOCOL,
            file,
            `manifest.${declaration.id}.support_files[${index}].file`,
            'Manifest support file is absent from the effective staged snapshot',
          ) }
        }
      }
    }
  }
  const protectedHashes = new Map(manifest.frozen.map((c) => [c.file, c.content_sha256]))
  protectedHashes.set('FX-V02-light.jsonl', FX_V02_LIGHT_HASH)
  return { manifest, byFile, protectedHashes, result: emptyResult(true) }
}

function uniqueSorted(values) {
  return [...new Set(values)].sort()
}

function fixtureMatches(result, declaration) {
  const expectedCodes = uniqueSorted(declaration.codes || [])
  const actualCodes = uniqueSorted(
    declaration.expect === 'warn' ? result.warnCodes : declaration.expect === 'fail' ? result.denyCodes : result.codes,
  )
  if (declaration.expect === 'pass') return result.ok && result.diagnostics.length === 0
  if (declaration.expect === 'warn') {
    return result.ok && result.denyCodes.length === 0 && JSON.stringify(actualCodes) === JSON.stringify(expectedCodes)
  }
  return !result.ok && JSON.stringify(actualCodes) === JSON.stringify(expectedCodes)
}

function acceptedFixtureResult(observed, declaration) {
  return {
    ...emptyResult(true),
    fixtureExpectation: {
      matched: true,
      id: declaration.id,
      expect: declaration.expect,
      observedCodes: observed.codes,
    },
  }
}

function recordsFromSnapshots(workspaceRoot, snapshots) {
  const records = []
  const diagnostics = []
  for (const snapshot of snapshots || []) {
    if (snapshot?.content == null) continue
    const path = normalizePath(snapshot.path)
    if (!REPORT_PATH_RE.test(path) && !LIGHT_JSONL_RE.test(path)) continue
    const kind = path.endsWith('.jsonl') ? 'jsonl' : 'report'
    const collected = collectBundlesFromInput({ kind, file: path, content: snapshot.content, workspaceRoot })
    diagnostics.push(...collected.diagnostics.filter((diagnostic) => diagnostic.rule === RULE.UTF8_INVALID))
    for (const bundle of collected.bundles) {
      for (const entry of bundle.records || []) records.push({ ...entry, file: path })
    }
  }
  return { records, diagnostics }
}

export function validateStagedMssFiles(workspaceRoot, stagedEntries, { historicalSnapshots = [], requireCapsule = false } = {}) {
  /** stagedEntries: [{ path, previousPath?, status?, content?, headContent?, worktreeContent? }] */
  const normalized = stagedEntries.map((entry) => ({ ...entry, path: normalizePath(entry.path) }))
  const manifestEntry = normalized.find((entry) =>
    entry.path === MSS_MANIFEST || normalizePath(entry.previousPath || '') === MSS_MANIFEST,
  )
  const manifestTouched = Boolean(manifestEntry)
  const fixtureTouched = normalized.some((entry) => {
    const previousPath = entry.previousPath ? normalizePath(entry.previousPath) : null
    return entry.path === MSS_MANIFEST || previousPath === MSS_MANIFEST || MSS_FIXTURE_RE.test(entry.path) || (previousPath && MSS_FIXTURE_RE.test(previousPath))
  })
  const effectiveFixtureSnapshot = new Map()
  for (const snapshot of historicalSnapshots) {
    const path = normalizePath(snapshot.path)
    if (MSS_FIXTURE_TREE_RE.test(path) && snapshot.content != null) {
      effectiveFixtureSnapshot.set(path, snapshot.content)
    }
  }
  for (const entry of normalized) {
    const previousPath = normalizePath(entry.previousPath || entry.path)
    if ((entry.status === 'R' || entry.status === 'D') && MSS_FIXTURE_TREE_RE.test(previousPath)) {
      effectiveFixtureSnapshot.delete(previousPath)
    }
    if (entry.content != null && MSS_FIXTURE_TREE_RE.test(entry.path)) {
      effectiveFixtureSnapshot.set(entry.path, entry.content)
    } else if (entry.content == null && MSS_FIXTURE_TREE_RE.test(entry.path)) {
      effectiveFixtureSnapshot.delete(entry.path)
    }
  }
  const manifestLifecycleInvalid = manifestTouched && (
    manifestEntry.status === 'D' ||
    manifestEntry.status === 'R' ||
    manifestEntry.path !== MSS_MANIFEST ||
    manifestEntry.content == null
  )
  const effectiveManifest = effectiveFixtureSnapshot.get(MSS_MANIFEST)
  const parsedManifest = !fixtureTouched
    ? { result: emptyResult(true) }
    : manifestLifecycleInvalid
      ? { result: adapterFailure(RULE.FIXTURE_PROTOCOL, MSS_MANIFEST, 'manifest.staged', 'Staged fixture manifest cannot be deleted or renamed') }
      : manifestTouched
        ? parseFixtureManifest(manifestEntry.content, MSS_MANIFEST, new Set(effectiveFixtureSnapshot.keys()))
        : effectiveManifest != null
          ? parseFixtureManifest(effectiveManifest, MSS_MANIFEST, new Set(effectiveFixtureSnapshot.keys()))
          : { result: adapterFailure(RULE.FIXTURE_PROTOCOL, MSS_MANIFEST, 'manifest.staged', 'Unborn repository requires a staged fixture manifest') }
  const results = []

  const headMap = new Map()
  for (const snapshot of historicalSnapshots) {
    const path = normalizePath(snapshot.path)
    if (REPORT_PATH_RE.test(path) || LIGHT_JSONL_RE.test(path)) headMap.set(path, { path, content: snapshot.content })
  }
  for (const entry of normalized) {
    const previousPath = normalizePath(entry.previousPath || entry.path)
    if (entry.headContent != null && (REPORT_PATH_RE.test(previousPath) || LIGHT_JSONL_RE.test(previousPath))) {
      if (!headMap.has(previousPath)) headMap.set(previousPath, { path: previousPath, content: entry.headContent })
    }
  }
  const stagedMap = new Map(headMap)
  for (const entry of normalized) {
    const previousPath = entry.previousPath ? normalizePath(entry.previousPath) : null
    if (entry.status === 'R' || entry.status === 'D') stagedMap.delete(previousPath || entry.path)
    if (entry.content != null && (REPORT_PATH_RE.test(entry.path) || LIGHT_JSONL_RE.test(entry.path))) {
      stagedMap.set(entry.path, { path: entry.path, content: entry.content })
    } else if (entry.content == null) {
      stagedMap.delete(entry.path)
    }
  }
  const headView = recordsFromSnapshots(workspaceRoot, [...headMap.values()])
  const stagedView = recordsFromSnapshots(workspaceRoot, [...stagedMap.values()])
  const historicalRecords = stagedView.records

  for (const entry of normalized) {
    const previousPath = entry.previousPath ? normalizePath(entry.previousPath) : null
    if (!isMssRelevantPath(entry.path) && !(previousPath && isMssRelevantPath(previousPath))) continue
    if (entry.path === MSS_MANIFEST || previousPath === MSS_MANIFEST) {
      if (entry.worktreeContent != null && !sameBytes(entry.content, entry.worktreeContent)) {
        results.push({
          path: entry.path,
          result: adapterFailure(
            RULE.STAGED_WORKTREE_MISMATCH,
            entry.path,
            'staged_vs_worktree',
            'Staged fixture manifest differs from worktree content',
          ),
        })
      } else {
        results.push({ path: entry.path, result: parsedManifest.result })
      }
      continue
    }

    const currentFixtureMatch = entry.path.match(MSS_FIXTURE_RE)
    const previousFixtureMatch = previousPath?.match(MSS_FIXTURE_RE)
    if (entry.content == null || (previousFixtureMatch && previousPath !== entry.path)) {
      const removedFixture = previousFixtureMatch || currentFixtureMatch
      if (removedFixture) {
        const removedPath = previousFixtureMatch ? previousPath : entry.path
        results.push({
          path: removedPath,
          result: adapterFailure(RULE.FIXTURE_PROTOCOL, removedPath, 'fixture.lifecycle', 'Declared fixture cannot be deleted or renamed silently'),
        })
      }
      continue
    }
    const abs = join(workspaceRoot, entry.path)
    const fixtureMatch = currentFixtureMatch
    const declaration = fixtureMatch && parsedManifest.byFile
      ? parsedManifest.byFile.get(fixtureMatch[1])
      : null
    const observed = validatePathContent({
      workspaceRoot,
      file: abs,
      content: entry.content,
      kind: declaration?.kind,
      stagedContent: entry.content,
      worktreeContent: entry.worktreeContent,
      headContent: entry.headContent,
      requireCapsule: fixtureMatch ? false : requireCapsule,
      historicalRecords,
      historicalSnapshots,
      validateGlobal: false,
    })

    if (!fixtureMatch) {
      results.push({ path: entry.path, result: observed })
      continue
    }

    // Un mismatch staged/worktree resta sempre un blocco, anche per fixture negative attese.
    if (observed.denyCodes.includes(RULE.STAGED_WORKTREE_MISMATCH)) {
      results.push({ path: entry.path, result: observed })
      continue
    }
    if (!parsedManifest.byFile) {
      results.push({ path: entry.path, result: parsedManifest.result })
      continue
    }
    if (!declaration) {
      results.push({
        path: entry.path,
        result: adapterFailure(RULE.FIXTURE_UNDECLARED, entry.path, 'manifest', 'Fixture is not declared in manifest'),
      })
      continue
    }
    const protectedHash = parsedManifest.protectedHashes?.get(fixtureMatch[1])
    if (protectedHash && sha256(entry.content) !== protectedHash) {
      results.push({
        path: entry.path,
        result: adapterFailure(RULE.FIXTURE_PROTOCOL, entry.path, 'fixture.content_sha256', 'Frozen fixture content changed'),
      })
      continue
    }
    if (!fixtureMatches(observed, declaration)) {
      results.push({
        path: entry.path,
        result: adapterFailure(
          RULE.FIXTURE_EXPECTATION,
          entry.path,
          'manifest.expected_outcome',
          'Fixture does not produce exactly the declared outcome',
        ),
      })
      continue
    }
    results.push({ path: entry.path, result: acceptedFixtureResult(observed, declaration) })
  }

  const appendOnly = validateAppendOnlyRecords({
    headEntries: headView.records,
    stagedEntries: stagedView.records,
  })
  const global = validateGlobalRecordView(stagedView.records)
  const viewDiagnostics = [
    ...headView.diagnostics,
    ...stagedView.diagnostics,
    ...appendOnly.diagnostics,
    ...global.diagnostics,
  ]
  if (viewDiagnostics.length) {
    const grouped = new Map()
    for (const diagnostic of viewDiagnostics) {
      const list = grouped.get(diagnostic.file) || []
      list.push(diagnostic)
      grouped.set(diagnostic.file, list)
    }
    for (const [path, diagnostics] of grouped) {
      const existing = results.findLast((entry) => entry.path === path)
      if (existing) existing.result = resultFromDiagnostics([...existing.result.diagnostics, ...diagnostics])
      else results.push({ path, result: resultFromDiagnostics(diagnostics) })
    }
  }
  return results
}
