# STATO BLINDATURA — Checklist a colpo d'occhio

> **A cosa serve.** Capire **in un colpo d'occhio** cosa è mappato e blindato e cosa no, su tutte e tre
> le pagine (Admin · Pagina Prenota · Menu QR). Per ogni area c'è una checklist di "cosa deve
> funzionare". Le **istruzioni passo-passo per verificare a mano in dev** vivono nelle guide semplici in
> `docs/_lavoro/Per matteo/Verifica Blindatura - <Area>/` (cartella privata).
>
> Fonte canonica dello stato: [`MASTERPLAN_BLINDATURA.md`](MASTERPLAN_BLINDATURA.md). Dettaglio per area:
> `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md`, `docs/Prenota-Skill/`, `docs/Menu-QR-Skill/`.
>
> Aggiornato: **2026-06-16**.
> Ultimo run E2E Codex: `npx playwright test --workers=1` → **58 passed, 16 skipped** su staging TEST.
> Addendum mirato Codex: `public-booking-smoke + public-menu-qr` → **12 passed**; `admin-calendar-blindatura` → **2 passed**.
> Gli skip sono prerequisiti non disponibili o suite legacy disattivate; le spunte sotto indicano solo
> i flussi davvero verificati da Playwright.

---

## 0. Legenda

- ✅ **blindato** = intervista + mappa + test + (controtest "rompi" se dovuto) + QA responsive + doc allineata.
- 🟡 **mappato non blindato** = codice c'è, ma manca test/QA o è un follow-up aperto.
- ⬜ **non mappato** = nessuna intervista/blindatura ancora.
- **TEST AUTOMATICO** = gira da solo (Vitest in mock, o Playwright E2E su staging). **VERIFICA MANUALE** = devi cliccare tu in dev/browser.

---

## 1. Quadro generale (tutte le aree)

| Area / Sezione | Stato | Test automatici | Cosa resta a mano |
|---|---|---|---|
| **Pagina Prenota** (pubblica) | ✅ blindato (M0, live in prod 10-06) | ~120 Vitest + 14 E2E | Carosello swipe resta visuale; sfondo/footer/EmptyState coperti da E2E |
| **Menu QR** (pubblica) | ✅ blindato | 47 Vitest + 3 E2E dedicati + 3 E2E indiretti | Asset reali restano visuali se tocchi la UI |
| **Admin — Shell/Navigazione** (M1) | ✅ blindato (10-06) | ~14 Vitest + 15 E2E | Smoke login/sidebar/guard; header fallback |
| **Admin — Prenotazioni operative** (M2) | ✅ blindato (11-06) | 35 Vitest + 7 E2E | No-show/archivio in dev; responsive 375 su tutti i modali |
| **Admin — Tab Calendario** (M2) | ✅ blindato + prod (11-06) | 43 Vitest + 2 E2E smoke | Gate tavolo Pro; guard overlay |
| **Admin — Impostazioni/Personalizza Form** (M4) | ✅ blindato (16-06) | 107 Vitest + 1 E2E smoke | Tema/carosello admin restano browser/visuali se tocchi la UI |
| **Admin — Menu/Magazzino** (M3) | ✅ blindato (11-06) | 27 Vitest + 4 E2E | Sync rename/delete; snapshot prenotazioni; HEIC |
| **Admin — Servizio** (Pro) | ⬜ non mappato | 3 Vitest + 1 E2E smoke | Tutto il prodotto: sale/tavoli/slot/walk-in/briefing |
| **Admin — CRM** (Pro) | ⬜ non mappato | 1 Vitest + 1 E2E smoke | Delete multi-step, email normalizzata, campagne |
| **Admin — Home/Analytics** (Pro) | ⬜ non mappato | 2 E2E smoke | KPI/finestra date da blindare a prodotto |
| **Cross-area prod-ready** (debiti M6) | 🟡 parziale | `m6ProdReadyPatterns` statico | Audit fallback email/guard Pro |

