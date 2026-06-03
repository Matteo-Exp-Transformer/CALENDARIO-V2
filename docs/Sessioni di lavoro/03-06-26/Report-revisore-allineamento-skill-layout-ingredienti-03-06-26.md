# Report — Revisore: allineamento skill layout righe ingredienti (Prenota)

**Data:** 03-06-26  
**Modalità:** standard · **Profilo:** Revisore / Verifica  
**Stato:** ✅ **report finale** (appendice R4–R5 + § migliorie skill system)

---

## Cappello

- **Cosa è cambiato:** La skill layout Pagina Prenota (`BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md`) ora descrive il **layout stack** delle righe nel pannello ingredienti (titolo, descrizione, checkbox + prezzo, divisori) e corregge il riferimento obsoleto a `ItemPriceRow`.
- **Cosa resta:** valutazione Meta su regola «allineamento skill implicito» (non chiedere Sì/No a Matteo).
- **Serve una tua azione:** no (solo se vuoi promuovere le proposte in § migliorie a regola ufficiale).

---

## Cosa è stato fatto

1. **Revisione post-merge (chat precedente):** confermato che l’agente esecuzione 03-06 aveva **saltato** l’aggiornamento skill nonostante `CHIUSURA_SESSIONE.md` Parte B («allinea skill se mancante»); il codice su `main` era già corretto (`ComposeMenuItemPanelContent`).
2. **Spiegazione a Matteo:** differenza tra procedura, scelta agente («nessuno» in tabella skill del report layout card), e gap documentale (`ItemPriceRow` ancora citato in §5).
3. **Allineamento skill (questa chat):** §5 e nuova sottosezione §7 «Righe ingredienti — layout stack»; nota portal `z-[160]` senza sticky bar (rimossa 02-06-26).
4. **`npm run validate`** prima del commit docs.
5. **Polish (R4):** commenti `bookingMenuComposePanelLayout.ts`; OSSERVAZIONI pattern «agenti chiedono se allineare skill».
6. **Appendice report (R5):** § «Migliorie skill system e procedure» + prompt verbatim R4–R5.

---

## File toccati e perché

