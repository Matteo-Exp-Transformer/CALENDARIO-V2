#!/usr/bin/env node
/**
 * mss:query — il lettore delle capsule, in sola lettura.
 *
 * Perche esiste: in 42 sedute il sistema ha scritto 42 capsule, e nessuno le ha mai interrogate.
 * Una macchina le rilegge, ma solo per impedire che il passato venga riscritto: integrita, non
 * memoria. Questo comando le usa per rispondere a domande.
 *
 * REGOLA NON NEGOZIABILE: questo file NON e un owner di stato, non scrive, non ripara i dati e
 * non inventa nulla. Un campo assente viene contato come assente e dichiarato («presente in 32
 * capsule su 42»), mai completato a plausibilita. Un valore previsto dal contratto e mai usato
 * viene contato a zero E scritto a parole: e una risposta, non un buco (PARAMETRI_MACRO_V0.md §6).
 *
 * PERIMETRO DI LETTURA — SK-4 E1 (23-08-26): importa `REPORT_PATH_RE` da adapter.mjs (D18).
 * Stessa costante di pre-commit e collectGitHeadHistory(): sotto-cartelle + prefisso Verbale-.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

import { REPORT_PATH_RE } from './adapter.mjs'
import { extractCapsulesFromMarkdown, detectReportMode } from './parse.mjs'
import { SCHEMA_CURRENT, SCHEMA_LEGACY, REVISION_CURRENT, REVISION_LEGACY, RULE } from './rules.mjs'
import { applyAmendmentsView } from './core.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'

const ROOT = repoRootFromModule(import.meta.url)
const SESSIONI = 'docs/Sessioni di lavoro'

const colors = (isTTY) => isTTY
  ? { r: '\x1b[31m', y: '\x1b[33m', g: '\x1b[32m', d: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' }
  : { r: '', y: '', g: '', d: '', b: '', x: '' }

let C = colors(false)

// ------------------------------------------------------------------ raccolta

function git(args, fallback = null, root = ROOT) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 128 * 1024 * 1024,
    })
  } catch {
    return fallback
  }
}

function headReportPaths(root = ROOT) {
  const raw = git(['ls-tree', '-r', '--name-only', '-z', 'HEAD', '--', SESSIONI], '', root) || ''
  return raw.split('\0').filter(Boolean).filter((p) => REPORT_PATH_RE.test(p))
}

function headContent(path, root = ROOT) {
  try {
    return execFileSync('git', ['show', `HEAD:${path}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 128 * 1024 * 1024,
    })
  } catch {
    return null
  }
}

function worktreeReportPaths(root = ROOT) {
  const base = join(root, SESSIONI)
  if (!existsSync(base)) return []
  const out = []
  const walk = (dir) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) walk(abs)
      else if (entry.isFile()) {
        const rel = relative(root, abs).replace(/\\/g, '/')
        if (REPORT_PATH_RE.test(rel)) out.push(rel)
      }
    }
  }
  walk(base)
  return out
}

/**
 * Legge le capsule da HEAD e dal working tree.
 * Dove un file esiste in entrambi, vince il working tree: e lo stato corrente del repo.
 * L'origine di ogni file viene conservata e dichiarata in output.
 */
function collect(root = ROOT) {
  const head = new Set(headReportPaths(root))
  const work = new Set(worktreeReportPaths(root))
  const paths = [...new Set([...head, ...work])].sort()

  const files = []
  const records = []
  const anomalies = []

  for (const path of paths) {
    const inWork = work.has(path)
    const inHead = head.has(path)
    let content = null
    let origin = null

    if (inWork) {
      try {
        content = readFileSync(join(root, path), 'utf8')
        origin = inHead ? 'head+worktree' : 'solo worktree'
      } catch {
        content = null
      }
    }
    if (content == null && inHead) {
      content = headContent(path, root)
      origin = 'solo HEAD'
    }
    if (content == null) continue

    const extracted = extractCapsulesFromMarkdown(content, path)
    if (!extracted.hasHeading) continue

    const bundle = extracted.bundles[0]
    const lines = bundle ? bundle.records : []
    const malformed = extracted.diagnostics.filter((d) => d.rule === 'MSS-PARSE-JSON')

    if (!bundle || lines.length === 0) {
      // Intestazione presente, nessuna riga JSONL. Prima di chiamarlo difetto si chiede a
      // parse.mjs se e l'eccezione storica che il motore riconosce per hash: dichiarare un
      // problema che non c'e invaliderebbe la raccolta tanto quanto nasconderne uno vero.
      let historical = false
      try {
        historical = Boolean(detectReportMode(content, { file: path, workspaceRoot: root }).historical)
      } catch {
        historical = false
      }
      anomalies.push({
        path,
        origin,
        kind: historical ? 'eccezione storica dichiarata' : 'intestazione senza righe JSONL',
        historical,
      })
      files.push({ path, origin, count: 0, historical, empty: true })
      continue
    }

    for (const d of malformed) anomalies.push({ path, origin, kind: 'riga JSONL non parsabile', detail: d.fieldPath })
    for (const entry of lines) records.push({ path, origin, r: entry.record })
    files.push({ path, origin, count: lines.length, empty: false })
  }

  // Sedute: raggruppate per session_id, che e l'unita che il contratto definisce.
  const sessions = new Map()
  for (const rec of records) {
    const id = rec.r.session_id
    if (!id) continue
    if (!sessions.has(id)) sessions.set(id, { id, records: [], paths: new Set() })
    const s = sessions.get(id)
    s.records.push(rec)
    s.paths.add(rec.path)
  }
  for (const s of sessions.values()) {
    s.event = s.records.find((x) => x.r.record_type === 'session_event')?.r || null
  }

  const senzaSessione = records.filter((rec) => !rec.r.session_id).length
  if (senzaSessione) anomalies.push({ path: '<vari>', kind: `record senza session_id: ${senzaSessione}` })

  return { files, records, sessions: [...sessions.values()], anomalies, headCount: head.size, workCount: work.size }
}

// ------------------------------------------------------------------ vista effettiva (contratto §6)
//
// NON reimplementa la catena degli amendment: la DELEGA a core.mjs::applyAmendmentsView(), che e'
// la stessa funzione usata dal validator. Una sola implementazione della regola nel repo: se
// cambia, cambia per tutti e due i lettori insieme. Qui si fa solo l'adattamento di forma
// (i record di query.mjs sono {r, path}, quelli di core.mjs sono {record, file, line}) e la
// classificazione dei casi che il validator segnala altrove ma questa vista deve MOSTRARE.
//
// Differenza di perimetro, voluta: il validator applica la catena su un bundle alla volta, questo
// comando la applica sull'intero corpus, dove un amendment puo' avere il bersaglio in un report
// diverso dal proprio.

/**
 * Costruisce la vista effettiva dell'intero corpus.
 *
 * Ritorna { dataEffettiva, applicate, nonRisolte }. `dataEffettiva` ha la STESSA FORMA di `data`,
 * cosi' i modelli esistenti (verificaModel, failModel, ...) funzionano invariati passando l'uno o
 * l'altro: la differenza fra le due chiamate E' la vista effettiva.
 *
 * Non ripara nulla: una catena che non si risolve finisce in `nonRisolte`, mostrata per intero.
 */
