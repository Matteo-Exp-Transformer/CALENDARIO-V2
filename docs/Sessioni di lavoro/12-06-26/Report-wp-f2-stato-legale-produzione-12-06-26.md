# Report WP-F2 — Stato legale produzione — 12-06-26

**Cosa è cambiato:** il foglio legale «cosa manca per vendere in Italia» è aggiornato con le tue decisioni — blocchi, consigli, region DB Ireland, marchio PrenotaZen, budget.
**Cosa resta:** creare i documenti veri (contratto B2B, registro art. 30, runbook, sub-processor pubblico) in sessioni senior; P.IVA con commercialista; WP-E1–E3 Meta.
**Serve una tua azione:** sì — sentire commercialista (P.IVA); attivare fatturazione ADE; quando pronto, sessione senior per FU-LEGAL-1/2.

---

## Cosa è stato fatto

Intervista a 3 fasi (blocchi commerciali → GDPR operativo → consigli). Decisioni scritte in `LEGAL_STATE_CONTEXT.md`. Registrati FU-LEGAL-1/2/3 in `FOLLOW_UP.md`. Masterplan WP-F2 → ✅.

### Decisioni registrate (sintesi)

**Blocanti vendita**
- P.IVA: ipotesi forfettario → conferma commercialista (FU-LEGAL-3)
- Contratto B2B: bozza repo → avvocato; recesso mensile / annuale 30 gg (FU-LEGAL-1)
- Fattura elettronica: ADE gratuita
- Registro art. 30, runbook breach, sub-processor pubblico: senior → commercialista (FU-LEGAL-2)

**Consigliati**
- Marchio **PrenotaZen** + logo GPT già in login/header → TMview + UIBM prima di stampa
- RC professionale + cyber
- EAA: argomento vendita (micro esente)
- Email privacy: temporanea matteo.sistemigestionali@gmail.com
- Region Supabase PROD: **West EU (Ireland)**
- Budget anno 1: ~1.500–2.500€
- Disclaimer orientativo (non sostituisce professionisti)

**Non fatto in questo WP** (volutamente): bozze contratto/registro/runbook/sub-processor, modifica Privacy Policy per Ireland, apertura P.IVA.

---

## File toccati

| File | Perché |
|------|--------|
| `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` | Fonte stato vendita + GDPR |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-F2 ✅ |
| `docs/FOLLOW_UP.md` | FU-LEGAL-1, FU-LEGAL-2, FU-LEGAL-3 |

---

## Test

`npm run validate` — eseguito in chiusura (solo docs).

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `LEGAL_STATE_CONTEXT.md` | Riscrittura sezione vendita + region + decisioni 12-06-26 | Cancello WP-F2 |

---

## Dati comunicazione

- Stesso formato intervista lettere del WP-F1 (P1/C2/F3, G2/B2/S2/E2/R2, M2/I2/A2/€2/D2).
- Matteo ha elevato registro/runbook/sub-processor da «entro 3 mesi» a **bloccanti** con flusso senior → commercialista.
- Brand: **PrenotaZen** con logo esistente (`Icona-per-adminPage-no-bg.png` in login e header admin).

---

## La mia lettura della sessione

WP-F2 è puro tracciamento decisioni — valore alto, rischio zero codice. Separare «bloccante vendita» da «consigliato» nel file evita che un agente futuro dica «GDPR ok, vendi» senza P.IVA/contratto.

---

## Derivazione errori

Nessuna.

---

## Cosa resta

- FU-LEGAL-1: bozza contratto B2B
- FU-LEGAL-2: registro + runbook + sub-processors.md (senior)
- FU-LEGAL-3: commercialista P.IVA
- WP-E1–E3 masterplan (Meta)
- Eventuale aggiornamento Privacy Policy con region Ireland (non in scope WP-F2)

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «procediamo» (WP-F2) · «P1 a . sentirò poi mio commercialista per capire opzione migliore. C2. b. C2-R1 F3. B» · «G2. B (da fare con agente senior e poi passare a commercialista.) B2.b ( come G2. ) S2. 2 (come G2. ) E2 . C = matteo.sistemigestionali@gmail.com R2. b = West EU Ireland» · «M2. A .ho un logo fatto da gpt per me che è inserito sia in login che in admin header. userei quel logo con scritto sopra PrenotaZen I2. A A2. A €2. A D2. A»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperto `LEGAL_STATE_CONTEXT.md` (tabella blocchi, Ireland, email temp, PrenotaZen/logo, budget 1500-2500, disclaimer), `FOLLOW_UP.md` (FU-LEGAL-1/2/3), masterplan riga WP-F2 ✅. Logo: `AdminDashboard.tsx` usa `icons/Icona-per-adminPage-no-bg.png`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Solo `LEGAL_STATE_CONTEXT.md` richiesto dal WP. `LEGAL_PRODUCTION_SKILL.md` punta già al context come fonte — nessuna modifica necessaria. Privacy Policy non aggiornata (region Ireland = nota per sessione futura).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non creati contratto, registro, runbook, sub-processors.md — esplicitamente fuori scope (sessioni senior FU-LEGAL-1/2). Non aperta P.IVA né attivata ADE (azioni Matteo). Non aggiornata Privacy Policy con Ireland.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + miglioria nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito basso; rischio: `LEGAL_STATE_CONTEXT` lungo — miglioria: link ancora in `MARKETING_SKILL.md` verso § vendita Italia per agenti che partono dal commerciale.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto — file legale esistente + report 12-06-26 bastavano. Nessun hook in questa sessione.
