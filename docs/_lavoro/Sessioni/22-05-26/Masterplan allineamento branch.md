# Master Plan — Stabilizzazione `Sviluppo-Dashboard-laterale` + merge sicuro su `main`

> Obiettivo: arrivare a una versione stabile del branch e poter mergere su `main` con
> rollout produzione senza rompere la pagina Classica.

---

## 0. Quadro di partenza (verificato 19-05)

- Branch `Sviluppo-Dashboard-laterale`: **70 commit avanti a `main`**, working tree pulito, last commit `b33d599`.
- `npm run validate` verde: 0 lint, 0 TS, **112/112 test verdi**.
- **DB drift produzione vs TEST** (verificato via MCP):
  - **Su TEST ma NON in prod**: `022_service_slot_overrides`, `023_service_slots_max_turns_resume`, `024_n_canonical_slots`. ← queste 3 vanno applicate in prod al rollout.
  - **In prod ma NON su TEST come file**: `018_rpc_update_service_slot` + `018_rpc_update_service_slot_v2` + `020_drop_legacy_update_service_slot` (storia separata). Su TEST equivalente è `021_service_slot_rpcs_jsonb` (consolidato). NON re-applicare in prod le 018/020 — già presenti.
  - **File branch non applicato su TEST**: `019_cleanup_booking_time_slots` (`DELETE FROM restaurant_settings WHERE key='booking_time_slots'`). Idempotente, safe. Da capire se va portata in prod o se è obsoleta (chiave già rimossa).
- Punti aperti dalla revisione Fase 2 (decisi, NON ancora eseguiti):
  1. Test motore N-slot mancanti.
  2. Fallback "booking orfani" — opzione B (sezione "Fuori fascia").
  3. Cap 3 colonne con wrapping nel digest.

---

## 1. Vincoli di sicurezza non negoziabili

- **Classic = prodotto base**: ogni cliente lo vede, anche senza abbonamento. Rompere Classic = rompere tutto. Vedi `ADMIN_CLASSIC_SKILL.md`.
- **File LOCK**: `BookingCalendar.tsx`, `BookingDetailsModal.tsx`, `RestaurantSettingsTab.tsx`, `BookingForm.tsx`, `BookingsList.tsx`, `useBookingMutations.ts`, `useCustomers.ts` base, `TenantContext.tsx`, `supabase.ts`, `supabasePublic.ts`. Spiegazione preventiva a 5 punti prima di toccare.
- **DB produzione**: mai `apply_migration` senza che la stessa migrazione sia girata su TEST e validata manualmente. Mai più di una migrazione alla volta in prod.
- **Edition Classic + Pro/Enterprise**: ogni feature nuova è dietro `useFeatures()`. Verificare che il flag `booking_time_slots_enabled` non si attivi in Pro (oggi: `features.servizio ? true : flag` — già corretto).
- **Riferimento ambiente DB**: `Supabase_test__*` per TEST `docnnernvp`, `Supabase__*` per PROD `rwuxgvld`. Verificare sempre `get_project_url` prima di un apply.

---

## 2. Strategia generale

Tre fasi in sequenza, ognuna mergeable a sé. Non saltare l'ordine.

```
[A] Stabilizzazione branch  →  [B] Validazione pre-merge  →  [C] Rollout main + produzione
       (locale)                       (TEST + UAT)                  (PR + DB prod + deploy)
```

---

## 3. Fase A — Stabilizzazione branch (locale, no impatto utente)

> **Stato**: A5 (check disponibilità pubblica) verificato e funzionante ✅. A1/A2/A3 ancora aperti — decidere con il team se includerli nel merge attuale o rimandare a sprint successivo (non bloccanti per la stabilità prod).

Chiudere i 3 punti aperti dalla revisione Fase 2 prima di parlare di merge.

### A1. Test motore N-slot (no LOCK, rischio nullo)

File nuovo: `src/features/booking/utils/__tests__/capacityCalculator.test.ts`.

Coprire:
- `getStartSlotForBookingV2`: 0 fasce → `'daily'`; orario dentro 1 fascia; orario in fascia notturna (`end_time < start_time`); fasce con buchi (orario in nessuna → fallback definito da A2); 2 fasce sovrapposte → prima per `display_order`.
- `getSlotsOccupiedByBookingV2`: booking che attraversa 2 fasce; booking notturno (cross-midnight); booking fuori da qualsiasi fascia.
- `calculateDailyCapacityV2`: somma corretta per slot, gestione `slotCapacities` parziale, slot con `capacity=null` (no limite).

Output atteso: ≥10 test nuovi, tutti verdi. `npm run validate` resta verde.

