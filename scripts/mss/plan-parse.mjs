/**
 * Parser PLAN condiviso — un solo posto per leggere gate e cicli dall'owner.
 *
 * views.mjs e status.mjs devono derivare lo stesso «prossimo gate»: se divergono,
 * un agente freddo vede due verità. Il parser prende l'ULTIMA occorrenza strutturata
 * (ciclo concluso, prossima azione, stato R1): le sezioni storiche restano nel file
 * ma non governano più l'output operativo.
 */

function required(text, re, label) {
  const value = text.match(re)?.[1]?.trim()
  if (!value) {
    throw new Error(`MSS-PLAN-UNREADABLE: non trovo «${label}» nell'owner. Non invento uno stato plausibile.`)
  }
  return value
}

/**
 * @param {string} planText
 * @returns {{
 *   closedId: string,
 *   closedState: string,
 *   next: string,
 *   nextLabel: string,
 *   r1: string,
 *   r1FromExplicitLine: boolean,
 * }}
 */
export function parsePlanGate(planText) {
  // Famiglie chiuse riconosciute: M-[A-Z] storici e T\d+ (es. T6). Criterio semantico
  // invariato: solo «eseguito e CHIUSO|PROVATO» — CON RISERVE non chiude (es. T7).
  const cycles = [...planText.matchAll(/### [^\n]* — `((?:M-[A-Z])|T\d+)` eseguito e \*\*(CHIUSO|PROVATO)\*\*/g)]
  if (!cycles.length) {
    throw new Error('MSS-PLAN-UNREADABLE: non trovo «ciclo concluso» nell\'owner.')
  }
  const [, closedId, closedState] = cycles[cycles.length - 1]
  const nextMatches = [...planText.matchAll(/\*\*Prossima azione autorizzata: `((?:M-[A-Z])|[RT]\d+)`\*\* \(([^)]+)\)/g)]
  if (!nextMatches.length) {
    throw new Error('MSS-PLAN-UNREADABLE: non trovo «prossima azione autorizzata» nell\'owner.')
  }
  const nextMatch = nextMatches[nextMatches.length - 1]
  const next = nextMatch[1]
  const nextLabel = nextMatch[2].replace(/\s+/g, ' ').trim()
  const r1Explicit = [...planText.matchAll(/\*\*Stato R1 attuale:\*\* `R1` è \*\*([^*]+)\*\*/g)].at(-1)?.[1]
  const r1 = r1Explicit || required(
    planText,
    /`R1` resta \*\*(raccomandato ma non\s+aperto)\*\*/,
    'stato R1',
  )
  return {
    closedId,
    closedState,
    next,
    nextLabel,
    r1: r1.replace(/\s+/g, ' ').trim(),
    r1FromExplicitLine: Boolean(r1Explicit),
  }
}

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
    .filter((cells) => cells.length >= 2)
}

