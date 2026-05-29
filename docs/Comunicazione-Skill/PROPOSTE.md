# PROPOSTE — automazioni candidate (in attesa di decisione di Matteo)

> L'agente scrive qui quando un pattern in [OSSERVAZIONI.md](OSSERVAZIONI.md) è maturo
> (≥2-3 occorrenze). Ogni proposta va **chiesta a Matteo in chat**. Esito:
> - **Accettata** → la rule sale in [VOCABOLARIO.md](VOCABOLARIO.md), qui si segna ✅ accettata.
> - **Rifiutata** → si segna ❌ con il motivo, **non riproporre**.
> - **In attesa** → resta qui finché Matteo non decide.

Ogni proposta deve dire: cosa automatizzare **con certezza** vs cosa **lasciare manuale** e perché.

---

## Formato

```
### [stato] «trigger proposto» → comportamento
- **Pattern osservato:** cosa si ripete e quante volte
- **Automatizzabile con certezza:** ...
- **Meglio lasciare manuale:** ... (perché)
- **Livello suggerito:** 1 (automatico) | 2 (cautela) | 3 (conferma) — in dubbio 3
- **Token risparmiati per Matteo:** stima
- **Esito / data:** ...
```

---

## In attesa di decisione

### In attesa «segnala conflitto scalabilità multi-tenant» → sezione report + COMUNICAZIONE
- **Pattern osservato:** Matteo vuole sapere se le sue decisioni (autosave, guard, persistenza) confliggono con N ristoranti / multi-azienda.
- **Automatizzabile con certezza:** sezione report **Scalabilità multi-tenant** (ok/attenzione/conflitto) quando task tocca persistenza o state admin condiviso.
- **Meglio lasciare manuale:** giudizio sul conflitto reale.
- **Livello suggerito:** 2
- **Esito / data:** FU-006 aperto; in attesa promozione regola report.

### In attesa «tutto fatto» come chiusura ciclo multi-agente
- **Pattern osservato:** Matteo dice «tutto fatto» a fine catena prepara → esecuzione → (revisione) e chiede raccolta comunicazione + commit + report (29-05-26 salvataggio admin).
- **Automatizzabile con certezza:** agente prepara-prompt a valle (o esecutore con conferma) aggiorna report ciclo, OSSERVAZIONI, PROPOSTE, SESSION_LOG; commit codice + docs separati; **non** promuove voci vocabolario.
- **Meglio lasciare manuale:** giudizio «approva / riserve» se QA browser incompleto.
- **Livello suggerito:** 2 — trattare come trigger chiusura documentale, non come «lavoro ok» sul solo codice.
- **Esito / data:** in attesa — distinguere da voce Liv.1 «lavoro ok» (task singolo).

---

## Archivio (decise)

### ✅ ACCETTATA (29-05-26) «mockup HTML per scelta flusso UX» → PREPARA_PROMPT §1.B
- **Pattern osservato:** Matteo: «comodissimo», «mi serve quasi sempre» per scegliere flusso/UI prima di implementare (ciclo salvataggio admin).
- **Automatizzabile:** prepara-prompt propone o consegna HTML multi-stato (tab oggi/proposta/modale); file es. `mockup-*.html` in root ok.
- **Non in VOCABOLARIO Liv.1** finché Meta non promuove — regola già in `PREPARA_PROMPT_SKILL.md` §1.B.
- **Esito / data:** 29-05-26 codificata; esempio `mockup-salvataggio.html`.

### ✅ ACCETTATA (29-05-26) Modalità sessione light / standard / deep → regola attiva (PREPARA_PROMPT § 1.A + APP_CONTEXT § 7.1)
- Classificazione interna (no parola di Matteo): prepara-prompt assegna light/standard/deep e la scrive nel prompt; decide quanto protocollo di chiusura applicare. **Deep automatico** su: DB/prod/RLS, file LOCK, >1 view o nuovo componente, auth/login/pagamenti. **L'esecutore può solo alzare, mai abbassare.** Risolve il rischio #1 (sistema troppo procedurale: oggi ogni task fa il protocollo deep). Origine: analisi agente skill system v0 + decisione Matteo 29-05-26.

### ✅ ACCETTATA (29-05-26) «lavoro ok» → VOCABOLARIO Liv. 1
- Conferma che il task è accettato; non avvia da solo report/commit. In `VOCABOLARIO.md`.

### ✅ ACCETTATA (29-05-26) «finestra/dialog di conferma» → VOCABOLARIO Liv. 1
- Default = componente `Modal` in-app, mai `window.confirm` browser. In `VOCABOLARIO.md`. Lega a FU-003.

### ✅ ACCETTATA (29-05-26) «comportamenti ok ma voglio che cambi» → VOCABOLARIO Liv. 2
- Cambio intenzionale, non bugfix. Linguaggio «cambio UX» non «bug/regressione». In osservazione (Liv.2).

### ✅ ACCETTATA (29-05-26) «compila report … comunicazione … annota prompt» → VOCABOLARIO Liv. 2
- Chiusura sessione meta: report Dati comunicazione + prompt verbatim + OSSERVAZIONI; candidate only. In osservazione (Liv.2).

