# PLAN — Mappatura e blindatura completa Admin

> **Cos'e questo file.** Il piano operativo vivo per portare l'area **Admin autenticata** (`/admin`)
> da mappata a livello documentale a **blindata di prodotto**. Lo usa un orchestratore senior per
> dirigere interviste, sub-agent, test e aggiornamenti dello skill system. Ogni agente che lavora su
> Admin deve partire da `ADMIN_SKILL.md` (ingresso rapido: `ADMIN_MINI.md`, §0.0b di `APP_CONTEXT`),
> poi aprire questo piano se il task riguarda mappatura, blindatura, test di area o lavoro multi-dominio.

> **Anti-storia (APP_CONTEXT §8).** Questo è un **piano operativo**, non una skill viva: la cronologia
> di orchestrazione resta qui. Ma quando una decisione diventa *stato stabile dell'area*, va nel
> context vivo (`contesto/*`) come «stato + divieto + link al report», non come narrativa datata.

> **Definizione di blindata per Admin.** Admin e blindata solo quando: (1) la doc guida un sub-agent
> terzo tramite `AGENTS.md` -> `APP_CONTEXT_SKILL.md` -> `ADMIN_SKILL.md` -> `contesto/*`; (2) i flussi
> di prodotto sono puliti e testati su dati reali di TEST; (3) non restano mock/hardcoded che fingono
> dati veri, codice morto o elementi mostrati/configurati senza senso; (4) i flussi critici sono
> coperti da test marcati `@admin-blindatura`.

---

## 0. Prima di iniziare

1. Lavora su `env/test`.
2. Leggi per intero:
   - `docs/Admin-Skill/ADMIN_SKILL.md`;
   - il context dell'area scelta in `docs/Admin-Skill/contesto/`;
   - `docs/Admin-Skill/contesto/ADMIN_CONFLICTS_AND_DEBTS.md`;
   - `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md`;
   - questo piano.
3. Usa il codice come fonte di verita. I report storici sono indizi, non stato attuale.
4. Non modificare codice applicativo prima di aver chiuso l'intervista dell'area.
5. Query o scritture DB solo su TEST (`docnnernvp`). PROD (`rwuxgvld`) e solo read-only, quando serve
   cercare dati mock o disallineamenti reali.
6. Working tree potenzialmente sporco: stage selettivo, non committare lavoro altrui.

---

## 1. Aree Admin e ordine di lavoro

| # | Area | Context principale | Stato iniziale | Criterio di uscita |
|---|---|---|---|---|
| 1 | Shell / ingresso / navigazione globale | `ADMIN_SHELL_NAV_CONTEXT.md` | ✅ blindato (FU-042 E2E 10-06-26) | login, edition, sidebar, dirty guard, logout, refresh/back — unit + E2E staging |
| 2 | Prenotazioni operative | `ADMIN_PRENOTAZIONI_CONTEXT.md` | fatto (11-06-26) | Vitest 32 + E2E FU-043; accetta/rifiuta/cancella/ripristina/warning testati |
| 3 | Impostazioni / Personalizza Form | `ADMIN_SETTINGS_CONTEXT.md` | **Fase C chiusa** (15-06-26) · blindatura Vitest `settings-*` | gap §report M4 implementati; test `@admin-blindatura: settings-*`; validate verde; E2E smoke opzionale manuale |
| 4 | Menu admin / magazzino | `ADMIN_MENU_MAGAZZINO_CONTEXT.md` | ✅ **blindato** (11-06-26) | Vitest 27 + E2E `@admin-blindatura: menu-magazzino`; QA Matteo; report finale M3 |
| 5 | Servizio | `ADMIN_SERVIZIO_CONTEXT.md` | da fare | sale/tavoli/slot/walk-in/briefing testati |
| 6 | CRM | `ADMIN_CRM_CONTEXT.md` | da fare | create/edit/delete cliente e booking collegate testati |
| 7 | Home / Analytics | `ADMIN_ANALYTICS_HOME_CONTEXT.md` | da fare | KPI, finestre data, quick action e responsive testati |
| 8 | Cross-area prod-ready | `ADMIN_CONFLICTS_AND_DEBTS.md` | da fare | fallback, hardcoded, codice morto e azioni pericolose chiusi o tracciati |

