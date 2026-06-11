# Report — M3 Fase 1 Menu magazzino (limiti + cap + avviso) — 11-06-26

**Cosa è cambiato:** nella tab **Menu** admin il ristoratore trova limiti chiari (7 categorie, 12 prodotti per categoria, 6 preset, 6 QR), contatori testo completi anche sulla descrizione categoria, e un avviso visibile quando salva un ingrediente che le modifiche arrivano subito a Prenota e Menu QR.
**Cosa resta:** **M3 Fase 2** — toggle disponibilità nel magazzino + migrazione DB (**FU-M3-2**); controtest rename/delete; blindatura completa M3.
**Serve una tua azione:** no — verifica visiva opzionale su tenant già oltre soglia (retroattività).

Profilo: Esecuzione · Modalità: deep · Branch: `env/test` · DB: solo TEST · Nessuna migrazione.

---

## 1. Cosa è stato fatto

1. **Blocchi duri (solo nuovi inserimenti):** costante `MENU_MAGAZZINO_HARD_LIMITS` + helper puri; pulsante disabilitato + messaggio rosso (`MenuMagazzinoLimitNotice`) su categorie, prodotti/categoria, preset staff, QR; toast difensivo al click se si aggira il disabled.
2. **Cap testo:** descrizione categoria overlay completata (79 char + contatore `N/79`); nome/titolo/descrizione prodotto già allineati a FU-030.
3. **Avviso propagazione ingredienti:** `MenuMagazzinoPropagationNotice` nel form Nuovo/Modifica Prodotto (prima di Salva).
4. **Test:** 9 Vitest `@admin-blindatura: menu-magazzino-limits` (soglie, retroattività, conteggio, cap).
5. **Skill + masterplan + FU-M3-2** allineati.

## 2. File toccati e perché