**In sintesi:** tutta la superficie **Classic in produzione** (Prenota + Menu QR + Admin Shell/Prenotazioni/
Calendario/Impostazioni/Menu) è ✅ blindata. Le aree **Pro** (Servizio/CRM/Home/Analytics) sono ⬜ fuori
da main, da intervistare a partire da zero (M5). Il **gap più rilevante da occhio umano** ora è solo
visuale: gesto swipe, icone/asset reali e UI admin di tema/carosello vanno ancora guardati in browser
quando li tocchi.

---

## 2. Admin — checklist "cosa deve funzionare"

### 2.1 Shell / Navigazione (M1) ✅
- [x] Senza login `/admin` → reindirizza a `/login`.
- [ ] Classic: nessuna sidebar, solo tab dashboard. *(Non spuntato in questo run: credenziali Classic dedicate non disponibili/valide.)*
- [x] Pro: sidebar Home/CRM/Servizio/Analytics visibile e navigabile.
- [x] Pro: refresh su `/admin/crm` resta in CRM; CRM → Servizio → Indietro torna a CRM.
- [ ] Modifiche non salvate + Logout → modale guard (Resta qui / Annulla e continua).
- [ ] Classic: refresh su `/admin/prenotazioni` → resta su Prenotazioni (non Calendario).
- [ ] Header senza nome ristorante → fallback "Sistema Gestionale Prenotazioni" (no blank/crash).

### 2.2 Prenotazioni operative (M2) ✅
- [x] `/admin/prenotazioni` mostra richieste in attesa o stato vuoto senza crash.
- [x] Accetta con capienza superata → avviso **non bloccante** → Procedi → accepted.
- [x] Accetta orario passato → avviso non bloccante → Procedi → accepted.
- [ ] Rifiuta con motivo → rejected. Elimina → soft-delete (recuperabile).
- [ ] Reinserisci / Riporta in attesa → **modale custom** (mai popup nativo del browser).
- [ ] No-show → sparisce dal calendario, resta in archivio.
- [x] 375px e 834px: bottoni dei modali Rifiuta/Elimina con testo lungo restano visibili/cliccabili.

### 2.3 Tab Calendario (M2) ✅
- [x] `/admin/calendario` apre la vista Calendario senza crash.
- [x] Mostra **solo prenotazioni accettate** nel digest E2E (no pending, no no-show).
- [x] Badge cella con limite giornaliero → percentuale visibile.
- [x] Badge cella senza limite giornaliero → solo conteggio coperti.
- [x] Oltre 100% → mostra valore reale (es. 108%), **non** blocca/cappa.
- [ ] **Niente drag&drop** per spostare data/ora.
- [ ] Scorciatoia "Assegna tavolo": assente in Classic, presente in Pro con slot.
- [x] Click giorno → `+ Nuova prenotazione` apre il form con data preimpostata.
- [x] Elimina da dettaglio apre conferma custom e bottoni responsive.

### 2.4 Impostazioni / Personalizza Form (M4) ✅
- [x] Impostazioni apre Anagrafica Azienda / Personalizza Form.
- [x] Nome locale **obbligatorio** al Salva: nome vuoto disabilita "Salva modifiche".
- [ ] Contatti opzionali (cap 45/65/30/120).
- [ ] `daily_guest_limit` 0/vuoto = nessun limite; se attivo blocca **solo** Prenota pubblica.
- [x] Orari tutti chiusi → sezione Orari **assente** su Prenota; overlap blocca il Salva admin.
- [ ] Tema admin **non** cambia Prenota né Menu QR.
- [x] Sfondo XOR: striscia **oppure** foto pagina intera, mai entrambe; niente → crema.
- [x] Footer "Salva modifiche" raggiungibile su 375px e 834px; guard dirty tema appare.
- [ ] Una sola modale "dati pubblici"; doppio click = una mutation.
- [x] Form non configurato → EmptyState su `/prenota` (niente form demo).

### 2.5 Menu / Magazzino (M3) ✅
- [ ] Limiti duri (solo nuovi inserimenti): 7 categorie / 12 prodotti / 6 preset / 6 QR.
- [x] Toggle disponibilità OFF → piatto/categoria sparisce da **Prenota e Menu QR**.
- [ ] Cancellare/cambiare un piatto **non** altera le prenotazioni già inviate (snapshot congelato).
- [ ] Delete categoria/ingrediente → **modale in-app** (mai popup nativo).
- [ ] Rename categoria con cambio slug → modale "Conferma e salva".
- [x] Menu/Magazzino responsive 375px/834px: toggle disponibilità e propagazione restano funzionanti.

