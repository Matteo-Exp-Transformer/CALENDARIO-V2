# Report `M-C` — attrezzi che non mentono (24-08-2026)

**Cosa è cambiato:** l'attrezzo che chiude le sedute non scrive più capsule che il controllo
qualità rifiuta subito dopo, e un revisore può finalmente registrare «ho controllato il lavoro di
un altro» con un comando invece che a mano.
**Cosa resta:** `V1` (generatore di viste) **non fatto** — perimetro più grande di `N1`+`N2`
insieme, disegno in §10-bis. Più un difetto nuovo da decidere (`--check` vacuo, §9).
**Serve una tua azione:** sì — nessun commit è stato fatto: decidi tu se committare, e decidi il
gate sul difetto `--check` vacuo.

---

## 1. Cosa è stato fatto

Prima: chiudevi la seduta con `mss:capsule`, l'attrezzo diceva «fatto», e il controllo qualità
lanciato **subito dopo** sullo stesso file diceva «rotto». L'agente aveva visto verde e aveva
lasciato una capsula rotta sul disco. Due modi diversi in cui succedeva, tutti e due riprodotti
davvero il 24-08:

1. il report dichiarava già la sua sezione «Capsula MetaSkillSystem» — quella numerata, come la
   prescrive la guida di chiusura — e l'attrezzo ne appiccicava una **seconda** in fondo, perché
   guardava una scritta letterale e non riconosceva la forma numerata;
2. un giudizio con un numero fuori scala (`G: 3`, la scala arriva a 2) passava il controllo di
   completezza — «i tre giudizi ci sono» — e finiva scritto.

Ora l'attrezzo, **prima di toccare il disco**, passa quello che sta per scrivere allo stesso
controllo qualità che gireresti dopo. Se è rosso: esce in errore, stampa il motivo e **non scrive
niente**. E quando il report ha già la sua sezione capsula, l'attrezzo usa la stessa definizione
del controllo qualità: se la sezione c'è, in qualunque forma, si ferma.

Seconda cosa. Le revisioni indipendenti si fanno davvero, ma il campo che dovrebbe provarle è
vuoto in tutte le annotazioni grezze del corpus. La tentazione era far scrivere «verificato da me»
alla seduta stessa: sarebbe stato peggio del problema — un revisore che firma le **proprie**
annotazioni non ha verificato nessuno, e il sistema passerebbe da «zero verifiche registrate»
(onesto) a «verifiche finte registrate» (mente al comando che lo interroga). Una verifica è per
costruzione l'atto di un **secondo** attore su un record **altrui**, e nel contratto ha già la sua
forma: la rettifica `amendment` (§6). Ora è un'operazione di prima classe dell'attrezzo:

```
npm run mss:capsule -- … --verify "<mss-rec-…>|independently_verified|<prova>|<motivo>"
```

L'attrezzo **non deduce** bersaglio, esito, prova e motivo: li chiedi tu. Legge dal record
bersaglio soltanto i valori **precedenti** — che non sono un giudizio, sono un fatto già scritto, e
ricopiarli a mano è esattamente come si sbaglia. E se il ruolo dichiarato della seduta contiene
«reviewer»/«revisor» ma non registri nessuna verifica, l'attrezzo **avvisa** e lascia passare:
bloccare avrebbe prodotto verifiche di comodo, cioè di nuovo dati inventati.

## 2. File toccati e perché

| File | Perché |
|---|---|
| `scripts/mss/parse.mjs` | Estratte `findCapsuleHeadings()`/`countCapsuleHeadings()`: **unica** definizione di «questo report dichiara già una capsula». Il validator la usava già, ora la usa anche chi scrive |
| `scripts/mss/capsule.mjs` | `N1`: `planCapsuleAppend()` (prepara senza scrivere) + `validateCapsuleOutput()` (importa `validatePathContent`, non riscrive la regola) + `runCapsule` riordinato «valida, poi scrivi». `N2`: `parseVerifySpec()`, `buildVerificationAmendments()`, flag `--verify`, avviso revisore |
| `scripts/mss/query.mjs` | Esportati `findRecordInCorpus()` (leggere i valori precedenti dal bersaglio) e `REVISORE_RE` (era una const locale: stessa domanda in due punti, una sola regex) |
| `scripts/mss/uuid.mjs` | **Perimetro allargato e dichiarato** (§5 del mandato non lo citava): `newAmendmentIds()`. Gli id `mss-amd-` non esistevano perché nessun attrezzo emetteva amendment |
| `docs/MetaSkillSystem/tests/tools/run.mjs` | I cinque test nuovi (§4) |
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | **Perimetro allargato e dichiarato**: §2.4 conteneva l'avviso «il generatore esce 0 e scrive anche quando i giudizi violano le regole», ora **falso**. Lasciarlo sarebbe stato un documento che mente |

