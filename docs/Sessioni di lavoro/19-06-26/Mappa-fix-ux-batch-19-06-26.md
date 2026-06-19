# Mappa fix UX / bug — batch Matteo (19-06-26)

> **Tipo:** analisi e mappatura (nessun codice modificato in questa sessione).  
> **Scopo:** ogni richiesta grezza → dove vive nell’app, cosa toccare, **decisioni prodotto** chiuse da Matteo (19-06-26).

---

## Legenda aree

| Area nell’app | Route / schermata | Skill d’ingresso |
|---------------|-------------------|------------------|
| **Privacy** | `/privacy` (+ modale in-page da Pagina Prenota) | `docs/Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md` |
| **Admin — Prenotazioni pendenti** | `/admin/prenotazioni` → tab **Prenotazioni** (badge pendenti) | `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` + `ADMIN_CLASSIC_SKILL.md` |
| **Admin — shell Pro** | Sidebar sinistra (Home, Servizio, CRM, Analytics) | `docs/Admin-Skill/contesto/ADMIN_SHELL_NAV_CONTEXT.md` |
| **Admin — nav tab dashboard** | Banner verde + 5 tab (Calendario, Prenotazioni, …) | `AdminDashboard.tsx` (stessa area admin) |
| **Pagina Prenota** | `/prenota/:slug` (form cliente) | `docs/Prenota-Skill/PRENOTA_SKILL.md` |
| **Menu QR — modale admin** | Admin → tab **Menu** → gestione QR → crea/modifica menu | `docs/Menu-QR-Skill/MENU_QR_SKILL.md` |
| **CRM — email campagne** | Admin Pro → **CRM** → campagne / template promo | `docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md` |

---

## Fix 1 — Nome piattaforma in Privacy Policy

### Prompt originale (Matteo)
> Cambiare nome in privacy policy, da calendarbackup a PrenotaZen.

### Mappatura nell’app
| Cosa vede il ristoratore / cliente | Componente | Storage / dati |
|-----------------------------------|------------|----------------|
| Testo legale «Privacy Policy» (pagina `/privacy` e modale dal form Prenota) | `src/pages/privacy/PrivacyPolicyContent.tsx` (condiviso da `PrivacyPolicyPage.tsx` e modale privacy) | Nessun DB: testo statico in codice. Modifiche legali → skill legal-production. |

**Punto esatto oggi:** sezione 1, riga che dice *«Il ristorante utilizza la piattaforma tecnologica **CalendarBackup**»* → sostituire con **PrenotaZen**.

**File correlati da controllare (solo se si vuole coerenza brand globale, fuori scope salvo richiesta):**
- `vite.config.ts` → `name: 'CalendarBackup'` (nome PWA, non privacy)
- `src/main.tsx` → log console build
- Documentazione interna repo (non visibile al cliente)

**Nota:** nel testo privacy, sezione **3-bis** («Revoca del consenso») dice ancora *contattare il ristorante* — va allineata al **fix 9** se si implementa il link di disiscrizione.

**Dubbi:** nessuno su questo punto.

---

## Fix 2 — Card prenotazioni pendenti (mobile)

### Prompt originale (Matteo)
> Sistemare card prenotazioni pendings. Problema da mobile con card prenotazione in pendings. Spostare testo sotto a icona e badge in modo da permettere al testo di occupare tutta la card per il lungo. Diminuire leggermente dimensione del testo. (foto 1)

### Mappatura nell’app
| Cosa vede il ristoratore | Componente | Storage |
|--------------------------|------------|---------|
| Tab **Prenotazioni** → sezione **«Richieste in Attesa»** → card espandibili (nome, data, badge «Pendente», ecc.) | `PendingRequestsTab.tsx` (lista) → **`BookingRequestCard.tsx`** (layout card) | Dati da tabella `booking_requests` (Supabase) |

**Problema visivo (foto 1):** su mobile stretto, icona tipologia + badge «Pendente» + nome cliente competono sulla stessa riga → nome e telefono vanno a capo in modo brutto («Francesc» / «a Previato»).

**Zona codice:** `BookingRequestCard.tsx` — blocco header collassato (`booking-request-digest-trigger`, ~righe 175–291):
- Badge + chevron sono già `absolute right-0 top-0` ma la griglia dati (`flex` con icona `DigestIcon` + colonne testo) parte ancora **affiancata** all’icona.
- **Fix atteso:** riga 1 = icona tipologia + badge stato (e chevron); riga 2+ = tutti i campi a **larghezza piena**; ridurre `text-base` → `text-sm` (o scala responsive) su mobile.

