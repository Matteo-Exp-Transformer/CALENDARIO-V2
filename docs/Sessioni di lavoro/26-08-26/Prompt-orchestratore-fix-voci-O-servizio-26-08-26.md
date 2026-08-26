# Prompt orchestratore — fix voci `[O]` collaudo Servizio (26-08-26)

> **Uso:** incollare a un agente **orchestratore** che lavorerà con sub-agent + MSS su `env/test`.
> Ogni blocco è **auto-contenuto**: si può dare a un esecutore diverso senza altro contesto.
> Preparato in chat Meta senior 26-08-26. Nessun `src/` toccato dalla chat che ha scritto questo file.

---

## 0. Cornice obbligatoria (vale per TUTTI i blocchi)

**Profilo:** Esecuzione. **Branch:** `env/test`. **Modalità:** standard (deep solo per B2).
**Gate d'ingresso:** `npm run mss:status` → deve dire `WP-1` **IN PILOTA — ombra**. Se dice altro, fermati.

**Divieti — non negoziabili:**
- ⛔ Nessuna scrittura su **PROD** (`rwuxgvld`). Nessuna migrazione, nessun deploy edge, nessun `release:prenotazen`.
- ⛔ **Cutover MSS vietato** (`WP-6`). Non toccare la root, non migrare file MSS.
- ⛔ **Non dichiarare `WP-1` chiuso.** Nessun blocco qui sotto lo chiude.
- ⛔ Non spuntare caselle in `COLLAUDO_MANUALE_OBBLIGATORIO.md`: **le muove solo Matteo dopo la prova**. Tu scrivi al massimo la riga «ritest da fare» con il gate.
  ℹ️ Nota di contesto: i tre `RITEST-*` del 26-08 risultano `[x]` perché **li ha eseguiti Matteo di persona** e li ha spuntati lui, senza dirlo all'agente in chat. Sono validi: **non toccarli**. Quando spunti una casella (o ne trovi una spuntata), la riga deve dire **chi** ha verificato e **quando** — vedi la regola di firma sotto.
- ✍️ **Firma obbligatoria sulle verifiche umane.** Ogni casella di collaudo che risulta superata deve portare in coda `— verificato da <chi>, <data>`. Una casella senza firma non è una prova: è un segno che nessun agente successivo può distinguere da uno scritto da una macchina.
- ⛔ Non promuovere voci di `VOCABOLARIO.md` né modificare `CHIUSURA_SESSIONE.md` / `PREPARA_PROMPT_SKILL.md`: sono skill di sistema, si toccano solo in sessione Meta con Matteo. Le osservazioni vanno in `OSSERVAZIONI.md` (comunicazione) o `ERRORI_PROCESSO.md` (errori di processo).

**Prima di iniziare — igiene git (fallo tu, orchestratore, al primo turno):**
il working tree contiene già il fix **P0/P1 non committato** (12 file modificati + 5 non tracciati, fra cui
2 report e 1 `judgments-*.json`). **Committalo prima di aprire qualunque blocco**, in due commit separati
(`fix(servizio):` per `src/`, `docs(servizio):` per i documenti), altrimenti il tuo diff si mescola con
quello di un'altra sessione e un `git checkout` distrugge lavoro che nessun commit nomina.

**Chiusura di ogni blocco:** report in `docs/Sessioni di lavoro/GG-MM-AA/` con §11 Q/R piene + capsula §6-bis,
`npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule` (exit 0), `npm run test:mss`,
`npm run validate`. **Ogni fail intermedio di `mss:capsule` / `validate:mss` va scritto nel report in §4-bis** —
comando, deny, causa, ripresa — anche se poi diventa verde (mandato Matteo 26-08-26).

**Ogni voce chiusa va anche aperta come riga in `docs/FOLLOW_UP.md`** con stato `fatto` e link al report.
Oggi V3/V5/T10/T16 esistono **solo** come note dentro la checklist: se la checklist viene ripulita, spariscono.

---

## Ordine consigliato

