#!/usr/bin/env node
/**
 * Viste MSS generate — derivate dagli owner, mai fonti di stato.
 *
 * Una vista e' modificabile solo fra i propri marcatori. Fuori resta testo umano: il generatore
 * non puo' cancellare contesto, istruzioni o collegamenti scritti per le persone.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parsePlanGate } from './plan-parse.mjs'
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

/**
 * Il parser e volutamente stretto: prende l'ultimo ciclo «eseguito e CHIUSO/PROVATO» e la
 * prossima azione con etichetta tra parentesi. Se il piano cambia forma, il comando diventa
 * rosso invece di pubblicare un riassunto inventato.
 */
export function deriveMatteoDashboard(planText) {
  let gate
  try {
    gate = parsePlanGate(planText)
  } catch (error) {
    throw new Error(error.message.replace(/^MSS-PLAN-UNREADABLE:/, 'MSS-VIEWS-OWNER-UNREADABLE:'))
  }
  const { closedId, closedState, next, nextLabel, r1, r1FromExplicitLine: r1Current } = gate
  const r1Closed = /^CHIUSO\b/.test(r1.trim())

  return [
    `> Generato da \`npm run generate:mss:views\` leggendo il solo owner [\`PLAN_V0.md\`](PLAN_V0.md).`,
    '> Questa vista non possiede stato: se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.',
    '',
    '## Ultimo aggiornamento',
    r1Current
      ? `\`R1\` è **${r1.replace(/\s+/g, ' ')}**: prova eseguibile, test nominato e controverifica Cursor/Composer sono registrati.`
      : `\`${closedId}\` è **${closedState}** secondo \`M12\`: prova eseguibile, test nominati e controverifica di famiglia diversa.`,
    '',
    '## Cosa devi fare tu',
    r1Current
      ? `R1 è **${r1.replace(/\s+/g, ' ')}**. Il prossimo gate è \`${next}\` (${nextLabel}).`
      : `Il prossimo lavoro autorizzato è \`${next}\` (${nextLabel}). \`R1\` resta **${r1.replace(/\s+/g, ' ')}**.`,
    '',
    '## Lavagna',
    '',
    '| Fatte | Con riserva | Da fare |',
    '|---|---|---|',
    r1Current
      ? `| \`${closedId}\` chiuso${r1Closed ? ' · `R1` chiuso' : ''} | \`R1\`: ${r1.replace(/\s+/g, ' ')} | \`${next}\`: ${nextLabel} |`
      : `| \`${closedId}\` chiuso | — | \`${next}\`: ${nextLabel} |`,
    '',
    '## Prossimo passo',
    '',
    `Completare \`${next}\`. Non riaprire \`WP-1\` e non dichiarare \`H-1.3\` PASS pulito.`,
  ].join('\n') + '\n'
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
