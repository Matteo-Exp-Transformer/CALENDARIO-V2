# Report chiusura ciclo Fable / allineamento / sicurezza — 12-06-26

**Cosa è cambiato:** l'app è più sicura sulla prenotazione pubblica e sugli inviti admin; M6 ha chiuso una parte concreta dei debiti prod-ready su auth residui, conferme delete, guard modali e cast TypeScript critici.
**Cosa resta:** email, audit fallback/hardcoded, residui `as any` fuori dai punti critici, M4 Impostazioni, M5 Pro, guard dirty più ampia, P.IVA/contratto/fattura e documenti GDPR entro primo mese.
**Serve una tua azione:** no per il gate DB: dopo il fix CLI, TEST è stato verificato in sola lettura via Supabase CLI e risulta allineato per nome logico fino a `048`.

---

## 1. Obiettivo

Chiudere il ciclo nato dalle analisi Fable del 12-06-26: verificare il diff reale, allineare `MASTERPLAN_ALLINEAMENTO.md` e `FOLLOW_UP.md`, documentare i fix sicurezza finali già deployati su PROD, rieseguire le validazioni locali, trattare M6 cross-area dove possibile e lasciare aperti solo i debiti veri.

## 2. Cosa è stato fatto

- Pagina Prenota pubblica: un ristorante disattivato non può più ricevere prenotazioni via chiamata diretta, perché `create-booking` risolve solo tenant `is_active=true`.
- Pagina Prenota pubblica: anche richieste respinte o payload non validi contano nel rate limit, quindi il blocco anti-spam non dipende più dall'inserimento riuscito.
- Inviti admin: un token non può più essere riusato in due registrazioni parallele, perché viene consumato prima di creare l'utente.
- Documentazione operativa: WP-B4 passa da aperto a chiuso; FU-ALL-DOCPATH passa da aperto a fatto; il finding basso `validate-invite` è registrato come chiuso.
- Vendita: i documenti GDPR operativi restano aperti, ma non sono più descritti come blocco prima del primo incasso; i blocchi veri restano P.IVA, contratto B2B e fattura elettronica.
- M6 / auth residui: se una sessione admin viene ripristinata ma la riga `admin_users` non esiste più, l'admin viene scollegato e il tenant locale viene pulito sulle rotte protette.
- M6 / TypeScript: rimossi `as any` dai punti critici di `AdminAuthContext`, `TenantContext`, `BookingRequestForm`, hook prenotazioni admin e hook prenotazioni pubbliche/admin.
- M6 / conferme delete e modali: eliminate le conferme native `window.confirm` da Promo Prenota, Menu/Magazzino e toggle Card/Carosello; ora passano da modali applicative.
- M6 / test di guardia: aggiunto test statico che impedisce il ritorno di `window.confirm` e `as any` nei file critici selezionati.

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `.github/workflows/ci.yml` | Aggiunto `validate:docs` in CI. |
| `package.json` | Aggiunto script `npm run validate:docs`. |
| `scripts/check-doc-paths.mjs` | Nuovo controllo path locali nei docs vivi. |
| `scripts/doc-path-check-allowlist.json` | Eccezioni documentate per path futuri/storici accettati. |
| `supabase/functions/create-booking/index.ts` | Rate limit anticipato e filtro tenant attivi. |
| `supabase/functions/validate-invite/index.ts` | Consumo atomico del token invito prima della creazione utente. |
| `supabase/migrations/046_codify_policy_drift.sql` | Commento aggiornato: WP-B1 applicato su TEST e PROD. |
| `src/features/booking/components/__tests__/adminBookingForm.dailyLimit.adminBlindatura.test.tsx` | Reso il test indipendente dall'orologio reale usando una data futura. |
| `src/contexts/AdminAuthContext.tsx` | Tipi DB espliciti e sign-out se l'admin ripristinato non esiste più in `admin_users`. |
| `src/contexts/TenantContext.tsx` | Normalizzazione typed della edition tenant e rimozione cast deboli su query pubbliche/RPC. |
| `src/features/booking/components/BookingRequestForm.tsx` | Lock submit typed con ref dedicata, senza proprietà dinamiche su `as any`. |
| `src/features/booking/components/MenuPricesTab.tsx` | Conferme delete ingrediente/preset migrate a `Modal`; nessun `window.confirm`. |
| `src/features/booking/components/settings/BookingFormConfigPanel.tsx` | Conferma reset Card/Carosello tramite `Modal` applicativa. |
| `src/features/booking/components/settings/BookingFormPromoSection.tsx` | Conferma eliminazione promo tramite `Modal` applicativa. |
| `src/features/booking/components/__tests__/m6ProdReadyPatterns.test.ts` | Test statico anti-regressione su `window.confirm` e `as any` nei punti M6 critici. |
| `src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` | Test su sessione admin ripristinata ma rimossa dal DB. |
| `src/features/booking/hooks/useAdminBookingRequests.ts` | Payload insert typed e JSON fields espliciti. |
| `src/features/booking/hooks/useBookingMutations.ts` | Payload update typed e cache callback senza `any`. |
| `src/features/booking/hooks/useBookingQueries.ts` | Query/stats typed e guard su tenant mancante. |
| `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | Rimandi relativi corretti per il nuovo check docs. |
| `docs/Admin-Skill/contesto/ADMIN_CONFLICTS_AND_DEBTS.md` | Stato M6 aggiornato: chiuso parziale e residui reali. |
| `docs/Legal-Production-Skill/DATA_INVENTORY_CONTEXT.md` | Retention runtime `rate_limits`/`ip_blacklist` aggiornata: 048 verificata anche su TEST. |
| `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` | Priorità vendita aggiornate: GDPR operativo entro primo mese, non blocco primo incasso. |
| `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md` | Listino aggiornato post revisione senior: Pro 69 euro, fondatori 6 mesi. |
| `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md` | Stato Promo e Card/Carosello aggiornato alle modali applicative. |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-B4 marcato chiuso e collegato a questo report. |
| `docs/MASTERPLAN_BLINDATURA.md` | M6 registrato come chiusura parziale con residui espliciti. |
| `docs/FOLLOW_UP.md` | FU-ALL-DOCPATH chiuso; FU-AUTH-INVITE registrato chiuso; FU-LEGAL-2 riallineato; FU-AUTH-1 chiuso; FU-TYPES-1 aggiornato. |
| Questo report | Chiusura ciclo e stato finale. |

## 4. Verifiche Supabase PROD

Verifica eseguita in sola lettura su `https://rwuxgvldzrkabglkasym.supabase.co`.

