#!/usr/bin/env node
/** Materializza le 14 fixture congelate + supplementari sotto fixtures/v0.1/ */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  IDS,
  amendment,
  axisOutput,
  axisPersona,
  axisSistema,
  sessionEvent,
  toJsonl,
  validBundle,
  baseRecord,
  recordedBy,
  packages,
} from './fixture-factory.mjs'
import {
  PROTOCOL_ID,
  PROTOCOL_VERSION,
  SCHEMA_CURRENT,
  REVISION_CURRENT,
} from '../../../../scripts/mss/rules.mjs'

const outputIndex = process.argv.indexOf('--output')
const root = outputIndex >= 0
  ? process.argv[outputIndex + 1]
  : join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'fixtures', 'v0.1')
if (!root) throw new Error('--output requires a directory')
mkdirSync(root, { recursive: true })

function write(name, content) {
  writeFileSync(join(root, name), content, 'utf8')
}

function reportWithCapsule(title, jsonl) {
  return `# ${title}

## Capsula MetaSkillSystem

\`\`\`jsonl
${jsonl.trim()}
\`\`\`

## Domande di chiusura

❓ Q1 — Prompt?
✅ R1: synthetic fixture prompt for H-1 suite.

❓ Q2 — Dati?
✅ R2: synthetic data only, no personal content.

❓ Q3 — File?
✅ R3: fixture files under MetaSkillSystem/fixtures/v0.1.

❓ Q4 — Non fatto?
✅ R4: nothing beyond fixture scope.

❓ Q5 — Attrito?
✅ R5: nessuna osservazione; verified synthetic fixture packing.

❓ Q6 — Contesto?
✅ R6: giusto per H-1 fixture packaging.
`
}

// FX-V01
write('FX-V01-bundle.jsonl', toJsonl(validBundle()))
write('FX-V01-report.md', reportWithCapsule('FX-V01', toJsonl(validBundle())))

// FX-V02 light
const light = validBundle().map((r, i) => {
  if (r.record_type === 'session_event') {
    r.event.session_type = 'light'
    r.event.intent_user = 'validare sintatticamente una chiusura light sintetica'
  }
  return r
})
write('FX-V02-light.jsonl', toJsonl(light))
write(
  'FX-V02-session-log.md',
  `# FX-V02 — inserimento light nel Session Log

Questa fixture prova il punto fisico senza modificare il log reale. La tabella resta Markdown valido;
la capsula è JSONL parsabile nel file collegato.

| Data | Sessione | Report/evento |
|---|---|---|
| 10-08-26 | Fixture light sintetica · \`event:${IDS.evt}\` | [Evento light](FX-V02-light.jsonl) |
`,
)

// FX-V03 event + amendment
write('FX-V03-amendment.jsonl', toJsonl([...validBundle(), amendment()]))

// FX-V04: un solo evento logico compact + retry byte-equivalente dello stesso record.
const compact = sessionEvent(
  {
    event_kind: 'compact_snapshot',
    session_type: 'deep',
    continues_record_id: 'mss-rec-0198b000-0001-7000-8000-000000000099',
  },
  {
    record_id: 'mss-rec-0198b000-0001-7000-8000-000000000015',
    segment_no: 2,
    capture_key: `${IDS.ses}/2/session_event/1`,
  },
)
const compactAxes = [axisPersona(), axisSistema(), axisOutput()].map((record) => {
  const next = structuredClone(record)
  next.segment_no = 2
  next.capture_key = next.capture_key.replace('/1/annotation/', '/2/annotation/')
  next.annotation.subject_record_ids = [compact.record_id]
  return next
})
const retry = structuredClone(compact)
const v04 = [compact, retry, ...compactAxes]
write('FX-V04-compact-retry.jsonl', toJsonl(v04))

// FX-I01 unknown schema
{
  const b = validBundle()
  b[0].schema_version = 'mss.session/9.9.9'
  b[0].system_revision = 'unknown-rev'
  write('FX-I01-schema.jsonl', toJsonl(b))
}

// FX-I02 vital missing / placeholder
{
  const b = validBundle()
  b[0].event.intent_user = 'TODO'
  delete b[0].event.role_key
  write('FX-I02-vital.jsonl', toJsonl(b))
}

// FX-I03 axis inside event
{
  const b = validBundle()
  b[0].event.delta_persona = { signal: 'bad' }
  write('FX-I03-axis-in-event.jsonl', toJsonl(b))
}

