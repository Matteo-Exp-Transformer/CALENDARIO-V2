# EVOLUZIONE SKILLS — roadmap di sviluppo dello skill system

> **A cosa serve.** Qui non si raccolgono dati su *come parla Matteo* (quello è `OSSERVAZIONI.md`)
> né bug di processo (`ERRORI_PROCESSO.md`). Qui si raccoglie e si decide **come far evolvere il
> sistema stesso**: automazioni, statistiche, tecniche non ancora usate, raffinamenti.
>
> **Due ruoli (come nel resto del sistema):**
> - **Meta junior** (per lo più agenti Cursor / modelli più piccoli): *annotano* — quando durante una
>   sessione notano un'idea utile, aggiungono **una riga** nel Log idee in fondo. Non progettano, non
>   decidono. Spontaneo: solo se salta all'occhio qualcosa, non a ogni sessione.
> - **Meta senior** (Opus 4.8+, on-demand quando Matteo lo lancia): lavora **in chat con Matteo** come
>   partner di ingegneria del sistema, su **tre fronti**:
>   1. **Riorganizzare** — consolidare in fonti uniche, togliere duplicati, mettere ogni cosa nel file giusto.
>   2. **Snellire** — alleggerire i file di lavoro, archiviare il consolidato (file leggeri = sistema usabile).
>   3. **Evolvere** — analizzare Log idee/milestone/dati, decidere automazioni, far avanzare milestone, potare idee morte.
>   Non cala decisioni dall'alto: usa `AskUserQuestion` e **confronta le idee di Matteo con principi di
>   ingegneria** per educarlo a migliorare il metodo. È l'unico che trasforma idee grezze in lavoro
>   pianificato. **Applica il Playbook del Meta senior** (sotto). Confermato mandato esplicito 02-06-26.
>
> **Flusso reale:** agenti annotano durante il lavoro → Matteo, dopo alcune sessioni, chiede una
> revisione comunicazione → poi lancia il Meta senior per analisi + fix + sviluppo del sistema.

---

## Playbook del Meta senior (competenze, raccolte dalle sessioni)

> Strumenti e principi che il senior applica. Aggiornato dalle sessioni reali — l'ultima (02-06-26)
> ha aggiunto enforcement via hook, alleggerimento file e il modello mentale degli hook.

**1. Markdown vs enforcement — la domanda che decide tutto.** Prima di promettere un'automazione,
chiediti: *la regola è verificabile guardando i FILE, o solo conoscendo la CONVERSAZIONE?*
- File (es. «il report ha la sezione X?») → **hook possibile** (la macchina lo verifica).
- Chat (es. «ha consegnato più output di quanti chiesti?») → **hook impossibile**; il massimo è il
  vincolo dentro il prompt (semi-enforcement). Esempio: scope creep → riga `Output attesi:` nel prompt.
Una regola markdown che già c'è e viene saltata **non si ripara con un'altra markdown**: serve l'hook.

**2. Cosa fa (e cosa NON fa) un hook.** L'hook **sposta il momento** in cui l'informazione arriva
(es. «come scrivere il report» consegnato a fine chat, non tenuto in testa tutta la sessione). NON
rende il sistema più piccolo da solo: è il *fattorino*, non chi riordina la casa. Il dimagrimento vero
lo fa la **riorganizzazione** (mettere le cose nei file giusti).

**2-bis. La matrice che decide DOVE va una regola (estende il punto 1 — 03-06-26).** Due assi, non uno:
- **Asse A — cosa verifica:** FILE (hook possibile) vs CHAT (solo vincolo nel prompt). [già nel punto 1]
- **Asse B — QUANDO agisce:** *durante* il lavoro (preventivo) vs *dopo* (a posteriori).

|                          | Verificabile dai **file**            | Verificabile solo dalla **chat**        |
|--------------------------|--------------------------------------|-----------------------------------------|
| **Agisce DURANTE** (prev.) | riga obbligatoria nel **prompt**     | vincolo nel **prompt** / `comandi-base` |
| **Agisce DOPO** (a post.)  | **hook `stop`** (legge i report)     | *impossibile* (chat finita, niente la legge) |

Esempio risolto 03-06: «allinea la skill» è verificabile dai file MA va fatta *durante* la chiusura
→ è andata in `comandi-base` (preventivo) + check nell'hook `stop` (rete a posteriori). **Due leve.**

**2-ter. `stop` non è un promemoria, è un RILANCIO (scoperta 03-06-26).** L'`agent_message` dell'hook
`stop` NON è visibile all'agente (la chat è chiusa) → arrivava a vuoto. Ma `stop` può emettere
**`followup_message`**: auto-invia un turno che riapre il loop → l'agente RICEVE e RISPONDE. È «il
potenziale di `stop`» che cercava Matteo. Guardia anti-loop: lo stdin porta `loop_count` (parte da 0);
politica scelta «rilancia 1 volta sola» → `if (loop_count >= 1) tace`. Rete extra: `loop_limit:1` in
`hooks.json`. **L'hook `stop` v3 (03-06-26) usa questo: rilancia SEMPRE 1 turno se c'è report fresco,
anche se completo (Matteo: «ripeti anche se a posto, la presenza del titolo non garantisce il contenuto»).**

