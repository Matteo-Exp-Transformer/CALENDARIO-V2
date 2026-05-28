# Report — Revisione implementazione PWA + skill + analisi comunicazione (28-05-26)

## Cosa è stato fatto (ordine cronologico)

1. **Strutturato il piano PWA** (`docs/_lavoro/PWA_UPDATE_STRATEGY_PLAN.md`) in un piano operativo,
   dopo ricognizione del codice esistente (la PWA esisteva già, non era documentato nel plan).
2. **Decisioni prese con Matteo** via domande mirate (vedi §Analisi comunicazione).
3. **Revisione del lavoro dell'agente Sonnet** che ha implementato il piano in un'altra chat.
4. **Trovato e corretto un difetto logico bloccante** nell'implementazione (vedi §Difetto).
5. **Aggiornata la skill** `APP_CONTEXT_SKILL.md` con la RULE PWA e la riga §7.2.
6. **Validato**: typecheck, lint, build tutti verdi.

## Cosa vede Mario adesso

- Dopo un deploy, quando riapre l'app la trova **già aggiornata**. Se serve completare lo
  scambio di versione all'avvio, vede per un istante una schermatina "Caricamento nuova
  versione…", poi entra sulla versione nuova.
- Se esce una versione nuova **mentre sta lavorando**, non succede nulla: niente popup, niente
  ricaricamento che gli interrompe la compilazione di una prenotazione. La versione nuova arriva
  alla riapertura.
- In produzione, aprendo la console del browser, compare la riga
  `CalendarBackup v2.0.0 | commit abc1234 | build 2026-05-28` per sapere quale versione è online.
  In futuro, per pubblicare la "2.1" basta cambiare il numero `version` nel `package.json`.

## Difetto trovato nell'implementazione dell'agente (corretto)

L'agente aveva lasciato `registerType: 'autoUpdate'` nella config PWA, ma scritto in
`src/main.tsx` una logica che presuppone il contrario (nuovo SW che resta in attesa).
Conseguenza: con `autoUpdate`, il service worker generato faceva `skipWaiting()`
**incondizionato** — si attivava da solo subito, anche durante la sessione. Il codice che
mostrava la schermatina e gestiva lo scambio "solo al riavvio" era di fatto **morto** (non
scattava mai), e il `postMessage({type:'SKIP_WAITING'})` era inerte perché il SW generato non
ascoltava quel messaggio.

In parole semplici: la macchina era impostata per "aggiorna sempre appena puoi", ma il manuale
allegato diceva "aggiorna solo quando riavvii". Le due cose si annullavano.

**Correzione applicata:**
- `vite.config.ts`: `registerType: 'prompt'` + `workbox.skipWaiting: false` + `clientsClaim: false`.
  Ora il SW nuovo resta in attesa e si attiva solo quando glielo chiediamo noi.
- `src/main.tsx`: `onNeedRefresh` vuoto (niente interruzioni in sessione); `onRegisteredSW`
  controlla all'avvio se c'è una versione in attesa → mostra splash + `updateSW(true)` (scambio
  + reload una volta sola). Tolti `postMessage`/`controllerchange` manuali (fragili).
- Verificato nel `dist/sw.js` rigenerato: `skipWaiting()` ora parte **solo** alla ricezione del
  messaggio `SKIP_WAITING`, non più all'avvio incondizionato.

Il resto del lavoro dell'agente era corretto e l'ho mantenuto: iniezione versione/commit/data
in `vite.config.ts`, tipi globali in `vite-env.d.ts`, cache header in `vercel.json`
(`immutable` su `/assets/*`, `no-cache` su html/sw/manifest), splash in `index.html`.

## File toccati e perché