// FX-I04 capture key collision different content
{
  const b = validBundle()
  const dup = structuredClone(b[1])
  dup.annotation.delta = 'changed'
  write('FX-I04-capture-collision.jsonl', toJsonl([...b, dup]))
}

// FX-I05 unresolvable ref
{
  const b = validBundle()
  b[0].event.owner_refs[0].uri_or_path = 'docs/MetaSkillSystem/DOES_NOT_EXIST_FIXTURE.md'
  write('FX-I05-ref.jsonl', toJsonl(b))
}

// FX-I06 product gate missing
{
  const b = validBundle()
  b[3] = axisOutput({
    recipient: 'pass',
    problem_or_job: 'pass',
    canonical_version: 'pass',
    fixed_acceptance_criterion: 'pass',
    // missing verification_or_use_evidence
    result: 'eligible',
  })
  write('FX-I06-product-gate.jsonl', toJsonl(b))
}

// FX-I07 report without capsule
write(
  'FX-I07-report-no-capsule.md',
  `# FX-I07 report without capsule

**Modalità:** standard

No MetaSkillSystem section here.

❓ Q1 — Prompt?
✅ R1: synthetic.

❓ Q2 — Dati?
✅ R2: synthetic.

❓ Q3 — File?
✅ R3: this fixture only.

❓ Q4 — Non fatto?
✅ R4: intentional missing capsule.

❓ Q5 — Attrito?
✅ R5: nessuna osservazione; missing capsule is the case.

❓ Q6 — Contesto?
✅ R6: giusto.
`,
)

// FX-I08 light without valid link
write(
  'FX-I08-session-log-bad.md',
  `# FX-I08

| Data | Sessione | Report/evento |
|---|---|---|
| 10-08-26 | Broken light · \`event:mss-evt-missing\` | Evento light senza link |
`,
)

// FX-I09 independently_verified without independent verifier
{
  const b = validBundle()
  b[1].annotation.verification = {
    status: 'independently_verified',
    verified_by: [{ actor_id: 'fixture-agent' }],
    verified_at: '2026-08-10T10:00:00+02:00',
    criterion_ref: 'fixture',
    evidence_refs: ['source-contract'],
    notes: 'bad',
  }
  write('FX-I09-verifier.jsonl', toJsonl(b))
}

// FX-I10 LOCK hint without forbid
{
  const b = validBundle()
  b[0].event.intent_user = 'modify LOCK file without declaration'
  b[0].event.authorization.forbid = ['dati personali']
  write('FX-I10-lock.jsonl', toJsonl(b))
}

// Supplementari
{
  const b = [sessionEvent(), axisPersona(), axisSistema()] // missing output
  write('FX-S01-missing-axis.jsonl', toJsonl(b))
}
write('FX-S02-malformed.jsonl', '{"schema_version":"mss.session/0.1.1",\n')
{
  const b = validBundle()
  b[1].annotation.subject_record_ids.push('mss-rec-0198b000-0001-7000-8000-000000000099')
  write('FX-S03-orphan-annotation.jsonl', toJsonl(b))
}

