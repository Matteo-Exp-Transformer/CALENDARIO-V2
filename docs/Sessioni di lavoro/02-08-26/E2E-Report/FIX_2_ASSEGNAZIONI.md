# FIX-2 — Turni, fallimento muto e archiviazione al checkout

> Sessione 02-08-26 · Branch `env/test` · Prompt FIX-2 (S4-BUG-2, S4-REQ-3, S4-UX-8)
> Nessun commit / push · Nessuna scrittura PROD

---

## Esito

Codice e test pronti; `npm run validate` **verde**.

**Blocco operativo:** la migrazione `066` è nel repo ma **non ancora applicata su TEST** — il token MCP Supabase TEST risulta `Unauthorized` (anche dopo `mcp_auth`). `get_project_url` risponde correttamente `docnnernvpyrbwuzzach`, ma `apply_migration` / `execute_sql` / Management API falliscono. Serve che Matteo rinnovi il token in `.cursor/mcp.json` (o applichi a mano lo SQL in Dashboard TEST) e poi si segni la migration come applied.

---

## Cosa è cambiato (effetto per il ristoratore)

### A — Tavolo verde che rifiutava (S4-BUG-2)

- Nella modale **Assegna tavolo** ogni tavolo mostra i **turni residui**.
- Se i turni sono finiti: badge **«Turni esauriti»**, non si seleziona in multi-select; un click deliberato apre **Assegna comunque**.
- Se la fascia è chiusa (`max_turns = 0`): messaggio distinto **«La fascia è chiusa: riaprila…»** (banner + toast), non più confuso con i turni.
- **Annulla** subito dopo un’assegnazione: cancella la riga (non la “chiude”). Così non brucia un turno. Non viola il modello append-only dei turni davvero serviti.

### B — Liberare il tavolo archivia (S4-REQ-3)

- Al checkout normale la prenotazione viene marcata **servita** (`served_at`) e **esce dal cassetto** «da assegnare». I dati restano per le statistiche (niente tabella archivio nuova).
- Quattro casi:
  1. Checkout / Libera tavolo → **archivia**
  2. Annulla (undo) → **non** archivia, torna disponibile
  3. Libera e assegna / release da Calendario → **non** archiviano la scavalcata
  4. Tavolata multi-tavolo → archivia solo quando si libera l’**ultimo** tavolo
- Se la riassegni dopo: `served_at` torna vuoto (errore staff reversibile).

### C — Forzatura invisibile (S4-UX-8)

- Prima di mostrare il riquadro ambra, la modale **Assegna tavolo** si chiude. Non serve più premere Annulla per cliccare «Assegna comunque» / «Libera e assegna».

---

## File toccati

| Area | File |
|------|------|
| Motore | `useTableAssignments.ts` — `FasciaChiusaError`, undo DELETE, `served_at` al checkout |
| Util | `tableTurnLimits.ts` (nuovo), `unassignedBookingsFilter.ts` |
| UI | `AssignmentMapPanel.tsx` — residui, badge, `openForceConfirm` |
| Tipi | `booking.ts`, `database.ts` (`served_at`) |
| DB | `supabase/migrations/066_booking_requests_served_at.sql` |
| Skill | `ADMIN_SERVIZIO_CONTEXT.md` §9.4/§9.6, `DB_MIGRATIONS_CONTEXT.md` |
| Test | `tableTurnLimits.test.ts`, `useTableAssignments.fix2.test.ts`, `AssignmentMapPanel.fix2.test.tsx`, aggiornati appendOnly + unassigned filter |

---

## Migrazione 066

```sql
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS served_at timestamptz;
```

| Ambiente | Stato |
|----------|--------|
| File in repo | ✅ |
| TEST `docnnernvp` | ❌ **non applicata** (token MCP scaduto) |
| Tipi TS | ✅ aggiornati a mano (equivalente a `db:types:linked` per questa colonna) |
| PROD | non toccata |

**SQL da applicare su TEST** (Dashboard SQL o MCP dopo rinnovo token): contenuto di `066_booking_requests_served_at.sql`, poi eventuale `migration repair --status applied 066 --linked` se usi il registro CLI.

---

## Test automatici

| Gruppo | Esito |
|--------|--------|
| Turni residui / fascia chiusa / undo non consuma | ✅ `tableTurnLimits` |
| 4 casi archiviazione + undo DELETE + fascia chiusa + clear served_at | ✅ `useTableAssignments.fix2` (10) |
| UI «Turni esauriti» prima del fallimento + forzatura senza chiudere a mano | ✅ `AssignmentMapPanel.fix2` (2) |
| Regressione append-only / occupancy / fine turno | ✅ |
| `npm run validate` | ✅ verde |

---

## Da riprovare a mano (dopo migrazione su TEST)

1. Fascia con `max_turns = 2`: assegna → libera → riassegna → al terzo turno la modale deve già dire **Turni esauriti** (tavolo ancora verde/libero).
2. Click deliberato → compare **Assegna comunque** senza dover chiudere la modale.
3. Chiudi fascia (`max_turns = 0`) → messaggio «fascia chiusa», non «turni esauriti».
4. Checkout → prenotazione sparisce dal cassetto; Annulla subito dopo assegna → torna nel cassetto; Libera e assegna → la scavalcata torna nel cassetto.
5. Tavolata su 2 tavoli: libera uno → resta in «Assegnate»; libera il secondo → fuori dal cassetto.

---

## Lettura della sessione

Il difetto muto era un disallineamento UI/motore (conteggio turni vs colore tavolo) più un layering della modale. La decisione di lasciare il conteggio com’è e anticipare l’avviso in UI è quella giusta. L’archiviazione con `served_at` distingue checkout da undo/force senza una tabella nuova. Unico debito: applicare 066 su TEST appena il token MCP è di nuovo valido.
