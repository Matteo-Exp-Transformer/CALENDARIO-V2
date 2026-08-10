import {
  AXES,
  ENUM,
  ID_RE,
  KNOWN_REVISIONS,
  KNOWN_SCHEMAS,
  LOCK_HINT_RE,
  PLACEHOLDER_RE,
  PRODUCT_GATES,
  RULE,
  RFC3339_TZ_RE,
  SCHEMA_REVISION_PAIRS,
} from './rules.mjs'
import { canonicalJson, decodeUtf8 } from './canonical.mjs'
import { resolveRef } from './refs.mjs'
import { collectBundlesFromInput, parseJsonlText } from './parse.mjs'

function issue(list, partial) {
  list.push({
    severity: partial.severity || 'deny',
    rule: partial.rule,
    file: partial.file || '<bundle>',
    fieldPath: partial.fieldPath || '',
    message: partial.message || partial.rule,
  })
}

function isEmpty(v) {
  return v === undefined || v === null || v === ''
}

function isPlaceholder(v) {
  if (typeof v !== 'string') return false
  return PLACEHOLDER_RE.test(v.trim())
}

function checkNonApplicabile(value, fieldPath, file, out) {
  if (typeof value !== 'string') return
  if (value === 'non_applicabile' || /^non_applicabile:?\s*$/i.test(value)) {
    issue(out, {
      rule: RULE.NON_APPLICABILE_NO_REASON,
      file,
      fieldPath,
      message: 'non_applicabile requires an explicit reason',
    })
  }
}

function walkStrings(value, path, fn) {
  if (typeof value === 'string') {
    fn(value, path)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkStrings(v, `${path}[${i}]`, fn))
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      walkStrings(v, path ? `${path}.${k}` : k, fn)
    }
  }
}

function recordCanonical(entry) {
  return canonicalJson(entry.record)
}

const EVENT_AXIS_KEYS = new Set([
  'delta_persona',
  'delta_sistema',
  'delta_output',
  'persona',
  'sistema',
  'output',
  'annotation',
  'annotations',
  'product_candidate',
  'G',
  'O',
  'E',
])

function requireValue(object, key, path, file, out) {
  const fieldPath = path ? `${path}.${key}` : key
  const value = object?.[key]
  if (isEmpty(value)) {
    issue(out, { rule: RULE.VITAL_MISSING, file, fieldPath, message: 'Required field missing' })
    return undefined
  }
  if (typeof value === 'string' && isPlaceholder(value)) {
    issue(out, { rule: RULE.VITAL_PLACEHOLDER, file, fieldPath, message: 'Required field is a placeholder' })
  }
  return value
}

function requireObject(value, fieldPath, file, out) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    issue(out, { rule: RULE.STRUCTURE_INVALID, file, fieldPath, message: 'Expected object' })
    return false
  }
  return true
}

function requireArray(value, fieldPath, file, out, { min = 0 } = {}) {
  if (!Array.isArray(value) || value.length < min) {
    issue(out, { rule: RULE.STRUCTURE_INVALID, file, fieldPath, message: 'Expected array' })
    return false
  }
  return true
}

function requireEnum(value, allowed, fieldPath, file, out) {
  if (!allowed.includes(value)) {
    issue(out, { rule: RULE.ENUM_INVALID, file, fieldPath, message: 'Value is outside the contract enum' })
    return false
  }
  return true
}

function requireId(value, pattern, fieldPath, file, out) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    issue(out, { rule: RULE.ID_INVALID, file, fieldPath, message: 'Identifier is not a prefixed UUIDv7' })
    return false
  }
  return true
}

function requireTimestamp(value, fieldPath, file, out) {
  if (typeof value !== 'string' || !RFC3339_TZ_RE.test(value) || Number.isNaN(Date.parse(value))) {
    issue(out, { rule: RULE.TIMESTAMP_INVALID, file, fieldPath, message: 'Expected RFC3339 timestamp with timezone' })
    return false
  }
  return true
}

function validateRuntime(runtime, fieldPath, file, out, { allowHumanReason = false } = {}) {
  if (allowHumanReason && typeof runtime === 'string' && /^non_applicabile:\s*\S.+/i.test(runtime)) return
  if (!requireObject(runtime, fieldPath, file, out)) return
  for (const key of ['provider', 'model', 'runtime', 'surface']) requireValue(runtime, key, fieldPath, file, out)
}

function validateRefShape(ref, fieldPath, file, out) {
  if (!requireObject(ref, fieldPath, file, out)) return
  for (const key of [
    'ref_id',
    'owner_id',
    'uri_or_path',
    'stable_anchor_or_event_id',
    'revision_or_hash',
    'sensitivity',
  ]) {
    requireValue(ref, key, fieldPath, file, out)
  }
}

function validateControl(control, fieldPath, file, out) {
  if (!requireObject(control, fieldPath, file, out)) return
  for (const key of ['control_id', 'criterio', 'esito', 'numeratore', 'denominatore', 'esecutore']) {
    requireValue(control, key, fieldPath, file, out)
  }
  if (control.esito !== undefined) requireEnum(control.esito, ENUM.controlOutcome, `${fieldPath}.esito`, file, out)
  requireArray(control.evidence_refs, `${fieldPath}.evidence_refs`, file, out)
  const numeratorOk = typeof control.numeratore === 'number' && Number.isFinite(control.numeratore) && control.numeratore >= 0
  const denominatorOk = typeof control.denominatore === 'number' && Number.isFinite(control.denominatore) && control.denominatore > 0
  if (!numeratorOk || !denominatorOk || (numeratorOk && denominatorOk && control.numeratore > control.denominatore)) {
    issue(out, {
      rule: RULE.CONTROL_RATIO,
      file,
      fieldPath: `${fieldPath}.${!denominatorOk ? 'denominatore' : 'numeratore'}`,
      message: 'Control numerator and denominator must be finite and coherent',
    })
  }
}

function requireAssertionFields(assertion, keys, basePath, rule, file, out) {
  if (!requireObject(assertion, basePath, file, out)) {
    issue(out, { rule, file, fieldPath: basePath, message: 'Axis assertion must be an object' })
    return false
  }
  let ok = true
  for (const key of keys) {
    if (isEmpty(assertion[key]) || (typeof assertion[key] === 'string' && isPlaceholder(assertion[key]))) {
      issue(out, { rule, file, fieldPath: `${basePath}.${key}`, message: 'Required axis assertion field missing' })
      ok = false
    }
  }
  return ok
}

function validatePersonaAssertion(assertion, fieldPath, file, out) {
  const complete = requireAssertionFields(
    assertion,
    ['signal', 'actor', 'assistance', 'origin', 'source_ref', 'effect', 'evidence_state'],
    fieldPath,
    RULE.PERSONA_ASSERTION,
    file,
    out,
  )
  if (!complete) return
  if (!ENUM.personaAssistance.includes(assertion.assistance) && !/^non_applicabile:\s*\S.+/i.test(String(assertion.assistance))) {
    issue(out, { rule: RULE.PERSONA_ASSERTION, file, fieldPath: `${fieldPath}.assistance`, message: 'Invalid Persona assistance enum' })
  }
  if (!ENUM.personaOrigin.includes(assertion.origin)) {
    issue(out, { rule: RULE.PERSONA_ASSERTION, file, fieldPath: `${fieldPath}.origin`, message: 'Invalid Persona origin enum' })
  }
  if (!ENUM.evidenceState.includes(assertion.evidence_state)) {
    issue(out, { rule: RULE.PERSONA_ASSERTION, file, fieldPath: `${fieldPath}.evidence_state`, message: 'Invalid Persona evidence state' })
  }
}

