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
| **Pagina Prenota** (pubblica) | ✅ blindato (M0, live in prod 10-06) | ~120 Vitest + 5 E2E | Flusso visivo completo, sfondo/striscia, footer orari, carosello swipe |
| **Menu QR** (pubblica) | ✅ blindato (FU-MQR-2 aperto) | 41 Vitest + 3 E2E (indiretti) | **Flusso cliente pubblico intero** (gap E2E), carosello/temi, ordine piatti per-QR |
| **Admin — Shell/Navigazione** (M1) | ✅ blindato (10-06) | ~14 Vitest + 15 E2E | Smoke login/sidebar/guard; header fallback |
| **Admin — Prenotazioni operative** (M2) | ✅ blindato (11-06) | 35 Vitest + 7 E2E | No-show/archivio in dev; responsive 375 su tutti i modali |
| **Admin — Tab Calendario** (M2) | ✅ blindato + prod (11-06) | 43 Vitest + 0 E2E | Badge % su 375/834/1280; gate tavolo Classic/Pro; guard overlay |
| **Admin — Impostazioni/Personalizza Form** (M4) | ✅ blindato (16-06) | 107 Vitest + 0 E2E stabile | QA 375/834 fasce; sfondo/tema/carosello in browser |
| **Admin — Menu/Magazzino** (M3) | ✅ blindato (11-06) | 27 Vitest + 4 E2E | Sync rename/delete; snapshot prenotazioni; HEIC |
| **Admin — Servizio** (Pro) | ⬜ non mappato | 3 (solo guard modale sala) | Tutto: sale/tavoli/slot/walk-in/briefing |
| **Admin — CRM** (Pro) | ⬜ non mappato | 1 + 1 E2E candidato | Tutto: delete multi-step, email normalizzata |
| **Admin — Home/Analytics** (Pro) | ⬜ non mappato | 0 (+1 E2E candidato) | Tutto: KPI, finestre data |
| **Cross-area prod-ready** (debiti M6) | 🟡 parziale | `m6ProdReadyPatterns` statico | Audit fallback email/guard Pro |

**In sintesi:** tutta la superficie **Classic in produzione** (Prenota + Menu QR + Admin Shell/Prenotazioni/
Calendario/Impostazioni/Menu) è ✅ blindata. Le aree **Pro** (Servizio/CRM/Home/Analytics) sono ⬜ fuori
da main, da intervistare a partire da zero (M5). Il **gap più rilevante da occhio umano**: nessun E2E
copre il **flusso cliente pubblico del Menu QR** — va guardato a mano (vedi guida Menu QR).

---

## 2. Admin — checklist "cosa deve funzionare"

### 2.1 Shell / Navigazione (M1) ✅
- [ ] Senza login `/admin` → reindirizza a `/login`.
- [ ] Classic: nessuna sidebar, solo tab dashboard. Pro: sidebar Home/CRM/Servizio/Analytics.
- [ ] Modifiche non salvate + Logout → modale guard (Resta qui / Annulla e continua).
- [ ] Refresh su `/admin/prenotazioni` → resta su Prenotazioni (non Calendario).
- [ ] Header senza nome ristorante → fallback "Sistema Gestionale Prenotazioni" (no blank/crash).

### 2.2 Prenotazioni operative (M2) ✅
- [ ] Accetta con capienza superata → avviso **non bloccante** → Procedi → accepted.
- [ ] Accetta orario passato → avviso non bloccante → Procedi → accepted.
- [ ] Rifiuta con motivo → rejected. Elimina → soft-delete (recuperabile).
- [ ] Reinserisci / Riporta in attesa → **modale custom** (mai popup nativo del browser).
- [ ] No-show → sparisce dal calendario, resta in archivio.
- [ ] 375px: bottoni dei modali con testo lungo restano visibili/cliccabili.

### 2.3 Tab Calendario (M2) ✅
- [ ] Mostra **solo prenotazioni accettate** (no pending, no no-show).
- [ ] Badge cella: con limite giornaliero → `NN%`; senza limite → solo conteggio coperti.
- [ ] Oltre 100% → mostra valore reale (es. 108%), **non** blocca/cappa.
- [ ] **Niente drag&drop** per spostare data/ora.
- [ ] Scorciatoia "Assegna tavolo": assente in Classic, presente in Pro con slot.
- [ ] Rifiuta/Cancella **solo** dentro la modale dettaglio, con conferma.

