#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
import {
  buildCapsuleBundle,
  formatCapsuleBlock,
  recordsToJsonl,
  runCapsule,
  runChecks,
  parseCheckSpec,
  parseVerifySpec,
  collectGitContext,
  buildSourceRefsFromGit,
  buildJudgmentsTemplate,
} from '../../../../scripts/mss/capsule.mjs'
import { countCapsuleHeadings } from '../../../../scripts/mss/parse.mjs'
import { validateMss } from '../../../../scripts/mss/core.mjs'
import { REVISION_CURRENT } from '../../../../scripts/mss/rules.mjs'
import {
  IDS,
  amendment,
  validBundle,
} from '../h1/fixture-factory.mjs'

const FIXED_PATH = 'docs/Sessioni di lavoro/10-08-26/Report-tools-synthetic.md'
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

function runCheckDocPathsWithAllowlist(allowlistEntries) {
  const root = mkdtempSync(join(resolve(tmpdir()), 'calendarbackup-mss-b4-'))
  try {
    mkdirSync(join(root, 'scripts'), { recursive: true })
    mkdirSync(join(root, 'docs'), { recursive: true })
    writeFileSync(join(root, 'scripts/check-doc-paths.mjs'), readFileSync(REAL_CHECK_DOC_PATHS))
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
      const path = 'docs/Sessioni di lavoro/23-08-26/audit/deep/Report-valid.md'
      const head = commitFile(repo, path, validReport('Report valido'), 'add valid report')
      const result = validateChanged(repo, base, head)
      assert.equal(result.status, 0, result.output)
      assert.match(result.output, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(result.output, /OK: 1\/1 report MSS validi/)
    })
  }],
  ['changed reports: Report invalido rende rosso, poi la correzione rende verde', () => {
    withTempGitRepo(({ repo, base }) => {
      const path = 'docs/Sessioni di lavoro/23-08-26/audit/deep/Report-invalid.md'
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
      const path = 'docs/Sessioni di lavoro/23-08-26/audit/deep/Verbale-valid.md'
      const head = commitFile(repo, path, validReport('Verbale valido'), 'add valid verbale')
      const result = validateChanged(repo, base, head)
      assert.equal(result.status, 0, result.output)
      assert.match(result.output, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(result.output, /OK: 1\/1 report MSS validi/)
    })
  }],
  ['changed reports: Verbale invalido rende rosso, poi la correzione rende verde', () => {
    withTempGitRepo(({ repo, base }) => {
      const path = 'docs/Sessioni di lavoro/23-08-26/audit/deep/Verbale-invalid.md'
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
      const path = 'docs/Sessioni di lavoro/23-08-26/audit/deep/Nota-non-pertinente.md'
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
    assert.match(result.stdout, /Report-\*\.md o Verbale-\*\.md sotto docs\/Sessioni di lavoro\//)
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
  ['status: owner PLAN non espone 32 gruppi o 9\/9 tools come dati correnti', () => {
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
    })
    assert.match(output, /branch\s+non ricostruibile/)
    assert.match(output, /HEAD\s+non ricostruibile/)
    assert.equal((output.match(/non ricostruibile — apri/g) || []).length, 2)
    assert.doesNotMatch(output, /env\/test|eee6cf7|SK-6\s+CHIUSO/)
  }],
  ['capsule: golden — input fisso produce bundle identico', () => {
    const first = recordsToJsonl(buildCapsuleBundle(goldenCapsuleOptions()))
    const second = recordsToJsonl(buildCapsuleBundle(goldenCapsuleOptions()))
    assert.equal(first, second)
    assert.match(first, /mss-ses-0198b000-0001-7000-8000-000000000001/)
    assert.match(first, /"segment_no":1/)
    assert.doesNotMatch(first, /2026-08-23T17:07:00/)
  }],
  ['capsule: giro completo — capsula generata passa validate:mss', () => {
    withTempGitRepo(({ repo }) => {
      const records = buildCapsuleBundle(goldenCapsuleOptions())
      const jsonl = recordsToJsonl(records)
      const reportPath = 'docs/Sessioni di lavoro/10-08-26/Report-capsule-tools-roundtrip.md'
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
      const reportRel = 'docs/Sessioni di lavoro/23-08-26/Report-capsule-negative.md'
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
    assert.match(npmCheck.esecutore, /\(exit 0\)$/)

    assert.equal(failCheck.esito, 'fail', failCheck.esecutore)
    assert.equal(failCheck.numeratore, 0)
    assert.match(failCheck.esecutore, /\(exit 3\)$/)

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
    assert.match(check.esecutore, /\(exit 0\)$/)
  }],
  ['capsule: parseCheckSpec — legacy semplice con un solo colon resta valido', () => {
    const parsed = parseCheckSpec('SK7:npm --version')
    assert.equal(parsed.control_id, 'SK7')
    assert.equal(parsed.command, 'npm --version')
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
      const reportRel = 'docs/Sessioni di lavoro/24-08-26/Report-n1-capsula-doppia.md'
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
      const reportRel = 'docs/Sessioni di lavoro/24-08-26/Report-n1-goe-fuori-dominio.md'
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
]

const failures = []
for (const [name, test] of tests) {
  try {
    test()
    process.stdout.write(`OK ${name}\n`)
  } catch (error) {
    failures.push({ name, error })
    process.stderr.write(`FAIL ${name}: ${error.message}\n`)
  }
}

if (failures.length) {
  process.stderr.write(`\nMSS tools suite red: ${failures.length}/${tests.length} tests failed\n`)
  process.exitCode = 1
} else {
  process.stdout.write(`\nMSS tools suite green: ${tests.length} tests\n`)
}
