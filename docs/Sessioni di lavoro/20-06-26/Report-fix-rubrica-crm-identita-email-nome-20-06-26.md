# Report — Rubrica CRM: righe distinte per email+nome

**Data:** 20-06-26 · **Modalità:** standard · **Profilo:** Esecuzione  
**Controtestato da Matteo:** sì (QA manuale Rubrica)

> **⚠️ Nota di controverifica (20-06-26, agente successivo):** questo report è stato scritto
> sull'architettura CRM **a tabella + pannello** (`CustomerListTable.tsx`, `CustomerDetailPanel.tsx`),
> poi **sostituita** dal redesign a card (`CustomerCardList.tsx` + `CustomerCardExpandedContent.tsx`):
> quei due file sono ora **eliminati** dal repo — le righe della tabella "File toccati" che li citano
> sono storiche. La logica identità email+nome (`mergeProfiles`) è sopravvissuta nel redesign.
> **Resta APERTO** (non coperto da questo task, contrariamente a «niente follow-up»): i clienti che
> prenotano **senza email ma con telefono** non entrano in rubrica — Matteo li vuole visibili
> (email O telefono). Vedi `ADMIN_CRM_CONTEXT.md` §12.

---

## Cappello

- **Cosa è cambiato:** in Admin → CRM Clienti → Rubrica, la stessa email con nomi diversi compare come righe separate (ciascuna con le proprie statistiche e prenotazioni); elimina/modifica agiscono solo sull’identità scelta; le campagne email restano per indirizzo unico.
- **Cosa resta:** niente follow-up obbligatori su questo task.
- **Serve una tua azione:** no (commit/push solo su «fai report finale»).

---

## Cosa è stato fatto

1. **Rubrica clienti** — due prenotazioni con stessa email ma nome diverso (es. «cava» e «Mario Rossi») generano **due righe** in tabella, non una sola con l’ultimo nome.
2. Ogni riga mostra conteggio prenotazioni, ultima data e telefono calcolati **solo** sulle prenotazioni con quel nome (raggruppamento case-insensitive sul nome).
3. **Selezione riga** — highlight e pannello dettaglio usano la chiave `email + nome`, non più solo l’email.
4. **Elimina cliente** — archivia (soft-delete) solo le prenotazioni della coppia email+nome della riga; l’altra identità sulla stessa email resta; la riga `customers` (una per email nel DB) si cancella solo se non restano prenotazioni attive per quell’indirizzo.
5. **Modifica contatti / note** — aggiorna le prenotazioni collegate solo se hanno lo stesso email + stesso nome di partenza.
6. **Campagne email** — nel picker destinatari ogni indirizzo compare **una sola volta** anche se in rubrica ci sono più nomi; contatori campagna invariati (per email).
7. **Test** — copertura merge multi-nome, raggruppamento case-insensitive, filtro identità per delete/update, dedupe picker.
8. **Skill** — `ADMIN_CRM_CONTEXT.md` §5–§6 allineati al nuovo modello dati.

---

## File toccati e perché

| File | Perché |
|---|---|
| `src/lib/customerEmail.ts` | `normalizeClientName`, `customerProfileKey` |
| `src/types/customer.ts` | Campo `profileKey` su `CustomerProfile` |
| `src/features/booking/hooks/useCustomers.ts` | `mergeProfiles` raggruppa per identità email+nome |
| `src/features/booking/hooks/useCustomerMutations.ts` | Update/delete scoped per `previousName` / `clientName`; delete `customers` condizionale |
| `src/features/booking/components/crm/CustomerListTable.tsx` | `key` e selezione su `profileKey` |
| `src/features/booking/components/crm/CustomerDirectoryTab.tsx` | Selezione/delete su `profileKey` |
| `src/features/booking/components/crm/CustomerFormModal.tsx` | Passa `previousName` alla mutazione |
| `src/features/booking/components/crm/CustomerDetailPanel.tsx` | Passa `previousName` al salvataggio note |
| `src/features/booking/utils/promoRecipientEligibility.ts` | `dedupeProfilesByEmail` per picker campagne |
| `src/features/booking/components/crm/PromoRecipientPicker.tsx` | Usa dedupe prima del filtro eleggibili |
| `src/features/booking/hooks/__tests__/useCustomers.test.ts` | Test merge multi-nome + case-insensitive |
| `src/features/booking/hooks/__tests__/useCustomerMutations.test.ts` | **Nuovo** — test helper identità |
| `src/features/booking/utils/__tests__/promoRecipientEligibility.test.ts` | Test dedupe per email |
| `src/features/booking/components/crm/__tests__/promoRecipientPicker.crm.adminBlindatura.test.tsx` | Mock con `profileKey` |
| `src/features/booking/components/crm/__tests__/campaignsManagerCloseRefresh.crm.adminBlindatura.test.tsx` | Mock con `profileKey` |
| `docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md` | §5 data flow + §6 mutazioni |

