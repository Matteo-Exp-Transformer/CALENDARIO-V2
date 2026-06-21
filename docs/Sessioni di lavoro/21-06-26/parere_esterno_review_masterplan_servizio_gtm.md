# Parere esterno — Review critica Masterplan Servizio + campagna vendita

**Ruolo assunto:** Senior Product Manager + Senior Developer con esperienza in SaaS verticali per ristorazione e go-to-market bootstrap.

**Oggetto:** revisione critica del masterplan tecnico-prodotto relativo a pagina Servizio, motore disponibilità, durata prenotazioni, intervalli di arrivo, motore tavoli/turni automatici, console Live, conto leggero e futuro ordine da QR.

**Vincoli commerciali usati come base dell’analisi:**

- **Classic:** 29€/mese.
- **Add-on QR:** +10€/mese.
- **Pro:** 69€/mese.
- **Offerta fondatori:** -50% per 12 mesi.
- **Classic fondatore:** 14,50€/mese.
- **Classic + QR fondatore:** 19,50€/mese.
- **Pro fondatore:** 34,50€/mese.
- **Target iniziale:** ristoranti indipendenti da 20-80 coperti, oggi gestiti con telefono, WhatsApp, Instagram, carta o Google Calendar.
- **Posizionamento:** “Le prenotazioni del tuo ristorante, senza commissioni: prezzo fisso, dati tuoi, e te lo configuro io.”
- **Nemico naturale:** TheFork, soprattutto per le commissioni a coperto e il controllo dei dati cliente.
- **Modello vendita oggi:** Matteo configura manualmente ogni tenant in fase di vendita.
- **Modello futuro:** self-service con signup autonomo e pagamento Stripe.

---

## Sintesi dura

Il piano è valido come **architettura futura**, ma oggi rischia di portare il prodotto troppo vicino a un gestionale operativo di sala prima ancora di aver validato la vendita dei primi 10-15 ristoranti paganti.

Il rischio principale non è tecnico. È commerciale.

A **Classic 29€/mese**, e soprattutto a **14,50€/mese per i fondatori**, ogni ora di configurazione, supporto o spiegazione manuale mangia margine. Se Matteo deve configurare durate, fasce, intervalli, buffer, tavoli, arrivi tardivi, cap operativi, console Live e conto leggero per ogni ristorante, il prodotto smette di essere un micro-SaaS e diventa consulenza software a basso prezzo.

La strategia corretta è questa:

> **Costruire il motore come architettura, ma vendere un prodotto semplice.**

Classic deve sembrare banale da usare. Pro deve essere visibilmente utile solo ai ristoranti che hanno davvero una sala da governare. Tutto il resto deve stare sotto il cofano, dietro preset, default e wizard.

---

# 1. Complessità di configurazione vs scalabilità della vendita

## Rischio

Il posizionamento “te lo configuro io” è una leva commerciale fortissima nella fase porta-a-porta. Per i primi 10 fondatori è perfetta: il ristoratore compra anche perché non deve imparare nulla.

Il problema è che il masterplan aggiunge molta configurazione potenziale:

- durata media della prenotazione;
- durata per tipologia;
- durata per card/menu;
- minimo durata fascia;
- intervalli di arrivo;
- cut-off prenotazione;
- arrivi tardivi con avviso;
- tempo minimo per ordinare;
- buffer turnover;
- capienza fascia;
- cap operativo anche con tavoli;
- sale;
- tavoli;
- assegnazioni;
- stati tavolo;
- Live;
- conto leggero;
- futuro ordine da QR.

Questa non è più una configurazione commerciale rapida. È una modellazione operativa del ristorante.

Con i prezzi attuali, il problema è matematico:

| Piano | Prezzo pieno | Prezzo fondatori | Rischio setup |
|---|---:|---:|---|
| Classic | 29€/mese | 14,50€/mese | Setup oltre 1-2 ore diventa antieconomico |
| Classic + QR | 39€/mese | 19,50€/mese | Regge poco supporto extra |
| Pro | 69€/mese | 34,50€/mese | Può reggere setup guidato, ma non consulenza infinita |

Se Matteo dedica anche solo 2 ore a un cliente Classic fondatore, ha già bruciato il valore dei primi mesi. Se ogni nuovo ristorante richiede configurazione personalizzata, la scalabilità muore prima della Fase 3.

## Perché conta a 6-18 mesi

