# ✅ Checklist test PrenotaZen — Release 15→19 giugno 2026

> **A cosa serve:** provare a mano, sul sito in produzione, **ogni modifica rilasciata negli ultimi 4 giorni**.
> Spunta la casella `Esito` man mano. Se qualcosa non va, scrivi cosa hai visto nella colonna `Note`.
>
> **Dove provare:**
> - **Pubblico** (chiunque): `https://<tuo-dominio>/prenota/<slug-ristorante>`
> - **Admin**: accedi come amministratore → area gestione.
> - **Edizione:** il sito pubblico PrenotaZen è **Classic**. Le voci marcate **PRO** si testano solo su un tenant Pro (potrebbero non comparire in Classic — è normale).
>
> **Legenda esito:** ☐ da fare · ✅ ok · ❌ problema · ⏭️ non applicabile (es. feature Pro non presente)
>
> **Viewport consigliati** per le voci UI: 📱 375 (telefono) · 💻 834 (tablet) · 🖥️ 1280 (desktop).

---

## 📊 Tabella visiva riassuntiva

### A — Pagina Prenota (pubblica) — *priorità ALTA, è il cuore del sito*

| ID | Cosa testare | Edizione | Priorità | Esito | Note |
|------|--------------------------------------------------|----------|----------|-------|------|
| PR-01 | Privacy Policy si apre in **finestra sopra il form** (no nuova scheda); chiudendola il form resta compilato | Classic | 🔴 Alta | ☐ | |
| PR-02 | Allergie: scrivendo un'intolleranza compare il **consenso art. 9**; senza spunta non si invia | Classic | 🔴 Alta | ☐ | |
| PR-03 | **Consenso marketing** (email promozionali) è una spunta **facoltativa**: lasciandola vuota la prenotazione parte | Classic | 🔴 Alta | ☐ | |
| PR-04 | **Limite coperti per fascia**: oltre il cap della fascia → messaggio «fascia al completo» | Classic | 🟠 Media | ☐ | |
| PR-05 | **Vincolo orario**: orario fuori da ogni fascia → «orario non rientra negli orari di servizio» | Classic | 🟠 Media | ☐ | |
| PR-06 | **Orario notturno**: fascia oltre mezzanotte (es. 17:30→04:00) accetta 23:00 e 03:00, rifiuta 05:00 | Classic | 🟠 Media | ☐ | |
| PR-07 | **Rate limit**: il blocco «troppe richieste» scatta solo dopo **7** invii ravvicinati (prima 3) | Classic | 🟢 Bassa | ☐ | |
| PR-08 | **Telefono nel riepilogo**: il numero che digiti appare nel riepilogo laterale; quello del ristorante resta nel footer | Classic | 🟠 Media | ☐ | |
| PR-09 | **Label cliccabili**: clic sul titolo di nome/email/telefono/data/ora/ospiti porta il cursore nel campo | Classic | 🟢 Bassa | ☐ | |
| PR-10 | **Menù**: le categorie del carosello si aprono/chiudono ad **accordion** su desktop | Classic | 🟢 Bassa | ☐ | |
| PR-11 | **Validazione menù**: invio con selezione menù incompleta → blocco coerente con le 2 regole | Classic | 🟠 Media | ☐ | |
| PR-12 | **Card tipologia**: etichette dalla configurazione, testo leggibile (+20%), carosello scrollabile | Classic | 🟢 Bassa | ☐ | |

### B — Admin → Impostazioni — *priorità MEDIA*

| ID | Cosa testare | Edizione | Priorità | Esito | Note |
|------|--------------------------------------------------|----------|----------|-------|------|
| SET-01 | Sezione **«Limiti Prenotazioni»** con 2 interruttori (limite per fascia + rifiuto fuori fascia) | Both | 🟠 Media | ☐ | |
| SET-02 | **Non c'è più** il vecchio «limite coperti giornaliero» | Both | 🟠 Media | ☐ | |
| SET-03 | **Personalizza form**: dropdown Font mostra ogni carattere nel suo stile; la **Descrizione** resta dopo Salva + refresh | Classic | 🟠 Media | ☐ | |
| SET-04 | **Footer «Modifiche non salvate»**: i pulsanti Salva/Annulla pulsano arancione quando ci sono modifiche | Both | 🟢 Bassa | ☐ | |
| SET-05 | **Rotella mouse** sopra un campo numerico (coperti, prezzi, walk-in) **non** cambia il valore | Both | 🟢 Bassa | ☐ | |
| SET-06 | **Menu/Magazzino**: avviso disponibilità coerente con l'edizione | Both | 🟢 Bassa | ☐ | |
| SET-07 | **Modale modifica fascia** (Servizio): il nome si precompila col valore salvato | PRO | 🟢 Bassa | ☐ | |
| SET-08 | **Accettazione richiesta**: con fasce spente non compare più il **falso avviso** di capienza | Both | 🟠 Media | ☐ | |

