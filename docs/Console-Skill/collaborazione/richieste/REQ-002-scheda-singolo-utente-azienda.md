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

### F9 — Scheda azienda, tappa 1 (2026-06-22)

**Cosa è stato fatto:**

- Nuovo componente `console/src/components/TenantDetail.tsx`: vista **focus su un singolo tenant**, apribile da "Apri scheda" nella vista Utenti **e** da una card in Ristoranti (stato drill-down in `AppShell`, DEC-046; "← Torna" per rientrare).
- Riusa i pannelli esistenti **EditionSelector / FeatureFlagsPanel / RestaurantSettingsPanel** per quel tenant + mostra i **campi base** di `organizations` in lettura (name, slug, plan, max_*, is_active, edition).
- **Mappa di copertura intervista**: tutte le 9 sezioni di `onboarding/INTERVISTA_NUOVO_CLIENTE.md` con stato — Sez.0 (anagrafica/versione), Sez.2 (funzioni), Sez.4 (regole, 5 chiavi) **esposte**; Sez.1/3/5/6/7/8 marcate 🔒 «in arrivo» → **FU-CONSOLE-9**.
- In F9 il gate `isSandboxTenant` **non** è toccato: per i tenant non-sandbox i pannelli restano in lettura (sbloccato da F10/F12 lato Edge; la UI dei pannelli edition/feature/impostazioni resta sandbox-gated, vedi nota sotto).

**Commit:** `6f5f4b0` — branch `feature/console-super-admin`. **File:** `console/src/components/{TenantDetail,AppShell,RestaurantList,UserList}.tsx`.

**Verifiche:** `build`/`lint`/`typecheck` verdi (93 moduli).

**Copertura (DEC-040): tappa 1.** La struttura c'è e copre le sezioni già esposte; gli **editor delle altre sezioni** (contatti, orari/fasce, sala/tavoli, menu/QR, aspetto) sono pianificati come sotto-tappe in **FU-CONSOLE-9**, dopo il write-block.

**Cosa deve testare Matteo:** dopo push + PLAN-DB-005, aprire la scheda di un'azienda da Utenti/Ristoranti, verificare campi base + pannelli + mappa di copertura.

> Nota: i pannelli di **scrittura** edition/feature/impostazioni nella scheda restano oggi limitati ai sandbox (gate UI invariato in F9). L'estensione a tutte le aziende è una sotto-tappa successiva (allineamento UI a DEC-037); le azioni utenti/aziende (F11/F12) invece già valgono su tutte le aziende.

## ③ Esito test (Matteo / Cristiano)

**Esito:** ✅ **ACCETTATA (con test residui)** · **Testato da:** Cristiano · **Data:** 2026-06-23

- Apertura scheda azienda da Utenti/Ristoranti, campi base + pannelli → ✅ funziona.
- Scenario 2 (cambio versione) / Scenario 4 (spegni funzione) / Scenario 5 (cambia giorni di prenotazione) → ✅ funzionano, niente salto in cima.

**Test residui (rimandati — vedi FOLLOW_UP):**
- Scenario 3 — **accendere una funzione extra** (es. menù QR) con la scritta "aggiunta a mano": ancora **da provare**.
- **Sezioni bloccate nella mappa "Copertura intervista nuovo cliente"**: chiarito il perché (sotto). Non un bug → editor in arrivo con **FU-CONSOLE-9**.

> **Perché alcune sezioni della "Copertura intervista nuovo cliente" sono bloccate (🔒).**
> La scheda azienda oggi espone gli editor solo per **Sez.0** (anagrafica/versione), **Sez.2** (funzioni)
> e **Sez.4** (regole, 5 chiavi). Le **Sez.1 contatti**, **Sez.3 orari/fasce**, **Sez.5 sala/tavoli**,
> **Sez.6 menu/QR**, **Sez.7 aspetto** sono marcate 🔒 «in arrivo» perché la Console **non ha ancora gli
> editor dedicati** per quei dati (alcuni toccano tabelle/valori che vanno ancora ricreati lato Console).
> È una scelta voluta della tappa 1 (DEC-040/DEC-046), non un guasto: lo sblocco è pianificato in
> **FU-CONSOLE-9**.
