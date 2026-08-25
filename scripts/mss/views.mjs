#!/usr/bin/env node
/**
 * Viste MSS generate — derivate dagli owner, mai fonti di stato.
 *
 * Una vista e' modificabile solo fra i propri marcatori. Fuori resta testo umano: il generatore
 * non puo' cancellare contesto, istruzioni o collegamenti scritti per le persone.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import {
  classifyPlanState,
  parsePlanBoard,
  parsePlanGate,
  parsePlanGlosses,
  parsePlanLastCycle,
  validatePlanGlosses,
} from './plan-parse.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'

const ROOT = repoRootFromModule(import.meta.url)

export const VIEWS = Object.freeze([
  Object.freeze({
    id: 'cruscotto-matteo',
    owner: 'docs/MetaSkillSystem/PLAN_V0.md',
    ownerKind: 'plan-file',
    target: 'docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md',
  }),
  Object.freeze({
    id: 'roadmap-senior',
    owner: 'docs/MetaSkillSystem/PLAN_V0.md',
    ownerKind: 'plan-file',
    target: 'docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md',
  }),
  Object.freeze({
    id: 'handoff-senior',
    owner: 'docs/MetaSkillSystem/PLAN_V0.md',
    ownerKind: 'plan-file',
    target: 'docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md',
  }),
  Object.freeze({
    id: 'report-index',
    owner: 'docs/Sessioni di lavoro',
    ownerKind: 'sessions-dir',
    target: 'docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md',
  }),
])

const REPORT_FILE_RE = /^Report-.+\.md$/i

const markers = (id) => ({
  start: `<!-- mss:generated ${id} inizio -->`,
  end: `<!-- mss:generated ${id} fine -->`,
})

function glossaMap(glosses) {
  return new Map(glosses.map((g) => [g.id, g.glossa]))
}

function displayLabel(row, glossesById) {
  return glossesById.get(row.id) || row.etichetta || row.id
}

function bucketBoard(board, glossesById) {
  const buckets = { fatta: [], 'con-riserva': [], 'da-fare': [], 'non-classificata': [] }
  for (const row of board) {
    const bucket = classifyPlanState(row.stato)
    buckets[bucket].push({ ...row, display: displayLabel(row, glossesById) })
  }
  return buckets
}

function formatLavagnaCell(items, index) {
  const r = items[index]
  return r ? `\`${r.id}\` ${r.display}` : ''
}

function readPlanOwner(planText) {
  let gate
  try {
    gate = parsePlanGate(planText)
  } catch (error) {
    throw new Error(error.message.replace(/^MSS-PLAN-UNREADABLE:/, 'MSS-VIEWS-OWNER-UNREADABLE:'))
  }
  const board = parsePlanBoard(planText)
  const glosses = parsePlanGlosses(planText)
  const glossesById = glossaMap(glosses)
  return {
    gate,
    board,
    glosses,
    glossesById,
    validation: validatePlanGlosses(board, glosses),
    buckets: bucketBoard(board, glossesById),
    lastCycle: parsePlanLastCycle(planText),
  }
}

function bannerLines(ownerHref) {
  return [
    `> Generato da \`npm run generate:mss:views\` leggendo il solo owner [\`PLAN_V0.md\`](${ownerHref}).`,
    '> Questa vista non possiede stato: se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.',
    '',
  ]
}

function bannerLinesSessionsFs(ownerRel) {
  return [
    `> Generato da \`npm run generate:mss:views\` scansionando il filesystem owner [\`${ownerRel}\`](../../../Sessioni%20di%20lavoro/).`,
    '> **Owner = filesystem** (non `PLAN_V0.md`): elenco di `Report-*.md` sotto le sessioni, senza metadati inventati.',
    '> Se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.',
    '',
  ]
}

/** Chiave ordinabile YY-MM-DD da cartella `DD-MM-YY`; cartelle non data restano in coda. */
export function sessionFolderSortKey(name) {
  const m = /^(\d{2})-(\d{2})-(\d{2})$/.exec(name)
  if (!m) return `~${name}`
  const [, dd, mm, yy] = m
  return `20${yy}-${mm}-${dd}`
}

function isProbePathSegment(name) {
  return name.startsWith('_')
}

/**
 * Elenco ricorsivo di `Report-*.md` sotto sessionsDir. Salta segmenti `_…` (path-prova hook).
 * Nessun filtro di dominio: l'owner e' il disco, non un catalogo curato.
 */
