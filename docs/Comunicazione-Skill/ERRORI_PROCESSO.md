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
| Fix su **Menu QR** invece di **Pagina Prenota** (sfondo scroll footer #8) | prompt ambiguo + errore agente | 1 | **CRITICO Meta:** disambiguazione obbligatoria schermata + URL smoke; gate QA URL |

---

## Log per data

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