| File | Perché |
|------|--------|
| `src/features/booking/constants/menuMagazzinoLimits.ts` | Soglie 7/12/6/6 + helper retroattivi + messaggio propagazione |
| `src/features/booking/components/MenuMagazzinoLimitNotice.tsx` | UI messaggio limite |
| `src/features/booking/components/MenuMagazzinoPropagationNotice.tsx` | Avviso Prenota/QR su form ingrediente |
| `src/features/booking/components/MenuPricesTab.tsx` | Limiti UI + cap descrizione categoria + avviso ingredienti |
| `src/features/booking/components/MenuQrManager.tsx` | Limite 6 QR |
| `src/features/booking/constants/__tests__/menuMagazzinoLimits.adminBlindatura.test.ts` | Suite blindatura limiti |
| `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | §7 §9.3 Fase 1 ✅ / Fase 2 |
| `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md` | Limiti + cap + avviso |
| `docs/MASTERPLAN_BLINDATURA.md` | Stato M3 Fase 1 |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | §8-ter test menu-magazzino-limits |
| `docs/FOLLOW_UP.md` | **FU-M3-2** Fase 2 |
| `docs/SESSION_LOG.md` | Riga sessione |

## 3. Test eseguiti e risultato

- `npm run validate` → **536 test passed**, exit 0.
- Vitest mirato: `menuMagazzinoLimits.adminBlindatura.test.ts` → **9/9** verdi.

## 4. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `ADMIN_MENU_MAGAZZINO_CONTEXT.md` | §9.3 split Fase 1/2; banner test | Fonte decisioni M3 |
| `MENU_ADMIN_CONTEXT.md` | §3 limiti + avviso | Layout/comportamento tab Menu |
| `MASTERPLAN_BLINDATURA.md` | Riga + sezione M3 | Stato milestone |
| `ADMIN_TEST_SUITE_INDEX.md` | §8-ter | Indice test blindatura |
| `FOLLOW_UP.md` | FU-M3-2 | Debito Fase 2 toggle |
| `SESSION_LOG.md` | Riga | Cronologia |

## 5. QA manuale responsive (TESTING_SKILL §7.2)

Tenant: **Trattoria Da Tommaso** (`trattoria-da-tommaso`) · dev server locale · commit working tree.

| ID | Caso | mobile 375 | tablet 834 | desktop 1280 |
|----|------|------------|------------|--------------|
| L1 | Tab Menu carica hero + griglia categorie | OK | Non ripetuto* | Non ripetuto* |
| L2 | Form ingrediente: contatori 0/24 e 0/79 | OK | — | — |
| L3 | Avviso propagazione Prenota/QR visibile (`role=note`) | OK | — | — |
| L4 | Messaggio limite «Hai raggiunto il massimo…» a soglia | Non testato** | Non testato | Non testato |

\* Solo 375px verificato in browser MCP (stesso layout tab Menu; soglie identiche su viewport).
\** Tenant ha 5 categorie (<7): pulsanti abilitati correttamente; messaggio limite coperto da Vitest retroattività + logica disabled.

## 6. Dati comunicazione

- **«lavoro ok»** (×1) — chiusura accettata senza correzioni al codice.
- Prompt esecutore strutturato (skill obbligatorie, output numerati, vincoli NO toggle/NO migrazione) — efficace, zero ambiguità su scope Fase 1 vs Fase 2.
- Matteo usa profilo Esecuzione + deep: implementazione diretta senza intervista aggiuntiva.

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **2** (task M3 Fase 1 + «lavoro ok»).
- Correzioni dopo 1ª risposta: 0.
- Follow-up generati: FU-M3-2 (Fase 2).
- Modalità alzata: no (già deep).

## 8. La tua lettura della sessione

**Impressioni:** il prompt M3 Fase 1 era ben delimitato (cosa sì / cosa no); la mappa §9 aveva già i numeri — implementazione lineare. Helper puri separati da UI = test facili senza mock pesante di `MenuPricesTab`.

**Difficoltà:** individuare dove fosse l’«avviso categoria» preesistente (hint per-campo, non banner unico) → risolto con banner dedicato solo sul form ingrediente come da §9.

**Migliorie suggerite (dato, non modificare skill da solo):** in `MENU_ADMIN_CONTEXT.md` potrebbe bastare un wireframe testuale «dove appare il limite» per ogni superficie — riduce grep su `MenuPricesTab` in sessioni future.

## 9. Derivazione errori

Nessuna difficoltà bloccante. QA limite a soglia piena rimandato a tenant test con ≥7 categorie o seed dedicato (non richiesto in Fase 1).

## 10. Cosa resta per la prossima sessione

| ID | Cosa | Dove |
|----|------|------|
| **FU-M3-2** | M3 Fase 2 — toggle disponibilità magazzino + migrazione `menu_items`/`menu_categories` + vetrine Prenota/QR | `FOLLOW_UP.md` |
| M3 blindatura | Controtest rename/delete categoria (sync multi-risorsa, radice FU-MQR-3) | `ADMIN_MENU_MAGAZZINO_CONTEXT.md` §9.4 |
| M3 blindatura | QA browser messaggio limite a soglia piena (tenant ≥7 cat / ≥12 prod) | opzionale pre-blindato |
| M3 blindatura | Espandere `@admin-blindatura: menu-magazzino` oltre limiti (sync, toggle post FU-M3-2) | `ADMIN_TEST_SUITE_INDEX.md` §8-ter |
| Doc | Area 4 in `PLAN_BLINDATURA_ADMIN.md` | debito masterplan preesistente |

## 11. Invarianti verificati

- `booking_requests.menu_selection` (snapshot prenotazioni): **nessuna modifica** a hook submit / tipi / resolver.
- Nessuna migrazione DB.
- Toggle disponibilità: **non implementato** (FU-M3-2).

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «Profilo: Esecuzione · Modalità: deep … M3 Fase 1 — tab Menu admin … Output attesi: 1) Blocchi duri … 6) Report + allineamento skill §7.2 … Niente output in più senza Sì/No (NO toggle disponibilità, NO migrazione DB, NO FU-MQR-2/3).» — prompt esecutore completo in apertura sessione. (2) «lavoro ok» — chiusura accettata, report completo (questo file), niente commit.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero?
✅ R2: Rieseguito ora `npm run validate` → **536 passed / 66 file**, exit 0. Scope **questa sessione** (M3 Fase 1): 6 file `src/` nuovi/modificati (`menuMagazzinoLimits.ts`, 2 componenti notice, `MenuPricesTab.tsx`, `MenuQrManager.tsx`, test adminBlindatura 9 `it`); 6 doc skill/masterplan/FU/SESSION_LOG + report untracked. **Fuori scope** nello stesso working tree (non inclusi nel report §2): `e2e/admin-booking-mgmt.spec.ts`, `playwright.config.ts`, `e2e/helpers/`, `OSSERVAZIONI.md`, delete `Comandi per terminale.md` — lavoro altrui/preesistente, non toccato in questa chat.

❓ Q3 — File correlati allineati?
✅ R3: Allineati §4 tabella skill; `PRENOTA_DATA_FLOW_CONTEXT` non modificato (snapshot intatto, coerente); `PLAN_BLINDATURA_ADMIN.md` Area 4 ancora da espandere (debito preesistente masterplan).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Toggle disponibilità + migrazione (FU-M3-2); controtest rename/delete; E2E Playwright menu; QA messaggio limite su tenant ≥7 categorie; commit/push (non richiesti); **non** dichiarato M3 blindato.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito minimo su `MenuPricesTab` (~1900 LOC) — edit chirurgici; proposta: estrarre sezione limiti in hook `useMenuMagazzinoLimits` se Fase 2 aggiunge toggle (riduce diff futuro).

❓ Q6 — Contesto & hook?
✅ R6: Skill §9 + MENU_ADMIN + TESTING §7 sufficienti; deep giustificato da 4 superfici UI + test + doc.
