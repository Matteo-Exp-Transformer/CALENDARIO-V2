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

**7. Controtest = ricerca ATTIVA di rotture, non conferma (metodo, 07-06-26).** Chiudere un'area di
blindatura **non è «i test sono verdi»** — il verde dimostra solo che ciò che hai pensato di testare
funziona, non che la sezione è robusta. La chiusura è **cercare attivamente cosa la rompe**: si
lanciano sub-agent con mandato esplicito di *trovare bug*, guidati dalla domanda **«cosa può rompere
la sezione e cosa può fare l'utente per romperla?»**. Quattro fronti: flusso dati (sporcalo: nulli,
doppio click, race, azione su record già in altro stato), flusso utente (rompilo: fuori sequenza,
navigazione durante mutation, back/refresh), limit test (confini: testi enormi, numeri 0/negativi,
date limite, liste lunghe, capienza ±1), responsive 375/834/1280. **Un controtest che non ha *provato*
a rompere nulla non chiude l'area.** Anti-pattern che cura: il *falso PASSA da copertura* («verde =
blindato»). Scritto in `PLAN_BLINDATURA_<AREA>.md` Fase D + criterio «blindata di prodotto» del
proseguimento. Candidato template v.0 quando avrà ≥2 occorrenze *eseguite* (oggi 0: Area 2 Admin l'ha
definito ma la Fase D non è ancora girata).

**8. Merge in production — cosa va in pubblico e cosa no (metodo, 10-06-26, prime sessioni di merge).**
La repo pubblica (PrenotaZen, deploy Vercel) deve ricevere **solo ciò che cambia per i clienti**, non
materiale di sviluppo. Lo script `release:prenotazen` strippa già `docs/`, `.claude/`, `.cursor/`,
`AGENTS.md` ecc. — ma **NON strippa `e2e/` né `playwright.config.ts`** (sono whitelisted). Regola
decisa con Matteo:
- **Prima di ogni merge production, classifica il diff `main..env/test`:** tocca file `src/`
  (= codice servito) sì/no? Comando: `git diff --name-only main..env/test -- src/`.
- **Se tocca `src/`** (es. M0 Prenota): merge → push privato → `release:prenotazen` → build → push
  pubblico. Il bundle clienti cambia, va pubblicato.
- **Se NON tocca `src/`** (es. M1 Shell = solo E2E + config + doc): il merge va su `main` privato
  (backup), ma **NON si pusha in pubblico**. Motivo: il bundle servito è identico → un push pubblico
  ri-deploierebbe Vercel a vuoto e porterebbe test E2E (materiale di sviluppo) tra gli artefatti
  pubblici. Dopo il sync, annullare le modifiche pendenti in PrenotaZen (`git checkout -- …` + `rm`
  degli untracked) e lasciare la pubblica pulita.
- **Principio sottostante:** *la repo pubblica è il prodotto, non lo specchio del lavoro.* Allinearla
  solo quando il prodotto cambia. I test restano patrimonio privato (CALENDARIO-V2).
- **Niente FU per gate non dovuti:** se un merge non tocca codice servito, il controtest "rompi" (Fase
  D) **non è dovuto** — non c'è comportamento applicativo da rompere → non si traccia come debito.
  Quando la Fase D è necessaria lo decide la matrice in `MASTERPLAN_BLINDATURA.md` § «Quando servono i
  test "rompi"».

