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

_(da compilare alla consegna — vedi `_TEMPLATE_RICHIESTA.md`)_

## ③ Esito test (Matteo)

_(da compilare dopo il test)_
