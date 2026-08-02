# Stato generale dell'app + mandato per il lavoro Fable

> Documento di partenza scritto il **02-08-2026**. Serve a far partire il prossimo grande cantiere
> ("lavoro Fable") **senza doverlo ricostruire da zero**, come è successo alla ripresa di S4.
>
> ⚠️ **Il lavoro Fable parte solo quando tutto il lavoro in corso o sospeso è chiuso.**
> La lista delle precondizioni è la §6: finché ha caselle vuote, Fable non inizia.

---

## 1. Cos'è l'app, in una pagina

**PrenotaZen** è un gestionale di prenotazioni per ristoranti, venduto in abbonamento. Ha due facce:

**La faccia pubblica** — quella che vede il cliente del ristorante:
- **Pagina Prenota**: il form dove si prenota un tavolo (data, ospiti, orario, tipo di servizio,
  eventuale menù). Ogni ristorante ha il suo indirizzo con il proprio nome.
- **Menu QR**: il menù digitale che si apre inquadrando il codice QR al tavolo.
- Pagine di servizio: privacy, disiscrizione dalle email.

**La faccia privata** — quella che vede il ristoratore:
- **Home**: quadro del giorno, walk-in, briefing di turno.
- **Prenotazioni**: accetta/rifiuta, archivio, appunti.
- **Calendario**: occupazione per giorno e per fascia.
- **CRM**: rubrica clienti ed email (automatiche e campagne).
- **Servizio** (solo Pro): sale, tavoli, fasce orarie, assegnazione delle prenotazioni ai tavoli.
- **Analytics**, **Impostazioni**, **Personalizza form**, **Menù e magazzino**.

**Le edizioni**: una sola base di codice, tre livelli venduti — **Classic**, **Pro**, **Enterprise** —
distinti dal campo `tenants.edition` e da un sistema di flag (`FEATURES`). Il Servizio a tavoli è Pro.
La protezione vera dei dati non è nei flag ma nelle regole del database (RLS).

**Multi-tenant**: ogni ristorante è un tenant. Il tenant si ricava dallo slug nell'indirizzo (lato
pubblico) o dall'email dell'admin (lato privato). Tutto passa da lì: se il tenant è sbagliato,
è sbagliato tutto.

---

## 2. Stato tecnico oggi

| Voce | Valore |
|---|---|
| Stack | React + TypeScript + Vite, Tailwind, TanStack Query, Supabase (Postgres + Auth + Edge Functions) |
| File sorgente | ~392 fra `.ts` e `.tsx` |
| Test automatici | **1198 test su 144 file**, tutti verdi (`npm run validate`) |
| Test end-to-end | Playwright, **2 soli test** sul Servizio — copertura minima |
| Migrazioni DB | 66, l'ultima è la **065** |
| Edge Functions | `create-booking`, `send-email`, `unsubscribe`, `validate-invite` |
| Branch di lavoro | `env/test` (16 commit avanti a `main`) |
| Repo | 3 repo separati: **CALENDARIO-V2** (privata, sviluppo), **PrenotaZen** (pubblica, va su Vercel), **TestingAgentHarness** |
| Rilascio | `env/test` → merge in `main` → `npm run release:prenotazen` |

### I due database, che si disallineano

| | TEST | PRODUZIONE |
|---|---|---|
| Progetto Supabase | `docnnernvp` | `rwuxgvld` |
| Migrazioni | fino alla **065** | fino alla **062** |
| Edge `create-booking` | **v29** | **v21/v22** |

**Questa differenza è il rischio numero uno del progetto.** Tre migrazioni (063, 064, 065) e la nuova
Edge esistono solo su TEST. Il rollout va fatto in **un'unica finestra**: migrazioni + Edge + client
insieme. Mai Edge nuova con client vecchio.

⚠️ Trappola scoperta il 02-08: `main` contiene un fix all'Edge (`f617077`, override fascia letto su
`date_from`/`date_to`) che **non è mai rientrato in `env/test`**. Va rimesso dentro **prima** del
merge, altrimenti la produzione regredisce.

