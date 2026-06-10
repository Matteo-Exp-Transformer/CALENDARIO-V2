# Report FU-030 Fase 1 — cap testo compose ingredienti (10-06-26)

## Cappello

- **Cosa è cambiato:** nella Pagina Prenota i testi di categorie e ingredienti del menù compose non possono più spingere il layout su mobile (troncati a 24/24/79 caratteri); in admin Tab Menu Mario vede il contatore mentre scrive.
- **Cosa resta:** FU-030 aperto finché Matteo non accetta la prova; Fase 2 (seed `test`, QA browser C1/C3) non toccata; FU-038/039 invariati.
- **Serve una tua azione:** sì — revisione visiva su `/prenota/trattoria-da-tommaso` (viewport sotto) e «lavoro ok» se la prova va bene.

---

## Obiettivo

Prova Fase 1 M0 / FU-030: cappare testi Tab Menu compose per anti-rottura mobile, riusando i numeri delle sottotab card (`subTabLabel` 24, `subTabDescription` 79).

---

## Cosa è stato fatto

1. **`BOOKING_MENU_COMPOSE_TEXT_LIMITS`** in `bookingPrenotaTextLimits.ts` — `categoryLabel` 24, `itemName` 24, `itemDescription` 79 (derivati da `BOOKING_PRENOTA_RESTAURANT_TEXT_LIMITS`).
2. **Pagina Prenota (cliente):** `clampBookingText` silenzioso al render in `BookingMenuCategoryCard` (header categoria chiusa/aperta + overlay portal, nome/descrizione ingrediente nel pannello) e in `BookingSummarySidebar` (righe «Il tuo menu»).
3. **Admin Tab Menu:** `MenuPricesTab` — `maxLength` + contatore `N/max` su Nome prodotto, Descrizione, Titolo categoria (overlay Categorie).
4. **Test Vitest:** 2 casi nuovi su costanti + clamp legacy.
5. **Doc:** sezione E in `Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` (nota: il prompt citava `per-ui-design-skill/BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` — file assente nel repo; fonte canonica è `PRENOTA_TEXT_LIMITS_MAP.md`).
6. **Skill §7.2:** `PRENOTA_SKILL.md` §4, `PRENOTA_LAYOUT_CONTEXT.md` §8.1, `MENU_ADMIN_CONTEXT.md` §3.

**Non toccato:** `BookingRequestPage.tsx` griglia LOCK, seed DB, Menu QR, PROD, FU-038/039.

---

## File toccati

| File | Perché |
|------|--------|
| `bookingPrenotaTextLimits.ts` | Blocco `BOOKING_MENU_COMPOSE_TEXT_LIMITS` |
| `BookingMenuCategoryCard.tsx` | Clamp pubblico categoria + ingredienti |
| `BookingSummarySidebar.tsx` | Clamp nomi/categorie in riepilogo |
| `MenuPricesTab.tsx` | maxLength + contatori admin |
| `bookingPrenotaTextLimits.test.ts` | Test costanti + clamp |
| `PRENOTA_TEXT_LIMITS_MAP.md` §E | Mappa 1:1 numeri ↔ superfici |
| `PRENOTA_SKILL.md`, `PRENOTA_LAYOUT_CONTEXT.md`, `MENU_ADMIN_CONTEXT.md` | Allineamento skill |
| `FOLLOW_UP.md` | FU-030 nota «prova implementata Fase 1» |

---

## Verifica viewport (mobile-first)

Slug smoke consigliato: **`trattoria-da-tommaso`** (tenant TEST esistente). Controllo strutturale codice + checklist per revisione Matteo:

| Viewport | Superficie | Cosa verificare | Esito agente |
|----------|------------|-----------------|--------------|
| **375px** (priorità) | Griglia compose 2 col `compact` | Card categoria chiusa: label max 24 char visibili, niente overflow orizzontale | ⬜ smoke Matteo |
| **375px** | Card aperta + portal fixed | Header categoria + lista ingredienti: nome 24, descrizione 79; scroll interno pannello ok | ⬜ smoke Matteo |
| **375px** | Layout `stack` (se presente branch) | Stesso clamp, niente testo che spinge footer card | ⬜ smoke Matteo |
| **375px** | Riepilogo sotto form + submit | «Il tuo menu»: prefisso categoria + nome clampati, niente overflow | ⬜ smoke Matteo |
| **900px** | Scroll orizzontale categorie | Card ~240–280px: testi clampati, overlay stessa larghezza shell | ⬜ smoke Matteo |
| **1256px** | Sidebar sticky (se striscia) | Riepilogo laterale: stessi clamp, totali leggibili | ⬜ smoke Matteo |