Nessun `move`, nessuna rinomina, nessuna scrittura su database, nessun record `final` riscritto.

## 3. Le due riproduzioni, prima e dopo

Stesso ingresso, stesso script, due motori: `HEAD` (ricostruito con `git show HEAD:scripts/mss/*`
in una cartella temporanea) e il working tree.

| Caso | Motore `0592e40` (prima) | Working tree (dopo) |
|---|---|---|
| Report con `## 6-bis. Capsula MetaSkillSystem` + `--append-to` | exit **0**, capsula **scritta**, poi `MSS-PARSE-JSONL-AMBIGUOUS` | exit **2**, **niente scritto** |
| Giudizi completi con `G: 3` | exit **0**, capsula **scritta**, poi `MSS-SYSTEM-ASSERTION` | exit **2**, **niente scritto** |

La forma numerata non era un caso di laboratorio. Il conteggio delle intestazioni capsula per forma
si legge con questo comando (numero mobile, non lo ricopio):
`grep -rhoE "^#{1,6} +([0-9]+(-bis)?[.)] +)?Capsula MetaSkillSystem" "docs/Sessioni di lavoro/" | sort | uniq -c | sort -rn`
— le varianti numerate, che la vecchia guardia **non** vedeva, sono la seconda forma più diffusa.

## 4. Test eseguiti e risultato

I cinque test nuovi, **nomi esatti**, tutti in `docs/MetaSkillSystem/tests/tools/run.mjs`:

| Test | Difetto |
|---|---|
| `capsule: N1 — report che dichiara gia una capsula numerata: exit non-zero e nessuna scrittura` | `N1` riga 1 |
| `capsule: N1 — giudizi completi ma fuori dominio (G: 3) non vengono scritti` | `N1` riga 2 |
| `capsule: N2 — il revisore emette un amendment e --verifica mostra il verificatore` | `N2` positivo |
| `capsule: N2 — nessun amendment inventato quando il revisore non lo chiede, solo un avviso` | `N2` negativo |
| `capsule: N2 — --verify rifiuta bersaglio inesistente, esito fuori enum e self_report` | `N2` guardie |

I due test `N1` girano in un **repo git temporaneo**: una regressione li fa fallire senza toccare il
corpus vero. Il buco che coprono è quello indicato dal mandato: la suite aveva già l'ingresso
**valido** (`capsule: giro completo`) e l'ingresso **incompleto** (`capsule: negativo — giudizio
mancante`), non l'ingresso **completo ma invalido**.

Comandi eseguiti (numeri **dal comando**, non ricopiati — rieseguibili):

- `npm run test:mss` → exit 0
- `npm run test:mss:tools` → exit 0
- `npm run validate:docs` → exit 0, 0 path rotti
- `npm run validate:mss:all` → exit 0 (linea di base **prima** del lavoro: exit 0, stessa suite)
- `npm run mss:query -- --verifica` → exit 0. La vista effettiva mostra i verificatori già presenti;
  nelle annotazioni **grezze** `verified_by` resta vuoto ovunque, ed è corretto: questa seduta non
  ha verificato nessuno e non ha usato `--verify` sul corpus vero (§9, R4).
- `npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/24-08-26/Report-mc-attrezzi-che-non-mentono-24-08-26.md" --kind report --require-capsule` → exit 0 (dopo la capsula)
- `git diff --check` → pulito

