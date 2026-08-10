# Prompt — SEP-11 post-F4 · reasoning + plan (quadro generale → strategia H-1.3/L5)

> **Uso:** nuova chat Agent · profilo Meta · modalità **standard** (alzabile a deep se il quadro lo richiede).
> **NON è esecuzione track L5.** Prima ragionare e pianificare; scrivere codice/git add L5 solo se Matteo lo autorizza **dopo** il piano.
> **Fonte:** chiusura F4-doc `033` + `FU-SEP-11-H13-L5` · owner `MASTERPLAN_V0.md` §6 · `HANDOFF_SENIOR_V0.md`.
> **SEP-G5 non PASS.** H-1.3 resta FAIL finché review dedicata. Push solo con Sì. Commit solo con «lavoro ok»/«fai report finale».

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Meta (SEP-11 post-F4 — reasoning + plan; quadro generale prima della strategia)
Modalità: standard (alzabile a deep; mai abbassare)
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md; docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/MetaSkillSystem/archive/README.md; docs/FOLLOW_UP.md (FU-SEP-11-H13-L5 · FU-SEP-5-FREEZE); docs/Sessioni di lavoro/10-08-26/Report-sep-11-f4-doc-track-sessioni-10-08-26.md; docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md (verdetto H-1.3); docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md (§6 F4/F5 + D2/D4); docs/Comunicazione-Skill/VOCABOLARIO.md (voce «ragioniamo» se Matteo la usa)
Prove obbligatorie: foto Git; elenco stash se presente; classificazione WT; **nessun** `git add` L5 senza mandato post-piano; validate:mss sul report se/quando scritto
Mandato Matteo: UNA seduta di **reasoning + plan**. Prima ricostruire il **quadro generale** MSS/SEP; solo dopo progettare strategia. Output = piano con opzioni Sì/No per Matteo. **Non** fingere sanatoria H-1.3. **Non** dichiarare SEP-G5 PASS. **Non** aprire WP-1 / Valutazione Personale / F5 path-rewrite di default.
Non caricare: docs/_lavoro/** (contenuti); src/; esecuzione F5; rewrite stato PLAN_V0; claim G5 PASS / H-1.3 sanato
Output attesi (in ordine):
  1) F0 foto Git + stato stash (L5 può essere in stash da chiusura F4)
  2) **Quadro generale** (tabella — obbligatorio prima di qualsiasi strategia)
  3) Tensioni / rischi aperti (max 7) con owner e cosa **non** è dimostrato
  4) Opzioni strategiche confrontabili (almeno 3) con costi/rischi/STOP
  5) Domande Sì/No a Matteo (batch ≤5) — **fermati qui** finché non sceglie
  6) Solo dopo le scelte: piano atomico della prossima esecuzione (passi, freeze, prove, handoff)
  7) Report fase + capsula se Matteo dice «lavoro ok»; commit/push solo con mandato
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Capire **dove siamo** nel MetaSkillSystem / Senior Eval Pack **prima** di decidere come affrontare
H-1.3 e l’eventuale track L5. Consegnare un piano con alternative chiare, non una corsa al
`git add` delle fixture.

════════════════════════════════════════
QUADRO DA NON PERDERE (ancoraggio — verifica e aggiorna in chat)
════════════════════════════════════════

- Branch tipico: `env/test`. Post F4-doc (`033`) commit+push fatti in chiusura report finale.
- Solidi chiusi (non riaprire): SEP-10 · F1–F3+stub · review ADEGUATO · D1–D5 · G1-con-riserve ·
  go/no-go superseded · **F4-doc** (report Sessioni whitelist tracked).
- Gate: `SEP-G1` = PASS_CON_RISERVE · **`SEP-G5` non PASS** · H-1.3 review = **FAIL** (report
  `Report-revisione-indipendente-h1-3-…`) — remediation/review dedicate; track L5 ≠ sanatoria.
- Freeze: L5 (fixtures/tests/scripts/mss/matrix/`package.json` script) · L6 (`_lavoro`).
- Stub D5 REPORT_001 attivo; PLAN_V0 leave-as-history.
- Due owner: pack → `MASTERPLAN_V0` · SYS-1 → `PLAN_V0` (non sanare H-1.3 nel pack).
- Backlog dedicati vivi: (1) ~~F4-doc~~ · (2) **questa corsia reasoning→poi H-1.3/L5** ·
  (3) SEP-5 freeze (bloccato).
- Possibile stash locale dalla chiusura F4: rumore + L5 untracked messi da parte per WT pulito —
  **non** perdere; documenta `git stash list` e come ripristinare.

════════════════════════════════════════
FASE A — QUADRO GENERALE (obbligatoria, prima)
════════════════════════════════════════

Costruisci una tabella «vero adesso» con almeno:

| Dimensione | Domanda guida |
|---|---|
| Owner / stato | Cosa dice MASTERPLAN vs HANDOFF vs PLAN_V0 (divergenze?) |
| SEP-11 | Cosa è fatto (F1–F4-doc) vs cosa resta (L5, F5?, G5) |
| H-1.x | Cosa ha fallito H-1.3; cosa richiederebbe remediation vs solo track |
| Disco ≠ git | Cosa resta untracked/stashed (L5) e perché D2/D4 lo trattano a parte |
| Gate | Cosa sblocca G5 e cosa **non** lo sblocca (F4 ≠ cutover; track ≠ PASS) |
| Rischio | Cosa romperebbe prove, privacy L6, o due «prossimi» vivi |
| Persona vs sistema | Quali decisioni restano di Matteo vs cosa può solo allineare l’agente |

Regola: **nessuna proposta di `git add` / remediation / move** finché questa tabella non è in chat
e Matteo non ha visto le tensioni.

════════════════════════════════════════
FASE B — REASONING (dopo quadro)
════════════════════════════════════════

Rispondi esplicitamente (fatto / inferenza / proposta separati):

1. Track L5 path-invariati risolve quale problema (disco≠git) e **quale non risolve** (verdetto H-1.3)?
2. Remediation H-1.3 e track L5 sono la stessa sessione o due atomi? Perché?
3. F5 path-rewrite è in scope di default? (default prompt: **no**)
4. SEP-5 / WP-1 / G5: quali sono tentazioni fuori mandato in questa chat?
5. Se il WT ha L5 in stash: pop subito vs lasciare stash fino a mandato di esecuzione?

════════════════════════════════════════
FASE C — OPZIONI STRATEGICHE (almeno 3)
════════════════════════════════════════

Esempi minimi (adattali ai fatti F0, non copiare a vuoto):

- **(S1)** Solo piano + prompt esecuzione H-1.3/L5-track (path invariati); zero git add ora.
- **(S2)** Track L5 path-invariati in chat dedicata successiva; H-1.3 resta FAIL dichiarato.
- **(S3)** Prima remediation/review H-1.3 (senza track o con track separato dopo).
- **(S4)** Stop / pausa pack; altro debito (SEP-D08, SEP-5) — solo se Matteo lo chiede.
- **(S5)** Altro che emerge dal quadro (dichiarato).

Per ciascuna: beneficio · costo · STOP · prova di chiusura.

Poi **una** domanda batch ≤5 Sì/No a Matteo. Fermati.

════════════════════════════════════════
FASE D — PIANO ESECUZIONE (solo dopo scelte Matteo)
════════════════════════════════════════

- Passi atomici numerati; freeze L5/L6 rispettati o esplicitamente aperti.
- Whitelist path se track; prova «H-1.3 non sanato» nel report.
- Criterio di fatto; handoff; FU da aggiornare.
- Prompt pronto per chat di esecuzione **solo se** Matteo sceglie un’opzione che lo richiede.

════════════════════════════════════════
STOP
════════════════════════════════════════

Esecuzione L5 senza piano approvato; path-rewrite/F5 di default; move; `_lavoro`; PLAN rewrite
stato; G5 PASS; H-1.3 sanato; WP-1; due prossimi vivi; push senza Sì.

Chiusura verso Matteo (max 5): quadro in 1 frase · tensioni top · opzione raccomandata (come
proposta) · cosa NON fare · prossimo atomo dopo le sue Sì/No.
