#!/usr/bin/env node
/**
 * check-doc-paths.mjs — verifica che i link/path citati nei docs «vivi» puntino a file esistenti.
 *
 * COSA FA, in sintesi (design WP-E2, approvato 12-06-26):
 *   1. Scansiona tutti i file `.md` sotto `docs/`, ESCLUSE le cartelle di report storici/privati:
 *        - docs/Sessioni di lavoro/**  (report storici, link legacy accettabili)
 *        - docs/_lavoro/**             (privato / gitignored)
 *        - docs/Archivio/**            (storico prodotto)
 *   2. Da ogni file estrae i riferimenti a file LOCALI del repo:
 *        - link markdown [testo](percorso)
 *        - path inline citati (in backtick o testuali) del tipo `docs/.../*.md`, `scripts/x.mjs`, ecc.
 *   3. Per ogni path che punta a un file del repo, se il file NON esiste → errore.
 *
 * COSA IGNORA (per evitare falsi positivi):
 *   - URL esterni: http://, https://, mailto:, ancore #..., schemi vari (X1).
 *   - Tutto ciò che sta dentro fenced code block ``` ... ``` o ~~~ ... ~~~ (X2).
 *   - Path in allowlist (scripts/doc-path-check-allowlist.json) — eccezioni note documentate (X3).
 *   - Link che NON sembrano path di repo (nomi skill senza path, §riferimenti, ecc.): T1c.
 *
 * ESITO:
 *   - exit code 1 se ≥1 path rotto, con elenco `file:line -> path` (E3a).
 *   - exit code 0 se tutto ok, con riepilogo numerico.
 *
 * USO: node scripts/check-doc-paths.mjs   (alias: npm run validate:docs)
 *
 * NOTA Windows/Linux: i path interni sono sempre normalizzati a forward-slash; il filesystem
 * viene interrogato via path.resolve dalla root del repo, così funziona su Windows e in CI Linux.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCliLogger } from './_cliLog.mjs'

const { log, warn, fail } = createCliLogger('check-doc-paths')

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const DOCS_ROOT = join(REPO_ROOT, 'docs')
const ALLOWLIST_PATH = join(__dirname, 'doc-path-check-allowlist.json')

// Cartelle (relative a docs/) da NON scansionare — vedi perimetro P1b del design.
// NOTA (SK-0, 21-08-26): qui c'era `Archivio` (italiano) ma NON `Archives` (inglese), e le due
// cartelle coesistono. `docs/Archives/` conteneva 3868 dei 3886 path rotti — il 99,5% — e teneva
// rosso questo controllo, che gira in CI. Stessa natura di `Archivio`: storico di progetti passati,
// i cui link legacy non vanno corretti.
const EXCLUDED_DIRS = ['Sessioni di lavoro', '_lavoro', 'Archivio', 'Archives']

// --- util path: tutto a forward-slash, relativo alla root del repo ----------
const toPosix = (p) => p.split('\\').join('/')
const relFromRepo = (absPath) => toPosix(absPath).slice(toPosix(REPO_ROOT).length + 1)

// --- 0. allowlist -----------------------------------------------------------
let allowlist = new Set()
if (existsSync(ALLOWLIST_PATH)) {
  try {
    const raw = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'))
    if (Array.isArray(raw)) {
      allowlist = new Set(raw.map((e) => toPosix(String(e.path)).replace(/^\.?\//, '')))
    }
  } catch (err) {
    fail(`Allowlist illeggibile (${ALLOWLIST_PATH})`, err, 1)
  }
}

// --- 0-bis. tetto dichiarato (B4, mandato M-A/M-B 24-08-26; D21) ------------
// L'allowlist non può più crescere di nascosto: un'eccezione in più per
// aggirare un path rotto azzera il valore della raccolta (D21: «vietato
// azzerare il contatore ammorbidendo il controllo»). ALLOWLIST_MAX è il tetto
// dichiarato, pari alla dimensione dell'allowlist al momento in cui il tetto
// è stato posato. Chi vuole aggiungere una voce deve prima chiudere un
// path rotto altrove (la cricchetta stringe) o alzare ALLOWLIST_MAX qui sopra
// giustificando esplicitamente il perché nel commit — mai come effetto
// collaterale silenzioso di un fix altrove.
const ALLOWLIST_MAX = 26
if (allowlist.size > ALLOWLIST_MAX) {
  fail(
    `Allowlist cresciuta a ${allowlist.size} voci, sopra il tetto dichiarato ALLOWLIST_MAX=${ALLOWLIST_MAX} ` +
      `(${ALLOWLIST_PATH}). D21: vietato azzerare il contatore ammorbidendo il controllo — chiudi il path ` +
      `rotto con un fix reale, oppure alza ALLOWLIST_MAX in scripts/check-doc-paths.mjs dichiarando il perché.`,
    1,
  )
} else if (allowlist.size < ALLOWLIST_MAX) {
  warn(
    `Allowlist scesa a ${allowlist.size} voci, sotto il tetto dichiarato ALLOWLIST_MAX=${ALLOWLIST_MAX}: ` +
      'abbassa il tetto in scripts/check-doc-paths.mjs — la cricchetta stringe, non si allarga da sola.',
  )
}

// --- 1. raccolta dei .md vivi sotto docs/ -----------------------------------
function collectDocs(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) {
      // escludi le cartelle top-level di docs/ elencate in EXCLUDED_DIRS
      const relToDocs = toPosix(abs).slice(toPosix(DOCS_ROOT).length + 1)
      const topSegment = relToDocs.split('/')[0]
      if (EXCLUDED_DIRS.includes(topSegment)) continue
      out.push(...collectDocs(abs))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      out.push(abs)
    }
  }
  return out
}

if (!existsSync(DOCS_ROOT)) {
  fail(`Cartella docs/ non trovata in ${DOCS_ROOT}`, 1)
}

const docFiles = collectDocs(DOCS_ROOT)

// --- 2. estrazione riferimenti da un file -----------------------------------
// Decide se una stringa è un riferimento a file LOCALE del repo che va controllato.
const URL_OR_ANCHOR = /^(https?:|mailto:|tel:|ftp:|data:|#|\/\/)/i
// Estensioni di file «di repo» che ci interessa verificare quando citati inline.
const REPO_FILE_EXT = /\.(md|mjs|js|ts|tsx|jsx|json|sql|ya?ml|sh|mdc|css|html|toml|env)$/i
// Prefissi che identificano un path «repo-relative» citato testualmente (docs/…, scripts/…).
const REPO_PREFIX = /^(docs|scripts|src|supabase|tests|e2e|public|\.github|\.cursor)\//i
// Cartelle-bersaglio per cui un link «legacy» è accettabile (report storici / archivio).
// Un link verso _lavoro/ resta INVECE un FAIL (X4): non incluso qui.
const ALLOWED_LEGACY_TARGET = /(^|\/)(Sessioni di lavoro|Archivio)\//

// pulisce un riferimento grezzo: toglie title dopo spazio, frammento, query; URL-decode (%20…).
function cleanRef(raw) {
  let p = raw.trim()
  // un link markdown può avere (path "Titolo") o (path 'Titolo')
  p = p.replace(/\s+["'].*$/, '').trim()
  p = p.split(/\s+/)[0]
  p = p.split('#')[0].split('?')[0]
  p = p.replace(/\\/g, '/')
  try {
    p = decodeURIComponent(p)
  } catch {
    /* lascia il path com'è se non è percent-encoding valido */
  }
  return p
}