**Stringhe al limite / legacy oltre limite:** con dati DB >24/>79 il pubblico mostra solo i primi caratteri (nessun messaggio); layout deve restare stabile — verificabile aprendo una card con ingrediente dal nome lungo in magazzino.

---

## Test eseguiti

| Comando | Esito |
|---------|--------|
| `npx vitest run src/features/booking/constants/__tests__/bookingPrenotaTextLimits.test.ts` | 7/7 OK |
| `npm run validate` | OK — lint + typecheck + **482** test `src/` |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `PRENOTA_TEXT_LIMITS_MAP.md` §E | Numeri 24/24/79 + superfici UI | Mappa limiti compose |
| `PRENOTA_LAYOUT_CONTEXT.md` §8.1 | Riga compose FU-030 | Card ingredienti + sidebar |
| `PRENOTA_SKILL.md` §4 | Questione aperta → Fase 1 implementata | Entry point area |
| `MENU_ADMIN_CONTEXT.md` §3 | Cap form prodotto/categoria | Tab Menu admin |
| `FOLLOW_UP.md` FU-030 | Nota prova Fase 1, resta aperto | Tracciamento debito |

---

## Dati comunicazione

- Prompt esecutivo completo con profilo Esecuzione, modalità deep, file obbligatori e numeri 24/24/79 fissati (no intervista).
- Matteo non ha usato «lavoro ok» in questa sessione — report preparato per quella chiusura.

---

## Analisi flusso prompt

- 1 prompt sostanziale · 0 correzioni post-risposta · modalità deep da prompt · skill caricate come da elenco.

---

## La tua lettura della sessione

- Il prompt era molto prescrittivo (file, numeri, non-toccare): esecuzione lineare senza ambiguità Prenota vs Menu QR.
- Unica discrepanza path doc: `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` in `per-ui-design-skill/` non esiste; aggiornata la mappa canonica in `Prenota-Skill/contesto/`.
- Suggerimento (dato, non implementato): alias o symlink doc `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` → `PRENOTA_TEXT_LIMITS_MAP.md` per evitare confusione nei prompt futuri.

---

## Derivazione errori

- **TS `formData.description` possibly undefined** — tipo esistente `MenuItemInput`; risolto con `(formData.description ?? '').length` sul contatore. Causa: **tipo preesistente**, non regressione logica.

---

## Follow-up

| ID | Stato dopo sessione |
|----|---------------------|
| FU-030 | **Aperto** — prova Fase 1 implementata; chiudere solo su accettazione Matteo |
| FU-038 | Invariato (aperto) |
| FU-039 | Invariato (aperto) |

Fase 2: prepara-prompt dopo revisione (seed + QA browser formale).

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.

✅ R1:

**Prompt 1 (esecuzione FU-030 Fase 1, verbatim estratto):**
> Profilo: Esecuzione · Modalità: deep · Skill da leggere: docs/Prenota-Skill/PRENOTA_SKILL.md (intero) · docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md (§0 LOCK griglia · § card ingredienti/compose) · docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md · docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md (form ingrediente magazzino) · docs/APP_CONTEXT_SKILL.md (§4 LOCK · §7 chiusura) · Output attesi: (1) BOOKING_MENU_COMPOSE_TEXT_LIMITS in bookingPrenotaTextLimits.ts con max 24/24/79 · (2) clamp display mobile-first su ogni superficie pubblica Pagina Prenota che mostra label categoria / nome / descrizione ingrediente · (3) maxLength + contatore N/max in MenuPricesTab (admin) · (4) test Vitest costanti+clamp · (5) sezione E in docs/per-ui-design-skill/BOOKING_PRENOTA_TEXT_LIMITS_MAP.md · (6) report Fase 1 in docs/Sessioni di lavoro/ · (7) npm run validate verde su src/. · Obiettivo — M0 Fase 1 / FU-030 (prova cap responsive mobile) · Limiti: categoryLabel 24, item.name 24, descrizione 79 da BOOKING_PRENOTA_RESTAURANT_TEXT_LIMITS · NON toccare BookingRequestPage griglia, seed DB, QA C1/C3, Menu QR, PROD · Chiusura: su «lavoro ok» report §7.1 + skill §7.2 — NON commit salvo richiesta.

