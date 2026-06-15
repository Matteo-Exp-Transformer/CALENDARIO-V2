# Prompt sequenziali — test blindatura Admin Impostazioni

> Uso: lanciare i prompt in ordine. Per ogni sezione: prima **Esecutore**, poi **Revisore controverifica**.
> Nessun agente deve dichiarare verde un fronte se il comando resta in timeout o non arriva al riepilogo finale.

## Stato sequenza (15-06-26)

| § | Fronte | Stato | Commit / report |
|---|---|---|---|
| 1 | Gate Batch 1/2 (D-M1/D-M2) | ✅ approved | `9d7d997` · `Report-gate-batch1-2-15-06-26.md` |
| 2 | settings-save-guard | ✅ approved | `db99c3a` · `Report-settings-save-guard-15-06-26.md` |
| 3 | settings-time-slots | ✅ approved | `2a496e1` |
| 4 | settings-theme | ✅ approved | `d8c9dab` · `Report-settings-theme-15-06-26.md` |
| 5 | form-config + promo (estensione) | ✅ approved | `2cdc724` · `Report-settings-form-config-promo-15-06-26.md` |
| 6 | FU-009 carousel CRUD | ✅ approved | `95f2128` · `Report-settings-carousel-crud-15-06-26.md` |
| 7 | Fase D rompi + QA 375/834/1280 | ⏳ aperto | — |

**Prossimo prompt consigliato:** §7A esecutore (Fase D rompi + QA 375/834/1280).

---

## 0. Regole comuni per tutti i prompt

- Branch: `env/test`.
- DB: solo TEST `docnnernvpyrbwuzzach`; questi prompt sono principalmente Vitest/QA, quindi non scrivere DB salvo istruzione esplicita.
- PROD `rwuxgvldzrkabglkasym`: vietato.
- Non usare `supabase db push`.
- Non toccare `booking_window_days`, migrazioni, whitelist anon di `timezone` / `daily_guest_limit` / `booking_window_days`.
- Working tree potenzialmente sporco: non revertire lavoro altrui.
- Ogni test nuovo deve avere:

```ts
// @admin-blindatura: settings-...
// Copre: ...
```

---

## 1. Gate Batch 1/2 — stabilizzare test D-M1/D-M2 ✅ approved (15-06-26)

### 1A — Prompt esecutore ✅ approved

Eseguito 15-06-26 — gate aggregato **20/20**, validate **663/663**. Commit `9d7d997`. Report: `Report-gate-batch1-2-15-06-26.md`.

```text
Profilo: Esecuzione deep — stabilizzazione test Batch 1/2 Admin Impostazioni.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi prima:
- AGENTS.md
- docs/Comunicazione-Skill/VOCABOLARIO.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md
- docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-batch1-d-m1-promo-15-06-26.md
- docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-d-m2-sfondi-prenota-15-06-26.md

Missione:
chiudi il gate test dei due batch gia implementati. Non aggiungere feature.

Stato noto:
- settings-background + publicBookingSurface: gia verdi in isolamento.
- settings-form-config: verde in isolamento, ma con warning act(...).
- settings-promo: va in timeout; non e verde.

Fai solo:
1. Isola e correggi la causa del timeout in settingsPromo.settingsM4.adminBlindatura.test.tsx.
2. Se i warning act(...) di settings-form-config fanno fallire validate o rendono instabile la suite, stabilizzali con wait/cleanup/test helper, senza cambiare il comportamento prodotto.
3. Rilancia in isolamento:
   - npx vitest run settingsPromo.settingsM4 --reporter=verbose
   - npx vitest run settingsFormConfig.settingsM4 --reporter=verbose
   - npx vitest run src/features/booking/lib/__tests__/settingsBackground.adminBlindatura.test.ts src/features/booking/constants/__tests__/publicBookingSurface.test.ts --reporter=verbose
4. Poi rilancia i quattro file insieme.
5. Se tutto e verde, esegui npm run validate.

NON toccare:
- booking_window_days
- migrazioni
- flussi Prenota non collegati a D-M1/D-M2
- copy o UX non richiesti

Output atteso:
- elenco file modificati;
- comando per comando: verde/fallito/timeout con riepilogo test;
- se validate non passa, findings precisi e prossimo fix puntuale.
Niente commit/push.
```