| File | Modifica |
|------|----------|
| `vite.config.ts` | `registerType: 'prompt'` + `skipWaiting/clientsClaim: false` (fix difetto) |
| `src/main.tsx` | Logica SW riscritta con `onRegisteredSW` + `updateSW(true)` (fix difetto) |
| `docs/APP_CONTEXT_SKILL.md` | Nuova RULE PWA in §4 + riga in tabella §7.2 |
| (invariati, già OK dall'agente) | `index.html`, `vercel.json`, `src/vite-env.d.ts` |

## Test eseguiti

- `npm run typecheck` — OK
- `npm run lint` — OK
- `npm run build` — OK (versione iniettata, sw.js corretto verificato a mano)

## File di skill aggiornati

| Skill | Cosa è cambiato |
|-------|-----------------|
| `APP_CONTEXT_SKILL.md` | Aggiunta RULE PWA/aggiornamento app (§4): invarianti su `prompt`, no `autoUpdate`, cache header, no-cache Supabase, versioning. Aggiunta riga tabella §7.2 che mappa i file PWA → questa RULE. |

## Cosa resta per la prossima sessione

- **Verifica reale post-deploy**: dopo il merge su `main` e il deploy Vercel, controllare in
  DevTools → Network che `index.html`/`sw.js` siano `no-cache` e `/assets/*` `immutable`, e
  fare un test end-to-end del flusso "deploy → riapri → versione nuova".
- **Prima di tutto**: confermare che produzione deployi il branch corretto (il SW non rimedia a
  un deploy del branch sbagliato — vedi memoria `project_prod_main_lag_026`).
- File `pw-*.mjs` e screenshot di lavoro nella root: valutare se rimuoverli (residui di test
  visuali, non versionati utilmente).

---

## Analisi comunicazione — dati per automatizzare le richieste agli agenti

Questa sezione raccoglie cosa ho osservato sul modo in cui Matteo decide e chiede spiegazioni,
così da alimentare la skill comunicazione (`docs/_lavoro/Metodo_spiegazioni_agenti_coding.md`).

### Le tue risposte alle decisioni del plan

Tre domande, tre risposte che rivelano un pattern:

1. **"Cosa fare quando arriva un deploy mentre lavori?"** → *"Niente, applica al riavvio"*.
   Decisione netta, orientata a non disturbare l'operatore. Implicito: **priorità all'esperienza
   d'uso di Mario sopra l'aggiornamento immediato**.

2. **"La pagina pubblica nella stessa PWA?"** → *"sì tutta l'app è allineata anche sezione QR
   menu e future altre features o fix"*. Qui hai **esteso lo scope oltre la domanda**: non hai
   solo risposto sì/no, hai dato una regola generale ("tutto allineato, anche il futuro"). Segnale
   utile: ragioni per **principi durevoli**, non per caso singolo.

3. **"Vuoi una versione build visibile?"** → *"si commit + data. in futuro potrò visualizzare un
   numero invece che un commit tipo 2.1?"*. Hai accettato la proposta tecnica **ma proiettandola
   in avanti**: ti interessa la leggibilità futura per te, non solo il dato tecnico per l'agente.

### Che spiegazioni hai chiesto, e come

- Hai rifiutato due volte l'uscita dal plan **non per disaccordo, ma per non aver capito una
  frase tecnica**: *"cosa intendi per 'asset hashati cacheabili per sempre, ma HTML/SW
  rivalidati'? spiegami in modo semplice e sintetico"*. → Non vuoi procedere su qualcosa che non
  hai compreso, anche se è "solo" un dettaglio infrastrutturale.
- Dopo la spiegazione a blocchi (file "usa-e-getta" vs file "indice") hai fatto la domanda che
  conta davvero per te: *"ma quindi devo modificare il nome del file ogni volta? è una nuova
  rule operativa?"*. → **La tua preoccupazione ricorrente è: "questo diventa lavoro/responsabilità
  mia o lo fa la macchina?"**. Capire *chi fa cosa* ti sblocca più del capire *come funziona*.

### Cosa ti aiuta a capire (da usare come default per gli agenti)

1. **Immagini concrete** invece di termini ("file con etichetta usa-e-getta" ha funzionato; "asset
   hashati immutable" no).
2. **Separazione netta tra automatico e manuale**: dire esplicitamente "questo lo fa il tool da
   solo, tu non fai niente" toglie l'ansia operativa. È il dato che cercavi entrambe le volte.
3. **Pochi blocchi + collegamento all'effetto reale nell'app**, non spiegazione lineare lunga.
4. **Sintesi su richiesta**: quando dici "semplice e sintetico" intendi davvero corto — la versione
   lunga ti fa perdere il punto.

### Informazioni implicite che un agente può già dedurre (per automatizzare)

Quando in futuro scriverai *"spiegami X"*, un agente che ha letto la tua skill comunicazione
dovrebbe **già sapere**, senza che tu lo dica:
- usare un'immagine concreta + esempio nell'app;
- dirti subito se X è lavoro tuo, regola da ricordare, automatismo, config una-tantum o scelta UX;
- tenere il nome tecnico ma sempre con il ruolo accanto;
- non incollare codice se non serve;
- fermarsi a chiederti conferma se tocca prod/deploy/tenant/UX-già-decisa.

Questi 5 punti sono già nel documento `Metodo_spiegazioni_agenti_coding.md` — la sessione di oggi
ne è una conferma pratica: il metodo che hai scritto descrive esattamente come ti ho sbloccato
sulla cache. Il documento funziona; il prossimo passo per "automatizzare" è renderlo una skill
caricata di default (come `COMUNICAZIONE_UTENTE_SKILL.md`) così ogni agente lo applica senza che
tu debba allegarlo.

### Prompt che hai inviato (per riferimento)

- *"aiutami a strutturare bene questo plan… fammi delle domande per decidere, mantenendo una linea
  scalabile e fixabile, pulita senza parti obsolete o ridondanti"* → vuoi essere coinvolto nelle
  decisioni con domande, non ricevere un piano calato dall'alto.
- *"spiegami in modo semplice e sintetico"* (×1) → richiesta esplicita di traduzione.
- *"ma quindi devo modificare il nome del file ogni volta?"* → verifica di responsabilità operativa.
- *"procedi… poi eseguirà agente sonnet in altra chat. tu revisionerai"* → workflow multi-agente:
  un agente pianifica, uno esegue, uno revisiona. Implica che la revisione deve essere **critica e
  indipendente**, non una conferma di cortesia (infatti ha trovato il difetto).

## Deviazioni dal plan

Il piano originale prevedeva `registerType: 'autoUpdate'`. In implementazione si è rivelato
incompatibile con il requisito "no aggiornamento in sessione": corretto in `prompt`. È una
correzione del piano, non una deviazione arbitraria — il requisito di Matteo (no interruzioni)
è stato rispettato meglio.

---

## PARTE 2 — Costruzione skill system comunicazione + riorganizzazione docs

Dopo il fix PWA, la sessione è proseguita costruendo il **sistema di comunicazione vivente** e
riordinando lo skill system.

### Cosa è stato costruito

1. **Skill comunicazione interattiva** (`COMUNICAZIONE_UTENTE_SKILL.md`): impara come lavora
   Matteo e propone scorciatoie che lui approva.
2. **Vocabolario a 3 livelli** (`Comunicazione-Skill/VOCABOLARIO.md`): ogni voce ha un livello
   di libertà — 1 automatico, 2 cautela (con raccolta dati per promozione/regressione), 3 conferma.
3. **Due ruoli separati**: agente di lavoro (raccoglie dati + report, in ogni chat) vs agente
   revisore (valuta e riforma, in sessione dedicata — `REVISIONE.md`). Serve a non appesantire
   ogni chat col lavoro "meta".
4. **File di supporto**: `OSSERVAZIONI.md` (diario dati), `PROPOSTE.md` (candidate), `REVISIONE.md`.
5. **Riorganizzazione docs/**: cartella vuota rimossa; `docs/Archivio/CONTESTO_PRODOTTO.md` (fonte
   di verità versionata, no dati sensibili); `docs/_lavoro/` privata riordinata (Per matteo /
   Storico / Supporto / Sessioni) restando gitignored; mappa struttura in APP_CONTEXT §3.

### Decisione critica di privacy

`docs/_lavoro/` è **gitignored** (dati sensibili: DPA, prezzi). Rinominarla l'avrebbe esposta su
git → NON fatto. Le sessioni vecchie (12-22/05) restano nello storico privato; solo le sessioni
vive (dal 23/05) sono versionate.

### Commit

Tre commit separati su `env/test`, pushati:
- `7959c30` fix(pwa) — il fix dell'aggiornamento app
- `8fa47e2` feat(prenota) — caroselli separati (lavoro agente precedente, revisionato: validate verde)
- `d6447b2` docs(comunicazione) — sistema comunicazione + riorganizzazione docs

### Resta aperto

- **Step 2 (prossima sessione)**: profili di ingresso per ruolo (Esecuzione / Verifica / Meta)
  dentro APP_CONTEXT, per ridurre il carico di contesto iniziale. Prompt pronto consegnato a Matteo.
- `pw-*.mjs` nella root: script scratch di test visuale, non committati. Da cancellare o gitignorare.

---

## Dati comunicazione (per il revisore)

### Frasi / richieste ricorrenti (con conteggio)
- «spiegamelo semplice / sintetico» — 3+ (cache PWA, ecc.) → metafora + chi-fa-cosa.
- «è una rule che devo ricordare / devo farlo io ogni volta?» — 2+ → distinguere lavoro manuale da automatismo.
- «mantieni linea scalabile e pulita, no parti obsolete» — 2+ → soluzioni durevoli.
- «fammi domande per decidere» — 2+ → AskUserQuestion prima di pianificare/agire.
- «revisiona e se è ok committa» — 1 forte → valida con test + committa, ma fermati sui difetti logici.
- conferma successo («ok / funziona / perfetto / grazie») → trigger protocollo fine-chat.

### Spiegazioni date e formato che ha funzionato
- Metafora concreta + esempio nell'app + dichiarazione esplicita "chi fa cosa" (tu / tool / config / UX).
- Esempio modello: cache PWA come "file usa-e-getta vs file-indice"; "l'hash lo fa Vite da solo".

### Procedure ripetute (candidate ad automazione)
- Fine sessione: report + skill + commit separati.
- Revisione critica del lavoro di altri agenti (non confermare per cortesia).
- Stop + AskUserQuestion prima di azioni rischiose (prod, spostamenti di massa, privacy git).

### Cosa automatizzare con certezza vs lasciare manuale
- **Certezza**: stile "spiegamelo semplice"; chiusura "chi fa cosa"; preferenza scalabile; impatto+domanda prima di azioni rischiose.
- **Manuale**: scelta della metafora specifica; quanto astrarre; lo stop sui difetti logici anche quando i test passano.

### Proposte fatte e loro esito
- 5 candidate in `PROPOSTE.md` (tutte IN ATTESA): "spiegamelo semplice", "chi-fa-cosa",
  "revisiona-e-committa", "linea scalabile/pulita", "azioni rischiose → impatto+domanda".

### Token risparmiabili
- Stile comunicazione e flusso fine-chat: ora codificati → Matteo non li ridescrive.
- Prompt pronti per sessioni successive: forniti già formattati.

---

## Come iniziare a comporre il TUO vocabolario (guida per Matteo)

Sono il primo a girare questo sistema, quindi ti do io il punto di partenza concreto.

**Cos'è il vocabolario:** un file (`docs/Comunicazione-Skill/VOCABOLARIO.md`) dove una tua frase
breve → un comportamento preciso dell'agente. Così smetti di rispiegare ogni volta come vuoi le cose.

**Come si compone, in pratica:**
1. Guardi `PROPOSTE.md` — ci sono già 5 candidate che ho estratto dai pattern reali.
2. Per ognuna decidi: **la voglio? a che livello (1/2/3)?**
3. Quelle che approvi salgono in `VOCABOLARIO.md` col livello scelto. Le altre si archiviano.

**Le 5 candidate pronte (puoi decidere ora o quando vuoi):**

| Frase tua | Cosa farebbe l'agente | Livello che consiglio |
|-----------|----------------------|----------------------|
| «spiegamelo semplice» | metafora + esempio nell'app + "chi fa cosa", breve | 1 (automatico) |
| (a fine di ogni meccanismo tecnico) | chiude sempre con "chi fa: tu / il tool / una-tantum" | 1 |
| «revisiona e se è ok committa» | valida con i test, committa, ma stop sui difetti logici | 2 (cautela) |
| «mantieni linea pulita/scalabile» | soluzioni durevoli, niente codice ridondante | 1 |
| (azioni rischiose: sposta molti file, prod) | misura l'impatto e ti chiede prima | 1 (salvaguardia) |

**I 3 livelli, in una riga:** Liv.1 = fa e basta · Liv.2 = fa ma chiede se è ambiguo (e registra
com'è andata, per capire se promuoverla) · Liv.3 = chiede sempre, salvo frase identica già vista.

**Consiglio:** parti approvando le 2-3 a Liv.1 più ovvie (es. "spiegamelo semplice"). Le incerte
mettile a Liv.2: l'agente raccoglie i dati e nella sessione di revisione decidi se promuoverle.
Non serve riempire il vocabolario subito — cresce da solo a ogni chat.