---

## 3. Cosa è già in produzione e cosa no

**In produzione e funzionante:** login e gestione admin, prenotazioni, calendario, CRM con email
(Brevo) e disiscrizione, menù e magazzino, Menu QR, impostazioni, form pubblico con limiti per
fascia, intervalli di arrivo, durate configurabili.

**NON in produzione:** tutto lo **sprint S4 della pagina Servizio** — motore delle finestre di
occupazione, 5 stati del tavolo, walk-in coerente, eliminazione sala morbida, briefing con tavolo,
overbooking forzabile, e le tre funzioni aggiunte il 02-08 (avviso di fine turno, tavolate su più
tavoli, due viste della mappa).

---

## 4. Il mandato di Fable

Cinque filoni. Sono in ordine: ognuno poggia sul precedente.

### 4.1 Verifica conflitti, regressioni e funzionamento

Obiettivo: sapere con certezza che l'app funziona **tutta**, non solo l'ultima cosa toccata.

- Riallineare `main` ed `env/test` e risolvere il conflitto Edge noto (§2).
- Passata completa su tutte le sezioni admin e su tutte le pagine pubbliche.
- Caccia alle regressioni fra aree che si toccano: Servizio ↔ Calendario ↔ Prenota ↔ CRM.
- Verifica che le tre edizioni si comportino come devono (un Classic non deve mai vedere né
  raggiungere roba Pro).

**Fatto quando:** esiste un referto scritto per ogni area con esito e, per ogni difetto, o il fix o
una voce di follow-up con numero.

### 4.2 Blindatura totale — dal login all'ultima funzione

"Blindare" qui significa: coprire con test automatici e controtest manuali ogni percorso, così che
una modifica futura non possa romperlo in silenzio. Esiste già un metodo scritto in
`docs/Testing-Skill/MANUALE_BLINDATURA.md` e un indice in `ADMIN_TEST_SUITE_INDEX.md`: **vanno
riusati, non reinventati**.

Copertura richiesta: login e sessione → shell e navigazione → prenotazioni → calendario → CRM ed
email → menù e magazzino → Menu QR → impostazioni e personalizza form → Servizio → analytics →
pagine pubbliche → PWA.

**Priorità sui test end-to-end**: oggi ce ne sono 2. È il buco più grande della casa. Servono
percorsi completi, con dati di prova creati e ripuliti in automatico su TEST.

**Fatto quando:** ogni area ha i suoi test, `npm run validate` è verde, la suite e2e copre almeno i
percorsi critici, e l'indice delle suite è aggiornato.

### 4.3 Doppio collaudo: come admin e come cliente

Il cuore del punto: **quello che l'admin configura deve essere esattamente quello che il cliente
vede.** Oggi questa coerenza non è mai stata verificata in modo sistematico.

Ogni manopola lato admin va seguita fino al form pubblico: orari e fasce, chiusure, intervalli di
arrivo, limiti di coperti, durate, tipologie e card, menù e preset, testi e anagrafica, consensi.
Per ognuna: la cambio da admin → la ritrovo dal cliente → prenoto → la prenotazione torna corretta
in Calendario e in Servizio → l'email al cliente dice la stessa cosa.

**Nodo già identificato**: i form pubblico e admin devono avere **gli stessi campi e la stessa
logica centralizzata** (decisione di Matteo del 02-08-26). Non serve lo stesso ordine dei campi;
serve che non ci siano due verità. Oggi le due strade sono in parte separate.

**Fatto quando:** esiste una tabella "manopola admin → effetto sul cliente" completa, tutta spuntata,
e la logica condivisa è davvero condivisa.

### 4.4 Repo di produzione PrenotaZen professionale

La repo pubblica è la faccia tecnica del prodotto. Obiettivo: che regga lo sguardo di un cliente
grosso, di un investitore o di un revisore.

