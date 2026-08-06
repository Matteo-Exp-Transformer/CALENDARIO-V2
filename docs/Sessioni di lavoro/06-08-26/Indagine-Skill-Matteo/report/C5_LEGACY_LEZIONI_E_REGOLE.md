# C5 — HACCP legacy: lezioni, regole Cursor, misc

> **Ondata:** C5 · **Data report:** 06-08-26 · **Regime:** SCAVO (alta densità lezioni) · **Peso fonti:** 3
> **Perimetro piano/P0:** 40 file · **Disco:** 41 (40 del piano + `Skills-befor0summarizing.mdc` quasi vuoto in cursor-rules)
> **Focus prompt:** dove gli errori diventano regole; per ogni lezione: chi ha pagato, chi ha scritto la regola, è sopravvissuta fino a oggi?
> **Nota mtime:** filesystem = 05-02-26 (copia bulk) — **non usata**. Date = intestazioni nei documenti; molte dicono `2025-01-27` su contenuti multi-agente (possibile refuso anno ↔ gen 2026 cleanup).
> **Attribuzione:** «Matteo» quasi assente come firma. Compare «utente» / «Owner» / «richiesta utente». Stesso criterio C1: ruolo product-owner → `Chi = MATTEO` quando la fonte è chiaramente la richiesta umana; altrimenti `INCERTO` / `AGENTE`.

**Sopravvivenza (sondaggio 06-08-26, fuori Archives/indagine):**
- `blindatur*` → **centinaia** di hit in docs attivi (Testing-Skill, MASTERPLAN, sessioni) → **sopravvissuta** (forma evoluta).
- `90% planning` / `GESTIONE DECISIONI` / `Skills-reasoning` / cartelle `Agente_0..9` → **zero** fuori Archives → **non sopravvissute** come testo.
- Commenti `// LOCKED` → protocollo letterale **archiviato**; idea «non toccare senza permesso» vive come **LOCK file / blindatura area**.
- `.cursor/rules/` oggi: `comandi-base.mdc` + puntatori a skill d’area — **non** i 4 core del MANIFEST 07-01-26.

---

## Sezione 1 — Decisioni

### A. Errori → regole (nucleo focus C5)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C5-D01 | 27-01-25? | AI-METODO | Codificare stabilità decisionale dopo contraddizione A6/A7 | AGENTE | CORRETTIVA | `LEZIONI_APPRESE_AGENTE_1.md` §1 + §REGOLE CRITICHE | «Posizione precedente: "Procedere con Agente 7"… attuale: "Agente 6 deve completare"» | decision-stability |
| C5-D02 | 27-01-25? | AI-METODO | Divieto cambio posizione senza nuove evidenze | AGENTE | CORRETTIVA | stesso §2 + product-strategy L21-25 | «STABILITÀ: Una volta presa una decisione, mantenerla coerente» | decision-stability |
| C5-D03 | 27-01-25? | AI-METODO | Principio 90% planning / 10% coding + MVP prima | AGENTE | CORRETTIVA | LEZIONI §3; product-strategy L22, L44-48 | «FOCUS MVP: 90% planning / 10% coding - MVP deploy è priorità» | mvp-scope-discipline |
| C5-D04 | 27-01-25? | TESTING | Coverage MVP ≥60%, non 100% prima del deploy | AGENTE | CORRETTIVA | LEZIONI §principi; product-strategy L47 | «Target ≥60% coverage per MVP, non 100%» | realistic-quality-gates |
| C5-D05 | 27-01-25? | AI-METODO | Propagare lezioni A1 dentro skill Product Strategy | AGENTE | ORIGINATA | `Agente_1/Skills-product-strategy.md` L20-26, L819-840 | «GESTIONE DECISIONI E COERENZA» + stesse regole critiche | lesson-to-skill |
| C5-D06 | 27-01-25? | AI-METODO | Skills-reasoning Agenti 0/1/2 contro decisioni affrettate | AGENTE | ORIGINATA | `README_REASONING_SKILLS.md` L7-14; Skills-reasoning ×3 | «Decisioni affrettate… Accelerazioni eccessive… Semplificazioni pericolose» | pressure-brake |
| C5-D07 | 27-01-25? | AI-METODO | Consultazione obbligatoria peer planning sotto pressione | AGENTE | ORIGINATA | README_REASONING §STEP 2; Skills-reasoning A1 L52-56 | «Almeno 1 domanda ad altri agenti planning» | peer-consult |
| C5-D08 | 27-01-25? | AI-METODO | Organizzare skills per cartella Agente_0..9 | AGENTE | ORIGINATA | `README_SKILLS_ORGANIZATION.md` L5-41 | «skills… cartelle separate per ogni agente» | skill-folder-per-agent |
| C5-D09 | 27-01-25? | AI-METODO | Spezzare Agente 9: final-check vs knowledge-mapping | AGENTE | ORIGINATA | `Agente_9/README_DIVISIONE_SKILLS.md` L7-12, L76-83 | «file skills… troppo grande (498 righe)» | context-budget |
| C5-D10 | 27-01-25? | AI-METODO | Veto Agente 9 se piano non allineato all’utente | AGENTE | ORIGINATA | `Agente_9/Skills-final-check.md` L25, L54 | «Veto power: Blocca esecuzione se piano non è allineato» | user-alignment-veto |
| C5-D11 | 07-01-26 | PROCESSO | Cleanup `.cursor/rules`: archiviare Agente_* → 4 core | AGENTE | DELEGATA | `cursor-rules-cleanup-2026-01/MANIFEST.md` L8-27 | «Rimangono solo i 4 file core skills» | skill-hygiene |
| C5-D12 | 07-01-26 | PROCESSO | Rimuovere duplicati/obsoleti (befor0summarizing, app-mapping dup) | AGENTE | DELEGATA | MANIFEST L9-12 | «befor0summarizing.mdc - File obsoleto» | skill-dedup |

