# M1 — Meta / Comunicazione / skill system

> **Ondata:** M1 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** 3–4 (sintesi già scritte da agenti; ipotesi da confermare con A*, H*, J1)
> **Perimetro:** `docs/Comunicazione-Skill/` (13) + `docs/Archivio/CONTESTO_PRODOTTO.md` (1) + `_skill-system-v0/` (21) + `docs/APP_CONTEXT_SKILL.md` (1) = **36 file**

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| M1-D01 | ? | AI-METODO | Solo voci approvate da Matteo nel vocabolario | MATTEO | ORIGINATA | `docs/Comunicazione-Skill/VOCABOLARIO.md` L3-5 | «qui entrano **solo voci approvate da Matteo**. L'agente non aggiunge mai» | vocab-governance |
| M1-D02 | ? | AI-METODO | Livelli libertà 1/2/3 per dosare autonomia | MATTEO | ORIGINATA | `VOCABOLARIO.md` L14-16 | «Serve a Matteo per dosare quanta autonomia dare a una rule» | trust-levels |
| M1-D03 | ? | AI-METODO | Default prudente: incerto → Liv.3 | AGENTE | SCELTA | `VOCABOLARIO.md` L26 | «Se non sai quale dare → metti 3, è il più prudente» | trust-levels · IPOTESI |
| M1-D04 | ? | AI-METODO | Promozione/regressione Liv.2 solo revisore | CONGIUNTA | APPROVATA | `VOCABOLARIO.md` L37-38 | «L'agente di lavoro **non decide** promozione/regressione» | vocab-governance |
| M1-D05 | 28-05-26 | AI-METODO | Profili Esecuzione / Verifica / Meta | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L51; `VOCABOLARIO.md` L94+ | «Termini profili di ingresso (Esecuzione/Verifica/Meta)» | agent-routing |
| M1-D06 | 31-05-26 | AI-METODO | Meta senior solo con «senior» / «meta senior» | MATTEO | ORIGINATA | `VOCABOLARIO.md` (voce evolvi); `COMANDI_AVVIO.md` L24-28 | ««evolvi» da solo → l'agente chiede conferma» | meta-routing |
| M1-D07 | 06-06-26 | AI-METODO | Importare trigger «ragioniamo» da Trade-Analyst | MATTEO | ORIGINATA | `VOCABOLARIO.md` (voce ragioniamo) | «portare il trigger «ragioniamo» dall'app Trade-Analyst» | cross-project-lexicon |
| M1-D08 | 28-05-26 | PROCESSO | «fai report finale» = commit+push, non scrittura | MATTEO | CORRETTIVA | `ARCHIVIO_DECISIONI.md` L45; `VOCABOLARIO.md` | «capitolo chiuso fai commit e push» | session-close-split |
| M1-D09 | 29-05/01-06 | PROCESSO | «lavoro ok» = task ok + report completo, no push | MATTEO | CORRETTIVA | `ARCHIVIO_DECISIONI.md` L34; `VOCABOLARIO.md` | «annotarsi già tutto quello che è successo» | session-close-split |
| M1-D10 | 28-05-26 | AI-METODO | «prepara/prepara prompt» = filtro, no codice | MATTEO | APPROVATA | `VOCABOLARIO.md` (voce prepara) | «trasformato in un prompt ottimizzato… NON scrive codice» | prepara-filter |
| M1-D11 | 28-05-26 | AI-METODO | «spiegamelo semplice» = effetto + chi fa cosa | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L48 | «metafora + chi-fa-cosa» | plain-language |
| M1-D12 | 28-05-26 | TESTING | «revisione completa» = critica, mai ok cortesia | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L47 | «revisione critica, mai ok di cortesia» | critical-review |
| M1-D13 | 28-05-26 | AI-METODO | «dammi follow up» = solo prompt auto-contenuto | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L46 | «solo il prompt» | handoff-prompt |
| M1-D14 | 29-05-26 | UI-UX | Conferma = Modal in-app, non window.confirm | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L35 | «componente Modal, non window.confirm» | modal-ux |
| M1-D15 | 28-05-26 | SICUREZZA | Mai scrivere PROD senza conferma esplicita | MATTEO | APPROVATA | `VOCABOLARIO.md`; `APP_CONTEXT_SKILL.md` §1b | «Mai scrivere su PROD senza conferma esplicita di Matteo» | env-safety |
| M1-D16 | 28-05-26 | AI-METODO | Plan mode: AskUserQuestion su decisioni sue | MATTEO | ORIGINATA | `VOCABOLARIO.md` (plan mode) | «legare al plan mode, non a un termine» | decision-gates |
| M1-D17 | 28-05-26 | PRODOTTO | Tre zone menu distinte (Prenota/QR/magazzino) | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L50; `VOCABOLARIO.md` scorciatoie | «Scorciatoie d'area + stile» | area-disambiguation |
| M1-D18 | 28-05-26 | AI-METODO | **RIFIUTO** «è un bug o è voluto?» | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L52 | «RIFIUTATA (caso troppo raro)» | vocab-rejection |
| M1-D19 | 28-05-26 | AI-METODO | **RIFIUTO** «devo farlo io ogni volta?» | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L53 | «RIMOSSA (non la dice abbastanza spesso)» | vocab-rejection |
| M1-D20 | 01-06-26 | AI-METODO | **RIFIUTO** «comportamenti ok ma voglio che cambi» | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L40 | «ELIMINATA 01-06-26 (Matteo non la usa)» | vocab-rejection |
| M1-D21 | 01-06-26 | AI-METODO | **RIFIUTO promozione** «compila report comunicazione» | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L41 | «NON promossa» (pezza a dimenticanza) | vocab-rejection |
| M1-D22 | 02-06-26 | AI-METODO | «sticky» RITIRATA da VOCABOLARIO | MATTEO | CORRETTIVA | `ARCHIVIO_DECISIONI.md` L20 | «era promossa senza ratifica» | vocab-governance |
| M1-D23 | 02-06-26 | AI-METODO | Freno scope creep in PREPARA_PROMPT | CONGIUNTA | APPROVATA | `ARCHIVIO_DECISIONI.md` L15 | «Freno scope creep» | scope-control |
| M1-D24 | 02-06-26 | AI-METODO | Guasto #1 → hook stop, non nuova markdown | CONGIUNTA | APPROVATA | `ARCHIVIO_DECISIONI.md` L16 | «NON nuova regola markdown (le sezioni erano già obbligatorie)» | soft-vs-enforcement |
| M1-D25 | 02-06-26 | PROCESSO | Handoff due parti (copia-incolla + riepilogo) | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L17 | «Contenuto già richiesto da Matteo» | handoff-format |
| M1-D26 | 02-06-26 | AI-METODO | Su correzione prompt → riconsegna blocco intero | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L18 | «riconsegna il blocco intero, non il delta» | prepara-filter |
| M1-D27 | 02-06-26 | PROCESSO | Zone confondibili anche in chat esplorativa | CONGIUNTA | APPROVATA | `ARCHIVIO_DECISIONI.md` L21 | «Zone confondibili anche in chat esplorativa» | area-disambiguation |
| M1-D28 | 31-05-26 | AI-METODO | Gate disambiguazione Prenota vs Menu QR | CONGIUNTA | CORRETTIVA | `ARCHIVIO_DECISIONI.md` L25 | «Unico danno dimostrato e ripetuto… ≥3 agenti» | area-disambiguation |
| M1-D29 | 31-05-26 | AI-METODO | Profilo+skill espliciti nel prompt esecutore | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L26 | «Profilo · Modalità · Skill · Non caricare» | prepara-filter |
| M1-D30 | 31-05-26 | TESTING | Checklist QA: no URL, sì schermata+effetto | MATTEO | APPROVATA | `ARCHIVIO_DECISIONI.md` L27 | «no URL, sì schermata+effetto» | plain-language |
| M1-D31 | 29-05-26 | AI-METODO | Metriche successo chat (M5) | CONGIUNTA | APPROVATA | `ARCHIVIO_DECISIONI.md` L31 | «Metriche successo chat» | system-metrics |
| M1-D32 | 29-05-26 | UI-UX | Mockup HTML multi-stato prima esecutore | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L32 | «Mockup HTML per scelta flusso UX» | ui-mockup |
| M1-D33 | 29-05-26 | AI-METODO | Modalità light/standard/deep (+ deep auto) | CONGIUNTA | APPROVATA | `ARCHIVIO_DECISIONI.md` L33 | «Deep automatico su DB/prod/LOCK/auth» | anti-bureaucracy |
| M1-D34 | 29-05-26 | PROCESSO | Report unificato ciclo multi-agente | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L37; `APP_CONTEXT` §7.1 | «Report unificato ciclo multi-agente» | report-unified |
| M1-D35 | 29-05-26 | UI-UX | Copy verbatim: cambia solo stringhe citate | MATTEO | CORRETTIVA | `ARCHIVIO_DECISIONI.md` L38 | «Copy verbatim» | copy-discipline |
| M1-D36 | 29-05-26 | AI-METODO | Freno azioni strutturali rischiose + AskUser | MATTEO | ORIGINATA | `ARCHIVIO_DECISIONI.md` L39 | «Freno azioni strutturali rischiose» | risk-gates |
| M1-D37 | 29-05-26 | AI-METODO | PAUSA-RACCOLTA: stop nuovi meccanismi | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L199-204 | «Stop a nuovi meccanismi/regole finché… ~5-10 sessioni» | anti-bureaucracy |
| M1-D38 | 02-06-26 | AI-METODO | Mandato Meta senior: partner, non cala decisioni | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L16-18 | «Non cala decisioni dall'alto… Confermato mandato esplicito 02-06-26» | meta-senior |
| M1-D39 | 04-06-26 | FORMAZIONE | Mandato «educare Matteo» + Lezione della chat | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L95-110 | «Il senior non risolve solo problemi: **insegna**» | didactic-senior |
| M1-D40 | 03-06-26 | AI-METODO | Hook stop = rilancio anche se report «completo» | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L54-60 / Log L459 | «ripeti anche se a posto, la presenza del titolo non garantisce» | hook-stop-design |
| M1-D41 | 02-06-26 | AI-METODO | Hook smart-allow (avvisa, non blocca) | MATTEO | APPROVATA | `EVOLUZIONE_SKILLS.md` L458 | «Decisione Matteo: smart-allow (avvisa, non blocca)» | hook-stop-design |
| M1-D42 | 02-06-26 | AI-METODO | Dammi file fresco SEMPRE, non solo sui buchi | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L285 | «dammi il file fresco SEMPRE, non solo sui buchi» | hook-stop-design |
| M1-D43 | 04-06-26 | SICUREZZA | Guard PROD = ask (fermati e chiedi), non deny | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L293-294 | «Matteo: «fermati e chiedi», non «vieta»» | env-safety |
| M1-D44 | 04-06-26 | AI-METODO | Hook v4: da titolo a risposta obbligata Q/R | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L466 | «partiamo severi» | hook-stop-design |
| M1-D45 | 04-06-26 | TESTING | CONTROVERIFICA a 3 livelli (hook→self→imparziale) | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L471; `CONTROVERIFICA.md` | «intuizione Matteo, non un agente nuovo» | controverifica |
| M1-D46 | 07-06-26 | TESTING | Controtest = ricerca attiva rotture, non verde | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L112-123 | «chiusura area = ricerca attiva di rotture… non «test verdi»» | controtest-rompi |
| M1-D47 | 06-06-26 | TESTING | «BLINDATA» = doc + prodotto funzionante in prod | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L476; `PROSEGUIMENTO_MAPPATURA_SKILL.md` L87-88 | «non basta documentare, la **pagina deve funzionare in produzione**» | blindatura-prodotto |
| M1-D48 | 10-06-26 | PROCESSO | Merge pubblico solo se tocca src/ (prodotto) | CONGIUNTA | APPROVATA | `EVOLUZIONE_SKILLS.md` L125-140 | «la repo pubblica è il prodotto, non lo specchio del lavoro» | release-hygiene |
| M1-D49 | 03-06-26 | PROCESSO | Allineamento skill implicito (non chiedere) | MATTEO | ORIGINATA | `ARCHIVIO_OSSERVAZIONI.md` L15-17; `CHIUSURA_SESSIONE.md` L48-53 | «Allineamento skill = implicito, non una domanda a Matteo» | skill-align-implicit |
| M1-D50 | 31-05-26 | AI-METODO | «annota» ≠ codificare nello skill system | MATTEO | ORIGINATA | `ARCHIVIO_OSSERVAZIONI.md` L294-297 | «quando chiede **annota**… **non** modificare APP_CONTEXT» | annota-vs-codifica |
| M1-D51 | 01-06-26 | AI-METODO | Voto sintetico sessione = revisore, non esecutore | MATTEO | ORIGINATA | `REVISIONE.md` §4c | «se ci sono contraddizioni… quanto gli agenti sono affidabili» | agent-reliability |
| M1-D52 | 01-06-26 | AI-METODO | Propagare upgrade strutturali al template v.0 | MATTEO | ORIGINATA | `REVISIONE.md` §6b | «mantengo v.0 allineato con gli upgrade» | template-sync |
| M1-D53 | 28-05-26 | AI-METODO | Meglio una domanda in più che una in meno | MATTEO | ORIGINATA | `ARCHIVIO_OSSERVAZIONI.md` L262 | «meglio una domanda in più che una in meno» | decision-gates |
| M1-D54 | 28-05-26 | SICUREZZA | docs/_lavoro/ privata; mai esporre su git | MATTEO | ORIGINATA | `ARCHIVIO_OSSERVAZIONI.md` L283-284 | «tiene `docs/_lavoro/` privata apposta; molto sensibile» | privacy-docs |
| M1-D55 | 28-05-26 | PROCESSO | Commit separati come punti di ripristino | MATTEO | APPROVATA | `ARCHIVIO_OSSERVAZIONI.md` L285-287; `CHIUSURA` L218-219 | «un commit in più non crea disagi giusto?» | commit-checkpoints |
| M1-D56 | 11-06-26 | PROCESSO | «commit» esplicito ≠ push automatico | MATTEO | CORRETTIVA | `OSSERVAZIONI.md` L126-129 | «se Matteo specifica solo **commit** non dedurre… **push**» | session-close-split |
| M1-D57 | 11-06-26 | AI-METODO | Stop ripetizioni post-decisione | MATTEO | ORIGINATA | `OSSERVAZIONI.md` L203 | «non riformulare 3–4 volte… Una risposta compatta» | plain-language |
| M1-D58 | 11-06-26 | AI-METODO | Niente elenchi minimali con sigle verso Matteo | MATTEO | ORIGINATA | `OSSERVAZIONI.md` L204 | «non capisce cosa manca… usare **parole intere**» | plain-language |
| M1-D59 | 10-06-26 | PROCESSO | Esecutori non aggiornano plan/roadmap | MATTEO | ORIGINATA | `OSSERVAZIONI.md` L135-138 | «non devono modificare file di **piano/roadmap**» | role-boundaries · IPOTESI |
| M1-D60 | 01-06-26 | PROCESSO | «test fatti tutto ok» ≠ riscrivere report | MATTEO | ORIGINATA | `ARCHIVIO_OSSERVAZIONI.md` L58-60 | «**Non** espandere «cosa è stato fatto» né inventare difficoltà» | report-discipline |
| M1-D61 | 04-06-26 | AI-METODO | Context-knowledge 3 strati: codice=verità | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L476 / Log L469 | «codice = verità… skill NON ripete i valori» | context-knowledge |
| M1-D62 | 04-06-26 | FORMAZIONE | Sistema didattico M7 parallelo (parti micro) | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L470 | «usare le chat senior come scuola continua» | didactic-senior |
| M1-D63 | 20-06-26 | AI-METODO | Snellimento missione permanente skill system | MATTEO | ORIGINATA | `EVOLUZIONE_SKILLS.md` L440 | «trattare lo snellimento… obiettivo interno permanente» | system-slim |
| M1-D64 | 30-05-26 | PROCESSO | Solo due branch: env/test → main | CONGIUNTA | APPROVATA | `APP_CONTEXT_SKILL.md` L142-150 | «Solo due branch dopo la dismissione di `env/prod`» | git-workflow |
| M1-D65 | 30-05-26 | AI-METODO | No nuovo file mappa richieste ora | MATTEO | ORIGINATA | `PROPOSTE.md` L52 | «Matteo stesso ha frenato: testare prima» | anti-bureaucracy |
| M1-D66 | 04-06-26+ | AI-METODO | Skill = senso+mappa; dettaglio in contesto/ | CONGIUNTA | APPROVATA | `PROSEGUIMENTO_MAPPATURA_SKILL.md` L52-55 | «Skill = senso/workflow/divieti + mappa «tocchi X → apri Y»» | skill-area-model |
| M1-D67 | ? | AI-METODO | Report storici Sessioni non si toccano | CONGIUNTA | APPROVATA | `PROSEGUIMENTO_MAPPATURA_SKILL.md` L61 | «I report storici in `Sessioni di lavoro/` NON si toccano» | anti-storia |
| M1-D68 | ? | AI-METODO | Controverifica: chi-fa ≠ chi-verifica | CONGIUNTA | APPROVATA | `CONTROVERIFICA.md` L25-27 | «L'esecutore… NON è chi controverifica» | controverifica · IPOTESI |
| M1-D69 | 29-05-26 | AI-METODO | Estrarre template skill system v.0 | INCERTO | INCERTO | `_skill-system-v0/README.md` footer | «Template estratto dal progetto-madre il 2026-05-29» | template-extraction |
| M1-D70 | 03-08-26 | AI-METODO | Decisioni prodotto in termini di sala, non impl. | MATTEO | CORRETTIVA | `EVOLUZIONE_SKILLS.md` Log L438 | «non mi è chiaro cosa devo decidere» → riformulata in sala | product-language |
| M1-D71 | 19-06-26 | TESTING | Checklist flussi QA visivo Per Matteo | CONGIUNTA | APPROVATA | `EVOLUZIONE_SKILLS.md` L457 | «un solo posto… flussi utente da provare a mano» | qa-human |
| M1-D72 | ? | PROCESSO | Non toccare `npm run dev` di Matteo | MATTEO | ORIGINATA | `CHIUSURA_SESSIONE.md` L255-256 | «Non toccare il `npm run dev` che ha lanciato Matteo» | dev-server-respect |
| M1-D73 | ? | AI-METODO | Skill vive: solo Meta+Matteo promuove regole | CONGIUNTA | APPROVATA | `CHIUSURA_SESSIONE.md` L162-164 | «La promozione a regola la fa SOLO una sessione Meta con Matteo» | vocab-governance |
| M1-D74 | ? | PRODOTTO | Edition+add-on; feature dietro flag | INCERTO | APPROVATA | `docs/Archivio/CONTESTO_PRODOTTO.md` L35-60 | «ogni feature nuova va decisa "bundle o add-on" prima» | commercial-model · IPOTESI |
| M1-D75 | 04-06-26 | AI-METODO | Liv.2 «main»/«menù originale» tenere (basso uso) | MATTEO | APPROVATA | `EVOLUZIONE_SKILLS.md` L464 | «Matteo conferma di tenerla… NON archiviare» | vocab-governance |
| M1-D76 | 04-06-26 | AI-METODO | Propagazione v.0 sospesa poi sbloccata (parziale) | MATTEO | CORRETTIVA | `EVOLUZIONE_SKILLS.md` L462 · L472 | «propagazione v.0 SOSPESA volutamente (Matteo)» | template-sync |
| M1-D77 | 02-06-26 | UI-UX | Parola sticky = elemento forzatamente agganciato | MATTEO | ORIGINATA | `OSSERVAZIONI.md` L198 | «indica che un elemento UI è **forzatamente agganciato**» | sticky-ux (solo OSS) |
| M1-D78 | 29-05-26 | UI-UX | Autosave ok in debug; prod = footer manuale | MATTEO | ORIGINATA | `OSSERVAZIONI.md` L233 | «Prod futura… disattivare autosave; salvataggio manuale footer» | autosave-policy · IPOTESI |
| M1-D79 | 23-06-26 | PROCESSO | «allinea console» = doc env/test → branch team | MATTEO | ORIGINATA | `VOCABOLARIO.md` (voce allinea console) | «passare documentazione… al branch di sviluppo console» | console-sync |
| M1-D80 | 12-06-26 | AI-METODO | Mini-pack `*_MINI.md` (≤80 righe) | CONGIUNTA | APPROVATA | `APP_CONTEXT_SKILL.md` §0.0b; `_skill-system-v0/aree/_TEMPLATE_MINI.md` | design mini-pack citato 12-06-26 | mini-pack |

