# Report finale — Hook meno invadente + sub-agente CONTROVERIFICA + chiusura runtime Prenota (04-06-26)

**Profilo:** Meta (hook/skill comunicazione) → Esecuzione (fix Prenota) → Verifica (runtime edge).
**Branch:** `env/test` · **DB toccato:** TEST `docnnernvp` (edge deploy) · **PROD:** non toccata.
**Commit sessione:** `147145d` · `83ba76a` · `7ea871c` · `04fa25b` · `5445640` (5 commit, 9 file).

---

## 1. Cappello

- **Cosa è cambiato:** (a) l'hook di fine-chat ora insiste meno e su un solo report; (b) nasce un
  sub-agente «controverifica» che, dopo il report finale, rilegge in modo imparziale il lavoro vs i
  prompt e il flusso dell'app; (c) la pagina Prenota è ora protetta anche lato server (testi troppo
  lunghi rifiutati) e i limiti sono coerenti ovunque (ospiti 110).
- **Cosa resta:** **FU-034** — allineare PROD a TEST (build + merge + deploy edge su PROD + probe),
  da fare in una sessione **senior** con conferma esplicita di Matteo. PROD oggi è indietro.
- **Serve una tua azione:** no subito. Il prossimo passo (FU-034) è per il prossimo agente senior.

---

## 2. Cosa è stato fatto

1. **Hook fine-sessione meno invadente.** Capito perché insisteva «più di 3 volte»: revisionava
   TUTTI i report toccati negli ultimi 20 min insieme (i report degli agenti lo confermano: «7 report»).
   Ora guarda solo il report più recente (la chat che si chiude), tetto duro a 3 rilanci, e niente più
   falsi «risposta mancante» sulle risposte brevi fra parentesi.
2. **Sub-agente CONTROVERIFICA (nuovo).** Dopo «report finale» un agente che NON ha fatto il lavoro
   rilegge report + diff contro i prompt di Matteo (da Q1) letti col flusso dati/utente: cerca scope
   creep e reinterpretazioni del vocabolario; emette verdetto + prompt grezzo per `prepara-prompt`.
   Vive nel profilo Verifica. Aggiunta anche la **self-review** (l'agente rilegge il proprio report
   prima dell'hook).
3. **Controverifica mappatura Prenota.** Lanciato un sub-agent imparziale sul lavoro di mappatura di
   Codex: verdetto **BLINDATA** (mappa fedele al codice, nessuna parte mancante, 6 casi-limite gestiti,
   limiti testo coerenti). Unico residuo segnalato: il lato runtime (FU-031).
4. **Chiusura runtime FU-031.** Allineato ospiti a **110** (era 999 morto in costante); rimossi i
   check `validate()` morti (taglio silenzioso, decisione Matteo); **deployata l'edge create-booking
   su TEST (v7)** e provata dal vivo: testi oltre cap → **400**, prenotazione valida → **201**.
5. **FU-034 preparato** per il prossimo senior (allineamento PROD + build).

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `.cursor/hooks/fine-sessione-nudge.mjs` | Hook v5: solo report recente, tetto 3, meno falsi vuoti |
| `docs/Comunicazione-Skill/CONTROVERIFICA.md` | **Nuovo** — skill sub-agente imparziale di fine sessione |
| `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` | §12 self-review + box hook v5 + rimando controverifica |
| `docs/APP_CONTEXT_SKILL.md` | Riga routing «report finale / controverifica» → profilo Verifica |
| `src/features/booking/constants/bookingPrenotaTextLimits.ts` | `numGuestsMax` 999→110 |
| `src/features/booking/components/BookingRequestForm.tsx` | Rimossi check `validate()` morti (guests/dietary/special) |
| `supabase/functions/create-booking/index.ts` | `numGuestsMax` 999→110 (poi deployata su TEST v7) |
| `docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` | §H ospiti 110 + colonna validazione corretta |
| `docs/FOLLOW_UP.md` | FU-031 → Fatto; **FU-034** nuovo (allineamento PROD) |

---

## 4. Test eseguiti e risultato

| Cosa | Esito |
|------|-------|
| `npm run typecheck` | OK |
| `npm run lint` | OK (0 warning) |
| `npm run test` (Vitest) | **291/291 OK** |
| Probe edge TEST v7: name×66 / dietary 551 / special 551 / guests 111 | **400 «Testo troppo lungo»** (prima 201) |
| Probe edge TEST v7: prenotazione valida (`booking_type: tavolo`) | **201 success** (poi booking + customer di test cancellati) |
| Sub-agent controverifica mappatura Prenota | Verdetto **BLINDATA**, 0 problemi |

> Nota onesta: la verifica è stata read-only + probe HTTP. **Non** è stato eseguito un QA visivo della
> pagina su viewport reali (mobile/desktop) — resta un passo mancante prima di dire «vendibile».

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `CONTROVERIFICA.md` | nuovo | Documenta il sub-agente imparziale di fine sessione |
| `CHIUSURA_SESSIONE.md` | §12 self-review + box hook v5 | Allineare la guida chiusura al nuovo comportamento |
| `APP_CONTEXT_SKILL.md` | riga routing | Far trovare la skill controverifica dal profilo Verifica |
| `PRENOTA_TEXT_LIMITS_MAP.md` | §H ospiti 110 + validazione | Allineare la mappa al codice dopo il fix FU-031 |
| `.cursor/hooks/fine-sessione-nudge.mjs` | v5 | Comportamento hook (codice, non skill testuale) |

---

## 6. Dati comunicazione

- **Frasi ricorrenti Matteo:** «sii breve / niente lezione stasera» (stanchezza esplicitata → ridurre
  testo); «parliamone prima» (vuole decidere il design prima dell'implementazione); «report finale»
  (innesca controverifica). Decisioni prese via opzioni pesate (AskUserQuestion) — formato che funziona.
- **Spiegazioni che hanno funzionato:** rispondere alla domanda «cosa lo fa fermare» con i DATI veri
  (lettura dei report degli agenti) invece che a memoria; la domanda finale «ci metteresti la firma?»
  ha avuto valore perché ho risposto con i limiti reali, non con conferme.
- **Automatizzabile con certezza:** il deploy edge + probe (script ripetibile). **Manuale:** il QA
  visivo della pagina, la conferma PROD.

### 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: ~7. Correzioni dopo 1ª risposta: ~1 (mi ha ridiretto da «mettere il
  sub-agent in prepara-prompt» a «usare il profilo Verifica già esistente» — sua intuizione giusta).
- Follow-up generati: 1 (FU-034). Modalità alzata: sì (Meta → Esecuzione → Verifica nella stessa chat).
- Cosa ha reso i prompt efficaci: Matteo ha guidato il design con domande mirate prima di farmi
  scrivere; l'uso di «parliamone prima» ha evitato codice buttato.

### 8. La mia lettura della sessione (agente)

- **Funzionato bene:** il nuovo skill CONTROVERIFICA è stato scritto E subito usato nella stessa
  sessione (controverifica mappatura Prenota) — prima validazione reale del meccanismo, ed è filato.
  La diagnosi dell'hook basata sui report veri ha evitato di «curare» il sintomo sbagliato (il numero
  di rilanci) invece della causa (troppi report insieme).
