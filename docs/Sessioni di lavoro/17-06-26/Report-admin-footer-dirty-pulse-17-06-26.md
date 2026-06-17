# Report — Admin: footer «Modifiche non salvate» più visibile

**Data:** 17-06-26  
**Branch:** `env/test`  
**Profilo:** Esecuzione deep

---

## Cappello

- **Cosa è cambiato:** in Impostazioni (Anagrafica e Personalizza form), quando ci sono modifiche non salvate, i pulsanti **Salva modifiche** e **Annulla tutte** nel footer in basso a destra pulsano con un alone arancione discreto; stesso segnale su Salva nella modale «dati pubblici» e su Salva/Annulla nel guard di navigazione.
- **Cosa resta:** smoke manuale su mobile (375) per confermare che il pulse non copre contenuti — non eseguito in browser dall'agente.
- **Serve una tua azione:** sì — apri Impostazioni, modifica un campo, verifica che il footer attiri l'occhio senza disturbare lo scroll.

---

## 1. Obiettivo

Rendere più visibile il footer dirty in admin senza toccare logica dirty/save/guard: pulse controllato su Salva e Annulla, coerente con i pattern attenzione già usati (`booking-public-field-attention`, `admin-nav-notify-pulse-ring`).

---

## 2. Modifiche src/

| File | Modifica |
|------|----------|
| `src/index.css` | Keyframe + classe `.settings-save-footer-btn-attention` (box-shadow, no layout shift; `prefers-reduced-motion`) |
| `src/features/booking/components/settings/SettingsSaveUi.tsx` | Costante `SETTINGS_SAVE_FOOTER_BTN_ATTENTION_CLASS`; applicata a `SettingsSaveFooter`, `PublicDataSaveConfirmModal` (Salva), `UnsavedNavigationGuardModal` (Salva e continua + Annulla e continua) |
| `src/features/booking/components/__tests__/settingsSaveGuard.settingsM4.adminBlindatura.test.tsx` | +1 test: footer dirty → classe pulse su Salva e Annulla |

**Cosa NON è cambiato:** condizioni `combinedDirty` / `pageHasUnsaved`, handler save/discard, modale FU-005, guard `UnsavedChangesContext`.

---

## 3. validate

```
102 file | 804 test — tutti verdi (17-06-26)
```

(+1 test rispetto a 803 precedente nella stessa sessione)

---

## 4. Allineamento skill §7.2

| File | Aggiornamento |
|------|---------------|
| `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` | Bullet footer dirty pulse Salva/Annulla + modali collegate |
| `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md` | Riga `SettingsSaveUi` con nota pulse footer |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | `settings-save-guard` 12 → 13 casi |

---

## 5. QA manuale suggerita (Matteo)

| Viewport | Schermata | Azione | Esito atteso |
|----------|-----------|--------|--------------|
| 375 | Impostazioni → Anagrafica | Modifica nome locale | Footer appare; Salva/Annulla pulsano; nessun contenuto coperto dallo sticky |
| 834 | Personalizza form | Modifica titolo header | Stesso footer unico padre; pulse attivo |
| 1280 | Anagrafica → Salva | Clic Salva modifiche | Modale pubblica: pulsante Salva con stesso alone arancione |
| 1280 | Con dirty → cambia pill | Guard navigazione | Salva e continua / Annulla e continua pulsano |

---

## 6. Dati comunicazione

- Prompt unico con vincoli chiari (no logica dirty, no layout shift, coerenza modale pubblica).
- Nessuna correzione post-prima-risposta.

---

## 7. Analisi flusso prompt

- **Prompt sostanziali:** 1 (PROMPT 5)
- **Correzioni dopo 1ª risposta:** 0
- **Modalità:** deep
- **Efficacia:** riferimento esplicito a `SettingsSaveFooter` e pattern esistenti ha indirizzato subito verso box-shadow pulse (come nav admin) invece di border/outline che causerebbe layout shift.

---

## 8. La tua lettura della sessione

