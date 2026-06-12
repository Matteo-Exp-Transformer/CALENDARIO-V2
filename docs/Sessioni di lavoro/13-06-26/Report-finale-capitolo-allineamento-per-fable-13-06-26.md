# Report finale — Capitolo "Allineamento skill↔codice + sicurezza" (per revisione Fable)

> **A chi serve.** Questo è il report di chiusura che un revisore (modello Fable) usa per **ri-verificare**
> il codice. Non ricopia i finding originali: li chiude, dichiara lo stato verificato e indica dove guardare.
> Fonte del capitolo: le 3 analisi Fable del 12-06-26 + `docs/MASTERPLAN_ALLINEAMENTO.md`.

**Cosa è cambiato:** il capitolo di allineamento è chiuso ed è stato rilasciato in produzione (PrenotaZen). I due rischi ALTI di Fable sono chiusi e verificati; anche il finding BASSO `validate-invite` (TOCTOU) è chiuso.
**Cosa resta:** solo i due fronti già esclusi da Matteo — **email** (`send-email` non deployata) e **adempimenti legali di produzione** (P.IVA, contratto B2B, fattura elettronica).
**Serve una tua azione (Fable):** ri-verificare i punti elencati in §6 («Dove guardare») e segnalare eventuali regressioni.

---

## 1. Cosa è stato verificato in questa sessione (13-06-26)

Revisione senior con **4 sub-agenti read-only** in parallelo, una milestone ciascuno, più verifica su **DB TEST** (`docnnernvp`, sola lettura, PROD non toccato) e `npm run validate`. La verifica ha letto **il codice reale, non i report**: ogni claim dei report di chiusura è stato ricontrollato sui file.

Esito: **tutte le milestone AL-A → AL-F eseguite e verificate.** `npm run validate` verde (lint + typecheck + **576 test**).

| Milestone | Esito verificato | Prova |
|---|---|---|
| **AL-A** Bonifica docs (A1-A6) | ✅ | Zero rimandi `PUBLIC_MENU_*` nei file vivi; `FU-ALL-FALLBACK`/`FU-ALL-TIER` registrati senza riciclare FU-023/024; contatori test rimossi; routing capienza/masterplan presente; masterplan non orfano (puntatore in `MASTERPLAN_BLINDATURA.md:16`) |
| **AL-B** Fix critici (B1-B5) | ✅ (anche su DB TEST) | mig. 046 codifica `anon_select_active_organizations`; mig. 047 restringe `restaurant_settings` a whitelist 11 chiavi; guard tenant in `AdminAuthContext`; `create-booking` filtra `is_active` + IP pre-validazione; `check-slot-availability` rimossa; mig. 048 schedula `cleanup_rate_limits` via pg_cron (job attivo su TEST) |
| **AL-C** Pulizia codice (C1-C3) | ✅ | Codice morto cancellato; zero `console.*` applicativi; `@types/qrcode` in devDeps; `@vercel/node` rimosso |
| **AL-D** Fusioni docs (D1-D5) | ✅ | Tombstone coerenti, contenuto vivo unificato, zero rimandi rotti |
| **AL-F1** Prezzi edition | ✅ | 29/69/129 + add-on, "approvati Matteo", ipotesi separate |
| **AL-F2** Stato legale | 🔶 analisi completa, adempimenti reali aperti *(escluso da scope)* | voci P.IVA/B2B/fattura/EAA/region presenti come checklist a 3 livelli |
| **AL-E** Strutturale | ✅ solo design (corretto) | nessuna implementazione prematura; rinvii su FU tracciati |

---

## 2. I due rischi ALTI di Fable — stato

**A1 — Drift migrazioni ↔ DB reale → CHIUSO.**
La policy fantasma `anon_select_active_organizations` (presente sul DB, assente dalle migrazioni) è ora codificata in [`046_codify_policy_drift.sql`](../../../supabase/migrations/046_codify_policy_drift.sql): `FOR SELECT TO anon USING (is_active = true)`. Confermato su TEST che la policy reale è identica. Le policy di `restaurant_settings` non sono ricodificate in 046 *di proposito* (sono già ricostruibili da 001 + 002): il drift vero era solo su `organizations`.