**2-quater. Mappa hook Cursor — solo 3 parlano all'agente (riferimento 03-06-26).** Cursor ha 20+
eventi, ma per iniettare/rilanciare ne contano 3 + il blocco:
| Hook | Quando | Cosa può fare | Uso skill system |
|------|--------|---------------|------------------|
| `sessionStart` | avvio chat (1×) | inietta `additional_context` | = `comandi-base` (già coperto da `alwaysApply`) |
| `postToolUse` | dopo OGNI tool ok | inietta `additional_context` | regole contestuali su un file (rumoroso → futuro) |
| `stop` | fine loop agente | `followup_message` (rilancia) | **nudge fine-chat v3** ✅ |
| `preToolUse`/`beforeMCPExecution`/`beforeShellExecution` | prima azione/MCP/shell | **solo `allow`/`deny`** (NON inietta testo) | guard PROD/LOCK (enforcement vero, futuro M4) |

> ⚠️ Trappola da non ripetere: `preToolUse` e `beforeSubmitPrompt` NON possono iniettare istruzioni
> (solo bloccare / informare). «Istruisci l'agente prima che scriva» NON si fa con loro → si fa con
> `sessionStart`/`comandi-base`. Verificato su `cursor.com/docs/hooks.md` (03-06-26).

**3. Alleggerire i file (principi di ingegneria applicati).**
- **Cohesion by lifecycle phase:** raggruppa per *quando* serve, non per *tipo*. Tutto il «fine chat»
  in un file (`CHIUSURA_SESSIONE.md`), puntato dall'hook quando quella fase arriva.
- **Single source of truth:** una sola copia di ogni istruzione. Se due file dicono la stessa cosa,
  si disallineano → tieni il dettaglio in un posto, gli altri rimandano. (Fatto: APP_CONTEXT §7.1 →
  rimando, non copia.)
- **Evita il god-object:** un file di fase va bene finché la fase ha confini *finiti*. «Chiusura» sì
  (report→commit→push→allinea→terminali). «File di tutto» no.
- **Nastro trasportatore, non magazzino:** `OSSERVAZIONI.md` processa dati, non li accumula. Ogni
  osservazione → diventa regola / resta in osservazione con motivo / si butta. Lo storico consolidato
  va in archivio (`ARCHIVIO_*.md`), i file di lavoro restano leggeri.

**4. Sequenza di una sessione senior.** Parti dal dossier del revisore (se c'è) → non ri-diagnosticare,
**decidi e fai avanzare**. Ogni decisione che spetta a Matteo → `AskUserQuestion` con opzioni pesate
(no piani calati). Onestà sul limite della propria mossa: dire «la mia prima idea è markdown-su-markdown,
non basta» ha prodotto le decisioni migliori. Educare Matteo confrontando le sue idee con l'ingegneria.

**5. A fine sessione senior:** archivia il deciso (file di lavoro leggeri), aggiorna questo Playbook se
hai imparato un metodo nuovo, propaga gli upgrade strutturali nel template v.0 (`REVISIONE.md` §6b).

**6. Educare Matteo (mandato esplicito 04-06-26).** Il senior non risolve solo problemi: **insegna**.
- **Durante** la chat: introduci i **termini tecnici nuovi in grassetto** quando emergono dal lavoro
  vero, con definizione semplice + esempio dalla chat in corso. Progressione **scaffolding** (parole →
  frasi → concetti). Matteo è non-tecnico ma vuole imparare il linguaggio professionale per scrivere
  prompt migliori.
- **A fine** chat, nel report, una sezione **«Lezione della chat — parole e concetti elaborati»**: una
  valutazione da insegnante che conosce il percorso e il progetto di Matteo e lo confronta con gli
  **standard reali del lavoro**. 5 punti: (1) che lezione ho ricevuto; (2) cosa ho deciso io
  spontaneamente — **distinguendo (a) risposte guidate** (rispondo a una domanda / elaboro un concetto
  TUO = applico) **da (b) idee autonome** (intuizioni mie o progettate dai primi prompt = genero); un
  insegnante valuta (b) più di (a); (3) **ho deciso bene o sbagliato?** (onesto, non compiacente —
  nomina gli anti-pattern col loro nome: *scope creep*, *premature optimization*…); (4) cosa sento di
  aver appreso; (5) cosa devo ancora consolidare (input per i richiami **spaced-repetition** della
  sessione dopo). Niente voti numerici finché non c'è storico.
- Dettaglio sistema didattico (profilo, glossario, roadmap, rubric): `_lavoro/Per matteo/PIANO_SISTEMA_DIDATTICO.md`
  (file PRIVATO gitignored). Memory: `feedback_educare_vocabolario_matteo`.

> 🛑 **PAUSA-RACCOLTA (decisa 29-05-26).** Lo skill system ha avuto molte aggiunte in pochi giorni.
> **Stop a nuovi meccanismi/regole** finché non si accumulano ~5-10 sessioni di dati con gli
> strumenti già esistenti (modalità, metriche successo chat, log idee). Il prossimo passo è
> **misurare**, non aggiungere. Le nuove idee vanno nel Log idee, non implementate subito. Il senior
> decide cosa promuovere **sui dati**, non sull'intuizione. Questo è il principio che separa un
> sistema scalabile (poche regole validate) da uno burocratico (molte regole non verificate).

---

## ⚠️ Distinzione tecnica importante (markdown vs enforcement vero)

Non tutto ciò che scriviamo qui è "automazione" allo stesso modo:

- **Governance soft** (regole in `.md`): l'agente *dovrebbe* seguirle, ma non è obbligato dalla
  macchina. È quasi tutto lo skill system di oggi. Funziona con agenti collaborativi.
- **Enforcement vero** (eseguito dalla macchina, non dal modello): solo dove la piattaforma lo
  permette — **hook in `settings.json`** di Claude Code (es. comando che gira pre-commit o a inizio
  task). Cursor ha meno leve.

Il senior, quando pianifica un'automazione, **deve dichiarare quale dei due tipi è**. Promettere
"comandi che scattano da soli" via markdown è un buon proposito, non un'automazione.

---

## Milestone attive

> Ordinate per impatto sul workflow di Matteo (scrivere prompt → leggere report → chiudere il lavoro).
> Stato: ⬜ da iniziare · 🔶 in corso · ✅ fatta.

### M1 — Prompt più veloci da scrivere ⬜
**Obiettivo:** ridurre i giri di chiarimento tra Matteo e l'agente prepara-prompt.
**Idee concrete:** template di prompt per i task ricorrenti (es. "fix UI Prenota", "nuova promo",
"nuova migrazione"); mockup HTML per le scelte UX/flusso prima dell'implementazione (già candidato in
`PROPOSTE.md` / `PREPARA_PROMPT_SKILL.md`).
**Tipo:** governance soft.