export function listSessionReportPaths(root, sessionsRel = 'docs/Sessioni di lavoro') {
  const base = join(root, ...sessionsRel.split('/'))
  const out = []
  const walk = (dir) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (isProbePathSegment(entry.name)) continue
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.isFile() || !REPORT_FILE_RE.test(entry.name)) continue
      out.push(relative(root, full).replace(/\\/g, '/'))
    }
  }
  if (existsSync(base) && statSync(base).isDirectory()) walk(base)
  out.sort((a, b) => {
    const partsA = a.split('/')
    const partsB = b.split('/')
    const folderA = partsA[partsA.length - 2] || ''
    const folderB = partsB[partsB.length - 2] || ''
    const byFolder = sessionFolderSortKey(folderA).localeCompare(sessionFolderSortKey(folderB))
    if (byFolder !== 0) return byFolder
    return a.localeCompare(b)
  })
  return out
}

/**
 * Indice report — vista derivata dal filesystem delle sessioni (Q-A = genera vista).
 * @param {{ root: string, sessionsRel?: string }} opts
 */
export function deriveReportIndex({ root, sessionsRel = 'docs/Sessioni di lavoro' }) {
  const paths = listSessionReportPaths(root, sessionsRel)
  const lines = []
  lines.push(...bannerLinesSessionsFs(sessionsRel))
  lines.push('## Inventario `Report-*.md` (da disco)')
  lines.push('')
  lines.push(
    'Raggruppato per cartella giorno. Nome file = etichetta (nessun «tipo» dedotto). Path relativi alla root del repo.',
  )
  lines.push('')

  const prefix = `${sessionsRel.replace(/\\/g, '/')}/`
  /** @type {Map<string, string[]>} */
  const byDay = new Map()
  for (const rel of paths) {
    const rest = rel.startsWith(prefix) ? rel.slice(prefix.length) : rel
    const day = rest.split('/')[0] || '(senza-cartella)'
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day).push(rel)
  }

  const days = [...byDay.keys()].sort((a, b) => sessionFolderSortKey(a).localeCompare(sessionFolderSortKey(b)))
  if (days.length === 0) {
    lines.push('_Nessun `Report-*.md` trovato sotto l\'owner._')
    lines.push('')
    return lines.join('\n') + '\n'
  }

  for (const day of days) {
    const dayPaths = byDay.get(day).slice().sort((a, b) => a.localeCompare(b))
    lines.push(`## ${day}`)
    lines.push('')
    lines.push('| File | Path |')
    lines.push('|---|---|')
    for (const rel of dayPaths) {
      const file = rel.split('/').pop()
      lines.push(`| ${file} | \`${rel}\` |`)
    }
    lines.push('')
  }

  return lines.join('\n') + '\n'
}

function stopLines(board, next) {
  const wp1 = board.find((r) => r.id === 'WP-1')
  const h13 = board.find((r) => r.id === 'H-1.3')
  const h13Bucket = h13 ? classifyPlanState(h13.stato) : null
  const wp1Hint = wp1 ? `\`${wp1.id}\` resta _${wp1.stato}_` : '`WP-1` resta NO-GO'
  if (h13Bucket === 'fatta') {
    return `Completare \`${next}\`. ${wp1Hint} (\`H-1.3\` PASS ≠ via libera pilota).`
  }
  return `Completare \`${next}\`. ${wp1Hint}; non dichiarare \`H-1.3\` PASS pulito se l'owner non lo dice.`
}

function mobileNumbersReminder() {
  return [
    '## Dati mobili',
    '',
    'Nessun conteggio di test, sedute, controlli o HEAD e congelato qui. Chiedilo al momento a:',
    '- `npm run mss:status`',
    '- `npm run mss:query -- --verifica` / `--fail`',
    '- `npm run test:mss:tools` / `npm run validate:mss:all`',
    '',
  ]
}

/** Link in PLAN sono relativi a MetaSkillSystem/; le viste Senior-Eval-Pack sono un livello piu' in basso. */
function hrefFromSeniorPack(href) {
  if (!href) return href
  if (href.startsWith('../')) return `../${href}`
  return href
}

/**
 * Il parser e volutamente stretto: prende l'ultimo ciclo «eseguito e CHIUSO/PROVATO» e la
 * prossima azione con etichetta tra parentesi. Se il piano cambia forma, il comando diventa
 * rosso invece di pubblicare un riassunto inventato.
 */