| Funzione | Stato PROD |
|----------|------------|
| `create-booking` | `ACTIVE`, versione 14, `verify_jwt=false`; contenuto deployato include rate limit prima del parse body e `.eq("is_active", true)` sulla risoluzione tenant. |
| `validate-invite` | `ACTIVE`, versione 8, `verify_jwt=true`; contenuto deployato include update condizionato `.is("used_at", null)` prima della creazione utente. |

Non sono stati creati dati di test in PROD. Non sono state fatte scritture su PROD in questa sessione.

### Migrazioni PROD/TEST

- PROD `rwuxgvldzrkabglkasym`: lista migrazioni letta via connettore Supabase; ultima migrazione visibile `048_schedule_rate_limits_cleanup`.
- TEST `docnnernvpyrbwuzzach`: il connettore MCP continua a non avere permesso, ma la fallback CLI richiesta da `AGENTS.md` ora supera la checklist: branch `env/test`, `supabase/.temp/project-ref = docnnernvpyrbwuzzach`, `projects list` vede TEST con host `db.docnnernvpyrbwuzzach.supabase.co`, org `ytrppzjekipjubnygaos`, status `ACTIVE_HEALTHY`, e `migration list --linked` si collega al remoto.
- TEST registro migrazioni: per nome logico risultano presenti `046_codify_policy_drift` (`20260612104237`), `047_restrict_anon_restaurant_settings` (`20260612111433`) e `048_schedule_rate_limits_cleanup` (`048`). Il disallineamento versioni numeric/timestamp è storico e documentato in `DB_MIGRATIONS_CONTEXT.md`; non richiede `db push`.
- TEST runtime 048: verificati `pg_cron` in `pg_catalog`, funzione `public.cleanup_rate_limits()` `SECURITY DEFINER` con EXECUTE solo a `postgres`/`service_role`, job `cleanup-rate-limits-hourly` attivo (`17 * * * *`, comando `SELECT public.cleanup_rate_limits();`).
- Esito DB: nessuna scrittura, nessuna migrazione applicata, nessun `supabase db push`. TEST e PROD risultano allineati per nome logico fino a `048`.

