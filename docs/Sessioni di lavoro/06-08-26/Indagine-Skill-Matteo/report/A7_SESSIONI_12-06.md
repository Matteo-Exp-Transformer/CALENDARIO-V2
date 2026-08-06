# A7 — Sessioni 12-06 (giornata più densa)

> Ondata mining · Profilo Verifica/Meta · Regime **scavo** · Peso fonti: 3 (report agenti)  
> Perimetro: `docs/Sessioni di lavoro/12-06-26/` — **63 file** (13 in `AL-D/` + 50 root)  
> Data report: 06-08-26

**Vertice del giorno:** nasce e si esegue il **masterplan allineamento** (AL-A…F): analisi Fable (solidità / skill / legale) → intervista owner su **prezzi + legale + design Meta (AL-E)** → ondate parallele di WP (A/C esecuzione; B sicurezza PROD; D bozze in attesa; E design; F listino/stato legale) → **M6 prod-ready** + batch FU + merge PrenotaZen. Distinguere **regia Matteo** (interviste letterate, gate PROD, «procedi», smoke) dal **lavoro degli agenti** (WP A1–A6, C1–C3 = pipeline senza nuova volontà).

**Ordine di lettura dichiarato (prima di aprire):**  
1. Masterplan / ciclo intervista / chiusura Fable / analisi triade  
2. WP-F1/F2 + WP-E1–E3 (+ Design = stessa decisione)  
3. WP-B sicurezza + diagnosi CLI  
4. M6 / FU / merge production / digest / guard fantasma  
5. WP-A/C (esecuzione) + AL-D bozze (attesa ok)

