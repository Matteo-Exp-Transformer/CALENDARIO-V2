# Intervista nuovo cliente — raccolta dati di configurazione azienda

> **A cosa serve.** Documento **completo** da compilare quando intervisti un nuovo ristorante, per
> raccogliere **tutto** ciò che serve a impostare la sua azienda (tenant) nella Console, **per ogni
> versione venduta**. Dopo l'intervista, dalla scheda azienda della Console imposti i valori raccolti.
>
> **Come si usa.** È un documento **vivo e sovrabbondante di proposito**: contiene tutti i campi
> possibili. In base al cliente e alla versione che compra, **userai solo le sezioni pertinenti** e
> salterai il resto (ogni campo dice a quale versione serve). I campi 🟩 li può dire il cliente, i
> campi 🟦 li decidi tu in vendita.
>
> **Fonti di verità** (non duplicare i valori a mano, qui sono specchiati):
> `docs/Servizio-Config/INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`,
> registro impostazioni `src/features/booking/lib/restaurantSettingRegistry.ts`,
> versioni `src/config/features.ts`. Se il codice diverge, **vince il codice**.

---

## Come leggere le tabelle

- **Versione**: `Classic` (base) · `Pro` (sala/tavoli) · `+QR` (menu digitale add-on). «tutte» = sempre.
- **Chi**: 🟩 lo può dire il cliente (onboarding) · 🟦 lo decidi tu in vendita (console).
- **Dove va**: dove finisce il dato — colonna di `organizations`, chiave di `restaurant_settings`,
  riga di `tenant_features`, o tabella dedicata (sale/tavoli/menu).
- **Default**: valore consigliato se il cliente non ha preferenze.
- **Valore deciso**: ← **la colonna che compili tu durante l'intervista.**

---

## Sezione 0 — Anagrafica e versione venduta

| Campo | Versione | Chi | Dove va | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Nome locale | tutte | 🟩 | `organizations.name` / setting `restaurant_name` | — | |
| Slug (identificativo URL) | tutte | 🟦 | `organizations.slug` | da nome | |
| **Versione venduta** | tutte | 🟦 | `organizations.edition` = `classic` / `pro` / `enterprise` | classic | |
| Add-on Menu QR (+QR su Classic) | Classic | 🟦 | `tenant_features` `qrMenu` enabled | off | |
| Tenant attivo | tutte | 🟦 | `organizations.is_active` | true | |
| Piano commerciale | tutte | 🟦 | `organizations.plan` | — | |
| Max prenotazioni/anno | tutte | 🟦 | `organizations.max_bookings_per_year` | — | |
| Max richieste prenotazione/anno | tutte | 🟦 | `organizations.max_booking_requests_per_year` | — | |

> **Nota versioni:** `pro` ed `enterprise` accendono **tutte** le 9 funzioni avanzate (sidebar, home,
> CRM, analytics, servizio, walk-in, no-show, assegnazione tavoli, Menu QR). `classic` non ne accende
> nessuna: le singole funzioni extra su Classic si aggiungono come add-on in `tenant_features`.

---

## Sezione 1 — Dati del locale e contatti

| Campo | Versione | Chi | Dove va (`restaurant_settings`) | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Email di contatto | tutte | 🟩 | `contact_email` | — | |
| Telefono | tutte | 🟩 | `contact_phone` | — | |
| Indirizzo | tutte | 🟩 | `contact_address` | — | |
| Fuso orario | tutte | 🟦 | `timezone` | `Europe/Rome` | |

---

## Sezione 2 — Funzioni accese (feature / add-on)

> Per Classic, ogni riga ON = un override in `tenant_features`. Per Pro/Enterprise sono già tutte ON.

| Funzione (`feature_key`) | Cosa fa | Versione tipica | ON? (valore deciso) |
|--------------------------|---------|-----------------|---------------------|
| `sidebar` | Sidebar avanzata + sezioni | Pro | |
| `home` | Home con KPI giornalieri | Pro | |
| `crm` | CRM clienti esteso | Pro | |
| `analytics` | Analytics e trend | Pro | |
| `servizio` | Gestione servizio e tavoli | Pro | |
| `walkIn` | Prenotazioni walk-in | Pro | |
| `noShow` | Segna no-show | Pro | |
| `tableAssignments` | Assegna prenotazione → tavolo | Pro | |
| `qrMenu` | Menu digitale pubblico via QR | Classic+QR / Pro | |

---

## Sezione 3 — Orari di apertura e fasce di servizio

| Campo | Versione | Chi | Dove va | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Giorni e orari di apertura | Classic | 🟩 | setting `business_hours` | — | |
| Fasce (es. Pranzo / Cena): nome, inizio, fine | Classic | 🟩 | fasce / `service_slots` | — | |
| Coperti massimi per fascia | Classic | 🟩 | setting `slot_guest_capacities` | — | |
| Accetta arrivi tardivi (per fascia) | Classic | 🟩 | (motore Servizio) | — | |

