# Scheda R1 — chiusura Meta senza retry

> Promemoria operativo di una pagina. Non sostituisce
> [`CHIUSURA_SESSIONE.md`](../Comunicazione-Skill/CHIUSURA_SESSIONE.md): il report e Q1–Q6 si
> preparano con quella fonte; qui si evita soltanto di sbagliare capsula, controlli e verifiche.

## Prima del comando

1. Lavora dalla root del repository e prepara il report completo **senza** intestazione capsula.
2. Crea i giudizi con `npm run mss:capsule -- --template-r1`.
3. Nel JSON conserva soltanto le tre chiavi `persona`, `sistema`, `output`. Se `delta` è `nessuno`,
   usa `assertions: []`; negli altri casi scrivi almeno un'asserzione osservabile.
4. Scegli controlli capaci di fallire. La forma canonica è `--check "ID=>comando"`; se l'esito
   atteso non è zero, aggiungi subito dopo `--check-expect <exit>`.
5. Per una verifica usa `--verify "record_id|esito|evidence_ref|motivo"`: `esito` è soltanto
   `independently_verified` o `contradicted`; `evidence_ref` è un **path completo dalla root e
   risolvibile**, non il solo nome file.

## Unico append della capsula

```powershell
npm run mss:capsule -- `
  --model "<modello>" `
  --actor-id "<attore-univoco>" `
  --role "<ruolo>" `
  --judgments "docs/Sessioni di lavoro/GG-MM-AA/judgments-….json" `
  --check "TEST=>npm run test:mss:tools" `
  --verify "mss-rec-…|independently_verified|docs/Sessioni di lavoro/GG-MM-AA/Report-….md|<motivo osservabile>" `
  --append-to "docs/Sessioni di lavoro/GG-MM-AA/Report-….md"
```

Il generatore crea UUID, tempo, runtime, Git, `source_refs`, `controls` e gli `evidence_refs` della
verifica. Non completarli a mano. Su Windows, nei comandi `--check`, quota i path con spazi usando
virgolette doppie, mai singole.

## Gate immediato

```powershell
npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/GG-MM-AA/Report-….md" --kind report --require-capsule
```

Poi esegui la suite richiesta dal mandato e `git diff --check`.

## STOP anti-errore

- Mai scrivere o incollare a mano `## Capsula MetaSkillSystem`.
- Mai usare `:` al posto di `=>` nei nuovi `--check`; `--verify` usa invece `|`.
- Mai passare un basename a `--verify`: il riferimento deve risolversi dalla root.
- Mai rieseguire `--append-to` sullo stesso report: una capsula già presente viene rifiutata.
- Mai inventare fatti di busta o modificare `R1_MODE_CONSTANTS` per chiudere una seduta.
- Mai riscrivere record `final`: una rettifica o verifica successiva è un `amendment` via `--verify`.
