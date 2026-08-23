# Mandato senior — riallineare `PREPARA_PROMPT_SKILL`, `CHIUSURA_SESSIONE` e gli hook di fine sessione alla struttura MSS

> Data: 23-08-2026 · Profilo: **Meta senior / revisore** · Catena: **indipendente** dagli altri
> mandati della cartella · Prerequisito: nessuno.

## 0. Come si lavora

**Prima revisioni, poi proponi, poi — solo se Matteo dice sì — modifichi.** Questa non è una seduta
di esecuzione: gli hook sono **enforcement**, e riscriverli di iniziativa significa cambiare le
regole del gioco mentre gli altri agenti ci giocano.

Pianifica tu e **intervista Matteo** dove la risposta cambia la proposta. Matteo non è tecnico:
parla per effetti concreti («l'agente si ferma e ti chiede X»), non per nomi di funzione.

## 1. Il problema, in una frase

Il MetaSkillSystem ha attrezzi da ieri — `validate:mss`, `mss:query`, `test:mss`, `test:mss:tools`,
un job CI che valida le capsule — e **le procedure di fine sessione non lo sanno**. Chiedono ancora
dati come se nessuno potesse controllarli con un comando.

**Misurato, non supposto** (23-08-26): in `docs/PREPARA_PROMPT_SKILL.md` (446 righe) e
`docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` (293 righe) le occorrenze di `validate:mss`,
`mss:query`, `test:mss`, `D17`, `D18` e della parola «perimetro» sono **zero in entrambi i file**.
Chiedono la capsula — sei volte a testa — ma **non nominano mai il comando che la valida**.

## 2. Oggetto della revisione (quattro file, non di più)

| File | Righe | Ruolo |
|---|---|---|
| `docs/PREPARA_PROMPT_SKILL.md` | 446 | come si scrive un mandato per un altro agente |
| `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` | 293 | come si chiude una sessione e si compila il report |
| `.claude/hooks/fine-sessione-senior.mjs` | 234 | l'hook che blocca la chiusura se il report è incompleto |
| `.cursor/hooks/fine-sessione-commit-check.mjs` | — | il gemello lato Cursor |

Guarda anche `.cursor/hooks/fine-sessione-nudge.mjs`, ma solo per capire se duplica il gemello.

## 3. I difetti già trovati — verificali, non fidarti, e cercane altri

### 3.1 Il difetto strutturale: due formati incompatibili per lo stesso dato

Le sei domande di chiusura raccolgono **prosa**. La capsula raccoglie **campi**. Le due cose si
sovrappongono — «quali test hai eseguito», «quali file hai toccato» stanno in tutti e due — ma
**solo la capsula è leggibile dalla macchina**, e nemmeno del tutto: `rule_id_version` è testo
libero, e **non esiste alcun campo strutturato per i gate né per i file toccati** (lo dichiara
`HANDOFF_SENIOR_V0.md`, sezione «Cosa non è dimostrato»).

Risultato: `mss:query` sa dirti quante annotazioni sono verificate, ma **non sa dirti quali gate
sono passati in quale seduta**, perché quel dato vive solo in prosa. Le domande producono sapere che
il sistema non può contare.

**Questa è la domanda centrale del tuo mandato:** quali delle sei domande devono restare prosa
(perché servono a Matteo come lettura umana) e quali devono diventare **campi della capsula**?
Non rispondere «tutte e due»: duplicare è vietato da `D18`.

### 3.2 Le sei domande vanno **incollate**, mai citate — costo già pagato due volte

Il 13-06-26 era stata segnalata come lacuna. Il 23-08-26 è costata un blocco vero: un mandato
*citava* `CHIUSURA_SESSIONE.md` §11 invece di incollare il blocco, e l'agente ha scritto sei domande
**sue**. L'hook ha rifiutato la chiusura, correttamente.

Verifica se `PREPARA_PROMPT_SKILL.md` **obbliga** a incollare il blocco nei mandati che genera. Se
non lo fa, è la correzione con il miglior rapporto costo/beneficio dell'intero mandato.

### 3.3 L'hook parla anche quando non ha niente da dire

`fine-sessione-senior.mjs` scatta a ogni `Stop` e pone sempre le stesse cinque domande, **anche in
una sessione di sola lettura** che non ha prodotto alcun diff. Successo il 23-08: quattro delle
cinque voci erano inapplicabili, e l'unica risposta onesta era «non ho scritto niente».

Un avviso che chiede sempre le stesse cose smette di essere letto. Valuta se condizionare il
messaggio all'esistenza di un diff, o modularlo su cosa la sessione ha davvero toccato.

*(Nota: la voce su `_skill-system-v0/` è già stata corretta — il testo attuale dice «tracciato» e
avverte di non assumere il gitignore. Non riaprirla.)*

### 3.4 L'hook Cursor è il quinto consumatore rimasto indietro — difetto concreto

`.cursor/hooks/fine-sessione-commit-check.mjs:19` contiene:

```js
const REPORT_RE = /^docs\/Sessioni di lavoro\/[^/]+\/Report-.*\.md$/i
```

È **una copia privata** della regola di riconoscimento dei report, con `[^/]+` — cioè **un solo
livello di cartella**. È esattamente il bypass che `SK-4` ha chiuso il 23-08: un report in una
sotto-cartella sfugge al controllo. Peggio: nasconde proprio le **sedute di revisione**, le prove
che il sistema esiste per raccogliere.

Nel frattempo `REPORT_PATH_RE` è stata resa **condivisa** fra `adapter.mjs`, `git-adapter.mjs`,
`query.mjs` e `validate-changed-reports.mjs`. Questo hook è il **quinto consumatore**, e non è stato
allineato. È una violazione diretta di `D18`.

⚠️ Attenzione al vincolo: gli hook vivono in un file **escluso da git** (lo dichiara l'handoff), il
che significa che quell'enforcement **non esiste per nessun altro agente né in CI**. Verificalo, e
se è vero mettilo agli atti: è più grave della regex.

### 3.5 Il costo di `Q1`

`Q1` chiede i prompt **verbatim**. Era sensato quando i mandati erano messaggi di chat; oggi sono
**file con un path**, e il verbatim è spesso una ricopiatura costosa di qualcosa che è già nel repo.
Valuta se un riferimento al file più i soli messaggi fuori-mandato basti — e se no, di' perché.

## 4. Il criterio con cui giudicare ogni domanda e ogni voce dell'hook

Per ognuna, rispondi a tre cose:

1. **Chi la legge?** Matteo, un altro agente, o la macchina. Se la risposta è «nessuno», va tolta.
2. **Un comando potrebbe rispondere al posto dell'agente?** Se sì, chiedere all'agente è peggio che
   inutile: è un invito a dichiarare invece di misurare. Sostituiscila con il comando.
3. **Serve a raccogliere dati o a far riflettere?** Sono scopi legittimi entrambi, ma diversi: i
   primi vanno nella capsula, i secondi nel report. Mescolarli è il difetto di 3.1.

Una domanda che non supera nessuno dei tre criteri **va eliminata**. Ridurre il numero di domande è
un risultato, non una rinuncia: Matteo ha dichiarato *«snellire, non duplicare»*.

## 5. Che cosa consegni

Un **report di revisione** con:

1. la tabella completa: ogni domanda e ogni voce di hook × i tre criteri di §4 × il verdetto
   (**tieni** / **riformula** / **elimina** / **sposta nella capsula**);
2. i difetti di §3 confermati o smentiti, **con il comando che lo dimostra**;
3. i difetti nuovi che hai trovato;
4. per ogni proposta di modifica, il **testo esatto** che scriveresti — così Matteo approva un
   testo, non un'intenzione;
5. una stima onesta di **quanto contesto costa oggi** la procedura di chiusura e quanto costerebbe
   dopo. Se non sai stimarla, dillo invece di inventare un numero.

⛔ **Non modificare i quattro file senza un sì esplicito di Matteo su ciascuna proposta.**
Fa eccezione la regex di 3.4 **solo se** Matteo la autorizza a parte: è una correzione di sicurezza,
non un cambio di procedura.

## 6. Perimetro di scrittura

- `docs/Sessioni di lavoro/<data-di-oggi>/**` — il tuo report e nient'altro, in prima battuta
- i quattro file di §2 — **solo dopo** approvazione punto per punto
- `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` — append di una voce di playbook, se impari un
  metodo nuovo

**Vietato:** `scripts/mss/**` · `src/` · `.github/workflows/**` · database, migrazioni, MCP
Supabase · modificare capsule storiche (un record `final` **non si riscrive mai**: si corregge con
un `amendment`) · spostare o rinominare file · `git push` senza un sì esplicito · git distruttivo ·
`docs/_lavoro/`.

## 7. Contesto da leggere (in quest'ordine, e solo questo)

1. i quattro file di §2;
2. `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` §5 e §6 — cosa la capsula sa già
   rappresentare, e quindi cosa **non** va chiesto due volte;
3. `docs/MetaSkillSystem/PLAN_V0.md` §15 (`D16`–`D19`) e §16 (target dello scheletro);
4. `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md`, sezione «Cosa non è dimostrato»;
5. `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md`, le **tre voci del 23-08-26**;
6. `docs/Sessioni di lavoro/23-08-26/Report-fase-e-revisione-fix-23-08-26.md` — un esempio di
   report che ha superato l'hook: guarda **quanto costa** compilarlo.

## 8. Prove di chiusura

1. `npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule`
   → `validate:mss OK`
2. se hai toccato un hook: mostralo **rosso su un caso che deve fallire** e **verde su uno pulito**.
   Un controllo che non sa dire di no non è un controllo
3. `npm run validate` → exit 0 · `npm run test:mss` → exit 0 · `npm run test:mss:tools` → exit 0
4. `git status --porcelain` → nessun file fuori dal perimetro di §6
5. `git diff --check` → exit 0

## 9. Trappole già pagate

| Trappola | Cosa fare |
|---|---|
| Windows | `npm.cmd`, non `npm`, se invochi da Node. `docs/Sessioni di lavoro/` **ha uno spazio nel nome** |
| `/tmp` in git-bash | risolve su `C:\tmp` per Node → `ENOENT`. Usa la cartella temporanea di sessione |
| `crypto.randomUUID()` | è UUID**v4**, MSS lo **rifiuta**: servono UUID**v7** |
| `segment_no` | identico su tutto il bundle, sempre `1` |
| Hook di pre-commit | registra la versione in stage e **pretende che tu rilanci il commit identico**. Se cambi lo stage, riparte |
| Scrittura bloccata senza errore | è l'**harness**, non MSS. Segnalalo e prosegui |
| Numeri a memoria | ogni conteggio qui è del 23-08-26 e si muove. Rimisura |

## 10. Domande di chiusura — le sei canoniche, VERBATIM

*(Sì: le stesse che stai revisionando. Finché la revisione non è approvata, la regola in vigore è
questa. Sono incollate qui apposta — è il punto 3.2.)*

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1:

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2:

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3:

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4:

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5:

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6:
```
