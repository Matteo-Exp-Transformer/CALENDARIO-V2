# D1 — CalendarBackup vecchia: docs

> **Ondata:** D1 · **Data:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (docs/report agente; citazioni utente *riportate* — se H*/D2 smentiscono, vincono quelli)
> **Perimetro:** `docs/Archives/Calendarbackup-oldversion/docs/` — **86 file `.md`**
> **Focus prompt:** stessi bisogni, due tentativi (CB-old vs CB-v2). Estrarre scelte tenute / ribaltate e se c’è traccia del *perché*.
> **Nota attribuzione:** in questo archive «Matteo» compare quasi solo come username GitHub. Le decisioni owner passano da **«User Feedback»**, **«L’utente ha…»**, **«Richiesta utente»**, **«Hai chiesto»**. Dove c’è citazione verbatim di feedback prodotto → `Chi = MATTEO`. Dove c’è solo «come richiesto» / «Approved» senza nome → `INCERTO`.
> **Date:** usate come scritte nei file (`gg-mm-aa`). Coesistono «27 Gennaio 2025» (PROJECT_STATUS / theme) e nov–dic 2025 (caraffe, padding, Scamorzine): possibile refuso di anno — non riconciliato qui; handoff a D2/H4/J1.

---

## Sezione 1 — Decisioni

### Blocco A — Isolamento tema Admin vs Prenota (segnale più forte del perimetro)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| D1-D01 | 27-01-25? | UI-UX | /prenota non deve cambiare con i temi | MATTEO | CORRETTIVA | `handoff/THEME_PHASE1_COMPLETED.md` L150 | «la pagina /prenota non doveva cambiare!! rimettila come era!» | theme-scope-isolation |
| D1-D02 | 27-01-25? | UI-UX | Temi solo su /admin | MATTEO | SCELTA | stesso L150; L421 | «dobbiamo modificare solo pagina /admin!» | theme-scope-isolation |
| D1-D03 | 27-01-25? | UI-UX | Tema Balanced: fasce orarie più distinte | MATTEO | CORRETTIVA | stesso L215 | «colori tema balanced non è ben distinto, crea confusione» | admin-visual-hierarchy |
| D1-D04 | 27-01-25? | UI-UX | Bordi card count prenotazioni più grossi | MATTEO | CORRETTIVA | stesso L248 | «va ingrandito il bordo» | admin-visual-hierarchy |
| D1-D05 | 27-01-25? | UI-UX | Badge nav con sfondo anche non selezionati | MATTEO | CORRETTIVA | stesso L271 | «non hanno colore di sfondo, solo quando vengono selezionati» | admin-visual-hierarchy |
| D1-D06 | 27-01-25? | UI-UX | Card «inserisci nuova prenotazione» allineata | MATTEO | CORRETTIVA | stesso L303 | «deve avere sfondo con colore allineato» | admin-visual-hierarchy |
| D1-D07 | 27-01-25? | UI-UX | Chiudere gap bianco calendario/disponibilità | MATTEO | CORRETTIVA | stesso L328 | «rimasta piccola sezione bianca tra disponibilità e calendario» | admin-visual-hierarchy |
| D1-D08 | 27-01-25? | PROCESSO | Test utente prima di add/commit | MATTEO | ORIGINATA | stesso L420 | «quando hai finito lascia testare anche me prima di fare add o commit» | human-gate-before-commit |

> **Keep candidate (CB-v2, verificato in skill attuali):** `app_theme` resta **solo admin**, non cambia Prenota/QR (`ADMIN` PLAN_BLINDATURA / settings-theme). D1-D01/D02 sono l’antenato scritto di quella regola — ribaltamento **non** trovato; evoluzione = stessa regola, codificata.