---

## Test eseguiti e risultato

| Comando | Esito |
|---|---|
| `npm run validate` (lint + typecheck + test) | **Verde** — 115 file, **888/888** test |

**QA manuale (Matteo, controtestato):** verifica in Rubrica con stessa email e nomi diversi; comportamento accettato.

---

## File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md` | §5: raggruppamento per `(email, client_name)`; `profileKey`; dedupe campagne per email. §6: modifica/delete scoped per identità; delete `customers` solo se email senza prenotazioni attive | Il diff cambia il modello dati e le mutazioni documentate in skill CRM |

---

## Dati comunicazione

- **Prompt iniziale:** preparato in profilo Esecuzione standard con skill `ADMIN_SKILL` + `ADMIN_CRM_CONTEXT`, obiettivo esplicito (righe distinte email+nome, delete scoped, campagne per email unica), file probabili e criteri di fatto — **1 prompt sostanziale**.
- **Chiusura:** «lavoro ok e controtestato da me» — accettazione + QA manuale dichiarata da Matteo.
- **Formato efficace:** prompt con vincoli numerati (1–6), file probabili, criterio di fatto e chiusura attesa; nessuna correzione dopo prima risposta.
- **Automatizzabile:** test merge/delete/dedupe già in Vitest; checklist Rubrica ripetibile manualmente.
- **Manuale:** verifica visiva due righe stessa email in Rubrica e picker campagna senza duplicati email.

---

## Analisi flusso prompt, efficienza e statistiche

| Metrica | Valore |
|---|---|
| Prompt sostanziali Matteo | 2 (task + lavoro ok) |
| Correzioni dopo 1ª risposta | 0 |
| Follow-up generati | 0 |
| Modalità alzata | No (restata standard) |

**Anatomia:** il prompt iniziale era auto-contenuto (comportamento atteso, vincoli DB, file, test, cosa NON toccare). Ha permesso implementazione diretta senza domande su Prenota vs Menu QR o su scope campagne.

---

## La TUA lettura della sessione

**Impressioni:** skill CRM caricata dal prompt ha orientato subito su `mergeProfiles` e mutazioni; il vincolo «campagne per email» era esplicito e ha evitato regressioni sul picker. Procedura lineare: tipi → merge → UI → mutazioni → dedupe campagne → test → skill.

**Difficoltà:** typecheck su `CustomerDetailPanel` — mancava `previousName` nel salvataggio note (stesso campo già aggiunto al form modale). Risolto in un passaggio.

**Migliorie suggerite (dato, non implementate):** in `ADMIN_SKILL.md` entry principale, una riga «identità rubrica = email+nome» nel riepilogo §0 potrebbe ridurre il rischio che un agente futuro ri-raggruppi solo per email senza aprire `ADMIN_CRM_CONTEXT` §5.

---

## Derivazione errori

| # | Cosa | Causa | Evitabile come |
|---|---|---|---|
| 1 | TS2345 su `CustomerDetailPanel` (`previousName` mancante) | **errore agente** — aggiornato `CustomerFormModal` ma non il secondo call site `useUpdateCustomer` | Grep su `useUpdateCustomer` / `UpdateCustomerInput` prima del validate finale |