Con 10-15 clienti Matteo può ancora reggere tutto a mano. Con 25-30 clienti inizia a soffocare. Con 50 clienti il prodotto diventa ingestibile per un founder solo.

Il rischio più serio è bloccare il futuro self-service Stripe. Se l’onboarding richiede conoscenza di concetti come “durata minima fascia”, “turnover buffer”, “cap operativo” o “arrivo tardivo con avviso”, un ristoratore medio non completerà mai da solo la configurazione.

Il self-service non è impossibile, ma solo se il sistema viene disegnato ora come onboarding guidato, non come pannello pieno di opzioni.

## Mossa concreta ora

Trasformare la configurazione in **preset commerciali**, non in un insieme libero di impostazioni.

### Preset 1 — Trattoria semplice

Per Classic.

Configurazione consigliata:

- pranzo/cena;
- capienza per fascia;
- durata media default 120 minuti;
- arrivi ogni 30 minuti;
- niente tavoli;
- niente Live;
- niente buffer visibile;
- niente regole avanzate.

### Preset 2 — Ristorante con turni leggeri

Per Classic avanzato o come teaser Pro.

Configurazione consigliata:

- durata media;
- intervalli di arrivo guidati;
- avvisi capienza;
- qualche controllo in più sugli orari;
- ancora niente mappa tavoli obbligatoria.

### Preset 3 — Sala strutturata

Per Pro.

Configurazione consigliata:

- sale;
- tavoli;
- assegnazioni;
- vista del turno;
- arrivi previsti;
- ritardi;
- tavoli liberi;
- Live operativo.

## Cosa nascondere dietro default ora

Da non esporre subito al ristoratore:

- durata per singola card;
- minimo durata fascia;
- toggle arrivi tardivi;
- cap operativo con override temporale;
- pacing;
- buffer turnover;
- multi-tavolo;
- conto leggero avanzato;
- ordine cliente da QR.

Queste cose possono esistere nel modello dati o nel motore, ma non devono essere vendute come configurazione manuale iniziale.

## Irreversibile vs rimandabile

**Irreversibile, da decidere bene subito:**

- onboarding a step;
- preset;
- default;
- diagnostica configurazione incompleta;
- separazione tra configurazione semplice e avanzata.

**Rimandabile senza costo alto:**

- UI completa per ogni micro-regola;
- configurazione manuale avanzata per ogni fascia;
- pannelli dettagliati per buffer, cap operativi e arrivi tardivi.

---

# 2. Over-engineering vs target reale

## Rischio

Il target iniziale non compra “motore tavoli automatico”. Compra:

> “Non voglio perdere prenotazioni del sabato sera.”

Il ristoratore da 20-80 coperti oggi usa telefono, WhatsApp, Instagram, Google Calendar o carta. Il suo dolore non è ancora l’ottimizzazione matematica della sala. Il suo dolore è il caos delle richieste.

A **29€/mese**, un fondatore di trattoria paga per:

- link pubblico di prenotazione;
- richieste ordinate;
- calendario chiaro;
- conferme email;
- capienza base;
- dati cliente suoi;
- zero commissioni.

Non paga ancora per:

- turni automatici evoluti;
- conto leggero;
- stato live dei tavoli;
- QR ordering;
- KDS;
- integrazione POS.

## Perché conta a 6-18 mesi

Se si sviluppa prima la parte Pro profonda, si rischia di arrivare sul mercato con un prodotto più sofisticato ma meno vendibile.

Il ristoratore piccolo può spaventarsi davanti a una console troppo ricca. Può pensare:

> “È troppo per me. Io volevo solo non perdere le prenotazioni.”

Questo sarebbe un fallimento di packaging, non di prodotto.

## Cosa serve davvero subito

### Vendibile subito per Classic

Priorità alta:

- form pubblico prenotazione;
- dashboard richieste;
- calendario;
- capienza per fascia;
- email conferma prenotazione;
- QR semplice al link prenotazione/menu;
- storico cliente minimo;
- allergie/intolleranze/note;
- tenant demo personalizzato col nome del ristorante;
- esportazione dati.

### Serve dopo per Pro

Priorità media:

- sale;
- tavoli;
- mappa;
- assegnazioni;
- arrivi del turno;
- ritardi;
- tavoli liberi ora;
- vista Live.

### Da considerare sogno Enterprise / non ora

Priorità bassa nella fase iniziale:

