# Prompt — SEP-11 post-F3-review · go/no-go (push / F4 / stop)

> **Uso:** nuova chat Agent · profilo Meta · standard (alzabile a deep).
> **Fonte stato:** `Report-sep-11-post-f3-review-breve-10-08-26.md` (`030` ADEGUATO) + HANDOFF + MASTERPLAN.
> **Git atteso:** `env/test` · HEAD con commit review F3 · ahead N · **push solo se Matteo dice Sì in questa chat**.
> **SEP-G5 non PASS**. F4 **non** auto-eseguito: al massimo inventario + prompt F4 se autorizzato.

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Meta (SEP-11 post-F3-review — go/no-go push · F4 · stop)
Modalità: standard
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md; docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/MetaSkillSystem/archive/README.md; docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md (§6 F4); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md; docs/Comunicazione-Skill/VOCABOLARIO.md; docs/PREPARA_PROMPT_SKILL.md
Prove obbligatorie: report `030` ADEGUATO; foto Git (ahead, staged, L5 rumore); B1 riga F4 (track, no path change)
Mandato Matteo: SOLO go/no-go + allineo owner + eventuale prepara prompt F4. Nessuna esecuzione F4. Nessun move. Nessun touch path L5. Nessun claim H-1.3 sanato. SEP-G5 NON PASS. Push SOLO se Matteo dice Sì esplicito in chat.
Non caricare: Valutazione Personale; src/; esecuzione F4; F5+ path-rewrite; rewrite stato PLAN_V0; WP-1; SEP-5; sanatoria H-1.3
Output attesi:
  1) F0: foto Git (branch, HEAD, ahead, staged/untracked classificato: pack-docs vs L5 vs altro)
  2) Quadro 1 pagina: dove siamo (F1–F3+review) · cosa resta (F4 opz. / push / stop) · freeze L5/L6
  3) Opzioni Matteo (Sì/No per ciascuna): (A) push commit locali · (B) autorizzare F4-doc (track report Sessioni MSS untracked, NO L5) · (C) autorizzare F4-L5-track (fixtures/scripts/tests path invariati; H-1.3 resta FAIL) · (D) stop
  4) Raccomandazione breve (1 scelta preferita + perché) — senza eseguirla finché Matteo non conferma
  5) Se Matteo autorizza F4 (B o C): scrivi SOLO file Prompt-sep-11-f4-… pronto; NON eseguire F4
  6) Se Matteo autorizza push (A): esegui push SOLO su `env/test` dopo conferma; altrimenti no push
  7) Report + SESSION_LOG + capsula; allineo MASTERPLAN/HANDOFF; validate:mss; git diff --check
Niente output in più senza Sì/No.
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Dopo review F3 ADEGUATO, far decidere a Matteo il prossimo atto atomico senza mescolare push, track L5 e move. Una fase sola di decisione (+ prepara prompt se serve). Non cutover. Non SEP-G5 PASS.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Owner pack = MASTERPLAN; owner SYS-1 = PLAN_V0 (non toccare stato).
- Onda: SEP-10 chiusa → F1+F2 → B2-F01 → F3 M03 → review `030` **ADEGUATO** → **ora go/no-go**.
- B1 F4 = track untracked, **no path change**; STOP se si dichiara H-1.3 sanato.
- D2=(c) già usato: pack/analisi tracked; L5 ancora rumore WT (freeze D4).
- F5+ path-rewrite L5 = fuori SEP-11 default (gate H-1.x separato).
- G1-R1 Cursor-only: self_report ok; non fingere review multi-modello.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Leggi HANDOFF + MASTERPLAN + report `030`; confronta con foto Git reale.
2. Classifica WT: (i) già committed onda SEP-11 · (ii) report Sessioni untracked · (iii) L5 fixtures/scripts/tests/matrix · (iv) delta esterni (hook/contratto/comunicazione) — **non** mescolare (iv) in F4 senza mandato.
3. Presenta opzioni A–D con effetto concreto + rischio; 1 raccomandazione.
4. Attendi scelte Matteo (Sì/No). Non inventare autorizzazioni.
5. Esegui solo ciò che è Sì: push e/o scrittura prompt F4. Mai move. Mai rewrite PLAN. Mai claim G5/H-1.3.
6. Aggiorna owner + report + capsula.

Criterio di fatto
- Decisioni Matteo registrate
- Nessuna esecuzione F4 in questa chat
- G5 non PASS
- Freeze path L5 rispettato

Chiusura verso Matteo (max 5, semplice):
- scelte registrate
- se prompt F4 pronto: path file
- push fatto o no
- G5 ancora no
- prossimo atomico

STOP: esecuzione F4; move; path-rewrite L5; `_lavoro`; PLAN rewrite stato; H-1.3 sanato; WP-1; SEP-5; SEP-G5 PASS; push senza Sì esplicito.
