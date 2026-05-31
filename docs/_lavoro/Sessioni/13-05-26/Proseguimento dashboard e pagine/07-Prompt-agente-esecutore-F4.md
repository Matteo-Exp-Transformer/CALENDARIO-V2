# Prompt agente esecutore — F4

Incolla questo blocco in una nuova sessione Claude Code (modello: **Opus 4.7**).

---

## PROMPT DA INCOLLARE

```
Sei l'agente esecutore per CalendarBackup-v2.

STATO REPO
Branch: main, working tree pulito, ultimo commit 3305f5d.
Validazione verde: lint ✓ · typecheck ✓ · 29/29 test ✓.

CONTESTO DEL PROGETTO
- Stack: React 18 + Vite + TS + Tailwind v4 + Supabase + TanStack Query
- Documentazione:
  - Convenzioni e zone delicate: .claude/CLAUDE.md e docs/CLAUDE.md
  - Plan da eseguire: docs/Sessioni di lavoro/13-05-26/06-Plan-esecutivo-F4.md
  - Decisioni prese: docs/Sessioni di lavoro/13-05-26/05-Report-decisioni-F4.md

COSA È GIÀ IMPLEMENTATO (non toccare senza motivo)
- AdminShell: sidebar 4 voci + routing state-based
- Home F1+F2: stat card oggi, prossime 3h, alert pending, walk-in, briefing turno
- CRM: CRUD completo clienti con soft-delete
- Servizio F1: CRUD tavoli per sala (Lista)
- Servizio F3: mappa drag-and-drop @dnd-kit con sale configurabili
- Analytics F1+F2+tasso occupazione: KPI completi, delta vs periodo prec., shift filter
- DB: migrazioni 001–009 applicate (rooms, tables con coordinate, source+no_show)

ORDINE DI ESECUZIONE
Esegui nell'ordine esatto:

0. MICRO-TASK NO-SHOW END-TO-END (~30 min)
   - Trovare il componente con il pulsante "no-show" nel pannello calendario
   - Verificare che la mutation aggiorni booking_requests.no_show = true e invalidi le query
   - Test manuale: prenotazione → accetta → no-show → Analytics noShowRate aggiornato
   - Commit: fix(calendario): no-show end-to-end

1. F4a — SCHEMA DB + PRESET SIGNUP
   - Creare migrazione 010_service_slots.sql (vedi plan)
   - Creare migrazione 011_booking_table_assignments.sql (vedi plan)
   - Applicare entrambe via MCP Supabase apply_migration (NON db push)
   - Trovare la funzione/query di creazione tenant e aggiungere INSERT 5 fasce preset
   - Rigenera: npm run db:types:linked
   - Commit: feat(db): service_slots + booking_table_assignments (migrations 010-011) + preset signup

2. F4b — CRUD FASCE ORARIE
   - Creare src/features/booking/hooks/useServiceSlots.ts (QUERY_KEY esportato)
   - Creare componente ServiceSlotsManager con modal create/edit/delete
   - Alert non vincolante se fascia fuori orario business_hours
   - Aggiungere la UI alla pagina Servizio (sotto la mappa o in tab dedicato)
   - Commit: feat(servizio): CRUD fasce orarie (service_slots) con alert orario apertura

3. F4c — MAPPA ASSIGNMENT
   - Creare src/features/booking/hooks/useTableAssignments.ts
   - Aggiornare MappaTab: selettore data + fascia, panel laterale prenotazioni draggabili
   - DroppableTable con colori stato (free/assigned/checked_out) e badge nome+coperti
   - Logica turni: turn_number = max+1, verifica max_turns, toast se esauriti
   - "Libera tavolo": update checked_out_at = now()
   - DnD separato dal riposizionamento tavoli (contesti DndContext distinti)
   - Commit: feat(servizio): mappa assignment prenotazione→tavolo con stati live e check-out

DOPO OGNI FASE
- npm run validate (lint + typecheck + test)
- Commit solo se validazione verde

INVARIANTI GLOBALI (rispetta sempre)
- LOCK: CollapsibleCard, Modal, TenantContext, supabase.ts, migrazioni 001-009, router.tsx
- Tailwind v4: classi statiche, sintassi bg-(--token). Mai classi dinamiche costruite con template literal.
- logger.* mai console.*
- supabase (autenticato) per operazioni admin, supabasePublic per public form
- QUERY_KEY esportato dalla sorgente del hook
- Migrazioni via MCP Supabase apply_migration (non supabase db push — falso positivo su migrazione 003)
- UUID per campi audit, mai email
- Nessun commento banale: commenti solo per il PERCHÉ

ARCHITETTURA DECISA (non deviare)
- service_slots: end_time può essere < start_time (fascia notturna che passa mezzanotte)
- booking_table_assignments: tabella separata, UNIQUE(table_id, service_slot_id, date, turn_number)
- max_turns: NULL = infinito, 0 = fascia chiusa (nessun tavolo disponibile)
- business_hours in restaurant_settings: NON toccare — separato dalle fasce di servizio
- DnD: due DndContext separati (riposizionamento tavoli ≠ assignment prenotazioni)
```

---

## Note per l'utente

- **Sub-agent**: per F4a e F4b puoi usare sub-agent Sonnet per le migrazioni e gli hook (operazioni definite), tenendo Opus per la UX di F4c.
- **Micro-task 0** è rapido: se il pulsante no-show funziona già correttamente, il commit è opzionale.
- **Fascia notturna**: la logica `end_time < start_time` è implementata solo nell'utility helper `slotCrossesMidnight()` — non serve query complessa al DB per ora (le query filtrano per `date` = giorno scelto e l'utente gestisce manualmente la notturna).
