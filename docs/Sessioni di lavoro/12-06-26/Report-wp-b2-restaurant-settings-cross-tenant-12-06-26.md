# Report WP-B2 — Chiudere lettura cross-tenant `restaurant_settings` (12-06-26)

Profilo: Esecuzione (2 sub-agent) + Revisione senior · Modalità: deep · Branch: `env/test`

---

## 1. Cappello

- **Cosa è cambiato:** un estraneo non può più sbirciare le impostazioni operative di un altro ristorante (limiti coperti, capienze, aree sala, walk-in, tema, ecc.). Restano leggibili pubblicamente solo le 11 impostazioni che servono davvero alle pagine pubbliche (nome, contatti, orari, aspetto, form, promo).
- **Cosa resta:** niente — codice live in produzione (deploy Vercel `20a7d00` READY) e migrazione 047 applicata su TEST **e PROD**. WP-B2 chiuso.
- **Serve una tua azione:** no.

---

## 2. Cosa è stato fatto

1. Mappata, in sola lettura, ogni impostazione: dove viene letta e se sotto una pagina pubblica o dentro la dashboard. Scoperta chiave: la dashboard admin leggeva le impostazioni dalla "porta pubblica" (client anonimo), non solo le pagine pubbliche.
2. Classificate le 19 impostazioni: **11 pubbliche** (lette dalle pagine pubbliche) e **8 solo-admin** (lette solo in dashboard).
3. Cambiato il codice perché la dashboard legga le 8 solo-admin dalla "porta da loggato" (client autenticato), lasciando le pagine pubbliche invariate sulla porta anonima.
4. Ristretta la regola di lettura pubblica sul DB a una whitelist di sole 11 impostazioni pubbliche (migrazione 047).
5. Applicato su TEST e fatto smoke pubblico + admin: tutto funziona.

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `src/features/booking/hooks/useRestaurantSetting.ts` | Aggiunta opzione `{ authenticated }`: sceglie client anonimo o autenticato |
| `src/pages/AdminDashboard.tsx`, `src/components/layout/AdminShell.tsx` | `app_theme` letto da client autenticato |
| `src/features/booking/components/RestaurantSettingsTab.tsx` | tema, cap giornaliero, capienze, time-slots da autenticato |
| `src/features/booking/components/AdminBookingForm.tsx`, `DetailsTab.tsx` | aree sala, cap giornaliero da autenticato |
| `src/features/booking/components/BookingCalendar.tsx`, `BookingDetailsModal.tsx`, `PendingRequestsTab.tsx` | capienze, time-slots, cap giornaliero da autenticato |
| `src/features/booking/hooks/useCapacityCheck.ts` | capienze + time-slots da autenticato (usato solo in admin) |
| `src/features/booking/components/home/WalkInModal.tsx` | walk-in max da autenticato |
| `supabase/migrations/047_restrict_anon_restaurant_settings.sql` | NUOVO — whitelist anon a 11 key pubbliche |

## 4. Test eseguiti e risultato

`npm run validate` → **verde**: lint 0 warning, typecheck 0 errori, 557 test passati. Nessun test ha richiesto modifiche. Smoke su TEST (Matteo): pagina pubblica Prenota OK, dashboard admin (tema/limiti/aree/capienze) OK.

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | Nota RLS whitelist su `restaurant_settings` | documenta le 11 pubbliche + 8 solo-admin e il pattern `authenticated` |
| `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` | Nota su LOCK due client | la Prenota pubblica legge solo le 11 key whitelist |
| `docs/Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md` | Riga tabella flusso | Menu QR pubblico usa solo `restaurant_name` (in whitelist) |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | Stato WP-B2 → 🔶 (PROD pending) | tracciamento |

## 6. Dati comunicazione

- Matteo ha guidato con decisioni nette su domande di scope: «fix completo ora» (non la versione leggera) e «rilascio completo ora» per PROD.
- Ha confermato lo smoke su TEST prima del PROD: «smoke test ok. tutto funziona correttamente su DB test.».
- Formato efficace: spiegazione "porta pubblica vs porta da loggato" per rendere comprensibile un problema di RLS senza gergo.

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali: 3 decisioni (profondità fix, approccio PROD, conferma smoke). Correzioni dopo risposta: 0. FU nuovi: 1 (manutenzione whitelist, sotto).
- Efficacia: le decisioni di scope sono state portate a Matteo con `AskUserQuestion` e opzioni pesate, evitando che il senior decidesse al posto suo su un trade-off sicurezza/lavoro.

