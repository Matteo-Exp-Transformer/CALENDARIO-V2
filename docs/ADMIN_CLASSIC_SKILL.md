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

## 0. Regola d'oro per gli agenti

**Prima di modificare qualsiasi file della LOCK list qui sotto, l'agente DEVE produrre questa spiegazione preventiva all'utente e attendere conferma:**

1. **File coinvolti**: elenco completo dei path che verranno toccati.
2. **A cosa servono**: spiegazione in linguaggio utente di cosa fa ciascun file. Esempio: "questa è la pagina che il ristoratore vede quando apre la dashboard al mattino" — non "questo è un componente React che renderizza un layout flex".
3. **Flusso utente reale**: descrivere un caso d'uso concreto che mostra perché il cambio è necessario. Esempio: "Mario apre l'app, clicca su Calendario, oggi vede X, dovrebbe vedere Y, ecco perché modifichiamo questo file".
4. **Edition impattate**: indicare se il cambio tocca Classic, Pro, Enterprise o tutte.
5. **Cosa potrebbe rompersi**: lista realistica dei rischi, in linguaggio utente. Esempio: "se sbagliamo, Mario apre il calendario e non vede le prenotazioni di oggi".

**Senza queste 5 cose comunicate prima, l'agente NON modifica nessun file LOCK.**

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

**Modifiche vietate senza spiegazione preventiva**:
- Cambiare il modello dati di una prenotazione
- Rimuovere stati esistenti (accepted, pending, ecc.)
- Aggiungere logica che assume feature avanzate sempre attive

---

### `src/features/booking/components/BookingForm.tsx` — LOCK core
**A cosa serve**: form per creare/modificare una prenotazione. Usata sia dal ristoratore (admin) sia dal cliente finale (form pubblico).

**Cosa si rompe se la tocchi senza criterio**:
> Una cliente, Anna, va sul sito del ristorante per prenotare un tavolo per il suo anniversario. Se la form è rotta, non può prenotare. Il ristorante perde il cliente, l'app non funziona per la sua promessa base.

**Modifiche permesse**: bug fix, validazioni più precise (non meno).
**Modifiche vietate**: rimuovere campi richiesti dal DB, cambiare logica di submit.

---

### `src/features/booking/components/BookingsList.tsx` — LOCK core
**A cosa serve**: lista tabellare delle prenotazioni con filtri e azioni rapide. Vista alternativa al calendario.

**Cosa si rompe**: il ristoratore non vede l'elenco prenotazioni, non può accettarle/rifiutarle in massa.

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

**Workflow obbligatorio**:

```
1. Agente legge il task
2. Identifica i file da toccare
3. Verifica se almeno uno è in LOCK list
4. SE SÌ:
   → Produce spiegazione preventiva (5 punti del paragrafo 0)
   → Aspetta conferma utente
   → SOLO DOPO conferma, scrive codice
5. SE NO:
   → Procede normalmente
```

**Esempio di spiegazione preventiva ben fatta** (template da usare):

> Per implementare X devo toccare questi file:
>
> - `src/pages/AdminDashboard.tsx` — è la pagina principale che vede ogni cliente, anche Classic.
> - `src/features/booking/components/BookingCalendar.tsx` — è il calendario delle prenotazioni.
>
> **Flusso utente**: oggi Mario clicca il tab Calendario e vede le prenotazioni in lista. Vogliamo aggiungere un filtro "solo confermate". Quindi nel calendario aggiungiamo un toggle in alto, e quando attivo nasconde le prenotazioni pending.
>
> **Edition impattate**: tutte (Classic, Pro, Enterprise). È una feature base.
>
> **Cosa potrebbe rompersi**: se sbagliamo il filtro, Mario potrebbe non vedere prenotazioni che esistono → pensa di avere meno coperti del reale → disastro. Quindi aggiungo anche un test che verifica che il default mostri TUTTE le prenotazioni (toggle off).
>
> **Confermi che procedo?**

---

## 4. Stato attuale (snapshot 19-05-26 — post pallino assegnazione tavolo + rimozione placement areas)

Branch `Sviluppo-Dashboard-laterale` rispetto a `main`:

- **AdminDashboard.tsx**: integrato in AdminShell. Layout `min-h-0 flex-1`. Aggiunte due prop opzionali: `bodyOverride?: React.ReactNode` (mostra contenuto alternativo nel corpo, Header+NavItem restano visibili) e `onBodyOverrideExit?: () => void` (chiamata al click NavItem quando bodyOverride è attivo). `handleTabClick()` wrappa `setActiveTab` e chiama `onBodyOverrideExit` se necessario.
- **BookingCalendar.tsx**: feature opt-in ora **gated** con `useFeatures()` — icona walk-in condizionata a `features.walkIn`, turni/badge “Da assegnare” condizionati a `features.servizio`. Usa `useCanonicalTimeSlots()` per gli orari delle fasce (fonte: `service_slots` DB, non più JSON in `restaurant_settings`). **Novità 19-05-26**: `DigestBookingListRow` non ha più la prop `slot` (rimossa). Le card del digest usano token `bg-surface border-(--color-border)` invece di colori inline per fascia. Aggiunto pallino status (2.5×2.5, `bg-(--color-status-accepted)` / `bg-primary-300`) solo se `hasTurnsFeature=true` (edition Pro con servizio slots configurati). Click sul pallino apre `QuickTableAssignModal` solo se il tavolo non è ancora assegnato. Headers fasce ora usa componente `DigestSlotHeader` con `bg-primary-50 border-(--color-border)` (h=56px). Layout colonne digest: griglia 2 colonne `sm:grid-cols-2` per screen ≥640px. Il badge “Da assegnare” usa `bg-(--color-status-pending)/15 text-(--color-status-pending)` (prima `bg-amber-100 text-amber-800`).
- **BookingDetailsModal.tsx**: bottone No-show gated con `features.noShow && canMarkNoShow`. Avviso «orario già trascorso» su **Salva** (`PastStartTimeWarningModal` + `isWallClockStartBeforeNow`). Usa `useCanonicalTimeSlots()` per il display della fascia.
- **useBookingMutations.ts**: aggiunte invalidazioni per `HOME_STATS_QUERY_KEY` e `ANALYTICS_QUERY_ROOT` — no-op in edition Classic, **safe**. ⚠️ **Fix orario**: `useAcceptBooking` ora scrive sempre `desired_time` nel DB — se il chiamante non lo passa, lo deriva da `confirmedStart` con `extractTimeFromISO` (che è ancora nella forma `+00:00` prima del round-trip). Senza questa garanzia, il display potrebbe mostrare l’orario sbagliato (es. +2h in CEST).
- **RestaurantSettingsTab.tsx**: la sezione “Imposta Fasce Orarie” è visibile solo in Classic (`!features.servizio`). Legge e salva le 3 fasce canoniche direttamente su `service_slots` via `useUpdateServiceSlot` (RPC). Al salvataggio: se `canonicalSlotIds` è null (tenant pre-migrazione 016), le fasce vengono saltate con `logger.warn` — le altre impostazioni vengono salvate comunque. Se `end_time < start_time` su una fascia, mostra l’avviso `OVERNIGHT_TIME_END_HINT`. **Novità 19-05-26**: rimossa la sezione “Aree di posizionamento” (`<section aria-labelledby=”placement-areas-heading”>`) — incluse costanti, funzioni, stati, handler e query `booking_placement_areas`. Il campo non viene più né letto né scritto in `restaurant_settings`.
- **useCapacityCheck.ts**: usa `useServiceSlots()` oltre a `useCanonicalTimeSlots()`. La capacità per fascia segue questa priorità: `service_slots.max_guests` (impostabile in Pro da Servizio) → fallback su `slot_guest_capacities` in `restaurant_settings`. Classic funziona identicamente a prima se `max_guests` è null.
- **useCanonicalTimeSlots()** in `useServiceSlots.ts`: non ridefinisce più la queryFn — chiama direttamente `useServiceSlots()` e filtra le canoniche. Una sola query al DB condivisa con tutti i consumer.
- **Bug Home risolto**: cliccando Home nella sidebar, Header e NavItem restano visibili. Il contenuto Home passa via `bodyOverride`.
- **AdminHomePage.tsx**: sezione “prossime 3 ore” ora mostra `b.start_time` (stringa HH:mm sicura) invece di `format(b.start, ‘HH:mm’)` su oggetto Date — eliminato il +2h in CEST.
- **useHomeStats.ts**: `UpcomingBooking` espone `start_time: string` (da `desired_time` o `extractTimeFromISO`) in luogo di `start_iso`.
- **PastStartTimeWarningModal** + `isWallClockStartBeforeNow` in `dateUtils.ts`: prima di accettare dalla tab *Richieste in attesa*, di salvare modifiche in **BookingDetailsModal**, o di inviare **AdminBookingForm** (“Inserisci Nuova Prenotazione”), se data e ora di inizio (orologio locale) sono già nel passato si mostra un dialog di conferma; dopo OK si ripete la catena capienza → `CapacityWarningModal` → mutate/salvataggio/creazione come prima.

**Riferimento completo**: `docs/Sessioni di lavoro/15-05-26/Revisionate da claude/Report-unificazione-fasce-orarie-canoniche.md` (sessione 15-05). `docs/Sessioni di lavoro/19-05-26/Report-pallino-assegnazione-tavolo.md` (sessione 19-05).

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