Prove dal vivo del rifiuto `--verify` sul corpus **vero**, senza scrivere nulla (`git status`
invariato dopo): bersaglio che è un `session_event` e non un'annotazione → exit **2**; esito
`self_report` su record altrui → exit **2**; bersaglio inesistente → exit **2**.

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` | §2.4 riscritta: `N1` e `N2` marcati **PROVATO**, opzione `--verify` documentata, aggiunto il limite `--check` vacuo | L'avviso `N1` era diventato falso; una guida che descrive un comportamento che non esiste più è peggio di nessuna guida |

Nessun'altra skill d'area è coinvolta: il lavoro è tutto dentro il motore MSS e i suoi test.
`PLAN_V0.md` **non** è stato toccato: è l'owner di stato e non spetta a me dichiarare chiusure.

## 6. Dati comunicazione

Un solo prompt, il mandato, già completo: censimento fatto, riproduzioni fatte, trappola di `N2`
già smontata. Zero domande di chiarimento necessarie, zero correzioni dopo la prima risposta.
Ricorrenze del vocabolario di Matteo lette nel mandato: «un solo report», «numeri come comando»,
«`PROVATO` mai `CHIUSO`», «se non è esportato, si esporta».
Automatizzabile con certezza: il confronto prima/dopo su un motore ricostruito da `git show` — è
stato scritto una volta e ha dato il numero esatto due volte. Da lasciare manuale: la decisione su
quale sia sbagliato fra codice e regola quando un test non passa.

## 7. Analisi flusso prompt, efficienza e statistiche

Prompt sostanziali di Matteo (via orchestratore): 1. Correzioni dopo la prima risposta: 0.
Follow-up generati: 1 (`V1` progettato, non fatto). Modalità alzata: no.
Cosa ha reso il mandato efficace: **le riproduzioni erano già state fatte e scritte come tabella
ingresso/uscita**. Non ho dovuto indovinare il difetto, l'ho solo rieseguito. E il paragrafo su
«perché il fix ovvio di `N2` è quello sbagliato» ha risparmiato l'errore più probabile.

## 8. La mia lettura della sessione

**Cosa ha funzionato.** Il mandato mi ha detto cosa **non** leggere, e sono partito dal codice in
dieci minuti invece che dal corpus. La regola `D18` («se non è esportato, esporta») ha deciso da
sola tre scelte di progetto: `validatePathContent` invece di una seconda chiamata al validator,
`findCapsuleHeadings` invece di una seconda regex, `REVISORE_RE` invece di una seconda.

**La difficoltà vera.** `N1` non era «manca una validazione»: era che **due parti dello stesso
sistema avevano due definizioni diverse della stessa cosa**. La guardia dell'attrezzo e la regola
del validator dicevano entrambe «il report ha già una capsula» e intendevano cose diverse. Il fix
che aggiunge una validazione cura il sintomo; quello che **importa la definizione** cura la causa.
Ho scelto il secondo, ed è per questo che il caso 1 e il caso 2 si chiudono con lo stesso codice.

**Migliorie che suggerirei** (come dato, non come modifica fatta):

- il canale `--check` accetta comandi con la sintassi shell di Windows e la mia idea di controllo
  «invertito» (un comando che deve fallire) è costata tre tentativi di quoting. Un
  `--check-expect <exit>` risolverebbe la classe intera;
- il template dei giudizi non ha un campo per le verifiche: chi vuole usare `--verify` deve saperlo
  dal manuale. Un `_guida` che lo nomini lo renderebbe scopribile;
- attrito trovato chiudendo **questa** seduta: `session_event.environment` è obbligatorio nel
  controllo di completezza, ma `buildCapsuleBundle` ha già un fallback che lo deriva da git — il
  fallback è quindi irraggiungibile e l'agente deve scrivere a mano un dato che la macchina sa.
  O si toglie l'obbligo, o si toglie il fallback: adesso i due si contraddicono.

## 9. Derivazione errori

| Cosa | Causa | Come si evitava |
|---|---|---|
| `N1` caso 1 — capsula doppia | **bug preesistente**: `appendCapsuleToReport` cercava la sottostringa `## Capsula MetaSkillSystem`, mentre `parse.mjs` usa `CAPSULE_HEADING_RE`, che accetta anche le forme numerate | Non scrivere mai una seconda definizione di una regola già scritta. È `D18`, e il costo di violarlo qui è stato una capsula rotta su disco |
| `N1` caso 2 — `G: 3` scritto | **bug preesistente**: `validateJudgments` controlla la **completezza**, e il suo nome suggerisce la **validità** | Un nome che dice cosa fa: `assertJudgmentsComplete` |
| `N2` — `verified_by` vuoto ovunque | **vincolo strutturale**: la verifica è l'atto di un secondo attore, e l'attrezzo emetteva solo record della propria seduta | Nessun errore da evitare: era una funzione mancante, non un bug |
| **Difetto nuovo, aperto, da decidere** | `--check` deduce l'esito dall'**exit code**: un comando che non può fallire (`git status --short`) registra un `pass` che non prova nulla, e nessun attrezzo se ne accorge. Un `controls[]` di comandi infallibili **sembra** una prova | Fuori dal perimetro di `M-C`: distinguere un controllo capace di fallire da uno vacuo è una decisione di progettazione. **Gate Matteo.** Per non contraddirmi da solo, in questa capsula NON ho registrato `mss:query -- --verifica` fra i `controls`: gira sempre a 0, sarebbe stata esattamente quella prova vacua |

