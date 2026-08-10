import { SCHEMA_CURRENT, REVISION_CURRENT } from '../../../../scripts/mss/rules.mjs'

const IDS = {
  ses: 'mss-ses-0198b000-0001-7000-8000-000000000001',
  cor: 'mss-cor-0198b000-0001-7000-8000-000000000002',
  recEvt: 'mss-rec-0198b000-0001-7000-8000-000000000010',
  recP: 'mss-rec-0198b000-0001-7000-8000-000000000011',
  recS: 'mss-rec-0198b000-0001-7000-8000-000000000012',
  recO: 'mss-rec-0198b000-0001-7000-8000-000000000013',
  recAmd: 'mss-rec-0198b000-0001-7000-8000-000000000014',
  evt: 'mss-evt-0198b000-0001-7000-8000-000000000020',
  annP: 'mss-ann-0198b000-0001-7000-8000-000000000030',
  annS: 'mss-ann-0198b000-0001-7000-8000-000000000031',
  annO: 'mss-ann-0198b000-0001-7000-8000-000000000032',
  amd: 'mss-amd-0198b000-0001-7000-8000-000000000040',
}

function recordedBy(actor = 'fixture-agent') {
  return {
    actor_id: actor,
    actor_type: 'agente',
    role: 'capture_operator',
    agent_runtime: {
      provider: 'synthetic',
      model: 'fixture-model',
      runtime: 'fixture-runtime',
      surface: 'local-fixture',
    },
    tools_used: ['filesystem'],
  }
}

function packages() {
  return [
    {
      package_id: 'metaskill-system',
      package_version_or_revision: REVISION_CURRENT,
      source_ref: 'docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md',
    },
  ]
}

function baseRecord(overrides) {
  return {
    schema_version: SCHEMA_CURRENT,
    system_revision: REVISION_CURRENT,
    session_id: IDS.ses,
    correlation_id: IDS.cor,
    segment_no: 1,
    created_at: '2026-08-10T10:00:00+02:00',
    finalization: 'final',
    recorded_by: recordedBy(),
    packages_loaded: packages(),
    ...overrides,
  }
}

function ownerRef(path = 'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md') {
  return {
    ref_id: 'owner-contract',
    owner_id: 'mss-contract-v0.1',
    uri_or_path: path,
    stable_anchor_or_event_id: 'schema',
    revision_or_hash: REVISION_CURRENT,
    sensitivity: 'internal',
  }
}

function sourceRef(path = 'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md') {
  return {
    ref_id: 'source-contract',
    owner_id: 'mss-contract-v0.1',
    uri_or_path: path,
    stable_anchor_or_event_id: 'fixture',
    revision_or_hash: REVISION_CURRENT,
    sensitivity: 'internal',
  }
}

export function sessionEvent(extraEvent = {}, extraTop = {}) {
  return baseRecord({
    record_type: 'session_event',
    record_id: IDS.recEvt,
    capture_key: `${IDS.ses}/1/session_event/1`,
    event: {
      event_id: IDS.evt,
      event_kind: 'session_close',
      occurred_at: '2026-08-10T09:59:00+02:00',
      continues_record_id: 'nessuno',
      causation_record_id: 'nessuno',
      intent_user: 'synthetic fixture intent',
      session_type: 'standard',
      capsule_status: 'completa',
      role_key: 'fixture_writer',
      area: 'MetaSkillSystem fixture',
      environment: 'repository locale; dati sintetici',
      authorization: {
        read: ['contratto'],
        write: ['fixture'],
        forbid: ['dati personali', 'PROD'],
      },
      authorized_outputs: ['fixture'],
      route: { chosen: 'MetaSkillSystem/fixture', alternatives_or_conflicts: 'nessuno' },
      observed_outcome: 'fixture written',
      open_items: 'nessuno',
      controls: 'nessuno',
      subject_runtime: {
        actor_id: 'fixture-agent',
        provider: 'synthetic',
        model: 'fixture-model',
        runtime: 'fixture-runtime',
        surface: 'local-fixture',
      },
      privacy: {
        classification: 'internal',
        capture_basis: 'operational_need',
        allowed_content: ['dati sintetici'],
        prohibited_content: ['dati personali', 'segreti'],
        redactions: 'nessuno',
        external_release: 'forbidden',
        retention: 'undecided_wp0.1',
        rectification_route: 'amendment',
      },
      owner_refs: [ownerRef()],
      source_refs: [sourceRef()],
      ...extraEvent,
    },
    ...extraTop,
  })
}

