# Piano esecutore — sub-agent istanza 2 WP-1: checklist QA manuale Servizio

> **Per:** orchestrator senior che lancia i 3 sub-agent.  
> **Non** eseguire il collaudo nel browser — produrre solo documenti.  
> **Matteo** eseguirà la checklist dopo.

---

## 0. Gate iniziale (orchestrator)

```bash
npm run mss:status
```

Atteso: WP-1 **IN PILOTA ombra**; cutover **no**.

---

## Fase 1 — Sub-agent `explore` (very thorough)

**Titolo task:** Gap-analysis checklist umana Servizio

**Mandato:**

1. Confrontare voce-per-voce:
   - `COLLAUDO_S4_CHECKLIST.md` (62 voci storiche)
   - `COLLAUDO_MANUALE_OBBLIGATORIO.md` (16 prove + §5)
   - `e2e/pro/pro-service.spec.ts` + `e2e/pro/pro-service-tables-lifecycle.spec.ts`
   - Elenco Vitest Servizio in `Report-wp1-istanza1-servizio-blindatura-25-08-26.md` §10-bis
   - `ADMIN_TEST_SUITE_INDEX.md` §5

2. Classificare ogni voce umana candidata:
   - `COPERTA` — test browser/unit asserisce lo stesso effetto → **escludi** da checklist
   - `PARZIALE` — flusso coperto, aspetto solo umano (PDF, colori, giudizio) → **includi**
   - `SCOPERTA` — nessun test → **includi**
   - `OBSOLETA` — UI non esiste più (es. «Libera e assegna») → **butta**, sostituisci con UI attuale

3. Estrarre **testi reali** pulsanti/titoli da (grep + read):
   - `RoomConfigModal`, `TableFormModal`, `ServiceSlotsManager` / `SlotModal`
   - `WalkInModal`, `AssignmentMapPanel`, `QuickTableAssignModal`
   - `ServizioPage` (toggle Lista/Mappa, viste Servizio/Modifica)

4. Elencare gap espliciti rispetto al mandato Matteo:
   - Manca percorso **setup da zero** (sala dedicata «QA-Manuale»)
   - Manca blocco **validazione compilazione** modali
   - FU aperti: `FU-SERV-TURNO-SALA-1`, `FU-SERV-MANOPOLE-CONSOLE-1`, `FU-SERV-BADGE-CASCATA-1`

**Output:** `docs/Sessioni di lavoro/25-08-26/Gap-analysis-Servizio-QA-manuale-25-08-26.md`

**Divieti:** modificare `src/`; eseguire Playwright; dichiarare WP-1 chiuso.

---

## Fase 2 — Sub-agent `generalPurpose` (pianificazione)

**Input:** gap-analysis fase 1 + decisioni Matteo (sala dedicata; aggiorna COLLAUDO_MANUALE; FU solo verifica).

**Mandato:** produrre schema blocchi e ordine dipendenze:

| Blocco | Contenuto | Dipende da |
|---|---|---|
| **0** | Preparazione ambiente (`npm run dev`, account Pro `tomas@t.com`, trappole §0.5) | — |
| **0-bis** | Setup da zero: sala «QA-Manuale», 4 tavoli, 2 fasce, limite walk-in | 0 |
| **1** | Validazione modali (sala/tavolo/fascia/walk-in — errori e guard dirty) | 0-bis |
| **2** | Prove 🔴 T1–T9 (anello pubblico, fasce, walk-in, capienza, D38, sostituzione 3 vie) | 0-bis + dati |
| **3** | Prove visive T10–T12 (375/834/1280) | 2 |
| **4** | Decisioni T13 + FU-SERV-TURNO-SALA-1 + T6–T7 briefing | 2 |
| **5** | Classic T14–T16 + intervallo arrivo T16 | — (account `testc@c.com`) |

Stima tempo totale (~2h30 base + ~45 min setup/validazione nuovi).

**Output:** sezione «Schema blocchi» da incorporare nel report istanza 2 (orchestrator la fonde in fase 3).

