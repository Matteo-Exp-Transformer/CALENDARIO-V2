#!/usr/bin/env node
/**
 * mss:review (T2 / SK-3) — «che cosa ho toccato» in sola lettura.
 *
 * Contratto minimo: STRATEGIA-scheletro-mss-21-08-26.md §3.2.
 * Produce una tabella di fatti, non un giudizio di merito. Non scrive report,
 * non appende capsule, non modifica il working tree.
 *
 *   npm run mss:review -- [--base <ref>] [--report <path>] [--json]
 *
 * Classificazione L1–L6: sola mappa già dichiarata in
 * docs/MetaSkillSystem/archive/README.md (+ prefissi L5 di move.mjs). Se un path
 * non cade nella mappa → «livello non mappato», senza inventare.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { REPORT_PATH_RE } from './adapter.mjs'
import { CONFIG } from './config.mjs'
import { findCapsuleHeadings } from './parse.mjs'
import { auditQuestions } from './report-questions.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'

const ROOT = repoRootFromModule(import.meta.url)

/** Owner di stato SYS-1 / pack — da config installazione (D18). */
export function stateOwnerPaths(config = CONFIG) {
  const out = []
  if (config.owners?.plan) out.push(toPosix(config.owners.plan))
  if (config.owners?.pack) out.push(toPosix(config.owners.pack))
  return out
}

function toPosix(p) {
  return String(p || '').replace(/\\/g, '/').replace(/^\.\//, '')
}

/**
 * Classifica un path repo-relativo secondo archive/README.md.
 * Non inventa livelli: fuori mappa → livello null («non mappato»).
 */
export function classifyPath(relPosix) {
  const p = toPosix(relPosix)
  if (!p) {
    return { level: null, label: 'livello non mappato', frozen: false, private: false }
  }

  if (p.startsWith('docs/_lavoro/') || /(^|\/)\.env(\.|$)/.test(p) || p.startsWith('.env')) {
    return { level: 'L6', label: 'Privato / sigillato', frozen: true, private: true }
  }

  if (
    p.startsWith('scripts/mss/') ||
    p.startsWith('docs/MetaSkillSystem/fixtures/') ||
    p.startsWith('docs/MetaSkillSystem/tests/') ||
    p === 'docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json' ||
    p.startsWith('.cursor/hooks/') ||
    p.startsWith('.husky/')
  ) {
    return { level: 'L5', label: 'Prove tecniche', frozen: true, private: false }
  }

  if (p.startsWith('docs/Sessioni di lavoro/') || p.startsWith(`${CONFIG.sessionsDir}/`)) {
    return { level: 'L4', label: 'Storia report', frozen: false, private: false }
  }

  if (p.startsWith('docs/MetaSkillSystem/Senior-Eval-Pack/')) {
    return { level: 'L2', label: 'Pacchetti', frozen: false, private: false }
  }

  if (
    p.startsWith('docs/MetaSkillSystem/archive/') ||
    p === 'docs/SESSION_LOG.md' ||
    p === 'docs/FOLLOW_UP.md' ||
    /\/(HANDOFF|ROADMAP|CRUSCOTTO)[^/]*\.md$/i.test(p) ||
    /\/indices\//.test(p)
  ) {
    return { level: 'L3', label: 'Viste / indici', frozen: false, private: false }
  }

  if (p.startsWith('docs/MetaSkillSystem/')) {
    const rest = p.slice('docs/MetaSkillSystem/'.length)
    if (!rest.includes('/')) {
      return { level: 'L1', label: 'Kernel / contratti', frozen: false, private: false }
    }
  }

  return { level: null, label: 'livello non mappato', frozen: false, private: false }
}

/** Regole MSS citabili (solo citazione di fonti già scritte — D18). */
export function applicableRulesForPath(relPosix, owners = stateOwnerPaths()) {
  const p = toPosix(relPosix)
  const cls = classifyPath(p)
  const rules = []
  if (owners.includes(p)) {
    rules.push({
      id: 'owner-stato',
      citation: 'PLAN_V0.md / MASTERPLAN_V0.md — owner unico di stato (archive/README.md §Owner)',
    })
  }
  if (cls.level === 'L5') {
    rules.push({
      id: 'L5-freeze',
      citation: 'archive/README.md — L5 FREEZE (D4): fixtures/tests/scripts/mss/hooks',
    })
  }
  if (cls.level === 'L6' || cls.private) {
    rules.push({
      id: 'L6-intangibile',
      citation: 'archive/README.md — L6 INTANGIBILE: solo puntatore, mai copy',
    })
  }
  if (p === 'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md') {
    rules.push({
      id: 'contratto-capsula',
      citation: 'CONTRATTO_CAPSULA_SESSIONE_V0.md — schema capsula (owner semantica)',
    })
  }
  if (p.startsWith('scripts/mss/') || p.startsWith('docs/MetaSkillSystem/tests/')) {
    rules.push({
      id: 'enforcement-motore',
      citation: 'scripts/mss/* + test:mss — enforcement reale (G/O/E non stimati qui)',
    })
  }
  return rules
}

function git(args, root) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).replace(/\s+$/, '')
  } catch {
    return null
  }
}

