#!/usr/bin/env node
/**
 * mss:doctor — la CHECKLIST DI PRIMO RUN. Dice se il motore MSS, in QUESTA repo, e' vivo.
 *
 * IL DIFETTO CHE QUESTO COMANDO ESISTE PER NON AVERE. Una checklist fatta di comandi che escono
 * `0` non prova niente: in una repo appena installata, senza sedute e senza owner, `mss:query` non
 * ha nulla da contare e stampa «zero record» uscendo verde. Chi installa legge verde e crede di
 * avere un sistema funzionante; ha una cartella di script che non guarda niente. E' il falso verde
 * che `R2` vieta — e la stessa forma del difetto `N4` (`--check` deduce l'esito dall'exit code, e
 * un comando che non puo fallire registra un `pass` che non prova nulla).
 *
 * COME LO EVITA. Ogni passo qui e' CAPACE DI FALLIRE e dichiara che cosa proverebbe:
 *   - l'assenza di dati e' un FAIL, non un pass (passi «cartelle dichiarate» e «corpus»);
 *   - due passi sono prove ATTIVE, non osservazioni: il passo «perimetro» controlla che la regex
 *     segua davvero la config in ENTRAMBE le direzioni (accetta il path giusto E rifiuta quello
 *     sbagliato), il passo «sa dire di no» da' in pasto al validator un report che DEVE essere
 *     rifiutato. Se il motore fosse inerte — importato ma scollegato — quei due passi diventerebbero
 *     rossi, mentre qualunque conteggio resterebbe verde.
 *
 * SOLA LETTURA: non scrive niente, da nessuna parte. Esce `0` solo se tutti i passi sono verdi.
 *
 * USO: npm run mss:doctor
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { isMainModule, repoRootFromModule } from './runtime.mjs'
import { runStatus } from './status.mjs'

const ROOT = repoRootFromModule(import.meta.url)

const PASS = 'ok  '
const FAIL = 'FAIL'
const SKIP = '--  '

function node(root, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  })
  return { status: result.status ?? 1, stdout: result.stdout || '', stderr: result.stderr || '' }
}

/**
 * Esegue la checklist. Ritorna un elenco di passi; ogni passo dice che cosa PROVA, non solo se e'
 * andato bene, cosi che un verde si possa contestare leggendo il criterio.
 */
