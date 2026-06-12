# WP-A6 — Routing capienza e masterplan — 12-06-26

**Cosa è cambiato:** gli agenti che ricevono task su capienza/posti o su masterplan vengono instradati subito alle fonti giuste (Admin Settings + edge server, oppure i due masterplan) invece di restare bloccati sulla skill Prenota o sul router generico.
**Cosa resta:** milestone AL-B (fix codice capienza/tenant/create-booking); chiusura AL-A completa — prossimo passo naturale WP-B1.
**Serve una tua azione:** no — revisione leggera che il routing sia comprensibile.

---

## Obiettivo

Impedire vicoli ciechi quando un task è formulato in linguaggio utente («capienza», «limite coperti», «masterplan allineamento») ma la logica vive fuori da PRENOTA_TEXT_LIMITS_MAP o dalle skill di area singole.

---

## File toccati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/APP_CONTEXT_SKILL.md` §0 | +2 righe tabella routing | Router globale: capienza → Admin Settings + edge; masterplan → BLINDATURA + ALLINEAMENTO |
| `docs/Prenota-Skill/PRENOTA_SKILL.md` §6 | +1 riga mappa | Distinzione esplicita capienza/coperti vs limiti testo |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-A6 ⬜ → ✅ | Cancello milestone AL-A |
| `docs/SESSION_LOG.md` | +1 riga | Indice sessione |

**Sola lettura verificata (non modificati):** `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`, `supabase/functions/create-booking/`, `docs/MASTERPLAN_BLINDATURA.md`.

---

## Passi eseguiti

1. Verificato branch `env/test`.
2. In `APP_CONTEXT_SKILL.md` §0: routing «limite coperti / capienza / coperti massimi / posti / cap prenotazioni / slot pieni» → `ADMIN_SETTINGS_CONTEXT.md` + `supabase/functions/create-booking/` (edge server, sola lettura).
3. In `APP_CONTEXT_SKILL.md` §0: routing «masterplan blindatura / masterplan allineamento / roadmap skill-codice / WP milestone AL-*» → `MASTERPLAN_BLINDATURA.md` + `MASTERPLAN_ALLINEAMENTO.md`.
4. In `PRENOTA_SKILL.md` §6: riga limiti capienza/coperti con rimando Admin Settings + edge, nota NON confondere con `PRENOTA_TEXT_LIMITS_MAP`.
5. Glob su tutti i path citati — tutti presenti.
6. Grep verifica sui due file skill target.
7. `npm run validate` verde.
8. Aggiornato stato WP-A6 nel masterplan.

---

## Verifica grep

Comando: `rg -i "capienza|limite coperti|masterplan" docs/APP_CONTEXT_SKILL.md docs/Prenota-Skill/PRENOTA_SKILL.md`

| Match atteso | Path nel routing |
|--------------|------------------|
| capienza / limite coperti / posti | `ADMIN_SETTINGS_CONTEXT.md`, `create-booking/` |
| masterplan blindatura / allineamento | `MASTERPLAN_BLINDATURA.md`, `MASTERPLAN_ALLINEAMENTO.md` |
| distinzione testo vs capienza | `PRENOTA_TEXT_LIMITS_MAP` (solo come «non confondere») |

---

## Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm run validate` | ✅ verde |
| Glob path citati | ✅ tutti presenti |

---

## Cancello

Matteo conferma che il routing è comprensibile — WP-A6 chiude la bonifica meccanica AL-A sul router.

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/APP_CONTEXT_SKILL.md` | §0 +2 righe | Router globale capienza e masterplan |
| `docs/Prenota-Skill/PRENOTA_SKILL.md` | §6 +1 riga | Mappa area Prenota vs capienza server-side |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-A6 ✅ | Stato milestone |
| `docs/SESSION_LOG.md` | 1 riga | Cronologia |

---

## 6. Dati comunicazione

- **Prompt:** esecutivo WP-A6 light, branch `env/test`, file esatti e passi masterplan 1:1; vietato fix capienza, create-booking, src/.
- **Formato efficace:** elenco file + verifica grep obbligatoria + validate.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **1** (via parent agent)
- Correzioni dopo 1ª risposta: **0**
- Follow-up generati: **0**
- Modalità: **light** (report standard per chiusura WP masterplan)

---

## 8. La tua lettura della sessione

**Impressioni:** WP minimo e ad alto valore — il rischio reale era un agente su task Prenota che confondeva limiti caratteri con posti disponibili. Due righe in §0 + una in PRENOTA §6 chiudono il buco senza toccare codice.

**Difficoltà:** nessuna — path già esistenti, formato tabella coerente con WP-A4.

**Migliorie suggerite (dato):** in WP-B4 (create-booking hardening) aggiornare anche ADMIN_SETTINGS_CONTEXT con note su rate limit/capienza server-side, così il triangolo admin ↔ edge resta allineato dopo i fix codice.

---

## 9. Derivazione errori

Nessuna difficoltà tecnica — gap di routing preesistente segnalato dall'analisi skill system 12-06-26 (**bug preesistente** nei docs, non nel codice capienza).

---

## 10. Cosa resta per la prossima sessione

- **WP-B1** — Migrazioni ↔ DB reale (primo WP milestone AL-B, profilo senior).
- Eventuali fix capienza/create-booking restano nei WP AL-B (B4, B5), non in AL-A.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt esecutivo WP-A6 (branch env/test, Profilo Esecuzione light, file APP_CONTEXT §0 + PRENOTA §6 + masterplan stato + report + SESSION_LOG; passi 1–7 masterplan; verifica grep + validate; vietato create-booking fix, src/, riscrittura §0 intero).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti `APP_CONTEXT_SKILL.md` righe routing capienza e masterplan; `PRENOTA_SKILL.md` §6 nuova riga; `MASTERPLAN_ALLINEAMENTO.md` riga WP-A6 ✅; Glob su ADMIN_SETTINGS_CONTEXT, create-booking/index.ts, MASTERPLAN_BLINDATURA, MASTERPLAN_ALLINEAMENTO — tutti presenti.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Aggiornati APP_CONTEXT, PRENOTA_SKILL, MASTERPLAN, SESSION_LOG. Non toccati: ADMIN_SETTINGS_CONTEXT (sola lettura), create-booking (solo citato), src/, FOLLOW_UP (WP non crea FU).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non fatto per mandato: fix capienza, modifica create-booking, WP-B1+, commit/push, FOLLOW_UP. Ne sono certo perché esplicitamente vietato nel prompt WP-A6.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito nullo; rischio futuro: dopo WP-B4 il routing potrebbe restare generico sull'edge — proposta: aggiornare ADMIN_SETTINGS_CONTEXT con sezione «validazione server» collegata a create-booking nello stesso ciclo del fix codice.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto — WP-A6 del masterplan + lettura §0/§6 esistenti bastavano; nessun hook runtime.

---

## 12. Self-review

1. Dati = diff reale — verificato Glob, grep, rilettura righe modificate.
2. File correlati — tabella §5 completa; nessun fix codice richiesto.
3. Q1–Q6 con sostanza.
4. Tono utente nel cappello.

Report pronto.
