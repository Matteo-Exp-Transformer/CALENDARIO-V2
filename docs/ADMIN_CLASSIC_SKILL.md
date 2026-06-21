---
name: admin-classic
description: >-
  Skill di blindatura per la pagina Admin Classica (AdminDashboard e suoi componenti core booking).
  Carica questo skill PRIMA di modificare qualsiasi file della lista LOCK qui sotto, o quando un task
  potrebbe avere side-effects sull'admin classica. Definisce cosa è intoccabile, perché, e come spiegarlo
  all'utente prima di proporre modifiche.
---

# Admin Classic Skill — Pagina Admin blindata

> **Scopo commerciale**: l'app è venduta in edition differenziate (Classic, Pro, Enterprise) decise dal campo `tenants.edition` in Supabase. La pagina Admin Classica è il **prodotto base** che TUTTI i clienti vedono, anche chi non paga niente di più. Romperla = rompere il prodotto per ogni cliente.

---

## 0. Regola d'oro per gli agenti — verifica strutturale obbligatoria

**Prima di modificare qualsiasi file della LOCK list qui sotto, l'agente DEVE:**

1. **Leggere per intero** tutti i file da toccare e i file collegati (chiamanti, tipi, componenti condivisi). Mai editare avendo letto solo un frammento da grep.
2. **Identificare i conflitti**: quali contratti (prop, tipi, query keys, mutation signature) verrebbero cambiati? Qual è il rischio per Classic?
3. **Procedere solo se** la modifica preserva l'integrità strutturale e i contratti esistenti.

**Attendere conferma esplicita SOLO se** la modifica viola un invariante documentato (es. rimuove una mutation, cambia una prop obbligatoria, altera la logica di risoluzione tenant).

Per tutto il resto: procedi, ma comunicare il flusso utente impattato **dopo** la modifica in linguaggio utente (vedi `COMUNICAZIONE_UTENTE_SKILL.md`).

---

## 1. LOCK list — file blindati

### `src/pages/AdminDashboard.tsx` — LOCK strutturale
**A cosa serve**: è la pagina principale che il ristoratore vede dopo il login. Contiene l'Header in alto, i 5 NavItem button (Calendario, Prenotazioni, CRM tab, ecc.), e il corpo che cambia in base al tab selezionato. È **l'unica pagina che vedono i clienti edition Classic**.

**Cosa si rompe se la tocchi senza criterio**:
> Mario è un ristoratore con versione Classic. Al mattino apre l'app per vedere le prenotazioni del giorno. Se questo file è rotto, vede una pagina bianca o un layout sballato e non può lavorare. Non ha altre pagine, non ha sidebar, ha solo questo. Se rompi questo, rompi il prodotto base.

**Modifiche permesse**:
- Aggiungere nuove **prop opzionali** con default sensati
- Wrapper esterni che la avvolgono senza modificare il contenuto
- Bug fix isolati con test di non-regressione

**Modifiche vietate senza spiegazione preventiva approvata**:
- Rimuovere o modificare i tab esistenti
- Cambiare la logica del calendario o delle form
- Hardcodare feature avanzate (CRM esteso, walk-in, analytics) dentro il file
- Aggiungere prop obbligatorie (rompono la versione standalone)
- Modificare il sistema di gestione tema (`data-admin-theme`)

---

### `src/features/booking/components/BookingCalendar.tsx` — LOCK core
**A cosa serve**: è il calendario che mostra le prenotazioni del ristorante per giorno/settimana/mese. È il **cuore operativo** della giornata del ristoratore.

**Cosa si rompe se la tocchi senza criterio**:
> Luigi gestisce la sala. Apre l'app, clicca Calendario, vuole vedere tutti i tavoli prenotati per stasera. Se questo file è rotto: o non vede le prenotazioni, o le vede ma non può cliccarci sopra per modificarle, o la pagina crasha. Conseguenza: Luigi non sa chi viene a cena stasera. Disastro operativo.