function validateSystemAssertion(assertion, fieldPath, file, out) {
  const complete = requireAssertionFields(
    assertion,
    ['rule_id_version', 'trigger_event', 'decision_or_output_changed', 'G', 'O', 'E'],
    fieldPath,
    RULE.SYSTEM_ASSERTION,
    file,
    out,
  )
  if (!complete) return
  for (const [key, max] of [['G', 2], ['O', 3], ['E', 3]]) {
    if (!Number.isInteger(assertion[key]) || assertion[key] < 0 || assertion[key] > max) {
      issue(out, { rule: RULE.SYSTEM_ASSERTION, file, fieldPath: `${fieldPath}.${key}`, message: 'G/O/E must be an integer in the contractual domain' })
    }
  }
}

const OUTPUT_ASSERTION_FIELDS = [
  'output_id', 'primary_type', 'canonical_version', 'recipient', 'problem_or_job', 'intended_use',
  'conceived_by', 'decided_by', 'directed_by', 'authored_by', 'verified_by', 'acceptance_criterion',
  'verification_or_use_evidence', 'verification_status', 'owner_ref', 'privacy_release',
  'support_files', 'relations_no_double_count', 'product_candidate',
]

function validateOutputAssertion(assertion, fieldPath, file, out) {
  const complete = requireAssertionFields(assertion, OUTPUT_ASSERTION_FIELDS, fieldPath, RULE.OUTPUT_ASSERTION, file, out)
  if (!complete) return
  if (!ENUM.outputPrimaryType.includes(assertion.primary_type)) {
    issue(out, { rule: RULE.OUTPUT_ASSERTION, file, fieldPath: `${fieldPath}.primary_type`, message: 'Invalid Output primary type' })
  }
  if (!ENUM.verificationStatus.includes(assertion.verification_status)) {
    issue(out, { rule: RULE.OUTPUT_ASSERTION, file, fieldPath: `${fieldPath}.verification_status`, message: 'Invalid Output verification status' })
  }
  if (!Array.isArray(assertion.support_files)) {
    issue(out, { rule: RULE.OUTPUT_ASSERTION, file, fieldPath: `${fieldPath}.support_files`, message: 'Output support_files must be an array' })
  }
  if (!Array.isArray(assertion.relations_no_double_count)) {
    issue(out, { rule: RULE.OUTPUT_ASSERTION, file, fieldPath: `${fieldPath}.relations_no_double_count`, message: 'Output relations_no_double_count must be an array' })
  }
}

function validateRecordedBy(record, file, out) {
  const rb = record.recorded_by
  if (!requireObject(rb, 'recorded_by', file, out)) return
  for (const key of ['actor_id', 'actor_type', 'role', 'agent_runtime', 'tools_used']) {
    requireValue(rb, key, 'recorded_by', file, out)
  }
  if (rb.actor_type !== undefined) requireEnum(rb.actor_type, ENUM.actorType, 'recorded_by.actor_type', file, out)
  validateRuntime(rb.agent_runtime, 'recorded_by.agent_runtime', file, out, {
    allowHumanReason: rb.actor_type === 'matteo' || rb.actor_type === 'terzo',
  })
  requireArray(rb.tools_used, 'recorded_by.tools_used', file, out)
}

function validatePackages(record, file, out) {
  if (!requireArray(record.packages_loaded, 'packages_loaded', file, out, { min: 1 })) return
  record.packages_loaded.forEach((pkg, i) => {
    const path = `packages_loaded[${i}]`
    if (!requireObject(pkg, path, file, out)) return
    for (const key of ['package_id', 'package_version_or_revision', 'source_ref']) {
      requireValue(pkg, key, path, file, out)
    }
  })
}

function validateEvent(record, file, out) {
  const ev = record.event
  if (!requireObject(ev, 'event', file, out)) return
  const required = [
    'event_id',
    'event_kind',
    'occurred_at',
    'continues_record_id',
    'causation_record_id',
    'intent_user',
    'session_type',
    'capsule_status',
    'role_key',
    'area',
    'environment',
    'authorization',
    'authorized_outputs',
    'route',
    'observed_outcome',
    'open_items',
    'subject_runtime',
    'privacy',
    'owner_refs',
    'source_refs',
  ]
  // controls e obbligatorio in 0.1.1; lo storico 0.1.0 resta leggibile senza retro-edit.
  if (record.schema_version !== 'mss.session/0.1.0') required.push('controls')
  for (const key of required) requireValue(ev, key, 'event', file, out)

  requireId(ev.event_id, ID_RE.event, 'event.event_id', file, out)
  requireEnum(ev.event_kind, ENUM.eventKind, 'event.event_kind', file, out)
  requireTimestamp(ev.occurred_at, 'event.occurred_at', file, out)
  requireEnum(ev.session_type, ENUM.sessionType, 'event.session_type', file, out)
  requireEnum(ev.capsule_status, ENUM.capsuleStatus, 'event.capsule_status', file, out)
  for (const [key, path] of [
    ['continues_record_id', 'event.continues_record_id'],
    ['causation_record_id', 'event.causation_record_id'],
  ]) {
    if (ev[key] !== 'nessuno') requireId(ev[key], ID_RE.record, path, file, out)
  }

  if (requireObject(ev.authorization, 'event.authorization', file, out)) {
    for (const key of ['read', 'write', 'forbid']) {
      requireValue(ev.authorization, key, 'event.authorization', file, out)
      requireArray(ev.authorization[key], `event.authorization.${key}`, file, out)
    }
  }
  requireArray(ev.authorized_outputs, 'event.authorized_outputs', file, out)

  if (requireObject(ev.route, 'event.route', file, out)) {
    requireValue(ev.route, 'chosen', 'event.route', file, out)
    requireValue(ev.route, 'alternatives_or_conflicts', 'event.route', file, out)
    const alternatives = ev.route.alternatives_or_conflicts
    if (alternatives !== 'nessuno') requireArray(alternatives, 'event.route.alternatives_or_conflicts', file, out)
  }
  if (ev.open_items !== 'nessuno') requireArray(ev.open_items, 'event.open_items', file, out)
  validateRuntime(ev.subject_runtime, 'event.subject_runtime', file, out)

  if (requireObject(ev.privacy, 'event.privacy', file, out)) {
    for (const key of [
      'classification',
      'capture_basis',
      'allowed_content',
      'prohibited_content',
      'redactions',
      'external_release',
      'retention',
      'rectification_route',
    ]) {
      requireValue(ev.privacy, key, 'event.privacy', file, out)
    }
    requireEnum(ev.privacy.classification, ENUM.privacyClassification, 'event.privacy.classification', file, out)
    requireEnum(ev.privacy.external_release, ENUM.externalRelease, 'event.privacy.external_release', file, out)
    requireArray(ev.privacy.allowed_content, 'event.privacy.allowed_content', file, out)
    requireArray(ev.privacy.prohibited_content, 'event.privacy.prohibited_content', file, out)
    if (ev.privacy.redactions !== 'nessuno') requireArray(ev.privacy.redactions, 'event.privacy.redactions', file, out)
    if (
      ev.privacy.capture_basis !== 'non_applicabile' &&
      !['user_request', 'operational_need', 'explicit_consent'].includes(ev.privacy.capture_basis) &&
      !/^non_applicabile:\s*\S.+/i.test(String(ev.privacy.capture_basis || ''))
    ) {
      issue(out, { rule: RULE.ENUM_INVALID, file, fieldPath: 'event.privacy.capture_basis', message: 'Invalid capture_basis' })
    }
    if (ev.privacy.retention !== 'undecided_wp0.1') {
      issue(out, { rule: RULE.ENUM_INVALID, file, fieldPath: 'event.privacy.retention', message: 'Unexpected pilot retention value' })
    }
    if (ev.privacy.rectification_route !== 'amendment') {
      issue(out, { rule: RULE.ENUM_INVALID, file, fieldPath: 'event.privacy.rectification_route', message: 'Invalid rectification route' })
    }
  }

  for (const [key, path] of [['owner_refs', 'event.owner_refs'], ['source_refs', 'event.source_refs']]) {
    if (requireArray(ev[key], path, file, out)) ev[key].forEach((ref, i) => validateRefShape(ref, `${path}[${i}]`, file, out))
  }

  if (record.schema_version !== 'mss.session/0.1.0' && ev.controls !== 'nessuno') {
    if (requireArray(ev.controls, 'event.controls', file, out)) {
      ev.controls.forEach((control, i) => validateControl(control, `event.controls[${i}]`, file, out))
    }
  }

  for (const key of Object.keys(ev)) {
    if (EVENT_AXIS_KEYS.has(key)) {
      issue(out, {
        rule: RULE.EVENT_CONTAINS_AXIS,
        file,
        fieldPath: `event.${key}`,
        message: 'Axis annotation must not live inside the base event',
      })
    }
  }
}