---

## Fase 3 — Sub-agent `generalPurpose` (creazione checklist)

**Input:** gap-analysis + schema blocchi + `COMUNICAZIONE_UTENTE_SKILL.md`.

**Mandato:** aggiornare **`docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md`**:

### Struttura obbligatoria del file aggiornato

1. Intestazione: data aggiornamento, riferimento WP1 istanza 2, tempo stimato
2. **§0** — preparazione (esistente, refresh se serve)
3. **§0-bis NUOVO** — «Prima configurazione (sala dedicata QA-Manuale)» — sequenza click completa
4. **§1-bis NUOVO** — «Validazione e casi limite» — tabella o prove V1–Vn con formato A/B/C
5. **BLOCCHI 1–4** — T1–T16 refreshate (etichette da codice); mantenere *Perché solo tu*
6. **§4** — formato esiti (`T4 — OK` / `T9 — KO: …`)
7. **§5** — non rifare: **riallineare** a WP1 istanza 1 (257 + E2E 19 + createUpdate 5)
8. **§6** — voci obsolete buttate (con riferimento gap-analysis)

### Formato singola prova

```
### TX — Titolo in linguaggio sala
*Perché solo tu:* …

**A. Sequenza di click**
**B. Risultato atteso**
**C. Trappole / elementi importanti**
```

Linguaggio: schermata Admin → Servizio; effetto per lo staff in sala; dettaglio DB solo in nota opzionale.

### Prove FU obbligatorie (solo verifica, no fix)

- **T7-nota / prova dedicata:** elimina **sala** con prenotazioni attive vs elimina **tavolo** — annotare se il conto turni si muove diversamente (`FU-SERV-TURNO-SALA-1`)
- **T13:** badge Calendario — resta decisione aperta (`FU-SERV-BADGE-CASCATA-1`); non inventare verdetto
- Manopole console: **nota** che oggi non si cambiano da schermata (`FU-SERV-MANOPOLE-CONSOLE-1`) — non è prova click

**Divieti:** nuovo file parallelo; fix codice; rimuovere T1–T16 senza sostituto.

---

## Fase 4 — Orchestrator (controverifica + chiusura istanza)

1. Campionare 3 etichette UI dal codice vs checklist scritta — correggere mismatch.
2. Verificare che §5 non contradica gap-analysis (nessuna voce COPERTA rimasta come prova manuale).
3. Scrivere `docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md`:
   - Cappello (cosa cambiato / cosa resta / azione Matteo)
   - File toccati
   - Comandi eseguiti (`mss:status`, `validate:docs` se pertinente)
   - Sezione **«MSS istanza 2 vs skill normale»** — osservazione su orchestrazione sub-agent (G/O/E se applicabile, no promozioni Persona)
   - §11 Q/R complete (CHIUSURA_SESSIONE)
4. `npm run mss:capsule` sul report · `npm run validate:mss --require-capsule`

---

## Criteri accettazione documento checklist (checklist dell'agente)

- [ ] Matteo può partire da zero con sala «QA-Manuale» senza leggere altri doc
- [ ] Ogni prova 🔴 ha sequenza numerata con nomi pulsante verificati
- [ ] §5 esclude tutto ciò coperto da E2E lifecycle + pro-service smoke + unit WP1
- [ ] FU-SERV-TURNO-SALA-1 ha prova con esito atteso **oggi** e nota «dopo fix P6»
- [ ] Stile COMUNICAZIONE_UTENTE: niente sigle in titoli prove

---

## Handoff a Matteo

Dopo chiusura istanza 2, Matteo:

1. Apre `COLLAUDO_MANUALE_OBBLIGATORIO.md`
2. Segue blocchi in ordine (può spezzare in sessioni)
3. Risponde con righe `T# — OK` o `T# — KO: …` (§4 del file)

Fix prodotto e chiusura FU → **prossima istanza** o seduta dedicata, non questa.
