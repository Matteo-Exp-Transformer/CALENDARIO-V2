# Corsia A — Le due viste della mappa · report e2e

- Eseguita il: 2026-08-02 ~14:51 → ~15:10 (ora locale)
- Ambiente verificato: VITE_SUPABASE_URL → docnnernvpyrbwuzzach… ✅
- Sala/tavoli creati: `AG-A Sala` · `A-T1`·2, `A-T2`·4, `A-T3`·4, `A-T4`·6
- Fascia usata: **Cena** (19:31–22:30) · Data di lavoro: **2026-08-09** (oggi+7)
- Prenotazioni: `[A] Rossi` 4 coperti ore 20:00 · `[A] Bianchi` 2 coperti ore 20:30
- Setup assegnazione: `[A] Rossi` → `A-T2` (poi liberato in 2.1-5)
- Isolamento browser: **OK** (snapshot `/admin/servizio` a t0 e t0+35s identici; nessun cambio sezione/modale/tenant)
- Branch: `env/test` (status pulito all’avvio)
- Server: `npm run dev` avviato su `http://localhost:5173` (non rispondeva all’inizio)

## Esiti

| ID | Voce della checklist | Esito | Cosa ho visto | Prova |
|----|----------------------|-------|---------------|-------|
| 2.1-1 | toggle Servizio\|Modifica, apre su Servizio, piantina senza griglia | OK | Tab Mappa → toggle **Servizio** / **Modifica** presente; di default attivo **Servizio** con testo «Sala a servizio…». Piantina AG-A senza griglia CSS; tavoli nelle posizioni salvate. | corsia-A/2.1-1.png |
| 2.1-2 | nome / cliente·coperti / posti; legenda 5 stati | OK | Legenda sopra la piantina: Libero, In arrivo, Occupato, In ritardo, In uscita. Liberi: «N posti». `A-T2` assegnato: «[A] Rossi» + «4 cop» / aria-label «In arrivo». | corsia-A/2.1-2.png |
| 2.1-3 | Modifica: griglia + Aggiungi tavolo; una sola mappa | OK | Clic **Modifica** → «Modifica disposizione: sposta i tavoli sulla griglia…», canvas con griglia 20px, «Aggiungi tavolo», 4 tavoli A-T*. Spariscono assegnazione/legenda Servizio: non due mappe insieme. | corsia-A/2.1-3.png |
| 2.1-4 | sposta A-T3 in Modifica → torna Servizio | OK | Drag `A-T3` (viewport 1280: sotto 768 il drag è disabilitato). Bounding box Modifica y 578→518. Torna **Servizio**: editor sparisce, piantina torna; `A-T3` nella nuova posizione (finisce sovrapposto a `A-T2` — effetto della mossa, non blocco). | corsia-A/2.1-4.png |
| 2.1-5 | click tavolo occupato → Libera tavolo; prenotazione resta | OK | Popup su `A-T2`: «In arrivo · 4 posti», «[A] Rossi, 4 coperti», «arrivo 20:00», pulsante **Libera tavolo**. Dopo: `A-T2 — Libero — 4 posti`. `[A] Rossi` ancora in elenco Servizio e in **Calendario** del 09/08. | corsia-A/2.1-5-popup.png, corsia-A/2.1-5.png |
| 2.1-6 | 375px: piantina scorre nel riquadro, no overflow pagina | OK | Viewport 375×812. `document.documentElement.scrollWidth <= innerWidth+1` → **true** (375≤375). Contenitori overflow della piantina con scrollWidth 800 > clientWidth ~237 (scorrimento interno ok). | corsia-A/2.1-6.png |

## Bug trovati

Nessun bug bloccante sulle voci 2.1-1 … 2.1-6.

**Nota (non bug prodotto):** in Modifica, con viewport &lt; 768px il drag tavoli è disabilitato di proposito (`TableMap` + matchMedia). Per 2.1-4 ho allargato a 1280px. Da annotare per altri agenti.

**Nota UX collaterale:** dopo lo spostamento, `A-T3` risultava sovrapposto a `A-T2` sulla piantina Servizio: un click “fisico” su A-T2 veniva intercettato da A-T3. Il popup su A-T2 si apre correttamente con click programmatico sull’elemento giusto. Non è un difetto della funzione Libera; è conseguenza di due tavoli sulla stessa cella dopo il drag di prova.

## Errori di console

- **0 errori** JS.
- Unico warning ripetuto (non rilevante): `<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated…` su login/admin.

## Cosa deve ricontrollare Matteo

1. Screenshot 2.1-1 / 2.1-2: giudizio estetico «senza griglia» e leggibilità legenda (agente misura presenza, non gusto).
2. 2.1-4: verificare a occhio che `A-T3` sia nella posizione spostata (e se vuoi, riposizionarlo perché ora si sovrappone a `A-T2`).
3. Controprova manuale: Calendario 09/08 → `[A] Rossi` e `[A] Bianchi` ancora presenti; Servizio Cena 09/08 → Rossi da riassegnare, Bianchi da assegnare.

## Stato lasciato sull'ambiente

- **Resta:** sala `AG-A Sala`, tavoli `A-T1..A-T4` (A-T3 spostato rispetto allo spawn), prenotazioni `[A] Rossi` e `[A] Bianchi` su **2026-08-09 / Cena**, nessuna assegnazione attiva su A-T2 (liberata).
- **Non toccato:** fasce orarie, D38, limite walk-in, sale/tavoli non `A-` / `AG-A`, form pubblico.
- **Ripristini obbligatori corsia A:** nessuno (§7).
- Altre corsie visibili in parallelo (`AG-B/C/D`, `[C] Ferrari` sul 07/08): non modificate.
