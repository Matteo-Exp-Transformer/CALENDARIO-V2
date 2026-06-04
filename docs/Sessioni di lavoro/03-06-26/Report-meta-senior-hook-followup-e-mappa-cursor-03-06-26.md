# Report — Meta senior: hook `followup_message` + mappa hook Cursor + regola allineamento skill (03-06-26)

**Agente:** Meta senior (evoluzione skill system comunicazione)
**Innesco:** «sei agente senior meta comunicazione, analizza ultimi report per migliorare hook fine lavoro»
**Modalità:** deep (tocca enforcement + regole di processo)

---

## Cappello (3 righe)
- **Cosa è cambiato:** l'hook di fine chat ora **rilancia davvero l'agente** (prima scriveva un promemoria che a chat chiusa nessuno vedeva); la regola «allinea la skill in chiusura» è diventata obbligo non delegabile a Matteo; mappata tutta la capacità degli hook Cursor nel Playbook senior.
- **Cosa resta:** discutere quali hook M4 integrare (guard PROD via MCP) — in PAUSA-RACCOLTA; propagare gli upgrade nel template v.0 (debito annotato, non eseguito).
- **Serve una tua azione:** no — eseguito e testato; commit in chiusura.

---

## 1. Punto di partenza — analisi dei report 03-06

Letti interi i due report del 03-06 + i due meta/hook del 02-06 + l'hook stesso + OSSERVAZIONI. Diagnosi:

L'hook `stop` v2 aveva **tre punti ciechi** che i report 03-06 mostravano dal vivo:
1. **L'agente non lo vede mentre lavora** — scrive `agent_message`, ma `stop` scatta a chat chiusa → arriva a vuoto. Entrambi i report 03-06 lo dicono nero su bianco («hook non intercettato in chat»).
2. **Controlla che le sezioni esistano, non che siano piene** — al primo «lavoro ok» del report layout card mancavano i prompt verbatim, ma il titolo «Dati comunicazione» c'era → per l'hook era a posto.
3. **Falso positivo latente** — il filtro escludeva `revisione|verifica|meta|...` ma non `revisore`.

Più due richieste tue ricorrenti che l'hook non copriva: «agenti chiedono se allineare skill» e «devo specificare di riportare i prompt».

---

## 2. Cosa è stato deciso e fatto

### 2.1 Regola «allineamento skill = implicito» PROMOSSA (tua ratifica)
Era già in `CHIUSURA_SESSIONE` Parte B come «se mancante» → trattata come opzionale. Resa esplicita e non delegabile in **3 punti**: `comandi-base.mdc` (sotto «lavoro ok», sempre attivo), `CHIUSURA_SESSIONE.md` Parte A §5 (nota) + Parte B §1. Pattern chiuso e archiviato.

### 2.2 Hook `stop` v2 → v3 — da promemoria a RILANCIO
Scoperta tecnica chiave (doc ufficiale Cursor): `stop` può emettere **`followup_message`** = auto-invia un turno che riapre il loop → l'agente RICEVE e RISPONDE, invece di ignorare un `agent_message` a chat chiusa. **È «il potenziale di `stop`» che cercavi.**
- Rilancia **sempre 1 volta** se c'è report fresco (anche completo — tua richiesta «ripeti anche se a posto»).
- Guardia anti-loop doppia: `if (loop_count >= 1) tace` nello script + `loop_limit: 1` in `hooks.json`.
- Messaggio esteso con check **prompt verbatim** + **allineamento skill** (le due lacune 03-06).

### 2.3 Mappa hook Cursor + matrice decisionale (Playbook senior)
Aggiunto al Playbook (§2-bis/ter/quater): la matrice **file/chat × durante/dopo** che decide dove va una regola, la meccanica `followup_message`+`loop_count`, e la tabella dei 20+ hook con i **soli 3 che parlano all'agente** (`sessionStart`, `postToolUse`, `stop`). Trappola registrata: `preToolUse`/`beforeSubmitPrompt` NON iniettano istruzioni.

