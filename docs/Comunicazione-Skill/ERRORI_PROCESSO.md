# ERRORI DI PROCESSO — registro difficoltà e bug incontrati dagli agenti

> **Chi scrive:** gli agenti di lavoro, a fine chat (sezione "Derivazione errori" del report §7.1
> → i pattern ricorrenti li appendono qui).
> **Chi legge e valuta:** l'agente revisore Meta in sessione separata (vedi [REVISIONE.md](REVISIONE.md)).
> Gli agenti di lavoro registrano solo dati grezzi; non riformano le skill.
>
> Scopo: capire **dove lo skill system fa perdere tempo**. A differenza di [OSSERVAZIONI.md](OSSERVAZIONI.md)
> (che raccoglie dati su *come comunica Matteo*), qui si raccolgono dati sul *processo*: bug, prompt
> ambigui, errori d'agente, vincoli strutturali. Una riga per voce, conciso.

---

## Classificazione delle cause

Ogni difficoltà va attribuita a una di queste quattro cause:

| Causa | Significato | Cosa segnala allo skill system |
|-------|-------------|--------------------------------|
| **bug preesistente** | difetto già nel codice prima del task | manca una RULE/test che lo avrebbe colto |
| **prompt ambiguo** | richiesta vaga o con intenti contraddittori | il filtro PREPARA_PROMPT non ha disambiguato a monte |
| **errore agente** | interpretazione sbagliata / tentativo evitabile / scelta non ottimale | manca una regola/pattern noto che l'agente doveva applicare |
| **vincolo strutturale** | LOCK/CSS/architettura preesistente blocca l'approccio | candidato a Nota in skill d'area (pattern da conoscere prima) |

Quando una causa **ricorre** (2+ volte) → è un candidato per: una RULE in `APP_CONTEXT`, una regola nel
filtro `PREPARA_PROMPT`, o una Nota in skill d'area. La promozione la decide il revisore Meta.

---

## Pattern ricorrenti (sintesi per il revisore)

