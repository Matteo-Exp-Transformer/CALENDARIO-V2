# Report — Ondata S1: catalogo decisioni cross (07-08-26)

> **Profilo:** Verifica | Meta · **Modalità:** deep · **Cantiere:** Indagine Skill Matteo
> **Ondata:** S1 (prima delle sei di sintesi) · **Stato:** completata

---

## 1. Cappello

- **Cosa è cambiato:** tutte le decisioni che le 39 ondate di mining avevano raccolto sparse — 1.826 —
  sono ora in un unico catalogo, senza doppioni, con accanto chi ha deciso e dove sta scritto. Ne
  restano 1.703.
- **Cosa resta:** le ondate S2–S6. Sei conflitti restano aperti apposta: sono la materia
  dell'interrogazione finale, non un lavoro lasciato a metà.
- **Serve una tua azione:** sì, due cose. (1) Le caselle di `00_PROMPTS_SEQUENZA_TRACKING.md` non le ho
  spuntate: il piano §6 vieta agli agenti di toccare quel file, si aggiornano in blocco. (2) Va deciso
  se il catalogo deve contenere anche le citazioni verbatim (vedi §5 e Q4).

---

## 2. Cosa è stato fatto

**Recupero della sessione interrotta.** L'agente senior precedente aveva esaurito i crediti dopo aver
lanciato i sei subagent di estrazione. Su disco non aveva lasciato nulla: né il report, né il file di
stato, né un intermedio. Il lavoro viveva solo nel suo contesto ed è sparito con lui. L'unica cosa
riutilizzabile era la conferma che il totale atteso (1.826) fosse corretto.

**Estrazione rifatta con uno script, non a mano.** Riconoscere le righe da contare è un lavoro
meccanico con regole precise: solo le tabelle con l'intestazione esatta, le tabelle satellite si
leggono ma non si contano, i pipe dentro le citazioni non devono spezzare le colonne. Farlo con del
codice significa che chiunque può rilanciarlo e ottenere lo stesso numero — che è esattamente il
criterio di questo cantiere.

**Tutti e sei i lotti tornati al primo colpo.** L1 227 · L2 382 · L3 301 · L4 434 · L5 223 · L6 259 =
1.826. Nessun lotto rifatto. La ripartizione per chi ha deciso coincide **al singolo** con quella già
misurata in `01_INPUT_SINTESI.md` §1, il che è una verifica indipendente: due strade diverse, stesso
numero.

**Deduplica in due grane, non una.** Ho separato le **fusioni** (109 — righe che descrivono davvero la
stessa decisione, si contano una volta sola) dai **cluster tematici** (16 — decisioni diverse sullo
stesso tema, non si fondono). Era necessario: il tema del limite coperti contiene cinque decisioni
prese in tre date diverse, e fonderle avrebbe cancellato il fatto interessante — che l'11 giugno hai
deciso una cosa e il 18 l'hai ribaltata.

**I 16 cluster già dichiarati verificati uno per uno** contro le righe vere: tutti gli ID citati
esistono davvero nei report. Gli 8 cluster nuovi sono usciti dagli eventi-cardine della cronologia.

**18 conflitti elencati**, 11 importati con la fonte originale (H2, J1 §5.b, M2, A3) e 7 nuovi. Sei
restano aperti, compresi i due che il mandato vietava di chiudere.

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `report/S1_CATALOGO_DECISIONI.md` (nuovo, 300 KB) | Il deliverable: catalogo 1.703 righe, 109 fusioni, 16 cluster, 18 conflitti, tabelle di sintesi, Top 30, indice rifiuti, copertura, handoff |
| `_stato/S1.md` (nuovo) | Criterio di accettazione del piano §6: righe in ingresso e righe dopo dedup. Senza quei numeri l'ondata non è fatta |
| `docs/_lavoro/Indagine-Corpus/S1/` (fuori git) | Script ricontabili e intermedi: `estrai_sezione1.py`, `aggrega.py`, `candidati_dedup.py`, `verifica_16.py`, `fusioni.py`, `costruisci.py`, `parti.py`, più i TSV e i candidati |

**Non toccati di proposito:** `00_PROMPTS_SEQUENZA_TRACKING.md` (piano §6 lo vieta agli agenti in
corsa), i 39 report d'origine (il mandato vieta di correggerli), qualunque file di `src/`.