function stripMd(s) {
  return (s || '').replace(/\*\*/g, '').replace(/`/g, '').replace(/~~/g, '').trim()
}

function extractRiserva(...parts) {
  const joined = parts.filter(Boolean).join(' ')
  const idx = joined.indexOf('⚠️')
  if (idx < 0) return null
  return joined.slice(idx).replace(/\s+/g, ' ').trim()
}

function extractData(stato) {
  const m = (stato || '').match(/\b(\d{2}-\d{2}-\d{2})\b/)
  return m ? m[1] : null
}

function parseIdAndEtichetta(cell) {
  const raw = stripMd(cell)
  const m = raw.match(/^((?:WP|MP|H|E|SK)-[\w.-]+)\s*[—–-]?\s*(.*)$/)
  if (m) return { id: m[1], etichetta: m[2].trim() || m[1] }
  const tok = raw.split(/\s+/)[0]
  return { id: tok, etichetta: raw.slice(tok.length).trim() || tok }
}

function parseSection4(planText) {
  const rows = tableRows(planText, /\n## 4\. Quadro corrente/)
  return rows
    .filter((c) => /^(WP|MP|H|E)-/.test(stripMd(c[1] || c[0] || '')))
    .map((c) => {
      const col = c.length >= 3 && /^(WP|MP|H|E)-/.test(stripMd(c[1] || '')) ? 1 : 0
      const statoCol = col + 1
      const { id, etichetta } = parseIdAndEtichetta(c[col] || '')
      const stato = stripMd(c[statoCol] || '')
      return {
        id,
        etichetta,
        stato,
        data: extractData(stato),
        riserva: extractRiserva(c[statoCol], c[statoCol + 1]),
      }
    })
}

function parseSection4bis(planText) {
  const rows = tableRows(planText, /\n### 4-bis\./)
  return rows
    .filter((c) => /^SK-/.test(stripMd(c[1] || c[0] || '')))
    .map((c) => {
      const idCol = /^SK-/.test(stripMd(c[1] || '')) ? 1 : 0
      const { id, etichetta } = parseIdAndEtichetta(c[idCol] || '')
      const stato = stripMd(c[idCol + 1] || '')
      const prova = c[idCol + 2] || ''
      return {
        id,
        etichetta,
        stato,
        data: extractData(stato),
        riserva: extractRiserva(stato, prova),
      }
    })
}

function parseSection4terOverrides(planText) {
  const rows = tableRows(planText, /\n### 4-ter\./)
  const map = new Map()
  for (const c of rows) {
    const id = stripMd(c[0] || '').split(/\s/)[0]
    if (/^SK-\d+/.test(id)) {
      map.set(id, stripMd(c[1] || ''))
    }
  }
  return map
}

/**
 * Righe normalizzate da §4 e §4-bis; §4-ter sovrascrive stato operativo SK.
 * @param {string} planText
 */
export function parsePlanBoard(planText) {
  const wp = parseSection4(planText)
  const sk = parseSection4bis(planText)
  const overrides = parseSection4terOverrides(planText)
  const board = [...wp, ...sk]
  for (const row of board) {
    if (overrides.has(row.id)) {
      const nuovo = overrides.get(row.id)
      row.stato = nuovo
      row.data = extractData(nuovo) || row.data
    }
  }
  return board
}

/**
 * Glossa operativa da tutte le sezioni ### 4-quater presenti.
 * @param {string} planText
 */
export function parsePlanGlosses(planText) {
  const glosses = []
  const headingRe = /\n### 4-quater[^\n]*/g
  let match
  while ((match = headingRe.exec(planText)) !== null) {
    const after = planText.slice(match.index)
    const end = after.slice(1).search(/\n#{2,3} /)
    const block = end < 0 ? after : after.slice(0, end + 1)
    const rows = block
      .split('\n')
      .filter((l) => l.trim().startsWith('|') && !/^\|[\s|:-]+\|$/.test(l.trim()))
      .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
      .filter((cells) => cells.length >= 2)
    for (const c of rows) {
      const id = stripMd(c[0] || '').split(/\s/)[0]
      if (!/^(?:WP|MP|H|E|SK)-/.test(id) || id.toLowerCase() === 'id') continue
      glosses.push({ id, glossa: stripMd(c[1] || c[0] || '') })
    }
  }
  return glosses
}

const CYCLE_HEADING_RE = /### ([^\n]*?) — `((?:M-[A-Z][\w-]*)|T\d+)` eseguito e \*\*([^*]+)\*\*/g

/**
 * Ultimo ciclo §15 con pattern «eseguito e **STATO**».
 * @param {string} planText
 */
export function parsePlanLastCycle(planText) {
  const matches = [...planText.matchAll(CYCLE_HEADING_RE)]
  if (!matches.length) return null
  const m = matches[matches.length - 1]
  const titolo = m[1].trim()
  const id = m[2]
  const stato = m[3].trim()
  const headingLine = m[0]
  const startIdx = m.index + headingLine.length
  let rest = planText.slice(startIdx)
  if (!rest.startsWith('\n')) {
    const nl = rest.indexOf('\n')
    rest = nl < 0 ? '' : rest.slice(nl + 1)
  }
  const nextHeading = rest.search(/\n### /)
  const block = nextHeading < 0 ? rest : rest.slice(0, nextHeading)
  const lines = block.split('\n')
  const paragraphs = []
  let buf = []
  for (const line of lines) {
    if (line.trim() === '') {
      if (buf.length) {
        paragraphs.push(buf.join(' ').trim())
        buf = []
      }
    } else if (!line.trim().startsWith('|') && !line.trim().startsWith('#')) {
      buf.push(line.trim())
    } else if (buf.length) {
      paragraphs.push(buf.join(' ').trim())
      buf = []
    }
  }
  if (buf.length) paragraphs.push(buf.join(' ').trim())
  const primoParagrafo = paragraphs.find((p) => p.length > 20) || paragraphs[0] || ''
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g
  const atti = []
  for (const lm of block.matchAll(linkRe)) {
    atti.push({ label: lm[1], href: lm[2] })
  }
  const dataMatch = titolo.match(/(\d{2}-\d{2}-\d{4})/)
  return {
    titolo,
    data: dataMatch ? dataMatch[1] : null,
    id,
    stato,
    paragrafo: primoParagrafo,
    atti,
  }
}

/**
 * @param {Array<{id: string}>} board
 * @param {Array<{id: string}>} glosses
 */
export function validatePlanGlosses(board, glosses) {
  const ids = new Set(board.map((r) => r.id))
  const orphans = glosses.filter((g) => !ids.has(g.id)).map((g) => g.id)
  return { ok: orphans.length === 0, orphans }
}

/**
 * Vocabolario chiuso per bucket lavagna — fuori vocabolario → non-classificata.
 * @param {string} stato
 */
export function classifyPlanState(stato) {
  const s = (stato || '').trim()
  const upper = s.toUpperCase()
  if (/^CHIUSO/.test(upper) || upper.includes('ALLINEATO') || upper.includes('ESEGUITO E PUBBLICATO')) {
    return 'fatta'
  }
  // Solo «PASS_CON_RISERVE» / «PASS CON RISERVE» — non la parola «riserva» in prosa di chiusura
  if (/PASS_CON_RISERVE|PASS\s+CON\s+RISERVE/i.test(s)) {
    return 'con-riserva'
  }
  // PASS pulito (senza «con riserve») — Opzione B H-1.3 dopo E2 misurato
  if (/\bPASS\b/i.test(s) && !/NON\s+PASS/i.test(s)) {
    return 'fatta'
  }
  if (/^NON INIZIATO/.test(upper) || /^BLOCCATO/.test(upper)) {
    return 'da-fare'
  }
  if (/buco intenzionale/i.test(s) || /chiusura invalidata/i.test(s)) {
    return 'non-classificata'
  }
  return 'non-classificata'
}