/** File toccati: porcelain + diff vs base (default HEAD). */
export function collectTouchedFiles(root = ROOT, { base = 'HEAD' } = {}) {
  const changed = new Set()
  const porcelain = git(['status', '--porcelain', '-uall'], root) || ''
  for (const line of porcelain.split('\n').filter(Boolean)) {
    const path = line.slice(3).trim().replace(/^"(.*)"$/, '$1')
    if (path.includes(' -> ')) changed.add(toPosix(path.split(' -> ').pop()))
    else changed.add(toPosix(path))
  }
  for (const cmd of [
    ['diff', '--name-only', base],
    ['diff', '--cached', '--name-only'],
  ]) {
    const out = git(cmd, root)
    if (out) out.split('\n').filter(Boolean).forEach((p) => changed.add(toPosix(p)))
  }
  return [...changed].sort()
}

export function findSessionReports(touchedFiles) {
  return touchedFiles.map(toPosix).filter((p) => REPORT_PATH_RE.test(p))
}

/**
 * Cosa manca sul report (fatti macchina): capsula, Q1–Q6, gate citati senza controls.
 * Non inventa: se il report non è leggibile → lo dichiara.
 */
export function inspectReportGaps(reportPath, content) {
  const gaps = []
  if (content == null) {
    gaps.push({ code: 'report-illeggibile', detail: `non leggo ${reportPath}` })
    return gaps
  }
  const headings = findCapsuleHeadings(content)
  if (headings.length === 0) {
    gaps.push({ code: 'capsula-assente', detail: 'nessuna sezione «Capsula MetaSkillSystem»' })
  }
  const q = auditQuestions(content)
  if (!q.hasSection) {
    gaps.push({ code: 'q1-q6-assenti', detail: 'nessuna domanda ❓ Qn nel report' })
  } else if (q.unanswered.length) {
    gaps.push({
      code: 'q1-q6-incomplete',
      detail: `senza risposta sostanziale: ${q.unanswered.join(', ')}`,
    })
  }
  const mentionsGate = /validate:mss|test:mss|git diff --check/i.test(content)
  const hasControlsBlock =
    /"controls"\s*:\s*\[/.test(content) || /\bcontrols\s*:\s*nessuno\b/i.test(content)
  if (mentionsGate && headings.length > 0 && !hasControlsBlock) {
    gaps.push({
      code: 'gate-senza-controls',
      detail: 'il report cita gate ma la capsula non espone controls[] / nessuno',
    })
  }
  if (mentionsGate && headings.length === 0) {
    gaps.push({
      code: 'gate-senza-prova-capsula',
      detail: 'gate dichiarati nel testo senza capsula che li registri',
    })
  }
  return gaps
}

/**
 * Comandi ricostruibili solo da fonti macchina (controls in capsula JSONL).
 * Mai inventati.
 */
export function extractControlsFromReport(content) {
  if (!content) return []
  const fence = content.match(/```jsonl\s*([\s\S]*?)```/i)
  if (!fence) return []
  const lines = fence[1].split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const controls = []
  for (const line of lines) {
    let obj
    try {
      obj = JSON.parse(line)
    } catch {
      continue
    }
    if (obj?.record_type !== 'session_event') continue
    const c = obj.event?.controls
    if (c === 'nessuno') {
      controls.push({ source: 'capsula', declaration: 'nessuno' })
      continue
    }
    if (!Array.isArray(c)) continue
    for (const item of c) {
      controls.push({
        source: 'capsula',
        control_id: item.control_id,
        criterio: item.criterio,
        esito: item.esito,
        esecutore: item.esecutore,
      })
    }
  }
  return controls
}

/**
 * Cuore di T2: fatti su una seduta (lista file + eventuali report).
 * @returns {{ files, warnings, gaps, rules, controls, clean }}
 */
export function reviewSession({
  files = [],
  reportContents = new Map(),
  owners = stateOwnerPaths(),
} = {}) {
  const fileRows = files.map((path) => {
    const cls = classifyPath(path)
    const isOwner = owners.includes(toPosix(path))
    return {
      path: toPosix(path),
      level: cls.level,
      level_label: cls.label,
      owner_di_stato: isOwner,
      congelato_L5: cls.level === 'L5',
      privato_L6: cls.level === 'L6' || cls.private,
      regole: applicableRulesForPath(path, owners),
    }
  })

  const warnings = []
  for (const row of fileRows) {
    if (row.owner_di_stato) {
      warnings.push({ code: 'owner-stato', path: row.path, detail: '⚠️ toccato owner di stato' })
    }
    if (row.congelato_L5) {
      warnings.push({ code: 'L5-congelato', path: row.path, detail: '⚠️ path congelato (L5 prove)' })
    }
    if (row.privato_L6) {
      warnings.push({ code: 'L6-privato', path: row.path, detail: '⚠️ path privato/intangibile (L6)' })
    }
    if (row.level == null) {
      warnings.push({
        code: 'livello-non-mappato',
        path: row.path,
        detail: 'livello non mappato (nessuna classificazione L1–L6 inventata)',
      })
    }
  }

  const reports = findSessionReports(files)
  const gaps = []
  if (reports.length === 0 && files.some((f) => toPosix(f).startsWith('docs/') || toPosix(f).startsWith('scripts/'))) {
    // Seduta sostanziale senza Report-* tra i toccati: fatto, non giudizio.
    const hasSubstantive = files.some((f) => {
      const p = toPosix(f)
      return !REPORT_PATH_RE.test(p)
    })
    if (hasSubstantive) {
      gaps.push({
        code: 'report-mancante',
        detail: 'nessun Report-/Verbale- tra i file toccati della seduta',
      })
    }
  }
  for (const reportPath of reports) {
    const content = reportContents.has(reportPath)
      ? reportContents.get(reportPath)
      : null
    gaps.push(...inspectReportGaps(reportPath, content).map((g) => ({ ...g, path: reportPath })))
  }

  const controls = []
  for (const reportPath of reports) {
    const content = reportContents.get(reportPath)
    if (content == null) continue
    for (const c of extractControlsFromReport(content)) {
      controls.push({ ...c, report: reportPath })
    }
  }

  const rules = []
  const seen = new Set()
  for (const row of fileRows) {
    for (const r of row.regole) {
      if (seen.has(r.id + r.citation)) continue
      seen.add(r.id + r.citation)
      rules.push(r)
    }
  }

  const problemCodes = new Set([
    'owner-stato',
    'L5-congelato',
    'L6-privato',
    'capsula-assente',
    'q1-q6-assenti',
    'q1-q6-incomplete',
    'gate-senza-controls',
    'gate-senza-prova-capsula',
    'report-mancante',
    'report-illeggibile',
  ])
  const problems = [
    ...warnings.filter((w) => problemCodes.has(w.code)),
    ...gaps.filter((g) => problemCodes.has(g.code)),
  ]

  return {
    files: fileRows,
    warnings,
    gaps,
    rules,
    controls,
    problems,
    clean: problems.length === 0,
  }
}

export function parseReviewArgs(argv) {
  const args = argv.slice(2)
  const out = { help: false, json: false, base: 'HEAD', report: null, unknown: [] }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--help' || a === '-h') out.help = true
    else if (a === '--json') out.json = true
    else if (a === '--base') out.base = args[++i] || null
    else if (a === '--report') out.report = args[++i] || null
    else if (a.startsWith('-')) out.unknown.push(a)
    else out.unknown.push(a)
  }
  return out
}

