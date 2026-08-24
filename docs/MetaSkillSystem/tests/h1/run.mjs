#!/usr/bin/env node
/**
 * Suite H-1: contratto/core, parser, resolver, CLI, adapter, hook, fixture e matrice.
 * Offline, no rete/DB. Il test confronta le fixture generate senza riscrivere quelle versionate.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  validateAppendOnlyRecords,
  validateGlobalRecordView,
  validateMss,
} from '../../../../scripts/mss/core.mjs'
import { validatePathContent, validateStagedMssFiles } from '../../../../scripts/mss/adapter.mjs'
import {
  findRecentReportFiles,
  isStopHookProbePath,
  todaySessionFolder,
} from '../../../../scripts/mss/report-paths.mjs'
import { extractCapsulesFromMarkdown } from '../../../../scripts/mss/parse.mjs'
import { canonicalJson } from '../../../../scripts/mss/canonical.mjs'
import { resolveRef } from '../../../../scripts/mss/refs.mjs'
import { RULE } from '../../../../scripts/mss/rules.mjs'
import { CONFIG } from '../../../../scripts/mss/config.mjs'
import {
  amendment,
  axisPersona,
  IDS,
  sessionEvent,
  toJsonl,
  validBundle,
} from './fixture-factory.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '../../../..')
// I path di seduta SINTETICI seguono la config (R8). Restano letterali solo le ANCORE
// STORICHE qui sotto: report reali di questo progetto, inchiodati per sha256 dal protocollo
// congelato. Non sono path da parametrizzare, sono pezzi di storia con un nome preciso.
const SESSIONI = CONFIG.sessionsDir
/**
 * ANCORE DI PROGETTO (R8). Alcuni gruppi non provano il MOTORE: provano che QUESTA repo ha certi
 * file. I report storici inchiodati per sha256, le guardie PROD con i ref di questo progetto, gli
 * hook cablati nell'IDE. In una repo ospite quei file non esistono e non devono esistere (la
 * guardia PROD del kit resta generica per decisione A2). Farli fallire li non direbbe «motore
 * rotto», direbbe «questa non e la repo sorgente»: un rosso che non insegna niente.
 *
 * Quindi un gruppo ancorato viene DICHIARATO non applicabile quando la sua ancora manca — mai
 * saltato in silenzio, mai contato come verde. E se non restasse in piedi NESSUN gruppo, la suite
 * esce rossa: una suite che non esegue niente non e una suite verde.
 */
const PROJECT_ANCHORS = Object.freeze({
  'sedute-storiche': [
    'docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md',
    'docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md',
    'docs/Sessioni di lavoro/09-08-26/Report-ciclo-metaskillsystem-v0-avvio-e-cattura-09-08-26.md',
  ],
  'guardie-e-hook-di-progetto': [
    '.claude/hooks/guard-prod.mjs',
    '.cursor/hooks/guard-prod.mjs',
    '.claude/hooks/fine-sessione-senior.mjs',
    '.claude/settings.json',
  ],
  'hook-stop-cursor': ['.cursor/hooks/fine-sessione-nudge.mjs'],
  'hook-precommit-cursor': ['.cursor/hooks/fine-sessione-commit-check.mjs'],
})

function missingAnchors(id) {
  return (PROJECT_ANCHORS[id] || []).filter((rel) => !existsSync(join(repoRoot, rel)))
}
const fixturesDir = join(repoRoot, 'docs/MetaSkillSystem/fixtures/v0.1')
const matrixPath = join(repoRoot, 'docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json')
const stopHookPath = join(repoRoot, '.cursor/hooks/fine-sessione-nudge.mjs')
const precommitHookPath = join(repoRoot, '.cursor/hooks/fine-sessione-commit-check.mjs')
// A2/A3 (24-08-26): guardie PROD (Cursor+Claude+kit) e stop hook Claude — copie gemelle degli
// hook Cursor sopra, coperte nella stessa suite (mandato M-A/M-B §2).
const cursorGuardProdHookPath = join(repoRoot, '.cursor/hooks/guard-prod.mjs')
const claudeGuardProdHookPath = join(repoRoot, '.claude/hooks/guard-prod.mjs')
const kitGuardProdHookPath = join(repoRoot, '_skill-system-v0/hooks/guard-prod.mjs')
const claudeStopHookPath = join(repoRoot, '.claude/hooks/fine-sessione-senior.mjs')

function gitStatus(root = repoRoot) {
  return spawnSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], {
    cwd: root,
    encoding: 'utf8',
  }).stdout
}

function loadManifest() {
  return JSON.parse(readFileSync(join(fixturesDir, 'manifest.json'), 'utf8'))
}

function fixtureHeadSnapshots() {
  return readdirSync(fixturesDir).sort().map((file) => ({
    path: `docs/MetaSkillSystem/fixtures/v0.1/${file}`,
    content: readFileSync(join(fixturesDir, file)),
  }))
}

function validateRecords(records, options = {}) {
  return validateMss(
    {
      kind: 'jsonl',
      file: options.file || '<memory>',
      content: toJsonl(records),
      workspaceRoot: repoRoot,
    },
    { workspaceRoot: repoRoot, lockSeverity: 'warn', ...options },
  )
}

function runCase(c) {
  const file = join(fixturesDir, c.file)
  const content = readFileSync(file, 'utf8')
  return validateMss(
    { kind: c.kind, file, content, workspaceRoot: repoRoot },
    { workspaceRoot: repoRoot, lockSeverity: 'warn' },
  )
}

function uniqueSorted(values) {
  return [...new Set(values)].sort()
}

function expectCodes(result, expected, mode) {
  const wanted = uniqueSorted(expected || [])
  if (mode === 'pass') {
    if (!result.ok || result.diagnostics.length) return `expected clean pass; codes=${result.codes.join(',')}`
    return null
  }
  const actual = uniqueSorted(mode === 'warn' ? result.warnCodes : result.denyCodes)
  if (mode === 'warn' && (!result.ok || result.denyCodes.length)) {
    return `expected warn-only, got denies=${result.denyCodes.join(',')}`
  }
  if (mode === 'fail' && result.ok) return 'expected fail, got ok'
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    return `expected exact ${mode} codes=${wanted.join(',')}; have=${actual.join(',')}`
  }
  return null
}

function expectHas(result, code) {
  return result.codes.includes(code) ? null : `missing ${code}; have=${result.codes.join(',')}`
}

function testFixtureDrift() {
  const generated = mkdtempSync(join(tmpdir(), 'mss-fixtures-'))
  try {
    const build = spawnSync(
      process.execPath,
      [join(here, 'build-fixtures.mjs'), '--output', generated],
      { encoding: 'utf8', cwd: repoRoot },
    )
    if (build.status !== 0) return `generator failed: ${build.stderr || build.stdout}`
    const committedFiles = readdirSync(fixturesDir).sort()
    const generatedFiles = readdirSync(generated).sort()
    if (JSON.stringify(committedFiles) !== JSON.stringify(generatedFiles)) {
      return `fixture file-set drift committed=${committedFiles.join(',')} generated=${generatedFiles.join(',')}`
    }
    for (const file of committedFiles) {
      const committed = readFileSync(join(fixturesDir, file), 'utf8')
      const next = readFileSync(join(generated, file), 'utf8')
      if (committed !== next) return `fixture content drift: ${file}`
    }
    return null
  } finally {
    rmSync(generated, { recursive: true, force: true })
  }
}

function testStagedMismatch() {
  const failures = []
  const valid = readFileSync(join(fixturesDir, 'FX-S10-staged-valid.jsonl'), 'utf8')
  const invalid = readFileSync(join(fixturesDir, 'FX-S10-worktree-invalid.jsonl'), 'utf8')
  const result = validateMss(
    {
      kind: 'jsonl',
      file: join(fixturesDir, 'FX-S10-staged-valid.jsonl'),
      content: valid,
      stagedContent: valid,
      worktreeContent: invalid,
      workspaceRoot: repoRoot,
    },
    { workspaceRoot: repoRoot },
  )
  const mismatch = expectHas(result, RULE.STAGED_WORKTREE_MISMATCH)
  if (mismatch) failures.push(mismatch)

  const reordered = toJsonl(validBundle().map((record) => Object.fromEntries(Object.entries(record).reverse())))
  const semantic = validateMss(
    {
      kind: 'jsonl',
      file: '<semantic-staged-worktree>',
      content: valid,
      stagedContent: valid,
      worktreeContent: reordered,
      workspaceRoot: repoRoot,
    },
    { workspaceRoot: repoRoot },
  )
  if (semantic.denyCodes.includes(RULE.STAGED_WORKTREE_MISMATCH)) failures.push('JSON key order caused staged/worktree mismatch')

  const lineEndings = validateMss(
    {
      kind: 'jsonl',
      file: '<line-ending-staged-worktree>',
      content: valid,
      stagedContent: valid,
      worktreeContent: valid.replace(/\n/g, '\r\n'),
      workspaceRoot: repoRoot,
    },
    { workspaceRoot: repoRoot },
  )
  if (lineEndings.denyCodes.includes(RULE.STAGED_WORKTREE_MISMATCH)) failures.push('line endings caused staged/worktree mismatch')
  return failures
}

function testCliParity() {
  for (const name of ['FX-V01-bundle.jsonl', 'FX-I01-schema.jsonl']) {
    const file = join(fixturesDir, name)
    const core = validatePathContent({
      workspaceRoot: repoRoot,
      file,
      content: readFileSync(file, 'utf8'),
      kind: 'jsonl',
    })
    const cli = spawnSync(
      process.execPath,
      [join(repoRoot, 'scripts/mss/cli.mjs'), '--mode', 'file', '--file', file, '--json'],
      { encoding: 'utf8', cwd: repoRoot },
    )
    if (![0, 1].includes(cli.status)) return `cli spawn failed for ${name}: ${cli.stderr}`
    const parsed = JSON.parse(cli.stdout)
    if (core.codes.join('|') !== parsed.codes.join('|') || core.ok !== parsed.ok) {
      return `CLI/core parity mismatch on ${name}`
    }
  }
  return null
}

function testCounterexamplesAndStructure() {
  const failures = []
  const cases = []
  {
    const b = validBundle(); delete b[0].packages_loaded
    cases.push(['packages_loaded', b, RULE.VITAL_MISSING])
  }
  {
    const b = validBundle(); for (const r of b) if (r.record_type === 'annotation') r.finalization = 'draft'
    cases.push(['draft axes', b, RULE.FINAL_AXIS_NOT_FINAL])
  }
  {
    const b = validBundle(); delete b[3].annotation.assertions[0].product_candidate
    cases.push(['output product_candidate', b, RULE.PRODUCT_GATE])
  }
  {
    const b = validBundle()
    const second = sessionEvent({}, {
      record_id: 'mss-rec-0198b000-0001-7000-8000-000000000099',
      capture_key: `${b[0].session_id}/1/session_event/2`,
    })
    second.event.event_id = 'mss-evt-0198b000-0001-7000-8000-000000000099'
    cases.push(['two session_event', [b[0], second, ...b.slice(1)], RULE.SESSION_EVENT_COUNT])
  }
  {
    const b = validBundle(); b[0].recorded_by.tools_used = 'filesystem'
    cases.push(['tools_used structure', b, RULE.STRUCTURE_INVALID])
  }
  {
    const b = validBundle(); b[0].event.controls = [{ control_id: 'c', criterio: 'x', esito: 'pass', numeratore: 1, esecutore: 'a', evidence_refs: [] }]
    cases.push(['control denominator', b, RULE.VITAL_MISSING])
  }
  {
    const b = validBundle(); b[0].segment_no = 0
    cases.push(['segment_no', b, RULE.STRUCTURE_INVALID])
  }
  {
    const b = validBundle(); b[0].record_type = 'event'
    cases.push(['record_type enum', b, RULE.ENUM_INVALID])
  }
  {
    const b = validBundle(); b[0].annotation = axisPersona().annotation
    cases.push(['record payload mismatch', b, RULE.STRUCTURE_INVALID])
  }
  {
    const b = validBundle(); b[1].annotation.verification.verified_at = 'yesterday'
    cases.push(['verification timestamp', b, RULE.TIMESTAMP_INVALID])
  }
  {
    const b = validBundle(); b[0].event.privacy.capture_basis = 'non_applicabile'
    cases.push(['non_applicabile reason', b, RULE.NON_APPLICABILE_NO_REASON])
  }
  for (const [name, records, code] of cases) {
    const err = expectHas(validateRecords(records), code)
    if (err) failures.push(`${name}: ${err}`)
  }
  return failures
}

function independentlyVerifiedBundle() {
  const b = validBundle()
  b[1].annotation.verification = {
    status: 'independently_verified',
    verified_by: [{ actor_id: 'independent-reviewer' }],
    verified_at: '2026-08-10T10:10:00+02:00',
    criterion_ref: 'owner-contract',
    evidence_refs: ['source-contract'],
    notes: 'synthetic independent review',
  }
  return b
}

function testH12FinalizedReportCompatibility() {
  const failures = []
  const reports = [
    join(repoRoot, 'docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md'),
    join(repoRoot, 'docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md'),
  ]
  for (const file of reports) {
    const result = validatePathContent({
      workspaceRoot: repoRoot,
      file,
      content: readFileSync(file, 'utf8'),
      kind: 'report',
    })
    if (!result.ok) failures.push(`${basename(file)} respinto: ${result.denyCodes.join(',')}`)
  }
  return failures
}

