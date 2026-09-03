# Report — Carosello Menu QR: testi della slide facoltativi (03-09-26)

**Data:** 03-09-2026 · **Branch:** `env/test` · **HEAD all'avvio:** `65d7269`
**Profilo:** Esecuzione · **Modalità:** standard · **Ambiente DB:** nessuna operazione DB (solo codice)
**Rilascio:** `env/test` `ab4c750` → `main` `fc4d648` (cherry-pick) → PrenotaZen pubblica `f30a8ad`

- **Cosa è cambiato:** nel modale «Impostazione Menù QR» → sezione **Carosello specialità** un QR si salva con la **sola foto**: Etichetta, Titolo slide e Descrizione breve non bloccano più il Salva, e nel menù pubblico una slide senza testo mostra la foto pulita senza il velo scuro.
- **Cosa resta:** una domanda aperta lasciata a Matteo — se un domani vorrà salvare un QR **senza nessuna foto** (oggi almeno una foto resta obbligatoria). Nessuna riga FU aperta: non l'ha chiesto.
- **Serve una tua azione:** no. Matteo ha già controtestato in produzione («tutto funzionante in prod», 03-09-26).

---

## 2. Cosa è stato fatto

1. **Modale QR, sezione Carosello (Mario ristoratore):** carica una foto, lascia i tre campi vuoti, preme Salva → il QR si salva. Prima usciva il toast «Ogni foto del carosello deve avere etichetta e titolo compilati, oppure rimuovi la slide incompleta».
2. **Riga di aiuto sopra le slide:** «Etichetta, titolo e descrizione sono facoltativi: lascia vuoto ciò che non vuoi mostrare», accanto al pulsante «Aggiungi foto».
3. **Requisito rimasto:** carosello vuoto → «Il carosello è obbligatorio: aggiungi almeno una foto.» (prima il messaggio chiedeva anche etichetta e titolo). Restano invariati nome QR, ≥1 categoria e ≥1 ingrediente visibile, e l'ordine di priorità dei messaggi (categorie prima del carosello).
4. **Menù pubblico (Anna cliente):** slide con testo identica a prima; slide senza nessun testo = foto piena senza gradiente scuro a sinistra (il gradiente serviva solo a rendere leggibile il testo).
5. **Rilascio completo su richiesta di Matteo** (scelta «Tutto fino a PrenotaZen»): push `env/test`, cherry-pick della sola fetta di codice su `main`, push `main`, `release:prenotazen` + build + push della repo pubblica.
6. **Pagina Prenota non toccata:** lì i testi del carosello erano già facoltativi (nessuna validazione che li imponga, fallback «Foto N» in `bookingPublicFormConfig`). Verificato, non modificato.

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `src/features/booking/utils/menuQrValidation.ts` | tolti i due controlli «slide incompleta»; resta «almeno una foto», messaggio riscritto |
| `src/features/booking/utils/__tests__/menuQrValidation.test.ts` | 2 casi nuovi (slide con sola foto; carosello misto) + caso «senza foto» riscritto sul nuovo messaggio |
| `src/features/booking/components/MenuHomepageConfigPanel.tsx` | riga «i testi sono facoltativi» nella testata della sezione carosello |
| `src/pages/PublicMenuPage.tsx` | gradiente overlay solo se la slide ha testo; `description` normalizzata con `trim()` come eyebrow |
| skill/contesti Menu QR (tabella §5) | la regola vecchia era scritta in 5 punti diversi |
| questo report + judgments | chiusura |

Nessuna migrazione, nessuna Edge Function, nessuna scrittura DB: `carousel_items` è una colonna JSON già esistente e i campi erano già opzionali a schema.

---

## 4. Test eseguiti e risultato

