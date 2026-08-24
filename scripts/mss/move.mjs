#!/usr/bin/env node
/**
 * mss:move (T1 / SK-9 / R6) — sposta o rinomina un file e aggiorna i riferimenti vivi.
 *
 * Forma unica:
 *   npm run mss:move -- <sorgente> <destinazione> [--no-stub] [--skip-validate]
 *
 * Effetti:
 *   1. sposta/rinomina nel working tree
 *   2. aggiorna riferimenti vivi (docs fuori dalle cartelle storiche/private + citazioni path in scripts/)
 *   3. non riscrive la storia sotto «Sessioni di lavoro» / Archivio
 *   4. esce rosso senza scrivere a metà se sorgente assente, destinazione occupata, zona congelata
 *      o riferimenti non riscrivibili; in caso di fallimento post-scrittura annulla
 *   5. di default lascia uno stub di redirect (policy archive TTL 30g) e lancia validate:docs
 *
 * Baseline storica del costo manuale: ≈ 1 741 righe (D15 / STRATEGIA 21-08-26).
 * Parser path: `scripts/doc-paths-lib.mjs` (D18 — stesso owner di validate:docs).
 */

import { spawnSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import {
  isExistingFile,
  planLiveDocRewrites,
  planScriptPathRewrites,
  relFromRepo,
  toPosix,
} from '../doc-paths-lib.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'

const ROOT = repoRootFromModule(import.meta.url)

/** Baseline documentata del costo di un move manuale (righe toccate storicamente). */
export const MANUAL_MOVE_BASELINE_LINES = 1741

/**
 * Zone congelate: L5 prove tecniche + L6 privato + storia sedute.
 * Un path (sorgente o destinazione) che cade qui → rosso leggibile.
 */
export const FROZEN_PREFIXES = Object.freeze([
  'docs/_lavoro/',
  'docs/Sessioni di lavoro/',
  'docs/MetaSkillSystem/fixtures/',
  'docs/MetaSkillSystem/tests/',
  'scripts/mss/',
])

export function isFrozenPath(relPosix) {
  const p = toPosix(relPosix).replace(/^\.\//, '')
  return FROZEN_PREFIXES.some((prefix) => p === prefix.slice(0, -1) || p.startsWith(prefix))
}

function usage() {
  return [
    'mss:move (T1/R6) — sposta un file e aggiorna i riferimenti vivi.',
    '',
    '  npm run mss:move -- <sorgente> <destinazione> [--no-stub] [--skip-validate]',
    '',
    '  --no-stub          non lascia lo stub di redirect al path vecchio',
    '  --skip-validate    non lancia validate:docs a fine move (solo prove isolate)',
    '',
    `Baseline costo manuale documentata: ${MANUAL_MOVE_BASELINE_LINES} righe.`,
  ].join('\n')
}

export function parseMoveArgs(argv) {
  const args = argv.slice(2)
  const flags = new Set()
  const positional = []
  for (const a of args) {
    if (a === '--help' || a === '-h') flags.add('help')
    else if (a === '--no-stub') flags.add('noStub')
    else if (a === '--skip-validate') flags.add('skipValidate')
    else if (a.startsWith('-')) flags.add(`unknown:${a}`)
    else positional.push(a)
  }
  return {
    help: flags.has('help'),
    noStub: flags.has('noStub'),
    skipValidate: flags.has('skipValidate'),
    unknown: [...flags].filter((f) => f.startsWith('unknown:')).map((f) => f.slice(8)),
    source: positional[0] || null,
    dest: positional[1] || null,
    extra: positional.slice(2),
  }
}

export function normalizeRepoRel(root, input) {
  const raw = toPosix(String(input)).replace(/^\.\//, '')
  if (!raw || raw.includes('\0')) return { ok: false, error: 'path vuoto o illegale' }
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || /^[a-z]:\//i.test(raw) || raw.startsWith('/')) {
    return { ok: false, error: `path deve essere relativo alla root del repo (ricevuto: ${input})` }
  }
  const segments = raw.split('/')
  if (segments.includes('..')) {
    return { ok: false, error: `path con «..» rifiutato: ${input}` }
  }
  const abs = resolve(root, raw)
  const rel = relFromRepo(root, abs)
  if (rel.startsWith('..')) {
    return { ok: false, error: `path fuori dalla root del repo: ${input}` }
  }
  return { ok: true, rel: toPosix(rel), abs }
}

export function buildStubMarkdown({ fromRel, toRel, createdAt = new Date() }) {
  const iso = createdAt.toISOString().slice(0, 10)
  const ttlEnd = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  let relLink = toPosix(relative(dirname(fromRel), toRel))
  if (!relLink.startsWith('.')) relLink = `./${relLink}`
  return [
    '# Stub di redirect (mss:move)',
    '',
    `> **Spostato in:** [\`${toRel}\`](${relLink})`,
    `> **Creato:** ${iso}`,
    `> **TTL:** 30 giorni (fino a ≈ ${ttlEnd})`,
    '> **Rimozione:** dopo TTL **e** zero hit sul path vecchio (`rg` su repo + docs vivi).',
    '',
    `Questo file è uno stub generato da \`npm run mss:move\`. Il contenuto vive in \`${toRel}\`.`,
    '',
  ].join('\n')
}

function countChangedLines(before, after) {
  const a = before.split(/\r?\n/)
  const b = after.split(/\r?\n/)
  let changed = 0
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) changed++
  }
  return changed
}