### 1B — Prompt revisore controverifica ✅ approved

Controverificato 15-06-26 — gate **20/20**; gap P2 delete carosello headerActions → fix §1C.

```text
Profilo: Verifica deep — controverifica gate test Batch 1/2.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- report dell'esecutore Gate Batch 1/2, se presente

Missione:
non fidarti del report. Rilancia i test e cerca difetti logici nei test stessi.

Controlla:
- settings-promo termina con riepilogo finale e non solo con test avviato;
- settings-form-config copre davvero riga collassata, editor aperto, carosello, Annulla e Conferma;
- settings-background copre legacy gradient/tile, XOR striscia/full-page, crema tecnica;
- nessun test dipende da ordine suite o import instabile dal componente sotto test;
- nessuna modifica ha toccato booking_window_days, migrazioni o whitelist anon vietate.

Comandi minimi:
- npx vitest run settingsPromo.settingsM4 --reporter=verbose
- npx vitest run settingsFormConfig.settingsM4 --reporter=verbose
- npx vitest run src/features/booking/lib/__tests__/settingsBackground.adminBlindatura.test.ts src/features/booking/constants/__tests__/publicBookingSurface.test.ts --reporter=verbose
- npm run validate, solo se i mirati sono verdi

Output:
findings prima, con severita. Se tutto e verde, dichiara quali comandi hai rilanciato e quanti test passano.
Niente commit/push.
```

### 1C — Prompt fix carosello (post-1B revisore) ✅ approved

Fix puntuale su gap P2 revisore: Annulla + delete headerActions carosello in `settingsFormConfig.settingsM4.adminBlindatura.test.tsx`. Eseguito e controverificato 15-06-26 — gate aggregato 20/20, validate 663/663.

---

## 2. settings-save-guard — footer unico, modale pubblica, dirty guard ✅ approved (15-06-26)

### 2A — Prompt esecutore ✅ approved

Eseguito 15-06-26 — 9 casi iniziali; fix post-2B → **10/10**, validate **673/673**. Commit `db99c3a`. Report: `Report-settings-save-guard-15-06-26.md`.

```text
Profilo: Esecuzione deep — test settings-save-guard.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md

Missione:
costruisci o estendi test Vitest per il fronte @admin-blindatura: settings-save-guard.

Casi obbligatori:
- un solo footer Salva modifiche per Anagrafica + Personalizza form;
- Salva apre una sola PublicDataSaveConfirmModal;
- doppio click Salva non crea doppia mutation;
- errore mutation lascia il footer/dirty recuperabile e non chiude la modale come se fosse ok;
- cambio pill Anagrafica/Form con dirty passa dal guard;
- cambio sezione/logout durante save pending resta protetto.

Indicazioni:
- usa mock controllati di useUpsertRestaurantSetting e UnsavedChangesProvider;
- niente DB reale;
- se un caso richiede browser reale, separalo come QA manuale/Playwright e non fingere copertura Vitest.

Test:
- run mirato del file creato/esteso;
- poi npm run validate se il mirato e verde.

Aggiorna ADMIN_TEST_SUITE_INDEX.md solo se il fronte diventa verde.
Niente commit/push.
```

### 2B — Prompt revisore controverifica ✅ approved

Fix post-2B (guard «Salva e continua» vs save pubblico pending): `combinedSaveInFlightRef` + test #10. Eseguito e controverificato 15-06-26 — 10/10, validate 673/673. Report: `Report-settings-save-guard-15-06-26.md`.