function validateAnnotation(record, file, out) {
  const ann = record.annotation
  if (!requireObject(ann, 'annotation', file, out)) return
  for (const key of ['annotation_id', 'axis', 'subject_record_ids', 'delta', 'assertions', 'asserted_by', 'verification']) {
    requireValue(ann, key, 'annotation', file, out)
  }
  requireId(ann.annotation_id, ID_RE.annotation, 'annotation.annotation_id', file, out)
  requireEnum(ann.axis, ENUM.axis, 'annotation.axis', file, out)
  const delta = String(ann.delta || '')
  if (
    !['nessuno', 'creato', 'modificato', 'verificato', 'usato', 'scartato'].includes(delta) &&
    !/^\S(?:.*\S)?\s+->\s+\S(?:.*\S)?$/.test(delta)
  ) {
    issue(out, {
      rule: RULE.ANNOTATION_DELTA_INVALID,
      file,
      fieldPath: 'annotation.delta',
      message: 'Annotation delta is outside the contractual domain',
    })
  }
  if (requireArray(ann.subject_record_ids, 'annotation.subject_record_ids', file, out, { min: 1 })) {
    ann.subject_record_ids.forEach((id, i) => requireId(id, ID_RE.record, `annotation.subject_record_ids[${i}]`, file, out))
  }
  requireArray(ann.assertions, 'annotation.assertions', file, out, { min: 1 })
  if (Array.isArray(ann.assertions)) {
    ann.assertions.forEach((assertion, index) => {
      const path = `annotation.assertions[${index}]`
      if (ann.axis === 'persona') validatePersonaAssertion(assertion, path, file, out)
      else if (ann.axis === 'sistema') validateSystemAssertion(assertion, path, file, out)
      else if (ann.axis === 'output') validateOutputAssertion(assertion, path, file, out)
    })
  }
  if (requireObject(ann.asserted_by, 'annotation.asserted_by', file, out)) {
    for (const key of ['actor_id', 'role', 'basis']) requireValue(ann.asserted_by, key, 'annotation.asserted_by', file, out)
    requireEnum(ann.asserted_by.basis, ENUM.assertionBasis, 'annotation.asserted_by.basis', file, out)
  }
  if (requireObject(ann.verification, 'annotation.verification', file, out)) {
    for (const key of ['status', 'verified_by', 'verified_at', 'criterion_ref', 'evidence_refs', 'notes']) {
      requireValue(ann.verification, key, 'annotation.verification', file, out)
    }
    requireEnum(ann.verification.status, ENUM.verificationStatus, 'annotation.verification.status', file, out)
    requireArray(ann.verification.verified_by, 'annotation.verification.verified_by', file, out)
    requireArray(ann.verification.evidence_refs, 'annotation.verification.evidence_refs', file, out)
    if (!/^non_applicabile:\s*\S.+/i.test(String(ann.verification.verified_at || ''))) {
      requireTimestamp(ann.verification.verified_at, 'annotation.verification.verified_at', file, out)
    }
  }
}

function validateAmendment(record, file, out) {
  const amd = record.amendment
  if (!requireObject(amd, 'amendment', file, out)) return
  for (const key of ['amendment_id', 'target_record_id', 'relation', 'reason', 'changes', 'evidence_refs', 'effective_at']) {
    requireValue(amd, key, 'amendment', file, out)
  }
  requireId(amd.amendment_id, ID_RE.amendment, 'amendment.amendment_id', file, out)
  requireId(amd.target_record_id, ID_RE.record, 'amendment.target_record_id', file, out)
  requireEnum(amd.relation, ENUM.amendmentRelation, 'amendment.relation', file, out)
  if (amd.relation === 'supersedes') {
    issue(out, {
      rule: RULE.AMENDMENT_SUPERSEDES_UNSUPPORTED,
      file,
      fieldPath: 'amendment.relation',
      message: 'supersedes has no deterministic replacement payload in the current contract',
    })
  }
  requireTimestamp(amd.effective_at, 'amendment.effective_at', file, out)
  if (requireArray(amd.changes, 'amendment.changes', file, out, { min: 1 })) {
    amd.changes.forEach((change, i) => {
      const path = `amendment.changes[${i}]`
      if (!requireObject(change, path, file, out)) return
      for (const key of ['field_path', 'previous_value_or_hash', 'corrected_value']) requireValue(change, key, path, file, out)
    })
  }
  requireArray(amd.evidence_refs, 'amendment.evidence_refs', file, out)
}

