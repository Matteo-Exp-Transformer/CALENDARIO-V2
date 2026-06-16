# WP-D3 — Preparazione potatura `ADMIN_CLASSIC_SKILL.md`

**Data:** 12-06-26  
**Branch verificato:** `env/test` ✅  
**Agente:** sub-agent WP-D3 (sola lettura codice + bozza doc)  
**File originale:** `docs/ADMIN_CLASSIC_SKILL.md` — **INTATTO** (in attesa ok Matteo)  
**Bozza potata:** `docs/_lavoro/Per matteo/AL-D/ADMIN_CLASSIC_SKILL-potatura-bozza.md`

---

## 1. Before / after — §4

### Cosa resta in §4 (bozza)

| Blocco | Contenuto |
|--------|-----------|
| Intestazione | Puntatore a `SESSION_LOG.md`; rimando esplicito a §4b (orari) e §4c (layout) |
| AdminDashboard | AdminShell, `bodyOverride` / `onBodyOverrideExit`, collapse form Prenotazioni, eccezione padding Calendario → §4c |
| BookingCalendar | Gating `features.walkIn` / `features.servizio`, `useServiceSlots` + `useDigestSlotConfigs`, digest + `QuickTableAssignModal`, layout → §4c |
| BookingDetailsModal | No-show gated, `BookingDangerActionModal`, `PastStartTimeWarningModal`, `useDigestSlotConfigs` |
| useBookingMutations | Invalidazioni analytics/home (no-op Classic), garanzia `desired_time` → §4b |
| RestaurantSettingsTab | Fasce Classic-only, `useUpdateServiceSlot`, `OVERNIGHT_TIME_END_HINT`, placement areas rimosse da Impostazioni |
| AdminBookingForm + DetailsTab | Placement Pro-only; promo in `DetailsTab` via `booking_menu_promos` |
| useCapacityCheck | Priorità `max_guests` → `slot_guest_capacities` |
| Hook fasce | `useServiceSlots` + `useDigestSlotConfigs` (query condivisa) |
| AdminHomePage + useHomeStats | `start_time` stringa HH:mm |
| PastStartTimeWarningModal | Flusso UX orario passato (3 entry point) |
| Check disponibilità pubblica | EF `create-booking` + `check-slot-availability`, hook `useCheckSlotAvailability` |

**§4b, §4c, §0–§3, §5:** invariati (copiati verbatim dalla skill originale).

### Cosa si rimuove o comprime — e PERCHÉ

| Elemento rimosso/compresso | Motivo |
|----------------------------|--------|
| `Branch Sviluppo-Dashboard-laterale rispetto a main:` | Branch **non esiste** più nel repo (`git branch -a` senza match). Contesto merge storico, non operativo per agenti |
| Tutte le date inline (`19-05-26`, `23-05-26`, `06-06-26`, `22-05-26`) nel corpo §4 | Changelog sessione; duplica `SESSION_LOG.md` e §4c. Lo stato vivo va descritto senza timeline |
| `useCanonicalTimeSlots()` (3 occorrenze) | Simbolo **assente** in `src/` — sostituito da `useServiceSlots()` + `useDigestSlotConfigs()` |
| Bullet «`useCanonicalTimeSlots()` in `useServiceSlots.ts`: non ridefinisce più la queryFn…» | Documenta refactor completato; il wrapper non c'è più |
| Dettaglio changelog digest 19-05 (`DigestBookingListRow` senza prop `slot`, classi CSS…) | Rumore storico; i componenti restano citati in forma compatta se ancora nel codice |
| «Layout UI 23-05-26: vedi §4c» ripetuto inline su più bullet | Un solo rimando a §4c nell'intestazione + per componente |
| «Promo menù: `menuPromoMessages` a `MenuTab` da `BookingDetailsModal`» | **Obsoleto**: `MenuTab` non riceve più `menuPromoMessages`; promo in `DetailsTab` via `resolveMenuPromoLabelsForBooking` |
| `canonicalSlotIds` null (tenant pre-migrazione 016) | Simbolo **assente** in `src/`; logica migrata |
| «Bug Home risolto» come voce separata | Compresso nel bullet AdminDashboard (`bodyOverride`) |
| Paragrafo lungo A5 check disponibilità con dettaglio overlap/query | Comportamento **ancora vero** ma compresso a 3 righe (EF + hook); dettaglio algoritmo non serve in skill LOCK |
| Blocco **Riferimento completo** con 3 path report | **2 path su 3 inesistenti** (vedi tabella simboli); sostituito da solo `SESSION_LOG.md` |

**Righe §4:** originale ~23 bullet densi + 3 link report → bozza ~11 sottosezioni strutturate (~45 righe operative vs ~25 righe changelog + ridondanze).

---

## 2. Testo completo bozza potata

