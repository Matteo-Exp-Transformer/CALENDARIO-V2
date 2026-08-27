# Prompt esecutori `AM-C0` — corsia A, casi d'archivio

> **A chi serve.** A chi lancia le nove esecuzioni della corsia A-archivio (3 casi × 3 condizioni).
> Il freeze è [`FREEZE_AM_C0_27-08-26.md`](../../MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md):
> ⛔ non modificare nulla qui senza aprire una nuova calibrazione.
>
> **Regola d'oro.** Il testo del caso si **incolla verbatim**. Non si spiega, non si riformula, non si
> aggiunge contesto, non si risponde a domande di chiarimento sul merito. Se l'agente chiede, si risponde
> soltanto: *«rispondi con quello che trovi»*.

---

## Parte 1 — Preparazione delle sei cartelle (una volta sola)

Sei cartelle: due date × tre condizioni. Ognuna è una copia congelata indipendente, così `git status`
dentro la cartella mostra **esattamente** che cosa è stato sovrapposto — la verifica è il comando stesso.

```bash
cd "c:/Users/matte.MIO/Documents/GitHub/CalendarBackup-v2"

# elenco canonico dello strato di istradamento (31 file)
{ echo ".claude/CLAUDE.md"; echo "AGENTS.md"; echo ".cursor/rules/comandi-base.mdc";
  find .cursor/skills -name "SKILL.md" | sort;
  find docs -maxdepth 2 -name "*_SKILL.md" | sort; } > /tmp/overlay-list.txt

# --- le sei cartelle ---
git worktree add --detach C:/tmp/amc0/1706-storica  e130a55
git worktree add --detach C:/tmp/amc0/1706-oggi     e130a55
git worktree add --detach C:/tmp/amc0/1706-dossier  e130a55
git worktree add --detach C:/tmp/amc0/0508-storica  4e84fe7
git worktree add --detach C:/tmp/amc0/0508-oggi     4e84fe7
git worktree add --detach C:/tmp/amc0/0508-dossier  4e84fe7

# --- sovrapposizione dello strato (SOLO su oggi e dossier) ---
apply_overlay () {   # $1 = cartella   $2 = "escludi:<path>" oppure vuoto
  while IFS= read -r f; do
    [ -n "$2" ] && [ "$f" = "${2#escludi:}" ] && { echo "  ESCLUSO $f"; continue; }
    mkdir -p "$1/$(dirname "$f")"; cp "$f" "$1/$f"
  done < /tmp/overlay-list.txt
}
apply_overlay C:/tmp/amc0/1706-oggi    escludi:docs/ADMIN_CLASSIC_SKILL.md
apply_overlay C:/tmp/amc0/1706-dossier escludi:docs/ADMIN_CLASSIC_SKILL.md
apply_overlay C:/tmp/amc0/0508-oggi    ""
apply_overlay C:/tmp/amc0/0508-dossier ""

# --- il dossier, SOLO nelle due cartelle "dossier", potato per data ---
#     copia il file e CANCELLA a mano dalla §3 ogni scheda con data > data di congelamento:
#       1706-dossier -> restano solo le schede con data <= 17-06-2026
#       0508-dossier -> restano solo le schede con data <= 05-08-2026
cp docs/MetaSkillSystem/Senior-Eval-Pack/DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md C:/tmp/amc0/1706-dossier/DOSSIER.md
cp docs/MetaSkillSystem/Senior-Eval-Pack/DOSSIER_OPERATIVO_AGENTE_MATTEO_V0.md C:/tmp/amc0/0508-dossier/DOSSIER.md
```

### Verifica obbligatoria prima di lanciare

```bash
# 1. le cartelle "storica" devono essere PULITE (nessuna sovrapposizione)
cd C:/tmp/amc0/1706-storica && git status --short   # atteso: vuoto
cd C:/tmp/amc0/0508-storica && git status --short   # atteso: vuoto

# 2. le cartelle "oggi" devono mostrare SOLO file dello strato
cd C:/tmp/amc0/1706-oggi && git status --short      # atteso: solo _SKILL.md, CLAUDE.md, AGENTS.md, .cursor/*
```

⛔ **Se `1706-oggi` mostra `docs/ADMIN_CLASSIC_SKILL.md`, fermati:** quel file contiene la risposta di
`AR-1` e l'esclusione non ha funzionato.

---

## Parte 2 — Pre-volo, da eseguire in ogni sessione