### Blocco B — Form Prenota: ospiti, menu, card

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| D1-D09 | ? | UI-UX | Campo ospiti deve poter restare vuoto | MATTEO | ORIGINATA | `handoff/NUM_GUESTS_INPUT_EMPTY_VALUE_ISSUE.md` L5 | «non è possibile cancellarlo completamente per inserire un nuovo numero» | form-empty-defaults |
| D1-D10 | ? | UI-UX | Requisito: ospiti vuoto all’apertura | MATTEO | SCELTA | stesso L16 | «deve risultare vuoto senza numeri inseriti» | form-empty-defaults |
| D1-D11 | 01-12-25 | UI-UX | Fix autocomplete browser su campo ospiti | MATTEO | ORIGINATA | `handoff/NUM_GUESTS_AUTOCOMPLETE_FIX_REPORT.md` L11 | «mostrava sempre "1" e non era possibile cancellarlo completamente» | form-empty-defaults |
| D1-D12 | 02-11-25 | PRODOTTO | Caraffe: mutual exclusion come i primi | MATTEO | ORIGINATA | `reports/VERIFICATION_CARAFFE_MUTUAL_EXCLUSION_FIX.md` L11-12 | «O caraffe drink o caraffe drink premium… come la selezione dei primi piatti» | menu-mutual-exclusion |
| D1-D13 | 02-11-25 | UI-UX | Padding card ingredienti rinfresco laurea | MATTEO | ORIGINATA | `reports/VERIFICATION_MENU_CARD_PADDING.md` L10 | «non vedo padding adeguato» | prenota-card-spacing |
| D1-D14 | 30-11-25 | UI-UX | Conferma test visivo padding Riepilogo | MATTEO | APPROVATA | `handoff/RIEPILOGO_SCELTE_PADDING_ISSUE.md` L33 | «SI VEDO sfondo rosso sotto alle schedine» | visual-debug-with-owner |
| D1-D15 | 30-11-25 | UI-UX | Padding Riepilogo: inline styles vs Tailwind | AGENTE | SCELTA | `handoff/RIEPILOGO_PADDING_SOLUTION.md` L59 | «Convertire Tailwind classes in inline styles» | css-workaround |
| D1-D16 | 02-11-25 | UI-UX | Card unificata intolleranze | CONGIUNTA | SCELTA | `archive/2025-11-early/SESSIONE_CARD_OPACHE_INTOLLERANZE_REPORT.md` L55 | «Design concordato: Card unica che include tutto» | prenota-card-unify |
| D1-D17 | 02-11-25 | UI-UX | Schede opache su tutta /prenota | INCERTO | SCELTA | stesso L9-11 | «Applicare stesso stile a tutte le sezioni della pagina /prenota» | prenota-card-style |
| D1-D18 | 05-12-25 | PRODOTTO | Aggiungere Scamorzine €2 in Fritti | MATTEO | ORIGINATA | `handoff/SCAMORZINE_INGREDIENT_HANDOFF.md` L11-16 | «Aggiungere 1 ingrediente… Scamorzine… 2 €… categoria Fritti» | menu-content-ops |

### Blocco C — Scope Admin vs pubblico; layout mobile

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| D1-D19 | ? | FLUSSO | Placement solo in Admin, non /prenota | INCERTO | SCELTA | `HANDOFF_PLACEMENT_FIELD.md` L21-23 | «Placement SOLO per Admin… NON nella pagina pubblica /prenota» | admin-only-fields |
| D1-D20 | ? | UI-UX | Eseguire piano fix mobile card &lt;510px | MATTEO | ORIGINATA | `archive/old-agent-reports/mobile-responsive-fix/README_MOBILE_FIX.md` L5 | «Hai chiesto di eseguire il fix-mobile-car.plan.md con debug console» | mobile-first-fix |
| D1-D21 | 04-01-25? | UI-UX | Desktop menu cards invariato | INCERTO | SCELTA | `tasks/UI_MODERNIZER_MENU_CARDS_MOBILE.md` L15 | «Desktop layout DEVE rimanere invariato (app quasi ultimata)» | desktop-lock-mobile-fix |
| D1-D22 | ? | UI-UX | Mobile menu: stack verticale Opzione B | INCERTO | SCELTA | stesso L55 ca. (Soluzione Scelta) | «Soluzione Scelta: Opzione B (Stack Vertical Mobile)» | desktop-lock-mobile-fix |
| D1-D23 | ? | UI-UX | Edge-to-edge ingredienti mobile | INCERTO | SCELTA | `archive/.../CARD_INGREDIENTS_EDGE_TO_EDGE_PLAN.md` (Opzione A scelta) | «Opzione A: Edge-to-Edge (scelta)» | mobile-card-layout |

