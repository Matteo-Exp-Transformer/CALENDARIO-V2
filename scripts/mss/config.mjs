/**
 * Configurazione del motore MSS — owner unico dei path che l'INSTALLAZIONE decide (R8).
 *
 * PERCHE ESISTE. Fino a oggi il motore sapeva a memoria come si chiamano le cartelle di QUESTO
 * progetto: `docs/Sessioni di lavoro`, `docs/MetaSkillSystem/fixtures/v0.1`, `PLAN_V0.md`. Portarlo
 * in un'altra repo voleva dire riscrivere quei nomi in sei file diversi. Qui vivono una volta sola.
 *
 * REGOLA NON NEGOZIABILE — DEFAULT = COMPORTAMENTO ATTUALE. Senza `mss.config.json` i valori sono
 * identici a quelli cablati prima: questa repo non deve configurare nulla per restare verde. Un
 * file di config e' un'AGGIUNTA per chi installa altrove, mai un prerequisito.
 *
 * REGOLA NON NEGOZIABILE — UN CONFIG ROTTO E' ROSSO, NON UN DEFAULT. Se `mss.config.json` esiste
 * ma e' illeggibile o dichiara un path assurdo, questo modulo LANCIA. Ricadere sui default
 * silenziosamente farebbe validare la repo sbagliata dicendo verde: e' esattamente il falso verde
 * che R2 vieta.
 *
 * D18 — questi valori NON si riscrivono altrove: `adapter.mjs`, `query.mjs`, `git-adapter.mjs`,
 * `report-paths.mjs` e `status.mjs` importano da qui. `REPORT_PATH_RE` resta esportato da
 * `adapter.mjs` (re-export) perche' i suoi cinque consumatori non devono cambiare import.
 *
 * ECCEZIONE VOLUTA, NON DA «AGGIUSTARE»: `parse.mjs` inchioda un report storico per sha256 con il
 * suo path letterale. E' l'eccezione storica decisa a monte e non passa da qui.
 */

import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { repoRootFromModule } from './runtime.mjs'

export const CONFIG_FILENAME = 'mss.config.json'

/** I valori cablati prima di `R8`, uno per uno. Cambiarli qui cambia il default di ogni installazione. */
export const DEFAULT_CONFIG = Object.freeze({
  sessionsDir: 'docs/Sessioni di lavoro',
  reportKinds: Object.freeze(['Report', 'Verbale']),
  owners: Object.freeze({
    plan: 'docs/MetaSkillSystem/PLAN_V0.md',
    pack: 'docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md',
  }),
})

/**
 * INTERNO AL MOTORE, NON CONFIGURABILE — e una scelta, non una dimenticanza.
 * La suite H-1 inchioda le fixture per sha256 e ne cita il path in decine di asserzioni: il
 * layout canonico e parte del protocollo congelato, non del progetto ospite. Esporre una chiave
 * `fixturesRoot` in `mss.config.json` darebbe una manopola che `test:mss` non puo seguire — una
 * falsa possibilita e peggio di nessuna. Sta qui perche il valore abbia UN owner (D18): prima era
 * riscritto quattro volte in `adapter.mjs`.
 */
export const FIXTURES_ROOT = 'docs/MetaSkillSystem/fixtures/v0.1'

const KNOWN_KEYS = new Set(['sessionsDir', 'reportKinds', 'owners'])
const KNOWN_OWNERS = new Set(['plan', 'pack'])

/** Metacaratteri regex: un path finisce dentro una RegExp, quindi va reso letterale. */
function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Un path di config e' sempre relativo alla root del repo, con `/`, senza risalite.
 * Un path assoluto o con `..` farebbe leggere e validare file fuori dal repo.
 */
function requireRepoRelativePath(value, key) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${CONFIG_FILENAME}: «${key}» deve essere un path non vuoto relativo alla root del repo.`)
  }
  const normalized = value.replace(/\\/g, '/').replace(/\/+$/, '')
  if (isAbsolute(normalized) || normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized)) {
    throw new Error(`${CONFIG_FILENAME}: «${key}» deve essere relativo alla root del repo, non assoluto (${value}).`)
  }
  if (normalized.split('/').some((segment) => segment === '..' || segment === '.' || segment === '')) {
    throw new Error(`${CONFIG_FILENAME}: «${key}» non puo' contenere «.» o «..» (${value}).`)
  }
  return normalized
}

