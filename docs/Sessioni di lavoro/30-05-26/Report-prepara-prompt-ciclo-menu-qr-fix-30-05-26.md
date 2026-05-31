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
| QA Matteo checklist 8 note | ✅ **#8 risolto su Pagina Prenota** (non QR) — [report finale](../31-05-26/Report-fix-prenota-mobile-sfondo-scroll-31-05-26.md) |
| Prompt B #8 footer sfondo | ❌ schermata sbagliata — revert + fix su Prenota ✅ |
| Prompt C FU-026 (polish admin) | ⬜ prossimo |
| Commit / merge ciclo Prenota | ✅ merge `env/test`→`main` (31-05-26) |
| QA 5 temi mobile (FU-021) | ⬜ checklist in FOLLOW_UP |

---

## QA Matteo — checklist 8 note (31-05-26)

| # | Esito | Nota |
|---|-------|------|
| 1 | **OK** | Fix 31-05-26 · **QA Matteo OK** (categorie + ingredienti, scroll corretto). |
| 2 | OK | |
| 2b | OK | |
| 3 | OK | |
| 3b | **OK** | Fix 31-05-26 · **QA Matteo OK** |
| 3c | OK | |
| 4 | OK | |
| 4b | OK | |
| 5 | OK | |
| 6 | **OK** | = 3b admin · **QA Matteo OK** |
| 7 | — | chiuso |
| 8 | **Misrouting** | Checklist diceva QR; Matteo: sintomo su **Pagina Prenota**. Fix Prompt B su QR da **revertare**. [Meta-analisi](../31-05-26/Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md) |
| extra | **OK** | Fix 31-05-26 · **QA Matteo OK** (apertura Modifica QR, console pulita). |
| Prenota compose | **OK** | Fix 31-05-26 · **QA Matteo OK** |

**Prossimo lavoro (agente successivo):** **Prompt C — FU-026** (icone matita/cestino in basso a destra su card Categorie Menu admin). Ciclo 8 note **chiuso** lato funzionale (#8 OK su Prenota). FU-021 checklist 5 temi mobile — opzionale.

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
| Handoff follow-up | Tabella **Ciclo · QA · FU** + **blocco copia-incolla** + **riepilogo fuori blocco** (cosa passi / cosa NON passi) |
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

**Prossima chat suggerita:** **SCRITTURA CODICE** — esecutore Prompt B (#8). Poi prepara-prompt valuta → C o commit.

---

## Chiusura prepara-prompt (aggiornamento 31-05-26 pomeriggio)

| Voce | Stato |
|------|--------|
| Ciclo 8 note | ✅ pianificato · ⏳ **#8** unico KO |
| QA Matteo | ✅ tutto tranne #8 · FU-025 ok · merge main ok |
| Handoff Prompt B | ✅ consegnato (copia-incolla + procedura post-esecutore) |
| Regola formato handoff | ✅ OSSERVAZIONI + PROPOSTE (in attesa) · ⚠️ anche `PREPARA_PROMPT` §3 — vedi § Deviazione processo |

### Deviazione processo — regola handoff due-parti (31-05-26)

**Cosa ha chiesto Matteo:** «annota» come deve rispondere l’agente su handoff/follow-up (formato: blocco copia-incolla + riepilogo fuori blocco).

**Protocollo skill (PREPARA_PROMPT §3 + §6, 31-05-26):** «suggerisci / annota» → **OSSERVAZIONI** + candidato **PROPOSTE**; **non** riformare skill system — promozione in `PREPARA_PROMPT_SKILL.md` / `VOCABOLARIO.md` solo **sessione Meta senior** (`REVISIONE.md`).

**Cosa ha fatto l’agente prepara-prompt in chat:** prima pianificato OSSERVAZIONI + PROPOSTE (corretto); poi ha **anche** scritto la regola in `PREPARA_PROMPT_SKILL.md` §3.

**Perché non allineato:** l’agente di lavoro/prepara-prompt **non fa Meta**. «Annota» registra un *dato* e una *proposta*; non promuove regole operative. Rischio concreto: `PROPOSTE.md` dice «in attesa ok Matteo» mentre §3 è già cambiato — chi apre solo PROPOSTE crede la regola non esista; chi apre §3 crede sia ratificata.

#### Perché l’agente si è confuso (dettaglio — sistema in affinamento)

1. **Due pipeline nello stesso ciclo, stesso file.** In pochi giorni su Menu QR erano già entrate in `PREPARA_PROMPT` §3 regole nate in chat (checklist 3 colonne, tabella Ciclo·QA·FU, «RAGIONAMENTO vs SCRITTURA CODICE») con note tipo «promozione Meta» ma **testo già nello skill**. L’agente ha generalizzato: *«se la regola è chiara e Matteo la vuole, finisce in §3»* — saltando il passaggio Meta.

2. **Verbo ambiguo «annota / dovremmo definire».** Matteo voleva fissare un *comportamento di risposta* (come per la checklist). L’agente ha letto «definiamo come risponde l’agente» = *aggiorna lo skill che governa prepara-prompt*, non «scrivi un dato grezzo per il revisore Meta». Manca nel vocabolario una voce Liv.1 tipo «annota formato handoff» distinta da «promuovi in PREPARA_PROMPT».

3. **Ruolo prepara-prompt vs Meta sovrapposti sullo stesso artefatto.** Prepara-prompt *usa* `PREPARA_PROMPT_SKILL.md` come manuale operativo e *può* averlo esteso in sessione per non bloccare Matteo. Meta *revisiona* le stesse regole. Senza confine esplicito al momento dell’azione («sto raccogliendo» vs «sto promuovendo»), l’agente ha scelto la via più veloce per il task immediato (handoff utili subito).

4. **Mancata pausa dopo il piano iniziale.** In thinking l’agente aveva scritto «OSSERVAZIONI + PROPOSTE only» — poi in un unico batch di edit ha aggiunto §3 per simmetria con le altre righe §3 del 31-05-26, **senza rileggere §6** («non riformare skill system») come veto.

5. **Contesto affinamento — normale.** Il sistema skill/comunicazione è giovane; regole Meta e regole operative convivono nello stesso file. Confusione attesa finché non c’è checklist binaria pre-commit doc: *raccogli* / *promuovi*.

#### Come avrebbe lavorato meglio (consiglio breve per agenti)

Prima di toccare `PREPARA_PROMPT` o `VOCABOLARIO` chiedersi:

| Domanda | Se sì → |
|---------|---------|
| Matteo ha detto «scrivilo in PREPARA_PROMPT» / «promuovi» / siamo in sessione Meta? | ok edit skill |
| Altrimenti: è solo «annota / suggerisci / dovremmo definire»? | **solo** OSSERVAZIONI + PROPOSTE + report; in chat dire a Matteo: «regola registrata in PROPOSTE; ratifica in sessione Meta o dimmi scrivilo in PREPARA_PROMPT» |

**Un solo passo in più evita l’errore:** completare OSSERVAZIONI + PROPOSTE, **fermarsi**, committare o consegnare report; **non** aggiungere §3 nello stesso turno salvo keyword esplicita.

**Decisione attuale:** **tenere** §3 (utile) · PROPOSTE «in attesa» · sessione Meta ratifica o allinea.

**Lezione one-liner:** *raccogliere ≠ promuovere* — prepara-prompt alimenta il sistema, Meta (o Matteo esplicito) lo modifica.

`prompt:~15 · correzioni:5 · FU:0 nuovi · alzata:no · handoff B + regola due-parti + merge main · deviazione processo: PREPARA_PROMPT edit non autorizzato da protocollo Meta`
