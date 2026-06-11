# Report — Verifica M3 Menu / magazzino (cancello blindatura)

**Data:** 11-06-26 · **Profilo:** Verifica · **Modalità:** deep · **Branch:** `env/test` (3ee202c → 46cf7c2)

---

## Cappello

- **Cosa è cambiato:** niente in codice applicativo — eseguita **verifica** post-M3 (baseline automatica + QA browser parziale + confronto report implementazione).
- **Cosa resta:** **sistemare i test QA browser** (FU-M3-QA-E2E); gate Matteo T1–T3; smoke T5–T7; tenant oltre soglia L3; controtest Fase C.
- **Serve una tua azione:** **sì** — conferma visiva T1 (occhio header non chiude la card) su `/admin/menu` prima di Blindato M3.

---

## Cosa è stato fatto

1. Confermati commit M3 su `env/test` (`3ee202c` toggle UX, `4df46c5` sync test, `46cf7c2` doc).
2. Rieseguito `npm run validate` → **553** test verdi; suite M3 isolate **26/26** (limiti 9 + availability 8 + sync 9).
3. Verificato ambiente TEST (`docnnernvp`); tenant QA `trattoria-da-tommaso`; QR `ypyayc6`.
4. QA browser Fase B su 375 / 834 / 1280 via script Playwright ad hoc: **L1, L2, T3 OK**; **T1 KO** (da confermare); T2–T7 e B4 non completati per instabilità script.
5. Fase C controtest: **non chiusa** (stesso blocco test).
6. Confronto con report Fase 1/2/3 implementazione: coerente salvo gap QA browser.
7. Ripristinato su TEST `is_available=true` su categorie/ingredienti (run QA precedenti avevano spento tutto).
8. Aperti follow-up **FU-M3-QA-L3**, **FU-M3-QA-CT**, **FU-M3-QA-E2E** (sistemare test Playwright).

---

## File toccati e perché

| File | Perché |
|------|--------|
| `docs/Sessioni di lavoro/11-06-26/Report-verifica-m3-menu-blindatura-11-06-26.md` | Report verifica (questo file) |
| `docs/FOLLOW_UP.md` | FU-M3-QA-L3, FU-M3-QA-CT, **FU-M3-QA-E2E** (test QA da sistemare) |

Nessun file `src/` o test Vitest modificato (sessione verifica only).

---

## Test eseguiti e risultato