### B. Protocollo LOCK / blindatura (regole operative)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C5-D13 | ? | TESTING | Zona vietata: mai modificare file con `// LOCKED` senza permesso utente | INCERTO | ORIGINATA | `References/Reference/REGOLE_AGENTI.md` §COMPONENTI LOCKED | «MAI MODIFICARE FILE CON COMMENTI… CHIEDI PERMESSO ESPLICITO all'utente» | lock-discipline |
| C5-D14 | ? | PROCESSO | Blindatura = test 100% + edge + no side-effect prima del lock | INCERTO | ORIGINATA | REGOLE_AGENTI §PROCESSO DI BLINDATURA | «Tutti i test passano al 100%… Edge cases testati» | blindatura-criteria |
| C5-D15 | ? | AI-METODO | Lock atomici multi-agente su host/porta (coda FIFO) | AGENTE | ORIGINATA | REGOLE_AGENTI §PROTOCOLLO LOCK; QUICK_REFERENCE | «Solo UN agente per host alla volta» | multi-agent-lock |
| C5-D16 | ? | SICUREZZA | Prima di test JS: consultare schema/dati DB reali (no mock ciechi) | AGENTE | ORIGINATA | REGOLE_AGENTI §CONSULTAZIONE DATABASE | «MAI usare dati mock senza verificare database» | db-first-tests |
| C5-D17 | 16-01-25? | TESTING | Dichiarare auth «completamente blindata» (7 componenti LOCKED) | AGENTE | ORIGINATA | `Archive/BLINDATURA_AUTENTICAZIONE_COMPLETATA.md` L3-5, L97 | «BLINDATURA COMPLETATA… Componenti Blindate: 7/7» | blindatura-claim |
| C5-D18 | 21-10-25 | TESTING | Tracking post-test: solo 3% componenti blindati, 97% da fare | AGENTE | ORIGINATA | `2025-10-21` (file) L257-261 | «Componenti già blindati: 3 (3%)… da blindare: 97+» | blindatura-honesty |

