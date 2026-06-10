# Report — Limiti testo Pagina Prenota (03-06-26)

## 1. Cappello

- **Cosa è cambiato:** su `/prenota/:slug` i testi hanno limiti coerenti: in **Personalizza form** il ristoratore vede i contatori `N/max` su copy vetrina; il **cliente** può scrivere liberamente entro cap generosi **senza** mai vedere «max N caratteri».
- **Cosa resta:** deploy edge `create-booking` su **TEST**; QA manuale viewport 375/900/1256; `courses_label` ancora solo admin (non in pagina pubblica).
- **Serve una tua azione:** sì — verifica rapida in locale + conferma deploy edge TEST quando pronto.

---

## 2. Cosa è stato fatto

1. **Pianificazione con Matteo (limite per limite):** concordati numeri A–H (header, tipologie, sottotab, carosello, promo, campi cliente).
2. **Mappa documentale** `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` con colonna visibilità limite (`admin-contatore` / `sistema-silenzioso`).
3. **Costanti centrali** in `bookingPrenotaTextLimits.ts` — un solo posto per numeri ristoratore + cliente + carosello.
4. **Personalizza form (`BookingFormConfigPanel`):** titolo pagina 65, descrizione 120 con contatore; font descrizione header max **22px** (nome/titolo fino 38); tipologie titolo 40 + contatore; sottotab descrizione 65, portate 12; rimosso duplicato locale `AdminFieldWithCharCount`.
5. **Promo admin:** titolo 60, messaggio 350 (`BookingFormPromoSection`).
6. **Salvataggio config:** `normalizeBookingPublicFormConfig` tronca copy ristoratore ai cap al Salva; migrate-on-read font descrizione ≤22px.
7. **Form pubblico cliente:** nome 65, email 65, tel 30, intolleranze/richieste 700 — `maxLength` silenzioso; submit con «Testo troppo lungo» se bypass.
8. **Edge `create-booking`:** stessi limiti cliente + messaggi generici (sync commentato nel file Deno).
9. **Test:** `npm run validate` verde (284 test).
10. **Skill area** allineate (layout Prenota + Personalizza form).

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `src/features/booking/constants/bookingPrenotaTextLimits.ts` | Fonte unica limiti + helper clamp/validate |
| `src/features/booking/constants/bookingPublicFormConfig.ts` | Re-export carosello; normalizer + fontSize per target |
| `src/features/booking/components/settings/BookingFormConfigPanel.tsx` | Contatori admin, cap header/tipologie/sottotab |
| `src/features/booking/components/settings/BookingFormPromoSection.tsx` | Promo 60/350 |
| `src/features/booking/components/publicBooking/BookingFormFields.tsx` | Cap silenzioso nome/email/tel |
| `src/features/booking/components/DietaryRestrictionsSection.tsx` | Cap silenzioso 700 intolleranze/richieste |
| `src/features/booking/components/BookingRequestForm.tsx` | Validazione submit lunghezza testi |
| `supabase/functions/create-booking/index.ts` | Validazione server allineata |
| `src/features/booking/constants/__tests__/bookingPrenotaTextLimits.test.ts` | Test helper |
| `src/features/booking/constants/__tests__/bookingPublicFormConfig.test.ts` | Test clamp + font 22px |
| `docs/per-ui-design-skill/BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` | Mappa 1:1 (nuovo, `git add -f`) |
| `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §8.1 limiti testo |
| `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | Tabella limiti + sottotab/promo/carosello |

---

## 4. Test eseguiti e risultato

| Comando | Esito |
|---------|--------|
| `npm run validate` (lint + typecheck + vitest) | **Verde** — 34 file, 284 test |

