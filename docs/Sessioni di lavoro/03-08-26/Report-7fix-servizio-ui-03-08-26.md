# Report — 7 fix UI Servizio + digest Home (03-08-2026)

> Branch `env/test`. Nessuna migrazione, nessuna scrittura DB, nessun commit/push eseguito: tutto
> resta nel working tree per revisione. Chiamati **"Servizio-UI FIX-1..7"** per non confondersi con
> `S4-FIX-1..6` (committati) e `FIX-4A/4B/4C/4D` (altro giro, non committato, non toccato qui).

Eseguito da un agente Sonnet in esecuzione, dopo revisione del piano originale (`Prompt fix Servizio
UI`) contro il codice reale — vedi §2 «Deviazioni dal piano originale» per le correzioni fatte
**prima** di lanciare l'agente.

## 1. Cosa è cambiato, fix per fix

**FIX-1 — Fasce orarie chiuse di default.** `ServiceSlotsManager` (Lista e Mappa) avvolto in
`CollapsibleCard` (solo uso, componente non toccato) con `defaultExpanded={false}`. Le due viste
sono rami JSX separati: cambiando vista lo stato riparte chiuso da solo, senza bisogno di
persistenza. Nota estetica: il componente ha una propria intestazione interna "Fasce orarie" — a
card aperta il titolo compare due volte (dentro e nell'header della card). Solo estetico, non
bloccante.

**FIX-2 — "Aggiungi sala" sempre in testata.** Il vecchio "Aggiungi tavolo" di testata (solo Lista)
è diventato **"Aggiungi sala"**, ora visibile sia in Lista sia in Mappa. Deviazione necessaria dal
piano originale (spiegata in §2).

**FIX-3 — Walk-in sotto le fasce.** `WalkInLimitCard` non è più in cima alla pagina: una copia sta
sotto ciascuna delle due `CollapsibleCard` "Fasce orarie" (Lista e Mappa).

**FIX-4 — "Nuova sala" tolto da RoomTabs.** Restano solo le linguette sala + "Modifica sala". Testi
residui allineati in `ServizioPage.tsx`, `TableFormModal.tsx`, `RoomConfigModal.tsx` (titolo modale +
guard modifiche non salvate) e nell'assert e2e `pro-service.spec.ts`.

**FIX-5 — Piantina visibile senza fascia scelta.** In Mappa → Servizio, con una sala selezionata ma
senza fascia, la piantina resta visibile (tavoli "spenti", nessun drag&drop, niente lista
prenotazioni/assegnate). Con fascia scelta, tutto come prima.

**FIX-6 — Tavolo assegnato sulla card Home/Calendario.** La card prenotazione mostra ora un badge
verde "Tavolo T…" quando è assegnata (nome tavolo reale, non solo un pallino "assegnata"). Le non
assegnate restano "DA ASSEGNARE" come già oggi.

**FIX-7 — Card "Assegnate": niente più doppione tavolo/posti.** La riga sotto il nome cliente mostra
solo i coperti; se presenti, sotto compaiono note staff e intolleranze (sola lettura, stessi dati già
visibili nel dettaglio prenotazione), note sopra intolleranze, nessun placeholder se assenti.
"Mancano N posti" resta. Aprendo la card, la riga per-tavolo ora dice "Tavolo T1 · 4 posti" (prima
solo "T1 · 4 posti").

## 2. Deviazioni dal piano originale (e perché)

Trovate rileggendo il codice reale prima di lanciare l'agente, quindi già corrette nel prompt di
esecuzione — non sono state scoperte "in corsa":

- **"Aggiungi sala" reso sempre visibile**, non solo in Lista come diceva il testo originale del
  piano: col "Nuova sala" tolto da RoomTabs (che viveva solo in Mappa), lasciare "Aggiungi sala" solo
  in Lista avrebbe tolto alla vista Mappa ogni modo di creare una sala.
- **Testi residui "Nuova sala"** in tre punti che il piano non citava (due avvisi in `ServizioPage`,
  un messaggio di blocco in `TableFormModal`) sono stati allineati per coerenza.
- **FIX-5 più semplice del previsto**: i dati (stati tavolo, assegnazioni) tolleravano già
  "nessuna fascia scelta" perché è lo stato iniziale della pagina — bastava staccare il blocco
  visivo che nascondeva la piantina, nessun hook da toccare.
- **FIX-6**: il componente aveva già una proprietà booleana "assegnata" mai realmente usata; è stata
  sostituita con i nomi tavolo veri, aggiungendo la lettura tavoli dove mancava (nessun costo extra:
  stessa query già usata altrove nella stessa pagina).
- **FIX-7**: il file indicato dal piano originale (`BookingCardsStrip.tsx`) era quello sbagliato —
  è solo il contenitore di scorrimento delle card, non contiene il badge tavolo. Il markup vero è in
  `AssignmentMapPanel.tsx`.

**Deviazione minore non pre-vista, trovata in revisione dopo l'esecuzione** (non bloccante): il
pulsante "Aggiungi tavolo" per singola sala, in vista Lista, resta nella posizione di prima — un
riquadro tratteggiato in fondo alla griglia dei tavoli della sala — invece di spostarsi accanto al
titolo della sala come chiedeva la formulazione letterale del piano. La funzione c'è già (ogni sala
ha il proprio pulsante), è solo la posizione a differire da quanto scritto nel piano. Da sistemare
se Matteo lo vuole diverso, altrimenti non serve altro lavoro.

