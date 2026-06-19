# Report — Fix rotella mouse su input numerici admin (19-06-26)

> Profilo Esecuzione, modalità standard. Fix "rotella non cambia il numero" esteso a tutti gli
> input numerici admin tramite listener nativo in `Input.tsx`.

## Cappello

- **Cosa è cambiato:** scrollare la rotella su una casella numerica admin (walk-in, coperti per fascia, limite coperti, prezzi, capienza sala/tavolo, ecc.) non cambia più il valore se il campo ha il focus. Il fix agisce in un'unica location (`Input.tsx`) e copre tutti gli input numerici dell'admin senza modifiche ai singoli componenti.
- **Cosa resta:** smoke test manuale (Q1 del §7 in chat) su almeno una delle tre caselle citate da Matteo.
- **Serve una tua azione:** no — solo il test visivo su browser per conferma.

## Problema

La utility `suppressNumberInputWheel` era già implementata e già applicata in `Input.tsx` via React `onWheel`. Ma il fix non funzionava: il numero continuava a cambiare con la rotella.

**Causa:** React 17+ usa event delegation — attacca i listener alla radice del DOM (`#root`), non all'elemento. I browser moderni (Chrome, Firefox, Edge) trattano i `wheel` event alla radice come **passivi** per default. Questo significa che `event.preventDefault()` chiamato in un handler React `onWheel` viene **silenziosamente ignorato** dal browser: nessun errore, ma nessun effetto. Il numero cambia uguale.

## Soluzione

Sostituita la strategia di blocco wheel in `Input.tsx`:

**Prima (non funzionava):**
```tsx
// React onWheel → event delegation → listener passivo → preventDefault ignorato
const handleWheel = type === 'number'
  ? mergeWheelHandlers(suppressNumberInputWheel, onWheel)
  : onWheel
<input onWheel={handleWheel} ... />
```

**Dopo (funziona):**
```tsx
// useEffect + addEventListener diretto sull'elemento DOM con { passive: false }
// → browser onora preventDefault() → numero non cambia
useEffect(() => {
  if (type !== 'number') return
  const el = innerRef.current
  if (!el) return
  const handler = (e: WheelEvent) => {
    if (document.activeElement === e.currentTarget) e.preventDefault()
  }
  el.addEventListener('wheel', handler, { passive: false })
  return () => el.removeEventListener('wheel', handler)
}, [type])
```

Il handler blocca solo se il campo ha focus (comportamento atteso: senza focus la rotella scrolla la pagina liberamente). Il prop `onWheel` utente è ancora passato through.

## File toccati e perché

| File | Modifica |
|------|----------|
| `src/components/ui/Input.tsx` | Sostituita strategia wheel: da React `onWheel` a `useEffect` + `addEventListener('wheel', …, { passive: false })` nativo. Aggiunto `useRef` interno per accedere al DOM node, con merge del `ref` esterno (pattern `combinedRef`). Rimosso import `suppressNumberInputWheel`/`mergeWheelHandlers` (non più usati da questo file). |
| `src/components/ui/__tests__/Input.numberWheel.test.tsx` | Aggiornata descrizione test 1 per documentare il listener nativo. Aggiunto **test 4**: "non blocca senza focus — walkin-guests e slot_cap" — verifica che senza focus l'evento wheel non chiami `preventDefault()` (pagina scrolla liberamente). |

**Non toccati** (tutti usano già `Input` component, quindi coperti automaticamente):
`ServiceSlotsManager.tsx`, `RestaurantSettingsTab.tsx`, `WalkInLimitCard.tsx`, `WalkInModal.tsx`,
`RoomConfigModal.tsx`, `TableFormModal.tsx`, `MenuPricesTab.tsx`, `CampaignCadenceSelector.tsx`,
`BookingFormConfigPanel.tsx`.

## Test eseguiti

- `npm run validate` → **861/861** verde (lint 0 warning, typecheck 0 errori, 111 file test).
- Test specifici wheel: `src/components/ui/__tests__/Input.numberWheel.test.tsx` (4/4 ✓).

## Note sessione

**ESLint falso positivo pre-esistente (risolto dal formatter):** al primo `validate` c'erano 6 warning in `ServiceSlotsManager.tsx` — `ChevronUp` e 5 props `onMoveUp/Down/canMove/isMoving` flaggati come unused da `@typescript-eslint/no-unused-vars`, anche se tutti effettivamente usati nel JSX e nel flusso. Si tratta di un falso positivo del plugin (nota: il formatter automatico li ha eliminati autonomamente nella sessione senza mia modifica).

**`suppressNumberInputWheel.ts`:** il file utility rimane nel codebase e i suoi test passano. Non è più importato da `Input.tsx` ma resta un'utility esportata standalone — da decidere se rimuovere in una sessione di cleanup.

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| Nessuno in questa sessione | — | Comportamento ancora documentato in `UI_COMPONENTS_CONTEXT.md` con riferimento a `suppressNumberInputWheel.ts` (implementazione spostata su listener nativo in `Input.tsx` — allineamento skill rimandato, vedi Q3). |

## Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali Matteo:** 1 (fix SET-05 + contesto tecnico) + «lavoro ok».
- **Correzioni dopo 1ª risposta:** 0.
- **Follow-up generati:** 0 (cleanup opzionale `suppressNumberInputWheel.ts`).
- **Modalità alzata:** no (standard).

## La tua lettura della sessione

Fix chirurgico: i test Vitest del 17-06 passavano ma il browser no — causa reale (wheel passivo su delegation React) diversa da quanto assumeva l’utility `onWheel`. Il `useEffect` + `{ passive: false }` è il pattern corretto; copertura admin resta centralizzata su `Input.tsx`.

**Miglioria suggerita (dato):** aggiornare `UI_COMPONENTS_CONTEXT.md` § Input (riferimento implementazione) e chiudere SET-05 in checklist dopo smoke Matteo.

## Derivazione errori

| Finding | Causa | Classificazione |
|---------|-------|-----------------|
| Rotella cambia valore nonostante fix 17-06 | `preventDefault` ignorato su listener wheel passivo (delegation React 17+) | **bug preesistente** — fix 17-06 incompleto a runtime |
| Test Vitest verdi ma browser KO | `fireEvent`/`WheelEvent` in jsdom non replica passive default del browser reale | **vincolo strutturale** test unitari |

## Cosa resta per la prossima sessione

- Smoke SET-05 (walk-in / coperti max fascia / limite coperti) — Matteo in browser.
- Allineare `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` § Input (listener nativo, non più solo `suppressNumberInputWheel.ts`).
- Opzionale: rimuovere o deprecare `src/lib/suppressNumberInputWheel.ts` se non più usato altrove.

## Dati comunicazione

- Prompt sostanziali Matteo: **1** (descrizione fix + contesto tecnico completo).
- Correzioni dopo 1ª risposta: 0.
- Follow-up generati: nessuno (possibile cleanup `suppressNumberInputWheel.ts`).
- «lavoro ok» a chiusura.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «Profilo: Esecuzione · Modalità: standard — Skill da leggere PRIMA: docs/APP_CONTEXT_SKILL.md §0; docs/ADMIN_CLASSIC_SKILL.md; docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md. Obiettivo: il fix "rotella non cambia il numero" (utility suppressNumberInputWheel) NON funziona sulle caselle citate (walk-in, coperti max per fascia, limite coperti). Branch env/test, nessuna modifica DB/PROD. RestaurantSettingsTab e ServiceSlotsManager sono LOCK → fix centralizzato in Input.tsx, niente altro. npm run validate deve essere verde. Estendi/aggiungi test in Input.numberWheel.test.tsx.» (2) «lavoro ok».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato `git diff HEAD` su 2 file di questa sessione: `Input.tsx` — rimossi import `suppressNumberInputWheel`/`mergeWheelHandlers`; aggiunti `useRef`/`useCallback`/`useEffect`; `combinedRef` merge ref esterno; listener `addEventListener('wheel', …, { passive: false })` solo se `document.activeElement === e.currentTarget`; `onWheel` prop passato diretto. `Input.numberWheel.test.tsx` — test 1 rinominato; aggiunto test 4 «senza focus»; commento header aggiornato. `npm run validate` rieseguito in chiusura: **111 file / 861 test** verdi. Test wheel: **4/4**. Il working tree può contenere altri file da sessioni batch non committate — non citati in questo report.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Aggiornati:** `Input.numberWheel.test.tsx` (4 test, tag `@admin-blindatura: input-number-wheel`). **Verificati senza modifica:** `src/lib/suppressNumberInputWheel.ts` + suoi 2 test unitari (ancora presenti, non più importati da `Input.tsx`); `ADMIN_SETTINGS_CONTEXT.md` (comportamento UX invariato). **Non aggiornati (gap):** `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` § Input — cita ancora `suppressNumberInputWheel.ts` come meccanismo attivo; va allineato al listener nativo. `ADMIN_TEST_SUITE_INDEX.md` — contatore test wheel non aggiornato (+1 test).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (a) **Smoke browser SET-05** — non eseguito dall’agente; conferma visiva a Matteo. (b) **Allineamento `UI_COMPONENTS_CONTEXT.md`** — non fatto. (c) **Cleanup `suppressNumberInputWheel.ts`** — lasciato nel repo. (d) **Commit/push** — non richiesti con «lavoro ok». (e) **E2E Playwright rotella** — fuori scope.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: report 17-06 e skill componenti descrivevano il fix chiuso mentre SET-05 era KO; warning ESLint pre-esistenti in `ServiceSlotsManager.tsx` hanno fatto perdere tempo — miglioria: `validate` allo stato iniziale prima di iniziare + nota in `TESTING_SKILL` §7 che i test wheel Vitest non sostituiscono smoke browser.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto** (APP_CONTEXT §0 + ADMIN_CLASSIC + ADMIN_SETTINGS). Hook `stop` **utile** — ha intercettato §11 mancante senza falso positivo.
