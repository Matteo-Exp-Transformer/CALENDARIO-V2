# C1 — HACCP legacy: Sessions_Old (origini multi-agente)

> **Ondata:** C1 · **Data report:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (artefatti agenti; «Owner» = ruolo umano, nome «Matteo» assente come decisore)
> **Perimetro P0/piano:** `docs/Archives/Sessions_Old/` = **67 md** · **Disco:** 69 file (67 md + 2 sql) — aperti tutti e 69
> **Focus prompt:** come dava istruzioni prima del metodo attuale; delega; errori di processo; lezioni; punto zero della curva (S3)
> **Nota mtime:** filesystem = 05-02-26 (copia bulk) — **non usata**. Date = intestazioni nei documenti.

**Attribuzione:** in questo perimetro la parola «Matteo» compare solo come email di test, mai come firma di decisione. Le decisioni umane sono etichettate «Owner» / «Utente» / «Conferma Umana». Dove il testo è chiaramente conferma product-owner → `Chi = MATTEO` (ruolo). Dove «RISOLTO» senza nominare chi → `INCERTO`.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C1-D01 | 20-10-25 | SICUREZZA | Rate limit 5/5min → lock 10min | MATTEO | ORIGINATA | `2025-10-20/login-hardening_step1_agent1_v1.md` §Parametri Owner | «Parametri di sicurezza (decisi dall’Owner)» | product-security |
| C1-D02 | 20-10-25 | SICUREZZA | Password solo lettere, min 12 | MATTEO | ORIGINATA | stesso PRD §Password policy | «Nota rischio: accettato dall’Owner (policy minima)» | product-security |
| C1-D03 | 20-10-25 | SICUREZZA | Recovery allineato al rate login | MATTEO | ORIGINATA | stesso PRD §Recovery | «Allineare rate limit al login» | product-security |
| C1-D04 | 20-10-25 | SICUREZZA | Soglie Owner lockout brute-force | MATTEO | ORIGINATA | stesso PRD §Rate limit | «Soglie Owner: 5 tentativi in 5 minuti → lock 10 minuti» | product-security |
| C1-D05 | 20-10-25 | SICUREZZA | Remember me OFF in v1 | MATTEO | ORIGINATA | `Agente_2_…/SECURITY_FLOWS.md` §Parametri Owner | «Remember me: OFF per v1» | product-security |
| C1-D06 | 20-10-25 | SICUREZZA | CSRF cookie + header Edge | MATTEO | APPROVATA | `Neo_…/Checklist_Planning_Consolidata.md` §Decisioni Owner | «CSRF: `bhm_csrf_token` + `X-CSRF-Token` header» | product-security |
| C1-D07 | 20-10-25 | SICUREZZA | Base URL Edge `/functions/v1` | MATTEO | APPROVATA | Neo §Decisioni Owner | «Base URL: `/functions/v1` (Supabase Edge)» | product-architecture |
| C1-D08 | 20-10-25 | SICUREZZA | Sessione TTL/idle 30m rolling | MATTEO | APPROVATA | Neo §Decisioni Owner; SECURITY_FLOWS | «Sessione: TTL 30m, idle 30m, rolling +15m» | product-security |
| C1-D09 | 20-10-25 | UI-UX | Task success ≥90% flow critici | MATTEO | ORIGINATA | `Agente_3_…/Brief_to_Agente3.md` §Parametri UX Owner | «Parametri UX confermati (Owner):» | product-ux-metrics |
| C1-D10 | 20-10-25 | UI-UX | Error recovery ≤3 click | MATTEO | ORIGINATA | stesso Brief | «Error recovery: ≤3 click per risolvere errore» | product-ux-metrics |
| C1-D11 | 20-10-25 | UI-UX | Login ≤30s; touch ≥44px | MATTEO | ORIGINATA | stesso Brief | «Form completion: ≤30 secondi per login valido» | product-ux-metrics |
| C1-D12 | 20-10-25 | PROCESSO | Conferma umana sblocca sviluppo | MATTEO | APPROVATA | Neo §Approvazioni | «Utente/Owner — Conferma Umana: … Nome: Owner» | human-gate |
| C1-D13 | 20-10-25 | PROCESSO | LOCKED files: integra senza riscrivere | CONGIUNTA | APPROVATA | Neo §Strategia integrazione | «Approccio LOCKED Files: ✅ APPROVATO» | lock-discipline |
| C1-D14 | 20-10-25 | PRODOTTO | FE nuovi componenti `auth-new/` | MATTEO | APPROVATA | Neo §Decisioni Owner | «FE: nuovi componenti in `src/features/auth-new/`» | product-architecture |
| C1-D15 | 20-10-25 | AI-METODO | Flusso 7 agenti + quality gates | CONGIUNTA | ORIGINATA | `2025-10-20/Prompt_Agente1.md` Contesto | «flusso 0→1→2→3→[4→5→6→7] con quality gates» | multi-agent-orchestration |
| C1-D16 | 20-10-25 | AI-METODO | Progettare ex-novo, no analisi codice | CONGIUNTA | ORIGINATA | `Brief_to_Agente1.md` Vincoli | «Nessuna analisi del codice corrente: progettazione ex‑novo» | greenfield-brief |
| C1-D17 | 20-10-25 | PRODOTTO | Multi-tenant obbligatorio in release | INCERTO | SCELTA | PRD §Domande aperte | «**RISOLTO**: sì (tenant = azienda)» | product-scoping |
| C1-D18 | 20-10-25 | PRODOTTO | Ruoli: owner + admin + operator | INCERTO | SCELTA | PRD §Domande aperte | «**RISOLTO**: owner (bootstrap) + admin + operator» | product-rbac |
| C1-D19 | 20-10-25 | UI-UX | Login centrato max 400px | AGENTE | DELEGATA | `HANDOFF_TO_AGENTE_4_5.md` Q1 | «**RISOLTO**: Centrato, max width 400px» | product-ux |
| C1-D20 | 20-10-25 | UI-UX | Errori inline+banner; Remember OFF | AGENTE | DELEGATA | HANDOFF Q2–Q5 | «Remember me… **RISOLTO**: Disabilitata per v1» | product-ux |
| C1-D21 | 20-10-25 | PROCESSO | Gate 3 firma «Conferma Umana» | INCERTO | APPROVATA | `QUALITY_GATE_AGENTE_3.md` MUST Conferma Umana | «Firma/Data dell'utente: Agente 3…» | human-gate-integrity |
| C1-D22 | 21-10-25 | AI-METODO | Stop-and-ask: non inventare, chiedi | AGENTE | ORIGINATA | `STATUS_AGENTE_4.md` STOP-AND-ASK | «Aprire "Richiesta Dati Mancanti" all'utente» | stop-and-ask |
| C1-D23 | 27-01-25 | PROCESSO | GO FOR DEPLOY (revisione A7) | AGENTE | ORIGINATA | `REVISIONE_AGENTE_7_COMPLETATO.md` chiusura | «Decisione Finale: **GO FOR DEPLOY**» | release-gate |