File completo: [`ADMIN_CLASSIC_SKILL-potatura-bozza.md`](./ADMIN_CLASSIC_SKILL-potatura-bozza.md)

### Diff sezione per sezione (solo parti toccate)

#### §4 — PRIMA (estratto chiave)

```markdown
Branch `Sviluppo-Dashboard-laterale` rispetto a `main`:

- **BookingCalendar.tsx**: … Usa `useCanonicalTimeSlots()` … **Novità 19-05-26**: …
- **useCanonicalTimeSlots()** in `useServiceSlots.ts`: non ridefinisce più la queryFn …
- **BookingDetailsModal.tsx**: … **Promo menù (23-05-26):** … `menuPromoMessages` a `MenuTab` …
- **RestaurantSettingsTab.tsx**: … se `canonicalSlotIds` è null (tenant pre-migrazione 016) …
**Riferimento completo**: `docs/Sessioni di lavoro/15-05-26/...` … `19-05-26/...` … `22-05-26/...`
```

#### §4 — DOPO (estratto chiave)

```markdown
Snapshot del comportamento **oggi** sui file LOCK … Per orari DB → **§4b**; per layout → **§4c**.

### `BookingCalendar.tsx`
- Orari fasce: `useServiceSlots()` + `useDigestSlotConfigs()` …

### Fasce orarie — hook condiviso (`useServiceSlots.ts`)
- `useDigestSlotConfigs()`: mappa gli slot in `SlotConfig[]` … **nessuna query DB aggiuntiva**.

### `AdminBookingForm.tsx` + `DetailsTab.tsx`
- Promo menù in dettaglio: `DetailsTab` risolve etichette da `booking_menu_promos` …
```

#### §4b, §4c, §0–§3, §5

Nessuna modifica rispetto all'originale.

---

## 3. Tabella simboli / path verificati vs morti

Verifica: `rg` in `src/` (sola lettura), `glob` su `docs/` per report citati. Branch: `git branch -a`.

| Simbolo / path citato in §4 originale | Esito | Note |
|---------------------------------------|-------|------|
| `useCanonicalTimeSlots` | ❌ **MORTO** | 0 match in `src/`; usare `useServiceSlots` + `useDigestSlotConfigs` |
| `useServiceSlots` | ✅ Vivo | `src/features/booking/hooks/useServiceSlots.ts` |
| `useDigestSlotConfigs` | ✅ Vivo | Stesso file, L162+ |
| `canonicalSlotIds` | ❌ **MORTO** | 0 match in `src/` |
| `bodyOverride` / `onBodyOverrideExit` | ✅ Vivo | `AdminDashboard.tsx` |
| `DigestBookingListRow` / `DigestSlotHeader` | ✅ Vivo | Funzioni interne `BookingCalendar.tsx` |
| `QuickTableAssignModal` | ✅ Vivo | `QuickTableAssignModal.tsx` |
| `menuPromoMessages` → `MenuTab` | ❌ **MORTO** | Promo ora in `DetailsTab` + `resolveMenuPromoLabelsForBooking` |
| `booking_menu_promos` / `menuPromo.ts` | ✅ Vivo | Registry + `DetailsTab` |
| `MenuSelection` | ✅ Vivo | Usato in form pubblico/admin, non nel bullet promo obsoleto |
| `HOME_STATS_QUERY_KEY` / `ANALYTICS_QUERY_ROOT` | ✅ Vivo | `useHomeStats.ts`, `useAnalytics.ts`, `useBookingMutations.ts` |
| `useUpdateServiceSlot` | ✅ Vivo | `useServiceSlots.ts` |
| `OVERNIGHT_TIME_END_HINT` | ✅ Vivo | `bookingTimeSlots.ts`, `RestaurantSettingsTab.tsx` |
| `useCreateAdminBooking` | ✅ Vivo | `useAdminBookingRequests.ts` |
| `PastStartTimeWarningModal` / `isWallClockStartBeforeNow` | ✅ Vivo | Componente + `dateUtils.ts` |
| `BookingDangerActionModal` | ✅ Vivo | `BookingDetailsModal.tsx` |
| `useCheckSlotAvailability` | ✅ Vivo | `useCheckSlotAvailability.ts` + `BookingRequestForm` |
| `supabase/functions/create-booking/index.ts` | ✅ Vivo | |
| `supabase/functions/check-slot-availability/index.ts` | ✅ Vivo | |
| `Branch Sviluppo-Dashboard-laterale` | ❌ **MORTO** | Nessun branch locale/remoto |
| Report `15-05-26/.../Report-unificazione-fasce-orarie-canoniche.md` | ❌ **PATH MORTO** | 0 file in `docs/` |
| Report `19-05-26/Report-pallino-assegnazione-tavolo.md` | ❌ **PATH MORTO** | 0 file in `docs/` |
| Report `22-05-26/Report-A5-check-disponibilita-fascia-pubblica.md` | ❌ **PATH MORTO** | 0 file in `docs/` |
| Report `23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md` | ✅ Vivo | Citato solo nel changelog rimosso |
| `SettingsTab.tsx` / `BookingForm.tsx` / `BookingsList.tsx` | ❌ **MORTO** | Già annotato in §1 originale (corretto, 0 file) |
| `CONTROLLA_ORARIO-PRENOTAZIONI.test.ts` | ✅ Vivo | §4b invariato |