Regola: chiudere un'area prima di passare alla successiva, salvo bug trasversale bloccante.

---

## 2. Ciclo fisso per ogni area

### FASE A — Intervista di senso

L'orchestratore fa domande solo su cio che il codice non puo decidere:

- chi usa davvero l'area: admin, staff o entrambi;
- quale flusso e giornaliero e quale e setup raro;
- quali fallback sono voluti e quali sono debiti;
- quali azioni sono pericolose e devono chiedere conferma;
- quali limiti attuali sono voluti e non vanno "migliorati" d'ufficio.

Output: decisioni scritte nel context dell'area e, se generali, in `ADMIN_SKILL.md`.

### FASE B — Ricognizione codice e sub-agent read-only

Sub-agent consigliati:

- **Mapper flusso utente**: percorre l'area come utente e segnala stati, modal, uscite, errori.
- **Auditor flusso dati**: mappa hook, tabelle, settings, side effect, query invalidation.
- **Scanner prod-ready**: cerca fallback sospetti, mock, hardcoded, codice morto, elementi latenti.
- **Test engineer**: confronta test esistenti e buchi da coprire.
- **Controverifica finale**: parte da `AGENTS.md` e verifica che la doc guidi ai file giusti.

I sub-agent riportano finding. Non fixano, salvo prompt esplicito dell'orchestratore.

### FASE C — Blindatura prodotto

Per ogni finding l'orchestratore decide:

- fix immediato se e basso rischio e coerente con l'intervista;
- prompt anti-rottura a sub-agent se il fix e circoscritto;
- follow-up se e reale ma fuori area;
- "voluto" se Matteo lo conferma e la doc lo registra.

Ogni test di blindatura deve avere in testa:

```ts
// @admin-blindatura: <fronte>
// Copre: <flusso utente/dati blindato>
```

### FASE D — Controtest: ricerca ATTIVA di rotture (non solo "i test passano")

> Principio (deciso da Matteo 07-06-26, vale per TUTTE le aree). La chiusura di un'area non e
> "i test verdi". E **cercare attivamente cosa puo rompere la sezione**: come orchestratore lanci
> sub-agent con il mandato esplicito di *trovare bug*, non di confermare che funziona. La domanda
> guida e: **"cosa puo romperla, e cosa puo fare l'utente per romperla?"**. Un controtest che non
> ha provato a rompere nulla NON chiude l'area.

I sub-agent di controtest hanno questo mandato (riportano finding, non fixano):

1. **Flusso dati — prova a sporcarlo.** Per ogni azione: lo stato DB finale e quello giusto? Cosa
   succede con dati mancanti/nulli (orario assente, email vuota, capienza non configurata, tenant
   senza anagrafica)? Doppio click / azione ripetuta / race tra invalidazioni? Stati intermedi non
   sincronizzati? L'azione su un record gia in un altro stato (es. accettare una gia accettata)?
2. **Flusso utente — prova a romperlo da utente.** Click fuori sequenza, modale chiusa a meta,
   conferma annullata e ri-aperta, navigazione via mentre una mutation gira, back/refresh durante
   un'azione. Cosa vede l'utente se va storto: errore chiaro o schermata rotta?
3. **Limit test della sezione.** Spingere i confini: testi lunghissimi, numero ospiti enorme/0/negativo,
   date limite (mezzanotte, passato, anni avanti), liste molto lunghe (archivio con tante righe),
   capienza al limite esatto e +1. Cosa fa la UI ai bordi?
4. **Responsive 375 / 834 / 1280.** Ogni modale/azione nuova: layout che non si rompe, bottoni
   raggiungibili, niente overflow/sovrapposizioni, console senza errori. I modali di conferma nuovi
   vanno guardati su tutti e tre.