function validateVitalFields(record, file, out) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    issue(out, { rule: RULE.STRUCTURE_INVALID, file, fieldPath: '', message: 'Record must be an object' })
    return
  }
  const requiredTop = [
    'schema_version', 'system_revision', 'record_type', 'record_id', 'session_id', 'correlation_id',
    'segment_no', 'capture_key', 'created_at', 'finalization', 'recorded_by', 'packages_loaded',
  ]
  for (const key of requiredTop) requireValue(record, key, '', file, out)

  if (record.schema_version && !KNOWN_SCHEMAS.has(record.schema_version)) {
    issue(out, { rule: RULE.SCHEMA_UNKNOWN, file, fieldPath: 'schema_version', message: 'Unknown schema_version' })
  }
  if (record.system_revision && !KNOWN_REVISIONS.has(record.system_revision)) {
    issue(out, { rule: RULE.REVISION_UNKNOWN, file, fieldPath: 'system_revision', message: 'Unknown system_revision' })
  }
  const expectedRevision = SCHEMA_REVISION_PAIRS.get(record.schema_version)
  if (expectedRevision && record.system_revision && record.system_revision !== expectedRevision) {
    issue(out, {
      rule: RULE.SCHEMA_REVISION_INCOMPATIBLE,
      file,
      fieldPath: 'schema_version+system_revision',
      message: 'schema_version and system_revision are not a compatible pair',
    })
  }
  requireEnum(record.record_type, ENUM.recordType, 'record_type', file, out)
  requireEnum(record.finalization, ENUM.finalization, 'finalization', file, out)
  requireId(record.record_id, ID_RE.record, 'record_id', file, out)
  requireId(record.session_id, ID_RE.session, 'session_id', file, out)
  requireId(record.correlation_id, ID_RE.correlation, 'correlation_id', file, out)
  if (!Number.isInteger(record.segment_no) || record.segment_no < 1) {
    issue(out, { rule: RULE.STRUCTURE_INVALID, file, fieldPath: 'segment_no', message: 'segment_no must be an integer >= 1' })
  }
  requireTimestamp(record.created_at, 'created_at', file, out)
  const expectedCapturePrefix = `${record.session_id}/${record.segment_no}/${record.record_type}/`
  const captureOrdinal = String(record.capture_key || '').slice(expectedCapturePrefix.length)
  if (!String(record.capture_key || '').startsWith(expectedCapturePrefix) || !/^[1-9]\d*$/.test(captureOrdinal)) {
    issue(out, { rule: RULE.STRUCTURE_INVALID, file, fieldPath: 'capture_key', message: 'capture_key does not match session/segment/type/ordinal' })
  }
  validateRecordedBy(record, file, out)
  validatePackages(record, file, out)

  const payloadForType = { session_event: 'event', annotation: 'annotation', amendment: 'amendment' }
  const expectedPayload = payloadForType[record.record_type]
  for (const payload of Object.values(payloadForType)) {
    if (payload !== expectedPayload && Object.hasOwn(record, payload)) {
      issue(out, {
        rule: RULE.STRUCTURE_INVALID,
        file,
        fieldPath: payload,
        message: 'Record carries a payload incompatible with record_type',
      })
    }
  }

  // Il vincolo sul placeholder senza motivo nasce con 0.1.1; la storia 0.1.0 non viene riscritta.
  if (record.schema_version !== 'mss.session/0.1.0') {
    walkStrings(record, '', (value, path) => checkNonApplicabile(value, path || 'value', file, out))
  }

  if (record.record_type === 'session_event') validateEvent(record, file, out)
  else if (record.record_type === 'annotation') validateAnnotation(record, file, out)
  else if (record.record_type === 'amendment') validateAmendment(record, file, out)
}

function validateRefs(record, file, workspaceRoot, out) {
  const lists = []
  if (record.event?.owner_refs) lists.push(['event.owner_refs', record.event.owner_refs])
  if (record.event?.source_refs) lists.push(['event.source_refs', record.event.source_refs])
  if (record.annotation?.verification?.evidence_refs) {
    // evidence_refs may be ids; skip unless object form
  }
  for (const [path, arr] of lists) {
    if (!Array.isArray(arr)) continue
    arr.forEach((ref, i) => {
      if (!ref || typeof ref !== 'object') return
      const uri = ref.uri_or_path
      const result = resolveRef(uri, {
        workspaceRoot,
        fieldPath: `${path}[${i}].uri_or_path`,
      })
      if (!result.ok) {
        issue(out, {
          rule: result.rule,
          file,
          fieldPath: result.fieldPath,
          message:
            result.rule === RULE.REF_TRAVERSAL
              ? 'Reference escapes workspace or uses unsafe path'
              : 'Reference is not resolvable',
        })
      }
    })
  }
}

function validateProductGates(record, file, out) {
  if (record.record_type !== 'annotation' || record.annotation?.axis !== 'output') return
  const assertions = record.annotation.assertions || []
  for (let i = 0; i < assertions.length; i++) {
    const a = assertions[i]
    const pc = a?.product_candidate
    if (!pc || typeof pc !== 'object' || Array.isArray(pc)) {
      issue(out, {
        rule: RULE.PRODUCT_GATE,
        file,
        fieldPath: `annotation.assertions[${i}].product_candidate`,
        message: 'Every output assertion requires product_candidate',
      })
      continue
    }
    for (const gate of PRODUCT_GATES) {
      if (!ENUM.productGate.includes(pc[gate])) {
        issue(out, {
          rule: RULE.PRODUCT_GATE,
          file,
          fieldPath: `annotation.assertions[${i}].product_candidate.${gate}`,
          message: 'product_candidate missing a canonical gate',
        })
      }
    }
    const allPass = PRODUCT_GATES.every((g) => pc[g] === 'pass')
    const anyFail = PRODUCT_GATES.some((g) => pc[g] === 'fail')
    if (!ENUM.productResult.includes(pc.result)) {
      issue(out, {
        rule: RULE.PRODUCT_GATE,
        file,
        fieldPath: `annotation.assertions[${i}].product_candidate.result`,
        message: 'product_candidate result is not canonical',
      })
    } else if (pc.result === 'eligible' && !allPass) {
      issue(out, {
        rule: RULE.PRODUCT_GATE,
        file,
        fieldPath: `annotation.assertions[${i}].product_candidate.result`,
        message: 'eligible requires five pass gates',
      })
    } else if (pc.result === 'not_eligible' && !anyFail) {
      issue(out, {
        rule: RULE.PRODUCT_GATE,
        file,
        fieldPath: `annotation.assertions[${i}].product_candidate.result`,
        message: 'not_eligible requires at least one failed gate',
      })
    }
  }
}

function actorId(value) {
  return typeof value === 'string' ? value : value?.actor_id
}

function validateVerifier(record, sessionEvent, file, out) {
  if (record.record_type !== 'annotation') return
  const v = record.annotation?.verification
  if (!v || v.status !== 'independently_verified') return
  const verifiedBy = Array.isArray(v.verified_by) ? v.verified_by : []
  const disallowed = new Set([
    record.recorded_by?.actor_id,
    record.annotation?.asserted_by?.actor_id,
    sessionEvent?.event?.subject_runtime?.actor_id,
  ].filter(Boolean))
  for (const assertion of record.annotation?.assertions || []) {
    // Il contratto definisce il soggetto della dichiarazione Persona nel campo actor.
    if (record.annotation?.axis === 'persona') disallowed.add(actorId(assertion?.actor))
  }
  const independent = verifiedBy.some((x) => {
    const id = actorId(x)
    return id && !disallowed.has(id)
  })
  if (!independent) {
    issue(out, {
      rule: RULE.VERIFIER_NOT_INDEPENDENT,
      file,
      fieldPath: 'annotation.verification.verified_by',
      message: 'independently_verified requires a distinct verifier',
    })
  }
}

