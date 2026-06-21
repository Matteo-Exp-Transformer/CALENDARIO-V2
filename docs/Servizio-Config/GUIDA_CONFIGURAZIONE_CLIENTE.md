# Guida configurazione cliente — script per la prima messa in opera

> **A cosa serve.** Questo è il documento che usi **tu (o chi configura al posto tuo)** quando metti in
> piedi l'app per un nuovo ristorante, di solito in chiamata o di persona. È uno **script di intervista**:
> domande in lingua semplice → cosa imposti nell'app. Segui l'ordine; salta i blocchi che non servono.
>
> **Per l'agente che legge.** Questo file NON è codice e NON decide l'architettura. Le manopole e i
> valori reali vivono in:
> - registro impostazioni: `src/features/booking/lib/restaurantSettingRegistry.ts`
> - fasce/tavoli: `src/features/booking/components/servizio/*`, tabelle `service_slots`/`tables`/`rooms`
> - regole di prodotto (durate, intervalli, livelli): `docs/MASTERPLAN_SERVIZIO.md` (decisioni D1–D42)
> - chi configura cosa: `docs/Servizio-Config/INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`
>
> Se un valore qui sembra diverso dal codice, **vince il codice**: aggiorna questo file, non il contrario.

---

## Regola d'oro

Al cliente chiedi **solo le cose che solo lui sa** (orari, coperti, com'è fatta la sala). Tutto il resto
(durate tecniche, intervalli di arrivo, limiti, buffer) **lo metti tu** con un valore già pronto: sono
scelte da venditore, non da modulo. Se il cliente non te lo chiede, non aprire l'argomento.

**Tre livelli di ristorante** (scegli il livello PRIMA di iniziare, così sai quali blocchi servono):
- **Livello 1 — semplice (Classic):** raccoglie prenotazioni, tetto coperti per fascia. Niente durate, niente tavoli.
- **Livello 2 — à la carte (Classic):** in più la durata del tavolo → stima quando si libera. Ancora senza tavoli.
- **Livello 3/4 — sala strutturata (Pro):** sale, tavoli, mappa, servizio dal vivo.

> Salire di livello è sempre possibile dopo. Scendere non rompe niente. Parti dal più semplice che gli basta.

---

## BLOCCO 0 — Dati del locale *(sempre, tutti i livelli)*

| Cosa chiedi al cliente | Dove va | Note |
|---|---|---|
| «Come si chiama il locale?» | Nome ristorante | Obbligatorio. |
| «Email, telefono, indirizzo del locale?» | Contatti | Servono per le email ai clienti e per le note legali. |
| «In che giorni e orari sei aperto?» | Orari di apertura | Da qui nascono in automatico le fasce (Pranzo/Cena). |

---

## BLOCCO 1 — Fasce e coperti *(sempre)*

| Cosa chiedi | Dove va | Valore pronto se non sa rispondere |
|---|---|---|
| «Lavori a pranzo, a cena, o tutti e due?» | Fasce orarie (es. Pranzo 12–15 / Cena 19–23) | Derivale dagli orari del Blocco 0. |
| «Quanti coperti riesci a gestire per turno?» | Coperti massimi per fascia | Se non lo sa: il totale dei posti a sedere. |
| «Vuoi che l'app blocchi le prenotazioni quando sei pieno in quella fascia?» | Limite coperti (ON/OFF) | **Consiglio: ON** se ha dato un numero di coperti. |
| «Vuoi accettare richieste anche fuori dagli orari delle fasce?» | Rifiuta fuori fascia | **Consiglio: NO** (cioè rifiuta fuori fascia). |

> ⚠️ Promemoria: se metti i coperti ma lasci il limite **spento**, il cliente vedrà entrare prenotazioni
> anche da pieno. Metti i due insieme.

---

## BLOCCO 2 — Durata del tavolo *(solo Livello 2 e 3/4)*

Serve perché l'app capisca «quanto resta occupato un tavolo» e quando si libera. **Questo lo decidi tu**
in base a com'è il servizio, non lo chiedi come numero tecnico.

| Cosa capisci dal cliente | Cosa imposti | Valori pronti |
|---|---|---|
| Quanto dura in media una cena tipica? | Durata di base (tipologia) | **120 min** standard. Valori pronti: **90 / 120 / 150 / 180**. |
| Ci sono esperienze più lunghe (degustazione, eventi)? | Durata sulla card di quell'esperienza | **Prenota un Tavolo** 120, **Degustazione** 150, **Evento** 180. (90 per un pranzo veloce.) |
| Vuoi tenere il tavolo a chi arriva un po' tardi? | Toggle «accetta arrivi tardivi» per fascia | Default **OFF**. |

> Card di partenza consigliate: **Prenota un Tavolo** (120) · **Degustazione** (150) · **Evento** (180).
>
> La card (l'esperienza che sceglie il cliente) **vince** sulla durata di base: un «Evento 180» occupa
> 180 anche se la base è 120 (decisione D35). Tu prepari le card; il cliente non le disegna da solo.
>
> **Numeri tecnici che NON chiedi al cliente** (li metti tu o restano default): minimo durata fascia,
> ogni-quanto-si-prenota (intervallo di arrivo, default 30 min / 15 a pranzo), anticipo minimo
> (cut-off, 60 min), tempo minimo per ordinare (45 min), buffer di riassetto.

---

## BLOCCO 3 — Sale e tavoli *(solo Livello 3/4 — Pro)*

Questo è l'unico setup «lungo». Fallo insieme al cliente guardando la piantina della sala.

| Cosa chiedi | Dove va |
|---|---|
| «Quante sale hai? Come si chiamano?» | Sale (Rooms) |
| «In ogni sala, quanti tavoli e da quanti posti?» | Tavoli (nome + capienza), disegnati sulla mappa |
| «Quanti coperti al massimo per un walk-in (cliente che entra senza prenotare)?» | Limite walk-in | Default **20**. |

> Una tavolata grande può usare **più tavoli** (es. 10 persone = due tavoli da 5): è previsto (D39).

---

## BLOCCO 4 — Aspetto pagina pubblica *(opzionale, tutti i livelli)*

| Cosa chiedi | Dove va |
|---|---|
| «Preferisci una foto laterale o uno sfondo a tutta pagina?» | Sfondo pagina Prenota (scelta da galleria) |
| «Hai una foto/atmosfera che ti rappresenta tra queste?» | Foto striscia / sfondo |

> Se ha fretta, salta: i default vanno benissimo.

---

## BLOCCO 5 — Cose che imposti TU dietro le quinte *(il cliente non le vede)*

Le metti tu in fase di vendita/configurazione (oggi a mano, domani dalla console privata). Vedi l'elenco
completo in `INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`, colonna «Console / lo fai tu».

- Versione venduta (Classic / +QR / Pro) e funzioni accese per quel cliente.
- Durata di base, minimo durata fascia, tempo minimo per ordinare.
- Creazione delle card/menu (fisso vs componibile, prezzo, piatti collegati).
- Intervallo di arrivo, anticipo minimo, buffer di riassetto, ritardo/no-show: di norma lasci i default.

---

## Checklist finale prima di consegnare

- [ ] Nome + contatti + orari inseriti.
- [ ] Fasce create con i coperti giusti; limite ON se previsto.
- [ ] (Liv. 2+) Durata di base impostata; card preparate se ci sono esperienze diverse.
- [ ] (Liv. 3/4) Sale e tavoli disegnati; walk-in impostato.
- [ ] Provata UNA prenotazione finta dalla pagina pubblica e vista arrivare nel Calendario.
- [ ] Versione venduta corretta (Classic/Pro) e funzioni accese coerenti.

> **Sicurezza dati.** La configurazione vera si scrive sul database di **produzione**. Prima di scrivere,
> verifica sempre l'ambiente (`rwuxgvld` = PRODUZIONE → fermati e conferma; `docnnernvp` = TEST → procedi).
> Regola completa in `docs/APP_CONTEXT_SKILL.md` §1b.
