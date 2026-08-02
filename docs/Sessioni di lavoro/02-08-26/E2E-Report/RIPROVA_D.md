# RIPROVA D — Capienza e form pubblico (setup largo) · report e2e

- Eseguita il: 2026-08-02 ~19:54 → ~20:18 (ora locale)
- Ambiente verificato: VITE_SUPABASE_URL → docnnernvpyrbwuzzach… ✅
- Branch: `env/test` (git status sporco: `PROMPT_AGENTI_E2E_S4.md`, `package-lock.json` — non toccati)
- Isolamento browser (corsia D MCP): OK (resta su `/admin/servizio` dopo ~30s)
- Sala/tavoli: `AG-D2 Sala` · `D2-T1`·4, `D2-T2`·6 (10 posti)
- Fascia usata: **AG-D2** **10:00 → 13:00** (iniziale di prova 09:00–12:00, poi cambiata per 8-1), intervallo **30** (ripristinato dopo 8-2), max_turns **2**, limite coperti **6**
- Data di lavoro Pro: **2026-08-12** (oggi+10)
- Form pubblico Pro: `http://localhost:5173/prenota/da-tommaso`
- Classic: prima coppia env → tenant `test-classic` (`testc@c.com`) — voce Servizio assente ✅
- **D38 lasciato SPENTO** per tutta la corsa
- Server: `http://localhost:5173` già attivo

> Nota setup: non esisteva una finestra diurna libera ≥3 ore senza toccare fasce altrui. AG-D2 è stata creata **09:00–12:00** (poi **10:00–13:00**) sovrapposta a Colazione/Pranzo; il salvataggio è andato a buon fine (stesso pattern già visto con AG-B2). Sul form pubblico gli orari AG-D2 erano cliccabili — precondizione OK.

## Esiti

| ID | Voce della checklist | Esito | Cosa ho visto | Prova |
|----|----------------------|-------|---------------|-------|
| setup | Fascia AG-D2 larga + orari pubblici cliccabili | OK | Su `/prenota/da-tommaso`, data 12/08, 2 ospiti: sezione **AG-D2** con slot **09:00 / 09:30 / 10:00 / 10:30** (poi, dopo 8-1, **10:00–11:30**) | 8-1-orari-aggiornati.png |
| 8-1 | Cambio orari AG-D2 → form pubblico aggiornato | OK | Admin: AG-D2 da 09:00–12:00 a **10:00–13:00**. Pubblico: slot **10:00, 10:30, 11:00, 11:30** (niente più 09:00) | riprova-D/8-1-orari-aggiornati.png |
| 8-2 | Cambio intervallo arrivo 30→15→60 | OK | Intervallo **15′** → slot ogni 15′ (`10:00…11:30`). **60′** → solo `10:00, 11:00`. Poi ripristinato **30′** → `10:00, 10:30, 11:00, 11:30` | 8-2-intervallo-15.png, 8-2-intervallo-60.png |
| 8-3 | Chiudi fascia → cliente non prenota; poi riapri | **KO** | Admin: «Chiudi servizio AG-D2» → toast chiusura + pulsante «Riapri». Pubblico (hard reload): AG-D2 resta con slot **10:00/10:30/11:00/11:30** abilitati; click su **10:30** (unico ad AG-D2) seleziona l’orario. Poi **Riapri** eseguito. `max_turns` in modifica resta 2 (valore di ripresa); la chiusura imposta 0 in DB ma il percorso pubblico non spegne gli slot | 8-3-closed.png, 8-3-public-while-closed.png |
| 8-4 | Prenotazione pubblica → Calendario + Servizio, ora giusta | OK | Richiesta `[D2] Pubblico` 2 ospiti **10:30** del **12/08** (fascia AG-D2). In Prenotazioni: Pendente **12 agosto 2026 · 10:30**. Accettata. Calendario giorno 12/08: `[D2] Pubblico` **· 10:30**. Servizio data 12/08 fascia AG-D2: `[D2] Pubblico` da assegnare. Cifre ora = 10:30, nessuno spostamento di fuso | 8-4-prenotazioni.png, 8-4-calendar.png, 8-4-servizio.png |
| 7-2 | Classic Calendario: badge N/M su giorno con accettate + limite | OK | Limiti fascia **ON** (Impostazioni). Giorno **24/06/2026** (prenotazione accettata `ugo`): card fasce con **«Coperti N / 20»** (es. Aperitivo **20 / 20**, 100%). Vista Giorno ok. (Il 02/08 era vuoto → nessun badge giudicabile, come da indagine) | 7-2-calendar.png, 7-2-limits.png |
| 7-3 | Classic form: Privacy + (ideale) valida / oltre limite | **OK (Privacy)** / **NON VERIFICABILE (invio completo)** | `getByRole('checkbox', { name: /Privacy Policy/i }).check({ force: true })` → `checked: true` su `/prenota/test-classic`. Invio prenotazione completa non portato a termine: altri campi obbligatori del form Classic (tipologia/menu) bloccano il submit; oltre-limite non rieseguito per lo stesso motivo. Non è più il blocco Privacy del giro 1 | 7-3-privacy.png, 7-3-ok.png |