```text
Profilo: Verifica deep — controverifica settings-save-guard.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- report dell'esecutore settings-save-guard

Missione:
prova a rompere il salvataggio, non solo a confermare il verde.

Controlla:
- doppio click realmente non duplica mutation;
- fallimento mutation lascia retry possibile;
- guard non si bypassa cambiando pill/sezione/logout;
- test non sono solo snapshot/copy, ma verificano stato utente visibile;
- documentazione aggiornata solo se coerente con test verdi.

Rilancia:
- test mirato settings-save-guard;
- npm run validate se il mirato passa.

Output:
findings prima. Se trovi buchi, prepara un prompt fix puntuale; non allargare scope.
```

---

## 3. settings-time-slots — fasce Classic ✅ approved (15-06-26)

### 3A — Prompt esecutore ✅ approved

Eseguito 15-06-26 — 18 test fronte (9 UI + 5 helper + 4 registry), validate 691/691. Commit incluso in `2a496e1` (con fix 3C).

```text
Profilo: Esecuzione deep — test settings-time-slots.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md

Missione:
aggiungi test @admin-blindatura: settings-time-slots per le fasce orarie Classic.

Casi obbligatori:
- abilita/disabilita fasce;
- aggiungi fascia valida;
- elimina fascia con modale in-app, Annulla e Conferma;
- overlap blocca il salvataggio strutturale;
- fascia overnight/malformata gestita senza crash;
- cap per fascia vuoto/invalid/alto;
- mutation fail lascia retry;
- non confondere cap per-fascia con daily_guest_limit.

Preferenze:
- Vitest component se riesci a montare RestaurantSettingsTab in modo stabile;
- altrimenti estrai/usa helper puri gia esistenti e lascia solo il caso UI minimo.

Test:
- run mirato;
- npm run validate se verde.

Aggiorna ADMIN_TEST_SUITE_INDEX.md e ADMIN_SETTINGS_CONTEXT.md solo se il comportamento stabile viene chiarito.
Niente commit/push.
```

### 3B — Prompt revisore controverifica ✅ approved

Controverificato 15-06-26 — gap cap per-fascia invalido/alto + delete Conferma + Salva → `deleteServiceSlot` → fix §3C. Fronte aggregato **20/20**, validate **693/693**. Commit `2a496e1`.

```text
Profilo: Verifica deep — controverifica settings-time-slots.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- report dell'esecutore settings-time-slots

Missione:
cerca casi limite sulle fasce Classic.

Controlla:
- overlap e overnight sono davvero coperti;
- delete non usa window.confirm;
- capienza per fascia resta avviso/semaforo, non blocco operativo prenotazioni;
- daily_guest_limit non e stato toccato per errore;
- test falliscono se si rimuove la conferma delete o se si accetta overlap.

Rilancia test mirato e poi npm run validate se verde.
Output con findings prima.
```

### 3C — Prompt fix (post-3B revisore) ✅ approved

Fix puntuale gap revisore 3B: cap per-fascia invalido/alto (0/5001) blocca save + elimina Conferma + Salva → `deleteServiceSlot('slot-pranzo')`. Eseguito 15-06-26 — 11/11 mirato component, 20/20 fronte aggregato, validate 693/693. Commit `2a496e1`.

---

## 4. settings-theme — tema solo admin ✅ approved (15-06-26)

### 4A — Prompt esecutore ✅ approved

Eseguito 15-06-26 — **13** test fronte (6 helper + 7 UI), validate **706/706**. Commit `d8c9dab`.

```text
Profilo: Esecuzione deep — test settings-theme.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md

Missione:
aggiungi test @admin-blindatura: settings-theme.

Casi obbligatori:
- scelta tema admin imposta dirty;
- anteprima tema non salva da sola;
- Annulla ripristina;
- Salva persiste solo app_theme;
- ID tema sconosciuto o asset mancante non rompe la pagina;
- il tema non modifica Prenota pubblico ne Menu QR.

Test:
- preferisci test su helper/config se esistono;
- aggiungi un component test solo per dirty/preview/salva;
- run mirato;
- npm run validate se verde.

Niente commit/push.
```

### 4B — Prompt revisore controverifica ✅ approved

Controverificato 15-06-26 — **13/13** mirato, validate **706/706**; residuo **P2 opzionale** mutation fail tema-only (coperto indirettamente da `settings-save-guard`). Report: `Report-settings-theme-15-06-26.md`. Commit incluso in `d8c9dab`.

