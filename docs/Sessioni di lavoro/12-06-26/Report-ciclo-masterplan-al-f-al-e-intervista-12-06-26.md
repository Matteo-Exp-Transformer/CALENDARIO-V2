# Report ciclo — Masterplan AL-F + AL-E (intervista decisioni) — 12-06-26

**Cosa è cambiato:** listino vendita, stato legale vendita Italia, e tre design dello skill system (mini-pack, check path docs, anti-storia) sono scritti e tracciati — puoi revisionarli con un senior senza riaprire la chat.
**Cosa resta:** implementazioni FU-LEGAL-1/2/3, FU-ALL-TIER, FU-ALL-DOCPATH, FU-ALL-ANTISTORIA; WP masterplan ancora ⬜ fuori questo ciclo (es. AL-B B4).
**Serve una tua azione:** sì — revisione senior delle tabelle **§ Decisioni per revisione** sotto; poi priorità su quale FU implementare per primo.

> **Scopo di questo report:** documento unico per **revisione con senior** — ogni domanda dell’intervista con **opzioni proposte** e **scelta di Matteo** (incluse opzioni consigliate dall’agente quando Matteo ha detto «seguo consiglio» / «aiutami a scegliere»).

---

## Cosa è stato fatto (cronologia)

1. **WP-F1** — Intervista prezzi → scritto `EDITION_PRICING_CONTEXT.md` + allineamento Marketing.
2. **WP-F2** — Intervista legale vendita Italia (3 fasi) → riscritto `LEGAL_STATE_CONTEXT.md` + FU-LEGAL-1/2/3.
3. **WP-E2** — Design check path docs → `Design-wp-e2-doc-path-check-12-06-26.md` + FU-ALL-DOCPATH.
4. **WP-E1** — Design mini-pack → `Design-wp-e1-mini-pack-area-12-06-26.md` + FU-ALL-TIER aggiornato.
5. **WP-E3** — Design anti-storia + §7 → `Design-wp-e3-anti-storia-protocollo-7-12-06-26.md` + FU-ALL-ANTISTORIA.
6. **Masterplan** righe 59–63: tutti i WP segnati ✅ (decisioni/design).

Nessun codice applicativo, migrazione DB, né script hook in questo ciclo.

---

## § Decisioni per revisione senior

Legenda colonne: **Opzioni** = lettere proposte in chat · **Scelta Matteo** = risposta · **Note** = testo aggiuntivo o default consigliato applicato.

---

### WP-F1 — Prezzi edition

#### Fase 1 — Prezzi base

| Domanda | Opzioni | Scelta Matteo | Esito registrato |
|---------|---------|---------------|------------------|
| Struttura listino | **A** proposta report così com’è · **B** struttura ok, numeri diversi · **C** cambia piani · **D** non approvare · **E** rivedere concorrenza prima | **B** | Classic **29€** invariato |
| Prezzi custom (B) | — | QR **+16€** (era +10€) · Pro **79€** (era 69€) · Enterprise **129€/sede** (era «da 99») | Annuale: 2 mesi gratis (290 / +160 / 790 / 1.290) — confermato fase 1b |
| Enterprise in listino | **E1** da preventivo · **E2** ometti · **E3** nota interna | **E1** | 129€/sede visibile, attivazione solo preventivo |
| Annuale 2 mesi gratis | conferma implicita fase 1b | **Sì** | — |

#### Fase 2 — Offerta lancio

| Domanda | Opzioni | Scelta Matteo | Esito registrato |
|---------|---------|---------------|------------------|
| Fondatori | **L1a** -50% 12 mesi primi 10 · **L1b** altro · **L1c** no | **Custom** | **-50% primi 3 mesi**; poi cambio piano o rinnovo uguale |
| Trial | **L2a** 30 gg no carta · **L2b** 14 gg · **L2c** no | **L2a** | — |
| Setup | **L3a** incluso · **L3b** a pagamento | **L3a custom** | Incluso **solo fondatori**; poi **100€** setup |
| Fotografo | (nel messaggio L3) | **200€** fino **25 foto**; oltre supplemento da definire | — |
| Referral | **L4a** 1 mese gratis · **L4b** no | **L4a** | — |
| Zero commissioni | **L5a** regola fissa · **L5b** no | **L5a** | «Zero commissioni a coperto, mai» |

