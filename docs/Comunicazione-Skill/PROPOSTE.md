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

### [IN ATTESA] «ottimo / funziona / perfetto» → trigger protocollo fine-chat
- **Pattern osservato:** molte volte (OSSERVAZIONI). È la conferma di successo che dovrebbe far
  partire report + aggiornamento skill + commit dedicato.
- **Automatizzabile con certezza:** alla conferma esplicita, l'agente propone (non esegue d'ufficio)
  il flusso di fine-chat: report in `Sessioni di lavoro/`, allineamento skill, commit separati.
- **Meglio lasciare manuale:** il via al commit resta una conferma di Matteo (non committare di slancio).
- **Livello suggerito:** 2 (cautela) — proponi il flusso, non lo esegui senza ok.
- **Token risparmiati per Matteo:** medi — non deve ricordare ogni volta i passi di chiusura.
- **Esito / data:** in attesa.

### [IN ATTESA] «dammi il prompt per la prossima sessione» → prompt pronto e auto-contenuto
- **Pattern osservato:** ≥1 forte (28-05, log OSSERVAZIONI). Matteo usa più agenti in catena e
  apprezza prompt già formattati da incollare.
- **Automatizzabile con certezza:** a fine sessione, se c'è lavoro residuo, fornire un blocco prompt
  copia-incolla auto-contenuto (contesto + obiettivo + file + vincoli) per la chat successiva.
- **Meglio lasciare manuale:** quali task includere (Matteo decide lo scope della prossima sessione).
- **Livello suggerito:** 2 (cautela) — offrilo quando c'è residuo, non sempre.
- **Token risparmiati per Matteo:** alti — non riscrive il contesto da zero.
- **Esito / data:** in attesa (idea proposta dall'agente, da decidere).

### [IN ATTESA] workflow multi-agente «pianifica → esegue → revisiona» → revisione critica vera
- **Pattern osservato:** 2+ (OSSERVAZIONI). Matteo separa chi pianifica, chi esegue (altra chat) e
  chi revisiona; vuole che il revisore trovi difetti veri, non confermi per cortesia.
- **Automatizzabile con certezza:** in profilo Verifica su lavoro altrui, dichiarare apertamente i
  difetti trovati (anche a test verdi) prima di approvare; mai "ok" di cortesia.
- **Meglio lasciare manuale:** la decisione di committare il lavoro revisionato resta di Matteo.
- **Livello suggerito:** 1 (automatico) — è il senso stesso del profilo Verifica.
- **Token risparmiati per Matteo:** medi.
- **Esito / data:** in attesa (idea proposta dall'agente).

### [IN ATTESA] «è un bug o è voluto?» → distinguere comportamento atteso da difetto
- **Pattern osservato:** segnalato nel Metodo come dubbio da fermare (striscia 20vw "voluta non bug").
- **Automatizzabile con certezza:** prima di "correggere" un comportamento che potrebbe essere una
  scelta UX già confermata, l'agente verifica nelle RULE/report se è voluto e chiede se ambiguo.
- **Meglio lasciare manuale:** la conferma finale "è voluto" spetta a Matteo.
- **Livello suggerito:** 2 (cautela).
- **Token risparmiati per Matteo:** medi — evita fix non richiesti su scelte volute.
- **Esito / data:** in attesa (idea proposta dall'agente).

---

## Archivio (decise)

### ✅ ACCETTATA (28-05-26) «spiegamelo semplice» → VOCABOLARIO Liv. 1
- Metafora + esempio nell'app + chi-fa-cosa, breve. Salita in `VOCABOLARIO.md`.

### ✅ ACCETTATA (28-05-26) «devo farlo io ogni volta?» → VOCABOLARIO Liv. 2
- Classifica responsabilità (tu/tool/una-tantum), ma **solo su domanda esplicita** (non proattiva).
  Matteo ha scelto Liv. 2 non proattivo, non Liv. 1. In osservazione.

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
