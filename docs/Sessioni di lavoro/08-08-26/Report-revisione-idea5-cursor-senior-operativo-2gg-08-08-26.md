# Report — revisione finale di `IDEA-5` (8 WP Cursor + 4 disegni senior) e regole operative per due giorni senza Claude

**Data:** 08-08-26 · **Branch:** `env/test` · **Profilo:** Verifica → poi Esecuzione (allineamento)
**Modalità:** deep · **Esito:** lavoro **confermato**, ⛔ **tre falle nuove trovate** e documentazione riallineata
**Regime:** il contenuto del binario valutazione è **privato e fuori da git** (`docs/_lavoro/`). Qui su git solo metodo e numeri.

> **Cosa è cambiato per te:** sai che gli otto lavori meccanici e i quattro disegni reggono, **e sai
> dove non reggono**: la prima prova del cantiere `C8` era già bruciata prima di partire, e la cecità
> del collaudo era promessa più larga di quella che il disco può mantenere. I documenti ora dicono la
> verità su se stessi.
> **Cosa resta:** due decisioni di disegno che nessun agente Cursor può prendere (voci 28-29) e la
> verifica della riserva sigillata (voce 30), che stai chiudendo tu adesso.
> **Serve una tua azione:** sì — seguire la coda di `OPERATIVO_2_GIORNI_AGENTI_CURSOR_08-08-26.md` §3,
> una seduta per volta, e mettere da parte il transcript del collaudo per la revisione senior.

---

## ⛔ 0. Il limite di questo report, e va letto per primo

**Questa sessione non ha condotto nessuna seduta, non ha posto nessuna domanda, non ha mosso nessun
livello dell'albero.** Ha fatto due cose: **revisionato** lavoro altrui aprendo i file, e **riallineato**
i documenti che quella revisione ha trovato falsi.

⚠️ **Un file NON è stato aperto, di proposito:** `C8_RISERVA_CHIAVE_SIGILLATA.md`. Leggerlo in una chat
che Matteo legge lo brucerebbe — è materiale d'esame di cui lui è il soggetto. Quindi la regola scritta
in `C8` §7 (*«nella chiave non c'è nessun nome di mossa»*) resta oggi **dichiarata e non verificata**,
ed è la voce 30 dell'inventario.

⛔ **La controverifica imparziale prevista da `CHIUSURA_SESSIONE.md` §12 non è stata lanciata**: la
sessione ha il divieto esplicito di avviare sub-agenti senza richiesta. Dichiarato, non saltato in
silenzio. La self-review §12 è stata fatta a mano ed è in fondo.

---

## 1. Com'era la situazione quando questa sessione l'ha presa in mano

Alla chiusura della sessione precedente erano stati consegnati due artefatti (il plan meccanico per
Cursor e il prompt per il senior) e **nessun WP era stato eseguito**. Nel frattempo, mentre la
revisione era in corso, hanno lavorato:

- **gli agenti Cursor**, che hanno chiuso `WP-A`…`WP-G` **più un `WP-A2` nato in corsa** (il contatore
  `MET-2` dei casi vivi passato da 13 a 14, sulla parola di Matteo «Quattordici»);
- **l'agente senior**, che ha consegnato i quattro disegni (collaudo cieco sostitutivo · cantiere `C8` ·
  riformulazione `B-07` → `B-07bis` · ordine e ritmo delle sedute).

Mandato di questa sessione, verbatim: *«Agente Senior e Agenti Coursor hanno finito il lavoro.
Revisiona, dimmi a che punto siamo…»*.

---

## 2. Cosa è stato verificato, e con quale prova

Verifica fatta **aprendo i file**, mai leggendo i report che li descrivono — che è il metodo che il
cantiere si è dato e l'unico che avrebbe trovato le falle.

| Cosa | Esito |
|---|---|
| `WP-A`…`WP-G` + `WP-A2` chiusi e coerenti col riquadro di stato | ✅ |
| Il registro delle regole di metodo esiste e ha 4 stati non decorativi | ✅ **e si accusa da solo** (vedi §3) |
| Il buco che questa stessa sessione aveva lasciato nella specifica di `WP-A` | ✅ **chiuso meglio della specifica** (vedi §3) |
| File LOCK intatti (rubrica a 7 criteri · `S1…S6` · congelati `INT_04`/verbali) | ✅ |
| Il valore omonimo «dodici casi di merito attribuito impropriamente» **non** toccato dall'igiene | ✅ — è un'altra metrica e sembra uguale: era la trappola, non ci sono caduti |
| Ordine delle sedute, cantiere `C8` e `B-07bis` scritti nei proprietari giusti | ✅ |
| Cecità del collaudo cieco | ⛔ **falla 2** |
| Riserva di istanze di `C8` | ⛔ **falle 1 e 3** |