**File:** `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md`

---

### WP-F2 — Stato legale produzione

#### Fase 1 — Blocchi commerciali Italia

| Domanda | Opzioni | Scelta Matteo | Esito registrato |
|---------|---------|---------------|------------------|
| Partita IVA | **P1a** forfettario · **P1b** ordinario · **P1c** in corso · **P1d** già aperta · **P1e** solo nota | **P1a** + nota | Ipotesi forfettario; **sentire commercialista** (FU-LEGAL-3) |
| Contratto B2B | **C2a** solo avvocato · **C2b** bozza repo → avvocato · **C2c** in corso · **C2d** rimando | **C2b** | FU-LEGAL-1 |
| Recesso contratto | **C2-R1** mensile sempre / annuale 30 gg · **C2-R2** custom | **C2-R1** | — |
| Fattura elettronica | **F3a** servizio pagamento · **F3b** ADE gratis · **F3c** già attivo · **F3d** rimandato | **F3b** | Strumento gratuito ADE |

#### Fase 2 — GDPR operativo

| Domanda | Opzioni | Scelta Matteo | Esito registrato |
|---------|---------|---------------|------------------|
| Registro art. 30 | **G2a** consigliato 3 mesi · **G2b** bloccante · **G2c** rimando | **G2b** | Senior → commercialista (FU-LEGAL-2) |
| Runbook breach | **B2a** / **B2b** / **B2c** | **B2b** | Come G2 |
| Sub-processor pubblico | **S2a** / **S2b** / **S2c** | **S2b** («2 come G2») | `docs/legal/sub-processors.md` |
| Email privacy | **E2a** / **E2b** / **E2c** | **E2c** | Temporanea: **matteo.sistemigestionali@gmail.com** |
| Region Supabase PROD | **R2a** agente verifica · **R2b** Matteo indica · **R2c** lascia da verificare | **R2b** | **West EU (Ireland)** |

#### Fase 3 — Consigliati

| Domanda | Opzioni | Scelta Matteo | Esito registrato |
|---------|---------|---------------|------------------|
| Marchio | **M2a** TMview+UIBM prima stampa · **M2b** solo ricerca · **M2c** rimando | **M2a** + nota | **PrenotaZen** + logo GPT (login/header); UIBM ~200€ |
| RC cyber | **I2a** prima scalare · **I2b** dopo 3 clienti · **I2c** no | **I2a** | ~300–600€/anno |
| EAA | **A2a** argomento vendita · **A2b** obiettivo 12 mesi · **A2c** no | **A2a** | Micro esente; Prenota/Menu QR = plus commerciale |
| Budget anno 1 | **€2a** range 1.500–2.500€ · **€2b** senza numeri | **€2a** | — |
| Disclaimer legale | **D2a** sì · **D2b** no | **D2a** | Non sostituisce commercialista/avvocato |

**File:** `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md`

---

### WP-E2 — Check automatico path docs (solo design)

#### Fase 1 — Perimetro

| Domanda | Opzioni proposte | Scelta Matteo | Esito |
|---------|------------------|---------------|-------|
| Perimetro file | **P1a** solo *-Skill · **P1b** docs/ con esclusioni · **P1c** +cursor/rules · **P1d** tutto docs | **P1b** | Esclusi: Sessioni di lavoro, _lavoro, Archivio |
| Esclusioni X | **X1** URL · **X2** fenced code · **X3** allowlist JSON · **X4** _lavoro | **Consiglio agente** («decidiamo come nel plan») | X1 sì · X2 sì · X3 allowlist · X4 via P1b |
| Cosa estrarre | **T1a** solo link md · **T1b** link + path inline · **T1c** + nomi skill | **Consiglio → T1b** | — |

#### Fasi 2–3

