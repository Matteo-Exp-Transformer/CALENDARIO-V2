# Revisione — Prenota menù / sottotab fix (05-06-26)

**Verdetto: ✅ APPROVATO**

**Data revisione:** 05-06-26  
**Revisore:** agente Verifica (TESTING_SKILL §7)  
**Report esecutore:** [Report-prenota-menu-sottotab-fix-05-06-26.md](./Report-prenota-menu-sottotab-fix-05-06-26.md)  
**Branch:** env/test — working tree non committato  
**Commit:** n/a (non committato)

---

## 1. Gate automatico

| Check | Esito |
|-------|-------|
| `npm run validate` (lint + typecheck + Vitest) | **OK** — 412 test, 46 file, 0 errori |

---

## 2. Diff vs report esecutore

| Atteso (report) | Verificato |
|-----------------|------------|
| 12 file, +79/−24 | **OK** — `git diff --stat` coincide |
| 412 test Vitest | **OK** |
| `BookingRequestPage.tsx` non toccato | **OK** |
| `useCreateBookingRequest` non toccato | **OK** |
| 7 file `src/` (5 codice + 2 test) + 5 docs | **OK** — elenco file allineato |

File codice toccati: `buildPresetMenuSelection.ts`, `BookingRequestForm.tsx`, `MenuSelection.tsx`, `BookingSubTabCards.tsx`, `bookingCapabilities.ts` + test correlati.

---

## 3. QA manuale (Pagina Prenota)

**Ambiente:** dev server locale (`npm run dev`), DB TEST (`docnnernvpyrbwuzzach`).  
**Slug richiesto:** `test-pro` (`.env.local.test`) → **tenant assente/inattivo** (406 su `organizations_public`).  
**Slug usato:** `trattoria-da-tommaso` — tipologia `menu_prezzo_fisso` con card `display:'cards'` e casi reali:
- card manuale senza `preset_id` (`ew vbve22b…`)
- card preset fisso (`ewrwerwer`, preset staff)
- card personalizzabile (`wow`, `is_fixed_menu: false`)

**Nota Fix 1:** le checkbox ingredienti compaiono **dopo aver cliccato una categoria** (overlay portal `data-booking-menu-expanded="true"`), non nella griglia categorie chiusa. Confermato anche da Matteo in chat.

### Tabella esiti

| ID | Caso | mobile 375 | tablet 834 | desktop 1280 | Esito |
|----|------|:----------:|:----------:|:--------------:|:-----:|
| F1a | Menù personalizzabile — checkbox **non** pre-spuntate (dopo tap categoria) | OK | OK | OK | OK |
| F1b | Menù fisso — read-only («Incluso nel menù», no checkbox interattive) | OK | OK | OK | OK |
| F2 | Card manuale — blocco «Hai selezionato :» + titolo + descrizione in `MenuSelection`; no «Crea il tuo menù»; griglia nascosta | OK | OK | OK | OK |
| F3 | Footer card sottotab — solo `X,XX€`, **no** riga «a persona» | OK | OK | OK | OK |
| F4 | Cambio card — reset blocco manuale al ritorno su card senza preset | OK | OK | OK | OK |
| F5 | Riepilogo (sticky / sidebar) — info opzione menù coerente | OK | OK | OK | OK |

**Non testato:** submit prenotazione + snapshot DB; tenant `test-pro` (slug `.env.local.test` non risolvibile su TEST).

---

## 4. Verifica codice (campione)

- **Fix 1:** `subTabGuestComposable` sui 3 call site di `applyPresetTypeToBookingFormPayload` in `BookingRequestForm`; test `card sottotab personalizzabile → items vuoti anche se preset staff è fisso` in `buildPresetMenuSelection.flusso-dati.test.ts`.
- **Fix 2:** `hideMenuGrid={!activeSubTab?.preset_id \|\| !activeSubTabLinkedPreset}` + `activeSubTabShowsMenu` esteso a card manuale con `label`; `showComposeHeader` gated da `!hideMenuGrid`.
- **Fix 3:** rimossa riga «a persona» in `BookingSubTabCards.tsx` — solo `<p>{priceAmount}</p>`.

Skill allineate: `PRENOTA_LAYOUT_CONTEXT.md` §5 punti 2 (footer sottotab) e 4 (menù/card manuale), `PRENOTA_DATA_FLOW_CONTEXT.md` LOCK, `PRENOTA_SKILL.md` §3-bis Livello B.

---

## 5. Riserve minori (non bloccanti)

1. **Slug QA:** `.env.local.test` punta a `test-pro` che non esiste su TEST; aggiornare slug o seed tenant per smoke futuri (FU-037 resta utile come promemoria slug, non come gap funzionale).
2. **Copertura test:** nessun test componente React su branch `hideMenuGrid` / header «Hai selezionato» — coperto indirettamente da unit + QA browser.