---

## 3. Le due cose che hanno funzionato meglio del previsto

**(a) Il registro delle regole di metodo dice di sé cose scomode.** È la contromisura al debito
*«nessuno possiede a che punto è il metodo»*, e la prova che non è decorativo è che contiene righe come
⛔ *«verifica assegnata a Matteo: **mai eseguita** — 5 sedute, 0 verifiche»* e ⛔ *«un blocco per seduta:
**violata dai costruttori**»*. **Un registro che si autoassolve non serve; questo si accusa.**

**(b) La coda di `WP-A2` ha chiuso meglio della specifica.** La sessione precedente aveva lasciato un
buco: il comando di controprova del contatore era rimasto indietro. Gli esecutori non l'hanno solo
allargato — **hanno scritto accanto perché non si stringe**, con l'esempio del fallimento.
⭐ La lezione generalizzata: *lo stesso numero vive in tre forme («N casi», «contatore vivi = N»,
«totale vivi = N») e un pattern che ne copre una non protegge il valore.*

---

## 4. ⭐ Le tre falle, e la legge unica che le tiene insieme

### 4.1 — 🔴 La prima prova del cantiere `C8` era bruciata prima di partire

`C8` misura un divario reale: **fa la mossa e non la nomina**. Il disegno è buono — due istanze
consegnate senza nome, e una terza dopo che la regola deve coprire.

⛔ **Ma il nome della mossa e la coppia candidata erano scritti nel file di disegno**, che Matteo legge.
E prima ancora **gliel'aveva nominata il revisore stesso**, nel report della sessione precedente
(*«è la quinta istanza di `SKILL-1`… e di nuovo non l'hai nominata»*).

**Effetto concreto:** chiedergli oggi di dare un nome a quella mossa non misura se la sa vedere, misura
se ha letto. Quindi quella mossa **esce dalle tre** della condizione di chiusura, e la prima scheda deve
usare una coppia il cui **filo comune non sia mai stato scritto**.

### 4.2 — ⚠️ La cecità del collaudo era promessa più larga di quella ottenibile

Il file del collaudo dichiarava che l'agente in prova *«non sa di essere in prova»*. Ma la bussola —
il file che **ogni** agente apre — lo nomina in due punti. **Sul disco quella frase era falsa.**

⭐ Il disegno però **non cade**: i cinque controlli sono comportamentali, vanno eseguiti su un'istanza e
non si superano recitandoli. Quindi si corregge **la frase**, non l'esito — e si può, perché le
somministrazioni sono **zero**: nessun verdetto è stato ancora visto.

> ⭐ **Ed è esattamente la mossa che a `WP-5` era mancata.** Là si corresse l'artefatto e si **tenne** il
> verdetto. Qui si corregge la promessa **prima** che esista un verdetto da difendere.

### 4.3 — ⚠️ La riserva sigillata non l'ha verificata nessuno, e non è verificabile qui

La regola dice che nella riserva ci sono fatti e mai nomi di mosse. Nessuno l'ha controllata, e ⛔ non è
controllabile in una chat che Matteo legge. Serve una sessione che lui non legge — **la sta chiudendo
lui adesso**, con la procedura in tre righe dell'operativo §8.

### ⭐ La legge unica, terza forma in tre giorni

> **La risposta di una prova non deve finire in un file che chi è in prova legge.**
> Prima è finita **dentro l'oggetto testato** (`WP-5`: quattro controlli su cinque scritti in testa alla
> bussola fra due somministrazioni). Poi **dentro il file che progetta la prova** (`C8` §1 e §5). Poi
> **nei puntatori del routing** (la bussola che nomina il proprio collaudo).

⚠️ **E il difetto non è di chi esegue: è di chi scrive.** Tutte e tre le volte l'ha prodotta un agente
diligente, che stava documentando bene. **Regge la struttura, non la diligenza** — è la quarta conferma
della stessa legge in questo cantiere.

---

## 5. File toccati e perché