- ordine cliente da QR;
- KDS;
- POS/cassa;
- Google Reserve operativo;
- multi-sede;
- conto completo;
- turni manuali complessi;
- automazioni avanzate.

## Mossa concreta ora

Tagliare la roadmap commerciale in questo modo:

1. **Prima vendi Classic semplice.**
2. **Poi usi i clienti Classic per capire chi ha bisogno del Pro.**
3. **Poi costruisci Pro attorno ai problemi reali dei ristoranti più strutturati.**

Non fare il contrario.

## Irreversibile vs rimandabile

**Irreversibile:**

- separare il motore di disponibilità dalla promessa commerciale;
- non far percepire il prodotto come gestionale complicato;
- mantenere Classic semplice.

**Rimandabile:**

- tutte le funzionalità che servono solo a competere con gestionali più maturi, ma che non chiudono vendite nei primi 90 giorni.

---

# 3. Packaging e monetizzazione

## Rischio

Il confine attuale Classic / QR / Pro rischia di essere sbilanciato.

Se Classic include già:

- durata intelligente;
- intervalli di arrivo;
- stima sovrapposizioni;
- capienza evoluta;
- calendario;
- menu;
- dati cliente;
- QR add-on economico;

allora molti ristoranti da 20-80 coperti potrebbero non avere mai un motivo forte per passare a Pro.

Il rischio è regalare in Classic la parte più “smart” del prodotto e lasciare al Pro solo la mappa tavoli.

## Perché conta a 6-18 mesi

Con offerta fondatori:

| Piano | Prezzo fondatori |
|---|---:|
| Classic | 14,50€/mese |
| Classic + QR | 19,50€/mese |
| Pro | 34,50€/mese |

Se un cliente si abitua per 12 mesi ad avere quasi tutto a 14,50€/mese, il salto a 69€/mese dopo lo sconto sembrerà enorme.

Il problema non è solo l’MRR basso. È il fatto che i clienti più piccoli generano comunque supporto, richieste, configurazioni, bug report e aspettative.

## Mossa concreta ora

Non bisogna togliere il motore da Classic a livello tecnico. Bisogna limitarne il valore visibile e la configurabilità.

### Classic deve avere L2-lite

Classic dovrebbe includere:

- durata media unica;
- arrivi ogni 30 minuti;
- capienza per fascia;
- regole semplici;
- nessuna terminologia tecnica;
- poche decisioni da prendere.

### Pro deve avere disponibilità operativa reale

Pro dovrebbe includere:

- durata per tipologia/card;
- tavoli;
- sale;
- disponibilità reale per tavolo;
- prossimi orari disponibili;
- assegnazione prenotazioni;
- vista turno;
- Live.

## L’unica feature che fa scattare davvero l’upgrade a 69€

La feature di upgrade non è il conto leggero.

La feature che può far pagare Pro è:

> **“Vedi la sala del turno: tavoli liberi, arrivi, ritardi e prenotazioni assegnate in un’unica vista.”**

Questa è una promessa chiara per chi ha una sala strutturata. Parla al maître, al responsabile sala, al ristorante con 2 turni, al locale che deve coordinare più persone.

Il conto leggero è un’aggiunta. Non deve essere il motivo principale dell’upgrade.

## Cosa rischiamo di regalare in Classic

Potenziali feature da non rendere troppo potenti in Classic:

- durata per singola card/menu;
- disponibilità raffinata per sovrapposizioni;
- suggerimento prossimo orario libero;
- regole diverse per pranzo/cena/eventi;
- gestione arrivi tardivi;
- diagnostica operativa avanzata.

Queste funzioni possono usare lo stesso motore, ma vanno mostrate o configurate solo nel Pro, oppure semplificate in Classic.

## Irreversibile vs rimandabile

**Irreversibile:**

- decidere il vero confine commerciale tra Classic e Pro;
- non abituare i primi clienti a ricevere troppo a prezzo troppo basso;
- rendere Pro un outcome, non una lista feature.

**Rimandabile:**

- micro-add-on;
- analytics avanzate;
- conto leggero;
- ordine QR;
- dashboard troppo sofisticate.

---

# 4. Promessa vs mantenibilità contro TheFork

## Rischio

Il posizionamento vincente è:

> **Zero commissioni, dati tuoi, prezzo fisso, te lo configuro io.**

Non è:

> “Gestiamo perfettamente la tua sala.”

