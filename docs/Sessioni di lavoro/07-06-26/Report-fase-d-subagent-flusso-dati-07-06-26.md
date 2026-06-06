# Report — Fase D sub-agent: flusso dati Admin Area 2 (Prenotazioni operative)

> Sub-agent Verifica · fronte **FLUSSO DATI** · mandato **ROMPI** · modalità deep · read-only · 07-06-26.
> Nessun codice applicativo modificato da questo sub-agent.

---

## 1. Cappello

- **Cosa è cambiato:** per il ristoratore **niente di visibile** — sessione di analisi sola. Abbiamo mappato cosa può andare storto nei dati delle prenotazioni (accetta, rifiuta, elimina, reinserisci, no-show) e trovato **7 punti deboli** (D1–D7), di cui uno **grave** (D1).
- **Cosa resta:** decidere quali fix applicare (priorità **D1** race multi-tab; poi D2/D3 se email o contatori usage sono attivi in produzione). Gli altri sub-agent Fase D (utente, limit test, responsive) e la consolidazione orchestratore restano nel report padre.
- **Serve una tua azione:** **sì** — rivedere la tabella finding sotto e dare via libera (o «voluto») sui fix, idealmente con prompt anti-rottura PLAN §4 per i file LOCK.

---

## 2. Cosa è stato fatto

1. **Lettura contesto** — caricate le decisioni volute Area 2 (`ADMIN_PRENOTAZIONI_CONTEXT.md` §5-bis, §7): avvisi mai blocco, soft-delete, conferme unificate, stati voluti.
2. **Analisi flusso dati** — per ogni azione admin (accetta da card, rifiuta, elimina, reinserisci, riporta in attesa, no-show) verificato quale stato finisce in `booking_requests` e quali side effect (email, `tenant_usage.bookings_count`).
3. **Ricerca attiva di rotture** — scenari race multi-tab, doppio click, azione su record già in altro stato, dati nulli/legacy, email che fallisce.
4. **Conferma comportamenti voluti** — email non blocca la mutation; capienza/orario passato solo avviso; soft-delete senza hard-delete app.
5. **Test mirati** — eseguiti i test `@admin-blindatura: prenotazioni` su mutation e componenti (9/9 verdi al momento del sub-agent).
6. **Report finding** — emessi D1–D7 con gravità, riproduzione, fix suggerito e file coinvolti.

---

## 3. File toccati e perché

| File | Azione | Perché |
|------|--------|--------|
| `src/features/booking/hooks/useBookingMutations.ts` | Letto (LOCK) | Payload accept/reject/cancel/restore/requeue/no-show; assenza guard `.eq('status',…)` tranne requeue |
| `src/features/booking/components/PendingRequestsTab.tsx` | Letto | Flusso accetta/rifiuta da card; refetch interval |
| `src/features/booking/components/ArchiveTab.tsx` | Letto | Reinserisci / Riporta in attesa |
| `src/features/booking/components/BookingDetailsModal.tsx` | Letto (LOCK) | Elimina, no-show, salvataggio dettagli |
| `src/features/booking/components/BookingDangerActionModal.tsx` | Letto | Conferme unificate |
| `src/features/booking/components/RejectBookingModal.tsx` | Letto | Rifiuto con motivo |
| `src/features/booking/components/BookingRequestCard.tsx` | Letto | Bottoni Accetta/Rifiuta, assenza `isPending` su accept |
| `src/features/booking/hooks/useBookingQueries.ts` | Letto | Refetch pending ~30s |
| `src/features/booking/hooks/useEmailNotifications.ts` | Letto | Email non blocca mutation |
| `supabase/migrations/001_schema_completo.sql` | Letto | Trigger `increment_booking_count_on_accept` |
| `src/features/booking/hooks/__tests__/useBookingMutations.prenotazioni.adminBlindatura.test.tsx` | Letto + test | Copertura payload happy path |
| `src/features/booking/components/__tests__/prenotazioni.adminBlindatura.test.tsx` | Letto + test | Copertura modali archivio |
| `docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` | Letto | Decisioni volute §5-bis |
| **Questo report** | Scritto | Chiusura sessione sub-agent flusso dati |

**Codice applicativo:** nessuna modifica.

---

## 4. Test eseguiti e risultato

| Comando | Esito |
|---------|-------|
| `npm test -- --run src/features/booking/hooks/__tests__/useBookingMutations.prenotazioni.adminBlindatura.test.tsx src/features/booking/components/__tests__/prenotazioni.adminBlindatura.test.tsx` | **9/9 pass** (al momento del sub-agent) |

