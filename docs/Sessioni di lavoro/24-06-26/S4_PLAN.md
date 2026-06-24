# S4 — PLAN di costruzione (2 orchestratori in parallelo)

> **Cantiere:** S4 — Motore turni automatici / finestre di occupazione (Pro). Masterplan
> `docs/MASTERPLAN_SERVIZIO.md` §7 (S4) + §3 (decisioni D44–D52). Intervista di sezione ✅ FATTA 24-06-26.
> **Questo file è la regia del build.** Due orchestratori (Opus) lavorano **in parallelo** su due tracce
> file-disgiunte; ciascuno lancia subagent esecutori (**Haiku quando basta, Sonnet al massimo**) e fa lui
> la **revisione** a checkpoint e a fine traccia.
>
> **Nessun freno GTM** (masterplan §9, nota 24-06-26): il vincolo "10-15 clienti Classic" era parere esterno,
> non adottato. S4 parte ora.

---

## 0. Perché due tracce e come NON si pestano i piedi

La divisione è pensata per essere **quasi totalmente file-disgiunta**, così i due orchestratori non
collidono su git né sugli stessi file.

- **Traccia A — "Strutturale / CRUD"** (basso rischio, prevalentemente Haiku): le tre decisioni che rendono
  i pezzi esistenti coerenti col nuovo modello, **senza toccare il motore**: forma default (D44),
  eliminazione sala morbida (D50), join briefing (D52). Nessun Edge, nessun resolver.
- **Traccia B — "Motore disponibilità"** (alto rischio, prevalentemente Sonnet): il predicato modalità-tavoli
  + capienza (D49/D46), walk-in coerente (D45), checkout append-only + stati tavolo (D48/D24/D23), e il
  cuore — finestre di occupazione / turni automatici / Edge (D37/D22/Q19/D39/D25/D40).

### Regole anti-collisione (vincolanti per entrambi)

1. **Branch separati** da `env/test`: Traccia A → `s4/track-a-strutturale`; Traccia B → `s4/track-b-motore`.
   Nessuno lavora direttamente su `env/test`. Integrazione finale = sezione §6.
2. **Proprietà esclusiva dei file** (tabella sotto): un file ha **un solo proprietario**. Se una traccia ha
   bisogno di leggere un file dell'altra, lo **legge soltanto**, non lo modifica.
3. **Numeri di migrazione riservati** (per evitare collisione `063` doppia): Traccia A usa **063**;
   Traccia B usa **064–069**. Mai sconfinare.
4. **Solo TEST** (`docnnernvp`). Ogni `apply_migration`/deploy Edge → `get_project_url` prima; se `rwuxgvld`
   (PROD) **STOP e conferma Matteo**. `supabase db push` vietato. Il rollout PROD è un passo separato a fine
   integrazione, con ok esplicito di Matteo (edge + client insieme, come S3).
5. **Nessun commit su `main`**, nessun `release:prenotazen` durante le tracce.

### Tabella proprietà file

| File / area | Proprietario | L'altra traccia |
|---|---|---|
| `useServizioTables.ts`, `TableFormModal.tsx` | **A** (D44) | — |
| `useRooms.ts`, `RoomConfigModal.tsx`, `RoomTabs.tsx` | **A** (D50) | — |
| `useShiftBriefing.ts`, `ShiftBriefingModal.tsx` | **A** (D52) | — |
| migrazione **063** (`rooms.active`) | **A** | — |
| `useTableAssignments.ts`, `tableCheckout.ts` | **B** (D48/D24) | A non tocca |
| `useTableStatuses.ts` (NUOVO), `TableShape.tsx` | **B** (D24/D23) | — |
| `useTableMode.ts` (NUOVO), `AssignmentMapPanel.tsx`, `ServizioPage.tsx` | **B** (D49) | A non tocca ServizioPage |
| `WalkInModal.tsx`, `useWalkInMutation` (walk-in) | **B** (D45) | — |
| `useCapacityCheck.ts` + resolver occupazione (NUOVO lib) | **B** (D46/D40) | — |
| Edge `create-booking` | **B** | A non tocca |
| migrazioni **064–069** | **B** | — |

> **Unico contatto indiretto:** la Traccia A (D50) deve sapere se una sala è "viva" → **legge** in sola
> lettura le assegnazioni attive (`booking_table_assignments` con `checked_out_at IS NULL`). Non dipende dal
> predicato modalità-tavoli di B. Resta parallela.

---

## 1. Workflow dei due orchestratori (identico per A e B)

Ogni orchestratore è **Opus** e per ogni work-package (WP):