**Prompt 2 (hook fine-sessione, verbatim):**
> ⚠️ FINE-SESSIONE — la sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) non è completa: docs/Sessioni di lavoro/10-06-26/Report-fu-030-compose-text-limits-fase1-10-06-26.md manca l'INTERA sezione 11 «Domande di chiusura» (le 6 domande ❓Q + ✅R). Aggiungila e rispondi. Per Q2 (dati=diff) e Q3 (file correlati) DEVI rileggere il diff e i file prima di rispondere.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.

✅ R2: Riletto `git diff` su 10 file staged/working tree (+ report untracked). Conferme: `BOOKING_MENU_COMPOSE_TEXT_LIMITS` con `categoryLabel`/`itemName` = `subTabLabel` (24) e `itemDescription` = `subTabDescription` (79) in `bookingPrenotaTextLimits.ts`; `clampBookingText` in `BookingMenuCategoryCard` (nome, descrizione, `displayCategoryLabel` su header chiuso/aperto/portal) e `BookingSummarySidebar` (cat + nome riga menu); `MenuPricesTab` con `maxLength`+contatore su nome prodotto, descrizione (`?? ''` sul contatore), titolo categoria overlay; 2 test nuovi → **7** test nel file, **482** totali `npm run validate`. Skill doc: §E `PRENOTA_TEXT_LIMITS_MAP.md`, righe FU-030 in `FOLLOW_UP.md`, `PRENOTA_SKILL` §4, `PRENOTA_LAYOUT_CONTEXT` §8.1, `MENU_ADMIN_CONTEXT` §3. Nessuna modifica a `BookingRequestPage.tsx`. Report allineato al diff; unica nota: path `per-ui-design-skill/BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` del prompt non esiste — aggiornata mappa canonica `Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` §E.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).

✅ R3: Verificati e allineati: `bookingPrenotaTextLimits.ts` (costante sorgente) · `bookingPrenotaTextLimits.test.ts` (assert 24/24/79 + clamp legacy) · `BookingMenuCategoryCard.tsx` · `BookingSummarySidebar.tsx` · `MenuPricesTab.tsx` · `PRENOTA_TEXT_LIMITS_MAP.md` §E · `PRENOTA_LAYOUT_CONTEXT.md` §8.1 · `PRENOTA_SKILL.md` §4 · `MENU_ADMIN_CONTEXT.md` §3 · `FOLLOW_UP.md` FU-030. Controllati ma volutamente non toccati (scope): `BookingRequestPage.tsx` (LOCK §0), `BookingMenuComposeGrid.tsx` (passa label già clampata dalla card), `MenuSelection.tsx` (chip «Riepilogo Scelte» con `hideSummary={true}` nel pubblico — fuori superficie visibile), edge `create-booking` (nessun cap server su nomi ingredienti — Fase 1 solo display/admin input). Non creato alias `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` in `per-ui-design-skill/` (file assente nel repo).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)

✅ R4: (1) Smoke browser reale su `trattoria-da-tommaso` 375/900/1256 — solo checklist strutturale ⬜, nessun Playwright/browser in sessione. (2) Fase 2 esplicitamente fuori scope: seed slug `test`, QA C1/C3, FU-038/039. (3) File doc al path alternativo `per-ui-design-skill/BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` — sostituito con mappa Prenota canonica. (4) `SESSION_LOG.md` — riga non aggiunta (report deep dedicato già presente). (5) Commit/push — non richiesti. (6) Clamp su chip `MenuSelection` «Riepilogo Scelte» — non montati in pubblico (`BookingRequestForm` `hideSummary={true}`).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)

✅ R5: Attrito: il prompt citava `docs/per-ui-design-skill/BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` ma nel repo la mappa vive solo in `Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` — rischio doppio file o agente che crea duplicato. Miglioria: in `PREPARA_PROMPT_SKILL` o tabella §0 Prenota, alias esplicito «BOOKING_PRENOTA_TEXT_LIMITS_MAP = PRENOTA_TEXT_LIMITS_MAP» oppure symlink nel repo.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?

✅ R6: Contesto **giusto** — elenco skill nel prompt ha evitato Menu QR/Testing/Meta; PRENOTA_LAYOUT §0 LOCK ha tenuto fuori la griglia. Hook `stop` su §11 mancante: **utile**, ha forzato rilettura diff prima di Q2/Q3; non rumore. Volume deep adeguato al task (5 file src + 5 doc + test).