**Deduplica:** scelte AL-E/F contate **una sola volta** (fonte primaria = report ciclo / WP-F / WP-E). Design-* e bozze AL-D aperti ma senza nuove decisioni owner oltre quelle già tabellate. Limiti Magazzino in bozza §9 = **11-06** → lacuna **A6**, non A7-Dxx.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| A7-D01 | 12-06-26 | AI-METODO | Solo masterplan; nessun WP eseguito | MATTEO | ORIGINATA | `Report-creazione-masterplan-allineamento-12-06-26.md` Q1 | «Questa sessione NON esegue alcun WP… solo il file masterplan» | masterplan-scoping |
| A7-D02 | 12-06-26 | PROCESSO | AL-D/F/E restano approvazioni sue | CONGIUNTA | APPROVATA | stesso §6 | «Da lasciare manuale: approvazioni Matteo su fusioni AL-D… AL-F» | owner-gates |
| A7-D03 | 12-06-26 | PROCESSO | Sub-agent per task semplici; senior per complicate | MATTEO | ORIGINATA | `Report-prepara-prompt-ciclo-masterplan-semplici-12-06-26.md` §6 | «sub agent per micro task semplici; complicate le fa senior» | multi-agent-orchestration |
| A7-D04 | 12-06-26 | PROCESSO | Escludere AL-B/D/F/E dal ciclo semplici | CONGIUNTA | APPROVATA | stesso (WP esclusi) | «B1–B5 … senior + Matteo» / «F1–F2 … decisioni Matteo» | work-package-triage |
| A7-D05 | 12-06-26 | VENDITA | Contesto: no P.IVA; solo Italia; vendita mista | MATTEO | ORIGINATA | `Report-analisi-legale-vendita-12-06-26.md` Q1 | «nessuna attività aperta · solo Italia per ora · vendita mista» | go-to-market |
| A7-D06 | 12-06-26 | VENDITA | Classic 29; QR +16; Pro 79; Ent 129 | MATTEO | SCELTA | `Report-ciclo-masterplan-al-f-al-e-intervista-12-06-26.md` WP-F1 | «menu QR = 16 € ; pro a 79 ; entrerprise 129€» | pricing-edition |
| A7-D07 | 12-06-26 | VENDITA | Enterprise in listino, solo preventivo | MATTEO | SCELTA | stesso / `Report-wp-f1-prezzi-edition-12-06-26.md` | «E1» | pricing-edition |
| A7-D08 | 12-06-26 | VENDITA | Annuale = 2 mesi gratis | MATTEO | APPROVATA | stesso | «ok confermo tutti e due» | pricing-edition |
| A7-D09 | 12-06-26 | VENDITA | Fondatori −50% solo primi 3 mesi | MATTEO | ORIGINATA | stesso (custom vs L1a) | «−50% primi 3 mesi» | pricing-founders |
| A7-D10 | 12-06-26 | VENDITA | Trial 30 gg senza carta | MATTEO | SCELTA | stesso | «L2a» | pricing-trial |
| A7-D11 | 12-06-26 | VENDITA | Setup gratis fondatori; poi 100€ | MATTEO | SCELTA | stesso | «Incluso solo fondatori; poi 100€» | pricing-setup |
| A7-D12 | 12-06-26 | VENDITA | Pacchetto fotografo 200€ / 25 foto | MATTEO | ORIGINATA | stesso | «200€ fino 25 foto» | pricing-addon |
| A7-D13 | 12-06-26 | VENDITA | Referral: 1 mese gratis | MATTEO | SCELTA | stesso | «L4a» | pricing-referral |
| A7-D14 | 12-06-26 | VENDITA | Zero commissioni a coperto, mai | MATTEO | SCELTA | stesso | «Zero commissioni a coperto, mai» | pricing-positioning |
| A7-D15 | 12-06-26 | LEGALE | Ipotesi forfettario; sentire commercialista | MATTEO | SCELTA | stesso WP-F2 / `Report-wp-f2-stato-legale-produzione-12-06-26.md` | «P1a» + «sentire commercialista» | legal-entity |
| A7-D16 | 12-06-26 | LEGALE | Contratto B2B: bozza repo → avvocato | MATTEO | SCELTA | stesso | «C2b» | legal-b2b |
| A7-D17 | 12-06-26 | LEGALE | Recesso mensile; annuale 30 gg | MATTEO | SCELTA | stesso | «C2-R1» | legal-b2b |
| A7-D18 | 12-06-26 | LEGALE | Fattura elettronica via ADE gratis | MATTEO | SCELTA | stesso | «F3b» | legal-invoicing |
| A7-D19 | 12-06-26 | COMPLIANCE | Registro art.30 bloccante (senior→comm.) | MATTEO | SCELTA | stesso | «G2b» | gdpr-ops |
| A7-D20 | 12-06-26 | COMPLIANCE | Runbook breach bloccante come G2 | MATTEO | SCELTA | stesso | «B2b» | gdpr-breach |
| A7-D21 | 12-06-26 | COMPLIANCE | Sub-processor pubblico bloccante | MATTEO | SCELTA | stesso | «S2b» («2 come G2») | gdpr-subprocessors |
| A7-D22 | 12-06-26 | COMPLIANCE | Email privacy temp Gmail sua | MATTEO | ORIGINATA | stesso | «matteo.sistemigestionali@gmail.com» | privacy-contact |
| A7-D23 | 12-06-26 | SICUREZZA | Region Supabase PROD = West EU Ireland | MATTEO | SCELTA | stesso | «West EU (Ireland)» | data-residency |
| A7-D24 | 12-06-26 | LEGALE | Marchio PrenotaZen + logo; UIBM prima | MATTEO | SCELTA | stesso | «PrenotaZen + logo GPT» | brand-legal |
| A7-D25 | 12-06-26 | LEGALE | RC cyber prima di scalare | MATTEO | SCELTA | stesso | «I2a» | insurance |
| A7-D26 | 12-06-26 | COMPLIANCE | EAA come argomento vendita | MATTEO | SCELTA | stesso | «A2a» | accessibility-sales |
| A7-D27 | 12-06-26 | VENDITA | Budget legale anno 1 ≈ 1.500–2.500€ | MATTEO | SCELTA | stesso | «€2a» | legal-budget |
| A7-D28 | 12-06-26 | LEGALE | Disclaimer: non sostituisce avvocato | MATTEO | SCELTA | stesso | «D2a» | legal-disclaimer |
| A7-D29 | 12-06-26 | AI-METODO | Mini-pack ibrido docs + Cursor puntatore | MATTEO | SCELTA | stesso WP-E1 / `Report-wp-e1-mini-pack-area-12-06-26.md` | «L1c» | skill-mini-pack |
| A7-D30 | 12-06-26 | AI-METODO | Mini-pack 5 sezioni ≤80 righe | MATTEO | SCELTA | stesso | «F1a» | skill-mini-pack |
| A7-D31 | 12-06-26 | AI-METODO | Rollout mini: Prenota+QR → A3 → A4–A7 | MATTEO | ORIGINATA | stesso | «P1 → A3 → A4–A7» | skill-rollout |
| A7-D32 | 12-06-26 | AI-METODO | Mini-pack per area (non per profilo) | MATTEO | SCELTA | stesso | «R1a» | skill-mini-pack |
| A7-D33 | 12-06-26 | AI-METODO | Indice mini in APP_CONTEXT §0.0b | MATTEO | SCELTA | stesso | «H2b» | skill-index |
| A7-D34 | 12-06-26 | AI-METODO | Nome file `*_MINI.md`; un solo ADMIN_MINI | MATTEO | SCELTA | stesso | «N2a» / «A3a» | skill-mini-pack |
| A7-D35 | 12-06-26 | AI-METODO | Doc-path: docs/ escl. Sessioni/_lavoro/Archivio | MATTEO | SCELTA | stesso WP-E2 / `Report-wp-e2-doc-path-check-12-06-26.md` | «P1b» | docs-path-check |
| A7-D36 | 12-06-26 | AI-METODO | Doc-path in validate+CI; hard fail; no pre-commit | MATTEO | SCELTA | stesso | «R2d» / «E3a» | docs-path-check |
| A7-D37 | 12-06-26 | AI-METODO | Anti-storia: report=storia; skill=stato+guardrail | MATTEO | SCELTA | stesso WP-E3 / `Report-wp-e3-anti-storia-protocollo-7-12-06-26.md` | «S1b» | anti-storia |
| A7-D38 | 12-06-26 | AI-METODO | Potatura Menu QR attiva; resto on-touch | MATTEO | APPROVATA | stesso | «seguo tuo consiglio» (S2) | anti-storia |
| A7-D39 | 12-06-26 | AI-METODO | §7 spezzato; regola S1b in §8; grilletti invariati | MATTEO | SCELTA | stesso | «H7b» / «R3a» / «Z2a» | anti-storia |
| A7-D40 | 12-06-26 | PROCESSO | AL-E design ok senza senior codice | MATTEO | SCELTA | ciclo Q1 | «se possiamo farli noi si se richiede agente senior dimmelo» | design-vs-imp |
| A7-D41 | 12-06-26 | VENDITA | Post-senior: Pro 69€; fondatori 6 mesi | MATTEO | CORRETTIVA | `Report-chiusura-ciclo-fable-allineamento-sicurezza-12-06-26.md` §3 | «Pro 69 euro, fondatori 6 mesi» | pricing-edition |
| A7-D42 | 12-06-26 | COMPLIANCE | GDPR operativo entro 1° mese, non blocco 1° incasso | CONGIUNTA | CORRETTIVA | stesso §2 | «non sono più descritti come blocco prima del primo incasso» | go-to-market |
| A7-D43 | 12-06-26 | PROCESSO | No commit/push finché «fai report finale» | MATTEO | ORIGINATA | stesso Q1 | «Non fare commit/push finché Matteo non conferma… fai report finale» | closure-gate |
| A7-D44 | 12-06-26 | SICUREZZA | Fix CLI → allinea/verifica DB TEST | MATTEO | ORIGINATA | stesso §7 | «ho fixato cli. ora punta DB test. allinea anche lui» | env-channels |
| A7-D45 | 12-06-26 | PROCESSO | Prompt batch FU-046 / Servizio / edge + report finale | MATTEO | ORIGINATA | `Report-chiusura-m6-docs-prompts-prossimi-12-06-26.md` Q1 | «dammi prompt per: 1. Admin Area 2 residui… fai report finale» | multi-agent-orchestration |
| A7-D46 | 12-06-26 | AI-METODO | Ok AL-D senza senior; poi commit | MATTEO | DELEGATA | `Report-wp-al-d-fusioni-docs-12-06-26.md` Q1 | «completa lavoro… senza senior. hai mio ok.» | wp-delegate |
| A7-D47 | 12-06-26 | SICUREZZA | Apply policy 046 su TEST e PROD | MATTEO | APPROVATA | `Report-wp-b1-migrazioni-db-12-06-26.md` Q1 | «allineiamo i DB sia test che prod. procedi.» | env-safety-prod |
| A7-D48 | 12-06-26 | SICUREZZA | Fix RLS completo + rilascio PROD ora | MATTEO | SCELTA | `Report-wp-b2-restaurant-settings-cross-tenant-12-06-26.md` Q1 | «Fix completo ora» / «Rilascio completo ora» | security-scope |
| A7-D49 | 12-06-26 | TESTING | Smoke TEST OK prima di PROD (B2) | MATTEO | APPROVATA | stesso Q1 | «smoke test ok. tutto funziona correttamente su DB test.» | smoke-gate |
| A7-D50 | 12-06-26 | PROCESSO | Commit/push B3 + allinea PrenotaZen | MATTEO | ORIGINATA | `Report-wp-b3-guard-tenant-pubblico-admin-12-06-26.md` Q1 | «allinea prenotaZen a tutto il lavoro…» | public-repo-sync |
| A7-D51 | 12-06-26 | PRODOTTO | No deploy check-slot su PROD | MATTEO | APPROVATA | `Report-wp-b5-slot-availability-cleanup-rate-limits-12-06-26.md` §1 | «non deployare check-slot-availability su PROD» | slot-authority |
| A7-D52 | 12-06-26 | SICUREZZA | Conferma apply DB 048 + commit/main/PZ | MATTEO | APPROVATA | stesso Q1 | «confermo anche per database… allinea anche main e prenotazen» | env-safety-prod |
| A7-D53 | 12-06-26 | PROCESSO | Branch corretto: siamo su env/test | MATTEO | CORRETTIVA | `Report-diagnosi-wp-b5-test-apply-12-06-26.md` Q1 | «siamo su env/test. procedi» | branch-gate |
| A7-D54 | 12-06-26 | AI-METODO | CLI=TEST / MCP=PROD solo in AGENTS Codex | MATTEO | CORRETTIVA | `Report-completamento-wp-b5-test-apply-12-06-26.md` Q1 | «cli per DB test e mcp per prod… rimuovi da documentazione in generale» | agent-env-channels |
| A7-D55 | 12-06-26 | SICUREZZA | Connettore GPT = solo PROD (fatto) | MATTEO | ORIGINATA | stesso Q1 | «connettore supabase configurato per prod…» | mcp-prod-limit |
| A7-D56 | 12-06-26 | UI-UX | Digest calendario: lista verticale per fasce | MATTEO | SCELTA | `Report-fix-digest-calendario-fasce-verticali-12-06-26.md` | «scelgo A… fasce colazione-pranzo-aperitivo-cena-notturna» | calendar-digest |
| A7-D57 | 12-06-26 | PROCESSO | Merge digest + PrenotaZen; smoke OK → report finale | MATTEO | APPROVATA | stesso | «smoke test su prenotzen fatto. tutto ok. fai report finale» | release-gate |
| A7-D58 | 12-06-26 | PROCESSO | Merge production guard fantasma | MATTEO | ORIGINATA | `Report-merge-production-guard-fantasma-12-06-26.md` | «facciamo merge anche con prod…» | release-gate |
| A7-D59 | 12-06-26 | SICUREZZA | M3 Menu: procedi merge + migrazione PROD | MATTEO | APPROVATA | `Report-merge-production-m3-menu-12-06-26.md` | «procedi» | env-safety-prod |
| A7-D60 | 12-06-26 | PRODOTTO | Fallback orari/sfondo/form/strip (registro M6) | MATTEO | APPROVATA | `Report-m6-fu-all-fallback-*-12-06-26.md` §2b | «Orari default ✅… EmptyState… Strip… ok prod» | prenota-fallback |
| A7-D61 | 12-06-26 | IMPOSTAZIONI | Placement areas: lista vuota, no demo | MATTEO | DELEGATA | `Report-m6-prod-ready-fallback-guards-prenotazen-12-06-26.md` | (prompt M6: niente demo hardcoded) | settings-empty-state |
| A7-D62 | 12-06-26 | FLUSSO | U3 blocca tab in mutation; U9 banner errore | MATTEO | APPROVATA | `Report-fu046-residui-u3-u9-12-06-26.md` Q1 | «U3… U9… priorità U3→U9» | admin-prenotazioni-ux |
| A7-D63 | 12-06-26 | AI-METODO | FU-TYPES: prima plan/ragioniamo, poi implement | MATTEO | ORIGINATA | `Report-fu-types-1-hook-perimetro-t1-t5-12-06-26.md` Q1 | «Plan / ragioniamo — NO implementazione…» | plan-then-code |
| A7-D64 | 12-06-26 | PROCESSO | Controverifica commissionata (M6/FU-LOG/FU-TYPES) | MATTEO | DELEGATA | report `Report-controverifica-*-12-06-26.md` Q1 | «controverifica imparziale… NON committare» | controverifica |
| A7-D65 | 12-06-26 | PROCESSO | FU-LOG scripts: no commit qui → senior merge | MATTEO | ORIGINATA | `Report-fu-log-1-chiusura-scripts-12-06-26.md` Q1 | «Niente commit (Matteo → agente senior merge)» | merge-hygiene |
| A7-D66 | 12-06-26 | PROCESSO | Ok spostamento storici Menu QR (D5) | MATTEO | APPROVATA | `AL-D/WP-D5-preparazione-menu-qr-storici.md` | «ok già dato da Matteo per lo spostamento» | docs-archive |