export function deriveMatteoDashboard(planText) {
  const lines = []
  const { gate, board, glossesById, validation, buckets, lastCycle } = readPlanOwner(planText)

  const { closedId, closedState, next, nextLabel, r1, r1FromExplicitLine: r1Current } = gate

  lines.push(...bannerLines('PLAN_V0.md'))

  lines.push('## Ultimo aggiornamento')
  lines.push(
    r1Current
      ? `\`R1\` è **${r1.replace(/\s+/g, ' ')}**: prova eseguibile, test nominato e controverifica Cursor/Composer sono registrati.`
      : `\`${closedId}\` è **${closedState}** secondo \`M12\`: prova eseguibile, test nominati e controverifica di famiglia diversa.`,
  )
  lines.push('')

  if (lastCycle) {
    lines.push('## L\'ultimo ciclo chiuso')
    lines.push('')
    lines.push(`**${lastCycle.titolo}** — \`${lastCycle.id}\` eseguito e **${lastCycle.stato}**.`)
    if (lastCycle.paragrafo) {
      lines.push('')
      lines.push(lastCycle.paragrafo)
    }
    if (lastCycle.atti.length) {
      lines.push('')
      lines.push('**Atti:**')
      for (const a of lastCycle.atti) {
        lines.push(`- [${a.label}](${a.href})`)
      }
    }
    lines.push('')
  }

  lines.push('## Cosa devi fare tu')
  lines.push(
    r1Current
      ? `R1 è **${r1.replace(/\s+/g, ' ')}**. Il prossimo gate è \`${next}\` (${nextLabel}).`
      : `Il prossimo lavoro autorizzato è \`${next}\` (${nextLabel}). \`R1\` resta **${r1.replace(/\s+/g, ' ')}**.`,
  )
  lines.push('')

  if (!validation.ok) {
    lines.push('<!-- MSS-VIEWS-GLOSSA-ORFANA -->')
    lines.push('')
    lines.push('> **MSS-VIEWS-GLOSSA-ORFANA** — glossa D per id assente in M (§4/§4-bis):')
    for (const id of validation.orphans) {
      lines.push(`> - \`${id}\` → ${glossesById.get(id) || '(senza testo)'}`)
    }
    lines.push('')
  }

  if (board.length > 0) {
    const nF = buckets.fatta.length
    const nR = buckets['con-riserva'].length
    const nD = buckets['da-fare'].length
    const nN = buckets['non-classificata'].length
    lines.push('## Lavagna')
    lines.push('')
    lines.push(`*Fatte ${nF} · Con riserva ${nR} · Da fare ${nD}${nN ? ` · Non classificate ${nN}` : ''}*`)
    lines.push('')
    lines.push('| Fatte | Con riserva | Da fare |')
    lines.push('|---|---|---|')
    const maxRows = Math.max(nF, nR, nD, 1)
    for (let i = 0; i < maxRows; i++) {
      lines.push(`| ${formatLavagnaCell(buckets.fatta, i) || '—'} | ${formatLavagnaCell(buckets['con-riserva'], i) || '—'} | ${formatLavagnaCell(buckets['da-fare'], i) || '—'} |`)
    }
    if (nN > 0) {
      lines.push('')
      lines.push('**Non classificate (M):**')
      for (const r of buckets['non-classificata']) {
        lines.push(`- \`${r.id}\` ${r.display} — _${r.stato}_`)
      }
    }
    lines.push('')
  }

  const riserve = board.filter((r) => r.riserva)
  if (riserve.length) {
    lines.push('## Riserve aperte')
    lines.push('')
    for (const r of riserve) {
      const label = displayLabel(r, glossesById)
      lines.push(`- \`${r.id}\` (${label}): ${r.riserva}`)
    }
    lines.push('')
  }

  lines.push('## Prossimo passo')
  lines.push('')
  lines.push(stopLines(board, next))

  return lines.join('\n') + '\n'
}

/**
 * ROADMAP Senior-Eval — traccia viva SK/WP da PLAN, senza stati inventati né numeri mobili.
 */
