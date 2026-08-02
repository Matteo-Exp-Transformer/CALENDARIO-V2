#!/usr/bin/env node
/**
 * Hook `beforeMCPExecution` + `beforeShellExecution` di Cursor — GUARD PROD.
 *
 * SCOPO: trasformare la regola di sicurezza prod da markdown (governance soft, dipende dalla
 * buona volontà dell'agente di chiamare `get_project_url` prima di scrivere) a ENFORCEMENT vero.
 * La macchina ferma l'azione e CHIEDE conferma prima di una scrittura sul DB di PRODUZIONE.
 *
 * COSA RICONOSCE COME «PROD»:
 *  - Via MCP: il NOME del server dice già l'ambiente. `mcp__claude_ai_Supabase__*` = PROD
 *    (rwuxgvld); `mcp__claude_ai_Supabase_test__*` = TEST (docnnernvp). Non serve indovinare
 *    l'URL dal payload: il nome del tool è la fonte di verità. (Mappa in CLAUDE.md «Ambienti DB».)
 *  - Via shell: comandi `supabase db push` / `db reset` / `migration up` che applicano al remoto
 *    LINKATO. Se il link locale è TEST (`docnnernvp`) passano; qualsiasi altro ref, o ref non
 *    leggibile, chiede conferma.
 *
 * COSA È SCRITTURA (gli unici tool MCP che mutano dati/schema sul DB):
 *   execute_sql · apply_migration · deploy_edge_function · merge_branch · reset_branch ·
 *   rebase_branch · create_branch · delete_branch
 * Letture (list_tables, get_logs, get_advisors, get_project_url, generate_typescript_types,
 * search_docs, select-only execute_sql…) → passano lisce. NB: execute_sql può essere sia lettura
 * sia scrittura; lo trattiamo come scrittura se NON è chiaramente un SELECT/EXPLAIN puro (prudenza:
 * meglio una conferma in più su un SELECT che una DELETE non vista).
 *
 * DECISIONE (Matteo 04-06-26): `permission: "ask"`, NON `deny`. Allineato a CLAUDE.md «su PROD
 * FERMATI e chiedi conferma» — non vietare del tutto (a volte una scrittura prod è legittima e
 * voluta), ma non lasciarla passare silenziosa. `ask` ferma e mette la palla a Matteo.
 *
 * LIMITE NOTO: come tutti gli hook Cursor, NON gira sui Cloud Agents (solo IDE locale). Sui Cloud
 * Agent resta la salvaguardia markdown (comandi-base.mdc §Sicurezza PROD). Stesso limite del nudge
 * fine-chat. Per Claude Code la stessa guardia è registrata in .claude (PreToolUse su MCP).
 *
 * INSTALLAZIONE: referenziato in .cursor/hooks.json sotto "beforeMCPExecution" e "beforeShellExecution".
 */

import process from 'node:process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/** Tool MCP che MUTANO dati o schema. Tutto il resto via MCP è lettura → passa. */
const MCP_WRITE_TOOLS = new Set([
  'apply_migration',
  'deploy_edge_function',
  'merge_branch',
  'reset_branch',
  'rebase_branch',
  'create_branch',
  'delete_branch',
])

/** Frammento che identifica il server MCP di PRODUZIONE (vs `Supabase_test`).
 *  Match preciso: «Supabase» seguito da «__» (fine nome server), così `Supabase_test__` NON matcha. */
const PROD_MCP_RE = /(^|_)Supabase__/
const TEST_MCP_RE = /Supabase_test__/

/** execute_sql è ambiguo (lettura o scrittura). È scrittura se NON è un SELECT/EXPLAIN/SHOW puro. */
function sqlIsWrite(sql) {
  if (typeof sql !== 'string') return true // niente SQL leggibile → prudenza: trattalo come scrittura
  const head = sql.trimStart().slice(0, 12).toUpperCase()
  return !(head.startsWith('SELECT') || head.startsWith('EXPLAIN') || head.startsWith('SHOW') || head.startsWith('WITH'))
}

const TEST_PROJECT_REF = 'docnnernvpyrbwuzzach'