### Blocco D — Piani / PRD / testing (owner spesso non firmato)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| D1-D24 | 26-01-25? | FLUSSO | Prenotazione visibile solo fascia di inizio | INCERTO | SCELTA | `plans/2025-01-26-fix-time-slot-display.md` L5 | «prenotazioni devono apparire solo nella card della fascia oraria di INIZIO» | calendar-slot-display |
| D1-D25 | 27-01-25? | UI-UX | Modal dettagli: un solo pulsante Modifica | INCERTO | SCELTA | `plans/2025-01-27-booking-details-modal-complete-redesign.md` L50 | «consistent with user request» | admin-modal-ux |
| D1-D26 | 27-01-25? | PRODOTTO | Redesign modal dettagli prenotazione | INCERTO | APPROVATA | stesso L709 ca. | «Design approved: 2025-01-27» | admin-modal-ux |
| D1-D27 | 20-11-25 | UI-UX | Fix modal che chiude su text select | INCERTO | APPROVATA | `plans/2025-11-20-booking-details-modal-bugs-fix-design.md` L4 | «Approved for Implementation» | admin-modal-ux |
| D1-D28 | 27-01-25? | FLUSSO | No controllo capienza sul form pubblico | INCERTO | SCELTA | `reports/CAPACITY_WARNING_MODAL_ISSUE_REPORT.md` L321 | «NO controllo capienza - come richiesto» | capacity-public-policy |
| D1-D29 | ? | VENDITA | Integrazione Wix via iframe/link | INCERTO | SCELTA | `agent-knowledge/PRD.md` L1018 ca. | «Opzione Scelta: Iframe/Link» | go-to-market-embed |
| D1-D30 | ? | SICUREZZA | Rate limit 3 richieste/ora per IP | INCERTO | SCELTA | `agent-knowledge/PRD.md` L881 ca. | «Form Pubblico: Max 3 richieste/ora per IP» | public-rate-limit |
| D1-D31 | ? | TESTING | No navigazione esplicita invasiva nei test | INCERTO | DELEGATA | `archive/2025-11-early/TEST_IMPROVEMENTS_APPLIED.md` L258 | «Come richiesto, la navigazione esplicita… NON è stata applicata in modo invasivo» | test-non-invasiveness |
| D1-D32 | ? | TESTING | Flusso ACCETTA booking «fixato dall’utente» | MATTEO | CORRETTIVA | `agent-knowledge/TESTING_REPORT.md` L65 | «Fixato dall'utente» | owner-fixes-in-prod |

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| D1-A01 | M→A | DIRETTA | 6 correzioni tema post Phase1 (scope + colori + UI) | accettata | `handoff/THEME_PHASE1_COMPLETED.md` L144-328 |
| D1-A02 | M→A | DIRETTA | Gate: test umano prima di commit | accettata | stesso L420 |
| D1-A03 | A→M | DEDOTTA | Tema leak su /prenota via Select/Modal/Input shared | ignota | stesso L152-154 (agente spiega il bug; resa di Matteo = D01) |
| D1-A04 | A→M | DIRETTA | Agente precedente aveva messo placement su form pubblico | accettata | `HANDOFF_PLACEMENT_FIELD.md` L39 «erroneamente aggiunto» |
| D1-A05 | M→A | DIRETTA | Logica caraffe mutual exclusion | accettata | `reports/VERIFICATION_CARAFFE_MUTUAL_EXCLUSION_FIX.md` L11-12 |
| D1-A06 | M→A | DIRETTA | Bug num_guests non cancellabile (ciclo multi-fix) | accettata | `handoff/NUM_GUESTS_INPUT_EMPTY_VALUE_ISSUE.md` L5; autocomplete report |
| D1-A07 | M→A | DIRETTA | Padding card menu insufficiente | accettata | `reports/VERIFICATION_MENU_CARD_PADDING.md` L10 |
| D1-A08 | M→A | DIRETTA | Conferma debug rosso su Riepilogo Scelte | accettata | `handoff/RIEPILOGO_SCELTE_PADDING_ISSUE.md` L33 |
| D1-A09 | M↔M | DEDOTTA | Pivot tecnico Tailwind→inline dopo 4 fallimenti | parziale | `RIEPILOGO_PADDING_SOLUTION.md` L59 (decisione agente; Matteo conferma solo visibilità) |
| D1-A10 | M→A | DIRETTA | Ordina esecuzione piano mobile responsive | accettata | `README_MOBILE_FIX.md` L5 |

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in D1 | Nota |
|-------|---------------------|-------------|------|
| `theme-scope-isolation` | **L3** (provvisorio) | D1-D01/D02 CORRETTIVA + D1-A01 | Ha visto leak che l’agente aveva introdotto. Contro-evidenza cercata: §4.1 |
| `human-gate-before-commit` | **L2** | D1-D08 ORIGINATA | Regola di processo esplicita; antenato di gate «lavoro ok» / no auto-commit |
| `form-empty-defaults` | **L2** | D1-D09–D11 | Stesso tratto già visto in C2 (form create vuoti) |
| `menu-mutual-exclusion` | **L2** | D1-D12 ORIGINATA | Regola prodotto con analogia «come i primi» |
| `admin-only-fields` | **L1–L2** | D1-D19 + D1-A04 | Regola chiara; firma «Matteo» assente → L2 se D2 conferma |
| `visual-debug-with-owner` | **L2** | D1-D14 | Partecipa al debug (conferma rosso), non solo «procedi» |
| `desktop-lock-mobile-fix` | **L1** | D1-D21–D22 | Vincolo documentato; chi l’ha fissato = INCERTO |
| `menu-content-ops` | **L2** | D1-D18 | Operatività menu tenant (dato, non architettura) |
| `css-workaround` | L1 (agente) | D1-D15 | Scelta tecnica agente dopo fallimenti Tailwind |
| `go-to-market-embed` | L0–L1 | D1-D29 | PRD single-tenant Wix — flip atteso in CB-v2 SaaS |
| `public-rate-limit` | L0–L1 | D1-D30 | Solo PRD; ratifica Matteo non citata |
| `owner-fixes-in-prod` | **L2** | D1-D32 | «Fixato dall’utente» su flusso ACCETTA |