### 2.4 Hook `Stop` per il SENIOR in Claude Code (aggiunto a fine sessione)
**Innesco:** Matteo nota che il senior gira **solo in Claude Code** e che in chat lunghe di reasoning deve **ricordare a voce** di aggiornare il template v.0 e il Playbook. → hook che lo rende automatico.
**Fatto:** `.claude/hooks/fine-sessione-senior.mjs` + registrazione in `settings.local.json` (`hooks.Stop`). **Stessa logica** dell'hook Cursor v3 (rilancia 1× sempre su report fresco, anche completo), con sintassi Claude Code:
- guardia anti-loop: `stop_hook_active` (bool) invece di `loop_count`;
- output: `{"decision":"block","reason":"..."}` invece di `followup_message` — il `reason` torna all'agente come turno.
**Checklist nel rilancio:** sezioni report standard (1–4) **+ 2 punti specifici senior** (5: propaga template v.0 REVISIONE §6b; 6: aggiorna Playbook). Questo è il valore aggiunto rispetto a Cursor, dove gira l'esecutore e non servono.
**Test:** giro1 (`stop_hook_active:false`, report fresco) → `decision:block` con checklist; giro2 (`stop_hook_active:true`) → tace; nessun report → silenzio. ✅
**Auto-prova sul campo:** questo stesso hook è scattato a fine sessione e ha fatto emergere che **questo report non documentava l'hook Claude Code** (era stato committato prima) → la presente sezione 2.4 è la correzione che l'hook ha sollecitato. Prova concreta che il meccanismo funziona.
**Gitignored:** hook + `settings.local.json` restano locali (config Claude Code di Matteo, come il template v.0). Su git solo il tracciamento nel Log idee + questa sezione.

---

## 3. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `.cursor/hooks/fine-sessione-nudge.mjs` | v3: `followup_message` + guardia `loop_count` + check prompt/skill | Cura «hook non visto in chat» (report 03-06) |
| `.cursor/hooks.json` | `loop_limit: 1` sullo stop | Rete anti-loop sul rilancio |
| `.cursor/rules/comandi-base.mdc` | Regola «allineamento skill implicito» sotto «lavoro ok» | Promozione regola (sempre attivo) |
| `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` | Parte A §5 (nota allineamento) + Parte B §1 (rafforzata) | Stessa regola nei punti di chiusura |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | Playbook §2-bis/ter/quater + box leva 1 v3 + 4 righe Log idee | Manuale senior aggiornato + tracciamento |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | Sessioni 03-06 → archiviate (nastro, non magazzino) | Alleggerimento |
| `docs/Comunicazione-Skill/ARCHIVIO_OSSERVAZIONI.md` | Sezione 03-06 chiuse | Storico consolidato |

Nessun codice dell'app toccato.

---

## 4. Test eseguiti e risultato

| Comando | Esito |
|---------|-------|
| Hook, primo giro (`loop_count:0`) + report fresco | ✅ emette `followup_message` |
| Hook, secondo giro (`loop_count:1`) | ✅ `{}` (tace) |
| Hook, nessun report fresco | ✅ `{}` (silenzio) |

(Sessione meta: nessun `npm run validate` — zero codice app.)

---

## 5. Dati comunicazione

### Domande di Matteo + spiegazioni date (richiesto esplicitamente)