/**
 * Decide se un riferimento va controllato.
 * @param kind 'link' per [testo](target), 'inline' per backtick / path nudo.
 *
 * Regole (design T1b / T1c):
 *   - mai URL/ancore (X1).
 *   - deve avere un'estensione di file di repo.
 *   - per i path INLINE: servono separatori di cartella («docs/Area/File.md»),
 *     così non scambiamo un NOME-file-shorthand (`FILE.md`, `PRENOTA_SKILL`) per un path (T1c).
 *   - per i LINK markdown: accettiamo anche relativi `./` `../` o nudi se hanno estensione,
 *     perché le parentesi denotano esplicitamente un target di link.
 */
function isCheckableTarget(rawClean, kind) {
  if (!rawClean) return false
  if (URL_OR_ANCHOR.test(rawClean)) return false
  // pattern/glob/placeholder, non file letterali: «*.sql», «functions/*/index.ts», «<Area>», «{a,b}».
  if (/[*<>{}]/.test(rawClean)) return false
  if (!REPO_FILE_EXT.test(rawClean)) return false
  if (kind === 'inline') {
    // dev'essere un vero path: contiene almeno una «/» con prefisso repo o relativo esplicito.
    const isRepoRel = REPO_PREFIX.test(rawClean)
    const isExplicitRel = /^\.{0,2}\//.test(rawClean) // ./x  ../x  /x
    if (!isRepoRel && !isExplicitRel) return false
  }
  return true
}

/**
 * Restituisce le possibili posizioni assolute di un riferimento (già pulito).
 * Un path passa se ALMENO UNA candidata esiste — questo risolve l'ambiguità di
 * `scripts/x.sql` in un link markdown, che può essere relativo al file (es.
 * docs/Database-Skill/scripts/…) oppure relativo alla root del repo.
 * La candidata «canonica» (la prima) è quella usata nel messaggio d'errore.
 */
function resolveCandidates(p, fileAbs, kind) {
  if (p.startsWith('/')) {
    // path assoluto-repo: relativo alla root del repo
    return [join(REPO_ROOT, p.slice(1))]
  }
  const fromRepoRoot = join(REPO_ROOT, p)
  const fromFileDir = resolve(dirname(fileAbs), p)
  if (REPO_PREFIX.test(p)) {
    // citato come repo-relative. Per i LINK markdown ammettiamo anche la lettura
    // relativa al file (convenzione markdown). Canonica = repo-root.
    return kind === 'link' ? [fromRepoRoot, fromFileDir] : [fromRepoRoot]
  }
  // path relativo esplicito (./  ../) o nudo: relativo alla cartella del file.
  return [fromFileDir]
}

