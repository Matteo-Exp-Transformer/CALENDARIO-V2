# REQ-002 — Scheda focus singolo utente / azienda (setup completo)

| Campo | Valore |
|-------|--------|
| **Stato** | DA-FARE |
| **Priorità** | alta |
| **Aperta da** | Matteo |
| **Data apertura** | 2026-06-22 |
| **Area** | nuova vista "scheda azienda" (drill-down) |
| **Collegata a** | REQ-001 (lista utenti), documento `onboarding/INTERVISTA_NUOVO_CLIENTE.md` |

---

## ① Richiesta (Matteo)

**Cosa voglio:**

> Dalla vista utenti (REQ-001) voglio poter **scegliere un utente** ed **entrare nella sua scheda
> utente/azienda**: una vista **focus su un singolo cliente** con **tutto ciò che esiste, è attivo e
> impostabile** per quell'azienda. Da lì valuto e completo il **setup dell'azienda in base
> all'intervista** fatta al cliente.

**Su quale schermata / dove lo vedo:**

> Clic su un utente nella lista → pagina/scheda dedicata dell'azienda. In un'unica vista: versione
> venduta, funzioni accese, tutte le impostazioni, e (se Pro) sala/tavoli, menu/QR.

**Come capisco che è fatto:**

> - Se scelgo un utente, entro nella scheda della sua azienda e vedo **tutto il setup** in un colpo.
> - Vedo cosa è **già configurato** e cosa **manca** rispetto all'intervista.
> - Posso **impostare/modificare** i valori (quelli scrivibili) e salvarli.

**Note / esempi:**

> Deve rispecchiare il documento di intervista: le sezioni della scheda = le sezioni dell'intervista
> (anagrafica/versione, contatti, funzioni, orari/fasce, regole prenotazione, sala/tavoli, menu/QR,
> aspetto pagina, accessi). Vedi `docs/Console-Skill/onboarding/INTERVISTA_NUOVO_CLIENTE.md`.

---

## ⚠️ Note architetturali / da decidere (per il Team)

> - La scheda **riusa** i pannelli già esistenti (edition, feature flag, impostazioni) ma li raccoglie
>   per **un singolo tenant** e li **estende** alle sezioni dell'intervista non ancora esposte
>   (orari/fasce, sala/tavoli, menu/QR, aspetto): valutare cosa è leggibile/scrivibile oggi e cosa
>   richiede nuove azioni Edge o nuove letture RLS.
> - **Mappare 1:1** le sezioni dell'intervista (`INTERVISTA_NUOVO_CLIENTE.md`) ai campi della scheda,
>   indicando per ciascuno: dove sta il dato (colonna/setting/feature/tabella), versione, scrivibile sì/no.
> - Le chiavi impostazioni "avanzate" (`business_hours`, `slot_guest_capacities`, `booking_public_form_config`,
>   ecc.) oggi NON sono esposte (FU-CONSOLE-9): decidere se questa scheda le copre (richiede editor dedicati).
> - Scritture solo via Edge; schema/RLS → *plan per matteo*.

---

## ② Consegna (Team Console)

_(da compilare alla consegna)_

## ③ Esito test (Matteo)

_(da compilare dopo il test)_
