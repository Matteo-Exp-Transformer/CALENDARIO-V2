# Prompt — fix mirato SK-7: privacy e coerenza del report

Sei l'agente esecutore di una rettifica **strettamente limitata a SK-7**. Il generatore e le sue
prove funzionali sono verdi; non riscrivere l'architettura e non dichiarare il pacchetto chiuso.

## Esito della revisione da cui partire

Il report proprietario passa `validate:mss --require-capsule`, e i due controlli negativi registrati
come `fail` sono corretti: conservano codici di uscita reali come chiede il mandato. Il report non è
però approvabile nella forma attuale per due motivi:

1. il template dei giudizi, il file giudizi e il record finale citano letteralmente un percorso
   privato che il mandato vieta di riportare nei record;
2. la tabella dei controlli dichiara `test:mss` come **42 fixture + 33 gruppi** e
   `validate:docs` come **939** path, mentre la misura ripetuta dalla revisione è
   **42 fixture + 38 gruppi** e **940 path controllati, 0 rotti, 26 allowlist**.

Non riprodurre il percorso privato in nuovi report, prompt, commenti o messaggi di commit.

## Modifica richiesta

- In `scripts/mss/capsule.mjs`, sostituisci nel template la citazione concreta con una categoria
  semantica generica, per esempio `materiale privato non registrabile`.
- Applica la stessa rettifica al file giudizi SK-7 e al report proprietario. Trattala come rettifica
  privacy: non cambiare UUID, timestamp o fatti non coinvolti; documenta l'intervento senza
  ricopiare il literal rimosso. Se serve un record `amendment`, usa la semantica canonica MSS.
- Correggi nel report solo i due conteggi incoerenti con le misure sopra. Mantieni distinti i
  controlli positivi dalle prove negative attese; non trasformare i due `fail` in `pass`.
- Aggiungi test automatici che dimostrino che:
  1. `--template` non emette riferimenti concreti a materiale privato;
  2. nomi generici di categorie vietate non vengono scambiati per valori segreti;
  3. un valore sentinella inserito in una variabile d'ambiente non autorizzata non compare nel
     JSONL. Usa solo valori finti e non stampare mai segreti reali.
- Mantieni `SK-7` **APERTO** in `PLAN_V0.md`: la chiusura `M3` resta esclusivamente di Matteo.

## Perimetro e divieti

- Non toccare `src/**`, Supabase, `scripts/mss/query.mjs`, il validator o `REPORT_PATH_RE`.
- Non ampliare il task a refactor del generatore.
- Non riscrivere la storia Git. Se la rimozione dalla storia fosse ritenuta necessaria, fermati e
  chiedi autorizzazione esplicita a Matteo.
- Non fare commit o push senza una nuova autorizzazione esplicita.

## Prove obbligatorie

Esegui e riporta gli exit code reali:

```powershell
npm run test:mss:tools
npm run test:mss
npm run validate:docs
npm run lint:scripts
npm run validate
npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/23-08-26/Report-sk7-mss-capsule-23-08-26.md" --kind report --require-capsule
git diff --check
```

Consegna una rettifica breve con tabella prima/dopo e conclusione binaria: `SK-7 approvabile per M3`
oppure `SK-7 ancora non approvabile`, senza dichiararlo `CHIUSO`.