- **Difficoltà + risoluzione:** (1) here-string PowerShell rompeva i messaggi di commit (una `@`
  spuria) → risolto scrivendo il messaggio su file e usando `git commit -F`. (2) Primo probe edge
  «valido» falliva 500 → non era il mio fix ma il payload di test con `booking_type:"cena"` non
  ammesso dal CHECK constraint → verificato lo schema e riprovato con `tavolo`. Lezione: leggere i
  vincoli prima di costruire payload di test.
- **Migliorie suggerite (come dato, non modifica):** valeva la pena avere, in `PRENOTA_TEXT_LIMITS_MAP`,
  una riga «slug TEST corrente» — ho perso un giro perché lo slug era `ristorante-test-pro`, non
  `test-pro`. Forse un puntatore agli slug/seed correnti nel DB_SKILL.

### 9. Derivazione errori

- **Edge TEST disallineata dal repo (G1):** *vincolo strutturale/processo* — il deploy edge non è
  automatico col commit; il repo era giusto, il deployato no. Evitabile con la voce «verifica deploy
  edge» già suggerita nel report Verifica precedente (R5 di FU-031). Ora FU-034 lo include per PROD.
- **`numGuestsMax` 999 morto (G4):** *bug preesistente* — costante e input mai allineati; il 999 non
  era raggiungibile da UI. Derivava da un valore messo «generoso» senza ricontrollare l'input.
- **500 sul probe valido:** *errore agente* (mio) — payload di test con enum non valido; evitabile
  leggendo il CHECK prima. Nessun impatto sul prodotto.

### 10. Cosa resta per la prossima sessione

- **FU-034** (nuovo, Aperto): allineamento PROD ↔ TEST + verifica build + deploy edge su PROD, sessione
  senior con conferma Matteo.