**Modifiche permesse**:
- Feature opt-in **gated da FEATURES flag** (es. `if (features.walkIn) ...`)
- Bug fix isolati
- Aggiustamenti **layout UI** tab Calendario secondo `docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md` (costanti, CSS var celle, titolo responsive)

**Modifiche vietate senza spiegazione preventiva**:
- Cambiare il modello dati di una prenotazione
- Rimuovere stati esistenti (accepted, pending, ecc.)
- Aggiungere logica che assume feature avanzate sempre attive

---

### `src/features/booking/components/AdminBookingForm.tsx` + `BookingRequestForm.tsx` — LOCK core
> ⚠️ Nota refactor: il vecchio `BookingForm.tsx` **non esiste più**, è stato diviso in due file. `AdminBookingForm.tsx` = form lato ristoratore («Inserisci Nuova Prenotazione»); `BookingRequestForm.tsx` = form pubblico cliente (pagina Prenota).

**A cosa serve**: form per creare/modificare una prenotazione. Versione admin (ristoratore) e versione pubblica (cliente finale) condividono campi e validazioni ma vivono in due componenti separati.

**Cosa si rompe se la tocchi senza criterio**:
> Una cliente, Anna, va sul sito del ristorante per prenotare un tavolo per il suo anniversario. Se la form è rotta, non può prenotare. Il ristorante perde il cliente, l'app non funziona per la sua promessa base.

**Modifiche permesse**: bug fix, validazioni più precise (non meno).
**Modifiche vietate**: rimuovere campi richiesti dal DB, cambiare logica di submit.

---

### `src/features/booking/components/PendingRequestsTab.tsx` + `ArchiveTab.tsx` — LOCK core
> ⚠️ Nota refactor: il vecchio `BookingsList.tsx` **non esiste più**. L'elenco prenotazioni vive nei tab `PendingRequestsTab.tsx` (richieste da gestire) e `ArchiveTab.tsx` (storico), con `BookingRequestCard.tsx` per ogni riga.

**A cosa serve**: liste delle prenotazioni con filtri e azioni rapide. Vista alternativa al calendario.

**Cosa si rompe**: il ristoratore non vede l'elenco prenotazioni, non può accettarle/rifiutarle.

---

### `src/features/booking/components/BookingDetailsModal.tsx` — LOCK strutturale
**A cosa serve**: finestra che si apre cliccando una prenotazione, mostra dettagli + bottoni azione (accetta/rifiuta/modifica/no-show).

**Cosa si rompe**:
> Mario clicca su una prenotazione per vedere il numero di telefono del cliente e accettarla. Se questo modal è rotto, o non si apre o non mostra il bottone "Accetta" → Mario non riesce a confermare la prenotazione.

**Modifiche permesse**: bottoni aggiuntivi gated (es. No-show già gated).
**Modifiche vietate**: rimuovere bottoni core (Accetta/Rifiuta/Modifica).

---

### `src/features/booking/components/RestaurantSettingsTab.tsx` — LOCK strutturale
**A cosa serve**: tab impostazioni ristorante (orari, capacità, preferenze).

**Cosa si rompe**: il ristoratore non può configurare il suo ristorante. Onboarding bloccato.

> ⚠️ I vecchi `SettingsTab.tsx`, `EmailLogsModal.tsx`, `TestEmailModal.tsx`, `useEmailLogs.ts` **non esistono più** — sostituiti da `RestaurantSettingsTab.tsx`. Non reintrodurli.

---

### `src/features/booking/hooks/useBookingMutations.ts` — LOCK core
**A cosa serve**: contiene le funzioni che modificano lo stato delle prenotazioni nel database (accetta, rifiuta, modifica, cancella, segna no-show). È il **motore di tutte le azioni** sulla dashboard.

**Cosa si rompe**:
> Mario accetta una prenotazione cliccando il bottone verde. Se questo hook è rotto, il click non fa niente, oppure cambia lo stato in DB ma la UI non si aggiorna, oppure peggio: cambia lo stato sbagliato. Il ristoratore non si fida più dell'app.