| Comando / strumento | Esito |
|---------------------|--------|
| `git log -3 --oneline` | ✅ SHA attesi |
| `npm run validate` | ✅ **553** passed (68 file) |
| `npx vitest run` suite M3 (3 file) | ✅ **26/26** |
| Playwright script ad hoc (3 viewport) | 🔶 parziale — vedi tabella QA; **da sostituire con spec E2E** (FU-M3-QA-E2E) |
| MCP `get_project_url` + SQL TEST | ✅ `docnnernvp`; restore `is_available` |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/FOLLOW_UP.md` | +FU-M3-QA-L3, FU-M3-QA-CT, FU-M3-QA-E2E | Debiti verifica e test QA browser |
| Skill area M3 / Testing | **nessuno** | Solo verifica; aggiornamento `ADMIN_TEST_SUITE_INDEX` §8-ter con spec E2E → prossima sessione dopo FU-M3-QA-E2E |

---

## Fase A — Baseline automatica

| Controllo | Esito |
|-----------|--------|
| `git log -3` → 3ee202c / 4df46c5 / 46cf7c2 | ✅ |
| `npm run validate` | ✅ **553** test (68 file) |
| `@admin-blindatura: menu-magazzino-limits` | ✅ 9/9 |
| `@admin-blindatura: menu-magazzino-availability` | ✅ 8/8 |
| `@admin-blindatura: menu-magazzino-sync` | ✅ 9/9 |

**Ambiente:** Supabase TEST `docnnernvp`. Dev `localhost:5173`.  
**Tenant QA:** `trattoria-da-tommaso` (`.env.local.test`).  
**QR smoke:** shortCode **`ypyayc6`** → `/menu/trattoria-da-tommaso/qr/ypyayc6`.

---

## Tabella QA (Fase B)

Legenda: **OK** / **KO** / **NT**. Ingrediente probe: **tortellini** (Primi piatti).  
⚠️ Esiti T1–T2 da script ad hoc — **non affidabili** finché non passa **FU-M3-QA-E2E**.

| ID | Caso | mobile | tablet | desktop | Nota |
|----|------|--------|--------|---------|------|
| **L1** | Cap categorie — UI sotto soglia | OK | OK | OK | 5/7 cat; «Crea / Modifica Categoria» abilitato |
| **L2** | Cap prodotti / voci testo | OK | OK | OK | «Crea / Modifica Prodotto» abilitato |
| **L3** | Tenant oltre soglia | NT | NT | NT | FU-M3-QA-L3 |
| **T1** | Occhio header — non collassa card | KO* | KO* | KO* | *Script: `aria-expanded` header `true→false`; possibile falso KO — **Matteo decide** |
| **T2** | Occhio riga ingrediente visibile | KO* | KO* | KO* | *Abort script; smoke manuale OK post-restore |
| **T3** | No toggle form/overlay categorie | OK | OK | OK | |
| **T4** | Admin vede spenti (opacità) | NT | NT | NT | FU-M3-QA-E2E |
| **T5** | Propagazione Prenota | NT | NT | NT | Vitest ✅; browser → FU-M3-QA-E2E |
| **T6** | Propagazione QR | NT | NT | NT | Idem |
| **T7** | Riaccendi visibilità | NT | NT | NT | Idem |
| **T8** | Snapshot prenotazioni | NT | NT | NT | Vitest `menu-magazzino-availability` ✅ |
| **S1** | Rename overlay | NT | NT | NT | 9 Vitest sync ✅ |
| **S2** | Delete categoria vuota | NT | NT | NT | Idem |
| **B4** | Console + touch 375px | NT | NT | NT | FU-M3-QA-E2E |

### Toggle panoramica — OK per blindatura?

| Viewport | T1 | T2 | T3 | Gate |
|----------|----|----|-----|------|
| 375×812 | KO* | KO* | OK | ⬜ Matteo |
| 834×1194 | KO* | KO* | OK | ⬜ |
| 1280×800 | KO* | KO* | OK | ⬜ |

**Regola:** KO su T1–T3 → no Blindato. T3 OK; T1 da conferma umana (test automatico da rifare).

---

## Debito test QA — da sistemare (FU-M3-QA-E2E)

I **Vitest M3 (26) sono OK**; manca una **suite Playwright ufficiale** ripetibile. Problemi degli script ad hoc 11-06-26:

| Problema | Effetto | Fix atteso nella spec E2E |
|----------|---------|---------------------------|
| Selettore «Categorie Menu» (titolo overlay) al posto del pulsante toolbar | Timeout L1/T3 | `getByRole('button', { name: /Crea \/ Modifica Categoria/i })` |
| `waitForLoadState('networkidle')` su Prenota/QR | Hang 3–5 min | `domcontentloaded` + wait esplicita su testo/menu |
| T1 misura `aria-expanded` sul **button header** intero | Falso KO se click colpisce area sbagliata | Click solo `aria-label` «Nascondi {categoria} in Prenota e Menu QR»; assert separato su `#…-content` `aria-hidden` |
| Card collassata → ingrediente non in DOM | Timeout T2–T7 | Expand categoria (`aria-expanded`) prima di cercare tortellini |
| Nessun teardown | Tenant TEST con tutte le categorie spente | `afterEach`/`finally`: ripristino `is_available` o item/categoria dedicati E2E |
| Script one-off in `scripts/` | Non in CI, non in TEST_SUITE_INDEX | `e2e/admin-menu-magazzino-blindatura.spec.ts` + marcatore `@admin-blindatura: menu-magazzino` |

Riferimento pattern: `e2e/admin-booking-mgmt.spec.ts` (FU-043) — viewport projects + staging helper.

---

## Controtest Fase C

| ID | Finding | Esito | Decisione |
|----|---------|-------|-----------|
| C-D1 | Doppio click toggle | NT | FU-M3-QA-CT + E2E |
| C-D2 | Refresh con spento | NT | FU-M3-QA-CT |
| C-D3 | Form dopo toggle off | NT | FU-M3-QA-CT |
| C-U1 | Form durante mutation | NT | FU-M3-QA-CT |
| C-U2 | Chiudi overlay categorie | NT | FU-M3-QA-E2E |
| C-L1 | +1 oltre cap | NT | FU-M3-QA-L3 |
| C-R1 | T1–T2 responsive | Parziale | FU-M3-QA-E2E |

---

## Confronto report implementazione vs codice/osservato

| Report | Promessa | Verifica | Gap |
|--------|----------|----------|-----|
| Fase 2 availability | Toggle + filtri; 8 Vitest | ✅ | QA browser T5–T7 |
| Toggle UX panoramica | Occhio panoramica only; `stopPropagation` | ✅ T3; codice OK | T1 smoke + E2E |
| Fase 3 sync | 9 Vitest rename/delete | ✅ | S1/S2 solo Vitest |
| Fase 1 limiti | 9 Vitest; blocchi +1 | ✅ L1/L2 | L3 seed |

---

## Cancello blindatura (MANUALE §4)

| Voce | Stato |
|------|--------|
| Intervistata + mappata | ✅ |
| Test copertura Vitest `@admin-blindatura` | ✅ 26 + validate 553 |
| `npm run validate` rieseguito | ✅ |
| Controtest «rompi» | 🔶 FU-M3-QA-CT |
| QA responsive 375/834/1280 | 🔶 FU-M3-QA-E2E + conferma Matteo T1 |
| Doc allineata | ✅ (commit M3) |
| Report con esiti | ✅ |

**Verdetto:** **Follow-up necessario** — Vitest pronti; **cancello QA browser** aperto fino a FU-M3-QA-E2E + OK Matteo su T1–T3.

---

## Serve azione Matteo

