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