---

## Sezione 4 — Regole di prenotazione (numeri tecnici)

| Campo | Versione | Chi | Dove va (`restaurant_settings`) | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Finestra di prenotabilità (giorni avanti) | Classic | 🟦 | `booking_window_days` | 60 | |
| Durata base del tavolo | Classic | 🟦 | (motore Servizio / card) | 90/120/150/180 | |
| Durata sulle card (Tavolo / Degustazione / Evento) | Classic | 🟦 | card / preset | 120/150/180 | |
| Minimo durata di una fascia | Classic | 🟦 | (motore Servizio) | tecnico | |
| Intervallo di arrivo (ogni quanto si prenota) | Classic | 🟦 | (motore Servizio) | 30 min (15 a pranzo) | |
| Anticipo minimo per prenotare (cut-off) | Classic | 🟦 | (motore Servizio) | 60 min | |
| Tempo minimo per ordinare | Classic | 🟦 | (motore Servizio) | 45 min | |
| Buffer di riassetto tavolo (turnover) | Classic/Pro | 🟦 | (motore Servizio) | 0 Classic / 10 Pro | |
| Limite coperti per fascia: ON/OFF | Classic | 🟦 | `slot_limit_enabled` | false | |
| Rifiuta richieste fuori fascia | Classic | 🟦 | `booking_reject_out_of_slot` | false | |
| Raggruppa digest per fasce (solo Classic) | Classic | 🟦 | `booking_time_slots_enabled` | true | |

---

## Sezione 5 — Sala e tavoli (solo Pro)

| Campo | Versione | Chi | Dove va | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Sale (nome) | Pro | 🟩 | tabella `rooms` | — | |
| Tavoli (nome, capienza, posizione) | Pro | 🟩 | tabella `tables` | — | |
| Aree di posizionamento | Pro | 🟦 | `booking_placement_areas` | — | |
| Durata base prenotazione admin (minuti) | tutte | 🟦 | `restaurant_default_duration` | 90 | min 30, max 360; card/preset/tipologia hanno priorità |
| Ritardo / no-show (minuti) | Pro | 🟦 | (console sala) | 15–20 | |
| Limite coperti operativo con tavoli | Pro | 🟦 | (motore Servizio) | — | |

---

## Sezione 6 — Menu, card ed esperienze / Menu QR

| Campo | Versione | Chi | Dove va | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Card / esperienze (fisso vs componibile, prezzo, piatti) | Classic/+QR | 🟦 | card / preset | — | |
| Categorie menu | +QR/Pro | 🟦 | `menu_categories` | — | |
| Piatti (nome, descrizione, prezzo, disponibilità) | +QR/Pro | 🟦 | `menu_items` | — | |
| Preset menu | Classic | 🟦 | `booking_menu_promos` / preset | — | |
| Promo / banner menù | Classic | 🟩 | `booking_menu_promos` | — | |
| Codici QR (uno o più) | +QR/Pro | 🟦 | `menu_qr_codes` | — | |
| Preset staff visibili | Classic | 🟦 | `booking_staff_presets_visible` | — | |
| Preset staff personalizzati | Classic | 🟦 | `booking_custom_staff_presets` | — | |

---

## Sezione 7 — Aspetto pagina pubblica «Prenota»

| Campo | Versione | Chi | Dove va (`restaurant_settings`) | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Sfondo / foto pagina Prenota | Classic | 🟩 | `public_booking_page_background` | galleria | |
| Foto striscia (strip) | Classic | 🟩 | `public_booking_strip_photo` | — | |
| Testi pagina (titolo, descrizione) | Classic | 🟩 | `booking_public_form_config` | — | |
| Tema grafico area admin | Classic | 🟩 | `app_theme` | default | |

---

## Sezione 8 — Accessi / utenti admin

| Campo | Versione | Chi | Dove va | Default | Valore deciso |
|-------|----------|-----|---------|---------|---------------|
| Email admin del ristorante | tutte | 🟦 | `admin_users` / Supabase Auth | — | |
| Eventuali admin aggiuntivi | tutte | 🟦 | `admin_users` | — | |

---

## Promemoria d'uso (dopo l'intervista)

1. In Console crei l'azienda (Sez. 0) e l'utente admin associato (Sez. 8).
2. Apri la **scheda azienda** e imposti versione + funzioni (Sez. 2), dati (Sez. 1), regole (Sez. 4),
   e — se Pro — sala/tavoli (Sez. 5), menu/QR (Sez. 6).
3. Lasci al cliente (onboarding 🟩) ciò che è suo: orari/fasce, contatti, aspetto pagina.
4. Le sezioni non pertinenti alla versione venduta si **saltano**.

> Questo documento crescerà man mano che l'onboarding self-service copre più campi: quando una riga
> passa da 🟦 (la fai tu) a 🟩 (la fa il cliente), aggiorna anche
> `docs/Servizio-Config/INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`.
