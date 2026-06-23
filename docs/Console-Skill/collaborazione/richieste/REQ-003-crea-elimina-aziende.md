# REQ-003 — Crea / elimina aziende (tenant) + associazione utente↔azienda

| Campo | Valore |
|-------|--------|
| **Stato** | DA-FARE |
| **Priorità** | alta |
| **Aperta da** | Matteo |
| **Data apertura** | 2026-06-22 |
| **Area** | gestione aziende (tenant) |
| **Collegata a** | REQ-001 (utenti), REQ-002 (scheda azienda) |

---

## ① Richiesta (Matteo)

**Cosa voglio:**

> Poter **creare** una nuova azienda (tenant) e **eliminarla**. In creazione voglio impostare subito
> **nome, tenant/slug, edition** e poter **associare un utente** all'azienda (vedi REQ-001). In pratica:
> da "nuovo utente" o da "nuova azienda" arrivo ad avere un cliente pronto, con la sua azienda e il suo
> accesso, su cui poi faccio il setup (REQ-002).

**Su quale schermata / dove lo vedo:**

> Pulsante "Nuova azienda" nella Console; form con nome, slug, edition, (opzionale) utente admin da
> associare. Azione "Elimina azienda" dalla scheda/lista, con conferma.

**Come capisco che è fatto:**

> - Se creo un'azienda con nome + edition, compare nella lista ristoranti ed è subito apribile (REQ-002).
> - Se in creazione associo un utente, quell'utente risulta admin di quell'azienda.
> - Se elimino un'azienda (con conferma), sparisce.

---

## ✅ Decisioni prese — istruzioni operative

> Risolte con Matteo il 2026-06-22 (DEC-037/038/041/042). È l'azione **più potente** della Console:
> seguire le protezioni alla lettera.

**Ambito (DEC-037): nessun limite** — la console può creare/modificare/eliminare **qualsiasi** azienda
su **TEST** (`docnnernvp`). ⚠️ **RULE-2 (sandbox-only) revocata** per la gestione console. **RULE-1
resta**: solo TEST, **mai** PROD `rwuxgvld` (`get_project_url` prima di ogni scrittura).

**Creazione (DEC-041): azienda + admin in UN unico passaggio.** Form unico:
- Azienda: **nome**, **slug** (proponilo auto dal nome, modificabile, unico), **edition** (`classic`/`pro`/`enterprise`), eventuali campi base.
- Admin: **email + password impostate da Matteo** (login immediato). L'admin risulta associato all'azienda.

**Eliminazione (DEC-038): cancellazione definitiva (hard-delete).** Protezione obbligatoria:
- Prima di cancellare, Matteo deve **riscrivere il nome esatto** dell'azienda.
- Avviso chiaro che l'azione è **irreversibile** (e cosa viene rimosso, es. dati collegati/cascata).

**Implementazione lato Edge:** azioni `create_tenant` (+ admin), `delete_tenant`; validazione slug unico
ed edition valida; **estendere/rimuovere** `SANDBOX_TENANT_IDS` mantenendo il gate **allowlist** (DEC-037).
Nuove tabelle/colonne/GRANT/RLS → *plan per matteo* (ricorda: nuove tabelle `public` richiedono GRANT
espliciti — vedi memoria Data API). Registra eventuali sotto-decisioni come `DEC-NNN`.

**Ordine (DEC-042): questa REQ viene DOPO** REQ-001 (lettura) + REQ-002 (scheda). Procedere a step:
prima creazione, poi associazione admin, poi eliminazione protetta.

---

## ② Consegna (Team Console)

### F10 (Edge) + F12 (UI) — Crea / elimina azienda (2026-06-22)

**Cosa è stato fatto:**

- **Edge `console-admin` (F10)**: azioni `create_tenant` (azienda + admin opzionale in **un unico passaggio**, DEC-041) e `delete_tenant` (hard-delete protetto da `confirm_name` rivalidato server-side, DEC-038). Validazione slug unico + edition. Cascata: pulizia applicativa dei figli di configurazione + **409** con rinvio a PLAN-DB-006 se restano dati operativi (DEC-047).
- **UI (F12)**: hook `useTenantMutations` + `CreateTenantModal` (pulsante **"+ Nuova azienda"** in Ristoranti: nome, slug auto-generato/modificabile/validato, edition, sezione admin opzionale) + `DeleteTenantModal` (dalla scheda azienda: **riscrittura del nome esatto** + avviso irreversibilità e di cosa viene rimosso; gestione 409 dati operativi). La lista si aggiorna dopo creazione/eliminazione.

**Commit:** `f94b075` (F10 Edge) · `abd0f74` (F12 UI) — branch `feature/console-super-admin`.

**File principali:** `console/supabase/functions/console-admin/index.ts`, `console/src/lib/consoleAdminClient.ts`, `console/src/hooks/useTenantMutations.ts`, `console/src/components/{CreateTenantModal,DeleteTenantModal,RestaurantList,TenantDetail,AppShell}.tsx`.

**Verifiche:** `build`/`lint`/`typecheck` verdi (100 moduli). Nessuna scrittura DB in sviluppo.

**Cosa deve fare/testare Matteo (lato suo):**
1. **Re-deploy** dell'Edge `console-admin` (PLAN-DB-003) per attivare `create_tenant`/`delete_tenant`.
2. (Opzionale ma consigliato) eseguire **PLAN-DB-006** (`ON DELETE CASCADE` su `organizations`): senza, `delete_tenant` elimina solo aziende "vuote" (es. appena create) e risponde 409 su quelle con dati operativi.
3. Testare: creare un'azienda (con e senza admin), aprirne la scheda, eliminarla riscrivendo il nome esatto.

> ⚠️ Push del branch ancora **da fare** (serve ok esplicito di Cristiano): la REQ resta **IN-SVILUPPO** fino al push, poi → CONSEGNATA.

## ③ Esito test (Matteo)

_(da compilare dopo il test)_
