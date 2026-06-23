# S1 — Plan: Tipologia prenotazione + durata config *(Classic — Settings/Personalizza Form)*

> **Governato da:** `docs/MASTERPLAN_SERVIZIO.md` §7 (S1) + decisioni D11, D12, D13, D35, [Q7]→Opzione A.
> **Predecessore:** S0 ✅ chiusa (vedi `docs/Sessioni di lavoro/22-06-26/S0_ORCHESTRATOR_HANDOFF.md`).
> **Stato:** ⬜ apertura cantiere (23-06-26). Branch da creare: `s1/durata-config`.

---

## 1. Scopo (e confine netto con S2)

S1 fa **solo configurazione e storage** della durata. Aggiunge l'attributo *durata* a tre livelli e
la UI per impostarlo in **Settings → Personalizza Form**. **NON** costruisce il calcolo.

- ✅ **In S1:** campo durata su card / preset / tipologia + UI picker + parser/normalizer + test.
- ❌ **NON in S1 (→ S2):** la funzione `resolveBookingDuration()` (override > card > tipologia >
  default, pavimento = minimo fascia), `service_slots.min_duration`, `turnover_buffer_minutes`,
  snapshot sulla prenotazione, auto-attivazione permanenza. S1 prepara solo i *dati* che S2 userà.

## 2. Modello durata (gerarchia da [Q7]→Opzione A)

La durata «del livello scelto» si risolve così (la **risoluzione** è S2; S1 crea solo i campi):

1. **Card** (`SubTab.duration`) → se presente, vince.
2. **Preset linkato** (`CustomStaffPreset.default_duration`) → ereditato se la card non ha durata.
3. **Tipologia** (`BookingMode.default_duration`) → default base se né card né preset hanno durata.
4. **Default ristorante** → fallback finale. *(Probabile S2 — vedi domanda Q-S1-3.)*

Coerente con **D12** (il cliente sceglie solo la card) e **D35** (la card comanda, anche se più corta).

## 3. Cosa esiste già (riuso) — da verificare in mappa

- `SubTab` e `BookingMode` in `src/features/booking/constants/bookingPublicFormConfig.ts` (parser
  `parseSubTabFromUnknown`, normalizer `normalizeBookingPublicFormConfig`).
- `CustomStaffPreset` in `src/features/booking/constants/presetMenus.ts`.
- UI editor card/tipologia in `src/features/booking/components/settings/BookingFormConfigPanel.tsx`
  (pattern già pronto: input `price_per_person` ~riga 1172, gestione `is_fixed_menu`).
- Pattern campi opzionali con clamp/normalize già consolidato (es. `price_per_person`, limiti testo).

**Ipotesi forte da confermare:** card/preset/tipologia vivono nel JSON `booking_public_form_config`
dentro `restaurant_settings` → **nessuna migrazione DB**, solo parser + normalizer + UI. Se vero, S1
è additivo e a basso rischio.

## 4. Da costruire

1. Tipo: `duration?: number` (minuti) su `SubTab`; `default_duration?: number` su `CustomStaffPreset`
   e su `BookingMode`. Tutti **opzionali** (assente = nessuna durata = comportamento odierno).
2. Parser: leggere il campo in modo difensivo (numero > 0 e dentro min/max, altrimenti `undefined`).
3. Normalizer: clamp ai limiti di sicurezza al salvataggio; mai scrivere default se assente.
4. UI: picker durata **90 / 120 / 150 / 180 + "Altro"** (D13) con min/max, nell'editor card e nella
   tipologia in Personalizza Form. Etichette in italiano semplice (no "permanenza"/"durata 120 min"
   verso il cliente — ma questa è UI **admin**, gergo admin ok: «Durata tavolo»).
5. Test unit su parser/normalizer (durata valida, fuori range, assente, ereditarietà non risolta qui).

## 5. Rischi / può rompersi

- **#2 Regressione M4 (Settings, blindata):** S1 riapre Personalizza Form → **controtest obbligatorio
  suite `settings-*`** (`*.settingsM4.adminBlindatura.test.tsx`).
- **Menu (M3, blindata):** se la durata tocca le card/preset condivisi con il menu → controtest
  `menu-magazzino` se la mappa conferma l'incrocio.