function validateLockHints(record, file, out, options) {
  if (options.allowLockHints) return
  if (record.record_type !== 'session_event') return
  const auth = record.event?.authorization || {}
  const textBits = [record.event?.intent_user, record.event?.observed_outcome].filter(Boolean).map(String)
  const blob = textBits.join('\n')
  if (!LOCK_HINT_RE.test(blob)) return
  const isWriteAction = /\b(modif(?:y|ica|icare)|write|scriv(?:i|ere)|edit|touch|update|aggiorn(?:a|are)|delete|cancell(?:a|are))\b/i.test(blob)
  const isReadAction = /\b(read|leggi|leggere|review|revisiona|inspect|ispeziona|verify|verifica|audit)\b/i.test(blob)
  // Una menzione puramente lessicale non prova un'azione e resta fail-open dichiarato.
  if (!isWriteAction && !isReadAction) return
  const mentionsLock = (list) => Array.isArray(list) && list.some((x) => LOCK_HINT_RE.test(String(x)))
  const forbidden = mentionsLock(auth.forbid)
  const permitted = isWriteAction ? mentionsLock(auth.write) : mentionsLock(auth.read) || mentionsLock(auth.write)
  if (forbidden || !permitted) {
    issue(out, {
      rule: RULE.LOCK_UNAUTHORIZED,
      severity: options.lockSeverity || 'warn',
      file,
      fieldPath: forbidden ? 'event.authorization.forbid' : `event.authorization.${isWriteAction ? 'write' : 'read'}`,
      message: forbidden
        ? 'Recognizable LOCK action targets an explicitly forbidden target'
        : 'Recognizable LOCK action has no matching read/write authorization',
    })
  }
}

function fieldPathParts(fieldPath) {
  if (typeof fieldPath !== 'string' || !/^(?:event|annotation|amendment)(?:\.[A-Za-z0-9_]+|\[\d+\])+$/.test(fieldPath)) {
    return null
  }
  const parts = []
  for (const match of fieldPath.matchAll(/(?:^|\.)([A-Za-z0-9_]+)|\[(\d+)\]/g)) {
    const part = match[1] ?? Number(match[2])
    if (part === '__proto__' || part === 'prototype' || part === 'constructor') return null
    parts.push(part)
  }
  return parts
}

function applyAmendmentsView(entries, file, out, historicalById = new Map()) {
  const effective = entries.map((entry) => ({ ...entry, record: structuredClone(entry.record) }))
  const byId = new Map(effective.map((entry) => [entry.record?.record_id, entry]))
  for (const [recordId, variants] of historicalById) {
    if (byId.has(recordId) || variants.size !== 1) continue
    const historicalEntry = [...variants.values()][0]
    const record = structuredClone(historicalEntry?.record || historicalEntry)
    if (!record?.record_id) continue
    byId.set(recordId, {
      record,
      line: historicalEntry?.line || 0,
      file: historicalEntry?.file || '<history>',
    })
  }
  const amendments = effective
    .filter((entry) => entry.record?.record_type === 'amendment' && entry.record?.finalization === 'final')
    .map((entry) => ({
      entry,
      amendment: structuredClone(entry.record.amendment),
      effectiveMs: Date.parse(entry.record.amendment?.effective_at || ''),
    }))
    .sort((a, b) =>
      a.effectiveMs - b.effectiveMs ||
      String(a.entry.record.record_id || '').localeCompare(String(b.entry.record.record_id || '')),
    )

  const batches = new Map()
  for (const item of amendments) {
    const key = String(item.effectiveMs)
    const batch = batches.get(key) || []
    batch.push(item)
    batches.set(key, batch)
  }

  for (const batch of batches.values()) {
    const changesByTargetPath = new Map()
    for (const { entry, amendment } of batch) {
      if (amendment?.relation !== 'amends') continue
      const target = byId.get(amendment.target_record_id)?.record
      if (!target || target.finalization !== 'final') continue
      for (const [index, change] of (amendment.changes || []).entries()) {
        const parts = fieldPathParts(change?.field_path)
        if (!parts?.length) {
          issue(out, {
            rule: RULE.AMENDMENT_FIELD_PATH_INVALID,
            file,
            fieldPath: `amendment.changes[${index}].field_path`,
            message: 'Amendment field_path is invalid or not a contract path',
          })
          continue
        }
        const key = `${amendment.target_record_id}\u0000${change.field_path}`
        const group = changesByTargetPath.get(key) || {
          target,
          targetId: amendment.target_record_id,
          fieldPath: change.field_path,
          parts,
          candidates: [],
        }
        group.candidates.push({ entry, change, index })
        changesByTargetPath.set(key, group)
      }
    }

    for (const group of [...changesByTargetPath.values()].sort((a, b) =>
      `${a.targetId}|${a.fieldPath}`.localeCompare(`${b.targetId}|${b.fieldPath}`),
    )) {
      const intents = new Set(group.candidates.map(({ change }) => canonicalJson({
        previous: change.previous_value_or_hash,
        corrected: change.corrected_value,
      })))
      if (intents.size > 1) {
        issue(out, {
          rule: RULE.AMENDMENT_CONFLICT,
          file,
          fieldPath: `amendment.conflict:${group.targetId}:${group.fieldPath}`,
          message: 'Concurrent amendments make incompatible changes to the same target path',
        })
        continue
      }

      let parent = group.target
      for (const part of group.parts.slice(0, -1)) {
        if (parent == null || typeof parent !== 'object' || !(part in parent)) {
          parent = null
          break
        }
        parent = parent[part]
      }
      const leaf = group.parts.at(-1)
      if (parent == null || typeof parent !== 'object' || !(leaf in parent)) {
        issue(out, {
          rule: RULE.AMENDMENT_FIELD_PATH_INVALID,
          file,
          fieldPath: `amendment.field_path:${group.targetId}:${group.fieldPath}`,
          message: 'Amendment field_path does not resolve on the effective target',
        })
        continue
      }

      const { change } = group.candidates[0]
      if (canonicalJson(parent[leaf]) !== canonicalJson(change.previous_value_or_hash)) {
        issue(out, {
          rule: RULE.AMENDMENT_PREVIOUS_MISMATCH,
          file,
          fieldPath: `amendment.previous:${group.targetId}:${group.fieldPath}`,
          message: 'Amendment previous_value_or_hash does not match the effective target value',
        })
        continue
      }
      parent[leaf] = structuredClone(change.corrected_value)
    }
  }
  return effective
}