export async function runDoctor({ root = ROOT } = {}) {
  const steps = []
  const add = (name, state, prova, detail) => steps.push({ name, state, prova, detail })

  // ---- 1. la config si risolve -------------------------------------------------------------
  let config = null
  let configModule = null
  try {
    configModule = await import('./config.mjs')
    config = configModule.CONFIG
    const source = existsSync(join(root, configModule.CONFIG_FILENAME))
      ? configModule.CONFIG_FILENAME
      : 'default del motore (nessun file di config: e ammesso)'
    add('config', PASS, 'il motore sa quali cartelle guardare',
      `da ${source} · sedute=${config.sessionsDir} · prefissi=${config.reportKinds.join(',')} · ` +
      `owner=${config.owners.plan}${config.owners.pack ? ` + ${config.owners.pack}` : ' (secondo owner: assente per scelta)'}`)
  } catch (error) {
    add('config', FAIL, 'il motore sa quali cartelle guardare', error.message)
    for (const name of ['motore', 'perimetro', 'sa dire di no', 'cartelle dichiarate', 'suite', 'owner', 'corpus']) {
      add(name, SKIP, 'non eseguito: senza config valida ogni altro esito sarebbe inventato', '')
    }
    return steps
  }

  // ---- 2. il motore e' completo ------------------------------------------------------------
  const { collectExportPaths } = await import('./export-kit.mjs')
  const { files, missing } = collectExportPaths(root)
  add('motore', missing.length ? FAIL : PASS, 'tutti i pezzi dichiarati dal manifesto di export esistono',
    missing.length ? `mancano: ${missing.join(', ')}` : `${files.length} file presenti (elenco: npm run mss:export -- --help)`)

  // ---- 3. il perimetro segue la config, in entrambe le direzioni ---------------------------
  const { REPORT_PATH_RE } = await import('./adapter.mjs')
  const dentro = `${config.sessionsDir}/01-01-99/${config.reportKinds[0]}-sonda-doctor.md`
  const fuori = `una-cartella-che-non-e-quella/01-01-99/${config.reportKinds[0]}-sonda-doctor.md`
  const accettaIlGiusto = REPORT_PATH_RE.test(dentro)
  const rifiutaLoSbagliato = !REPORT_PATH_RE.test(fuori)
  add('perimetro', accettaIlGiusto && rifiutaLoSbagliato ? PASS : FAIL,
    'la regex dei file di seduta segue la config: accetta il path giusto E rifiuta quello sbagliato',
    accettaIlGiusto && rifiutaLoSbagliato
      ? `accettato «${dentro}», rifiutato «${fuori}»`
      : `accetta-il-giusto=${accettaIlGiusto} rifiuta-lo-sbagliato=${rifiutaLoSbagliato} — la regex non segue ${configModule.CONFIG_FILENAME}`)

  // ---- 4. il validator sa dire di no --------------------------------------------------------
  // Prova ATTIVA: un report senza capsula DEVE essere rifiutato. Un motore installato male —
  // moduli presenti ma regole scollegate — passerebbe i conteggi e cadrebbe qui.
  const { validatePathContent } = await import('./adapter.mjs')
  let sadireDiNo = null
  try {
    const esito = validatePathContent({
      workspaceRoot: root,
      file: dentro,
      content: '# Report di sonda\n\n**Modalità:** standard\n\nNessuna capsula qui dentro.\n',
      kind: 'report',
      requireCapsule: true,
      validateGlobal: false,
    })
    sadireDiNo = esito
  } catch (error) {
    sadireDiNo = { ok: true, denyCodes: [], errore: error.message }
  }
  const rifiutato = sadireDiNo.ok === false && (sadireDiNo.denyCodes || []).includes('MSS-REPORT-NO-CAPSULE')
  add('sa dire di no', rifiutato ? PASS : FAIL,
    'un report senza capsula viene RIFIUTATO (se passasse, il motore sarebbe inerte)',
    rifiutato
      ? 'rifiutato con MSS-REPORT-NO-CAPSULE, come deve'
      : `atteso un rifiuto MSS-REPORT-NO-CAPSULE, ottenuto ok=${sadireDiNo.ok} codici=${(sadireDiNo.denyCodes || []).join(',') || 'nessuno'}${sadireDiNo.errore ? ` errore=${sadireDiNo.errore}` : ''}`)

  // ---- 5. le cartelle dichiarate esistono davvero -------------------------------------------
  const mancanti = []
  if (!existsSync(join(root, config.sessionsDir))) mancanti.push(`cartella sedute «${config.sessionsDir}»`)
  if (!existsSync(join(root, config.owners.plan))) mancanti.push(`owner di stato «${config.owners.plan}»`)
  if (config.owners.pack && !existsSync(join(root, config.owners.pack))) mancanti.push(`secondo owner «${config.owners.pack}»`)
  add('cartelle dichiarate', mancanti.length ? FAIL : PASS,
    'cio che la config promette esiste sul disco (un path dichiarato e assente e un FAIL, non un default)',
    mancanti.length ? `da creare, oppure correggi ${configModule.CONFIG_FILENAME}: ${mancanti.join(' · ')}` : 'tutti presenti')

  // ---- 6. le suite girano -------------------------------------------------------------------
  for (const [name, args] of [
    ['test:mss', ['docs/MetaSkillSystem/tests/h1/run.mjs']],
    ['test:mss:tools', ['docs/MetaSkillSystem/tests/tools/run.mjs']],
    ['validate:docs', ['scripts/check-doc-paths.mjs']],
  ]) {
    const run = node(root, args)
    const coda = (run.stderr.trim() || run.stdout.trim()).split('\n').slice(-1)[0] || ''
    add(name, run.status === 0 ? PASS : FAIL, 'la suite esce verde in questa repo',
      run.status === 0 ? coda : `exit ${run.status} — ${coda}`)
  }

  // ---- 7. gli owner sono leggibili -----------------------------------------------------------
  const status = runStatus({ root, isTTY: false })
  const ownerBlock = (status.stdout.match(/Cantiere SYS-1[\s\S]*?(?=\nCoerenza fra tabelle|$)/) || [''])[0]
  const ownerDiagnostic = /^\s*(?:.*— non ricostruibile — apri l'owner|tabella §4 non interpretabile — apri l'owner)$/m
  const ricostruibile = status.exitCode === 0 && ownerBlock && !ownerDiagnostic.test(ownerBlock)
  add('owner', ricostruibile ? PASS : FAIL,
    'mss:status ricostruisce lo stato dagli owner senza dire «non ricostruibile»',
    ricostruibile ? 'stato derivato dagli owner' : 'un owner dichiarato in config non esiste ancora o non si legge — crealo (basta il file: mss:status accetta anche una tabella §4 assente, resta solo «non interpretabile»)')

  // ---- 8. il corpus non e' vuoto -------------------------------------------------------------
  // IL PASSO CHE VIETA IL FALSO VERDE: «zero record, tutto ok» non e' un'installazione riuscita,
  // e' un'installazione che non ha ancora niente da leggere.
  const query = node(root, ['scripts/mss/query.mjs', '--verifica', '--json'])
  let record = null
  let sedute = null
  try {
    const payload = JSON.parse(query.stdout)
    record = payload?.perimetro?.record ?? null
    sedute = payload?.perimetro?.sedute ?? null
  } catch {
    record = null
  }
  const corpusVivo = query.status === 0 && Number.isInteger(record) && record > 0
  add('corpus', corpusVivo ? PASS : FAIL,
    'mss:query legge almeno un record reale (un corpus vuoto NON e un verde: R2)',
    corpusVivo
      ? `${record} record in ${sedute} sedute — contati adesso dal corpus, non copiati`
      : query.status !== 0
        ? `mss:query esce ${query.status}: ${(query.stderr.trim().split('\n').slice(-1)[0]) || 'nessun messaggio'}`
        : `nessun record leggibile sotto «${config.sessionsDir}». Chiudi una seduta con report + capsula, ` +
          'poi rilancia: finche il corpus e vuoto il motore non ha dimostrato di leggere niente.')

  return steps
}

export function renderDoctor(steps) {
  const rotti = steps.filter((s) => s.state === FAIL)
  const L = ['MetaSkillSystem — checklist di primo run', '']
  for (const step of steps) {
    L.push(`  [${step.state}] ${step.name}`)
    L.push(`         prova: ${step.prova}`)
    if (step.detail) L.push(`         ${step.detail}`)
  }
  L.push('')
  L.push(rotti.length
    ? `${rotti.length} passo/i rosso/i: ${rotti.map((s) => s.name).join(', ')}. Il motore NON e installato correttamente.`
    : 'Tutti i passi verdi. Il motore legge, valida e sa rifiutare in questa repo.')
  L.push('')
  L.push('Questa checklist non certifica il contenuto delle sedute: certifica che gli attrezzi')
  L.push('funzionano e che hanno qualcosa di reale da leggere.')
  return `${L.join('\n')}\n`
}

if (isMainModule(import.meta.url)) {
  const steps = await runDoctor({ root: ROOT })
  process.stdout.write(renderDoctor(steps))
  process.exitCode = steps.some((s) => s.state === FAIL) ? 1 : 0
}
