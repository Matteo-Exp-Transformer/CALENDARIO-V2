# Report — revisione esterna dello stato MSS e dell'organizzazione del cantiere (24-08-2026)

> **Chi scrive:** agente senior in ruolo di **revisore esterno**, non esecutore. Non ho scritto codice
> MSS, non ho chiuso pacchetti, non ho committato. Ho **rieseguito** i comandi e **riletto** il codice
> nei punti che reggono le dichiarazioni.
> **Fotografia:** branch `env/test`, HEAD `43feca8`, working tree con due file non tracciati e uno
> modificato (lavoro altrui, lasciato intatto).
> **Continuità:** questo report riprende la revisione del 23-08-26 che aveva prodotto l'elenco
> difetti `D1`–`D8` e `D14`, poi recepito in `docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md`.

---

## 1. Che cosa è successo dal punto in cui la revisione precedente si era fermata

Tre commit, in ordine, tutti su `env/test`:

| Commit | Contenuto | Che difetto attacca |
|---|---|---|
| `fc159fe` | pre-commit allineato alla CI; denominatori calcolati | `D1`, `D4`, `D5` |
| `308e576` | audit tecnico + **manuale operativo** + puntatori d'ingresso + rettifica viste | `D14` (parziale), discovery/`R3` |
| `43feca8` | `parseCheckSpec` canonico, `runChecks` su comando vuoto, privacy, `source_refs` | `D2`, `D3`, privacy `SK-7` |

Più il lavoro non ancora committato del 24-08: il report di controverifica Codex e la chiusura `M3`
di `SK-7`.

**Giudizio sintetico: il cantiere ha reagito bene.** Sette difetti su nove segnalati sono chiusi in
poco più di ventiquattr'ore, e — cosa che conta di più — **chiusi con test di regressione nominati
sul difetto**, non con una correzione silenziosa. Nella suite attrezzi oggi si leggono letteralmente
`parseCheckSpec — D3 storico ambiguo rifiutato` e `D2 storico ambiguo rifiutato`. Questo è il
comportamento di un sistema che sta imparando, non di uno che sta rattoppando.

---

## 2. Verifiche riprodotte in questa seduta (comandi, non opinioni)

| Comando | Exit | Misura letta al run |
|---|---|---|
| `npm run test:mss` | **0** | 42 fixture + 38 gruppi contratto/integrazione |
| `npm run test:mss:tools` | **0** | **37 test** (erano 23 il 23-08) |
| `npm run validate:docs` | **0** | 188 file, **962 path**, **0 rotti**, 26 voci in allowlist |
| `npm run mss:status` | **0** | tabella §4/§4-bis coerente con l'owner |
| `npm run mss:query` | **0** | 73 file con intestazione, **298 record**, **72 sedute**, 0 righe non parsabili |
| `npm run validate:mss` sul report Codex del 24-08 (`--kind report --require-capsule`) | **0** | capsula del report più recente valida |

Letture di codice a conferma, non dichiarazioni:

- `.cursor/hooks/fine-sessione-commit-check.mjs` riga 105 passa ora `requireCapsule: true` — il gate
  locale ha **la stessa forza** della CI. `D1` chiuso in modo verificabile.
- `scripts/mss/capsule.mjs` — `parseCheckSpec` usa il separatore canonico `=>`, accetta la forma
  legacy solo con **un solo** `:`, e lancia `ParseCheckSpecError` sugli ambigui. Il comando può
  contenere altri `=>` (arrow function) senza spezzarsi. `D2` e `D3` chiusi.
- `buildSourceRefsFromGit` filtra ora su `isGitIndexedPath`: untracked e cancellati non diventano
  più riferimenti di provenienza. La **polluzione dei `source_refs`** segnalata il 23-08 è ridotta
  al perimetro pubblicabile.
- `scripts/mss/query.mjs` — nessun denominatore cablato; il commento in testa dichiara la regola
  («mai un denominatore storico cablato»). `D4` chiuso.

---

## 3. Stato difetto per difetto

