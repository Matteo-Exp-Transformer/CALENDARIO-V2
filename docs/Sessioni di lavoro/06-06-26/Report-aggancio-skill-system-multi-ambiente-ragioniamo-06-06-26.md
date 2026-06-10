# Report — Aggancio skill system multi-ambiente + voce «ragioniamo» (06-06-26)

## Cappello (3 righe)
- **Cosa è cambiato:** i comandi di Matteo (vocabolario + livelli 1/2/3) ora sono riconosciuti anche in **Claude Code** e **Codex**, non più solo in Cursor; aggiunta la parola **«ragioniamo»** che attiva il formato spiegazione+tabella+checklist.
- **Cosa resta:** verifica reale in una chat nuova di Claude Code/Codex (questa chat aveva già il contesto in testa).
- **Serve una tua azione:** sì — confermare il commit (poi push). Provare «ragioniamo» da chat pulita.

## Cosa è stato fatto (linguaggio pratico)
Matteo segnalava che lo skill system «non funziona come nell'altra app» (Trade-Analyst-Agent), dove aveva la parola «ragioniamo» e i comandi con i livelli. Diagnosi: i comandi **c'erano già** anche qui, ma erano scritti solo nel file che **legge solo Cursor**. Aprendo la stessa app in Claude Code o Codex, l'agente partiva senza sapere che il sistema esistesse → i comandi non scattavano. Inoltre «ragioniamo» non esisteva affatto.

Risolto con: una sola fonte di verità (`VOCABOLARIO.md`) + tre porte d'ingresso gemelle, una per ambiente. Aggiunta la voce «ragioniamo» (Liv. 1).

## File toccati e perché
| File | Modifica | Perché |
|------|----------|--------|
| `docs/Comunicazione-Skill/VOCABOLARIO.md` | nuova voce «ragioniamo» Liv. 1 | fonte di verità del comportamento |
| `.claude/CLAUDE.md` | nuova sezione «Comandi e vocabolario di Matteo» | far conoscere il sistema a Claude Code |
| `AGENTS.md` (nuovo, root) | gemello dell'aggancio + salvaguardia PROD | far conoscere il sistema a Codex |
| `.cursor/rules/comandi-base.mdc` | +1 riga «ragioniamo» | parità Cursor |
| `docs/COMUNICAZIONE_UTENTE_SKILL.md` | nota «ragioniamo» = tabella+checklist | coerenza con la skill comunicazione |

## Test eseguiti e risultato
- **Coerenza livelli 1/2/3:** la sintesi in CLAUDE.md e AGENTS.md combacia con la tabella livelli del VOCABOLARIO (righe 18–22). ✅
- **Diff = modifiche reali:** `git diff --stat` mostra esattamente i 5 file + AGENTS.md nuovo. ✅
- **Nessun codice app / migrazione toccati.** ✅ (solo documentazione/config)
- **Non eseguito:** prova runtime «ragioniamo» in chat pulita di Claude Code/Codex (non possibile in questa stessa chat — contesto già caricato). Da fare lato Matteo.

## File di skill aggiornati
Vedi tabella sopra: VOCABOLARIO (voce nuova), CLAUDE.md / AGENTS.md / comandi-base.mdc (aggancio), COMUNICAZIONE_UTENTE_SKILL (nota). Le tre porte d'ingresso puntano tutte al VOCABOLARIO come fonte unica.

## Dati comunicazione
### Cronologia / prompt di Matteo (annotati)
| # | Verbatim / sintesi | Intento | Esito agente |
|---|---|---|---|
| 1 | «skill system qua non funziona bene come in altra app… rules all'avvio + parola ragioniamo… capire se ci sono comandi iniettati… (valore 1/3 fanno da soli, valore 2 chiede conferma)» | diagnosi + portare «ragioniamo» e verificare i comandi | esplorato 2 progetti, diagnosi: aggancio mancante per Claude Code; «ragioniamo» assente |
| 2 | (plan rejected) «procedi, ma assicurati che funzioni anche per codex già configurato in questa repository» | estendere il fix a Codex | scoperto: nessun `AGENTS.md` → stesso buco; aggiunto al piano |
| 3 | «lavoro ok. fai report finale.» | scrivi report completo + commit/push | questo report + commit su conferma |

### Frasi ricorrenti
- «ragioniamo» — termine portato dall'altra app, ora voce Liv. 1.
- Nessuna voce Liv. 2 applicata in questa sessione.

### Cosa è automatizzabile vs manuale
- **Manuale (deciso):** tenere tre file d'aggancio gemelli — costo basso, ognuno è breve e punta al VOCABOLARIO. Alternativa (script di sync) sovra-ingegnerizzata per 3 file statici.
- **Pattern nuovo intuito:** ogni nuovo grilletto importante va aggiunto in **tre** punti (Cursor/Claude/Codex). Candidata futura: una checklist «nuovo grilletto → 3 agganci» in EVOLUZIONE_SKILLS (non promuovo da solo → PROPOSTE).

## Analisi flusso prompt, efficienza e statistiche (skill system)
1. **Statistiche sessione:** 3 messaggi sostanziali Matteo; 1 domanda (AskUserQuestion 2 quesiti); 0 correzioni di merito; 1 plan rejected con estensione di scope (Codex); 6 file scritti; commit in attesa di conferma.
2. **Cronologia prompt:** vedi tabella sopra.
3. **Cosa non è successo in chat:**
   | Tipo | Dettaglio |
   |------|-----------|
   | Test non eseguiti | nessuna prova runtime «ragioniamo» (contesto chat già caricato) |
   | Azioni non richieste | nessun commit/push ancora (in attesa conferma) |
   | Skill non promosse | candidata «checklist 3-agganci» solo segnalata, non scritta in PROPOSTE |
   | DB non toccato | nessuna query/migrazione |
