# Guida configurazione cliente — script per la prima messa in opera

> **A cosa serve.** Questo è il documento che usi **tu (o chi configura al posto tuo)** quando metti in
> piedi l'app per un nuovo ristorante, di solito in chiamata o di persona. È due cose insieme:
> 1. uno **script di intervista** (domande in lingua semplice → cosa imposti nell'app), in ordine;
> 2. un **inventario completo** di TUTTO ciò che puoi configurare oggi, con lo stato di ciascuna voce.
>
> **Per l'agente che legge.** Questo file NON è codice e NON decide l'architettura. Le manopole e i
> valori reali vivono in:
> - registro impostazioni: `src/features/booking/lib/restaurantSettingRegistry.ts`
> - fasce/tavoli/sale: `src/features/booking/components/servizio/*`, tabelle `service_slots`/`tables`/`rooms`
> - card/menu e form pubblico: `booking_public_form_config` + `booking_custom_staff_presets` (stesso registro)
> - regole di prodotto (durate, intervalli, livelli): `docs/MASTERPLAN_SERVIZIO.md` (decisioni D1–D42)
> - chi configura cosa: `docs/Servizio-Config/INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`
>
> Se un valore qui sembra diverso dal codice, **vince il codice**: aggiorna questo file, non il contrario.

---

## Come leggere lo stato di ogni voce

Ogni cosa configurabile ha un'etichetta di stato, così sai cosa puoi davvero consegnare oggi:

- **✅ PRONTO** — funziona nell'app adesso, lo configuri e ha effetto.
- **🔜 IN ARRIVO** — il motore di durata e degli orari di arrivo (cantieri S1–S3) è completo su TEST,
  ma non è ancora rilasciato in produzione.
  La *configurazione* della durata esiste già; gli **orari di arrivo proposti nel form pubblico**
  (cliente che sceglie tra slot invece di scrivere un orario libero) arrivano con S3.
  ⚠️ Finché S3 non è in produzione, la durata che imposti **non cambia ancora** ciò che vede il cliente:
  serve a preparare il terreno, non promettere "il tavolo si libera da solo".
- **🚫 FUORI ORA** — servizio dal vivo, conto del tavolo, ordine da QR del cliente: **non in questa fase**
  (cantieri S4-LIVE / S6). Non prometterli in vendita.

> **Nota produzione vs test.** Le colonne nuove del motore durata (cantiere S2) per ora vivono solo sul
> database di **test**. Per un cliente reale in produzione, oggi consegni: raccolta prenotazioni, fasce,
> coperti, limiti, card/menu, pagina pubblica personalizzata, calendario, (Pro) sale e tavoli. Le durate
> "vere" diventano operative quando S2/S3 vanno in produzione (gate con conferma tua).

---

## Regola d'oro

Al cliente chiedi **solo le cose che solo lui sa** (orari, coperti, com'è fatta la sala, che esperienze
offre). Tutto il resto (durate tecniche, intervalli di arrivo, limiti, buffer) **lo metti tu** con un
valore già pronto: sono scelte da venditore, non da modulo. Se il cliente non te lo chiede, non aprire
l'argomento.

**Tre livelli di ristorante** (scegli il livello PRIMA di iniziare, così sai quali blocchi servono):
- **Livello 1 — semplice (Classic):** raccoglie prenotazioni, tetto coperti per fascia. Niente durate, niente tavoli.
- **Livello 2 — à la carte (Classic):** in più la durata del tavolo → prepari il terreno per "quando si libera". Ancora senza tavoli.
- **Livello 3/4 — sala strutturata (Pro):** sale, tavoli, mappa. (Il servizio dal vivo è 🚫 fuori ora.)

> Salire di livello è sempre possibile dopo. Scendere non rompe niente. Parti dal più semplice che gli basta.

---

## BLOCCO 0 — Dati del locale *(sempre, tutti i livelli)*

| Cosa chiedi al cliente | Dove va | Stato | Note |
|---|---|---|---|
| «Come si chiama il locale?» | Nome ristorante | ✅ | Obbligatorio. |
| «Email, telefono, indirizzo del locale?» | Contatti (email/telefono/indirizzo) | ✅ | Per le email ai clienti e le note legali. |
| «In che giorni e orari sei aperto?» | Orari di apertura | ✅ | Da qui nascono in automatico le fasce (Pranzo/Cena). |
| *(non chiedere, default)* | Fuso orario | ✅ | Sempre **Europe/Rome**. Cambialo solo per cliente estero. |
| *(non chiedere, default)* | Finestra di prenotabilità (giorni avanti) | ✅ | Default **60**. Oggi senza effetto pratico: lascialo. |

---

## BLOCCO 1 — Fasce e coperti *(sempre)*

| Cosa chiedi | Dove va | Stato | Valore pronto se non sa rispondere |
|---|---|---|---|
| «Lavori a pranzo, a cena, o tutti e due?» | Fasce orarie (es. Pranzo 12–15 / Cena 19–23) | ✅ | Derivale dagli orari del Blocco 0. |
| «Quanti coperti riesci a gestire per turno?» | Coperti massimi per fascia | ✅ | Se non lo sa: il totale dei posti a sedere. |
| «Vuoi che l'app blocchi le prenotazioni quando sei pieno in quella fascia?» | Limite coperti (ON/OFF) | ✅ | **Consiglio: ON** se ha dato un numero di coperti. |
| «Vuoi accettare richieste anche fuori dagli orari delle fasce?» | Rifiuta fuori fascia (ON/OFF) | ✅ | **Consiglio: rifiuta** (ON) se ha orari precisi. |

> ⚠️ Promemoria: se metti i coperti ma lasci il limite **spento**, il cliente vedrà entrare prenotazioni
> anche da pieno. Metti i due insieme.
>
> **Modifiche temporanee (pulsante «Quando?» — ✅ Pro):** chiusura di una fascia o taglio coperti per
> oggi / questa settimana / questo mese / giorni scelti (es. "stasera evento privato, taglio a 30").
> È operativo, non da prima configurazione: glielo mostri come *strumento del giorno per giorno*.

---

## BLOCCO 2 — Esperienze (card) e durata *(card: tutti i livelli · durata: Liv. 2+)*

Le **card** (o "esperienze") sono ciò che il cliente sceglie nel form: *Prenota un Tavolo*, *Menu
degustazione*, *Rinfresco di laurea*, ecc. **Le prepari tu**, il cliente non le disegna. Possono essere:
- **componibili** (il cliente compone tra categorie di piatti) o **a menù fisso** (piatti già decisi);
- con **prezzo a persona** (opzionale) e **piatti collegati** (dal menu, se +QR);
- con un **badge** (es. "Consigliato") e un'**icona**.

| Cosa capisci dal cliente | Cosa imposti | Stato | Valori pronti |
|---|---|---|---|
| Che esperienze offre? (à la carte, degustazione, eventi…) | Una card per esperienza | ✅ | *Prenota un Tavolo* · *Degustazione* · *Evento*. |
| Ogni esperienza è a scelta libera o a menù fisso? | Componibile vs menù fisso, sulla card | ✅ | À la carte = componibile; degustazione/evento = fisso. |
| C'è un prezzo a persona? | Prezzo sulla card | ✅ | Opzionale; lascia vuoto se non lo vuole mostrare. |
| Vuole mostrare il menù dei piatti dentro l'esperienza? | Piatti collegati (richiede menu/+QR) | ✅ | Solo se ha il menu caricato. |
| Quanto dura in media quell'esperienza? | Durata sulla card | 🔜 | *Tavolo* 120 · *Degustazione* 150 · *Evento* 180 (90 per pranzo veloce). |
| Quanto dura una prenotazione "tipo"? | Durata di base (tipologia) | 🔜 | **120 min** standard. Valori pronti: **90 / 120 / 150 / 180**. |

> La card che sceglie il cliente **vince** sulla durata di base: un *Evento 180* occupa 180 anche se la
> base è 120 (decisione D35). Se una card non ha durata propria, eredita dalla tipologia, poi dal default.
>
> **Numeri tecnici che NON chiedi al cliente** (li metti tu, o restano default — 🔜 motore in arrivo):
> minimo durata fascia, ogni-quanto-si-prenota (intervallo di arrivo, default 30 / 15 a pranzo), anticipo
> minimo (cut-off, 60 min), tempo minimo per ordinare (45 min), buffer di riassetto, accetta arrivi tardivi.
> Questi ultimi due li imposti **tu dalla console**, non il ristoratore (decisione 23-06-26).

---

## BLOCCO 3 — Aspetto e testi della pagina pubblica *(opzionale, tutti i livelli)*

Tutto ✅ e già funzionante. Se ha fretta, salta: i default vanno benissimo.

| Cosa chiedi / decidi | Dove va | Stato | Note |
|---|---|---|---|
| Titolo e descrizione di benvenuto | Testi pagina Prenota | ✅ | Le sue parole; limiti di lunghezza gestiti dall'app. |
| Sfondo a tutta pagina | Sfondo pagina Prenota | ✅ | Scelta da galleria chiusa. |
| Foto della striscia laterale | Foto striscia (strip-01…06) | ✅ | Opzionale; "nessuna" è valido. |
| Quali modalità di prenotazione mostrare | Modalità visibili nel form | ✅ | Accendi/spegni le modalità; etichette e icone personalizzabili. |
| Badge su una modalità (es. "Consigliato") | Badge modalità | ✅ | Testo breve, attivabile per modalità. |
| Mostrare la tendina "menu consigliati"? | Menu consigliati visibili (ON/OFF) | ✅ | Mostra i menù preimpostati nel form. |
| Messaggio promo / banner menù | Promo menù | ✅ | Opzionale; collegabile a una modalità o a una card. |
| Tema grafico dell'area admin | Tema app | ✅ | Solo estetica interna dell'admin, non la pagina pubblica. |

---

## BLOCCO 4 — Sale e tavoli *(solo Livello 3/4 — Pro)*

Questo è l'unico setup «lungo». Fallo insieme al cliente guardando la piantina della sala.

| Cosa chiedi | Dove va | Stato |
|---|---|---|
| «Quante sale hai? Come si chiamano?» | Sale (Rooms), con ordine a piacere | ✅ |
| «In ogni sala, quanti tavoli e da quanti posti?» | Tavoli (nome + capienza), disegnati sulla mappa | ✅ |
| «Quanti coperti al massimo per un walk-in?» | Limite walk-in | ✅ (default **20**) |
| Assegnare una prenotazione a un tavolo | Assegnazione → tavolo | ✅ (operativo, in servizio) |

> Una tavolata grande può usare **più tavoli** (es. 10 persone = due tavoli da 5): è previsto (D39).
> Gli **stati colorati dei tavoli in tempo reale** e il **servizio dal vivo** sono 🚫 fuori ora (S4/S4-LIVE).

---

## BLOCCO 5 — Aree di posizionamento prenotazioni *(opzionale)*

| Cosa chiedi | Dove va | Stato | Note |
|---|---|---|---|
| «Come chiami le zone dove sistemi i clienti?» (es. Sala A, Dehors, Veranda) | Aree di posizionamento | ✅ | Etichette libere; servono in calendario/gestione per dire *dove* mettere una prenotazione anche senza la mappa tavoli Pro. |

---

## BLOCCO 6 — Cose che imposti TU dietro le quinte *(il cliente non le vede)*

Le metti tu in fase di vendita/configurazione (oggi a mano, domani dalla console privata). Elenco
completo e ragionato in `INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`, colonna «Console / lo fai tu».

| Manopola | Stato | Default / nota |
|---|---|---|
| **Versione venduta** (Classic / +QR / Pro) e funzioni accese | ✅ | È prezzo/fatturato. Mai in mano al cliente. |
| Durata di base (tipologia) e durata sulle card | 🔜 | 120 base; 120/150/180 sulle card. |
| Minimo durata di una fascia | 🔜 | Pavimento tecnico; lascialo vuoto se non serve. |
| Intervallo di arrivo (ogni quanto si prenota) | 🔜 | 30 min (15 a pranzo). |
| Anticipo minimo per prenotare (cut-off) | 🔜 | 60 min. |
| Tempo minimo per ordinare | 🔜 | 45 min. Se sbagliato **blocca prenotazioni vere**. |
| **Accetta arrivi tardivi** | 🔜 | OFF. **Solo console**, non pannello ristoratore (deciso 23-06-26). |
| Buffer di riassetto tavolo (turnover) | 🔜 | 0 Classic / 10 Pro. |
| Ritardo / no-show (minuti prima di segnalare) | 🚫/🔜 | 15–20; appartiene alla console di sala (Pro). |
| Limite coperti «operativo» anche con tavoli | 🔜 | Caso raro (80 posti, ne accetto 60). |
| «Turni massimi per tavolo» (vecchio campo) | ✅ | **Da non usare:** residuo che confonde col nuovo motore (D41). |

---

## Tabella di riferimento — TUTTO il configurabile (mappa rapida)

> Una riga per ogni manopola reale. `chiave` = come si chiama nel database/codice (per l'agente).

| Voce | chiave / dove | Versione | Chi | Stato |
|---|---|---|---|---|
| Nome locale | `restaurant_name` | Classic | 🟩 cliente | ✅ |
| Contatti | `contact_email` / `contact_phone` / `contact_address` | Classic | 🟩 cliente | ✅ |
| Orari apertura | `business_hours` | Classic | 🟩 cliente | ✅ |
| Fuso orario | `timezone` | Classic | 🟦 tu | ✅ |
| Finestra prenotabilità | `booking_window_days` | Classic | 🟦 tu | ✅ (senza effetto pratico) |
| Fasce orarie | tabella `service_slots` | Classic | 🟩 cliente | ✅ |
| Coperti per fascia | `slot_guest_capacities` | Classic | 🟩 cliente | ✅ |
| Limite coperti ON/OFF | `slot_limit_enabled` | Classic | 🟦 tu (con cliente) | ✅ |
| Rifiuta fuori fascia | `booking_reject_out_of_slot` | Classic | 🟦 tu | ✅ |
| Modifiche temporanee fasce/coperti («Quando?») | `service_slot_overrides` | Pro | 🟩 cliente | ✅ |
| Minimo durata fascia | `service_slots.min_duration` | Classic | 🟦 tu | 🔜 (solo TEST) |
| Buffer turnover | `service_slots.turnover_buffer_minutes` | Classic/Pro | 🟦 tu | 🔜 (solo TEST) |
| Intervallo di arrivo | `service_slots.arrival_step_minutes` | Classic | 🟦 tu | 🔜 (S3) |
| Cut-off / tempo min. ordine / arrivi tardivi | `restaurant_settings` (S3) | Classic | 🟦 tu (console) | 🔜 (S3) |
| Card / esperienze | `booking_public_form_config` (`sub_tabs`) | Classic | 🟦 tu | ✅ (durata 🔜) |
| Menù preimpostati (fisso/componibile, prezzo, piatti, durata) | `booking_custom_staff_presets` | Classic/+QR | 🟦 tu | ✅ (durata 🔜) |
| Tendina "menu consigliati" | `booking_staff_presets_visible` | Classic | 🟩 cliente | ✅ |
| Modalità prenotazione, titoli, descrizioni, icone, badge | `booking_public_form_config` | Classic | 🟩 cliente | ✅ |
| Promo / banner menù | `booking_menu_promos` | Classic | 🟩 cliente | ✅ |
| Sfondo pagina | `public_booking_page_background` | Classic | 🟩 cliente | ✅ |
| Foto striscia | `public_booking_strip_photo` | Classic | 🟩 cliente | ✅ |
| Aree di posizionamento | `booking_placement_areas` | Classic | 🟩 cliente | ✅ |
| Tema admin | `app_theme` | Classic | 🟩 cliente | ✅ |
| Sale | tabella `rooms` | Pro | 🟩 cliente | ✅ |
| Tavoli (nome, capienza, mappa) | tabella `tables` | Pro | 🟩 cliente | ✅ |
| Limite walk-in | `walk_in_max_guests` | Pro | 🟦 tu | ✅ |
| Versione venduta + funzioni | `tenants.edition` + features | tutte | 🟦 tu | ✅ |
| Servizio dal vivo / conto tavolo / ordine da QR cliente | — | Pro | — | 🚫 fuori ora |

---

## Checklist finale prima di consegnare

- [ ] Nome + contatti + orari inseriti.
- [ ] Fasce create con i coperti giusti; limite ON se previsto; "rifiuta fuori fascia" deciso.
- [ ] Card/esperienze preparate (componibile vs fisso, prezzo, eventuali piatti); tendina menu consigliati impostata.
- [ ] Pagina pubblica: titolo/descrizione, sfondo, modalità visibili, eventuale promo.
- [ ] (Liv. 2+) Durata di base e durate card impostate **dove possibile** (ricorda: effetto pieno con S3).
- [ ] (Liv. 3/4) Sale e tavoli disegnati; walk-in impostato; aree di posizionamento se le usa.
- [ ] Versione venduta corretta (Classic / +QR / Pro) e funzioni accese coerenti.
- [ ] Provata UNA prenotazione finta dalla pagina pubblica e vista arrivare nel Calendario.
- [ ] Non promesso nulla di 🚫 (servizio dal vivo, conto, ordine da QR cliente).

> **Sicurezza dati.** La configurazione vera si scrive sul database di **produzione**. Prima di scrivere,
> verifica sempre l'ambiente (`rwuxgvld` = PRODUZIONE → fermati e conferma; `docnnernvp` = TEST → procedi).
> Regola completa in `docs/APP_CONTEXT_SKILL.md` §1b.

---

*Aggiornato 23-06-26 — allineato a `restaurantSettingRegistry.ts`, `INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`
e alle decisioni S1/S2/S3 del Masterplan Servizio. Le voci 🔜 si attivano col rilascio in produzione di S2/S3.*