> **Rastrello — non estratto:** ~45 file (API/SQL/test plan/wireframe/stories/mappatura/duplicati `2025-10-21/` eco di Agente 2) = solo-contatto o eco parametri già in D01–D14. Contati in §5, non riassunti.
> **`API_SPEC_AUTH_v1.md`:** file presente, contenuto vuoto (placeholder citato da Neo/handoff).

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| C1-A01 | A→M | DEDOTTA | Peer A2→A5: E2E falsi positivi, QG fallito (protegge gate umano) | accettata | `REVISIONE_CRITICA_AGENTE_5_FINAL.md` §Verdetto |
| C1-A02 | A→M | DEDOTTA | Guida correzione test CSRF/testid non esistenti | accettata | `GUIDA_CORREZIONE_TEST_AGENTE_5.md` |
| C1-A03 | A→M | DEDOTTA | A0 (via A2) taglia scope creep piano testing A1 | accettata | `ANALISI_REVISIONE_CRITICA_AGENTE_0_SU_PIANO_AGENTE_6.md` |
| C1-A04 | A→M | DEDOTTA | A2: A7 dichiara deploy con app down | accettata | `ANALISI_AGENTE_7_COMPLETATO.md` |
| C1-A05 | A→M | DEDOTTA | A7 ammette errori → poi GO deploy (A2 valida) | parziale | `REVISIONE_AGENTE_7_COMPLETATO.md` |
| C1-A06 | A→M | DEDOTTA | A2: piano A1 manca dettagli backend reali | accettata | `REPORT_ANALISI_PIANO_AGENTE_1_PER_AGENTE_0_E_1.md` |
| C1-A07 | A→M | DIRETTA | Policy A4: tre domande obbligatorie pre-lavoro | ignota | `STATUS_AGENTE_4.md` §Domande obbligatorie |
| C1-A08 | M→A | — | **Nessuna correzione M→A verbatim** in questo perimetro | — | (nome Matteo assente come decisore) |
| C1-A09 | M↔M | DEDOTTA | Owner accetta rischio password solo-lettere | accettata | PRD C1-D02 |