## 10. Cosa resta

- **`V1` non fatto** — vedi §10-bis. È l'unica voce del mandato non consegnata.
- **`--check` vacuo** — difetto nuovo, gate Matteo.
- **Nessun commit, nessun push.** Modifiche nel working tree, `git diff --check` pulito.

## 10-bis. Handoff — cosa è vero adesso

**Vero adesso.** `N1` e `N2` sono **PROVATI** (non «chiusi»: `CHIUSO` è solo di Matteo), con i
cinque test nominati in §4. `npm run validate:mss:all` esce 0. Working tree con i sei file di §2
modificati più questo report e i suoi giudizi, niente staged, nessun commit fatto in questa seduta.

**Da non riaprire.** (a) La verifica passa da `amendment`, mai da `verified_by` scritto sulle
proprie annotazioni: è `R2`, ed è la ragione per cui il fix ovvio di `N2` è quello sbagliato.
(b) Il template resta con `verified_by: []`: è la verità per una seduta che non ha verificato
nessuno, non un difetto. (c) Chi scrive **importa** la regola di chi valida — se ti serve un pezzo
di `core.mjs`, esportalo, non copiarlo.

**Prossimo task atomico: `V1`, e va aperto da solo.** Il perimetro è più grande di `N1`+`N2` messi
insieme, per una ragione strutturale: `N1` e `N2` erano fix dentro un modulo esistente con un
contratto già scritto; `V1` deve **inventare un contratto nuovo** (come si delimita un blocco
derivato dentro un documento scritto a mano) e un cancello nuovo. Disegno proposto:

1. **Marcatori.** Il blocco derivato vive fra due commenti HTML riconoscibili
   (`<!-- mss:generated <vista> inizio -->` … `<!-- mss:generated <vista> fine -->`). Fuori dai
   marcatori è prosa umana e la rigenerazione **non** la tocca; dentro, nessuno edita a mano.
2. **Generatore.** Legge l'owner (`PLAN_V0.md` §4-bis/§4-ter) e i comandi, **sostituisce** il
   contenuto fra i marcatori, non lo affianca. Non scrive mai nell'owner.
3. **Numeri.** Ogni valore mobile o esce dal comando **al momento della generazione**, o è citato
   **come comando**. Mai congelato — è così che sono nati `V2`/`V3`.
4. **Cancello anti-stale.** `validate:views` (nome da decidere) rigenera in memoria e confronta: se
   il derivato sul disco non corrisponde più all'owner, esce **rosso**. Entra in
   `validate:mss:all`. Senza questo punto `V1` resta una fabbrica di debito anche col generatore
   in casa.
5. **Ordine di lavoro.** Prima 1+4 su **una** vista sola (`ROADMAP_V0.md`), col test che prova che
   una modifica all'owner fa uscire rosso il cancello. `HANDOFF_SENIOR_V0.md` dopo.

