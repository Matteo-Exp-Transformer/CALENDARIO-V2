# Report — Admin: rotella mouse disabilitata su input numerici

**Data:** 17-06-26  
**Branch:** `env/test`  
**Profilo:** Esecuzione deep

---

## Cappello

- **Cosa è cambiato:** in tutta l'area admin, scorrere con la rotella sopra una casella numerica non modifica più il valore (coperti, prezzi magazzino, fasce servizio, walk-in, CRM cadenza, ecc.).
- **Cosa resta:** verifica manuale UI su 375 / 834 / 1280 in dev mode (non eseguita dall'agente in browser).
- **Serve una tua azione:** sì — smoke rapido su 2–3 schermate admin con rotella (Impostazioni coperti, prezzo magazzino, walk-in).

---

## 1. Obiettivo

Disabilitare l'incremento/decremento accidentale dei campi `type="number"` in admin quando l'utente usa la rotella del mouse, con soluzione riusabile. Digitazione, stepper nativo e tastiera numerica mobile devono restare invariati.

---

## 2. Modifiche src/

| File | Modifica |
|------|----------|
| `src/lib/suppressNumberInputWheel.ts` | Utility `suppressNumberInputWheel` + `mergeWheelHandlers` |
| `src/components/ui/Input.tsx` | Applica la utility quando `type="number"` |
| `src/features/booking/components/crm/CampaignCadenceSelector.tsx` | Raw `<input type="number">` → `<Input>` (2 campi cadenza CRM) |
| `src/lib/__tests__/suppressNumberInputWheel.test.ts` | 2 test unitari (focus / no focus) |
| `src/components/ui/__tests__/Input.numberWheel.test.tsx` | 3 test `@admin-blindatura: input-number-wheel` |

**Superfici coperte via `Input` condiviso (nessun patch per file):**
- Impostazioni → limiti coperti giornalieri + cap per fascia oraria (`RestaurantSettingsTab`)
- Personalizza form → prezzo per persona (`BookingFormConfigPanel`)
- Menu magazzino → prezzo prodotto + prezzo preset (`MenuPricesTab`)
- Servizio → sale (dimensioni/ordine), tavoli (posti), fasce (turni/coperti), walk-in limit (`RoomConfigModal`, `TableFormModal`, `ServiceSlotsManager`, `WalkInLimitCard`)
- Home walk-in → numero ospiti (`WalkInModal`)
- CRM → cadenza campagna (dopo migrazione a `Input`)

**Fuori scope intenzionale:** campi `inputMode="numeric"` con `type="text"` (es. dimensione font header Personalizza) — non hanno comportamento rotella nativo.

---

## 3. validate

```
99 file | 795 test — tutti verdi (17-06-26)
```

(+5 test rispetto a 790 precedente)

---

## 4. Allineamento skill §7.2

| File | Aggiornamento |
|------|---------------|
| `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` | Sezione **Input**: nota comportamento rotella su `type="number"` + riferimento a `suppressNumberInputWheel.ts` |

Nessun aggiornamento necessario alle skill Admin d'area: il comportamento è trasversale al componente UI condiviso, non a una regola di dominio (coperti, prezzi, servizio).

---

## 5. Dati comunicazione

- Prompt unico, perimetro chiaro (superfici admin elencate + vincoli tastiera/mobile).
- Nessuna correzione post-prima-risposta in questa sessione.

---

## 6. Analisi flusso prompt

- **Prompt sostanziali:** 1
- **Correzioni dopo 1ª risposta:** 0
- **Modalità:** deep (già assegnata nel prompt)
- **Efficacia:** tabella superfici + «soluzione riusabile» ha indirizzato subito verso `Input.tsx` invece di patch sparse.

---

## 7. La tua lettura della sessione

Fix pulito e a basso rischio: quasi tutti gli input numerici admin passavano già da `Input.tsx`; l'unica eccezione era CRM cadenza con raw HTML. La utility in `src/lib/` è testabile in isolamento e documentata nel context componenti. Il compromesso «blocca solo con focus» preserva lo scroll pagina quando il cursore passa sopra un campo non attivo — comportamento standard e verificato in test.

**Miglioria suggerita (non applicata):** una riga in `ADMIN_MINI.md` §4 («input numerici → sempre `Input type=number`, rotella gestita centralmente») ridurrebbe future regressioni con raw `<input>`.

---

## 8. Derivazione errori

Nessuna difficoltà tecnica.

---

## 9. QA manuale suggerita (Matteo)

| Viewport | Schermata | Azione | Esito atteso |
|----------|-----------|--------|--------------|
| 375 | Impostazioni → Limite coperti | Focus campo, rotella ↑↓ | Valore invariato; blur + scroll pagina ok |
| 834 | Menu → modifica prezzo | Digitazione + stepper ↑↓ | Funzionano |
| 1280 | Servizio → fascia → max coperti | Rotella senza focus sopra campo | Pagina scrolla, valore invariato |

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1: «PROMPT 2 — Admin: input numerici non cambiano con rotella mouse / Profilo: Esecuzione / Modalità: deep / Skill da leggere: docs/Admin-Skill/ADMIN_MINI.md + docs/Admin-Skill/ADMIN_SKILL.md + contesti delle superfici toccate; docs/per-ui-design-skill/UI_EDIT_SKILL.md; docs/Testing-Skill/TESTING_MINI.md. / Non caricare: aree pubbliche salvo input numerici già citati e necessari. / Output attesi: comportamento globale/coerente per input number admin + test mirato dove sensato + validate + report §7.1 + allineamento skill §7.2. Niente output in più senza chiedere Sì/No prima. / Branch: env/test. / Obiettivo: In admin, la rotella mouse sopra una casella numerica non deve cambiare il valore, con o senza focus. Superfici da considerare: Impostazioni coperti/fasce, Personalizza form, Menu magazzino prezzi, CRM cadenza, Servizio sale/tavoli/fasce, walk-in. / Vincoli: Preferire una soluzione riusabile e pulita… / Criterio di fatto: Scroll sopra gli input numerici non modifica il valore; digitazione e controlli previsti restano funzionanti. Verifica almeno su 375 / 834 / 1280 dove la UI admin è coinvolta. npm run validate verde.»

❓ Q2 — Dati = diff reale?  
✅ R2: Ri-verificato. 5 file src/ nuovi/modificati come in §2; `grep '<input.*type="number"'` in `src/features/booking` → zero match; validate 99 file / 795 test passed.

❓ Q3 — File correlati allineati?  
✅ R3: `UI_COMPONENTS_CONTEXT.md` aggiornato. Verificati senza modifica: `ADMIN_SETTINGS_CONTEXT`, `ADMIN_SERVIZIO_CONTEXT`, `ADMIN_MENU_MAGAZZINO_CONTEXT` (non documentano comportamento rotella). `ADMIN_TEST_SUITE_INDEX` non aggiornato (3+2 test nuovi — follow-up opzionale contatori).

❓ Q4 — Cosa NON hai fatto?  
✅ R4: (a) QA manuale browser sui 3 viewport — non eseguita dall'agente; tabella §9 per Matteo. (b) E2E Playwright rotella — non richiesto. (c) Commit/push — non richiesti.

❓ Q5 — Attrito + miglioria?  
✅ R5: Attrito minimo — grep `type="number"` ha mappato subito il perimetro. Miglioria: riga in `ADMIN_MINI.md` per vietare raw number input.

❓ Q6 — Contesto & hook?  
✅ R6: Contesto giusto (ADMIN_MINI + UI_EDIT + TESTING_MINI). Deep mode giustificata solo per report/superfici multiple; implementazione restata centralizzata in un file.
