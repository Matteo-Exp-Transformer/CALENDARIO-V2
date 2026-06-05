# Report sessione — Mappatura area Menu QR + scopo triplo skill system

**Data:** 06-06-26 · **Branch:** env/test · **Tipo:** senior / evoluzione skill system (mappatura)
**Commit:** `a22108c` (mappa Menu QR), `f97b13c` (scopo triplo nel proseguimento)

---

## Obiettivo

Mappare completamente l'area **Menu QR** col pattern del pilota Prenota (mappare + testare-per-blindare),
e — su indicazione dell'utente a metà sessione — usare la divisione contesto/procedura/codice-verità
per **snellire** lo skill system d'insieme. 2ª area dopo Prenota.

## Cosa è stato fatto

**Creata l'area `docs/Menu-QR-Skill/`** (pattern Prenota):
- `MENU_QR_SKILL.md` — entry: senso, attori (Mario/Anna), flusso cliente+dati affiancati, divieti
  voluti, sezione «parte viva» (form crea/modifica QR: cappature + messaggi-requisito), mappa.
- `contesto/MENU_QR_LAYOUT_CONTEXT.md` + `MENU_QR_DATA_FLOW_CONTEXT.md` — spostati con `git mv` dai
  vecchi `PUBLIC_MENU_*` (storia preservata), header aggiornati.
- `contesto/MENU_QR_REFERENCE.md` — il vecchio `PUBLIC_MENU_SKILL.md` (220 righe, registro tecnico)
  declassato da skill a riferimento tecnico in `contesto/` (tolto frontmatter skill).
- `contesto/MENU_QR_TEXT_LIMITS_MAP.md` — cap testo (numeri ↔ codice) + sezione «da cappare».
- `contesto/MENU_QR_TEST_SUITE_INDEX.md` — 5 file test reali verificati + buchi di copertura.
- Indice Cursor `.cursor/skills/.../SKILL.md` — puntatore Menu QR aggiornato al nuovo skill.

**Aggiornato `PROSEGUIMENTO_MAPPATURA_SKILL.md`:** sezione «LO SCOPO» (triplo: mappa + blinda +
snellisci), regola 7 (snellire è attivo), metodo provato, stato Menu QR 🔶, debiti.

## Scoperte (regola codice = verità — i report di fine maggio erano disallineati)

1. **Codice morto da rimuovere:** `content_type` (`a_la_carte`/`preset_menus`/`mixed`) + `preset_ids`
   + `PublicMenuPresetPage` + rami `showPresets` sono **irraggiungibili dall'UI** — il modale
   `MenuQrModal` forza sempre `a_la_carte`. Decisione utente: **rimuovere** (il caso «evento» è coperto
   da carosello + nome QR). Gli INC-05/06/15/16 dei report appartengono a questo codice morto → non
   fixare separatamente. Mappa di cosa togliere: `MENU_QR_DATA_FLOW_CONTEXT.md` §0.
2. **FU-MQR-1:** titoli/descrizioni categoria per-QR (`MenuQrCategoryCardsSection`, due `<input>` nudi)
   **senza cap** → cappare con `AdminFieldWithCharCount`. Punto codice: `MENU_QR_TEXT_LIMITS_MAP.md` §B.
3. **Nome QR = voluto interno** (etichetta per Mario, mai visibile al cliente). Confermato e blindato.
4. Vari INC dati «aperti» nei report sono già risolti (foto preset, titolo categoria, hidden items):
   l'utente li vede funzionare.

## Decisioni dell'utente

- Senso QR multipli: flessibilità voluta, nessun caso unico.
- INC-02 (nome QR): voluto interno → blindato.
- Codice morto preset: da rimuovere (sessione dedicata).
- FU-MQR-1: tracciare come da-cappare.
- Verifica sub-agent: **rimandata**.
- Scope sessione: **solo Menu QR oggi**; snellimento d'insieme tracciato nei debiti, non eseguito.
- Report: a fine sessione (questo file).

## Stato finale

- **Area Menu QR: 🔶 mappata, manca verifica sub-agent.**
- Commit puliti, stage selettivo: il lavoro in corso nel working tree (`MenuSelection.tsx`,
  `PresetMenuBuilder.tsx`, `caraffePricing.ts`) NON è stato toccato né committato.

## Prossimi passi (per la sessione successiva)

1. **Snellimento d'insieme** (debiti): (a) indice Cursor ~20 righe cronologia ridondante → mappa
   area→file; (b) `APP_CONTEXT_SKILL.md` 490 righe, §4 possibile duplicata → esaminare e snellire.
2. **Verifica sub-agent** Menu QR → 🔶→✅.
3. Prossima area: Admin shell / Tab Menu admin / Database.
4. **Esecuzione** debiti Menu QR: FU-MQR-1 (cap) + rimozione codice morto preset.

## Note di processo

- Pre-commit «cold check» scattato più volte (report differito = scelta voluta dichiarata, ricommit ok).
- `docs/` è in `.gitignore` ma molte sottocartelle sono tracciate da prima: i file nuovi vanno aggiunti
  con `git add -f` (coerente con `Prenota-Skill/`).

## Domande di chiusura (Q1–Q6)

❓ Q1 — Lo scope concordato è stato rispettato?
✅ R1: Sì. Mappatura Menu QR completata; snellimento d'insieme tracciato nei debiti e NON eseguito, come da confine «solo Menu QR oggi» concordato con l'utente.

❓ Q2 — Il diff corrisponde al report?
✅ R2: Sì. Commit `a22108c` (7 file area Menu QR), `f97b13c` (proseguimento), più questo report. Nessuna modifica di codice applicativo.

❓ Q3 — File correlati e skill sono allineati?
✅ R3: Sì. Indice Cursor, `PROSEGUIMENTO_MAPPATURA_SKILL.md` e memory (`project_menu_qr_mappatura` + MEMORY.md) aggiornati e coerenti.

❓ Q4 — Stato test e verifica?
✅ R4: Solo mappatura, nessun test nuovo. Verifica sub-agent rimandata (scelta utente). Le 5 suite esistenti sono inventariate in `MENU_QR_TEST_SUITE_INDEX.md`.

❓ Q5 — I debiti aperti sono tracciati?
✅ R5: Sì: FU-MQR-1 (cap titoli categoria), rimozione codice morto preset, snellimento d'insieme (indice Cursor + APP_CONTEXT), tutti in `PROSEGUIMENTO_MAPPATURA_SKILL.md`.

❓ Q6 — Il lavoro altrui nel working tree è stato protetto?
✅ R6: Sì. `MenuSelection.tsx`, `PresetMenuBuilder.tsx`, `caraffePricing.ts` NON toccati né committati (stage selettivo su ogni commit).