**Nota densità:** A7-D60 agglomera i quattro verdetti fallback M6 (orari/sfondo/form/strip) già nel registro owner. A7-D34 e A7-D36 agglomerano coppie di lettere della stessa intervista. Design-wp-e1/e2/e3 e 7/8 bozze AL-D: **aperti, zero decisioni owner aggiuntive** (Magazzino §9 → A6).

**File esecuzione senza decisione owner nuova** (lancio WP già nel masterplan): WP-A1…A6, verifica-B3, WP-C1…C3, WP-D1…D4 (bozze in attesa), fu-log-1-edge (solo esecuzione), analisi-skill-system / analisi-solidità (proposte AGENTE in attesa, non ratificate come scelte prodotto oltre il contesto D05).

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| A7-A01 | M→A | DIRETTA | Solo masterplan; zero WP in quella chat | accettata | creazione-masterplan Q1 |
| A7-A02 | A→M | DIRETTA | Plan 18 WP vs elenco prompt 24 → segue elenco | accettata | creazione-masterplan §9 |
| A7-A03 | M→A | DIRETTA | Orchestrare solo WP semplici via sub-agent | accettata | prepara-prompt §6 |
| A7-A04 | A→M | DIRETTA | Proposta listino 29/+10/69 pre-intervista | parziale | analisi-legale (poi F1) |
| A7-A05 | A→M | DIRETTA | 5 azioni urgenti sicurezza da prioritizzare | accettata | analisi-solidità §5 |
| A7-A06 | M→A | DIRETTA | Intervista letterata F1/F2/E1–E3 | accettata | ciclo-masterplan Q1 |
| A7-A07 | M→A | DIRETTA | Alza G2/B2/S2 a bloccanti | accettata | ciclo lettura sessione |
| A7-A08 | A→M | DIRETTA | Ambiguo «S2. 2» → interpretato S2b | accettata | ciclo derivazione |
| A7-A09 | M↔M | DIRETTA | Senior ribalta Pro 79→69 e fondatori 3→6 mesi | accettata | chiusura-ciclo-fable §3 |
| A7-A10 | M↔M | DEDOTTA | GDPR da blocco pre-incasso a entro 1° mese | accettata | chiusura-ciclo-fable §2 |
| A7-A11 | M→A | DIRETTA | No commit finché «fai report finale» | accettata | chiusura-ciclo Q1 |
| A7-A12 | M→A | DIRETTA | CLI TEST fix: allinea work tree | accettata | chiusura-ciclo §7 |
| A7-A13 | M→A | DIRETTA | Agente su `main` → impone `env/test` | accettata | diagnosi-wp-b5 Q1 |
| A7-A14 | M→A | DIRETTA | Regola CLI/MCP solo in AGENTS Codex | accettata | completamento-b5 Q1 |
| A7-A15 | A→M | DEDOTTA | Scope B2 più ampio: ferma e chiede scelta | accettata | wp-b2 §8 |
| A7-A16 | M→A | DIRETTA | Scelgo A digest + merge PROD + smoke | accettata | fix-digest |
| A7-A17 | M→A | DIRETTA | Merge prod guard fantasma + M3 «procedi» | accettata | merge-production-* |
| A7-A18 | M→A | DIRETTA | Controverifica M6/FU commissionata | accettata | controverifica-* |
| A7-A19 | A→M | DIRETTA | Controverifica FU-TYPES 🔶 (~21 uncommitted) | accettata | controverifica-fu-types |
| A7-A20 | A→M | DIRETTA | Deploy edge TEST ancora in attesa conferma | ignota | fu-log merge/edge |
| A7-A21 | M→A | DIRETTA | Plan→implement FU-TYPES + prepara follow-up | accettata | fu-types-t1-t5 Q1 |
| A7-A22 | M→A | DIRETTA | Batch A FU-046 + Batch B Servizio | accettata | fu046 / m6-servizio |
| A7-A23 | M↔M | DIRETTA | FAQ «che lavoro è rimasto?» post controverifica FU-LOG | accettata | controverifica-fu-log |
| A7-A24 | A→M | DEDOTTA | Edge case form: config salvata, zero mode | ignota | controverifica-m6-form |