**Nota orchestratore (stesso giorno):** dopo il sub-agent limit test, la suite completa è salita a **456 test** verdi con `npm run validate`. Questo sub-agent **non** ha rieseguito `validate` completo.

**Lacune test emerse (non eseguite qui):**
- Nessun test race accept/reject senza guard `pending`
- Nessun test restore → doppio incremento `bookings_count`
- Nessun test «email in errore non fa fallire mutation» (§6 `ADMIN_PRENOTAZIONI_CONTEXT.md`)

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| *nessuno* | — | Sub-agent read-only: nessun diff codice né skill. L'orchestratore ha consolidato i finding in `ADMIN_PRENOTAZIONI_CONTEXT.md` §9, `ADMIN_TEST_SUITE_INDEX.md` §8, `PLAN_BLINDATURA_ADMIN.md` — fuori scope di questo report. |

---

## 6. Dati comunicazione

- **Prompt ricevuti:** 1 prompt sostanziale dall'orchestratore (non chat diretta con Matteo). Mandato esplicito «ROMPI», read-only, 5 assi di analisi, output strutturato D1…
- **Formato efficace:** elenco numerato delle aree da analizzare + elenco file chiave + decisioni «NON sono bug» in testa → ha evitato falsi positivi su capienza/blocco.
- **Automatizzabile:** matrice azione→stato DB + grep `.eq('status'` sulle mutation; test race multi-tab come E2E o integration con due client Supabase.
- **Manuale:** priorità fix (D1 vs D3 usage) e «voluto» su metadata sporchi (D5) — decisione prodotto Matteo.

---

## 7. Analisi flusso prompt, efficienza e statistiche

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali (orchestratore) | 1 |
| Correzioni dopo 1ª risposta | 0 |
| Follow-up generati da questo sub-agent | 0 (solo finding verso orchestratore) |
| Modalità alzata | no (già deep) |

**Anatomia:** il prompt ha funzionato perché separava **voluto** da **da cercare**, citava i LOCK e chiedeva ID/gravità/fix per ogni finding. Ambiguità minore: non precisava se contare D4–D7 come finding separati o raggruppare — il sub-agent li ha numerati tutti e sette.

**Da replicare:** mandato «cosa può rompere + cosa può fare l'utente» + tabella output obbligatoria.

---

## 8. Tabella finding D1–D7 (flusso dati)

| ID | Gravità | Cosa rompe | Come riprodurre (sintesi) | Fix suggerito | File principali |
|----|---------|------------|---------------------------|---------------|-----------------|
| **D1** | **ALTO** | Race multi-tab: rifiuto su card **stale** sovrascrive prenotazione già `accepted` → sparisce dal calendario; rischio email di rifiuto errata | Tab A: pending X; Tab B: accetta X; Tab A entro ~30s: Rifiuta → DB `rejected` | Guard `.eq('status','pending')` su accept/reject (come requeue); toast se 0 righe; opz. disabilitare card durante mutation | `useBookingMutations.ts` L71-77, L122-132; `PendingRequestsTab.tsx`; `useBookingQueries.ts` L31 |
| **D2** | MEDIO | Doppio click «Accetta» → doppia email se `VITE_ENABLE_SEND_EMAIL=true` (stato DB resta `accepted`, trigger non riconta) | Doppio click rapido su «Accetta Prenotazione» | `disabled={acceptMutation.isPending}` su card; opz. idempotency email | `BookingRequestCard.tsx` L409-416; `PendingRequestsTab.tsx` L119-145 |
| **D3** | MEDIO | Reinserisci da archivio incrementa di nuovo `tenant_usage.bookings_count` (ciclo accetta→elimina→reinserisci) | Accetta → Elimina → Archivio Reinserisci → contatore +1 di nuovo | Trigger che esclude `OLD.status IN ('deleted','accepted')` o flag «già conteggiata» | `001_schema_completo.sql` L223-237; `useRestoreBooking` L335-344 |
| **D4** | MEDIO | «Reinserisci» visibile anche senza `confirmed_start/end` → toast errore generico post-conferma | Record `deleted` senza orari → Reinserisci | Mostrare bottone solo se orari presenti; opz. flusso «riporta in pending» | `ArchiveTab.tsx` L379-393; `useRestoreBooking` L331-333 |
| **D5** | BASSO | Restore non azzera `cancellation_reason`, `cancelled_at`, `cancelled_by` → dati sporchi per export/analytics | Elimina con motivo → Reinserisci → query DB | Azzerare campi cancellazione in restore | `useRestoreBooking.ts` L335-340 |
| **D6** | BASSO | No-show / elimina / accept / reject senza guard stato DB (solo UI); requeue è l'unica con `.eq('status',…)` | DevTools no-show su `pending`; doppia eliminazione stesso id | Pattern `.eq('status',…)` su tutte le mutation critiche | `useBookingMutations.ts` (no-show, cancel, accept, reject) |
| **D7** | BASSO | Salvataggio dettagli calendario: `handleSave` esce in silenzio se manca `confirmed_start` | Dati legacy/corrotti in modale dettagli | Toast «Impossibile salvare: orario non confermato» | `BookingDetailsModal.tsx` L524-525 |

