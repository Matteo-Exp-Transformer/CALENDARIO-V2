# Report WP-B3 — Guard tenant pubblico/admin — 12-06-26

**Cosa è cambiato:** aprendo Pagina Prenota o Menu QR con un admin già loggato, il cliente vede sempre il ristorante dello slug pubblico, non quello della sessione admin.
**Cosa resta:** niente sul WP-B3; codice privato e PrenotaZen pubblico sono allineati.
**Serve una tua azione:** no per WP-B3; solo eventuale hard refresh/incognito se il browser mostra una versione vecchia per cache PWA.

## 1. Cosa è stato fatto

- Ho fatto mappare in sola lettura il conflitto: `AdminAuthProvider` vive sopra tutte le route, quindi il restore sessione admin partiva anche su `/prenota/*` e `/menu/*`.
- Ho applicato il guard sul restore sessione: sulle route pubbliche il check auth non chiama `setTenantFromAdmin` e non pulisce il tenant pubblico da percorsi admin.
- Ho mantenuto il login admin normale: su `/login` e `/admin` il tenant admin viene ancora risolto da sessione/RPC.
- Ho portato Pagina Prenota allo stesso criterio del Menu QR: i dati pubblici partono solo quando il tenant risolto nel context combacia con lo slug URL.
- Ho chiuso `FU-AUTH-2` nel registro senza creare un nuovo ID.
- Dopo conferma di Matteo ho creato i commit, pushato `env/test` e `main`, poi ho sincronizzato anche la repo pubblica PrenotaZen.

## 2. File toccati e perché

| File | Perché |
|---|---|
| `src/contexts/AdminAuthContext.tsx` | Guard route pubbliche + restore sessione su cambio percorso. |
| `src/pages/BookingRequestPage.tsx` | Evita query pubbliche con tenant stale se lo slug URL non combacia ancora col context. |
| `src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` | Copre restore sessione admin su `/admin`, `/prenota/:slug`, `/menu/:slug`. |
| `docs/FOLLOW_UP.md` | `FU-AUTH-2` chiuso e collegato a WP-B3. |
| `docs/DATA_FLOW_SKILL.md` | Documenta precedenza dello slug pubblico sulla sessione admin. |
| `docs/Admin-Skill/contesto/ADMIN_USER_FLOW_CONTEXT.md` | Documenta il caso admin che apre un link pubblico. |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-B3 marcato ✅ con link report. |

## 3. Test e QA

- `npm run test -- src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` → ✅ 7 test.
- `npm run validate` → ✅ lint + typecheck + 68 file test / 560 test.
- `npm run build` in CalendarBackup-v2 → ✅.
- `npm run build` in PrenotaZen → ✅.
- QA browser su TEST locale (`docnnernvp`, slug `trattoria-da-tommaso`) → ✅:
  - login admin iniziale OK;
  - apertura `/prenota/trattoria-da-tommaso` con sessione admin attiva: console salute `STATO (pagina pubblica)`, nessun `STATO (admin)`;
  - apertura `/menu/trattoria-da-tommaso` con sessione admin attiva: console salute `STATO (pagina pubblica)`, nessun `STATO (admin)`;
  - ritorno a `/admin`: dashboard montata e console salute `STATO (admin)`.

Note: `validate` stampa warning `act(...)` già presenti in test non collegati al WP; la suite resta verde. Nessuna migrazione DB e nessuna scrittura PROD perché il diff WP-B3 non tocca `supabase/`.

## 4. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/DATA_FLOW_SKILL.md` | Aggiunta guard route pubbliche vs sessione admin. | Il comportamento identitario è cambiato e va tracciato nella skill auth/data-flow. |
| `docs/Admin-Skill/contesto/ADMIN_USER_FLOW_CONTEXT.md` | Nota sui link pubblici aperti da admin loggato. | È un flusso reale che parte dalla dashboard. |

## 5. Dati comunicazione

- Prompt Matteo sostanziali: 2.
- Richieste ricorrenti: “profilo Esecuzione senior / deep”, “sub-agent read-only prima del codice”, “no PROD senza conferma”, “validate verde”, “QA pubblico+admin documentata”.
- Formato che ha funzionato: conferma iniziale breve del flusso e dei LOCK, poi aggiornamenti operativi mentre sub-agent e test giravano.
- Automazione possibile: per WP con sub-agent, il prompt era già molto completo; utile mantenere la sequenza read-only → worker → revisione senior come template.
- Manuale da lasciare: conferma PROD e commit/push restano decisioni di Matteo.

## 6. Analisi flusso prompt, efficienza e statistiche

| Dato | Valore |
|---|---|
| Messaggi utente sostanziali | 2 |
| Sub-agent usati | 2: read-only mappa, worker implementazione |
| Correzioni senior post-worker | 1: restore sessione su ritorno `/admin` da route pubblica |
| Test automatici | targeted auth + validate |
| QA browser | sì, TEST locale con sessione admin attiva |
| Commit/push privato | `a20d233` codice + `89c4c14` docs, pushati su `env/test` e `main` |
| Sync pubblico | PrenotaZen `ac9aeec` dopo `npm run release:prenotazen` e build verde |

Il prompt principale era completo: branch gate, file target, vietati, QA e chiusura erano già espliciti. La parte più delicata è stata non fermarsi al guard pubblico: la revisione del diff ha trovato che il ritorno dalla route pubblica a `/admin` doveva riattivare il restore admin.

## 7. Lettura qualità agente