**Follow-up CORREGGONO vs ESTENDONO (sintesi):**

| Relazione | Tipo | Evidenza |
|-----------|------|----------|
| Analisi legale prezzi → intervista F1 → CORRETTIVA Pro 69/fondatori 6m | **CORREGGE** | A7-A04 → D06 → D41 |
| GDPR bloccante G2 → «entro 1° mese» post-senior | **CORREGGE** | D19–D21 → D42 |
| Masterplan → WP paralleli → M6/FU → merge PROD | **ESTENDE** | D01 → D45 → D57–D59 |
| Proposta CLI/MCP → solo Codex AGENTS | **CORREGGE** | D54 / A14 |
| Agente su main → env/test | **CORREGGE** | A13 |

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Evidenza | Nota |
|-------|---------------------|----------|------|
| **pricing-edition / go-to-market** | L2→L3 | D05–D14, D41, A09 | Contro §4: numeri cambiati due volte stesso giorno |
| **legal-entity / gdpr-ops** | L2 | D15–D28, D42 | Contro: alza a bloccante poi rilassa timing vendita |
| **multi-agent-orchestration** | L3→L4 | D03–D04, D45, A03 | Contro: WP-A esecuzione cieca; densità report paralleli |
| **masterplan-scoping / owner-gates** | L3 | D01–D02, D40, D46 | Contro: AL-D ancora bozze non applicate |
| **env-safety-prod / smoke-gate** | L3 | D47–D52, D49, D57–D59 | Contro: check-slot no PROD; deploy edge aperto |
| **agent-env-channels / branch-gate** | L3→L4 | D53–D55, A13–A14 | Contro cercata: agente era su main |
| **skill-mini-pack / anti-storia / docs-path-check** | L2 | D29–D39 | Design chiuso; Imp spesso aperta (L4 solo se M* conferma file vivi) |
| **controverifica** | L3 | D64, A18–A19 | Contro: 🔶 per hygiene commit, non per codice |
| **plan-then-code** | L2 | D63 | Contro: WIP QR parallelo nel tree |
| **prenota-fallback / calendar-digest** | L2–L3 | D56, D60 | Contro: edge case form zero-mode aperto |
| **public-repo-sync / release-gate** | L3 | D50, D57–D59 | Contro: smoke Servizio opzionale non fatto in report |

