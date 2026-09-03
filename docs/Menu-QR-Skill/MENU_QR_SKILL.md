---
name: menu-qr
description: >-
  Skill di area del Menu Digitale Pubblico via QR (/menu/:slug/qr/:shortCode).
  Caricalo quando lavori su pagine pubbliche menu, form crea/modifica QR
  (MenuQrModal), cappature/messaggi requisiti del form, o flag qrMenu.
---

# MENU QR — Skill di area (entry point)

> **Cos'è questo file.** Il punto di ingresso dell'area **Menu Digitale Pubblico via QR**.
> Tiene il **senso** (a che serve, chi fa cosa, cosa è voluto e non va toccato) e la **mappa**
> verso i file di dettaglio in `contesto/`. NON ripete numeri e dettagli tecnici: quelli vivono nei
> file di contesto e, per i valori, nel codice. Un agente legge **questo file intero** prima di
> toccare l'area, poi apre **solo** il file di dettaglio che gli serve — e lo legge intero anche lui.

> **Trigger di routing:** «Menu QR» · «Impostazione Menù QR» · «/menu/:slug/qr/:shortCode» ·
> «PublicMenuPage» · «MenuQrModal» · «carosello specialità QR» · «categorie visibili QR» ·
> «ingredienti nascosti QR» · «tema homepage menu» · «feature qrMenu».

---

## 1. A che serve il Menu QR (il senso)

È il **menù digitale** che il cliente apre **scansionando un QR code al tavolo** (o aprendo il link).
Sostituisce il menù di carta: una pagina mobile-first con le **categorie di piatti** e un **carosello
di foto** in cima.

Ha **due funzioni in una**, come Prenota ma a parti invertite:

1. **Vetrina/consultazione** — il cliente sfoglia il menù, niente prenotazione né carrello: **solo
   consultazione**. Deve sembrare parte del **brand del locale** (tema, foto, nomi su misura), non un
   listino generico.
2. **Personalizzazione per-QR** — il ristoratore crea **uno o più QR**, ognuno con il suo aspetto:
   tema, carosello, quali categorie mostrare e in che ordine, titoli/descrizioni/icone su misura,
   ingredienti da nascondere.

## 2. Chi fa cosa (attori)

Due attori, mondi separati:

- **Mario (ristoratore)** — da **admin → Menu → QR Code** crea/modifica i QR nel modale
  **«Impostazione Menù QR»** (`MenuQrModal`). Decide aspetto e contenuto. Ogni QR ha un **link
  pubblico** (con `:shortCode`) che lui stampa/incolla al tavolo. **Non consulta** il menù come fa il
  cliente — usa il link in anteprima per controllare com'è venuto.
- **Anna (cliente)** — scansiona il QR → apre `/menu/:slug/qr/:shortCode` sul **suo telefono** →
  sfoglia categorie e piatti. **Non vede mai** l'admin, non lascia dati, non prenota.

Il menù dei piatti (categorie + ingredienti) **non è esclusivo del QR**: è il **magazzino condiviso**
(`menu_categories`/`menu_items`), lo stesso che alimenta anche la **Pagina Prenota**. Il QR ne sceglie
una **vista** (quali categorie, in che ordine, con quali nomi/foto) **senza modificare il magazzino**.

---

## 2-bis. Perché QR MULTIPLI (decisione di Matteo)

Un locale può creare **più QR diversi**, ognuno con aspetto e categorie proprie. È **flessibilità
voluta**, senza un unico caso d'uso imposto: il ristoratore decide lui come usarli — es. un QR
«menù estivo» e uno «menù invernale», oppure un QR «terrazza» con meno categorie, oppure un QR
«evento X» dove personalizza il carosello con le foto dell'evento e dà al QR il nome dell'evento.

**Conseguenza per un agente:** il «nome dell'evento» o lo scopo del QR vivono nel **carosello + nome
QR**, non in un «tipo di menù» strutturato. Il `content_type` strutturato è stato **rimosso** (§3-bis).

---

## 2-ter. Il flusso completo (percorso cliente + flusso dati affiancati)

> Mappa «cosa succede dall'inizio alla fine». A sinistra il **percorso di Anna**, a destra **dove
> vanno i dati**. Serve a capire dove si inserisce una modifica e cosa NON rompere a valle.

**Prima — Mario configura (in admin, nel modale `MenuQrModal`):**
1. Apre **Menu → QR Code** (visibile solo se feature `qrMenu` attiva), crea/modifica un QR.
2. Mette **Nome QR** (etichetta sua, interna), sceglie **categorie visibili** + ordine, carica il
   **carosello**, scrive **titoli/descrizioni/icone** per categoria, sceglie il **tema**, eventualmente
   **nasconde ingredienti**. → tutto su `menu_qr_codes` (+ `menu_qrcode_categories` per i titoli).
