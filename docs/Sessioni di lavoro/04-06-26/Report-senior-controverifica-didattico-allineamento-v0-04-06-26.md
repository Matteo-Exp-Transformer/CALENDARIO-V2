# Report senior — Controverifica sistema didattico + allineamento hook template v.0

**Data:** 04-06-26 · **Profilo:** Meta senior · **Modalità:** standard
**Branch:** env/test · **Commit versionato:** `PROSEGUIMENTO_MAPPATURA_SKILL.md` (follow-up senior)
**Lavoro gitignored (NON committato per regola):** `_skill-system-v0/` (hook + CHIUSURA §11)

---

## Cappello (3 righe)

1. **Cosa è cambiato:** controverificato il sistema didattico costruito da un altro agente (qualità
   alta, nessuna correzione) e **allineato il template v.0 allo stato reale** — gli hook erano fermi a
   ~01-06, ora hanno guard-prod, nudge v4, hook senior, §11.
2. **Cosa resta:** verifica Prenota col sub-agent; check segnaposto v.0 (nuovo follow-up senior).
3. **Serve una tua azione?** No. Merge env/test → main richiesto e in corso.

---

## 1. Controverifica sistema didattico (implementato da altro agente)

Letti i 3 file core in `_lavoro/Per matteo/`. **Esito: qualità alta, nessuna correzione necessaria.**
- `GLOSSARIO_VIVO.md` — lifecycle nastro (🌱→✅→📦) + 4 livelli; termini ancorati a **fonti canoniche
  vere** (Fowler «Data Mapper», Anthropic «context engineering»). Ha **corretto un errore mio**:
  «resolver» → nome professionale **Data Mapper**. Valore aggiunto reale.
- `PROFILO_SCOLASTICO.md` — livelli per area, storico richiami, prima Lezione 04-06 con distinzione
  (a) risposte guidate / (b) idee autonome.
- `ROADMAP_SKILL.md` — 5 aree per dipendenza, ancorate allo stack reale.
- Gate «vuoi fare la lezione?» con tracciamento del rifiuto: ben implementato (memory aggiornata).

## 2. Allineamento template v.0 (era disallineato sugli hook)

Il lato documentale era già propagato (context-knowledge, Playbook §6). Gli **hook erano fermi a ~01-06**.
Colmato — file generici (placeholder al posto dei dati CalendarBackup), testati:

| Cosa | Prima | Ora |
|------|-------|-----|
| `guard-prod.mjs` | assente | ✅ generico (CONFIG da adattare) |
| nudge fine-sessione | v3 (titoli) | ✅ v4 (domande §11) |
| `fine-sessione-senior.mjs` | assente | ✅ generico, marcato avanzato/opzionale |
| `hooks.json` | solo stop loop_limit 1 | ✅ stop loop_limit 3 + beforeMCP + beforeShell |
| CHIUSURA_SESSIONE §11 | mancava | ✅ aggiunta (6 domande generiche) |
| README hook | descriveva v3 | ✅ riscritto (3 hook, come adattare) |

**5 test hook passati:** nudge silenzio (no report)→{} · nudge blocco (R vuota)→cita Q1, non Q2 ·
guard TEST→allow · guard PROD→ask · senior guardia-loop→pass. Nota tecnica: un test falliva per path
`/tmp` interpretato male su Windows (`C:\tmp`), non per bug hook — rifatto con path coerente, verde.

## 3. File toccati

| File | Cosa | Git |
|------|------|-----|
| `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` | follow-up senior + stato debiti v.0 | versionato |
| `_skill-system-v0/hooks/guard-prod.mjs` | NUOVO generico | gitignored |
| `_skill-system-v0/hooks/fine-sessione-nudge.mjs` | v3→v4 | gitignored |
| `_skill-system-v0/hooks/fine-sessione-senior.mjs` | NUOVO generico | gitignored |
| `_skill-system-v0/hooks/hooks.json` + `README.md` | allineati | gitignored |
| `_skill-system-v0/comunicazione/CHIUSURA_SESSIONE.md` | +§11 domande | gitignored |