export function buildVistaEffettiva(data) {
  const entries = data.records.map((rec) => ({ record: rec.r, file: rec.path, line: 0 }))
  const byId = new Map()
  for (const e of entries) {
    // Identita' divergenti con lo stesso record_id sono gia' un difetto che validate:mss segnala
    // altrove (MSS-RECORD-ID-COLLISION): qui si tiene la prima occorrenza e non si duplica quel
    // controllo, che non e' lo scopo di questo lettore.
    if (e.record?.record_id && !byId.has(e.record.record_id)) byId.set(e.record.record_id, e.record)
  }

  const nonRisolte = []
  // Due casi che applyAmendmentsView() salta in silenzio perche' il validator li segnala in altri
  // controlli (validateAmendment per supersedes, validateGlobalRecordView per orfano/non-final).
  // Un LETTORE deve mostrarli: un archivio che nasconde le proprie incoerenze e' il difetto che
  // questo cantiere esiste per impedire. Classificazione, non riapplicazione della regola.
  for (const e of entries) {
    if (e.record?.record_type !== 'amendment' || e.record?.finalization !== 'final') continue
    const a = e.record.amendment
    if (a?.relation !== 'amends') {
      nonRisolte.push({
        rule: RULE.AMENDMENT_SUPERSEDES_UNSUPPORTED,
        amendment_id: a?.amendment_id,
        target_record_id: a?.target_record_id,
        field_path: null,
        motivo: 'relation "supersedes" non porta un payload applicabile (contratto §6)',
        path: e.file,
      })
      continue
    }
    const target = byId.get(a.target_record_id)
    if (!target || target.finalization !== 'final') {
      nonRisolte.push({
        rule: target ? RULE.AMENDMENT_TARGET_NOT_FINAL : RULE.AMENDMENT_ORPHAN,
        amendment_id: a.amendment_id,
        target_record_id: a.target_record_id,
        field_path: null,
        motivo: target
          ? 'il record bersaglio esiste ma non e finalization:final'
          : 'target_record_id non trovato in nessun report letto da questo comando',
        path: e.file,
      })
    }
  }

  const issues = []
  const applied = []
  const effective = applyAmendmentsView(entries, '<corpus>', issues, new Map(), applied)

  // Gli issue che la vista produce sono esattamente le catene che non si risolvono: conflitto,
  // field_path invalido o che non risolve, previous_value_or_hash che non coincide.
  for (const i of issues) {
    const [, targetId = null, fieldPath = null] = String(i.fieldPath || '').split(':')
    nonRisolte.push({
      rule: i.rule,
      amendment_id: null,
      target_record_id: targetId,
      field_path: fieldPath,
      motivo: i.message,
      path: i.file,
    })
  }

  const recordsEffettivi = data.records.map((rec, i) => ({ ...rec, r: effective[i].record }))

  const sessioniEffettive = new Map()
  for (const rec of recordsEffettivi) {
    const id = rec.r.session_id
    if (!id) continue
    if (!sessioniEffettive.has(id)) sessioniEffettive.set(id, { id, records: [], paths: new Set() })
    const s = sessioniEffettive.get(id)
    s.records.push(rec)
    s.paths.add(rec.path)
  }
  for (const s of sessioniEffettive.values()) {
    s.event = s.records.find((x) => x.r.record_type === 'session_event')?.r || null
  }

  const applicate = applied.map((a) => ({
    amendment_id: a.amendment_id,
    target_record_id: a.target_record_id,
    field_path: a.field_path,
    precedente: a.previous,
    corretto: a.corrected,
    effective_at: a.effective_at,
    path: a.file,
  }))

  const dataEffettiva = { ...data, records: recordsEffettivi, sessions: [...sessioniEffettive.values()] }
  return { dataEffettiva, applicate, nonRisolte }
}

// ------------------------------------------------------------------ utilita

