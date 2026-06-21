# Inventario funzionalità — Onboarding vs Console

> **A cosa serve.** L'elenco di **tutte** le manopole configurabili dell'app, già divise in due secchi:
> - **🟩 ONBOARDING** = lo imposta da solo il ristoratore (oggi guidato da te, domani in un wizard self-service).
> - **🟦 CONSOLE / LO FAI TU** = per ora lo configuri **tu (Matteo)** in fase di vendita; il cliente non lo vede.
>   Include sia cose avanzate/pericolose, sia i «valori già pronti» (default/preset) che il cliente non deve toccare.
>
> **Per ora bastano questi due secchi.** In futuro si potrà spostare qualcosa da Console a Onboarding
> (es. quando il wizard diventa più furbo): quando succederà, si sposta la riga qui e si aggiorna la
> Guida cliente. Finché non lo decidi, **non spostare nulla**.
>
> **Fonti di verità (non duplicare i valori a mano):** registro
> `src/features/booking/lib/restaurantSettingRegistry.ts`; Servizio
> `src/features/booking/components/servizio/*`; sistema versioni `src/config/features.ts` +
> `tenants.edition`; regole prodotto `docs/MASTERPLAN_SERVIZIO.md` (D1–D42). Se questo file e il codice
> divergono, **vince il codice**.

---

## Legenda
- **Versione:** Classic (base) · Pro (sala/tavoli) · +QR (menu digitale).
- **Stato:** ✅ esiste oggi · 🆕 nuova (da masterplan Servizio, ancora da costruire).
- «Lo fai tu» non vuol dire «per sempre»: vuol dire «per ora, finché non c'è la console o un wizard più furbo».

---

## 🟩 ONBOARDING — lo imposta il ristoratore

| Funzionalità | Versione | Stato | Cosa decide il ristoratore |
|---|---|---|---|
| Nome del locale | Classic | ✅ | Come si chiama. Obbligatorio. |
| Contatti (email / telefono / indirizzo) | Classic | ✅ | I suoi recapiti. |
| Orari di apertura | Classic | ✅ | Giorni e orari; base delle fasce. |
| Fasce orarie (Pranzo / Cena): nome, inizio, fine | Classic | ✅ | I suoi turni di servizio. |
| Coperti massimi per fascia | Classic | ✅ | Quanti coperti regge per turno. |
| Accetta arrivi tardivi (sì/no, per fascia) | Classic | 🆕 | Se tenere il tavolo a chi arriva tardi. |
| Chiusura di una fascia (per oggi/periodo) | Pro | ✅ | Operativo: chiudo il pranzo di domani. |
| Modifica a tempo dei coperti (oggi/settimana/mese/giorni scelti) | Pro | ✅ | Operativo: stasera evento, taglio i coperti. |
| Sale (nome) | Pro | ✅ | Come sono divise le sale. |
| Tavoli (nome, capienza, posizione sulla mappa) | Pro | ✅ | La sua sala reale. |
| Assegna prenotazione → tavolo | Pro | ✅ | Operativo, in servizio. |
| Walk-in (cliente senza prenotazione) | Pro | ✅ | Operativo, in servizio. |
| Sfondo / foto pagina Prenota | Classic | ✅ | Aspetto, da galleria chiusa. |
| Testi pagina Prenota (titolo, descrizione) | Classic | ✅ | Le sue parole di benvenuto. |
| Promo / banner menù (opzionale) | Classic | ✅ | Eventuale messaggio marketing. |

---

## 🟦 CONSOLE / LO FAI TU — per ora lo configura Matteo

| Funzionalità | Versione | Stato | Perché lo fai tu (per ora) |
|---|---|---|---|
| **Versione venduta** (Classic / +QR / Pro) e funzioni accese | tutte | ✅ | È il prezzo/fatturato. Mai in mano al cliente. `tenants.edition` + `tenant_features`. |
| Durata di base del tavolo (tipologia) | Classic (Liv.2) | 🆕 | È il numero che tari in vendita. Valori pronti 90/120/150/180. Se sbagliato, sballa le disponibilità. |
| Durata sulle card (esperienze: **Prenota un Tavolo / Degustazione / Evento**) | Classic | 🆕 | Va dentro le card che prepari tu (120 / 150 / 180); il cliente non le disegna. |
| Creazione card / menu (fisso vs componibile, prezzo, piatti collegati) | Classic/+QR | ✅ | Richiede capire il modello menu. Il cliente può al massimo cambiare i testi. |
| Minimo durata di una fascia | Classic | 🆕 | Numero tecnico (pavimento). Non si spiega in 30 secondi. |
| Intervallo di arrivo (ogni quanto si prenota) | Classic | 🆕 | Default ottimo (30 min / 15 a pranzo). Lo tocchi solo su richiesta. |
| Anticipo minimo per prenotare (cut-off) | Classic | 🆕 | Default 60 min. Esporlo invita a romperlo. |
| Tempo minimo per ordinare | Classic | 🆕 | Default 45 min. Se sbagliato **blocca prenotazioni vere**: lo tari tu. |
| Buffer di riassetto tavolo (turnover) | Classic/Pro | 🆕 | Tecnico. Default 0 (Classic) / 10 (Pro). |
| Limite coperti per fascia: interruttore acceso/spento | Classic | ✅ | Da legare ai coperti, non lasciare come switch nudo (genera supporto). |
| Rifiuta richieste fuori fascia | Classic | ✅ | Scelta di policy da venditore, non da modulo. |
| Limite coperti «operativo» anche con i tavoli | Pro | 🆕 | Caso raro (80 posti ma ne accetto 60). Avanzato. |
| Ritardo / no-show (dopo quanti minuti segnalare) | Pro | 🆕 | Default 15–20. Per la console di sala. |
| Limite coperti walk-in | Pro | ✅ | Default 20. Caso limite; default basta. |
| Fuso orario | Classic | ✅ | Sempre Italia. Solo se cliente estero. |
| Tema grafico dell'area admin | Classic | ✅ | Estetico interno. |
| Finestra di prenotabilità (quanti giorni avanti) | Classic | ✅ | Oggi senza effetto reale; default 60. |
| «Turni massimi per tavolo» (vecchio campo) | Pro | ✅ | **Da non usare:** è un residuo che confonde col nuovo motore (D41). |

---

## 🔮 Non ancora — solo da predisporre (futuro)

Niente da configurare oggi; si lascia pronto nel modello dati e basta.

| Funzionalità | Versione | Quando |
|---|---|---|
| Pacing (tetto di arrivi per singolo orario) | Classic | Quando un cliente reale lo chiede (D21). |
| Cliente ordina dal proprio telefono (QR per tavolo) | Pro | Dopo la console di sala (S6, riapre Menu QR). |
| Conto del tavolo / servizio dal vivo (console sala) | Pro | Cantiere S4-LIVE del masterplan. |
| Vista cucina (KDS) | — | Milestone separata futura (D33). |

---

## Come usare questo file con un agente

1. Quando apri un lavoro su una manopola, **prima** guarda in quale secco sta qui.
2. Se è 🟩 Onboarding → la logica e i testi devono essere semplici, a prova di cliente non tecnico.
3. Se è 🟦 Console → per ora resta dietro le quinte; **non** aggiungere UI nel pannello del ristoratore.
4. Se sposti una riga da un secco all'altro, aggiorna **anche** `GUIDA_CONFIGURAZIONE_CLIENTE.md` e segnalo
   nella roadmap, così non nascono due versioni in disaccordo.