---

## 3. Pagina Prenota — checklist "cosa deve funzionare" ✅
- [x] Slug inesistente/disattivato → "Prenotazioni temporaneamente non disponibili" (no crash).
- [x] Form non configurato → EmptyState con recapiti (no form demo).
- [x] Scelta tipologia è visibile/selezionabile e può mostrare la sezione menù.
- [ ] Cambio tipologia resetta menu/totali/intolleranze.
- [ ] Card scorrevoli **oppure** carosello (XOR), mai entrambi; card senza titolo non appare.
- [x] Piatto con disponibilità OFF → assente dal menù pubblico Prenota.
- [x] Submit invalido → alert/attenzione sul primo campo; email non valida → errore inline.
- [x] Privacy link apre `/privacy?from=/prenota/:slug` e torna indietro.
- [ ] Limite coperti pieno → "abbiamo raggiunto il numero massimo di coperti" (no salvataggio).
- [x] Sfondo striscia/foto-intera/crema corretti; footer orari assente se non configurati.
- [x] Submit/riepilogo raggiungibile a 375px, 834px e 1280px.
- [ ] Riepilogo: "Totale" (non "stimato").

---

## 4. Menu QR — checklist "cosa deve funzionare" ✅
- [x] `/menu/:slug/qr/:code` carica nome locale + carosello + categorie, senza login.
- [x] shortCode sbagliato → "Menù QR non trovato" (no redirect al default).
- [x] Categorie nell'ordine impostato in admin (frecce Su/Giù), non ordine magazzino.
- [x] Piatto/categoria con disponibilità OFF → assente anche nel QR.
- [ ] Cap testi con contatore (titolo card 30, desc 70, carosello…); nome QR max 80.
- [x] Icone categoria dai 20 preset (mai emoji); default insalata se non configurata.
- [ ] Limite 6 QR: pulsante "Nuovo QR" disabilitato a quota 6.
- [ ] **Ordine piatti per-QR (FU-MQR-2):** override testato in Vitest; verifica visuale solo se tocchi la UI frecce.
- [ ] **Import preset staff nel QR:** helper testato in Vitest; verifica visuale solo se tocchi il modale.
- [x] Browser back da categoria QR torna alla homepage QR senza crash.

---

## 5. Divergenze doc↔codice note

Trovate nella controverifica 16-06-26 e **risolte**: la documentazione viva ora riflette il codice.

1. **Prenota/Menu QR** — fallback E2E allineato agli slug TEST attuali (`da-tommaso`, `test-classic`, `test-pro`) anche se `.env.local.test` contiene uno slug obsoleto.
2. **Prenota** — mappa limiti testo allineata al cap nome locale **45**.
3. **Menu QR** — flag `qrMenu` documentato su `buildFeatures(edition, featureOverrides)` +
   `tenant_features`.
4. **Menu QR** — INC-02 marcato come scelta voluta: il nome QR è interno e non si mostra al cliente.
5. **Admin Shell** — rimosso il debito `settings` latente: Impostazioni resta tab dashboard
   `/admin/impostazioni`, non voce sidebar.

---

## 6. Promemoria comandi

```bash
npm run validate        # gate quotidiano: TUTTI i Vitest in mock devono essere verdi (739/739 al 16-06)
npm run dev             # app in locale su :5173 per la verifica manuale
npx playwright test e2e/<spec>.spec.ts --workers=1   # E2E su staging TEST (serve .env.local.test)
npx playwright test e2e/public-menu-qr.spec.ts --workers=1
npx playwright test e2e/public-booking.spec.ts e2e/public-booking-smoke.spec.ts --workers=1
npx playwright test e2e/admin-calendar-blindatura.spec.ts e2e/admin-settings-blindatura.spec.ts --workers=1
npx playwright test --workers=1   # run E2E completo: 58 passed / 16 skipped al 16-06-26
```

Comandi mirati per area e cosa devono mostrare: vedi le guide in
`docs/_lavoro/Per matteo/Verifica Blindatura - <Area>/`.
