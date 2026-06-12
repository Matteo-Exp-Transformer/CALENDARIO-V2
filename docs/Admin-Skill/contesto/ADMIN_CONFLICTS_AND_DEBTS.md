# ADMIN — Conflicts, Hardcoded e Debiti

> Inventario iniziale da ricognizione read-only. Non e una lista di fix approvati: serve a decidere
> con Matteo cosa e voluto, cosa e debito e cosa va testato.
> Per decidere ordine e criteri di chiusura usare `../PLAN_BLINDATURA_ADMIN.md`.

## 1. Elementi da chiarire con Matteo

| Area | Elemento | Stato |
|---|---|---|
| Shell | Logout passa da unsaved guard | deciso/fix Area 1 |
| Shell | `features.home` governa Home iniziale anche se sidebar attiva | deciso/fix Area 1 |
| Shell | action `settings` latente in sidebar | **RIMOSSO 06-06-26** — codice morto; Impostazioni resta solo tab dashboard |
| Shell | doppio `useAdminAuth` (ProtectedRoute + shell) | **CHIUSO 06-06-26** — `AdminAuthProvider` unico |
| Header admin | fallback neutro `Sistema Gestionale Prenotazioni` se manca nome ristorante | deciso/fix Area 1 |
| Ruoli | admin/staff senza permessi distinti nel codice | voluto per ora |
| Settings | quali sezioni staff puo modificare | senso da intervistare |

## 2. Codice residuo / non cablato

- ~~`runSidebarAction({ type: 'settings' })`~~ rimosso 06-06-26 (nessuna voce sidebar; tab Impostazioni solo da dashboard).
- `AcceptBookingModal` è usato da `AdminBookingForm` (nuova prenotazione admin); il flusso pending accetta dalla card senza modale.
- `useShiftBriefing` ha TODO su join tavoli/sale: briefing oggi non mostra sala/tavolo.
- M6 12-06-26: nessun `window.confirm` residuo nei file app vivi; i popup nativi rimossi sono coperti
  da test statico `m6ProdReadyPatterns`. Restano da auditare comportamenti Pro/CRM/Servizio, non la
  presenza del popup nativo.

## 3. Rischi data flow

- CRM collega clienti e prenotazioni via email normalizzata, non FK.
- CRM update/delete sono multi-step client-side.
- Rename/delete categoria menu sincronizzano piu risorse senza transazione unica.
- Service slot override: possibili riferimenti legacy `override_date` in function rispetto a
  schema moderno `date_from/date_to`.
- Walk-in busy check confronta `placement` con table id, ma alcune scritture salvano nome tavolo.
- Analytics query per `created_at` ma calcolo KPI su data evento.

## 4. Mock/hardcoded/fallback

Da distinguere:

- **Test data nei test**: nomi tipo `Mario Rossi` nei test sono normali.
- **Placeholder admin**: "Es. Rossi", "Nome del locale" sono hint UI, non dati veri.
- **Stati vuoti**: "Nessuna richiesta", "Nessuna sala configurata", "Menu in preparazione" sono
  messaggi di sistema.
- **Fallback prodotto deciso**: `Sistema Gestionale Prenotazioni` nell'header admin se manca il nome
  ristorante.
- **Audit globale fallback**: resta aperto in `FU-ALL-FALLBACK` (email, hook Supabase, guard Servizio);
  M6 12-06-26 (4° giro) ha chiuso form config default sul pubblico (`parseFromDb` → `null` + EmptyState).

## 5. Elementi mostrati ma non configurabili

- Footer quick-nav admin e tema shell sono di sistema.
- Footer data/ora QR e gia deciso in Menu QR, fuori scope admin.
- Briefing stampa/PDF e di sistema.
- Analytics KPI non configurabili.

## 6. Elementi configurati ma non mostrati / parziali

- `app_theme` e solo admin, non Prenota/QR.
- `features.home` blocca Home anche se sidebar attiva.
- `tableAssignments` flag esiste ma `AssignmentMapPanel` non ha controllo diretto nella pagina.

## 7. Priorita futura test/blindatura

0. Shell/ingresso/navigazione globale: **E2E reali obbligatori per ✅ PROD Area 1** (decisione Matteo
   06-06-26); controtest attivo su responsive/logiche conflittuali. Unit `shell-*` verdi + E2E staging.
1. Accetta/rifiuta/cancella/ripristina prenotazione — **test `@admin-blindatura: prenotazioni` avviati**.
2. Nuova prenotazione admin e conflitti capienza/fasce.
3. Walk-in + tavolo occupato.
4. Rename/delete categoria menu.
5. CRM delete/update con booking collegate.
6. Service slots e override.
7. Unsaved guard su tab/sezioni/logout.
8. Analytics date window.

## 8. M6 — stato 12-06-26

- **Auth residuo chiuso:** se una sessione Supabase esiste ma la riga `admin_users` non esiste più,
  `AdminAuthContext` esegue `signOut`, pulisce tenant su route admin e non ripristina l'utente.
- **Type safety parziale:** ripuliti da `as any` i flussi auth/tenant/booking e `menuQrStorage`; restano
  cast su hook Supabase (`.from() as any`) da affrontare per area.
- **Fallback prod (3° giro):** `getDefaultBusinessHours()` non inietta più fasce demo; Pagina Prenota
  senza `public_booking_page_background` mostra crema neutra, non foto stock `full-01`.
- **Conferme custom:** delete ingrediente, delete menù preselezionato, delete promo e reset
  Card/Carosello usano `Modal` in-app. Il pattern è bloccato da test statico anti-regressione.
- **Ancora aperto:** email transazionali, logging edge/scripts, audit fallback form config, guard dirty
  su Servizio/altri modali Pro (CRM + Categorie Menu + nuova prenotazione coperti in 2° giro M6).