**9. Revisione di un'analisi «drift migrazioni ↔ DB» — traccia la policy per NOME su tutta la catena (metodo, 12-06-26, WP-B1).**
Quando un sub-agent confronta migrazioni versionate e stato reale del DB e dichiara un «drift», il
revisore senior NON si fida del confronto: lo rifà cercando ogni policy/oggetto **per nome lungo
l'intera catena DROP/CREATE** delle migrazioni, non solo nella prima migrazione che lo nomina. Caso
reale: il sub-agent ha segnalato le policy admin di `restaurant_settings` come «mancanti» perché
guardava solo la `001` (che le crea come `tenant_*`), senza vedere la `002` che le droppa e ricrea
come `admin_*` con `current_admin_tenant_id()`. Risultato: bozza di migrazione sovra-dimensionata che
ri-dichiarava policy già versionate. Intercettato in revisione, ridotto al solo drift vero (1 policy
anon su `organizations`). **Anti-pattern curato:** *false drift da confronto parziale* (= concludere
da una sola migrazione invece che dallo stato risultante dell'intera catena). Vale per tutti i WP DB
del masterplan allineamento (B2-B5). Pattern «sub-agent fase-1 read-only + bozza, senior rivede prima
di scrivere»: ha funzionato, ha pagato proprio sul caso che sembrava banale.

**10. Restringere una RLS pubblica — mappa CHI legge la tabella in TUTTA l'app prima di toccarla (metodo, 12-06-26, WP-B2).**
Prima di restringere una policy anon (`USING (true)` → whitelist/filtro), il primo passo OBBLIGATORIO non è scrivere la migrazione: è mappare **ogni** punto che legge la tabella via client anonimo (`supabasePublic`) in tutta l'app, non solo nelle pagine pubbliche. Caso reale: `restaurant_settings` era letta via anon **anche dentro la dashboard /admin** (gli hook `useRestaurantSetting`/`useBusinessHours`/`useRestaurantName` usano `supabasePublic`), quindi una whitelist ingenua avrebbe rotto l'admin. Il fix corretto: classificare ogni chiave pubblica vs solo-admin → ri-instradare le letture solo-admin sul client autenticato → poi restringere la policy alle sole chiavi davvero pubbliche. **Ordine di deploy obbligatorio:** prima il codice live (che legge via client autenticato), POI la migrazione restrittiva su PROD — altrimenti la dashboard live si rompe nella finestra tra i due (lezione `project_prod_main_lag_026`). **Anti-pattern curato:** *restrizione RLS a scope parziale* (assumere che solo il pubblico legga da anon). Il masterplan AL-B (B2-B5) tocca altre RLS: vale per tutti. Schema operativo: sub-agent mappa read-only → senior verifica la classificazione (è lì che un errore rompe le pagine) → sub-agent implementa.

**11. Mini-pack come tier d'ingresso + anti-storia come regola di documentazione (realizzati, 15-06-26, esecuzione WP-E1/WP-E3).**
Due upgrade *strutturali* approvati dal Meta senior (12-06-26) e portati in esecuzione, non inventati in corsa — coerenti con la PAUSA-RACCOLTA:
- **Mini-pack `*_MINI.md` (tier d'ingresso leggero).** Ogni area molto usata ha un ingresso ~1 schermata (5 sezioni: Trigger · Carica subito · Divieti top-3 · Mappa · LOCK **solo link**), indicizzato in `APP_CONTEXT §0.0b`, con puntatore Cursor che rimanda al MINI + skill piena. Risolve FU-ALL-TIER senza un secondo §4 duplicato: **un solo master dei LOCK**, il mini-pack li cita per nome+link. Trappola incontrata: i path relativi cross-area (`../` vs `../../`) si sbagliano facili → `validate:docs` li intercetta subito (motivo in più per tenere quel gate).
- **Anti-storia (§8 APP_CONTEXT + regola organizzativa).** Le skill vive tengono **stato + divieti + link**; la cronologia sta nei report. Conversione: potatura attiva sull'area più narrativa (Menu QR), on-touch sulle altre. Guardrail ammesso ≤3 righe con link al report. Verifica meccanica: `grep «Fino al / Storia, perché»` = 0 nell'area potata.
- **Propagati nel template v.0** (gitignored): nuovo `_skill-system-v0/aree/_TEMPLATE_MINI.md` + rimando in `_TEMPLATE_AREA_SKILL.md` + regola 6 «Anti-storia» in `REGOLE_ORGANIZZATIVE.md`. *(Coerente col punto 5: a fine lavoro strutturale, propaga al v.0.)*

**12. Agenti in parallelo: la proprietà dei FILE, non l'argomento del task (metodo, 02-08-26, S4 giro 4).**
Per decidere se due lavori possono correre insieme non guardare **di cosa parlano**, guarda **quali
file aprono**. Caso reale: un handoff dichiarava «i 4 fix non sono parallelizzabili» perché erano
tutti «rifiniture della stessa vista»; letto il codice, due toccavano `AssignmentMapPanel.tsx` e due
`ServicePlanMap.tsx`/`TableShape.tsx` → **zero file in comune**, quindi due ondate invece di quattro
turni in fila. Schema operativo: (a) leggi i file veri prima di scrivere i prompt — l'argomento
inganna, il diff no; (b) ogni prompt dichiara «File che POSSIEDI / File che NON devi toccare»;
(c) clausola obbligatoria **«se `validate` fallisce su file che non possiedi, NON correggerli»**,
altrimenti l'agente A ripara il lavoro a metà dell'agente B e si sovrascrivono.
**Conseguenza sul commit del supervisore:** mentre gli agenti lavorano il working tree contiene il
loro lavoro in corso → **mai `git add -A`**, solo i percorsi propri, altrimenti si committa codice
non finito e mai revisionato. **Anti-pattern curato:** *parallelismo giudicato per argomento*.

**13. Misura prima di eseguire la lista che hai ereditato (metodo, 04-08-26, Fase 1 test).**
Un piano scritto ieri descrive il mondo di ieri. Caso reale: il piano elencava **7 voci** da
sistemare; eseguendo la batteria i rossi erano **31**, poi **12** rilanciandola un test alla volta, e
**nove dei dodici non erano nel piano**. Cominciare dalla «voce 1» avrebbe consumato la giornata su
un terzo del problema e prodotto un numero finale privo di significato. Schema operativo:
(a) **prima esegui e conta**, poi decidi cosa fare e in che ordine; (b) **separa sempre il guasto
dalla contesa** rilanciando la spec da sola — se la batteria gira in parallelo una quota dei rossi è
interferenza fra test (misurato: 20 su 31), e indagarli è tempo buttato; (c) **guarda lo screenshot
del fallimento prima del codice** — in tre casi su cinque la causa era visibile a occhio in dieci
secondi (un pulsante sbagliato premuto, un locale «travestito» da un test precedente, un messaggio di
validazione) e ha risparmiato mezz'ora di lettura ciascuna; (d) con più agenti in parallelo,
**vieta loro di eseguire la batteria**: le run le fa solo il supervisore, in fila indiana, altrimenti
si disturbano a vicenda e i report si riempiono di rossi finti.
**Corollario sul verde:** quando un test che era rosso diventa verde *troppo in fretta*, quella
velocità è un'informazione, non un successo — è il segnale che l'asserzione potrebbe non star più
provando niente. Caso reale: un test è passato in 1,1s e a DB non era stata creata nessuna riga.
**Anti-pattern curato:** *ereditare i numeri invece di rimisurarli*.

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
- 07-08-26 · chiusura Indagine Skill: prompt organizzativo + verifica esecutore + decisione precedenza binari · deep · prompt:2 · correzioni:0 · FU:1 · alzata:no · 2 prompt densi (3 e 4 richieste in un messaggio); nessuna correzione dopo la 1ª risposta; una decisione sua ha **invalidato a valle** un pezzo di lavoro già eseguito correttamente dall'esecutore (gate C3), ribaltato in 4 file con citazione datata; hook fine-sessione ha bloccato 1 commit (Q/R in grassetto = formato non riconosciuto, mia deviazione da un formato documentato come rigido)
- 08-08-26 · revisione a freddo di 8 WP Cursor + 4 disegni senior (binario valutazione, contenuto fuori da git) · deep · prompt:2 · correzioni:0 · FU:3 · alzata:no · **3 falle trovate su ~8 documenti nuovi, e le 2 più gravi stavano nei file scritti lo stesso giorno per chiudere le falle precedenti**; tutte e tre uscite **aprendo i proprietari, zero da report altrui** — leggere i report di sessione come fonte le avrebbe perse tutte; ⛔ un file di materiale d'esame **non aperto di proposito** (leggerlo in una chat che Matteo legge lo brucia) → buco dichiarato e passato a una sessione dedicata; ⛔ controverifica imparziale §12 **non lanciata** (divieto di sub-agenti senza richiesta), self-review a mano = copertura più debole, dichiarata; 2 numeri corretti in corsa perché presi dal **riassunto** invece che dal disco (7→8 WP, 24→30 voci): la legge del cantiere colta sul proprio contesto

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

## Miglioria attiva — Checklist flussi utente da testare (Per Matteo) 🟢

> Decisa con Matteo 19-06-26. Obiettivo: dare a Matteo **un solo posto** dove trova i flussi utente
> da provare a mano (QA visivo), invece di pescarli dai report sparsi. Chiude il buco storico
> «validate verde ≠ QA visivo».

**Regola per il profilo ESECUTORE (da aggiungere alla chiusura §7 / PREPARA_PROMPT):** quando un
agente esecutore finisce, oltre ad aggiornare gli skill/context dell'area, **se il suo lavoro
introduce o cambia un flusso che Matteo deve testare visivamente**, aggiunge una voce al file vivo
`docs/_lavoro/Per%20matteo/Test%20e2e/CHECKLIST_FLUSSI_DA_TESTARE.md`. Se il lavoro NON è testabile a
mano (refactor interno, test, doc) non scrive nulla. Una voce = ID, area, cosa testare, passi,
risultato atteso, rilascio.

**Ciclo di vita della checklist (la tiene snella):**
1. L'esecutore **aggiunge** i flussi nuovi al file vivo.
2. Matteo testa e mette **`X`** (o ✅/❌) sulla voce.
3. Le voci **passate** si **tolgono** dal file vivo e si **archiviano** nei file di contesto per
   area in `docs/_lavoro/Per%20matteo/Test%20e2e/contesto-testato/` (uno per area: Pagina Prenota,
   Impostazioni, Calendario, CRM/Email, Backend/Dati) — registro storico di «cosa Matteo ha già
   verificato visivamente». Le voci **fallite** restano nel file vivo (o tornano come fix).

**Posizione:** `docs/_lavoro/` è **gitignored** (privato, mai committato) → questi file restano locali
per Matteo. Seed iniziale ricavato da `CHECKLIST_TEST_PRENOTAZEN_RELEASE_15-19-giugno-26.md`
(19-06-26): le voci «fatto» archiviate per area, le 3 con problemi (PR-11 scroll menù, SET-05 rotella
input, CAL-04 frecce Pro) restano «da ritestare dopo fix».

**Enforcement — FATTO (19-06-26):** la regola è ora un passo **obbligatorio** del profilo Esecuzione
in `PREPARA_PROMPT_SKILL.md` § «Chiusura verso Matteo» (bullet «Checklist flussi utente da testare»);
ogni prompt esecutore generato dalla prepara-prompt la include in §7. Resta «markdown, non hook» (M4):
l'agente Cursor *dovrebbe* seguirla — l'enforcement vero dipende da M4.

**Prima applicazione reale (19-06-26):** le 3 voci con problema (PR-11 scroll menù, SET-05 rotella,
CAL-04 frecce Pro) sono state fixate da 3 agenti esecutori, **testate a video da Matteo (tutte ✅)** e
archiviate nei `contesto-testato/` (A/B/C); file vivo svuotato. Cleanup collegato: rimosso
helper `suppressNumberInputWheel` (codice morto dopo il fix SET-05 a listener nativo in
`Input.tsx`), doc `UI_COMPONENTS_CONTEXT.md` § Input allineata. `npm run validate` 859 verde.

---

## Log idee (append-only — i Meta junior scrivono qui)

> Una riga per idea. Formato: `GG-MM-AA · [automazione|statistica|tecnica|raffinamento] · idea — perché`.
> Non cancellare: il senior pota da qui spostando le idee mature nelle milestone.

- 08-08-26 · [raffinamento] · **METODO NUOVO — non si scrivono i controlli di un test dentro l'oggetto che il test misura; + il tetto di ripetizioni va messo anche sul ramo «fallisce», non solo sul grigio.** Seconda occorrenza della famiglia registrata lo stesso giorno («un criterio va scritto per TUTTI gli esiti»), trovata rivedendo a freddo un collaudo di skill system (regime privato, contenuto fuori da git). **Il caso:** un test a 5 controlli su un file di instradamento dà **1/5 = fallisce**; il criterio prevedeva ripetizioni **solo** dal ramo «grigio», quindi da «fallisce» non c'era percorso. La seconda esecuzione — chiamata «controprova» invece che «somministrazione 2 su 3», e senza il denominatore obbligatorio — dà **5/5**. ⭐ **Ma fra le due prove 4 dei 5 controlli erano stati scritti in testa al file testato**, e il quinto (l'unico assente) era già l'unico passato prima: il secondo esito misura che l'agente sa leggere una checklist. **Regola generalizzabile a qualunque gate del repo** (blindatura, controtest, collaudo manuale, gate di rollout): *se per far passare un test si modifica l'oggetto testato aggiungendoci i controlli del test, l'esito precedente si dichiara «non più misurabile» e si progetta un controllo nuovo — un «passa» che non può più diventare un «fallisce» non è un collaudo, è una dichiarazione.* ⚠️ **La correzione dell'artefatto può essere giusta** (qui lo era: il riquadro aggiunto è una buona regola operativa) — ciò che non è giusto è tenere il vecchio esito. Controprova meccanica: per ogni criterio di accettazione, verificare che **ogni** ramo della tabella degli esiti abbia una conseguenza scritta **e** che il ramo peggiore dica se esiste un secondo tentativo. **NON propagato a `_skill-system-v0/`:** seconda occorrenza ma stesso cantiere e stesso mese — la promozione spetta a una sessione Meta. **Candidato Playbook:** se si ripresenta su un gate di un'altra area.
- 08-08-26 · [raffinamento] · **METODO NUOVO — un criterio «fissato prima» va scritto per TUTTI gli esiti, non solo per il passa e il fallisce; + anti-pattern nuovo: dedurre un fatto verificabile CHIEDENDO invece di chiederlo.** Sessione: somministrato il primo esercizio a criterio pre-fissato del binario valutazione (regime privato, contenuto fuori da git). (a) **Il criterio era scritto prima, era falsificabile, aveva i negativi e il denominatore — e l'esito è caduto nella casella di mezzo, che era l'unica senza conseguenza scritta.** La tabella definiva cosa succede se *passa* e cosa se *fallisce*; il *grigio* esisteva come esito possibile e non diceva cosa muovere. ⛔ Non colmabile a caldo senza violare la regola stessa («il criterio non si tocca dopo aver visto l'output»), quindi la sessione si chiude con un debito invece che con un verdetto. **Regola generalizzabile a qualunque criterio di accettazione del repo** (blindatura, controtest, collaudo, gate di rollout): *se un esito è nominabile nella tabella, deve avere la sua conseguenza scritta accanto — altrimenti non è un criterio, è due terzi di criterio.* Controprova meccanica proposta: contare le righe della tabella degli esiti e verificare che ognuna abbia una colonna «effetto» non vuota. ⚠️ **Lo stesso difetto trovato lo stesso giorno in un piano scritto da un altro agente e già validato da due modelli** (una tabella passa/grigio/fallisce dove il ramo grigio dice «correggi e ripeti» **senza tetto di ripetizioni**: un test ripetibile all'infinito finisce sempre in «passa»). **Seconda occorrenza in una sessione: la classe di errore è reale, non un caso.** (b) **Anti-pattern nuovo, misurato su me stesso:** ho affermato in tre documenti che l'interlocutore non aveva usato uno strumento dichiarato ammesso, **deducendolo dal contenuto della sua risposta**. Era falso, l'ha smentito lui, ed è stato ritirato. È imparentato con «premessa ereditata creduta senza riverificarla» (05-08, 06-08) ma è un'altra cosa: lì si eredita, qui si **inferisce** un fatto che costava **una domanda**. Regola: *un fatto sul comportamento di una persona non si deduce dal suo output — o lo si osserva, o lo si chiede.* Nella stessa sessione un secondo errore della stessa famiglia (descritto un materiale di prova a memoria del codice invece che dalla schermata intera, e l'incompletezza l'ha rilevata l'interlocutore). **NON propagato a `_skill-system-v0/`:** (a) è alla prima occorrenza *come regola* — le due istanze sono dello stesso giorno e dello stesso conduttore, quindi non è una soglia ≥2 indipendente; (b) è alla prima occorrenza. La sede naturale di (a) è il template dei criteri di accettazione, materia di sessione Meta. **Candidato Playbook:** (a) se si ripresenta su un criterio di un'altra area; (b) se si ripresenta con un altro agente.
- 07-08-26 · [raffinamento] · **METODO NUOVO — quando una decisione dell'utente invalida a valle un lavoro già eseguito CORRETTAMENTE, la citazione datata va messa ACCANTO alla decisione in ogni file toccato; altrimenti chi legge dopo non sa quale versione vale.** Mandato: verificare l'organizzazione documenti dell'Indagine e chiudere il cantiere. L'esecutore aveva applicato **alla lettera** la risposta di Matteo al gate `[CHIEDI]` C3 («lascia l'handoff HubSpot, aggiungi solo una nota di consapevolezza») e i file dicevano «binario parallelo». Nella sessione successiva Matteo ha deciso il contrario («*HubSpot lascio in sospeso per completare questo lavoro fino in fondo prima*»). **Nessuno dei due agenti ha sbagliato**, ma i quattro file erano ora falsi e nessun posto registrava quale versione valesse. Risolto scrivendo la frase verbatim + data **dentro** i quattro file ribaltati, non solo nel report. ⚠️ **Il freno di `PREPARA_PROMPT_SKILL.md` §2 «conflitto con un prompt/report precedente» esiste già ma è a MONTE** (l'agente che prepara segnala la contraddizione prima di scrivere il prompt): **a valle non c'è niente**. Proposta operativa: riga `Decisione sostituita: <vecchia> → <nuova>, data` nel report, e citazione datata nei file toccati. Confluisce in **`FU-META-REPORT-1`**. **NON propagato a `_skill-system-v0/`:** prima occorrenza, e la sede naturale è il blocco a campi fissi ancora da decidere in sessione Meta. **Candidato Playbook** se si ripresenta.
- 07-08-26 · [tecnica] · **Il formato `❓ Q` / `✅ R` è contabile dalla macchina e NON tollera il grassetto — l'hook ha bloccato il commit, e aveva ragione.** Ho scritto `❓ **Q1 — …**`: `QUESTION_RE = /^[\s>\-*]*❓\s*Q\s*(\d+)?/i` non fa match su `❓ **Q1`, quindi il hook ha letto **zero domande** e ha riportato «manca la sezione», non «formato sbagliato» — diagnosi corretta ma fuorviante, costa un giro di commit per capirlo. **La documentazione era giusta e esplicita** (`CHIUSURA_SESSIONE.md`: «formato rigido», più l'avvertenza di non mettere `❓ Q`/`✅ R` a inizio riga dentro una risposta): la deviazione era mia. **Due cose da tenere:** (a) il messaggio d'errore del hook guadagnerebbe una riga «trovate 0 coppie Q/R — controlla che le righe inizino con `❓ Q<n>` senza formattazione»; (b) è un **dato a favore dell'enforcement** per `FU-META-REPORT-1` — in questa stessa sessione ho rispettato al primo colpo ciò che un hook controlla e **saltato** ciò che è solo scritto in markdown (la riga del Registro metriche, aggiunta solo dopo il promemoria del hook `stop`). **È la decisione L4 di Matteo «un hook batte un markdown» (R01) misurata su un agente, in diretta.** **NON propagato a `_skill-system-v0/`:** il template ha la stessa regex **e la stessa documentazione corretta** — non c'è niente da correggere lì, solo eventualmente il testo dell'errore, che è materia di sessione Meta.
- 06-08-26 · [tecnica] · **TERZA occorrenza di «premessa ereditata creduta senza riverificarla» — questa volta intercettata; + METODO NUOVO: una checklist umana va misurata contro la copertura automatica, non accorciata a occhio.** Mandato: filtrare il collaudo S4 e pianificare i lavori aperti. (a) **L'anti-pattern segnato «soglia ≥2 raggiunta, da promuovere» il 05-08 si è ripresentato subito, ed era la terza volta in quattro sessioni.** Il contesto ereditato (memoria di progetto + prompt) affermava due difetti dell'app aperti e 18 commit non pubblicati: **tutte e tre le affermazioni erano false**, chiuse dai commit `3b4b287`, `651959c`, `a9a7dd3` e da un ramo allineato 0/0. Costo evitato: un intero piano di lavoro costruito su lavori già fatti. **Cosa l'ha intercettata:** non una regola, ma la scelta discrezionale di aprire `BookingRequestForm.tsx` e `AdminAuthContext.tsx` e di lanciare `git rev-list --left-right --count` prima di riportare lo stato a Matteo. **Proposta operativa concreta, perché «riverifica sempre» non è azionabile:** ogni riga di memoria/context che dichiara un difetto **aperto** deve portare l'hash del commit in cui era vero — così la verifica costa un `git log <hash>..HEAD -- <file>` di trenta secondi invece di una rilettura completa, e l'assenza dell'hash diventa essa stessa un segnale di riga vecchia. (b) **METODO NUOVO — la gap-analysis checklist-contro-test.** `COLLAUDO_S4_CHECKLIST.md` era fermo a **4/62 da tre sessioni**, e la diagnosi implicita («Matteo non trova il tempo») era sbagliata: confrontando le 62 voci una per una con le spec Playwright/Vitest, **38 erano già dimostrate nel browser**, 16 davvero umane, **4 obsolete**. Il collaudo non era lungo: era **gonfio di lavoro già fatto dalla macchina**. Classificazione usata, riutilizzabile: `COPERTA` (un test asserisce *esattamente* l'effetto descritto → si salta), `PARZIALE` (il test esercita il flusso ma non l'aspetto descritto — colore, PDF, orario a video → serve l'occhio), `SCOPERTA` (nessun test). ⚠️ **La scoperta che giustifica da sola il metodo:** una voce chiedeva di premere un pulsante «Libera e assegna» **rimosso mesi fa** (oggi sono tre scelte guidate) — Matteo l'avrebbe cercato concludendo che l'app è rotta. **Una checklist umana non riverificata contro il codice invecchia in silenzio e produce falsi KO.** Corollario: la gap-analysis va **rifatta a ogni crescita della suite**, altrimenti la lista resta lunga per sempre; candidata ad automazione parziale (l'incrocio voce↔spec è meccanico, il giudizio «asserisce davvero questo?» no). (c) **Corollario sul fan-out, coerente col 03-08:** 4 sub-agent in sola lettura su mandati **disgiunti** (gap-analysis · estrazione etichette dal codice · censimento lavori · procedura d'ambiente); le tre decisioni che dipendevano dai loro dati le ho **riverificate di persona** (console 8 chiavi, stato dei due difetti, conteggio commit) e una ha smentito il prompt di partenza. Di nuovo: **N agenti comprano ampiezza, la verità la compra la rilettura.** (d) **Dato di comunicazione:** su 8 domande a scelta multipla formulate *per conseguenza in sala*, Matteo ha risposto 8 volte senza blocchi e su una ha prodotto una **controproposta migliore dell'opzione** (modello a cascata del badge, con la formula «se è già permesso allora proseguiamo» = condizione verificabile allegata alla richiesta, che ha trasformato un possibile non-lavoro in un lavoro reale). Conferma la regola già registrata il 03-08 sulla riformulazione in termini di sala. **NON propagato a `_skill-system-v0/`:** (b) è alla prima occorrenza e (a) è già segnata come da promuovere dal 05-08 — la promozione spetta a una sessione Meta, non a questa. **Candidato Playbook:** (a) con **tre** occorrenze accertate, ora con una proposta operativa concreta (l'hash accanto alla riga di stato); (b) se si ripresenta su un'altra area con checklist umana.
- 05-08-26 sera · [tecnica] · **METODO NUOVO — una diagnosi si misura in RIPETIZIONI, non in esiti; e quando l'esperimento può costare una giornata, non si fa.** Mandato: chiudere 4 debiti (3 rossi della batteria, parallelismo, prova a mezzanotte, Fase 3). (a) **L'anti-pattern più costoso di questo cantiere, finalmente nominato:** la sessione precedente aveva archiviato 3 rossi come «interazione fra spec» perché *rilanciati da soli erano verdi*, e quella conclusione era finita in **tre documenti** (report, piano, prompt) come quasi-fatto. Rilanciando la stessa spec **da sola 3 run × 3 viewport** → **1 rosso su 9 (~11%)**: nessuna interazione, un difetto vero. **Un difetto al 10% passa nove volte su dieci: il rilancio di controllo lo assolve.** Regola nuova: rilancia N volte e **scrivi la frazione**, e negli handoff dichiara **con quante ripetizioni** hai stabilito una causa — «verde da solo, 1 esecuzione» e «verde da solo, 10 esecuzioni» oggi si scrivono uguali e valgono l'opposto. Sotto quel rosso c'erano **due difetti dell'app diversi fra loro**, entrambi mai visti prima. (b) **Le asserzioni «zero errori in console» sono reti a strascico**: prendono qualunque cosa la pagina logghi, quindi lo stesso test fallisce per motivi diversi in giorni diversi → leggi **l'artefatto d'errore prima di ipotizzare**, il nome del test non dice niente sulla causa. (c) **Quando l'esito negativo di un esperimento è una giornata di macchina ferma, l'esperimento NON si fa.** Misurare la batteria a 2-4 worker avrebbe potuto mettere l'IP in blacklist per 24h (il rate limit del form pubblico), perché l'helper che «aspetta il turno» è un **controlla-poi-agisci** e in parallelo non protegge. Ho deciso sul ragionamento e **dichiarato perché non ho misurato** — che è diverso dal non averci pensato. Corollario: la decisione sul parallelismo va scritta **nel file di configurazione con le ragioni misurate**, non in un report che nessuno rilegge, insieme al **cancello per riaprirla**. (d) **«Non si può fare» in un commento è quasi sempre falso, e diventa vero per chi lo legge dopo:** `wallClockAnchor.ts` dichiarava impossibile provare col browser il fix a cavallo della mezzanotte («l'orario della macchina non è pilotabile») — bastava spostare `TZ` del processo **e** il fuso del browser (che su Windows ignora `TZ`). Risultato: 13/13 verde in entrambe le finestre cieche, senza aspettare la notte. Scrivere **«non l'ho fatto perché X»**, non «non si può». (e) **Corollario sul censimento automatico:** uno script grezzo ha prodotto **41 candidati «codice morto»**; la verifica uno per uno li ha ridotti a **3+1+3** (contava come non usate anche funzioni chiamate dentro il proprio file). Riportare l'output grezzo sarebbe stato pubblicare 41 falsi positivi — stessa lezione della controverifica agenti del 03-08, applicata agli script. Propagate (a), (b), (c) e (d) in forma generica in `_skill-system-v0/aree/TESTING_SKILL.md.template`. **Candidato Playbook**: (a) è la seconda occorrenza in tre sessioni di «premessa ereditata creduta senza riverificarla» (la prima: `validateSlotConfigs` il 03-08) → **soglia ≥2 raggiunta, da promuovere**.
- 05-08-26 · [tecnica] · **METODO NUOVO — misura l'AMBIENTE prima di scrivere il test, e misura l'EFFETTO, non un contatore che si muove da solo.** Fase 2 righe 12-13 (form pubblico Classic + campagne CRM). (a) **Misura d'ambiente preventiva:** prima di scrivere una riga di test ho interrogato il DB TEST in sola lettura e scritto nel prompt dell'agente i valori veri — fasce con orari e cap, orari di apertura del locale, configurazione della pagina pubblica, quali tipologie bloccano l'invio. È lì che si decide se un test è scrivibile: entrambi i difetti consegnati dai due agenti (un orario scelto **fuori dagli orari di apertura**, un confronto di email che ignorava la **normalizzazione in minuscolo**) sono difetti di *presupposto ambientale*, non di logica, e sono emersi eseguendo. Proposta operativa: nei prompt di handoff una sezione «stato misurato dell'ambiente di test» con 4-5 valori **datati** — invecchia, ma dichiara di invecchiare. (b) **Anti-pattern misurato su me stesso:** ho quasi concluso «quel test non invia mai nulla» confrontando due conteggi presi su una **finestra mobile di 10 minuti** (le righe vecchie escono dalla finestra: il confronto non significa niente). La misura giusta era catturare **la risposta della richiesta** — che diceva 201. **Regola:** se vuoi sapere se un effetto è avvenuto, osserva l'effetto, non un aggregato che cambia da solo mentre lo guardi. (c) **Terza lezione, generalizzabile:** le **difese anti-abuso dell'app** (rate limit per IP: 3 invii/minuto, blocco 24h oltre 6 in 10 minuti) mordono per prima la batteria di test, e il loro rifiuto può non avere resa visibile — il test fallisce cercando un elemento che non comparirà mai e sembra un bug del prodotto. Se la difesa **registra i tentativi** da qualche parte, i test possono leggerla e **aspettare il proprio turno** invece di subirla. Propagate tutte e tre in forma generica in `_skill-system-v0/aree/TESTING_SKILL.md.template`. **Candidato Playbook** se (a) o (c) si ripresentano su un'altra area.
- 03-08-26 · [tecnica] · **METODO NUOVO — audit di allineamento a fronti disgiunti + controverifica sistematica: il valore sta nella controverifica, non negli agenti.** Richiesta: «assicurati che skill system e contesto siano allineati allo stato reale del codice». Lanciati 5 agenti Sonnet in parallelo su fronti **disgiunti per costruzione** (skill Servizio · skill resto app · caccia bug · inventario copertura test · ricostruzione esiti collaudi), tutti in **sola lettura**, ciascuno con tre vincoli nel prompt: (a) cita `file:riga` per ogni affermazione, (b) scrivi `NON VERIFICATO — perché` invece di dedurre, (c) scrivi il rapporto lungo in scratchpad e rispondi con ≤30 righe di sole voci gravi. **Il dato che conta:** ho controverificato di persona 5 voci gravi → **1 confermata con precisazione, 1 corretta in entrambe le direzioni** (l'agente lamentava 8 migrazioni assenti da `DATABASE.md`: alcune c'erano, ma ne mancavano 2 che non aveva visto — proprio le due che servono al rollout PROD), **1 smentita del tutto** (presunta contraddizione su FIX-6: il blocco esiste), **1 errore di perimetro** (un agente ha dichiarato inesistente la Console super-admin avendo cercato solo in `src/`, mentre vive in `console/`). **Nessuna voce era pubblicabile così com'era.** In più i **due problemi più gravi non li ha trovati nessun agente**: le tre validazioni fasce divergenti con la versione completa mai chiamata, e il fatto che un «blocco al rollout» dichiarato nell'handoff (`f617077`) fosse già risolto nel contenuto. **Lezione:** N agenti in parallelo comprano *ampiezza*, non *verità* — il budget va speso sulla rilettura, non sul numero di agenti. **Corollario anti-pattern:** una premessa sbagliata scritta in un piano (`validateSlotConfigs` «già usata dall'altro editor», falsa) è stata creduta, eseguita e **ricopiata in memoria**, sopravvivendo a due sessioni finché qualcuno non ha aperto il file. Le premesse dei piani vanno verificate come i risultati. **Candidato Playbook** se si ripresenta su un'altra area.
- 03-08-26 · [raffinamento] · **Le decisioni di prodotto vanno chieste in termini di sala, mai di implementazione — e l'hook di fine sessione non deve scattare con agenti vivi.** (a) Avevo chiesto a Matteo «la conferma dell'avviso va in localStorage o in una colonna DB?» → risposta: «non mi è chiaro cosa devo decidere». Riformulata come «cosa deve fare l'app quando il cameriere preme *Ancora occupato*», con le due domande nascoste separate (dove ricordare / per quanto tacere) e 3 opzioni descritte per conseguenza in sala, **ha deciso subito e ha scelto l'opzione più ricca, non la più semplice** (ricorda per tutti i dispositivi + richiama dopo 30'). Quando Matteo non risponde a una domanda, sospettare che sia posta nella lingua sbagliata prima di considerarla «in attesa». (b) L'hook `stop` di fine sessione senior è scattato **5 volte mentre 5 agenti erano ancora in background**, chiedendo di confermare una chiusura impossibile: rumore puro, 4 turni spesi a rispondere «non ho finito». **Miglioria M4:** l'hook dovrebbe verificare se ci sono task in background vivi prima di chiedere la chiusura. Utile invece l'ultimo scatto, che ha correttamente rilevato la §11 mancante dal report.
- 20-06-26 · [raffinamento] · **Revisore su diff non committato — `git diff main..HEAD` può tornare vuoto.** Se le modifiche sono in working directory (non committate), il comando non mostra nulla → il revisore rischia di concludere che non ci siano cambiamenti. Regola da aggiungere ai prompt revisore multi-fase: «se `git diff main..HEAD` è vuoto, esegui `git status` + `git diff` plain prima di concludere». Anti-pattern curato: *falso "nessuna modifica"* da diff branch invece di diff working tree.
- 20-06-26 · [raffinamento] · **Missione implicita dello skill system: snellirsi attivamente mentre guida il progetto.** Matteo chiede di trattare lo snellimento non come manutenzione occasionale ma come obiettivo interno permanente, sia all'avvio di un nuovo progetto sia durante progetti gia in esecuzione. Evoluzione candidata: affinare le sessioni/report di analisi e sviluppo senior per chiedere sempre «cosa posso tagliare, accorpare o automatizzare senza perdere sicurezza?»; affinare `MANUALE_AVVIO.md` del template v.0 con una **intervista guidata** che separa decisioni base obbligatorie (quelle necessarie per far funzionare subito routing, profili, report, hook/guard minimi, risparmio token) da decisioni avanzate facoltative (piu tecniche, da rimandare). L'utente risponde all'intervista e viene guidato a mappare lo skill system sulla propria idea di app, producendo documentazione, hook e processi base gia configurati per partire subito con un sistema allineato al progetto. Da sviluppare in sessione Meta senior, non in chat di lavoro.
- 18-06-26 · [tecnica] · **MCP `deploy_edge_function` + `_shared/` cross-function** — il bundler MCP mette i file in `source/` e l'import shared cerca il file un livello sopra la root temporanea. Per farlo trovare, nel payload MCP il file condiviso va nominato con il percorso parent `../_shared/log` + estensione TypeScript. Documentato in `DB_SKILL.md` §7.
- 10-06-26 · [tecnica] · **METODO NUOVO — split repo pubblica/privata: `git archive`, MAI `cp`/`git add .` + override-folder per le differenze pubblico↔dev.** Split del progetto in 3 repo (PrenotaZen pubblica, CalendarBackup-v2 dev privata, TestingAgentHarness privata) e go-live in production. **Due trappole inchiodate dalla controverifica (sub-agent imparziale) PRIMA di eseguire** — entrambe critiche: (a) la repo «dev privata» era in realtà **già pubblica** con 373 docs interne online (il gitignore `docs/` non proteggeva nulla: i file erano tracciati da prima, e gitignore agisce solo sugli untracked) → reso privato il remote; (b) il piano diceva «copia la cartella e `git add .`» → un cp/add ricorsivo **trascina i file gitignored** (`.env.local` con service-role PROD + 2 PAT GitHub, `.vercel/`, `.cursor/`). **Regola d'oro:** per estrarre una repo pubblica usa **`git archive HEAD | tar -x`** — esporta SOLO i file tracciati, quindi segreti e gitignored non possono entrare per inerzia; poi rimuovi a valle ciò che è tracciato ma interno (docs/.cursor/.claude/AGENTS.md). **2ª lezione — le differenze permanenti pubblico↔dev NON si fanno a mano:** README utente vs dev, env redatti, husky trimmato sarebbero stati sovrascritti a ogni release. Soluzione: cartella `scripts/prenotazen-overrides/` con le versioni pubbliche, riapplicata dallo script di sync DOPO l'export (e `package.json` patchato solo nel campo `name`, non congelato, per non perdere dipendenze nuove). Lo script (`scripts/sync-to-prenotazen.mjs`, `npm run release:prenotazen`) si rifiuta se non sei su `main` o se il tree è sporco, e **non committa/pusha** (controllo umano: build verde → commit → push). **Lezione di processo:** un bug nello script l'ho trovato solo perché l'ho **testato davvero 4 volte** guardando il diff reale su PrenotaZen, non «sembra giusto» — la 1ª run rivelò che reintroduceva il README dev e gli URL prod. Memory: [[project_repo_split_3repos]]. **Candidato Playbook** (tecnica generale di repo-hygiene) se si ripresenta.
- 07-06-26 · [tecnica] · **controtest «ROMPI» formalizzato (Playbook §7) + DEBITO propagazione v.0.** Area 2 Admin: deciso con Matteo che la chiusura area = ricerca attiva di rotture (4 fronti: flusso dati/utente/limit/responsive), non «test verdi». Scritto in PLAN Fase D + criterio prodotto del proseguimento. NON propagato a `_skill-system-v0/`: ha 1 sola occorrenza e nemmeno eseguita (Fase D Area 2 ancora da girare) → soglia ≥2-eseguite non raggiunta, tracciato qui invece di propagarlo prematuramente. Anti-pattern curato: falso-PASSA-da-copertura.
- 07-06-26 · [tecnica] · **REVISORE — «report finale» può trovare fix NON previsti già nel working tree (esecutore partito in parallelo).** Sessione: chiesto «report finale per nuovo fix» credendo che i fix fossero ancora da fare (avevo solo consegnato il prompt batch). Lo stage ha rivelato che l'agente esecutore aveva GIÀ scritto D1/R1/D4/D5 nel tree. Regola di processo: prima di committare un «report finale», **`git status` + `git diff` di TUTTO lo stage** — se compaiono file applicativi che non hai prodotto tu, NON committarli come tuo report senza prima **revisionarli riga per riga sul codice** (qui: guard status, scroll modale, restore null, bottone condizionale) e **ri-eseguire validate**. Il `git status` iniziale di una chat lunga è una fotografia vecchia: lo stato può essere cambiato sotto. Anti-pattern curato: *commit alla cieca di lavoro altrui spacciato per proprio report*. Collegato alla regola 05-06 «sub-agent paralleli = fotografie intermedie, la verità è una run del parent».
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
- 19-06-26 · [automazione] · **Checklist flussi utente da testare (Per Matteo)** — l'esecutore, a fine lavoro, aggiunge i flussi da QA visivo a `docs/_lavoro/Per%20matteo/Test%20e2e/CHECKLIST_FLUSSI_DA_TESTARE.md`; Matteo mette X; i passati si archiviano nei contesto-testato per area. Enforcement markdown fatto in PREPARA_PROMPT § «Chiusura verso Matteo»; enforcement hook resta M4 futuro.
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
- 04-06-26 · [automazione] · **hook fine-sessione v5 + CONTROVERIFICA a 3 livelli (METODO NUOVO)** — Matteo: l'hook v4 insisteva troppo. Diagnosi sui DATI (lettura dei report reali, non a memoria): la causa NON era il numero di rilanci ma che l'hook revisionava **tutti** i report toccati negli ultimi 20 min insieme («7 report»). Fix v5: (1) `findRecentReports` ritorna **solo il più recente** (la chat che chiude); (2) **tetto duro 3 nudge** su ogni ramo (`loopCount>=3`); (3) meno falsi «mancante» (`isSubstantive`≥3 alfanum, no scarto delle risposte brevi fra parentesi). **PATTERN nuovo — controllo qualità report a 3 livelli, complementari:** *hook* (meccanico: le risposte esistono?) → *self-review* (CHIUSURA §12: l'esecutore rilegge il proprio report) → *CONTROVERIFICA* (`Comunicazione-Skill/CONTROVERIFICA.md`: sub-agente IMPARZIALE dopo «report finale», pesa report+diff vs prompt utente da Q1 letti col flusso dati/utente — cerca scope creep e reinterpretazioni vocabolario; verdetto + prompt grezzo per prepara-prompt, non tocca nulla; vive nel **profilo Verifica** esistente — intuizione Matteo, non un agente nuovo). **Validato nella stessa sessione 2×** (controverifica mappatura Prenota → BLINDATA; controverifica del report finale → PULITO). **Lezione di metodo:** quando un hook «insiste troppo», diagnostica sui dati reali (cosa controlla davvero) prima di abbassare la soglia — qui la soglia era giusta, l'ambito era sbagliato.
- 04-06-26 · [raffinamento] · **debito propagazione template v.0 — SBLOCCATO E FATTO (parziale)** — la milestone context-knowledge è abbastanza matura; propagati a `_skill-system-v0/` gli upgrade STRUTTURALI fine-chat in forma generica: `hooks/fine-sessione-nudge.mjs` → v5; `comunicazione/CHIUSURA_SESSIONE.md` → §12 self-review; **nuovo** `comunicazione/CONTROVERIFICA.md` generico. NON propagato il context-knowledge Prenota (è contenuto di progetto, non struttura). Template gitignored: aggiornato su disco, NON committato. Resta da propagare il pattern context-knowledge a 3 strati quando sarà stabile su ≥2 aree.
- 05-06-26 · [tecnica] · **METODO NUOVO — sub-agent paralleli sullo stesso working tree: gli esiti test che riportano sono fotografie INTERMEDIE, non la verità.** Sessione blindatura Prenota: 3 sub-agent in parallelo che scrivevano test sullo stesso albero. Agent B ha riportato un file «rosso» che Agent A stava ancora scrivendo → falso conflitto («A dice verde, B dice rosso»). Risolto SOLO rieseguendo io (parent) la suite completa sullo stato consolidato a valle (tutto verde, 409). **Regola:** con N sub-agent paralleli che toccano file condivisi, tratta i loro «X test verdi/rossi» come indicativi; **la verità è UNA esecuzione del parent dopo che tutti hanno finito**. Corollario confermato: un sub-agent può legittimamente lasciare un bug come *finding* (se tocca una LOCK) — il giudizio sul fix spetta al parent dopo controverifica (qui il bug riordino categorie è stato promosso da finding a fix dopo verifica sul codice).
- 05-06-26 · [raffinamento] · **PATTERN test rintracciabili — marcatore in-header + indice di area.** Per lasciare una suite «riusabile e trovabile da agenti» (richiesta Matteo): ogni test di blindatura inizia con `// @prenota-blindatura: <fronte>` + `// Copre:`; un indice di area (`Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md`, linkato dalla skill §6) mappa fronte→file→cosa-blinda + come girarli. Il marcatore (non il nome file) è la fonte di verità per «è un test di blindatura?» → `grep -rl @<area>-blindatura`. **Candidato per template v.0** quando ripetuto su una 2ª area. NON propagato a `_skill-system-v0/` in questa sessione (un solo caso, attendo la 2ª occorrenza prima di generalizzare).
- 05-06-26 · [automazione] · **hook fine-sessione v6 — separazione `stop`/pre-commit + fix invocazione Husky.** Sintomo: lo `stop` v5 ripeteva il cold-check a ogni fine risposta perché nel runtime Cursor `loop_count` poteva mancare/resettarsi. Decisione: `stop` resta meccanico e insiste solo su report incompleti (§11 Q/R mancanti, max 3); il controllo «mente fredda» passa al pre-commit `fine-sessione-commit-check.mjs`, che scatta su ogni commit con stage non vuoto, anche senza report staged. Primo tentativo = blocco cold-check + firma staged salvata in `.cursor/hooks/.fine-sessione-commit-state.json`; secondo tentativo con stesso stage = passa. Bug di integrazione trovato dopo il commit `1ab737b`: Git non invocava Husky perché `core.hooksPath=nul`; fix locale `git config core.hooksPath .husky` + fix versionato shebang in `.husky/pre-commit` (`#!/usr/bin/env sh`). Regola senior: se un agente dice «non ho visto il pre-commit», controllare **prima** `git config core.hooksPath` e shebang, poi lo script.
- 04-06-26 · [raffinamento] · **MILESTONE — architettura context-knowledge (3 strati)** — proposta Matteo, accolta. Principio: **codice = verità** (i valori vivono nelle costanti, es. `bookingPrenotaTextLimits.ts`); **file .md di context-knowledge** specchiano il codice (il numero + il perché + dove vive) e sono l'UNICO .md aggiornato dopo un edit di codice; **skill system** NON ripete i valori, li RIMANDA al file di conoscenza mappato. Cura E-A/E-B alla radice (niente più copie sparse negli skill da disallineare) invece che con un hook-guardia. **+ regola di lettura-integrale:** l'agente legge il file di riferimento / il pezzo di codice INTERO prima di editare (tranne micro-fix), non solo lo spezzone. Esecuzione: sessione dedicata con PLAN + sub-agent di verifica — cogliere l'occasione per **mappare il flusso dati di ogni area/pagina** e validare che ogni elemento abbia senso (divisione file per best-practice di ingegneria). Matteo prepara il prompt. NON eseguita oggi.
- 06-06-26 · [raffinamento] · **«BLINDATA» ridefinita: doc + PRODOTTO (richiesta Matteo).** Fino a oggi blindata = sub-agent si orienta tra i file. Matteo precisa: non basta documentare, la **pagina deve funzionare in produzione**. Blindata di prodotto = (a) ogni componente renderizzato ha senso ed è **allineato admin↔UI** (niente configurato-ma-non-mostrato né mostrato-ma-non-configurabile); (b) **zero mock/hardcoded/placeholder** che fingono dati veri (verifica anche PROD read-only); (c) **zero codice morto**; (d) **controtest sub-agent** su flusso dati + flusso utente/responsive (375/834/1280) per bug residui. Procedura: **orchestratore Opus** intervista Matteo sul senso → pulisce → allinea → fa controtestare a sub-agent (che **riportano**, non fixano) → l'orchestratore decide fix proprio o delega con **prompt anti-rottura** (cosa toccare / cosa NON / senso da preservare). Template eseguibile: `docs/<Area>-Skill/PLAN_BLINDATURA_<AREA>.md` — primo esemplare `docs/Sessioni di lavoro/06-06-26/PLAN_BLINDATURA_MENU_QR.md`. Criterio scritto in `PROSEGUIMENTO_MAPPATURA_SKILL.md` (due livelli). **Candidato template v.0** quando ripetuto su una 2ª area. + il criterio doc è stato precisato: «blindata» = orientamento **GUIDATO dalla skill** (catena rimandi), non «trova i file» — un sub-agent può dare falso PASSA navigando il codice. Fix collaterale: la porta `.claude/CLAUDE.md` non instradava alle skill d'area (routing viveva solo in Cursor) → aggiunto blocco di instradamento (commit `2e6ecac`).
- 06-06-26 · [tecnica] · **METODO NUOVO — «codice = verità» su area MATURA fa emergere CODICE MORTO, non solo numeri.** Sessione mappatura Menu QR (2ª area). Verificando ogni affermazione nel codice (non nei report) è emerso che `content_type`/`preset`/menù-evento via QR è **irraggiungibile dall'UI** (il modale forza sempre `a_la_carte`): per questo Matteo «non sa cosa siano e non li vede». Diversi INC dati «aperti» nei report di fine maggio erano già **risolti o irraggiungibili**. **Lezione:** sul pilota Prenota «codice=verità» serviva a non duplicare i numeri; su un'area già vissuta serve a **scoprire cosa è morto/divergente** — la mappatura è anche un audit. Regola operativa: i report storici sono ipotesi da verificare, non stato. Esito: codice morto tracciato per rimozione (non fixato), FU-MQR-1 (cap titoli categoria per-QR) aperto. Commit `a22108c`.
- 06-06-26 · [raffinamento] · **SCOPO TRIPLO della mappatura reso esplicito (richiesta Matteo).** La mappatura di un'area non è «scrivere doc»: è **mappare + testare-per-blindare + SNELLIRE** lo skill system insieme. Lo snellimento (tagliare la ridondanza che la nuova struttura rende inutile: cronologie negli indici, §4 già estratta, file doppi) è **parte del lavoro, non un extra**. Formalizzato in `PROSEGUIMENTO_MAPPATURA_SKILL.md` (sezione «LO SCOPO» + regola 7 + metodo provato), commit `f97b13c`. Candidati snellimento identificati e tracciati nei debiti (indice Cursor ~20 righe cronologia ridondante; `APP_CONTEXT_SKILL.md` 490 righe §4 possibile duplicata) — NON eseguiti (scope «solo Menu QR oggi»).
- 06-06-26 · [tecnica] · **DEBITO propagazione template v.0 — SOGLIA «≥2 aree» RAGGIUNTA (non eseguito).** Il pattern context-knowledge a 3 strati è ora applicato su **2 aree** (Prenota 04-06 + Menu QR 06-06): la condizione posta il 04-06 («propagare quando stabile su ≥2 aree») è soddisfatta. Da propagare a `_skill-system-v0/` in forma generica: la **struttura cartella-area** (`<Area>-Skill/` + `contesto/`), il **template di SKILL d'area** (senso/attori/flusso/divieti/mappa) e il pattern **TEST_SUITE_INDEX**. Anche il pattern «marcatore test in-header + indice» (riga 05-06-26) ha ora la 2ª occorrenza → promovibile. **NON eseguito in questa sessione** (scope «solo Menu QR»; template gitignored, va aggiornato su disco e elencato nel report, mai committato). Sessione igiene template dedicata.
- 06-06-26 · [tecnica] · **METODO NUOVO — per un flash/glitch di render, MISURA la sequenza di render reale invece di dedurla.** Bug riportato da Matteo: cambiando tab admin (Pro) la schermata vecchia riappariva «per un microsecondo». La causa (stato `activeTab`/`section` duplicato che si rincorre con l'URL perché `setState`+`navigate` non sono atomici in un handler async) è impossibile da inchiodare leggendo il codice a mente — troppe ipotesi statiche plausibili. **Tecnica che ha funzionato:** un test che monta il componente reale e fa loggare a ogni render del corpo la coppia (vista montata, URL corrente) in un array; il dump mostra la sequenza esatta. Prima del fix: `[calendar@impostazioni, settings@impostazioni, settings@calendario, calendar@calendario]` (4 render oscillanti, il flash nero su bianco); dopo: `[calendar@calendario]` (1 render). La stessa sonda è diventata il **test di non-regressione** (asserisce: nessun render con vista≠URL). **Lezione:** per bug di tempistica/render React, smetti di dedurre dopo 1-2 ipotesi e scrivi una sonda che registra la realtà — è più veloce di un browser (che il flash di 1 frame lo manca) e lascia il test pronto. Bonus diagnostico: la richiesta di Matteo «controlla che non sia in altre forme/pagine» ha fatto trovare il **bug gemello** in AdminShell (stesso pattern su `section`) — cercare lo *stesso pattern strutturale*, non lo stesso sintomo, è ciò che ha raddoppiato la copertura. Fix `d64d150`, merge `88a7f4e`. **Candidato Playbook** (tecnica generale, non solo questo bug) se si ripresenta su un'altra area.
- 07-06-26 · [tecnica] · **METODO NUOVO — controtestare un fix su TRIGGER/funzione DB con temp-table + pulizia esplicita, non rollback-by-exception.** Sessione FU-046 Area 2 (fix D3: il reinserimento dall'archivio gonfiava `tenant_usage.bookings_count`). Per validare il trigger ho simulato il ciclo reale (insert pending → accept → soft-delete → restore) e osservato il contatore. **Primo tentativo sbagliato:** `RAISE EXCEPTION 'rollback intenzionale'` per non lasciare residui — ma l'eccezione **nasconde tutti i `RAISE NOTICE`** (vedi solo l'errore), quindi non leggi l'esito. **Metodo che funziona:** esegui il ciclo, salva il verdetto in una `TEMP TABLE`, poi **pulisci esplicitamente** (DELETE della riga di test + ripristino del contatore al baseline catturato a inizio), e `SELECT * FROM _result` per leggere `pass`. Niente residui, esito visibile. **Lezione:** per controtestare logica DB con side-effect su tabelle condivise (contatori, usage), cattura il baseline → agisci → confronta → ripristina nello stesso blocco; il rollback-by-exception va bene solo se NON ti serve leggere output. Prima conferma anche che l'ambiente sia TEST (`get_project_url` = `docnnernvp`). Fase D Area 2 ora **girata** (chiude la nota «0 occorrenze eseguite» della voce 07-06 controtest). Migrazione `044`, commit `96492d7`.
- 06-06-26 · [metodo] · **CONTROVERIFICA prod-ready «cliente nuovo» — su area MATURA il bottino è sui DATI, non nel codice.** Sessione controverifica Menu QR (gemella dell'audit Prenota stesso giorno), profilo Verifica, 3 sub-agent read-only + orchestratore che riverifica riga-per-riga. Esito: **codice QR pulito** (0 BLOCKER/MAJOR; 1 solo MINOR magic-string + 6 export morti), mentre il rischio reale «un cliente nuovo vede dati di test/altra azienda» stava tutto **sui DB** (carosello con testo-tastiera su QR ATTIVO in PROD, `restaurant_name`=«Matteo Cavallaro» = ciò che il cliente legge nell'hero, refuso label «Secondi piattie»). **Lezione operativa:** per la prod-readiness di un'area pubblica configurata-dal-tenant, parti dalle **SELECT sui dati tenant** (org/restaurant_name/carousel_items/label categoria) prima di setacciare il codice — il codice di solo-rendering raramente «sporca», i dati sì. **Lezione di scope:** correggere la **label** visibile è sicuro; rinominare una **chiave** categoria a mano via SQL no (orfana piatti/QR collegati) → va dal modale admin che usa il sync coordinato. Da aggiungere come riga nelle skill d'area pubbliche («rischio primario = dati, non codice»). Commit `848620a`/`355e921`/`16504c0`; FU-MQR-3 aperto.
- 13-06-26 · [attenzione] · **LACUNA SKILL — §11 «Domande di chiusura» non referenziata nel percorso principale.** CLAUDE.md e APP_CONTEXT_SKILL.md §0 descrivono «lavoro ok» come «scrivi/aggiorna il report» senza puntare a CHIUSURA_SESSIONE.md §11. Un agente di nuova sessione (o dopo una chat lunga) rischia il formato tabella invece di ❓Q/✅R e viene bloccato dall'hook. **Miglioramento proposto:** aggiungere in CLAUDE.md alla voce «lavoro ok» la nota «il report deve includere §11 di CHIUSURA_SESSIONE.md (formato ❓Q/✅R — l'hook lo controlla)». Candidato per prossima sessione igiene CLAUDE.md/skill.
- 13-06-26 · [attenzione] · **GOTRUE NON GESTISCE UTENTI INSERITI DIRETTAMENTE VIA SQL.** Sessione test deploy Brevo: `supabase db query` mostrava `admin-classic@test.local` e `admin-pro@test.local` in `auth.users`, ma `supabase.auth.admin.listUsers()` (SDK con service role) restituiva solo i 3 utenti creati via API (`matteo@m.com`, `classic@c.com`, `tomas@t.com`). Conseguenza: login con email+password fallisce con `invalid_credentials` anche dopo reset della `encrypted_password` via SQL (la funzione `crypt()` produce hash valido verificato — `pw_valid: true` — ma GoTrue non autentica l'utente). **Regola operativa:** per creare utenti test usabili con `signInWithPassword`, usare sempre `supabase.auth.admin.createUser()` via SDK o il portale Supabase Auth — mai INSERT diretto in `auth.users`. Gli utenti `.test.local` sono record DB "orfani" per il layer GoTrue. Per lo stesso motivo il project-ref breve (`docnnernvp`) non funziona con la CLI — serve il ref completo dall'URL (`docnnernvpyrbwuzzach`).
- 06-06-26 · [tecnica] · **METODO NUOVO — eseguire una blindatura mentre un ALTRO agente lavora in parallelo sullo stesso working tree (area diversa).** Esecuzione `docs/Sessioni di lavoro/06-06-26/PLAN_BLINDATURA_MENU_QR.md` (orchestratore Opus): a metà lavoro Matteo avvisa «agente sta lavorando su Prenota in parallelo». I file di Prenota (`MenuSelection`, `PresetMenuBuilder`, `caraffePricing`…) erano modificati/non committati nel working tree condiviso e **cambiavano sotto di me** (a un certo punto un typecheck rosso su `PresetMenuBuilder` è diventato verde da solo = era lui). Regole che hanno tenuto la rotta: (1) **mai toccare né stagare i file dell'altra area** — `git add` con elenco esplicito dei soli file della MIA area, mai `git add .`, + check finale `git diff --cached --name-only | grep <file-altrui>` = vuoto prima di committare; (2) **istruire i sub-agent di controtest con confini d'area espliciti** «NON aprire né segnalare i file di Prenota, cambiano sotto di te» (read-only non basta: il confine d'area va detto); (3) **distinguere il rumore altrui dal proprio** — `npm run validate` gira su tutto: prima la **suite mirata della mia area** (criterio reale), poi `validate` completo sapendo che eventuali rossi di Prenota non sono miei; (4) a fine commit/merge **tornare sul branch di partenza** (`env/test`) così l'altro ritrova il suo contesto e il suo lavoro non committato resta intatto. **Lezione:** in multi-agente sullo stesso albero l'isolamento non è solo «non rompo il codice» ma «non confondo le acque del commit» — lo **stage selettivo per-area** è la difesa principale. Alternativa più pulita se il parallelismo è noto in anticipo: `isolation: worktree` per i sub-agent. Commit `b86094f` (solo file Menu QR); merge ff in main + DB PROD allineato (migrazione 043).
- 16-06-26 · [tecnica] · **raffinamento del pattern multi-agente 06-06-26 (riga sopra) — quando l'ALTRO agente ha GIÀ fatto `git add` prima del tuo commit, lo stage selettivo non basta: serve `git commit -m "…" -- <pathspec>`.** Sessione allineamento account E2E (`testc@c.com`/`testp@p.com`/`tomas@t.com`) mentre una sessione Codex lavorava in parallelo sullo stesso repo sullo stesso argomento: Codex aveva già eseguito `git add` sui propri file prima dei miei commit. La regola 06-06 («git add con elenco esplicito dei soli file miei») non basta in questo caso: l'indice contiene comunque anche i file altrui già staged, e un `git commit` semplice li includerebbe nello stesso commit. **Fix:** `git commit -m "…" -- file1 file2 …` — il pathspec sul commit (non solo sull'add) limita lo snapshot ai soli path indicati, lasciando intatto lo stage altrui per un commit separato. Verificato con `git status --short` prima/dopo: 0 file di Codex finiti nei miei 2 commit; Codex ha poi committato da solo (`3bf7396`) senza intervento mio. Candidato per generalizzare la riga 06-06 quando si ripresenta.
- 20-06-26 · [raffinamento] · **SESSIONE IGIENE TEMPLATE v.0 — backlog di propagazione SALDATO** (Meta senior). Eseguita la «sessione igiene template dedicata» chiesta più volte dai log (03-06/06-06): allineato `_skill-system-v0/` (gitignored, **NON committato** — modifiche solo su disco, elencate qui come unica traccia git-visibile). **Propagato in forma generica** (nessun nome di tabella/feature/PrenotaZen — depurati):
  - **Playbook §7-§10** → `_skill-system-v0/comunicazione/EVOLUZIONE_SKILLS.md`: §7 controtest «ROMPI» a 4 fronti, §8 merge pubblico/privato («la repo pubblica è il prodotto», classifica il diff del codice servito), §9 false-drift da confronto parziale (traccia ogni oggetto per nome su tutta la catena), §10 restringere un permesso pubblico mappando prima CHI legge + ordine di deploy. Chiude la **ref pendente** del template blindatura (che già citava un Playbook §7/§8 inesistente). Backlog D/E/F → ✅.
  - **Struttura 3 strati (A)** → riscritto `_skill-system-v0/aree/_TEMPLATE_AREA_SKILL.md` alla forma canonica (senso §1 · attori §2 · flusso §2-bis · limiti VOLUTI §3 · questioni aperte §4 · LOCK §5 · mappa §6 · principio di lettura §7) + nuovo **passo 4-bis** «pattern a 3 strati» in `MANUALE_AVVIO.md` + **§0.0b indice mini-pack** in `00_BUSSOLA_SKILL.md` (era referenziato dal mini-pack ma mancava). Soglia ≥2 aree raggiunta da tempo (Prenota+Menu QR). Backlog A → ✅.
  - **Audit segnaposto (J)** → nuova «Legenda dei segnaposto `{{…}}`» in `MANUALE_AVVIO.md` (famiglie strutturali ricorrenti). Backlog J → ✅.
  - **Pulizia leak** → rimosse 2 righe Log idee project-specific dal v.0 (contenevano `rwuxgvld`/`docnnernvp` + nomi componenti) e genericizzati i riferimenti «CalendarBackup» (README/mini/guard-prod → «progetto-madre»). Grep anti-leak su `_skill-system-v0/` = 0 identificatori di progetto.
  - **Verifica (B/C/H/I già propagati in sessioni precedenti, ri-confermati allineati):** mini-pack `_TEMPLATE_MINI.md` (B) · anti-storia `REGOLE_ORGANIZZATIVE.md` §6 (C) · hook nudge v5 + senior + guard-prod, tutti generici con CONFIG astratti, `node --check` verde su tutti e 3 (H, **più avanti** del «v3» del backlog) · `CHIUSURA_SESSIONE.md` §11 Q1-Q6 + §12 self-review (I) · regola di propagazione `REVISIONE.md` §9 ↔ live §6b. Backlog B/C/G/H/I → ✅ (G «test rintracciabili» già coperto dal marcatore `@{{area}}-blindatura` + `<AREA>_TEST_SUITE_INDEX` nel template blindatura).
  - **Esito:** un nuovo progetto che copia il v.0 e segue `MANUALE_AVVIO.md` ottiene oggi pattern 3 strati + mini-pack + controtest ROMPI + merge pubblico/privato + review DB senior + protocollo fine-chat Q1-Q6 + guard-prod. File v.0 toccati: `comunicazione/EVOLUZIONE_SKILLS.md`, `aree/_TEMPLATE_AREA_SKILL.md`, `aree/_TEMPLATE_MINI.md`, `00_BUSSOLA_SKILL.md`, `MANUALE_AVVIO.md`, `README.md`, `hooks/guard-prod.mjs`.
