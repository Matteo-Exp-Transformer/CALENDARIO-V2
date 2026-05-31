# PROPOSTE — automazioni candidate (in attesa di decisione di Matteo)

> L'agente scrive qui quando un pattern in [OSSERVAZIONI.md](OSSERVAZIONI.md) è maturo
> (≥2-3 occorrenze). Ogni proposta va **chiesta a Matteo in chat**. Esito:
> - **Accettata** → la rule sale in [VOCABOLARIO.md](VOCABOLARIO.md), qui si segna ✅ accettata.
> - **Rifiutata** → si segna ❌ con il motivo, **non riproporre**.
> - **In attesa** → resta qui finché Matteo non decide.

Ogni proposta deve dire: cosa automatizzare **con certezza** vs cosa **lasciare manuale** e perché.

---

## Formato

```
### [stato] «trigger proposto» → comportamento
- **Pattern osservato:** cosa si ripete e quante volte
- **Automatizzabile con certezza:** ...
- **Meglio lasciare manuale:** ... (perché)
- **Livello suggerito:** 1 (automatico) | 2 (cautela) | 3 (conferma) — in dubbio 3
- **Token risparmiati per Matteo:** stima
- **Esito / data:** ...
```

---

> 🛑 **PAUSA-RACCOLTA fatta rispettare (revisione senior 31-05-26).** In questa revisione si
> chiudono solo le proposte che **riparano un danno dimostrato** o **sbloccano la misurazione** o
> hanno **costo zero** (formalizzano una prassi già in atto). Tutto il resto resta marcato
> **ATTESA-DATI** con il motivo: non si promuove su intuizione, si aspettano ~5-10 sessioni di dati.
> Esito triage: **3 accettate** (Prenota-vs-QR · profilo+skill nel prompt · checklist QA), **6
> attesa-dati**. Report: `docs/Sessioni di lavoro/31-05-26/Report-revisione-senior-skill-system-31-05-26.md`.

## In attesa di decisione

### ATTESA-DATI «Meta — gate spiegazione procedura avvio chat (@ skill)»
> **Triage senior 31-05-26:** parzialmente **già risolta** oggi con `COMANDI_AVVIO.md` (mappa
> parola→chat→cosa caricare). Rivalutare dopo che Matteo usa la mappa: se la domanda «cosa metto in @»
> non si ripresenta, archiviare; se torna, promuovere il gate. **Non promuovere ora.**

- **Pattern osservato:** Matteo chiede se @ `APP_CONTEXT` in ogni chat esecutore (31-05-26) — implica dubbio su **cosa caricare** vs prompt già completo; rischio sovraccarico contesto se APP_CONTEXT + area + prompt lungo sempre insieme.
- **Automatizzabile con certezza:** in chat **Meta** o quando il messaggio è meta-procedura («cosa metto in @», «come avvio agente»), il revisore **prima** chiede: *«Vuoi una spiegazione passo-passo per questa chat (sì/no)?»* — poi tabella 3 righe: Tipo chat | Cosa @ | Cosa no.
- **Regola sintesi (per Matteo, non ancora in skill):** Esecuzione mirata → prompt + 1 skill area; Esecuzione esplorativa → `@calendarbackup-app-context`; Prepara-prompt → `PREPARA_PROMPT_SKILL` only; Verifica → APP_CONTEXT profilo Verifica + area.
- **Livello suggerito:** 2 — Meta chiede prima di spiegare; Liv.1 card in `REVISIONE.md` onboarding dopo ok Matteo.
- **Esito / data:** proposta 31-05-26 — **ATTESA-DATI** (parz. risolta da COMANDI_AVVIO.md).

### ATTESA-DATI «blocco precauzioni mobile CSS nei prompt UI (prepara-prompt)»
> **Triage senior 31-05-26:** sensata ma **1 sola occorrenza**. Il template canonico esiste già nei
> file sessione (`Prompt-B-menu-qr-footer-scroll-31-05-26.md`). Pausa: serve una **2ª occorrenza**
> prima di promuovere a regola fissa. Fino ad allora prepara-prompt riusa il template manualmente.