/** Comandi shell che applicano al DB remoto linkato. */
const SHELL_PROD_RE = /supabase\s+(db\s+(push|reset)|migration\s+up)/i
const INCLUDE_ALL_RE = /--include-all(?:\s|=|$)/i

function readStdin() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (c) => (data += c))
    process.stdin.on('end', () => resolve(data))
    setTimeout(() => resolve(data), 500) // fail-open
  })
}

/** Risposta che FERMA e chiede conferma a Matteo. */
function ask(userMsg, agentMsg) {
  process.stdout.write(
    JSON.stringify({
      permission: 'ask',
      user_message: userMsg,
      agent_message: agentMsg,
    })
  )
  process.exit(0)
}

/** Risposta che lascia passare (nessun rumore). */
function allow() {
  process.stdout.write(JSON.stringify({ permission: 'allow' }))
  process.exit(0)
}

function readLinkedProjectRef() {
  try {
    return readFileSync(path.join(process.cwd(), 'supabase', '.temp', 'project-ref'), 'utf8').trim()
  } catch {
    return ''
  }
}

async function main() {
  let p
  try {
    p = JSON.parse(await readStdin())
  } catch {
    // payload illeggibile → fail-open: non bloccare il lavoro per un parse error.
    return allow()
  }

  // --- Ramo SHELL (beforeShellExecution) ---
  if (typeof p.command === 'string' && !p.tool_name) {
    if (SHELL_PROD_RE.test(p.command)) {
      if (INCLUDE_ALL_RE.test(p.command)) {
        return ask(
          '⛔ DB — `supabase db push --include-all` è vietato anche su TEST per il doppio prefisso 003.',
          'GUARD DB: include-all fermato. Usa `npm run db:apply` su TEST.'
        )
      }
      const linkedRef = readLinkedProjectRef()
      if (linkedRef === TEST_PROJECT_REF) return allow()
      return ask(
        '⛔ PROD — questo comando applica migrazioni/reset al DB remoto LINKATO (può essere produzione rwuxgvld).\n' +
          `Comando: ${p.command}\n` +
          `Ref locale: ${linkedRef || 'non leggibile'}\n` +
          'Conferma solo se vuoi davvero scrivere su questa destinazione. In dubbio, annulla e verifica `supabase/.temp/project-ref`.',
        'GUARD PROD: comando di scrittura sul DB remoto fermato. Conferma con Matteo che la destinazione è quella voluta prima di procedere.'
      )
    }
    return allow()
  }

  // --- Ramo MCP (beforeMCPExecution) ---
  const tool = typeof p.tool_name === 'string' ? p.tool_name : ''
  if (!tool) return allow()

  // TEST → sempre ok, silenzio.
  if (TEST_MCP_RE.test(tool)) return allow()

  // Non è il MCP di PROD → non ci riguarda.
  if (!PROD_MCP_RE.test(tool)) return allow()

  // Da qui: siamo sul MCP di PRODUZIONE. Scrittura?
  const bare = tool.split('__').pop() || ''

  if (bare === 'execute_sql') {
    const sql = p.tool_input && (p.tool_input.query || p.tool_input.sql)
    if (sqlIsWrite(sql)) {
      return ask(
        '⛔ PROD — stai per eseguire SQL che modifica il DB di PRODUZIONE (rwuxgvld).\n' +
          `SQL: ${typeof sql === 'string' ? sql.slice(0, 300) : '(non leggibile)'}\n` +
          'Conferma solo se è voluto su PROD. Per staging usa il MCP `Supabase_test`.',
        'GUARD PROD: SQL di scrittura su produzione fermato. Conferma con Matteo o reindirizza su Supabase_test.'
      )
    }
    return allow() // SELECT puro → lettura, ok
  }

  if (MCP_WRITE_TOOLS.has(bare)) {
    return ask(
      `⛔ PROD — \`${bare}\` modifica il DB di PRODUZIONE (rwuxgvld).\n` +
        'Conferma solo se è voluto su PROD. Per staging usa il MCP `Supabase_test`.',
      `GUARD PROD: \`${bare}\` su produzione fermato. Conferma con Matteo o reindirizza su Supabase_test.`
    )
  }

  // Lettura via MCP prod (list_tables, get_logs, get_project_url, types…) → ok.
  return allow()
}

main()