function validateReferenceLinks(entries, sessionEvent, file, workspaceRoot, out) {
  if (!sessionEvent) return
  const refs = [
    ...(Array.isArray(sessionEvent.event?.owner_refs) ? sessionEvent.event.owner_refs : []),
    ...(Array.isArray(sessionEvent.event?.source_refs) ? sessionEvent.event.source_refs : []),
  ]
  const known = new Set()
  for (const ref of refs) {
    if (!ref?.ref_id) continue
    if (known.has(ref.ref_id)) {
      issue(out, { rule: RULE.REF_ORPHAN, file, fieldPath: 'event.owner_refs+source_refs.ref_id', message: 'Reference id is not unique in the bundle' })
    }
    known.add(ref.ref_id)
  }

  function check(value, fieldPath, entryFile) {
    if (typeof value !== 'string' || isEmpty(value)) return
    if (known.has(value)) return
    const resolved = resolveRef(value, { workspaceRoot, fieldPath })
    if (resolved.ok) return
    issue(out, { rule: RULE.REF_ORPHAN, file: entryFile, fieldPath, message: 'Reference does not resolve to a declared or resolvable source/owner' })
  }

  for (const entry of entries) {
    const record = entry.record
    const entryFile = `${file}#L${entry.line}`
    if (record.record_type === 'annotation') {
      const assertions = record.annotation?.assertions || []
      assertions.forEach((assertion, index) => {
        if (record.annotation?.axis === 'persona') check(assertion?.source_ref, `annotation.assertions[${index}].source_ref`, entryFile)
        if (record.annotation?.axis === 'output') check(assertion?.owner_ref, `annotation.assertions[${index}].owner_ref`, entryFile)
      })
      for (const [index, ref] of (record.annotation?.verification?.evidence_refs || []).entries()) {
        check(ref, `annotation.verification.evidence_refs[${index}]`, entryFile)
      }
      const criterion = record.annotation?.verification?.criterion_ref
      const frozenVerifierCriterion =
        criterion === 'fixture' &&
        /docs[\\/]MetaSkillSystem[\\/]fixtures[\\/]v0\.1[\\/](?:FX-I09-verifier|FX-S13-verifier-subject)\.jsonl#L/i.test(entryFile)
      if (!frozenVerifierCriterion && !/^non_applicabile:\s*\S.+/i.test(String(criterion || ''))) {
        check(criterion, 'annotation.verification.criterion_ref', entryFile)
      }
    }
    if (record.record_type === 'amendment') {
      for (const [index, ref] of (record.amendment?.evidence_refs || []).entries()) {
        check(ref, `amendment.evidence_refs[${index}]`, entryFile)
      }
    }
    if (record.record_type === 'session_event' && Array.isArray(record.event?.controls)) {
      record.event.controls.forEach((control, controlIndex) => {
        for (const [refIndex, ref] of (control?.evidence_refs || []).entries()) {
          check(ref, `event.controls[${controlIndex}].evidence_refs[${refIndex}]`, entryFile)
        }
      })
    }
  }
}