### Matrice happy path (verificata OK)

| Azione | Stato DB atteso | Esito analisi |
|--------|-----------------|---------------|
| Accetta da card | `accepted` + `confirmed_*` + `desired_time` | OK |
| Rifiuta | `rejected` + `rejection_reason` | OK (senza guard → D1) |
| Elimina | `deleted` + soft-delete campi | OK |
| Reinserisci | `accepted` se orari presenti | OK con riserve D3–D5 |
| Riporta in attesa | `pending`, motivo null | OK + unica guard `.eq('status','rejected')` |
| No-show | `no_show=true`, status `accepted` | OK (voluto) |

### Comportamenti confermati VOLUTI (non bug)

Capienza/fasce/orario passato = solo avviso · soft-delete · email fallita non blocca mutation · `desired_time` assente blocca accettazione con toast · email vuota → mutation ok, email skipped · conferme `BookingDangerActionModal`.

---

## 9. La TUA lettura della sessione

- **Impressioni:** il mandato ROMPI su un solo fronte (dati) è stato gestibile in una passata: i file mutation sono centralizzati in `useBookingMutations.ts`, quindi il pattern «manca `.eq('status')`» salta subito agli occhi. La skill §5-bis ha evitato di segnalare come bug i warning capienza/orario passato. Procedura scorrevole; il vincolo LOCK è stato rispettato (solo lettura).
- **Difficoltà:** stimare la finestra della race D1 richiede conoscere il refetch interval (`useBookingQueries` ~30s) — non banale senza aprire quel file. Il trigger usage (D3) richiede lettura migrazione SQL, non solo React.
- **Migliorie suggerite (dato, non modificare skill):** aggiungere in `ADMIN_PRENOTAZIONI_CONTEXT.md` una riga esplicita «mutation con/senza guard stato» come checklist Fase D; template test «0 righe aggiornate → toast stato cambiato» da riusare su accept/reject.

---

## 10. Derivazione errori

| Finding | Classificazione | Cosa è successo | Come si sarebbe evitato |
|---------|-----------------|-----------------|---------------------------|
| D1 | **bug preesistente** | Accept/reject aggiornano per `id` senza filtrare `status=pending` | Guard DB come `useRequeueRejectedBooking`; test integration race |
| D2 | **bug preesistente** | Accept non usa `isPending` sul bottone (reject sì via modale) | Parità UX accept/reject; test doppio click |
| D3 | **bug preesistente** | Trigger SQL incrementa su ogni transizione verso `accepted` | Progettazione trigger con esclusione restore da `deleted` |
| D4 | **bug preesistente** | UI archivio non filtra record senza orari confermati | Condizione visibilità bottone + test restore fallito |
| D5 | **bug preesistente** | Payload restore minimale (`status` only) | Specifica esplicita «pulizia metadata» in skill archivio |
| D6 | **bug preesistente** | Difesa in profondità assente su mutation | Standard progetto: guard stato su ogni write critica |
| D7 | **bug preesistente** | Early return silenzioso in `handleSave` | Toast errore + test modale dettagli |

Nessun errore agente sul classificare i voluti; nessun prompt ambiguo sul mandato read-only.

---

## 11. Cosa resta per la prossima sessione

