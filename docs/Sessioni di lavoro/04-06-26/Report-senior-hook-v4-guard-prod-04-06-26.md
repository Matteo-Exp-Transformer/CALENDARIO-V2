# Report sessione SENIOR — hook v4 (domande di chiusura) + guard PROD (04-06-26)

**Agente:** Meta senior evoluzione skill system (Claude Code, Opus 4.8)
**Modalità:** deep
**Innesco Matteo:** «ciao. sei agente senior meta comunicazione. aiutami a valutare efficacia di hook gai installati in skill system. inoltre analizza il dossier preparato da agente analisi skill comunicazione.»

---

## 1. Cappello

- **Cosa è cambiato:** gli hook di fine-sessione ora controllano **risposte a domande obbligate** (non più la sola presenza dei titoli di sezione); installata una **guardia PROD** che ferma le scritture sul DB di produzione e chiede conferma.
- **Cosa resta:** la milestone «architettura context-knowledge / mappatura aree app» (vedi §7) — pianificata, non eseguita. Propagazione template v.0 sospesa di proposito.
- **Serve una tua azione:** no per ora. Quando vorrai partire con la mappatura aree app, prepari tu il prompt.

---

## 2. Cosa è stato fatto (in linguaggio pratico)

1. **Valutata l'efficacia degli hook esistenti** e letto il dossier del revisore. Conclusione: l'hook funziona, la tua osservazione («insistente ma va bene») è corretta; il merito che hai notato (`CHIUSURA_SESSIONE.md` migliora gli agenti) e l'hook fanno lavori diversi e complementari — il documento alza la qualità *prima*, l'hook prende i residui *dopo*.

