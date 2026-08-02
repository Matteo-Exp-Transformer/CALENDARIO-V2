#!/usr/bin/env node
/**
 * Apply pending migrations to the linked Supabase TEST project.
 *
 * The repo has two historical `003_*` migration files, but Supabase migration
 * history can only store one `003` version. To keep `db push` usable without
 * `--include-all`, this script runs the CLI from a temporary workdir that omits
 * the known duplicate file. The source migrations are never modified.
 */

import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const TEST_PROJECT_REF = 'docnnernvpyrbwuzzach'
const DUPLICATE_003_FILE = '003_menu_categories.sql'
const BLOCKED_ARGS = new Set(['--include-all', '--db-url', '--local', '--workdir'])

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const sourceSupabaseDir = path.join(projectRoot, 'supabase')
const projectRefPath = path.join(sourceSupabaseDir, '.temp', 'project-ref')
const args = process.argv.slice(2)

function fail(message) {
  console.error(`[db:apply] ${message}`)
  process.exit(1)
}

for (const arg of args) {
  const [name] = arg.split('=')
  if (BLOCKED_ARGS.has(name)) {
    fail(`argomento non ammesso: ${arg}`)
  }
}

let projectRef = ''
try {
  projectRef = readFileSync(projectRefPath, 'utf8').trim()
} catch {
  fail(`non riesco a leggere ${path.relative(projectRoot, projectRefPath)}`)
}

if (projectRef !== TEST_PROJECT_REF) {
  fail(`ref collegato "${projectRef || '(vuoto)'}"; atteso TEST "${TEST_PROJECT_REF}"`)
}

const tmpRoot = path.join(tmpdir(), `calendarbackup-db-apply-${process.pid}`)
const tmpSupabaseDir = path.join(tmpRoot, 'supabase')
const tmpMigrationsDir = path.join(tmpSupabaseDir, 'migrations')

try {
  mkdirSync(tmpMigrationsDir, { recursive: true })
  mkdirSync(path.join(tmpSupabaseDir, '.temp'), { recursive: true })
  cpSync(path.join(sourceSupabaseDir, 'config.toml'), path.join(tmpSupabaseDir, 'config.toml'))
  cpSync(projectRefPath, path.join(tmpSupabaseDir, '.temp', 'project-ref'))

  for (const file of readdirSync(path.join(sourceSupabaseDir, 'migrations'))) {
    if (!file.endsWith('.sql') || file === DUPLICATE_003_FILE) continue
    cpSync(path.join(sourceSupabaseDir, 'migrations', file), path.join(tmpMigrationsDir, file))
  }

  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const result = spawnSync(
    npx,
    ['supabase', 'db', 'push', '--linked', '--workdir', tmpRoot, ...args],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  )

  if (result.error) {
    console.error(`[db:apply] errore avvio Supabase CLI: ${result.error.message}`)
  }
  process.exitCode = result.status ?? 1
} finally {
  if (existsSync(tmpRoot)) {
    rmSync(tmpRoot, { recursive: true, force: true })
  }
}
