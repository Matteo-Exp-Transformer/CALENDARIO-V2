# Prompt — SEP-11 F3 (move REPORT_001 + stub) — pronto da incollare

> **Uso:** nuova chat Agent · profilo Meta · deep.
> **Mandato Matteo 10-08-2026:** commit remediation B2-F01 + proseguire con F3 (questo prompt).
> **Fonte go/no-go:** `Report-go-nogo-b2-f01-e-mandato-f3-10-08-26.md` (`027`).
> **Checklist link:** `SEP-10-archiviazione/Addendum-M03-link-REPORT_001-B2-F01-10-08-26.md`.
> **Non push** salvo nuovo ordine. **SEP-G5 non PASS** anche se F3 riesce.

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Meta (SEP-11 F3 — prima prova move REPORT_001 + stub)
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md; docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md; docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md; docs/Comunicazione-Skill/VOCABOLARIO.md
Checklist link obbligatoria: docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Addendum-M03-link-REPORT_001-B2-F01-10-08-26.md
Fonti piano: Report-B1 §5 M03 + §6 F3; Report-B2 (STOP pre-remediation già sanato in 026); archive/README (TTL D5 + policy PLAN)
Go/no-go: docs/Sessioni di lavoro/10-08-26/Report-go-nogo-b2-f01-e-mandato-f3-10-08-26.md
Mandato Matteo: F3 AUTORIZZATO in questa chat (unica fase). Push NON autorizzato. SEP-G5 NON PASS.
Non caricare: Valutazione Personale; src/; touch L5 fixtures/scripts/mss/tests/h1/COVERAGE_MATRIX; rewrite stato PLAN_V0; sanatoria H-1.3; WP-1; SEP-5; altri move oltre M03; claim SEP-G5 PASS
Output attesi:
  1) F0: foto Git + conferma HEAD post-commit remediation; freeze L5/L6
  2) Pre-check: `rg` REPORT_001 allineato ad Addendum-M03; REPORT_001 ancora al path originale
  3) F3 M03: `git mv` (o equivalente tracciato) di REPORT_001 → docs/MetaSkillSystem/archive/osservazioni/REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md (+ crea cartella osservazioni se manca)
  4) Stub al path vecchio: file redirect corto con path nuovo + data + TTL 30gg + criterio rimozione `rg` zero (D5); NON lasciare link morti
  5) Update link vivi L1+L2: METASKILL_SYSTEM_SKILL.md + CATALOGO_SEDUTE_E_METODI_V0.md → path nuovo (o restano validi via stub se scegli stub-first — preferisci update esplicito al path nuovo + stub per compatibilità)
  6) PLAN_V0: LEAVE-AS-HISTORY (nessun rewrite stato SYS-1; nessuna riga gate/WP)
  7) Narrativa N1–N3: MASTERPLAN (F3 eseguito; G5 non PASS), HANDOFF, archive/README (stub attivo)
  8) Report fase + SESSION_LOG + capsula; validate:mss; git diff --check; `rg` post-move
  9) Opz. stage F3 (no commit senza «fai report finale»; no push)
Niente output in più senza Sì/No.
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Eseguire SOLO la fase F3 (M03): spostare REPORT_001 sotto archive/osservazioni, creare stub al path vecchio, aggiornare i due link operativi (skill + catalogo), lasciare PLAN_V0 come storia. Una fase sola. Non cutover. Non SEP-G5 PASS.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Owner pack SEP = MASTERPLAN; owner SYS-1 = PLAN_V0 (non toccare stato).
- Onda: SEP-10 analisi chiusa → SEP-11 F1+F2 create-only fatti → B2-F01 inventario fatto → **ora F3**.
- Freeze: L5 path-coupled e L6 `_lavoro` fuori perimetro.
- Indipendenza soft (G1-R1 Cursor-only): self_report + validate ammessi; non fingere review multi-modello.
- Dopo F3 il prossimo naturale è stop o review breve F3 — NON F4/F5, NON H-1.3.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Leggi HANDOFF + MASTERPLAN; conferma mandato F3 da report 027 / questo prompt.
2. Foto Git. Se remediation 026/027 non è in HEAD, STOP e chiedi.
3. Rileggi Addendum-M03; riesegui `rg` (escludi `_lavoro`).
4. Crea `archive/osservazioni/` se assente; move REPORT_001; scrivi stub al path root MetaSkillSystem.
5. Aggiorna L1 skill + L2 CATALOGO al path nuovo; PLAN leave-as-history.
6. Aggiorna MASTERPLAN (F3 fatto nel disegno fase; G5 non PASS; prossimo = review/stop), HANDOFF ultimo, archive README, SESSION_LOG, eventuale riga indice MSS se utile (REPORT_001 non è report seduta — non forzare).
7. Controlli: path nuovo esiste; stub esiste; `rg` sui path; validate:mss report; diff-check; freeze L5/L6.
8. Rollback documentato: reverse move + drop stub + reverse L1/L2 (e N* se aggiornati).
9. No commit/push senza mandato Matteo.

Criterio di fatto
- REPORT_001 vive sotto archive/osservazioni
- Stub al path vecchio con TTL D5
- Skill + CATALOGO non puntano a path morto
- PLAN_V0 non riscritto come stato
- Report + capsula OK; SEP-G5 non PASS

Chiusura verso Matteo (max 5, semplice):
- dove si trova ora il file
- cosa fa lo stub
- cosa hai aggiornato (skill/catalogo)
- conferma PLAN non toccato come stato
- prossimo (review/stop; no push)

STOP: altri move; L5; `_lavoro`; PLAN rewrite stato; H-1.3; WP-1; SEP-5; SEP-G5 PASS; push; commit senza «fai report finale».