export function annotation(axis, id, annId, ordinal, assertion) {
  return baseRecord({
    record_type: 'annotation',
    record_id: id,
    capture_key: `${IDS.ses}/1/annotation/${ordinal}`,
    created_at: `2026-08-10T10:00:0${ordinal}+02:00`,
    annotation: {
      annotation_id: annId,
      axis,
      subject_record_ids: [IDS.recEvt],
      delta: axis === 'persona' ? 'nessuno' : axis === 'sistema' ? 'nessuno' : 'creato',
      assertions: [assertion],
      asserted_by: { actor_id: 'fixture-agent', role: 'capture_operator', basis: 'self_report' },
      verification: {
        status: 'self_report',
        verified_by: [],
        verified_at: 'non_applicabile:self_report',
        criterion_ref: 'non_applicabile:fixture',
        evidence_refs: ['source-contract'],
        notes: 'synthetic',
      },
    },
  })
}

export function axisPersona() {
  return annotation('persona', IDS.recP, IDS.annP, 1, {
    signal: 'non_osservato',
    actor: 'fixture-subject',
    assistance: 'non_applicabile:fixture',
    origin: 'naturale',
    source_ref: 'source-contract',
    effect: 'nessuno',
    evidence_state: 'not_applicable',
  })
}

export function axisSistema() {
  return annotation('sistema', IDS.recS, IDS.annS, 2, {
    rule_id_version: `${SCHEMA_CURRENT}#fixture`,
    trigger_event: 'fixture',
    decision_or_output_changed: 'none',
    G: 2,
    O: 1,
    E: 0,
  })
}

export function axisOutput(productCandidate) {
  return annotation('output', IDS.recO, IDS.annO, 3, {
    output_id: 'mss-fixture-output',
    primary_type: 'prova',
    canonical_version: '1.0.0',
    recipient: 'H-1 validator',
    problem_or_job: 'exercise fixture',
    intended_use: 'test',
    conceived_by: 'fixture-author',
    decided_by: 'H-1',
    directed_by: 'H-1',
    authored_by: 'fixture-agent',
    verified_by: 'non_osservato',
    acceptance_criterion: 'validator codes match',
    verification_or_use_evidence: 'non_osservato',
    verification_status: 'unverified',
    owner_ref: 'owner-contract',
    privacy_release: 'internal',
    support_files: [],
    relations_no_double_count: ['single output'],
    product_candidate: productCandidate || {
      recipient: 'pass',
      problem_or_job: 'pass',
      canonical_version: 'pass',
      fixed_acceptance_criterion: 'pass',
      verification_or_use_evidence: 'fail',
      result: 'not_eligible',
    },
  })
}

export function validBundle() {
  return [sessionEvent(), axisPersona(), axisSistema(), axisOutput()]
}

export function amendment(target = IDS.recEvt) {
  return baseRecord({
    record_type: 'amendment',
    record_id: IDS.recAmd,
    capture_key: `${IDS.ses}/1/amendment/1`,
    created_at: '2026-08-10T10:05:00+02:00',
    amendment: {
      amendment_id: IDS.amd,
      target_record_id: target,
      relation: 'amends',
      reason: 'synthetic correction',
      changes: [
        {
          field_path: 'event.open_items',
          previous_value_or_hash: 'nessuno',
          corrected_value: 'follow-up synthetic',
        },
      ],
      evidence_refs: ['source-contract'],
      effective_at: '2026-08-10T10:05:00+02:00',
    },
  })
}

export function toJsonl(records) {
  return records.map((r) => JSON.stringify(r)).join('\n') + '\n'
}

export { IDS, ownerRef, sourceRef, baseRecord, recordedBy, packages }
