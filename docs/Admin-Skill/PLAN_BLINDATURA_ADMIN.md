# PLAN — Mappatura e blindatura completa Admin

> **Cos'e questo file.** Il piano operativo vivo per portare l'area **Admin autenticata** (`/admin`)
> da mappata a livello documentale a **blindata di prodotto**. Lo usa un orchestratore senior per
> dirigere interviste, sub-agent, test e aggiornamenti dello skill system. Ogni agente che lavora su
> Admin deve partire da `ADMIN_SKILL.md`, poi aprire questo piano se il task riguarda mappatura,
> blindatura, test di area o lavoro multi-dominio.

> **Definizione di blindata per Admin.** Admin e blindata solo quando: (1) la doc guida un sub-agent
> terzo tramite `AGENTS.md` -> `APP_CONTEXT_SKILL.md` -> `ADMIN_SKILL.md` -> `contesto/*`; (2) i flussi
> di prodotto sono puliti e testati su dati reali di TEST; (3) non restano mock/hardcoded che fingono
> dati veri, codice morto o elementi mostrati/configurati senza senso; (4) i flussi critici sono
> coperti da test marcati `@admin-blindatura`.

---

## 0. Prima di iniziare

1. Lavora su `env/test`.
2. Leggi per intero:
   - `docs/Admin-Skill/ADMIN_SKILL.md`;
   - il context dell'area scelta in `docs/Admin-Skill/contesto/`;
   - `docs/Admin-Skill/contesto/ADMIN_CONFLICTS_AND_DEBTS.md`;
   - `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md`;
   - questo piano.
3. Usa il codice come fonte di verita. I report storici sono indizi, non stato attuale.
4. Non modificare codice applicativo prima di aver chiuso l'intervista dell'area.
5. Query o scritture DB solo su TEST (`docnnernvp`). PROD (`rwuxgvld`) e solo read-only, quando serve
   cercare dati mock o disallineamenti reali.
6. Working tree potenzialmente sporco: stage selettivo, non committare lavoro altrui.

---

## 1. Aree Admin e ordine di lavoro

| # | Area | Context principale | Stato iniziale | Criterio di uscita |
|---|---|---|---|---|
| 1 | Shell / ingresso / navigazione globale | `ADMIN_SHELL_NAV_CONTEXT.md` | blindatura avviata | login, edition, sidebar, dirty guard e logout mappati/testati |
| 2 | Prenotazioni operative | `ADMIN_PRENOTAZIONI_CONTEXT.md` | da fare | accetta/rifiuta/cancella/ripristina/nuova booking testati |
| 3 | Impostazioni / Personalizza Form | `ADMIN_SETTINGS_CONTEXT.md` | da fare | salvataggi, autosave, guard e impatto Prenota verificati |
| 4 | Menu admin / magazzino | `ADMIN_MENU_MAGAZZINO_CONTEXT.md` | da fare | categorie, ingredienti, QR, rename/delete e sync testati |
| 5 | Servizio | `ADMIN_SERVIZIO_CONTEXT.md` | da fare | sale/tavoli/slot/walk-in/briefing testati |
| 6 | CRM | `ADMIN_CRM_CONTEXT.md` | da fare | create/edit/delete cliente e booking collegate testati |
| 7 | Home / Analytics | `ADMIN_ANALYTICS_HOME_CONTEXT.md` | da fare | KPI, finestre data, quick action e responsive testati |
| 8 | Cross-area prod-ready | `ADMIN_CONFLICTS_AND_DEBTS.md` | da fare | fallback, hardcoded, codice morto e azioni pericolose chiusi o tracciati |

Regola: chiudere un'area prima di passare alla successiva, salvo bug trasversale bloccante.

---

## 2. Ciclo fisso per ogni area

### FASE A — Intervista di senso

L'orchestratore fa domande solo su cio che il codice non puo decidere:

- chi usa davvero l'area: admin, staff o entrambi;
- quale flusso e giornaliero e quale e setup raro;
- quali fallback sono voluti e quali sono debiti;
- quali azioni sono pericolose e devono chiedere conferma;
- quali limiti attuali sono voluti e non vanno "migliorati" d'ufficio.

