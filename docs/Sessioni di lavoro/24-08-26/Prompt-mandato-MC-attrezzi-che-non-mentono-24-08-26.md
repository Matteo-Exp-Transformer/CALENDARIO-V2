# Mandato `M-C` — attrezzi che non mentono (24-08-2026)

> Affidato dall'orchestratore a un esecutore **Opus**, revisore di **famiglia di modello diversa**.
> Copre `N1` + `N2` + `V1`. **Un solo report** (≤ 250 righe) e **una sola capsula**. Fonte:
> [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](../../MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md) §3 · §4.
>
> ⚠️ **Non aprire questo mandato finché `M-A`+`M-B` non è controverificato.** Un mandato per volta.

## 0. Che cosa NON devi leggere

Non aprire il corpus dei report. Ti bastano: questo mandato, il
[`MANUALE_OPERATIVO_MSS_V0.md`](../../MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md), il
[`CONTRATTO_CAPSULA_SESSIONE_V0.md`](../../MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md) §6, e i
file del perimetro. **Non** leggere `PLAN_V0.md` intero.

## 1. Censimento già fatto — parti da qui, non rifarlo

| Fatto | Riferimento |
|---|---|
| `capsule.mjs` **non importa nulla** da `core.mjs`: prende solo `ENUM` e le costanti di schema da `rules.mjs` | `scripts/mss/capsule.mjs:17-23` |
| Il validator è `validateMss(input, options)`, **non lancia eccezioni**: restituisce `{ ok, diagnostics, codes, denyCodes, warnCodes, summary }` | `scripts/mss/core.mjs:1444` |
| La serializzazione è `recordsToJsonl()`; la scrittura su report è `appendCapsuleToReport()`, chiamata da `runCapsule()` | `capsule.mjs:648`, `:673-687`, `:840` |
| Il controllo di completezza è `validateJudgments()`: restituisce una lista di errori, `buildCapsuleBundle` la trasforma in `Error` con `code = 'JUDGMENTS_INVALID'`, `runCapsule` esce **2** senza scrivere | `capsule.mjs:466-508`, `:548-554`, `:780-787` |
| `ENUM.verificationStatus` = `self_report · unverified · independently_verified · contradicted · not_applicable` | `scripts/mss/rules.mjs:107-113` |
| Il template mette `verified_by: []` su tutti e tre gli assi e `capsule.mjs` lo copia **as-is**: non lo popola mai | `capsule.mjs:389`, `:409`, `:449`, `:640` |
| `--role` (default `agente esecutore`) finisce in `recorded_by.role`; `query.mjs` ci cerca «reviewer»/«revisor» per riconoscere le sedute di revisione | `capsule.mjs:709`, `:575`; `query.mjs:609-621` |

## 2. `N1` — l'attrezzo non deve scrivere ciò che il validator rifiuta

Oggi `capsule.mjs` controlla che i tre giudizi **ci siano**, non che siano **validi**: un
`verification.status` fuori enum passa il controllo di completezza, viene scritto nel report, e
`validate:mss` sullo stesso file esce poi rosso. L'agente ha visto verde e ha lasciato una capsula
rotta sul disco.

**Fix richiesto, ed è `D18` alla lettera:** `capsule.mjs` **importa** `validateMss` da `core.mjs` e lo
esegue sul bundle **prima** di scrivere. Se `ok` è falso: exit non-zero, diagnostica leggibile su
stderr, e **nessuna scrittura** — né su stdout come capsula buona, né su `--append-to`.

Vincoli sul come:

- **Non riscrivere la regola.** Il validator esiste ed è esportato: si importa. Se ti accorgi che
  serve un pezzo di `core` non esportato, **esportalo** — non copiarlo.
- Riusa il canale d'errore che già esiste (`Error` con `code`/`details`, exit `2`, stderr): non
  inventare un secondo stile di fallimento accanto a `JUDGMENTS_INVALID`.
- L'ordine conta: **validare, poi scrivere**. Non «scrivere e poi avvisare».
- Attenzione a `--append-to`: la scrittura è append su un file esistente. Un fallimento a metà non
  deve lasciare un report con mezza capsula.

### Due riproduzioni reali, da usare come casi di prova

Entrambe sono state provocate il 24-08 chiudendo la seduta di controverifica **con l'attrezzo**, come
vuole il §6.6 del mandato orchestratore. Non sono ipotesi: sono due esecuzioni con l'esito registrato.

