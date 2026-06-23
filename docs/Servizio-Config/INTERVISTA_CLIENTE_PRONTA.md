# Intervista cliente — configurazione app

**Versione pronta per la chiamata.** Segui i blocchi in ordine. Chiedi al cliente solo ciò che solo lui
sa; tutto il resto lo metti tu con un valore già pronto.

**Legenda stato:** ✅ pronto ora · 🔜 in arrivo (motore durata/orari di arrivo) · 🚫 fuori ora (servizio dal vivo, conto, ordine da QR).

> ⚠️ Per oggi (cliente Classic in produzione): tutto ciò che è ✅ lo consegni subito. Le durate sono 🔜:
> puoi impostarle, ma non promettere "il tavolo si libera da solo" o "orari di arrivo a slot" finché non
> rilasciamo S2/S3 in produzione.

---

## Prima di iniziare — che livello è?

- **Livello 1 — semplice:** raccoglie prenotazioni + tetto coperti per fascia. Niente durate, niente tavoli.
- **Livello 2 — à la carte:** in più la durata del tavolo. Ancora senza tavoli.
- **Livello 3/4 — sala strutturata (Pro):** sale, tavoli, mappa.

Parti dal più semplice che gli basta. Salire dopo è sempre possibile.

---

## BLOCCO 0 — Dati del locale *(sempre)*

| Cosa chiedi | Dove va | Stato |
|---|---|---|
| Come si chiama il locale? | Nome ristorante (obbligatorio) | ✅ |
| Email, telefono, indirizzo? | Contatti | ✅ |
| In che giorni e orari sei aperto? | Orari di apertura (base delle fasce) | ✅ |
| *(default, non chiedere)* | Fuso orario = Europe/Rome | ✅ |
| *(default, non chiedere)* | Finestra prenotabilità = 60 giorni | ✅ |

---

## BLOCCO 1 — Fasce e coperti *(sempre)*

| Cosa chiedi | Dove va | Stato | Default se non sa |
|---|---|---|---|
| Lavori a pranzo, cena o entrambi? | Fasce (es. Pranzo 12–15 / Cena 19–23) | ✅ | Derivale dagli orari. |
| Quanti coperti per turno? | Coperti massimi per fascia | ✅ | Totale posti a sedere. |
| L'app deve bloccare quando sei pieno? | Limite coperti ON/OFF | ✅ | ON se ha dato un numero. |
| Accetti richieste fuori dagli orari delle fasce? | Rifiuta fuori fascia ON/OFF | ✅ | Rifiuta (ON) se ha orari precisi. |

> Se metti i coperti ma lasci il limite spento, entrano prenotazioni anche da pieno. Vanno insieme.
>
> **Pulsante «Quando?» (✅ Pro):** chiusura fascia o taglio coperti per oggi / settimana / mese / giorni
> scelti. È uno strumento del giorno per giorno, non della prima configurazione.

---

## BLOCCO 2 — Esperienze (card) e durata

Le **card** sono ciò che il cliente sceglie (es. *Prenota un Tavolo*, *Degustazione*, *Evento*). **Le prepari tu.**

| Cosa capisci dal cliente | Cosa imposti | Stato | Valori pronti |
|---|---|---|---|
| Che esperienze offre? | Una card per esperienza | ✅ | Tavolo · Degustazione · Evento |
| À la carte o menù fisso? | Componibile vs fisso, sulla card | ✅ | À la carte = componibile |
| C'è un prezzo a persona? | Prezzo sulla card (opzionale) | ✅ | Lascia vuoto se non lo mostra |
| Mostra i piatti dentro l'esperienza? | Piatti collegati (richiede menu/+QR) | ✅ | Solo se ha il menu caricato |
| Quanto dura quell'esperienza? | Durata sulla card | 🔜 | Tavolo 120 · Degustazione 150 · Evento 180 |
| Durata di una prenotazione tipo? | Durata di base | 🔜 | 120 (pronti: 90/120/150/180) |