1. **Carica contesto**: questo plan (la sua traccia), masterplan §3 (decisioni D…), skill d'area
   (`docs/APP_CONTEXT_SKILL.md` §0 → Admin/Servizio), `ADMIN_SERVIZIO_CONTEXT.md` (§9 = decisioni S4),
   `MANUALE_BLINDATURA.md`, `.claude/CLAUDE.md` (vocabolario + sicurezza PROD).
2. **Prepara il prompt esecutore** con la skill **"prepara prompt"**: confeziona un prompt chirurgico per il
   subagent (scope, file, decisione di riferimento, test attesi, cosa NON toccare).
3. **Lancia il subagent esecutore**: **Haiku** se il WP è meccanico (CRUD, default, join, rename); **Sonnet**
   se c'è logica non banale (resolver, stati, Edge, race). Mai oltre Sonnet.
4. **Revisione orchestratore**: a ogni WP l'orchestratore rilegge il diff (correttezza + aderenza alla
   decisione + `npm run validate`). Ai **checkpoint** (vedi ogni traccia) fa una **revisione completa**
   (consigliato anche `/code-review` sul diff di traccia) prima di proseguire.
5. **Doc**: a fine traccia aggiorna `ADMIN_SERVIZIO_CONTEXT.md` (sposta le voci §9 da "design" a
   "implementato") e la tabella stato del masterplan §7.

**Gate di blindatura** (Manuale): ogni traccia, prima di dirsi "fatta", supera test di copertura + controtest
"rompi" sui 4 fronti + QA responsive + doc allineata. Le parti che toccano aree blindate (M3/M4/M0) → suite
relative verdi.

### ⚙️ Mandato di autonomia (vincolante per entrambi gli orchestratori)

> **L'intervista è fatta: il lavoro va CHIUSO, non lasciato a metà.**

- Ciascun orchestratore **lavora fino a completare TUTTA la propria traccia** (tutti i WP) **e** ad averla
  **auto-revisionata** (validate verde + revisione orchestratore + controtest). Non si ferma a metà per
  chiedere conferme.
- **Se trova bug/fix lungo la strada, li fa e prosegue** — non apre ticket, non aspetta: corregge e va avanti.
- **Non chiede autorizzazioni a Matteo** per decisioni interne alla traccia (scelte implementative, fix,
  migrazioni su TEST, deploy Edge su TEST, ordine dei WP): procede in autonomia.
- I **checkpoint** restano punti di **revisione**, non di **attesa**: l'orchestratore rivede, corregge se
  serve, e continua da solo fino in fondo.
- **UNICO muro invalicabile = `main` e PROD.** Gli agenti **NON** fanno: merge/commit su `main`, scritture su
  PROD (`rwuxgvld` — migrazioni, deploy Edge), `release:prenotazen`. Lì si fermano: testa Matteo prima.
  Tutto il resto (su branch di traccia + TEST `docnnernvp`) è autorizzato in anticipo.

---

## 2. TRACCIA A — Coerenza strutturale *(Orchestratore 1)*

Branch `s4/track-a-strutturale`. Tre WP indipendenti, eseguibili anche in sequenza Haiku. **Checkpoint unico**
a fine traccia (revisione completa + validate + blindatura della superficie toccata).

### WP-A1 — Forma tavolo default = quadrato (D44)
- **Cosa:** alla creazione tavolo la forma di default diventa `square` (oggi è `round`). **Nessun selettore
  UI.** Il codice 3 forme (`TableShape`) resta intatto.
- **File:** `useServizioTables.ts` (default `shape`), eventuale punto di insert in `TableFormModal.tsx`.
- **Test:** un nuovo tavolo nasce `square`; i tavoli esistenti non cambiano; `TableShape` disegna ancora
  tutte e 3 le forme.
- **Modello:** Haiku. **Rischio:** minimo.

### WP-A2 — Eliminazione sala morbida + cancello-conferma (D50)
- **Cosa:** `useDeleteRoom` passa da DELETE fisico a **soft-delete** (`rooms.active=false`); le query sale
  filtrano `active=true`. Se la sala è **viva** (ha tavoli con prenotazioni assegnate/sessioni aperte) →
  **modale di conferma esplicita** con impatto quantificato ("N prenotazioni torneranno da assegnare…").
  Alla conferma: la sala si archivia e le prenotazioni assegnate ai suoi tavoli **rientrano nel cassetto
  "da assegnare"** (mai cancellate). Sala "scarica" → archiviazione diretta senza frizione.
- **Migrazione 063:** `ALTER TABLE rooms ADD COLUMN active boolean NOT NULL DEFAULT true;` (RLS già presente
  su `rooms`; nessun nuovo GRANT necessario — è alter di tabella esistente, ma **verifica advisor** dopo).
  Applicare **solo TEST**. Rigenerare `database.ts`.