1. **T1–T3 (gate blindatura):** `/admin/menu` → Primi piatti → click **solo occhio** header: card resta aperta/chiusa com’era, disponibilità cambia. Sì/no per mobile/tablet/desktop.
2. **Smoke opzionale:** spegni tortellini → sparisce Prenota + QR `ypyayc6` → riaccendi.
3. **Priorità team:** implementare **FU-M3-QA-E2E** prima del prossimo giro verifica (evita script ad hoc).
4. **MASTERPLAN:** resta ⬜ Blindato M3 — non aggiornato in questa sessione.

---

## Dati comunicazione

| Voce | Dettaglio |
|------|-----------|
| Prompt Matteo | 4: verifica deep M3; «quanto ti manca?»; notifiche shell; «aggiungi nel report e follow up che bisogna sistemare i test, poi completa il report» |
| Formato efficace | Output numerati Fasi A–D + gate esplicito T1–T3 |
| Da automatizzare | Spec E2E M3 in repo (FU-M3-QA-E2E) |

---

## Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali:** 4
- **Correzioni dopo 1ª risposta:** 1 (completare report + voce test)
- **Follow-up generati:** FU-M3-QA-L3, FU-M3-QA-CT, **FU-M3-QA-E2E**
- **Modalità:** deep (mantenuta)

---

## La mia lettura della sessione

**Impressioni:** Fase A solida (553 verdi, 26 M3 isolati). Il collo di bottiglia è **QA browser non ingegnerizzato** — stesso gap che M2 ha chiuso con FU-043 E2E. Vitest ≠ robustezza UI toggle.

**Difficoltà:** script ad hoc falliti 3 volte (selettori, networkidle, tenant sporco). Risolto parzialmente con SQL restore; non sostituisce spec in `e2e/`.

**Suggerimento (dato):** in `ADMIN_TEST_SUITE_INDEX` §8-ter aggiungere riga «prossimo: `e2e/admin-menu-magazzino-blindatura.spec.ts`» quando FU-M3-QA-E2E parte; in `TESTING_SKILL` §7.3 snippet selettori tab Menu.

---

## Derivazione errori

| Tipo | Cosa | Evitabile |
|------|------|-----------|
| Errore agente | Script QA ad hoc invece di spec `e2e/` | FU-M3-QA-E2E prima della verifica |
| Errore agente | Selettore «Categorie Menu» vs pulsante toolbar | Checklist in TESTING_SKILL |
| Vincolo | L3 NT senza tenant >7 cat | FU-M3-QA-L3 seed |
| Bug preesistente? | T1 KO — da confermare | Smoke Matteo; se OK → solo test da sistemare |

---

## Cosa resta per la prossima sessione

1. **FU-M3-QA-E2E** — implementare e far passare spec Playwright M3 (priorità).
2. **FU-M3-QA-CT** — scenari controtest in quella spec o secondo file.
3. **FU-M3-QA-L3** — seed tenant oltre soglia su TEST.
4. Gate Matteo T1–T3 + eventuale smoke T5–T7.
5. Solo dopo sopra: sessione «chiusura blindatura M3» + aggiornamento MASTERPLAN.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt verifica deep M3 (Fasi A–D, report, no Blindato autonomo, gate T1–T3). (2) «quanto ti manca?». (3) Notifiche task shell falliti. (4) «aggiungi nel tuo report e in follow up che bisogna sistemare i test , poi completa il report.»

❓ Q2 — Dati = diff reale?
✅ R2: Ri-verificato 11-06-26: validate 553/68; vitest M3 26/26; commit triplo; `MenuMagazzinoAvailabilityToggle` `stopPropagation`; QR `ypyayc6`; tenant 5 cat; report allineato a output script parziale in `scripts/qa-m3-output.json` (poi rimosso).

❓ Q3 — File correlati allineati?
✅ R3: Aggiornati questo report + `FOLLOW_UP.md` (3 FU M3-QA). `ADMIN_TEST_SUITE_INDEX` §8-ter: aggiornamento E2E rimandato a implementazione FU-M3-QA-E2E. MASTERPLAN non toccato.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non implementata spec E2E (FU-M3-QA-E2E); QA T4–T7/B4 completi; Fase C; fix codice T1; Blindato MASTERPLAN; commit/push. Vitest e validate sì.

❓ Q5 — Attrito + miglioria?
✅ R5: Verifica M3 senza E2E in repo → agente inventa script fragili; miglioria: FU-M3-QA-E2E come prerequisito nel PLAN_BLINDATURA_ADMIN prima della sessione «verifica finale».

❓ Q6 — Contesto & hook?
✅ R6: Skill Testing + Manuale + ADMIN_MENU §9 sufficienti per Fase A; per Fase B mancava inventario E2E M3 in TEST_SUITE_INDEX — ora tracciato in FU-M3-QA-E2E.

---

## Self-review (§12)

1. **Dati = diff** — validate 553 e 26 M3 ri-eseguiti in sessione; gap QA documentato onestamente.
2. **Skill** — FOLLOW_UP aggiornato; TEST_SUITE_INDEX E2E esplicitamente in FU.
3. **Q1–Q6** — complete con prompt 4 di Matteo.
4. **Tono** — gate e debito test in linguaggio schermata/flusso.
