# WP-A5 — Riallineare Database-Skill — 12-06-26

**Cosa è cambiato:** i documenti che gli agenti consultano per il database puntano di nuovo alle fonti verificabili (file migrazione in repo + consultazione remota MCP) e descrivono le colonne introdotte dalle migrazioni 040–045, inclusa la disponibilità magazzino (`is_available`).
**Cosa resta:** WP-A6 (routing capienza/masterplan); WP-B1 (drift migrazioni ↔ DB reale con QA senior).
**Serve una tua azione:** no — revisione senior leggera sui tre file DB.

---

## 2. Cosa è stato fatto

1. Verificato con Glob: 46 file in `supabase/migrations/`, ultimo `045_menu_magazzino_is_available.sql` (040–045 tutti presenti).
2. Corretto `DATABASE.md`: rimossa nota obsoleta «prossima migrazione `045_`»; aggiunto riepilogo 040–045; prossima = **`046_`**; rimando esplicito a fonti vive.
3. Riscritto `DB_MIGRATIONS_CONTEXT.md` §1: eliminato elenco statico Local|Remote; sostituito con fonte = repo + MCP `list_migrations`; indice sintetico 040–045; anomalie storiche conservate (003 doppio, CLI push, PGRST202).
4. Aggiornato `DB_SCHEMA_CONTEXT.md`: `is_available` su categorie/ingredienti (045); sezione `menu_qr_codes`; colonne 036–042 (`menu_qr_code_id`, `icon`, `hidden_menu_item_ids`, tema `green_wellness`); comportamento trigger 044; nota clamp carosello 040.
5. MCP TEST (sola lettura): `get_project_url` → `docnnernvp`; `list_migrations` conferma registro fino a `045_menu_magazzino_is_available`.
6. `npm run validate` verde.
7. `MASTERPLAN_ALLINEAMENTO.md` — WP-A5 ✅.

### Fonte versionata vs stato remoto

| Aspetto | Fonte | Esito 12-06-26 |
|---------|-------|----------------|
| Elenco file migrazione | `supabase/migrations/` (repo) | 001–045 presenti; prossima `046_` |
| Stato applicazione TEST | MCP `list_migrations` su docnnernvp | Fino a 045 inclusa (`20260611193908`) |
| Stato PROD | Non interrogato MCP prod in questa sessione | Report merge M3 (12-06-26) documenta 045 in PROD; WP-B1 coprirà drift sistematico |

---

## 3. File toccati e perché

| File | Modifica | Perché |
|------|----------|--------|
| `docs/DATABASE.md` | Riepilogo migrazioni + prossima `046_` | Drift: citava 045 come futura |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | §1 fonti vive, indice 040–045 | Elenco statico fermo a 039 |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | Colonne/tabelle 040–045 + fix tema QR | Mancava `is_available` e schema Menu QR aggiornato |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-A5 ⬜ → ✅ | Cancello milestone AL-A |
| `docs/SESSION_LOG.md` | +1 riga | Indice sessione |

---

## 4. Test eseguiti e risultato

