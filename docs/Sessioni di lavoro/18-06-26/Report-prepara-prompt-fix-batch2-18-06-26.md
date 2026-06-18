# Report — prepara-prompt: controtest batch 1 + prompt batch 2 (18-06-26)

> Profilo: prepara-prompt (ragionamento/preparazione, non scrittura codice app). Branch `env/test`.

## Cappello (3 righe)
- **Cosa è cambiato:** confermato che il batch precedente (modello capienza, descrizione header, card calendario, consenso marketing) è controtestato e funziona; preparati 5 nuovi prompt fix + 1 prompt revisore.
- **Cosa resta:** eseguire P1–P5 (agenti) + revisione P1/P2/P3; deploy edge PROD del modello capienza (passo separato, conferma Matteo).
- **Serve una tua azione:** no — il commit/push di questa sessione è già richiesto e fatto; poi dai i prompt agli agenti.

## 1. Controtest batch 1 (Matteo, 18-06)
Matteo ha **controtestato** in dev le modifiche del batch precedente e le ha confermate funzionanti:
- **A — modello capienza:** rimosso «Coperti massimi al giorno»; unico limite = per-fascia (toggle `slot_limit_enabled`) + vincolo orario (`booking_reject_out_of_slot`); badge calendario su somma cap per-fascia; blocco solo pubblico via edge `create-booking` (TEST v21). Vedi [Report modello capienza](Report-limiti-coperti-nuovo-modello-18-06-26.md).
- **C — descrizione header** Personalizza form: ora persiste e appare su /prenota.
- **D — card calendario:** max 5 prenotazioni per cella + «…».
- **E1/E2 — consenso marketing:** checkbox facoltativa in Prenota + privacy policy + colonna consenso (migrazione `053_marketing_consent.sql`) + uso nelle email personalizzate.

Esito controtest: **OK**. Le modifiche sono incluse nel commit di questa sessione (env/test).

## 2. Batch 2 — 5 fix emersi dalla controtest
Documento prompt: [Prompt-fix-batch2-18-06-26.md](Prompt-fix-batch2-18-06-26.md).

| # | Fix | Origine | Revisione |
|---|-----|---------|-----------|
| P1 | Nome fascia precompilato in modifica · toggle capienza anche in Pro · stop falso alert capienza quando fasce off | rifinitura modello A | Accurata |
| P2 | Orario notturno (oltre mezzanotte) rifiutato erroneamente in Prenota | bug orari | Accurata |
| P3 | Picker campagne permette di selezionare clienti SENZA consenso marketing | **regressione/falla E2** | Accurata |
| P4 | Privacy policy: indietro deve chiudere la pagina (no schede duplicate) | bug navigazione | Rapida (io) |
| P5 | Annotare in skill DB il cambio Supabase (GRANT Data API, date 30-05/30-10-2026) | richiesta Matteo | Nessuna (doc) |

## 3. Stima revisione (decisa a monte)
- **Accurata → agente esterno:** P1 (LOCK + modello capienza), P2 (LOCK orari §4b), P3 (consenso/conformità). Prompt revisore unico in fondo al documento.
- **Rapida → prepara-prompt (io):** P4.
- **Nessuna:** P5 (doc).

## 4. Rischi/segnalazioni
- **P3 è una falla di conformità** (consenso marketing aggirabile): priorità alta prima di invii reali.
- **PROD non toccata:** edge modello capienza (`create-booking`) è su TEST v21; il deploy PROD è un passo separato con conferma di Matteo. Nessun prompt del batch 2 deve deployare su `rwuxgvld`.
- **Conflitto storico già gestito:** il modello capienza supera la decisione M2 (memoria `project_due_limiti_coperti`), aggiornata il 18-06.

## 5. Dati comunicazione
- Pattern Matteo: consegna i bug come DOM-path + descrizione del flusso → tradotti in prompt per area, raggruppati per accoppiamento (capienza insieme; orari; consenso; navigazione; doc).
- Conferma del trigger «scrivi documento con prompt… mettilo in sessioni di lavoro… poi report finale e commit+push»: prepara-prompt produce documento prompt + report e committa i `docs` + il codice controtestato.