**QA manuale browser (375 / 900 / 1256):** non eseguita in questa sessione — rimandata a Matteo.

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §8.1 Limiti testo; §9 punto 5 validate lunghezza | Comportamento pubblico + submit «Testo troppo lungo» |
| `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | § Stato attuale header (65/120, font 8–22 desc); § Limiti testo; sottotab 65/12; promo 60/350; carosello → `bookingPrenotaTextLimits.ts` | Allineato post-implementazione (integrato in chiusura hook) |
| `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` | **Nuovo** documento mappa | Deliverable Fase 1 concordato |

---

## 6. Dati comunicazione

### Prompt verbatim di Matteo (fase raccolta)

1. *(task iniziale — estratto)* «Profilo: Esecuzione · Modalità: deep · … Limiti caratteri coerenti su Pagina Prenota … Regola UX obbligatoria — limite visibile vs silenzioso … Output attesi: mappa BOOKING_PRENOTA_TEXT_LIMITS_MAP.md, costanti bookingPrenotaTextLimits.ts, skill allineate, npm run validate verde.»
2. «vorrei aanche decidere insieme il limite per ogni sezione … procedi per gradi mostrandomene massimo 3 alla volta e poi proseguiamo.»
3. «scusa numero portate limite 12 char. domanda 6 non aggiugiamo per card per ora controllo font. proseguiamo»
4. «ti sono arrivate le mie ultime risposte?»
5. *(risposta form H, verbatim)* «riduci nome a 65, e email anche a 65 , telefono e ospiti ok, e note e intolleranze max 700»
6. «procedi con il fix»
7. «lavoro ok.»
8. *(hook fine-sessione v3 — messaggio `📄 FINE-SESSIONE` auto-rilanciato da `.cursor/hooks/fine-sessione-nudge.mjs` su `stop`)* «PRIMA DI CHIUDERE — completa il report seguendo: docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (Parte A) … sezione 8 … prompt verbatim … allineamento skill … voci Liv.2»
9. «hai ricevuto hook durante questa chat di lavoro? aggiungi nel report tutti i passagi steuttueali ricevuti da skill system»
10. *(hook fine-sessione v3 — 2° rilancio `stop`)* «📄 FINE-SESSIONE — 1 report toccato/i. Prima che la chat chiuda, RILEGGI la procedura e verifica che le sezioni siano PIENE e allineate…»

### Scelte numeriche concordate (AskQuestion + correzioni)

| Turno | Esito |
|-------|--------|
| A header | nome 40 · titolo **65** · descrizione **120** · font descrizione max **22px** |
| B tipologie | titolo **40** · descrizione **61** · nessun controllo font px |
| C sottotab | titolo 30 · descrizione **65** · portate **12** (correzione da 21) |
| D carosello | 19 / 18 / 38 invariati |
| F promo | titolo **60** · messaggio **350** |
| H cliente | nome/email **65** · tel **30** · intolleranze/richieste **700** · ospiti **999** |

### Voci lessico / profilo (esito Liv.2 dove applicabile)

| Voce / comando | Liv. (rule/skill) | Esito sessione |
|----------------|-------------------|----------------|
| «implementa» / «procedi con il fix» | Profilo **Esecuzione** (comandi-base) | **ok** — codice + test senza rework di scope |
| «lavoro ok» | Chiusura report (comandi-base Liv.1) | **ok** — report scritto; hook ha chiesto integrazione §6/§8 |
| Iterazione «3 campi per turno» | Richiesta esplicita Matteo (non in VOCABOLARIO) | **ok** — ha evitato overload; Matteo ha corretto H e portate |
| AskQuestion H saltato | — | **corretto-da-Matteo** — chiarimento «ti sono arrivate…» + scelta 65/700 |

**Formato efficace:** proposta + criterio (layout vetrina vs cap anti-abuso cliente) + opzioni; Matteo risponde con numeri o una frase correttiva.

**Automatizzabile:** mappa generata da costanti TS; CI che confronta edge ↔ `bookingPrenotaTextLimits.ts`.

**Manuale:** deploy edge TEST; QA viewport; UI futura `courses_label`.

---

## 6b. Passaggi strutturali skill system, regole e hook

### Hook ricevuto in questa chat?

**Sì — 2 rilanci `stop` (v3 `followup_message`).**  
Il contenuto arriva come **messaggio utente** con prefisso `📄 FINE-SESSIONE` ( [`.cursor/hooks/fine-sessione-nudge.mjs`](../../../.cursor/hooks/fine-sessione-nudge.mjs) su `stop`, dopo «lavoro ok»). Non è tool call in mezzo al lavoro.  
**1° hook:** §6 verbatim + Liv.2, §8 espansa, skill header 65/120/22px.  
**2° hook (questo turno):** verifica diff vs report — **mappa `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` mancante su disco** (citata ma non scritta) → **creata**; §9 layout skill integrato con validate lunghezza «Testo troppo lungo»; §6b/§8 aggiornati.

### Cronologia strutturale (ordine reale)

| # | Fase | Passaggio strutturale | Effetto sull'agente |
|---|------|----------------------|---------------------|
| 1 | Avvio | **Profilo Esecuzione** + **modalità deep** nel prompt Matteo | Piano prima del codice; output attesi definiti (mappa, costanti, skill, validate) |
| 2 | Avvio | **system_reminder Plan mode** | Solo lettura + `CreatePlan` / `AskQuestion`; **vietate** modifiche file |
| 3 | Avvio | **Regola workspace** [`.cursor/rules/comandi-base.mdc`](../../../.cursor/rules/comandi-base.mdc) | «implementa»→Esecuzione; «lavoro ok»→report; skill area Prenota; `git add -f` docs; TEST MCP |
| 4 | Avvio | **Skill caricate** (da prompt + APP_CONTEXT): `APP_CONTEXT_SKILL` §0/§4 LOCK, `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT`, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT`, `BOOKING_DATA_FLOW` (se resolver) | Vincoli: solo `/prenota/:slug`, LOCK griglia, no payload `useCreateBookingRequest` |
| 5 | Piano | **`CreatePlan`** → `.cursor/plans/limiti_testo_prenota_acf95e24.plan.md` | Piano con decisioni A–H; todo Fase 1/2 |
| 6 | Piano | **`AskQuestion`** (3 campi per turno) | Numeri concordati sezione per sezione con Matteo |
| 7 | Piano | **Iterazione piano** (correzioni Matteo: portate 12, no font tipologie, H 65/700) | Piano aggiornato prima dell'implementazione |
| 8 | Esecuzione | **system_reminder:** «You are now in Agent mode» (post «procedi con il fix») | Sblocco scrittura codice + docs |
| 9 | Esecuzione | **`npm run validate`** obbligatorio (profilo Verifica light citato nel piano) | 284 test verdi |
| 10 | Chiusura | **«lavoro ok»** → [CHIUSURA_SESSIONE.md](../../../docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md) Parte A | Report `Report-limiti-testo-prenota-03-06-26.md`; **no commit** (solo su «fai report finale») |
| 11 | Hook | **`📄 FINE-SESSIONE`** (1° stop hook v3) | Report: verbatim, §8, skill header |
| 12 | Post-hook | Matteo: hook + passaggi strutturali | §6b iniziale |
| 13 | Hook | **`📄 FINE-SESSIONE`** (2° stop — verifica pienezza) | Mappa creata; §9 layout; report allineato diff |