Output: decisioni scritte nel context dell'area e, se generali, in `ADMIN_SKILL.md`.

### FASE B — Ricognizione codice e sub-agent read-only

Sub-agent consigliati:

- **Mapper flusso utente**: percorre l'area come utente e segnala stati, modal, uscite, errori.
- **Auditor flusso dati**: mappa hook, tabelle, settings, side effect, query invalidation.
- **Scanner prod-ready**: cerca fallback sospetti, mock, hardcoded, codice morto, elementi latenti.
- **Test engineer**: confronta test esistenti e buchi da coprire.
- **Controverifica finale**: parte da `AGENTS.md` e verifica che la doc guidi ai file giusti.

I sub-agent riportano finding. Non fixano, salvo prompt esplicito dell'orchestratore.

### FASE C — Blindatura prodotto

Per ogni finding l'orchestratore decide:

- fix immediato se e basso rischio e coerente con l'intervista;
- prompt anti-rottura a sub-agent se il fix e circoscritto;
- follow-up se e reale ma fuori area;
- "voluto" se Matteo lo conferma e la doc lo registra.

Ogni test di blindatura deve avere in testa:

```ts
// @admin-blindatura: <fronte>
// Copre: <flusso utente/dati blindato>
```

### FASE D — Controtest: ricerca ATTIVA di rotture (non solo "i test passano")

> Principio (deciso da Matteo 07-06-26, vale per TUTTE le aree). La chiusura di un'area non e
> "i test verdi". E **cercare attivamente cosa puo rompere la sezione**: come orchestratore lanci
> sub-agent con il mandato esplicito di *trovare bug*, non di confermare che funziona. La domanda
> guida e: **"cosa puo romperla, e cosa puo fare l'utente per romperla?"**. Un controtest che non
> ha provato a rompere nulla NON chiude l'area.

I sub-agent di controtest hanno questo mandato (riportano finding, non fixano):

1. **Flusso dati — prova a sporcarlo.** Per ogni azione: lo stato DB finale e quello giusto? Cosa
   succede con dati mancanti/nulli (orario assente, email vuota, capienza non configurata, tenant
   senza anagrafica)? Doppio click / azione ripetuta / race tra invalidazioni? Stati intermedi non
   sincronizzati? L'azione su un record gia in un altro stato (es. accettare una gia accettata)?
2. **Flusso utente — prova a romperlo da utente.** Click fuori sequenza, modale chiusa a meta,
   conferma annullata e ri-aperta, navigazione via mentre una mutation gira, back/refresh durante
   un'azione. Cosa vede l'utente se va storto: errore chiaro o schermata rotta?
3. **Limit test della sezione.** Spingere i confini: testi lunghissimi, numero ospiti enorme/0/negativo,
   date limite (mezzanotte, passato, anni avanti), liste molto lunghe (archivio con tante righe),
   capienza al limite esatto e +1. Cosa fa la UI ai bordi?
4. **Responsive 375 / 834 / 1280.** Ogni modale/azione nuova: layout che non si rompe, bottoni
   raggiungibili, niente overflow/sovrapposizioni, console senza errori. I modali di conferma nuovi
   vanno guardati su tutti e tre.

Checklist minima di chiusura:

- i 4 fronti sopra esercitati da sub-agent con mandato "rompi", finding raccolti e decisi
  (fix / follow-up / "voluto");
- test mirati dell'area verdi (inclusi i **limit test** aggiunti);
- `npm run validate` verde;
- console senza errori bloccanti su 375 / 834 / 1280;
- doc e test index aggiornati;
- `PROSEGUIMENTO_MAPPATURA_SKILL.md` aggiornato con stato area;
- report sessione con esiti e decisioni.

---

## 3. Area 1 — Shell / ingresso / navigazione globale

### 3.1 Intervista obbligatoria prima del codice

Domande chiuse con Matteo il 06-06-26:

- Staff e admin hanno stessi permessi: unico accesso per ora.
- Classic non ha sidebar; Pro/Enterprise hanno sidebar con sezioni abilitate dai flag.
- Logout deve bloccare se ci sono modifiche non salvate.
- Fallback header admin: `Sistema Gestionale Prenotazioni`.
- `features.home=false` deve nascondere Home anche se sidebar resta attiva.
- Refresh/back senza sotto-route non e un limite accettato: migliorare con sotto-route leggere.