### Rifiuti di Matteo (peso doppio — estratti da Sezione 1)

| # | Cosa | Data | Fonte |
|---|------|------|-------|
| R1 | Voce «è un bug o è voluto?» | 28-05-26 | ARCHIVIO_DECISIONI L52 |
| R2 | Voce «devo farlo io ogni volta?» | 28-05-26 | ARCHIVIO_DECISIONI L53 |
| R3 | Voce «comportamenti ok ma voglio che cambi» | 01-06-26 | ARCHIVIO_DECISIONI L40 |
| R4 | Promozione «compila report comunicazione» | 01-06-26 | ARCHIVIO_DECISIONI L41 |
| R5 | Voce «sticky» in VOCABOLARIO (senza ratifica) | 02-06-26 | ARCHIVIO_DECISIONI L20 |
| R6 | Framing bug su comportamento ok da cambiare | 29-05-26 | ARCHIVIO_OSSERVAZIONI |
| R7 | Path URL tecnici nelle checklist smoke | 30-05-26 | ARCHIVIO_OSSERVAZIONI |
| R8 | Agenti che codificano su «annota/suggerisci» | 31-05-26 | ARCHIVIO_OSSERVAZIONI |
| R9 | Dedurre push da solo «commit» | 11-06 / 02-08 | OSSERVAZIONI |
| R10 | Riscrivere report dopo «test fatti tutto ok» | 01-06-26 | ARCHIVIO_OSSERVAZIONI |
| R11 | Esecutori che toccano plan/roadmap | 10-06-26 | OSSERVAZIONI |
| R12 | Ripetizioni post-decisione | 11-06-26 | OSSERVAZIONI |
| R13 | Elenchi minimali con sigle FU | 11-06-26 | OSSERVAZIONI |
| R14 | Delta copy oltre mandato («non ti ho detto di cambiarlo») | 29-05-26 | OSSERVAZIONI |
| R15 | 2º agente esecutore su freeze Prenota | 02-06-26 | OSSERVAZIONI |
| R16 | Preset/mixed QR «non ora» | 30-05-26 | ARCHIVIO_OSSERVAZIONI |
| R17 | Propagazione v.0 prematura (sospesa 04-06) | 04-06-26 | EVOLUZIONE Log |
| R18 | Domanda in lingua implementazione (localStorage vs DB) | 03-08-26 | EVOLUZIONE Log L438 |

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| M1-A01 | M→A | DIRETTA | Solo voci approvate + livelli 1/2/3 | accettata | VOCABOLARIO L3-38 |
| M1-A02 | M→A | DIRETTA | Grilletti profili + Meta senior vs revisore | accettata | VOCABOLARIO; COMANDI_AVVIO |
| M1-A03 | M→A | DIRETTA | Ridefinizione lavoro ok / report finale | accettata | VOCABOLARIO; ARCHIVIO L34/L45 |
| M1-A04 | M→A | DIRETTA | Ritiro «sticky» da VOCABOLARIO | accettata | ARCHIVIO_DECISIONI L20 |
| M1-A05 | M→A | DIRETTA | Rifiuti voci rare/non usate (R1–R4) | rifiutata (le voci) | ARCHIVIO_DECISIONI L40-53 |
| M1-A06 | A→M | DIRETTA | Agente promuove sticky senza ratifica | rifiutata | ARCHIVIO L20; ERRORI L40 |
| M1-A07 | A→M | DIRETTA | Scope creep deliverable extra ×3 | rifiutata → freno | ERRORI_PROCESSO L38 |
| M1-A08 | A→M | DIRETTA | Fix Menu QR invece di Prenota (#8) | rifiutata → gate | ERRORI L59-67 |
| M1-A09 | A→M | DIRETTA | Sezioni report saltate (guasto #1) | rifiutata → hook | ERRORI L39 |
| M1-A10 | A→M | DIRETTA | Scrive in VOC/PREPARA invece di OSS/PROPOSTE | rifiutata | ERRORI L40 |
| M1-A11 | M↔M | DIRETTA | Overlay ingredienti: mattina no → pomeriggio sì | accettata (costo A) | ERRORI L69-74 |
| M1-A12 | A→M | DIRETTA | Skill aggiornata a metà (§6 stale limiti testo) | rifiutata → hook | ERRORI L76-113 |
| M1-A13 | M→A | DIRETTA | Hook enforcement invece di nuova markdown | accettata | ARCHIVIO L16; OSS L34-36 |
| M1-A14 | M→A | DIRETTA | Mandato educare + Playbook Meta senior | accettata | EVOLUZIONE L16-18 · L95 |
| M1-A15 | A→M | DIRETTA | Domanda localStorage vs DB → «non chiaro» | rifiutata → riformulata | EVOLUZIONE Log L438 |
| M1-A16 | M→A | DIRETTA | Controtest ROMPI + BLINDATA prodotto | accettata | EVOLUZIONE §7 · L476 |
| M1-A17 | M→A | DIRETTA | Controverifica imparziale post report finale | accettata | CONTROVERIFICA; EVOL L471 |
| M1-A18 | M→A | DIRETTA | Commit ≠ push quando dice solo commit | accettata | OSSERVAZIONI L126 |
| M1-A19 | M→A | DIRETTA | Allineamento skill implicito | accettata | ARCHIVIO_OSS L15-17 |
| M1-A20 | A→M | DIRETTA | Agenti chiedono se allineare skill | rifiutata (domanda superflua) | ARCHIVIO_OSS L15-16 |
| M1-A21 | M→A | DIRETTA | Annota ≠ codificare | accettata | ARCHIVIO_OSS L294 |
| M1-A22 | M→A | DIRETTA | Mockup HTML «quasi sempre» per UX | accettata | ARCHIVIO L32 |
| M1-A23 | M→A | DIRETTA | Meglio domanda in più; opzioni sì/no | accettata | ARCHIVIO_OSS L262 |
| M1-A24 | A→M | DIRETTA | window.confirm invece di Modal | rifiutata | VOCABOLARIO; OSS L228 |
| M1-A25 | A→M | DIRETTA | Cambio copy oltre mandato | rifiutata | OSS L230 |
| M1-A26 | M→A | DIRETTA | Voto sintetico al revisore | accettata | REVISIONE §4c |
| M1-A27 | M→A | DIRETTA | PAUSA-RACCOLTA stop nuovi meccanismi | accettata | EVOLUZIONE L199-204 |
| M1-A28 | A→M | DIRETTA | Checklist QA con path `/c/...` | rifiutata | OSS L213 |
| M1-A29 | M→A | DIRETTA | Prompt intero su correzione | accettata | ARCHIVIO L18 |
| M1-A30 | M→A | DIRETTA | Guard PROD ask non deny | accettata | EVOLUZIONE L293 |
| M1-A31 | A→M | DIRETTA | Confusione Prenota↔QR in chat esplorativa | rifiutata → alwaysApply | ERRORI L41; ARCHIVIO L21 |
| M1-A32 | M→A | DIRETTA | Frenata su file unico mappa richieste | rifiutata (per ora) | PROPOSTE L52 |
| M1-A33 | M→A | DIRETTA | Blindatura di prodotto oltre doc | accettata | PROSEGUIMENTO L87-99 |
| M1-A34 | M↔M | DIRETTA | Ridefinizione lavoro-ok vs report-finale (01-06) | accettata | VOCABOLARIO; COMANDI_AVVIO |
| M1-A35 | A→M | DEDOTTA | Premesse ereditate false (difetti/commit) ×3 | parziale (intercettate) | EVOLUZIONE Log 06-08 L434 · IPOTESI |
| M1-A36 | M→A | DIRETTA | Su AskUser «per sala» → 8 risposte + controproposta | accettata | EVOLUZIONE Log L434 |
| M1-A37 | A→M | DIRETTA | Select esclusivo vs multi-checkbox promo | rifiutata → corretto | ARCHIVIO_OSS |
| M1-A38 | M→A | DIRETTA | Protocollo REVISIONE: no voci senza ok Matteo | accettata | REVISIONE L109-111 |

**Conteggi agency:** M→A 26 · A→M 14 · M↔M 2 · **totale 42** (DIRETTA 40 · DEDOTTA 2)

---

## Sezione 3 — Skill signals

| Etichetta | Liv. | Prova | Contro-evidenza (sez.4) | Note |
|-----------|------|-------|-------------------------|------|
| Vocabolario governato + livelli libertà | L4 | D01-D04, R1-R5 | C15, C17 | Codificato; rifiuti espliciti |
| Profili Esecuzione/Verifica/Meta | L4 | D05-D06 | C5 | Codificato in VOC + COMANDI_AVVIO |
| Separazione lavoro ok vs report finale | L4 | D08-D09, A03 | C9 | Corretto e ridefinito |
| Disambiguazione Prenota/QR/menu×3 | L4 | D17, D27-D28, A08 | C1 | Gate + alwaysApply dopo ≥3 errori |
| Soft vs enforcement (hook > markdown) | L4 | D24, D40-D44, A13 | C4, C20 | Ha scelto la macchina sul guasto #1 |
| Controtest / blindatura prodotto | L4 | D46-D47, A16 | C11 | Criterio prodotto esplicito |
| Controverifica imparziale | L4 | D45, A17 | — cercata, non trovata fallimento metodo in M1 | Protocollo file |
| Educazione reciproca (senior educa Matteo) | L3 | D39, D62 | C6, C7 | Mandato 04-06; fallimenti lingua |
| Mockup HTML prima di scelte UX | L4 | D32, A22 | — cercata, non trovata in M1 | Codificato PREPARA |
| Scope control / anti-scope-creep | L3 | D23, A07 | C8, C15 | Corretto agenti; PAUSA |
| Annota ≠ codifica | L4 | D50, A21 | C4 (pezza umana) | Confine ruoli |
| Allineamento skill implicito | L4 | D49, A19 | — cercata, non trovata in M1 | Ha rifiutato la domanda |
| Comunicazione schermata+effetto | L4 | D30, D57-D58 | C7, C10 | Correzione checklist + sigle |
| Copy verbatim / delta minimo | L3 | D35, A25 | — | Correzione agente |
| Sicurezza PROD (ask non deny) | L4 | D15, D43 | — cercata, non trovata violazione in M1 | Hook + markdown |
| Privacy docs/_lavoro | L4 | D54 | — | Regola sensibilità |
| Context-knowledge (codice=verità) | L4 | D61, D66 | C19 (checklist obsoleta) | Pilota Prenota |
| Decisioni in termini di sala | L3 | D70, A15 | C6 | Correzione lingua |
| Snellimento sistema come missione | L2 | D63 | C13 (oscillazione v.0) | Richiesta; meno codificata |
| Template v.0 riusabile + sync | L3 | D52, D69, D76 | C13, contro-evidenza v0 vivo | Biforcazione operativo/template |
| Release hygiene (pubblico=prodotto) | L3 | D48 | — cercata, non trovata in M1 | Deciso 10-06 |
| QA umano checklist flussi | L2 | D71 | C12 | Dipendenza da QA Matteo |
| Modello commerciale edition/add-on | L1–L2 | D74 | — | Chi ORIGINATA = INCERTO in M1 |

> **Regola L3/L4:** ogni skill L3+ ha contro-evidenza cercata in sez.4, oppure dichiarazione «cercata, non trovata in questo perimetro».

---

## Sezione 4 — Contro-evidenze

| # | Tipo | Cosa | Fonte |
|---|------|------|-------|
| C1 | Sbagliato / confuso | Checklist #8 «homepage QR» mentre sintomo era Prenota; detto a ≥3 agenti ma loop misrouting | ERRORI L59-67 |
| C2 | Cambiato idea | Overlay ingredienti: mattina anti-overlap → pomeriggio overlay (12h) | ERRORI L69-74 |
| C3 | Delegato eccessivo | Fiducia validate come prova senza rilettura riga-per-riga | ARCHIVIO_OSS (validate) |
| C4 | Fermato / pezza | Ripete frase lunga perché agenti saltano sezioni report | OSS; VOC pezza «compila report» |
| C5 | Fermato | Procedura avvio (@ APP_CONTEXT) «non ancora internalizzata» | ARCHIVIO_OSS |
| C6 | Sbagliato (lingua) | Non capisce domande in termini implementazione | EVOLUZIONE Log L438 |
| C7 | Fermato | Non capisce elenchi minimali con sigle FU | OSS L204 |
| C8 | Delegato | Annulla 2º esecutore; slot freeze pendenti | OSS |
| C9 | Precisato mid-flusso | «report finale» poi «solo commit» (blocca push) | OSS L100-105 |
| C10 | Percezione UX | «non vedo il modal» = non percepisce window.confirm | VOC; OSS |
| C11 | Fermato | Controtest browser extra lasciato a sessioni future | OSS FU-M3 |
| C12 | Delegato | QA browser formale spesso non fatto da agente; Matteo fa QA | ARCHIVIO_OSS pattern |
| C13 | Oscillazione | Propagazione template v.0 sospesa poi sbloccata parziale | EVOLUZIONE L462·L472 |
| C14 | Premessa falsa | Contesto ereditato con difetti/commit falsi | EVOLUZIONE Log 06-08 · IPOTESI chi ha scritto memoria |
| C15 | Auto-limite | PAUSA-RACCOLTA: decide di non aggiungere meccanismi | EVOLUZIONE L199 |
| C16 | Framing sbagliato | Aveva usato framing «bug» su comportamento ok da cambiare | ARCHIVIO_OSS |
| C17 | Basso uso | Liv.2 «main»/«menù originale» a 0 esiti (poi confermate tenere) | EVOLUZIONE L464 |
| C18 | Score mediocre | Score chat 31-05 = 6,5/10; 1 misrouting grave | EVOLUZIONE L455 |
| C19 | Checklist obsoleta | Collaudo gonfio: voce pulsante rimosso mesi fa | EVOLUZIONE Log 06-08 |
| C20 | Rumore processo | Hook stop ×5 con agenti background vivi | EVOLUZIONE Log L438 |
| C21 | v0 non «abbandonato» | Template resta vivo + obbligo sync REVISIONE §6b — contro narrazione migrazione lineare | `_skill-system-v0/README.md`; REVISIONE §6b |
| C22 | Checklist apertura v0 | Blocco apertura sessione in COMUNICAZIONE v0 **assente** nell'operativo attuale | confronto v0 ↔ COMUNICAZIONE_UTENTE (fuori perimetro ma gemello) |
| C23 | Origine modello skill-area | Chi ha *originato* il modello cartella `<Area>-Skill/` non è firmato Matteo-verbatim | PROSEGUIMENTO; APP_CONTEXT §0 → INCERTO |

---

## Sezione 5 — Copertura dichiarata

| Voce | Valore |
|------|--------|
| File nel perimetro | **36** |
| File aperti | **36** |
| % | **100%** |
| File illeggibili o saltati | **0** |

### Elenco file aperti (conteggio verificato)

**Comunicazione-Skill (13):** ANALISI_REVISIONE_SENIOR_PRENOTA_POST_BLINDATURA.md · ARCHIVIO_DECISIONI.md · ARCHIVIO_OSSERVAZIONI.md · CHIUSURA_SESSIONE.md · COMANDI_AVVIO.md · CONTROVERIFICA.md · ERRORI_PROCESSO.md · EVOLUZIONE_SKILLS.md · OSSERVAZIONI.md · PROPOSTE.md · PROSEGUIMENTO_MAPPATURA_SKILL.md · REVISIONE.md · VOCABOLARIO.md

**Altri (2):** `docs/Archivio/CONTESTO_PRODOTTO.md` · `docs/APP_CONTEXT_SKILL.md`

**_skill-system-v0 (21):** 00_BUSSOLA_SKILL.md · MANUALE_AVVIO.md · README.md · REGOLE_ORGANIZZATIVE.md · aree/_TEMPLATE_AREA_SKILL.md · aree/_TEMPLATE_MINI.md · comunicazione/{CHIUSURA_SESSIONE, COMUNICAZIONE_SKILL, CONTROVERIFICA, ERRORI_PROCESSO, EVOLUZIONE_SKILLS, OSSERVAZIONI, PROPOSTE, REVISIONE, VOCABOLARIO}.md · context/{_TEMPLATE_CONTEXT, ESEMPIO_ZONA_CONTEXT}.md · hooks/README.md · sessioni/{_TEMPLATE_REPORT, FOLLOW_UP, SESSION_LOG}.md

---

## Sezione 6 — Lacune e handoff

### Lacune
1. **Peso 3–4:** quasi tutto il perimetro è sintesi di agenti. Citazioni «Matteo ha detto X» vanno confermate in **H\*** (transcript) e **A\*** (report sessione datati).
2. **Origine taratura livelli 1/2/3:** il meccanismo è firmato come strumento «per Matteo», ma chi ha *proposto* i tre livelli la prima volta resta **INCERTO** senza H/A.
3. **CONTESTO_PRODOTTO / edition model:** decisioni commerciali presenti, attribuzione ORIGINATA a Matteo non firmata → INCERTO (handoff **M4** Marketing + **G1** prezzo).
4. **PROPOSTE.md** contiene solo pendenze ATTESA-DATI: non confondere candidate con decisioni.
5. **§8-bis Lezione** presente in CHIUSURA v0, assente in CHIUSURA attuale: didattica migrata in EVOLUZIONE + `_lavoro` — handoff **G1** Scuola.

### Frecce trasferimento v0 → attuale (materiale per S3)

| Da v0 | A attuale | Esito |
|-------|-----------|-------|
| `00_BUSSOLA_SKILL.md` | `APP_CONTEXT_SKILL.md` | sopravvissuto (operativo pieno) |
| `comunicazione/*` omonimi | `docs/Comunicazione-Skill/*` | sopravvissuto (pieni vs stub) |
| Archivio inline PROPOSTE/OSS | `ARCHIVIO_DECISIONI` + `ARCHIVIO_OSSERVAZIONI` | scisso (nuovo) |
| `sessioni/*` | `docs/Sessioni di lavoro/` + FOLLOW_UP/SESSION_LOG root | spostato |
| `aree/` + `context/` template | skill d'area `docs/*-Skill/` + contesto/ | realizzato fuori Comunicazione-Skill |
| `hooks/README.md` | `.cursor/hooks/` live | sopravvissuto come codice |
| MANUALE_AVVIO + REGOLE_ORGANIZZATIVE | restano nel kit | **nessun gemello** in Comunicazione-Skill |
| Checklist apertura COMUNICAZIONE v0 | — | **abbandonata** in operativo |
| §8-bis CHIUSURA v0 | EVOLUZIONE Playbook §6 + `_lavoro/` | **spostata**, non eliminata |
| — | COMANDI_AVVIO, PROSEGUIMENTO_MAPPATURA (nuovi) | nati dopo estrazione v0 |
| Upgrade Meta | propagati **verso** v0 (REVISIONE §6b) | freccia **inversa** (v0 non è antenato morto) |

### Handoff
| Cosa | A quale ondata |
|------|----------------|
| Confermare citazioni M-VOCE vs sintesi agente | H1–H3, A2–A11 (date 28-05→11-06+) |
| Sessioni che hanno prodotto ARCHIVIO_DECISIONI | A3–A5 (28-05→02-06) |
| Errori Prenota↔QR e overlay | A3–A4 + report citati in ERRORI |
| Scuola / didattico privato | G1 |
| Marketing edition/add-on | M4 + CONTESTO già letto qui |
| Fatti hook/commit enforcement | J1 |
| Catalogo decisioni cross + rifiuti | S1 |
| Agency consolidata | S2 |
| Albero skill + frecce v0 | S3 |
| Contro-evidenze L3/L4 | S4 |

---

## Sezione 7 — Chiusura verso Matteo

Qui hai costruito il «telecomando» degli agenti: parole tue che aprono profili, livelli di libertà, e rifiuti espliciti di voci inutili.
Quando qualcosa andava storto (pagina sbagliata, report incompleti, promozione senza il tuo ok), hai preferito la macchina (hook, gate) alla sola regola scritta.
Il kit `_skill-system-v0` non è un museo: è il gemello riusabile che tieni allineato mentre la copia operativa cresce — da confermare ancora con le chat vere (H) e i report di sessione (A).
