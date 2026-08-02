# Corsia B — Servizio dal vivo · report e2e

- Eseguita il: **2026-08-02 14:52 → 15:18** (Europe/Rome)
- Ambiente verificato: `VITE_SUPABASE_URL` → `docnnernvpyrbwuzzach` ✅
- Sala/tavoli creati: **AG-B Sala** · `B-T1`(2), `B-T2`(4), `B-T3`(4), `B-T4`(6)
- Fascia usata: **Pranzo (11:31–15:30)** in sola lettura (ora corrente ~14:52–15:18 cadeva dentro Pranzo; nessuna `AG-B` creata). Data di lavoro: **2026-08-02**
- Limite coperti walk-in di partenza: **20** → ripristinato a **20** a fine corsa
- Isolamento browser: **OK** (MCP `user-playwright-corsia-B`; dopo 30s su `/admin/servizio` nessun cambio di sezione/modale/tenant)

## Esiti

| ID | Voce della checklist | Esito | Cosa ho visto | Prova |
|----|----------------------|-------|---------------|-------|
| 3-1 | B-T1 In arrivo | OK | Dopo assegnazione `[B] Arrivo` (15:20) → title `B-T1 — In arrivo — [B] Arrivo, 2 coperti` (ciano) | corsia-B/3-stati.png |
| 3-2 | B-T2 Occupato automatico | KO | `[B] Presente` ore **14:50** (passato): restava **In arrivo** anche dopo **≥45s** senza reload. Calendario mostra 14:50 corretto. | corsia-B/3-stati.png |
| 3-3 | B-T3 In ritardo | KO | `[B] Ritardo` ore **14:30** (>15' di ritardo): restava **In arrivo**, non rosso. | corsia-B/3-stati.png |
| 3-4 | B-T4 In uscita | KO | `[B] Uscita` 12:00 e poi `[B] FineTurno` 11:35: stato **In ritardo**, mai **In uscita**; nessuna finestra fine turno. | corsia-B/3-stati.png, corsia-B/2.2-attempt.png |
| 3-5 | Piantina ↔ elenco stessi stati | OK | Nella modale Assegna e in piantina gli stessi tavoli portavano le stesse etichette (anche se sbagliate rispetto all’orologio a muro). | corsia-B/3-5.png |
| 3-6 | Turni esauriti | BLOCCATO | Fascia attiva = **Pranzo** condivisa (`Illimitata`), non modificabile dalla corsia B. Finestra libera che contenga l’ora attuale non disponibile (Pranzo fino 15:30, poi gap fino Aperitivo 16:30). | — |
| 3-7 | Tavolo occupato / Libera e assegna | OK | Assegnando `[B] Sostituzione` su B-T2 già occupato: compare **«Tavolo occupato: conferma la sostituzione»** + **Libera e assegna**. Dopo conferma B-T2 = Sostituzione e `[B] Presente` torna in Prenotazioni. Nota UX: la conferma stare sotto la modale Assegna (bisogna chiudere Assegna con Annulla per cliccare Libera e assegna). | corsia-B/3-7.png, corsia-B/3-7b.png |
| 2.2-1 | Finestra «Tavolo a fine turno» auto | BLOCCATO | Nessun tavolo AG-B è mai passato a **In uscita** → la finestra non è partita. | corsia-B/2.2-attempt.png |
| 2.2-2 | Ora fine turno corretta | BLOCCATO | Dipende da 2.2-1. | — |
| 2.2-3 | Ancora occupato | BLOCCATO | Dipende da 2.2-1. | — |
| 2.2-4 | Libero | BLOCCATO | Dipende da 2.2-1. | — |
| 2.2-5 | Decido dopo + elenco multiplo | BLOCCATO | Dipende da 2.2-1. | — |
| 2.2-6 | Cambio fascia azzera gestiti | BLOCCATO | Dipende da 2.2-1. | — |
| 5-1 | Walk-in 4 senza tavolo | KO | Con sale/tavoli presenti il form **richiede** Sala * e Tavolo * («Seleziona un tavolo.»). Non esiste percorso UI «solo coperti». | — |
| 5-2 | Walk-in su tavolo libero | OK | `[B] WalkFree` su B-T1 libero → title `B-T1 — In arrivo — [B] WalkFree, 2 coperti`; compare in Home «Prossime 3 ore». | corsia-B/5-2.png |
| 5-3 | Walk-in su tavolo occupato (2 click) | OK | 1° click: avviso stabile «tavolo occupato / forza sostituzione»; dopo 1s testo invariato (non lampeggia). | corsia-B/5-3.png |
| 5-4 | Cambio tavolo azzera conferma | OK | Cambiando B-T2→B-T3 l’avviso torna al testo di primo passaggio; serve di nuovo il 2° click. | corsia-B/5-4.png |
| 5-5 | Limite walk-in morbido | OK* | Limite portato a **2**; creato `[B] WalkLimit` da **4** (non ha bloccato). *Avviso dedicato al limite walk-in non visto in modo chiaro* (è comparso soprattutto l’avviso tavolo occupato). Limite **ripristinato a 20**. | corsia-B/5-5.png, corsia-B/5-5-limit.png |
| 5-6 | Nessuna fascia attiva | NON APPLICABILE | Durante le prove c’era Pranzo attiva. | — |
| 6-1 | Filtro fascia reali | OK | Briefing: Tutti, AG-D, Colazione, Pranzo, Aperitivo, Cena, **Notturna** (scavalla mezzanotte). | corsia-B/6-briefing.png |
| 6-2 | Orari a video senza +2h | OK | `[B] Uscita` 12:00, `[B] Ritardo` 14:30, `[B] Presente` 14:50, `[B] Arrivo` 15:20 — coincidenti col Calendario, nessuno spostamento di 2 ore. | corsia-B/6-briefing.png |
| 6-3 | Colonna Tavolo multi-sala | OK | Esempi: `AG-B Sala · B-T3`; non assegnate `—`; tavolata `AG-B Sala · B-T3, B-T4`. | corsia-B/6-briefing.png |
| 6-4 | PDF | SEMI — scaricato, da aprire | File: `docs/_lavoro/e2e-s4/corsia-B/briefing-2026-08-02-giornata-completa.pdf` | PDF + 6-briefing.png |
| 2.3-8 | Tavolata multi-tavolo in briefing | OK | `[B] Tavolata` 10 coperti assegnata a B-T3+B-T4; briefing: **`AG-B Sala · B-T3, B-T4`**. | corsia-B/2.3-8.png |

\*5-5: soft-non-blocco verificato; qualità dell’avviso testuale sul limite walk-in da ricontrollare a mano.

## Bug trovati

### BUG-B1 — Stati live tavolo non seguono l’orologio a muro (grave)
- **Dove:** Servizio → Mappa → vista Servizio (piantina)
- **Atteso:** con arrivo passato → Occupato; oltre 15' → In ritardo; oltre durata+buffer → In uscita
- **Visto:** `[B] Presente` 14:50 e `[B] Ritardo` 14:30 restano **In arrivo**; `[B] Uscita` 12:00 e `[B] FineTurno` 11:35 restano **In ritardo** (mai In uscita), anche dopo ≥45s senza reload
- **Nota:** Calendario e pannello dettaglio mostrano l’ora a muro corretta (`arrivo 12:00`). Gli stati usano `confirmed_start` / `confirmed_end` (ISO), non `desired_time`
- **Riproduzione:** creare prenotazioni admin oggi con orari passati nella fascia attiva, assegnarle, attendere ≥40s, leggere il `title` del tavolo
- **Prove:** `3-stati.png`, `2.2-attempt.png`

### BUG-B2 — Walk-in «senza tavolo» non fattibile se esistono sale con tavoli
- **Atteso (checklist 5-1):** walk-in da 4 senza assegnare tavolo, che conti +4 in Calendario
- **Visto:** validazione «Seleziona un tavolo.» obbligatoria appena si sceglie una sala con tavoli
- **Riproduzione:** Home → Aggiungi walk-in → sala AG-B → non scegliere tavolo → Aggiungi

### BUG-B3 (UX) — Conferma «Tavolo occupato» sotto la modale Assegna
- La card/modale «Tavolo occupato: conferma la sostituzione» resta sotto `[role=dialog]` Assegna; il click su **Libera e assegna** viene intercettato dall’overlay finché non si chiude Assegna con Annulla
- Funzione ok dopo il workaround; da migliorare per lo staff

## Errori di console
- Nessun errore JS applicativo
- Solo warning deprecazione `<meta name="apple-mobile-web-app-capable">` (ignorabile)

## Cosa deve ricontrollare Matteo
1. **BUG-B1** stati live (Occupato / In ritardo / In uscita) — bloccante per tutta la sezione 2.2
2. Aprire il **PDF** briefing e verificare gli orari
3. **5-1 / 5-5:** se il walk-in senza tavolo e l’avviso del limite walk-in sono ancora requisiti di prodotto
4. UX stacking modale Assegna vs «Tavolo occupato» (3-7)
5. Controprova dati lasciati: sala AG-B, prenotazioni `[B] *`, walk-in `[B] Walk*`

## Stato lasciato sull'ambiente
- **Resta:** sala `AG-B Sala`, tavoli B-T1..B-T4, prenotazioni `[B] Arrivo|Presente|Ritardo|Uscita|Sostituzione|FT*|Walk*|Tavolata|FineTurno` (alcune duplicate Tavolata da retry)
- **Fascia:** Pranzo non toccata; **nessuna** fascia `AG-B` creata
- **Ripristinato:** limite coperti walk-in → **20**; D38 non toccato; max_turns Pranzo non toccato
- **Non cancellato** nulla (come da regole)

## Riepilogo numerico
- **OK:** 11 (3-1, 3-5, 3-7, 5-2, 5-3, 5-4, 5-5*, 6-1, 6-2, 6-3, 2.3-8)
- **SEMI:** 1 (6-4 PDF)
- **KO:** 4 (3-2, 3-3, 3-4, 5-1)
- **BLOCCATO:** 7 (3-6 + 2.2-1…2.2-6)
- **NON APPLICABILE:** 1 (5-6)
