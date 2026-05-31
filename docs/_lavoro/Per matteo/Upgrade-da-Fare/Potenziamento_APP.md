Piano Feature — Gestionale Prenotazioni Ristorante · Maggio 2026

# PIANO IMPLEMENTAZIONE FEATURE

**Roadmap per eguagliare (e superare) la concorrenza**

Sistema Gestionale Prenotazioni Ristorante · Maggio 2026

## Come leggere questo documento

Il piano è diviso in 4 fasi progressive. Ogni fase si basa sulla precedente: non iniziare la Fase 2 senza aver completato la Fase 1. Le feature sono ordinate per rapporto impatto/sforzo all'interno di ogni fase.

**Legenda difficoltà:**

| Stelle | Significato |
|---|---|
| ★☆☆☆☆ | Molto facile — qualche ora di lavoro, nessuna dipendenza esterna |
| ★★☆☆☆ | Facile — 1-3 giorni, configurazione API semplice |
| ★★★☆☆ | Media — 1-2 settimane, integrazione con terze parti |
| ★★★★☆ | Difficile — 3-6 settimane, architettura o partnership richiesta |
| ★★★★★ | Molto difficile — mesi di lavoro, accordi commerciali complessi |

## FASE 1 — FONDAMENTA

**0 – 2 mesi · Quick wins ad alto impatto · Nessun costo fisso**

Feature di base che mancano rispetto ai competitor e che si implementano rapidamente. Non richiedono partnership esterne onerose. Completare questa fase porta il sistema a parità con Avatable e Tableo.

| Feature | Difficoltà | Servizi / Account richiesti | Costo/mese | Note strategiche |
|---|---:|---|---:|---|
| **CRM clienti base**<br>(scheda cliente, storico prenotazioni, intolleranze salvate) | ★★☆☆☆ | Nessuno — dati già nel tuo DB | **€0** | *Prerequisito per loyalty points, newsletter e analytics. Aggiungi scheda cliente con storico + note.* |
| **Email transazionali automatiche**<br>(conferma, reminder 24h, thank-you post-visita) | ★☆☆☆☆ | Brevo (free fino a 300 email/giorno)<br>o SendGrid (free 100/giorno) | **€0** | *Riduce i no-show del 20-30%. Tutti i competitor ce l'hanno. È l'integrazione più semplice e ad altissimo ROI.* |
| **Chiusura servizio / incasso manuale**<br>(importo, metodo, servizio, nota cliente) | ★★☆☆☆ | Nessuno — logica interna<br>(prenotazione, tavolo, CRM) | €0 | V0 manuale prima del POS. Registra importo, metodo e note per alimentare CRM e analytics. |
| **Analytics / Dashboard reportistica**<br>(prenotazioni per giorno, no-show rate, coperti medi) | ★★☆☆☆ | Nessuno — elaborazione interna | **€0** | *Feature molto richiesta dai ristoratori per ottimizzare i turni. Bastano 6-8 metriche chiave.* |
| **QR code automatico per menù/prenotazione**<br>(generato dal sistema, stampabile) | ★☆☆☆☆ | Libreria open source (qrcode npm) | **€0** | *Piccolo differenziatore visivo. Il ristoratore stampa il QR e lo mette sui tavoli. Octotable lo usa come feature di punta.* |
| **Pulsante "Prenota" su Facebook e Instagram**<br>(Meta booking integration) | ★★☆☆☆ | Account Meta Developer (gratuito)<br>Pagina Facebook del ristorante | **€0** | *Canale di prenotazione gratuito. Richiede solo registrazione come app Meta e configurazione webhook.* |

✅ **Al termine della Fase 1:** il sistema è a parità con Avatable (€89/mese) e Tableo. Costo aggiuntivo mensile: €0.

## FASE 2 — DIFFERENZIAZIONE

**2 – 5 mesi · Features premium · Costi contenuti e variabili**

