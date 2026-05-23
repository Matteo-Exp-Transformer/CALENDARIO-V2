# Report — Revisione responsive + scala tipografica centralizzata

Data: 23-05-26
Branch: main

## Cosa è stato fatto (cronologico)

1. **Mappatura iniziale** con 3 sub-agenti Explore in parallelo:
   - Agent A: punti dove icona+testo rischiano sovrapposizione.
   - Agent B: dimensioni testo usate, distinte titoli vs corpo.
   - Agent C: container/padding/overflow.

2. **P1 — fix overflow visibili** (2 file non-LOCK):
   - `src/features/booking/components/crm/CustomerListTable.tsx`: tabella
     ora `min-w-[640px]` → scroll orizzontale su mobile invece di
     compressione; email/nome con `max-w-` + `truncate`; telefono/data
     `whitespace-nowrap`; badge "Manuale" e azioni `shrink-0`.
   - `src/pages/CrmPage.tsx`: bottone "+ Nuovo cliente" full-width su
     <640px (`w-full sm:w-auto shrink-0`); titolo con `min-w-0 truncate`.
   - Commit di sicurezza: `b2a436e`.

3. **P1 LOCK — AdminDashboard h1 titolo ristorante**:
   - Sostituito `style={{ fontSize: 'clamp(1.297rem, 2.767vw, 1.729rem)' }}`
     (basato su viewport globale) con scala Tailwind statica:
     `text-[22px] sm:text-2xl md:text-[28px] lg:text-[30px]`.
   - Stessa scala T1 ancorata al gold standard del titolo Calendario.
   - Layout (positioning, line-clamp, wrap-anywhere) invariato.
   - Commit: `dfb29a1`.
   - LOCK 2 e 3 (BookingRequestCard, ArchiveTab `pr-29 + absolute`):
     **non toccati** dopo seconda lettura del codice — Agent A li aveva
     classificati OK, il pattern `absolute right-0 top-0 + pr-29 +
     min-w-0 + break-words + wrap-anywhere` è calibrato e funzionante.
     Stravolgerlo a flex avrebbe cambiato la resa desktop voluta.

4. **P2 — scala tipografica centralizzata in `src/index.css`** (commit
   `5050324`):
   - Aggiunte utility Tailwind v4 `@utility`:
     - **Titoli**: `text-title-page`, `text-title-section`,
       `text-title-card`, `text-title-subtitle`, `text-title-modal`.
     - **Corpo**: `text-body`, `text-label`, `text-value`,
       `text-stat-big`, `text-micro`, `text-button-label`.
   - Step-up su breakpoint Tailwind nativi (640 / 768 / 1024 px),
     ancorato al gold del titolo Calendario (22 / 24 / 24 / 30 px).
   - Build Vite verde, CSS valido.

5. **P2 — adozione utility su pagine admin** (commit `a2a0968`):
   - `AdminHomePage`: h1, descrizione, StatCard label/value, QuickNav
     label/desc, h2 "Prossime 3 ore", upcoming list rows.
   - `CrmPage`: h1, messaggi error/loading.
   - `AnalyticsPage`: h1, navigator periodo, error, h2 Trend, empty state.
   - `ServizioPage`: h1, descrizione, TableCard nome/posti/conferma
     eliminazione, h2 sale, empty states mappa/lista.

6. **Allineamento skill** (regola §7.2 APP_CONTEXT_SKILL):
   - `docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md`: nuova sezione
     §6b con tabella utility + linee guida; checklist §7 estesa con
     punto 7 (uso utility).
   - `docs/APP_CONTEXT_SKILL.md` §4: nuova RULE che vincola futuri
     interventi a usare le utility invece di liste `text-* md:text-*`.

## Domande poste e risposte

- "Scope intera app admin + form pubblico?" → "confermo. distingui titoli e corpo."
- "Quale approccio: utility o liste Tailwind?" → "utility e centralizziamo."
- "Da dove partire?" → "P1."
- "Fai commit prima di applicare LOCK così abbiamo punto sicuro." → fatto
  prima di toccare `AdminDashboard.tsx`.
- "Procedi fino alla fine." → completato P2 + allineamento skill + report.

## Test eseguiti

- `npm run typecheck`: verde dopo ogni commit.
- `npm run lint`: verde, zero warning.
- `npx vite build`: verde, CSS bundle 167 KB (gzip 27 KB), utility
  Tailwind v4 risolte correttamente.

## File toccati (riassunto utente)

- **Marco apre la pagina CRM su iPhone**: prima la tabella clienti si
  schiacciava illeggibile; ora scorre lateralmente e ogni colonna ha
  spazio. Il bottone "+ Nuovo cliente" si stende a tutta larghezza così
  è facile da centrare col pollice.
- **Mario guarda il nome del suo ristorante in alto**: prima il titolo
  cambiava dimensione in base alla larghezza dello schermo intero (anche
  con la sidebar aperta), ora segue una scala chiara a 4 step.
- **In tutte le pagine admin**: titoli e testo seguono ora una scala
  unica definita in un solo posto. Cambiare la dimensione di tutti i
  titoli card dell'app significa modificare una sola riga in
  `index.css`, non 30 file.

## Cosa resta per prossime sessioni

- **P3 (cosmetico)**: gap `1.5 → 2` su pulsanti logout sidebar e footer
  AdminDashboard (Agent A li aveva segnalati ⚠️ medi).
- **Adozione progressiva utility**: i componenti `src/components/ui/` e
  `src/features/booking/components/` usano ancora `text-sm`/`text-xs`
  diretti in molti punti. Migrazione opportunistica: quando tocchi un
  file per altro motivo, allinealo alle utility.
- **Form pubblico** (`src/pages/` pubbliche): non incluso in questa
  sessione, da affrontare separatamente.
- **Modal**: la utility `text-title-modal` è definita ma non ancora
  applicata ai modali esistenti.

## Deviazioni dal plan

- **LOCK 2 e 3 non modificati**: il plan originale prevedeva refactor
  header `BookingRequestCard` + `ArchiveTab` da `absolute + pr-29` a
  flex normale. Dopo seconda lettura del codice, decisione di non
  toccare: il pattern è già robusto (`min-w-0`, `break-words`,
  `wrap-anywhere`) e Agent A li aveva classificati OK, non ⚠️.
  Comunicato in chat all'utente.

## Commit creati

- `b2a436e` — fix CRM overflow
- `dfb29a1` — AdminDashboard h1 scala T1
- `5050324` — utility CSS centralizzate
- `a2a0968` — adozione utility su 4 pagine admin
- (questa commit) — skill + report allineati