---

## 4. Grep rimandi entranti e impatto

Comando: `rg "ADMIN_CLASSIC_SKILL" docs --glob "!Sessioni di lavoro/**"`

### Rimandi a §4 specifico (fuori Sessioni di lavoro)

| File | Rimando | Impatto potatura |
|------|---------|------------------|
| `docs/APP_CONTEXT_SKILL.md` L65 | §4c layout Calendario | ✅ **Nessuno** — §4c invariato |
| `docs/APP_CONTEXT_SKILL.md` L71 | §4b orari | ✅ **Nessuno** — §4b invariato |
| `docs/APP_CONTEXT_SKILL.md` L482 | sezione «stato attuale» (§4) | ✅ **OK** — §4 resta, più corta e aggiornata; `bodyOverride` e collapse conservati |
| `docs/APP_CONTEXT_SKILL.md` L498 | §4 + §4b per mutation orario | ✅ **OK** — `desired_time` / invalidazioni ancora in §4 + §4b |
| `docs/per-ui-design-skill/UI_EDIT_SKILL.md` L30 | §4c | ✅ Nessuno |
| `docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md` L4 | skill generale | ✅ Nessuno |
| `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` | §0 skill | ✅ Nessuno |
| `docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` L78 | skill intera | ✅ Nessuno |
| `docs/SESSION_LOG.md` L212 | «ADMIN_CLASSIC_SKILL §4» layout | ⚠️ **Nota**: link generico a §4; dopo potatura il dettaglio layout è ancora in §4c — nessun link rotto |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-D3 task | Non aggiornato per mandato |

### Rimandi che citavano contenuti ora rimossi

Nessun file **fuori Sessioni di lavoro** punta esplicitamente a:
- `useCanonicalTimeSlots`
- branch `Sviluppo-Dashboard-laterale`
- i 3 path report morti

I report in `docs/Sessioni di lavoro/` citano §4 storico — **archivio**, non skill viva; nessuna azione richiesta alla potatura.

---

## 5. In attesa di ok file-per-file

| File | Azione proposta | Stato |
|------|-----------------|-------|
| `docs/ADMIN_CLASSIC_SKILL.md` | Sostituire con contenuto di `ADMIN_CLASSIC_SKILL-potatura-bozza.md` | ⏳ **In attesa ok Matteo** |

**Non toccati (per mandato):** `src/`, `supabase/`, `scripts/`, `MASTERPLAN_ALLINEAMENTO.md`, commit/push.

---

## 6. Cosa applicare quando Matteo dice ok

1. **Copia approvata:** sovrascrivere `docs/ADMIN_CLASSIC_SKILL.md` con `docs/_lavoro/Per matteo/AL-D/ADMIN_CLASSIC_SKILL-potatura-bozza.md` (o `diff` se Matteo chiede solo §4).
2. **Verifica post-applicazione:**
   ```bash
   rg "useCanonicalTimeSlots|Sviluppo-Dashboard-laterale|canonicalSlotIds|menuPromoMessages" docs/ADMIN_CLASSIC_SKILL.md
   # atteso: 0 match
   rg "ADMIN_CLASSIC_SKILL" docs --glob "!Sessioni di lavoro/**"
   # spot-check: §4b §4c ancora referenziati da APP_CONTEXT
   ```
3. **SESSION_LOG:** opzionale 1 riga «WP-D3 potatura §4 ADMIN_CLASSIC_SKILL» (solo se Matteo lo chiede in chiusura sessione).
4. **MASTERPLAN:** aggiornare WP-D3 a ✅ solo su comando esplicito (fuori scope questo sub-agent).
5. **Bozza in `_lavoro`:** tenere come audit trail o eliminare dopo merge — scelta Matteo.

---

## 7. Summary esecutivo

- Branch `env/test` confermato; file vivo **non modificato**.
- §4 originale è changelog 15-05 → 06-06 con **simboli morti** (`useCanonicalTimeSlots`, `canonicalSlotIds`, `menuPromoMessages`, branch merge) e **3 link report rotti**.
- Bozza: §4 diventa snapshot operativo per componente; §0–§3, §4b, §4c, §5 intatti.
- Rimandi `APP_CONTEXT_SKILL` a §4 / §4b / §4c **restano validi**; nessun aggiornamento obbligatorio ad altri file doc.
- Prossimo passo: **ok Matteo** → applicare bozza su `docs/ADMIN_CLASSIC_SKILL.md`.
