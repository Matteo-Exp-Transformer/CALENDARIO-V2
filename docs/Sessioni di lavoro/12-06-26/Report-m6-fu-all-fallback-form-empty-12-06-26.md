# Report M6 — FU-ALL-FALLBACK form config EmptyState — 12-06-26

**Cosa è cambiato:** sulla Pagina Prenota (`/prenota/:slug`), se il ristorante non ha ancora salvato la configurazione del form in `restaurant_settings`, il cliente non vede più tipologie demo ma un messaggio neutro con invito a contattare il ristorante.
**Cosa resta:** FU-ALL-FALLBACK parziale (hook Supabase, email, guard Servizio, M4/M5); FU-TYPES-1, FU-LOG-1.
**Serve una tua azione:** no (release PrenotaZen eseguita post-merge se richiesto dal flusso branch).

---

## 2. Cosa è stato fatto

1. **Registry `booking_public_form_config`** — `parseFromDb` distingue «non configurato» (`null`) da config valida: raw assente/malformato o `booking_modes` senza almeno un oggetto → `null`; config parziale con mode oggetto → `normalize` come prima. Helper `hasUsableBookingModesInRaw` in `bookingPublicFormConfig.ts`.
2. **`RestaurantSettingValueMap`** — tipo `booking_public_form_config` → `BookingPublicFormConfig | null`.
3. **`BookingRequestPage`** — dopo load, `formConfig === null` → EmptyState («Form prenotazione non ancora configurato» + invito contatti); niente `DEFAULT_BOOKING_FORM_CONFIG` sul pubblico. Admin `BookingFormConfigPanel` invariato (seed locale).
4. **Sync magazzino** — rename/delete categoria salta update form se parse → `null`.
5. **Test** — aggiornati `bookingPublicFormConfig.malformed`, `m6ProdReadyPatterns` (+gate EmptyState e anti-`?? DEFAULT` sulla pagina).
6. **Docs FU-ALL-FALLBACK** — chiusura voci orari, sfondo, strip picker, form config; restano hook/email/guard/M4/M5.

### 2b. Verdetti fallback (Matteo — chiusura registro)

| Voce | Verdetto |
|------|----------|
| Orari default | ✅ chiuso (giorni null) |
| Sfondo Pagina Prenota | ✅ chiuso (crema neutra) |
| Strip admin picker | ✅ ok prod — `strip-01` solo editor; pubblico dopo Salva |
| Form config pubblico | ✅ chiuso questa sessione (EmptyState) |

## 3. File toccati

| Area | File |
|------|------|
| Registry / tipi | `restaurantSettingRegistry.ts`, `bookingPublicFormConfig.ts` |
| Pagina Prenota | `BookingRequestPage.tsx` |
| Sync magazzino | `syncMenuCategoryKeyDelete.ts`, `syncMenuCategoryKeyRename.ts` |
| Test | `bookingPublicFormConfig.malformed.flusso-dati.test.ts`, `bookingPublicFormConfig.test.ts`, `m6ProdReadyPatterns.test.ts` |
| Skill / registro | `PRENOTA_FORM_CONFIG_CONTEXT.md`, `FOLLOW_UP.md`, `MASTERPLAN_BLINDATURA.md`, `ADMIN_CONFLICTS_AND_DEBTS.md` |

## 4. Verifiche

| Comando | Esito |
|---------|-------|
| `npm run validate:docs` | ✅ 0 path rotti |
| `npm run validate` | ✅ 570 test |
| `npm run build` | ✅ |
| DB | **Nessuna modifica** |

## 5. Skill aggiornate

| File | Modifica | Perché |
|------|----------|--------|
| `PRENOTA_FORM_CONFIG_CONTEXT.md` | Default solo admin; EmptyState pubblico | Comportamento form config cambiato |
| `FOLLOW_UP.md` | FU-ALL-FALLBACK 4° giro | Chiusura form + strip; resta aperto il debito trasversale |
| `MASTERPLAN_BLINDATURA.md` | M6 progresso | Allineamento milestone |
| `ADMIN_CONFLICTS_AND_DEBTS.md` | §4 audit fallback | Stato M6 form config |

## 6. Dati comunicazione

- Prompt esecutivo M6/FU-ALL-FALLBACK con scope A (codice) + B (docs/verdetti), test, commit separati, release se codice servito.

## 7. Analisi flusso

- Prompt sostanziali: 1 · Correzioni: 0 · Follow-up: FU-ALL-FALLBACK aggiornato (non chiuso del tutto).

## 8. La tua lettura

Fix mirato e coerente con il pattern già usato per sfondo/orari: `null` dal registry + EmptyState in pagina. Il criterio `hasUsableBookingModesInRaw` evita di mostrare DEFAULT quando il JSON è solo spazzatura. Admin resta su seed locale — nessuna regressione per Mario in Personalizza form.

## 9. Derivazione errori

Nessuna difficoltà tecnica rilevante; lint su import inutili nei sync risolto subito.

## 10. Cosa resta

- Hook Supabase `as any` (FU-TYPES-1), email (FU-EMAIL), guard Servizio (FU-023), logging edge (FU-LOG-1), M4/M5.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Profilo Esecuzione M6/FU-ALL-FALLBACK — fix form non configurato (registry null, EmptyState BookingRequestPage, test, admin seed invariato), aggiornare FOLLOW_UP/MASTERPLAN, report standard Q1–Q6, validate/build, commit separati codice/docs, push/merge/release PrenotaZen se codice servito.

❓ Q2 — Dati = diff reale?
✅ R2: Registry `parseFromDb` → null; `BookingRequestPage` senza `?? DEFAULT`; test 570 verdi; build verde; nessuna migrazione DB.

❓ Q3 — File correlati allineati?
✅ R3: PRENOTA_FORM_CONFIG_CONTEXT, FOLLOW_UP, MASTERPLAN M6, ADMIN_CONFLICTS; sync magazzino con guard su parse null.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Strip (solo verdetto docs), hook Supabase, email, guard Servizio, submit/resolver, layout LOCK griglia, migrazioni DB.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito minimo; pattern `hasUsableBookingModesInRaw` riusabile se servono altri gate su JSON parziale.

❓ Q6 — Classic placement e release?
✅ R6: Classic placement non toccato; release PrenotaZen da eseguire post-merge main perché `BookingRequestPage` è codice servito pubblicamente.
