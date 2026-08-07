# Report — pulizia Indagine Skill + organizzazione Valutazione · 07-08-26

**Profilo:** Meta · **Modalità:** deep · **Scope:** solo docs / cartelle private / Crescita professionale — **nessun `src/`**

### Cappello
- **Cosa è cambiato:** il cantiere Indagine è chiuso anche sul tracking git; la cartella Valutazione Personale è autosufficiente per chi conduce le sedute; Crescita professionale ha un handoff parallelo per l'interrogazione senza toccare il mandato HubSpot.
- **Cosa resta:** Fase 2 dell'interrogazione (primo blocco); commit su CalendarBackup (quando lo chiedi); commit sulla git di Crescita professionale (solo se lo chiedi).
- **Serve una tua azione:** sì — rileggi per cartella (lista in chiusura) e conferma se/quando commitare; **non** ho committato nulla sulla git di Crescita professionale.

---

## 1. Cosa è stato fatto

### Blocco A — cantiere lato repo (git)
- Checkbox **S1–S6** e riga **INT1** allineate a `_stato/` (file per file); registro spunte aggiornato.
- Creato indice `Indagine-Skill-Matteo/README.md` (cantiere chiuso, mappa, path dei deliverable privati, puntatore a `00_HANDOFF_UNIFICATO.md`).
- Aggiunta una riga alla tabella del README della giornata 06-08-26.

### Blocco B — Valutazione Personale (privato, gitignored)
- Creato `Verbali/_MODELLO_VERBALE.md` (campi da INT_00 §6).
- Spostato `INT_04` in `Verbali/` (Sì tuo); aggiornati riferimenti in INT_00 §8, Report-fase1 §3, e path in `00_HANDOFF_UNIFICATO`.
- Creato `Documenti Finali/_LEGGIMI.md` (copie S1–S5 byte-identiche verificate; S6 originali privati; PIANO = copia).
- Copiate in `Fonti Citate/` Metodo spiegazioni + Profilo scolastico, con riga di provenienza (Sì tuo).