function validateBundleRecords(entries, file, workspaceRoot, out, options) {
  const byId = new Map()
  const byCapture = new Map()
  const logicalEntries = []
  const historicalById = new Map()

  for (const historicalEntry of options.historicalRecords || []) {
    const record = historicalEntry?.record || historicalEntry
    if (!record?.record_id) continue
    const canonical = canonicalJson(record)
    const variants = historicalById.get(record.record_id) || new Map()
    if (!variants.has(canonical)) variants.set(canonical, historicalEntry)
    historicalById.set(record.record_id, variants)
  }

  for (const entry of entries) {
    const { record, line } = entry
    const loc = `${file}#L${line}`
    let identicalRetry = false
    let identityConflict = false

    if (record.record_id) {
      const prevId = byId.get(record.record_id)
      if (prevId) {
        if (recordCanonical(prevId) !== recordCanonical(entry)) {
          identityConflict = true
          issue(out, {
            rule: RULE.RECORD_ID_COLLISION,
            file: loc,
            fieldPath: 'record_id',
            message: 'Duplicate record_id with different content',
          })
        } else identicalRetry = true
      } else {
        byId.set(record.record_id, entry)
      }
    }

    if (record.capture_key) {
      const prev = byCapture.get(record.capture_key)
      if (prev) {
        if (recordCanonical(prev) !== recordCanonical(entry)) {
          identityConflict = true
          issue(out, {
            rule: RULE.CAPTURE_KEY_COLLISION,
            file: loc,
            fieldPath: 'capture_key',
            message: 'capture_key reused with different content',
          })
        } else identicalRetry = true
      } else {
        byCapture.set(record.capture_key, entry)
      }
    }
    // Il retry divergente è già respinto dall'identità: non aggiunge rumore semantico
    // proveniente dalla variante che il contratto vieta di considerare un record.
    if (!identityConflict) {
      validateVitalFields(record, loc, out)
      validateRefs(record, loc, workspaceRoot, out)
      validateProductGates(record, loc, out)
      validateLockHints(record, loc, out, options)
    }
    if (!identicalRetry) logicalEntries.push(entry)
  }

  const sessionEvents = logicalEntries.filter((entry) => entry.record.record_type === 'session_event')
  if (sessionEvents.length !== 1) {
    issue(out, {
      rule: RULE.SESSION_EVENT_COUNT,
      file,
      fieldPath: 'record_type:session_event',
      message: 'A bundle must contain exactly one canonical session_event',
    })
  }
  const sessionEvent = sessionEvents[0]?.record || null

  const effectiveEntries = applyAmendmentsView(logicalEntries, file, out, historicalById)
  const effectiveSessionEvent = effectiveEntries.find((entry) => entry.record.record_type === 'session_event')?.record || sessionEvent
  validateReferenceLinks(effectiveEntries, effectiveSessionEvent, file, workspaceRoot, out)

  for (const entry of logicalEntries) {
    validateVerifier(entry.record, sessionEvent, `${file}#L${entry.line}`, out)
  }

  // Correlazione, sessione e segmento sono proprietà del singolo bundle fisico.
  if (sessionEvent) {
    for (const entry of logicalEntries) {
      const r = entry.record
      if (r.session_id && r.session_id !== sessionEvent.session_id) {
        issue(out, {
          rule: RULE.SESSION_MISMATCH,
          file: `${file}#L${entry.line}`,
          fieldPath: 'session_id',
          message: 'session_id mismatch within bundle',
        })
      }
      if (r.correlation_id && sessionEvent.correlation_id && r.correlation_id !== sessionEvent.correlation_id) {
        issue(out, {
          rule: RULE.CORRELATION_MISMATCH,
          file: `${file}#L${entry.line}`,
          fieldPath: 'correlation_id',
          message: 'correlation_id mismatch within bundle',
        })
      }
      if (Number.isInteger(r.segment_no) && r.segment_no !== sessionEvent.segment_no) {
        issue(out, {
          rule: RULE.SESSION_MISMATCH,
          file: `${file}#L${entry.line}`,
          fieldPath: 'segment_no',
          message: 'segment_no mismatch within bundle',
        })
      }
    }
  }

  for (const entry of logicalEntries) {
    if (entry.record.record_type === 'annotation') {
      const subjects = entry.record.annotation?.subject_record_ids || []
      if (subjects.length === 0) {
        issue(out, {
          rule: RULE.ANNOTATION_ORPHAN,
          file: `${file}#L${entry.line}`,
          fieldPath: 'annotation.subject_record_ids',
          message: 'Annotation missing subject_record_ids',
        })
      } else if (!sessionEvent || !subjects.includes(sessionEvent.record_id)) {
        issue(out, {
          rule: RULE.ANNOTATION_ORPHAN,
          file: `${file}#L${entry.line}`,
          fieldPath: 'annotation.subject_record_ids',
          message: 'Annotation must refer to the canonical session_event',
        })
      } else {
        for (const subject of subjects) {
          if (!byId.has(subject)) {
            issue(out, {
              rule: RULE.ANNOTATION_ORPHAN,
              file: `${file}#L${entry.line}`,
              fieldPath: 'annotation.subject_record_ids',
              message: 'Annotation subject_record_id not found in bundle',
            })
          }
        }
      }
    }
    if (entry.record.record_type === 'amendment') {
      const target = entry.record.amendment?.target_record_id
      const historicalVariants = target ? historicalById.get(target) : null
      if (!target || (!byId.has(target) && !historicalVariants)) {
        issue(out, {
          rule: RULE.AMENDMENT_ORPHAN,
          file: `${file}#L${entry.line}`,
          fieldPath: 'amendment.target_record_id',
          message: 'Amendment target_record_id not found',
        })
      } else if (!byId.has(target) && historicalVariants.size > 1) {
        issue(out, {
          rule: RULE.AMENDMENT_TARGET_AMBIGUOUS,
          file: `${file}#L${entry.line}`,
          fieldPath: 'amendment.target_record_id',
          message: 'Historical amendment target is ambiguous',
        })
      } else if (byId.has(target)) {
        const targetRecord = byId.get(target)?.record
        if (entry.record.finalization === 'final' && targetRecord?.finalization !== 'final') {
          issue(out, {
            rule: RULE.AMENDMENT_TARGET_NOT_FINAL,
            file: `${file}#L${entry.line}`,
            fieldPath: 'amendment.target_record_id',
            message: 'Final amendment target is not finalized',
          })
        }
      } else {
        const targetEntry = [...historicalVariants.values()][0]
        const targetRecord = targetEntry?.record || targetEntry
        if (targetRecord?.finalization !== 'final') {
          issue(out, {
            rule: RULE.AMENDMENT_TARGET_NOT_FINAL,
            file: `${file}#L${entry.line}`,
            fieldPath: 'amendment.target_record_id',
            message: 'Historical amendment target is not finalized',
          })
        }
      }
    }
  }

  // amendment cycles
  const adj = new Map()
  const cycleEntries = [
    ...logicalEntries,
    ...[...historicalById.values()].flatMap((variants) => [...variants.values()]),
  ]
  for (const entry of cycleEntries) {
    const record = entry?.record || entry
    if (record?.record_type !== 'amendment') continue
    const from = record.record_id
    const to = record.amendment?.target_record_id
    if (!from || !to) continue
    if (!adj.has(from)) adj.set(from, [])
    adj.get(from).push(to)
  }
  const visiting = new Set()
  const visited = new Set()
  function dfs(node) {
    if (visiting.has(node)) return true
    if (visited.has(node)) return false
    visiting.add(node)
    for (const n of adj.get(node) || []) {
      if (dfs(n)) return true
    }
    visiting.delete(node)
    visited.add(node)
    return false
  }
  for (const node of adj.keys()) {
    if (dfs(node)) {
      issue(out, {
        rule: RULE.AMENDMENT_CYCLE,
        file,
        fieldPath: 'amendment',
        message: 'Amendment chain contains a cycle',
      })
      break
    }
  }

  if (sessionEvent?.finalization === 'final' || options.requireFinalAxes) {
    for (const entry of logicalEntries) {
      if (entry.record.record_type === 'annotation' && entry.record.finalization !== 'final') {
        issue(out, {
          rule: RULE.FINALIZATION_MISMATCH,
          file: `${file}#L${entry.line}`,
          fieldPath: 'finalization',
          message: 'Draft annotation cannot be part of a finalized closure bundle',
        })
      }
    }
    for (const axis of AXES) {
      const axisAnnotations = logicalEntries.filter(
        (entry) =>
          entry.record.record_type === 'annotation' &&
          entry.record.annotation?.axis === axis &&
          entry.record.annotation?.subject_record_ids?.includes(sessionEvent?.record_id),
      )
      const hasFinal = axisAnnotations.some((entry) => entry.record.finalization === 'final')
      if (!hasFinal) {
        issue(out, {
          rule: axisAnnotations.length ? RULE.FINAL_AXIS_NOT_FINAL : RULE.FINAL_AXIS_MISSING,
          file,
          fieldPath: `annotation.axis:${axis}`,
          message: axisAnnotations.length
            ? 'Final bundle axis is represented only by draft annotations'
            : 'Final bundle missing required axis annotation',
        })
      }
    }
  } else if (sessionEvent?.finalization === 'draft') {
    for (const entry of logicalEntries) {
      if (entry.record.record_type !== 'session_event' && entry.record.finalization === 'final') {
        issue(out, {
          rule: RULE.FINALIZATION_MISMATCH,
          file: `${file}#L${entry.line}`,
          fieldPath: 'finalization',
          message: 'Final child record cannot close a draft session_event bundle',
        })
      }
    }
  }

  if (options.rejectDraftAsClose && sessionEvent?.finalization === 'draft') {
    // only when caller marks the input as a closure attempt
    issue(out, {
      rule: RULE.DRAFT_AS_FINAL,
      file,
      fieldPath: 'finalization',
      message: 'Draft bundle presented as valid closure',
    })
  }
}

