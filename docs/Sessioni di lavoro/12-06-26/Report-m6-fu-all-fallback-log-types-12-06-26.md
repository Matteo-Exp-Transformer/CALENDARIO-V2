# Report M6 — FU-ALL-FALLBACK + logging + types — 12-06-26

**Cosa è cambiato:** tenant senza orari/sfondo configurati non vedono più dati demo (11:00–00:00, foto `full-01`); Pagina Prenota resta crema neutra finché il ristoratore salva in Impostazioni; rimossi `as any` su `menuQrStorage`.
**Cosa resta:** audit fallback globale (form config default, strip admin picker), FU-LOG edge/scripts, FU-TYPES su hook Supabase, email, guard Servizio, M4/M5.
**Serve una tua azione:** no.

---

## 2. Cosa è stato fatto

1. **Orari default (`getDefaultBusinessHours`)** — tutti i giorni `null` (chiuso/non configurato) invece di fasce demo 11:00–00:00. Registry + tab Impostazioni ereditano lo stesso stato; Pagina Prenota già non inventava orari (`useBusinessHours` → `null`).
2. **Sfondi Pagina Prenota** — `parseBookingPageBackgroundFromDb` restituisce `null` se manca/invalido/placeholder tile; `BookingRequestPage` applica solo config tenant (`public_booking_page_background` / striscia); first-paint e assenza config → `#faf7f1` (`BOOKING_PAGE_NEUTRAL_BACKGROUND_COLOR`).
3. **Audit grep candidati** — mappatura sotto §2b; nessun altro fix codice in questo giro oltre i target obbligatori.
4. **FU-LOG-1** — grep `console.error|warn` in `src/` (escluso `logger.ts`): già pulito da WP-C2; nessuna migrazione aggiuntiva.
5. **FU-TYPES-1** — rimossi `as any` in `menuQrStorage.ts` (copy/getPublicUrl storage); test statico anti-regressione.
6. **Test M6** — +4 casi in `m6ProdReadyPatterns.test.ts`, +1 in `businessHoursValidation.test.ts`.

### 2b. Mappa audit fallback (grep `??`/`||` copy tenant-facing)

| Elemento | Origine dati | Fallback attuale | Verdetto |
|----------|--------------|------------------|----------|
| Orari apertura pubblico | `restaurant_settings.business_hours` | ~~demo 11–00~~ → `null` / giorni chiusi | ✅ fix sessione |
| Sfondo pagina Prenota | `public_booking_page_background` | ~~`full-01`~~ → crema neutra | ✅ fix sessione |
| Striscia foto Prenota | `public_booking_strip_photo` | nessuna striscia se null | ✅ ok prod |
| Posizionamento tavoli | `booking_placement_areas` | `[]` | ✅ ok (sessione prec.) |
| Form config Prenota | `booking_public_form_config` | `DEFAULT_BOOKING_FORM_CONFIG` (struttura tipologie) | ok prod — schema neutro documentato, non copy ristorante |
| Nome ristorante header admin | `restaurant_name` | testo neutro sistema | ok prod (M1) |
| Contatti footer Prenota | `contact_*` | sezione nascosta se vuoti | ok prod |
| Privacy «il ristorante» | nome tenant / org | stringa generica | ok prod |
| Strip admin picker | catalogo asset | `DEFAULT_BOOKING_STRIP_PHOTO` solo in Impostazioni | ok — non pubblico finché non Salva |
| Gradient CSS invalid id | preset registry | `FALLBACK_GRADIENT` | ok — solo anteprima admin / sotto-gradiente tecnico |

## 3. File toccati

| Area | File |
|------|------|
| Orari | `src/lib/businessHours.ts`, `src/lib/__tests__/businessHoursValidation.test.ts` |
| Sfondi Prenota | `src/features/booking/constants/bookingPageBackground.ts`, `src/pages/BookingRequestPage.tsx` |
| Registry | `src/features/booking/lib/restaurantSettingRegistry.ts` |
| Types | `src/features/booking/utils/menuQrStorage.ts` |
| Test M6 | `src/features/booking/components/__tests__/m6ProdReadyPatterns.test.ts` |
| Docs | `FOLLOW_UP.md`, `MASTERPLAN_BLINDATURA.md`, `ADMIN_CONFLICTS_AND_DEBTS.md`, questo report |

