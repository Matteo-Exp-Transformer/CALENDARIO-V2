# Report sessione — Migration Alignment Fix + Skill DB
**Data:** 2026-05-14
**Branch:** main
**Commit inizio sessione:** f814470 (checkpoint prima di migration alignment)
**Commit fine sessione:** b6544a2

---

## Obiettivi sessione

Due task in sequenza:
1. Debug e verifica del lavoro di migration alignment eseguito da un agente precedente — individuare potenziali conflitti o breakdown del DB.
2. Creazione della skill DB nel sistema skill esistente.

---

## Task 1 — Debug migration alignment

### Contesto iniziale

Un agente aveva già eseguito i repair `--status applied 001..007` (commit `450a3a6`) e documentato il risultato in `docs/DATABASE.md`. Il problema: `db push --dry-run` usciva ancora con codice 1.

### Diagnosi

`migration list --linked` mostrava:
- 7 righe locali 001–007 abbinate in Remote ✓
- 1 riga `003` locale senza Remote (doppio prefisso — limite noto)
- **6 voci "Remote only"** con naming timestamp (20260504181204–20260513010545)

La CLI blocca `db push` quando trova voci Remote senza file locale corrispondente. L'agente precedente aveva aggiunto le versioni numeriche ma **non aveva rimosso i vecchi record timestamp**.

### Fix eseguito (previo ok utente)

`repair --status reverted` sui 6 timestamp orfani:

```bash
npx supabase migration repair --status reverted 20260504181204
npx supabase migration repair --status reverted 20260504190830
npx supabase migration repair --status reverted 20260506091358
npx supabase migration repair --status reverted 20260509105711
npx supabase migration repair --status reverted 20260512175416
npx supabase migration repair --status reverted 20260513010545
```

Tutti e 6 completati con successo. Il registro remoto ora contiene solo versioni numeriche 001–007.

### Tentativo risoluzione doppio 003

`db push --dry-run` continuava a segnalare `003_menu_categories.sql` come pendente. Su richiesta utente è stato tentato `db push --include-all`:

- NOTICE: `relation "menu_categories" already exists, skipping` → tabella intatta
- ERROR: `duplicate key on schema_migrations_pkey` → PK violation su versione `003`

**Conclusione:** falso positivo **irrisolvibile** senza rinominare i file (LOCK). La tabella esiste, il DB è integro. Le future push (008+) non sono impattate.

### Stato migration list finale

```
 Local | Remote | File
-------|--------|------
 001   | 001    | 001_schema_completo.sql
 002   | 002    | 002_rls_admin_users.sql
 003   | 003    | 003_fix_tenant_usage_triggers_security_definer.sql
 003   |        | 003_menu_categories.sql  ← falso positivo permanente
 004   | 004    | 004_default_menu_categories_new_organization.sql
 005   | 005    | 005_menu_items_booking_types.sql
 006   | 006    | 006_customers_crm.sql
 007   | 007    | 007_tables.sql
```

Nessuna riga "Remote only". `db push` funziona per migrazioni future.

### Documentazione aggiornata

`docs/DATABASE.md` aggiornato con:
- Storico dei 6 repair `--status reverted`
- Spiegazione del falso positivo 003 e del fallimento di `--include-all`
- Workaround per future push

### Commit Task 1

| Hash | Messaggio |
|------|-----------|
| `450a3a6` | `docs(db): documenta migration alignment repair 001-007` *(agente precedente)* |
| `3cb4b64` | `docs(db): documenta limite doppio-003 e repair timestamp orfani` |

---

## Task 2 — Skill DB

### Struttura creata

Seguendo il pattern delle skill esistenti (ADMIN_SHELL_SKILL + UI_EDIT_SKILL):

```
docs/Database-Skill/
├── DB_SKILL.md               ← entry point con routing context e invarianti
├── DB_SCHEMA_CONTEXT.md      ← schema completo 001-007, funzioni, trigger, RLS
└── DB_MIGRATIONS_CONTEXT.md  ← stato migrazioni, workflow, storico, template
```

**DB_SKILL.md** — entry point leggero. Tabella di routing verso i due context file in base al sottotask (schema/RLS vs migrazioni/push). Invarianti globali DB: ogni tabella deve avere `tenant_id`, RLS abilitata, policy `admin_*`, trigger `enforce_*_tenant`.

**DB_SCHEMA_CONTEXT.md** — schema completo di tutte le 10 tabelle del progetto con colonne, vincoli, indici, note RLS. Funzioni SQL (`current_admin_tenant_id`, `check_admin_email`, trigger functions). Mappa completa trigger per tabella. Pattern RLS standard da copiare. Nota FK senza indice (debt noto).

**DB_MIGRATIONS_CONTEXT.md** — snapshot stato migrazioni 001-007, workflow per nuova migrazione (numerica progressiva), storico alignment da timestamp a numerico, comandi utili CLI, naming convention, template SQL completo per nuova tabella con tenant isolation (da copiare per 008+).

### Aggiornamento APP_CONTEXT_SKILL.md

Aggiunta riga nella tabella di routing skill 0:

```
| DB / schema / migrazioni / RLS / policy / tabelle / trigger / tipi database.ts
| docs/Database-Skill/DB_SKILL.md |
```

Aggiunta anche riga per task cross-area (DB + UI o DB + shell).

### Commit Task 2

| Hash | Messaggio |
|------|-----------|
| `b6544a2` | `feat(docs): aggiunge skill DB con schema, migrazioni e context` |

---

## Stato repo fine sessione

- Branch: `main`, 19 commit avanti rispetto a `origin/main` (non pushato)
- Working tree: pulito
- DB remoto: allineato, `db push` funzionale per 008+
- Sistema skill: 3 skill attive (admin-shell, ui-edit, db) tutte raggiungibili da APP_CONTEXT_SKILL

## Decisioni rilevanti

- `--status reverted` (non `--status applied`) per i timestamp orfani: corretto perché quei record non hanno file locali — non devono essere tracciati come "applicati" dalla CLI.
- Falso positivo `003_menu_categories.sql` documentato ma non forzato — tentativo con `--include-all` ha confermato che è irrisolvibile (PK violation), mentre ha anche confermato che la tabella esiste intatta nel DB.
- Template in `DB_MIGRATIONS_CONTEXT.md` riusa `update_updated_at()` già esistente nel DB — non da ridefinire nelle nuove migrazioni.

## Lavori aperti

| Priorità | Lavoro |
|----------|--------|
| Media | Servizio F2 — turni pranzo/cena (richiede design schema) |
| Media | Analytics F2 — dati da Servizio |
| Bassa | No-show — status `no_show` su prenotazione |
| Bassa | `send-email` Edge Function mancante |