Da sistemare: README e documentazione d'ingresso, licenza, versionamento e changelog, CI che gira
davvero (lint, typecheck, test, build) e blocca i merge rotti, template per issue e pull request,
policy di sicurezza e canale per segnalare vulnerabilità, gestione dei segreti e delle variabili
d'ambiente, dipendenze aggiornate e controllate, build riproducibile, niente file di lavoro interni
o dati sensibili finiti nella repo pubblica (il processo di sincronizzazione va riverificato).

**Fatto quando:** un tecnico esterno clona, capisce, avvia e contribuisce senza chiedere aiuto.

### 4.5 Certificazioni e normative — studio e allineamento

Questo filone è **di studio prima che di codice**. Serve una relazione che dica: cosa si applica
davvero a noi, cosa manca, cosa costa, in che ordine conviene farlo.

⚠️ **Regola per chi lo esegue:** requisiti, articoli e scadenze vanno verificati su **fonti
ufficiali aggiornate** al momento del lavoro. Quanto segue è la traccia di ricerca, non una
risposta già data.

**GDPR — è l'unico già operativo e già parzialmente coperto.** Esiste materiale in
`docs/Legal-Production-Skill/` e `docs/legal/`: registro dei trattamenti, sub-responsabili, runbook
per la violazione dei dati, modello di contratto B2B, privacy policy. Da fare: verificare che questi
documenti descrivano l'app **reale di oggi** (S4 ha aggiunto dati nuovi: finestre di occupazione,
tracce di forzatura, archivio append-only che non cancella più nulla — quest'ultimo tocca
direttamente la conservazione e il diritto alla cancellazione), e chiudere i tempi di conservazione.

**ISO — quali hanno senso per un SaaS come questo:**
- **ISO/IEC 27001** (sistema di gestione della sicurezza delle informazioni): è quella che i clienti
  aziendali chiedono. Impegnativa: non è un bollino, è un sistema di processi documentati.
- **ISO/IEC 27701**: estensione della precedente per la privacy, si aggancia bene al GDPR.
- **ISO/IEC 27017 / 27018**: buone pratiche per il cloud e per i dati personali nel cloud —
  rilevanti perché l'infrastruttura è su Supabase e Vercel.
- **ISO 9001** (qualità): utile in certi mercati, meno legata al prodotto software.

Da produrre: analisi di distanza (dove siamo rispetto ai requisiti), stima di sforzo e costo,
e la raccomandazione su cosa serve **davvero** rispetto a cosa è solo desiderabile.

**AI Act (Regolamento UE 2024/1689):**
Fatto importante da mettere subito in chiaro — **l'app oggi non contiene alcun sistema di
intelligenza artificiale**: nessuna dipendenza, nessuna chiamata a modelli, nessuna decisione
automatizzata basata su AI (verificato il 02-08-26). Di conseguenza PrenotaZen **non è oggi
fornitore di un sistema di AI** ai sensi del regolamento. Usare assistenti AI per *scrivere* il
software non rende il software un sistema di AI.

Il filone quindi è **preventivo**, e va impostato così:
- stabilire il presupposto di partenza (nessuna AI nel prodotto) e **metterlo per iscritto**, così
  da poterlo dimostrare;
- definire una procedura: se in futuro si aggiunge una funzione AI (suggerimento orari, previsione
  affluenza, chatbot di prenotazione), **prima** si classifica il livello di rischio e si verificano
  gli obblighi che ne derivano — per un chatbot rivolto al cliente finale, tipicamente obblighi di
  trasparenza;
- verificare gli obblighi che riguardano chi **usa** strumenti AI internamente, incluso il tema
  della formazione del personale;
- verificare le scadenze applicabili su fonte ufficiale.

**Fatto quando:** esiste una relazione con: cosa si applica, distanza attuale, priorità, costi
stimati, e una decisione di Matteo su cosa perseguire.

---

