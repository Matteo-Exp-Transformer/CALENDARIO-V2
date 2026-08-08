# Report — revisione `REV-1` del plan `IDEA-4` + tre decisioni di metodo (grigio · rotta+stato · igiene)

**Data:** 08-08-26 · **Sessione:** Claude Code (Opus 5) su `CalendarBackup-v2`, branch `env/test`
**Profilo:** Metodo | Redattore · **Finestra reale:** fra il report `ES-1` (18:57) e il report `WP-3` (19:26)
**Esito:** ✅ quattro fix applicati · tre decisioni di metodo chiuse · igiene su due conteggi

> ⚠️ **Datazione.** Orologio macchina **08-08-26**; i documenti del cantiere scritti in questa fase
> portano **09-08-26**. Entrambe dichiarate, nessuna scelta in silenzio — stessa convenzione di
> `PLAN_IDEA-4_SKILL_SYSTEM_08-08-26.md:1`.
>
> ⚠️ **Regime.** Risposte, chiavi degli esercizi e valutazioni **non sono in questo file e non sono su
> git**: stanno in `docs/_lavoro/…/Interrogazioni Valutative/`, ignorata (`.gitignore:42`). Qui ci
> sono **solo criteri, numeri e nomi di riga tecnici** — stesso confine degli altri report della cartella.

---

## ⛔ 0. Il limite di questo report, e va letto per primo

**Questo documento è scritto A VALLE.** La sessione che descrive si è interrotta per esaurimento
token; quando è ripresa, il plan era già eseguito, il Blocco 7 chiuso ed `ES-2` somministrato.

> ⭐ **Quindi questo file NON è una chiave sigillata, e non va usato come se lo fosse.**
> Le previsioni qui sotto sono **ricostruzioni**, non profezie: chi le scrive ha già visto una parte
> degli esiti. Sarebbe `MET-2` prodotto da noi far finta del contrario.
>
> **Ciò che è davvero sigillato sta altrove, ed è verificabile per data:** il testo dei criteri
> corretti dentro `PLAN_IDEA-4` (marcati `🔧 REV-1`), `INT_00` §10.4 e §10.4bis, e le tabelle di
> `INT_05`. **Quelli sono stati scritti prima** di vedere qualunque risultato. Questo report **li
> indica**; non li sostituisce e non li riscrive.

**Per l'agente senior che confronta:** la domanda giusta non è «*il report aveva ragione?*» ma
**«*i criteri scritti prima hanno morso, o sono stati aggirati?*»**. §5 dà i controlli, uno per uno.

---

## 1. Com'era la situazione quando questa sessione l'ha presa in mano

Stato al momento dell'apertura, **verificato aprendo i file** e non dedotto dai documenti di stato:

| Cosa | Come stava | Come lo dichiaravano i documenti |
|---|---|---|
| Plan `IDEA-4` | approvato, **con quattro difetti noti e nessuno corretto** | mandato in `00_HANDOFF` §0: «*correggere PRIMA di eseguire i WP a cui si riferisce*» |
| `WP-1` | ✅ **già eseguito** — `REGISTRO_FONTI_DI_VERITA.md` esisteva, 49 righe | ⛔ plan e handoff dicevano entrambi «*prossimo eseguibile: `WP-1`*» |
| Riga di log di `WP-1` | ⛔ **mai scritta** in roadmap §7 | — |
| Blocco 7 | 12 domande scritte, `AR-01` posta, `AR-12` bruciata → **10 residue** | ⛔ tre file dicevano «**restano 11**» |
| Debito del grigio | aperto: nessuno dei tre esercizi diceva **cosa fa il grigio alla riga** | «*la prima cosa da decidere nella prossima seduta di metodo*» |
| Attrito `R5` | segnalato dall'agente di `ES-1`, **non registrato in nessun file** | — |
| `WP-2` | 🟡 **partito in parallelo su Cursor durante questa sessione** (bussola creata alle 19:13) | — |

⭐ **Il fatto strutturale che ha orientato tutta la sessione:** i tre disallineamenti sopra sono la
**stessa famiglia** — uno stato scritto in più posti e aggiornato in uno solo. Non sono sviste
individuali: sono `MET-2`, cioè esattamente il difetto che `IDEA-4` esiste per chiudere. **La
sessione ha trovato la malattia dentro la cura.**