Checklist minima di chiusura:

- i 4 fronti sopra esercitati da sub-agent con mandato "rompi", finding raccolti e decisi
  (fix / follow-up / "voluto");
- test mirati dell'area verdi (inclusi i **limit test** aggiunti);
- `npm run validate` verde;
- console senza errori bloccanti su 375 / 834 / 1280;
- doc e test index aggiornati;
- `PROSEGUIMENTO_MAPPATURA_SKILL.md` aggiornato con stato area;
- report sessione con esiti e decisioni.

---

## 3. Area 1 — Shell / ingresso / navigazione globale

### 3.1 Intervista obbligatoria prima del codice

Domande chiuse con Matteo il 06-06-26:

- Staff e admin hanno stessi permessi: unico accesso per ora.
- Classic non ha sidebar; Pro/Enterprise hanno sidebar con sezioni abilitate dai flag.
- Logout deve bloccare se ci sono modifiche non salvate.
- Fallback header admin: `Sistema Gestionale Prenotazioni`.
- `features.home=false` deve nascondere Home anche se sidebar resta attiva.
- Refresh/back senza sotto-route non e un limite accettato: migliorare con sotto-route leggere.

### 3.2 Inventario tecnico da verificare

File e flussi principali:

- `src/router.tsx`: `/admin` e `/admin/:adminSection` protette.
- `src/pages/AdminLoginPage.tsx`: ingresso login.
- `src/components/layout/AdminShell.tsx`: sezione corrente, sidebar, logout, theme effect.
- `src/pages/AdminDashboard.tsx`: tab interne, URL tab e `bodyOverride` Home.
- `src/features/booking/hooks/useAdminAuth.ts`: sessione, `admin_users`, tenant, logout.
- `src/hooks/useFeatures.ts` + `src/config/features.ts`: Classic/Pro/Enterprise.
- `src/contexts/UnsavedChangesContext.tsx`: dirty state, save/discard, beforeunload.

### 3.3 Test da costruire o consolidare

Marcatori:

- `@admin-blindatura: shell-login`
- `@admin-blindatura: shell-edition`
- `@admin-blindatura: shell-sidebar`
- `@admin-blindatura: shell-dirty-guard`
- `@admin-blindatura: shell-logout`
- `@admin-blindatura: shell-refresh-back`

Scenari minimi:

- utente non autenticato su `/admin` torna a `/login`;
- Classic vede dashboard senza sidebar;
- Pro/Enterprise vede Home/Servizio/CRM/Analytics e puo tornare a Prenotazioni;
- cambio sezione con dirty state mostra guard;
- logout con dirty state mostra il guard;
- `features.home=false` nasconde Home e porta a Prenotazioni;
- refresh/back da sezione interna o tab dashboard usa sotto-route leggere.

### 3.4 Criterio uscita Area 1

Area 1 diventa `✅ PROD` solo se:

- decisioni intervista registrate;
- test `@admin-blindatura: shell-*` presenti o test esistenti aggiornati con marcatori;
- nessun fallback/header ambiguo resta senza stato;
- `ADMIN_SHELL_NAV_CONTEXT.md`, `ADMIN_TEST_SUITE_INDEX.md` e `ADMIN_SKILL.md` sono allineati;
- controverifica sub-agent conferma routing doc-guided.

---

## 3-bis. Area 2 — Prenotazioni operative

### 3-bis.1 Intervista chiusa con Matteo (06-06-26)

Decisioni (dettaglio in `contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` §5-bis):

- Capienza/fasce/orario passato = **solo avviso, mai blocco**.
- Stati `pending/accepted/rejected/deleted` + `no_show` **tutti voluti**, non toccare.
- Archivio = **solo soft-delete** recuperabile per sempre; **nessun hard-delete lato app**
  (Matteo pulira i record vecchi da DB con criterio temporale futuro).