| Domanda | Opzioni | Scelta Matteo | Esito |
|---------|---------|---------------|-------|
| Dove gira | **R2a** solo validate · **R2b** solo pre-commit · **R2c** entrambi · **R2d** validate+CI no pre-commit | **R2d** | `npm run validate:docs` + step CI |
| Su errore | **E3a** hard fail · **E3b** warn · **E3c** misto | **E3a** | — |

**File design:** `Design-wp-e2-doc-path-check-12-06-26.md` · **FU:** FU-ALL-DOCPATH

---

### WP-E1 — Mini-pack per area (solo design)

#### Fase 1

| Domanda | Opzioni | Scelta Matteo | Esito |
|---------|---------|---------------|-------|
| Dove vivono | **L1a** solo docs · **L1b** solo .cursor · **L1c** ibrido · **L1d** cartella Mini-Pack | **L1c** | Contenuto docs, Cursor puntatore |
| Formato | **F1a** 5 sezioni · **F1b** 3 sezioni · **F1c** custom | **F1a** | ≤80 righe, LOCK solo link |
| Rollout aree | **P1** Prenota+QR · **P2** +Admin · **P3** +DB · **P4** custom | **P1 → A3 → A4–A7** | Sequenza esplicita Matteo |
| Profili §0.0 | **R1a** mini per area · **R1b** per profilo · **R1c** entrambi | **R1a** | — |

#### Fasi 2–3

| Domanda | Opzioni | Scelta Matteo | Esito |
|---------|---------|---------------|-------|
| APP_CONTEXT | **H2a** riga in §0 · **H2b** §0.0b indice · **H2c** colonna Mini · **H2d** non toccare | **H2b** | Nuovo §0.0b (in implementazione) |
| Nome file | **N2a** `*_MINI.md` in area · **N2b** cartella centralizzata · **N2c** altro suffisso | **N2a** | es. `PRENOTA_MINI.md` |
| Manutenzione | **M3a** regola LOCK · **M3b** checklist report | **M3a + M3b leggero** | — |
| Admin mini | **A3a** un ADMIN_MINI · **A3b** due file | **A3a** | — |

**File design:** `Design-wp-e1-mini-pack-area-12-06-26.md` · **FU:** FU-ALL-TIER (Aperto, Imp-1/2/3)

---

### WP-E3 — Anti-storia + protocollo §7 (solo design)

#### Fase 1

| Domanda | Opzioni | Scelta Matteo | Esito |
|---------|---------|---------------|-------|
| Regola storia | **S1a** solo report · **S1b** + max 3 righe guardrail · **S1c** freeze esistente | **S1b** | Link al report storico |
| Migrazione | **S2a** potatura attiva · **S2b** on-touch · **S2c** solo nuovi | **Consiglio** S2a+S2b | Menu QR attivo; resto on-touch |
| Tabella §7.2 | **K1a** resta APP_CONTEXT · **K1b** file separato · **K1c** accorcia | **K1a** | — |

#### Fasi 2–3

| Domanda | Opzioni | Scelta Matteo | Esito |
|---------|---------|---------------|-------|
| Spezzatura §7 | **H7a** solo 7.1+7.2 · **H7b** 7.0 breve+7.1+7.2 · **H7c** nessun taglio | **H7b** | §7.3 terminali solo CHIUSURA |
| Grilletti Cursor | **Z2a** invariati · **Z2b** aggiungi riga anti-storia | **Z2a** | — |
| Dove regola S1b | **R3a** §8 APP_CONTEXT · **R3b** REVISIONE · **R3c** CHIUSURA | **R3a** | Imp-E3-3 |
| Ordine implementazione | **O3a** Menu QR prima · **O3b** §8 prima | **O3b** | §8 → Menu QR → snellire §7 |

**File design:** `Design-wp-e3-anti-storia-protocollo-7-12-06-26.md` · **FU:** FU-ALL-ANTISTORIA

---

## Sintesi listino e legale (per senior — numeri)