function testH12CrossFileIdentity() {
  const failures = []
  const repos = []
  const baselinePath = `${SESSIONI}/10-08-26/Report-a.md`
  const stagedPath = `${SESSIONI}/10-08-26/Report-b.md`
  try {
    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, baselinePath, reportWithBundle(validBundle(), 'Baseline A'))
      const divergent = validBundle()
      divergent[0].event.observed_outcome = 'divergent cross-file content'
      writeTemp(root, stagedPath, reportWithBundle(divergent, 'Staged B'))

      const cli = spawnSync(
        process.execPath,
        [join(repoRoot, 'scripts/mss/cli.mjs'), '--mode', 'file', '--file', join(root, stagedPath), '--json'],
        { cwd: root, encoding: 'utf8' },
      )
      let cliResult
      try { cliResult = JSON.parse(cli.stdout || '{}') } catch { cliResult = {} }
      if (
        cli.status === 0 ||
        !cliResult.denyCodes?.includes(RULE.RECORD_ID_COLLISION) ||
        !cliResult.denyCodes?.includes(RULE.CAPTURE_KEY_COLLISION)
      ) {
        failures.push(`CLI non rileva collisione divergente: status=${cli.status} codes=${cliResult.codes?.join(',') || ''}`)
      }

      runGit(root, ['add', stagedPath])
      const result = precommitOutputs(root)
      if (
        result.first.status === 0 ||
        result.second.status === 0 ||
        !result.stderr.includes(RULE.RECORD_ID_COLLISION) ||
        !result.stderr.includes(RULE.CAPTURE_KEY_COLLISION)
      ) {
        failures.push(`pre-commit non rileva collisione divergente stabilmente: ${result.stderr}`)
      }
    }

    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, baselinePath, reportWithBundle(validBundle(), 'Baseline A'))
      writeTemp(root, stagedPath, reportWithBundle(validBundle(), 'Duplicato identico B'))
      runGit(root, ['add', stagedPath])
      const result = precommitOutputs(root)
      if (
        result.first.status === 0 ||
        result.second.status === 0 ||
        !result.stderr.includes('MSS-CROSS-FILE-DUPLICATE')
      ) {
        failures.push(`duplicato identico cross-file mascherato da retry: ${result.stderr}`)
      }
    }
  } finally {
    for (const root of repos) rmSync(root, { recursive: true, force: true })
  }
  return failures
}

function testH12FinalAmendmentTargetsFinal() {
  const first = amendment()
  first.finalization = 'draft'
  const second = amendment(first.record_id)
  second.record_id = 'mss-rec-0198b000-0001-7000-8000-000000000015'
  second.capture_key = `${IDS.ses}/1/amendment/2`
  second.created_at = '2026-08-10T10:06:00+02:00'
  second.amendment.amendment_id = 'mss-amd-0198b000-0001-7000-8000-000000000041'
  second.amendment.effective_at = '2026-08-10T10:06:00+02:00'
  const result = validateRecords([...validBundle(), first, second])
  return result.denyCodes.includes(RULE.AMENDMENT_TARGET_NOT_FINAL)
    ? []
    : [`amendment final verso target draft accettato: ${result.codes.join(',')}`]
}

function ownerRefAmendment({ recordId, amendmentId, ordinal, corrected, previous = 'owner-contract' }) {
  const record = amendment(IDS.recO)
  record.record_id = recordId
  record.capture_key = `${IDS.ses}/1/amendment/${ordinal}`
  record.amendment.amendment_id = amendmentId
  record.amendment.changes = [{
    field_path: 'annotation.assertions[0].owner_ref',
    previous_value_or_hash: previous,
    corrected_value: corrected,
  }]
  return record
}

/**
 * H13-POST-L01 — la riserva che teneva `H-1.3` in PASS_CON_RISERVE dal 10-08-26.
 *
 * Il difetto non era nel codice ma nel contratto: `previous_value_or_hash` si chiama «or_hash» e il
 * contratto non dichiarava quale delle due forme valesse, quindi due lettori potevano intenderlo
 * diversamente. `core.mjs` confronta `canonicalJson` su entrambi i lati: il campo è SEMPRE il valore.
 *
 * Il test prova la dichiarazione nelle due direzioni — il valore passa, il suo digest viene negato —
 * perché una sola delle due lascerebbe la porta aperta all'interpretazione che il contratto esclude.
 */
function testH13PreviousIsValueNotDigest() {
  const failures = []
  const previousValue = 'owner-contract'

  const withValue = ownerRefAmendment({
    recordId: 'mss-rec-0198b130-0001-7000-8000-000000000031',
    amendmentId: 'mss-amd-0198b130-0001-7000-8000-000000000051',
    ordinal: 9,
    corrected: 'source-contract',
    previous: previousValue,
  })
  const valueResult = validateRecords([...validBundle(), withValue])
  if (valueResult.denyCodes.includes(RULE.AMENDMENT_PREVIOUS_MISMATCH)) {
    failures.push(`H13-POST-L01: il valore nativo e stato negato; codes=${valueResult.denyCodes.join(',')}`)
  }

  const digest = createHash('sha256').update(previousValue).digest('hex')
  if (digest === previousValue) {
    failures.push('H13-POST-L01: test vacuo — il digest coincide con il valore')
  }
  const withDigest = ownerRefAmendment({
    recordId: 'mss-rec-0198b130-0001-7000-8000-000000000032',
    amendmentId: 'mss-amd-0198b130-0001-7000-8000-000000000052',
    ordinal: 10,
    corrected: 'source-contract',
    previous: digest,
  })
  const digestResult = validateRecords([...validBundle(), withDigest])
  if (!digestResult.denyCodes.includes(RULE.AMENDMENT_PREVIOUS_MISMATCH)) {
    failures.push(`H13-POST-L01: un digest sha256 e stato accettato come previous; codes=${digestResult.denyCodes.join(',')}`)
  }

  return failures
}

function testH13AmendmentSemantics() {
  const failures = []
  const good = ownerRefAmendment({
    recordId: 'mss-rec-0198b130-0001-7000-8000-000000000021',
    amendmentId: 'mss-amd-0198b130-0001-7000-8000-000000000041',
    ordinal: 2,
    corrected: 'source-contract',
  })
  const bad = ownerRefAmendment({
    recordId: 'mss-rec-0198b130-0001-7000-8000-000000000022',
    amendmentId: 'mss-amd-0198b130-0001-7000-8000-000000000042',
    ordinal: 3,
    corrected: 'owner-missing',
  })
  const forward = validateRecords([...validBundle(), good, bad])
  const reverse = validateRecords([...validBundle(), bad, good])
  for (const [name, result] of [['A->B', forward], ['B->A', reverse]]) {
    if (result.ok || !result.denyCodes.includes(RULE.AMENDMENT_CONFLICT)) {
      failures.push(`${name}: conflitto amendment non negato; codes=${result.denyCodes.join(',')}`)
    }
    if (result.denyCodes.includes(RULE.REF_ORPHAN)) {
      failures.push(`${name}: il conflitto ha prodotto una vista arbitraria; codes=${result.denyCodes.join(',')}`)
    }
  }
  if (JSON.stringify(forward.denyCodes) !== JSON.stringify(reverse.denyCodes)) {
    failures.push(`ordine fisico cambia i deny: forward=${forward.denyCodes.join(',')} reverse=${reverse.denyCodes.join(',')}`)
  }

  const wrongPrevious = ownerRefAmendment({
    recordId: 'mss-rec-0198b130-0001-7000-8000-000000000023',
    amendmentId: 'mss-amd-0198b130-0001-7000-8000-000000000043',
    ordinal: 4,
    corrected: 'source-contract',
    previous: 'owner-wrong',
  })
  const previousResult = validateRecords([...validBundle(), wrongPrevious])
  if (!previousResult.denyCodes.includes(RULE.AMENDMENT_PREVIOUS_MISMATCH)) {
    failures.push(`previous errato ignorato: ${previousResult.denyCodes.join(',')}`)
  }

  const historical = structuredClone(validBundle()[0])
  historical.record_id = 'mss-rec-0198b999-0001-7000-8000-000000000088'
  historical.capture_key = `${historical.session_id}/1/session_event/8`
  const historicalWrong = amendment(historical.record_id)
  historicalWrong.record_id = 'mss-rec-0198b130-0001-7000-8000-000000000025'
  historicalWrong.capture_key = `${IDS.ses}/1/amendment/6`
  historicalWrong.amendment.amendment_id = 'mss-amd-0198b130-0001-7000-8000-000000000045'
  historicalWrong.amendment.changes[0].previous_value_or_hash = 'definitely-wrong'
  const historicalWrongResult = validateRecords([...validBundle(), historicalWrong], {
    historicalRecords: [{ record: historical, file: '<HEAD>', line: 1 }],
  })
  if (!historicalWrongResult.denyCodes.includes(RULE.AMENDMENT_PREVIOUS_MISMATCH)) {
    failures.push(`previous storico errato fail-open: ${historicalWrongResult.denyCodes.join(',')}`)
  }

  const missingPath = amendment()
  missingPath.record_id = 'mss-rec-0198b130-0001-7000-8000-000000000026'
  missingPath.capture_key = `${IDS.ses}/1/amendment/7`
  missingPath.amendment.amendment_id = 'mss-amd-0198b130-0001-7000-8000-000000000046'
  missingPath.amendment.changes[0].field_path = 'event.field_that_does_not_exist'
  const missingPathResult = validateRecords([...validBundle(), missingPath])
  if (!missingPathResult.denyCodes.includes(RULE.AMENDMENT_FIELD_PATH_INVALID)) {
    failures.push(`field_path assente fail-open: ${missingPathResult.denyCodes.join(',')}`)
  }

  const malformedPath = amendment()
  malformedPath.record_id = 'mss-rec-0198b130-0001-7000-8000-000000000027'
  malformedPath.capture_key = `${IDS.ses}/1/amendment/8`
  malformedPath.amendment.amendment_id = 'mss-amd-0198b130-0001-7000-8000-000000000047'
  malformedPath.amendment.changes[0].field_path = 'not_a_contract_path'
  const malformedPathResult = validateRecords([...validBundle(), malformedPath])
  if (!malformedPathResult.denyCodes.includes(RULE.AMENDMENT_FIELD_PATH_INVALID)) {
    failures.push(`field_path malformato fail-open: ${malformedPathResult.denyCodes.join(',')}`)
  }

  const single = validateRecords([...validBundle(), good])
  if (!single.ok) failures.push(`amendment singolo valido respinto: ${single.denyCodes.join(',')}`)

  const supersedes = structuredClone(good)
  supersedes.record_id = 'mss-rec-0198b130-0001-7000-8000-000000000024'
  supersedes.capture_key = `${IDS.ses}/1/amendment/5`
  supersedes.amendment.amendment_id = 'mss-amd-0198b130-0001-7000-8000-000000000044'
  supersedes.amendment.relation = 'supersedes'
  const supersedesResult = validateRecords([...validBundle(), supersedes])
  if (!supersedesResult.denyCodes.includes(RULE.AMENDMENT_SUPERSEDES_UNSUPPORTED)) {
    failures.push(`supersedes senza payload deterministico accettato: ${supersedesResult.denyCodes.join(',')}`)
  }
  return failures
}

function testH12SupplementalRelations() {
  const manifest = JSON.parse(readFileSync(join(fixturesDir, 'manifest.json'), 'utf8'))
  manifest.supplemental.find((entry) => entry.id === 'FX-V02-light').representation_of = 'FX-WRONG'
  const content = `${JSON.stringify(manifest, null, 2)}\n`
  const result = validateStagedMssFiles(repoRoot, [{
    path: 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json',
    content,
    worktreeContent: content,
  }])[0]?.result
  return result?.denyCodes.includes(RULE.FIXTURE_PROTOCOL)
    ? []
    : [`representation_of FX-V02-light non protetta: ${result?.codes?.join(',') || ''}`]
}

function testH12ManifestSnapshotTrust() {
  const failures = []
  const repos = []
  const manifestPath = 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json'
  const fixturePath = 'docs/MetaSkillSystem/fixtures/v0.1/FX-NEW-worktree-only.jsonl'
  const manifest = JSON.parse(readFileSync(join(fixturesDir, 'manifest.json'), 'utf8'))
  const changed = structuredClone(manifest)
  changed.supplemental.push({
    id: 'FX-NEW-worktree-only', expect: 'pass', file: 'FX-NEW-worktree-only.jsonl', kind: 'jsonl',
  })
  try {
    {
      const root = createTempGitRepo(); repos.push(root)
      writeFixtureReferenceOwner(root)
      writeFixtureTree(root)
      runGit(root, ['add', '.'])
      const baseline = runGit(root, ['commit', '-q', '-m', 'manifest baseline'])
      if (baseline.status !== 0) throw new Error(baseline.stderr || baseline.stdout)
      writeTemp(root, manifestPath, `${JSON.stringify(changed, null, 2)}\n`)
      writeTemp(root, fixturePath, toJsonl(validBundle()))
      runGit(root, ['add', fixturePath])
      const result = precommitOutputs(root)
      if (result.second.status === 0 || !result.stderr.includes(RULE.FIXTURE_UNDECLARED)) {
        failures.push(`manifest worktree ha influenzato lo staged con HEAD esistente: ${result.stderr}`)
      }
    }
    {
      const root = createTempGitRepo(); repos.push(root)
      writeFixtureReferenceOwner(root)
      writeTemp(root, manifestPath, `${JSON.stringify(changed, null, 2)}\n`)
      writeTemp(root, fixturePath, toJsonl(validBundle()))
      runGit(root, ['add', fixturePath, 'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md'])
      const result = runPrecommit(root)
      if (result.status === 0 || !result.stderr.includes(RULE.FIXTURE_PROTOCOL)) {
        failures.push(`repository unborn non richiede manifest staged: ${result.stderr}`)
      }
    }
  } finally {
    for (const root of repos) rmSync(root, { recursive: true, force: true })
  }
  return failures
}