### Blocco C — Crescita professionale (solo originale Io-Claude)
- Scheda Sessione 7 trasferita in `11_Valutazioni_Didattiche.md` (stessi 7 criteri, invariati).
- Riga di log sul `00_Profilo_Matteo.md` (livelli non mossi; vincolo artefatto/`PROVATO`).
- Creato `12_Handoff_Interrogazione.md`; sul `04` HubSpot solo nota di consapevolezza (mandato HubSpot lasciato com'è — tua decisione).
- `CONTESTO_Progetto.md` §5 e §7: Indagine + fase interrogazione a 6 blocchi.

### Blocco D — igiene
- Creato `docs/Archives/Crescita professionale/_COPIA_NON_MODIFICARE.md` (copia locale; cartella gitignored riga 70).
- `Indagine-Corpus/` non toccato.
- Verifiche D2: numeri sotto.

---

## 2. File toccati e perché

### Tracciati da git (CalendarBackup-v2)

| File | Perché |
|------|--------|
| `…/Indagine-Skill-Matteo/00_PROMPTS_SEQUENZA_TRACKING.md` | checkbox S1–S6 + INT1 + registro |
| `…/Indagine-Skill-Matteo/README.md` | **nuovo** indice cantiere |
| `…/06-08-26/README.md` | riga Indagine in tabella |
| `…/Report-fase1-interrogazione-07-08-26.md` | path INT_04 → Verbali |
| `…/07-08-26/Report-pulizia-indagine-skill-07-08-26.md` | questo report |

### Privati / ignorati (`docs/_lavoro/`, `docs/Archives/`)

| Path | Perché |
|------|--------|
| `…/Verbali/_MODELLO_VERBALE.md` | template sedute |
| `…/Verbali/INT_04_…` | spostato da Contesto |
| `…/Documenti Finali/_LEGGIMI.md` | regole copie vs originali |
| `…/Fonti Citate/*` (2) | fonti citate accessibili a Claude Desktop |
| `…/INT_00_PROTOCOLLO.md` §8 | path INT_04 |
| `…/00_HANDOFF_UNIFICATO.md` | path INT_04 |
| `docs/Archives/…/_COPIA_NON_MODIFICARE.md` | avviso copia |

### Crescita professionale (Io-Claude — git propria, **non** committata)

| File | Perché |
|------|--------|
| `11_Valutazioni_Didattiche.md` | scheda sessione 7 (L-INT-3) |
| `00_Profilo_Matteo.md` | riga log 07-08 |
| `04_Handoff_Prossimo_Agente.md` | solo nota binario parallelo |
| `12_Handoff_Interrogazione.md` | **nuovo** handoff interrogazione |
| `CONTESTO_Progetto.md` | §5 + §7 |

---

## 3. Test eseguiti e risultato

Nessun `npm run validate` (nessun codice app). Verifiche documentali/git:

| Check | Risultato |
|-------|-----------|
| `_stato/S1…S6,S6a,S6b,INT1` chiusi → checkbox | allineate |
| SHA-256 S1–S5 Documenti Finali vs `report/` | **identici** (07-08-26) |
| `git check-ignore -v` su file `_lavoro` nuovi/mod | tutti → `.gitignore:42` |
| `git check-ignore` su `_COPIA_NON_MODIFICARE` | → `.gitignore:70` |
| `git status --short` | solo file in `docs/Sessioni di lavoro/…` (nessun `_lavoro`) |
| `git ls-files "docs/_lavoro" \| wc` | **77** (invariato) |

### Tabella numeri D2

| Metrica | Valore |
|---------|--------|
| `git ls-files docs/_lavoro` | **77** |
| File `_lavoro` in `git status` | **0** |
| File Archives in `git status` | **0** (ignorati) |
| Report in `Indagine-Skill-Matteo/report/` | **46** |
| File tracciati cartella Indagine | **105** (+ README nuovo da stagiare) |

---

## 4. File di skill aggiornati

| file | modifica | perché |
|------|----------|--------|
| nessuno | — | nessuna skill area / APP_CONTEXT / VOCABOLARIO toccata; lavoro solo organizzativo docs |

---

## 5. Dati comunicazione

- **Frasi ricorrenti:** freno strutturale + AskUserQuestion prima di move/copia; risposte tue già nel prompt (B2 sì Verbali · B4 sì Fonti · C3 handoff separato, HubSpot intatto).
- **Formato che ha funzionato:** prompt Meta deep con blocchi A–D, output elencati, [CHIEDI] pre-risposti.
- **Automatizzabile:** allineamento checkbox da `_stato/` (già previsto ondata AGG); **non** automatizzare move/cancellazioni senza Sì.
- **Manuale:** decisione binari HubSpot vs interrogazione; commit sulla git di Crescita.

### Analisi flusso prompt
- Prompt sostanziali: **1** (questo) + risposte [CHIEDI] incorporate.
- Correzioni dopo 1ª risposta: **0** (sessione unica).
- Modalità: deep da prompt, non alzata in corsa.
- Efficace: elenco output ESATTI + freno + decisioni già prese → zero ambiguità su cosa produrre.

---

## 6. La TUA lettura della sessione

- **Impressioni:** il sistema «due cartelle + handoff unificato» è chiaro; mancava solo la colla (README, Verbali, Fonti, handoff parallelo). Caricare solo i path indicati ha evitato di riaprire i 39 report.
- **Difficoltà:** C3 nel prompt originale chiedeva di riscrivere il mandato HubSpot; la tua risposta ha cambiato il deliverable (file nuovo + citazione). Applicata la risposta, non il testo originale del Blocco C3.
- **Miglioria (dato, non modifica skill):** nei prompt Meta con [CHIEDI] già risposti, una riga in cima «Decisioni già prese: …» riduce il rischio che un agente riesegua AskUserQuestion.

---

## 7. Derivazione errori

| Evento | Classe | Nota |
|--------|--------|------|
| Collisione «sessione 7» HubSpot vs interrogazione | **vincolo strutturale** / debito documentale | chiuso con handoff `12` + nota sul `04`, senza rinumerare HubSpot |
| INT_04 in Contesto mentre cresce a ogni seduta | **prompt / igiene** preesistente | spostato su tua conferma |
| Nessuna difficoltà di esecuzione bloccante | — | — |

---

## 8. Cosa resta per la prossima sessione

- Aprire **Fase 2**: Blocco 1 (Fatti e memoria) con verbale da modello.
- Commit CalendarBackup dei file in `docs/Sessioni di lavoro/` quando dici «fai report finale» / commit.
- Commit Crescita professionale **solo se lo chiedi** (git propria).
- Opzionale: chiudere esplicitamente `L-INT-3` nel §7 di `00_HANDOFF_UNIFICATO` (scheda trasferita + log scritto).

Nessuna riga nuova obbligatoria in `FOLLOW_UP.md` prodotto-app (fuori scope).

---

## 9. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Un unico prompt Meta deep «Profilo: Meta / Modalità: deep» con blocchi A–D, output 1–8, FRENO, e risposte incorporate: B2 «va bene, mettiamo in verbali…»; B4 «confermo procedi pure»; C3 «crea un handoff separato nuovo… lascia handoff hubspot… aggiungi solo… citazione di consapevolezza…».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificati: checkbox vs `_stato/S1…INT1`; `git status` (4 path Sessioni); `git ls-files docs/_lavoro` = 77; `check-ignore` su 7 path `_lavoro` + Archives; hash S1–S5 identical=True; presenza scheda Sessione 7 in fondo a `11_Valutazioni`; file `12_Handoff_Interrogazione.md` creato.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area app. Allineati i puntatori: INT_00 §8, Report-fase1 §3, 00_HANDOFF path INT_04, CONTESTO §5/§7, nota su 04 + nuovo 12. Skill system comunicazione non toccato (corretto: non è promozione di regole).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho committato né su CalendarBackup né su Crescita (vietato senza richiesta). Non ho rinumerato le sessioni HubSpot nel 04 (tua istruzione). Non ho aggiornato il testo «DA TRASFERIRE» dentro INT_04 né chiuso L-INT-3 in HANDOFF §7 (non erano negli output obbligatori). Non ho toccato Archives oltre al file avviso.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito minimo; il punto delicato è stato C3 (testo prompt vs risposta Matteo). Miglioria: nei prompt preparati, sezione «Decisioni utente già prese» sopra i [CHIEDI] così l'esecutore non rilegge il pezzo superato.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto: APP_CONTEXT §0/§7 + CHIUSURA + HANDOFF + INT_00 §8, senza corpus mining. Nessun hook runtime rilevante in questa chat; il freno del prompt ha sostituito bene AskUserQuestion.

---

## 10. Self-review del report

1. Dati = status/git/hash riaperti in chiusura.  
2. Nessuna skill area da allineare.  
3. Q1–Q6 compilate.  
4. Chiusura verso Matteo per cartella, sotto.

---

## Chiusura verso Matteo (linguaggio semplice)

**Per cartella — cosa è cambiato e cosa controllare tu:**

1. **Cartella Indagine (06-08-26, su git)** — le caselle S1–S6 e INT1 sono spuntate; c’è un README che spiega cos’è il cantiere e dove stanno i pezzi privati. Controlla che ti torni l’indice in 2 minuti.
2. **Valutazione Personale (`_lavoro`, fuori git)** — Verbali pronti (modello + INT_04 spostato); Documenti Finali con leggimi (copie vs originali); Fonti Citate con i due documenti che prima mancavano. Controlla che Claude Desktop veda Verbali e Fonti.
3. **Crescita professionale (Io-Claude)** — scheda sessione 7 nel file valutazioni; riga nel log profilo; handoff HubSpot intatto + nota; **nuovo** handoff interrogazione (`12`); CONTESTO aggiornato. Controlla che aprendo la cartella non si parta più «solo HubSpot» senza sapere del secondo binario.
4. **Archives** — avviso «non modificare» sulla copia; niente cancellato.
5. **Git** — nessun file privato in staging; 77 file `_lavoro` tracciati come prima. Commit: aspetta il tuo via (e via separato per Crescita).

**Terminali:** nessuno avviato da questa sessione.
