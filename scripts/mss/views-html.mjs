#!/usr/bin/env node
/**
 * Cruscotto MSS in HTML — invocabile a mano, fuori dai cancelli validate.
 *
 * Legge M+D dallo stesso parser di generate:mss:views (plan-parse + deriveMatteoDashboard).
 * Solo in HTML: data git HEAD + registro cantieri da roadmap privata (opzionale).
 * Scrive FUORI da docs/ versionati; default = scratchpad Cursor.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { classifyPlanState, parsePlanBoard } from './plan-parse.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'
import { deriveMatteoDashboard } from './views.mjs'

const ROOT = repoRootFromModule(import.meta.url)

const DEFAULT_PLAN = join(ROOT, 'docs', 'MetaSkillSystem', 'PLAN_V0.md')
const DEFAULT_ROADMAP = join(
  homedir(),
  'Documents',
  'Io-Claude',
  'Crescita professionale',
  '13_Roadmap_Complessiva.md',
)
const DEFAULT_OUT = join(
  homedir(),
  '.cursor',
  'projects',
  'c-Users-matte-MIO-Documents-GitHub-CalendarBackup-v2',
  'scratchpad',
  'cruscotto-lab',
  'cruscotto.html',
)

function gitLastCommitIso(root) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI'], { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

/**
 * Registro cantieri da §3 della roadmap privata. Sezione assente → [].
 * @param {string} text
 */
