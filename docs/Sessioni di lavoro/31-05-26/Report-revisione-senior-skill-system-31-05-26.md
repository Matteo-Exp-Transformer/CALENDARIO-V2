# Report — Revisione senior skill system comunicazione (31-05-26)

- **Cosa è cambiato:** chiusi i grilletti di avvio chat (Meta senior vs revisore) e fatto il triage delle 9 proposte ferme: 3 promosse, 6 messe in attesa-dati. La causa critica «fix su zona sbagliata Prenota/QR» ora ha una regola che la previene.
- **Cosa resta:** il motore Liv.2 è fermo (0 dati) → annotato per la prossima sessione senior; 6 proposte in attesa-dati da rivalutare tra ~5-10 sessioni.
- **Serve una tua azione:** sì — confermi il commit `docs(comunicazione):`.

---

## Contesto sessione

- **Profilo:** Meta senior (grilletto «evolvi … senior» appena mappato; la sessione era partita a voce come «agente meta senior»).
- **Modalità:** deep (revisione strutturale dello skill system).
- **Turni sostanziali Matteo:** ~6. Nessun prepara-prompt a monte (sessione meta diretta).
- **Pausa-raccolta:** Matteo ha scelto «farla rispettare davvero» → bar alto per promuovere.

## Cosa è stato fatto (cronologico)

1. Valutato `APP_CONTEXT_SKILL.md` come prompt d'avvio per sessione meta → diagnosi: è un router, il profilo Meta dice di non partire da lì.
2. Letto vocabolario + REVISIONE → scoperto che il termine «senior» esiste in EVOLUZIONE_SKILLS ma non era un grilletto.
3. **Mappati i grilletti mancanti** in `VOCABOLARIO.md`: «evolvi … senior» (Liv.1 senior), «evolvi» senza senior (Liv.2 chiede), «analizza/revisiona comunicazione» (sempre revisore).
4. Creato `COMANDI_AVVIO.md`: mappa parola→tipo chat→cosa carica.
5. **Analisi senior** di OSSERVAZIONI / PROPOSTE / ERRORI_PROCESSO / EVOLUZIONE → 3 problemi: motore Liv.2 fermo, causa critica Prenota/QR non chiusa, pausa-raccolta contraddetta.
6. **Triage 9 proposte** (vedi sotto).

## Triage proposte — esito

| Proposta | Esito | Motivo |
|----------|-------|--------|
| Disambiguazione Prenota vs QR | ✅ PROMOSSA | danno dimostrato e ripetuto (≥3 agenti); → `PREPARA_PROMPT` §2 |
| Profilo+skill nel prompt esecutore | ✅ PROMOSSA | richiesta esplicita, costo zero (formato); → `PREPARA_PROMPT` §1.A |
| Checklist QA no-URL sì-schermata | ✅ GIÀ-PRESENTE | già regola in `COMUNICAZIONE`; chiusa senza nuovo codice |
| Gate spiegazione avvio chat | 🟡 ATTESA-DATI | parz. risolta da `COMANDI_AVVIO.md` |
| Blocco precauzioni mobile CSS | 🟡 ATTESA-DATI | 1 occorrenza, serve la 2ª |
| Ciclo Verifica merge→main | 🟡 ATTESA-DATI | tocca produzione; → M4 hook |
| Validazione admin no-toast | 🟡 ATTESA-DATI | micro-UX, 1 occorrenza |
| Revisione UI viewport obbligatorio | 🟡 ATTESA-DATI→M4 | regola già esiste ma bypassata = problema di enforcement, non di regola |
| «tutto fatto» chiusura ciclo | 🟡 ATTESA-DATI | si sovrappone a «lavoro ok» + «fai report finale» |

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `VOCABOLARIO.md` | +2 voci (evolvi senior, evolvi-senza-senior), estesa migliora-comunicazione | mappare i grilletti meta mancanti |
| `COMANDI_AVVIO.md` | nuovo file | mappa di riferimento parola→chat |
| `PREPARA_PROMPT_SKILL.md` | §2 gate Prenota/QR; §1.A profilo+skill nel prompt | 2 proposte promosse |
| `PROPOSTE.md` | 3 accettate in archivio, 6 marcate ATTESA-DATI con motivo, banner pausa | triage |
| `ERRORI_PROCESSO.md` | causa critica Prenota/QR segnata RISOLTA | regola correttiva attiva |
| `EVOLUZIONE_SKILLS.md` | Log idee: motore Liv.2 fermo, grilletti, Prenota/QR risolto | tracciare per prossima sessione |
| `MEMORY.md` + `project_avvio_chat_grilletti.md` | nuova memoria | grilletti persistenti tra sessioni |