Se in demo Matteo spinge troppo su motore tavoli, sala Live, turni automatici, conto e QR ordering, sposta la competizione su un terreno pericoloso. Lì sono più forti TheFork Manager, Octotable, Tableo, POS e gestionali verticali.

La battaglia iniziale non va giocata contro i gestionali maturi. Va giocata contro:

- WhatsApp;
- carta;
- telefono;
- Google Calendar;
- commissioni TheFork;
- perdita dati cliente.

## Perché conta a 6-18 mesi

Se un cliente Classic da 29€/mese compra pensando che l’app gli gestisca tutta la sala, poi chiederà supporto da gestionale Pro/POS. A quel prezzo non è sostenibile.

Se invece compra perché non perde più richieste e ha tutto in un calendario, il valore è immediato, chiaro e sostenibile.

## Cosa NON promettere in demo

Non promettere:

- assegnazione tavoli perfetta;
- sala live sempre precisa;
- ottimizzazione automatica dei turni;
- conto completo;
- integrazione POS;
- ordine QR cliente già pronto;
- riduzione no-show garantita;
- gestione fiscale;
- sostituzione di TheFork;
- sostituzione del POS.

## Cosa promettere invece

Promessa demo per Classic:

- “Ti do un link tuo per ricevere prenotazioni.”
- “Le richieste arrivano in un posto solo.”
- “Il cliente resta tuo.”
- “Non paghi commissioni a coperto.”
- “Vedi subito quanti coperti hai.”
- “Te lo configuro io.”

Promessa demo per Pro:

- “Se hai una sala più strutturata, puoi vedere arrivi, tavoli e assegnazioni in modo più ordinato.”

## Dove il motore rafforza l’anti-TheFork

Il motore disponibilità è utile se resta sotto il cofano.

Rafforza i 3 colpi anti-TheFork così:

### 1. Zero commissioni

Il link diretto non è un form stupido. È un canale proprietario che rispetta almeno capienza, fasce e orari.

### 2. Dati tuoi

Ogni prenotazione genera storico cliente, note, preferenze, allergie/intolleranze e contatto diretto.

### 3. Te lo configuro io

Il ristoratore non vede la complessità. Vede un sistema già pronto col nome del suo locale.

## Irreversibile vs rimandabile

**Irreversibile:**

- non riposizionarsi come POS o gestionale sala completo;
- mantenere il confronto con TheFork sul terreno giusto: commissioni, dati, canale diretto.

**Rimandabile:**

- comunicare pubblicamente “ottimizzazione turni”;
- vendere la Live come promessa centrale;
- parlare di conto, POS, QR ordering prima che siano solidi.

---

# 5. Lock-in architetturale che limita il business futuro

## Rischio

Alcune scelte apparentemente piccole possono bloccare il futuro:

- self-service Stripe;
- multi-sede;
- caparra online;
- lista d’attesa;
- Google Reserve;
- integrazioni POS;
- ordine QR;
- CRM avanzato.

Il prodotto è già multi-tenant e usa edition/feature flag. Questa è una base buona. Ma ogni nuova parte deve continuare a rispettare questa impostazione.

## Perché conta a 6-18 mesi

Quando il prodotto arriva a 30-50 clienti, non puoi più rifondare le strutture principali. A 29€/mese non hai margine per migrazioni distruttive.

Il principio corretto è:

> **Predisporre le porte, non costruire tutte le stanze.**

## Cosa predisporre ora

### Multi-sede / catene

Non costruire UI multi-sede ora.

Ma non assumere per sempre che:

- un account = un solo locale;
- un owner = un solo tenant;
- una configurazione = una sola sede.

Predisposizione consigliata:

- mantenere `tenant_id` ovunque;
- evitare logiche hardcoded su singolo ristorante;
- prevedere in futuro un livello `organization/account` sopra più tenant/location.

### Caparra / pagamento online

Stripe è già nei piani futuri. Non va incollato direttamente dentro `booking_requests` con campi sparsi.

Predisposizione consigliata:

- entità separata tipo `booking_payments` o `payment_intents`;
- stato pagamento;
- importo;
- provider;
- currency;
- `booking_id`;
- `tenant_id`;
- external reference.

### Lista d’attesa

Non buttare via la richiesta quando non c’è posto.

Predisposizione consigliata:

- stato `waitlisted` o simile;
- slot richiesto;
- alternative proposte;
- canale di origine;
- timestamp;
- eventuale priorità.

