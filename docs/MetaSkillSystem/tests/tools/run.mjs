#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildQueryPayload,
  buildVistaEffettiva,
  renderVerifica,
  runQuery,
} from '../../../../scripts/mss/query.mjs'
import { buildStatusReport } from '../../../../scripts/mss/status.mjs'
import {
  IDS,
  amendment,
  validBundle,
} from '../h1/fixture-factory.mjs'

const FIXED_PATH = 'docs/Sessioni di lavoro/10-08-26/Report-tools-synthetic.md'
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const CHANGED_REPORTS_CLI = join(REPO_ROOT, 'scripts/mss/validate-changed-reports.mjs')

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
