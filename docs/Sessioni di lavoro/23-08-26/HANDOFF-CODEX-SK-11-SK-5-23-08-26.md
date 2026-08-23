# Handoff vivo — CODEX `SK-11` → `SK-5`

> Tipo della prossima chat: **scrittura/modifica MetaSkillSystem**
> Modalità: **deep**
> Stato: **ciclo tecnico SK-11 → SK-5 completato e approvato con prove; chiusura riservata a Matteo**
> Branch: `env/test`

## Riepilogo per Matteo

| Ciclo corrente | Stato |
|---|---|
| Piano condiviso | ✅ scritto |
| `G1`–`G4` | ✅ autorizzate |
| `SK-11` implementazione | ✅ A1–A4 completate e file rilasciati |
| `SK-11` revisione/rosso | ✅ certificata: rosso 1/9, ripristino 9/9, hash identico |
| `SK-5` CI | ✅ implementata; rosso locale exit 1 e verde post-cleanup exit 0 |
| Report/capsula | ✅ completi; `validate:mss OK`; provenienza `self_report` |
| Commit/push | ⬜ non autorizzati |

| Test / QA | Esito attuale |
|---|---|
| Lint `.mjs` diagnostico | baseline KO 20; dopo A4 lint globale exit 0 e zero warning |
| Suite H-1 | exit 0 a worktree stabile: 42 fixture + 32 gruppi dopo SK-4 E2 |
| Test attrezzi | exit 0: 9/9 test |
| CI con capsula rotta | exit 1 con `MSS-VITAL-MISSING` + path; post-cleanup exit 0 no-report |

| Follow-up collegato | Stato | Nota |
|---|---|---|
| `FU-LOG-1` | Fatto, governance viva | zero `console.*` negli script; riusare il logger CLI |
| Nuovi FU del cantiere | nessuno | aprirli solo per debiti realmente differiti |

## Decisioni chiuse e autorità

- `G1`: autorizzato `scripts/sync-to-prenotazen.mjs` per `no-regex-spaces`.
- `G2`: `test:mss:tools` entra in `npm run validate` e resta comando autonomo.
- `G3`: autorizzata la nuova riga `SK-11` nel §4-bis di `PLAN_V0.md`.
- `G4`: autorizzato `scripts/_test-email-once.mjs`; eliminare i `console.*` tramite logger
  esistente, senza spegnere la regola globalmente.
- Autorizzata l'esecuzione sequenziale `SK-11` → `SK-5` quando il prompt d'avvio viene incollato.
- Non autorizzati: push, DB/PROD, file fuori perimetro, riscrittura di capsule final.

## Owner e documenti da usare

- Piano operativo unico:
  `docs/Sessioni di lavoro/23-08-26/PLAN-CODEX-SK-11-SK-5-23-08-26.md`
- Prompt esecutore:
  `docs/Sessioni di lavoro/23-08-26/Prompt-avvio-CODEX-SK-11-SK-5-23-08-26.md`
- Stato autorevole SYS-1: `docs/MetaSkillSystem/PLAN_V0.md`
- Contratto dati: `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` §5-6
- Semantica amendment: `scripts/mss/core.mjs::applyAmendmentsView()`
- Factory test da riusare: `docs/MetaSkillSystem/tests/h1/fixture-factory.mjs`
- Governance logger script: `docs/FOLLOW_UP.md` → `FU-LOG-1`

Il coordinatore è l'unico che aggiorna il registro stato nel piano e questo handoff. Gli esecutori
aggiornano la propria sezione nel report unico, non creano report paralleli.

## Stato tecnico osservato durante la preparazione

- `query.mjs` delega già gli amendment a `core.mjs`; non duplicare.
- `query.mjs` e `status.mjs` eseguono al caricamento e vanno resi importabili prima dei test.
- `npm run lint` ignora oggi gli `.mjs` perché usa `--ext ts,tsx` e `.eslintrc.cjs` ignora `*.mjs`.
- Lint diagnostico Node sugli script: **20 problemi**:
  - 16 warning `no-console` in `scripts/_test-email-once.mjs`;
  - 2 import inutilizzati in `scripts/mss/query.mjs`;
  - 1 import inutilizzato in `scripts/mss/status.mjs`;
  - 1 errore `no-regex-spaces` in `scripts/sync-to-prenotazen.mjs`.