### C. Richieste utente / prodotto nel perimetro

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C5-D19 | 20-10-25 | SICUREZZA | Blindare login/inviti/sessione da zero (P0) | MATTEO | ORIGINATA | `2025-10-20/richiesta_utente_login-hardening.md` L14-29 | «Partiamo da zero, senza ispezionare lo stato attuale. Vogliamo blindare il login» | auth-hardening |
| C5-D20 | 20-10-25 | AI-METODO | Vincolo: niente analisi codice corrente; flusso 0→1→…→7 | MATTEO | ORIGINATA | stesso L24-26 | «Niente analisi del codice corrente; progettazione ex‑novo» | greenfield-brief |
| C5-D21 | 20-10-25 | TESTING | Login «affidabile al 100%» con unit+integrazione+E2E | MATTEO | ORIGINATA | stesso L17 | «Login affidabile al 100% con test completi» | test-ambition |
| C5-D22 | 20-10-25 | PROCESSO | Handoff Agente1/Agente3 su P0-1 login (DoD + path sessione) | AGENTE | DELEGATA | `HANDOFF_Agente1_…` / `HANDOFF_Agente3_…` | «Definition of Done… Coverage… E2E» | multi-agent-handoff |
| C5-D23 | 20-10-25 | PROCESSO | Checklist Agente 0: normalizzare richiesta + domande obbligatorie | AGENTE | DELEGATA | `2025-10-20/Checklist_v0.md` L4-7, L21-25 | «Normalizzare richiesta utente… In attesa risposte utente» | orchestrator-intake |
| C5-D24 | 20-10-25 | SICUREZZA | Piano blindaggio login P0–P2 (scope React+Supabase) | INCERTO | SCELTA | `CHECKLIST_BLINDAGGIO_LOGIN.md` L1-16 | «rendere a prova di errore… Priorità P0 (bloccanti release)» | auth-hardening-plan |
| C5-D25 | ? | UI-UX | Eliminare cestino form «Nuova Attività Generica» | MATTEO | ORIGINATA | `Reports/REPORT_COMPLETO_MODIFICHE_CALENDARIO.md` L12-14, L111 | «modifiche specifiche richieste dall'utente… Eliminare pulsante cestino» | ui-dedup |
| C5-D26 | ? | UI-UX | Eliminare allegati/legenda duplicati; stats legate alla view | MATTEO | ORIGINATA | stesso L15-17, L140 | «Statistiche… indipendentemente dalla view» → fix view-based | calendar-ux |
| C5-D27 | 19-10-25 | AI-METODO | Sistema 6 skills early (overview/test/mapping/prompt/error) | INCERTO | ORIGINATA | `References/SKILLS_SETUP_COMPLETE.md` L1-19 | «Sistema di 6 skills specializzate… PRODUCTION READY» | early-skill-system |
| C5-D28 | ? | AI-METODO | Stile risposta Agente 0: metafora + «Sei d'accordo?» | INCERTO | INCERTO | `Agente_0/Skills-orchestrator.md` L29-37 | «Perché → Schema → Esempio → Micro-task → Sei d'accordo?» | user-comm-style |
| C5-D29 | ? | PROCESSO | Quality gate planning: Conferma Umana con firma/data utente | AGENTE | ORIGINATA | orchestrator L119-122 | «Conferma Umana – Allineamento Utente… firma/data dell’utente» | human-gate |
| C5-D30 | ? | AI-METODO | Verifica empirica conteggi file vs dichiarati (anti-gonfiaggio) | AGENTE | ORIGINATA | orchestrator L55-58, L134-136 | «VERIFICA CONTEggio EFFETTIVO… Non accettare dichiarazioni senza verifica» | empiric-counts |

> **Scavo — skill tecniche Agente 2–8 e Skills archiviate (6 early):** aperte per intero/intestazione; nessuna decisione Owner aggiuntiva oltre D01–D30. Sono **ruoli/procedure agente**, non scelte di Matteo. Contate in §5.
> **Sensibilità:** `REGOLE_AGENTI.md` contiene un esempio di URL+JWT di progetto legacy — **non copiato** nel report (path + sintesi: «esempio client Supabase con chiave in chiaro nel testo della regola»).

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| C5-A01 | A→M | DEDOTTA | A1 ammette contraddizione leadership A6↔A7 e scrive regole anti-contraddizione | accettata | `LEZIONI_APPRESE_AGENTE_1.md` §1–2 |
| C5-A02 | A→M | DEDOTTA | A1: «tentazione testing completo» vs MVP — regola coverage realistica | accettata | LEZIONI §3; product-strategy troubleshooting |
| C5-A03 | A→M | DIRETTA | DEBUG multi-agent: A1/A4/A5 «blindati» ma test falliscono (titolo/porta) | accettata | `Reports/…/DEBUG_MULTI_AGENT_REPORT.md` L20-26, L45-57 |
| C5-A04 | A→M | DEDOTTA | Tracking 21-10 contraddice claim «auth 100% blindata» (3% vs 7/7) | accettata | `2025-10-21` vs `BLINDATURA_AUTENTICAZIONE_COMPLETATA.md` |
| C5-A05 | M→A | DIRETTA | Richiesta utente obbliga greenfield + flusso 7 agenti (vincolo duro) | accettata | `richiesta_utente_login-hardening.md` L24-26 |
| C5-A06 | M→A | DEDOTTA | Richieste UX calendario (cestino/duplicati/stats) eseguite «come richiesto» | accettata | REPORT_COMPLETO_MODIFICHE_CALENDARIO L12-17, L111 |
| C5-A07 | M↔M | — | **Nessun cambio idea M↔M verbatim** in questo perimetro | — | (nome Matteo assente; solo artefatti agente) |
| C5-A08 | A→M | DEDOTTA | Reasoning skills: freno a pressioni «Dobbiamo accelerare / Semplifichiamo» | ignota | README_REASONING §segnali allerta — non prova che l’utente abbia premuto |