function usage() {
  return [
    'mss:review (T2/SK-3) — che cosa ho toccato (sola lettura).',
    '',
    '  npm run mss:review -- [--base <ref>] [--report <path>] [--json]',
    '',
    '  --base <ref>     confronto diff (default: HEAD)',
    '  --report <path>  forza ispezione di un report (oltre a quelli nel diff)',
    '  --json           emette JSON invece della tabella testo',
    '',
    'Non scrive file. Non inventa livelli L1–L6 fuori dalla mappa archive/README.md.',
  ].join('\n')
}

function renderText(result, { base, head, branch }) {
  const L = []
  L.push('mss:review — fatti della seduta (sola lettura)')
  L.push(`base=${base} · branch=${branch || 'non_osservato'} · HEAD=${head || 'non_osservato'}`)
  L.push('')
  L.push('## File toccati')
  if (!result.files.length) {
    L.push('(nessun file nel perimetro)')
  } else {
    L.push('| Path | Livello | Owner | L5 | L6 |')
    L.push('|---|---|---|---|---|')
    for (const f of result.files) {
      const liv = f.level || 'non mappato'
      L.push(
        `| ${f.path} | ${liv} (${f.level_label}) | ${f.owner_di_stato ? '⚠️ sì' : 'no'} | ${f.congelato_L5 ? '⚠️' : '—'} | ${f.privato_L6 ? '⚠️' : '—'} |`,
      )
    }
  }
  L.push('')
  L.push('## Avvisi')
  if (!result.warnings.length) L.push('(nessuno)')
  else result.warnings.forEach((w) => L.push(`- [${w.code}] ${w.path || ''} — ${w.detail}`))
  L.push('')
  L.push('## Regole MSS citabili (solo citazione)')
  if (!result.rules.length) L.push('(nessuna regola mappata ai path toccati)')
  else result.rules.forEach((r) => L.push(`- ${r.id}: ${r.citation}`))
  L.push('')
  L.push('## Cosa manca')
  if (!result.gaps.length) L.push('(niente di ricostruibile come mancanza)')
  else result.gaps.forEach((g) => L.push(`- [${g.code}] ${g.path || ''} — ${g.detail}`))
  L.push('')
  L.push('## Comandi/esiti (solo da capsula, se presenti)')
  if (!result.controls.length) {
    L.push('(non ricostruibili — nessuna capsula con controls[] nei report ispezionati)')
  } else {
    for (const c of result.controls) {
      if (c.declaration === 'nessuno') L.push(`- ${c.report}: controls=nessuno`)
      else L.push(`- ${c.control_id}: ${c.esito} — ${c.criterio || c.esecutore || ''}`)
    }
  }
  L.push('')
  L.push(result.clean ? 'Esito fatti: seduta senza problemi mappati.' : `Esito fatti: ${result.problems.length} problema/i mappati.`)
  return L.join('\n')
}