**Tripla colonna (anticipazione S3):**

| Skill | DICHIARATA | ESERCITATA | PARLATA (H*) |
|-------|------------|------------|--------------|
| Listino edition | EDITION_PRICING | sì intervista F1 + correzione | H3 |
| Masterplan allineamento | MASTERPLAN_ALLINEAMENTO | sì creazione+ciclo | H3 |
| Controverifica | CONTROVERIFICA.md | sì 3+ sessioni | H3 |
| CLI TEST / MCP PROD | AGENTS.md (Codex) | sì post-diagnosi B5 | H3 |

---

## Sezione 4 — Contro-evidenze

1. **Listino oscillante (stesso giorno):** intervista F1 fissa Pro **79** e fondatori **3 mesi**; chiusura Fable (revisione senior) scrive Pro **69** e fondatori **6 mesi**. Decisione commerciale non stabile al primo passaggio — skill pricing L3 indebolita senza contro-evidenza sarebbe gonfiata.
2. **GDPR: alza poi rilassa timing:** G2/B2/S2 portati a **bloccanti**, poi riformulati come «entro il primo mese», non blocco al primo incasso. Motivazione scritta nel report di chiusura (senior/allineamento), non una resa esplicita «avevo sbagliato» — resta **M↔M / CONGIUNTA**.
3. **Agente sul branch sbagliato:** diagnosi B5 — lavoro tentato fuori `env/test`; Matteo corregge. Contro-evidenza del **sistema di briefing**, non solo dell’agente.
4. **Proposta CLI/MCP troppo ampia:** prima idea «utile in generale» → poi **solo AGENTS Codex**, togliere dai docs generali. Autocorrezione di scope di processo.
5. **AL-D ancora in attesa:** ok «senza senior» e bozze pronte, ma 7/8 file fusione restano **non applicati** a fine giornata — throughput di regia alto, chiusura docs incompleta.
6. **Deploy edge / smoke Servizio aperti:** controverifica e merge repo sì; conferma deploy edge TEST e smoke Servizio spesso **delegati/non fatti** nei report.
7. **Edge case form (config salvata, zero mode):** segnalato in controverifica M6, decisione prodotto **aperta**.
8. **Densità parallela:** 63 report in un giorno = rischio di attribuire all’owner scelte tecniche degli esecutori WP-A/C; filtro applicato, ma residuale **INCERTO** su verdetti «ok prod» scritti dall’agente prima del registro Matteo.