## 5. Test eseguiti e risultato

- `git status --short --branch` — branch `env/test`; diff locale presente, nessun commit.
- `git diff --check` — verde.
- `npm run validate:docs` — verde: 91 file `.md` scansionati, 669 path locali controllati, 0 path rotti, 21 voci allowlist.
- `npm run test -- src/features/booking/components/__tests__/adminBookingForm.dailyLimit.adminBlindatura.test.tsx` — verde dopo fix data-sensibile: 1 test passato.
- `npm run test -- src/features/booking/components/__tests__/m6ProdReadyPatterns.test.ts` — verde: 2 test passati.
- `npm run test -- src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` — verde: 8 test passati.
- `npm run typecheck` — verde dopo riduzione cast M6.
- `npm run lint` — verde.
- `npm run validate` — verde: lint OK, typecheck OK, 69 file test, 563 test passati. Restano warning React `act(...)` già presenti in suite, non bloccanti.

## 6. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | Rimandi relativi corretti. | Il check docs doveva poter verificare link vivi senza falsi rotti. |
| `docs/Admin-Skill/contesto/ADMIN_CONFLICTS_AND_DEBTS.md` | Stato M6 aggiornato. | Admin resta la skill principale per debiti cross-area/backoffice. |
| `docs/Legal-Production-Skill/DATA_INVENTORY_CONTEXT.md` | Nota TEST bloccato rimossa. | La retention runtime ora è verificata su TEST e PROD. |
| `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` | Priorità vendita/GDPR riallineate. | La vendita non deve essere bloccata da adempimenti operativi non pre-incasso. |
| `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md` | Prezzi Pro/offerta fondatori aggiornati. | Listino operativo post decisione Matteo/revisione senior. |
| `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md` | Stato modali Promo/Card-Carosello aggiornato. | Le conferme pubbliche della configurazione Prenota sono parte del debito M6. |

## 7. Dati comunicazione

### Frasi/richieste ricorrenti

| Frase / tema | Conteggio | Esito |
|--------------|-----------|-------|
| «verifica» / «controlla» stato reale | 1 | Applicato profilo Verifica: git status, diff, diff check, lettura diff e verifica PROD read-only. |
| «senza tralasciare report, masterplan, follow-up» | 1 | Aggiornati masterplan, follow-up e creato report dedicato. |
| «non fare commit/push» | 1 | Rispettato: nessun commit/push. |
| «M6 cross-area: pulizia finale prod-ready» | 1 | Implementati fix mirati su auth, tipi, delete/modal e test anti-regressione. |
| «commit push e merge con main e PrenotaZen in PROD se tutto ok» | 1 | Dopo fix CLI Matteo, TEST è verificato; si procede solo se validazioni finali restano verdi. |
| «in modo sintetico» implicito nella chiusura | 1 | La risposta finale sara breve, con chiuso/resta/azione Matteo. |

### Cronologia / prompt di Matteo annotati

| # | Prompt sostanziale | Intento | Esito agente |
|---|--------------------|---------|--------------|
| 1 | «Sei un agente senior su CalendarBackup-v2... Obiettivo: orchestrare la chiusura completa del ciclo “analisi Fable / masterplan allineamento / fix sicurezza finali”...» | Chiusura deep multi-area senza commit. | Eseguita verifica repo, lettura skill, lettura diff, verifica PROD read-only, aggiornamento docs/report. |
| 2 | «TASK DA SVOLGERE : M6 cross-area: pulizia finale prod-ready: tanti as any, pattern conferme delete, guard modali, salvataggi uniformi, auth residui, fallback/hardcoded. Tipi TypeScript: ridurre i cast as any nei punti critici [...] POI COMMIT PUSH E MERGE CON MAIN E PRENOTAZEN IN PROD SE TUTTO OK.» | Chiusura M6 + gate finale commit/merge/prod. | Implementati fix M6 e validazioni; TEST inizialmente bloccato, poi verificato via CLI dopo fix Matteo. |
| 3 | «ho fixato cli. ora punta DB test. allinea anche lui e assicurati che work tree siano puliti e allineati.» | Riprendere gate DB TEST e chiudere allineamento repo. | Verifica CLI TEST completata, documenti riallineati, commit/merge da eseguire dopo validate finale. |

### Cosa non è successo in chat