Feature che distinguono il sistema dai competitor di fascia media e giustificano il piano Growth/Pro. Richiedono integrazione con servizi terzi ma i costi sono variabili (si pagano in proporzione all'utilizzo).

| Feature | Difficoltà | Servizi / Account richiesti | Costo/mese | Note strategiche |
|---|---:|---|---:|---|
| **WhatsApp Business API**<br>(conferma, reminder, thank-you via WA) | ★★★☆☆ | 360dialog (€4.99/mese)<br>oppure<br>Brevo (include WA nel piano)<br>o Twilio (~€0.05/msg) | €5–30 | *Fortissimo in Italia. Plateform ce l'ha ed è uno dei suoi punti di vendita principali. I ristoratori italiani comunicano con i clienti quasi esclusivamente via WA.* |
| **Loyalty Points**<br>(punti per prenotazione, configurabili dall'admin, premi riscattabili) | ★★★☆☆ | Nessuno — logica interna<br>(DB: customers, points_tx, rewards) | **€0** | *Aumenta la fidelizzazione e la frequenza di ritorno. Da inserire nel piano Growth. Plateform ce l'ha ed è un differenziatore rispetto ad Avatable e Tableo.* |
| **Anti no-show con pre-autorizzazione carta**<br>(Stripe: pre-auth al momento della prenotazione) | ★★★☆☆ | Account Stripe (gratuito)<br>Stripe Radar (incluso) | 1.5%+0.25€<br>per transaz. | *I ristoranti con alta domanda (sabato sera, eventi) lo richiedono sempre. TheFork e Octotable ce l'hanno. Il costo è a carico del ristoratore (può trasferirlo al cliente).* |
| **SMS notifiche**<br>(alternativa/complemento a WhatsApp) | ★★☆☆☆ | Twilio, Vonage o Brevo SMS<br>(~€0.05–0.10/SMS Italia) | €5–20 | *Utile per i clienti che non usano WhatsApp. Funziona come fallback automatico se WA non consegnato.* |
| **Email marketing integrato**<br>(newsletter ai clienti registrati, template editor base) | ★★★☆☆ | Brevo (free 9.000 email/mese)<br>GDPR: gestione disiscrizione obbligatoria | €0–25 | *Permette al ristoratore di inviare promozioni, nuovi menù, eventi speciali. Avatable ce l'ha. Da inserire nel piano Growth.* |

✅ **Al termine della Fase 2:** il sistema supera Avatable, Plateform e Tableo. Compete testa a testa con Octotable. Costo fisso aggiuntivo: €5–55/mese.

## FASE 3 — CRESCITA

**5 – 10 mesi · Canali di acquisizione · Partnership e approval esterne**

Feature che ampliano i canali di acquisizione prenotazioni e avvicinano il sistema alla parità con TheFork Manager. Richiedono partnership o processi di approvazione esterni con tempi non controllabili.

| Feature | Difficoltà | Servizi / Account richiesti | Costo/mese | Note strategiche |
|---|---:|---|---:|---|
| **Google Reserve («Prenota con Google»)**<br>(prenotazioni dirette da Google Maps e Search) | ★★★★☆ | Nessun costo diretto — richiede approvazione<br>come Google Booking Partner (processo lungo) | **€0** | *Enorme canale di acquisizione: il cliente prenota senza uscire da Google. Richiede applicazione al programma Google Booking API. Tempi di approval: 2-6 mesi. Iniziare subito la procedura.* |
| **CRM avanzato**<br>(segmentazione clienti, tag, storico spesa, note staff) | ★★★☆☆ | Nessuno — logica interna estesa | **€0** | *Passaggio naturale dal CRM base della Fase 1. Permette di segmentare i clienti (VIP, allergie gravi, occasioni speciali) e personalizzare il servizio.* |
| **Gestione turni/shift avanzata**<br>(slot orari, capacità per turno, lista d'attesa automatica) | ★★★☆☆ | Nessuno — logica interna | **€0** | *TheFork Manager e Octotable gestiscono i turni in modo avanzato. Fondamentale per ristoranti con alta rotazione (2-3 turni sera). Lista d'attesa automatica è un differenziatore forte.* |
| **Notifiche push mobile**<br>(app PWA o notifiche browser per il ristoratore) | ★★★☆☆ | Firebase Cloud Messaging (gratuito)<br>o OneSignal (free fino a 10k subscriber) | **€0** | *Il ristoratore riceve notifica push sul telefono quando arriva una nuova prenotazione — senza dover tenere aperta l'app. Semplice con PWA + service worker.* |
| **Integrazione Google Reviews**<br>(richiesta automatica recensione post-visita) | ★★☆☆☆ | Google Business Profile API (gratuita)<br>Account Google Business del ristorante | **€0** | *Email/WA automatico 2h dopo la visita con link diretto alla recensione Google. Semplice da implementare, alto valore percepito dal ristoratore.* |

✅ **Al termine della Fase 3:** il sistema compete con TheFork Manager su tutte le feature gestionali, mancando solo dell'ecosistema di utenti (non replicabile).

## FASE 4 — ENTERPRISE & AVANZATO

**10+ mesi · Feature complesse · Piano Multi-sede e nicchie specifiche**

Feature per i clienti enterprise o segmenti di nicchia. Alto sforzo di sviluppo, bassa percentuale di utenti che le richiedono. Da sviluppare solo dopo aver stabilizzato i piani precedenti.

| Feature | Difficoltà | Servizi / Account richiesti | Costo/mese | Note strategiche |
|---|---:|---|---:|---|
| **Multi-sede management**<br>(più ristoranti della stessa catena, dashboard unificata) | ★★★★☆ | Nessuno — refactoring architetturale<br>(multi-tenancy con organization layer) | **€0** | *Necessita di una riprogettazione del modello dati se non già prevista. Fondamentale per catene e franchising. Giustifica il piano Enterprise da €149+/mese.* |
| **AI Voice Assistant per prenotazioni telefoniche**<br>(risponde al telefono, crea prenotazione automaticamente) | ★★★★★ | Twilio Voice + API LLM (Claude/GPT-4o)<br>o soluzione verticale (es. Slang.ai) | €80–250 | *Octotable ce l'ha ed è la sua feature più pubblicizzata. Richiede integrazione VoIP + LLM + fallback umano. Considerare partnership con provider verticale invece di sviluppo interno.* |
| **Integrazione POS**<br>(connessione con cassa fiscale: Tilby, Cassa In Cloud, Square) | ★★★★★ | Accordi commerciali con ciascun POS provider<br>API proprietarie (documentazione variabile) | €0–50<br>per accordo | Molto richiesto dai ristoranti strutturati. Ogni POS ha API diverse. Iniziare con Cassa In Cloud / Tilby, ma solo dopo aver validato la V0 manuale di chiusura servizio e storico incassi. |
| **Marketplace/aggregatore proprio**<br>(pagina pubblica dove i clienti cercano ristoranti) | ★★★★★ | CDN, indicizzazione SEO, budget marketing<br>per costruire base utenti | €100–500+ | *TheFork compete qui. È una scelta strategica fondamentale: essere un gestionale (B2B) o anche un aggregatore (B2C). Richiede massa critica di ristoranti per funzionare. Non consigliato nella fase iniziale.* |

⚠️ **Fase 4:** sviluppare solo dopo aver raggiunto 100+ ristoranti paganti. Non disperdere risorse prima di avere un prodotto consolidato.

## Riepilogo costi servizi terzi

Tutti i servizi necessari nelle prime 3 fasi sono gratuiti o a costo variabile (si pagano in proporzione all'utilizzo). Il costo fisso mensile è praticamente zero fino a volume significativo.

| Servizio | Utilizzo | Piano gratuito | Costo stimato/mese | Link |
|---|---|---|---|---|
| Brevo (ex Sendinblue) | Email transazionali + newsletter | 300 email/giorno (9.000/mese) | €0 → €25 (20k email) | brevo.com |
| SendGrid (Twilio) | Email transazionali | 100 email/giorno | €0 → €19.95 (40k email) | sendgrid.com |
| Stripe | Pre-auth anti no-show, pagamenti | Nessun canone fisso | 1.5%+0.25€ per transaz. | stripe.com |
| 360dialog | WhatsApp Business API | No (trial) | €4.99 base + Meta fees | 360dialog.com |
| Twilio (SMS) | SMS notifiche | Trial $15 | ~€0.07/SMS in Italia | twilio.com |
| Google (Reserve with Google) | Prenotazioni da Google Maps/Search | Gratuito (ma approval lenta) | **€0** | developers.google.com |
| Meta (Instagram/Facebook) | Pulsante Prenota su pagina social | Gratuito | **€0** | developers.facebook.com |
| QRCode library (open source) | Generazione QR menù/prenotazione | Gratuito | **€0** | npmjs.com/qrcode |

**Stima costo infrastruttura Fase 1+2 completa (con 50 ristoranti attivi): €20–80/mese totali. Il costo scala linearmente con il numero di ristoranti e messaggi inviati.**

## Roadmap sintetica

| Fase | Periodo | Feature chiave | Obiettivo |
|---|---|---|---|
| **FASE 1** | Mese 1–2 | Email auto · CRM base · Chiusura servizio · Analytics · QR code · Meta booking | **Parità Avatable** |
| **FASE 2** | Mese 3–5 | WhatsApp · Loyalty points · Anti no-show Stripe · SMS · Newsletter | **Supera Plateform** |
| **FASE 3** | Mese 6–10 | Google Reserve · CRM avanzato · Turni/shift · Push notifiche · Google Reviews | **Compete TheFork** |
| **FASE 4** | Mese 11+ | Multi-sede · AI Voice · POS integration · Marketplace | **Enterprise** |

## Nota finale — La tua vera priorità

Le feature uniche che hai già (menù componibile dal cliente, messaggi promozionali, temi personalizzabili) valgono più di qualsiasi feature delle Fasi 3-4. Prima di aggiungere complessità, assicurati di comunicarle bene e di avere i primi clienti paganti soddisfatti.

**L'ordine di priorità assoluto è: vendi prima, migliora dopo. Ogni feature non ancora sviluppata è un'opportunità di upsell futura, non un problema attuale.**
