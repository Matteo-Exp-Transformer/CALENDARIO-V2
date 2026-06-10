#!/usr/bin/env node
/**
 * sync-to-prenotazen.mjs — porta il codice da CalendarBackup-v2 (privata) a PrenotaZen (pubblica).
 *
 * COSA FA, in ordine:
 *   1. Verifica di essere su `main` con working tree pulito (la release parte SEMPRE da main).
 *   2. Esporta il codice di `main` con `git archive` (SOLO file tracciati → niente segreti,
 *      niente file gitignored/untracked: .env.local, .vercel, agenti-locali non possono entrare).
 *   3. Sovrascrive l'albero di PrenotaZen con l'export, RIMUOVENDO prima i vecchi file di codice
 *      (così un file cancellato in dev sparisce anche dalla pubblica).
 *   4. Rimuove dall'export ciò che NON va in pubblico (docs/, .cursor/, .claude/, AGENTS.md, ecc.).
 *   5. Lascia PrenotaZen pronta: mostra `git status` e i comandi finali da lanciare.
 *
 * COSA NON FA (di proposito): non committa e non pusha. L'ultimo passo lo fai tu/l'agente,
 * dopo aver guardato il diff. Così non si pubblica mai nulla alla cieca.
 *
 * USO:
 *   1) cd CalendarBackup-v2 && git checkout main && git pull   (assicurati che main sia aggiornato)
 *   2) node scripts/sync-to-prenotazen.mjs
 *   3) cd ../PrenotaZen && npm run build   (verifica build verde PRIMA di pushare)
 *   4) git add -A && git commit -m "release: <descrizione>" && git push
 *
 * Lo script si ferma con errore chiaro se qualcosa non torna (branch sbagliato, tree sporco,
 * cartella PrenotaZen non trovata). In quel caso non tocca nulla.
 */

import { execSync } from 'node:child_process'
import { existsSync, rmSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEV_ROOT = resolve(__dirname, '..') // CalendarBackup-v2
// PrenotaZen è la repo sorella, accanto a CalendarBackup-v2
const PUBLIC_ROOT = resolve(DEV_ROOT, '..', 'PrenotaZen')

// File/cartelle che NON devono MAI finire nella repo pubblica, anche se tracciati in dev.
// (git archive porta tutti i file tracciati; questi li ri-rimuoviamo a valle.)
const STRIP_FROM_PUBLIC = [
  'docs',
  '.cursor',
  '.claude',
  '_skill-system-v0',
  'AGENTS.md',
  'ONBOARDING.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'Report idea workflow per sviluppatore',
]

// Cosa cancellare dall'albero pubblico PRIMA di estrarre il nuovo export, così i file
// rimossi in dev spariscono anche in pubblico. NON tocchiamo .git, node_modules, dist.
const PRESERVE_IN_PUBLIC = new Set(['.git', 'node_modules', 'dist', '.vercel'])

const log = (msg) => console.log(`\n▶ ${msg}`)
const ok = (msg) => console.log(`  ✓ ${msg}`)
const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

const sh = (cmd, opts = {}) =>
  execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim()

// --- 1. Controlli di sicurezza su CalendarBackup-v2 -------------------------
log('Controllo stato repo dev (CalendarBackup-v2)')

let branch
try {
  branch = sh('git rev-parse --abbrev-ref HEAD', { cwd: DEV_ROOT })
} catch {
  fail('Non sono in una repo git? Lancia lo script da dentro CalendarBackup-v2.')
}
if (branch !== 'main') {
  fail(
    `Sei sul branch "${branch}", ma la release pubblica parte SOLO da main.\n` +
      `  Fai prima: git checkout main && git merge env/test (o il tuo branch) && git pull`,
  )
}
ok('sei su main')

const dirty = sh('git status --porcelain', { cwd: DEV_ROOT })
if (dirty) {
  fail(
    'Working tree sporco su main. Committa o stasha prima di rilasciare:\n' +
      dirty
        .split('\n')
        .slice(0, 10)
        .map((l) => '    ' + l)
        .join('\n'),
  )
}
ok('working tree pulito')

if (!existsSync(PUBLIC_ROOT)) {
  fail(
    `Repo pubblica non trovata in: ${PUBLIC_ROOT}\n` +
      `  Deve esistere il clone sorella PrenotaZen accanto a CalendarBackup-v2.\n` +
      `  Clona con: git clone https://github.com/Matteo-Exp-Transformer/PrenotaZen.git`,
  )
}
ok(`repo pubblica trovata: ${PUBLIC_ROOT}`)

const headSha = sh('git rev-parse --short main', { cwd: DEV_ROOT })

// --- 2. Pulizia albero pubblico (preservando .git/node_modules/dist/.vercel) ---
log('Pulisco i vecchi file di codice in PrenotaZen (tengo .git, node_modules, dist, .vercel)')
for (const entry of readdirSync(PUBLIC_ROOT)) {
  if (PRESERVE_IN_PUBLIC.has(entry)) continue
  rmSync(join(PUBLIC_ROOT, entry), { recursive: true, force: true })
}
ok('albero pubblico ripulito')

// --- 3. Export del codice via git archive (solo file tracciati) -------------
log('Esporto il codice di main con git archive (solo file tracciati → niente segreti)')
// git archive | tar -x : estraiamo direttamente nell'albero pubblico.
execSync(`git archive --format=tar main | tar -x -C "${PUBLIC_ROOT}"`, {
  cwd: DEV_ROOT,
  stdio: 'inherit',
  shell: true,
})
ok('codice estratto')

// --- 4. Rimuovo ciò che non va in pubblico ----------------------------------
log('Rimuovo dall’export i file interni (docs, .cursor, .claude, AGENTS.md, ...)')
for (const rel of STRIP_FROM_PUBLIC) {
  const p = join(PUBLIC_ROOT, rel)
  if (existsSync(p)) {
    rmSync(p, { recursive: true, force: true })
    ok(`rimosso ${rel}`)
  }
}

// --- 5. Esito + istruzioni finali -------------------------------------------
log('Stato finale di PrenotaZen')
const status = sh('git status --short', { cwd: PUBLIC_ROOT })
console.log(status ? status : '  (nessuna differenza: PrenotaZen è già allineata a main)')

console.log(`
────────────────────────────────────────────────────────────
✅ Sync completato — main@${headSha} copiato in PrenotaZen.

PROSSIMI PASSI (falli tu/l'agente, dopo aver guardato il diff sopra):

  cd "${PUBLIC_ROOT}"
  npm run build          # ← verifica build verde PRIMA di pushare
  git add -A
  git commit -m "release: <descrivi cosa cambia>"
  git push

Nota: lo script NON committa né pusha apposta — l'ultimo controllo è umano.
────────────────────────────────────────────────────────────
`)
