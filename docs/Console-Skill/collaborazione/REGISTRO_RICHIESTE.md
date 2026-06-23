# Registro richieste — lavagna di stato (fonte di verità del flusso)

> Una riga per richiesta. È la **lavagna**: per sapere "a che punto siamo" si guarda qui.
> Stati: `BOZZA` · `DA-FARE` · `IN-SVILUPPO` · `CONSEGNATA` · `IN-TEST` · `ACCETTATA` · `RIMANDATA`.
> Dettaglio e ciclo di vita completo nel file `richieste/REQ-NNN-*.md`. Protocollo: `README.md`.

| REQ | Titolo | Priorità | Stato | Branch / commit | File |
|-----|--------|----------|-------|-----------------|------|
| REQ-001 | Vista "Tutti gli utenti" + CRUD utente | alta | IN-SVILUPPO (sviluppo ✅, attesa push) | F8 `50555f9`, F10 `f94b075`, F11 `9b2fd7f`+`ad2e619` | `richieste/REQ-001-vista-tutti-utenti-crud.md` |
| REQ-002 | Scheda focus singolo utente/azienda (setup completo) | alta | IN-SVILUPPO (tappa 1 ✅, attesa push) | F9 `6f5f4b0` | `richieste/REQ-002-scheda-singolo-utente-azienda.md` |
| REQ-003 | Crea / elimina aziende (tenant) + associazione utente | alta | IN-SVILUPPO (sviluppo ✅, attesa push) | F10 `f94b075`, F12 `abd0f74` | `richieste/REQ-003-crea-elimina-aziende.md` |

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