- **Pattern osservato:** Fix sfondo scroll Menu QR #8 (31-05-26): dopo diagnosi generica, Matteo chiede esplicitare iOS/`background-attachment` e obbligo report compatibilità — evita secondo giro «funziona desktop ma salta su iPhone».
- **Automatizzabile con certezza:** quando il prompt tocca **sfondo full-page / scroll / footer** su superficie pubblica mobile, includere sotto «Diagnosi» un mini-blocco **Implementazione sfondo (obbligatorio)**: (1) layer viewport fisso preferito, (2) `background-attachment: fixed` solo se verificato 375 + nota Safari, (3) sezione report dedicata. Template: `Sessioni di lavoro/31-05-26/Prompt-B-menu-qr-footer-scroll-31-05-26.md`.
- **Meglio lasciare manuale:** scelta tecnica precisa (pseudo vs fixed div) — resta all’esecutore dopo lettura codice.
- **Livello suggerito:** 2 — prepara-prompt applica il blocco su task UI scroll/sfondo; non su ogni fix CSS.
- **Token risparmiati:** ~1 sessione correttiva iOS per ciclo simile.
- **Esito / data:** proposta 31-05-26 — **ATTESA-DATI** (1 occorrenza, serve la 2ª).

### In attesa «Meta — gate spiegazione procedura avvio chat (@ skill)»
- **Pattern osservato:** Matteo chiede se @ `APP_CONTEXT` in ogni chat esecutore (31-05-26) — implica dubbio su **cosa caricare** vs prompt già completo; rischio sovraccarico contesto se APP_CONTEXT + area + prompt lungo sempre insieme.
- **Automatizzabile con certezza:** in chat **Meta** o quando il messaggio è meta-procedura («cosa metto in @», «come avvio agente»), il revisore **prima** chiede: *«Vuoi una spiegazione passo-passo per questa chat (sì/no)?»* — poi tabella 3 righe: Tipo chat | Cosa @ | Cosa no.
- **Regola sintesi (per Matteo, non ancora in skill):** Esecuzione mirata → prompt + 1 skill area; Esecuzione esplorativa → `@calendarbackup-app-context`; Prepara-prompt → `PREPARA_PROMPT_SKILL` only; Verifica → APP_CONTEXT profilo Verifica + area.
- **Livello suggerito:** 2 — Meta chiede prima di spiegare; Liv.1 card in `REVISIONE.md` onboarding dopo ok Matteo.
- **Esito / data:** proposta 31-05-26 — in attesa sessione Meta.

### ATTESA-DATI «ciclo Verifica — commit docs + merge env/test→main a cura del revisore»
> **Triage senior 31-05-26:** tocca **merge su `main` = produzione**. Troppo rischioso promuovere
> un automatismo su **1 caso** (merge 30-05). Il merge resta **manuale, su richiesta esplicita** di
> Matteo. È materiale da **M4 (enforcement hook)**, non da regola markdown. **Non promuovere ora.**

- **Pattern osservato:** A fine mappa/revisione/fix, Matteo chiede esplicitamente merge su `main` e commit `docs/` con `git add -f`; l’esecutore Fase 1 aveva anche scritto un report revisione (conflitto di ruoli). Merge 30-05-26 (`b3216d7`) fatto dal revisore post-controverifica.
- **Automatizzabile con certezza:** a chiusura ciclo **deep Verifica** (mappa → revisione → fix → revisione fix): revisore fa `git add -f docs/…`, commit messaggio `docs(scope): …`, `merge env/test --no-ff` → `main`, `push origin main`; esecutore **non** mergea né revisiona sé stesso; check DB prod **solo lettura** (`list_migrations` + colonne critiche) prima del push se il fix tocca schema già su TEST.
- **Meglio lasciare manuale:** push produzione Supabase (`apply_migration` su `rwuxgvld`), deploy Vercel, tag release — sempre su richiesta esplicita Matteo.
- **Livello suggerito:** 2 — revisore mergea dopo «fai report finale» / «aggiorna main»; esecutore committa solo il proprio scope (`src/` o docs della sua fase) su `env/test`.
- **Token risparmiati:** 1 messaggio Matteo per merge + meno rischio doppio report revisione.
- **Dove codificare:** `APP_CONTEXT_SKILL.md` §7.0 (ruolo revisore) + `TESTING_SKILL.md` §7 chiusura ciclo.
- **Esito / data:** proposta 30-05-26 post-merge Menu QR — in attesa ok Matteo.

### ATTESA-DATI «validazione admin — no toast se Salva già disattivato»
> **Triage senior 31-05-26:** preferenza UX **1 occorrenza**, già accettata da Matteo dopo spiegazione
> (il toast resta come backup). Non è un danno: è una micro-ottimizzazione. Aspetta la 2ª occorrenza
> o promuovi in una sessione UI dedicata. **Non promuovere ora.**

