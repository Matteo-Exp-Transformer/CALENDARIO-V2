# Prompt — SEP-11 F4-doc (track report Sessioni MSS) — pronto da incollare

> **Uso:** nuova chat Agent · profilo Meta · standard (alzabile a deep).
> **Fonte pulizia:** `Report-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md` (`032`).
> **Owner:** `MASTERPLAN_V0.md` §6 · `HANDOFF_SENIOR_V0.md`.
> **B1:** §6 riga F4 = track, **no path change**; STOP claim H-1.3 sanato.
> **SEP-G5 non PASS**. Push solo se Matteo dice Sì in chat. Commit solo con «lavoro ok»/«fai report finale».

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Meta (SEP-11 F4-doc — track report Sessioni MSS untracked)
Modalità: standard
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md; docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/MetaSkillSystem/archive/README.md; docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md; docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md (§6 F4); docs/Sessioni di lavoro/10-08-26/Report-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md; docs/FOLLOW_UP.md (FU-SEP-11-F4-DOC); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md; docs/Comunicazione-Skill/VOCABOLARIO.md
Prove obbligatorie: foto Git; whitelist sotto; freeze L5/L6; validate:mss sui report nuovi se con capsula; git diff --check
Mandato Matteo: UNA fase F4-doc. Track in git i report Sessioni MSS ancora untracked. **Nessun** path change. **Nessun** touch L5. **Nessuna** sanatoria H-1.3. SEP-G5 NON PASS. Push SOLO con Sì esplicito.
Non caricare: Valutazione Personale (contenuto `_lavoro`); src/; F4-L5-track; F5 path-rewrite; rewrite stato PLAN_V0; WP-1; SEP-5; esecuzione move; claim G5 PASS / H-1.3 sanato
Output attesi:
  1) F0 foto Git (HEAD, ahead, staged, WT classificato: F4-doc vs L5 vs rumore)
  2) Inventario whitelist: per ogni path — esiste? already tracked? in/out scope?
  3) Se docs `032` (MASTERPLAN/HANDOFF/report pulizia/prompt) sono ancora uncommitted: **una** domanda Sì/No a Matteo — (A) includerli nello stesso commit F4-doc · (B) lasciarli fuori (commit cleanup solo con «fai report finale» separato)
  4) `git add` SOLO whitelist F4-doc (+ eventuale slice A se Matteo sceglie A); **mai** L5/hooks/package.json/contratto
  5) Append righe mancanti in `archive/indices/MSS-REPORT-INDEX.md` (puntatori; no move)
  6) Allineo MASTERPLAN (F4-doc fatto/parziale; prossimo = H-1.3/L5 o stop) + HANDOFF + SESSION_LOG + FU-SEP-11-F4-DOC
  7) Report fase + capsula; validate:mss; diff-check
  8) Commit SOLO con «lavoro ok»/«fai report finale»; push SOLO con Sì
Niente output in più senza Sì/No su (A)/(B) se applicabile.
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Portare in git i report Sessioni MSS ancora untracked, senza spostare file e senza toccare le prove L5. Una fase sola. Non cutover. Non SEP-G5 PASS.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Branch tipico: `env/test`. Dopo `032`: push remoto fatto; HEAD tipico `4a66cc4` (+ eventuali commit locali post-pulizia).
- Solidi chiusi (non riaprire): SEP-10 · F1–F3+stub · review ADEGUATO · D1–D5 · G1-con-riserve · go/no-go superseded.
- Prossimo dopo F4-doc: corsia dedicata **H-1.3 / F4-L5-track** (path invariati; H-1.3 resta FAIL) — **non** eseguirla qui.
- Freeze L5: `fixtures/v0.1/**`, `tests/h1/**`, `scripts/mss/**`, `COVERAGE_MATRIX_H1.json`, `package.json` (script mss).
- Freeze L6: `docs/_lavoro/**` — non aprire contenuti Valutazione.
- Stub D5 REPORT_001 attivo; PLAN leave-as-history.

════════════════════════════════════════
WHITELIST F4-doc (candidati — verificare in chat)
════════════════════════════════════════

**In scope (MSS / H-1 / CFG report Sessioni — track only):**

09-08-26:
- `docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md`
- `docs/Sessioni di lavoro/09-08-26/Report-lettura-idiografica-capsula-mss-09-08-26.md`
- `docs/Sessioni di lavoro/09-08-26/Report-prepara-prompt-fantasticazione-elicitation-v2-09-08-26.md`
- `docs/Sessioni di lavoro/09-08-26/Report-fantasticazione-cfg01-reazione-09-08-26.md`
- `docs/Sessioni di lavoro/09-08-26/Report-collaudo-cieco-valutazione-seduta5-09-08-26.md` (report seduta; **non** copiare `_lavoro`)

10-08-26:
- `docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md`
- `docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md`
- `docs/Sessioni di lavoro/10-08-26/Report-proseguimento-cfg01-fantasticazione-10-08-26.md`
- `docs/Sessioni di lavoro/10-08-26/Report-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md` (se ancora untracked)
- `docs/Sessioni di lavoro/10-08-26/Prompt-sep-11-f4-doc-track-sessioni-10-08-26.md` (questo file, se untracked)
- `docs/Sessioni di lavoro/10-08-26/Prompt-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md` (prompt storico pulizia, se untracked)

**Fuori scope (NON aggiungere):**
- L5 intero; hooks; Comunicazione ERRORI/OSS/PROP; CONTRATTO/PROTOCOLLO modificati; `src/`
- Qualsiasi path sotto `docs/_lavoro/`
- Path rewrite / move / rename

Se trovi altri `Report-*.md` untracked sotto Sessioni 09/10-08 MSS/SEP/CFG/H-1*: elenca e chiedi Sì/No prima di aggiungerli (max 1 domanda batch).

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Leggi HANDOFF + MASTERPLAN §6; conferma prossimo = F4-doc.
2. Foto Git. Classifica WT.
3. Inventario whitelist (tracked vs untracked vs missing).
4. Domanda (A)/(B) se slice cleanup `032` ancora uncommitted.
5. Stage solo perimetro autorizzato; append indice MSS.
6. Allineo owner; report + capsula; validate:mss; diff-check.
7. Commit/push solo con mandato esplicito.

Criterio di fatto
- Report Sessioni MSS in whitelist sono tracked (o esclusi con motivo + Sì Matteo)
- Zero path change; zero L5 nello stage
- Indice aggiornato; G5 non PASS; H-1.3 non sanato
- Un solo prossimo vivo dopo chiusura (H-1.3/L5 o stop)

Chiusura verso Matteo (max 5, semplice):
- quanti report trackati
- cosa hai lasciato fuori e perché
- push sì/no
- prossimo (H-1.3/L5 o stop)
- cosa NON fare

STOP: L5; move; path-rewrite; `_lavoro` copy; PLAN rewrite stato; H-1.3 sanato; G5 PASS; WP-1; SEP-5; F5; push senza Sì; due prossimi vivi.