### A2. Fallback "booking orfani" — opzione B (LOCK core)

**Decisione presa**: prenotazione fuori da ogni fascia → bucket `'__unassigned__'`, mostrata come sezione "Fuori fascia" nel digest, **conta solo nel limite giornaliero**, non in alcuna capacity per-fascia.

⚠️ **Spiegazione preventiva LOCK obbligatoria** (skill admin-classic §0) prima di toccare
`BookingCalendar.tsx`. Da produrre in sessione esecutiva, non qui.

Modifiche:
- `capacityCalculator.ts` — `getStartSlotForBookingV2` ritorna `'__unassigned__'` se nessuna fascia matcha (al posto del fallback "ultima fascia" attuale, riga ~73). `getSlotsOccupiedByBookingV2` invariata (gli orfani non entrano in nessun bucket di occupazione → 0 contributo capacity per-fascia: corretto).
- `BookingCalendar.tsx` — `splitDigestBySlotConfigs` mette gli orfani in `bySlot['__unassigned__']` invece di forzarli in `digestSlots[0]` (riga 416-418 attuale). Rendering: aggiungere sezione "Fuori fascia" sotto le fasce, mostrata solo se `bySlot['__unassigned__'].length > 0`. Stesso stile di una colonna fascia.
- Test (A1) coprono anche questo caso.

Coerenza capacity ↔ digest garantita (oggi divergevano). Edge case notturna risolti.

### A3. Cap 3 colonne con wrapping (LOCK core)

Modificare `BookingCalendar.tsx` (sezioni "Prenotazioni con menù" e "Solo tavolo"):
- Sostituire `style={{ gridTemplateColumns: 'repeat(${digestSlots.length}, minmax(0, 1fr))' }}` con classe statica `min-[1390px]:grid-cols-3` (Tailwind genera la classe statica).
- 4 fasce → 3 in alto + 1 sotto (grid wrappa automaticamente).
- Mobile invariato.

Spiegazione preventiva LOCK come A2 (può andare nella stessa sessione esecutiva).

### A4. Validazione locale post-A2/A3

- `npm run validate` verde.
- `npm run dev` + verifica manuale (la fai tu): toggle fasce on/off, fasce aggiunte/rimosse, prenotazione 17:00 in Aperitivo, prenotazione "orfana" (es. ore 03:00 senza fascia notturna) → sezione "Fuori fascia" visibile.
- Commit conventional: `test(capacity): copertura N-slot`, `feat(calendario): sezione Fuori fascia per booking orfani`, `feat(calendario): cap 3 colonne digest con wrapping`.

---

## 4. Fase B — Validazione pre-merge (TEST + UAT)

### B1. Verifiche manuali strutturate sul TEST ✅ COMPLETATO (22-05-26)

Su `docnnernvp` con tenant di test rappresentativi (entrambe le edition):

**Classic** (`!features.servizio`): ✅ PASSA
1. ✅ 3 fasce default → calendario digest 3 colonne, capacity per fascia coerente.
2. ✅ Aggiungi 4ª fascia → digest 4 colonne, capacity coerente.
3. ✅ Toggle `booking_time_slots_enabled = false` → sezione fasce opaca, lista piatta.
4. ✅ Toggle ON di nuovo → tutto torna come prima.
5. ✅ Booking 17:00 in Aperitivo riconosciuto correttamente.
6. ✅ Pallino assegnazione e reassegnazione visibili con colore corretto.

**Pro/Enterprise** (`features.servizio = true`): ✅ PASSA
7. ✅ Flag `booking_time_slots_enabled` ignorato (fasce sempre ON).
8. ✅ Servizio → Mappa → Assegnazione tavoli funzionante.
9. ✅ Pallino quick-assign funzionante dopo fix `onPointerDown` + `preventDefault`.

**Note B1**:
- "Limite coperti giornaliero" rimosso da UI (solo limit per-fascia resta). Walk-in limit è campo separato, correttamente visibile.
- Fix pallino commitat: `dd20cad fix(calendario): pallino assegnazione tavolo apriva dettaglio invece di QuickAssign`.

**Modifiche eseguite durante B1** (già committate):
- `daily_guest_limit` rimosso da: `RestaurantSettingsTab.tsx`, `useCapacityCheck.ts`, Edge Function `create-booking` (v3 TEST), Edge Function `check-slot-availability` (v2 TEST).
- Fix pallino digest: `onPointerDown` + `preventDefault` su span del pallino in `BookingCalendar.tsx`.

### B2. Allineamento skill DB ✅ COMPLETATO (22-05-26)

