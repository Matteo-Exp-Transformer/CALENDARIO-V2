# Prompt per agente esecutore

Copia il blocco sottostante e incollalo in una nuova sessione di Claude Code (modello consigliato: **Opus 4.7**, fast mode opzionale).

---

## PROMPT DA INCOLLARE

```
Sei l'agente esecutore di un plan strutturato per il progetto CalendarBackup-v2.

CONTESTO
- Branch: main, working tree pulito, validazione verde.
- Tutta la pianificazione (audit, ricerca concorrenza, decisioni utente) è in:
  docs/Sessioni di lavoro/13-05-26/01-Report-decisioni-13-05-26.md
- Il plan operativo dettagliato è in:
  docs/Sessioni di lavoro/13-05-26/02-Plan-esecutivo-F2-F3.md
- Convenzioni e zone delicate del progetto: .claude/CLAUDE.md e docs/CLAUDE.md
- Skill files attivi: docs/Dashboard-laterale-skill/, docs/Database-Skill/, docs/per-ui-design-skill/

LETTURA OBBLIGATORIA PRIMA DI INIZIARE (in quest'ordine)
1. docs/Sessioni di lavoro/13-05-26/01-Report-decisioni-13-05-26.md (sintesi)
2. docs/Sessioni di lavoro/13-05-26/02-Plan-esecutivo-F2-F3.md (esecuzione)
3. .claude/CLAUDE.md e docs/CLAUDE.md (invarianti)
4. docs/Database-Skill/DB_SKILL.md → DB_SCHEMA_CONTEXT.md (per migrazioni 008, 009)
5. docs/Dashboard-laterale-skill/ADMIN_SHELL_SIDEBAR_SKILL.md (sezione 0 — anti-pattern UUID, Tailwind v4)
6. Lista file delle migrazioni: supabase/migrations/

ESECUZIONE
Esegui le fasi 0 → 4 in sequenza. Dopo ogni fase: commit + npm run validate + breve aggiornamento all'utente.

USO DEI SUB-AGENT (Sonnet)
Spawna due sub-agent Sonnet, IN PARALLELO, per le fasi più isolate:
- Sub-agent A (description: "Implementazione mappa Servizio"): esegue FASE 2 in worktree isolato. Riceve in input solo il file 02-Plan-esecutivo-F2-F3.md (sezione FASE 2) + reference a useRooms.ts (creato da te in FASE 1). Compiti: aggiungere @dnd-kit, creare i 4 componenti mappa (RoomTabs, RoomConfigModal, TableMap, TableShape), refactor ServizioPage a 2 tab. NON deve toccare DB né altre pagine.
- Sub-agent B (description: "Implementazione briefing PDF + walk-in"): esegue le sotto-parti walk-in e briefing della FASE 4 (componenti WalkInModal, ShiftBriefingModal, hook useWalkInMutation, useShiftBriefing, helper shiftBriefingPdf). NON deve toccare AdminHomePage (il merge dei pulsanti nella shell lo fai tu).

Tu (agente principale) esegui direttamente:
- FASE 0 (cleanup): operazioni piccole su file diversi, sequenziali.
- FASE 1 (migrazione 008 + useRooms): coordinazione DB + tipi.
- FASE 3 (migrazione 009 + Analytics): include modifica BookingDetailsModal + useBookingMutations (cross-feature).
- FASE 4 integrazione: prendi i componenti del Sub-agent B e li monti in AdminHomePage + banner pending alert + CSS @media print in index.css.

REGOLE DURE
- LOCK invariati: CollapsibleCard.tsx, Modal.tsx, TenantContext.tsx, supabase.ts, migrazioni 001-007, router.tsx.
- Migrazioni applicate via MCP Supabase apply_migration, NON via supabase db push (falso positivo doppio-003).
- Dopo ogni apply_migration: npm run db:types:linked + rimozione eventuali (supabase as any).
- Tailwind v4: sintassi short bg-(--token), classi statiche.
- logger.* mai console.*.
- supabase autenticato per admin, supabasePublic per public form.
- UUID per campi audit, mai email.
- QUERY_KEY esportato dalla sorgente.
- npm run validate verde prima di ogni commit.

OUTPUT FINALE ATTESO
- 6 commit sequenziali (uno per fase: cleanup, migrazione 008, mappa, migrazione 009, analytics, home).
- File di report finale in docs/Sessioni di lavoro/13-05-26/04-Report-esecuzione-finale.md con:
  - Commit hash per ogni fase
  - File creati / modificati
  - Bug incontrati e fix applicati
  - Stato finale npm run validate
  - Eventuali deviazioni dal plan con motivazione

DOMANDE ALL'UTENTE
Una sola decisione richiede conferma utente prima di partire:
- FASE 0 task 5: switch da `created_at` a `confirmed_start` in useAnalytics.ts. Chiedi conferma all'utente; se sì, applica con coalesce `confirmed_start ?? desired_date`; se no, lascia invariato e documenta nel report.

Per il resto: il plan è completo, non chiedere conferme su scope o architettura — sono già state prese tutte le decisioni nel report 01-Report-decisioni-13-05-26.md.

Quando hai finito, segnala all'utente che il revisore (sessione separata) verificherà il lavoro.
```

---

## Note per l'utente (chi orchestra)

1. **Modello esecutore**: Opus 4.7. I sub-agent Sonnet sono dichiarati nel prompt.
2. **Quando l'agente avrà finito**, torna in **questa** sessione (o aprine una nuova) e dimmi "Revisiona il lavoro". Io spawnerò 2 sub-agent Sonnet di revisione:
   - **Reviewer A**: audit codice (stesso pattern dell'audit già fatto in questa sessione).
   - **Reviewer B**: verifica gap vs plan eseguito (cosa è stato fatto, cosa manca, deviazioni).
3. **Branch consigliato**: l'agente può lavorare direttamente su `main` (working tree pulito) OPPURE creare un branch `feat/f2-f3-servizio-analytics-home` se preferisci PR-flow. Decidi prima di lanciare il prompt.
4. **Cost guard**: 6 fasi + sub-agent in parallelo = circa 60-120k token. Tieni monitorato.
