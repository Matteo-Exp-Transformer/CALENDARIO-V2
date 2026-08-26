# Esiti — Collaudo manuale Servizio (parziali)

> Nota file: rinominato da `Report-…` a `Esiti-…` il 26-08-26 così non entra nel perimetro capsula MSS (`Report-`/`Verbale-`). Il report di chiusura completo resta `Report-chiusura-collaudo-checklist-servizio-26-08-26.md`.

**Data:** 26-08-2026 · **Branch:** `env/test` · **Ambiente:** TEST  
**Account:** Pro `tomas@t.com` · Classic `testc@c.com`  
**Fonte:** spunte/note in `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` + messaggi Matteo in chat · **non inventato**  
**WP-1:** resta **IN PILOTA ombra** — **non chiuso**

---

## 1. Stato collaudo

| Metrica | Valore |
|---|---|
| Prove totali | **26** |
| Fatte (`[x]` o `[O]`) al momento di questo report | **23/26** (poi allineato a **25/26** in chiusura 26-08 — vedi sotto) |
| Ancora aperte (storico di questo report) | **T5**, **T7-bis**, **T9** (3) |
| Stato ATTUALE (chiusura capitolo) | **25/26** — aperta solo **T7-bis**; T5 `[x]` con nota; T9 `[O]` non completabile per UI |
| Blocco rilascio 🔴 | T7-bis aperta; T9 debito UI |

> **Aggiornamento chiusura:** questo file resta la fonte dell’episodio Pro e del catalogo note; il conteggio ufficiale vive in `COLLAUDO_MANUALE_OBBLIGATORIO.md` e nel report `Report-chiusura-collaudo-checklist-servizio-26-08-26.md`.

Checklist aggiornata oggi: sequenze **T5 / T7-bis / T9** (e T8) riscritte in formato chiaro; D38 = nome checkbox UI.

---

## 2. Cosa Matteo ha fatto (dal file + chat)

- Setup **0-bis** e validazione **V1–V8** completate (alcune con nota `[O]`).
- Blocco rilascio: **T1–T4** fatte; **T5** ancora da fare (confusione su D38 chiarita in docs).
- Briefing/assegna: **T6–T8** fatte; **T7-bis** e **T9** aperte (confusione wording chiarita).
- Visivo + Calendario: **T10–T13** fatte (con note).
- Classic: **T14–T16** segnate fatte (`[O]` su T15/T16).
- Nota libera **T17** (libera prenotazione → tutti i tavoli): richiesta prodotto, fuori checklist 26.

---

## 3. Evento urgente — dati Pro «spariti» poi tornati

**Osservato da Matteo (in sequenza chat):**

1. Dopo switch account (tab Classic aperta + tab Pro): su Pro sembravano sparite le **prenotazioni**; screen Servizio senza sale (`Screenshot 2026-08-26 115258.png` / `115307.png`).
2. Poi: «ora le prenotazioni sono tornate nell’account pro».
3. Poi: «anche tavoli e sala.. bo non ho capito cosa è successo».

**Fatto certo:** UI Pro ha mostrato temporaneamente assenza di prenotazioni **e** di sale/tavoli; poi i dati sono **ricomparsi**. Matteo non ha cancellato nulla di proposito.

**Causa certa:** **non accertata** in questa seduta (zero analisi DB/log/sessione).

### Ipotesi etichettate (non verdetto)

| Ipotesi | Perché plausibile | Perché non basta |
|---|---|---|
| **A — Sessione / cookie confusi tra due tab** (Pro + Classic) | Coincide col racconto «ho cambiato account lasciando l’altra tab aperta» | Non abbiamo Network/Application panel né log auth |
| **B — Cache / query stale** (React Query, refetch) | I dati «tornati» dopo un po’/F5/navigazione tipico di cache | Non sappiamo se ha fatto F5, cambio tab, o attesa |
| **C — Vista/filtro sbagliato** (giorno Calendario, fascia Servizio, sala) | Può far sembrare «vuoto» il Calendario | Spiega meno bene **sale/tavoli** spariti in Lista Servizio |
| **D — Tenant / account sbagliato per un attimo** | Login Classic vs Pro su stesso browser | Screen e messaggio dicono `tomas@t.com`; non verificato lato token |
| **E — RLS / sessione auth a metà** | Sintomo «nessuna sala» se JWT non allineato al tenant | Dati tornati senza intervento DB → più tipico client/sessione che wipe |
| **F — Ambiente** (dev vs preview, URL sbagliato) | Possibile in collaudo multi-tab | Non dichiarato da Matteo |

**Non dichiarato:** wipe DB, migrazione, delete sale, bug cancellazione permanente.

**Follow-up se riparte:** vedi checklist nella risposta a Matteo (account, F5, giorno, sala QA, una sola sessione admin).

---

## 4. Problemi aperti / possibili bug prodotto (solo annotati)

| ID / zona | Sintomo (parole Matteo) | Stato |
|---|---|---|
| V1 | Contenitore mappa lascia spazio grigio | Nota UX |
| V3 | Messaggio overlap fasce confuso; testo «Coperti massimi…» incompleto | Nota |
| V5 | Limite walk-in non blocca oltre soglia | Atteso morbido? da confermare vs copy |
| T1 | Orari form non ordinati; prezzo a persona in riepilogo | Nota prodotto |
| T3 | Walk-in con tavolo non appare già assegnato in Servizio | Possibile bug |
| T4 | «Aggiungi tavolo» resta anche a posti pieni | Nota UX |
| T9 nota | Libera tavolo su prenotazione non ancora arrivata → resta in Calendario, sparisce da «da assegnare» | Possibile bug |
| T10 | Scroll pagina a 375px; idea metri vs pixel | Nota + idea FU |
| T11 | Su mobile in tab Servizio si può ancora assegnare / aprire Modifica | Nota FU mobile |
| T12 | Domanda: come riconosce il ritardo? | Chiarimento (non KO) |
| T13 | Non vede badge % mese; domanda logica giorno | Decisione/chiarimento |
| T15 | Classic: nessun orario nel form (screen 114900, 33 ospiti) | Possibile KO Classic / cap |
| T16 / evento Pro | Dati Pro assenti poi tornati | Ambiguo — vedi §3 |
| T17 | Liberare N tavoli uno a uno vs libera prenotazione | Richiesta prodotto |
| T7-bis | Incoerenza delete tavolo vs sala su turni | Debito noto `FU-SERV-TURNO-SALA-1` (atteso oggi) |

**Zero fix `src/`** in questa seduta.

---

## 5. Domande che richiedono decisione di Matteo

1. Priorità fix sulle note T3 / T9 (libera → da assegnare) / T15 Classic orari — sì/no e ordine?
2. T17 (libera tutta la tavolata in un click) — vuoi aprirlo come FU prodotto?
3. Se i dati Pro «spariscono» di nuovo: preferisci seduta debug sessione/multi-tab **prima** di finire T5/T7-bis/T9?

---

## 6. Chiarimenti docs fatti oggi (no codice)

- **D38** = checkbox **«Mantieni anche il limite coperti della fascia»** in Fasce orarie (non «Aggiungi fascia»).
- **T7-bis:** «T2» = tavolo chiamato T2; non «turno 2»; «secondo turno in coda» fuori scope.
- **T9:** le tre radio vanno provate sul tavolo già occupato (è il caso della modale).

---

## 7. Fuori perimetro

- Nessun commit/push richiesto.
- Nessuna dichiarazione «WP-1 chiuso».
- Cruscotto MSS: non rigenerato in questo giro (stato pilota invariato; solo avanzamento conteggio checklist).
