# Prompt — SEP-11 post-F3 · review breve (prove move/stub/link)

> **Uso:** nuova chat Agent · profilo Verifica (o Meta review) · standard (alzabile a deep).
> **Fonte stato:** `Report-sep-11-f3-move-report001-10-08-26.md` (`028`) + HANDOFF + MASTERPLAN.
> **Git atteso:** `env/test` · HEAD con commit F3 (`docs(mss): SEP-11 F3…`) · ahead N · **push no** salvo nuovo ordine.
> **SEP-G5 non PASS** anche se la review è ADEGUATO.

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Verifica (SEP-11 post-F3 — review breve prove M03)
Modalità: standard
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md; docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/MetaSkillSystem/archive/README.md; docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md; docs/Comunicazione-Skill/VOCABOLARIO.md
Prove obbligatorie: docs/Sessioni di lavoro/10-08-26/Report-sep-11-f3-move-report001-10-08-26.md; Addendum-M03 (inventario pre-F3); stub + path nuovo REPORT_001
Mandato Matteo: SOLO review breve F3. Push NON autorizzato. SEP-G5 NON PASS. Nessun altro move. Nessun F4/L5/H-1.3.
Non caricare: Valutazione Personale; src/; touch L5 fixtures/scripts/mss/tests/h1/COVERAGE_MATRIX; rewrite stato PLAN_V0; sanatoria H-1.3; WP-1; SEP-5; claim SEP-G5 PASS; esecuzione F4
Output attesi:
  1) F0: foto Git (branch, HEAD, ahead, cosa staged/untracked; freeze L5/L6)
  2) Checklist prove F3: path nuovo esiste; stub D5 completo (path/data/TTL/`rg` zero); L1 skill + L2 CATALOGO → path nuovo; PLAN_V0 senza rewrite stato (leave-as-history)
  3) Spot-check `rg` REPORT_001 (escludi `_lavoro`): niente link morti operativi; H* storia ok
  4) Verdetto breve: ADEGUATO | ADEGUATO_CON_RISERVE | NON_ADEGUATO (+ finding se serve)
  5) Allineo owner solo se i fatti divergevano (MASTERPLAN/HANDOFF/archive README) — altrimenti conferma allineo
  6) Report review + SESSION_LOG + capsula; validate:mss; git diff --check
  7) Opz. stage report review (no commit senza mandato; no push)
Niente output in più senza Sì/No.
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Controllare che F3 (M03) sia davvero riuscito: file sotto archive/osservazioni, stub vivo, skill+catalogo ok, PLAN intatto come stato. Una review sola. Non migrare altro. Non dichiarare SEP-G5 PASS.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Owner pack = MASTERPLAN; owner SYS-1 = PLAN_V0 (non toccare stato).
- Onda: SEP-10 chiusa → F1+F2 → B2-F01 → mandato `027` → **F3 eseguito `028`** → **ora review breve**.
- Freeze L5/L6 ancora attivi.
- G1-R1 Cursor-only: self_report + validate ammessi; non fingere review multi-modello.
- Dopo review: stop o decisione Matteo (push / F4 / altro) — NON auto-aprire F4.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Leggi HANDOFF + MASTERPLAN; confronta con report `028`.
2. Foto Git. Se F3 non è in HEAD (o non staged coerente), segnala e STOP se manca prova di esecuzione.
3. Verifica path nuovo + stub (apri stub: path/data/TTL/criterio).
4. Apri L1 skill + L2 CATALOGO: devono citare `archive/osservazioni/…`.
5. `git diff` / assenza diff su `PLAN_V0` come rewrite stato.
6. `rg` mirato; confronta con Addendum-M03 (superficie L1/L2 aggiornata; L3 storia; H* non patchati).
7. Scrivi verdetto + report; aggiorna HANDOFF (vista) e SESSION_LOG; MASTERPLAN solo se stato/gate davvero cambia (di solito no).
8. No push; no F4; no G5 PASS.

Criterio di fatto
- Prove F3 riproducibili
- Verdetto attribuito
- G5 non PASS
- Freeze rispettati

Chiusura verso Matteo (max 5, semplice):
- verdetto in una riga
- eventuali riserve
- conferma dove sta il file / stub
- PLAN intatto?
- prossimo (stop / tua decisione; no push)

STOP: F4; altri move; L5; `_lavoro`; PLAN rewrite stato; H-1.3; WP-1; SEP-5; SEP-G5 PASS; push.