| File | Perché |
|------|--------|
| `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §5 `ComposeMenuItemPanelContent`; §7 stack + divisori + divieto wrap; z-index portal |
| `docs/Sessioni di lavoro/03-06-26/Report-revisore-allineamento-skill-layout-ingredienti-03-06-26.md` | Questo report |
| `docs/SESSION_LOG.md` | Riga indice sessione revisore |

---

## Test eseguiti e risultato

| Comando | Esito |
|---------|--------|
| `npm run validate` | ✅ **278** test pass |
| QA browser 375/900/1256 | Non ripetuto (solo docs; codice invariato) |
| Diff codice vs report layout card 03-06 | ✅ coerente prima dell’edit skill |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §5 + §7 stack ingredienti + z portal | Allineamento post-pivot 03-06-26; evita futuri task wrap |
| `Report-prenota-layout-card-ingredienti-03-06-26.md` | — (non modificato) | Report esecuzione resta storico; lacuna «nessuno skill» documentata lì |

---

## Dati comunicazione

### Frasi / comandi Matteo (conteggio)

| Voce | × |
|------|---|
| Profilo revisore: controlla lavori, commit/push/merge main se OK | 1 |
| «in che senso non è già aggiornato da agente con procedure di fine lavoro?» | 1 |
| «aggiornalo perfavore… report finale… dettagli, osservazioni, miei prompt. grazie.» | 1 |
| «sistema commento sticky + annota: mi chiedono se allineare skill» | 1 |
| «scrivi che agenti mi chiedono allineamento skill (implicito) + impressioni report» | 1 |

### Prompt di Matteo (verbatim)

#### R1 — Revisore merge

```
profilo : revisore ( guarda skill system ) 
sei agente revisore. 
controlla ultimi lavori svolti, se analisi approfondita è ok allora fi commit e push e merge con main .
segui procedure skill system. 
```

#### R2 — Chiarimento procedura skill

```
in che senso non è gia aggiornato da agente con procedure di fine lavoro? 
```

#### R3 — Allineamento skill + report

```
aggioranlo perfavore. revisiona se è tutto ok allora annota nel tuo report finale anche questi dettalgi.. piu tue osservazioni e i miei prompt. 
grazie. 
```

#### R4 — Polish commenti + OSSERVAZIONI

```
Opzionale rimasto: il commento in bookingMenuComposePanelLayout.ts che cita ancora «sticky bar z-200» — polish minore, non bloccante.   sistema e annota in osservazioni che mi viene chiesto di scegliere se allineare i file di skill system o no.
```

#### R5 — Report: agenti chiedono allineamento skill (implicito)

```
scrivi che agenti , mi chiedono se voglio allineare skill system. cosa che dovrebbe essere implicita. annota nel report tue impressioni e osservaizioni per migliorare skill system, e procedure che hai riscontrato. 
```

### Automatizzabile vs manuale

| Automatizzabile | Manuale |
|-----------------|--------|
| validate su commit docs | Revisore che confronta report «File skill: nessuno» vs `CHIUSURA_SESSIONE` Parte B |
| grep `ItemPriceRow` in docs vs codice | Giudizio se il gap è bloccante pre-merge |

---

## Analisi flusso prompt, efficienza e statistiche

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali Matteo | **5** (R1–R5) |
| Correzioni dopo 1ª risposta revisore | **1** (spiegazione gap skill → richiesta aggiornamento esplicito) |
| Follow-up in FOLLOW_UP.md | **0** |
| Turni codice | **0** (solo documentazione) |

**Cosa ha reso efficace R2:** domanda mirata sulla procedura → ha sbloccato il task docs saltato in chiusura esecuzione.

---

## La mia lettura della sessione ⭐ (revisore)

**Impressioni:** Il ciclo Prenota 02–03/06 ha aggiornato la skill layout per sticky bar e prezzi ingredienti, ma il pivot **stack** del 03-06 è rimasto solo nel codice e nel report esecuzione (tabella «nessuno»). `CHIUSURA_SESSIONE` Parte B è chiara; l’agente esecuzione ha applicato una eccezione non scritta («cambio locale»). Il revisore della prima chat ha validato merge senza checklist «skill §7.2 allineata».

**Difficoltà:** Matteo ha colto subito l’incoerenza («non è già aggiornato?») — segnale che la procedura fine lavoro deve essere **enforcement** del revisore, non opzionale.

**Pattern segnalato da Matteo (R5):** più agenti gli **chiedono** se vuole allineare lo skill system. Per lui è **implicito**: se il task ha cambiato comportamento/layout documentato, la skill va aggiornata in chiusura senza delegare la decisione al ristoratore.

**Voto revisore (sintetico):** sessione docs **OK**; debito chiuso; polish commenti + OSSERVAZIONI su `main` (`c46bfab`).

---

## Migliorie skill system e procedure (osservazioni revisore — dato per Meta, non implementate qui)

> Solo proposte. Promozione in regole/skill solo con sessione Meta + Matteo (`CHIUSURA_SESSIONE` «Cosa NON fare»).

### 1. Allineamento skill: da «opzionale / chiedi a Matteo» a obbligo silenzioso

| Problema riscontrato | Procedura esistente | Comportamento agente osservato | Proposta |
|----------------------|---------------------|--------------------------------|----------|
| Skill layout indietro rispetto al codice (`ItemPriceRow` vs `ComposeMenuItemPanelContent`) | `CHIUSURA_SESSIONE` Parte B: allinea skill se mancante | Esecuzione: tabella «nessuno»; revisore: «al prossimo giro» + chiede a Matteo | In **chiusura esecuzione** e **revisore**: se esiste skill area per la zona toccata → aggiornare nello stesso ciclo commit; in report scrivere **cosa** è stato allineato, non «vuoi che lo faccia?» |
| Matteo deve ripetere «aggiornalo» | Stesso | Due turni extra (R2, R3) | Voce in `comandi-base` o checklist revisore: **vietato** formulare allineamento skill come follow-up opzionale |

### 2. Ruolo revisore (profilo Verifica)

| Gap | Evidenza 03-06 | Proposta |
|-----|----------------|----------|
| Merge approvato con docs stale | `validate` OK ma §5 skill ancora con `ItemPriceRow` | Checklist pre-merge: `grep` nomi componenti rimossi / citati solo in `docs/per-ui-design-skill/` vs `src/` |
| Report esecuzione dice «nessuno skill» | Report layout card ingredienti | Revisore **flag** obbligatorio se file LOCK/layout (`BookingMenuCategoryCard`, `BookingRequestPage` griglia) nel diff |
| QA manuale | Non ripetuto; OK a vista Matteo | Accettabile; ma skill allineamento non dipende da QA browser |

### 3. Agente esecuzione — chiusura «lavoro ok»

| Gap | Proposta |
|-----|----------|
| Eccezione «cambio solo componente» per saltare skill | In tabella «File di skill aggiornati»: obbligo di riga **«nessuno — motivo»** solo se nessun file skill area esiste per quella feature; altrimenti aggiornare |
| Prompt verbatim saltati al primo lavoro ok | Già in OSSERVAZIONI + report layout card; rinforzare con hook / voce Liv.1 |
| Prop `showPhotoStrip` aggiunta e rimossa | Segnale over-engineering: in prepara-prompt per layout stretto proporre stack subito |

### 4. Coerenza documentazione ↔ sorgente

| File | Lacuna | Stato post-sessione |
|------|--------|---------------------|
| `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §7 stack assente | ✅ aggiornato `ab71c6f` |
| `bookingMenuComposePanelLayout.ts` | Commento sticky `z-200` | ✅ `820c2ba` |
| `OSSERVAZIONI.md` | Pattern «agenti chiedono se allineare skill» | ✅ `c46bfab` + questa appendice report |