- **File:** `useRooms.ts`, `RoomConfigModal.tsx`/`RoomTabs.tsx` (UI conferma), nuovo modale conferma.
- **Test:** sala scarica → archiviata silenziosa; sala viva → conferma obbligatoria + prenotazioni nel
  cassetto; sala archiviata sparisce dall'operativo ma lo storico resta agganciato (no orfani).
- **Modello:** Sonnet (c'è la logica "sala viva" + spostamento prenotazioni). **Rischio:** medio (migrazione +
  query sale toccate ovunque le sale si elencano → controtest pagina Servizio).

### WP-A3 — Briefing: join tavolo + sala condizionale (D52)
- **Cosa:** implementa il join con `tables` in `useShiftBriefing` (oggi `table_name`/`room_name` sono `null`,
  TODO riga ~85). Il briefing mostra **"T12"** se il locale ha una sola sala, **"Sala Giardino · T12"** se
  più d'una. Prenotazioni non assegnate → resta "—".
- **File:** `useShiftBriefing.ts`, `ShiftBriefingModal.tsx`.
- **Test:** mono-sala mostra solo tavolo; multi-sala mostra sala+tavolo; non assegnata = "—".
- **Modello:** Haiku/Sonnet. **Rischio:** basso.

**Checkpoint A (fine traccia):** `npm run validate` verde; revisione completa orchestratore + `/code-review`;
QA responsive su pagina Servizio + briefing; aggiorna doc (§9 ADMIN_SERVIZIO_CONTEXT → "implementato A").

---

## 3. TRACCIA B — Motore disponibilità *(Orchestratore 2)*

Branch `s4/track-b-motore`. WP in **sequenza** (ognuno poggia sul precedente). **Due checkpoint**: dopo B1
(spina dorsale) e dopo B4 (motore). Qui sta il grosso del rischio: Edge, race condition, doppia verità.

### WP-B1 — Predicato "modalità-tavoli" + capienza (D49 + D46) — *SPINA DORSALE*
- **Cosa:** crea **`useTableMode()`** = `(edizione Pro) E (≥1 tavolo attivo configurato)` — **unica** fonte di
  verità, riusata da pannello/walk-in/capienza. Metti il **guard** su `AssignmentMapPanel` (oggi senza
  guard, debito D10) e lo **stato-vuoto invitante** per Pro-senza-tavoli in `ServizioPage`. Implementa
  **capienza sala = somma dei coperti dei tavoli** (D46) in `useCapacityCheck` (modalità-tavoli) mantenendo
  il cap per-fascia come Livello 1 quando non ci sono tavoli (D1).
- **File:** NUOVO `useTableMode.ts`, `AssignmentMapPanel.tsx`, `ServizioPage.tsx`, `useCapacityCheck.ts`.
- **Test:** Classic → niente motore tavoli; Pro-no-tavoli → stato-vuoto, calcolo per-fascia; Pro-con-tavoli →
  pannello visibile, capienza = somma coperti.
- **Modello:** Sonnet. **Rischio:** medio-alto (è il contratto su cui poggia tutto B).
- **Checkpoint B1:** revisione completa + validate prima di procedere — il predicato non si rimette in
  discussione dopo.

