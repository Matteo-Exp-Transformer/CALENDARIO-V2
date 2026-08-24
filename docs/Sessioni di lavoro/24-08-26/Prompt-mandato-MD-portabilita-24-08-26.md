# Mandato `M-D` — portabilità (24-08-2026)

> Affidato dall'orchestratore a un esecutore **Opus**, revisore **Sonnet**. Copre `P1` (`SK-10`/`R8`).
> **Un solo report** (≤ 250 righe) e **una sola capsula**. Fonte:
> [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](../../MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md) §3 · §4.
>
> ⚠️ **Non aprire questo mandato finché `M-C` non è controverificato.** Un mandato per volta.
> (`M-C` è controverificato: [`Report-controverifica-mc-24-08-26.md`](Report-controverifica-mc-24-08-26.md).)

## 0. Che cosa NON devi leggere

Non aprire il corpus dei report. Ti bastano: questo mandato, il
[`MANUALE_OPERATIVO_MSS_V0.md`](../../MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md) e i file del
perimetro. **Non** leggere `PLAN_V0.md` intero.

## 1. Censimento già fatto — parti da qui, non rifarlo

Eseguito il 24-08 in parallelo a `M-C`, e **verificato dall'orchestratore**: tre affermazioni del
censimento erano false e sono state corrette prima di finire qui dentro. Quello che segue è il
residuo provato.

| Fatto | Come è stato provato |
|---|---|
| **Il motore ha zero dipendenze npm esterne** — solo `node:*` e import locali fra i sedici `.mjs` | ogni `from` in `scripts/mss/*.mjs` elencato e ispezionato |
| Il motore è `scripts/mss/**` (sedici `.mjs`) **più** `scripts/check-doc-paths.mjs`, che vive fuori da quella cartella | `validate:docs` lo lancia da lì |
| Il kit `_skill-system-v0/` contiene markdown, template e tre hook copiati. **Nessun pezzo di motore** | struttura elencata |
| `MANUALE_AVVIO.md` nel kit è una **procedura a sette passi con segnaposto**, non l'intervista che `R8` richiede | letto |
| Nessun file di bootstrap o intervista esiste altrove | cercato per nome in `_skill-system-v0/` e `docs/MetaSkillSystem/`, assente |
| `REPORT_PATH_RE` è definito in `adapter.mjs` e consumato da **cinque** file: `capsule.mjs`, `query.mjs`, `report-paths.mjs`, `validate-changed-reports.mjs`, `.cursor/hooks/fine-sessione-commit-check.mjs` | `grep` sull'albero |
| La catena del pre-commit attraversa **tre cartelle di tre strumenti diversi**: `.husky/pre-commit` → `.cursor/hooks/fine-sessione-commit-check.mjs` → `../../scripts/mss/adapter.mjs` | letti i tre file |
| `.claude/settings.local.json` e `mcp.json` **non** sono tracciati, ed è voluto (`A4`, con test che lo asserisce) | `git ls-files .claude/` |

### I path cablati — è qui che sta tutto il costo di `R8`

| Dove | Che cosa presuppone |
|---|---|
| `adapter.mjs:13` (`REPORT_PATH_RE`) | la cartella si chiama `docs/Sessioni di lavoro/` e i file `Report-*.md` / `Verbale-*.md` |
| `adapter.mjs:16-17` | fixture in `docs/MetaSkillSystem/fixtures/v0.1` |
| `query.mjs:30` | `const SESSIONI = 'docs/Sessioni di lavoro'` |
| `git-adapter.mjs:107` | stessa cartella, in un array di discovery |
| `parse.mjs:14-15` | un report specifico inchiodato **per sha256** — è l'eccezione storica, **voluta**, non «da aggiustare» |
| `status.mjs` | gli owner si chiamano `PLAN_V0.md` e `Senior-Eval-Pack/MASTERPLAN_V0.md` |
| `guard-prod.mjs` (Claude e Cursor) | i due ref Supabase di *questo* progetto |
| gli hook di fine sessione | `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` |

## 2. Che cosa deve diventare vero

`R8` dice: *«il bootstrap in una repo nuova è una procedura»*, e la sua prova è **un agente freddo che
installa e chiude una seduta in una repo vergine**. Oggi `R8` è al 15%.

Il fatto che il motore non abbia dipendenze esterne significa che **l'export non è un problema di
packaging**: è una copia di cartella. Quindi non perdere tempo su bundler, workspace o pubblicazione
npm. **Il lavoro è tutto nel rendere parametrico ciò che oggi è cablato**, e nel provarlo.

### 2.1 Parametrizzare, senza rompere i cinque consumatori

`REPORT_PATH_RE` è il pezzo più delicato del motore: cinque consumatori, uno dei quali è un hook di
un altro strumento. `PLAN_V0.md` §15 impone che **ogni modifica futura dichiari prima l'intero
elenco** — l'elenco è in §1 qui sopra, quindi il vincolo è soddisfatto: puoi toccarlo, dichiarando
nel report che cosa cambia per ciascuno dei cinque.

