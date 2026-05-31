#!/usr/bin/env node
/**
 * Hook `stop` di Cursor — Nudge fine-sessione per lo skill system comunicazione.
 *
 * SCOPO: gli agenti esecutori (Cursor) si dimenticano, a fine chat, di:
 *   1. scrivere la sezione «Dati comunicazione» nel report;
 *   2. segnare gli esiti delle voci Liv.2 del VOCABOLARIO usate in chat.
 * Questo hook NON è un blocco: inietta un promemoria che l'agente legge prima di chiudere.
 * Risolve il problema diagnosticato 01-06-26 (motore Liv.2 fermo a zero, vedi EVOLUZIONE_SKILLS.md M4).
 *
 * COMPORTAMENTO: scatta sull'evento `stop`. Restituisce un `agent_message` con la checklist.
 * Per non essere rumoroso ad ogni micro-chat, è l'AGENTE a decidere se la checklist si applica
 * (es. chat senza report/skill → la ignora). L'hook non ha modo affidabile di sapere cosa è stato
 * toccato in sessione, quindi delega il giudizio finale all'agente — resta comunque un promemoria utile.
 *
 * INSTALLAZIONE: referenziato in .cursor/hooks.json sotto l'evento "stop".
 * Vale solo per agenti IDE locali (gli hook `stop` NON girano sui Cloud Agents — limite Cursor).
 */

function readStdin() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => resolve(data))
    // Se non arriva stdin entro breve, procedi comunque (fail-open).
    setTimeout(() => resolve(data), 500)
  })
}

async function main() {
  // Leggiamo l'input ma non ci serve bloccare su di esso: il nudge è statico.
  await readStdin().catch(() => '')

  const reminder = [
    '⚠️ PROMEMORIA FINE-SESSIONE (skill system comunicazione) — verifica prima di chiudere:',
    '',
    '1. Hai prodotto un REPORT di sessione (standard/deep)? Allora la sezione «Dati comunicazione»',
    '   è OBBLIGATORIA (frasi ricorrenti di Matteo + cosa ha funzionato + prompt annotati).',
    '2. Hai usato VOCI Liv.2 del VOCABOLARIO in questa chat? Segna l\'esito nel campo «Dati Liv.2»',
    '   della voce: ok / domanda-superflua / corretto-da-Matteo. È il motore di apprendimento del sistema.',
    '3. Report in docs/Sessioni di lavoro/GG-MM-AA/ + riga in docs/SESSION_LOG.md.',
    '',
    'Se questa chat NON aveva report né voci Liv.2 (es. domanda veloce, lavoro light) → ignora e chiudi.',
  ].join('\n')

  // `agent_message` viene mostrato all'agente; permission "allow" = non blocca la chiusura.
  process.stdout.write(
    JSON.stringify({
      permission: 'allow',
      agent_message: reminder,
    })
  )
  process.exit(0)
}

main()