| Comando | Esito |
|---------|-------|
| `npm run validate` | ✅ verde (exit 0) |
| Glob `supabase/migrations/04[0-5]_*.sql` | ✅ 6 file (040–045) |
| MCP `get_project_url` (TEST) | ✅ docnnernvp |
| MCP `list_migrations` (TEST) | ✅ include `045_menu_magazzino_is_available` |

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/DATABASE.md` | Riepilogo + fonti vive | Router DB principale |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | §1 riscritto | Context migrazioni per agenti DB |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | Schema 040–045 | Context schema per agenti DB |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-A5 ✅ | Stato milestone |
| `docs/SESSION_LOG.md` | 1 riga | Cronologia |

Nessun altro file skill (APP_CONTEXT, area Prenota/Menu QR) — solo documentazione DB, nessun cambio codice.

---

## 6. Dati comunicazione

- **Prompt:** esecutivo WP-A5 con scope chiuso (3 file DB + masterplan + report + SESSION_LOG; vietato src/, migrazioni, tipi, commit).
- **Formato efficace:** passi masterplan 1:1 + distinzione repo vs MCP nel report.
- **Non toccato per mandato:** WP-A6, WP-B*, src/, apply_migration, db:types, commit/push.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **1**
- Correzioni dopo 1ª risposta: **0**
- Follow-up generati: **0**
- Modalità alzata: **no** (standard)

---

## 8. La tua lettura della sessione

**Impressioni:** WP meccanico ben delimitato; leggere i 6 file SQL 040–045 prima di editare lo schema ha evitato inventare colonne. La sostituzione dell'elenco statico in DB_MIGRATIONS_CONTEXT è il fix strutturale più utile — gli agenti non dovrebbero più fidarsi di tabelle Local|Remote datate.

**Difficoltà:** minima — il registro MCP remoto usa nomi senza prefisso numerico (es. `clamp_booking_carousel_slide_text_limits` per `040_…`); documentato esplicitamente in §1.

**Migliorie suggerite (dato):** WP-B1 potrebbe aggiungere uno script o check CI che confronta basename in `supabase/migrations/` con ultima riga citata nei docs DB — intercetterebbe drift prima del prossimo ciclo.

---

## 9. Derivazione errori

Nessuna difficoltà tecnica — bonifica doc su drift preesistente segnalato dall'analisi skill system 12-06-26 (classificazione: **bug preesistente** nei docs, non nel DB).

---

## 10. Cosa resta per la prossima sessione

- **WP-A6** — Routing capienza e masterplan in APP_CONTEXT §0.
- **WP-B1** — Migrazioni ↔ DB reale (drift critico codificato o documentato con QA senior); include verifica sistematica PROD vs TEST.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt esecutivo WP-A5 completo (Profilo Esecuzione, modalità standard, skill MASTERPLAN WP-A5 + DATABASE.md + DB_MIGRATIONS_CONTEXT + DB_SCHEMA_CONTEXT; output: fix 3 file DB, MASTERPLAN ✅, report, SESSION_LOG 1 riga; passi 1–5 masterplan; verifica validate + path migrazione; vietato apply migrazioni, tipi, WP-A6/AL-B, commit/push; chiusura CHIUSURA_SESSIONE §11).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti i 6 SQL `040_`–`045_` in `supabase/migrations/`; `DATABASE.md` L13 e L29 (046_, riga 045); `DB_MIGRATIONS_CONTEXT.md` §1 (fonti vive, indice 040–045); `DB_SCHEMA_CONTEXT.md` sezioni `menu_items`, `menu_categories`, `menu_qr_codes`, `increment_booking_count_on_accept`. Glob: 46 migrazioni totali. MCP TEST: 45 voci fino a `045_menu_magazzino_is_available`. `npm run validate` exit 0.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Aggiornati i 3 file DB target + MASTERPLAN + SESSION_LOG. Non toccati: `src/types/database.ts` (vietato generare tipi), skill Prenota/Menu QR (nessun cambio codice — solo doc schema DB), `DATABASE_SKILL.md` (non esiste; router usa DATABASE.md). Report merge M3 citato solo come fonte storica per PROD 045.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non fatto per mandato: WP-A6, WP-B1+, MCP prod `list_migrations`, rigenerazione tipi, apply migrazioni, modifiche src/, commit/push, FOLLOW_UP.md (WP-A5 non crea FU). Ne sono certo perché esplicitamente vietato o fuori scope nel prompt.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito basso; rischio futuro: due file (`DATABASE.md` e `DB_MIGRATIONS_CONTEXT.md`) possono divergere di nuovo su «prossima migrazione» — proposta: una sola riga canonica solo in DB_MIGRATIONS_CONTEXT e DATABASE.md rimanda senza ripetere il numero.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto — WP-A5 del masterplan + lettura SQL 040–045 bastavano; MCP TEST utile per distinguere repo vs remoto nel report; nessun hook runtime.

---

## 12. Self-review

1. Dati = diff reale — verificato Glob, MCP, rilettura righe modificate e SQL sorgente.
2. File correlati — tabella §5 completa; nessuna skill area funzionale da allineare (solo docs DB).
3. Q1–Q6 con sostanza.
4. Tono utente nel cappello.

Report pronto.
