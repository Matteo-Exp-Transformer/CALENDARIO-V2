# Riprova B — Servizio dal vivo (post FIX-1 / FIX-2) · report e2e

- Eseguita il: **2026-08-02 19:53 → 20:20** (Europe/Rome)
- Ambiente verificato: `VITE_SUPABASE_URL` → `docnnernvpyrbwuzzach` ✅
- Sala/tavoli creati: **AG-B2 Sala** · `B2-T1`(2), `B2-T2`(2), `B2-T3`(2), `B2-T4`(2)  
  (i posti target 2/4/4/6 non sono stati applicati correttamente in creazione: restano tutti a 2 — non ha bloccato le prove di stato/turni)
- Fascia usata: **AG-B2 (19:00–22:00)**, `max_turns = 1`, intervallo arrivo 15′, `turnover_buffer_minutes = 0`  
  · Data di lavoro: **2026-08-02**
- Isolamento browser: **OK** (MCP `user-playwright-corsia-B`; dopo 30s su `/admin/servizio` nessun cambio di sezione/modale/tenant)
- Pre-check `served_at` (mig. 066): **OK** — colonna presente su TEST (CLI); scrittura `served_at` su `[B2] Uscita` senza errore PGRST204 in console

## Nota di setup importante

Alle ~19:55 l’ora corrente cadeva in **Cena (19:31–22:30)**. Non esisteva una finestra libera che contenesse «adesso».  
Ho comunque creato **AG-B2 19:00–22:00** con 1 turno: l’app **ha accettato la sovrapposizione** con Aperitivo e Cena (nessun messaggio di overlap). Annotato come comportamento da ricontrollare (le fasce non dovrebbero sovrapporsi).

Durata pasto admin osservata: **180 minuti** (`confirmed_end = start + 180'`). Con buffer 0, «In uscita» per un arrivo 19:00 scatta solo alle **22:00** — non alle ~20:10. Questo ha bloccato tutta la sezione 2.2 / 9-7 in questa finestra oraria.

## Esiti

| ID | Voce | Esito | Cosa ho visto | Prova |
|----|------|-------|---------------|-------|
| pre | Colonna `served_at` | OK | Colonna presente; `[B2] Uscita` ha ricevuto `served_at` al libera tavolo; 0 errori PGRST204 | CLI + console |
| 3-1 | B2-T1 In arrivo | OK | Arrivo atteso **20:15**, ora ~**20:10** → title `B2-T1 — In arrivo — [B2] Arrivo, 2 coperti` | riprova-B/3-stati.png |
| 3-2 | B2-T2 Occupato | OK | PresenteOk arrivo **20:00**, ora ~**20:10** (<15′) → `B2-T2 — Occupato — [B2] PresenteOk, 4 coperti` | riprova-B/3-stati.png |
| 3-3 | B2-T3 In ritardo | OK | Ritardo arrivo **19:30**, ora ~**20:10** (>15′) → `B2-T3 — In ritardo — [B2] Ritardo, 4 coperti` | riprova-B/3-stati.png |
| 3-4 | B2-T4 In uscita | KO / non raggiungibile ora | Uscita arrivo **19:00**, `confirmed_end` **22:00**, buffer 0 → alle 20:10 resta **In ritardo** (atteso: Occupato/In ritardo fino a 22:00, non In uscita). Atteso orologio: In uscita **≥ 22:00**. | 3-stati.png + DB |
| 3-5 | Piantina ↔ elenco | OK | Stesse etichette title/aria sui tavoli e in Assegnate | 3-stati.png |
| 3-6 | Turni esauriti (assegna→libera→riassegna) | OK | Su B2-T4 dopo libera: in modale `Turni esauriti` + `0 turni residui`; click → modale si chiude; in pagina riquadro «Turni esauriti per questo tavolo» con Motivo + **Assegna comunque** subito cliccabile | riprova-B/3-6-turni-esauriti.png |
| fascia chiusa | Chiudi servizio AG-B2 | OK | Badge tavolo **Fascia chiusa** (non «Turni esauriti»); banner «La fascia è chiusa: riaprila per assegnare i tavoli»; pulsante **Assegna tavolo** disabled | riprova-B/fascia-chiusa.png |
| 2.2-1…2.2-6 | Avviso fine turno | BLOCCATO | Nessun tavolo AG-B2 in **In uscita** entro le 20:20 (durata 180′). | — |
| 9-7 | Pulsanti fine turno a 375px | BLOCCATO | Dipende da 2.2-1. | — |
| arch-a | Libero da finestra fine turno | BLOCCATO | Dipende da 2.2. | — |
| arch-b | Libera tavolo da piantina | OK | `[B2] Uscita` liberata: `served_at` valorizzato; prenotazione resta in DB (status accepted); tavolo torna Libero; non è ricomparsa come da assegnare | DB |
| arch-c | Annulla subito dopo assegna | OK | Dopo Annulla su B2-T4: tavolo Libero; in modale riprovando: **1 turno residuo** (turno non consumato); prenotazione di nuovo assegnabile | osservato in UI |
| arch-d | Libera e assegna | OK* | Compare «Tavolo occupato: conferma la sostituzione» + **Libera e assegna** (modale Assegna già chiusa). La scavalcata `[B2] PresenteOk` è tornata in elenco (`hasPresenteOk=true`). *Assegnazione di prova ha preso anche `[C] Conti` per un click ambiguo, poi Annullata.* | UI |
| arch-e | Tavolata 2 tavoli, libera uno | BLOCCATO | Tentativo interrotto (timeout modale / overlap click piantina). Non verificato in questa corsa. | — |

