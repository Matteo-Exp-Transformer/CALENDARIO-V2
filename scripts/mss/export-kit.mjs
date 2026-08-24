#!/usr/bin/env node
/**
 * mss:export — porta il motore MSS in un'altra repo.
 *
 * PERCHE NON E' UN PACCHETTO NPM. Il motore non ha nessuna dipendenza esterna: solo `node:*` e
 * import relativi fra i propri moduli. Quindi «esportare» non e' packaging, e' una copia di
 * cartella. Un bundler, un workspace o una pubblicazione su registry aggiungerebbero un livello di
 * cose che si rompono senza risolvere niente che oggi sia rotto.
 *
 * PERCHE NON E' UNA COPIA DENTRO `_skill-system-v0/`. Tenere nel kit una seconda copia dei moduli
 * significherebbe due sorgenti della stessa regola che divergono al primo fix (D18). Il kit resta
 * markdown; il motore si copia AL MOMENTO dalla sorgente viva, che e' l'unica.
 *
 * QUELLO CHE COPIA NON E' UNA LISTA A MANO. `scripts/mss/*.mjs` si scopre leggendo la cartella:
 * un modulo nuovo entra nell'export senza che nessuno si ricordi di aggiungerlo. Per il resto c'e'
 * un manifesto esplicito, e dopo la copia gira un CONTROLLO DI CHIUSURA che risolve ogni import
 * relativo dei file copiati: se manca un pezzo, l'export esce rosso invece di consegnare un motore
 * monco che fallira' piu' tardi, altrove, con un errore incomprensibile.
 *
 * NON SPOSTA NULLA (D15): copia. La sorgente resta dov'e'.
 *
 * USO: npm run mss:export -- --to <cartella> [--force]
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { CONFIG_FILENAME, DEFAULT_CONFIG, FIXTURES_ROOT } from './config.mjs'
import { isMainModule, repoRootFromModule } from './runtime.mjs'

const ROOT = repoRootFromModule(import.meta.url)

/**
 * Il motore, per strati. `dir` = tutto il contenuto; `file` = un singolo path.
 * `required: false` = se manca nella sorgente non e' un errore (il progetto ospite puo' non averlo).
 */
export const EXPORT_MANIFEST = Object.freeze([
  { kind: 'dir', path: 'scripts/mss', filter: (name) => name.endsWith('.mjs'), why: 'i moduli del motore' },
  { kind: 'file', path: 'scripts/check-doc-paths.mjs', why: 'validate:docs vive fuori da scripts/mss' },
  { kind: 'file', path: 'scripts/_cliLog.mjs', why: 'logger CLI usato da check-doc-paths' },
  { kind: 'file', path: 'scripts/doc-path-check-allowlist.json', why: 'allowlist con tetto dichiarato (D21)' },
  { kind: 'dir', path: 'docs/MetaSkillSystem/tests', why: 'test:mss e test:mss:tools' },
  { kind: 'dir', path: FIXTURES_ROOT, why: 'fixture congelate H-1 (inchiodate per sha256)' },
  { kind: 'file', path: 'docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json', why: 'denominatore della suite H-1' },
  { kind: 'file', path: 'docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md', why: 'schema della capsula: e un owner_ref che deve risolvere' },
  { kind: 'file', path: 'docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md', why: 'ingresso di routing citato dai test' },
  { kind: 'file', path: 'docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md', why: 'manuale dell agente freddo' },
  { kind: 'file', path: '.cursor/hooks/fine-sessione-commit-check.mjs', required: false, why: 'ponte pre-commit verso l adapter' },
  { kind: 'dir', path: '_skill-system-v0', required: false, why: 'kit markdown + intervista di avvio' },
])

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.isFile()) out.push(full)
  }
  return out
}

