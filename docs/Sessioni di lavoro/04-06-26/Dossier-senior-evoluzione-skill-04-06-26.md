# Dossier per agente senior — evoluzione skill system (04-06-26)

**Prodotto da:** agente revisore comunicazione  
**Destinatario:** agente senior Meta (Opus 4.8+)  
**Modalità attesa:** deep  
**Innesco Matteo:** «sei agente skill comunicazione di skill system. fai revisione skill system e analizza i report per fornire dati necessari a agente senior per evoluzione skill.»

---

## Come usare questo dossier

Non ri-diagnosticare: i dati sono già raccolti. Il senior legge, decide, fa avanzare le milestone.
Per ogni decisione che spetta a Matteo → `AskUserQuestion` con opzioni pesate.

File skill da leggere se serve approfondimento:
- `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` — Playbook + milestone + Log idee
- `docs/Comunicazione-Skill/ERRORI_PROCESSO.md` — errori agente classificati
- `docs/Comunicazione-Skill/OSSERVAZIONI.md` — dati su come lavora Matteo + Liv.2
- `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` — template report + procedure chiusura

---

## 1. Stato sistema — fotografia

### Hook M4 (enforcement vero)

| Hook | Stato | Funziona? |
|------|-------|-----------|
| `stop` v3 Cursor — nudge fine-chat | ✅ installato e testato | Sì — ha intercettato §6 stale 03-06 |
| `Stop` Claude Code — senior (`fine-sessione-senior.mjs`) | ✅ installato e testato | Sì — auto-provato nel report 03-06 |
| `beforeMCPExecution` guard PROD | ⬜ non costruito | In PAUSA-RACCOLTA |
| `beforeShellExecution` guard PROD | ⬜ non costruito | In PAUSA-RACCOLTA |

**Limite noto:** hook Cursor non girano su Cloud Agents. Fallback = checklist nel prompt esecutore. Dati su quanto viene applicato: **zero** (non misurato).

### Motore Liv.2

| Voce | ok | dom-superflua | corretto | Segnale |
|------|----|---------------|---------|---------|
| «main dell'app» | 0 | 0 | 0 | **Non scatta mai o non viene registrato** |
| «menù originale» | 0 | 0 | 0 | **Non scatta mai o non viene registrato** |
| «revisiona e se ok committa» | 1 | 0 | 0 | Candidata Liv.1 — pochi dati |
| «compila report comunicazione» | 2 | 0 | 0 | Era candidata Liv.1 ma è «pezza a dimenticanza agenti» — meglio enforcement |

**Domanda aperta:** le voci lessicali («main dell'app», «menù originale») non scattano perché Matteo non le usa, o perché gli agenti le incontrano e non registrano? Il senior deve capire quale delle due prima di decidere se tenerle o eliminarle.

---

## 2. Errori agente ricorrenti — candidati a regola o enforcement

### E-A: Aggiorna solo la sezione nuova, non l'intero file skill

**Cosa succede:** esecutore aggiorna §8.1 di `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` con i nuovi numeri, ma §6 dello stesso file resta con i vecchi (60/120/300 invece di 65/30/700). Rilevato post-«lavoro ok», corretto dall'hook stop.  
**Causa:** errore agente — allineamento applicato a pezzi senza rileggere l'intero file.  
**Occorrenze:** 1 (grave — avrebbe alimentato agenti futuri con dati sbagliati).  
**Candidato a:** regola in `CHIUSURA_SESSIONE.md` §5 («rileggi **tutto** il file skill toccato, non solo la sezione aggiunta, grep numeri legacy») **oppure** check aggiuntivo nell'hook `stop`.

**Domanda per il senior:** regola markdown (governance soft) o aggiunta all'hook (enforcement)?

### E-B: Cita un file skill prima di crearlo su disco

**Cosa succede:** l'esecutore scrive nella skill «vedi `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md`» prima che il file esista. Link rotto finché la revisione non lo crea.  
**Causa:** errore agente — ordine deliverable invertito (prima scrivi nella skill, poi crei il file).  
**Occorrenze:** 1.  
**Candidato a:** regola «file citato in skill solo dopo esiste su disco» in `CHIUSURA_SESSIONE.md` §5, o checklist ordine deliverable in `PREPARA_PROMPT_SKILL.md`.

---

## 3. Debiti aperti (ordinati per impatto)

| ID | Debito | File coinvolto | Bloccante? |
|----|--------|----------------|------------|
| D1 | Propagare hook + `CHIUSURA_SESSIONE` nel template v.0 (`_skill-system-v0/comunicazione/`) | `_skill-system-v0/` (gitignored) | No — ma ogni nuova istanza parte senza le leve fine-chat |
| D2 | `beforeMCPExecution` guard PROD — valutare se rompe PAUSA-RACCOLTA | `EVOLUZIONE_SKILLS.md` M4 | No — aspetta dati |
| D3 | Decidere su E-A: markdown vs hook | `CHIUSURA_SESSIONE.md` §5 / hook `stop` | No — ma si ripeterà |
| D4 | Decidere su E-B: regola ordine deliverable | `CHIUSURA_SESSIONE.md` §5 / `PREPARA_PROMPT_SKILL.md` | No — ma si ripeterà |
| D5 | «Prompt ideale retroattivo» in `PREPARA_PROMPT_SKILL.md` §5 | `PREPARA_PROMPT_SKILL.md` | No — 1 occorrenza, attende 2ª |

---

## 4. Osservazione nuova (1 occorrenza — da valutare)

**«Prompt ideale retroattivo»** — sessione prezzo ingredienti 03-06:  
Matteo chiede al prepara-prompt di aggiungere nel report una sezione breve (2–4 righe) con «come avrei dovuto dirlo» — la frase auto-contenuta che avrebbe evitato ambiguità. Esempio: «Se la sottotab ha prezzo fisso → nascondi € ingredienti; se personalizzabile → mostrali.»  
**Non è un prompt esecutore** — è memoria condensata per sessioni simili future.  
**Stato:** 1 occorrenza. Annotata in OSSERVAZIONI. Serve 2ª per proposta matura.

---

## 5. Domande aperte per il senior (da portare a Matteo)

1. **E-A e E-B:** regola markdown o hook? (Asse B — agisce DURANTE o DOPO? → matrice §2-bis Playbook)
2. **Liv.2 voci lessicali:** tenerle in osservazione, eliminarle (mai usate), o chiedere a Matteo se le usa davvero?
3. **D1 template v.0:** pianificare sessione igiene dedicata o farlo in questa chat?
4. **PAUSA-RACCOLTA:** siamo a ~10 sessioni post-hook v2 (installato 02-06). Abbastanza dati per valutare se romperla su un candidato specifico (guard PROD MCP)?

---

## 6. Metriche sessioni post-hook v3 disponibili (input per M5)

L'hook v3 è stato installato il 03-06. Sessioni successivamente monitorate: **1** (limiti testo 03-06).  
Esiti Liv.2 live registrati: `prepara ok · lavoro ok ok · fai report finale ok`.  
Errori intercettati dall'hook: §6 stale (E-A) + report scarno (risolto in `64530d7`).  
Dati ancora troppo pochi per trend — utile come baseline.
