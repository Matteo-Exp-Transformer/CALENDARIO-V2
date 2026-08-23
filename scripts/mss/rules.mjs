/** Codici regola stabili del validator MetaSkillSystem H-1. Nessun valore personale nei messaggi. */

export const SCHEMA_CURRENT = 'mss.session/0.1.1'
export const SCHEMA_LEGACY = 'mss.session/0.1.0'
export const REVISION_CURRENT = 'mss-v0.1-wp0.1-freeze-2'
export const REVISION_LEGACY = 'mss-v0.1-wp0.1-freeze-1'
export const PROTOCOL_ID = 'MSS-PILOT-001'
export const PROTOCOL_VERSION = '1.0.1'

export const KNOWN_SCHEMAS = new Set([SCHEMA_CURRENT, SCHEMA_LEGACY])
export const KNOWN_REVISIONS = new Set([REVISION_CURRENT, REVISION_LEGACY])
export const SCHEMA_REVISION_PAIRS = new Map([
  [SCHEMA_LEGACY, REVISION_LEGACY],
  [SCHEMA_CURRENT, REVISION_CURRENT],
])

export const RULE = Object.freeze({
  PARSE_JSON: 'MSS-PARSE-JSON',
  UTF8_INVALID: 'MSS-UTF8-INVALID',
  PARSE_JSONL_AMBIGUOUS: 'MSS-PARSE-JSONL-AMBIGUOUS',
  SCHEMA_UNKNOWN: 'MSS-SCHEMA-UNKNOWN',
  REVISION_UNKNOWN: 'MSS-REVISION-UNKNOWN',
  SCHEMA_REVISION_INCOMPATIBLE: 'MSS-SCHEMA-REVISION-INCOMPATIBLE',
  VITAL_MISSING: 'MSS-VITAL-MISSING',
  VITAL_PLACEHOLDER: 'MSS-VITAL-PLACEHOLDER',
  STRUCTURE_INVALID: 'MSS-STRUCTURE-INVALID',
  ENUM_INVALID: 'MSS-ENUM-INVALID',
  ID_INVALID: 'MSS-ID-INVALID',
  TIMESTAMP_INVALID: 'MSS-TIMESTAMP-INVALID',
  NON_APPLICABILE_NO_REASON: 'MSS-NON-APPLICABILE-NO-REASON',
  FINAL_AXIS_MISSING: 'MSS-FINAL-AXIS-MISSING',
  FINAL_AXIS_NOT_FINAL: 'MSS-FINAL-AXIS-NOT-FINAL',
  FINALIZATION_MISMATCH: 'MSS-FINALIZATION-MISMATCH',
  SESSION_EVENT_COUNT: 'MSS-SESSION-EVENT-COUNT',
  EVENT_CONTAINS_AXIS: 'MSS-EVENT-CONTAINS-AXIS',
  RECORD_ID_COLLISION: 'MSS-RECORD-ID-COLLISION',
  CAPTURE_KEY_COLLISION: 'MSS-CAPTURE-KEY-COLLISION',
  CROSS_FILE_DUPLICATE: 'MSS-CROSS-FILE-DUPLICATE',
  CORRELATION_MISMATCH: 'MSS-CORRELATION-MISMATCH',
  SESSION_MISMATCH: 'MSS-SESSION-MISMATCH',
  REF_UNRESOLVABLE: 'MSS-REF-UNRESOLVABLE',
  REF_TRAVERSAL: 'MSS-REF-TRAVERSAL',
  PRODUCT_GATE: 'MSS-PRODUCT-GATE',
  PERSONA_ASSERTION: 'MSS-PERSONA-ASSERTION',
  SYSTEM_ASSERTION: 'MSS-SYSTEM-ASSERTION',
  OUTPUT_ASSERTION: 'MSS-OUTPUT-ASSERTION',
  ANNOTATION_DELTA_INVALID: 'MSS-ANNOTATION-DELTA-INVALID',
  CONTROL_RATIO: 'MSS-CONTROL-RATIO',
  REF_ORPHAN: 'MSS-REF-ORPHAN',
  REPORT_NO_CAPSULE: 'MSS-REPORT-NO-CAPSULE',
  REPORT_MODE_INVALID: 'MSS-REPORT-MODE-INVALID',
  LIGHT_NO_EVENT: 'MSS-LIGHT-NO-EVENT',
  LIGHT_EVENT_MISMATCH: 'MSS-LIGHT-EVENT-MISMATCH',
  VERIFIER_NOT_INDEPENDENT: 'MSS-VERIFIER-NOT-INDEPENDENT',
  LOCK_UNAUTHORIZED: 'MSS-LOCK-UNAUTHORIZED',
  STAGED_WORKTREE_MISMATCH: 'MSS-STAGED-WORKTREE-MISMATCH',
  AMENDMENT_ORPHAN: 'MSS-AMENDMENT-ORPHAN',
  AMENDMENT_TARGET_AMBIGUOUS: 'MSS-AMENDMENT-TARGET-AMBIGUOUS',
  AMENDMENT_TARGET_NOT_FINAL: 'MSS-AMENDMENT-TARGET-NOT-FINAL',
  AMENDMENT_CYCLE: 'MSS-AMENDMENT-CYCLE',
  AMENDMENT_CONFLICT: 'MSS-AMENDMENT-CONFLICT',
  AMENDMENT_PREVIOUS_MISMATCH: 'MSS-AMENDMENT-PREVIOUS-MISMATCH',
  AMENDMENT_FIELD_PATH_INVALID: 'MSS-AMENDMENT-FIELD-PATH-INVALID',
  AMENDMENT_SUPERSEDES_UNSUPPORTED: 'MSS-AMENDMENT-SUPERSEDES-UNSUPPORTED',
  ANNOTATION_ORPHAN: 'MSS-ANNOTATION-ORPHAN',
  DRAFT_AS_FINAL: 'MSS-DRAFT-AS-FINAL',
  FIXTURE_EXPECTATION: 'MSS-FIXTURE-EXPECTATION',
  FIXTURE_UNDECLARED: 'MSS-FIXTURE-UNDECLARED',
  FIXTURE_PROTOCOL: 'MSS-FIXTURE-PROTOCOL',
  FINAL_RECORD_MODIFIED: 'MSS-FINAL-RECORD-MODIFIED',
  FINAL_RECORD_REMOVED: 'MSS-FINAL-RECORD-REMOVED',
  LEGACY_NEW_FORBIDDEN: 'MSS-LEGACY-NEW-FORBIDDEN',
})