export function deriveSeniorRoadmap(planText) {
  const lines = []
  const { gate, board, glossesById, validation, buckets, lastCycle } = readPlanOwner(planText)
  const { closedId, closedState, next, nextLabel, r1 } = gate

  lines.push(...bannerLines('../PLAN_V0.md'))
  lines.push('## Gate vivo (da owner)')
  lines.push('')
  lines.push(`- **Ultimo ciclo chiuso:** \`${closedId}\` **${closedState}**`)
  if (lastCycle?.titolo) lines.push(`- **Titolo ciclo:** ${lastCycle.titolo}`)
  lines.push(`- **Prossima azione:** \`${next}\` (${nextLabel})`)
  lines.push(`- **R1:** ${r1}`)
  lines.push('')

  if (!validation.ok) {
    lines.push('<!-- MSS-VIEWS-GLOSSA-ORFANA -->')
    lines.push('')
    lines.push('> **MSS-VIEWS-GLOSSA-ORFANA** — glossa D per id assente in M (§4/§4-bis):')
    for (const id of validation.orphans) {
      lines.push(`> - \`${id}\` → ${glossesById.get(id) || '(senza testo)'}`)
    }
    lines.push('')
  }

  if (board.length > 0) {
    const nF = buckets.fatta.length
    const nR = buckets['con-riserva'].length
    const nD = buckets['da-fare'].length
    const nN = buckets['non-classificata'].length
    lines.push('## Lavagna pacchetti (M)')
    lines.push('')
    lines.push(`*Fatte ${nF} · Con riserva ${nR} · Da fare ${nD}${nN ? ` · Non classificate ${nN}` : ''}*`)
    lines.push('')
    lines.push('| Fatte | Con riserva | Da fare |')
    lines.push('|---|---|---|')
    const maxRows = Math.max(nF, nR, nD, 1)
    for (let i = 0; i < maxRows; i++) {
      lines.push(`| ${formatLavagnaCell(buckets.fatta, i) || '—'} | ${formatLavagnaCell(buckets['con-riserva'], i) || '—'} | ${formatLavagnaCell(buckets['da-fare'], i) || '—'} |`)
    }
    if (nN > 0) {
      lines.push('')
      lines.push('**Non classificate (M):**')
      for (const r of buckets['non-classificata']) {
        lines.push(`- \`${r.id}\` ${r.display} — _${r.stato}_`)
      }
    }
    lines.push('')
  }

  const riserve = board.filter((r) => r.riserva)
  if (riserve.length) {
    lines.push('## Riserve aperte')
    lines.push('')
    for (const r of riserve) {
      lines.push(`- \`${r.id}\` (${displayLabel(r, glossesById)}): ${r.riserva}`)
    }
    lines.push('')
  }

  lines.push('## Prossimo passo')
  lines.push('')
  lines.push(stopLines(board, next))
  lines.push('')
  lines.push(...mobileNumbersReminder())

  return lines.join('\n') + '\n'
}

/**
 * HANDOFF Senior-Eval — istantanea operativa da PLAN; niente HEAD/conteggi congelati.
 */
export function deriveSeniorHandoff(planText) {
  const lines = []
  const { gate, board, lastCycle } = readPlanOwner(planText)
  const { closedId, closedState, next, nextLabel, r1 } = gate
  const wp1 = board.find((r) => r.id === 'WP-1')
  const h13 = board.find((r) => r.id === 'H-1.3')

  lines.push(...bannerLines('../PLAN_V0.md'))
  lines.push('### Istantanea attiva')
  lines.push('')
  lines.push(`- **Ultimo ciclo chiuso:** \`${closedId}\` **${closedState}**`)
  if (lastCycle?.titolo) lines.push(`- **Ciclo:** ${lastCycle.titolo}`)
  if (lastCycle?.atti?.length) {
    lines.push('- **Atti del ciclo (puntatori owner):**')
    for (const a of lastCycle.atti) {
      lines.push(`  - [${a.label}](${hrefFromSeniorPack(a.href)})`)
    }
  }
  lines.push(`- **Prossima azione autorizzata:** \`${next}\` (${nextLabel})`)
  lines.push(`- **R1:** ${r1}`)
  if (h13) lines.push(`- **\`H-1.3\` (M):** _${h13.stato}_`)
  if (wp1) lines.push(`- **\`WP-1\` (M):** _${wp1.stato}_`)
  lines.push('- **Owner di stato:** [`../PLAN_V0.md`](../PLAN_V0.md) — in caso di divergenza vince l\'owner.')
  lines.push('- **Cruscotto:** [`../CRUSCOTTO_MATTEO_MSS.md`](../CRUSCOTTO_MATTEO_MSS.md) (stesso generatore).')
  lines.push('')
  lines.push('### Prossimo task atomico')
  lines.push('')
  lines.push(stopLines(board, next))
  lines.push('')
  lines.push('### STOP invariati (da M, non da memoria)')
  lines.push('')
  lines.push('- Non aprire `WP-1` se M lo tiene NO-GO.')
  lines.push('- Non promuovere gate SEP/`SEP-G5` da questa vista.')
  lines.push('- Non correggere a mano il blocco fra marcatori: rigenera con `npm run generate:mss:views`.')
  lines.push('')
  lines.push(...mobileNumbersReminder())

  return lines.join('\n') + '\n'
}