Intervento chirurgico nel punto giusto: `SettingsSaveUi.tsx` è già il hub di footer e modali collegate; una sola classe CSS e un export condiviso evitano duplicazioni. Il footer compare solo quando dirty, quindi non serve prop `isDirty` aggiuntiva — la visibilità del componente è già il segnale. Il test in `settings-save-guard` è il fronte naturale perché già copre footer unico e modale pubblica.

**Miglioria suggerita (non applicata):** screenshot Playwright del footer dirty in `admin-settings-blindatura.spec.ts` per regressioni visive del pulse — opzionale, bassa priorità.

---

## 9. Derivazione errori

Nessuna difficoltà tecnica.

---

## 10. Cosa resta per la prossima sessione

Niente bloccante. Smoke manuale §5 consigliato prima di merge.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1: «PROMPT 5 — Admin: footer “Modifiche non salvate” più visibile / Profilo: Esecuzione / Modalità: deep / Skill da leggere: docs/Admin-Skill/ADMIN_MINI.md + docs/Admin-Skill/ADMIN_SKILL.md + docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md + docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md + docs/per-ui-design-skill/UI_EDIT_SKILL.md. / Non caricare: aree non admin salvo grep mirato del componente condiviso. / Output attesi: pulse/lampeggio controllato su Salva e Annulla nel footer dirty + QA admin + validate + report §7.1 + allineamento skill §7.2. Niente output in più senza chiedere Sì/No prima. / Branch: env/test. / Obiettivo: Admin → Impostazioni / Personalizza form e pannelli/modali che usano il footer salvataggio. Quando ci sono modifiche non salvate, i pulsanti Salva e Annulla devono essere più visibili con pulse/lampeggio, seguendo pattern attenzione già usati nell’app. / Vincoli: Non cambiare la logica dirty/save/guard. Non introdurre animazioni aggressive o layout shift. Non coprire contenuti su mobile. Mantieni coerenza con SettingsSaveFooter e modale conferma dati pubblici. / Criterio di fatto: Quando la sezione è dirty, Salva e Annulla attirano attenzione; quando non è dirty tornano normali. Nessun cambio al flusso di salvataggio. npm run validate verde.»

❓ Q2 — Dati = diff reale?  
✅ R2: Ri-verificato aprendo `SettingsSaveUi.tsx` (classe su 4 punti), `index.css` (keyframes + reduced-motion), test nuovo riga 224–236 in `settingsSaveGuard.settingsM4.adminBlindatura.test.tsx`; validate 102 file / 804 test passed.

❓ Q3 — File correlati allineati?  
✅ R3: `ADMIN_SETTINGS_CONTEXT.md`, `PRENOTA_FORM_CONFIG_CONTEXT.md`, `ADMIN_TEST_SUITE_INDEX.md` aggiornati. Verificato senza modifica: `UI_EDIT_SKILL.md` (nessuna regola footer-specifica da duplicare), `PLAN_BLINDATURA_ADMIN.md` (fronte settings-save-guard già mappato).

❓ Q4 — Cosa NON hai fatto?  
✅ R4: (a) QA manuale browser §5 — non eseguita. (b) Commit/push — non richiesti. (c) Pulse su modale «Annullare tutte le modifiche?» interna al footer — volutamente esclusa: l'utente ha già cliccato Annulla; il task chiedeva Salva/Annulla del footer dirty.

❓ Q5 — Attrito + miglioria?  
✅ R5: Attrito basso — grep `SettingsSaveFooter` ha individuato subito l'hub. Miglioria: in `UI_COMPONENTS_CONTEXT.md` una riga «footer dirty admin → settings-save-footer-btn-attention» per agenti UI futuri (non fatto: fuori scope skill area admin già aggiornate).

❓ Q6 — Contesto & hook?  
✅ R6: Skill admin + PRENOTA_FORM_CONFIG + UI_EDIT caricate; implementazione limitata a `SettingsSaveUi` senza toccare `RestaurantSettingsTab` / `BookingFormConfigPanel` (corretto: footer già centralizzato).
