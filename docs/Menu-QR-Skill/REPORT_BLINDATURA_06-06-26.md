# Report — Blindatura di prodotto Menu QR (06-06-26)

> Esecuzione del piano `PLAN_BLINDATURA_MENU_QR.md` da parte di un orchestratore Opus + sub-agent.
> Branch `env/test`. Stato finale: **Menu QR ✅ blindato di prodotto** (criterio §5 del plan, verde).

---

## 1. Decisioni di Matteo (Fase A — intervista)

| Tema | Decisione |
|---|---|
| Eyebrow slide vuota | **Lascia vuoto** (nessun fallback «Specialità della casa»). Doc allineata al codice. |
| Nome locale assente | **Ripiego «Menu»** (letterale, neutro). Marcato voluto in doc. |
| Footer data/ora | **Voluto, di sistema** — non configurabile. Marcato in doc. |
| Ordine piatti dentro categoria | **Buco** → nuovo follow-up **FU-MQR-2** (lavoro futuro, fuori blindatura). |
| Cap titolo card categoria | **30** caratteri. |
| Cap descrizione card categoria | **70** caratteri. |
| Codice morto preset | **Rimuovere tutto**, codice + colonne DB (Matteo: «in prod non ho clienti»). |

## 2. Cosa è stato fatto

**Rimozione codice morto preset** (provata irraggiungibile: `MenuQrModal.buildPayload` salvava sempre
`content_type: 'a_la_carte'` e non scriveva mai `preset_ids`):
- Cancellato `src/pages/PublicMenuPresetPage.tsx` + route `…/preset/:presetId` (`router.tsx`).
- `PublicMenuPage.tsx`: rimossi `usePublicPresets`, rami `showPresets`/`showCart`, sezione preset, prop
  `presets` di `MenuNavTabs`, tipo `MenuNavTabItem` semplificato. Resta il solo flusso categorie.
- Rimossi `content_type`/`preset_ids` da `menu.ts`, `database.ts` (blocco `menu_qr_codes`),
  `MenuQrModal.tsx`, `useMenuQrCodes.ts`, `menuQrAppearance.ts`.
- **DB:** migrazione `043_drop_menu_qr_preset_columns.sql` (DROP colonne + CHECK). Verificato su **PROD**
  (`rwuxgvld`) e **TEST** (`docnnernvp`) read-only: 0 righe `content_type != 'a_la_carte'`, 0 preset.
  Applicata su TEST; QR di test intatto dopo il drop.

**FU-MQR-1 — cap titoli/descrizioni categoria:**
- Costanti `QR_CATEGORY_TITLE_MAX = 30`, `QR_CATEGORY_DESCRIPTION_MAX = 70` in `MenuHomepageConfigPanel.tsx`.
- Due `<input>` nudi → `AdminFieldWithCharCount` (contatore + `maxLength` + taglio difensivo).
- Test: `menuQrCategoryFieldCap.test.tsx` (3 test: valori + taglio a 30/70).

**Fix da controtest responsive:** `line-clamp-2` ai due `<h2>` titolo della card categoria
(con/senza foto) — copre il fallback `menu_categories.label` che non ha cap.

## 3. Controtest sub-agent — esiti

Due sub-agent read-only in parallelo (riportano, non fixano). Esiti riverificati dall'orchestratore.

**Sub-agent FLUSSO DATI (coerenza admin→pubblico):** nessun bug bloccante. Ogni campo salvato ha un
consumatore pubblico (o è voluto interno, es. nome QR); zero residui preset vivi in `src/`; parse non
dipende più da `content_type`; fallback non inventano dati; cap 30/70 applicati; sul QR reale TEST
nessun override eccede i cap. Distinzione preset-QR vs preset-Prenota netta (Prenota non toccato).

**Sub-agent FLUSSO UTENTE + RESPONSIVE** — tabella per viewport:

| Viewport | Esito | Note |
|---|---|---|
| **375px** | ⚠️→✅ | Unico finding: titoli card senza troncamento difensivo (fallback `menu_categories.label` senza cap). **Risolto** con `line-clamp-2`. |
| **834px** | ✅ pulito | Griglia 2 col, wrapper 1024, carosello, card OK. |
| **1280px** | ✅ pulito | Colonna 1024 centrata, header sticky categoria OK, stati vuoti corretti. |

Altri controlli OK: tab sticky overflow-x + frecce ≥700px; pallini carosello 44px; griglia 1→2 col a
520px; nessun `<Link>` verso route preset (zero); stati vuoti reali («Menu in preparazione»).

## 4. Verifica finale (parent)

- Suite Menu QR mirata: **6 file, 41 test verdi** (inclusi i 3 nuovi del cap).
- `npm run typecheck`: **verde**. `npm run lint`: **verde** (0 warning).
- `npm run validate` (lint+typecheck+test): **48 file, 419 test, verde**.

> **Nota lavoro parallelo:** durante la sessione un altro agente lavorava su Pagina Prenota
> (`MenuSelection.tsx`, `PresetMenuBuilder.tsx`, `caraffePricing.ts`). NON toccati né stagati. La suite
> completa è risultata verde: nessun rumore di Prenota da isolare al momento della verifica.

## 5. Follow-up aperto

- **FU-MQR-2** — ordine piatti dentro la categoria, configurabile per-QR (oggi segue il magazzino).
  Lavoro grosso (dati + form), fuori dalla blindatura. Tracciato in `MENU_QR_SKILL.md` §5.

## 6. Doc aggiornata allo stato reale

`MENU_QR_SKILL.md` (§2-bis, §3, §3-bis, §4, §5, §6) · `contesto/MENU_QR_DATA_FLOW_CONTEXT.md`
(§0,§2,§3,§5,§6,§7,§9,§10) · `MENU_QR_TEXT_LIMITS_MAP.md` (A,B) · `MENU_QR_REFERENCE.md` (migrazioni,
pagine, modale, RULE) · `MENU_QR_TEST_SUITE_INDEX.md` · `MENU_QR_LAYOUT_CONTEXT.md` (§3,§5) ·
`PROSEGUIMENTO_MAPPATURA_SKILL.md` (stato + debiti).