**Modifiche permesse**:
- Aggiungere `queryClient.invalidateQueries` per nuove query keys (no-op se la query non esiste, **non rompe Classic**)
- Migliorare error handling
- Cambiare `console.log` in `logger.xxx`

**Modifiche vietate**:
- Cambiare la signature pubblica delle mutation
- Rimuovere mutation esistenti
- Cambiare logica transazionale senza spiegazione preventiva

---

### `src/features/booking/hooks/useCustomers.ts` — LOCK parziale
**A cosa serve**: gestisce i dati dei clienti (lettura/scrittura tabella `customers`). Usata dal CRM tab classico **e** dal CRM esteso (sidebar).

**Cosa si rompe**:
> Mario sta scrivendo una prenotazione, l'app dovrebbe suggerirgli i clienti già registrati con quel nome. Se questo hook è rotto, non vede suggerimenti, deve riscrivere tutto a mano.

**Regola speciale**: le funzioni base usate dall'admin classica sono LOCK. Le funzioni avanzate (filtri, export, segmentazione) usate solo dal CRM esteso possono essere modificate liberamente.

---

### `src/contexts/TenantContext.tsx` — LOCK ASSOLUTO + eccezione edition
**A cosa serve**: identifica QUALE ristorante sta usando l'app in questo momento. Senza questo, l'app non sa di chi mostrare i dati.

**Cosa si rompe**:
> Mario fa login ma l'app non capisce che lui è "Pizzeria da Mario" → gli mostra dati di un altro ristorante, o niente. **Data leak gravissimo** o app inutilizzabile.

**Modifiche permesse SOLO**:
- Aggiungere il campo `edition` letto dalla query tenant (parte del Plan Edition System)

**Tutto il resto è LOCK ASSOLUTO**. Non toccare logica di risoluzione tenant, non toccare gestione sessione.

---

### `src/lib/supabase.ts` / `src/lib/supabasePublic.ts` — LOCK ASSOLUTO
**A cosa servono**: connessione al database. `supabase` per admin loggato, `supabasePublic` per form pubblici.

**Cosa si rompe**: l'app non parla più col database. Nulla funziona.

**Modifiche permesse**: nessuna senza esplicita richiesta dell'utente con motivazione.

---

## 2. Regola di separazione: sidebar non sporca admin classica

Le feature sidebar (CRM esteso, Servizio, Analytics, Home) NON devono:

1. **Importare codice dai file LOCK** se non tramite interfacce pubbliche (prop, hook esposti).
2. **Modificare hooks booking core** (`useBookingMutations`, `useCustomers` parte base) senza gating via FEATURES flag.
3. **Aggiungere prop obbligatorie** ad AdminDashboard o suoi sotto-componenti core (rompe la versione standalone Classic).

**Esempio scorretto**:
> Stai aggiungendo una nuova feature "report mensile" in Analytics e per pigrizia modifichi `BookingCalendar` per esporre un nuovo dato. → **VIETATO**. Crea un nuovo hook che legge dal DB e lo usa Analytics, senza toccare BookingCalendar.

**Esempio corretto**:
> Stai aggiungendo "no-show" che è una feature Pro. Modifichi `BookingDetailsModal` aggiungendo il bottone, MA il bottone è dentro `if (features.noShow)`. Risultato: edition Classic non vede il bottone, modal funziona come prima.

---

## 3. Quando un agente sta per modificare un file LOCK

**Workflow**:

```
1. Agente legge il task
2. Identifica i file da toccare
3. Verifica se almeno uno è in LOCK list
4. SE SÌ:
   → Legge per intero tutti i file da toccare + file collegati
   → Identifica contratti che cambiano e rischi per Classic
   → SE viola un invariante documentato → spiega il rischio a Matteo e aspetta conferma
   → SE non viola invarianti → procede, poi comunica in linguaggio utente cosa è cambiato
5. SE NO:
   → Procede normalmente
```

