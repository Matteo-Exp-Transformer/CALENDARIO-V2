# Report — Fase D rompi + QA 375/834/1280 (§7A)

**Data:** 16-06-26  
**Profilo:** Verifica deep (7A esecutore) · branch `env/test`  
**Account QA:** `tomas@t.com` / Trattoria Da Tommaso (Pro) · slug pubblico `trattoria-da-tommaso`  
**DB:** nessuna modifica · dev `http://localhost:5173` + TEST Supabase  
**Commit:** nessuno (come da prompt)

- **Cosa è cambiato:** eseguita Fase D «rompi» su Impostazioni + smoke Prenota; gate automatico confermato verde; QA browser manuale su save-guard/modali (1280) e layout pill/footer (375/834).
- **Cosa resta:** FU-009 upload foto reale carosello; QA rompi su tenant **Classic** (fasce orarie); allineamento doc context; report finale matrice §3-quater.5.A per §7B.
- **Serve una tua azione:** no per i fix prodotto emersi (nessun bug bloccante trovato); sì per **§7B revisore** + eventuale upload carosello manuale tuo se vuoi chiudere FU-009 prima del verdetto blindatura.

---

## 1. Gate automatico (prerequisito §7A)

| Comando | Esito | Riepilogo |
|---------|-------|-----------|
| `npm run validate` | ✅ Verde | lint + typecheck + **733/733** (~39s) |
| `npx vitest run settingsSaveGuard settingsTimeSlots settingsTheme settingsBackground settingsFormConfig settingsPromo settingsCarouselCrud --reporter=verbose` | ✅ Verde | **69/69** fronti M4 Impostazioni aggregati (~12s) |

Nessun timeout suite; nessun fallimento «rompi» emerso dai test Vitest.

---

## 2. Findings (prima, per severità)

### P0 — blocca verdetto «Area 3 blindata» (§3-quater.6)

| ID | Finding | Evidenza | Fix / nota |
|----|---------|----------|------------|
| FU-009-R | **Upload foto carosello Supabase reale** non eseguito in browser in questa sessione | Vitest mock OK (§6); MCP browser senza `setInputFiles` affidabile per Storage | QA manuale: Personalizza form → carosello → «Aggiungi foto» → verifica URL + Prenota pubblico. Resta follow-up §7B o Matteo |
| QA-CL-R | **Fasce Classic** non verificate in browser (tenant Pro nasconde blocco) | `tomas@t.com` = edition Pro → sezione «Fasce orarie» assente (**voluto**) | Ripetere smoke 375/834/1280 con `classic@c.com` / `trattoria-test-classic` per il solo blocco fasce, oppure accettare copertura Vitest `settings-time-slots` (20 test) come sufficiente per Classic |
| DOC-R | **Matrice §3-quater.5.A + context** non ancora aggiornati a chiusura Area 3 | `ADMIN_SETTINGS_CONTEXT.md` §139–141 ancora «FU-009 residuo»; `PRENOTA_FORM_CONFIG_CONTEXT.md` ~41 promo/footer obsoleto | Task **§7B revisore** + mini-fix doc (no codice prodotto) |

### P1 — residui documentati / infra QA

| ID | Finding | Evidenza | Fix consigliato |
|----|---------|----------|-----------------|
| E2E-R | **Playwright headless login admin fallisce** in locale (resta su `/login`) con credenziali valide | `classic@c.com` e `tomas@t.com` auth OK via API Supabase; browser Cursor login OK su `:5173`; `npx playwright test admin-shell-blindatura` fallisce | Investigare webServer Playwright / env Vite in CI locale; finché non verde, QA Impostazioni resta **manuale documentata** (come questa sessione) |
| DOC-P1 | `PRENOTA_FORM_CONFIG_CONTEXT.md` riga ~41: promo «lista dirty → footer» | Codice + test §5: apply/delete/toggle = **`saveSilently`**; footer solo se silent fail | Allineare riga promo a `saveSilently` + dirty retry (fix doc §7B) |

