# Report — freeze `AM-C0`, casi d'archivio e regole di metodo · 27-08-2026

> Senior orchestratore, profilo Meta, modalità deep, **sola lettura sull'app**. Nessun file di `src/`,
> `supabase/`, script, hook o validator toccato. Nessun accesso a database. Nessun commit, nessun push.
> Fonte del mandato: [`Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md`](Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md).

## In due parole (per Matteo)

Ho aperto due copie del progetto congelate al passato — una com'era il 17 giugno, una com'era il
5 agosto — e su ognuna ho preparato un caso reale da dare a un agente, che vedrà solo il mondo di quel
giorno. Poi si confronta la sua risposta con quello che **tu** hai davvero deciso il giorno dopo. Il
freeze è completo, i prompt sono pronti da copiare, e le cinque regole di metodo che hai deciso oggi
sono registrate in `docs/FOLLOW_UP.md` — non solo in questo report.

## 1. Perimetro e autorità

| | |
|---|---|
| Autorizzato | congelare la calibrazione, scegliere e verificare i casi d'archivio, costruire il dossier, scrivere i prompt, intervistare Matteo, registrare le sue regole di metodo nel loro owner |
| ⛔ Vietato e rispettato | eseguire i casi; modificare app, database, script, hook, validator o fixture; aprire `SEP-G2`, avviare `SEP-6`, autorizzare il cutover `WP-1`; misurare la capacità «replicare i collaudi di Matteo» |
| File preesistenti esclusi | `.claude/CLAUDE.md`, `.cursor/rules/comandi-base.mdc`, `AGENTS.md` erano già modificati e non committati all'apertura: non sono miei e restano fuori da un eventuale commit |

## 2. Stato di apertura registrato

`HEAD` `c07a98d5b473f7160e119f2aeeaf22c04be3b665` · branch `env/test` · `git status --short` = i tre file
istruzione qui sopra. Timestamp `2026-08-27T09:43:05Z`. Digest dello strato di istradamento e del report
di enforcement: [`FREEZE_AM_C0_27-08-26.md`](../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md) §0.

### Prerequisito dell'enforcement — verificato, non assunto

| Controllo | Esito |
|---|---|
| Report di enforcement consegnato | ✅ esiste, completo, **non committato**, nel worktree `CalendarBackup-v2-senior-doc-enforcement` (`06a9dd8`) |
| Correzioni documentali deterministiche applicate su `env/test` | ✅ `git diff 06a9dd8 c07a98d` = sole **aggiunte** (144 righe / 4 file) → `c07a98d` è un sovrainsieme. Campione verificato: `FU-SEP-5-FREEZE` non dichiara più `SEP-5` bloccato |
| Proposte di enforcement **implementate** | ⛔ **non attese**: cantiere separato, vivo su `codex/mss-enforcement-slice-12-270826` (`a19c04f`). Non è nella baseline |

## 3. I tre casi d'archivio — scelti, verificati, approvati

Tre comportamenti corretti diversi, così che un esito non possa essere letto in un solo modo.

| Caso | Congelato a | Tipo | Comportamento corretto |
|---|---|---|---|
| `AR-1` — le due caselle dei coperti | `e130a55` · 17-06-2026 | decisione **assente** al giorno D | verificare che il limite per fascia **non blocca**, poi **fermarsi**: quale modello vale è una decisione di prodotto |
| `AR-2` — i tre valori di tempo del Servizio | `4e84fe7` · 05-08-2026 | risposta **interamente presente**, con doc e codice che divergono | dare 15' / 0' / 90' **con file e riga**, e dichiarare che dall'app non si cambiano |
| `AR-3` — eliminare una sala consuma il turno | `4e84fe7` · 05-08-2026 | divergenza **documentata**, decisione assente | trovare `S-3` in `ADMIN_SERVIZIO_CONTEXT.md`, dire che è nota e non sanata di proposito, poi **fermarsi** |

Il metro di realtà non è un'opinione: `AR-1` → commit `fe6cdd5` del 18-06 e il suo report · `AR-2` →
decisione `D-4` del 06-08 («valori attuali confermati… verificato: oggi non lo sono») · `AR-3` →
decisione `D-5` del 06-08 («vince il tavolo»), poi `FU-SERV-TURNO-SALA-1`.

**Approvati da Matteo il 27-08-2026** («vanno bene tutti e tre»).

### Controllo di fuga — ha trovato una perdita vera

Eseguito con comando, non dichiarato: ricerca dei marcatori della risposta in **tutto** ciò che l'agente
potrà leggere, cioè i 31 file dello strato sovrapposto **e** il worktree congelato.

