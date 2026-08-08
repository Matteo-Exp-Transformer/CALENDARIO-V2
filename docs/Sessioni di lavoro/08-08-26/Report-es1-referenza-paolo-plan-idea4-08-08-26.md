# Report — `ES-1` (prima prova per prestazione), referenza Paolo, prompt `IDEA-4`

**Data:** 08-08-26 · **Sessione:** Claude Code (Opus 5) su `CalendarBackup-v2`, branch `env/test`
**Profilo:** Conduttore | Redattore · **Esito:** ✅ tre consegne su tre · `ES-1` **GRIGIO**

> ⚠️ **Datazione.** Orologio macchina **08-08-26**; i documenti del cantiere scritti nella sessione
> precedente e questa seduta portano **09-08-26**. Entrambe dichiarate, nessuna scelta in silenzio —
> stessa convenzione adottata da `PLAN_IDEA-4_SKILL_SYSTEM_08-08-26.md:1`.
>
> ⚠️ **Regime.** Le risposte, la chiave dell'esercizio e la valutazione **non sono in questo file e
> non sono su git**: stanno in `docs/_lavoro/…/Interrogazioni Valutative/`, ignorata (`.gitignore:42`).
> Qui ci sono **solo numeri, nomi di riga tecnici ed esiti di verifica sul codice** — stesso confine
> del `Report-blocco1-interrogazione-07-08-26.md`.

---

## 1. Cosa è stato fatto

Tre consegne, in quest'ordine.

1. **Valutata la bozza di referenza** che Matteo intende far confermare a Paolo, e annotata nel
   profilo recruiter come nuova **§8** (`INT_03_PROFILO_RECRUITER_v0.md`), con quattro decisioni sue
   in coda (`PAO-1…PAO-4`), ognuna con un default proposto.
2. **Scritto il prompt** per l'agente senior incaricato del plan dello skill system del binario
   (`PROMPT_IDEA-4_SKILL_SYSTEM.md`). Il plan è poi stato prodotto da un'altra sessione e approvato:
   `PLAN_IDEA-4_SKILL_SYSTEM_08-08-26.md`.
3. ⭐ **Somministrato `ES-1`**, il primo esercizio di `INT_00` **§10** — la prova per prestazione. È
   la prima volta che il cantiere misura una capacità **adesso** invece di interrogare un ricordo.

---

## 2. `ES-1` — la prima prova per prestazione, con il denominatore

**Disegno:** `Esercizi/INT_05_ESERCIZI.md` · **chiave e fonti:** `Esercizi/ES-1_CHIAVE_SIGILLATA.md`.

**Procedura rispettata, punto per punto (`INT_00` §10.3):**

| Vincolo | Come è stato rispettato |
|---|---|
| 1 — criterio fissato prima | chiave scritta **prima** della somministrazione, in un file dichiarato e non aperto da lui fino alla consegna |
| 2 — deve poter fallire | fallimento descritto prima: suggerimento necessario **oppure** falso positivo sul sano |
| 3 — ci sono i negativi | **1 stato sano su 3**, con dentro un elemento che invita al falso positivo |
| 4 — denominatore | scritto sotto |
| 5 — strumenti dichiarati prima | app dal vivo ammessa · ⛔ nessun agente |
| §9.4 — fonte primaria | ogni stato scelto **aprendo il codice**, con `file:riga` in chiave |
| §10.4 — disegno pubblico, materiale no | i tre stati scelti in seduta, non elencati in `INT_05` |

**Esito: GRIGIO.**

| | |
|---|---|
| Casi | **3** — 2 con difetto, 1 sano |
| Difetti individuati | **1 su 2**, senza suggerimenti |
| Grado del messaggio all'agente (§9.7) | **1** (dice il perché, nessun vincolo che l'agente non poteva dedurre) |
| ⭐ Falsi positivi | **0 su 1 sano** |
| Livelli mossi (asse 1) | **0** — un esercizio non muove l'asse 1 (§10.2) |
| Asse 2 | **invariato**: la riga resta `ANNOTATO` |
| Domande tolte dalla coda | **1** — `A-08`, per §9.9bis (riga contaminata, non più interrogabile) |

