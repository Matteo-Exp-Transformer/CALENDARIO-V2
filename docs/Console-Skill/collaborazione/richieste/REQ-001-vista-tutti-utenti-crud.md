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

## ⚠️ Note architetturali / da decidere (per il Team — NON saltare)

> Questa richiesta **supera il modello di sicurezza attuale** (oggi le scritture passano dall'Edge
> `console-admin` e sono ristrette ai 2 tenant **sandbox** `console-classic`/`console-pro`). Creare/
> modificare/eliminare **utenti e associazioni reali** richiede decisioni prima di sviluppare:
>
> 1. **Sorgente "utenti"**: la lista è da `admin_users` (admin per tenant) o da Supabase **Auth users**,
>    o entrambi uniti? Definire il modello prima della UI.
> 2. **Scritture privilegiate**: servono **nuove azioni** nell'Edge `console-admin` (es. `create_user`,
>    `update_user`, `delete_user`) con service role lato server. Il browser non scrive direttamente.
> 3. **Guard sandbox**: il guard attuale blocca tutto fuori dai 2 sandbox. Per agire su utenti/aziende
>    reali serve **estendere o sostituire** il guard con un controllo diverso (es. solo super-admin in
>    `console_allowed_emails`, con conferme esplicite per le azioni distruttive). **Da concordare con
>    Matteo prima di rimuovere il guard** (è la protezione principale).
> 4. **Eliminazioni**: definire cosa significa "elimina utente" (soft-delete? cascata su dati?). Le
>    azioni distruttive vanno con doppia conferma.
> 5. **Schema/RLS**: ogni nuova policy o colonna → *plan per matteo*, non SQL diretto dall'agente.

> Suggerimento: prima di sviluppare, proponi a Matteo un mini-piano (modello dati + azioni Edge + guard)
> e apri i `plan-per-matteo` necessari. Registra le decisioni come `DEC-NNN`.

---

## ② Consegna (Team Console)

_(da compilare alla consegna — vedi `_TEMPLATE_RICHIESTA.md`)_

## ③ Esito test (Matteo)

_(da compilare dopo il test)_