function testH13ManifestLifecycleAndRelations() {
  const failures = []
  const repos = []
  const manifestPath = 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json'
  const snapshots = fixtureHeadSnapshots()
  const manifestText = readFileSync(join(fixturesDir, 'manifest.json'), 'utf8')
  const manifest = JSON.parse(manifestText)
  const stagedFixturePath = 'docs/MetaSkillSystem/fixtures/v0.1/FX-S01-missing-axis.jsonl'
  const stagedFixture = readFileSync(join(fixturesDir, 'FX-S01-missing-axis.jsonl'))
  const resultForManifest = (entries, history = snapshots) => validateStagedMssFiles(
    repoRoot,
    entries,
    { historicalSnapshots: history },
  ).find((entry) => entry.path === manifestPath)?.result

  const untouched = validateStagedMssFiles(repoRoot, [{
    status: 'M', path: stagedFixturePath, content: stagedFixture, worktreeContent: stagedFixture,
  }], { historicalSnapshots: snapshots })
  if (untouched.some((entry) => !entry.result.ok)) {
    failures.push(`manifest HEAD untouched non usato come fallback: ${untouched.flatMap((entry) => entry.result.denyCodes).join(',')}`)
  }

  const modifiedText = `${JSON.stringify(manifest)}\n`
  const modified = resultForManifest([{
    status: 'M', path: manifestPath, content: modifiedText, worktreeContent: modifiedText,
  }])
  if (!modified?.ok) failures.push(`manifest staged modificato valido respinto: ${modified?.denyCodes.join(',') || ''}`)

  const deleted = resultForManifest([{
    status: 'D', path: manifestPath, content: null, headContent: manifestText, worktreeContent: null,
  }])
  if (!deleted?.denyCodes.includes(RULE.FIXTURE_PROTOCOL)) {
    failures.push(`cancellazione staged manifest accettata: ${deleted?.denyCodes.join(',') || ''}`)
  }

  const renamed = validateStagedMssFiles(repoRoot, [{
    status: 'R',
    previousPath: manifestPath,
    path: 'docs/MetaSkillSystem/fixtures/v0.1/manifest-renamed.json',
    content: manifestText,
    headContent: manifestText,
    worktreeContent: manifestText,
  }], { historicalSnapshots: snapshots })[0]?.result
  if (!renamed?.denyCodes.includes(RULE.FIXTURE_PROTOCOL)) {
    failures.push(`rename staged manifest accettato: ${renamed?.denyCodes.join(',') || ''}`)
  }

  const unbornWithoutManifest = validateStagedMssFiles(repoRoot, [{
    status: 'A', path: stagedFixturePath, content: stagedFixture, worktreeContent: stagedFixture,
  }], { historicalSnapshots: [] })[0]?.result
  if (!unbornWithoutManifest?.denyCodes.includes(RULE.FIXTURE_PROTOCOL)) {
    failures.push(`repository unborn senza manifest staged accettato: ${unbornWithoutManifest?.denyCodes.join(',') || ''}`)
  }

  const unbornEntries = snapshots.map((snapshot) => ({
    status: 'A', path: snapshot.path, content: snapshot.content, worktreeContent: snapshot.content,
  }))
  const unbornWithManifest = validateStagedMssFiles(repoRoot, unbornEntries, { historicalSnapshots: [] })
  if (unbornWithManifest.some((entry) => !entry.result.ok)) {
    failures.push(`repository unborn con manifest+fixture staged respinto: ${unbornWithManifest.flatMap((entry) => entry.result.denyCodes).join(',')}`)
  }

  const validRelation = structuredClone(manifest)
  validRelation.supplemental.find((entry) => entry.id === 'FX-S01').representation_of = 'FX-V01'
  const validRelationText = `${JSON.stringify(validRelation)}\n`
  const validRelationResult = resultForManifest([{
    status: 'M', path: manifestPath, content: validRelationText, worktreeContent: validRelationText,
  }])
  if (!validRelationResult?.ok) {
    failures.push(`representation_of generale valida respinta: ${validRelationResult?.denyCodes.join(',') || ''}`)
  }

  const phantomTarget = structuredClone(manifest)
  phantomTarget.supplemental.find((entry) => entry.id === 'FX-S01').representation_of = 'FX-NOT-REAL'
  const phantomTargetText = `${JSON.stringify(phantomTarget)}\n`
  const phantomTargetResult = resultForManifest([{
    status: 'M', path: manifestPath, content: phantomTargetText, worktreeContent: phantomTargetText,
  }])
  if (!phantomTargetResult?.denyCodes.includes(RULE.FIXTURE_PROTOCOL)) {
    failures.push(`representation_of verso target inesistente accettata: ${phantomTargetResult?.denyCodes.join(',') || ''}`)
  }

  const phantomFile = structuredClone(manifest)
  phantomFile.supplemental.find((entry) => entry.id === 'FX-S01').file = 'FX-NOT-REAL.jsonl'
  const phantomFileText = `${JSON.stringify(phantomFile)}\n`
  const phantomFileResult = resultForManifest([{
    status: 'M', path: manifestPath, content: phantomFileText, worktreeContent: phantomFileText,
  }])
  if (!phantomFileResult?.denyCodes.includes(RULE.FIXTURE_PROTOCOL)) {
    failures.push(`file supplemental inesistente accettato: ${phantomFileResult?.denyCodes.join(',') || ''}`)
  }

  try {
    const root = createTempGitRepo(); repos.push(root)
    writeFixtureTree(root)
    runGit(root, ['add', '.'])
    const baseline = runGit(root, ['commit', '-q', '-m', 'manifest baseline'])
    if (baseline.status !== 0) throw new Error(baseline.stderr || baseline.stdout)
    const removed = runGit(root, ['rm', '-q', manifestPath])
    if (removed.status !== 0) throw new Error(removed.stderr || removed.stdout)
    const precommit = precommitOutputs(root)
    if (precommit.second.status === 0 || !precommit.stderr.includes(RULE.FIXTURE_PROTOCOL)) {
      failures.push(`pre-commit accetta cancellazione manifest: ${precommit.stderr}`)
    }
  } finally {
    for (const root of repos) rmSync(root, { recursive: true, force: true })
  }
  return failures
}

function testH12SemanticDomainsAndUtf8() {
  const failures = []
  {
    const bundle = validBundle()
    bundle[1].annotation.delta = 'banana'
    const result = validateRecords(bundle)
    if (!result.denyCodes.includes('MSS-ANNOTATION-DELTA-INVALID')) {
      failures.push(`annotation.delta fuori dominio accettato: ${result.codes.join(',')}`)
    }
  }
  {
    const bundle = validBundle()
    bundle[1].annotation.verification.criterion_ref = 'missing-criterion-ref'
    const result = validateRecords(bundle)
    if (!result.denyCodes.includes(RULE.REF_ORPHAN)) {
      failures.push(`criterion_ref orfano accettato: ${result.codes.join(',')}`)
    }
  }
  {
    const source = Buffer.from(toJsonl(validBundle()), 'utf8')
    const invalid = Buffer.concat([source.subarray(0, 8), Buffer.from([0xc3, 0x28]), source.subarray(8)])
    const result = validatePathContent({
      workspaceRoot: repoRoot,
      file: '<invalid-utf8>',
      content: invalid,
      kind: 'jsonl',
    })
    if (!result.denyCodes.includes('MSS-UTF8-INVALID')) {
      failures.push(`UTF-8 invalido non respinto al confine: ${result.codes.join(',')}`)
    }
  }
  return failures
}

function testH12ModeGrammar() {
  const failures = []
  const cases = [
    ['narrativa', '# Report\n\nNota sulla modalità: deep\n', true, null],
    ['malformata', '# Report\n\n**Modalità** deep\n', false, RULE.REPORT_MODE_INVALID],
    ['code fence', '# Report\n\n```text\n**Modalità:** deep\n```\n', true, null],
    ['commento', '# Report\n\n<!-- **Modalità:** deep -->\n', true, null],
    ['canonica', '# Report\n\n**Data:** 10-08-26 · **Modalità:** deep · **Tipo:** synthetic\n', false, RULE.REPORT_NO_CAPSULE],
    ['contraddittoria', '# Report\n\n**Modalità:** deep\n**Modalità:** light\n', false, RULE.REPORT_MODE_INVALID],
  ]
  for (const [name, content, expectedOk, code] of cases) {
    const result = validateMss(
      { kind: 'report', file: `<mode-grammar:${name}>`, content, workspaceRoot: repoRoot },
      { workspaceRoot: repoRoot },
    )
    if (result.ok !== expectedOk || (code && !result.denyCodes.includes(code))) {
      failures.push(`${name}: expected ok=${expectedOk} code=${code || 'none'}; codes=${result.codes.join(',')}`)
    }
  }
  return failures
}

