import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/** Trova la radice del repository senza dipendere dalla profondita dello script. */
export function findRepoRoot(start) {
  let dir = resolve(start)
  for (let i = 0; i < 12; i++) {
    if (existsSync(join(dir, 'package.json'))) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return resolve(start)
}

/** Guard ESM: importare una CLI non deve eseguirne il main. */
export function isMainModule(importMetaUrl, argv = process.argv) {
  const entry = argv[1]
  if (!entry) return false
  return pathToFileURL(resolve(entry)).href === importMetaUrl
}

export function repoRootFromModule(importMetaUrl) {
  return findRepoRoot(dirname(fileURLToPath(importMetaUrl)))
}