## Decisioni Matteo già prese (non segnate come difetti)

- Percorso pubblico = solo cap fascia (allineamento D1/D38 rimandato) — non rieseguito qui (D38 spento tutto il tempo).
- Badge Calendario Pro = posti di tutto il locale — non rieseguito.
- Walk-in sala/tavolo obbligatori — non in scope.
- Classic: % / N/M solo con limite fascia — confermato dal 7-2 (con limite ON compare `N / 20`).

## Bug trovati

1. **Chiudi servizio non spegne gli orari sul form pubblico**  
   Atteso: con AG-D2 chiusa il cliente non può prenotare in quella fascia.  
   Succede: UI admin chiusa, ma `/prenota/da-tommaso` continua a mostrare e accettare gli slot AG-D2 (es. 10:30).  
   Riproduzione: Servizio → Chiudi servizio AG-D2 → apri form pubblico data 12/08, 2 ospiti, Ora → AG-D2.  
   Prova: 8-3-public-while-closed.png.

## Errori di console

- Pro / Classic / pubblico: **0 errori JS** rilevanti nei flussi collaudati.
- Warning ripetuto: meta `apple-mobile-web-app-capable` deprecato.

## Cosa deve ricontrollare Matteo

1. **8-3** a mano: chiudi AG-D2 e verifica se sul telefono/PC gli orari spariscono davvero (qui restano).
2. **7-3** a mano: una prenotazione valida e una oltre cap 20 su `test-classic` (Privacy da automazione ora ok; manca l’invio completo).
3. Controprova dati: `[D2] Pubblico` accettata AG-D2 12/08 **10:30**; sala `AG-D2 Sala` + fascia AG-D2 10:00–13:00.

## Stato lasciato sull'ambiente

- **Resta:** sala `AG-D2 Sala`, tavoli `D2-T1`/`D2-T2`, fascia `AG-D2` **10:00–13:00** / intervallo **30** / **2 turni** / 6 cop., prenotazione `[D2] Pubblico` (12/08 10:30, accettata).
- **Ripristini obbligatori:** D38 **spento**; AG-D2 **riaperta** (`Chiudi servizio` visibile); max_turns **2**; intervallo **30**.
- **Non toccato:** fasce Pranzo/Cena/… (salvo creazione AG-D2 sovrapposta in orario mattina), walk-in, risorse A/B/C.
- Credenziali solo in `docs/_lavoro/e2e-s4/riprova-D/_creds.env` (gitignored).
- `COLLAUDO_S4_CHECKLIST.md` **non** modificata.
- Screenshot: `docs/_lavoro/e2e-s4/riprova-D/`.
