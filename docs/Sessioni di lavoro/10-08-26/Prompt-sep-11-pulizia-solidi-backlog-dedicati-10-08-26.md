# Prompt — SEP-11 · pulizia lavori solidi + backlog sessioni dedicate

> **Uso:** nuova chat Agent · profilo Meta · standard (alzabile a deep).
> **Fonte:** HANDOFF `031` · MASTERPLAN · review F3 ADEGUATO `030` · HEAD atteso `4a66cc4` (o successore) · ahead ~6.
> **Intento Matteo:** chiudere ciò che è già solido; lasciare aperti SOLO i lavori che meritano sessione dedicata; il resto si chiude in questa chat.

Copia da «Profilo:» in giù.

---

Profilo: Meta (SEP-11 — pulizia lavori solidi + backlog sessioni dedicate)
Modalità: standard
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md; docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/MetaSkillSystem/archive/README.md; docs/FOLLOW_UP.md; docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md; docs/Comunicazione-Skill/VOCABOLARIO.md
Prove obbligatorie: foto Git (HEAD/ahead/staged/WT classificato); report `030` ADEGUATO; report `031`; B1 §6 (F4/F5)
Mandato Matteo: UNA fase di pulizia/chiusura documentale. Chiudi i lavori già solidi. Lascia aperti SOLO item che meritano chat dedicata. Push SOLO se Matteo dice Sì in questa chat. Nessuna esecuzione F4/F5. Nessun move. Nessun touch path L5. Nessun claim SEP-G5 PASS / H-1.3 sanato.
Non caricare: Valutazione Personale; src/; esecuzione F4-L5; F5 path-rewrite; rewrite stato PLAN_V0; WP-1; SEP-5 freeze; sanatoria H-1.3
Output attesi:
  1) F0 foto Git + classificazione WT in 4 bucket: (S) solidi chiusi · (C) chiudibili ora · (D) dedicati · (R) rumore/ignora
  2) Tabella «CHIUSI / non riaprire» (max ~8 righe): F1 F2 B2-F01 F3 review ADEGUATO D1–D5 stub D5 G1-con-riserve …
  3) Tabella «APERTI — solo sessioni dedicate» (max 5): ciascuno con titolo, perché dedicato, precondizione, STOP, prompt/file se già esiste
  4) Tabella «CHIUSI in questa chat» (rumore/go-nogo generico/prompt stale): cosa smetti di portare avanti e dove lo registri
  5) Allineo owner: MASTERPLAN prossimo passo = primo item dedicato (o stop); HANDOFF vista pulita; ROADMAP vista; SESSION_LOG; opz. 1–3 righe FOLLOW_UP solo per dedicati
  6) Decisioni Matteo Sì/No obbligatori all’inizio: (A) push ahead ora? · (B) aggiungere ai dedicati anche F4-doc (track report Sessioni untracked)? · (C) tenere F4-L5/H-1.3 come corsia dedicata separata (default Sì)?
  7) Se (A)=Sì: push `env/test` dopo allineo; se No: non pushare
  8) Report + capsula; validate:mss; git diff --check; commit SOLO se Matteo dice «lavoro ok»/«fai report finale» — altrimenti stage opzionale
Niente output in più senza Sì/No.
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Pulire il bordo operativo: ciò che è già solido non resta «semi-aperto»; ciò che merita lavoro vero resta in una lista corta di sessioni dedicate. Niente migrazione. Niente auto-F4.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Branch: `env/test`. HEAD tipico: `4a66cc4` (review ADEGUATO + prompt go/no-go). Ahead ~6 · push finora no.
- Solidi già fatti (non riaprire senza nuova evidenza): SEP-10 chiuso nel disegno; F1+F2; B2-F01 inventario; F3 M03 move+stub; review F3 **ADEGUATO**; D1–D5; G1 PASS_CON_RISERVE (Cursor-only).
- SEP-G5 **non PASS** (corretto). Stub D5 attivo. PLAN_V0 leave-as-history.
- WT rumore tipico (NON mescolare in questa chat): L5 fixtures/scripts/tests/matrix; hook/contratto/comunicazione modificati; report Sessioni untracked 09/10-08.
- Prompt go/no-go `Prompt-sep-11-go-nogo-post-f3-review-10-08-26.md` è **supersedibile** da questa pulizia: non tenere due «prossimi passi» vivi.

Candidati «sessione dedicata» (da confermare/tagliare con Matteo):
1. **Push** dei commit locali (se non fatto in A) — chat corta, alto valore backup.
2. **F4-doc** — track report Sessioni MSS untracked; no L5; no path change.
3. **Corsia H-1.3 / F4-L5-track** — path invariati; H-1.3 resta FAIL finché review dedicata; vietato fingere sanatoria.
4. **SEP-5 / freeze prospettico** — solo dopo decisioni Matteo separate (già bloccato).
5. (Opz.) altro debito pack `SEP-D08` — solo se Matteo lo vuole in cima; altrimenti lascia in MASTERPLAN debito, non come prossimo atomico.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Foto Git. Classifica ogni gruppo WT nei bucket S/C/D/R. Non aprire file L5 contenuto oltre il nome path.
2. Fai le 3 domande Sì/No (A/B/C) **prima** di scrivere/allineare.
3. Scrivi le tre tabelle (chiusi / dedicati / chiusi-ora). Max 5 dedicati. Se superi 5, chiedi a Matteo cosa tagliare.
4. Aggiorna MASTERPLAN § prossimo passo → **un solo** prossimo atomico (il primo dedicato, o stop). Registra in registro WP solo se stato davvero cambia.
5. Sostituisci HANDOFF attivo: bordo pulito; lista dedicati puntata; STOP chiari; niente narrazione F3 da rivivere.
6. Segna il prompt go/no-go precedente come **superseded** (nota in HANDOFF/report: sostituito da backlog dedicati) — non cancellare il file.
7. FOLLOW_UP: aggiungi righe solo per dedicati confermati; non aprire FU per rumore R.
8. Se A=Sì → push. Commit docs di questa pulizia solo con mandato esplicito di commit.
9. Report + capsula + validate:mss + diff-check.

Criterio di fatto
- Un solo «prossimo passo» vivo negli owner
- ≤5 sessioni dedicate elencate, ciascuna con STOP
- Lavori solidi esplicitamente «non riaprire»
- Nessuna esecuzione F4/F5; G5 non PASS; L5 path intatto
- Push solo con Sì

Chiusura verso Matteo (max 5, semplice):
- cosa hai dichiarato chiuso
- quali 1–5 sessioni restano (titoli umani)
- push fatto o no
- dove leggere il bordo (handoff)
- cosa NON fare la prossima volta

STOP: F4/F5 exec; move; path-rewrite L5; `_lavoro`; PLAN rewrite stato; H-1.3 sanato; WP-1; SEP-5 auto; SEP-G5 PASS; push senza Sì; tenere due prossimi passi vivi (go/no-go + backlog).