export function replaceGeneratedBlock(text, id, body) {
  const { start, end } = markers(id)
  const first = text.indexOf(start)
  const last = text.indexOf(end)
  if (first < 0 || last < 0 || last < first) {
    throw new Error(`MSS-VIEWS-MARKERS: marcatori mancanti o invertiti per «${id}».`)
  }
  if (text.indexOf(start, first + start.length) >= 0 || text.indexOf(end, last + end.length) >= 0) {
    throw new Error(`MSS-VIEWS-MARKERS: marcatori duplicati per «${id}».`)
  }
  return `${text.slice(0, first)}${start}\n${body}${end}${text.slice(last + end.length)}`
}

export function renderView(view, ownerInput) {
  if (view.id === 'cruscotto-matteo') return deriveMatteoDashboard(ownerInput)
  if (view.id === 'roadmap-senior') return deriveSeniorRoadmap(ownerInput)
  if (view.id === 'handoff-senior') return deriveSeniorHandoff(ownerInput)
  if (view.id === 'report-index') return deriveReportIndex(ownerInput)
  throw new Error(`MSS-VIEWS-UNKNOWN: vista non supportata «${view.id}».`)
}

export function runViews({ root = ROOT, write = false } = {}) {
  const results = []
  for (const view of VIEWS) {
    const ownerPath = join(root, ...view.owner.split('/'))
    const targetPath = join(root, ...view.target.split('/'))
    if (!existsSync(ownerPath) || !existsSync(targetPath)) {
      throw new Error(`MSS-VIEWS-PATH: owner o vista assente per «${view.id}» (${view.owner} → ${view.target}).`)
    }
    const ownerKind = view.ownerKind || 'plan-file'
    if (ownerKind === 'sessions-dir' && !statSync(ownerPath).isDirectory()) {
      throw new Error(`MSS-VIEWS-OWNER: «${view.id}» richiede una directory owner (${view.owner}).`)
    }
    if (ownerKind === 'plan-file' && !statSync(ownerPath).isFile()) {
      throw new Error(`MSS-VIEWS-OWNER: «${view.id}» richiede un file owner (${view.owner}).`)
    }
    const body =
      ownerKind === 'sessions-dir'
        ? renderView(view, { root, sessionsRel: view.owner })
        : renderView(view, readFileSync(ownerPath, 'utf8'))
    const expected = replaceGeneratedBlock(readFileSync(targetPath, 'utf8'), view.id, body)
    const actual = readFileSync(targetPath, 'utf8')
    const stale = actual !== expected
    if (write && stale) writeFileSync(targetPath, expected, 'utf8')
    results.push({ ...view, stale })
  }
  return results
}

function main() {
  const args = new Set(process.argv.slice(2))
  if (args.has('--help') || [...args].some((arg) => !['--check', '--write'].includes(arg))) {
    process.stdout.write('Uso: node scripts/mss/views.mjs --check|--write\n')
    return 2
  }
  if (args.size !== 1) {
    process.stderr.write('MSS-VIEWS-ARGS: scegli esattamente --check oppure --write.\n')
    return 2
  }
  const write = args.has('--write')
  const results = runViews({ root: ROOT, write })
  const stale = results.filter((result) => result.stale)
  if (stale.length && !write) {
    process.stderr.write(`MSS-VIEWS-STALE: ${stale.map((result) => result.target).join(', ')} non corrisponde piu al suo owner. Esegui npm run generate:mss:views.\n`)
    return 1
  }
  process.stdout.write(`MSS views ${write ? 'generate' : 'check'} OK: ${results.map((result) => result.id).join(', ')}\n`)
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
