#!/usr/bin/env node
/**
 * Hook `PreToolUse` di Claude Code — GUARD PROD (gemello dell'hook Cursor `.cursor/hooks/guard-prod.mjs`).
 *
 * SCOPO: anche il SENIOR (che gira in Claude Code) può scrivere sul DB di PRODUZIONE via MCP
 * o shell. Ferma le SCRITTURE su PROD e chiede conferma a Matteo.
 *
 * DIFFERENZE da Cursor (solo sintassi piattaforma):
 *  - stdin: Claude Code passa `{ tool_name, tool_input }` (niente ramo shell separato: i comandi
 *    `supabase db push` arrivano come tool `Bash` con `tool_input.command`).
 *  - output: `{ hookSpecificOutput: { hookEventName, permissionDecision: "ask"|"allow",
 *    permissionDecisionReason } }`. «ask» ferma e chiede; «allow» passa.
 *
 * Logica di riconoscimento PROD identica all'hook Cursor: il nome del server MCP
 * (`mcp__claude_ai_Supabase__*` = PROD; `Supabase_test__` = TEST) è la fonte di verità.
 *
 * INSTALLAZIONE: registrato in .claude/settings.local.json sotto hooks.PreToolUse.
 */

import process from 'node:process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const MCP_WRITE_TOOLS = new Set([
  'apply_migration',
  'deploy_edge_function',
  'merge_branch',
  'reset_branch',
  'rebase_branch',
  'create_branch',
  'delete_branch',
])

const PROD_MCP_RE = /(^|_)Supabase__/
const TEST_MCP_RE = /Supabase_test__/
const TEST_PROJECT_REF = 'docnnernvpyrbwuzzach'
const SHELL_PROD_RE = /supabase\s+(db\s+(push|reset)|migration\s+up)/i
const INCLUDE_ALL_RE = /--include-all(?:\s|=|$)/i

function sqlIsWrite(sql) {
  if (typeof sql !== 'string') return true
  const head = sql.trimStart().slice(0, 12).toUpperCase()
  return !(head.startsWith('SELECT') || head.startsWith('EXPLAIN') || head.startsWith('SHOW') || head.startsWith('WITH'))
}

function readStdin() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (c) => (data += c))
    process.stdin.on('end', () => resolve(data))
    setTimeout(() => resolve(data), 500)
  })
}

function decide(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: decision, // "ask" | "allow"
        permissionDecisionReason: reason,
      },
    })
  )
  process.exit(0)
}
const allow = () => decide('allow', '')
const ask = (reason) => decide('ask', reason)

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
    return allow()
  }

  const tool = typeof p.tool_name === 'string' ? p.tool_name : ''
  const input = p.tool_input || {}

  // Bash/shell: comando di scrittura sul DB remoto?
  if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = typeof input.command === 'string' ? input.command : ''
    if (SHELL_PROD_RE.test(cmd)) {
      if (INCLUDE_ALL_RE.test(cmd)) {
        return ask('GUARD DB: `supabase db push --include-all` è vietato anche su TEST per il doppio prefisso 003.')
      }
      const linkedRef = readLinkedProjectRef()
      if (linkedRef === TEST_PROJECT_REF) return allow()
      return ask(
        `GUARD PROD: «${cmd}» applica migrazioni/reset al DB remoto linkato e il ref locale è «${linkedRef || 'non leggibile'}». Conferma la destinazione prima di procedere.`
      )
    }
    return allow()
  }

  if (!tool.includes('Supabase')) return allow()
  if (TEST_MCP_RE.test(tool)) return allow()
  if (!PROD_MCP_RE.test(tool)) return allow()

  const bare = tool.split('__').pop() || ''

  if (bare === 'execute_sql') {
    const sql = input.query || input.sql
    if (sqlIsWrite(sql)) {
      return ask(
        `GUARD PROD: SQL di scrittura sul DB di PRODUZIONE (rwuxgvld). SQL: ${typeof sql === 'string' ? sql.slice(0, 200) : '(non leggibile)'}. Conferma se voluto su PROD, altrimenti usa il MCP Supabase_test.`
      )
    }
    return allow()
  }

  if (MCP_WRITE_TOOLS.has(bare)) {
    return ask(
      `GUARD PROD: «${bare}» modifica il DB di PRODUZIONE (rwuxgvld). Conferma se voluto su PROD, altrimenti usa il MCP Supabase_test.`
    )
  }

  return allow()
}

main()