**Esempio di comunicazione post-modifica** (in linguaggio utente):

> Ho aggiunto un filtro "solo confermate" nel calendario. Ora Mario può cliccare il toggle in alto e vedere solo le prenotazioni già accettate. Di default il calendario mostra tutto come prima, quindi nessun cambiamento per chi non usa il filtro.

Non serve una spiegazione formale 5 punti a meno che la modifica non tocchi un invariante (mutation signature, prop obbligatoria, logica tenant).

---

## 4. Stato attuale

> Cronologia sessioni e commit chiave: vedi [`docs/SESSION_LOG.md`](SESSION_LOG.md).

Snapshot del comportamento **oggi** sui file LOCK (non changelog per sessione). Per orari DB → **§4b**; per layout tab Calendario → **§4c** + `BOOKING_CALENDAR_LAYOUT_CONTEXT.md`.

### `AdminDashboard.tsx` (in `AdminShell`)

- Montato dentro `AdminShell`; layout corpo `min-h-0 flex-1`.
- Prop opzionali: `bodyOverride?: React.ReactNode` (contenuto alternativo nel corpo, Header+NavItem restano) e `onBodyOverrideExit?: () => void` (click NavItem mentre `bodyOverride` è attivo — es. uscita da Home Pro).
- Tab **Prenotazioni — collapse «Inserisci Nuova Prenotazione»**: i 5 NavItem restano sempre visibili; con il pannello form aperto si nascondono solo le sotto-righe del tab (statistiche Calendario, filtri Archivio, toolbar Menu, intro Impostazioni, bottone Form Pubblico). Il `<main>` con la lista richieste resta `hidden` finché il form è aperto, salvo `bodyOverride`.
- Tab **Calendario**: eccezione padding `max-w-none px-1 md:px-1.5` — dettaglio in **§4c**.

### `BookingCalendar.tsx`

- Feature opt-in gated: icona walk-in se `features.walkIn`; turni/badge “Da assegnare” se `features.servizio`.
- Selettore viste FullCalendar: sotto `lg` (mobile/tablet) renderizza solo **Mese** e **Lista**; da
  `lg` mostra anche **Settimana** e **Giorno**. Se il viewport scende sotto `lg` mentre è attiva una
  vista desktop-only, passa a **Mese**; tornando desktop mantiene la vista corrente.
- Orari fasce: `useServiceSlots()` + `useDigestSlotConfigs()` da `useServiceSlots.ts` (tabella `service_slots`, non JSON in `restaurant_settings`).
- Digest giorno: `DayDigestSummaryPanel` + `DayServiceGroupCard` collapse + `DayHourGroup` + `BookingDigestCard`; la card ha: (1) nome cliente a tutta larghezza (nessuna icona tipologia — rimossa); (2) ospiti + orario; (3) badge tipologia (tipologia prenotazione + card scorrevole) sotto i dati, sulla stessa riga con wrap — massimo 3 badge senza duplicati, label da `booking_public_form_config.booking_modes[].booking_badge_label` / `sub_tabs[].booking_badge_label`, fallback a label tipologia/card scorrevole; `booking_badge_enabled === false` nasconde quel badge, e il badge card compare solo per sotto-tab `display === 'cards'`, mai per carosello; (4) badge `DA ASSEGNARE` solo se Pro senza tavolo, **esterno** alla card agganciato al bordo in alto a destra (`absolute -translate-y-full`, `bg-surface` + bordo, `rounded-b-none`), così non ruba spazio al nome — cliccabile apre `QuickTableAssignModal`. Assegnazione rapida tavolo via badge `DA ASSEGNARE` + `QuickTableAssignModal` (Pro).
- Digest settimana: resta compatto e usa `DigestBookingListRow`.
- Layout responsive tab Calendario: **§4c**.

### `BookingDetailsModal.tsx`