### 5. Procedure che funzionano (da replicare)

- **Matteo corregge con domanda procedurale** («non è già aggiornato da fine lavoro?») → sblocca debito senza nuovo task codice.
- **Commit separati** codice vs docs — utile per ripristino.
- **`npm run validate`** come gate revisore prima di merge.
- **Report revisore separato** dall’esecuzione — traccia il gap processo senza riscrivere lo storico del report layout card.

### 6. Cosa NON chiedere più a Matteo (sintesi per agenti)

1. «Vuoi che aggiorni la skill / il contesto layout?» → **fare** se il diff lo richiede.
2. «Al prossimo giro posso…» per debiti già noti a fine sessione revisore.
3. Conferma merge se `validate` OK **senza** controllo skill area quando il task era layout Prenota.

---

## Derivazione errori

| # | Cosa | Causa | Evitabile |
|---|------|-------|-----------|
| E1 | Skill §5 citava `ItemPriceRow` dopo refactor | **errore agente** chiusura 03-06 (skip skill) + **revisore** non ha bloccato | Sì — allineare in report finale esecuzione o revisore |
| E2 | Suggerimento «al prossimo giro» nel messaggio revisore | **errore agente** — trattato come follow-up invece che debito procedura | Sì — applicare Parte B subito se gap noto |

---

## Cosa resta per la prossima sessione

- **Meta / revisore:** valutare promozione regola «allineamento skill implicito, non chiedere a Matteo» (VOCABOLARIO o `comandi-base`, non da agente di lavoro).
- Nessuna riga nuova in `FOLLOW_UP.md`.

---

## Review (commit)

- `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md`
- `docs/Sessioni di lavoro/03-06-26/Report-revisore-allineamento-skill-layout-ingredienti-03-06-26.md`
- `docs/SESSION_LOG.md`