4. **Anatomia prompt principale:** prompt 1 ricco (problema + riferimento all'altra app + spiegazione livelli) → indice completezza ~8/10 (mancava l'ambiente, chiesto via AskUserQuestion).
5. **KPI efficienza:** 0 rework post-accettazione; lo scope-creep (Codex) è arrivato come correzione utile in fase di approvazione piano, non come errore agente.
6. **Cosa replicare / migliorare:** replicare la diagnosi «quale file legge ogni ambiente» prima di assumere che manchi il contenuto. Migliorare: chiedere l'ambiente prima (l'ho fatto, ma Codex non era tra le opzioni → emerso solo al reject).
7. **Automatizzabile vs manuale:** vedi sezione Dati comunicazione.
8. **Lettura qualità agente (dati, non voto):** sessione lineare, una sola estensione di scope ben gestita; il rischio era assumere che il sistema fosse incompleto invece che non-agganciato — evitato esplorando entrambi i progetti.

## La mia lettura della sessione
Andata liscia. Il valore è stato nella **diagnosi** (il sistema c'era, mancava solo l'aggancio per ambiente), non nella quantità di codice. La scoperta di Codex senza `AGENTS.md` ha confermato che il problema era strutturale (un buco per ogni ambiente che non sia Cursor), non specifico di Claude Code.

## Pratiche senior — propagazione al template v0 (`_skill-system-v0/`, gitignored, NON committato)
L'hook senior + Matteo hanno chiesto di propagare gli upgrade **strutturali** al template generico riusabile. Toccato (elencato qui, non committato perché gitignored):
- `CLAUDE.md.template` — nota «tre ambienti, tre porte gemelle» + sezione comandi/vocabolario generica.
- `AGENTS.md.template` — **nuovo**, gemello per Codex (prima il template non aveva l'aggancio Codex).
- `comunicazione/COMUNICAZIONE_SKILL.md` (template) — nuova §1b «ragioniamo».
- `comandi-base.mdc.template` — **nuovo**, rule Cursor di default (mancava del tutto): grilletti + livelli + salvaguardie + «ragioniamo», con segnaposto `{{...}}` per le parti specifiche d'app.
- `PREPARA_PROMPT_SKILL.md.template` — **nuovo**, skill prepara-prompt generica snella (mancava del tutto): i due momenti monte/valle, filtro rischi, output attesi, fallback vocabolario — senza i casi specifici di CalendarBackup.

**Lezione strutturale (per EVOLUZIONE_SKILLS, da ratificare in sessione Meta):** un grilletto/comando va agganciato in **tre** file gemelli (Cursor `comandi-base.mdc` · Claude Code `CLAUDE.md` · Codex `AGENTS.md`); in un solo file scatta solo nell'ambiente che lo legge. Il template v0 deve contenere tutti e tre + la skill prepara-prompt + la rule di default.

## Derivazione errori
Nessun bug. Due «sorprese», entrambe **lacune di configurazione preesistenti** (non errori introdotti): (1) Codex senza `AGENTS.md`; (2) template v0 senza la rule Cursor di default né la skill prepara-prompt. Entrambe colmate.

## Cosa resta per la prossima sessione
- Verifica runtime «ragioniamo» in chat pulita (Claude Code + Codex).
- Eventuale candidata PROPOSTE: «checklist nuovo-grilletto → 3 agganci».

## Domande di chiusura
❓ Q1 — Prompt ricevuti (verbatim sostanziali):
✅ R1: vedi tabella «Cronologia prompt» sopra (3 prompt: diagnosi+ragioniamo / estendi-a-Codex / lavoro ok+report finale).

❓ Q2 — Dati = diff reale?
✅ R2: sì. `git diff --stat`: `.claude/CLAUDE.md` (+25), `.cursor/rules/comandi-base.mdc` (+3), `docs/COMUNICAZIONE_UTENTE_SKILL.md` (+6), `docs/Comunicazione-Skill/VOCABOLARIO.md` (+13), `AGENTS.md` nuovo. Numeri corrispondono.

❓ Q3 — File correlati allineati?
✅ R3: sì. Le tre porte d'aggancio (CLAUDE.md, AGENTS.md, comandi-base.mdc) e la nota in COMUNICAZIONE_UTENTE_SKILL puntano tutte alla voce nel VOCABOLARIO (fonte unica). Livelli 1/2/3 coerenti con la tabella del VOCABOLARIO.

❓ Q4 — Cosa NON hai fatto / lasciato a metà?
✅ R4: nessuna prova runtime di «ragioniamo» (questa chat ha già il contesto). Candidata «checklist 3-agganci» solo segnalata, non scritta in PROPOSTE (l'agente di lavoro non promuove da solo).

❓ Q5 — Attrito + miglioria?
✅ R5: l'opzione «Codex» non era tra le scelte di ambiente che ho offerto → è emersa solo al reject del piano. Miglioria: includere Codex tra gli ambienti possibili quando si chiede «dove usi il progetto».

❓ Q6 — Contesto & hook?
✅ R6: contesto giusto (CLAUDE.md + memoria sullo skill system). La modifica a `PROSEGUIMENTO_MAPPATURA_SKILL.md` presente nel working tree NON è mia (altra sessione admin di oggi) → tenuta fuori dal commit.