| Pattern | Causa | Volte | Candidato a |
|---------|-------|-------|-------------|
| Intento UI invertito tra prepara-prompt e esecuzione (overlay sì/no) | prompt ambiguo | 1 | regola PREPARA_PROMPT: mappare elementi adiacenti impattati a monte |
| `overflow-x-auto` taglia figli `absolute` → serve portal | vincolo strutturale | 1 | Nota UI: per escape da scroll-container usare portal, non absolute |
| Modifica a un elemento senza mappare gli elementi vicini impattati | prompt ambiguo + errore agente | 1 | regola PREPARA_PROMPT (implementata) |
| Fix su **Menu QR** invece di **Pagina Prenota** (sfondo scroll footer #8) | prompt ambiguo + errore agente | 1 | ✅ **RISOLTA 31-05-26** → gate obbligatorio in `PREPARA_PROMPT_SKILL.md` §2 (slug/URL smoke + domanda Sì/No se Prenota+QR nel thread + vietato QA OK senza URL testato) |
| **Scope creep** — agente consegna deliverable extra non richiesti (3 PNG invece di 2, file header non chiesto, asset extra) | errore agente | 3 | ✅ **RISOLTA 02-06-26** → freno in `PREPARA_PROMPT_SKILL.md` §2 «Scope creep»: prima di materializzare un output non richiesto, chiedi Sì/No |
| **Sezioni report obbligatorie saltate** (Dati comunicazione / Analisi flusso prompt) + esiti Liv.2 non scritti | errore agente | molte (4+ giorni) | 🔶 **enforcement 02-06-26** → hook `stop` v2 mirato controlla i Report-*.md freschi e avvisa cosa manca (M4) |
| **Deviazione processo** — agente scrive nelle skill (VOCABOLARIO/PREPARA_PROMPT §3) invece di limitarsi a OSSERVAZIONI/PROPOSTE | errore agente | 2 | regola «annota ≠ codificare» esiste già (OSSERVAZIONI 31-05) ma bypassata → problema di enforcement, non di regola mancante. Caso «sticky» sanato 02-06-26; §3 handoff ratificato 02-06-26 |
| **Confusione Prenota↔QR in chat ESPLORATIVA** (non preparata) — il gate §2 prepara-prompt non copre le chat dirette | errore agente | 1 (02-06) | ✅ **RISOLTA 02-06-26** → blocco «Zone che si confondono» in `.cursor/rules/comandi-base.mdc` (`alwaysApply: true` → vale anche senza prepara-prompt) |
| **Skill aggiornata a metà** — una sezione skill allineata al diff, altra sezione stessa skill ancora con numeri/comportamento pre-refactor | errore agente | 1 (03-06) | 🔶 candidato: checklist chiusura «grep limiti vecchi in tutto il file skill toccato» + hook stop verifica coerenza cross-sezione |
| **Skill che referenzia file non ancora creato** — link a `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` prima che l’esecutore lo scriva | errore agente | 1 (03-06) | 🔶 candidato: regola «file citato in skill solo dopo esiste su disco» o ordine deliverable: mappa prima di skill |
| **Scroll row Prenota: `%` width su inner `w-max` gonfia card** — dopo fix allineamento outer/inner | errore agente + vincolo strutturale | 1 (05-06) | ✅ Nota in `PRENOTA_LAYOUT_CONTEXT.md` §5 + CSS var viewport; misurare fit prima di justify |

---

## Log per data

### 05-06-26 — Allineamento card scorrevoli + carosello Pagina Prenota
- **errore agente:** prima implementazione `justify-center mx-auto` fisso su inner → clip sinistro mobile; poi `justify-start` fisso → perso centro desktop; `%` mobile su inner `w-max` → card gonfiate.
- **prompt ambiguo:** correzione «solo sinistra» senza «se entra, centro» (chiarito al messaggio successivo).
- **vincolo strutturale:** righe scroll orizzontale richiedono outer `overflow-x-auto` + inner `w-max`; `%` sul inner non risolve rispetto al viewport.
- **Causa radice:** skill §5.2 non distingueva fit vs overflow; mancava hook misura `scrollWidth` vs `clientWidth`.
- **Report:** [Report-prenota-allineamento-card-carosello-05-06-26.md](../Sessioni%20di%20lavoro/05-06-26/Report-prenota-allineamento-card-carosello-05-06-26.md)
- **Azione:** `useBookingPublicScrollRowAlign` + `--booking-sub-tab-viewport-px` / `--booking-carousel-viewport-px`.

### 31-05-26 — Sfondo scroll footer: fix su Menu QR, sintomo su Pagina Prenota (#8)
- **prompt ambiguo:** checklist ciclo 8 note ha voce **#8 = «homepage QR»**; Matteo aveva indicato **Pagina Prenota** a ≥3 agenti. «Stile Prenota» (layout card QR) confuso con «fix **su** Prenota».
- **errore agente (esecutore):** Prompt B su `PublicMenuPage.tsx` — layer `fixed inset-0`; Playwright «layer top=0» su URL QR; **nessun sintomo** percepito da Matteo su Menu QR.
- **errore agente (prepara-prompt):** handoff e Prompt B hanno ereditato #8 senza **conferma schermata** quando Matteo disse OK; docs segnati QA OK senza URL Prenota vs QR allineati.
- **errore agente (ciclo precedente):** Prompt 2 (30-05) ha introdotto `repeat-y` su container scroll QR come «fix» scroll — poi #8 KO → secondo fix sulla stessa pagina sbagliata.
- **vincolo strutturale:** `BookingRequestPage` (tile legacy `repeat-y` su root) vs `PublicMenuPage` (stesso pattern) — fix pattern valido ma **zona** errata; full-page Prenota già usa layer fixed.
- **Causa radice:** manca regola Liv.1/2: ogni task **scroll/sfondo/footer** deve dichiarare **slug/URL smoke** e prepara-prompt chiede a Matteo **una riga** «confermi: è il link QR o la pagina Prenota?» se nel ciclo compare «Prenota» e «Menu» insieme.
- **Report meta:** [Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md](../Sessioni%20di%20lavoro/31-05-26/Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md)
- **Azione correttiva:** revert `PublicMenuPage` se non serve; nuovo prompt su `BookingRequestPage.tsx`; riaprire QA #8 come **misrouting**, non OK.

### 29-05-26 — Card ingredienti Prenota (scroll interno + overlay)
- **prompt ambiguo:** la mattina il prompt chiedeva ingredienti che NON passano sopra campi/riepilogo; il pomeriggio Matteo voleva l'opposto (overlay voluto). Stessa feature, intenti contrari in 12h → primo giro di implementazione sbagliato.
- **errore agente:** l'esecutore ha implementato la prima interpretazione senza mappare che la card, espandendosi, impatta campi cliente + riepilogo + sticky bar (gli elementi vicini).
- **errore agente:** tentativo `absolute` + `z-index` + `:has()` prima di verificare il clip di `overflow-x-auto` → tempo perso.
- **vincolo strutturale:** `overflow-x-auto` su `ComposeScrollRow` taglia i figli `absolute`; `relative isolate` + `z-10` sul wrapper pagina obbliga al portal su `body` per overlay globali.
- **Causa radice (da risposta Matteo 29-05):** il filtro a monte non ha elencato gli **elementi adiacenti** che la modifica avrebbe toccato. Non è "indovinare overlay sì/no" — è mappare chi viene impattato. → regola aggiunta a `PREPARA_PROMPT_SKILL` §1.

### 03-06-26 — Limiti testo Pagina Prenota: allineamento skill incompleto (agente esecutore)

**Contesto:** ciclo prepara-prompt → esecutore (chat separata) → «lavoro ok» → revisore/chiusura in chat con Matteo. Task: limiti caratteri vetrina + cap silenzioso form cliente. Report: [Report limiti testo 03-06-26](../Sessioni%20di%20lavoro/03-06-26/Report-prenota-limiti-testo-03-06-26.md). Commit codice: `111277e`; docs iniziali: `06c9d9a`; correzione hook: `64530d7`.

#### Errori agente esecutore — skill vs lavoro reale

| # | File skill / doc | Errore | Stato al «lavoro ok» | Correzione |
|---|------------------|--------|----------------------|------------|
| 1 | `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` | **Mancante** nonostante fosse Output atteso del prompt e citato in due skill | File assente | Creato in revisione (`06c9d9a` / completato `64530d7`) |
| 2 | `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §8.1 + §9 | Aggiornati con limiti 65/30/700 e riferimento mappa | Parziale OK | — |
| 3 | `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` **§6** | Ancora **60/120/20/300** (pre-refactor) mentre codice e §8.1 dicevano 65/30/700 | **Skill stale** | Corretto in chiusura hook (`64530d7`) |
| 4 | `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | Tabella limiti + link a mappa | OK contenuto numeri | Link a mappa puntava a file inesistente fino a (1) |
| 5 | `MENU_ADMIN_CONTEXT.md` / Tab Menu | Nessun aggiornamento cap ingredienti/categorie (mappa §E «nessuno oggi») | Scope parziale vs prompt Fase 1 | Debito **FU-030**, non errore di numeri sbagliati |
| 6 | `APP_CONTEXT_SKILL.md` §4 | Non toccato | Accettabile — dettaglio in layout context | — |
| 7 | Report sessione (prima versione) | Sez. 8 superficiale, **no prompt verbatim**, no FU-ID, tabella skill incompleta | Report scarno | Riscritto post-hook (`64530d7`) |

#### Classificazione

- **#1, #3, #4 (link), #7:** **errore agente** — allineamento §7.2 applicato a pezzi, senza rileggere l’intero file skill né verificare deliverable su disco.
- **#5:** **scope parziale** (prompt chiedeva mappa esaustiva §E; implementazione limiti menu rimandata) — tracciato FU-030, non contraddizione skill/codice.
- **#6:** nessuna RULE §4 obsoleta individuata.

#### Causa radice

1. Esecutore ha aggiornato la **sezione nuova** (§8.1) senza **grep** sul resto dello stesso file per numeri legacy (`60`, `120`, `300`).
2. Esecutore ha scritto in skill «vedi `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md`» **prima** di creare il file (ordine deliverable invertito).
3. Chiusura «lavoro ok» senza checklist hook: mappa esiste? ogni sezione del file skill citato coerente col diff?

#### Hook stop in questa sessione

- **Sì — ricevuto.** Matteo ha incollato il messaggio **«📄 FINE-SESSIONE — 2 report toccato/i…»** (nudge hook `stop` / `fine-sessione-nudge.mjs`) chiedendo sez. 8 piena, prompt verbatim, allineamento skill.
- **Esito hook:** ha fatto emergere **#3** (§6 stale) e report incompleto **#7**; correzioni in `64530d7`.
- **Nota:** senza hook, §6 sarebbe rimasta errata per agenti futuri che leggono solo §6 (validazione campi).

#### Azioni correttive già fatte

- Mappa 1:1 creata; §6 allineata; report completo; FU-030/031/032 in `FOLLOW_UP.md`.
- **Candidato revisore Meta:** regola chiusura «rileggi **tutto** il file skill toccato, non solo la sezione aggiunta».