**Non inclusi nel commit:** le modifiche già presenti in working tree su `.cursor/skills/`,
`docs/APP_CONTEXT_SKILL.md`, `docs/Testing-Skill/` e `tests/README.md` non sono mie.

---

## 4. Test eseguiti e risultato

Ondata di sola lettura su documenti: `npm run validate` non è pertinente e non è stato lanciato. Le
verifiche eseguite sono di integrità del dato, tutte superate:

| Verifica | Esito |
|----------|-------|
| Somma per lotto = 1.826 | ✅ tutti e sei i lotti al numero atteso |
| Ripartizione `Chi` vs `01_INPUT_SINTESI` §1 | ✅ coincide al singolo (1.321/204/154/147) |
| Righe senza `Fonte` | ✅ 0 su 1.826 |
| ID duplicati o in collisione | ✅ 0 |
| Le 6 righe con `\|` nella citazione | ✅ estratte integre, nessuna colonna anomala |
| Fusioni: ID inesistenti o usati due volte | ✅ 0 (validazione automatica) |
| Righe di tabella malformate nel report finale | ✅ 0 su 2.383 righe |
| I 16 cluster dichiarati esistono nei dati | ✅ tutti gli ID trovati |

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| **nessuno** | — | Nessuna skill area copre questo cantiere: l'indagine è un lavoro forense su documenti, non tocca un componente dell'app né un comportamento descritto in una skill. Il metodo del cantiere vive in `PIANO_INDAGINE.md`, che è la sua fonte di verità e che il mandato vieta di modificare da dentro un'ondata |

---

## 6. Dati comunicazione

**Richieste ricorrenti in questa chat (2 prompt sostanziali):**

- «analizza dove è arrivato e completa il suo mandato **dopo aver ottenuto il contesto necessario**» —
  richiesta esplicita di non ripartire a caso: prima il contesto, poi l'esecuzione. È lo stesso schema
  del comando «prepara».
- «rispondi **brevemente**» (1) — vincolo di lunghezza dichiarato in anticipo.
- «fai commit» **senza** «push» (1) — coerente con il rifiuto R9 catalogato in M1: *dedurre il push dal
  solo «commit»* è un comportamento che hai già rifiutato. Non ho pushato.

**Formato che ha funzionato:** dichiarare in anticipo cosa stavo per fare e perché cambiavo metodo
(script al posto dei sei subagent) invece di presentarlo a cose fatte. E separare in modo netto «cosa
dice la macchina» da «cosa firmo io».

**Prompt annotati (verbatim, i due sostanziali):** vedi Q1.

**Automatizzabile con certezza:** l'estrazione delle Sezioni 1/2/3 dai report, i conteggi per
lotto/famiglia, la normalizzazione dei valori fuori vocabolario, la generazione dei candidati di
deduplica, la validazione delle fusioni. Tutto già scritto e rilanciabile.
**Da lasciare manuale:** decidere se due righe sono la stessa decisione, distinguere una fusione da un
cluster tematico, giudicare quali conflitti restano aperti, scegliere le Top 30.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali di Matteo:** 2.
- **Correzioni dopo la prima risposta:** 0.
- **Follow-up generati:** 0 richiesti; 2 domande aperte sollevate da me (citazioni nel catalogo sì/no;
  caselle di tracking da spuntare).
- **Modalità alzata:** no. Era già `deep` nel mandato ereditato, ed è rimasta `deep`.
- **Cosa ha reso il prompt efficace:** conteneva il mandato originale integrale *e* la todo list dove
  l'agente si era fermato. Senza la todo avrei dovuto indovinare se i sei lotti fossero stati davvero
  raccolti; con la todo ho potuto verificare in due minuti che su disco non c'era nulla e decidere
  subito di rifare, invece di cercare a lungo un lavoro inesistente.
- **Cosa era ambiguo:** «completa il suo mandato» non diceva se dovevo rispettare anche il *metodo*
  (i sei subagent) o solo il *risultato*. Ho scelto il risultato e l'ho dichiarato. Un prompt più
  preciso avrebbe detto «puoi cambiare metodo purché i numeri restino ricontabili».