### C — Admin → Prenotazioni / Calendario — *priorità MEDIA*

| ID | Cosa testare | Edizione | Priorità | Esito | Note |
|------|--------------------------------------------------|----------|----------|-------|------|
| CAL-01 | **Badge calendario**: la % è calcolata sulla **somma dei coperti delle fasce** del giorno | Both | 🟠 Media | ☐ | |
| CAL-02 | **Card giorno**: mostra al massimo ~5 prenotazioni poi «…» (niente card infinita) | Both | 🟢 Bassa | ☐ | |
| CAL-03 | **Intolleranze da cliente**: nella scheda non appare più «- 1 ospite» sul testo libero | Both | 🟠 Media | ☐ | |
| CAL-04 | **Ordine fasce** nel calendario rispetta il `display_order` impostato | Both | 🟢 Bassa | ☐ | |

### D — Admin → CRM / Email — *PRO (potrebbe non comparire in Classic)*

| ID | Cosa testare | Edizione | Priorità | Esito | Note |
|------|--------------------------------------------------|----------|----------|-------|------|
| CRM-01 | **Campagne email**: creazione + invio campagna | PRO | 🟠 Media | ☐ | |
| CRM-02 | **Personalizza email** (firma/testo) nel CRM | PRO | 🟢 Bassa | ☐ | |
| CRM-03 | **Toast di errore** se l'invio email fallisce | PRO | 🟢 Bassa | ☐ | |
| CRM-04 | **Riepilogo email** prima dell'invio | PRO | 🟢 Bassa | ☐ | |
| CRM-05 | **Destinatari campagna**: appaiono SOLO i clienti con **consenso marketing** | PRO | 🔴 Alta | ☐ | |
| CRM-06 | **Editor email protetto** + non si crea più cliente a mano dalla rubrica | PRO | 🟢 Bassa | ☐ | |

### E — Backend / Dati (verifica indiretta) — *priorità ALTA per conformità*

| ID | Cosa testare | Edizione | Priorità | Esito | Note |
|------|--------------------------------------------------|----------|----------|-------|------|
| DB-01 | Dopo una prenotazione con spunta marketing → il cliente risulta **consenso = sì** nel CRM | Both | 🔴 Alta | ☐ | |
| DB-02 | Dopo una prenotazione con allergie + consenso → la richiesta mostra le allergie in admin senza errori | Both | 🔴 Alta | ☐ | |
| DB-03 | Una prenotazione pubblica va a buon fine (motore `create-booking` v20 attivo) | Both | 🔴 Alta | ☐ | |

---

## 📋 Checklist dettagliata (passi + risultato atteso)

### A — Pagina Prenota (pubblica)

**PR-01 — Privacy Policy in finestra (modale)** · *rilascio 19-06* ( fatto )
1. Apri `/prenota/<slug>` e **compila** alcuni campi (nome, ospiti, ecc.).
2. In fondo, clic sul link **«Privacy Policy»** dentro la frase del consenso.
3. ✔️ Atteso: si apre un **riquadro sopra il form** (stessa scheda), con il testo della policy.
4. Chiudi con la **X**, oppure cliccando **fuori** dal riquadro, oppure tasto **Esc**.
5. ✔️ Atteso: torni al form **con i campi ancora compilati**. Nessuna scheda nuova aperta.
6. Ripeti su 📱 375.

**PR-02 — Consenso allergie (art. 9 GDPR)** · *rilascio 18-06*  ( fatto )
1. Nel campo **«Intolleranze o esigenze alimentari»** scrivi qualcosa (es. «glutine»).
2. ✔️ Atteso: compare una **richiesta di consenso** specifica per i dati alimentari.
3. Prova a inviare **senza** dare il consenso → ✔️ Atteso: non invia / segnala il consenso mancante.
4. Dai il consenso e invia → ✔️ Atteso: prenotazione inviata.

**PR-03 — Consenso marketing facoltativo** · *rilascio 18-06*  ( fatto )
1. Compila una prenotazione **senza** spuntare la casella «ricevere email promozionali».
2. ✔️ Atteso: la prenotazione **parte lo stesso** (il marketing è facoltativo).
3. Rifai spuntando la casella → vedi DB-01.