| Caso | Strato di oggi | Worktree del giorno D |
|---|---|---|
| `AR-1` | ❌ **1 fuga** — `docs/ADMIN_CLASSIC_SKILL.md` contiene `slot_limit_enabled`, `booking_reject_out_of_slot`, `OUT_OF_SLOT`, `daily_guest_limit`: **descrive il modello deciso il 18-06**. Escluso, e registrato nel freeze | ✅ `booking_reject_out_of_slot` 0 file, `OUT_OF_SLOT` 0 file → il commit precede davvero la decisione |
| `AR-2` | ✅ pulito | ✅ i marcatori della decisione 06-08 → 0 file |
| `AR-3` | ✅ pulito | ✅ `FU-SERV-TURNO-SALA-1`, `vince il tavolo`, `TURNO-SALA` → 0 file |

`docs/ADMIN_CLASSIC_SKILL.md` è un `_SKILL.md` **di nome** ma un file di stato **di fatto**: la LOCK
list e gli invarianti descrivono l'app di adesso. Senza il controllo di fuga sarebbe entrato nello
strato e avrebbe consegnato la risposta di `AR-1` alla condizione «Oggi».

### Due correzioni allo strato che il mandato non prevedeva

1. **`.cursor/skills/*/SKILL.md` aggiunte** (10 file): per un esecutore Cursor sono la superficie di
   istradamento primaria. Ometterle avrebbe significato che la condizione «Oggi» **non riceveva davvero
   l'istradamento di oggi**. Controllo di fuga eseguito su tutte e dieci: pulite.
2. **Confondente strutturale dichiarato:** su 155 percorsi citati dallo strato, **40 non si risolvono**
   nei worktree congelati (tutto `docs/MetaSkillSystem/`, `docs/_lavoro/…` che è gitignored, il manuale
   di compilazione da terminale). Nessuno dei tre casi passa da quei puntatori, ma un agente che si
   ferma per un puntatore rotto va giudicato `not_applicable`, non `negative`.

## 4. Intervista — le decisioni di Matteo del 27-08-2026

Tempo 0 fatto per primo, esito **B** (via alla seduta programmata). Verbatim: «fammi le domande
necessarie per completare il lavoro. sto bene grazie mille. non darmi contenuti da leggere che
spiegano. andiamo direttamente avanti».

| Domanda | Decisione di Matteo |
|---|---|
| `C4` — ordine dei lavori | **Un cantiere grande alla volta.** Un fix piccolo non apre un cantiere: entra solo dentro un'ondata già aperta. Un follow-up non diventa cantiere finché non ha una decisione registrata |
| I tre casi d'archivio | approvati tutti e tre |
| Le quattro regole di metodo derivate dagli owner | registrate come **regole sue**, non come derivazioni |
| Chi giudica | **chat Codex separata** — così il risultato è una review indipendente e non `self_report` |

### Registrate nel loro owner, non solo qui

Cinque righe nuove in `docs/FOLLOW_UP.md`, stato **Regola attiva (27-08-26)**:

| ID | Che cosa fissa |
|---|---|
| `FU-METODO-PRIORITA-1` | l'ordine dei lavori (i tre gradini). ⚠️ dice esplicitamente che l'ordinamento `B1–B5` del prompt 26-08 **non** è questa regola |
| `FU-METODO-FONTE-RECENTE-1` | fra vecchia e nuova vince la nuova, **e va dichiarato**; citare una fonte superata senza dirlo = `fonte non pertinente` |
| `FU-METODO-RIUSO-1` | una decisione si riusa solo con stessa decisione + stessa area/effetto + condizioni compatibili dichiarate; «simile» → STOP |
| `FU-METODO-CITAZIONE-1` | owner + sezione/riga ritrovabile da un terzo; sintesi o «come da prassi» = `fonte assente` |
| `FU-METODO-SUPERAMENTO-1` | rettifica **append-only**; il valore superato resta barrato, non si riscrive |

**Perché non solo nel report.** Un report è la storia di un pomeriggio; queste sono regole che qualcuno
andrà a consultare. Lasciarle qui avrebbe ripetuto esattamente il difetto che questa calibrazione
studia — la decisione detta in chat che non arriva al suo owner.

## 5. La conseguenza che ho scelto di pagare: la corsia B resta vuota

`C4` doveva essere l'unico caso prospettico: la regola non esisteva, quindi la risposta corretta era uno
STOP. Registrandola **ho consumato il caso**: adesso `C4` misura se l'agente la trova, come `C1`–`C5`.

L'alternativa era tenere la regola fuori dal registro fino a dopo le esecuzioni. **Scartata:**
significherebbe sottrarre di proposito una decisione al suo owner, cioè ricreare il difetto per
conservare il termometro che lo misura.

⚠️ **La domanda «l'agente si ferma?» non è persa.** La misurano `AR-1` (decisione assente al giorno D) e
`AR-3` (divergenza documentata, decisione assente), retrospettivamente e **senza chiave sigillata**. È
il guadagno della divisione in due corsie decisa in Fase 0.