| # | Ingresso | Che cosa ha fatto `mss:capsule` | Che cosa ha detto `validate:mss` dopo |
|---|---|---|---|
| 1 | report che dichiara già una sezione «Capsula MetaSkillSystem», come prescrive `CHIUSURA_SESSIONE.md` §6-bis, e `--append-to` su quel file | exit **0**, capsula **scritta** in coda come **seconda** sezione | `MSS-PARSE-JSONL-AMBIGUOUS` — «Multiple MetaSkillSystem capsule sections found» |
| 2 | giudizi completi con `G: 3` (il dominio contrattuale ferma `G` a 2 — `core.mjs` riga 297) | exit **0**, capsula **scritta** | `MSS-SYSTEM-ASSERTION` — «G/O/E must be an integer in the contractual domain» |

Il caso 2 è `N1` come lo descrive la revisione. **Il caso 1 è nuovo e va trattato insieme**: la
guardia interna di `appendCapsuleToReport` («il file contiene già una capsula») e la regola del
validator («più sezioni capsula») **non riconoscono la stessa cosa**. È la stessa frattura — attrezzo
e validatore che non condividono la definizione — in un punto diverso del codice, e si chiude con lo
stesso fix: chi scrive **importa** la regola di chi valida.

Due test nuovi, con `N1` nel nome, uno per riga della tabella.

**Un terzo limite, emerso nella stessa seduta ma da NON risolvere in questo mandato.** `--check`
deduce l'esito dall'exit code, quindi un comando che non può fallire (`git status --short`) registra
un `pass` che non prova nulla, e nessun attrezzo se ne accorge. Un `controls[]` pieno di comandi
infallibili sembra una prova e non lo è. Va **segnalato nel report** come difetto aperto e lasciato a
Matteo: distinguere un controllo capace di fallire da uno vacuo richiede una decisione di
progettazione che non è nel perimetro di `M-C`.

**Il test esistente non copriva questo, e vale la pena capire perché:** la suite ha già
`capsule: giro completo — capsula generata passa validate:mss` e
`capsule: negativo — giudizio mancante esce rosso e non scrive report`. Il primo prova solo
l'ingresso **valido**; il secondo prova solo l'ingresso **incompleto**. Il buco è l'ingresso
**completo ma invalido**, e nessuno dei due lo vede. Il tuo test nuovo deve stare esattamente lì, e
nominare `N1`.

## 3. `N2` — la capsula non registra chi ha verificato

`verification.verified_by` è vuoto in **tutte** le annotazioni grezze del corpus, mentre lo stesso
comando (`npm run mss:query -- --verifica`) elenca **più sedute** il cui ruolo dichiarato è di
revisore. Le revisioni indipendenti si fanno davvero; il campo che dovrebbe provarle è vuoto.
Conseguenza: `R7` («la macchina si autorevisiona») è dichiarato, non dimostrabile.

**Prima di scrivere una riga, leggi questo — è il punto in cui il fix ovvio è quello sbagliato.**

La tentazione è far popolare `verified_by` alla seduta stessa. **Sarebbe un difetto peggiore di
quello che cura**, e violerebbe `R2` («il sistema non inventa nulla»): le annotazioni di una seduta
sono l'autodichiarazione di chi l'ha condotta. Un revisore che scrive `verified_by: [se stesso]`
sulle **proprie** annotazioni non ha verificato nessuno — ha solo firmato il proprio lavoro. Il
sistema passerebbe da «zero verifiche registrate» a «verifiche finte registrate», che è peggio:
il primo stato è onesto, il secondo mente al comando che lo interroga.

**La verifica è per costruzione un atto di un secondo attore su un record altrui**, e nel contratto
ha già la sua forma: l'`amendment` (§6). È esattamente ciò che ha fatto l'unico caso reale presente
nel corpus, che infatti compare nella vista effettiva e non in quella grezza.

**Fix richiesto:** rendere l'emissione di un `amendment` di verifica **un'operazione di prima
classe dell'attrezzo**, non un JSON scritto a mano. In pratica: un revisore deve poter dire, in un
comando, «ho verificato il record `X`, esito `independently_verified` (o `contradicted`), con questa
prova» e ottenere un amendment valido, già conforme al contratto §6.