### Regole / vincoli strutturali applicati (checklist)

| Fonte | Vincolo | Rispettato |
|-------|---------|------------|
| Prompt task | Cliente: cap silenzioso, no contatore pubblico | sì |
| Prompt task | Ristoratore: contatore admin + cap layout | sì |
| LOCK §0 | Non alterare griglia `BookingRequestPage` | sì (solo figli) |
| Prompt task | Non toccare shape `useCreateBookingRequest` | sì |
| comandi-base | Migration / edge solo TEST; PROD con conferma | sì (edge modificato in repo, deploy non eseguito) |
| comandi-base | Allineamento skill implicito a chiusura | sì (+ fix header post-hook) |
| CHIUSURA §5 | Skill area aggiornate se diff cambia comportamento | sì |
| CHIUSURA §10 | `git add -f` per nuovi file in `docs/` | documentato, commit non richiesto |
| Plan mode → Agent | Modalità solo alzata (deep → agent), mai abbassata | sì |

### Hook `fine-sessione-nudge` — cosa controlla (riferimento)

Per report standard/deep il marker cerca almeno: **«Dati comunicazione»**, **«Analisi flusso prompt»**; chiede esplicitamente **§8 lettura sessione**, prompt verbatim, allineamento skill, esiti Liv.2.  
Politica 03-06-26: anche se le sezioni esistono, **1 followup** per verificare che siano piene e allineate al codice — non solo placeholder.

### Hook / passaggi NON ricevuti in chat

- Nessun invito a **«fai report finale»** (commit/push non eseguiti).
- Nessun **`stop` hook** prima di «lavoro ok» (hook attivo solo a fine chat con report recente).
- Nessuna sessione **Meta revisore** / `REVISIONE.md`.
- Nessun comando **«dammi follow up»**.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali Matteo:** ~8 (piano → iterazione limiti → correzioni H → implementa → lavoro ok → 2× hook/chiusura).
- **Correzioni dopo 1ª risposta:** sì — portate 21→12; H 100/254→65/65/700; chiarimento domanda 6 (no font tipologie).
- **Follow-up generati:** deploy edge TEST; QA viewport; `courses_label` non renderizzato.
- **Modalità:** deep (piano) → agent (implementazione); non abbassata.

**Efficace:** piano con decisioni concordate prima del codice; regola UX cliente silenzioso vs admin contatore.

**Migliorare:** chiarire subito che AskQuestion saltato ≠ assenso (H iniziale).

---

## 8. La tua lettura della sessione ⭐

### Impressioni (skill system + flusso)

- **Piano prima, codice dopo:** la sessione deep con scelta limite-per-limite ha tenuto bene: zero revert sui numeri cliente dopo l’implementazione.
- **Skill area:** `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT` §8.1 e tabella in `BOOKING_FORM_CONFIG` bastavano come aggancio; mancava ancora il blocco **Stato attuale → header** (font 8–38 globale obsoleto) — **corretto in chiusura hook** (65/120 char + max 22px descrizione).
- **Regola UX cliente silenzioso vs admin contatore:** chiara nel prompt iniziale; nessuna deriva verso contatori pubblici.
- **Duplicazione edge:** vincolo Deno accettabile; commento sync presente; rischio drift futuro resta il punto debole del design.

