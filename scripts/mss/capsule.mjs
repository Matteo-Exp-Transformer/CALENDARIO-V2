#!/usr/bin/env node
/**
 * mss:capsule — genera il blocco JSONL della capsula MetaSkillSystem.
 *
 * Livello 1 (macchina): UUIDv7, timestamp, schema, git, controls eseguiti.
 * Livello 2 (macchina + flag): agent_runtime da env whitelisted; modello obbligatorio via --model.
 * Livello 3 (agente): giudizi in --judgments file.json; tre assi obbligatori.
 *
 * Non modifica report esistenti salvo --append-to esplicito.
 */

import { spawnSync, execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { REPORT_PATH_RE } from './adapter.mjs'
import {
  ENUM,
  REVISION_CURRENT,
  REVISION_LEGACY,
  SCHEMA_CURRENT,
  SCHEMA_LEGACY,
} from './rules.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'
import { newMssIds } from './uuid.mjs'

const ROOT = repoRootFromModule(import.meta.url)
const SEGMENT_NO = 1
const TOOLS_DEFAULT = ['non_applicabile: non dichiarato dall\'agente a fine seduta']
const PACKAGE_DEFAULT = [{
  package_id: 'non_applicabile: non dichiarato dall\'agente a fine seduta',
  package_version_or_revision: 'non_applicabile: non dichiarato dall\'agente a fine seduta',
  source_ref: 'non_applicabile: non dichiarato dall\'agente a fine seduta',
}]

const PLACEHOLDER_RE = /^(?:\s*|TODO|TBD|\.\.\.|___+|n\/?a)$/i

/** Variabili lette per nome — mai Object.keys(process.env). */
const ENV_RUNTIME_KEYS = [
  'AI_AGENT',
  'CLAUDECODE',
  'CLAUDE_CODE_ENTRYPOINT',
  'CURSOR_AGENT',
  'CURSOR_TRACE_ID',
  'TERM_PROGRAM',
]

const SECRET_MARKERS = [
  'MESSAGING_TOKEN',
  'API_KEY',
  'SECRET',
  'PASSWORD',
  'PRIVATE_KEY',
]

export function formatTimestamp(date = new Date()) {
  const pad = (n, w = 2) => String(n).padStart(w, '0')
  const offsetMin = -date.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMin)
  const hh = pad(Math.floor(abs / 60))
  const mm = pad(abs % 60)
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${hh}:${mm}`
  )
}

export function readWhitelistedEnv(env = process.env) {
  const out = {}
  for (const key of ENV_RUNTIME_KEYS) {
    if (env[key] !== undefined) out[key] = env[key]
  }
  return out
}

export function detectAgentRuntime(env = process.env, model) {
  if (!model || PLACEHOLDER_RE.test(model)) {
    return null
  }
  const entry = String(env.CLAUDE_CODE_ENTRYPOINT || '')
  const isCursor =
    env.CURSOR_AGENT ||
    env.CURSOR_TRACE_ID ||
    String(env.TERM_PROGRAM || '').toLowerCase() === 'cursor'
  if (isCursor) {
    return {
      provider: 'Cursor',
      model,
      runtime: 'Cursor Agent',
      surface: env.CURSOR_AGENT ? String(env.CURSOR_AGENT) : 'IDE',
    }
  }
  if (env.CLAUDECODE || entry) {
    let surface = 'CLI'
    if (/vscode/i.test(entry)) surface = 'VSCode extension'
    else if (/cli/i.test(entry)) surface = 'CLI'
    return {
      provider: 'Anthropic',
      model,
      runtime: 'Claude Code',
      surface,
    }
  }
  if (env.AI_AGENT) {
    return {
      provider: 'non_applicabile: provider non dedotto oltre AI_AGENT',
      model,
      runtime: String(env.AI_AGENT),
      surface: 'non_applicabile: superficie non dedotta',
    }
  }
  return {
    provider: 'non_applicabile: runtime non riconosciuto dalle variabili whitelisted',
    model,
    runtime: 'non_applicabile: runtime non riconosciuto',
    surface: 'non_applicabile: superficie non riconosciuta',
  }
}

/**
 * Solo la coda viene tagliata, mai la testa: `git status --porcelain` ha un prefisso di
 * larghezza fissa e la prima riga comincia con uno spazio quando il file è modificato ma
 * non in stage (` M path`). Un `.trim()` sull'intero output mangiava quello spazio e
 * `slice(3)` si portava via il primo carattere del path — un `.claude/…` diventava
 * `claude/…`, riferimento irrisolvibile che faceva rifiutare l'intera capsula.
 */
function git(args, root) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .replace(/\s+$/, '')
  } catch {
    return null
  }
}

export function collectGitContext(root = ROOT) {
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], root)
  const head = git(['rev-parse', 'HEAD'], root)
  const headShort = git(['rev-parse', '--short', 'HEAD'], root)
  const porcelain = git(['status', '--porcelain', '-uall'], root) || ''
  const changed = new Set()
  for (const line of porcelain.split('\n').filter(Boolean)) {
    const path = line.slice(3).trim().replace(/^".*"$/, (m) => m.slice(1, -1))
    if (path.includes(' -> ')) changed.add(path.split(' -> ').pop())
    else changed.add(path)
  }
  for (const cmd of [['diff', '--name-only'], ['diff', '--cached', '--name-only']]) {
    const out = git(cmd, root)
    if (out) out.split('\n').filter(Boolean).forEach((p) => changed.add(p))
  }
  return {
    branch: branch || 'non_osservato',
    head: head || 'non_osservato',
    headShort: headShort || 'non_osservato',
    changedFiles: [...changed].sort(),
  }
}

/**
 * Path presente nell'index Git (HEAD o già `git add`): pubblicabile dopo commit selettivo.
 * Gli untracked `??` falliscono qui — esistono sul disco ma non nel repository pubblicato.
 */
export function isGitIndexedPath(uri, root = ROOT) {
  const listed = git(['ls-files', '--error-unmatch', '--', uri], root)
  return listed !== null
}

/**
 * I file cancellati sono cambiamenti veri ma NON riferimenti risolvibili: emetterli
 * produce `MSS-REF-UNRESOLVABLE` e fa rifiutare la capsula. La cancellazione resta
 * comunque leggibile nel diff / in `changedFiles`, quindi qui si esclude senza perdere
 * informazione diagnostica.
 *
 * Gli untracked `??` restano in `collectGitContext().changedFiles` per diagnostica, ma
 * non diventano `source_refs`: non sono riproducibili finché non entrano in index/HEAD.
 */
export function buildSourceRefsFromGit(changedFiles, headShort, { root = ROOT } = {}) {
  return changedFiles
    .filter((uri) => existsSync(resolve(root, uri)) && isGitIndexedPath(uri, root))
    .map((uri, index) => ({
      ref_id: `source-git-${index + 1}`,
      owner_id: 'git-working-tree',
      uri_or_path: uri.replace(/\\/g, '/'),
      stable_anchor_or_event_id: 'working tree',
      revision_or_hash: headShort === 'non_osservato' ? 'non_osservato' : headShort,
      sensitivity: 'internal',
    }))
}

const CHECK_CANONICAL_SEP = '=>'

/** Errore di parsing --check: messaggio pulito, nessuno stack trace in CLI. */
export class ParseCheckSpecError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParseCheckSpecError'
  }
}

function assertNonEmptyCommand(command, raw) {
  if (!command || !/\S/.test(command)) {
    throw new ParseCheckSpecError(
      `Formato --check invalido "${raw}": il comando deve contenere almeno un carattere non whitespace`,
    )
  }
}

/**
 * Canonico: CONTROL_ID=>comando — si divide solo sul primo `=>`;
 * l'ID può contenere `:`; il comando può contenere ulteriori `=>` (es. arrow function).
 * Legacy: CONTROL_ID:comando solo con esattamente un `:` e entrambi i lati non vuoti.
 * Più `:` senza `=>` → ambiguo, rifiutato esplicitamente.
 */
export function parseCheckSpec(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new ParseCheckSpecError('Formato --check invalido: stringa vuota')
  }

  const arrowIdx = raw.indexOf(CHECK_CANONICAL_SEP)
  if (arrowIdx !== -1) {
    const control_id = raw.slice(0, arrowIdx).trim()
    const command = raw.slice(arrowIdx + CHECK_CANONICAL_SEP.length).trim()
    if (!control_id) {
      throw new ParseCheckSpecError(
        `Formato --check invalido "${raw}": CONTROL_ID mancante prima di "=>"`,
      )
    }
    assertNonEmptyCommand(command, raw)
    return { control_id, command }
  }

  const colonCount = (raw.match(/:/g) || []).length
  if (colonCount === 1) {
    const idx = raw.indexOf(':')
    const control_id = raw.slice(0, idx).trim()
    const command = raw.slice(idx + 1).trim()
    if (!control_id) {
      throw new ParseCheckSpecError(`Formato --check invalido "${raw}": CONTROL_ID mancante`)
    }
    assertNonEmptyCommand(command, raw)
    return { control_id, command }
  }

  if (colonCount > 1) {
    throw new ParseCheckSpecError(
      `Formato --check ambiguo "${raw}": più ":" senza "=>". ` +
      'Usa la forma canonica "CONTROL_ID=>comando" (es. "test:mss=>npm run test:mss")',
    )
  }

  throw new ParseCheckSpecError(
    `Formato --check invalido "${raw}": atteso "CONTROL_ID=>comando" o legacy "CONTROL_ID:comando" con un solo ":"`,
  )
}

/**
 * Un solo ramo, la shell — e non è una semplificazione, è la correzione di due prove false.
 * Con `spawnSync('npm.cmd', args)` senza `shell: true` Node >= 20.12 esce `EINVAL`
 * (mitigazione CVE-2024-27980): `status` torna `null` e ogni `npm run …` che passava
 * finiva in capsula come `fail`. Lo split sugli spazi, in più, perdeva le virgolette,
 * quindi il comando eseguito non era quello scritto nel criterio.
 */
export function spawnCheckCommand(command, cwd) {
  return spawnSync(command.trim(), {
    shell: true,
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

export function runChecks(checkSpecs, { cwd = ROOT, executor = 'mss:capsule' } = {}) {
  return checkSpecs.map(({ control_id, command }) => {
    const trimmed = (command ?? '').trim()
    if (!trimmed || !/\S/.test(trimmed)) {
      return {
        control_id,
        criterio: command ?? '',
        esito: 'non_noto',
        numeratore: 0,
        denominatore: 1,
        esecutore: `${executor}: comando vuoto o non valido — non eseguito`,
        evidence_refs: [],
      }
    }
    const result = spawnCheckCommand(trimmed, cwd)
    // Un comando che non è partito NON è un comando fallito: registrarlo `fail`
    // sarebbe una prova falsa. Il contratto ha `non_noto` proprio per questo.
    if (result.error || result.status === null) {
      const why = result.error ? (result.error.code || result.error.message) : 'nessun codice di uscita'
      return {
        control_id,
        criterio: command,
        esito: 'non_noto',
        numeratore: 0,
        denominatore: 1,
        esecutore: `${executor}: ${command} (non eseguito — ${why})`,
        evidence_refs: [],
      }
    }
    const code = result.status
    const pass = code === 0
    return {
      control_id,
      criterio: command,
      esito: pass ? 'pass' : 'fail',
      numeratore: pass ? 1 : 0,
      denominatore: 1,
      esecutore: `${executor}: ${command} (exit ${code})`,
      evidence_refs: [],
    }
  })
}

function parsePackageSpec(raw) {
  const parts = raw.split('|').map((p) => p.trim())
  if (parts.length !== 3 || parts.some((p) => !p)) {
    throw new Error(`Formato --package invalido "${raw}": atteso "package_id|version|source_ref"`)
  }
  return { package_id: parts[0], package_version_or_revision: parts[1], source_ref: parts[2] }
}

export function buildJudgmentsTemplate() {
  return {
    _guida: 'Compila session_event e le tre annotazioni (persona, sistema, output). Valori enum in _enums.',
    _enums: {
      session_type: ENUM.sessionType,
      capsule_status: ENUM.capsuleStatus,
      event_kind: ENUM.eventKind,
      axis: ENUM.axis,
      assertion_basis: ENUM.assertionBasis,
      verification_status: ENUM.verificationStatus,
      persona_assistance: ENUM.personaAssistance,
      persona_origin: ENUM.personaOrigin,
      evidence_state: ENUM.evidenceState,
      output_primary_type: ENUM.outputPrimaryType,
      control_outcome: ENUM.controlOutcome,
    },
    session_event: {
      intent_user: '',
      event_kind: 'session_close',
      session_type: 'deep',
      capsule_status: 'completa',
      role_key: '',
      area: '',
      environment: '',
      authorization: { read: [], write: [], forbid: [] },
      authorized_outputs: [],
      route: { chosen: '', alternatives_or_conflicts: 'nessuno' },
      observed_outcome: '',
      open_items: 'nessuno',
      subject_runtime: {
        actor_id: 'non_applicabile: soggetto non applicabile in questa seduta',
        provider: 'non_applicabile: soggetto non applicabile',
        model: 'non_applicabile: soggetto non applicabile',
        runtime: 'non_applicabile: soggetto non applicabile',
        surface: 'non_applicabile: soggetto non applicabile',
      },
      privacy: {
        classification: 'internal',
        capture_basis: 'operational_need',
        allowed_content: [],
        prohibited_content: ['dati personali', 'segreti', 'materiale privato non registrabile'],
        redactions: 'nessuno',
        external_release: 'requires_confirmation',
        retention: 'undecided_wp0.1',
        rectification_route: 'amendment',
      },
      owner_refs: [],
      source_refs: [],
    },
    annotations: {
      persona: {
        delta: 'nessuno',
        assertions: [{
          signal: '',
          actor: '',
          assistance: 'spontaneo',
          origin: 'naturale',
          source_ref: '',
          effect: '',
          evidence_state: 'observed',
        }],
        asserted_by: { actor_id: '', role: '', basis: 'direct_observation' },
        verification: {
          status: 'unverified',
          verified_by: [],
          verified_at: 'non_applicabile:nessuna valutazione Persona',
          criterion_ref: 'non_applicabile:non ancora verificato',
          evidence_refs: [],
          notes: '',
        },
      },
      sistema: {
        delta: 'creato',
        assertions: [{
          rule_id_version: '',
          trigger_event: '',
          decision_or_output_changed: '',
          G: 0,
          O: 0,
          E: 0,
        }],
        asserted_by: { actor_id: '', role: '', basis: 'direct_observation' },
        verification: {
          status: 'self_report',
          verified_by: [],
          verified_at: 'non_applicabile:self_report',
          criterion_ref: 'non_applicabile:self_report',
          evidence_refs: [],
          notes: '',
        },
      },
      output: {
        delta: 'creato',
        assertions: [{
          output_id: '',
          primary_type: 'prodotto',
          canonical_version: '',
          recipient: '',
          problem_or_job: '',
          intended_use: '',
          conceived_by: '',
          decided_by: '',
          directed_by: '',
          authored_by: '',
          verified_by: 'non_osservato',
          acceptance_criterion: '',
          verification_or_use_evidence: '',
          verification_status: 'unverified',
          owner_ref: '',
          privacy_release: 'internal',
          support_files: [],
          relations_no_double_count: [],
          product_candidate: {
            recipient: 'pass',
            problem_or_job: 'pass',
            canonical_version: 'pass',
            fixed_acceptance_criterion: 'pass',
            verification_or_use_evidence: 'fail',
            result: 'not_eligible',
          },
        }],
        asserted_by: { actor_id: '', role: '', basis: 'direct_observation' },
        verification: {
          status: 'self_report',
          verified_by: [],
          verified_at: 'non_applicabile:self_report',
          criterion_ref: 'non_applicabile:self_report',
          evidence_refs: [],
          notes: '',
        },
      },
    },
  }
}

function isFilled(value) {
  if (value === undefined || value === null || value === '') return false
  if (typeof value === 'string' && PLACEHOLDER_RE.test(value.trim())) return false
  return true
}

export function validateJudgments(judgments) {
  const errors = []
  if (!judgments || typeof judgments !== 'object') {
    return ['File giudizi: JSON non valido o vuoto']
  }
  const ev = judgments.session_event
  if (!ev || typeof ev !== 'object') {
    errors.push('Manca session_event nel file giudizi')
  } else {
    for (const key of ['intent_user', 'role_key', 'area', 'environment', 'observed_outcome']) {
      if (!isFilled(ev[key])) errors.push(`session_event.${key} mancante o placeholder`)
    }
    if (!ev.route || !isFilled(ev.route.chosen)) {
      errors.push('session_event.route.chosen mancante o placeholder')
    }
    if (!ev.authorization || !Array.isArray(ev.authorization.read) || !Array.isArray(ev.authorization.write)) {
      errors.push('session_event.authorization incompleta')
    }
  }
  const axes = judgments.annotations
  if (!axes || typeof axes !== 'object') {
    errors.push('Manca annotations nel file giudizi')
  } else {
    for (const axis of ['persona', 'sistema', 'output']) {
      const ann = axes[axis]
      if (!ann) {
        errors.push(`annotations.${axis} mancante — tutti e tre gli assi sono obbligatori`)
        continue
      }
      if (!isFilled(ann.delta)) errors.push(`annotations.${axis}.delta mancante`)
      if (!Array.isArray(ann.assertions) || ann.assertions.length === 0) {
        errors.push(`annotations.${axis}.assertions deve contenere almeno un elemento`)
      }
      if (!ann.asserted_by || !isFilled(ann.asserted_by.actor_id)) {
        errors.push(`annotations.${axis}.asserted_by.actor_id mancante`)
      }
      if (!ann.verification || !isFilled(ann.verification.status)) {
        errors.push(`annotations.${axis}.verification.status mancante`)
      }
    }
  }
  return errors
}

function captureKey(sessionId, recordType, ordinal) {
  return `${sessionId}/${SEGMENT_NO}/${recordType}/${ordinal}`
}

function sharedTop(ids, timestamp, recordedBy, packagesLoaded) {
  return {
    schema_version: SCHEMA_CURRENT,
    system_revision: REVISION_CURRENT,
    session_id: ids.session_id,
    correlation_id: ids.correlation_id,
    segment_no: SEGMENT_NO,
    created_at: timestamp,
    finalization: 'final',
    recorded_by: recordedBy,
    packages_loaded: packagesLoaded,
  }
}

export function buildCapsuleBundle({
  judgments,
  model,
  role = 'agente esecutore',
  actorId,
  tools = TOOLS_DEFAULT,
  packages = PACKAGE_DEFAULT,
  checks = [],
  now = new Date(),
  timestamp: timestampOverride,
  ids: idOverrides,
  entropy,
  root = ROOT,
  env = process.env,
  gitContext = collectGitContext(root),
} = {}) {
  if (SCHEMA_CURRENT === SCHEMA_LEGACY || REVISION_CURRENT === REVISION_LEGACY) {
    throw new Error('Rifiutato: coppia legacy disattiva le prove — leggere da rules.mjs')
  }

  const judgmentErrors = validateJudgments(judgments)
  if (judgmentErrors.length) {
    const err = new Error(judgmentErrors.join('; '))
    err.code = 'JUDGMENTS_INVALID'
    err.details = judgmentErrors
    throw err
  }
  if (!model || PLACEHOLDER_RE.test(model)) {
    const err = new Error('Flag --model obbligatorio: il modello non si deduce dall\'ambiente')
    err.code = 'MODEL_MISSING'
    throw err
  }

  const agentRuntime = detectAgentRuntime(env, model)
  if (!agentRuntime) {
    const err = new Error('agent_runtime non costruibile senza modello valido')
    err.code = 'MODEL_MISSING'
    throw err
  }

  const timestamp = timestampOverride || formatTimestamp(now)
  const ids = newMssIds({ nowMs: now.getTime(), entropy, ids: idOverrides })
  const resolvedActorId = actorId || `${agentRuntime.provider}-${model}`.replace(/\s+/g, '-').toLowerCase()

  const recordedBy = {
    actor_id: resolvedActorId,
    actor_type: 'agente',
    role,
    agent_runtime: agentRuntime,
    tools_used: tools.length ? tools : TOOLS_DEFAULT,
  }

  const packagesLoaded = packages.length ? packages : PACKAGE_DEFAULT
  const controls = checks.length ? checks : 'nessuno'
  const ev = judgments.session_event
  const gitRefs = buildSourceRefsFromGit(gitContext.changedFiles, gitContext.headShort, { root })
  const sourceRefs = [...(ev.source_refs || []), ...gitRefs]

  const environment =
    ev.environment ||
    `branch ${gitContext.branch}; HEAD ${gitContext.headShort}; ${gitContext.changedFiles.length} file in working tree`

  const sessionRecord = {
    ...sharedTop(ids, timestamp, recordedBy, packagesLoaded),
    record_type: 'session_event',
    record_id: ids.record_event,
    capture_key: captureKey(ids.session_id, 'session_event', 1),
    event: {
      event_id: ids.event_id,
      event_kind: ev.event_kind || 'session_close',
      occurred_at: timestamp,
      continues_record_id: 'nessuno',
      causation_record_id: 'nessuno',
      intent_user: ev.intent_user,
      session_type: ev.session_type || 'deep',
      capsule_status: ev.capsule_status || 'completa',
      role_key: ev.role_key,
      area: ev.area,
      environment,
      authorization: ev.authorization,
      authorized_outputs: ev.authorized_outputs || [],
      route: ev.route,
      observed_outcome: ev.observed_outcome,
      open_items: ev.open_items ?? 'nessuno',
      controls,
      subject_runtime: ev.subject_runtime,
      privacy: ev.privacy,
      owner_refs: ev.owner_refs || [],
      source_refs: sourceRefs,
    },
  }

  const axisOrder = [
    ['persona', ids.record_persona, ids.ann_persona, 1],
    ['sistema', ids.record_sistema, ids.ann_sistema, 2],
    ['output', ids.record_output, ids.ann_output, 3],
  ]

  const annotations = axisOrder.map(([axis, recordId, annId, ordinal]) => {
    const src = judgments.annotations[axis]
    return {
      ...sharedTop(ids, timestamp, recordedBy, packagesLoaded),
      record_type: 'annotation',
      record_id: recordId,
      capture_key: captureKey(ids.session_id, 'annotation', ordinal),
      annotation: {
        annotation_id: annId,
        axis,
        subject_record_ids: [ids.record_event],
        delta: src.delta,
        assertions: src.assertions,
        asserted_by: src.asserted_by,
        verification: src.verification,
      },
    }
  })

  return [sessionRecord, ...annotations]
}

export function recordsToJsonl(records) {
  return records.map((r) => JSON.stringify(r)).join('\n') + '\n'
}

export function formatCapsuleBlock(jsonl) {
  return `\n## Capsula MetaSkillSystem\n\n\`\`\`jsonl\n${jsonl}\`\`\`\n`
}

