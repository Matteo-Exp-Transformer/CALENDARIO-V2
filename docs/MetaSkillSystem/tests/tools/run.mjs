#!/usr/bin/env node
import assert from 'node:assert/strict'

import {
  buildQueryPayload,
  buildVistaEffettiva,
  renderVerifica,
} from '../../../../scripts/mss/query.mjs'
import { buildStatusReport } from '../../../../scripts/mss/status.mjs'
import {
  IDS,
  amendment,
  validBundle,
} from '../h1/fixture-factory.mjs'

const FIXED_PATH = 'docs/Sessioni di lavoro/10-08-26/Report-tools-synthetic.md'

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