2. **Installata la guardia PROD.** Prima la regola «su produzione fermati e chiedi» era solo scritta (dipendeva dalla buona volontà dell'agente). Ora una macchina ferma davvero le scritture sul DB di produzione e chiede conferma. Vale sia su Cursor sia su Claude Code (dove lavora il senior).

3. **Cambiato il meccanismo dell'hook fine-sessione (v4).** Su tua richiesta: invece di controllare se *esiste il titolo* di una sezione (un titolo vuoto passava), ora il report ha una sezione **«Domande di chiusura»** con 6 domande a cui ogni agente DEVE rispondere. L'hook controlla che le risposte ci siano davvero. Se mancano → blocca (fino a 3 rilanci). Se ci sono tutte → un solo rilancio leggero che chiede di ricontrollare le incongruenze.

4. **Allineati i due hook** (Cursor + Claude Code senior) e corretto un falso-positivo dell'hook senior.

---

## 3. File toccati e perché

| File | Modifica | Perché |
|------|----------|--------|
| `.cursor/hooks/guard-prod.mjs` | **nuovo** | Guardia PROD su Cursor (`beforeMCPExecution` + `beforeShellExecution`), `permission:"ask"` |
| `.claude/hooks/guard-prod.mjs` | **nuovo** | Gemello guardia PROD su Claude Code (`PreToolUse`), perché il senior scrive su PROD da qui |
| `.cursor/hooks/fine-sessione-nudge.mjs` | riscritto v4 | Da controllo-titoli a controllo-risposte (domande di chiusura) |
| `.claude/hooks/fine-sessione-senior.mjs` | riscritto v4 | Allineato al gemello Cursor + fix falso-positivo report meta/dossier |
| `.cursor/hooks.json` | aggiornato | Registrati i due eventi guard-prod; `loop_limit` 1→3 sul nudge |
| `.claude/settings.local.json` | aggiornato | Registrato `PreToolUse` guard; rimossi 3 `allow` di scrittura PROD (`apply_migration`, `execute_sql`, `Bash(supabase db *)`) |
| `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` | aggiornato | Nuova sezione 11 «Domande di chiusura» + box hook aggiornato |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | aggiornato | M4 guard PROD installata; Log idee: hook v4, Liv.2, milestone context-knowledge |

---

## 4. Test eseguiti e risultato

Nessun test app (lavoro su hook/config/doc). Test funzionali sugli hook con payload finti:

- **guard-prod (Cursor):** 7 casi → scritture PROD (`apply_migration`, `DELETE`, `db push`) = `ask`; letture (`list_tables`, `SELECT`), TEST, comandi innocui = `allow`. Tutti corretti.
- **guard-prod (Claude Code):** 6 casi → stesso esito con sintassi `permissionDecision`. Tutti corretti.
- **nudge v4 (Cursor):** risposte mancanti/placeholder → blocco mirato; sezione assente → chiede sezione intera; tutte piene loop0 → rilancio leggero; loop1 → silenzio; nessun report → silenzio; formato Q/R su stessa riga o righe separate → entrambi gestiti. Verdi.
- **senior v4 (Claude Code):** completo → block con check + punti senior; `stop_hook_active:true` → lascia chiudere; parziale → block mirato. Verdi.

**Lezione tecnica:** gli hook che ricevono JSON vanno testati serializzando l'input con un programma (Node `JSON.stringify`), NON con `echo`/`printf` — bash mangia un livello di backslash e rompe il JSON dei path Windows, dando falsi fallimenti.

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `CHIUSURA_SESSIONE.md` | sezione 11 + box hook | Le domande di chiusura sono parte della procedura — fonte unica |
| `EVOLUZIONE_SKILLS.md` | M4 + Log idee (4 righe nuove) | Registrato il deciso: guard installata, hook v4, Liv.2 confermate, milestone CK |

Nessuna skill-area di feature toccata (il lavoro è sul motore dello skill system, non sull'app).

---

## 6. Dati comunicazione

- **Stile sessione:** Matteo guida con osservazioni di metodo («mi dispiace togliere un controllo severo»; «i dati siano single source of truth, no?») che spostano la soluzione. Più volte ha **migliorato il design** correggendo l'agente verso la radice del problema invece del sintomo.
- **Richieste ricorrenti:** «spiegami con esempi di flusso», «aiutami a capire quanto pesa in token». Vuole capire il *come funziona* e il *costo*, non solo il risultato.
- **Pattern decisionale:** ha accettato i «consigliati» dove il trade-off era chiaro, ha **deviato** dove aveva informazione che l'agente non aveva (Liv.2: «le uso, sono basso-uso legittimo»).
- **Automatizzabile con certezza:** il controllo presenza-risposte (fatto). **Manuale:** la verifica intelligente dati↔diff (la fa l'agente, l'hook non vede il diff).

### Analisi flusso prompt, efficienza e statistiche

- N° prompt sostanziali di Matteo: **4**. Correzioni dopo 1ª risposta: **0** (le deviazioni erano scelte informate, non correzioni). Follow-up generati: **0**. Modalità alzata in corsa: **no** (deep dall'inizio).
- Cosa ha reso i prompt efficaci: Matteo ha posto domande di *principio* («single source of truth, no?») che hanno evitato di costruire la soluzione sbagliata (hook-guardia) e portato a quella giusta (architettura a strati). Da replicare: fermarsi sul principio prima di implementare.

---

## 7. Idee e decisioni — comprese quelle in sospeso

### Eseguite in questa sessione
- ✅ Guard PROD (Cursor + Claude Code) — chiude D2 del dossier e M4 «guard PROD».
- ✅ Hook v4 domande di chiusura + allineamento dei due hook + fix falso-positivo senior.
- ✅ Liv.2 «main dell'app»/«menù originale» **confermate** (Matteo le usa poco ma le intende): l'agente chiede conferma se ha dubbio. Sciolto il dubbio del dossier (non-uso vs non-registrazione).
- ✅ Rimossi i 3 `allow` di scrittura PROD perché la guard morda anche su Claude Code.

### In sospeso / pianificate (NON dimenticare)
- ⏳ **MILESTONE context-knowledge + mappatura aree app** (la più importante). 3 strati: codice=verità → file .md di conoscenza che lo specchiano → skill che rimandano. Cura E-A/E-B alla radice. Da fare in sessione dedicata con PLAN + sub-agent di verifica, cogliendo l'occasione per **mappare il flusso dati di ogni area/pagina** e validare che ogni elemento abbia senso. Matteo prepara il prompt. *(salvata anche in memoria persistente)*
- ⏳ **Regola lettura-integrale** (agente legge il file/codice INTERO prima di editare, tranne micro-fix): da scrivere INSIEME alla milestone CK, non prima.
- ⏳ **Propagazione template v.0** (`_skill-system-v0/`): SOSPESA di proposito finché non atterra la milestone CK — propagarlo ora sarebbe lavoro da rifare.
- 💤 **Domande di chiusura — set ridotto a 6**: lasciate fuori per ora (recuperabili) modalità-alzata, n.giri-correzione, voci-Liv.2-dettaglio, test-cosa-verificato. Si valutano dopo aver visto come gli agenti rispondono alle 6. Le 6 attuali coprono: prompt-verbatim, dati=diff, file-correlati, cosa-non-fatto, attrito+miglioria, contesto+hook.
- 💤 **Quando allentare l'hook insistente:** la domanda Q6 («hook utile o rumore?») raccoglie ora il dato che oggi mancava. Regola d'uscita proposta: quando per ~10 sessioni a report completo l'hook non corregge mai nulla E le risposte Q6 dicono «rumore» → passare da «rilancia sempre» a «rilancia solo se manca qualcosa».

### Strategia generale per evolvere lo skill system (mia lettura da senior)
1. **Cura alla radice, non col guardiano.** Dove un errore nasce da una duplicazione (E-A), togli la duplicazione (SSoT nel codice) invece di aggiungere un controllo che la pesca. L'hook resta per ciò che è davvero solo verificabile a posteriori.
2. **L'hook vale per l'atto di rilettura, non solo per cosa controlla.** Il valore di «rilancia sempre» è costringere l'agente a riguardare il proprio lavoro a mente fredda. Tienilo finché il dato (Q6) non dice che è rumore.
3. **Le domande di chiusura sono il sensore del sistema.** Q5 (attrito+miglioria) e Q6 (contesto+hook) trasformano ogni report in un dato su quanto lo skill system aiuta o pesa. È la base per snellire con cognizione invece che a sensazione.
4. **Severo sul contenuto mancante, leggero sulla conferma.** Non scegliere tra «sempre insistente» e «mai»: blocca dove manca sostanza, alleggerisci dove c'è.

---

## 8. La mia lettura della sessione

Sessione di **design di metodo**, non di codice-app. Il valore vero non è stato scrivere gli hook (lavoro meccanico, ben testato) ma le due volte in cui Matteo ha spostato la soluzione verso la radice: «single source of truth» (che ha trasformato un fix-hook in una milestone architetturale) e «mi dispiace perdere la severità» (che ha evitato di buttare via l'effetto-rilettura passando a un meccanismo più forte invece che più debole).

**Difficoltà incontrata + come risolta:** ho perso tempo su falsi fallimenti dei test perché passavo JSON da bash con backslash non escappati. Risolto serializzando l'input con Node. Annotato come lezione.

**Miglioria che suggerirei (come dato):** prima di proporre un hook-guardia per un errore, l'agente senior dovrebbe chiedersi «questo errore nasce da una duplicazione evitabile?» — se sì, la cura è togliere la duplicazione, non sorvegliarla. In questa chat l'ha detto Matteo, non l'agente. Varrebbe la pena codificarlo come riflesso nel Playbook senior.

---

## 9. Derivazione errori

- **errore agente (mio, minore):** test hook falliti per JSON malformato da bash. Causa: backslash non escappati nei path Windows passati via `echo`. Evitabile serializzando l'input con un programma. Già annotato come lezione in EVOLUZIONE_SKILLS.
- **vincolo strutturale (gestito):** su Claude Code un `ask` non vince un `allow` già concesso → rimossi i 3 `allow` di scrittura PROD perché la guard sia efficace. Annotato.
- **errore agente — bug nell'hook stesso, scoperto dall'hook (post-commit):** i marcatori `❓`/`✅`
  non erano ancorati a inizio riga, quindi un `❓Q` **citato dentro una risposta** (in R2 avevo scritto
  «nel formato `❓Q/✅R`») veniva contato come nuova domanda → numerazione sballata → falso «Q2 vuota».
  Causa: regex troppo permissivo. Fix: ancorare a `^[\s>\-*]*` in entrambi gli hook. È un caso quasi
  certo (la doc usa quei simboli), quindi correzione alla radice, non aggiramento. **Lezione meta: l'hook
  v4 ha trovato un suo stesso difetto al primo uso reale — il sistema si auto-controlla, ma i marcatori
  di un controllo automatico non devono mai poter comparire nel contenuto controllato senza ancora.**
- Nessun bug preesistente né prompt ambiguo in questa sessione.

---

## 10. Cosa resta per la prossima sessione

- Avviare la **milestone context-knowledge / mappatura aree app** quando Matteo prepara il prompt (vedi §7).
- Osservare le prime sessioni con l'hook v4: le 6 domande funzionano? `loop_limit:3` è troppo o giusto? Raccogliere Q6 per la regola d'uscita.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «ciao. sei agente senior meta comunicazione. aiutami a valutare efficacia di hook gai installati in skill system. inoltre analizza il dossier preparato da agente analisi skill comunicazione… io posso dire che hook è abbastanza insistente nelle chat per ora va bene… grazie ad hook sono stati prevenuti errori… parliamone». (2) «domanda però ora hook corregge sempre a prescindere. infatti vorrei provare a fare un test e impostarlo che corregge solo se le sezioni sono vuote. direi a questo proposito di mettere domande specifiche a cui deve rispondere agente riportando la domanda nel suo report… questo valido per qualsiasi agente che fa un report… (ho comunque notato che hook insistente ha fatto il suo dovere…)». (3) «io credo che in questo caso la soluzione sia che i dati in questione non siano ripetuti in più sezioni. ma single source of true. o no?». (4) «sono per codice source of true. però domanda: se avessimo cartella context knowledge con file .md che tengono solo dettagli utili e specifiche tecniche, mentre attuali file skill system hanno loro come riferimento… in più secondo me è importante che agenti leggano praticamente sempre… i documenti di riferimento o file contenente la parte di codice da modificare per intero». (5) «annota che con senior evoluzione skill system devo ragionare a mappare aree app, e creare file di contesto e dettagli, per evolvere skill system. riporta tutte le informazioni utili e tue strategia… elabora il tuo report finale e fai commit».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ri-verificato su git `568f719`: **3 file** versionati (**+313 −136**) — `guard-prod.mjs` nuovo, `fine-sessione-nudge.mjs` v4, `hooks.json` con `loop_limit:3` + eventi `beforeMCPExecution`/`beforeShellExecution`. Su disco: gemello `.claude/hooks/guard-prod.mjs` + `fine-sessione-senior.mjs` (gitignored); `settings.local.json` con `PreToolUse`, **senza** i 3 `allow` scrittura PROD. `CHIUSURA_SESSIONE.md` §11 con 6 domande `❓Q/✅R`. Test hook Node (guard 7+6 casi, nudge/senior) come §4. Cartella test `99-99-99` rimossa.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati? Elencali.
✅ R3: Collegati e allineati: `CHIUSURA_SESSIONE.md` (box hook aggiornato al nuovo comportamento blocca/leggero, coerente col codice); `EVOLUZIONE_SKILLS.md` M4 (guard da «da fare» a «installato») + Log idee (hook v4 + Liv.2 + milestone CK); `comandi-base.mdc` — verificato che la sua nota sull'hook fine-chat resta valida (non cita il meccanismo interno, solo «assecondalo», quindi non va toccato). Memoria persistente aggiornata con la milestone. Template v.0 NON toccato di proposito (sospeso).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Per scelta condivisa: NON eseguito D1 (template v.0, sospeso), NON eseguita la milestone context-knowledge (pianificata, Matteo prepara il prompt), NON scritta la regola lettura-integrale (va con la milestone), NON aggiunte le 4 domande di chiusura extra (set ridotto a 6 per la fase test). Nulla lasciato a metà involontariamente.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: ho rischiato di proporre un hook-guardia per E-A quando la cura giusta era togliere la duplicazione (l'ha colto Matteo, non io). Miglioria: aggiungere al Playbook senior un riflesso esplicito — «prima di proporre un guardiano, chiediti se l'errore nasce da una duplicazione evitabile; se sì, cura la radice». Secondo attrito minore: testare hook JSON da bash è fragile; il workflow dovrebbe avere uno snippet-helper Node già pronto per simulare lo stdin degli hook.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco? E gli hook ricevuti ti sono stati utili o rumore?
✅ R6: Contesto: **giusto** — il dossier + EVOLUZIONE_SKILLS + CHIUSURA_SESSIONE + i file hook davano tutto il necessario senza eccesso; ho letto io i file mancanti al bisogno. Hook ricevuti: l'hook `Stop` senior ha agito a fine sessione precedente come previsto; in questa sessione il suo valore è stato indiretto (mi ha tenuto presente la struttura del report). Utile, non rumore — ma è proprio il dato che Q6 deve raccogliere su molte sessioni per decidere quando allentare.