| # | Voce | Severità | Perché in questa posizione |
|---|------|----------|----------------------------|
| B1 | **T16** — sessione che cambia in un'altra scheda | **P0/P1** | È l'unico che fa credere allo staff di aver **perso i dati** durante il servizio. Ha un passo di conferma da 2 minuti prima del fix. |
| B2 | **V5** — rimozione del limite walk-in | **P1** | Decisione di Matteo già presa: è una **rimozione**, non un fix. Tocca 8 documenti e la console superadmin, quindi conviene farla presto e da sola. |
| B3 | **V3** — messaggio d'errore fasce | P2 | Nessun dato a rischio: indirizza male e basta. Rischio test alto (stringa esatta asserita). |
| B4 | **T10** — piantina che spinge la pagina a 375px | P2 | Fastidio mobile puro. Ultimo. |
| B5 | **Durata base da console** (+ via le «3 ore fisse») | P2 | Non nasce dal collaudo: è una decisione di Matteo del 26-08. **Va fatta dallo stesso agente di B2, subito dopo**, perché tocca le stesse liste di chiavi. |

**B1 e B3 possono girare in parallelo** (file disgiunti: `AdminAuthContext`/`supabase.ts` vs `bookingTimeSlots`/`ServiceSlotsManager`).
**B2 → B5 sono la stessa catena, in quest'ordine, stesso agente.** B4 va serializzato dopo, perché condivide l'area Servizio/mappa e gli stessi e2e.

---

## B1 — T16 · «sono sparite sale, tavoli e prenotazioni» con due schede aperte

**Causa → effetto → soluzione attesa**

- **Causa.** Il client admin Supabase (`src/lib/supabase.ts:28-39`) salva la sessione in `localStorage` con la
  **chiave di default**. `localStorage` è condiviso da tutte le schede dello stesso sito: se in una seconda
  scheda si fa login con un altro account (Classic `testc@c.com`), quel token **sovrascrive** quello della
  scheda Pro. Da quel momento la scheda Pro interroga il database con l'identità sbagliata e le regole di
  sicurezza per riga (RLS) filtrano per l'altro ristorante → zero sale, zero tavoli, zero prenotazioni.
- **Perché l'app non se ne accorge.** In tutto `src/` **non esiste** un `supabase.auth.onAuthStateChange`
  (grep a zero risultati). L'unico riallineamento è `checkSession` in `src/contexts/AdminAuthContext.tsx:70-158`,
  che gira **solo** al mount e al cambio di `location.pathname` (righe 160-162). Restando sulla stessa
  schermata, l'intestazione continua a mostrare l'utente Pro e `tenantId` Pro (`TenantContext.tsx:81-99`)
  mentre le query viaggiano con l'altro token. I dati «tornano da soli» appena si cambia pagina.
- **Effetto per lo staff.** In pieno servizio la schermata si svuota senza spiegazione. Sembra una perdita di
  dati. Non lo è: non è stato cancellato nulla.
- **Soluzione attesa (comportamento, non patch).** La schermata non deve **mai** mostrare una lista vuota
  quando l'identità è cambiata sotto: sottoscrivere il cambio di sessione e, se l'email di sessione non
  coincide più con l'utente in stato, rieseguire `checkSession` e **dirlo esplicitamente** («la sessione è
  cambiata in un'altra scheda — ricarica per continuare come <email>»). In alternativa o in aggiunta:
  chiave di storage distinta per il contesto admin. Il silenzio attuale è il difetto.

