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

> ⚠️ Esiste anche `SettingsTab.tsx` (più `EmailLogsModal.tsx`, `TestEmailModal.tsx`, `useEmailLogs.ts`): **dead code**, sostituito da `RestaurantSettingsTab.tsx`. Non importarlo, non riusarlo — vedi `APP_CONTEXT_SKILL.md` §3a.

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

Branch `Sviluppo-Dashboard-laterale` rispetto a `main`:

- **AdminDashboard.tsx**: integrato in AdminShell. Layout `min-h-0 flex-1`. Aggiunte due prop opzionali: `bodyOverride?: React.ReactNode` (mostra contenuto alternativo nel corpo, Header+NavItem restano visibili) e `onBodyOverrideExit?: () => void` (chiamata al click NavItem quando bodyOverride è attivo). `handleTabClick()` wrappa `setActiveTab` e chiama `onBodyOverrideExit` se necessario. **Tab Prenotazioni — collapse «Inserisci Nuova Prenotazione»**: i 5 NavItem (Calendario, Prenotazioni, Archivio, Menu, Impostazioni) restano **sempre** visibili; con il pannello form aperto si nascondono solo le sotto-righe del tab (statistiche Calendario, filtri Archivio, toolbar Menu, intro Impostazioni, bottone Form Pubblico). Il `<main>` con la lista richieste resta nascosto (`hidden`) finché il form è aperto, salvo `bodyOverride` (Home Pro).
- **BookingCalendar.tsx**: feature opt-in **gated** con `useFeatures()` — icona walk-in condizionata a `features.walkIn`, turni/badge “Da assegnare” condizionati a `features.servizio`. Usa `useCanonicalTimeSlots()` per gli orari delle fasce (fonte: `service_slots` DB, non più JSON in `restaurant_settings`). **Novità 19-05-26**: `DigestBookingListRow` senza prop `slot`; card digest `bg-surface border-(--color-border)`; pallino assegnazione tavolo (Pro); `DigestSlotHeader`; griglia digest `sm:grid-cols-2`; `QuickTableAssignModal` senza prop `serviceSlots`. **Layout UI 23-05-26**: vedi **§4c** e `docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md` (celle mese 128/112px, tab full-width, titolo responsive, data su **Oggi**).
- **AdminDashboard.tsx** (tab Calendario): eccezione `max-w-none px-1 md:px-1.5` — §4c.
- **BookingDetailsModal.tsx**: bottone No-show gated con `features.noShow && canMarkNoShow`. Avviso «orario già trascorso» su **Salva** (`PastStartTimeWarningModal` + `isWallClockStartBeforeNow`). Usa `useCanonicalTimeSlots()` per il display della fascia. **Promo menù (23-05-26):** in edit menù passa `menuPromoMessages` a `MenuTab` da `booking_menu_promos` (`menuPromo.ts`); nessun omaggio automatico in `MenuSelection`. Report: `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md`. **Conferme azioni (06-06-26):** No-show ed Elimina passano da `BookingDangerActionModal` (conferma prima del mutate; signature mutation invariata).
- **useBookingMutations.ts**: aggiunte invalidazioni per `HOME_STATS_QUERY_KEY` e `ANALYTICS_QUERY_ROOT` — no-op in edition Classic, **safe**. ⚠️ **Fix orario**: `useAcceptBooking` ora scrive sempre `desired_time` nel DB — se il chiamante non lo passa, lo deriva da `confirmedStart` con `extractTimeFromISO` (che è ancora nella forma `+00:00` prima del round-trip). Senza questa garanzia, il display potrebbe mostrare l’orario sbagliato (es. +2h in CEST).
- **RestaurantSettingsTab.tsx**: la sezione “Imposta Fasce Orarie” è visibile solo in Classic (`!features.servizio`). Legge e salva le 3 fasce canoniche direttamente su `service_slots` via `useUpdateServiceSlot` (RPC). Al salvataggio: se `canonicalSlotIds` è null (tenant pre-migrazione 016), le fasce vengono saltate con `logger.warn` — le altre impostazioni vengono salvate comunque. Se `end_time < start_time` su una fascia, mostra l’avviso `OVERNIGHT_TIME_END_HINT`. **Novità 19-05-26**: rimossa la sezione “Aree di posizionamento” (`<section aria-labelledby=”placement-areas-heading”>`) — incluse costanti, funzioni, stati, handler e query `booking_placement_areas`. Il campo non viene più né letto né scritto in `restaurant_settings`.
- **AdminBookingForm.tsx** + **DetailsTab.tsx** (23-05-26): il campo **Posizionamento** (preferenza sala su `booking_requests.placement`, opzioni da `booking_placement_areas`) è visibile e selezionabile **solo in Pro/Enterprise** (`features.servizio`). In Classic: nessun selettore nel form “Inserisci Nuova Prenotazione”, nessuna riga nel modale dettaglio (view/edit); creazione admin forza `placement: null` (`useCreateAdminBooking` + payload form). `BookingDetailsModal.tsx` non modificato.
- **useCapacityCheck.ts**: usa `useServiceSlots()` oltre a `useCanonicalTimeSlots()`. La capacità per fascia segue questa priorità: `service_slots.max_guests` (impostabile in Pro da Servizio) → fallback su `slot_guest_capacities` in `restaurant_settings`. Classic funziona identicamente a prima se `max_guests` è null.
- **useCanonicalTimeSlots()** in `useServiceSlots.ts`: non ridefinisce più la queryFn — chiama direttamente `useServiceSlots()` e filtra le canoniche. Una sola query al DB condivisa con tutti i consumer.
- **Bug Home risolto**: cliccando Home nella sidebar, Header e NavItem restano visibili. Il contenuto Home passa via `bodyOverride`.
- **AdminHomePage.tsx**: sezione “prossime 3 ore” ora mostra `b.start_time` (stringa HH:mm sicura) invece di `format(b.start, ‘HH:mm’)` su oggetto Date — eliminato il +2h in CEST.
- **useHomeStats.ts**: `UpcomingBooking` espone `start_time: string` (da `desired_time` o `extractTimeFromISO`) in luogo di `start_iso`.
- **PastStartTimeWarningModal** + `isWallClockStartBeforeNow` in `dateUtils.ts`: prima di accettare dalla tab *Richieste in attesa*, di salvare modifiche in **BookingDetailsModal**, o di inviare **AdminBookingForm** (“Inserisci Nuova Prenotazione”), se data e ora di inizio (orologio locale) sono già nel passato si mostra un dialog di conferma; dopo OK si ripete la catena capienza → `CapacityWarningModal` → mutate/salvataggio/creazione come prima.

- **Check disponibilità fascia pubblica** (A5, 22-05-26): `supabase/functions/create-booking/index.ts` contiene guard server-side che calcola `cap - occupied` per la fascia corrispondente all'orario richiesto, usando `service_slot_overrides` per override data-specifica. `supabase/functions/check-slot-availability/index.ts` è la EF pre-check chiamata da `useCheckSlotAvailability` hook (usato in `BookingRequestForm` prima del submit). Doppia guardia: client blocca con toast, server blocca con 409 SLOT_LIMIT contro race condition. Logica: `confirmed_start` delle prenotazioni accepted nel range `desired_date T00:00:00`–`T23:59:59` + overlap fascia → somma `num_guests` → confronto con cap. Verificato funzionante su Pro e Classic (22-05-26).

**Riferimento completo**: `docs/Sessioni di lavoro/15-05-26/Revisionate da claude/Report-unificazione-fasce-orarie-canoniche.md` (sessione 15-05). `docs/Sessioni di lavoro/19-05-26/Report-pallino-assegnazione-tavolo.md` (sessione 19-05). `docs/Sessioni di lavoro/22-05-26/Report-A5-check-disponibilita-fascia-pubblica.md` (sessione 22-05).

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