function testH13HistoricalModeScopeAndArchitecture() {
  const failures = []
  const historicalPath = join(
    repoRoot,
    'docs/Sessioni di lavoro/09-08-26/Report-ciclo-metaskillsystem-v0-avvio-e-cattura-09-08-26.md',
  )
  const historical = readFileSync(historicalPath, 'utf8')
  const historicalHash = createHash('sha256').update(historical, 'utf8').digest('hex')
  if (historicalHash !== 'dc0f2cdb92627cf5cec757188178aa33d0ea8b35cd527c35d29126cd721b08a0') {
    failures.push(`hash report storico inatteso: ${historicalHash}`)
  } else {
    const result = validatePathContent({
      workspaceRoot: repoRoot,
      file: historicalPath,
      content: historical,
      kind: 'report',
    })
    if (!result.ok) failures.push(`report storico reale respinto: ${result.denyCodes.join(',')}`)
  }

  const legacyMode = '**Modalità:** Meta/deep, esecuzione documentale'
  const arbitrary = reportWithBundle(validBundle(), 'Nuovo report non storico').replace(
    '**Modalità:** standard',
    legacyMode,
  )
  const arbitraryResult = validateMss({
    kind: 'report',
    file: join(repoRoot, `${SESSIONI}/10-08-26/Report-nuovo-legacy.md`),
    content: arbitrary,
    workspaceRoot: repoRoot,
  }, { workspaceRoot: repoRoot })
  if (!arbitraryResult.denyCodes.includes(RULE.REPORT_MODE_INVALID)) {
    failures.push(`nuovo report con frase legacy accettato: ${arbitraryResult.denyCodes.join(',')}`)
  }

  const copiedHistorical = validateMss({
    kind: 'report',
    file: join(repoRoot, `${SESSIONI}/10-08-26/Report-copia-storica.md`),
    content: historical,
    workspaceRoot: repoRoot,
  }, { workspaceRoot: repoRoot })
  if (!copiedHistorical.denyCodes.includes(RULE.REPORT_MODE_INVALID)) {
    failures.push(`copia byte-identica del report storico accettata su altro path: ${copiedHistorical.denyCodes.join(',')}`)
  }

  for (const mode of ['light', 'standard', 'deep', 'Meta/deep']) {
    const content = reportWithBundle(validBundle(), `Mode ${mode}`).replace('**Modalità:** standard', `**Modalità:** ${mode}`)
    const result = validateMss({ kind: 'report', file: `<contract-mode:${mode}>`, content, workspaceRoot: repoRoot }, { workspaceRoot: repoRoot })
    if (!result.ok) failures.push(`modalità contrattuale ${mode} respinta: ${result.denyCodes.join(',')}`)
  }
  for (const mode of ['legacy', 'Meta/deep, extra', 'deep standard']) {
    const content = reportWithBundle(validBundle(), `Invalid mode ${mode}`).replace('**Modalità:** standard', `**Modalità:** ${mode}`)
    const result = validateMss({ kind: 'report', file: `<invalid-mode:${mode}>`, content, workspaceRoot: repoRoot }, { workspaceRoot: repoRoot })
    if (!result.denyCodes.includes(RULE.REPORT_MODE_INVALID)) {
      failures.push(`modalità non contrattuale ${mode} accettata: ${result.denyCodes.join(',')}`)
    }
  }

  const scriptsDir = join(repoRoot, 'scripts/mss')
  const graph = new Map()
  for (const file of readdirSync(scriptsDir).filter((name) => name.endsWith('.mjs')).sort()) {
    const deps = []
    const source = readFileSync(join(scriptsDir, file), 'utf8')
    for (const match of source.matchAll(/(?:import|export)\s+(?:[^'"]+?\s+from\s+)?['"]\.\/(.+?\.mjs)['"]/g)) {
      deps.push(match[1])
    }
    graph.set(file, deps)
  }
  const visiting = new Set()
  const visited = new Set()
  const hasCycle = (file) => {
    if (visiting.has(file)) return true
    if (visited.has(file)) return false
    visiting.add(file)
    for (const dependency of graph.get(file) || []) if (hasCycle(dependency)) return true
    visiting.delete(file)
    visited.add(file)
    return false
  }
  if ([...graph.keys()].some(hasCycle)) failures.push('import graph scripts/mss contiene un ciclo')

  const entries = validBundle().map((record, index) => ({ record, file: '<determinism>', line: index + 1 }))
  const appendA = validateAppendOnlyRecords({ headEntries: entries, stagedEntries: entries })
  const appendB = validateAppendOnlyRecords({ headEntries: entries, stagedEntries: entries })
  const globalA = validateGlobalRecordView(entries)
  const globalB = validateGlobalRecordView(entries)
  if (JSON.stringify(appendA) !== JSON.stringify(appendB)) failures.push('helper append-only non deterministico')
  if (JSON.stringify(globalA) !== JSON.stringify(globalB)) failures.push('helper global-view non deterministico')
  return failures
}

function testH13HistoricalRecordAndFixtureImmutability() {
  const failures = []
  const expectedOriginHashes = new Map([
    ['mss-rec-019fe840-fa43-782f-a111-f08584e81fbf', 'c20c6decabb5d5c08952d7253ecdb9b442246f0d0c70a10b943e43f13c894821'],
    ['mss-rec-019fe840-fa43-72db-b96a-24e701c8682e', '3b553b3c6a53b764abdea12dc8a86aeb594b5572a58612403281ed675f36451e'],
    ['mss-rec-019fe840-fa43-7c92-9270-370c4beae5e9', '44e3df380e19318346f9cd365ec03abdd80337b19f2171dfa6fb233293543b90'],
    ['mss-rec-019fe840-fa43-70ec-8156-8c6912786daf', '6b77e9fd723bc8fa3870f668fabd3f2d06e23ca8be628e656ddae4bef33609fb'],
    ['mss-rec-0198b111-0001-7000-8000-000000000010', '5d0d3bf05417631b5ff3b9cfacf46cad832d94bfc0cae3d546801eaae1d14a0c'],
    ['mss-rec-0198b111-0001-7000-8000-000000000011', '3c275885ffaaf1dbb2c6c43cd1bf9373da826af4f26b011f9d85d1a8360f3d12'],
    ['mss-rec-0198b111-0001-7000-8000-000000000012', '25298b4c6b210abb444d3f8274f96b1137eeef58a51f9bcbf27d913ba18252ea'],
    ['mss-rec-0198b111-0001-7000-8000-000000000013', 'c6a61ac95a30da1f0c873933829395341093e5f6845d7d5d5bc6211ff0a1bc0b'],
  ])
  const reportPaths = [
    'docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md',
    'docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md',
  ]
  const records = []
  for (const relativePath of reportPaths) {
    const file = join(repoRoot, relativePath)
    const extracted = extractCapsulesFromMarkdown(readFileSync(file, 'utf8'), file)
    for (const bundle of extracted.bundles) records.push(...bundle.records.map((entry) => entry.record))
  }
  const origin = records.filter((record) => record.record_type !== 'amendment')
  if (origin.length !== 8) failures.push(`record origine attesi=8 osservati=${origin.length}`)
  for (const record of origin) {
    const expected = expectedOriginHashes.get(record.record_id)
    const observed = createHash('sha256').update(canonicalJson(record)).digest('hex')
    if (!expected) failures.push(`record origine inatteso: ${record.record_id}`)
    if (expected && observed !== expected) failures.push(`hash origine mutato: ${record.record_id}`)
  }
  for (const id of expectedOriginHashes.keys()) {
    if (!origin.some((record) => record.record_id === id)) failures.push(`record origine mancante: ${id}`)
  }
  const amendments = records.filter((record) => record.record_type === 'amendment')
  if (
    amendments.length !== 1 ||
    amendments[0]?.record_id !== 'mss-rec-0198b112-0001-7000-8000-000000000014' ||
    amendments[0]?.finalization !== 'final' ||
    amendments[0]?.amendment?.relation !== 'amends' ||
    amendments[0]?.amendment?.target_record_id !== 'mss-rec-019fe840-fa43-70ec-8156-8c6912786daf'
  ) {
    failures.push('amendment storico non è unico/final/valido sul target atteso')
  }

  const manifest = loadManifest()
  if (manifest.frozen.length !== 14) failures.push(`fixture frozen attese=14 osservate=${manifest.frozen.length}`)
  for (const declaration of manifest.frozen) {
    const observed = createHash('sha256').update(readFileSync(join(fixturesDir, declaration.file))).digest('hex')
    if (observed !== declaration.content_sha256) failures.push(`hash frozen mutato: ${declaration.id}`)
  }
  const support = manifest.frozen.find((entry) => entry.id === 'FX-V02')?.support_files?.[0]
  const supportHash = support && createHash('sha256').update(readFileSync(join(fixturesDir, support.file))).digest('hex')
  if (!support || supportHash !== support.content_sha256) failures.push('support fixture FX-V02-light mutata')
  return failures
}

function testH12ScopedReportWhitespace() {
  const files = [
    join(repoRoot, 'docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md'),
    join(repoRoot, 'docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md'),
  ]
  const offenders = []
  for (const file of files) {
    readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, index) => {
      if (/[ \t]+$/.test(line)) offenders.push(`${basename(file)}:${index + 1}`)
    })
  }
  return offenders.length ? [`trailing whitespace: ${offenders.join(',')}`] : []
}

function testVerifierSeparations() {
  const failures = []
  const positive = validateRecords(independentlyVerifiedBundle())
  if (!positive.ok) failures.push(`positive distinct verifier denied: ${positive.denyCodes.join(',')}`)
  const mutations = [
    ['record author', (b) => { b[1].recorded_by.actor_id = 'independent-reviewer' }],
    ['asserted_by', (b) => { b[1].annotation.asserted_by.actor_id = 'independent-reviewer' }],
    ['subject_runtime', (b) => { b[0].event.subject_runtime.actor_id = 'independent-reviewer' }],
    ['declaration subject', (b) => { b[1].annotation.assertions[0].actor = 'independent-reviewer' }],
  ]
  for (const [name, mutate] of mutations) {
    const b = independentlyVerifiedBundle(); mutate(b)
    const err = expectHas(validateRecords(b), RULE.VERIFIER_NOT_INDEPENDENT)
    if (err) failures.push(`${name}: ${err}`)
  }
  return failures
}

function testProductSemantics() {
  const failures = []
  const mutations = [
    ['missing candidate', (pc, assertion) => { delete assertion.product_candidate }],
    ['eligible with fail', (pc) => { pc.result = 'eligible' }],
    ['not_eligible all pass', (pc) => { for (const key of Object.keys(pc)) if (key !== 'result') pc[key] = 'pass'; pc.result = 'not_eligible' }],
    ['noncanonical gate', (pc) => { pc.recipient = 'ok' }],
  ]
  for (const [name, mutate] of mutations) {
    const b = validBundle()
    const assertion = b[3].annotation.assertions[0]
    mutate(assertion.product_candidate, assertion)
    const err = expectHas(validateRecords(b), RULE.PRODUCT_GATE)
    if (err) failures.push(`${name}: ${err}`)
  }
  return failures
}

function testH11SemanticCounterexamples() {
  const failures = []
  const cases = [
    ['persona assertion vuota', (b) => { b[1].annotation.assertions = [{}] }, 'MSS-PERSONA-ASSERTION'],
    ['sistema assertion vuota', (b) => { b[2].annotation.assertions = [{}] }, 'MSS-SYSTEM-ASSERTION'],
    ['sistema senza G/O/E', (b) => {
      delete b[2].annotation.assertions[0].G
      delete b[2].annotation.assertions[0].O
      delete b[2].annotation.assertions[0].E
    }, 'MSS-SYSTEM-ASSERTION'],
    ['output solo product_candidate', (b) => {
      b[3].annotation.assertions = [{ product_candidate: b[3].annotation.assertions[0].product_candidate }]
    }, 'MSS-OUTPUT-ASSERTION'],
    ['controllo denominatore non numerico', (b) => {
      b[0].event.controls = [{
        control_id: 'counterexample', criterio: 'synthetic', esito: 'pass', numeratore: 1,
        denominatore: 'uno', esecutore: 'fixture-agent', evidence_refs: ['source-contract'],
      }]
    }, 'MSS-CONTROL-RATIO'],
    ['source_ref orfano', (b) => {
      b[1].annotation.assertions[0].source_ref = 'source-missing'
    }, 'MSS-REF-ORPHAN'],
    ['schema/revisione incrociata', (b) => {
      b[0].schema_version = 'mss.session/0.1.1'
      b[0].system_revision = 'mss-v0.1-wp0.1-freeze-1'
    }, 'MSS-SCHEMA-REVISION-INCOMPATIBLE'],
  ]
  for (const [name, mutate, code] of cases) {
    const bundle = validBundle()
    mutate(bundle)
    const result = validateRecords(bundle)
    if (!result.denyCodes.includes(code)) {
      failures.push(`${name}: accepted; expected ${code}; codes=${result.codes.join(',')}`)
    }
  }
  return failures
}

function testH11ReportModes() {
  const failures = []
  for (const value of ['light standard', 'banana']) {
    const content = `# Counterexample\n\n**Modalità:** ${value}\n\nNo capsule.`
    const result = validateMss(
      { kind: 'report', file: `<mode:${value}>`, content, workspaceRoot: repoRoot },
      { workspaceRoot: repoRoot },
    )
    if (!result.denyCodes.includes('MSS-REPORT-MODE-INVALID')) {
      failures.push(`modalità ${value}: accepted; codes=${result.codes.join(',')}`)
    }
  }
  return failures
}

function testH11HistoricalAmendment() {
  const failures = []
  const historical = structuredClone(validBundle()[0])
  historical.record_id = 'mss-rec-0198b000-0001-7000-8000-000000000088'
  historical.capture_key = `${historical.session_id}/1/session_event/8`
  const bundle = [...validBundle(), amendment(historical.record_id)]
  const valid = validateRecords(bundle, {
    historicalRecords: [{ record: historical, file: '<history>', line: 1 }],
  })
  if (!valid.ok) failures.push(`target storico risolvibile respinto: ${valid.denyCodes.join(',')}`)

  const wrongPrevious = structuredClone(amendment(historical.record_id))
  wrongPrevious.record_id = 'mss-rec-0198b000-0001-7000-8000-000000000089'
  wrongPrevious.capture_key = `${IDS.ses}/1/amendment/9`
  wrongPrevious.amendment.amendment_id = 'mss-amd-0198b000-0001-7000-8000-000000000049'
  wrongPrevious.amendment.changes[0].previous_value_or_hash = 'definitely-wrong'
  const historicalWrong = validateRecords([...validBundle(), wrongPrevious], {
    historicalRecords: [{ record: historical, file: '<history>', line: 1 }],
  })
  if (!historicalWrong.denyCodes.includes(RULE.AMENDMENT_PREVIOUS_MISMATCH)) {
    failures.push(`previous storico errato accettato: ${historicalWrong.codes.join(',')}`)
  }

  const missing = validateRecords(bundle, { historicalRecords: [] })
  if (!missing.denyCodes.includes(RULE.AMENDMENT_ORPHAN)) {
    failures.push(`target storico inesistente accettato: ${missing.codes.join(',')}`)
  }

  const conflicting = structuredClone(historical)
  conflicting.event.observed_outcome = 'different canonical history'
  const ambiguous = validateRecords(bundle, {
    historicalRecords: [
      { record: historical, file: '<history-a>', line: 1 },
      { record: conflicting, file: '<history-b>', line: 1 },
    ],
  })
  if (!ambiguous.denyCodes.includes('MSS-AMENDMENT-TARGET-AMBIGUOUS')) {
    failures.push(`target storico ambiguo accettato: ${ambiguous.codes.join(',')}`)
  }

  const draft = structuredClone(historical)
  draft.finalization = 'draft'
  const notFinal = validateRecords(bundle, { historicalRecords: [{ record: draft, file: '<draft>', line: 1 }] })
  if (!notFinal.denyCodes.includes('MSS-AMENDMENT-TARGET-NOT-FINAL')) {
    failures.push(`target storico non final accettato: ${notFinal.codes.join(',')}`)
  }

  const currentAmendment = amendment(historical.record_id)
  const historicalAmendment = amendment(currentAmendment.record_id)
  historicalAmendment.record_id = historical.record_id
  historicalAmendment.capture_key = `${historicalAmendment.session_id}/1/amendment/8`
  const cyclic = validateRecords([...validBundle(), currentAmendment], {
    historicalRecords: [{ record: historicalAmendment, file: '<cyclic-history>', line: 1 }],
  })
  if (!cyclic.denyCodes.includes(RULE.AMENDMENT_CYCLE)) {
    failures.push(`ciclo verso storia risolvibile accettato: ${cyclic.codes.join(',')}`)
  }
  return failures
}

function reportQrs() {
  return `\n## Domande di chiusura\n\n❓ Q1 — Prompt?\n✅ R1: synthetic prompt.\n\n❓ Q2 — Dati?\n✅ R2: synthetic data.\n\n❓ Q3 — File?\n✅ R3: synthetic file.\n\n❓ Q4 — Non fatto?\n✅ R4: no external action.\n\n❓ Q5 — Attrito?\n✅ R5: nessuna osservazione synthetic.\n\n❓ Q6 — Contesto?\n✅ R6: contesto sufficiente synthetic.\n`
}

