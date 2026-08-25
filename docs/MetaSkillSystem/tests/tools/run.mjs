#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildQueryPayload,
  buildVistaEffettiva,
  renderVerifica,
  renderFail,
  runQuery,
} from '../../../../scripts/mss/query.mjs'
import { buildStatusReport, runStatus } from '../../../../scripts/mss/status.mjs'
import { parsePlanGate, parsePlanBoard, parsePlanGlosses, validatePlanGlosses, classifyPlanState } from '../../../../scripts/mss/plan-parse.mjs'
import {
  MANUAL_MOVE_BASELINE_LINES,
  runMove,
} from '../../../../scripts/mss/move.mjs'
import {
  classifyPath,
  findSessionReports,
  reviewSession,
  runReview,
} from '../../../../scripts/mss/review.mjs'
import {
  buildCapsuleBundle,
  formatCapsuleBlock,
  recordsToJsonl,
  runCapsule,
  runChecks,
  parseCapsuleArgs,
  parseCheckSpec,
  parseVerifySpec,
  collectGitContext,
  buildSourceRefsFromGit,
  buildJudgmentsTemplate,
  buildR1JudgmentsTemplate,
  R1_MODE_CONSTANTS,
} from '../../../../scripts/mss/capsule.mjs'
import { countCapsuleHeadings } from '../../../../scripts/mss/parse.mjs'
import { validateMss } from '../../../../scripts/mss/core.mjs'
import { CONFIG, buildReportPathRe, normalizeConfig } from '../../../../scripts/mss/config.mjs'
import { REPORT_PATH_RE } from '../../../../scripts/mss/adapter.mjs'
import { collectExportPaths, findDanglingImports } from '../../../../scripts/mss/export-kit.mjs'
import { runDoctor } from '../../../../scripts/mss/doctor.mjs'
import { runViews, deriveMatteoDashboard } from '../../../../scripts/mss/views.mjs'
import { PROTOCOL_ID, PROTOCOL_VERSION, REVISION_CURRENT, REVISION_LEGACY, SCHEMA_CURRENT, SCHEMA_LEGACY } from '../../../../scripts/mss/rules.mjs'
import {
  IDS,
  amendment,
  validBundle,
} from '../h1/fixture-factory.mjs'

// I path di seduta sintetici seguono la config: una suite che passa solo con UNA cartella
// smentirebbe la parametrizzazione che deve proteggere (R8).
const SESSIONI = CONFIG.sessionsDir
/**
 * ANCORE DI PROGETTO (R8) — vedi la nota gemella in ../h1/run.mjs. Un gruppo che legge un file
 * esistente solo nella repo sorgente viene dichiarato non applicabile altrove, non fatto fallire.
 */
const PROJECT_ANCHORS = Object.freeze({
  // Il path e LETTERALE, non `CONFIG.owners.plan`: questo gruppo controlla che l'owner di
  // QUESTO progetto non riesponga conteggi vecchi. In una repo ospite non ha bersaglio.
  // Riusato anche dal gruppo R8 «ambientale» sotto: PLAN_V0.md non e nell'EXPORT_MANIFEST
  // (export-kit.mjs), quindi la sua presenza e' un marcatore affidabile «questa e' la repo
  // sorgente», non solo dell'owner.
  'owner-di-progetto': ['docs/MetaSkillSystem/PLAN_V0.md'],
})
const missingAnchors = (id) => (PROJECT_ANCHORS[id] || []).filter((rel) => !existsSync(join(REPO_ROOT, rel)))
// Valore storico cablato prima di R8 (docs/MetaSkillSystem/PLAN_V0.md §4-bis, S11). LETTERALE,
// non costruito da buildReportPathRe/CONFIG: i due test R8 sotto lo confrontano con l'ambiente,
// non lo ricalcolano — un refuso nella formula deve restare visibile qui.
const ATTESO_PERIMETRO_STORICO = String(/^docs\/Sessioni di lavoro\/.+\/(Report|Verbale)-.*\.md$/i)
const FIXED_PATH = `${SESSIONI}/10-08-26/Report-tools-synthetic.md`
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const CHANGED_REPORTS_CLI = join(REPO_ROOT, 'scripts/mss/validate-changed-reports.mjs')
const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const JUDGMENTS_MINIMAL = join(FIXTURES_DIR, 'judgments-sk7-minimal.json')
const JUDGMENTS_MISSING_PERSONA = join(FIXTURES_DIR, 'judgments-sk7-missing-persona.json')