- No-show: `features.noShow && canMarkNoShow`.
- Conferme azioni distruttive: `BookingDangerActionModal` per No-show ed Elimina (signature mutation invariata).
- Orario passato: `PastStartTimeWarningModal` + `isWallClockStartBeforeNow` prima di Salva.
- Display fascia: `useDigestSlotConfigs()`.
- **Appunti admin (21-06-26):** `DetailsFormData` include `adminNotes: string`; `buildFormDataFromBooking` legge `booking.admin_notes`; `performSave` scrive `adminNotes` → `useUpdateBooking`. La dirty-detection (`isDetailsFormDirty`) copre il campo in automatico (JSON.stringify del formData). Nessuna prop extra sul componente: `formData` è già passato intero a `DetailsTab`.
- **Layout mobile (21-06-26 / 21-06-26 bis):** content area (`flex-1`) ha `min-h-0` per il footer sticky. **Il contenitore esterno del modal usa `height: '100dvh'` (non `100vh`):** con lo scroll del body bloccato la barra del browser mobile resta visibile, quindi `100vh` spingeva il footer (Modifica/Elimina/No-show) sotto la barra e su mobile non era raggiungibile. Non reintrodurre `100vh`.

### `useBookingMutations.ts`

- Invalidazioni `HOME_STATS_QUERY_KEY` e `ANALYTICS_QUERY_ROOT` — no-op in Classic, safe.
- Ogni accept/modifica che scrive `confirmed_start` deve scrivere anche `desired_time` — vedi **§4b** (`useAcceptBooking` deriva `desired_time` da `confirmedStart` se assente).

### `RestaurantSettingsTab.tsx`

- Sezione «Imposta Fasce Orarie» solo Classic (`!features.servizio`); lettura/scrittura su `service_slots` via `useUpdateServiceSlot`.
- Se `end_time < start_time` su una fascia: avviso `OVERNIGHT_TIME_END_HINT`.
- Sezione «Aree di posizionamento» **rimossa** da Impostazioni (non si legge/scrive più `booking_placement_areas` da questo tab).
- **Limiti coperti — nuovo modello (18-06-26):** sezione «Coperti massimi al giorno» (`daily_guest_limit`)
  **RIMOSSA**. Dentro «Imposta Fasce Orarie» due toggle: «Attiva limiti coperti per fascia»
  (`slot_limit_enabled`, interruttore globale) e «Rifiuta richieste fuori dalle fasce»
  (`booking_reject_out_of_slot`). Cap per-fascia restano in `slot_guest_capacities`. Tutti bloccano solo
  il pubblico via edge (`SLOT_LIMIT`/`OUT_OF_SLOT`), mai l'admin. Dettaglio: `ADMIN_SETTINGS_CONTEXT.md §8`.

### `AdminBookingForm.tsx` + `DetailsTab.tsx`