### Difficoltà incontrate e correzioni applicate

| Problema | Soluzione | Stato |
|----------|-----------|--------|
| `BOOKING_HEADER_FONT_OPTIONS` corrotto in refactor import | Ripristinato `{ id: 'playfair', … }` + validate | **risolto in sessione** |
| `const C` / `textTooLong` usati prima della dichiarazione in `validate()` | Spostati in cima a `validate()` | **risolto in sessione** |
| AskQuestion H saltato → assunzione 100/254 | Matteo ha corretto via «riduci nome a 65…» | **allineato post-sessione** |
| Skill header ancora «8–38 px» per tutti i target | Aggiornato `BOOKING_FORM_CONFIG` § Stato attuale | **risolto in chiusura hook** |
| Report §6 solo sintesi, no verbatim | Integrati prompt verbatim + tabella Liv.2 | **risolto in chiusura hook** |
| Mappa `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` citata ma assente | Creata da costanti + tabella concordata | **risolto in 2° hook** |
| §9 layout senza validate lunghezza testo | Aggiunto punto 5 in `BOOKING_REQUEST` §9 | **risolto in 2° hook** |

### Migliorie suggerite (dato per revisore / Meta — non implementate)

1. Script CI `check-booking-limits-sync` (edge vs `bookingPrenotaTextLimits.ts`).
2. Promuovere in VOCABOLARIO la regola «3 campi per turno» per task limiti/mappe (oggi solo prassi sessione).
3. Aggiornare **FU-009** (campi form cliente parzialmente coperti da questa sessione).
4. Sessione dedicata: UI pubblica per `courses_label` o nascondere campo admin.

### Errori e classificazione (incroci con §9)

- **Preesistente risolto:** nome UI 60 vs edge 200 → ora **65** ovunque.
- **Errore agente (2):** parse/typecheck catchable con validate più frequente mid-edit.
- **Vincolo strutturale (1):** limiti duplicati in edge — mitigato, non eliminabile senza bundler condiviso.

*Versione agente: sessione produttiva; debito residuo = deploy edge + QA browser, non codice bloccante.*

---

## 9. Derivazione errori

| # | Tipo | Cosa | Evitabile come |
|---|------|------|----------------|
| 1 | **errore agente** | Array `BOOKING_HEADER_FONT_OPTIONS` troncato in edit | Replace più piccoli / typecheck subito dopo ogni edit a `bookingPublicFormConfig.ts` |
| 2 | **errore agente** | `C` usata prima della dichiarazione in `validate()` | Dichiarare limiti all’inizio della funzione |
| 3 | **vincolo strutturale** | Limiti duplicati in edge Deno | Accettato; mitigazione = commento sync + script CI (suggerito §8) |

**Correzioni post-«lavoro ok» (hook):** skill header 8–38 obsoleta; report §6/§8 insufficienti; mappa deliverable mancante — vedi §8 tabella «Difficoltà».

Nessun bug preesistente scoperto oltre incoerenze note (nome UI 60 vs edge 200) — **risolte**.

---

## 10. Cosa resta per la prossima sessione

| Voce | Azione |
|------|--------|
| **Deploy edge** | `create-booking` su Supabase **TEST** (`docnnernvp`); PROD solo con conferma Matteo |
| **QA manuale** | `/prenota/:slug` a 375 / 900 / 1256: copy admin al limite; cliente paragrafo ~700 char intolleranze senza contatore |
| **`courses_label`** | Campo admin max 12; non in pubblico — backlog: nascondi o collega UI card |
| **FU-009** | Aggiornare in FOLLOW_UP: limiti campi cliente mappati/implementati (parziale chiusura) |
| **Commit** | Su «fai report finale»: commit codice + commit docs separati; `git add -f` per mappa e report nuovi in `docs/` |

---

## Tabella limiti concordati (riferimento rapido)

| Zona | Campo | Limite |
|------|-------|--------|
| A | Nome azienda (Anagrafica) | 40 |
| A | Titolo pagina | 65 |
| A | Descrizione pagina | 120 |
| A | Font px descrizione | 8–22 |
| B | Titolo tipologia | 40 |
| B | Descrizione tipologia | 61 |
| C | Titolo card | 30 |
| C | Descrizione card | 65 |
| C | Portate | 12 (non pubblico) |
| D | Carosello eyebrow/title/desc | 19 / 18 / 38 |
| F | Promo titolo / messaggio | 60 / 350 |
| H | Nome / email / tel | 65 / 65 / 30 |
| H | Intolleranze / richieste | 700 / 700 |
| H | Ospiti max | 999 |

**Review (commit futuro):** report questo file · mappa `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` · skill §8.1 / limiti Personalizza form · `bookingPrenotaTextLimits.ts`.
