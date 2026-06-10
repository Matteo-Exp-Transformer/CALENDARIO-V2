# Dossier revisione → Meta senior (02-06-26)

**Agente:** revisore comunicazione (profilo Meta revisore)
**Per:** agente Meta senior (prossima sessione `evolvi skill system senior`)
**Scopo:** impacchettare i dati e le decisioni pronte, così il senior parte dall'analisi, non dalla raccolta.

> Cosa NON ho fatto (non è mio ruolo): promuovere voci in VOCABOLARIO, modificare regole di processo,
> avanzare milestone, scrivere hook. Ho diagnosticato e impacchettato. Le decisioni sono del senior con Matteo.

---

## 1. Il quadro in 3 righe

1. **Meccanismi maturi, motore fermo.** Il sistema ha livelli, profili, modalità, metriche — ma il dato che li alimenta (esiti voci Liv.2) non viene scritto dal vivo da 4+ giorni.
2. **Le pezze recenti non sono comandi.** «compila report comunicazione», la frase lunga «tutti i dati… skill system…» = toppe alla dimenticanza degli agenti, non parole che Matteo vuole dire. Curarle promuovendole è sbagliato: vanno curate con l'enforcement.
3. **PAUSA-RACCOLTA ancora valida.** 9 proposte aperte, quasi tutte ferme per mancanza di dati. Il prossimo passo è **misurare**, non aggiungere. Confermo la pausa decisa il 29-05.

---

## 2. GUASTO #1 — motore Liv.2 fermo (priorità assoluta senior)

**Sintomo contabile:** le voci Liv.2 hanno questi esiti registrati:

| Voce Liv.2 | ok | superflua | corretto | live? |
|---|---|---|---|---|
| «main dell'app» | 0 | 0 | 0 | mai |
| «menù originale» | 0 | 0 | 0 | mai |
| «compila report comunicazione» | 2 | 0 | 0 | **ricostruiti** dai report, non live |
| «revisiona e committa» | 1 | 0 | 0 | **ricostruito**, non live |
| «evolvi» senza senior | — | — | — | mai scattata |

Dal 30-05 in poi: **zero esiti live**. I 3 numeri esistenti li ho dovuti ripescare a mano dai report del 29-05.

**Perché è il guasto #1:** senza questi numeri, la logica promozione/regressione (REVISIONE §2) e la milestone M5 (statistiche) **girano a vuoto**. Tutto l'impianto Liv.2 è teoria finché nessuno scrive l'esito a fine chat.

**Causa (mia lettura):** il protocollo fine-chat chiede di scrivere l'esito, ma è governance soft — l'agente «dovrebbe» e si dimentica. Stesso identico meccanismo della frase lunga che Matteo ripete. **Una regola markdown che non viene seguita non si ripara con un'altra regola markdown.**

**Cosa ha già provato il sistema:** il nudge Cursor `stop` (installato 01-06, `.cursor/hooks/fine-sessione-nudge.mjs`) ricorda la sezione comunicazione + esiti Liv.2. Ma è un promemoria statico, non verifica che l'esito sia stato davvero scritto, e **non gira sui Cloud Agents**.