**⚠️ Passo 0 obbligatorio — conferma prima del fix.** Il collaudo ha marcato T16 `NON_VERIFICATO`: non
scrivere codice prima di questa prova, che costa 2 minuti e la fa **Matteo** (o l'agente in browser):
> scheda A loggata Pro → apri DevTools → Application → Local Storage → annota la chiave `sb-…-auth-token`
> e l'email dentro. Fai login Classic nella scheda B. Torna in A e rileggi la chiave.
> **Se l'email nel token è diventata Classic mentre l'intestazione dice ancora `tomas@t.com`, causa confermata.**
> Se **non** cambia, la diagnosi qui sopra è sbagliata: fermati, riporta e non fixare al buio.

**File coinvolti:** `src/lib/supabase.ts:28-39` · `src/contexts/AdminAuthContext.tsx:70-162` · `src/contexts/TenantContext.tsx:81-99`.

**Rete di test da non rompere:** `src/features/booking/hooks/__tests__/useAdminAuth.test.tsx` (11+ casi su
restore sessione, incluse righe 191, 316, 329 sulle rotte pubbliche) · `src/contexts/__tests__/TenantContext.test.tsx:87-151`.
⚠️ Un listener globale può far scattare `checkSession` anche su `/prenota/:slug` e `/menu/:slug`, dove il
tenant **non** va risolto dall'admin: quei due file sono la rete esatta su questo punto. Aggiungi un test
nuovo per il cambio-identità, non riscrivere quelli esistenti.

**Gate di ritest per Matteo (3 passi):**
1. Due schede: A = Pro, B = login Classic.
2. Torna su A **senza F5** → deve comparire un avviso di sessione cambiata, **non** una lista vuota.
3. F5 su A → rientra coerente con l'utente attivo.

---

## B2 — V5 · **rimuovere** il limite coperti walk-in (decisione Matteo 26-08-26)

> ⚠️ **Questo blocco è cambiato rispetto alla prima stesura.** La diagnosi proponeva di *far funzionare*
> il limite walk-in. **Matteo ha deciso il contrario: il limite si rimuove.** Il walk-in resta soggetto,
> come qualunque prenotazione, al **conteggio posti della fascia**, con avviso e possibilità di forzare.

**Perché la decisione è a costo quasi zero:** il comportamento che Matteo vuole **esiste già** ed è attivo.
`WalkInModal.tsx:269-275` mostra l'avviso ambra `capacity-warning` quando `isOverCapacity`, che arriva da
`useCapacityCheck` = **capienza della fascia**, e il secondo click conferma («La fascia è al completo. Puoi
comunque aggiungere il walk-in — premi di nuovo per confermare»). Non c'è niente da costruire: c'è da
**togliere** la manopola parallela che non ha mai funzionato.

**Cosa rimuovere (elenco verificato):**

| File | Cosa |
|---|---|
| `src/features/booking/components/servizio/WalkInLimitCard.tsx` | elimina il componente |
| `src/pages/ServizioPage.tsx` | rimuovi l'uso della card |
| `src/features/booking/components/home/WalkInModal.tsx:34` | rimuovi la lettura di `walk_in_max_guests` |
| `src/features/booking/components/home/WalkInModal.tsx:197` | rimuovi l'attributo `max={maxGuests}` sull'input |
| `src/features/booking/lib/restaurantSettingRegistry.ts:81, 364, 582-583` | rimuovi chiave, tipo e definizione |
| `console/src/lib/restaurantSettings.ts:68, 130, 200-201` | rimuovi chiave, definizione e il clamp 0–500 |
| `console/src/components/RestaurantSettingsPanel.tsx`, `TenantDetail.tsx` | rimuovi l'editor dalla console superadmin |
| guard modifiche non salvate | rimuovi la sorgente `servizio-walk-in-limit` |

**Cosa NON toccare:** la durata di ripiego del walk-in (`min_duration` → 90) è un'altra cosa e resta.

**Nessuna migrazione.** `supabase/migrations/047` nomina la chiave **solo in un commento**. Le righe già
salvate in `restaurant_settings` restano lì come dato orfano: innocuo, reversibile, e non richiede scrittura
su DB. ⛔ Non scrivere una migrazione di pulizia senza un sì esplicito di Matteo.

**Rete di test da aggiornare:** `walkIn.b2.test.tsx` · `ServizioPage.dueViste.test.tsx` ·
`ServizioPage.tableMode.test.tsx` · `ServizioPage.deleteTableOccupato.test.tsx` · `m6ProdReadyPatterns.test.ts`
· e2e `pro-service-tables-lifecycle.spec.ts:349-481`. I test che asseriscono l'esistenza della card vanno
**rimossi**, non aggirati. Aggiungine uno che dimostri che un walk-in oltre la capienza di fascia mostra
l'ambra e passa al secondo click: è il comportamento che sopravvive.

**Documenti da allineare nello stesso commit:** `ADMIN_SERVIZIO_CONTEXT.md`, `ADMIN_SETTINGS_CONTEXT.md`,
`ADMIN_DATA_FLOW_CONTEXT.md`, `ADMIN_SHELL_PAGES_CONTEXT.md`, `DB_SCHEMA_CONTEXT.md`, `APP_CONTEXT_SKILL.md`,
`docs/Servizio-Config/GUIDA_CONFIGURAZIONE_CLIENTE.md`, `docs/Console-Skill/onboarding/INTERVISTA_NUOVO_CLIENTE.md`.
Sono 8 file che nominano una manopola che non esisterà più: se non li allinei ora, restano a mentire.

**Gate di ritest per Matteo (3 click):**
1. Servizio → la card «limite walk-in» **non c'è più**; nemmeno in console superadmin.
2. Home → Aggiungi walk-in con più coperti di quelli liberi nella fascia → compare l'avviso ambra.
3. Secondo click → il walk-in si crea comunque.

---

## B3 — V3 · rinomino una fascia con un nome già usato e l'app mi parla di sovrapposizione

**Causa → effetto → soluzione attesa**

- **Causa.** In `src/features/booking/utils/bookingTimeSlots.ts:101-110` (`validateSlotConfigs`, modalità
  bozza) il ciclo scorre le altre fasce **in ordine di posizione** e per ciascuna controlla prima il nome
  duplicato, poi la sovrapposizione, **uscendo al primo errore trovato**. Se una fascia che sta *prima*
  nell'elenco si sovrappone, esce l'errore di sovrapposizione e il nome duplicato più avanti non viene mai
  raggiunto. La priorità è data dalla posizione nell'elenco, non dalla gravità dell'errore.
- **Aggravante nel copy.** Il messaggio di sovrapposizione (riga 108) chiama la fascia in bozza con il
  **nome nuovo** — cioè proprio il nome duplicato. Matteo legge «le fasce "pranzo" e "AG-B2" si sovrappongono»
  e pensa alla Pranzo di mezzogiorno, mentre il codice sta parlando della ex-aperitivo. Il messaggio non
  cita gli orari, quindi non è nemmeno verificabile a occhio.
- **Terzo pezzo (copy).** La label del campo coperti è troncata: «Coperti massimi per fascia» →
  `src/features/booking/components/servizio/ServiceSlotsManager.tsx:747-749`.
- **Soluzione attesa.** Due passate separate: **prima** la scansione completa dei nomi duplicati su tutte
  le altre fasce, **poi** quella delle sovrapposizioni. E nel messaggio di sovrapposizione includere gli
  **orari** delle due fasce, così è verificabile. Label completata («Coperti massimi per questa fascia oraria»).

**Rete di test da non rompere — attenzione, qui il rischio è concreto:**
`src/features/booking/components/__tests__/serviceSlots.sovrapposizione.test.tsx` asserisce la **stringa
esatta** `'Le fasce "Serale" e "Cena" si sovrappongono'` (righe 134-135) e `/nome fascia duplicato/i`
(riga 184). Cambiare il testo del messaggio **rompe la riga 134**: aggiorna l'asserzione nello stesso commit.
Toccati anche: `bookingTimeSlots.settingsM4.adminBlindatura.test.ts` ·
`settingsTimeSlots.settingsM4.adminBlindatura.test.tsx` · `serviceSlotsMoveOrder.servizioBlindatura.test.tsx`
· `m6ProdReadyPatterns.test.ts` · e2e `e2e/pro/pro-service.spec.ts`.

**Gate di ritest per Matteo (3 click):**
1. Rinomina una fascia con il nome di un'altra → il messaggio deve dire **nome duplicato**.
2. Crea una fascia davvero accavallata **con nome unico** → messaggio di sovrapposizione **con gli orari**.
3. Guarda la label del campo coperti: deve leggersi per intero.

---

## B4 — T10 · a 375px la piantina spinge tutta la pagina invece di scorrere nel suo riquadro

**Causa → effetto → soluzione attesa**

- **Causa.** `src/features/booking/components/servizio/ServicePlanMap.tsx:198-211`. Il riquadro scorrevole
  ha `overflow-auto` ma il vincolo di dimensione esiste **solo in larghezza**
  (`style={{ width: room.width, maxWidth: '100%' }}`): non c'è nessun tetto d'altezza, mentre il contenuto
  interno ha un'altezza fissa (riga 207). Il riquadro cresce quindi fino all'altezza intera della sala e lo
  scroll verticale finisce sulla pagina, non dentro il frame — verticalmente `overflow-auto` non ha mai
  niente da fare.
- **Secondo dettaglio (ipotesi da codice, NON confermata a browser).** La classe `box-content` (riga 199)
  fa sommare il bordo di 1px per lato al `maxWidth: 100%` → ~2px di sfondamento orizzontale residuo a 375px.
  Stesso identico schema nella vista Modifica, `TableMap.tsx:82-83`. **Verifica a browser prima di toccarlo**:
  se la barra orizzontale non c'è, non cambiare `box-content`.
- **Effetto per lo staff.** Su telefono la piantina non si «guida»: ogni trascinamento muove tutta la pagina.
- **Soluzione attesa.** Dare al riquadro un tetto d'altezza responsivo (es. in `dvh`, o legato alla viewport)
  così che l'eccedenza verticale scorra **dentro** il frame. La richiesta «dimensione sala in metri anziché
  pixel» **non fa parte di questo fix**: è un'idea di prodotto → aprila come riga `FU-` separata e non
  toccarla qui.

**Rete di test da non rompere:** `ServicePlanMap.griglia.test.tsx` (impronta sagome, `data-testid={service-plan-room-*}`)
· `ServizioPage.dueViste.test.tsx` · e2e `e2e/pro/pro-service.spec.ts` (viewport 375/834/1280, righe 159 e 243)
· `pro-service-tables-lifecycle.spec.ts:1272-1334`. ⚠️ Quest'ultimo clicca i pulsanti di fine turno **a 375px**:
un frame con altezza limitata può spostarli fuori vista. Rilancia gli e2e Pro, non solo Vitest.

**Gate di ritest per Matteo (3 passi):**
1. A 375px, trascina la piantina → si muove il **contenuto del riquadro**, la pagina resta ferma.
2. Nessuna barra di scorrimento orizzontale in fondo alla pagina.
3. A 1280px la vista a due colonne è invariata.

---

## B5 — Durata base della prenotazione: dalla console, non «3 ore fisse»

> ⚠️ **Da eseguire SUBITO DOPO B2, dallo stesso agente, mai in parallelo.** Tocca le **stesse identiche
> strutture** di B2: l'array `as const` delle chiavi, il blocco dei tipi e l'oggetto delle definizioni, in
> **entrambi** i registri (app e console). Due agenti sugli stessi `as const` = una delle due modifiche
> sparisce senza conflitto visibile. B2 **toglie** `walk_in_max_guests`, B5 **aggiunge**
> `restaurant_default_duration`: stessa mano, due commit.

**Causa → effetto → soluzione attesa**

- **Causa 1 — il gradino esiste ma non è collegato.** `src/features/booking/lib/resolveBookingDuration.ts`
  implementa già la gerarchia D35 e la dichiara testualmente alle righe 12-13:
  *«Gradino 4 — super-admin console (futuro, Classic L2-lite). Per ora sempre undefined»*. Nessun chiamante
  di produzione passa `restaurant_default_duration`: solo i test (`lib/__tests__/resolveBookingDuration.test.ts:50,61`).
- **Causa 2 — la prenotazione admin dura 3 ore, scritte nel codice.**
  `src/features/booking/hooks/useAdminBookingRequests.ts:32` chiama `calculateEndTimeFromStart(startTime)`,
  che ha `hoursToAdd = 3` come default (`src/features/booking/utils/dateUtils.ts:120`). Poi
  `durationSnapshotFromConfirmedRange(confirmedStart, confirmedEnd)` **deriva lo snapshot dall'intervallo**
  invece di risolvere prima la durata: la direzione è invertita rispetto al disegno D35.
- **Effetto per il ristoratore.** Non esiste **nessuna** manopola di durata raggiungibile: né in app, né in
  console superadmin (le 20 chiavi di `console/src/lib/restaurantSettings.ts:50-71` non ne contengono
  alcuna). E l'avviso «Tavolo a fine turno» suona su un orario finto, perché `getAccurateEndTime`
  (`dateUtils.ts:166-177`) legge `confirmed_end`, che è start+3h.
- **Soluzione attesa.** (1) Aggiungere `restaurant_default_duration` a **entrambi** i registri come intero
  con default sensato (**90**), validato entro i limiti già esistenti (`constants/bookingDurationLimits.ts`:
  min 30, max 360), ed esporlo nella console superadmin accanto alle altre chiavi intere. (2) Passarlo a
  `resolveBookingDuration` dai chiamanti. (3) In `useAdminBookingRequests` **invertire la direzione**:
  risolvere prima la durata, poi derivare `confirmed_end` — non più il contrario. Se nessun gradino ha una
  durata, il comportamento resta quello di oggi (permanenza OFF, D42): **non introdurre un default nascosto**.

**Nessuna migrazione:** sono chiavi JSONB in `restaurant_settings`.

**Attenzione — questo cambia un comportamento di prodotto, non solo una configurazione.** `confirmed_end`
alimenta lo stato `leaving` del tavolo (`useTableStatuses.ts:116-148`, tramite `resolveOccupancyEndWall`) e
quindi **quando compare l'avviso di fine turno**. Verifica gli e2e Pro, non solo Vitest.

**Rete di test:** `lib/__tests__/resolveBookingDuration.test.ts` · `utils/__tests__/bookingDurationSnapshot.s3.test.ts`
· `utils/__tests__/deriveArrivalTimes.s3.test.ts` · `hooks/__tests__/useTableStatuses.test.ts` (§11 buffer D37,
righe 270-273) · `restaurantSettingRegistry.releaseNoticeRecall.test.ts` · e2e `pro-service-tables-lifecycle.spec.ts`.

**Ricaduta sui follow-up:** chiude la parte «durata» di `FU-SERV-MANOPOLE-CONSOLE-1`. Le altre due manopole
di quella voce (`table_late_threshold_minutes`, `table_release_notice_recall_minutes`) restano **fuori
scope qui**: stessa natura, ma vanno decise con Matteo — non aggiungerle di iniziativa.

**Gate di ritest per Matteo (3 passi):**
1. Console superadmin → imposta la durata base a **90** e salva.
2. Crea una prenotazione da admin senza menu né tipologia → la fine prevista è **start + 90 min**, non +3h.
3. Aspetta (o sposta l'orologio oltre la fine + buffer) → l'avviso «Tavolo a fine turno» compare sull'ora giusta.

> **Fuori scope, cantiere a parte:** l'idea di Matteo del **doppio turno attivo** sullo stesso tavolo
> (turno 1 dichiarato fino alle 14:00 *e* turno 2 dalle 14:00). Oggi il codice assume **una sola
> assegnazione attiva per tavolo** — `useTableStatuses.ts:205-216` e `useForceReplaceBookingOnTable`
> (`useTableAssignments.ts:503-517`) prendono il `turn_number` minimo. ⛔ Non provarci dentro B5.

---

## Blocco separato — debiti secondari (NON mescolare con B1-B4)

> Aprili solo dopo B1-B4, in una sessione a parte. Sono di natura diversa: copy, decisioni di prodotto e
> due diagnosi ancora **aperte**. Mescolarli con i fix sopra rende illeggibile il diff.

**Copy / messaggi**
- **T15** — «Nessun orario disponibile per questa data» esce anche quando la vera causa è la capienza per N
  ospiti → `BookingPublicDateTimePickers.tsx:385`, filtro in `useArrivalSlots.ts:124-134`. Il messaggio deve
  distinguere «giorno chiuso» da «non c'è posto per N persone».
- **T12** — **non è un difetto**: è una domanda di Matteo su come l'app riconosce il ritardo (soglia 15 min).
  Serve una risposta scritta, non una patch.

**UI a basso rischio**
- **T4** — «Aggiungi tavolo» resta visibile anche a posti già coperti: in `AssignmentMapPanel.tsx:1571-1580`
  è renderizzato **senza alcuna condizione** su posti assegnati vs richiesti. Fix mirato, rischio basso.
- **T1 (ordine orari)** — gli orari escono raggruppati per fascia nell'ordine restituito dal config, non in
  ordine cronologico: `useArrivalSlots.ts:107`. Dentro ogni gruppo l'ordine è giusto: è l'ordine **dei
  gruppi** a essere sparso. Ordinare per `start_time`, gestendo le fasce a cavallo di mezzanotte.
- **T1 (prezzo)** — riepilogo senza menu preselezionato deve mostrare «prezzo a persona × ospiti = totale»
  → `BookingSummarySidebar.tsx`.

**⚠️ Due diagnosi ancora aperte — vietato fixare al buio**
- **T3** — l'ipotesi in circolazione («manca l'invalidate») è **smentita**: `useWalkInMutation.ts:179-189`
  invalida già `TABLE_ASSIGNMENTS_QUERY_KEY` (chiave `unassigned` inclusa) e `bookings`. **Esperimento:**
  crea il walk-in con tavolo e confronta `service_slot_id` e data della riga creata con la fascia
  selezionata in Servizio. Probabile disallineamento data/fascia, non cache.
- **T5** — l'avviso di limite fascia è comparso con la casella D38 **spenta** e anche fuori da Servizio
  (modale modifica prenotazione, nuova prenotazione). Da tracciare in `useCapacityCheck.ts`: chi legge
  davvero il flag D38 e su quali schermate il controllo non viene applicato. Catena **non ispezionata** finora.

**Decisioni di prodotto (non fix)**
- **T13** — badge % mensile non trovato + dubbio sulla logica giorno (posti fisici vs somma dei cap fascia)
  → già tracciato come `FU-SERV-BADGE-CASCATA-1`, decisione aperta.
- **T11** — da mobile in tab Servizio si può ancora assegnare e aprire «Modifica sala»: serve una vista
  mobile dedicata → riga `FU-` di prodotto.