## Dati comunicazione

- **Frasi/richieste ricorrenti:** «sii onesto ma critico e esigente» (×1, imposta il tono della sessione); «mappiamo una parola/frase» (×1, vuole grilletti non descrizioni di ruolo); «proseguiamo con analisi senior» (×1).
- **Pattern nuovo forte:** Matteo pensa per **parole-grilletto**, non per descrizioni di ruolo. Il suo prompt iniziale («agente meta senior») non ha funzionato perché non usava un termine mappato. → ha chiesto di mappare un grilletto per OGNI tipo di chat. Già soddisfatto con COMANDI_AVVIO.md.
- **Decisione di processo:** Matteo ha la logica «se leggi X ma non Y, chiedi» (evolvi senza senior → Liv.2). Ragiona già in termini di livelli di libertà del vocabolario.
- **Cosa ha funzionato:** tabelle compatte parola→effetto; AskUserQuestion a opzioni per le decisioni di triage e pausa.
- **Token risparmiabili:** d'ora in poi Matteo apre una sessione senior con «evolvi skill system senior» invece di descrivere il ruolo + passare APP_CONTEXT.

### Cronologia prompt di Matteo (annotati)

1. «sei agente meta senior… dimmi se è chiaro come prompt di avvio» → intento: validare l'avvio. Esito: diagnosi che il file è un router, non l'entry-point meta.
2. «mappiamo una parola/frase… per ogni tipo di chat» → intento: grilletti. Esito: mappati + COMANDI_AVVIO.md.
3. «evolvi solo senior… se leggi evolvi ma non senior chiedi» → intento: logica del discriminante. Esito: voce Liv.2.
4. «salva in memoria e fai commit, poi analisi senior di osservazioni e proposte» → intento: chiusura parziale + nuova fase. Esito: questa revisione.
5. Triage: «triage di tutte le 9» + «pausa rispettata davvero» → criterio del triage.
6. «sì procedi così» → ok al triage proposto.

### Cosa non è successo in chat

- Nessuna modifica a codice `src/` (sessione meta pura).
- Nessuna voce Liv.2 applicata (sessione meta, non di lavoro) → nessun dato Liv.2 raccolto.
- Matteo non ha confermato smoke/test (non applicabile).
- Il punto «riparare motore Liv.2» non è stato eseguito (annotato per prossima sessione, non scelto come azione oggi).

## Derivazione errori

- **Nessuna difficoltà tecnica.** Un edit a VOCABOLARIO è stato interrotto 2× per chiusura accidentale finestra (Matteo) — non un errore di processo né di prompt.
- **Causa di processo individuata (non un errore di questa sessione):** il motore Liv.2 fermo è un **bug di processo preesistente** — il protocollo fine-chat prevede la scrittura degli esiti Liv.2 ma in pratica non avviene. Candidato a enforcement M4. Annotato in EVOLUZIONE Log idee.

## Cosa resta per la prossima sessione

- **Riparare il motore Liv.2** (guasto #1): capire perché 0 esiti e renderne obbligatoria la scrittura. Probabile soluzione: hook M4.
- Rivalutare le 6 proposte ATTESA-DATI quando ci sono ~5-10 sessioni di dati.
- Nessun nuovo FU aperto.
