# Prompt — H-1.3 review indipendente (post-remediation R01–R05)

> **Uso:** nuova chat Agent · profilo **Verifica senior indipendente** · modalità **deep**.
> **NON è** remediation. **NON è** writer della chat precedente. **NON** fidarti del riepilogo remediation.
> **Fonte verdetto precedente:** `Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md` = **FAIL**.
> **Fonte remediation (da verificare, non da accettare):** `Report-remediation-h13-r01-r05-metaskillsystem-10-08-26.md`.
> Commit/push solo se Matteo lo chiede dopo. WP-1 vietato. G5 PASS vietato. `_lavoro` vietato.

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Verifica senior indipendente (H-1.3 post-remediation — NON writer)
Modalità: deep (alzabile; mai abbassare)
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (amendment append-only / previous / field_path); docs/MetaSkillSystem/PLAN_V0.md (solo H-1 / gate / enforcement — leave-as-history su stale); docs/Testing-Skill/TESTING_SKILL.md (§ prove / anti “verde fuorviante”); docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md (findings R01–R05 + riproduzioni §4); docs/Sessioni di lavoro/10-08-26/Report-remediation-h13-r01-r05-metaskillsystem-10-08-26.md (claim writer — da falsificare); docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json; docs/FOLLOW_UP.md (FU-SEP-11-H13-L5); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md; docs/Comunicazione-Skill/VOCABOLARIO.md
Prove obbligatorie: F0 foto Git; riprodurre **di nuovo** le tre controprove della review (§4.1 historicalWrong + missing/malformed path; §4.3 staged atomico CLI); `npm run test:mss`; `node --check` su moduli owned; ESLint Node mirato su `git-adapter.mjs` se presente; confronto requisito→implementazione→prova **senza** correggere codice; **verdetto unico** PASS o FAIL
Mandato Matteo: UNA seduta di **revisione fredda indipendente** sul motore MSS **dopo** remediation R01–R05. Non implementare fix. Non aprire WP-1. Non dichiarare G5 PASS. Suite verde **non** implica automaticamente PASS: devono chiudersi i finding HIGH e le controprove avversariali. Se trovi HIGH/blocker nuovi o residui → FAIL + remediation separata. Se tutto tiene → PASS con eventuali riserve esplicite; WP-1 resta decisione successiva di Matteo.
Non caricare: docs/_lavoro/** (contenuti); src/ app; F5 relocate; SEP-5 freeze; Valutazione Personale; rewrite PLAN_V0 stato; fix nello stesso passaggio; stash pop; commit rumore Comunicazione
Output attesi (in ordine):
  1) F0 foto Git (branch/HEAD/status) — sola lettura
  2) Perimetro owned letto (core/cli/adapter/git-adapter/rules + suite/matrice/hook se rilevanti) — **senza** modificare
  3) Controprove indipendenti: R01 storico previous; R02 field_path; R03 CLI staged atomico (come review originale)
  4) Matrice requisito → implementazione → prova (PASS/FAIL per riga)
  5) Findings ordinati per severità (anche “nessuno” se davvero chiusi)
  6) Gate: `npm run test:mss` + controprove + check sintassi; documentare verde vs verdetto
  7) Verdetto unico: **PASS** | **PASS_CON_RISERVE** | **FAIL** — e go/no-go WP-1
  8) Report nuovo in `docs/Sessioni di lavoro/10-08-26/` + capsula; allineo narrativo FU solo se Matteo lo chiede in chiusura
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Decidere, con prove riproducibili e senza fiducia nel report writer, se H-1.3 è pronta
dopo la remediation — oppure se resta FAIL.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Branch tipico: `env/test`. Remediation writer ha ripristinato whitelist L5 + **2 hook**
  (`fine-sessione-commit-check.mjs`, `fine-sessione-nudge.mjs`) **senza** stash pop e **senza**
  Comunicazione. Stash può essere ancora presente: non popparlo.
- Claim writer: R01–R05 chiusi; `npm run test:mss` verde (41 fixture + 32 gruppi) **dopo** hook.
  Tu **non** trasformi questo in PASS: rifai le controprove.
- Solidi chiusi (non riaprire): SEP-10 · F1–F4-doc · G1 PASS_CON_RISERVE · D1–D5.
- Gate: **SEP-G5 non PASS** · WP-1 non iniziato · F5 path-rewrite fuori.
- Due owner: pack ≠ SYS-1; un PASS H-1.3 **non** sana il pack e **non** apre WP-1 da solo.

════════════════════════════════════════
CRITERI DI VERDETTO
════════════════════════════════════════

**FAIL** se almeno uno:
- R01 o R02 ancora fail-open sulle riproduzioni §4.1
- R03 CLI staged ancora diverge dallo snapshot completo su stage atomico
- HIGH/blocker nuovo sul contratto amendment / staged / parità superfici
- suite ufficiale usata come unica prova senza controprove avversariali

**PASS** solo se:
- controprove R01/R02/R03 tengono (deny attesi; no fail-open)
- regressioni permanenti presenti e verdi
- nessun HIGH residuo sul perimetro H-1.3
- report dice esplicitamente cosa resta bypass (E2 locale, `--no-verify`, CI, ecc.)

**PASS_CON_RISERVE** solo se i HIGH sono chiusi ma restano MEDIUM/LOW onesti e nominati.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Dichiarati revisore indipendente; non correggere.
2. F0 sola lettura.
3. Rileggere findings R01–R05 della review FAIL e il report remediation come **ipotesi**, non verità.
4. Rieseguire controprove; poi suite ufficiale.
5. Scrivere report nuovo con verdetto unico.
6. Dichiarare prossimo atomo (remediation ulteriore **oppure** decisione Matteo su track/commit/WP-1) **senza** eseguirlo.

Criterio di fatto
- Prove nel report, non solo “suite verde”
- Zero fix in questa chat
- H-1.3 non si “sana” nel pack

Prossimo atomo (dichiarare in chiusura, non eseguire)
- Se FAIL → remediation mirata nuova
- Se PASS/PASS_CON_RISERVE → decisione Matteo (track L5 / commit / eventuale WP-1) in chat dedicata

════════════════════════════════════════
STOP
════════════════════════════════════════

Fix codice; stash pop; claim G5 PASS; aprire WP-1; `_lavoro`; fiducia cieca nel report remediation;
riscrittura frozen fixture; review e fix nella stessa seduta.