| File | Perché |
|---|---|
| `…\Valutazione Personale\OPERATIVO_2_GIORNI_AGENTI_CURSOR_08-08-26.md` | 🆕 **creato** — regole d'ingaggio, coda delle sei sedute, prompt d'apertura, ⏳ **scade il 10-08-26** |
| `…\Valutazione Personale\PLAN_IDEA-5_TRACCIAMENTO_METODO_08-08-26.md` | §2 voci **28-30** (le tre falle, così non si perdono) + riquadro di stato: revisione fatta |
| `…\Valutazione Personale\REGISTRO_FONTI_DI_VERITA.md` | **3 righe nuove** nel registro delle regole di metodo, di cui una 🔴 *fallita tre volte* |
| `…\Valutazione Personale\C8_NOMINARE_LE_MOSSE.md` | §1 riquadro rosso «coppia bruciata» + §5 riscritta: non è più la coppia candidata |
| `…\Valutazione Personale\COLLAUDO_CIECO_INSTRADAMENTO.md` | §1 riga «agente in prova» corretta su ciò che è vero + nota sulla decisione aperta |
| `…\Io-Claude\Crescita professionale\13_Roadmap_Complessiva.md` | §7 riga di log della revisione · §3 riga `C8`: la condizione di chiusura ora esclude la mossa bruciata |
| memoria di progetto `project_indagine_skill_matteo.md` | stato `IDEA-5` chiuso + le tre falle + la legge generalizzata |
| `docs/Sessioni di lavoro/08-08-26/Report-…-08-08-26.md` | questo report |

**Solo letti:** `00_BUSSOLA` · `00_HANDOFF` §4 · `INT_05` (`ES-3`) · roadmap §3/§7 · diff di
`EVOLUZIONE_SKILLS.md` · `git log`/`status`.
⛔ **Non aperto di proposito:** `C8_RISERVA_CHIAVE_SIGILLATA.md` (vedi §0).
⛔ **Non aperti:** `INT_00` intero, `INT_02`, mining `S1…S6`, `docs/Archives/`, `Indagine-Corpus/`.

---

## 6. Test eseguiti e risultato

**Nessun `npm run validate`, e la ragione è che sarebbe rumore:** il diff non tocca una riga di codice
applicativo — sono documenti di metodo e report di sessione.

Verifiche fatte al posto dei test:

| Controllo | Comando / azione | Esito |
|---|---|---|
| Il contatore `MET-2` è allineato nei file vivi | controprova `rg` prescritta dal registro fonti | ✅ **14** nei vivi · congelati intatti · omonimi LOCK non toccati |
| Chi punta al file del collaudo cieco | `rg` sui riferimenti in cartella A | ⛔ **2 puntatori nella bussola** → falla 2 |
| Stato reale degli 8 WP | riquadro di `PLAN_IDEA-5` + righe di log roadmap §7 | ✅ coerenti fra loro |
| I 3 report di sessione non versionati contengono dati personali? | scansione su telefoni, email, indirizzi, date di nascita, cognomi di terzi | ✅ **nessun risultato** — committabili |

---

## 7. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | ⚠️ **già modificato da `WP-G`**, non da questa sessione | la riga di playbook sulla legge di `WP-5` era il work package `WP-G`; qui viene solo **committata** |
| nessun'altra | — | nessuna skill d'area dell'app copre il binario valutazione: è instradato da `.claude/CLAUDE.md` §«Binario crescita/valutazione», che è già corretto |

**Propagazione a `_skill-system-v0/`:** ⛔ **non fatta, e non va fatta ora.** La riga di `WP-G` la
dichiara «candidato Playbook se si ripresenta su un gate di un'altra area». ⚠️ **Oggi si è ripresentata
due volte** (falle 1 e 2) — ma **stesso cantiere e stesso giorno**, quindi non è la soglia ≥2
indipendente: la promozione spetta a una sessione Meta. Il dato è registrato, la promozione no.

---

## 8. Dati comunicazione

- **Frasi ricorrenti:** «revisiona» seguito da una domanda aperta sul futuro («*posso continuare…?*»),
  poi «lavoro ok / fai report finale» per chiudere. **Stesso schema delle ultime tre sessioni:** prima
  chiede un giudizio, poi decide, poi chiude — e la decisione arriva **dopo** aver visto l'elenco.
