#!/usr/bin/env node
/**
 * mss:capsule — genera il blocco JSONL della capsula MetaSkillSystem.
 *
 * Livello 1 (macchina): UUIDv7, timestamp, schema, git, controls eseguiti.
 * Livello 2 (macchina + flag): agent_runtime da env whitelisted; modello obbligatorio via --model.
 * Livello 3 (agente): giudizi in --judgments file.json; tre assi obbligatori.
 * La modalita R1 compatta non fa riscrivere la busta: riceve solo i tre assi e
 * dichiara come non osservato cio che Git/comandi/runtime non possono sapere.
 *
 * Non modifica report esistenti salvo --append-to esplicito.
 */

import { spawnSync, execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { REPORT_PATH_RE, validatePathContent } from './adapter.mjs'
import { formatHuman } from './core.mjs'
import { collectGitHeadHistory } from './git-adapter.mjs'
import { countCapsuleHeadings } from './parse.mjs'
import { findRecordInCorpus, REVISORE_RE } from './query.mjs'
import {
  ENUM,
  ID_RE,
  REVISION_CURRENT,
  REVISION_LEGACY,
  SCHEMA_CURRENT,
  SCHEMA_LEGACY,
  VERIFIER_STATUSES,
} from './rules.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'
import { newAmendmentIds, newMssIds } from './uuid.mjs'

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

function quoteWarning(command) {
  if (process.platform !== 'win32') return null
  if (/'[^']*\s+[^']*'/.test(command)) {
    return 'virgolette singole con spazi su Windows: cmd.exe non le interpreta; il controllo potrebbe non raggiungere il bersaglio'
  }
  const splitOptionPath = /(?:--file|--append-to|--judgments|--to|--repo)\s+[^"'\s]+\s+(?!-)[^"'\s]/.test(command)
  const splitWindowsPath = /(?<!["'])(?:[A-Za-z]:\\|\\\\)[^"'\r\n]*\s+(?!-)[^"'\s]+/.test(command)
  if (splitOptionPath || splitWindowsPath) {
    return 'path probabilmente non quotato dopo un argomento file: il controllo potrebbe non raggiungere il bersaglio'
  }
  return null
}

/**
 * Residuo N4 (dopo `--check-expect` di M-G): comandi noti che con expectedExit 0
 * registrerebbero un `pass` senza prova. Lista chiusa — non è un oracolo di
 * infallibilità; i controlli a segno invertito (`--check-expect` ≠ 0) restano ammessi.
 * T13 / Q-B: estesa con pattern chiaramente non-prova usati come falsi verdi.
 */
const NON_FALSIFIABLE_CHECK_PATTERNS = [
  {
    re: /^git(?:\.exe)?\s+status(?:\s+(?:--short|-s|--porcelain(?:-v[12])?|-uall|-uno))*$/i,
    why: 'git status in sola lettura non misura un gate (exit 0 non prova nulla)',
  },
  {
    re: /^true$/i,
    why: 'true esce sempre 0',
  },
  {
    re: /^:$/,
    why: 'no-op shell (:) esce sempre 0',
  },
  {
    re: /^echo(?:\s|$)/i,
    why: 'echo non misura un gate',
  },
  {
    re: /^(?:npm(?:\.cmd)?\s+run\s+)?mss:query(?:\s+--)?\s+--verifica\b/i,
    why: 'mss:query --verifica esce 0 anche a conteggio zero (falso verde N4)',
  },
  {
    re: /^(?:pwd|cd)(?:\s+\.)?$/i,
    why: 'pwd/cd non misura un gate',
  },
  {
    re: /^whoami$/i,
    why: 'whoami esce 0 senza prova di gate',
  },
  {
    re: /^hostname$/i,
    why: 'hostname non misura un gate',
  },
  {
    re: /^git(?:\.exe)?\s+rev-parse(?:\s+(?:HEAD|--short(?:\s+HEAD)?|--abbrev-ref\s+HEAD))+$/i,
    why: 'git rev-parse informativo esce 0 in ogni repo valida (falso verde)',
  },
  {
    re: /^git(?:\.exe)?\s+branch\s+--show-current$/i,
    why: 'git branch --show-current non misura un gate',
  },
  {
    re: /^(?:node(?:\.exe)?|npm(?:\.cmd)?)\s+(?:--version|-v)$/i,
    why: 'node/npm --version non misura un gate del lavoro',
  },
  {
    re: /^(?:exit\s+0|cmd(?:\.exe)?\s+\/c\s+exit(?:\s+\/b)?\s*0)$/i,
    why: 'exit 0 è un pass forzato',
  },
  {
    re: /^(?:ls(?:\s+-[aAhlrt]+)*|dir(?:\s+\/[bws]+)*)\s*$/i,
    why: 'ls/dir in sola lettura non misura un gate',
  },
  {
    re: /^(?:date|Get-Date)$/i,
    why: 'date/Get-Date non misura un gate',
  },
]

export function nonFalsifiableCheckReason(command, expectedExit = 0) {
  if (expectedExit !== 0) return null
  const cmd = String(command ?? '').trim().replace(/\s+/g, ' ')
  if (!cmd) return null
  for (const { re, why } of NON_FALSIFIABLE_CHECK_PATTERNS) {
    if (re.test(cmd)) return why
  }
  return null
}

export class NonFalsifiableCheckError extends Error {
  constructor(controlId, command, reason) {
    super(
      `Rifiutato: controllo non falsificabile (N4) "${controlId}=>${command}" — ${reason}. ` +
      'Scegli un comando capace di fallire, oppure --check-expect con exit ≠ 0 se il fallimento è la prova.',
    )
    this.name = 'NonFalsifiableCheckError'
    this.code = 'CHECK_NON_FALSIFIABLE'
    this.controlId = controlId
    this.command = command
    this.reason = reason
  }
}

export function runChecks(checkSpecs, { cwd = ROOT, executor = 'mss:capsule' } = {}) {
  return checkSpecs.map(({ control_id, command, expectedExit = 0 }) => {
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
    const vacuous = nonFalsifiableCheckReason(trimmed, expectedExit)
    if (vacuous) {
      throw new NonFalsifiableCheckError(control_id, trimmed, vacuous)
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
    const pass = code === expectedExit
    const warning = quoteWarning(command)
    return {
      control_id,
      criterio: `${command} (atteso exit ${expectedExit})`,
      esito: pass ? 'pass' : 'fail',
      numeratore: pass ? 1 : 0,
      denominatore: 1,
      esecutore: `${executor}: ${command} (exit ${code}; atteso ${expectedExit})${warning ? ` — AVVISO: ${warning}` : ''}`,
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

/** Errore di parsing --verify: messaggio pulito, nessuno stack trace in CLI. */
export class ParseVerifySpecError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParseVerifySpecError'
  }
}

/**
 * Esiti che un SECONDO attore puo' affermare su un record altrui.
 *
 * L'elenco non e' una seconda enum: e' `ENUM.verificationStatus` meno `self_report`. Un revisore
 * che scrive `self_report` sul record di un altro non sta verificando: sta ridichiarando
 * l'autodichiarazione altrui, che e' esattamente il dato inventato vietato da `R2`.
 */
const VERIFY_STATUSES = VERIFIER_STATUSES

/**
 * `--verify "<target_record_id>|<status>|<evidence_ref>|<motivo>"`
 *
 * Quattro campi tutti obbligatori, perche' sono i quattro che l'attrezzo NON puo' dedurre:
 * quale record, con che esito, con quale prova e perche'. Il motivo puo' contenere `|`
 * (si divide solo sui primi tre separatori). I valori precedenti NON si passano: li legge
 * l'attrezzo dal record bersaglio (vedi `buildVerificationAmendments`).
 */
export function parseVerifySpec(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new ParseVerifySpecError('Formato --verify invalido: stringa vuota')
  }
  const parts = []
  let rest = raw
  for (let i = 0; i < 3; i++) {
    const idx = rest.indexOf('|')
    if (idx === -1) {
      throw new ParseVerifySpecError(
        `Formato --verify invalido "${raw}": atteso "target_record_id|status|evidence_ref|motivo"`,
      )
    }
    parts.push(rest.slice(0, idx).trim())
    rest = rest.slice(idx + 1)
  }
  const reason = rest.trim()
  const [targetRecordId, status, evidenceRef] = parts
  if (!ID_RE.record.test(targetRecordId)) {
    throw new ParseVerifySpecError(
      `Formato --verify invalido: "${targetRecordId}" non e un record_id (atteso mss-rec-<UUIDv7>)`,
    )
  }
  if (!VERIFY_STATUSES.includes(status)) {
    throw new ParseVerifySpecError(
      `Formato --verify invalido: esito "${status}" non ammesso — attesi ${VERIFY_STATUSES.join(' | ')}`,
    )
  }
  if (!evidenceRef) {
    throw new ParseVerifySpecError('Formato --verify invalido: evidence_ref mancante — una verifica senza prova non e una verifica')
  }
  if (!reason || PLACEHOLDER_RE.test(reason)) {
    throw new ParseVerifySpecError('Formato --verify invalido: motivo mancante o placeholder (contratto §6: reason obbligatorio)')
  }
  return { targetRecordId, status, evidenceRef, reason }
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

/**
 * R1: l'agente consegna soltanto i tre giudizi. La busta della seduta e' costruita
 * dai fatti disponibili al generatore; i campi semantici che non hanno una fonte
 * meccanica restano esplicitamente non osservati, mai riempiti per plausibilita'.
 */
export function buildR1JudgmentsTemplate() {
  return {
    _guida: 'R1 compatto: compila solo persona, sistema e output. Per delta "nessuno" lascia assertions: [].',
    persona: { delta: 'nessuno', assertions: [] },
    sistema: { delta: 'nessuno', assertions: [] },
    output: { delta: 'nessuno', assertions: [] },
  }
}

export function isR1CompactJudgments(judgments) {
  return Boolean(
    judgments &&
    typeof judgments === 'object' &&
    !judgments.session_event &&
    !judgments.annotations &&
    ['persona', 'sistema', 'output'].every((axis) => Object.hasOwn(judgments, axis)),
  )
}

function nonObserved(label) {
  return `non_osservato: ${label}`
}

/**
 * Costanti di mode R1 — enum/obblighi schema che il generatore DEVE riempire ma che
 * NON derivano dalla chat. Dichiarate esplicitamente (riserva controverifica R1 24-08-26):
 * non fingono osservazione; restano etichette di mode documentate in Manuale §2.4 e Contratto §5.
 */
export const R1_MODE_CONSTANTS = Object.freeze({
  session_type: 'standard',
  capsule_status: 'completa',
  event_kind: 'session_close',
  route_chosen: 'mss:capsule modalita R1 compatta',
  privacy: Object.freeze({
    classification: 'internal',
    capture_basis: 'operational_need',
    allowed_content: Object.freeze(['metadati Git', 'esiti dei controlli dichiarati']),
    prohibited_content: Object.freeze([
      'dati personali',
      'segreti',
      'materiale privato non registrabile',
    ]),
    redactions: 'nessuno',
    external_release: 'requires_confirmation',
    retention: 'undecided_wp0.1',
    rectification_route: 'amendment',
  }),
})

export function normalizeR1Judgments(judgments, { role, actorId, reportPath, gitContext } = {}) {
  const reportOutput = reportPath || 'capsula JSONL emessa su stdout'
  const compactAnnotation = (axis) => ({
    delta: judgments[axis].delta,
    assertions: judgments[axis].assertions,
    asserted_by: {
      actor_id: actorId,
      role,
      basis: 'self_report',
    },
    verification: {
      status: axis === 'persona' ? 'unverified' : 'self_report',
      verified_by: [],
      verified_at: `non_applicabile:${axis === 'persona' ? 'nessuna valutazione Persona' : 'self_report'}`,
      criterion_ref: 'non_applicabile: criterio di verifica non raccolto automaticamente',
      evidence_refs: [],
      notes: nonObserved('note di verifica non raccolte automaticamente'),
    },
  })

  const mode = R1_MODE_CONSTANTS
  return {
    session_event: {
      intent_user: nonObserved('il generatore non legge la chat'),
      event_kind: mode.event_kind,
      // Enum obbligatorio: costante di mode R1 (non osservato dalla chat).
      session_type: mode.session_type,
      capsule_status: mode.capsule_status,
      role_key: role,
      area: nonObserved('area della seduta non dedotta dalla chat'),
      // Branch/HEAD/conteggio file: fatti Git (macchina), non narrativa chat.
      environment: `branch ${gitContext?.branch || 'non_osservato'}; HEAD ${gitContext?.headShort || 'non_osservato'}; ${(gitContext?.changedFiles || []).length} file in working tree`,
      authorization: {
        read: [],
        write: reportPath ? [reportPath] : [],
        forbid: [],
      },
      authorized_outputs: [reportOutput],
      route: {
        chosen: mode.route_chosen,
        alternatives_or_conflicts: 'nessuno',
      },
      observed_outcome: nonObserved(
        'esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git',
      ),
      open_items: nonObserved('il generatore non deduce i follow-up dal report'),
      subject_runtime: {
        actor_id: nonObserved('soggetto della seduta'),
        provider: nonObserved('provider del soggetto della seduta'),
        model: nonObserved('modello del soggetto della seduta'),
        runtime: nonObserved('runtime del soggetto della seduta'),
        surface: nonObserved('superficie del soggetto della seduta'),
      },
      // Privacy enum/liste: template di mode R1, non classificazione osservata dalla chat.
      privacy: {
        classification: mode.privacy.classification,
        capture_basis: mode.privacy.capture_basis,
        allowed_content: [...mode.privacy.allowed_content],
        prohibited_content: [...mode.privacy.prohibited_content],
        redactions: mode.privacy.redactions,
        external_release: mode.privacy.external_release,
        retention: mode.privacy.retention,
        rectification_route: mode.privacy.rectification_route,
      },
      owner_refs: [],
      source_refs: [],
    },
    annotations: Object.fromEntries(
      ['persona', 'sistema', 'output'].map((axis) => [axis, compactAnnotation(axis)]),
    ),
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
      const noDelta = ann.delta === 'nessuno'
      if (!Array.isArray(ann.assertions) || (!noDelta && ann.assertions.length === 0)) {
        errors.push(`annotations.${axis}.assertions deve contenere almeno un elemento salvo delta "nessuno"`)
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
  verifications = [],
  lookupRecord,
  amendmentIds,
  reportPath,
} = {}) {
  if (SCHEMA_CURRENT === SCHEMA_LEGACY || REVISION_CURRENT === REVISION_LEGACY) {
    throw new Error('Rifiutato: coppia legacy disattiva le prove — leggere da rules.mjs')
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
  const normalizedJudgments = isR1CompactJudgments(judgments)
    ? normalizeR1Judgments(judgments, { role, actorId: resolvedActorId, reportPath, gitContext })
    : judgments
  const judgmentErrors = validateJudgments(normalizedJudgments)
  if (judgmentErrors.length) {
    const err = new Error(judgmentErrors.join('; '))
    err.code = 'JUDGMENTS_INVALID'
    err.details = judgmentErrors
    throw err
  }

  const recordedBy = {
    actor_id: resolvedActorId,
    actor_type: 'agente',
    role,
    agent_runtime: agentRuntime,
    tools_used: tools.length ? tools : TOOLS_DEFAULT,
  }

  const packagesLoaded = packages.length ? packages : PACKAGE_DEFAULT
  const controls = checks.length ? checks : 'nessuno'
  const ev = normalizedJudgments.session_event
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
    const src = normalizedJudgments.annotations[axis]
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

  const amendments = buildVerificationAmendments({
    specs: verifications,
    ids,
    timestamp,
    recordedBy,
    packagesLoaded,
    amendmentIds,
    lookup: lookupRecord || ((recordId) => findRecordInCorpus(recordId, { root })),
  })

  return [sessionRecord, ...annotations, ...amendments]
}

/**
 * `N2` — emissione di prima classe di un amendment di verifica (contratto §6).
 *
 * Perche' un amendment e non un campo della seduta: `verification.verified_by` di
 * un'annotazione e' l'autodichiarazione di chi ha condotto QUELLA seduta. Un revisore che se lo
 * scrivesse addosso non avrebbe verificato nessuno, avrebbe firmato il proprio lavoro — il
 * sistema passerebbe da «zero verifiche registrate» (onesto) a «verifiche finte registrate»
 * (mente al comando che lo interroga). La verifica e' per costruzione l'atto di un secondo
 * attore su un record altrui, e nel contratto ha gia' la sua forma.
 *
 * L'attrezzo NON deduce nulla: bersaglio, esito, prova e motivo arrivano da `--verify`. Legge
 * dal corpus solo i valori PRECEDENTI, che non sono un giudizio ma un fatto gia' scritto —
 * e ricopiarli a mano e' come si sbaglia `previous_value_or_hash`.
 *
 * `R-T7-06` / Opzione B — asse Output: oltre a `annotation.verification.*`, l'amendment
 * rettifica anche `assertions[i].verification_status` e
 * `assertions[i].verification_or_use_evidence` (stesso esito/prova di `--verify`).
 * Indice: default `0` se c'è una sola asserzione; con 2+ serve
 * `--verify-assertion-index <n>` subito dopo `--verify` (T13 / Q-C).
 * Non riscrive il record `final`; non tocca assi persona/sistema.
 *
 * @param lookup  funzione (record_id) -> { record, path } | null. Iniettabile per i test.
 */
export function buildVerificationAmendments({
  specs = [],
  ids,
  timestamp,
  recordedBy,
  packagesLoaded,
  lookup,
  amendmentIds,
} = {}) {
  if (!specs.length) return []
  const generated = amendmentIds || newAmendmentIds(specs.length, { nowMs: Date.parse(timestamp) || undefined })
  const errors = []
  const records = []

  specs.forEach((spec, index) => {
    const hit = lookup(spec.targetRecordId)
    if (!hit?.record) {
      errors.push(
        `--verify: record bersaglio ${spec.targetRecordId} non trovato nel corpus ` +
        '(HEAD + working tree). Una verifica su un record inesistente non e registrabile.',
      )
      return
    }
    const target = hit.record
    if (target.record_type !== 'annotation') {
      errors.push(
        `--verify: ${spec.targetRecordId} e un record "${target.record_type}", non un'annotazione. ` +
        'Lo stato di verifica vive sulle annotazioni (contratto §5): indica il record dell\'asse verificato.',
      )
      return
    }
    if (target.finalization !== 'final') {
      errors.push(
        `--verify: ${spec.targetRecordId} non e finalization:final — un amendment final su un ` +
        'bersaglio non finalizzato esce MSS-AMENDMENT-TARGET-NOT-FINAL.',
      )
      return
    }
    const verification = target.annotation?.verification
    if (!verification) {
      errors.push(`--verify: ${spec.targetRecordId} non ha annotation.verification da rettificare.`)
      return
    }

    const verifier = {
      actor_id: recordedBy.actor_id,
      role: recordedBy.role,
      agent_runtime: recordedBy.agent_runtime,
    }
    const changes = [
      {
        field_path: 'annotation.verification.status',
        previous_value_or_hash: verification.status,
        corrected_value: spec.status,
      },
      {
        field_path: 'annotation.verification.verified_by',
        previous_value_or_hash: Array.isArray(verification.verified_by) ? verification.verified_by : [],
        corrected_value: [...(Array.isArray(verification.verified_by) ? verification.verified_by : []), verifier],
      },
      {
        field_path: 'annotation.verification.verified_at',
        previous_value_or_hash: verification.verified_at,
        corrected_value: timestamp,
      },
    ]

    // R-T7-06 Opzione B + T13/Q-C: asse Output — allinea assertions[i] senza riscrivere il final.
    if (target.annotation?.axis === 'output') {
      const assertions = target.annotation.assertions
      if (!Array.isArray(assertions) || assertions.length === 0) {
        errors.push(
          `--verify: ${spec.targetRecordId} e asse output senza assertions[] — ` +
          'non c\'e verification_status Output da rettificare (R-T7-06).',
        )
        return
      }
      let assertionIndex = spec.assertionIndex
      if (assertionIndex === undefined) {
        if (assertions.length !== 1) {
          errors.push(
            `--verify: ${spec.targetRecordId} ha ${assertions.length} assertions Output; ` +
            'indica quale con --verify-assertion-index <n> subito dopo --verify ' +
            '(indici 0-based; T13/Q-C).',
          )
          return
        }
        assertionIndex = 0
      }
      if (!Number.isInteger(assertionIndex) || assertionIndex < 0 || assertionIndex >= assertions.length) {
        errors.push(
          `--verify: --verify-assertion-index ${assertionIndex} fuori range per ` +
          `${spec.targetRecordId} (assertions.length=${assertions.length}, indici validi 0..${assertions.length - 1}).`,
        )
        return
      }
      const assertion = assertions[assertionIndex]
      if (assertion?.verification_status === undefined) {
        errors.push(
          `--verify: ${spec.targetRecordId} assertions[${assertionIndex}] senza verification_status — ` +
          'campo obbligatorio Output, non inventabile da --verify.',
        )
        return
      }
      changes.push(
        {
          field_path: `annotation.assertions[${assertionIndex}].verification_status`,
          previous_value_or_hash: assertion.verification_status,
          corrected_value: spec.status,
        },
        {
          field_path: `annotation.assertions[${assertionIndex}].verification_or_use_evidence`,
          previous_value_or_hash: assertion.verification_or_use_evidence ?? '',
          corrected_value: spec.evidenceRef,
        },
      )
    }

    records.push({
      ...sharedTop(ids, timestamp, recordedBy, packagesLoaded),
      record_type: 'amendment',
      record_id: generated[index].record_id,
      capture_key: captureKey(ids.session_id, 'amendment', index + 1),
      amendment: {
        amendment_id: generated[index].amendment_id,
        target_record_id: spec.targetRecordId,
        relation: 'amends',
        reason: spec.reason,
        changes,
        evidence_refs: [spec.evidenceRef],
        effective_at: timestamp,
      },
    })
  })

  if (errors.length) {
    const err = new Error(errors.join('; '))
    err.code = 'VERIFY_INVALID'
    err.details = errors
    throw err
  }
  return records
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

/**
 * Prepara l'append SENZA scrivere: calcola il contenuto risultante e applica le guardie di path
 * e di capsula già presente. Separato dalla scrittura perché l'ordine imposto da `N1` è
 * «validare, poi scrivere»: il contenuto prospettico va passato al validator prima che tocchi
 * il disco. Un fallimento qui non lascia mezza capsula sul report perché non si è ancora scritto.
 */
export function planCapsuleAppend(reportPath, jsonl, { root = ROOT } = {}) {
  const absolute = resolve(root, reportPath)
  const rel = absolute.replace(/\\/g, '/').slice(root.replace(/\\/g, '/').length).replace(/^\//, '')
  if (!REPORT_PATH_RE.test(rel)) {
    throw new Error(`Path report fuori perimetro MSS: ${rel}`)
  }
  if (!existsSync(absolute)) {
    throw new Error(`Report non trovato: ${absolute}`)
  }
  const content = readFileSync(absolute, 'utf8')
  // La definizione di «capsula già presente» è quella del validator (parse.mjs), non una
  // sottostringa scritta a mano qui: vedi `findCapsuleHeadings`, difetto N1 caso 1.
  const existing = countCapsuleHeadings(content)
  if (existing > 0) {
    throw new Error(
      `Il report dichiara già ${existing} sezione/i «Capsula MetaSkillSystem» — rifiutato: ` +
      'appendere la seconda produce MSS-PARSE-JSONL-AMBIGUOUS. Togli la sezione vuota, oppure ' +
      'incolla il JSONL di stdout dentro quella che hai già scritto.',
    )
  }
  return {
    absolute,
    rel,
    previousContent: content,
    nextContent: content.replace(/\s*$/, '') + formatCapsuleBlock(jsonl),
  }
}

export function appendCapsuleToReport(reportPath, jsonl, { root = ROOT } = {}) {
  const plan = planCapsuleAppend(reportPath, jsonl, { root })
  writeFileSync(plan.absolute, plan.nextContent, 'utf8')
}

/** Snapshot HEAD del corpus, come li legge `validate:mss`; assenti o repo non-git → nessuno. */
function safeHeadHistory(root) {
  try {
    return collectGitHeadHistory(root)
  } catch {
    return []
  }
}

/**
 * Esegue sul bundle appena costruito lo STESSO validator che girerà dopo su `validate:mss`.
 *
 * È il cuore del fix `N1`: `validateJudgments` controlla che i tre giudizi ci SIANO, non che
 * siano VALIDI. Un `G: 3` o un `verification.status` fuori enum passavano la completezza,
 * finivano scritti nel report, e `validate:mss` usciva rosso dopo — con l'agente convinto di
 * aver visto verde. La regola non viene riscritta (`D18`): si importa `validatePathContent`,
 * lo stesso ingresso usato da `scripts/mss/cli.mjs`.
 *
 * Con `--append-to` si valida il report PROSPETTICO (kind `report`, `--require-capsule`), non il
 * solo JSONL: è l'unico modo di vedere anche i difetti che nascono dall'incontro fra capsula e
 * report ospite, come la seconda sezione capsula.
 */
export function validateCapsuleOutput({ jsonl, root = ROOT, plan = null, historicalSnapshots } = {}) {
  const snapshots = historicalSnapshots ?? safeHeadHistory(root)
  const input = plan
    ? { file: plan.absolute, content: plan.nextContent, kind: 'report', requireCapsule: true }
    : { file: resolve(root, 'capsula-mss-stdout.jsonl'), content: jsonl, kind: 'jsonl' }
  return validatePathContent({ workspaceRoot: root, historicalSnapshots: snapshots, ...input })
}

export function parseCapsuleArgs(argv) {
  const out = {
    template: false,
    templateR1: false,
    judgments: null,
    model: null,
    role: 'agente esecutore',
    actorId: null,
    checks: [],
    verify: [],
    tools: [],
    packages: [],
    appendTo: null,
    forceLegacy: false,
    help: false,
  }
  let lastWasCheck = false
  let lastWasVerify = false
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') out.help = true
    else if (a === '--template') out.template = true
    else if (a === '--template-r1') out.templateR1 = true
    else if (a === '--judgments') out.judgments = argv[++i]
    else if (a === '--model') out.model = argv[++i]
    else if (a === '--role') out.role = argv[++i]
    else if (a === '--actor-id') out.actorId = argv[++i]
    else if (a === '--check') {
      out.checks.push(parseCheckSpec(argv[++i]))
      lastWasCheck = true
      lastWasVerify = false
      continue
    }
    else if (a === '--check-expect') {
      if (!lastWasCheck) throw new Error('--check-expect richiede un --check immediatamente precedente')
      const raw = argv[++i]
      if (!/^\d+$/.test(raw || '')) throw new Error('--check-expect richiede un exit code intero maggiore o uguale a zero')
      const last = out.checks[out.checks.length - 1]
      if (Object.hasOwn(last, 'expectedExit')) throw new Error('--check-expect puo essere dichiarato una sola volta per --check')
      last.expectedExit = Number(raw)
    }
    else if (a === '--verify') {
      out.verify.push(parseVerifySpec(argv[++i]))
      lastWasVerify = true
      lastWasCheck = false
      continue
    }
    else if (a === '--verify-assertion-index') {
      if (!lastWasVerify) {
        throw new Error('--verify-assertion-index richiede un --verify immediatamente precedente')
      }
      const raw = argv[++i]
      if (!/^\d+$/.test(raw || '')) {
        throw new Error('--verify-assertion-index richiede un intero >= 0 (indice 0-based dell\'asserzione Output)')
      }
      const last = out.verify[out.verify.length - 1]
      if (Object.hasOwn(last, 'assertionIndex')) {
        throw new Error('--verify-assertion-index puo essere dichiarato una sola volta per --verify')
      }
      last.assertionIndex = Number(raw)
    }
    else if (a === '--tool') out.tools.push(argv[++i])
    else if (a === '--package') out.packages.push(parsePackageSpec(argv[++i]))
    else if (a === '--append-to') out.appendTo = argv[++i]
    else if (a === '--force-legacy') out.forceLegacy = true
    else throw new Error(`Argomento sconosciuto: ${a}`)
    lastWasCheck = false
    lastWasVerify = false
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
        'Usage: npm run mss:capsule -- [--template|--template-r1] [--judgments file.json] --model <modello> ' +
        '[--role ...] [--actor-id ...] [--check "ID=>comando" --check-expect <exit>] [--tool ...] [--package "id|ver|ref"] ' +
        '[--verify "mss-rec-…|independently_verified|evidence_ref|motivo" [--verify-assertion-index <n>]] ' +
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

  if (args.templateR1) {
    return {
      exitCode: 0,
      stdout: `${JSON.stringify(buildR1JudgmentsTemplate(), null, 2)}\n`,
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

  if (!args.model) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: 'Errore: --model obbligatorio — il modello non si deduce dall\'ambiente\n',
    }
  }

  const tools = args.tools.length ? args.tools : TOOLS_DEFAULT
  const packages = args.packages.length ? args.packages : PACKAGE_DEFAULT
  let checks = []
  if (args.checks.length) {
    try {
      checks = runChecks(args.checks, { cwd: root, executor: options.executor || 'mss:capsule' })
    } catch (error) {
      if (error?.code === 'CHECK_NON_FALSIFIABLE' || error instanceof NonFalsifiableCheckError) {
        return { exitCode: 2, stdout: '', stderr: `${error.message}\n` }
      }
      throw error
    }
  }

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
      verifications: args.verify,
      lookupRecord: options.lookupRecord,
      amendmentIds: options.amendmentIds,
      reportPath: args.appendTo,
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

  // `N1` — validare, POI scrivere. Fino al 24-08-26 l'ordine era l'opposto in tutto tranne il
  // nome: `validateJudgments` guardava che i tre giudizi CI FOSSERO, non che fossero VALIDI, e
  // un `G: 3` o una seconda sezione capsula finivano sul disco con exit 0, lasciando l'agente
  // convinto di aver visto verde. Da qui in giù nessun percorso scrive prima del verdetto.
  let plan = null
  if (args.appendTo) {
    try {
      plan = planCapsuleAppend(args.appendTo, jsonl, { root })
    } catch (error) {
      return { exitCode: 2, stdout: '', stderr: `${error.message}\n` }
    }
  }

  const snapshots = safeHeadHistory(root)
  const verdict = validateCapsuleOutput({ jsonl, root, plan, historicalSnapshots: snapshots })
  if (!verdict.ok) {
    // Un report già rosso PRIMA della capsula non è colpa della capsula: dirlo evita che
    // l'agente riscriva giudizi corretti inseguendo un difetto che sta nel report ospite.
    let origine = ''
    if (plan) {
      const baseline = validatePathContent({
        workspaceRoot: root,
        file: plan.absolute,
        content: plan.previousContent,
        kind: 'report',
        requireCapsule: false,
        historicalSnapshots: snapshots,
      })
      if (!baseline.ok) {
        origine = 'Nota: il report era già rosso PRIMA della capsula — guarda anche il corpo del report.\n'
      }
    }
    return {
      exitCode: 2,
      stdout: '',
      stderr:
        'Rifiutato: la capsula non passa validate:mss — nessuna scrittura.\n' +
        `${formatHuman(verdict)}\n${origine}`,
      records,
      jsonl,
      validation: verdict,
    }
  }

  if (plan) writeFileSync(plan.absolute, plan.nextContent, 'utf8')

  // Un controllo `non_noto` è onesto ma passa inosservato in mezzo al JSONL: va detto a voce.
  const unrun = checks.filter((c) => c.esito === 'non_noto')
  let warning = unrun.length
    ? `Avviso: ${unrun.length} controllo/i non eseguito/i, registrati 'non_noto': ${unrun.map((c) => c.control_id).join(', ')}\n`
    : ''

  // `N2` — avviso, non blocco. Una seduta condotta da un revisore che non registra nessuna
  // verifica è il segnale che la revisione è avvenuta e non è stata scritta. Bloccare qui
  // produrrebbe amendment di comodo, cioè lo stesso dato inventato che `R2` vieta.
  if (REVISORE_RE.test(String(args.role || '')) && !args.verify.length) {
    warning +=
      `Avviso: --role "${args.role}" dichiara un revisore ma la seduta non emette nessun amendment ` +
      'di verifica. Se hai verificato un record altrui, registralo con ' +
      '--verify "mss-rec-…|independently_verified|evidence_ref|motivo"; se non hai verificato ' +
      'nulla, va bene così.\n'
  }

  return { exitCode: 0, stdout: jsonl, stderr: warning, records, jsonl, validation: verdict }
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