> **Nota schema:** le correzioni tipiche qui sono **agente↔agente** (peer review). Lo schema §3.1 non ha `A→A`; le si registra come `A→M` DEDOTTA quando proteggono il gate umano da lavoro dichiarato «fatto». Non sono prove che Matteo fosse fuori strada.

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Evidenza (ID) | Contro-evidenza cercata |
|-------|---------------------|---------------|-------------------------|
| `product-security` (parametri Owner) | **L2** | C1-D01…D08, D14 | §4: rischio charset accettato; Remember OFF chiuso anche da A3 senza Owner |
| `product-ux-metrics` | **L2** | C1-D09…D11 | §4: Q layout HANDOFF «RISOLTO» da Agente 3, non Owner |
| `human-gate` | **L1** (nominato, fragile) | C1-D12, D21 | §4: firma Conferma Umana = Agente 3 |
| `multi-agent-orchestration` | **L2** (sistema 7 agenti codificato in brief/prompt) | C1-D15, Brief/Prompt/Neo | §4: peer review necessaria perché i gate mentono |
| `lock-discipline` | **L1** | C1-D13 | Cercata in perimetro: solo dichiarazione Neo, no prova collaudo umano |
| `stop-and-ask` / anti-inventare | **L1** (regola agente, non voce Matteo) | C1-D22, A07 | Cercata: non c’è prova che l’utente abbia usato il canale |
| `greenfield-brief` (no leggere codice) | **L1** | C1-D16 | §4: tensione con «10 Conferme Veloci validate contro codice reale» nel PRD |
| `test-anti-false-positive` | **L3** solo lato **agenti** (A2 corregge A5) — **non** skill di Matteo qui | C1-A01, A02 | Contro: Matteo non compare; L3 Matteo non dichiarabile |
| `release-honesty` | **L0** per Matteo; agenti oscillano | C1-A04, A05, D23 | §4: GO deploy dopo falsi readiness |

**Nessuna skill L3/L4 attribuibile a Matteo in C1** (manca M→A DIRETTA e manca regola scritta da lui con nome). I livelli alti qui sono del sistema multi-agente, non della voce Owner.

---

## Sezione 4 — Contro-evidenze

| Claim suggerito dal corpus | Contro-evidenza | Fonte |
|----------------------------|-----------------|-------|
| «Matteo decide e firma i gate» | Firma «Conferma Umana» = Agente 3, non Owner | `QUALITY_GATE_AGENTE_3.md` r.96 |
| «Quality Gate / score alto = lavoro fatto» | A5: QG fallito per E2E falsi positivi; A7: readiness con `ERR_CONNECTION_REFUSED` | REVISIONE_CRITICA_A5; ANALISI_A7 |
| «Owner ha chiuso tutte le open Q UX» | Q1–Q5 HANDOFF «RISOLTO» senza citare Owner → Agente 3 | `HANDOFF_TO_AGENTE_4_5.md` |
| «Multi-agent = controllo umano continuo» | Approvazioni agenti↔agenti; GO deploy da revisione agente; STOP-AND-ASK è policy agente | Neo; REVISIONE_A7; STATUS_A4 |
| «Password policy Owner = best practice» | Stesso PRD: rischio charset solo-lettere «accettato» | PRD §Password policy |
| «Timeline ottobre → implementazione lineare» | Neo elenca A4/A5 al 2025-01-27 dentro checklist 2025-10-20; revisioni datate gen-25 | Neo §Stato agenti; REVISIONE* |
| «Artefatti Systems completi» | `API_SPEC_AUTH_v1.md` vuoto pur citato come deliverable | file vuoto + Neo deliverable |