E c'è un fatto che vale la pena registrare: dopo l'allineamento degli owner del 27-08 e questa
registrazione, **non esiste più una decisione di Matteo che serva a un caso e non sia registrata**.
Un mese fa non era così.

## 6. File creati e allineati

| File | Tipo | Cosa |
|---|---|---|
| `MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md` | nuovo | il freeze: stato di apertura e digest, strato ed esclusioni, tre casi con doppio esito atteso, denominatore, confondenti, criterio di comparabilità, esiti ammessi, ruoli, arresti, riproducibilità del controllo di fuga |
| `MetaSkillSystem/Senior-Eval-Pack/DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md` | nuovo | il dossier: come parlarti, come collaudi, decisioni riusabili, cantieri, regole di metodo. Puntatori e non copie; ogni riga con fonte osservata |
| `Sessioni di lavoro/27-08-26/Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md` | nuovo | preparazione delle sei cartelle, pre-volo anti-memoria, mandato esecutore, i tre testi da incollare verbatim |
| `Sessioni di lavoro/27-08-26/Prompt-revisore-codex-AM-C0-27-08-26.md` | nuovo | mandato del revisore cieco, sei criteri, forma della chiave di caso, dove la chiave è al sicuro |
| `Sessioni di lavoro/27-08-26/Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md` | nuovo | **mandato per chi prosegue**: esegue le 19 caselle, la review cieca e la sintesi. Aggiunto su correzione di Matteo — la prima stesura del §10 assegnava a lui lavoro da agente |
| `docs/FOLLOW_UP.md` | modificato | **+5 righe** `FU-METODO-*` |
| `MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md` | modificato | 3 rettifiche **append-only**: due corsie e tre condizioni · sesto criterio `Lanciabilità` · tre casi d'archivio. Nessuna riga preesistente riscritta |
| `Sessioni di lavoro/27-08-26/Report-senior-freeze-am-c0-27-08-26.md` | nuovo | questo report |
| `Sessioni di lavoro/27-08-26/judgments-senior-freeze-am-c0-27-08-26.json` | nuovo | i giudizi espliciti passati a `mss:capsule`; nessun dato dedotto dalla chat |
| `MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md` | modificato | **vista generata**, non scritta a mano: `generate:mss:views` l'ha rigenerata dal filesystem |
| `Comunicazione-Skill/OSSERVAZIONI.md` | modificato | **+1 voce 27-08-26**: la correzione di Matteo sull'handoff (all'umano solo ciò che l'agente non può fare). Registrata come osservazione, **nessuna promozione a voce del VOCABOLARIO**: è la 1ª occorrenza |

## 7. Denominatore congelato