- **Formato che ha funzionato:** le tre falle presentate **più grave per prima**, ognuna con l'effetto
  concreto («*chiedergli oggi di nominarla misura se ha letto*») invece del nome del difetto.
- **Prompt annotati (verbatim):** in §11 R1.
- ⭐ **Dato nuovo, e vale più del resto:** ha chiesto *«vediamo come me la cavo con agenti che lavorano
  nel sistema senza averlo ideato»* — che è **la somministrazione del collaudo cieco**, disegnata il
  giorno prima da un altro agente, **ri-derivata da lui senza chiamarla così**.
  ⛔ **Non gliel'ho fatto notare come nome**, per non ripetere l'errore della falla 1: è stato registrato
  come **fatto con la sua rotta**, non come etichetta.
- **Automatizzabile:** la controprova del contatore, la scansione privacy prima di committare i report,
  il confronto «riquadro di stato ↔ righe di log». **Manuale:** decidere se una falla è un caso nuovo o
  una coda di un caso esistente — oggi è stata la differenza fra «caso 15» e «stesso caso 14».

---

## 9. Analisi flusso prompt, efficienza e statistiche

- **2 prompt di Matteo**, entrambi sostanziali; nessun giro a vuoto, nessuna domanda di chiarimento
  necessaria: il primo conteneva già mandato, vincolo temporale (due giorni senza Claude) e richiesta
  di artefatto.
- **Costo della revisione:** ~12 letture mirate + 3 comandi di verifica. ⭐ **Zero letture di report
  altrui come fonte** — le tre falle sono uscite tutte da file aperti, nessuna da un riassunto.
- **Rapporto trovato/letto:** 3 falle su ~8 documenti nuovi o modificati dagli altri agenti.
  Le due più gravi stavano nei **due file scritti ieri per chiudere le falle precedenti**.
- **Efficienza dell'allineamento:** 5 file corretti, ognuno in **un solo punto**, ognuno che **rimanda**
  invece di ricopiare. ⛔ Nessun valore duplicato introdotto: era il rischio principale di una sessione
  che tocca sei documenti collegati.

---

## 10. ⭐ La mia lettura della sessione

**Il sistema ha superato la prova che contava, e non è quella che sembra.** La domanda non era «gli
agenti hanno eseguito bene?» — sì, hanno eseguito bene. Era: **quando un sistema costruito per trovare
un difetto produce lui stesso quel difetto, se ne accorge?**

Oggi la risposta è **sì, ma solo a freddo e solo da fuori**. Le tre falle sono state prodotte da agenti
diligenti che stavano documentando bene, e nessuno dei tre le ha viste sul momento. Le ha viste chi non
aveva scritto quei file. ⭐ **Questo è il dato di metodo più utile della giornata**, e vale anche per la
sua domanda su quale modello usare per revisionare: **conta più *chi non ha fatto il lavoro* che *quale
modello è*.**

**La cosa che mi ha colpito, e che è un dato su di lui.** Ha proposto da solo l'esperimento che il
sistema aveva progettato il giorno prima senza saperlo — usare agenti che non hanno ideato il sistema
per vedere se il sistema regge. ⚠️ **È la stessa forma del divario che `C8` esiste per misurare**, ed è
la ragione per cui ho registrato il fatto e **non** l'etichetta: se glielo nomino io, brucio la prova,
esattamente come è successo con la coppia candidata.

**Dove sono meno sicuro.** La proposta di spaccare la chiave in `MATERIALE` + `CHIAVE` risolve un
problema reale (in Cursor la lettura di un file lo mostra al soggetto), ma **è mia e non è collaudata**:
è entrata nel registro come «scritta, non esercitata» e la conferma o la boccia la revisione senior.
⚠️ Il rischio che vedo è che due file invece di uno aumentino la superficie su cui sbagliare, ed è
precisamente il difetto che tutto il cantiere combatte.

---

## 11. Derivazione errori

| Difficoltà | Da cosa nasceva | Come è stata risolta |
|---|---|---|
| ⛔ Rischio di bruciare la riserva verificandola | il revisore e il soggetto leggono la stessa chat | **non aperto il file**, dichiarato il buco, procedura passata a una sessione che lui non legge |
| Distinguere «falla nuova» da «coda di una falla nota» | tre difetti della stessa famiglia in un giorno | criterio applicato: **stessa causa + stesso valore = stesso caso**. Ha evitato di gonfiare il contatore a 15 |
| Correggere un criterio senza violare «il criterio non si tocca dopo l'esito» | la frase falsa stava dentro un criterio già fissato | verificato che le somministrazioni fossero **zero**: nessun esito visto → correzione lecita, con la stessa lettura usata da `INT_05` per i grigi |
| ⚠️ **Errore mio della sessione precedente, emerso oggi** | avevo nominato io la mossa nel report dell'08-08 | ⛔ non rimediabile: la mossa è bruciata. Rimediato **il metodo**: da oggi si registra il fatto con la rotta, mai l'etichetta |