export function parseCantieriRoadmap(text) {
  const start = text.search(/\n## §3 — I cantieri/)
  if (start < 0) return []
  const block = text.slice(start)
  const end = block.search(/\n## §4 /)
  const section = end < 0 ? block : block.slice(0, end)
  const rows = section
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !/^\|[\s|:-]+\|$/.test(l.trim()))
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
    .filter((cells) => cells.length >= 4 && /^C\d|SYS-1/.test(cells[0].replace(/\*\*/g, '')))
  return rows.map((c) => ({
    id: c[0].replace(/\*\*/g, ''),
    nome: c[1].replace(/\*\*/g, ''),
    stato: c[2],
    ingresso: c[3],
  }))
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function mdToHtml(md) {
  return md
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split('|').map((c) => c.trim())
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`
    })
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (m) => `<table>${m}</table>`)
    .replace(/^- \[([^\]]+)\]\(([^)]+)\)$/gm, '<li><a href="$2">$1</a></li>')
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^- `([^`]+)` (.+)$/gm, '<li><code>$1</code> $2</li>')
    .replace(/^\*([^*]+)\*$/gm, '<p><em>$1</em></p>')
    .replace(/\n\n/g, '\n')
    .split('\n')
    .map((line) => {
      if (/^<(h2|blockquote|table|ul|p|tr|td)/.test(line)) return line
      if (line.trim() === '') return ''
      return `<p>${line}</p>`
    })
    .join('\n')
}

function bucketCounts(planText) {
  const board = parsePlanBoard(planText)
  const counts = { fatta: 0, 'con-riserva': 0, 'da-fare': 0, 'non-classificata': 0 }
  for (const row of board) counts[classifyPlanState(row.stato)]++
  return counts
}

function assertOutNotInVersionedDocs(outPath, root) {
  const docsRoot = resolve(root, 'docs')
  const resolved = resolve(outPath)
  const rel = resolved.slice(docsRoot.length)
  const underDocs =
    resolved === docsRoot ||
    (resolved.toLowerCase().startsWith(docsRoot.toLowerCase()) && (rel.startsWith('\\') || rel.startsWith('/')))
  if (underDocs) {
    throw new Error(
      `MSS-VIEWS-HTML-OUT: rifiuto scrittura sotto docs/ versionati (${resolved}). Usa --out fuori dal repo (es. scratchpad).`,
    )
  }
}

/**
 * @param {{ mdBody: string, gitIso: string|null, cantieri: Array<{id:string,nome:string,stato:string,ingresso:string}>, counts: Record<string, number> }} opts
 */
export function buildHtml({ mdBody, gitIso, cantieri, counts }) {
  const cantieriSection =
    cantieri.length === 0
      ? ''
      : `
    <section>
      <h2>Registro cantieri (roadmap privata §3)</h2>
      <table>
        <thead><tr><th>ID</th><th>Cantiere</th><th>Stato</th><th>Ingresso</th></tr></thead>
        <tbody>
${cantieri
  .map(
    (c) =>
      `        <tr><td><code>${escapeHtml(c.id)}</code></td><td>${escapeHtml(c.nome)}</td><td>${escapeHtml(c.stato)}</td><td><small>${escapeHtml(c.ingresso)}</small></td></tr>`,
  )
  .join('\n')}
        </tbody>
      </table>
    </section>`

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cruscotto MSS</title>
  <style>
    :root { --bg: #0f1419; --card: #1a2332; --text: #e7ecf3; --muted: #8b9cb3; --accent: #5b9fd4; --warn: #e8a838; --ok: #6bc98a; --err: #e86a6a; }
    * { box-sizing: border-box; }
    body { font-family: system-ui, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 1.5rem; line-height: 1.55; }
    .wrap { max-width: 960px; margin: 0 auto; }
    header { border-bottom: 1px solid #2a3548; padding-bottom: 1rem; margin-bottom: 1.5rem; }
    h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
    .meta { color: var(--muted); font-size: .9rem; }
    .stats { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
    .stat { background: var(--card); padding: .75rem 1rem; border-radius: 8px; min-width: 120px; }
    .stat strong { display: block; font-size: 1.4rem; color: var(--accent); }
    section { background: var(--card); border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; }
    h2 { font-size: 1.1rem; margin-top: 0; color: var(--accent); border-bottom: 1px solid #2a3548; padding-bottom: .4rem; }
    blockquote { border-left: 3px solid var(--muted); margin: .5rem 0; padding-left: 1rem; color: var(--muted); font-size: .92rem; }
    code { background: #0a0e14; padding: .1em .35em; border-radius: 4px; font-size: .9em; }
    table { width: 100%; border-collapse: collapse; font-size: .88rem; margin: .5rem 0; }
    th, td { border: 1px solid #2a3548; padding: .45rem .6rem; text-align: left; vertical-align: top; }
    th { background: #121820; color: var(--muted); }
    a { color: var(--accent); }
    ul { padding-left: 1.2rem; }
    .footer { color: var(--muted); font-size: .85rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Cruscotto MSS</h1>
      <p class="meta">Metodo M/D · generato a mano da <code>scripts/mss/views-html.mjs</code> (fuori da validate:mss:all)</p>
      <p class="meta"><strong>Da quanto è fermo (git HEAD):</strong> ${gitIso ? escapeHtml(gitIso) : 'non ricostruibile'}</p>
      <div class="stats">
        <div class="stat"><strong>${counts.fatta}</strong> Fatte</div>
        <div class="stat"><strong>${counts['con-riserva']}</strong> Con riserva</div>
        <div class="stat"><strong>${counts['da-fare']}</strong> Da fare</div>
        <div class="stat"><strong>${counts['non-classificata']}</strong> Non classificate</div>
      </div>
    </header>
    <section class="cruscotto">${mdToHtml(mdBody)}</section>${cantieriSection}
    <p class="footer">HTML standalone — cantieri (se presenti) da roadmap privata; non finiscono nel .md versionato né nei cancelli CI.</p>
  </div>
</body>
</html>
`
}

function parseArgs(argv) {
  const out = { out: DEFAULT_OUT, plan: DEFAULT_PLAN, roadmap: DEFAULT_ROADMAP, help: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') {
      out.help = true
      continue
    }
    if (a === '--out' || a === '--plan' || a === '--roadmap') {
      const val = argv[++i]
      if (!val || val.startsWith('--')) {
        throw new Error(`MSS-VIEWS-HTML-ARGS: ${a} richiede un path.`)
      }
      if (a === '--out') out.out = resolve(val)
      if (a === '--plan') out.plan = resolve(val)
      if (a === '--roadmap') out.roadmap = resolve(val)
      continue
    }
    throw new Error(`MSS-VIEWS-HTML-ARGS: argomento sconosciuto «${a}». Usa --help.`)
  }
  return out
}

/**
 * @param {{ root?: string, planPath?: string, roadmapPath?: string, outPath?: string }} [opts]
 */
export function runViewsHtml({
  root = ROOT,
  planPath = DEFAULT_PLAN,
  roadmapPath = DEFAULT_ROADMAP,
  outPath = DEFAULT_OUT,
} = {}) {
  assertOutNotInVersionedDocs(outPath, root)
  if (!existsSync(planPath)) {
    throw new Error(`MSS-VIEWS-HTML-PLAN: owner assente «${planPath}».`)
  }
  const planText = readFileSync(planPath, 'utf8')
  const mdBody = deriveMatteoDashboard(planText)
  const gitIso = gitLastCommitIso(root)
  let cantieri = []
  try {
    if (existsSync(roadmapPath)) {
      cantieri = parseCantieriRoadmap(readFileSync(roadmapPath, 'utf8'))
    }
  } catch {
    cantieri = []
  }
  const counts = bucketCounts(planText)
  const html = buildHtml({ mdBody, gitIso, cantieri, counts })
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html, 'utf8')
  return { outPath, gitIso, cantieriCount: cantieri.length, counts }
}

function usage() {
  return `Uso: node scripts/mss/views-html.mjs [--out path] [--plan path] [--roadmap path]

  Genera un HTML del cruscotto (M+D da PLAN_V0 + git HEAD + cantieri roadmap §3 se leggibile).
  Scrive fuori da docs/ versionati. Non fa parte di validate:mss:all.

  Default --out: scratchpad Cursor cruscotto-lab/cruscotto.html
  Default --plan: docs/MetaSkillSystem/PLAN_V0.md
  Default --roadmap: Documents/Io-Claude/.../13_Roadmap_Complessiva.md
`
}

function main() {
  let args
  try {
    args = parseArgs(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    return 2
  }
  if (args.help) {
    process.stdout.write(usage())
    return 0
  }
  const result = runViewsHtml({
    root: ROOT,
    planPath: args.plan,
    roadmapPath: args.roadmap,
    outPath: args.out,
  })
  process.stdout.write(
    `Scritto ${result.outPath} (git=${result.gitIso || 'n/d'}, cantieri=${result.cantieriCount})\n`,
  )
  return 0
}

if (isMainModule(import.meta.url)) {
  try {
    process.exitCode = main()
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}
