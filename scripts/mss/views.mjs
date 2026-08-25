#!/usr/bin/env node
/**
 * Viste MSS generate — derivate dagli owner, mai fonti di stato.
 *
 * Una vista e' modificabile solo fra i propri marcatori. Fuori resta testo umano: il generatore
 * non puo' cancellare contesto, istruzioni o collegamenti scritti per le persone.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
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
    target: 'docs/MetaSkillSystem/CRUSCOTTO_MATTEO_MSS.md',
  }),
])

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

/**
 * Il parser e volutamente stretto: prende l'ultimo ciclo «eseguito e CHIUSO/PROVATO» e la
 * prossima azione con etichetta tra parentesi. Se il piano cambia forma, il comando diventa
 * rosso invece di pubblicare un riassunto inventato.
 */
export function deriveMatteoDashboard(planText) {
  const lines = []
  let gate
  try {
    gate = parsePlanGate(planText)
  } catch (error) {
    throw new Error(error.message.replace(/^MSS-PLAN-UNREADABLE:/, 'MSS-VIEWS-OWNER-UNREADABLE:'))
  }

  const board = parsePlanBoard(planText)
  const glosses = parsePlanGlosses(planText)
  const glossesById = glossaMap(glosses)
  const validation = validatePlanGlosses(board, glosses)
  const buckets = bucketBoard(board, glossesById)
  const lastCycle = parsePlanLastCycle(planText)

  const { closedId, closedState, next, nextLabel, r1, r1FromExplicitLine: r1Current } = gate

  lines.push(`> Generato da \`npm run generate:mss:views\` leggendo il solo owner [\`PLAN_V0.md\`](PLAN_V0.md).`)
  lines.push('> Questa vista non possiede stato: se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.')
  lines.push('')

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
  lines.push(`Completare \`${next}\`. Non riaprire \`WP-1\` e non dichiarare \`H-1.3\` PASS pulito.`)

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

export function renderView(view, ownerText) {
  if (view.id === 'cruscotto-matteo') return deriveMatteoDashboard(ownerText)
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
    const expected = replaceGeneratedBlock(readFileSync(targetPath, 'utf8'), view.id, renderView(view, readFileSync(ownerPath, 'utf8')))
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
