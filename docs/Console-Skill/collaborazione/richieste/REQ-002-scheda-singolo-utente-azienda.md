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

## ✅ Decisioni prese — istruzioni operative

> Risolte con Matteo il 2026-06-22 (DEC-040, + DEC-037). **L'intervista la fa Matteo col cliente**; la
> scheda serve a Matteo per **riversare** i dati raccolti e vedere cosa manca. Il Team non intervista nessuno.

**Copertura (DEC-040): TUTTE le sezioni dell'intervista.** La scheda deve coprire, sezione per sezione,
tutto `onboarding/INTERVISTA_NUOVO_CLIENTE.md`: anagrafica/versione, contatti, funzioni, orari/fasce,
regole prenotazione, sala/tavoli (Pro), menu/QR, aspetto pagina, accessi. Si **costruisce a tappe** ma
l'obiettivo è la copertura completa.

**Come costruirla:**
- **Mappare 1:1** le sezioni dell'intervista ai campi della scheda; per ciascun campo indicare dove sta
  il dato (colonna `organizations` / chiave `restaurant_settings` / `tenant_features` / tabella sale-tavoli-menu),
  la versione e se è scrivibile.
- **Riusa** i pannelli esistenti (edition, feature flag, impostazioni) raccogliendoli per **un singolo
  tenant**, ed **estendili** alle sezioni non ancora esposte.
- Le chiavi "avanzate" oggi non esposte (`business_hours`, `slot_guest_capacities`,
  `booking_public_form_config`, …, FU-CONSOLE-9) **vanno coperte**: richiedono editor dedicati →
  pianificarle come sotto-tappe.
- Mostra a colpo d'occhio **cosa è già configurato vs cosa manca** rispetto all'intervista.

**Ambito e scritture (DEC-037):** la scheda agisce su **qualsiasi azienda** su TEST (non solo sandbox),
con il gate allowlist + scritture via Edge. Resta RULE-1 (solo TEST). Schema/RLS nuovi → *plan per matteo*.

**Ordine (DEC-042):** questa REQ è tra le **prime** (con REQ-001 in lettura), prima delle azioni crea/elimina.

---

## ② Consegna (Team Console)

_(da compilare alla consegna)_

## ③ Esito test (Matteo)

_(da compilare dopo il test)_