> Peer-review **agente↔agente** (come in C1) non ha colonna nello schema: A03–A04 proteggono il gate umano da readiness falsa.

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Evidenza (ID) | Contro-evidenza cercata |
|-------|---------------------|---------------|-------------------------|
| `lesson-to-skill` (errore → regola in skill file) | **L4 lato agenti**; **L0–L1 per Matteo** (non firma le lezioni) | C5-D01–D05 | §4: regole 90%/stabilità **non** nel corpus attivo CB-v2 |
| `decision-stability` | **L1** (codificata da A1, non da M-VOCE qui) | D01–D02, A01 | §4: contraddizione A6/A7 = fallimento precedente |
| `mvp-scope-discipline` | **L1** (testo agente) | D03–D04, A02 | §4: D21 chiede «100% test» → tensione con ≥60% MVP |
| `pressure-brake` / `peer-consult` | **L1** (skill reasoning) | D06–D07 | §4: survival = 0 fuori Archives; ignoto se usate in vivo |
| `blindatura-criteria` / `lock-discipline` | **L2** concetto (sopravvive evoluto); **L1** forma `// LOCKED` | D13–D14, D17–D18 | §4: claim 100% vs tracking 3%; DEBUG test rossi |
| `auth-hardening` + `greenfield-brief` | **L2** (richiesta utente ORIGINATA) | D19–D21, A05 | §4: greenfield «no leggere codice» vs orchestrator «verifica empirica codice» |
| `user-alignment-veto` / `human-gate` | **L1** (scritto da agenti) | D10, D29 | Cercata: nessuna firma umana reale in C5 (come C1) |
| `user-comm-style` (metafora / conferma) | **L0–L1** INCERTO chi l’ha chiesto | D28 | Cercata: non c’è citazione Matteo che impone lo stile |
| `skill-hygiene` (cleanup regole) | **L1** (agente cleanup) | D11–D12 | §4: i «4 core» del MANIFEST non sono lo stato attuale CB-v2 |
| `empiric-counts` | **L2** regola agente (antenato copertura dichiarata) | D30 | Allineata allo spirito §3.1 sezione 5 di questa indagine |
| `ui-dedup` / `calendar-ux` | **L2** | D25–D26, A06 | Contro in perimetro: non trovata |
| `multi-agent-orchestration` (7–9 agenti) | **L1** sistema; **archiviato** oggi | D08, D22, SKILLS org | §4: sostituito da skill d’area + comandi-base |

**Nessuna skill L3/L4 attribuibile a Matteo in C5** (manca M→A sul merito tecnico con citazione sua; le regole L4 sono scritte e firmate da Agente 1/0). Il segnale forte è **metodologico di sistema**: gli errori degli agenti diventano skill file — pattern che in CB-v2 riappare come EVOLUZIONE_SKILLS / ERRORI_PROCESSO (handoff S3/M1), non come copia letterale di queste lezioni.

### Tabella focus — lezione → regola → sopravvivenza oggi

| Lezione (errore pagato da) | Regola scritta da | File regola | Sopravvive oggi? |
|----------------------------|-------------------|-------------|------------------|
| Contraddizione A6↔A7 (Agente 1) | Agente 1 | LEZIONI + product-strategy «STABILITÀ» | **No** come testo; idea «non ribaltare senza evidenza» vive in processi meta più tardi (fuori C5) |
| Testing completo vs MVP (Agente 1; pressione ignota) | Agente 1 | 90% planning / coverage ≥60% | **No** fuori Archives |
| Decisioni affrettate sotto pressione (planning 0/1/2) | Agente 0 | Skills-reasoning ×3 | **No** come file; eco parziale in trigger «ragioniamo» (VOCABOLARIO — fuori perimetro, handoff M1) |
| Skill file troppo grosso A9 | Agente 0 | split final-check / knowledge | **Pattern sì** (skill snelle d’area); **file no** |
| Modifica componenti già testati | INCERTO (regole progetto) | REGOLE_AGENTI LOCKED | **Sì evoluta** → LOCK/blindatura Testing-Skill |
| Claim blindatura gonfiati (agenti 1–5) | Report DEBUG / tracking | anti-falso readiness | **Sì** come cultura controverifica (EVOLUZIONE / TESTING) |
| Troppe cartelle Agente_* in `.cursor/rules` | Cleanup 07-01-26 | MANIFEST → 4 core | **Superata**: oggi skill d’area, non i 4 core |

---

## Sezione 4 — Contro-evidenze

