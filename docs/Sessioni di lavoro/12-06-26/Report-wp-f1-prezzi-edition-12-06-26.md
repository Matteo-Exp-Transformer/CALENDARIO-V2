# Report WP-F1 — Prezzi edition — 12-06-26

**Cosa è cambiato:** il listino commerciale (Classic, Pro, Enterprise, add-on Menu QR, fondatori, trial, setup) è scritto e approvato nei documenti Marketing — non più «da definire».
**Cosa resta:** WP-F2 (stato legale produzione), WP-E1–E3 (Meta), WP-B4 ancora aperto nel masterplan.
**Serve una tua azione:** no — puoi usare il listino in demo/vendita; supplemento foto oltre 25 ancora da definire al primo ordine.

---

## Cosa è stato fatto

1. Intervista a fasi con Matteo: prezzi base (B), Enterprise E1, condizioni lancio L1–L5.
2. Scritto `EDITION_PRICING_CONTEXT.md` con listino approvato, fondatori −50% per 3 mesi, trial 30 gg, setup/fotografo, referral, regola «zero commissioni».
3. Allineati puntatori in `MARKETING_SKILL.md` e prezzo add-on in `FEATURE_CATALOG_CONTEXT.md`.
4. Masterplan: WP-F1 → ✅.

### Listino approvato (sintesi)

| Voce | Valore |
|------|--------|
| Classic | 29€/mese · 290€/anno |
| Menu QR add-on | +16€/mese · +160€/anno |
| Pro | 79€/mese · 790€/anno (QR incluso) |
| Enterprise | 129€/sede/mese · 1.290€/anno — solo preventivo |
| Fondatori | −50% mesi 1–3, poi cambio piano o rinnovo a listino |
| Trial | 30 giorni, senza carta |
| Setup | incluso fondatori; poi 100€ |
| Fotografo | 200€ fino a 25 foto; oltre supplemento da definire |
| Referral | 1 mese gratis |
| Posizionamento | zero commissioni a coperto, mai |

---

## File toccati e perché

| File | Perché |
|------|--------|
| `docs/Marketing-Skill/EDITION_PRICING_CONTEXT.md` | Fonte listino operativo WP-F1 |
| `docs/Marketing-Skill/MARKETING_SKILL.md` §6 | Puntatore aggiornato |
| `docs/Marketing-Skill/FEATURE_CATALOG_CONTEXT.md` | Prezzo add-on `qrMenu` |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | Stato WP-F1 ✅ + link report |

---

## Test eseguiti

- `npm run validate` — eseguito in chiusura (solo docs, atteso verde).

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `EDITION_PRICING_CONTEXT.md` | Listino completo | Cancello WP-F1 |
| `MARKETING_SKILL.md` | §6 non più «da compilare» | Allineamento puntatore |
| `FEATURE_CATALOG_CONTEXT.md` | Colonna prezzo `qrMenu` | Coerenza add-on |

---

## Dati comunicazione

- Matteo preferisce **intervista a fasi con opzioni letterate** (A/B/C…, L1/L2…) per decisioni commerciali.
- Ha modificato la proposta report: QR **16€**, Pro **79€**, Enterprise **129€**; fondatori **−50% per 3 mesi** (non 12); setup incluso **solo fondatori**, poi 100€ + pacchetto fotografo 200€/25 foto.
- Formato efficace: tabella riepilogo + conferma esplicita fase per fase.

---

## Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: ~3 (avvio masterplan righe 59–63; scelte Fase 1 B+E1; scelte Fase 2 L1–L5 + conferma 1b).
- Correzioni dopo 1ª risposta: 0.
- Follow-up generati: passaggio a WP-F2 suggerito in chiusura chat, non in FU.
- Modalità: standard (docs + decisione prodotto).

---

## La mia lettura della sessione

**Impressioni:** WP-F1 è il caso ideale per intervista guidata — zero codice, massimo valore se le decisioni restano tracciate. Il report legale-vendita come fonte ha funzionato; Matteo ha ritoccato solo i numeri sensibili (QR, Pro, durata fondatori).

**Difficoltà:** nessuna tecnica. Unico punto da non dimenticare: supplemento foto oltre 25 resta volutamente «da definire».

**Miglioria suggerita (dato, non implementata):** in `MASTERPLAN_ALLINEAMENTO.md` WP-F1 potrebbe linkare anche `TARGET_CUSTOMERS_CONTEXT.md` nei file esatti, per incrociare copy vendita al listino — opzionale.

---

## Derivazione errori

Nessuna difficoltà rilevante in questa sessione.

---

## Cosa resta per la prossima sessione

- **WP-F2** — Stato legale produzione (`LEGAL_STATE_CONTEXT.md`): partita IVA, contratto B2B, fattura elettronica, EAA, region Supabase — stesso formato intervista.
- **WP-E1–E3** — sessioni Meta (design, non implementazione).
- Supplemento fotografo oltre 25 foto: definire al primo cliente che lo chiede.

Nessuna nuova riga in `FOLLOW_UP.md` per questo WP.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «seguimi nello svolgere queste task : @MASTERPLAN_ALLINEAMENTO.md (59-63) , di @docs/MASTERPLAN_ALLINEAMENTO.md . procediamo come un intervista a fasi, dove mi darai opzioni tra cui scegliere- partiamo dalla prima task da fare.» · «1. B cambia solo + menu QR = 16 € ; pro a 79 ; entrerprise 129€ - E1 .» · «1b. ok confermo tutti e due. L1 . si 50 % ma per i primi 3 mesi. poi possibilità di cambiare il piano o di rinnovarlo uguale. L2.a L3.a ma solo per fondatori, poi costa 100€ setup e 200 anche fotografo per piatti ( fino a 25 foto poi supplemento da definire) L4. A L5.A»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti `EDITION_PRICING_CONTEXT.md` (29/16/79/129, annuale ×10, fondatori −50%×3, trial 30 gg, setup 100€, foto 200€/25, referral, zero commissioni), `FEATURE_CATALOG_CONTEXT.md` (qrMenu +16€), `MARKETING_SKILL.md` §6, riga masterplan WP-F1 ✅. Nessun file codice toccato.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati i tre file Marketing citati nel WP + masterplan. `src/config/features.ts` e tipi edition non richiedono modifica (WP vietava codice). Nessun test da aggiornare.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non aggiornato `Report-analisi-legale-vendita-12-06-26.md` (resta fonte storica con numeri proposta originale — le decisioni vivono in `EDITION_PRICING_CONTEXT.md`). Non definito supplemento foto >25. Non toccato WP-F2 né FOLLOW_UP.md — fuori scope WP-F1.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + miglioria nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito basso; rischio futuro: agente che copia ancora i prezzi del report legale invece di `EDITION_PRICING_CONTEXT.md` — miglioria: una riga in `MARKETING_SKILL.md` §6 «fonte canonica = EDITION_PRICING_CONTEXT, report 12-06-26 solo storico» (già implicito nel context, si potrebbe esplicitare).

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto — masterplan WP-F1 + report legale + file pricing vuoto bastavano. Nessun hook fine-sessione in questa chat fino a ora.
