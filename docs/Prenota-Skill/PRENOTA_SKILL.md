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

## 2-bis. Il flusso completo (percorso utente + flusso dati affiancati)

> Questa è la mappa «cosa succede dall'inizio alla fine». A sinistra il **percorso di Anna** (cosa
> vede e fa); a destra **dove vanno i dati**. Serve a un agente per capire dove si inserisce una
> modifica e cosa NON deve rompere a valle.

**Prima — Mario configura (in admin, una volta):**
1. In **Personalizza form** decide header (testi/font/colore), tipologie, sottotab/carosello, sfondo
   (striscia o pagina intera), promo. → salvato in `restaurant_settings.booking_public_form_config`
   (un JSON) + `restaurant_name`/`contact_*` in Anagrafica.
2. In **tab Menu** (magazzino) gestisce categorie, ingredienti, menù preselezionati (preset), promo.
   → tabelle `menu_categories`/`menu_items` + JSON `booking_custom_staff_presets`/`booking_menu_promos`.
3. Clicca **«Visualizza form»** = lo specchio di prova: apre la pagina come la vede Anna, per
   controllare che testi e foto stiano bene. Modifica e ri-testa finché è soddisfatto.

**Poi — Anna prenota (sulla pagina pubblica `/prenota/:slug`):**

| Passo di Anna (user journey) | Cosa fa il sistema ai dati (data flow) |
|---|---|
| Apre il link col **`:slug`** del locale | `TenantContext` risolve lo `slug` → `tenantId`; client **pubblico anonimo** (`supabasePublic`, niente sessione) carica config + menù |
| Vede header, foto, **sceglie una tipologia** (`BookingMode`) | la vetrina mostra i valori passati dal **resolver** `field_overrides`: alcuni «congelati» nella card di Mario, altri «live» dal preset |
| Se la modalità ha menù: **compone il menù** (o lo vede fisso) | `MenuSelection`/`BookingMenuComposeGrid` leggono il preset; prezzo = somma piatti **oppure** prezzo×ospiti se menù fisso |
| Se carosello: **scorre le foto** (niente griglia) | una sola card con N slide (vedi XOR, §3) |
| **Compila i suoi dati** (nome, contatti, data/ora, ospiti, intolleranze, richieste) | validazione **solo React** (`noValidate` sul form); cap testo **silenziosi** (§3) |
| Clicca **Invia** | se invalido → **triplo feedback** (messaggio sotto campo + lampeggio arancione + scroll + toast chiaro col primo errore). Se valido → **POST** all'edge function `create-booking` |
| Vede conferma | `create-booking` (Deno) **ri-valida** i limiti (difesa server), poi scrive la riga in **`booking_requests`** col **service key** (bypassa RLS perché Anna è anonima) |

**Dopo — Mario riceve:** la richiesta appare in **Admin → Prenotazioni → Richieste in attesa**
(`BookingRequestCard`, **altra area** — vedi `../per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md`).

**Tre confini da non confondere** (un agente che li mescola rompe il flusso):
- **Magazzino** (tab Menu) ≠ **vetrina** (Personalizza form) ≠ **pagina pubblica** (cosa vede Anna).
- **Client pubblico anonimo** (`supabasePublic`, no sessione) ≠ client admin autenticato.
- **Config** (JSON `booking_public_form_config`) ≠ **dati prenotazione** (tabella `booking_requests`).

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
- **Sottotab abilitate ma vuote = non mostrare niente.** Se Mario abilita Card/Carosello ma non ha
  almeno una card valida o un carosello valido, la pagina pubblica **non** deve cadere nella vecchia
  griglia menù/fallback. Card valida = titolo compilato; importare un menù preselezionato lo compila,
  ma se Mario lo svuota il salvataggio deve bloccarsi;
  carosello valido = almeno una foto. La presentazione torna `null` quando resta senza sottotab valide.
- **Nessun menù pubblico hardcoded.** La vecchia `MenuSelection` non è un fallback pubblico autonomo:
  compare solo dopo una card scorrevole valida collegata a un menù preselezionato. Se non c'è una
  card/carousel salvato non si mostra niente.
- **Nessun dato aziendale inventato nel pubblico.** Nome ristorante, orari, contatti, tipologie e
  menù devono arrivare da impostazioni salvate dal tenant. Se mancano, non usare fallback tipo
  `Al Ritrovo`, orari default o menù built-in con ingredienti hardcoded.