**A2 — Lettura cross-tenant `restaurant_settings` → CHIUSO.**
[`047_restrict_anon_restaurant_settings.sql`](../../../supabase/migrations/047_restrict_anon_restaurant_settings.sql) passa da `USING (true)` a whitelist di 11 `setting_key`. Verificato che il restringimento **non rompe** le pagine pubbliche: ogni call-site di `useRestaurantSetting` è stato cross-controllato — le 8 chiavi fuori whitelist sono lette solo con `{ authenticated: true }` (client `supabase`), le chiavi pubbliche sono tutte dentro whitelist (client `supabasePublic`).

---

## 3. La falla che ti era sfuggita nel masterplan — `validate-invite` (TOCTOU) → CHIUSA

Fable l'aveva classificata **BASSO** ("token marcato usato per ultimo, non-fatale → due POST parallele creano due admin"); **non era entrata in nessun WP/FU** del masterplan. È stata però fixata da Codex nello stesso ciclo, **dopo** la tua analisi.

Verifica diretta su [`supabase/functions/validate-invite/index.ts:125-153`](../../../supabase/functions/validate-invite/index.ts): ora il token viene consumato con **UPDATE atomico condizionato** `used_at IS NULL` + `.select("id")` **prima** di creare l'utente. Chi perde la race riceve 0 righe → 409, niente doppio admin. C'è rollback del token su fallimento tecnico, senza riaprire la finestra TOCTOU (chi ha perso la race è già uscito). Su PROD = v8 (`verify_jwt=true`).

> Nota metodologica per Fable: è un fix di **solo codice edge**, la "serratura" (policy/schema) è invariata. La protezione viene dalla semantica `UPDATE ... WHERE used_at IS NULL` con check del rowcount, non da una nuova policy RLS.

---

## 4. Rilascio in produzione (eseguito in questa sessione)

- `main` allineato a `env/test` (nessuna differenza); `npm run validate` verde.
- `npm run release:prenotazen` → export `main@387db38` nella repo pubblica.
- **Build PrenotaZen verde** prima del push (solo warning chunk-size preesistenti).
- Push produzione: PrenotaZen `94259e0 → 31e2cca` (Vercel auto-deploy).
- Edge function già su PROD da prima (sola lettura confermata nel ciclo 12-06): `create-booking` v14, `validate-invite` v8.

---

## 5. Cosa resta fuori (esplicitamente escluso da Matteo — non sono regressioni)

- **FU-EMAIL-1/2** — `send-email` non deployata: i clienti non ricevono email di conferma/rifiuto. `sendBookingCancelledEmail` resta export orfano benigno in `useEmailNotifications.ts`.
- **FU-LEGAL-1/2/3** — adempimenti reali: P.IVA, contratto B2B/ToS, fattura elettronica (bloccanti pre-incasso); registro trattamenti, runbook breach, sub-processor (entro 1° mese). L'analisi è completa; gli adempimenti sono operativi/umani.
- **Debiti governati altrove** (`MASTERPLAN_BLINDATURA.md` M4/M5/M6): residui `as any` fuori dai punti critici, M4 Impostazioni, M5 Pro.

---

## 6. Dove guardare (per la tua ri-verifica)

| Cosa | File:riga |
|---|---|
| Tenant attivo + rate limit pre-validazione | `supabase/functions/create-booking/index.ts` (~281-286 `is_active`; ~113-129 IP+finestra) |
| Token invito atomico | `supabase/functions/validate-invite/index.ts:125-153` |
| Guard tenant pubblico/admin | `src/contexts/AdminAuthContext.tsx` (`isPublicTenantRoutePath` + guard in `checkSession`) |
| Drift codificato | `supabase/migrations/046_codify_policy_drift.sql` |
| Whitelist settings | `supabase/migrations/047_restrict_anon_restaurant_settings.sql` + `src/features/booking/hooks/useRestaurantSetting.ts` |
| Cleanup rate limits | `supabase/migrations/048_schedule_rate_limits_cleanup.sql` |
| Stato masterplan | `docs/MASTERPLAN_ALLINEAMENTO.md` (tabella §Stato) |

**Verifica globale del masterplan (regola sua §Verifica globale):** ri-audit campione di 20 affermazioni skill→codice con target ≥95%. La verifica a 4 sub-agenti di questa sessione ha campionato ampiamente trovando allineamento ~100% sui punti controllati; nessuna affermazione falsa residua rilevata nei file vivi.

---

