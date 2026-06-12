# Report diagnosi WP-B5 — apply TEST migrazione 048

Data: 12-06-26  
Branch: `env/test`  
Esito: 🔶 bloccato su apply TEST: CLI vede `docnnernvp`, MCP no.

**Cosa è cambiato:** nessuna modifica a DB o codice; la diagnosi del blocco TEST è più precisa.  
**Cosa resta:** applicare/verificare `048_schedule_rate_limits_cleanup.sql` su TEST appena MCP ha accesso al progetto.  
**Serve una tua azione:** sì — allineare/autorizzare il connettore MCP Supabase anche sull'organizzazione TEST.

## 1. Obiettivo

Indagare l'accesso al DB TEST Supabase `docnnernvpyrbwuzzach` e, se sicuro, applicare/verificare la migrazione `048_schedule_rate_limits_cleanup.sql`.

## 2. Verifiche eseguite

| Controllo | Esito |
|---|---|
| Branch | `env/test` |
| Working tree iniziale | pulito |
| MCP `get_project_url` su TEST | fallito: `You do not have permission to perform this action` |
| MCP `list_projects` | vede solo PROD `rwuxgvldzrkabglkasym`, org `obubohenzsmhmppqriat` |
| MCP `list_organizations` | vede solo org PROD `calendarioV.2` |
| CLI `npx supabase projects list -o json` | vede TEST `docnnernvpyrbwuzzach`, org `ytrppzjekipjubnygaos`, status `ACTIVE_HEALTHY`, `linked: true` |
| CLI `npx supabase orgs list -o json` | vede solo org TEST `Matteo Test` |
| CLI `npx supabase functions list --project-ref docnnernvpyrbwuzzach -o json` | vede `create-booking` active e legacy `check-slot-availability` active |
| CLI `npx supabase migration list --linked` | legge il remoto TEST; remote arriva a `20260612111433`, `048` non risulta applicata |

## 3. Diagnosi

Il problema non è progetto rimosso e non è TEST offline: la CLI vede il progetto TEST, la sua organizzazione, le Edge Function e il registro migrazioni remoto.

Il blocco è una divergenza di autenticazione tra strumenti:

- **CLI Supabase**: autenticata sull'organizzazione TEST `ytrppzjekipjubnygaos`.
- **MCP Supabase**: autenticato sull'organizzazione PROD `obubohenzsmhmppqriat` e senza permessi su TEST.

Per questo non ho applicato SQL remoto via CLI: le regole di sessione chiedono `get_project_url` prima di qualunque SQL remoto, e quel controllo fallisce proprio sul progetto target.

## 4. Stato DB

- **TEST `docnnernvpyrbwuzzach`**: `048_schedule_rate_limits_cleanup.sql` non applicata/verificata in questa chat.
- **PROD `rwuxgvldzrkabglkasym`**: non toccato in questa chat; stato precedente invariato, 048 già applicata/verificata il 12-06-26.
- **Edge Function legacy TEST**: `check-slot-availability` risulta ancora deployata e active; non rimossa perché il task opzionale richiede motivazione e comando sicuro, e il blocco principale resta DB/MCP.

## 5. Blocco operativo preciso

Per chiudere WP-B5 serve uno di questi sblocchi:

1. Autorizzare il connettore MCP Supabase sull'organizzazione TEST `ytrppzjekipjubnygaos`, poi ripetere `get_project_url` su `docnnernvpyrbwuzzach`.
2. Oppure autorizzare esplicitamente in una prossima sessione un canale SQL CLI equivalente, accettando che il check ambiente sia fatto con `projects list`/link CLI invece che con MCP `get_project_url`.

Senza uno di questi due passaggi WP-B5 resta 🔶.

## 5b. Decisione procedurale

La distinzione è utile come procedura operativa attuale:

- **TEST**: CLI ammessa per diagnostica e, con conferma esplicita, per SQL dopo checklist ambiente (`projects list`, org, host, `project-ref`, `migration list --linked`).
- **PROD**: MCP soltanto, lettura salvo conferma esplicita prima di qualunque scrittura.
- **Sempre vietato**: `supabase db push`.

Limite da ricordare: CLI `db query` esegue SQL, ma non equivale a MCP `apply_migration` sul registro; prima di usarla per migrazioni va dichiarata la strategia di registrazione/verifica.

## 6. QA

- `npm run typecheck` eseguito in questa sessione: OK.
- `npm run validate` non eseguito: non ho toccato codice runtime né schema locale; la modifica è solo documentale/diagnostica.

## 7. Dati comunicazione

- Prompt Matteo: richiesta senior DB/Supabase, profilo Verifica + Fix operativo, target TEST, divieto `db push`, commit+push se docs aggiornate.
- Correzione iniziale: primo giro fermato su branch `main`; Matteo ha confermato che ora siamo su `env/test`, poi esecuzione ripresa.
- Decisione agente: non forzare apply via CLI perché avrebbe violato la salvaguardia `get_project_url` prima dello SQL remoto.

## 8. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1: «Sei agente senior DB/Supabase. Profilo: Verifica + Fix operativo. Modalità: standard. Branch obbligatorio: `env/test` — se sei su altro branch, fermati. Obiettivo: indagare e risolvere il problema di accesso al DB TEST Supabase `docnnernvpyrbwuzzach`, poi completare WP-B5 applicando/verificando la migrazione `048_schedule_rate_limits_cleanup.sql` su TEST.»; «siamo su env/test. procedi»; «soluzione può essere allineare documentazione procedurale per specificare di usare cli per DB test e mcp per prod? è una distinzione operativa utile?».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.  
✅ R2: Sì. Verificati branch `env/test`, MCP `get_project_url` TEST permission denied, MCP projects/orgs solo PROD, CLI projects/orgs/functions/migration list su TEST, file `048_schedule_rate_limits_cleanup.sql`, docs DB e report WP-B5.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).  
✅ R3: Allineati `AGENTS.md`, `.claude/CLAUDE.md`, `APP_CONTEXT_SKILL.md`, `DB_SKILL.md`, `DB_MIGRATIONS_CONTEXT.md`, `DATABASE.md`, `MASTERPLAN_ALLINEAMENTO.md`, `FOLLOW_UP.md`, `SESSION_LOG.md`, report WP-B5 originale e questo report diagnosi.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?  
✅ R4: Non ho applicato la migrazione 048 su TEST perché MCP `get_project_url` sul target fallisce e la procedura non autorizzava SQL CLI senza conferma/strategia registro. Non ho toccato PROD e non ho rimosso la Edge Function legacy TEST.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?  
✅ R5: Attrito principale: le docs dicevano “MCP TEST” ma gli accessi reali erano split: MCP solo PROD, CLI solo TEST. Miglioria applicata: procedura con fallback CLI TEST, checklist ambiente, divieto CLI PROD e nota sul registro migrazioni.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?  
✅ R6: Contesto giusto per task DB: APP_CONTEXT, DB_SKILL, DB_MIGRATIONS_CONTEXT, DATABASE, masterplan/FU/report WP-B5. Hook pre-commit utile: ha bloccato il report incompleto prima del commit.