function declaredReportWithCapsule(title, mode, jsonl) {
  return reportWithCapsule(title, jsonl).replace(`# ${title}\n`, `# ${title}\n\n**Modalità:** ${mode}\n`)
}
{
  const b = validBundle()
  b[1].session_id = 'mss-ses-0198b000-0001-7000-8000-000000000099'
  b[1].correlation_id = 'mss-cor-0198b000-0001-7000-8000-000000000099'
  b[1].capture_key = `${b[1].session_id}/1/annotation/1`
  write('FX-S04-session-correlation-mismatch.jsonl', toJsonl(b))
}
{
  const a1 = amendment(IDS.recEvt)
  const a2 = amendment('mss-rec-0198b000-0001-7000-8000-000000000014')
  a2.record_id = 'mss-rec-0198b000-0001-7000-8000-000000000016'
  a2.capture_key = `${IDS.ses}/1/amendment/2`
  a2.amendment.amendment_id = 'mss-amd-0198b000-0001-7000-8000-000000000041'
  a2.amendment.target_record_id = IDS.recAmd
  // cycle: amd14 -> evt, amd16 -> amd14, and add amd pointing back - simpler: target missing
  write('FX-S05-amendment-missing-target.jsonl', toJsonl([...validBundle(), amendment('mss-rec-0198b000-0001-7000-8000-000000000099')]))
  // cycle: A amends B, B amends A
  const amdA = amendment(IDS.recAmd)
  amdA.record_id = IDS.recAmd
  amdA.amendment.target_record_id = 'mss-rec-0198b000-0001-7000-8000-000000000017'
  const amdB = structuredClone(amdA)
  amdB.record_id = 'mss-rec-0198b000-0001-7000-8000-000000000017'
  amdB.capture_key = `${IDS.ses}/1/amendment/2`
  amdB.amendment.amendment_id = 'mss-amd-0198b000-0001-7000-8000-000000000041'
  amdB.amendment.target_record_id = IDS.recAmd
  write('FX-S06-amendment-cycle.jsonl', toJsonl([...validBundle(), amdA, amdB]))
}
{
  const b = validBundle()
  b[0].event.privacy.capture_basis = 'non_applicabile'
  write('FX-S07-non-applicabile-no-reason.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  b[0].event.owner_refs[0].uri_or_path = '../../../etc/passwd'
  write('FX-S08-path-traversal.jsonl', toJsonl(b))
}
write(
  'FX-S09-ambiguous-jsonl.md',
  `# FX-S09

## Capsula MetaSkillSystem

\`\`\`jsonl
${toJsonl(validBundle()).trim()}
\`\`\`

\`\`\`jsonl
${toJsonl(validBundle()).trim()}
\`\`\`
`,
)
write('FX-S10-staged-valid.jsonl', toJsonl(validBundle()))
write('FX-S10-worktree-invalid.jsonl', toJsonl(validBundle().map((r, i) => {
  if (i === 0) {
    r = structuredClone(r)
    r.schema_version = 'mss.session/9.9.9'
  }
  return r
})))

// Controprove della revisione fredda: devono restare regressioni permanenti.
{
  const b = validBundle()
  delete b[0].packages_loaded
  write('FX-S11-missing-packages.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  for (const record of b) if (record.record_type === 'annotation') record.finalization = 'draft'
  write('FX-S12-draft-axes.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  b[1].recorded_by.actor_id = 'record-author-other'
  b[1].annotation.asserted_by.actor_id = 'asserted-other'
  b[1].annotation.verification = {
    status: 'independently_verified',
    verified_by: [{ actor_id: 'fixture-agent' }],
    verified_at: '2026-08-10T10:00:00+02:00',
    criterion_ref: 'fixture',
    evidence_refs: ['source-contract'],
    notes: 'verifier equals subject runtime',
  }
  write('FX-S13-verifier-subject.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  delete b[3].annotation.assertions[0].product_candidate
  write('FX-S14-output-without-product-candidate.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  const second = sessionEvent({}, {
    record_id: 'mss-rec-0198b000-0001-7000-8000-000000000099',
    capture_key: `${IDS.ses}/1/session_event/2`,
  })
  second.event.event_id = 'mss-evt-0198b000-0001-7000-8000-000000000099'
  write('FX-S15-two-session-events.jsonl', toJsonl([b[0], second, ...b.slice(1)]))
}
write(
  'FX-S16-session-log-event-mismatch.md',
  `# FX-S16

| Data | Sessione | Report/evento |
|---|---|---|
| 10-08-26 | Fixture light · \`event:mss-evt-0198b000-0001-7000-8000-000000000099\` | [Evento light](FX-V02-light.jsonl) |
`,
)

// H-1.1: regressioni semantiche e dichiarazioni di modalità strette.
{
  const b = validBundle()
  b[1].annotation.assertions = [{}]
  write('FX-S17-persona-empty.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  b[2].annotation.assertions = [{}]
  write('FX-S18-system-empty.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  b[3].annotation.assertions = [{ product_candidate: b[3].annotation.assertions[0].product_candidate }]
  write('FX-S19-output-product-only.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  b[0].event.controls = [{
    control_id: 'counterexample',
    criterio: 'synthetic',
    esito: 'pass',
    numeratore: 1,
    denominatore: 'uno',
    esecutore: 'fixture-agent',
    evidence_refs: ['source-contract'],
  }]
  write('FX-S20-control-denominator.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  b[1].annotation.assertions[0].source_ref = 'source-missing'
  write('FX-S21-orphan-source-ref.jsonl', toJsonl(b))
}
{
  const b = validBundle()
  b[0].system_revision = 'mss-v0.1-wp0.1-freeze-1'
  write('FX-S22-schema-revision-crossed.jsonl', toJsonl(b))
}
write('FX-S23-mode-hybrid.md', declaredReportWithCapsule('FX-S23', 'light standard', toJsonl(validBundle())))
write('FX-S24-mode-unknown.md', declaredReportWithCapsule('FX-S24', 'banana', toJsonl(validBundle())))

const manifest = {
      schema_version: SCHEMA_CURRENT,
      system_revision: REVISION_CURRENT,
      protocol_id: PROTOCOL_ID,
      protocol_version: PROTOCOL_VERSION,
      frozen: [
        { id: 'FX-V01', expect: 'pass', file: 'FX-V01-bundle.jsonl', kind: 'jsonl' },
        { id: 'FX-V02', expect: 'pass', file: 'FX-V02-session-log.md', kind: 'session_log' },
        { id: 'FX-V03', expect: 'pass', file: 'FX-V03-amendment.jsonl', kind: 'jsonl' },
        { id: 'FX-V04', expect: 'pass', file: 'FX-V04-compact-retry.jsonl', kind: 'jsonl' },
        { id: 'FX-I01', expect: 'fail', codes: ['MSS-SCHEMA-UNKNOWN', 'MSS-REVISION-UNKNOWN'], file: 'FX-I01-schema.jsonl', kind: 'jsonl' },
        { id: 'FX-I02', expect: 'fail', codes: ['MSS-VITAL-MISSING', 'MSS-VITAL-PLACEHOLDER'], file: 'FX-I02-vital.jsonl', kind: 'jsonl' },
        { id: 'FX-I03', expect: 'fail', codes: ['MSS-EVENT-CONTAINS-AXIS'], file: 'FX-I03-axis-in-event.jsonl', kind: 'jsonl' },
        { id: 'FX-I04', expect: 'fail', codes: ['MSS-CAPTURE-KEY-COLLISION', 'MSS-RECORD-ID-COLLISION'], file: 'FX-I04-capture-collision.jsonl', kind: 'jsonl' },
        { id: 'FX-I05', expect: 'fail', codes: ['MSS-REF-UNRESOLVABLE'], file: 'FX-I05-ref.jsonl', kind: 'jsonl' },
        { id: 'FX-I06', expect: 'fail', codes: ['MSS-PRODUCT-GATE'], file: 'FX-I06-product-gate.jsonl', kind: 'jsonl' },
        { id: 'FX-I07', expect: 'fail', codes: ['MSS-REPORT-NO-CAPSULE'], file: 'FX-I07-report-no-capsule.md', kind: 'report' },
        { id: 'FX-I08', expect: 'fail', codes: ['MSS-LIGHT-NO-EVENT'], file: 'FX-I08-session-log-bad.md', kind: 'session_log' },
        { id: 'FX-I09', expect: 'fail', codes: ['MSS-VERIFIER-NOT-INDEPENDENT'], file: 'FX-I09-verifier.jsonl', kind: 'jsonl' },
        { id: 'FX-I10', expect: 'warn', codes: ['MSS-LOCK-UNAUTHORIZED'], file: 'FX-I10-lock.jsonl', kind: 'jsonl' },
      ],
      supplemental: [
        { id: 'FX-V01-report', representation_of: 'FX-V01', expect: 'pass', file: 'FX-V01-report.md', kind: 'report' },
        { id: 'FX-S01', expect: 'fail', codes: ['MSS-FINAL-AXIS-MISSING'], file: 'FX-S01-missing-axis.jsonl', kind: 'jsonl' },
        { id: 'FX-S02', expect: 'fail', codes: ['MSS-PARSE-JSON'], file: 'FX-S02-malformed.jsonl', kind: 'jsonl' },
        { id: 'FX-S03', expect: 'fail', codes: ['MSS-ANNOTATION-ORPHAN'], file: 'FX-S03-orphan-annotation.jsonl', kind: 'jsonl' },
        { id: 'FX-S04', expect: 'fail', codes: ['MSS-SESSION-MISMATCH', 'MSS-CORRELATION-MISMATCH'], file: 'FX-S04-session-correlation-mismatch.jsonl', kind: 'jsonl' },
        { id: 'FX-S05', expect: 'fail', codes: ['MSS-AMENDMENT-ORPHAN'], file: 'FX-S05-amendment-missing-target.jsonl', kind: 'jsonl' },
        { id: 'FX-S06', expect: 'fail', codes: ['MSS-AMENDMENT-CYCLE', 'MSS-AMENDMENT-FIELD-PATH-INVALID'], file: 'FX-S06-amendment-cycle.jsonl', kind: 'jsonl' },
        { id: 'FX-S07', expect: 'fail', codes: ['MSS-NON-APPLICABILE-NO-REASON'], file: 'FX-S07-non-applicabile-no-reason.jsonl', kind: 'jsonl' },
        { id: 'FX-S08', expect: 'fail', codes: ['MSS-REF-TRAVERSAL'], file: 'FX-S08-path-traversal.jsonl', kind: 'jsonl' },
        { id: 'FX-S09', expect: 'fail', codes: ['MSS-PARSE-JSONL-AMBIGUOUS'], file: 'FX-S09-ambiguous-jsonl.md', kind: 'report' },
        { id: 'FX-S10-staged', expect: 'pass', file: 'FX-S10-staged-valid.jsonl', kind: 'jsonl' },
        { id: 'FX-S10-worktree', expect: 'fail', codes: ['MSS-SCHEMA-UNKNOWN'], file: 'FX-S10-worktree-invalid.jsonl', kind: 'jsonl' },
        { id: 'FX-S11', expect: 'fail', codes: ['MSS-STRUCTURE-INVALID', 'MSS-VITAL-MISSING'], file: 'FX-S11-missing-packages.jsonl', kind: 'jsonl' },
        { id: 'FX-S12', expect: 'fail', codes: ['MSS-FINAL-AXIS-NOT-FINAL', 'MSS-FINALIZATION-MISMATCH'], file: 'FX-S12-draft-axes.jsonl', kind: 'jsonl' },
        { id: 'FX-S13', expect: 'fail', codes: ['MSS-VERIFIER-NOT-INDEPENDENT'], file: 'FX-S13-verifier-subject.jsonl', kind: 'jsonl' },
        { id: 'FX-S14', expect: 'fail', codes: ['MSS-OUTPUT-ASSERTION', 'MSS-PRODUCT-GATE'], file: 'FX-S14-output-without-product-candidate.jsonl', kind: 'jsonl' },
        { id: 'FX-S15', expect: 'fail', codes: ['MSS-SESSION-EVENT-COUNT'], file: 'FX-S15-two-session-events.jsonl', kind: 'jsonl' },
        { id: 'FX-S16', expect: 'fail', codes: ['MSS-LIGHT-EVENT-MISMATCH'], file: 'FX-S16-session-log-event-mismatch.md', kind: 'session_log' },
        { id: 'FX-S17', expect: 'fail', codes: ['MSS-PERSONA-ASSERTION'], file: 'FX-S17-persona-empty.jsonl', kind: 'jsonl' },
        { id: 'FX-S18', expect: 'fail', codes: ['MSS-SYSTEM-ASSERTION'], file: 'FX-S18-system-empty.jsonl', kind: 'jsonl' },
        { id: 'FX-S19', expect: 'fail', codes: ['MSS-OUTPUT-ASSERTION'], file: 'FX-S19-output-product-only.jsonl', kind: 'jsonl' },
        { id: 'FX-S20', expect: 'fail', codes: ['MSS-CONTROL-RATIO'], file: 'FX-S20-control-denominator.jsonl', kind: 'jsonl' },
        { id: 'FX-S21', expect: 'fail', codes: ['MSS-REF-ORPHAN'], file: 'FX-S21-orphan-source-ref.jsonl', kind: 'jsonl' },
        { id: 'FX-S22', expect: 'fail', codes: ['MSS-SCHEMA-REVISION-INCOMPATIBLE'], file: 'FX-S22-schema-revision-crossed.jsonl', kind: 'jsonl' },
        { id: 'FX-S23', expect: 'fail', codes: ['MSS-REPORT-MODE-INVALID'], file: 'FX-S23-mode-hybrid.md', kind: 'report' },
        { id: 'FX-S24', expect: 'fail', codes: ['MSS-REPORT-MODE-INVALID'], file: 'FX-S24-mode-unknown.md', kind: 'report' },
      ],
    }

function fixtureHash(file) {
  return createHash('sha256').update(readFileSync(join(root, file))).digest('hex')
}

for (const fixture of manifest.frozen) fixture.content_sha256 = fixtureHash(fixture.file)
manifest.frozen.find((fixture) => fixture.id === 'FX-V02').support_files = [
  { file: 'FX-V02-light.jsonl', content_sha256: fixtureHash('FX-V02-light.jsonl') },
]
manifest.supplemental.unshift({
  id: 'FX-V02-light',
  representation_of: 'FX-V02',
  expect: 'pass',
  file: 'FX-V02-light.jsonl',
  kind: 'jsonl',
})

write('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`)

console.log('fixtures written to', root)