### M2 — Report a colpo d'occhio 🔶
**Obiettivo:** Matteo decide se aprire un report senza leggerlo tutto.
**Idee concrete:** ogni report standard/deep apre con **3 righe fisse**: (1) cosa è cambiato per
l'utente, (2) cosa resta da fare, (3) serve una tua azione sì/no. La modalità light/standard/deep
(fatta) è il primo passo di questa milestone.
**Tipo:** governance soft (regola nel template report).
**Stato:** ✅ cappello 3 righe codificato in `APP_CONTEXT_SKILL.md` §7.1 (29-05-26). Resta da
valutare all'uso se le 3 righe scelte sono quelle giuste per Matteo (raccogliere feedback).

### M3 — Chiusura con una parola sola ⬜
**Obiettivo:** non ripetere ogni volta "fai report + comunicazione + committa".
**Idee concrete:** una parola di vocabolario fa partire il protocollo di fine lavoro **giusto per la
modalità** del task (light → 1 riga log; standard → report; deep → tutto). Oggi servono più frasi.
**Tipo:** governance soft (voce vocabolario + §7).

### M4 — Enforcement via hook 🔶
**Obiettivo:** blindare gli errori costosi che una regola markdown non può garantire.
**Stato (02-06-26):** primo enforcement vero **attivo** → hook `stop` v2 mirato (vedi box leve Cursor
sotto). La scelta di campo che ha sbloccato M4: il dossier revisore + Matteo hanno verificato che la
sezione report «mancante» era **già obbligatoria nel template** e gli agenti la saltavano lo stesso →
una regola markdown sopra una regola markdown non cura nulla; serviva la macchina che **controlla i
file**. Prossimi passi M4: `beforeShellExecution` guard PROD, eventuale salto `deny` del nudge.
**Idee concrete:** spostare in hook di `settings.json` i controlli critici — es. verifica TEST vs
PROD prima di scrivere sul DB, `npm run validate` pre-commit, blocco commit su file LOCK senza
conferma. La macchina li esegue, non dipende dalla buona volontà dell'agente.
**Tipo:** **enforcement vero** (config tecnica, non markdown). Skill harness: `update-config`.