### P2 — voluto o già coperto da test

| ID | Finding | Evidenza | Verdetto |
|----|---------|----------|----------|
| — | Copy modale delete promo «prossimo salvataggio» | Test `settingsPromo.settingsM4` assert **no** match; grep sorgente UI pulito | **Chiuso** in codice; solo doc ~41 da allineare |
| — | Tema admin-only | Cambio tema → dirty + modale pubblica; tema non tocca Prenota (test + comportamento atteso) | **Voluto** |
| — | Delete card/carosello modale | Coperto Vitest `settings-form-config` §1C/§5 | **Blindato** test; smoke browser delete non ripetuto in 7A |

### Nessun bug prodotto emerso dal «rompi» manuale (1280)

Passaggi eseguiti su **Impostazioni locale** (`RestaurantSettingsTab`, pill Anagrafica / Personalizza form):

1. Seleziona tema Terracotta → footer «Modifiche non salvate» + Salva/Annulla tutte ✅  
2. Salva → **una** modale «Salva modifiche pubbliche?»; Annulla chiude senza persist ✅  
3. Pill Personalizza form con dirty → guard «Modifiche non salvate» (Resta qui / Salva e continua / Annulla e continua); Resta qui non bypassa ✅  
4. Annulla tutte → modale conferma dedicata ✅  

---

## 3. Tabella QA viewport (§7.2 TESTING_SKILL)

Account: `tomas@t.com` · dev `:5173` · QA **manuale** (browser IDE) salvo riga Playwright pubblico.

| ID test | Viewport | Caso | Esito | Nota |
|---------|----------|------|-------|------|
| QA-1280-01 | 1280×800 | Smoke Impostazioni pill + anagrafica | ✅ | Pill Anagrafica / Personalizza form visibili |
| QA-1280-02 | 1280 | Tema dirty → footer | ✅ | Region «Modifiche non salvate» |
| QA-1280-03 | 1280 | Salva → modale pubblica singola | ✅ | Annulla modale OK |
| QA-1280-04 | 1280 | Pill dirty → guard | ✅ | Non bypass |
| QA-1280-05 | 1280 | Annulla tutte → conferma | ✅ | Modale «Annullare tutte le modifiche?» |
| QA-1280-06 | 1280 | Fasce Classic UI | ⏭️ N/A | Tenant Pro: sezione assente (voluto) |
| QA-375-01 | 375×812 | Impostazioni pill visibili | ✅ | Dopo navigate `/admin/impostazioni` |
| QA-375-08 | 375 | Smoke Prenota pubblico | ✅ | Titolo «Trattoria Da Tommaso», form/carousel area |
| QA-834-01 | 834×1194 | Impostazioni (sessione attiva) | ✅ | Viewport impostato; stesso tenant loggato |
| QA-PW-PUB | 375/834/1280 | Playwright `settings-m4-phase-d-7a` smoke pubblico | ✅ 3/3 | Solo test anonimo `/prenota/...` passano; admin login Playwright ❌ |
| QA-FU009 | 1280 | Upload foto carosello reale | ❌ | Non eseguito |

**Gap QA rispetto al prompt §7A:** promo delete/toggle/apply, sfondo striscia/full-page, delete card/carosello, carousel upload, logout-during-dirty, doppio-click Salva — **non ripetuti uno per uno in browser** in questa sessione; copertura affidata a Vitest fronti §1–§6 (69 casi verdi) + rompi manuale save-guard sopra.

---

## 4. Matrice §3-quater.5.A (stato post-7A)

