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
import { classifyPlanState, parsePlanBoard, parsePlanGate, parsePlanLastCycle } from './plan-parse.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'

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

function plainText(value) {
  return String(value || '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

const WORK_EXPLANATIONS = {
  'WP-1': {
    title: 'Provare il sistema durante una sessione di lavoro reale',
    action: 'Usare il sistema mentre un agente svolge un lavoro vero.',
    purpose: 'Capire se raccoglie le informazioni senza perderle o inventarle.',
  },
  'WP-2': {
    title: 'Ordinare le informazioni delle sessioni già svolte',
    action: 'Raccogliere e collegare le informazioni utili nei resoconti passati.',
    purpose: 'Ritrovare problemi e decisioni senza rileggere ogni chat.',
  },
  'WP-3': {
    title: 'Dare regole chiare al sistema degli agenti',
    action: 'Organizzare ruoli, regole e priorità in un unico sistema coerente.',
    purpose: 'Evitare istruzioni in conflitto o informazioni duplicate.',
  },
  'WP-4': {
    title: 'Controllare una sessione prima di chiuderla',
    action: 'Creare una verifica che intercetti dati mancanti, conflitti e lavori fuori obiettivo.',
    purpose: 'Sapere subito se un risultato è davvero pronto.',
  },
  'WP-5': {
    title: 'Mettere alla prova le regole con casi difficili',
    action: 'Testare il sistema con esempi che provano a farlo sbagliare.',
    purpose: 'Scoprire i punti deboli prima di usarlo stabilmente.',
  },
  'WP-6': {
    title: 'Decidere se rendere stabile il nuovo sistema',
    action: 'Valutare le prove raccolte e scegliere se sostituire il metodo attuale.',
    purpose: 'Fare il passaggio solo quando non si perdono informazioni importanti.',
  },
  'E-2': {
    title: 'Valutare controlli automatici più forti',
    action: 'Decidere quali errori il sistema deve bloccare da solo.',
    purpose: 'Ridurre gli errori ripetuti senza aggiungere regole inutili.',
  },
}

function workExplanation(row) {
  const known = WORK_EXPLANATIONS[row.id]
  if (known) return known
  const label = plainText(row.etichetta)
  return {
    title: label || 'Completare un miglioramento del sistema',
    action: `Lavorare su ${label || 'questa parte del sistema'}.`,
    purpose: 'Rendere il lavoro degli agenti più affidabile e più facile da controllare.',
  }
}

function workAvailability(row) {
  const status = String(row.stato || '').toUpperCase()
  if (status.includes('NO-GO')) return 'Fermo: richiede una tua decisione esplicita prima di partire.'
  if (status.startsWith('BLOCCATO')) return 'Parte dopo il primo utilizzo reale del sistema.'
  if (status.startsWith('NON INIZIATO')) return 'Da preparare quando arriverà il suo turno.'
  return 'Da valutare.'
}

function currentFocus(gate, lastCycle) {
  if (/RIAPERTURA|WP-1|D27/i.test(gate.nextLabel)) {
    return {
      title: 'Nessun nuovo lavoro è autorizzato in questo momento',
      text: 'Le correzioni previste sono concluse. La prima prova con un lavoro reale resta ferma finché non deciderai di avviarla.',
      action: 'Quando vorrai ripartire, la scelta da fare sarà se autorizzare questa prima prova controllata.',
    }
  }
  return {
    title: 'Il prossimo lavoro è pronto per essere aperto',
    text: lastCycle ? `L’ultimo miglioramento è stato concluso; ora si può passare alla fase successiva.` : 'Il piano indica il prossimo lavoro da svolgere.',
    action: `Il prossimo passo è: ${plainText(gate.nextLabel)}.`,
  }
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
 * @param {{ focus: {title:string,text:string,action:string}, work: Array<{title:string,action:string,purpose:string,availability:string}>, completed:number, cantieri: Array<{nome:string,stato:string}> }} opts
 */
export function buildHtml({ focus, work, completed, cantieri }) {
  const workCards = work
    .map(
      (item) => `
        <article class="work-card">
          <p class="eyebrow">Cosa fare</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p><strong>Intervento:</strong> ${escapeHtml(item.action)}</p>
          <p><strong>Serve a:</strong> ${escapeHtml(item.purpose)}</p>
          <p class="availability">${escapeHtml(item.availability)}</p>
        </article>`,
    )
    .join('\n')
  const otherProjects = cantieri.length
    ? `<details><summary>Altri progetti che stai seguendo</summary><ul>${cantieri
        .map((c) => `<li><strong>${escapeHtml(plainText(c.nome))}.</strong> ${escapeHtml(plainText(c.stato))}</li>`)
        .join('')}</ul></details>`
    : ''

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Il tuo sistema di lavoro</title>
  <style>
    :root { --bg:#f6f5f1; --surface:#fff; --ink:#22211e; --muted:#6c6962; --line:#dedbd3; --accent:#ba5d3b; --accent-soft:#f8e9e2; --ok:#286448; --ok-soft:#e4f1e8; --warn:#81520f; --warn-soft:#f8efd9; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.55 Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
    .wrap { width:min(1040px, calc(100% - 32px)); margin:0 auto; padding:48px 0 64px; }
    header { display:flex; justify-content:space-between; gap:24px; align-items:flex-start; margin-bottom:28px; }
    h1 { font-size:clamp(2rem, 5vw, 3rem); line-height:1.08; letter-spacing:-.045em; margin:0; }
    .intro { color:var(--muted); max-width:590px; margin:10px 0 0; }
    .done { flex:0 0 auto; background:var(--ok-soft); color:var(--ok); border-radius:14px; padding:14px 18px; font-size:.9rem; }
    .done strong { display:block; font-size:1.5rem; line-height:1.05; }
    .focus { background:var(--ink); color:#fff; padding:28px; border-radius:20px; margin-bottom:38px; }
    .focus .eyebrow { color:#eebdab; } .focus h2 { font-size:clamp(1.35rem, 3vw, 2rem); line-height:1.15; margin:4px 0 10px; letter-spacing:-.025em; }
    .focus p { max-width:730px; margin:0 0 12px; color:#f0ece6; } .focus .next { color:#eebdab; margin-bottom:0; }
    .section-heading { max-width:690px; margin-bottom:18px; } .section-heading h2 { font-size:1.45rem; margin:0 0 4px; letter-spacing:-.025em; } .section-heading p { margin:0; color:var(--muted); }
    .work-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
    .work-card { background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:22px; box-shadow:0 2px 9px #3d39310b; }
    .work-card h3 { margin:4px 0 14px; font-size:1.15rem; line-height:1.25; letter-spacing:-.015em; } .work-card p { margin:8px 0; } .eyebrow { color:var(--accent); font-weight:700; font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; margin:0; }
    .availability { display:inline-block; background:var(--warn-soft); color:var(--warn); border-radius:8px; padding:5px 8px; font-size:.86rem; margin-top:14px !important; }
    details { margin-top:30px; background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:14px 18px; color:var(--muted); } summary { cursor:pointer; color:var(--ink); font-weight:650; } details ul { margin:12px 0 0; padding-left:20px; } details li { margin:6px 0; }
    footer { color:var(--muted); font-size:.88rem; margin-top:32px; }
    @media (max-width:700px) { .wrap { padding-top:28px; } header { display:block; } .done { display:inline-block; margin-top:18px; } .work-grid { grid-template-columns:1fr; } .focus { padding:22px; } }
  </style>
</head>
<body>
  <main class="wrap">
    <header>
      <div><h1>Il tuo sistema di lavoro</h1><p class="intro">Qui vedi i lavori con il loro significato: cosa viene migliorato, perché serve e quando può partire.</p></div>
      <div class="done"><strong>${completed}</strong> miglioramenti già conclusi</div>
    </header>
    <section class="focus" aria-labelledby="focus-title">
      <p class="eyebrow">Dove siamo ora</p><h2 id="focus-title">${escapeHtml(focus.title)}</h2>
      <p>${escapeHtml(focus.text)}</p><p class="next"><strong>Prossimo passo:</strong> ${escapeHtml(focus.action)}</p>
    </section>
    <section aria-labelledby="work-title"><div class="section-heading"><h2 id="work-title">I prossimi lavori, spiegati in modo diretto</h2><p>Ogni scheda dice quale parte del sistema viene toccata, che intervento riceve e quale risultato deve produrre.</p></div>
      <div class="work-grid">${workCards}</div>
    </section>
    ${otherProjects}
    <footer>Questa pagina nasconde volontariamente i codici interni. Se vuoi il dettaglio tecnico, chiedilo sull’attività che ti interessa.</footer>
  </main>
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
  const board = parsePlanBoard(planText)
  const gate = parsePlanGate(planText)
  const lastCycle = parsePlanLastCycle(planText)
  const work = board
    .filter((row) => classifyPlanState(row.stato) === 'da-fare' || row.id === 'E-2')
    .map((row) => ({ ...workExplanation(row), availability: workAvailability(row) }))
  const gitIso = gitLastCommitIso(root)
  let cantieri = []
  try {
    if (existsSync(roadmapPath)) {
      cantieri = parseCantieriRoadmap(readFileSync(roadmapPath, 'utf8'))
    }
  } catch {
    cantieri = []
  }
  const completed = board.filter((row) => classifyPlanState(row.stato) === 'fatta').length
  const html = buildHtml({ focus: currentFocus(gate, lastCycle), work, completed, cantieri })
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html, 'utf8')
  return { outPath, gitIso, cantieriCount: cantieri.length, workCount: work.length }
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