\*arch-d: funzione ok; attenzione UX se in lista ci sono card di altre corsie sulla stessa fascia sovrapposta.

## Bug / osservazioni

### OBS-RB1 — Sovrapposizione fasce accettata (setup)
- **Atteso (piano):** le fasce non possono sovrapporsi.
- **Visto:** AG-B2 19:00–22:00 salvata sopra Aperitivo/Cena senza errore.
- **Effetto collaterale:** in Servizio su AG-B2 compaiono anche prenotazioni di altre date/corsie (es. `[C] Conti`) → rischio click sbagliati in automazione e confusione staff.

### OBS-RB2 — «In uscita» non collaudabile con durata 180′ in fascia serale corta
- Con start 19:00 e fine pasto 22:00, la prova «3 ore fa → In uscita» del prompt non è realizzabile dentro AG-B2 iniziata alle 19:00.
- Per riprove future: o fascia più lunga/indietro nel tempo, o durata pasto più corta sul tipo prenotazione, o collaudo dopo `confirmed_end`.

### FIX-1 (orologio) — confermato sui casi collaudabili
- In arrivo / Occupato / In ritardo allineati all’orologio a muro (niente +2h).

### FIX-2 (turni / forzatura / served_at) — confermato sui casi collaudabili
- Badge turni residui + Turni esauriti + Assegna comunque senza chiudere a mano.
- Fascia chiusa distinta da turni esauriti.
- Annulla non consuma turno.
- `served_at` al libera tavolo.

## Errori di console
- Nessun errore JS applicativo / nessun PGRST204.
- Solo warning deprecazione meta apple-mobile (ignorabile).

## Cosa deve ricontrollare Matteo
1. **Avviso fine turno (2.2)** a mano dopo le 22:00 su un tavolo con fine pasto passata, oppure con durata più corta.
2. Se la **sovrapposizione fasce** accettata è un difetto di prodotto (OBS-RB1).
3. **arch-e** (tavolata multi-tavolo: archivia solo all’ultimo libera).
4. Controprova screenshot `riprova-B/3-stati.png` e `3-6-turni-esauriti.png`.
5. PDF briefing / walk-in restano fuori da questa riprova (non richiesti dal prompt RIPROVA-B).

## Stato lasciato sull'ambiente
- **Resta:** sala `AG-B2 Sala`, tavoli B2-T1..B2-T4, fascia **AG-B2** (19:00–22:00), prenotazioni `[B2] *` (alcuni duplicati Arrivo/Presente da retry).
- **`[B2] Uscita`:** `served_at` valorizzato (archiviata dal cassetto).
- **Ripristinato:** AG-B2 **riaperta** con `max_turns = 1` (≠ 0) ✅
- **Non toccato:** dati primo giro AG-B / `[B] *`, D38, limite walk-in
- **Non cancellato** nulla

## Riepilogo numerico
- **OK:** 3-1, 3-2, 3-3, 3-5, 3-6, fascia chiusa, arch-b, arch-c, arch-d*, pre-check served_at
- **KO / non raggiungibile ora:** 3-4 (In uscita)
- **BLOCCATO:** 2.2-1…2.2-6, 9-7, arch-a, arch-e