### 3.2 Inventario tecnico da verificare

File e flussi principali:

- `src/router.tsx`: `/admin` e `/admin/:adminSection` protette.
- `src/pages/AdminLoginPage.tsx`: ingresso login.
- `src/components/layout/AdminShell.tsx`: sezione corrente, sidebar, logout, theme effect.
- `src/pages/AdminDashboard.tsx`: tab interne, URL tab e `bodyOverride` Home.
- `src/features/booking/hooks/useAdminAuth.ts`: sessione, `admin_users`, tenant, logout.
- `src/hooks/useFeatures.ts` + `src/config/features.ts`: Classic/Pro/Enterprise.
- `src/contexts/UnsavedChangesContext.tsx`: dirty state, save/discard, beforeunload.

### 3.3 Test da costruire o consolidare

Marcatori:

- `@admin-blindatura: shell-login`
- `@admin-blindatura: shell-edition`
- `@admin-blindatura: shell-sidebar`
- `@admin-blindatura: shell-dirty-guard`
- `@admin-blindatura: shell-logout`
- `@admin-blindatura: shell-refresh-back`

Scenari minimi:

- utente non autenticato su `/admin` torna a `/login`;
- Classic vede dashboard senza sidebar;
- Pro/Enterprise vede Home/Servizio/CRM/Analytics e puo tornare a Prenotazioni;
- cambio sezione con dirty state mostra guard;
- logout con dirty state mostra il guard;
- `features.home=false` nasconde Home e porta a Prenotazioni;
- refresh/back da sezione interna o tab dashboard usa sotto-route leggere.

### 3.4 Criterio uscita Area 1

Area 1 diventa `✅ PROD` solo se:

- decisioni intervista registrate;
- test `@admin-blindatura: shell-*` presenti o test esistenti aggiornati con marcatori;
- nessun fallback/header ambiguo resta senza stato;
- `ADMIN_SHELL_NAV_CONTEXT.md`, `ADMIN_TEST_SUITE_INDEX.md` e `ADMIN_SKILL.md` sono allineati;
- controverifica sub-agent conferma routing doc-guided.

---

## 3-bis. Area 2 — Prenotazioni operative

### 3-bis.1 Intervista chiusa con Matteo (06-06-26)

Decisioni (dettaglio in `contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` §5-bis):

- Capienza/fasce/orario passato = **solo avviso, mai blocco**.
- Stati `pending/accepted/rejected/deleted` + `no_show` **tutti voluti**, non toccare.
- Archivio = **solo soft-delete** recuperabile per sempre; **nessun hard-delete lato app**
  (Matteo pulira i record vecchi da DB con criterio temporale futuro).
- **Conferme da rendere coerenti** (una sola lingua di conferma):
  - Elimina: tiene la conferma+motivo attuale;
  - No-show: **aggiungere conferma** (oggi parte al primo click);
  - Reinserisci / Riporta in attesa: **sostituire `window.confirm()` nativo** con conferma custom;
  - Rifiuta: **allineare lo stile** al resto (ha gia il box motivo, non aggiungere passaggi).

### 3-bis.2 Stato reale del codice (verificato 06-06-26, codice=verita)

- `AcceptBookingModal` **NON e dead code**: importato/usato da `AdminBookingForm.tsx` (nuova
  prenotazione admin). L'accept-da-card (`PendingRequestsTab.handleAccept`) NON lo usa: accetta diretto.
  → Correggere ogni report/context che lo dava per "non cablato".
- Mutation reali in `useBookingMutations.ts`: `useAcceptBooking`, `useRejectBooking`, `useUpdateBooking`,
  `useRestoreBooking`, `useRequeueRejectedBooking`, `useMarkNoShow`, `useCancelBooking`.
- Conferme miste: `window.confirm()` (ArchiveTab restore/requeue), modale custom (cancel,
  capienza, orario passato), nessuna (no-show, reject diretto).

