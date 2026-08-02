# Corsia D — Capienza, form pubblico, non-regressione Classic · report e2e

- Eseguita il: 2026-08-02 ~14:55 → ~15:45 (ora locale)
- Ambiente verificato: VITE_SUPABASE_URL → docnnernvpyrbwuzzach… ✅
- Sala/tavoli creati: `AG-D Sala` · `D-T1`·4, `D-T2`·6 (10 posti)
- Fascia usata: **AG-D** (iniziale e ripristinata: **15:35 → 16:25**, intervallo **30**, max_turns **2**, limite coperti **6**)
- Data di lavoro Pro: **2026-08-12** (oggi+10)
- Form pubblico Pro: `http://localhost:5173/prenota/da-tommaso`
- Classic: prima coppia env → tenant `test-classic` (`testc@c.com`) — voce Servizio assente ✅
- Isolamento browser (§2.3): **OK** (resta su `/admin/servizio` Pro dopo ~30s)
- **D38 acceso dalle 15:09 alle 15:09**
- Branch: `env/test` · Server: `http://localhost:5173` già attivo

## Esiti

| ID | Voce della checklist | Esito | Cosa ho visto | Prova |
|----|----------------------|-------|---------------|-------|
| 4-1 | Admin: più coperti dei posti tavolo → avviso, mai blocco | OK | Prenotazione admin `[D] Overcap` 8 ospiti 15:35 del 12/08; Assegna su `D-T1` (4 posti) completa con avviso «Mancano 4 posti per questa tavolata.» — non bloccata | corsia-D/4-1.png |
| 4-2 | D38 OFF: sistema usa 10 posti tavolo; form pubblico accetta 7° coperto in AG-D | KO | Interruttore D38 spento (default). RPC `get_available_arrival_times` (anon TEST): ospiti 1–6 → orari AG-D; ospiti ≥7 → lista vuota. Comportamento = cap fascia 6 anche con D38 OFF e 10 posti tavolo. UI pubblica: AG-D senza orari selezionabili nella finestra libera (vedi bug 1) → non verificabile «accetta 7» a schermo, ma l’RPC già rifiuta il 7° | corsia-D/4-2-d38-off.png |
| 4-3 | D38 ON: minore fra tavoli/fascia (=6); pubblico rifiuta 7° coperto | NON VERIFICABILE | Accensione D38 OK (checkbox «Mantieni anche il limite…»). Rifiuto UI del 7° coperto su AG-D non eseguito: nessuna fascia AG-D con orari cliente utilizzabili. Con D38 ON il minore sarebbe comunque 6 — allineato al rifiuto già visto via RPC a ≥7 | corsia-D/4-3-d38-on.png |
| 4-4 | D38 di nuovo OFF; 7° coperto di nuovo accettato | NON VERIFICABILE | D38 riportato **spento** subito (stesso minuto). Riacettazione pubblica del 7° non verificata (stesso blocco orari AG-D / RPC che già nega ≥7 a D38 OFF) | corsia-D/4-4-d38-off.png |
| 4-5 | Badge % Calendario riflette limite attivo (10 off / 6 on) | KO | Giorno 12/08, fascia AG-D: **«8 / 128»** e **6%** con `[D] Overcap` (8 coperti). Denominatore = posti ristorante intero (~128), non 10 (tavoli AG-D) né 6 (cap fascia / D38). Non riflette il limite attivo della fascia/tavoli | corsia-D/4-5-calendar.png |
| 8-1 | Cambio orari AG-D → form pubblico aggiornato | BLOCCATO | Orari AG-D modificati in prova (poi ripristinati). Sul form, AG-D compare come intestazione **senza orari cliccabili**: gap libero Pranzo→Aperitivo (~59′) incompatibile con durata fascia + `min_order_time` / arrivo tardivo. Finestra notturna 04:15–06:45: RPC dà orari ma il form rifiuta fuori orari di apertura | — |
| 8-2 | Cambio intervallo arrivo 30→15→60 | BLOCCATO | Stesso blocco: niente griglia orari AG-D sul cliente da confrontare | — |
| 8-3 | Chiudi fascia (max_turns=0) → cliente non prenota; poi max_turns=2 | OK | Spinbutton a `0` non restava (rileggeva `2`). **«Chiudi servizio AG-D»** → UI «Servizio chiuso» / «Riapri servizio AG-D». Poi **Riapri** eseguito; max_turns di nuovo **2**. Nota: per un momento anche Colazione risultava chiudibile/chiusa — riaperta | corsia-D/8-3-closed.png |
| 8-4 | Prenotazione da form pubblico → Calendario + Servizio, orario giusto | OK | Due richieste `[D] Pubblico` 2 ospiti **20:01** del **12/08** (fascia **Cena**, non AG-D: AG-D inutilizzabile dal cliente). Accettate da Prenotazioni. In Calendario giorno 12/08: `[D] Pubblico` **20:01**. In Servizio data 12/08 fascia Cena: 2× `[D] Pubblico` da assegnare. Orario non spostato di fuso | corsia-D/8-4-public.png, 8-4-prenotazioni.png, 8-4-calendar.png, 8-4-servizio.png |
| 7-1 | Classic: menu senza voce Servizio | OK | Login prima coppia Classic → `testc@c.com`, tenant «Siamo Sempre Aperti». Pulsanti menu: Calendario, Prenotazioni, Archivio, Menu, Impostazioni — **nessun Servizio** | corsia-D/7-1-menu.png |
| 7-2 | Classic: Calendario giorno + occupazione per fascia anche senza limite | KO | Vista **Giorno** ok («Prenotazioni del giorno: domenica, 02 agosto 2026»). **Nessun** badge tipo «% occupazione / Coperti N / M» per fascia (a differenza del Pro). Limiti fascia Classic risultano attivi (20 cop. × fascia) in Impostazioni — comunque badge assenti | corsia-D/7-2-calendar.png |
| 7-3 | Classic form: accetta valida e rifiuta oltre limite fascia | BLOCCATO | Form `/prenota/test-classic`: data/ora selezionabili (PointerEvent su picker). Orari con 2 ospiti presenti. **Checkbox Privacy** (id `privacy-consent-dietary-input`, controlled React): click/automation non aggiorna lo stato React (icona resta `scale-0 opacity-0`) → submit bloccato client-side, **nessuna** request rete. Oltre-limite (21 ospiti) non portato a termine per lo stesso motivo. 3+ tentativi | corsia-D/7-3-ok.png |
| 7-4 | Classic: nessun errore console in navigazione | OK | Navigazione admin Classic (Home → Calendario Giorno → Impostazioni): **0** `pageerror` / `console.error`. Solo warning meta apple-mobile deprecato (irrilevante) | — |