```text
Profilo: Verifica deep — controverifica settings-theme.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- report dell'esecutore settings-theme

Missione:
verifica che il tema resti solo back-office.

Controlla:
- nessun codice/test fa dipendere Prenota o QR da app_theme;
- preview non equivale a salvataggio;
- annulla e mutation fail sono coperti;
- fallback asset mancante e ID sconosciuto sono safe.

Rilancia test mirato e poi npm run validate se verde.
Output con findings prima.
```

### 4C — Prompt fix (post-4B revisore, opzionale)

Gap P2 revisore: mutation fail + retry con dirty solo-tema in `settingsTheme.settingsM4.adminBlindatura.test.tsx` (pattern `settings-save-guard`). **Non eseguito** — fronte approvabile senza.

---

## 5. settings-form-config + settings-promo — estensione oltre D-M1 ✅ approved (15-06-26)

### 5A — Prompt esecutore ✅ approved

Eseguito 15-06-26 — estensione test form-config/promo oltre D-M1; fix post-5B → **12+8** casi, gate **35/35**, validate **721/721**. Commit `2cdc724`. Report: `Report-settings-form-config-promo-15-06-26.md`.

```text
Profilo: Esecuzione deep — estensione test settings-form-config/settings-promo.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md
- docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md

Missione:
estendi i test gia creati per coprire i buchi rimasti su Personalizza form e promo.

Casi obbligatori:
- zero modalita attive: admin e pubblico non mostrano form inventato;
- testi lunghi su header/modalita/card rispettano cap o comportamento atteso;
- config legacy/null non crasha;
- label dinamiche promo vengono da config, non hardcoded;
- saveSilently promo fallito alza dirty per retry footer;
- toggle/apply/delete promo non usa copy "prossimo salvataggio".

NON rifare:
- D-M1 delete card/carosello gia coperto, salvo regressioni;
- D-M2 sfondi.

Test:
- run mirato dei file form-config/promo;
- run aggregato con gate Batch 1/2;
- npm run validate se verde.

Aggiorna context/test index solo se nuovi casi diventano parte del cancello.
Niente commit/push.
```

### 5B — Prompt revisore controverifica ✅ approved

Controverificato 15-06-26 — gate **31/31**, validate **717/717**; gap P2 cap card, legacy pubblico, fail delete/apply → fix §5C.

```text
Profilo: Verifica deep — controverifica settings-form-config/settings-promo.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- report dell'esecutore form-config/promo

Missione:
cerca buchi tra configurazione admin e effetto pubblico.

Controlla:
- zero modalita attive non mostra fallback demo;
- config legacy/null resta safe;
- promo usa label dinamiche e resta coerente dopo apply/toggle/delete;
- fallimento silent save non perde dati;
- test mirati non vanno in timeout.

Rilancia:
- test mirati form-config/promo;
- aggregato Gate Batch 1/2;
- npm run validate se verde.

Output findings prima.
```

### 5C — Prompt fix (post-5B revisore) ✅ approved

Fix puntuale gap revisore 5B: cap `subTabLabel`/`subTabDescription` su card in editor; `BookingRequestForm` con config legacy `parseFromDb`; fail `saveSilently` su delete e apply promo → dirty footer. Eseguito e controverificato 15-06-26 — **20/20** mirato, gate **35/35**, validate **721/721**. Commit `2cdc724`.

---

## 6. settings-carousel-crud — FU-009 ✅ approved (15-06-26)

### 6A — Prompt esecutore ✅ approved

Eseguito 15-06-26 — **12** test fronte (5 helper + 7 UI), validate **733/733**. Upload reale fuori Vitest (mock). Report: `Report-settings-carousel-crud-15-06-26.md`.

### 6B — Prompt revisore controverifica ✅ approved

Controverificato 15-06-26 — **12/12** mirato, validate **733/733**; FU-009 **quasi chiuso** (residuo upload browser → §7); gap P2 opzionali icona/Sposta su/multi-slide → fix §6C opzionale.

