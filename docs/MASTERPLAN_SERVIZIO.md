# Masterplan — Pagina Servizio + motore di disponibilità (mappa · sviluppa · blinda)

> **Indice canonico.** Gemello di `docs/MASTERPLAN_BLINDATURA.md` (M5 = Servizio). Da qui gli agenti
> derivano i plan ad-hoc per ogni sotto-area (S0–S6). Questo file **governa, non implementa**.
>
> **Stato:** ⬜ in apertura cantiere (21-06-26). Pagina Servizio = Pro, **NON in main** (Classic).
> **Fonti:** ragionamento senior con Matteo 21-06-26 (D1–D42) + due review esterne in
> `docs/Sessioni di lavoro/21-06-26/` (`parere_esterno_masterplan_servizio.md` tecnico/QA;
> `parere_esterno_review_masterplan_servizio_gtm.md` prodotto/vendita).

---

## 1. Context — perché questo cantiere

Apriamo insieme due cose: la **pagina Servizio** (sidebar Pro: sale, tavoli, fasce, assegnazioni,
walk-in, briefing) e un **nuovo motore di disponibilità** basato su *fasce + intervalli di arrivo +
permanenza/durata + turni automatici*. È la fase più delicata del progetto perché la disponibilità non
vive in una pagina sola: tocca **Prenota (pubblico, Classic, in produzione)**, **Edge `create-booking`
(in produzione)**, **Calendario**, **Menu/QR** e **Servizio (Pro)**.

L'esplorazione del codice (read-only, 21-06-26) distingue due cose che la riflessione iniziale fondeva:

- **(a)** la **pagina Servizio esiste già** come codice feature-complete ma **mai intervistata né
  blindata**, ed è Pro-gated;
- **(b)** il **motore permanenza/durata/intervalli/turni-automatici NON esiste** ed è un'aggiunta
  architetturale che sfonda il confine Classic/Pro.

Per ogni pezzo il masterplan marca: **cosa già funziona (riuso) · cosa va riscritto/strutturato · cosa
può rompersi.**

### Disciplina commerciale (dalla review GTM — vincolo trasversale)
A Classic 29€ (14,50€ fondatori) ogni ora di configurazione manuale brucia margine. Regola guida:

> **Costruire il motore come architettura, ma vendere un prodotto semplice.**

Il motore avanzato (durate, buffer, soglie, cap…) vive **sotto il cofano**, dietro **preset/default**;
ciò che il ristoratore vede deve essere banale. Le manopole pericolose o rare vanno in una **console
privata di Matteo** (super-admin), non nella UI del cliente. La classificazione completa di ogni
manopola (onboarding self-service / preset / console privata / non-MVP) è una **sessione dedicata
successiva** (vedi `FU-SERV-ADMIN-PANEL-1`). Disciplina anti-scope: prima validare Classic semplice,
poi costruire Pro sui problemi reali; mai promettere "gestione sala perfetta/POS" (terreno di TheFork
Manager/POS) — la guerra è *zero commissioni, dati tuoi, prezzo fisso, te lo configuro io*.

### Deliverable di questa fase (solo documentazione)
1. **Nuovo:** questo file (`docs/MASTERPLAN_SERVIZIO.md`).
2. **Modifica:** `docs/MASTERPLAN_BLINDATURA.md` (M5 Servizio → rimando qui).
3. **Modifica:** `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` §6 (bug Edge `override_date`).
   *(Nessun codice modificato: il masterplan governa, non implementa.)*

---

## 2. Invarianti di prodotto (fissate con Matteo)

1. **Modello target = progressivo a livelli.** Fasce + intervalli arrivo + permanenza + gerarchia
   durata + turni automatici = architettura finale, costruita per gradini sopra ciò che esiste.
   **Turni manuali fissi = opzione futura**, non la base.
2. **Casa della config durata = Settings → Personalizza Form → "Tipologia prenotazione"** (Classic, già
   blindata M4). La *config* (durata) sta in Settings; il *calcolo* (occupazione tavoli) in Servizio/Edge.
3. **Gerarchia durata (dal più forte):**
   1. Override manuale admin sulla singola prenotazione → assoluto.
   2. Durata della **card** scelta dal cliente → **sostituisce** la tipologia, anche se più CORTA (D35).
   3. Durata della **tipologia** (Settings) → default base, usato solo se la card non ha durata.
   4. **Minimo fascia** come *pavimento*: `durata = MAX(durata_del_livello_scelto, minimo_fascia, default_ristorante)`.
      La tipologia **non** entra nel `MAX` (altrimenti la card non potrebbe accorciare). Il "non si
      accorcia mai" vale rispetto al **pavimento-fascia**, non alla tipologia.
4. **Una sola card per prenotazione — già così nel codice**
   (`src/features/booking/components/publicBooking/BookingSubTabCards.tsx:132` — `onChange(isActive ? null : tab)`,
   selezione singola con toggle). Il compose multi-categoria (FIX-9) avviene DENTRO la card "personalizzata"
   (`is_fixed_menu:false`) con **durata fissa di card**. Manca solo agganciare la durata.
5. **Default libero = permanenza auto-attivata.** Senza alcuna durata configurata il sistema resta al
   "cap per-fascia morbido" odierno (L1). La permanenza si accende da sola quando esiste una durata →
   retrocompatibile, nessuna regressione.
6. **Confine Classic/Pro per sotto-area** lo decide l'intervista-di-sezione, bussola: *config durata +
   intervalli arrivo → Classic (Settings/Prenota/Edge); motore tavoli/turni-automatici/live → Pro*.

---

## 3. Decisioni fissate (D1–D42)

### Disponibilità e gerarchia
- **D1 — Doppia verità = automatica.** Se esistono tavoli definiti comanda il calcolo per-tavolo,
  altrimenti il tetto per-fascia. Nessun interruttore base; toggle "avanzato" solo in futuro → vedi D38.
- **D2 — Calcolo che blocca = server.** Edge `create-booking` = fonte di verità, client = specchio
  (stesso posto di `SLOT_LIMIT`/`OUT_OF_SLOT`). Costo: deploy controllato in produzione.
