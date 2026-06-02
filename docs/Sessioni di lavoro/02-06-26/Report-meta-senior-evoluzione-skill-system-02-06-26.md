# Report sessione — Meta senior: evoluzione skill system comunicazione (02-06-26)

**Agente:** Meta senior (profilo evoluzione skill system)
**Innesco:** «sei agente senior comunicazione, facciamo evoluzione skill system» → dossier revisore come punto di partenza
**Modalità:** deep (tocca regole di processo + enforcement)

---

## Cappello (3 righe)
- **Cosa è cambiato:** il controllo di fine-chat ora *verifica davvero* i report invece di ricordare a vuoto; sistemate 3 incoerenze del sistema (sticky, scope creep, handoff non ratificato) + chiuse 3 pendenze del dossier.
- **Cosa resta:** niente di aperto su questa sessione; le voci Liv.2 «main dell'app»/«menù originale» restano in osservazione (raccolta dati).
- **Serve una tua azione:** no — eseguito tutto in autonomia su tua richiesta (debug + report + commit + allineamento branch/DB).

---

## 1. Punto di partenza
Sessione lanciata come Meta senior (la parola «senior» è il discriminante: evoluzione del sistema, non revisione voci). Matteo ha indirizzato: «agente revisore comunicazione ti ha preparato un dossier, parti da quello» → [Report-revisione-dossier-senior-02-06-26.md](Report-revisione-dossier-senior-02-06-26.md).

Il dossier aveva già fatto triage e diagnosi. Il mio ruolo: **decidere e far avanzare**, non ri-diagnosticare. Coda consegnata dal revisore (§8 del dossier): enforcement chiusura · scope creep · chiarire sticky · sanare deviazioni · pausa per «Analisi flusso prompt» · archiviare voci morte.

---

## 2. Decisioni prese e fatto (cosa è cambiato, in linguaggio pratico)

### 2.1 Guasto #1 — il controllo di fine-chat ora verifica davvero
**Problema:** gli agenti dimenticano di scrivere i dati di chiusura (sezione «Dati comunicazione», «Analisi flusso prompt», esiti Liv.2). Matteo compensa a voce. 4+ giorni di motore Liv.2 fermo.

**Pivot di Matteo (decisivo):** la prima ipotesi era «trasformare le pezze in righe-template». Matteo l'ha scartata: *«se era già indicato nel template del prompt, allora mettiamo hook. È evidente che non basta.»* — la sezione era **già obbligatoria** (APP_CONTEXT §7.1) e veniva saltata lo stesso → una regola markdown sopra una markdown non cura. Serve la macchina.

**Fatto:** riscritto l'hook `stop` di Cursor da **statico** (promemoria uguale per tutti, giudizio delegato all'agente) a **mirato** (`.cursor/hooks/fine-sessione-nudge.mjs` v2):
- legge i `Report-*.md` toccati negli ultimi 10 min sotto `docs/Sessioni di lavoro/`;
- controlla se contengono davvero «Dati comunicazione» + «Analisi flusso prompt»;
- avvisa **citando il file e cosa manca** — non un muro generico;
- esclude i report `revisione/verifica/meta/audit/analisi/dossier` (non hanno «Analisi flusso prompt» → niente falsi positivi);
- se non c'è report fresco → **silenzio** (niente rumore a ogni micro-chat).

**Severità scelta da Matteo: smart-allow** — avvisa, non blocca. Zero rischio di bloccare una chat legittima. Il salto a `deny` sui soli casi certi è predisposto e commentato nel file.

