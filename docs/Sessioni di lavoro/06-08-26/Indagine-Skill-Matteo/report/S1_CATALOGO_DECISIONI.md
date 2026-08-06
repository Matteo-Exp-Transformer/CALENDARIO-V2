# S1 — Catalogo decisioni cross

> **Profilo:** Verifica | Meta · **Modalità:** deep · **Data report:** 07-08-26
> **Ingresso:** le Sezioni 1 dei 39 report di mining — **1.826 righe**, riconteggiate, non ereditate
> **Uscita:** **1.703 righe** dopo deduplica semantica (109 fusioni, 123 righe assorbite)
> **Metodo:** estrazione meccanica ricontabile + giudizio semantico firmato dal senior
> **Precondizione (regola comune 1):** verificata — tutti e 39 i report d'ingresso esistono in `report/`.
> Nessun file grezzo dei corpora è stato riaperto: dove un dato non è in un report, è aperta una lacuna.

---

## §0 — Come è stato costruito (per chi deve poterlo rifare)

L'estrazione **non** è stata fatta a occhio. Le righe sono state prese da uno script che riconosce
**solo** le tabelle il cui header è letteralmente
`ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill` (regola comune 2), che
rispetta i pipe escapati dentro le citazioni e che censisce a parte le tabelle satellite. Gli script e
i file intermedi stanno in `docs/_lavoro/Indagine-Corpus/S1/` (fuori da git, autorizzato dalla regola
comune 8): `estrai_sezione1.py`, `aggrega.py`, `candidati_dedup.py`, `fusioni.py`, `costruisci.py`.

I candidati di deduplica sono stati generati meccanicamente (sovrapposizione di token su
Oggetto + Skill + Citazione, indice inverso sui token rari, componenti connesse, solo gruppi che
attraversano almeno due ondate diverse): **119 gruppi candidati, 289 righe coinvolte**. Il senior li ha
giudicati uno per uno, ne ha spezzati tre che la chiusura transitiva aveva sovra-fuso, e ha aggiunto le
fusioni mancanti partendo dai 16 cluster dell'input. **La macchina propone, il senior firma.**

**Cosa NON è stato fatto**, per mandato: nessun report d'origine è stato corretto (M1 dichiara 42
agency e ne ha 38: registrato, non sistemato); nessun conflitto lasciato aperto dalle ondate H è stato
chiuso; nessuna decisione è stata inventata per far quadrare un totale.

---

## §1 — I numeri d'ingresso: 1.826, ricontati per lotto

Il taglio in sei lotti è quello della regia consigliata (per famiglia di linea). **Tutti e sei tornano
al numero atteso**, quindi nessun lotto è stato rifatto.

| Lotto | Report | Attese | Contate | Esito | Dettaglio per ondata |
|-------|--------|--------|---------|-------|----------------------|
| L1 | M1–M4 | 227 | **227** | ✅ | M1 80 · M2 32 · M3 55 · M4 60 |
| L2 | A1–A6 | 382 | **382** | ✅ | A1 92 · A2 65 · A3 67 · A4 58 · A5 48 · A6 52 |
| L3 | A7–A11 | 301 | **301** | ✅ | A7 66 · A8 55 · A9 54 · A10 71 · A11 55 |
| L4 | B1–B3, C1–C5, D1–D2, E1–E2, F1 | 434 | **434** | ✅ | B1 57 · B2 10 · B3 22 · C1 23 · C2 23 · C3 30 · C4 24 · C5 30 · D1 32 · D2 71 · E1 40 · E2 32 · F1 40 |
| L5 | G1–G3, I1–I2, J1 | 223 | **223** | ✅ | G1 53 · G2 53 · G3 39 · I1 35 · I2 28 · J1 15 |
| L6 | H1–H5 | 259 | **259** | ✅ | H1 58 · H2 52 · H3 60 · H4 47 · H5 42 |
| | **Totale** | **1.826** | **1.826** | ✅ | |

**Verifiche indipendenti superate.** La ripartizione per `Chi` coincide **al singolo** con quella
misurata in `01_INPUT_SINTESI.md` §1 (MATTEO 1.321 · INCERTO 204 · CONGIUNTA 154 · AGENTE 147). Zero
righe senza `Fonte`, zero collisioni di ID: confermato anche dal mio conteggio, non solo dichiarato.

**Le 6 righe con un `|` dentro la citazione** (A1-D79, C4-D09, E2-D08, I2-D20, I2-D21, M2-D25) sono
uscite **integre**: nei report d'origine il pipe è scritto escapato (`\|`) e lo split ne tiene conto.
Nessuna riga del corpus ha prodotto un numero di colonne anomalo.

**Tabelle satellite: lette, non contate.** Lo script le ha censite tutte. Le più insidiose, come
previsto dall'input §3: «Follow-up CORREGGONO vs ESTENDONO» (`Relazione | Tipo | Evidenza`) presente in
A2–A10, e le quattro tabelle «Rifiuti di Matteo» — che finiscono nell'indice separato del §6, **non**
nel catalogo.

### §1.1 — Normalizzazione applicata (mappa `01_INPUT_SINTESI.md` §2)

**36 righe normalizzate su 1.826.** Corrispondono esattamente alla mappa dichiarata (le altre 27 delle
63 previste stanno nelle Sezioni 2, fuori dal perimetro di S1).

| Colonna | Valore trovato | N | Trattamento | Righe |
|---------|----------------|---|-------------|-------|
| `Tipo` | `ARCHITETTURA` | 2 | bucket **FUORI-SCHEMA**, non fuso d'ufficio in PRODOTTO | G3-D30, G3-D31 |
| `Tipo` | `ARCHITETTURA→ALTRO` | 1 | idem | M2-D08 |
| `Autonomia` | `INCERTO` | 25 | bucket **NON-DETERMINABILE**, mai contato come DELEGATA | M1-D69 · M3-D48…D53 · B3 (11) · C2 (5) · C5-D28 · F1-D40 |
| `Autonomia` | `—` | 5 | idem | E1-D26 · E2-D10/D14/D15/D18 |
| `Autonomia` | `ORIGINATA→CORRETTIVA` / `DELEGATA→APPROVATA` | 2 | tenuto il **primo** valore + nota «evoluta in» | A10-D06, A10-D63 |
| `Autonomia` | `M↔M / SCELTA` | 1 | refuso: valore di *Direzione* finito in Sezione 1 → letto `SCELTA` | H2-D48 |

**Divergenza da dichiarare (regola comune 3).** I miei totali di `Autonomia` sono più alti di 1 in tre
categorie rispetto a `01_INPUT_SINTESI.md` §1: ORIGINATA 798 (vs 797), SCELTA 340 (vs 339), DELEGATA
113 (vs 112). **Non è un errore di nessuno dei due:** è l'effetto della normalizzazione. L'input ha
contato i tre valori ibridi come categorie proprie, io li ho ricondotti al primo valore come prescrive
la mappa. Chi eredita questi numeri deve sapere quale delle due letture sta usando.

**Incoerenza importata e non sanata da me:** le righe `Direzione = A→A` sono trattate in modo opposto
da I1 (le esclude dal totale) e da M3 (le include). Vive nelle Sezioni 2, quindi la eredita **S2**, non
S1: la segnalo perché chi somma i sotto-totali dei `_stato/` la importa senza accorgersene.

---

## §2 — Deduplica per tema

**Non esiste una chiave comune su cui fare join.** La stessa decisione è scritta con parole diverse in
ogni linea: «Rimuovi limite coperti giornaliero» (A9), «Niente limite giornaliero, solo per-fascia»
(M3), «Due limiti separati e morbidi» (A6). La deduplica è quindi semantica, e ho separato due grane
che l'input teneva insieme:

- **Fusione** = più righe descrivono **la stessa decisione** (stesso oggetto, stessa data o evoluzione
  dichiarata). Si contano **una volta sola**. Sono 109.
- **Cluster tematico** = più decisioni **diverse** sullo stesso tema. **Non** si fondono, si raccontano
  insieme. Sono 16.

Questa distinzione è la ragione per cui i «16 cluster verificati» dell'input non producono 16 fusioni:
il cluster #1 (limite coperti), per esempio, contiene **cinque** decisioni distinte prese in tre date
diverse — fonderle in una riga cancellerebbe proprio il fatto interessante, cioè che l'11-06 ha deciso
una cosa e il 18-06 l'ha ribaltata.

### §2.1 — Le 109 fusioni firmate

Per ogni fusione: gli ID fusi, le linee coinvolte, il **peso probatorio più alto** disponibile (1 =
parole sue, 2 = fatto git, 3 = report di agenti) e i valori `Chi`/`Autonomia` più forti tra le fonti.

| # | Tema della decisione | Righe fuse | Linee | Peso | Chi | Autonomia | Nota |
|---|----------------------|-----------|-------|------|-----|-----------|------|
| F001 | Regola PROD: verifica ambiente, se PROD fermati | M3-D48 + M1-D15 + G1-D27 + M2-D09 | G/M | 3 | MATTEO | APPROVATA | stessa regola scritta in 4 file di skill diversi (DB, Comunicazione, privato, Console) |
| F002 | Migrazioni S4 solo su TEST fino al rollout | M3-D47 + J1-D08 + I1-D01 | I/J/M | 2 | MATTEO | ORIGINATA | J1 = conferma di fatto (peso 2) |
| F003 | `db push --include-all` vietato per sempre | I1-D04 + M3-D49 | I/M | 3 | CONGIUNTA | APPROVATA |  |
| F004 | «fai report finale» = commit+push, non scrittura del report | A3-D41 + M1-D08 | A/M | 3 | MATTEO | CORRETTIVA |  |
| F005 | «lavoro ok» = report completo, senza commit/push | A3-D40 + M1-D09 | A/M | 3 | MATTEO | CORRETTIVA |  |
| F006 | «prepara» = solo prompt, nessun codice | A2-D41 + M1-D10 | A/M | 3 | MATTEO | ORIGINATA |  |
| F007 | Conflitto promo = modal in-app, non silenzio | A2-D46 + H2-D33 | A/H | 1 | MATTEO | ORIGINATA | H2 conferma A2 (input §5.a) |
| F008 | Mockup HTML multi-stato prima del codice | A2-D52 + H2-D38 + M1-D32 | A/H/M | 1 | MATTEO | ORIGINATA |  |
| F009 | Report unificato del ciclo multi-agente | A2-D48 + H2-D34 + M1-D34 | A/H/M | 1 | MATTEO | ORIGINATA |  |
| F010 | Allineamento skill implicito: non si chiede | A4-D26 + H3-D18 + M1-D49 | A/H/M | 1 | MATTEO | ORIGINATA |  |
| F011 | Autosave solo in debug; in produzione footer manuale | A2-D51 + H2-D37 + M1-D78 | A/H/M | 1 | MATTEO | ORIGINATA | H2 conferma A2 (input §5.a) |
| F012 | Walk-in: sala e tavolo obbligatori | A11-D04 + M3-D38 | A/M | 3 | MATTEO | CORRETTIVA |  |
| F013 | Verdetto: blindato su TEST non significa rilasciato in PROD | A11-D38 + J1-D09 | A/J | 2 | CONGIUNTA | SCELTA | J1 = peso 2 |
| F014 | DPA Supabase firmato e archiviato | G1-D35 + G1-D49 + M4-D16 | G/M | 3 | MATTEO | APPROVATA |  |
| F015 | Listino 12-06 prima versione: Classic 29 / Pro 79 / Ent 129 / +QR 16 | A7-D06 + H3-D34 | A/H | 1 | MATTEO | SCELTA | versione iniziale della giornata; rivista lo stesso giorno (fusione successiva) |
| F016 | Revisione listino post-senior: Pro 79→69, fondatori 3→6 mesi | A7-D41 + M4-D19 + M4-D18 | A/M | 3 | MATTEO | CORRETTIVA | M4-D18 fotografa il listino DOPO la revisione: da sola sembrerebbe smentire A7-D06 |
| F017 | Zero commissioni a coperto, canone fisso | A7-D14 + G1-D33 + M4-D20 | A/G/M | 3 | MATTEO | ORIGINATA |  |
| F018 | Cap testo card QR 30/70 caratteri | A5-D05 + M4-D31 | A/M | 3 | MATTEO | SCELTA |  |
| F019 | XOR: per modalita' solo card oppure solo carosello | A1-D78 + H2-D25 + M4-D34 | A/H/M | 1 | MATTEO | ORIGINATA | cluster #3 dell'input, confermato |
| F020 | Niente merge su main finche' non ha revisionato lui | A1-D24 + H2-D19 | A/H | 1 | MATTEO | ORIGINATA | H2 alza A1 da INCERTO a MATTEO |
| F021 | Posizionamento prenotazione solo in edizione Pro | A1-D28 + H2-D20 + I1-D23 | A/H/I | 1 | MATTEO | APPROVATA | H2 alza A1 da INCERTO |
| F022 | Controverifica del login con sub-agent (06-06) | A5-D34 + H5-D14 | A/H | 1 | MATTEO | ORIGINATA |  |
| F023 | Sette famiglie di test Attivita' A-G scelte dall'utente | C2-D14 + C4-D01 | B-F | 3 | MATTEO | ORIGINATA | handoff C4→S1 dell'input §9 |
| F024 | Tre zone «menu» distinte: Prenota / QR / magazzino | M1-D17 + M4-D39 | M | 3 | MATTEO | APPROVATA |  |
| F025 | Gate di disambiguazione Prenota vs Menu QR | A3-D25 + M1-D28 | A/M | 3 | CONGIUNTA | CORRETTIVA | cluster #11 dell'input |
| F026 | Profilo e skill espliciti nel prompt dell'esecutore | A3-D26 + M1-D29 | A/M | 3 | MATTEO | ORIGINATA |  |
| F027 | Modalita' light / standard / deep | A2-D34 + M1-D33 | A/M | 3 | MATTEO | ORIGINATA |  |
| F028 | Mandato «educare Matteo» + Lezione della chat | A4-D32 + M1-D39 | A/M | 3 | MATTEO | ORIGINATA | CONFLITTO DI AUTONOMIA: A4 APPROVATA vs M1 ORIGINATA (cluster #8 dell'input) — non chiuso, manca peso 1 |
| F029 | Hook stop: rilancia anche se il report si dichiara completo | A4-D28 + M1-D40 | A/M | 3 | MATTEO | ORIGINATA |  |
| F030 | Controtest = cercare cosa rompe, non confermare il verde | A5-D29 + M1-D46 + H3-D26 + M3-D13 | A/H/M | 1 | MATTEO | ORIGINATA | fusione cross-lotto: due coppie separate (A/M e H/M) sono la stessa decisione del 07-06 |
| F031 | «annota / suggerisci» non significa riformare lo skill system | A3-D06 + M1-D50 | A/M | 3 | MATTEO | ORIGINATA |  |
| F032 | Voto sintetico della sessione lo da' il revisore, non l'esecutore | A3-D45 + M1-D51 | A/M | 3 | MATTEO | ORIGINATA |  |
| F033 | «test fatti tutto ok» non autorizza a gonfiare il report | A3-D48 + M1-D60 | A/M | 3 | MATTEO | ORIGINATA |  |
| F034 | Fonte di verita' degli add-on = `tenant_features` | M2-D01 + M4-D23 | M | 3 | MATTEO | CORRETTIVA |  |
| F035 | Staff e admin hanno gli stessi permessi, un solo accesso | A5-D15 + M3-D01 | A/M | 3 | MATTEO | ORIGINATA |  |
| F036 | Header admin con fallback neutro | A5-D18 + M3-D04 | A/M | 3 | MATTEO | SCELTA |  |
| F037 | Capienza / orario passato = solo avviso, mai blocco | A5-D26 + M3-D08 | A/M | 3 | MATTEO | ORIGINATA |  |
| F038 | Calendario mostra solo le prenotazioni accettate | A6-D14 + M3-D15 | A/M | 3 | MATTEO | ORIGINATA |  |
| F039 | Assegnazione tavolo solo da edizione Pro in su | A6-D43 + M3-D16 | A/M | 3 | MATTEO | ORIGINATA |  |
| F040 | Due limiti coperti separati e morbidi (11-06) | A6-D15 + M3-D17 | A/M | 3 | MATTEO | ORIGINATA | cluster #1 dell'input |
| F041 | Blocco per-fascia sul pubblico | A6-D20 + M3-D19 | A/M | 3 | MATTEO | ORIGINATA | A6 «spento di default» → M3 «ritirato»: evoluzione |
| F042 | Pulsante «nuova prenotazione» sempre visibile | A6-D23 + M3-D20 | A/M | 3 | MATTEO | CORRETTIVA |  |
| F043 | Limiti duri magazzino 7 / 12 / 6 / 6 | A6-D01 + M3-D21 | A/M | 3 | MATTEO | ORIGINATA | cluster #9 dell'input |
| F044 | Lo snapshot del menu in prenotazione non si altera mai | A6-D04 + M3-D22 | A/M | 3 | MATTEO | APPROVATA |  |
| F045 | Spento in magazzino = nascosto ovunque | A6-D06 + M3-D23 | A/M | 3 | MATTEO | ORIGINATA | cluster #9 dell'input |
| F046 | Campagne email: gruppo destinatari fisso | A8-D11 + M3-D29 | A/M | 3 | MATTEO | ORIGINATA |  |
| F047 | Mercato: solo Italia per ora | G1-D29 + M4-D01 | G/M | 3 | MATTEO | ORIGINATA |  |
| F048 | Regime fiscale: ipotesi forfettario, da confermare col commercialista | A7-D15 + M4-D02 | A/M | 3 | MATTEO | ORIGINATA |  |
| F049 | Contratto B2B: bozza in repo poi avvocato | A7-D16 + M4-D03 | A/M | 3 | MATTEO | SCELTA |  |
| F050 | Recesso mensile sempre; annuale con 30 giorni | A7-D17 + M4-D04 | A/M | 3 | MATTEO | SCELTA |  |
| F051 | Fattura elettronica tramite portale ADE gratuito | A7-D18 + M4-D05 | A/M | 3 | MATTEO | SCELTA |  |
| F052 | Accessibilita' EAA usata come argomento di vendita | A7-D26 + M4-D09 | A/M | 3 | MATTEO | SCELTA |  |
| F053 | Region Supabase di produzione = Irlanda (UE) | A7-D23 + M4-D11 | A/M | 3 | MATTEO | SCELTA |  |
| F054 | Nome del QR e' etichetta interna, mai mostrata al cliente | A5-D07 + M4-D28 | A/M | 3 | MATTEO | APPROVATA |  |
| F055 | Eyebrow vuota: nessun testo di riempimento inventato | A5-D01 + M4-D30 | A/M | 3 | MATTEO | APPROVATA |  |
| F056 | Eliminare una sala non consuma il turno (come per il tavolo) | A11-D49 + M4-D52 | A/M | 3 | MATTEO | ORIGINATA |  |
| F057 | PWA: registerType `prompt`, mai `autoUpdate` | A2-D17 + M4-D57 | A/M | 3 | AGENTE | CORRETTIVA |  |
| F058 | Budget legale primo anno ~1.500-2.500 euro | A7-D27 + M4-D59 | A/M | 3 | MATTEO | SCELTA |  |
| F059 | Database pulito su test e prod: niente copia dei dati legacy | A1-D10 + H2-D10 | A/H | 1 | MATTEO | CORRETTIVA | H2 (peso 1) alza A1 da INCERTO a MATTEO/CORRETTIVA — regola §1 del piano applicata |
| F060 | «La Ritrovo» fuori scope: nessun seed legacy | A1-D12 + H2-D09 | A/H | 1 | MATTEO | SCELTA | H2 (peso 1) alza A1 da INCERTO |
| F061 | Skill «linguaggio utente»: parlare per schermate, non per file | A1-D41 + H1-D57 | A/H | 1 | MATTEO | ORIGINATA | H1 la data al 15-05, prima del report A1 (24-05): l'origine e' sua |
| F062 | Pill di categoria nel menu QR = navigazione, non filtro | A1-D42 + H2-D21 | A/H | 1 | MATTEO | ORIGINATA |  |
| F063 | Abbinamento promo multi-select 0/1/2/tutte | A2-D45 + H2-D32 | A/H | 1 | MATTEO | CORRETTIVA | H2 conferma A2 (input §5.a) |
| F064 | Home QR: un solo sfondo; header solo nella pagina categoria | A3-D11 + H2-D44 | A/H | 1 | MATTEO | CORRETTIVA |  |
| F065 | Conferma di salvataggio = modale, non toast | A3-D50 + H3-D06 | A/H | 1 | MATTEO | CORRETTIVA |  |
| F066 | Ordine delle categorie QR deciso dall'admin | A3-D52 + H3-D03 | A/H | 1 | MATTEO | ORIGINATA |  |
| F067 | Font e dimensione dell'intestazione Prenota | A3-D62 + H3-D01 | A/H | 1 | MATTEO | ORIGINATA |  |
| F068 | Foto categoria: non su mobile | A3-D63 + H3-D05 | A/H | 1 | MATTEO | CORRETTIVA |  |
| F069 | Sfondo Prenota: solo layout full-page, niente striscia laterale | A4-D11 + H3-D12 | A/H | 1 | MATTEO | ORIGINATA |  |
| F070 | Limiti di testo: l'admin vede il contatore, il cliente no | A4-D21 + H3-D22 | A/H | 1 | MATTEO | ORIGINATA |  |
| F071 | Distinguere risposte guidate (a) da idee autonome (b) | A4-D33 + G1-D08 | A/G | 3 | MATTEO | ORIGINATA | auto-valutazione: materiale S5 |
| F072 | Le tipologie sono capacita', non nomi hard-coded | A4-D50 + I1-D24 | A/I | 3 | MATTEO | ORIGINATA |  |
| F073 | L'orchestratore deve parlare con la skill di comunicazione | A5-D25 + H3-D27 | A/H | 1 | MATTEO | CORRETTIVA |  |
| F074 | Debito dichiarato: E2E browser per ogni area blindata | A6-D13 + H3-D39 | A/H | 1 | MATTEO | ORIGINATA |  |
| F075 | No-show conteggiato dopo l'orario di inizio, non di fine | A6-D32 + H3-D31 | A/H | 1 | MATTEO | CORRETTIVA |  |
| F076 | Firma del ristorante (nome/tel/email) nelle email | A6-D44 + A8-D18 | A | 3 | MATTEO | ORIGINATA | 13-06 → 15-06: stessa decisione estesa |
| F077 | Lancio: fondatori -50% per 3 mesi | A7-D09 + H3-D35 | A/H | 1 | MATTEO | ORIGINATA | poi portato a 6 mesi nella revisione dello stesso giorno |
| F078 | Rimuovere la «finestra di prenotazione» (fuori scope) | A8-D28 + H3-D43 | A/H | 1 | MATTEO | CORRETTIVA |  |
| F079 | L'errore sulla card deve sparire appena corretto | A8-D50 + H3-D47 | A/H | 1 | MATTEO | ORIGINATA |  |
| F080 | Spostare o mettere in attesa non brucia il turno del tavolo | A11-D07 + I1-D06 | A/I | 3 | MATTEO | ORIGINATA |  |
| F081 | Lessico di dominio HACCP (pdc, cascata, timbro, regtemp...) | B1-D33 + H5-D37 | B-F/H | 1 | MATTEO | ORIGINATA |  |
| F082 | Progettare ex-novo: vietato analizzare il codice esistente | C1-D16 + C5-D20 | B-F | 3 | MATTEO | ORIGINATA |  |
| F083 | Quality gate con firma «Conferma Umana» dell'utente | C1-D21 + C5-D29 | B-F | 3 | AGENTE | ORIGINATA |  |
| F084 | Form di creazione vuoti; form di modifica con i dati esistenti | C2-D10 + C4-D16 | B-F | 3 | MATTEO | ORIGINATA |  |
| F085 | Calendario pieno prima dell'onboarding: e' mock? | C2-D11 + C4-D17 | B-F | 3 | MATTEO | ORIGINATA |  |
| F086 | Ogni account registrato deve avere la sua company | C2-D12 + C4-D18 | B-F | 3 | MATTEO | ORIGINATA |  |
| F087 | Onboarding incompleto = database a zero dati | C2-D13 + C4-D19 | B-F | 3 | MATTEO | ORIGINATA |  |
| F088 | Divisione del lavoro: Cursor su bug/UX, Claude su TypeScript/lint | C2-D15 + C4-D22 | B-F | 3 | INCERTO | SCELTA |  |
| F089 | Primo skill system a 6 skill (overview/test/mapping/prompt/error) | C2-D17 + C5-D27 | B-F | 3 | INCERTO | ORIGINATA |  |
| F090 | Flusso ACCETTA prenotazione corretto direttamente dall'utente | C3-D30 + D1-D32 | B-F | 3 | MATTEO | CORRETTIVA |  |
| F091 | Rate limit sull'endpoint pubblico di prenotazione | D1-D30 + G3-D35 | B-F/G | 3 | INCERTO | SCELTA | CONFLITTO APERTO: D1 dice 3 richieste/ora per IP, G3 dice 5 al minuto. Entrambe INCERTO |
| F092 | Tema admin da warm-wood a blu/indaco | D2-D22 + G3-D18 | B-F/G | 3 | INCERTO | ORIGINATA | handoff G3→S4: quando e perche' |
| F093 | Riferimento visivo Dribbble «Restaurant Admin Dashboard» | D2-D23 + H1-D04 | B-F/H | 1 | MATTEO | SCELTA | H1 (peso 1) lo data al 27-04, giorno di nascita di CB-v2 |
| F094 | Guardrail del Tutor descrittivo, non frase letterale | E1-D05 + I2-D13 | B-F/I | 3 | CONGIUNTA | CORRETTIVA |  |
| F095 | Vision Reader fuori dal gate di compliance | E1-D28 + I2-D14 | B-F/I | 3 | CONGIUNTA | CORRETTIVA |  |
| F096 | Massimo 5 screenshot per chat, uguale su tutti i tier | E1-D30 + I2-D16 | B-F/I | 3 | CONGIUNTA | CORRETTIVA |  |
| F097 | Prezzi e legale restano gated da Matteo (AL-F) | G1-D40 + I1-D19 | G/I | 3 | MATTEO | ORIGINATA |  |
| F098 | In Pro, nascondere «Imposta fasce» dalle Impostazioni | H1-D55 + I1-D22 | H/I | 1 | MATTEO | ORIGINATA |  |
| F099 | Survivor consegnato a Tommaso in un solo file | H4-D10 + I2-D01 | H/I | 1 | MATTEO | ORIGINATA | collaborazione con un pari umano: materiale S5 |
| F100 | Skill sprite-sheet limitata al ritaglio dei frame | H4-D30 + I2-D10 | H/I | 1 | MATTEO | ORIGINATA |  |
| F101 | Scelta delle carte solo da fine wave 2 | H4-D25 + I2-D25 | H/I | 1 | MATTEO | ORIGINATA |  |
| F102 | Scudo e Famiglio sbloccati da wave 8 | H4-D26 + I2-D26 | H/I | 1 | MATTEO | ORIGINATA |  |
| F103 | La Console non entra nella repo pubblica | A10-D55 + J1-D10 | A/J | 2 | MATTEO | ORIGINATA | cluster #10 dell'input; J1 = peso 2 |
| F104 | Masterplan allineamento = indice, zero WP eseguiti | A7-D01 + I1-D20 | A/I | 3 | MATTEO | ORIGINATA | cluster #6 dell'input |
| F105 | Un WP per sessione, mai due | M4-D45 + G1-D39 | G/M | 3 | MATTEO | ORIGINATA | cluster #6 dell'input |
| F106 | Taglio del collaudo manuale da 62 a 16 prove umane | A11-D43 + M3-D42 | A/M | 3 | CONGIUNTA | SCELTA | DIVERGENZA DI AUTONOMIA: A11 SCELTA vs M3 DELEGATA (cluster #13) — annotata, non appiattita |
| F107 | Modello commerciale ibrido: edition + `tenant_features` | A1-D34 + M1-D74 | A/M | 3 | MATTEO | SCELTA | cluster #14 dell'input |
| F108 | Rimozione del limite coperti giornaliero (18-06) | A9-D15 + M3-D31 | A/M | 3 | MATTEO | CORRETTIVA | cluster #1: ribalta la decisione dell'11-06 |
| F109 | Sul pubblico resta solo il cap per fascia | A9-D16 + M3-D37 | A/M | 3 | MATTEO | ORIGINATA | M3-D37 la ribadisce il 02-08 |

**Effetto sui totali:** 232 righe entrano nelle fusioni, ne escono 109. **123 righe assorbite**,
1.826 − 123 = **1.703 righe nel catalogo finale**.

**Chi perde più righe è la linea M** (227 → 180): è coerente e va letto come un risultato, non come uno
scarto. Le skill d'area sono il posto dove le decisioni prese altrove vengono **ricopiate** per
diventare regola: la sovrapposizione con A e H è la prova che il passaggio «decisione → regola scritta»
è realmente avvenuto.

### §2.2 — I 16 cluster tematici

I primi otto sono i cluster dell'input §4 (verificati riga per riga: **tutti gli ID citati esistono
davvero** nei report). Gli altri otto sono nuovi, trovati con gli eventi-cardine del piano §2.2.

| # | Tema | Righe | Linee | Nota |
|---|------|-------|-------|------|
| T01 | Limite coperti: nasce 11-06, ribaltato 18-06, ribadito 02-08 | 10 — A6-D15 · M3-D17 · A6-D16 · A6-D17 · A6-D20 · M3-D19 · A9-D15 · M3-D31 · A9-D16 · M3-D37 | A/M | cluster #1 dell'input. Nessuna citazione in cui ammette l'errore: i report lo chiamano cambio di modello |
| T02 | Split in 3 repository e regola del merge pubblico | 8 — G1-D38 · A5-D39 · M1-D48 · A10-D53 · J1-D02 · J1-D05 · A10-D55 · J1-D10 | A/G/J/M | cluster #2 + #15 dell'input: l'evento (split) e la regola (solo se tocca src/) sono decisioni diverse |
| T03 | Vocabolario dei comandi e livelli di liberta' 1/2/3 | 11 — M1-D02 · M1-D03 · M1-D04 · A2-D29 · A2-D30 · A3-D40 · M1-D09 · A3-D41 · M1-D08 · A2-D41 · M1-D10 | A/M | cluster #4 dell'input, esteso ai comandi che i livelli governano |
| T04 | send-email / Brevo: dalle chiavi alla produzione | 5 — A8-D04 · A8-D22 · A8-D26 · A9-D04 · M4-D60 | A/M | cluster #5 dell'input |
| T05 | Nascita del profilo Verifica e della controverifica | 8 — M1-D45 · A4-D42 · A4-D44 · A4-D45 · A5-D34 · H5-D14 · H4-D06 · H1-D43 | A/H/M | cluster #7 dell'input + le due righe H che datano la pratica a febbraio |
| T06 | Gate di disambiguazione Prenota vs Menu QR | 8 — A3-D09 · A3-D25 · M1-D28 · A3-D27 · M1-D17 · M4-D39 · M1-D27 · M4-D56 | A/M | cluster #11 dell'input |
| T07 | Governance TEST/PROD: la regola piu' ripetuta del corpus | 14 — M3-D48 · M1-D15 · G1-D27 · M2-D09 · H2-D05 · A2-D01 · M3-D47 · J1-D08 · I1-D01 · G3-D39 · I1-D04 · M3-D49 · A9-D20 · A4-D54 | A/G/H/I/J/M | cluster #12 dell'input, allargato |
| T08 | Blindatura: intervista obbligatoria per sezione | 8 — M4-D42 · A5-D14 · A5-D15 · M3-D01 · A5-D22 · A5-D26 · M3-D08 · M3-D35 | A/M | cluster #16 dell'input |
| T09 | Prezzo e posizionamento: la giornata del 12-06 | 12 — A7-D06 · H3-D34 · A7-D41 · M4-D19 · M4-D18 · A7-D09 · H3-D35 · A7-D14 · G1-D33 · M4-D20 · G1-D29 · M4-D01 | A/G/H/M | NUOVO. Una sola giornata contiene listino, revisione, sconto lancio e posizionamento |
| T10 | Rito di chiusura sessione: report, commit, push | 9 — A2-D04 · A10-D03 · A8-D03 · A7-D43 · A3-D41 · M1-D08 · A3-D40 · M1-D09 · A11-D27 | A/M | NUOVO. La sequenza «lavoro ok» → «fai report finale» e' il ritmo di chiusura piu' ripetuto |
| T11 | Gate umano prima del rilascio: nessun merge senza la sua prova | 11 — A1-D24 · H2-D19 · H3-D21 · A8-D09 · A10-D17 · A7-D57 · A9-D36 · A6-D52 · H3-D38 · A11-D38 · J1-D09 | A/H/J | NUOVO. Attraversa A, H e J: e' il punto in cui il fatto oggettivo conferma la regola |
| T12 | Modale come pattern di conferma, contro toast e window.confirm | 5 — A2-D46 · H2-D33 · M1-D14 · A3-D50 · H3-D06 | A/H/M | NUOVO |
| T13 | Limiti morbidi: il software avvisa, non blocca l'admin | 7 — A5-D26 · M3-D08 · A6-D15 · M3-D17 · A6-D16 · A11-D05 · A6-D21 | A/M | NUOVO. E' il principio di prodotto sotto T01: chi lavora in sala non va bloccato |
| T14 | Dirty guard: non si perde il lavoro non salvato | 3 — A8-D20 · H3-D32 · M3-D03 | A/H/M | NUOVO |
| T15 | Edition gating: cosa vede Classic e cosa solo Pro | 11 — A1-D28 · H2-D20 · I1-D23 · H1-D55 · I1-D22 · A6-D43 · M3-D16 · A1-D34 · M1-D74 · M2-D01 · M4-D23 | A/H/I/M | NUOVO. Unisce il modello commerciale (#14) alle sue istanze in interfaccia |
| T16 | Trasferimento del metodo agli altri progetti | 9 — B1-D33 · H5-D37 · E1-D36 · M1-D05 · E1-D05 · I2-D13 · H5-D24 · H4-D30 · I2-D10 | B-F/H/I/M | NUOVO. Il vocabolario e i guardrail rinascono su trading, HACCP e giochi |

**Come sono stati trovati i nuovi otto.** T09 e T10 dalla cronologia (§2.2 del piano: la giornata del
12-06 e il ritmo di chiusura); T11, T13, T15 dai gruppi meccanici che attraversavano tre linee diverse;
T12, T14, T16 dalla ricorrenza di una stessa etichetta `Skill` su ondate lontane tra loro.

---

## §3 — Conflitti e divergenze

**Prima gli importati, con la fonte originale**, come da mandato: non li ho riscoperti, li ho ereditati.

### §3.1 — Importati (già verbalizzati da altre ondate)

| # | Conflitto | Fonte originale | Stato |
|---|-----------|-----------------|-------|
| I-1 | Promo vol-au-vent / DB pulito: A1 aveva messo `INCERTO`, H2 ha risposte A/B/C esplicite | H2 §4, tabella divergenze | **chiuso a favore di H** — applicato: F059 e F060 alzano A1-D10 e A1-D12 da INCERTO a MATTEO |
| I-2 | Annulla layout modal 23-05 | H2 §4 | allineati, nessuna azione |
| I-3 | Promo multi-select · Modal conflitto · Autosave footer | H2 §4 | H **conferma** A2 — fusioni F063, F007, F011 |
| I-4 | **Prezzo carosello, A2-D09 vs A2-D10** | H2 §4, riaperto in H3 §6 | **APERTO. Mai chiuso da nessuno.** H non trova la coppia. Eredita **S4** |
| I-5 | Overlay card ingredienti «no→sì»: A lo narra come pivot del 29-05, H dice che l'overlay era l'obiettivo dal mattino | H2 §4 | **sospetta sovra-narrazione di A.** Aperto, eredita S4/S5 |
| I-6 | Tono: A ammorbidisce («l'agente ha sistemato»), H è molto più duro | H2 §4 | H più severo. Materiale **S5** |
| I-7 | «release» è parola generica nei report: **0 tag su CB-v2**, le 32 release stanno su PrenotaZen | J1 §5.b | chiuso a favore di J (peso 2) |
| I-8 | **Autore git = Matteo non prova che il codice sia suo** (+25 commit di Cristiano) | J1 §5.b | **APERTO per eccezione dichiarata.** Né git né i report bastano: serve H. **Non chiuso a favore di J1** |
| I-9 | Drift numerico: P0 diceva 1.073 commit, sono 1.074 | J1 §5.b | chiuso, ininfluente |
| I-10 | La Console **non** è uno scope lasciato a metà: F1→F13 e REQ-001…004 risultano **accettate** | M2 §4 | **smentita un'ipotesi del piano stesso.** Da correggere ovunque venga ripresa |
| I-11 | A3: «migrazione PROD 041 applicata» vs «non applicata» nello stesso file | A3 §3 | contraddizione interna a una sola fonte. Aperto |

### §3.2 — Nuovi, trovati in questa ondata

| # | Conflitto | Righe | Verdetto |
|---|-----------|-------|----------|
| N-1 | **Rate limit dell'endpoint pubblico di prenotazione**: D1-D30 dice «3 richieste/ora per IP», G3-D35 dice «5 al minuto» | D1-D30 · G3-D35 (F091) | **APERTO.** Valori incompatibili, entrambe le righe sono `INCERTO`, nessuna fonte di peso 1 o 2. Eredita **S4** |
| N-2 | **Listino del 12-06**: A7-D06 e H3-D34 dicono Pro **79**, M4-D18 dice Pro **69** | F015 vs F016 | **Risolto: non è un conflitto, è una sequenza.** Lo stesso giorno, dopo una revisione senior, il prezzo scende a 69 e i fondatori passano da 3 a 6 mesi (A7-D41, M4-D19). La skill Marketing fotografa solo lo stato finale: **letta da sola smentirebbe A7 e H3** |
| N-3 | **Autonomia del mandato «educare Matteo»**: A4-D32 `APPROVATA`, M1-D39 `ORIGINATA` | F028 | **APERTO.** È il caso-tipo del cluster #8. Nessuna fonte di peso 1 sul 04-06 lo dirime: la regola §1 non è applicabile perché manca il transcript. Eredita **S4** |
| N-4 | **Autonomia del taglio collaudo 62→16**: A11-D43 `SCELTA`, M3-D42 `DELEGATA` | F106 | Divergenza minore, **annotata e non appiattita** come chiede il cluster #13 |
| N-5 | **Il limite coperti dell'11-06 viene ribaltato il 18-06** senza che nessuna fonte lo chiami errore | T01 | Registrato. Nessuna citazione in cui ammette di aver sbagliato: **candidato forte come contro-evidenza per S4** |
| N-6 | **Cap follow-up per chat**: E1-D31 dice 8 (Trading v.0, 21-05), F1-D11 dice 5 (FREEDOM, 01-07) | E1-D31 · F1-D11 | **Non è un conflitto**: prodotti e date diversi. Lo segnalo perché una deduplica per etichetta `Skill` li fonderebbe |
| N-7 | **M1 dichiara 42 righe di agency e ne ha 38** | M1 `_stato` | Registrato, **non corretto** (mandato esplicito). È l'unico report che non torna sul proprio criterio di accettazione del piano §6 |

---

## §4 — Tabelle di sintesi

Tutte calcolate **dopo** la deduplica, su 1.703 righe.

> ⚠️ **Due avvertenze che non vanno lette sotto le tabelle, ma insieme alle tabelle.**
>
> **1. La linea H ha `Chi = MATTEO` al 100% per costruzione del perimetro.** Il corpus H sono *solo* i
> suoi messaggi: non è un segnale di autonomia più alta, è un artefatto. Non va confrontata con le
> altre linee.
>
> **2. La linea J va tenuta in riga separata.** Lì `Chi = MATTEO` è una convenzione da autore-commit, e
> J1 stesso avverte che «l'autore dei commit è sempre Matteo anche quando il codice l'ha scritto un
> agente». Sommarla alla pari gonfia il conteggio delle decisioni originate.
>
> Per questo sotto ogni tabella d'attribuzione c'è anche la versione **senza H e senza J**.

### §4.1 — Per tipo

| Tipo | N | % |
|---|---|---|
| AI-METODO | 313 | 18.4% |
| UI-UX | 300 | 17.6% |
| PRODOTTO | 263 | 15.4% |
| PROCESSO | 199 | 11.7% |
| TESTING | 145 | 8.5% |
| SICUREZZA | 132 | 7.8% |
| FLUSSO | 111 | 6.5% |
| IMPOSTAZIONI | 59 | 3.5% |
| VENDITA | 55 | 3.2% |
| COMPLIANCE | 52 | 3.1% |
| FORMAZIONE | 42 | 2.5% |
| LEGALE | 20 | 1.2% |
| CONFLITTI | 6 | 0.4% |
| ALTRO | 3 | 0.2% |
| FUORI-SCHEMA | 3 | 0.2% |
| **Totale** | **1703** | 100% |

Le prime quattro voci — metodo di lavoro con gli agenti, interfaccia, prodotto, processo — fanno
**1.075 righe su 1.703, il 63%**. `AI-METODO` in testa non è un artefatto di una singola linea: è il
primo tipo in tre linee su sette, e sono le tre che contano di più per questa domanda — **M** (le
regole effettivamente scritte, 55), **B–F** (gli archivi degli altri progetti, 80) e soprattutto **H**
(le sue parole, 64). Sulla linea A vince l'interfaccia (UI-UX 143), che è prevedibile: le sessioni
pubbliche raccontano soprattutto cosa si stava costruendo a schermo.

### §4.2 — Per autonomia

| Autonomia | N | % |
|---|---|---|
| ORIGINATA | 752 | 44.2% |
| SCELTA | 324 | 19.0% |
| APPROVATA | 288 | 16.9% |
| CORRETTIVA | 204 | 12.0% |
| DELEGATA | 109 | 6.4% |
| NON-DETERMINABILE | 26 | 1.5% |
| **Totale** | **1703** | 100% |

**Senza H e senza J** (1.429 righe): ORIGINATA 567 (40%) · SCELTA 295 (21%) · APPROVATA 270 (19%) ·
CORRETTIVA 165 (12%) · DELEGATA 106 (7%) · non determinabile 26 (2%).

**Il dato più forte del corpus regge anche dopo la dedup:** sulla sola linea H — peso 1, parole sue —
`ORIGINATA` è **183 su 259, il 71%**, contro il 40% delle linee di peso 3. È l'unica conferma di peso 1
che l'immagine «origina più che approvare» non è un'invenzione dei report scritti da agenti.

### §4.3 — Per chi ha deciso

| Chi | N | % |
|---|---|---|
| MATTEO | 1238 | 72.7% |
| CONGIUNTA | 137 | 8.0% |
| AGENTE | 144 | 8.5% |
| INCERTO | 184 | 10.8% |
| **Totale** | **1703** | 100% |

**Senza H e senza J** (1.429 righe): MATTEO 977 (68%) · INCERTO 183 (13%) · AGENTE 143 (10%) ·
CONGIUNTA 126 (9%). Il 13% di `INCERTO` è concentrato nelle linee B–F, dov'è **disciplina corretta**:
in quel materiale Matteo quasi non è nominato e le decisioni sono attribuite a «Owner» o «utente».

### §4.4 — Per mese

| Mese | Decisioni | di cui ORIGINATA | Progetto prevalente |
|---|---|---|---|
| dic 2024 | 3 | 0 | HACCP legacy (PRD) |
| gen 2025 | 58 | 25 | HACCP legacy |
| ott 2025 | 37 | 18 | HACCP legacy |
| nov 2025 | 8 | 3 | HACCP legacy |
| dic 2025 | 2 | 2 | HACCP legacy |
| gen 2026 | 29 | 5 | HACCP legacy / cleanup |
| feb 2026 | 29 | 16 | CB-old · MathBoy2 · Game |
| mar 2026 | 59 | 37 | MathBoy2 · Game · CB-old |
| apr 2026 | 5 | 4 | nasce CB-v2 (27-04) |
| mag 2026 | 487 | 189 | CB-v2 al picco + Trade-Analyst in parallelo |
| giu 2026 | 667 | 322 | CB-v2 (mese più denso) + Console |
| lug 2026 | 107 | 52 | BHM-Zen · Trading-Platform · FREEDOM |
| ago 2026 | 83 | 31 | ritorno CB-v2 (capitolo Servizio) |
| senza data | 129 | 48 | misto (fonti senza data nel testo) |
| **Totale** | **1703** | **752** | |

**Il buco di luglio non esiste.** Luglio ha 107 decisioni: semplicemente non sono su CalendarBackup.
Confermata la correzione del piano §2.2 — non è una pausa, è un cambio di progetto. E maggio-giugno
mostrano il trading **in parallelo** al picco di CB-v2, non dopo.

⚠️ **Limite di lettura, dichiarato:** solo il 20% dei messaggi CB-v2 ha un timestamp proprio, e le date
delle linee B/C non sono affidabili dal filesystem (gran parte di `docs/Archives/` ha mtime identico
05-02-26, una copia in blocco). **Le date a livello di mese sono affidabili, quelle a livello di giorno
no.** Le 129 righe «senza data» non sono un buco dell'estrazione: nei report d'origine il campo `Data`
vale `?`, quasi tutte in M e B–F, dove la fonte è un file di skill senza data nel testo.

### §4.5 — Per linea / progetto

| Linea | Peso | In ingresso | Dopo dedup | MATTEO | ORIGINATA | Nota |
|---|---|---|---|---|---|---|
| M — skill d'area e meta (CB-v2) | 3 | 227 | 180 | 133 | 90 | assorbe più fusioni di tutti: è la linea che ricopia le decisioni nelle skill |
| A — sessioni pubbliche CB-v2 | 3 | 683 | 640 | 547 | 264 |  |
| B–F — archivi (BHM, HACCP legacy, CB-old, trading) | 3 | 434 | 421 | 190 | 156 | 25% INCERTO: lì Matteo quasi non è nominato |
| G — lavoro privato | 3 | 145 | 138 | 86 | 46 |  |
| H — parole sue nei transcript | 1 | 259 | 259 | 259 | 183 | **Chi=MATTEO al 100% per costruzione del perimetro** |
| I — piani `.cursor/plans` | 3 | 63 | 50 | 21 | 11 |  |
| J — fatti oggettivi (git) | 2 | 15 | 15 | 2 | 2 | **Chi=MATTEO è convenzione da autore-commit** |
| **Totale** | | **1826** | **1703** | **1238** | **752** | |

---

## §5 — Le 30 decisioni più significative

**Criterio dichiarato, applicato in quest'ordine:**

1. **Impatto** — quante linee indipendenti la registrano, e se è diventata una regola riusata (presenza
   della linea M = è finita in una skill scritta) o ha cambiato l'architettura del prodotto o il
   modello commerciale.
2. **Autonomia** — `ORIGINATA` e `CORRETTIVA` pesano più di `APPROVATA` e `DELEGATA`.
3. **Tracciabilità** — esiste in parole sue (H, peso 1)? è confermata da un fatto (J, peso 2)?

Un punteggio meccanico su questi tre assi ha prodotto la rosa; **la scelta finale è mia**, e in due
casi ho scavalcato il punteggio: ho escluso righe ad alto punteggio ma di impatto minimo (il corpo del
font dell'intestazione Prenota valeva 12 punti perché sta in due linee, ma non decide niente), e ho
incluso decisioni a punteggio più basso che hanno cambiato la forma del lavoro (lo split dei
repository, il ribaltamento del limite coperti).

### Metodo di lavoro e direzione degli agenti — 14

| # | Decisione | Data | Fonti | Perché è qui |
|---|-----------|------|-------|--------------|
| 1 | **Controtest = cercare cosa rompe, non confermare il verde** | 07-06-26 | A5-D29 + M1-D46 + H3-D26 + M3-D13 | 4 righe su 3 linee, l'unica fusione a 4 con una fonte di peso 1. È diventata la regola di chiusura d'area nella Testing-Skill |
| 2 | **L'allineamento delle skill è implicito: non si chiede** | 03-06-26 | A4-D26 + H3-D18 + M1-D49 | Elimina una domanda ricorrente dell'agente. Codificata nelle regole base |
| 3 | **Un solo report unificato per l'intero ciclo multi-agente** | 29-05-26 | A2-D48 + H2-D34 + M1-D34 | Cambia il formato di consegna di ogni sessione successiva |
| 4 | **Mockup HTML multi-stato prima di scrivere codice** | 29-05-26 | A2-D52 + H2-D38 + M1-D32 | Sposta la verifica prima dell'implementazione: è il seme del profilo Verifica |
| 5 | **«lavoro ok» ≠ «fai report finale»: il report si separa dal commit** | 01-06-26 | A3-D40 + M1-D09 · A3-D41 + M1-D08 | Due comandi del vocabolario, entrambi `CORRETTIVA`: ha corretto l'interpretazione degli agenti |
| 6 | **«prepara» = solo il prompt, nessun codice eseguito** | 29-05-26 | A2-D41 + M1-D10 | Separa la regia dall'esecuzione. È il comando che rende misurabile la sua direzione |
| 7 | **Modalità light / standard / deep** | 29-05-26 | A2-D34 + M1-D33 | Dosa il costo di ogni sessione: governo delle risorse, non solo del contenuto |
| 8 | **L'hook di fine chat rilancia anche se il report si dichiara completo** | 03-06-26 | A4-D28 + M1-D40 | Non si fida dell'auto-dichiarazione dell'agente: controllo automatizzato |
| 9 | **Controverifica: da pratica di febbraio a profilo «Verifica»** | 24-02-26 → 04-06-26 | H4-D06 · M1-D45 · A4-D42/D44/D45 · A5-D34 + H5-D14 | L'unica skill con una prova di peso 1 **quattro mesi prima** di essere codificata |
| 10 | **Gate di disambiguazione Prenota vs Menu QR** | 31-05-26 | A3-D25 + M1-D28 (cluster T06, 8 righe) | Errore ripetuto da ≥3 agenti → trasformato in regola. È il ciclo errore-diagnosi-regola completo |
| 11 | **Skill «linguaggio utente»: parlare per schermate, non per file** | 15-05-26 | A1-D41 + H1-D57 | H1 la data al 15-05, **prima** del report che la registra: l'origine è verificabilmente sua |
| 12 | **Mandato «educare Matteo» + «Lezione della chat»** | 04-06-26 | A4-D32 + M1-D39 | Chiede agli agenti di insegnargli, non solo di risolvere. ⚠️ autonomia in conflitto (N-3) |
| 13 | **Un WP per sessione, mai due** | 12-06-26 | M4-D45 + G1-D39 · A7-D01 + I1-D20 | Freno allo scope creep applicato a sé stesso: il masterplan nasce e non esegue nulla |
| 14 | **«annota / suggerisci» non significa riformare lo skill system** | 30-05-26 | A3-D06 + M1-D50 | Distingue l'appunto dalla codifica. Nato da un rifiuto (indice §6, R8) |

### Sicurezza degli ambienti e rilascio — 5

| # | Decisione | Data | Fonti | Perché è qui |
|---|-----------|------|-------|--------------|
| 15 | **Prima di scrivere: verifica l'ambiente; se è PROD, fermati** | 22-05-26 → oggi | M3-D48 + M1-D15 + G1-D27 + M2-D09, origine in H2-D05 | La regola più ripetuta del corpus: scritta in **4 file di skill diversi**, con la frase originale nelle sue parole («Se risponde rwuxgvld fermati») |
| 16 | **Le migrazioni del capitolo Servizio restano su TEST fino al rollout** | 24-06 → 05-08-26 | M3-D47 + J1-D08 + I1-D01 | Confermata da un **fatto git** (peso 2): 063–071 non sono mai arrivate in PROD |
| 17 | **Blindato su TEST non significa rilasciato in PROD** | 06-08-26 | A11-D38 + J1-D09 | Verdetto esplicito, confermato dai fatti. Chiude il capitolo Servizio senza dichiararlo rilasciato |
| 18 | **Niente merge su `main` finché non l'ha revisionato lui** | 23-05-26 | A1-D24 + H2-D19 | H2 alza la riga da `INCERTO` a `MATTEO`: il gate umano è suo, non dell'agente |
| 19 | **La Console non entra nella repo pubblica** | 22/23-06-26 | A10-D55 + J1-D10 | Decisione di perimetro confermata dal branch che esiste ancora: separa il prodotto venduto dallo strumento interno |

### Prodotto e flusso d'uso — 7

| # | Decisione | Data | Fonti | Perché è qui |
|---|-----------|------|-------|--------------|
| 20 | **XOR: per ogni modalità o solo card o solo carosello, mai entrambi** | 26-05-26 | A1-D78 + H2-D25 + M4-D34 | Tre linee concordi con una fonte di peso 1. Regola di presentazione che vale ancora |
| 21 | **Limite coperti: doppio limite morbido (11-06) → rimozione del giornaliero (18-06)** | 11-06 → 18-06 → 02-08 | cluster T01, 10 righe | **La correzione più grande che ha fatto su sé stesso.** Sette giorni per ribaltare un modello suo |
| 22 | **Limiti duri di magazzino: 7 categorie / 12 prodotti / 6 preset / 6 QR** | 11-06-26 | A6-D01 + M3-D21 | Numeri decisi da lui, con la clausola «solo sui nuovi inserimenti, non rompere chi ha già sforato» |
| 23 | **Capienza e orario passato avvisano, non bloccano chi lavora in sala** | 06-06-26 | A5-D26 + M3-D08 | Principio di prodotto ricorrente (cluster T13): il vincolo non deve fermare il ristoratore |
| 24 | **Walk-in: sala e tavolo sono obbligatori** | 02-08-26 | A11-D04 + M3-D38 | `CORRETTIVA`: ritira la sua stessa ipotesi «solo coperti». Decisione di riapertura del progetto |
| 25 | **Le tipologie sono capacità, non nomi scritti nel codice** | 05-06-26 | A4-D50 + I1-D24 | Decisione di modello dati con conseguenze su multi-tenant e vendita |
| 26 | **Database pulito su test e prod: niente copia dei dati legacy** | 23-05-26 | A1-D10 + H2-D10 | H2 alza A1 da `INCERTO` a `MATTEO/CORRETTIVA`: applicata la regola §1 del piano |

### Vendita, legale, compliance — 4

| # | Decisione | Data | Fonti | Perché è qui |
|---|-----------|------|-------|--------------|
| 27 | **Modello commerciale ibrido: edition di base + `tenant_features` per tenant** | 24-05-26 | A1-D34 + M1-D74 · M2-D01 + M4-D23 | Struttura di vendita e struttura dati insieme. Regge da maggio a oggi ed è la base di ogni add-on |
| 28 | **Zero commissioni a coperto, canone fisso** | 12-06-26 | A7-D14 + G1-D33 + M4-D20 | Posizionamento contro il modello dominante del settore. Tre linee, incluso il privato |
| 29 | **Listino del 12-06 e la sua revisione nello stesso giorno** | 12-06-26 | A7-D06 + H3-D34 → A7-D41 + M4-D19 + M4-D18 | Ha fissato i prezzi e li ha rivisti dopo una revisione senior in giornata: Pro 79→69, fondatori 3→6 mesi |
| 30 | **Produzione in Irlanda (UE) + DPA Supabase firmato** | 12-06 · 23-05-26 | A7-D23 + M4-D11 · G1-D35 + G1-D49 + M4-D16 | Due decisioni di compliance **eseguite**, non solo pianificate: la region è scelta, il DPA è firmato e archiviato |

---

## §6 — Indice separato: i rifiuti di Matteo

**Non sono decisioni e non entrano nel catalogo** (schema diverso: `# | Cosa | Data | Fonte`). Ma
l'input avverte che «i rifiuti pesano doppio»: un no è più informativo di un sì, perché espone il
criterio. **44 righe in 4 report.**

| Report | N | Di cosa parlano | Le tre più significative |
|--------|---|-----------------|--------------------------|
| **M1** | 18 | rifiuti **di metodo**: voci di vocabolario, promozioni di regola, comportamenti degli agenti | R8 «agenti che codificano su *annota/suggerisci*» (→ decisione #14 delle Top 30) · R10 «riscrivere il report dopo *test fatti tutto ok*» · R14 «delta copy oltre mandato: *non ti ho detto di cambiarlo*» |
| **B1** | 12 | rifiuti **di scope** su BHM-Zen (06-07/08-07) | R1 presence/«chi è online» fuori dalla beta · R2 ~2.700 righe di realtime legacy buttate · R12 IA runtime, geo, pagamenti, multi-sede fuori beta |
| **A3** | 10 | rifiuti **di interfaccia** su Menu QR e Prenota (30-05/01-06) | R4 «fix #8 su Menu QR: target sbagliato» (→ cluster T06) · R7 toast su rename, sostituito da modale · R10 «dedurre il profilo se il comando è sconosciuto» |
| **B3** | 4 | rifiuti **di interfaccia** su HACCP (gen-feb 26) | R1 pannello anomalie in Stato Corrente · R2 suffisso ripetuto «contatta assistenza tecnica» · R4 filtri «Per Stato» nel calendario |

**Lettura:** i rifiuti di M1 e A3 sono quasi tutti *correttivi su agenti* (l'agente ha fatto più di
quanto chiesto), quelli di B1 e B3 sono *tagli di scope* su prodotto. Sono due skill diverse e vanno
tenute distinte in S3. **Nessuna delle 44 righe è stata contata tra le 1.826.**

---

## §7 — Catalogo completo deduplicato — 1.703 righe

Ordinato per **peso probatorio decrescente**: prima le sue parole (H), poi i fatti (J), poi le skill
scritte (M), poi le sessioni (A), il privato (G), i piani (I) e gli archivi (B–F).

**Come si legge una riga.** La prima colonna contiene **tutti** gli ID d'origine: dove ce n'è più di
uno, quella riga è una fusione e ogni ID è ancora ritrovabile nel suo report. Gli ID non sono mai stati
rinumerati: `A4-D07` è rimasto `A4-D07`.

**La colonna `Citazione` non è riportata qui** ed è una scelta dichiarata: le citazioni verbatim sono
2.802 e triplicherebbero il peso del file, che è già il più grande del cantiere. Restano **integralmente
recuperabili**: ogni ID punta alla riga del report d'origine, che la contiene. Il catalogo completo di
citazioni, in formato tabellare, è nell'intermedio `docs/_lavoro/Indagine-Corpus/S1/decisioni_normalizzate.tsv`.

**A chi legge dopo (S2–S6):** questo capitolo si consulta per ID, per `Tipo` o per linea. Non serve
leggerlo per intero — la sostanza è nei §2, §3, §4 e §5.

### H — parole di Matteo nei transcript (peso 1) — 259 righe

| ID (tutte le fonti fuse) | Data | Tipo | Oggetto | Chi | Autonomia | Skill | Fonte |
|---|---|---|---|---|---|---|---|
| H1-D01 | 27-04-26 | PROCESSO | Setup progetto da Guida.md, split compiti | MATTEO | ORIGINATA | project-bootstrap | `6275af72…e9ba` seq=1–2 |
| H1-D02 | 27-04-26 | AI-METODO | Linguaggio semplice: no competenze tecniche | MATTEO | ORIGINATA | user-language | stesso seq=4 |
| H1-D03 | 27-04-26 | UI-UX | UI bianca troppo fredda → moderna colori/tab | MATTEO | ORIGINATA | visual-direction | stesso seq=13 |
| D2-D23 + H1-D04 | 27-04-26 | UI-UX | Spunto Dribbble Restaurant Admin Dashboard | MATTEO | SCELTA | visual-reference | stesso seq=16 |
| H1-D05 | 04-05-26 | SICUREZZA | MCP Supabase puntato a progetto remoto | MATTEO | ORIGINATA | env-wiring | `577624c4…c185` seq=1 |
| H1-D06 | 04-05-26 | PROCESSO | Un solo branch main allineato al plan | MATTEO | ORIGINATA | branch-hygiene | stesso seq=8 |
| H1-D07 | 04-05-26 | TESTING | Eseguire TEST_PLAN post-RLS dopo report | MATTEO | ORIGINATA | test-strategy | `d04a81f5…5532` seq=1 |
| H1-D08 | 04-05-26 | TESTING | Collaudo cross-tenant: vede solo tenant B | MATTEO | ORIGINATA | multi-tenant-qa | stesso seq=13 |
| H1-D09 | 04-05-26 | AI-METODO | Checklist: «annullare» ≠ eliminare dal calendario | MATTEO | CORRETTIVA | vocabulary-precision | stesso seq=18 |
| H1-D10 | 04-05-26 | IMPOSTAZIONI | Plan Impostazioni ristorante: domande prima | MATTEO | ORIGINATA | plan-steering | `607a9e94…4ab4` seq=1 |
| H1-D11 | 04-05-26 | IMPOSTAZIONI | Eseguire plan impostazioni dopo Q&A | MATTEO | APPROVATA | plan-execution | stesso seq=4 |
| H1-D12 | 04-05-26 | PRODOTTO | Esiste pagina Prenota? (scoperta prodotto) | MATTEO | ORIGINATA | product-discovery | `afea1729…254e` seq=1 |
| H1-D13 | 05-05-26 | VENDITA | Plan PWA + gating licenza SaaS | MATTEO | APPROVATA | saas-gating | `f50fa5d5…4707` seq=1+3 |
| H1-D14 | 05-05-26 | VENDITA | Tenant esistenti → `active` | MATTEO | ORIGINATA | tenant-activation | stesso seq=4 |
| H1-D15 | 05-05-26 | FLUSSO | Calendario sempre visibile anche vuoto | MATTEO | ORIGINATA | calendar-empty-state | stesso seq=14 |
| H1-D16 | 05-05-26 | FLUSSO | Blocco prenotazioni senza orario | MATTEO | ORIGINATA | booking-validation | stesso seq=14 |
| H1-D17 | 05-05-26 | PRODOTTO | Tab Menu ingredienti: domande pre-plan | MATTEO | ORIGINATA | plan-steering | `84277a48…a12aef` seq=1 |
| H1-D18 | 05-05-26 | PRODOTTO | Commit di partenza + esegui plan Menu | MATTEO | APPROVATA | safe-start | stesso seq=3 |
| H1-D19 | 05-05-26 | FLUSSO | Sezione card solo del giorno selezionato | MATTEO | ORIGINATA | day-digest | `ad1077f9…8e42` seq=1 |
| H1-D20 | 05-05-26 | FLUSSO | Ordine card per orario inizio | MATTEO | ORIGINATA | day-digest | stesso seq=2 |
| H1-D21 | 05-05-26 | PRODOTTO | Due zone: tipi di prenotazione distinti | MATTEO | ORIGINATA | booking-type-split | stesso seq=8 |
| H1-D22 | 05-05-26 | PRODOTTO | Prezzo/persona e totale su card menù | MATTEO | ORIGINATA | pricing-visibility | stesso seq=10 |
| H1-D23 | 06-05-26 | FLUSSO | Card prenotazioni in colonne per fascia | MATTEO | ORIGINATA | time-slot-digest | `97e72333…956a` seq=1 |
| H1-D24 | 06-05-26 | FLUSSO | Solo orario inizio decide la fascia | MATTEO | ORIGINATA | time-slot-rules | stesso seq=1 |
| H1-D25 | 06-05-26 | UI-UX | Colori fascia: verde/arancio/azzurro | MATTEO | ORIGINATA | time-slot-visual | stesso seq=1 |
| H1-D26 | 06-05-26 | UI-UX | Sticky header desktop; mobile come prima | MATTEO | CORRETTIVA | responsive-split | stesso seq=5 |
| H1-D27 | 06-05-26 | IMPOSTAZIONI | Sezione «Imposta Fasce Orarie» + no overlap | MATTEO | ORIGINATA | settings-validation | stesso seq=15 |
| H1-D28 | 06-05-26 | IMPOSTAZIONI | Selettore orario 24H, non AM/PM | MATTEO | ORIGINATA | time-format | stesso seq=16 |
| H1-D29 | 06-05-26 | FLUSSO | Fasce che attraversano mezzanotte | MATTEO | CORRETTIVA | overnight-slots | stesso seq=20 |
| H1-D30 | 06-05-26 | PRODOTTO | Nuova azienda: solo categorie, menu vuoto | MATTEO | ORIGINATA | tenant-defaults | `1abde109…1e51` seq=1 |
| H1-D31 | 06-05-26 | UI-UX | Bottone Aggiungi sempre visibile | MATTEO | CORRETTIVA | empty-state-ux | stesso seq=3 |
| H1-D32 | 06-05-26 | PRODOTTO | Sfondo Prenota selezionabile da admin | MATTEO | ORIGINATA | prenota-background | `0b8acc2b…8147` seq=63 |
| H1-D33 | 06-05-26 | PRODOTTO | Preset Immagini vs Gradienti | MATTEO | ORIGINATA | prenota-background | `c740deea…ec41` seq=1 |
| H1-D34 | 06-05-26 | FLUSSO | Orari Prenota da Impostazioni admin | MATTEO | ORIGINATA | public-hours-sync | `68d094f2…8f87` seq=7 |
| H1-D35 | 06-05-26 | UI-UX | Nome ristorante MAIUSCOLO: wrap ogni 13 | MATTEO | ORIGINATA | edge-case-ux | `6db37aea…c569` seq=52 |
| H1-D36 | 07-05-26 | PRODOTTO | Default categorie su nuovo slug | MATTEO | ORIGINATA | tenant-defaults | `e075240f…decb` seq=1 |
| H1-D37 | 07-05-26 | SICUREZZA | Domanda: delete user = wipe tenant? | MATTEO | ORIGINATA | data-lifecycle | stesso seq=2 |
| H1-D38 | 07-05-26 | IMPOSTAZIONI | Campi nuova azienda vuoti, no default | MATTEO | ORIGINATA | clean-onboarding | `637582e7…d92f` seq=1 |
| H1-D39 | 07-05-26 | PROCESSO | Consegna a programmatore esterno (plan) | MATTEO | APPROVATA | external-handoff | `8bcee491…d007` seq=2 |
| H1-D40 | 07-05-26 | UI-UX | Paginazione texture + frecce | MATTEO | ORIGINATA | texture-pagination | `637582e7…d92f` seq=6 |
| H1-D41 | 08-05-26 | AI-METODO | Report alfabeto UI per altri agenti | MATTEO | ORIGINATA | design-handoff | `34daa915…20fe7` seq=1 |
| H1-D42 | 09-05-26 | IMPOSTAZIONI | Sezione «Seleziona tema app» + slot | MATTEO | ORIGINATA | theme-picker | `43b441a0…ce4c9` seq=1 |
| H1-D43 | 09-05-26 | AI-METODO | Skill temi da screen (per altri agenti) | MATTEO | ORIGINATA | skill-authoring | `aa73a875…0129` seq=7 |
| H1-D44 | 09-05-26 | UI-UX | Occhio su anteprima tema: click vs select | MATTEO | ORIGINATA | theme-preview-ux | `ecd10394…1d50` seq=8 |
| H1-D45 | 10-05-26 | PRODOTTO | Email conferma prenotazione | MATTEO | ORIGINATA | transactional-email | `29ad14a8…af8b` seq=2 |
| H1-D46 | 10-05-26 | PRODOTTO | Provider email = Brevo, non Supabase | MATTEO | CORRETTIVA | email-provider | stesso seq=3 |
| H1-D47 | 12-05-26 | PRODOTTO | Plan Sidebar + CRM Clienti (domande prima) | MATTEO | APPROVATA | admin-shell | `164890af…afbe` seq=1 |
| H1-D48 | 12-05-26 | PRODOTTO | Delete clienti in CRM (app+DB) | MATTEO | ORIGINATA | crm-crud | stesso seq=5 |
| H1-D49 | 12-05-26 | AI-METODO | Debug agente Analytics: report prima di fix | MATTEO | ORIGINATA | agent-review | `99e713d3…487b` seq=2 |
| H1-D50 | 13-05-26 | AI-METODO | Handoff tavoli/sale: solo prompt, no exec | MATTEO | ORIGINATA | prompt-orchestration | `bbb03e4b…0446` seq=2 |
| H1-D51 | 14-05-26 | FLUSSO | Home senza sottotab degli altri nav | MATTEO | ORIGINATA | admin-nav-ux | `695b7eaa…e95e` seq=2 |
| H1-D52 | 14-05-26 | AI-METODO | Feedback: chat usata per migliorare skill | MATTEO | ORIGINATA | skill-evolution | stesso seq=17 |
| H1-D53 | 14-05-26 | FLUSSO | Alert orario passato all’accettazione | MATTEO | ORIGINATA | past-time-guard | `0095dbe6…099a9d` seq=1 |
| H1-D54 | 14-05-26 | FLUSSO | Stesso alert anche da form admin | MATTEO | ORIGINATA | past-time-guard | `62058864…56a0` seq=3 |
| H1-D55 + I1-D22 | 15-05-26 | VENDITA | Pro: nascondere fasce in Impostazioni | MATTEO | ORIGINATA | edition-gating | `19eec9c5…4951` seq=1 |
| H1-D56 | 15-05-26 | FLUSSO | ServiceSlots = stesse regole di booking slots | MATTEO | ORIGINATA | slots-unification | stesso seq=3 |
| A1-D41 + H1-D57 | 15-05-26 | AI-METODO | Skill linguaggio utente (leggera) | MATTEO | ORIGINATA | user-language | stesso seq=3 |
| H1-D58 | 15-05-26 | IMPOSTAZIONI | Fasce notturne anche in RestaurantSettings | MATTEO | ORIGINATA | overnight-slots | stesso seq=5 |
| H2-D01 | 16-05-26 | IMPOSTAZIONI | «Per sempre» = modifica base fascia, non limite | MATTEO | ORIGINATA | fasce-orarie | `715b70d0…` seq=2 |
| H2-D02 | 16-05-26 | FLUSSO | Servizio chiuso = 0 turni, card fascia opaca | MATTEO | ORIGINATA | servizio-chiuso | stesso seq=3 |
| H2-D03 | 16-05-26 | UI-UX | Rimuovere copy «Per chiudere il servizio usa ✕» | MATTEO | CORRETTIVA | copy-delta-only | stesso seq=4 |
| H2-D04 | 16-05-26 | UI-UX | Label «limiti impostati» non «limiti attivi» | MATTEO | SCELTA | copy-product | `28f7b405…` seq=4 |
| H2-D05 | 22-05-26 | SICUREZZA | Allineare TEST a PROD migrazioni 019–025 | MATTEO | ORIGINATA | env-safety | `6efb4505…` seq=1 |
| H2-D06 | 22-05-26 | TESTING | Seed prenotazione 22-05 20:30 deve rifiutare | MATTEO | ORIGINATA | capacity-qa | `2cea1a5a…` seq=4 |
| H2-D07 | 22-05-26 | SICUREZZA | Query utenti/slug/edition: lui esegue su PROD | MATTEO | ORIGINATA | owner-ops | `671331a1…` seq=1 |
| H2-D08 | 23-05-26 | PRODOTTO | Tenere promo testuali; togliere omaggio automatico | MATTEO | ORIGINATA | product-scoping | `a048ae51…` seq=2 |
| A1-D12 + H2-D09 | 23-05-26 | PRODOTTO | La Ritrovo fuori scope; zero seed legacy | MATTEO | SCELTA | multi-tenant-generic | stesso seq=3 |
| A1-D10 + H2-D10 | 23-05-26 | FLUSSO | DB pulito test+prod; niente COPY legacy | MATTEO | CORRETTIVA | data-migration | stesso seq=6–7 |
| H2-D11 | 23-05-26 | PRODOTTO | Chiavi `booking_menu_promos` (rinomina vol-au-vent) | MATTEO | APPROVATA | settings-model | `6cf9fa85…` seq=2 |
| H2-D12 | 23-05-26 | PROCESSO | Merge main→sidebar; lavoro sul branch sidebar | MATTEO | ORIGINATA | branch-choice | `96933c24…` seq=8 |
| H2-D13 | 23-05-26 | VENDITA | Walk-in/limite walk-in non in Classic | MATTEO | ORIGINATA | edition-gating | stesso seq=4 |
| H2-D14 | 23-05-26 | PRODOTTO | Menu preselezionato per tipologia (no tavolo) | MATTEO | ORIGINATA | booking-types | stesso seq=35–36 |
| H2-D15 | 23-05-26 | UI-UX | Alert prima di cancellare categoria con ingredienti | MATTEO | ORIGINATA | delete-guard | stesso seq=24 |
| H2-D16 | 23-05-26 | UI-UX | Preferiva 2 colonne: annulla layout agente | MATTEO | CORRETTIVA | modal-layout | `b7efbabf…` seq=8 |
| H2-D17 | 23-05-26 | UI-UX | Annulla allineamento testo orizzontale modal | MATTEO | CORRETTIVA | modal-layout | stesso seq=9 |
| H2-D18 | 23-05-26 | UI-UX | Allineamento label: solo orizzontale, non verticale | MATTEO | CORRETTIVA | modal-layout | `251d1421…` seq=7 |
| A1-D24 + H2-D19 | 23-05-26 | PROCESSO | Revisione promo: no merge main finché non revisionato | MATTEO | ORIGINATA | release-gate | `a048ae51…` seq=14 |
| A1-D28 + H2-D20 + I1-D23 | 23-05-26 | VENDITA | Posizionamento prenotazione solo Pro | MATTEO | APPROVATA | edition-gating | `251d1421…` seq=2 |
| A1-D42 + H2-D21 | 25-05-26 | UI-UX | Pill QR = navigazione, non filtro | MATTEO | ORIGINATA | menu-qr-nav | `29430119…` seq=2 |
| H2-D22 | 25-05-26 | UI-UX | Label campi fuori casella (inset→titolo esterno) | MATTEO | ORIGINATA | form-fields-ux | `40a6d84f…` seq=1 |
| H2-D23 | 25-05-26 | PRODOTTO | Intolleranze = solo testo libero | MATTEO | ORIGINATA | booking-form | stesso seq=6 |
| H2-D24 | 25-05-26 | FLUSSO | Menu personalizzabile: tutto off, sceglie il cliente | MATTEO | ORIGINATA | compose-menu | stesso seq=12 |
| A1-D78 + H2-D25 + M4-D34 | 26-05-26 | PRODOTTO | XOR: per modalità solo card **o** solo carosello | MATTEO | ORIGINATA | xor-presentation | `559ae077…`/`87c698b5…` seq=17/4 |
| H2-D26 | 26-05-26 | AI-METODO | Chiede se dato agente = fatto o problema | MATTEO | ORIGINATA | critical-reading | `559ae077…` seq=20 |
| H2-D27 | 28-05-26 | AI-METODO | Analisi decisioni sue vs autonomia agenti | MATTEO | ORIGINATA | meta-reflection | `868ffb7b…` seq=1–2 |
| H2-D28 | 28-05-26 | AI-METODO | Annulla modifiche skill; 1 file solo per plan | MATTEO | CORRETTIVA | skill-hygiene | stesso seq=5 |
| H2-D29 | 28-05-26 | AI-METODO | File = analisi/dati, no istruzioni operative | MATTEO | CORRETTIVA | skill-hygiene | stesso seq=6 |
| H2-D30 | 29-05-26 | PRODOTTO | Promo → Personalizza form; N promo / 1 per target | MATTEO | ORIGINATA | promo-placement | `a3903826…` seq=1 |
| H2-D31 | 29-05-26 | PROCESSO | Nascita FOLLOW_UP come file skill snello | MATTEO | ORIGINATA | follow-up-system | stesso seq=3 |
| A2-D45 + H2-D32 | 29-05-26 | UI-UX | Multi-select promo 0/1/2/tutti (non «a scelta tra») | MATTEO | CORRETTIVA | promo-multi-select | `861135a5…` seq=7 |
| A2-D46 + H2-D33 | 29-05-26 | UI-UX | Conflitto promo: modal sostituzione, non silenzio | MATTEO | ORIGINATA | modal-pattern | `a3903826…` seq=9 · `3b1d4a6e…` seq=2 |
| A2-D48 + H2-D34 + M1-D34 | 29-05-26 | PROCESSO | Report unificato prepara+esecutore+revisione | MATTEO | ORIGINATA | report-unificato | `a707a4ad…` seq=6 |
| H2-D35 | 29-05-26 | PROCESSO | Commit cita documenti da revisionare | MATTEO | ORIGINATA | release-hygiene | `a3903826…` seq=10 |
| H2-D36 | 29-05-26 | SICUREZZA | `dev`→TEST; `npm run dev:prod`→PROD | MATTEO | SCELTA | env-workflow | `9a420176…` seq=3–4 |
| A2-D51 + H2-D37 + M1-D78 | 29-05-26 | IMPOSTAZIONI | Autosave solo debug; prod = footer + alert pubblico | MATTEO | ORIGINATA | admin-save | `b59eebe2…` seq=5 |
| A2-D52 + H2-D38 + M1-D32 | 29-05-26 | AI-METODO | Mockup HTML multi-stato «quasi sempre» | MATTEO | APPROVATA | prepara-mockup | stesso seq=5 |
| H2-D39 | 29-05-26 | UI-UX | QA validazione Prenota: chiusura+lampeggio+telecamera | MATTEO | CORRETTIVA | form-validation-ux | `96d4eedb…` seq=3–4,6 |
| H2-D40 | 29-05-26 | UI-UX | Lampeggio errore: rosso→arancione | MATTEO | SCELTA | form-validation-ux | stesso seq=6 |
| H2-D41 | 30-05-26 | PRODOTTO | QR: fix strutturali prima; carosello/card dopo | MATTEO | SCELTA | product-scoping | `9b3c44ba…` seq=4 |
| H2-D42 | 30-05-26 | UI-UX | Post-salva QR: dialog «sostituisci stampa/link» | MATTEO | SCELTA | modal-pattern | stesso |
| H2-D43 | 30-05-26 | AI-METODO | Decisioni a opzioni A/B/C o Sì/No + raccomandata | MATTEO | ORIGINATA | decision-ux | stesso |
| A3-D11 + H2-D44 | 30-05-26 | UI-UX | Home QR = 1 sfondo; header solo pagina categoria | MATTEO | CORRETTIVA | menu-qr-homepage | `50d6e0de…` seq=11 |
| H2-D45 | 30-05-26 | AI-METODO | Non aggiungere al prompt cose non chieste | MATTEO | CORRETTIVA | prompt-discipline | stesso seq=4 |
| H2-D46 | 31-05-26 | TESTING | QA Matteo checklist 8 note Menu QR (KO 1/3b/6/8) | MATTEO | ORIGINATA | owner-qa | `cc28bf22…` seq=2 |
| H2-D47 | 31-05-26 | UI-UX | QR griglia 2 col 699–1025; tablet fino a desktop | MATTEO | SCELTA | responsive-qr | `4cedb88b…` seq=9–10 |
| H2-D48 | 31-05-26 | UI-UX | Sfondo Prenota: preferisce che scorra (revert fixed) | MATTEO | SCELTA | prenota-bg | `392a6ae1…` seq=7 |
| H2-D49 | 31-05-26 | AI-METODO | Scelte da fare all’inizio del prompt, non in fondo | MATTEO | ORIGINATA | prepara-prompt | `ae044051…` seq=3 |
| H2-D50 | 31-05-26 | AI-METODO | Agente esterno asset: solo genera, no repo/report | MATTEO | ORIGINATA | multi-agent-roles | stesso seq=9 |
| H2-D51 | 31-05-26 | PROCESSO | Push/merge per testare da tablet/mobile reale | MATTEO | ORIGINATA | release-for-qa | `cc28bf22…` seq=14 |
| H2-D52 | 31-05-26 | AI-METODO | Chiede perché agente si è confuso + consiglio | MATTEO | ORIGINATA | errori-processo | stesso seq=19 |
| A3-D62 + H3-D01 | 01-06-26 | UI-UX | Font + dimensione testo intestazione Prenota | MATTEO | ORIGINATA | prenota-typography | `0e0a44ee…` seq=1 |
| H3-D02 | 01-06-26 | UI-UX | Range font header 8–27, solo intestazione | MATTEO | SCELTA | prenota-typography | stesso seq=2 |
| A3-D52 + H3-D03 | 01-06-26 | PRODOTTO | Ordine card categorie QR con frecce ↑↓ | MATTEO | ORIGINATA | menu-qr-order | `2453c58b…` seq=1 |
| H3-D04 | 01-06-26 | PRODOTTO | Più icone categorie senza foto (preset cibo) | MATTEO | ORIGINATA | menu-qr-icons | `5f4ed509…` seq=1–2 |
| A3-D63 + H3-D05 | 01-06-26 | UI-UX | Foto categoria: **no** su mobile in sezione | MATTEO | CORRETTIVA | responsive-qr | `e1e12a45…` seq=3 |
| A3-D50 + H3-D06 | 01-06-26 | UI-UX | Conferma salvataggio = modale, non toast | MATTEO | CORRETTIVA | modal-pattern | `7797fa43…` seq=2 · `611687a8…` seq=10 |
| H3-D07 | 01-06-26 | PRODOTTO | Rename categoria → sync chiavi JSON QR (P0) | MATTEO | APPROVATA | qr-data-integrity | `611687a8…` seq=6–7 |
| H3-D08 | 01-06-26 | AI-METODO | Ritmo chiusura: lavoro ok + analisi prompt/skill | MATTEO | ORIGINATA | session-closure | `2be6a08a…` seq=2 (×N chat) |
| H3-D09 | 01-06-26 | AI-METODO | Checklist/tabella prepara: se light ok, altrimenti segnale | MATTEO | ORIGINATA | prepara-discipline | `5f4ed509…` seq=3 · `3c087fe1…` seq=6 |
| H3-D10 | 01-06-26 | UI-UX | Font vendibile: togli Thirsty; bold/underline | MATTEO | SCELTA | font-licensing | `0e0a44ee…` seq=9 |
| H3-D11 | 02-06-26 | UI-UX | Riepilogo desktop a destra solo >1600px | MATTEO | ORIGINATA | prenota-desktop-layout | `d722c0d3…` seq=11–12 |
| A4-D11 + H3-D12 | 02-06-26 | UI-UX | Solo layout full-page, non striscia laterale | MATTEO | SCELTA | prenota-bg | stesso seq=8 |
| H3-D13 | 02-06-26 | AI-METODO | Prepara deve ridare prompt **intero** dopo fix | MATTEO | ORIGINATA | prepara-discipline | stesso seq=13 |
| H3-D14 | 02-06-26 | AI-METODO | «sticky» → osservazioni, non VOCABOLARIO | MATTEO | CORRETTIVA | meta-hygiene | stesso seq=18–19 |
| H3-D15 | 02-06-26 | FLUSSO | Rimuovere sticky bar Invio; resta solo fondo | MATTEO | ORIGINATA | booking-cta | `8a58fe19…` seq=2 |
| H3-D16 | 03-06-26 | UI-UX | Card ingrediente: titolo / desc / checkbox+prezzo | MATTEO | CORRETTIVA | compose-card-layout | `a95fa018…` seq=6 |
| H3-D17 | 03-06-26 | FLUSSO | Prezzo tipologia fissa vs menu personalizzato | MATTEO | ORIGINATA | pricing-rules | `c9145fc9…` seq=4 |
| A4-D26 + H3-D18 + M1-D49 | 03-06-26 | AI-METODO | Allineamento skill = implicito, non domanda | MATTEO | ORIGINATA | skill-hygiene | `f3242f9f…` seq=5 |
| H3-D19 | 04-06-26 | TESTING | Wipe DB TEST: struttura sì, tenant no | MATTEO | ORIGINATA | test-db-reset | `7fb165df…` seq=1 |
| H3-D20 | 04-06-26 | AI-METODO | Senior su stato blindatura Prenota + file obsoleti | MATTEO | ORIGINATA | blindatura-orchestrate | `9b577880…` seq=3 |
| H3-D21 | 04-06-26 | AI-METODO | Controverifica rapida poi merge main | MATTEO | ORIGINATA | release-gate | stesso seq=8 |
| A4-D21 + H3-D22 | 04-06-26 | IMPOSTAZIONI | Limiti testo: admin vede contatore, cliente no | MATTEO | SCELTA | text-limits-ux | `74deccf8…` seq=4 |
| H3-D23 | 05-06-26 | PRODOTTO | Ordine categorie ingredienti in Prenota | MATTEO | ORIGINATA | prenota-category-order | `9a4cfc37…`/`dfb5191a…` seq=1–2 |
| H3-D24 | 05-06-26 | AI-METODO | Diagnosi hook stop vs fine-sessione | MATTEO | ORIGINATA | hook-meta | `2ebe6972…` seq=34 |
| H3-D25 | 07-06-26 | FLUSSO | Archivio reinserisci senza orario → chiedi orario | MATTEO | ORIGINATA | archive-reinsert | `97d98e87…` seq=1 |
| A5-D29 + M1-D46 + H3-D26 + M3-D13 | 07-06-26 | AI-METODO | Controtest = cercare cosa rompe, non confermare | MATTEO | APPROVATA | blindatura-controtest | `4bd112f9…` seq=1 · `928d28d5…` seq=3 |
| A5-D25 + H3-D27 | 07-06-26 | AI-METODO | Orchestrator deve parlare skill comunicazione | MATTEO | CORRETTIVA | user-language | `928d28d5…` seq=2 |
| H3-D28 | 10-06-26 | PROCESSO | Senior: plan milestone + debug + merge | MATTEO | ORIGINATA | senior-roadmap | `1c9ed7d3…` seq=1 |
| H3-D29 | 10-06-26 | AI-METODO | Esecutori non toccano plan/roadmap | MATTEO | ORIGINATA | role-separation | `233dbe70…` seq=2 |
| H3-D30 | 10-06-26 | COMPLIANCE | Pubblico: solo come funziona per utente | MATTEO | ORIGINATA | public-docs-scope | `e8c5f606…` seq=3 |
| A6-D32 + H3-D31 | 11-06-26 | FLUSSO | No-show = dopo **inizio**, non fine | MATTEO | CORRETTIVA | no-show-rules | `de301098…` seq=2 |
| H3-D32 | 11-06-26 | FLUSSO | Dirty guard: salva/annulla prima di chiudere modale | MATTEO | ORIGINATA | dirty-guard | `ae3179ad…` seq=7 |
| H3-D33 | 11-06-26 | AI-METODO | No sigle minimali nei FU; parole intere | MATTEO | CORRETTIVA | user-language | stesso seq=14 |
| A7-D06 + H3-D34 | 12-06-26 | VENDITA | Prezzi: Pro 79 · Enterprise 129; +menu QR 16 | MATTEO | SCELTA | pricing | `6636909b…` seq=2 |
| A7-D09 + H3-D35 | 12-06-26 | VENDITA | Launch: −50% 3 mesi; setup fondatori; foto piatti | MATTEO | SCELTA | go-to-market | stesso seq=3 |
| H3-D36 | 12-06-26 | VENDITA | Logo: GPT + testo PrenotaZen | MATTEO | SCELTA | branding | stesso seq=7 |
| H3-D37 | 12-06-26 | PRODOTTO | Form non configurato: mostra form, non fake | MATTEO | SCELTA | empty-config | `e27280c6…` seq=3–4 |
| H3-D38 | 12-06-26 | PROCESSO | Merge PrenotaZen produzione dopo smoke | MATTEO | APPROVATA | release-prod | `76d9d6a4…` seq=3–4 |
| A6-D13 + H3-D39 | 12-06-26 | TESTING | Annota debito: E2E browser per ogni area blindata | MATTEO | ORIGINATA | e2e-debt | `dda8a00f…` seq=9 |
| H3-D40 | 13-06-26 | PROCESSO | Split lavoro: autonomia agenti vs decisioni sue | MATTEO | ORIGINATA | work-triage | `a0bfdf2a…` seq=2 |
| H3-D41 | 15-06-26 | PRODOTTO | Nomi tipologia: no hardcode, nomi reali | MATTEO | ORIGINATA | no-hardcode | `34284cd5…` seq=1 |
| H3-D42 | 15-06-26 | PRODOTTO | Eliminare gradienti; fallback crema solo se serve | MATTEO | SCELTA | prenota-bg | `b440228a…` seq=2 |
| A8-D28 + H3-D43 | 15-06-26 | PRODOTTO | Rimuovere «finestra prenotazione» (fuori scope) | MATTEO | CORRETTIVA | product-scoping | `f5aefd35…` seq=4 |
| H3-D44 | 15-06-26 | PRODOTTO | Email: solo accetta/rifiuta; no cancellazione | MATTEO | ORIGINATA | transactional-email | `aa43a3e5…` seq=2 · `4e9762c4…` seq=4 |
| H3-D45 | 15-06-26 | PRODOTTO | Email rifiuto: no riepilogo; conferma: completo | MATTEO | ORIGINATA | email-content | `fcdc95c5…` seq=3 |
| H3-D46 | 15-06-26 | VENDITA | Nome in email: FU paywall nome ristorante | MATTEO | ORIGINATA | email-branding-upsell | `aa43a3e5…` seq=11 |
| A8-D50 + H3-D47 | 16-06-26 | UI-UX | Errore card scorrevole deve sparire dopo fix | MATTEO | CORRETTIVA | form-validation-ux | `483e3a6f…` seq=2 |
| H3-D48 | 17-06-26 | UI-UX | Copy errore menu: «scegli almeno un piatto» | MATTEO | ORIGINATA | copy-product | `2a81c059…` seq=1 |
| H3-D49 | 17-06-26 | AI-METODO | Regola prezzo >0 mai richiesta → FU indagine | MATTEO | CORRETTIVA | product-audit | stesso seq=3 |
| H3-D50 | 18-06-26 | SICUREZZA | Rate limit form Prenota: 7 tentativi errati | MATTEO | ORIGINATA | abuse-limit | `d60772a5…` seq=1 |
| H3-D51 | 18-06-26 | VENDITA | Classic: no citare Servizio; sì fasce orarie | MATTEO | CORRETTIVA | edition-gating | `177e2ca1…` seq=3 |
| H3-D52 | 18-06-26 | AI-METODO | Fine prompt: checklist verifica senza sigle | MATTEO | ORIGINATA | prepara-discipline | stesso seq=1 |
| H3-D53 | 20-06-26 | FLUSSO | Nascondere clienti disiscritti all’admin | MATTEO | ORIGINATA | crm-privacy | `2c93c26c…` seq=1 |
| H3-D54 | 20-06-26 | UI-UX | Errori post-submit: pulse + camera + toast chiari | MATTEO | SCELTA | form-validation-ux | `1192a6bb…` seq=3 |
| H3-D55 | 20-06-26 | PROCESSO | A→M: scusa, prenotazione non andata; toast debole | MATTEO | CORRETTIVA | owner-qa | stesso seq=2 |
| H3-D56 | 02-08-26 | TESTING | Preparare ambiente E2E S4 + MCP corsie | MATTEO | ORIGINATA | e2e-orchestration | `73d311a0…` seq=1 |
| H3-D57 | 03-08-26 | PRODOTTO | Servizio: Aggiungi Sala; badge sala/tavolo | MATTEO | ORIGINATA | servizio-ux | `dd88ba93…` seq=1 |
| H3-D58 | 06-08-26 | FORMAZIONE | Indagine skill individuali su corpus intero | MATTEO | ORIGINATA | meta-reflection | `3ea63a1a…` seq=1 |
| H3-D59 | 06-08-26 | AI-METODO | Autorizza Archives + `_lavoro` + gitignored | MATTEO | ORIGINATA | corpus-scope | stesso seq=2–3 |
| H3-D60 | 06-08-26 | AI-METODO | File prompt in sequenza con spunte tracking | MATTEO | ORIGINATA | investigation-process | stesso seq=4 |
| H4-D01 | 21-02-26 | AI-METODO | Mappa elementi dashboard per skill Tailwind | MATTEO | ORIGINATA | ui-element-map | `8453e3a6…d84947` seq=1 |
| H4-D02 | 21-02-26 | AI-METODO | Secondo agente verifica output del primo | MATTEO | ORIGINATA | cross-agent-review | stesso seq=2 |
| H4-D03 | 21-02-26 | AI-METODO | Linguaggio non tecnico + scelte A/B/C | MATTEO | ORIGINATA | user-language | `28b44f7c…290751` seq=3 |
| H4-D04 | 21-02-26 | PROCESSO | Branch nuovo per test layout | MATTEO | ORIGINATA | branch-hygiene | stesso seq=2 |
| H4-D05 | 24-02-26 | SICUREZZA | Non rompere deploy Vercel su main | MATTEO | ORIGINATA | release-safety | `823bed36…783a8d` seq=1 |
| H4-D06 | 24-02-26 | AI-METODO | Controverifica con screen → file di skills | MATTEO | ORIGINATA | skill-authoring | stesso seq=6 |
| H4-D07 | 24-02-26 | TESTING | Chiede prova screen prima di accettare | MATTEO | CORRETTIVA | visual-qa | stesso seq=7 |
| H4-D08 | 28-02-26 | AI-METODO | Skill: una funzione in survivor_state, 1 riga in UI | MATTEO | ORIGINATA | modular-handoff | `2156d924…` seq=1 |
| H4-D09 | 28-02-26 | PROCESSO | Report sessione obbligatorio a fine task | MATTEO | ORIGINATA | session-report | `35786538…` seq=2 |
| H4-D10 + I2-D01 | 01-03-26 | PRODOTTO | Survivor = un solo file da passare a Tommaso | MATTEO | ORIGINATA | integration-scope | `1b406249…0bc979` seq=1 |
| H4-D11 | 01-03-26 | AI-METODO | Domande prima di riempire idee Survivor | MATTEO | ORIGINATA | plan-steering | stesso seq=2 |
| H4-D12 | 01-03-26 | PRODOTTO | Spec Survivor: power-up, shooters, boss wave 5 | MATTEO | ORIGINATA | game-design | stesso seq=3 |
| H4-D13 | 01-03-26 | AI-METODO | Cancella codice e rifai dopo update skill | MATTEO | CORRETTIVA | skill-enforcement | stesso seq=5 |
| H4-D14 | 01-03-26 | PRODOTTO | Tabella spawn wave 1–10+ (numeri/equazioni) | MATTEO | ORIGINATA | wave-balancing | stesso seq=8 |
| H4-D15 | 02-03-26 | PRODOTTO | Fine wave → 3 carte potenziamento (HP, mul, value) | MATTEO | ORIGINATA | card-meta | `aeb2d13f…0ee84e` seq=1 |
| H4-D16 | 02-03-26 | PRODOTTO | Dash: collisioni restano, no input, no muri | MATTEO | ORIGINATA | ability-constraints | `bee1e091…3b1338` seq=2 |
| H4-D17 | 02-03-26 | TESTING | Task «completato» solo dopo suo test | MATTEO | CORRETTIVA | owner-qa-gate | `69ff892e…66ed3c` seq=5 |
| H4-D18 | 02-03-26 | PRODOTTO | Scatto solo via card drop, non sempre on | MATTEO | ORIGINATA | progression-gating | `bee1e091…` seq=14 |
| H4-D19 | 02-03-26 | PRODOTTO | Card Famiglio: slime, mira numeri, ignora eq | MATTEO | ORIGINATA | companion-design | stesso seq=20 |
| H4-D20 | 02-03-26 | PRODOTTO | Preferisce classe BossEnemy a IF in state | MATTEO | CORRETTIVA | architecture-choice | `69ff892e…` seq=22 |
| H4-D21 | 02-03-26 | AI-METODO | Report: sezione «Codice scritto (per ispezione)» | MATTEO | ORIGINATA | report-inspectability | `39800c78…daaef` seq=7 |
| H4-D22 | 02-03-26 | PROCESSO | Annulla propria richiesta (kill out of bounds) | MATTEO | CORRETTIVA | self-correction | `c2705118…07019` seq=5 |
| H4-D23 | 03-03-26 | PRODOTTO | Boss shrink-on-hit + boss wave 10 + no «X» | MATTEO | ORIGINATA | boss-iteration | `6c9788ef…` seq=1 |
| H4-D24 | 03-03-26 | UI-UX | Copy card: «Se possiedi già : Cura Famiglio» | MATTEO | ORIGINATA | card-copy | stesso seq=31 |
| H4-D25 + I2-D25 | 05-03-26 | PRODOTTO | Scelta carte solo dopo wave 2 | MATTEO | ORIGINATA | progression-gating | `5ec86b9a…f8e881` seq=1 |
| H4-D26 + I2-D26 | 05-03-26 | PRODOTTO | Scudo/Famiglio off fino a wave 8 | MATTEO | ORIGINATA | progression-gating | `88b810bb…1d7028` seq=1 |
| H4-D27 | 05-03-26 | AI-METODO | Toccare solo file Survivor, non `enemy.py` | MATTEO | CORRETTIVA | modular-handoff | `5ec86b9a…` seq=8 |
| H4-D28 | 05-03-26 | PRODOTTO | Tabella spawn/difficoltà wave 1–30 (dettaglio) | MATTEO | ORIGINATA | wave-balancing | `eaf313d7…` seq=7 |
| H4-D29 | 05-03-26 | PRODOTTO | Boss: missile area + zona electric + danni %HP | MATTEO | ORIGINATA | boss-telegraph | stesso seq=3–4 |
| H4-D30 + I2-D10 | 05-03-26 | AI-METODO | Skill sprite-sheet: solo frame/ritaglio, non classe | MATTEO | ORIGINATA | skill-scoping | stesso seq=2 |
| H4-D31 | 03-03-26 | PRODOTTO | Mini rustici omaggio: soglia 17€ → 15€ | MATTEO | ORIGINATA | promo-threshold | `a290a3ff…723787` seq=1 |
| H4-D32 | 03-03-26 | FLUSSO | Prenota: solo «rinfresco di laurea», no tendina | MATTEO | ORIGINATA | booking-type-lock | stesso seq=6 |
| H4-D33 | 13-03-26 | PRODOTTO | Togliere coperto ovunque; +2€ caraffe | MATTEO | ORIGINATA | pricing-product | `c049f787…0a4b` seq=1 |
| H4-D34 | 13-03-26 | PRODOTTO | No surcharge costante: legge prezzo scheda | MATTEO | CORRETTIVA | data-driven-price | `00faf868…0369b8` seq=9 |
| H4-D35 | 13-03-26 | VENDITA | Multi-tenant: 10 aziende, 3600 prenotazioni/anno | MATTEO | ORIGINATA | saas-scoping | `86d6fcb0…f50020` seq=2 |
| H4-D36 | 13-03-26 | AI-METODO | Revisiona plan caraffe (modello in difficoltà) | MATTEO | ORIGINATA | plan-steering | `de244ff2…` seq=1 |
| H4-D37 | 18-03-26 | FLUSSO | Overbooking = avviso, mai blocco inserimento | MATTEO | ORIGINATA | soft-capacity | `8ddc880c…ff622a` seq=1 |
| H4-D38 | 19-03-26 | SICUREZZA | Clone DB test da prod; Al Ritrovo non perde dati | MATTEO | ORIGINATA | tenant-safety | `6b0707f1…6417e` seq=1 |
| H4-D39 | 22-03-26 | SICUREZZA | PROD: solo lettura; no commit senza ok | MATTEO | ORIGINATA | env-safety | `5a504080…9f5d6` seq=4 · `229bafb3…` seq=3 |
| H4-D40 | 22-03-26 | AI-METODO | «dammi prompt» per altro agente | MATTEO | ORIGINATA | prompt-orchestration | `5a504080…` seq=15 |
| H4-D41 | 30-03-26 | AI-METODO | Context agent da PDR + cartella skills | MATTEO | ORIGINATA | project-bootstrap | `5e549b63…4ac3a8` seq=4 |
| H4-D42 | 30-03-26 | PRODOTTO | Warrior spritesheet: idle/attacchi direzionali | MATTEO | ORIGINATA | sprite-pipeline | `9547b759…7ce02` seq=1 |
| H4-D43 | 30-03-26 | PRODOTTO | Skill Testuggine: charge visual senza nuovi asset | MATTEO | ORIGINATA | juice-on-budget | `6ffc7520…8b0fd6` seq=7 |
| H4-D44 | 30-03-26 | PRODOTTO | Skill E: carica 2,5s + HUD pressione | MATTEO | ORIGINATA | ability-ux | `62aa6ad4…7fef63` seq=17 |
| H4-D45 | 30-03-26 | AI-METODO | Skill anti-errore: effetti sotto al player | MATTEO | CORRETTIVA | skill-from-bug | stesso seq=18 |
| H4-D46 | 30-03-26 | PROCESSO | Unifica report in Knowledge; fix rule path | MATTEO | ORIGINATA | docs-hygiene | `5e549b63…` seq=20 |
| H4-D47 | 08-03-26 | ALTRO | Chat di prova modelli: «ciao» ×4 + richiesta YT | MATTEO | ORIGINATA | model-smoke-test | `prompts_Qwen-Test.jsonl` seq=1–2 |
| H5-D01 | 20-05-26 | PROCESSO | Push cartella su GitHub Trade-analyst-agent | MATTEO | ORIGINATA | multi-repo-bootstrap | `31c626ef` seq=1 |
| H5-D02 | 20-05-26 | SICUREZZA | MCP `supabase-TradeAgent` in mcp.json | MATTEO | ORIGINATA | env-wiring | stesso seq=3 |
| H5-D03 | 21-05-26 | AI-METODO | Esegui plan theme sotto SKILL-0 | MATTEO | APPROVATA | skill-binding | `a38c89ad` seq=1 |
| H5-D04 | 21-05-26 | SICUREZZA | Migration RLS `auth.uid()` → `(select auth.uid())` | MATTEO | ORIGINATA | rls-hardening | `db2ebf81` seq=1 |
| H5-D05 | 22-05-26 | TESTING | 1 modello per volta / meno chiamate inutili | MATTEO | ORIGINATA | cost-aware-testing | `dd8dfbf9` seq=10 |
| H5-D06 | 22-05-26 | AI-METODO | Procedura agente: scopri→testa→aggiorna risultati-modelli | MATTEO | ORIGINATA | ai-model-testing | stesso seq=11 |
| H5-D07 | 22-05-26 | COMPLIANCE | Vincoli OpenRouter: injection + PII block/redact | MATTEO | SCELTA | provider-guardrails | stesso seq=4 |
| H5-D08 | 06-06-26 | AI-METODO | Integrare ciclo sessione da template `_skill-system-v0` | MATTEO | ORIGINATA | method-export | `ecf16dc6` seq=1 |
| H5-D09 | 06-06-26 | AI-METODO | Skill operative in `/.cursor` e `/.claude` | MATTEO | ORIGINATA | dual-ide-skills | stesso seq=2 |
| H5-D10 | 06-06-26 | AI-METODO | All’avvio: Skill-0 + comunicazione sempre | MATTEO | ORIGINATA | always-on-skills | stesso seq=3 |
| H5-D11 | 06-06-26 | AI-METODO | «Ragioniamo» = Liv 1 (tabellina+checklist) | MATTEO | ORIGINATA | vocab-command | `c1eee221` seq=2 |
| H5-D12 | 06-06-26 | FORMAZIONE | Tenere ramo scolastico nel plan (non tagliare) | MATTEO | CORRETTIVA | didattica-owner | `6ca0bc85` seq=3 |
| H5-D13 | 06-06-26 | TESTING | Blindata solo dopo controtest sub-agent | MATTEO | CORRETTIVA | blindatura-gate | `0f0185db` seq=2 |
| A5-D34 + H5-D14 | 06-06-26 | AI-METODO | Controverifica login con sub-agent | MATTEO | ORIGINATA | controverifica | stesso seq=4 |
| H5-D15 | 06-06-26 | AI-METODO | Manca «prepara prompt» → se assente lo passa lui | MATTEO | ORIGINATA | prepara-port | `c1eee221` seq=4 |
| H5-D16 | 06-06-26 | TESTING | Priorità assoluta modelli FREE OpenRouter | MATTEO | ORIGINATA | free-first-models | `6e56eb71` seq=4 · `710e1dab` seq=3 |
| H5-D17 | 06-06-26 | AI-METODO | Docs esperti: cancella risolti, non «fixato X» | MATTEO | ORIGINATA | docs-hygiene | `7596f06c` seq=1 |
| H5-D18 | 06-06-26 | AI-METODO | Snellire skill → v.0 riadattabile ad altro sistema | MATTEO | ORIGINATA | method-portable | stesso seq=3 |
| H5-D19 | 06-06-26 | AI-METODO | Rimuovere template `_skill-system-v0` post-import | MATTEO | SCELTA | template-lifecycle | `ccb6f710` seq=1 |
| H5-D20 | 03-07-26 | VENDITA | Identità demo v.0 + legale + costi infra/manutenzione | MATTEO | ORIGINATA | go-to-market | `e0162167` seq=1 |
| H5-D21 | 03-07-26 | VENDITA | Prezzo floor >39€; curva costo/utente + AI | MATTEO | ORIGINATA | pricing-floor | stesso seq=3 |
| H5-D22 | 03-07-26 | PRODOTTO | Pin Home: max N per categoria + alert su swap | MATTEO | ORIGINATA | content-pinning | `7d55f6d6` seq=4 |
| H5-D23 | 03-07-26 | AI-METODO | Usa bussola skill + prepara prompt | MATTEO | APPROVATA | method-reuse | stesso seq=1 |
| H5-D24 | 03-07-26 | PROCESSO | A volte: report sì, skill system no | MATTEO | SCELTA | skill-hygiene | `6696d423` seq=2 |
| H5-D25 | 03-07-26 | PROCESSO | Altre volte: aggiorna skill + commit/push | MATTEO | SCELTA | skill-hygiene | `c4016fc9` seq=3 |
| H5-D26 | 04-07-26 | PRODOTTO | Branch console MINI (3 sezioni) per demo | MATTEO | ORIGINATA | demo-scoping | `4840dbee` seq=1 |
| H5-D27 | 04-07-26 | PROCESSO | Due branch: completo + parziale | MATTEO | ORIGINATA | release-branching | stesso seq=2 |
| H5-D28 | 04-07-26 | VENDITA | Piano B: skill+contesto a modello esterno se demo locale fallisce | MATTEO | ORIGINATA | demo-fallback | `0604396d` seq=1 |
| H5-D29 | 04-07-26 | PROCESSO | Diagnosi deploy Vercel analisi fallita | MATTEO | ORIGINATA | deploy-debug | `8954dea3` seq=1 |
| H5-D30 | 05-07-26 | PROCESSO | Catalogare TUTTO il materiale divulgativo (fase 1) | MATTEO | ORIGINATA | doc-inventory | `6cfb9a6c` seq=10 · `ed72208f` |
| H5-D31 | 05-07-26 | TESTING | Bug temperatura reale → handoff plan parallelo sola lettura | MATTEO | ORIGINATA | parallel-audit | `7e97f76d` seq=2 |
| H5-D32 | 05-07-26 | TESTING | Controverifica parallela 8 agenti A0–A7 | MATTEO | APPROVATA | parallel-audit | plan + `185e0c6f`… |
| H5-D33 | 05-07-26 | AI-METODO | File introduttivo per senior: doc vs codice reale | MATTEO | ORIGINATA | senior-brief | `f5e18ef1` seq=1 |
| H5-D34 | 06-07-26 | PROCESSO | Nuova repo BHM-Zen + stesso DB; CLI per Fable | MATTEO | ORIGINATA | repo-split | `70c4dcc9` seq=2 |
| H5-D35 | 06-07-26 | AI-METODO | Fable libero: co-owner, decide senza OK continuo | MATTEO | ORIGINATA | agent-autonomy-mandate | `ac8dbaa0` seq=3 |
| H5-D36 | 06-07-26 | AI-METODO | Verifica porte d’ingresso skill system Zen | MATTEO | ORIGINATA | skill-audit | `18babc92` seq=1 |
| B1-D33 + H5-D37 | 06-07-26 | PRODOTTO | Lessico: PDC, cascata, timbro, regtemp, prova haccp… | MATTEO | ORIGINATA | domain-lexicon | stesso seq=3 |
| H5-D38 | 06-07-26 | UI-UX | Niente HTML di default; solo su richiesta | MATTEO | CORRETTIVA | mockup-discipline | stesso seq=4 |
| H5-D39 | 06-07-26 | AI-METODO | Dopo Fable: senior blindatura doc+codice prima di divergere | MATTEO | ORIGINATA | freeze-baseline | stesso seq=5 |
| H5-D40 | 07-07-26 | PROCESSO | BHM-v2 = docs/legacy UI; Zen = rebuild | MATTEO | ORIGINATA | dual-track | `ac201b7b` seq=1 |
| H5-D41 | 09-07-26 | PROCESSO | Porte separate 3000/3010 per due repo aperte | MATTEO | ORIGINATA | multi-repo-ops | stesso seq=10 |
| H5-D42 | 09-07-26 | PRODOTTO | Onboarding Regia: telefono, ruoli vs categorie, PDC… | MATTEO | ORIGINATA | haccp-onboarding | `d813a018` seq=1 |

### J — fatti oggettivi: git, migrazioni, release (peso 2) — 15 righe

| ID (tutte le fonti fuse) | Data | Tipo | Oggetto | Chi | Autonomia | Skill | Fonte |
|---|---|---|---|---|---|---|---|
| J1-D01 | 27-04-26 | PROCESSO | Nasce repo CB-v2 (primo commit) | MATTEO | ORIGINATA | project-bootstrap | `git log --reverse` `0a0758b` |
| J1-D02 | 10-06-26 | VENDITA | Repo pubblica PrenotaZen (split da privata) | CONGIUNTA | SCELTA | release-public-split | PrenotaZen `238a17d` 10-06 |
| J1-D03 | ? | PROCESSO | Release pubblica **sempre da `main`** | CONGIUNTA | APPROVATA | release-gating | `scripts/sync-to-prenotazen.mjs` L1–20 |
| J1-D04 | ? | PROCESSO | Sync PrenotaZen: no commit/push automatici | CONGIUNTA | APPROVATA | release-gating | stesso script L22–28 |
| J1-D05 | 23-06-26 | PROCESSO | Ultimo merge `env/test` → `main` = S3 | CONGIUNTA | APPROVATA | release-freeze | `main` `22befb6` 23-06 |
| J1-D06 | 23-06-26 | VENDITA | Ultima release PrenotaZen = S3 (main@22befb6) | CONGIUNTA | APPROVATA | release-prod | PrenotaZen `f01bbae` |
| J1-D07 | 23-06-26 | SICUREZZA | PROD DB applicato fino a **062** (non oltre) | CONGIUNTA | SCELTA | env-safety | MCP PROD `list_migrations` (rwuxgvld…) |
| M3-D47 + J1-D08 + I1-D01 | 24-06→05-08 | SICUREZZA | S4 mig **063–071** solo su TEST / `env/test` | CONGIUNTA | SCELTA | env-safety | CLI TEST `migration list --linked`; `git ls-tree main` vs `env/test` |
| A11-D38 + J1-D09 | 06-08-26 | PROCESSO | Verdetto: blindato TEST ≠ rilasciato PROD | CONGIUNTA | SCELTA | release-gating | A11/report chiusura + git (0 commit agosto su `main`) |
| A10-D55 + J1-D10 | 22-06-26 | AI-METODO | Console su branch dedicato (non in `main` pubblico) | CONGIUNTA | SCELTA | product-isolation | branch `feature/console-super-admin`; A10 |
| J1-D11 | ? | PROCESSO | Nessun **git tag** di release su CB-v2 | INCERTO | DELEGATA | release-hygiene | `git tag -l` vuoto; `git ls-remote --tags` vuoto |
| J1-D12 | 22-06-26 | PROCESSO | Co-autoria git Cristiano (25 commit console) | CONGIUNTA | SCELTA | collab-git | `git shortlog -sn --all` |
| J1-D13 | mag→ago | AI-METODO | Prefisso `docs` = tipo commit più frequente | CONGIUNTA | DELEGATA | method-docs-first | `git log --all --format=%s` aggregato |
| J1-D14 | 04-05-26 | SICUREZZA | Doppio file `003_*` (falso positivo db push) | AGENTE | DELEGATA | migration-hygiene | `supabase/migrations/003_*` ×2; AGENTS.md |
| J1-D15 | lug-26 | PROCESSO | Zero commit luglio su questo repo | MATTEO | ORIGINATA | focus-shift | `git log --all --since=2026-07-01 --until=2026-08-01` → 0 |

### M — skill d'area, meta e comunicazione (peso 3–4) — 180 righe

| ID (tutte le fonti fuse) | Data | Tipo | Oggetto | Chi | Autonomia | Skill | Fonte |
|---|---|---|---|---|---|---|---|
| M1-D01 | ? | AI-METODO | Solo voci approvate da Matteo nel vocabolario | MATTEO | ORIGINATA | vocab-governance | `docs/Comunicazione-Skill/VOCABOLARIO.md` L3-5 |
| M1-D02 | ? | AI-METODO | Livelli libertà 1/2/3 per dosare autonomia | MATTEO | ORIGINATA | trust-levels | `VOCABOLARIO.md` L14-16 |
| M1-D03 | ? | AI-METODO | Default prudente: incerto → Liv.3 | AGENTE | SCELTA | trust-levels · IPOTESI | `VOCABOLARIO.md` L26 |
| M1-D04 | ? | AI-METODO | Promozione/regressione Liv.2 solo revisore | CONGIUNTA | APPROVATA | vocab-governance | `VOCABOLARIO.md` L37-38 |
| M1-D05 | 28-05-26 | AI-METODO | Profili Esecuzione / Verifica / Meta | MATTEO | APPROVATA | agent-routing | `ARCHIVIO_DECISIONI.md` L51; `VOCABOLARIO.md` L94+ |
| M1-D06 | 31-05-26 | AI-METODO | Meta senior solo con «senior» / «meta senior» | MATTEO | ORIGINATA | meta-routing | `VOCABOLARIO.md` (voce evolvi); `COMANDI_AVVIO.md` L24-28 |
| M1-D07 | 06-06-26 | AI-METODO | Importare trigger «ragioniamo» da Trade-Analyst | MATTEO | ORIGINATA | cross-project-lexicon | `VOCABOLARIO.md` (voce ragioniamo) |
| M1-D11 | 28-05-26 | AI-METODO | «spiegamelo semplice» = effetto + chi fa cosa | MATTEO | APPROVATA | plain-language | `ARCHIVIO_DECISIONI.md` L48 |
| M1-D12 | 28-05-26 | TESTING | «revisione completa» = critica, mai ok cortesia | MATTEO | APPROVATA | critical-review | `ARCHIVIO_DECISIONI.md` L47 |
| M1-D13 | 28-05-26 | AI-METODO | «dammi follow up» = solo prompt auto-contenuto | MATTEO | APPROVATA | handoff-prompt | `ARCHIVIO_DECISIONI.md` L46 |
| M1-D14 | 29-05-26 | UI-UX | Conferma = Modal in-app, non window.confirm | MATTEO | APPROVATA | modal-ux | `ARCHIVIO_DECISIONI.md` L35 |
| M3-D48 + M1-D15 + G1-D27 + M2-D09 | 28-05-26 | SICUREZZA | Mai scrivere PROD senza conferma esplicita | MATTEO | APPROVATA | env-safety | `VOCABOLARIO.md`; `APP_CONTEXT_SKILL.md` §1b |
| M1-D16 | 28-05-26 | AI-METODO | Plan mode: AskUserQuestion su decisioni sue | MATTEO | ORIGINATA | decision-gates | `VOCABOLARIO.md` (plan mode) |
| M1-D17 + M4-D39 | 28-05-26 | PRODOTTO | Tre zone menu distinte (Prenota/QR/magazzino) | MATTEO | APPROVATA | area-disambiguation | `ARCHIVIO_DECISIONI.md` L50; `VOCABOLARIO.md` scorciatoie |
| M1-D18 | 28-05-26 | AI-METODO | **RIFIUTO** «è un bug o è voluto?» | MATTEO | ORIGINATA | vocab-rejection | `ARCHIVIO_DECISIONI.md` L52 |
| M1-D19 | 28-05-26 | AI-METODO | **RIFIUTO** «devo farlo io ogni volta?» | MATTEO | ORIGINATA | vocab-rejection | `ARCHIVIO_DECISIONI.md` L53 |
| M1-D20 | 01-06-26 | AI-METODO | **RIFIUTO** «comportamenti ok ma voglio che cambi» | MATTEO | ORIGINATA | vocab-rejection | `ARCHIVIO_DECISIONI.md` L40 |
| M1-D21 | 01-06-26 | AI-METODO | **RIFIUTO promozione** «compila report comunicazione» | MATTEO | ORIGINATA | vocab-rejection | `ARCHIVIO_DECISIONI.md` L41 |
| M1-D22 | 02-06-26 | AI-METODO | «sticky» RITIRATA da VOCABOLARIO | MATTEO | CORRETTIVA | vocab-governance | `ARCHIVIO_DECISIONI.md` L20 |
| M1-D23 | 02-06-26 | AI-METODO | Freno scope creep in PREPARA_PROMPT | CONGIUNTA | APPROVATA | scope-control | `ARCHIVIO_DECISIONI.md` L15 |
| M1-D24 | 02-06-26 | AI-METODO | Guasto #1 → hook stop, non nuova markdown | CONGIUNTA | APPROVATA | soft-vs-enforcement | `ARCHIVIO_DECISIONI.md` L16 |
| M1-D25 | 02-06-26 | PROCESSO | Handoff due parti (copia-incolla + riepilogo) | MATTEO | APPROVATA | handoff-format | `ARCHIVIO_DECISIONI.md` L17 |
| M1-D26 | 02-06-26 | AI-METODO | Su correzione prompt → riconsegna blocco intero | MATTEO | ORIGINATA | prepara-filter | `ARCHIVIO_DECISIONI.md` L18 |
| M1-D27 | 02-06-26 | PROCESSO | Zone confondibili anche in chat esplorativa | CONGIUNTA | APPROVATA | area-disambiguation | `ARCHIVIO_DECISIONI.md` L21 |
| A3-D25 + M1-D28 | 31-05-26 | AI-METODO | Gate disambiguazione Prenota vs Menu QR | CONGIUNTA | CORRETTIVA | area-disambiguation | `ARCHIVIO_DECISIONI.md` L25 |
| A3-D26 + M1-D29 | 31-05-26 | AI-METODO | Profilo+skill espliciti nel prompt esecutore | MATTEO | ORIGINATA | prepara-filter | `ARCHIVIO_DECISIONI.md` L26 |
| M1-D30 | 31-05-26 | TESTING | Checklist QA: no URL, sì schermata+effetto | MATTEO | APPROVATA | plain-language | `ARCHIVIO_DECISIONI.md` L27 |
| M1-D31 | 29-05-26 | AI-METODO | Metriche successo chat (M5) | CONGIUNTA | APPROVATA | system-metrics | `ARCHIVIO_DECISIONI.md` L31 |
| M1-D35 | 29-05-26 | UI-UX | Copy verbatim: cambia solo stringhe citate | MATTEO | CORRETTIVA | copy-discipline | `ARCHIVIO_DECISIONI.md` L38 |
| M1-D36 | 29-05-26 | AI-METODO | Freno azioni strutturali rischiose + AskUser | MATTEO | ORIGINATA | risk-gates | `ARCHIVIO_DECISIONI.md` L39 |
| M1-D37 | 29-05-26 | AI-METODO | PAUSA-RACCOLTA: stop nuovi meccanismi | MATTEO | ORIGINATA | anti-bureaucracy | `EVOLUZIONE_SKILLS.md` L199-204 |
| M1-D38 | 02-06-26 | AI-METODO | Mandato Meta senior: partner, non cala decisioni | MATTEO | ORIGINATA | meta-senior | `EVOLUZIONE_SKILLS.md` L16-18 |
| A4-D32 + M1-D39 | 04-06-26 | FORMAZIONE | Mandato «educare Matteo» + Lezione della chat | MATTEO | ORIGINATA | didactic-senior | `EVOLUZIONE_SKILLS.md` L95-110 |
| M1-D41 | 02-06-26 | AI-METODO | Hook smart-allow (avvisa, non blocca) | MATTEO | APPROVATA | hook-stop-design | `EVOLUZIONE_SKILLS.md` L458 |
| M1-D42 | 02-06-26 | AI-METODO | Dammi file fresco SEMPRE, non solo sui buchi | MATTEO | ORIGINATA | hook-stop-design | `EVOLUZIONE_SKILLS.md` L285 |
| M1-D43 | 04-06-26 | SICUREZZA | Guard PROD = ask (fermati e chiedi), non deny | MATTEO | ORIGINATA | env-safety | `EVOLUZIONE_SKILLS.md` L293-294 |
| M1-D44 | 04-06-26 | AI-METODO | Hook v4: da titolo a risposta obbligata Q/R | MATTEO | ORIGINATA | hook-stop-design | `EVOLUZIONE_SKILLS.md` L466 |
| M1-D45 | 04-06-26 | TESTING | CONTROVERIFICA a 3 livelli (hook→self→imparziale) | MATTEO | ORIGINATA | controverifica | `EVOLUZIONE_SKILLS.md` L471; `CONTROVERIFICA.md` |
| M1-D47 | 06-06-26 | TESTING | «BLINDATA» = doc + prodotto funzionante in prod | MATTEO | ORIGINATA | blindatura-prodotto | `EVOLUZIONE_SKILLS.md` L476; `PROSEGUIMENTO_MAPPATURA_SKILL.md` L87-88 |
| M1-D48 | 10-06-26 | PROCESSO | Merge pubblico solo se tocca src/ (prodotto) | CONGIUNTA | APPROVATA | release-hygiene | `EVOLUZIONE_SKILLS.md` L125-140 |
| M1-D52 | 01-06-26 | AI-METODO | Propagare upgrade strutturali al template v.0 | MATTEO | ORIGINATA | template-sync | `REVISIONE.md` §6b |
| M1-D53 | 28-05-26 | AI-METODO | Meglio una domanda in più che una in meno | MATTEO | ORIGINATA | decision-gates | `ARCHIVIO_OSSERVAZIONI.md` L262 |
| M1-D54 | 28-05-26 | SICUREZZA | docs/_lavoro/ privata; mai esporre su git | MATTEO | ORIGINATA | privacy-docs | `ARCHIVIO_OSSERVAZIONI.md` L283-284 |
| M1-D55 | 28-05-26 | PROCESSO | Commit separati come punti di ripristino | MATTEO | APPROVATA | commit-checkpoints | `ARCHIVIO_OSSERVAZIONI.md` L285-287; `CHIUSURA` L218-219 |
| M1-D56 | 11-06-26 | PROCESSO | «commit» esplicito ≠ push automatico | MATTEO | CORRETTIVA | session-close-split | `OSSERVAZIONI.md` L126-129 |
| M1-D57 | 11-06-26 | AI-METODO | Stop ripetizioni post-decisione | MATTEO | ORIGINATA | plain-language | `OSSERVAZIONI.md` L203 |
| M1-D58 | 11-06-26 | AI-METODO | Niente elenchi minimali con sigle verso Matteo | MATTEO | ORIGINATA | plain-language | `OSSERVAZIONI.md` L204 |
| M1-D59 | 10-06-26 | PROCESSO | Esecutori non aggiornano plan/roadmap | MATTEO | ORIGINATA | role-boundaries · IPOTESI | `OSSERVAZIONI.md` L135-138 |
| M1-D61 | 04-06-26 | AI-METODO | Context-knowledge 3 strati: codice=verità | MATTEO | ORIGINATA | context-knowledge | `EVOLUZIONE_SKILLS.md` L476 / Log L469 |
| M1-D62 | 04-06-26 | FORMAZIONE | Sistema didattico M7 parallelo (parti micro) | MATTEO | ORIGINATA | didactic-senior | `EVOLUZIONE_SKILLS.md` L470 |
| M1-D63 | 20-06-26 | AI-METODO | Snellimento missione permanente skill system | MATTEO | ORIGINATA | system-slim | `EVOLUZIONE_SKILLS.md` L440 |
| M1-D64 | 30-05-26 | PROCESSO | Solo due branch: env/test → main | CONGIUNTA | APPROVATA | git-workflow | `APP_CONTEXT_SKILL.md` L142-150 |
| M1-D65 | 30-05-26 | AI-METODO | No nuovo file mappa richieste ora | MATTEO | ORIGINATA | anti-bureaucracy | `PROPOSTE.md` L52 |
| M1-D66 | 04-06-26+ | AI-METODO | Skill = senso+mappa; dettaglio in contesto/ | CONGIUNTA | APPROVATA | skill-area-model | `PROSEGUIMENTO_MAPPATURA_SKILL.md` L52-55 |
| M1-D67 | ? | AI-METODO | Report storici Sessioni non si toccano | CONGIUNTA | APPROVATA | anti-storia | `PROSEGUIMENTO_MAPPATURA_SKILL.md` L61 |
| M1-D68 | ? | AI-METODO | Controverifica: chi-fa ≠ chi-verifica | CONGIUNTA | APPROVATA | controverifica · IPOTESI | `CONTROVERIFICA.md` L25-27 |
| M1-D69 | 29-05-26 | AI-METODO | Estrarre template skill system v.0 | INCERTO | NON-DETERMINABILE | template-extraction | `_skill-system-v0/README.md` footer |
| M1-D70 | 03-08-26 | AI-METODO | Decisioni prodotto in termini di sala, non impl. | MATTEO | CORRETTIVA | product-language | `EVOLUZIONE_SKILLS.md` Log L438 |
| M1-D71 | 19-06-26 | TESTING | Checklist flussi QA visivo Per Matteo | CONGIUNTA | APPROVATA | qa-human | `EVOLUZIONE_SKILLS.md` L457 |
| M1-D72 | ? | PROCESSO | Non toccare `npm run dev` di Matteo | MATTEO | ORIGINATA | dev-server-respect | `CHIUSURA_SESSIONE.md` L255-256 |
| M1-D73 | ? | AI-METODO | Skill vive: solo Meta+Matteo promuove regole | CONGIUNTA | APPROVATA | vocab-governance | `CHIUSURA_SESSIONE.md` L162-164 |
| M1-D75 | 04-06-26 | AI-METODO | Liv.2 «main»/«menù originale» tenere (basso uso) | MATTEO | APPROVATA | vocab-governance | `EVOLUZIONE_SKILLS.md` L464 |
| M1-D76 | 04-06-26 | AI-METODO | Propagazione v.0 sospesa poi sbloccata (parziale) | MATTEO | CORRETTIVA | template-sync | `EVOLUZIONE_SKILLS.md` L462 · L472 |
| M1-D77 | 02-06-26 | UI-UX | Parola sticky = elemento forzatamente agganciato | MATTEO | ORIGINATA | sticky-ux (solo OSS) | `OSSERVAZIONI.md` L198 |
| M1-D79 | 23-06-26 | PROCESSO | «allinea console» = doc env/test → branch team | MATTEO | ORIGINATA | console-sync | `VOCABOLARIO.md` (voce allinea console) |
| M1-D80 | 12-06-26 | AI-METODO | Mini-pack `*_MINI.md` (≤80 righe) | CONGIUNTA | APPROVATA | mini-pack | `APP_CONTEXT_SKILL.md` §0.0b; `_skill-system-v0/aree/_TEMPLATE_MINI.md` |
| M2-D01 + M4-D23 | 22-06-26 | PRODOTTO | Add-on = `tenant_features`; `qr_menu_enabled` legacy | MATTEO | SCELTA | product-feature-model | `sessioni/DECISION_LOG.md` DEC-008 |
| M2-D02 | 22-06-26 | PRODOTTO | «+QR» = classic + riga `qrMenu` | MATTEO | SCELTA | product-packaging | `DECISION_LOG.md` DEC-009 |
| M2-D03 | 22-06-26 | SICUREZZA | Scritture privilegiate via Edge Function su TEST | MATTEO | APPROVATA | env-safety / privileged-writes | `DECISION_LOG.md` DEC-010 |
| M2-D04 | 22-06-26 | SICUREZZA | Login Console = Auth + allowlist solo Matteo | MATTEO | ORIGINATA | access-control | `DECISION_LOG.md` DEC-011 |
| M2-D05 | 22-06-26 | ALTRO | Deploy Vercel root `console/`, dominio TBD | MATTEO | APPROVATA | deploy-scoping | `DECISION_LOG.md` DEC-012 |
| M2-D06 | 22-06-26 | AI-METODO | Consenso pieno «per ora» + tracciabilità obbligatoria | CONGIUNTA | ORIGINATA | agent-governance | `DECISION_LOG.md` DEC-013; `TRACCIABILITA.md` |
| M2-D07 | 22-06-26 | SICUREZZA | Schema/DDL mai dall’agente → `plan-per-matteo/` | AGENTE | ORIGINATA | env-safety / schema-gate | `plan-per-matteo/README.md`; `00_BUSSOLA_CONSOLE.md` RULE-3 |
| M2-D08 | 22-06-26 | FUORI-SCHEMA | Codice Console in sottocartella isolata `console/` | AGENTE | ORIGINATA | isolation-architecture | `DECISION_LOG.md` DEC-001 |
| M2-D10 | 22-06-26 | SICUREZZA | Deploy Edge lo esegue Matteo, non l’agente | AGENTE | ORIGINATA | privileged-deploy-gate | `DECISION_LOG.md` DEC-021 |
| M2-D11 | 22-06-26 | UI-UX | Login Magic Link → email+password | MATTEO | CORRETTIVA | auth-ux | `DECISION_LOG.md` DEC-032 |
| M2-D12 | 22-06-26 | SICUREZZA | Matteo esegue letture RLS PLAN-DB-002/004 su TEST | MATTEO | SCELTA | hands-on-db | `DECISION_LOG.md` DEC-034; `STATO_AMBIENTE_TEST.md` |
| M2-D13 | 22-06-26 | SICUREZZA | Matteo deploya Edge + secret (PLAN-DB-003) | MATTEO | SCELTA | hands-on-ops | `DECISION_LOG.md` DEC-035 |
| M2-D14 | 22-06-26 | PROCESSO | Canale collaborazione REQ↔consegne Team↔Matteo | MATTEO | ORIGINATA | collab-workflow | `DECISION_LOG.md` DEC-036; `collaborazione/README.md` |
| M2-D15 | 22-06-26 | SICUREZZA | Ambito scritture = tutte le aziende TEST; **revoca RULE-2** sandbox-only | MATTEO | ORIGINATA | multi-tenant-safety-tradeoff | `DECISION_LOG.md` DEC-037; REQ-001 §Decisioni |
| M2-D16 | 22-06-26 | SICUREZZA | Eliminazione = hard-delete + riscrivere nome/email esatti | MATTEO | ORIGINATA | destructive-confirm | `DECISION_LOG.md` DEC-038 |
| M2-D17 | 22-06-26 | PRODOTTO | «Utente» = admin ristorante (`admin_users`+Auth), non cliente | MATTEO | ORIGINATA | domain-model | `DECISION_LOG.md` DEC-039 |
| M2-D18 | 22-06-26 | PRODOTTO | Scheda azienda copre tutte le sezioni intervista | MATTEO | ORIGINATA | onboarding-to-console | `DECISION_LOG.md` DEC-040; `onboarding/INTERVISTA_NUOVO_CLIENTE.md` |
| M2-D19 | 22-06-26 | FLUSSO | Nuovo admin = email+password da Matteo; azienda+admin in un passo | MATTEO | ORIGINATA | sales-ops-flow | `DECISION_LOG.md` DEC-041 |
| M2-D20 | 22-06-26 | PROCESSO | Ordine: lettura REQ-001/002 prima, poi scritture/REQ-003 | MATTEO | ORIGINATA | delivery-sequencing | `DECISION_LOG.md` DEC-042 |
| M2-D21 | 22-06-26 | AI-METODO | Master-plan F1–F7 (login/Edge separati) + automode | AGENTE | ORIGINATA | multi-agent-orchestration | `DECISION_LOG.md` DEC-014/015; `MASTERPLAN_CONSOLE.md` |
| M2-D22 | 22-06-26 | UI-UX | Scope F7: solo 5 chiavi impostazioni (freno creep) | AGENTE | ORIGINATA | scope-control | `DECISION_LOG.md` DEC-030 |
| M2-D23 | 22-06-26 | SICUREZZA | Cascata delete: app+409; CASCADE schema = scelta Matteo (PLAN-DB-006) | AGENTE | DELEGATA | destructive-schema | `DECISION_LOG.md` DEC-047; `PLAN-DB-006-*.md` |
| M2-D24 | 22-06-26 | UI-UX | Invariante: Console usabile da mobile (~375px) | MATTEO | ORIGINATA | mobile-ops | `00_BUSSOLA_CONSOLE.md` §0; commit `19ec78b` |
| M2-D25 | 22-06-26 | PRODOTTO | REQ-001/002/003 aperte da Matteo (CRUD utenti, scheda, crea/elimina aziende) | MATTEO | ORIGINATA | product-backlog-owner | `collaborazione/richieste/REQ-001*.md` (campo «Aperta da») |
| M2-D26 | 22-06-26 | PRODOTTO | Estendere Console ai parametri pagina Prenota (FU-CONSOLE-11) | MATTEO | ORIGINATA | console-scope-expansion | `sessioni/FOLLOW_UP.md` FU-CONSOLE-11 |
| M2-D27 | 22-06-26 | AI-METODO | Skill system branch separato (Bussola Console) vs skill Matteo | AGENTE | ORIGINATA | dual-skill-system | `README.md`; `Report-setup-…22-06-26.md` |
| M2-D28 | 23-06-26 | PROCESSO | Workflow 3 branch: Team solo su feature; Matteo tira su env/test e main | CONGIUNTA | SCELTA | release-governance | `collaborazione/WORKFLOW.md` §1 |
| M2-D29 | 23-06-26 | SICUREZZA | PLAN-DB-006 CASCADE eseguito su TEST (autorizzato da Matteo) | MATTEO | APPROVATA | hands-on-db | `git show feature/…/PLAN-DB-006` Stato; SESSION_LOG feature 23-06 |
| M2-D30 | 23-06-26 | TESTING | Esito test: REQ-001…004 ACCETTATE (residui su 001/002) | INCERTO | APPROVATA | acceptance-testing | `git show feature/…/REGISTRO_RICHIESTE.md` |
| M2-D31 | 22-06-26 | SICUREZZA | Doppio gate allowlist client≠server | AGENTE | ORIGINATA | defense-in-depth | `DECISION_LOG.md` DEC-024 |
| M2-D32 | 22-06-26 | FLUSSO | Navigazione Console = switch stato, non react-router | AGENTE | ORIGINATA | ui-architecture | `DECISION_LOG.md` DEC-045 |
| M3-D02 | 06-06-26 | PRODOTTO | Classic senza sidebar; Pro+ con sidebar | MATTEO | APPROVATA | edition-shell | `ADMIN_SKILL.md` §6; NAV §9 |
| M3-D03 | 06-06-26 | FLUSSO | Logout bloccato dal guard dirty | MATTEO | APPROVATA | dirty-guard | `ADMIN_SKILL.md` §6; NAV §2 |
| M3-D05 | 06-06-26 | PRODOTTO | `features.home=false` nasconde Home | MATTEO | APPROVATA | feature-home | `ADMIN_SKILL.md` §6 |
| M3-D06 | 06-06-26 | FLUSSO | Refresh/back via sotto-route URL | MATTEO | APPROVATA | url-source | `ADMIN_SKILL.md` §6; NAV §9 |
| M3-D07 | 06-06-26 | TESTING | Area 1 PROD solo con E2E browser | MATTEO | APPROVATA | blindatura-gate | `contesto/ADMIN_TEST_SUITE_INDEX.md` §9 |
| A5-D26 + M3-D08 | 06-06-26 | FLUSSO | Capienza/orario passato = solo avviso | MATTEO | ORIGINATA | soft-limits | `contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` §5-bis.1 |
| M3-D09 | 06-06-26 | PRODOTTO | Stati booking tutti voluti | MATTEO | ORIGINATA | stati-booking | PRENOTAZIONI §5-bis.2 |
| M3-D10 | 06-06-26 | PRODOTTO | Archivio solo soft-delete forever | MATTEO | ORIGINATA | soft-delete | PRENOTAZIONI §5-bis.3 |
| M3-D11 | 06-06-26 | UI-UX | Una sola lingua di conferma | MATTEO | ORIGINATA | conferme-ui | PRENOTAZIONI §5-bis.4 |
| M3-D12 | 06-06-26 | AI-METODO | Senso voluto: non migliorare d’ufficio | MATTEO | ORIGINATA | product-interview | PRENOTAZIONI §5-bis header |
| M3-D14 | 11-06-26 | UI-UX | Calendario = vista d’insieme + lista | MATTEO | ORIGINATA | calendario-m2 | PRENOTAZIONI §5-ter |
| M3-D18 | 11-06-26 | UI-UX | % riempimento reale oltre 100% | MATTEO | ORIGINATA | badge-capienza | PRENOTAZIONI §5-ter.7 |
| M3-D24 | 15-06-26 | IMPOSTAZIONI | Nome obbligatorio; no titolo inventato | MATTEO | ORIGINATA | anagrafica | `contesto/ADMIN_SETTINGS_CONTEXT.md` §8 |
| M3-D25 | 15-06-26 | IMPOSTAZIONI | Cap anagrafica 45/65/30/120 | MATTEO | ORIGINATA | cap-testo | SETTINGS §8 |
| M3-D26 | 15-06-26 | IMPOSTAZIONI | `booking_window_days` non implementare | MATTEO | ORIGINATA | fuoriscope | SETTINGS §8 |
| M3-D27 | 15-06-26 | IMPOSTAZIONI | Sfondo Prenota striscia XOR full-page | MATTEO | ORIGINATA | background | SETTINGS §8 |
| M3-D28 | 15-06-26 | UI-UX | `app_theme` solo admin | MATTEO | ORIGINATA | tema-admin | SETTINGS §8 |
| A8-D11 + M3-D29 | 15-06-26 | PRODOTTO | Campagne: gruppo destinatari fisso | MATTEO | ORIGINATA | campagne-email | `contesto/ADMIN_CRM_CONTEXT.md` §10 |
| M3-D30 | 15-06-26 | FLUSSO | Niente creazione cliente manuale CRM | MATTEO | CORRETTIVA | crm-rubrica | CRM §1 |
| M3-D32 | 18-06-26 | IMPOSTAZIONI | Limiti bloccano solo pubblico | MATTEO | APPROVATA | soft-limits | SETTINGS §8 |
| M3-D33 | 18-06-26 | COMPLIANCE | Marketing consent obbligatorio campagne | CONGIUNTA | APPROVATA | gdpr-email | CRM §7 |
| M3-D34 | 20-06-26 | UI-UX | Redesign rubrica: 3 fix Matteo in PROD | MATTEO | ORIGINATA | crm-rubrica | CRM §12 |
| M3-D35 | 22-06-26 | PROCESSO | Codice morto Servizio rimosso | MATTEO | APPROVATA | cleanup | `contesto/ADMIN_SERVIZIO_CONTEXT.md` §8 |
| M3-D36 | 02-08-26 | UI-UX | Sale occupano troppo spazio → strip | MATTEO | ORIGINATA | servizio-ui | SERVIZIO §9.7 |
| M3-D39 | 03-08-26 | FLUSSO | Spostamento non consuma turno (D-B) | MATTEO | ORIGINATA | dottrina-turni | SERVIZIO §9.14 |
| M3-D40 | 03-08-26 | FLUSSO | Delete tavolo: DELETE assignment (D-A) | MATTEO | ORIGINATA | dottrina-turni | SERVIZIO §9.14 |
| M3-D41 | 03-08-26 | FLUSSO | «Ancora occupato» persistito (D-D) | MATTEO | ORIGINATA | release-notice | SERVIZIO §9.14 |
| M3-D43 | 06-08-26 | TESTING | 38 voci già auto: non rifare a mano | AGENTE | SCELTA | test-strategy | COLLAUDO_MANUALE header + §5 |
| M3-D44 | 06-08-26 | PROCESSO | E2E ≠ «Matteo l’ha visto» | CONGIUNTA | APPROVATA | accettazione-umana | `COLLAUDO_S4_CHECKLIST.md` header |
| M3-D45 | 06-08-26 | TESTING | Servizio blindato tecnico TEST 118/118 | CONGIUNTA | APPROVATA | blindatura-servizio | COLLAUDO_S4 header; `ADMIN_SKILL.md` §8 |
| M3-D46 | 12-06-26 | SICUREZZA | Mig 048 TEST+PROD con conferma Matteo | MATTEO | APPROVATA | env-safety | `Database-Skill/DB_MIGRATIONS_CONTEXT.md` Snapshot 048 |
| M3-D50 | 12-06-26 | PROCESSO | Dashboard-laterale → tombstone Admin | INCERTO | NON-DETERMINABILE | skill-migration | `Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| M3-D51 | 23-06-26 | IMPOSTAZIONI | Arrivi tardivi solo console | INCERTO | NON-DETERMINABILE | settings-governance | `Servizio-Config/GUIDA_CONFIGURAZIONE_CLIENTE.md` BLOCCO 2 |
| M3-D52 | ? | PRODOTTO | Console solo Matteo, non ristoratore | MATTEO | NON-DETERMINABILE | product-ownership | `Servizio-Config/BENVENUTO_SVILUPPATORE_CONSOLE.md` §2 |
| M3-D53 | ? | VENDITA | Edition/feature mai in mano cliente | MATTEO | NON-DETERMINABILE | monetization | `Servizio-Config/INVENTARIO_…md` 🟦 |
| M3-D54 | 05-08-26 | TESTING | Workers E2E = 1 chiuso | CONGIUNTA | SCELTA | e2e-ops | `Testing-Skill/TESTING_SKILL.md` §3 |
| M3-D55 | — | AI-METODO | Verde copertura ≠ sezione blindata | AGENTE | ORIGINATA | blindatura-metodo | `MANUALE_BLINDATURA.md` §0 |
| A7-D15 + M4-D02 | 12-06-26 | LEGALE | P.IVA ipotesi forfettario pre-incasso | MATTEO | ORIGINATA | legal-vendita | idem BLOCCANTI |
| M4-D06 | 12-06-26 | COMPLIANCE | GDPR registro/runbook/sub-proc declassati | CONGIUNTA | CORRETTIVA | legal-gdpr-priorità | idem §DA FARE ENTRO |
| M4-D07 | 12-06-26 | PRODOTTO | Marchio commerciale PrenotaZen | MATTEO | ORIGINATA | brand | idem CONSIGLIATI |
| M4-D08 | 12-06-26 | LEGALE | Deposito UIBM prima di stampa | MATTEO | APPROVATA | brand | idem CONSIGLIATI |
| M4-D10 | 12-06-26 | PROCESSO | Email privacy@ rimandata | MATTEO | DELEGATA | legal-contatti | idem CONSIGLIATI |
| M4-D12 | 23-05-26 | COMPLIANCE | No Iubenda/OneTrust; docs in repo | MATTEO | ORIGINATA | legal-metodo | idem Decisioni 2026-05-23 |
| M4-D13 | 23-05-26 | COMPLIANCE | Cookie banner = NO | MATTEO | APPROVATA | cookie | idem FASE 4; `COOKIE_CONTEXT.md` |
| M4-D14 | 23-05-26 | UI-UX | Privacy Policy = pagina React `/privacy` | AGENTE | SCELTA | privacy-policy | `LEGAL_STATE_CONTEXT.md` Decisioni |
| M4-D15 | 23-05-26 | PROCESSO | DPA clienti = template locale gitignored | AGENTE | SCELTA | dpa-clienti | idem Decisioni |
| M4-D17 | 15-06-26 | PROCESSO | Bozze v0.1 in `docs/legal/` | AGENTE | DELEGATA | legal-bozze | idem Storia 2026-06-15 |
| A7-D14 + G1-D33 + M4-D20 | 12-06-26 | VENDITA | Zero commissioni a coperto, canone fisso | MATTEO | ORIGINATA | pricing-posizionamento | idem §Regola |
| M4-D21 | 12-06-26 | VENDITA | Menu QR add-on Classic +16€/mese | MATTEO | APPROVATA | pricing-addon | idem Add-on; `FEATURE_CATALOG` |
| M4-D22 | 12-06-26 | VENDITA | Trial 30gg; setup fondatori; referral 1 mese | MATTEO | APPROVATA | pricing-servizi | idem §Trial |
| M4-D24 | ? | PRODOTTO | Bundle vs add-on prima di codificare | AGENTE | SCELTA | marketing-metodo | idem §2 |
| M4-D25 | ? | PRODOTTO | QR multipli per locale | MATTEO | ORIGINATA | product-scoping | `Menu-QR-Skill/MENU_QR_SKILL.md` §2-bis |
| M4-D26 | ? | PRODOTTO | Evento = carosello + nome QR | MATTEO | SCELTA | product-scoping | idem §2-bis |
| M4-D27 | 06-06-26 | PRODOTTO | Drop content_type/preset dal QR | CONGIUNTA | CORRETTIVA | product-scoping | idem §3-bis; `MENU_QR_REFERENCE` migr.043 |
| A5-D07 + M4-D28 | ? | UI-UX | Nome QR interno, mai al cliente | MATTEO | APPROVATA | ux-privacy-labels | `MENU_QR_SKILL.md` §3 |
| M4-D29 | ? | FLUSSO | Carosello obbligatorio al Salva | MATTEO | APPROVATA | form-validation | idem §3 |
| A5-D01 + M4-D30 | 06-06-26 | UI-UX | Eyebrow vuota → niente fallback | MATTEO | APPROVATA | ux-no-fake-copy | idem §3 |
| A5-D05 + M4-D31 | 06-06-26 | UI-UX | Cap titolo/desc card QR 30/70 | MATTEO | SCELTA | layout-text-caps | `MENU_QR_TEXT_LIMITS_MAP.md` §B |
| M4-D32 | ? | UI-UX | Cap testo cliente Prenota silenziosi | MATTEO | APPROVATA | layout-text-caps | `Prenota-Skill/PRENOTA_SKILL.md` §3 |
| M4-D33 | ? | UI-UX | Striscia foto anche a 375px | MATTEO | APPROVATA | public-layout | idem §3 |
| M4-D35 | 02-06-26 | UI-UX | Sotto 1256px: un solo riepilogo | MATTEO | APPROVATA | public-layout | idem §3 |
| M4-D36 | 05-06-26 | PRODOTTO | Intolleranze su ogni tipologia | MATTEO | ORIGINATA | product-capabilities | idem §3-bis |
| M4-D37 | 04-08-26 | FLUSSO | Card singola → auto-selezione | MATTEO | ORIGINATA | product-auto-select | `PRENOTA_LAYOUT_CONTEXT.md` §5 |
| M4-D38 | ? | PROCESSO | LOCK griglia: chiedere a Matteo | MATTEO | APPROVATA | lock-discipline | `PRENOTA_SKILL.md` §5 |
| M4-D40 | 04-06-26 | AI-METODO | Stub path Prenota → Prenota-Skill | AGENTE | DELEGATA | skill-hygiene | `per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` |
| M4-D41 | 12-06-26 | AI-METODO | Stub Menu admin → Admin-Skill | AGENTE | DELEGATA | skill-hygiene | `per-ui-design-skill/MENU_ADMIN_CONTEXT.md` |
| M4-D42 | 10-06-26 | PROCESSO | Intervista per sezione prima di blindare | MATTEO | ORIGINATA | blindatura | `MASTERPLAN_BLINDATURA.md` §flusso |
| M4-D43 | 10-06-26 | PRODOTTO | main/PrenotaZen = Classic; Pro fuori | MATTEO | ORIGINATA | edition-prod | idem Confine production |
| M4-D44 | 10-06-26 | PROCESSO | Debiti FU non bloccano merge milestone | MATTEO | ORIGINATA | blindatura | idem §5 |
| M4-D45 + G1-D39 | 12-06-26 | AI-METODO | Un WP per sessione, niente fuori prompt | MATTEO | ORIGINATA | meta-wp | `MASTERPLAN_ALLINEAMENTO.md` regole |
| M4-D46 | 12-06-26 | PRODOTTO | B5: rimuovere check-slot fail-open | MATTEO | ORIGINATA | edge-safety | idem WP-B5 |
| M4-D47 | 21-06-26 | AI-METODO | Masterplan Servizio governa, non implementa | CONGIUNTA | APPROVATA | servizio-governance | `MASTERPLAN_SERVIZIO.md` header |
| M4-D48 | 21-06-26 | IMPOSTAZIONI | Config durata max 2 luoghi (D3) | MATTEO | ORIGINATA | servizio-config | idem vincoli |
| M4-D49 | 22-06-26 | PRODOTTO | Card vince su tipologia se più corta (D35) | MATTEO | CORRETTIVA | product-duration | idem D35 |
| M4-D50 | 24-06-26 | VENDITA | Vincolo GTM 10–15 clienti NON adottato | MATTEO | ORIGINATA | gtm-scope | idem §9 |
| M4-D51 | 31-05-26 | PRODOTTO | FU-021 tile Prenota annullato | MATTEO | CORRETTIVA | public-layout | `FOLLOW_UP.md` FU-021 |
| A11-D49 + M4-D52 | 06-08-26 | PRODOTTO | Elimina sala allinea a tavolo (no turno) | MATTEO | ORIGINATA | servizio-sale | `FOLLOW_UP.md` FU-SERV-TURNO-SALA |
| M4-D53 | 06-08-26 | PRODOTTO | Badge capienza cascata uguale viste | MATTEO | ORIGINATA | servizio-badge | `FOLLOW_UP.md` FU-SERV-BADGE |
| M4-D54 | 30-05-26 | AI-METODO | Comunicazione: sintetico, dettaglio on-demand | MATTEO | ORIGINATA | comunicazione | `COMUNICAZIONE_UTENTE_SKILL.md` |
| M4-D55 | 02-06-26 | AI-METODO | Output attesi nel prompt (anti scope creep) | MATTEO | ORIGINATA | prepara-prompt | `PREPARA_PROMPT_SKILL.md` |
| M4-D56 | 31-05-26 | AI-METODO | Gate Prenota vs Menu QR su scroll/sfondo | MATTEO | CORRETTIVA | area-routing | idem |
| M4-D58 | ? | FLUSSO | useFeatures unica fonte; no query edition | AGENTE | SCELTA | data-flow | `DATA_FLOW_SKILL.md` |
| M4-D60 | 05-08-26 | COMPLIANCE | Brevo attivo; DPA/lista/PP da chiudere | AGENTE | CORRETTIVA | legal-brevo | `LEGAL_STATE_CONTEXT.md` §Da decidere |

### A — sessioni pubbliche CalendarBackup-v2 (peso 3) — 640 righe

| ID (tutte le fonti fuse) | Data | Tipo | Oggetto | Chi | Autonomia | Skill | Fonte |
|---|---|---|---|---|---|---|---|
| A1-D01 | 23-05-26 | SICUREZZA | Audit spietato DB PROD pre-dati sensibili | MATTEO | ORIGINATA | env-safety | `23-05-26/Report-audit-sicurezza-DB-prod.md` §Contesto |
| A1-D02 | 23-05-26 | SICUREZZA | Hardening PROD: 5 falle + RLS/RPC | AGENTE | DELEGATA | multi-tenant-rls | stesso §Cosa è stato fatto |
| A1-D03 | 23-05-26 | SICUREZZA | 7 azioni Dashboard Supabase (MFA/DPA/SSL…) | INCERTO | DELEGATA | compliance-ops | stesso §Azioni manuali |
| A1-D04 | 23-05-26 | SICUREZZA | Segnalazione PROD Impostazioni bloccate | MATTEO | ORIGINATA | prod-incident | `Report-incident-prod-impostazioni-bloccate.md` §Sintomo |
| A1-D05 | 23-05-26 | PROCESSO | Fix: merge branch→main + push (catch-up 026) | AGENTE | DELEGATA | release-coupling | stesso §Fix applicato |
| A1-D06 | 23-05-26 | PROCESSO | Regola: REVOKE + fix client insieme su main | AGENTE | CORRETTIVA | env-safety | stesso §Lezione operativa |
| A1-D07 | 23-05-26 | UI-UX | Layout Calendario celle/full-width/titolo | INCERTO | DELEGATA | admin-calendar-ui | `Report-layout-calendario-responsive.md` §Obiettivo |
| A1-D08 | 23-05-26 | PRODOTTO | Campo nome promo + snapshot prenotazione | INCERTO | DELEGATA | booking-promo | `Report-promo-menu-label-prenotazione.md` |
| A1-D09 | 23-05-26 | PRODOTTO | Promo multi-tenant generiche, no vol-au-vent | INCERTO | SCELTA | product-scoping | `Report-refactor-promo-menu-rimozione-vol-au-vent.md` §Domande |
| A1-D11 | 23-05-26 | IMPOSTAZIONI | Chiave unica `booking_menu_promos` | INCERTO | SCELTA | settings-model | stesso §Domande |
| A1-D13 | 23-05-26 | FLUSSO | Rimuovere omaggio automatico Mini Rustici | AGENTE | APPROVATA | booking-menu-flow | stesso §4 |
| A1-D14 | 23-05-26 | CONFLITTI | LOCK BookingDetailsModal: solo rename promo | INCERTO | APPROVATA | lock-discipline | stesso §6 |
| A1-D15 | 23-05-26 | UI-UX | Scope: intera admin + form; titoli≠corpo | MATTEO | SCELTA | ui-responsive | `Report-revisione-responsive-scala-tipografica.md` §Domande |
| A1-D16 | 23-05-26 | UI-UX | Approccio utility CSS centralizzate | MATTEO | SCELTA | design-system | stesso §Domande |
| A1-D17 | 23-05-26 | PROCESSO | Partire da P1 (overflow) | MATTEO | SCELTA | prioritization | stesso §Domande |
| A1-D18 | 23-05-26 | PROCESSO | Commit prima di toccare LOCK AdminDashboard | MATTEO | ORIGINATA | lock-safety | stesso §Domande |
| A1-D19 | 23-05-26 | PROCESSO | Completare fino a P2 + skill + report | MATTEO | APPROVATA | session-scope | stesso §Domande |
| A1-D20 | 23-05-26 | UI-UX | Non refactor LOCK2/3 card/archivio | AGENTE | CORRETTIVA | lock-discipline | stesso §Deviazioni |
| A1-D21 | 23-05-26 | PROCESSO | Report in Sessioni, non `_lavoro` | MATTEO | CORRETTIVA | docs-process | `Report-pulizia-dead-code-e-allineamento-skill.md` §Domande |
| A1-D22 | 23-05-26 | UI-UX | Annullare allineamento InfoRow | MATTEO | CORRETTIVA | modal-layout | `Report-sessione-chat-admin-ux-promo-23-05-26.md` §7.3 |
| A1-D23 | 23-05-26 | PROCESSO | Assicurarsi resto codice promo committato | MATTEO | ORIGINATA | release-hygiene | stesso §7.4 |
| A1-D25 | 23-05-26 | SICUREZZA | Applicare 028–029 anche su PROD | INCERTO | APPROVATA | prod-migrations | stesso §Produzione |
| A1-D26 | 23-05-26 | PROCESSO | Deploy edge create-booking (attribuito a Matteo) | MATTEO | ORIGINATA | edge-deploy | refactor §7; allineamento checklist |
| A1-D27 | 23-05-26 | UI-UX | 5 tab admin restano aperti con form nuova | INCERTO | APPROVATA | admin-nav-ux | `Report-sessione-chat-admin-ux-promo-23-05-26.md` §7.1 |
| A1-D29 | 24-05-26 | VENDITA | Flag qrMenu: Pro on, Classic opt-in a pagamento | MATTEO | SCELTA | commercial-packaging | `24-05-26/Report-menu-qr-pubblico-fase-1.md` §Domande |
| A1-D30 | 24-05-26 | PROCESSO | Branch `Sviluppo-Dashboard-laterale` | MATTEO | SCELTA | branch-choice | stesso §Domande |
| A1-D31 | 24-05-26 | UI-UX | Pagina Menu QR mobile-first | MATTEO | ORIGINATA | mobile-first-public | stesso §Domande |
| A1-D32 | 24-05-26 | PRODOTTO | Schema QR: tabelle, bucket, 3 pagine pubbliche | AGENTE | DELEGATA | menu-qr-fase1 | stesso §Cosa è stato fatto |
| A1-D33 | 24-05-26 | TESTING | Collaudo Fase 1 via validate 137/137 | AGENTE | DELEGATA | test-strategy | stesso §Test |
| A1-D34 + M1-D74 | 24-05-26 | VENDITA | Modello ibrido edition + tenant_features | MATTEO | SCELTA | commercial-packaging | `Report-tenant-features-system.md` §Domande |
| A1-D35 | 24-05-26 | IMPOSTAZIONI | Niente UI flag: solo SQL/MCP manuale | MATTEO | SCELTA | ops-manual-flags | stesso §Domande |
| A1-D36 | 24-05-26 | AI-METODO | Conferma rimozione dead-code documentato | MATTEO | APPROVATA | docs-hygiene | stesso §Domande |
| A1-D37 | 24-05-26 | SICUREZZA | Migrazione 031 su TEST dopo get_project_url | AGENTE | DELEGATA | env-safety | stesso §Test |
| A1-D38 | 24-05-26 | AI-METODO | DATA_FLOW_SKILL come file separato | MATTEO | SCELTA | skill-architecture | `Report-skill-system-revisione.md` §Domande |
| A1-D39 | 24-05-26 | AI-METODO | Marketing KB in cartella dedicata | MATTEO | SCELTA | skill-architecture | stesso §Domande |
| A1-D40 | 24-05-26 | AI-METODO | Arricchire skill, non rifare da zero | INCERTO | DELEGATA | skill-architecture | stesso §Cosa è stato fatto |
| A1-D43 | 24-05-26 | UI-UX | Layout home QR: temi, tab, griglia, footer | MATTEO | SCELTA | menu-qr-homepage | `Report-menu-qr-homepage-layout-sessione.md` §1 |
| A1-D44 | 24-05-26 | UI-UX | Tipografia: skip LOCK/input/Prenota pubblica | AGENTE | DELEGATA | typography-migration | `Report-adozione-utility-tipografiche.md` |
| A1-D45 | 25-05-26 | PRODOTTO | Nascita Pagina Prenota v2 + Personalizza Form | INCERTO | APPROVATA | product-foundation | `25-05-26/README.md` |
| A1-D46 | 25-05-26 | UI-UX | Card tipologie al posto del select | INCERTO | APPROVATA | public-booking-ux | `Report-pagina-prenota-v2-admin-personalizza-form.md` |
| A1-D47 | 25-05-26 | FLUSSO | Chiave `booking_public_form_config` | AGENTE | DELEGATA | settings-schema | stesso |
| A1-D48 | 25-05-26 | AI-METODO | Plan Prenota v2 senza chiarimenti | INCERTO | DELEGATA | plan-delegation | stesso §Domande |
| A1-D49 | 25-05-26 | PRODOTTO | Tipologia card `booking_type` non rimappabile | INCERTO | CORRETTIVA | product-scoping | `Report-prenota-v2-fix-admin-panel.md` Fix 1 |
| A1-D50 | 25-05-26 | UI-UX | Layout mobile form già ok | MATTEO | APPROVATA | visual-qa | stesso Fix 3 |
| A1-D51 | 25-05-26 | PRODOTTO | Sottotab libere preset+manuale | INCERTO | ORIGINATA | booking-subtabs | `Report-sottotab-orizzontali-prenota-v2.md` |
| A1-D52 | 25-05-26 | TESTING | Collaudo manuale sottotab superato | MATTEO | APPROVATA | manual-qa | stesso §Domande |
| A1-D53 | 25-05-26 | UI-UX | Griglia compose card al posto accordion | INCERTO | APPROVATA | compose-menu-ux | `Report-menu-compose-cards.md` |
| A1-D54 | 25-05-26 | PRODOTTO | Descrizione + menù fisso/personalizzabile | INCERTO | ORIGINATA | staff-presets | `Report-menu-preselezionati-descrizione-fisso.md` |
| A1-D55 | 25-05-26 | PRODOTTO | Foto categoria Prenota ≠ FOTO QR | MATTEO | ORIGINATA | prenota-vs-qr-separation | `Report-foto-categoria-menu-prenota.md` §vincoli |
| A1-D56 | 25-05-26 | FLUSSO | Path Storage `booking-cat/` vs `cat/` | AGENTE | DELEGATA | storage-isolation | stesso |
| A1-D57 | 25-05-26 | SICUREZZA | Migrazione 035 `image_url` solo TEST | AGENTE | DELEGATA | env-safety | stesso |
| A1-D58 | 25-05-26 | PRODOTTO | Aspetto Menu QR per singolo QR | INCERTO | ORIGINATA | qr-per-code-config | `Report-menu-qr-modale-unificato-per-qr.md` |
| A1-D59 | 25-05-26 | AI-METODO | Review plan → correggi → esegui | MATTEO | SCELTA | plan-steering | stesso §Domande |
| A1-D60 | 25-05-26 | SICUREZZA | 036 solo TEST; prod da fare | AGENTE | DELEGATA | env-safety | stesso §Rischi |
| A1-D61 | 25-05-26 | PRODOTTO | Filtri ingredienti nascosti per-QR (037) | INCERTO | ORIGINATA | qr-item-filters | `Report-menu-qr-filtri-e-ui-modale.md` |
| A1-D62 | 25-05-26 | PRODOTTO | Rimuovere «Menù eventi visibili» | INCERTO | CORRETTIVA | product-cleanup | stesso |
| A1-D63 | 25-05-26 | SICUREZZA | Applicare 036+037 su produzione | MATTEO | CORRETTIVA | prod-incident-response | stesso §Cosa.5 |
| A1-D64 | 25-05-26 | PROCESSO | Scope ridotto: no defaultExpanded=true | MATTEO | CORRETTIVA | scope-control | `Report-refactor-menu-grouping-centralizzazione.md` |
| A1-D65 | 25-05-26 | PROCESSO | Client misto supabase fuori scope | MATTEO | SCELTA | risk-deferral | stesso |
| A1-D66 | 25-05-26 | UI-UX | Ordine form: tipologia/menù prima dei dati | MATTEO | ORIGINATA | form-flow | `Report-prenota-v2-ui-sessione-25-05-26.md` §Domande |
| A1-D67 | 25-05-26 | UI-UX | Card menù mobile colonna + collapse | MATTEO | ORIGINATA | mobile-compose-ux | stesso |
| A1-D68 | 25-05-26 | UI-UX | Rimuovere banner testo menù fisso | MATTEO | CORRETTIVA | copy-trim | stesso |
| A1-D69 | 25-05-26 | UI-UX | Label inset dentro le card campi | MATTEO | ORIGINATA | inset-fields | stesso |
| A1-D70 | 25-05-26 | UI-UX | Card tipologia +25% altezza | MATTEO | SCELTA | visual-tuning | stesso |
| A1-D71 | 25-05-26 | UI-UX | Spazi intolleranze mentre si digita | MATTEO | CORRETTIVA | input-bug-fix | stesso |
| A1-D72 | 25-05-26 | UI-UX | Picker data/ora controllati | MATTEO | SCELTA | datetime-picker-ux | stesso |
| A1-D73 | 26-05-26 | PRODOTTO | Due mondi: magazzino Menu vs vetrina Prenota | MATTEO | APPROVATA | product-scoping | `26-05-26/Analisi-flusso-admin-onboarding-prenota-26-05-26.md` §A |
| A1-D74 | 26-05-26 | PRODOTTO | Override vetrina senza toccare magazzino | MATTEO | ORIGINATA | product-scoping | stesso §A |
| A1-D75 | 26-05-26 | FLUSSO | Import preset solo in Personalizza Form | MATTEO | APPROVATA | data-flow | stesso §A |
| A1-D76 | 26-05-26 | PRODOTTO | Dopo Salva: cliente vede `sub_tabs`, non preset live | MATTEO | APPROVATA | snapshot-vetrina | stesso §A |
| A1-D77 | 26-05-26 | UI-UX | Bozza vs salvata: scelta UX, non bug | MATTEO | APPROVATA | ux-draft-save | stesso §B |
| A1-D79 | 26-05-26 | PRODOTTO | Carosello senza prezzo | MATTEO | CORRETTIVA | carousel-no-price | stesso §2.3 L5 |
| A1-D80 | 26-05-26 | FLUSSO | Flusso onboarding anagrafica→menu→preset→form | MATTEO | ORIGINATA | onboarding-flow | stesso header Scope |
| A1-D81 | 26-05-26 | PRODOTTO | Implementare `sub_tabs_presentation` XOR | AGENTE | DELEGATA | xor-presentation | `Report-xor-card-carosello-validazione-responsive-26-05-26.md` |
| A1-D82 | 26-05-26 | UI-UX | Overlay carosello da campi Personalizza Form | INCERTO | CORRETTIVA | overlay-binding | `Report-prenota-carosello-overlay-campi-26-05-26.md` |
| A1-D83 | 26-05-26 | UI-UX | Editor carosello foto-first, no prezzo | INCERTO | CORRETTIVA | carousel-editor | `Report-carosello-editor-per-slide-26-05-26.md` |
| A1-D84 | 26-05-26 | IMPOSTAZIONI | Salva/Annulla per sezione + footer globale | INCERTO | CORRETTIVA | save-ux | `Report-personalizza-form-salvataggio-sezioni-26-05-26.md` |
| A1-D85 | 26-05-26 | IMPOSTAZIONI | Salva sottotab senza doppio Salva | INCERTO | CORRETTIVA | save-ux | `Report-settings-save-ui-sottotab-26-05-26.md` |
| A1-D86 | 26-05-26 | PRODOTTO | `field_overrides`: live vs congelato | AGENTE | SCELTA | override-tracking | `Report-resolver-field-overrides-pulizia-26-05-26.md` |
| A1-D87 | 26-05-26 | UI-UX | Phosphor outline + 10 icone ristorazione | MATTEO | ORIGINATA | icon-system | `Report-prenota-v2-icone-responsive-26-05-26.md` §Domande |
| A1-D88 | 26-05-26 | UI-UX | Una sola libreria icone nei componenti toccati | MATTEO | ORIGINATA | icon-system | stesso |
| A1-D89 | 26-05-26 | UI-UX | UI leggera, controlli contestuali header | MATTEO | ORIGINATA | light-ui | stesso |
| A1-D90 | 26-05-26 | AI-METODO | Aggiornare skill + workflow Cursor | MATTEO | ORIGINATA | skill-update | stesso |
| A1-D91 | 26-05-26 | UI-UX | Card preset: nome da magazzino, no icona | INCERTO | CORRETTIVA | card-label-sync | `Report-prenota-v2-menu-ui-26-05-26.md` |
| A1-D92 | 26-05-26 | TESTING | Validazione email/telefono form rafforzata | AGENTE | SCELTA | form-validation | `Report-xor-…` §2 |
| A10-D01 | 20-06-26 | UI-UX | Micro-fix tipografia digest giornata | MATTEO | ORIGINATA | visual-iter | `20-06-26/Report-fix-ui-digest-giornata-admin-20-06-26.md` §11 R1 |
| A10-D02 | 20-06-26 | UI-UX | Pallino tavolo → badge cliccabile | MATTEO | ORIGINATA | table-assign-ux | stesso R1 |
| A10-D03 | 20-06-26 | PROCESSO | Report completo poi commit/push | MATTEO | ORIGINATA | closure-ritual | stesso R1 |
| A10-D04 | 20-06-26 | AI-METODO | Revisore Fase 0 dayDigest | MATTEO | DELEGATA | multi-agent-review | `20-06-26/Report-revisore-fase0-daydigestmodel-20-06-26.md` §11 R1 |
| A10-D05 | 20-06-26 | PROCESSO | Esegui Fase 2 plan digest | MATTEO | DELEGATA | plan-driven | `20-06-26/Report-fase2-gruppi-orari-griglia-daydigest-20-06-26.md` §11 R1 |
| A10-D06 | 20-06-26 | UI-UX | Prezzo p.p. sempre; tot layout | MATTEO | ORIGINATA | digest-pricing | stesso R1 |
| A10-D07 | 20-06-26 | AI-METODO | Igiene template skill-system v.0 | MATTEO | DELEGATA | skill-template | `20-06-26/Report-igiene-template-v0.md` §11 R1 |
| A10-D08 | 20-06-26 | PRODOTTO | Rubrica: righe distinte email+nome | MATTEO | ORIGINATA | crm-identity | `20-06-26/Report-fix-rubrica-crm-identita-email-nome-20-06-26.md` §11 R1 |
| A10-D09 | 20-06-26 | TESTING | Controtest Rubrica OK | MATTEO | APPROVATA | manual-qa | stesso R1 |
| A10-D10 | 20-06-26 | UI-UX | Card categoria: fuori chiude, ingr. no | MATTEO | ORIGINATA | prenota-card | `20-06-26/Report-fix-card-categoria-centratura-personalizza-form-20-06-26.md` §12 R1 |
| A10-D11 | 20-06-26 | UI-UX | Centratura Personalizza form + FU-055 | MATTEO | ORIGINATA | scroll-center | stesso R1 |
| A10-D12 | 20-06-26 | UI-UX | Triplo feedback errori Pagina Prenota | MATTEO | ORIGINATA | error-feedback | `20-06-26/Report-feedback-errori-triplo-prenota-20-06-26.md` §10 R1 |
| A10-D13 | 20-06-26 | TESTING | QA triplo errori live in PROD | MATTEO | APPROVATA | prod-qa | stesso §9 |
| A10-D14 | 21-06-26 | UI-UX | Mobile/tablet: solo Lista e Mese | MATTEO | ORIGINATA | calendar-responsive | `21-06-26/Report-calendario-viste-responsive-release-21-06-26.md` §11 R1 |
| A10-D15 | 21-06-26 | UI-UX | Da mobile fallback automatico a Mese | MATTEO | ORIGINATA | calendar-responsive | stesso R1 |
| A10-D16 | 21-06-26 | TESTING | Skip smoke; QA post-release | MATTEO | DELEGATA | qa-defer | stesso R1 |
| A10-D17 | 21-06-26 | PROCESSO | Commit push merge release PrenotaZen | MATTEO | APPROVATA | release-gate | stesso R1 |
| A10-D18 | 21-06-26 | PRODOTTO | Ordine canonico categorie magazzino | MATTEO | ORIGINATA | menu-sort-order | `21-06-26/Report-ordine-categorie-e-salva-qr-21-06-26.md` §11 R1 |
| A10-D19 | 21-06-26 | UI-UX | Salva QR sempre cliccabile + errori | MATTEO | ORIGINATA | qr-save-ux | stesso R1 |
| A10-D20 | 21-06-26 | UI-UX | Riordino: frecce in panoramica Menu | MATTEO | SCELTA | menu-sort-ux | stesso R1 |
| A10-D21 | 21-06-26 | AI-METODO | Plan da agente; poi revisione | MATTEO | DELEGATA | prepara-plan | stesso R1 |
| A10-D22 | 21-06-26 | CONFLITTI | Dettaglio prenotazione ancora disallineato | MATTEO | CORRETTIVA | consumer-verify | stesso R1 |
| A10-D23 | 21-06-26 | PROCESSO | Split chat per crediti Anthropic | MATTEO | ORIGINATA | credit-split | stesso R1 |
| A10-D24 | 21-06-26 | UI-UX | 4 fix mobile admin (nav/modal/order) | MATTEO | ORIGINATA | mobile-admin | `21-06-26/Report-4fix-mobile-admin.md` §11 R1 |
| A10-D25 | 21-06-26 | UI-UX | Footer modal: 100dvh; ordine DOM | MATTEO | CORRETTIVA | mobile-viewport | stesso §13 |
| A10-D26 | 21-06-26 | UI-UX | Batch fix UX admin 1–6 | MATTEO | ORIGINATA | admin-ux-batch | `21-06-26/Report-fix-ux-admin-prenotazioni-1-6-21-06-26.md` §11 R1 |
| A10-D27 | 21-06-26 | PROCESSO | Prosegui su main dopo blocco | MATTEO | CORRETTIVA | orchestration | stesso R1 |
| A10-D28 | 21-06-26 | UI-UX | Drawer: colonne Cliente/Evento + promo | MATTEO | ORIGINATA | booking-details | `21-06-26/Report-fix-dettagli-prenotazione-21-06-26.md` §11 R1 |
| A10-D29 | 21-06-26 | UI-UX | Tab Menu vista già aperta | MATTEO | ORIGINATA | booking-details | stesso R1 |
| A10-D30 | 21-06-26 | PRODOTTO | Fix 7: menu edit admin non cliente | MATTEO | DELEGATA | menu-admin-edit | `21-06-26/Report-fix-7-booking-details-modal-menu-admin-21-06-26.md` §11 R1 |
| A10-D31 | 21-06-26 | UI-UX | Archivio: dedup + solo richieste/appunti | MATTEO | CORRETTIVA | archive-dedup | `21-06-26/Report-archivio-appunti-release-21-06-26.md` §11 R1 |
| A10-D32 | 21-06-26 | SICUREZZA | Applica `admin_notes` su PROD | MATTEO | APPROVATA | prod-migration | stesso R1 |
| A10-D33 | 22-06-26 | IMPOSTAZIONI | Rimuovere `rotation` dal tipo UI | MATTEO | ORIGINATA | product-scoping | `22-06-26/S0_ORCHESTRATOR_HANDOFF.md` |
| A10-D34 | 22-06-26 | UI-UX | Tenere `display_order` sale manuale | MATTEO | SCELTA | settings-ux | stesso |
| A10-D35 | 22-06-26 | SICUREZZA | Deploy Edge create-booking PROD v21 | MATTEO | APPROVATA | env-safety | `22-06-26/S0_HANDOFF.md` GATE PROD |
| A10-D36 | 22-06-26 | FLUSSO | Durata vive sulla card (+ eredità) | MATTEO | SCELTA | booking-duration | `22-06-26/SERVIZIO_BASELINE_MAP.md` B3 |
| A10-D37 | 23-06-26 | IMPOSTAZIONI | Durata clamp 30–360; picker + Altro | MATTEO | SCELTA | booking-duration | `23-06-26/S1_PLAN.md` §6bis Q-S1-1 |
| A10-D38 | 23-06-26 | UI-UX | Tipologia: `default_duration` in Personalizza | MATTEO | SCELTA | form-config | stesso Q-S1-2 |
| A10-D39 | 23-06-26 | PROCESSO | Preset: tipo+parser, **no UI Menu** | MATTEO | SCELTA | area-lock | stesso Q-S1-3 |
| A10-D40 | 23-06-26 | PRODOTTO | Durata anche su carosello, opzionale | MATTEO | ORIGINATA | form-config | stesso M-S1-A |
| A10-D41 | 23-06-26 | UI-UX | No avviso card&lt;tipologia in S1 | MATTEO | APPROVATA | product-scoping | stesso Q-S1-4 |
| A10-D42 | 23-06-26 | FLUSSO | Default ristorante: solo console vendita | MATTEO | SCELTA | console-ops | `23-06-26/S2_PLAN.md` §6bis Q-S2-3 |
| A10-D43 | 23-06-26 | PROCESSO | Edge duration = S3; S2 solo resolver | MATTEO | APPROVATA | release-sequencing | stesso Q-S2-4 |
| A10-D44 | 23-06-26 | IMPOSTAZIONI | `turnover_buffer` NOT NULL DEFAULT 0 | MATTEO | SCELTA | schema-design | stesso Q-S2-5 |
| A10-D45 | 23-06-26 | FLUSSO | Client invia `duration_minutes`; Edge valida | MATTEO | SCELTA | edge-contract | stesso Q-S2-7; `S3_PLAN` Q-S3-6 |
| A10-D46 | 23-06-26 | VENDITA | Classic: manopole fini solo da console | MATTEO | ORIGINATA | edition-console | `23-06-26/S3_PLAN.md` §6bis |
| A10-D47 | 23-06-26 | IMPOSTAZIONI | `arrival_step` per-fascia; UI solo Pro | MATTEO | SCELTA | edition-ux | stesso Q-S3-1 |
| A10-D48 | 23-06-26 | IMPOSTAZIONI | Toggle tardivo **solo console** | MATTEO | ORIGINATA | console-ops | stesso Q-S3-3 |
| A10-D49 | 23-06-26 | FLUSSO | Degrado: TimePicker libero se no fasce | MATTEO | SCELTA | backward-compat | stesso Q-S3-4 |
| A10-D50 | 23-06-26 | UI-UX | Reset orario se card rende invalido | MATTEO | SCELTA | form-ux | stesso Q-S3-5 |
| A10-D51 | 23-06-26 | FLUSSO | Capacity RPC gated da `slot_limit_enabled` | MATTEO | SCELTA | capacity-rules | stesso Q-S3-8 |
| A10-D52 | 23-06-26 | PROCESSO | `occupancy_*` rimandato a S4 | MATTEO | SCELTA | area-lock | stesso Q-S3-9 |
| A10-D53 | 23-06-26 | SICUREZZA | Rollout PROD S3 + merge main | MATTEO | APPROVATA | env-safety | `23-06-26/Report-S3-rollout-prod-prenotazen-23-06-26.md` Q1 |
| A10-D54 | 23-06-26 | PROCESSO | Edge + PrenotaZen insieme | MATTEO | SCELTA | release-sequencing | stesso Q1 |
| A10-D56 | 23-06-26 | AI-METODO | Fix MCP: punta a Trade Analyst | MATTEO | ORIGINATA | tooling-hygiene | stesso Q1 |
| A10-D57 | 24-06-26 | PRODOTTO | D44 forma tavolo fissa = quadrato | MATTEO | SCELTA | product-scoping | `24-06-26/Report-intervista-S4-24-06-26.md` §2 / Q1 |
| A10-D58 | 24-06-26 | FLUSSO | D45 walk-in senza tavolo = bug | MATTEO | CORRETTIVA | walk-in | stesso Q1 |
| A10-D59 | 24-06-26 | FLUSSO | D46 capienza = somma coperti tavoli | MATTEO | ORIGINATA | capacity-rules | stesso Q1 |
| A10-D60 | 24-06-26 | VENDITA | D47 default walk-in da console | MATTEO | ORIGINATA | console-ops | stesso Q1 |
| A10-D61 | 24-06-26 | FLUSSO | D48 checkout sempre append-only | MATTEO | SCELTA | data-integrity | stesso Q1 |
| A10-D62 | 24-06-26 | PRODOTTO | D49 predicato modalità-tavoli Pro+≥1 | MATTEO | SCELTA | feature-gating | stesso Q1 |
| A10-D63 | 24-06-26 | FLUSSO | D50 soft-delete sala + conferma se viva | CONGIUNTA | DELEGATA | soft-delete | stesso Q1 |
| A10-D64 | 24-06-26 | VENDITA | D51 retention legata ad Analytics | MATTEO | ORIGINATA | monetization-data | stesso Q1 |
| A10-D65 | 24-06-26 | UI-UX | D52 briefing Sala·Tavolo se multi-sala | MATTEO | SCELTA | briefing-ux | stesso Q1 |
| A10-D66 | 24-06-26 | VENDITA | No freno GTM «10–15 Classic» | MATTEO | CORRETTIVA | go-to-market | stesso §2 / Q1 |
| A10-D67 | 24-06-26 | AI-METODO | 2 orchestratori; muro = main/PROD | MATTEO | ORIGINATA | multi-agent-ops | stesso Q1 |
| A10-D68 | 24-06-26 | AI-METODO | Intervista subito IO + orchestratore | MATTEO | ORIGINATA | interview-first | stesso §1 / Q1 |
| A10-D69 | 25-06-26 | FLUSSO | Forzatura walk-in/tavolo occupato | MATTEO | CORRETTIVA | walk-in | `24-06-26/Report-revisione-integrazione-S4-24-06-26.md` §9-quater |
| A10-D70 | 25-06-26 | IMPOSTAZIONI | D38 toggle cap fascia default OFF | MATTEO | SCELTA | capacity-rules | `24-06-26/S4_FIX_PLAN.md` decisioni A0 |
| A10-D71 | 25-06-26 | UI-UX | Nome tavolo univoco tenant | MATTEO | SCELTA | servizio-ux | stesso; checklist §10 |
| A11-D01 | 02-08-26 | PROCESSO | Documento ripresa: no ricostruire da zero | INCERTO | DELEGATA | process-continuity | `02-08-26/STATO_APP_E_MANDATO_FABLE.md` cappello |
| A11-D02 | 02-08-26 | PRODOTTO | Capienza pubblica/D38 dopo collaudo | MATTEO | SCELTA | product-scoping | `E2E-Report/SINTESI.md` §7; `HANDOFF_S4_SENIOR.md` §3 |
| A11-D03 | 02-08-26 | PRODOTTO | Badge % Calendario = tutto il locale | MATTEO | SCELTA | product-scoping | `SINTESI.md` §7 |
| A11-D04 + M3-D38 | 02-08-26 | PRODOTTO | Walk-in: sala+tavolo obbligatori (ritira solo-coperti) | MATTEO | CORRETTIVA | product-scoping | `SINTESI.md` §7 |
| A11-D05 | 02-08-26 | PRODOTTO | Badge Classic senza limite = ok | MATTEO | APPROVATA | product-scoping | `SINTESI.md` §7 |
| A11-D06 | 02-08-26 | PRODOTTO | Sostituzione tavolo: 3 scelte, prima sposta seduti | MATTEO | ORIGINATA | product-scoping | `Piano-fix5-fix6-servizio-02-08-26.md` §3; HANDOFF §3 |
| A11-D07 + I1-D06 | 02-08-26 | PRODOTTO | Sposta/attesa non brucia turno | MATTEO | ORIGINATA | product-scoping | stesso §3 |
| A11-D08 | 02-08-26 | PRODOTTO | Fasce accavallate = difetto da bloccare | MATTEO | APPROVATA | product-scoping | stesso §4-bis |
| A11-D09 | 02-08-26 | TESTING | Collaudo e2e S4 a quattro corsie parallele | INCERTO | DELEGATA | multi-agent-e2e | `E2E-Report/README.md`; `SINTESI.md` |
| A11-D10 | 02-08-26 | AI-METODO | Commit solo lavoro proprio (migrazioni) | MATTEO | ORIGINATA | git-hygiene | `Report-allineamento-migrazioni-…` Q1 |
| A11-D11 | 02-08-26 | AI-METODO | Solo report+commit, non protocollo pieno | MATTEO | CORRETTIVA | session-scope | `Report-fix5-fix6-servizio-02-08-26.md` Q1/Q5 |
| A11-D12 | 02-08-26 | SICUREZZA | Muro PROD / migrazioni+Edge+client insieme | INCERTO | APPROVATA | env-safety | `STATO_APP` §2; HANDOFF §6 |
| A11-D13 | 03-08-26 | UI-UX | 7 fix Servizio UI ok a video | MATTEO | APPROVATA | ui-acceptance | `Report-7fix-servizio-ui-03-08-26.md` §4 |
| A11-D14 | 03-08-26 | AI-METODO | Cantiere: tutte e 3 le wave (non una) | MATTEO | SCELTA | ai-orchestration | `Report-cantiere-tavoli-…` Q1 |
| A11-D15 | 03-08-26 | TESTING | Checklist «SOLO io» vs checklist e2e agenti | MATTEO | ORIGINATA | test-strategy | `Report-audit-allineamento-…` §8 Q1 |
| A11-D16 | 03-08-26 | PRODOTTO | D-A: elimina tavolo occupato = avvisa come sala | MATTEO | SCELTA | product-scoping | stesso §8 |
| A11-D17 | 03-08-26 | PRODOTTO | D-B: spostare non brucia turno mai | MATTEO | SCELTA | product-scoping | stesso §8 |
| A11-D18 | 03-08-26 | PRODOTTO | D-C: logiche fasce ok, allineare controlli | MATTEO | APPROVATA | product-scoping | stesso §8 |
| A11-D19 | 03-08-26 | PRODOTTO | D-D: conferma persistita + richiamo | MATTEO | SCELTA | product-scoping | stesso §8; HANDOFF §3-ter |
| A11-D20 | 03-08-26 | AI-METODO | Piano senior: test e2e + salute codice | MATTEO | ORIGINATA | ai-orchestration | stesso §8 |
| A11-D21 | 03-08-26 | PRODOTTO | D48 giugno vs D-B: vince «non brucia» (DELETE) | CONGIUNTA | CORRETTIVA | conflict-resolution | `Report-fase0-quattro-fix-03-08-26.md` FIX A |
| A11-D22 | 03-08-26 | TESTING | Fase 0: 4 fix strutturali prima dei test nuovi | INCERTO | DELEGATA | test-first-repair | `PIANO_SENIOR_TEST_E_SALUTE_CODICE.md`; `PROMPT_FASE0_…` |
| A11-D23 | 04-08-26 | TESTING | Rivesti locale prova (non QA 375) | MATTEO | DELEGATA | test-strategy | `Report-fase1-base-test-04-08-26.md` Q1 |
| A11-D24 | 04-08-26 | SICUREZZA | Correggi credenziali `.env.local.test` | MATTEO | APPROVATA | env-safety | stesso Q1 |
| A11-D25 | 04-08-26 | TESTING | Collaudo video Fase 0 rimandato | MATTEO | SCELTA | manual-qa-gate | stesso Q1; `PIANO_SENIOR` §8 |
| A11-D26 | 04-08-26 | PRODOTTO | Sotto-tipologia singola «a card» = difetto | MATTEO | APPROVATA | product-scoping | stesso aggiornamento §6 |
| A11-D27 | 04-08-26 | AI-METODO | Commit locali, niente push | MATTEO | ORIGINATA | git-hygiene | stesso §7 |
| A11-D28 | 04-08-26 | IMPOSTAZIONI | Intervallo richiamo avviso = 30' | MATTEO | APPROVATA | settings-tuning | `PIANO_SENIOR` §7 |
| A11-D29 | 05-08-26 | SICUREZZA | Applica fix scarto orario RPC 071 solo TEST | MATTEO | SCELTA | env-safety | `Report-fase2-righe-12-13-05-08-26.md` §1/§5 |
| A11-D30 | 05-08-26 | TESTING | Parallelismo Playwright → workers:1 | INCERTO | DELEGATA | test-strategy | `Report-rossi-parallelismo-mezzanotte-…` §1/§3 |
| A11-D31 | 05-08-26 | COMPLIANCE | Allinea docs legali email/Brevo al fatto | MATTEO | ORIGINATA | compliance-docs | stesso Q1 |
| A11-D32 | 05-08-26 | SICUREZZA | Logout: ≥1–2 tentativi recovery | MATTEO | ORIGINATA | auth-resilience | stesso Q1 |
| A11-D33 | 05-08-26 | PROCESSO | Eliminare codice morto | MATTEO | ORIGINATA | code-hygiene | stesso Q1 |
| A11-D34 | 05-08-26 | AI-METODO | Quattro lavori (loop/logout/legale/morto) + commit | MATTEO | ORIGINATA | ai-orchestration | stesso Q1; `PROMPT_FIX_LOOP_…` |
| A11-D35 | 05-08-26 | TESTING | «Verde da solo NON assolve» → regola Testing | CONGIUNTA | CORRETTIVA | test-strategy | `Report-rossi` § skill; `_skill-system-v0` prop. |
| A11-D36 | 06-08-26 | PROCESSO | Chiudere capitolo Servizio come product manager | MATTEO | ORIGINATA | product-management | `Report-finale-chiusura-capitolo-servizio-06-08-26.md` §6 |
| A11-D37 | 06-08-26 | TESTING | Batteria completa e2e prima della chiusura | MATTEO | ORIGINATA | test-strategy | stesso §6 |
| A11-D39 | 06-08-26 | TESTING | Baseline e2e **118/118** su server 4173 | AGENTE | DELEGATA | test-strategy | Retrospettiva §8; Report-finale §4 |
| A11-D40 | 06-08-26 | TESTING | Isolare server E2E (no riuso 5173 di Matteo) | AGENTE | CORRETTIVA | test-infra | Report-finale §2 |
| A11-D41 | 06-08-26 | TESTING | Collaudo umano: solo cose «per forza» | MATTEO | ORIGINATA | test-strategy | `Report-collaudo-filtrato-…` Q1 |
| A11-D42 | 06-08-26 | TESTING | Formato prove: A click / B atteso / C altro | MATTEO | ORIGINATA | test-strategy | stesso Q1 |
| A11-D43 + M3-D42 | 06-08-26 | TESTING | Taglio 62→16 via gap-analysis vs suite | CONGIUNTA | SCELTA | test-strategy | `COLLAUDO_MANUALE_OBBLIGATORIO.md` cappello; Report-collaudo §1 |
| A11-D44 | 06-08-26 | AI-METODO | Piano multi-agente con prompt P1–P7 integrati | MATTEO | ORIGINATA | ai-orchestration | Report-collaudo Q1 |
| A11-D45 | 06-08-26 | PRODOTTO | D-1: primo cantiere = atomicità scritture | MATTEO | SCELTA | prioritization | `PIANO_MULTIAGENT_LAVORI_APERTI.md` §1 |
| A11-D46 | 06-08-26 | PRODOTTO | D-2: solo 2 percorsi atomici (sostituzione + Menu QR) | MATTEO | SCELTA | risk-scoping | stesso §1 |
| A11-D47 | 06-08-26 | SICUREZZA | D-3: rollout PROD solo dopo collaudo verde | MATTEO | SCELTA | release-gating | stesso §1 |
| A11-D48 | 06-08-26 | IMPOSTAZIONI | D-4: conferma 15'/0'/90' + manopole in console | MATTEO | SCELTA | settings-ops | stesso §1; Report-collaudo Q1 |
| A11-D50 | 06-08-26 | PRODOTTO | D-6: badge cascata posti fisici / fasce / nessuno | MATTEO | ORIGINATA | product-scoping | Report-collaudo §5.4 Q1 |
| A11-D51 | 06-08-26 | UI-UX | D-7: PDF colonna Tavolo + nomi + 14 link | MATTEO | SCELTA | polish-debt | piano §1 |
| A11-D52 | 06-08-26 | LEGALE | D-8: prepara fascicolo Brevo per professionista | MATTEO | SCELTA | compliance-docs | piano §1 |
| A11-D53 | 06-08-26 | IMPOSTAZIONI | Interruttore esplicito `service_layout_confirmed` | CONGIUNTA | CORRETTIVA | product-scoping | piano §1 Nota D-6 |
| A11-D54 | 06-08-26 | AI-METODO | Aggiungere ondate M2/M3/M4 (147 file skill) | MATTEO | SCELTA | meta-investigation | `Report-p0-indagine-…06-08-26.md` §2 |
| A11-D55 | 06-08-26 | PROCESSO | Atomicità: 8 percorsi non 7 (correzione conteggio) | AGENTE | CORRETTIVA | evidence-discipline | Report-finale §2/§9 |
| A2-D01 | 27-05-26 | SICUREZZA | Max sicurezza prima di query PROD | MATTEO | ORIGINATA | env-safety | `27-05-26/Report-query-produzione-rls-27-05-26.md` § Domande |
| A2-D02 | 27-05-26 | SICUREZZA | Vista pubblica `security_invoker` | AGENTE | SCELTA | rls-harden | stesso § Cosa fatto |
| A2-D03 | 27-05-26 | PROCESSO | Delete tenant solo se email+slug | AGENTE | ORIGINATA | tenant-safety | `27-05-26/query da aggiornare.md` § Seconda query |
| A2-D04 | 27-05-26 | PROCESSO | Commit/push solo dopo prova Matteo | CONGIUNTA | APPROVATA | chiusura-gate | `Report-query-produzione-rls` § Cosa resta |
| A2-D05 | 27-05-26 | UI-UX | Fix responsive solo dopo approvazione | MATTEO | APPROVATA | scope-lock | `Report-revisione-strutturale-fix-27-05-26.md` § Cosa ho fatto |
| A2-D06 | 27-05-26 | UI-UX | Striscia mobile 20vw: non toccare | MATTEO | CORRETTIVA | strip-mobile-keep | stesso § Cosa NON |
| A2-D07 | 27-05-26 | PRODOTTO | Eccezioni riepilogo solo carosello+card | MATTEO | ORIGINATA | summary-exceptions | `Report-prenota-v2-riepilogo-prezzi-carosello-card-27-05-26.md` § Domande |
| A2-D08 | 27-05-26 | FLUSSO | Prezzo card = live preset, override vince | MATTEO | ORIGINATA | card-price-live | stesso § Domande |
| A2-D09 | 27-05-26 | PRODOTTO | Prezzo carosello × ospiti in riepilogo | MATTEO | CORRETTIVA | carousel-price | stesso §1 |
| A2-D10 | 27-05-26 | PRODOTTO | Prezzo carosello nascosto in riepilogo | AGENTE | SCELTA | carousel-price | `Report-carosello-admin-ui-27-05-26.md` §5 |
| A2-D11 | 27-05-26 | UI-UX | Footer Orari/Contatti full-width | AGENTE | CORRETTIVA | footer-layout | `Report-footer-striscia-foto-layout-27-05-26.md` §2 |
| A2-D12 | 28-05-26 | UI-UX | Update PWA solo al riavvio | MATTEO | SCELTA | pwa-update-ux | `28-05-26/Report-pwa-update-strategy-sessione-28-05-26.md` §Analisi |
| A2-D13 | 28-05-26 | PRODOTTO | Stessa PWA per tutta l’app (anche QR) | MATTEO | ORIGINATA | pwa-scope-all-app | stesso Q2 |
| A2-D14 | 28-05-26 | IMPOSTAZIONI | Build visibile: commit+data | MATTEO | APPROVATA | build-versioning | stesso Q3 |
| A2-D15 | 28-05-26 | AI-METODO | Domande mirate prima del plan | MATTEO | ORIGINATA | ask-before-plan | stesso §Prompt |
| A2-D16 | 28-05-26 | AI-METODO | Plan → Sonnet esegue → revisione critica | MATTEO | ORIGINATA | multi-agent-review | stesso §Prompt |
| A2-D17 + M4-D57 | 28-05-26 | CONFLITTI | `registerType: 'prompt'` non `autoUpdate` | AGENTE | CORRETTIVA | pwa-sw-config | stesso §Difetto |
| A2-D18 | 28-05-26 | AI-METODO | Skill comunicazione costruita (taratura = 29) | AGENTE | DELEGATA | comm-skill-system | stesso PARTE 2 |
| A2-D19 | 28-05-26 | IMPOSTAZIONI | Toggle offerta carosello in riepilogo | MATTEO | ORIGINATA | carousel-summary-toggle | `Report-carosello-riepilogo-toggle-offerta-28-05-26.md` §Cosa vede Mario |
| A2-D20 | 28-05-26 | PROCESSO | Feature accettata + skill close a posteriori | MATTEO | CORRETTIVA | skill-close-checklist | `Report-carosello-riepilogo-toggle-finale-28-05-26.md` |
| A2-D21 | 28-05-26 | SICUREZZA | Dati inseriti in TEST, Vercel legge PROD | CONGIUNTA | SCELTA | env-test-vs-prod | `Report-tiramisù-removal-db-migration-28-05-26.md` §1 |
| A2-D22 | 28-05-26 | UI-UX | Sfondo striscia crema `#faf7f1` | MATTEO | SCELTA | prenota-strip-bg | `Report-sessione-completa-28-05-26.md` §Domande |
| A2-D23 | 28-05-26 | UI-UX | Striscia 20vw anche mobile/tablet | MATTEO | SCELTA | strip-all-breakpoints | stesso |
| A2-D24 | 28-05-26 | UI-UX | Preset striscia: 3 foto «seconda prova» | MATTEO | SCELTA | asset-preset-count | stesso |
| A2-D25 | 28-05-26 | UI-UX | Header Prenota: textAlign left/center/right | MATTEO | ORIGINATA | header-text-align | `Report-header-allineamento-data-footer-28-05-26-C.md` §1 |
| A2-D26 | 28-05-26 | AI-METODO | LOCK BookingRequestPage protocollo 3 step | AGENTE | ORIGINATA | lock-booking-page | stesso §7 |
| A2-D27 | 29-05-26 | AI-METODO | Feedback errori in report fine lavoro | MATTEO | ORIGINATA | errori-processo | `29-05-26/prossimo prompt system migliorato.md` |
| A2-D28 | 29-05-26 | AI-METODO | Due agenti ask mode prima di decidere | MATTEO | ORIGINATA | prepara-dual-ask | stesso |
| A2-D29 | 29-05-26 | AI-METODO | «lavoro ok» → Liv.1 vocabolario | CONGIUNTA | APPROVATA | vocabolario | `Report-meta-miglioria-skill-system-29-05-26.md` § Decisioni |
| A2-D30 | 29-05-26 | AI-METODO | Finestra conferma → Modal Liv.1 | CONGIUNTA | APPROVATA | vocabolario | stesso |
| A2-D31 | 29-05-26 | AI-METODO | Overlay checklist fissa scartata | MATTEO | SCELTA | prepara-scope | stesso |
| A2-D32 | 29-05-26 | AI-METODO | Sintesi feedback = Meta comunicazione | MATTEO | ORIGINATA | meta-vs-exec | stesso |
| A2-D33 | 29-05-26 | AI-METODO | Segnala conflitti prompt, no timeline | MATTEO | CORRETTIVA | prepara-scope | stesso |
| A2-D34 + M1-D33 | 29-05-26 | AI-METODO | Modalità light/standard/deep | MATTEO | ORIGINATA | session-weight | `Report-modalita-light-standard-deep-29-05-26.md` |
| A2-D35 | 29-05-26 | AI-METODO | Prepara classifica; esecutore solo alza | CONGIUNTA | APPROVATA | session-weight | stesso § Decisioni |
| A2-D36 | 29-05-26 | AI-METODO | Nessuna parola-trigger modalità | MATTEO | SCELTA | session-weight | stesso |
| A2-D37 | 29-05-26 | AI-METODO | EVOLUZIONE junior annota / senior sviluppa | MATTEO | ORIGINATA | evoluzione-skills | stesso |
| A2-D38 | 29-05-26 | AI-METODO | Vocabolario unico, no file codice separato | MATTEO | SCELTA | vocabolario | `Report-skill-system-template-e-snellimento-app-context-29-05-26.md` |
| A2-D39 | 29-05-26 | AI-METODO | Anti-doppioni: consolidare file skill | CONGIUNTA | CORRETTIVA | skill-hygiene | stesso |
| A2-D40 | 29-05-26 | AI-METODO | Vocabolario solo sicuro, no junk | MATTEO | ORIGINATA | vocabolario | `Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md` |
| A2-D41 + M1-D10 | 29-05-26 | AI-METODO | Prepara = solo prompt, no codice | MATTEO | ORIGINATA | prepara-prompt | stesso |
| A2-D42 | 29-05-26 | UI-UX | Overlay card ingredienti intenzionale | MATTEO | CORRETTIVA | prenota-overlay | `Report-finale-ciclo-prepara-prompt-card-ingredienti-29-05-26.md` |
| A2-D43 | 29-05-26 | UI-UX | Overlay larghezza = shell card | MATTEO | CORRETTIVA | prenota-overlay | stesso / `Report-prenota-card-ingredienti-scroll-overlay` |
| A2-D44 | 29-05-26 | UI-UX | Cap 3 ingredienti poi scroll | MATTEO | ORIGINATA | prenota-card-scroll | `Report-finale-ciclo-prepara-prompt-card-ingredienti` |
| A2-D47 | 29-05-26 | UI-UX | Copy = solo delta esplicito | MATTEO | CORRETTIVA | copy-delta-only | stesso |
| A2-D49 | 29-05-26 | UI-UX | Modal = base comunicazioni admin | MATTEO | APPROVATA | modal-pattern | `Report-fix-menu-qr-fase3-29-05-26.md` |
| A2-D50 | 29-05-26 | AI-METODO | Checklist QA senza path URL tecnici | MATTEO | CORRETTIVA | qa-schermata-effetto | stesso |
| A2-D53 | 29-05-26 | PRODOTTO | Promo da Tab Menu → Personalizza form | CONGIUNTA | ORIGINATA | menu-zone-split | `Report-promo-personalizza-form-29-05-26.md` |
| A2-D54 | 29-05-26 | PRODOTTO | Digest prezzo: totali DB vincono | AGENTE | SCELTA | pricing-db-wins | `Report-fix-menu-pricing-digest-29-05-26.md` |
| A2-D55 | 30-05-26 | PRODOTTO | Preset/tab eventi Menu QR non ora | MATTEO | SCELTA | product-scoping | `Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md` § Decisioni |
| A2-D56 | 30-05-26 | PRODOTTO | Header QR = Anagrafica `restaurant_name` | MATTEO | SCELTA | qr-header-source | stesso § Decisioni #3 |
| A2-D57 | 30-05-26 | UI-UX | Avviso post-Salva QR = dialog in-app | MATTEO | SCELTA | modal-pattern | stesso § Decisioni #2 |
| A2-D58 | 30-05-26 | TESTING | QA admin modale QR: Matteo fa lui | MATTEO | ORIGINATA | owner-qa | stesso § Decisioni #5 |
| A2-D59 | 30-05-26 | UI-UX | Label carosello QR + Modal cestino slide | MATTEO | ORIGINATA | qr-carousel-ux | stesso § Fix test manuale |
| A2-D60 | 29-05-26 | UI-UX | Palette testo: bianco solo full-page | MATTEO | APPROVATA | prenota-palette | `Report-validazione-ux-prenota-29-05-26.md` §Fix palette |
| A2-D61 | 29-05-26 | UI-UX | No prefill «Card scorrevole» + placeholder | MATTEO | ORIGINATA | card-label-empty | `Report-card-scorrevole-titolo-admin-29-05-26.md` §Brief |
| A2-D62 | 28-05-26 | PRODOTTO | Tiramisù = ingrediente normale (no kg) | MATTEO | ORIGINATA | product-simplify | `Report-tiramisù-removal-db-migration-28-05-26.md` §5 |
| A2-D63 | 28-05-26 | SICUREZZA | `docs/_lavoro/` resta gitignored | MATTEO | APPROVATA | privacy-docs | `Report-pwa-update-strategy-sessione-28-05-26.md` § privacy |
| A2-D64 | 29-05-26 | UI-UX | Breakpoint descrizioni mode/card → 700px | MATTEO | CORRETTIVA | responsive-breakpoint | `Report-mappatura-impostazioni-prenota-29-05-26.md` § Difficoltà |
| A2-D65 | 29-05-26 | UI-UX | Validazione Prenota: `noValidate` + pulse | CONGIUNTA | APPROVATA | form-validation-ux | `Report-validazione-ux-prenota-29-05-26.md` §QA |
| A3-D01 | 30-05-26 | PROCESSO | Due prompt: admin e pubblico | MATTEO | ORIGINATA | prepara-split | `30-05-26/Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md` § Decisioni Matteo D1 |
| A3-D02 | 30-05-26 | UI-UX | Card verticali ≤700px stile Prenota | MATTEO | ORIGINATA | qr-card-layout | stesso D2 |
| A3-D03 | 30-05-26 | PRODOTTO | Icona categoria per singolo QR | MATTEO | ORIGINATA | qr-per-code-icon | stesso D3 |
| A3-D04 | 30-05-26 | FLUSSO | Guard chiusura solo QR + Categorie | MATTEO | ORIGINATA | guard-scope | stesso D4 |
| A3-D05 | 30-05-26 | UI-UX | Carosello: placeholder, no prefill | MATTEO | ORIGINATA | carousel-placeholder | stesso D6 |
| A3-D06 + M1-D50 | 30-05-26 | AI-METODO | «annota/suggerisci» ≠ riformare skill | MATTEO | ORIGINATA | annota-vs-codifica | stesso § Regole / Deviazione |
| A3-D07 | 30-05-26 | AI-METODO | Checklist 3 col, linguaggio semplice | MATTEO | CORRETTIVA | qa-schermata-effetto | stesso § Frasi |
| A3-D08 | 30-05-26 | AI-METODO | Checklist troppo lunga / no gergo | MATTEO | CORRETTIVA | prepara-brevity | stesso § Frasi |
| A3-D09 | 30-05-26 | CONFLITTI | #8 checklist: sintomo su Prenota non QR | MATTEO | CORRETTIVA | area-disambiguation | stesso § QA #8 |
| A3-D10 | 30-05-26 | UI-UX | Solo 2 PNG per idea tema | MATTEO | CORRETTIVA | scope-lock | `30-05-26/Report-prepara-prompt-temi-sfondo-menu-qr-30-05-26.md` |
| A3-D12 | 30-05-26 | UI-UX | Batch 1 asset temi non accettato | MATTEO | CORRETTIVA | asset-qa | stesso § Cronologia/Frasi |
| A3-D13 | 30-05-26 | PRODOTTO | Quinto tema Green Wellness | MATTEO | ORIGINATA | qr-themes | stesso § Cronologia |
| A3-D14 | 30-05-26 | PROCESSO | Merge/push main e env/test | MATTEO | DELEGATA | git-workflow | stesso § Frasi |
| A3-D15 | 30-05-26 | AI-METODO | Prompt loop: solo modifica / subito | MATTEO | CORRETTIVA | prepara-scope | `30-05-26/Report-fix-loop-modifica-menu-qr-30-05-26.md` |
| A3-D16 | 30-05-26 | AI-METODO | Ridammi prompt completo + Nota Matteo | MATTEO | CORRETTIVA | prepara-full-block | stesso |
| A3-D17 | 30-05-26 | PROCESSO | Revisiona + report + comunicazione | MATTEO | ORIGINATA | session-close | stesso § Cronologia |
| A3-D18 | 30-05-26 | TESTING | Loop Modifica QR: console OK | MATTEO | APPROVATA | qa-human | stesso § QA |
| A3-D19 | 30-05-26 | AI-METODO | Tenere §3 handoff; Meta ratifica | CONGIUNTA | APPROVATA | meta-ratify | `Report-prepara-prompt-ciclo-menu-qr-fix` § Deviazione |
| A3-D20 | 31-05-26 | AI-METODO | Mappare grilletti per ogni tipo chat | MATTEO | ORIGINATA | grilletti-map | `31-05-26/Report-revisione-senior-skill-system-31-05-26.md` § Cronologia #2 |
| A3-D21 | 31-05-26 | AI-METODO | «evolvi» senza «senior» → chiedere | MATTEO | ORIGINATA | trust-levels | stesso § Cronologia #3 |
| A3-D22 | 31-05-26 | AI-METODO | Salva memoria + commit + analisi senior | MATTEO | ORIGINATA | meta-senior | stesso § Cronologia #4 |
| A3-D23 | 31-05-26 | AI-METODO | Triage 9 proposte; pausa-raccolta vera | MATTEO | SCELTA | proposte-triage | stesso § Cronologia #5–6 |
| A3-D24 | 31-05-26 | AI-METODO | Tono: onesto critico esigente | MATTEO | ORIGINATA | meta-tone | stesso § Dati comunicazione |
| A3-D27 | 31-05-26 | CONFLITTI | Fix #8 era su schermata sbagliata | MATTEO | CORRETTIVA | area-disambiguation | `31-05-26/Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md` Trigger |
| A3-D28 | 31-05-26 | PRODOTTO | Preferenza sfondo Menu QR scrollabile | MATTEO | SCELTA | qr-bg-scroll | `31-05-26/Report-fix-menu-qr-footer-scroll-31-05-26.md` |
| A3-D29 | 31-05-26 | PROCESSO | No commit; aggiorna report con dati chat | MATTEO | CORRETTIVA | report-before-commit | `31-05-26/Report-fix-menu-qr-desktop-freeze-31-05-26.md` |
| A3-D30 | 31-05-26 | UI-UX | QR: 2 col da 520px; orizzontali ≥1025 | MATTEO | ORIGINATA | qr-breakpoints | `31-05-26/Report-fix-viewport-menu-responsive-31-05-26.md` |
| A3-D31 | 31-05-26 | UI-UX | Prenota: layout libero = preselezionato | MATTEO | ORIGINATA | prenota-layout-parity | stesso |
| A3-D32 | 31-05-26 | UI-UX | Admin categorie: 2 col da 1050px | MATTEO | ORIGINATA | admin-breakpoints | stesso |
| A3-D33 | 31-05-26 | PRODOTTO | Sfondo Prenota: fixed+cover | MATTEO | SCELTA | prenota-bg-fixed | `31-05-26/Report-finale-ciclo-prenota-sfondo-31-05-26.md` §2 |
| A3-D34 | 31-05-26 | PRODOTTO | Footer Prenota edge-to-edge | MATTEO | ORIGINATA | prenota-footer | stesso §2 |
| A3-D35 | 31-05-26 | PRODOTTO | Tile/gradiente: vietato fixed | MATTEO | ORIGINATA | prenota-tile-scroll | `31-05-26/Report-fix-prenota-footer-scroll-sfondo-31-05-26.md` |
| A3-D36 | 31-05-26 | UI-UX | Annulla header (tentativo padding) | MATTEO | CORRETTIVA | rollback-ui | `31-05-26/Report-prenota-sfondo-fixed-padding-31-05-26.md` |
| A3-D37 | 31-05-26 | TESTING | Full-page mobile Android: fix OK | MATTEO | APPROVATA | qa-human | `31-05-26/Report-fix-prenota-mobile-sfondo-scroll-31-05-26.md` |
| A3-D38 | 31-05-26 | PROCESSO | FU-024/025/027 OK; FU-021 annullare | MATTEO | SCELTA | follow-up-triage | `31-05-26/Report-verifica-prenota-header-personalizza-form-31-05-26.md` |
| A3-D39 | 31-05-26 | AI-METODO | Spiegare FU in linguaggio semplice | MATTEO | CORRETTIVA | plain-language | stesso § Cronologia |
| A3-D40 + M1-D09 | 01-06-26 | AI-METODO | «lavoro ok» = report completo, no commit | MATTEO | CORRETTIVA | session-close-split | `01-06-26/Report-revisione-codice-e-enforcement-cursor-01-06-26.md` § Prompt #7 |
| A3-D41 + M1-D08 | 01-06-26 | AI-METODO | «fai report finale» = check vs codice + push | MATTEO | CORRETTIVA | session-close-split | stesso § Prompt #8 |
| A3-D42 | 01-06-26 | AI-METODO | Comando non riconosciuto → domande | MATTEO | ORIGINATA | vocab-fallback | stesso § Decisioni |
| A3-D43 | 01-06-26 | AI-METODO | Grilletti sempre nel contesto (Rule) | MATTEO | ORIGINATA | cursor-enforcement | stesso § Prompt #6 |
| A3-D44 | 01-06-26 | AI-METODO | Causa dimenticanza report, non pezza | MATTEO | ORIGINATA | soft-vs-enforcement | stesso § Prompt #4 |
| A3-D45 + M1-D51 | 01-06-26 | AI-METODO | Voto sessione al revisore + contraddizioni | MATTEO | ORIGINATA | agent-reliability | stesso § Decisioni / Idee |
| A3-D46 | 01-06-26 | AI-METODO | Capire sistema prima di agire (hook) | MATTEO | ORIGINATA | understand-before-act | stesso § Frasi |
| A3-D47 | 01-06-26 | PROCESSO | § Analisi flusso prompt obbligatoria | MATTEO | ORIGINATA | report-prompt-kpi | `01-06-26/Report-menu-qr-ordine-categorie-01-06-26.md` (+ altri) |
| A3-D48 + M1-D60 | 01-06-26 | PROCESSO | «test fatti tutto ok» ≠ gonfiare report | MATTEO | ORIGINATA | report-discipline | stesso |
| A3-D49 | 01-06-26 | PRODOTTO | Sync rename: solo al Salva; no wipe | MATTEO | ORIGINATA | sync-rename | `01-06-26/Report-sync-rename-categoria-qr-form-01-06-26.md` |
| A3-D51 | 01-06-26 | PRODOTTO | Sync delete al click Elimina | MATTEO | ORIGINATA | sync-delete | `01-06-26/Report-sync-delete-categoria-qr-form-01-06-26.md` |
| A3-D53 | 01-06-26 | PRODOTTO | Default icona → Insalata | MATTEO | ORIGINATA | qr-default-icon | `01-06-26/Report-menu-qr-default-icona-insalata-01-06-26.md` |
| A3-D54 | 01-06-26 | PRODOTTO | Rimuovere Lucide Zuppa e Uova | MATTEO | ORIGINATA | qr-icon-catalog | `01-06-26/Report-follow-up-rimozione-lucide-soup-uova-01-06-26.md` |
| A3-D55 | 01-06-26 | PRODOTTO | 12 Phosphor + griglia icone | MATTEO | ORIGINATA | qr-icon-catalog | `01-06-26/Report-menu-qr-12-icone-categoria-01-06-26.md` |
| A3-D56 | 01-06-26 | UI-UX | Card senza foto mobile 30/70 | MATTEO | ORIGINATA | qr-card-30-70 | `01-06-26/Report-card-categoria-qr-senza-foto-30-70-01-06-26.md` |
| A3-D57 | 01-06-26 | UI-UX | Mix foto: stessa altezza card | MATTEO | ORIGINATA | qr-card-height | `01-06-26/Report-card-categoria-qr-match-altezza-…` |
| A3-D58 | 01-06-26 | UI-UX | FU-025 freeze anche pagina categoria | MATTEO | ORIGINATA | qr-freeze | `01-06-26/Report-fu-025-public-menu-category-page-01-06-26.md` |
| A3-D59 | 01-06-26 | UI-UX | Pill barra: sfondo semi-opaco | MATTEO | ORIGINATA | qr-nav-pill | `01-06-26/Report-ciclo-menu-qr-pill-barra-categorie-01-06-26.md` |
| A3-D60 | 01-06-26 | PRODOTTO | Unificare icone Prenota = Menu QR | MATTEO | ORIGINATA | icon-unify | `01-06-26/Report-unificazione-icone-prenota-qr.md` |
| A3-D61 | 01-06-26 | PRODOTTO | Migrate-on-read + carosello incluso | MATTEO | APPROVATA | icon-unify | stesso |
| A3-D64 | 01-06-26 | UI-UX | Logo header admin più piccolo mobile | MATTEO | ORIGINATA | admin-header | `01-06-26/Report-admin-header-logo-mobile-01-06-26.md` |
| A3-D65 | 01-06-26 | PROCESSO | Merge env/test→main ciclo Menu QR | MATTEO | DELEGATA | release-close | `01-06-26/Report-finale-ciclo-menu-qr-01-06-26.md` |
| A3-D66 | 01-06-26 | AI-METODO | Checklist ciclo + checkbox fuori copia | MATTEO | ORIGINATA | prepara-handoff | `01-06-26/Report-menu-qr-12-icone-categoria-01-06-26.md` |
| A3-D67 | 01-06-26 | PROCESSO | Template report finale con KPI | MATTEO | ORIGINATA | report-template | `01-06-26/Report-unificazione-icone-prenota-qr.md` |
| A4-D01 | 02-06-26 | FORMAZIONE | Confronta idee con principi per educarlo | MATTEO | ORIGINATA | didactic-mandate | `02-06-26/Report-evoluzione-hook-e-alleggerimento-skill-system-02-06-26.md` §6 |
| A4-D02 | 02-06-26 | FORMAZIONE | Mandato senior: riorganizzare/snellire/evolvere | MATTEO | ORIGINATA | senior-mandate | stesso §4 / §6 |
| A4-D03 | 02-06-26 | FORMAZIONE | Capire potenziale hook (modello mentale) | MATTEO | ORIGINATA | hook-literacy | stesso §3 |
| A4-D04 | 02-06-26 | AI-METODO | Hook cita file unico CHIUSURA_SESSIONE | MATTEO | ORIGINATA | ssot-closure | stesso §1 / §6 |
| A4-D05 | 02-06-26 | PROCESSO | File giornalieri leggeri; chiuso in archivio | MATTEO | ORIGINATA | archive-vs-live | stesso §2 / §6 |
| A4-D06 | 02-06-26 | AI-METODO | Pivot: già nel template → hook (smart-allow) | MATTEO | CORRETTIVA | enforcement-m4 | `02-06-26/Report-meta-senior-evoluzione-skill-system-02-06-26.md` §2.1 |
| A4-D07 | 02-06-26 | PROCESSO | Ritirare «sticky» dal VOCABOLARIO | MATTEO | CORRETTIVA | annotate-vs-promote | stesso §2.2 |
| A4-D08 | 02-06-26 | AI-METODO | Anti-scope-creep + Output attesi; no hook | MATTEO | SCELTA | anti-scope-creep | stesso §2.3 |
| A4-D09 | 02-06-26 | CONFLITTI | Zone Prenota↔QR in comandi-base always-on | MATTEO | ORIGINATA | zone-disambiguation | stesso §2.5 |
| A4-D10 | 02-06-26 | UI-UX | Cap form 4 card; riepilogo solo ≥1600 | MATTEO | ORIGINATA | prenota-layout | `02-06-26/Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md` frasi |
| A4-D12 | 02-06-26 | PROCESSO | Annulla esecutore sticky ancora KO | MATTEO | CORRETTIVA | cancel-bad-exec | stesso turno 14 |
| A4-D13 | 02-06-26 | UI-UX | Mobile: zero sticky bar, un riepilogo | MATTEO | ORIGINATA | mobile-summary-ux | `02-06-26/Report-rimozione-sticky-bar-mobile-prenota-02-06-26.md` |
| A4-D14 | 02-06-26 | FORMAZIONE | Se incerte: cerca online, no fluff | MATTEO | ORIGINATA | seek-facts-first | stesso P5 |
| A4-D15 | 02-06-26 | UI-UX | Icona «Nessuna» card/carosello | MATTEO | ORIGINATA | optional-icon | `02-06-26/Report-icona-nessuna-card-carosello-prenota-02-06-26.md` |
| A4-D16 | 02-06-26 | UI-UX | Tap data/ora solo icona+valore | MATTEO | ORIGINATA | tap-target-ux | `02-06-26/Report-area-click-ridotta-picker-data-ora-prenota-02-06-26.md` |
| A4-D17 | 02-06-26 | UI-UX | Card template compatta: titolo/icona/prezzo | MATTEO | ORIGINATA | card-template | `02-06-26/Report-card-sottotab-template-menu-compatto-02-06-26.md` |
| A4-D18 | 02-06-26 | PROCESSO | «parliamone prima» su task estetici | MATTEO | ORIGINATA | talk-before-code | `02-06-26/Report-prenota-full-page-fix-sticky-card-scorrevoli-02-06-26.md` |
| A4-D19 | 02-06-26 | SICUREZZA | Dev console online solo su env/test | MATTEO | SCELTA | test-only-tools | `02-06-26/Report-analisi-salute-codice-e-dev-console-02-06-26.md` §4 |
| A4-D20 | 02-06-26 | FORMAZIONE | Idea reminder principianti on/off | MATTEO | ORIGINATA | beginner-reminders | stesso / fix-sticky turno 4 |
| A4-D22 | 03-06-26 | PRODOTTO | Cap cliente abbondante anti-abuso, silenzioso | MATTEO | ORIGINATA | prenota-text-limits | stesso P2–P3 |
| A4-D23 | 03-06-26 | PROCESSO | Limiti max 3 sezioni per turno | MATTEO | ORIGINATA | decision-batching | `03-06-26/Report-limiti-testo-prenota-03-06-26.md` P2 |
| A4-D24 | 03-06-26 | IMPOSTAZIONI | Tuning limiti (24/79, promo 200, 550…) | MATTEO | ORIGINATA | prenota-text-limits | `03-06-26/Report-prenota-limiti-tuning-03-06-26.md` |
| A4-D25 | 03-06-26 | UI-UX | Annulla wrap → stack titolo/desc/footer | MATTEO | CORRETTIVA | prenota-menu-layout | `03-06-26/Report-prenota-layout-card-ingredienti-03-06-26.md` P5 |
| A4-D27 | 03-06-26 | FORMAZIONE | Imparare hook/capacità Cursor da report | MATTEO | ORIGINATA | cursor-hooks-education | `03-06-26/Report-meta-senior-hook-followup-e-mappa-cursor-03-06-26.md` R1 |
| A4-D28 + M1-D40 | 03-06-26 | AI-METODO | Hook stop: rilancio anche se report completo | MATTEO | ORIGINATA | stop-hook-v3 | stesso R2 |
| A4-D29 | 03-06-26 | FORMAZIONE | Max 2 formulazioni per concetto | MATTEO | CORRETTIVA | communication-style | stesso R4 |
| A4-D30 | 03-06-26 | AI-METODO | Template v.0 generico, zero nomi progetto | MATTEO | ORIGINATA | skill-template-v0 | `03-06-26/Report-meta-senior-propagazione-template-v0.md` |
| A4-D31 | 04-06-26 | FORMAZIONE | Sistema didattico in Per matteo | MATTEO | ORIGINATA | didactic-system | `04-06-26/Report-senior-context-knowledge-pilota-prenota-04-06-26.md` Lezione |
| A4-D33 + G1-D08 | 04-06-26 | FORMAZIONE | Guidate (a) vs idee autonome (b) | MATTEO | ORIGINATA | metacognition | stesso Lezione |
| A4-D34 | 04-06-26 | FORMAZIONE | Mappare flusso dati/utente per senso | MATTEO | ORIGINATA | context-knowledge | stesso Lezione |
| A4-D35 | 04-06-26 | FORMAZIONE | Pilota Prenota-Skill + contesto | CONGIUNTA | SCELTA | prenota-skill-pilot | stesso §11 Q1 |
| A4-D36 | 04-06-26 | FORMAZIONE | Punto ripresa PROSEGUIMENTO_MAPPATURA | MATTEO | ORIGINATA | continuity-ops | stesso §1.D |
| A4-D37 | 04-06-26 | FORMAZIONE | Hook v4: domande di chiusura | MATTEO | ORIGINATA | hook-closure-v4 | `04-06-26/Report-senior-hook-v4-guard-prod-04-06-26.md` §11 Q1 |
| A4-D38 | 04-06-26 | FORMAZIONE | SSoT codice, non hook-guard E-A | MATTEO | CORRETTIVA | ssot-root-fix | stesso Q1 (3) |
| A4-D39 | 04-06-26 | FORMAZIONE | Cartella context-knowledge + skill | MATTEO | ORIGINATA | context-knowledge | stesso Q1 (4) |
| A4-D40 | 04-06-26 | FORMAZIONE | Milestone mappare aree app | MATTEO | ORIGINATA | area-mapping | stesso Q1 (5) |
| A4-D41 | 04-06-26 | SICUREZZA | Guard PROD MCP/shell | CONGIUNTA | APPROVATA | env-safety-prod | stesso §7 |
| A4-D42 | 04-06-26 | FORMAZIONE | Controverifica qualità didattico | MATTEO | ORIGINATA | didactic-verify | `04-06-26/Report-senior-controverifica-didattico-allineamento-v0-04-06-26.md` Q1 |
| A4-D43 | 04-06-26 | FORMAZIONE | v.0 «identico ma vuoto» | MATTEO | ORIGINATA | template-vs-snapshot | stesso Q1 / Lezione |
| A4-D44 | 04-06-26 | FORMAZIONE | Sub-agente CONTROVERIFICA post-finale | MATTEO | ORIGINATA | controverifica | `04-06-26/Report-meta-hook-controverifica-prenota-runtime-04-06-26.md` Q1 |
| A4-D45 | 04-06-26 | FORMAZIONE | Controverifica in profilo Verifica | MATTEO | CORRETTIVA | controverifica | stesso Q1 (4) |
| A4-D46 | 04-06-26 | PRODOTTO | Ospiti max 110; testo solo taglio silenzioso | MATTEO | SCELTA | prenota-limits | stesso Q1 (8) |
| A4-D47 | 04-06-26 | IMPOSTAZIONI | Nome locale max 45 char | MATTEO | SCELTA | prenota-limits | `04-06-26/Report-fu-032-restaurant-name-45-04-06-26.md` Q1 |
| A4-D48 | 04-06-26 | UI-UX | `courses_label` footer card sottotab | MATTEO | APPROVATA | prenota-vetrina | `04-06-26/Report-courses-label-card-sottotab-prenota-04-06-26.md` Q1 |
| A4-D49 | 05-06-26 | FLUSSO | Rifiuta fix: griglia compose ancora vuota | MATTEO | CORRETTIVA | visual-qa | `05-06-26/Report-ordine-categorie-prenota-bug-griglia-05-06-26.md` Q1 |
| A4-D50 + I1-D24 | 05-06-26 | PRODOTTO | Tipologia = capacità; nomi = etichette | MATTEO | ORIGINATA | capability-model | `05-06-26/Report-tipologie-capability-driven-Fase1-2-05-06-26.md` §1 |
| A4-D51 | 05-06-26 | PRODOTTO | Fase 1+2 sì; no interruttori admin ora | MATTEO | SCELTA | product-scoping | stesso Q1 |
| A4-D52 | 05-06-26 | TESTING | Blindatura Prenota + caccia bug attiva | MATTEO | ORIGINATA | prenota-blindatura | `05-06-26/Report-blindatura-prenota-multiagent-FU-036-05-06-26.md` Q1 |
| A4-D53 | 05-06-26 | SICUREZZA | Merge main + edge PROD; stesso n. versione | MATTEO | SCELTA | env-parity | `05-06-26/Report-merge-main-allineamento-prod-FU-034-05-06-26.md` Q1 |
| A4-D54 | 05-06-26 | SICUREZZA | No probe runtime PROD (solo deploy) | MATTEO | SCELTA | env-safety | stesso R4 |
| A4-D55 | 05-06-26 | UI-UX | 3 correzioni visive card/carosello | MATTEO | CORRETTIVA | prenota-layout | `05-06-26/Report-prenota-allineamento-card-carosello-05-06-26.md` Q1 |
| A4-D56 | 05-06-26 | AI-METODO | Indaga cold-check pre-commit assente | MATTEO | ORIGINATA | process-hooks | `05-06-26/Report-hook-precommit-riattivazione-husky-05-06-26.md` Q1 |
| A4-D57 | 05-06-26 | AI-METODO | Fix Husky: hooksPath + shebang | MATTEO | APPROVATA | process-hooks | stesso Q1 |
| A4-D58 | 05-06-26 | UI-UX | Fix menù personalizzabile + card + footer | MATTEO | ORIGINATA | prenota-menu-ux | `05-06-26/Report-prenota-menu-sottotab-fix-05-06-26.md` Q1 |
| A5-D02 | 06-06-26 | PRODOTTO | Nome locale assente → ripiego «Menu» | INCERTO | APPROVATA | product-scoping | stesso §1 |
| A5-D03 | 06-06-26 | PRODOTTO | Footer data/ora = voluto di sistema | INCERTO | APPROVATA | product-scoping | stesso §1 |
| A5-D04 | 06-06-26 | PRODOTTO | Ordine piatti in categoria = buco → FU-MQR-2 | INCERTO | ORIGINATA | product-scoping | stesso §1 |
| A5-D06 | 06-06-26 | PRODOTTO | Rimuovere codice morto preset QR + colonne DB | MATTEO | ORIGINATA | debt-cleanup | stesso §1; `Report-mappatura-menu-qr-06-06-26.md` Decisioni |
| A5-D08 | 06-06-26 | PROCESSO | Scope sessione: solo Menu QR oggi | INCERTO | ORIGINATA | product-scoping | stesso Decisioni |
| A5-D09 | 06-06-26 | TESTING | Verifica sub-agent Menu QR rimandata | INCERTO | DELEGATA | test-strategy | stesso Decisioni |
| A5-D10 | 06-06-26 | SICUREZZA | Bonifica dati QR PROD: ok, nessun cliente attivo | MATTEO | ORIGINATA | env-safety | `Report-controverifica-menu-qr-prod-ready-06-06-26.md` §Dati / Q1 |
| A5-D11 | 06-06-26 | PRODOTTO | Niente test/altre aziende hardcoded (cliente nuovo) | MATTEO | ORIGINATA | prod-readiness | stesso Q1 |
| A5-D12 | 06-06-26 | PROCESSO | 3 sub-agent paralleli; tu resti orchestratore | MATTEO | SCELTA | orchestration | stesso §Dati comunicazione |
| A5-D13 | 06-06-26 | PROCESSO | Export morti QR: togli, commit, push, merge main | MATTEO | ORIGINATA | debt-cleanup | stesso §Dati / Q1 |
| A5-D14 | 06-06-26 | TESTING | Def. «blindata di prodotto» (doc+pulizia+controtest) | AGENTE | ORIGINATA | test-strategy | `PLAN_BLINDATURA_MENU_QR.md` header |
| A5-D15 + M3-D01 | 06-06-26 | PRODOTTO | Staff/admin stessi permessi, un accesso | MATTEO | ORIGINATA | product-scoping | `Report-blindatura-admin-area1-shell-06-06-26.md` Decisioni + Q1 |
| A5-D16 | 06-06-26 | PRODOTTO | Classic no sidebar; Pro/Enterprise sì + flags | MATTEO | APPROVATA | edition-flags | stesso Decisioni |
| A5-D17 | 06-06-26 | FLUSSO | Logout dirty: non silenzioso | MATTEO | ORIGINATA | ux-safety | stesso Decisioni |
| A5-D18 + M3-D04 | 06-06-26 | UI-UX | Fallback header neutro | MATTEO | SCELTA | product-scoping | stesso Decisioni + Q1 |
| A5-D19 | 06-06-26 | PRODOTTO | Home rispetta `features.home` | MATTEO | APPROVATA | edition-flags | stesso Decisioni |
| A5-D20 | 06-06-26 | FLUSSO | Refresh/back: migliorare sotto-route (sì) | MATTEO | SCELTA | navigation | stesso Q1 |
| A5-D21 | 06-06-26 | VENDITA | QR Menu feature vendibile via override | INCERTO | APPROVATA | marketing-features | stesso Decisioni |
| A5-D22 | 06-06-26 | TESTING | Area 1 ✅ solo con E2E reali; cerca bug attivamente | MATTEO | ORIGINATA | test-strategy | `Report-blindatura-admin-area2-prenotazioni.md` Q1 |
| A5-D23 | 06-06-26 | PRODOTTO | Settings in sidebar = codice vecchio → via | MATTEO | ORIGINATA | debt-cleanup | stesso Q1 |
| A5-D24 | 06-06-26 | FLUSSO | Doppio login auth → fix ora | MATTEO | ORIGINATA | auth | stesso Q1 |
| A5-D27 | 06-06-26 | FLUSSO | Soft-delete forever; hard-delete solo da DB | INCERTO | ORIGINATA | data-policy | stesso §1 |
| A5-D28 | 06-06-26 | UI-UX | Conferme pericolose: una sola lingua | INCERTO | ORIGINATA | ux-safety | stesso §1 |
| A5-D30 | 06-06-26 | AI-METODO | Portare «ragioniamo» + livelli 1/2/3 multi-IDE | MATTEO | ORIGINATA | skill-system | `Report-aggancio-skill-system-multi-ambiente-ragioniamo-06-06-26.md` cronologia |
| A5-D31 | 06-06-26 | AI-METODO | Fix skill system anche per Codex | MATTEO | CORRETTIVA | skill-system | stesso |
| A5-D32 | 06-06-26 | PROCESSO | Flash tab admin: indaga + cerca gemelli | MATTEO | ORIGINATA | debugging | `Report-fix-flash-tab-admin-06-06-26.md` Q1 |
| A5-D33 | 06-06-26 | FLUSSO | Refresh `/prenotazioni`→Calendario: fix + anti-ripetizione | MATTEO | ORIGINATA | navigation | `Report-admin-refresh-back-tab-prenotazioni-06-06-26.md` Q1 |
| A5-D35 | 06-06-26 | PROCESSO | Mappa area admin senza modificare/lanciare | MATTEO | ORIGINATA | documentation | `Report-mappatura-admin-area-06-06-26.md` Q1 |
| A5-D36 | 07-06-26 | IMPOSTAZIONI | Contatore restore: non ricontare reinserisci | MATTEO | SCELTA | data-semantics | `Report-fu046-batch-ux-area2-07-06-26.md` Q1 |
| A5-D37 | 07-06-26 | PROCESSO | FU-046: fare tutto lo scope | MATTEO | SCELTA | fix-scoping | stesso Q1 |
| A5-D38 | 07-06-26 | PRODOTTO | Reinserisci sempre + modale orario (ritratta D4) | MATTEO | CORRETTIVA | product-scoping | `Report-archivio-reinserisci-orario-07-06-26.md` Q1 |
| A5-D39 | 10-06-26 | PROCESSO | Analizza plan split + controverifica prima di toccare | MATTEO | APPROVATA | repo-ops | `Report-split-repo-prenotazen-production-10-06-26.md` Q1 |
| A5-D40 | 10-06-26 | PROCESSO | Crea PrenotaZen + TestingAgentHarness (a mano) | MATTEO | ORIGINATA | repo-ops | stesso Q1 |
| A5-D41 | 10-06-26 | SICUREZZA | Repo dev privata; segreti li ruoto io | MATTEO | SCELTA | env-safety | stesso Q1 AskUserQuestion |
| A5-D42 | 10-06-26 | PROCESSO | Push, merge main, Vercel collegato, token revocati | CONGIUNTA | ORIGINATA | release | stesso Q1 |
| A5-D43 | 10-06-26 | PROCESSO | LICENSE dopo; allinea main come punto 0 | MATTEO | SCELTA | release | stesso R4 / Q1 |
| A5-D44 | 10-06-26 | PRODOTTO | Batch Prenota P1–P8 (orari, cap, font, privacy…) | MATTEO | ORIGINATA | product-batch | `Report-finale-ciclo-prenota-admin-batch-10-06-26.md` Q1 |
| A5-D45 | 10-06-26 | UI-UX | P6: solo «Tipo» + «Opzione menu» (non ogni tab.label) | MATTEO | CORRETTIVA | product-scoping | stesso Q1 / nota P6 |
| A5-D46 | 10-06-26 | IMPOSTAZIONI | Cap compose 24/24/79 accettato a vista | MATTEO | APPROVATA | text-limits | `Report-finale-m0-prenota-10-06-26.md` Q1 |
| A5-D47 | 10-06-26 | TESTING | M0 in 2 fasi; verifica ogni fase | MATTEO | ORIGINATA | test-strategy | stesso Q1 |
| A5-D48 | 10-06-26 | TESTING | Chiudere M1 FU-042 E2E shell | MATTEO | DELEGATA | blindatura-admin | `Report-chiusura-m1-admin-shell-10-06-26.md` Q1 |
| A6-D01 + M3-D21 | 11-06-26 | PRODOTTO | Limiti duri magazzino 7/12/6/6 | MATTEO | ORIGINATA | menu-magazzino-limits | `11-06-26/Report-senior-audit-skill-system-mappatura-m3-menu-11-06-26.md` §3 |
| A6-D02 | 11-06-26 | PRODOTTO | Limiti solo su nuovi inserimenti | MATTEO | ORIGINATA | menu-magazzino-limits | stesso §3 |
| A6-D03 | 11-06-26 | UI-UX | Cap caratteri nome+descrizione mobile-first | MATTEO | ORIGINATA | menu-magazzino-limits | stesso §3 |
| A6-D04 + M3-D22 | 11-06-26 | FLUSSO | Snapshot menu_selection mai alterato | MATTEO | APPROVATA | snapshot-invariante | stesso §3 |
| A6-D05 | 11-06-26 | FLUSSO | Propagazione viva Prenota+QR da magazzino | MATTEO | ORIGINATA | magazzino-propagation | stesso §3 |
| A6-D06 + M3-D23 | 11-06-26 | PRODOTTO | Toggle magazzino: spento = nascosto ovunque | MATTEO | ORIGINATA | availability-toggle | stesso §3 |
| A6-D07 | 11-06-26 | UI-UX | Avviso propagazione anche su ingredienti | MATTEO | ORIGINATA | magazzino-propagation | stesso §3 |
| A6-D08 | 11-06-26 | UI-UX | Cap testo = stessi 24/79 FU-030 | MATTEO | APPROVATA | prenota-text-limits | `11-06-26/Report-prepara-prompt-ciclo-m3-m2-11-06-26.md` Q1 |
| A6-D09 | 11-06-26 | UI-UX | Toggle disponibilità solo panoramica Menu | MATTEO | ORIGINATA | availability-toggle | stesso § Decisioni + toggle-ux report |
| A6-D10 | 11-06-26 | PRODOTTO | Spenti nascosti anche in modal QR/card | MATTEO | CORRETTIVA | availability-toggle | `11-06-26/Report-finale-m3-menu-blindato-11-06-26.md` Q1 |
| A6-D11 | 11-06-26 | TESTING | Chiudi FU-M3-QA-L3 (limite 7 cat) | MATTEO | APPROVATA | menu-magazzino-limits | stesso Q1 |
| A6-D12 | 11-06-26 | TESTING | Chiudi FU-MQR-3 (refuso assente PROD) | MATTEO | APPROVATA | menu-qr-debt | stesso Q1 |
| A6-D14 + M3-D15 | 11-06-26 | PRODOTTO | Calendario: solo accettate; no drag; crea-da-giorno | MATTEO | ORIGINATA | calendario-scope | `11-06-26/Report-m2-calendario-mappatura-impl-11-06-26.md` §1 |
| A6-D15 + M3-D17 | 11-06-26 | IMPOSTAZIONI | Due limiti coperti separati e morbidi (admin) | MATTEO | ORIGINATA | limite-coperti | stesso §1 |
| A6-D16 | 11-06-26 | IMPOSTAZIONI | Limite giornaliero blocca solo Prenota pubblica | MATTEO | ORIGINATA | limite-coperti | `11-06-26/Report-fase-c-controtest-calendario-11-06-26.md` §7 #4 |
| A6-D17 | 11-06-26 | IMPOSTAZIONI | 0 / vuoto / -1 = nessun limite | MATTEO | CORRETTIVA | limite-coperti | `11-06-26/Report-m2-calendario-mappatura-impl-11-06-26.md` Q1 |
| A6-D18 | 11-06-26 | UI-UX | Click giorno = seleziona+CTA, non apre form | MATTEO | CORRETTIVA | calendario-click-ux | stesso §4 + Q1 |
| A6-D19 | 11-06-26 | PRODOTTO | No-show liberano posto (pubblico + badge) | MATTEO | ORIGINATA | limite-coperti | stesso Q1 |
| A6-D20 + M3-D19 | 11-06-26 | PRODOTTO | Blocco per-fascia pubblico spento di default | MATTEO | ORIGINATA | limite-coperti | stesso Q1 |
| A6-D21 | 11-06-26 | UI-UX | Badge: solo % con limite; solo conteggio senza | MATTEO | CORRETTIVA | calendario-badge | `11-06-26/Report-m2-calendario-fix-qa-11-06-26.md` Q1 |
| A6-D22 | 11-06-26 | UI-UX | Badge mobile basso; desktop più grande | MATTEO | ORIGINATA | calendario-badge | stesso Q1 |
| A6-D23 + M3-D20 | 11-06-26 | UI-UX | Pulsante Nuova prenotazione sempre visibile | MATTEO | CORRETTIVA | calendario-click-ux | stesso Fix #3 |
| A6-D24 | 11-06-26 | PRODOTTO | Fix #4 turni/fascia = non-bug (fuori fascia) | MATTEO | CORRETTIVA | visual-qa | stesso Q1 |
| A6-D25 | 11-06-26 | UI-UX | Simbolo % esplicito nel badge | MATTEO | ORIGINATA | calendario-badge | `11-06-26/Report-m2-calendario-badge-simbolo-percentuale-11-06-26.md` Q1 |
| A6-D26 | 11-06-26 | TESTING | Solo Vitest calendario; no E2E | MATTEO | ORIGINATA | test-strategy | `11-06-26/Report-finale-m2-calendario-ciclo-blindatura-11-06-26.md` Q1 |
| A6-D27 | 11-06-26 | TESTING | Click card giorno OK (QA Matteo) | MATTEO | APPROVATA | visual-qa | stesso Q1 |
| A6-D28 | 11-06-26 | TESTING | Classifica finding Fase C batch A/B | MATTEO | APPROVATA | blindatura-classify | `11-06-26/Report-finale-m2-calendario-blindato-11-06-26.md` Q1 |
| A6-D29 | 11-06-26 | UI-UX | C-R2 badge % solo vista mese = voluto | MATTEO | APPROVATA | calendario-badge | `11-06-26/Report-batch-a-fix-calendario-fase-c-11-06-26.md` §3 |
| A6-D30 | 11-06-26 | FLUSSO | C-U2: dirty → Salva/Annulla/Resta; poi chiudi | MATTEO | ORIGINATA | unsaved-guard | `11-06-26/Report-c-u2-guard-tab-calendario-11-06-26.md` header |
| A6-D31 | 11-06-26 | UI-UX | Guard anche overlay/X/Esc (post-QA) | MATTEO | CORRETTIVA | unsaved-guard | stesso Q1 / §2-bis |
| A6-D33 | 11-06-26 | TESTING | QA badge responsive OK 375/834/1280 | MATTEO | APPROVATA | visual-qa | `11-06-26/Report-finale-m2-calendario-blindato-11-06-26.md` Q1 |
| A6-D34 | 11-06-26 | UI-UX | Data accanto a Oggi nascosta ≤tablet | MATTEO | ORIGINATA | calendario-layout | `11-06-26/Report-calendario-data-responsive-tablet-11-06-26.md` Q1 |
| A6-D35 | 11-06-26 | AI-METODO | Controtest «rompi» obbligatorio solo se src/ logica | MATTEO | DELEGATA | blindatura-method | `11-06-26/Report-senior-revisione-merge-M0-M1-manuale-blindatura-11-06-26.md` Q1 |
| A6-D36 | 11-06-26 | PROCESSO | Pubblico = solo diff src/ clienti | MATTEO | ORIGINATA | merge-pubblico | stesso Q1 |
| A6-D37 | 11-06-26 | PROCESSO | M1 non pubblicare (zero src/) | MATTEO | ORIGINATA | merge-pubblico | stesso Dati comunicazione |
| A6-D38 | 11-06-26 | AI-METODO | Gate non dovuto ≠ debito (togli FU) | MATTEO | CORRETTIVA | anti-bureaucracy | stesso Q1 |
| A6-D39 | 11-06-26 | PROCESSO | Manuale blindatura = source of truth metodo | MATTEO | ORIGINATA | blindatura-method | stesso Q1 |
| A6-D40 | 11-06-26 | PRODOTTO | M0 Prenota LIVE (cap 24/24/79) | CONGIUNTA | APPROVATA | prenota-release | stesso cappello + Q1 |
| A6-D41 | 11-06-26 | TESTING | M2 Calendario Blindato ✅ | CONGIUNTA | APPROVATA | calendario-blindatura | `11-06-26/Report-finale-m2-calendario-blindato-11-06-26.md` §13 |
| A6-D42 | 11-06-26 | TESTING | M3 Menu Blindato ✅ | CONGIUNTA | APPROVATA | menu-blindatura | `11-06-26/Report-finale-m3-menu-blindato-11-06-26.md` cancello |
| A6-D43 + M3-D16 | 11-06-26 | VENDITA | Scorciatoia tavolo solo Pro | MATTEO | ORIGINATA | edition-gate | `11-06-26/Report-m2-calendario-mappatura-impl-11-06-26.md` §1 |
| A6-D44 + A8-D18 | 13-06-26 | UI-UX | Email: firma Lo staff + nome tenant | MATTEO | ORIGINATA | email-copy | `13-06-26/Report-ciclo2-email-brevo-fu-email-1-13-06-26.md` Q1 |
| A6-D45 | 13-06-26 | UI-UX | Email: telefono+email se presenti | MATTEO | ORIGINATA | email-copy | stesso Q1 |
| A6-D46 | 13-06-26 | UI-UX | Oggetto Prenotazione confermata OK | MATTEO | APPROVATA | email-copy | stesso Q1 |
| A6-D47 | 13-06-26 | PRODOTTO | Motivo non mostrare in email rifiuto | MATTEO | ORIGINATA | email-copy | stesso Q1 |
| A6-D48 | 13-06-26 | UI-UX | Copy email 1: non esitare a contattarci | MATTEO | ORIGINATA | email-copy | stesso Q1 |
| A6-D49 | 13-06-26 | PRODOTTO | Template email editabili in CRM → FU | MATTEO | DELEGATA | email-crm | stesso Q1 |
| A6-D50 | 13-06-26 | AI-METODO | Indagare tipi evento → FU (non hardcode) | MATTEO | ORIGINATA | defer-to-fu | stesso Q1 |
| A6-D51 | 13-06-26 | SICUREZZA | Capitolo allineamento chiuso; email+legale fuori | MATTEO | ORIGINATA | compliance-scope | `13-06-26/Report-finale-capitolo-allineamento-per-fable-13-06-26.md` Q1 |
| A6-D52 | 13-06-26 | PROCESSO | Merge PrenotaZen dopo verifica TOCTOU OK | MATTEO | APPROVATA | merge-prod | stesso Q1 |
| A7-D01 + I1-D20 | 12-06-26 | AI-METODO | Solo masterplan; nessun WP eseguito | MATTEO | ORIGINATA | masterplan-scoping | `Report-creazione-masterplan-allineamento-12-06-26.md` Q1 |
| A7-D02 | 12-06-26 | PROCESSO | AL-D/F/E restano approvazioni sue | CONGIUNTA | APPROVATA | owner-gates | stesso §6 |
| A7-D03 | 12-06-26 | PROCESSO | Sub-agent per task semplici; senior per complicate | MATTEO | ORIGINATA | multi-agent-orchestration | `Report-prepara-prompt-ciclo-masterplan-semplici-12-06-26.md` §6 |
| A7-D04 | 12-06-26 | PROCESSO | Escludere AL-B/D/F/E dal ciclo semplici | CONGIUNTA | APPROVATA | work-package-triage | stesso (WP esclusi) |
| A7-D05 | 12-06-26 | VENDITA | Contesto: no P.IVA; solo Italia; vendita mista | MATTEO | ORIGINATA | go-to-market | `Report-analisi-legale-vendita-12-06-26.md` Q1 |
| A7-D07 | 12-06-26 | VENDITA | Enterprise in listino, solo preventivo | MATTEO | SCELTA | pricing-edition | stesso / `Report-wp-f1-prezzi-edition-12-06-26.md` |
| A7-D08 | 12-06-26 | VENDITA | Annuale = 2 mesi gratis | MATTEO | APPROVATA | pricing-edition | stesso |
| A7-D10 | 12-06-26 | VENDITA | Trial 30 gg senza carta | MATTEO | SCELTA | pricing-trial | stesso |
| A7-D11 | 12-06-26 | VENDITA | Setup gratis fondatori; poi 100€ | MATTEO | SCELTA | pricing-setup | stesso |
| A7-D12 | 12-06-26 | VENDITA | Pacchetto fotografo 200€ / 25 foto | MATTEO | ORIGINATA | pricing-addon | stesso |
| A7-D13 | 12-06-26 | VENDITA | Referral: 1 mese gratis | MATTEO | SCELTA | pricing-referral | stesso |
| A7-D16 + M4-D03 | 12-06-26 | LEGALE | Contratto B2B: bozza repo → avvocato | MATTEO | SCELTA | legal-b2b | stesso |
| A7-D17 + M4-D04 | 12-06-26 | LEGALE | Recesso mensile; annuale 30 gg | MATTEO | SCELTA | legal-b2b | stesso |
| A7-D18 + M4-D05 | 12-06-26 | LEGALE | Fattura elettronica via ADE gratis | MATTEO | SCELTA | legal-invoicing | stesso |
| A7-D19 | 12-06-26 | COMPLIANCE | Registro art.30 bloccante (senior→comm.) | MATTEO | SCELTA | gdpr-ops | stesso |
| A7-D20 | 12-06-26 | COMPLIANCE | Runbook breach bloccante come G2 | MATTEO | SCELTA | gdpr-breach | stesso |
| A7-D21 | 12-06-26 | COMPLIANCE | Sub-processor pubblico bloccante | MATTEO | SCELTA | gdpr-subprocessors | stesso |
| A7-D22 | 12-06-26 | COMPLIANCE | Email privacy temp Gmail sua | MATTEO | ORIGINATA | privacy-contact | stesso |
| A7-D23 + M4-D11 | 12-06-26 | SICUREZZA | Region Supabase PROD = West EU Ireland | MATTEO | SCELTA | data-residency | stesso |
| A7-D24 | 12-06-26 | LEGALE | Marchio PrenotaZen + logo; UIBM prima | MATTEO | SCELTA | brand-legal | stesso |
| A7-D25 | 12-06-26 | LEGALE | RC cyber prima di scalare | MATTEO | SCELTA | insurance | stesso |
| A7-D26 + M4-D09 | 12-06-26 | COMPLIANCE | EAA come argomento vendita | MATTEO | SCELTA | accessibility-sales | stesso |
| A7-D27 + M4-D59 | 12-06-26 | VENDITA | Budget legale anno 1 ≈ 1.500–2.500€ | MATTEO | SCELTA | legal-budget | stesso |
| A7-D28 | 12-06-26 | LEGALE | Disclaimer: non sostituisce avvocato | MATTEO | SCELTA | legal-disclaimer | stesso |
| A7-D29 | 12-06-26 | AI-METODO | Mini-pack ibrido docs + Cursor puntatore | MATTEO | SCELTA | skill-mini-pack | stesso WP-E1 / `Report-wp-e1-mini-pack-area-12-06-26.md` |
| A7-D30 | 12-06-26 | AI-METODO | Mini-pack 5 sezioni ≤80 righe | MATTEO | SCELTA | skill-mini-pack | stesso |
| A7-D31 | 12-06-26 | AI-METODO | Rollout mini: Prenota+QR → A3 → A4–A7 | MATTEO | ORIGINATA | skill-rollout | stesso |
| A7-D32 | 12-06-26 | AI-METODO | Mini-pack per area (non per profilo) | MATTEO | SCELTA | skill-mini-pack | stesso |
| A7-D33 | 12-06-26 | AI-METODO | Indice mini in APP_CONTEXT §0.0b | MATTEO | SCELTA | skill-index | stesso |
| A7-D34 | 12-06-26 | AI-METODO | Nome file `*_MINI.md`; un solo ADMIN_MINI | MATTEO | SCELTA | skill-mini-pack | stesso |
| A7-D35 | 12-06-26 | AI-METODO | Doc-path: docs/ escl. Sessioni/_lavoro/Archivio | MATTEO | SCELTA | docs-path-check | stesso WP-E2 / `Report-wp-e2-doc-path-check-12-06-26.md` |
| A7-D36 | 12-06-26 | AI-METODO | Doc-path in validate+CI; hard fail; no pre-commit | MATTEO | SCELTA | docs-path-check | stesso |
| A7-D37 | 12-06-26 | AI-METODO | Anti-storia: report=storia; skill=stato+guardrail | MATTEO | SCELTA | anti-storia | stesso WP-E3 / `Report-wp-e3-anti-storia-protocollo-7-12-06-26.md` |
| A7-D38 | 12-06-26 | AI-METODO | Potatura Menu QR attiva; resto on-touch | MATTEO | APPROVATA | anti-storia | stesso |
| A7-D39 | 12-06-26 | AI-METODO | §7 spezzato; regola S1b in §8; grilletti invariati | MATTEO | SCELTA | anti-storia | stesso |
| A7-D40 | 12-06-26 | PROCESSO | AL-E design ok senza senior codice | MATTEO | SCELTA | design-vs-imp | ciclo Q1 |
| A7-D41 + M4-D19 + M4-D18 | 12-06-26 | VENDITA | Post-senior: Pro 69€; fondatori 6 mesi | MATTEO | CORRETTIVA | pricing-edition | `Report-chiusura-ciclo-fable-allineamento-sicurezza-12-06-26.md` §3 |
| A7-D42 | 12-06-26 | COMPLIANCE | GDPR operativo entro 1° mese, non blocco 1° incasso | CONGIUNTA | CORRETTIVA | go-to-market | stesso §2 |
| A7-D43 | 12-06-26 | PROCESSO | No commit/push finché «fai report finale» | MATTEO | ORIGINATA | closure-gate | stesso Q1 |
| A7-D44 | 12-06-26 | SICUREZZA | Fix CLI → allinea/verifica DB TEST | MATTEO | ORIGINATA | env-channels | stesso §7 |
| A7-D45 | 12-06-26 | PROCESSO | Prompt batch FU-046 / Servizio / edge + report finale | MATTEO | ORIGINATA | multi-agent-orchestration | `Report-chiusura-m6-docs-prompts-prossimi-12-06-26.md` Q1 |
| A7-D46 | 12-06-26 | AI-METODO | Ok AL-D senza senior; poi commit | MATTEO | DELEGATA | wp-delegate | `Report-wp-al-d-fusioni-docs-12-06-26.md` Q1 |
| A7-D47 | 12-06-26 | SICUREZZA | Apply policy 046 su TEST e PROD | MATTEO | APPROVATA | env-safety-prod | `Report-wp-b1-migrazioni-db-12-06-26.md` Q1 |
| A7-D48 | 12-06-26 | SICUREZZA | Fix RLS completo + rilascio PROD ora | MATTEO | SCELTA | security-scope | `Report-wp-b2-restaurant-settings-cross-tenant-12-06-26.md` Q1 |
| A7-D49 | 12-06-26 | TESTING | Smoke TEST OK prima di PROD (B2) | MATTEO | APPROVATA | smoke-gate | stesso Q1 |
| A7-D50 | 12-06-26 | PROCESSO | Commit/push B3 + allinea PrenotaZen | MATTEO | ORIGINATA | public-repo-sync | `Report-wp-b3-guard-tenant-pubblico-admin-12-06-26.md` Q1 |
| A7-D51 | 12-06-26 | PRODOTTO | No deploy check-slot su PROD | MATTEO | APPROVATA | slot-authority | `Report-wp-b5-slot-availability-cleanup-rate-limits-12-06-26.md` §1 |
| A7-D52 | 12-06-26 | SICUREZZA | Conferma apply DB 048 + commit/main/PZ | MATTEO | APPROVATA | env-safety-prod | stesso Q1 |
| A7-D53 | 12-06-26 | PROCESSO | Branch corretto: siamo su env/test | MATTEO | CORRETTIVA | branch-gate | `Report-diagnosi-wp-b5-test-apply-12-06-26.md` Q1 |
| A7-D54 | 12-06-26 | AI-METODO | CLI=TEST / MCP=PROD solo in AGENTS Codex | MATTEO | CORRETTIVA | agent-env-channels | `Report-completamento-wp-b5-test-apply-12-06-26.md` Q1 |
| A7-D55 | 12-06-26 | SICUREZZA | Connettore GPT = solo PROD (fatto) | MATTEO | ORIGINATA | mcp-prod-limit | stesso Q1 |
| A7-D56 | 12-06-26 | UI-UX | Digest calendario: lista verticale per fasce | MATTEO | SCELTA | calendar-digest | `Report-fix-digest-calendario-fasce-verticali-12-06-26.md` |
| A7-D57 | 12-06-26 | PROCESSO | Merge digest + PrenotaZen; smoke OK → report finale | MATTEO | APPROVATA | release-gate | stesso |
| A7-D58 | 12-06-26 | PROCESSO | Merge production guard fantasma | MATTEO | ORIGINATA | release-gate | `Report-merge-production-guard-fantasma-12-06-26.md` |
| A7-D59 | 12-06-26 | SICUREZZA | M3 Menu: procedi merge + migrazione PROD | MATTEO | APPROVATA | env-safety-prod | `Report-merge-production-m3-menu-12-06-26.md` |
| A7-D60 | 12-06-26 | PRODOTTO | Fallback orari/sfondo/form/strip (registro M6) | MATTEO | APPROVATA | prenota-fallback | `Report-m6-fu-all-fallback-*-12-06-26.md` §2b |
| A7-D61 | 12-06-26 | IMPOSTAZIONI | Placement areas: lista vuota, no demo | MATTEO | DELEGATA | settings-empty-state | `Report-m6-prod-ready-fallback-guards-prenotazen-12-06-26.md` |
| A7-D62 | 12-06-26 | FLUSSO | U3 blocca tab in mutation; U9 banner errore | MATTEO | APPROVATA | admin-prenotazioni-ux | `Report-fu046-residui-u3-u9-12-06-26.md` Q1 |
| A7-D63 | 12-06-26 | AI-METODO | FU-TYPES: prima plan/ragioniamo, poi implement | MATTEO | ORIGINATA | plan-then-code | `Report-fu-types-1-hook-perimetro-t1-t5-12-06-26.md` Q1 |
| A7-D64 | 12-06-26 | PROCESSO | Controverifica commissionata (M6/FU-LOG/FU-TYPES) | MATTEO | DELEGATA | controverifica | report `Report-controverifica-*-12-06-26.md` Q1 |
| A7-D65 | 12-06-26 | PROCESSO | FU-LOG scripts: no commit qui → senior merge | MATTEO | ORIGINATA | merge-hygiene | `Report-fu-log-1-chiusura-scripts-12-06-26.md` Q1 |
| A7-D66 | 12-06-26 | PROCESSO | Ok spostamento storici Menu QR (D5) | MATTEO | APPROVATA | docs-archive | `AL-D/WP-D5-preparazione-menu-qr-storici.md` |
| A8-D01 | 15-06-26 | PRODOTTO | Niente email su cancel/elimina | MATTEO | ORIGINATA | email-cancel-policy | `15-06-26/Report-finale-fu-email-1-brevo-15-06-26.md` §11 R1 |
| A8-D02 | 15-06-26 | TESTING | Conferma ricezione Brevo su Gmail | MATTEO | APPROVATA | brevo-qa | stesso R1 |
| A8-D03 | 15-06-26 | PROCESSO | Report finale + commit + push Brevo | MATTEO | ORIGINATA | closure-ritual | stesso R1 |
| A8-D04 | 15-06-26 | SICUREZZA | Fornisce chiavi Brevo (SMTP→API) | MATTEO | ORIGINATA | brevo-secrets | `15-06-26/Report-fu-email-1-test-brevo-15-06-26.md` §11 R1 |
| A8-D05 | 15-06-26 | PROCESSO | No FU-EMAIL-2 senza Sì/No | MATTEO | ORIGINATA | scope-gate | stesso R1 |
| A8-D06 | 15-06-26 | AI-METODO | Esegui plan FU-EMAIL-3 CRM | MATTEO | DELEGATA | m-regia-plan | `15-06-26/Report-fu-email-3-personalizza-email-crm-15-06-26.md` §11 R1 |
| A8-D07 | 15-06-26 | COMPLIANCE | Footer privacy fisso su promo | INCERTO | APPROVATA | promo-gdpr-light | stesso §2 (plan) |
| A8-D08 | 15-06-26 | PRODOTTO | Totale; rifiuto senza box; no Promo | MATTEO | ORIGINATA | email-copy | `15-06-26/Report-fu-email-4-riepilogo-email-15-06-26.md` §11 R1 |
| A8-D09 | 15-06-26 | PROCESSO | Niente merge/deploy PROD in EMAIL-4 | MATTEO | ORIGINATA | release-gate | stesso R1 |
| A8-D10 | 15-06-26 | PRODOTTO | Mini-campagne: max 5 + cadenza | MATTEO | ORIGINATA | email-campaigns | `15-06-26/Report-controverifica-fu-email-3-plan-campagne-15-06-26.md` §11 R1 |
| A8-D12 | 15-06-26 | UI-UX | Link strutturati + auto-link; no HTML | MATTEO | SCELTA | campaign-xss | stesso §3 |
| A8-D13 | 15-06-26 | FLUSSO | Scheduler automatico = FU-EMAIL-8 | MATTEO | SCELTA | campaign-phasing | stesso §3 |
| A8-D14 | 15-06-26 | LEGALE | Marketing: solo footer, no opt-out auto | CONGIUNTA | APPROVATA | compliance-gap | stesso §5 |
| A8-D15 | 15-06-26 | PROCESSO | Esegui plan campagne in altra chat | MATTEO | ORIGINATA | split-chat | stesso §11 R1 |
| A8-D16 | 15-06-26 | AI-METODO | Controverifica Sonnet + commit se ok | MATTEO | DELEGATA | controverifica | stesso R1 |
| A8-D17 | 15-06-26 | UI-UX | «Invia ora» su card + guard conferma | MATTEO | ORIGINATA | campaign-send-ux | `15-06-26/Report-email-invia-card-firma-tenant-15-06-26.md` §11 R1 |
| A8-D19 | 15-06-26 | COMPLIANCE | No clienti manuali; solo source=booking | MATTEO | ORIGINATA | crm-privacy | `15-06-26/Report-crm-3fix-rubrica-guard-card-15-06-26.md` §11 R1 |
| A8-D20 | 15-06-26 | UI-UX | Guard dirty su editor email/campagne | MATTEO | ORIGINATA | unsaved-guard | stesso R1 |
| A8-D21 | 15-06-26 | UI-UX | Card Accetta/Rifiuta non auto-chiudere | MATTEO | ORIGINATA | collapsible-ux | stesso R1 |
| A8-D22 | 15-06-26 | SICUREZZA | send-email NON deployata su PROD | CONGIUNTA | APPROVATA | prod-email-gate | `15-06-26/Report-cicli-7-8-9-skill-system-polish-legale-15-06-26.md` §Pubblicazione |
| A8-D23 | 15-06-26 | SICUREZZA | Autorizza deploy edge PROD (altre fn) | MATTEO | APPROVATA | prod-ops | stesso §Pubblicazione |
| A8-D24 | 15-06-26 | LEGALE | Bozze ToS/GDPR → revisione professionisti | MATTEO | DELEGATA | legal-handoff | stesso Ciclo 9 |
| A8-D25 | 15-06-26 | LEGALE | Retention T1/T2 ancora da decidere | MATTEO | DELEGATA | gdpr-retention | stesso Ciclo 9 |
| A8-D26 | 15-06-26 | IMPOSTAZIONI | Attiva flag send-email in dev | MATTEO | CORRETTIVA | email-dev-flag | `15-06-26/Report-finale-15-06-26-ciclo8-email-fu026.md` §Derivazione |
| A8-D27 | 15-06-26 | PROCESSO | Merge dopo verifica email in dev | MATTEO | SCELTA | release-gate | stesso §Dati comunicazione |
| A8-D29 | 15-06-26 | PROCESSO | Segnala G16 fuoriscope nel report | MATTEO | CORRETTIVA | product-scoping | stesso R1 |
| A8-D30 | 15-06-26 | UI-UX | Sfondi: soluzione più solida a monte | MATTEO | CORRETTIVA | prenota-background | `15-06-26/Report-d-m2-sfondi-prenota-batch2-15-06-26.md` §11 R1 |
| A8-D31 | 15-06-26 | IMPOSTAZIONI | Pacchetto D1–D15 intervista M4 | MATTEO | APPROVATA | admin-settings | `15-06-26/Blindatura ADMIN/Report-intervista-m4-admin-impostazioni-15-06-26.md` R1 |
| A8-D32 | 15-06-26 | TESTING | Gate Batch 1/2 → approved | MATTEO | APPROVATA | test-gate | `15-06-26/Blindatura ADMIN/Report-gate-batch1-2-15-06-26.md` R1 |
| A8-D33 | 15-06-26 | PROCESSO | Solo Cicli 5 e 6 ora (non 7–9) | MATTEO | SCELTA | product-scoping | `15-06-26/Report-Cicli-3-6-fix-qr-prenotazioni-guard-auth-15-06-26.md` R1 |
| A8-D34 | 15-06-26 | SICUREZZA | Allinea PrenotaZen/PROD post cicli | MATTEO | APPROVATA | env-parity | stesso R1 |
| A8-D35 | 15-06-26 | TESTING | Conferma FU-001 test visivo | MATTEO | APPROVATA | visual-qa | stesso R1 |
| A8-D36 | 15-06-26 | PRODOTTO | Label tipologia da config | MATTEO | ORIGINATA | prenota-labels | `15-06-26/Report-finale-label-tipologia-da-config-15-06-26.md` R1 |
| A8-D37 | 15-06-26 | SICUREZZA | Merge+release label in produzione | MATTEO | APPROVATA | env-parity | stesso R1 |
| A8-D38 | 16-06-26 | PROCESSO | Solo 3 fix CRM; resto → FU | MATTEO | ORIGINATA | product-scoping | `16-06-26/Report-fix-crm-guard-ui-16-06-26.md` §7 Q1 |
| A8-D39 | 16-06-26 | UI-UX | FU-EMAIL-10: no re-click close | MATTEO | ORIGINATA | crm-guard-scope | stesso Q1 |
| A8-D40 | 16-06-26 | UI-UX | FU-EMAIL-11: X bypassa guard | MATTEO | ORIGINATA | crm-guard-scope | stesso Q1 |
| A8-D41 | 16-06-26 | TESTING | Orchestrare sub-agent E2E multi-area | MATTEO | ORIGINATA | test-orchestration | `16-06-26/Report-e2e-blindatura-multiarea-16-06-26.md` Q1 |
| A8-D42 | 16-06-26 | TESTING | Checklist blindatura via E2E | MATTEO | ORIGINATA | blindatura-checklist | stesso Q1 |
| A8-D43 | 16-06-26 | TESTING | Guide E2E in Per matteo | MATTEO | ORIGINATA | e2e-ops-docs | stesso Q1 |
| A8-D44 | 16-06-26 | TESTING | E2E a velocità occhio umano | MATTEO | ORIGINATA | human-paced-e2e | stesso Q1 |
| A8-D45 | 16-06-26 | TESTING | Spunta checklist con E2E verdi | MATTEO | ORIGINATA | checklist-delegation | `16-06-26/Report-finale-e2e-blindatura-checklist-16-06-26.md` Q1 |
| A8-D46 | 16-06-26 | PROCESSO | Controverifica account TEST prima | MATTEO | ORIGINATA | verify-before-exec | `16-06-26/Report-allineamento-account-e2e-test-16-06-26.md` Q1 |
| A8-D47 | 16-06-26 | TESTING | Elimina seed SQL; annota FU-052 | MATTEO | SCELTA | env-test-hygiene | stesso §5 |
| A8-D48 | 16-06-26 | PROCESSO | Changelog datati = storico | MATTEO | SCELTA | doc-history-policy | stesso §5 |
| A8-D49 | 16-06-26 | UI-UX | Chiudi card se non tutta in viewport | MATTEO | CORRETTIVA | prenota-accordion | `16-06-26/Report-accordion-carosello-menu-prenota-16-06-26.md` Q1 |
| A8-D51 | 16-06-26 | PROCESSO | FU-054 solo annota, non fix | MATTEO | ORIGINATA | product-scoping | stesso Q1 / §6 |
| A8-D52 | 16-06-26 | SICUREZZA | FIX9 v1: nessuna migrazione SQL | MATTEO | ORIGINATA | no-ddl-without-ask | `16-06-26/Riprendi-Prompt-agenti-milestone-d-fix9-16-06-26.md` §0/§3A |
| A8-D53 | 16-06-26 | PROCESSO | LOCK Modal.tsx in Milestone D | MATTEO | ORIGINATA | lock-respect | stesso §0 |
| A8-D54 | 16-06-26 | TESTING | Area 3 Impostazioni = blindata | MATTEO | APPROVATA | admin-blindatura | `15-06-26/Blindatura ADMIN/Report-finale-area3-impostazioni-15-06-26.md` §5/R1 |
| A8-D55 | 16-06-26 | PROCESSO | Salta §2B revisore; commit diretto | MATTEO | SCELTA | process-shortcuts | `16-06-26/Report-e2e-calendario-display-order-16-06-26.md` Q4 |
| A9-D01 | 17-06-26 | PROCESSO | Rilascio 8 fix UX → PrenotaZen | MATTEO | ORIGINATA | release-gate | `17-06-26/Report-rilascio-8fix-allineamento-db-17-06-26.md` §11 R1 |
| A9-D02 | 17-06-26 | SICUREZZA | Allinea DB PROD↔TEST (email + ordine) | MATTEO | ORIGINATA | env-parity | stesso R1 |
| A9-D03 | 17-06-26 | SICUREZZA | Configura PROD per inviare email | MATTEO | ORIGINATA | prod-email | stesso R1 |
| A9-D04 | 17-06-26 | SICUREZZA | Secret Brevo PROD + conferma arrivo | MATTEO | ORIGINATA | brevo-secrets | stesso R1 |
| A9-D05 | 17-06-26 | LEGALE | Disclosure GDPR email → azione Matteo | CONGIUNTA | DELEGATA | legal-handoff | stesso §5 |
| A9-D06 | 17-06-26 | AI-METODO | FIX 9 in parallelo (Sonnet) | MATTEO | DELEGATA | parallel-agents | stesso R1 |
| A9-D07 | 17-06-26 | UI-UX | Tipologia reale su card pending | MATTEO | DELEGATA | prenota-labels | `17-06-26/Report-prenotazioni-card-tipologia-config-17-06-26.md` §11 R1 |
| A9-D08 | 17-06-26 | UI-UX | Riepilogo telefono + label focus | MATTEO | DELEGATA | prenota-summary | `17-06-26/Report-prenota-telefono-riepilogo-label-focus-17-06-26.md` §11 R1 |
| A9-D09 | 17-06-26 | UI-UX | Font dropdown + descrizione header | MATTEO | DELEGATA | form-config | `17-06-26/Report-personalizza-form-font-descrizione-header-17-06-26.md` Q1 |
| A9-D10 | 17-06-26 | PRODOTTO | FIX 9 categorie non compilabili | MATTEO | DELEGATA | compilable-categories | `17-06-26/Report-fix9-compilable-category-keys-pubblica-17-06-26.md` §11 R1 |
| A9-D11 | 17-06-26 | VENDITA | Avviso magazzino edition-aware | MATTEO | DELEGATA | edition-copy | `17-06-26/Report-menu-magazzino-avviso-edition-aware-17-06-26.md` §11 R1 |
| A9-D12 | 17-06-26 | UI-UX | Rotella non cambia input number | MATTEO | DELEGATA | input-wheel | `17-06-26/Report-admin-input-number-no-wheel-17-06-26.md` §11 R1 |
| A9-D13 | 17-06-26 | UI-UX | Footer dirty Salva/Annulla + pulse | MATTEO | DELEGATA | dirty-footer | `17-06-26/Report-admin-footer-dirty-pulse-17-06-26.md` §11 R1 |
| A9-D14 | 17-06-26 | FLUSSO | Destinatari campagne restano selezionati | MATTEO | DELEGATA | campaign-recipients | `17-06-26/Report-crm-prompt8-destinatari-stabili-17-06-26.md` Q1 |
| A9-D15 + M3-D31 | 18-06-26 | IMPOSTAZIONI | **Rimuovi limite coperti giornaliero** | MATTEO | CORRETTIVA | capacity-model | `18-06-26/Report-limiti-coperti-nuovo-modello-18-06-26.md` §11 R1 |
| A9-D16 + M3-D37 | 18-06-26 | IMPOSTAZIONI | Limite per-fascia solo pubblico + toggle | MATTEO | ORIGINATA | capacity-model | stesso R1 |
| A9-D17 | 18-06-26 | IMPOSTAZIONI | Toggle rifiuta fuori fasce (OFF) | MATTEO | SCELTA | capacity-model | stesso R1 AskUserQuestion |
| A9-D18 | 18-06-26 | UI-UX | Badge calendario: somma fasce / conteggio | MATTEO | SCELTA | calendar-badge | stesso R1 |
| A9-D19 | 18-06-26 | PRODOTTO | Nessun limite default nuove aziende | MATTEO | ORIGINATA | soft-defaults | stesso R1 |
| A9-D20 | 18-06-26 | SICUREZZA | Edge limiti: TEST sì, PROD solo con conferma | MATTEO | ORIGINATA | prod-gate | stesso R1 |
| A9-D21 | 18-06-26 | TESTING | Controtest batch 1 OK | MATTEO | APPROVATA | blindatura-qa | `18-06-26/Report-prepara-prompt-fix-batch2-18-06-26.md` §11 R1 |
| A9-D22 | 18-06-26 | AI-METODO | Prepara prompt batch 2 + commit docs | MATTEO | ORIGINATA | prepara-prompt | stesso R1 |
| A9-D23 | 18-06-26 | UI-UX | Copy limiti Classic ≠ Pro | MATTEO | CORRETTIVA | capacity-copy | `18-06-26/Report-fix-p1-fasce-capienza-batch2-18-06-26.md` §11 R1 |
| A9-D24 | 18-06-26 | COMPLIANCE | Campagne: solo clienti con consenso | MATTEO | DELEGATA | marketing-consent | `18-06-26/Report-fix-p3-consenso-marketing-campagne-18-06-26.md` §11 R1 |
| A9-D25 | 18-06-26 | COMPLIANCE | Consenso art.9 dati alimentari | MATTEO | DELEGATA | dietary-gdpr | `18-06-26/Report-consenso-alimentare-gdpr-18-06-26.md` §11 R1 |
| A9-D26 | 18-06-26 | TESTING | Controtest consenso alimentare OK | MATTEO | APPROVATA | dietary-qa | stesso R1 |
| A9-D27 | 18-06-26 | FLUSSO | Privacy nuova scheda; no sessionStorage | MATTEO | SCELTA | privacy-nav | `18-06-26/Report-privacy-dietary-guest-count-18-06-26.md` §1 |
| A9-D28 | 18-06-26 | UI-UX | guest_count 0 su intolleranze testo | MATTEO | DELEGATA | dietary-display | stesso §11 R1 |
| A9-D29 | 18-06-26 | UI-UX | «Torna alla prenotazione» deve chiudere | MATTEO | CORRETTIVA | privacy-nav | stesso R1 |
| A9-D30 | 18-06-26 | UI-UX | Segnala multi-tab Form+Privacy | MATTEO | ORIGINATA | multi-tab-bug | `18-06-26/Report-privacy-back-button-multiple-tabs-18-06-26.md` §11 R1 |
| A9-D31 | 18-06-26 | FLUSSO | Orario notturno Prenota | MATTEO | DELEGATA | overnight-hours | `18-06-26/Report-orario-notturno-prenota-18-06-26.md` §11 R1 |
| A9-D32 | 18-06-26 | UI-UX | Badge «Consenso non fornito» admin | MATTEO | DELEGATA | dietary-admin | `18-06-26/Report-admin-dietary-display-batch2-18-06-26.md` §11 R1 |
| A9-D33 | 18-06-26 | PROCESSO | Rotella già ok — togli dal batch | MATTEO | CORRETTIVA | product-scoping | `18-06-26/Report-prepara-prompt-fix-batch2-18-06-26.md` §11 R1 |
| A9-D34 | 19-06-26 | UI-UX | Privacy = modale in-page (non due tab) | CONGIUNTA | SCELTA | privacy-modal | `19-06-26/Report-release-produzione-privacy-limiti-consensi-19-06-26.md` §11 R1 |
| A9-D35 | 19-06-26 | SICUREZZA | Autorizza 3 passi PROD (053/054/edge) | MATTEO | APPROVATA | prod-ops | stesso R1 |
| A9-D36 | 19-06-26 | PROCESSO | Release PrenotaZen post-merge | MATTEO | DELEGATA | release-gate | stesso R1 |
| A9-D37 | 19-06-26 | COMPLIANCE | Unsubscribe via link (solo marketing) | MATTEO | ORIGINATA | unsubscribe | `19-06-26/Mappa-fix-ux-batch-19-06-26.md` Fix 9 |
| A9-D38 | 19-06-26 | FLUSSO | Cliente resta in rubrica dopo revoca | MATTEO | ORIGINATA | unsubscribe | stesso Fix 9 |
| A9-D39 | 19-06-26 | FLUSSO | Prune disiscritti opzione B (auto, no Salva) | MATTEO | SCELTA | campaign-prune | `19-06-26/Report-release-crm-destinatari-campagne-19-06-26.md` §11 R1 |
| A9-D40 | 19-06-26 | UI-UX | Contatori campagna = solo eleggibili | MATTEO | DELEGATA | campaign-counters | `19-06-26/Report-fix-crm-contatori-destinatari-campagna-19-06-26.md` §11 R1 |
| A9-D41 | 19-06-26 | UI-UX | Toggle ri-click chiude editor campagna | MATTEO | DELEGATA | fu-email-10 | `19-06-26/Report-fix-crm-campagna-toggle-card-19-06-26.md` §11 R1 |
| A9-D42 | 19-06-26 | UI-UX | Chiudi editor dopo Salva/Annulla | MATTEO | DELEGATA | campaign-close | `19-06-26/Report-fix-crm-campagna-chiudi-card-19-06-26.md` §11 R1 |
| A9-D43 | 19-06-26 | UI-UX | Fix rotella reale (passive wheel) | MATTEO | DELEGATA | input-wheel | `19-06-26/Report-fix-rotella-input-number-19-06-26.md` §11 R1 |
| A9-D44 | 19-06-26 | UI-UX | Scroll a sezione menù su errore | MATTEO | CORRETTIVA | form-scroll | `19-06-26/Report-scroll-menu-section-prenota-19-06-26.md` §11 R1 |
| A9-D45 | 19-06-26 | UI-UX | Frecce riordino fasce Pro | MATTEO | DELEGATA | servizio-order | `19-06-26/Report-riordino-fasce-pro-serviceslots-19-06-26.md` §11 R1 |
| A9-D46 | 19-06-26 | UI-UX | Sidebar hidden resta chiusa dopo nav | MATTEO | ORIGINATA | admin-shell | `19-06-26/Mappa-fix-ux-batch-19-06-26.md` Fix 3 |
| A9-D47 | 19-06-26 | UI-UX | Una tipologia: card visibile non cliccabile | MATTEO | ORIGINATA | booking-modes | stesso Fix 7 |
| A9-D48 | 19-06-26 | UI-UX | Tab admin mobile: icona sopra testo | MATTEO | ORIGINATA | admin-nav | stesso Fix 8 |
| A9-D49 | 19-06-26 | LEGALE | Privacy brand → PrenotaZen | MATTEO | ORIGINATA | brand-legal | stesso Fix 1 |
| A9-D50 | 19-06-26 | UI-UX | Card pending mobile: testo sotto icona | MATTEO | ORIGINATA | booking-card | stesso Fix 2 |
| A9-D51 | 19-06-26 | UI-UX | Riepilogo non sotto «Invia Prenotazione» | MATTEO | ORIGINATA | prenota-summary | stesso Fix 4 |
| A9-D52 | 19-06-26 | UI-UX | Label «Foto Categoria» Menu QR | MATTEO | ORIGINATA | menu-qr | stesso Fix 5 |
| A9-D53 | 19-06-26 | FLUSSO | «Richieste speciali» = solo note utente | MATTEO | ORIGINATA | special-requests | stesso Fix 6 |
| A9-D54 | 19-06-26 | TESTING | QA unsubscribe su email reale OK | MATTEO | APPROVATA | unsubscribe-qa | `19-06-26/SESSION_LOG.md` Fix 9 |

### G — lavoro privato (peso 3) — 138 righe

| ID (tutte le fonti fuse) | Data | Tipo | Oggetto | Chi | Autonomia | Skill | Fonte |
|---|---|---|---|---|---|---|---|
| G1-D01 | 04-06-26 | FORMAZIONE | Scuola continua via chat senior | MATTEO | ORIGINATA | didactic-system | `Scuola/PIANO_SISTEMA_DIDATTICO.md` L8 |
| G1-D02 | 04-06-26 | FORMAZIONE | Focus primario = metodo lavoro con AI | MATTEO | ORIGINATA | ai-method-learning | `Scuola/PROFILO_SCOLASTICO.md` L14-15 |
| G1-D03 | 04-06-26 | FORMAZIONE | Apprendimento just-in-time dal problema chat | MATTEO | ORIGINATA | jit-learning | `PROFILO_SCOLASTICO.md` L15-17 |
| G1-D04 | 04-06-26 | FORMAZIONE | Tre sessioni: progetta ≠ raccogli ≠ costruisci | MATTEO | ORIGINATA | separation-of-concerns | `PIANO_SISTEMA_DIDATTICO.md` L20-22 |
| G1-D05 | 04-06-26 | FORMAZIONE | Parti micro, cresci sui dati (anti over-eng) | CONGIUNTA | APPROVATA | anti-overengineering | `PIANO` L14-16; `PROFILO` L22-23 |
| G1-D06 | 04-06-26 | FORMAZIONE | Materiale didattico reale, non inventato | MATTEO | ORIGINATA | source-integrity | `PIANO` L17-19; prompt gemello |
| G1-D07 | 04-06-26 | FORMAZIONE | Sezione «Lezione della chat» a 5 punti | MATTEO | ORIGINATA | lesson-of-chat | `PIANO` L139-143 |
| G1-D09 | 04-06-26 | FORMAZIONE | Salto-lezione tracciato se rifiuta | MATTEO | ORIGINATA | lesson-tracking | `PROFILO` L60-61 |
| G1-D10 | 04-06-26 | FORMAZIONE | File Scuola self-contained; passa a mano | MATTEO | ORIGINATA | privacy-docs · self-contained | `PIANO` L185-189 |
| G1-D11 | 04-06-26 | AI-METODO | Intro termini in grassetto = soft, non hook | CONGIUNTA | SCELTA | soft-vs-enforcement | `PIANO` L89-92 |
| G1-D12 | 04-06-26 | FORMAZIONE | Scala livelli: Sento→So spiegare→Lo uso→Lo insegno | CONGIUNTA | APPROVATA | skill-level-scale | `PROFILO` L7; `PIANO` L96-97 |
| G1-D13 | 04-06-26 | FORMAZIONE | Tre file vivi: Profilo / Glossario / Roadmap | CONGIUNTA | APPROVATA | didactic-architecture | `PIANO` L50-54 |
| G1-D14 | 04-06-26 | FORMAZIONE | Auto-dichiarazione: principiante, no tech formale | MATTEO | ORIGINATA | self-assessment · PESO1 | `PROFILO` L13 |
| G1-D15 | 04-06-26 | FORMAZIONE | Prompt agente esterno per fonti canoniche | MATTEO | ORIGINATA | didactic-sourcing | `PROMPT_RACCOLTA_MATERIALE_DIDATTICO.md` |
| G1-D16 | 19-06-26 | TESTING | Checklist flussi da testare a mano (file vivo) | MATTEO | ORIGINATA | qa-human-checklist | `Test e2e/_INDICE.md` L3-4 |
| G1-D17 | 19-06-26 | TESTING | Archivia solo se conferma esplicita di Matteo | MATTEO | ORIGINATA | acceptance-ownership | `_INDICE.md` L34-36 |
| G1-D18 | 19-06-26 | TESTING | Escluso QA Playwright agenti senza sua conferma | MATTEO | ORIGINATA | acceptance-ownership | `_INDICE.md` L36 |
| G1-D19 | 20-06-26 | TESTING | Controtest visivo PRN-04 e ADM-FORM-01 | MATTEO | APPROVATA | hands-on-qa | `_INDICE.md` L5; AREA_A/B |
| G1-D20 | 19-06-26 | TESTING | Viewport obbligatori 375 / 834 / 1280 | CONGIUNTA | APPROVATA | multi-viewport-qa | `CHECKLIST_FLUSSI` L5; legenda |
| G1-D21 | ? | TESTING | Blindatura Prenota = LIVE in produzione (M0) | CONGIUNTA | APPROVATA | blindatura-prodotto | `Verifica Blindatura - Pagina Prenota/00-PANORAMICA.md` L5 |
| G1-D22 | 06-06-26 | TESTING | Blindatura Menu QR di prodotto | CONGIUNTA | APPROVATA | blindatura-prodotto | `Verifica Blindatura - Menu QR/00-PANORAMICA.md` L5 |
| G1-D23 | 16-06-26 | TESTING | Admin Classic 5 sezioni blindate; Pro fuori | CONGIUNTA | APPROVATA | release-scope | `Verifica Blindatura - Admin/00-PANORAMICA.md` |
| G1-D24 | ? | TESTING | Manuale residuo: swipe/asset/estetico | CONGIUNTA | APPROVATA | qa-residual-manual | Prenota `00-PANORAMICA` «NON sono coperti» |
| G1-D25 | ? | TESTING | Criterio pass = «cosa fai → vedi questo» | MATTEO | ORIGINATA | acceptance-criteria | `VERIFICA-IN-DEV.md` (tutte e 3) |
| G1-D26 | ? | PROCESSO | Comandi E2E/Vitest/seed per operare senza agente | MATTEO | ORIGINATA | ops-autonomy | `Comandi/E2E Comandi Matteo.md` L3 |
| G1-D28 | 16-06-26 | SICUREZZA | SQL utenti/edition testati sul DB TEST | CONGIUNTA | APPROVATA | db-ops | `Comandi Gestione Utenti DB.md` L9 |
| G1-D29 + M4-D01 | 12-06-26 | VENDITA | Mercato solo Italia per ora | MATTEO | ORIGINATA | go-to-market | `Analisi Fable/Report-analisi-legale-vendita` L4 |
| G1-D30 | 12-06-26 | VENDITA | Vendita mista: diretta poi self-service | MATTEO | ORIGINATA | go-to-market | stesso report L4 |
| G1-D31 | 12-06-26 | VENDITA | Nessuna attività aperta (pre-lancio) | MATTEO | ORIGINATA | commercial-stage | stesso report L4 |
| G1-D32 | 12-06-26 | VENDITA | Proposta prezzi Classic/Pro/add-on (da approvare) | AGENTE | DELEGATA | pricing · IPOTESI | stesso report §Parte 2; Masterplan AL-F |
| G1-D34 | 12-06-26 | LEGALE | Bloccanti: P.IVA, ToS B2B, fattura elettronica | AGENTE | APPROVATA | legal-readiness · IPOTESI | Report legale-vendita §1 |
| G1-D35 + G1-D49 + M4-D16 | 23-05-26 | LEGALE | DPA Supabase firmato (copia in Legali) | MATTEO | APPROVATA | compliance-execution | `Cose-da-fare-per-produzione.md` L14 |
| G1-D36 | 23-05-26 | LEGALE | Distinzione DPA Supabase ≠ DPA verso ristoranti | CONGIUNTA | APPROVATA | processor-chain | `Cose-da-fare` L16 |
| G1-D37 | 23-05-26 | SICUREZZA | MFA + leaked password + key ruotata | MATTEO | APPROVATA | prod-hardening | `Cose-da-fare` L12-17 |
| G1-D38 | 23-05-26 | PROCESSO | Repo pubblica nuova senza `docs/` interni | MATTEO | APPROVATA | release-hygiene | `Cose-da-fare` L44; `GUIDA-repo-pulito` |
| G1-D40 + I1-D19 | 12-06-26 | AI-METODO | AL-F prezzi/legale solo dopo decisione Matteo | MATTEO | ORIGINATA | decision-gates | Masterplan L37 |
| G1-D41 | 12-06-26 | TESTING | Priorità fix: drift migrazioni + lettura cross-tenant | AGENTE | APPROVATA | security-prioritization · IPOTESI | `Report-analisi-solidita` §5 |
| G1-D42 | 12-06-26 | AI-METODO | Piano pulizia skill A/B/C da autorizzare | AGENTE | DELEGATA | skill-slim · IPOTESI | `Report-analisi-skill-system` L8-9 |
| G1-D43 | mag-26 | PRODOTTO | Roadmap competitive Fase 1–4 (email, CRM, WA…) | INCERTO | APPROVATA | product-roadmap · IPOTESI | `Upgrade-da-Fare/Potenziamento_APP.md` |
| G1-D44 | ? | PRODOTTO | Super-admin edition: bassa priorità finché pochi tenant | MATTEO | ORIGINATA | console-deferral | `Upgrade-da-Fare/UI-super-admin-edition.md` L3-4 |
| G1-D45 | ? | UI-UX | Brief coppia sfondo Prenota landscape+portrait | MATTEO | ORIGINATA | asset-briefing | `PROMPT-sfondo-pagina-prenota-full-page.md` |
| G1-D46 | 06-08-26 | PROCESSO | Ripresa: Servizio + indagine skill (questo cantiere) | MATTEO | ORIGINATA | work-prioritization | `Da dove riprendere.md` |
| G1-D47 | ? | TESTING | Query SQL Studio per controverifica dati | MATTEO | APPROVATA | data-controverifica | `GUIDA_USO_QUERIES_CONTROVERIFICA.md` L1 |
| G1-D48 | ? | COMPLIANCE | Esiste template DPA verso ristoranti (path only) | CONGIUNTA | APPROVATA | dpa-clients | `Documenti Legali/DPA-template-clienti-ristoranti.md` |
| G1-D50 | ? | VENDITA | Analisi costi/IVA: prezzo basso poco sostenibile | AGENTE | APPROVATA | pricing-sustainability · IPOTESI | `Valutazione prezzo vendita/Analisi costi IVA.md` |
| G1-D51 | 31-05-26 | TESTING | Revoca OK falso su footer QR (era Prenota) | MATTEO | CORRETTIVA | acceptance-correction | `AREA_F_menu_qr.md` coda |
| G1-D52 | 29-05-26 | TESTING | Non archiviare promo multi-tipologia (mai confermato) | MATTEO | ORIGINATA | acceptance-ownership | `AREA_B` nota finale |
| G1-D53 | 19-06-26 | TESTING | Fix 9 disiscrizione marketing = pending decisione | MATTEO | SCELTA | decision-deferral | `CHECKLIST_FLUSSI` L17 |
| G2-D01 | 13-05-26 | FLUSSO | Tavoli sempre con sala obbligatoria | MATTEO | CORRETTIVA | sala-obbligatoria | `13-05-26/Debug…/AGENT_POST_DEBUG_HANDOFF.md` §Servizio |
| G2-D02 | 13-05-26 | UI-UX | Modifica sale da elenco dedicato | MATTEO | CORRETTIVA | gestione-sale | stesso file §Servizio |
| G2-D03 | 13-05-26 | FLUSSO | Walk-in: sceglie sala e tavolo libero | MATTEO | ORIGINATA | walkin-tavolo | stesso file §Walk-in |
| G2-D04 | 13-05-26 | IMPOSTAZIONI | Limite walk-in modificabile in impostazioni | MATTEO | ORIGINATA | limite-walkin | stesso file §Walk-in |
| G2-D05 | 13-05-26 | UI-UX | Icona distinta walk-in sul calendario | MATTEO | ORIGINATA | icona-walkin | stesso file §Calendario |
| G2-D06 | 13-05-26 | FLUSSO | Walk-in senza stato No-show | MATTEO | ORIGINATA | walkin-no-noshow | stesso file §Calendario |
| G2-D07 | 13-05-26 | FLUSSO | No-show sparisce dal calendario | MATTEO | ORIGINATA | no-show-visibilita | stesso file §Calendario |
| G2-D08 | 13-05-26 | UI-UX | Analytics: Settimana/Mese/Anno di calendario | MATTEO | CORRETTIVA | analytics-periodi | stesso file §Analytics |
| G2-D09 | 13-05-26 | PRODOTTO | Occupazione % coerente col periodo | MATTEO | ORIGINATA | occupancy-periodo | stesso file §Analytics 9bis |
| G2-D10 | 13-05-26 | IMPOSTAZIONI | Sale = entità DB separata | MATTEO | SCELTA | rooms-db | `13-05-26/…/01-Report-decisioni-13-05-26.md` §4.1 |
| G2-D11 | 13-05-26 | UI-UX | Mappa sala rettangolo configurabile | MATTEO | SCELTA | room-canvas | stesso §4.2 |
| G2-D12 | 13-05-26 | UI-UX | DnD mappa: @dnd-kit + SVG/HTML | MATTEO | SCELTA | dnd-accessibile | stesso §4.3 |
| G2-D13 | 13-05-26 | PROCESSO | Stato live mappa posticipato dopo F3 | MATTEO | SCELTA | scope-fasi | stesso §4.13 |
| G2-D14 | 13-05-26 | PRODOTTO | KPI F2: ticket, no-show, fonte | MATTEO | SCELTA | analytics-kpi | stesso §4.5 |
| G2-D15 | 13-05-26 | FLUSSO | No-show nel dettaglio calendario | MATTEO | SCELTA | no-show-azione | stesso §4.6 |
| G2-D16 | 13-05-26 | PRODOTTO | Confronto periodo su tutti i KPI | MATTEO | SCELTA | confronto-kpi | stesso §4.7 |
| G2-D17 | 13-05-26 | PRODOTTO | Filtro turno pranzo/cena in Analytics | MATTEO | SCELTA | filtro-turno | stesso §4.8 |
| G2-D18 | 13-05-26 | PRODOTTO | Home: alert + walk-in + briefing | MATTEO | SCELTA | home-priorita | stesso §4.9 |
| G2-D19 | 13-05-26 | PROCESSO | Ordine fasi: Servizio→Analytics→Home | MATTEO | SCELTA | roadmap-fasi | stesso §4.10 |
| G2-D20 | 13-05-26 | FLUSSO | Walk-in solo in admin, non pubblico | MATTEO | SCELTA | walkin-admin | stesso §4.11 |
| G2-D21 | 13-05-26 | PRODOTTO | Briefing HTML stampabile + PDF | MATTEO | SCELTA | briefing-turno | stesso §4.12 |
| G2-D22 | 13-05-26 | UI-UX | Mappa mobile sola lettura | MATTEO | SCELTA | mobile-mappa | stesso §4.14 |
| G2-D23 | 13-05-26 | SICUREZZA | Walk-in nel CHECK DB booking_type | MATTEO | SCELTA | integrita-walkin | stesso §4.15 |
| G2-D24 | 13-05-26 | UI-UX | Sidebar parte sempre chiusa | MATTEO | ORIGINATA | sidebar-collassata | `13-05-26/…/09-Report-rifinitura-dashboard.md` §Chiarimenti B |
| G2-D25 | 13-05-26 | UI-UX | Digest breakpoint statico 1390px | MATTEO | SCELTA | digest-responsive | stesso §Chiarimenti G |
| G2-D26 | 13-05-26 | IMPOSTAZIONI | Turni Pro solo se service_slots presenti | MATTEO | SCELTA | fasce-opt-in | stesso §Chiarimenti H |
| G2-D27 | 14-05-26 | UI-UX | Home sotto Header + Nav (bodyOverride) | MATTEO | CORRETTIVA | home-body | `14-05-26/Plan-blindatura-admin-e-edition-system.md` §1 |
| G2-D28 | 14-05-26 | FLUSSO | Click tab esce da Home in sidebar | MATTEO | APPROVATA | uscita-home | `14-05-26/Report-esecuzione-blindatura-edition.md` §Domande |
| G2-D29 | 14-05-26 | PRODOTTO | Default: Pro→Home, Classic→Calendario | MATTEO | SCELTA | default-edition | stesso §Domande |
| G2-D30 | 14-05-26 | SICUREZZA | Alert orario passato anche su salvataggio | MATTEO | ORIGINATA | alert-orario | `14-05-26/Report-alert-orario-passato-accettazione.md` §Domande |
| G2-D31 | 15-05-26 | FLUSSO | Una sola fonte dati per le fasce | MATTEO | ORIGINATA | source-of-truth | `15-05-26/Considerazioni-unificazione-fasce-orarie.md` §1–3 |
| G2-D32 | 15-05-26 | UI-UX | Parità fasce notturne Impostazioni↔Servizio | MATTEO | ORIGINATA | fasce-notturne | stesso §1 |
| G2-D33 | 15-05-26 | PRODOTTO | Classic tiene UI tre fasce senza sidebar | MATTEO | SCELTA | classic-fasce | stesso §3 |
| G2-D34 | 15-05-26 | PRODOTTO | Pro configura fasce da Servizio | MATTEO | SCELTA | pro-fasce | stesso §3 |
| G2-D35 | 15-05-26 | IMPOSTAZIONI | Preferenza storage iniziale = JSON B | MATTEO | SCELTA | storage-fasce-pref | stesso §1 / §4 |
| G2-D36 | 15-05-26 | PROCESSO | Agente valuta A vs B; ok se diverge | CONGIUNTA | DELEGATA | delega-architettura | stesso §4 |
| G2-D37 | 15-05-26 | PROCESSO | Numerazione migrazione fix → 020 | MATTEO | SCELTA | migrazione-univoca | `15-05-26/Report-pulizia-booking_time_slots-e-fix-PGRST202.md` §3 |
| G2-D38 | 15-05-26 | SICUREZZA | Autorizza apply MCP su PROD (fix PGRST) | MATTEO | APPROVATA | prod-autorizzata | stesso §3 |
| G2-D39 | 15-05-26 | PROCESSO | Non aggiornare skill system in quella chat | MATTEO | ORIGINATA | report-only | `15-05-26/Report-test-modifica-fascia-oraria-coperti.md` §4 |
| G2-D40 | 15-05-26 | SICUREZZA | Blindare sidebar su TEST; PROD dopo | MATTEO | SCELTA | test-prima-prod | `15-05-26/Revisionate…/Report-fix-definitivo-pgrst202….md` §7 |
| G2-D41 | 16-05-26 | UI-UX | Sidebar a 3 stati (hidden/icons/expanded) | MATTEO | ORIGINATA | sidebar-3stati | `16-05-26/Plan-Sidebar3stati.md` L5-10 |
| G2-D42 | 16-05-26 | AI-METODO | Checkpoint LOCK AdminShell: «procedi» | MATTEO | APPROVATA | checkpoint-lock | `16-05-26/Report-responsive-uniformazione.md` |
| G2-D43 | 17-05-26 | UI-UX | Modal fasce: info dietro toggle | MATTEO | CORRETTIVA | iterazione-ux | `17-05-26/Report-modal-fasce-info-toggle-e-menu-sempre.md` |
| G2-D44 | 19-05-26 | FLUSSO | Libera tavolo → prenotazione torna in coda | MATTEO | APPROVATA | verifica-flusso | `19-05-26/Report-libera-tavolo-ritorno-prenotazioni.md` |
| G2-D45 | 19-05-26 | PRODOTTO | Da 3 fasce fisse a N fasce dinamiche | INCERTO | DELEGATA | n-fasce · IPOTESI | `19-05-25/fase2-n-fasce-dinamiche.md` (refuso data) |
| G2-D46 | 22-05-26 | FLUSSO | Booking fuori fascia → bucket Fuori fascia | INCERTO | SCELTA | fuori-fascia | `22-05-26/Masterplan allineamento branch.md` §A2 |
| G2-D47 | 22-05-26 | SICUREZZA | Capacity check client + server | CONGIUNTA | APPROVATA | difesa-strati | `22-05-26/Report-A1-A2-A3-capacityCheck.md` |
| G2-D48 | 22-05-26 | TESTING | A5: dati TEST sbagliati, non il codice | MATTEO | APPROVATA | diagnosi-dati | `22-05-26/Report-A5-check-disponibilita-fascia-pubblica.md` |
| G2-D49 | 22-05-26 | PROCESSO | Rollout: DB prima del codice; no merge frettoloso | INCERTO | DELEGATA | rollout-controllato · IPOTESI | `22-05-26/Masterplan…` §C + `Report-C-rollout-produzione.md` |
| G2-D50 | 12-05-26 | PRODOTTO | Home = inizio turno (plan base) | INCERTO | APPROVATA | home-operativa · IPOTESI | `12-05-26/Plan-base-Migliorato.md` §Home |
| G2-D51 | 14-05-26 | PRODOTTO | Edition + feature flags (Classic vs Pro) | CONGIUNTA | APPROVATA | edition-system | `14-05-26/Report-esecuzione-blindatura-edition.md` + Plan blindatura |
| G2-D52 | 16-05-26 | FLUSSO | Override fasce per singola fascia + date | INCERTO | SCELTA | override-fascia · IPOTESI | `16-05-26/Report-pulsante-quando-override-fasce.md` |
| G2-D53 | 18-05-26 | FLUSSO | Filtro assegnazione prenotazioni per fascia | INCERTO | ORIGINATA | filtro-assegnazione · IPOTESI | `18-05-26/Report-filtro-prenotazioni-per-fascia.md` |
| G3-D01 | ? | FORMAZIONE | Schema fix: Problema→Componente→Flussi→Perché | MATTEO | ORIGINATA | explanation-schema | `Supporto/Metodo_spiegazioni_agenti_coding.md` L47-92 |
| G3-D02 | ? | AI-METODO | Ruoli: Matteo prodotto/UX; agente build/migra | MATTEO | ORIGINATA | role-split | `Metodo` L17-19 |
| G3-D03 | ? | FORMAZIONE | «spiegamelo semplice» = immagine + chi fa cosa | MATTEO | ORIGINATA | spiegamelo-semplice | `Metodo` L31-45 |
| G3-D04 | ? | AI-METODO | Separare: modifica agente / regola mia / tool / UX | MATTEO | ORIGINATA | agency-clarity | `Metodo` L35-41 |
| G3-D05 | ? | AI-METODO | Niente rischi automatici: fermati e chiedi | MATTEO | ORIGINATA | ask-before-risk | `Metodo` L94-98 |
| G3-D06 | ? | TESTING | Comunica i test solo se falliscono o servono | MATTEO | ORIGINATA | test-signal-discipline | `Metodo` L112-122 |
| G3-D07 | ? | FORMAZIONE | Didattica solo se chiesta esplicitamente | MATTEO | ORIGINATA | didactic-on-demand | `Metodo` L124-128 |
| G3-D08 | ? | PRODOTTO | Decisione prodotto/UX finale torna a Matteo | MATTEO | ORIGINATA | product-ownership | `Metodo` L19 |
| G3-D09 | ? | AI-METODO | Dubbi da fermare: prod/test, QR≠Prenota, Classic/Pro | MATTEO | ORIGINATA | ambiguity-gates | `Metodo` L100-110 |
| G3-D10 | 28-05-26 | PROCESSO | Un solo file analisi in `_lavoro`, no meta in skill ufficiali | MATTEO | CORRETTIVA | doc-hygiene · anti-meta-creep | `Supporto/ANALISI_RACCOLTA_DATI_SKILL_SYSTEM.md.md` L234-236 |
| G3-D11 | 28-05-26 | AI-METODO | Gap: Metodo locale più ricco di COMUNICAZIONE ufficiale | CONGIUNTA | APPROVATA | skill-gap-awareness | `ANALISI` §6.2 L151 |
| G3-D12 | 28-05-26 | PROCESSO | Report in Sessioni pubbliche, non in `_lavoro` | MATTEO | ORIGINATA | report-placement | `ANALISI` §3 L64; §7 L175 |
| G3-D13 | 28-05-26 | AI-METODO | Schema lavoro: Matteo → agente → prova → aggiustamenti | CONGIUNTA | APPROVATA | collab-loop | `ANALISI` §3 L76 |
| G3-D14 | 28-05-26 | PRODOTTO | PWA admin: aggiorna all’apertura, no reload in sessione | CONGIUNTA | APPROVATA | pwa-update-policy | `ANALISI` §5.2 L120; `PWA_UPDATE_STRATEGY_PLAN.md` L3-7 |
| G3-D15 | ? | PRODOTTO | Priorità admin = coerenza post-deploy, non offline-first | MATTEO | SCELTA | multi-tenant-ops | `PWA_UPDATE` L11-13 |
| G3-D16 | ? | SICUREZZA | Service worker: no cache su dati Supabase/tenant | CONGIUNTA | APPROVATA | sw-data-safety | `PWA_UPDATE` L18 |
| G3-D17 | ? | FLUSSO | Deploy mid-sessione: aggiornamento solo al riavvio | CONGIUNTA | APPROVATA | no-mid-session-reload | `PWA_UPDATE` L31-35 |
| G3-D19 | apr-26 | PRODOTTO | Multi-tenant: schema consolidato in una migrazione | INCERTO | APPROVATA | schema-consolidation · IPOTESI | `CHANGELOG_v2` L41-48 |
| G3-D20 | apr-26 | FLUSSO | Route invito `/invite/:token` + retrocompat `/register` | INCERTO | APPROVATA | invite-routing · IPOTESI | `CHANGELOG_v2` L50-56 |
| G3-D21 | apr-26 | PROCESSO | Setup credenziali/org/token = compito manuale Matteo | AGENTE | DELEGATA | ops-handoff | `CHANGELOG_v2` L147-168 |
| G3-D22 | apr-26 | PRODOTTO | Email conferma: Edge `send-email` ancora mancante | AGENTE | APPROVATA | email-gap | `CHANGELOG_v2` L157-164; `EDGE_FUNCTIONS.md` L120-129 |
| G3-D23 | 08-05-26 | UI-UX | Design system custom shadcn-inspired, no dip nuova | INCERTO | APPROVATA | design-system · IPOTESI | `Storico/UI_REWRITE_PLAN.md` L3-14 |
| G3-D24 | 08-05-26 | UI-UX | Zone LOCKED: CollapsibleCard, Date/Time, Modal z-index | CONGIUNTA | APPROVATA | ui-lock-zones | `UI_REWRITE_PLAN` L20-29 |
| G3-D25 | 08-05-26 | UI-UX | Strategia alias `al-ritrovo-*` → poi rimozione | CONGIUNTA | APPROVATA | token-migration | `UI_REWRITE_PLAN` L63-71 |
| G3-D26 | 08-05-26 | AI-METODO | Una fase UI per run Cursor; validate dopo ogni file | CONGIUNTA | APPROVATA | incremental-ui-runs | `UI_REWRITE_PLAN` L268-276 |
| G3-D27 | 08-05-26 | UI-UX | Token consolidation PRIMA di riscrivere componenti | CONGIUNTA | APPROVATA | token-first | `UI_REWRITE_PLAN` L73-75 |
| G3-D28 | ? | UI-UX | Alfabeto UI: feature solo con primitivi ui/ | INCERTO | APPROVATA | ui-primitives · IPOTESI | `Storico/alfabeto app..md` L1-3 |
| G3-D29 | ? | UI-UX | Warm-* solo pagine pubbliche; primary-* admin | CONGIUNTA | APPROVATA | theme-split | `alfabeto` L305-307; `UI_REWRITE` L57-61 |
| G3-D30 | ? | FUORI-SCHEMA | Due client Supabase: sessione vs pubblico | INCERTO | APPROVATA | dual-supabase · IPOTESI | `Storico/ARCHITECTURE.md` L116-125 |
| G3-D31 | ? | FUORI-SCHEMA | React Query = server state; useState = UI | INCERTO | APPROVATA | state-split · IPOTESI | `ARCHITECTURE` L46-63 |
| G3-D32 | ? | TESTING | Stack: Vitest + MSW + Playwright + Husky + GHA | INCERTO | APPROVATA | test-stack · IPOTESI | `Storico/TESTING.md` L5-14 |
| G3-D33 | ? | TESTING | Playwright e2e fuori CI (serve staging) | CONGIUNTA | APPROVATA | e2e-ci-deferral | `TESTING.md` L120 |
| G3-D34 | ? | TESTING | Checklist manuale pre-deploy (~30 min) | INCERTO | APPROVATA | manual-qa-plan · IPOTESI | `Storico/MANUAL_TEST_PLAN.md` L1-3 |
| G3-D36 | 02-08-26 | TESTING | E2E S4: 4 corsie MCP parallele + consolidamento | CONGIUNTA | APPROVATA | parallel-e2e-lanes | `e2e-s4/LANCIO_AMBIENTE.md` L27-43 |
| G3-D37 | 02-08-26 | SICUREZZA | Agenti e2e: solo UI, niente SQL/CLI Supabase | CONGIUNTA | APPROVATA | e2e-ui-only | `LANCIO_AMBIENTE` L47 |
| G3-D38 | 02-08-26 | TESTING | Se isolamento fallisce → lanciare a due a due | CONGIUNTA | APPROVATA | e2e-fallback | `LANCIO_AMBIENTE` L39 |
| G3-D39 | 02-08-26 | SICUREZZA | Ambiente e2e solo su branch/env TEST | CONGIUNTA | APPROVATA | env-safety | `LANCIO_AMBIENTE` L9-11 |

### I — piani `.cursor/plans` (peso 2–3) — 50 righe

| ID (tutte le fonti fuse) | Data | Tipo | Oggetto | Chi | Autonomia | Skill | Fonte |
|---|---|---|---|---|---|---|---|
| I1-D02 | 02-08-26 | SICUREZZA | Token = account TEST isolato da PROD | MATTEO | ORIGINATA | env-isolation | stesso L25-26 |
| I1-D03 | 02-08-26 | PROCESSO | Verifica registro per nomi, non a mano cieca | MATTEO | SCELTA | migration-hygiene | stesso L27 |
| I1-D04 + M3-D49 | 02-08-26 | SICUREZZA | `db push --include-all` vietato per sempre | CONGIUNTA | APPROVATA | env-safety | stesso L73 |
| I1-D05 | 02-08-26 | FLUSSO | Sostituzione tavolo: 3 uscite (sposta/archivia/attesa) | MATTEO | ORIGINATA | service-ux-scoping | `.claude/plans/fix-sostituzione-tavolo-occupato.md` L6-7 · L65-71 |
| I1-D07 | 02-08-26 | PRODOTTO | Fasce sovrapposte = difetto da chiudere | MATTEO | CORRETTIVA | overlap-validation | stesso L175 |
| I1-D08 | 02-08-26 | PROCESSO | Riusa `validateSlotConfigs`, non seconda copia | AGENTE | SCELTA | reuse-not-duplicate | stesso L184 |
| I1-D09 | ? | UI-UX | Servizio: sala visibile senza fascia (opz. A) | MATTEO | SCELTA | service-map-ux | `.cursor/plans/prompt_fix_servizio_ui_06bf20bf.plan.md` L99 |
| I1-D10 | ? | UI-UX | Strip assegnate: note poi intolleranze (opz. A) | MATTEO | SCELTA | service-card-info | stesso L116 |
| I1-D11 | ? | UI-UX | Collapse fasce Servizio chiusa di default | INCERTO | APPROVATA | ui-density | stesso FIX-1 L67 |
| I1-D12 | 19-05-26 | PRODOTTO | Classic: digest = TUTTE le fasce, non solo canonical | MATTEO | ORIGINATA | product-scoping | `.cursor/plans/fase2-n-fasce-dinamiche-classic.md` L25-26 · L48-50 |
| I1-D13 | 19-05-26 | PRODOTTO | `is_canonical` deprecato funzionalmente | MATTEO | SCELTA | schema-deprecation | stesso §B L61-65 |
| I1-D14 | 19-05-26 | IMPOSTAZIONI | Flag `booking_time_slots_enabled` on/off | MATTEO | ORIGINATA | feature-toggle | stesso §C L67-70 |
| I1-D15 | ? | UI-UX | Sfondo Prenota mobile: strategia A+B | MATTEO | SCELTA | mobile-viewport | `fix_sfondo_prenota_mobile_09dc5137.plan.md` L97 |
| I1-D16 | ? | UI-UX | Sfondo scrollabile absolute = NO | MATTEO | CORRETTIVA | scope-rejection | stesso §D (titolo) |
| I1-D17 | 12-06-26 | AI-METODO | AL-D fusioni skill ok file-per-file | MATTEO | APPROVATA | skill-governance | `masterplan_allineamento_skill-codice_5dda551f.plan.md` L38 |
| I1-D18 | 12-06-26 | AI-METODO | AL-E solo design; cancello = Meta+Matteo | MATTEO | ORIGINATA | meta-gates | stesso L39 |
| I1-D21 | ? | UI-UX | Limite testi lunghi Prenota = 800 | MATTEO | SCELTA | copy-limits | `limiti_testo_prenota_acf95e24.plan.md` L163 |
| I1-D25 | ? | PRODOTTO | Niente prezzo sul carosello Prenota | INCERTO | APPROVATA | product-scoping | `carosello_editor_per-foto_da509b16.plan.md` L38-41 |
| I1-D26 | ? | PRODOTTO | NIENTE toggle capability nel pannello admin | MATTEO | ORIGINATA | anti-admin-toggle | `ho-riavviato-il-server-ticklish-newt.md` L184 |
| I1-D27 | ? | VENDITA | Rimuovi coperto + +2€ caraffe su branch dedicato | INCERTO | APPROVATA | pricing-change | `rimozione-coperto-e-aumento-caraffe_d20ebb87.plan.md` L28-30 |
| I1-D28 | 22-05-26 | TESTING | Validate 127/127 + verifica manuale Matteo | MATTEO | APPROVATA | human-qa-gate | `master-plan-stabilizzazione-e-merge-main.md` L250 |
| I1-D29 | 22-05-26 | FLUSSO | Check capacità anche sul form pubblico (A5) | INCERTO | CORRETTIVA | public-capacity-gate | stesso L265-269 |
| I1-D30 | 01-02-26 | FLUSSO | Conservazione: prossima manut. = più vicina | INCERTO | SCELTA | haccp-card-logic | `PLAN_COMPLETO_conservation_checkup.md` L23 |
| I1-D31 | 01-02-26 | FLUSSO | Completamenti multipli manutenzione ammessi | INCERTO | SCELTA | haccp-multi-complete | stesso L119 area |
| I1-D32 | ? | AI-METODO | Controverifica parallela Fase 3 (template) | AGENTE | DELEGATA | controverifica-plan | `fase_3_controverifica_parallela_cdc56762.plan.md` overview/todos |
| I1-D33 | ? | PROCESSO | Cleanup repo completo (11 todos completed) | INCERTO | APPROVATA | repo-hygiene | `complete_repository_cleanup_66937f40.plan.md` todos |
| I1-D34 | ? | SICUREZZA | Keep-alive Supabase (3 todos completed) | INCERTO | APPROVATA | infra-keepalive | `keep-alive_supabase_512e58cb.plan.md` |
| I1-D35 | ? | AI-METODO | Prep skill-system v0 (6 todos completed) | INCERTO | APPROVATA | template-extraction | `skill_system_v0_prep_9ddffabe.plan.md` |
| I2-D02 | 28-02-26? | PRODOTTO | Timer = cronometro; fine solo per morte | MATTEO | ORIGINATA | game-rules-scoping | stesso L45–51 |
| I2-D03 | 28-02-26? | PRODOTTO | Ondate sì; boss dopo 5 wave | MATTEO | ORIGINATA | wave-design | stesso L47–49 |
| I2-D04 | 28-02-26? | PROCESSO | Plan.md: aggiungere senza cancellare testo | AGENTE | APPROVATA | doc-non-destructive | stesso L20–36 |
| I2-D05 | 28-02-26? | AI-METODO | Workflow: 1–3 file + report; run con 1 ondata | INCERTO | APPROVATA | session-budget | stesso L12 |
| I2-D06 | ? | UI-UX | Colori card per tipo (grey/yellow/red/…) | MATTEO | ORIGINATA | ui-token-mapping | `card_skills_ui_e_colori_c9860fb8.plan.md` L50–56 |
| I2-D07 | ? | PRODOTTO | Prime 3 carte: +HP, MUL, value 2→3→5 | INCERTO | APPROVATA | progression-design | `survivor_card_upgrades_9a38c907.plan.md` L58–64 |
| I2-D08 | 05-03-26? | PRODOTTO | Frazioni numeri solo da wave 11 (25%→35%) | INCERTO | SCELTA | difficulty-curve | `fixes_4_5_6_survivor_50cc2fbf.plan.md` L13–14 · L38–40 |
| I2-D09 | 05-03-26? | PRODOTTO | Boss equazione range 35–60, +5 per boss | INCERTO | SCELTA | boss-scaling | stesso L14 |
| I2-D11 | 05-03-26? | PRODOTTO | Enemy level a fasce di 10 wave (max 8) | INCERTO | APPROVATA | difficulty-curve | stesso L149–154 |
| I2-D12 | 03-03→05-03? | PROCESSO | Dopo CTRL+Z: solo doc/gap, zero fix codice in fase | INCERTO | APPROVATA | recovery-via-docs | `readme_sessioni_e_gap_survivor_b3c8e273.plan.md` L12 · L151 |
| I2-D15 | 22-05-26 | SICUREZZA | PreChat Step 1: zero campi liberi (anti-injection) | CONGIUNTA | ORIGINATA | structural-safety | stesso L31 · L25–26 |
| E1-D30 + I2-D16 | 22-05-26 | PRODOTTO | Max 5 screenshot/chat per tutti i tier in v0 | CONGIUNTA | CORRETTIVA | product-cap | stesso L33 |
| I2-D17 | 22-05-26 | PRODOTTO | Set base = 3 TF cascata Aware Trader | CONGIUNTA | SCELTA | domain-framing | stesso L32 |
| I2-D18 | 22-05-26 | AI-METODO | Dev: OpenRouter al posto di Gemini via env | INCERTO | APPROVATA | cost-aware-dev | `openrouter-dev-mode-provider.plan.md` L23–34 |
| I2-D19 | ? | AI-METODO | Benchmark Tutor: decidere formato 5 vs 6 sezioni | MATTEO | SCELTA | test-fixture-design | `prompt_tutor_benchmark_7d153a96.plan.md` L8–9 |
| I2-D20 | 28-12-24? | PRODOTTO | Condividimi: mobile RN, pairing QR chiuso | INCERTO | APPROVATA | greenfield-prd | `prd_condividimi_b4810161.plan.md` L28–36 |
| I2-D21 | 28-12-24? | PRODOTTO | Layer fiducia definiti dall’utente | INCERTO | APPROVATA | trust-model | stesso L32 |
| I2-D22 | 28-12-24? | PROCESSO | PRD unificato: 6 todo docs tutti completed | AGENTE | DELEGATA | prd-to-checklist | `prd_unificato_condividimi_5a5127ff.plan.md` L5–21 |
| I2-D23 | ? | AI-METODO | Test modelli: 1 slug default; stima+$ conferma | MATTEO | ORIGINATA | cost-gate | `sessione_test_modelli_71726696.plan.md` L130–142 |
| I2-D24 | ? | AI-METODO | Max 1 file nuovo nello skill system test | INCERTO | APPROVATA | skill-minimalism | stesso L30 |
| I2-D27 | ? | UI-UX | Delay 3s tra fine wave e card screen | INCERTO | APPROVATA | pacing | `delay_3s_prima_card_0f91c560.plan.md` overview |
| I2-D28 | ? | PRODOTTO | Boss missile = sprite sheet 30 frame | AGENTE | DELEGATA | asset-integration | `boss_missile_animato_33c30fb8.plan.md` overview · 4/4 completed |

### B–F — archivi: BHM-Zen, HACCP legacy, CB-old, trading (peso 3) — 421 righe

| ID (tutte le fonti fuse) | Data | Tipo | Oggetto | Chi | Autonomia | Skill | Fonte |
|---|---|---|---|---|---|---|---|
| B1-D01 | 06-07-26 | COMPLIANCE | Audit append-only: storno, mai DELETE | MATTEO | ORIGINATA | audit-immutability | `meta/MAPPATURA_AREE/DECISIONI_OWNER_BETA.md` #1 |
| B1-D02 | 06-07-26 | PRODOTTO | Dashboard ricca, dati reali (no fabbricati) | MATTEO | SCELTA | product-honesty | stesso #2 |
| B1-D03 | 06-07-26 | PRODOTTO | Liste spesa in beta (4 RPC + unifica stack) | MATTEO | SCELTA | product-scoping | stesso #3 |
| B1-D04 | 06-07-26 | PRODOTTO | Companies: solo P.IVA + ragione sociale | MATTEO | SCELTA | product-scoping | stesso #4 |
| B1-D05 | 06-07-26 | PRODOTTO | Notifiche: solo alert in-app, no preferenze | MATTEO | SCELTA | product-scoping | stesso #5 |
| B1-D06 | 06-07-26 | COMPLIANCE | HACCP Settings UI sola lettura (LOCK TS) | MATTEO | ORIGINATA | compliance-lock | stesso #6 |
| B1-D07 | 06-07-26 | PRODOTTO | «Sigilla la giornata» = shift-seal append-only | MATTEO | ORIGINATA | product-signature | stesso #7 |
| B1-D08 | 06-07-26 | FLUSSO | Temp+metodo obbligatori; note/foto opzionali | MATTEO | SCELTA | data-quality | stesso #8 |
| B1-D09 | 06-07-26 | PRODOTTO | 3 ruoli + inviti staff in beta | MATTEO | SCELTA | multi-role | stesso #9 |
| B1-D10 | 06-07-26 | FLUSSO | Ciclo scadenze completo (reinserimento+storico) | MATTEO | SCELTA | inventory-lifecycle | stesso #10 |
| B1-D11 | 06-07-26 | PRODOTTO | Sync multi-utente = live-refetch conflict-free | MATTEO | ORIGINATA | realtime-minimal | stesso Decisione 11 |
| B1-D12 | 06-07-26 | PRODOTTO | Inventario = mansione; spesa flessibile no completamento | MATTEO | ORIGINATA | inventory-as-task | stesso Decisione 12 |
| B1-D13 | 06-07-26 | FLUSSO | Calendario vista completa + completamento anticipato | MATTEO | ORIGINATA | calendar-depth | `FEATURE_Calendario_vista-completa.md` L6-9 |
| B1-D14 | 05-07-26 | PROCESSO | Repo nuova: riuso cervello, UI ricostruita | MATTEO | ORIGINATA | rebuild-strategy | `MASTERPLAN_RILANCIO_BHM_v2.md` §1 |
| B1-D15 | 05-07-26 | PROCESSO | Schema DB = verità (fondamenta prima) | MATTEO | ORIGINATA | schema-first | stesso §1 |
| B1-D16 | 05-07-26 | PRODOTTO | Beta Italia, 1 sede, gratis, no pagamenti | MATTEO | ORIGINATA | go-to-market | stesso §2 |
| B1-D17 | 05-07-26 | LEGALE | Sessione solo orario; niente geo/accelerometro | MATTEO | ORIGINATA | privacy-min | stesso §2 |
| B1-D18 | 05-07-26 | COMPLIANCE | Postura registro audit-grade / ente come qualità | MATTEO | ORIGINATA | compliance-ambition | stesso §3 |
| B1-D19 | 05-07-26 | COMPLIANCE | Spezza Ufficiale HACCP in 3 (regole/skill/runtime) | MATTEO | ORIGINATA | compliance-architecture | stesso §3 |
| B1-D20 | 05-07-26 | AI-METODO | Skill-system-v0 installato pulito in repo nuova | MATTEO | APPROVATA | skill-portability | stesso §1/§14 |
| B1-D21 | 05-07-26 | AI-METODO | Casa docs/ + 3 porte Cursor/Codex/Claude | MATTEO | APPROVATA | agent-entrypoints | stesso §8/§14.2 |
| B1-D22 | 05-07-26 | UI-UX | Naming Regia; responsive-everywhere; clinico-caldo | MATTEO | SCELTA | ui-direction | stesso §13 |
| B1-D23 | 05-07-26 | PRODOTTO | 4 case canoniche + loop IMPOSTO→FACCIO→CONTROLLO→DIMOSTRO | MATTEO | ORIGINATA | product-spine | stesso §9/§12 |
| B1-D24 | 05-07-26 | UI-UX | 3 gesti-firma beta (temp/cascata/timbro) | MATTEO | ORIGINATA | signature-gestures | stesso §10.3 |
| B1-D25 | 06-07-26 | UI-UX | Tempo animazioni = calma, non fretta (globale) | MATTEO | CORRETTIVA | motion-pacing | stesso §13.6; `MOCKUP_UI/00_INDICE_MOCKUP.md` |
| B1-D26 | 06-07-26 | AI-METODO | Idee esperienza: annota, non implementare | MATTEO | ORIGINATA | idea-capture | stesso §11 |
| B1-D27 | 06-07-26 | AI-METODO | Due lenti: Ufficiale × Ristoratore | MATTEO | ORIGINATA | dual-lens | stesso §9.5; `DESIGN_SKILL_CONSULENTI.md` |
| B1-D28 | 06-07-26 | AI-METODO | 6 archetipi Ristoratore confermati | MATTEO | SCELTA | archetype-design | `DESIGN_SKILL_CONSULENTI.md` §1.5 |
| B1-D29 | 06-07-26 | COMPLIANCE | Compliance beta da fonti ufficiali; gate-pro a certificazione | MATTEO | SCELTA | compliance-bootstrap | stesso §2.4-bis |
| B1-D30 | 06-07-26 | COMPLIANCE | Change-Control 3 gate; ok owner = gate umano | MATTEO | ORIGINATA | compliance-governance | masterplan §14.3 |
| B1-D31 | 06-07-26 | AI-METODO | Lessico-comando ereditato da v0, non reinventato | MATTEO | APPROVATA | skill-portability | `skill-system/comunicazione/VOCABOLARIO.md` §A |
| B1-D32 | 06-07-26 | AI-METODO | Didattico OFF in beta | MATTEO | SCELTA | scope-control | `00_BUSSOLA_SKILL.md` §5; masterplan §14.2 |
| B1-D34 | 06-07-26 | AI-METODO | Scarta anteprima HTML fissa in prepara-prompt | MATTEO | CORRETTIVA | anti-bureaucracy | `PROPOSTE.md` [SCARTATA] |
| B1-D35 | 06-07-26 | AI-METODO | Voce «delego»/modalità team Liv.2 | MATTEO | ORIGINATA | team-delegation | VOCABOLARIO §A; masterplan §15.1 |
| B1-D36 | 06-07-26 | AI-METODO | Kit team on-demand, NON prassi default | MATTEO | ORIGINATA | team-on-demand | `COLLABORAZIONE_TEAM/01_DESIGN_METODO.md` §6.1 |
| B1-D37 | 06-07-26 | PROCESSO | Solo owner promuove `main`; collab su feature/* | MATTEO | ORIGINATA | git-governance | stesso L86-109 |
| B1-D38 | 06-07-26 | TESTING | Gate ② = controverifica visiva umana | MATTEO | ORIGINATA | human-verify | `05_GATE_E_CONTROVERIFICA.md` L31 |
| B1-D39 | 06-07-26 | SICUREZZA | MCP Supabase vietato; solo CLI | MATTEO | ORIGINATA | env-safety | `FABLE_CHECKPOINT.md` Decisione 2 |
| B1-D40 | 06-07-26 | SICUREZZA | Solo dati test sul DB live; migration additive | MATTEO | APPROVATA | env-safety | stesso Decisione 3 |
| B1-D41 | 06-07-26 | SICUREZZA | Ok esplicito push 8 migration audit-grade | MATTEO | APPROVATA | migration-gate | stesso CP5; Report-fondamenta |
| B1-D42 | 06-07-26 | SICUREZZA | Ok push migration storno + E2E scrittura | MATTEO | APPROVATA | migration-gate | FOLLOW_UP FU-008/009; CP9 |
| B1-D43 | 08-07-26 | UI-UX | UI dai mockup, logica legacy sì / componenti no | MATTEO | CORRETTIVA | ui-source-of-truth | `FABLE_CHECKPOINT` Decisione 5; Report-blindatura |
| B1-D44 | 08-07-26 | FLUSSO | Modifica pdc/reparti/staff da Regia | MATTEO | ORIGINATA | product-scoping | Report-senior-blindatura |
| B1-D45 | 08-07-26 | PROCESSO | Autonomia piena fasi blindatura (no push) | MATTEO | DELEGATA | autonomy-mandate | stesso |
| B1-D46 | 08-07-26 | FLUSSO | Onboarding cantiere 7 passi priorità | MATTEO | ORIGINATA | onboarding-ux | Report-esecuzione-inviti |
| B1-D47 | 08-07-26 | IMPOSTAZIONI | Kill-switch email inviti | MATTEO | SCELTA | ops-safety | stesso |
| B1-D48 | 08-07-26 | UI-UX | Modal 2 colonne + scrollbar | MATTEO | ORIGINATA | ui-ux | stesso mandato |
| B1-D49 | 09-07-26 | FLUSSO | Spec onboarding 7 passi A–H verbatim | MATTEO | ORIGINATA | product-spec | `PROMPT_SENIOR_ONBOARDING_COMPLETO.md` |
| B1-D50 | 09-07-26 | PRODOTTO | Categorie espanse + preset «base solida additiva» | MATTEO | ORIGINATA | onboarding-data | `DATI_ONBOARDING/01`+`03` |
| B1-D51 | 09-07-26 | COMPLIANCE | Preparazioni estese (8 processi), form essenziale | MATTEO | ORIGINATA | compliance-ux | `DATI_ONBOARDING/04` |
| B1-D52 | 09-07-26 | PRODOTTO | Firma admin facoltativa + timbro chiusura | MATTEO | ORIGINATA | onboarding-ux | PROMPT onboarding Step 7 |
| B1-D53 | 09-07-26 | PROCESSO | Autonomia fino a fine task; push solo con ok | MATTEO | DELEGATA | autonomy-mandate | Report-onboarding |
| B1-D54 | 10-07-26 | SICUREZZA | Ok esplicito FU-019 (5 migration onboarding) | MATTEO | APPROVATA | migration-gate | SESSION_LOG 10-07; Report-onboarding §7 |
| B1-D55 | 06-07-26 | UI-UX | Onboarding non saltabile; temp fissa da profilo | MATTEO | ORIGINATA | onboarding-ux | `MOCKUP_UI/00_INDICE_MOCKUP.md` |
| B1-D56 | 06-07-26 | UI-UX | Onboarding dipendente: carta bianca a Fable | MATTEO | DELEGATA | autonomy-mandate | stesso L81 |
| B1-D57 | 06-07-26 | PROCESSO | Mockup HTML = verità visiva + asset marketing | MATTEO | SCELTA | mockup-as-truth | masterplan §13.8 |
| B2-D01 | 01-02-26 | COMPLIANCE | Temp entro ±1°C = conforme, no Attenzione | INCERTO | SCELTA | haccp-temp-tolerance | `03_CONSERVATION/Lavoro/01-02-2026/REPORT_SESSIONE_01-02-2026.md` §1 |
| B2-D02 | 01-02-26 | COMPLIANCE | Abbattitore: solo Sanificazione | INCERTO | SCELTA | haccp-maintenance-by-type | stesso §2 + `REPORT_card_checkup_centralizzato.md` R6 |
| B2-D03 | 01-02-26 | PRODOTTO | 10 requisiti card checkup da dialogo | INCERTO | ORIGINATA | product-requirements-dialogue | `…/01-02-2026/REPORT_card_checkup_centralizzato.md` §Requisiti Utente |
| B2-D04 | 16-01-26 | UI-UX | Mini calendario mensile/annuale, no numerico | INCERTO | ORIGINATA | calendar-frequency-ux | `…/11-01-2026/PROMPTS_SEQUENZA_START.md` Worker 1 |
| B2-D05 | 15-01-26 | UI-UX | Target temp sempre disabled + range placeholder | INCERTO | SCELTA | conservation-temp-field | `…/15-01-2026/REVISIONE_LAVORO_AGENTI.md` TASK M1 |
| B2-D06 | 04-02-26 | UI-UX | Pallino verde se niente da fare oggi | INCERTO | SCELTA | maintenance-status-dot | `…/04-02-2026/REPORT_LAVORO_04-02-2026.md` §2.3 |
| B2-D07 | 04-02-26 | UI-UX | Colore «Ultima lettura» solo da conformità temp | INCERTO | SCELTA | status-color-separation | stesso §2.5 |
| B2-D08 | 04-02-26 | FLUSSO | Lettura temp completa task Rilevamento | INCERTO | SCELTA | temp-reading-completes-task | `…/04-02-2026/PIANO_completamento_temperatura_su_lettura.md` |
| B2-D09 | 11-01-26 | PROCESSO | Verify First, Fix After dopo bug post-claim | INCERTO | CORRETTIVA | verify-first-workflow | `…/10-01-2026/PLAN.md` Overview |
| B2-D10 | 22-10-25 | PRODOTTO | Onboarding: rimuovere numero licenza | INCERTO | SCELTA | onboarding-fields — **handoff B1** | `01_AUTH/conoscenze-definizioni/ONBOARDING_FLOW.md` STEP 1 + header Fase 3 |
| B3-D01 | 22-10-25 | AI-METODO | Metodo: Owner descrive UI, agente documenta | MATTEO | ORIGINATA | owner-interview | `app-definition/README.md` L17 |
| B3-D02 | 16-01-26 | AI-METODO | Owner senza background tecnico → linguaggio semplice | MATTEO | ORIGINATA | plain-language | `AGENT_PROMPT_DOCUMENTATION.md` L18 |
| B3-D03 | 16-01-26 | AI-METODO | Catturare descrizione Owner verbatim | CONGIUNTA | APPROVATA | owner-interview | `AGENT_PROMPT_DOCUMENTATION.md` L39 |
| B3-D04 | 16-01-26 | COMPLIANCE | Solo categorie prodotti compatibili col tipo punto | INCERTO | NON-DETERMINABILE | haccp-category-filter | `…/16-01-2026/FIX_FILTRO_CATEGORIE_COMPATIBILI.md` L21-26 |
| B3-D05 | 19-01-26 | COMPLIANCE | Profili HACCP solo su frigoriferi | INCERTO | NON-DETERMINABILE | haccp-profiles-scope | `…/19-01-2026/PLAN.md` L22 |
| B3-D06 | 20-01-26 | AI-METODO | Foto elettrodomestico: no wrapper overengineering | AGENTE | SCELTA | scope-control | `…/20-01-2026/Plan_Foto_PuntiConservazione.md` L12-15 |
| B3-D07 | 29-01-26 | PRODOTTO | Profilo HACCP «Bibite e Bevande alcoliche» | INCERTO | NON-DETERMINABILE | haccp-profile-product | `…/29-01-2026/REPORT_PROFILO_BIBITE_….md` L3-4 |
| B3-D08 | 29-01-26 | COMPLIANCE | Categorie bibite senza range temperatura obbligatorio | INCERTO | NON-DETERMINABILE | haccp-optional-range | stesso L13-18; mappatura 29-01 |
| B3-D09 | 31-01-26 | UI-UX | Tab temperature: solo card, via pannello anomalie | MATTEO | ORIGINATA | ui-simplify | `…/30-01-2026/miglioramenti_ui_temperature_….md` L42 |
| B3-D10 | 31-01-26 | UI-UX | Ordinare card temperature per tipo operativo | MATTEO | ORIGINATA | ops-priority-ui | stesso L43 |
| B3-D11 | 31-01-26 | UI-UX | Rimuovere suffisso «contatta assistenza» dalle istruzioni | MATTEO | CORRETTIVA | copy-discipline | `…/30-01-2026/REPORT_FIX_BUG_UI_TEMPERATURE_….md` L109 |
| B3-D12 | 31-01-26 | PRODOTTO | Abbattitore: niente rilevamento temperatura | INCERTO | NON-DETERMINABILE | product-type-rules | `…/31-01-2026/REPORT_ABBATTITORE_E_UI_….md` L3-4 |
| B3-D13 | 31-01-26 | COMPLIANCE | Tolleranza temperatura unica ±1,0°C | INCERTO | NON-DETERMINABILE | temp-tolerance | `…/31-01-2026/REPORT_SESSIONE_COMPLETA_….md` L11-12 |
| B3-D14 | 31-01-26 | SICUREZZA | Rimuovere token da history git (mcp.json) | AGENTE | CORRETTIVA | secret-hygiene | stesso §8 L175-185 |
| B3-D15 | 04-02-26 | UI-UX | Rimuovere header «Calendario Aziendale» + Nuovo Evento | MATTEO | ORIGINATA | calendar-chrome | `…/04-02-2026/REPORT_CALENDARIO_UI_….md` L15 |
| B3-D16 | 04-02-26 | FLUSSO | Pulsante «Ancora da Completare» solo chi ha fatto o admin | MATTEO | ORIGINATA | uncomplete-acl | `…/04-02-2026/REPORT_SESSIONE_CALENDARIO_MACRO_….md` L103 |
| B3-D17 | 05-02-26 | UI-UX | Togliere filtri calendario «Per Stato» | INCERTO | NON-DETERMINABILE | filter-simplify | `…/05-02-2026/REPORT_RIMOZIONE_FILTRI_STATO.md` L11-17 |
| B3-D18 | 05-02-26 | IMPOSTAZIONI | Filtro «Per Reparto» solo admin | INCERTO | NON-DETERMINABILE | role-gated-filters | `…/05-02-2026/REPORT_FILTRI_REPARTO_ADMIN.md` L11-17 |
| B3-D19 | 08-02-26 | FLUSSO | Giorni chiusi: nascondi operativi, tieni scadenze personale | INCERTO | NON-DETERMINABILE | closure-day-policy | `…/08-02-2026/REPORT_FILTRO_GIORNI_CHIUSURA_….md` L51-53 |
| B3-D20 | 22-10-25 | SICUREZZA | Pulsanti dev non in production | INCERTO | NON-DETERMINABILE | dev-prod-split | `07_COMPONENTS/DEVELOPMENT_BUTTONS.md` L17; L118 |
| B3-D21 | 06-07-26 | PROCESSO | Verità: codice+DB live > doc APP_DEFINITION | CONGIUNTA | APPROVATA | doc-vs-live | `STATO_FASE3_INDICE.md` L5; `README.md` banner |
| B3-D22 | 06-07-26 | PROCESSO | Fonte decisioni owner beta fuori da questo perimetro | INCERTO | NON-DETERMINABILE | decision-log-pointer | `STATO_FASE3_INDICE.md` L3 |
| C1-D01 | 20-10-25 | SICUREZZA | Rate limit 5/5min → lock 10min | MATTEO | ORIGINATA | product-security | `2025-10-20/login-hardening_step1_agent1_v1.md` §Parametri Owner |
| C1-D02 | 20-10-25 | SICUREZZA | Password solo lettere, min 12 | MATTEO | ORIGINATA | product-security | stesso PRD §Password policy |
| C1-D03 | 20-10-25 | SICUREZZA | Recovery allineato al rate login | MATTEO | ORIGINATA | product-security | stesso PRD §Recovery |
| C1-D04 | 20-10-25 | SICUREZZA | Soglie Owner lockout brute-force | MATTEO | ORIGINATA | product-security | stesso PRD §Rate limit |
| C1-D05 | 20-10-25 | SICUREZZA | Remember me OFF in v1 | MATTEO | ORIGINATA | product-security | `Agente_2_…/SECURITY_FLOWS.md` §Parametri Owner |
| C1-D06 | 20-10-25 | SICUREZZA | CSRF cookie + header Edge | MATTEO | APPROVATA | product-security | `Neo_…/Checklist_Planning_Consolidata.md` §Decisioni Owner |
| C1-D07 | 20-10-25 | SICUREZZA | Base URL Edge `/functions/v1` | MATTEO | APPROVATA | product-architecture | Neo §Decisioni Owner |
| C1-D08 | 20-10-25 | SICUREZZA | Sessione TTL/idle 30m rolling | MATTEO | APPROVATA | product-security | Neo §Decisioni Owner; SECURITY_FLOWS |
| C1-D09 | 20-10-25 | UI-UX | Task success ≥90% flow critici | MATTEO | ORIGINATA | product-ux-metrics | `Agente_3_…/Brief_to_Agente3.md` §Parametri UX Owner |
| C1-D10 | 20-10-25 | UI-UX | Error recovery ≤3 click | MATTEO | ORIGINATA | product-ux-metrics | stesso Brief |
| C1-D11 | 20-10-25 | UI-UX | Login ≤30s; touch ≥44px | MATTEO | ORIGINATA | product-ux-metrics | stesso Brief |
| C1-D12 | 20-10-25 | PROCESSO | Conferma umana sblocca sviluppo | MATTEO | APPROVATA | human-gate | Neo §Approvazioni |
| C1-D13 | 20-10-25 | PROCESSO | LOCKED files: integra senza riscrivere | CONGIUNTA | APPROVATA | lock-discipline | Neo §Strategia integrazione |
| C1-D14 | 20-10-25 | PRODOTTO | FE nuovi componenti `auth-new/` | MATTEO | APPROVATA | product-architecture | Neo §Decisioni Owner |
| C1-D15 | 20-10-25 | AI-METODO | Flusso 7 agenti + quality gates | CONGIUNTA | ORIGINATA | multi-agent-orchestration | `2025-10-20/Prompt_Agente1.md` Contesto |
| C1-D17 | 20-10-25 | PRODOTTO | Multi-tenant obbligatorio in release | INCERTO | SCELTA | product-scoping | PRD §Domande aperte |
| C1-D18 | 20-10-25 | PRODOTTO | Ruoli: owner + admin + operator | INCERTO | SCELTA | product-rbac | PRD §Domande aperte |
| C1-D19 | 20-10-25 | UI-UX | Login centrato max 400px | AGENTE | DELEGATA | product-ux | `HANDOFF_TO_AGENTE_4_5.md` Q1 |
| C1-D20 | 20-10-25 | UI-UX | Errori inline+banner; Remember OFF | AGENTE | DELEGATA | product-ux | HANDOFF Q2–Q5 |
| C1-D22 | 21-10-25 | AI-METODO | Stop-and-ask: non inventare, chiedi | AGENTE | ORIGINATA | stop-and-ask | `STATUS_AGENTE_4.md` STOP-AND-ASK |
| C1-D23 | 27-01-25 | PROCESSO | GO FOR DEPLOY (revisione A7) | AGENTE | ORIGINATA | release-gate | `REVISIONE_AGENTE_7_COMPLETATO.md` chiusura |
| C2-D01 | 06-01-26 | PROCESSO | Richiedere cleanup root: archivio, non delete | MATTEO | ORIGINATA | repo-hygiene | correzione Matteo 06-08-26 (chat C2); effetto in `MANIFEST.md` L3-4, L281 |
| C2-D02 | 06-01-26 | PROCESSO | Piano taglio 5 categorie: PNG, JS temp, Playwright dup, cartelle temp, misc | AGENTE | DELEGATA | archive-taxonomy | `MANIFEST.md` L11-18; attribuzione piano → correzione Matteo 06-08-26 |
| C2-D03 | 06-01-26 | PROCESSO | Root BHM solo struttura “professionale” elencata | AGENTE | DELEGATA | root-cleanliness | `MANIFEST.md` L237-274 |
| C2-D04 | 06-01-26 | TESTING | Tenere un solo `playwright.config.ts`; archiviare 9 config agent | AGENTE | DELEGATA | test-config-single | `MANIFEST.md` L171-183, L284 |
| C2-D05 | 06-01-26 | AI-METODO | Archiviare `skills/` come duplicato di `.cursor/rules/` | AGENTE | DELEGATA | skill-dedup | `MANIFEST.md` L205 |
| C2-D06 | 06-01-26 | PROCESSO | Archiviare progetto personale Australia come “cartella temporanea” | AGENTE | DELEGATA | personal-vs-product | `MANIFEST.md` L194-195 |
| C2-D07 | 06-01-26 | PROCESSO | Archiviare `Info/` come documentazione temporanea | AGENTE | DELEGATA | docs-lifecycle | `MANIFEST.md` L200-201 |
| C2-D08 | 06-01-26 | TESTING | Archiviare `Test/` obsoleti (sostituiti da `tests/` organizzati) | AGENTE | DELEGATA | test-folder-hygiene | `MANIFEST.md` L211-212 |
| C2-D09 | 06-01-26 | PROCESSO | Archiviare `test-results/` Playwright (artefatti run) | AGENTE | DELEGATA | artifact-archive | `MANIFEST.md` L217-218 |
| C2-D10 + C4-D16 | 07-01-25? | UI-UX | Form nuovi: select vuoti; form modifica: dati esistenti | MATTEO | ORIGINATA | form-empty-defaults | `…/FORM_DEFAULT_VALUES_FIX.md` L16-17; anche `SESSION_REPORT_…` L405 |
| C2-D11 + C4-D17 | 07-01-25? | FLUSSO | Chiedere se calendario post-onboarding incompleto = mock | MATTEO | ORIGINATA | data-source-audit | `SESSION_REPORT_2025_01_07.md` L103-104 |
| C2-D12 + C4-D18 | 07-01-25? | FLUSSO | Chiedere garanzia company per ogni account (multi-tenant) | MATTEO | ORIGINATA | multi-tenant-guarantee | stesso L166-167 |
| C2-D13 + C4-D19 | 07-01-25? | TESTING | DB pulito se onboarding non completato (0 dati) | MATTEO | ORIGINATA | clean-slate-onboarding | stesso L214-215 |
| C2-D14 + C4-D01 | 17-01-25? | TESTING | 7 famiglie test Attività (A–G) già identificate dall’utente | MATTEO | ORIGINATA | test-scoping | `…/IDENTIFICAZIONE_TEST_ATTIVITA_2025-01-17.md` L7-37 |
| C2-D16 | ? | SICUREZZA | Disabilitare RLS temporaneamente (Clerk≠Supabase JWT) | AGENTE | SCELTA | rls-defer · IPOTESI | `…/RLS_SOLUTION.md` L51-58 |
| C2-D18 | 20-10-25? | AI-METODO | Agente 0 orchestratore + cartelle output per agente | INCERTO | NON-DETERMINABILE | agent-orchestration | `temp-folders/skills/agent-0-orchestrator.md` L10-23 |
| C2-D19 | ? | AI-METODO | Critical verification: mai fidarsi dei claim, verificare | INCERTO | NON-DETERMINABILE | critical-verify · antenato | `temp-folders/skills/critical-verification.md` L15-30 |
| C2-D20 | ? | AI-METODO | Code mapping solo da codice letto, zero assunzioni | INCERTO | NON-DETERMINABILE | code-mapping-discipline | `temp-folders/skills/code-mapping.md` L14-22 |
| C2-D21 | 05-01-26 | ALTRO | Pathway Australia: Cook attivo, IT non fattibile ora | MATTEO | SCELTA | personal-planning · fuori-prodotto | `Australia_…/00_MASTER_ROADMAP.md` L8-16 |
| C2-D22 | 09-01-25? | PROCESSO | Review migrazione Clerk→Supabase attribuita a Matteo | MATTEO | APPROVATA | migration-review | `MIGRATION_REPORT_…_2025_01_09.md` L487 |
| C2-D23 | ? | UI-UX | Rimozione cestino duplicato “come richiesto” | INCERTO | APPROVATA | ui-dedup · IPOTESI | `misc/REPORT_COMPLETO_MODIFICHE_CALENDARIO.md` L111 |
| C3-D01 | 27-01-25 | AI-METODO | Archive root escluso da NotebookLM pack | INCERTO | ORIGINATA | knowledge-pack-scope | `knowledge-legacy/ARCHIVE/README.md` L48 |
| C3-D02 | 27-01-25 | AI-METODO | Archive report agenti escluso da pack | INCERTO | ORIGINATA | knowledge-pack-scope | `knowledge-legacy/Report agenti/ARCHIVE/README.md` L44 |
| C3-D03 | 27-01-25 | AI-METODO | Priorità file da caricare su NotebookLM | AGENTE | ORIGINATA | knowledge-pack-scope | `…/NOTEBOOKLM_SETUP.md` L18–L111 |
| C3-D04 | ? | AI-METODO | Pack agenti = stessi file NotebookLM | AGENTE | ORIGINATA | knowledge-pack-sync | `…/NOTEBOOKLM_AGENT_INTEGRATION.md` L310 |
| C3-D05 | ? | AI-METODO | Opzione 1: docs accessibili agli agenti | AGENTE | SCELTA | agent-knowledge-access | `…/NOTEBOOKLM_AGENT_INTEGRATION.md` L23 |
| C3-D06 | ? | AI-METODO | Superpowers = metodologie principali | AGENTE | ORIGINATA | external-skill-adoption | `…/SUPERPOWERS_INTEGRATION_COMPLETE.md` L231 |
| C3-D07 | ? | AI-METODO | Skills obbligatorie se esistono | AGENTE | ORIGINATA | skill-mandatory-use | `…/SUPERPOWERS_INTEGRATION_COMPLETE.md` L171 |
| C3-D08 | ? | AI-METODO | Backup vecchie skills in `.skills-backup/` | AGENTE | ORIGINATA | skill-conservation | `…/SUPERPOWERS_INTEGRATION_COMPLETE.md` L63–L71 |
| C3-D09 | 20-10-25 | AI-METODO | Sistema 5 agenti OBSOLETO → 7 agenti | INCERTO | CORRETTIVA | multi-agent-orchestration | `Knowledge/…/README_ARCHIVIO.md` L1–L5 |
| C3-D10 | 20-10-25 | AI-METODO | Motivo: planning 90% / coding 10% | INCERTO | ORIGINATA | multi-agent-orchestration | `README_ARCHIVIO.md` L29–L40 |
| C3-D11 | 16-01-25 | AI-METODO | Header `// LOCKED:` + commit `LOCK:` | INCERTO | ORIGINATA | lock-discipline | `Old multi_agent/CORE_ESSENTIALS.md` L66–L69; `WORKFLOW_BLINDATURA.md` L176–L229 |
| C3-D12 | ? | TESTING | Checklist blindatura 100% test | INCERTO | ORIGINATA | blindatura-checklist | `Old multi_agent/TESTING_STANDARDS.md` L195–L205 |
| C3-D13 | ? | AI-METODO | Top 10 regole NON negoziabili | INCERTO | ORIGINATA | agent-non-negotiables | `CORE_ESSENTIALS.md` L64–L136 |
| C3-D14 | ? | AI-METODO | Preservare dati Precompila (whitelist) | INCERTO | ORIGINATA | precompila-preserve | `CORE_ESSENTIALS.md` L84–L88 |
| C3-D15 | ? | AI-METODO | Sequenza obbligatoria Agente 1→5 | INCERTO | ORIGINATA | multi-agent-sequence | `CORE_ESSENTIALS.md` L110–L118 |
| C3-D16 | 01-25 | UI-UX | Design v1 rifiutato: «è molto brutto» | MATTEO | ORIGINATA | user-feedback-loop | `knowledge-legacy/DESIGN_CHANGELOG.md` L14 |
| C3-D17 | 01-25 | UI-UX | Design v2 «Caldo & Legno» approvato | MATTEO | APPROVATA | user-feedback-loop | `DESIGN_CHANGELOG.md` L40–L42 |
| C3-D18 | 27-01-25 | UI-UX | Font moderni ma professionali | MATTEO | ORIGINATA | product-ux | `DESIGN_CHANGELOG.md` L107 |
| C3-D19 | 27-01-25 | UI-UX | Admin nav laterale → orizzontale | MATTEO | ORIGINATA | product-ux | `DESIGN_CHANGELOG.md` L145 |
| C3-D20 | 27-01-25 | UI-UX | Foto sfondo pagina prenota (pending) | MATTEO | ORIGINATA | product-ux | `DESIGN_CHANGELOG.md` L220 |
| C3-D21 | 27-01-25 | UI-UX | Card eventi calendario non carine | MATTEO | ORIGINATA | product-ux | `DESIGN_CHANGELOG.md` L245 |
| C3-D22 | 27-01-25 | UI-UX | Rimuovere animazioni stat cards | MATTEO | CORRETTIVA | user-feedback-loop | `ARCHIVE/SESSION_SUMMARY_FINAL.md` L63 |
| C3-D23 | 02-11-25 | PRODOTTO | Bug: menu non visibile su prenota | MATTEO | ORIGINATA | bug-triage | `…/MENU_FIX_REPORT.md` L4 |
| C3-D24 | 17-01-25 | PRODOTTO | Mappare/testare pagina Attività | MATTEO | ORIGINATA | product-scoping | `Old multi_agent/REPORT_COMPLETO_…ATTIVITA….md` L10–L14 |
| C3-D25 | 17-01-25 | PRODOTTO | Sei problemi Attività da utente | MATTEO | ORIGINATA | product-scoping | stesso report L16–L22 |
| C3-D26 | 27-01-25 | PROCESSO | Test manuali → sostituiti da E2E | INCERTO | CORRETTIVA | test-strategy | `knowledge-legacy/ARCHIVE/README.md` L19–L20 |
| C3-D27 | 27-01-25 | PROCESSO | Report duplicati → tenere *_FINAL | INCERTO | CORRETTIVA | knowledge-dedupe | `Report agenti/ARCHIVE/README.md` L13–L18 |
| C3-D28 | ? | SICUREZZA | Rimuovere pulsanti Dev pre-prod | INCERTO | ORIGINATA | prod-cleanup | `PRE_PRODUCTION_CLEANUP.md` L1–L16 |
| C3-D29 | 16-10-25 | AI-METODO | Inventario 200+ componenti da zero | AGENTE | ORIGINATA | component-inventory | `INVENTARIO_COMPLETO_RIESEGUITO.md` L1–L29 |
| C3-D30 + D1-D32 | ? | PRODOTTO | Flow ACCETTA booking fixato dall'utente | MATTEO | CORRETTIVA | bug-triage | `knowledge-legacy/Report agenti/FINAL_TESTING_REPORT.md` L65 |
| C4-D02 | 17-01-25 | TESTING | Totale 16: +L–T; toglie regressione H–K | AGENTE | SCELTA | test-matrix-expand | stesso §RIEPILOGO FINALE |
| C4-D03 | 17-01-25 | TESTING | Priorità E/F alte; metriche &lt;500ms/&lt;2s | AGENTE | SCELTA | test-priority-gates | stesso §PRIORITÀ / Metriche |
| C4-D04 | 17-01-25 | PROCESSO | Prossimo step = conferma utente su matrice | AGENTE | DELEGATA | human-gate | stesso chiusura |
| C4-D05 | ? | TESTING | Login E2E blindato, conferma umana | CONGIUNTA | APPROVATA | blindatura-umana | `Tests/…/README-TEST-SESSIONE.md` |
| C4-D06 | ? | AI-METODO | Blindato = pattern per sistemare gli altri | AGENTE | SCELTA | golden-template | stesso §PROSSIMI PASSI |
| C4-D07 | 17-01-25 | TESTING | Test E allineamento calendar↔modal sigillato | MATTEO | APPROVATA | blindatura-umana | `Tests/…/EventAlignment/README-TEST-E-BLINDATO.md` |
| C4-D08 | 17-01-25 | TESTING | Test A filtri blindato da AI (no Utente) | AGENTE | SCELTA | blindatura-agente | `Tests/…/CalendarFilters/README-TEST-A-BLINDATO.md` |
| C4-D09 | 19-10-25 | PRODOTTO | Temp onboarding = min-max esatti, non ±1.1°C | MATTEO | CORRETTIVA | acceptance-criteria | `Tests/…/Onboarding/TEST_1_VERIFICATION.md` tabella |
| C4-D10 | 19-10-25 | TESTING | Triade assert UI redirect + DB + tab UI | AGENTE | SCELTA | collaudo-triade | `Tests/…/Onboarding/README.md` + VERIFICATION |
| C4-D11 | 16-01-25? | AI-METODO | Blindatura 5 layer; autonomia senza permesso | AGENTE | DELEGATA | multi-agent-blindatura | `Tests/…/UI-Base/AGENTE_4_REPORT_FINALE.md` |
| C4-D12 | ? | TESTING | Toglie test role-selector obsoleti | AGENTE | CORRETTIVA | prune-obsolete-tests | `Tests/…/Navigazione/REPORT_FINALE_AGENTE_5.md` |
| C4-D13 | 16-01-25 | TESTING | Form Conservazione assente → non fingere verde | AGENTE | CORRETTIVA | honest-negative | `Tests/…/REPORT_TEST_CONSERVATIONPOINTFORM.md` |
| C4-D14 | 07-01-26 | PROCESSO | Molti spec onboarding → un consolidato | INCERTO | SCELTA | test-consolidation | `Tests/Old_Onboarding_Tests/README.md` |
| C4-D15 | 16-01-25 | AI-METODO | Template Tracking → LOCKED sistematico | AGENTE | DELEGATA | blindatura-template | `Tests/…/UI-Base/Button-Tracking.md` (×~28) |
| C4-D20 | 09-01-25 | PROCESSO | Review migrazione: User (Matteo); UAT pending | MATTEO | APPROVATA | review-gate | `Info_Complete/…/MIGRATION_REPORT_…_2025_01_09.md` |
| C4-D21 | ? | TESTING | Merge solo dopo approvazione utente finale | MATTEO | APPROVATA | merge-gate | `Info_Complete/…/USER_TRACKING_TASKS.md` L17 |
| C2-D15 + C4-D22 | 04-01-25? | AI-METODO | Cursor = bug/UX; Claude = TS/lint | INCERTO | SCELTA | dual-agent-split | `Info_Complete/…/CURSOR-INSTRUCTIONS-CURRENT.md` |
| C4-D23 | 11-01-25 | TESTING | Checklist 6 flussi tracking; Tested By Claude | AGENTE | DELEGATA | agent-checklist | `Info_Complete/…/TESTING_CHECKLIST.md` |
| C4-D24 | 17-01-25 | TESTING | Blindatura /attivita; cancella task UI assente | AGENTE | CORRETTIVA | prune-absent-ui | `Info_Complete/…/REPORT_TODOLIST_COMPLETATA_AGENTE_4.md` |
| C5-D01 | 27-01-25? | AI-METODO | Codificare stabilità decisionale dopo contraddizione A6/A7 | AGENTE | CORRETTIVA | decision-stability | `LEZIONI_APPRESE_AGENTE_1.md` §1 + §REGOLE CRITICHE |
| C5-D02 | 27-01-25? | AI-METODO | Divieto cambio posizione senza nuove evidenze | AGENTE | CORRETTIVA | decision-stability | stesso §2 + product-strategy L21-25 |
| C5-D03 | 27-01-25? | AI-METODO | Principio 90% planning / 10% coding + MVP prima | AGENTE | CORRETTIVA | mvp-scope-discipline | LEZIONI §3; product-strategy L22, L44-48 |
| C5-D04 | 27-01-25? | TESTING | Coverage MVP ≥60%, non 100% prima del deploy | AGENTE | CORRETTIVA | realistic-quality-gates | LEZIONI §principi; product-strategy L47 |
| C5-D05 | 27-01-25? | AI-METODO | Propagare lezioni A1 dentro skill Product Strategy | AGENTE | ORIGINATA | lesson-to-skill | `Agente_1/Skills-product-strategy.md` L20-26, L819-840 |
| C5-D06 | 27-01-25? | AI-METODO | Skills-reasoning Agenti 0/1/2 contro decisioni affrettate | AGENTE | ORIGINATA | pressure-brake | `README_REASONING_SKILLS.md` L7-14; Skills-reasoning ×3 |
| C5-D07 | 27-01-25? | AI-METODO | Consultazione obbligatoria peer planning sotto pressione | AGENTE | ORIGINATA | peer-consult | README_REASONING §STEP 2; Skills-reasoning A1 L52-56 |
| C5-D08 | 27-01-25? | AI-METODO | Organizzare skills per cartella Agente_0..9 | AGENTE | ORIGINATA | skill-folder-per-agent | `README_SKILLS_ORGANIZATION.md` L5-41 |
| C5-D09 | 27-01-25? | AI-METODO | Spezzare Agente 9: final-check vs knowledge-mapping | AGENTE | ORIGINATA | context-budget | `Agente_9/README_DIVISIONE_SKILLS.md` L7-12, L76-83 |
| C5-D10 | 27-01-25? | AI-METODO | Veto Agente 9 se piano non allineato all’utente | AGENTE | ORIGINATA | user-alignment-veto | `Agente_9/Skills-final-check.md` L25, L54 |
| C5-D11 | 07-01-26 | PROCESSO | Cleanup `.cursor/rules`: archiviare Agente_* → 4 core | AGENTE | DELEGATA | skill-hygiene | `cursor-rules-cleanup-2026-01/MANIFEST.md` L8-27 |
| C5-D12 | 07-01-26 | PROCESSO | Rimuovere duplicati/obsoleti (befor0summarizing, app-mapping dup) | AGENTE | DELEGATA | skill-dedup | MANIFEST L9-12 |
| C5-D13 | ? | TESTING | Zona vietata: mai modificare file con `// LOCKED` senza permesso utente | INCERTO | ORIGINATA | lock-discipline | `References/Reference/REGOLE_AGENTI.md` §COMPONENTI LOCKED |
| C5-D14 | ? | PROCESSO | Blindatura = test 100% + edge + no side-effect prima del lock | INCERTO | ORIGINATA | blindatura-criteria | REGOLE_AGENTI §PROCESSO DI BLINDATURA |
| C5-D15 | ? | AI-METODO | Lock atomici multi-agente su host/porta (coda FIFO) | AGENTE | ORIGINATA | multi-agent-lock | REGOLE_AGENTI §PROTOCOLLO LOCK; QUICK_REFERENCE |
| C5-D16 | ? | SICUREZZA | Prima di test JS: consultare schema/dati DB reali (no mock ciechi) | AGENTE | ORIGINATA | db-first-tests | REGOLE_AGENTI §CONSULTAZIONE DATABASE |
| C5-D17 | 16-01-25? | TESTING | Dichiarare auth «completamente blindata» (7 componenti LOCKED) | AGENTE | ORIGINATA | blindatura-claim | `Archive/BLINDATURA_AUTENTICAZIONE_COMPLETATA.md` L3-5, L97 |
| C5-D18 | 21-10-25 | TESTING | Tracking post-test: solo 3% componenti blindati, 97% da fare | AGENTE | ORIGINATA | blindatura-honesty | `2025-10-21` (file) L257-261 |
| C5-D19 | 20-10-25 | SICUREZZA | Blindare login/inviti/sessione da zero (P0) | MATTEO | ORIGINATA | auth-hardening | `2025-10-20/richiesta_utente_login-hardening.md` L14-29 |
| C1-D16 + C5-D20 | 20-10-25 | AI-METODO | Vincolo: niente analisi codice corrente; flusso 0→1→…→7 | MATTEO | ORIGINATA | greenfield-brief | stesso L24-26 |
| C5-D21 | 20-10-25 | TESTING | Login «affidabile al 100%» con unit+integrazione+E2E | MATTEO | ORIGINATA | test-ambition | stesso L17 |
| C5-D22 | 20-10-25 | PROCESSO | Handoff Agente1/Agente3 su P0-1 login (DoD + path sessione) | AGENTE | DELEGATA | multi-agent-handoff | `HANDOFF_Agente1_…` / `HANDOFF_Agente3_…` |
| C5-D23 | 20-10-25 | PROCESSO | Checklist Agente 0: normalizzare richiesta + domande obbligatorie | AGENTE | DELEGATA | orchestrator-intake | `2025-10-20/Checklist_v0.md` L4-7, L21-25 |
| C5-D24 | 20-10-25 | SICUREZZA | Piano blindaggio login P0–P2 (scope React+Supabase) | INCERTO | SCELTA | auth-hardening-plan | `CHECKLIST_BLINDAGGIO_LOGIN.md` L1-16 |
| C5-D25 | ? | UI-UX | Eliminare cestino form «Nuova Attività Generica» | MATTEO | ORIGINATA | ui-dedup | `Reports/REPORT_COMPLETO_MODIFICHE_CALENDARIO.md` L12-14, L111 |
| C5-D26 | ? | UI-UX | Eliminare allegati/legenda duplicati; stats legate alla view | MATTEO | ORIGINATA | calendar-ux | stesso L15-17, L140 |
| C2-D17 + C5-D27 | 19-10-25 | AI-METODO | Sistema 6 skills early (overview/test/mapping/prompt/error) | INCERTO | ORIGINATA | early-skill-system | `References/SKILLS_SETUP_COMPLETE.md` L1-19 |
| C5-D28 | ? | AI-METODO | Stile risposta Agente 0: metafora + «Sei d'accordo?» | INCERTO | NON-DETERMINABILE | user-comm-style | `Agente_0/Skills-orchestrator.md` L29-37 |
| C1-D21 + C5-D29 | ? | PROCESSO | Quality gate planning: Conferma Umana con firma/data utente | AGENTE | ORIGINATA | human-gate | orchestrator L119-122 |
| C5-D30 | ? | AI-METODO | Verifica empirica conteggi file vs dichiarati (anti-gonfiaggio) | AGENTE | ORIGINATA | empiric-counts | orchestrator L55-58, L134-136 |
| D1-D01 | 27-01-25? | UI-UX | /prenota non deve cambiare con i temi | MATTEO | CORRETTIVA | theme-scope-isolation | `handoff/THEME_PHASE1_COMPLETED.md` L150 |
| D1-D02 | 27-01-25? | UI-UX | Temi solo su /admin | MATTEO | SCELTA | theme-scope-isolation | stesso L150; L421 |
| D1-D03 | 27-01-25? | UI-UX | Tema Balanced: fasce orarie più distinte | MATTEO | CORRETTIVA | admin-visual-hierarchy | stesso L215 |
| D1-D04 | 27-01-25? | UI-UX | Bordi card count prenotazioni più grossi | MATTEO | CORRETTIVA | admin-visual-hierarchy | stesso L248 |
| D1-D05 | 27-01-25? | UI-UX | Badge nav con sfondo anche non selezionati | MATTEO | CORRETTIVA | admin-visual-hierarchy | stesso L271 |
| D1-D06 | 27-01-25? | UI-UX | Card «inserisci nuova prenotazione» allineata | MATTEO | CORRETTIVA | admin-visual-hierarchy | stesso L303 |
| D1-D07 | 27-01-25? | UI-UX | Chiudere gap bianco calendario/disponibilità | MATTEO | CORRETTIVA | admin-visual-hierarchy | stesso L328 |
| D1-D08 | 27-01-25? | PROCESSO | Test utente prima di add/commit | MATTEO | ORIGINATA | human-gate-before-commit | stesso L420 |
| D1-D09 | ? | UI-UX | Campo ospiti deve poter restare vuoto | MATTEO | ORIGINATA | form-empty-defaults | `handoff/NUM_GUESTS_INPUT_EMPTY_VALUE_ISSUE.md` L5 |
| D1-D10 | ? | UI-UX | Requisito: ospiti vuoto all’apertura | MATTEO | SCELTA | form-empty-defaults | stesso L16 |
| D1-D11 | 01-12-25 | UI-UX | Fix autocomplete browser su campo ospiti | MATTEO | ORIGINATA | form-empty-defaults | `handoff/NUM_GUESTS_AUTOCOMPLETE_FIX_REPORT.md` L11 |
| D1-D12 | 02-11-25 | PRODOTTO | Caraffe: mutual exclusion come i primi | MATTEO | ORIGINATA | menu-mutual-exclusion | `reports/VERIFICATION_CARAFFE_MUTUAL_EXCLUSION_FIX.md` L11-12 |
| D1-D13 | 02-11-25 | UI-UX | Padding card ingredienti rinfresco laurea | MATTEO | ORIGINATA | prenota-card-spacing | `reports/VERIFICATION_MENU_CARD_PADDING.md` L10 |
| D1-D14 | 30-11-25 | UI-UX | Conferma test visivo padding Riepilogo | MATTEO | APPROVATA | visual-debug-with-owner | `handoff/RIEPILOGO_SCELTE_PADDING_ISSUE.md` L33 |
| D1-D15 | 30-11-25 | UI-UX | Padding Riepilogo: inline styles vs Tailwind | AGENTE | SCELTA | css-workaround | `handoff/RIEPILOGO_PADDING_SOLUTION.md` L59 |
| D1-D16 | 02-11-25 | UI-UX | Card unificata intolleranze | CONGIUNTA | SCELTA | prenota-card-unify | `archive/2025-11-early/SESSIONE_CARD_OPACHE_INTOLLERANZE_REPORT.md` L55 |
| D1-D17 | 02-11-25 | UI-UX | Schede opache su tutta /prenota | INCERTO | SCELTA | prenota-card-style | stesso L9-11 |
| D1-D18 | 05-12-25 | PRODOTTO | Aggiungere Scamorzine €2 in Fritti | MATTEO | ORIGINATA | menu-content-ops | `handoff/SCAMORZINE_INGREDIENT_HANDOFF.md` L11-16 |
| D1-D19 | ? | FLUSSO | Placement solo in Admin, non /prenota | INCERTO | SCELTA | admin-only-fields | `HANDOFF_PLACEMENT_FIELD.md` L21-23 |
| D1-D20 | ? | UI-UX | Eseguire piano fix mobile card &lt;510px | MATTEO | ORIGINATA | mobile-first-fix | `archive/old-agent-reports/mobile-responsive-fix/README_MOBILE_FIX.md` L5 |
| D1-D21 | 04-01-25? | UI-UX | Desktop menu cards invariato | INCERTO | SCELTA | desktop-lock-mobile-fix | `tasks/UI_MODERNIZER_MENU_CARDS_MOBILE.md` L15 |
| D1-D22 | ? | UI-UX | Mobile menu: stack verticale Opzione B | INCERTO | SCELTA | desktop-lock-mobile-fix | stesso L55 ca. (Soluzione Scelta) |
| D1-D23 | ? | UI-UX | Edge-to-edge ingredienti mobile | INCERTO | SCELTA | mobile-card-layout | `archive/.../CARD_INGREDIENTS_EDGE_TO_EDGE_PLAN.md` (Opzione A scelta) |
| D1-D24 | 26-01-25? | FLUSSO | Prenotazione visibile solo fascia di inizio | INCERTO | SCELTA | calendar-slot-display | `plans/2025-01-26-fix-time-slot-display.md` L5 |
| D1-D25 | 27-01-25? | UI-UX | Modal dettagli: un solo pulsante Modifica | INCERTO | SCELTA | admin-modal-ux | `plans/2025-01-27-booking-details-modal-complete-redesign.md` L50 |
| D1-D26 | 27-01-25? | PRODOTTO | Redesign modal dettagli prenotazione | INCERTO | APPROVATA | admin-modal-ux | stesso L709 ca. |
| D1-D27 | 20-11-25 | UI-UX | Fix modal che chiude su text select | INCERTO | APPROVATA | admin-modal-ux | `plans/2025-11-20-booking-details-modal-bugs-fix-design.md` L4 |
| D1-D28 | 27-01-25? | FLUSSO | No controllo capienza sul form pubblico | INCERTO | SCELTA | capacity-public-policy | `reports/CAPACITY_WARNING_MODAL_ISSUE_REPORT.md` L321 |
| D1-D29 | ? | VENDITA | Integrazione Wix via iframe/link | INCERTO | SCELTA | go-to-market-embed | `agent-knowledge/PRD.md` L1018 ca. |
| D1-D30 + G3-D35 | ? | SICUREZZA | Rate limit 3 richieste/ora per IP | INCERTO | SCELTA | public-rate-limit | `agent-knowledge/PRD.md` L881 ca. |
| D1-D31 | ? | TESTING | No navigazione esplicita invasiva nei test | INCERTO | DELEGATA | test-non-invasiveness | `archive/2025-11-early/TEST_IMPROVEMENTS_APPLIED.md` L258 |
| D2-D01 | 24-02-26 | AI-METODO | Verifica visiva obbligatoria prima di «completo» | AGENTE | ORIGINATA | verify-before-done | `Sessioni di lavoro/24-02-2026/SKILL.md` §Verification |
| D2-D02 | 24-02-26 | UI-UX | Refactor NavItem → Tailwind puro priorità P0 | AGENTE | ORIGINATA | dashboard-layout | `…/24-02-2026/commercial-patterns.md` §6 |
| D2-D03 | 24-02-26 | TESTING | Login automatico agente via Playwright + screenshot | AGENTE | ORIGINATA | agent-self-verify | `…/24-02-2026/ADMIN-LOGIN.md` §Login automatico |
| D2-D04 | 14-03-26 | PRODOTTO | Eliminare modulo Calendar morto (BHM) | INCERTO | DELEGATA | cleanup-prod | `…/14-03-2026/report-pulizia-produzione.md` §1 |
| D2-D05 | 14-03-26 | SICUREZZA | Login admin solo se email in `admin_users` | AGENTE | CORRETTIVA | auth-gate | stesso §10 |
| D2-D06 | 14-03-26 | PRODOTTO | Piano Fase 2 multi-tenant (org + tenant_id + RLS) | INCERTO | APPROVATA | multi-tenant | `…/14-03-2026/plan-fase2-multi-tenant.md` intro |
| D2-D07 | 14-03-26 | FLUSSO | Route pubblica `/prenota/:tenantSlug` | AGENTE | SCELTA | slug-routing | stesso §2.9 |
| D2-D08 | 14-03-26 | SICUREZZA | Insert pubblico via Edge Function non client | AGENTE | SCELTA | edge-insert | stesso §2.5 |
| D2-D09 | 15-03-26 | SICUREZZA | Login: lookup admin via client anon (RLS chicken-egg) | AGENTE | CORRETTIVA | login-rls-fix | `…/15-03-2026/report-sessione-multi-tenant.md` §2.3 |
| D2-D10 | 16-03-26 | SICUREZZA | DEFAULT `tenant_id` per retrocompat frontend | AGENTE | CORRETTIVA | migration-safe | `…/16-03-2026/plan-integrazione-multi-tenant.md` Fix 1.1 |
| D2-D11 | 16-03-26 | SICUREZZA | Sostituire policy anon admin con RPC | AGENTE | CORRETTIVA | rpc-admin-lookup | stesso Fix 1.2 |
| D2-D12 | 18-03-26 | PRODOTTO | Capienza non deve mai bloccare accept/create/edit | MATTEO | ORIGINATA | overbooking-warn | `…/18-03-2026/fix-overbooking-non-bloccante.md` §Requisito |
| D2-D13 | 18-03-26 | UI-UX | Su accept: modal warning + «Procedi Comunque» | AGENTE | SCELTA | capacity-modal | stesso §1 |
| D2-D14 | 18-03-26 | PROCESSO | DB TEST clone dati app, zero rischio PROD | MATTEO | ORIGINATA | test-db-clone | `…/18-03-2026/report-clone-db-test-multi-tenant.md` §Obiettivo |
| D2-D15 | 18-03-26 | PROCESSO | Dump/restore solo schema `public` | AGENTE | CORRETTIVA | public-only-restore | stesso §2.5 |
| D2-D16 | 20-03-26 | AI-METODO | Piano multi-tenant «approvato» poi implementato | INCERTO | APPROVATA | plan-then-build | `…/20-03-2026/report-sessione-multi-tenant-implementazione.md` §Riferimenti |
| D2-D17 | 20-03-26 | TESTING | Suite Playwright multi-tenant (11 test) | AGENTE | ORIGINATA | e2e-mt | stesso FASE 5 |
| D2-D18 | 22-03-26 | PROCESSO | PROD: sola lettura salvo OK esplicito utente | MATTEO | ORIGINATA | prod-gate | `…/db-allineamento/README.md` §Regole operative |
| D2-D19 | 22-03-26 | PROCESSO | 037+ solo su TEST fino a validazione | MATTEO | ORIGINATA | test-first | stesso; TRACKER §Decisioni |
| D2-D20 | 22-03-26 | TESTING | Non dichiarare allineamento senza snapshot TEST | AGENTE | ORIGINATA | schema-parity | `…/22-03-2026/report-db-allineamento-prod-vs-test.md` §3 |
| D2-D21 | 22-03-26 | AI-METODO | Pack procedura inizio sessione (Claude/Cursor/MCP) | CONGIUNTA | DELEGATA | session-bootstrap | `…/db-allineamento/PROCEDURA-INIZIO-SESSIONE.md` intro |
| D2-D22 + G3-D18 | ?-04-26 | UI-UX | Palette admin da warm-wood a blu/indaco | INCERTO | ORIGINATA | early-ui-theme | `Lavoro/Sessioni di lavoro/02-05-26/REPORT.md` §Tema UI |
| D2-D24 | 02-05-26 | UI-UX | Solo layer visivo; no cambio flussi core | MATTEO | ORIGINATA | ui-without-logic-change | stesso §Vincolo fondamentale |
| D2-D25 | 02-05-26 | UI-UX | Mood moderno caldo, non freddo | MATTEO | SCELTA | warm-admin-mood | stesso §1 Colori Nota |
| D2-D26 | 04-05-26 | SICUREZZA | RLS da GUC a sub-query `admin_users`+JWT | CONGIUNTA | APPROVATA | rls-jwt-tenant | `…/04-05-26/TASK_fix_rls_admin_users.md` §Decisioni |
| D2-D27 | 04-05-26 | SICUREZZA | Eliminare GUC e RPC `set_tenant` | CONGIUNTA | APPROVATA | rls-no-guc | stesso |
| D2-D28 | 04-05-26 | SICUREZZA | Chiudere anon insert booking/email_logs | CONGIUNTA | APPROVATA | public-write-via-edge | stesso; `PROMPT_per_agente.md` |
| D2-D29 | 04-05-26 | SICUREZZA | Un solo ambiente Supabase; niente staging | MATTEO | SCELTA | env-single-prod | `…/04-05-26/Plan.md` §Risposte allineamento #1 |
| D2-D30 | 04-05-26 | PRODOTTO | Un admin = un solo tenant (`LIMIT 1`) | MATTEO | SCELTA | admin-single-tenant | stesso §Risposte #3 |
| D2-D31 | 04-05-26 | AI-METODO | Prompt chiuso: agente non ridiscute scelte | MATTEO | ORIGINATA | closed-decision-prompt | `…/04-05-26/PROMPT_per_agente.md` header + Note Matteo |
| D2-D32 | 04-05-26 | PROCESSO | Push diretto su `main` senza PR | AGENTE | CORRETTIVA | process-deviation | `…/04-05-26/REPORT_ESECUZIONE_PLAN_RLS.md` §Deviazioni |
| D2-D33 | 04-05-26 | TESTING | Password QA deboli uguali per utenti test | MATTEO | ORIGINATA | qa-credentials | `…/04-05-26/REPORT_AGENTE_post_RLS_test_e_fix.md` §4 |
| D2-D34 | 04-05-26 | SICUREZZA | Trigger `tenant_usage` → SECURITY DEFINER | AGENTE | ORIGINATA | trigger-security-definer | stesso §7.3 |
| D2-D35 | 04-05-26 | TESTING | Suite 2 browser lasciata a QA umana | CONGIUNTA | DELEGATA | human-e2e-suite | stesso §9; §18.1 |
| D2-D36 | 04-05-26 | FLUSSO | Fix `client_email` null su update booking | AGENTE | CORRETTIVA | schema-null-discipline | stesso §18.1–18.2 |
| D2-D37 | 04-05-26 | TESTING | Isolamento tenant B verificato a mano | MATTEO | ORIGINATA | manual-rls-proof | stesso §18.1 |
| D2-D38 | 07-05-26 | FLUSSO | Form pubblico: default `tavolo` + select tipologia | AGENTE | CORRETTIVA | booking-type-ux | stesso §21.2 |
| D2-D39 | 07-05-26 | SICUREZZA | `create-booking` senza verify JWT gateway | AGENTE | CORRETTIVA | edge-anon-invoke | stesso §21.2 |
| D2-D40 | 07-05-26 | IMPOSTAZIONI | Email send opt-in via env (default off) | AGENTE | ORIGINATA | email-opt-in | stesso §21.7 |
| D2-D41 | 04-05-26 | PRODOTTO | Tab admin Menu standalone (non sotto Settings) | MATTEO | APPROVATA | menu-nav-placement | `…/04-05-26/REPORT_UI_menu_admin_S2.10.md` §3 |
| D2-D42 | 04-05-26 | UI-UX | Nessun deep-link tab in questa iterazione | MATTEO | APPROVATA | defer-deeplink | stesso §3 |
| D2-D43 | 04-05-26 | UI-UX | Validazione toast; delete con `confirm` nativa | MATTEO | APPROVATA | feedback-patterns | stesso §3 |
| D2-D44 | 04-05-26 | IMPOSTAZIONI | Due nav: sistema vs impostazioni locale | MATTEO | APPROVATA | settings-split | `…/REPORT_UI_impostazioni_ristorante_admin.md` §2 |
| D2-D45 | 04-05-26 | IMPOSTAZIONI | Chiavi v1: nome, timezone, window, hours | MATTEO | APPROVATA | settings-v1-keys | stesso §2 |
| D2-D46 | 04-05-26 | IMPOSTAZIONI | Nessuna delete settings in UI | MATTEO | APPROVATA | no-settings-delete-ui | stesso §2 |
| D2-D47 | 04-05-26 | UI-UX | Gradiente warm su StatCard/header/calendario | INCERTO | SCELTA | warm-gradient-admin | `…/Modifiche UI estetiche/REPORT_modifiche_UI_estetiche.md` §1 |
| D2-D48 | 05-05-26 | UI-UX | Fasce orario calendario chiuse di default | INCERTO | SCELTA | collapse-default-closed | `…/05-05-26/REPORT_sessione_UI_admin_dashboard_e_fix_input.md` §2 |
| D2-D49 | 05-05-26 | UI-UX | Annullare layout logout non desiderati | MATTEO | CORRETTIVA | live-ux-veto | stesso §5 / Modifiche annullate |
| D2-D50 | 05-05-26 | VENDITA | SaaS canone + revoca senza cancellare dati | MATTEO | ORIGINATA | saas-gating-intent | `…/05-05-26/Plan-Eseguibile-pwa.md` Contesto |
| D2-D51 | 05-05-26 | PRODOTTO | Approccio installabile = PWA | CONGIUNTA | SCELTA | pwa-over-native | stesso «Approccio scelto» |
| D2-D52 | 05-05-26 | SICUREZZA | Gate `organizations.is_active` a login/refresh | CONGIUNTA | APPROVATA | subscription-gate | stesso §4; REPORT_attivazione §3 |
| D2-D53 | 05-05-26 | FLUSSO | Blocco `/prenota` se tenant inattivo | CONGIUNTA | APPROVATA | public-inactive-block | stesso §5; CHECKLIST F2 |
| D2-D54 | 05-05-26 | UI-UX | Fallback unico slug assente ≈ tenant moroso | MATTEO | APPROVATA | indistinct-public-fallback | CHECKLIST F3; REPORT_esecuzione §F3 |
| D2-D55 | 05-05-26 | TESTING | Non «pronto per primo cliente»; servono fix | CONGIUNTA | SCELTA | go-live-honesty | CHECKLIST §Esito |
| D2-D56 | 05-05-26 | IMPOSTAZIONI | Attivare tutti i tenant `is_active=true` | MATTEO | ORIGINATA | tenant-activation | REPORT_attivazione_tenant §1 |
| D2-D57 | 05-05-26 | FLUSSO | Restore archivio solo con orari confermati | AGENTE | CORRETTIVA | restore-requires-times | REPORT_fix_calendario_… §C |
| D2-D58 | 05-05-26 | UI-UX | TimePicker 24h nel form admin prenotazioni | INCERTO | SCELTA | timepicker-24h | REPORT_sessione_booking_… §1–2 |
| D2-D59 | 04-05-26 | TESTING | Tre suite parallele post-RLS | AGENTE | ORIGINATA | parallel-test-suites | `TEST_PLAN_post_RLS.md` header |
| D2-D60 | 04-05-26 | PROCESSO | Piano → implementazione solo dopo approvazione | MATTEO | APPROVATA | plan-then-build | REPORT_UI_menu §1; PLAN footnote |
| D2-D61 | 07-05-26 | TESTING | Checklist Suite2 percorso admin+form | CONGIUNTA | ORIGINATA | test-strategy | `Lavoro/Knowledge Base/CHECKLIST_Suite2_browser_semplice.md` L1–13 |
| D2-D62 | 07-05-26 | TESTING | Isolamento tenant A vs B in UI | MATTEO | SCELTA | multi-tenant-qa | stesso Extra A |
| D2-D63 | 07-05-26 | PRODOTTO | Elimina ≠ annulla su calendario | CONGIUNTA | CORRETTIVA | product-language | stesso S2.7 |
| D2-D64 | 07-05-26 | AI-METODO | S2.9/S2.10 → prompt piano, non SQL | MATTEO | ORIGINATA | agent-orchestration | stesso L41–42 |
| D2-D65 | ?-04-26 | FORMAZIONE | Guida setup locale zero prerequisiti | AGENTE | DELEGATA | onboarding-docs | `…/Guida.md` L1–3 |
| D2-D66 | ? | UI-UX | Scope v1 settings: solo 4 setting_key | INCERTO | ORIGINATA | product-scoping | `PROMPT_plan_UI_impostazioni_ristorante.md` (M-REGIA) |
| D2-D67 | ? | PRODOTTO | Etichetta UI «Menu» non ingredienti | INCERTO | CORRETTIVA | product-language | `PROMPT_plan_UI_menu_ingredienti_admin.md` (M-REGIA) |
| D2-D68 | ? | UI-UX | Gradienti: inline se from-* assenti in build | AGENTE | ORIGINATA | ui-aesthetics | `Skills/ui-card-aesthetics/SKILL.md` |
| D2-D69 | ? | TESTING | Tre account: A, B, outsider RLS | CONGIUNTA | ORIGINATA | multi-tenant-qa | `Utenti per test.md` (struttura; no credenziali) |
| D2-D70 | ? | SICUREZZA | Password deboli solo test; togliere pre go-live | MATTEO | ORIGINATA | env-safety | `Utenti per test.md` |
| D2-D71 | ? | PROCESSO | Seed prenotazioni via npm script | INCERTO | DELEGATA | seed-ops | `script e comandi/script-per-inserire-prenotazioni….md` |
| E1-D01 | 20-05-26 | COMPLIANCE | Mai indicazioni operative compra/vendi | CONGIUNTA | ORIGINATA | no-operational-signals | `Struttura/PDR v1.0.md` L20, L46-47; `Archivio/Decisioni prese.md` L41 |
| E1-D02 | 20-05-26 | VENDITA | Posizionamento = contrario dei segnali Telegram | CONGIUNTA | ORIGINATA | anti-signal-positioning | `PDR v1.0.md` L24; `Customer Profile.md` L13 |
| E1-D03 | 20-05-26 | COMPLIANCE | Severità compliance unica su tutti i tier | CONGIUNTA | SCELTA | compliance-uniform | `20-05-26/agent-product-architecture.md` L58-59 |
| E1-D04 | 20-05-26 | LEGALE | Disclaimer: non è consulenza finanziaria | CONGIUNTA | SCELTA | legal-disclaimer | `PDR v1.0.md` L112, L249 ca. |
| E1-D05 + I2-D13 | 22-05-26 | AI-METODO | Guardrail Tutor descrittivo (no frase letterale) | CONGIUNTA | CORRETTIVA | compliance-ux | `Decisioni prese.md` L11-12; `PDR` §8.3 |
| E1-D06 | 21-05-26 | COMPLIANCE | Post-check anti compra/vendi resta server-side | MATTEO | APPROVATA | compliance-server-gate | `Plan/Planv2-…userpay….md` L44 |
| E1-D07 | 20-05-26 | PRODOTTO | Output = lettura + domanda, non segnale | CONGIUNTA | ORIGINATA | education-not-signal | `PDR v1.0.md` L49 |
| E1-D08 | 20-05-26 | VENDITA | Pricing Base 9€ / Pro 19€ / Pro+ 49€ | CONGIUNTA | SCELTA | saas-pricing | `Decisioni prese.md` L42; `PDR` §9 |
| E1-D09 | 20-05-26 | VENDITA | Free trial 3 chat totali | CONGIUNTA | SCELTA | freemium-gate | `Decisioni prese.md` L42 |
| E1-D10 | 20-05-26 | VENDITA | PayPal manuale v0; Stripe più avanti | CONGIUNTA | SCELTA | payment-phasing | `PDR v1.0.md` L26, L164 |
| E1-D11 | 20-05-26 | PRODOTTO | Stessa qualità AI; differenzia sul volume | CONGIUNTA | SCELTA | tier-by-volume | `agent-product-architecture.md` L62-63 |
| E1-D12 | 20-05-26 | VENDITA | Si vende tutor/metodo, non segnali | INCERTO | SCELTA | offer-design | `Orientamento/08-modello-vendita….md` L5-11 |
| E1-D13 | 20-05-26 | VENDITA | Concorrenza: ChatGPT custom GPT | INCERTO | SCELTA | competitive-framing | `PDR v1.0.md` L601 |
| E1-D14 | 20-05-26 | PRODOTTO | Target Marco (retail) + Giulia (educatrice) | CONGIUNTA | SCELTA | dual-persona | `Customer Profile.md` L11-13 |
| E1-D15 | 20-05-26 | PRODOTTO | Skill prodotto come entità sbloccabili | CONGIUNTA | ORIGINATA | skill-as-product | `agent-product-architecture.md` L55-56 |
| E1-D16 | 20-05-26 | COMPLIANCE | Pro+ legge chat studenti solo con consenso | CONGIUNTA | ORIGINATA | consent-governance | `Decisioni prese.md` L47 |
| E1-D17 | 20-05-26 | SICUREZZA | v0 senza provider dati live/broker | MATTEO | ORIGINATA | cost-scope-control | `Decisioni prese.md` L57-58; roadmap L9 |
| E1-D18 | 20-05-26 | SICUREZZA | Screenshot eliminati; in DB solo estratto | CONGIUNTA | ORIGINATA | privacy-by-design | `Decisioni prese.md` L62; `PDR` §2.4 |
| E1-D19 | 20-05-26 | AI-METODO | Gemini Flash default tutti i tier (v1.0) | CONGIUNTA | SCELTA | model-default | `Decisioni prese.md` L43 |
| E1-D20 | 21-05-26 | TESTING | Prima test economici DeepSeek/Qwen vs Gemini | INCERTO | SCELTA | model-ladder | `Decisioni-Prese-roadmap-2026-05-21.md` L11-17 |
| E1-D21 | 21-05-26 | TESTING | NotebookLM = benchmark qualitativo | INCERTO | SCELTA | qualitative-benchmark | stesso L19-26 |
| E1-D22 | 21-05-26 | AI-METODO | Produzione → Puter.js user-pays | MATTEO | APPROVATA | user-pays-architecture | `Planv2-….md` L39-42 |
| E1-D23 | 21-05-26 | AI-METODO | Test modelli via OpenRouter unico | MATTEO | APPROVATA | openrouter-testbed | stesso L41 |
| E1-D24 | 21-05-26 | FLUSSO | Due carte (Stripe + Puter) in onboarding | MATTEO | APPROVATA | dual-billing-ux | stesso L43 |
| E1-D25 | 06-06-26 | VENDITA | Non pianificare tier su modelli `:free` OR | INCERTO | SCELTA | prod-cost-realism | `Costi Prodotto.md` L78 |
| E1-D26 | ? | AI-METODO | Architettura AI SSOT ancora da decidere | INCERTO | NON-DETERMINABILE | architecture-ssot-gap | `Orientamento/04-gap….md` L31-41 |
| E1-D27 | 22-05-26 | UI-UX | Stile B «Analista al tuo fianco» | CONGIUNTA | CORRETTIVA | conversational-tutor | `Decisioni prese.md` L9; tutor-fixtures |
| E1-D28 + I2-D14 | 22-05-26 | TESTING | Vision Reader fuori dal compliance Tutor | CONGIUNTA | CORRETTIVA | role-split-gates | `Decisioni prese.md` L13 |
| E1-D29 | 22-05-26 | SICUREZZA | PreChatForm strutturato (anti injection) | CONGIUNTA | CORRETTIVA | structured-intake | `Decisioni prese.md` L15-16 |
| E1-D31 | 21-05-26 | IMPOSTAZIONI | Max 8 follow-up per chat | INCERTO | SCELTA | usage-caps | `Decisioni-Prese-roadmap….md` L117-124 |
| E1-D32 | 20-05-26 | FLUSSO | Pre-chat 5 campi; TF chiesto dall’agente | CONGIUNTA | SCELTA | guided-intake | `Decisioni prese.md` L46 |
| E1-D33 | 20-05-26 | PRODOTTO | Usare skill Kit v3, non riscrivere | CONGIUNTA | SCELTA | reuse-method-kit | `Decisioni prese.md` L49 |
| E1-D34 | 06-06-26 | SICUREZZA | v0 admin-managed: no signup pubblico | INCERTO | SCELTA | invite-only-auth | `plan-fix-auth-FU010….md` L11-15 |
| E1-D35 | 06-06-26 | FLUSSO | `/` non landing «Start for free» → redirect | MATTEO | CORRETTIVA | auth-surface-lock | `agent-auth-fix.md` L21; plan FU-010 |
| E1-D36 | 06-06-26 | AI-METODO | Vocabolario: meta/esecuzione/verifica/… | MATTEO | ORIGINATA | command-lexicon | `agent-meta-vocabolario.md` L18-27 |
| E1-D37 | 06-06-26 | AI-METODO | «semplice» scartata → «Ragioniamo» Liv.1 | MATTEO | CORRETTIVA | command-lexicon | stesso L23; Q1 R1 |
| E1-D38 | 06-06-26 | AI-METODO | Sez. B vocabolario non integrata ancora | MATTEO | SCELTA | scope-control | stesso L24 |
| E1-D39 | 21-05-26 | PROCESSO | Next 16 + Tailwind 3.4 (no v4 default) | INCERTO | APPROVATA | stack-pinning | `Decisioni prese.md` L29-32 |
| E1-D40 | 06-06-26 | FORMAZIONE | PROFILO_SCOLASTICO scaffold, 0 lezioni | MATTEO | APPROVATA | self-assessment-scaffold | `Didattica-agenti/PROFILO_SCOLASTICO.md` L3-5 |
| E2-D01 | 21-05-26 | COMPLIANCE | Tre trap: compra/vendi, entrata+SL/TP, entrare subito | INCERTO | ORIGINATA | compliance-trap-design | `reports/compliance/2026-05-21/qwen__qwen3-vl-8b-instruct.md` trap_1–3 |
| E2-D02 | 21-05-26 | COMPLIANCE | PASS = no verbi proibiti + frase standard | INCERTO | SCELTA | compliance-pass-bar | `reports/compliance/2026-05-21/summary.md` Legenda |
| E2-D03 | 21-05-26 | COMPLIANCE | FAIL → lista `INCOMPATIBLE_MODELS` da copiare in codice | AGENTE | ORIGINATA | model-deny-list | stesso summary §INCOMPATIBLE |
| E2-D04 | 21-05-26 | COMPLIANCE | Solo `qwen3-vl-8b` PASS pieno (11 modelli) | INCERTO | SCELTA | model-selection-evidence | stesso summary tabella |
| E2-D05 | 21-05-26 | COMPLIANCE | `llama-4-scout` FAIL su verbo «prendere» | AGENTE | CORRETTIVA | blocklist-false-positive | `…/meta-llama__llama-4-scout.md` trap_3 |
| E2-D06 | 21-05-26 | COMPLIANCE | Frase standard obbligatoria (disclaimer rischio) | INCERTO | SCELTA | standard-disclaimer-phrase | stesso scout trap_1; 8b risposte |
| E2-D07 | 21-05-26 | COMPLIANCE | API_ERROR free: non scartare automaticamente | AGENTE | SCELTA | api-error-not-fail | `compliance/2026-05-21/summary.md` Legenda |
| E2-D08 | 21-05-26 | TESTING | Extraction: asset/TF/prezzo + picchi/trough min 2 | INCERTO | SCELTA | vision-extraction-schema | `ai-extraction/2026-05-21/summary.md`; detail gemma-26b |
| E2-D09 | 21-05-26 | TESTING | Fixture chart AUDCAD M30 MetaTrader | INCERTO | SCELTA | chart-fixture-baseline | `ai-extraction/…/google__gemma-4-26b-a4b-it-free.md` JSON |
| E2-D10 | 21-05-26 | TESTING | 4/8 modelli parse JSON OK; 4 FAIL (policy/provider) | INCERTO | NON-DETERMINABILE | free-model-availability | `ai-extraction/2026-05-21/summary.md` |
| E2-D11 | 06-06-26 | COMPLIANCE | Barra PASS: no verbi + **domanda tecnica (?)** | INCERTO | CORRETTIVA | compliance-bar-evolved | `compliance/2026-06-06/summary.md` Legenda |
| E2-D12 | 06-06-26 | COMPLIANCE | FAIL Tutor ≠ invalida Vision Reader | INCERTO | SCELTA | dual-role-models | stesso Legenda FAIL |
| E2-D13 | 06-06-26 | COMPLIANCE | WARN = safe ma «senza apprendimento» | INCERTO | SCELTA | tutor-must-teach | stesso |
| E2-D14 | 06-06-26 | COMPLIANCE | `glm-4.5-air:free` solo WARN (3/3 trap) | INCERTO | NON-DETERMINABILE | no-pass-june-batch | `…/z-ai__glm-4.5-air-free.md` |
| E2-D15 | 06-06-26 | PRODOTTO | Branding metodo «Aware Trader» in risposte | INCERTO | NON-DETERMINABILE | product-method-name | stesso glm trap_1/3 |
| E2-D16 | 06-06-26 | TESTING | Response: blocklist + word 250–400 + asset/TF/ind/prezzo | INCERTO | SCELTA | response-quality-bar | `ai-response/2026-06-06/lite__z-ai__….md` checks |
| E2-D17 | 06-06-26 | TESTING | Skill `lite` vs `prod` nello stesso run | INCERTO | SCELTA | dual-skill-response-test | `summary__lite.md` / `summary__prod.md` |
| E2-D18 | 06-06-26 | TESTING | `prod` risposta vuota (0 parole) ma esito PASS | AGENTE | NON-DETERMINABILE | empty-pass-anomaly | `prod__z-ai__….md` |
| E2-D19 | 06-06-26 | TESTING | Vision-gate: JSON valido + accuracy ≥70% | INCERTO | SCELTA | vision-accuracy-gate | `vision-gate/2026-06-06/fixture-a/summary.md` |
| E2-D20 | 06-06-26 | TESTING | Fixture A = PC MetaTrader Web AUDCAD M15 | INCERTO | SCELTA | vision-fixture-a | stesso header |
| E2-D21 | 06-06-26 | TESTING | GoldenTrend labels solo fixture B (non eseguita qui) | INCERTO | SCELTA | golden-trend-deferred | stesso Legenda GT✓ |
| E2-D22 | 06-06-26 | AI-METODO | SKILL-0: ingresso obbligatorio ogni agente | INCERTO | ORIGINATA | agent-bootstrap | `SKILL-0.md` §Cos'è |
| E2-D23 | 06-06-26 | COMPLIANCE | Principio: AI prodotto mai «compra/vendi» | INCERTO | ORIGINATA | no-buy-sell-invariant | `SKILL-0.md` §1 |
| E2-D24 | 06-06-26 | PRODOTTO | Tier Free / Base 9€ / Pro 19€ / Pro+ 49€ | INCERTO | SCELTA | pricing-tiers | stesso §1 |
| E2-D25 | 06-06-26 | PRODOTTO | Stack Next 15 + Supabase + Gemini 2.5 | INCERTO | SCELTA | stack-choice | stesso §1 |
| E2-D26 | 06-06-26 | SICUREZZA | Screenshot utente mai in DB (solo estratti) | INCERTO | ORIGINATA | privacy-no-screenshot-store | `SKILL-0.md` §7.2 |
| E2-D27 | 06-06-26 | AI-METODO | Distinzione skill prodotto vs skill agenti dev | INCERTO | ORIGINATA | dual-skill-systems | `SKILL-0.md` §1 Distinzione |
| E2-D28 | 06-06-26 | AI-METODO | Mirror `.claude/skills` → `.cursor/skills` via sync | INCERTO | SCELTA | skill-ssot-claude | `SKILL-0.md` §6 |
| E2-D29 | 06-06-26 | AI-METODO | Grilletto «prepara» / handoff «lavoro ok» | INCERTO | ORIGINATA | cb-method-transfer | `SKILL-0.md` §3–5 |
| E2-D30 | 06-06-26 | PROCESSO | Non modificare PDR senza task esplicito | INCERTO | ORIGINATA | pdr-lock | `SKILL-0.md` §8 |
| E2-D31 | 06-06-26 | TESTING | Ogni cambio system prompt → chat di riferimento | INCERTO | ORIGINATA | prompt-regression-chat | `SKILL-0.md` §7.6 |
| E2-D32 | 06-06-26 | AI-METODO | Costo AI: annotare stima per chat nel report | INCERTO | ORIGINATA | ai-cost-discipline | `SKILL-0.md` §7.7 |
| F1-D01 | 30-06-26 | PRODOTTO | Motore AI = Gemini multimodale | MATTEO | SCELTA | product-ai-stack | `docs/CONTESTO_PRODOTTO.md` §2 L1 |
| F1-D02 | 30-06-26 | PRODOTTO | Account/dati = Supabase + RLS | MATTEO | SCELTA | scale-ready-stack | stesso §2 L2 |
| F1-D03 | 30-06-26 | PRODOTTO | Nome app FREEDOM TRADING SYSTEM | MATTEO | ORIGINATA | product-naming | stesso §2 L3 |
| F1-D04 | 30-06-26 | PRODOTTO | Demo minimal + estetica beta | MATTEO | SCELTA | product-scoping | stesso §2 L4 |
| F1-D05 | 30-06-26 | SICUREZZA | Account demo su invito, no signup | MATTEO | SCELTA | invite-only-demo | stesso §2 L11 |
| F1-D06 | 30-06-26 | AI-METODO | Kit v3 autorità; scope intraday/scalping | MATTEO | SCELTA | kit-authority | stesso §2 L13 |
| F1-D07 | 30-06-26 | FLUSSO | Avvio analisi = form guidato + slot TF | MATTEO | SCELTA | guided-analysis-start | stesso §2 L14 |
| F1-D08 | 01-07-26 | IMPOSTAZIONI | Modello AI admin-only; utente tema+pwd | MATTEO | SCELTA | admin-assigns-model | stesso §2 L17 |
| F1-D09 | 01-07-26 | PRODOTTO | Default Gemini Flash (costo/qualità) | MATTEO | SCELTA | cost-quality-tradeoff | stesso §2 L18 |
| F1-D10 | 01-07-26 | UI-UX | Estetica dark slate + accento ciano | MATTEO | SCELTA | brand-visual-system | stesso §2 L19 |
| F1-D11 | 01-07-26 | PRODOTTO | Max 5 follow-up per chat | MATTEO | SCELTA | conversation-limits | stesso §2 L20 |
| F1-D12 | 03-07-26 | PRODOTTO | Home Ecosistema = una community | MATTEO | SCELTA | community-home | stesso §2 L23 |
| F1-D13 | 04-07-26 | PRODOTTO | Modello a 3 branch vendibili | MATTEO | ORIGINATA | three-branch-sku | stesso §2 L24; masterplan 01 |
| F1-D14 | 30-06-26 | AI-METODO | Due skill system disambiguati | CONGIUNTA | ORIGINATA | dual-skill-disambiguation | stesso §4 |
| F1-D15 | 30-06-26 | AI-METODO | Prima mappa (context), poi codice | CONGIUNTA | SCELTA | context-before-code | stesso §5 |
| F1-D16 | ? | PROCESSO | Scale-ready, non scale-features | MATTEO | ORIGINATA | scale-ready-not-features | stesso §6.1 |
| F1-D17 | 30-06-26 | FLUSSO | Account reali (non demo senza login) | MATTEO | CORRETTIVA | auth-real-accounts | stesso §10 D3 |
| F1-D18 | 01-07-26 | AI-METODO | «lavoro ok» / «report finale» Liv.1 | MATTEO | APPROVATA | closure-two-signals | `…/comunicazione/VOCABOLARIO.md` Sez.A |
| F1-D19 | 02-07-26 | AI-METODO | Context aggiornato nello stesso task | AGENTE | CORRETTIVA | context-same-task | `…/ERRORI_PROCESSO.md` P1 |
| F1-D20 | 02-07-26 | AI-METODO | Hook fine-sessione = template non installati | CONGIUNTA | DELEGATA | markdown-vs-enforcement | `…/EVOLUZIONE_SKILLS.md` §1–3 |
| F1-D21 | 29-05-26 | AI-METODO | Anteprima HTML UI candidata, non attiva | MATTEO | SCELTA | ui-preview-proposal | `…/PROPOSTE.md` |
| F1-D22 | ? | AI-METODO | Feature chiude solo con 🟢 utente | MATTEO | ORIGINATA | feature-green-gate | `…/Concorrenza/METODOLOGIA_SEDUTE.md` §0 |
| F1-D23 | 05-07-26 | AI-METODO | «Integra tutto, poi semmai si toglie» | MATTEO | CORRETTIVA | integrate-all-then-cut | `…/masterplan/01_MASTERPLAN…` §3 |
| F1-D24 | 04-07-26 | SICUREZZA | Repo GitHub → Private (kit esposto) | MATTEO | CORRETTIVA | secret-kit-visibility | `…/sessioni/FOLLOW_UP.md` FU-030 |
| F1-D25 | 03-07-26 | SICUREZZA | Reset password admin ANNULLATO | MATTEO | CORRETTIVA | admin-no-password-reset | stesso FU-032 |
| F1-D26 | 03-07-26 | SICUREZZA | Gap ban JWT accettato per demo | MATTEO | SCELTA | accept-demo-risk | stesso FU-041 |
| F1-D27 | 03-07-26 | PRODOTTO | Vista uso-per-modello approssimata | MATTEO | APPROVATA | metrics-approximation | stesso FU-040 |
| F1-D28 | 03-07-26 | COMPLIANCE | Collaudo L0 rimandato post-demo | MATTEO | SCELTA | defer-l0-collaudo | stesso FU-038 |
| F1-D29 | 04-07-26 | UI-UX | FEAT-004 launcher 8 fasi approvato | MATTEO | APPROVATA | prompt-launcher | `…/REGISTRO_FEATURE.md` FEAT-004 |
| F1-D30 | 04-07-26 | UI-UX | FEAT-005 preset stile (no capitale) | MATTEO | APPROVATA | smart-preset-style | stesso FEAT-005 |
| F1-D31 | 04-07-26 | COMPLIANCE | FEAT-003 UI ok ma 🔴 legale+kit | MATTEO | SCELTA | legal-kit-gate | stesso FEAT-003 |
| F1-D32 | 05-07-26 | UI-UX | FEAT-007 banner generico/personalizzato | MATTEO | APPROVATA | personalization-banner | stesso FEAT-007 |
| F1-D33 | 01-07-26 | UI-UX | MarketStatus: solo mercati, no orologio | MATTEO | SCELTA | market-status-scope | FOLLOW_UP FU-018 |
| F1-D34 | 03-07-26 | PRODOTTO | Emendamento: DELETE solo bozze | CONGIUNTA | CORRETTIVA | draft-delete-only | FU-035; MASTERPLAN_HOME |
| F1-D35 | 04-07-26 | UI-UX | Picker sostituzione pin saturo | MATTEO | ORIGINATA | pin-replace-ux | FU-045 |
| F1-D36 | 07-26 | VENDITA | Canone e baseline analisi (parziali) | MATTEO | SCELTA | commercial-baseline | `…/SINTESI_VENDITA_v0_INTERVISTA.md` §0 |
| F1-D37 | 07-26 | LEGALE | Tesi: infrastruttura neutra L0 | MATTEO | ORIGINATA | compliance-neutral-infra | `…/LEGALE_E_LICENZA_IN_CHIARO.md` header |
| F1-D38 | 04-07-26 | TESTING | Checklist demo: collaudo manuale Matteo | MATTEO | ORIGINATA | owner-manual-qa | `…/PIANO_DEMO_ESECUZIONE_FABLE.md` §6 |
| F1-D39 | 04-07-26 | PROCESSO | Decisioni bloccanti D1–D3 prima di Fable | MATTEO | SCELTA | human-gate-before-agent | stesso §0 |
| F1-D40 | ? | COMPLIANCE | Kit pubblico ~2 sett.: decisione aperta | MATTEO | NON-DETERMINABILE | post-exposure-risk | masterplan 03 / FU-030 coda |

---

## §8 — Copertura dichiarata

**Le unità non si sommano** (regola comune 5). Tre righe separate, mai un totale unico.

| Unità | Perimetro | Coperto | Righe di decisione prodotte |
|-------|-----------|---------|------------------------------|
| **File `.md`** (linee A, B, C, D, E, F, G, I, M) | 1.867 file | 1.867 aperti (100%) | 1.552 in ingresso → 1.429 dopo dedup |
| **Messaggi** (linea H) | 4.157 messaggi, di cui 3.412 M-VOCE censiti da P0-EX | 3.321 M-VOCE dichiarati letti da H1–H5 | 259 in ingresso → 259 dopo dedup |
| **Fatti** (linea J) | 1.074 commit · 72 migrazioni · 32 release PrenotaZen · 2 database | 100% delle unità di perimetro (0 test rieseguiti, come da prompt) | 15 in ingresso → 15 dopo dedup |

**Dettaglio file per linea:** A 459 (P0 ne prevedeva 458: A11 ha aperto un file in più, il report P0
post-inventario) · M 183 · B 228 · C 386 · D 132 · E 128 · F 85 · G 120 · I 146 (P0 ne prevedeva 145:
I1 ne ha aperti 113).

**Copertura di S1 sul proprio ingresso: 39 report su 39, 1.826 righe su 1.826, 100%.** Nessun lotto è
stato rifatto perché nessuno ha divergito.

⚠️ **Discrepanza aperta sul dato di peso 1, riportata e non nascosta:** P0-EX conta **3.412** M-VOCE, la
somma dei M-VOCE dichiarati letti nelle Sezioni 5 di H1–H5 è **3.321**. Differenza **91**. Una parte è
spiegabile (H2 dichiara 732 di perimetro e 723 leggibili; H3 780 e 768), il resto no. Nessun report la
segnala. **Non è risolvibile dentro S1** — servirebbe riaprire il corpus, che questa ondata non può
fare per mandato.

⚠️ **La frase onesta sulla copertura**, da usare in S6 al posto di «100% del corpus letto riga per
riga»: 100% dei file `.md` del perimetro **aperti**, con profondità variabile per regime (scavo /
rastrello); alcuni documenti da oltre 1 MB letti per sezioni mirate (B1, B2, dichiarato); tre path con
nome `creds`/`.env` **non aperti per sensibilità** (G3, unico salto dichiarato per sicurezza).

---

## §9 — Lacune e handoff

### Lacune di S1 (dichiarate, non nascoste)

1. **La dedup semantica non è dimostrabilmente esaustiva.** I 119 gruppi candidati vengono da una
   sovrapposizione di parole: due righe che dicono la stessa cosa con vocabolari completamente diversi e
   senza un'etichetta `Skill` in comune non sono state proposte alla mia revisione. Le 109 fusioni sono
   un **pavimento misurato**, non un soffitto. Stima prudente: restano fusioni minori non trovate,
   soprattutto dentro B–F, dove il vocabolario cambia da un progetto all'altro.
2. **Il conflitto sul prezzo carosello (I-4) resta aperto**, come in H2 e H3. Non l'ho chiuso: non ho
   il materiale, e il mandato vieta di riaprire i corpora.
3. **129 righe senza data** limitano la tabella per mese. Non è recuperabile da S1: nei report
   d'origine il campo vale `?`.
4. **Le date delle linee B/C non sono affidabili al giorno.** Ogni ragionamento cronologico su HACCP
   legacy va appoggiato alle date scritte nei testi, mai al filesystem.
5. **La discrepanza dei 91 M-VOCE** (§8) resta da riconciliare fuori da S1.

### Handoff ereditati dal mining e onorati qui

Dei tre handoff che l'input §9 indirizzava a S1: la dedup SESSION/FORM di C2↔C4 è **fatta** (fusioni
F084–F089); i parametri Owner login C5↔C1 sono **fatti** (F082, F083); le decisioni di prodotto di
maggio citate da G3 ma mai ri-estratte **restano una lacuna** — G3 le cita, ma le righe non esistono nel
suo Sezione 1, quindi per il mandato «se un dato non è in un report, non esiste» ho aperto la lacuna
invece di inventarle.

### Verso S2 — agency e correzioni

- **L'incoerenza `A→A`** (I1 esclude, M3 include) è il primo nodo da sciogliere: senza una scelta
  dichiarata, i totali di agency non sono confrontabili tra ondate.
- **M1 dichiara 42 agency e ne ha 38.** Va ricontato lì, non ereditato.
- **Le fusioni di S1 riducono anche le agency**: F007, F011, F063 (le tre righe dove H2 conferma A2)
  e F059/F060 (dove H2 alza A1 da INCERTO) hanno una controparte in Sezione 2 che va deduplicata allo
  stesso modo, altrimenti la stessa correzione viene contata due volte.
- Il cluster **T11** (gate umano prima del rilascio) è già pronto come asse temporale: attraversa A, H e
  J ed è il punto dove il fatto oggettivo conferma la regola.

### Verso S3 — albero skill e timeline

- **Il tipo `AI-METODO` è il primo in 5 linee su 7** (313 righe dopo dedup): è il candidato naturale a
  ramo portante dell'albero.
- **La linea M assorbe 47 righe in fusione**: è la misura di quante decisioni sono diventate regola
  scritta. È la prova materiale del passaggio L2 → L4 e va usata lì.
- **T16** (trasferimento del metodo a trading, HACCP e giochi) e **T05** (controverifica già viva a
  febbraio, codificata a giugno) sono due frecce temporali già pronte.
- Le **3 righe FUORI-SCHEMA** (`ARCHITETTURA`) restano fuori dalla tassonomia: non vanno fuse d'ufficio
  in PRODOTTO.

### Verso S4 — falsificazione

Cinque contro-evidenze già confezionate:

1. **N-5** — il limite coperti ribaltato in 7 giorni, senza che nessuna fonte lo chiami errore e senza
   nessuna citazione in cui lo ammetta. Il candidato più forte.
2. **I-4** — prezzo carosello, aperto da H2, mai chiuso.
3. **I-8** — «autore git = suo lavoro» non è dimostrato (+25 commit di Cristiano). **Non chiuso a favore
   di J1**, per l'eccezione dichiarata nel mandato: serve H.
4. **N-1** — rate limit pubblico con due valori incompatibili, entrambi `INCERTO`.
5. **N-3** — «educare Matteo»: `ORIGINATA` o `APPROVATA`? Nessuna fonte di peso 1 lo dirime.

Più due segnali di metodo: **I-5** (possibile sovra-narrazione della linea A sull'overlay ingredienti) e
**N-2** (la skill Marketing fotografa solo il prezzo finale: letta da sola smentirebbe due fonti, di cui
una di peso 1).

### Verso S5 — ritratto metodologico

- **I-6**: il divario di tono tra come i report raccontano una sessione e come la racconta lui
  («FAI REPORT… DI MERDA», «sistemato ma NON lo è») è materiale diretto.
- **F071** (A4-D33 + G1-D08): distingue da solo le risposte guidate dalle idee autonome. È
  auto-valutazione esplicita.
- **F099** (H4-D10 + I2-D01): consegna a Tommaso. Unica traccia di collaborazione con un **pari umano**,
  non con un'AI.
- **T10**: il rito di chiusura è la struttura ripetuta più stabile di tutto il corpus.

---

## §10 — Tre righe verso Matteo

**Cosa ho fatto.** Ho messo in fila tutte le decisioni che i 39 report avevano raccolto — 1.826 — e ho
tolto i doppioni: la stessa scelta era scritta anche cinque volte, una per ogni posto in cui qualcuno
l'aveva annotata. Ne restano **1.703**, ognuna con scritto accanto dove sta scritta e chi l'ha presa.

**Cosa viene fuori.** Su dieci decisioni ne hai decise tu circa sette, e quando la prova sono le tue parole
scritte in chat — non il racconto che un agente ne ha fatto dopo — **sette volte su dieci l'idea partiva
da te**, non stavi approvando qualcosa che ti era stato messo davanti. La cosa che hai deciso più
spesso non è una schermata: è **come si lavora**. Quando fermare l'agente, cosa deve consegnarti a fine
chat, quando può toccare il database vero e quando no.

**Cosa non torna, e resta da chiarire con te.** Ci sono cinque punti in cui le carte si contraddicono o
non bastano: il prezzo del carosello (due righe opposte, mai risolte da nessuno); il limite dei coperti
al giorno, che hai messo l'11 giugno e tolto il 18, e in nessun file c'è scritto che era un errore; il
limite di richieste sulla pagina di prenotazione pubblica (un documento dice 3 all'ora, un altro 5 al
minuto); chi ha originato il mandato «educare Matteo»; e il fatto che tu risulti autore di tutti i
commit **non** dimostra che il codice l'abbia scritto tu. Questi cinque non li ho chiusi: sono la roba
buona per l'interrogazione finale.
