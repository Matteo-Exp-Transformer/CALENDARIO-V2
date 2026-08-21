# Prompt — Plan directory / export / sandbox MSS (zero move) · post baseline H-1.3

> **Uso:** nuova chat Agent · profilo Meta · modalità **deep** (plan only).
> **NON è** esecuzione F5 / move / mkdir di albero target / copia massiva.
> **Fonte decisione Matteo:** ordine post PASS_CON_RISERVE — (1) ~~track/commit L5~~ fatto
> `ee0ab39` · (2) **questa chat = solo plan** · (3) F5 exec solo dopo plan approvato.
> **Owner pack:** `MASTERPLAN_V0.md` §6 · **SYS-1:** `PLAN_V0.md` (no WP-1).
> **G5 non PASS.** WP-1 NO-GO. H-1.3 = PASS_CON_RISERVE (riserva H13-POST-L01).
> Commit solo con «lavoro ok»/«fai report finale». Push solo con Sì.

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Meta (plan directory/export/sandbox MSS — zero move; zero F5 exec)
Modalità: deep (alzabile; mai abbassare)
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/PLAN_V0.md (owner SYS-1 / livelli; leave-as-history su stale non rilevanti); docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md; docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/MetaSkillSystem/archive/README.md (L1–L6 + policy); docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md (§4 layout · §5 matrice · §6 F5+); docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B2-review-piano-migrazione.md (riserve utili); docs/Sessioni di lavoro/10-08-26/Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md; docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h13-post-remediation-10-08-26.md (PASS_CON_RISERVE + bypass); docs/Sessioni di lavoro/21-08-26/Report-chiusura-documentale-preparazione-036-21-08-26.md; docs/FOLLOW_UP.md (FU-SEP-11-H13-L5 · FU-SEP-11-DIR-PLAN); docs/Comunicazione-Skill/VOCABOLARIO.md (voce «ragioniamo» se usata); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md
Prove obbligatorie: foto Git (`ee0ab39` è la baseline tecnica H-1.3; HEAD può includere una successiva chiusura solo documentale); inventario FS read-only di `docs/MetaSkillSystem/**` + `scripts/mss/**`; elenco freeze L5/L6; **nessun** `mkdir`/`mv`/`git mv`/`cp -r` di albero target; validate:mss sul report di plan se con capsula
Mandato Matteo: UNA seduta di **pianificazione**. Progettare directory MSS **intelligente, scalabile, predisposta a criteri MSS completi**, con (A) albero target, (B) regole export, (C) punto di ripristino + sandbox/replica per testare lo skill system senza rompere il live. Output = piano + opzioni Sì/No + (se Matteo sceglie) prompt exec F5/sandbox **dichiarato non eseguito**. **Zero move** in questa chat.
Non caricare: docs/_lavoro/** (contenuti Valutazione); src/; WP-1; SEP-5 freeze; esecuzione path-rewrite; claim G5 PASS; claim H-1.3 PASS pulito; stash drop
Output attesi (in ordine):
  1) F0 foto Git + conferma baseline H-1.3 tracked (L5 in git)
  2) Quadro «vero adesso» L1–L6 (cosa già esiste vs cosa manca) — tabella
  3) Requisiti del design (scalabilità, owner unici, progressive disclosure, export, privacy L6, prove L5 path-coupled)
  4) Proposta albero target (testuale/mermaid) **senza** crearlo su disco
  5) Piano export (cosa entra nel pacchetto esportabile; cosa resta fuori; formato)
  6) Piano ripristino + sandbox/replica (git worktree vs mirror cartella vs branch isolato — confronta ≥2 opzioni con costi/STOP)
  7) Gap vs B1/F5: cosa di B1 resta valido; cosa cambia post H-1.3 PASS_CON_RISERVE; ordine fasi atomiche proposte
  8) Domande Sì/No a Matteo (batch ≤5) — **fermati** finché non sceglie
  9) Solo dopo scelte: prompt pronto per chat di esecuzione (F5 slice o sandbox create-only) **non eseguito qui**
  10) Report plan + capsula; allineo FU/HANDOFF/MASTERPLAN narrativi
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Capire **come deve essere costruita** la casa del MetaSkillSystem (cartelle + export + copia di
prova/ripristino) **prima** di spostare o duplicare nulla. Evitare che ogni nuovo documento costi
un move futuro non pianificato.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Branch: `env/test`. Baseline tecnica: `ee0ab39` (H-1.3 L5+hooks tracked); non confonderla con un eventuale HEAD successivo contenente soltanto la chiusura documentale `037`.
- H-1.3 = **PASS_CON_RISERVE** (H13-POST-L01). Suite `test:mss` era verde al track. Bypass E2/`--no-verify`/no-CI restano.
- SEP-10 B1/B2 già hanno layout logico + matrice M01–M11 + F5 = path-rewrite L5 (M08) — **riusa, non reinventare da zero**; aggiorna al fatto che L5 è **in git** e H-1.3 non è più FAIL.
- Già fatto: F1–F3 (archive shell + REPORT_001 move+stub) · F4-doc · track L5.
- **Non** fatto: F5 path-rewrite; albero “completo” oltre shell; sandbox/replica dedicata; export pack.
- Freeze L6: `_lavoro` intangibile — solo puntatore.
- L4 report Sessioni: restano nelle date-folder (D3) salvo decisione nuova esplicita.
- Due owner: pack ≠ SYS-1. Plan directory **non** apre WP-1 e **non** dichiara G5 PASS.

════════════════════════════════════════
COSA DEVE SODDISFARE IL PLAN (criteri)
════════════════════════════════════════

1. **Owner unici** — nessun doppio stato (gate solo in PLAN/MASTERPLAN).
2. **Progressive disclosure** — ingresso 2–4 file; niente “apri tutta la tree”.
3. **L1–L6 coerenti** con `archive/README.md` (aggiorna se proponi cambi — come proposta, non edit live salvo allineo narrativo post-approvazione).
4. **Export** — elenco path includibili / esclusi (L6 out; segreti out; fixture frozen in/out consapevole).
5. **Ripristino** — come tornare a `ee0ab39` (o tag proposto) se un esperimento rompe.
6. **Sandbox** — dove testare validator/skill **senza** contaminare il live; prove di isolamento.
7. **L5 path-coupled** — ogni proposta di relocate richiede fase rewrite costanti + `test:mss` verde; non nasconderlo.
8. **Tracce errori** — FAIL storici e report restano; niente “pulizia” che cancella provenienza.

════════════════════════════════════════
OPZIONI SANDBOX (esempi minimi da adattare ai fatti F0)
════════════════════════════════════════

- **(A)** Git worktree dedicato su branch `mss/sandbox-*` (stesso repo, WT isolato)
- **(B)** Mirror/export cartella fuori repo o sotto `docs/MetaSkillSystem/_sandbox/` gitignored
- **(C)** Solo tag/release + istruzioni restore (`git switch -c` / `git restore`) senza seconda copia

Per ciascuna: beneficio · costo · rischio privacy · STOP · prova di chiusura.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. F0 + inventario read-only (non modificare tree oltre report/allineo narrativo a fine plan).
2. Quadro L1–L6 + gap.
3. Design albero + export + sandbox con alternative.
4. Mappa fasi atomiche post-plan (create-only shell extra? rewrite L5? sandbox first?).
5. Batch Sì/No ≤5 a Matteo — STOP.
6. Dopo risposte: prompt exec + report plan.

Criterio di fatto
- Piano leggibile da Matteo senza aprire `src/`
- Zero move/mkdir target eseguiti
- Prossimo atomo exec solo se scelto e prompt pronto
- G5/WP-1 non dichiarati PASS/aperti

════════════════════════════════════════
STOP
════════════════════════════════════════

`git mv` / move / copy tree target; touch L6 contenuti; WP-1; SEP-5; G5 PASS; F5 exec;
riscrittura frozen fixture; stash drop; claim H-1.3 PASS pulito; due prossimi vivi.

Chiusura verso Matteo (max 5): quadro 1 frase · tensione top · opzione raccomandata · cosa NON fare ·
prossimo atomo dopo Sì/No.
