# Report fine sessione — Skill system: analisi + template v0 + snellimento APP_CONTEXT

**Data:** 29-05-26
**Profilo agente:** Meta (skill system / documentazione)
**Codice app:** nessuna modifica a `src/`
**Test:** N/A (sessione solo skill system / docs — nessun codice toccato)
**Storage DB:** nessuna modifica

---

## Sintesi per Matteo

Hai chiesto tre cose: (1) analizzare lo skill system, (2) creare un template riusabile per nuovi
progetti, (3) risolvere il problema di `APP_CONTEXT_SKILL.md` diventato un muro di testo.

Fatto tutto:
- **Analisi** consegnata in chat (utilità, punti forti, 5 punti deboli, opinione).
- **Template** `_skill-system-v0/` creato nella root (gitignored, tuo kit personale) — 18 file
  pronti con segnaposto.
- **Fix APP_CONTEXT**: i dettagli della §4 (soprattutto la pagina Prenota) sono usciti in file di
  contesto dedicati; la §4 è passata da ~103 a **75 righe**, zero blocchi «Nota:» residui. Niente
  contenuto perso, niente doppioni nuovi (anzi, ridotti quelli che c'erano).

---

## Cosa è stato fatto (cronologico)

1. Lettura completa dello skill system: `APP_CONTEXT_SKILL.md`, skill Cursor, `TESTING_SKILL`,
   `VOCABOLARIO.md`, report Meta 29-05-26, analisi raccolta dati in `_lavoro/Supporto`.
2. Analisi consegnata in chat con opinione e 5 punti deboli (muro §4, doppio sistema
   Cursor/docs, root disordinata, regole temporanee senza scadenza, manutenzione manuale).
3. Domande a opzioni → decisioni: template completo, in `_skill-system-v0/` gitignored;
   vocabolario unico a 2 sezioni (no file separato codice); trigger di routing da parole Liv.1;
   consolidare nei file esistenti invece di creare doppioni.
4. Sub-agent Explore lanciato per mappare l'overlap §4 ↔ file esistenti (seconda opinione
   anti-doppioni). Confermato: 4 temi già coperti altrove (→ solo rimando), il resto orfano.
5. Creato il template `_skill-system-v0/` (18 file).
6. Snellito `APP_CONTEXT_SKILL.md`: creati 3 file di contesto nuovi, ridotte le RULE §4 a rimandi,
   consolidato Servizio nel file esistente, aggiornate routing §0 e allineamento §7.2.
7. Aggiornato il puntatore Cursor con nota sui nuovi file.

## File toccati e perché (linguaggio utente)

**Template (nuovo kit, gitignored — non entra nei commit del progetto):**
- `_skill-system-v0/` — quando avvii un nuovo progetto, copi questa cartella e in ~1 ora hai lo
  stesso sistema (bussola, vocabolario, ruoli, report) già pronto. Include manuale di avvio e
  regole anti-disordine.

**Fix skill system reale (questi sì versionati):**
- Ora un agente che lavora sulla pagina Prenota apre un file dedicato
  (`BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md`) invece di portarsi dietro 170 righe di dettagli su
  tutto. Stesso per il menu admin (`MENU_ADMIN_CONTEXT.md`) e la PWA (`PWA_CONTEXT.md`).
- La «bussola» (`APP_CONTEXT_SKILL.md`) resta lo smistatore: dice quale file aprire, senza più
  contenere i dettagli. La tabella che instrada (quella che decide «dove vai») non è cambiata nella
  logica — quindi il rischio che l'agente «scelga male» è lo stesso di prima, non aumentato.

## Domande poste e risposte

| Domanda | Risposta |
|---------|----------|
| Scope template | Completo (routing + comunicazione) |
| Dove vive | Cartella root `_skill-system-v0/` gitignored; e fixare anche APP_CONTEXT |
| Granularità context | Per pagina/sezione UI |
| Vocabolario codice separato? | No — uno solo, due sezioni (comando + mappa) |
| Trigger routing | Parole Liv.1 dove esistono; frase finché manca la parola (compito Meta coniarle) |
| Anti-doppioni | Consolidare nei file esistenti; file nuovi solo per Prenota e PWA |
| Verifica anti-perdita | Procedere senza riepilogo nota-per-nota |

## Richieste aggiunte in corso (integrate nel template)

- Agente comunicazione mostra **checklist di apertura** (inizio sessione) e **di chiusura** (fine)
  per allineare anche Matteo allo skill system → in `comunicazione/COMUNICAZIONE_SKILL.md` §2 e §3.
- **Pagine HTML temporanee** per decidere UI/responsive → compito dell'agente **prepara-prompt**
  (non esecutore), a livello strutturale, durante le domande-decisioni; in `tmp/` gitignored →
  registrato in `comunicazione/PROPOSTE.md` come candidata.

## Test eseguiti

Nessuno: sessione solo documentazione/skill system, nessun file `src/` toccato → `npm run validate`
non applicabile. Verifiche fatte: conteggio righe, assenza di «Nota:» residue in APP_CONTEXT,
controllo che tutti i file referenziati dai rimandi esistano (7/7 OK), nessun link rotto.

## File di skill aggiornati (obbligatorio)

