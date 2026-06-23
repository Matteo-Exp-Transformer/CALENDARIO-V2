# HAND-OFF — Senior Console · ripartenza da FASE C (migliorie scheda azienda)

> **Data:** 2026-06-23 · **Da:** sessione "esito test Cristiano + PLAN-DB-006" · **A:** prossimo Senior del branch.
> **Branch:** `feature/console-super-admin` (working tree con doc aggiornate, **non committato** — vedi §6).
>
> Leggi prima `00_BUSSOLA_CONSOLE.md` + `collaborazione/README.md` + `collaborazione/STATO_AMBIENTE_TEST.md`.
> Storia precedente: `HANDOFF-orchestrator-REQ-001-003.md` (F8→F13).

---

## 1. Dove siamo (tutto verde, REQ chiuse)

Le 4 richieste della lavagna `collaborazione/REGISTRO_RICHIESTE.md` sono **ACCETTATE**:

| REQ | Cosa | Stato | Note |
|-----|------|-------|------|
| REQ-001 | Vista "Tutti gli utenti" + CRUD utente | ✅ ACCETTATA | 1 test residuo: **crea utente** (TEST-RES-2) |
| REQ-002 | Scheda singola azienda/utente | ✅ ACCETTATA | residui: **accendi funzione** (TEST-RES-1) + sezioni 🔒 (→ FU-CONSOLE-9) |
| REQ-003 | Crea/elimina aziende | ✅ ACCETTATA | sbloccata anche elimina con dati (PLAN-DB-006) |
| REQ-004 | Lista Ristoranti compatta + ricerca + ritorno posizione | ✅ ACCETTATA | commit `c77bdd1` |

**Infra TEST aggiornata** (vedi `STATO_AMBIENTE_TEST.md`):
- PLAN-DB-005 (lista utenti) ✅, Edge `console-admin` v2 ✅, **PLAN-DB-006 (CASCADE delete_tenant) ✅ eseguito il 2026-06-23** (21/21 FK con `ON DELETE CASCADE`, verificato).

---

## 2. 👉 RIPARTI DA QUI — FASE C (migliorie alla scheda azienda)

Ordine consigliato (dal più utile/atteso):

1. **FU-CONSOLE-9** — costruire gli **editor delle sezioni 🔒** della scheda azienda ("Copertura intervista nuovo cliente"): Sez.1 contatti, Sez.3 orari/fasce, Sez.5 sala/tavoli, Sez.6 menu/QR, Sez.7 aspetto. Inoltre rendere **dinamici** gli stati ✅/⬜ della mappa (oggi Sez.2/Sez.4 sono hardcoded ✅). Pianificare come **sotto-tappe** (una sezione per fase, ciclo esecutore→revisore). Alcune toccano tabelle/valori enum dell'app da ricreare lato Console.
2. **FU-CONSOLE-12** — allineare il gate UI dei 3 pannelli scrittura (`EditionSelector`/`FeatureFlagsPanel`/`RestaurantSettingsPanel`) a DEC-037: salvataggio su **tutte** le aziende, non solo sandbox. *(Verificare se F13 l'ha già chiuso: il SESSION_LOG dice F13 `0be41bf` ha tolto il gate `isSandboxTenant` dai 3 pannelli → se confermato, FU-CONSOLE-12 è solo da marcare RISOLTO e resta il cleanup FU-CONSOLE-13.)*
3. **FU-CONSOLE-15** — pulsante "togli eccezione / torna alla versione" nel pannello Feature flags (serve una action Edge `delete_tenant_feature`, no schema).

Dettaglio completo di ogni FU in `FOLLOW_UP.md`.

---

## 3. ⏳ PROMEMORIA — FASE B da fare in un secondo momento (test residui)

Non blocca la Fase C. Sono test "da cliente" non ancora provati (vedi `FOLLOW_UP.md` → TEST-RES-*):

- [ ] **TEST-RES-2** — creare un utente collegato a un'azienda (scenario 8).
- [ ] **TEST-RES-1** — accendere una funzione extra, es. menù QR (scenario 3).
- [ ] **TEST-RES-3 (solo dopo FU-CONSOLE-9)** — riprovare lo sblocco delle sezioni 🔒.
- [ ] **Extra (post PLAN-DB-006):** riprovare lo **scenario 7 con un'azienda che ha dati operativi** → ora deve eliminarla (prima dava 409).

Scenari completi in `collaborazione/richieste/REQ-004-scenari-test-cliente.md`.

---

## 4. Debito da onorare lato team Console — FU-CONSOLE-10

**Owner: team Console** (concordato con Matteo 2026-06-23: le modifiche le abbiamo sviluppate e applicate noi). Portare nei file `supabase/migrations/` del repo le modifiche oggi presenti **solo nel DB remoto TEST**:
- SQL diretto: `console_allowed_emails`, `is_console_user()`, 3 policy SELECT;
- PLAN-DB-005: policy `console_admin_select_admin_users`;
- PLAN-DB-006: 21 FK `ON DELETE CASCADE` (`plan_db_006_cascade_delete_organizations`).

⚠️ `supabase/migrations/` è **zona LOCK di Matteo**: aprire i file **in coordinamento con lui** (review + decidere cosa portare in PROD, in particolare il **CASCADE distruttivo** su `booking_requests`/`customers`/`email_logs`, dove forse conviene conservare lo storico). Vedi `STATO_AMBIENTE_TEST.md`.

---

## 5. Prerequisiti DEV (per far girare la Console in locale)

- [ ] `console/.env.local` con tutte e 4 le variabili, **inclusa** `VITE_CONSOLE_ADMIN_FUNCTION_URL` (= `https://docnnernvpyrbwuzzach.supabase.co/functions/v1/console-admin`). FU-CONSOLE-14 risolto in `.env.example`.
- [ ] `cd console && npm install && npm run dev` → login con l'email in allowlist (`matteo94cl@gmail.com` su TEST).
- [ ] `npm run build` / `lint` / `typecheck` verdi nella cartella `console/`.

---

## 6. Regole operative del branch

- **Solo TEST `docnnernvp`** per le scritture DB (canale MCP "CONSOLE"; verificare `get_project_url` prima di scrivere). Mai PROD `rwuxgvld`.
- **Git:** push solo con ok esplicito di Cristiano (regola del branch). Merge, non rebase+force.
- **Working tree attuale:** doc di collaborazione/tracciabilità aggiornate ma **non committate** (esito test + PLAN-DB-006 + questo hand-off). Committare con `fai report finale` quando Cristiano lo chiede.
- Tracciabilità totale = priorità n.1: ogni decisione in `DECISION_LOG.md`, ogni fase in `PHASE_AUDIT.md`.