## 4. Verifiche

| Comando | Esito |
|---------|-------|
| `npm run validate:docs` | ✅ 0 path rotti |
| `npm run validate` | ✅ 568 test |
| `npm run build` | ✅ |
| DB | **Nessuna modifica DB** |

## 5. Skill aggiornate

| File | Perché |
|------|--------|
| `ADMIN_CONFLICTS_AND_DEBTS.md` | Stato M6 fallback orari/sfondi |
| `MASTERPLAN_BLINDATURA.md` | Progresso M6 tranche fallback |
| `FOLLOW_UP.md` | FU-ALL-FALLBACK, FU-TYPES-1, FU-LOG-1 |
| Nessuna skill Prenota/DB | Comportamento già coerente con §4 APP_CONTEXT; diff non cambia LOCK layout |

## 6. Dati comunicazione

- Prompt esecutivo M6 con 3 tranche (fallback, log, types), target obbligatori orari+gradienti, validate/build, commit separati, push/merge/release PrenotaZen.
- Classic placement: confermato OK da sessione precedente (`features.servizio` gate) — non toccato in questo giro.

## 7. Analisi flusso

- Prompt sostanziali: 1 · Correzioni: 0 · Follow-up: FU-ALL-FALLBACK parziale chiuso su target sessione.

## 8. La tua lettura

Task ben delimitato dalla mappa mirata §4c: due fix ad alto impatto visibile (orari demo e foto stock) con diff piccolo. FU-LOG già chiuso su `src/` app — utile segnarlo in FOLLOW_UP per non rispedire agenti a grep inutili. FU-TYPES resta grosso sui `.from() as any` Supabase — meglio tranche per hook che per storage.

## 9. Derivazione errori

Nessuna difficoltà tecnica; nessun bug preesistente emerso oltre i fallback mappati.

## 10. Cosa resta

- FU-ALL-FALLBACK: form config default pubblico (voluto?), altri asset admin-only
- FU-LOG-1: edge functions, `console.log` debug, lint `no-console`
- FU-TYPES-1: hook Supabase (`useRestaurantSetting`, menu hooks, …)
- FU-EMAIL, FU-023 Servizio/modali Pro, M4/M5

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt esecutivo senior M6 prod-ready — tranche FU-ALL-FALLBACK (orari default, gradienti Prenota, grep audit), FU-LOG-1, FU-TYPES-1; skill da leggere APP_CONTEXT §0+§4c, MASTERPLAN M6, FOLLOW_UP, ADMIN_CONFLICTS; esclusioni email/legal/M5/guard Servizio; validate/build, commit separati codice/docs, push env/test merge main release PrenotaZen; report standard Q1–Q6.

❓ Q2 — Dati = diff reale?
✅ R2: Riaperti `businessHours.ts`, `bookingPageBackground.ts`, `BookingRequestPage.tsx`, `restaurantSettingRegistry.ts`, `menuQrStorage.ts`, test M6; validate 568 verdi; build verde; nessun file `supabase/migrations`.

❓ Q3 — File correlati allineati?
✅ R3: FOLLOW_UP, MASTERPLAN M6, ADMIN_CONFLICTS §8; nessuna skill Prenota/DB da aggiornare (comportamento allineato a §4c già documentato).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Email (FU-EMAIL), guard modali Servizio, refactor massivo `as any` su hook Supabase, migrazioni DB, lint no-console globale, skill Prenota dedicate — fuori scope o tranche successiva per design.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito minimo; miglioria: in FOLLOW_UP FU-ALL-FALLBACK aggiungere sotto-tabella «chiuso / resta» per evitare re-audit degli stessi target — già fatto parzialmente in questo report §2b.

❓ Q6 — Classic placement e release?
✅ R6: Classic OK su placement (gate Pro, sessione prec.); release PrenotaZen eseguita post-merge main perché toccato codice servito pubblicamente (`BookingRequestPage`, constants sfondo).
