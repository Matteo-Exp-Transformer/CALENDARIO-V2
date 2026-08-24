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
 * Parser path: `scripts/doc-paths-lib.mjs` (D18 — stesso owner di `mss:move`).
 *
 * USO: node scripts/check-doc-paths.mjs   (alias: npm run validate:docs)
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCliLogger } from './_cliLog.mjs'
import {
  ALLOWED_LEGACY_TARGET,
  cleanRef,
  collectLiveDocs,
  extractRefs,
  isCheckableTarget,
  relFromRepo,
  resolveCandidates,
  toPosix,
} from './doc-paths-lib.mjs'

const { log, warn, fail } = createCliLogger('check-doc-paths')

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const DOCS_ROOT = join(REPO_ROOT, 'docs')
const ALLOWLIST_PATH = join(__dirname, 'doc-path-check-allowlist.json')

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

if (!existsSync(DOCS_ROOT)) {
  fail(`Cartella docs/ non trovata in ${DOCS_ROOT}`, 1)
}

const docFiles = collectLiveDocs(DOCS_ROOT)

const broken = []
let checkedCount = 0
const seen = new Set()

for (const fileAbs of docFiles) {
  const content = readFileSync(fileAbs, 'utf8')
  const refs = extractRefs(content)
  for (const { raw, line, kind } of refs) {
    const cleaned = cleanRef(raw)
    if (!isCheckableTarget(cleaned, kind)) continue
    const candidates = resolveCandidates(cleaned, fileAbs, kind, REPO_ROOT)
    const canonicalRel = relFromRepo(REPO_ROOT, candidates[0])

    if (ALLOWED_LEGACY_TARGET.test(canonicalRel)) continue

    const dedupKey = `${relFromRepo(REPO_ROOT, fileAbs)}::${line}::${canonicalRel}`
    if (seen.has(dedupKey)) continue
    seen.add(dedupKey)

    if (candidates.some((c) => allowlist.has(relFromRepo(REPO_ROOT, c)))) continue

    checkedCount++

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
        file: relFromRepo(REPO_ROOT, fileAbs),
        line,
        target: canonicalRel,
      })
    }
  }
}

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