| ID | Difetto segnalato il 23-08 | Stato al 24-08 | Prova |
|---|---|---|---|
| `D1` | pre-commit più debole della CI sulla capsula | ✅ **CHIUSO** | hook riga 105 + suite H-1/tools verdi |
| `D2` | `--check` con comando vuoto produceva `pass` falso | ✅ **CHIUSO** | rifiutato con errore; test dedicato |
| `D3` | `--check` con ID contenente `:` produceva `fail` falso | ✅ **CHIUSO** | forma canonica `ID=>comando`; test dedicato |
| `D4` | denominatore storico cablato in `mss:query --fail` | ✅ **CHIUSO** | calcolato dal corpus |
| `D5` | tre numeri diversi nello stesso output di `mss:status` | ✅ **CHIUSO** | conteggi mobili rimossi dall'owner |
| — | privacy: literal privato in template e record `final` | ✅ **CHIUSO** | categorie generiche + rettifica **append-only**, non edit |
| — | `source_refs` mappavano tutto l'albero sporco | ✅ **CHIUSO** | solo path indexed |
| `D6` | cablaggio hook Claude in file gitignored | 🟡 **PARZIALE** | `.claude/hooks/fine-sessione-senior.mjs` è ora **tracciato**; il file di impostazioni che lo attiva **no** |
| `D7` | zero test sull'hook Claude | ⛔ **APERTO** | i test toccano solo i due hook Cursor |
| `D8` | `guard-prod.mjs` senza test né CI | ⛔ **APERTO e peggiore del previsto** | vedi §4 |
| `D14` | generatore viste ROADMAP/HANDOFF inesistente | ⛔ **APERTO** | vedi §5 |

---

## 4. Il punto che va guardato per primo: la guardia PROD

La copia della guardia sotto `.claude/hooks/` **esiste sul disco ma non è tracciata da git**
(`git ls-files --error-unmatch` risponde «did you forget to git add?»). Le copie tracciate sono
`.cursor/hooks/guard-prod.mjs` e `_skill-system-v0/hooks/guard-prod.mjs`; **nessuna delle tre** ha
un test, e nessuna compare in CI.

Detto in termini concreti: la protezione che impedisce a un agente di scrivere sul database di
**produzione** — quello con le prenotazioni vere dei clienti — è, per il canale Claude Code, un file
che esiste solo su questa macchina e che nessun cancello verifica. Se domani un `git clean` o una
repo nuova lo perde, **nessun test diventa rosso**: la protezione sparisce in silenzio.

È l'unico difetto aperto la cui conseguenza non è «documentazione imprecisa», ma «dati reali».
Ha priorità sopra tutto il resto del backlog MSS, ed è anche un fix piccolo.

---

## 5. `D14` — il difetto che si è moltiplicato invece di chiudersi

Il generatore di viste non esiste ancora, e nel frattempo le viste sono state rettificate **a mano**.
Il risultato oggi, dentro un solo file (`docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md`), sono
**tre strati sovrapposti** che dicono cose diverse su `SK-7`:

| Strato | Dice di `SK-7` |
|---|---|
| Tabella «Traccia viva» | `NON INIZIATO` |
| Sezione «Rettifica di stato — audit 23-08» | `aperto`, fix non recuperabile |
| Owner `PLAN_V0.md` §4-bis/§4-ter | **`CHIUSO 24-08-26 (M3)`** |

Stesso schema in `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md`, che parla ancora di
«`test:mss:tools` **9 test**» e «23 test verdi» quando il comando ne stampa **37**.

Il meccanismo di difesa dichiarato («vista, non owner: in caso di divergenza vince il plan») funziona
per chi legge tutto. Ma un agente freddo che apre l'handoff — cioè **esattamente il file scritto per
lui** — legge un numero falso e uno stato falso. Ogni rettifica manuale aggiunge uno strato invece di
sostituirlo: è la stessa classe di errore che il piano ha già registrato tre volte.

**Lettura da revisore:** questo non è più un debito, è una **fabbrica di debito**. Finché la vista si
scrive a mano, ogni seduta produttiva la rende un po' più falsa. È il fix strutturale con il
rapporto beneficio/costo più alto rimasto sul tavolo.

**Tamponato in giornata, non risolto.** Su richiesta di Matteo le due viste sono state ripulite
**togliendo**, non correggendo: la tabella di stato in `ROADMAP_V0.md` è stata **rimossa** (una quarta
versione avrebbe ripetuto il difetto) e rimanda ora all'owner e a `npm run mss:status`; i conteggi
cablati in `HANDOFF_SENIOR_V0.md` sono stati sostituiti dal comando che li produce. Netto: **32 righe
in meno**. Resta un tampone: senza il generatore, la stratificazione riparte alla prima seduta
produttiva.

---

## 6. Dove il sistema ha guadagnato davvero: il manuale

`docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` (208 righe) è, a mio giudizio di revisore, **il
singolo artefatto più utile prodotto finora** dopo `mss:query`. Fa tre cose che nessun altro file
faceva:

