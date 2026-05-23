# Report — Adozione utility tipografiche centralizzate (24-05-26)

## Contesto

Sessione precedente (23-05-26) ha introdotto la scala tipografica responsive in `src/index.css` come utility Tailwind v4 (`text-title-page`, `text-title-section`, `text-title-card`, `text-title-subtitle`, `text-title-modal`, `text-body`, `text-label`, `text-value`, `text-stat-big`, `text-micro`, `text-button-label`). 4 pagine admin erano già state migrate. Restavano P3 (fix cosmetici) e P2.B (migrazione progressiva).

## Cosa è stato fatto

### 1. P3 — Fix cosmetici pulsanti logout

- **AdminShell.tsx** (sidebar Pro/Enterprise): aggiunto `min-w-0` sullo span "Esci" del pulsante footer per garantire la troncatura corretta su schermi stretti (320px). Il gap era già `gap-2` (già sistemato in sessione precedente).
- **AdminDashboard.tsx** (footer admin classica): `gap-1.5 → gap-2` sul pulsante "Log-out" footer per dare più respiro tra icona e label.

Commit: `df3b34e fix(ui): gap e min-w-0 su pulsanti logout admin`.

### 2. P2.B — Adozione utility nei componenti non-LOCK

**Modal.tsx**: il titolo `<h2>` interno usa ora `text-title-modal`. Effetto: **tutti** i `<Modal>` dell'app prendono automaticamente la scala centralizzata (un solo file modificato, decine di chiamanti beneficiati).

**Componenti booking non-LOCK** (`text-base|text-lg|text-xl + md:text-*` → utility centralizzata):

- `DetailsTab.tsx` — 5 h3 sezione: `text-sm md:text-base` → `text-title-subtitle`
- `DietaryTab.tsx` — 2 h3 (intolleranze, note speciali): `text-base` → `text-title-card`
- `PendingRequestsTab.tsx` — empty state h3 + lista h3
- `ArchiveTab.tsx` — h3 empty state
- `MenuSelection.tsx` — h3 "Riepilogo Scelte" + counter
- `MenuPricesTab.tsx` — h3 "Promozioni Menù", "Nuovo Prodotto", "Menù preselezionati", "Categorie Menu"
- `ServiceSlotsManager.tsx` — h2 "Fasce orarie" + sottotitolo
- `AssignmentMapPanel.tsx` — h3 "Assegnazione tavoli" + sottotitolo
- `WalkInLimitCard.tsx` — h2 + sottotitolo
- `BookedByChart.tsx` — h3 "Fonte prenotazioni"
- `ShiftBriefingModal.tsx` — h2 briefing turno
- `CustomerDetailPanel.tsx` — h2 nome cliente + 4 h3 sezioni (contatti, note, statistiche, prenotazioni)
- `PastStartTimeWarningModal.tsx` — titolo modal (e sanata warning IDE `text-[var()]` → `text-(--var)`)

Commit: `0961816 update(ui): adotta utility tipografiche su modali e componenti booking non-LOCK`.

### 3. P-PUBBLICO — Pagine login/invite/privacy

- `AdminLoginPage.tsx` — h1 "Sistema Gestionale" → `text-title-page` (mantiene `max-[736px]:text-balance` per il wrap)
- `InvitePage.tsx` — 3 h2 stati (link non valido, registrazione completata, registrazione) → `text-title-card`
- `PrivacyPolicyPage.tsx` — h1 page → `text-title-page`, sottotitolo GDPR → `text-body`, 9 h2 sezioni → `text-title-card`

Commit: `82c9507 update(ui): adotta utility tipografiche su pagine login/invite/privacy`.

## Cosa NON è stato toccato (e perché)

### File LOCK admin classica (richiedono spiegazione preventiva dedicata)

`BookingDetailsModal.tsx`, `BookingCalendar.tsx`, `RestaurantSettingsTab.tsx`, `BookingRequestForm.tsx`, `BookingForm.tsx`, `AdminBookingForm.tsx`: tutti hanno h2/h3 hardcoded che beneficerebbero della migrazione, ma sono LOCK strutturali. Richiedono una sessione dedicata con spiegazione preventiva 5 punti per ciascun file (workflow ADMIN_CLASSIC_SKILL §0).

### `src/components/ui/` — Input, Label, Select, Textarea, Button, CollapsibleCard, TimePicker24h

Skippato. Motivo: gli input form sono tarati con `text-sm` (14px fisso) per altezza/padding coerenti. Migrare a `text-label` (13/13/14/14) o `text-body` (14/14/15/16) cambierebbe la dimensione su mobile o desktop sui form di tutta l'app, con rischio estetico alto e beneficio basso. `CollapsibleCard` è LOCK (57 test); `Button` è LOCK indiretto; `TimePicker24h` è LOCK funzionale (RULE in `APP_CONTEXT_SKILL`).

### `BookingRequestPage.tsx` (pagina pubblica prenotazione)

Skippato. Il design pubblico usa `clamp()` calibrato con moltiplicatore `4/3` per il titolo ristorante e per il sottotitolo "Richiesta Prenotazione Tavolo" — questi sono già il gold standard del pubblico, una scala custom diversa dalla scala admin. La sezione info compatta (Orari/Contatti) usa `text-xs` intenzionalmente per stare in due colonne strette su mobile. Migrare richiederebbe ridisegno mirato, non opportunistico.

## Validazione

```
npm run typecheck   → 0 errori
npm run lint        → 0 warning
```

Eseguiti dopo ogni commit. Build Vite non rieseguita perché `index.css` non modificato (solo consumo di utility già esistenti).

## Cosa resta per la prossima sessione

1. **Migrazione LOCK admin classica** — sessione dedicata con spiegazione preventiva per ciascun file:
   - `BookingDetailsModal.tsx` (h3 "Attenzione!", "Elimina Prenotazione Accettata", h2 truncate)
   - `RestaurantSettingsTab.tsx` (h2 "Impostazioni locale", h3 "Anagrafica Azienda", "Orari di apertura", "Sfondo pagina Prenota", "Tema applicazione")
   - `BookingCalendar.tsx` (titolo già in CSS dedicato `.booking-calendar-title` — vedere se intercettare con utility o lasciare CSS dedicato)
   - `AdminBookingForm.tsx` (h2 con `text-xl min-[470px]:text-2xl md:text-3xl` — design custom)
   - `BookingRequestForm.tsx` (h2 form pubblico — design custom)

2. **Redesign mirato pagina pubblica BookingRequestPage** — se si vuole spostare anche il pubblico sulla scala centralizzata serve una scala dedicata `text-public-title` / `text-public-body` o accettare di sostituire i `clamp()` con la scala admin (cambierebbe le proporzioni).

3. **Input form `src/components/ui/`** — eventuale rifattorizzazione dedicata: aggiungere nuove utility `text-input` / `text-input-label` ancorate ai valori attuali (14px fisso) per dare nomi semantici senza cambiare dimensioni.

## Aggiornamento file di skill

- `docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md` §6 "Incongruenze note": resta vuoto (le incongruenze risolte oggi non erano elencate lì — erano fix cosmetici e migrazione opportunistica).