// Pattern: link markdown [testo](target)
const MD_LINK = /\[[^\]]*?\]\(([^)]+)\)/g
// Pattern: path inline in backtick `...`
const INLINE_CODE = /`([^`\n]+)`/g
// Pattern: path repo-relative «nudi» nel testo (docs/..., scripts/..., src/...) con estensione file.
const BARE_PATH =
  /(?<![\w./`([])((?:docs|scripts|src|supabase|tests|e2e|public|\.github|\.cursor)\/[^\s)`'"<>|]+?\.(?:md|mjs|js|ts|tsx|jsx|json|sql|ya?ml|sh|mdc|css|html|toml|env))/gi

function extractRefs(content) {
  // ritorna [{ raw, line }]
  const refs = []
  const lines = content.split(/\r?\n/)
  let inFence = false
  let fenceMarker = ''

  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    const fenceMatch = line.match(/^\s*(```+|~~~+)/)
    if (fenceMatch) {
      const marker = fenceMatch[1][0]
      if (!inFence) {
        inFence = true
        fenceMarker = marker
      } else if (marker === fenceMarker) {
        inFence = false
        fenceMarker = ''
      }
      return // la riga di apertura/chiusura fence non si controlla
    }
    if (inFence) return // X2: salta contenuto dei fenced block

    let m
    // link markdown: kind 'link' (le parentesi denotano un target esplicito)
    MD_LINK.lastIndex = 0
    while ((m = MD_LINK.exec(line)) !== null) {
      refs.push({ raw: m[1], line: lineNo, kind: 'link' })
    }
    // path in backtick `...`: kind 'inline' (richiede separatori di cartella per essere un path)
    INLINE_CODE.lastIndex = 0
    while ((m = INLINE_CODE.exec(line)) !== null) {
      refs.push({ raw: m[1], line: lineNo, kind: 'inline' })
    }
    // path repo-relative «nudi» nel testo: kind 'inline'
    BARE_PATH.lastIndex = 0
    while ((m = BARE_PATH.exec(line)) !== null) {
      refs.push({ raw: m[1], line: lineNo, kind: 'inline' })
    }
  })
  return refs
}

// --- 3. verifica ------------------------------------------------------------
const broken = []
let checkedCount = 0
const seen = new Set() // dedup per (file, line, target) per non gonfiare il conteggio

for (const fileAbs of docFiles) {
  const content = readFileSync(fileAbs, 'utf8')
  const refs = extractRefs(content)
  for (const { raw, line, kind } of refs) {
    const cleaned = cleanRef(raw)
    if (!isCheckableTarget(cleaned, kind)) continue
    const candidates = resolveCandidates(cleaned, fileAbs, kind)
    const canonicalRel = relFromRepo(candidates[0])

    // link «legacy» verso report storici/archivio: accettabili per design (non _lavoro/).
    if (ALLOWED_LEGACY_TARGET.test(canonicalRel)) continue

    const dedupKey = `${relFromRepo(fileAbs)}::${line}::${canonicalRel}`
    if (seen.has(dedupKey)) continue
    seen.add(dedupKey)

    // allowlist (X3): path noto-mancante accettato (match su una qualsiasi candidata)
    if (candidates.some((c) => allowlist.has(relFromRepo(c)))) continue

    checkedCount++

    // un riferimento le cui candidate sono tutte fuori dal repo non lo verifichiamo.
    const inRepo = candidates.filter((c) => toPosix(c).startsWith(toPosix(REPO_ROOT) + '/'))
    if (inRepo.length === 0) continue

    const exists = inRepo.some((c) => {
      try {
        return existsSync(c) && statSync(c).isFile()
      } catch {
        return false
      }
    })
    if (!exists) {
      broken.push({
        file: relFromRepo(fileAbs),
        line,
        target: canonicalRel,
      })
    }
  }
}

// --- 4. report --------------------------------------------------------------
log('')
log(`Doc path check — file .md scansionati: ${docFiles.length}`)
log(`  path locali controllati: ${checkedCount}`)
log(`  path rotti: ${broken.length}`)
if (allowlist.size > 0) log(`  voci in allowlist: ${allowlist.size}`)

if (broken.length > 0) {
  log('')
  log('✖ Path rotti (file:riga -> path mancante):')
  for (const b of broken) {
    log(`  ${b.file}:${b.line} -> ${b.target}`)
  }
  log('')
  log('Correggi i link nei docs oppure aggiungi una voce in scripts/doc-path-check-allowlist.json')
  process.exit(1)
}

log('')
log('✓ Tutti i path citati nei docs vivi esistono.')
process.exit(0)
