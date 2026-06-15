# Report — FU-EMAIL-1 test e fix Brevo (Ciclo 2 / Prompt 2)

**Data:** 15-06-26  
**Profilo:** Verifica  
**Branch:** env/test (working tree)  
**Stato:** **FU-EMAIL-1 = Fatto** su TEST `docnnernvpyrbwuzzach`

---

## Cappello

- **Cosa è cambiato:** quando lo staff accetta, rifiuta o elimina una prenotazione su TEST, il cliente riceve l’email Brevo e la riga compare in `email_logs`.
- **Cosa resta:** FU-EMAIL-2 (pannello admin per vedere i log email) — fuori scope senza Sì/No esplicito.
- **Serve una tua azione:** controlla la casella `classic@c.com` (6 email attese: 3 dallo script + 3 dallo smoke admin). Nessun altro passo bloccante.

---

## Cosa è stato fatto

1. **Diagnosi blocco** — `BREVO_API_KEY` su Supabase TEST rispondeva `"Key not found"`. La prima chiave fornita era `xsmtpsib-...` (chiave **SMTP**), non valida per l’API REST usata dalla edge function `send-email`.
2. **Fix secrets** — impostata chiave API corretta `xkeysib-...` con `supabase secrets set BREVO_API_KEY=... --project-ref docnnernvpyrbwuzzach`. Redeploy edge `send-email` (precauzione).
3. **Smoke script** — `node scripts/_test-email-once.mjs` → HTTP 200, `success: true`, 3 template (accepted / rejected / cancelled), messageId Brevo presenti.
4. **Smoke admin** — login `classic@c.com` su `localhost:5173`, tab Prenotazioni + Calendario: accept «Smoke Accept», reject «Smoke Reject», accept + elimina «Smoke Cancel». Email inviate a `classic@c.com` via flusso app (`useBookingMutations` → `sendAndLogEmail`).
5. **Verifica DB** — 4 righe in `email_logs` (tenant `46d6d683-...`), tutte `status: sent`.
6. **Post-test** — `VITE_ENABLE_SEND_EMAIL=false` in `.env.local`. Aggiornati `docs/FOLLOW_UP.md` e `docs/Plan-Completamento.md`.

---

## File toccati e perché

| File | Motivo |
|------|--------|
| `.env.local` | `VITE_ENABLE_SEND_EMAIL=false` dopo test (gitignored) |
| `docs/FOLLOW_UP.md` | FU-EMAIL-1 → Fatto |
| `docs/Plan-Completamento.md` | Ciclo 2 → completato |
| Questo report | Chiusura sessione Verifica |

**Codice app / edge:** nessuna modifica — il bug era solo configurazione Brevo.

**Supabase TEST (remoto):** secret `BREVO_API_KEY` aggiornato; redeploy `send-email` v1.

---

## Test eseguiti e risultato

| Test | Esito |
|------|-------|
| `get_project_url` MCP TEST | ✅ `docnnernvpyrbwuzzach.supabase.co` |
| `node scripts/_test-email-once.mjs` (prima, chiave errata) | ❌ 502 `"Key not found"` |
| Curl diretto Brevo con `xsmtpsib-` | ❌ 401 `"Key not found"` (conferma tipo chiave) |
| `supabase secrets set` + script (dopo `xkeysib-`) | ✅ 3/3 OK |
| Smoke admin accept / reject / cancel | ✅ UI + DB |
| Query `email_logs` su TEST | ✅ 4 righe `sent` |
| `npm run validate` | ⏭️ non rieseguito — zero diff codice app |

### Righe `email_logs` verificate (TEST)

| email_type | recipient | status | booking |
|------------|-----------|--------|---------|
| booking_accepted | classic@c.com | sent | Smoke Accept |
| booking_rejected | classic@c.com | sent | Smoke Reject |
| booking_accepted | classic@c.com | sent | Smoke Cancel (pre-eliminazione) |
| booking_cancelled | classic@c.com | sent | Smoke Cancel |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| nessuno | — | Nessun comportamento/layout descritto in skill area è cambiato; solo secrets remoti e verifica |

---

## Dati comunicazione

- Matteo ha risposto al form Fase 0 con accesso Brevo e mittente verificato.
- Prima chiave incollata per errore: SMTP (`xsmtpsib-`) — corretta subito con `xkeysib-` da sezione API Keys.
- Formato AskQuestion utile per distinguere SMTP vs API senza wall of text.

---

## Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali Matteo:** 1 (prompt preparato Ciclo 2 / FU-EMAIL-1) + risposte form Brevo (2 turni).
- **Correzioni dopo 1ª risposta:** 1 (tipo chiave SMTP → API).
- **Modalità:** standard (Verifica) — non alzata.
- **Efficace:** prompt con fasi 0–1 e output attesi numerati; blocco noto documentato nel report 13-06.

---

## La mia lettura della sessione

- **Impressioni:** il 90% del lavoro era già fatto al Ciclo 2; questa sessione è stata soprattutto diagnosi secrets + smoke. Il report 13-06 con causa `"Key not found"` e script pronto ha accelerato molto.
- **Difficoltà:** confusione `xsmtpsib` vs `xkeysib` — comune su Brevo; test curl diretto ha dato evidenza immediata senza toccare codice.
- **Miglioria suggerita:** in `FOLLOW_UP.md` / report email, esplicitare «NON usare SMTP key» accanto a `xkeysib-` per evitare il secondo giro.

---

## Derivazione errori

| Problema | Causa |
|----------|--------|
| `"Key not found"` iniziale | **Config esterna** — chiave SMTP o API revocata/errata, non bug repo |
| Smoke bookings non visibili su tenant sbagliato | **Ambiente test** — browser già loggato come `tomas@t.com` (altro tenant); risolto con login `classic@c.com` |

---

## §11 — Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1: «Prompt 2 — Testare e fixare invio email (Ciclo 2 / FU-EMAIL-1)» (profilo Verifica, skill elencate, Fase 0 prerequisito Brevo, Fase 1 secrets + `node scripts/_test-email-once.mjs`, output attesi 1–6, vincoli TEST only, no FU-EMAIL-2 senza Sì/No). Risposte form: accesso Brevo sì; prima chiave `xsmtpsib-...`; mittente verificato; poi nuova API key `xkeysib-...`.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero?  
✅ R2: Verificato. Nessun file sorgente modificato. Diff locale: `docs/FOLLOW_UP.md`, `docs/Plan-Completamento.md`, questo report, `.env.local` (gitignored). Secret remoto aggiornato via CLI. `email_logs` letti via MCP `execute_sql` post-smoke.

❓ Q3 — File correlati allineati?  
✅ R3: Nessuna skill area da allineare (comportamento già documentato al Ciclo 2). `EDGE_FUNCTIONS.md` in Archivio resta non aggiornato — gap preesistente, bassa priorità.

❓ Q4 — Cosa NON hai fatto?  
✅ R4: (1) FU-EMAIL-2 UI log — fuori scope esplicito. (2) `npm run validate` — saltato, nessun diff codice. (3) Verifica casella Gmail `matteo.cavallaro.work@gmail.com` — smoke usato `classic@c.com` come destinatario test. (4) Commit/push — non richiesti.

❓ Q5 — Attrito + miglioria workflow skill system?  
✅ R5: Il prompt preparato con Fase 0 ha evitato di procedere senza chiave. Miglioria: voce in FOLLOW_UP su differenza SMTP/API Brevo.

❓ Q6 — Contesto & hook?  
✅ R6: Mini-pack Admin + Testing + APP_CONTEXT §1b sufficienti. Nessun hook pre-commit in questa sessione (no commit).