1. dice **quali file aprire e in che ordine**, con il ruolo di ciascuno (owner vs vista);
2. per ogni comando dichiara **cosa legge, cosa scrive, argomenti obbligatori, uso sicuro**;
3. ha una sezione **«comandi non implementati — non inventarli»** che elenca `mss:move`, `mss:review`
   e il generatore `D14`.

Quel terzo punto vale più di quanto sembri: è la prima volta che il sistema dice a un agente **ciò
che non esiste**, che è il modo più economico per impedirgli di inventarlo.

In parallelo `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` ora cita cinque comandi `mss:*`: il
23-08 ne citava **zero**. Il difetto «un agente freddo non scopre che gli attrezzi esistono» è chiuso.

---

## 7. Come si sta svolgendo il cantiere nel suo insieme

### Cosa sta funzionando

- **La catena revisore → esecutore → controverifica regge.** Il caso `SK-7` è la prova migliore: un
  fix è stato *dichiarato* completato e non esisteva; il sistema se n'è accorto, l'ha documentato
  come **assenza** e si è **fermato** invece di reimplementare in silenzio. Un cantiere che sa dire
  «questa cosa non c'è» è più sano di uno che procede.
- **La rettifica non riscrive la storia.** La violazione privacy dentro un record `final` è stata
  chiusa con un `amendment`, non con una edit. La regola append-only ha retto sotto pressione.
- **I difetti vengono chiusi con test nominati.** È la differenza fra correggere e imparare.
- **Le decisioni di Matteo sono tracciate e non si riaprono** (`D16`–`D24`, `M3`).

### Cosa non sta funzionando

- **La documentazione cresce più in fretta di quanto il sistema sappia mantenerla.** Il 23-08 ha
  prodotto **55 file e 8 790 righe** di markdown in una giornata. La stessa giornata ha chiuso sette
  difetti — quindi il lavoro c'è — ma il rapporto è di **oltre mille righe di prosa per difetto
  chiuso**, e ogni riga è manutenzione futura.
- **Il perimetro dei mandati è troppo stretto.** Il prompt `P0` dice esplicitamente «non toccare
  D1/D4/D5» e lascia fuori hook Claude e guardia PROD. È disciplina, ed è giusta; ma applicata a
  difetti da tre righe produce una seduta, un report e una capsula **per ogni riga**. La stessa
  osservazione era già agli atti come lezione del 23-08 («perimetro stretto genera duplicazione»):
  è tornata.
- **L'allowlist di `validate:docs` è a 26 voci.** Il rosso documentale è a zero, ma cinque path sono
  stati messi in allowlist invece che corretti. `D21` vietava di «azzerare il contatore ammorbidendo
  il controllo»: siamo al limite di quella regola, e la sua unica difesa oggi è che qualcuno se ne
  ricordi. Nessun cancello misura la **crescita** dell'allowlist.

### Verdetto sull'organizzazione

Il metodo è **corretto e sopra la media**. Il problema non è la direzione, è la **granularità**: il
cantiere sta spendendo per ogni difetto il cerimoniale progettato per un pacchetto. Suggerimento da
revisore, in una riga: **accorpare i fix piccoli in un unico mandato per famiglia** (per esempio
«tutte le protezioni non testate», o «tutte le viste generate»), invece di uno per difetto.

---

## 8. Percentuale aggiornata

| Asse | 23-08 | 24-08 | Perché |
|---|---|---|---|
| Motore attrezzi | ~60% | **~72%** | generatore affidabile, gate locale = CI, denominatori veri |
| Copertura test | 38% | **~50%** | +14 test attrezzi, tutti su superfici prima scoperte |
| Ergonomia agente freddo | ~10% | **~55%** | manuale + comandi citati nell'ingresso |
| Portabilità (`R8`) | 15% | 15% | `P2B` non iniziato; il kit esportabile resta senza motore |
| Adozione corpus | ~15% | ~16% | 72 sedute con capsula su 444 report tracciati |
| Autoconsistenza viste | ~40% | **~30%** | `D14` peggiorato: tre strati contraddittori |