function requireReportKinds(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${CONFIG_FILENAME}: «reportKinds» deve essere un array non vuoto (es. ["Report","Verbale"]).`)
  }
  return value.map((kind) => {
    if (typeof kind !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(kind)) {
      throw new Error(
        `${CONFIG_FILENAME}: «reportKinds» ammette solo prefissi alfanumerici (lettera iniziale), trovato «${kind}».`,
      )
    }
    return kind
  })
}

/**
 * Valida e normalizza un oggetto di config grezzo. Pura: non tocca il disco, quindi e' testabile
 * senza costruire una repo finta.
 */
export function normalizeConfig(raw = {}) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`${CONFIG_FILENAME}: il contenuto deve essere un oggetto JSON.`)
  }
  for (const key of Object.keys(raw)) {
    if (!KNOWN_KEYS.has(key)) {
      throw new Error(
        `${CONFIG_FILENAME}: chiave sconosciuta «${key}». Ammesse: ${[...KNOWN_KEYS].join(', ')}. ` +
        'Una chiave con un refuso verrebbe ignorata in silenzio e il motore userebbe il default sbagliato.',
      )
    }
  }
  const ownersRaw = raw.owners ?? {}
  if (ownersRaw === null || typeof ownersRaw !== 'object' || Array.isArray(ownersRaw)) {
    throw new Error(`${CONFIG_FILENAME}: «owners» deve essere un oggetto (chiavi: ${[...KNOWN_OWNERS].join(', ')}).`)
  }
  for (const key of Object.keys(ownersRaw)) {
    if (!KNOWN_OWNERS.has(key)) {
      throw new Error(`${CONFIG_FILENAME}: owner sconosciuto «${key}». Ammessi: ${[...KNOWN_OWNERS].join(', ')}.`)
    }
  }
  return Object.freeze({
    sessionsDir: raw.sessionsDir === undefined
      ? DEFAULT_CONFIG.sessionsDir
      : requireRepoRelativePath(raw.sessionsDir, 'sessionsDir'),
    reportKinds: Object.freeze(
      raw.reportKinds === undefined ? [...DEFAULT_CONFIG.reportKinds] : requireReportKinds(raw.reportKinds),
    ),
    owners: Object.freeze({
      plan: ownersRaw.plan === undefined
        ? DEFAULT_CONFIG.owners.plan
        : requireRepoRelativePath(ownersRaw.plan, 'owners.plan'),
      // `pack` puo essere `null`: il secondo owner (Senior-Eval-Pack) e una cosa di QUESTO
      // progetto, non del motore. Una repo ospite con un solo owner lo dichiara assente invece
      // di far stampare per sempre «non ricostruibile» su un file che non esistera mai.
      pack: ownersRaw.pack === undefined
        ? DEFAULT_CONFIG.owners.pack
        : ownersRaw.pack === null
          ? null
          : requireRepoRelativePath(ownersRaw.pack, 'owners.pack'),
    }),
  })
}

/** Legge `<root>/mss.config.json` se c'e'. Assente = default; presente e rotto = errore. */
export function loadConfigFrom(root) {
  const file = join(root, CONFIG_FILENAME)
  if (!existsSync(file)) return normalizeConfig({})
  let raw
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    throw new Error(`${file} non e' JSON valido: ${error.message}`)
  }
  return normalizeConfig(raw)
}

/** `^<sessionsDir>/.../(Report|Verbale)-*.md` — la definizione di «file di seduta». */
export function buildReportPathRe(config) {
  const kinds = config.reportKinds.map(escapeRe).join('|')
  return new RegExp(`^${escapeRe(config.sessionsDir)}\\/.+\\/(${kinds})-.*\\.md$`, 'i')
}

/** `^<sessionsDir>/<giorno>/(resto)` — serve a riconoscere i path-prova sotto il giorno. */
export function buildSessionSubpathRe(config) {
  return new RegExp(`^${escapeRe(config.sessionsDir)}\\/[^/]+\\/(.+)$`, 'i')
}

/** Regex e costanti derivate dalla cartella fixture interna al motore. */
export function buildFixtureMatchers(fixturesRoot = FIXTURES_ROOT) {
  const root = escapeRe(fixturesRoot)
  return {
    fixtureRe: new RegExp(`^${root}\\/(.+\\.(?:jsonl|md))$`, 'i'),
    fixtureTreeRe: new RegExp(`^${root}\\/`, 'i'),
    manifestPath: `${fixturesRoot}/manifest.json`,
  }
}

/** La config di QUESTA installazione, risolta una volta al caricamento del motore. */
export const MSS_ROOT = repoRootFromModule(import.meta.url)
export const CONFIG = loadConfigFrom(MSS_ROOT)