- `docs/DATABASE.md` — aggiornato con 022/023/024, decisione 019, formato registry prod.
- `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` — aggiornato con 023/024, ordine rollout.
- `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` — `is_canonical` deprecata, colonna `slot_color` documentata.

### B3. Destino 019_cleanup_booking_time_slots ✅ DECISO (22-05-26)

4 tenant prod hanno ancora la chiave `booking_time_slots` in `restaurant_settings`. La migrazione **va applicata in prod** prima del codice nuovo, nel rollout C2 (prima delle 022/023/024).

### B4. Ispezione prod read-only ✅ COMPLETATO (22-05-26)

- 4 tenant con chiave `booking_time_slots` → conferma che 019 serve in prod.
- 8 tenant × 5 slot ciascuno in `service_slots` → struttura canonical OK.
- Colonne `max_turns_resume` e `slot_color` assenti da prod → conferma che 023 e 024 vanno applicate.
- `service_slot_overrides` non esiste in prod → 022 va applicata.

---

## 5. Fase C — Rollout `main` + produzione

### C1. PR `Sviluppo-Dashboard-laterale` → `main`

- PR con descrizione che linka:
  - Report sessioni (Fase 0/1, 1.5, 2, A2/A3).
  - Migrazioni DB da applicare (022, 023, 024).
  - Verifiche manuali completate (B1 checklist).
- Code review (auto o pair).
- **NON mergere** finché non hai eseguito C2 (DB prima del codice).

### C2. Applicazione migrazioni in produzione (ordine vincolante, via MCP)

> ⚠️ Una alla volta. Validare dopo ciascuna prima della successiva. **Mai usare `supabase db push`** (non disponibile, e comunque pericoloso).

**Pre-check (read-only)**:
1. `Supabase__get_project_url` → verifica `rwuxgvld` (PROD).
2. `Supabase__list_migrations` → conferma assenza di 022, 023, 024 (status attuale).
3. Backup logico se possibile (snapshot Supabase dashboard).

**Apply ordinato**:
4. `Supabase__apply_migration` con contenuto di `supabase/migrations/022_service_slot_overrides.sql`.
   - Verifica: `Supabase__list_migrations` mostra 022.
   - Smoke check: `SELECT count(*) FROM service_slot_overrides;` (deve restituire 0).
5. `Supabase__apply_migration` con `023_service_slots_max_turns_resume.sql`.
   - Verifica colonna `max_turns_resume` presente.
6. `Supabase__apply_migration` con `024_n_canonical_slots.sql`.
   - Verifica colonna `slot_color` presente + commento aggiornato su `is_canonical`.
7. Se B3 ha confermato che 019 serve in prod: applicarla **prima** delle 022/023/024 (riguarda `restaurant_settings`, non `service_slots` — può andare in qualsiasi posizione purché idempotente). Altrimenti saltarla.
8. **Non rigenerare** `src/types/database.ts` in prod (i tipi sono nel branch, già coerenti con TEST e con il post-024).

### C3. Smoke test prod DB (read-only)

Subito dopo C2, prima di mergere il codice:
- 1-2 tenant Classic random: `SELECT * FROM service_slots WHERE tenant_id='...'` — devono ancora avere le 3 canonical + eventuali extra. Niente è stato cancellato.
- `SELECT * FROM restaurant_settings WHERE tenant_id='...' AND setting_key IN ('daily_guest_limit','slot_guest_capacities','booking_time_slots_enabled')` — `booking_time_slots_enabled` NON deve esistere ancora (verrà creato al primo salvataggio admin; il parser ritorna `true` di default).
- Conferma DB pronto per il codice nuovo.

### C4. Merge PR su `main`

- Squash merge OPPURE merge commit normale (preferenza tua). Squash dà cronologia pulita; merge commit preserva i 70 commit di lavoro.
- CI verde (lint + typecheck + test).

### C5. Deploy produzione applicazione

- Deploy Vercel/Netlify (o quello che usate) → la nuova build legge `booking_time_slots_enabled` come `true` di default per tutti i tenant esistenti = comportamento attuale 100% preservato.

### C6. Monitoring post-deploy (24-48h)

- Log Supabase: `Supabase__get_logs` su errori SQL, RLS violation, RPC failures.
- Sentry/log applicativi: errori capacity, mutation overbooking, Classic non funzionante.
- Spot-check su 3-5 tenant Classic reali random: dashboard apre, calendario mostra prenotazioni, modifiche salvabili.

---

## 6. Piano di rollback (se qualcosa va male)

### Rollback codice
`git revert <merge-commit>` su `main` + redeploy. Tornata istantanea al codice pre-merge.