function testReportParserModes() {
  const failures = []
  const capsule = toJsonl(validBundle()).trim()
  const foreign = `# Report\n\n**Modalità:** standard\n\n\`\`\`jsonl\n{"foreign":true}\n\`\`\`\n\n## 6. Capsula MetaSkillSystem\n\n\`\`\`jsonl\n${capsule}\n\`\`\``
  const foreignResult = validateMss({ kind: 'report', file: '<foreign-fence>', content: foreign, workspaceRoot: repoRoot }, { workspaceRoot: repoRoot })
  if (!foreignResult.ok) failures.push(`foreign fence captured as capsule: ${foreignResult.denyCodes.join(',')}`)
  const multiple = `# Report\n\n## Capsula MetaSkillSystem\n\n\`\`\`jsonl\n${capsule}\n\`\`\`\n\n## Capsula MetaSkillSystem\n\n\`\`\`jsonl\n${capsule}\n\`\`\``
  const multipleResult = validateMss({ kind: 'report', file: '<multiple-capsules>', content: multiple, workspaceRoot: repoRoot }, { workspaceRoot: repoRoot })
  if (!multipleResult.codes.includes(RULE.PARSE_JSONL_AMBIGUOUS)) failures.push('multiple capsule sections not rejected')
  for (const [mode, shouldPass] of [['standard', false], ['deep', false], ['light', true], ['legacy', false]]) {
    const content = `# Report\n\n**Modalità:** ${mode}\n\nNo capsule.`
    const result = validateMss({ kind: 'report', file: `<mode:${mode}>`, content, workspaceRoot: repoRoot }, { workspaceRoot: repoRoot })
    if (result.ok !== shouldPass) failures.push(`mode ${mode}: expected ok=${shouldPass}; codes=${result.codes.join(',')}`)
  }
  const standardLogRow = '| 09-08-26 | Standard · `event:mss-evt-0198b000-0001-7000-8000-000000000020` | [Report](Report-standard.md) |'
  const logResult = validateMss(
    { kind: 'session_log', file: join(repoRoot, 'docs/SESSION_LOG.md'), content: standardLogRow, workspaceRoot: repoRoot },
    { workspaceRoot: repoRoot },
  )
  if (!logResult.ok) failures.push(`standard SESSION_LOG row mistaken for light: ${logResult.codes.join(',')}`)
  return failures
}

function testReferenceSecurity() {
  const failures = []
  for (const [name, ref] of [
    ['absolute', join(repoRoot, 'docs/MetaSkillSystem/PLAN_V0.md')],
    ['traversal', '../CalendarBackup-v2/docs/MetaSkillSystem/PLAN_V0.md'],
    ['unknown scheme', 'https://example.invalid/ref'],
  ]) {
    const result = resolveRef(ref, { workspaceRoot: repoRoot, fieldPath: name })
    if (result.ok || result.rule !== RULE.REF_TRAVERSAL) failures.push(`${name} path not rejected safely`)
  }
  const logical = resolveRef('conversation:turn-1', { workspaceRoot: repoRoot })
  if (!logical.ok) failures.push('allowlisted logical ref rejected')

  const external = mkdtempSync(join(tmpdir(), 'mss-external-'))
  const inside = mkdtempSync(join(repoRoot, '.mss-path-test-'))
  try {
    writeFileSync(join(external, 'proof.md'), 'outside', 'utf8')
    const junction = join(inside, 'intermediate')
    symlinkSync(external, junction, 'junction')
    const rel = `${basename(inside)}/intermediate/proof.md`
    const result = resolveRef(rel, { workspaceRoot: repoRoot })
    if (result.ok || result.rule !== RULE.REF_TRAVERSAL) failures.push('intermediate symlink escape not rejected')
  } catch (error) {
    failures.push(`intermediate symlink test could not run: ${error.message}`)
  } finally {
    rmSync(inside, { recursive: true, force: true })
    rmSync(external, { recursive: true, force: true })
  }
  return failures
}

function testLockSemantics() {
  const failures = []
  const cases = [
    ['authorized write', 'modify LOCK file', { read: [], write: ['LOCK file'], forbid: [] }, false],
    ['forbidden write', 'modify LOCK file', { read: [], write: [], forbid: ['LOCK file'] }, true],
    ['undeclared target', 'modify LOCK file', { read: [], write: [], forbid: [] }, true],
    ['authorized read', 'review LOCK file', { read: ['LOCK file'], write: [], forbid: [] }, false],
    ['lexical mention only', 'LOCK is a governance concept', { read: [], write: [], forbid: [] }, false],
  ]
  for (const [name, intent, authorization, expectWarn] of cases) {
    const b = validBundle(); b[0].event.intent_user = intent; b[0].event.authorization = authorization
    const result = validateRecords(b)
    const warned = result.warnCodes.includes(RULE.LOCK_UNAUTHORIZED)
    if (warned !== expectWarn) failures.push(`${name}: expected warn=${expectWarn}; codes=${result.codes.join(',')}`)
  }
  return failures
}

function testAdapterContract() {
  const failures = []
  const manifest = readFileSync(join(fixturesDir, 'manifest.json'), 'utf8')
  const negative = readFileSync(join(fixturesDir, 'FX-I01-schema.jsonl'), 'utf8')
  const valid = readFileSync(join(fixturesDir, 'FX-V01-bundle.jsonl'), 'utf8')
  const invalid = readFileSync(join(fixturesDir, 'FX-I01-schema.jsonl'), 'utf8')
  const entries = [
    { path: 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json', content: manifest, worktreeContent: manifest },
    { path: 'docs/MetaSkillSystem/fixtures/v0.1/FX-I01-schema.jsonl', content: negative, worktreeContent: negative },
    { path: `${SESSIONI}/10-08-26/eventi-light/operational.jsonl`, content: invalid, worktreeContent: invalid },
    { path: `${SESSIONI}/10-08-26/Report-invalid.md`, content: `# Invalid\n\n**Modalità:** standard\n${reportQrs()}`, worktreeContent: `# Invalid\n\n**Modalità:** standard\n${reportQrs()}` },
    { path: `${SESSIONI}/10-08-26/eventi-light/mismatch.jsonl`, content: valid, worktreeContent: invalid },
  ]
  const results = new Map(validateStagedMssFiles(repoRoot, entries, {
    historicalSnapshots: fixtureHeadSnapshots(),
  }).map((x) => [x.path, x.result]))
  if (!results.get(entries[1].path)?.ok) failures.push('declared negative fixture is not committable')
  if (results.get(entries[2].path)?.ok) failures.push('invalid operational JSONL was allowed')
  if (!results.get(entries[2].path)?.denyCodes.includes(RULE.SCHEMA_UNKNOWN)) failures.push('operational JSONL missing schema deny')
  if (!results.get(entries[3].path)?.denyCodes.includes(RULE.REPORT_NO_CAPSULE)) failures.push('standard report without capsule was allowed')
  if (!results.get(entries[4].path)?.denyCodes.includes(RULE.STAGED_WORKTREE_MISMATCH)) failures.push('staged/worktree mismatch was allowed')
  const manifestMismatch = validateStagedMssFiles(repoRoot, [
    { path: 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json', content: manifest, worktreeContent: `${manifest}\n` },
  ], { historicalSnapshots: fixtureHeadSnapshots() })[0]?.result
  if (!manifestMismatch?.denyCodes.includes(RULE.STAGED_WORKTREE_MISMATCH)) failures.push('staged/worktree manifest mismatch was allowed')
  return failures
}

function runGit(root, args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8' })
}

function createTempGitRepo() {
  const root = mkdtempSync(join(tmpdir(), 'mss-precommit-'))
  runGit(root, ['init', '-q'])
  runGit(root, ['config', 'user.email', 'fixture@example.invalid'])
  runGit(root, ['config', 'user.name', 'MSS Fixture'])
  runGit(root, ['config', 'core.autocrlf', 'false'])
  return root
}

function writeTemp(root, path, content) {
  const abs = join(root, path)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, content, 'utf8')
}

function runPrecommit(root) {
  return spawnSync(process.execPath, [precommitHookPath], { cwd: root, encoding: 'utf8' })
}

function writeFixtureReferenceOwner(root) {
  writeTemp(
    root,
    'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md',
    '# Synthetic resolvable owner for isolated hook integration\n',
  )
}

function writeFixtureTree(root) {
  for (const snapshot of fixtureHeadSnapshots()) writeTemp(root, snapshot.path, snapshot.content)
}

function reportWithBundle(records, title = 'Synthetic operational report') {
  return `# ${title}\n\n**Modalità:** standard\n\n## Capsula MetaSkillSystem\n\n\`\`\`jsonl\n${toJsonl(records).trim()}\n\`\`\`\n${reportQrs()}`
}

function historicalAmendmentBundle(targetRecordId) {
  const bundle = validBundle()
  const sessionId = 'mss-ses-0198b000-0001-7000-8000-000000000101'
  const correlationId = 'mss-cor-0198b000-0001-7000-8000-000000000102'
  const recordIds = [
    'mss-rec-0198b000-0001-7000-8000-000000000110',
    'mss-rec-0198b000-0001-7000-8000-000000000111',
    'mss-rec-0198b000-0001-7000-8000-000000000112',
    'mss-rec-0198b000-0001-7000-8000-000000000113',
  ]
  const annotationIds = [
    'mss-ann-0198b000-0001-7000-8000-000000000130',
    'mss-ann-0198b000-0001-7000-8000-000000000131',
    'mss-ann-0198b000-0001-7000-8000-000000000132',
  ]
  for (const [index, record] of bundle.entries()) {
    record.session_id = sessionId
    record.correlation_id = correlationId
    record.record_id = recordIds[index]
    record.capture_key = `${sessionId}/1/${record.record_type}/${index || index}`
  }
  bundle[0].capture_key = `${sessionId}/1/session_event/1`
  bundle[0].event.event_id = 'mss-evt-0198b000-0001-7000-8000-000000000120'
  bundle.slice(1).forEach((record, index) => {
    record.capture_key = `${sessionId}/1/annotation/${index + 1}`
    record.annotation.annotation_id = annotationIds[index]
    record.annotation.subject_record_ids = [recordIds[0]]
  })
  const correction = amendment(targetRecordId)
  correction.session_id = sessionId
  correction.correlation_id = correlationId
  correction.record_id = 'mss-rec-0198b000-0001-7000-8000-000000000114'
  correction.capture_key = `${sessionId}/1/amendment/1`
  correction.amendment.amendment_id = 'mss-amd-0198b000-0001-7000-8000-000000000140'
  return [...bundle, correction]
}

function commitBaseline(root, path, content) {
  writeFixtureReferenceOwner(root)
  writeTemp(root, path, content)
  runGit(root, ['add', '.'])
  const commit = runGit(root, ['commit', '-q', '-m', 'baseline'])
  if (commit.status !== 0) throw new Error(commit.stderr || commit.stdout)
}

function precommitOutputs(root) {
  const first = runPrecommit(root)
  const second = runPrecommit(root)
  return {
    first,
    second,
    stderr: `${first.stderr || ''}\n${second.stderr || ''}`,
  }
}

function testH11AppendOnlyIntegration() {
  const failures = []
  const repos = []
  const path = `${SESSIONI}/10-08-26/Report-append-only.md`
  try {
    // Record finalizzato riscritto semanticamente: deve essere bloccato rispetto a HEAD.
    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, path, reportWithBundle(validBundle()))
      const changed = validBundle()
      changed[0].event.observed_outcome = 'rewritten finalized outcome'
      writeTemp(root, path, reportWithBundle(changed))
      runGit(root, ['add', path])
      const result = precommitOutputs(root)
      if (!result.stderr.includes('MSS-FINAL-RECORD-MODIFIED')) {
        failures.push('record finalizzato modificato rispetto a HEAD non bloccato con codice stabile')
      }
    }
    // Cancellazione staged: il record storico non può sparire.
    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, path, reportWithBundle(validBundle()))
      runGit(root, ['rm', '-q', '--', path])
      const result = precommitOutputs(root)
      if (!result.stderr.includes('MSS-FINAL-RECORD-REMOVED')) {
        failures.push('cancellazione staged di record finalizzato non bloccata con codice stabile')
      }
    }
    // Rename fuori dal perimetro MSS: equivale a eliminare il record storico controllato.
    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, path, reportWithBundle(validBundle()))
      writeTemp(root, 'notes/.keep', 'synthetic\n')
      runGit(root, ['add', 'notes/.keep'])
      runGit(root, ['commit', '-q', '-m', 'notes-dir'])
      runGit(root, ['mv', path, 'notes/renamed-report.md'])
      const result = precommitOutputs(root)
      if (!result.stderr.includes('MSS-FINAL-RECORD-REMOVED')) {
        failures.push('rename che elimina il record storico MSS non bloccato con codice stabile')
      }
    }
    // La narrativa può cambiare quando la capsula resta semanticamente identica.
    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, path, reportWithBundle(validBundle()))
      writeTemp(root, path, reportWithBundle(validBundle(), 'Narrativa aggiornata'))
      runGit(root, ['add', path])
      const result = precommitOutputs(root)
      if (result.first.status !== 1 || result.second.status !== 0) {
        failures.push(`sequenza pre-commit valida diversa da cold fail -> pass: ${result.stderr}`)
      }
    }
    // Anche l'ordine delle chiavi JSON non è semantico.
    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, path, reportWithBundle(validBundle()))
      const reordered = validBundle().map((record) => Object.fromEntries(Object.entries(record).reverse()))
      writeTemp(root, path, reportWithBundle(reordered, 'Chiavi riordinate'))
      runGit(root, ['add', path])
      const result = precommitOutputs(root)
      if (result.second.status !== 0) failures.push(`ordine chiavi non semantico bloccato: ${result.stderr}`)
    }
    // Nuovo amendment nello stesso artefatto: append-only valido.
    {
      const root = createTempGitRepo(); repos.push(root)
      commitBaseline(root, path, reportWithBundle(validBundle()))
      writeTemp(root, path, reportWithBundle([...validBundle(), amendment()]))
      runGit(root, ['add', path])
      const result = precommitOutputs(root)
      if (result.second.status !== 0) failures.push(`amendment append-only valido bloccato: ${result.stderr}`)
    }
    // Nuovo bundle che rettifica un target unico e finalizzato già presente in HEAD.
    {
      const root = createTempGitRepo(); repos.push(root)
      const historical = validBundle()
      historical[0].record_id = 'mss-rec-0198b000-0001-7000-8000-000000000088'
      historical[0].capture_key = `${historical[0].session_id}/1/session_event/8`
      for (const record of historical.slice(1)) record.annotation.subject_record_ids = [historical[0].record_id]
      commitBaseline(root, path, reportWithBundle(historical, 'Storia finalizzata'))
      const nextPath = `${SESSIONI}/10-08-26/Report-historical-amendment.md`
      writeTemp(root, nextPath, reportWithBundle(historicalAmendmentBundle(historical[0].record_id)))
      runGit(root, ['add', nextPath])
      const result = precommitOutputs(root)
      if (result.second.status !== 0) failures.push(`amendment verso HEAD risolvibile bloccato dall'adapter Git: ${result.stderr}`)
    }
  } finally {
    for (const root of repos) rmSync(root, { recursive: true, force: true })
  }
  return failures
}