---

## 6. Conclusione

I tre fix richiesti sono **corretti e coerenti** con report esecutore e skill. Validate verde; QA browser sui tre viewport con flusso categoria→ingredienti per Fix 1. **Approvato** per commit su richiesta Matteo.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1: (1) «Profilo: Verifica · Modalità: standard · Skill: … · Output: report breve … + verdetto ✅/⚠️/❌. No commit.» — Fix 1–3, ordine validate→diff→QA 375/834/1280. (2) «menu personalizzato mostra correttamnte checkbox non psuntata. devi cliccare le categorie…». (3) «⚠️ FINE-SESSIONE — … sezione 11 … Aggiungila e rispondi.» (4) «📄 FINE-SESSIONE — 1 report, domande di chiusura compilate. Ultimo controllo a mente fredda…» (questo pass).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.  
✅ R2: Sì — ri-verificato ora con `git diff --stat` e `--name-only`: **12 file**, +79/−24; `npm run validate` **412** test (46 file). Aperti/confermati: `buildPresetMenuSelection.ts` (`ApplyPresetMenuSelectionOptions`, `isGuestComposableMenuSelection`, `subTabGuestComposable`); `BookingRequestForm.tsx` (3 call site + `hideMenuGrid`); `MenuSelection.tsx` (`!hideMenuGrid` su `showComposeHeader`); `BookingSubTabCards.tsx` (footer solo `<p>{priceAmount}</p>`, niente «a persona»); `bookingCapabilities.ts` (card manuale con `label`); test `buildPresetMenuSelection.flusso-dati.test.ts` (+1 caso) e `bookingCapabilities.test.ts` (+2 casi). `BookingRequestPage.tsx` e hook `useCreateBookingRequest` assenti dal diff — coerente col report esecutore.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).  
✅ R3: Allineati (verificati via diff skill): `PRENOTA_LAYOUT_CONTEXT.md` §5 punto 2 (footer solo €, card manuale in MenuSelection), §5 punto 4 (griglia vs blocco titolo/descrizione) + nota selezione iniziale vuota; `PRENOTA_DATA_FLOW_CONTEXT.md` LOCK card senza preset + `subTabGuestComposable`; `PRENOTA_SKILL.md` §3-bis Livello B; test `buildPresetMenuSelection.flusso-dati.test.ts`, `bookingCapabilities.test.ts`; tipo `ApplyPresetMenuSelectionOptions`. Ancillari esecutore: `FOLLOW_UP.md` FU-037, `SESSION_LOG.md`. Nessun gap E-A rilevato.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)  
✅ R4: Non eseguiti: submit prenotazione + verifica snapshot DB; slug `test-pro` da `.env.local.test` (406 — tenant inesistente su TEST, QA su `trattoria-da-tommaso`); commit/push (vietati dal prompt revisore). Primo giro QA Fix 1 incompleto (checkbox non visibili senza tap categoria) — corretto dopo nota Matteo e secondo pass Playwright. Non aggiornato `FOLLOW_UP.md`/SESSION_LOG (fuori scope revisione, già a cura esecutore).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)  
✅ R5: Attrito: TESTING §7 non dice esplicitamente che gli ingredienti personalizzabili si vedono solo dopo tap categoria (portal overlay) — primo QA segnalava «0 checkbox» a torto; proposta: una riga in §7.5 esempio Prenota menù «aprire almeno una categoria prima di contare checkbox». Secondo attrito: slug `.env.local.test` obsoleto vs DB reale — proposta: allineare `MANUAL_TENANT_SLUG` a tenant con card cards/preset/manuali (es. `trattoria-da-tommaso`).

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?  
✅ R6: Giusto — TESTING §7 + PRENOTA skill bastavano per scope e vincoli LOCK; report esecutore come baseline diff. Hook fine-sessione utile: ha intercettato §11 mancante nel report revisione (altrimenti chiusura superficiale). Nota Matteo in chat (tap categoria) essenziale — non era nel prompt iniziale.

---

## 12. Self-review (checklist §12 CHIUSURA_SESSIONE)

1. **Dati = diff reale:** verificato al pass finale — 12 file +79/−24, 412 test (46 file); corretto breakdown §2 (7 src + 5 docs, non 9+3).
2. **File correlati:** skill LAYOUT §5 p.2/4 + DATA_FLOW + PRENOTA_SKILL + test allineati (riferimenti §5.2/§5.4 corretti in §5 punti 2 e 4).
3. **Q1–Q6:** coerenti; R1 aggiornata con prompt FINE-SESSIONE (4).
4. **Tono utente:** report revisione per flussi Anna + tabelle tecniche per agenti.
