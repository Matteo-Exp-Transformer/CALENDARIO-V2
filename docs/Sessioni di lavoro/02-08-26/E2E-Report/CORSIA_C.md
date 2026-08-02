# Corsia C — Tavolate su più tavoli + responsive · report e2e

- Eseguita il: **2026-08-02 ~14:53 → 15:08** (Europe/Rome)
- Ambiente verificato: `VITE_SUPABASE_URL` → `docnnernvpyrbwuzzach` ✅ (non PROD)
- Sala/tavoli creati: **AG-C Sala** · `C-T1`·5, `C-T2`·5, `C-T3`·4, `C-T4`·2, più `C-T5`·6 (aggiunto per 2.3-5)
- Fascia usata: **Cena (19:31–22:30)** in sola lettura · Data di lavoro: **2026-08-07** (oggi + 5)
- Isolamento browser: **OK** — dopo login su `/admin/servizio`, snapshot a t0 e t+30s: stessa URL, stessi heading, nessun dialog/tenant/sezione cambiati da soli
- Branch: `env/test` (working tree non toccato da questa corsia)

## Esiti

| ID | Voce della checklist | Esito | Cosa ho visto | Prova |
|----|----------------------|-------|---------------|-------|
| 2.3-1 | Card `[C] Ferrari` → Assegna | OK | Modale «Assegna tavolo» con intestazione `[C] Ferrari` + `10 coperti` e contatore posti | corsia-C/2.3-1.png |
| 2.3-2 | Selezione `C-T1` + `C-T2` | OK | Spunte/ring su entrambi; testo esatto «Selezionati 2 tavoli · 10 posti su 10 richiesti» | corsia-C/2.3-2.png |
| 2.3-3 | Assegna 2 tavoli | OK | PRENOTAZIONI (0); ASSEGNATE (1) con riga «10 coperti · C-T1, C-T2 (10 posti)» | corsia-C/2.3-3.png |
| 2.3-4 | Posti insufficienti `[C] Conti` 12 su C-T3+C-T4 | OK | Riga «12 coperti · C-T3, C-T4 (6 posti)» + «Mancano 6 posti per questa tavolata.» | corsia-C/2.3-4.png |
| 2.3-5 | Aggiungi tavolo sulla riga Conti | OK | Modale «Aggiungi tavolo alla tavolata»: C-T3/C-T4 «Già in tavolata» disabled; aggiunto `C-T5` (6 posti): contatore da 6→12 su 12; «Mancano…» sparisce; riga finale «C-T3, C-T4, C-T5 (12 posti)» | corsia-C/2.3-5a.png, 2.3-5.png |
| 2.3-6 | Piantina stesso cliente | OK | Stesso nome su tutti i tavoli della tavolata (Ferrari su C-T1/C-T2; Conti su C-T3/C-T4[/C-T5]) | corsia-C/2.3-6.png (+ stati successivi in 2.3-4/5) |
| 2.3-7 | Annulla dopo assegnazione multipla | OK | Banner «[C] Ferrari su C-T1, C-T2» → Annulla: **entrambi** i tavoli tornano Libero; Ferrari torna in PRENOTAZIONI (1) | corsia-C/2.3-7.png |
| 2.3-8 | Briefing multi-tavolo | — | Non di questa corsia (corsia B) | — |
| 9-1 @375 | Servizio vista Servizio | OK | Overflow P8 false (scrollWidth=375); piantina nel riquadro | corsia-C/9-1-375.png |
| 9-1 @834 | idem | OK | scrollWidth=834 | corsia-C/9-1-834.png |
| 9-1 @1280 | idem | OK | scrollWidth=1280 | corsia-C/9-1-1280.png |
| 9-2 @375 | Vista Modifica | OK | Editor nascosto; messaggio «Da mobile la modifica della sala è nascosta: passa alla vista Servizio…» | corsia-C/9-2-375.png |
| 9-2 @834 | idem | OK | Editor visibile (larghezza ≥768) | corsia-C/9-2-834.png |
| 9-2 @1280 | idem | OK | Editor visibile | corsia-C/9-2-1280.png |
| 9-3 @375 | Modale sala (+ tavolo) | OK | «Nuova sala» leggibile, chiusa con Annulla. Modale tavolo non aperta a 375 (editor mobile nascosto — coerente con 9-2) | corsia-C/9-3-sala-375.png, 9-3-tavolo-375.png |
| 9-3 @834 | idem | OK | Sala + Aggiungi tavolo, entrambe chiuse con Annulla | corsia-C/9-3-sala-834.png, 9-3-tavolo-834.png |
| 9-3 @1280 | idem | OK | Come 834 | corsia-C/9-3-sala-1280.png, 9-3-tavolo-1280.png |
| 9-4 @375/834/1280 | Modale walk-in | OK | «Aggiungi walk-in» aperta, campi leggibili, chiusa con Annulla (nessuna scrittura) | corsia-C/9-4-{375,834,1280}.png |
| 9-5 @375/834/1280 | Modale briefing | OK | Titolo «Briefing pre-turno»; overflow pagina ok; chiusa senza azioni | corsia-C/9-5-{375,834,1280}.png |
| 9-6 @375/834/1280 | Modale Assegna multi | OK | Tavoli C-T* visibili/cliccabili; contatore «Selezionati…» leggibile; Annulla | corsia-C/9-6-{375,834,1280}.png |
| 9-7 | Finestra fine turno | NON APPLICABILE | Dipende dall’orologio su **oggi** — verificata dalla corsia B; chiedere a B lo screenshot | — |