### 2.4 Impostazioni / Personalizza Form (M4) ✅
- [ ] Nome locale **obbligatorio** al Salva; contatti opzionali (cap 45/65/30/120).
- [ ] `daily_guest_limit` 0/vuoto = nessun limite; se attivo blocca **solo** Prenota pubblica.
- [ ] Orari tutti chiusi → sezione Orari **assente** su Prenota; overlap blocca il Salva admin.
- [ ] Tema admin **non** cambia Prenota né Menu QR.
- [ ] Sfondo XOR: striscia **oppure** foto pagina intera, mai entrambe; niente → crema.
- [ ] Un solo footer "Salva modifiche" + una sola modale "dati pubblici"; doppio click = una mutation.
- [ ] Form non configurato → EmptyState su `/prenota` (niente form demo).

### 2.5 Menu / Magazzino (M3) ✅
- [ ] Limiti duri (solo nuovi inserimenti): 7 categorie / 12 prodotti / 6 preset / 6 QR.
- [ ] Toggle disponibilità OFF → piatto/categoria sparisce da **Prenota e Menu QR**.
- [ ] Cancellare/cambiare un piatto **non** altera le prenotazioni già inviate (snapshot congelato).
- [ ] Delete categoria/ingrediente → **modale in-app** (mai popup nativo).
- [ ] Rename categoria con cambio slug → modale "Conferma e salva".

---

## 3. Pagina Prenota — checklist "cosa deve funzionare" ✅
- [ ] Slug inesistente/disattivato → "Prenotazioni temporaneamente non disponibili" (no crash).
- [ ] Form non configurato → EmptyState con recapiti (no form demo).
- [ ] Scelta tipologia sblocca il form; cambio tipologia resetta menu/totali/intolleranze.
- [ ] Card scorrevoli **oppure** carosello (XOR), mai entrambi; card senza titolo non appare.
- [ ] Piatti con disponibilità OFF / categoria nascosta → assenti dal menù pubblico.
- [ ] Validazione: nome/email/telefono/privacy; submit invalido → **lampeggio arancione** sul campo (no popup).
- [ ] Privacy link apre `/privacy?from=/prenota/:slug` e torna indietro.
- [ ] Limite coperti pieno → "abbiamo raggiunto il numero massimo di coperti" (no salvataggio).
- [ ] Sfondo striscia/foto-intera/crema corretti; footer orari assente se non configurati.
- [ ] Riepilogo: laterale ≥1256px, sotto il form su mobile; "Totale" (non "stimato").

---

## 4. Menu QR — checklist "cosa deve funzionare" ✅ (+ 🟡 ordine piatti)
- [ ] `/menu/:slug/qr/:code` carica nome locale + carosello + categorie, senza login.
- [ ] shortCode sbagliato → "Menù QR non trovato" (no redirect al default).
- [ ] Categorie nell'ordine impostato in admin (frecce Su/Giù), non ordine magazzino.
- [ ] Piatto/categoria con disponibilità OFF → assente anche nel QR.
- [ ] Cap testi con contatore (titolo card 30, desc 70, carosello…); nome QR max 80.
- [ ] Icone categoria dai 20 preset (mai emoji); default insalata se non configurata.
- [ ] Limite 6 QR: pulsante "Nuovo QR" disabilitato a quota 6.
- [ ] 🟡 **Ordine piatti per-QR (FU-MQR-2):** implementato ma **senza test** — verificare a mano.
- [ ] 🟡 **Import preset staff nel QR:** implementato ma **senza test** — verificare a mano.

---

## 5. Divergenze doc↔codice note

Trovate nella controverifica 16-06-26 e **risolte**: la documentazione viva ora riflette il codice.

1. **Prenota** — fallback E2E allineato a `E2E_TENANT_SLUG=test`.
2. **Prenota** — mappa limiti testo allineata al cap nome locale **45**.
3. **Menu QR** — flag `qrMenu` documentato su `buildFeatures(edition, featureOverrides)` +
   `tenant_features`.
4. **Menu QR** — INC-02 marcato come scelta voluta: il nome QR è interno e non si mostra al cliente.
5. **Admin Shell** — rimosso il debito `settings` latente: Impostazioni resta tab dashboard
   `/admin/impostazioni`, non voce sidebar.

---

## 6. Promemoria comandi

```bash
npm run validate        # gate quotidiano: TUTTI i Vitest in mock devono essere verdi (733/733 al 16-06)
npm run dev             # app in locale su :5173 per la verifica manuale
npx playwright test e2e/<spec>.spec.ts --workers=1   # E2E su staging TEST (serve .env.local.test)
```

Comandi mirati per area e cosa devono mostrare: vedi le guide in
`docs/_lavoro/Per matteo/Verifica Blindatura - <Area>/`.