- **Pattern osservato:** Menu QR modale: toast validazione + Salva grigio — Matteo «a cosa serve? regola inutile?»; accettato dopo spiegazione (toast = backup).
- **Automatizzabile con certezza:** se `canSave === false`, non chiamare `toast.warn` su click Salva; validazione visiva = pulsante disattivato; toast solo errori async (rete) o rimuovere del tutto su validazione sync.
- **Meglio lasciare manuale:** messaggi testuali specifici per campo (potrebbero servire hint inline futuri).
- **Livello suggerito:** 2 — preferenza UX Matteo esplicita su Modal, non ancora su rimozione toast.
- **Token risparmiati:** evita duplicazione feedback percepita come rumore.
- **Esito / data:** in attesa — 30-05-26 Menu QR.

### ATTESA-DATI → M4 «revisione UI → QA viewport 375/834/1280 obbligatorio»
> **Triage senior 31-05-26:** la regola **esiste già** (TESTING §7 / APP_CONTEXT §0.0) ma viene
> **bypassata**. Aggiungere un'altra regola markdown non risolve un problema di *enforcement*: una
> regola che già c'è e non viene seguita non si ripara duplicandola. Questo è materiale da **M4
> (hook `settings.json`)** — un check che la macchina esegue. **Spostato su milestone M4, non
> promosso come regola.**

- **Pattern osservato:** In revisione validazione UX Prenota (29-05-26) il revisore ha approvato con «affida a QA Matteo» e ha eseguito browser solo dopo richiesta esplicita; mobile 375 non testato. La regola esiste già in `APP_CONTEXT_SKILL.md` §0.0 (profilo Verifica → `TESTING_SKILL.md` §7) ma i prompt di revisione e l’agente la bypassano.
- **Automatizzabile con certezza:** se la revisione riguarda lavoro che ha toccato **UI/layout/responsive** (`src/**/*.tsx` con className/layout, `index.css`, skill UI_*), il revisore **deve** eseguire gli stessi passi funzionali su **375 × 812**, **834 × 1194**, **1280 × 800** (Playwright MCP / browser Cursor) e compilare tabella esiti nel report — **prima** del verdetto. «Non testato» ammesso solo con motivo esplicito (es. feature solo desktop admin, no surface pubblica).
- **Meglio lasciare manuale:** scelta dei casi funzionali specifici (dipende dal task); giudizio visivo su drift overlay accettabile.
- **Livello suggerito:** 1 per profilo Verifica + UI; eccezione documentata = Liv. 2 (Matteo può esonerare in prompt).
- **Token risparmiati per Matteo:** evita giro «revisiona» → «fai test viewport» → secondo report.
- **Dove codificare (se approvata):** `TESTING_SKILL.md` §7.7 nuova sottosezione «Revisione post-esecutore UI»; rafforzo in `APP_CONTEXT_SKILL.md` §0.0 colonna Verifica; checklist nel template prompt revisione (PREPARA_PROMPT o snippet report).
- **Esito / data:** proposta Matteo 29-05-26 — in attesa ok (rispetta PAUSA-RACCOLTA: regola in markdown, non hook).

### ATTESA-DATI «segnala conflitto scalabilità multi-tenant» → sezione report + COMUNICAZIONE
> **Triage senior 31-05-26:** **1 occorrenza**, già tracciata come FU-006. Aspetta che il pattern
> torni prima di renderla sezione obbligatoria di ogni report (rischio di gonfiare i report con una
> sezione spesso vuota). **Non promuovere ora.**

- **Pattern osservato:** Matteo vuole sapere se le sue decisioni (autosave, guard, persistenza) confliggono con N ristoranti / multi-azienda.
- **Automatizzabile con certezza:** sezione report **Scalabilità multi-tenant** (ok/attenzione/conflitto) quando task tocca persistenza o state admin condiviso.
- **Meglio lasciare manuale:** giudizio sul conflitto reale.
- **Livello suggerito:** 2
- **Esito / data:** FU-006 aperto; in attesa promozione regola report.

### In attesa «file mappa richieste-utente → automazioni» (idea Matteo)
- **Pattern osservato:** Matteo vuole un punto unico dove annotare le sue richieste ricorrenti (come la diagnosi prod/test 30-05-26) per mappare automazioni che le soddisfino. Oggi le proposte vivono qui in PROPOSTE.md.
- **Da valutare col revisore:** serve un file .md NUOVO o basta questo file? Rischio duplicazione con OSSERVAZIONI/PROPOSTE/EVOLUZIONE_SKILLS. Matteo stesso ha frenato (Opus 4.8 gli ha chiesto di testare prima di aggiungere) → **non creare file ora**, solo questa nota.
- **Esito / data:** annotata 30-05-26 su richiesta esplicita Matteo — in attesa decisione revisore (rispetta PAUSA-RACCOLTA).