## 7. Due note non bloccanti (a tua discrezione)

1. **WP-D5**: i 2 file storici Menu QR sono diventati tombstone in `Menu-QR-Skill/` invece di essere rimossi (duplicano la copia in `Sessioni di lavoro/06-06-26/`). Pulizia netta = cancellare i 2 tombstone (nessun link vivo si rompe).
2. **Report WP-F1**: riporta prezzi vecchi (Pro 79); il context `EDITION_PRICING_CONTEXT.md` è aggiornato (Pro 69) ed è la fonte di verità. Disallineamento solo cosmetico su un documento datato.

---

## 8. Verdetto

**Capitolo allineamento skill↔codice: CHIUSO, eseguito correttamente, allineato alle indicazioni Fable, rilasciato in produzione.** Nessuna falla di sicurezza aperta. Restano in piedi solo email e adempimenti legali di produzione, già fuori scope per decisione di Matteo.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt 1: «sei agente senior. agente fable ha fatto ottima analisi e plan per sistemare vari bug dell'app. i suoi file sono report e analisi. le analisi sono in questa cartella docs\_lavoro\Per matteo\Analisi Fable [...] verifica che il plan @docs/MASTERPLAN_ALLINEAMENTO.md sia stato creato e eseguito allineato alle indicazioni di Fable, e assicurati che non ci siano errori strutturali o di esecuzione. dimmi se posso considerare il capito chiuso (apparte email e documentazione legale produzione) [...] controlla che agenti che hanno eseguito non abbiano fatto errori. avvaliti di Sub agents per organizzarti il lavoro.» Prompt 2: «mi sembrava di aver chiuso quel buco con agente codex. analizza report in merito a questo fix buco che dici. mi aveva detto che avevo un altra "serratura" che tappava il buco, cambiuando solo del codice non la "serrratura". se è tutto ok fai merge con PrenotaZen produzione, e compila un report finale del capitolo per modello fable che revisionerà ancora il codice basandosi su tuo report finale di allineamento.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Verifica a 4 sub-agenti read-only sul codice reale + DB TEST (sola lettura, `get_project_url` = docnnernvp prima di ogni lettura; PROD non toccato). Ri-aperti personalmente: `validate-invite/index.ts` (UPDATE atomico righe 125-153), `MASTERPLAN_ALLINEAMENTO.md`, i 3 report di analisi Fable, `Report-chiusura-ciclo-fable-allineamento-sicurezza-12-06-26.md`, `scripts/sync-to-prenotazen.mjs`, stato git (`main`==`env/test`==origin). `npm run validate` verde (576 test), `npm run validate:docs` verde (676 path, 0 rotti). Release: build PrenotaZen verde, push `94259e0→31e2cca`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Questa sessione è di verifica + rilascio + reportistica: l'unico file di codice/doc nuovo è questo report. Le modifiche di codice del capitolo erano già committate e allineate ai context (verificato nei report 12-06: masterplan, FOLLOW_UP, DB/legal/marketing context aggiornati). Memoria di progetto aggiornata fuori repo: `project_review_allineamento_falle_aperte` (WP-B4 + validate-invite ora chiusi).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho implementato email né adempimenti legali (fuori scope esplicito). Non ho fatto QA browser manuale del deploy Vercel (il gate richiesto era validate + build verde + verifica read-only PROD). Non ho scritto su PROD DB. Non ho eseguito il ri-audit formale "20 affermazioni ≥95%" come censimento numerato: la verifica a sub-agenti ha campionato ampiamente con allineamento ~100%, ma resta un campione, non un censimento totale.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: la segnalazione iniziale su `validate-invite` derivava dall'analisi Fable, più vecchia del fix Codex — lo stato reale era già chiuso ma in un report diverso dal masterplan; miglioria: quando un finding fuori-WP viene fixato, registrarlo subito nel masterplan come riga «chiuso fuori-WP + report» così un revisore non lo riapre (qui era tracciato solo in FOLLOW_UP come FU-AUTH-INVITE).

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto per una verifica-chiusura: masterplan + 3 analisi + report di ciclo bastavano a ricostruire lo stato senza grep alla cieca. Hook utile, non rumore: il pre-commit ha bloccato il primo commit perché mancava questa §11 — esattamente il comportamento anti-deriva voluto, ha educato il report alla forma corretta.