**PR-04 — Limite coperti per fascia** · *rilascio 18-06* (serve config admin)  ( fatto )
1. In admin attiva il toggle limiti per-fascia e metti un **cap basso** su una fascia.
2. Dal pubblico prova a prenotare **più coperti del cap** in quella fascia.
3. ✔️ Atteso: messaggio tipo «la fascia "…" è al completo per questa data».

**PR-05 — Vincolo orario fuori fascia** · *rilascio 18-06* (serve config admin)  ( fatto )
1. In admin attiva il toggle **«rifiuta orari fuori fascia»**.
2. Dal pubblico scegli un orario **fuori** da ogni fascia.
3. ✔️ Atteso: «l'orario scelto non rientra negli orari di servizio».

**PR-06 — Orario notturno** · *rilascio 18-06* (serve fascia overnight)   ( fatto )
1. In admin crea una fascia che **supera la mezzanotte** (es. 17:30 → 04:00).
2. Dal pubblico prova **23:00** e **03:00** → ✔️ Atteso: accettati.
3. Prova **05:00** → ✔️ Atteso: rifiutato (fuori fascia).

**PR-07 — Rate limit più morbido (7)** · *rilascio 18-06* (opzionale, delicato)   ( Fatto )
1. Invia più prenotazioni di fila dallo stesso dispositivo.
2. ✔️ Atteso: il blocco «troppe richieste» scatta **più tardi** di prima (alla 8ª richiesta nel minuto, non alla 4ª). *Nota: non esagerare per non farti bloccare 24h.*

**PR-08 — Telefono nel riepilogo** · *rilascio 17-06*  ( fatto )
1. Digita il **tuo** numero nel campo telefono.
2. ✔️ Atteso: il numero appare nel **riepilogo laterale** mentre lo scrivi.
3. ✔️ Atteso: il telefono **del ristorante** resta solo nel footer (Orari + Contatti).

**PR-09 — Label dei campi cliccabili** · *rilascio 17-06* ( fatto )
1. Clic sul **titolo** sopra ogni casella: nome, email, telefono, data, ora, ospiti.
2. ✔️ Atteso: il cursore va nel campo corrispondente.

**PR-10 — Accordion carosello menù (desktop)** · *rilascio 16-06* (fatto )
1. Su 🖥️ desktop, apri la sezione menù del form.
2. ✔️ Atteso: le categorie si **aprono/chiudono ad accordion**.

**PR-11 — Validazione menù all'invio** · *rilascio 16-06* ( fatto , tuttavia non si muove la camera all'errore indicato)
1. Con una tipologia che usa il menù, lascia la selezione **incompleta** e invia.
2. ✔️ Atteso: blocco/avviso coerente con le 2 regole di compilazione.

**PR-12 — Card tipologia (label da config, testo, scroll)** · *rilascio 15/16-06*  ( fatto )
1. Guarda le card delle tipologie evento.
2. ✔️ Atteso: etichette **dalla configurazione** (non generiche), testo leggibile, carosello scrollabile.

### B — Admin → Impostazioni

**SET-01 / SET-02 — Limiti Prenotazioni** · *rilascio 18-06* ( fatto )
1. Vai in **Impostazioni** (Classic: «Imposta Fasce Orarie»; Pro: «Servizio»).
2. ✔️ Atteso: c'è la sezione **«Limiti Prenotazioni»** con 2 interruttori (limite per fascia + rifiuto fuori fascia).
3. ✔️ Atteso: **non** esiste più un campo «limite coperti giornaliero».
 
**SET-03 — Personalizza form: font + descrizione** · *rilascio 17-06*  (Fatto)
1. Impostazioni → **Personalizza form → Intestazione**.
2. Apri il dropdown **Font** → ✔️ Atteso: ogni voce è scritta **nel proprio font**.
3. Scrivi una **Descrizione**, premi **Salva**, poi **ricarica la pagina**.
4. ✔️ Atteso: la descrizione è **ancora lì** (non torna al placeholder).

**SET-04 — Footer dirty pulsante** · *rilascio 17-06* ( fatto )
1. In Impostazioni modifica un campo qualsiasi.
2. ✔️ Atteso: i pulsanti **Salva / Annulla** in basso pulsano con un alone arancione.