function resultFromDiagnostics(diagnostics, bundles = 0) {
  diagnostics.sort((a, b) => {
    const ka = `${a.rule}|${a.file}|${a.fieldPath}|${a.severity}`
    const kb = `${b.rule}|${b.file}|${b.fieldPath}|${b.severity}`
    return ka.localeCompare(kb)
  })
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

function normalizeNewlines(value) {
  return String(value).replace(/\r\n?/g, '\n')
}

function canonicalJsonlText(value) {
  const parsed = parseJsonlText(normalizeNewlines(value), { file: '<comparison>', allowEmpty: true })
  if (parsed.diagnostics.length) return null
  return parsed.records.map((entry) => canonicalJson(entry.record)).join('\n')
}

function semanticSnapshot(value, kind) {
  const text = normalizeNewlines(decodeUtf8(value))
  if (kind === 'jsonl' || kind === 'bundle') return canonicalJsonlText(text) ?? text
  if (kind === 'report') {
    return text.replace(/```jsonl\s*\n([\s\S]*?)```/gi, (whole, body) => {
      const canonical = canonicalJsonlText(body)
      return canonical == null ? whole : `\`\`\`jsonl\n${canonical}\n\`\`\``
    })
  }
  return text
}

/** Confronto puro fra record estratti da HEAD e record presenti nello snapshot staged. */
export function validateAppendOnlyRecords({ headEntries = [], stagedEntries = [] } = {}) {
  const diagnostics = []
  const stagedById = new Map()
  for (const entry of stagedEntries) {
    const record = entry?.record || entry
    if (!record?.record_id) continue
    const variants = stagedById.get(record.record_id) || new Set()
    variants.add(canonicalJson(record))
    stagedById.set(record.record_id, variants)
  }

  for (const entry of headEntries) {
    const record = entry?.record || entry
    if (!record?.record_id || record.finalization !== 'final') continue
    const stagedVariants = stagedById.get(record.record_id)
    const sourceFile = entry?.file || '<HEAD>'
    if (!stagedVariants?.size) {
      issue(diagnostics, {
        rule: RULE.FINAL_RECORD_REMOVED,
        file: sourceFile,
        fieldPath: `record_id:${record.record_id}`,
        message: 'Finalized HEAD record is absent from staged state',
      })
    } else if (!stagedVariants.has(canonicalJson(record))) {
      issue(diagnostics, {
        rule: RULE.FINAL_RECORD_MODIFIED,
        file: sourceFile,
        fieldPath: `record_id:${record.record_id}`,
        message: 'Finalized HEAD record changed canonical content',
      })
    }
  }
  return resultFromDiagnostics(diagnostics)
}

/** Subcore puro sulla vista effettiva completa dei record già estratti. */
export function validateGlobalRecordView(entries = []) {
  const diagnostics = []
  const byRecordId = new Map()
  const byCaptureKey = new Map()
  const logical = []

  const location = (entry) => String(entry?.file || '<global>').replace(/\\/g, '/')
  const inspectIdentity = (map, key, entry, collisionRule, fieldPath) => {
    if (!key) return
    const canonical = canonicalJson(entry.record)
    const prior = map.get(key)
    if (!prior) {
      map.set(key, { canonical, entry })
      return
    }
    const currentFile = location(entry)
    const priorFile = location(prior.entry)
    if (prior.canonical !== canonical) {
      issue(diagnostics, {
        rule: collisionRule,
        file: currentFile,
        fieldPath,
        message: 'Global record identity has divergent content',
      })
    } else if (priorFile !== currentFile) {
      issue(diagnostics, {
        rule: RULE.CROSS_FILE_DUPLICATE,
        file: currentFile,
        fieldPath,
        message: 'Identical retries are limited to the same physical artifact',
      })
    }
  }

  for (const raw of entries) {
    const entry = raw?.record ? raw : { record: raw, file: '<global>', line: 1 }
    if (!entry.record || typeof entry.record !== 'object') continue
    inspectIdentity(byRecordId, entry.record.record_id, entry, RULE.RECORD_ID_COLLISION, 'record_id')
    inspectIdentity(byCaptureKey, entry.record.capture_key, entry, RULE.CAPTURE_KEY_COLLISION, 'capture_key')
    logical.push(entry)
  }

  const variantsById = new Map()
  for (const entry of logical) {
    const id = entry.record?.record_id
    if (!id) continue
    const variants = variantsById.get(id) || new Map()
    const canonical = canonicalJson(entry.record)
    if (!variants.has(canonical)) variants.set(canonical, entry)
    variantsById.set(id, variants)
  }

  for (const entry of logical) {
    const record = entry.record
    if (record?.record_type !== 'amendment' || record.finalization !== 'final') continue
    const targetId = record.amendment?.target_record_id
    const variants = variantsById.get(targetId)
    if (!variants?.size) {
      issue(diagnostics, {
        rule: RULE.AMENDMENT_ORPHAN,
        file: location(entry),
        fieldPath: 'amendment.target_record_id',
        message: 'Final amendment target is absent from the global view',
      })
    } else if (variants.size > 1) {
      issue(diagnostics, {
        rule: RULE.AMENDMENT_TARGET_AMBIGUOUS,
        file: location(entry),
        fieldPath: 'amendment.target_record_id',
        message: 'Final amendment target has divergent global variants',
      })
    } else {
      const target = [...variants.values()][0].record
      if (target.finalization !== 'final') {
        issue(diagnostics, {
          rule: RULE.AMENDMENT_TARGET_NOT_FINAL,
          file: location(entry),
          fieldPath: 'amendment.target_record_id',
          message: 'Final amendment target is not finalized',
        })
      }
    }
  }

  const adjacency = new Map()
  for (const entry of logical) {
    const record = entry.record
    if (record?.record_type !== 'amendment' || !record.record_id || !record.amendment?.target_record_id) continue
    const targets = adjacency.get(record.record_id) || []
    targets.push(record.amendment.target_record_id)
    adjacency.set(record.record_id, targets)
  }
  const visiting = new Set()
  const visited = new Set()
  const visit = (id) => {
    if (visiting.has(id)) return true
    if (visited.has(id)) return false
    visiting.add(id)
    for (const target of adjacency.get(id) || []) if (visit(target)) return true
    visiting.delete(id)
    visited.add(id)
    return false
  }
  for (const id of adjacency.keys()) {
    if (!visit(id)) continue
    issue(diagnostics, {
      rule: RULE.AMENDMENT_CYCLE,
      file: '<global>',
      fieldPath: 'amendment',
      message: 'Global amendment chain contains a cycle',
    })
    break
  }

  return resultFromDiagnostics(diagnostics)
}

/**
 * Orchestratore deterministico: delega parsing e risoluzione riferimenti ai moduli di confine.
 * I subcore append-only/global-view sopra restano puri; i path filesystem possono richiedere I/O.
 * @param {object} input
 * @param {object} [options]
 */
export function validateMss(input, options = {}) {
  const workspaceRoot = options.workspaceRoot || process.cwd()
  const diagnostics = []

  if (input.stagedContent != null && input.worktreeContent != null) {
    let differs = false
    try {
      differs = semanticSnapshot(input.stagedContent, input.kind) !== semanticSnapshot(input.worktreeContent, input.kind)
    } catch {
      issue(diagnostics, {
        rule: RULE.UTF8_INVALID,
        file: input.file || '<staged>',
        fieldPath: 'staged_vs_worktree.bytes',
        message: 'Staged or worktree content is not valid UTF-8',
      })
    }
    if (differs) {
      issue(diagnostics, {
        rule: RULE.STAGED_WORKTREE_MISMATCH,
        file: input.file || '<staged>',
        fieldPath: 'staged_vs_worktree',
        message: 'Staged content differs from worktree content',
      })
    }
  }

  const collected = collectBundlesFromInput(input)
  diagnostics.push(...collected.diagnostics)

  for (const bundle of collected.bundles) {
    const file = bundle.path || input.file || '<bundle>'
    if (bundle.records?.length) {
      validateBundleRecords(bundle.records, file, workspaceRoot, diagnostics, options)
    }
  }

  return resultFromDiagnostics(diagnostics, collected.bundles.length)
}

export function formatHuman(result) {
  if (result.ok && result.diagnostics.length === 0) {
    return 'validate:mss OK'
  }
  const lines = [
    `validate:mss ${result.ok ? 'OK_WITH_WARNINGS' : 'FAIL'} (deny=${result.summary.deny} warn=${result.summary.warn})`,
  ]
  for (const d of result.diagnostics) {
    lines.push(`[${d.severity}] ${d.rule} @ ${d.file} :: ${d.fieldPath} — ${d.message}`)
  }
  return lines.join('\n')
}