| # | Domanda di Matteo | Spiegazione data (sintesi) |
|---|-------------------|----------------------------|
| D1 | «non capisco l'utilità di `stop`, qual è il suo potenziale?» | `stop` scatta a fine loop; il suo potenziale vero è `followup_message` = rilancia un turno, non solo ricorda |
| D2 | «possiamo fare un hook che quando scrivo *lavoro ok* inietta istruzioni? ha più senso?» | Direzione giusta, strumento sbagliato: `beforeSubmitPrompt` (sul tuo messaggio) è cieco, non inietta. La frase resta governata da `comandi-base`; l'effetto «rilancio» lo dà `stop`+`followup` |
| D3 | «quali funzionalità sono possibili in Cursor, quali stiamo usando?» | Mappa completa: 20+ hook, solo 3 iniettano (`sessionStart`/`postToolUse`/`stop`); usati `stop` + `comandi-base`(`alwaysApply`) |
| D4 | «`additional_context` dopo quali azioni?» | Solo 2 hook: `sessionStart` (1× all'avvio) e `postToolUse` (dopo ogni tool riuscito) |
| D5 | «perché non posso iniettare il promemoria `postToolUse` dopo l'edit del report?» | Tecnicamente sì, ma rumoroso (un report = 5-10 edit → ripete ogni volta) e prematuro (scatta mentre scrive, non sa se è finito). `stop` controlla a cose finite |
| D6 | «allora darlo `preToolUse`?» | Stesso difetto (scatta N volte, fase «durante»). Inoltre `preToolUse` NON può iniettare testo, solo bloccare |
| D7 | «se prima che edita gli spiego come editare, dov'è il conflitto?» | Logica ok, ma: (1) `preToolUse` non inietta istruzioni; (2) «istruisci prima» = lavoro di `sessionStart`/`comandi-base`, **già fatto**. I due estremi (istruisci prima / verifica dopo) erano già/ora coperti |

### Frasi/intenti ricorrenti

| Frase/intento | Comportamento emerso |
|---------------|----------------------|
| «leggi i report interi» | non sintetizzare a campione: lettura integrale prima di diagnosticare |
| «rispondimi con meno testo, non ripetere lo stesso concetto in 3-4 modi» | **corretto-da-Matteo** → max 2 formulazioni per concetto |
| «aiutami a imparare da ingegneria di sistemi e funzionalità IDE Cursor» | non solo eseguire: nominare i principi (matrice, separazione meccanismo/politica) per insegnare |
| «ricordati di archiviare osservazioni chiuse + aggiornare manuale senior» | chiusura senior = archivio + Playbook, non solo report |
| «siamo allineati? skill system aggiornato? anche v.0 in root?» | verifica esplicita coerenza sistema + template generico |

### Prompt di Matteo (verbatim)

```
R1: sei agente senior meta comunicazione. aiutami analizzando ultimi report a capire
come migliorare hook fine lavoro, e analizzare le altre osservazioni annotate. leggi i report interi.

R2: rinforziamo anche se il report è completo, lo ripete comunque non serve che ci sia il buco.
però prima continuiamo a ragionare. ripartiamo da 0. quali funzionalità sono possibili in cursor,
e quali stiamo usando? cerca materiale aggiornato e anche guide di utenti esperti.

R3: parliamo della altre 17 possibilità. elencami solo le principali che potrebbero avere senso nel
contesto [...]. additional context dopo quali azioni può essere chiamato?
(ricordati di archiviare osservazioni dopo averle chiuse. aggiorna manuale agente senior.

R4 (rispondi meno testo): spesso mi ripeti lo stesso concetto in tipo 3 o 4 modi diversi. ne bastano 2.
[+ progettazione hook: «hook che quando IO scrivo lavoro ok / fai report finale inietta istruzioni? ha piu senso?»]

R5: ma non capisco, se prima che l'agente edita gli spiego come editare, dov'è il conflitto?

R6: ok fai report finale e poi proseguiamo discorso su possibili hook da integrare.
siamo allineati e migliorati? skill system è aggiornato? anche v.0 in root?
inserisci anche domande ricevute da me e le spiegazioni che mi hai dato
```

### Automatizzabile vs manuale

| Automatizzabile | Manuale |
|-----------------|---------|
| Verifica sezioni report + rilancio (hook v3) | Giudizio sul *contenuto* (l'hook legge titoli, non qualità) |
| Test hook (input simulato `loop_count`) | Decisione quali hook M4 promuovere (sui dati, PAUSA-RACCOLTA) |

---

## 6. Analisi flusso prompt, efficienza e statistiche

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali | **6** (R1–R6) |
| Correzioni dopo 1ª risposta | **1** (R4: «meno testo, non ripetere» — stile, non merito) |
| Follow-up generati | **0** in FOLLOW_UP |
| Turni codice app | **0** (solo hook + docs) |
| Modalità | deep da subito |

**Cosa ha reso efficace la sessione:** Matteo non chiedeva *cosa fare* ma *come ragionare* — D1–D7 sono un percorso di apprendimento (perché `stop`, perché non `postToolUse`, perché non `preToolUse`). La risposta migliore non è stata eseguire ma **nominare il principio** (matrice file/chat × durante/dopo) così lui scarta da solo le alternative sbagliate.
**Cosa migliorare:** R4 segnala una mia tendenza a ridondare (stesso concetto in 3-4 forme) → tarato a max 2.

**Registro metriche (riga per M5):**
`03-06-26 · meta senior hook v3 followup + mappa Cursor + regola allineamento skill · deep · prompt:6 · correzioni:1 (stile) · FU:0 · alzata:no · test hook OK; v.0 debito annotato`

---

## 7. La mia lettura della sessione ⭐ (versione agente)

- **Impressioni:** il vocabolario «senior» ha attivato il profilo giusto subito. La sessione è stata di *educazione al metodo*: il valore non è il codice dell'hook (poche righe) ma la mappa mentale che Matteo ora ha per decidere dove va una regola. La sua domanda D5/D7 («se istruisco prima dov'è il conflitto?») era ingegneristicamente corretta — il conflitto non era nella sua logica ma in un limite di Cursor (`preToolUse` non inietta) che andava spiegato, non liquidato.
- **Difficoltà:** una guida esperto (GitButler) descriveva una versione vecchia con 6 hook → rischio di dare info datate. Risolto incrociando con la doc ufficiale (20+ hook) e fidandomi di quella per le capacità.
- **Migliorie che suggerirei (dato):** la PAUSA-RACCOLTA va rispettata sui *nuovi* hook (guard PROD) — ma il rinforzo `followup` non è «nuovo meccanismo», è la cura di un guasto già diagnosticato (hook a vuoto), quindi rientra. Da valutare in futuro se `beforeMCPExecution` guard PROD merita di rompere la pausa (tocca dati reali).
- **Errori/correzioni:** R4 (ridondanza testo) — causa: **mia tendenza** a riformulare per chiarezza, controproducente con Matteo che coglie alla prima. Corretto in corsa.

---

## 8. Derivazione errori

| # | Cosa | Causa | Evitabile |
|---|------|-------|-----------|
| E1 | Hook v2 arrivava a vuoto (agent_message a chat chiusa) | **vincolo strutturale** Cursor (stop = post-chat) non sfruttato con followup | Sì — `followup_message` esisteva, non era usato |
| E2 | Risposte ridondanti (3-4 formulazioni) | **errore agente** (stile) | Sì — tarato a 2 |
| E3 | Rischio info datate da guida esperto | **fonte datata** (6 hook vs 20+) | Sì — incrociato con doc ufficiale |

---

## 9. Cosa resta per la prossima sessione

- **Discussione aperta (richiesta Matteo R6):** quali hook M4 integrare — candidati `beforeMCPExecution` guard PROD (forte: scritture DB reali), `beforeShellExecution` fallback. In PAUSA-RACCOLTA → decidere sui dati.
- **Debito template v.0:** `_skill-system-v0/comunicazione/` non ha `hooks/` né `CHIUSURA_SESSIONE` generico → sessione igiene template dedicata. **Da aggiungere al piano:** propagare anche l'**hook `Stop` senior Claude Code** (`fine-sessione-senior.mjs`) in forma generica nel template, accanto all'hook Cursor — così un nuovo progetto eredita entrambe le leve fine-chat (esecutore Cursor + senior Claude Code).
- **FOLLOW_UP.md:** nessuna nuova riga.

---

## Review (commit)

- `a460576` — `.cursor/hooks/fine-sessione-nudge.mjs`, `.cursor/hooks.json`, `.cursor/rules/comandi-base.mdc` (**+62 −34**, 3 file)
- `c627e18` — `CHIUSURA_SESSIONE`, `EVOLUZIONE_SKILLS`, `OSSERVAZIONI`, `ARCHIVIO_OSSERVAZIONI`, questo report, `SESSION_LOG` (**+256 −18**, 6 file)
- `d1eb943` — sezione 2.4 report (hook Claude Code; file locali gitignored, non in diff git)

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1 — R1–R6 in §5 «Prompt di Matteo (verbatim)» (R1 innesco meta → R6 report finale + allineamento v.0); tabella D1–D7 in §5 «Domande di Matteo». Nessun altro prompt sostanziale oltre correzione stile R4 («meno testo, non ripetere»).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.  
✅ R2 — Ri-verificato su git: `a460576` = hook `fine-sessione-nudge.mjs` con `followup_message`, guardia `loop_count >= 1` tace, `hooks.json` `loop_limit: 1`; `comandi-base.mdc` regola allineamento skill sotto «lavoro ok». `c627e18` = 6 file doc (Playbook §2-bis/ter/quater, archivio OSSERVAZIONI 03-06, report 179 righe). Test hook in §4: primo giro `followup_message`, secondo `{}` — coerente col codice hook al commit. **0** file `src/` — nessun `npm run validate` (corretto). File §2.4 Claude (`fine-sessione-senior.mjs`) aggiunto in `d1eb943` al report, non nel diff `a460576`/`c627e18` (gitignored).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).  
✅ R3 — Allineati: `EVOLUZIONE_SKILLS.md` (Playbook matrice + `followup_message`), `CHIUSURA_SESSIONE.md` (Parte A §5 + Parte B §1), `comandi-base.mdc`, hook Cursor. `OSSERVAZIONI.md` → sessioni 03-06 archiviate in `ARCHIVIO_OSSERVAZIONI.md`. `SESSION_LOG` riga sessione. **E-A:** nessun codice app; `PREPARA_PROMPT` / `APP_CONTEXT` non toccati (non necessari per questo task meta). Template `_skill-system-v0/` **non** aggiornato — debito esplicito §9. Nessun test Vitest (N/A). §11 aggiunta in passaggio 7 report (doc in working tree).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuolo: se davvero nulla, scrivilo e di' perché ne sei certo.)  
✅ R4 — Non implementato hook M4 (`beforeMCPExecution` guard PROD, `beforeShellExecution`) — in PAUSA-RACCOLTA §9. Non propagato template v.0 (`hooks/` generico) — debito annotato. Non aggiornato `PREPARA_PROMPT` con blocco §11 domande (aggiunto dopo, in `568f719`/`6d9c165`). Non committati file Claude locali (`.claude/hooks/`, `settings.local.json`) — voluto gitignored. Nessuna riga nuova in `FOLLOW_UP.md` (nessun debito tracciato). Nessun codice app.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)  
✅ R5 — Attrito: guide esterne con elenco hook datato (6 vs 20+) — risolto con doc ufficiale Cursor. Miglioria: in `CHIUSURA_SESSIONE` includere subito il blocco §11 domande (fatto in sessioni successive) così l'hook v4 controlla le risposte, non solo i titoli delle sezioni.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?  
✅ R6 — Contesto giusto: report 03-06 + `EVOLUZIONE_SKILLS` + hook esistente bastano per diagnosticare v2 a vuoto. Hook `stop` v3 utile come leva tecnica (`followup_message`); l'hook di questa chat (post-sessione) ha poi fatto emergere §2.4 mancante nel report — prova che il rilancio funziona. Rumore zero su codice app.