/** Elenca i path repo-relativi da copiare, risolvendo il manifesto contro la sorgente. */
export function collectExportPaths(root = ROOT, manifest = EXPORT_MANIFEST) {
  const files = []
  const missing = []
  for (const item of manifest) {
    const absolute = join(root, item.path)
    if (!existsSync(absolute)) {
      if (item.required === false) continue
      missing.push(item.path)
      continue
    }
    if (item.kind === 'dir') {
      if (!statSync(absolute).isDirectory()) {
        missing.push(item.path)
        continue
      }
      for (const full of walk(absolute)) {
        const rel = relative(root, full).replace(/\\/g, '/')
        if (item.filter && !item.filter(rel.split('/').pop())) continue
        files.push(rel)
      }
    } else {
      files.push(item.path)
    }
  }
  return { files: [...new Set(files)].sort(), missing }
}

const RELATIVE_IMPORT_RE = /(?:^|\n)\s*(?:import|export)[^\n]*?from\s+['"](\.[^'"]+)['"]/g

/**
 * CONTROLLO DI CHIUSURA. Ogni import relativo dei `.mjs` copiati deve risolvere DENTRO la
 * destinazione. E' il controllo che rende l'export capace di fallire: senza, un modulo dimenticato
 * si scopre solo quando qualcuno, in un'altra repo, vede un `ERR_MODULE_NOT_FOUND`.
 */
export function findDanglingImports(targetRoot, files) {
  const dangling = []
  for (const rel of files) {
    if (!rel.endsWith('.mjs')) continue
    const absolute = join(targetRoot, rel)
    if (!existsSync(absolute)) continue
    const source = readFileSync(absolute, 'utf8')
    for (const match of source.matchAll(RELATIVE_IMPORT_RE)) {
      const specifier = match[1]
      const resolved = resolve(dirname(absolute), specifier)
      if (!existsSync(resolved)) dangling.push({ from: rel, specifier })
    }
  }
  return dangling
}

/** Frammento `scripts` da fondere nel package.json della repo ospite. */
export function packageScriptsFragment() {
  return {
    'validate:docs': 'node scripts/check-doc-paths.mjs',
    'validate:mss': 'node scripts/mss/cli.mjs',
    'validate:mss:changed': 'node scripts/mss/validate-changed-reports.mjs',
    'validate:mss:all': 'npm run test:mss && npm run test:mss:tools && npm run validate:docs',
    'mss:status': 'node scripts/mss/status.mjs',
    'mss:query': 'node scripts/mss/query.mjs',
    'mss:capsule': 'node scripts/mss/capsule.mjs',
    'mss:doctor': 'node scripts/mss/doctor.mjs',
    'mss:export': 'node scripts/mss/export-kit.mjs',
    'test:mss': 'node docs/MetaSkillSystem/tests/h1/run.mjs',
    'test:mss:tools': 'node docs/MetaSkillSystem/tests/tools/run.mjs',
    'generate:mss-fixtures': 'node docs/MetaSkillSystem/tests/h1/build-fixtures.mjs',
  }
}

function configSeed() {
  return `${JSON.stringify({
    sessionsDir: DEFAULT_CONFIG.sessionsDir,
    reportKinds: [...DEFAULT_CONFIG.reportKinds],
    owners: { ...DEFAULT_CONFIG.owners },
  }, null, 2)}\n`
}

