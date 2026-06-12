# Report M6 prod-ready — fallback, guard dirty, PrenotaZen docs — 12-06-26

**Cosa è cambiato:** meno dati demo hardcoded in admin Pro; chiusura con guard su CRM, overlay Categorie Menu e collapse nuova prenotazione; regola `validate:docs` documentata per agenti merge/release.
**Cosa resta:** email, audit fallback globale (altri punti), logging, guard Servizio/modali Pro, M4/M5.
**Serve una tua azione:** no.

---

## 2. Cosa è stato fatto

1. **Fallback demo posizionamento:** `booking_placement_areas` non inietta più `Sala A/Sala B/Deorr` se manca il setting — lista vuota finché il ristoratore non configura in Impostazioni.
2. **Residuo demo Pagina Prenota:** rimosso commento redirect Wix legacy nel modale successo.
3. **Guard dirty CRM:** pannello dettaglio cliente (note) e modale create/edit cliente chiedono conferma prima di chiudere con bozza aperta.
4. **Guard dirty tab Menu:** overlay «Categorie Menu» chiede conferma se il form categoria ha modifiche non salvate.
5. **Guard nuova prenotazione:** collapse «Inserisci Nuova Prenotazione» collegato al guard globale admin (tab/collapse).
6. **Documentazione release:** `APP_CONTEXT_SKILL.md` §5b + `CHIUSURA_SESSIONE.md` Parte B §5 — PrenotaZen non deve avere `validate:docs`/CI docs (già rimosso dallo script sync).
7. **Test:** +1 test M6 su parse placement areas; fix mock routing AdminDashboard.

## 3. File toccati

| Area | File |
|------|------|
| Fallback | `restaurantSettingRegistry.ts`, `AdminBookingForm.tsx`, `DetailsTab.tsx`, `BookingRequestForm.tsx` |
| Guard | `CustomerDetailPanel.tsx`, `CustomerFormModal.tsx`, `MenuPricesTab.tsx`, `AdminDashboard.tsx` |
| Test | `m6ProdReadyPatterns.test.ts`, `AdminDashboard.adminRouting.test.tsx` |
| Docs | `APP_CONTEXT_SKILL.md`, `CHIUSURA_SESSIONE.md`, `MASTERPLAN_BLINDATURA.md`, `FOLLOW_UP.md`, `ADMIN_CONFLICTS_AND_DEBTS.md` |

## 4. Verifiche

| Comando | Esito |
|---------|-------|
| `npm run validate:docs` | ✅ |
| `npm run validate` | ✅ 564 test |
| `npm run build` | ✅ |
| DB | Nessuna modifica necessaria |

## 5. Skill aggiornate

| File | Perché |
|------|--------|
| `APP_CONTEXT_SKILL.md` | Comandi + regola release PrenotaZen |
| `CHIUSURA_SESSIONE.md` | Procedura merge §5 PrenotaZen |
| `ADMIN_CONFLICTS_AND_DEBTS.md` | Stato M6 fallback/guard |
| `MASTERPLAN_BLINDATURA.md` / `FOLLOW_UP.md` | Progresso M6 |

## 6. Dati comunicazione

- Prompt esecutivo M6 con branch `env/test`, esclusione email/legal/grafica, release PrenotaZen se codice servito.
- Stato finale: privato `main`/`env/test` @ `6c4488d` (codice `70ace37` + docs); PrenotaZen @ `353d82c`.

## 7. Analisi flusso

- Prompt sostanziali: 1 · Correzioni: 0 · Follow-up: FU-ALL-FALLBACK/FU-023 aggiornati, non chiusi.

## 8. La tua lettura

Impressioni: task ben delimitato; il debito guard era già mappato in FU-023, implementazione a pattern `MenuQrModal`/`DiscardChangesConfirmModal` a basso rischio. Difficoltà: mock test AdminDashboard mancante `clearUnsavedSource` — fix immediato. Miglioria: checklist guard in PREPARA_PROMPT per sessioni M6.

## 9. Derivazione errori

Bug test preesistente nel mock routing — non copriva nuovi hook unsaved; risolto nello stesso ciclo.

## 10. Cosa resta

- FU-ALL-FALLBACK audit completo (business hours default, gradienti, ecc.)
- FU-023: Servizio (slot/room modals), altri modali Pro
- FU-EMAIL, FU-LOG, FU-TYPES residui, M4/M5

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt esecutivo senior M6 prod-ready (fallback, guard dirty, fix DB se necessario, doc PrenotaZen validate:docs, validate/build, commit separati, push env/test, merge main, release PrenotaZen); stato noto branch ee2caa3/cc35f1d; esclusioni email/P.IVA/grafica/PROD write.

❓ Q2 — Dati = diff reale?
✅ R2: Riaperti file codice elencati §3; validate 564 verdi; build verde; nessun file Supabase nel diff.

❓ Q3 — File correlati allineati?
✅ R3: Skill area admin (`ADMIN_CONFLICTS`), APP_CONTEXT, CHIUSURA, masterplan, follow-up aggiornati.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Email, legal, scope grafico, DB, guard Servizio/WalkIn/RoomConfig, audit fallback completo, M4/M5 — fuori mandato o restano aperti.

❓ Q5 — Attrito + miglioria?
✅ R5: Mock test stale su UnsavedChangesContext — aggiungere al template mock shell quando si estende il guard.

❓ Q6 — Contesto & hook?
✅ R6: Giusto — masterplan + follow-up + CHIUSURA sufficienti per release docs rule.

## 12. Self-review

1. Diff = report ✅ · 2. Skill allineate ✅ · 3. Q1-Q6 ✅ · 4. Tono utente ✅

Report pronto.