---

## 2. Cosa è stato consegnato

### 2.1 — I quattro fix al plan (mandato di `00_HANDOFF` §0), marcati `🔧 REV-1`

| # | Dove | Il difetto | La correzione |
|---|---|---|---|
| **1** | `WP-5`, criterio | «≤ 2 file aperti» **contraddiceva la riga 2 del routing dello stesso plan**, che per il Blocco 7 ne prescrive 4: premiava chi annuncia **prima di leggere** | si contano solo i **file di orientamento** = quelli che il routing **non** nomina. Chi obbedisce al routing ne ha **zero** |
| **2** | `WP-5`, riga «grigio» | «correggi e ripeti» **senza limite** finisce sempre in «passa» | **max 2 ripetizioni, 3 somministrazioni**; fra una e l'altra si tocca **solo la bussola** — se servisse cambiare il criterio, l'esito **è già «fallisce»** |
| **3** | `WP-4`, criterio | accettava solo con «**40 file**»: numero **già scaduto quando fu scritto** | il conteggio **si rifà a comando il giorno stesso**, e la mappa porta la sua data |
| **4** | `WP-3`, file da toccare | `12_Handoff_Interrogazione.md` **escluso**, ma `CONTESTO_Progetto.md:103` lo indica come «handoff del binario ATTIVO» e mandava al Blocco **1** | entra come **sesto file** con un riquadro in testa che ne dichiara morto lo stato (il contenuto resta `SS-5`) |

Più **sei punti** che quei fix rendevano aritmeticamente falsi: tetto 435→441 · «quattro
modifiche»→cinque · il `git status` atteso di `WP-3` · la verifica end-to-end §11 · gli snapshot di
conteggio in §2 e §Context · l'obiettivo di `WP-4`. ⛔ Nessuna riga rimossa, nessun WP riaperto.

### 2.2 — Tre decisioni di metodo, prese da Matteo in seduta

| | Decisione | Dove vive |
|---|---|---|
| **A** | ⭐ **Il grigio taglia la riga in due**, non è un mezzo voto. Un esercizio misura due cose impacchettate — *vedere* (individua senza suggerimenti) e *specificare* (vincolo di **grado 2**). Nel grigio si muove il **riconoscimento**; la **specifica resta `ANNOTATO`, con scritto perché**, e ⛔ **non esce verso un datore di lavoro** | `INT_00` **§10.4bis** · applicata in `INT_05` a `ES-1`, `ES-2`, `ES-3` |
| **B** | ⛔ **Non retroattiva.** `ES-1` **resta come registrato: nessun movimento.** Applicare a un esito già visto un criterio scritto dopo è §10.3 vincolo 1. **Costa una prova, ed è il costo giusto** | `INT_00` §10.4bis · `INT_05` |
| **C** | ⭐ **Il materiale si consegna come «rotta + stato»**, mai descritto a parole. La **rotta** (URL/sequenza di schermate + i passi che determinano lo stato) va **nella chiave sigillata**, così un secondo agente somministra **lo stesso identico stato**. ⚠️ Stato non raggiungibile dal vivo = **fuori dal materiale** | `INT_00` **§10.4** · `INT_05` «Come si legge» |

**Perché la C.** Su `ES-1` il conduttore ha **descritto** una schermata invece di consegnarla; la
descrizione era **incompleta**, Matteo l'ha rilevata, e da lì è nata metà dei guai della seduta.
È il **«gate schermata+URL»** del 31-05-26 portato su un contesto nuovo — fonte primaria **verificata
in seduta**: `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md:454`.
⭐ **La sostanza: una parafrasi di una schermata è una sintesi, e le sintesi comprimono.** Cioè
`MET-2` prodotto dal conduttore, **dentro l'esercizio che serve a scovarlo**.

⚠️ **Riempire i buchi di `ES-2` e `ES-3` era lecito** (grigio A di `ES-2` non esisteva; `ES-3` non
aveva **nessun** grigio) **perché quei due non erano ancora stati somministrati**: il criterio è stato
fissato prima di vedere qualunque output. Su `ES-1` no — ed è per questo che lì la regola non vale.

### 2.3 — Igiene, e due righe nuove nel registro delle fonti

