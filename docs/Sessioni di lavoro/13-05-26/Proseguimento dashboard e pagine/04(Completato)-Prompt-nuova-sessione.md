# Prompt nuova sessione — Planning F3+ / nuove feature

Incolla questo blocco in una nuova sessione Claude Code (modello: **Opus 4.7**).

---

## PROMPT DA INCOLLARE

```
Sei l'agente di planning per CalendarBackup-v2.

STATO REPO
Branch: main, working tree pulito, ultimo commit b867820.
Tutte le fasi del plan F2-F3 sono completate e committate (6 commit + fix debug).
Validazione verde: lint ✓ · typecheck ✓ · 29/29 test ✓.

CONTESTO DEL PROGETTO
- Stack: React 18 + Vite + TS + Tailwind v4 + Supabase + TanStack Query
- Documentazione completa:
  - Convenzioni e zone delicate: .claude/CLAUDE.md e docs/CLAUDE.md
  - Skill admin shell: docs/Dashboard-laterale-skill/ADMIN_SHELL_SIDEBAR_SKILL.md
  - Skill DB: docs/Database-Skill/DB_SKILL.md
  - Routing skill: docs/APP_CONTEXT_SKILL.md
  - Report sessioni precedenti: docs/Sessioni di lavoro/12-05-26/ e 13-05-26/

COSA È GIÀ IMPLEMENTATO (non toccare senza motivo)
- AdminShell: sidebar 4 voci + routing state-based
- Home F1+F2: stat card oggi, prossime 3h, alert pending, walk-in, briefing turno
- CRM: CRUD completo clienti con soft-delete
- Servizio F1: CRUD tavoli per sala (Lista)
- Servizio F3: mappa drag-and-drop @dnd-kit con sale configurabili
- Analytics F1+F2: KPI (totali, coperti, conferma, avg party, no-show, Booked By),
  delta vs periodo precedente, toggle turno pranzo/cena, range week/month/year
- DB: migrazioni 001–009 applicate (rooms, tables con coordinate, source+no_show)

UNICO PUNTO APERTO DAL PLAN PRECEDENTE
- **Tasso occupazione** in Analytics: la card mostra "—". Richiede
  `rooms.capacity × num_days` come denominatore. Dati disponibili: `useTables()`,
  `useRooms()`, bounds del periodo da `getCurrentPeriodBounds()` in useAnalytics.ts.
  Non blocca nulla — includi come prima micro-task oppure proponi di saltare.

IL TUO COMPITO
1. Leggi i file di documentazione sopra elencati per avere il contesto completo.
2. Chiedi all'utente quali nuove feature vuole pianificare (non assumere scope).
3. Conduci il planning con domande mirate come fatto nelle sessioni precedenti:
   - Scope per fase (F1/F2/F3)
   - Schema DB se necessario (nuove migrazioni)
   - Decisioni UX chiave
   - Ordine di esecuzione
4. Produci i deliverable nella cartella docs/Sessioni di lavoro/<data>/:
   - Report decisioni
   - Plan esecutivo fase per fase
   - Prompt per agente esecutore (con istruzioni sub-agent se applicabile)

CANDIDATI FEATURE (suggerimenti, l'utente decide):
- Tasso occupazione Analytics (micro-task, ~30 min)
- Booking→tavolo assignment: collegare prenotazioni accettate ai tavoli nella mappa
  (stato live verde/arancio/rosso — posticipato dal plan F3)
- Servizio F2: turni pranzo/cena (schema da progettare)
- No-show sulle prenotazioni normali nel pannello calendario (già implementato il
  pulsante, verificare funzionamento end-to-end)
- Notifiche real-time (Supabase Realtime) per nuove prenotazioni
- Export CSV/PDF delle prenotazioni
- Public booking page: miglioramenti UX form prenotazione
- send-email Edge Function (mancante, flussi email falliscono silenziosamente)

INVARIANTI GLOBALI (rispetta sempre)
- LOCK: CollapsibleCard, Modal, TenantContext, supabase.ts, migrazioni 001-009, router.tsx
- Tailwind v4: classi statiche, sintassi bg-(--token)
- logger.* mai console.*
- supabase autenticato per admin, supabasePublic per public form
- QUERY_KEY esportato dalla sorgente
- Migrazioni via MCP Supabase apply_migration (non db push — falso positivo 003)
- UUID per campi audit, mai email
```

---

## Note per l'utente

- Questa sessione è di **planning puro**: l'agente NON deve eseguire codice, solo pianificare e fare domande.
- Il tasso occupazione è piccolo: se vuoi risolverlo subito puoi farlo in questa stessa sessione prima del planning principale.
- Quando il plan è pronto, userà il prompt per agente esecutore come nelle sessioni precedenti (Opus 4.7 + sub-agent Sonnet).