> **✅ CORREZIONE 01-06-26 — Cursor HA gli hooks (l'analisi di ieri era incompleta).** Ricerca su
> doc ufficiale (`cursor.com/docs/agent/hooks`): Cursor supporta hook di lifecycle in
> `.cursor/hooks.json`, con eventi tra cui `stop`, `sessionStart`, `beforeShellExecution`,
> `preToolUse` ecc. Gli hook sono processi che comunicano via stdin/stdout JSON; alcuni possono
> **bloccare** (`permission: deny`, exit code 2), altri solo osservare. → **Cursor permette
> enforcement vero, non solo governance soft.** Il limite reale è un altro: gli hook `stop` e
> `sessionStart` **NON girano sui Cloud Agents** (solo IDE locale). Per il lavoro IDE di Matteo
> (caso normale) funzionano.
>
> **Leve Cursor mappate per lo skill system** (ordine di valore):
> 1. **`stop` → nudge fine-chat ATTIVO** ✅ **v3 INSTALLATA 03-06-26** (v2 mirata 02-06, v1 statica 01-06).
>    **Salto v2→v3 (03-06-26):** da `agent_message` passivo (invisibile a chat chiusa → nudge a vuoto,
>    confermato dai report 03-06) a **`followup_message`** che AUTO-RILANCIA un turno visibile.
>    Rilancia SEMPRE 1 volta se c'è report fresco (anche completo). Guardia: `loop_count>=1`→tace +
>    `loop_limit:1` in hooks.json. Aggiunto al messaggio il check **prompt verbatim** + **allineamento
>    skill** (le due lacune dei report 03-06). Test: primo giro→followup, secondo→`{}`, no report→`{}`.
>    [storico v1/v2 sotto resta valido per la logica di lettura report — solo l'OUTPUT è cambiato]
>    File: `.cursor/hooks/fine-sessione-nudge.mjs` (Node, cross-platform) + `.cursor/hooks.json`.
>    **Salto v1→v2:** la v1 era un promemoria **statico** (stesso testo sempre, giudizio delegato
>    all'agente = la stessa buona volontà che già falliva). La v2 **legge lo stato reale**: trova i
>    `Report-*.md` toccati negli ultimi **20 min** sotto `docs/Sessioni di lavoro/`, controlla se
>    contengono «Dati comunicazione» + «Analisi flusso prompt», cita il file unico `CHIUSURA_SESSIONE.md`.
>    Esclude i report `revisione/verifica/meta/audit/analisi/dossier` (non hanno «Analisi flusso prompt»).
>    **Comportamento (aggiornato 02-06-26 — Matteo «dammi il file fresco SEMPRE, non solo sui buchi»):**
>    se mancano sezioni → avviso mirato (cosa manca) + procedura; se le sezioni **ci sono** → comunque
>    la procedura completa + **monito a verificare che siano PIENE e allineate, non solo presenti**
>    (anti-aggiornamenti-superficiali). Vale anche sugli **aggiornamenti**: un report ri-toccato rientra
>    nei 20 min e riceve di nuovo il promemoria — calza con la regola «un report unificato» (ogni agente
>    che tocca il file viene stimolato sulla sua sezione). Se non c'è report fresco → **silenzio**.
>    **`smart-allow`** — non blocca (`permission: allow`); `deny` sui casi certi è predisposto (NOTA nel file).
> 2. **`beforeMCPExecution` + `beforeShellExecution` → guard PROD** — ✅ **INSTALLATO 04-06-26** (senior).
>    Ferma le SCRITTURE sul DB di produzione (rwuxgvld) e CHIEDE conferma (`permission: "ask"`, NON
>    `deny` — Matteo: «fermati e chiedi», non «vieta»). **Riconoscimento PROD = nome del server MCP**,
>    non l'URL: `mcp__claude_ai_Supabase__*` = PROD, `Supabase_test__*` = TEST (mappa CLAUDE.md). Scritture
>    coperte: `apply_migration`, `deploy_edge_function`, `merge/reset/rebase/create/delete_branch`,
>    `execute_sql` non-SELECT; letture (list_tables, get_logs, SELECT puro…) passano lisce. Ramo shell:
>    `supabase db push/reset`, `migration up`. File `.cursor/hooks/guard-prod.mjs` + gemello Claude Code
>    `.claude/hooks/guard-prod.mjs` (`PreToolUse`, output `permissionDecision:"ask"`) registrato in
>    settings.local.json — perché il SENIOR scrive su PROD da Claude Code e prima non aveva rete.
>    Test: 7 casi Cursor + 6 Claude Code, tutti corretti (scritture→ask, letture/TEST→allow). Limiti:
>    (a) non gira sui Cloud Agents (limite Cursor) → resta la salvaguardia markdown comandi-base;
>    (b) **su Claude Code un `ask` NON vince un `allow` già concesso** in settings.local.json — gli
>    `allow` su `Supabase__apply_migration`/`execute_sql` PROD vanno tolti perché la guard morda (deciso
>    con Matteo 04-06: vedi Log idee). Chiude D2 del dossier 04-06 e il punto M4 «guard PROD».
> 3. **`sessionStart` → carica vocabolario** — ✅ **già coperto senza hook (02-06-26).** Scoperta:
>    `.cursor/rules/comandi-base.mdc` ha `alwaysApply: true`, quindi Cursor inietta **già** i grilletti
>    + salvaguardie a ogni chat IDE — un hook `sessionStart` sarebbe un doppione. Mossa fatta invece:
>    **esteso `comandi-base.mdc`** con il blocco «Zone che si confondono» (Prenota↔QR + 3 zone menu),
>    così la disambiguazione zona vale **anche in chat esplorativa** (dove il prepara-prompt non c'è e
>    nasceva la confusione 02-06). Realizza l'idea di Matteo «carica il vocabolario + scorciatoia» con
>    la leva già-attiva invece di una nuova. Un `sessionStart` vero servirebbe solo se in futuro
>    servisse logica dinamica (es. iniettare contesto diverso per tipo di chat) — non ora.
>
> **Limiti onesti del nudge v2:** (a) non gira sui Cloud Agents (limite Cursor) — Matteo conferma
> 02-06-26 che gli esecutori girano **quasi sempre su IDE locale**, quindi la copertura è quella del
> caso normale; fallback Cloud = checklist-di-chiusura nel prompt esecutore, da attivare solo se si
> osserva che i Cloud Agent saltano comunque. (b) Sul check **Liv.2** resta un promemoria, non una
> verifica: l'hook non può sapere quali voci Liv.2 sono state *usate* nella conversazione (legge i
> file, non la chat) → quello resta delegato all'agente. La verifica vera ora c'è **per le sezioni
> report** (a), che era il pezzo più grosso del guasto #1. Fonti: `cursor.com/docs/agent/hooks`,
> `cursor.com/blog/agent-best-practices`.

### M5 — Statistiche d'uso del sistema 🔶
**Obiettivo:** capire dove il sistema funziona e dove no, con numeri semplici.
**Idee concrete:** dai report e dal SESSION_LOG, contare cose come: sessioni light/standard/deep,
quali skill/zone si toccano più spesso, cause di errore ricorrenti (da `ERRORI_PROCESSO`), quante
volte un task è stato "alzato" di modalità in corsa. Input per le decisioni del senior.
**Tipo:** misto — raccolta soft, eventuale script di conteggio (enforcement leggero).
**Stato:** prima forma concreta attiva → sezione «Metriche di successo chat» sotto (4 criteri,
registro append-only). Da affinare coi dati.

---

## Metriche di successo chat (M5 — forma concreta, attiva dal 29-05-26)

**Scopo:** raccogliere dati **oggettivi e contabili** (non opinioni) su quanto bene è andata una
sessione, così in futuro avremo chat di riferimento per capire **quali comportamenti automatizzare e
promuovere**. È la milestone che cura il rischio di tutte le altre: dice quali regole valgono.

**Chi mette i dati:** l'agente **prepara-prompt a valle** (ha visto tutto il ciclo; non si
auto-pagella → meno autocelebrazione). Se non c'è prepara-prompt nel ciclo, li mette l'agente di
chiusura ma **solo i numeri grezzi**, senza voto sintetico.

**Cosa si registra** (4 criteri iniziali — si affinano coi dati, non sono definitivi):

| Criterio | Come si conta | Segnale |
|----------|---------------|---------|
| **N° prompt di Matteo** per chiudere il task | messaggi sostanziali (no «ok», «grazie») | pochi = comando recepito bene |
| **Correzioni dopo la 1ª risposta** | quante volte Matteo ha ripetuto/corretto l'intento | 0 = capito alla prima |
| **Follow-up / fix da revisione generati** | n° FU aperti o bug emersi dopo | 0 = lavoro pulito al primo giro |
| **Modalità alzata in corsa** (light→standard→deep) | sì/no + perché | sì = stima iniziale o prompt incompleti |

**Dove vanno i dati:** una riga nel «Registro metriche» sotto, **per le sole sessioni standard/deep**
(le light sono troppe e poco informative). Niente voto da 1 a 10 finché non abbiamo abbastanza
sessioni: per ora **solo i numeri** + una nota di una riga. Il voto sintetico lo decide il senior
quando i criteri saranno tarati.

> **Onestà sul peso (Matteo, 29-05-26):** in questa fase di test si accetta un contesto leggermente
> più pesante per raccogliere **molti dati**; si snellisce mano a mano. Il senior, quando i pattern
> sono chiari, taglia i criteri inutili e alleggerisce.

### Registro metriche (append-only — sessioni standard/deep)

> Formato: `GG-MM-AA · tema · modalità · prompt:N · correzioni:N · FU:N · alzata:sì/no · nota`.

- 29-05-26 · creazione metriche successo chat · deep · prompt:~6 · correzioni:0 · FU:0 · alzata:no · sessione meta skill system, comandi recepiti alla prima, scope ampliato da Matteo in corso (non è correzione)
- 29-05-26 · mappatura Impostazioni↔Prenota + fix FU-007/008 + revisione · standard · prompt:7 · correzioni:2 · FU:3 · alzata:sì · 4 giri; revisione Approva; FU-009 aperto
- 29-05-26 · validazione UX Prenota (esecutore+fix+revisione) · standard · prompt:3 · correzioni:2 · FU:1 · alzata:no · KO iniziali = HTML5 senza `noValidate`; fix veloce post root cause; doc `FORM_VALIDATION_ATTENTION_PATTERN.md`; revisore Approva con riserve
- 29-05-26 · ciclo BookingRequestCard mappa→fix menuPricing · deep→standard · prompt:5 · correzioni:3 · FU:2 chiusi · alzata:no · Approva revisore fix; report unificato; pipeline mappa/rev/fix annotata per vocabolario
- 30-05-26 · prepara-prompt ciclo fix Menu QR (8 note) · deep · prompt:~12 · correzioni:4 · FU:1 · alzata:no · handoff tabella+tipi sessione+QA Matteo 31-05-26
- 01-06-26 · unificazione icone Prenota=Menu QR (prepara→esecutore→report→merge main) · standard · prompt:6 · correzioni:1 · FU:0 · alzata:no · merge:ff · commit:3 · esecutore 1 passata; Matteo chiede 2× sezione analisi/statistiche in report; QA visivo ⬜
- 01-06-26 · Menu QR pill barra categorie fill semi-opaco · standard · prompt:2 · correzioni:0 · FU:0 · alzata:no · prepara→esec 0 rework; commit codice 8192fa6; QA 5 temi non tracciato
- 01-06-26 · Menu QR card senza foto mobile align · standard · prompt:2 · correzioni:0 · FU:0 · alzata:no · 1 prepara 1 esec; fix 1 riga aspect; merge main in chiusura

---

## Milestone future (il senior le attiva quando è il momento)

- **Catene di comandi all'avvio task** — sequenza che scatta quando parte una sessione (carica
  contesto, mostra checklist, imposta modalità). Dipende da M4: senza hook è solo un elenco che
  l'agente *dovrebbe* seguire. Da fare dopo che M4 ha dimostrato che gli hook funzionano nel workflow.
