# Prompt orchestrator senior — WP-1 istanza 2 ombra: checklist QA manuale Servizio

> **Uso:** incolla in una **nuova** chat su `env/test`.  
> **Istanza:** **2 di N** di `WP-1` — **non** chiudere WP-1 a fine chat.  
> **Owner MSS:** `docs/MetaSkillSystem/PLAN_V0.md` (§7 WP-1 · §15 T14).  
> **Istanza 1 (già chiusa):** `Report-wp1-istanza1-servizio-blindatura-25-08-26.md` — blindatura test automatici.  
> **Questa istanza:** solo documentazione checklist per collaudo umano Matteo; **zero** `src/`.

---

## Intestazione agente

```
Profilo: Prepara / orchestrazione (docs only) — istanza 2 WP-1 ombra
Modalità: deep
Protocollo pilota: MSS-PILOT-001 · capsula mss.session/0.1.1 / freeze-2
Skill da leggere (in ordine):
  - docs/COMUNICAZIONE_UTENTE_SKILL.md (§ Piani e preparazione · Regola zero)
  - docs/Admin-Skill/ADMIN_SKILL.md
  - docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md
  - docs/Testing-Skill/TESTING_SKILL.md §8
  - docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md (file da aggiornare)
  - docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md (riferimento storico)
  - docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md §5 Servizio
  - docs/Servizio-Config/GUIDA_CONFIGURAZIONE_CLIENTE.md Blocco 4
  - docs/FOLLOW_UP.md (FU-SERV-* aperti)
  - docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza1-servizio-blindatura-25-08-26.md
  - docs/Sessioni di lavoro/06-08-26/Report-collaudo-filtrato-e-piano-multiagente-06-08-26.md
  - docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md
  - docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md
  - docs/Sessioni di lavoro/25-08-26/Piano-esecutore-wp1-istanza2-checklist-qa-servizio-25-08-26.md (mandato sub-agent)
Non caricare: cutover WP-6 · corpus MSS storico non puntato · Senior-Eval intero
```

---

## Contesto MSS (ombra — istanza 2)

- **Confronto operativo:** vecchio skill system resta attivo; questa istanza calibra anche *come* MSS
  orchestra sub-agent vs preparazione «normale» (gap-analysis già fatta il 06-08).
- Cutover **vietato**. `SEP-G5` non PASS. Non inventare metriche Persona.
- **Istanza 1** = test/fix automatici Servizio (verde). **Istanza 2** = checklist umana per Matteo;
  non rifare ciò già coperto da Vitest/E2E (vedi `COLLAUDO_MANUALE_OBBLIGATORIO.md` §5).
- Chiudi l'**istanza** con report + capsula (`mss:capsule`) + `validate:mss --require-capsule`.
  **Non** dichiarare WP-1 «finito».

---

## Decisioni Matteo (25-08-26 — vincolanti)

| # | Decisione |
|---|---|
| 1 | **Setup dati:** sala **dedicata** al collaudo (es. «QA-Manuale»), non sporcare sala operativa |
| 2 | **Deliverable:** **aggiornare** `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` (non nuovo file parallelo) |
| 3 | **FU-SERV-*:** solo **verifica e annotazione** OK/KO in checklist — **nessun fix** `src/` in questa istanza |

---

## Obiettivo prodotto (istanza 2)

**Per Matteo:** un unico documento checklist, in ordine di click, che copre:

1. **Setup da zero** — creare sala dedicata, tavoli, fasce (manca oggi in §0.3 che assume dati pronti)
2. **Validazione modali** — errori compilazione, casi limite (messaggi a schermo, non solo unit test)
3. **Prove umane T1–T16** — refresh etichette pulsanti da codice; formato A sequenza / B atteso / C trappole
4. **FU da confermare a mano** — soprattutto elimina sala vs elimina tavolo (`FU-SERV-TURNO-SALA-1`)

**Escluso:** 38+ argomenti già in §5 «non rifare» + copertura WP1 istanza 1 (257 Vitest + E2E 6+13).

---

## Orchestrazione — 3 sub-agent (sequenza obbligatoria)

Leggi e applica: `Piano-esecutore-wp1-istanza2-checklist-qa-servizio-25-08-26.md`

| Fase | Sub-agent | Output |
|---|---|---|
| 1 | `explore` (very thorough) | `Gap-analysis-Servizio-QA-manuale-25-08-26.md` |
| 2 | `generalPurpose` | Schema blocchi + ordine + stime (input fase 1) |
| 3 | `generalPurpose` | Aggiornamento `COLLAUDO_MANUALE_OBBLIGATORIO.md` |

**Tu (orchestrator):** riverifica etichette UI campionando 2–3 modali; non pubblicare gap-analysis senza
controverifica su almeno una voce «SCOPERTA» vs «COPERTA».

---

## Perimetro scrittura

| Consentito | Vietato |
|---|---|
| `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` | `src/` · migrazioni · PROD |
| `docs/Sessioni di lavoro/25-08-26/Gap-analysis-*.md` | Fix FU-SERV senza sì Matteo |
| Report istanza 2 + capsula + eventuale nota breve ADMIN_TEST_SUITE (solo riga «checklist umana agg.») | «WP-1 chiuso» · cutover |
| `npm run mss:status` · `validate:docs` (se tocchi path) | Playwright al posto di Matteo per voci SOLO UMANO |

Branch: `env/test`. Commit/push solo con sì Matteo.

---

## Criterio chiusura **istanza 2** (non WP-1)

- [ ] `npm run mss:status` exit 0 (WP-1 IN PILOTA ombra)
- [ ] Gap-analysis consegnata con tabelle INCLUSO / ESCLUSO / DA BUTTARE
- [ ] `COLLAUDO_MANUALE_OBBLIGATORIO.md` aggiornato: blocco setup da zero + validazione + T1–T16 refresh + §5 allineato a WP1
- [ ] Prova esplicita **FU-SERV-TURNO-SALA-1** (elimina sala vs tavolo — comportamento atteso oggi, non fix)
- [ ] Report `Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md` con §11 Q/R complete
- [ ] Capsula con `controls[]` reali; sezione breve «MSS vs skill normale» (osservazione, non verdetto Persona)
- [ ] Handoff: Matteo esegue checklist; formato esiti `T# — OK/KO: …`

**Dopo questa chat:** revisione fredda (altra chat) — capsula + owner, non narrativa completa.

---

## STOP

- Scope che diventa fix prodotto Servizio
- Inventare copertura test o esiti collaudo
- «WP-1 chiuso» / cutover
