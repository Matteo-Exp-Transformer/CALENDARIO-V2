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

## ⚠️ Note architetturali / da decidere (per il Team — CRITICO)

> Creare/eliminare **tenant reali** è l'azione **più delicata** di tutta la Console: tocca dati di
> clienti veri, non i sandbox. Prima di sviluppare, concordare con Matteo:
>
> 1. **Guard**: l'attuale guard sandbox-only va esteso. Creare un tenant *nuovo* è ammesso (non è un
>    sandbox né un tenant esistente di Matteo); **modificare/eliminare** tenant *esistenti* va protetto
>    con conferme forti e — idealmente — un flag che distingua "tenant gestiti dalla Console" da quelli
>    storici di Matteo.
> 2. **Azioni Edge nuove**: `create_tenant`, `delete_tenant` (+ associazione admin) con service role
>    server-side. Validazione slug unico, edition valida.
> 3. **GRANT + RLS su nuove tabelle/colonne** → *plan per matteo* (ricorda la regola Supabase Data API:
>    nuove tabelle `public` richiedono GRANT espliciti).
> 4. **Eliminazione**: soft-delete (`is_active=false`) vs hard-delete con cascata? Definire e mettere
>    doppia conferma. Default consigliato: **soft-delete**.
> 5. **Coerenza con i dati di Matteo**: NON toccare i tenant esistenti reali senza sua conferma esplicita.

> Apri i `plan-per-matteo` necessari e registra `DEC-NNN` per ogni scelta. Procedere a step:
> prima creazione su un ambiente di prova, poi eliminazione, poi associazione utente.

---

## ② Consegna (Team Console)

_(da compilare alla consegna)_

## ③ Esito test (Matteo)

_(da compilare dopo il test)_
