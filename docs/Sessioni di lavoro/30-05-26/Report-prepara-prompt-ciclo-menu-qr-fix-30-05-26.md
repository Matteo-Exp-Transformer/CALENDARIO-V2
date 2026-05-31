# Report — Prepara-prompt · ciclo fix Menu QR (30-05-26)

**Ruolo:** prepara-prompt (filtro a monte + handoff)  
**Branch:** `env/test`  
**Chiusura sessione:** 31-05-26

---

## Cosa ha fatto questa chat

| Fase | Output |
|------|--------|
| Interpretazione 8 note Matteo | Domande D1–D6 · 2 prompt (admin · pubblico) |
| Prompt 1 esecutore + revisione | Riserve mobile → prompt correttivo → **Approvato** |
| Prompt 2 esecutore | Report esecutore · revisione **da chiudere** (vedi handoff) |
| Skill comunicazione (raccolta) | `PREPARA_PROMPT_SKILL.md` §3 · handoff tabella · tipi sessione · `OSSERVAZIONI.md` |
| QA Matteo checklist 8 note | § QA Matteo — 6 OK · 3 KO · fix #1/extra OK 31-05-26 |

---

## Decisioni Matteo (vincolanti)

| ID | Scelta |
|----|--------|
| D1 | 2 prompt: admin · pubblico |
| D2 | Card verticali fino **700px** (stile Prenota); tap → pagina ingredienti |
| D3 | Icona per **singolo QR** (`menu_qrcode_categories.icon`, migrazione 042 TEST) |
| D4 | Conferma chiusura: modale QR + schermata **Categorie Menu**; resto app → **FU-023** |
| D6 | Carosello: placeholder «Esempio: …» · niente testo precompilato / fallback pubblico |
| #7 Primi piatti | Chiuso (delete+recreate) |

---

## Report collegati

| Sessione | File |
|----------|------|
| Prompt 1 esecutore | [Report-fix-menu-admin-modali-30-05-26.md](./Report-fix-menu-admin-modali-30-05-26.md) |
| Prompt 1 revisione + fix mobile | [Report-revisione-fix-menu-admin-modali-30-05-26.md](./Report-revisione-fix-menu-admin-modali-30-05-26.md) |
| Prompt 2 esecutore | [Report-fix-menu-qr-pubblico-mobile-30-05-26.md](./Report-fix-menu-qr-pubblico-mobile-30-05-26.md) |
| Prompt 2 revisione | ⬜ `Report-revisione-fix-menu-qr-pubblico-mobile-30-05-26.md` (se assente → revisore non chiuso) |

**Smoke QA:** `/menu/test-pro/qr/x7zuud5` · tenant TEST `test-pro`

---

## Ciclo Menu QR (fix note 30-05-26)

| Fase | Stato |
|------|--------|
| Prompt 1 admin | ✅ Approvato |
| Prompt 2 pubblico esecutore | ✅ report |
| Prompt 2 revisione | ⏳ verificare report revisione |
| QA Matteo checklist 8 note | ⬜ parziale — #1 + extra **OK** Matteo 31-05-26; restano KO #3b/#6/#8 (vedi § QA Matteo) |
| Commit / merge | ⬜ Matteo |
| QA 5 temi mobile (FU-021) | ⬜ checklist in FOLLOW_UP |

---

## QA Matteo — checklist 8 note (31-05-26)

