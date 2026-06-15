# Report — Controverifica FU-EMAIL-3 + Piano campagne (FU-EMAIL-7/8)

**Data:** 15-06-26
**Branch:** `env/test`
**Tipo sessione:** revisione/controverifica lavoro agente Sonnet + progettazione fase successiva
**Esecuzione del piano:** rimandata da Matteo ad un'altra chat

---

## 1. Cappello

- **Cosa è successo:** un agente Sonnet ha eseguito FU-EMAIL-3 («Personalizza email» nel CRM Pro). Io ho fatto la **controverifica indipendente** del suo lavoro e ho progettato la fase successiva (mini-gestore campagne) decidendo i punti aperti con Matteo.
- **Verdetto controverifica:** ✅ **lavoro corretto e funzionante**. `npm run validate` verde (614 test), DB/edge su TEST coerenti, PROD intatto. Un solo gap minore non bloccante (anteprima live non collegata).
- **Cosa resta:** il piano campagne (FU-EMAIL-7) è scritto e pronto; Matteo lo eseguirà in un'altra chat. Lo scheduler automatico è fase 2 (FU-EMAIL-8).

---

## 2. Controverifica del lavoro agente (FU-EMAIL-3)

### 2.1 Cosa ho ri-verificato aprendo i file (non fidandomi del report agente)

| Verifica | Metodo | Esito |
|---|---|---|
| Test verdi | `npm run validate` (rieseguito) | ✅ 75 file · **614 test** · exit 0 (i warning `act()` sono del test menuQr preesistente, non di questo lavoro) |
| Migrazione su TEST | MCP `get_project_url` + `list_tables` su `Supabase_test` | ✅ progetto = `docnnernvpyrbwuzzach` (**TEST**); tabella `email_templates` presente, **RLS attiva**, 0 righe |
| RLS corretta | lettura `050_email_templates.sql` + confronto con `006_customers_crm.sql` | ✅ usa helper esistenti `current_admin_tenant_id()` / `update_updated_at()`; ENABLE + FORCE RLS; 4 policy admin |
| Edge deployata | MCP `get_edge_function('send-email')` (sorgente deployato) | ✅ **v6** su TEST, `ALLOWED_EMAIL_TYPES` contiene davvero `"promo"` |
| Tipi DB | `git diff src/types/database.ts` | ✅ tipo `email_templates` (Row/Insert/Update + FK) presente |
| Rendering override | lettura `emailTemplates.ts` | ✅ `overrides?` su accepted/rejected, fallback a `DEFAULT_*`, `summaryBlock` automatico **intatto**; `getPromoEmail` con footer privacy |
| Lettura override all'invio | lettura `useEmailNotifications.ts` | ✅ `fetchTenantEmailBundle` carica `templateOverrides` e li passa ai builder |
| UI tab | lettura `CrmPage.tsx` + componenti crm | ✅ 2 tab; editor accetta/rifiuta/promo; picker rubrica con checkbox/seleziona-tutti; invio uno-a-uno con delay 300ms |
| PROD non toccato | nessuna chiamata di scrittura al progetto `rwuxgvld` | ✅ |

### 2.2 Gap rilevati (non bloccanti)

1. **Anteprima live non collegata.** `EmailTemplateEditor` espone una prop `preview` ma `EmailTemplatesTab` non la passa mai → l'anteprima prevista dal piano FU-EMAIL-3 non è visibile. (L'agente lo ha dichiarato onestamente in Q4 del suo report.) → assorbito dal piano campagne (Step 4).
2. **Corpo promo inserito grezzo.** `getPromoEmail` fa `nl2br(body)` senza escape HTML né link cliccabili. Accettabile per FU-EMAIL-3 (admin fidato, testo breve), ma da irrobustire ora che diventa una «piattaforma» verso molti destinatari → coperto dal piano campagne (Step 2: escape + auto-link).

### 2.3 Conclusione

Il lavoro dell'agente è **idoneo**. Nessun fix correttivo necessario prima del commit checkpoint; i due gap sono evolutivi e rientrano nella fase successiva.

---

## 3. Decisioni prese con Matteo per la fase campagne

Matteo vuole evolvere «Personalizza email» in un **mini-gestore di campagne**: fino a **5 email personalizzate** per ristorante, con **cadenza opzionale** (settimanale/mensile/custom) o uso come semplice template manuale, e **link** (sito/social) nel testo.

| Domanda | Decisione |
|---|---|
| Destinatari di una campagna con cadenza | **Gruppo salvato alla creazione** (scelto una volta dalla rubrica, fisso). Le campagne manuali restano a selezione libera all'invio. |
| Inserimento link | **Pulsanti strutturati** (etichetta + URL) in fondo all'email **+ auto-link** degli URL scritti nel testo. Niente HTML libero. |
| Motore di invio automatico | **Fase 2 separata.** Ora: gestione 5 campagne + salvataggio cadenza/gruppo + link + **invio manuale**. Lo scheduler (pg_cron + edge) è FU-EMAIL-8. |

---

## 4. Piano per la prossima chat (sintesi)

> Piano dettagliato completo: file di planning della sessione (Step 0→6). Riassunto operativo:

- **Step 0 — Commit checkpoint** FU-EMAIL-3 (fatto in chiusura di questa sessione, vedi §6).
- **Step 1 — DB TEST:** nuova migrazione `051_email_campaigns.sql` — tabella `email_campaigns` (name, subject, body, `links` jsonb, `recipient_emails` jsonb, `enabled`, `cadence_type`/`cadence_config`, `last_sent_at`/`next_run_at` riservati fase 2). **Limite DURO 5/tenant** via trigger `BEFORE INSERT`. RLS come `050`. Poi `npm run db:types:linked`.
- **Step 2 — Rendering:** `getCampaignEmail` con **escape HTML + auto-link** URL + render **pulsanti link** (whitelist `http/https`).
- **Step 3 — Hook:** `useEmailCampaigns`, `useEmailCampaignMutations` (guard 5), `useSendCampaignEmail` (generalizza `useSendPromoEmail`).
- **Step 4 — UI:** gestore campagne (lista max 5, editor con link/cadenza/gruppo destinatari salvato), **invio manuale** + **anteprima live** (chiude il gap §2.2.1). Accetta/rifiuta invariati.
- **Step 5 — Test + `npm run validate` verde.**
- **Step 6 — Docs** + apertura FU-EMAIL-8.

**Avviso UI obbligatorio (fase 1):** la cadenza è **solo salvata, non invia ancora**; mostrarlo chiaramente per non illudere l'admin.

---

## 5. Rischi / note

- **Legale marketing fuori scope** (come da masterplan): solo footer privacy; nessun opt-out automatico.
- **Gruppo salvato non si aggiorna** coi nuovi clienti (scelta di Matteo) → documentarlo nell'UI.
- **Sicurezza:** body verso molti destinatari → escape + whitelist URL obbligatori (Step 2).
- **PROD intatto:** migrazioni/edge solo su TEST; promozione PROD = step separato (blindatura).

---

## 6. Stato git in chiusura

- Commit checkpoint FU-EMAIL-3 su `env/test` (lavoro agente controverificato + questa documentazione).
- Push su `origin/env/test` (trigger «report finale») per rendere il lavoro disponibile alla chat di esecuzione.
- **PROD non toccato.**

---

## 7. Domande di chiusura

❓ Q1 — Prompt ricevuti (verbatim). Riporta i prompt sostanziali di Matteo in questa chat.
✅ R1: (1) [piano FU-EMAIL-3 → ho prodotto il plan, non eseguito] · (2) «ho lanciato agente sonnet per eseguire il plan. ha finito. in linea generale va bene, unica cosa che dobbiamo definire che nella nuova sezione personalizza email, admin organizza modifica i tipi di email… può impostare una requenza… ogni admin potrà avere fino a 5 email personalizzate… una sorta di piattaforma mini per gestire semplici campagne email con possibilità di inserire link… fai revisione controverifica completa del lavoro di agente, se tutto ok fai commit intermedio e poi dammi plan per eseguire i fix» · (3) «aggiorna la documentazione compila il tuo report finale con lavoro controverificato di agente e tuo report. eseguirò il plan in altra chat.»

❓ Q2 — Dati = diff reale? I valori/file citati corrispondono al diff vero? Cosa hai ri-verificato aprendo i file?
✅ R2: Sì. `npm run validate` rieseguito da me (exit 0, 614 test). `git status` = 19 file FU-EMAIL-3 (committati) + 1 e2e fuori scope (escluso). MCP TEST: `get_project_url`=`docnnernvpyrbwuzzach`, `list_tables` mostra `email_templates` RLS on 0 righe, `get_edge_function('send-email')` v6 con `promo` nel sorgente. `database.ts` diff contiene il tipo `email_templates`.

❓ Q3 — File correlati allineati? Quali doc collegati e sono aggiornati?
✅ R3: `ADMIN_CRM_CONTEXT.md` (agente: struttura 2-tab; io: §9 Pianificato FU-EMAIL-7). `FOLLOW_UP.md` (FU-EMAIL-3 + nota controverifica; nuovi FU-EMAIL-7/8). `SESSION_LOG.md` (riga controverifica). Tutti committati.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non ho eseguito il piano campagne (esplicita richiesta di Matteo: lo farà in altra chat). Non ho committato la modifica e2e `public-booking.spec.ts` (fuori scope FU-EMAIL-3, non documentata dall'agente, non verificabile senza staging → lasciata in working tree, segnalata a Matteo). Non ho fatto QA browser manuale del tab (richiede login admin Pro + `VITE_ENABLE_SEND_EMAIL`).

❓ Q5 — Attrito + miglioria workflow.
✅ R5: Attrito minimo. I due MCP Supabase (`Supabase` = PROD `rwuxgvld`, `Supabase_test` = TEST `docnnernvp`) restano ambigui per nome — confermato che `Supabase_test` è TEST via `get_project_url`. Miglioria già nota (FU-EMAIL-3 R5): documentare la mappatura MCP→ambiente in `APP_CONTEXT_SKILL.md §1b`.

❓ Q6 — Contesto & hook: troppo / giusto / poco?
✅ R6: Giusto. Caricato routing §0 + skill CRM + i file effettivamente toccati; nessun carico a tappeto. La controverifica ha richiesto solo letture mirate + 3 chiamate MCP read-only.

---

## 8. Self-review del report

1. **Dati = diff reale** — verificato con `git status`/`git diff` e MCP; numeri (614 test, edge v6, 19 file) confermati.
2. **File correlati allineati** — 3 doc aggiornati e committati.
3. **Onestà §2.2 / Q4** — gap anteprima e change e2e fuori scope dichiarati esplicitamente, non nascosti.
4. **Tono utente** — §1 e §4 descrivono effetti (campagne, invio, anteprima) prima dei nomi-file.