- **Conferme da rendere coerenti** (una sola lingua di conferma):
  - Elimina: tiene la conferma+motivo attuale;
  - No-show: **aggiungere conferma** (oggi parte al primo click);
  - Reinserisci / Riporta in attesa: **sostituire `window.confirm()` nativo** con conferma custom;
  - Rifiuta: **allineare lo stile** al resto (ha gia il box motivo, non aggiungere passaggi).

### 3-bis.2 Stato reale del codice (verificato 06-06-26, codice=verita)

- `AcceptBookingModal` **NON e dead code**: importato/usato da `AdminBookingForm.tsx` (nuova
  prenotazione admin). L'accept-da-card (`PendingRequestsTab.handleAccept`) NON lo usa: accetta diretto.
  → Correggere ogni report/context che lo dava per "non cablato".
- Mutation reali in `useBookingMutations.ts`: `useAcceptBooking`, `useRejectBooking`, `useUpdateBooking`,
  `useRestoreBooking`, `useRequeueRejectedBooking`, `useMarkNoShow`, `useCancelBooking`.
- Conferme miste: `window.confirm()` (ArchiveTab restore/requeue), modale custom (cancel,
  capienza, orario passato), nessuna (no-show, reject diretto).

### 3-bis.3 Inventario file

- `src/features/booking/components/PendingRequestsTab.tsx` — accept/reject da card, avvisi non bloccanti.
- `src/features/booking/components/ArchiveTab.tsx` — restore/requeue con `confirm()` nativo.
- `src/features/booking/components/BookingDetailsModal.tsx` — **LOCK strutturale** (cancel, no-show,
  modifica). Leggere `docs/ADMIN_CLASSIC_SKILL.md` prima di toccare.
- `src/features/booking/components/AcceptBookingModal.tsx`, `RejectBookingModal.tsx`,
  `CapacityWarningModal.tsx`, `PastStartTimeWarningModal.tsx`, `BookingRequestCard.tsx`.
- `src/features/booking/hooks/useBookingMutations.ts` — **LOCK core**.

### 3-bis.4 Test da costruire (marcatore `@admin-blindatura: prenotazioni`)

Scenari minimi:

- accept-da-card su pending → scrive `accepted` + orari + `desired_time`;
- accept che sfora capienza → mostra warning ma **non blocca** (conferma → mutate);
- accept su orario passato → mostra warning ma **non blocca**;
- rifiuta con/senza motivo → `rejected` + `rejection_reason`;
- elimina → `deleted` + `cancelled_at` + `cancellation_reason` (soft-delete, niente hard-delete);
- reinserisci (deleted→accepted, richiede `confirmed_start/end`);
- riporta in attesa (rejected→pending, azzera `rejection_reason`);
- no-show → `no_show=true`, sparisce dal calendario, resta nel DB;
- **conferme coerenti**: ogni azione pericolosa passa dalla conferma custom (regressione anti
  `window.confirm` nativo + no-show senza conferma).

### 3-bis.5 Criterio uscita Area 2

- decisioni intervista registrate (fatto: context §5-bis + skill §6 + questo §3-bis);
- conferme rese coerenti senza rompere i flussi LOCK;
- test `@admin-blindatura: prenotazioni` sui flussi sopra, verdi;
- `npm run validate` verde;
- doc (context, test index, skill) e `PROSEGUIMENTO_MAPPATURA_SKILL.md` allineati;
- controtest sub-agent flusso dati + utente/responsive.

---

## 3-ter. Area 2-bis — Tab Calendario (M2, da zero)

### 3-ter.1 Intervista chiusa con Matteo (11-06-26)

Senso: il Calendario è una **vista d'insieme leggera** (in alto il calendario dice solo *quanto è
pieno ogni giorno*: % riempimento o conteggio coperti) + una **lista di lavoro sotto**, le
prenotazioni del giorno/settimana raggruppate per fascia oraria, cliccabili → modale dettaglio.

