# PRENOTA — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per l'area **Pagina Prenota** (`/prenota/:slug`): trigger, cosa
> caricare subito, divieti frequenti, mappa file, LOCK (solo link). **Non duplica** i LOCK: per il
> testo pieno apri la skill d'area `PRENOTA_SKILL.md` e i file di `contesto/`.
> Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«Pagina Prenota» · «form prenotazione clienti» · «/prenota/:slug» · «striscia foto Prenota» ·
«Personalizza form» · «carosello/tipologie Prenota» · «BookingRequestForm» · «sidebar riepilogo».

## 2. Carica subito
- **`PRENOTA_SKILL.md`** (skill d'area — leggila intera) — entry point, senso + mappa.
- **`contesto/PRENOTA_DATA_FLOW_CONTEXT.md`** — **OBBLIGATORIO** prima di toccare il flusso dati
  magazzino ↔ vetrina ↔ pubblico (resolver `field_overrides`).
- `UI_RESPONSIVE_SKILL.md` / `UI_EDIT_SKILL.md` solo se tocchi layout/stile.

## 3. Divieti top-3
1. **Prenota ≠ Menu QR ≠ tab Menu (magazzino).** Tre confini: magazzino (tab Menu) ≠ vetrina
   (Personalizza form) ≠ pagina pubblica (cosa vede Anna). Mescolarli rompe il flusso.
2. **Non «aggiustare» i limiti VOLUTI**: cap testo cliente silenziosi (no contatore), cap testo admin
   = anti-rottura mobile, striscia visibile anche a 375px, XOR card/carosello, niente menù hardcoded.
   Sono scelte di Matteo → prima chiedi (`PRENOTA_SKILL.md` §3).
3. **Niente decisioni «per nome» tipologia** (`=== 'tavolo'` / `'rinfresco_laurea'`): comportamento
   per **capacità** (`modeUsesMenu`/`modeUsesDietary`), residui per-nome CHIUSI FU-036 — non
   reintrodurli (`PRENOTA_SKILL.md` §3-bis).

## 4. Mappa file
| Se il task tocca… | Apri (intero) |
|---|---|
| Layout/griglia striscia, sfondo, header, form, card sottotab, sidebar, validazione submit | `contesto/PRENOTA_LAYOUT_CONTEXT.md` |
| Cap testo (admin o cliente), contatori, `bookingPrenotaTextLimits.ts` | `contesto/PRENOTA_TEXT_LIMITS_MAP.md` |
| Config «Personalizza form», `BookingFormConfigPanel`, autosave, XOR card/carosello | `contesto/PRENOTA_FORM_CONFIG_CONTEXT.md` |
| Flusso dati resolver, `field_overrides`, aggiungere campi a `SubTab`/`BookingMode` | `contesto/PRENOTA_DATA_FLOW_CONTEXT.md` **(OBBLIGATORIO)** |
| Limiti **capienza/coperti** (posti, non caratteri) | `../Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` + edge `supabase/functions/create-booking/` |
| Tab Menu magazzino (ingredienti, categorie, promo, preset) | `../Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| Card richiesta lato admin (Richieste in attesa) — **altra area** | `../per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` |
| Cosa è già blindato / dove aggiungere test | `contesto/PRENOTA_TEST_SUITE_INDEX.md` |

## 5. LOCK (solo link)
- **Griglia striscia** `BookingRequestPage.tsx` → `contesto/PRENOTA_LAYOUT_CONTEXT.md` §0.
- **«Nessuna striscia» = `''`, mai `NULL`** (serializer `public_booking_strip_photo`) →
  `contesto/PRENOTA_LAYOUT_CONTEXT.md` §2.
- **Submit invariato — non toccare `useCreateBookingRequest`** → `PRENOTA_SKILL.md` §5.
- **Regola orari** `dateUtils` (se tocchi data/ora) → `../ADMIN_CLASSIC_SKILL.md` §4b.