| Schermata/blocco | Stato | Note 7A |
|------------------|-------|---------|
| Ingresso pill + guard | **Blindato** | Vitest save-guard + QA manuale pill/guard OK |
| Anagrafica + contatti | **Blindato** | Smoke UI OK; cap contatori visibili |
| Orari apertura | **Blindato** logica | Vitest; QA viewport parziale |
| Limite giornaliero | **Blindato** | Campo visibile; smoke non vuoto/1000 |
| Fasce Classic | **Blindato** test | Vitest 20/20; QA browser solo Classic tenant |
| Tema app | **Blindato** | Vitest + QA dirty/modale OK |
| Sfondo Prenota | **Blindato** test | Vitest D-M2; QA browser sezione non scrollata in 7A |
| Personalizza form — header/modalità/card | **Blindato** test | Vitest form-config; browser parziale |
| Carosello FU-009 | **Quasi chiuso** | Vitest 12/12; **upload reale ❌** |
| Promo | **Blindato** test | Vitest promo; doc ~41 obsoleto |
| Salvataggio globale | **Blindato** | Vitest 10/10 + QA rompi modale/guard |
| Chiavi fuoriscope | **Voluto** | Non toccato |

**Verdetto Area 3:** **non blindata** — criterio §3-quater.6 non soddisfatto (FU-009 upload browser, matrice/doc finali, QA Classic fasce opzionale).

---

## 5. Test eseguiti — riepilogo comandi

```text
npm run validate                                    → 733/733 ✅
npx vitest run settingsSaveGuard … settingsCarousel → 69/69 ✅
npx playwright test settings-m4-phase-d-7a (tomas)  → admin 22 fail (login headless); pubblico 3/3 ✅
QA manuale browser IDE tomas@t.com :5173            → save-guard rompi OK (1280); pill 375; prenota 375
```

---

## 6. File toccati

| File | Perché |
|------|--------|
| `Report-fase-d-rompi-7a-15-06-26.md` | Output §7A (questo file) |
| `e2e/settings-m4-phase-d-7a.spec.ts` | Bozza Playwright creata e rimossa (login headless non affidabile); esiti incorporati nel report |

Nessuna modifica codice prodotto, skill o context in questa sessione.

---

## 7. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| Nessuno | — | Allineamento `ADMIN_SETTINGS_CONTEXT`, `PRENOTA_FORM_CONFIG`, `ADMIN_TEST_SUITE_INDEX`, matrice PLAN → **§7B revisore** |

---

## 8. Dati comunicazione

- Matteo: «esegui prompt 7A» + contesto verdetto 7B precedente; «usa tomas@t.com 123456» per sbloccare login QA.
- Account Pro adatto a rompi save-guard/Personalizza form; **Classic** serve solo per fasce orarie visibili in UI.

---

## 9. Analisi flusso prompt

- Prompt 7A chiaro; blocco iniziale su `classic@c.com` + Playwright headless risolto parzialmente con account Pro e QA manuale IDE.
- Prossimo passo naturale: **§7B revisore** con stesso account o Classic per fasce + upload FU-009 manuale Matteo.

---

## 10. La lettura della sessione

I fronti Vitest §1–§6 reggono il «rompi» logico: il save-guard in browser si comporta come documentato (modale pubblica unica, guard pill, conferma Annulla tutte). Il collo di bottiglia resta **operativo**, non funzionale: upload carosello reale, doc context non allineati, Playwright admin login rotto in headless locale. Area 3 è **matura nei test automatici** ma **non blindata end-to-end** finché FU-009 browser e chiusura documentale non sono fatti in §7B.

---

## 11. Prompt fix per §7B (solo ciò che serve)

```text
Profilo: Verifica deep §7B — revisione finale Area 3.
Usa tomas@t.com (Pro) + classic@c.com (Classic fasce) su localhost:5173.
Controverifica report Report-fase-d-rompi-7a-15-06-26.md.
Esegui FU-009 upload foto carosello manuale (Personalizza form).
Allinea ADMIN_SETTINGS_CONTEXT §139–141, PRENOTA_FORM_CONFIG ~41 (promo saveSilently), ADMIN_TEST_SUITE_INDEX.
Aggiorna matrice §3-quater.5.A nel report finale.
Verdetto blindata / non blindata. Niente commit salvo «fai report finale».
```