### ✅ ACCETTATA (29-05-26) «revisiona [lavoro] e se ok committa» → VOCABOLARIO Liv. 2
- Valida con `npm run validate`, committa se verde, MA fermati sui difetti logici anche a test verdi. In osservazione (Liv.2).

### ✅ ACCETTATA (29-05-26) Report unificato ciclo multi-agente → regola attiva (APP_CONTEXT § 7.1)
- Da preferenza a regola: cicli dichiarati multi-agente (prepara → esegui → revisiona) usano un solo `Report-ciclo-<tema>-GG-MM-AA.md`, aggiornato da ogni ruolo. Codificata in § 7.1.

### ✅ ACCETTATA (29-05-26) Copy verbatim → Nota in COMUNICAZIONE_UTENTE_SKILL
- Quando Matteo incolla testo da applicare letterale: cambiare solo le stringhe citate, lasciare invariato il resto; se sembra sostituzione totale, chiedere. Codificata nello skill comunicazione.

### ✅ ACCETTATA (29-05-26) Freno azioni strutturali rischiose → regola attiva (PREPARA_PROMPT § 2)
- Prima di spostamenti di massa / rename / azioni irreversibili: misurare impatto + AskUserQuestion con opzioni, mai eseguire d'impulso. Salvaguardia automatica, nessuna parola-trigger.

### ✅ ACCETTATA (28-05-26) «fai report finale» → VOCABOLARIO Liv. 1
- Flusso di fine-chat (report + skill + proposta commit) **solo su questo termine esplicito**, non
  sul trigger "ok/funziona". Matteo preferisce dirlo lui. Salita in `VOCABOLARIO.md`.

### ✅ ACCETTATA (28-05-26) «dammi prompt proseguimento» → VOCABOLARIO Liv. 1
- Risposta = solo il prompt auto-contenuto per la chat successiva (passa il lavoro dal punto esatto,
  evita contesto pesante). Salita in `VOCABOLARIO.md`.

### ✅ ACCETTATA (28-05-26) «revisione completa» → VOCABOLARIO Liv. 1
- Revisione critica e indipendente (workflow multi-agente): dichiara i difetti veri, mai "ok" di
  cortesia. Riconosciuta anche nel testo di avvio dell'agente. Salita in `VOCABOLARIO.md`.

### ❌ RIFIUTATA (28-05-26) «è un bug o è voluto?»
- Caso troppo raro per ora. Non riproporre salvo nuovi dati.

### ✅ ACCETTATA (28-05-26) «spiegamelo semplice» → VOCABOLARIO Liv. 1
- Metafora + esempio nell'app + chi-fa-cosa, breve. Salita in `VOCABOLARIO.md`.

### ❌ RIMOSSA (28-05-26) «devo farlo io ogni volta?»
- Era stata aggiunta a Liv. 2, poi Matteo l'ha rimossa: non la dice abbastanza spesso per ora.

### In attesa «sessione Verifica mappatura Impostazioni ↔ Prenota» → template + vocabolario
- **Pattern osservato:** Matteo incolla coppie DOM `admin -- prenota`; agente Verifica traccia `setting_key`, hook, esito OK/KO (29-05-26, ~30 coppie).
- **Automatizzabile con certezza:** template report con colonne fisse + sezione procedura/prompt; checklist gap «campo admin non renderizzato in Prenota»; rimando APP_CONTEXT riga Pagina Prenota.
- **Meglio lasciare manuale:** coppie DOM da ispezionare; giudizio KO vs parziale.
- **Livello suggerito:** 2 — «controverifica mappatura» / «mappatura impostazioni prenota» → profilo Verifica + report template.
- **Termini candidati Liv.2:** Anagrafica Azienda, Personalizza form, Card scorrevole, TIPO sidebar, Nome promo (admin) vs Testo promo (Prenota), Filtro categorie/ingredienti — tabella nel report mappatura 29-05-26.
- **Token risparmiati:** meno re-spiegazioni storage `restaurant_settings` vs JSON config.
- **Esito / data:** in attesa — proposta da report mappatura 29-05-26.

### ✅ ACCETTATA (28-05-26) «scalabile e pulita / no parti obsolete» → VOCABOLARIO Liv. 1
- Preferisci soluzioni durevoli, segnala cosa eviti. Salita in `VOCABOLARIO.md`.

### ✅ ACCETTATA (28-05-26) scorciatoie d'area + stile → VOCABOLARIO
- Pagina Prenota / Pagina menù-QR / pagina admin / le tre zone menu distinte (Personalizza form,
  Menu QR, magazzino MenuPricesTab) + sicurezza prod L1 + comportamento plan-mode (domande su
  competenze Matteo + dubbi strutturali). Vedi VOCABOLARIO sezioni "Stile" e "Scorciatoie d'area".

### ✅ ACCETTATA (28-05-26) termini profili di ingresso → VOCABOLARIO Liv. 1
- **Esecuzione:** «implementa» · «sistema» · «fai» · «nuova feature» · «aggiungi» · «crea»
- **Verifica:** «revisiona» · «controlla» · «verifica» · «debugga» · «trova il bug» · «non funziona»
- **Meta:** «migliora comunicazione» · «aggiorna comunicazione»
- **Esito:** approvati in chat di mappatura, saliti in `VOCABOLARIO.md` a Liv. 1. Riferimento rapido anche in `APP_CONTEXT_SKILL.md` § 0.0.