1. **Lezioni firmate Agente 1, non Matteo** — chi ha «pagato» l’errore nel testo è l’agente; non c’è M-VOCE che ammette la contraddizione. Attribuire L3/L4 a Matteo qui sarebbe allucinazione.
2. **Tensione D21 vs D03/D04** — la richiesta utente chiede test «completi / 100%»; le lezioni A1 comandano MVP con coverage ≥60%. Stesso perimetro, due poli.
3. **Tensione greenfield (D20) vs empiric-counts (D30)** — «non ispezionare codice» vs «verifica conteggi e backend reali».
4. **Blindatura dichiarata vs misurata** — BLINDATURA_AUTH 7/7 e AGENTE_5 8/8 vs DEBUG (test rossi) e `2025-10-21` (3% blindati). Controprova diretta a `blindatura-claim`.
5. **Regole critiche LEZIONI non nel corpus attivo** — sondaggio 06-08-26: zero hit `90% planning` / `Skills-reasoning` fuori Archives. Codifica ≠ adozione duratura.
6. **MANIFEST «4 core» già obsoleto rispetto a CB-v2** — cleanup archiviò il multi-agente; oggi l’albero skill è un altro prodotto. La «sopravvivenza» non è linearità.
7. **`Skills-befor0summarizing.mdc`** — solo frontmatter `alwaysApply: true`, corpo vuoto: regola morta lasciata in archivio.
8. **Date `2025-01-*` su LEZIONI/README skills** — coesistono con cleanup `2026-01-07` e login `2025-10-20`; timeline interna incoerente (non usare come cronologia fine).

---

## Sezione 5 — Copertura dichiarata

| Voce | N |
|------|---|
| File nel perimetro (piano P0) | **40** |
| File sul disco nel perimetro | **41** (+1 `.mdc` quasi vuoto) |
| File aperti | **41** (100% disco) |
| Di cui md/testo | 40 |
| Illeggibili/saltati | **0** |
| Regime | SCAVO su lezioni/regole/richieste; skill tecniche A2–A8 e 6 early skills = lettura completa o intestazione+trigger, senza riassunto narrativo |

**Elenco perimetro (path relativi a `docs/Archives/`):**
- `cursor-rules-cleanup-2026-01/` — 25 file (24 md + 1 mdc): MANIFEST, 2 README, Agente_0..9 skills, Skills archiviate ×7
- `References/` — 5 (`SKILLS_SETUP_COMPLETE.md` + `Reference/{README,QUICK_REFERENCE,REGOLE_AGENTI,SISTEMA_CONFIGURAZIONE}.md`)
- `2025-10-20/` — 5 (richiesta_utente, Checklist_v0, CHECKLIST_BLINDAGGIO_LOGIN, 2 HANDOFF)
- `2025-10-21` — 1 file senza estensione
- `Reports/` — 3
- `Archive/` — 1 (`BLINDATURA_AUTENTICAZIONE_COMPLETATA.md`)
- `LEZIONI_APPRESE_AGENTE_1.md` — 1

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Chi ha chiesto le Skills-reasoning / lo stile Agente 0? Solo testo agente | **H*** (M-VOCE) / **G1** |
| Conferma che LEZIONI A1 siano post-incidente reale vs template auto-critico | **C1** (sessioni 20-10) già ha peer-review; **H*** |
| Sopravvivenza «ragioniamo» / ERRORI_PROCESSO come eredi | **M1** (già fatta — confrontare in **S3**) |
| JWT/URL in REGOLE_AGENTI: ambiente legacy vs TEST/PROD attuali | **J1** (fatti) — non citare segreti |
| Calendar UX «richieste utente»: transcript o solo report agente? | **H*** / **C2** (stesso report era anche in cleanup) |
| Evoluzione 6 skills → Agente_* → 4 core → skill d’area: timeline ufficiale | **S3** albero skill |
| `richiesta_utente` era fuori C1 → qui chiusa; parametri Owner login restano in C1 | **S1** dedup D19–D21 ↔ C1-D* |

---

## Sezione 7 — Chiusura verso Matteo

Qui si vede il momento in cui gli agenti, dopo aver sbagliato (contraddizioni, gonfiature di «tutto blindato»), **scrivono regole su se stessi** — non tu a firma.  
La cosa che **è rimasta** nel lavoro di oggi non è il testo «90% planning», ma l’idea di **blindatura** e di **non fidarsi del claim**: oggi vive nei manuali di test e nei gate che fai a mano.  
Il sistema a 7–9 agenti con cartelle skills è **morto e archiviato**; al suo posto hai skill per schermata (Prenota, Menu QR, Admin…) e comandi brevi — stesso bisogno (guidare l’AI), forma diversa.