3. Salva: il pulsante resta cliccabile anche se manca un requisito; al click mostra il primo errore
   da correggere (§4). Quando i dati sono validi ottiene il **link pubblico** con lo `shortCode` da
   stampare al tavolo.

**Poi — Anna consulta (su `/menu/:slug/qr/:shortCode`):**

| Passo di Anna (user journey) | Cosa fa il sistema ai dati (data flow) |
|---|---|
| Scansiona il QR → apre il link col `:slug` + `:shortCode` | `TenantContext` risolve lo `slug` → `tenantId`; lookup parte **solo** quando lo slug dell'URL combacia col tenant (`tenantReady`, evita tenant stale da sessione admin) |
| Vede nome locale + **carosello foto** in cima | client **pubblico anonimo** (`supabasePublic`, niente sessione) carica il QR via `usePublicMenuQr(shortCode)`; nome da `useRestaurantName` |
| Vede la **griglia categorie** (con foto o icona) | `category_filter` decide quali e in che ordine; titoli/icone da `menu_qrcode_categories`, fallback `menu_categories` |
| Tocca una categoria → **lista piatti** | `PublicMenuCategoryPage` carica `menu_items`, esclude gli `hidden_menu_item_ids` del QR; in basso una **barra pill categorie** (stesso insieme del QR) per cambiare pagina senza tornare in home |
| (nessun invio, nessun carrello) | la consultazione **non scrive nulla** sul DB |

**Tre confini da non confondere** (un agente che li mescola rompe il flusso):
- **Magazzino** (tab Menu: ingredienti/categorie) ≠ **vista QR** (cosa mostra QUEL QR) ≠ **pagina
  pubblica** (cosa vede Anna).
- **Client pubblico anonimo** (`supabasePublic`, no sessione) ≠ client admin autenticato. Le pagine
  `/menu/*` usano **solo** `supabasePublic`.
- **Foto categoria del QR** (`category_images`, per-QR) ≠ **foto categoria di Prenota**
  (`menu_categories.image_url`). Sono due cose diverse: il QR **non** scrive mai su `menu_categories`.

---

## 3. Limiti e regole VOLUTE — NON «aggiustarle»

> Scelte di Matteo, non bug né dimenticanze. Un agente che pensa di «migliorarle» **prima chiede**.

- **Il nome del QR è INTERNO — voluto invisibile al cliente.** Il `name` del QR (es. «menù estivo»)
  serve a Mario per distinguere i suoi QR; **non** va mostrato ad Anna da nessuna parte. Non «manca il
  titolo nella pagina pubblica»: è voluto così.
- **Cappature carosello = anti-rottura mobile.** Etichetta/titolo/descrizione slide hanno limiti
  (40/60/125) per **non sfasciare il layout su mobile**: la card regge poco testo. Non sono arbitrari.
  Mappa completa e numeri ↔ codice: `contesto/MENU_QR_TEXT_LIMITS_MAP.md`.
- **Carosello obbligatorio, testi della slide FACOLTATIVI.** Un QR non si salva senza almeno una
  **foto** nel carosello. Etichetta, titolo e descrizione della slide sono invece **facoltativi**
  (deciso 03-09-26, sostituisce la regola del 30-05-26 «foto + etichetta + titolo»): una slide con la
  sola foto è valida e il pubblico salta semplicemente i campi vuoti. Non reintrodurre il requisito
  «etichetta e titolo compilati». Vedi §4.
- **Categorie: serve ≥1 categoria con ≥1 ingrediente visibile.** Un QR vuoto non avrebbe senso da
  consultare. Vedi §4.
- **Solo categorie con ingredienti sono selezionabili.** Nel modale le categorie senza ingredienti
  sono disabilitate («nessun ingrediente»). Voluto: evita card che portano a una lista vuota.
- **`category_filter`: `null` = legacy «tutte», `[]` = nessuna, `[keys]` = quelle e in quell'ordine.**
  L'ordine dell'array È l'ordine di visualizzazione (frecce Su/Giù sulle card, non sui checkbox).
  Non «normalizzare» `null` in tutte le categorie nei nuovi salvataggi: i nuovi save usano sempre
  array esplicito. Dettaglio: `contesto/MENU_QR_DATA_FLOW_CONTEXT.md` §4.
- **Pagine `/menu/*` → solo `supabasePublic`.** Mai client admin autenticato. È un invariante di
  sicurezza (Anna è anonima).
- **`tenantReady` prima del lookup QR.** Non leggere il QR finché lo slug dell'URL non combacia col
  tenant del context: evita di mostrare i dati del locale sbagliato quando Mario era loggato altrove.
