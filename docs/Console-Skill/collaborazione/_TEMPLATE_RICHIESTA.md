<!--
TEMPLATE RICHIESTA — copia questo file in richieste/REQ-NNN-titolo-breve.md
Matteo compila la sezione ① e crea la riga nel REGISTRO_RICHIESTE.md (stato DA-FARE).
Il Team compila ② alla consegna. Matteo compila ③ dopo il test.
Non cancellare le sezioni: il file racconta l'intero ciclo di vita della richiesta.
-->

# REQ-NNN — <titolo breve>

| Campo | Valore |
|-------|--------|
| **Stato** | DA-FARE |
| **Priorità** | media |
| **Aperta da** | Matteo |
| **Data apertura** | 2026-MM-GG |
| **Area** | _(es. elenco ristoranti / feature flag / impostazioni / login / altro)_ |

---

## ① Richiesta (compila Matteo)

**Cosa voglio** _(descrivi a parole tue, per flussi concreti — non servono nomi di file):_

> …

**Su quale schermata / dove lo vedo:**

> …

**Come capisco che è fatto** _(uno o più "se faccio X, deve succedere Y"):_

> - Se …, allora …
> - …

**Note / vincoli / esempi** _(facoltativo):_

> …

---

## ② Consegna (compila il Team Console)

| Campo | Valore |
|-------|--------|
| **Branch** | `feature/console-super-admin` |
| **Commit** | `<sha>` (… altri …) |
| **build / typecheck / lint** | ✅ / ❌ + note |
| **Mobile / responsive (~375px)** | ✅ / ❌ — **obbligatorio**: la UI deve funzionare perfettamente da telefono |
| **File toccati (solo `console/`)** | … |
| **Decisioni** | DEC-NNN (se presenti) |
| **Fase / audit** | blocco in `PHASE_AUDIT.md` (se applicabile) |
| **Follow-up aperti** | FU-CONSOLE-NNN (se presenti) |

**Cosa è cambiato (sintesi):**

> …

**Cosa deve testare Matteo** _(passi concreti, in ordine):_

> 1. …
> 2. …

**Cosa serve lato Matteo prima/per testare** _(barra ciò che non serve):_

- [ ] Aggiornare `console/.env.local` — variabili: `…`
- [ ] Eseguire un *plan per matteo* — file: `plan-per-matteo/PLAN-DB-NNN-….md`
- [ ] Deploy / re-deploy Edge Function `console-admin`
- [ ] Impostare/aggiornare un secret — quale: `…`
- [ ] Nient'altro: basta importare il branch e riavviare `npm run dev`

---

## ③ Esito test (compila Matteo)

| Campo | Valore |
|-------|--------|
| **Importato in `env/test`** | sì/no — come (merge ff / merge) |
| **Esito** | ACCETTATA / RIMANDATA |
| **Data** | 2026-MM-GG |

**Cosa ho verificato:**

> …

**Se RIMANDATA — cosa non va / cosa manca:**

> …