**Complessivo: da ~40% a ~52%.** Il salto è reale e concentrato dove serviva (affidabilità e costo
d'ingresso). L'unico indicatore **peggiorato** è l'autoconsistenza delle viste, ed è quello che il
prossimo lavoro deve attaccare.

---

## 9. Rischi che restano, in ordine di conseguenza

1. **Guardia PROD non tracciata, non testata, non in CI** — conseguenza: dati reali dei clienti.
2. **Viste scritte a mano** (`D14`) — conseguenza: ogni agente freddo parte da informazioni false.
3. **Cablaggio hook Claude non riproducibile** — conseguenza: l'enforcement esiste solo su questa
   macchina; su una repo clonata il canale Claude è scoperto.
4. **`npm run validate` non include `test:mss` né `validate:docs`** — conseguenza: il cancello che
   un agente lancia per «sanity globale» non copre metà del sistema (vedi §10).
5. **Allowlist documentale senza freno** — conseguenza: il rosso torna a nascondersi, lentamente.
6. **Nessun punto di ripristino** (`SK-1`) — conseguenza: il rollback è ancora «uno SHA ricordato».

---

## 10. Domanda posta da Matteo — le due suite vanno tenute separate?

**Sono già separate, e devono restarlo.** Sono due prodotti diversi che vivono nella stessa cartella:
`npm run test` prova l'**app di prenotazioni**; `npm run test:mss` e `npm run test:mss:tools` provano
gli **attrezzi di governo**. Un fix al calendario non può rompere il validator delle capsule, e
viceversa. Tenerle in due comandi distinti è la scelta giusta ed è già così — anche in CI, dove i job
`ci` e `mss` sono separati e falliscono in modo indipendente: si legge subito **quale** dei due
prodotti è rotto.

**Il difetto non è la separazione: è che `validate` mescola i due mondi a metà.** Oggi vale
`lint && typecheck && test && test:mss:tools`. Cioè: prende l'app **intera**, poi si porta dietro
**una sola** delle due suite MSS, e lascia fuori `test:mss` (il validator, il pezzo più importante) e
`validate:docs`. Non è né un cancello dell'app né un cancello del MSS: è un ibrido che non copre
nessuno dei due per intero, e nessuno se ne accorge perché esce verde.

**Che cosa risponde alla domanda «è obbligatorio per l'agente lanciarle tutte e due?»:** oggi no, ed
è un problema. Un agente che lavora sul MSS e lancia `validate` crede di aver verificato, e ha
saltato il validator; un agente che lavora sull'app lancia `validate` e paga il costo di una suite
MSS che non c'entra nulla col suo lavoro.

**Proposta concreta (tre righe di `package.json`, nessun codice nuovo):**

| Comando | Contenuto | Chi lo lancia |
|---|---|---|
| `validate:app` | `lint` + `typecheck` + `test` | chi tocca `src/` |
| `validate:mss:all` | `test:mss` + `test:mss:tools` + `validate:docs` | chi tocca `scripts/mss/`, `docs/` o gli hook |
| `validate` | i due sopra, in sequenza | prima di una PR, e in CI |

Così ogni agente sa **quale** cancello lo riguarda, nessuno paga il costo dell'altro prodotto durante
il lavoro, e prima della PR il cancello completo li copre entrambi. È anche il fix che chiude la metà
mancante di `SK-5` («gate complessivo non coerente»), ed è forse il migliore rapporto
risultato/sforzo rimasto in tutto il backlog.

---

## 11. Cosa resta da fare, nell'ordine di priorità dichiarato da Matteo

Ordine: *(a)* fix piccoli e veloci · *(b)* fix che fanno risparmiare token · *(c)* fix che danno
agilità agli agenti · *(d)* fix strutturali che sbloccano lo sviluppo.

| # | Lavoro | Categoria | Perché qui |
|---|---|---|---|
| 1 | Tracciare + testare + mettere in CI le **guardie PROD**; tracciare il cablaggio degli hook | (a) piccolo | conseguenza sui dati reali; chiude `D6`/`D7`/`D8` |
| 2 | **Separare i cancelli** `validate:app` / `validate:mss:all` / `validate` | (a)+(b) | tre righe; chiude la metà aperta di `SK-5`; ogni agente smette di pagare il cancello altrui |
| 3 | **Tag di ripristino** `mss/baseline-*` (`SK-1`) | (a) piccolo | un comando; oggi il rollback è uno SHA ricordato |
| 4 | **Freno sull'allowlist** documentale (soglia che diventa rossa se cresce) | (a) piccolo | difende `D21` con un cancello invece che con la memoria |
| 5 | **Generatore viste** ROADMAP/HANDOFF/indice (`D14`) | (c)+(d) | elimina la fabbrica di debito; è il fix che *smette* di far scrivere prosa |
| 6 | `P2B` — **export/bootstrap** del motore in repo nuova (`SK-10`/`R8`) | (d) | oggi il kit esportabile non contiene il MSS |
| 7 | `mss:move` (`SK-9`) | (d) | `R6` è a zero; costo misurato 1 741 righe per un file |
| 8 | `mss:review` (`SK-3`) | (d) | ultimo attrezzo di lettura mancante |

---

## 12. Limiti di questa revisione

- Ho letto l'albero di lavoro e ho rieseguito comandi; **non** ho letto la storia dei commit
  cancellati né i transcript delle chat.
- Non ho verificato la CI remota: le mie prove sono locali.
- I conteggi del corpus sono **mobili**: quelli in §2 valgono al momento del run, non sono un
  riferimento da ricopiare. Per il valore corrente eseguire `npm run mss:query`.
- Non ho toccato codice, non ho chiuso pacchetti, non ho committato. Le tre modifiche presenti nel
  working tree non sono mie.
## 13. Difetto nuovo trovato usando l'attrezzo — `mss:capsule` non valida ciò che scrive

Questo report è stato chiuso **usando il generatore**, non scrivendo la capsula a mano. È stato un
collaudo reale, e ha trovato un difetto che nessuna delle due suite copre.

Al primo tentativo `mss:capsule` è uscito **exit 0**, ha stampato la capsula e l'ha **scritta nel
report**. Subito dopo, `validate:mss` sullo stesso report è uscito **exit 1** con due `deny`:

| Regola violata | Che cosa era sbagliato |
|---|---|
| `MSS-PERSONA-ASSERTION` | valore fuori enum nel campo `assistance` |
| `MSS-PRODUCT-GATE` | `product_candidate.result: not_eligible` senza alcun gate fallito |

**Perché è un difetto e non un errore mio.** Il generatore controlla la *completezza* dei giudizi
(mi ha correttamente fermato, exit 2, quando mancava `environment`) ma **non** la loro *validità*
rispetto alle regole che il validator applicherà un minuto dopo. Le due verifiche vivono in due posti
diversi, quindi l'attrezzo che scrive può produrre un record che l'attrezzo che controlla rifiuta.

**Conseguenza pratica.** Un agente che chiude la seduta con `mss:capsule --append-to` ottiene exit 0,
crede di aver finito, e **il report resta sul disco con una capsula invalida**. Se non rilancia
`validate:mss` di sua iniziativa, se ne accorge il pre-commit — o, peggio, la CI. Ed è la classe di
errore più costosa in questo sistema: la capsula è già stata **scritta**, quindi se il file fosse
stato committato la correzione richiederebbe un `amendment` invece di una riscrittura.

**Fix indicato, coerente con `D18`:** `capsule.mjs` deve chiamare il validator del `core` sul JSONL
appena costruito e uscire **rosso senza scrivere nulla** se il record non passa. La regola esiste già
ed è esportata; va importata, non riscritta. È un fix piccolo e appartiene alla stessa famiglia dei
punti 1–4 della tabella §11.

**Nota di metodo per Matteo:** questo difetto è emerso solo perché il report di revisione è stato
chiuso con l'attrezzo invece che a mano. Vale come argomento generale — **gli attrezzi vanno usati
per il lavoro vero, non solo testati**: la suite `tools` ha 37 test verdi e nessuno di essi copriva
questo percorso.

---

---

## 14. File toccati in questa seduta

| File | Perché |
|---|---|
| `docs/Sessioni di lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md` | questo report |
| `docs/Sessioni di lavoro/24-08-26/judgments-revisione-esterna-stato-mss-24-08-26.json` | giudizi dei tre assi per il generatore |
| `docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md` | mandato vivo dell'orchestratore |
| `docs/MetaSkillSystem/PLAN_V0.md` | §15: prossimo task atomico e i cinque mandati |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | puntatore al mandato vivo; nota `N1` su `mss:capsule` |
| `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md` | rimossa la tabella di stato stale (`V2`) |
| `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` | conteggi cablati sostituiti dal comando (`V3`) |

Nessun file di codice toccato: la revisione è in sola lettura per costruzione.

---

## 15. Domande di chiusura

**Q1 — Prompt ricevuti.** Nessun file-prompt: i mandati sono arrivati in chat e non esistono in
alcun file del repo, quindi vanno verbatim (`D23`).

1. «*ho proseguito il lavoro da quando ti sei fermato perchè sono finiti i token. controlla lo stato
   ora del MSS rispetto a come lo avevi lasciato. comportati come revisore esterno e agente senior al
   fine di determinare stato di salute del MSS e dei suoi lavori in corso. quando hai finito compila
   un report dettagliato del quadro generale e di come si stanno svolgendo i lavori nel loro insieme.
   per valutare anche se stiamo procedendo correttamente nell'organizzazione dell'intero cantiere.
   rispondimi a questa domanda : non ha senso distinguere la suite di test del app calendar back up e
   la suite test di MSS ? invece che farli girare tutti insieme come validate? o non è obbligatorio
   per agente lancaire tutte e due le suite perchè sono gia distinte?*»
2. «*prepara prompt per prossimo agente senior che sarà orchestrator. nel prompt gli darai i dettagli
   e i riferimenti di tutte le problematiche che hai riscontrato. e di cosa vuol dire arrivare al 100
   / della struttura . agente senior orchestrator lacnerà agenti esecutori e revisori accorpandoli
   risparmiando utilizzo token ( modell adeguato al carico di lavoro, e lavori raggruppati per
   minimizzare generazione di documentazione inutile) e lui farà da agente che controverifica alla
   fine dei lavori e orchestra sviluppo struttusa MSS per come la stiamo progettando. prepara il
   prompt e poi committa tutto il lavoro rimasto indietr e fai push lasciamo work tree pulita per
   ripresa cantiere.*»

Contesto di partenza letto: `PLAN_V0.md`, `MANUALE_OPERATIVO_MSS_V0.md`,
`AUDIT_STATO_REALE_23-08-26.md` a `43feca8`.

**Q2 — Dati = diff reale?** Sì. I `controls[]` della capsula **non sono dichiarati**: li ha eseguiti
`mss:capsule` durante la generazione, con gli exit code veri. Le misure di §2 vengono dagli stessi
comandi rieseguiti da me prima di scrivere. `validate:mss --require-capsule` sul report: exit 0.

**Q3 — File correlati.** La tabella §14 è completa e verificata con `git status`. Il manuale e il
piano sono stati allineati al mandato nuovo; le due viste sono state ripulite.

**Q4 — Cosa NON ho fatto.**
- Non ho corretto `A1`–`A4`, `N1`, `V1`, `P1`, `T1`, `T2`: sono il contenuto dei mandati, non compito
  del revisore. Correggerli qui avrebbe reso il revisore autore di ciò che revisiona.
- Non ho eseguito `npm run test` (suite app): questa seduta non tocca `src/`.
- Non ho verificato la **CI remota**: tutte le mie prove sono locali.
- Non ho risolto il blocco su `Report-revisione-skill-chiusura-e-hook-23-08-26.md` (vedi Q5): serve
  una decisione di Matteo, non una scelta mia.

**Q5 — Attrito + miglioria.** Due attriti reali, entrambi già agli atti come difetti.
1. `mss:capsule` mi ha fatto rigenerare la capsula **tre volte** perché scrive prima di validare
   (`N1`): il primo giro ha lasciato sul disco un report con capsula rifiutata. **Miglioria:**
   importare il validator del `core` e uscire rosso senza scrivere — è il fix già indicato in §13.
2. Il pre-commit ha respinto un report altrui con `MSS-FINAL-RECORD-MODIFIED` (quattro record `final`
   riscritti invece che rettificati con `amendment`). **È il cancello che funziona**, e va detto:
   `validate:mss --mode file` su quello stesso file **usciva OK**, perché la modalità file non
   confronta con la storia git. **Miglioria:** il manuale deve dire esplicitamente che `--mode file`
   non prova l'append-only, e che la prova vera è `--mode staged` o il pre-commit.

**Q6 — Contesto & hook.** Il contesto era **giusto**, e per la prima volta: il manuale operativo mi
ha evitato di aprire il corpus: due comandi e quattro file invece di una lettura a tappeto. Restava
scoperta una cosa — la struttura obbligatoria del report (Q1–Q6 compresi) l'ho dovuta cercare in
`CHIUSURA_SESSIONE.md` con un grep; il manuale la cita ma non la elenca. **Gli hook sono stati utili,
non rumore:** quello a mente fredda mi ha fermato su un commit dove mancavano davvero queste domande.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0","correlation_id":"mss-cor-01a030d4-8fd8-7e34-9b2a-fff2d7195f9b","segment_no":1,"created_at":"2026-08-24T00:53:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"revisore esterno","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a030d4-8fd8-7211-af4b-0cfe5bfd05f8","capture_key":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0/1/session_event/1","event":{"event_id":"mss-evt-01a030d4-8fd8-7832-99cc-7aeee320d6bb","event_kind":"session_close","occurred_at":"2026-08-24T00:53:51+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"Controllare lo stato del MetaSkillSystem dopo il lavoro proseguito senza di me, in ruolo di revisore esterno e agente senior; produrre un report del quadro generale e giudicare l'organizzazione del cantiere; rispondere alla domanda sulla separazione fra suite di test app e suite MSS.","session_type":"deep","capsule_status":"completa","role_key":"revisore esterno MetaSkillSystem","area":"MetaSkillSystem / revisione di stato e organizzazione cantiere","environment":"repo locale Windows, branch env/test, HEAD 43feca8; working tree con due file non tracciati e uno modificato, appartenenti ad altro lavoro e lasciati intatti","authorization":{"read":["docs/MetaSkillSystem/**","docs/Sessioni di lavoro/**","scripts/mss/**",".cursor/hooks/**",".claude/hooks/**","package.json",".github/workflows/ci.yml","git log e git ls-files"],"write":["docs/Sessioni di lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md","docs/Sessioni di lavoro/24-08-26/judgments-revisione-esterna-stato-mss-24-08-26.json","docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md","docs/MetaSkillSystem/PLAN_V0.md sezione 15","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md puntatori","docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md e HANDOFF_SENIOR_V0.md, rimozione viste stale"],"forbid":["src/**","scripts/mss/**","Supabase e qualunque scrittura su database","chiusura o riapertura di pacchetti SK-*","modifiche altrui presenti nel working tree"]},"authorized_outputs":["report di revisione esterna","capsula di sessione generata dall'attrezzo"],"route":{"chosen":"MetaSkillSystem deep in sola lettura: riesecuzione dei comandi, rilettura del codice nei punti che reggono le dichiarazioni, giudizio di revisore","alternatives_or_conflicts":"nessuno"},"observed_outcome":"Sette difetti su nove segnalati il 23-08 risultano chiusi e coperti da test di regressione nominati sul difetto. Restano aperti D7 e D8 (hook Claude e guardia PROD senza test ne CI, con la copia sotto .claude non tracciata da git) e D14, peggiorato: le viste ROADMAP e HANDOFF portano ora tre strati contraddittori su SK-7 e un conteggio test falso. Il manuale operativo e i comandi citati nell'ingresso chiudono il difetto di scoperta degli attrezzi. Il cancello npm run validate resta un ibrido che non copre per intero ne l'app ne il MetaSkillSystem. Difetto nuovo trovato chiudendo questa seduta con l'attrezzo: mss:capsule esce 0 e scrive la capsula nel report anche quando il record viola le regole che validate:mss applica subito dopo (enum Persona e gate product_candidate); il generatore controlla la completezza dei giudizi ma non la loro validita. Su richiesta di Matteo sono state ripulite le due viste stale togliendo la tabella invece di correggerla (32 righe in meno) ed e stato scritto il mandato dell'agente orchestratore, che definisce il 100 per cento della struttura come una prova eseguibile per ciascuno degli otto requisiti R1-R8.","open_items":["D7 e D8: hook Claude e guardia PROD senza test ne CI; la copia sotto .claude non e tracciata","D14: generatore delle viste assente, rettifiche manuali che si stratificano","SK-5: npm run validate non include test:mss ne validate:docs","allowlist documentale a 26 voci senza freno automatico","SK-1: nessun tag di ripristino","mss:capsule non valida il JSONL che produce: va importato il validator del core prima della scrittura, coerente con D18"],"controls":[{"control_id":"test:mss","criterio":"npm run test:mss","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0)","evidence_refs":[]},{"control_id":"test:mss:tools","criterio":"npm run test:mss:tools","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0)","evidence_refs":[]},{"control_id":"validate:docs","criterio":"npm run validate:docs","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:docs (exit 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"Matteo","provider":"non_applicabile: soggetto umano","model":"non_applicabile: soggetto umano","runtime":"non_applicabile: soggetto umano","surface":"chat Claude Code"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["stato Git","esiti di test aggregati","path del repository","hash commit"],"prohibited_content":["materiale privato non registrabile","segreti","token di autenticazione"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione 4-bis e 4-ter","revision_or_hash":"43feca8","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-audit","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md","stable_anchor_or_event_id":"elenco difetti D1-D8 e D14","revision_or_hash":"43feca8","sensitivity":"internal"},{"ref_id":"source-manuale","owner_id":"SK-10","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"manuale operativo agente freddo","revision_or_hash":"43feca8","sensitivity":"internal"},{"ref_id":"source-roadmap","owner_id":"SEP","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"traccia viva SK-* e rettifica audit","revision_or_hash":"43feca8","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"},{"ref_id":"source-git-7","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"},{"ref_id":"source-git-8","owner_id":"git-working-tree","uri_or_path":"docs/Sessioni di lavoro/24-08-26/judgments-revisione-esterna-stato-mss-24-08-26.json","stable_anchor_or_event_id":"working tree","revision_or_hash":"66f2b2f","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0","correlation_id":"mss-cor-01a030d4-8fd8-7e34-9b2a-fff2d7195f9b","segment_no":1,"created_at":"2026-08-24T00:53:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"revisore esterno","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030d4-8fd8-7871-9de9-ccf0e59248ba","capture_key":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a030d4-8fd8-7817-853e-59765a0a7806","axis":"persona","subject_record_ids":["mss-rec-01a030d4-8fd8-7211-af4b-0cfe5bfd05f8"],"delta":"nessuno","assertions":[{"signal":"Matteo ha chiesto una revisione esterna prima di continuare a sviluppare, e ha dichiarato l'ordine di priorita dei fix invece di lasciarlo dedurre.","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"owner-plan","effect":"il backlog e stato ordinato secondo criteri suoi dichiarati, non secondo la comodita dell'esecutore","evidence_state":"observed"}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"revisore esterno","basis":"direct_observation"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"owner-plan","evidence_refs":[],"notes":"nessuna inferenza di competenza o livello"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0","correlation_id":"mss-cor-01a030d4-8fd8-7e34-9b2a-fff2d7195f9b","segment_no":1,"created_at":"2026-08-24T00:53:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"revisore esterno","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030d4-8fd8-74c5-83e6-fec91cd847a3","capture_key":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a030d4-8fd8-778c-b573-20d115796e35","axis":"sistema","subject_record_ids":["mss-rec-01a030d4-8fd8-7211-af4b-0cfe5bfd05f8"],"delta":"verificato","assertions":[{"rule_id_version":"revisione-esterna@24-08-26","trigger_event":"riesecuzione dei comandi MSS e rilettura del codice nei punti che reggono le dichiarazioni del piano","decision_or_output_changed":"confermata la chiusura di D1-D5, privacy e source_refs con test nominati; confermati aperti D7, D8 e D14; rilevato che la copia della guardia PROD sotto .claude non e tracciata da git e che le viste ROADMAP e HANDOFF portano stati e conteggi falsi","G":2,"O":2,"E":1}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"revisore esterno","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":["source-audit","source-roadmap"],"notes":"ogni affermazione poggia su un comando rieseguito o su una lettura di codice citata nel report"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0","correlation_id":"mss-cor-01a030d4-8fd8-7e34-9b2a-fff2d7195f9b","segment_no":1,"created_at":"2026-08-24T00:53:51+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5","actor_type":"agente","role":"revisore esterno","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a030d4-8fd8-7195-b139-17117b684875","capture_key":"mss-ses-01a030d4-8fd8-7e6b-ae60-238f508bafd0/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a030d4-8fd8-720b-8266-f4868813d82b","axis":"output","subject_record_ids":["mss-rec-01a030d4-8fd8-7211-af4b-0cfe5bfd05f8"],"delta":"creato","assertions":[{"output_id":"report-revisione-esterna-stato-mss-24-08-26","primary_type":"registro","canonical_version":"docs/Sessioni di lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md","recipient":"Matteo","problem_or_job":"sapere lo stato di salute reale del MetaSkillSystem e se il cantiere e organizzato correttamente, prima di autorizzare altro sviluppo","intended_use":"decisione sull'ordine dei prossimi mandati e sulla separazione dei cancelli","conceived_by":"richiesta di Matteo","decided_by":"Matteo","directed_by":"chat corrente","authored_by":"anthropic-claude-opus-5","verified_by":"validate:mss sul report con require-capsule","acceptance_criterion":"ogni affermazione riconducibile a un comando rieseguito o a una lettura di codice citata; capsula valida","verification_or_use_evidence":"controlli registrati in questa capsula con exit code reali","verification_status":"self_report","owner_ref":"owner-plan","privacy_release":"internal","support_files":["docs/MetaSkillSystem/AUDIT_STATO_REALE_23-08-26.md"],"relations_no_double_count":["registro di revisione; non e un prodotto di alcun pacchetto SK-*"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"anthropic-claude-opus-5","role":"revisore esterno","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"owner-plan","evidence_refs":[],"notes":"registro interno, non deliverable esterno"}}}
```