- Campo **Posizionamento** (`booking_requests.placement`, opzioni da `booking_placement_areas`) visibile solo Pro/Enterprise (`features.servizio`). In Classic: nessun selettore nel form admin, nessuna riga nel modale dettaglio; creazione admin forza `placement: null` (`useCreateAdminBooking`).
- **Card «Appunti» (21-06-26):** `DetailsTab` mostra una card full-width sotto «Info Prenotazione». In edit: `textarea` legata a `formData.adminNotes` via `onFormDataChange`. In view: testo salvato o «Nessun appunto» se vuoto. Salvataggio via il Salva generale del modal (`performSave → useUpdateBooking → admin_notes`). Niente salva dedicato. Disponibile su tutte le tipologie (non gated edition).
- Promo menù in dettaglio: `DetailsTab` mostra il **testo cliente** (`message`) della promo via `resolveMenuPromoMessageForBookingView` dalle impostazioni correnti. Non usa lo snapshot `menu_promo_labels` per la vista — se il testo cambia dopo la prenotazione si vede quello attuale. Blocco assente se nessuna promo abbinata alla tipologia. Sola lettura (nessun blocco in modifica).
- **Intolleranze — suffisso ospiti:** in viste read-only admin (`BookingRequestCard` espanso, `DietaryTab` view) il suffisso «- N ospite/i» compare solo se `guest_count >= 1` (`shouldShowDietaryGuestCount`). Il testo libero da Pagina Prenota salva `guest_count: 0`; l'inserimento strutturato in admin (`DietaryTab` / `DietaryRestrictionsStructuredSection` edit) resta con conteggio ≥1.
- **DetailsTab layout mobile (21-06-26 bis):** l'ordine mobile è garantito dall'**ordine del DOM**, non solo dalle classi `order-*` (su alcuni browser mobile risultavano ignorate). **Informazioni Cliente è il primo figlio** della griglia (`md:order-2`), poi Dati Prenotazione + Note (`md:order-1`). Mobile: Informazioni Cliente → Dati Prenotazione → Note Speciali. Desktop (2 colonne) invariato via `md:order-*` (Dati a sinistra, Cliente a destra).
- **DietaryTab note lunghe (21-06-26):** `<li>` e `<span>` note usano `wrap-break-word` (Tailwind v4) per evitare overflow orizzontale su mobile.

### `useCapacityCheck.ts`

- Usa `useServiceSlots()` e `useDigestSlotConfigs()`. Priorità capienza per fascia: `service_slots.max_guests` → fallback `slot_guest_capacities` in `restaurant_settings`. Classic invariato se `max_guests` è null.

### Fasce orarie — hook condiviso (`useServiceSlots.ts`)

- `useServiceSlots()`: query unica su `service_slots`.
- `useDigestSlotConfigs()`: mappa gli slot in `SlotConfig[]` per digest, capacity e display — **nessuna query DB aggiuntiva**.

### `AdminHomePage.tsx` + `useHomeStats.ts`

- Sezione “prossime 3 ore”: `UpcomingBooking.start_time` è stringa `HH:mm` (da `desired_time` o `extractTimeFromISO`), non `format()` su `Date`.

### `PastStartTimeWarningModal` (UX orario passato)

- Prima di accettare da *Richieste in attesa*, salvare in **BookingDetailsModal**, o inviare **AdminBookingForm**: se data+ora locale sono nel passato → dialog di conferma; dopo OK → catena capienza → `CapacityWarningModal` → mutate/salvataggio come prima.

### Check disponibilità fascia (form pubblico Prenota)

- Server: `supabase/functions/create-booking/index.ts` (guard cap `cap - occupied`, override `service_slot_overrides`).
- Decisione WP-B5 (12-06-26): il pre-check client `check-slot-availability` è rimosso dal repo e da `BookingRequestForm`. La fonte unica resta `create-booking`: se la fascia supera il limite, risponde 409 al submit. Non reintrodurre chiamate fail-open a Edge Function non deployate.
- **Nuovo modello limiti (18-06-26):** edge ha **rimosso** il blocco `DAILY_LIMIT`. Cap per-fascia letto da
  `slot_guest_capacities` (priorità `override → service_slots.max_guests → slot_guest_capacities[id]`),
  gated da `slot_limit_enabled`. Nuovo blocco `OUT_OF_SLOT` (gated da `booking_reject_out_of_slot`) se
  l'orario non cade in nessuna fascia. Entrambi default OFF. Badge calendario `BookingCalendar`: % sulla
  SOMMA dei cap per-fascia del giorno solo se limiti ON e TUTTE le fasce hanno cap, altrimenti conteggio.
  **Edge deployata su TEST `docnnernvp` (v21); PROD `rwuxgvld` NON deployata** (vedi FOLLOW_UP).

---

## 4c. Layout UI tab Calendario (23-05-26)

Fonte unica per agenti UI: **`docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md`**.

In sintesi (non sostituisce il file sopra):

