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

### [IN ATTESA] Copy verbatim / «mostra solo questo testo» → delta esplicito, non riscrivere tutto il blocco
- **Pattern osservato:** 1 (29-05-26 promo modale). Matteo chiede nuovo intro + chiusura; agente semplifica anche l’elenco rimuovendo `tipologia → «promo esistente»`. Matteo: «non ti ho detto di cambiarlo».
- **Automatizzabile con certezza:** applicare letteralmente **solo** le stringhe/frasi citate; lasciare invariati gli elementi UI non menzionati (es. formato riga elenco).
- **Meglio lasciare manuale:** se la richiesta sembra sostituire «tutto il testo del modale», chiedere conferma su elenco/dettagli secondari.
- **Livello suggerito:** 2 (cautela).
- **Token risparmiati per Matteo:** evita giro correzione + frustrazione.
- **Esito / data:** in attesa · report promo conflitto 29-05-26.

### [IN ATTESA] «non vedo il modal» → usare Modal in-app, non window.confirm
- **Pattern osservato:** 1 (29-05-26 promo conflitto). Dopo implementazione con `window.confirm`, Matteo non percepisce il dialogo; fix con `Modal.tsx` → «ottimo funziona».
- **Automatizzabile con certezza:** in task admin con «finestra di conferma», default = componente `Modal` con due pulsanti; `window.confirm` solo se esplicitamente richiesto per parity legacy.
- **Meglio lasciare manuale:** scelta copy e layout modale specifico per feature.
- **Livello suggerito:** 1 (automatico) per la scelta Modal vs confirm browser.
- **Token risparmiati per Matteo:** evita un giro «non funziona» + fix.
- **Esito / data:** in attesa · collegato FU-003 e report promo conflitto 29-05-26.

### [IN ATTESA] «lavoro ok» → conferma successo implementazione (spesso seguito da report)
- **Pattern osservato:** 1 (29-05-26). Matteo chiude una sessione Esecuzione con «lavoro ok» dopo
  aver verificato (o fidandosi del riepilogo agente); nella stessa frase o subito dopo chiede spesso
  «fai report finale» e dettagli comunicazione.
- **Automatizzabile con certezza:** trattare «lavoro ok» come **conferma che il codice/task è accettato**
  (equivalente a «funziona» / «perfetto» per il protocollo fine-chat); **non** sostituisce da solo
  «fai report finale» se Matteo non lo dice — ma se dice entrambi, eseguire report + OSSERVAZIONI + PROPOSTE.
- **Meglio lasciare manuale:** commit, push, migrazioni DB — non inferire da «lavoro ok» solo.
- **Livello suggerito:** 1 (automatico) per la conferma; resta Liv.1 anche «fai report finale» quando esplicito.
- **Token risparmiati per Matteo:** una parola invece di ripetere «va bene così, chiudi sessione».
- **Esito / data:** in attesa · origine report 29-05-26 card scorrevole titolo admin.

### [IN ATTESA] «comportamenti sono ok» · «non è un problema» · «voglio che cambi (come ti ho detto)» → cambio intenzionale, non bugfix
- **Pattern osservato:** 1 forte (29-05-26). Matteo corregge l'agente che aveva inquadrato la richiesta
  come fix/regressione: il comportamento attuale è accettabile; serve un **cambio mirato** al comportamento
  descritto (es. smettere di disegnarsi sopra altri blocchi UI).
- **Automatizzabile con certezza:** in prompt/report usare linguaggio «comportamento richiesto / cambio UX»,
  non «bug / ripristino / regressione»; obiettivo prompt = stato desiderato esatto, non diagnosi.
- **Meglio lasciare manuale:** decidere se il cambio tocca anche copy o skill di prodotto.
- **Livello suggerito:** 2 (cautela) — se ambiguo se vuole mantenere qualche aspetto del comportamento attuale, una domanda.
- **Token risparmiati per Matteo:** evita riformulazioni e prompt esecutore sbagliati.
- **Esito / data:** in attesa · origine report 29-05-26 prepara-prompt Prenota stacking.

### [IN ATTESA] «compila report … comunicazione … vocabolario (solo sicuro) … annota i miei prompt» → chiusura meta sessione
- **Pattern osservato:** 1 (29-05-26). Dopo sessione prepara-prompt (o simili senza codice), Matteo chiede
  report dettagliato su comunicazione, proposte vocabolario **senza junk**, citazione verbatim dei suoi prompt.
- **Automatizzabile con certezza:** generare report in `Sessioni di lavoro/GG-MM-AA/` con sezione «Dati comunicazione»
  completa + sottosezione «Prompt di Matteo (annotati)» + aggiornare `OSSERVAZIONI.md`; candidate solo in `PROPOSTE.md`.
- **Meglio lasciare manuale:** promozione voci in `VOCABOLARIO.md` (solo Matteo).
- **Livello suggerito:** 2 (cautela) — estende «fai report finale» quando la sessione è meta/comunicazione, non implementazione.
- **Token risparmiati per Matteo:** una richiesta invece di ripetere struttura report + regole anti-junk.
- **Esito / data:** in attesa · origine report 29-05-26.

### [IN ATTESA] «revisiona [lavoro X] e se è ok committa» → valida con i test e committa
- **Pattern osservato:** 1 forte (28-05). Matteo delega la revisione del lavoro di altri agenti
  fidandosi della validazione automatica come prova.
- **Automatizzabile con certezza:** eseguire `npm run validate` + check import rotti come criterio
  oggettivo di "ok"; se verde, committare con messaggio che cita l'esito della revisione.
- **Meglio lasciare manuale:** se i test passano ma noti un difetto logico (come nel caso PWA),
  fermarsi e segnalarlo prima di committare — il "verde" non basta sempre.
- **Livello suggerito:** 2 (cautela) — di solito procedi, ma con lo stop sui difetti logici.
- **Token risparmiati per Matteo:** medi.
- **Esito / data:** in attesa.

### [IN ATTESA] azioni strutturali rischiose → impatto + AskUserQuestion prima di agire
- **Pattern osservato:** 2 (spostare 77 file, rinominare cartella gitignored). Matteo vuole capire
  l'impatto e decidere, non subire un'azione irreversibile.
- **Automatizzabile con certezza:** prima di spostamenti di massa / rename / azioni che toccano
  git tracking o privacy, misurare l'impatto (quanti link, gitignore) e proporre opzioni con dati.
- **Meglio lasciare manuale:** la decisione finale è sempre sua.
- **Livello suggerito:** 1 (automatico) — è una salvaguardia, mai dannosa.
- **Token risparmiati per Matteo:** alti — evita danni e rilavorazioni.
- **Esito / data:** in attesa.

---

## Archivio (decise)

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