function testH11ManifestIntegrity() {
  const failures = []
  const manifestText = readFileSync(join(fixturesDir, 'manifest.json'), 'utf8')
  const manifest = JSON.parse(manifestText)
  const cases = [
    ['frozen mancante', (m) => { m.frozen = m.frozen.filter((c) => c.id !== 'FX-I10') }],
    ['ID duplicato', (m) => {
      m.supplemental.push({ id: 'FX-V01', expect: 'pass', file: 'duplicate-id.jsonl', kind: 'jsonl' })
    }],
    ['protocollo incompatibile', (m) => { m.protocol_version = '9.9.9' }],
  ]
  for (const [name, mutate] of cases) {
    const changed = structuredClone(manifest)
    mutate(changed)
    const content = `${JSON.stringify(changed, null, 2)}\n`
    const result = validateStagedMssFiles(repoRoot, [{
      path: 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json',
      content,
      worktreeContent: content,
    }])[0]?.result
    if (!result?.denyCodes.includes('MSS-FIXTURE-PROTOCOL')) {
      failures.push(`${name}: manifest accettato; codes=${result?.codes?.join(',') || ''}`)
    }
  }
  const frozenPath = 'docs/MetaSkillSystem/fixtures/v0.1/FX-V01-bundle.jsonl'
  const frozen = readFileSync(join(repoRoot, frozenPath), 'utf8')
  const rewritten = frozen.replace('synthetic fixture intent', 'rewritten fixture intent')
  const rewrittenResult = validateStagedMssFiles(repoRoot, [{
    path: frozenPath,
    content: rewritten,
    worktreeContent: rewritten,
  }])[0]?.result
  if (!rewrittenResult?.denyCodes.includes('MSS-FIXTURE-PROTOCOL')) {
    failures.push(`contenuto frozen riscritto senza bump accettato: ${rewrittenResult?.codes?.join(',') || ''}`)
  }
  const deletedResult = validateStagedMssFiles(repoRoot, [{
    status: 'D',
    path: frozenPath,
    content: null,
    headContent: frozen,
    worktreeContent: null,
  }])[0]?.result
  if (!deletedResult?.denyCodes.includes('MSS-FIXTURE-PROTOCOL')) {
    failures.push(`file frozen cancellato senza bump accettato: ${deletedResult?.codes?.join(',') || ''}`)
  }
  return failures
}

function testPrecommitIntegration() {
  const failures = []
  const repos = []
  try {
    // 1. Fixture negativa dichiarata: primo giro = mente fredda, secondo giro = committibile.
    {
      const root = createTempGitRepo(); repos.push(root)
      writeFixtureReferenceOwner(root)
      writeFixtureTree(root)
      runGit(root, ['add', '.'])
      runPrecommit(root)
      const second = runPrecommit(root)
      if (second.status !== 0) failures.push(`negative fixture precommit blocked: ${second.stderr}`)
    }
    // 2. JSONL operativo invalido.
    {
      const root = createTempGitRepo(); repos.push(root)
      writeTemp(root, `${SESSIONI}/10-08-26/eventi-light/invalid.jsonl`, '{}\n')
      runGit(root, ['add', '.'])
      const result = runPrecommit(root)
      if (result.status === 0 || !result.stderr.includes('PRE-COMMIT MSS')) failures.push('operational invalid precommit did not block')
    }
    // 3. Report standard/deep invalido (senza capsula).
    {
      const root = createTempGitRepo(); repos.push(root)
      writeTemp(root, `${SESSIONI}/10-08-26/Report-invalid.md`, `# Invalid\n\n**Modalità:** deep\n${reportQrs()}`)
      runGit(root, ['add', '.'])
      const result = runPrecommit(root)
      if (result.status === 0 || !result.stderr.includes(RULE.REPORT_NO_CAPSULE)) failures.push('standard/deep invalid report precommit did not block')
    }
    // 3-bis. D1 — stesso report senza capsula negato al 1°, 2° e 3° giro identico (parità cold-check).
    {
      const root = createTempGitRepo(); repos.push(root)
      const path = `${SESSIONI}/23-08-26/deep/Report-d1-no-capsule.md`
      writeTemp(root, path, `# D1 probe\n\n**Modalità:** deep\n${reportQrs()}`)
      runGit(root, ['add', '.'])
      for (let attempt = 1; attempt <= 3; attempt++) {
        const result = runPrecommit(root)
        if (result.status === 0 || !result.stderr.includes(RULE.REPORT_NO_CAPSULE)) {
          failures.push(`D1 precommit attempt ${attempt}/3 did not deny report without capsule`)
        }
      }
    }
    // 4. Mismatch staged/worktree.
    {
      const root = createTempGitRepo(); repos.push(root)
      writeFixtureReferenceOwner(root)
      const path = `${SESSIONI}/10-08-26/eventi-light/mismatch.jsonl`
      writeTemp(root, path, readFileSync(join(fixturesDir, 'FX-V01-bundle.jsonl'), 'utf8'))
      runGit(root, ['add', '.'])
      writeTemp(root, path, '{}\n')
      const result = runPrecommit(root)
      if (result.status === 0 || !result.stderr.includes(RULE.STAGED_WORKTREE_MISMATCH)) failures.push('precommit mismatch did not block')
    }
  } finally {
    for (const root of repos) rmSync(root, { recursive: true, force: true })
  }
  return failures
}