export const AXES = Object.freeze(['persona', 'sistema', 'output'])
export const PRODUCT_GATES = Object.freeze([
  'recipient',
  'problem_or_job',
  'canonical_version',
  'fixed_acceptance_criterion',
  'verification_or_use_evidence',
])

export const LOGICAL_REF_SCHEMAS = Object.freeze([
  'conversation:',
  'mss-rec:',
  'mss-evt:',
  'mss-ann:',
  'mss-amd:',
  'owner:',
])

export const PLACEHOLDER_RE = /^(?:\s*|TODO|TBD|\.\.\.|___+|n\/?a)$/i
export const LOCK_HINT_RE = /\bLOCK\b|\block[_-]file\b|\bWRITE[_-]FORBIDDEN\b/i

export const ENUM = Object.freeze({
  recordType: ['session_event', 'annotation', 'amendment'],
  finalization: ['draft', 'final'],
  actorType: ['matteo', 'agente', 'congiunto', 'terzo', 'sistema'],
  eventKind: ['session_close', 'compact_snapshot', 'interruption', 'invalidation'],
  sessionType: ['light', 'standard', 'deep', 'meta', 'valutativa'],
  capsuleStatus: ['completa', 'interrotta', 'invalidata'],
  privacyClassification: ['public', 'internal', 'personal', 'sensitive', 'sealed_test'],
  externalRelease: ['forbidden', 'requires_confirmation', 'allowed'],
  axis: AXES,
  assertionBasis: ['self_report', 'direct_observation', 'source_derived', 'joint_statement'],
  verificationStatus: [
    'self_report',
    'unverified',
    'independently_verified',
    'contradicted',
    'not_applicable',
  ],
  amendmentRelation: ['amends', 'supersedes'],
  controlOutcome: ['pass', 'fail', 'non_applicabile', 'non_noto'],
  personaAssistance: ['spontaneo', 'guidato', 'suggerito_agente', 'congiunto'],
  personaOrigin: ['naturale', 'sonda_trasparente', 'test_sigillato', 'inferenza'],
  evidenceState: ['observed', 'self_report', 'unverified', 'independently_verified', 'contradicted', 'not_applicable'],
  outputPrimaryType: ['prodotto', 'processo', 'prova', 'governance', 'registro'],
  productGate: ['pass', 'fail'],
  productResult: ['eligible', 'not_eligible'],
})

export const ID_RE = Object.freeze({
  record: /^mss-rec-[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  session: /^mss-ses-[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  correlation: /^mss-cor-[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  event: /^mss-evt-[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  annotation: /^mss-ann-[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  amendment: /^mss-amd-[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
})

export const RFC3339_TZ_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/