Non serve UI avanzata ora. Serve non chiudere la porta.

### Google Reserve / integrazioni

La disponibilità deve stare in un resolver server-side/API, non dentro componenti UI.

Predisposizione consigliata:

- `source/channel` su ogni prenotazione;
- `external_reservation_id`;
- idempotenza su richieste esterne;
- log integrazioni;
- API interna pulita per leggere disponibilità.

### Self-service Stripe

Serve una state machine di onboarding.

Stati possibili:

- tenant creato;
- dati base completati;
- fasce configurate;
- form pubblicato;
- pagamento attivo;
- demo completata;
- checklist completata.

Senza questa logica, Fase 3 diventa solo “Matteo continua a fare setup manuale, ma ora c’è Stripe”.

## Irreversibile vs rimandabile

**Irreversibile:**

- modello tenant estendibile;
- source/channel prenotazione;
- entità pagamenti separata;
- resolver disponibilità condiviso;
- onboarding state machine;
- RLS e `tenant_id` su tutte le nuove tabelle.

**Rimandabile:**

- UI multi-sede;
- Google Reserve reale;
- pagamento/caparra reale;
- waitlist automatica;
- integrazione POS.

---

# 6. Sequenza di rilascio come time-to-revenue

## Rischio

La sequenza S0→S6 è corretta dal punto di vista tecnico, ma può essere troppo lenta per il go-to-market.

Il problema non è che S0/S1/S2/S3 siano inutili. Sono utili. Il problema è che producono molta architettura invisibile prima di dare a Matteo qualcosa che possa mostrare in visita e vendere.

La campagna porta-a-porta vive su demo immediata:

1. apro il form pubblico;
2. invio una prenotazione;
3. appare in dashboard;
4. prezzo fisso;
5. setup incluso;
6. follow-up WhatsApp.

Un ristoratore non compra perché il resolver durata è elegante. Compra perché vede il suo locale già pronto.

## Perché conta a 6-18 mesi

I primi 90 giorni servono a validare:

- chi compra;
- cosa capisce;
- cosa usa davvero;
- cosa paga;
- quali obiezioni emergono;
- quali feature fanno upgrade.

Se si passa troppo tempo su fondamenta invisibili, si ritarda l’apprendimento commerciale.

## Sequenza consigliata

### R0 — Bloccanti pre-vendita

Da fare prima delle visite:

- email conferma prenotazione funzionante;
- tenant demo duplicabile;
- prezzi/edition stabili;
- script demo;
- link demo col nome del ristorante;
- flusso trial attivabile rapidamente.

### R1 — Classic vendibile

Obiettivo: chiudere i primi clienti.

Feature:

- form pubblico;
- dashboard prenotazioni;
- calendario;
- capienza per fascia;
- clienti/dati base;
- note allergie/intolleranze;
- link pubblico;
- gestione richieste pending/accettate/rifiutate;
- follow-up semplice.

### R2 — QR add-on da +10€

Obiettivo: monetizzare piccolo upsell senza complicare il prodotto.

Feature:

- QR stampabile per link prenotazione;
- QR per menu consultazione;
- materiale stampabile;
- nessun ordine cliente da QR.

### R3 — L2-lite invisibile

Obiettivo: rendere Classic più ordinato senza spaventare.

Feature:

- durata media default;
- intervalli arrivo semplici;
- disponibilità più ordinata;
- preset;
- pochissima configurazione manuale.

### R4 — Pro demo

Obiettivo: iniziare a vendere Pro a sale strutturate/fine dining.

Feature:

- sale/tavoli;
- assegnazione visiva;
- vista turno corrente;
- arrivi;
- ritardi;
- tavoli liberi ora.

### R5 — Pro paid pilot

Obiettivo: validare Pro con pochi clienti reali.

Feature:

- 2-3 ristoranti pilota strutturati;
- uso reale durante servizio;
- solo dopo aggiungere conto leggero staff;
- niente ordine cliente QR.

### R6 — Self-service

Obiettivo: scalare oltre Matteo.

Da fare solo dopo:

- 15-30 clienti paganti;
- pitch validato;
- onboarding ripetibile;
- domande frequenti note;
- setup ridotto a wizard.

Feature:

- signup autonomo;
- Stripe;
- template;
- checklist onboarding;
- diagnostica configurazione incompleta.

## Irreversibile vs rimandabile