function testStopHookIntegration() {
  const root = mkdtempSync(join(tmpdir(), 'mss-stop-'))
  try {
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const subPath = `${SESSIONI}/${day}/sub/Report-stop-invalid.md`
    writeTemp(root, subPath, `# Stop invalid\n\n**Modalità:** standard\n${reportQrs()}`)
    utimesSync(join(root, subPath), new Date(now - 1000), new Date(now - 1000))
    const discovered = findRecentReportFiles(root, { now })
    if (!discovered.length || !discovered[0].replace(/\\/g, '/').includes('/sub/')) {
      return [`findRecentReportFiles missed subfolder report: ${discovered.join(',')}`]
    }
    const result = spawnSync(process.execPath, [stopHookPath], {
      cwd: root,
      encoding: 'utf8',
      input: JSON.stringify({ workspace_root: root, loop_count: 0 }),
    })
    if (result.status !== 0) return [`stop hook exited ${result.status}: ${result.stderr}`]
    let payload
    try { payload = JSON.parse(result.stdout || '{}') } catch { return ['stop hook returned invalid JSON'] }
    if (!payload.followup_message?.includes(RULE.REPORT_NO_CAPSULE)) {
      return ['stop hook did not intercept recent declared standard report without capsule']
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testFindRecentReportFilesRecursive() {
  const root = mkdtempSync(join(tmpdir(), 'mss-report-paths-'))
  try {
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const flatRel = `${SESSIONI}/${day}/Report-flat-old.md`
    const deepRel = `${SESSIONI}/${day}/nested/deep/Report-deep-recent.md`
    writeTemp(root, flatRel, '# flat old — non chiusura\n')
    writeTemp(root, deepRel, `# deep recent\n\n**Modalità:** standard\n${reportQrs()}`)
    utimesSync(join(root, flatRel), new Date(now - 3_600_000), new Date(now - 3_600_000))
    utimesSync(join(root, deepRel), new Date(now - 500), new Date(now - 500))
    const found = findRecentReportFiles(root, { now })
    const norm = (found[0] || '').replace(/\\/g, '/')
    if (!norm.includes('nested/deep/Report-deep-recent.md')) {
      return [`expected deepest recent closure report, got ${norm}`]
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

const FIXTURE_PROBE_MD = readFileSync(
  join(repoRoot, 'docs/MetaSkillSystem/tests/fixtures/reports/Report-hook-cli-staged-probe.md'),
  'utf8',
)

function testStopHookIgnoresNonClosureFixture() {
  const root = mkdtempSync(join(tmpdir(), 'mss-stop-fixture-'))
  try {
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const probeRel = `${SESSIONI}/${day}/sub/Report-test.md`
    const realRel = `${SESSIONI}/${day}/nested/Report-revisione.md`
    writeTemp(root, probeRel, FIXTURE_PROBE_MD)
    writeTemp(
      root,
      realRel,
      `# Revisione\n\n**Modalità:** standard\n\n## Domande di chiusura\n\n❓ Q1 — Prompt?\n✅ R1:\n\n❓ Q2 — Dati?\n✅ R2: ok.\n`,
    )
    utimesSync(join(root, probeRel), new Date(now - 100), new Date(now - 100))
    utimesSync(join(root, realRel), new Date(now - 5_000), new Date(now - 5_000))
    const found = findRecentReportFiles(root, { now })
    const norm = (found[0] || '').replace(/\\/g, '/')
    if (!norm.includes('nested/Report-revisione.md')) {
      return [`fixture probe must not shadow real closure report; got ${norm || '(empty)'}`]
    }
    const result = spawnSync(process.execPath, [stopHookPath], {
      cwd: root,
      encoding: 'utf8',
      input: JSON.stringify({ workspace_root: root, loop_count: 0 }),
    })
    let payload
    try { payload = JSON.parse(result.stdout || '{}') } catch { return ['stop hook invalid JSON on fixture shadow case'] }
    if (!payload.followup_message?.includes('risposte vuote')) {
      return ['stop hook should block incomplete real report despite newer fixture probe']
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testStopHookSilenceWhenOnlyFixtureProbe() {
  const root = mkdtempSync(join(tmpdir(), 'mss-stop-fixture-only-'))
  try {
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const probeRel = `${SESSIONI}/${day}/sub/Report-test.md`
    writeTemp(root, probeRel, FIXTURE_PROBE_MD)
    if (findRecentReportFiles(root, { now }).length) {
      return ['non-closure fixture alone must not be discovered as session report']
    }
    const result = spawnSync(process.execPath, [stopHookPath], {
      cwd: root,
      encoding: 'utf8',
      input: JSON.stringify({ workspace_root: root, loop_count: 0 }),
    })
    let payload
    try { payload = JSON.parse(result.stdout || '{}') } catch { return ['stop hook invalid JSON on fixture-only case'] }
    if (payload.followup_message) {
      return ['stop hook must stay silent when only MSS/CLI fixture probe is recent']
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testStopHookIgnoresUnderscoreProbePath() {
  const failures = []
  const probeRel = `${SESSIONI}/23-08-26/_prova-sk4-r1/sub/Report-test-r1-b2.md`
  if (!isStopHookProbePath(probeRel)) failures.push('_prova path not flagged as probe')
  const root = mkdtempSync(join(tmpdir(), 'mss-stop-underscore-'))
  try {
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const underRel = `${SESSIONI}/${day}/_prova/sub/Report-deep-no-qr.md`
    writeTemp(root, underRel, `# probe deep\n\n**Modalità:** deep\n\nNo Q/R section.\n`)
    if (findRecentReportFiles(root, { now }).length) {
      failures.push('underscore probe path must be excluded even if deep mode')
    }
    return failures
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testStopHookCompleteReportSilence() {
  const root = createTempGitRepo()
  try {
    writeFixtureReferenceOwner(root)
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const rel = `${SESSIONI}/${day}/sub/Report-complete.md`
    writeTemp(root, rel, reportWithBundle(validBundle()))
    const result = spawnSync(process.execPath, [stopHookPath], {
      cwd: root,
      encoding: 'utf8',
      input: JSON.stringify({ workspace_root: root, loop_count: 0 }),
    })
    let payload
    try { payload = JSON.parse(result.stdout || '{}') } catch { return ['stop hook invalid JSON on complete report'] }
    if (payload.followup_message) {
      return [`stop hook should silence on complete Q/R+capsule report: ${payload.followup_message.slice(0, 120)}`]
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testH13SurfaceParity() {
  const root = createTempGitRepo()
  try {
    writeFixtureReferenceOwner(root)
    const d = new Date()
    const day = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)}`
    const path = `${SESSIONI}/${day}/Report-surface-parity.md`
    const content = reportWithBundle(validBundle()).replace('**Modalità:** standard', '**Modalità:** Meta/deep, esecuzione documentale')
    writeTemp(root, path, content)

    const core = validateMss({ kind: 'report', file: join(root, path), content, workspaceRoot: root }, { workspaceRoot: root })
    if (!core.denyCodes.includes('MSS-REPORT-MODE-INVALID')) return ['core did not deny shared invalid input']

    const cli = spawnSync(process.execPath, [join(repoRoot, 'scripts/mss/cli.mjs'), '--mode', 'file', '--file', join(root, path), '--json'], { cwd: root, encoding: 'utf8' })
    let cliResult
    try { cliResult = JSON.parse(cli.stdout) } catch { return [`CLI invalid JSON: ${cli.stderr || cli.stdout}`] }
    if (!cliResult.denyCodes.includes('MSS-REPORT-MODE-INVALID')) return ['CLI disagrees with core on shared invalid input']

    const stop = spawnSync(process.execPath, [stopHookPath], {
      cwd: root,
      encoding: 'utf8',
      input: JSON.stringify({ workspace_root: root, loop_count: 0 }),
    })
    let stopPayload
    try { stopPayload = JSON.parse(stop.stdout || '{}') } catch { return ['stop hook invalid JSON on shared input'] }
    if (!stopPayload.followup_message?.includes('MSS-REPORT-MODE-INVALID')) return ['stop hook disagrees on shared invalid input']

    runGit(root, ['add', '.'])
    const precommit = runPrecommit(root)
    if (!precommit.stderr.includes('MSS-REPORT-MODE-INVALID')) return ['pre-commit disagrees on shared invalid input']
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testH13StagedRequireCapsule() {
  const root = createTempGitRepo()
  const reportRel = `${SESSIONI}/23-08-26/sub/Report-test.md`
  const noModeNoCapsule = `# Report test\n\nNo capsule, no mode.\n${reportQrs()}`
  const deepNoCapsule = `# Report test\n\n**Modalità:** deep\n\nNo capsule.\n${reportQrs()}`
  try {
    writeFixtureReferenceOwner(root)
    writeTemp(root, reportRel, noModeNoCapsule)
    runGit(root, ['add', reportRel])

    const withoutFlag = spawnSync(
      process.execPath,
      [join(repoRoot, 'scripts/mss/cli.mjs'), '--mode', 'staged', '--file', join(root, reportRel), '--json'],
      { cwd: root, encoding: 'utf8' },
    )
    let withoutFlagResult
    try { withoutFlagResult = JSON.parse(withoutFlag.stdout || '{}') } catch { withoutFlagResult = {} }
    if (withoutFlag.status !== 0 || !withoutFlagResult.ok) {
      return [`staged CLI without --require-capsule should pass undeclared report: exit=${withoutFlag.status}; codes=${(withoutFlagResult.denyCodes || []).join(',')}`]
    }

    const withFlag = spawnSync(
      process.execPath,
      [
        join(repoRoot, 'scripts/mss/cli.mjs'),
        '--mode', 'staged', '--file', join(root, reportRel), '--require-capsule', '--json',
      ],
      { cwd: root, encoding: 'utf8' },
    )
    let withFlagResult
    try { withFlagResult = JSON.parse(withFlag.stdout || '{}') } catch { withFlagResult = {} }
    if (withFlag.status !== 1 || withFlagResult.ok || !withFlagResult.denyCodes?.includes(RULE.REPORT_NO_CAPSULE)) {
      return [`staged CLI --require-capsule must deny undeclared report: exit=${withFlag.status}; codes=${(withFlagResult.denyCodes || []).join(',')}`]
    }

    writeTemp(root, reportRel, deepNoCapsule)
    runGit(root, ['add', reportRel])
    const deep = spawnSync(
      process.execPath,
      [join(repoRoot, 'scripts/mss/cli.mjs'), '--mode', 'staged', '--file', join(root, reportRel), '--json'],
      { cwd: root, encoding: 'utf8' },
    )
    let deepResult
    try { deepResult = JSON.parse(deep.stdout || '{}') } catch { deepResult = {} }
    if (deep.status !== 1 || deepResult.ok || !deepResult.denyCodes?.includes(RULE.REPORT_NO_CAPSULE)) {
      return [`staged CLI must deny deep report without capsule: exit=${deep.status}; codes=${(deepResult.denyCodes || []).join(',')}`]
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testH13StagedCliParity() {
  const root = createTempGitRepo()
  try {
    writeFixtureReferenceOwner(root)
    writeFixtureTree(root)
    runGit(root, ['add', '.'])
    const baseline = runGit(root, ['commit', '-q', '-m', 'fixture baseline'])
    if (baseline.status !== 0) return [`baseline commit failed: ${baseline.stderr}`]

    const fixtureRel = 'docs/MetaSkillSystem/fixtures/v0.1/FX-REVIEW-ATOMIC.jsonl'
    const manifestRel = 'docs/MetaSkillSystem/fixtures/v0.1/manifest.json'
    writeTemp(root, fixtureRel, toJsonl(validBundle()))
    const manifest = JSON.parse(readFileSync(join(root, manifestRel), 'utf8'))
    manifest.supplemental.push({
      id: 'FX-REVIEW-ATOMIC',
      expect: 'pass',
      file: 'FX-REVIEW-ATOMIC.jsonl',
      kind: 'jsonl',
    })
    writeTemp(root, manifestRel, `${JSON.stringify(manifest, null, 2)}\n`)
    runGit(root, ['add', fixtureRel, manifestRel])

    const adapter = validateStagedMssFiles(root, [
      {
        status: 'A',
        path: fixtureRel,
        content: readFileSync(join(root, fixtureRel)),
        worktreeContent: readFileSync(join(root, fixtureRel)),
      },
      {
        status: 'M',
        path: manifestRel,
        content: readFileSync(join(root, manifestRel)),
        worktreeContent: readFileSync(join(root, manifestRel)),
      },
    ], { historicalSnapshots: fixtureHeadSnapshots().map((snapshot) => ({
      path: snapshot.path,
      content: readFileSync(join(root, snapshot.path)),
    })) })
    const adapterDenied = adapter.flatMap((entry) => entry.result.denyCodes)
    if (adapterDenied.length) {
      return [`adapter full snapshot denied atomic stage: ${adapterDenied.join(',')}`]
    }

    const cli = spawnSync(
      process.execPath,
      [join(repoRoot, 'scripts/mss/cli.mjs'), '--mode', 'staged', '--file', fixtureRel, '--json'],
      { cwd: root, encoding: 'utf8' },
    )
    let cliResult
    try { cliResult = JSON.parse(cli.stdout || '{}') } catch {
      return [`CLI staged invalid JSON: ${cli.stderr || cli.stdout}`]
    }
    if (!cliResult.ok || (cliResult.denyCodes || []).includes(RULE.FIXTURE_UNDECLARED)) {
      return [`CLI staged single-file lost atomic snapshot: exit=${cli.status}; codes=${(cliResult.denyCodes || []).join(',')}`]
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testMatrix() {
  if (!existsSync(matrixPath)) return ['COVERAGE_MATRIX_H1.json missing']
  const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'))
  const failures = []
  const required = [
    'precommit_blocks_staged_not_edit',
    'stop_does_not_cover_cloud_codex_claude',
    'bypass_no_verify_and_unstaged',
    'h1_does_not_prove_global_capture_continuity',
    'no_e3_for_close_or_commit_only',
    'negative_fixtures_use_manifest_expectations',
    'reports_require_explicit_mode_for_missing_capsule_deny',
    'explicit_invalid_mode_is_deny',
    'append_only_compares_head_to_staged',
    'historical_amendments_use_bounded_git_head',
    'manifest_freezes_exactly_14_protocol_cases',
    'amendment_conflicts_are_order_independent',
    'manifest_staged_lifecycle_is_authoritative',
    'supplemental_relationships_use_effective_snapshot',
    'historical_mode_exception_is_path_and_hash_scoped',
    'historical_previous_mismatch_is_deny',
    'amendment_invalid_field_path_is_deny',
    'cli_staged_uses_full_snapshot',
  ]
  for (const key of required) if (!matrix.declarations?.[key]) failures.push(`matrix missing declaration ${key}`)
  if (!Array.isArray(matrix.controls) || matrix.controls.length < 10) failures.push('matrix controls too few')
  for (const control of matrix.controls || []) {
    for (const field of ['id', 'surface', 'moment', 'visible_input', 'effect', 'fallback', 'known_bypass', 'G', 'O', 'E']) {
      if (control[field] === undefined || control[field] === null || control[field] === '') failures.push(`control ${control.id || '?'} missing ${field}`)
    }
    if (control.surface?.includes('CI')) failures.push(`control ${control.id} falsely claims CI`)
    if (control.O > 1) failures.push(`control ${control.id} claims O${control.O} without repeated real observation`)
    if (control.E > 2) failures.push(`control ${control.id} claims E${control.E}; H-1 has no E3`)
  }
  const stopControl = matrix.controls?.find((c) => c.id === 'H1-REPORT-CAPSULE')
  if (!stopControl?.surface?.includes('Cursor locale') || !stopControl?.surface?.includes('commit')) {
    failures.push('report capsule surface does not match wired stop/pre-commit adapters')
  }
  const amendmentControl = matrix.controls?.find((c) => c.id === 'H1-AMENDMENT')
  if (!/field_path|previous_value_or_hash/i.test(String(amendmentControl?.visible_input || ''))) {
    failures.push('H1-AMENDMENT visible_input non ancora legato a previous/field_path')
  }
  if (!/field_path|fail-open/i.test(String(amendmentControl?.fallback || ''))) {
    failures.push('H1-AMENDMENT fallback non dichiara deny su field_path')
  }
  const historyControl = matrix.controls?.find((c) => c.id === 'H1-AMENDMENT-HISTORY')
  if (!/previous|storic/i.test(String(historyControl?.visible_input || ''))) {
    failures.push('H1-AMENDMENT-HISTORY visible_input non ancora legato a previous storico')
  }
  return failures
}

// --- A2 (24-08-26) — corpus unico per le guardie PROD Cursor/Claude/kit ----------------------
// Le tre copie divergono legittimamente nel protocollo I/O (mandato M-A/M-B §2 · A2): il corpus
// di CASI è condiviso, l'adattatore payload/decisione è per-piattaforma.
const GUARD_PROD_CASES = [
  {
    id: 'A2-mcp-execute-sql-delete-ask',
    kind: 'mcp', tool_name: 'mcp__claude_ai_Supabase__execute_sql',
    tool_input: { query: 'DELETE FROM bookings WHERE id = 1' },
    expected: 'ask',
  },
  {
    id: 'A2-mcp-execute-sql-select-allow',
    kind: 'mcp', tool_name: 'mcp__claude_ai_Supabase__execute_sql',
    tool_input: { query: 'SELECT * FROM bookings' },
    expected: 'allow',
  },
  {
    id: 'A2-mcp-apply-migration-prod-ask',
    kind: 'mcp', tool_name: 'mcp__claude_ai_Supabase__apply_migration',
    tool_input: {},
    expected: 'ask',
  },
  {
    id: 'A2-mcp-apply-migration-test-allow',
    kind: 'mcp', tool_name: 'mcp__claude_ai_Supabase_test__apply_migration',
    tool_input: {},
    expected: 'allow',
  },
  {
    id: 'A2-mcp-list-tables-allow',
    kind: 'mcp', tool_name: 'mcp__claude_ai_Supabase__list_tables',
    tool_input: {},
    expected: 'allow',
  },
  {
    id: 'A2-shell-include-all-ask',
    kind: 'shell', command: 'supabase db push --include-all',
    expected: 'ask',
  },
  {
    id: 'A2-payload-illegible-allow',
    kind: 'raw', raw: '',
    expected: 'allow',
  },
]

function cursorGuardPayload(c) {
  if (c.kind === 'raw') return c.raw
  if (c.kind === 'shell') return JSON.stringify({ command: c.command })
  return JSON.stringify({ tool_name: c.tool_name, tool_input: c.tool_input })
}
function claudeGuardPayload(c) {
  if (c.kind === 'raw') return c.raw
  if (c.kind === 'shell') return JSON.stringify({ tool_name: 'Bash', tool_input: { command: c.command } })
  return JSON.stringify({ tool_name: c.tool_name, tool_input: c.tool_input })
}
function cursorGuardDecision(stdout) {
  try { return JSON.parse(stdout).permission } catch { return `<invalid JSON: ${stdout}>` }
}
function claudeGuardDecision(stdout) {
  try { return JSON.parse(stdout).hookSpecificOutput?.permissionDecision } catch { return `<invalid JSON: ${stdout}>` }
}

function runGuardCase(hookPath, payload) {
  return spawnSync(process.execPath, [hookPath], { encoding: 'utf8', input: payload, cwd: repoRoot })
}

// --- A1/A4 (24-08-26, controverifica) — regressione sull'indice git, non sul filesystem --------
// Girano contro `git ls-files`/`git show :path` (stage 0 dell'indice): verdi ora che i file sono
// staged, restano verdi dopo il commit di Matteo. Un test sul solo filesystem non basterebbe: è
// esattamente lo scenario del difetto originale (file presenti su disco, invisibili a git).
function gitIndexHasPath(path) {
  const result = spawnSync('git', ['ls-files', '--error-unmatch', path], { cwd: repoRoot, encoding: 'utf8' })
  return result.status === 0
}

function testA1GuardProdTrackedByGit() {
  const failures = []
  const copies = [
    '.claude/hooks/guard-prod.mjs',
    '.cursor/hooks/guard-prod.mjs',
    '_skill-system-v0/hooks/guard-prod.mjs',
  ]
  for (const p of copies) {
    if (!gitIndexHasPath(p)) failures.push(`A1: ${p} non è nell'indice git (git ls-files --error-unmatch fallisce)`)
  }
  return failures
}

function testA4ClaudeSettingsTrackedNoPersonalFiles() {
  const failures = []
  if (!gitIndexHasPath('.claude/settings.json')) {
    failures.push('A4: .claude/settings.json non è nell\'indice git')
  } else {
    const show = spawnSync('git', ['show', ':.claude/settings.json'], { cwd: repoRoot, encoding: 'utf8' })
    if (show.status !== 0) {
      failures.push(`A4: impossibile leggere .claude/settings.json dallo stage 0 dell'indice: ${show.stderr}`)
    } else {
      let parsed
      try {
        parsed = JSON.parse(show.stdout)
      } catch (error) {
        failures.push(`A4: .claude/settings.json nell'indice non è JSON valido: ${error.message}`)
      }
      if (parsed) {
        const stopCmd = parsed.hooks?.Stop?.[0]?.hooks?.[0]?.command || ''
        const preCmd = parsed.hooks?.PreToolUse?.[0]?.hooks?.[0]?.command || ''
        if (!/fine-sessione-senior\.mjs/.test(stopCmd)) {
          failures.push(`A4: blocco hooks.Stop nell'indice non referenzia fine-sessione-senior.mjs (letto: ${stopCmd})`)
        }
        if (!/guard-prod\.mjs/.test(preCmd)) {
          failures.push(`A4: blocco hooks.PreToolUse nell'indice non referenzia guard-prod.mjs (letto: ${preCmd})`)
        }
      }
    }
  }
  // La metà che conta: i file personali (permessi assoluti di Matteo, chiavi MCP) non devono MAI
  // entrare nell'indice — altrimenti un commit distratto li pubblica.
  for (const personal of ['.claude/settings.local.json', '.claude/mcp.json']) {
    if (gitIndexHasPath(personal)) {
      failures.push(`A4: ${personal} È nell'indice git — non deve mai esserci (permessi/segreti personali di Matteo)`)
    }
  }
  return failures
}

function testA2GuardProdCorpus() {
  const failures = []
  for (const c of GUARD_PROD_CASES) {
    const cursorResult = runGuardCase(cursorGuardProdHookPath, cursorGuardPayload(c))
    const cursorDecision = cursorGuardDecision(cursorResult.stdout)
    if (cursorDecision !== c.expected) {
      failures.push(`${c.id} [cursor]: expected ${c.expected}, got ${cursorDecision} (stderr=${cursorResult.stderr || ''})`)
    }
    const claudeResult = runGuardCase(claudeGuardProdHookPath, claudeGuardPayload(c))
    const claudeDecision = claudeGuardDecision(claudeResult.stdout)
    if (claudeDecision !== c.expected) {
      failures.push(`${c.id} [claude]: expected ${c.expected}, got ${claudeDecision} (stderr=${claudeResult.stderr || ''})`)
    }
  }
  return failures
}

function testA2KitTemplateStatic() {
  const failures = []
  const check = spawnSync(process.execPath, ['--check', kitGuardProdHookPath], { encoding: 'utf8' })
  if (check.status !== 0) failures.push(`A2-kit-static-check: node --check failed: ${check.stderr}`)
  const source = readFileSync(kitGuardProdHookPath, 'utf8')
  const markers = (source.match(/⚠️\s*ADATTA/g) || []).length
  if (markers < 1) failures.push(`A2-kit-static-check: marcatori ⚠️ ADATTA assenti (template cablato con dati reali?)`)
  return failures
}

// --- A3 (24-08-26) — hook Stop di Claude Code coperto nella stessa suite dei gemelli Cursor ---
function runClaudeStopHook(root, extra = {}) {
  return spawnSync(process.execPath, [claudeStopHookPath], {
    cwd: root,
    encoding: 'utf8',
    input: JSON.stringify({ cwd: root, stop_hook_active: false, ...extra }),
  })
}

function testA3ClaudeStopHookSilenceOnComplete() {
  const root = createTempGitRepo()
  try {
    writeFixtureReferenceOwner(root)
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const rel = `${SESSIONI}/${day}/sub/Report-a3-complete.md`
    writeTemp(root, rel, reportWithBundle(validBundle()))
    const result = runClaudeStopHook(root)
    if (result.status !== 0) return [`A3-silence-complete: exit=${result.status} stderr=${result.stderr}`]
    let payload
    try { payload = JSON.parse(result.stdout || '{}') } catch { return [`A3-silence-complete: stdout non-JSON: ${result.stdout}`] }
    if (payload.decision === 'block') {
      return [`A3-silence-complete: expected silence on complete Q/R+capsula, got block: ${(payload.reason || '').slice(0, 120)}`]
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testA3ClaudeStopHookBlocksMissingAnswer() {
  const root = createTempGitRepo()
  try {
    writeFixtureReferenceOwner(root)
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const rel = `${SESSIONI}/${day}/sub/Report-a3-missing-answer.md`
    writeTemp(
      root, rel,
      `# A3 missing answer\n\n**Modalità:** standard\n\n## Domande di chiusura\n\n❓ Q1 — Prompt?\n✅ R1:\n\n❓ Q2 — Dati?\n✅ R2: ok.\n`,
    )
    const result = runClaudeStopHook(root)
    let payload
    try { payload = JSON.parse(result.stdout || '{}') } catch { return [`A3-blocks-missing-answer: stdout non-JSON: ${result.stdout}`] }
    if (payload.decision !== 'block' || !/risposte vuote/i.test(payload.reason || '')) {
      return [`A3-blocks-missing-answer: expected block su risposta vuota, got ${JSON.stringify(payload).slice(0, 160)}`]
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testA3ClaudeStopHookBlocksRedCapsule() {
  const root = createTempGitRepo()
  try {
    writeFixtureReferenceOwner(root)
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const rel = `${SESSIONI}/${day}/sub/Report-a3-no-capsule.md`
    writeTemp(root, rel, `# A3 no capsule\n\n**Modalità:** standard\n${reportQrs()}`)
    const result = runClaudeStopHook(root)
    let payload
    try { payload = JSON.parse(result.stdout || '{}') } catch { return [`A3-blocks-red-capsule: stdout non-JSON: ${result.stdout}`] }
    if (payload.decision !== 'block' || !payload.reason?.includes(RULE.REPORT_NO_CAPSULE)) {
      return [`A3-blocks-red-capsule: expected block su capsula rossa (${RULE.REPORT_NO_CAPSULE}), got ${JSON.stringify(payload).slice(0, 160)}`]
    }
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function testA3ClaudeStopHookAntiLoop() {
  const root = createTempGitRepo()
  try {
    writeFixtureReferenceOwner(root)
    const now = Date.now()
    const day = todaySessionFolder(new Date(now))
    const rel = `${SESSIONI}/${day}/sub/Report-a3-antiloop.md`
    writeTemp(root, rel, `# A3 antiloop\n\n**Modalità:** standard\n${reportQrs()}`) // no capsula -> block se non fosse per stop_hook_active
    const result = runClaudeStopHook(root, { stop_hook_active: true })
    if (result.status !== 0) return [`A3-anti-loop: exit=${result.status} stderr=${result.stderr}`]
    let payload
    try { payload = result.stdout ? JSON.parse(result.stdout) : {} } catch { return [`A3-anti-loop: stdout non-JSON: ${result.stdout}`] }
    if (payload.decision === 'block') return [`A3-anti-loop: stop_hook_active=true dovrebbe passare (guardia anti-loop), ha bloccato`]
    return []
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function main() {
  const statusBefore = gitStatus()
  const manifest = loadManifest()
  const failures = []
  const all = [...manifest.frozen, ...manifest.supplemental]

  for (const c of all) {
    const result = runCase(c)
    const err = expectCodes(result, c.codes, c.expect)
    if (err) failures.push(`${c.id}: ${err}`)
    else console.log(`OK ${c.id}`)
  }

  const checks = [
    ['fixture drift', () => [testFixtureDrift()].filter(Boolean)],
    ['staged mismatch core', testStagedMismatch],
    ['CLI/core parity', () => [testCliParity()].filter(Boolean)],
    ['counterexamples + structure', testCounterexamplesAndStructure],
    ['verifier separations', testVerifierSeparations],
    ['product semantics', testProductSemantics],
    ['H-1.1 semantic counterexamples', testH11SemanticCounterexamples],
    ['H-1.1 report modes', testH11ReportModes],
    ['H-1.1 historical amendment', testH11HistoricalAmendment],
    ['report parser + modes', testReportParserModes],
    ['reference security', testReferenceSecurity],
    ['LOCK semantics', testLockSemantics],
    ['adapter contract', testAdapterContract, 'hook-precommit-cursor'],
    ['pre-commit integration', testPrecommitIntegration, 'hook-precommit-cursor'],
    ['H-1.1 append-only integration', testH11AppendOnlyIntegration],
    ['H-1.1 manifest integrity', testH11ManifestIntegrity],
    ['stop hook integration', testStopHookIntegration, 'hook-stop-cursor'],
    ['findRecentReportFiles recursive N1', testFindRecentReportFilesRecursive],
    ['stop hook ignores non-closure fixture probe', testStopHookIgnoresNonClosureFixture, 'hook-stop-cursor'],
    ['stop hook silence fixture-only probe', testStopHookSilenceWhenOnlyFixtureProbe, 'hook-stop-cursor'],
    ['stop hook ignores underscore probe paths', testStopHookIgnoresUnderscoreProbePath],
    ['stop hook silence complete subfolder report', testStopHookCompleteReportSilence, 'hook-stop-cursor'],
    ['H-1.3 core/CLI/stop/pre-commit parity', testH13SurfaceParity, 'hook-stop-cursor'],
    ['H-1.3 staged CLI full-snapshot parity', testH13StagedCliParity],
    ['H-1.3 staged CLI require-capsule', testH13StagedRequireCapsule],
    ['H-1.2 finalized report compatibility', testH12FinalizedReportCompatibility, 'sedute-storiche'],
    ['H-1.2 cross-file identity', testH12CrossFileIdentity],
    ['H-1.2 final amendment target', testH12FinalAmendmentTargetsFinal],
    ['H-1.3 amendment semantics', testH13AmendmentSemantics],
    ['H13-POST-L01 — previous_value_or_hash è il valore, mai un digest', testH13PreviousIsValueNotDigest],
    ['H-1.2 supplemental relations', testH12SupplementalRelations],
    ['H-1.2 manifest snapshot trust', testH12ManifestSnapshotTrust],
    ['H-1.3 manifest lifecycle + supplemental relations', testH13ManifestLifecycleAndRelations],
    ['H-1.2 semantic domains + UTF-8', testH12SemanticDomainsAndUtf8],
    ['H-1.2 report mode grammar', testH12ModeGrammar],
    ['H-1.3 historical mode scope + architecture', testH13HistoricalModeScopeAndArchitecture, 'sedute-storiche'],
    ['H-1.3 historical records + frozen immutability', testH13HistoricalRecordAndFixtureImmutability, 'sedute-storiche'],
    ['H-1.2 scoped report whitespace', testH12ScopedReportWhitespace, 'sedute-storiche'],
    ['coverage matrix', testMatrix],
    ['A1 — la guardia PROD di Claude è tracciata da git', testA1GuardProdTrackedByGit, 'guardie-e-hook-di-progetto'],
    ['A4 — il cablaggio dell\'hook Claude è tracciato e non trascina i file personali', testA4ClaudeSettingsTrackedNoPersonalFiles, 'guardie-e-hook-di-progetto'],
    ['A2 — guard-prod shared corpus (cursor+claude)', testA2GuardProdCorpus, 'guardie-e-hook-di-progetto'],
    ['A2 — guard-prod kit template static check', testA2KitTemplateStatic],
    ['A3 — Claude stop hook silence on complete report', testA3ClaudeStopHookSilenceOnComplete, 'guardie-e-hook-di-progetto'],
    ['A3 — Claude stop hook blocks missing Q/R answer', testA3ClaudeStopHookBlocksMissingAnswer, 'guardie-e-hook-di-progetto'],
    ['A3 — Claude stop hook blocks red capsule', testA3ClaudeStopHookBlocksRedCapsule, 'guardie-e-hook-di-progetto'],
    ['A3 — Claude stop hook anti-loop guard', testA3ClaudeStopHookAntiLoop, 'guardie-e-hook-di-progetto'],
  ]
  const nonApplicabili = []
  let eseguiti = 0
  for (const [name, fn, anchor] of checks) {
    const mancanti = anchor ? missingAnchors(anchor) : []
    if (mancanti.length) {
      nonApplicabili.push({ name, anchor, mancanti })
      console.log(`n/a ${name}  — ancora «${anchor}» assente: ${mancanti.join(', ')}`)
      continue
    }
    eseguiti++
    const errs = fn()
    if (errs.length) failures.push(...errs.map((err) => `${name}: ${err}`))
    else console.log(`OK ${name}`)
  }
  if (eseguiti === 0) failures.push('nessun gruppo eseguito: una suite che non esegue niente non e verde')

  const r1 = runCase(manifest.frozen[0])
  const r2 = runCase(manifest.frozen[0])
  if (JSON.stringify(r1) !== JSON.stringify(r2)) failures.push('determinism: full result differs across identical runs')
  else console.log('OK determinism')

  const statusAfter = gitStatus()
  if (statusBefore !== statusAfter) failures.push('suite changed the repository working tree')
  else console.log('OK no working-tree rewrite')

  if (failures.length) {
    console.error('\nFAILURES:')
    for (const failure of failures) console.error(' -', failure)
    process.exit(1)
  }
  const coda = nonApplicabili.length
    ? ` (+ ${nonApplicabili.length} non applicabili in questa repo: ${[...new Set(nonApplicabili.map((n) => n.anchor))].join(', ')})`
    : ''
  console.log(`\nH-1 suite green: ${all.length} fixture cases + ${eseguiti} contract/integration groups${coda}`)
}

main()