- **`shortCode` non trovato → messaggio «Menù QR non trovato», NESSUN redirect** al QR di default.
  Non «mostrare comunque il primo QR».
- **`/menu/:slug` senza shortCode → usa il QR di default** (primo `is_active`, `sort_order ASC`).
- **Mai emoji nelle card/tab.** Le categorie senza foto usano un'**icona** (20 preset Phosphor/Lucide),
  mai emoji. Default senza foto e senza mapping: `lucide_salad` (FU-023).
- **Nessun dato inventato nel pubblico.** Nome locale, categorie, piatti arrivano da dati salvati dal
  tenant. Niente fallback hardcoded (no «Al Ritrovo», no menù built-in).
- **Eyebrow slide vuota → niente, NON «Specialità della casa».** Se Mario non compila l'etichetta di
  una slide, il pubblico non mostra nulla al suo posto (`eyebrow ? … : null`). «Specialità della casa»
  esiste solo come **testo-esempio nel placeholder admin**, non è un fallback mostrato. Deciso 06-06-26.
- **Nome locale assente → ripiego letterale «Menu».** Se mancano sia `restaurant_name` sia
  `organizations_public.name`, l'intestazione mostra la parola neutra «Menu» (`PublicMenuPage`). Voluto:
  neutro, mai un nome inventato. Deciso 06-06-26.
- **Niente footer data/ora.** La barra bianca con data e ora (`MenuFooterCard`) è **rimossa** da tutte le pagine pubbliche Menu QR. Non reintrodurla e non lasciare `mt-auto` / buco vuoto al suo posto. (Sovrascrive la scelta del 06-06-26.)
- **Pill categorie: solo in pagina categoria, barra fissa in basso.** Sulla homepage il cliente entra in una categoria **solo** toccando le card. Sulla pagina categoria (`…/c/:categoryKey`) le pill restano visibili in basso mentre si scorre (padding-bottom sul main = altezza barra + `env(safe-area-inset-bottom)`). Categoria corrente evidenziata; click → altra categoria dello stesso QR. Niente pill «Home».
- **Titolo card categoria: line-clamp difensivo a 2 righe.** I due `<h2>` titolo (card con/senza foto)
  hanno `line-clamp-2` per non sfondare la card su mobile quando il titolo ricade sul nome categoria di
  magazzino (`menu_categories.label`, che **non** ha cap). Il cap 30 dell'override QR copre il caso
  configurato; il line-clamp copre il fallback. Aggiunto in blindatura 06-06-26 (controtest responsive).

---

## 3-bis. Preset/menù-evento via QR — RIMOSSO

> **Divieto:** NON reintrodurre `content_type`/`preset_ids` né i menù-evento dentro il QR (route
> `…/preset/:presetId`, `PublicMenuPresetPage`, rami `showPresets`). Colonne DB droppate (migr. `043`).
> Il caso «evento» si copre con **carosello + nome QR**. Dettaglio storico: [Report blindatura Menu QR 06-06-26](../Sessioni%20di%20lavoro/06-06-26/REPORT_BLINDATURA_06-06-26.md).

> ⚠️ **Da non confondere:** il preset di **Pagina Prenota** (`CustomStaffPreset`,
> `booking_custom_staff_presets`, `bookingFormResolver`) è **vivo e legittimo** — la rimozione ha
> toccato SOLO l'uso *dentro il QR*.

---

## 4. La parte VIVA — form crea/modifica QR (cappature + messaggi requisiti)

> Questa è la zona che Matteo tocca di più (modifiche al form, cappatura caselle, messaggini che
> dicono al ristoratore cosa compilare). File: `MenuQrModal.tsx` + `MenuHomepageConfigPanel.tsx`
> (sezioni) + `menuQrValidation.ts` (regole). Layout di dettaglio: `contesto/MENU_QR_LAYOUT_CONTEXT.md`.

**Campi del modale «Impostazione Menù QR»:** Nome QR (obbligatorio) · Categorie visibili (checkbox +
ordine) · Carosello specialità · Titoli/descrizioni/icone categorie · Tema homepage.

**Cappature attuali (i numeri vivono nel codice — vedi `contesto/MENU_QR_TEXT_LIMITS_MAP.md`):**
- Nome QR: **80** · Carosello: etichetta **40**, titolo **60**, descrizione **125** · Card categoria:
  titolo **30**, descrizione **70** — tutti con contatore `AdminFieldWithCharCount` (FU-MQR-1 chiuso 06-06-26).