> La card scelta dal cliente **vince** sulla durata di base (un Evento 180 occupa 180 anche se la base è 120).
>
> **Numeri tecnici che NON chiedi (li metti tu o restano default, 🔜):** minimo durata fascia, intervallo
> di arrivo (30 min / 15 a pranzo), anticipo minimo (60 min), tempo minimo per ordinare (45 min), buffer
> di riassetto, accetta arrivi tardivi (OFF — solo console).

---

## BLOCCO 3 — Aspetto e testi pagina pubblica *(opzionale, tutto ✅)*

| Cosa decidi | Dove va |
|---|---|
| Titolo e descrizione di benvenuto | Testi pagina Prenota |
| Sfondo a tutta pagina | Sfondo (galleria chiusa) |
| Foto striscia laterale | Foto striscia (opzionale) |
| Quali modalità di prenotazione mostrare | Modalità visibili nel form |
| Badge su una modalità (es. "Consigliato") | Badge modalità |
| Mostrare la tendina "menu consigliati"? | Menu consigliati ON/OFF |
| Messaggio promo / banner menù | Promo menù (opzionale) |
| Tema grafico area admin | Tema app (solo admin) |

> Se ha fretta: i default vanno benissimo, salta.

---

## BLOCCO 4 — Sale e tavoli *(solo Pro)*

| Cosa chiedi | Dove va | Stato |
|---|---|---|
| Quante sale? Come si chiamano? | Sale | ✅ |
| Quanti tavoli per sala e da quanti posti? | Tavoli (nome + capienza, sulla mappa) | ✅ |
| Massimo coperti per un walk-in? | Limite walk-in (default 20) | ✅ |
| Assegnare prenotazione a un tavolo | Assegnazione → tavolo | ✅ |

> Una tavolata grande può usare più tavoli (10 = due da 5). Stati colorati in tempo reale e servizio dal vivo = 🚫 fuori ora.

---

## BLOCCO 5 — Aree di posizionamento *(opzionale, ✅)*

| Cosa chiedi | Dove va |
|---|---|
| Come chiami le zone dove sistemi i clienti? (Sala A, Dehors, Veranda) | Aree di posizionamento |

---

## BLOCCO 6 — Cose che imposti TU dietro le quinte *(il cliente non le vede)*

| Manopola | Stato | Default / nota |
|---|---|---|
| Versione venduta (Classic / +QR / Pro) e funzioni accese | ✅ | Mai in mano al cliente. |
| Durata di base e durate card | 🔜 | 120 base; 120/150/180 card. |
| Minimo durata fascia | 🔜 | Lascia vuoto se non serve. |
| Intervallo di arrivo | 🔜 | 30 min (15 a pranzo). |
| Anticipo minimo (cut-off) | 🔜 | 60 min. |
| Tempo minimo per ordinare | 🔜 | 45 min. |
| Accetta arrivi tardivi | 🔜 | OFF. Solo console. |
| Buffer di riassetto tavolo | 🔜 | 0 Classic / 10 Pro. |
| Ritardo / no-show | 🚫/🔜 | 15–20 min (console di sala). |
| Limite coperti operativo con tavoli | 🔜 | Caso raro. |
| «Turni massimi per tavolo» (vecchio) | ✅ | NON usare (residuo). |

---

## Checklist finale prima di consegnare

- [ ] Nome + contatti + orari inseriti
- [ ] Fasce con coperti giusti; limite ON se previsto; "rifiuta fuori fascia" deciso
- [ ] Card/esperienze preparate (componibile vs fisso, prezzo, piatti); tendina menu consigliati impostata
- [ ] Pagina pubblica: titolo/descrizione, sfondo, modalità visibili, eventuale promo
- [ ] (Liv. 2+) Durate impostate dove possibile (effetto pieno con S3)
- [ ] (Pro) Sale e tavoli disegnati; walk-in; aree di posizionamento se le usa
- [ ] Versione venduta corretta e funzioni accese coerenti
- [ ] Provata UNA prenotazione finta dalla pagina pubblica → vista nel Calendario
- [ ] Non promesso nulla di 🚫 (servizio dal vivo, conto, ordine da QR cliente)

---

*Sicurezza dati: la config si scrive in produzione. Prima di scrivere verifica l'ambiente — `rwuxgvld` = PRODUZIONE (fermati e conferma) · `docnnernvp` = TEST (procedi).*