### Rollback DB
Le 3 migrazioni Fase 2 sono **additive e safe** (nessun DROP, nessuna modifica colonne esistenti):
- 022: crea tabella `service_slot_overrides`. Drop tabella = rollback completo.
- 023: aggiunge colonna `max_turns_resume`. `ALTER TABLE service_slots DROP COLUMN max_turns_resume` = rollback.
- 024: aggiunge colonna `slot_color` + commento. Drop colonna + reset commento = rollback.

Script rollback da preparare PRIMA di C2 (file `supabase/migrations/_rollback_022_023_024.sql` non versionato, locale), applicabile via `Supabase__execute_sql` in emergenza.

Il vantaggio di queste migrazioni: **il codice nuovo funziona anche senza le 3 migrazioni** (gestisce gracefully assenza di `service_slot_overrides` ecc.) ma le 3 migrazioni **non rompono il codice vecchio** (campi nuovi inutilizzati). Questo dà flessibilità: si può rollback solo codice o solo DB.

---

## 7. Cosa NON fare durante questa procedura

- ❌ Non eseguire `supabase db push` (non disponibile in questo ambiente).
- ❌ Non toccare prod prima di TEST + verifiche manuali B1.
- ❌ Non mergere `main` prima di C2 (DB prima del codice, perché il codice nuovo potrebbe interrogare colonne non esistenti).
- ❌ Non riapplicare in prod le migrazioni già presenti (008-017, 018, 020, 021): produzione le ha già, anche se con versioni timestamp differenti.
- ❌ Non rinominare/eliminare migrazioni esistenti nel branch — la storia è quella, anche se TEST e PROD divergono in 018-021 (gap documentato in APP_CONTEXT_SKILL §1b).
- ❌ Non eliminare la colonna `is_canonical` ora. È deprecata funzionalmente ma serve al trigger di signup. Sarà una pulizia futura.

---

## 8. Timeline indicativa

| Fase | Stima | Quando |
|---|---|---|
| A1 Test | 1-2h | Sessione 1 |
| A2/A3 LOCK fixes | 1-2h | Sessione 2 (con spiegazione preventiva) |
| A4 Validazione locale | 30 min | Stessa sessione |
| B1 Verifiche manuali TEST | 1-2h | Sessione 3 (tu) |
| B2 Skill DB | 30 min | Sessione 3 |
| B3 Decisione 019 | 15 min | Sessione 3 |
| B4 Ispezione prod | 15 min | Sessione 3 |
| C1 PR | 30 min | Sessione 4 |
| C2 Apply DB prod | 30 min, monitorato | Sessione 4 |
| C3-C5 Smoke + merge + deploy | 1h | Sessione 4 |
| C6 Monitoring | 24-48h passive | Post-deploy |

Totale lavoro attivo: **6-8 ore** distribuite su 3-4 sessioni.

---

## 9. Checklist sintetica di partenza

- [x] A1 — Test motore N-slot scritti e verdi (15 test, sessione 22-05-26)
- [x] A2 — Sezione "Fuori fascia" implementata (sessione 22-05-26)
- [x] A3 — Cap 3 colonne con wrapping (sessione 22-05-26)
- [x] A4 — `npm run validate` verde (127/127), verifica manuale confermata da Matteo
- [x] A5 — Check disponibilità fascia pubblica: codice corretto, verificato su Pro e Classic (22-05-26)
- [x] B1 — Verifiche manuali TEST completate (Classic + Pro) — 22-05-26
- [x] B2 — Skill DB aggiornati (DATABASE.md, DB_MIGRATIONS_CONTEXT.md, DB_SCHEMA_CONTEXT.md) — 22-05-26
- [x] B3 — Decisione su 019 presa: VA APPLICATA in prod — 22-05-26
- [x] B4 — Ispezione prod read-only OK — 22-05-26
- [x] C1 — PR #1 aperta e mergiata su `main` — 22-05-26
- [x] C2 — 019, 022, 023, 024, 025 applicate in prod via MCP — 22-05-26 (nota: 025 non era nel piano originale — aggiunta perché RLS Classic bloccava service_slots)
- [x] C3 — Smoke test prod OK — 22-05-26
- [x] C4 — PR mergiata su `main` (SHA 7376b89) — 22-05-26
- [x] C5 — Deploy in produzione su Vercel attivo — 22-05-26
- [ ] C6 — 24-48h monitoring senza incidenti (in corso)
- [x] Fix post-deploy: walk-in 0-500, email/telefono opzionali — PR #2 mergiata (SHA e17bb6e) — 22-05-26