### WP-B2 — Walk-in coerente (D45)
- **Cosa:** il walk-in **conta sempre** nella capienza complessiva (anche "solo coperti" senza tavoli);
  **fix bug** confronto `placement` (nome) vs `table_id` (#6); durata walk-in passa dal risolutore S2 (il
  *default* da console è FU-SERV-ADMIN-PANEL-1, qui solo l'aggancio al resolver); walk-in = staff → limiti
  **morbidi/forzabili con avviso** (D25), mai blocco.
- **File:** `WalkInModal.tsx`, `useWalkInMutation` (walk-in), consuma `useTableMode`/`useCapacityCheck`.
- **Test:** walk-in solo-coperti toglie posti al pubblico; walk-in su tavolo occupa il tavolo; bug
  nome-vs-id chiuso; fascia "piena" → staff forza con avviso.
- **Modello:** Sonnet. **Rischio:** medio (capienza pubblica → controtest Prenota/Edge).

### WP-B3 — Checkout append-only + stati tavolo (D48 + D24 + D23)
- **Cosa:** checkout **sempre timbro** `checked_out_at`, **rimuovi il DELETE fisico** (`tableCheckout.ts` /
  `useCheckoutTable`). Implementa **`useTableStatuses`** con i 5 stati (libero / in arrivo / occupato / in
  uscita / in ritardo, D24) e colora `TableShape` (oggi sempre verde). **Ritardo configurabile** (D23):
  dopo X min "in ritardo", nessuna liberazione cieca.
- **File:** `useTableAssignments.ts` (mutation checkout), `tableCheckout.ts`, NUOVO `useTableStatuses.ts`,
  `TableShape.tsx`.
- **Test:** checkout non cancella mai la riga; tavolo libero a fine durata = "in uscita" non "libero";
  ritardo dopo soglia; no-show/cancel libera la finestra.
- **Modello:** Sonnet. **Rischio:** medio-alto (stati = cuore visivo della Live futura).

### WP-B4 — Finestre di occupazione / turni automatici (D37/D22/Q19/D39/D25/D40)
- **Cosa:** genera le **finestre di occupazione** = arrivo + durata + `turnover_buffer_minutes` (già in DB da
  S2/mig.057); disponibilità **auto a fine durata** (D22, indipendente dal checkout fisico); **auto-turno
  dinamico** (`turn_number`, Q19); **multi-tavolo per prenotazione** (D39, il `UNIQUE` già lo permette);
  "**prossimo orario libero**"; **overbooking forzabile** dall'admin con avviso (D25). **Resolver
  server-side** condiviso nell'**Edge `create-booking`** che somma l'occupazione **solo** sugli stati che
  bloccano (D43) e protegge la **race condition** con lock logico tenant+data+fascia (D40) → **test di
  concorrenza obbligatorio**.
- **Migrazioni 064–069** (riservate): eventuali colonne snapshot occupazione mancanti
  (`occupancy_start/end`, `duration_rule_version` se non già da S2), campi `forced_by_admin/force_reason`,
  predisposizione `table_session` (D39) **solo schema**. Ogni nuova tabella → **GRANT + RLS** espliciti
  (regola Data API 30-05-26). Solo TEST.
- **File:** NUOVO lib resolver occupazione, `useCapacityCheck.ts` (estensione), Edge `create-booking`,
  aggancio capacity al Calendario.
- **Test:** finestra = arrivo+durata+buffer; tavolo si libera a fine durata; multi-tavolo non impedito;
  forza+traccia; **due richieste sull'ultimo slot** (concorrenza) → una sola passa; ricalcolo su cambio
  data/orario/ospiti; timezone/overnight/DST.
- **Modello:** Sonnet. **Rischio:** ALTO (Edge in produzione, doppia verità, concorrenza). Riproduci su TEST
  prima/dopo come per il fix S0.
- **Checkpoint B4 (fine traccia):** revisione completa + `/code-review`; controtest "rompi" 4 fronti; smoke
  Edge TEST; aggiorna doc.

---

## 4. Modelli in sintesi

| Ruolo | Modello |
|---|---|
| Orchestratore 1 (Traccia A) | **Opus** |
| Orchestratore 2 (Traccia B) | **Opus** |
| Esecutori meccanici (A1, A3, parti B) | **Haiku** |
| Esecutori con logica (A2, B1–B4) | **Sonnet** (mai oltre) |
| Revisione | i due orchestratori (Opus) + `/code-review` ai checkpoint |

---

## 5. Sicurezza PROD & blindatura (richiamo)

- Ogni scrittura DB/Edge via MCP → `get_project_url` prima. `docnnernvp`=TEST ok; `rwuxgvld`=PROD → **STOP**.
- Migrazioni applicate **solo a TEST** durante le tracce; numeri riservati (A:063, B:064–069); rigenerare
  `database.ts` dopo ogni migrazione; nuove tabelle = GRANT+RLS.
- Nessun `db push`, nessun deploy PROD, nessun `release:prenotazen` nelle tracce.
- Blindatura per traccia (Manuale): copertura + controtest 4 fronti + QA responsive + doc.

---

## 6. Integrazione finale (dopo che A e B sono verdi) — passo separato, con Matteo

1. Merge `s4/track-a-strutturale` → `env/test` (più piccolo, prima).
2. Rebase/merge `s4/track-b-motore` → `env/test`; risolvi gli **unici contatti previsti** (import in file
   condivisi, ordine migrazioni 063→069). `npm run validate` verde sull'integrato.
3. **Blindatura congiunta** sulla pagina Servizio completa (lista A→D archetipi del masterplan §11).
4. **Rollout PROD** (solo con ok esplicito di Matteo): migrazioni 063→069 su `rwuxgvld`, Edge
   `create-booking` nuova versione, e client insieme (mai edge-nuova/client-vecchio) — stessa procedura S3.
5. Report finale + aggiornamento masterplan §7 (S4 → ✅) e `S0_ORCHESTRATOR_HANDOFF` / nuovo handoff S4.

---

*Creato 24-06-26 dopo l'intervista di sezione S4 (D44–D52). Regia del build, due tracce parallele.*
