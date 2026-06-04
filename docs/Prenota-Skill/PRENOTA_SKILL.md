# PRENOTA — Skill di area (entry point)

> **Cos'è questo file.** Il punto di ingresso dell'area **Pagina Prenota** (`/prenota/:slug`).
> Tiene il **senso** (a che serve, chi fa cosa, cosa è voluto e non va toccato) e la **mappa**
> verso i file di dettaglio. NON ripete i numeri e i dettagli tecnici: quelli vivono nei file in
> `contesto/` e, per i valori, nel codice. Un agente legge **questo file intero** prima di toccare
> l'area, poi apre **solo** il file di dettaglio che gli serve — e lo legge intero anche lui.

> **Trigger di routing:** «Pagina Prenota» · «form prenotazione clienti» · «/prenota/:slug» ·
> «striscia foto Prenota» · «Personalizza form» · «carosello/tipologie Prenota».

---

## 1. A che serve Pagina Prenota (il senso)

È la **pagina pubblica** dove il cliente finale prenota. Ha **due funzioni in una**:

1. **Vetrina** — presenta l'offerta del locale: foto (striscia o sfondo), tipologie di
   prenotazione, menù, caroselli, promo. Deve sembrare parte del **brand del ristoratore**, non un
   form generico.
2. **Raccolta richieste** — il cliente compila e invia; la richiesta arriva poi al ristoratore in
   **Admin → Prenotazioni → Richieste in attesa** (quella card è un'**altra area**: vedi
   `../per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md`).

## 2. Chi fa cosa (attori)

Due attori, mondi separati:

- **Mario (ristoratore)** — da **admin** configura la vetrina: testi, foto, modalità, menù, limiti,
  sfondo. **Non** invia prenotazioni. Ha uno **specchio di prova**: il pulsante **«Visualizza
  form»** in admin apre la pagina **come la vede il cliente**, per rispondere alle sue domande —
  *«cosa vede il cliente? funziona tutto? mi piace? come sta il testo di questo carosello nella
  card? cambio la descrizione del menù?»*. Mario **modifica e testa** sullo stesso flusso.
- **Anna (cliente)** — sulla **pagina pubblica** sceglie la modalità, eventualmente compone il menù,
  compila i suoi dati e invia. **Non vede mai** l'admin.

Il flusso dati che collega i due mondi (magazzino menù ↔ vetrina ↔ pagina pubblica) ha un
**resolver** dedicato: vedi `contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.

---

## 3. Limiti e regole VOLUTE — NON «aggiustarle»

> Questo è il pezzo che evita upgrade dannosi. Sono scelte di Matteo, non bug né dimenticanze. Un
> agente che pensa di «migliorarle» **prima chiede a Matteo**.

- **Limiti testo cliente silenziosi.** I cap sui campi di Anna (nome 65, intolleranze 550, ecc.)
  sono **volutamente invisibili**: nessun contatore in pagina, taglio silenzioso, messaggio unico
  «Testo troppo lungo» solo al submit. **Non** «aggiungere il contatore mancante».
- **Limiti testo admin = anti-rottura mobile.** I cap su ciò che Mario scrive (carosello, tipologie,
  menù promo, header) esistono per **non sfasciare il layout su mobile**: Mario non può scrivere 200
  caratteri dove la card ne regge ~38. Non sono arbitrari — sono tarati sullo spazio reale. Mappa
  completa: `contesto/PRENOTA_TEXT_LIMITS_MAP.md`.
- **Striscia foto sempre visibile, anche mobile.** A 375px restano ~75px decorativi. È **voluto**,
  non un bug responsive da «nascondere su mobile».
- **XOR card / carosello.** Una modalità mostra **O** card **O** carosello, **mai entrambi**. Non
  «permettere anche entrambi per flessibilità».
- **Carosello = una sola card con N foto.** In modalità carosello la modalità mostra **una** card con
  più foto (auto-selezione), niente griglia di sottotab. Non «manca la griglia».
- **Sotto 1256px: un solo riepilogo, niente barra fissa.** Su schermi `<1256px` niente barra fixed
  in basso né secondo pulsante Invia: il cliente scrolla fino al riepilogo per inviare (deciso
  02-06-26). Non «manca il pulsante sticky mobile».
- **La vetrina NON legge il magazzino in tempo reale per tutto.** I campi vetrina passano dal
  resolver `field_overrides`: alcuni «congelati» nella card di Mario, altri «live» dal preset. Non
  «far leggere sempre il valore live» — cancellerebbe le personalizzazioni di Mario. Dettaglio:
  `contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.