Cercata attivamente **A→M «Matteo fuori strada» DIRETTA:** non trovata (niente transcript; niente citazione Owner corretto da un agente sul merito).

---

## Sezione 5 — Copertura dichiarata

| Voce | N |
|------|---|
| File nel perimetro (P0/piano, `.md`) | **67** |
| File sul disco in `Sessions_Old/` | **69** (67 md + 2 sql: `MIGRATIONS_SCHEMA_BASE.sql`, `RLS_POLICIES.sql`) |
| File aperti | **69** (100% disco; 100% perimetro md) |
| File illeggibili / saltati | **0** (1 file md vuoto: `API_SPEC_AUTH_v1.md` — aperto, dichiarato placeholder) |
| High-signal (decisioni/agency/lezioni) | ~24 |
| Solo-contatto / eco / tecnici lunghi | ~45 |

**Per cartella (conteggio disco):**

| Cartella | File |
|----------|------|
| `2025-10-20/` | 3 |
| `2025-10-21/` | 9 |
| `Agente_2_2025-10-20/` | 38 |
| `Agente_3_2025-10-20/` | 10 |
| `Agente_3_2025-10-21/` | 7 |
| `Agente_4_2025-10-21/` | 1 |
| `Neo_2025-10-20/` | 1 |

**Date interne (non mtime):** cluster planning **20–21 ott 2025**; cluster revisioni/implementazione dichiarato **26–27 gen 2025** (e Neo cita 27-01 dentro checklist 20-10) — cronologia **non affidabile** come unica timeline.

---

## Sezione 6 — Lacune e handoff

- **`richiesta_utente_login-hardening.md`** (e Checklist_v0) sono **referenziate** nei Brief/Prompt ma **non** stanno in `Sessions_Old/` — copie in `docs/Archives/2025-10-20/` → **C5** (e/o Archivi C2). Serve per M-VOCE vera sulla richiesta iniziale.
- **Transcript** di queste sessioni non sono qui → **H4/H5** (o corpus preistoria) per verificare se Owner ha davvero firmato i gate.
- Duplicati blindaggio `2025-10-21/` ≈ eco Agente 2 → non ri-minare in C2/C4 come decisioni nuove senza confronto path.
- Peer-review densa (falsi positivi, scope creep, deploy bugiardo) → materiale forte per **S2** (agency) e **S3** (punto zero curva: metodo = 7 agenti + gate, non skill system attuale).
- Lezioni formalizzate in regole Cursor → **C5** (`LEZIONI_APPRESE`, `cursor-rules-cleanup`).
- Nessuna menzione del vocabolario attuale («lavoro ok», «prepara», skill d’area) — conferma: **prima del metodo CB-v2**.

---

## Sezione 7 — Chiusura verso Matteo

- Qui vedi te stesso all’inizio: non «comandi corti», ma un **sistema a 7 agenti** (prodotto → sistemi → UX → codice → test → sicurezza) con brief, checklist e «conferma umana» per sbloccare il lavoro.
- Hai già fissato a mano pezzi importanti (limiti tentativi login, password, «ricordami» spento, metriche UX), ma nei documenti il tuo nome quasi non compare: firmi come Owner — e in un gate la «firma utente» l’ha messa un agente al posto tuo.
- Il pezzo più utile per la curva di crescita: gli agenti **si correggevano tra loro** (test verdi falsi, deploy dichiarato con app spenta, piano di test troppo grosso). È il punto di partenza rispetto al Matteo di oggi che taglia il collaudo e chiede prove vere.