- **Integrazione con issue/PR** — collegare follow-up e report a issue GitHub. Enterprise-grade,
  non urgente per un solo sviluppatore.
- **Metriche di successo del sistema** — oltre alle statistiche d'uso (M5), misurare se il sistema
  *riduce davvero* i giri di correzione (prima/dopo). Richiede M5 attiva da un po'.

---

## Log idee (append-only — i Meta junior scrivono qui)

> Una riga per idea. Formato: `GG-MM-AA · [automazione|statistica|tecnica|raffinamento] · idea — perché`.
> Non cancellare: il senior pota da qui spostando le idee mature nelle milestone.

- 29-05-26 · [raffinamento] · creato questo file con M1–M5 + ruolo junior/senior — origine analisi agente revisore skill system v0 + decisione Matteo
- 29-05-26 · [raffinamento] · mockup HTML multi-stato prima dell'esecutore — Matteo «quasi sempre» per scelte UX; già in PREPARA_PROMPT §1.B; alimenta M1
- 29-05-26 · [raffinamento] · QA viewport 375/834/1280 obbligatorio per revisore su task UI — proposta Matteo; regola già in TESTING §7 ma bypassata in pratica; vedi PROPOSTE «revisione UI»
- 30-05-26 · [raffinamento] · blocco fisso «Dove siamo nel ciclo» + «Checklist ciclo» insieme, dopo ogni fase multi-agente — approvato Matteo (Menu QR); in PREPARA_PROMPT §3 + report revisione § Dati comunicazione
- 31-05-26 · [raffinamento] · **onboarding @ skill avvio chat** — domanda «metto APP_CONTEXT?» → Meta chiede se serve spiegazione procedura; vedi PROPOSTE gate spiegazione — non caricare APP_CONTEXT su ogni prompt stretto
- 31-05-26 · [raffinamento] · **gate schermata+URL** prima di QA OK su fix scroll/sfondo — fix #8 su Menu QR ma sintomo su Pagina Prenota; ≥3 agenti; vedi ERRORI_PROCESSO + PROPOSTE disambiguazione Prenota vs QR — ✅ **RISOLTO** 31-05-26 (gate in PREPARA_PROMPT §2)
- 31-05-26 · [statistica] · **motore Liv.2 fermo** — le 5 voci Liv.2 in OSSERVAZIONI sono a 0/0/0 esiti dopo 3 giorni: o non vengono usate o gli agenti non registrano `Dati Liv.2`. Senza questi numeri M5 e la logica promozione/regressione girano a vuoto. **Prossima sessione senior:** capire la causa (le voci non scattano? il protocollo fine-chat non scrive l'esito?) e renderne obbligatoria la scrittura, eventualmente via M4/hook. È il guasto #1 del sistema oggi — diagnosi senior 31-05-26.
- 31-05-26 · [raffinamento] · **grilletti avvio chat + COMANDI_AVVIO.md** — mappati «evolvi … senior» (Meta senior), «evolvi» senza senior (Liv.2, chiede), «analizza/revisiona comunicazione» (sempre revisore). Creato `COMANDI_AVVIO.md` come mappa parola→chat→cosa carica. Alimenta M3 (chiusura/avvio con una parola).
- 01-06-26 · [statistica] · **motore Liv.2 avviato con esiti ricostruiti** — ripescati dai report 29-05: «compila report comunicazione» 2×ok (candidata Liv.1), «revisiona e committa» 1×ok (confermata). «comportamenti ok ma cambi» ELIMINATA (Matteo non la usa). Dati vecchi/pochi: avvio, non regime.
- 01-06-26 · [automazione] · **nudge fine-sessione progettato (non installato)** — vedi M4. Scoperto che gli esecutori girano su **Cursor** → l'hook Claude Code non li copre; serve checklist-di-chiusura nel prompt esecutore come leva Cursor. Due leve, non una. Sessione enforcement dedicata da pianificare.
- 01-06-26 · [statistica] · **score chat 31-05 = 6,5/10** — 11 sessioni operative, 1 in prod, 1 misrouting grave (Prenota vs QR), ~12 giri correzione, follow-up netti positivi. Causa rumore: validate verde ≠ QA visivo. Vedi report revisione-controverifica 01-06.
- 01-06-26 · [raffinamento] · **sezione report «Analisi flusso prompt ed efficienza»** — Matteo: statistiche fasi prepara→esecuzione + anti-gonfiaggio report su «test fatti tutto ok»; vedi PROPOSTE + OSSERVAZIONI 01-06-26; alimenta M2/M5.
- 02-06-26 · [automazione] · **hook `stop` v2 mirato INSTALLATO** (senior, da dossier revisore) — da promemoria statico a controllo che legge i Report-*.md freschi e verifica le sezioni obbligatorie. Sblocca M4. Decisione Matteo: smart-allow (avvisa, non blocca); `deny` predisposto. Cura il guasto #1 dal lato «sezioni report», non «buona volontà».
- 03-06-26 · [automazione] · **hook `stop` v3 — `followup_message` INSTALLATO** (senior) — il nudge ora RILANCIA un turno visibile invece di scrivere `agent_message` a vuoto. Cura il limite «hook non intercettato in chat» (report 03-06). Rilancia 1× sempre (anche report completo, richiesta Matteo); guardia `loop_count`+`loop_limit:1`. Aggiunto check prompt-verbatim + allineamento-skill. + promossa regola «allineamento skill implicito» (comandi-base + CHIUSURA A§5/B§1).
- 03-06-26 · [tecnica] · **mappa hook Cursor completata + matrice file/chat × durante/dopo** (Playbook §2-bis/ter/quater) — solo 3 hook iniettano (`sessionStart`/`postToolUse`/`stop`); `preToolUse`/`beforeSubmitPrompt` NON iniettano (solo bloccano). Candidati futuri M4: `beforeMCPExecution` guard PROD (scritture DB reali passano da MCP), `beforeShellExecution` fallback. **In PAUSA-RACCOLTA: non costruire, valutare sui dati.**
- 03-06-26 · [automazione] · **hook `Stop` Claude Code per il SENIOR INSTALLATO** — il senior gira solo in Claude Code (Matteo); in chat lunghe dimentica di propagare v.0 + aggiornare Playbook → Matteo deve ricordarlo a voce. Hook `.claude/hooks/fine-sessione-senior.mjs` (registrato in settings.local.json hooks.Stop): stessa logica del Cursor v3 (rilancia 1× sempre su report fresco) ma sintassi Claude Code — guardia `stop_hook_active` invece di loop_count, output `{decision:block, reason}` invece di followup_message. Checklist arricchita coi 2 punti senior (v.0 + Playbook). Test giro1=block / giro2=tace OK. Allineato a Cursor.
- 03-06-26 · [raffinamento] · **debito propagazione template v.0** — `_skill-system-v0/comunicazione/` NON ha `hooks/` né `CHIUSURA_SESSIONE` generico (manca la fase fine-chat introdotta 02-06). Da propagare in forma generica (hook+CHIUSURA+matrice Playbook) in una sessione igiene template dedicata. Annotato, non eseguito 03-06. **AGGIORNAMENTO 04-06:** propagazione v.0 SOSPESA volutamente (Matteo) finché non atterra la milestone context-knowledge — propagare ora il template sarebbe lavoro da rifare subito dopo.
- 04-06-26 · [automazione] · **guard PROD INSTALLATA** (senior) — `beforeMCPExecution`+`beforeShellExecution` (Cursor) + `PreToolUse` (Claude Code), `permission:"ask"`. Ferma le scritture sul DB prod (rwuxgvld), letture/TEST passano. Riconoscimento via NOME server MCP (`Supabase__` vs `Supabase_test__`), non URL. File `guard-prod.mjs` in entrambe le cartelle hook. 13 test verdi. Chiude D2 dossier 04-06 + M4 «guard PROD». **APERTO:** togliere gli `allow` PROD in settings.local.json (`Supabase__apply_migration`/`execute_sql`), altrimenti su Claude Code l'`ask` non morde (un `allow` esplicito vince).
- 04-06-26 · [statistica] · **Liv.2 «main dell'app» / «menù originale» CONFERMATE** (Matteo) — non erano a zero perché inutili: Matteo le usa poco ma le intende davvero. Restano Liv.2: se l'agente ha dubbio sul significato, **chiede conferma a Matteo** (non le scarta, non deduce). Sciolto il dubbio del dossier 04-06 (non-uso vs non-registrazione): è basso-uso legittimo. Da riflettere in VOCABOLARIO/OSSERVAZIONI.
- 04-06-26 · [tecnica] · **hook senior — falso positivo da correggere** — `fine-sessione-senior.mjs` NON esclude i report `revisione/verifica/meta/audit/analisi/dossier` (l'hook Cursor sì, via `NON_EXECUTION_REPORT`). Su una sessione senior con report, chiederebbe «manca Analisi flusso prompt» = sezione da esecutore. Sporca il conteggio «errori intercettati». Allineare il regex di esclusione tra i due hook. Non bloccante, basso costo.
- 04-06-26 · [automazione] · **hook fine-sessione v4 — DA «titolo» A «risposta obbligata»** (senior). Cambio di meccanismo richiesto da Matteo: il controllo non guarda più se il TITOLO di sezione esiste (un titolo vuoto passava) ma se una RISPOSTA a domanda specifica c'è. Nuova **sezione 11 «Domande di chiusura»** in CHIUSURA_SESSIONE: 6 domande marcate `❓ Q… / ✅ R…`, valide per QUALSIASI report. L'hook estrae le coppie e verifica che ogni R non sia vuota/placeholder (`...`,`TODO`,`-`,`_(…)_`). Mancante→**blocca** (loop_limit alzato 1→3, Matteo «partiamo severi»); tutte piene→rilancio LEGGERO 1× che chiede verifica incongruenze dati↔diff↔file-correlati (mantiene l'effetto «si accorgono di errori rileggendo» di v3, meno rumore). Le 6 Q: prompt-verbatim · dati=diff? · file-correlati-allineati? · cosa-NON-fatto? · attrito+miglioria · contesto-giusto?+hook-utile?. Le ultime 2 sono i meta-dati per snellire il sistema e per decidere sul peso degli hook (rispondono alla domanda «l'hook serve o è rumore?»). Allineati ENTRAMBI gli hook (Cursor `fine-sessione-nudge.mjs` + Claude Code senior `fine-sessione-senior.mjs`). **Il fix falso-positivo dell'hook senior** (non escludeva report meta/dossier) è risolto alla radice: ora non cerca più «Analisi flusso prompt» ma le domande §11 che valgono per tutti. Test: parser robusto a Q/R stessa-riga o righe separate; 6+ casi verdi per hook. **Lezione tecnica:** testare hook che ricevono JSON serializzando l'input con un programma (Node), non con echo/printf — bash mangia un livello di backslash e rompe il JSON (path Windows). v1-v3 storico sotto resta valido per la logica di lettura report.
- 04-06-26 · [tecnica] · **hook v4 — fix marcatori non ancorati (auto-scoperto)** — al primo uso reale, l'hook senior ha segnalato falso «Q2 vuota» sul proprio report: la risposta R2 CITAVA i simboli (`nel formato ❓Q/✅R`) e il regex `❓\s*Q` non ancorato li contava come nuova domanda → numerazione sballata. Fix in ENTRAMBI gli hook: ancora `^[\s>\-*]*` davanti a ❓/✅ (i marcatori valgono solo a inizio riga). Lezione: i marcatori di un controllo automatico non devono poter comparire nel contenuto controllato senza ancora. Caso quasi-certo (la doc usa quei simboli) → fix alla radice. Test: audit sul report reale ora trova 6 domande, 0 vuote.
- 04-06-26 · [raffinamento] · **PUNTO DI RIPRESA per il lavoro lungo creato** — `PROSEGUIMENTO_MAPPATURA_SKILL.md` (versionato in Comunicazione-Skill): regole decise + ricetta-per-area + criterio «blindata» + tabella STATO aree + ordine consigliato. Ogni sessione senior che continua la mappatura parte da lì col grilletto «evolvi skill system senior». Risolve «come riprendo questo lavoro lungo senza ripartire da zero» (richiesta Matteo). + nel Playbook §6 la valutazione «Lezione della chat» distingue ora (a) risposte guidate da (b) idee autonome di Matteo (applicare vs generare).
- 04-06-26 · [automazione] · **context-knowledge — PILOTA Pagina Prenota FATTO** (senior, commit `e66c0ae` su env/test). Regole decise e applicate: (1) **skill = senso/workflow/divieti + mappa**, il dettaglio scende nei file di `contesto/`; (2) **regola di taglio a soglia**: area piccola = 1 file due sezioni, area grande = 1 file per sotto-funzione (se non si legge intero, si spacca); (3) il **senso** sta nello skill, si scorpora solo se gonfia; (4) codice = verità per i numeri, `.md` li specchiano. Realizzato: cartella `docs/Prenota-Skill/` + `contesto/`; 4 file Booking rinominati/spostati (git rename, storia preservata); **nuovo `PRENOTA_SKILL.md`** che cattura il SENSO mancante (a-che-serve, attori Mario/Anna, specchio di prova «Visualizza form», 7 limiti VOLUTI da non aggiustare, 2 questioni aperte decise oggi); 9 file vivi con rimandi aggiornati, ~55 report storici NON toccati (sono fotografie del passato — discernimento, non find-replace cieco). **Scoperta chiave:** i file Booking esistenti erano «registro di decisioni tecniche scritto da agenti per agenti» — tanto COME-funziona, zero PERCHÉ/cosa-può-l'utente. Il SENSO è il pezzo che dà all'agente gli appigli per giudicare se un upgrade ha senso. **Prossimo:** generalizzare ad altre aree (Menu QR, Admin, DB…) col pattern validato. NON ancora propagato a template v.0 (resta sospeso finché la milestone non è matura).
- 04-06-26 · [raffinamento] · **MILESTONE — sistema didattico personale di Matteo (M7, parallela al codice)** — idea Matteo: usare le chat senior come scuola continua (vocabolario→frasi→concetti via **scaffolding**, richiami **spaced-repetition** a fine sessione, profilo scolastico + roadmap skill in `_lavoro/Per matteo/`, materiale didattico REALE). Decisione: **parti micro, cresci sui dati** (rispetta pausa-raccolta). Prodotti due artefatti privati: `PIANO_SISTEMA_DIDATTICO.md` (per sessione di costruzione) + `PROMPT_RACCOLTA_MATERIALE_DIDATTICO.md` (per agente esterno che procura il materiale). Mandato senior nuovo: **educare il vocabolario di Matteo** introducendo termini in grassetto nel lavoro vero. 10 termini già seminati il 04-06 (single source of truth, cohesion by lifecycle, separation of concerns, scaffolding, spaced repetition, governance soft/enforcement, resolver, serializer, XOR, regola di taglio a soglia).
- 04-06-26 · [raffinamento] · **MILESTONE — architettura context-knowledge (3 strati)** — proposta Matteo, accolta. Principio: **codice = verità** (i valori vivono nelle costanti, es. `bookingPrenotaTextLimits.ts`); **file .md di context-knowledge** specchiano il codice (il numero + il perché + dove vive) e sono l'UNICO .md aggiornato dopo un edit di codice; **skill system** NON ripete i valori, li RIMANDA al file di conoscenza mappato. Cura E-A/E-B alla radice (niente più copie sparse negli skill da disallineare) invece che con un hook-guardia. **+ regola di lettura-integrale:** l'agente legge il file di riferimento / il pezzo di codice INTERO prima di editare (tranne micro-fix), non solo lo spezzone. Esecuzione: sessione dedicata con PLAN + sub-agent di verifica — cogliere l'occasione per **mappare il flusso dati di ogni area/pagina** e validare che ogni elemento abbia senso (divisione file per best-practice di ingegneria). Matteo prepara il prompt. NON eseguita oggi.