**SET-05 — Rotella mouse sui numeri** · *rilascio 17-06* ( no , caselle come walkin o coperti massimi per fascia o limite coperti ancora se metto puntatore dentro alla casella e muovo la rotella, cambia il valore. freccette e keybords funzionano bene.)
1. Posiziona il mouse su un campo numerico (coperti, prezzo magazzino, walk-in) e **scrolla**.
2. ✔️ Atteso: il valore **non cambia**. La digitazione e le frecce ▲▼ funzionano ancora.

**SET-06 — Magazzino avviso edition-aware** · *rilascio 17-06* (fatto )
1. Apri Menu/Magazzino.
2. ✔️ Atteso: l'avviso disponibilità è coerente con l'edizione (Classic/Pro).

**SET-07 — Prefill nome modale fascia (PRO)** · *rilascio 18-06* ( Fatto)
1. In Servizio apri una fascia **esistente** per modificarla.
2. ✔️ Atteso: il **nome** è già compilato col valore salvato.

**SET-08 — Niente falso avviso capienza** · *rilascio 18-06* (fatto )
1. Con le fasce **disattivate**, accetta una richiesta dalla tab «Prenotazioni in attesa».
2. ✔️ Atteso: **nessun** alert di capienza per-fascia.

### C — Admin → Prenotazioni / Calendario

**CAL-01 — Badge % su somma cap fasce** · *rilascio 18-06* ( fatto ) 
1. Con limiti per-fascia attivi e cap impostati, guarda il badge del giorno nel calendario.
2. ✔️ Atteso: la % è sul **totale dei coperti delle fasce** del giorno.

**CAL-02 — Card giorno max ~5 + «…»** · *rilascio 18-06*   ( Fatto ) 
1. Su un giorno con **molte** prenotazioni, guarda la card nel calendario.
2. ✔️ Atteso: mostra fino a ~5 voci, poi «…» (niente card che si allunga all'infinito).

**CAL-03 — Intolleranze senza «- N ospiti»** · *rilascio 18-06*  (fatto)
1. Apri una richiesta arrivata dal pubblico con allergie scritte a testo libero.
2. ✔️ Atteso: l'intolleranza **non** mostra il suffisso «- 1 ospite».

**CAL-04 — Ordine fasce nel calendario** · *rilascio 16-06* (fatto) "Fix richiesto per versione pro : funziona solo in classic. versione pro fasce orarie non hanno freccette "
1. Imposta un `display_order` alle fasce e guarda il calendario.
2. ✔️ Atteso: le fasce appaiono **nell'ordine impostato**.

### D — Admin → CRM / Email (PRO)

> Se sei su Classic e queste voci non ci sono, segna **⏭️** (non applicabile).

**CRM-05 — Destinatari solo con consenso (conformità!)** · *rilascio 18-06*  (fatto)
1. CRM → crea/invia una **campagna email**.
2. Nel selettore destinatari guarda l'elenco.
3. ✔️ Atteso: compaiono **solo** i clienti con **consenso marketing = sì**.

**CRM-01..04, 06** — campagne, personalizza email, toast errore, riepilogo, editor protetto · *rilascio 15/16-06*  ( fatto ) 
- Prova creazione campagna, anteprima/riepilogo, invio (con errore simulato → toast), e che dalla rubrica non si crei più un cliente a mano.

### E — Backend / Dati

**DB-01 — Consenso marketing salvato** · *mig. 053*  (fatto)
1. Fai una prenotazione pubblica **spuntando** il marketing, con una email.
2. In admin/CRM apri quel cliente.
3. ✔️ Atteso: risulta **consenso marketing = sì**.

**DB-02 — Consenso allergie salvato** · *mig. 054*  (fatto)
1. Fai una prenotazione pubblica con **allergie + consenso**.
2. In admin apri la richiesta.
3. ✔️ Atteso: le allergie si vedono, **nessun errore** di caricamento scheda.

**DB-03 — Motore prenotazioni v20** · *edge create-booking*   ( fatto )
1. Una qualsiasi prenotazione pubblica deve **andare a buon fine** (201, conferma a video).
2. ✔️ Atteso: nessun errore generico «Errore interno del server».

---

## Esito complessivo

| Area | Voci | ✅ | ❌ | ⏭️ |
|------|------|----|----|----|
| A — Pagina Prenota | 12 | | | |
| B — Impostazioni | 8 | | | |
| C — Calendario | 4 | | | |
| D — CRM/Email (PRO) | 6 | | | |
| E — Backend/Dati | 3 | | | |
| **Totale** | **33** | | | |

> Compila i numeri a fine giro. Se trovi un ❌, annota nella colonna `Note` cosa hai visto e su quale viewport: serve per il fix.