### In attesa «diagnosi disallineamento prod/test → consultare provider via MCP, non elencare cause ovvie»
- **Pattern osservato:** 30-05-26 Matteo riporta «prod non aggiornata». Le cause ovvie (deploy vecchio, due hosting) erano già note a lui — voleva che interrogassi i provider per dati reali. Diagnosi risolta con MCP Vercel+Supabase+git: tutto allineato, causa = **cache PWA desktop** (mobile vedeva nuovo, stesso link).
- **Automatizzabile con certezza:** quando Matteo segnala disallineamento ambienti, l'agente **consulta attivamente** i provider (MCP Vercel deployment+state, MCP Supabase list_migrations, git log branch) PRIMA di ipotizzare; non elenca cause generiche che lui già conosce. Checklist 4 dimensioni: git → deploy → DB → cache/PWA (codificata in APP_CONTEXT §1b.1).
- **Meglio lasciare manuale:** test browser lato Matteo (incognito/hard reload).
- **Livello suggerito:** 1 per consultare provider; + regola comunicazione: **risposta in 1-2 righe, dettaglio solo se richiesto** (Matteo: troppi caratteri = qualcosa sfugge).
- **Token risparmiati:** evita giri di ipotesi sbagliate; risposte più corte.
- **Esito / data:** annotata 30-05-26 — in attesa ok (PAUSA-RACCOLTA).

### ATTESA-DATI «tutto fatto» come chiusura ciclo multi-agente
> **Triage senior 31-05-26:** si **sovrappone** a «lavoro ok» (Liv.1) + «fai report finale» (Liv.1)
> già in vocabolario. Rischio ridondanza / parole-trigger doppione. Prima di aggiungere un terzo
> trigger, verificare sui dati se «tutto fatto» ha un comportamento **distinto** dai due esistenti
> (sembra = «lavoro ok» + «fai report finale» detti insieme). **Non promuovere ora.**

- **Pattern osservato:** Matteo dice «tutto fatto» a fine catena prepara → esecuzione → (revisione) e chiede raccolta comunicazione + commit + report (29-05-26 salvataggio admin).
- **Automatizzabile con certezza:** agente prepara-prompt a valle (o esecutore con conferma) aggiorna report ciclo, OSSERVAZIONI, PROPOSTE, SESSION_LOG; commit codice + docs separati; **non** promuove voci vocabolario.
- **Meglio lasciare manuale:** giudizio «approva / riserve» se QA browser incompleto.
- **Livello suggerito:** 2 — trattare come trigger chiusura documentale, non come «lavoro ok» sul solo codice.
- **Esito / data:** in attesa — distinguere da voce Liv.1 «lavoro ok» (task singolo).

---

## Archivio (decise)

### ✅ ACCETTATA (31-05-26) Disambiguazione Prenota vs Menu QR → `PREPARA_PROMPT_SKILL.md` §2
- **Triage senior:** unico danno **dimostrato e ripetuto** (fix su `PublicMenuPage` mentre il sintomo era su `BookingRequestPage`, ≥3 agenti, QA OK errato). Ripara, non aggiunge.
- **Codificata:** gate obbligatorio nel filtro § 2 «Zone che si confondono» — task scroll/sfondo/footer pubblico **deve** dichiarare slug/URL smoke; se nel thread compaiono sia «Prenota» sia «Menu QR» → prepara-prompt chiede una riga Sì/No; vietato QA OK senza URL citato = URL testato.
- Le 3 proposte-doppione sul tema sono collassate in questa. Origine: meta-analisi 31-05-26 + `ERRORI_PROCESSO.md`.

### ✅ ACCETTATA (31-05-26) Profilo + skill nel prompt esecutore → `PREPARA_PROMPT_SKILL.md` §1.A
- **Triage senior:** richiesta esplicita Matteo 31-05, **costo zero** (è formato, non meccanismo), riduce errori-zona.
- **Codificata:** il blocco copia-incolla inizia con riga fissa `Profilo: … · Modalità: … · Skill da leggere: … · Non caricare: …`. Sostituisce la vecchia logica «lo deduce l'esecutore da §0.0».