Decisioni (dettaglio in `contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter):

- **Utenti:** admin **e staff di sala** → a prova di errore, niente azioni pericolose facili.
- **Mostra solo prenotazioni accettate.** Le pending restano nella pagina Prenotazioni.
- **Azioni dal calendario:**
  - click prenotazione → **modale dettaglio** (lettura);
  - **Accetta** → ❌ non da qui (vive in Prenotazioni);
  - **Rifiuta / Cancella** → solo dentro il modale dettaglio, con conferma (già LOCK in `BookingDetailsModal`);
  - **Assegna/cambia tavolo** → ✅ **solo Pro+**, dietro feature flag (stesso flag di "Servizio");
    in Classic **non renderizzato**. `QuickTableAssignModal` resta ma gated;
  - **Crea prenotazione** → click su un giorno → apre modale "nuova prenotazione" esistente,
    su **tutti i giorni anche pieni** (mostra avviso-sforo ma lascia procedere).
- **Limiti anti-rottura:** mai drag&drop per spostare data/ora; nessuna azione distruttiva senza
  conferma; solo accettate in calendario.
- **Due limiti coperti, SEPARATI e MORBIDI (non si vincolano a vicenda):**
  - **Esterno giornaliero** — vive in **Impostazioni (Classic)**. `0`=nessun limite, o N. Quando
    raggiunto blocca **solo la pagina pubblica Prenota** (conta **solo accettate**). È il numero
    della % riempimento. Lo staff da admin può sempre sforare.
  - **Interno per fascia** — vive in **Servizio (Pro)**, facoltativo. È un **avviso/semaforo** per
    decidere le pending, **non blocca** nulla automaticamente.
- **% riempimento:** limite=0/assente → nessuna %, solo conteggio coperti (onesto, niente numero
  finto). Limite=N → "75% · 18/24". Oltre il limite → mostra il **valore reale (101%, 108%…)** con
  indicatore "pieno/oltre", **non blocca** la creazione manuale (avvisa e lascia fare anche da admin).
- **Vista sotto:** **Giorno** (dettaglio pieno) + **Settimana** (righe compatte: nome/ora/coperti/
  icona tipo) — soglia UI oltre cui la settimana suggerisce "passa a vista giorno" da definire in mappa.

### 3-ter.2 MAPPATURA chiusa (11-06-26, sub-agent + controverifica senior nel codice)

I 4 punti aperti, risolti nel codice (riferimenti verificati riga per riga):

1. **Flag tavolo.** Il gate è **`features.servizio` (+ `serviceSlots.length > 0`)**, NON `tableAssignments`
   (che esiste ma è inutilizzato qui). Allinearsi a `features.servizio`. La scorciatoia tavolo è **già
   correttamente gated**: `BookingCalendar.tsx:404` (`hasTurnsFeature`), pallino renderizzato solo se vero,
   `handleDotClick:592-596` apre `QuickTableAssignModal` solo se vero. In Classic senza service_slots non
   è renderizzata → decisione Matteo **già rispettata**. `PRO_BUNDLE` ON pro/enterprise, OFF classic.
2. **Campo coperti giornaliero → ESISTE MA È ORFANO (dead code).** `daily_guest_limit` è dichiarato nel
   `restaurantSettingRegistry.ts` (key riga 49, schema 125-129, parser 202-218 con sentinella DB `-1`=nessun
   limite, entry 394-408) **ma non è letto/scritto/renderizzato da nessun'altra parte** (grep: solo il
   registry). Il guscio c'è, va **completato**, non reinventato: aggiungere input in `RestaurantSettingsTab`
   (Classic, accanto a `booking_window_days`) + salvataggio (pattern `slot_guest_capacities`). ⚠️ Non
   confonderlo con `slot_guest_capacities` = limite **interno per-fascia**, quello sì già vivo e salvato.
3. **Conteggio pubblico → punto unico ESISTE, ma è solo per-fascia.** Edge `create-booking/index.ts`:
   carica le accettate del giorno (`.eq("status","accepted")`, `num_guests`, righe 289-295) e blocca per
   fascia (`SLOT_LIMIT` 409, somma 350-367). **Nessun blocco giornaliero.** Agganciare il giornaliero
   **qui, allo stesso loop**: sommare `num_guests` di tutte le accettate del giorno vs `daily_guest_limit`
   da `restaurant_settings` (già letto a riga 275, stesso pattern) → nuovo `code` es. `DAILY_LIMIT`. Conta
   solo `accepted` (già così — decisione Matteo rispettata). Separato e indipendente dal check per-fascia.
4. **Stato `BookingCalendar.tsx`:**
   - **Viste:** tutte e 4 attive (mese/settimana/giorno/lista), default per viewport (lista <630px).
   - **Drag&drop:** ✅ **già spento** (nessun `editable`/`eventDrop`/`selectable` — verificato vuoto).
     Solo da aggiungere un **test di regressione** che asserisca resti spento.
   - **Click evento** (`eventClick:502-511`): apre `BookingDetailsModal` in lettura. ✅ conforme.
   - **Click giorno** (`handleDateClick:513-520`): fa **solo `setSelectedDate`**, NON crea. → scorciatoia
     "crea prenotazione da giorno" **da costruire**.
   - **Solo accettate:** ✅ garantito a monte (`useAcceptedBookings` `.eq('status','accepted')` +
     filtro `!no_show`). Nessun pending mostrato.
   - **Digest per fasce sotto:** ✅ **esiste già e ricco** (righe 902-1135, raggruppa per fascia, con/solo-
     tavolo/orfani, turni+pallini in Pro), **ma solo per il GIORNO selezionato**. Vista **Settimana compatta
     da costruire**.
   - **% riempimento / coperti per cella-giorno:** ❌ **non esiste**, da costruire da zero.

### 3-ter.2-bis Lavoro da costruire (esito mappa — ordine suggerito)

1. **Settings:** completare `daily_guest_limit` orfano → input in `RestaurantSettingsTab` (Classic) + salvataggio.
2. **Edge:** blocco giornaliero esterno nel loop esistente di `create-booking` (`DAILY_LIMIT`, solo accettate).
3. **Calendario:** % riempimento / coperti per cella-giorno (0/assente→solo conteggio; N→"18/24·75%"; >100% reale, mai bloccante).
4. **Calendario:** scorciatoia crea-prenotazione da `handleDateClick` (data preselezionata, anche giorni pieni, avviso non bloccante).
5. **Calendario:** vista Settimana compatta del digest (righe nome/ora/coperti/icona + soglia "passa a giorno").
6. **Test:** regressione drag&drop spento + gate tavolo Classic/Pro.

### 3-ter.2-ter ⚠️ FIX PRIORITARI da QA Matteo (11-06-26) — ✅ CHIUSI (11-06-26)

Trovati testando in dev. Risolti tutti e 4 (uno annullato perché non-bug). Report:
`docs/Sessioni di lavoro/11-06-26/Report-m2-calendario-fix-qa-11-06-26.md`.

1. ✅ **Badge cella-giorno — RISOLTO.** Il badge ora è montato via **`dayCellDidMount`** come figlio del
   `.fc-daygrid-day-frame` (non dentro il numero giorno → niente più ammasso a destra). Decisione finale
   Matteo: mostra **solo la percentuale di occupazione** (con limite) oppure il **solo conteggio coperti**
   (senza limite); niente `N/Nmax`. Posizione **in alto a sinistra** su desktop (font ingrandito a 0.8125rem),
   **in basso a sinistra** su mobile ≤640px (per non sovrapporsi al numero giorno). File: `BookingCalendar.tsx`
   `buildDayFillBadgesHtml` + `dayCellDidMount`; `index.css` `.booking-day-fill` + `.booking-day-fill-holder`.
2. ✅ **Help fascia — RISOLTO.** Il testo residuo era in **`ServiceSlotsManager.tsx:587`** (FormInfoPanel
   "coperti massimi", non in `RestaurantSettingsTab`). Ora dice che il limite per-fascia è un **avviso/
   semaforo che non blocca né rifiuta** — coerente con la regola dei due limiti morbidi.
3. ✅ **Pulsante "Nuova prenotazione" — RISOLTO.** Rimosso il toggle `showCreateButton`: il pulsante è
   **sempre visibile** sul giorno selezionato. `handleDateClick` ora fa solo `setSelectedDate`. File:
   `BookingCalendar.tsx`. *(Nota: supera la decisione 12 del context §5-ter, che descriveva il toggle.)*
4. ✅ **Vista Giorno — ANNULLATO (non era un bug).** Verificato con Matteo: le prenotazioni che non
   comparivano nella fascia erano semplicemente **fuori fascia oraria** (finiscono nella sezione "Fuori
   fascia", corretto). Il raggruppamento per orario funziona già. `filterByTurn` e l'apparato turni Pro
   **lasciati invariati**.

### 3-ter.3 Test da costruire (marcatore `@admin-blindatura: calendario`)

Scenari minimi (definitivi dopo la mappa):

- calendario mostra **solo accettate** (pending assenti);
- % riempimento: assente con limite 0; "N/M" con limite; **>100% mostrato reale** senza cap;
- scorciatoia tavolo **assente in Classic**, presente in Pro (test su entrambe le edition);
- click-giorno apre nuova-prenotazione anche su giorno pieno (con avviso-sforo);
- **nessun drag&drop** sposta data/ora (regressione);
- rifiuta/cancella raggiungibili **solo** da modale dettaglio con conferma.

### 3-ter.4 Criterio uscita Area 2-bis

- mappa chiusa (4 punti §3-ter.2 risolti nel codice);
- limite esterno giornaliero implementato in Impostazioni + agganciato al blocco pubblico;
- scorciatoia tavolo gated dietro feature flag, invisibile in Classic;
- test `@admin-blindatura: calendario` verdi; `npm run validate` verde;
- controtest sub-agent (flusso dati + utente/responsive vista settimana);
- doc (context §5-ter, test index, skill) allineati.

---

## 3-quater. Area 3 — Impostazioni / Personalizza Form (M4)

### 3-quater.1 Intervista chiusa con Matteo (15-06-26)

Decisioni in `ADMIN_SETTINGS_CONTEXT.md` §8 e report
[`Report-intervista-m4-admin-impostazioni-15-06-26.md`](../Sessioni%20di%20lavoro/15-06-26/Report-intervista-m4-admin-impostazioni-15-06-26.md).

Sintesi operativa:

- Anagrafica: nome obbligatorio; contatti opzionali con cap 45/65/30/120; no fallback nome finto in Prenota.
- Orari: opzionali; malformati → admin non salva; pubblico safe e senza sezione se tutti chiusi.
- Limiti: `daily_guest_limit` vivo (pubblico + avviso admin); **`booking_window_days` orfano** (registry only, fuoriscope — rimosso da Fase C 15-06-26).
- Personalizza form: card + carosello core; cambio presentazione con conferma distruttiva (già cablato).
- Salvataggio: footer esplicito + `PublicDataSaveConfirmModal` (FU-005); guard multi-sorgente (`restaurant-settings`, `booking-form-config`).

### 3-quater.2 MAPPATURA chiusa (15-06-26, read-only nel codice)

Gap principali (dettaglio tabella §3 report M4):

| # | Gap | File toccati in Fase C |
|---|-----|------------------------|
| G3/G4/G6/G7 | Nome fallback `organizationName`; indirizzo obbligatorio in registry; cap nome 40≠45; cap contatti assenti in UI | `useRestaurantName.ts`, `restaurantSettingRegistry.ts`, `bookingPrenotaTextLimits.ts`, `RestaurantSettingsTab.tsx` |
| G9 | Footer Prenota mostra «Chiuso» invece di nascondere Orari | `BookingRequestPage.tsx`, `businessHours.ts` |
| G16 | `booking_window_days` — **fuoriscope** (implementato poi rimosso 15-06-26) | registry only; nessun consumer UI/pubblico |
| G2/G20 | Salva con nome vuoto non disabilitato; due footer/modali per sotto-tab Impostazioni | `RestaurantSettingsTab.tsx`, eventuale unificazione padre |

**Già conformi (non rifare):** `daily_guest_limit` + edge `DAILY_LIMIT`, EmptyState form (M6), modale dati pubblici (FU-005), presentazione card/carosello + conferma, avviso capienza admin non bloccante, `app_theme` solo admin.

### 3-quater.3 Test da costruire (marcatore `@admin-blindatura: settings`)

- `@admin-blindatura: settings-registry` — validate registry (nome, contatti, cap, daily 0/vuoto).
- `@admin-blindatura: settings-anagrafica-ui` — save blocked nome vuoto; contatti vuoti OK; modale pubblica.
- `@admin-blindatura: settings-business-hours` — orari tutti chiusi → niente footer Orari; overlap blocca admin.
- E2E smoke 375/834/1280: Anagrafica, Orari disattivati, Personalizza form, guard uscita, EmptyState Prenota.

### 3-quater.4 Criterio uscita Area 3

- Gap §3-quater.2 implementati o tracciati come voluto/M5;
- test `@admin-blindatura: settings-*` verdi; `npm run validate` verde;
- `ADMIN_SETTINGS_CONTEXT.md`, `ADMIN_TEST_SUITE_INDEX.md`, registro stati §5 aggiornati;
- controtest sub-agent (flusso dati + utente/responsive Impostazioni + Prenota footer).

---

## 4. Prompt anti-rottura per sub-agent

Quando si delega un fix:

```text
Profilo: Esecuzione
Modalita: deep
Skill da leggere: docs/Admin-Skill/ADMIN_SKILL.md + docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md + context dell'area
Output attesi: solo il fix descritto e i test indicati; niente output extra senza chiedere Si/No prima.

Stai modificando [area/flusso] per [decisione/finding].
Tocca solo [file/superfici].
NON toccare [lock/parti funzionanti].
Preserva questo senso utente: [decisione Matteo].
Se per fixare devi cambiare una parte non elencata o una LOCK, fermati e riporta il finding.
Dopo il fix esegui test mirati + comando concordato.
```

---

## 5. Registro stati

Aggiornare a fine area.

| Area | Stato | Report / note |
|---|---|---|
| Shell / ingresso / navigazione globale | ✅ blindato (10-06-26) | FU-042 E2E + suite shell; M1 su `main` privato |
| Prenotazioni operative | ✅ cancello M2 (11-06-26) | Vitest **32** + E2E **7** (FU-043: capienza/orario passato + modali 375/834); validate **536**. Residui U3/U9/D6/D7/L* fuori cancello |
| Tab Calendario (M2) | ✅ blindato + merged prod (11-06-26) | Batch A+B + Fase C + **C-U2** guard tab modale; validate **527**; QA badge §9 OK; C-U3 → FU-048 Pro |
| Impostazioni / Personalizza Form | 🟢 Fase C (15-06-26) | Report Fase C; G2–G9, G20 chiusi; G16 fuoriscope rimosso |
| Menu admin / magazzino | ✅ **BLINDATO** (11-06-26) | Report [`Report-finale-m3-menu-blindato-11-06-26.md`](../Sessioni%20di%20lavoro/11-06-26/Report-finale-m3-menu-blindato-11-06-26.md); validate **554**; solo FU-M3-QA-CT extra fuori cancello |
| Servizio | ⬜ | Include walk-in e tavoli occupati |
| CRM | ⬜ | Attenzione email normalizzata e delete multi-step |
| Home / Analytics | ⬜ | Attenzione finestre data e KPI |
| Cross-area prod-ready | ⬜ | Da eseguire a fine ciclo o incrementalmente |