| Assenza | Motivo |
|---------|--------|
| Nessuna domanda a Matteo | Il prompt conteneva scope, vincoli e priorità sufficienti. |
| Nessuna scrittura PROD | Vietata senza nuova conferma; serviva solo lettura Edge. |
| Nessun commit/push/merge al momento della prima chiusura | Il gate richiesto includeva verifica DB TEST/PROD; TEST era bloccato prima del fix CLI. Dopo il fix CLI, il gate DB è stato riaperto e verificato. |
| Nessuna implementazione email/M4/M5 | Esplicitamente fuori scope; restano follow-up veri. |
| Nessuna chiusura totale M6 | M6 è ampio: questa sessione chiude auth residuo, conferme native e cast critici, ma lascia audit fallback/hardcoded e residui fuori dai file critici. |
| Nessuna prova browser manuale | Il ciclo chiude fix Edge/docs; il gate richiesto qui è validate locale + verifica read-only deploy. |

## 8. Analisi flusso prompt, efficienza e statistiche

| Statistica | Valore |
|------------|--------|
| Prompt sostanziali Matteo | 1 |
| Domande agente | 0 |
| Correzioni Matteo dopo prima risposta | 0 |
| Retry tecnici | 0 |
| Validate richiesti | 2 (`validate:docs`, `validate`) + test mirati M6/auth |
| Commit | No |

Il prompt era completo: conteneva file, branch, vincoli PROD, debiti da non chiudere e anti-scope. La parte più utile da replicare è l'elenco «Cosa devi fare, in ordine», che ha ridotto il rischio di chiudere debiti sbagliati. Il punto critico era il gate DB: dopo il fix CLI, TEST è verificabile via canale Codex dedicato e il ciclo può proseguire.

## 9. Lettura qualità agente

Il sistema di skill ha dato contesto abbondante ma utile: APP_CONTEXT ha instradato masterplan/follow-up, Testing ha imposto la validazione, Supabase skill ha ricordato il confine PROD/TEST. Attrito principale: molte istruzioni sono distribuite tra report storici, masterplan e follow-up; il nuovo `validate:docs` aiuta sui path ma non ancora sulla coerenza semantica degli stati.

Suggerimento come dato per revisore Meta: quando un WP passa da design a implementazione, il report implementativo dovrebbe aggiornare automaticamente anche il FU collegato, altrimenti rimane aperto come `FU-ALL-DOCPATH`.

## 10. Derivazione errori

| Punto | Classificazione | Lettura |
|-------|-----------------|---------|
| WP-B4 ancora aperto nel masterplan dopo deploy | Debito documentale post-fix | Il codice e PROD erano avanti rispetto al masterplan; chiuso aggiornando stato e report. |
| FU-ALL-DOCPATH ancora aperto dopo script verde | Debito documentale post-implementazione | Il design WP-E2 era chiuso ma il follow-up implementativo non era stato marcato. |
| FU-LEGAL-2 ancora «bloccante» | Disallineamento tra context legale e registro FU | `LEGAL_STATE_CONTEXT.md` era gia stato aggiornato; il registro follow-up no. |
| Test capienza admin legato alla data 12-06-2026 | Test data-sensibile | Oggi 12-06-2026, alle 20:00 il test attivava prima l'avviso orario passato. Risolto spostando lo scenario su una data futura stabile. |
| Sessione admin ripristinata ma admin DB rimosso | Auth residuo | Prima il contesto poteva restare in stato ambiguo; ora fa sign-out e pulizia tenant su rotta protetta. |
| Conferme native delete/config | Debito UX prod-ready | Sostituite con modali coerenti con UI app in Menu/Magazzino, Promo e Card/Carosello. |
| `as any` in punti critici | Type safety indebolita | Rimossi dai contesti auth/tenant, form prenotazione e hook prenotazioni principali; rimangono residui fuori da questo perimetro. |
| Verifica migrazioni TEST inizialmente impossibile | Blocco operativo esterno risolto | MCP non vede TEST, ma dopo fix CLI `projects list` e `migration list --linked` leggono TEST; verifica completata in sola lettura. |

## 11. Cosa resta per la prossima sessione