---

## 4. Questioni aperte (decise, da implementare)

> Non sono dimenticanze: sono decisioni di Matteo **in attesa di una sessione di esecuzione**. Un
> agente che le incontra sa che NON deve «sistemarle» di sua iniziativa, ma può proporne
> l'implementazione quando il task è pertinente. Tracciate in `docs/FOLLOW_UP.md`.

- **Numero portate (`courses_label`) — da mostrare.** Oggi salvato (max 12 char) ma **non
  renderizzato** in pagina. Decisione (04-06-26): mostrarlo **nella card, in basso a sinistra**, con
  il **prezzo allineato orizzontalmente in basso a destra**.
- **Testi menù ingredienti — da cappare.** Nome categoria / nome / descrizione ingrediente oggi
  **senza limite**. Decisione (04-06-26): **vanno cappati** con un limite sensato per il caso (stesso
  principio anti-rottura mobile del §3). → `docs/FOLLOW_UP.md` **FU-030**; sezione E in
  `contesto/PRENOTA_TEXT_LIMITS_MAP.md`.

---

## 5. LOCK struttura griglia

**`BookingRequestPage.tsx` — griglia con striscia laterale** è consolidata e testata su 3
breakpoint. Prima di toccarla: valuta se basta agire sui componenti figli; se devi toccare la
griglia, **leggi per intero** `BookingRequestPage` + `BookingPhotoStrip` + `BookingSummarySidebar` +
`BookingRequestForm` prima di editare; non violare gli invarianti strutturali. Dettaglio completo e
invarianti → **`contesto/PRENOTA_LAYOUT_CONTEXT.md` §0**. Modifiche che li violano vanno discusse con
Matteo prima.

Altri invarianti da non rompere senza conferma:
- **«Nessuna striscia» si salva come stringa vuota `''`, mai `NULL`** (colonna `setting_value` è
  `NOT NULL`). Capita quando Mario passa a sfondo pagina-intera: la striscia si svuota e quel vuoto
  va scritto `''`. Un «pulisci NULL» rompe il salvataggio — è già stato un incident. Serializer in
  `restaurantSettingRegistry.public_booking_strip_photo`. Dettaglio: `contesto/PRENOTA_LAYOUT_CONTEXT.md` §2.
- **Submit invariato — non toccare `useCreateBookingRequest`.**

---

## 6. Mappa: tocchi X → apri il file Y

| Se il task tocca… | Apri (e leggi intero) |
|---|---|
| Layout, griglia striscia, sfondo, header, ordine form, caselle, card ingredienti, sidebar riepilogo, validazione submit | `contesto/PRENOTA_LAYOUT_CONTEXT.md` |
| Limiti/cap testo (admin o cliente), contatori, `bookingPrenotaTextLimits.ts` | `contesto/PRENOTA_TEXT_LIMITS_MAP.md` (numeri ↔ codice) |
| Config admin «Personalizza form», `BookingFormConfigPanel`, salvataggio/autosave, XOR card/carosello, editor sottotab/carosello, card Sfondo | `contesto/PRENOTA_FORM_CONFIG_CONTEXT.md` |
| Flusso dati magazzino ↔ vetrina ↔ pubblico, `bookingFormResolver`, `field_overrides`, aggiungere campi a `SubTab`/`BookingMode` | `contesto/PRENOTA_DATA_FLOW_CONTEXT.md` **(OBBLIGATORIO prima di modificare)** |
| Pattern lampeggio/attenzione validazione (riusabile su altri form) | `../per-ui-design-skill/FORM_VALIDATION_ATTENTION_PATTERN.md` |
| Tab Menu admin (magazzino: ingredienti, categorie, promo, preset) | `../per-ui-design-skill/MENU_ADMIN_CONTEXT.md` |
| Card richiesta lato admin (Richieste in attesa) — **altra area** | `../per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` |

---

## 7. Principio di lettura (vale per tutta l'area)

**Pochi file, ma letti INTERI.** Quando apri un file di `contesto/` o un pezzo di codice, leggilo
per intero (non solo lo spezzone che sembra rilevante) — tranne micro-fix evidenti. I file sono
tagliati per starci in una lettura: se uno è troppo lungo per leggerlo tutto, segnalalo (va spaccato
per sotto-funzione). Il **valore numerico** è sempre nel codice (`bookingPrenotaTextLimits.ts` e
costanti vicine); i file `.md` lo **specchiano e spiegano il perché**, non lo sostituiscono.