- **Sotto 1256px: un solo riepilogo, niente barra fissa.** Su schermi `<1256px` niente barra fixed
  in basso né secondo pulsante Invia: il cliente scrolla fino al riepilogo per inviare (deciso
  02-06-26). Non «manca il pulsante sticky mobile».
- **La vetrina NON legge il magazzino in tempo reale per tutto.** I campi vetrina passano dal
  resolver `field_overrides`: alcuni «congelati» nella card di Mario, altri «live» dal preset. Non
  «far leggere sempre il valore live» — cancellerebbe le personalizzazioni di Mario. Dettaglio:
  `contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.

---

## 3-bis. Comportamento per CAPACITÀ, non per nome (sistema capability — 05-06-26)

> **Regola di fondo, perché in passato era nascosta nel codice.** Cosa una tipologia *fa* (mostra
> menù sì/no, intolleranze sì/no) **non deve dipendere dal NOME** (`tavolo` / `rinfresco_laurea` /
> `menu_prezzo_fisso`): i nomi sono etichette. Deve dipendere dalla **capacità**, risolta a cascata.
> Un agente che aggiunge un `=== 'tavolo'` o `=== 'rinfresco_laurea'` per decidere cosa mostrare sta
> reintroducendo un bug già chiuso. Fonte: `src/features/booking/utils/bookingCapabilities.ts`.

**I tre livelli (risoluzione a cascata, runtime, nessuna migrazione DB):**
- **Livello A (esplicito):** `BookingMode.capabilities.uses_menu/uses_dietary`, impostate dall'admin.
  ⚠️ **Oggi NON ha interfaccia** (nessun controllo in `BookingFormConfigPanel`): il campo è
  parsato e preservato (LOCK Parser/normalizer) ma **nessuno lo scrive**. È un gancio per il futuro.
- **Livello B (dati, solo pubblico):** card `display:'cards'` con `preset_id` risolto → griglia menù in
  `MenuSelection`; **oppure** card manuale senza `preset_id` ma con `label` → solo blocco titolo/descrizione
  (senza griglia). Gate: `activeSubTabShowsMenu` in `BookingRequestForm`.
- **Livello C (default per tipo):** riproduce il comportamento storico
  (`rinfresco_laurea`/`menu_prezzo_fisso` → menù+intolleranze; `tavolo` → no). Funzione
  `defaultModeCapabilities`. Lo shim **deprecato** `bookingTypeUsesMenuSelections` delega qui — usalo
  solo dove c'è il `booking_type` di una prenotazione GIÀ SALVATA (calendario, card richiesta,
  `menuPricing`), mai per nuove decisioni di vetrina. Per le decisioni nuove usa `modeUsesMenu(mode)`.

**Conseguenza onesta da sapere:** finché il Livello A non ha UI, il comportamento menù/intolleranze
dipende ancora dai NOMI via Livello C (più il Livello B nel pubblico). Il sistema è **metà costruito**.

**Residui per-nome nel pubblico — CHIUSI 05-06-26 (FU-036, NON reintrodurli):** i tre punti che
decidevano per nome sono stati migrati a `modeUsesMenu`/`modeUsesDietary` e blindati con test:
`BookingSummarySidebar` (ora `modeUsesMenu(activeMode)`), reset intolleranze in `BookingRequestForm`
(ora `modeUsesDietary(nextMode)`), `shouldShowComposeMenuHeader` in `presetMenus.ts` (ora
`defaultModeCapabilities(...).uses_menu`, include anche `menu_prezzo_fisso`). Caccia multi-agent
05-06-26: nessun altro residuo per-nome nel pubblico; quelli rimasti in **area admin**
(`AdminBookingForm`, `DetailsTab`) operano su prenotazioni GIÀ SALVATE → legittimi. La sezione
**Intolleranze è mostrata per OGNI tipologia** — questa è una **scelta deliberata di Matteo**
(05-06-26): `modeUsesDietary` esiste come gancio ma NON è collegata al gate di render nel pubblico,
così la sezione resta universale. Per disattivarla su una tipologia, Matteo collega `modeUsesDietary`
davanti al render della sezione (un punto solo) quando gli serve. **Non** «collegarla d'iniziativa».
Cosa è coperto da test → `contesto/PRENOTA_TEST_SUITE_INDEX.md`.

**Valori magici ordinamento categorie (non arbitrari, documentati qui):** categorie presenti negli
item ma assenti dal catalogo DB → `sort_order: 1000 + index` (in fondo); chiave senza `sort_order`
DB → fallback `999`. Coerenti tra `MenuSelection`, `orderCategoryKeys`, `BookingSummarySidebar`.

**Cosa è già testato (riferimenti):** gate menù + filtro preset → `bookingCapabilities.test.ts` +
`MenuSelectionCategoryEntries.test.ts`; capabilities round-trip → `bookingPublicFormConfig.test.ts`;
preset selezionabile per capacità → `presetMenuDisplay.test.ts`; resolver → `bookingFormResolver.test.ts`.

---

## 4. Questioni aperte (decise, da implementare)

> Non sono dimenticanze: sono decisioni di Matteo **in attesa di una sessione di esecuzione**. Un
> agente che le incontra sa che NON deve «sistemarle» di sua iniziativa, ma può proporne
> l'implementazione quando il task è pertinente. Tracciate in `docs/FOLLOW_UP.md`.

- **Testi menù ingredienti — prova Fase 1 (FU-030, 10-06-26).** Cap **24/24/79** via
  `BOOKING_MENU_COMPOSE_TEXT_LIMITS`; clamp silenzioso in pubblico, contatori in `MenuPricesTab`.
  Resta in follow-up finché Matteo non accetta dopo revisione (Fase 2 QA). Mappa §E in
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
- **Submit invariato — logica mutation.** Il payload e il lock di `useCreateBookingRequest` restano invariati; il **feedback visivo** errori POST (inline + pulse + toast) vive in `BookingRequestForm` via `bookingPublicFormErrorFeedback.ts`.

---

## 6. Mappa: tocchi X → apri il file Y

| Se il task tocca… | Apri (e leggi intero) |
|---|---|
| Layout, griglia striscia, sfondo, header, ordine form, caselle, card sottotab pubbliche (`BookingSubTabCards`), card ingredienti, sidebar riepilogo, validazione submit | `contesto/PRENOTA_LAYOUT_CONTEXT.md` |
| Limiti/cap testo (admin o cliente), contatori, `bookingPrenotaTextLimits.ts` | `contesto/PRENOTA_TEXT_LIMITS_MAP.md` (numeri ↔ codice) |
| Limiti **capienza/coperti** (posti disponibili per fascia — non caratteri testo) | `../Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` + edge **`supabase/functions/create-booking/`** — NON confondere con `PRENOTA_TEXT_LIMITS_MAP` |
| Config admin «Personalizza form», `BookingFormConfigPanel`, salvataggio/autosave, XOR card/carosello, editor sottotab/carosello, card Sfondo | `contesto/PRENOTA_FORM_CONFIG_CONTEXT.md` |
| Flusso dati magazzino ↔ vetrina ↔ pubblico, `bookingFormResolver`, `field_overrides`, aggiungere campi a `SubTab`/`BookingMode` | `contesto/PRENOTA_DATA_FLOW_CONTEXT.md` **(OBBLIGATORIO prima di modificare)** |
| Pattern lampeggio/attenzione validazione (riusabile su altri form) | `../per-ui-design-skill/FORM_VALIDATION_ATTENTION_PATTERN.md` |
| Tab Menu admin (magazzino: ingredienti, categorie, promo, preset) | `../Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| Card richiesta lato admin (Richieste in attesa) — **altra area** | `../per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` |
| **Test della pagina** (cosa è già blindato, dove aggiungere test, come girarli per fronte) | `contesto/PRENOTA_TEST_SUITE_INDEX.md` |

---

## 7. Principio di lettura (vale per tutta l'area)

**Pochi file, ma letti INTERI.** Quando apri un file di `contesto/` o un pezzo di codice, leggilo
per intero (non solo lo spezzone che sembra rilevante) — tranne micro-fix evidenti. I file sono
tagliati per starci in una lettura: se uno è troppo lungo per leggerlo tutto, segnalalo (va spaccato
per sotto-funzione). Il **valore numerico** è sempre nel codice (`bookingPrenotaTextLimits.ts` e
costanti vicine); i file `.md` lo **specchiano e spiegano il perché**, non lo sostituiscono.