---

## Sezione 4 — Contro-evidenze

1. **Leak tema su /prenota (fallimento agent, catch di Matteo):** Phase1 temi ha toccato componenti shared; Matteo ribalta con D01. Contro-evidenza per l’*agente*, prova L3 per Matteo su `theme-scope-isolation`. Fonte: `THEME_PHASE1_COMPLETED.md` L150-154.
2. **Placement messo sul form pubblico da un agente, poi rimosso:** handoff ammette errore di un agente precedente. Contro-evidenza di disciplina scope Admin/Pubblico *prima* della correzione. Fonte: `HANDOFF_PLACEMENT_FIELD.md` L39.
3. **Ciclo lungo su num_guests:** più handoff (empty value → autocomplete); root cause finale = autocomplete browser, non solo `min="1"`. Contro-evidenza di root-cause incompleto al primo giro (lato agente). Fonte: `NUM_GUESTS_*`.
4. **Padding Riepilogo: 4 tentativi Tailwind falliti** prima del pivot inline — processo di debug lento; Matteo partecipa al test rosso ma la decisione tecnica è agente. Fonte: `RIEPILOGO_*`.
5. **Approvazioni «Approved» / «APPROVATO PER PRODUZIONE» senza firma Matteo** nei plans e nei report mobile → rischio di gonfiare autonomia owner. Contro-evidenza metodologica per chi legge questi file come prove L2+.
6. **Bug production orario +1h e doppie pending** (`Fix-2Bug-production.md`): decisioni di fix non attribuite a Matteo in questo perimetro; segnalano debito server-side scoperto tardi.
7. **Cercata agency A→M DIRETTA «Matteo era fuori strada sul prodotto»:** **non trovata** in questo perimetro (solo correzioni sue agli agenti + leak/placement come errori agenti). Se esiste, è in D2 (sessioni) o H4 (transcript CB-old).

### Keep / Flip vs CB-v2 (ipotesi per S3 — non fatti J1)