La forma che ti chiedo di valutare è **una sola fonte di configurazione** letta dal motore (path
delle sessioni, path degli owner, path delle fixture), con **default identici a oggi** perché questa
repo non deve cambiare comportamento. Se scegli una forma diversa, motivala.

Vincoli:

- **Default = comportamento attuale.** Dopo il tuo lavoro `npm run validate` in questa repo deve
  restare verde senza che nessuno configuri nulla. Se serve un file di config perché la repo attuale
  funzioni, hai sbagliato disegno.
- **Non toccare l'eccezione storica per sha256** in `parse.mjs`: è voluta.
- **Non unificare le tre copie di `guard-prod`.** Divergono legittimamente e quella del kit deve
  restare autonoma proprio per `R8` (è la decisione di `A2`).
- `D18` vale come sempre: se serve una regola già scritta, **importala**; se non è esportata,
  esportala.

### 2.2 L'intervista di bootstrap

`MANUALE_AVVIO.md` è una procedura con segnaposto: chiede all'umano di riempire `{{…}}` a mano. `R8`
chiede una **procedura**, e il manuale c'è; ciò che manca è **il modo di sapere se è andata bene**.

Costruisci la **checklist di primo run**: una sequenza di comandi che, eseguita in una repo appena
inizializzata, dice se il motore è installato correttamente. I candidati sono già noti:
`test:mss`, `test:mss:tools`, `validate:docs`, `mss:status`, `mss:query -- --verifica`.

Vincolo: la checklist deve **fallire in modo leggibile** quando qualcosa manca, non uscire verde per
assenza di dati. Un `mss:query` su un corpus vuoto che dice «zero record, tutto ok» è un falso verde
ed è esattamente il difetto che `R2` vieta.

### 2.3 La prova

**Non dichiarare `R8` soddisfatto senza la prova**, e la prova è una sola: una repo vergine, senza
questo albero `docs/MetaSkillSystem`, in cui il kit viene installato e una seduta viene chiusa.

Falla in una cartella temporanea fuori dal repo, con `git init`. Registra i comandi e gli esiti reali
nei `controls[]`. **Se non arrivi alla prova, dillo**: meglio l'export parametrico provato e il
bootstrap dichiarato non provato, che entrambi a metà. Vale l'autorizzazione a spezzare in consegna
che aveva `M-C`, con lo stesso vincolo: **il report resta uno**.

## 3. Perimetro dei file

`scripts/mss/**` · `scripts/check-doc-paths.mjs` · `_skill-system-v0/**` ·
`docs/MetaSkillSystem/tests/**` · `package.json` (solo per gli script del motore) ·
`docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md` §7 (è la sezione che descrive `P2B`).

**Fuori perimetro:** `PLAN_V0.md` (owner di stato), `src/**`, migrazioni, qualunque cosa Supabase.

## 4. Comandi da eseguire e registrare in `controls[]`

```
npm run validate:mss:all
npm run validate
npm run mss:status
npm run mss:query -- --verifica
```

⚠️ **Attenzione a `N3`, difetto aperto:** `--check` **non trasporta un path con spazi**, e la cartella
si chiama `docs/Sessioni di lavoro/`. Un controllo che valida il tuo report registra un `fail` che
parla della propria sintassi, non del report. Registra nei `controls[]` solo comandi **senza path con
spazi**, ed esegui a mano quelli che ne hanno, riportandone l'esito nella prosa del report.

## 5. STOP — vincoli non negoziabili

- **Nessun commit, nessun push** senza sì esplicito di Matteo.
- **Nessun `move` o rinomina di file** (`D15`): `mss:move` non esiste ancora, è `M-E`. Copiare nel kit
  non è un move — copiare si può, spostare no.
- **Nessuna riscrittura di record `final`**: la rettifica passa da `amendment`, sempre.
- **Nessun allentamento del validator** per far passare un test.
- **Nessuna seconda implementazione di una regola già scritta** (`D18`).
- **Nessuna scrittura su database.** Verifica l'ambiente prima di qualunque operazione Supabase; se è
  PROD, fermati e chiedi.
- **Numeri mobili citati come comando**, mai come valore.
- **Nessuna chiusura di pacchetto**: puoi dichiarare `PROVATO`, mai `CHIUSO`.

## 6. Come verrai controverificato

Alla consegna l'orchestratore **non leggerà il report per fidarsene: rifarà**. In particolare:

1. `git diff` reale, e perimetro.
2. **`npm run validate` in questa repo, senza configurare nulla.** Se è rosso, il disegno è sbagliato.
3. Per ogni difetto dichiarato chiuso, **il test che lo nomina** — `grep` sull'albero dei test, poi
   lettura delle asserzioni per escludere che sia vacuo.
4. Se dichiari la prova di §2.3 fatta, **la rifarà in una cartella vergine sua**.