- «Blocco 7: restano **11**» → **10** (`AR-02…AR-11`) in `00_HANDOFF` §4, `PLAN` §7 e routing riga 2,
  `00_BUSSOLA_VALUTAZIONE.md` righe 35 e 103.
- Stato reale dei WP dichiarato in testa al plan (`WP-1` fatto, **non ri-eseguire**).
- **Due righe nuove in `REGISTRO_FONTI_DI_VERITA.md`**, con proprietario:
  *domande residue del Blocco 7* → `INT_02` §7.1 · *a che punto sono i WP* → riquadro in testa al plan.
- **Intestazione proprietaria** creata in `INT_02` §7.1 con la tabella scritte/poste/bruciate/**restano**.

---

## 3. ⭐ Il fatto che questa sessione ha osservato dal vivo, e che vale più dei fix

**`00_BUSSOLA_VALUTAZIONE.md` è nata alle 19:13 con il «restano 11» già dentro** (righe 35 e 103),
copiato da §7 del plan **sei minuti prima** che quel numero venisse corretto.

> **Il file costruito per fermare `MET-2` ha ereditato `MET-2` nelle sue prime due ore di vita.**

⛔ **Non è una colpa dell'agente che ha eseguito `WP-2`**: ha copiato fedelmente la fonte che il plan
gli indicava. **È la dimostrazione, in condizioni reali, della tesi del plan** — una copia diverge
anche quando chi copia è diligente, perché diverge la fonte. È il caso più pulito del cantiere,
perché nessuno l'ha costruito.

⭐ **E c'è il controesempio, nella stessa ora:** `WP-3` è stato eseguito **dopo** il fix 4, e l'agente
Cursor ha applicato il riquadro su `12_Handoff_Interrogazione.md` **alla lettera, parola per parola**.
Verificabile: `git -C "…/Io-Claude/Crescita professionale" diff 12_Handoff_Interrogazione.md` → 6
righe aggiunte, identiche al testo del plan.

**Le due osservazioni insieme dicono una cosa sola e utile:** il sistema funziona **quando la fonte
è corretta prima della copia**, e fallisce silenziosamente quando no. **La velocità di propagazione è
di minuti.**

---

## 4. Cosa ci aspettavamo — le previsioni, in forma falsificabile

⚠️ Ricostruite a valle (§0). Ognuna dice **cosa dovrebbe essere vero** se il fix ha morso.

| # | Ci aspettavamo | Falsificata se… |
|---|---|---|
| **P1** | il verbale/log di `WP-5` distingue **file di orientamento** da file prescritti, ed elenca quali | il log riporta **solo un totale** di file aperti → il fix 1 non è entrato nella pratica |
| **P2** | il log di `WP-5` dichiara **«alla somministrazione K su 3»** | manca `K`, oppure le somministrazioni sono state **> 3** → il tetto non ha morso |
| **P3** | fra una somministrazione e l'altra è stata toccata **solo la bussola** | risultano modificati il criterio, la tabella di routing o `INT_00` fra due tentativi → l'esito **doveva già essere «fallisce»** |
| **P4** | `MAPPA_STRUMENTO_SOGGETTO.md` porta **in testa data + numero contato quel giorno**, e quel numero **non è 40** | la mappa dice «40 file», o non ha data → il fix 3 è stato aggirato |
| **P5** | il Blocco 7 si chiude con **10 domande poste** (`AR-02…AR-11`) e `AR-12` **non compare** | il verbale ne conta 11, o `AR-12` risulta posta |
| **P6** | `REGISTRO_FONTI_DI_VERITA.md` **non è stato sovrascritto**: contiene ancora le sue righe più le due aggiunte | il file risulta ricreato da zero → `WP-1` è stato rifatto nonostante l'avviso |
| **P7** | la **chiave sigillata di `ES-2`** contiene una **rotta** per ogni stato, non una descrizione | contiene solo prosa descrittiva → ⚠️ **ma vedi l'avvertenza qui sotto** |
| **P8** | il primo esito **grigio** dopo `ES-1` produce **due verdetti separati** (riconoscimento mosso · specifica `ANNOTATO` con motivo) | un verdetto unico e monolitico → la regola A è scritta ma non praticata |
| **P9** | `product-auto-select card singola` **non si è mossa** da `ANNOTATO` | risulta mossa in qualunque documento → violata la regola B |

### ⚠️ Due previsioni che potrebbero non essere testabili, e vanno dichiarate

- **`P7` — «rotta + stato» probabilmente non si applica a `ES-2`.** Il materiale di `ES-2` sono
  **3 scene di lavoro inventate** in attività che Matteo non ha mai fatto — **non hanno una rotta**,
  perché non esistono in nessun prodotto. Se la chiave di `ES-2` è descrittiva **non è una
  violazione**: significa che la regola C **non è ancora stata collaudata**. ⭐ Il suo primo test
  vero è **`ES-3`**, che usa report reali del repo.
- **`P8` — la regola del grigio potrebbe non essere ancora stata messa alla prova.** Se l'esito di
  `ES-2` non è **grigio**, il taglio in due resta **scritto e non esercitato**. ⛔ In quel caso non si
  può concludere né che funzioni né che no: si conclude che **non è stato misurato**.

---

## 5. I controlli da fare nella chat nuova, in ordine

Cinque, tutti eseguibili senza rileggere il cantiere. Il senior che confronta parte da qui.

1. **Il collaudo `WP-5` ha una riga di log con il denominatore completo?**
   Attesa: *«5 controlli, N passati, M file di orientamento, alla somministrazione K su 3»*.
   ⛔ Se dice «è andata bene», o dà solo N/5, **il criterio è stato applicato a metà.**
2. **La mappa `WP-4` ha data e conteggio del giorno?**
   Controprova in un comando: `find . -name "*.md" | wc -l` sulle due cartelle. Se il totale di oggi
   è diverso da quello scritto in mappa, **va bene**: è il comportamento previsto, purché la mappa
   dichiari la sua data.
3. **`MET-2` ha un contatore solo?** `REGISTRO_FONTI_DI_VERITA.md` lo dà oggi a **12** nei file vivi,
   con i congelati lasciati come snapshot. Rieseguire la controprova `rg` in coda al registro:
   ⛔ se compare un «otto casi» in un file **vivo**, `SS-5` non ha tenuto.
4. **Il grigio è stato esercitato o solo scritto?** Aprire `INT_05` «Registro degli esiti»: se non c'è
   nessun esito grigio dopo `ES-1`, **la decisione A è ancora una promessa** — vera o falsa non si sa.
5. **La struttura a cartelle regge?** Le tre domande secche, da porre a un agente che non ha letto
   niente: *dove sta il numero X · dove scrivo a fine seduta · quali domande restano nel Blocco N*.
   Se risponde aprendo **la bussola e il registro** e non pescando da una sintesi, la struttura
   funziona. Se ricopia un numero da un handoff, **funziona la cartella e non la disciplina**, che è
   un esito diverso e va scritto come tale.

---

## 6. I rischi che questa sessione ha lasciato aperti — dichiarati, non risolti

1. ⚠️ **Il collaudo `WP-5` non è cieco.** Chi l'ha eseguito conosceva il criterio: è il limite
   strutturale di un test somministrato da chi l'ha scritto. Non lo invalida, **ma il suo «passa»
   pesa meno di quanto sembri**, e il peso vero si vede solo su un agente che non ha mai visto il plan.
2. ⚠️ **Il fix 1 alza il tetto di tolleranza.** Escludere dal conteggio i file prescritti è corretto,
   ma rende il criterio **più facile da superare**. Se `WP-5` è passato con margine largo, va guardato
   se è merito della bussola o del criterio più morbido.
3. ⚠️ **`WP-2` è stato eseguito su una fonte che stava cambiando sotto.** La bussola va riletta a
   freddo su **tutti** i valori copiati dal plan, non solo sui due corretti a mano: nessuno ha
   verificato gli altri.
4. 🔴 **La regola «rotta + stato» non ha ancora un modello.** È scritta in `INT_00` §10.4 ma
   `_MODELLO_VERBALE.md` e le chiavi sigillate **non hanno un campo «Rotta»**. Finché non ce l'hanno,
   regge sulla diligenza di chi conduce — **che è precisamente il difetto che `REV-8` ha dimostrato
   non reggere.**
5. ⚠️ **Nessuno possiede «a che punto è il metodo».** Il registro ora ha un proprietario per i WP e
   per le domande residue, ma **non per lo stato delle regole di metodo** (quali scritte, quali
   collaudate, quali solo promesse). È la prossima riga da aprire nel registro.

---

## 7. In una riga

**Il plan è stato corretto prima di essere eseguito, tre decisioni di metodo hanno chiuso il debito
del grigio e l'attrito del materiale, e nello stesso quarto d'ora il cantiere ha prodotto la
dimostrazione dal vivo della propria tesi** — una copia che diverge in sei minuti, e una copia che
resta fedele perché la fonte era già corretta.
⛔ **Cosa NON si può ancora dire:** se il taglio del grigio e la regola «rotta + stato» funzionano.
Sono scritte. **Misurate, no.**

---

## 11. «Domande di chiusura»

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Corpo §§0–7 = sessione Claude Code (Opus) **ricostruita a valle** (token esauriti): verbatim completo non in questa chat Cursor; dai file risultano: (1) correggere plan `IDEA-4` **PRIMA** dei WP → quattro fix `🔧 REV-1`; (2) tre decisioni metodo — grigio taglia la riga · non retroattivo su `ES-1` · materiale «rotta + stato»; (3) igiene «restano 11»→**10** + stato WP in testa al plan. In questa chat Cursor: prompt formulazione idiografica · «si procedi» · hook fine-sessione che imponeva di compilare questa §11 (prima assente).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Diff git app ora: `M EVOLUZIONE_SKILLS.md` (+1) · untracked questo report + `Report-ss5-igiene-idea4-08-08-26.md`. Lavoro REV-1 in `_lavoro`/cartella B (non nel diff app). Riaperti: `INT_00` §10.4/§10.4bis · `INT_05` (ES-1 **GRIGIO**, ES-2 **FALLISCE** 2/2 bisogni · 1/1 FP) · `PLAN_IDEA-4` `REV-1` (tetto **441**, WP-3 sesto file `12_Handoff`, file orientamento, max 2 ripetizioni) · `REGISTRO_FONTI` (oggi **48** righe; report §1 citava 49 all’apertura WP-1 = snapshot) proprietari Blocco 7/`INT_02` e WP/plan · bussola Blocco 7 CHIUSO `AR-02…AR-11` · `12_Handoff` riquadro in testa · `EVOLUZIONE` ~454 gate schermata+URL · chiave `ES-2` scene **senza** rotta URL (coerente avvertenza P7) · `MET-2` vivi **12** da proprietario registro righe. P8 non esercitato: ES-2 = FALLISCE non grigio.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area prodotto (Prenota/QR/Admin). Correlati verificati: `PLAN_IDEA-4` · `INT_00` §10.4/bis · `INT_05` · `REGISTRO_FONTI` · `INT_02` · `00_BUSSOLA` · `00_HANDOFF` · `12_Handoff` · `EVOLUZIONE_SKILLS` (citazione). Rubrica 7 **LOCK** intatta. Debito §6.4 ancora vero: `_MODELLO_VERBALE`/chiavi senza campo «Rotta» strutturato. Non rifatto audit riga-per-riga di ogni valore copiato dal plan nella bussola oltre Blocco 7.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: §11 era assente — compilata ora in retroattiva. Non rieseguiti i cinque controlli «chat nuova» §5. Non aggiunto campo «Rotta» ai template. Non aperta riga «stato regole di metodo» nel registro (§6.5). Non rieseguiti i quattro fix REV-1 (già a monte). Deliverable vivo di questa chat Cursor = bozza formulazione in `Analisi/`, non un nuovo passaggio sul plan.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito = report «a valle» senza §11 finisce in Sessioni e l’hook lo lega a un’altra chat (formulazione) → Q1 ambigui / doppioni. Miglioria = sezione 11 nello stesso write del corpo (o pre-save «manca Q → non creare il file») + campo fisso «Rotta» nel template chiave appena esiste §10.4.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto metodo (plan + INT_00 §10 + INT_05 + registro fonti) **giusto** per REV-1; numeri solo da proprietario. Hook fine-sessione **utile**: ha trovato §11 assente e ha forzato la chiusura contabile.

### 12. Self-review del report (chiusura contabile)

1. Dati = file riaperti in R2. 2. Nessuna skill area app. 3. Un solo blocco Q1–Q6 (doppione rimosso). 4. Aperti espliciti in R4.