- **FU-EMAIL-1 / FU-EMAIL-2:** email transazionali e UI log email.
- **FU-TYPES-1:** proseguire riduzione `as any` fuori dai punti critici già trattati, soprattutto storage, menu QR, categorie/settings e sync servizi.
- **M4:** Impostazioni / Personalizza Form, salvataggio fase 2 e conferme dati pubblici.
- **M5:** aree Pro (Servizio, CRM, Home, Analytics) con test dedicati.
- **M6:** audit fallback/hardcoded, salvataggi uniformi oltre i punti toccati, guard dirty più ampia e residui `as any` non critici.
- **Vendita:** P.IVA, contratto B2B, fatturazione elettronica; documenti GDPR entro primo mese.

## 12. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt 1: «Sei un agente senior su CalendarBackup-v2, repo c:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2, branch atteso env/test. Obiettivo: orchestrare la chiusura completa del ciclo “analisi Fable / masterplan allineamento / fix sicurezza finali”, senza tralasciare report, masterplan, follow-up, verifica locale e stato PROD/TEST. [...] Non fare commit/push finché Matteo non conferma esplicitamente “fai report finale” o equivalente.»

Prompt 2: «Sei agente senior su CalendarBackup-v2, repo `c:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2`, branch atteso `env/test`. Obiettivo: chiudere il ciclo finale codice + report + commit/push + merge production, includendo main, PrenotaZen e verifica DB TEST/PROD. [...] TASK DA SVOLGERE : M6 cross-area: pulizia finale prod-ready: tanti as any, pattern conferme delete, guard modali, salvataggi uniformi, auth residui, fallback/hardcoded. Tipi TypeScript: ridurre i cast as any nei punti critici perché oggi il typecheck è meno forte di quanto sembra. POI COMMIT PUSH E MERGE CON MAIN E PRENOTAZEN IN PROD SE TUTTO OK.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti `git status`, `git diff --stat`, `git diff --check`, i diff di `create-booking`, `validate-invite`, `046`, script docs, CI, pricing/legal/menu context, i contesti auth/tenant, i form/config Prenota, gli hook prenotazioni e i test `adminBookingForm.dailyLimit.adminBlindatura`, `useAdminAuth`, `m6ProdReadyPatterns`; verificato in sola lettura Supabase PROD che `create-booking` e `validate-invite` siano rispettivamente v14/v8 e contengano i fix. Dopo fix CLI, verificato TEST via `projects list`, `migration list --linked` e query read-only su `schema_migrations`, `pg_extension`, `pg_proc`, `cron.job`, `pg_policies`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati `MASTERPLAN_ALLINEAMENTO.md`, `MASTERPLAN_BLINDATURA.md`, `FOLLOW_UP.md`, `LEGAL_STATE_CONTEXT.md`, `EDITION_PRICING_CONTEXT.md`, `ADMIN_MENU_MAGAZZINO_CONTEXT.md`, `ADMIN_CONFLICTS_AND_DEBTS.md`, `PRENOTA_FORM_CONFIG_CONTEXT.md`; DB schema context era gia coerente con rate limit/blacklist e non richiedeva patch in questa chiusura. Nessun tipo TS da rigenerare: nessuna nuova migrazione/schema in questa sessione.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho implementato email, M4, M5 o debiti fuori scope; non ho chiuso integralmente M6 perché fallback/hardcoded e residui `as any` fuori dai file critici restano audit aperti; non ho scritto su PROD; non ho creato prenotazioni o utenti di test in PROD; non ho applicato migrazioni DB. Il gate finale è ripreso dopo il fix CLI e resta subordinato a validate/commit/merge finali.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: stato reale distribuito tra masterplan, follow-up e report successivi, più gate Supabase TEST dipendente dal canale CLI/MCP disponibile; miglioria: aggiungere una checklist di chiusura WP che obblighi a cercare l'ID WP/FU nel registro e una checklist DB che dica subito quale canale usare per TEST.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto per una chiusura deep: molto materiale, ma necessario per evitare false chiusure su PROD/legal/follow-up. Nessun hook Cursor ricevuto durante la scrittura; ho applicato preventivamente il formato Q1-Q6.

## 13. Self-review del report

- Dati confrontati con diff reale e con Supabase PROD in sola lettura.
- Debiti veri lasciati aperti: email, residui tipi/fallback, M4/M5/M6 residuo, legale/vendita.
- Commit/push/merge/PrenotaZen production da documentare nella risposta finale in base all'esito dei gate conclusivi.
- Test finali riportati nella sezione 5 e coerenti con l'ultima run verde.
- Blocco TEST iniziale documentato e poi aggiornato dopo verifica CLI riuscita.