| File | Modifica (breve) | Perché |
|------|------------------|--------|
| `_skill-system-v0/**` (18 file) | Template nuovo completo | Richiesta 2: kit riusabile per nuovi progetti |
| `.gitignore` | +`_skill-system-v0/` | Kit personale, fuori dai commit del progetto |
| `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | Nuovo — estratto §4 Prenota | Snellire APP_CONTEXT (tema orfano) |
| `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md` | Nuovo — estratto RULE Menu Prenota | Snellire APP_CONTEXT (parte UX admin non coperta altrove) |
| `docs/PWA_CONTEXT.md` | Nuovo — estratto RULE PWA | Snellire APP_CONTEXT (tema orfano) |
| `docs/APP_CONTEXT_SKILL.md` | §4 ridotta a RULE+rimandi (103→75 righe); routing §0 e §7.2 ai nuovi file | Fix muro di testo; anti-doppioni |
| `.cursor/skills/calendarbackup-app-context/SKILL.md` | +nota sui file di contesto estratti | Allineare Cursor ai nuovi file |
| `docs/Sessioni di lavoro/29-05-26/Report-skill-system-template-…` | Questo report | §7.1 |
| `docs/SESSION_LOG.md` | +riga sessione | Cronologia |

> **Servizio** (RULE §4 240-244): consolidato in `ADMIN_PAGES_CONTEXT.md` §Servizio — che già
> conteneva tutto il dettaglio. Ridotto a una RULE di rimando, **nessun file nuovo** (evitato
> doppione).

## Dati comunicazione

### Frasi / richieste ricorrenti (con conteggio)

| Frase / intento | × | Comportamento desiderato |
|-----------------|---|--------------------------|
| «analizza X, fammi domande, dammi opinione» | 1 | Analisi + decisioni a opzioni prima di agire |
| «procedi con cautela / lancia sub-agent per seconda opinione» | 1 | Verifica indipendente prima di operazioni delicate |
| «come gestiamo il rischio doppioni?» | 1 | Vuole capire il meccanismo prima di approvare (pattern «spiegami come funziona») |
| «ha senso un vocabolario codice separato?» | 1 | Valutare scalabilità/numero file prima di aggiungere struttura |
| precisazioni in corso (HTML temp = prepara-prompt; checklist a inizio sessione) | 3 | Affina lo scope mentre lavori; attribuisce i compiti ai ruoli giusti |
| «fai report finale» | 1 | Trigger protocollo §7 |

### Spiegazioni / formato che ha funzionato

- **«La bussola smista, non spiega»** — la metafora bussola vs mappe di dettaglio ha sbloccato la
  comprensione del fix §4.
- **Rischio doppioni spiegato con «categoria 1 vs categoria 2»** (già-coperto vs orfano): ha
  chiarito che il fix *riduce* i doppioni invece di crearne.
- Conferma del pattern già noto: Matteo approva dopo aver capito il *meccanismo*, non l'etichetta.

### Candidate nuove (→ PROPOSTE.md del template, non del progetto)

- Pratica «anteprima HTML strutturale» (prepara-prompt) — registrata nel template, da valutare se
  portarla anche nel progetto reale (`PREPARA_PROMPT_SKILL.md`).

### Automatizzabile vs manuale

| Automatizzabile | Manuale |
|-----------------|---------|
| Estrazione dettagli §4 → context (fatta) | Decisione «consolidare vs file nuovo» (giudizio caso per caso) |
| Checklist apertura/chiusura (regola nel template) | Promozione voci vocabolario (resta al Meta + Matteo) |

### Token risparmiabili

Ogni agente che lavora su una sola zona ora carica solo il suo file di contesto invece dell'intera
§4 — risparmio stimato ~150 righe di contesto per sessione fuori-Prenota.

## Derivazione errori

| Causa | Cosa è successo | Da cosa derivava | Come si è evitato |
|-------|-----------------|------------------|-------------------|
| **prompt ambiguo (mio verso il sub-agent)** | Il sub-agent ha proposto 4 file nuovi, inclusi 2 che duplicavano file esistenti | Non avevo dato al sub-agent l'istruzione esplicita «preferisci consolidare» | Ho rivisto la sua raccomandazione con Matteo e scelto di consolidare Servizio/Menu nei parenti |
| **vincolo strutturale** | `APP_CONTEXT` scendeva «solo» a 388 righe totali | Il muro era nella §4, non nel resto del file; il resto (routing, §7.2) è intrinsecamente lungo | Misurata la §4 isolata: 103→75 righe, 0 Nota residue — l'obiettivo era lì |

Nessun bug di codice (sessione solo docs). Pattern per `ERRORI_PROCESSO`: **dare al sub-agent la
regola anti-doppioni esplicita** quando si chiede una mappatura di refactoring documentale.

## Cosa resta per la prossima sessione

- Valutare se portare la pratica «anteprima HTML strutturale» nel `PREPARA_PROMPT_SKILL.md` reale
  (oggi è solo nel template).
- Nessun nuovo FU di codice aperto. FU esistenti invariati.
- Eventuale sessione Meta futura: coniare parole Liv.1 per le frasi-trigger lunghe rimaste nella
  routing (compito già scritto in `REVISIONE.md` del template).

## Commit proposti (su conferma)

```text
docs(skill-system): snellisce APP_CONTEXT §4 in file di contesto per zona

Review:
- docs/Sessioni di lavoro/29-05-26/Report-skill-system-template-e-snellimento-app-context-29-05-26.md
- docs/APP_CONTEXT_SKILL.md (§4 → rimandi, routing §0 e §7.2 aggiornati)
- docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md (nuovo)
- docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md (nuovo)
- docs/PWA_CONTEXT.md (nuovo)
- .cursor/skills/calendarbackup-app-context/SKILL.md
- docs/SESSION_LOG.md
```

> File `docs/` richiedono `git add -f` (regola temporanea APP_CONTEXT).
> Il template `_skill-system-v0/` è gitignored — NON entra in questo commit (è il comportamento
> voluto: kit personale).

---

*Report redatto a conferma «fai report finale» di Matteo.*