**Decisione che spetta al senior (non a me):**
- O si rende la scrittura esito un **enforcement vero** (hook che controlla i file modificati a fine task — M4),
- oppure si **accetta che il motore Liv.2 resti a bassa frequenza** e si semplifica: meno voci Liv.2, raccolta solo in sessioni standard/deep dove qualcuno controlla.
- Terza via possibile: **sciogliere le 2 voci-pezza** («compila report comunicazione» l'ho già marcata come pezza in VOCABOLARIO) trasformandole da voce-trigger a **riga obbligatoria del template report**, così non dipendono dalla memoria dell'agente.

> Le 2 voci «main dell'app» / «menù originale» sono a 0/0/0 da sempre: o si forza la registrazione, o vanno **archiviate** come Liv.2 morte (Matteo le usa «a volte» ma non genera mai dato).

---

## 3. Triage voci Liv.2 — pronto per ratifica senior+Matteo

| Voce | Mia raccomandazione | Motivo |
|---|---|---|
| «compila report comunicazione» (2 ok) | **NON promuovere a Liv.1.** Trasformare in riga template report. | È pezza a dimenticanza (già notato 01-06). Promuoverla cristallizza il problema invece di curarlo. |
| «revisiona e committa» (1 ok) | **Promuovibile a Liv.1** — ma con 1 solo dato. Confermata da Matteo 01-06. | Comportamento confermato esplicitamente. Manca solo volume. Decisione marginale del senior. |
| «main dell'app» (0/0/0) | **Archiviare** o forzare registrazione. | Mai generato un dato. Liv.2 morta. |
| «menù originale» (0/0/0) | **Archiviare** o forzare registrazione. | Idem. |
| «evolvi» senza senior (0) | **Tenere a Liv.2.** | Disambiguazione strutturale sana; il fatto che non sia scattata significa che Matteo usa sempre «senior» — buon segno, non guasto. |

---

## 4. Triage proposte — confermo PAUSA-RACCOLTA

9 proposte aperte. Le ho rilette tutte. **Nessuna è matura per promozione ora** secondo il criterio del senior (riparare-danno / sbloccare-misura / costo-zero). Dettaglio:

**Restano ATTESA-DATI (serve 2ª occorrenza o dati):**
- «test fatti tutto ok» → solo aggiornare QA (1 occ., sensata, aspetta la 2ª)
- «sezione Analisi flusso prompt» (chiesta 2×, ma è una sezione report, non un trigger — candidata a regola template, non a voce)
- «handoff due parti» (§3 già modificato prima della ratifica — **deviazione di processo** da sanare)
- «gate spiegazione @ skill» (parz. risolta da COMANDI_AVVIO.md)
- «blocco precauzioni mobile CSS» (1 occ.)
- «merge env/test→main a cura revisore» (tocca PROD — materiale M4, mai regola markdown)
- «no toast se Salva disattivato» (1 occ., micro-UX)
- «conflitto scalabilità multi-tenant» (1 occ., FU-006)
- «tutto fatto» come chiusura (si sovrappone a «lavoro ok»+«fai report finale» — verificare se distinto)

**Segnalo al senior 2 cose che meritano una decisione, non solo attesa:**
- **«sezione Analisi flusso prompt»**: Matteo l'ha chiesta **2 volte** e la ribadisce («ricorda di mettere…») → per lui è requisito di chiusura, non optional. Non è una voce-trigger: è una **sezione obbligatoria del template report standard/deep**. Costo zero (formato). Candidabile a chiusura pausa.
- **deviazione processo handoff**: PREPARA_PROMPT §3 è stato modificato da un agente prepara-prompt **prima** dell'ok di Matteo. Va sanato (ratificare o revertire) — è un buco di governance, non una proposta.

---

## 5. Nuovi pattern dal 02-06 (analisi sessione freeze Prenota)

Tre osservazioni nuove, tutte già in OSSERVAZIONI (corretto: Matteo ha vietato di metterle in VOCABOLARIO da solo). Mia lettura per il senior:

### 5.1 «sticky» — parola-lessico layout (matura)
- **Cosa:** Matteo usa «sticky» per «elemento forzatamente agganciato mentre scrolli». Esempio reale: `BookingSummarySidebar` con `min-[1256px]:sticky` che resta agganciato dove doveva andare stacked sotto.
- **Già fatto:** è già in VOCABOLARIO come scorciatoia d'area Liv.1 (approvata 02-06). **Attenzione:** verificare che questa promozione sia stata davvero autorizzata da Matteo — il report dice che l'agente aveva sbagliato a metterla in VOCABOLARIO e Matteo ha corretto «solo OSSERVAZIONI». **C'è incoerenza tra il file VOCABOLARIO (la dà approvata 02-06) e il report (Matteo l'ha vietata).** → **il senior deve chiarire con Matteo se «sticky» è approvata o va ritirata in OSSERVAZIONI.**

### 5.2 «prompt intero su correzione» (candidata PROPOSTE, 1 occ.)
- **Cosa:** in chat prepara, se Matteo corregge il prompt → l'agente riconsegna il **blocco intero**, non solo il delta (evita errori da incollo parziale su prompt vecchio).
- **Stato:** osservazione di Matteo, non voce. 1 occorrenza. Sensata e a basso rischio (è formato del prepara-prompt). → ATTESA 2ª occorrenza, oppure il senior la chiude come regola di formato in PREPARA_PROMPT §1.B (costo zero come «profilo+skill nel prompt» già accettata).