## 5. Regole invalicabili (valgono anche per Fable)

1. **Muro produzione.** Nessuna scrittura sul database di produzione `rwuxgvld` e nessun merge su
   `main` senza autorizzazione esplicita di Matteo, chiesta ogni volta. Prima di qualsiasi
   INSERT/UPDATE/DELETE via MCP si verifica l'ambiente con `get_project_url`.
2. **`supabase db push` è vietato.**
3. **Le migrazioni già applicate non si toccano e non si rinominano.**
4. **Edge e client viaggiano insieme.** Mai una nuova Edge Function con il client vecchio.
5. **Aree blindate**: `CollapsibleCard`, `DateInput`/`TimeInput`, z-index dei modali, PWA in
   modalità `prompt`. Si toccano solo con decisione esplicita.
6. **Prima di modificare, si carica la skill dell'area** (`docs/APP_CONTEXT_SKILL.md` §0). Non si
   naviga il codice a tappeto.
7. **Dopo ogni modifica si aggiorna il file di contesto dell'area**, non copie sparse.

---

## 6. Precondizioni — Fable non parte finché queste caselle non sono spuntate

- [ ] **Collaudo S4 completato** da Matteo: `docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md` tutto verde
      sulle voci 🔴.
- [ ] **Decisioni aperte chiuse**: soglia di ritardo, buffer di riassetto, durata walk-in (§10 della
      checklist).
- [ ] **`main` rimessa dentro `env/test`** e conflitto Edge `f617077` risolto.
- [ ] **Rollout S4 in produzione eseguito**: migrazioni 063→065 + Edge + client, nella stessa
      finestra, con autorizzazione esplicita.
- [ ] **Handoff S4 scritto** e follow-up aperti registrati in `docs/FOLLOW_UP.md`.
- [ ] **Allineamento logica form pubblico/admin** deciso: dentro il lavoro Fable o intervento a sé.

---

## 7. Debiti noti che Fable erediterà

| Debito | Dove | Gravità |
|---|---|---|
| Test end-to-end quasi assenti (2) | `e2e/` | 🔴 alta |
| Walk-in non è una transazione unica (crea prenotazione e poi assegnazione) | `useWalkInMutation` | 🟡 media |
| Nome tavolo unico controllato solo dal browser: due admin insieme possono duplicarlo | `TableFormModal` | 🟡 media |
| Annulla dopo una forzatura non rimette la prenotazione scavalcata sul tavolo | `AssignmentMapPanel` | 🟡 media |
| Ogni annulla consuma un turno del tavolo | `useTableAssignments` | 🟢 bassa |
| `npm run validate:docs` rosso per 14 link rotti nell'area Console | `docs/Console-Skill` | 🟢 bassa |
| Primo caricamento lento dopo un rilascio (peso del pacchetto) | FU-PERF-BUNDLE | 🟡 media |
| Avvisi di sicurezza del database mai affrontati (funzioni, policy, bucket pubblico, protezione password) | Supabase | 🔴 alta — entra nel filone 4.5 |
| Registro follow-up lungo, con voci aperte da mesi | `docs/FOLLOW_UP.md` | 🟡 media |

---

## 8. Dove guardare

- **Indice di tutto**: `docs/APP_CONTEXT_SKILL.md` (§0 = quale skill caricare per quale area)
- **Cantiere Servizio**: `docs/MASTERPLAN_SERVIZIO.md` + `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md`
- **Collaudo S4**: `docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md`
- **Come si blinda**: `docs/Testing-Skill/MANUALE_BLINDATURA.md`
- **Database e migrazioni**: `docs/DATABASE.md` + `docs/Database-Skill/DB_SKILL.md`
- **Legale e produzione**: `docs/Legal-Production-Skill/` + `docs/legal/`
- **Debiti aperti**: `docs/FOLLOW_UP.md`
- **Come parlare con Matteo**: `docs/Comunicazione-Skill/VOCABOLARIO.md`