| # | Esito | Nota |
|---|-------|------|
| 1 | **OK** | Fix 31-05-26 · **QA Matteo OK** (categorie + ingredienti, scroll corretto). |
| 2 | OK | |
| 2b | OK | |
| 3 | OK | |
| 3b | **KO** | View **479–700px** (e admin **640–768** = #6): layout ibrido vecchio, card mal configurate — QR cliente + schermata Categorie Menu. **Sessione dedicata.** |
| 3c | OK | |
| 4 | OK | |
| 4b | OK | |
| 5 | OK | |
| 6 | **KO** | = 3b (640–768px titolo card categorie admin) |
| 7 | — | chiuso |
| 8 | **KO** | Scroll footer homepage QR: salto sfondo **ancora presente** |
| extra | **OK** | Fix 31-05-26 · **QA Matteo OK** (apertura Modifica QR, console pulita). |

**Prossimo lavoro suggerito:** QA Matteo su #1/extra post-fix · prompt viewport 479–700 (#3b/#6) · prompt P2-lite (#8). Report fix: [Report-fix-menu-admin-scroll-modale-31-05-26.md](../31-05-26/Report-fix-menu-admin-scroll-modale-31-05-26.md).

---

Mappa note iniziali → dove verificare. Smoke: `/menu/test-pro/qr/x7zuud5` · admin tab **Menu**.

| # | Cosa avevi chiesto | Dove guardare | OK se… |
|---|-------------------|---------------|--------|
| **1** | Scroll al form quando modifichi/crei **categoria** (come già fa l’ingrediente) | Tab Menu → **Categorie Menu** → Modifica card in fondo | Ti porta **su** al form titolo |
| **1b** | Stesso scroll **ovunque** (futuro) | — | **Non fatto** — solo categorie + ingrediente; resto in follow-up |
| **2** | Etichetta carosello: placeholder «Esempio: Specialità della casa», niente precompilato | Modale **Impostazione Menù QR** → carosello | Campo vuoto + suggerimento grigio; niente testo già scritto |
| **2b** | Niente «Specialità della casa» fantasma sul carosello **cliente** | Link menu QR → foto che scorrono | Se non hai scritto etichetta in admin, **non** compare da sola |
| **3** | Menu QR mobile: card categorie **verticali stile Prenota** (≤700px); tap → pagina piatti | Link QR su **telefono** | Card grandi verticali; tap apre ingredienti |
| **3b** | Tab categorie in alto: testo + icona allineati | Stessa homepage QR | Pill allineate; icona se scelta in modale |
| **3c** | Senza foto: **icona** scelta in modale (non emoji) | Modale QR (admin) + homepage cliente | Scegli icona → Salva → cliente la vede |
| **4** | Tema **rustic terracotta** mobile = stesso sfondo desktop | Homepage QR, tema terracotta, telefono | Stesso PNG body del desktop |
| **4b** | Audit **tutti e 5 temi** | Cambia tema in modale QR, ricontrolla mobile | Checklist **FU-021** (5 spunte) |
| **5** | Chiudi modale **senza Salva** → chiedi conferma | Modale QR + schermata **Categorie Menu** | Compare «Uscire senza salvare?» |
| **5b** | Stesso comportamento **tutta l’app** | — | **Non fatto** → **FU-023** |
| **6** | Card categorie admin: titolo **orizzontale** su mobile | Tab Menu → Categorie Menu, telefono | «Antipasti» leggibile, non verticale |
| **7** | Errore «Primi piatti» duplicate key | — | **Chiuso** — delete+recreate; nessun fix codice |
| **8** | Scroll footer homepage QR: sfondo **non salta** | Link QR → scorri fino in fondo e torna su | Sfondo stabile, no flash |

**Prompt 1** = righe 1, 2, 5, 6, 3c (admin), 7 · **Prompt 2** = righe 3, 3b, 3c (pubblico), 4, 8.

---

## Dati comunicazione

### Formato verso Matteo (emerso in sessione)

| Preferenza | Dettaglio |
|------------|-----------|
| Checklist | Tabella **Dove \| Cosa fai \| OK se** — max poche righe |
| Linguaggio | Nomi **schermata in app** (Categorie Menu, modale QR) — no overlay/guard/eyebrow |
| Lunghezza | Token minimi in pianificazione; spiegazioni lunghe **solo se chiede** |
| Decisioni | A/B/C + riga **Raccomandato:** |
| Ciclo multi-agente | Tabella fasi + checklist `- [ ]` sempre insieme |
| Handoff follow-up | Tabella **Ciclo · QA · FU** (max 8 righe) **prima** del blocco copia-incolla |
| Prossima chat | Riga esplicita: **RAGIONAMENTO** (prepara-prompt) vs **SCRITTURA CODICE** (esecutore) |
| «Suggerisci / annota» | Solo chat + OSSERVAZIONI/PROPOSTE — **non** riformare skill system (sessione Meta) |

### Regole annotate in PREPARA_PROMPT (31-05-26) — promozione solo Meta senior

| Regola | File |
|--------|------|
| Checklist compatta 3 col | §3 30-05-26 |
| Handoff tabella Ciclo·QA·FU | §3 31-05-26 |
| Suggerisci ≠ aggiornare skill | §3 + §6 31-05-26 |
| Ragionamento vs scrittura codice | §3 31-05-26 |

### Frasi / correzioni utili (per revisore Meta)

| Input Matteo | Cosa intendeva / esito |
|--------------|----------------------|
| «overlay categorie» nella checklist | Non capito → significa **schermata Categorie Menu** (tab Menu) |
| «troppo testo, non leggo i token» | Checklist revisore troppo verbosa → versione tabella compatta |
| «perfetto così capisco» | Modello checklist 3 colonne da replicare |
| «email prod=test causa duplicate?» | No cross-DB; errore solo dentro tenant TEST |
| «cancellato Primi piatti e ricreato» | Punto 7 chiuso senza fix codice |
| D1–D6 (2 prompt, 700px, icona QR, guard, placeholder) | Decisioni vincolanti — non riaprire |
| «suggerisci follow-up con tabella» | Modello Ciclo·QA·FU + tipo prossima chat |
| «suggerisci / annota» ≠ skill system | Raccogli in OSSERVAZIONI; riforma solo Meta |

### Termini che funzionano vs evitare

| Usare con Matteo | Evitare in checklist |
|------------------|---------------------|
| Tab Menu, schermata Categorie Menu, modale Impostazione Menù QR | overlay, guard, eyebrow, draft dirty |
| Link menu QR, homepage cliente, Pagina Prenota | PublicMenuPage, scrollIntoView, FU-023 (salvo handoff agente) |
| «Uscire senza salvare?» | DiscardChangesConfirmModal |
| Prossima chat: RAGIONAMENTO / SCRITTURA CODICE | — |

### Regole promosse nello skill system

- Vedi tabella «Regole annotate» sopra — implementate in `PREPARA_PROMPT_SKILL.md`; promozione definitiva → sessione Meta (`REVISIONE.md`).

### Automatizzabile / riuso

- Checklist 8 note → riusabile come smoke post-merge Menu QR
- FU-021 checklist 5 temi → stessa struttura tabella per QA temi mobile
- Handoff prepara-prompt → blocco copia-incolla in `Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md`

---

## Follow-up rilevanti prossimo lavoro

| ID | Nota |
|----|------|
| FU-021 | Checklist 5 temi homepage mobile — spuntare post-revisione P2 |
| FU-023 | Guard modale su tutta admin (fuori Prompt 1) |
| FU-019 | Pagine figlia categoria/preset — fuori scope P2 |
| Deploy | Migrazione `042` su PROD al merge commerciale |

---

**Prossima chat suggerita:** **RAGIONAMENTO** — prepara-prompt: prompt viewport 479–700 (#3b/#6) + correttivo #8 sfondo scroll.

---

## Chiusura prepara-prompt

| Voce | Stato |
|------|--------|
| Ciclo pianificazione 8 note | ✅ prompt P1/P2 + correttivi + revisioni consegnati |
| QA Matteo | ⏳ 3 KO aperti (#3b/#6/#8) |
| Handoff agente successivo | Report + `PREPARA_PROMPT` §3 + tabella QA § sopra |
| Sessione Meta skill | ⬜ dati in OSSERVAZIONI — niente riforma VOCABOLARIO qui |

`prompt:~12 · correzioni:4 · FU:1 · alzata:no · handoff+QA+regole comunicazione 31-05-26`