## Bug trovati

1. **Form pubblico Pro: fascia AG-D senza orari cliente utilizzabili**  
   Atteso: dopo setup AG-D in finestra libera, il cliente vede orari della fascia.  
   Succede: intestazione «AG-D» senza slot; oppure orari RPC fuori business hours rifiutati.  
   Riproduzione: fascia tra Pranzo (fine 15:30) e Aperitivo (16:30) con intervallo 30 e vincoli arrivo; apri `/prenota/da-tommaso`, data 12/08, apri Ora.

2. **D38 OFF non fa usare i 10 posti tavolo sul percorso pubblico (capienza)**  
   Atteso (checklist): con D38 spento e 10 posti tavolo / cap fascia 6, vale **10** → 7° coperto accettato.  
   Succede: RPC `get_available_arrival_times` svuota gli orari già da **7** ospiti (come se valesse sempre il cap 6).  
   Riproduzione: D38 OFF, sala AG-D 10 posti, fascia AG-D cap 6; chiama RPC o prova form con ospiti 7.

3. **Badge occupazione Calendario: denominatore globale, non limite fascia/tavoli**  
   Atteso: con D38 OFF su 10, con D38 ON su 6.  
   Succede: AG-D sul 12/08 mostra **8 / 128** (6%) con Overcap da 8.  
   Prova: corsia-D/4-5-calendar.png.

4. **Classic pubblico: consenso Privacy non azionabile via automazione (possibile solo tooling)**  
   Click sull’input opacity-0 / label non porta `privacyAccepted` React a true (Check resta nascosto). Un umano va ricontrollato a mano. Non classificato bug prodotto finché Matteo non riprova al tocco.

5. **Classic Calendario: mancano i badge occupazione per fascia**  
   Atteso checklist 7-2: occupazione per fascia visibile anche senza limite.  
   Succede: vista giorno ok, badge assenti. Da confermare se regressione S4 o UI Classic diversa dal Pro.

## Errori di console

- Pro e Classic: **0 errori JS** rilevanti durante i flussi collaudati.
- Warning ripetuto: meta `apple-mobile-web-app-capable` deprecato.

## Cosa deve ricontrollare Matteo

1. **4-2 / 4-3 / 4-4** a mano: con una fascia AG-D che abbia davvero slot pubblici, D38 OFF vs ON sul 7° coperto.
2. **4-5**: se il denominatore 128 è voluto (tutto il locale) o bug rispetto al «limite attivo».
3. **8-1 / 8-2**: ripeti quando esiste una finestra oraria abbastanza larga per AG-D + regole arrivo.
4. **7-2**: badge occupazione su Classic — assenti nel mio run.
5. **7-3**: una prenotazione buona e una oltre cap 20 sul form `test-classic` (Privacy a mano).
6. Controprova dati lasciati: `[D] Overcap` su AG-D 12/08; due `[D] Pubblico` su Cena 12/08 20:01.

## Stato lasciato sull'ambiente

- **Resta:** sala `AG-D Sala`, tavoli `D-T1`/`D-T2`, fascia `AG-D` 15:35–16:25 / intervallo 30 / 2 turni / 6 cop., prenotazioni `[D] Overcap`, `[D] Pubblico`×2 (Cena 12/08).
- **Ripristini obbligatori corsia D:** D38 **spento**; max_turns AG-D **2**; orari/intervallo AG-D come iniziali; AG-D **riaperta** (non «Servizio chiuso»).
- **Non toccato a fine corsa (oltre ripristini):** walk-in, sale/tavoli non `D-`/`AG-D`, fasce Pranzo/Cena/… (salvo riapertura Colazione se era stata chiusa per errore).
- Credenziali di lavoro solo in `docs/_lavoro/e2e-s4/corsia-D/_creds.json` / `_classic_creds.json` (gitignored) — **non** nel report.
- `COLLAUDO_S4_CHECKLIST.md` **non** modificata.
