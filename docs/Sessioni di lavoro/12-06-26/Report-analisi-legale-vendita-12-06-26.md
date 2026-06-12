# Analisi legale e di vendita — 12-06-26

> Analisi 3 di 3 (le altre due: solidità codice e skill system, report separati).
> Contesto dichiarato da Matteo: **nessuna attività aperta**, mercato **solo Italia per ora**, vendita **mista** (diretta all'inizio, self-service poi).
> ⚠️ Questa è un'analisi orientativa da sviluppatore senior, NON sostituisce commercialista e avvocato. Le due figure servono entrambe, una volta, prima del primo contratto firmato.

---

## PARTE 1 — Cosa DEVI fare per vendere legalmente in Italia/UE

### Cosa hai GIÀ fatto (e fatto bene)

Lo stato in `Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` è reale e più avanti della media delle micro-SaaS:

- ✅ Sicurezza tecnica DB (RLS forzato, rate limit 3 req/min con ban, key ruotata)
- ✅ DPA con Supabase firmato (Ref `Q4RYF-5FVPD-4LXZY-8JABB`) con SCC per trasferimenti extra-UE
- ✅ Privacy Policy v2.0 in app (`/privacy`, dinamica per tenant)
- ✅ Template DPA verso i ristoranti clienti (art. 28 GDPR)
- ✅ Decisione cookie corretta: niente banner perché non ci sono cookie di tracciamento

### Cosa MANCA — in ordine di blocco (non puoi vendere senza i primi 3)

**1. Partita IVA — BLOCCANTE, costo ~0-400€, tempo 1-2 settimane**
Senza partita IVA non puoi emettere fattura, quindi non puoi incassare da un ristorante. Percorso consigliato per partire:
- **Regime forfettario**: limite 85.000€/anno di ricavi, tassazione **5% per i primi 5 anni** (startup), poi 15%. Niente IVA in fattura (semplifica tutto all'inizio).
- Codice ATECO: area software/servizi web (es. 62.01 produzione software / 63.12 portali web — lo decide il commercialista in base all'attività prevalente).
- INPS gestione separata (~26% sul reddito imponibile, che in forfettario è ridotto dal coefficiente di redditività ~67%).
- La **SRL si valuta dopo**, quando hai 10+ clienti paganti o ricavi che si avvicinano al limite: costa 1.500-3.000€/anno di gestione ma separa il tuo patrimonio personale dai rischi dell'attività.

**2. Contratto di abbonamento B2B (Termini di Servizio) — BLOCCANTE**
È il documento che il ristoratore accetta quando si abbona. Oggi non esiste. Deve coprire:
- oggetto del servizio e cosa NON è incluso (es. l'app gestisce prenotazioni, non garantisce clienti)
- **limitazione di responsabilità** (es. se l'app è giù un sabato sera e il ristorante perde prenotazioni, fin dove rispondi — tetto tipico: i canoni degli ultimi 12 mesi)
- disponibilità del servizio senza promettere SLA che non puoi mantenere (sei su Supabase/Vercel free/pro: NON promettere 99.9%)
- durata, rinnovo, recesso (consigliato: mensile disdicibile sempre, annuale con preavviso 30gg)
- sorte dei dati a fine contratto (export + cancellazione entro X giorni — già coerente col tuo DPA)
- foro competente e legge italiana
È B2B (il ristorante è un'impresa), quindi NON si applica il Codice del Consumo: molta più libertà contrattuale rispetto al B2C. Da far rivedere a un avvocato una volta (~500-1.000€), poi lo riusi per tutti.

**3. Fatturazione elettronica — BLOCCANTE ma facile**
Obbligatoria in Italia anche in forfettario. Si risolve con un servizio tipo Fatture in Cloud / Aruba (~50-100€/anno) o con quello gratuito dell'Agenzia delle Entrate.

**4. Completare la FASE 2 legale già mappata — non bloccante per il primo cliente, ma da chiudere entro i primi 3 mesi**
Già tracciata in `LEGAL_STATE_CONTEXT.md`: registro trattamenti art. 30, runbook data breach, lista sub-processor pubblica, email `privacy@`. Aggiungo: **verifica la region Supabase prod** (è ancora segnata "da verificare" — se è USA cambia cosa devi scrivere in Privacy Policy).

**5. Cose consigliate ma non obbligatorie**
- **Marchio**: prima di stampare materiale, deposito marchio nazionale UIBM (~200€ fai-da-te) o UE EUIPO (~850€). Verifica prima che il nome non sia già registrato (ricerca su TMview, gratis).
- **Assicurazione RC professionale** con estensione cyber (~300-600€/anno): copre se un bug causa danni a un cliente (es. prenotazioni perse, data breach).
- **European Accessibility Act** (in vigore da giugno 2025): impone accessibilità WCAG 2.1 AA ai servizi digitali rivolti ai consumatori. Le **microimprese (<10 addetti, <2M€) sono esenti** per i servizi — quindi tu oggi sei esente. MA la pagina Prenota e il menu QR sono usati dai consumatori finali: renderli accessibili è un argomento di vendita verso ristoranti attenti (e ti prepara a quando non sarai più micro).

### E per vendere fuori UE?

Per ora **non fare nulla** (hai scelto solo Italia). Quando servirà:
- **UE (altri paesi)**: già quasi coperto — GDPR vale ovunque in UE, serve solo il regime IVA giusto (B2B intra-UE: reverse charge con iscrizione VIES; B2C: regime OSS). Il forfettario complica le vendite intra-UE: altro motivo per passare a regime ordinario/SRL quando esci dall'Italia.
- **UK**: UK GDPR (quasi identico, il DPA Supabase ha già lo UK Addendum), VAT UK se superi soglie.
- **Svizzera**: nLPD (legge privacy svizzera, simile a GDPR; il DPA Supabase ha già lo Swiss Addendum).
- **USA**: niente legge federale privacy, ma leggi statali (California CCPA ecc.) — rilevanti solo con volumi seri. Contratti in inglese e tasse USA = serve consulenza dedicata, non prima.

**Conclusione parte legale**: la base GDPR/tecnica è solida. I 3 blocchi reali sono burocrazia italiana (partita IVA, contratto, fattura elettronica), tutti risolvibili in 2-4 settimane con un commercialista. Budget realistico per partire in regola: **~1.500-2.500€ il primo anno** (commercialista + avvocato una tantum + fatturazione + eventuale marchio).

---

## PARTE 2 — Strategia di vendita e prezzi

### La strategia attuale è buona?

Quello che esiste oggi: target clienti ben definito (`TARGET_CUSTOMERS_CONTEXT.md` è ottimo, con profili Classic/Pro e frasi reali per il copy), edition system già nel codice (Classic/Pro/Enterprise + override per-tenant `tenant_features`), attivazione su invito. Quello che manca: **i prezzi** (`EDITION_PRICING_CONTEXT.md` è tutto "da definire") e un piano di acquisizione.

Giudizio: l'impianto è giusto — vendita diretta all'inizio è la scelta corretta per questo mercato (il ristoratore compra per fiducia e passaparola, non da una landing page). Il rischio della strategia attuale è che è un impianto senza motore: senza prezzi e senza offerta di lancio non si può nemmeno fare la prima demo seria.

### La concorrenza (dati raccolti 12-06-26)

| Concorrente | Modello | Prezzo indicativo | Punto debole sfruttabile |
|---|---|---|---|
| TheFork Manager | canone + commissioni a coperto | attivazione da ~300€ + ~2,6€/coperto | i ristoratori ODIANO le commissioni; assistenza lenta |
| Plateform (ITA) | freemium, no commissioni | free + piani a pagamento | concorrente diretto italiano, già posizionato "no commissioni" |
| resOS | freemium | free fino a 25 prenotazioni/mese, poi a salire | limite free molto basso |
| Tablein | canone fisso | da ~57$/mese | inglese-first, poco radicato in Italia |
| Fascia budget internazionale | canone fisso | 49-129$/mese | generalisti, no rapporto diretto |
| Fascia premium (SevenRooms, Resy) | canone fisso | 399-899$/mese | fuori mercato per il tuo target |
| Menu QR standalone (ITA) | canone fisso | 10-30€/mese solo menu | fanno SOLO il menu |

Lettura: il tuo target (trattoria 20-80 coperti) si muove nella fascia **0-60€/mese**. Sopra i 70-80€/mese per un piccolo ristorante serve una vendita molto più difficile. Il posizionamento naturale è: **"zero commissioni, prezzo fisso, le prenotazioni e i dati restano tuoi"** — in contrapposizione diretta a TheFork.

### Proposta prezzi (da scrivere in `EDITION_PRICING_CONTEXT.md` se approvi)

| Piano | Mensile | Annuale (2 mesi gratis) | Cosa include |
|---|---|---|---|
| **Classic** | **29€/mese** | 290€/anno | calendario, form pubblico prenotazioni, conferme, impostazioni |
| **+ Menu QR** (add-on Classic) | **+10€/mese** | +100€/anno | menu digitale QR (usa l'override `tenant_features` già nel codice) |
| **Pro** | **69€/mese** | 690€/anno | tutto Classic + sidebar, Home KPI, CRM, Servizio/tavoli, walk-in, no-show, Analytics, Menu QR incluso |
| **Enterprise / multi-sede** | da 99€/sede, preventivo | — | per gruppi/catene, quando esisterà davvero |

Razionali:
- **29€** sta sotto la fascia budget internazionale e sotto il costo psicologico "un coperto a settimana ripaga l'abbonamento" — frase da usare in vendita.
- **69€ Pro** = ~2,4x Classic: abbastanza distante da rendere Classic l'entrata facile, abbastanza vicino da far dire "per 40€ in più ho tutto". Il QR incluso in Pro spinge l'upgrade di chi ha già l'add-on (29+10=39€ → a 69€ ha anche CRM e sala).
- **Add-on QR a 10€** è allineato ai servizi QR-only italiani (9,90-29,90€): il cliente lo confronta e lo trova onesto.
- **Niente commissioni a coperto, mai**: è l'arma di posizionamento principale, non cederla nemmeno in futuro.

Sulle domande specifiche:
- *Divideresti le feature in modo diverso?* No, non spacchettare: 9 toggle venduti singolarmente confondono il ristoratore e moltiplicano i casi di supporto. Due piani + un add-on è il massimo della complessità giusta per questo target. L'unico spacchettamento che ha senso è il QR su Classic, ed è già supportato dal codice.
- *Che pacchetti creerei?* Quelli sopra, più una **offerta fondatori** (sotto) come pacchetto temporaneo di lancio.

### Offerta di lancio (fase vendita diretta)

- **Primi 10 ristoranti "fondatori"**: -50% per 12 mesi (Classic 14,50€, Pro 34,50€) in cambio di: feedback mensile, una recensione/testimonianza, disponibilità come referenza per altri ristoratori.
- **Prova gratuita 30 giorni** senza carta (l'attivazione è già manuale su invito: zero sviluppo necessario).
- **Setup incluso e fatto da te** (caricamento menu, orari, fasce): è ciò che TheFork fa pagare ~300€. Costa il tuo tempo, vale moltissimo per chi "vuole solo che funzioni".
- **Referral**: un mese gratis a chi porta un altro ristorante che si abbona.

### Come venderla (sintesi — dettaglio operativo nel file campagna)

Fase 1 (mesi 1-3, diretta): 10 fondatori presi di persona nella tua zona. Fase 2 (mesi 4-6): testimonianze + referral + presenza Google/Instagram locale. Fase 3 (quando l'app regge): self-service con pagamento carta (richiede Stripe + signup autonomo — oggi NON esiste, va sviluppato).

⚠️ Nota tecnica che lega vendita e codice: il flusso email (`send-email`) **non esiste ancora** — le conferme automatiche ai clienti del ristorante sono uno dei 4 bisogni primari del target dichiarati in `TARGET_CUSTOMERS_CONTEXT.md`. Va chiuso PRIMA di vendere, o venduto onestamente come "in arrivo".

---

## Fonti prezzi concorrenza e normativa

- [TheFork Manager — pricing](https://www.theforkmanager.com/en/restaurant-software-price) e [testimonianza ristoratore su commissioni](https://www.threads.com/@vitochefalba/post/DFITponNcg3?hl=it)
- [Confronto 13 sistemi prenotazione 2026 (Eat App)](https://restaurant.eatapp.co/blog/online-restaurant-reservation-systems)
- [Plateform — piattaforma italiana](https://plateform.app/)
- [Prezzi menu QR Italia: MenuDigitale.io](https://blog.menudigitale.io/prezzo-menu-digitale.php), [JMENU](https://www.menu-digitale.it/piani-e-prezzi/)
- [Regime forfettario 2026 — guida](https://www.fiscoetasse.com/approfondimenti/15066-regime-forfettario-2026-tutte-le-regole.html) e [requisiti/limiti](https://www.taxami.it/guide/regime-forfettario-2026)
- [European Accessibility Act — guida compliance](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/) e [obblighi e-commerce](https://accessible.org/eaa-ecommerce-services-requirements/)

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Un prompt sostanziale iniziale: «ti chiedo di comportarti come professionista sviluppatore senior di SaaS gestionale per ristorazione, e ingegnere di sistemi AI. ho bisgno che produci 3 analisi distinte: 1. valutazione di solidà e pulizia dell'app […] 2. analisi di skill system […] quanto è allineato al codice realmente? è ben fatto o pesante? […] 3. analisi legale e di vendita: cosa DEVO fare per essere legalmente coperto e vendere app regolarmente in UE? […] a che prezzo aggiungeresti le features pro ecc? […] fammi un file con mini campagna di vendita […] le analisi serviranno a Riscrivere o Aggiornare documentazione gia esistente in docs/ […] fammi domande se hai dubbi prima di iniziare.» Più 4 risposte alle mie domande di chiarimento: nessuna attività aperta · solo Italia per ora · vendita mista · output in Sessioni di lavoro.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Il diff di questa parte di sessione sono 2 file NUOVI (questo report + Mini-campagna), nessun codice toccato — confermato con `git status`. Ho ri-verificato aprendo i file: `src/config/features.ts` (PRO_BUNDLE = 9 feature, Classic = set vuoto, qrMenu attivabile via override `tenant_features` — riga 20-21); `src/lib/email.ts` riga 37 chiama `/functions/v1/send-email` e in `supabase/functions/` esistono SOLO check-slot-availability, create-booking, validate-invite → la funzione manca davvero; `LEGAL_STATE_CONTEXT.md` (DPA Ref `Q4RYF-5FVPD-4LXZY-8JABB`, rate limit 3 req/min con ban 24h, fasi 0-1 complete); `EDITION_PRICING_CONTEXT.md` (tutti i prezzi «da definire» — vero); `TARGET_CUSTOMERS_CONTEXT.md` (le conferme email sono il bisogno n.3 del target). I prezzi concorrenza vengono dalle fonti web linkate sopra, raccolte oggi.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Collegati: `Marketing-Skill/EDITION_PRICING_CONTEXT.md` (i prezzi proposti qui lo riempirebbero) e `Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` (nuove voci: partita IVA, contratto B2B, fattura elettronica, EAA). NON li ho aggiornati di proposito: i prezzi sono una decisione di prodotto che spetta a Matteo, e la regola «non modificare le skill da solo» vale anche qui — il report è il dato, la promozione nei context avviene dopo l'approvazione. Nessun codice/test/tipo toccato, quindi nessun altro allineamento dovuto.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Le analisi 1 (solidità codice) e 2 (skill system) sono ancora in corso su due sub-agent in background: i loro report e la proposta di pulizia di docs/ arrivano dopo, nella stessa sessione. Non ho verificato la region Supabase prod (resta «da verificare» in LEGAL_STATE — serve la dashboard). Non ho sincronizzato `docs/FOLLOW_UP.md`: lo farò alla chiusura complessiva della sessione, quando saprò anche gli esiti delle altre due analisi.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito reale: ho scoperto l'obbligo della sezione «Domande di chiusura» solo dall'hook DOPO aver scritto il report — né CLAUDE.md né il flusso di avvio dicono che ogni `Report-*.md` nasce con il template di CHIUSURA_SESSIONE §11; proposta: una riga in CLAUDE.md (o nel nome-template della cartella Sessioni) tipo «ogni Report-*.md include da subito §11 ❓Q/✅R» così l'agente lo compila in scrittura e l'hook non deve rilanciare.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto: per questa analisi i tre context (LEGAL_STATE, EDITION_PRICING, TARGET_CUSTOMERS) erano esattamente della misura utile — letti interi in pochi secondi, zero zavorra, e TARGET_CUSTOMERS ha alzato la qualità della campagna (frasi reali per il copy). L'hook di chiusura è stato utile e preciso (mi ha detto esattamente cosa mancava e dove), non rumore.
