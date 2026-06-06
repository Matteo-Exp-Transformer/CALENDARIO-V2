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

### FASE D — Controtest e chiusura area

Checklist minima:

- test mirati dell'area verdi;
- `npm run validate` verde;
- smoke o Playwright su 375 / 834 / 1280 se l'area ha UI;
- console senza errori bloccanti;
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
| Prenotazioni operative | ⬜ | Da avviare dopo Area 1 |
| Impostazioni / Personalizza Form | ⬜ | Da avviare dopo Prenotazioni o secondo priorita Matteo |
| Menu admin / magazzino | ⬜ | Da coordinare con Prenota/Menu QR gia blindate |
| Servizio | ⬜ | Include walk-in e tavoli occupati |
| CRM | ⬜ | Attenzione email normalizzata e delete multi-step |
| Home / Analytics | ⬜ | Attenzione finestre data e KPI |
| Cross-area prod-ready | ⬜ | Da eseguire a fine ciclo o incrementalmente |