## 4. Cosa resta

- **Verifica Prenota col sub-agent** — **PASS** 04-06-26 (area ✅ blindata in `PROSEGUIMENTO_MAPPATURA_SKILL.md`).
- **[Follow-up senior nuovo] Check segnaposto v.0:** ogni `{{segnaposto}}` del template documentato in
  `MANUALE_AVVIO.md`. Tracciato in `PROSEGUIMENTO_MAPPATURA_SKILL.md` § Debiti.
- Generalizzare la mappatura ad altre aree (Menu QR).

---

## 11. Domande di chiusura

❓ Q1 — Prompt verbatim?
✅ R1 — Sì: «con altro agente ho finito le migliorie insegnamento. controverifica qualità del lavoro e allineamento v.0 skill system… deve essere identico ma vuoto», poi «annota come follow up per senior. poi fai report finale e merge con main».

❓ Q2 — I dati del report corrispondono al diff?
✅ R2 — Sì. Versionato: solo `PROSEGUIMENTO_MAPPATURA_SKILL.md` (+ questo report). Il lavoro hook è in `_skill-system-v0/` (gitignored, NON committato per regola — verificato con git status). I 3 file src/supabase erano già modificati prima, non miei.

❓ Q3 — File correlati allineati?
✅ R3 — Sì. hooks.json del v.0 ora coerente con i 3 .mjs presenti; README v.0 riscritto per descriverli; CHIUSURA §11 coerente con ciò che il nudge v4 cerca. Coerenza interna del template verificata con i test.

❓ Q4 — Cosa NON è stato fatto?
✅ R4 — Propagazione STRUTTURA context-knowledge nel v.0 (sospesa, deciso). Check segnaposto v.0 (follow-up senior). Sub-agent Prenota **eseguito dopo** questo report → PASS (stato in PROSEGUIMENTO). Nessuna correzione al sistema didattico (non serviva).

❓ Q5 — Attrito + miglioria?
✅ R5 — Attrito: un test hook falso-rosso per path `/tmp`→`C:\tmp` su Windows. Miglioria: testare gli hook serializzando l'input con Node e path assoluti coerenti col SO (già lezione nota 04-06, riconfermata).

❓ Q6 — Contesto giusto? Hook utile?
✅ R6 — Contesto giusto (letti i file reali didattici + i 3 hook reali prima di generalizzare). Hook utile: in una sessione precedente oggi ha trovato un E-A reale (VOCABOLARIO). Qui la chiusura è guidata.

---

## Lezione della chat — parole e concetti elaborati

> Gate: lezione proposta implicitamente. Sintesi breve (sessione tecnica di allineamento).

**Lezione ricevuta:** la differenza tra **template** e **snapshot** — un template è *identico nelle
funzionalità ma generico* (placeholder configurabili), non una copia byte-per-byte. E il principio del
**fail-open** negli hook (se il parsing fallisce, lascia passare invece di bloccare il lavoro).

**Deciso da Matteo:**
- *Idea autonoma (b):* volere il v.0 «identico ma vuoto» — è la definizione esatta di un buon template
  riusabile; e separare il check-segnaposto come follow-up invece di farlo ora (controllo dello scope).
- *Risposta guidata (a):* le due scelte su fedeltà v.0 (generico vs copia) e hook senior (opzionale)
  prese rispondendo bene alle opzioni pesate.

**Deciso bene?** Sì. Ha tenuto lo scope stretto (follow-up invece di allargare) — l'opposto dello
*scope creep* che è il suo punto da sorvegliare. Segnale di crescita.

**Da consolidare:** template vs snapshot, fail-open, placeholder/segnaposto.

---

*Sessione condotta da Meta senior (Opus 4.8). Ripresa: `PROSEGUIMENTO_MAPPATURA_SKILL.md`.*