### ✅ ACCETTATA-GIÀ-PRESENTE (31-05-26) Checklist QA: no URL, sì schermata+effetto
- **Triage senior:** **già regola** in `COMUNICAZIONE_UTENTE_SKILL.md` (forma standard a fine task: «Mai route tecniche tipo `/c/antipasti` verso Matteo» + righe «dove guardare + cosa vedere»). Nessuna modifica necessaria: la proposta è già soddisfatta dallo skill esistente. Chiusa senza nuovo codice.

### ✅ ACCETTATA (29-05-26) Metriche successo chat → `EVOLUZIONE_SKILLS.md` (M5 concreta)
- 4 criteri oggettivi (n° prompt Matteo · correzioni post-1ª risposta · follow-up generati · modalità alzata). Li mette **prepara-prompt a valle** (no autopagella), solo numeri, sessioni standard/deep. + **PAUSA-RACCOLTA**: stop nuove regole finché non si accumulano ~5-10 sessioni di dati. Origine: idea Matteo 29-05-26. **Ultima aggiunta prima della pausa.**

### ✅ ACCETTATA (29-05-26) «mockup HTML per scelta flusso UX» → PREPARA_PROMPT §1.B
- **Pattern osservato:** Matteo: «comodissimo», «mi serve quasi sempre» per scegliere flusso/UI prima di implementare (ciclo salvataggio admin).
- **Automatizzabile:** prepara-prompt propone o consegna HTML multi-stato (tab oggi/proposta/modale); file es. `mockup-*.html` in root ok.
- **Non in VOCABOLARIO Liv.1** finché Meta non promuove — regola già in `PREPARA_PROMPT_SKILL.md` §1.B.
- **Esito / data:** 29-05-26 codificata; esempio `mockup-salvataggio.html`.

### ✅ ACCETTATA (29-05-26) Modalità sessione light / standard / deep → regola attiva (PREPARA_PROMPT § 1.A + APP_CONTEXT § 7.1)
- Classificazione interna (no parola di Matteo): prepara-prompt assegna light/standard/deep e la scrive nel prompt; decide quanto protocollo di chiusura applicare. **Deep automatico** su: DB/prod/RLS, file LOCK, >1 view o nuovo componente, auth/login/pagamenti. **L'esecutore può solo alzare, mai abbassare.** Risolve il rischio #1 (sistema troppo procedurale: oggi ogni task fa il protocollo deep). Origine: analisi agente skill system v0 + decisione Matteo 29-05-26.

### ✅ ACCETTATA (29-05-26) «lavoro ok» → VOCABOLARIO Liv. 1
- Conferma che il task è accettato; non avvia da solo report/commit. In `VOCABOLARIO.md`.

### ✅ ACCETTATA (29-05-26) «finestra/dialog di conferma» → VOCABOLARIO Liv. 1
- Default = componente `Modal` in-app, mai `window.confirm` browser. In `VOCABOLARIO.md`. Lega a FU-003.

### ✅ ACCETTATA (29-05-26) «comportamenti ok ma voglio che cambi» → VOCABOLARIO Liv. 2
- Cambio intenzionale, non bugfix. Linguaggio «cambio UX» non «bug/regressione». In osservazione (Liv.2).

### ✅ ACCETTATA (29-05-26) «compila report … comunicazione … annota prompt» → VOCABOLARIO Liv. 2
- Chiusura sessione meta: report Dati comunicazione + prompt verbatim + OSSERVAZIONI; candidate only. In osservazione (Liv.2).

### ✅ ACCETTATA (29-05-26) «revisiona [lavoro] e se ok committa» → VOCABOLARIO Liv. 2
- Valida con `npm run validate`, committa se verde, MA fermati sui difetti logici anche a test verdi. In osservazione (Liv.2).

### ✅ ACCETTATA (29-05-26) Report unificato ciclo multi-agente → regola attiva (APP_CONTEXT § 7.1)
- Da preferenza a regola: cicli dichiarati multi-agente (prepara → esegui → revisiona) usano un solo `Report-ciclo-<tema>-GG-MM-AA.md`, aggiornato da ogni ruolo. Codificata in § 7.1.

### ✅ ACCETTATA (29-05-26) Copy verbatim → Nota in COMUNICAZIONE_UTENTE_SKILL
- Quando Matteo incolla testo da applicare letterale: cambiare solo le stringhe citate, lasciare invariato il resto; se sembra sostituzione totale, chiedere. Codificata nello skill comunicazione.