| Voce | Valore approvato |
|------|------------------|
| Classic | 29€/mese · 290€/anno |
| Menu QR add-on | +16€ · +160€/anno |
| Pro | 79€ · 790€/anno |
| Enterprise | 129€/sede · 1.290€/anno · solo preventivo |
| Fondatori | -50% mesi 1–3 |
| Trial | 30 giorni senza carta |
| Setup | Gratis fondatori; poi 100€ |
| Fotografo | 200€ / 25 foto |
| Budget legale anno 1 | ~1.500–2.500€ orientativo |

---

## File toccati e perché

| File | Perché |
|------|--------|
| `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md` | Listino WP-F1 |
| `docs/Marketing-Skill/MARKETING_SKILL.md` | Puntatore §6 |
| `docs/Marketing-Skill/FEATURE_CATALOG_CONTEXT.md` | Prezzo add-on qrMenu |
| `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` | Vendita Italia WP-F2 |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP F1,F2,E1,E2,E3 → ✅ |
| `docs/FOLLOW_UP.md` | FU-LEGAL-1/2/3, FU-ALL-DOCPATH, FU-ALL-TIER, FU-ALL-ANTISTORIA |
| `docs/Sessioni di lavoro/12-06-26/Report-wp-f*.md` | Report singoli WP |
| `docs/Sessioni di lavoro/12-06-26/Design-wp-e*.md` | Design E1/E2/E3 |
| `docs/Sessioni di lavoro/12-06-26/Report-ciclo-masterplan-al-f-al-e-intervista-12-06-26.md` | Questo report |

---

## Test eseguiti

| Comando | Esito | Quando |
|---------|-------|--------|
| `npm run validate` | ✅ Verde | Dopo ogni WP chiuso in sessione (ultima: fine WP-E3) |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `EDITION_PRICING_CONTEXT.md` | Listino completo | WP-F1 |
| `MARKETING_SKILL.md` | §6 puntatore | WP-F1 |
| `FEATURE_CATALOG_CONTEXT.md` | Colonna prezzo qrMenu | WP-F1 |
| `LEGAL_STATE_CONTEXT.md` | Sezione vendita Italia + Ireland + decisioni | WP-F2 |
| `MASTERPLAN_ALLINEAMENTO.md` | Stato WP righe 59–63 | Chiusura ciclo |
| `FOLLOW_UP.md` | 7 nuove/aggiornate righe FU | Debiti implementativi |
| Design E1/E2/E3 | Nuovi file Sessioni | Solo design AL-E |
| `APP_CONTEXT_SKILL.md` | **Non toccato** | §0.0b / §8 / §7 snellito = FU implementativi |

---

## Dati comunicazione

| Pattern | Conteggio | Note |
|---------|-----------|------|
| «procediamo» / «procedi con B» | 4 | Avvio fase successiva senza ribadire contesto |
| Risposta a lettere (P1, L2a, H7b…) | 6 | Formato intervista efficace |
| «seguo consiglio» / «aiutami a scegliere» | 3 | E2 X/T, E3 S2, chiarimento senior vs Meta |
| «lavoro ok» + report per senior | 1 | Chiusura con commit richiesto |

Formato vincente: tabella opzioni + consiglio agente + risposta breve con lettere.

---

## Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali Matteo:** ~12 (avvio masterplan 59–63, risposte F1/F2/E2/E1/E3, chiarimento senior, lavoro ok).
- **Correzioni dopo 1ª risposta:** 0 su decisioni; 1 interpretazione «S2. 2» → S2b confermata implicitamente.
- **Follow-up generati in FOLLOW_UP:** FU-LEGAL-1/2/3, FU-ALL-DOCPATH, FU-ALL-TIER (stato Aperto), FU-ALL-ANTISTORIA.
- **Modalità:** standard/deep (decisioni prodotto + Meta design, no codice).
- **Replicare:** report unico con tabella opzioni/scelte per revisione senior; design in `Sessioni di lavoro/` versionati (non `_lavoro` gitignored).

---

## La mia lettura della sessione