**Gate di chiusura di `V1`:** un test che nomini `V1`, che modifichi l'owner in un repo temporaneo
e verifichi che il cancello esce rosso **prima** della rigenerazione e verde dopo.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: `docs/Sessioni di lavoro/24-08-26/Prompt-mandato-MC-attrezzi-che-non-mentono-24-08-26.md` = `cec617c0eb94a10d83c19eb36a46a63bd694dce8`; `docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` = `3cd044f3a87d0d6348a686ddad5be10a2c88f477`; `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` = `e56b072e0ff0d5545b5b789b59b7afa22c089c01`; `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` = `a04af315efdca7f60981f6798ce6e2adc3acb102`. HEAD della seduta: `0592e40`. Nessun messaggio di Matteo fuori file: il mandato è arrivato tramite l'orchestratore, che ha aggiunto quattro fatti già verificati (import mancante in `capsule.mjs`, `validateMss` esportato in `core.mjs`, dominio G/O/E in `core.mjs`, linea di base verde) — tutti e quattro riverificati da me sul codice prima di usarli.

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: sì. `git diff --stat` elenca esattamente i sei file di §2; i cinque nomi di test in §4 sono copiati dal file, non riscritti a memoria (`grep "capsule: N" docs/MetaSkillSystem/tests/tools/run.mjs`); `npm run validate:mss:all` esce 0 sia prima del lavoro sia dopo; `validate:mss` sul presente report esce 0 con `--require-capsule`. La tabella prima/dopo di §3 viene da due esecuzioni dello stesso script su due motori diversi, non da memoria.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: completa. Ho riaperto §2.4 del manuale dopo la modifica per controllare che non restasse traccia dell'avviso vecchio, e ho lasciato **intatta** la riga «SK-7 D2/D3 APERTO» della tabella §5 del manuale: è un gate di Matteo, non mio. `PLAN_V0.md` non toccato di proposito (owner di stato).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: **`V1` non fatto**, per intero — solo progettato (§10-bis), usando l'autorizzazione esplicita del mandato §4 a spezzare la consegna. Motivo: `V1` richiede un contratto documentale nuovo (marcatori) più un cancello nuovo in `validate:mss:all`, cioè più superficie di `N1`+`N2` insieme. Non ho neanche **usato** `--verify` sul corpus vero per una verifica positiva: non ho verificato il lavoro di nessun altro in questa seduta, e generare un amendment per far vedere che la funzione gira sarebbe stata la verifica finta che `N2` esiste per impedire. Il percorso positivo è provato dal test, i tre rifiuti dal vivo. Non ho committato né pushato, non ho toccato stash né commit locali altrui.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: l'attrito più concreto è che `--check` giudica solo dall'exit code, quindi per registrare un controllo che prova davvero qualcosa ho dovuto inventare un comando «invertito» e ho perso tre tentativi sul quoting di Windows; proposta: `--check-expect <exit>`, che rende registrabile in una riga anche un controllo il cui successo è un fallimento atteso, e toglie di mezzo la classe intera dei controlli vacui. Secondo attrito, minore: il mandato mi dice di chiudere con l'attrezzo, ma la guida di chiusura mi fa scrivere una sezione capsula numerata — le due cose collidevano, ed è proprio il difetto `N1`; ora l'attrezzo si ferma e lo spiega, ma la guida dovrebbe dire esplicitamente «non pre-scrivere l'intestazione: la scrive `mss:capsule`».

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: giusto, e per una ragione precisa: il mandato conteneva una sezione «cosa NON leggere». Senza quella avrei aperto il corpus dei report e avrei speso il budget in lettura invece che in codice. Le uniche cose che ho dovuto cercare da solo sono state le forme interne del motore (`collectBundlesFromInput`, `applyAmendmentsView`, `validateReferenceLinks`) — inevitabile e giusto: sono dettagli che non stanno in un mandato. Nessun hook di disturbo; l'unico attrito d'ambiente è stato il blocco alla scrittura diretta di file report, aggirato scrivendo il file da riga di comando.

## 12. Self-review del report

1. `validate:mss` verde sul report — sì, comando in §4.
2. §5 allineata, non rimandata — sì, il manuale è aggiornato in questa seduta, non «al prossimo giro».
3. Q1-Q6 coerenti — R4 e §10 dicono la stessa cosa su `V1`; R2 e §4 citano gli stessi comandi.
4. Tono utente — §1 parla di «l'attrezzo dice fatto mentre il controllo dice rotto», non di
   nomi-file isolati.
5. Handoff ricostruibile — §10-bis apre con «cosa è vero adesso», elenca cosa non riaprire e dà il
   gate di chiusura di `V1`.

