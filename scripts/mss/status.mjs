#!/usr/bin/env node
/**
 * mss:status — «dove siamo» in un comando, in sola lettura.
 *
 * Perche esiste: ricostruire lo stato del MetaSkillSystem costava da 2 a 10 file aperti a ogni
 * sessione. Questo comando lo deriva dagli owner e dallo stato di git.
 *
 * REGOLA NON NEGOZIABILE: questo file NON e un owner di stato. Non memorizza nulla, non scrive
 * nulla, e non inventa nulla. Se non riesce a leggere un valore stampa «non ricostruibile» e il
 * path dell'owner da aprire. Un dato assente e un dato valido; un dato inventato invaliderebbe
 * la raccolta (PARAMETRI_MACRO_V0.md §6).
 */

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CONFIG } from './config.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'

const ROOT = repoRootFromModule(import.meta.url)
/** Gli owner sono un dato di INSTALLAZIONE (R8): il nome del piano cambia da repo a repo. */
const OWNER_PLAN = CONFIG.owners.plan
const OWNER_PACK = CONFIG.owners.pack

const UNKNOWN = (owner) => `non ricostruibile — apri ${owner}`

function git(args, fallback = null, root = ROOT) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return fallback
  }
}

function read(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return null
  }
}

/** Estrae le righe di una tabella markdown dentro una sezione delimitata da heading. */
function tableRows(text, sectionRe) {
  if (!text) return []
  const start = text.search(sectionRe)
  if (start < 0) return []
  const after = text.slice(start)
  const end = after.slice(1).search(/\n#{2,3} /)
  const block = end < 0 ? after : after.slice(0, end + 1)
  return block
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !/^\|[\s|:-]+\|$/.test(l.trim()))
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
    .filter((cells) => cells.length >= 3)
}