**Contesto doc esistente:** `docs/per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md`

**Dubbi:** nessuno — la foto conferma il componente.

---

## Fix 3 — Sidebar admin: deve restare chiusa dopo navigazione

### Prompt originale (Matteo)
> Da mobile e anche nelle altre view in generale se chiudo la sidebar e poi navigo sidebar si riapre, errore sidebar se chiusa deve rimanere chiusa finché utente non la riapre con apposito pulsantino.

### Mappatura nell’app
| Cosa vede il ristoratore | Componente | Storage |
|--------------------------|------------|---------|
| Colonna sinistra Pro (icone / drawer espanso / nascosta) + pulsante flottante «Mostra menu» | **`AdminShell.tsx`** — stato `sidebarMode`: `'hidden' \| 'icons' \| 'expanded'` | Solo stato React in memoria (non persistito; default `'icons'`) |

**Comportamento atteso (doc):** `docs/Admin-Skill/contesto/ADMIN_SHELL_NAV_CONTEXT.md` — tre stati sidebar; pulsante «Nascondi menu» → `hidden`.

**Ipotesi tecnica:** qualcosa riporta `sidebarMode` da `hidden` a `icons` dopo navigazione (cambio sezione `/admin/crm` ↔ `/admin/prenotazioni`, cambio tab dashboard, refresh, o remount di `AdminShellInner`). Oggi **nessun** `localStorage` / `sessionStorage` per lo stato chiuso.

### ✅ Decisione Matteo (19-06-26)
- «Chiudo del tutto» = stato **`hidden`**: **nessuna** colonna icone a sinistra, **nessun** drawer — schermo interamente occupato dal contenuto (`main` senza `pl-16`).
- Dopo qualsiasi navigazione (cambio sezione sidebar, tab dashboard, footer, ecc.) deve **restare chiusa** così.
- **Unico** modo per riaprirla: il **pulsantino tondo in alto a sinistra** (freccia verso destra) che oggi imposta `sidebarMode` da `hidden` → `icons`.

**Cosa sistemare nel codice (`AdminShell.tsx`):**
1. Trovare perché `hidden` torna `icons` (o la colonna icone riappare) dopo navigazione — audit di tutte le `setSidebarMode`.
2. Se serve, persistere `hidden` in `sessionStorage` per sopravvivere a remount/refresh senza riaprire la colonna.
3. Garantire che `openSection`, cambio tab, `exitBodyOverrideToDashboard` **non** riattivino la sidebar se l’utente l’ha nascosta.

*(Classic **non** ha sidebar — vale solo edition **Pro/Enterprise** con `features.sidebar = true`.)*

---

## Fix 4 — Riepilogo prenotazione non deve scorrere sotto «Invia Prenotazione»

### Prompt originale (Matteo)
> Bug: Il riepilogo della prenotazione non deve scorrere sotto il pulsante «Invia prenotazione» in pagina prenota cliente.

### Mappatura nell’app
| Cosa vede il cliente | Componente | Storage |
|----------------------|------------|---------|
| Pagina pubblica prenotazione → box **«Riepilogo Prenotazione»** con pulsante verde **Invia Prenotazione** in fondo al box | `BookingRequestPage.tsx` → `BookingSummarySidebar.tsx` (`submitButton` prop) → form `BookingRequestForm.tsx` | Config form da `restaurant_settings.booking_public_form_config`; dati riepilogo = stato form locale |

### ✅ Decisione Matteo (19-06-26)
- Il bug si vede su **desktop** (Matteo: «si rompe»); **probabilmente anche tablet**, non solo mobile.
- Il contenuto del riepilogo **non deve passare sotto** il pulsante «Invia Prenotazione» mentre si scrolla — il pulsante deve restare sempre sopra / leggibile e il testo del riepilogo non deve finire «dietro» ad esso.

**Layout attuale (doc):** `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` §4 — sotto 1256px riepilogo in flusso con submit in fondo; da ≥1256px riepilogo laterale sticky (e da ≥1600px anche istanza esterna full-page). Il fix deve coprire **tutte le varianti** dove compare il riepilogo + submit (`BookingSummarySidebar` con `submitButton`, layout full-page e layout legacy).