### 5.3 frase lunga ridondante (NON promuovere — è sintomo del guasto #1)
- **Cosa:** Matteo ripete «aggiungi tutti i dati… prompt… skill system… osservazioni e dubbi» anche se `lavoro ok` + `fai report finale` la coprono già. La ripete **quando gli agenti saltano sezioni**.
- **Lettura:** non è una parola nuova da mappare. È la **stessa malattia** del motore Liv.2 fermo: gli agenti dimenticano sezioni del report, Matteo compensa a voce. **Curare alla radice (enforcement §2), non aggiungere una voce.**

### 5.4 Pattern dai prompt veri della chat (cronologia turni report §«Cronologia chat e prompt»)
Leggendo i turni 1-22 verbatim (non solo la sintesi OSSERVAZIONI), emerge un dato che il senior deve pesare:

- **Confusione zona all'inizio (turni 1-3):** Matteo chiede «div contenitore desktop Prenota» → l'agente al turno 2 **confonde con Menu QR** (`max-w-[1024px]`) → Matteo corregge «è nel menu qr bravo». **È di nuovo il pattern Prenota-vs-QR** (la causa già risolta 31-05 con il gate PREPARA_PROMPT §2). Ma qui la confusione è nata in chat **non-prepara** (era un'esplorazione, non un task preparato) → **il gate §2 copre solo i prompt preparati, non le chat esplorative.** Buco da segnalare: la disambiguazione zona serve anche fuori dal filtro prepara-prompt.
- **2 esecutori, 1 annullato (turni 13-14):** il fix sticky 1256-1599 è fallito perché il prompt fix **non citava file+riga+prop** della root cause (l'agente prepara non legge il codice). Il report stesso lo dice (Cosa non ha funzionato §3). → pattern: **i prompt di fix su bug CSS-breakpoint devono includere file+riga+anti-pattern esplicito**, altrimenti l'esecutore rifà il bug. Candidato P3 del report esecutore.
- **Errore processo in diretta (turni 18-20):** l'agente mette «sticky» in VOCABOLARIO, Matteo lo corregge «solo OSSERVAZIONI». → **conferma l'incoerenza del §5.1**: il file VOCABOLARIO la dà approvata, ma i turni veri mostrano che Matteo l'ha *vietata*. Il senior deve risolverla.

**Conclusione dai prompt veri:** i prompt di Matteo erano **chiari e progressivi** (cap → centratura → riepilogo → responsive). I 2 fallimenti (confusione QR iniziale, sticky non rimosso) sono **errori d'agente / prompt-fix incompleti**, non prompt ambigui di Matteo. Questo è un dato di affidabilità: in questa sessione il rumore è venuto dagli agenti, non da come Matteo ha comunicato.

---

## 5bis. Dati multi-sessione (23-05 → 02-06) — estratti dai prompt verbatim nei report

Analisi sui ~39 report con prompt verbatim (estrazione dedicata). Cose **nuove** rispetto alla sola OSSERVAZIONI:

### A. Come Matteo avvia davvero prepara-prompt (dato di frequenza)
- **`@PREPARA_PROMPT_SKILL.md` + richiesta tecnica = 4×** (29-05, 30-05×2) — è il modo **più frequente**, più di «prepara prompt» a voce (3×). → Il senior valuti se il grilletto canonico in COMANDI_AVVIO deve includere la forma `@file` esplicita, non solo la parola.
- «fai report sessione/comunicazione» = 4× (29-05×2, 30-05×2): trigger di chiusura ricorrente, oggi coperto da «lavoro ok» + «fai report finale» ma Matteo lo dice ancora a voce → conferma il pattern «frase lunga = pezza» del §5.3.

### B. SCOPE CREEP — pattern nuovo e ricorrente (3×, non ancora mappato)
- **Gli agenti allargano il deliverable senza chiedere:** 3 PNG invece di 2 (temi sfondo 30-05); file header separato non richiesto (Menu QR 30-05); asset extra. Matteo corregge «non aggiungere cose che non ti ho chiesto».
- **Non è coperto da nessuna voce/regola attuale.** È un errore d'agente ricorrente (causa «errore agente» in ERRORI_PROCESSO). → **Candidato a regola PREPARA_PROMPT / APP_CONTEXT: prima di aggiungere un deliverable non richiesto, l'agente chiede Sì/No.** Costo basso, danno dimostrato 3×. Lo segnalo al senior come **la proposta più matura emersa da questa revisione** (≥2-3 occorrenze, basso rischio — soglia PROPOSTE rispettata).

### C. Conferma definitiva guasto #1
- L'estrazione conferma: **zero esiti Liv.2 registrati dal vivo dal 30-05 in poi**, su tutti i report letti. I 3 numeri esistenti sono tutti ricostruiti a mano dal 29-05. Non è un'ipotesi: è il dato osservato su 4 giorni di sessioni.

### D. Deviazione di processo confermata (2 casi)
- Agente prepara-prompt ha modificato `PREPARA_PROMPT_SKILL.md` (§3 e §6) **prima** della ratifica Meta (31-05). + caso «sticky» in VOCABOLARIO non autorizzato (02-06). → **Pattern: gli agenti di lavoro a volte scrivono nelle skill invece di limitarsi a OSSERVAZIONI/PROPOSTE.** Raccogliere ≠ promuovere. Il senior valuti se serve un freno (la regola «annota ≠ codificare» esiste già in OSSERVAZIONI 31-05 ma viene bypassata — di nuovo problema di enforcement, non di regola mancante).

---

## 6. Pattern trasversale che il senior deve vedere

I tre problemi più caldi — motore Liv.2 fermo, frase lunga ripetuta, voci-pezza — **sono lo stesso problema**: *gli agenti dimenticano di scrivere i dati di chiusura, e la governance soft non lo impedisce.*

Questo è esattamente ciò che la milestone **M4 (enforcement via hook)** esiste per risolvere, ed è già parzialmente avviata (nudge Cursor installato). **La mia raccomandazione al senior: la prossima mossa di sistema non è una nuova regola, è far funzionare l'enforcement di chiusura.** Tutto il resto (promozioni, nuove voci) è bloccato a valle di questo.

Quando M4 garantisce che gli esiti Liv.2 e le sezioni report vengano scritti → il motore riparte → in 5-10 sessioni avremo dati veri → allora le promozioni si decidono sui numeri, non sull'intuizione. È la sequenza giusta.

---

## 7. Igiene template v.0 (REVISIONE §6b)

Se il senior tocca meccanismi **strutturali/riusabili** (es. il modo di forzare la scrittura esiti, la sezione «Analisi flusso prompt» nel template, l'eventuale hook di chiusura), va propagato anche in `_skill-system-v0/comunicazione/` in forma generica (gitignored, locale, annotare nel report quali file). **NON propagare** cose specifiche di CalendarBackup (sticky/BookingSummarySidebar, cap 1168 vs 1024).

---

## 8. Coda per il senior (ordine consigliato)

1. **Decidere l'enforcement di chiusura** (guasto #1) — la scelta che sblocca tutto il resto.
2. **Valutare la regola anti-scope-creep** (§5bis.B) — proposta più matura (3 occ., basso rischio): l'agente chiede Sì/No prima di aggiungere deliverable non richiesti.
3. **Chiarire «sticky»** con Matteo (approvata o ritirata? incoerenza VOCABOLARIO vs report 02-06).
4. **Sanare le deviazioni di processo** (§5bis.D): PREPARA_PROMPT §3/§6 + «sticky» modificati senza ratifica.
5. **Decidere se chiudere la pausa** per «Analisi flusso prompt» (chiesta 2×, costo zero) e «prompt intero».
6. **Archiviare le 2 voci Liv.2 morte** o forzarne la registrazione.

---

*Materiale letto per questo dossier: VOCABOLARIO, OSSERVAZIONI, PROPOSTE, ERRORI_PROCESSO, EVOLUZIONE_SKILLS, REVISIONE, Report-prenota-full-page-freeze-02-06-26 + estrazione prompt verbatim su ~39 report (23-05 → 02-06) via agente di sola lettura. Prompt della chat 02-06: cronologia turni del report + sintesi OSSERVAZIONI.*