- **Default libero (invariante §2 masterplan):** nessuna durata configurata ⇒ niente regressione,
  resta il cap morbido per-fascia odierno. Verificare che assenza campo = comportamento identico.

## 6. Domande per l'intervista-di-sezione (da chiudere con Matteo PRIMA della build)

- **Q-S1-1 — Min/max di sicurezza durata?** D13 dice picker 90/120/150/180 + "altro" con min/max, ma i
  valori non sono fissati. Proposta: min 30, max 360 (6h). Confermare.
- **Q-S1-2 — Durata anche sulla tipologia in UI, o solo su card+preset in S1?** [Q7] mette la durata
  sulla card con eredità dal preset; la tipologia (`default_duration`) è il 3° gradino. Decidere se il
  campo tipologia entra già in S1 o se in S1 bastano card+preset (tipologia rimandata).
- **Q-S1-3 — "Default ristorante" (durata media unica, L2-lite §6) è S1 o S2?** Probabile S2 (fallback
  del resolver), ma se Matteo vuole già il campo "durata media" in Classic va deciso ora.
- **Q-S1-4 — Avviso "card < tipologia"?** Per D35 NON è un blocco; opzione futura morbida. Confermare
  che in S1 non si costruisce alcun avviso.

## 6bis. Decisioni intervista — CHIUSE (Matteo, 23-06-26)

- **Q-S1-1 / M-S1-D → limiti:** durata 30 min – 360 min (6h). Picker rapido 90/120/150/180 + "Altro"
  con valore libero, **nessun arrotondamento** (solo clamp min/max).
- **Q-S1-2 → tipologia: SÌ.** `BookingMode.default_duration` con UI picker in Personalizza Form.
- **Q-S1-3 / M-S1-C → preset: SOLO tipo + parser.** `CustomStaffPreset.default_duration` aggiunto a
  tipo + parser + schema Zod, **NESSUNA UI in `MenuPricesTab`** → **non si riapre M3**. La UI preset
  è rimandata (S2/S3 o FU). Il gradino "eredità da preset" resta dormiente in S1: copre la card.
- **M-S1-A → carosello: SÌ, opzionale.** `duration` presente anche sulle SubTab `display==='carousel'`,
  sempre opzionale.
- **Q-S1-4 → avviso card<tipologia: NO.** Non si costruisce in S1 (regola D35 deterministica).

### Ambito build risultante (cosa tocca davvero S1)
- Tipo + parser + normalizer per: `SubTab.duration` (card **e** carosello), `BookingMode.default_duration`.
- Tipo + parser + schema Zod per `CustomStaffPreset.default_duration` (**senza UI**).
- UI picker durata in `BookingFormConfigPanel.tsx`: editor card, editor carosello, editor tipologia.
- **Non toccare** `MenuPricesTab.tsx` né altri file area Menu.

## 7. Sequenza (ciclo blindatura: intervista → mappa → test → blindatura)

- **Fase 1 — MAPPA (read-only, esecutore):** confermare JSONB/no-migrazione, mappare i punti esatti
  di parser/normalizer/UI, elencare le micro-decisioni per l'intervista. Output: `S1_BASELINE_MAP.md`.
- **Fase 2 — INTERVISTA (orchestratore + Matteo):** chiudere Q-S1-1..4.
- **Fase 3 — BUILD (esecutore):** tipi + parser + normalizer + UI picker.
- **Fase 4 — TEST + CONTROTEST:** unit nuovi + suite `settings-*` (+ menu se serve) verdi; `npm run validate`.
- **Fase 5 — DOC + BLINDATURA:** aggiornare `ADMIN_SERVIZIO_CONTEXT.md` / contesto Personalizza Form,
  stato S1 nel masterplan §7, handoff.

## 8. Verifica / sicurezza

- `npm run validate` verde a fine build. Suite M4 verde dopo riapertura Settings.
- Nessuna scrittura PROD in S1 (è config client + JSONB; nessun deploy Edge).
- Se per qualunque motivo emergesse una migrazione: `get_project_url` prima, `docnnernvp`=TEST ok,
  `rwuxgvld`=PROD → STOP/conferma Matteo. `supabase db push` vietato.

---

*Creato 23-06-26 (orchestratore Opus). Prossimo passo: Fase 1 mappa.*