### 6A — Prompt esecutore (testo originale)

```text
Profilo: Esecuzione deep — FU-009 settings-carousel-crud.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md
- docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md
- docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md

Missione:
chiudi o riduci FU-009 con test/QA CRUD slide carosello admin.

Casi obbligatori:
- crea carosello;
- aggiungi foto/slide;
- modifica testi slide;
- sostituisci foto;
- elimina slide con conferma dove prevista;
- riordina slide;
- salva e ricarica;
- verifica effetto su Prenota pubblico;
- dati legacy/null non crashano.

Strategia:
- Vitest per normalizzazione/config/dirty se possibile;
- Playwright o QA manuale documentata per upload/replace/reorder se non automatizzabile in modo stabile.

Output:
- test creati o QA eseguita con viewport;
- stato FU-009: chiuso / parziale / resta aperto con motivo.

Run:
- test mirati;
- npm run validate se verdi.
Niente commit/push.
```

### 6B — Prompt revisore controverifica (testo originale)

```text
Profilo: Verifica deep — controverifica FU-009 settings-carousel-crud.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D
- report dell'esecutore FU-009

Missione:
decidere se FU-009 e davvero chiudibile.

Controlla:
- CRUD slide coperto end-to-end o limiti dichiarati;
- ricarica dopo salvataggio verificata;
- Prenota pubblico mostra il carosello corretto;
- dati legacy/null safe;
- upload/reorder non sono dichiarati testati senza prova browser o test affidabile.

Rilancia test mirati e npm run validate se verdi.
Se FU-009 resta aperto, scrivi motivo e prompt fix successivo.
```

---

## 7. Fase D rompi + QA responsive 375 / 834 / 1280

### 7A — Prompt esecutore

```text
Profilo: Verifica deep — Fase D rompi Admin Impostazioni.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5.D e §3-quater.6
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md
- report dei fronti test gia chiusi in questa sequenza

Missione:
non implementare nuove feature. Prova a rompere Impostazioni locale e Prenota pubblico.

Casi obbligatori:
- doppio click Salva;
- cambio pill Anagrafica/Form durante dirty;
- cambio sezione/logout durante save pending;
- annulla/riapri modali;
- delete card/carosello annulla/conferma;
- promo delete/toggle/apply;
- sfondo striscia/full-page/neutro;
- tema admin-only;
- fasce Classic;
- testi lunghi;
- campi vuoti;
- dati legacy/null;
- viewport 375 / 834 / 1280;
- smoke Prenota pubblico per nome, contatti, orari, sfondo, form, promo/carosello se configurati.

Output:
findings prima, severita, passaggi riproduzione, fix consigliato o "voluto".
Non dichiarare Area 3 blindata se FU-009, validate o QA responsive restano aperti.
Niente commit/push.
```

### 7B — Prompt revisore controverifica

```text
Profilo: Verifica deep — revisione finale Area 3 Impostazioni.
Branch: env/test. DB solo TEST. PROD vietato.

Leggi:
- AGENTS.md
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.6
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md
- docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md
- tutti i report esecutori/revisori di questa sequenza

Missione:
controverifica imparziale di chiusura. Test verdi non bastano se noti difetti logici.

Controlla:
- tutti i fronti del §3-quater.5.D sono chiusi o hanno follow-up motivato;
- `npm run validate` e verde sull'intero working tree;
- QA 375 / 834 / 1280 eseguita e documentata;
- ADMIN_SETTINGS_CONTEXT, ADMIN_TEST_SUITE_INDEX, PRENOTA_FORM_CONFIG_CONTEXT/PRENOTA_LAYOUT_CONTEXT allineati;
- nessun booking_window_days, migrazione o whitelist anon vietata;
- report finale contiene matrice esiti e residui.

Output:
verdetto: blindata / non blindata, con findings ordinati per severita.
Se non blindata, consegna solo i prompt fix necessari, non un nuovo piano generico.
Niente commit/push.
```