- **Priorità prodotto:** fix **D1** (race pending→accepted) — allineato a `FU-043` e consolidamento orchestratore Fase D.
- **Se email/usage in prod:** valutare fix **D2** (doppia email) e **D3** (contatore annuale).
- **Polish:** D4–D7 in prompt anti-rottura separato o batch con altri fix Area 2.
- **Test da aggiungere** (post-fix): race senza guard; restore doppio incremento; email errore non blocca mutation.
- **Non fatto qui:** fronti flusso utente (U1–U10), limit test (L*), responsive (R1–R4) — altri sub-agent.

---

## 12. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: In questa chat **Matteo non ha scritto direttamente**; prompt dall'orchestratore (verbatim sostanziale): «Profilo: Verifica Admin Area 2 — Fase D controtest READ-ONLY · Modalità: deep · env/test · NON modificare codice applicativo · MANDATO: TROVARE BUG attivamente sul fronte FLUSSO DATI per Prenotazioni operative Admin · Domanda guida: "cosa può rompere questa sezione e cosa può fare l'utente per romperla?" · DECISIONI VOLUTE (NON sono bug): capienza/fasce/orario passato = solo AVVISO; stati pending/accepted/rejected/deleted + no_show voluti; archivio soft-delete; conferme BookingDangerActionModal · LOCK: useBookingMutations.ts, BookingDetailsModal.tsx · ANALIZZA: (1) ogni azione→stato DB (2) dati nulli (3) doppio click/race (4) azione su record altro stato (5) email fallita non blocca · FILE CHIAVE elencati · OPZIONALE test prenotazioni.adminBlindatura · OUTPUT: ID D1…, gravità, riproduzione, fix, file/righe · NON fixare codice.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì per questo sub-agent: **zero diff codice**. Ri-verificato rileggendo `useBookingMutations.ts` (accept L71-77, reject L122-132, requeue con `.eq('status','rejected')` unica guard), `PendingRequestsTab.tsx` (handleAccept senza guard pending), `BookingRequestCard.tsx` (accept senza `isPending`), `ArchiveTab.tsx` (Reinserisci su tutte deleted), `BookingDetailsModal.tsx` L524-525 (return silenzioso), trigger in `001_schema_completo.sql` L223-237. Test 9/9 coerente con output shell del sub-agent. Il numero **456** validate è dell'orchestratore post limit-test, non rieseguito qui.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Nessuno aggiornato da questo sub-agent** (read-only). File correlati che **andrebbero** allineati dopo consolidazione orchestratore: `ADMIN_PRENOTAZIONI_CONTEXT.md` §9, `ADMIN_TEST_SUITE_INDEX.md` §8, `PLAN_BLINDATURA_ADMIN.md` — l'orchestratore li ha già toccati nello stesso giorno; questo report non li modifica. Test blindatura esistenti non coprono ancora D1/D3/D6.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non eseguito `npm run validate` completo (solo 2 file test). Non scritti test per race D1, restore D3, email errore. Non analizzati fronti utente/limit/responsive (altri sub-agent). Non applicati fix (mandato esplicito). Non toccato codice LOCK. Certo perché il mandato limitava l'output a report finding e il parent agent gestisce consolidamento/fix.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito = finding D6 è «famiglia» di D1 (stessa root: no guard stato) ma va numerato separato per tracciabilità orchestratore — proposta: in PLAN Fase D indicare «un finding per pattern distinto anche se stessa fix». Attrito immaginato = sub-agent che non legge migrazione SQL e perde D3 — proposta: riga obbligatoria «side effect DB/trigger» nel prompt flusso dati.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto**: `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-bis ha chiarito i non-bug; lista file nel prompt ha evitato esplorazione a tappeto. Hook/regole `comandi-base` (no commit, PROD read-only) utili come guardrail. Non ho caricato `ADMIN_SKILL.md` intero — sufficiente il context prenotazioni per questo fronte.

---

## 13. Self-review del report

| # | Controllo | Esito |
|---|-----------|-------|
| 1 | Dati = diff reale | OK — nessun codice modificato; finding allineati al transcript sub-agent e ai file riletti |
| 2 | File correlati allineati | OK — dichiarato che skill aggiornate sono compito orchestratore, non questo sub-agent |
| 3 | Q1–Q6 coerenti | OK — risposte con sostanza, nessuna contraddizione con mandato read-only |
| 4 | Tono utente | OK — cappello e finding in linguaggio flusso ristoratore dove possibile |

**Correzione applicata in self-review:** chiarito in §4 che 9/9 è del sub-agent e 456 è post-orchestratore, per non confondere i numeri test.

---

*Report pronto per hook `stop` e consolidamento Fase D Area 2.*
