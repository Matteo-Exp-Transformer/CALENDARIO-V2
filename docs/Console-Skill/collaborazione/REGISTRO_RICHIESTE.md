# Registro richieste — lavagna di stato (fonte di verità del flusso)

> Una riga per richiesta. È la **lavagna**: per sapere "a che punto siamo" si guarda qui.
> Stati: `BOZZA` · `DA-FARE` · `IN-SVILUPPO` · `CONSEGNATA` · `IN-TEST` · `ACCETTATA` · `RIMANDATA`.
> Dettaglio e ciclo di vita completo nel file `richieste/REQ-NNN-*.md`. Protocollo: `README.md`.

| REQ | Titolo | Priorità | Stato | Branch / commit | File |
|-----|--------|----------|-------|-----------------|------|
| REQ-001 | Vista "Tutti gli utenti" + CRUD utente | alta | ACCETTATA (1 test residuo: crea utente — vedi FOLLOW_UP) | F8 `50555f9`, F10 `f94b075`, F11 `9b2fd7f`+`ad2e619` | `richieste/REQ-001-vista-tutti-utenti-crud.md` |
| REQ-002 | Scheda focus singolo utente/azienda (setup completo) | alta | ACCETTATA (test residui: accendi funzione + sezioni 🔒 → FU-CONSOLE-9) | F9 `6f5f4b0` | `richieste/REQ-002-scheda-singolo-utente-azienda.md` |
| REQ-003 | Crea / elimina aziende (tenant) + associazione utente | alta | ACCETTATA | F10 `f94b075`, F12 `abd0f74` | `richieste/REQ-003-crea-elimina-aziende.md` |
| REQ-004 | Vista Ristoranti comoda (50+) + ritorno alla posizione | media | ACCETTATA | `c77bdd1` | `richieste/REQ-004-vista-ristoranti-comoda.md` (+ `REQ-004-scenari-test-cliente.md`) |

> **2026-06-23 — Cristiano (esito test):** test eseguiti nei panni di Matteo su `env/test`. **REQ-003 e
> REQ-004 → ACCETTATA** (nessun problema). **REQ-001 e REQ-002 → ACCETTATA con test residui**, rimandati a
> FOLLOW_UP: (a) creare un utente collegato a un'azienda (scenario 8 / REQ-001); (b) accendere una funzione
> extra es. menù QR (scenario 3 / REQ-002); (c) capire le sezioni 🔒 della «Copertura intervista» — chiarito:
> non è un bug, gli editor mancanti sono pianificati in **FU-CONSOLE-9**.

> **2026-06-23 — PLAN-DB-006 ESEGUITO** (autorizzato da Matteo): 21 FK verso `organizations` con `ON DELETE
> CASCADE` su TEST → `delete_tenant` elimina aziende anche con dati operativi. Debito aperto: **FU-CONSOLE-10**
> (formalizzare in file `supabase/migrations/` le modifiche applicate via MCP, incl. PLAN-DB-005/006) — **owner
> team Console**, in coordinamento con Matteo.

> **2026-06-22 — Orchestrator (sync sessione):** il branch è stato **pushato e mergiato in `env/test`**
> da Matteo (`f4a6e4b`) per il test → le 3 REQ passano da IN-SVILUPPO a **CONSEGNATA**. Ora tocca a
> Matteo: compilare l'«Esito test» di ciascuna REQ (→ ACCETTATA o RIMANDATA). Prerequisiti suoi per il
> test effettivo: **PLAN-DB-005** (lista utenti), **re-deploy Edge** `console-admin` (azioni F10),
> **PLAN-DB-006** opzionale (CASCADE delete_tenant). Nessuna REQ nuova in DA-FARE.

> **2026-06-22 — Orchestrator (ciclo F8→F12 completato):** sviluppo delle 3 REQ chiuso e committato
> sul branch (esecutore→revisore→commit, tutte 🟢). **Le REQ passano a CONSEGNATA dopo il push del
> branch** (serve ok esplicito di Cristiano). Lato Matteo restano: **PLAN-DB-005** (lista utenti),
> **re-deploy Edge** `console-admin` (PLAN-DB-003, azioni F10), **PLAN-DB-006** opzionale (CASCADE per
> `delete_tenant` su aziende con dati). Follow-up: FU-CONSOLE-9 (editor sezioni scheda), FU-CONSOLE-11
> (paginazione listUsers), FU-CONSOLE-12 (estendere a tutte le aziende i pannelli edition/feature/impostazioni).

> **2026-06-22 — Orchestrator:** master-plan eseguibile in `MASTERPLAN_CONSOLE_REQ-001-003.md`
> (fasi **F8→F12**, ciclo esecutore→revisore→commit). Read-block prima (F8/F9), write-block poi
> (F10 Edge → F11 utenti → F12 aziende). Plan DB a carico di Matteo: **PLAN-DB-005** (SELECT
> `admin_users`) e — se serve — PLAN-DB-006 (cascata delete_tenant) + ri-deploy Edge.

> **Tutte le decisioni di scope sono prese** (DEC-037..042): le 3 REQ contengono **istruzioni operative
> complete**, il Team può iniziare.
> **Ordine consigliato (DEC-042):** prima **REQ-001 (in lettura)** + **REQ-002 (scheda)** → vedere e
> configurare; poi **REQ-003** + la parte di **scrittura** di REQ-001 (crea/modifica/elimina).
>
> ⚠️ **Cambio di regola (DEC-037):** per la gestione console **RULE-2 (sandbox-only) è revocata** — si
> agisce su tutte le aziende su TEST. **RULE-1 resta**: solo TEST `docnnernvp`, mai PROD. Rete di
> sicurezza = gate allowlist + scritture via Edge + conferma "riscrivi il nome" sulle azioni distruttive.

> **Tutte le decisioni di scope sono prese** (DEC-037..042): le 3 REQ contengono **istruzioni operative
> complete**, il Team può iniziare.
> **Ordine consigliato (DEC-042):** prima **REQ-001 (in lettura)** + **REQ-002 (scheda)** → vedere e
> configurare; poi **REQ-003** + la parte di **scrittura** di REQ-001 (crea/modifica/elimina).
>
> ⚠️ **Cambio di regola (DEC-037):** per la gestione console **RULE-2 (sandbox-only) è revocata** — si
> agisce su tutte le aziende su TEST. **RULE-1 resta**: solo TEST `docnnernvp`, mai PROD. Rete di
> sicurezza = gate allowlist + scritture via Edge + conferma "riscrivi il nome" sulle azioni distruttive.

<!--
Come aggiungere una riga (Matteo):
1. Prendi il prossimo numero REQ libero.
2. Crea il file da _TEMPLATE_RICHIESTA.md → richieste/REQ-NNN-titolo.md
3. Aggiungi qui la riga con stato DA-FARE.
4. Commit + push.

Priorità suggerite: alta / media / bassa.
Il Team aggiorna "Stato" e "Branch / commit" man mano (IN-SVILUPPO → CONSEGNATA).
Matteo aggiorna a IN-TEST → ACCETTATA (o RIMANDATA).
-->

---

## Legenda rapida stati

- **BOZZA** → Matteo sta ancora scrivendo, non prendere.
- **DA-FARE** → pronta, il Team può iniziare.
- **IN-SVILUPPO** → Team al lavoro.
- **CONSEGNATA** → pushata + consegna compilata + log aggiornati → tocca a Matteo.
- **IN-TEST** → Matteo la sta provando su `env/test`.
- **ACCETTATA** → chiusa, funziona.
- **RIMANDATA** → Matteo ha trovato qualcosa: torna al Team (vedi «Esito test» nella REQ).