**Cercata, non trovata in questo perimetro:** fallimento esplicito del modello «sub-agent semplici / senior complicate» come regola (nessuna resa «avevo sbagliato a orchestrare»). I fallimenti sono di branch, listino, timing GDPR, e hygiene commit.

**Verdetto sul giorno:** non è crisi — è **giornata di regia commerciale + sicurezza + rollout masterplan**. Il volume è lavoro parallelo di agenti; le decisioni dense di Matteo stanno in intervista F/E, gate PROD B/M3/digest, e correzioni post-senior.

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **63** (`Get-ChildItem -Recurse *.md` su `12-06-26/`, allineato a P0) |
| File aperti | **63 (100%)** |
| File illeggibili / saltati | **0** |
| Split A7a/A7b | **non proposto** — copertura completa con qualità dichiarata; densità gestita con deduplica E/F e filtro «solo owner» su WP-A/C |
| Regime | scavo su tutti; profondità massima su masterplan/ciclo/F/E/B/M6-merge; rastrello dichiarativo su bozze Design duplicati e WP-A/C |

**Per blocco (ordine di lettura):**

| Blocco | File | Aperti | Ruolo |
|--------|------|--------|-------|
| Masterplan / ciclo / chiusura / analisi triade | 8 | 8 | scavo decisioni |
| WP-A + AL-D report + B* | 14 | 14 | owner su B/AL-D; A=esecuzione |
| WP-C/D/E/F + Design | 16 | 16 | owner su E/F/D5; C/D1–4=esecuzione/attesa |
| M6 / FU / merge / fix UI | 17 | 17 | regia + gate PROD |
| Bozze AL-D (fusione/potatura/tombstone) | 8 | 8 | 7 attesa; Magazzino=ripresa 11-06 |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Verbatim M-VOCE intervista F1/F2/E (Q1 = peso 3) | **H3** |
| Limiti Magazzino §9 (11-06) solo ripresi in bozza 12-06 | **A6** (non ricontare qui) |
| Applicazione reale Imp mini-pack / anti-storia / doc-path | **M1/M4** + A8+ |
| Deploy edge TEST/PROD FU-LOG esito | **J1** / A8 |
| Chi ha proposto Pro 69 / fondatori 6m in revisione senior | **H3** + transcript |
| Ok file-per-file AL-D fusioni (se/quando applicato) | **A8–A10** |
| Edge case form zero-mode | **A8+** prodotto Prenota |
| Fatti oggettivi: hash merge PZ `74aaccb` / `6cef8de` / `b324df0`, migrazioni 045/046/048 | **J1** |

---

## Sezione 7 — Chiusura verso Matteo

1. Quel giorno non hai «scritto 63 pezzi di codice»: hai **diretto una fabbrica** — masterplan, prezzi/legale a lettere, design skill, e tanti agenti in parallelo; le scelte tue dense stanno soprattutto su listino, legale e gate verso produzione.
2. Hai messo in produzione pezzi reali (digest calendario a fasce, guardie, menu/migrazioni) dopo smoke tuoi, e hai imposto regole d’ambiente (branch `env/test`, CLI solo per Codex sul DB di prova).
3. Hai anche **cambiato idea in giornata** su Pro/fondatori e sul timing GDPR, e hai lasciato aperte le fusioni docs Admin e qualche deploy/smoke: regia forte, chiusura non ovunque completa.
)