**Limiti onesti:** (a) non gira sui Cloud Agent (Matteo: esecutori quasi sempre IDE locale → coperto il caso normale); (b) il check Liv.2 resta promemoria (l'hook legge i file, non la chat). La verifica vera ora c'è per le **sezioni report**, che era il pezzo grosso del guasto.

→ Avanza la milestone **M4 (enforcement)** da ⬜ a 🔶: primo enforcement vero attivo.

### 2.2 «sticky» — ritirata dal vocabolario
Un agente l'aveva promossa a voce VOCABOLARIO Liv.1 **senza ratifica** (nei turni veri Matteo aveva detto «solo OSSERVAZIONI»). Incoerenza file-vs-turni segnalata dal dossier §5.1. **Decisione Matteo: ritirala.** Voce commentata in VOCABOLARIO; resta osservazione non promossa finché non l'approva regolarmente. Caso-scuola di deviazione di processo sanato.

### 2.3 Scope creep — freno + rinforzo semi-enforcement
Pattern più maturo del dossier (3 occorrenze: 3 PNG invece di 2, file header extra, asset non richiesti). **Decisione Matteo: sì, regola.**
- Freno in PREPARA_PROMPT §2: prima di materializzare un output non richiesto → chiedi Sì/No.
- **Domanda di Matteo: «serve un hook?»** → No, e per motivo tecnico: lo scope creep non è verificabile da una macchina che legge solo i file (il numero di output richiesti è nella chat, non sul disco). Soluzione: riga **`Output attesi:`** obbligatoria nell'intestazione del prompt (§1.A) → il freno sta dove l'esecutore lo legge per forza. Semi-enforcement, non hook.
- **Criterio «quando saprò che funziona»:** dai dati — se gli «output extra» spariscono dai report/ERRORI_PROCESSO nelle prossime sessioni → funziona; se tornano → leva più forte.

### 2.4 Voci Liv.2 «main dell'app» / «menù originale» — tenute
Il dossier le dava candidate ad archiviazione (0/0/0 da sempre). **Decisione Matteo: promuovile a Liv.2 attiva** (tenerle in osservazione, non archiviare). Sono le più esposte al guasto #1 perché l'hook non le copre (legge file, non chat) → banco di prova per capire se serve una seconda leva.

### 2.5 Pendenze del dossier chiuse
- **Handoff §3 (deviazione):** la regola «handoff due parti» era entrata in PREPARA_PROMPT §3 prima della ratifica (commit `939a5cf`, ammesso nel msg). Il contenuto era **già richiesto** da Matteo (OSSERVAZIONI 31-05, esito positivo) → **ratificata** (≠ sticky, dove il contenuto non era confermato → ritirata). Distinzione registrata in PROPOSTE.
- **«prompt intero su correzione»:** promossa a regola di formato in PREPARA_PROMPT §1.B (se Matteo corregge un prompt, l'agente riconsegna il blocco intero, non il delta). Costo zero, come «profilo+skill nel prompt».
- **Buco Prenota-vs-QR esplorativo:** il gate §2 copriva solo i prompt preparati; la confusione 02-06 nasceva in chat esplorativa. **Idea di Matteo: caricare il vocabolario + scorciatoia.** Scoperta: `.cursor/rules/comandi-base.mdc` ha `alwaysApply: true` → i grilletti sono **già iniettati a ogni chat** → niente hook `sessionStart` (sarebbe doppione), **esteso comandi-base** con blocco «Zone che si confondono». L'idea di Matteo realizzata con la leva già-attiva.

---

## 3. File di skill aggiornati

| File | Modifica (breve) | Perché |
|------|------------------|--------|
| `.cursor/hooks/fine-sessione-nudge.mjs` | Riscritto statico → mirato (legge report, verifica sezioni, smart-allow) + fix rumore Liv.2 | Guasto #1: enforcement vero sulle sezioni report (M4) |
| `.cursor/rules/comandi-base.mdc` | Aggiunto blocco «Zone che si confondono» (Prenota↔QR + 3 zone menu) | Buco Prenota-vs-QR in chat esplorativa (always-active) |
| `docs/PREPARA_PROMPT_SKILL.md` | Riga `Output attesi:` (§1.A) · freno scope creep (§2) · «prompt intero» (§1.B) · handoff ratificato (§3) | Scope creep semi-enforcement + 2 pendenze chiuse |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | M4 →🔶 + box leve Cursor (v2 installata, sessionStart già coperto) + Log idee | Tracciare l'enforcement installato |
| `docs/Comunicazione-Skill/VOCABOLARIO.md` | Voce «sticky» commentata (ritirata) | Deviazione sanata |
| `docs/Comunicazione-Skill/PROPOSTE.md` | Scope creep accettato + enforcement guasto#1 + handoff ratificato + nota hook scope | Archivio decisioni |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | Triage Liv.2 (voci tenute) + nota decisioni senior + fix tabella malformata | Stato per prossimo revisore |
| `docs/Comunicazione-Skill/ERRORI_PROCESSO.md` | 4 pattern aggiornati (scope/sezioni/deviazione/Prenota-QR esplorativo) | Indice pattern per revisore |

Nessun codice dell'app toccato.

---

## 4. Dati comunicazione

**Frasi/intenti di Matteo (questa chat):**

| Frase/intento | Volte | Comportamento emerso |
|---------------|-------|----------------------|
| «sei agente senior» (discriminante ruolo) | 1 | parola «senior» → Meta senior diretto, no domanda |
| «parti dal dossier» | 1 | non ri-diagnosticare, decidere e avanzare |
| «se era già nel template, mettiamo hook» | 1 | **pivot chiave**: rifiuta markdown-su-markdown, vuole enforcement vero |
| «serve un hook?» (scope creep) | 1 | vuole capire SE una cosa è automatizzabile prima di accettarla — pattern ricorrente |
| «caricare il vocabolario + scorciatoia, è efficace?» | 1 | propone una soluzione e chiede verdetto onesto, non conferma di cortesia |
| «promuovi a liv 2 main dell'app e menu originale» | 1 | decisione netta su triage |
| «fai tutto in autonomia, lavora fino alla fine» | 1 | delega piena chiusura: debug+report+commit+merge+DB |

**Cosa ha funzionato:** spiegare il «chi-fa-cosa» degli hook (Cursor lancia / lo script verifica / l'agente legge) prima di decidere la severità; distinguere sempre cosa è *verificabile da una macchina* (file) vs cosa no (chat) — Matteo ci ragiona sopra e decide meglio.

**Pattern da ricordare (regola euristica emersa):** «si può fare un hook?» dipende da una cosa sola — la regola è verificabile guardando i **file**, o solo conoscendo la **conversazione**? File → hook possibile. Chat → il massimo è il vincolo nel prompt.

### Analisi flusso prompt, efficienza e statistiche (skill system)
- **Modalità:** deep. **Prompt sostanziali di Matteo:** ~8. **Correzioni dopo 1ª risposta:** 1 (il pivot template→hook — non è correzione di un errore, è un miglioramento della direzione su sua intuizione). **Follow-up/fix da revisione:** debug sub-agent → 2 rilievi minori, entrambi fixati. **Modalità alzata in corsa:** no (deep da subito).
- **Anatomia:** ogni decisione passata da `AskUserQuestion` con opzioni + impatto → zero piani calati dall'alto. Le decisioni di Matteo sono state nette (1-2 parole) perché le opzioni erano già pesate.
- **Da replicare:** il pivot template→hook è nato perché ho esposto onestamente che la mia prima proposta era «markdown su markdown» — l'onestà sul limite della propria mossa ha prodotto la decisione migliore.
- **Efficienza:** alta. Nessun rework di merito; i 2 fix post-debug erano rifiniture (rumore hook, tabella), non errori di sostanza.

### Registro metriche (riga per EVOLUZIONE_SKILLS M5)
`02-06-26 · evoluzione skill system senior (hook v2 + 3 decisioni + 3 pendenze) · deep · prompt:~8 · correzioni:1 (pivot, non errore) · FU:0 · alzata:no · debug sub-agent OK, 2 rilievi minori fixati`

---

## 5. Derivazione errori
- **errore agente (storico, sanato):** «sticky» in VOCABOLARIO + handoff §3 senza ratifica → deviazioni di processo, sanate questa sessione. Causa: la regola «annota ≠ codificare» esiste ma è governance soft → di nuovo problema di enforcement.
- **rilievi debug (questa sessione, fixati):** hook emetteva promemoria Liv.2 anche a report completo (rumore) → ora solo quando ci sono sezioni mancanti; tabella malformata in OSSERVAZIONI (pre-esistente) → header 3 colonne aggiunto.
- Nessun bug di codice app (sessione meta).

---

## 6. Igiene template v.0
Le modifiche **strutturali/riusabili** (hook di chiusura mirato, freno scope-creep via riga prompt, blocco zone-confondibili always-active) sono propagabili in `_skill-system-v0/comunicazione/` in forma generica (gitignored). NON propagare lo specifico CalendarBackup (Prenota/QR, BookingSummarySidebar). *Propagazione non eseguita in questa sessione — annotata come follow-up igiene.*

---

## 7. Stato finale
- 8 file skill modificati, 0 codice app. Debug sub-agent: nessun problema bloccante.
- Allineamento branch + DB: eseguito a valle (vedi sezione commit/merge in SESSION_LOG).