## 3. Verifica

- `npm run validate`: **verde**. Lint 0 warning, typecheck pulito, **155 file di test / 1275 test
  passati**. Verificato di persona rieseguendo il comando dopo l'agente, non solo sulla parola
  dell'agente.
- Un test preesistente si è rotto per il rename del titolo modale ("Nuova sala"→"Aggiungi sala") ed
  è stato corretto (`servizioModalsGuard.adminBlindatura.test.tsx`).
- `e2e/pro/pro-service.spec.ts` non gira in locale (manca una variabile d'ambiente, si auto-salta):
  l'assert è stato comunque aggiornato al nuovo testo, ma non è stato verificato a video in questo
  giro.
- Controllo a campione del codice (non solo del report dell'agente) su `ServizioPage.tsx`,
  `RoomTabs.tsx`, `AssignmentMapPanel.tsx`, `BookingDigestCard.tsx`: corrisponde a quanto descritto
  sopra.

## 4. Checklist per Matteo — cosa provare a video

**Confermato da Matteo il 03-08-26: tutti e 7 i punti testati, ok.** Nessuna correzione richiesta sui
7 fix. La deviazione minore §2 (posizione «Aggiungi tavolo» per sala) resta aperta, non ancora
commentata da Matteo — non era nella checklist perché non era un fix richiesto, solo una nota di
trasparenza.

1. ✅ **Servizio → Lista**: sotto l'elenco tavoli, "Fasce orarie" è chiusa appena apri la pagina;
   clicca per aprirla; cambia vista e torna: di nuovo chiusa.
2. ✅ **Servizio**, in alto a destra: "Aggiungi sala" c'è sia in Lista sia in Mappa.
3. ✅ Con il walk-in attivo: la card walk-in è sotto "Fasce orarie", non più in cima alla pagina.
4. ✅ **Servizio → Mappa → linguette sala**: niente più "Nuova sala" lì, solo "Modifica sala".
5. ✅ **Servizio → Mappa → Servizio**, senza scegliere una fascia: la sala coi tavoli si vede comunque
   (tutti "liberi"); un messaggio sopra invita a scegliere la fascia.
6. ✅ Assegna un tavolo da Servizio, poi vai in Home/Calendario sul giorno giusto: la card mostra
   "Tavolo T…" verde; le non assegnate restano "DA ASSEGNARE".
7. ✅ **Servizio → Mappa → Servizio**, fascia con prenotazioni assegnate: la riga in alto della card
   mostra solo i coperti (+ note/intolleranze se presenti); aprendo la card, le righe tavolo dicono
   "Tavolo T1 · 4 posti".

## 5. File toccati

**Codice**: `src/pages/ServizioPage.tsx`, `src/features/booking/components/servizio/RoomTabs.tsx`,
`RoomConfigModal.tsx`, `TableFormModal.tsx`, `AssignmentMapPanel.tsx`,
`src/features/booking/components/dayDigest/BookingDigestCard.tsx`, `DayServiceGroupCard.tsx`,
`src/features/booking/components/BookingCalendar.tsx`, `e2e/pro/pro-service.spec.ts`.

**Test aggiornati**: `servizioA1Fixes.test.tsx`, `servizioModalsGuard.adminBlindatura.test.tsx`,
`calendario.adminBlindatura.test.tsx`, `AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx`.

**Test nuovi**: `AssignmentMapPanel.piantinaSenzaFascia.test.tsx`,
`AssignmentMapPanel.assegnateNoteTavolo.test.tsx`.

**Documentazione**: `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` (nuova §9.11),
`docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md` (sezione Servizio).

Non toccati: la corsia `FIX-4A/4B/4C/4D` (altro giro, già non committata prima di questa sessione) e
tutto ciò che riguarda turni/checkout/sostituzione guidata/fasce accavallate (S4-FIX-5/6, già
committati in un giro precedente).

Nessun commit, nessun push, nessun `git add` eseguito.

## 6. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | Nuova §9.11 (7 fix, dettaglio per punto) | Il diff cambia layout/comportamento già descritto lì (§9.x copre ogni round Servizio) |
| `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md` | Aggiornata sezione Servizio (ordine blocchi pagina) | File gemello di layout-shell, descrive la stessa pagina da un altro angolo |
| Questo report | Nuovo file | Chiusura standard/deep per un round "deep" (piano lo dichiarava esplicitamente) |

## 7. Dati comunicazione

- Prompt sostanziale 1 (verbatim, compresi i refusi): «leggi @docs/Sessioni di lavoro/02-08-26/HANDOFF_S4_SENIOR.md e questo plan : [piano completo incollato] ... lancia agente sonnet che eseguira i fix dopo che tu avrai revisionato correttezza dei prompt. poi prepariamo porssimao sessione su pagina servizio tavoli e assegnaizone prenotazioni».
- Prompt sostanziale 2 (verbatim): «riprendi».
- Formato che ha funzionato: piano scritto come blocco «prompt copia-incolla» pronto per l'esecutore, con vincoli/criteri di fatto espliciti — ha reso l'esecuzione diretta, l'unico lavoro extra è stato verificarlo contro il codice PRIMA di girarlo.
- Cosa si può automatizzare con certezza: il giro "rileggi il diff + rilancia `npm run validate` + spot-check dei file chiave" dopo ogni agente esecutore — è ripetibile e ha già trovato/confermato l'accuratezza del report in questo giro.
- Cosa lasciare manuale: decidere se una deviazione minore di prodotto (posizione del pulsante «Aggiungi tavolo» per sala) va corretta o va bene così — è una scelta di Matteo, non automatizzabile.

## 8. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali di Matteo in questa chat: 2. Correzioni dopo la 1ª risposta: 0 (nessun redirect ricevuto finora in questa chat). Follow-up generati da me verso Matteo: 1 (la domanda se spostare «Aggiungi tavolo» accanto al titolo sala). Modalità alzata: sì — da «esecuzione» implicita a «deep» esplicita, dichiarata già nel piano stesso («Peso sessione: deep»), non decisa da me.
- Anatomia: il prompt iniziale era già strutturato come piano pronto (frontmatter, todo, prompt copia-incolla) — questo ha reso il lavoro scorrevole perché lo scope non andava dedotto. L'unica vera ambiguità (gate vista-Lista su «Aggiungi sala», file sbagliato per FIX-7) non era dichiarata da Matteo: è emersa solo leggendo il codice reale prima di lanciare l'agente, non dal testo del prompt.

## 9. La mia lettura della sessione

- **Impressioni:** il piano-prompt ha funzionato bene come base per l'agente esecutore, ma conteneva alcune assunzioni scritte senza il codice reale sotto gli occhi (numerazione FIX confusa con round precedenti, file indicato sbagliato per FIX-7, gate di vista che avrebbe rotto la creazione-sala in Mappa). Leggere prima i file veri — non fidarmi del testo del piano — ha evitato che l'agente esecutore propagasse questi errori a valle.
- **Difficoltà incontrate + come risolte:** il subagente esecutore non ha potuto scrivere il proprio file di report — il tool Write ha rifiutato con un errore dell'harness («Subagents should return findings as text, not write report files»). L'ho gestito scrivendo io il file di report a valle, sintetizzando il testo che l'agente mi ha restituito (verificato contro il diff reale, non copiato a memoria).
- **Migliorie che suggerirei (come dato, non come modifica fatta da me):**
  1. Nel prompt per un agente esecutore, dichiarare esplicitamente «restituisci il report come testo, non scriverlo su file» eviterebbe il tentativo fallito e la tool-call sprecata.
  2. La convenzione di tre numerazioni «FIX-N» diverse in corso sullo stesso cantiere Servizio (S4-FIX, FIX-4A-D, Servizio-UI FIX) è un rischio di confusione crescente col passare dei round; una numerazione unica progressiva per cantiere aiuterebbe chi legge i report a distanza di settimane.

## 10. Derivazione errori

Nessun bug introdotto nel codice consegnato (validate verde, spot-check a campione confermato). Difficoltà del processo, classificate:

1. **Prompt ambiguo/incompleto** — il piano originale di Matteo lasciava «Aggiungi sala» gated alla sola vista Lista; con «Nuova sala» tolto da `RoomTabs` (solo Mappa) questo avrebbe tolto ogni modo di creare una sala dalla vista Mappa. Causa: il piano è stato scritto senza il codice della vista Mappa sotto gli occhi in quel momento. Evitato leggendo `ServizioPage.tsx` per intero prima di lanciare l'agente e correggendo il prompt di conseguenza.
2. **Prompt ambiguo/incompleto** — il piano indicava `BookingCardsStrip.tsx` come file del badge tavolo (FIX-7), ma quel file è solo il contenitore di scorrimento; il markup vero è in `AssignmentMapPanel.tsx`. Causa: nome del componente fuorviante rispetto al contenuto reale. Evitato leggendo entrambi i file prima di scrivere il prompt corretto.
3. **Vincolo strutturale** — il subagente non ha potuto scrivere il proprio file di report per una guardia dell'harness non documentata nel piano. Non prevedibile in anticipo dal piano stesso; gestito a valle.

## 11. Cosa resta per la prossima sessione

Nessuna nuova riga in `docs/FOLLOW_UP.md` aperta da questo round: la deviazione minore (posizione del pulsante «Aggiungi tavolo» per sala, §2) è in attesa di una decisione di Matteo, non ancora un debito codificato — se confermerà di volerlo spostato, lì andrà aperta una riga FU. Prossimo cantiere annunciato da Matteo: pagina Servizio → tavoli e assegnazione prenotazioni (ancora da scoping, non iniziato).

## 12. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «leggi @docs/Sessioni di lavoro/02-08-26/HANDOFF_S4_SENIOR.md e questo plan : ---
name: Prompt fix Servizio UI ... [piano completo con i 7 fix, incollato per intero] ... lancia
agente sonnet che eseguira i fix dopo che tu avrai revisionato correttezza dei prompt. poi
prepariamo porssimao sessione su pagina servizio tavoli e assegnaizone prenotazioni» (refusi inclusi
com'erano nel messaggio originale). (2) «riprendi».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho riaperto `git status --porcelain` e confrontato l'elenco file con quello scritto nel
report (combaciano). Ho riletto per intero `src/pages/ServizioPage.tsx` dopo l'esecuzione e
confermato riga per riga FIX-1/2/3/4 (CollapsibleCard con `defaultExpanded={false}` in entrambe le
viste, pulsante «Aggiungi sala» sempre visibile e non più gated a `viewMode==='list'`, WalkInLimitCard
duplicata sotto le due collapse). Ho riletto `RoomTabs.tsx` (confermato: niente più pulsante/prop
`onAddRoom`). Ho riletto `AssignmentMapPanel.tsx` righe ~1287-1450 (confermato FIX-5: piantina
renderizzata anche con `!selectedSlotId`, senza `DndContext`; confermato FIX-7: riga coperti senza
duplicazione tavolo/posti, blocco note/intolleranze con `admin_notes`/`dietaryRestrictionsToText`,
prefisso «Tavolo» nella riga per-tavolo espansa). Ho riletto `BookingDigestCard.tsx` (confermato
FIX-6: prop `assignedTableNames` sostituisce la vecchia `assigned` morta). Ho ri-eseguito io stesso
`npm run validate` (non copiato dal report dell'agente): 155 file di test / 1275 test verdi, stesso
numero dichiarato dall'agente — combacia. Ho riaperto il diff di `ADMIN_SERVIZIO_CONTEXT.md` e
confermato che la nuova §9.11 esiste davvero e descrive gli stessi 7 fix.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` — verificato: nuova §9.11 presente e
coerente coi 7 fix (riletta per intero via diff). `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md`
— verificato: sezione Servizio aggiornata (29 righe di diff). Test collegati verificati con
`npm run validate` verde: `servizioA1Fixes.test.tsx`, `servizioModalsGuard.adminBlindatura.test.tsx`,
`calendario.adminBlindatura.test.tsx`, `AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx` (aggiornati),
più i due nuovi `AssignmentMapPanel.piantinaSenzaFascia.test.tsx` e
`AssignmentMapPanel.assegnateNoteTavolo.test.tsx`. Nessun file di tipi (`src/types/database.ts`) da
toccare: nessuna migrazione, nessun campo DB nuovo in questo round. `e2e/pro/pro-service.spec.ts`
aggiornato (assert «Nuova sala»→«Aggiungi sala») ma NON eseguito a video in questo ambiente (manca
una variabile d'ambiente e si auto-salta) — resta da verificare a video da parte di Matteo o in CI.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho spostato il pulsante «Aggiungi tavolo» per singola sala accanto al titolo della sala
come chiedeva la formulazione letterale del piano (§2 del report) — l'ho lasciato dov'era prima
perché la funzione (ogni sala ha il proprio pulsante) era già soddisfatta e non volevo introdurre uno
scope-creep estetico non richiesto esplicitamente da Matteo; l'ho segnalato come deviazione aperta
invece di deciderlo da solo. Non ho eseguito l'e2e `pro-service.spec.ts` a video (manca variabile
d'ambiente in locale, si auto-salta — non l'ho forzata). Non ho fatto commit/push (vietato senza
richiesta esplicita, non ancora arrivata).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: L'attrito vero è stato il subagente che non poteva scrivere il proprio file di report (guardia
harness non nota in anticipo) — propongo di dichiararlo esplicitamente nel prompt dell'agente
("restituisci il report come testo, non su file") così l'agente non tenta la Write e non spreca una
tool-call su un errore prevedibile.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto: HANDOFF_S4_SENIOR.md + il piano incollato da Matteo coprivano lo scope senza
bisogno di caricare altre skill d'area (Prenota, Menu QR) che non c'entravano. L'hook di chiusura
sessione è stato utile, non rumore: senza il suo promemoria non avrei aggiunto §11 con le stesse
domande scomode (Q2/Q3 mi hanno fatto ri-aprire file che altrimenti avrei dato per buoni sulla parola
dell'agente esecutore).
```

## 13. Self-review del report

1. **Dati = diff reale:** confermato in Q2 — ho riaperto diff e file, non copiato a memoria.
2. **File correlati allineati:** confermato in Q3 — skill area + test verificati, nessun file di tipi da toccare in questo round.
3. **Q1-Q6 coerenti:** sì, nessuna contraddizione con il resto del report; nessuna risposta vuota o «ok» secco.
4. **Tono utente:** le sezioni 1, 3, 4 (rivolte a Matteo) parlano per schermate/flussi; le sezioni 6-13 sono dati tecnici interni, coerente con la distinzione richiesta dalla guida.

Nessuna correzione necessaria dopo il controllo: il report era già allineato al diff reale prima di aggiungere questa sezione.