**Irreversibile:**

- demo vendibile prima della profondità tecnica;
- email conferma funzionante;
- tenant demo personalizzabile;
- onboarding replicabile.

**Rimandabile:**

- S4-LIVE completa;
- S6 ordine QR cliente;
- S5 turni manuali;
- conto leggero evoluto.

---

# 7. KDS/POS rimandati: modello dati e punti di aggancio

## Valutazione

La direzione del masterplan è buona:

- conto per sessione/turno, non per tavolo;
- il conto segue il gruppo, non il tavolo fisico;
- righe additive;
- storno con motivo, non cancellazione fisica;
- confine POS minimo;
- KDS fuori dal masterplan ma predisposto.

Questa è l’impostazione corretta. Il tavolo è il luogo. La sessione è il gruppo seduto. Il conto appartiene alla sessione.

## Rischio

Se il conto leggero viene modellato troppo poveramente, domani KDS e POS non si innestano bene.

Esempio di rischio:

- salvare solo `nome prodotto`, `prezzo`, `pagato sì/no`;
- cancellare righe invece di stornarle;
- non salvare autore;
- non salvare origine;
- non salvare stato riga;
- non salvare external reference.

In questo caso, quando arriveranno KDS, POS o ordine QR, bisognerà rifare il modello.

## Punti di aggancio da predisporre

### Entità sessione

Possibile tabella:

`service_sessions` o `table_sessions`

Campi minimi:

- `id`;
- `tenant_id`;
- `booking_id` opzionale;
- `table_id` o assegnazioni tavoli;
- `started_at`;
- `ended_at`;
- `status`;
- `turn_number`;
- `covers`;
- `created_by`.

### Righe ordine/conto

Possibile tabella:

`service_order_lines`

Campi minimi:

- `id`;
- `tenant_id`;
- `session_id`;
- `item_snapshot`;
- `quantity`;
- `unit_price`;
- `total_price`;
- `status`;
- `source`;
- `created_by`;
- `created_at`;
- `voided_by`;
- `void_reason`;
- `voided_at`;
- `course` opzionale;
- `notes`.

### External references

Per integrazioni future:

- `provider`;
- `external_id`;
- `entity_type`;
- `entity_id`;
- `raw_payload` opzionale;
- `synced_at`.

### Pagamenti separati

Non mischiare pagamenti con righe conto.

Possibile tabella:

`booking_payments` o `service_payments`

Campi:

- `tenant_id`;
- `booking_id` opzionale;
- `session_id` opzionale;
- `provider`;
- `amount`;
- `currency`;
- `status`;
- `payment_method`;
- `external_payment_id`;
- `paid_at`.

## Cosa non costruire ora

Non costruire:

- stampa scontrino;
- split bill;
- metodi pagamento complessi;
- fiscalità;
- KDS UI;
- invio a POS;
- integrazione diretta con registratori telematici;
- garanzia “funziona con tutte le casse”.

## Irreversibile vs rimandabile

**Irreversibile:**

- sessione separata dal tavolo;
- righe append-only;
- storno tracciato;
- source/origin sulle righe;
- external reference per integrazioni future;
- `tenant_id` e RLS su tutto.

**Rimandabile:**

- vista cucina;
- integrazione cassa;
- pagamento al tavolo;
- scontrino;
- sincronizzazione POS.

---

# 8. Decisione consigliata sul confine Classic / Pro

## Classic — promessa corretta

Classic deve essere venduto come:

> “Il modo semplice per ricevere, ordinare e gestire le prenotazioni dirette del tuo ristorante senza commissioni.”

Include:

- form pubblico;
- calendario;
- gestione richieste;
- capienza base;
- durata media semplice;
- dati cliente;
- email conferma;
- QR prenotazione/menu come add-on;
- setup guidato.

Non deve sembrare un gestionale sala.

## Pro — promessa corretta

Pro deve essere venduto come:

> “La vista operativa per chi deve governare la sala durante il turno.”

Include:

- sale;
- tavoli;
- assegnazioni;
- vista turno;
- arrivi;
- ritardi;
- tavoli liberi;
- regole disponibilità più avanzate;
- eventualmente conto leggero staff.

Il Pro non deve essere “Classic + tante opzioni”. Deve essere “controllo operativo della sala”.

## QR add-on — promessa corretta

QR +10€ deve essere semplice:

> “Metti il QR sul tavolo, su Instagram o fuori dal locale e fai arrivare le prenotazioni/menu dal tuo link.”

Non deve diventare subito:

- ordine da QR;
- conto cliente;
- pagamento;
- KDS.

Quello è futuro Pro.

---

# 9. Checklist decisionale per ogni nuova feature

Prima di sviluppare una feature del masterplan, fare queste domande:

1. **Aiuta Matteo a chiudere una vendita nei prossimi 90 giorni?**
2. **Un ristoratore da 20-80 coperti la capisce in meno di 30 secondi?**
3. **È sostenibile a 29€/mese?**
4. **Richiede setup manuale? Quanto?**
5. **È necessaria a Classic o serve solo a Pro?**
6. **Se la mettiamo in Classic, cosa rimane come leva di upgrade a Pro?**
7. **Blocca self-service Stripe?**
8. **Può stare dietro un preset/default?**
9. **Crea lock-in tecnico su tenant, pagamenti, fonti o integrazioni?**
10. **La possiamo predisporre senza costruirla tutta?**

Se una feature non supera almeno le prime 4 domande, non va sviluppata ora.

---

# 10. I 5 errori più gravi da non lasciare passare ora

## 1. Regalare troppo in Classic e poi non avere motivo forte per Pro

Se Classic include tutta la disponibilità intelligente configurabile, Pro rischia di diventare solo “mappa tavoli carina”.

A 69€/mese, Pro deve vendere un outcome netto:

> **Gestione visiva del turno e della sala.**

Non basta aggiungere qualche impostazione avanzata.

---

## 2. Far diventare Matteo il motore di configurazione umano

Setup incluso sì. Configurazione sartoriale infinita no.

Ogni impostazione che Matteo deve spiegare a voce è un pezzo di self-service che muore. Ogni ora di setup su Classic fondatore brucia margine.

Il prodotto deve imparare a configurarsi con:

- preset;
- wizard;
- default;
- diagnostica;
- template.

---

## 3. Promettere gestione sala/POS quando il posizionamento vincente è anti-commissioni

La guerra iniziale non è:

> “Siamo meglio dei gestionali sala.”

La guerra iniziale è:

> “Prezzo fisso, dati tuoi, niente commissioni, prenotazioni ordinate.”

Se il prodotto cambia campo di battaglia troppo presto, compete con strumenti più maturi e più difficili da battere.

---

## 4. Costruire S4/S6 prima di avere 10-15 clienti che usano davvero Classic

Ordine QR, conto Live, tavoli, KDS e POS sono seducenti, ma non validano il business iniziale.

Prima bisogna sapere se i ristoratori pagano davvero per:

- link prenotazione diretto;
- calendario;
- richieste ordinate;
- zero commissioni;
- setup incluso.

Solo dopo ha senso spingere Pro.

---

## 5. Non predisporre pagamenti, source, sessioni e integrazioni nel modello dati

Non bisogna costruire Stripe, Google Reserve, waitlist e POS ora.

Ma se oggi prenotazioni, conti e disponibilità vengono modellati in modo chiuso, tra 12 mesi servirà rifondare.

Da predisporre subito:

- `source/channel` prenotazione;
- external IDs;
- pagamenti separati;
- sessione separata dal tavolo;
- righe append-only;
- resolver disponibilità server-side;
- onboarding state machine.

---

# Conclusione operativa

Il masterplan va tenuto, ma va letto come **architettura progressiva**, non come roadmap commerciale immediata.

La priorità dei prossimi 90 giorni non è costruire il gestionale sala perfetto. È vendere e validare il prodotto minimo che un ristoratore capisce e paga:

> **prenotazioni ordinate, zero commissioni, dati suoi, setup fatto da Matteo.**

La parte avanzata deve essere progettata bene, ma rilasciata solo quando crea upgrade reale.

La formula corretta è:

1. **Classic semplice e vendibile.**
2. **QR come upsell leggero.**
3. **Pro come vista operativa della sala.**
4. **Self-service solo dopo onboarding ripetibile.**
5. **KDS/POS/Google Reserve predisposti, non costruiti ora.**

Se questa disciplina regge, il prodotto può diventare un SaaS verticale serio. Se invece tutto viene esposto subito come configurazione, il rischio è creare un prodotto tecnicamente ambizioso ma commercialmente pesante, difficile da vendere, difficile da configurare e impossibile da scalare da solo.
