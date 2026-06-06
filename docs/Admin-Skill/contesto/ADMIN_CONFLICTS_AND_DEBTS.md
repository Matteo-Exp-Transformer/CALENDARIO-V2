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
