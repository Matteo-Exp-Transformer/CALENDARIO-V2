# REQ-001 — Vista "Tutti gli utenti" + CRUD utente

| Campo | Valore |
|-------|--------|
| **Stato** | DA-FARE |
| **Priorità** | alta |
| **Aperta da** | Matteo |
| **Data apertura** | 2026-06-22 |
| **Area** | nuova vista utenti / gestione accessi |
| **Collegata a** | REQ-002 (scheda singola), REQ-003 (aziende) |

---

## ① Richiesta (Matteo)

**Cosa voglio:**

> Una **vista con tutti gli utenti** della piattaforma. Per ogni utente (identificato dall'email) voglio
> poter fare **CRUD comodo**: vedere e **modificare** l'admin e il tenant/azienda a cui è associato e i
> dati legati a quell'email; **eliminare** un utente; **creare** un nuovo utente. In creazione voglio
> poterlo **già associare** a un'azienda (tenant), con nome ed edition (vedi REQ-003 per la parte azienda).

**Su quale schermata / dove lo vedo:**

> Nuova voce/vista nella Console, accanto a "Ristoranti": una **lista utenti** (tabella o card) con
> ricerca per email, e da ogni riga le azioni modifica / elimina / apri scheda. Pulsante "Nuovo utente".

**Come capisco che è fatto:**

> - Se apro la vista utenti, vedo **tutti** gli utenti con email + azienda/tenant associato + ruolo admin.
> - Se modifico l'azienda o i dati di un utente e salvo, il cambiamento **persiste** nel DB.
> - Se elimino un utente, sparisce dalla lista (e dal DB/Auth).
> - Se creo un nuovo utente posso assegnargli subito email + azienda + edition.

**Note / esempi:**

> Deve essere comodo per gestire admin e tenant senza passare dal DB a mano.

---

## ✅ Decisioni prese — istruzioni operative

> Risolte con Matteo il 2026-06-22 (DEC-037..042). **Il Team può procedere** senza riaprire queste scelte.

**Chi è un "utente" (DEC-039):** l'**admin di un ristorante** — un'email collegata a un'azienda
(`organizations`) con il suo ruolo. Sorgente: `admin_users` + Supabase Auth. La lista mostra tutti gli
admin con: email, azienda/tenant associato, ruolo, stato. (NON i clienti finali.)

**CRUD richiesto:**
- **Modifica**: email, azienda associata, ruolo/dati dell'admin.
- **Crea (DEC-041):** email + **password impostata da Matteo** (stesso modello del login console);
  l'admin entra subito. La creazione può avvenire insieme all'azienda in un unico passaggio (REQ-003).
- **Elimina (DEC-038):** **cancellazione definitiva (hard-delete)**, protetta: prima di cancellare
  Matteo deve **riscrivere l'email/nome esatto** + avviso chiaro che l'azione è **irreversibile**.

**Ambito (DEC-037):** le azioni valgono su **tutte le aziende/utenti** del progetto **TEST**
(`docnnernvp`), non solo i sandbox. ⚠️ Questo **revoca RULE-2** (sandbox-only) per la gestione console.
**Resta attiva RULE-1**: solo TEST `docnnernvp`, **mai** PROD `rwuxgvld` (`get_project_url` prima di scrivere).

**Rete di sicurezza (sostituisce il guard sandbox):**
1. Gate **allowlist** — solo email in `console_allowed_emails` / secret `CONSOLE_ALLOWED_EMAILS` (già attivo).
2. Scritture **solo via Edge `console-admin`** con service role (mai dal browser).
3. Azioni distruttive → conferma "**riscrivi il nome**" + avviso irreversibilità (DEC-038).

**Implementazione lato Edge:** nuove azioni `create_admin_user`, `update_admin_user`, `delete_admin_user`;
**estendere/rimuovere** `SANDBOX_TENANT_IDS` mantenendo il gate allowlist (DEC-037); utenti Auth via
`supabase.auth.admin.*` (service role). Schema/colonne nuove → *plan per matteo* (mai SQL diretto).

**Ordine (DEC-042):** prima la **lista in lettura** (questa REQ) + scheda (REQ-002); poi la parte
**scrittura** (crea/modifica/elimina) insieme a REQ-003.

---

## ② Consegna (Team Console)

### F8 — Vista "Tutti gli utenti" in lettura (2026-06-22)

**Cosa è stato fatto:**

- Navigazione a tab (Ristoranti / Utenti) aggiunta in `AppShell.tsx` via switch di stato locale (DEC-045).
- Nuovo componente `console/src/components/UserList.tsx`: legge `admin_users` con join lato server su `organizations`, mostra per riga email, nome, azienda (nome + /slug), edition (badge), stato attivo.
- Ricerca per email (filtro lato client, case-insensitive).
- Gestione caso RLS non attiva: se la query torna 0 righe mostra il messaggio «Nessun utente visibile — verifica che PLAN-DB-005 sia stato eseguito su TEST (docnnernvp)».
- Azioni di riga placeholder disabilitati: "Apri scheda" (F9), "Modifica" e "Elimina" (F10/F11 — in arrivo).
- Responsive: tabella con `overflow-x: auto` + `minWidth: 600px` per scorrimento orizzontale su 375px.
- Nessuna dipendenza da `../src`, nessun service role nel browser, nessuna scrittura DB.

**File toccati:**
- `console/src/components/AppShell.tsx` — navigazione tab aggiunta
- `console/src/components/UserList.tsx` — creato (nuova vista utenti)

**Comandi di verifica (eseguiti, tutti verdi):**
- `npm run build` → ✅ 92 moduli, 0 errori TypeScript
- `npm run lint` → ✅ 0 warning
- `npm run typecheck` → ✅ clean

**Prossimo passo atteso da Matteo:** eseguire **PLAN-DB-005** su TEST (`docnnernvp`) per attivare la policy SELECT su `admin_users` e vedere la lista popolata.

### F10 + F11 — CRUD utente (scrittura) (2026-06-22)

**Cosa è stato fatto:**

- **Edge `console-admin` esteso (F10)** con azioni `create_admin_user`, `update_admin_user`, `delete_admin_user` (utenti Auth via service role lato Edge; conferma `confirm_email` rivalidata server-side per l'eliminazione, DEC-038). Guard sandbox sostituito dalla rete DEC-037 (allowlist + conferme); RULE-1 invariata (solo TEST).
- **UI CRUD (F11)**: hook `useAdminUserMutations` + modali `CreateUserModal` (email + password ≥8 + azienda), `EditUserModal` (nome/azienda/email), `DeleteUserModal` (riscrittura email esatta + avviso irreversibilità). Pulsante "+ Nuovo utente" e azioni di riga reali in `UserList` (su tutte le aziende, DEC-037). Degrado con messaggio se l'Edge non è raggiungibile.

**Commit:** `50555f9` (F8) · `f94b075` (F10 Edge) · `9b2fd7f` + `ad2e619` (F11 UI + fix password) — branch `feature/console-super-admin`.

**File principali:** `console/supabase/functions/console-admin/index.ts`, `console/src/lib/consoleAdminClient.ts`, `console/src/hooks/useAdminUserMutations.ts`, `console/src/components/{UserList,CreateUserModal,EditUserModal,DeleteUserModal}.tsx`.

**Verifiche:** `build`/`lint`/`typecheck` verdi (97 moduli). Nessuna scrittura DB in fase di sviluppo.

**Cosa deve fare/testare Matteo (lato suo):**
1. Eseguire **PLAN-DB-005** (policy SELECT `admin_users`) → la lista Utenti si popola.
2. **Re-deploy** dell'Edge `console-admin` (istruzioni in `plan-per-matteo/PLAN-DB-003`, nessun nuovo secret) per attivare le azioni F10.
3. Testare: creare un utente (email+password+azienda), modificarlo, eliminarlo (riscrivendo l'email esatta). Verificare in Supabase Auth.

> ⚠️ Push del branch ancora **da fare** (serve ok esplicito di Cristiano, regola git del branch): finché non è pushato, Matteo non può importarlo in `env/test`. Per questo la REQ resta **IN-SVILUPPO** (passa a CONSEGNATA dopo il push).

## ③ Esito test (Matteo / Cristiano)

**Esito:** ✅ **ACCETTATA (con un test residuo)** · **Testato da:** Cristiano · **Data:** 2026-06-23

- Vista "Tutti gli utenti" con dati reali (join utenti × aziende) + ricerca → ✅ funziona.
- Modifica / elimina utente (con riscrittura email esatta) → ✅ funziona.

**Test residuo (rimandato — vedi FOLLOW_UP):**
- Scenario 8 — **creare un utente collegato a un'azienda** da "+ Nuovo utente": ancora **da provare**.