- **QA visivo Prenota** su viewport reali (non ancora fatto) — prerequisito mio per «vendibile».
- Aree non ancora mappate: **Menu QR pubblico** (candidato successivo, da `PROSEGUIMENTO_MAPPATURA_SKILL`).

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «Sei agente senior meta comunicazione. Hook di chiusura. è molto insistente… far ripetere la rilettura a mente fredda qualche volta in meno, al massimo tre volte… fare revisionare anche gli altri report… cerchiamo di fare in modo che l'agente revisioni il proprio report. si può fare?» (2) «guarda, i report di agenti che hanno lavorato oggi… come si sono trovati con hook?… capire se posso tenere a 3 il limite… 2. come funzionerebbe sub agent? se qualcosa manca corregge lui o da prompt a vecchio agente?… dopo report finale… sub agent fa una contro verifica del lavoro degli agenti coinvolti.» (3) «1 sì. 2 facciamolo. se rimanda userà skill prepara prompt… o mi da prompt da dare a agente prepara prompt.» (4) «se fosse semplicemente un profilo revisore gia esistente? se lo mettiamo li invece che in prepara?» (5) «ti dico dalla sezione Q1 perchè avrà anche i file di contesto di senso… seguendo il flusso dati e utente… nuovo file skill dedicato.» (6) «ok intanto fai commit… vorrei averlo attivo gia domani… poi… dai una revisionata al completamento della mappatura fatto da agente codex… vorrei che anche tu lo controverificassi… puoi lanciare sub agent per trovare bug o testare il flusso?» (7) «chiudiamo anche runtime.» (8) Decisioni runtime: ospiti «110», testo «solo taglio silenzioso». (9) «prepara follow up per allineare prod e testare build… ci metteresti la firma e venderesti anche solo la pagina prenota?» (10) «fai report finale».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato su `git diff 95d8860 HEAD`: **9 file, +224 −43**. Hook: `fine-sessione-nudge.mjs` (loopCount>=3, findRecentReports ritorna 1 solo report, isSubstantive). `bookingPrenotaTextLimits.ts` riga 17 = `numGuestsMax: 110` (confermato). `create-booking/index.ts` riga 16 = 110 (confermato) + deploy **v7** verificato via `list_edge_functions` (version 7, verify_jwt false). `BookingRequestForm.tsx`: blocco num_guests senza ramo >max, blocchi dietary/special rimossi (sostituiti da commento). Probe runtime registrato nei log edge (400 e 201 reali, timestamp v7). `npm run test` ri-eseguito = 291 OK. FU-031 riga = «Fatto»; FU-034 = nuova riga Aperto. Booking di test `ddce1733…` creato e poi cancellato (DELETE eseguito).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati in questa chiusura: `PRENOTA_TEXT_LIMITS_MAP.md` §H (ospiti 110 + validazione) col fix codice; `FOLLOW_UP.md` (FU-031 Fatto, FU-034 nuovo); `CHIUSURA_SESSIONE.md` + `APP_CONTEXT_SKILL.md` col nuovo `CONTROVERIFICA.md`. Test: `bookingPrenotaTextLimits.test.ts` non ancorava 999 → resta verde (verificato). NON allineato di proposito: PROD (è FU-034). `PRENOTA_DATA_FLOW_CONTEXT.md` non toccato (il fix non cambia il flusso resolver, solo i cap). `PRENOTA_SKILL.md §3` già coerente (taglio silenzioso): nessuna modifica necessaria.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: NON fatto QA visivo della pagina Prenota su viewport reali (mobile/desktop) — l'ho dichiarato come limite alla domanda «firma». NON allineato PROD (volutamente → FU-034). NON fatto `npm run build` (solo validate/test): la build Vite la fa FU-034 prima del merge. NON pushato su `main` (commit solo su env/test locale). Tutto il resto richiesto in chat è chiuso.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: ho perso un giro perché lo slug TEST reale era `ristorante-test-pro` e non `test-pro` come citato in un report precedente. Miglioria: una riga «slug/seed TEST correnti» in `DB_SKILL.md` o `RESET_TEST_DATABASE.md`, aggiornata dal seed, così gli agenti non indovinano lo slug per i probe edge.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto: `CHIUSURA_SESSIONE`, `PRENOTA_DATA_FLOW_CONTEXT`, `PRENOTA_TEXT_LIMITS_MAP`, regole PROD da CLAUDE.md bastavano. Hook guard-prod NON è scattato (ho operato su TEST, corretto). Hook fine-sessione: questa è la prima chiusura con la **v5** che ho appena scritto — la self-review §12 l'ho applicata manualmente prima di chiudere. La controverifica imparziale (CONTROVERIFICA.md) parte ORA come sub-agent dopo questo report finale: prova reale end-to-end del meccanismo costruito oggi.