| Verifica | Esito |
|----------|--------|
| `npm run validate` su `env/test` (2 giri: dopo il codice e dopo i docs) | exit 0 · lint + typecheck + vitest · MSS tools 73 test · `validate:mss:views` ok · `check-doc-paths` 197 file / 0 path rotti |
| `npx vitest run src/features/booking/utils/__tests__/menuQrValidation.test.ts` | 7 test verdi |
| Su `main` dopo il cherry-pick: `npx tsc --noEmit` · `npx eslint src --max-warnings=0` · `npx vitest run src` | exit 0 · exit 0 · **127 file / 1048 test** verdi |
| `npm run build` in PrenotaZen (prima del push pubblico) | verde (`✓ built in 9.00s`, PWA 19 entries) |
| `git diff main env/test -- scripts/sync-to-prenotazen.mjs scripts/prenotazen-overrides/` | vuoto = macchina di rilascio allineata (regola della trappola 03-09-26) |
| Controtest di Matteo in produzione | «controtestato e è ok. tutto funzionante in prod» |
| `npm run validate` dopo la scrittura del report | **prima rosso** (2/73 MSS tools: viste generate non allineate al disco), poi `node scripts/mss/views.mjs --write` → rilanciato **exit 0** |

**Dato che NON ho:** i conteggi file/test del `vitest` dentro `npm run validate` su `env/test` (ho catturato solo l'exit code); i numeri 127/1048 valgono per il run su `main`. Non li riporto come se fossero di env/test.

### 4-bis. Fail procedura capsula

_(si riempie solo se `mss:capsule` o `validate:mss --require-capsule` falliscono; vedi §9 per i due attriti di rilascio, che non riguardano la capsula.)_

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Menu-QR-Skill/MENU_QR_SKILL.md` | §3 il LOCK «Carosello obbligatorio» diventa «carosello obbligatorio, testi della slide FACOLTATIVI» con data e divieto di reintrodurre il requisito; §4 i messaggi-requisito passano da 5 a 4 | la regola vecchia era un LOCK esplicito: senza riscriverlo il prossimo agente lo «ripristina» |
| `docs/Menu-QR-Skill/MENU_QR_MINI.md` | §5 LOCK carosello: «≥1 foto; testi slide facoltativi dal 03-09-26» | la mini-skill è la copia corta letta dagli agenti veloci |
| `docs/Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md` | riga «Validazione Salva» della tabella interventi | descrive cosa blocca il salvataggio |
| `docs/Menu-QR-Skill/contesto/MENU_QR_REFERENCE.md` | 4 punti: RULE «Modale QR … al Salva obbligatori carosello», RULE `canSave` («≥1 slide completa» → «≥1 foto»), RULE «Testo sovrapposto su immagini carosello» (gradiente solo con testo), riepilogo §5.3 carosello | le RULE sono la fonte operativa citata dagli agenti; le ultime 3 le ha trovate la controverifica (§12-bis), non il mio primo grep |
| `docs/Menu-QR-Skill/contesto/MENU_QR_LAYOUT_CONTEXT.md` | §3 riga «Overlay testo» + §4: il gradiente segue il testo, slide senza testo = foto pulita | chi ricostruisse `MenuCarousel` da qui rimetterebbe il velo scuro sempre |
| `docs/Menu-QR-Skill/contesto/MENU_QR_TEST_SUITE_INDEX.md` | riga di `menuQrValidation.test.ts`: cosa copre ora | l'indice deve dire cosa è blindato davvero |
| `docs/SESSION_LOG.md` | riga 03-09-26 con link a questo report | indice delle sedute |

Non toccato: `MENU_QR_TEXT_LIMITS_MAP.md` (parla solo dei tetti 40/60/125, che restano). I report storici in `Sessioni di lavoro/29-05-26` e `13-06-26` restano come sono: sono cronaca, non regola viva.

---

## 6. Dati comunicazione

- **Prompt sostanziali di Matteo: 3** — (1) il mandato con DOM path + «se modifica è facile falla, altrimenti prepara prompt per agente»; (2) «controtestato e è ok. tutto funzionante in prod.»; (3) «lavoro ok e fai anche report finale». Più **1 risposta a griglia** (dove portare il rilascio).
- **Formato che ha funzionato:** la prima risposta ha aperto con la schermata («nel modale Impostazione Menù QR → Carosello specialità … si salva con la sola foto») e ha chiuso con una tabella numerata di prove da fare. Nessuna correzione dopo.
- **Ricorrenze:** il DOM path incollato da Cursor è di nuovo il modo con cui Matteo indica *dove* (già visto il 30-05-26 sullo stesso componente). Continua a funzionare: dal `React Component: MenuQrCarouselSection` l'area si instrada senza domande.
- **Automatizzabile con certezza:** i requisiti del Salva (già in Vitest, 7 casi). **Manuale:** il giudizio «una foto senza testo sta bene o sembra vuota», che è ciò che Matteo ha controtestato in produzione.

### Regia di Matteo (campi fissi)

| Campo | Dato |
|-------|------|
| Opzioni offerte → scelta | 1 griglia (fin dove rilasciare) → «Tutto fino a PrenotaZen» |
| Vincoli aggiunti da lui | la modifica deve stare in **tutti e tre** gli ambienti (prod PrenotaZen, env/test, main) |
| Criterio: prima o dopo? | prima (il criterio «i campi non devono essere per forza compilati» era già nel mandato) |
| Cosa NON ha chiesto | togliere anche l'obbligo della foto; toccare i tetti 40/60/125; toccare il carosello di Prenota |
| Correzioni: direzione + materia | nessuna correzione dopo la consegna |

---

## 6-bis. Registrazione di seduta (MSS)

La capsula viene appesa in coda dal generatore (`mss:capsule --append-to`). I controlli in `controls[]` coincidono con §4.

---

## 7. Analisi flusso prompt, efficienza e statistiche

| Misura | Dato |
|--------|------|
| Prompt sostanziali di Matteo | 3 (+1 risposta a griglia) |
| Correzioni dopo la 1ª consegna | 0 |
| Follow-up generati | 0 righe FU; 1 domanda aperta lasciata a Matteo (§10) |
| Modalità alzata | no |
| Sub-agenti lanciati | 0 — il mandato li prevedeva solo «se la modifica non è facile»: era una funzione di validazione, l'ho fatta io e l'ho dichiarato |
| Commit | 3 (env/test, main, repo pubblica) |

**Anatomia:** il mandato era efficace perché conteneva il *dove* (DOM path → componente), il *cosa* («i campi non devono essere per forza compilati») e il *fin dove* (tre ambienti), più una regola di scala (facile → fallo tu). L'unica ambiguità reale — «testi facoltativi» significa anche «foto facoltativa»? — l'ho risolta tenendo la foto obbligatoria e **dichiarando l'assunzione** con la domanda in coda, invece di bloccare il lavoro.

---

## 8. La TUA lettura della sessione

- **Impressioni:** l'instradamento ha funzionato al primo colpo — `.claude/CLAUDE.md` → §0 → skill Menu QR, e la skill dice per iscritto che «carosello obbligatorio» è una **decisione**, non una svista. Questo ha cambiato il lavoro: non ho «aggiustato una validazione», ho ribaltato un LOCK e riscritto i 5 punti che lo dichiaravano.
- **Difficoltà:** (1) il rilascio verso `main` **non** è un merge — `env/test` ha ~190 commit non rilasciati (S4 Servizio, MSS): un merge avrebbe pubblicato roba non voluta, serviva il cherry-pick della sola fetta. (2) Su `main` `npm run validate` è **rosso per forza**: `docs/Archives/` (che su env/test è gitignored) lì risulta untracked e eslint/vitest lo scandagliano; e `validate:app` su main non esiste. (3) Lo script di rilascio si è rifiutato per «working tree sporco» a causa degli stessi file untracked.
- **Migliorie (dato, non modifica di skill):** `CHIUSURA_SESSIONE.md` Parte B §3 descrive l'allineamento `env/test → main` **solo** come fast-forward («se merge-base è ancestor»); nella realtà di oggi main è avanti di suo e il rilascio è per cherry-pick — la ricetta vera vive solo nella memoria di sessione. Suggerisco che una seduta Meta porti la variante cherry-pick dentro §3, con il pre-check `git diff main env/test -- scripts/sync-to-prenotazen.mjs scripts/prenotazen-overrides/`.

---

## 9. Derivazione errori

| Cosa | Classe | Da dove derivava | Come evitarlo |
|------|--------|------------------|----------------|
| `validate` rosso su `main` (lint/test dentro `docs/Archives`) | vincolo strutturale | `main` è indietro anche sul `.gitignore`: Archives è ignorato solo su env/test | messi `docs/Archives/`, `.claude/mcp.json`, `.claude/settings.local.json` in `.git/info/exclude` (locale, nessun file spostato — Archives contiene dati anagrafici, non va stashato) |
| `sync-to-prenotazen` rifiuta: «working tree sporco su main» | vincolo strutturale | stessa causa: la guardia legge gli untracked | stesso fix; la guardia è giusta, non va allentata |
| `npm run validate:app` non esiste su `main` | vincolo strutturale | `package.json` di main più vecchio | su main verificare con `npx tsc --noEmit` + `npx eslint src` + `npx vitest run src` |
| Primo `git commit` fermato dal cold-check pre-commit | non è un errore | comportamento voluto dell'hook | rilanciare lo stesso commit dopo la rilettura (documentato in `CHIUSURA_SESSIONE.md` Parte B §2) |
| `validate` rosso dopo aver scritto il report (viste generate stale) | non è un errore | l'indice report e il cruscotto sono viste **generate**: un report nuovo li disallinea per definizione | rigenerare con `node scripts/mss/views.mjs --write` prima del commit di chiusura, non toccare i file generati a mano |
| Grep di verifica più stretto della regola («etichetta e titolo», non «slide completa») | errore agente | ho cercato le **parole del messaggio** che avevo cambiato, non tutti i **modi di dire la regola** | cercare la regola per concetto e sinonimi; è esattamente la prova che propongo in R7, e alla prima passata non ha retto |
| Messaggio di commit con `@` in prima riga | errore agente | ho usato la sintassi here-string di PowerShell (`-m @'…'@`) dentro la shell Bash | in Bash usare `git commit -F -` con heredoc; corretto con `--amend` prima del push |

Nessun pattern nuovo da appendere in `ERRORI_PROCESSO.md`: i primi tre sono la stessa causa (main indietro) e vivono già nella memoria di rilascio; l'ultimo è mio e non ricorrente.

---

## 10. Cosa resta per la prossima sessione

- **Domanda aperta a Matteo:** vuole poter salvare un QR **senza nessuna foto** nel carosello? Oggi ≥1 foto resta obbligatoria (senza foto la homepage mostrerebbe uno spazio vuoto col colore del tema). È una riga sola da togliere in `menuQrValidation.ts`. Non ho aperto una riga FU perché non l'ha chiesto.
- **Nessun debito tecnico** lasciato da questa seduta: codice, test e skill sono allineati e in produzione.
- **`FU-METODO-SMOKE-ESECUTORE-1`** resta aperto (owner Meta senior), non toccato qui.

---

## 10-bis. Handoff al prossimo agente

**Cosa è vero adesso.** `validateMenuQrSettings` (in `src/features/booking/utils/menuQrValidation.ts`) applica, in quest'ordine: ≥1 categoria selezionata → ≥1 ingrediente visibile → ≥1 slide con `image_url`. **Non** esiste più nessun controllo su `eyebrow`/`title`/`description`. `MenuQrCarouselSection` mostra la riga «i testi sono facoltativi». `MenuCarousel` in `PublicMenuPage.tsx` calcola `hasOverlayText` e disegna il gradiente solo se c'è testo.

**Decisioni chiuse (non riaprire):** testi della slide facoltativi (Matteo 03-09-26, controtestato in prod); foto ancora obbligatoria; tetti 40/60/125 invariati; carosello di Prenota non toccato perché era già libero.

**Owner dello stato:** la regola vive in `docs/Menu-QR-Skill/MENU_QR_SKILL.md` §3-§4 (+ mini-skill e i 3 file di `contesto/`). I numeri restano nel codice.

**Autorizzazioni e divieti:** il rilascio pubblico di oggi era autorizzato esplicitamente da Matteo; un prossimo rilascio richiede una **nuova** conferma. Verso `main` si va di cherry-pick, mai di merge (env/test ha ~190 commit non destinati alla produzione). Prima di ogni release: `git diff main env/test -- scripts/sync-to-prenotazen.mjs scripts/prenotazen-overrides/` deve essere vuoto.

**Maturità:** **G** regola scritta nelle 5 skill; **O** osservata da Matteo in produzione (controtest 03-09-26); **E** controllata in automatico da `menuQrValidation.test.ts` (7 casi, dentro `npm run validate`).

Lavoro **terminale**: non serve un agente successivo, salvo che Matteo risponda alla domanda di §10.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1: File letti (blob `git rev-parse <commit>:<path>`): `.claude/CLAUDE.md` @`65d7269` = `bd0ab6100cb061e9e836b5b2d4533db190521ce1`; `docs/Menu-QR-Skill/MENU_QR_SKILL.md` @`65d7269` = `2db42f3c8bc5ba493b399cb55386e81c604c0c98`; `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` @`ab4c750` = `77177a7f76b8a7b4cef7e49857a811fd60261218`; `docs/MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md` @`ab4c750` = `dd0bd3834510cc7ac6eb7b57f32feb2ba850b1b2`. Mandati **non** in repo, verbatim dalla chat 03-09-26: (1) «modifica da fare direttamente in tutta app, sia produzione prenotazen che env test e main : non sono piu obbligatori testo in immagini carosello. […] i campi qua dentro non devono essere perforza copmilati. se modifica è facile falla, altrimenti prepara prompt per agente e tu farai da revisore del suo lavoro. poi lanci sub agent con prompt che hai preparato.» + DOM path con `React Component: MenuQrCarouselSection`; (2) risposta alla griglia: «Tutto fino a PrenotaZen»; (3) «controtestato e è ok. tutto funzionante in prod.»; (4) «lavoro ok e fai anche report finale».

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2: sì — `ab4c750` tocca 9 file (+76/−47) e `fc4d648` è il suo cherry-pick, `f30a8ad` porta pubblicamente i soli 4 file di `src/`; i numeri 127/1048 sono del run su `main` ed è scritto in §4 che su `env/test` ho solo l'exit code; i `controls[]` della capsula sono gli stessi comandi di §4 rieseguiti dal generatore.

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3: **no alla prima passata, sì adesso.** Il mio grep iniziale (`etichetta e titolo|Carosello obbligatorio|carosello è obbligatorio`) era **più stretto della regola** e mi ha fatto dichiarare completa una spazzata che non lo era: la controverifica (§12-bis) ha trovato in `MENU_QR_REFERENCE.md` la RULE `canSave` con «carosello ≥1 slide completa» — la regola vecchia viva nello stesso file che avevo corretto due righe più su — e tre punti (REFERENCE RULE gradiente + riepilogo §5.3, LAYOUT §3/§4) dove il velo scuro sulle slide era descritto come sempre presente. Corretti tutti e quattro in questa chiusura e rifatto il controllo con un grep largo (`slide completa|slide incompleta|etichetta e titolo|etichetta + titolo` su tutte le skill d'area + `gradiente|overlay` su Menu-QR): nei doc vivi restano solo le occorrenze che **enunciano la regola nuova**. §5 aggiornata di conseguenza.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) non ho tolto l'obbligo della **foto** — assunzione dichiarata a Matteo, non confermata né smentita; (2) non ho lanciato il sub-agente previsto dal mandato «se non è facile» (era facile: una funzione di validazione); (3) non ho aperto una riga in `FOLLOW_UP.md` per la domanda di §10; (4) non ho verificato il deploy Vercel della PrenotaZen pubblica — quel progetto non è nel team visibile da qui, l'ho detto a Matteo che l'ha controllato lui; (5) non ho toccato il carosello di Prenota (verificato: già libero) né i tetti 40/60/125.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5: attrito = `CHIUSURA_SESSIONE.md` Parte B §3 descrive l'allineamento a `main` solo come fast-forward, mentre il rilascio reale di oggi è stato per cherry-pick (main avanti di suo, env/test con ~190 commit non destinati alla produzione) e la ricetta giusta vive solo fuori dal repo; proposta = una seduta Meta aggiunga a §3 la variante cherry-pick con il pre-check sulla macchina di rilascio, così un agente freddo non fa un merge che pubblica S4/MSS per sbaglio.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: giusto in fase di lavoro (skill Menu QR intera + i 3 file di contesto citati + il file di validazione: bastava, e la riga «è un requisito voluto» ha evitato che trattassi il LOCK come un bug); **poco** in fase di chiusura, perché la procedura di rilascio verso produzione non è nel routing di `CLAUDE.md` (l'ho ricostruita dalla memoria di sessione e dall'intestazione dello script). Hook utili, non rumore: il cold-check pre-commit mi ha fatto rileggere lo stage due volte su tre commit.

❓ Q7 — Prova nuova: quale **prova utile** hai visto in questa seduta che oggi **non** misuriamo? Una riga: **che cosa separerebbe** e **come si giudica** (chi guarda, con quale fonte, quanto costa). Se non ne hai viste, scrivi `nessuna` e di' **su cosa** ti aspettavi di trovarne una.
✅ R7: **prova «la regola viva è una sola»** — dopo aver cambiato un LOCK, contare le occorrenze della regola vecchia nei doc vivi (`grep` sul testo del messaggio-requisito, escluso `_lavoro/` e i report storici) e pretendere zero: separa «ho cambiato il codice» da «ho cambiato il sistema che governa il codice», che è la falla vera in un repo dove la stessa regola è scritta in 5 punti; la giudica chiunque, con `grep`, in ~10 secondi, e si può automatizzare come gate solo se il messaggio-requisito è unico (qui lo era).

---

## 12. Self-review del report

1. **Triade MSS:** `npm run validate` verde su env/test prima dei commit; `test:mss` + `git diff --check` girano come `controls[]` dentro l'append della capsula; `validate:mss --require-capsule` subito dopo.
2. **§5 tabella skill** allineata in questa chiusura (5 file Menu QR + SESSION_LOG), non rimandata; il controllo `grep` è in R3.
3. **§11 coerente:** ho corretto in §4 la tentazione di attribuire i conteggi 127/1048 a `env/test` — sono del run su `main`; su env/test dichiaro solo l'exit code, che è ciò che ho davvero catturato.
## 12-bis. Controverifica imparziale (sub-agente, dopo il «report finale»)

Lanciata secondo `docs/Comunicazione-Skill/CONTROVERIFICA.md` su un agente che non ha eseguito il lavoro.
**Verdetto: ⚠️ 2 problemi**, entrambi di allineamento documentale, nessuno sul codice.

| Problema | Dove | Esito |
|---|---|---|
| La regola vecchia «carosello ≥1 slide completa» sopravviveva nella RULE `canSave`, nello stesso file già corretto due righe più su | `contesto/MENU_QR_REFERENCE.md` | **corretto in questa chiusura** |
| Il gradiente sulle slide era descritto come sempre presente, mentre ora segue il testo | `contesto/MENU_QR_REFERENCE.md` (RULE testo sovrapposto + riepilogo §5.3) e `contesto/MENU_QR_LAYOUT_CONTEXT.md` §3-§4 | **corretto in questa chiusura** |

Controlli **passati** secondo il sub-agente: nessuno scope creep (riga di aiuto e gradiente condizionale sono conseguenze della richiesta, la seconda coerente col principio già scritto «campo vuoto → niente, NON fallback»); assunzione «foto obbligatoria» sana e dichiarata; **rilascio pulito** — `fc4d648` è identico ad `ab4c750` e `f30a8ad` porta i soli 4 file `src/`, nessuna riga dei ~190 commit non destinati alla produzione è finita in PrenotaZen; numeri di §4 rieseguiti e veri (7 test, 73 MSS tools, 197 file / 0 path rotti), e la cautela su 127/1048 era giustificata (su `env/test` i file di test sono 163, non 127).

Le correzioni non sono state rimandate a `prepara-prompt` perché sono **allineamento skill della stessa seduta**, che `CHIUSURA_SESSIONE.md` §5 vieta esplicitamente di trattare come follow-up.

---

## Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619","correlation_id":"mss-cor-01a066b5-f57d-7a43-af42-b88045129814","segment_no":1,"created_at":"2026-09-03T11:59:56+02:00","finalization":"final","recorded_by":{"actor_id":"claude-code-opus5-esecutore-carosello-testi-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Anthropic","model":"Claude Opus 5 (claude-opus-5)","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"session_event","record_id":"mss-rec-01a066b5-f57d-7303-84ef-40dfe712f509","capture_key":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619/1/session_event/1","event":{"event_id":"mss-evt-01a066b5-f57d-7c41-bebd-72b8afb54dfc","event_kind":"session_close","occurred_at":"2026-09-03T11:59:56+02:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"non_osservato: il generatore non legge la chat","session_type":"standard","capsule_status":"completa","role_key":"agente esecutore","area":"non_osservato: area della seduta non dedotta dalla chat","environment":"branch env/test; HEAD ab4c750; 2 file in working tree","authorization":{"read":[],"write":["docs/Sessioni di lavoro/03-09-26/Report-carosello-testi-facoltativi-menu-qr-03-09-26.md"],"forbid":[]},"authorized_outputs":["docs/Sessioni di lavoro/03-09-26/Report-carosello-testi-facoltativi-menu-qr-03-09-26.md"],"route":{"chosen":"mss:capsule modalita R1 compatta","alternatives_or_conflicts":"nessuno"},"observed_outcome":"non_osservato: esito narrativo non dedotto dalla chat; fatti macchina restano in controls/Git","open_items":"non_osservato: il generatore non deduce i follow-up dal report","controls":[{"control_id":"TEST_MSS","criterio":"npm run test:mss (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npm run test:mss (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"GIT_DIFF_CHECK","criterio":"git diff --check (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: git diff --check (exit 0; atteso 0)","evidence_refs":[]},{"control_id":"VITEST_MENU_QR","criterio":"npx vitest run src/features/booking/utils/__tests__/menuQrValidation.test.ts (atteso exit 0)","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:capsule: npx vitest run src/features/booking/utils/__tests__/menuQrValidation.test.ts (exit 0; atteso 0)","evidence_refs":[]}],"subject_runtime":{"actor_id":"non_osservato: soggetto della seduta","provider":"non_osservato: provider del soggetto della seduta","model":"non_osservato: modello del soggetto della seduta","runtime":"non_osservato: runtime del soggetto della seduta","surface":"non_osservato: superficie del soggetto della seduta"},"privacy":{"classification":"internal","capture_basis":"operational_need","allowed_content":["metadati Git","esiti dei controlli dichiarati"],"prohibited_content":["dati personali","segreti","materiale privato non registrabile"],"redactions":"nessuno","external_release":"requires_confirmation","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[],"source_refs":[]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619","correlation_id":"mss-cor-01a066b5-f57d-7a43-af42-b88045129814","segment_no":1,"created_at":"2026-09-03T11:59:56+02:00","finalization":"final","recorded_by":{"actor_id":"claude-code-opus5-esecutore-carosello-testi-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Anthropic","model":"Claude Opus 5 (claude-opus-5)","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a066b5-f57d-7c07-b23e-b72eae838e3a","capture_key":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619/1/annotation/1","annotation":{"annotation_id":"mss-ann-01a066b5-f57d-7bb9-b0dd-c8c6adca1dcd","axis":"persona","subject_record_ids":["mss-rec-01a066b5-f57d-7303-84ef-40dfe712f509"],"delta":"nessuno","assertions":[],"asserted_by":{"actor_id":"claude-code-opus5-esecutore-carosello-testi-03-09-26","role":"agente esecutore","basis":"self_report"},"verification":{"status":"unverified","verified_by":[],"verified_at":"non_applicabile:nessuna valutazione Persona","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619","correlation_id":"mss-cor-01a066b5-f57d-7a43-af42-b88045129814","segment_no":1,"created_at":"2026-09-03T11:59:56+02:00","finalization":"final","recorded_by":{"actor_id":"claude-code-opus5-esecutore-carosello-testi-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Anthropic","model":"Claude Opus 5 (claude-opus-5)","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a066b5-f57d-7244-b25c-b9c377e5571e","capture_key":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619/1/annotation/2","annotation":{"annotation_id":"mss-ann-01a066b5-f57d-74fa-8194-f467e27f2883","axis":"sistema","subject_record_ids":["mss-rec-01a066b5-f57d-7303-84ef-40dfe712f509"],"delta":"modificato","assertions":[{"rule_id_version":"MENU_QR_SKILL@carosello-testi-slide-facoltativi-03-09-26","trigger_event":"Mandato Matteo 03-09-26: «non sono piu obbligatori testo in immagini carosello … i campi qua dentro non devono essere perforza compilati», da applicare in produzione PrenotaZen, env/test e main","decision_or_output_changed":"Il LOCK «Carosello obbligatorio = almeno una slide completa (foto + etichetta + titolo)», deciso il 30-05-26, diventa «carosello obbligatorio = almeno una foto; etichetta, titolo e descrizione della slide sono facoltativi». validateMenuQrSettings perde i due controlli di slide incompleta e tiene solo la presenza di una foto; il messaggio-requisito passa da 5 voci a 4. Allineati MENU_QR_SKILL §3-§4, MENU_QR_MINI §5, MENU_QR_DATA_FLOW_CONTEXT (riga Validazione Salva), MENU_QR_REFERENCE (RULE modale QR) e MENU_QR_TEST_SUITE_INDEX.","G":2,"O":1,"E":2}],"asserted_by":{"actor_id":"claude-code-opus5-esecutore-carosello-testi-03-09-26","role":"agente esecutore","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","session_id":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619","correlation_id":"mss-cor-01a066b5-f57d-7a43-af42-b88045129814","segment_no":1,"created_at":"2026-09-03T11:59:56+02:00","finalization":"final","recorded_by":{"actor_id":"claude-code-opus5-esecutore-carosello-testi-03-09-26","actor_type":"agente","role":"agente esecutore","agent_runtime":{"provider":"Anthropic","model":"Claude Opus 5 (claude-opus-5)","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["non_applicabile: non dichiarato dall'agente a fine seduta"]},"packages_loaded":[{"package_id":"non_applicabile: non dichiarato dall'agente a fine seduta","package_version_or_revision":"non_applicabile: non dichiarato dall'agente a fine seduta","source_ref":"non_applicabile: non dichiarato dall'agente a fine seduta"}],"record_type":"annotation","record_id":"mss-rec-01a066b5-f57d-7204-be8c-11468a6c22f7","capture_key":"mss-ses-01a066b5-f57d-767c-b54a-e404d1817619/1/annotation/3","annotation":{"annotation_id":"mss-ann-01a066b5-f57d-7ab8-afb3-4702efd155b7","axis":"output","subject_record_ids":["mss-rec-01a066b5-f57d-7303-84ef-40dfe712f509"],"delta":"creato","assertions":[{"output_id":"carosello-testi-facoltativi-menu-qr-03-09-26","primary_type":"prodotto","canonical_version":"docs/Sessioni di lavoro/03-09-26/Report-carosello-testi-facoltativi-menu-qr-03-09-26.md","recipient":"Matteo e i ristoratori che usano il modale Impostazione Menù QR","problem_or_job":"nel modale QR il Salva rifiutava una slide del carosello senza etichetta e titolo; ora basta la foto e i tre campi di testo si possono lasciare vuoti","intended_use":"creare o modificare un Menù QR caricando solo le foto del carosello; nel menù pubblico la slide senza testo mostra la foto pulita","conceived_by":"Matteo","decided_by":"Matteo","directed_by":"mandato chat 03-09-26 (profilo Esecuzione) + scelta di rilascio «Tutto fino a PrenotaZen»","authored_by":"claude-code-opus5-esecutore-carosello-testi-03-09-26","verified_by":"Matteo (controtest in produzione 03-09-26: «controtestato e è ok. tutto funzionante in prod»)","acceptance_criterion":"un QR con slide senza testi si salva; carosello vuoto resta bloccato con «Il carosello è obbligatorio: aggiungi almeno una foto.»; nome QR, categorie e ingrediente visibile restano requisiti; npm run validate verde su env/test; build verde nella repo pubblica prima del push","verification_or_use_evidence":"npm run validate exit 0 su env/test; menuQrValidation.test.ts 7 casi; su main tsc + eslint src + vitest run src = 127 file / 1048 test; npm run build PrenotaZen verde; commit env/test ab4c750, main fc4d648, PrenotaZen f30a8ad; controtest di Matteo in produzione","verification_status":"independently_verified","owner_ref":"docs/Menu-QR-Skill/MENU_QR_SKILL.md","privacy_release":"public","support_files":["src/features/booking/utils/menuQrValidation.ts","src/features/booking/utils/__tests__/menuQrValidation.test.ts","src/features/booking/components/MenuHomepageConfigPanel.tsx","src/pages/PublicMenuPage.tsx"],"relations_no_double_count":["Non include i tetti 40/60/125 del carosello QR né 30/70 delle card categoria: restano invariati.","Non include il carosello della Pagina Prenota: lì i testi erano già facoltativi, verificato e non modificato.","Non include l'obbligo della foto, che resta in vigore."],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"pass","result":"eligible"}}],"asserted_by":{"actor_id":"claude-code-opus5-esecutore-carosello-testi-03-09-26","role":"agente esecutore","basis":"self_report"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"non_applicabile: criterio di verifica non raccolto automaticamente","evidence_refs":[],"notes":"non_osservato: note di verifica non raccolte automaticamente"}}}
```
