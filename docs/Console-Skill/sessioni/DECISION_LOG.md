# Decision Log — branch Console (registro decisioni)

> **Append-only.** Ogni decisione non banale presa da chiunque (Cristiano, Matteo, Orchestrator,
> Esecutore, Revisore) si registra qui, con codice `DEC-NNN`. Non si riscrive la storia: una decisione
> superata si marca `SUPERATA da DEC-MMM`, non si cancella.
>
> **Scopo:** tracciabilità totale — chi ha deciso cosa, perché, con quale effetto, e dove vederne la prova.

## Campi
`ID` · `Data` · `Attore` · `Decisione` · `Motivo` · `Riferimento` (commit/file/plan) · `Stato`.

## Attori
`Cristiano` (sviluppatore) · `Matteo` (proprietario) · `Setup` (sessione 2026-06-22) ·
`Orchestrator` · `Esecutore-Fi` · `Revisore-Fi`.

---

## Registro

| ID | Data | Attore | Decisione | Motivo | Riferimento | Stato |
|----|------|--------|-----------|--------|-------------|-------|
| DEC-001 | 2026-06-22 | Cristiano | Codice Console in sottocartella **isolata `console/`** (no repo separata) | Coerente con "lavoriamo su questo branch", nessuna riconfigurazione dell'app | `CONSOLE_APP_CONTEXT.md` | attiva |
| DEC-002 | 2026-06-22 | Cristiano | Scritture **dati** solo sui tenant sandbox; **schema** sempre via *plan per matteo* | Sicurezza: niente DDL dall'agente, niente dati su tenant reali | `00_BUSSOLA_CONSOLE.md` §1 | attiva |
| DEC-003 | 2026-06-22 | Cristiano | Skill system = **istanza v0 dedicata** `docs/Console-Skill/` + **CLAUDE.md riscritto** | Regole nostre senza toccare le skill di Matteo | commit `a5bae5d` | attiva |
| DEC-004 | 2026-06-22 | Cristiano | Vocabolario: riuso parole di Matteo + **un solo** grilletto nuovo «plan per matteo» | Continuità + copre il flusso DB nuovo | `VOCABOLARIO.md` | attiva |
| DEC-005 | 2026-06-22 | Cristiano | Stile di comunicazione **didattico** (breve + «cosa cambia per te») | Cristiano impara il progetto mentre costruisce | `COMUNICAZIONE_SKILL.md` | attiva |
| DEC-006 | 2026-06-22 | Cristiano | **Commit liberi sul branch**; l'Orchestrator committa dopo ogni fase revisionata. Mai push/merge senza ok | Fluidità con controllo a fine ciclo | `HANDOFF…` §3 | attiva |
| DEC-007 | 2026-06-22 | Setup | Creati tenant sandbox **`console-classic`** / **`console-pro`** su TEST | Banco di prova senza toccare i tenant di Matteo | `PLAN-DB-001` (eseguito) | attiva |
| DEC-008 | 2026-06-22 | Matteo | Add-on (incl. Menu QR) = fonte di verità **`tenant_features`**; `qr_menu_enabled` **legacy** da ignorare | Conferma il modello reale del codice | `CONSOLE_DATA_MODEL_CONTEXT.md` §3 | attiva |
| DEC-009 | 2026-06-22 | Matteo | **«+QR»** = edition `classic` + riga `tenant_features` `qrMenu` | Mappatura versione venduta → DB | come sopra | attiva |
| DEC-010 | 2026-06-22 | Matteo | OK **Edge Function** dedicata su TEST per le scritture privilegiate (service role fuori dal browser) | Sicurezza chiave admin | `CONSOLE_APP_CONTEXT.md` §3 | attiva |
| DEC-011 | 2026-06-22 | Matteo | **Login Console** = Supabase Auth con **allowlist email** (solo Matteo) | MVP accesso, solo proprietario | — | attiva |
| DEC-012 | 2026-06-22 | Matteo | Deploy: OK proposta **Vercel root `console/`**, indirizzo `console.<dominio>`; dominio esatto da definire poi | Sblocca lo scaffolding | — | attiva (dominio TBD) |
| DEC-013 | 2026-06-22 | Cristiano+Matteo | **Standing authorization**: Matteo dà consenso a tutto «per ora». Vincolo: **tracciabilità obbligatoria** di ogni decisione/azione di Orchestrator, Esecutori, Revisori | Velocità senza perdere l'auditabilità | `TRACCIABILITA.md` | attiva |
| DEC-014 | 2026-06-22 | Orchestrator | **Master-plan a 7 fasi** (F1…F7): scomposto lo scope §4 dell'hand-off (5 fasi) separando **login reale** (F3) ed **Edge Function** (F4) in fasi proprie, prima di cambio edition/feature/impostazioni | Login ed Edge sono prerequisiti di sicurezza delle scritture (DEC-010/011): meritano fase e revisione dedicate, non un sotto-passo | `MASTERPLAN_CONSOLE.md` | attiva |
| DEC-015 | 2026-06-22 | Cristiano | **Automode pieno**: dopo la creazione del master-plan, l'Orchestrator procede col ciclo esecutore→revisore→commit senza checkpoint per fase, fermandosi solo su bivi irreversibili/fuori scope o blocchi | Velocità (coerente con DEC-013); la tracciabilità resta il contrappeso | `AskUserQuestion` 2026-06-22 | attiva |
| DEC-016 | 2026-06-22 | Esecutore-F1 | **Convenzioni scaffolding `console/`**: dev server porta **5174** (5173 è di Matteo); alias **`@console/`** (non `@/`); `postcss.config.js` locale vuoto (evita il PostCSS/Tailwind root); `isAuthenticated=false` hardcoded transitorio (auth vera in F3); `<meta robots noindex>` | Coesistenza con l'app di Matteo + sicurezza (no indicizzazione console) | `MASTERPLAN_CONSOLE.md` §F1; `console/` | attiva |

---

## Come si aggiunge una riga (per Orchestrator / Esecutori / Revisori)

1. Prendi il prossimo `DEC-NNN`.
2. Una riga = una decisione **non banale** (scelta tecnica con alternative, deviazione dal plan,
   interpretazione di un requisito, rinuncia a qualcosa). Le micro-scelte ovvie non si loggano.
3. **Riferimento** deve puntare a una prova: commit hash, file, `PLAN-DB-NNN`, o riga di `PHASE_AUDIT.md`.
4. Se la decisione cambia una precedente: la nuova entra come attiva, la vecchia → `SUPERATA da DEC-NNN`.