Vincoli:

- L'attrezzo **chiede** il record bersaglio e l'esito; **non li deduce**. Nessun default che
  attribuisca una verifica a chi non l'ha dichiarata.
- Se `--role` contiene «reviewer»/«revisor» ma la seduta non emette alcun amendment di verifica,
  **avvisa** (non bloccare): è il segnale che la revisione è avvenuta e non è stata registrata. Un
  blocco qui produrrebbe amendment di comodo, che è di nuovo `R2`.
- L'amendment prodotto passa `validateMss` prima di essere scritto, come al §2.
- **Non toccare** i record `final` esistenti: la rettifica passa da amendment, sempre.
- Il template dei giudizi resta con `verified_by: []`. Non è un difetto: è la verità per una seduta
  che non ha verificato nessuno.

Test che nomini `N2`: un revisore emette l'amendment, e `npm run mss:query -- --verifica` mostra il
verificatore. E un test negativo: nessun amendment inventato quando il revisore non lo chiede.

## 4. `V1` — il generatore di viste

Il generatore non esiste (`D14`), e le viste (`ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md`) vengono
rettificate a mano: ogni rettifica **aggiunge uno strato** invece di sostituirlo. Il 24-08 in
`ROADMAP_V0.md` convivevano tre stati diversi dello stesso pacchetto. È stato tamponato rimuovendo
la vista stale, non risolto: tornerà alla prima seduta produttiva.

**Fix richiesto:** le viste si **generano** dall'owner (`PLAN_V0.md`) e dai comandi, non si
riscrivono. Una vista rigenerata **sostituisce** il proprio contenuto derivato; non lo affianca.

Vincoli:

- I numeri mobili nelle viste devono uscire **dal comando al momento della generazione**, o essere
  citati **come comando**. Mai congelati come valore (`V2`/`V3` sono nati così).
- Se una vista contiene anche prosa scritta a mano, il blocco generato deve essere **delimitato in
  modo riconoscibile**, così la rigenerazione non cancella il lavoro umano e l'umano non edita a mano
  il blocco derivato.
- Deve esistere un modo di **accorgersi** che una vista è stale senza rileggerla: un controllo che
  esce rosso se il derivato non corrisponde più all'owner. Senza questo, `V1` resta una fabbrica di
  debito anche col generatore in casa.
- `PLAN_V0.md` resta l'**owner**. Il generatore legge, non scrive nell'owner.

**Se il perimetro di `V1` si rivela più grande di `N1`+`N2` messi insieme — è probabile — fermati e
dillo prima di iniziarlo.** Meglio consegnare `N1`+`N2` provati e `V1` progettato, che tre cose a
metà. Questa è un'autorizzazione esplicita a spezzare il mandato **in consegna**, non a produrre
tre report: il report resta uno, con `V1` dichiarato non fatto e il motivo.

## 5. Perimetro dei file

`scripts/mss/capsule.mjs` · `scripts/mss/core.mjs` (solo per **esportare** ciò che serve) ·
`scripts/mss/rules.mjs` · `scripts/mss/query.mjs` (solo se `N2` lo richiede) ·
`docs/MetaSkillSystem/tests/tools/run.mjs` · il generatore nuovo per `V1` ·
`docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` (solo se il contratto va precisato).

## 6. Comandi da eseguire e registrare in `controls[]`

```
npm run test:mss
npm run test:mss:tools
npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule
npm run mss:query -- --verifica
npm run validate:docs
```

(dopo `M-B` esisterà anche `npm run validate:mss:all`, che li raccoglie)

## 7. STOP — vincoli non negoziabili

- **Nessun commit, nessun push.**
- **Nessuna riscrittura di record `final`**: la rettifica passa da `amendment`, sempre.
- **Nessun allentamento del validator** per far passare un test. Se un test non passa, o il codice è
  sbagliato o la regola è sbagliata: si decide quale, non si abbassa la soglia.
- **Nessuna seconda implementazione di una regola già scritta** (`D18`). Se non è esportata, si
  esporta.
- **Nessun `move`/rinomina di file** (`D15`).
- **Nessuna scrittura su database.**
- **Numeri mobili citati come comando, non come valore.**
- **Nessuna chiusura di pacchetto**: puoi dichiarare `PROVATO`, mai `CHIUSO`. `CHIUSO` è solo di Matteo.