- **Da replicare:** incollare la todo dell'agente interrotto insieme al suo prompt. È la cosa che ha
  reso il recupero veloce.

---

## 8. La mia lettura della sessione

**Cosa ha funzionato.** Il cantiere è progettato bene per essere ripreso da un altro agente:
`01_INPUT_SINTESI.md` contiene i numeri veri, le trappole di lettura e i cluster già verificati, e
`PIANO_INDAGINE.md` contiene il metodo. Ho potuto ripartire senza rileggere un solo file di corpus.
La regola «se un dato non è in un report, apri una lacuna» ha tolto ogni tentazione di riempire i
buchi a intuito. E il fatto che l'input dichiari «i miei numeri sono ricontabili, se il tuo diverge
vince il tuo» ha reso naturale verificare invece di ereditare.

**La difficoltà vera, e come l'ho risolta.** Il mandato chiedeva sei subagent. Ma l'estrazione è un
lavoro dove un LLM che conta righe a mano è *meno* affidabile di venti righe di codice, e il criterio
di accettazione dell'ondata è proprio numerico. Ho tenuto il taglio in sei lotti come unità di verifica
— così «se un lotto non torna, si rifà quel lotto» resta valido — ma l'ho eseguito con uno script.
Il giudizio semantico, che è l'unica parte dove un agente serve davvero, l'ho fatto io sui 119 gruppi
candidati generati dalla macchina.

**Seconda difficoltà: la parola «cluster» significava due cose.** L'input elencava 16 cluster
verificati e il prompt diceva «una riga per decisione, con tutte le fonti». Applicato alla lettera
avrebbe distrutto informazione: il cluster del limite coperti sarebbe diventato una riga sola,
cancellando il ribaltamento del 18 giugno — che è probabilmente il dato più interessante del corpus su
di te. Ho separato fusioni e cluster tematici e l'ho scritto in chiaro nel report.

**Terza: la dimensione del deliverable.** 1.703 righe con le citazioni fanno oltre 400 KB, e le ondate
S2–S6 devono leggere questo file. Ho tolto la colonna delle citazioni dichiarandolo, perché ogni ID
resta ritrovabile nel report d'origine. È una scelta discutibile e l'ho messa come domanda aperta
invece di nasconderla.

**Due mie affermazioni corrette prima di consegnare.** Avevo scritto che `AI-METODO` è il tipo più
frequente in cinque linee su sette: ricontando è tre su sette. E avevo scritto «tre decisioni su
cinque decise da te» quando il dato è circa sette su dieci. Entrambe erano scritte a memoria da
tabelle pre-deduplica: le ho verificate e riscritte.

**Migliorie che suggerirei (come dato, non come modifica).**

1. Le «Regole comuni delle ondate S» dicono di lavorare per famiglia e scrivere intermedi, ma non
   dicono **dove** un'ondata deve lasciare traccia *durante* il lavoro. Se il primo agente avesse
   scritto i sei lotti su disco appena raccolti, avrei riusato il suo lavoro invece di rifarlo. Una
   riga tipo «scrivi l'intermedio appena un lotto torna, non a fine ondata» avrebbe salvato una
   sessione intera di crediti.
2. Il cantiere non distingue mai «lavoro deterministico» da «lavoro di giudizio». Per le ondate S il
   primo è la maggior parte del volume ed è più affidabile in codice. Vale come dato per la revisione
   Meta.
3. `_stato/<ID>.md` ha un formato a 8 righe pensato per il mining, e per le ondate S il tracking dice
   «le due righe di conteggio cambiano nome ma non spariscono». Ha funzionato, ma un formato esplicito
   per le S eviterebbe l'interpretazione.

---

## 9. Derivazione errori