## Bug trovati

Nessun bug funzionale sulle voci 2.3-1…2.3-7 e 9-1…9-6.

**Nota non bloccante (console):** warning React da `@dnd-kit` / `TableMap` — *«The final argument passed to useEffect changed size between renders»* (AbstractPointerSensor). Non ha bloccato le prove; utile da ripulire ma fuori scope collaudo funzionale.

**Nota operativa (non bug prodotto):** il primo tentativo di creare `[C] Conti` è finito sul giorno sbagliato (02/08) perché il pannello «Prenotazioni del giorno» restava su oggi dopo il click sulla cella del mese. La creazione corretta su **07/08** è stata rifatta forzando `input[type=date]=2026-08-07`. Resta quindi anche un `[C] Conti` spurio sul 02/08 (prefisso `[C]`, non cancellato).

## Errori di console

- Warning deprecazione `apple-mobile-web-app-capable` (irrilevante).
- Warning React dnd-kit su `TableMap` (vedi sopra).
- Nessun errore di rete/runtime applicativo oltre a questi.

## Cosa deve ricontrollare Matteo

1. **Giudizio estetico** delle screenshot responsive (leggibilità pulsanti/modali) — l’agente ha misurato solo overflow P8.
2. **9-7** fine turno: pezzo della corsia B.
3. Controvisione visiva di **AG-C Sala** su data **07/08** fascia **Cena**: Ferrari su C-T1+C-T2; Conti su C-T3+C-T4 con eventuale «Mancano 6 posti» (C-T5 era stato tolto con Annulla intermedio; stato finale sotto).
4. Eventuale pulizia del Conti spurio del **02/08** quando chiudi il collaudo.

## Stato lasciato sull'ambiente

- **Sala** `AG-C Sala` con tavoli `C-T1`…`C-T5` (C-T5 creato per 2.3-5).
- **Prenotazioni** (data 2026-08-07, Cena):
  - `[C] Ferrari` 10 coperti @20:00 — **riassegnata** a C-T1 + C-T2 a fine corsa (per controverifica).
  - `[C] Conti` 12 coperti @21:00 — assegnata a C-T3 + C-T4 (6 posti → avviso «Mancano 6 posti»).
- Extra: `[C] Conti` creato per errore sul **02/08** (non toccato oltre).
- **Nessuna** fascia modificata; D38 non toccato; limite walk-in non toccato; form pubblico non usato.
- Impostazioni globali: nessuna da ripristinare (corsia C).