**Effetto sulla riga `product-auto-select card singola`:** ⛔ **non** diventa `PROVATO`; **non** scende
a documentazione di prodotto (quello è l'effetto di *fallisce*). Resta dov'è, con l'esito datato.

⭐ **Strumento dichiarato e usato:** l'app dal vivo era ammessa, ed è stata **aperta** — pagina
Prenota. Il difetto individuato è uscito da lì, non dalla descrizione del conduttore.
⛔ **Rettifica registrata:** la prima stesura di questo report e dell'handoff affermava il contrario
(*«in tutta la seduta non ha aperto niente»*). **Falsa, ritirata** su dichiarazione di Matteo. È il
**secondo errore del conduttore** in questa seduta — il primo è la descrizione parziale di uno dei tre
stati, rilevata da lui. In entrambi i casi il conduttore ha **dedotto invece di aprire o di chiedere**.
⭐ **Conseguenza sull'albero:** la frase «*in cinque sedute nessuna verifica l'ha fatta lui*» (`REV-3`)
**non è più scrivibile in quella forma**. `REV-3` non è chiuso — era una verifica sul prodotto, non su
una riga — ma si incrina per la prima volta.

### ⚠️ Difetto di disegno trovato nell'esercizio stesso

`INT_05` scriveva l'effetto sulla riga **solo per *passa* e per *fallisce***. Il grigio esiste nella
tabella degli esiti e **non ha conseguenza scritta**. L'esito è caduto proprio lì.

⛔ **Non è stato colmato a caldo** — sarebbe stato toccare il criterio dopo aver visto l'output, cioè
violare `INT_00` §10.3 punto 1, che è la regola che l'esercizio esiste per far rispettare. Scritto come
debito in `INT_05`, da chiudere **prima** di somministrare `ES-2`. Stesso buco in `ES-2` e `ES-3`.

---

## 3. Verifiche sul codice eseguite per costruire e correggere l'esercizio

Tutte con fonte aperta. Sono fatti sul prodotto, non sulla persona.

| # | Fatto verificato | Fonte |
|---|---|---|
| 1 | La regola «card singola» è reale: con **una sola modalità abilitata** la card è renderizzata come `div`, non come `button` — nessuno stato di selezione | `BookingModeCards.tsx:28,89-95` |
| 2 | Il form pubblico chiede **`Ora` in posizione 2** e **`Data` in posizione 4** (dopo il telefono) | `publicBooking/BookingFormFields.tsx:134-262` |
| 3 | Gli orari disponibili si calcolano **da data e numero di ospiti** — quindi il campo `Ora` viene prima del campo che lo determina | `BookingRequestForm.tsx:110,1449` · `hooks/useArrivalSlots.ts:50` |
| 4 | Il calendario pubblico disabilita **solo** i giorni passati e oltre un anno: i giorni di chiusura restano selezionabili, e l'avviso nasce **dopo** il click | `BookingPublicDateTimePickers.tsx:267` · `:142-160` (nessuna prop orari) · `BookingFormFields.tsx:88-97` |
| 5 | La prop `minTime` del selettore orario è **ricevuta e mai usata** (`minTime: _minTime`), pur essendo documentata come blocco delle ore passate | `BookingPublicDateTimePickers.tsx:304,315-316` |
| 6 | Il riquadro «Nessun orario disponibile per questa data» compare quando **tutte** le fasce tornano vuote — comportamento atteso col limite coperti acceso | `BookingPublicDateTimePickers.tsx:383-387` · `useArrivalSlots.s3.test.tsx:43-47` |
| 7 | **Anticipo minimo per prenotare: default 60 minuti, console-tunable** | `features/booking/lib/restaurantSettingRegistry.ts:86` |

### ⚠️ Riga di lavoro sul prodotto, aperta da questa sessione — NON risolta

**Se un tenant non ha configurato gli orari di apertura, il controllo del giorno di chiusura sul form
pubblico si spegne in silenzio e la prenotazione passa.** `BookingFormFields.tsx:78`
(`if (!businessHours || isLoadingHours || hoursError) return null`) e `:91` escono senza errore;
`src/lib/businessHours.ts:226` dichiara lo «stato neutro» come fallback. Non è stato trovato nessun
cancello che nasconda la pagina pubblica in quel caso.

⚠️ **Confine di ciò che è stato verificato:** il flusso di prenotazione e il registry delle
impostazioni. **Non** l'intera catena di routing pubblico. Da confermare prima di trattarlo come bug.

⛔ **Nessun file di `src/` è stato modificato in questa sessione.**

---

## 4. Referenza Paolo — cosa è stato prodotto

Annotazione in `INT_03_PROFILO_RECRUITER_v0.md` **§8**, stato `DA DEFINIRE`. Contenuto e testo della
bozza restano in `_lavoro/`. Qui solo la forma dell'esito:

- **1 verdetto** — è una referenza di stima (`OPINIONE` per `INT_00` §1), non una prova; **non nomina
  l'episodio** per cui il referente serve.
- **3 correzioni** proposte, di cui **1 bloccante**: una frase della bozza confliggerebbe con una
  riga già dichiarata **NON DICHIARABILE** nello stesso profilo (conflitto `I-8`, aperto).
- **1 vincolo di disegno** che deriva dalla decisione già presa («il referente non si chiama»): il
  documento va ottimizzato per reggere una **telefonata a freddo mesi dopo**, non per essere firmato.
- **2 lacune** che nessuno dei due oggetti copre oggi.
- **4 decisioni sue**, `PAO-1…PAO-4`, ognuna con un default proposto.

⭐ **Una verifica economica messa in coda e non ancora fatta:** gli **undici anni** reggono l'asset n.3
del profilo e oggi non sono verificati da nessuna fonte (`REGISTRO_RIGHE_APERTE.md` riga 8). Si
chiudono con la **strada 3** di `INT_00` §9.8 (artefatto sopravvissuto: contratto, buste paga, CUD) e
**non dipendono da terzi**.

---

## 5. `IDEA-4` — prompt consegnato, plan ricevuto e riletto

**Prodotto:** `PROMPT_IDEA-4_SKILL_SYSTEM.md` (§0-§10: mandato, ordine di lettura, inventario
rifatto a comando, vincoli duri, schema per-WP, decisioni con default, criterio di giudizio).

**Ricevuto e riletto:** `PLAN_IDEA-4_SKILL_SYSTEM_08-08-26.md`, approvato da Matteo per l'esecuzione,
`SS-1…SS-5` chiusi sui default, prossimo eseguibile **`WP-1`**.

⚠️ **Come il plan è stato prodotto — rettifica rispetto alla prima stesura di questo report, su
dichiarazione di Matteo.** Non è l'output di un agente su un prompt: è una **catena a quattro
passaggi con lui dentro**. (1) Sessione di lavoro **con** l'agente senior, in cui **lui autorizza
esplicitamente lo spostamento dei file** per sciogliere un conflitto che il senior aveva rilevato fra
la dichiarazione del prompt e come doveva venire il prodotto finito rispettando tutte le regole;
(2) sessione di **upgrade** del plan; (3) **validazione da un secondo modello** in Cursor;
(4) validazione finale da un terzo, che ha trovato i tre difetti di §5 qui sotto.

⭐ **La premessa del prompt è stata corretta dentro quella catena.** Il prompt vietava gli spostamenti
perché le citazioni `file:riga` si romperebbero; **contate, sono 34 — poche**, e la ragione vera è
un'altra: la separazione strumento/soggetto **taglia dentro i file, non fra i file**. Con il permesso
di spostare **già concesso**, la conclusione è stata comunque di non spostare — che è il segno che la
decisione ha retto su un argomento e non su un divieto.

⭐ **Il dato metodologico, a doppio taglio:** i tre difetti elencati sotto sono passati **attraverso
due validazioni precedenti**. La catena multi-passaggio alza la qualità **e non sostituisce l'ultimo
lettore**.

⭐ **Undicesimo caso di `MET-2`, dentro il file vincolante:** `INT_00_PROTOCOLLO.md:248` dice «**otto**
casi documentati», `INT_00:275` dice «**decimo** caso» — stesso file, 27 righe sotto. Il contatore vive
in 5 file con 3 valori (4 / 8 / 10).

**Tre rilievi consegnati sul plan** (dettaglio nella risposta in chat, sintesi qui):

1. ⚠️ **Il criterio di `WP-5` contraddice la tabella di routing dello stesso plan.** «≤ 2 file aperti
   prima di dire cosa farà» contro una riga di routing che ne prescrive quattro per il Blocco 7. Così
   com'è **premia l'agente che annuncia prima di leggere**, cioè l'opposto di §9.4. Va corretto
   **prima** del collaudo: dopo non si può più (§10.3 punto 1).
2. ⚠️ **`WP-5` non fissa un tetto di ripetizioni.** «Grigio → correggi la bussola → ripeti» senza
   limite finisce sempre in «passa». Un test che si può ripetere finché non passa non misura.
3. ⚠️ **`WP-4` accetta solo se la mappa elenca «40 file».** Il numero è già scaduto — questa sessione
   ne ha aggiunto uno. Va legato al conteggio fatto a comando quel giorno, non a una costante.
4. ⚠️ **`WP-3` esclude dal bootstrap `12_Handoff_Interrogazione.md`**, che però `CONTESTO_Progetto.md`
   indica come «handoff del binario **ATTIVO**» e che oggi manda al blocco sbagliato. Collaudare con
   quella trappola armata falsa `WP-5`. Serve una riga di puntatore in testa; la correzione del
   contenuto resta `SS-5`.

**Il mandato di correzione, con il «quando», è scritto in `00_HANDOFF_UNIFICATO.md` §0 punto 4.**
⛔ Le correzioni 1, 2 e 4 vanno fatte **prima** di `WP-5`, la 3 prima di `WP-4`: `INT_00` §10.3 punto 1
(*il criterio non si tocca dopo aver visto l'output*) vale anche su di noi, e `WP-5` **è** un criterio.
✅ **`WP-1` non è toccato da nessuna delle quattro: si può eseguire subito.**

---

## 6. Igiene verificata in questa sessione

- Scritture del cantiere **solo** in `docs/_lavoro/…` (gitignored, `.gitignore:42`) e in
  `Documents\Io-Claude\Crescita professionale\` — **mai** sulla copia in `docs/Archives/`.
- **Nessun file di `src/`, nessuna migrazione, nessuna operazione DB.** Nessun MCP Supabase invocato:
  né TEST `docnnernvp`, né PROD `rwuxgvld`. **Verificato a comando:** `git diff --stat` sul repo app è
  **vuoto**; `git status --porcelain` mostra **un solo untracked**, la cartella di questo report.
- **Diff reale su `Io-Claude`:** `13_Roadmap_Complessiva.md`, **+16 / −0**, di cui **2 righe sono di
  questa sessione**; le altre 14 erano già nel working tree da sessioni precedenti, **non committate**.
  ⚠️ Conseguenza operativa: il criterio di accettazione di `WP-0` del plan `IDEA-4` («un solo file
  modificato, **+1 riga**») **non è più leggibile sul diff**, perché il tree accumula. Da tenere
  presente prima di eseguire `WP-1`.
- **Toccato un file del repo fuori dal cantiere:** `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` —
  **una riga** aggiunta al «Log idee» (append-only), non al Playbook, in rispetto della
  **PAUSA-RACCOLTA del 29-05-26** («stop a nuovi meccanismi finché non si accumulano i dati; le idee
  vanno nel Log»). ⛔ **Nulla propagato a `_skill-system-v0/`**, e il motivo è dichiarato nella voce.
- Questo report **non è stato committato**: il comando era «fai report», non «fai report finale».

---

## 7. Prossimo passo

1. ⭐ **Chiudere il debito di disegno di `INT_05`**: cosa fa il **grigio** alla riga. Va deciso
   **prima** di somministrare `ES-2`, non dopo.
2. **Correggere il criterio di `WP-5`** del plan `IDEA-4` (punti 1 e 2 di §5 qui sopra) — anche questo
   prima del collaudo, per la stessa ragione.
3. **`WP-1`** del plan: `REGISTRO_FONTI_DI_VERITA.md`. Un WP per sessione.
4. **Seduta del Blocco 7 «Al Ritrovo»** (`AR-01…AR-12`, `AR-01` già posta), con **`ES-2` in coda**.
5. Restano a Matteo: `PAO-1…PAO-4` e la verifica degli undici anni (strada 3, non dipende da terzi).

Chi conduce parte da `00_HANDOFF_UNIFICATO.md`, poi `INT_00_PROTOCOLLO.md` **per intero**, poi il file
di domande del blocco. Per gli esercizi: `INT_00` **§10** + `Esercizi/INT_05_ESERCIZI.md`.

---

## 8. Domande di chiusura (`CHIUSURA_SESSIONE.md` §11)

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Quattro. (1) *«ho lanciato agente per il plan di skill system. proseguiamo con esercizio»*. (2) *«fai report del tuo lavoro svolto e aggiorna hand off per prossima sessione di chiaccherata e interrogazione con agente senior. grazie di tutto. ( dimmi se per fare report hai tutte le indicazioni per scriverlo dettagliato come ultimo report , per rispondere a domande su come lavoro e chi sono. ) controlla anche il plan che abbiamo convalidato per lo skill system e dimmi cosa ne pensi "PLAN_IDEA-4_SKILL_SYSTEM_08-08-26.md"»*. (3) *«comunque ho aperto app proprio mi è sfuggito nel form ordine errato degli elementi ci sono arrivato dopo. ma ho guardato pagina prenota. Inoltre, il tuo prompt file è stato elaborato con me, con Agente Senior, dove gli ho detto esplicitamente che se voleva poteva anche muovere i file per risolvere un conflitto che lui aveva riscontrato tra la tua dichiarazione del prompt e come doveva venire il prodotto finito rispettando tutte le regole. Quindi abbiamo fatto una sessione di miglioramento del plan, ad upgrade. E poi l'ho fatto passare da un altro modello di cursore per farlo leggere anche a lui e validare il plan. E alla fine ho fatto fare un'ultima validazione a te, che hai trovato ulteriori difetti. in handoff segnala di correggere il plan come dici tu»*. (4) Le tre risposte all'esercizio `ES-1`: ⛔ **non riportate qui per regime** — sono materiale valutativo e stanno in `docs/_lavoro/…/Esercizi/ES-1_CHIAVE_SIGILLATA.md`. La regola di regime del cantiere batte il verbatim su un file versionato.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato a comando, non a memoria. **Repo app:** `git diff --stat` **vuoto**, `git status --porcelain` = **un solo untracked**, `docs/Sessioni di lavoro/08-08-26/` — conferma «nessun file di `src/` modificato» e conferma che `docs/_lavoro/` è davvero ignorata (non compare nonostante 3 file scritti lì). **Repo `Io-Claude`:** `13_Roadmap_Complessiva.md`, **+16 / −0**. ⚠️ **Precisazione che il report §6 non dava e che il diff impone:** di quelle 16 righe **solo 2 sono di questa sessione** (`ES-1` e i rilievi sul plan); le altre 14 erano già nel working tree da sessioni precedenti e **non committate** — quindi il criterio di accettazione `WP-0` del plan («un solo file modificato, +1 riga») **non è più leggibile sul diff**, perché il tree accumula. Da tenere presente prima di eseguire `WP-1`. **Fatti di codice di §3:** tutti e 7 riaperti in questa sessione (`BookingModeCards.tsx:28,89-95` · `BookingFormFields.tsx:134-262,78,91` · `BookingPublicDateTimePickers.tsx:267,304,383-387` · `BookingRequestForm.tsx:110,966,1449` · `useArrivalSlots.ts:50` · `useArrivalSlots.s3.test.tsx:43-47` · `restaurantSettingRegistry.ts:86`). ⛔ **Limite dichiarato:** ho letto il **codice**, non la pagina renderizzata — l'ordine dei campi è dedotto dall'ordine JSX, che è la fonte, ma non l'ho visto a video.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessun file di skill d'area, contesto, test o tipi dell'**app** è coinvolto: la sessione non ha toccato `src/`. I correlati sono del binario valutazione, e sono **cinque, tutti allineati e riletti dopo la rettifica**: `Esercizi/INT_05_ESERCIZI.md` (registro esiti + debito di disegno) · `Esercizi/ES-1_CHIAVE_SIGILLATA.md` · `00_HANDOFF_UNIFICATO.md` (§0 punti 3 e 4, blocco `ES-1`, intestazione) · `13_Roadmap_Complessiva.md` §7 · questo report. ⚠️ **Due NON allineati, per scelta dichiarata:** `INT_04_VALUTAZIONE_SESSIONI.md` — nessuna scheda a 7 criteri, perché `ES-1` è un esercizio e non una seduta (decisione mia, segnalata a Matteo); `12_Handoff_Interrogazione.md` — scaduto e non toccato, la correzione è `SS-5`. ⚠️ **Un buco vero, che dichiaro invece di nasconderlo:** ho cercato la riga `product-auto-select card singola` / `A-08` in `REGISTRO_RIGHE_APERTE.md` con `grep` e **non c'è nessun match**. La riga è tracciata in `INT_05` e nell'handoff, ma non ho stabilito dove viva nel registro — quindi non posso affermare che il registro sia allineato. Da chiudere alla prossima apertura del registro.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Quattro cose. (1) **Non ho compilato la scheda a 7 criteri** in `INT_04` — scelta motivata (esercizio ≠ seduta), ma è una scelta mia su una regola che non lo dice esplicitamente. (2) **Non ho verificato l'intera catena di routing pubblico** prima di scrivere che senza orari configurati la prenotazione passa: ho verificato il form e il registry, e ho scritto il confine nel report. (3) **Non ho localizzato la riga nel `REGISTRO_RIGHE_APERTE.md`** (vedi R3). (4) **Non ho aperto l'app a video** per confermare l'ordine dei campi renderizzato. In più, un errore vero e non un'omissione: **ho affermato un fatto falso** («non ha aperto niente»), dedotto invece che chiesto; ritirato e registrato in tre file.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: ⭐ **L'attrito ha prodotto un errore misurabile, quindi non è teorico.** Per somministrare un esercizio sul prodotto ho dovuto costruire il materiale leggendo il codice e poi **descriverlo a parole in chat**: la descrizione è risultata **incompleta**, l'interlocutore l'ha rilevata, e da lì è nata metà del pasticcio della seduta. **Proposta operativa:** per qualunque esercizio o QA che parte da una schermata reale, il materiale **non si descrive a parole** — si consegna come **rotta + stato** (`/prenota/<slug>`, quale configurazione tenant, quale sotto-stato) e, se serve, uno screenshot; e la rotta va scritta nella chiave, così un secondo agente somministra **lo stesso** stato invece di una sua parafrasi. È la stessa lezione già registrata come «gate schermata+URL» (31-05-26) applicata a un contesto nuovo: **una parafrasi di una schermata è una sintesi, e le sintesi comprimono.** Secondo attrito, minore: questo binario **non ha instradamento** — ho localizzato i file con `find` a `maxdepth 8`, ed è esattamente il problema che `IDEA-4` esiste per chiudere.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Contesto: giusto per l'app, assente per il binario.** `.claude/CLAUDE.md` instrada bene verso le skill d'area e mi ha dato subito la regola PROD e il divieto `--include-all`, che non sono serviti ma erano al posto giusto; per il cantiere valutazione non esiste nessun ingresso, e ho ricostruito l'ordine di lettura dall'handoff. **Hook: utile, e ha fatto il suo lavoro.** L'hook `stop` mi ha fatto scoprire che il report **non aveva la sezione 11** — non l'avevo scritta, e il messaggio diceva «domande compilate», quindi la rilevazione era ottimistica: se non avessi controllato a mano avrei chiuso con una sezione obbligatoria mancante. **Miglioria per M4:** quando il conteggio delle coppie `Q`/`R` è **zero**, il messaggio dovrebbe dire «trovate 0 coppie» invece di passare al testo di controllo a mente fredda — è la stessa richiesta già a log il 07-08-26, e questa è la **seconda occorrenza**. Il resto del messaggio (dati=diff, file correlati, propagazione v.0, playbook) è stato utile e ha prodotto tre correzioni reali in questa chiusura.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «leggi il plan e dimmi se hai tutti gli elementi per completarlo e se hai tutto il contesto necessario per partire a lavorare. naviga liberamente la repo.» (2) «interrogami sui default e definiamo cio che manca per procedere con esecuzione plan. agisci e ragiona come senior.» (3) «sono daccordo con tutto approvo esecuzione plan.» (4) «autorizzato a eseguire WP-1 . procedi pure» (5) hook fine-sessione: sezione Domande di chiusura incompleta su questo report — aggiungere le 6 domande e rispondere. Il corpo del report (§1–§7) documenta anche la seduta Claude Code su `ES-1` / Paolo / prompt `IDEA-4`; i prompt verbatim di *quella* seduta non sono in questa chat Cursor.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato aprendo i file (non a memoria). (a) `git -C CalendarBackup-v2 status`: untracked solo `docs/Sessioni di lavoro/08-08-26/` — **nessun** `src/` modificato, allineato a §6. (b) `BookingModeCards.tsx` 89-94: card singola = `div`, non `button` — ok. (c) `BookingFormFields.tsx:78` `if (!businessHours || isLoadingHours || hoursError) return null` — ok. (d) `INT_00:248` «Otto casi» / `:275` «decimo caso» — ok, undicesimo `MET-2` regge. (e) `INT_05_ESERCIZI.md:149-150` debito grigio senza effetto sulla riga — ok; log `ES-1` GRIGIO in coda file — ok. (f) `INT_03` §8 referenza Paolo + `PAO-*` presenti (file ~297 righe). (g) `PLAN_IDEA-4…08-08-26.md` esiste, timbrato APPROVATO. (h) ⚠️ **Stallo rispetto al corpo del report:** §5/§7 dicono «prossimo WP-1», ma `REGISTRO_FONTI_DI_VERITA.md` **esiste già** (WP-1 eseguito dopo la stesura del corpo); `13_Roadmap_Complessiva.md` ha +16 righe uncommitted (voce WP-0 «prossimo WP-1» + voci `ES-1` + rilievi plan) — la riga «prossimo WP-1» è **superata dal disco**.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area app (`PRENOTA_*`, `APP_CONTEXT`, tipi, test) da allineare: **zero** tocchi a `src/` / migrazioni. Correlati del binario privati, verificati aperti: `PLAN_IDEA-4_SKILL_SYSTEM_08-08-26.md` · `PROMPT_IDEA-4_SKILL_SYSTEM.md` · `REGISTRO_FONTI_DI_VERITA.md` (WP-1) · `INT_03` §8 · `INT_05` + `ES-1_CHIAVE_SIGILLATA.md` · `INT_00` (citazioni) · `13_Roadmap_Complessiva.md` §7 (log). Non aggiornati di proposito: `INT_00` contatore `MET-2` (attende WP post-WP-5 / `SS-5`) · effetto «grigio» in `INT_05` (debito dichiarato) · criteri `WP-5` nel plan (rilievo §5, non corretto a caldo).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non eseguiti WP-2…WP-5 (regola un WP/sessione; dopo WP-1 si ferma). Non corretta la divergenza `MET-2` in `INT_00`/handoff (`SS-5` dopo WP-5). Non chiuso il debito «effetto del grigio» in `INT_05` prima di `ES-2`. Non corretti i criteri di collaudo `WP-5` nel plan (rilievi §5). Non aggiornato il corpo §5/§7 di *questo* report allo stato post-WP-1 (solo aggiunta §11). Non commit/push (comando era report, non «report finale»). Non somministrati `ES-2`/`ES-3` né Blocco 7.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: le citazioni `file:riga` del plan su `00_HANDOFF` erano già driftate all’esecuzione WP-1 (handoff cresciuto), e il criterio di accettazione «grep = punti in tabella» falliva se si copiava alla lettera. Miglioria: nella bussola (WP-2) e nel registro, obbligatorio «prima di citare un vivo, riapri e aggiorna la riga qui» — già abbozzato in `REGISTRO_FONTI`; va ripetuto in testa alla tabella di routing così non si riesegue un plan con puntatori morti.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto: giusto per il binario crescita/valutazione (plan + handoff + due cartelle), troppo poco come «bootstrap automatico» — senza il plan aperto a mano un agente sul repo app non sa che esiste questo binario (è esattamente `IDEA-4` / WP-3). Hook fine-sessione su §11: utile, non rumore — ha forzato la ri-verifica Q2/Q3 e ha fatto emergere lo stallo «prossimo WP-1» vs registro già creato.