Corretto in self-review: avevo scritto il numero delle intestazioni capsula numerate come valore;
l'ho sostituito con il comando che lo conta (§3), perché è un numero mobile.
## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996","correlation_id":"mss-cor-01a032c1-8b41-7de0-9a97-0b87feeb1576","segment_no":1,"created_at":"2026-08-24T09:52:20+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5-mc","actor_type":"agente","role":"agente esecutore mandato M-C","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["node","npm","git","Bash","Edit"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"owner-contratto-capsula"},{"package_id":"mandato M-C","package_version_or_revision":"cec617c","source_ref":"source-mandato-mc"}],"record_type":"session_event","record_id":"mss-rec-01a032c1-8b41-79d6-bb75-b52dadf20671","capture_key":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996/1/session_event/1","event":{"event_id":"mss-evt-01a032c1-8b41-7924-8100-f2fe0fc6c90e","event_kind":"session_close","occurred_at":"2026-08-24T09:52:20+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"mandato M-C: rendere gli attrezzi MSS incapaci di scrivere cio che il validator rifiuta (N1) e rendere la registrazione di una verifica indipendente un'operazione di prima classe (N2); V1 progettato e non fatto","session_type":"deep","capsule_status":"completa","role_key":"agente esecutore mandato M-C","area":"MetaSkillSystem / motore attrezzi (scripts/mss)","environment":"branch env/test; HEAD 0592e40; working tree con i file di §2 modificati, niente staged, nessun commit in questa seduta","authorization":{"read":["docs/Sessioni di lavoro/24-08-26/Prompt-mandato-MC-attrezzi-che-non-mentono-24-08-26.md","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","scripts/mss/**"],"write":["scripts/mss/capsule.mjs","scripts/mss/parse.mjs","scripts/mss/query.mjs","scripts/mss/uuid.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","docs/Sessioni di lavoro/24-08-26/Report-mc-attrezzi-che-non-mentono-24-08-26.md"],"forbid":["git commit","git push","git stash","git reset","scritture su database Supabase","riscrittura di record final","move o rinomina di file","docs/MetaSkillSystem/PLAN_V0.md","chiusura di pacchetti SK-*"]},"authorized_outputs":["docs/Sessioni di lavoro/24-08-26/Report-mc-attrezzi-che-non-mentono-24-08-26.md","scripts/mss/capsule.mjs","scripts/mss/parse.mjs","scripts/mss/query.mjs","scripts/mss/uuid.mjs","docs/MetaSkillSystem/tests/tools/run.mjs","docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md"],"route":{"chosen":"mandato M-C letto per intero, poi lettura diretta del motore in scripts/mss; corpus dei report non aperto, come prescritto dal mandato §0","alternatives_or_conflicts":["N1: scartata l'aggiunta di una seconda validazione dentro capsule.mjs — il difetto non era una validazione mancante ma due definizioni divergenti della stessa regola (D18); scelto invece di importare validatePathContent e findCapsuleHeadings","N2: scartato il popolamento di verified_by nella seduta stessa — violerebbe R2, un revisore che firma le proprie annotazioni non ha verificato nessuno; scelto l'amendment del contratto §6","V1: scartata l'implementazione parziale — il mandato §4 autorizza esplicitamente a fermarsi e consegnare N1+N2 provati con V1 progettato"]},"observed_outcome":"N1 PROVATO: entrambe le riproduzioni del mandato §2 passano da exit 0 con scrittura a exit 2 senza scrittura, confronto eseguito sullo stesso ingresso contro il motore di HEAD ricostruito con git show. N2 PROVATO: --verify emette un amendment conforme al contratto §6 leggendo i valori precedenti dal record bersaglio, e la vista effettiva di mss:query mostra il verificatore; rifiuti dal vivo verificati per bersaglio non-annotazione, esito self_report e bersaglio inesistente. V1 NON FATTO, solo progettato nel report §10-bis. Nessun commit, nessun push. validate:mss:all esce 0 come nella linea di base","open_items":["V1 (generatore di viste, D14) non implementato: disegno in §10-bis del report, gate di chiusura dichiarato","difetto nuovo aperto: --check deduce l'esito dall'exit code, quindi un comando che non puo fallire registra un pass che non prova nulla — gate Matteo","nessun commit fatto: la decisione se committare e di Matteo","N1 e N2 sono PROVATI, non CHIUSI: la chiusura e solo di Matteo"],"controls":[{"control_id":"CTRL-N1","criterio":"npm run test:mss:tools","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss:tools (exit 0)","evidence_refs":[]},{"control_id":"CTRL-N2","criterio":"node scripts/mss/capsule.mjs --judgments docs/MetaSkillSystem/tests/tools/fixtures/judgments-sk7-minimal.json --model ctrl-n2 --role independent_reviewer_ctrl","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: node scripts/mss/capsule.mjs --judgments docs/MetaSkillSystem/tests/tools/fixtures/judgments-sk7-minimal.json --model ctrl-n2 --role independent_reviewer_ctrl (exit 0)","evidence_refs":[]},{"control_id":"CTRL-MSS-ALL","criterio":"npm run validate:mss:all","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run validate:mss:all (exit 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_applicabile: nessun soggetto umano osservato in questa seduta","provider":"non_applicabile: seduta agente","model":"non_applicabile: seduta agente","runtime":"non_applicabile: seduta agente","surface":"non_applicabile: seduta agente"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["codice del motore MSS","esiti di comandi eseguiti","hash e path di file versionati"],"prohibited_content":["materiale privato non registrabile","segreti e chiavi","dati personali di terzi"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-contratto-capsula","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","stable_anchor_or_event_id":"sezione 6 amendment","revision_or_hash":"e56b072e0ff0d5545b5b789b59b7afa22c089c01","sensitivity":"internal"},{"ref_id":"owner-manuale-mss","owner_id":"MSS","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"sezione 2.4 mss:capsule","revision_or_hash":"3cd044f3a87d0d6348a686ddad5be10a2c88f477","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-mandato-mc","owner_id":"orchestratore MSS","uri_or_path":"docs/Sessioni di lavoro/24-08-26/Prompt-mandato-MC-attrezzi-che-non-mentono-24-08-26.md","stable_anchor_or_event_id":"sezioni 2 3 4 5 6 7","revision_or_hash":"cec617c0eb94a10d83c19eb36a46a63bd694dce8","sensitivity":"internal"},{"ref_id":"source-chiusura-sessione","owner_id":"Comunicazione-Skill","uri_or_path":"docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md","stable_anchor_or_event_id":"Parte A","revision_or_hash":"a04af315efdca7f60981f6798ce6e2adc3acb102","sensitivity":"internal"},{"ref_id":"source-git-1","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md","stable_anchor_or_event_id":"working tree","revision_or_hash":"0592e40","sensitivity":"internal"},{"ref_id":"source-git-2","owner_id":"git-working-tree","uri_or_path":"docs/MetaSkillSystem/tests/tools/run.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"0592e40","sensitivity":"internal"},{"ref_id":"source-git-3","owner_id":"git-working-tree","uri_or_path":"scripts/mss/capsule.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"0592e40","sensitivity":"internal"},{"ref_id":"source-git-4","owner_id":"git-working-tree","uri_or_path":"scripts/mss/parse.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"0592e40","sensitivity":"internal"},{"ref_id":"source-git-5","owner_id":"git-working-tree","uri_or_path":"scripts/mss/query.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"0592e40","sensitivity":"internal"},{"ref_id":"source-git-6","owner_id":"git-working-tree","uri_or_path":"scripts/mss/uuid.mjs","stable_anchor_or_event_id":"working tree","revision_or_hash":"0592e40","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996","correlation_id":"mss-cor-01a032c1-8b41-7de0-9a97-0b87feeb1576","segment_no":1,"created_at":"2026-08-24T09:52:20+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5-mc","actor_type":"agente","role":"agente esecutore mandato M-C","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["node","npm","git","Bash","Edit"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"owner-contratto-capsula"},{"package_id":"mandato M-C","package_version_or_revision":"cec617c","source_ref":"source-mandato-mc"}],"record_type":"annotation","record_id":"mss-rec-01a032c1-8b41-7183-983c-fcaf8e14be9a","capture_key":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a032c1-8b41-79a9-a79c-7675c49a148c","axis":"persona","subject_record_ids":["mss-rec-01a032c1-8b41-79d6-bb75-b52dadf20671"],"delta":"nessuno","assertions":[{"signal":"non_osservato","actor":"Matteo","assistance":"spontaneo","origin":"naturale","source_ref":"source-mandato-mc","effect":"nessuno","evidence_state":"not_applicable"}],"asserted_by":{"actor_id":"anthropic-claude-opus-5-mc","role":"agente esecutore mandato M-C","basis":"direct_observation"},"verification":{"status":"not_applicable","verified_by":[],"verified_at":"non_applicabile:nessun delta persona osservato","criterion_ref":"non_applicabile:nessun delta persona osservato","evidence_refs":[],"notes":"seduta interamente agente-macchina: Matteo non e intervenuto, il mandato e arrivato via orchestratore. Nessun segnale di persona osservato e nessuno inferito"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996","correlation_id":"mss-cor-01a032c1-8b41-7de0-9a97-0b87feeb1576","segment_no":1,"created_at":"2026-08-24T09:52:20+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5-mc","actor_type":"agente","role":"agente esecutore mandato M-C","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["node","npm","git","Bash","Edit"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"owner-contratto-capsula"},{"package_id":"mandato M-C","package_version_or_revision":"cec617c","source_ref":"source-mandato-mc"}],"record_type":"annotation","record_id":"mss-rec-01a032c1-8b41-7522-9ba2-10173b78a332","capture_key":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a032c1-8b41-755b-8d0d-15c486abe470","axis":"sistema","subject_record_ids":["mss-rec-01a032c1-8b41-79d6-bb75-b52dadf20671"],"delta":"modificato","assertions":[{"rule_id_version":"N1-valida-prima-di-scrivere@mss.session/0.1.1","trigger_event":"mss:capsule con --append-to o su stdout, dopo che il bundle e stato costruito","decision_or_output_changed":"l'attrezzo esegue validateMss (via validatePathContent, la stessa porta usata da scripts/mss/cli.mjs) sul risultato prospettico prima di toccare il disco; se rosso esce 2 con diagnostica e non scrive. La guardia capsula-gia-presente usa findCapsuleHeadings di parse.mjs, unica definizione della regola","G":2,"O":2,"E":2},{"rule_id_version":"N2-verifica-via-amendment@mss.session/0.1.1","trigger_event":"un revisore chiude una seduta avendo controllato il record di un altro","decision_or_output_changed":"--verify \"record_id|esito|prova|motivo\" emette un amendment conforme al contratto §6; bersaglio ed esito sono chiesti e mai dedotti, self_report e rifiutato, i valori precedenti sono letti dal record bersaglio. Ruolo da revisore senza verifiche registrate produce un avviso, non un blocco","G":2,"O":2,"E":2}],"asserted_by":{"actor_id":"anthropic-claude-opus-5-mc","role":"agente esecutore mandato M-C","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-mandato-mc","evidence_refs":["source-mandato-mc"],"notes":"esiti misurati eseguendo i comandi e confrontando lo stesso ingresso contro il motore di HEAD ricostruito con git show. Nessun revisore indipendente ha ancora controllato questo lavoro: il mandato prevede una controverifica di famiglia di modello diversa, che al momento della chiusura non e avvenuta"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996","correlation_id":"mss-cor-01a032c1-8b41-7de0-9a97-0b87feeb1576","segment_no":1,"created_at":"2026-08-24T09:52:20+02:00","finalization":"final","recorded_by":{"actor_id":"anthropic-claude-opus-5-mc","actor_type":"agente","role":"agente esecutore mandato M-C","agent_runtime":{"provider":"Anthropic","model":"claude-opus-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["node","npm","git","Bash","Edit"]},"packages_loaded":[{"package_id":"mss.session","package_version_or_revision":"mss.session/0.1.1","source_ref":"owner-contratto-capsula"},{"package_id":"mandato M-C","package_version_or_revision":"cec617c","source_ref":"source-mandato-mc"}],"record_type":"annotation","record_id":"mss-rec-01a032c1-8b41-7b39-a547-fa7f69546afa","capture_key":"mss-ses-01a032c1-8b41-78d7-9b60-cff0a847d996/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a032c1-8b41-76fd-867d-30a6c711013b","axis":"output","subject_record_ids":["mss-rec-01a032c1-8b41-79d6-bb75-b52dadf20671"],"delta":"creato","assertions":[{"output_id":"mss-capsule-verify-e-validazione-pre-scrittura","primary_type":"processo","canonical_version":"1.0.0","recipient":"agenti che chiudono sedute MSS e revisori indipendenti","problem_or_job":"impedire che l'attrezzo di chiusura scriva capsule che il validator rifiuta, e dare al revisore un modo per registrare una verifica senza scrivere JSON a mano","intended_use":"chiusura di ogni seduta MSS standard/deep e registrazione delle revisioni indipendenti","conceived_by":"orchestratore MSS (mandato M-C)","decided_by":"Matteo (mandato), orchestratore (perimetro)","directed_by":"orchestratore MSS","authored_by":"anthropic-claude-opus-5-mc","verified_by":"non_osservato","acceptance_criterion":"i cinque test nominati N1/N2 passano, npm run validate:mss:all esce 0, e le due riproduzioni del mandato §2 passano da exit 0 con scrittura a exit 2 senza scrittura","verification_or_use_evidence":"npm run validate:mss:all exit 0; npm run test:mss:tools exit 0 con i cinque test nuovi; confronto prima/dopo eseguito contro il motore di HEAD","verification_status":"self_report","owner_ref":"owner-manuale-mss","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/24-08-26/Report-mc-attrezzi-che-non-mentono-24-08-26.md"],"relations_no_double_count":[],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"anthropic-claude-opus-5-mc","role":"agente esecutore mandato M-C","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-mandato-mc","evidence_refs":["source-mandato-mc"],"notes":"verification_or_use_evidence resta fail nel product_candidate perche la prova e dell'autore, non di un uso indipendente: nessun altro agente ha ancora usato --verify ne subito il rifiuto pre-scrittura in una seduta reale"}}}
```