function runValidateDocs(root) {
  const script = join(root, 'scripts/check-doc-paths.mjs')
  if (!existsSync(script)) {
    return { status: 2, output: 'scripts/check-doc-paths.mjs assente — non posso validare i path' }
  }
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return {
    status: result.status ?? 1,
    output: `${result.stdout || ''}${result.stderr || ''}`,
  }
}

/**
 * Esegue il move. Ritorna { exitCode, stdout, stderr, summary? }.
 * Non lancia eccezioni per errori di contratto (path assente, zona congelata, …).
 */
export function runMove(argv = process.argv, { root = ROOT, validateDocs = runValidateDocs } = {}) {
  const out = []
  const err = []
  const args = parseMoveArgs(argv)

  if (args.help) {
    out.push(`${usage()}\n`)
    return { exitCode: 0, stdout: out.join(''), stderr: '' }
  }
  if (args.unknown.length) {
    err.push(`Flag sconosciuto: ${args.unknown.join(', ')}\n${usage()}\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }
  if (!args.source || !args.dest || args.extra.length) {
    err.push(`Servono esattamente due path: <sorgente> <destinazione>\n${usage()}\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }

  const fromN = normalizeRepoRel(root, args.source)
  if (!fromN.ok) {
    err.push(`Sorgente rifiutata: ${fromN.error}\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }
  const toN = normalizeRepoRel(root, args.dest)
  if (!toN.ok) {
    err.push(`Destinazione rifiutata: ${toN.error}\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }
  if (fromN.rel === toN.rel) {
    err.push('Sorgente e destinazione coincidono — niente da fare.\n')
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }
  if (isFrozenPath(fromN.rel) || isFrozenPath(toN.rel)) {
    err.push(
      `Zona congelata (L5 prove / L6 privato / storia sedute). ` +
        `Rifiuto move di «${isFrozenPath(fromN.rel) ? fromN.rel : toN.rel}».\n`,
    )
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }
  if (!isExistingFile(fromN.abs)) {
    err.push(`Sorgente assente o non è un file: ${fromN.rel}\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }
  if (existsSync(toN.abs)) {
    err.push(`Destinazione già occupata: ${toN.rel}\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }

  const docsPlan = planLiveDocRewrites(root, fromN.abs, toN.abs)
  if (!docsPlan.ok) {
    err.push(`${docsPlan.error}\nNessuna scrittura effettuata.\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }
  const scriptsPlan = planScriptPathRewrites(root, fromN.rel, toN.rel)
  if (!scriptsPlan.ok) {
    err.push(`${scriptsPlan.error}\nNessuna scrittura effettuata.\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }

  // Dedup per path: prima i rewrite markdown, poi le citazioni stringa negli script.
  const byFile = new Map()
  for (const u of docsPlan.updates) {
    byFile.set(u.file, { ...u, hits: [...u.hits] })
  }
  for (const u of scriptsPlan.updates) {
    const prev = byFile.get(u.file)
    if (!prev) {
      byFile.set(u.file, { ...u, hits: [...u.hits] })
      continue
    }
    let after = prev.after
    if (after.includes(fromN.rel)) after = after.split(fromN.rel).join(toN.rel)
    byFile.set(u.file, {
      file: u.file,
      abs: u.abs,
      before: prev.before,
      after,
      hits: [...prev.hits, ...u.hits],
    })
  }

  const updates = [...byFile.values()]
  const wantStub = !args.noStub && fromN.rel.toLowerCase().endsWith('.md')
  const sourceBytes = readFileSync(fromN.abs)

  /** @type {{ kind: string, abs: string, before?: Buffer|string }[]} */
  const rollback = []

  const failAndRollback = (message) => {
    for (const step of [...rollback].reverse()) {
      try {
        if (step.kind === 'wrote' && step.before != null) {
          writeFileSync(step.abs, step.before)
        } else if (step.kind === 'created') {
          rmSync(step.abs, { force: true })
        } else if (step.kind === 'moved') {
          if (existsSync(toN.abs) && !existsSync(fromN.abs)) {
            renameSync(toN.abs, fromN.abs)
          } else if (existsSync(toN.abs) && existsSync(fromN.abs)) {
            // stub già scritto: ripristina contenuto originale
            writeFileSync(fromN.abs, sourceBytes)
            rmSync(toN.abs, { force: true })
          }
        }
      } catch (restoreErr) {
        err.push(`Rollback parziale fallito su ${step.abs}: ${restoreErr.message}\n`)
      }
    }
    err.push(`${message}\nAlbero ripristinato (nessuna scrittura a metà lasciata intenzionalmente).\n`)
    return { exitCode: 1, stdout: out.join(''), stderr: err.join('') }
  }

  try {
    mkdirSync(dirname(toN.abs), { recursive: true })
    // Copia + delete invece di rename cross-device; su stesso volume rename è ok.
    try {
      renameSync(fromN.abs, toN.abs)
    } catch {
      copyFileSync(fromN.abs, toN.abs)
      rmSync(fromN.abs, { force: true })
    }
    rollback.push({ kind: 'moved', abs: toN.abs })

    if (wantStub) {
      const stub = buildStubMarkdown({ fromRel: fromN.rel, toRel: toN.rel })
      writeFileSync(fromN.abs, stub, 'utf8')
      rollback.push({ kind: 'created', abs: fromN.abs })
    }

    for (const u of updates) {
      writeFileSync(u.abs, u.after, 'utf8')
      rollback.push({ kind: 'wrote', abs: u.abs, before: u.before })
    }
  } catch (writeErr) {
    return failAndRollback(`Scrittura interrotta: ${writeErr.message}`)
  }

  if (!args.skipValidate) {
    const gate = validateDocs(root)
    if (gate.status !== 0) {
      return failAndRollback(
        `validate:docs rosso dopo il move (exit ${gate.status}).\n${gate.output.trim()}`,
      )
    }
  }

  const hitCount = updates.reduce((n, u) => n + u.hits.length, 0)
  const lineCost = updates.reduce((n, u) => n + countChangedLines(u.before, u.after), 0)
    + (wantStub ? buildStubMarkdown({ fromRel: fromN.rel, toRel: toN.rel }).split(/\r?\n/).length : 0)

  out.push(`mss:move OK\n`)
  out.push(`  da          ${fromN.rel}\n`)
  out.push(`  a           ${toN.rel}\n`)
  out.push(`  stub        ${wantStub ? 'sì' : 'no'}\n`)
  out.push(`  file tocchi ${updates.length + 1 + (wantStub ? 1 : 0)} (1 move${wantStub ? ' + 1 stub' : ''} + ${updates.length} riferimenti)\n`)
  out.push(`  ref aggiornati ${hitCount}\n`)
  out.push(`  righe delta ≈ ${lineCost}  (baseline manuale documentata: ${MANUAL_MOVE_BASELINE_LINES})\n`)
  if (updates.length) {
    out.push('  aggiornati:\n')
    for (const u of updates) out.push(`    - ${u.file} (${u.hits.length} ref)\n`)
  }
  if (!args.skipValidate) out.push('  validate:docs  verde\n')

  return {
    exitCode: 0,
    stdout: out.join(''),
    stderr: '',
    summary: {
      from: fromN.rel,
      to: toN.rel,
      stub: wantStub,
      filesTouched: updates.length + 1 + (wantStub ? 1 : 0),
      refsUpdated: hitCount,
      lineDelta: lineCost,
      baselineManualLines: MANUAL_MOVE_BASELINE_LINES,
      updatedFiles: updates.map((u) => u.file),
    },
  }
}

if (isMainModule(import.meta.url)) {
  const result = runMove(process.argv)
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  process.exit(result.exitCode)
}