**Impressioni:** Il formato intervista su masterplan righe 59–63 ha funzionato bene: 5 WP in una chat senza scope creep codice. Separare design (E1/E2/E3) da implementazione (FU) evita hook e skill premature. Matteo ha alzato alcune voci da «consigliato» a «bloccante» (registro, runbook, sub-processor) — da segnalare al senior legale.

**Difficoltà:** Chiarire «agente senior» vs «sessione Meta» — risolto esplicitando che AL-E non richiede senior codice. `_lavoro/Supporto` gitignored → design in `Sessioni di lavoro/`.

**Migliorie (dato, non implementate):**
- Indice unico in MASTERPLAN «Decisioni Matteo 12-06-26» che punta a questo report.
- Dopo Imp-E3-3, `PREPARA_PROMPT` potrebbe citare mini-pack quando il task è mono-area.

---

## Derivazione errori

Nessun bug codice. Unico rischio processo: **interpretazione ambigua** «S2. 2» in Fase 2 F2 — classificato come prompt compatto; confermato come S2b nel report F2.

---

## Cosa resta per la prossima sessione

| Priorità suggerita | FU / WP | Profilo |
|--------------------|---------|---------|
| 1 | FU-ALL-ANTISTORIA Imp-E3-3 (§8) | Esecuzione |
| 2 | FU-ALL-TIER Imp-1 (PRENOTA_MINI + MENU_QR_MINI) | Esecuzione |
| 3 | FU-ALL-DOCPATH (script path) | Esecuzione |
| 4 | FU-LEGAL-1 bozza contratto B2B | Legal-production |
| 5 | FU-LEGAL-2 registro/runbook/sub-processor | Senior → commercialista |
| 6 | FU-LEGAL-3 P.IVA | Matteo + commercialista |

Report singoli WP già in `docs/Sessioni di lavoro/12-06-26/Report-wp-*.md`.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «seguimi nello svolgere queste task : @MASTERPLAN_ALLINEAMENTO.md (59-63) … intervista a fasi» · «1. B cambia solo + menu QR = 16 € ; pro a 79 ; entrerprise 129€ - E1» · «1b. ok confermo tutti e due. L1… L5.A» · «procediamo» (F2) · risposte F2 Fase 1–3 · «M2.A … D2.A» · «se possiamo farli noi si se richiede agente senior dimmelo» · «procediamo» (E2) · «P1.B … R2.D E3.A» · «procedi con B» (E1) · «L1c … R1.A» · «H2.B … A3.A» · «1. WP E3» · «S1B … K1.A» · «H7.B Z2.A R3.AO3.B» · «lavoro ok. fai un report dettagliato … fai commit e push»

❓ Q2 — Dati = diff reale?
✅ R2: Verificato `git diff` — 6 file modificati + 8 nuovi in Sessioni 12-06-26; prezzi in EDITION_PRICING (29/16/79/129); LEGAL_STATE con Ireland e email temp; masterplan righe 59–63 tutte ✅; FOLLOW_UP con FU-LEGAL-1/2/3, FU-ALL-DOCPATH, FU-ALL-TIER, FU-ALL-ANTISTORIA; validate verde a fine sessione.

❓ Q3 — File correlati allineati?
✅ R3: Marketing + Legal allineati alle decisioni. APP_CONTEXT §0.0b/§8/§7 snellito non ancora — correttamente in FU. Nessun codice/src.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Nessuno script doc-path, nessun mini-pack, nessun §8, nessuna potatura Menu QR, nessun contratto/registro legale, nessuna P.IVA, nessun commit fino a questo report (ora eseguito su richiesta «lavoro ok» + commit push).

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito basso su intervista multi-WP; miglioria: report ciclo unico (questo file) per senior evita 5 report parziali da rileggere — suggerito come standard per cicli decisionali masterplan.

❓ Q6 — Contesto & hook?
✅ R6: Giusto — masterplan + report legale 12-06-26 + file skill area; nessun hook stop in questa chat fino a lavoro ok.

---

## Commit e push

Eseguiti su richiesta esplicita «lavoro ok» + commit push nel prompt finale.
