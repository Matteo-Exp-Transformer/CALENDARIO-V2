# Report — Pulsante "Quando?" e modifiche a tempo delle fasce orarie

Data: 16-05-26 · Branch: `Sviluppo-Dashboard-laterale`

## Obiettivo

Quando Anna modifica i turni o i coperti di una fascia oraria (es. Colazione),
deve poter scegliere **per quanto** vale la modifica: per sempre, solo oggi,
questa settimana, o fino a fine mese. Scaduto il periodo, la fascia torna da
sola ai valori di prima — senza che nessuno debba ripristinarli a mano.

## Cosa è stato fatto (in ordine)

1. **Database (server di TEST)** — creata la tabella `service_slot_overrides`:
   ogni riga è "per questa fascia, da questa data a questa data, usa questi
   turni/coperti". Il valore base della fascia non viene toccato. Aggiunta la
   funzione `insert_service_slot_override`. Migrazione `022` scritta nel
   progetto e applicata **solo al server di test** (`docnnernvp`), non a
   produzione.

2. **Tipi del database** rigenerati dal test per includere la nuova tabella.

3. **Nuovo motore "modifiche a tempo"** (`useServiceSlotOverrides.ts`): legge
   gli override, ne crea di nuovi, e calcola — dato un giorno — quale valore
   vale davvero per quella fascia.

4. **Form di modifica fascia** (sezione Servizio): aggiunto il pulsante
   **"Quando?"**. Cliccandolo si apre un menu con *Per sempre · Solo oggi ·
   Questa settimana · Fino a fine mese*. Con "Per sempre" la fascia cambia in
   modo permanente (come prima). Con le altre opzioni la modifica vale solo nei
   giorni indicati (da oggi incluso).
   - **Avviso viola**: spiega ad Anna esattamente da che giorno a che giorno
     varrà la modifica e che poi la fascia torna ai valori base.
   - **Avviso giallo**: se quella fascia ha già una modifica a tempo attiva,
     la avverte e le spiega che, nei giorni in comune, vince quella con
     l'intervallo più corto.

5. **Lista delle fasce**: ogni fascia con una modifica a tempo attiva mostra
   ora la scritta "Modifica a tempo attiva fino al GG/MM/AAAA".

6. **Controllo prenotazioni dei clienti** (`useCapacityCheck`): quando un
   cliente prenota in un giorno in cui la fascia ha una modifica a tempo
   attiva, il sistema accetta/rifiuta sulla base del valore della modifica,
   non più del valore base. Fuori dal periodo, torna al valore base.

## Decisioni prese con l'utente

- Ripristino automatico: **override con date** (il valore base non si tocca,
  alla scadenza torna da solo) — niente job notturni.
- L'override vale per **una sola fascia**, non per tutte quelle del giorno.
- Periodo conteggiato **da oggi incluso**.
- Sovrapposizioni: **vince il più specifico** (intervallo più corto; a parità,
  il più recente).
- L'override **conta davvero** nel controllo prenotazioni dei clienti.
- Doppio avviso nel form (già attivo + come si comporterà).

## File toccati

- `supabase/migrations/022_service_slot_overrides.sql` (nuovo)
- `src/types/database.ts` (rigenerato dal test)
- `src/features/booking/hooks/useServiceSlotOverrides.ts` (nuovo)
- `src/features/booking/components/servizio/ServiceSlotsManager.tsx`
- `src/features/booking/hooks/useCapacityCheck.ts`
- `docs/APP_CONTEXT_SKILL.md` (§1b: ambiente DB = test)
- memoria `project_testing_system.md` (direttiva: sviluppo su test)

## Deviazione dal piano

In corso d'opera l'utente ha chiarito che lo sviluppo deve puntare al **server
di test**, non a produzione. La migrazione NON è stata applicata a produzione:
applicata solo al test via MCP `Supabase_test`. Skill e memoria allineati a
questa regola. Nessuna scrittura su produzione in questa sessione.

## Test

`npm run validate` → lint OK · typecheck OK · **90/90 Vitest passati**.
Nessuna regressione.

## Cosa resta per la prossima sessione

- **Test manuale dell'utente** sul server di test (richiesto da Matteo).
- Eventuale gestione "annulla una modifica a tempo" (oggi si può solo
  crearne una nuova più specifica per sovrascrivere).
- Override non ancora applicato ai **turni** in fase di assegnazione tavoli
  (`AssignmentMapPanel`) — il capacity check coperti sì, i turni no: valutare
  se serve.
- La migrazione `022` esiste solo sul test: andrà applicata a produzione
  quando la feature va live (su richiesta esplicita).