---

## 12. Cosa resta per la prossima sessione

1. **Le due decisioni di disegno** (voci 28-29): quale coppia apre `C8`, e se togliere i due puntatori
   dalla bussola per recuperare la cecità piena. ⛔ Nessun agente Cursor le prende.
2. **La verifica della riserva** (voce 30) — in corso da parte sua mentre questo report veniva scritto.
3. **La coda dei due giorni**: `ES-3` (con la chiave spaccata in due) → collaudo cieco 1 su 2 →
   valutazione → Blocco 2 con `B-07bis`.
4. **Alla revisione senior:** il transcript del collaudo, le righe di log di roadmap §7, e ⭐ **ogni
   punto in cui un agente Cursor si è fermato e ha deciso lui** — quello è il dato sull'aderenza del
   sistema, e non lo registra nessuno se non lo segna.
5. ⏳ **Il file operativo si cancella o si archivia dopo il 10-08-26.** Non si aggiorna.

---

## 11. «Domande di chiusura»

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: **(1)** «*Agente Senior e Agenti Coursor hanno finito il lavoro. Revisiona, dimmi a che punto siamo e se posso continuare il lavoro di chiaccherate e interrogazioni anche con Agenti Coursor e revisionare ogni tanto con Senior che tutto stia procedendo bene ( modelli opus o fable per revisionare il lavoro e valutare funzionamento nel complesso di skill system. inoltre anche con i modelli proverò a migliorare skill system, importante è tenerne traccia in modo da lasciare ultima parola a revisione agente senior che aluto operato criteri e lavoro che io svolgo. potremmo sfruttare questa occasione per vedere come me la cavo con agenti che lavora nel sistema senza averlo ideato. Cosa ne pensi? Ho finito token Claude per due giorni sarò fermo con l'account Claude. Se può servire, crea un file operativo che mi aiuterà a gestire la situazione con agenti cursor e dettare le regole operative dei prossimi 2 giorni.*» **(2)** «*lavoro ok fai report finale lavoro svolto con cursor intanto sto chiduendo falla 3. lasciamo documentazione interamente allineata a stato reale documenti.*»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riverificati aprendo: il riquadro di stato di `PLAN_IDEA-5` (8 WP `CHIUSO`, non 7 — `WP-A2` è nato in corsa e l'ho corretto nel report prima di scriverlo); il registro delle regole di metodo (11 righe di partenza, ora **14** dopo le mie 3); il contatore `MET-2` = **14** rilanciando la controprova `rg` prescritta, con i congelati intatti e gli omonimi LOCK non toccati; i **2** puntatori al file del collaudo dentro la bussola (riga 9 e riga di routing 10b), che sono la prova della falla 2; la definizione di `ES-3` in `INT_05` (*«uno dei due report contiene una dichiarazione che non regge — chi conduce lo sa, lui no»*), che è ciò che rende necessaria la chiave spaccata; il diff di `EVOLUZIONE_SKILLS.md` (**2 righe aggiunte**, entrambe da `WP-G`, nessuna mia). ⚠️ Un numero che ho corretto in corsa: l'inventario §2 non è più a 24 voci come diceva il report precedente, è a **30**.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Il binario valutazione non ha skill d'area né test né tipi: i suoi «file correlati» sono i **proprietari** dei valori. Allineati tutti e cinque in questa chiusura, non come follow-up: `C8_NOMINARE_LE_MOSSE.md` (§1 e §5) e **la riga `C8` di roadmap §3**, che possiede la condizione di chiusura e sarebbe rimasta a promettere 3 mosse fra cui una bruciata; `COLLAUDO_CIECO_INSTRADAMENTO.md` §1; `REGISTRO_FONTI_DI_VERITA.md` (le regole nuove entrano il giorno in cui sono scritte — regola d'ingresso di quel registro); `PLAN_IDEA-5` §2, che è il proprietario dell'elenco dei lavori aperti; roadmap §7 per il log. `.claude/CLAUDE.md` verificato e **già corretto** (instrada il binario alla bussola). ⛔ `INT_00` non toccato: nessuna di queste correzioni cambia il protocollo.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Tre cose, tutte deliberate e tutte dichiarate. **(1)** Non ho aperto `C8_RISERVA_CHIAVE_SIGILLATA.md`: leggerlo qui lo brucia, quindi la sua conformità resta **non verificata** ed è la voce 30. **(2)** Non ho lanciato la controverifica imparziale di `CHIUSURA_SESSIONE.md` §12: la sessione ha il divieto esplicito di avviare sub-agenti senza richiesta, quindi ho fatto la self-review a mano — è una copertura **più debole**, e va detto. **(3)** Non ho preso le due decisioni di disegno delle falle 1 e 2 (quale coppia apre `C8`, se togliere i puntatori): sono scelte sue o del senior, e prenderle io sarebbe stato esattamente il passo che il plan vieta («*se un passo richiede di decidere, il passo è scritto male*»). ⚠️ Aggiungo una quarta, meno comoda: **non ho verificato le altre due coppie della riserva**, quindi non so se la falla 1 ne ha bruciata una o tutte.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: L'attrito vero è che **il revisore e il soggetto leggono la stessa chat**, quindi ogni verifica su materiale d'esame lo consuma — l'ho aggirato non aprendo il file, ma è una toppa, non una soluzione. **Proposta:** una convenzione di nome che renda il divieto meccanico invece che ricordato — ogni file il cui nome contiene `_CHIAVE_SIGILLATA` non si apre mai in una chat con Matteo presente, e la verifica passa per una sessione dedicata; oggi la regola c'è ma vive dentro i file, cioè **proprio dove chi deve rispettarla non guarda prima di aprire**. Secondo attrito minore: i report di sessione degli altri agenti sono comodi e **tossici** come fonte — leggerli avrebbe fatto perdere tutte e tre le falle; proposta: nell'intestazione dei report una riga fissa «⛔ questo file non è una fonte: per verificare, apri i proprietari».

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Giusto, e per una ragione strutturale:** `.claude/CLAUDE.md` instrada il binario valutazione **fuori** dal routing dell'app, quindi non è stato caricato niente di `APP_CONTEXT_SKILL.md` §0 — ~15 file di skill d'area risparmiati, nessuno dei quali sarebbe servito. Il contesto che è mancato è stato **il riassunto della sessione precedente**, che riportava l'inventario a 24 voci quando sul disco era già a 27: ho dovuto riaprire il file, e ⭐ **è la stessa legge del cantiere applicata al mio stesso contesto — la sintesi era stale, il proprietario no**. Gli hook: il promemoria su `TodoWrite` è stato **rumore** in una sessione a due mandati sequenziali e l'ho ignorato; ⛔ nessun hook di fine-chat è scattato prima che scrivessi questo report, quindi la disciplina qui è venuta dal vocabolario («fai report finale»), non dall'enforcement — che è il dato a favore di `FU-META-REPORT-1` già registrato il 07-08.

---

### 12. Self-review del report (chiusura contabile)

1. **Dati = diff reale.** ✅ Corretti in corsa **due** numeri presi dal riassunto invece che dal disco:
   «7 WP» → **8** (`WP-A2`), «24 voci» → **30**. ⚠️ Entrambi arrivavano dalla mia sintesi precedente:
   la legge del cantiere colta sul mio stesso lavoro.
2. **File correlati allineati.** ✅ Cinque proprietari corretti in questa chiusura, non rimandati.
   Il più importante è la riga `C8` di roadmap §3: possiede la condizione di chiusura.
3. **Q1-Q6 coerenti.** ✅ Q4 e §0 dicono la stessa cosa sul file non aperto e sulla controverifica non
   lanciata; Q2 e §6 riportano gli stessi numeri.
4. **Tono utente.** ✅ Le falle sono spiegate per effetto («*misura se ha letto, non se sa vedere*»),
   non per nome di file. ⚠️ Il report resta denso: è un report di metodo, e l'alternativa era perdere
   le tre falle.

**Cosa ho sistemato dopo la rilettura:** i due numeri del punto 1, e ho aggiunto a Q4 la quarta
omissione (le altre due coppie della riserva non verificate) che alla prima stesura mancava.