**Messaggi-requisito al Salva** (in quest'ordine di priorità):
1. «Dai un nome al menù QR per salvarlo.» (`MenuQrModal`)
2. «Seleziona almeno una categoria di prodotti visibili nel menù QR.»
3. «Almeno una categoria selezionata deve avere almeno un ingrediente visibile per il cliente.»
4. «Il carosello è obbligatorio: aggiungi almeno una foto.» — **solo la foto**: dal 03-09-26 non
   esiste più il requisito su etichetta/titolo della slide (né il messaggio «slide incompleta»).

Il pulsante **Salva** resta cliccabile durante la compilazione ed è disabilitato solo mentre il
salvataggio è in corso. Al click, un toast mostra il primo requisito mancante; nessun errore resta
silenzioso. (Preferenza utente: `Modal` per successo/conferme; toast solo per la validazione.)

---

## 5. Stato funzioni e divieti correlati

> Stato attuale + divieti. La **cronologia** delle decisioni (chi/quando/perché) vive nei report di
> `Sessioni di lavoro/` e in `docs/FOLLOW_UP.md` — qui solo ciò che un agente deve sapere oggi.

- **Ordine piatti per-QR** (`item_sort_overrides` su `menu_qr_codes`): frecce Su/Giù in
  `MenuQrHiddenItemsPicker` («Visibilità e ordine ingredienti»). Lettura pubblica
  `applyQrItemSortOverride` (`menuQrAppearance.ts`); `null` = ordine default magazzino + foto-prima.
- **Import preset staff nel modal QR** («Importa da preset»): precompila `categoryFilter` dalle categorie del preset; gli ingredienti di quelle categorie partono **tutti visibili** (`hiddenItemIds` vuoto). Il ristoratore può nascondere a mano. Carosello escluso; preset **read-only** (vivono nel loro tab). Nessuna colonna DB nuova. Non riscrive i QR già salvati.
- **`PublicMenuCategoryPage`** applica override titolo (`menu_qrcode_categories`) + hero foto
  (`qr.category_images[categoryKey]`); `hidden_menu_item_ids`/`theme_key` già applicati.
- **Titoli/descrizioni categoria per-QR cappati** (30/70, `AdminFieldWithCharCount`) — vedi §4 +
  `contesto/MENU_QR_TEXT_LIMITS_MAP.md`.
- **Divieto:** codice morto preset QR rimosso — non reintrodurlo (§3-bis).

Cronologia chiusure FU (FU-019/MQR-1/MQR-2/MQR-3, import preset): [Report Ciclo 3 13-06-26](../Sessioni%20di%20lavoro/13-06-26/Report-Ciclo3-Menu-QR-Pack-13-06-26.md) · `docs/FOLLOW_UP.md`.

---

## 6. Mappa: tocchi X → apri il file Y

| Se il task tocca… | Apri (e leggi intero) |
|---|---|
| Layout pubblico (homepage/categoria), griglia categorie, carosello, pill categoria in basso, temi, icone | `contesto/MENU_QR_LAYOUT_CONTEXT.md` |
| Flusso dati admin ↔ pubblico, `category_filter`, `category_images`, `hidden_menu_item_ids`, rename/delete chiave categoria, hook pubblici/admin | `contesto/MENU_QR_DATA_FLOW_CONTEXT.md` **(OBBLIGATORIO prima di modificare dati)** |
| Cappature/limiti testo (carosello, nome QR, titoli categoria), contatori, dove aggiungere un cap | `contesto/MENU_QR_TEXT_LIMITS_MAP.md` (numeri ↔ codice) |
| Form crea/modifica QR, validazione/messaggi-requisito, salvataggio modale | §4 qui sopra + `MenuQrModal.tsx`, `menuQrValidation.ts` |
| Test dell'area (cosa è blindato, dove aggiungere) | `contesto/MENU_QR_TEST_SUITE_INDEX.md` |
| **Dettaglio tecnico** (migrazioni DB, path storage foto, short code, hook admin/pubblici, le ~40 RULE operative) | `contesto/MENU_QR_REFERENCE.md` |
| Magazzino menu admin (ingredienti, categorie, foto Prenota) — **altra area** | `../Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| Pagina Prenota (vetrina prenotazioni, stesso magazzino) — **altra area** | `../Prenota-Skill/PRENOTA_SKILL.md` |

---

## 7. Principio di lettura (vale per tutta l'area)

**Pochi file, ma letti INTERI.** Quando apri un file di `contesto/` o un pezzo di codice, leggilo per
intero (non solo lo spezzone che sembra rilevante) — tranne micro-fix evidenti. Il **valore numerico**
è sempre nel codice (`menuQrValidation.ts`, costanti `CAROUSEL_SLIDE_*` in `MenuHomepageConfigPanel.tsx`);
i file `.md` lo **specchiano e spiegano il perché**, non lo sostituiscono.