function stripMd(s) {
  return (s || '').replace(/\*\*/g, '').replace(/`/g, '').replace(/~~/g, '').trim()
}

// ---------------------------------------------------------------- git

function gitBlock(root = ROOT) {
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], null, root)
  const head = git(['rev-parse', '--short', 'HEAD'], null, root)
  const upstream = branch ? git(['rev-parse', '--short', `origin/${branch}`], null, root) : null
  let ahead = null
  if (branch && upstream) {
    const counts = git(['rev-list', '--left-right', '--count', `origin/${branch}...HEAD`], null, root)
    if (counts) {
      const [behind, forward] = counts.split(/\s+/)
      ahead = { behind: Number(behind), ahead: Number(forward) }
    }
  }
  const dirty = (git(['status', '--porcelain', '-uall'], '', root) || '').split('\n').filter(Boolean)
  const tags = (git(['tag', '-l', 'mss*'], '', root) || '').split('\n').filter(Boolean)
  const stash = (git(['stash', 'list'], '', root) || '').split('\n').filter(Boolean).length
  const worktrees = (git(['worktree', 'list'], '', root) || '').split('\n').filter(Boolean).length
  return { branch, head, upstream, ahead, dirty, tags, stash, worktrees }
}

// ---------------------------------------------------------------- owner

function planState(text) {
  const rows = tableRows(text, /\n## 4\. Quadro corrente/)
  const wp = rows
    .filter((c) => /^(WP|MP|H)-/.test(stripMd(c[1] || '')))
    .map((c) => ({ id: stripMd(c[1]).split(' ')[0], stato: stripMd(c[2]) }))
  const skRows = tableRows(text, /\n### 4-bis\./)
  const sk = skRows
    .filter((c) => /^SK-/.test(stripMd(c[1] || '')))
    .map((c) => ({ id: stripMd(c[1]).split(' ')[0], stato: stripMd(c[2]), prova: stripMd(c[3]) }))
  return { wp, sk }
}

function packState(text) {
  const rows = tableRows(text, /\n## 4\. Stato corrente/)
  return rows
    .filter((c) => /^SEP-\d/.test(stripMd(c[0] || '')))
    .map((c) => ({ id: stripMd(c[0]), stato: stripMd(c[2]).split('(')[0].trim() }))
}

/**
 * Controllo di coerenza fra fonti vive.
 *
 * «Lo stesso stato scritto a mano in due fonti vive» e un falsificatore duro
 * (PARAMETRI_MACRO_V0.md §6) e finora nessuno lo rilevava.
 *
 * LEZIONE DI PROGETTO, imparata sbagliando (21-08-26): la prima versione cercava i verdetti nel
 * testo con espressioni regolari e ha prodotto 2 falsi allarmi su 2. Motivo: un documento di
 * governance non solo DICHIARA gli stati, ne PARLA — «vietato: claim SEP-G5 PASS» e' un divieto,
 * non un'asserzione, ma al testo sembrano identici.
 * Un falso allarme e' peggio di nessun allarme: «inventare un problema invalida la raccolta tanto
 * quanto nasconderlo» (METASKILL_SYSTEM_SKILL.md).
 * Quindi qui si confrontano SOLTANTO celle di tabelle di stato, mai prosa.
 */
function verdictOf(cell) {
  const s = stripMd(cell).toUpperCase()
  for (const v of ['PASS_CON_RISERVE', 'NO-GO', 'NON PASS', 'FAIL', 'CONTRADDETTO']) {
    if (s.includes(v)) return v
  }
  return null
}

function coherence(planTxt, packTxt) {
  // Verdetti dichiarati nelle tabelle di stato: id -> [{verdetto, fonte}]
  const declared = new Map()
  const push = (id, verdetto, fonte) => {
    if (!id || !verdetto) return
    if (!declared.has(id)) declared.set(id, [])
    declared.get(id).push({ verdetto, fonte })
  }

  // Il verdetto si attribuisce SOLO all'identificatore che e' il soggetto della riga, cioe' quello
  // scritto nella colonna-identificatore. Una riga puo' citarne altri di passaggio
  // (es. «WP-1 … (H-1.3 con riserve != via libera)»): quelli non sono dichiarazioni su di loro.
  for (const [txt, fonte, sectionRe, idCol, statoCol] of [
    [planTxt, 'PLAN_V0.md §4', /\n## 4\. Quadro corrente/, 1, 2],
    [packTxt, 'MASTERPLAN_V0.md §4', /\n## 4\. Stato corrente/, 0, 2],
  ]) {
    for (const cells of tableRows(txt, sectionRe)) {
      const id = (stripMd(cells[idCol] || '').match(/^(H-1\.\d|WP-[\d.]+|SEP-[\dG]\d*|MP-\d|E-\d)/) || [])[1]
      push(id, verdictOf(cells[statoCol] || ''), fonte)
    }
  }

  const out = []
  for (const [id, voci] of declared) {
    const distinti = [...new Set(voci.map((v) => v.verdetto))]
    if (distinti.length > 1) {
      out.push({
        label: id,
        varianti: distinti.map((d) => [d, [...new Set(voci.filter((v) => v.verdetto === d).map((v) => v.fonte))]]),
      })
    }
  }
  return out
}

// ---------------------------------------------------------------- output

const colors = (isTTY) => isTTY
  ? { r: '\x1b[31m', y: '\x1b[33m', g: '\x1b[32m', d: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' }
  : { r: '', y: '', g: '', d: '', b: '', x: '' }

/**
 * Il render e funzione dei suoi ARGOMENTI, non della config del processo: gli owner si passano.
 * Prima li leggeva da `CONFIG` mentre riceveva i testi dal chiamante, e le due cose potevano
 * contraddirsi (testo presente, owner dichiarato assente → sezione muta).
 */
export function buildStatusReport({
  planText, packText, gitState, isTTY = false, planOwner = OWNER_PLAN, packOwner = OWNER_PACK,
} = {}) {
const C = colors(isTTY)
const g = gitState || {
  branch: null, head: null, upstream: null, ahead: null, dirty: [], tags: [], stash: 0, worktrees: 0,
}
const L = []
L.push(`${C.b}MetaSkillSystem — dove siamo${C.x}  ${C.d}(derivato dagli owner, non memorizzato)${C.x}`)
L.push('')

// GIT
L.push(`${C.b}Git${C.x}`)
L.push(`  branch          ${g.branch ?? 'non ricostruibile'}`)
L.push(`  HEAD            ${g.head ?? 'non ricostruibile'}`)
if (g.upstream) {
  const d = g.ahead
  const nota = d
    ? d.ahead === 0 && d.behind === 0
      ? `${C.g}allineato${C.x}`
      : `${C.y}${d.ahead} avanti · ${d.behind} indietro${C.x}`
    : ''
  L.push(`  origin          ${g.upstream}  ${nota}`)
} else {
  L.push(`  origin          ${C.y}nessun upstream${C.x}`)
}
L.push(
  `  ripristino      ${g.tags.length ? g.tags.join(', ') : `${C.r}NESSUN TAG${C.x} ${C.d}— il punto di ripristino e solo uno SHA a memoria${C.x}`}`,
)
L.push(`  working tree    ${g.dirty.length ? `${C.y}${g.dirty.length} file non committati${C.x}` : `${C.g}pulito${C.x}`}`)
L.push(`  stash           ${g.stash} ${C.d}(non toccare senza si esplicito)${C.x}`)
L.push(`  worktree        ${g.worktrees}`)
L.push('')

// SYS-1
L.push(`${C.b}Cantiere SYS-1${C.x} ${C.d}owner: ${planOwner}${C.x}`)
if (!planText) {
  L.push(`  ${C.r}${UNKNOWN(planOwner)}${C.x}`)
} else {
  const { wp, sk } = planState(planText)
  if (!wp.length) L.push(`  ${C.y}tabella §4 non interpretabile — apri l'owner${C.x}`)
  for (const w of wp) {
    const rosso = /NO-GO|invalidata|BLOCCATO/i.test(w.stato)
    L.push(`  ${(rosso ? C.r : '') + w.id.padEnd(8) + C.x}${w.stato}`)
  }
  if (sk.length) {
    L.push('')
    L.push(`  ${C.b}Scheletro (§4-bis)${C.x}`)
    for (const s of sk) L.push(`  ${s.id.padEnd(8)}${s.stato}  ${C.d}prova: ${s.prova}${C.x}`)
  }
}
L.push('')

// PACCHETTO
if (!packText && !packOwner) {
  // Nessun secondo owner dichiarato e nessun testo: non e un dato mancante, e un'assenza voluta.
} else if (!packText) {
  L.push(`${C.b}Secondo owner${C.x} ${C.d}owner: ${packOwner}${C.x}`)
  L.push(`  ${C.r}${UNKNOWN(packOwner)}${C.x}`)
} else {
  L.push(`${C.b}Pacchetto Senior-Eval${C.x} ${C.d}owner: ${packOwner || 'non dichiarato in config'}${C.x}`)
  const sep = packState(packText)
  const attivi = sep.filter((s) => /IN_CORSO/i.test(s.stato))
  const bloccati = sep.filter((s) => /BLOCCATO/i.test(s.stato))
  const chiusi = sep.filter((s) => /CHIUSO/i.test(s.stato))
  if (!sep.length) L.push(`  ${C.y}tabella §4 non interpretabile — apri l'owner${C.x}`)
  for (const s of attivi) L.push(`  ${C.y}${s.id.padEnd(8)}${s.stato}${C.x}`)
  if (chiusi.length) L.push(`  ${C.d}chiusi:   ${chiusi.map((s) => s.id).join(' ')}${C.x}`)
  if (bloccati.length) L.push(`  ${C.d}bloccati: ${bloccati.map((s) => s.id).join(' ')}${C.x}`)
}
L.push('')

// COERENZA
const inc = coherence(planText, packText)
L.push(`${C.b}Coerenza fra tabelle di stato${C.x} ${C.d}«stesso stato in due fonti vive» = falsificatore duro${C.x}`)
if (!inc.length) {
  L.push(`  ${C.g}nessuna divergenza sui verdetti dichiarati in tabella${C.x}`)
} else {
  for (const i of inc) {
    L.push(`  ${C.r}DIVERGENZA${C.x} su ${i.label}:`)
    for (const [v, fonti] of i.varianti) L.push(`     «${v}» in ${fonti.join(', ')}`)
  }
}
L.push('')

L.push(`${C.y}Che cosa questo controllo NON vede${C.x}`)
L.push(`  Confronta solo ${C.b}celle di tabelle di stato${C.x}. Le contraddizioni in ${C.b}prosa${C.x} gli sfuggono —`)
L.push(`  ed e' proprio li' che si annidano: una sezione secondaria aggiornata mesi dopo la tabella.`)
L.push(`  ${C.d}Non e' un limite risolvibile con espressioni regolari: un documento di governance PARLA${C.x}`)
L.push(`  ${C.d}degli stati oltre a dichiararli, e «vietato: claim X PASS» al testo sembra un'asserzione.${C.x}`)
L.push(`  ${C.d}La cura vera e' dichiarare gli stati in un blocco leggibile a macchina — pacchetto SK-4.${C.x}`)
L.push('')

L.push(`${C.d}Questo comando legge soltanto. Per lo stato autorevole apri gli owner citati sopra.${C.x}`)
L.push(`${C.d}Prove: npm run test:mss · npm run validate:mss -- --mode file --file <report> --kind report --require-capsule${C.x}`)

return L.join('\n') + '\n'
}

export function runStatus({ root = ROOT, isTTY = false } = {}) {
  return {
    exitCode: 0,
    stdout: buildStatusReport({
      planText: read(join(root, OWNER_PLAN)),
      packText: OWNER_PACK ? read(join(root, OWNER_PACK)) : null,
      planOwner: OWNER_PLAN,
      packOwner: OWNER_PACK,
      gitState: gitBlock(root),
      isTTY,
    }),
    stderr: '',
  }
}

if (isMainModule(import.meta.url)) {
  const result = runStatus({ root: ROOT, isTTY: Boolean(process.stdout.isTTY) })
  process.stdout.write(result.stdout)
  process.exitCode = result.exitCode
}