### ✅ ACCETTATA (29-05-26) Freno azioni strutturali rischiose → regola attiva (PREPARA_PROMPT § 2)
- Prima di spostamenti di massa / rename / azioni irreversibili: misurare impatto + AskUserQuestion con opzioni, mai eseguire d'impulso. Salvaguardia automatica, nessuna parola-trigger.

### ✅ ACCETTATA (28-05-26) «fai report finale» → VOCABOLARIO Liv. 1
- Flusso di fine-chat (report + skill + proposta commit) **solo su questo termine esplicito**, non
  sul trigger "ok/funziona". Matteo preferisce dirlo lui. Salita in `VOCABOLARIO.md`.

### ✅ ACCETTATA (28-05-26) «dammi prompt proseguimento» → VOCABOLARIO Liv. 1
- Risposta = solo il prompt auto-contenuto per la chat successiva (passa il lavoro dal punto esatto,
  evita contesto pesante). Salita in `VOCABOLARIO.md`.

### ✅ ACCETTATA (28-05-26) «revisione completa» → VOCABOLARIO Liv. 1
- Revisione critica e indipendente (workflow multi-agente): dichiara i difetti veri, mai "ok" di
  cortesia. Riconosciuta anche nel testo di avvio dell'agente. Salita in `VOCABOLARIO.md`.

### ❌ RIFIUTATA (28-05-26) «è un bug o è voluto?»
- Caso troppo raro per ora. Non riproporre salvo nuovi dati.

### ✅ ACCETTATA (28-05-26) «spiegamelo semplice» → VOCABOLARIO Liv. 1
- Metafora + esempio nell'app + chi-fa-cosa, breve. Salita in `VOCABOLARIO.md`.

### ❌ RIMOSSA (28-05-26) «devo farlo io ogni volta?»
- Era stata aggiunta a Liv. 2, poi Matteo l'ha rimossa: non la dice abbastanza spesso per ora.

### In attesa «sessione Verifica mappatura Impostazioni ↔ Prenota» → template + vocabolario
- **Pattern osservato:** Matteo incolla coppie DOM `admin -- prenota`; agente Verifica traccia `setting_key`, hook, esito OK/KO (29-05-26, ~30 coppie).
- **Automatizzabile con certezza:** template report con colonne fisse + sezione procedura/prompt; checklist gap «campo admin non renderizzato in Prenota»; rimando APP_CONTEXT riga Pagina Prenota.
- **Meglio lasciare manuale:** coppie DOM da ispezionare; giudizio KO vs parziale.
- **Livello suggerito:** 2 — «controverifica mappatura» / «mappatura impostazioni prenota» → profilo Verifica + report template.
- **Termini candidati Liv.2:** Anagrafica Azienda, Personalizza form, Card scorrevole, TIPO sidebar, Nome promo (admin) vs Testo promo (Prenota), Filtro categorie/ingredienti — tabella nel report mappatura 29-05-26.
- **Token risparmiati:** meno re-spiegazioni storage `restaurant_settings` vs JSON config.
- **Esito / data:** in attesa — proposta da report mappatura 29-05-26.

### ✅ ACCETTATA (28-05-26) «scalabile e pulita / no parti obsolete» → VOCABOLARIO Liv. 1
- Preferisci soluzioni durevoli, segnala cosa eviti. Salita in `VOCABOLARIO.md`.

### ✅ ACCETTATA (28-05-26) scorciatoie d'area + stile → VOCABOLARIO
- Pagina Prenota / Pagina menù-QR / pagina admin / le tre zone menu distinte (Personalizza form,
  Menu QR, magazzino MenuPricesTab) + sicurezza prod L1 + comportamento plan-mode (domande su
  competenze Matteo + dubbi strutturali). Vedi VOCABOLARIO sezioni "Stile" e "Scorciatoie d'area".

### ✅ ACCETTATA (28-05-26) termini profili di ingresso → VOCABOLARIO Liv. 1
- **Esecuzione:** «implementa» · «sistema» · «fai» · «nuova feature» · «aggiungi» · «crea»
- **Verifica:** «revisiona» · «controlla» · «verifica» · «debugga» · «trova il bug» · «non funziona»
- **Meta:** «migliora comunicazione» · «aggiorna comunicazione»
- **Esito:** approvati in chat di mappatura, saliti in `VOCABOLARIO.md` a Liv. 1. Riferimento rapido anche in `APP_CONTEXT_SKILL.md` § 0.0.