const tally = (items, keyFn) => {
  const m = new Map()
  for (const item of items) {
    const k = keyFn(item)
    if (k === undefined) continue
    m.set(String(k), (m.get(String(k)) || 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

const annotations = (data) => data.records.filter((x) => x.r.record_type === 'annotation')
const events = (data) => data.records.filter((x) => x.r.record_type === 'session_event')
const amendments = (data) => data.records.filter((x) => x.r.record_type === 'amendment')
const pad = (s, n) => String(s).padEnd(n)

/** Riga «X su Y», la forma che la regola 1 impone al posto di un numero pieno inventato. */
const suTotale = (n, tot) => `${n} su ${tot}`

function intestazione(data) {
  const L = []
  const conCapsula = data.files.filter((f) => !f.empty).length
  const vuoti = data.files.filter((f) => f.empty).length
  L.push(`${C.b}MetaSkillSystem — che cosa dicono le capsule${C.x}  ${C.d}(sola lettura, nessun dato modificato)${C.x}`)
  L.push('')
  L.push(`${C.d}letto da: albero HEAD + working tree · schema corrente ${SCHEMA_CURRENT} / ${REVISION_CURRENT}${C.x}`)
  L.push(
    `${C.d}file Report-*.md esaminati: ${data.files.length} con intestazione capsula ` +
      `(${conCapsula} con righe JSONL, ${vuoti} senza) · record: ${data.records.length} · sedute: ${data.sessions.length}${C.x}`,
  )
  L.push('')
  return L
}

// ------------------------------------------------------------------ --regole

const MULTI_RE = /\s\+\s/

function regoleModel(data) {
  const asserzioni = []
  for (const a of annotations(data)) {
    if (a.r.annotation?.axis !== 'sistema') continue
    for (const s of a.r.annotation.assertions || []) {
      if (!('G' in s) && !('O' in s) && !('E' in s)) continue
      asserzioni.push({ path: a.path, session: a.r.session_id, s })
    }
  }
  const perStringa = new Map()
  for (const x of asserzioni) {
    const k = String(x.s.rule_id_version ?? '<campo assente>')
    if (!perStringa.has(k)) perStringa.set(k, { stringa: k, usi: [] })
    perStringa.get(k).usi.push(x)
  }
  const stringhe = [...perStringa.values()]
  for (const st of stringhe) {
    st.multipla = MULTI_RE.test(st.stringa)
    st.pezzi = st.multipla ? st.stringa.split(MULTI_RE).map((p) => p.trim()) : [st.stringa]
    const at = st.stringa.indexOf('@')
    st.regola = st.multipla ? null : at > 0 ? st.stringa.slice(0, at) : st.stringa
    st.versione = st.multipla || at < 0 ? null : st.stringa.slice(at + 1)
  }
  const singole = stringhe.filter((s) => !s.multipla)
  const multiple = stringhe.filter((s) => s.multipla)
  const unaVolta = stringhe.filter((s) => s.usi.length === 1)
  const senzaChiocciola = singole.filter((s) => s.versione === null)

  // Graduatoria SOLO sulle stringhe che nominano una regola sola: attribuire un G/O/E a una
  // regola quando la stringa ne cita quattro sarebbe un numero inventato.
  const perRegola = new Map()
  for (const st of singole) {
    if (!perRegola.has(st.regola)) perRegola.set(st.regola, { regola: st.regola, usi: [], versioni: new Set() })
    const g = perRegola.get(st.regola)
    g.usi.push(...st.usi)
    if (st.versione) g.versioni.add(st.versione)
  }
  const regole = [...perRegola.values()].map((g) => {
    const E = g.usi.map((u) => u.s.E).filter((v) => typeof v === 'number')
    const G = g.usi.map((u) => u.s.G).filter((v) => typeof v === 'number')
    const O = g.usi.map((u) => u.s.O).filter((v) => typeof v === 'number')
    return { ...g, n: g.usi.length, Emax: E.length ? Math.max(...E) : null, Gmax: G.length ? Math.max(...G) : null, Omax: O.length ? Math.max(...O) : null, E, G, O }
  })
  regole.sort((a, b) => b.n - a.n || a.regola.localeCompare(b.regola))
  return { asserzioni, stringhe, singole, multiple, unaVolta, senzaChiocciola, regole }
}

function renderRegole(data) {
  const m = regoleModel(data)
  const L = intestazione(data)
  L.push(`${C.b}--regole${C.x}  quali regole compaiono nelle capsule, con quali G/O/E e quante volte`)
  L.push('')
  L.push(`  ${C.b}Censimento${C.x} ${C.d}(non una classifica: vedi l'avvertenza sotto)${C.x}`)
  L.push(`    asserzioni Sistema con G/O/E     ${m.asserzioni.length}`)
  L.push(`    stringhe rule_id_version distinte ${m.stringhe.length}`)
  L.push(`    citate una volta sola             ${m.unaVolta.length} ${C.d}su ${m.stringhe.length} — il campione e sottile${C.x}`)
  L.push(`    stringhe che nominano PIU regole   ${C.y}${m.multiple.length}${C.x} ${C.d}(separatore « + »)${C.x}`)
  L.push(`    stringhe con una regola sola       ${m.singole.length} ${C.d}(di cui ${m.senzaChiocciola.length} senza « @ »: non separano regola e versione)${C.x}`)
  L.push('')
  L.push(`  ${C.y}Perche non c'e una classifica per regola${C.x}`)
  L.push(`    ${C.d}rule_id_version non e un identificatore: e una frase. ${m.multiple.length} stringhe citano piu regole${C.x}`)
  L.push(`    ${C.d}con un solo G/O/E, e quel punteggio non e attribuibile a nessuna di esse. Sono escluse${C.x}`)
  L.push(`    ${C.d}dalla graduatoria e elencate qui sotto per intero.${C.x}`)
  L.push('')
  L.push(`  ${C.b}Graduatoria — solo le ${m.singole.length} stringhe a regola singola${C.x} ${C.d}(${m.multiple.length} escluse)${C.x}`)
  if (m.regole.length !== m.singole.length) {
    L.push(
      `    ${C.d}${m.singole.length} stringhe si raggruppano in ${m.regole.length} regole: ` +
        `${m.singole.length - m.regole.length} regola/e compare sotto piu versioni.${C.x}`,
    )
  }
  L.push(`    ${C.d}${pad('regola', 42)}${pad('n', 4)}G/O/E osservati${C.x}`)
  for (const r of m.regole) {
    const goe = r.usi.map((u) => `${u.s.G}/${u.s.O}/${u.s.E}`).join(' ')
    const rosso = r.Emax === 0
    L.push(`    ${rosso ? C.y : ''}${pad(r.regola.slice(0, 41), 42)}${C.x}${pad(r.n, 4)}${C.d}${goe}${C.x}`)
  }
  L.push('')
  const e0 = m.regole.filter((r) => r.Emax === 0)
  L.push(`  ${C.b}Dove la governance e solo dichiarata: E = 0${C.x} ${C.d}(E = efficacia provata)${C.x}`)
  L.push(`    regole a regola singola con E sempre 0: ${C.y}${suTotale(e0.length, m.regole.length)}${C.x}`)
  L.push(`    ${C.d}${e0.map((r) => r.regola).join(' · ') || 'nessuna'}${C.x}`)
  const eMax = m.regole.filter((r) => r.Emax !== null && r.Emax > 0)
  L.push(`    regole con almeno un E > 0:            ${suTotale(eMax.length, m.regole.length)}`)
  L.push(`    ${C.d}${eMax.map((r) => `${r.regola} (E max ${r.Emax})`).join(' · ') || 'nessuna'}${C.x}`)
  L.push('')
  L.push(`  ${C.b}Le ${m.multiple.length} stringhe multiple, per intero${C.x} ${C.d}(nessun punteggio attribuito)${C.x}`)
  for (const st of m.multiple) {
    L.push(`    ${C.y}[${st.usi.length}]${C.x} ${st.stringa}`)
    L.push(`        ${C.d}${st.pezzi.length} regole in una stringa · G/O/E: ${st.usi.map((u) => `${u.s.G}/${u.s.O}/${u.s.E}`).join(' ')}${C.x}`)
  }
  L.push('')
  L.push(...nonVede([
    'Il campo rule_id_version e testo libero: nomi, versioni e separatori non sono normalizzati.',
    `Con ${m.unaVolta.length} stringhe su ${m.stringhe.length} citate una volta sola, nessuna tendenza e statisticamente sostenibile.`,
    'La storia dei gate NON e qui: lo schema della capsula non ha un campo per i gate (vedi --fail).',
  ]))
  return L
}

// ------------------------------------------------------------------ --modelli

/**
 * Normalizzazione dichiarata delle grafie: minuscolo, prefisso «cursor » tolto, trattini a spazi.
 * Ogni fusione viene elencata in output, cosi chi legge puo rifiutarla.
 * Non si fondono le SUPERFICI: «Cursor IDE» e «IDE chat» sono distinzioni reali, non grafie.
 */
function normalizeModel(raw) {
  return String(raw ?? '')
    .toLowerCase()
    .replace(/^cursor\s+/, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function modelliModel(data) {
  const sedute = data.sessions.map((s) => {
    const runtimes = new Set(s.records.map((x) => JSON.stringify(x.r.recorded_by?.agent_runtime ?? null)))
    const rb = s.records[0]?.r.recorded_by?.agent_runtime || null
    return {
      id: s.id,
      path: [...s.paths][0],
      runtime: rb,
      misto: runtimes.size > 1,
      subject: s.event?.event?.subject_runtime ?? undefined,
    }
  })
  const misti = sedute.filter((x) => x.misto)
  const provider = tally(sedute, (x) => x.runtime?.provider ?? '<assente>')
  const surface = tally(sedute, (x) => x.runtime?.surface ?? '<assente>')

  const perModello = new Map()
  for (const x of sedute) {
    const raw = x.runtime?.model ?? '<assente>'
    const norm = normalizeModel(raw)
    if (!perModello.has(norm)) perModello.set(norm, { norm, grafie: new Map(), n: 0 })
    const g = perModello.get(norm)
    g.n++
    g.grafie.set(raw, (g.grafie.get(raw) || 0) + 1)
  }
  const modelli = [...perModello.values()].sort((a, b) => b.n - a.n)
  const fusi = modelli.filter((m) => m.grafie.size > 1)

  // subject_runtime: campo previsto dal contratto, in pratica spesso dichiarato non applicabile.
  const subj = sedute.map((x) => {
    const v = x.subject
    if (v === undefined) return 'ASSENTE'
    if (typeof v === 'string') return /^non_applicabile|^non_noto/.test(v) ? 'non utilizzabile' : 'valorizzato'
    const p = String(v?.provider ?? '')
    return /^non_applicabile|^non_noto/.test(p) ? 'non utilizzabile' : 'valorizzato'
  })
  const subjInutile = subj.filter((v) => v !== 'valorizzato').length

  return { sedute, misti, provider, surface, modelli, fusi, subjInutile }
}

function renderModelli(data) {
  const m = modelliModel(data)
  const tot = m.sedute.length
  const L = intestazione(data)
  L.push(`${C.b}--modelli${C.x}  quante SEDUTE per provider, modello e superficie`)
  L.push('')
  L.push(`  ${C.d}Unita di conto: la seduta (session_id), non il record. I record sono ~${(data.records.length / tot).toFixed(1)}${C.x}`)
  L.push(`  ${C.d}per seduta: contarli darebbe numeri quadrupli. Sedute con runtime misti al loro interno: ${m.misti.length}.${C.x}`)
  L.push('')
  L.push(`  ${C.b}Provider${C.x} ${C.d}(da recorded_by.agent_runtime — chi ha SCRITTO la capsula)${C.x}`)
  for (const [k, v] of m.provider) {
    L.push(`    ${pad(k, 34)}${pad(suTotale(v, tot), 12)}${C.d}${Math.round((v / tot) * 100)}%${C.x}`)
  }
  L.push('')
  L.push(`  ${C.b}Modello${C.x} ${C.d}(grafie normalizzate — ogni fusione e dichiarata)${C.x}`)
  for (const mo of m.modelli) {
    L.push(`    ${pad(mo.norm, 34)}${suTotale(mo.n, tot)}`)
    if (mo.grafie.size > 1) {
      L.push(`      ${C.y}unite ${mo.grafie.size} grafie:${C.x} ${C.d}${[...mo.grafie].map(([g, n]) => `«${g}» ×${n}`).join(' · ')}${C.x}`)
    }
  }
  if (!m.fusi.length) L.push(`    ${C.d}nessuna fusione di grafie necessaria${C.x}`)
  L.push('')
  L.push(`  ${C.b}Superficie${C.x} ${C.d}(NON normalizzata: sono distinzioni reali, non grafie)${C.x}`)
  for (const [k, v] of m.surface) L.push(`    ${pad(k, 34)}${suTotale(v, tot)}`)
  L.push('')
  const top = m.provider[0]
  L.push(`  ${C.b}Le review erano indipendenti?${C.x}`)
  if (top) {
    const pct = Math.round((top[1] / tot) * 100)
    const col = pct >= 60 ? C.y : C.g
    L.push(`    un solo provider — ${C.b}${top[0]}${C.x} — ha scritto ${col}${suTotale(top[1], tot)} sedute (${pct}%)${C.x}`)
    L.push(`    ${C.d}Il vincolo proposto in PLAN_V0 §16.3 e che una review valga come indipendente solo se${C.x}`)
    L.push(`    ${C.d}il revisore gira su una famiglia di modello diversa da chi ha scritto. Con questa${C.x}`)
    L.push(`    ${C.d}concentrazione, quel vincolo escluderebbe la maggior parte delle sedute.${C.x}`)
    L.push(`    ${C.d}Chi ha verificato chi NON e ricostruibile da qui: vedi --verifica.${C.x}`)
  }
  L.push('')
  L.push(`  ${C.b}L'altro campo runtime: event.subject_runtime${C.x} ${C.d}(chi era OSSERVATO)${C.x}`)
  L.push(`    non utilizzabile in ${C.y}${suTotale(m.subjInutile, tot)}${C.x} sedute ${C.d}(non_applicabile:* oppure non_noto)${C.x}`)
  L.push(`    ${C.d}Per questo le cifre qui sopra usano recorded_by.agent_runtime, non subject_runtime.${C.x}`)
  L.push('')
  L.push(...nonVede([
    'Il provider e autodichiarato dall\'agente che scrive: nessuna macchina lo verifica.',
    'La normalizzazione dei modelli e una scelta di questo comando, non un dato: e elencata sopra apposta.',
  ]))
  return L
}

// ------------------------------------------------------------------ --verifica

const STATI_CONTRATTO = ['self_report', 'unverified', 'independently_verified', 'contradicted', 'not_applicable']

function verificaModel(data) {
  const anns = annotations(data)
  const conVerification = anns.filter((a) => a.r.annotation?.verification)
  const stati = new Map(STATI_CONTRATTO.map((s) => [s, 0]))
  const fuoriContratto = new Map()
  for (const a of conVerification) {
    const s = String(a.r.annotation.verification.status)
    if (stati.has(s)) stati.set(s, stati.get(s) + 1)
    else fuoriContratto.set(s, (fuoriContratto.get(s) || 0) + 1)
  }

  // NOTA (23-08-26, vista effettiva): questa funzione resta VOLUTAMENTE grezza — legge gli stati
  // COSI COME scritti nel record passato, senza applicare alcuna catena. Non e piu un limite
  // nascosto: e una scelta di composizione. renderVerifica() chiama questa stessa funzione due
  // volte, una su `data` (grezzo) e una su `vista.dataEffettiva` (dopo aver applicato la catena
  // amendment del contratto §6 — vedi buildVistaEffettiva()), e mostra entrambe le risposte fianco
  // a fianco: la differenza fra le due chiamate E' la vista effettiva, non un campo speciale qui.
  const amds = amendments(data)
  const FIELD_VERIFICATION_STATUS_RE = /(^|\.)annotation\.verification\.status$/
  const amdsVerificationStatus = amds.filter((a) =>
    (a.r.amendment?.changes || []).some((c) => FIELD_VERIFICATION_STATUS_RE.test(String(c?.field_path || ''))),
  )
  const statiCorrettiDaAmendment = new Set()
  for (const a of amdsVerificationStatus) {
    for (const c of a.r.amendment.changes) {
      if (FIELD_VERIFICATION_STATUS_RE.test(String(c?.field_path || ''))) {
        statiCorrettiDaAmendment.add(String(c.corrected_value))
      }
    }
  }
  const verifiedBy = conVerification.filter((a) => (a.r.annotation.verification.verified_by || []).length > 0)
  const verifiedAt = tally(conVerification, (a) => a.r.annotation.verification.verified_at ?? '<assente>')
  const basi = tally(anns, (a) => a.r.annotation?.asserted_by?.basis ?? '<assente>')

  const outAss = []
  for (const a of anns) {
    if (a.r.annotation?.axis !== 'output') continue
    for (const s of a.r.annotation.assertions || []) outAss.push({ path: a.path, s })
  }
  const outStatus = tally(outAss, (x) => x.s.verification_status ?? '<assente>')
  const eligibile = tally(outAss, (x) => x.s.product_candidate?.result ?? '<assente>')
  // Sull'asse Output verified_by NON e la lista di attori che il contratto definisce per le
  // annotazioni: e testo libero, e nei dati nomina quasi sempre comandi e prove. Contarlo come
  // «verificatori» sarebbe un falso positivo, quindi si separa solo cio che e separabile senza
  // interpretare: le dichiarazioni esplicite di assenza di verificatore.
  const NEGATIVO_RE = /non_osservato|nessuno|non ancora eseguit|non osservat|nessun revisore/i
  const outVb = outAss.map((x) => {
    const v = x.s.verified_by
    const testo = v == null ? '' : Array.isArray(v) ? v.join(', ') : String(v)
    return { path: x.path, testo, negativo: NEGATIVO_RE.test(testo), vuoto: testo.trim() === '' }
  })
  const outVbNegativi = outVb.filter((x) => x.negativo)
  const outVbTesto = outVb.filter((x) => !x.negativo && !x.vuoto)
  const outVbDistinti = tally(outVb, (x) => x.testo || '<vuoto>')

  // Criterio di riconoscimento revisore — FIX 22-08-26: non piu il campo esecutore dei singoli
  // controls. Quel campo e testo libero e nei dati contiene anche stringhe di comando
  // («npm run test:mss», «git status --porcelain», «node --check»…): allargare un pattern su un
  // campo libero e fragile, e infatti perdeva un revisore vero la cui stringa finiva in «-review»
  // (senza le due lettere finali «er»). Il posto dove il ruolo di chi ha condotto la seduta e
  // scritto per intero, in un campo con semantica sua e mai una stringa di comando, e
  // recorded_by.role del session_event. Il criterio e dichiarato in output perche chi legge possa
  // rifiutarlo: se recorded_by.role della seduta contiene «reviewer» o «revisor», Nessun altro
  // testo e letto — ma la semantica cambia rispetto a prima: qui TUTTI i controls della seduta
  // vengono attribuiti a chi l'ha condotta, non solo quelli il cui singolo esecutore nomina un
  // revisore. E una domanda diversa: non «quali controlli ha eseguito un revisore» ma «quanti
  // controlli sono registrati in una seduta condotta da un revisore».
  const REVISORE_RE = /reviewer|revisor/i
  const revisori = new Map()
  for (const e of events(data)) {
    const ruolo = String(e.r.recorded_by?.role || '')
    if (!REVISORE_RE.test(ruolo)) continue
    const c = e.r.event?.controls
    if (!Array.isArray(c) || c.length === 0) continue
    const attore = String(e.r.recorded_by?.actor_id || '<attore assente>')
    if (!revisori.has(attore)) revisori.set(attore, { attore, ruolo, controlli: 0, sedute: new Set() })
    const v = revisori.get(attore)
    v.controlli += c.length
    v.sedute.add(e.r.session_id)
  }

  return {
    anns, conVerification, stati, fuoriContratto, verifiedBy, verifiedAt, basi, outAss, outStatus, eligibile,
    outVb, outVbNegativi, outVbTesto, outVbDistinti, revisori: [...revisori.values()],
    amendmentsTotal: amds.length, amendmentsVerificationStatus: amdsVerificationStatus, statiCorrettiDaAmendment,
  }
}

/** Anteprima troncata di un valore per una riga di terminale: il valore intero vive in --json. */
export function previewValore(v, n = 70) {
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length > n ? `${t.slice(0, n)}…` : t
}

export function renderVerifica(data, vista) {
  const m = verificaModel(data)
  const me = verificaModel(vista.dataEffettiva)
  const tot = m.conVerification.length
  const L = intestazione(data)
  L.push(`${C.b}--verifica${C.x}  quante dichiarazioni sono verificate, e chi ha verificato chi`)
  L.push('')
  L.push(`  ${C.b}Stato di verifica delle annotazioni${C.x} ${C.d}(tutti e ${STATI_CONTRATTO.length} i valori del contratto, anche a zero)${C.x}`)
  L.push(`  ${C.d}GREZZO = come scritto nel record originale · EFFETTIVO = dopo la catena degli amendment${C.x}`)
  L.push(`  ${C.d}(contratto §6 — applicata sotto, in «Vista effettiva applicata»)${C.x}`)
  for (const s of STATI_CONTRATTO) {
    const ng = m.stati.get(s)
    const ne = me.stati.get(s)
    const delta = ne - ng
    const deltaTxt = delta === 0 ? '' : `  ${delta > 0 ? C.g : C.r}(${delta > 0 ? '+' : ''}${delta})${C.x}`
    const col = ne === 0 ? C.d : s === 'independently_verified' ? C.g : C.y
    L.push(`    ${col}${pad(s, 26)}${C.x}grezzo ${pad(suTotale(ng, tot), 10)}effettivo ${pad(suTotale(ne, tot), 10)}${deltaTxt}`)
  }
  for (const [k, v] of m.fuoriContratto) L.push(`    ${C.r}${pad(k, 26)}${suTotale(v, tot)}  FUORI CONTRATTO${C.x}`)
  L.push('')
  L.push(`  ${C.b}Chi ha verificato chi${C.x}`)
  L.push(`    ${C.y}Nei record GREZZI verification.verified_by e vuoto in tutte e ${tot} le annotazioni:${C.x}`)
  L.push(`    ${C.d}nessuno ha mai scritto direttamente di aver verificato nessuno.${C.x}`)
  if (me.verifiedBy.length === 0) {
    L.push(`    ${C.d}Nella vista EFFETTIVA resta cosi: nessun amendment applicato in questo corpus corregge${C.x}`)
    L.push(`    ${C.d}verification.verified_by. Il sistema resta autocertificato al 100% anche nella vista effettiva.${C.x}`)
  } else {
    L.push('')
    L.push(`    ${C.g}Nella vista EFFETTIVA (dopo gli amendment) ${suTotale(me.verifiedBy.length, tot)} annotazioni hanno${C.x}`)
    L.push(`    ${C.g}un verificatore — questa e la prima rettifica indipendente della storia del sistema,${C.x}`)
    L.push(`    ${C.g}oggi visibile a questo comando per la prima volta:${C.x}`)
    for (const a of me.verifiedBy) {
      const chi = (a.r.annotation.verification.verified_by || [])
        .map((v) => (typeof v === 'string' ? v : v?.actor_id ?? JSON.stringify(v)))
        .join(', ')
      const target = a.r.annotation?.subject_record_ids?.[0] ?? '?'
      L.push(`      ${C.g}${pad(a.r.annotation.verification.status, 24)}${C.x}verificato da ${chi}`)
      L.push(`        ${C.d}target: ${target} — ${a.path.split('/').pop()}${C.x}`)
    }
  }
  if (m.revisori.length) {
    const totC = m.revisori.reduce((a, r) => a + r.controlli, 0)
    const sedute = new Set(m.revisori.flatMap((r) => [...r.sedute]))
    L.push('')
    L.push(`    ${C.b}Al di la del campo verification, delle review sono state condotte davvero.${C.x} ${C.d}L'unica traccia${C.x}`)
    L.push(`    ${C.d}strutturata e recorded_by.role del session_event: un campo con semantica sua, mai una stringa${C.x}`)
    L.push(`    ${C.d}di comando (a differenza del campo esecutore dei singoli controls).${C.x}`)
    L.push(`    ${C.d}Criterio usato per riconoscerli, dichiarato perche tu possa rifiutarlo:${C.x}`)
    L.push(`    ${C.d}il ruolo dichiarato della seduta (recorded_by.role) contiene «reviewer» o${C.x}`)
    L.push(`    ${C.d}«revisor». Nessun altro testo e letto. Attenzione alla semantica: TUTTI i${C.x}`)
    L.push(`    ${C.d}controls della seduta vengono attribuiti a chi l'ha condotta — non solo quelli${C.x}`)
    L.push(`    ${C.d}il cui singolo esecutore nomina un revisore. E «quanti controlli sono registrati${C.x}`)
    L.push(`    ${C.d}in una seduta condotta da un revisore», non «quali ha eseguito un revisore».${C.x}`)
    // Larghezza colonna dinamica: un pad fisso si e gia rotto una volta (id da 36 caratteri
    // attaccato al numero). Regge l'id piu lungo osservato + un margine, non un valore a memoria.
    const largAttore = Math.max(20, ...m.revisori.map((r) => r.attore.length)) + 2
    for (const r of m.revisori.sort((a, b) => b.controlli - a.controlli)) {
      L.push(`      ${pad(r.attore, largAttore)}${r.controlli} controlli in ${r.sedute.size} seduta/e  ${C.d}ruolo: ${r.ruolo}${C.x}`)
    }
    L.push(`    ${C.d}${totC} controlli in sedute condotte da un revisore, in ${sedute.size} sedute.${C.x}`)
  }
  L.push('')
  L.push(`  ${C.b}Vista effettiva applicata${C.x} ${C.d}(contratto §6 — non piu un limite dichiarato, ora un comportamento)${C.x}`)
  L.push(`    ${C.d}Ordina gli amendment 'final' per effective_at (spareggio: record_id), li applica a batch per${C.x}`)
  L.push(`    ${C.d}timestamp identico, naviga field_path sul valore CORRENTE del bersaglio (non sul grezzo originale).${C.x}`)
  L.push(`    ${C.d}Solo relation:"amends" porta un payload; il bersaglio deve esistere ed essere final. Una catena${C.x}`)
  L.push(`    ${C.d}che non risolve non viene silenziata ne riparata: resta elencata come tale qui sotto.${C.x}`)
  L.push('')
  L.push(`    ${C.d}amendment nel corpus (record): ${m.amendmentsTotal}${C.x}`)
  L.push(`    ${C.g}campi applicati con successo: ${vista.applicate.length}${C.x}`)
  L.push(`    ${vista.nonRisolte.length === 0 ? C.d : C.r}catene non risolte: ${vista.nonRisolte.length}${vista.nonRisolte.length === 0 ? ' — nessuna, in questo momento' : ''}${C.x}`)
  L.push('')
  if (vista.applicate.length === 0) {
    L.push(`    ${C.d}nessun campo applicato: l'elenco completo e vuoto per costruzione, non per omissione.${C.x}`)
  } else {
    L.push(`    ${C.b}Elenco completo dei campi cambiati dalla vista effettiva${C.x} ${C.d}(tutti, non solo verification.status)${C.x}`)
    vista.applicate.forEach((a, i) => {
      L.push(`      ${C.d}${i + 1}.${C.x} ${a.field_path} ${C.d}su${C.x} ${a.target_record_id}`)
      const pg = previewValore(a.precedente)
      const pe = previewValore(a.corretto)
      L.push(`         ${C.d}grezzo:    ${pg}${C.x}`)
      L.push(`         ${C.g}effettivo: ${pe}${C.x}`)
      // Due anteprime identiche non significano «nessun cambiamento»: il troncamento puo cadere
      // prima del punto in cui i due valori divergono. Dirlo, invece di lasciar credere il falso.
      if (pg === pe) {
        L.push(`         ${C.y}(le due anteprime coincidono: la differenza cade oltre il troncamento — valore intero in --json)${C.x}`)
      }
      L.push(`         ${C.d}${a.amendment_id} · effective_at ${a.effective_at} · ${a.path.split('/').pop()}${C.x}`)
    })
  }
  if (vista.nonRisolte.length > 0) {
    L.push('')
    L.push(`    ${C.r}${C.b}Catene non risolte${C.x} ${C.d}(mostrate, non riparate — un difetto misurato vale piu di uno nascosto)${C.x}`)
    vista.nonRisolte.forEach((u, i) => {
      L.push(`      ${C.r}${i + 1}.${C.x} ${u.amendment_id} ${C.d}->${C.x} ${u.target_record_id}${u.field_path ? ` ${u.field_path}` : ''}`)
      L.push(`         ${C.r}motivo: ${u.motivo}${C.x} ${C.d}[${u.rule}]${C.x}`)
      L.push(`         ${C.d}${u.path}${C.x}`)
    })
  }
  L.push('')
  L.push(`    ${C.d}La catena NON e reimplementata qui: e delegata a scripts/mss/core.mjs${C.x}`)
  L.push(`    ${C.d}applyAmendmentsView(), la stessa funzione che usa il validator. Una sola implementazione${C.x}`)
  L.push(`    ${C.d}della regola nel repo: se cambia, cambia per tutti e due i lettori insieme.${C.x}`)
  L.push('')
  L.push(`  ${C.b}Quello che il sistema DICHIARA con precisione${C.x} ${C.d}(il contrario di un archivio reticente)${C.x}`)
  L.push(`    ${C.d}verified_at e non_applicabile ovunque, ma con ${m.verifiedAt.length} motivi distinti scritti a mano:${C.x}`)
  for (const [k, v] of m.verifiedAt.slice(0, 8)) L.push(`      ${pad(`${v}×`, 6)}${C.d}${k}${C.x}`)
  if (m.verifiedAt.length > 8) L.push(`      ${C.d}… e altri ${m.verifiedAt.length - 8} motivi${C.x}`)
  L.push('')
  L.push(`    ${C.d}Base della dichiarazione (asserted_by.basis) — distinta dalla verifica:${C.x}`)
  for (const [k, v] of m.basi) L.push(`      ${pad(k, 26)}${suTotale(v, m.anns.length)}`)
  L.push(`    ${C.d}«direct_observation» dice come e nata la dichiarazione, NON che qualcuno l'abbia${C.x}`)
  L.push(`    ${C.d}controllata. Il contratto tiene le due cose separate, e i dati lo rispettano.${C.x}`)
  L.push('')
  L.push(`  ${C.b}Asse Output: il quinto gate${C.x} ${C.d}(evidenza di verifica o uso)${C.x}`)
  for (const [k, v] of m.outStatus) L.push(`    verification_status ${pad(k, 20)}${suTotale(v, m.outAss.length)}`)
  for (const [k, v] of m.eligibile) {
    const col = k === 'eligible' ? C.g : C.d
    L.push(`    product_candidate    ${col}${pad(k, 20)}${suTotale(v, m.outAss.length)}${C.x}`)
  }
  L.push('')
  L.push(`    ${C.y}Attenzione a verified_by su questo asse: non e la lista di attori del contratto,${C.x}`)
  L.push(`    ${C.y}e testo libero, e nei dati nomina quasi sempre COMANDI, non persone.${C.x}`)
  L.push(`      ${pad('dichiara esplicitamente nessun verificatore', 46)}${suTotale(m.outVbNegativi.length, m.outAss.length)}`)
  L.push(`      ${pad('nomina prove/comandi eseguiti', 46)}${suTotale(m.outVbTesto.length, m.outAss.length)}`)
  L.push(`      ${C.d}${pad('attori identificabili in modo confrontabile', 46)}${suTotale(0, m.outAss.length)} — il campo e prosa${C.x}`)
  L.push(`    ${C.d}Valori piu frequenti: ${m.outVbDistinti.slice(0, 4).map(([k, v]) => `«${k}» ×${v}`).join(' · ')}${C.x}`)
  L.push(`    ${C.d}(${m.outVbDistinti.length} valori distinti in tutto — elenco completo con --json)${C.x}`)
  L.push('')
  L.push(...nonVede([
    'Uno stato di verifica e una dichiarazione di chi scrive: nessuna macchina lo controlla oggi, ' +
      'ne per il grezzo ne per l\'effettivo — un amendment applicato resta autodichiarato da chi lo scrive.',
    'Un valore a zero GREZZO qui puo diventare diverso da zero EFFETTIVO: la riga sopra mostra entrambi, ' +
      'e "Vista effettiva applicata" elenca ogni campo che cambia e perche.',
    'La vista effettiva e ricalcolata in memoria a ogni esecuzione: non scrive nulla su disco e non ' +
      'modifica le capsule. Se una catena non risolve, resta elencata come tale, non silenziata.',
  ]))
  return L
}

// ------------------------------------------------------------------ --fail

function failModel(data) {
  const controlli = []
  for (const e of events(data)) {
    const c = e.r.event?.controls
    if (!Array.isArray(c)) continue
    for (const it of c) controlli.push({ path: e.path, session: e.r.session_id, it })
  }
  const esiti = tally(controlli, (x) => x.it.esito ?? '<assente>')
  const falliti = controlli.filter((x) => String(x.it.esito).toLowerCase() === 'fail')
  const parziali = controlli.filter(
    (x) =>
      String(x.it.esito).toLowerCase() !== 'fail' &&
      typeof x.it.numeratore === 'number' &&
      typeof x.it.denominatore === 'number' &&
      x.it.numeratore < x.it.denominatore,
  )
  const capsuleStatus = tally(events(data), (e) => e.r.event?.capsule_status ?? '<assente>')
  const eventKind = tally(events(data), (e) => e.r.event?.event_kind ?? '<assente>')
  const anns = annotations(data)
  const contradicted = anns.filter((a) => a.r.annotation?.verification?.status === 'contradicted')
  const outNotEligible = []
  for (const a of anns) {
    if (a.r.annotation?.axis !== 'output') continue
    for (const s of a.r.annotation.assertions || []) {
      if (s.product_candidate?.result === 'not_eligible') outNotEligible.push({ path: a.path, s })
    }
  }
  return { controlli, esiti, falliti, parziali, capsuleStatus, eventKind, contradicted, outNotEligible }
}

function renderFail(data, vista) {
  const m = failModel(data)
  const me = failModel(vista.dataEffettiva)
  const L = intestazione(data)
  L.push(`${C.b}--fail${C.x}  gli esiti negativi: il sistema promette di conservarli`)
  L.push('')
  L.push(`  ${C.b}Esiti dei controlli${C.x} ${C.d}(${m.controlli.length} controlli registrati in ${data.sessions.length} sedute)${C.x}`)
  for (const [k, v] of m.esiti) {
    const col = k === 'fail' ? C.r : k === 'pass' ? C.g : C.y
    L.push(`    ${col}${pad(k, 14)}${suTotale(v, m.controlli.length)}${C.x}`)
  }
  L.push('')
  L.push(`  ${C.b}I ${m.falliti.length} controlli falliti, per esteso${C.x}`)
  if (!m.falliti.length) {
    L.push(`    ${C.y}nessuno — e in un archivio di ${data.sessions.length} sedute e un fatto da guardare, non da festeggiare${C.x}`)
  }
  for (const f of m.falliti) {
    L.push(`    ${C.r}${f.it.control_id}${C.x}  ${f.it.numeratore}/${f.it.denominatore}`)
    L.push(`      ${C.d}criterio:  ${f.it.criterio}${C.x}`)
    L.push(`      ${C.d}esecutore: ${f.it.esecutore}${C.x}`)
    L.push(`      ${C.d}report:    ${f.path}${C.x}`)
  }
  L.push('')
  if (m.parziali.length) {
    L.push(`  ${C.b}Controlli non «fail» ma con numeratore < denominatore${C.x} ${C.d}(riusciti in parte)${C.x}`)
    for (const p of m.parziali) {
      L.push(`    ${C.y}${p.it.control_id}${C.x} ${p.it.numeratore}/${p.it.denominatore} ${C.d}[${p.it.esito}] — ${p.path.split('/').pop()}${C.x}`)
    }
    L.push('')
  }
  L.push(`  ${C.b}Gli altri segnali negativi previsti dal contratto${C.x}`)
  L.push(`    ${C.d}Elencati anche quando valgono zero: «mai usato» e una risposta, non un buco.${C.x}`)
  for (const stato of ['invalidata', 'interrotta', 'completa']) {
    const n = m.capsuleStatus.find(([k]) => k === stato)?.[1] || 0
    const col = n === 0 ? C.d : stato === 'completa' ? C.g : C.r
    L.push(`    ${col}capsule_status = ${pad(stato, 14)}${suTotale(n, data.sessions.length)}${C.x}${n === 0 ? `  ${C.d}mai usato${C.x}` : ''}`)
  }
  for (const kind of ['invalidation', 'interruption', 'compact_snapshot', 'session_close']) {
    const n = m.eventKind.find(([k]) => k === kind)?.[1] || 0
    L.push(`    ${n === 0 ? C.d : ''}event_kind = ${pad(kind, 20)}${suTotale(n, data.sessions.length)}${C.x}${n === 0 ? `  ${C.d}mai usato${C.x}` : ''}`)
  }
  L.push(
    `    ${m.contradicted.length === 0 ? C.d : C.r}verification = contradicted    ` +
      `grezzo ${suTotale(m.contradicted.length, annotations(data).length)}${C.x}` +
      `  ${me.contradicted.length === 0 ? C.d : C.r}effettivo ${suTotale(me.contradicted.length, annotations(vista.dataEffettiva).length)}${C.x}`,
  )
  if (me.contradicted.length !== m.contradicted.length) {
    L.push(`    ${C.d}(la vista effettiva applica la catena amendment del contratto §6 — dettaglio in --verifica)${C.x}`)
  }
  L.push(`    ${C.y}product_candidate not_eligible ${m.outNotEligible.length}${C.x} ${C.d}— il quinto gate non superato${C.x}`)
  L.push('')
  L.push(`  ${C.r}La storia dei gate NON e interrogabile da qui.${C.x}`)
  L.push(`    ${C.d}Non e un limite di questo comando: lo schema della capsula non ha alcun campo${C.x}`)
  L.push(`    ${C.d}strutturato per i gate. Lo stato dei gate vive in prosa dentro open_items e${C.x}`)
  L.push(`    ${C.d}observed_outcome, e ricavarlo dal testo libero produrrebbe falsi allarmi.${C.x}`)
  L.push(`    ${C.d}E un difetto dello SCHEMA, da valutare nel pacchetto SK-4.${C.x}`)
  L.push('')
  L.push(...nonVede([
    'Un controllo assente non e un controllo superato: 10 sedute su 42 non ne dichiarano (vedi --costo).',
    'L\'esito e dichiarato da chi scrive; solo per alcuni controlli l\'esecutore e un comando reale.',
  ]))
  return L
}

// ------------------------------------------------------------------ --costo

function costoModel(data) {
  const righe = data.sessions.map((s) => {
    const c = s.event?.event?.controls
    const array = Array.isArray(c) ? c : null
    const dichiaratoNessuno = typeof c === 'string'
    const assente = c === undefined
    const conRatio = array ? array.filter((it) => typeof it.numeratore === 'number' && typeof it.denominatore === 'number').length : 0
    const pacchetti = new Set()
    const strumenti = new Set()
    for (const rec of s.records) {
      for (const p of rec.r.packages_loaded || []) if (p?.package_id) pacchetti.add(p.package_id)
      for (const t of rec.r.recorded_by?.tools_used || []) strumenti.add(String(t))
    }
    return {
      id: s.id,
      path: [...s.paths][0] || '<ignoto>',
      tipo: s.event?.event?.session_type ?? '?',
      controlli: array ? array.length : 0,
      conRatio,
      dichiaratoNessuno,
      assente,
      record: s.records.length,
      pacchetti: pacchetti.size,
      strumenti: strumenti.size,
    }
  })
  const conControls = righe.filter((r) => r.controlli > 0)
  const nessuno = righe.filter((r) => r.dichiaratoNessuno)
  const assenti = righe.filter((r) => r.assente)
  const esecutori = new Map()
  for (const s of data.sessions) {
    const c = s.event?.event?.controls
    if (!Array.isArray(c)) continue
    for (const it of c) {
      const e = String(it.esecutore || '<assente>')
      const macchina = /npm run|node |git |^\S+\.mjs/.test(e)
      const k = macchina ? 'un comando reale' : 'un attore (agente/persona)'
      esecutori.set(k, (esecutori.get(k) || 0) + 1)
    }
  }
  return { righe, conControls, nessuno, assenti, esecutori }
}

function renderCosto(data) {
  const m = costoModel(data)
  const tot = m.righe.length
  const totControlli = m.righe.reduce((a, r) => a + r.controlli, 0)
  const L = intestazione(data)
  L.push(`${C.b}--costo${C.x}  quanto e stato verificato in ogni seduta`)
  L.push('')
  L.push(`  ${C.b}Copertura del campo controls${C.x}`)
  L.push(`    sedute con controls valorizzato   ${C.g}${suTotale(m.conControls.length, tot)}${C.x}`)
  L.push(`    sedute che dichiarano «nessuno»   ${C.y}${suTotale(m.nessuno.length, tot)}${C.x} ${C.d}— dichiarazione esplicita, onesta${C.x}`)
  L.push(`    sedute con il campo ASSENTE       ${C.r}${suTotale(m.assenti.length, tot)}${C.x} ${C.d}— silenzio, non dichiarazione${C.x}`)
  L.push(`    ${C.d}La differenza fra le ultime due righe conta: «nessuno» e una risposta, l'assenza no.${C.x}`)
  L.push('')
  L.push(`  ${C.b}Controlli${C.x}`)
  L.push(`    controlli registrati in totale    ${totControlli}`)
  L.push(`    con numeratore/denominatore reali ${suTotale(m.righe.reduce((a, r) => a + r.conRatio, 0), totControlli)}`)
  L.push(`    media per seduta che ne dichiara  ${(totControlli / Math.max(m.conControls.length, 1)).toFixed(1)}`)
  L.push('')
  L.push(`  ${C.b}Chi ha eseguito i controlli${C.x} ${C.d}(dal campo esecutore)${C.x}`)
  for (const [k, v] of [...m.esecutori].sort((a, b) => b[1] - a[1])) {
    L.push(`    ${pad(k, 34)}${suTotale(v, totControlli)}`)
  }
  L.push(`    ${C.d}Un controllo eseguito da un comando e riproducibile; uno eseguito da un attore no.${C.x}`)
  L.push('')
  L.push(`  ${C.b}Per seduta${C.x} ${C.d}(tipo · controlli · record · pacchetti caricati · strumenti usati)${C.x}`)
  L.push(`    ${C.d}${pad('tipo', 12)}${pad('ctrl', 9)}${pad('rec', 5)}${pad('pkg', 5)}${pad('tool', 6)}report${C.x}`)
  for (const r of [...m.righe].sort((a, b) => b.controlli - a.controlli)) {
    const col = r.assente ? C.r : r.dichiaratoNessuno ? C.y : ''
    const ctrl = r.assente ? 'ASSENTE' : r.dichiaratoNessuno ? 'nessuno' : String(r.controlli)
    L.push(`    ${col}${pad(r.tipo, 12)}${pad(ctrl, 9)}${C.x}${pad(r.record, 5)}${pad(r.pacchetti, 5)}${pad(r.strumenti, 6)}${C.d}${r.path.split('/').pop().slice(0, 52)}${C.x}`)
  }
  L.push('')
  L.push(`  ${C.r}«Quanti file toccati» non e disponibile.${C.x}`)
  L.push(`    ${C.d}Nessun campo strutturato della capsula registra i file toccati. Ricavarlo dal testo${C.x}`)
  L.push(`    ${C.d}libero dei report produrrebbe numeri inventati, quindi il comando non lo stima.${C.x}`)
  L.push(`    ${C.d}Se serve, va aggiunto allo schema — pacchetto SK-4/SK-7, non una deduzione.${C.x}`)
  L.push('')
  L.push(...nonVede([
    'packages_loaded e tools_used sono dichiarati dall\'agente, non catturati dalla macchina.',
    'Il numero di controlli misura quanto e stato DICHIARATO, non quanto lavoro e costato.',
  ]))
  return L
}

// ------------------------------------------------------------------ riepilogo

function renderRiepilogo(data, vista) {
  const m = verificaModel(data)
  const me = verificaModel(vista.dataEffettiva)
  const f = failModel(data)
  const r = regoleModel(data)
  const mo = modelliModel(data)
  const co = costoModel(data)
  const L = intestazione(data)
  L.push(`${C.b}In breve${C.x}`)
  L.push(`    sedute registrate                 ${data.sessions.length}`)
  L.push(`    record JSONL                      ${data.records.length} ${C.d}(~${(data.records.length / Math.max(data.sessions.length, 1)).toFixed(1)} per seduta)${C.x}`)
  L.push(`    regole distinte citate            ${r.stringhe.length} ${C.d}(${r.unaVolta.length} una volta sola, ${r.multiple.length} stringhe multi-regola)${C.x}`)
  L.push(`    provider piu presente             ${mo.provider[0] ? `${mo.provider[0][0]} — ${suTotale(mo.provider[0][1], data.sessions.length)} sedute` : '—'}`)
  L.push(
    `    annotazioni verificate da terzi   ${C.y}${suTotale(m.stati.get('independently_verified'), m.conVerification.length)}${C.x} grezzo` +
      `${C.d} · ${C.x}${C.g}${suTotale(me.stati.get('independently_verified'), me.conVerification.length)}${C.x} effettivo ${C.d}(dopo amendment — vedi --verifica)${C.x}`,
  )
  L.push(`    controlli falliti conservati      ${f.falliti.length ? C.r : C.d}${f.falliti.length}${C.x}`)
  L.push(`    sedute senza controls             ${C.y}${suTotale(co.nessuno.length + co.assenti.length, data.sessions.length)}${C.x}`)
  L.push('')
  L.push(`${C.b}Le cinque domande${C.x}`)
  L.push(`    ${C.b}--regole${C.x}    quali regole compaiono, con quali G/O/E e quante volte`)
  L.push(`    ${C.b}--modelli${C.x}   quante sedute per provider, modello e superficie`)
  L.push(`    ${C.b}--verifica${C.x}  quante dichiarazioni sono verificate, e chi ha verificato chi`)
  L.push(`    ${C.b}--fail${C.x}      tutti gli esiti negativi conservati`)
  L.push(`    ${C.b}--costo${C.x}     quanto e stato verificato in ogni seduta`)
  L.push('')
  L.push(`    ${C.d}npm run mss:query -- --verifica        ${C.x}${C.d}· aggiungi --json per l'output grezzo${C.x}`)
  L.push('')
  L.push(...perimetro(data))
  return L
}

// ------------------------------------------------------------------ blocchi comuni

function nonVede(punti) {
  const L = [`  ${C.y}Che cosa questa risposta NON vede${C.x}`]
  for (const p of punti) L.push(`    ${C.d}· ${p}${C.x}`)
  return L
}

function perimetro(data) {
  const L = []
  const vuoti = data.files.filter((f) => f.empty)
  const storici = vuoti.filter((f) => f.historical)
  const sospetti = vuoti.filter((f) => !f.historical)
  L.push(`${C.y}Perimetro di lettura — dichiarato, non assunto${C.x}`)
  L.push(`  ${C.d}file Report-*.md con intestazione capsula: ${data.files.length} · con righe JSONL: ${data.files.length - vuoti.length}${C.x}`)
  const perOrigine = tally(data.files, (f) => f.origin)
  L.push(`  ${C.d}origine: ${perOrigine.map(([k, v]) => `${k} ${v}`).join(' · ')}${C.x}`)
  if (storici.length) {
    L.push(`  ${C.d}eccezioni storiche riconosciute da parse.mjs (intestazione senza JSONL): ${storici.length}${C.x}`)
    for (const f of storici) L.push(`    ${C.d}· ${f.path}${C.x}`)
  }
  if (sospetti.length) {
    L.push(`  ${C.r}intestazione capsula senza righe JSONL, NON riconosciuta come eccezione: ${sospetti.length}${C.x}`)
    for (const f of sospetti) L.push(`    ${C.r}· ${f.path}${C.x}`)
  }
  if (data.anomalies.some((a) => a.kind === 'riga JSONL non parsabile')) {
    const bad = data.anomalies.filter((a) => a.kind === 'riga JSONL non parsabile')
    L.push(`  ${C.r}righe JSONL non parsabili: ${bad.length} — elencate, non riparate${C.x}`)
    for (const a of bad) L.push(`    ${C.r}· ${a.path} ${a.detail || ''}${C.x}`)
  } else {
    L.push(`  ${C.g}righe JSONL non parsabili: 0${C.x}`)
  }
  const legacy = data.records.filter((x) => x.r.schema_version === SCHEMA_LEGACY).length
  L.push(`  ${C.d}record a schema legacy ${SCHEMA_LEGACY}/${REVISION_LEGACY}: ${legacy} (con quella coppia controls non e obbligatorio — SK-4)${C.x}`)
  L.push('')
  L.push(`${C.y}Limiti noti di questa lettura${C.x}`)
  L.push(`  ${C.d}· Legge l'albero HEAD e il working tree, non la storia dei commit: un report cancellato${C.x}`)
  L.push(`  ${C.d}  o rinominato in passato non compare, e la sua capsula non e recuperabile da qui.${C.x}`)
  L.push(`  ${C.d}· Legge solo file che si chiamano Report-*.md sotto docs/Sessioni di lavoro/. Una capsula${C.x}`)
  L.push(`  ${C.d}  scritta altrove, o con un altro nome, e invisibile a questo comando.${C.x}`)
  L.push(`  ${C.d}· Ogni valore e dichiarato dall'agente che ha scritto la capsula. Questo comando conta${C.x}`)
  L.push(`  ${C.d}  le dichiarazioni; non ne verifica nessuna.${C.x}`)
  L.push('')
  L.push(`${C.d}Questo comando legge soltanto: non scrive, non ripara i dati, non corregge le capsule.${C.x}`)
  return L
}

// ------------------------------------------------------------------ main

const DOMANDE = {
  '--regole': renderRegole,
  '--modelli': renderModelli,
  '--verifica': renderVerifica,
  '--fail': renderFail,
  '--costo': renderCosto,
}

export function runQuery({ argv = [], root = ROOT, isTTY = false } = {}) {
  C = colors(isTTY)
  const json = argv.includes('--json')
  const scelte = argv.filter((a) => a in DOMANDE)
  const ignoti = argv.filter((a) => a.startsWith('--') && a !== '--json' && !(a in DOMANDE))

  if (ignoti.length) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `${C.r}opzione non riconosciuta: ${ignoti.join(' ')}${C.x}\n` +
        `domande disponibili: ${Object.keys(DOMANDE).join(' ')} ${C.d}(oppure nessuna, per il riepilogo)${C.x}\n`,
    }
  }

  const data = collect(root)
  const vista = buildVistaEffettiva(data)

  if (json) {
    const payload = buildQueryPayload(data, vista)
    return { exitCode: 0, stdout: `${JSON.stringify(payload, null, 2)}\n`, stderr: '' }
  }

  const out = []
  if (scelte.length === 0) {
    out.push(...renderRiepilogo(data, vista))
  } else {
    for (const [i, s] of scelte.entries()) {
      if (i > 0) out.push('', `${C.d}${'─'.repeat(78)}${C.x}`, '')
      out.push(...DOMANDE[s](data, vista))
    }
    out.push('')
    out.push(...perimetro(data))
  }
  return { exitCode: 0, stdout: `${out.join('\n')}\n`, stderr: '' }
}

export function buildQueryPayload(data, vista) {
  const modelli = modelliModel(data)
  return {
    perimetro: {
      file_con_intestazione: data.files.length,
      file_con_record: data.files.filter((f) => !f.empty).length,
      record: data.records.length,
      sedute: data.sessions.length,
      anomalie: data.anomalies,
      schema_corrente: SCHEMA_CURRENT,
      revisione_corrente: REVISION_CURRENT,
    },
    regole: (() => {
      const m = regoleModel(data)
      return {
        asserzioni_con_goe: m.asserzioni.length,
        stringhe_distinte: m.stringhe.length,
        citate_una_volta: m.unaVolta.length,
        stringhe_multi_regola: m.multiple.map((s) => ({ stringa: s.stringa, usi: s.usi.length, pezzi: s.pezzi })),
        regole_singole: m.regole.map((r) => ({ regola: r.regola, usi: r.n, E: r.E, G: r.G, O: r.O })),
      }
    })(),
    modelli: {
      per_provider: Object.fromEntries(modelli.provider),
      per_superficie: Object.fromEntries(modelli.surface),
      per_modello_normalizzato: modelli.modelli.map((m) => ({ modello: m.norm, sedute: m.n, grafie: Object.fromEntries(m.grafie) })),
      subject_runtime_non_utilizzabile: modelli.subjInutile,
    },
    verifica: (() => {
      const m = verificaModel(data)
      return {
        stati: Object.fromEntries(m.stati),
        stati_fuori_contratto: Object.fromEntries(m.fuoriContratto),
        annotazioni_con_verified_by: m.verifiedBy.length,
        annotazioni_totali: m.conVerification.length,
        output_verification_status: Object.fromEntries(m.outStatus),
        product_candidate: Object.fromEntries(m.eligibile),
        output_verified_by: {
          nota: 'testo libero, non la lista di attori del contratto: nomina quasi sempre comandi',
          dichiara_nessun_verificatore: m.outVbNegativi.length,
          nomina_prove_o_comandi: m.outVbTesto.length,
          valori_distinti: Object.fromEntries(m.outVbDistinti),
        },
        revisori: {
          nota: 'criterio: recorded_by.role della seduta contiene reviewer|revisor; conta TUTTI i controls della seduta, non solo quelli il cui singolo esecutore lo nomina',
          attori: m.revisori.map((r) => ({ attore: r.attore, ruolo: r.ruolo, controlli: r.controlli, sedute: r.sedute.size })),
          controlli_totali: m.revisori.reduce((a, r) => a + r.controlli, 0),
          sedute_totali: new Set(m.revisori.flatMap((r) => [...r.sedute])).size,
        },
        amendment_verification_status: {
          nota: 'i conteggi di "stati" sopra restano grezzi per costruzione (verificaModel(data), non effettivo): ' +
            'la vista effettiva completa, con tutti i campi applicati e le catene non risolte, e in verifica.vista_effettiva',
          amendment_totali_nel_corpus: m.amendmentsTotal,
          amendment_che_correggono_verification_status: m.amendmentsVerificationStatus.length,
          valori_dichiarati_da_amendment: [...m.statiCorrettiDaAmendment],
          dettaglio: m.amendmentsVerificationStatus.map((a) => ({
            amendment_id: a.r.amendment?.amendment_id,
            target_record_id: a.r.amendment?.target_record_id,
            file: a.path,
          })),
        },
        vista_effettiva: (() => {
          const me = verificaModel(vista.dataEffettiva)
          return {
            nota: 'catena amendment (contratto §6) applicata su tutto il corpus delegando a ' +
              'scripts/mss/core.mjs applyAmendmentsView(), la stessa funzione usata dal validator: ' +
              'una sola implementazione della regola nel repo',
            stati_effettivi: Object.fromEntries(me.stati),
            delta_su_grezzo: Object.fromEntries(STATI_CONTRATTO.map((s) => [s, me.stati.get(s) - m.stati.get(s)])),
            annotazioni_con_verified_by_effettivo: me.verifiedBy.length,
            applicati: vista.applicate,
            non_risolti: vista.nonRisolte,
          }
        })(),
      }
    })(),
    fail: (() => {
      const m = failModel(data)
      const me = failModel(vista.dataEffettiva)
      return {
        esiti: Object.fromEntries(m.esiti),
        falliti: m.falliti.map((f) => ({ control_id: f.it.control_id, criterio: f.it.criterio, numeratore: f.it.numeratore, denominatore: f.it.denominatore, esecutore: f.it.esecutore, report: f.path })),
        capsule_status: Object.fromEntries(m.capsuleStatus),
        contradicted: m.contradicted.length,
        contradicted_effettivo: me.contradicted.length,
      }
    })(),
    costo: (() => {
      const m = costoModel(data)
      return {
        sedute_con_controls: m.conControls.length,
        sedute_nessuno: m.nessuno.length,
        sedute_campo_assente: m.assenti.length,
        per_seduta: m.righe,
      }
    })(),
  }
}

if (isMainModule(import.meta.url)) {
  const result = runQuery({ argv: process.argv.slice(2), root: ROOT, isTTY: Boolean(process.stdout.isTTY) })
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  process.exitCode = result.exitCode
}
