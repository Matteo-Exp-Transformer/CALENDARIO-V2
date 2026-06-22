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

_(da compilare alla consegna)_

## ③ Esito test (Matteo)

_(da compilare dopo il test)_
