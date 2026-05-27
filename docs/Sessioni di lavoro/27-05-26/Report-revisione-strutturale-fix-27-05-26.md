# Report — Revisione strutturale + fix responsive/cleanup (27-05-26)

## Cosa ho fatto

Revisione su 3 fronti in parallelo (sub-agent):
1. **Rapida sui lavori di ieri (26-05-26)** — 11 report letti, raggruppati per area (Prenota v2, Personalizza form, Resolver).
2. **Approfondita sui lavori di oggi (27-05-26)** — 5 report + verifica codice + typecheck verde.
3. **Audit strutturale + responsive** della Pagina Prenota v2 (mobile / tablet / desktop).

Poi, su tua approvazione, ho eseguito i **fix critici responsive + cleanup leggero**.

## File toccati e perché (linguaggio utente)

### Fix responsive
- **Sidebar riepilogo che si "incollava" tra tablet e desktop senza colonna dedicata** → ora il pannello di riepilogo a destra appare e diventa sticky **solo da 900px in su**, allineato con la griglia 2 colonne. Sotto i 900px resta nel flusso normale come prima.
  - `BookingSummarySidebar.tsx:122` — cambiato `md:sticky` → `min-[900px]:sticky`.
- **Sticky bar mobile che copriva l'ultimo campo del form** (Mario che compila telefono o note non vedeva più cosa stava scrivendo) → aggiunto padding-bottom adeguato al container, così l'ultimo campo resta sopra la sticky bar.
  - `BookingRequestPage.tsx:155` — `pb-4` → `pb-44 min-[900px]:pb-4`.
- **Frecce calendario troppo piccole su mobile** (36px, sotto la soglia Apple/Google di 44px per touch) → ora 44×44 px, comodamente tappabili.
  - `BookingPublicDateTimePickers.tsx:203,215` — `h-9 w-9` → `h-11 w-11`.

### Pulizia codice
- **Log non strutturati** (`console.error` con emoji) sostituiti con `logger.error` — coerente con la regola del progetto e silenziabile in test.
  - `BookingRequestForm.tsx:18,353,890`.
- **Costanti morte eliminate** in `bookingPublicFieldStyles.ts`: rimossi `BOOKING_PUBLIC_PAGE_HEADER_INSET`, `BOOKING_PUBLIC_FIELD_WRAP`, `BOOKING_PUBLIC_FIELD_INPUT` (nessun importer trovato).
- **Date helper centralizzati**: prima 3 file ridefinivano `getTodayIso` / `dateToIso` / `getCurrentTimeHHMM` ognuno a modo suo. Ora un solo punto di verità in `utils/bookingPublicDateHelpers.ts`.
- **`getModeLabelByType` deduplicato**: la funzione era copiata in Sidebar (label long) e StickyBar (label short). Ora in `utils/bookingModeLabels.ts` con parametro `variant: 'long' | 'short'`.

### Skill aggiornata
- `docs/APP_CONTEXT_SKILL.md` §4 — aggiunte 3 nuove RULE per prevenire le stesse duplicazioni in futuro:
  - **Anti-duplicazione** (cerca prima di scrivere helper, estrarre da 2+ duplicati)
  - **Import in cima al file** (no import in mezzo al body)
  - **Logger** (no console.error in componenti React)
- Aggiunta riga nella mappa "Se hai modificato → Aggiorna" per i nuovi file utility.

## Test
- `npm run typecheck` → ✅ verde
- `npm run lint` → ✅ verde (zero warning)
- `npm run test` → ✅ 186/186 passati

## File di skill aggiornati

| Skill | Cosa è cambiato |
|-------|----------------|
| `docs/APP_CONTEXT_SKILL.md` | +3 RULE: Anti-duplicazione, Import in cima, Logger; +1 riga in mappa "se hai modificato → aggiorna" per nuovi file utility |
| Altre skill | Nessuna modifica (LOCK rispettati: `dateUtils.ts` non toccato, fallback sull'utility nuova `bookingPublicDateHelpers.ts`) |

## Cosa NON ho toccato (rimandato a sessioni future)

Dall'audit sono emersi altri punti **strutturali grossi** che richiedono un plan dedicato:

- **`BookingFormConfigPanel.tsx` 1582 righe** — da splittare in HeaderEditor / ModesEditor / SubTabsEditor / CarouselEditor.
- **`BookingRequestForm.tsx` 1221 righe** — da estrarre in hook `useBookingSubmitLock`, `usePresetMenuSync`, `useBookingSubmit`, componente `BookingSuccessModal`, file `BookingSubTabCarousel.tsx`.
- **`MenuSelection.tsx` 751 righe** — candidata a split.
- **Breakpoint mix `min-[900px]` ripetuto** in 3 file senza costante condivisa — utile centralizzare quando il refactor sopra parte.

Inoltre l'agent strutturale ha segnalato un dubbio responsive sulla **striscia foto su mobile** (occupa 20vw anche <640px). Hai confermato che il comportamento attuale ti piace → **non toccato**.

## Deviazioni dal plan
Nessuna. Eseguito esattamente "fix critici + cleanup leggero" come da scelta utente.

## Per la prossima sessione (se vuoi)
1. Plan di split di `BookingFormConfigPanel.tsx` e `BookingRequestForm.tsx` (ad alto valore manutenibilità).
2. Bug "Gradienti" segnalato dal sub-agent: pulsante "Gradienti" nella sezione sfondo Prenota mostra ancora contenuti vecchi; idea utente: rinominare "Gradienti" → "Immagini" e l'altro → "Textures".

---

## Allineamento DB produzione (eseguito dopo i fix)

### Confronto TEST (`docnnernvp`) vs PROD (`rwuxgvld`)
- **Schema colonne**: identico tabella per tabella. Nessuna colonna mancante o di troppo su prod.
- **Migrazioni**: prod aveva storiche divergenti (018, 020, 021 versione "update_service_slot" vs 021 "service_slot_rpcs_jsonb" del test) — comportamento equivalente, nessun fix necessario. Unica DML mancante: **038_clear_menu_items_booking_types** (azzera array `booking_types` su `menu_items` esistenti e cambia default a `'{}'`).

### Azioni eseguite su PROD
1. Applicata migrazione `038_clear_menu_items_booking_types` via MCP `apply_migration`.
2. **Pulizia totale dati di test** (8 organizations, 9 admin_users, 3 auth.users, 80 booking_requests, ecc. — tutti dati di test pre-produzione):
   ```sql
   BEGIN;
   TRUNCATE TABLE
     booking_table_assignments, booking_requests, customers, email_logs,
     rate_limits, ip_blacklist, invite_tokens, service_slot_overrides,
     service_slots, tables, rooms, menu_qrcode_categories, menu_qr_codes,
     menu_homepage_config, menu_items, menu_categories, restaurant_settings,
     tenant_features, tenant_usage, admin_users, organizations
   RESTART IDENTITY CASCADE;
   DELETE FROM auth.users;
   COMMIT;
   ```
3. Verifica finale: **tutte le tabelle a 0 record**, schema integro, RLS/triggers/policies preservati.

### Stato PROD ora
- Schema allineato a TEST.
- Zero dati legacy. Pronto per inserimento di utenti/aziende reali da parte di Matteo.
- Trigger `handle_new_user` (se presente) ricreerà admin_users alla prossima registrazione.