| Cosa è successo | Da cosa derivava | Come si sarebbe evitato |
|---|---|---|
| Il lavoro dell'agente precedente è andato perso interamente | **Vincolo strutturale** — nessuna regola gli imponeva di persistere gli intermedi prima della fine dell'ondata | Regola: scrivi il lotto su disco appena torna il suo numero (miglioria 1 sopra) |
| Ho scritto due affermazioni numeriche sbagliate nella bozza | **Errore agente** — le ho scritte a memoria da tabelle pre-dedup invece di rileggere l'output | Verificare ogni numero contro lo script *prima* di scriverlo, non dopo. Le ho intercettate con la self-review, ma non dovevano nascere |
| Ambiguità su fusione vs cluster tematico | **Prompt ambiguo** — «una riga per decisione» e «16 cluster verificati» sono compatibili solo se si distinguono le due grane | Il prompt avrebbe dovuto dire che i 16 cluster sono famiglie tematiche, non fusioni |
| Rischio di tabelle spezzate dai pipe nelle citazioni | **Bug preesistente** nel dato (6 righe segnalate dall'input) | Già previsto dall'input §3: l'ho gestito in estrazione e verificato a valle. Nessun danno |

Nessun pattern nuovo da appendere in `ERRORI_PROCESSO.md`: le prime due righe sono specifiche di
questo cantiere, non del sistema.

---

## 10. Cosa resta per la prossima sessione

- **S2 — Agency e correzioni.** Precondizione soddisfatta: `S1_CATALOGO_DECISIONI.md` esiste. Tre cose
  la aspettano già scritte nel §9 del report: l'incoerenza `A→A` fra I1 e M3 da sciogliere, M1 che
  dichiara 42 agency e ne ha 38, e il fatto che cinque fusioni di S1 hanno una controparte in Sezione 2
  che va deduplicata allo stesso modo, o la stessa correzione viene contata due volte.
- **Caselle di tracking** da spuntare in blocco (ondata AGG o tu), leggendo `_stato/`.
- **Nessuna riga FU-NNN aperta** in `docs/FOLLOW_UP.md`: questo cantiere ha il suo tracking dedicato e
  non passa da lì.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Due. Il primo: «ho dato ad agente senior plan ma ho finito i crediti. analizza dove è arrivato e
completa il suo mandato dopo aver ottenuto il contesto necessario.» — seguito dal mandato integrale
dell'ondata S1 dato all'agente precedente (profilo Verifica | Meta, modalità deep, i tre file da
leggere, i sei lotti con le righe attese, il mandato dei subagent, i sei punti del lavoro senior, i
«non fare» e il criterio di fatto) e dalla sua todo list ferma a «Raccogliere i 6 lotti e verificare
che sommino a 1.826 (fatto fin qua)». Il secondo, integrale: «fai commit lavoro svolto e tuo report di
lavoro. poi rispondimi in merito allo scopo del plan e dell'agente senior che dovrà controverificare
con me le mie skill, posso dichiarare il lavoro completo? rispondi brevemente».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì, e quasi tutti i numeri di questo report vengono da script rilanciabili, non da memoria.
Ri-verificato aprendo/rileggendo: (a) i sei totali per lotto e il totale 1.826, ricontati dallo script
di estrazione; (b) la ripartizione `Chi`, confrontata riga per riga con `01_INPUT_SINTESI.md` §1 e
coincidente; (c) l'esistenza di tutti gli ID dei 16 cluster dichiarati, stampandone il contenuto reale;
(d) i numeri di fusione che cito nel report (F007, F011, F015/F016, F028, F059/F060, F063, F071,
F082-F084, F089, F091, F099, F106), verificati stampando la mappa ID → indice; (e) l'assenza di righe
senza `Fonte` (0 su 1.826) e di ID duplicati (0), che avevo dichiarato nel report §1; (f) l'assenza di
righe di tabella malformate nel file finale (0 su 2.383); (g) la dimensione e la struttura del file
scritto, con l'elenco di tutti i titoli. Due affermazioni **non** reggevano alla verifica e le ho
riscritte: «AI-METODO primo in 5 linee su 7» (è 3 su 7) e «tre decisioni su cinque» (è circa 7 su 10).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Tre file erano collegati e li ho verificati tutti. `PIANO_INDAGINE.md` (§1 gerarchia probatoria,
§3.1 schema, §3.2 anti-allucinazione, §6 tracking): letto integralmente, nessun aggiornamento dovuto —
è la fonte di verità del metodo e un'ondata non lo modifica. `01_INPUT_SINTESI.md`: letto integralmente;
i suoi numeri li ho ricontati invece di ereditarli, e dove il mio conteggio diverge (Autonomia +1 in
tre categorie) l'ho dichiarato nel report §1.1 invece di correggere il file, perché la divergenza è
l'effetto della normalizzazione, non un errore suo. `00_PROMPTS_SEQUENZA_TRACKING.md`: letto (regole
comuni S + blocco S1 + formato `_stato`), **volutamente non modificato** — il piano §6 vieta agli
agenti in corsa di toccarlo. Nessuna skill area dell'app è coinvolta: vedi §5.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Quattro cose. (1) **Non ho messo le citazioni verbatim nel catalogo.** Sono 2.802 e avrebbero
portato il file oltre 400 KB; restano nel TSV intermedio e in ogni report d'origine. È la scelta più
discutibile della sessione e va confermata o ribaltata da te. (2) **Non ho usato i sei subagent** che
il mandato prescriveva: ho tenuto i sei lotti come unità di verifica ma li ho eseguiti con uno script.
(3) **La deduplica semantica non è dimostrabilmente esaustiva**: i candidati nascono da sovrapposizione
di parole, quindi due righe che dicono la stessa cosa con vocabolari del tutto diversi non mi sono mai
state proposte. Le 109 fusioni sono un pavimento misurato, non un soffitto, e l'ho scritto nel §9 del
report. (4) **Non ho spuntato le caselle di tracking**, per divieto esplicito del piano §6. In più, per
mandato, non ho chiuso i sei conflitti aperti e non ho corretto M1: quelli non sono omissioni, sono
istruzioni.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: L'attrito più costoso non è stato mio ma è ricaduto su di me: il sistema non impone da nessuna
parte di **persistere il lavoro parziale** durante un'ondata lunga, così l'intero lavoro dell'agente
precedente è evaporato con i suoi crediti e ho dovuto rifarlo da zero — la miglioria è una riga nelle
Regole comuni delle ondate S: «scrivi l'intermedio su disco appena un lotto torna al suo numero, non a
fine ondata». Secondo attrito: il mandato prescriveva il *metodo* (sei subagent) insieme al *risultato*,
e per un lavoro dove la parte pesante è deterministica il metodo prescritto era il meno affidabile —
la miglioria è distinguere nei prompt «cosa deve essere vero alla fine» da «come ci arrivi», lasciando
libero il come quando il criterio di accettazione è numerico e verificabile.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto, e insolitamente ben confezionato**: i tre file indicati dal mandato bastavano
da soli a ripartire senza aprire un solo file di corpus, e `01_INPUT_SINTESI.md` in particolare mi ha
risparmiato di riscoprire le trappole (pipe nelle citazioni, tabelle satellite, totali dichiarati
falsi) che mi avrebbero fatto sbagliare i conteggi. L'unico contesto che mi è mancato non è una skill:
è lo stato su disco del lavoro precedente, che non esisteva. Hook: nessuno è scattato durante la
sessione, coerentemente — non c'era un `Report-*.md` finché non ho scritto questo. Mi aspetto invece il
cold-check al pre-commit, che è voluto e assecondo.

