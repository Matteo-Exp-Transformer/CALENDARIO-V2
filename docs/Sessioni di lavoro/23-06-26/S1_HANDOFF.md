# S1 — Handoff (Tipologia prenotazione + durata config)

> **Stato:** ✅ BUILD COMPLETA 23-06-26 — **non committata** (su `env/test`). Attende `fai report finale`.
> **Predecessore:** S0 ✅ · **Successore:** S2 (motore durata / resolver).
> **Leggi:** `S1_PLAN.md` (§6bis decisioni CHIUSE) + `S1_BASELINE_MAP.md` (mappa) in questa cartella.

## Cosa è stato fatto
- **Nessuna migrazione DB.** Tutto vive nel JSONB `restaurant_settings` (chiavi
  `booking_public_form_config` + `booking_custom_staff_presets`).
- **Tipi:** `SubTab.duration?` (card + carosello), `BookingMode.default_duration?`,
  `CustomStaffPreset.default_duration?` — tutti opzionali (assente = comportamento invariato).
- **Parser/normalizer difensivi e simmetrici** (campo escluso dallo spread, riscritto solo se valido —
  stesso lock di `capabilities`). Helper condivisi in `src/features/booking/constants/bookingDurationLimits.ts`
  (`BOOKING_DURATION_MIN=30`, `MAX=360`, `parseBookingDuration`, `clampBookingDuration`).
- **UI:** `DurationPicker` locale in `BookingFormConfigPanel.tsx` (90/120/150/180 + "Altro" libero,
  clamp 30–360, opzionale) su editor card, editor carosello, editor tipologia.
- **Preset:** solo tipo + parser + schema Zod. **Nessuna UI in `MenuPricesTab` → M3 NON riaperta.**
- **Test:** `bookingPublicFormConfig.test.ts` esteso (durata valida/fuori range/assente/carosello/mode).
- **Verifica:** `npm run validate` ✅ 122 file / 991 test. typecheck + lint puliti dopo cleanup
  (limiti Zod importati dalle costanti, non più hardcoded).

## File toccati
- `src/features/booking/constants/bookingDurationLimits.ts` *(nuovo)*
- `src/features/booking/constants/bookingPublicFormConfig.ts`
- `src/features/booking/constants/presetMenus.ts`
- `src/features/booking/lib/restaurantSettingRegistry.ts`
- `src/features/booking/components/settings/BookingFormConfigPanel.tsx`
- `src/features/booking/constants/__tests__/bookingPublicFormConfig.test.ts`
- doc: `docs/MASTERPLAN_SERVIZIO.md` §7, questa cartella `23-06-26/`

## Debiti / note per S2
- **UI durata preset** rinviata (oggi solo tipo+parser): si farà quando si riapre l'area che edita i
  preset, o come FU dedicato. Il gradino "eredità da preset" della gerarchia è dormiente: in S1 la card
  porta la propria durata.
- **`resolveBookingDuration()`** (override > card > preset > tipologia > default, pavimento = minimo
  fascia) è il cuore di **S2** — i campi che gli servono ora esistono tutti.
- `clampBookingDuration` e `parseBookingDuration` hanno logica quasi identica (signature diverse per
  chiarezza API) — lasciato intenzionalmente; eventuale collasso in S2 se serve.

## Contaminazione git (eredità S0, ancora valida)
`env/test` contiene anche il lavoro console F8-F12 (non S1). **Quando si committa S1** (`fai report
finale`) includere SOLO i file S1 elencati sopra, non i `docs/Console-Skill/*`.

*Aggiornato 23-06-26 (orchestratore Opus). Branch `env/test`.*
