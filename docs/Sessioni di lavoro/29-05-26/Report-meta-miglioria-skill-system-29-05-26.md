# Report fine sessione — Meta: miglioria skill system

**Data:** 29-05-26
**Profilo agente:** Meta (analisi e affinamento skill system)
**Codice app:** nessuna modifica a `src/`
**Test:** N/A (sessione solo skill system / documentazione)
**Storage DB:** nessuna modifica

---

## Sintesi per Matteo

Hai chiesto di analizzare i report degli ultimi cicli di lavoro e proporti migliorie allo skill
system, rispondendo tu sì/no o a opzioni. Punto di partenza: la skill di orientamento
`APP_CONTEXT_SKILL.md`, poi i report e i file del sistema di comunicazione.

Risultato: **8 proposte ferme decise tutte**, **2 voci nuove automatiche** nel vocabolario, **3 voci
in osservazione**, **3 regole automatiche** nuove, più la **sintesi periodica dei feedback agenti**
assegnata all'agente comunicazione (non agli agenti che eseguono il lavoro).

---

## Cosa è stato fatto (ordine cronologico)

1. Lettura completa: `APP_CONTEXT_SKILL.md`, i 4 file `Comunicazione-Skill/` (OSSERVAZIONI,
   PROPOSTE, ERRORI_PROCESSO, REVISIONE), `VOCABOLARIO.md`, `FOLLOW_UP.md`, `PREPARA_PROMPT_SKILL.md`
   e i 3 report del ciclo card ingredienti (i 2 agenti di filtro + l'agente esecutore).
2. Analisi del problema centrale emerso dai 3 report: **stessa feature, intenti opposti nella stessa
   giornata** (overlay «no» la mattina → «sì» il pomeriggio). Causa radice: a monte nessuno
   dichiarava «overlay sì/no» e «larghezza contenuto».
3. Confronto fra i 2 agenti di filtro: il 2° ha vinto perché ha **mappato gli elementi adiacenti** e
   tracciato il pivot degli intenti; il 1° si è fermato all'interpretazione «è un bug».
4. Domande a opzioni a Matteo (2 round + 1 chiarimento) → decisioni su tutte le proposte.
5. Applicazione delle decisioni ai file di skill (tabella sotto).

---

## Decisioni prese (con Matteo, a opzioni)

| Proposta | Decisione | Dove |
|----------|-----------|------|
| «lavoro ok» | Vocabolario **Liv.1** | VOCABOLARIO |
| «finestra/dialog di conferma» → Modal in-app | Vocabolario **Liv.1** | VOCABOLARIO (lega FU-003) |
| «comportamenti ok ma voglio che cambi» | Vocabolario **Liv.2** (osservazione) | VOCABOLARIO |
| «compila report comunicazione + annota prompt» | Vocabolario **Liv.2** (osservazione) | VOCABOLARIO |
| «revisiona e se ok committa» | Vocabolario **Liv.2** (osservazione) | VOCABOLARIO |
| Report unificato ciclo multi-agente | **Regola attiva** | APP_CONTEXT §7.1 |
| Copy verbatim (applica solo le frasi citate) | **Nota/regola** | COMUNICAZIONE_UTENTE_SKILL |
| Freno azioni strutturali rischiose | **Regola attiva** | PREPARA_PROMPT §2 |
| Segnala conflitti con prompt precedenti | **Regola attiva** (no timeline) | PREPARA_PROMPT §2 |
| Sintesi periodica feedback agenti | **Compito del revisore Meta** (non esecuzione/revisione) | REVISIONE.md §4b |
| Overlay sì/no come checklist fissa | **Scartata** — solo domanda a monte caso per caso | — |

---

## File di skill aggiornati (§7.2)

| File | Modifica (breve) | Perché |
|------|------------------|--------|
| `Comunicazione-Skill/VOCABOLARIO.md` | +5 voci nuove (2 Liv.1, 3 Liv.2) | Promosse da PROPOSTE dopo decisione Matteo |
| `Comunicazione-Skill/PROPOSTE.md` | Svuotata sezione «In attesa»; 8 voci in Archivio con esito | Tutte le proposte ferme decise in sessione |
| `Comunicazione-Skill/OSSERVAZIONI.md` | +3 righe tabella Liv.2; log 29-05-26 sessione Meta | Dati grezzi nuove voci + log obbligatorio |
| `Comunicazione-Skill/REVISIONE.md` | +§4b sintesi feedback agenti al revisore Meta | Richiesta Matteo: sintesi la fa comunicazione, non esecuzione/revisione |
| `PREPARA_PROMPT_SKILL.md` | +2 controlli §2: conflitto con prompt precedente + freno azioni rischiose | Regole automatiche decise |
| `APP_CONTEXT_SKILL.md` | §7.1 «preferenza» report unificato → **regola attiva** | Proposta promossa a regola |
| `COMUNICAZIONE_UTENTE_SKILL.md` | +sezione «Copy verbatim» | Regola decisa |
| `SESSION_LOG.md` | +riga sessione | Cronologia |

---

## Dati comunicazione

### Frasi / richieste ricorrenti (questa chat, con conteggio)

| Frase / intento | × | Comportamento desiderato |
|-----------------|---|--------------------------|
| «analizza report + fammi domande sì/no o opzioni a-b-c» | 1 | Decisioni a opzioni, mai piani calati dall'alto |
| «parti da [skill] e poi analizza i report» | 1 | Sequenza di lettura esplicita prima di proporre |
| «spiegami con parole diverse / spiegami meglio cosa fa» | 3 | Distinguere parola-comando da regola automatica; spiegare «cosa dico → cosa succede» |
| «la sintesi feedback la faccio con agente comunicazione, non esecuzione/revisione» | 1 | Separazione netta dei ruoli — il Meta sintetizza, gli altri raccolgono |
| «di' solo di segnalarmi conflitti con prompt precedenti» | 1 | No strutture pesanti (tabelle timeline): basta la segnalazione |
| «fai report finale» | 1 | Trigger protocollo §7 |

### Spiegazioni date e formato che ha funzionato

- **«Parola → comportamento»**: per ogni proposta ho chiarito SE era una parola da dire (entra nel
  vocabolario) o una regola automatica (nessuna parola, scatta da sola). Matteo ha sbloccato le
  decisioni solo dopo questa distinzione → conferma il pattern «chi fa l'azione».
- **«Come chiamare l'elemento per dirlo già mappato»**: per la finestra di conferma ho dato a Matteo
  il termine esatto da usare («finestra di conferma» = Modal in-app) così parte giusto. Apprezzato.

### Procedure ripetute

- Domande a opzioni con raccomandazione in prima posizione (Recommended) → Matteo sceglie veloce.
- Distinguere, prima di proporre, parola-comando vs regola di processo.

### Voci Liv.2 applicate

Nessuna voce Liv.2 esistente applicata in questa chat. Le 3 nuove Liv.2 nascono da qui (0 esiti).

### Pattern nuovi (candidati, non promossi)

- «spiegami meglio cosa fa [proposta]» prima di approvare → Matteo vuole capire il meccanismo, non
  solo l'etichetta. Possibile voce futura «spiegami il meccanismo» se ricorre.

### Cosa si può automatizzare con certezza vs manuale

| Automatizzabile | Manuale |
|-----------------|---------|
| Le 2 voci Liv.1 + 3 regole attive (decise) | Promozione delle 3 Liv.2 → Liv.1 (serve dati, decide revisore) |
| Raccolta dati feedback in ERRORI_PROCESSO | Sintesi top-3 cause + azione correttiva (revisore Meta con Matteo) |

### Token risparmiabili

- Le 5 voci nuove + 4 regole evitano a Matteo di rispiegare ogni volta: conferma successo, finestra
  di conferma corretta, cambio-non-bug, chiusura meta, report unificato, copy verbatim, freni.

### Cronologia / prompt di Matteo (annotati)

1. **Prompt 1** — «analisi e pianifica migliorie a skill system… parti da APP_CONTEXT_SKILL poi
   analizza report e documenti skill system… fammi domande sì/no o opzioni». → Intento: sessione
   Meta di affinamento, decisioni a opzioni. Esito: lettura completa + 2 round di domande.
2. **Risposte round 1** — «solo domanda a monte no regola fissa» (overlay) · «sintesi periodica a
   fine sessione con me» · «decidiamole ora velocemente» · «di' solo di segnalarmi conflitti con
   prompt precedenti». → Esito: scartata checklist overlay; sintesi → Meta; decisione proposte ora.
3. **Risposte round 2** — «spiegami con parole diverse: frase da promuovere → utilizzo» · «come
   chiamare l'elemento per dirlo mappato» · «Lavoro ok Liv.1, altre 2 Liv.2» · «spiegami cosa fanno
   i comandi». → Esito: ri-spiegazione parola-vs-regola + ri-domande chiarite.
4. **Messaggio inline** — «la sintesi dei feedback agenti la faccio con agente comunicazione, non
   con agenti esecuzione o revisione». → Esito: codificata in REVISIONE.md §4b.
5. **Prompt finale** — «si fai report finale. grazie di tutto». → Questo report.

### Cosa non è successo in chat

| Tipo | Dettaglio |
|------|-----------|
| Test non eseguiti | Sessione solo docs, nessun `npm run validate` (nessun codice toccato) |
| Skill area non toccate | Nessuna modifica a skill di codice/DB/UI |
| Commit non ancora fatto | Proposto dopo questo report |
| Voci Liv.3 | Nessuna voce a livello conferma creata |

---

## Derivazione errori

| Causa | Cosa è successo | Da cosa derivava | Come si è evitato/eviterà |
|-------|------------------|------------------|---------------------------|
| **prompt ambiguo** (mio, verso Matteo) | Prime domande sulle proposte di processo non chiare: Matteo ha chiesto «spiegami cosa fa il comando» | Avevo presentato regole di processo come fossero parole-comando | Ho ri-formulato ogni proposta come «cosa dici → cosa succede» o «freno automatico». Pattern già noto (OSSERVAZIONI: «chi fa cosa») |

Nessun bug di codice, nessun vincolo strutturale, nessun errore d'agente esecutore (sessione Meta).

Pattern ricorrente da appendere a ERRORI_PROCESSO: **presentare una proposta senza dichiarare se è
parola-comando o regola automatica** rallenta la decisione di Matteo. Non lo appendo come bug di
processo di esecuzione (è comunicazione Meta), ma lo lascio qui come nota.

---

## Cosa resta per la prossima sessione

- Le **3 voci Liv.2** vanno osservate sul campo: gli agenti che le applicano annotano l'esito in
  `Dati Liv.2`, poi una sessione revisore decide promozione/regressione.
- **FU-002 / FU-003** restano aperti in `FOLLOW_UP.md` (autosave form + conferma delete uniforme).
  La voce «finestra di conferma» Liv.1 supporta FU-003 quando lo lavorerai.
- Nessun nuovo follow-up aperto da questa sessione.

---

## Commit (su conferma)

```text
docs(comunicazione): decise 8 PROPOSTE + nuove regole skill system 29-05-26

Review:
- docs/Sessioni di lavoro/29-05-26/Report-meta-miglioria-skill-system-29-05-26.md
- docs/SESSION_LOG.md
- docs/FOLLOW_UP.md (FU-002/FU-003 invariati, citati)
```

File `docs/` richiedono `git add -f` (regola temporanea APP_CONTEXT).

---

*Report redatto dall'agente Meta a conferma «fai report finale» di Matteo.*