export function runReview(argv = process.argv, {
  root = ROOT,
  collectFiles = collectTouchedFiles,
  readFile = (rel) => {
    const abs = resolve(root, rel)
    if (!existsSync(abs)) return null
    try {
      return readFileSync(abs, 'utf8')
    } catch {
      return null
    }
  },
  owners = stateOwnerPaths(),
} = {}) {
  const args = parseReviewArgs(argv)
  if (args.help) {
    return { exitCode: 0, stdout: usage(), stderr: '', result: null }
  }
  if (args.unknown.length || !args.base) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `${usage()}\n\nArgomenti non validi: ${args.unknown.join(' ') || '--base mancante'}\n`,
      result: null,
    }
  }

  const files = collectFiles(root, { base: args.base })
  if (args.report) {
    const rel = toPosix(args.report)
    if (!files.includes(rel)) files.push(rel)
    files.sort()
  }

  const reportContents = new Map()
  for (const p of findSessionReports(files)) {
    reportContents.set(p, readFile(p))
  }
  if (args.report) {
    const rel = toPosix(args.report)
    if (!reportContents.has(rel)) reportContents.set(rel, readFile(rel))
  }

  const result = reviewSession({ files, reportContents, owners })
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], root)
  const head = git(['rev-parse', '--short', 'HEAD'], root)

  if (args.json) {
    return {
      exitCode: 0,
      stdout: `${JSON.stringify({ base: args.base, branch, head, ...result }, null, 2)}\n`,
      stderr: '',
      result,
    }
  }
  return {
    exitCode: 0,
    stdout: `${renderText(result, { base: args.base, head, branch })}\n`,
    stderr: '',
    result,
  }
}

function main() {
  const { exitCode, stdout, stderr } = runReview(process.argv)
  if (stdout) process.stdout.write(stdout)
  if (stderr) process.stderr.write(stderr)
  process.exitCode = exitCode
}

if (isMainModule(import.meta.url)) main()