const GOLDEN_TIMESTAMP = '2026-08-23T17:07:42+00:00'
const GOLDEN_IDS = {
  session: '0198b000-0001-7000-8000-000000000001',
  correlation: '0198b000-0001-7000-8000-000000000002',
  recordEvent: '0198b000-0001-7000-8000-000000000010',
  recordPersona: '0198b000-0001-7000-8000-000000000011',
  recordSistema: '0198b000-0001-7000-8000-000000000012',
  recordOutput: '0198b000-0001-7000-8000-000000000013',
  event: '0198b000-0001-7000-8000-000000000020',
  annPersona: '0198b000-0001-7000-8000-000000000030',
  annSistema: '0198b000-0001-7000-8000-000000000031',
  annOutput: '0198b000-0001-7000-8000-000000000032',
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function goldenCapsuleOptions(overrides = {}) {
  return {
    judgments: readJson(JUDGMENTS_MINIMAL),
    model: 'fixture-model',
    role: 'test fixture SK-7',
    actorId: 'cursor-fixture-model-sk7',
    tools: ['filesystem'],
    packages: [{
      package_id: 'metaskill-system',
      package_version_or_revision: REVISION_CURRENT,
      source_ref: 'source-contract',
    }],
    checks: [],
    timestamp: GOLDEN_TIMESTAMP,
    ids: GOLDEN_IDS,
    gitContext: { branch: 'fixture', head: 'abc1234', headShort: 'abc1234', changedFiles: [] },
    env: { TERM_PROGRAM: 'cursor', CURSOR_AGENT: 'fixture-agent' },
    ...overrides,
  }
}

function runProcess(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (result.error) throw result.error
  return { ...result, output: `${result.stdout || ''}${result.stderr || ''}` }
}

function runGit(repo, ...args) {
  const result = runProcess('git', args, repo)
  assert.equal(result.status, 0, result.output)
  return result.stdout.trim()
}

function writeRepoFile(repo, path, content) {
  const absolute = join(repo, ...path.split('/'))
  mkdirSync(dirname(absolute), { recursive: true })
  writeFileSync(absolute, content, 'utf8')
}

function commitFile(repo, path, content, message) {
  writeRepoFile(repo, path, content)
  runGit(repo, 'add', '--', path)
  runGit(repo, 'commit', '-m', message)
  return runGit(repo, 'rev-parse', 'HEAD')
}

function withTempGitRepo(test) {
  const tempParent = resolve(tmpdir())
  const repo = mkdtempSync(join(tempParent, 'calendarbackup-mss-tools-'))
  assert.equal(isAbsolute(repo), true)
  assert.equal(dirname(repo), tempParent)
  try {
    runGit(repo, 'init')
    runGit(repo, 'config', 'user.email', 'mss-tools@example.invalid')
    runGit(repo, 'config', 'user.name', 'MSS tools test')
    writeRepoFile(repo, 'baseline.txt', 'baseline\n')
    writeRepoFile(
      repo,
      'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md',
      '# Contratto sintetico per test\n',
    )
    writeRepoFile(
      repo,
      'docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md',
      '# Skill sintetica per test\n',
    )
    runGit(repo, 'add', '--', 'baseline.txt', 'docs/MetaSkillSystem')
    runGit(repo, 'commit', '-m', 'baseline')
    const base = runGit(repo, 'rev-parse', 'HEAD')
    return test({ repo, base })
  } finally {
    assert.equal(dirname(resolve(repo)), tempParent)
    rmSync(repo, { recursive: true, force: true })
  }
}

function validReport(title) {
  const jsonl = validBundle().map((record) => JSON.stringify(record)).join('\n')
  return `# ${title}\n\n## Capsula MetaSkillSystem\n\n\`\`\`jsonl\n${jsonl}\n\`\`\`\n`
}

function invalidReport(title) {
  return `# ${title}\n\n**Modalità:** deep.\n`
}

function validateChanged(repo, base, head) {
  return runProcess(
    process.execPath,
    [CHANGED_REPORTS_CLI, '--base', base, '--head', head, '--repo', repo],
    REPO_ROOT,
  )
}

function queryData(records) {
  const wrapped = records.map((r) => ({ r, path: FIXED_PATH, origin: 'fixture sintetica' }))
  const sessions = new Map()
  for (const rec of wrapped) {
    if (!sessions.has(rec.r.session_id)) {
      sessions.set(rec.r.session_id, { id: rec.r.session_id, records: [], paths: new Set() })
    }
    const session = sessions.get(rec.r.session_id)
    session.records.push(rec)
    session.paths.add(rec.path)
  }
  for (const session of sessions.values()) {
    session.event = session.records.find((entry) => entry.r.record_type === 'session_event')?.r || null
  }
  return {
    files: [{ path: FIXED_PATH, origin: 'fixture sintetica', count: records.length, empty: false }],
    records: wrapped,
    sessions: [...sessions.values()],
    anomalies: [],
    headCount: 0,
    workCount: 1,
  }
}

function syntheticCorpus({ sessionCount, absentControls }) {
  const records = []
  for (let index = 0; index < sessionCount; index++) {
    const bundle = validBundle()
    const sessionId = `mss-ses-synthetic-${String(index).padStart(2, '0')}`
    for (const [recordIndex, record] of bundle.entries()) {
      record.session_id = sessionId
      record.correlation_id = `mss-cor-synthetic-${String(index).padStart(2, '0')}`
      record.record_id = `mss-rec-synthetic-${String(index).padStart(2, '0')}-${String(recordIndex).padStart(2, '0')}`
      record.capture_key = `${sessionId}/1/${record.record_type}/${recordIndex || recordIndex + 1}`
      if (record.record_type === 'session_event' && index < absentControls) {
        delete record.event.controls
      }
      records.push(record)
    }
  }
  return queryData(records)
}

function syntheticAmendment({
  recordId,
  amendmentId,
  ordinal,
  target = IDS.recEvt,
  fieldPath = 'event.open_items',
  previous = 'nessuno',
  corrected = 'correzione sintetica',
  effectiveAt = '2026-08-10T10:05:00+02:00',
  relation = 'amends',
}) {
  const record = amendment(target)
  record.record_id = recordId
  record.capture_key = `${IDS.ses}/1/amendment/${ordinal}`
  record.created_at = effectiveAt
  record.amendment.amendment_id = amendmentId
  record.amendment.relation = relation
  record.amendment.effective_at = effectiveAt
  record.amendment.changes = [{
    field_path: fieldPath,
    previous_value_or_hash: previous,
    corrected_value: corrected,
  }]
  return record
}

function effectiveRecord(vista, recordId = IDS.recEvt) {
  return vista.dataEffettiva.records.find((entry) => entry.r.record_id === recordId)?.r
}

// --- B4 (24-08-26) — tetto dichiarato dell'allowlist di check-doc-paths.mjs ------------------
// Copia isolata dello script reale (mai il registro vero, popolato con voci sintetiche) per
// verificare che il tetto stringa senza toccare scripts/doc-path-check-allowlist.json.
const REAL_CHECK_DOC_PATHS = join(REPO_ROOT, 'scripts/check-doc-paths.mjs')
const REAL_CLI_LOG = join(REPO_ROOT, 'scripts/_cliLog.mjs')

function syntheticAllowlist(count) {
  return Array.from({ length: count }, (_, i) => ({
    path: `docs/b4-synthetic-missing-${i}.md`,
    reason: 'B4 synthetic fixture — mai un path reale del repo',
  }))
}

const REAL_DOC_PATHS_LIB = join(REPO_ROOT, 'scripts/doc-paths-lib.mjs')

function runCheckDocPathsWithAllowlist(allowlistEntries) {
  const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup-mss-b4-'))
  try {
    mkdirSync(join(root, 'scripts'), { recursive: true })
    mkdirSync(join(root, 'docs'), { recursive: true })
    writeFileSync(join(root, 'scripts/check-doc-paths.mjs'), readFileSync(REAL_CHECK_DOC_PATHS))
    writeFileSync(join(root, 'scripts/doc-paths-lib.mjs'), readFileSync(REAL_DOC_PATHS_LIB))
    writeFileSync(join(root, 'scripts/_cliLog.mjs'), readFileSync(REAL_CLI_LOG))
    writeFileSync(join(root, 'scripts/doc-path-check-allowlist.json'), JSON.stringify(allowlistEntries, null, 2))
    writeFileSync(join(root, 'docs/placeholder.md'), '# placeholder — nessun riferimento a file locali.\n')
    return spawnSync(process.execPath, [join(root, 'scripts/check-doc-paths.mjs')], { cwd: root, encoding: 'utf8' })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

const tests = [
  ['changed reports: Report valido in sottocartella viene selezionato e validato', () => {
    withTempGitRepo(({ repo, base }) => {
      const path = `${SESSIONI}/23-08-26/audit/deep/Report-valid.md`
      const head = commitFile(repo, path, validReport('Report valido'), 'add valid report')
      const result = validateChanged(repo, base, head)
      assert.equal(result.status, 0, result.output)
      assert.match(result.output, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(result.output, /OK: 1\/1 report MSS validi/)
    })
  }],
  ['changed reports: Report invalido rende rosso, poi la correzione rende verde', () => {
    withTempGitRepo(({ repo, base }) => {
      const path = `${SESSIONI}/23-08-26/audit/deep/Report-invalid.md`
      const head = commitFile(repo, path, invalidReport('Report invalido'), 'add invalid report')
      const red = validateChanged(repo, base, head)
      assert.equal(red.status, 1, red.output)
      assert.match(red.output, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(red.output, /MSS-REPORT-NO-CAPSULE/)
      const fixedHead = commitFile(repo, path, validReport('Report corretto'), 'fix report')
      const green = validateChanged(repo, base, fixedHead)
      assert.equal(green.status, 0, green.output)
      assert.match(green.output, /OK: 1\/1 report MSS validi/)
    })
  }],
  ['changed reports: Verbale valido in sottocartella viene selezionato e validato', () => {
    withTempGitRepo(({ repo, base }) => {
      const path = `${SESSIONI}/23-08-26/audit/deep/Verbale-valid.md`
      const head = commitFile(repo, path, validReport('Verbale valido'), 'add valid verbale')
      const result = validateChanged(repo, base, head)
      assert.equal(result.status, 0, result.output)
      assert.match(result.output, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(result.output, /OK: 1\/1 report MSS validi/)
    })
  }],
  ['changed reports: Verbale invalido rende rosso, poi la correzione rende verde', () => {
    withTempGitRepo(({ repo, base }) => {
      const path = `${SESSIONI}/23-08-26/audit/deep/Verbale-invalid.md`
      const head = commitFile(repo, path, invalidReport('Verbale invalido'), 'add invalid verbale')
      const red = validateChanged(repo, base, head)
      assert.equal(red.status, 1, red.output)
      assert.match(red.output, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(red.output, /MSS-REPORT-NO-CAPSULE/)
      const fixedHead = commitFile(repo, path, validReport('Verbale corretto'), 'fix verbale')
      const green = validateChanged(repo, base, fixedHead)
      assert.equal(green.status, 0, green.output)
      assert.match(green.output, /OK: 1\/1 report MSS validi/)
    })
  }],
  ['changed reports: diff vuoto termina verde con messaggio coerente', () => {
    withTempGitRepo(({ repo, base }) => {
      const result = validateChanged(repo, base, base)
      assert.equal(result.status, 0, result.output)
      assert.match(result.output, /nessun Report-\*\.md o Verbale-\*\.md aggiunto o modificato/)
    })
  }],
  ['changed reports: file non pertinente viene ignorato', () => {
    withTempGitRepo(({ repo, base }) => {
      const path = `${SESSIONI}/23-08-26/audit/deep/Nota-non-pertinente.md`
      const head = commitFile(repo, path, invalidReport('Nota non pertinente'), 'add unrelated note')
      const result = validateChanged(repo, base, head)
      assert.equal(result.status, 0, result.output)
      assert.doesNotMatch(result.output, /valido docs\//)
      assert.match(result.output, /nessun Report-\*\.md o Verbale-\*\.md aggiunto o modificato/)
    })
  }],
  ['query: output dichiara HEAD, working tree e le due famiglie canoniche', () => {
    const result = runQuery({ root: REPO_ROOT, isTTY: false })
    assert.equal(result.exitCode, 0, result.stderr)
    assert.match(result.stdout, /albero HEAD \+ working tree/)
    assert.ok((result.stdout.match(/Verbale-\*\.md/g) || []).length >= 3)
    assert.match(result.stdout, /Report-\*\.md e Verbale-\*\.md esaminati/)
    assert.match(result.stdout, /Report-\*\.md e Verbale-\*\.md con intestazione capsula/)
    // Il perimetro dichiarato dall'help deve nominare la cartella CONFIGURATA, non una cablata:
    // confronto per sottostringa, cosi il criterio non dipende da come si scappano i metacaratteri.
    const attesoPerimetro = `${CONFIG.reportKinds.map((k) => `${k}-*.md`).join(' o ')} sotto ${SESSIONI}/`
    assert.ok(result.stdout.includes(attesoPerimetro), `help non dichiara il perimetro «${attesoPerimetro}»`)
    assert.doesNotMatch(result.stdout, /file Report-\*\.md esaminati/)
    assert.doesNotMatch(result.stdout, /file Report-\*\.md con intestazione capsula/)
    assert.doesNotMatch(result.stdout, /si chiamano Report-\*\.md sotto/)
  }],
  ['query: catena amends applicata conserva grezzo ed espone effettivo', () => {
    const records = validBundle()
    const first = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000021',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000041',
      ordinal: 1,
      corrected: 'prima correzione',
    })
    const second = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000022',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000042',
      ordinal: 2,
      previous: 'prima correzione',
      corrected: 'seconda correzione',
      effectiveAt: '2026-08-10T10:06:00+02:00',
    })
    const data = queryData([...records, first, second])
    const vista = buildVistaEffettiva(data)
    assert.equal(records[0].event.open_items, 'nessuno')
    assert.equal(effectiveRecord(vista).event.open_items, 'seconda correzione')
    assert.deepEqual(vista.applicate.map((entry) => entry.corretto), ['prima correzione', 'seconda correzione'])
    assert.equal(vista.nonRisolte.length, 0)
  }],
  ['query: previous mismatch resta visibile e non corregge il target', () => {
    const wrong = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000023',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000043',
      ordinal: 3,
      previous: 'valore sbagliato',
    })
    const vista = buildVistaEffettiva(queryData([...validBundle(), wrong]))
    assert.equal(effectiveRecord(vista).event.open_items, 'nessuno')
    assert.ok(vista.nonRisolte.some((entry) => entry.rule === 'MSS-AMENDMENT-PREVIOUS-MISMATCH'))
  }],
  ['query: amendment orfano classificato', () => {
    const orphan = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000024',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000044',
      ordinal: 4,
      target: 'mss-rec-0198b200-0001-7000-8000-000000000099',
    })
    const vista = buildVistaEffettiva(queryData([...validBundle(), orphan]))
    assert.ok(vista.nonRisolte.some((entry) => entry.rule === 'MSS-AMENDMENT-ORPHAN'))
  }],
  ['query: target draft classificato non final', () => {
    const records = validBundle()
    records[0].finalization = 'draft'
    const correction = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000025',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000045',
      ordinal: 5,
    })
    const vista = buildVistaEffettiva(queryData([...records, correction]))
    assert.ok(vista.nonRisolte.some((entry) => entry.rule === 'MSS-AMENDMENT-TARGET-NOT-FINAL'))
    assert.equal(effectiveRecord(vista).event.open_items, 'nessuno')
  }],
  ['query: supersedes non applica payload ed e dichiarato unsupported', () => {
    const supersedes = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000026',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000046',
      ordinal: 6,
      relation: 'supersedes',
    })
    const vista = buildVistaEffettiva(queryData([...validBundle(), supersedes]))
    assert.equal(vista.applicate.length, 0)
    assert.equal(effectiveRecord(vista).event.open_items, 'nessuno')
    assert.ok(vista.nonRisolte.some((entry) => entry.rule === 'MSS-AMENDMENT-SUPERSEDES-UNSUPPORTED'))
  }],
  ['query: tie-break stesso effective_at stabile su record_id e input invertito', () => {
    const lower = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000027',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000047',
      ordinal: 7,
      corrected: 'intento identico',
    })
    const higher = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000028',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000048',
      ordinal: 8,
      corrected: 'intento identico',
    })
    const forward = buildVistaEffettiva(queryData([...validBundle(), lower, higher]))
    const reverse = buildVistaEffettiva(queryData([...validBundle(), higher, lower]))
    assert.equal(effectiveRecord(forward).event.open_items, 'intento identico')
    assert.equal(effectiveRecord(reverse).event.open_items, 'intento identico')
    assert.equal(forward.applicate[0].amendment_id, lower.amendment.amendment_id)
    assert.equal(reverse.applicate[0].amendment_id, lower.amendment.amendment_id)
  }],
  ['query: collisione anteprima marcata e JSON conserva i valori interi', () => {
    const prefix = 'x'.repeat(70)
    const records = validBundle()
    records[0].event.observed_outcome = `${prefix}A-finale-grezzo`
    const correction = syntheticAmendment({
      recordId: 'mss-rec-0198b200-0001-7000-8000-000000000029',
      amendmentId: 'mss-amd-0198b200-0001-7000-8000-000000000049',
      ordinal: 9,
      fieldPath: 'event.observed_outcome',
      previous: `${prefix}A-finale-grezzo`,
      corrected: `${prefix}B-finale-effettivo`,
    })
    const data = queryData([...records, correction])
    const vista = buildVistaEffettiva(data)
    const human = renderVerifica(data, vista).join('\n')
    const payload = buildQueryPayload(data, vista)
    const applied = payload.verifica.vista_effettiva.applicati[0]
    assert.match(human, /le due anteprime coincidono/)
    assert.equal(applied.precedente, `${prefix}A-finale-grezzo`)
    assert.equal(applied.corretto, `${prefix}B-finale-effettivo`)
  }],
  ['query: --fail usa denominatore calcolato, non literal storico 42', () => {
    const data = syntheticCorpus({ sessionCount: 7, absentControls: 3 })
    assert.equal(data.sessions.length, 7)
    const vista = buildVistaEffettiva(data)
    const output = renderFail(data, vista).join('\n')
    assert.match(output, /3 sedute su 7/)
    assert.doesNotMatch(output, /10 sedute su 42/)
    assert.doesNotMatch(output, /su 42 non ne dichiarano/)
  }],
  ['status: owner PLAN non espone 32 gruppi o 9\/9 tools come dati correnti', 'owner-di-progetto', () => {
    const planPath = join(REPO_ROOT, 'docs/MetaSkillSystem/PLAN_V0.md')
    const planText = readFileSync(planPath, 'utf8')
    const skBlock = planText.slice(planText.indexOf('### 4-bis.'))
    assert.doesNotMatch(skBlock, /32 gruppi/)
    assert.doesNotMatch(skBlock, /tools 9\/9/)
    assert.doesNotMatch(skBlock, /\(9\/9\)/)
    const status = runStatus({ root: REPO_ROOT, isTTY: false })
    assert.equal(status.exitCode, 0, status.stderr)
    assert.doesNotMatch(status.stdout, /32 gruppi/)
    assert.doesNotMatch(status.stdout, /9\/9/)
  }],
  ['status: owner e Git sintetici producono stato nominale senza divergenze', () => {
    const planText = `\n## 4. Quadro corrente\n\n| Ordine | Pacchetto | Stato |\n|---|---|---|\n| 1 | \`WP-1\` | \`NON INIZIATO — NO-GO\` |\n\n### 4-bis. Pacchetti\n\n| Ordine | Pacchetto | Stato | Prova |\n|---|---|---|---|\n| S11 | \`SK-11\` — tools | \`IN CORSO\` | suite sintetica |\n`
    const packText = `\n## 4. Stato corrente\n\n| Pacchetto | Nota | Stato |\n|---|---|---|\n| \`SEP-11\` | synthetic | \`IN_CORSO\` |\n| \`SEP-10\` | synthetic | \`CHIUSO\` |\n`
    const output = buildStatusReport({
      planText,
      packText,
      gitState: {
        branch: 'env/synthetic', head: 'abc1234', upstream: 'abc1234',
        ahead: { ahead: 0, behind: 0 }, dirty: [], tags: [], stash: 0, worktrees: 1,
      },
      isTTY: false,
      planOwner: 'sintetico/PLAN.md',
      packOwner: 'sintetico/MASTERPLAN.md',
    })
    assert.match(output, /branch\s+env\/synthetic/)
    assert.match(output, /SK-11\s+IN CORSO/)
    assert.match(output, /SEP-11\s+IN_CORSO/)
    assert.match(output, /nessuna divergenza sui verdetti dichiarati/)
  }],
  ['status: owner assenti e Git non disponibile restano non ricostruibili', () => {
    const output = buildStatusReport({
      planText: null,
      packText: null,
      gitState: {
        branch: null, head: null, upstream: null, ahead: null,
        dirty: [], tags: [], stash: 0, worktrees: 0,
      },
      isTTY: false,
      planOwner: 'sintetico/PLAN.md',
      packOwner: 'sintetico/MASTERPLAN.md',
    })
    assert.match(output, /branch\s+non ricostruibile/)
    assert.match(output, /HEAD\s+non ricostruibile/)
    assert.equal((output.match(/non ricostruibile — apri/g) || []).length, 3)
    assert.doesNotMatch(output, /env\/test|eee6cf7|SK-6\s+CHIUSO/)
  }],
  ['SK-2 / status: gate autorizzato deriva dall\'ultimo ciclo PLAN, non da gate storici', () => {
    const historical = [
      '### Quinto ciclo — `M-F` eseguito e **CHIUSO**',
      '**Prossima azione autorizzata: `M-E`** (attrezzi mancanti, `T1`).',
      '### Quattordicesimo ciclo — `T7` eseguito **CON RISERVE**',
      '### Tredicesimo ciclo — `T6` eseguito e **CHIUSO**',
      '**Prossima azione autorizzata: `T8`** (pubblicazione commit).',
      '**Stato R1 attuale:** `R1` è **CHIUSO CON RISERVE — sintetico**',
    ].join('\n')
    const planText = `\n## 4. Quadro corrente\n| x | WP-1 | NON INIZIATO |\n${historical}\n\n### 4-bis.\n| S2 | SK-2 | IMPLEMENTATO | ✅ 163 file, 1346 test congelati |\n`
    const gate = parsePlanGate(planText)
    assert.equal(gate.next, 'T8')
    assert.equal(gate.closedId, 'T6')
    assert.notEqual(gate.closedId, 'T7', 'T7 CON RISERVE non è un ciclo chiuso')
    assert.notEqual(gate.closedId, 'M-F', 'un ciclo T chiuso successivo a M-* governa l\'ultimo chiuso')
    const output = buildStatusReport({
      planText,
      packText: null,
      gitState: {
        branch: 'env/synthetic', head: 'abc1234', upstream: null,
        ahead: null, dirty: [], tags: [], stash: 0, worktrees: 1,
      },
      viewResults: [{ id: 'cruscotto-matteo', target: 'sintetico/CRUSCOTTO.md', stale: false }],
      isTTY: false,
      planOwner: 'sintetico/PLAN.md',
    })
    assert.match(output, /ultimo chiuso\s+`T6`/)
    assert.match(output, /prossimo\s+`T8`/)
    assert.doesNotMatch(output, /prossimo\s+`M-E`/)
    assert.doesNotMatch(output, /163 file/)
    assert.doesNotMatch(output, /1346 test/)
    assert.match(output, /cruscotto-matteo\s+allineata/)

    const live = runStatus({ root: REPO_ROOT, isTTY: false })
    assert.equal(live.exitCode, 0, live.stderr)
    const liveGate = parsePlanGate(readFileSync(join(REPO_ROOT, 'docs/MetaSkillSystem/PLAN_V0.md'), 'utf8'))
    assert.equal(liveGate.closedId, 'T6')
    assert.equal(liveGate.next, 'T8')
    assert.match(live.stdout, /ultimo chiuso\s+`T6`/)
    assert.match(live.stdout, new RegExp(`prossimo\\s+\`${liveGate.next}\``))
    assert.doesNotMatch(live.stdout, /prossimo\s+`M-E`/)
    assert.doesNotMatch(live.stdout, /32 gruppi/)
    assert.doesNotMatch(live.stdout, /9\/9/)
  }],
  ['capsule: golden — input fisso produce bundle identico', () => {
    const first = recordsToJsonl(buildCapsuleBundle(goldenCapsuleOptions()))
    const second = recordsToJsonl(buildCapsuleBundle(goldenCapsuleOptions()))
    assert.equal(first, second)
    assert.match(first, /mss-ses-0198b000-0001-7000-8000-000000000001/)
    assert.match(first, /"segment_no":1/)
    assert.doesNotMatch(first, /2026-08-23T17:07:00/)
  }],
  ['capsule: R1 — tre soli giudizi compongono una capsula valida senza busta JSON manuale', () => {
    const judgments = {
      persona: { delta: 'nessuno', assertions: [] },
      sistema: { delta: 'nessuno', assertions: [] },
      output: { delta: 'nessuno', assertions: [] },
    }
    const template = buildR1JudgmentsTemplate()
    assert.equal(Object.hasOwn(template, 'session_event'), false)
    assert.deepEqual(Object.keys(judgments).sort(), ['output', 'persona', 'sistema'])

    withTempGitRepo(({ repo }) => {
      const records = buildCapsuleBundle(goldenCapsuleOptions({
        judgments,
        root: repo,
        reportPath: `${SESSIONI}/24-08-26/Report-r1-compact.md`,
      }))
      const jsonl = recordsToJsonl(records)
      const event = records[0].event
      assert.match(event.intent_user, /^non_osservato:/)
      assert.match(event.area, /^non_osservato:/)
      assert.match(event.observed_outcome, /^non_osservato:/)
      assert.match(event.open_items, /^non_osservato:/)
      // Enum obbligatori: costanti di mode documentate, non «osservate» dalla chat.
      assert.equal(event.session_type, R1_MODE_CONSTANTS.session_type)
      assert.equal(event.capsule_status, R1_MODE_CONSTANTS.capsule_status)
      assert.equal(event.privacy.classification, R1_MODE_CONSTANTS.privacy.classification)
      assert.equal(event.environment, 'branch fixture; HEAD abc1234; 0 file in working tree')
      assert.deepEqual(event.authorization.write, [`${SESSIONI}/24-08-26/Report-r1-compact.md`])
      assert.equal(records[1].annotation.assertions.length, 0)
      const reportPath = `${SESSIONI}/24-08-26/Report-r1-compact.md`
      const report = `# R1 compact\n${formatCapsuleBlock(jsonl)}`
      writeRepoFile(repo, reportPath, report)
      const result = validateMss({ kind: 'report', file: reportPath, content: report }, { workspaceRoot: repo })
      assert.equal(result.ok, true, JSON.stringify(result.diagnostics, null, 2))
    })
  }],
  ['capsule: P4/SK-11 — template R1 privacy resta di mode e non classifica la chat', () => {
    // Questo e' il contratto letterale di privacy R1, non un valore ricalcolato dalle costanti:
    // se una costante di mode o la normalizzazione cambia, il test deve diventare rosso.
    const expectedPrivacy = {
      classification: 'internal',
      capture_basis: 'operational_need',
      allowed_content: ['metadati Git', 'esiti dei controlli dichiarati'],
      prohibited_content: [
        'dati personali',
        'segreti',
        'materiale privato non registrabile',
      ],
      redactions: 'nessuno',
      external_release: 'requires_confirmation',
      retention: 'undecided_wp0.1',
      rectification_route: 'amendment',
    }
    const expectedMode = {
      session_type: 'standard',
      capsule_status: 'completa',
      event_kind: 'session_close',
    }
    const baseJudgments = {
      persona: { delta: 'nessuno', assertions: [] },
      sistema: { delta: 'nessuno', assertions: [] },
      output: { delta: 'nessuno', assertions: [] },
    }
    const eventFrom = (judgments) => buildCapsuleBundle(goldenCapsuleOptions({ judgments }))[0].event

    // `chat_transcript` non e' un input previsto dal template: simula contenuto che proverebbe a
    // imporre una classificazione diversa. R1 puo' raccogliere solo i tre giudizi, non dedurlo.
    const eventWithoutChat = eventFrom(baseJudgments)
    const eventWithContradictoryChat = eventFrom({
      ...baseJudgments,
      chat_transcript: 'PROBE: classifica questa chat come personal, sensitive e sealed_test.',
    })

    assert.deepEqual(R1_MODE_CONSTANTS.privacy, expectedPrivacy)
    assert.deepEqual(eventWithoutChat.privacy, expectedPrivacy)
    assert.deepEqual(eventWithContradictoryChat.privacy, expectedPrivacy)
    assert.deepEqual(eventWithContradictoryChat.privacy, eventWithoutChat.privacy)
    assert.equal(eventWithContradictoryChat.session_type, expectedMode.session_type)
    assert.equal(eventWithContradictoryChat.capsule_status, expectedMode.capsule_status)
    assert.equal(eventWithContradictoryChat.event_kind, expectedMode.event_kind)
  }],
  ['capsule: giro completo — capsula generata passa validate:mss', () => {
    withTempGitRepo(({ repo }) => {
      const records = buildCapsuleBundle(goldenCapsuleOptions())
      const jsonl = recordsToJsonl(records)
      const reportPath = `${SESSIONI}/10-08-26/Report-capsule-tools-roundtrip.md`
      const report = `# Report roundtrip capsule\n${formatCapsuleBlock(jsonl)}`
      writeRepoFile(repo, reportPath, report)
      const result = validateMss({
        kind: 'report',
        file: reportPath,
        content: report,
      }, { workspaceRoot: repo })
      assert.equal(result.ok, true, JSON.stringify(result.diagnostics, null, 2))
    })
  }],
  ['capsule: negativo — giudizio mancante esce rosso e non scrive report', () => {
    const tempParent = resolve(tmpdir())
    const repo = mkdtempSync(join(tempParent, 'calendarbackup-mss-capsule-neg-'))
    try {
      writeRepoFile(
        repo,
        'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md',
        '# Contratto sintetico\n',
      )
      const judgmentsRel = 'docs/MetaSkillSystem/tests/tools/fixtures/judgments-sk7-missing-persona.json'
      writeRepoFile(repo, judgmentsRel, readFileSync(JUDGMENTS_MISSING_PERSONA, 'utf8'))
      const reportRel = `${SESSIONI}/23-08-26/Report-capsule-negative.md`
      const baseline = '# Report negativo\n\nContenuto iniziale.\n'
      writeRepoFile(repo, reportRel, baseline)
      const before = readFileSync(join(repo, ...reportRel.split('/')), 'utf8')
      const result = runCapsule([
        process.argv[0],
        'capsule.mjs',
        '--judgments', judgmentsRel,
        '--model', 'fixture-model',
        '--append-to', reportRel,
      ], { root: repo, env: { TERM_PROGRAM: 'cursor' } })
      assert.notEqual(result.exitCode, 0)
      assert.match(result.stderr, /persona/)
      const after = readFileSync(join(repo, ...reportRel.split('/')), 'utf8')
      assert.equal(after, before)
      assert.doesNotMatch(after, /Capsula MetaSkillSystem/)
    } finally {
      rmSync(repo, { recursive: true, force: true })
    }
  }],
  ['capsule: controls — esiti veri nei due sensi, virgolette preservate', () => {
    const [npmCheck, failCheck, quotedCheck] = runChecks([
      // `npm` era il caso rotto su Windows: `npm.cmd` senza shell esce EINVAL,
      // `status` torna null e il controllo finiva in capsula come `fail` pur passando.
      { control_id: 'CTRL-NPM', command: 'npm --version' },
      // Il verso opposto, ugualmente falso prima del fix: un comando che fallisce
      // davvero veniva registrato `pass` perché le virgolette sparivano nello split.
      { control_id: 'CTRL-FAIL', command: 'node -e "process.exit(3)"' },
      // Un argomento con uno spazio dentro — la forma dei path di questo repo.
      {
        control_id: 'CTRL-QUOTE',
        command: `node -e "process.exit(process.argv[1] === 'due parole' ? 0 : 4)" "due parole"`,
      },
    ], { cwd: REPO_ROOT })

    assert.equal(npmCheck.esito, 'pass', npmCheck.esecutore)
    assert.equal(npmCheck.numeratore, 1)
    assert.match(npmCheck.esecutore, /exit 0; atteso 0/)

    assert.equal(failCheck.esito, 'fail', failCheck.esecutore)
    assert.equal(failCheck.numeratore, 0)
    assert.match(failCheck.esecutore, /exit 3; atteso 0/)

    assert.equal(quotedCheck.esito, 'pass', quotedCheck.esecutore)
  }],
  ['capsule: controls — comando non partito e non_noto, mai fail', () => {
    const [check] = runChecks(
      [{ control_id: 'CTRL-NORUN', command: 'node --version' }],
      { cwd: join(REPO_ROOT, 'cartella-che-non-esiste-mss-tools') },
    )

    // `fail` affermerebbe che il criterio non e soddisfatto: qui non lo sappiamo.
    assert.equal(check.esito, 'non_noto', check.esecutore)
    assert.equal(check.numeratore, 0)
    assert.equal(check.denominatore, 1)
    assert.match(check.esecutore, /non eseguito/)
  }],
  ['capsule: git — la prima riga di porcelain non perde il primo carattere del path', () => {
    withTempGitRepo(({ repo }) => {
      // Un file che comincia con il punto e che ordina per primo: porcelain lo emette
      // come ` M .aaa-config.json`, con lo spazio iniziale. Un trim sull'intero output
      // se lo mangiava e `slice(3)` si portava via anche il punto.
      writeRepoFile(repo, '.aaa-config.json', '{"v":1}\n')
      runGit(repo, 'add', '--', '.aaa-config.json')
      runGit(repo, 'commit', '-m', 'aggiunge config')
      writeRepoFile(repo, '.aaa-config.json', '{"v":2}\n')

      const context = collectGitContext(repo)
      assert.ok(
        context.changedFiles.includes('.aaa-config.json'),
        `path corrotto: ${JSON.stringify(context.changedFiles)}`,
      )
      assert.equal(context.changedFiles.includes('aaa-config.json'), false)
    })
  }],
  ['capsule: git — i file cancellati non diventano source_refs irrisolvibili', () => {
    withTempGitRepo(({ repo }) => {
      writeRepoFile(repo, 'docs/da-cancellare.md', '# temporaneo\n')
      writeRepoFile(repo, 'docs/resta.md', '# resta\n')
      runGit(repo, 'add', '--', 'docs/da-cancellare.md', 'docs/resta.md')
      runGit(repo, 'commit', '-m', 'aggiunge file')
      rmSync(join(repo, 'docs', 'da-cancellare.md'))
      writeRepoFile(repo, 'docs/resta.md', '# resta modificato\n')

      const context = collectGitContext(repo)
      assert.ok(context.changedFiles.includes('docs/da-cancellare.md'), 'git deve vedere la cancellazione')

      const refs = buildSourceRefsFromGit(context.changedFiles, context.headShort, { root: repo })
      const paths = refs.map((r) => r.uri_or_path)
      assert.equal(paths.includes('docs/da-cancellare.md'), false, 'il file cancellato non e referenziabile')
      assert.ok(paths.includes('docs/resta.md'), 'il file tracked presente resta referenziato')
      // I ref_id restano una numerazione densa anche dopo lo scarto.
      assert.deepEqual(refs.map((r) => r.ref_id), refs.map((_, i) => `source-git-${i + 1}`))
    })
  }],
  ['capsule: git — source_refs solo path indexed (tracked/modificato sì, untracked e cancellati no)', () => {
    withTempGitRepo(({ repo }) => {
      writeRepoFile(repo, 'docs/tracked-mod.md', 'v1\n')
      writeRepoFile(repo, 'docs/to-delete.md', 'bye\n')
      runGit(repo, 'add', '--', 'docs/tracked-mod.md', 'docs/to-delete.md')
      runGit(repo, 'commit', '-m', 'aggiunge tracked')

      writeRepoFile(repo, 'docs/tracked-mod.md', 'v2\n')
      writeRepoFile(repo, 'docs/untracked-new.md', 'solo working tree\n')
      rmSync(join(repo, 'docs', 'to-delete.md'))

      const context = collectGitContext(repo)
      assert.ok(context.changedFiles.includes('docs/tracked-mod.md'), 'diagnostica: tracked modificato')
      assert.ok(context.changedFiles.includes('docs/untracked-new.md'), 'diagnostica: untracked resta in changedFiles')
      assert.ok(context.changedFiles.includes('docs/to-delete.md'), 'diagnostica: cancellato resta in changedFiles')

      const refs = buildSourceRefsFromGit(context.changedFiles, context.headShort, { root: repo })
      const paths = refs.map((r) => r.uri_or_path)
      assert.ok(paths.includes('docs/tracked-mod.md'), 'tracked modificato → source_ref')
      assert.equal(paths.includes('docs/untracked-new.md'), false, 'untracked ?? → escluso')
      assert.equal(paths.includes('docs/to-delete.md'), false, 'cancellato → escluso')
      assert.deepEqual(refs.map((r) => r.ref_id), refs.map((_, i) => `source-git-${i + 1}`))
    })
  }],
  ['capsule: parseCheckSpec — forma canonica conserva ID e comando', () => {
    const parsed = parseCheckSpec('test:mss=>npm run test:mss')
    assert.equal(parsed.control_id, 'test:mss')
    assert.equal(parsed.command, 'npm run test:mss')
  }],
  ['capsule: parseCheckSpec — comando con ulteriori => (arrow function) resta integro', () => {
    const raw = 'arrow=>node -e "const f = x => x; process.exit(f(0))"'
    const parsed = parseCheckSpec(raw)
    assert.equal(parsed.control_id, 'arrow')
    assert.equal(parsed.command, 'node -e "const f = x => x; process.exit(f(0))"')
  }],
  ['capsule: runChecks — comando con arrow function => passa exit 0', () => {
    const [check] = runChecks([
      {
        control_id: 'CTRL-ARROW',
        command: 'node -e "const f = x => x; process.exit(f(0))"',
      },
    ], { cwd: REPO_ROOT })
    assert.equal(check.esito, 'pass', check.esecutore)
    assert.equal(check.numeratore, 1)
    assert.match(check.esecutore, /exit 0; atteso 0/)
  }],
  ['capsule: parseCheckSpec — legacy semplice con un solo colon resta valido', () => {
    const parsed = parseCheckSpec('SK7:npm --version')
    assert.equal(parsed.control_id, 'SK7')
    assert.equal(parsed.command, 'npm --version')
  }],
  ['capsule: N3 — quote Windows sospette avvisano invece di accusare silenziosamente il bersaglio', () => {
    const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup mss-n3-'))
    try {
      const file = join(root, 'report con spazi.mjs')
      writeFileSync(file, 'process.exit(0)\n')
      const [singleQuoted, unquotedPath, doubleQuoted] = runChecks([
        { control_id: 'N3-SINGLE-QUOTE', command: `node --check '${file}'` },
        { control_id: 'N3-UNQUOTED-PATH', command: `node --check ${file}` },
        { control_id: 'N3-DOUBLE-QUOTE', command: `node --check "${file}"` },
      ], { cwd: REPO_ROOT })
      if (process.platform === 'win32') {
        assert.equal(singleQuoted.esito, 'fail', singleQuoted.esecutore)
        assert.equal(unquotedPath.esito, 'fail', unquotedPath.esecutore)
        assert.equal(doubleQuoted.esito, 'pass', doubleQuoted.esecutore)
        assert.match(singleQuoted.esecutore, /AVVISO.*virgolette singole/)
        assert.match(unquotedPath.esecutore, /AVVISO.*path probabilmente non quotato/)
        assert.doesNotMatch(doubleQuoted.esecutore, /AVVISO/)
      } else {
        for (const check of [singleQuoted, unquotedPath, doubleQuoted]) assert.doesNotMatch(check.esecutore, /AVVISO/)
      }
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }],
  ['capsule: N4 — check-expect registra un controllo a segno invertito come pass', () => {
    const args = parseCapsuleArgs([
      process.argv[0], 'capsule.mjs', '--check', 'N4=>node -e "process.exit(3)"', '--check-expect', '3',
    ])
    assert.equal(args.checks[0].expectedExit, 3)
    const [check] = runChecks(args.checks, { cwd: REPO_ROOT })
    assert.equal(check.esito, 'pass', check.esecutore)
    assert.match(check.criterio, /atteso exit 3/)
    assert.match(check.esecutore, /exit 3; atteso 3/)
    assert.throws(() => parseCapsuleArgs([process.argv[0], 'capsule.mjs', '--check-expect', '1']), /immediatamente precedente/)
    assert.throws(() => parseCapsuleArgs([process.argv[0], 'capsule.mjs', '--check', 'A=>node --version', '--tool', 'fs', '--check-expect', '1']), /immediatamente precedente/)
    assert.throws(() => parseCapsuleArgs([process.argv[0], 'capsule.mjs', '--check', 'A=>node --version', '--check-expect', '-1']), /maggiore o uguale/)
  }],
  ['capsule: parseCheckSpec — D3 storico ambiguo rifiutato', () => {
    assert.throws(
      () => parseCheckSpec('test:mss:npm run test:mss'),
      (error) => error.message.includes('ambiguo') && error.message.includes('=>'),
    )
  }],
  ['capsule: parseCheckSpec — D2 storico ambiguo rifiutato', () => {
    assert.throws(
      () => parseCheckSpec('x::node --version'),
      (error) => error.message.includes('ambiguo'),
    )
  }],
  ['capsule: CLI — check ambiguo exit 2 e nessuna capsula', () => {
    const result = runCapsule([
      process.argv[0],
      'capsule.mjs',
      '--judgments', JUDGMENTS_MINIMAL,
      '--model', 'fixture-model',
      '--check', 'test:mss:npm run test:mss',
    ], { root: REPO_ROOT, env: { TERM_PROGRAM: 'cursor' } })
    assert.equal(result.exitCode, 2, result.stderr)
    assert.match(result.stderr, /ambiguo/)
    assert.equal(result.stdout, '')
  }],
  ['capsule: runChecks — comando vuoto non eseguito e mai pass', () => {
    const [empty, whitespace] = runChecks([
      { control_id: 'CTRL-EMPTY', command: '' },
      { control_id: 'CTRL-WS', command: '   ' },
    ], { cwd: REPO_ROOT })
    for (const check of [empty, whitespace]) {
      assert.notEqual(check.esito, 'pass', check.esecutore)
      assert.equal(check.numeratore, 0)
      assert.match(check.esecutore, /non eseguito|non valido/)
    }
  }],
  ['capsule: template — nessun path privato concreto, categoria generica presente', () => {
    const template = buildJudgmentsTemplate()
    const serialized = JSON.stringify(template)
    assert.doesNotMatch(serialized, /docs\/_lavoro/)
    assert.match(serialized, /materiale privato non registrabile/)
  }],
  ['capsule: privacy — categorie generiche in prohibited_content non bloccano', () => {
    const judgments = readJson(JUDGMENTS_MINIMAL)
    judgments.session_event.privacy.prohibited_content = [
      'materiale privato non registrabile',
      'segreti',
    ]
    const records = buildCapsuleBundle(goldenCapsuleOptions({ judgments }))
    assert.ok(records.length >= 4)
    const jsonl = recordsToJsonl(records)
    assert.match(jsonl, /session_event/)
  }],
  ['capsule: privacy — sentinella in env non whitelisted assente dal JSONL', () => {
    const FAKE_SENTINEL = 'FAKE_MSS_SENTINEL_XYZ_NOT_REAL'
    const records = buildCapsuleBundle(goldenCapsuleOptions({
      env: {
        TERM_PROGRAM: 'cursor',
        CURSOR_AGENT: 'fixture-agent',
        FAKE_MSS_SENTINEL_ENV: FAKE_SENTINEL,
      },
    }))
    const jsonl = recordsToJsonl(records)
    assert.doesNotMatch(jsonl, new RegExp(FAKE_SENTINEL))
  }],
  ['capsule: N1 — report che dichiara gia una capsula numerata: exit non-zero e nessuna scrittura', () => {
    // Riproduzione reale del 24-08-26. Il report dichiara la sezione come prescrive
    // CHIUSURA_SESSIONE.md §6-bis, cioe con l'intestazione NUMERATA. La vecchia guardia cercava
    // la sottostringa `## Capsula MetaSkillSystem` e non la vedeva: l'attrezzo usciva 0, scriveva
    // una SECONDA sezione, e validate:mss diceva poi MSS-PARSE-JSONL-AMBIGUOUS.
    withTempGitRepo(({ repo }) => {
      const judgmentsRel = 'judgments-n1.json'
      writeRepoFile(repo, judgmentsRel, readFileSync(JUDGMENTS_MINIMAL, 'utf8'))
      const reportRel = `${SESSIONI}/24-08-26/Report-n1-capsula-doppia.md`
      const jsonl = recordsToJsonl(buildCapsuleBundle(goldenCapsuleOptions()))
      const baseline = `# Report N1\n\n## 6-bis. Capsula MetaSkillSystem\n\n\`\`\`jsonl\n${jsonl}\`\`\`\n`
      writeRepoFile(repo, reportRel, baseline)

      const result = runCapsule([
        process.argv[0], 'capsule.mjs',
        '--judgments', judgmentsRel,
        '--model', 'fixture-model',
        '--append-to', reportRel,
      ], { root: repo, env: { TERM_PROGRAM: 'cursor' } })

      assert.notEqual(result.exitCode, 0, `atteso exit non-zero, avuto ${result.exitCode}`)
      assert.match(result.stderr, /Capsula MetaSkillSystem/)
      const after = readFileSync(join(repo, ...reportRel.split('/')), 'utf8')
      assert.equal(after, baseline, 'il report non deve essere toccato')
      assert.equal(countCapsuleHeadings(after), 1, 'nessuna seconda sezione capsula')
    })
  }],
  ['capsule: N1 — giudizi completi ma fuori dominio (G: 3) non vengono scritti', () => {
    // L'altra riproduzione del 24-08-26: validateJudgments guarda che i tre giudizi CI SIANO,
    // non che siano VALIDI. Il dominio contrattuale ferma G a 2 (core.mjs). Prima del fix
    // l'attrezzo usciva 0 e scriveva; validate:mss diceva poi MSS-SYSTEM-ASSERTION.
    withTempGitRepo(({ repo }) => {
      const judgments = readJson(JUDGMENTS_MINIMAL)
      judgments.annotations.sistema.assertions[0].G = 3
      const judgmentsRel = 'judgments-n1-goe.json'
      writeRepoFile(repo, judgmentsRel, JSON.stringify(judgments, null, 2))
      const reportRel = `${SESSIONI}/24-08-26/Report-n1-goe-fuori-dominio.md`
      const baseline = '# Report N1 G/O/E\n\nCorpo del report.\n'
      writeRepoFile(repo, reportRel, baseline)

      const result = runCapsule([
        process.argv[0], 'capsule.mjs',
        '--judgments', judgmentsRel,
        '--model', 'fixture-model',
        '--append-to', reportRel,
      ], { root: repo, env: { TERM_PROGRAM: 'cursor' } })

      assert.notEqual(result.exitCode, 0, `atteso exit non-zero, avuto ${result.exitCode}`)
      assert.match(result.stderr, /MSS-SYSTEM-ASSERTION/)
      assert.equal(result.stdout, '', 'nessuna capsula su stdout')
      const after = readFileSync(join(repo, ...reportRel.split('/')), 'utf8')
      assert.equal(after, baseline)
      assert.equal(countCapsuleHeadings(after), 0)
    })
  }],
  ['capsule: N2 — il revisore emette un amendment e --verifica mostra il verificatore', () => {
    // La verifica e per costruzione l'atto di un secondo attore su un record altrui: passa da
    // amendment (contratto §6), non da verified_by scritto sulle proprie annotazioni.
    const bersaglio = validBundle()
    const target = bersaglio.find((r) => r.record_id === IDS.recS)
    const records = buildCapsuleBundle(goldenCapsuleOptions({
      role: 'independent_reviewer_MC',
      verifications: [parseVerifySpec(
        `${IDS.recS}|independently_verified|source-contract|rieseguiti i comandi dichiarati nei controls`,
      )],
      lookupRecord: (id) => (id === IDS.recS ? { record: target, path: FIXED_PATH } : null),
      amendmentIds: [{
        record: '0198b000-0001-7000-8000-0000000000a1',
        amendment: '0198b000-0001-7000-8000-0000000000a2',
      }],
    }))

    const amd = records.find((r) => r.record_type === 'amendment')
    assert.ok(amd, 'la seduta deve emettere un amendment di verifica')
    assert.equal(amd.amendment.target_record_id, IDS.recS)
    assert.equal(amd.amendment.relation, 'amends')
    // I valori precedenti sono LETTI dal bersaglio, non ricordati: previous_value_or_hash
    // sbagliato = MSS-AMENDMENT-PREVIOUS-MISMATCH.
    const statusChange = amd.amendment.changes.find((c) => c.field_path === 'annotation.verification.status')
    assert.equal(statusChange.previous_value_or_hash, target.annotation.verification.status)
    assert.equal(statusChange.corrected_value, 'independently_verified')

    const data = queryData([...bersaglio, amd])
    const vista = buildVistaEffettiva(data)
    const human = renderVerifica(data, vista).join('\n')
    assert.match(human, /Nella vista EFFETTIVA \(dopo gli amendment\)/)
    assert.match(human, /verificato da cursor-fixture-model-sk7/)
    const payload = buildQueryPayload(data, vista)
    assert.ok(
      payload.verifica.vista_effettiva.applicati.some(
        (a) => a.field_path === 'annotation.verification.verified_by' && a.target_record_id === IDS.recS,
      ),
      'la vista effettiva deve applicare verified_by',
    )
  }],
  ['capsule: N2 — nessun amendment inventato quando il revisore non lo chiede, solo un avviso', () => {
    // Bloccare produrrebbe amendment di comodo: lo stesso dato inventato che R2 vieta.
    // Il template resta con verified_by: [] — e la verita per una seduta che non ha verificato.
    withTempGitRepo(({ repo }) => {
      const judgmentsRel = 'judgments-n2.json'
      writeRepoFile(repo, judgmentsRel, readFileSync(JUDGMENTS_MINIMAL, 'utf8'))
      const result = runCapsule([
        process.argv[0], 'capsule.mjs',
        '--judgments', judgmentsRel,
        '--model', 'fixture-model',
        '--role', 'independent_reviewer_MC',
      ], { root: repo, env: { TERM_PROGRAM: 'cursor' } })

      assert.equal(result.exitCode, 0, result.stderr)
      assert.equal(result.records.filter((r) => r.record_type === 'amendment').length, 0)
      assert.match(result.stderr, /non emette nessun amendment/)
      for (const record of result.records.filter((r) => r.record_type === 'annotation')) {
        assert.deepEqual(record.annotation.verification.verified_by, [])
      }
      // Un esecutore normale non deve ricevere l'avviso.
      const esecutore = runCapsule([
        process.argv[0], 'capsule.mjs',
        '--judgments', judgmentsRel,
        '--model', 'fixture-model',
      ], { root: repo, env: { TERM_PROGRAM: 'cursor' } })
      assert.equal(esecutore.exitCode, 0, esecutore.stderr)
      assert.doesNotMatch(esecutore.stderr, /non emette nessun amendment/)
    })
  }],
  ['capsule: N2 — --verify rifiuta bersaglio inesistente, esito fuori enum e self_report', () => {
    assert.throws(
      () => parseVerifySpec('non-un-id|independently_verified|source-contract|motivo'),
      /non e un record_id/,
    )
    assert.throws(
      () => parseVerifySpec(`${IDS.recS}|verificato_a_occhio|source-contract|motivo`),
      /non ammesso/,
    )
    // self_report su un record altrui non e una verifica: e la firma del proprio lavoro (R2).
    assert.throws(
      () => parseVerifySpec(`${IDS.recS}|self_report|source-contract|motivo`),
      /non ammesso/,
    )
    assert.throws(() => parseVerifySpec(`${IDS.recS}|contradicted|source-contract|`), /motivo mancante/)
    assert.throws(
      () => buildCapsuleBundle(goldenCapsuleOptions({
        verifications: [parseVerifySpec(`${IDS.recS}|contradicted|source-contract|motivo reale`)],
        lookupRecord: () => null,
      })),
      /non trovato nel corpus/,
    )
    // Il session_event non porta verification: lo stato di verifica vive sulle annotazioni (§5).
    assert.throws(
      () => buildCapsuleBundle(goldenCapsuleOptions({
        verifications: [parseVerifySpec(`${IDS.recEvt}|contradicted|source-contract|motivo reale`)],
        lookupRecord: () => ({ record: validBundle()[0], path: FIXED_PATH }),
      })),
      /annotazione/,
    )
  }],
  ['capsule: N5 — --verify e validator rifiutano un verificatore con stato incoerente', () => {
    assert.throws(
      () => parseVerifySpec(`${IDS.recS}|unverified|source-contract|motivo reale`),
      /non ammesso/,
    )
    const records = validBundle()
    const annotation = records.find((record) => record.record_type === 'annotation')
    annotation.annotation.verification = {
      status: 'unverified',
      verified_by: [{ actor_id: 'revisore-indipendente' }],
      verified_at: '2026-08-24T12:00:00+00:00',
      criterion_ref: 'source-contract',
      evidence_refs: [],
      notes: 'fixture incoerente',
    }
    const report = `# Report N5\n\n${formatCapsuleBlock(recordsToJsonl(records))}`
    const result = validateMss({ kind: 'report', file: FIXED_PATH, content: report }, { workspaceRoot: REPO_ROOT })
    assert.ok(result.diagnostics.some((issue) => issue.rule === 'MSS-VERIFIER-STATUS-INCOHERENT'), JSON.stringify(result.diagnostics))

    const amended = validBundle()
    const correction = amendment(IDS.recP)
    correction.amendment.changes = [
      {
        field_path: 'annotation.verification.status',
        previous_value_or_hash: 'self_report',
        corrected_value: 'unverified',
      },
      {
        field_path: 'annotation.verification.verified_by',
        previous_value_or_hash: [],
        corrected_value: [{ actor_id: 'revisore-indipendente' }],
      },
    ]
    const amendedReport = `# Report N5 amendment\n\n${formatCapsuleBlock(recordsToJsonl([...amended, correction]))}`
    const amendedResult = validateMss({ kind: 'report', file: FIXED_PATH, content: amendedReport }, { workspaceRoot: REPO_ROOT })
    assert.ok(amendedResult.diagnostics.some((issue) => issue.rule === 'MSS-VERIFIER-STATUS-INCOHERENT'), JSON.stringify(amendedResult.diagnostics))
  }],
  ['doctor: N6 — owner leggibile resta verde in una repo git init senza commit', async () => {
    const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup-mss-n6-'))
    try {
      runGit(root, 'init')
      mkdirSync(join(root, 'docs/Sessioni di lavoro'), { recursive: true })
      writeRepoFile(root, 'docs/MetaSkillSystem/PLAN_V0.md', [
        '# PLAN sintetico', '', '## 4. Quadro corrente', '',
        '| Ordine | Pacchetto | Stato |', '|---|---|---|', '| 1 | `WP-1` | `NON INIZIATO — NO-GO` |', '',
        '### 4-bis. Pacchetti', '',
        '| Ordine | Pacchetto | Stato | Prova |', '|---|---|---|---|', '| S11 | `SK-11` — tools | `IN CORSO` | la frase non ricostruibile e solo un esempio |',
      ].join('\n'))
      writeRepoFile(root, 'docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md', [
        '# Pack sintetico', '', '## 4. Stato corrente', '',
        '| Pacchetto | Nota | Stato |', '|---|---|---|', '| `SEP-11` | fixture | `IN_CORSO` |',
      ].join('\n'))
      const steps = await runDoctor({ root })
      const owner = steps.find((step) => step.name === 'owner')
      assert.ok(owner, 'il passo owner deve esistere')
      assert.equal(owner.state.trim(), 'ok', JSON.stringify(owner))
      assert.match(owner.detail, /stato derivato dagli owner/)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }],
  ['B4 — check-doc-paths: allowlist sopra il tetto dichiarato esce rosso e cita D21', () => {
    const source = readFileSync(REAL_CHECK_DOC_PATHS, 'utf8')
    const max = Number(source.match(/const ALLOWLIST_MAX = (\d+)/)?.[1])
    assert.ok(Number.isInteger(max) && max > 0, 'ALLOWLIST_MAX non trovato nello script reale')
    const result = runCheckDocPathsWithAllowlist(syntheticAllowlist(max + 1))
    assert.equal(result.status, 1, `atteso exit 1 sopra il tetto; stdout=${result.stdout} stderr=${result.stderr}`)
    assert.match(result.stderr, /D21/)
    assert.match(result.stderr, new RegExp(`ALLOWLIST_MAX=${max}`))
  }],
  ['B4 — check-doc-paths: allowlist al tetto dichiarato resta verde senza avviso', () => {
    const source = readFileSync(REAL_CHECK_DOC_PATHS, 'utf8')
    const max = Number(source.match(/const ALLOWLIST_MAX = (\d+)/)?.[1])
    const result = runCheckDocPathsWithAllowlist(syntheticAllowlist(max))
    assert.equal(result.status, 0, `atteso exit 0 al tetto; stdout=${result.stdout} stderr=${result.stderr}`)
    assert.doesNotMatch(result.stderr, /abbassa il tetto/)
  }],
  ['B4 — check-doc-paths: allowlist sotto il tetto avvisa di abbassarlo ma resta verde', () => {
    const source = readFileSync(REAL_CHECK_DOC_PATHS, 'utf8')
    const max = Number(source.match(/const ALLOWLIST_MAX = (\d+)/)?.[1])
    assert.ok(max > 1, 'serve un tetto > 1 per testare la discesa')
    const result = runCheckDocPathsWithAllowlist(syntheticAllowlist(max - 1))
    assert.equal(result.status, 0, `atteso exit 0 sotto il tetto (solo avviso); stdout=${result.stdout} stderr=${result.stderr}`)
    assert.match(result.stderr, /abbassa il tetto/)
  }],

  // ---------------------------------------------------------------- R8 — portabilita (24-08-26)

  ['R8 — senza override esplicito la formula del perimetro e IDENTICA al valore cablato prima di R8', () => {
    // PORTABILE: normalizeConfig({}) ignora qualunque mss.config.json installato (l'oggetto grezzo
    // e' vuoto), quindi vale in QUALSIASI repo, sorgente o ospite. E' la meta pura del vincolo R8:
    // un refuso nel costruttore della regex o nei default si vedrebbe qui, ovunque il test giri.
    assert.equal(String(buildReportPathRe(normalizeConfig({}))), ATTESO_PERIMETRO_STORICO)
    assert.equal(normalizeConfig({}).sessionsDir, 'docs/Sessioni di lavoro')
    assert.deepEqual([...normalizeConfig({}).reportKinds], ['Report', 'Verbale'])
    assert.equal(normalizeConfig({}).owners.plan, 'docs/MetaSkillSystem/PLAN_V0.md')
  }],

  ['R8 — owner-di-progetto: in QUESTA repo, senza mss.config.json, il perimetro ambientale resta quello storico', 'owner-di-progetto', () => {
    // AMBIENTALE PER DISEGNO: REPORT_PATH_RE (via adapter.mjs) e' costruita sulla CONFIG che questa
    // installazione ha effettivamente caricato da mss.config.json — e' esattamente il meccanismo
    // che R8 esiste per dare. In una repo ospite che configura una sessionsDir diversa questa
    // uguaglianza e' FALSA per costruzione: non e' il motore rotto, e' il motore che fa il suo
    // lavoro (vedi il test gemello sopra, «una sessionsDir diversa sposta il perimetro», che prova
    // il caso configurato). Qui si prova un fatto di QUESTO progetto — che al momento non ha ancora
    // un mss.config.json che sposta il perimetro — quindi e' ancorato come le altre verifiche di
    // progetto: assente l'ancora, il gruppo e' n/a col suo nome, mai saltato in silenzio.
    assert.equal(String(REPORT_PATH_RE), ATTESO_PERIMETRO_STORICO)
  }],

  ['R8 — una sessionsDir diversa sposta il perimetro in ENTRAMBE le direzioni', () => {
    // Non basta che accetti il path nuovo: se continuasse ad accettare anche il vecchio, la
    // parametrizzazione sarebbe finta e il motore leggerebbe la cartella sbagliata dicendo verde.
    const ospite = buildReportPathRe(normalizeConfig({ sessionsDir: 'registro/sedute' }))
    assert.ok(ospite.test('registro/sedute/24-08-26/Report-x.md'), 'non accetta la cartella configurata')
    assert.ok(!ospite.test('docs/Sessioni di lavoro/24-08-26/Report-x.md'), 'accetta ancora la vecchia cartella')
    assert.ok(!ospite.test('registro/sedute/24-08-26/Nota-x.md'), 'accetta un prefisso non dichiarato')
    const soloVerbali = buildReportPathRe(normalizeConfig({ reportKinds: ['Verbale'] }))
    assert.ok(!soloVerbali.test('docs/Sessioni di lavoro/24-08-26/Report-x.md'), 'ignora reportKinds')
    assert.ok(soloVerbali.test('docs/Sessioni di lavoro/24-08-26/Verbale-x.md'))
  }],

  ['R8 — un mss.config.json rotto e ROSSO, non un default silenzioso', () => {
    // Ricadere sui default farebbe validare la cartella sbagliata dichiarando verde: R2.
    assert.throws(() => normalizeConfig({ sessionsDirectory: 'x' }), /chiave sconosciuta/)
    assert.throws(() => normalizeConfig({ sessionsDir: '/assoluto/sedute' }), /relativo alla root/)
    assert.throws(() => normalizeConfig({ sessionsDir: 'C:/assoluto' }), /relativo alla root/)
    assert.throws(() => normalizeConfig({ sessionsDir: '../fuori' }), /non puo/)
    assert.throws(() => normalizeConfig({ sessionsDir: '' }), /non vuoto/)
    assert.throws(() => normalizeConfig({ reportKinds: [] }), /array non vuoto/)
    assert.throws(() => normalizeConfig({ reportKinds: ['Report|.*'] }), /prefissi alfanumerici/)
    assert.throws(() => normalizeConfig({ owners: { piano: 'x.md' } }), /owner sconosciuto/)
    // `pack: null` invece e legittimo: una repo ospite puo avere un solo owner.
    assert.equal(normalizeConfig({ owners: { pack: null } }).owners.pack, null)
  }],

  ['R8 — mss:export dichiara INCOMPLETO un motore a cui manca un modulo', () => {
    // Senza questo controllo un modulo dimenticato si scopre in un altra repo, mesi dopo,
    // con un ERR_MODULE_NOT_FOUND che non dice a chi chiedere.
    const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup-mss-r8-export-'))
    try {
      mkdirSync(join(root, 'scripts/mss'), { recursive: true })
      writeFileSync(join(root, 'scripts/mss/adapter.mjs'), readFileSync(join(REPO_ROOT, 'scripts/mss/adapter.mjs')))
      const monco = findDanglingImports(root, ['scripts/mss/adapter.mjs'])
      assert.ok(monco.length > 0, 'un adapter senza i suoi moduli e stato dichiarato completo')
      assert.ok(monco.some((d) => d.specifier.includes('config.mjs')), `attesa config.mjs fra i mancanti: ${JSON.stringify(monco)}`)
      // E il caso completo NON deve dare falsi allarmi: l'export reale di questa repo e chiuso.
      const { files } = collectExportPaths(REPO_ROOT)
      assert.deepEqual(findDanglingImports(REPO_ROOT, files), [])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }],

  ['R2 — mss:doctor e ROSSO su un corpus vuoto: «zero record» non e un verde', async () => {
    // Il difetto che il comando esiste per non avere. Un `mss:query` che dice «zero record, tutto
    // ok» in una repo appena installata farebbe credere a un sistema funzionante che non guarda
    // niente. Qui la repo e vuota per costruzione: il passo «corpus» DEVE essere rosso.
    const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup-mss-r8-doctor-'))
    try {
      const steps = await runDoctor({ root })
      const passo = (name) => steps.find((s) => s.name === name)
      assert.ok(passo('corpus'), 'il passo «corpus» non esiste piu nella checklist')
      assert.equal(passo('corpus').state.trim(), 'FAIL', `corpus non rosso su repo vuota: ${JSON.stringify(passo('corpus'))}`)
      assert.match(passo('corpus').prova, /corpus vuoto NON e un verde/)
      assert.equal(passo('cartelle dichiarate').state.trim(), 'FAIL', 'cartelle inesistenti dichiarate presenti')
      assert.equal(passo('motore').state.trim(), 'FAIL', 'motore assente dichiarato completo')
      // ...e la prova ATTIVA resta verde: il validator sa rifiutare anche qui. Se anche questa
      // fosse rossa il test non distinguerebbe «repo vuota» da «doctor rotto».
      assert.equal(passo('sa dire di no').state.trim(), 'ok', `prova attiva non superata: ${JSON.stringify(passo('sa dire di no'))}`)
      assert.equal(passo('perimetro').state.trim(), 'ok')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }],

  ['R8 — validate:docs salta il materiale vendorizzato SOLO col marcatore, mai per caso', () => {
    // Prova nelle due direzioni sull'albero reale: senza marcatore il link rotto e rosso (quindi
    // il controllo funziona ancora), col marcatore la cartella copiata da un'altra repo non
    // inquina il gate della repo ospite. Un solo verso non escluderebbe che salti tutto.
    const probeDir = join(REPO_ROOT, 'docs/_mss-vendor-probe')
    try {
      mkdirSync(probeDir, { recursive: true })
      writeFileSync(join(probeDir, 'VENDORIZZATO.md'), '# Sonda\n\nLink rotto: `docs/QUESTO_FILE_NON_ESISTE_MAI.md`\n', 'utf8')
      const senza = runProcess(process.execPath, [REAL_CHECK_DOC_PATHS], REPO_ROOT)
      assert.equal(senza.status, 1, `senza marcatore il path rotto doveva essere rosso: ${senza.output}`)
      assert.match(senza.output, /QUESTO_FILE_NON_ESISTE_MAI/)
      writeFileSync(join(probeDir, '.mss-vendored'), 'sonda\n', 'utf8')
      const con = runProcess(process.execPath, [REAL_CHECK_DOC_PATHS], REPO_ROOT)
      assert.equal(con.status, 0, `col marcatore il controllo doveva tornare verde: ${con.output}`)
      assert.doesNotMatch(con.output, /QUESTO_FILE_NON_ESISTE_MAI/)
    } finally {
      rmSync(probeDir, { recursive: true, force: true })
    }
  }],

  ['V1 — vista generata: owner modificato = gate rosso, rigenerazione = verde', () => {
    // Il test usa una repo minima: non basta vedere che il file reale e allineato oggi. Serve
    // provare entrambe le direzioni che rendono il generatore un antidoto alle viste stale.
    // Prende l'ULTIMO ciclo chiuso: un ciclo precedente non deve mascherare lo stato corrente.
    assert.ok(runViews({ root: REPO_ROOT }).every((view) => !view.stale), 'il cruscotto reale non e allineato al suo owner')
    const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup-mss-v1-'))
    try {
      writeRepoFile(root, 'docs/MetaSkillSystem/PLAN_V0.md', [
        '# Piano',
        '### Ciclo precedente — `M-G` eseguito e **CHIUSO**',
        '### Ciclo di prova — `M-F` eseguito e **CHIUSO**',
        '',
        '**Prossima azione autorizzata: `M-E`** (attrezzi mancanti, `T1`).',
        '`R1` resta **raccomandato ma non aperto**.',
      ].join('\n'))
      writeRepoFile(root, 'docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md', [
        '# Cruscotto MSS di Matteo',
        'TESTO ESTERNO DA CONSERVARE',
        '<!-- mss:generated cruscotto-matteo inizio -->',
        'contenuto da sostituire',
        '<!-- mss:generated cruscotto-matteo fine -->',
        'CODA ESTERNA DA CONSERVARE',
      ].join('\n'))
      assert.ok(runViews({ root, write: true }).every((view) => view.stale), 'la prima generazione doveva rilevare il blocco diverso')
      const afterGen = readFileSync(join(root, 'docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md'), 'utf8')
      assert.ok(runViews({ root }).every((view) => !view.stale), 'subito dopo la generazione il gate deve essere verde')
      assert.match(afterGen, /`M-F` è \*\*CHIUSO\*\*/, 'deve leggere l\'ultimo ciclo, non M-G')
      assert.match(afterGen, /TESTO ESTERNO DA CONSERVARE/, 'il testo fuori dai marcatori non va cancellato')
      assert.match(afterGen, /CODA ESTERNA DA CONSERVARE/, 'la coda fuori dai marcatori non va cancellata')

      const owner = join(root, 'docs/MetaSkillSystem/PLAN_V0.md')
      writeFileSync(owner, readFileSync(owner, 'utf8').replace('### Ciclo di prova — `M-F` eseguito e **CHIUSO**', '### Ciclo di prova — `M-F` eseguito e **PROVATO**'), 'utf8')
      assert.ok(runViews({ root }).some((view) => view.stale), 'un owner cambiato non ha reso rosso il controllo anti-stale')

      // Una correzione manuale della sola copia non basta: deve restare stale rispetto all'owner.
      writeFileSync(join(root, 'docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md'), afterGen.replaceAll('CHIUSO', 'CHIUSISSIMO'), 'utf8')
      assert.ok(runViews({ root }).some((view) => view.stale), 'una modifica manuale della sola vista non deve far diventare verde il cancello')

      runViews({ root, write: true })
      const realigned = readFileSync(join(root, 'docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md'), 'utf8')
      assert.ok(runViews({ root }).every((view) => !view.stale), 'la rigenerazione non ha riallineato la vista')
      assert.match(realigned, /PROVATO/, 'la vista deve riflettere l\'owner, non la correzione manuale')
      assert.doesNotMatch(realigned, /CHIUSISSIMO/)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }],

  ['V2 — lavagna: §4-ter prevale, glossa dichiarata, glossa orfana = rosso', () => {
    const planPath = join(REPO_ROOT, 'docs/MetaSkillSystem/PLAN_V0.md')
    const planText = readFileSync(planPath, 'utf8')

    const synthetic = [
      '## 4. Quadro corrente',
      '| Ord | Pacchetto | Stato | Gate |',
      '|---|---|---|---|',
      '',
      '### 4-bis. Scheletro',
      '| Ord | Pacchetto | Stato | Prova |',
      '|---|---|---|---|',
      '| S4 | `SK-4` — bypass capsula | `PASS_CON_RISERVE` | stale §4-bis |',
      '',
      '### 4-ter. Rettifica audit',
      '| Pacchetto | Stato operativo | Note |',
      '|---|---|---|',
      '| `SK-4` | **CHIUSO 25-08-26** | rettifica audit |',
      '',
      '## 15. Prossimo',
      '### ciclo del 25-08-2026 — `T6` eseguito e **CHIUSO**',
      '**Prossima azione autorizzata: `T8`** (test label)',
      '**Stato R1 attuale:** `R1` è **CHIUSO**',
    ].join('\n')
    const withTer = parsePlanBoard(synthetic)
    const withoutTer = parsePlanBoard(synthetic.replace(/\n### 4-ter\.[\s\S]*?(?=\n## 15)/, '\n'))
    const sk4With = withTer.find((r) => r.id === 'SK-4')
    const sk4Without = withoutTer.find((r) => r.id === 'SK-4')
    assert.equal(classifyPlanState(sk4With.stato), 'fatta')
    assert.equal(classifyPlanState(sk4Without.stato), 'con-riserva')
    const countFatta = (b) => b.filter((r) => classifyPlanState(r.stato) === 'fatta').length
    assert.notEqual(countFatta(withTer), countFatta(withoutTer))

    const fakePlan = planText + [
      '',
      '### 4-quater. Glossa test',
      '',
      '| ID | Glossa |',
      '|---|---|',
      '| `SK-999-ORFANO` | Questo id non esiste in M |',
    ].join('\n')
    const board = parsePlanBoard(fakePlan)
    const glosses = parsePlanGlosses(fakePlan)
    const v = validatePlanGlosses(board, glosses)
    assert.equal(v.ok, false)
    assert.deepEqual(v.orphans, ['SK-999-ORFANO'])
    const mdOrphan = deriveMatteoDashboard(fakePlan)
    assert.match(mdOrphan, /MSS-VIEWS-GLOSSA-ORFANA/)

    const noBis = planText
      .replace(/\n## 4\. Quadro corrente[\s\S]*?(?=\n### 4-bis)/, '\n## 4. Quadro corrente\n\n_Sezione senza tabella._\n')
      .replace(/\n### 4-bis\.[\s\S]*?(?=\n### 4-ter\.)/, '\n')
      .replace(/\n### 4-quater\.[\s\S]*?(?=\nAnalisi, prove)/, '\n')
    const mdNoBoard = deriveMatteoDashboard(noBis)
    assert.doesNotMatch(mdNoBoard, /## Lavagna/)
    assert.equal(parsePlanBoard(noBis).length, 0)

    const mdLive = deriveMatteoDashboard(planText)
    assert.match(mdLive, /`SK-0` Sbloccare i cancelli globali/)
    assert.doesNotMatch(mdLive, /MSS-VIEWS-GLOSSA-ORFANA/)
  }],

  ['T1/R6 — mss:move sposta un file di prova, aggiorna i riferimenti vivi e resta atomico', () => {
    // Non basta exit !== 0: serve prova nelle due direzioni (move ok + rifiuti leggibili) e
    // confronto col costo manuale documentato (~1741 righe). Sandbox dedicata: niente atti vivi.
    const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup-mss-t1-r6-'))
    try {
      writeRepoFile(root, 'docs/MetaSkillSystem/NOTE_SORGENTE.md', '# Sorgente\n\nContenuto di prova T1.\n')
      writeRepoFile(root, 'docs/MetaSkillSystem/INDICE.md', [
        '# Indice',
        '',
        'Vedi [nota](NOTE_SORGENTE.md) e anche `docs/MetaSkillSystem/NOTE_SORGENTE.md`.',
        '',
      ].join('\n'))
      writeRepoFile(root, 'scripts/helper-t1.mjs', "export const PATH = 'docs/MetaSkillSystem/NOTE_SORGENTE.md'\n")
      writeRepoFile(root, 'scripts/check-doc-paths.mjs', readFileSync(REAL_CHECK_DOC_PATHS))
      writeRepoFile(root, 'scripts/doc-paths-lib.mjs', readFileSync(REAL_DOC_PATHS_LIB))
      writeRepoFile(root, 'scripts/_cliLog.mjs', readFileSync(REAL_CLI_LOG))
      writeRepoFile(root, 'scripts/doc-path-check-allowlist.json', '[]\n')

      const missing = runMove(
        ['node', 'move.mjs', 'docs/MetaSkillSystem/ASSENTE.md', 'docs/MetaSkillSystem/ALTRO.md'],
        { root, validateDocs: () => ({ status: 0, output: '' }) },
      )
      assert.equal(missing.exitCode, 2, missing.stderr)
      assert.match(missing.stderr, /Sorgente assente/)

      writeRepoFile(root, 'docs/MetaSkillSystem/OCCUPATO.md', '# gia qui\n')
      const occupied = runMove(
        ['node', 'move.mjs', 'docs/MetaSkillSystem/NOTE_SORGENTE.md', 'docs/MetaSkillSystem/OCCUPATO.md'],
        { root, validateDocs: () => ({ status: 0, output: '' }) },
      )
      assert.equal(occupied.exitCode, 2, occupied.stderr)
      assert.match(occupied.stderr, /gia occupata|già occupata/)

      const frozen = runMove(
        ['node', 'move.mjs', 'docs/MetaSkillSystem/NOTE_SORGENTE.md', 'scripts/mss/vietato.md'],
        { root, validateDocs: () => ({ status: 0, output: '' }) },
      )
      assert.equal(frozen.exitCode, 2, frozen.stderr)
      assert.match(frozen.stderr, /congelata/)

      const ok = runMove(
        ['node', 'move.mjs', 'docs/MetaSkillSystem/NOTE_SORGENTE.md', 'docs/MetaSkillSystem/NOTE_DEST.md', '--no-stub'],
        { root, validateDocs: () => ({ status: 0, output: '' }) },
      )
      assert.equal(ok.exitCode, 0, `${ok.stdout}\n${ok.stderr}`)
      assert.ok(ok.summary, 'manca il riepilogo misurabile')
      assert.equal(ok.summary.from, 'docs/MetaSkillSystem/NOTE_SORGENTE.md')
      assert.equal(ok.summary.to, 'docs/MetaSkillSystem/NOTE_DEST.md')
      assert.ok(ok.summary.refsUpdated >= 2, `attesi ≥2 ref aggiornati, got ${ok.summary.refsUpdated}`)
      assert.ok(
        ok.summary.lineDelta < MANUAL_MOVE_BASELINE_LINES,
        `costo attrezzo ${ok.summary.lineDelta} non inferiore alla baseline ${MANUAL_MOVE_BASELINE_LINES}`,
      )
      assert.equal(existsSync(join(root, 'docs/MetaSkillSystem/NOTE_SORGENTE.md')), false)
      assert.equal(existsSync(join(root, 'docs/MetaSkillSystem/NOTE_DEST.md')), true)
      const indice = readFileSync(join(root, 'docs/MetaSkillSystem/INDICE.md'), 'utf8')
      assert.match(indice, /NOTE_DEST\.md/)
      assert.doesNotMatch(indice, /NOTE_SORGENTE\.md/)
      const helper = readFileSync(join(root, 'scripts/helper-t1.mjs'), 'utf8')
      assert.match(helper, /NOTE_DEST\.md/)
      assert.doesNotMatch(helper, /NOTE_SORGENTE\.md/)

      // Atomicità: se validate:docs fallisce dopo la scrittura, l'albero torna com'era.
      writeRepoFile(root, 'docs/MetaSkillSystem/ATOM_SRC.md', '# atom\n')
      writeRepoFile(root, 'docs/MetaSkillSystem/ATOM_LINK.md', 'Link: `docs/MetaSkillSystem/ATOM_SRC.md`\n')
      const beforeLink = readFileSync(join(root, 'docs/MetaSkillSystem/ATOM_LINK.md'), 'utf8')
      const rolled = runMove(
        ['node', 'move.mjs', 'docs/MetaSkillSystem/ATOM_SRC.md', 'docs/MetaSkillSystem/ATOM_DST.md', '--no-stub'],
        { root, validateDocs: () => ({ status: 1, output: 'synthetic validate fail' }) },
      )
      assert.equal(rolled.exitCode, 1, rolled.stderr)
      assert.match(rolled.stderr, /validate:docs rosso|Albero ripristinato/)
      assert.equal(existsSync(join(root, 'docs/MetaSkillSystem/ATOM_SRC.md')), true)
      assert.equal(existsSync(join(root, 'docs/MetaSkillSystem/ATOM_DST.md')), false)
      assert.equal(readFileSync(join(root, 'docs/MetaSkillSystem/ATOM_LINK.md'), 'utf8'), beforeLink)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }],

  ['T2 / mss:review — seduta con violazione nota la trova; seduta pulita non inventa', () => {
    assert.equal(classifyPath('docs/MetaSkillSystem/PLAN_V0.md').level, 'L1')
    assert.equal(classifyPath('scripts/mss/review.mjs').level, 'L5')
    assert.equal(classifyPath('docs/_lavoro/segreto.md').level, 'L6')
    assert.equal(classifyPath('src/App.tsx').level, null)

    const dirtyReport = [
      '# Report sporco T2',
      '',
      'Ho lanciato validate:mss exit 0.',
      '',
    ].join('\n')
    const dirty = reviewSession({
      files: [
        'docs/MetaSkillSystem/PLAN_V0.md',
        'docs/_lavoro/privato.md',
        'scripts/mss/core.mjs',
        `${SESSIONI}/24-08-26/Report-t2-dirty.md`,
        'src/orphan-unmapped.ts',
      ],
      reportContents: new Map([[`${SESSIONI}/24-08-26/Report-t2-dirty.md`, dirtyReport]]),
      owners: ['docs/MetaSkillSystem/PLAN_V0.md'],
    })
    assert.equal(dirty.clean, false, 'la seduta sporca non può risultare clean')
    const codes = new Set(dirty.problems.map((p) => p.code))
    assert.ok(codes.has('owner-stato'), `manca owner-stato: ${[...codes]}`)
    assert.ok(codes.has('L6-privato'), `manca L6-privato: ${[...codes]}`)
    assert.ok(codes.has('L5-congelato'), `manca L5-congelato: ${[...codes]}`)
    assert.ok(codes.has('capsula-assente'), `manca capsula-assente: ${[...codes]}`)
    assert.ok(codes.has('gate-senza-prova-capsula'), `manca gate-senza-prova-capsula: ${[...codes]}`)
    assert.ok(
      dirty.warnings.some((w) => w.code === 'livello-non-mappato' && w.path === 'src/orphan-unmapped.ts'),
      'path fuori mappa deve essere segnalato senza inventare un livello',
    )

    const cleanReport = [
      '# Report pulito T2',
      '',
      '❓ Q1 — Prompt?',
      '✅ R1: mandato T2 fixture.',
      '❓ Q2 — Diff?',
      '✅ R2: sì, fixture.',
      '❓ Q3 — Skill?',
      '✅ R3: nessuno.',
      '❓ Q4 — Non fatto?',
      '✅ R4: nulla oltre il mandato.',
      '❓ Q5 — Attrito?',
      '✅ R5: nessuna osservazione.',
      '❓ Q6 — Contesto?',
      '✅ R6: giusto.',
      '',
      '## Capsula MetaSkillSystem',
      '',
      '```jsonl',
      JSON.stringify({
        record_type: 'session_event',
        event: {
          controls: [
            {
              control_id: 'DIFF-CHECK',
              criterio: 'git diff --check',
              esito: 'pass',
              esecutore: 'fixture',
            },
          ],
        },
      }),
      '```',
      '',
    ].join('\n')
    const cleanPath = `${SESSIONI}/24-08-26/Report-t2-clean.md`
    const clean = reviewSession({
      files: [cleanPath],
      reportContents: new Map([[cleanPath, cleanReport]]),
      owners: ['docs/MetaSkillSystem/PLAN_V0.md'],
    })
    assert.equal(clean.clean, true, `seduta pulita non deve inventare problemi: ${JSON.stringify(clean.problems)}`)
    assert.equal(clean.problems.length, 0)
    assert.equal(clean.gaps.length, 0)
    assert.ok(clean.controls.some((c) => c.control_id === 'DIFF-CHECK' && c.esito === 'pass'))

    const cli = runReview(['node', 'review.mjs', '--json'], {
      root: REPO_ROOT,
      collectFiles: () => [cleanPath],
      readFile: () => cleanReport,
      owners: ['docs/MetaSkillSystem/PLAN_V0.md'],
    })
    assert.equal(cli.exitCode, 0, cli.stderr)
    const payload = JSON.parse(cli.stdout)
    assert.equal(payload.clean, true)
    assert.equal(payload.problems.length, 0)
  }],

  ['SK-4 D18/B2/B3 — mss:review usa il perimetro REPORT_PATH_RE condiviso', () => {
    const paths = [
      `${SESSIONI}/24-08-26/deep/nested/Report-sk4.md`,
      `${SESSIONI}/24-08-26/deep/nested/Verbale-sk4.md`,
      `${SESSIONI}/Report-senza-cartella-data.md`,
      `${SESSIONI}/24-08-26/deep/nested/Nota-sk4.md`,
      'altrove/24-08-26/Report-sk4.md',
    ]
    const selected = new Set(findSessionReports(paths))
    for (const path of paths) {
      assert.equal(
        selected.has(path),
        REPORT_PATH_RE.test(path),
        `mss:review diverge dal perimetro condiviso per ${path}`,
      )
    }
    assert.ok(selected.has(paths[0]), 'B2: Report- in sotto-cartella deve essere selezionato')
    assert.ok(selected.has(paths[1]), 'B3: Verbale- in sotto-cartella deve essere selezionato')
    assert.equal(selected.has(paths[2]), false, 'manca la cartella-data: deve restare fuori perimetro')
  }],

  ['R3 — validate:app e validate:mss:all sono script distinti e validate li concatena', () => {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'))
    const scripts = pkg.scripts || {}
    const validateApp = scripts['validate:app']
    const validateMssAll = scripts['validate:mss:all']
    const validate = scripts['validate']
    assert.equal(typeof validateApp, 'string', 'manca scripts.validate:app')
    assert.equal(typeof validateMssAll, 'string', 'manca scripts.validate:mss:all')
    assert.equal(typeof validate, 'string', 'manca scripts.validate')
    assert.notEqual(validateApp, validateMssAll, 'validate:app e validate:mss:all devono restare stringhe diverse')
    assert.notEqual(validate, validateApp, 'validate non deve collassare su validate:app')
    assert.notEqual(validate, validateMssAll, 'validate non deve collassare su validate:mss:all')
    assert.match(validate, /npm run validate:app\s*&&\s*npm run validate:mss:all/,
      'validate deve concatenare validate:app poi validate:mss:all')
    assert.doesNotMatch(validateMssAll, /\blint\b/, 'validate:mss:all non deve includere lint app')
    assert.doesNotMatch(validateMssAll, /\btypecheck\b/, 'validate:mss:all non deve includere typecheck app')
    // "npm run test" da solo (senza :mss) sarebbe il test app; i mss sono ammessi.
    assert.doesNotMatch(validateMssAll, /npm run test(?:\s|$|&&)/,
      'validate:mss:all non deve includere npm run test (suite app)')
    assert.match(validateApp, /\blint\b/)
    assert.match(validateApp, /\btypecheck\b/)
    assert.match(validateApp, /npm run test(?:\s|$|&&)/)
  }],
  ['F3 / protocollo pilota: versione e coppia viva allineate a PLAN, rules e contratto', () => {
    const protocol = readFileSync(join(REPO_ROOT, 'docs/MetaSkillSystem/PROTOCOLLO_PRIMO_PILOTA_V0_1.md'), 'utf8')
    const plan = readFileSync(join(REPO_ROOT, 'docs/MetaSkillSystem/PLAN_V0.md'), 'utf8')
    const contract = readFileSync(join(REPO_ROOT, 'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md'), 'utf8')

    assert.match(protocol, new RegExp(`Protocol version:\\*\\* \`${PROTOCOL_VERSION}\``))
    assert.match(protocol, new RegExp(`Oggetto:\\*\\* \`${SCHEMA_CURRENT}\``))
    assert.match(protocol, new RegExp(`System revision:\\*\\* \`${REVISION_CURRENT}\``))
    assert.match(protocol, /Nota storica[\s\S]*1\.0\.0/)
    assert.match(protocol, new RegExp(SCHEMA_LEGACY.replace(/\./g, '\\.')))
    assert.match(protocol, new RegExp(REVISION_LEGACY.replace(/\./g, '\\.')))
    assert.doesNotMatch(
      protocol.slice(0, protocol.indexOf('## 1.')),
      new RegExp(`Protocol version:\\*\\* \`1\\.0\\.0\``),
      'header vivo non deve dichiarare 1.0.0',
    )

    assert.match(plan, /protocollo vivo `1\.0\.1`|versione viva `1\.0\.1`/)
    assert.equal(PROTOCOL_VERSION, '1.0.1')
    assert.equal(PROTOCOL_ID, 'MSS-PILOT-001')

    assert.match(contract, new RegExp(SCHEMA_CURRENT.replace(/\./g, '\\.')))
    assert.match(contract, new RegExp(REVISION_CURRENT.replace(/\./g, '\\.')))

    // 20 target + 14 ID congelati restano nel denominatore
    assert.match(protocol, /20 target/)
    assert.match(protocol, /\*\*14 casi minimi\*\*/)
    for (const id of [
      'FX-V01', 'FX-V02', 'FX-V03', 'FX-V04',
      'FX-I01', 'FX-I02', 'FX-I03', 'FX-I04', 'FX-I05',
      'FX-I06', 'FX-I07', 'FX-I08', 'FX-I09', 'FX-I10',
    ]) {
      assert.match(protocol, new RegExp(`\\| \`${id}\` \\|`))
    }

    const legacy = runCapsule([process.argv[0], 'capsule.mjs', '--force-legacy'])
    assert.notEqual(legacy.exitCode, 0, '--force-legacy deve restare rifiutato')
    assert.match(
      `${legacy.stderr}${legacy.stdout}`,
      /legacy mss\.session\/0\.1\.0|freeze-1|LEGACY/i,
    )
  }],
]

const failures = []
const nonApplicabili = []
let eseguiti = 0
for (const entry of tests) {
  const [name, second, third] = entry
  const anchor = typeof second === 'string' ? second : null
  const test = anchor ? third : second
  const mancanti = anchor ? missingAnchors(anchor) : []
  if (mancanti.length) {
    nonApplicabili.push(name)
    process.stdout.write(`n/a ${name}  — ancora «${anchor}» assente: ${mancanti.join(', ')}\n`)
    continue
  }
  eseguiti++
  try {
    // Alcuni test sono async (mss:doctor lo e): senza await un rifiuto sfuggirebbe al catch e la
    // suite direbbe verde su un test mai concluso.
    const outcome = test()
    if (outcome && typeof outcome.then === 'function') await outcome
    process.stdout.write(`OK ${name}\n`)
  } catch (error) {
    failures.push({ name, error })
    process.stderr.write(`FAIL ${name}: ${error.message}\n`)
  }
}

if (eseguiti === 0) {
  process.stderr.write('\nMSS tools suite red: nessun test eseguito — una suite che non esegue niente non e verde\n')
  process.exitCode = 1
} else if (failures.length) {
  process.stderr.write(`\nMSS tools suite red: ${failures.length}/${eseguiti} tests failed\n`)
  process.exitCode = 1
} else {
  const coda = nonApplicabili.length ? ` (+ ${nonApplicabili.length} non applicabili in questa repo)` : ''
  process.stdout.write(`\nMSS tools suite green: ${eseguiti} tests${coda}\n`)
}