| Area | Comportamento |
|------|----------------|
| Contenitore tab | `max-w-none px-1 md:px-1.5` (`AdminDashboard`) |
| Card titolo | `max-w-7xl` + `CALENDAR_TITLE_SECTION_INSET_CLASS` |
| Celle mese FC | `--booking-calendar-day-min-height`: 128px / 112px (≤630px JS) — **no** `dayMinHeight` FC |
| Titolo h2 | CSS `index.css`: &lt;470px 1.375rem sx; 470–639 1.5rem sx; ≥640 centrato 1.5rem; ≥768 1.875rem |
| Data | Accanto a **Oggi** da **lg** (1024px) in su; sotto tablet/mobile solo pulsante **Oggi** (dettaglio in `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` §7) |

---

## 4b. Modello orario prenotazioni — REGOLA CRITICA

> Leggere questa sezione prima di toccare qualsiasi logica di data/ora nelle prenotazioni.

### Il problema di fondo
PostgreSQL `timestamptz` non conserva il "testo dell'orario" — conserva un istante assoluto. Se si salva `20:15+00:00` e il server ha fuso `+02:00`, la SELECT restituisce `22:15+02:00`. Leggere le cifre letterali dalla stringa ISO (come fa `extractTimeFromISO`) darebbe `22:15` invece di `20:15`.

### Soluzione adottata (due pilastri)
1. **`desired_time`** (campo `TIME` di Postgres) — non subisce conversioni di fuso. È l'**ancora primaria** per il display. `getAccurateStartTime` lo preferisce sempre su `confirmed_start`.
2. **Garanzia di scrittura** — ogni mutation che scrive `confirmed_start` deve scrivere anche `desired_time`. In `useAcceptBooking` questo è ora forzato: se `desiredTime` non arriva dal chiamante, viene derivato da `confirmedStart` **prima** che PostgreSQL lo tocchi (quando ha ancora offset `+00:00`).

### Funzioni coinvolte
| Funzione | File | Ruolo |
|----------|------|-------|
| `createBookingDateTime(date, time)` | `dateUtils.ts` | Scrive l'orario con offset `+00:00` — mai usare `toISOString()` |
| `extractTimeFromISO(iso)` | `dateUtils.ts` | Legge HH:mm dalla stringa — sicuro solo con offset `+00:00` |
| `getAccurateStartTime(booking)` | `dateUtils.ts` | Preferisce `desired_time`, fallback su `extractTimeFromISO(confirmed_start)` |
| `getAccurateEndTime(booking)` | `dateUtils.ts` | Stessa logica per l'orario di fine |
| `isWallClockStartBeforeNow(date, HH:mm)` | `dateUtils.ts` | Solo UX: confronta `(anno,mese,giorno,ora,min)` locale con `Date.now()` — **non** sostituisce `createBookingDateTime` per scritture DB |

### Regole operative
- **MAI** usare `new Date(isoString).toISOString()` per costruire `confirmed_start` — produce offset `Z` invece di `+00:00` e rompe `extractTimeFromISO` su alcuni driver.
- **MAI** omettere `desired_time` quando si accetta o modifica una prenotazione.
- **Ogni nuova mutation** che scrive `confirmed_start` DEVE anche scrivere `desired_time`.
- Il test di non-regressione è `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts` (28 test). Se fallisce, c'è un bug di orario.

---

## 5. Quick reference per agenti

```
FILE LOCK STRUTTURALE  → spiegazione preventiva obbligatoria, mods solo via prop/wrapper
FILE LOCK CORE         → spiegazione preventiva obbligatoria, mods solo con FEATURES gating
FILE LOCK ASSOLUTO     → NON toccare senza esplicita richiesta utente con motivazione

REGOLA INVALIDAZIONI   → aggiungere invalidateQueries di query keys di altre edition è OK (no-op)
REGOLA NUOVE FEATURE   → SEMPRE dietro FEATURES flag, mai hardcoded ON
REGOLA PROP            → aggiungere prop ad AdminDashboard sempre OPTIONAL con default
```