export function runExport(argv, { root = ROOT } = {}) {
  const args = argv.slice(2)
  const out = []
  const err = []
  const toIndex = args.indexOf('--to')
  const force = args.includes('--force')
  if (args.includes('--help') || toIndex < 0 || !args[toIndex + 1]) {
    out.push('mss:export — copia il motore MSS in un\'altra repo.\n')
    out.push('  npm run mss:export -- --to <cartella> [--force]\n\n')
    out.push('  --to      cartella di destinazione (la radice della repo ospite)\n')
    out.push('  --force   sovrascrive i file gia presenti nella destinazione\n\n')
    out.push('Dopo la copia: apri MANUALE_AVVIO.md (passo 0) e lancia `npm run mss:doctor`.\n')
    return { exitCode: toIndex < 0 && !args.includes('--help') ? 2 : 0, stdout: out.join(''), stderr: '' }
  }

  const target = resolve(args[toIndex + 1])
  const { files, missing } = collectExportPaths(root)
  if (missing.length) {
    err.push(`Sorgente incompleta — mancano nel repo di partenza:\n  ${missing.join('\n  ')}\n`)
    return { exitCode: 2, stdout: '', stderr: err.join('') }
  }

  const copied = []
  const skipped = []
  for (const rel of files) {
    const destination = join(target, rel)
    if (existsSync(destination) && !force) {
      skipped.push(rel)
      continue
    }
    mkdirSync(dirname(destination), { recursive: true })
    copyFileSync(join(root, rel), destination)
    copied.push(rel)
  }

  // Il seme di config e il frammento di script NON sovrascrivono mai in silenzio: la repo ospite
  // puo averli gia, e sovrascriverli cancellerebbe scelte sue.
  const configPath = join(target, CONFIG_FILENAME)
  let configNote = `${CONFIG_FILENAME} gia presente, lasciato com'e`
  if (!existsSync(configPath)) {
    writeFileSync(configPath, configSeed(), 'utf8')
    configNote = `${CONFIG_FILENAME} scritto con i valori di default — adattalo alla repo ospite`
  }

  const packagePath = join(target, 'package.json')
  const fragment = packageScriptsFragment()
  let packageNote
  if (!existsSync(packagePath)) {
    writeFileSync(packagePath, `${JSON.stringify({
      name: 'mss-host',
      private: true,
      type: 'module',
      scripts: fragment,
    }, null, 2)}\n`, 'utf8')
    packageNote = 'package.json creato con gli script del motore'
  } else {
    packageNote = 'package.json gia presente — fondi a mano gli script elencati sotto'
  }

  // Marcatore di materiale vendorizzato: i .md del motore citano path dell'albero di ORIGINE.
  // Senza questo, `validate:docs` nella repo ospite resterebbe rosso per sempre su link che
  // non si possono chiudere — e l'unica «cura» sarebbe gonfiare l'allowlist (vietato, D21).
  const vendorMarker = join(target, 'docs/MetaSkillSystem/.mss-vendored')
  if (existsSync(dirname(vendorMarker)) && !existsSync(vendorMarker)) {
    writeFileSync(vendorMarker, [
      'Cartella copiata da un altro repository con `npm run mss:export`.',
      'I link dei .md qui dentro puntano all albero di origine: `validate:docs` li salta.',
      'Togli questo file se adotti questi documenti come tuoi e ne correggi i link.',
      '',
    ].join('\n'), 'utf8')
  }

  const dangling = findDanglingImports(target, files)
  out.push(`mss:export → ${target}\n\n`)
  out.push(`  copiati    ${copied.length} file\n`)
  out.push(`  saltati    ${skipped.length} file gia presenti${skipped.length && !force ? ' (usa --force per sovrascrivere)' : ''}\n`)
  out.push(`  config     ${configNote}\n`)
  out.push(`  package    ${packageNote}\n\n`)
  if (packageNote.startsWith('package.json gia')) {
    out.push('Script da fondere in "scripts":\n')
    for (const [name, command] of Object.entries(fragment)) out.push(`  "${name}": "${command}"\n`)
    out.push('\n')
  }
  if (dangling.length) {
    err.push('EXPORT INCOMPLETO — import relativi che non risolvono nella destinazione:\n')
    for (const d of dangling) err.push(`  ${d.from} → ${d.specifier}\n`)
    err.push('\nIl manifesto di export non copre un modulo: aggiungilo a EXPORT_MANIFEST.\n')
    return { exitCode: 1, stdout: out.join(''), stderr: err.join('') }
  }
  out.push('Chiusura verificata: ogni import relativo dei file copiati risolve nella destinazione.\n\n')
  out.push('Prossimo passo, nella repo ospite:\n')
  out.push(`  1. adatta ${CONFIG_FILENAME} (dove vivono le sedute, come si chiama l'owner di stato)\n`)
  out.push('  2. crea la cartella delle sedute e il file owner dichiarati li dentro\n')
  out.push('  3. npm run mss:doctor   ← la checklist di primo run: dice se il motore e vivo\n')
  return { exitCode: 0, stdout: out.join(''), stderr: err.join('') }
}

if (isMainModule(import.meta.url)) {
  const result = runExport(process.argv, { root: ROOT })
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  process.exitCode = result.exitCode
}