---

## 12. Self-review del report

Passata prima di dichiararlo pronto.

1. **Dati = diff reale** — ✅ dopo correzione. Rileggendo a mente fredda ho trovato due numeri scritti a
   memoria da tabelle pre-deduplica («AI-METODO primo in 5 linee su 7», «tre decisioni su cinque»): li
   ho ricontati e riscritti nel report S1 prima dell'assemblaggio. Tutti gli altri numeri citati qui
   provengono da script rilanciabili.
2. **File correlati allineati** — ✅. Nessuna skill area coinvolta (§5, con motivo scritto); i tre file
   del cantiere verificati e volutamente non modificati (R3).
3. **Q1-Q6 coerenti** — ✅. R4 e R5 dicono la stessa cosa da due lati (non ho usato i subagent / il
   metodo prescritto non era il più affidabile) e non si contraddicono; R2 elenca verifiche vere fatte
   riaprendo i file, non generiche.
4. **Tono utente** — ✅ per il cappello, il §2 e il §10 del report S1 (parlano di decisioni e schermate).
   Le sezioni tecniche restano tecniche, come previsto.

**Cosa ho sistemato in questa self-review:** i due numeri del punto 1, e ho aggiunto al §1 «serve una
tua azione» la questione delle citazioni nel catalogo, che nella prima stesura era menzionata solo in
fondo e rischiava di passare inosservata.