## 6. Follow-up
Nessun nuovo FU aperto: i fix batch 2 sono in lavorazione attiva (non debiti differiti). Resta tracciato il **deploy edge PROD del modello capienza** come passo separato (conferma Matteo) e il collegamento **FU-EMAIL-8** per opt-out/conformità campagne (toccato da P3).

## 7. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «assicurati di mappare e pianificare bene questi fix. poi prepara prompt per agenti esecutori raggruppando i fix come possibile. ci srò anche agente revisore per i prompt che richiedono revisione dopo il fix.» (seguito dai 8 punti grezzi del primo batch). Poi: «rotella che cambia numeri era gia fixato il problema non c'è piu». Poi: «ho testato e le modifiche funzionano». Infine il prompt di questa sessione con i 7 nuovi punti (DOM-path + descrizione) e: «scrivi documento con prompt in ordine (esecutore e revisore se serve) che darò ad agenti per svolgere le modifiche e i fix. mettilo in sessioni di lavoro, giorno di oggi. poi compila il tuo report finale e fai commit e push delle modifiche. (annota che ho controtestato le modifiche.)»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ho riaperto `git status --short` + `git diff --stat`: il working tree contiene il batch 1 (capienza A: `restaurantSettingRegistry.ts`, `RestaurantSettingsTab.tsx`, `create-booking/index.ts`, `BookingCalendar.tsx`, `AdminBookingForm.tsx`, test + 1 nuovo + 2 eliminati; C/E: `PrivacyPolicyPage.tsx`, `BookingRequestForm.tsx`, `DietaryRestrictionsSection.tsx`, `useBookingRequests.ts`, `types/*`, `053_marketing_consent.sql`) + i miei 3 doc nuovi + SESSION_LOG/FOLLOW_UP. `npm run validate` = **814/814** (valore reale ultima esecuzione). Edge capienza su TEST **v21**, PROD non deployata (dal report A). Questo report non rivendica codice: è prepara-prompt (documento + report), il codice è degli esecutori e controtestato da Matteo.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Per i doc di sessione: creato `Prompt-fix-batch2-18-06-26.md` + `Report-prepara-prompt-fix-batch2-18-06-26.md`, aggiornato `SESSION_LOG.md` (riga 18-06). Allineamenti skill §7.2 del batch 1 già fatti dagli esecutori (`ADMIN_SETTINGS_CONTEXT`, `ADMIN_CLASSIC_SKILL`, `BOOKING_CALENDAR_LAYOUT_CONTEXT`, `FOLLOW_UP`, memoria `project_due_limiti_coperti`). Salvata memoria `reference_supabase_data_api_grants` (cambio Data API) + riga in `MEMORY.md`; la sua annotazione nello skill DB è demandata a P5 (prompt). Nessuna skill di area riformata da me (sono prepara-prompt).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: (1) Non ho eseguito nessuno dei 5 fix batch 2: sono prompt per esecutori. (2) Non ho deployato nulla su PROD (edge capienza resta TEST v21). (3) P5 (annotazione Data API in DB_SKILL/DATABASE) lasciata come prompt invece di scriverla io, per restare in modalità prepara — coperta intanto dalla memoria. (4) La revisione rapida di P4 e la revisione accurata di P1/P2/P3 sono a valle, quando gli esecutori finiranno.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: P3 (consenso aggirabile dal picker) è una falla che la revisione accurata di E2 avrebbe dovuto intercettare prima della controtest di Matteo — segnale che il prompt revisore E2 non ha enfatizzato abbastanza il guard a due livelli (lista + invio). Miglioria già applicata: P3 e il prompt revisore batch 2 chiedono esplicitamente la «difesa a due livelli» sul consenso. Nessun altro attrito rilevante.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto**: leggere `ADMIN_SETTINGS_CONTEXT` + il report A del 18-06 ha dato i nomi reali delle chiavi (`slot_guest_capacities`, `slot_limit_enabled`, `booking_reject_out_of_slot`, `useCapacityCheck`), evitando prompt vaghi. Hook: i reminder TodoWrite erano rumore (task lineare). L'hook `stop` fine-sessione è stato **utile**: ha intercettato la sezione Domande di chiusura mancante in questo report prima del commit.