**Zona codice:** `BookingSummarySidebar.tsx` — separare area contenuto scrollabile da footer del submit (sfondo opaco + `z-index` / `sticky` interno alla card, o scroll solo sulla parte centrale del riepilogo).

---

## Fix 5 — Menu QR modale: etichetta «Foto Categoria»

### Prompt originale (Matteo)
> Nel modal per creare o modificare menu QR … nella card categorie di ingredienti … placeholder con icona (se non c'è foto) … Non è intuitivo che è lì che va messa la foto … scrivere bene evidente «Foto Categoria».  
> DOM: `MenuQrCategoryCardsSection` → `div.flex items-center gap-3` con testo «Carica».

### Mappatura nell’app
| Cosa vede il ristoratore | Componente | Storage |
|--------------------------|------------|---------|
| Admin → **Menu** → gestione Menu QR → modale crea/modifica → sezione card per categoria (titolo, descrizione, foto, ingredienti nascosti) | **`MenuQrCategoryCardsSection`** in `MenuHomepageConfigPanel.tsx` (usata da `MenuQrModal.tsx`) | Immagini: Supabase Storage path `menu-qr/.../cat/{key}.webp`; override titolo/descrizione/icona nel payload menu QR (`restaurant_settings` / record menu QR) |

**Punto esatto (~righe 496–526):** riga orizzontale con placeholder icona 12×16 + pill «Carica» / «Cambia» — manca label visibile **«Foto categoria»**.

**Fix atteso:** layout verticale o label sopra il placeholder: titolo **«Foto categoria»** + sotto area upload (icona se vuota, come ora) + pulsante Carica; allineato a pattern già usato in `MenuPricesTab` («Caricamento foto…»).

**Dubbi:** nessuno — DOM path e screenshot concordano.

---

## Fix 6 — «Richieste speciali» solo note cliente

### Prompt originale (Matteo)
> Nelle card di riepilogo prenotazione, prenotazioni Pending, «Richieste speciali» riporta dati non richiesti, deve riportare solo i dati inseriti da utente in «note».

### Mappatura nell’app
| Cosa vede il ristoratore | Componente | Campo DB |
|--------------------------|------------|----------|
| Card pending — sezione espansa **«Richieste Speciali»**; anche anteprima nel header collassato (icona messaggio) | **`BookingRequestCard.tsx`** (~righe 243–249 digest, 426–432 espanso) | `booking_requests.special_requests` (testo) |

**Causa root:** al submit dalla Pagina Prenota, `BookingRequestForm.tsx` (~573–580) **prepende automaticamente** alla nota un prefisso tipo `[Menu Laurea Premium - €35/p]` quando il cliente sceglie una sottotab senza preset. Quel prefisso finisce in `special_requests` e oggi viene mostrato integralmente come «richiesta speciale».

**Utility già esistente (non usata in card):** `stripSubTabAutoPrefix()` in `buildBookingEmailSummary.ts` — stessa logica già usata per le **email** riepilogo.

**Fix atteso:**
1. In `BookingRequestCard`, prima di mostrare `special_requests`, passare da `stripSubTabAutoPrefix(booking.special_requests, subTabLabel)` (risolvere sottotab con `resolveSubTabFromBooking` + config form).
2. Mostrare blocco «Richieste speciali» **solo se** il testo risultante non è vuoto.
3. Valutare stesso filtro in `ArchiveTab.tsx` / digest calendario se Matteo vuole coerenza (non richiesto esplicitamente).

**Comportamento coerente (non chiesto esplicitamente ma logico):** nascondere anche la riga nel **digest collassato** (icona MessageSquare) quando, dopo lo strip, non resta testo utente.

---

## Fix 7 — Una sola tipologia attiva: niente manina / selezione

### Prompt originale (Matteo)
> Se ho solo una tipologia di prenotazione attiva, non deve esserci la manina sulla card in pagina prenota, perché c'è solo una tipologia impostata ed è automaticamente selezionata. E nemmeno la selezione attiva su unica tipologia di prenotazione attiva deve apparire.

### Mappatura nell’app
| Cosa vede il cliente | Componente | Storage |
|----------------------|------------|---------|
| Pagina Prenota → card orizzontali tipologia (es. «Cena», «Laurea») | **`BookingModeCards.tsx`** (da `BookingRequestForm.tsx` ~1162) | `restaurant_settings.booking_public_form_config` → `booking_modes[]` con `enabled: true/false` |

**Oggi:** ogni modalità abilitata è un `<button>` con `cursor` implicito, bordo arancione + `ring` se `isActive` — anche con `enabledModes.length === 1`.

### ✅ Decisione Matteo (19-06-26)
- Con **una sola** tipologia attiva: la card **resta visibile** (nome/icona tipologia) ma **non è cliccabile**.
- Niente manina (`cursor-pointer`), niente hover da selezione, niente bordo/anello arancione «attivo».
- La tipologia è già selezionata automaticamente dal form (`activeModeId` / `initialBookingType`).

---

## Fix 8 — Tab navigazione admin: nomi illeggibili su mobile

### Prompt originale (Matteo)
> Da mobile nome dei tab principali di navigazione non si leggono. Provare a ridurre carattere e dimensioni icona. (foto 2)

### Mappatura nell’app
| Cosa vede il ristoratore | Componente | Dettaglio |
|--------------------------|------------|-----------|
| Banner verde ristorante → **5 tab** (Calendario, Preno…, Archivio, Menu, Impost.) | **`AdminDashboard.tsx`** — componente interno **`NavItem`** (~righe 60–146, griglia nav ~330–364) | Su mobile (`sm:hidden`) testo = `mobileLabel` o prima parola del label → «Preno…», «Impost.» per troncamento |

**Classi attuali:** icona `h-4 w-4`, testo tab `text-sm`, `min-h-11`, griglia `grid-cols-3` su mobile (5 tab su 2 righe); su mobile il testo è troncato (`Preno…`, `Impost.`).

### ✅ Decisione Matteo (19-06-26)
- Su mobile: layout **icona sopra + testo sotto** (due righe), così le etichette si leggono per intero senza troncamento aggressivo.
- Verificare che il badge pendenti sulla tab Prenotazioni resti visibile e non si sovrapponga.

**Nota:** il **footer** ha scorciatoie solo icona (senza testo) — la foto 2 riguarda i **tab in header**, non il footer.

---

## Fix 9 — Revoca consenso marketing via link email

### Prompt originale (Matteo)
> Gestire la revoca del consenso tramite link nella email inserito automaticamente dall'app.  
> La revoca non dovrà avvenire contattando azienda, ma disiscrivendosi cliccando il link in fondo alla email (cambiare footer email e metterci link cliccabile per disiscriversi e togliere consenso dal DB se utente clicca e avvisare utente di avvenuta disiscrizione con successo).  
> Se utente revoca consenso mantenere il cliente nella rubrica dell'azienda, ma non è più selezionabile cliente per campagne email.

**Checklist Matteo:**
- [ ] La revoca del consenso non deve avvenire contattando direttamente l'azienda.
- [ ] L'utente deve disiscriversi cliccando il link presente in fondo all'email.
- [ ] Il footer dell'email deve essere modificato per includere un link cliccabile per la disiscrizione e la rimozione del consenso dal DB.

### Mappatura nell’app
| Cosa vede chi | Componente / layer | Storage |
|---------------|-------------------|---------|
| Cliente — checkbox consenso promo in form Prenota | `DietaryRestrictionsSection.tsx` (testo: *«Posso revocare il consenso in qualsiasi momento»*) | Scrittura: `booking_requests.marketing_consent` + sync `customers.marketing_consent` (migrazione `053_marketing_consent.sql`, edge `create-booking`) |
| Cliente — testo legale revoca | `PrivacyPolicyContent.tsx` §3-bis (oggi: *contattare il ristorante*) | Testo statico — **da aggiornare** insieme al link |
| Admin — invio campagne / promo | `useSendCampaignEmail.ts`, `useSendPromoEmail.ts` | Filtra già con `filterEmailsWithMarketingConsent` (`promoRecipientEligibility.ts`) |
| Template HTML email promo/campagne | **`src/lib/emailTemplates.ts`** — `getPromoEmail`, `getCampaignEmail` | Footer oggi: *«Per non riceverne più, **contattaci**»* (righe ~438, ~565) |
| Admin — rubrica CRM | `useCustomers.ts`, picker campagne CRM | `customers.marketing_consent` — se `false`, escluso da campagne (già previsto) |

### ✅ Decisione Matteo (19-06-26)
- Link di disiscrizione **solo nelle email marketing** (campagne + promo da `getCampaignEmail` / `getPromoEmail`). **Non** nelle email transazionali (prenotazione accettata/rifiutata).
- Footer email: sostituire «contattaci» con **link cliccabile** generato automaticamente dall’app (per destinatario).
- Flusso utente:
  1. Clic sul link nell’email.
  2. Si apre una **pagina pubblica dedicata** (solo per chi ha cliccato — niente login admin).
  3. **Prima** si aggiorna il DB: `customers.marketing_consent = false` (cliente **resta** in rubrica CRM, non cancellato).
  4. **Poi** si mostra il messaggio di conferma scritto da noi (es. disiscrizione andata a buon fine, non riceverà più promo).
- L’admin non deve più dover gestire la revoca manualmente; il picker campagne continua a escludere chi ha `marketing_consent = false`.

**Oggi NON esiste:** route pubblica disiscrizione, edge per revoca, token/link per-destinatario, pagina conferma.

**Pezzi da costruire (riferimento tecnico, non prompt):**
- Edge o API pubblica sicura (token per `tenant_id` + email) → UPDATE consenso.
- Pagina pubblica + route in `router.tsx`.
- Footer in `emailTemplates.ts` + passaggio email in fase invio campagna/promo.
- Allineare `PrivacyPolicyContent` §3-bis (niente più «contatta il ristorante» per revoca marketing).
- Legal doc se necessario (`LEGAL_STATE_CONTEXT`, `DATA_INVENTORY_CONTEXT`).

**Collegamenti:** `FU-EMAIL-8`; batch 18-06 P3 (filtro consenso picker — complementare).

---

## Riepilogo priorità e raggruppamento suggerito

| Gruppo | Fix | Peso | Aree |
|--------|-----|------|------|
| **A — Copy / UI leggera** | 1, 5, 8 | light | Privacy, Menu QR modale, AdminDashboard nav |
| **B — Card / layout** | 2, 6 | standard | BookingRequestCard |
| **C — Prenota pubblico** | 4, 7 | standard | BookingSummarySidebar, BookingModeCards |
| **D — Admin shell** | 3 | standard | AdminShell |
| **E — Compliance email** | 9 + allineamento fix 1 §3-bis | **deep** (DB + edge + route + template + legal) | CRM, emailTemplates, router, legal |

---

## Decisioni prodotto — riepilogo (Matteo, 19-06-26)

| Fix | Cosa vuoi |
|-----|-----------|
| **3** | Sidebar **completamente nascosta** (zero colonna icone). Resta chiusa dopo navigazione. Si riapre **solo** col tondino freccia-destra in alto. |
| **4** | Riepilogo che scorre **sotto** «Invia Prenotazione» — problema su **desktop** (e prob. tablet); contenuto non deve finire dietro al pulsante. |
| **7** | Una tipologia: card **visibile, non cliccabile**, senza stile «selezionata». |
| **8** | Tab admin mobile: **icona sopra, testo sotto** (due righe). |
| **9** | Disiscrizione **solo email marketing** → link → pagina pubblica → DB revoca → messaggio successo al cliente. Cliente resta in rubrica. |

---

## Verifica QA suggerita (post-implementazione)

Viewport: **375×812** (mobile), **834×1194** (tablet), **1280×800** (desktop) — `docs/Testing-Skill/TESTING_SKILL.md` §7.

| Fix | Controllo manuale |
|-----|-------------------|
| 1 | Apri `/privacy` e modale privacy da Prenota → compare «PrenotaZen», non «CalendarBackup». |
| 2 | Admin → Prenotazioni pendenti → card su mobile: nome a tutta larghezza sotto badge. |
| 3 | Pro: «Nascondi menu» → **nessuna** colonna a sinistra → naviga ovunque → resta chiusa finché non premi tondino freccia-destra. |
| 4 | Prenota **desktop + tablet** (e mobile): riepilogo lungo → pulsante Invia sempre leggibile, contenuto non passa sotto. |
| 8 | Admin header tab su 375px: icona sopra, etichetta sotto, testo leggibile. |
| 5 | Modale Menu QR → ogni categoria mostra «Foto categoria» chiaro. |
| 6 | Pending con solo prefisso auto → nessuna «Richiesta speciale»; con nota utente → solo la nota. |
| 7 | Una tipologia attiva → niente manina / bordo selezione. |
| 9 | Email campagna/promo → link disiscrizione → pagina conferma al cliente → `marketing_consent = false`, cliente ancora in rubrica, non in picker campagne. |

---

*Aggiornato con decisioni Matteo — 19-06-26. File di mappatura/intento prodotto; implementazione separata.*