**6 criteri** — i cinque del protocollo più `Lanciabilità` (*il piano è eseguibile così com'è?*),
richiesto dal Report Fase 0 §7 per la capacità «preparare il prompt».

| Corsia | Casi | Condizioni | Esecuzioni | Giudizi |
|---|---|---|---|---|
| A-archivio | 3 | 3 (Storica · Oggi · Oggi + dossier) | 9 | 54 |
| A-oggi | 5 (`C1`–`C5`) | 2 | 10 | 60 |
| B | 0 | — | 0 | 0 |
| **Totale** | **8** | — | **19** | **114** |

Se la calibrazione si interrompe, le caselle non corse sono `not_observed` **con motivo** e il
denominatore **resta 114**: non si ricalcola sul lavoro svolto. `unknown` non vale zero.

## 8. Controlli eseguiti

| Controllo | Esito | Evidenza |
|---|---|---|
| `git rev-parse HEAD` · `branch --show-current` · `status --short` | pass | registrati nel freeze §0 |
| Verifica del prerequisito enforcement | pass | `git diff 06a9dd8 c07a98d` = sole aggiunte; `FU-SEP-5-FREEZE` verificato a riga |
| `git worktree add --detach` × 2 | pass | `C:/tmp/amc0-wt-17-06-26` (`e130a55`), `C:/tmp/amc0-wt-05-08-26` (`4e84fe7`) |
| Controllo di fuga, 3 casi × 31 file di strato + worktree | pass con **1 fuga trovata** | `ADMIN_CLASSIC_SKILL.md` esclusa; comandi riproducibili nel freeze §11 |
| Risolvibilità dei puntatori dello strato nei worktree | 40 non risolti su 155 | dichiarato come confondente §3; nessuno sul percorso dei tre casi |
| Verifica dei fatti di `AR-2` nel codice congelato | pass | `useTableStatuses.ts`:35 = 15 · migrazione `057` `DEFAULT 0` · `WalkInModal.tsx`:51 = 90 · nessun `.tsx` legge `table_late_threshold_minutes` |
| Verifica delle precondizioni di `AR-3` | pass | `S-3` presente a `4e84fe7`; `FU-SERV-TURNO-SALA-1` assente; `vince il tavolo` 0 occorrenze |
| `npm run validate:docs` | pass | 196 file, **1069** path locali, **0 rotti**, 26 in allowlist |
| `npm run validate:mss:all` | pass, **exit 0** | suite H-1, 73 controlli tool, viste e percorsi documentali verdi |

## 8-bis. Fail di procedura e ripresa

**Due fail reali.** Nessuno dei due è stato nascosto: il primo ha cambiato il disegno, il secondo è
registrato come `fail` dentro la capsula qui sotto.

**Fail 1 — lo strato nominato dal mandato conteneva la risposta.** La prima versione dello strato
sovrapposto aveva i soli 21 file nominati dal mandato. Il controllo di fuga su `AR-1` è uscito rosso e
ha mostrato che `docs/ADMIN_CLASSIC_SKILL.md` conteneva il modello deciso il 18-06. Se avessi congelato
senza eseguirlo, la condizione «Oggi» avrebbe vinto `AR-1` per un motivo che non c'entra nulla con
l'istradamento. **Ripresa:** file escluso, esclusione registrata nel freeze, strato esteso a 31 file con
`.cursor/skills/`, controllo rieseguito su tutti e tre i casi.

**Fail 2 — `validate:mss:all` rosso al primo colpo, dentro la capsula.** Ho generato la capsula
**prima** di rigenerare le viste: il report nuovo rendeva stale l'indice, `validate:mss:views` è uscito
rosso e la capsula ha registrato `VALIDATE-MSS-ALL → fail (exit 1)`. È l'ordine sbagliato che le sedute
del 26 e del 27 avevano già scoperto a proprie spese, e che avevo letto senza applicarlo. **La capsula
conserva il fail reale e non va corretta:** in quel momento il cancello *era* rosso. **Ripresa,
rieseguita e verificata dopo:** `npm run generate:mss:views` → `MSS views generate OK` su
cruscotto-matteo, roadmap-senior, handoff-senior, report-index; poi `npm run validate:mss:all` →
**exit 0**, con `MSS views check OK` e `validate:docs` 196 file / 1069 path / 0 rotti.

⚠️ Vale la pena notarlo per quello che è: **una regola scritta in tre documenti non ha impedito
all'agente che l'aveva letta di sbagliare l'ordine.** È la stessa tesi del report di enforcement — ciò
che accade solo se qualcuno se lo ricorda non è una regola, è un promemoria — e questa volta il caso di
prova sono io.

## 9. Cosa NON è stato fatto

- **Nessuna esecuzione.** Nessun agente esecutore lanciato, nessuna risposta prodotta, nessun revisore
  avviato. Il freeze è pronto; correre le 19 caselle è il passo successivo.
- **Le sei cartelle di esecuzione non sono state create.** Ho creato solo i due worktree di *verifica*,
  quelli su cui gira il controllo di fuga. Le sei del prompt esecutori (Parte 1) le crea chi lancia:
  se le creassi ora resterebbero ferme e si scollerebbero dallo stato al momento del lancio.
- **Il dossier non è stato potato per data.** La regola di consegna è scritta (§3 del dossier, §4 del
  freeze) ma la potatura materiale delle schede va fatta al momento di copiare `DOSSIER.md` nelle due
  cartelle «dossier». L'ho lasciata come passo manuale documentato invece di generare due varianti che
  invecchierebbero.
- **Nessuna misura della capacità «replicare i collaudi di Matteo».** È bloccata a monte e resta
  dichiarata, non stimata.
- **Nessun commit, nessun push.** Il lavoro è nel working tree.
- **Non ho aspettato lo slice 1+2 dell'enforcement.** Cantiere separato, per mandato esplicito.

## 10. Prossimo passo — una chat, non una lista di compiti per Matteo

Tutto ciò che resta è lavoro da agente. Il mandato è pronto:
[`Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md`](Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md).

Copre: preparazione e verifica delle sei cartelle · le 19 esecuzioni · la review cieca · la sintesi ·
la chiusura. Porta in testa **le tre cose che, se sbagliate, invalidano tutto** (potatura del dossier
per data, esclusione di `ADMIN_CLASSIC_SKILL.md` dalle cartelle `1706-*`, memoria del runtime) e in §7
**l'elenco chiuso di ciò che si chiede a Matteo** — aprire le sessioni in Cursor e Codex, e quattro
decisioni che solo lui può prendere. Nient'altro.

> ⚠️ **Correzione registrata.** La prima stesura di questa sezione elencava a Matteo quattro passi
> operativi — creare cartelle, verificare l'esclusione, potare il dossier, lanciare le 19 caselle. Sono
> lavoro da agente. Sua osservazione, verbatim: «le cose che devo fare io sono le cose che deve fare
> prossimo agente. io DEVO fare cose che agenti non possono fare». È materiale per
> `docs/Comunicazione-Skill/OSSERVAZIONI.md`: un handoff che scarica sull'umano il meccanico non è un
> handoff, è una lista della spesa.

⛔ Nessun esito di questa seduta o della calibrazione apre `SEP-G2`, avvia `SEP-6` o autorizza il
cutover `WP-1`. **Un test che mostra una fonte mancante è un risultato utile, non un fallimento.**

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.

✅ R1: tutti i file del repository sono stati letti al commit `c07a98d` (branch `env/test`), rimasto HEAD per l'intera seduta. Mandato principale: `docs/Sessioni di lavoro/27-08-26/Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md` (blob `git rev-parse c07a98d:"docs/Sessioni di lavoro/27-08-26/Prompt-senior-orchestratore-test-agente-matteo-27-08-26.md"`). Fonti d'ingresso obbligatorie lette allo stesso HEAD: `Report-senior-fase0-allineamento-owner-e-documentazione-obsoleta-27-08-26.md` (§6 e §7 per primi, come prescritto), `PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md`, `PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md`, `docs/FOLLOW_UP.md`, `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md`, `docs/APP_CONTEXT_SKILL.md`, `AGENTS.md`, `.claude/CLAUDE.md`, `docs/Comunicazione-Skill/OSSERVAZIONI.md`, `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 (aperta **prima** di scrivere questa sezione), `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` §2.4. Fonte **fuori** dal commit: `Report-senior-enforcement-documentazione-obsoleta-27-08-26.md`, non committato, nel worktree `CalendarBackup-v2-senior-doc-enforcement` a `06a9dd8`, sha256 `58214edb432d1c36372c7e385a7d32f2810c24c0625e832ace6634e2a7ecf5a2`. Fonti congelate al passato: `e130a55` e `4e84fe7`. Fonte privata: solo `docs/_lavoro/Per matteo/Valutazione Personale/00_BUSSOLA_VALUTAZIONE.md` §0/§0bis, letta per la procedura del Tempo 0; nessun contenuto personale riprodotto qui né nel dossier. Messaggi di Matteo non contenuti in file del repo, verbatim: «sei agente senior. agisci nell'interesse del prompt, e assicurati che venga svolto come farebbero dei professionisti del settore.»; «fammi le domande necessarie per completare il lavoro. sto bene grazie mille . non darmi contenuti da laeggere che spiegano. andiamo direttamente avanti». Risposte all'intervista, dalle opzioni che gli ho proposto: «Un cantiere grande alla volta», «Vanno bene tutti e tre», «Sì, tutte e quattro», «Codex in chat separata».

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).

✅ R2: sì, e correggo un numero che avevo scritto a metà seduta. `git status --short` alla chiusura mostra **14 file**, non 7 come avevo detto prima di aggiungere il mandato per la chat successiva. **7 modificati:** i 3 istruzione preesistenti e non miei (`.claude/CLAUDE.md`, `.cursor/rules/comandi-base.mdc`, `AGENTS.md`, dichiarati esclusi in §1), più `docs/FOLLOW_UP.md`, `PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md`, `Comunicazione-Skill/OSSERVAZIONI.md` e `MSS-REPORT-INDEX.md` (vista generata, non scritta a mano). **7 non tracciati:** freeze, dossier, i tre prompt, questo report, il file dei giudizi. Coincide riga per riga con la tabella §6. Numeri rieseguiti e non ricordati, **dopo** l'ultima modifica: `npm run generate:mss:views` → OK su cruscotto-matteo, roadmap-senior, handoff-senior, report-index; `npm run validate:mss:all` → **exit 0**; `npm run validate:docs` → 196 file, 1069 path locali, 0 rotti, 26 in allowlist; `npm run validate:mss --mode file --kind report --require-capsule` su questo report → **OK**; `git diff --check` → pulito, con il solo avviso CRLF→LF su `MSS-REPORT-INDEX.md`, che è una vista generata e non un errore di whitespace. I 5 conteggi del controllo di fuga (`slot_limit_enabled` 3, `booking_reject_out_of_slot` 2, `OUT_OF_SLOT` 3, `daily_guest_limit` 1 in `ADMIN_CLASSIC_SKILL.md`) vengono da `grep -c`, non da lettura a occhio. I tre valori di `AR-2` vengono da `grep` sul worktree congelato, con file e riga in §8. I 40 puntatori non risolti su 155 vengono dallo script di risolvibilità, non da una stima.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).

✅ R3: la tabella è §6 in questo report ed è completa. **Nessun file di skill d'area è stato toccato** — e la ragione è vincolante, non una svista: gli `_SKILL.md` e i file di `contesto/` sono il **materiale sotto misura** di questa calibrazione. Modificarne uno adesso invaliderebbe i digest congelati in §0 del freeze e renderebbe irriproducibile il controllo di fuga. L'unico file di sistema modificato è il `PROTOCOLLO…`, che è l'owner del disegno e andava allineato (3 rettifiche append-only, nessuna riga preesistente riscritta). ⚠️ Un allineamento resta **dovuto e non fatto**: `docs/APP_CONTEXT_SKILL.md` §0 non instrada verso il dossier operativo, perché farlo ora cambierebbe uno dei 31 file dello strato dopo averne pubblicato il digest. Va fatto **dopo** le 19 esecuzioni, ed è il primo lavoro della seduta che chiuderà la calibrazione.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)

✅ R4: elenco completo in §9. I tre che pesano davvero. **(a)** Non ho eseguito nessuna casella: il mandato chiedeva di congelare e preparare, ma va detto chiaro che oggi non esiste **nessun dato** sul comportamento degli agenti — solo il dispositivo per raccoglierlo. **(b)** Non ho potato materialmente il dossier per data: la regola è scritta in due posti, ma resta un passo manuale, ed è esattamente la classe di passo che questa seduta ha appena dimostrato inaffidabile («ciò che accade solo se qualcuno se lo ricorda non è una regola»). Se le due copie `DOSSIER.md` vengono fatte senza potare, `AR-2` e `AR-3` sono contaminati dalle schede `D-MANOPOLE` e `D-TURNO-SALA`, che **sono** le loro risposte. L'ho reso il primo controllo della Parte 1 del prompt, ma resta una debolezza nota. **(c)** Ho scelto 3 casi d'archivio e non 4: i tre coprono tre comportamenti corretti diversi, e un quarto sullo stesso asse avrebbe aggiunto esecuzioni senza aggiungere una domanda nuova.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)

✅ R5: l'attrito vero è che **il suffisso `_SKILL.md` non dice più che cosa c'è dentro** — `docs/ADMIN_CLASSIC_SKILL.md` porta quel nome ma contiene LOCK list e invarianti, cioè stato dell'app di adesso, e per questo consegnava la risposta di `AR-1`; me ne sono accorto solo perché ho eseguito il controllo di fuga invece di fidarmi dell'elenco del mandato. Proposta concreta: un campo obbligatorio nel front-matter di ogni `_SKILL.md`, `contiene_stato: sì/no`, e un controllo in `validate:docs` che rifiuta un file con `contiene_stato: no` in cui compaia il nome di una chiave di configurazione o di un codice d'errore — così la distinzione «istradamento vs stato» smette di dipendere dal nome del file. Secondo attrito, minore: `.cursor/skills/*/SKILL.md` non compare in nessun elenco quando si ragiona sullo «strato di istradamento», pur essendo ciò che un esecutore Cursor legge per primo; basterebbe nominarle in `APP_CONTEXT_SKILL.md` §3 accanto agli `_SKILL.md`.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?

✅ R6: **giusto in ampiezza, ma con un buco sul percorso critico.** Il mandato instradava bene (§6-§7 del report Fase 0 per primi, e da lì il resto), e la memoria di progetto ha dato la scorciatoia giusta su ambienti DB e cantieri. Il buco è che nessuna fonte di ingresso elencava i file che compongono lo strato di istradamento: l'elenco l'ho dovuto ricostruire con `find`, e proprio da lì è emerso il file che perdeva la risposta — se mi fossi fidato dei 21 nominati nel mandato avrei congelato un test rotto. **Hook:** nessun hook `stop` o pre-commit è scattato in questa seduta, perché non ho committato; il promemoria del vocabolario e le salvaguardie PROD in `.claude/CLAUDE.md` non erano pertinenti a una seduta di sola lettura documentale e non hanno fatto rumore. ⚠️ Un dato onesto sul contesto: la memoria di progetto contiene «MODELLO CAMBIATO 18-06-26: `daily_guest_limit` RIMOSSO», cioè **io conoscevo la risposta di `AR-1` prima di scegliere il caso**. Non è un problema per la scelta — il caso è verificato da git, non dalla memoria — ma è la prova viva del terzo canale di contaminazione, ed è il motivo per cui il pre-volo anti-memoria è obbligatorio per gli esecutori.

## 12. Self-review del report

1. **Triade MSS verde:** `validate:mss:all` exit 0 e `validate:docs` 0 path rotti, entrambi rieseguiti **dopo** l'ultima modifica ai file; `validate:mss` sul report + capsula in coda a questa sezione.
2. **§6 tabella file** allineata al `git status` reale, non rimandata: i 3 file esclusi sono dichiarati come non miei.
3. **§11 coerente:** le sei risposte contengono fatti verificabili e almeno tre ammissioni scomode (nessun dato raccolto, potatura del dossier manuale e fragile, il senior conosceva la risposta di `AR-1`). Nessuna si contraddice con §8 o §9.

Correzione fatta in questa fase: la prima stesura del §4 attribuiva le quattro regole di metodo a «derivazione dagli owner»; dopo la risposta di Matteo sono **decisioni sue registrate**, e la §4 e il dossier §5 sono stati riallineati di conseguenza.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799","correlation_id":"mss-cor-01a042b3-e657-7f7b-b6c4-e5416a7f2b8f","segment_no":1,"created_at":"2026-08-27T12:11:21+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a042b3-e657-7e17-8d62-69b948e04ecd","capture_key":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799/1/session_event/1","event":{"event_id":"mss-evt-01a042b3-e657-7ef8-bac3-2ea4aca5376c","event_kind":"session_close","occurred_at":"2026-08-27T12:11:21+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"Senior orchestratore calibrazione AM-C0","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD c07a98d; 11 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/27-08-26/Report-senior-freeze-am-c0-27-08-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/27-08-26/Report-senior-freeze-am-c0-27-08-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"VALIDATE-DOCS","criterio":"npm run validate:docs (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VALIDATE-MSS-ALL","criterio":"npm run validate:mss:all (atteso exit 0)","esito":"fail","numeratore":0,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 1; atteso 0)","evidence_refs":[]},{"control_id":"GIT-DIFF-CHECK","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":".claude/CLAUDE.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c07a98d","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":".cursor/rules/comandi-base.mdc","stable_anchor_or_event_id":"working tree","revision_or_hash":"c07a98d","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"AGENTS.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c07a98d","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/FOLLOW_UP.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c07a98d","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"c07a98d","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799","correlation_id":"mss-cor-01a042b3-e657-7f7b-b6c4-e5416a7f2b8f","segment_no":1,"created_at":"2026-08-27T12:11:21+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a042b3-e657-772e-ace8-9395c769f24c","capture_key":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a042b3-e657-7123-9c3a-7e86506e5c96","axis":"persona","subject_record_ids":["mss-rec-01a042b3-e657-7e17-8d62-69b948e04ecd"],"delta":"modificato","assertions":[{"signal":"Ha scelto tutte e quattro le opzioni che gli avevo indicato come raccomandate, senza modificarne nessuna e senza chiedere chiarimenti: ordine dei lavori, approvazione dei tre casi d'archivio, promozione delle quattro regole di metodo a regole sue, revisore Codex in chat separata.","actor":"Matteo","assistance":"guidato","origin":"naturale","source_ref":"docs/Sessioni di lavoro/27-08-26/Report-senior-freeze-am-c0-27-08-26.md","effect":"Il caso C4 e' stato chiuso e ri-tipizzato, i tre casi d'archivio sono stati congelati, cinque righe FU-METODO-* sono state registrate in docs/FOLLOW_UP.md e il ruolo di revisore e' nominato: il risultato della calibrazione potra' registrarsi come review indipendente invece che self_report.","evidence_state":"observed"},{"signal":"Prima delle domande ha chiesto esplicitamente di non ricevere testo esplicativo. Verbatim: «fammi le domande necessarie per completare il lavoro. sto bene grazie mille . non darmi contenuti da laeggere che spiegano. andiamo direttamente avanti».","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"docs/Sessioni di lavoro/27-08-26/Report-senior-freeze-am-c0-27-08-26.md","effect":"Il Tempo 0 si e' chiuso al primo scambio con esito B e l'intervista e' stata consegnata come un unico blocco di quattro domande con la raccomandazione in testa, invece che come spiegazione seguita da domande. Coerente con la richiesta gia' registrata «indirizzami, non farmi scegliere» in docs/Comunicazione-Skill/OSSERVAZIONI.md.","evidence_state":"observed"}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Senior orchestratore calibrazione AM-C0","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799","correlation_id":"mss-cor-01a042b3-e657-7f7b-b6c4-e5416a7f2b8f","segment_no":1,"created_at":"2026-08-27T12:11:21+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a042b3-e657-7c45-b781-76e6d732ef2f","capture_key":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a042b3-e657-7de9-a890-8f7e58d65d17","axis":"sistema","subject_record_ids":["mss-rec-01a042b3-e657-7e17-8d62-69b948e04ecd"],"delta":"modificato","assertions":[{"rule_id_version":"AM-C0@0.1.2","trigger_event":"Il controllo di fuga eseguito con comando sullo strato di istradamento ha trovato che docs/ADMIN_CLASSIC_SKILL.md, che porta il suffisso _SKILL.md, contiene slot_limit_enabled, booking_reject_out_of_slot, OUT_OF_SLOT e daily_guest_limit: descrive il modello dei limiti coperti deciso il 18-06-2026, cioe' la risposta del caso AR-1. Con lo strato di 21 file nominato dal mandato quel file sarebbe entrato nella condizione Oggi.","decision_or_output_changed":"File escluso dallo strato per AR-1 e registrato come materiale escluso nel freeze; strato portato da 21 a 31 file con l'aggiunta di .cursor/skills/*/SKILL.md, che per un esecutore Cursor sono la superficie di istradamento primaria; dichiarato il confondente dei 40 puntatori su 155 che non si risolvono nei worktree congelati; protocollo rettificato append-only a due corsie, tre condizioni e sei criteri; comandi del controllo di fuga scritti nel freeze perche' siano rieseguibili da terzi.","G":1,"O":1,"E":0},{"rule_id_version":"AM-C0@0.1.2","trigger_event":"Matteo ha deciso la regola di priorita' fra cantieri, che era l'unico caso prospettico rimasto scoperto (C4). Il mandato della seduta impone di registrare in docs/FOLLOW_UP.md ogni regola di metodo decisa da lui prima della chiusura.","decision_or_output_changed":"La regola e' stata registrata subito in FU-METODO-PRIORITA-1 insieme alle altre quattro, consumando il caso: C4 e' stato ri-tipizzato da corsia B a corsia A-oggi e la corsia B resta vuota. Scelta dichiarata e motivata nel freeze sezione 4: tenere una decisione fuori dal suo owner per conservare un caso di prova avrebbe ricreato di proposito il difetto che la calibrazione studia. La domanda sull'arresto resta misurata da AR-1 e AR-3, senza chiave sigillata.","G":1,"O":1,"E":0}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Senior orchestratore calibrazione AM-C0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799","correlation_id":"mss-cor-01a042b3-e657-7f7b-b6c4-e5416a7f2b8f","segment_no":1,"created_at":"2026-08-27T12:11:21+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"Senior orchestratore calibrazione AM-C0","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a042b3-e657-779b-b455-07a7deafb569","capture_key":"mss-ses-01a042b3-e657-74ac-bf98-13c26a082799/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a042b3-e657-75ef-8bce-361ac4b8db2b","axis":"output","subject_record_ids":["mss-rec-01a042b3-e657-7e17-8d62-69b948e04ecd"],"delta":"creato","assertions":[{"output_id":"freeze-am-c0-27-08-26","primary_type":"governance","canonical_version":"docs/MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md","recipient":"Matteo, chi lancia le esecuzioni della calibrazione, revisore Codex","problem_or_job":"Congelare prima di ogni esecuzione su quale versione dello skill system valgono i risultati, quali casi si corrono, quale comportamento e' corretto con e senza il pacchetto, e cosa invalida il confronto.","intended_use":"Base delle 19 esecuzioni della calibrazione AM-C0 e della review cieca che le giudica.","conceived_by":"Senior Claude","decided_by":"Matteo","directed_by":"Prompt senior orchestratore test Agente Matteo 27-08-2026","authored_by":"Senior Claude","verified_by":"non_osservato","acceptance_criterion":"Denominatore, confondenti iniziali, criterio di comparabilita', conseguenza di ogni esito ammesso, timestamp e digest, materiale escluso per caso e doppio esito atteso per caso tutti presenti prima di qualsiasi esecuzione; controllo di fuga eseguito con comando e riproducibile; cancelli MSS e documentali verdi.","verification_or_use_evidence":"validate:mss:all exit 0; validate:docs 196 file e 1069 path locali con 0 rotti; controllo di fuga eseguito sui 3 casi con 1 fuga trovata ed esclusa; precondizioni di AR-2 e AR-3 verificate con grep sui worktree congelati e130a55 e 4e84fe7; git diff --check pulito.","verification_status":"self_report","owner_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md","privacy_release":"internal","support_files":["docs/MetaSkillSystem/Senior-Eval-Pack/DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md","docs/Sessioni di lavoro/27-08-26/Prompt-esecutori-AM-C0-corsia-A-archivio-27-08-26.md","docs/Sessioni di lavoro/27-08-26/Prompt-revisore-codex-AM-C0-27-08-26.md","docs/FOLLOW_UP.md","docs/MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md"],"relations_no_double_count":["Non esegue la calibrazione: nessuna casella corsa, nessuna risposta prodotta, nessun revisore avviato.","Non misura la capacita' di replicare i collaudi di Matteo: e' bloccata a monte e resta dichiarata, non stimata.","Non passa SEP-G2, non avvia SEP-6 e non autorizza il cutover WP-1.","Non modifica app, database, script, hook, validator o fixture; nessun file di skill d'area toccato, perche' sono il materiale sotto misura."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"Senior orchestratore calibrazione AM-C0","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