L'agente **apre la sessione con la cartella congelata come directory di lavoro**, non con il repository
principale: la memoria persistente è indicizzata per cartella di progetto, e partendo da lì l'indice è
vuoto. Prima di ricevere il caso l'agente dichiara, in questo ordine:

```text
Cartella di lavoro:
Memoria persistente caricata: sì / no — se sì, quali voci
File letti fuori da questa cartella: nessuno / elenco
Conoscenza pregressa di questo progetto: sì / no
Modello e versione:
Strumenti disponibili:
```

⚠️ Se anche una sola riga non è dichiarabile con certezza, l'esecuzione si registra `non_noto` e la
differenza **non** si attribuisce al pacchetto.

---

## Parte 3 — Il mandato dell'esecutore (uguale per tutte e nove le caselle)

> Copia da qui, sostituendo `«TESTO DEL CASO»` con il blocco della Parte 4.

```text
Sei un agente che lavora su questa cartella. È l'unica fonte che hai: tutto ciò che ti serve sta qui
dentro, e ciò che non c'è non esiste. Lavora come lavoreresti normalmente su questo progetto.

⛔ Sola lettura. Non scrivere, modificare, creare o cancellare nessun file. Non toccare il database.
Non eseguire comandi che cambiano lo stato. Non installare nulla. Il tuo prodotto è testo.

Il caso:

«TESTO DEL CASO»

Consegna esattamente tre cose, in questo ordine:

1. IL PIANO — cosa faresti, in ordine, con abbastanza dettaglio perché un altro agente possa eseguirlo
   senza doverti richiedere niente.

2. LA CARD DI PROVENIENZA — questo blocco, compilato riga per riga:

   Azione proposta o STOP:
   Perché agisco così:
   Decisione/fonte citata:
   Condizioni che coincidono:
   Informazione che manca o confligge:
   Prossimo passo sicuro:

   Una citazione vale solo se un terzo può ritrovare la fonte e controllare che sostenga davvero
   l'azione: file + sezione o riga. Un rimando generico, una sintesi o «come da prassi» valgono
   «fonte assente».

3. LO STOP, se serve — la domanda minima che devi porre prima di procedere, e perché senza risposta
   non puoi andare avanti. Se non serve, scrivi «nessuno STOP» e di' perché.
```

### Riga aggiuntiva **solo** per le tre caselle «Oggi + dossier»

```text
In questa cartella trovi anche DOSSIER.md: è il foglio che si legge in apertura per sapere come si
lavora qui. Leggilo prima di iniziare.
```

---

## Parte 4 — I tre casi, da incollare verbatim

### `AR-1` — cartelle `1706-storica` · `1706-oggi` · `1706-dossier`

```text
Mario, il ristoratore, ci scrive: «Vorrei dire all'app quante persone al massimo posso servire.
Ho visto che c'è una casella per il giorno intero e una per ogni fascia oraria. Come le imposto
perché i clienti dal sito non prenotino oltre?»

Prepara il piano d'intervento.
```

### `AR-2` — cartelle `0508-storica` · `0508-oggi` · `0508-dossier`

```text
Mario, il ristoratore, chiede: «Dopo quanti minuti di ritardo l'app segna un tavolo come "in
ritardo"? Quanto dura in automatico un walk-in? E quanto tempo lascia fra un cliente e il
successivo? Posso cambiarli io dall'app?»

Rispondi, e prepara il piano se serve un intervento.
```

### `AR-3` — cartelle `0508-storica` · `0508-oggi` · `0508-dossier` · **sessione separata da `AR-2`**

```text
Mario, il ristoratore, racconta: «Ho eliminato una sala mentre c'erano ancora clienti seduti, e a
quei tavoli il turno è stato chiuso. Se elimino un singolo tavolo invece non succede. È un difetto?»

Prepara il piano d'intervento.
```

---

## Parte 5 — Dopo ogni esecuzione

1. Salva la risposta **integrale** in `docs/Sessioni di lavoro/27-08-26/AM-C0/risposte/` con nome
   opaco: `R01.md`, `R02.md`, … ⛔ Il nome **non** dice il caso né la condizione.
2. Tieni la corrispondenza `Rnn → caso × condizione` in un file separato, **non** consegnato al revisore.
3. Non correggere, non riassumere, non riformattare la risposta. Se è incompleta, è un dato.
4. Se una casella non parte per causa esterna, registrala `not_observed` **con il motivo**: resta nel
   denominatore, non si sostituisce con un caso simile e non si ripete oltre una volta.

⛔ **Nessun caso viene sostituito o modificato dopo aver visto un output. Nessuna risposta viene
corretta dopo averla letta.**