| # | Scelta CB-old | Ipotesi | Nota |
|---|---------------|---------|------|
| K1 | Temi solo admin, Prenota isolata (D01/D02) | **KEEP** (verificato in skill Admin: `app_theme` solo back-office) | Continuazione, non ribaltamento |
| K2 | Placement solo admin (D19) | **KEEP candidate** | Placement ancora in admin CB-v2 |
| K3 | Caraffe mutual exclusion (D12) | **VERIFY** | Regola business; confrontare MenuSelection v2 |
| K4 | Form ospiti vuoto / cancellabile (D09–D11) | **VERIFY / partial keep** | CB-v2 ha ancora cap 1–110; comportamento empty da verificare in A*/codice |
| K5 | Wix iframe/link (D29) | **FLIP candidate** | CB-v2 = SaaS multi-tenant standalone |
| K6 | Single-tenant Al Ritrovo (PRD intero) | **FLIP** | Stesso dominio prodotto, modello di vendita diverso |
| K7 | Inline styles per battere Tailwind JIT (D15) | **REVERSE candidate** | Workaround; CB-v2 su Tailwind v4 può non ripeterlo |
| K8 | max-w 55vw form Prenota | **VERIFY** | Citato in report width; origine INCERTA |
| K9 | Rate limit 3/ora (D30) | **VERIFY** | Policy attuale può differire |
| K10 | No capacity check form pubblico (D28) | **VERIFY** | «come richiesto» ma Chi=INCERTO |

Traccia del *perché* dei ribaltamenti: **quasi assente** in `docs/`. I keep hanno citazioni (soprattutto temi). I flip strutturali (single-tenant→SaaS) **non** sono argomentati in questo perimetro — handoff a D2 / H4 / J1 / S3.

---

## Sezione 5 — Copertura dichiarata

| Voce | N | Note |
|------|---|------|
| File nel perimetro (P0 / piano) | **86** | solo `.md` sotto `…/Calendarbackup-oldversion/docs/` |
| File aperti | **86 (100%)** | ogni md aperto (titolo + body; estrazione rastrello) |
| File vuoti / quasi vuoti | **2** | `archive/2025-11-early/BOOKING_LAYOUT_SPECS.md` (0 byte); `reports/BUG_CANCEL_CONFIRMATION_MODAL_NOT_VISIBLE.md` (2 byte, contenuto `""`) — aperti, niente da estrarre |
| File illeggibili | **0** | — |

**Ripartizione:**

| Sotto-area | N | Densità segnale |
|------------|---|-----------------|
| `handoff/` | 12 | **ALTA** — feedback verbatim (tema, ospiti, padding, Scamorzine) |
| `reports/` | 17 | **MEDIA-ALTA** — caraffe, padding, capacity; cleanup = rumore |
| `archive/` | 29 | **MEDIA** — card opache, mobile, bug production |
| `agent-knowledge/` | 12 | **BASSA-MEDIA** — PRD/status; setup RLS/test = rumore |
| `plans/` | 4 | **MEDIA** — slot display, modal redesign (approver non firmato) |
| `development/` | 6 | **BASSA** — worktree / Vercel keep-alive |
| `tasks/` | 1 | **MEDIA** — vincoli desktop lock |
| root | 5 | **BASSA** — indici / summary |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Quasi mai il nome «Matteo» come decisore; solo «User Feedback» | D2 (Lavoro+Sessioni) + H4 (transcript CB-old) per conferma M-VOCE |
| Perché del passaggio CB-old → CB-v2 (SaaS, multi-tenant) **non** scritto qui | D2, A1 inizio, J1 (git), S3 timeline |
| Keep/flip K3–K10 non verificati sul codice/skill CB-v2 in questa ondata | S3 + spot-check Prenota/Admin (fuori perimetro D1) |
| Date 2025-01 vs 2025-11 incoerenti | J1 / H4 |
| Agency A→M «Matteo fuori strada» assente in docs | D2, H4 |
| Superpowers Skills (`agent-knowledge/SKILLS.md`) = libreria esterna, non skill Matteo | M1 confronto antenati; non contare come L4 sue |

---

## Sezione 7 — Chiusura verso Matteo

Nella versione vecchia dell’app di prenotazioni, il segnale più chiaro su di te è quando l’agente ha cambiato anche la pagina pubblica dei clienti mentre lavorava sui colori dell’area admin: tu hai imposto subito di rimettere com’era la pagina clienti e di toccare solo il pannello interno — e di farti testare prima di salvare.

Sullo stesso prodotto hai guidato regole concrete del form (ospiti cancellabili, caraffe che si escludono a vicenda come i primi, padding delle card del menu) e hai partecipato ai test a schermo (il «vedo lo sfondo rosso»).

In questi documenti manca quasi del tutto *perché* poi avete ribaltato il modello single-ristorante/Wix verso l’app multi-cliente attuale: quella storia va cercata nelle sessioni e nei transcript, non nelle specifiche tecniche archiviate qui.
