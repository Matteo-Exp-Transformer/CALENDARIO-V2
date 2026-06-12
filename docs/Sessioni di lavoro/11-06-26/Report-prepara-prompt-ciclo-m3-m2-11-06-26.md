# Report prepara-prompt — Ciclo M3 Menu magazzino + M2 operative (11-06-26)

**Data:** 11-06-26  
**Profilo:** prepara-prompt (filtro a monte + handoff a valle + 3 commit orchestrati)  
**Branch:** `env/test`  
**Modalità ciclo:** deep (M3) + standard (toggle UX)

---

## Cappello

- **Cosa è cambiato:** orchestrato il ciclo **M3 Menu/magazzino** (Fase 1→2→3 + fix UX toggle) e chiarito **M2** (operative vs Calendario); prodotti **6 prompt esecutore**; eseguiti **3 commit** (Fase 1 codice + M2 E2E + doc batch); handoff per commit restante e blindatura M3.
- **Cosa resta:** commit/push **Fase 2 + toggle UX + Fase 3** (working tree); QA blindatura M3 formale; merge milestone M3; FU-MQR-3 operativo PROD.
- **Serve una tua azione:** sì — «fai report finale» / commit M3 unstaged; opzionale smoke toggle panoramica 375px.

---

## 1. Mappa del ciclo

| Fase | Stato | Output |
|------|-------|--------|
| 1 Prepara — M3 Fase 1 prompt | ✅ | Limiti 7/12/6/6, cap 24/79, avviso ingredienti |
| 2 Esecuzione Fase 1 | ✅ | Report Fase 1; validate **536** |
| 3 Revisione Fase 1 | ✅ riserve | Approva con riserve (QA soglia piena browser, test ridondanti) |
| 4 Commit Fase 1 + M2 E2E + doc | ✅ | `8916427`, `5c9c12a`, `a024db3` |
| 5 Prepara — M3 Fase 2 prompt | ✅ | Toggle `is_available` + migrazione 045 TEST |
| 6 Esecuzione Fase 2 | ✅ | Report Fase 2; validate **544** |
| 7 Prepara — toggle UX panoramica | ✅ | Toggle solo griglia Menu principale |
| 8 Esecuzione toggle UX | ✅ | Report toggle UX; validate **544** |
| 9 Prepara — FU-M3-3 sync prompt | ✅ (incollato da handoff) | 9 Vitest rename/delete |
| 10 Esecuzione Fase 3 | ✅ | Report Fase 3; validate **553**; FU-M3-3 chiuso |
| 11 Commit Fase 2/3/UX | ⬜ | Tutto ancora unstaged |
| 12 QA blindatura M3 + merge | ⬜ | MASTERPLAN: testato 🔶, blindato ⬜ |

**Report esecutori collegati:**
- [Fase 1 limiti](Report-m3-fase1-menu-magazzino-limiti-11-06-26.md)
- [Revisione Fase 1](Report-revisione-m3-fase1-menu-magazzino-limiti-11-06-26.md)
- [Fase 2 availability](Report-m3-fase2-menu-magazzino-availability-11-06-26.md)
- [Toggle UX panoramica](Report-m3-fase2-toggle-ux-panoramica-menu-11-06-26.md)
- [Fase 3 sync](Report-m3-fase3-menu-magazzino-sync-11-06-26.md)
- [M2 E2E FU-043](Report-m2-prenotazioni-operative-e2e-fu043-11-06-26.md)

---

## 2. Commit eseguiti in questa orchestrazione

| SHA | Messaggio | Contenuto |
|-----|-----------|-----------|
| `8916427` | feat(admin): M3 menu magazzino limiti Fase 1 | limiti, cap, avviso, 9 test limits |
| `5c9c12a` | test(e2e): M2 prenotazioni operative FU-043 | E2E 7 + helper staging + playwright mobile/tablet |
| `a024db3` | docs(admin): M2 operative E2E + M3 Fase 1 limiti magazzino | report + skill + FOLLOW_UP + MASTERPLAN (parziale) |

**Non committato (11-06-26 fine sessione prepara):** migrazione `045`, toggle availability, toggle UX, sync test, doc Fase 2/3 aggiornati.

**Push:** non eseguito in questa sessione prepara-prompt.

---

## 3. Prompt prodotti (riepilogo)

1. **M3 Fase 1** — deep, output 1–6, no migrazione/toggle  
2. **Spiegazione M2** + cap 24/79 confermati da Matteo  
3. **M3 Fase 2** — `is_available`, migrazione TEST, filtri Prenota/QR  
4. **Revisione M3 Fase 1** — mandato Verifica  
5. **Toggle UX** — standard, toggle solo panoramica Menu (non form/overlay)  
6. **Handoff** — stato working tree + prossimi passi commit/blindatura M3  

---

## 4. Stato MASTERPLAN (sintesi)

| Area | Blindato | Note |
|------|----------|------|
| M2 Calendario | ✅ merged prod | — |
| M2 operative | ✅ cancello | Vitest 32 + E2E 7 |
| M3 Menu/magazzino | ⬜ | Testato 🔶 — 26 Vitest M3; validate **553** |

**Follow-up chiusi in ciclo:** FU-043, FU-M3-2, FU-M3-3  
**Aperti rilevanti:** FU-MQR-3 (refuso PROD), FU-MQR-2 (ordine piatti per-QR)

---

## 5. Dati comunicazione