## 8. La mia lettura della sessione (revisore senior)

- **Impressioni:** lo schema a due fasi (sub-agent mappa → senior verifica la classificazione → sub-agent implementa) ha pagato moltissimo qui: la classificazione pubblica/admin è il punto dove un errore rompe le prenotazioni, e averla verificata a mano (grep su tutte le 8 key + conferma che `useCapacityCheck` non è nel form pubblico) prima di scrivere codice ha tolto il rischio.
- **Difficoltà + soluzione:** la scoperta che la dashboard legge via client anonimo ha cambiato lo scope rispetto a come il masterplan immaginava B2 (pensava solo pagine pubbliche). Gestito fermandomi e portando la decisione a Matteo invece di improvvisare.
- **Migliorie suggerite (dato):** il masterplan B2 dava per scontato che solo le pagine pubbliche leggessero da anon; un check rapido "chi legge questa tabella via supabasePublic" andrebbe messo come primo passo dei WP che restringono RLS, prima di scrivere la migrazione.

## 9. Derivazione errori

- **prompt/plan incompleto (non bug):** il masterplan assumeva che le letture anon fossero solo delle pagine pubbliche. La realtà (anche admin via anon) ha allargato lo scope. Derivava da una mappatura non fatta in fase di stesura del masterplan; si è evitato il danno mappando prima di toccare.
- **errore agente minore (sub-agent fase 2a):** ha contato "18 chiavi" invece di 19 nel registry — immateriale, classificazione comunque completa e corretta. Intercettato in revisione.
- Nessun bug di codice preesistente.

## 10. Cosa resta per la prossima sessione

- **PROD: fatto** — codice rilasciato (merge `main` + deploy Vercel `20a7d00` READY) e migrazione 047 applicata su PROD `rwuxgvld` (policy verificata: 11 pubbliche dentro, admin-only fuori). TEST e PROD allineati.
- **FU nuovo:** `FU-B2-WHITELIST` — ogni nuova `setting_key` pubblica va aggiunta SIA al registry SIA alla whitelist della policy 047. Debito di manutenzione da sorvegliare (documentato in `DB_SCHEMA_CONTEXT.md`).

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «proseguiamo con prosima task in plan . lancia sub agent e revisiona.»; «le task senior dovrebbero esser rimaste in plan giusto?»; risposta scelta «Fix completo ora»; risposta scelta «Rilascio completo ora»; «smoke test ok. tutto funziona correttamente su DB test.».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati corrispondono al diff vero?
✅ R2: Riaperti: `useRestaurantSetting.ts` (opzione client), `047_…sql` (whitelist 11 key verificata su disco e su TEST via pg_policies), `git diff -U0` per confermare che SOLO chiavi admin hanno preso `{authenticated:true}` e nessuna pubblica. Verificato via grep che le 8 admin-only non hanno più letture anon e che `useCapacityCheck` è importato solo da `AdminBookingForm`. `validate` 557 test letto dall'output.

❓ Q3 — File correlati allineati?
✅ R3: DB_SCHEMA_CONTEXT (policy), PRENOTA + MENU_QR data-flow context, masterplan: aggiornati in questa chiusura. Tipi DB invariati (nessuna colonna nuova). Test invariati (nessun mock rotto).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Tutto completato. La 047 è stata applicata su PROD SOLO dopo aver verificato che il codice nuovo fosse live (deploy Vercel `20a7d00` READY) — ordine rispettato per non rompere la dashboard. Browser-smoke su TEST confermato da Matteo; su PROD verificata la policy via SQL (non smoke browser). Masterplan flippato a ✅ in chiusura.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito: lo scope è cambiato a metà (scoperta admin-via-anon). Miglioria: nei WP che restringono RLS, primo passo obbligatorio = "mappa chi legge la tabella via client anonimo in TUTTA l'app", non solo nelle pagine pubbliche, così lo scope è chiaro dal prompt.

❓ Q6 — Contesto & hook?
✅ R6: Contesto adeguato. La scelta di mappare prima di scrivere è stata decisiva. I reminder TodoWrite erano rumore per un flusso già sequenziato; non usati.

## 12. Self-review

1. Dati = diff reale: ✅ git diff + pg_policies su TEST + grep di copertura.
2. File correlati allineati: ✅ schema DB + 2 data-flow + masterplan in questa chiusura.
3. Q1-Q6 sostanziali e coerenti: ✅.
4. Tono utente: ✅ "porta pubblica/porta da loggato", non nomi-file.