- **D3 — Config in MASSIMO 2 luoghi (vincolo IA, non negoziabile):** (1) **Impostazioni → Personalizza
  Form** (tipologie, durate, campi) + Anagrafica; (2) **Servizio → Fasce orarie** (coperti, durata
  minima fascia, override) + Tavoli. Le fasce compaiono anche in Classic, ma lì niente
  assegnazione prenotazione→tavolo né menu→tavolo (solo Pro). Vietato un terzo pannello.

### Tipologie, card, durata
- **D11 — Tipologie = set fisso piccolo (enum `BookingType`) + durata configurabile;** card
  personalizzate restano creabili (`CustomStaffPreset`) con durata override opzionale.
- **D12 — Il cliente sceglie solo la CARD; tipologia+durata stanno dietro** (lato admin). Nessun nuovo
  selettore pubblico → niente nuova UI nel form pubblico.
- **D13 — Input durata = valori pronti 90/120/150/180 + "altro"**, con min/max di sicurezza.
- **D14 — Durata congelata sulla prenotazione** (snapshot, come `menu_selection`).
- **D15 — Storico esistente intatto.** Il motore vale dalle nuove prenotazioni; i `confirmed_start/end`
  manuali già presenti non si ricalcolano.
- **D17 — Inserimento admin: durata pre-compilata dal calcolo, override libero.**
- **D35 — La card scelta dal cliente VINCE sempre sulla tipologia, anche se più corta (e anche se più
  lunga).** Regola deterministica (confermata Matteo 22-06-26): `durata_livello_scelto = durata_card`
  **se la card ha una durata**; **altrimenti** `durata_tipologia` (se impostata); **altrimenti** default
  ristorante. Pavimento unico = minimo-fascia. *Esempio:* tipologia "Tavolo" 90 min + card "Cena" 120 min
  → l'app usa **120**. Card senza durata + tipologia "Tavolo" 90 → usa **90**.
  > ⚠️ **Divergenza voluta dalle due review** (che raccomandavano `MAX` con la tipologia dentro, "la card
  > non accorcia mai"): respinta consapevolmente da Matteo — la card è l'esperienza concreta scelta dal
  > cliente e deve comandare. L'avviso "card < tipologia" [Q8] **non è un blocco**: la regola è chiara e
  > intenzionale (la card senza durata già ricade sulla tipologia). Resta opzione futura un avviso morbido
  > informativo, non un gate.

### Intervalli di arrivo e finestre
- **D16 — Arrivo tardivo: blocco a monte CON avviso + toggle admin + pavimento 45 min.** Due tempi:
  **permanenza** (tieni il tavolo, può sforare la chiusura sala se l'admin lo permette) vs **finestra di
  ordinazione** (ordina entro la chiusura servizio). Tre soglie di "ultimo arrivo": permanenza piena
  `fine_fascia − durata`; tardivo-con-avviso fino a `fine_fascia − tempo_minimo_ordine` (toggle ON);
  sotto il tempo minimo → **bloccato sempre**. Tempo minimo per ordinare = default 45 min, configurabile.
- **D18 — Step arrivo per-fascia con default unico** (es. 30 min), modificabile sulla singola fascia
  (Pranzo 15 / Cena 30). Vive in Servizio → Fasce. Fondamenta dei turni automatici.
- **D19 — Orari di arrivo pieni = nascosti** (il cliente vede solo i disponibili).
- **D20 — Cut-off anticipo minimo = sì, configurabile** (default sensato, es. 60 min).
- **D21 — Pacing = solo predisposizione dati, non MVP.**

### Motore tavoli, turni, stati
- **D22 — Checkout = disponibilità automatica + stato fisico manuale.** Per i CALCOLI il tavolo si
  libera da solo a fine durata (la disponibilità non si inchioda mai); nella Live passa a "in uscita" e
  lo staff conferma/proroga a mano. Si separa la *matematica* (finestre programmate) dalla *realtà fisica*.
- **D23 — Ritardo/no-show = segnala, staff decide.** Dopo X min (configurabile) lampeggia "in ritardo";
  nessuna liberazione automatica cieca. Il no-show confermato libera la finestra.
- **D24 — Stati tavolo = set ricco:** libero / in arrivo / occupato / in uscita / in ritardo.
- **D25 — Overbooking = admin può forzare con avviso** (i limiti restano duri solo verso il pubblico).
- **D37 — Buffer di pulizia/turnover = sì, configurabile.** `turnover_buffer_minutes`: occupazione reale
  = arrivo + durata + buffer. Default **0 Classic** / **10 Pro con tavoli**, modificabile in Servizio.
- **D38 — Cap-fascia operativo coesiste con i tavoli = opzione avanzata.** Default invariato (D1: con
  tavoli comandano i tavoli); in più toggle "mantieni anche limite coperti fascia" (caso reale: 80 posti
  ma accetto max 60 per staff scarso). **Riusa lo scoping esistente** `OverrideScope`
  forever/today/week/month/custom + "vince il più specifico" (`useServiceSlotOverrides.ts:38,101`).
- **D39 — Una prenotazione può occupare PIÙ tavoli (DB non vincola a 1).** Tavolata da 10 = due tavoli
  da 5. `booking_table_assignments` (join) regge già più righe; UI MVP può assegnare 1 tavolo, ma
  l'architettura/`table_session` non deve imporre 1-tavolo-per-prenotazione.
- **D41 — `max_turns` non è la base del nuovo motore come *contatore turni*** — il motore si basa su
  `arrival_step` + `duration` + `turnover_buffer` + finestre di occupazione. ⚠️ **MA `max_turns` NON è
  morto:** oggi `max_turns = 0` = **servizio chiuso** ([`isServiceSlotClosed()`](../src/features/booking/hooks/useServiceSlots.ts),
  con `max_turns_resume` per riaprire, mig. 023). Il nuovo motore deve **ignorarlo come contatore turni ma
  preservare la semantica `0 = chiuso`** (o migrarla a un flag esplicito in S0/S4) — altrimenti si regredisce
  il pulsante "chiudi servizio".
- **Q19 confermato** — turno = **sequenza dinamica di occupazioni** del tavolo (`turn_number`), non
  turni fissi (quelli = S5 futuro). **Q17** — mostrare al cliente "tavolo disponibile fino alle ~X"
  **solo se la permanenza è attiva**.

### Live, conto, ordine da QR
- **D4 — Tab Live include l'aggiunta prodotti dal vivo** (conto del tavolo modificabile, anche walk-in).
  Resta "conto leggero" interno, non POS.
- **D5 — Ordine-da-QR cliente = sotto-area separata e successiva (S6).** L'MVP della Live nasce con
  **solo staff**.
- **D6 — Identità tavolo (in S6) = numero digitato dal cliente come INDIZIO + conferma staff.**
- **D7 — Ordine staff da mobile = diretto al conto** come riga "confermata".
- **D26 — Conto per sessione/turno, non per tavolo.** Al turno 2 (nuovo gruppo, stesso tavolo) parte un
  conto nuovo. Predisporre `table_session` (D39).
- **D27 — Righe conto: storno con motivo, mai cancellazione fisica** (append-only + autore + ora).
- **D28 — Confine POS = minimo:** consumo + flag pagato/non-pagato. Niente metodi pagamento, sconti per
  riga, conto diviso, scontrino.
- **D29 — Aggiornamento Live = refetch a ogni azione + ricarica periodica (MVP).** Niente Realtime ora.
- **D31 — Cambio tavolo: il conto segue il gruppo/sessione.**
- **D32 — Conto→Analytics: salva ora i dati, collega ai grafici dopo.**
- **D33 — Vista cucina (KDS) = milestone separata futura, FUORI da questo masterplan;** ma si progetta
  il conto/ordini **predisposto** (righe con item, quantità, stato, ora, eventuale portata).

### Edition, copy, fondamenta, robustezza
- **D30 — Edition:** L2 (permanenza/stima sovrapposizioni, senza tavoli) **incluso in Classic**; tavoli +
  mappa + console Live + conto (L3/L4) restano **Pro/Servizio**.
- **D34 — Copy cliente sulla durata = tono caldo, conferma "alla pari", niente gergo.** Es.: *"Il tuo
  tavolo è disponibile e la chiusura del servizio è alle 22:00 — per noi va bene così, per te?"*. Mai
  "permanenza"/"durata 120 min". ⚠️ **Le frasi esatte si concordano con Matteo al momento della
  scrittura** (qui solo esempi di tono).
- **D8 — Fix bug Edge `override_date` = subito, intervento isolato** (mini-PR, deploy PROD controllato),
  prima di S1+. ⚠️ **Non è un semplice rename di colonna:** la query Edge usa `.eq("override_date", …)` +
  `.maybeSingle()`, ma per scope `week/month/custom` più righe possono coprire la stessa data → il fix deve
  filtrare `date_from <= desired_date <= date_to` **e replicare la regola "vince il più specifico"** di
  [`resolveSlotOverride()`](../src/features/booking/hooks/useServiceSlotOverrides.ts) (oggi solo client-side),
  non prendere una riga a caso. È il primo seme del resolver server-side condiviso.
- **D9 — S0 = blindatura ATTIVA:** mentre si mappa si demoliscono rottami e si pongono basi solide.
- **D10 — Debiti tavoli in S4** (`useTableStatuses`, walk-in placement/id, guard `features.tableAssignments`).
- **D36 — Prenotazioni pending NON bloccano i posti, solo avviso.** `accepted/confirmed` consumano
  capienza dura; `pending` no, ma se troppe sulla stessa fascia → avviso admin.
- **D40 — Race condition = protezione server-side nell'Edge** (transazione/lock logico
  tenant+data+fascia); il client è solo preview. Test di concorrenza obbligatorio.
- **D42 — Config incompleta = degrado al livello precedente + diagnostica admin.** Se mancano pezzi il
  sistema NON si rompe: scende di livello e mostra un banner. **Codici Edge specifici** da predisporre:
  `DURATION_EXCEEDS_SLOT`, `CUTOFF_EXPIRED`, `NO_TABLE_AVAILABLE`, `CAPACITY_EXCEEDED`,
  `INVALID_ARRIVAL_STEP`, `CONFIG_INCOMPLETE`, `SPECIAL_REQUEST_REQUIRED` (oltre a `OUT_OF_SLOT`/`SLOT_LIMIT`).

### Stati che bloccano capacità (D43 — pre-requisito di S4-LIVE)
Elenco unico e canonico di **cosa consuma capienza dura** (durante il calcolo Edge e nella Live). Allineato
al comportamento Edge attuale ([create-booking/index.ts:362-370](../supabase/functions/create-booking/index.ts):
oggi conta solo `status='accepted'` con `no_show != true`).

**BLOCCANO la capienza dura** (occupano coperti/tavolo nelle finestre):
- `accepted` / `confirmed`;
- (futuri stati Live) `seated` / `in_service` — quando S4-LIVE li introdurrà;
- assegnazione manuale/`manually_blocked` (tavolo bloccato a mano dall'admin);
- override admin forzato (D25): blocca **e** registra `forced_by_admin` + motivo.

**NON bloccano la capienza dura** (al massimo generano avviso/pressione visiva — D36):
- `pending` (richiesta non ancora accettata) → **solo avviso** se troppe sulla stessa fascia;
- `rejected` / `cancelled`;
- `no_show` **dopo conferma admin** → libera la finestra (già così oggi: `.neq("no_show", true)`);
- `archived` / `concluso`;
- eventuale `waitlisted` (predisposizione S3, vedi §6) → mai capienza dura.

**Regola di blindatura:** ogni nuovo stato introdotto da S4/S4-LIVE deve essere classificato qui PRIMA di
essere scritto nel resolver. Il resolver server-side (D2/D40) è l'unico autorizzato a sommare l'occupazione,
e somma **solo** gli stati di questo elenco.

### Da verificare in apertura S3 (non blocca il masterplan)
- **Ordine form pubblico — VERIFICATO (21-06-26): l'ordine è già corretto.** In
  [BookingRequestForm.tsx](../src/features/booking/components/BookingRequestForm.tsx) il render è
  `BookingModeCards` (riga ~1198) → `BookingSubTabCards` (riga ~1235) → `BookingFormFields` (riga ~1365,
  che contiene i picker data/ora): **la card precede già l'orario**. Il lavoro reale di S3 NON è
  riordinare, ma: (1) **sostituire il `TimeInput` libero** (oggi qualsiasi orario, validato solo contro
  passato/orari attività) con **slot derivati dalla durata della card**; (2) **rimuovere il default
  pre-compilato** dell'orario (`getDefaultTime`, riga ~289) che oggi salterebbe la ri-derivazione.

---

## 4. Mappa "cosa c'è" (stato reale verificato nel codice)

### ✅ Esiste e si riusa
| Pezzo | Dove | Note riuso |
|---|---|---|
| Fasce orarie | `service_slots` (mig. 010): `start/end_time`, `max_guests`, `max_turns`, `display_order` | Base OK. Aggiungere `min_duration` come colonna nuova. |
| Override fascia per periodo | `service_slot_overrides` (mig. 022) + `resolveSlotOverride()` (`useServiceSlotOverrides.ts:101`) | "Vince il più specifico" già implementato **ma solo client-side**; scope forever/today/week/month/custom (`:38`). Da portare server-side nell'Edge (D8). |
| Tavoli + sale | `tables` (mig. 007), `rooms` | Capienza, posizione, soft-delete `active=false`. |
| Assegnazione + turni | `booking_table_assignments` (mig. 011): `turn_number`, `UNIQUE(table_id, service_slot_id, date, turn_number)` | Scheletro "turni" + multi-tavolo (join) già presente: il `UNIQUE` **non** include `booking_id` → una prenotazione può occupare più tavoli (D39). |
| Pagina Servizio (UI) | `src/pages/ServizioPage.tsx` + `src/features/booking/components/servizio/*` | Lista/Mappa, drag-drop, walk-in, briefing — completi. |
| Cap per-fascia (morbido) | `useCapacityCheck.ts` (cascata override→slot→legacy JSONB) | Resta come **Livello 1**. |
| Hook CRUD | `useServiceSlots`, `useServizioTables`, `useRooms`, `useTableAssignments`, `useServiceSlotOverrides` | Riuso diretto. |
| Edge codici | `create-booking/index.ts` → `OUT_OF_SLOT`, `SLOT_LIMIT` (409) | Da estendere (D42), non riscrivere. |
| Tipologia + card + fisso/componibile | `BookingType`, `SubTab`/`CustomStaffPreset` (`presetMenus.ts`), `is_fixed_menu`, `compilable_category_keys` (FIX-9), card single-select (`BookingSubTabCards.tsx`) | **Architettura già completa.** Manca SOLO l'attributo `durata`. |

### ❌ Non esiste — da costruire
- **Permanenza/durata stimata** (oggi `confirmed_start/end` si settano a mano all'accettazione).
- **Intervalli di arrivo** (oggi il form pubblico accetta qualsiasi orario libero).
- **Tipologia prenotazione con durata** (concetto nuovo, in Settings) + **durata della card**.
- **Minimo durata di fascia** (`service_slots.min_duration`) e **`turnover_buffer_minutes`** (D37).
- **Motore "turni automatici"** = finestre di occupazione da arrivo+durata; "tavoli liberi" e "prossimi
  orari disponibili".
- **`useTableStatuses`** (FU-TABLE-1): oggi i tavoli sono sempre verdi (`TableShape.tsx:35`).
- **Snapshot disponibilità sulla prenotazione** (D14 + parere §6.4): oltre alla durata salvare
  `arrival_time/duration_minutes/estimated_end/buffer_minutes/occupancy_start/occupancy_end/duration_source/
  duration_rule_version/selected_card_id/applied_slot_min_duration/capacity_mode_used/forced_by_admin/
  force_reason…`. `occupancy_start/end` e `duration_rule_version` servono a Calendario, modifica prenotazione
  e Analytics futura **senza ricalcoli**. Predisposizione multi-tavolo via `table_session` (D39).

### 🔴 Registro rischi globale (da blindare PRIMA del codice)
1. **BUG Edge bloccante:** `create-booking/index.ts:431` interroga `service_slot_overrides.override_date`
   ma la colonna è `date_from/date_to` → gli override morbidi **non scattano mai**. Fix in S0 (D8); il fix
   deve anche gestire N righe sovrapposte + "vince il più specifico" (vedi D8), non solo rinominare la colonna.
2. **Riapertura aree blindate:** la config durata tocca **M4 Settings** e, se la durata sta sulle card,
   **M3 Menu** → controtest regressione `settings-*` / `menu-magazzino`.
3. **~~Conflitto mono-card ⟷ compose~~ — RISOLTO/non esiste:** card già single-select; compose dentro la
   card "personalizzata", durata fissa per card. Nessuna riconciliazione. *(Nota anti-regressione.)*
4. **Doppia verità di disponibilità:** cap morbido per-fascia ⟷ occupazione reale per-tavolo. Stratificati
   dal modello progressivo (L1 vs L3), arbitrati da **D1**.
5. **Semantica `confirmed_start/end`:** oggi manuale, col motore auto-calcolata → **risolto da D15**
   (storico intatto, motore solo da nuove prenotazioni).
6. **Walk-in:** `WalkInModal` confronta `booking.placement` (nome tavolo) con `tableId` → mismatch noto.
7. **`AssignmentMapPanel`** renderizzato senza guard `features.tableAssignments`.
8. **QR→ordine (asse SÌ Live):** oggi `menu_qr_codes` non è legato ai tavoli e il QR è sola lettura →
   riapre Menu QR (blindata). Non attivare finché non è una sotto-area sua (S6).
9. **Concorrenza / race condition (D40):** due richieste sull'ultimo slot nello stesso istante → controllo
   finale nell'Edge (transazione/lock). Test di concorrenza obbligatorio. Si lega al bug #1.

---

## 5. Modello progressivo a livelli

| Livello | Config admin presente | Capacità app | Sotto-area | Edition |
|---|---|---|---|---|
| L0 | nessuna | solo raccogliere richieste | esistente | Classic |
| L1 | fasce + coperti | cap occupazione per fascia (morbido) | **esiste oggi** | Classic |
| L2 | + permanenza/durata + intervalli | stima sovrapposizioni | S1+S2+S3 | **Classic** (L2-lite, vedi §6) |
| L3 | + tavoli + permanenza | tavoli liberi + prossimi orari | S4 | Pro / Servizio |
| L4 | + servizio live | sala in tempo reale + conto | S4-LIVE | Pro / Servizio |
| — | ordine-da-QR cliente | — | S6 (futuro) | Pro |
| — | vista cucina (KDS) | — | milestone separata (D33) | — |

**Invariante:** salire di livello è opt-in via configurazione; scendere non rompe nulla (default libero,
degrado D42).

### Matrice edition (D30 + raccomandazione GTM)
| Funzione | Classic | Pro |
|---|---|---|
| Fasce + coperti, durata tipologia/card, intervalli arrivo, cut-off | sì | sì |
| Stima sovrapposizioni (L2) | sì (**L2-lite**, vedi §6) | sì |
| Tavoli, sale, mappa | no | sì |
| Prossimo tavolo libero, vista turno, Live | no | sì |
| Conto leggero (riepilogo operativo tavolo) | no | sì |
| Ordine QR cliente | no | opzionale futuro (S6) |
| POS / scontrino | no | no (roadmap avanzata) |

---

## 6. Lente commerciale — Classic semplice vs Pro operativo (dalla review GTM)

> Il motore è uno solo nel codice; cambia **quanto se ne espone** per edition. La classificazione
> manopola-per-manopola è la sessione `FU-SERV-ADMIN-PANEL-1`.

- **Classic = "il modo semplice per ricevere e gestire le prenotazioni dirette, senza commissioni".**
  Espone solo: form pubblico, calendario, gestione richieste, capienza per fascia, **durata media unica**,
  intervalli arrivo semplici, dati cliente, email conferma, QR add-on. **L2-lite invisibile**: il motore
  c'è ma poche decisioni, niente gergo, dietro **preset/default**.
  > **Definizione operativa di L2-lite (cosa è ACCESO in Classic):** durata media **unica** del ristorante +
  > step di arrivo **unico** + cut-off + capienza per fascia. **Spento in Classic** (vive nel motore ma non
  > in UI Classic): durata per singola card/tipologia, step diversi pranzo/cena/eventi, suggerimento prossimo
  > orario libero, gestione arrivi tardivi, diagnostica avanzata, buffer/cap operativo. Questo è il confine
  > che rende Pro un upgrade reale (§ Matrice edition).
- **Pro = "la vista operativa per chi deve governare la sala durante il turno".** La leva di upgrade a
  69€ **NON è il conto leggero** ma: *vedi la sala del turno — tavoli liberi, arrivi, ritardi e
  prenotazioni assegnate in un'unica vista*. Durata per tipologia/card, tavoli/sale, disponibilità reale
  per tavolo, assegnazioni, Live.
- **Da NON regalare troppo in Classic:** durata per singola card/menu, suggerimento prossimo orario
  libero, regole diverse pranzo/cena/eventi, gestione arrivi tardivi, diagnostica avanzata → semplificate
  in Classic o solo Pro.
- **Console privata di Matteo (super-admin):** le manopole rare/pericolose (soglie, buffer, cap operativi,
  override temporali, edition) si configurano lì, non nella UI del ristoratore → abilita il **self-service
  futuro** (un ristoratore medio non completerebbe mai una config piena di termini tecnici).
- **Predisporre (non costruire) per non rifondare a 30-50 clienti:** `source/channel` su prenotazione +
  `external_reservation_id`; entità pagamenti separata (`booking_payments`); stato `waitlisted`;
  `table_session` separata dal tavolo; righe conto append-only; resolver disponibilità server-side
  riusato da tutti i flussi; onboarding state-machine; `tenant_id` + RLS su ogni tabella nuova; non
  assumere "1 account = 1 locale" (futuro `organization` sopra i tenant).
  > **Proprietario per sotto-area (così le "porte" non restano orfane):** `source/channel` +
  > `external_reservation_id` e stato `waitlisted` → si predispongono in **S3** (toccano già
  > `booking_requests`); `table_session` separata dal tavolo + righe conto append-only → **S4-LIVE** (D26/D39);
  > `booking_payments` → **solo schema**, nessuna UI, fuori MVP (riaprirà con Stripe, FU dedicato); resolver
  > disponibilità server-side → nasce in **S0/D8** e cresce in S2/S3.

---

## 7. Decomposizione in sotto-aree

Ogni sotto-area segue il ciclo **(1) intervista → (2) mappa → (3) test → (4) blindatura** e nel plan
ad-hoc compila *funziona / riscrivere / può rompersi*.

### S0 — Fondamenta: fix Edge + blindatura ATTIVA "as-is" *(Pro + 1 fix Classic)* — ✅ COMPLETA (22-06-26)
> **Azione 1 ✅** Edge `create-booking` v21 in PROD (override `date_from/date_to` + `resolveOverrideMaxGuests`).
> **Azione 2 ✅** mappa AS-IS (`docs/Sessioni di lavoro/22-06-26/SERVIZIO_BASELINE_MAP.md`), intervista
> (rimosso `rotation` + re-export `slotCrossesMidnight`; tenuti `display_order` sale, `useReleaseBookingAssignment`,
> `businessHoursRaw`), validate verde. Handoff orchestratore: stessa cartella, `S0_ORCHESTRATOR_HANDOFF.md`.
- **Scopo:** ratificare il riusabile e **buttare i rottami / porre basi solide mentre si mappa** (D9).
- **Azione 1 (subito, isolata — D8):** fix bug Edge `override_date`→`date_from/date_to` come mini-PR,
  deploy PROD controllato; riproduzione su TEST prima/dopo.
- **Azione 2:** intervista+mappa+blindatura del Servizio attuale come baseline, demolendo codice morto e
  fissando le **fondamenta dati** per S1–S4 (durata/finestre/conto/snapshot) senza implementarle.
- **Fuori S0 (→ S4, D10):** `useTableStatuses`, mismatch walk-in placement/id, guard `features.tableAssignments`.
- **Esito:** bug Edge chiuso in PROD; Servizio baseline blindato e ripulito; fondamenta dati pronte.

### S1 — Tipologia prenotazione + durata config *(Classic — Settings/Personalizza Form)* — ✅ COMPLETA (23-06-26)
> **Esito:** campo `duration` aggiunto a `SubTab` (card **e** carosello, opzionale) + `default_duration`
> a `BookingMode` (UI in Personalizza Form) e a `CustomStaffPreset` (**solo tipo+parser, niente UI** →
> M3 non riaperta). Nessuna migrazione DB (tutto JSONB in `restaurant_settings`). Limiti 30–360 min,
> picker 90/120/150/180 + "Altro". `npm run validate` ✅ 122 file / 991 test. Plan+mappa+decisioni:
> `docs/Sessioni di lavoro/23-06-26/` (`S1_PLAN.md` §6bis, `S1_BASELINE_MAP.md`, `S1_HANDOFF.md`).
> **NON in S1 (→ S2):** `resolveBookingDuration()`, `min_duration` fascia, snapshot, permanenza, UI preset.
- **Funziona già:** `BookingType`, `SubTab`/`CustomStaffPreset`, `is_fixed_menu`, card single-select.
- **Da costruire (solo):** `default_duration` per i pochi tipi fissi (D11) + `duration` opzionale sulla
  card (override). UI campo durata in Personalizza Form, picker 90/120/150/180+altro con min/max (D13).
  Default libero. Nessun selettore tipologia pubblico (D12).
- **[Q7] RISOLTO (Matteo 22-06-26) → Opzione A:** la durata vive sulla **card** (`SubTab`), con **eredità**
  dal preset linkato (`CustomStaffPreset`) se la card non ha durata propria; poi tipologia; poi default.
  Coerente con D12/D35 ("il cliente sceglie la card, la card comanda"). Le card senza preset possono comunque
  avere una durata.
- **Può rompersi:** riapre M4 e tocca `CustomStaffPreset`/`SubTab` → controtest `settings-*` (+ menu se la
  durata sta sulle card).

### S2 — Motore durata (gerarchia) *(libreria condivisa — Classic core)* — ✅ COMPLETA (23-06-26)
> **Esito:** `resolveBookingDuration()` pura (override > card > preset > booking_mode > restaurant_default,
> pavimento = MAX(slot_min_duration, BOOKING_DURATION_MIN), D42 undefined). `service_slots.min_duration`
> (nullable) + `turnover_buffer_minutes` (NOT NULL DEFAULT 0) — mig. 057 applicata TEST. Snapshot
> `booking_requests.duration_minutes/source/rule_version` (nullable, retrocompatibile D15) — mig. 058
> applicata TEST. Tipo `ServiceSlot` + `database.ts` rigenerati. `npm run validate` ✅ 123 file / 1008 test.
> Plan+mappa+decisioni: `docs/Sessioni di lavoro/23-06-26/` (`S2_PLAN.md` §6bis, `S2_BASELINE_MAP.md`, `S2_HANDOFF.md`).
> **NON in S2 (→ S3):** cablaggio Edge + form pubblico (Opzione A — client risolve, Edge valida).
> **NON in S2 (→ S4):** uso di `turnover_buffer_minutes` nel calcolo finestre occupazione.
> **PROD:** mig. 057/058 applicate solo su TEST. Push PROD richiede conferma Matteo (`rwuxgvld` gate).

### S3 — Intervalli di arrivo *(Classic — Prenota pubblico + Edge)*
- **Stato TEST:** implementata e validata; migrazioni 059–062 registrate su TEST, Edge TEST distribuita.
  PROD resta invariata e richiede gate/conferma Matteo.
- **Costruito:** step arrivo per-fascia con default unico (D18, in Servizio→Fasce Pro); cut-off (D20);
  tempo minimo ordine default 45 (D16); orari pieni nascosti (D19); vincolo selezione orario nel form;
  check Edge fonte di verità (D2) con codici dedicati (D42).
- **Conflitti da blindare PRIMA del codice:** uovo/gallina durata↔orario (mostra slot su durata *base*
  fascia, Edge ri-valida con durata reale); tre soglie ultimo arrivo (D16); pacing solo predisposto (D21);
  cut-off (D20); cambio config non invalida lo storico; **fuso/DST/overnight** ("arrivo dentro fascia?" a
  prova di mezzanotte); slot pieni nascosti vs grigi (UX+perf); riconciliare codici rifiuto; **ordine form
  pubblico card-prima-dell'orario** (§3 da verificare); **race condition (D40)**.
- **Può rompersi:** form Prenota in produzione (M0) + Edge → controtest pubblico + E2E + smoke PROD.
- **D40/D36:** gli invii pubblici restano `pending` e non consumano capienza; quindi due pending
  concorrenti non sono overbooking. L'admin accetta con warning morbido, mai blocco. Nessuna `063`
  fittizia è stata creata. Dettaglio: `Sessioni di lavoro/23-06-26/S3_HANDOFF.md`.

### S4 — Motore turni automatici / finestre di occupazione *(Pro — Servizio/Calendario)*
- **Da costruire:** generazione finestre (arrivo + durata + buffer D37); disponibilità auto a fine durata
  (D22); `useTableStatuses` con 5 stati (D24); ritardo configurabile (D23); "prossimo orario libero";
  auto-turno dinamico (Q19); overbooking forzabile (D25); **multi-tavolo per prenotazione (D39)**.
- **Invariante chiave (D22):** disponibilità = finestre programmate, indipendente dal checkout fisico.
- **Può rompersi:** doppia verità (#4, arbitro D1); chiude i debiti tavoli (D10).

### S4-LIVE — Console operativa di sala (tab "Live") *(Pro — Servizio)*
- **Scopo:** schermata a focus massimo per ricezione/cassa sulla fascia corrente: tavoli per-turni,
  prenotazioni assegnate, posti liberi ORA, arrivi, decisioni rapide, conto del tavolo.
- **Due assi indipendenti:** (1) *chi inserisce l'ordine* — toggle admin "il cliente può ordinare?": SÌ
  (cliente → cassa "in attesa" → admin accetta/modifica/salva) / NO (solo staff); (2) *superficie* —
  **Console Cassa** (desktop/tablet, densa) + **Cattura Mobile** (telefono cameriere, leggera). La Live
  gira da mobile come superficie di cattura.
- **Menu ⟷ tavolo:** riusa lo snapshot `booking_requests.menu_selection` per il conto delle prenotazioni.
- **Da costruire (MVP — D4):** conto per sessione/turno (D26) come righe additive con stato
  (in attesa/confermata/**stornata-con-motivo** D27) + autore + ora + flag pagato/non-pagato (D28).
  L'append azzera la concorrenza. Refetch + polling (D29), niente Realtime.
- **🔴 Nodo (asse SÌ):** identità tavolo dal telefono cliente = cantiere Menu QR → **S6**.
- **⚠️ Confine:** "conto leggero" interno, NON POS.
- **Può rompersi:** `useTableStatuses` mancante, walk-in placement vs id, guard `features.tableAssignments`;
  asse SÌ: sicurezza ordini pubblici (mitigazione = approvazione cassa), tavolo sbagliato, merge clienti.
- **Accesso Live (MVP — Matteo 22-06-26):** la Live ha un **accesso dedicato distinto dall'admin owner**
  (PIN per-locale o ruolo "staff" via Supabase Auth, PIN salvato hashed — mai in chiaro nel browser): apre
  **solo** la Live, così non si consegnano le credenziali del titolare ai camerieri. L'audit è già garantito
  dallo snapshot riga (autore + ora, D27). La **matrice ruoli completa** (owner / responsabile sala /
  cameriere-solo-righe-proprie) è rimandata a `FU-SERV-PERMESSI-1`.

### S6 — Ordine-da-QR cliente *(Pro — riapre Menu QR, successiva — D5)*
- **Da costruire:** identità tavolo via numero digitato (indizio) + conferma/correzione staff (D6); azione
  "ordina" pubblica nuova; ordine → riga "in attesa" sul conto.
- **Può rompersi:** riapre Menu QR (blindata); sicurezza ordini da telefono pubblico (approvazione cassa);
  tavolo sbagliato; due clienti stesso tavolo (merge via append). Non si attiva finché S4-LIVE non è
  blindata. Intervista di sezione propria.

### S5 — Turni manuali fissi *(futuro, opzionale — NON in MVP)*
- Solo per ristoranti a servizi fissi (es. 19:30–21:15 / 21:30–23:30). Opzione, mai la base. Rimandato.

---

## 8. Cross-area conflict map (checklist per gli interrogatori)

| Pagina | Cosa cambia | Stato attuale | Rischio |
|---|---|---|---|
| **Prenota (pubblico)** | intervalli arrivo vincolano l'orario; mono-card con durata; ordine card-prima-orario | M0 blindato, compose FIX-9 | #3 (risolto), ordine form |
| **Menu / QR** | durata su card; (asse SÌ) QR per-tavolo + ordinazione | M3 blindato; QR sola consultazione | #2 regressione; #8 QR→ordine |
| **Settings (Personalizza Form)** | nuova tipologia + durata | M4 blindato | #2 regressione settings |
| **Calendario** | capacity check permanence-aware | M2 blindato/PROD | #4 doppia verità |
| **Servizio (Pro)** | motore tavoli/turni; stati reali; buffer; multi-tavolo | implementato, non blindato | #4, FU-TABLE-1 |
| **Edge create-booking** | calcolo durata server-side + validazione occupazione + codici nuovi | in PROD, ha il bug #1 | #1 bug, #9 concorrenza, deploy PROD |

---

## 9. Sequenza consigliata

**Lente tecnica (cancelli per-sotto-area):**
1. **S0** (fondamenta + fix bug Edge) — *prima di tutto*.
2. **S1** (tipologia+durata) e **S2** (motore durata) — il "cervello" config+calcolo.
3. **S3** (intervalli arrivo) — porta il modello nel pubblico.
4. **S4** → **S4-LIVE** (solo staff) — il motore tavoli Pro.
5. **S6** (ordine-da-QR) — solo dopo S4-LIVE blindata; riapre Menu QR.
6. **S5** (turni manuali fissi) — solo se un cliente reale lo richiede.

**Lente time-to-revenue (dalla review GTM — vincola l'ordine reale):** l'architettura va costruita, ma
prima di tutto serve qualcosa di **dimostrabile in visita e vendibile**. R0 = bloccanti pre-vendita
(email conferma funzionante, tenant demo duplicabile, prezzi stabili, link demo col nome del ristorante);
R1 = Classic vendibile (form pubblico, dashboard, calendario, capienza, dati cliente, note allergie);
R2 = QR add-on; R3 = **L2-lite invisibile** (durata media + intervalli semplici, dietro preset); R4 = Pro
demo (sale/tavoli/vista turno); R5 = Pro paid pilot (2-3 ristoranti, poi conto leggero); R6 = self-service
(signup + Stripe + wizard) **solo dopo 15-30 clienti paganti e onboarding ripetibile**. **Non costruire
S4/S6 prima di avere 10-15 clienti che usano davvero Classic.**

Ogni cancello = sotto-area che supera il **Manuale di blindatura** (`docs/Testing-Skill/MANUALE_BLINDATURA.md`):
intervista + mappa + test copertura + controtest "rompi" sui 4 fronti + QA responsive + doc allineata. Le
sotto-aree che toccano `src/` Classic seguono la procedura merge production di `MASTERPLAN_BLINDATURA.md`.

---

## 10. Verifica (come si controlla che il masterplan sia eseguibile)

- **Pre-work S0:** riprodurre il bug Edge override su TEST (`docnnernvp`) con `slot_limit_enabled=true` +
  override attivo → confermare che oggi NON scatta, poi che dopo il fix scatta. `npm run validate` verde.
- **Per ogni sotto-area:** il plan ad-hoc compila *funziona/riscrivere/può-rompersi* e mappa i rischi
  #1–#9; nessuna implementazione finché il rischio bloccante di quell'area non è chiuso.
- **Test obbligatori (dalla review tecnica):** durata (card<tipologia → card vince D35; minimo fascia;
  override; nessuna durata → permanenza off); storico (cambi config non toccano prenotazioni vecchie);
  pubblico (no 20:07; no sforo chiusura; pending non blocca; confirmed blocca; cut-off); admin (forza +
  traccia; ricalcolo su cambio data/orario/ospiti); tavoli (occupato non libero; buffer; capienza;
  multi-tavolo non impedito dal DB; no-show/cancel libera finestra; fine durata = "da liberare" non
  "libero"); timezone/overnight/DST; **race condition** (due richieste stesso slot).
- **Sicurezza PROD:** ogni scrittura DB/Edge via MCP → `get_project_url` prima; `rwuxgvld`=PROD ⇒ STOP e
  conferma Matteo; `docnnernvp`=TEST ⇒ procedi. `supabase db push` vietato; CLI mai per scrivere PROD.
- **Regressione aree blindate:** ogni riapertura di M3/M4/M0 richiede le rispettive suite verdi + E2E.
- **Doc:** al termine di ogni sotto-area aggiornare `ADMIN_SERVIZIO_CONTEXT.md` e la tabella stato qui.

---

## 11. Esempi pratici (4 archetipi = i 4 livelli)

**🟢 A — Trattoria da Gino (niente tavoli) — L1.** *Admin:* Fasce "Cena 19–23, max 50 coperti"; niente
durata/tavoli. *Cliente:* card "Cena" → 4 pers → 20:00 → Invia; se 50 pieni → "fascia piena".
*Debole:* il tetto è sul totale fascia, ignora orari e tavoli.

**🟡 B — Osteria Moderna (à la carte) — L2.** *Admin:* + Durata default 120; (opz.) Cena minimo 120.
*Cliente:* arrivo 20:00 → occupato 20:00–22:00. *Permettiamo:* stima sovrapposizioni. *Debole:* senza
tavoli è stima su capienza totale, non sa "tavolo da 2 libero".

**🟠 C — Villa Eventi (menù fissi) — L2 con card.** *Admin:* 3 card — "Tavolo à la carte" (componibile,
120), "Menu degustazione" (fisso, 150), "Rinfresco di laurea" (fisso, 180); il campo durata è l'unico
pezzo nuovo. *Cliente:* sceglie UNA card "Rinfresco" → 19:30 → occupato fino 22:30 (180). *Debole:* card
evento senza durata → ricade sul default corto → riaccetta troppo presto; serve default + avviso config.

**🔴 D — Grand Hotel (sale, tavoli, live) — L3/L4.** *Admin:* Servizio→Sale→tavoli + durate come C.
*Host:* Mappa→tavoli colorati per stato→trascina la prenotazione sul "Tavolo 12"→sistema sa: occupato
19:30–22:30 turno 1, libero dopo (+ buffer); walk-in → propone tavoli liberi ora + prossimo orario.
*Debole:* `useTableStatuses` manca; walk-in nome vs id; doppia verità → regola D1.

---

## 12. Glossario UI — termini canonici

| Termine | Significato | Chi lo vede |
|---|---|---|
| **Fascia oraria** | macro-servizio (Pranzo/Cena) | admin |
| **Tipologia di prenotazione** | categoria con durata, dietro le card | admin |
| **Card / esperienza** | quello che il cliente sceglie (mono-selezione) | cliente |
| **Durata tavolo** | quanto resta occupato il tavolo (interno) | admin |
| **Buffer turnover** | riassetto tra un turno e il successivo | admin |
| **Orari prenotabili / intervallo di arrivo** | ogni quanto si prenota | admin |
| **Turno** | occupazione sequenziale di un tavolo | admin/Live |
| **Sessione tavolo** | il gruppo seduto ora (a cui appartiene il conto) | staff |
| **Conto del tavolo** | consumo del gruppo (mai "scontrino" — anti-POS) | staff |
| **Sala / Tavolo** | come oggi | tutti |

Verso il **cliente**: niente gergo, frasi calde di conferma (D34), mai "permanenza/durata 120 min".

---

## 13. Follow-up (da portare in `docs/FOLLOW_UP.md` all'esecuzione)

- **FU-SERV-INTERVISTA-1 — Guida intervista cliente alla prima configurazione.** Documento che guida
  Matteo a intervistare il cliente in vendita per capire *cosa configurare* (fasce, durate, tavoli,
  intervalli, toggle arrivi tardivi, pacing…). Output: checklist/script. Si compila man mano che le
  decisioni D… si stabilizzano. *(Esiste una bozza in `docs/Servizio-Config/GUIDA_CONFIGURAZIONE_CLIENTE.md`.)*
- **FU-SERV-ADMIN-PANEL-1 — Console privata super-admin per Matteo + snellimento UI admin.** Classificare
  ogni manopola in *onboarding self-service / preset-default / console privata / non-MVP* (sessione di
  ricerca a tappeto dedicata), togliere dalla UI del tenant le config che Matteo fa SEMPRE lui in vendita
  e spostarle in un pannello super-admin → abilita il self-service futuro (Fase 3 Stripe).
- **FU-SERV-PERMESSI-1 — Ruoli/permessi staff per Live + conto** (parere §5.11). owner/admin (tutto),
  responsabile sala, cameriere (righe proprie entro pochi minuti); CRM/marketing fuori dalla Live. Non
  MVP, ma da progettare prima di aprire la console a più operatori. **MVP già deciso (22-06-26):** accesso
  Live dedicato (PIN/ruolo staff) distinto dall'admin owner — vedi S4-LIVE; questa FU resta la **matrice
  ruoli fine**, non l'accesso sì/no.

---

## 14. File toccati in questa fase (solo documentazione)
- **Nuovo:** `docs/MASTERPLAN_SERVIZIO.md` (questo file).
- **Modifica:** `docs/MASTERPLAN_BLINDATURA.md` (M5 Servizio → rimando qui).
- **Modifica:** `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` §6 (bug Edge `override_date`).