- **Grilletti:** «prepara prompt», «agente ha finito», «lavoro ok» implicito su commit, «ignoralo» su `_lavoro/`, «aggiorna report finale».
- **Formato efficace:** output attesi numerati + «Niente output in più senza Sì/No»; tabella M2 vs M3; handoff con tabella Ciclo·FU·cosa non committato.
- **Decisioni Matteo:** cap testo = stessi FU-030 (24/79); toggle UX solo panoramica (DOM path dettagliato); ignorare delete git `_lavoro`.
- **Automatizzabile:** check branch `env/test`; split commit codice/doc; elenco unstaged vs HEAD prima di handoff.

---

## 6. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: ~8 (prepara, chiarimenti M2, commit, handoff, report finale, …)
- Correzioni dopo 1ª risposta: 2 (cap confermati; chiarimento `_lavoro` non cancellato)
- Follow-up generati nel ciclo: FU-M3-2, FU-M3-3, handoff commit M3
- Modalità alzata dagli esecutori: no (deep già in prompt)

---

## 7. La tua lettura della sessione

**Impressioni:** il MASTERPLAN come unica fonte per «prossimo task» ha funzionato; spezzare M3 in Fase 1/2/3 + fix UX separato ha evitato scope creep. I prompt con vincoli negativi espliciti (NO migrazione, NO form toggle) hanno ridotto reinterpretazioni. Commit a metà ciclo (Fase 1) mentre Fase 2 girava — ok se working tree separato; Fase 2/3 ancora un blob unstaged da splittare al commit.

**Difficoltà:** confusione iniziale M2 (Calendario ✅ vs operative 🔶); chiarita con tabella. `_lavoro/` delete in `git status` ha creato rumore — ignorare esplicitamente.

**Suggerimenti (dato, non modificare skill):** in handoff prepara-prompt, riga fissa «commit già su branch» vs «solo working tree» aggiornata dopo ogni commit orchestrato; checklist smoke M3 post-toggle UX in `TESTING_SKILL` §7.2.

---

## 8. Derivazione errori

Nessun bug codice introdotto dal prepara-prompt (nessun `src/` toccato).  
**Processo:** report mapping M3 senior (11-06) senza §11 — hook fine-sessione segnalato; non risolto in questa chat (priorità data agli esecutori). **Scelta voluta:** non committare Fase 2/3 in attesa di fine agenti.

---

## 9. Cosa resta per la prossima sessione

1. **Commit** (suggeriti 3–4): feat Fase 2 · fix toggle UX · test Fase 3 sync · docs  
2. **Push** `env/test` se Matteo chiede  
3. **Prompt QA blindatura M3** — MANUALE_BLINDATURA Fase D, viewport 375/834/1280, smoke toggle + limiti + rename  
4. **Report finale M3 blindato** + merge senior  
5. **FU-MQR-3** — rename modale admin su `da-tommaso` (opzionale, non cancello M3)

---

## 10. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1: (1) «sei agente prepara prompt. leggi MASTERPLAN_BLINDATURA.md e dammi prompt per prossima task agente esecutore.» (2) «FINE-SESSIONE … Report-senior-audit… manca sezione 11» — non completato in questa chat. (3) «cos'è M2? dammi prompt anche per quello. e i cap vanno bene gli stessi gia usati». (4) «agente ha finito primo prompt M3» + verifica Approva con riserve. (5) «ok procedi con i primi commit. intanto sta lavorando agente m3 fase 2». (6) «M3 fase 2 finito» + fix toggle UX (DOM path lungo). (7) «agenti hanno eseguito i prompt. dammi handoff per prossimo agente prepara prompt». (8) «ignoralo anche lui» (`_lavoro`). (9) «aggiorna tuo report finale».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero?  
✅ R2: Ri-verificato `git log -8` → HEAD `a024db3`; commit `8916427`/`5c9c12a`/`a024db3` presenti; nessun commit Fase 2/3 dopo. `git status` (fine sessione): unstaged Fase 2 (`045`, `MenuMagazzinoAvailabilityToggle`, availability test, hook/pages) + Fase 3 (`menuMagazzinoSync.adminBlindatura.test.ts`) + doc modificati; untracked report Fase 2/3/toggle UX. Validate **553** da report Fase 3 (non ri-eseguito in questa chiusura). MASTERPLAN riga M3: testato 🔶, blindato ⬜ — coerente con doc unstaged.

❓ Q3 — File correlati allineati?  
✅ R3: Creato questo report; aggiornata riga `SESSION_LOG.md`. Report esecutori Fase 1–3 + toggle UX + revisione Fase 1 già su disco (untracked o in commit doc parziale). `FOLLOW_UP.md` unstaged con FU-M3-2/3 fatto — allineato a lavoro agenti, da committare col batch doc. Nessuna modifica skill system (`PREPARA_PROMPT_SKILL`, VOCABOLARIO). `_lavoro` delete: ignorato per istruzione Matteo.

❓ Q4 — Cosa NON hai fatto?  
✅ R4: Non committato Fase 2/3/UX; non pushato; non completato §11 report mapping M3 senior (richiesta hook intermedia); non eseguita revisione accurata Fase 2/3 (delegata a Matteo/test); non preparato prompt blindatura M3 formale (solo accennato in §9); non toccato codice `src/`.

❓ Q5 — Attrito + miglioria?  
✅ R5: Attrito: working tree misto dopo più agenti paralleli — handoff deve elencare commit SHA vs unstaged esplicitamente; miglioria: template handoff con sezione «già su branch» aggiornabile dopo ogni commit orchestrato dal prepara-prompt.

❓ Q6 — Contesto & hook?  
✅ R6: MASTERPLAN + FOLLOW_UP + report sessione esecutori sufficienti per handoff; hook pre-commit cold-check sui 3 commit eseguiti (secondo tentativo OK); hook stop non testato su questo report fino a scrittura §11 completa.