Il workflow multi-agente ha aiutato perché la mappa read-only ha identificato il conflitto esatto prima della patch. Il worker ha prodotto una base valida, ma la revisione senior era necessaria: senza il check sul cambio percorso, lo stesso tab poteva restare con tenant pubblico quando rientrava in admin. Questo conferma che per i LOCK auth serve sempre revisione del flusso completo, non solo dei test aggiunti.

## 8. Derivazione errori

- **Bug preesistente:** `AdminAuthProvider` montato sopra le route pubbliche faceva partire `checkSession()` anche su `/prenota/*` e `/menu/*`; da lì `setTenantFromAdmin` poteva sovrascrivere lo slug tenant.
- **Errore evitato in revisione:** la prima patch proteggeva le route pubbliche ma non documentava abbastanza il rientro nello stesso tab verso `/admin`; corretto facendo ripartire `checkSession()` al cambio `location.pathname` e mettendo `isLoading=true` durante il restore.
- **Vincolo strutturale:** non si poteva cambiare il contratto `supabase`/`supabasePublic` né hardcodare tenant; il fix resta quindi nel layer auth/router context, non nel DB.

## 9. Cosa resta

- `FU-AUTH-2` → fatto.
- WP-B3 → ✅ nel masterplan.
- PROD: autorizzato da Matteo nel turno successivo al report; rilascio via push su `main` privato e sync PrenotaZen pubblico.
- DB TEST/PROD: nessuna applicazione necessaria; tra `4a2a571..89c4c14` non ci sono file `supabase/`.

## 10. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) “Profilo: Esecuzione senior. Modalità: deep. Skill da leggere: docs/APP_CONTEXT_SKILL.md §0 e §4 ... OBIETTIVO WP-B3 ... impedire che una sessione admin loggata sovrascriva il tenant risolto da una rotta pubblica /prenota/:slug o /menu/:slug ... WORKFLOW ... sub-agent ... validate ... QA ... CHIUSURA ...”. (2) “procedi”. (3) “fai commit e push e allinea anche produzione. applichiamo modfiche a tutto e allinieiamo codice nei DB test e prod. procedi.” (4) “hai lanciato script prenotazen per fare merge con app in produzione? (anche dei lavori precedenti?)”. (5) “allinea prenotaZen a tutto il lavoro svolto in questa sessione.” (6) “fai report finale del tuo lavoro svolto nel complesso.”

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho riaperto `AdminAuthContext.tsx`, `BookingRequestPage.tsx`, `useAdminAuth.test.tsx`, `FOLLOW_UP.md`, `DATA_FLOW_SKILL.md`, `ADMIN_USER_FLOW_CONTEXT.md`, `MASTERPLAN_ALLINEAMENTO.md`; ho verificato `npm run validate` = 68 file / 560 test, `npm run build` privato e pubblico, smoke TEST sullo slug `trattoria-da-tommaso`, commit privati `a20d233`/`89c4c14` e release PrenotaZen `ac9aeec`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati `docs/DATA_FLOW_SKILL.md` e `docs/Admin-Skill/contesto/ADMIN_USER_FLOW_CONTEXT.md`; aggiornati `docs/FOLLOW_UP.md` e `docs/MASTERPLAN_ALLINEAMENTO.md`. Non ho modificato `APP_CONTEXT_SKILL.md` perché il LOCK due client/TenantContext resta invariato.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho toccato `router.tsx`, `TenantContext.tsx`, client Supabase, DB o migrazioni perché il guard si risolveva in `AdminAuthContext` + readiness Prenota. Commit/push, `main` e PrenotaZen sono partiti solo dopo la conferma esplicita successiva di Matteo; DB non applicato perché non c'erano file Supabase nel diff.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attriti principali: `FU-AUTH-2` era citato nel masterplan ma non nel registro `FOLLOW_UP.md`; inoltre nella prima risposta di rilascio ho parlato di produzione senza aver ancora lanciato PrenotaZen. Migliorie: registrare sempre i FU riusati nel registro e, nei report finali, distinguere esplicitamente “main privato” da “PrenotaZen pubblico”.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto: `DATA_FLOW_SKILL`, Prenota data-flow e Admin user-flow bastavano senza caricare UI skill. Nessun hook di fine sessione ricevuto durante la scrittura; il protocollo §11 era utile come checklist.

## 11. Self-review del report

- Diff reale ricontrollato dopo la patch senior e dopo i commit/release.
- File correlati aggiornati nella stessa sessione.
- Q1-Q6 aggiornate con i prompt successivi a commit, produzione e PrenotaZen.
- Linguaggio utente usato nelle sezioni di sintesi; i nomi file restano nelle tabelle tecniche.

## 12. Chiusura finale commit/push

- CalendarBackup-v2:
  - `a20d233` — `fix(auth): guard tenant pubblico da restore admin`
  - `89c4c14` — `docs(allineamento): chiude WP-B3 guard tenant pubblico`
  - `env/test`, `main`, `origin/env/test`, `origin/main` allineati a `89c4c14`
- PrenotaZen:
  - `ac9aeec` — `release: guard tenant pubblico admin`
  - `origin/main` allineato a `ac9aeec`
- Build finali:
  - CalendarBackup-v2 `npm run validate` ✅ e `npm run build` ✅
  - PrenotaZen `npm run build` ✅
- Working tree:
  - restano solo modifiche locali preesistenti non mie nella repo privata; non incluse nei commit WP-B3.