- `SK-11` è citato nel §15 di `PLAN_V0.md` ma manca dalla tabella §4-bis.
- `.github/workflows/ci.yml` gira solo su `main` e non contiene passi MSS.

## Prossimo task esatto

Nessun altro task tecnico è autorizzato in questo ciclo. Matteo può ora decidere se dichiarare
`SK-11` e `SK-5` chiuse e, con un nuovo sì esplicito, autorizzare commit e push. Le prove complete
sono nel report unico; non riaprire A1–A5 o B1–B2 senza un difetto nuovo e riproducibile.

## Gate di handoff `SK-11` → `SK-5`

Gate superato prima dell'assegnazione di `SK-5`: check 6/6, lint zero warning, H-1 `42 + 32`, tools
`9/9`, controprova rossa `1/9` con hash ripristinato, `validate` exit 0 e perimetro verificato.

## Aggiornamento obbligatorio dopo ogni agente

Sostituire lo stato in cima e aggiungere una voce breve:

```text
Data/ora:
Agente/fase:
File posseduti e poi rilasciati:
Comandi eseguiti con exit:
Difetti o deviazioni trovati:
Stato vero adesso:
Prossimo agente e suo unico gate:
```

Non trasformare questo handoff in cronologia lunga: le prove complete vivono nel report unico; qui
restano solo stato, autorità e prossimo passo.

## Ultimo passaggio

Data/ora: 23-08-26, Fase 0
Agente/fase: Codex esecutore SK-11 / baseline
File posseduti e poi rilasciati: nessuno modificato nella baseline
Comandi eseguiti con exit: `npm run lint` 0; lint `.mjs` 1 con 20 problemi attesi; `npm run test:mss` 0 a worktree stabile; `mss:query -- --verifica` 0; `mss:status` 0
Difetti o deviazioni trovati: prima run H-1 invalidata dalla comparsa concorrente di un nuovo file sessione non tracciato; ripetuta correttamente a stato stabile
Stato vero adesso: A1–A4 in esecuzione, SK-5 bloccata
Prossimo agente e suo unico gate: esecutore SK-11 → consegna tutti i verdi tecnici; poi revisore A5

Data/ora: 23-08-26, handoff A1–A4 → A5
Agente/fase: Codex esecutore SK-11 / implementazione
File posseduti e poi rilasciati: configurazione lint e package scripts; due CLI MSS; utility runtime; suite tools; due script autorizzati; riga S11; sezione esecutore report
Comandi eseguiti con exit: `node --check` 6/6 exit 0; `npm run lint` 0; `npm run test:mss` 0 (`42 + 32`); `npm run test:mss:tools` 0 (`9`); `npm run validate` 0
Difetti o deviazioni trovati: collisione temporanea con SK-4 E1 su query, fermata e risolta preservando il filtro condiviso; nessuna mutazione residua
Stato vero adesso: implementazione rilasciata, A5 in corso, SK-5 bloccata
Prossimo agente e suo unico gate: revisore SK-11 → revisione critica + rosso exit 1 + ripristino verde exit 0 + diff invariato

Data/ora: 23-08-26, chiusura tecnica Fase C
Agente/fase: Codex revisore finale + coordinatore
File posseduti e poi rilasciati: sezione revisore del report; righe owner `SK-11`/`SK-5`; piano e handoff
Comandi eseguiti con exit: check 7/7 exit 0; lint 0; H-1 0 (`42 + 32`); tools 0 (`9/9`); validate 0; validate:docs 1 baseline 17; CI isolata rosso 1 e verde 0; validate:mss report 0
Difetti o deviazioni trovati: nessun difetto bloccante; provenienza stessa famiglia OpenAI = `self_report`; temp rimosso
Stato vero adesso: ciclo tecnico completo con prove; nessun commit/push; nessuna skill dichiarata `CHIUSA`
Prossimo agente e suo unico gate: nessuno; decisione di Matteo su chiusura e futura autorizzazione commit/push