### 3-bis.3 Inventario file

- `src/features/booking/components/PendingRequestsTab.tsx` — accept/reject da card, avvisi non bloccanti.
- `src/features/booking/components/ArchiveTab.tsx` — restore/requeue con `confirm()` nativo.
- `src/features/booking/components/BookingDetailsModal.tsx` — **LOCK strutturale** (cancel, no-show,
  modifica). Leggere `docs/ADMIN_CLASSIC_SKILL.md` prima di toccare.
- `src/features/booking/components/AcceptBookingModal.tsx`, `RejectBookingModal.tsx`,
  `CapacityWarningModal.tsx`, `PastStartTimeWarningModal.tsx`, `BookingRequestCard.tsx`.
- `src/features/booking/hooks/useBookingMutations.ts` — **LOCK core**.

### 3-bis.4 Test da costruire (marcatore `@admin-blindatura: prenotazioni`)

Scenari minimi:

- accept-da-card su pending → scrive `accepted` + orari + `desired_time`;
- accept che sfora capienza → mostra warning ma **non blocca** (conferma → mutate);
- accept su orario passato → mostra warning ma **non blocca**;
- rifiuta con/senza motivo → `rejected` + `rejection_reason`;
- elimina → `deleted` + `cancelled_at` + `cancellation_reason` (soft-delete, niente hard-delete);
- reinserisci (deleted→accepted, richiede `confirmed_start/end`);
- riporta in attesa (rejected→pending, azzera `rejection_reason`);
- no-show → `no_show=true`, sparisce dal calendario, resta nel DB;
- **conferme coerenti**: ogni azione pericolosa passa dalla conferma custom (regressione anti
  `window.confirm` nativo + no-show senza conferma).

### 3-bis.5 Criterio uscita Area 2

- decisioni intervista registrate (fatto: context §5-bis + skill §6 + questo §3-bis);
- conferme rese coerenti senza rompere i flussi LOCK;
- test `@admin-blindatura: prenotazioni` sui flussi sopra, verdi;
- `npm run validate` verde;
- doc (context, test index, skill) e `PROSEGUIMENTO_MAPPATURA_SKILL.md` allineati;
- controtest sub-agent flusso dati + utente/responsive.

---

## 4. Prompt anti-rottura per sub-agent

Quando si delega un fix:

```text
Profilo: Esecuzione
Modalita: deep
Skill da leggere: docs/Admin-Skill/ADMIN_SKILL.md + docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md + context dell'area
Output attesi: solo il fix descritto e i test indicati; niente output extra senza chiedere Si/No prima.

Stai modificando [area/flusso] per [decisione/finding].
Tocca solo [file/superfici].
NON toccare [lock/parti funzionanti].
Preserva questo senso utente: [decisione Matteo].
Se per fixare devi cambiare una parte non elencata o una LOCK, fermati e riporta il finding.
Dopo il fix esegui test mirati + comando concordato.
```

---

## 5. Registro stati

Aggiornare a fine area.

| Area | Stato | Report / note |
|---|---|---|
| Shell / ingresso / navigazione globale | 🔶 blindatura avviata | Intervista chiusa; sotto-route, logout guard, fallback header e test unitari avviati |
| Prenotazioni operative | 🔶 batch FU-046 chiuso | Fix D1/R1/D4/D5/D2 + 2° giro FU-046 (D3 migr.044, U2/U5/U6/U7/U1/U4/U10) 07-06-26; bloccanti ALTO+MEDIO risolti. Restano U3/U9/D6/D7/L* + E2E/QA reale (FU-043, FU-046 residuo) |
| Impostazioni / Personalizza Form | ⬜ | Da avviare dopo Prenotazioni o secondo priorita Matteo |
| Menu admin / magazzino | ⬜ | Da coordinare con Prenota/Menu QR gia blindate |
| Servizio | ⬜ | Include walk-in e tavoli occupati |
| CRM | ⬜ | Attenzione email normalizzata e delete multi-step |
| Home / Analytics | ⬜ | Attenzione finestre data e KPI |
| Cross-area prod-ready | ⬜ | Da eseguire a fine ciclo o incrementalmente |