/** Cerca segreti solo nei campi macchina (runtime da env), non nella prosa dei giudizi. */
export function scanForSecrets(records) {
  const hits = []
  const list = Array.isArray(records) ? records : []
  for (const record of list) {
    const runtime = record?.recorded_by?.agent_runtime
    if (!runtime || typeof runtime !== 'object') continue
    for (const value of Object.values(runtime)) {
      const text = String(value)
      for (const marker of SECRET_MARKERS) {
        if (text.includes(marker)) hits.push(marker)
      }
    }
  }
  return [...new Set(hits)]
}

export function appendCapsuleToReport(reportPath, jsonl, { root = ROOT } = {}) {
  const absolute = resolve(root, reportPath)
  const rel = absolute.replace(/\\/g, '/').slice(root.replace(/\\/g, '/').length).replace(/^\//, '')
  if (!REPORT_PATH_RE.test(rel)) {
    throw new Error(`Path report fuori perimetro MSS: ${rel}`)
  }
  if (!existsSync(absolute)) {
    throw new Error(`Report non trovato: ${absolute}`)
  }
  const content = readFileSync(absolute, 'utf8')
  if (/## Capsula MetaSkillSystem/i.test(content)) {
    throw new Error('Il report contiene già una capsula — rifiutato per evitare corruzione')
  }
  writeFileSync(absolute, content.replace(/\s*$/, '') + formatCapsuleBlock(jsonl), 'utf8')
}

export function parseCapsuleArgs(argv) {
  const out = {
    template: false,
    judgments: null,
    model: null,
    role: 'agente esecutore',
    actorId: null,
    checks: [],
    tools: [],
    packages: [],
    appendTo: null,
    forceLegacy: false,
    help: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') out.help = true
    else if (a === '--template') out.template = true
    else if (a === '--judgments') out.judgments = argv[++i]
    else if (a === '--model') out.model = argv[++i]
    else if (a === '--role') out.role = argv[++i]
    else if (a === '--actor-id') out.actorId = argv[++i]
    else if (a === '--check') out.checks.push(parseCheckSpec(argv[++i]))
    else if (a === '--tool') out.tools.push(argv[++i])
    else if (a === '--package') out.packages.push(parsePackageSpec(argv[++i]))
    else if (a === '--append-to') out.appendTo = argv[++i]
    else if (a === '--force-legacy') out.forceLegacy = true
    else throw new Error(`Argomento sconosciuto: ${a}`)
  }
  return out
}

export function runCapsule(argv = process.argv, options = {}) {
  const root = options.root ?? ROOT
  let args
  try {
    args = parseCapsuleArgs(argv)
  } catch (error) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `${error.message}\n`,
    }
  }

  if (args.help) {
    return {
      exitCode: 0,
      stdout:
        'Usage: npm run mss:capsule -- [--template] [--judgments file.json] --model <modello> ' +
        '[--role ...] [--actor-id ...] [--check "ID=>comando"] [--tool ...] [--package "id|ver|ref"] ' +
        '[--append-to report.md]\n',
      stderr: '',
    }
  }

  if (args.template) {
    return {
      exitCode: 0,
      stdout: `${JSON.stringify(buildJudgmentsTemplate(), null, 2)}\n`,
      stderr: '',
    }
  }

  if (args.forceLegacy) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: 'Rifiutato: la coppia legacy mss.session/0.1.0 + freeze-1 disattiva controls obbligatori\n',
    }
  }

  if (!args.judgments) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: 'Errore: --judgments file.json obbligatorio (oppure usa --template)\n',
    }
  }

  let judgments
  try {
    judgments = JSON.parse(readFileSync(resolve(root, args.judgments), 'utf8'))
  } catch (error) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `Errore lettura giudizi: ${error.message}\n`,
    }
  }

  const preErrors = validateJudgments(judgments)
  if (preErrors.length) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `Giudizi incompleti — nessuna capsula emessa:\n${preErrors.map((e) => `  - ${e}`).join('\n')}\n`,
    }
  }

  if (!args.model) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: 'Errore: --model obbligatorio — il modello non si deduce dall\'ambiente\n',
    }
  }

  const tools = args.tools.length ? args.tools : TOOLS_DEFAULT
  const packages = args.packages.length ? args.packages : PACKAGE_DEFAULT
  const checks = args.checks.length
    ? runChecks(args.checks, { cwd: root, executor: options.executor || 'mss:capsule' })
    : []

  let records
  try {
    records = buildCapsuleBundle({
      judgments,
      model: args.model,
      role: args.role,
      actorId: args.actorId,
      tools,
      packages,
      checks,
      root,
      env: options.env ?? process.env,
      now: options.now,
      ids: options.ids,
      entropy: options.entropy,
      gitContext: options.gitContext,
    })
  } catch (error) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `${error.message}\n`,
    }
  }

  const jsonl = recordsToJsonl(records)
  const secrets = scanForSecrets(records)
  if (secrets.length) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `Rifiutato: possibile segreto nell'output (${secrets.join(', ')})\n`,
    }
  }

  if (args.appendTo) {
    try {
      appendCapsuleToReport(args.appendTo, jsonl, { root })
    } catch (error) {
      return { exitCode: 2, stdout: '', stderr: `${error.message}\n` }
    }
  }

  // Un controllo `non_noto` è onesto ma passa inosservato in mezzo al JSONL: va detto a voce.
  const unrun = checks.filter((c) => c.esito === 'non_noto')
  const warning = unrun.length
    ? `Avviso: ${unrun.length} controllo/i non eseguito/i, registrati 'non_noto': ${unrun.map((c) => c.control_id).join(', ')}\n`
    : ''

  return { exitCode: 0, stdout: jsonl, stderr: warning, records, jsonl }
}

function main() {
  const result = runCapsule()
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  process.exit(result.exitCode ?? 0)
}

if (isMainModule(import.meta.url)) {
  main()
}