Nessun bug preesistente né prompt ambiguo su questo task.

---

## Cosa resta per la prossima sessione

Niente legato a questo fix. `docs/FOLLOW_UP.md` invariato.

---

## Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt esecuzione completo con header «Profilo: Esecuzione / Modalità: standard / Skill: ADMIN_SKILL + ADMIN_CRM_CONTEXT», obiettivo rubrica CRM righe distinte per email+nome, comportamento atteso punti 1–6, file probabili, vincoli (no migrazione DB, customers.email UNIQUE, validate verde), criterio di fatto e chiusura sessione. (2) «lavoro ok e controtestato da me».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato con `git status --short` e `git diff --stat`: 15 file modificati + 1 nuovo (`useCustomerMutations.test.ts`); +348/−141 righe. Conteggio test 888/888 da output validate. File elencati in tabella corrispondono al diff. `profileKey` presente in `customer.ts` e usato in `CustomerListTable`/`CustomerDirectoryTab`. `dedupeProfilesByEmail` in `promoRecipientEligibility.ts` e chiamato da `PromoRecipientPicker`. §5–§6 `ADMIN_CRM_CONTEXT.md` aggiornati.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati: `ADMIN_CRM_CONTEXT.md` §5–§6; tipi `customer.ts`; helper `customerEmail.ts`; test `useCustomers.test.ts`, `useCustomerMutations.test.ts`, `promoRecipientEligibility.test.ts`, blindatura CRM con `profileKey` nei mock. `CampaignEditor`/`CampaignsManager` usano già `Set` su email per contatori — nessun adattamento necessario oltre dedupe nel picker. `ADMIN_SKILL.md` entry non toccata (suggerimento solo in lettura sessione).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non eseguiti: commit/push (solo su «fai report finale»); migrazione DB (esplicitamente vietata); E2E Playwright su Rubrica (non richiesti — solo unit/component); aggiornamento riga in `ADMIN_SKILL.md` principale (solo context CRM aggiornato, come da scope prompt). Ne sono certo perché il prompt elencava output attesi espliciti e `npm run validate` è verde senza task aperti nel diff.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuti attriti, immagina quello più probabile.)
✅ R5: Attrito minore su secondo call site `useUpdateCustomer` non aggiornato al primo giro — miglioria: in prompt CRM includere checklist grep «tutti i call site di useUpdateCustomer/useDeleteCustomer» quando si aggiunge un campo a `UpdateCustomerInput`/`DeleteCustomerInput`.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto — prompt ha indicato di caricare solo `ADMIN_CRM_CONTEXT` senza APP_CONTEXT intero; sufficiente per scope. Regole comandi-base (lavoro ok → report, no commit) rispettate. Nessun hook MCP/browser necessario per questo task frontend puro.
```

---

## Self-review (§12)

1. **Dati = diff reale** — verificato con git status/diff e riapertura file citati. OK.
2. **File correlati** — `ADMIN_CRM_CONTEXT` §5–§6 allineato in stesso ciclo. OK.
3. **Q1–Q6** — compilate con sostanza; Q2/Q3 basate su rilettura diff. OK.
4. **Tono utente** — cappello e «cosa è stato fatto» per schermate/flussi. OK.

---

## Checklist QA per Matteo (Rubrica)

- [x] Due prenotazioni stessa email, nomi diversi → **2 righe** con N° prenotazioni e date corrette per ciascun nome
- [x] Elimina una riga → sparisce solo quel nome; l’altra riga resta
- [x] Modifica nome/telefono su una riga → aggiorna solo le prenotazioni di quell’identità
- [x] Personalizza email → picker campagna: stessa email **non** duplicata

**✅ Verificato live in PROD da Matteo (20-06-26): tutti i punti OK.**

---

## Terminali

Puoi chiudere eventuali tab terminale lasciate dall’agente (es. `npm run validate`); tieni il tuo `npm run dev` se stai ancora lavorando in locale.
