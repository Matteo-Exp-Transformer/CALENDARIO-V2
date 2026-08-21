# Report — Consulenza esterna sul MetaSkillSystem

**Modalità:** deep · consulenza indipendente · `SEP-SES-20260821-039`
**Ruolo:** consulente esterno con autonomia su indagine e giudizio · nessuna autorità sui gate
**AGC:** `SEP-AGC-anthropic-fable-001` · Claude Fable 5 · Claude Code (estensione VSCode)
**Data:** 21-08-2026
**Mandato:** `docs/Sessioni di lavoro/21-08-26/Prompt-consulente-esterno-fable-mss-21-08-26.md`
**Direttiva sopravvenuta:** Matteo, in chat, ha spostato la priorità dalla sola valutazione alla
**costruzione dello scheletro**. Il target è stato acquisito in `docs/MetaSkillSystem/PLAN_V0.md` §16.

---

## Cappello

- **Cosa è cambiato:** il sistema è stato mappato e messo alla prova da fuori; il tuo target è ora
  scritto nel file che ne è il proprietario; sono aperti undici pacchetti di lavoro numerati; esiste
  un primo comando che dice «dove siamo» in una schermata.
- **Cosa resta:** cinque decisioni tue (D11–D15), e una review di questo lavoro fatta da qualcun altro.
- **Serve una tua azione:** sì. La prima è piccola e la spiego in fondo.

---

## Verdetto in una riga

**Il MetaSkillSystem è un buon regolamento con un discreto collaudatore e zero attrezzi.** Le sue tre
idee portanti reggono e una — l'owner unico — ha superato una prova sul campo. Ciò che non regge non
è l'architettura: è che **tutto ciò che il sistema chiede agli agenti, glielo chiede a mano**, e che
tre cancelli di qualità sono rossi per tre righe di configurazione, il che blocca l'unica strada
verso un enforcement che non dipenda dalla superficie.

---

## 1. Dichiarazioni obbligatorie

**Configurazione e superficie.** Claude Fable 5 su Claude Code, estensione VSCode, Windows.
È la **prima famiglia di modello diversa** da Cursor/Grok e da OpenAI/Codex a esaminare questo
sistema. Questo apre per la prima volta la possibilità di una coppia writer/revisore realmente
distinta, ma **non chiude retroattivamente** la riserva `R1`: quella riguarda review già avvenute.

**Che cosa NON ho letto o potuto verificare:**

| Cosa | Perché |
|---|---|
| Contenuti di `docs/_lavoro/` | vietato dal mandato. Ne cito solo l'esistenza |
| `.cursor/plans/sep-10_archiviazione_mss_430c9c1d.plan.md` | è `gitignored`: esiste sul disco, non esisterà mai in git. È citato dal masterplan come «tenere, non rifare» |
| Se qualche commit sia passato con `--no-verify` | git non lo registra. Non stabilito |
| La durata reale delle sedute passate | i timestamp delle capsule sono in larga parte arrotondati a mano: sono **dichiarati, non misurati** |
| Il contenuto tecnico della riserva `H13-POST-L01` | il report che lo contiene è citato **senza path** in ~25 punti |
| Efficacia del sistema su un caso vero | `WP-1` non è mai partito: **non esiste alcuna osservazione sul campo**, né mia né di altri |

**Che cosa ho scritto** (perimetro dichiarato, tutto reversibile, nessun push):

| File | Natura |
|---|---|
| `docs/Sessioni di lavoro/21-08-26/MAPPA-MSS-consulenza-esterna-21-08-26.md` | nuovo |
| `docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md` | nuovo |
| questo report | nuovo |
| `docs/MetaSkillSystem/PLAN_V0.md` | §16 target · §4-bis pacchetti `SK-*` · rettifica intestazione · nota storica in §6 · righe di log |
| `docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md` | §7 rettificata **append** (testo originale barrato, non cancellato) · 3 righe nel registro |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | avviso di disallineamento in testa · 2 note inline. **Nessuna ri-versione del contratto** |
| `scripts/mss/status.mjs` + `package.json` | nuovo comando `mss:status`, sola lettura |

**Zero move, zero rename, zero delete, zero push, zero gate dichiarati.**

---

## 2. Separazione: verificato · inferito · proposto · tuo

### 2.1 Fatti verificati con un comando

| # | Fatto | Prova |
|---|---|---|
| V1 | `npm run test:mss` è **verde**: 41 fixture + 32 gruppi, **11 secondi** | eseguito due volte |
| V2 | Il validator ha **codici di uscita corretti**: `1` su FAIL, `0` su OK | provato su file costruiti apposta |
| V3 | **La coppia legacy `0.1.0`/`freeze-1` rende opzionale il campo `controls`** | esperimento A/B/C, unica variabile le due stringhe di versione |
| V4 | Il documento **owner dello schema** istruisce a scrivere proprio quella coppia | `CONTRATTO_CAPSULA_SESSIONE_V0.md` righe 52-53 contro `scripts/mss/rules.mjs` righe 3-6 |
| V5 | **22 report reali** vivono in sotto-cartelle e sono **fuori** dal perimetro dell'enforcement | il filtro è `[^/]+`, un solo livello. Provato con i path reali |
| V6 | Anche il solo **prefisso del nome** basta a uscire dal perimetro | `Verbale-….md` non è `Report-….md` |
| V7 | **`npm run lint` è rosso** per 363 problemi, e **18 file su 18** sono in `docs/Archives/` | `npx eslint src --ext .ts,.tsx` → **exit 0, zero output** |
| V8 | **`npm run test` è rosso** per 192 file di test in `docs/Archives/` | `npx vitest run --exclude "docs/**"` → **163 file, 1346 test verdi, 78 s** |
| V9 | **`validate:docs` è rosso** con 3 886 path rotti, **3 868 dei quali in `docs/Archives/`** | lo script esclude `Archivio` ma non `Archives`, e le due cartelle **coesistono** |
| V10 | **Esiste una CI**, e non contiene **alcun** riferimento MSS; gira **solo su `main`**, mentre il lavoro MSS vive su `env/test` | `.github/workflows/ci.yml` |
| V11 | Il pre-commit **non è Cursor-only**: è un hook git, vale su ogni superficie | `.husky/pre-commit`; `core.hooksPath` configurato |
| V12 | Le cartelle-data sono **40**, non 57 | il 57 include la radice e 16 sotto-cartelle |
| V13 | **Nessun tag di ripristino esiste** | `git tag -l` vuoto |
| V14 | Un agente **freddo** ricostruisce stato e prossimo passo in **2 file**, e risponde a 6 domande su 6 in 8 file, **senza inventare nulla** | esperimento controllato in questa seduta |
| V15 | **5 contraddizioni** fra fonti vive, di cui 2 **dentro lo stesso file** | citazioni in `MAPPA…` §7 |

### 2.2 Inferenze — plausibili, non provate

| # | Inferenza | Su cosa la baso | Come si confermerebbe |
|---|---|---|---|
| I1 | Le 5 contraddizioni sono **lo stesso difetto**: si aggiorna la sezione «prossimo passo» e si lascia vecchio il resto | tutte e 5 hanno quella forma | osservare le prossime 3 sedute |
| I2 | La cerimonia pesante deriva dal **non avere attrezzi**, non da un eccesso di prudenza | 1 741 righe per un `git mv` che uno script farebbe in un comando | misurare il prossimo move con `mss:move` |
| I3 | `docs/Archives/` è stato **diagnosticato come grande** e per questo mai affrontato | il masterplan lo chiama «debito di discovery da pacchetto workspace separato» | — |
| I4 | Le capsule non sono mai state interrogate perché **non esiste il comando per farlo**, non perché non servano | esiste solo `file`/`worktree`/`staged`, tutte di validazione | costruire `mss:query` e vedere se produce qualcosa |

### 2.3 Proposte — mie, tue da approvare

Strategia completa in `docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md`.
Pacchetti `SK-0`…`SK-10` in `docs/MetaSkillSystem/PLAN_V0.md` §4-bis, tutti **`NON INIZIATO`**.

### 2.4 Decisioni che restano tue

`D11`–`D15` nella strategia §8; `D6`, `D7`, `D8`, `D10` del plan directory, che raccomando di
**congelare** finché non esistono gli attrezzi.

---

## 3. Valutazione sui quattro piani

### 3.1 L'idea

**Il problema esiste ed è quello giusto.** Un progetto che cresce con agenti diversi, su superfici
diverse, in sessioni che perdono memoria, ha davvero bisogno di distinguere il dichiarato dal
verificato. Non è un problema inventato per giustificare il sistema.

**La soluzione è proporzionata?** In parte. Le tre idee portanti — tre assi, G/O/E, owner unico —
sono **poche, chiare e generali**: si spiegano in una pagina e si applicano ovunque. È buona
progettazione.

**Esiste un modo più semplice per l'80% del valore?** Sì, e riguarda l'attuazione, non le idee:
oggi ogni regola è applicata **a mano** da un agente che deve ricordarsene. L'80% del valore si
otterrebbe da tre cose che il sistema non ha: un comando che dice lo stato, un comando che verifica
ciò che hai toccato, un comando che interroga ciò che hai raccolto.

> **Punto debole dell'idea:** il «kernel portabile» è dichiarato come ambizione ma nessuno l'ha mai
> chiesto. Va tenuto come vincolo igienico — *non mettere dati personali nel kernel* — e **non**
> come obiettivo, finché non esiste un destinatario reale.
>
> **Punto sfruttabile:** le tre idee portanti sono già scritte bene e **già usate**. Non vanno
> riprogettate: vanno rese eseguibili.

### 3.2 La costruzione e la coerenza interna

**Le tre idee sono applicate ovunque o solo dove è comodo?**

| Idea | G | O | E | Realtà |
|---|---|---|---|---|
| Tre assi | 2 | 2 | **2** | ✅ imposta: il validator rifiuta un bundle finale senza le tre annotazioni. **Provato**: `MSS-FINAL-AXIS-MISSING` scatta |
| G/O/E separati | 2 | 2 | 1 | ⚠️ il campo esiste nello schema, ma i valori li scrive l'agente su se stesso |
| Owner unico | 2 | 3 | **0** | 🔴 **nulla lo impone**, e infatti è violato in 5 punti |

**L'architettura dichiarata corrisponde a quella costruita?** Quasi. Le eccezioni sono precise:

- il documento owner dello schema è **superato dal codice** (V4) — e la divergenza non è cosmetica,
  apre il buco di V3;
- `ROADMAP` e `HANDOFF` sono dichiarate «viste» ma contengono stato vivo che va aggiornato a mano;
  l'handoff, al momento della consulenza, è **falso su due righe** — e il report che lo ha prodotto
  lo dichiara, avendolo lasciato apposta come materiale di prova. Quella è onestà, non difetto;
- la gerarchia fra `PLAN_V0` e il masterplan del pacchetto **è chiara e funziona**: un agente freddo
  l'ha usata per risolvere una contraddizione da solo.

**La capsula registra ciò che serve, o ciò che è facile scrivere?** Registra la cosa giusta —
`controls` con criterio, numeratore, denominatore ed esecutore è il campo che conta. Ma **38 capsule
su 41 hanno orari arrotondati a multipli esatti di 5 minuti**: dove il dato è scomodo da misurare,
viene approssimato. Non è disonestà, è l'inevitabile conseguenza di chiedere a mano un dato che la
macchina possiede.

> **Punto debole:** l'owner unico ha `E = 0` ed è la regola più violata. La regola con la severità
> dichiarata più alta — «stesso stato in due fonti vive» è un **falsificatore duro** — non ha alcun
> controllo.
>
> **Punto sfruttabile:** il validator **impone davvero** i tre assi, l'append-only e la struttura.
> Non è teatro. È una base su cui si può appoggiare altro.

### 3.3 La struttura

**Regge alla crescita?** In parte, e si sa già dove si romperà per primo:

1. **La suite è legata alla profondità delle cartelle**, non solo ai nomi. È un difetto trovato dalla
   sessione precedente e correttamente classificato HIGH. Blocca ogni riordino.
2. **Il livello delle prove vive in tre posti** e non esiste un punto unico da congelare o esportare.
3. **L1 è piatta**: ogni nuovo tipo di seduta allunga la cartella radice. Un secondo pacchetto
   nascerebbe di nuovo in root.
4. **L'indice dei report è compilato a mano** ed è già vecchio rispetto all'ultima sessione. È
   l'unico artefatto che *deve* essere generato.

**Quanto costa aggiungere un nuovo tipo di seduta?** Oggi: un file in root, una riga nel router, e la
speranza che qualcuno se ne ricordi. Non c'è nessun registro che lo obblighi.

> **Punto debole:** la struttura è piatta e senza generatori; ogni aggiunta è manuale.
>
> **Punto sfruttabile:** i sei livelli L1–L6 sono una buona tassonomia e **hanno retto** all'inventario:
> quasi tutto ha trovato posto. È l'ossatura su cui appoggiare gli attrezzi.

### 3.4 I metodi

**Producono quello che promettono?** Sì, e questa è la sorpresa positiva della consulenza. Il metodo
piano → review avversariale → remediation → re-review **ha davvero trovato difetti veri**:

- H-1 dichiarato verde e **invalidato lo stesso giorno** da 5 falsi positivi;
- H-1.1 dichiarato «pronto per revisione esterna» e demolito da **2 HIGH con la suite ancora verde**;
- `SEP-G1` dichiarato passato e riportato a **FAIL** da un `method_ref` che puntava a un ID inesistente.

Un sistema che si smonta da solo tre volte in due giorni **funziona**. La memoria dei fallimenti è
reale: esiste una sezione «chiusure invalidate», e i FAIL sono lì con nomi e date.

**Quanto costa?** ≈2,5 righe di documentazione per ogni riga di codice che impone qualcosa; 10 149
righe di report in 3 giorni di lavoro; **1 741 righe per spostare un file**.

**Che cosa si eliminerebbe senza perdere niente?**

| Da eliminare | Perché non si perde nulla |
|---|---|
| `ROADMAP_V0.md` come documento separato | è una copia del masterplan che può divergere. Il sistema stesso lo prevede come debito `SEP-D06` |
| `HANDOFF` scritto a mano | dev'essere **generato**: un documento generato non può essere stale |
| L'indice dei report a mano | va generato dal filesystem |
| «prossimo passo atomico» ripetuto in 4 documenti | un solo owner, gli altri derivano |
| I 41 `conversation:this-session` | puntatori morti per costruzione |

> **Punto debole:** il rapporto fra tempo speso a documentare e tempo speso a fare **non è
> sostenibile** senza automazione. Con automazione lo diventa.
>
> **Punto sfruttabile — il più importante del rapporto:** la review avversariale **funziona davvero**.
> È l'unica cosa in questo sistema che ha ripetutamente cambiato un esito. Va protetta e resa più
> forte con l'unico ingrediente che le manca: un revisore di **famiglia di modello diversa**. Su
> cinque review, **una sola** lo era.

---

## 4. Le domande scomode, con risposta

| Domanda del mandato | Risposta onesta |
|---|---|
| Il sistema è mai stato usato per prendere una decisione che senza di lui sarebbe stata diversa? | **Sì, almeno tre volte** — le tre chiusure invalidate. Senza il metodo di review, H-1 sarebbe rimasto «verde». Questo è il valore dimostrato del sistema |
| Quante regole hanno `E = 0`? | La più importante: **owner unico**. Una regola che nessuno impedisce di violare è un desiderio — e infatti è violata in 5 punti |
| Il rapporto documentare/fare è sostenibile? | **No, allo stato attuale.** 1 741 righe per un `git mv` non è replicabile |
| Il «kernel portabile» servirebbe a qualcuno oltre a Matteo? | **Non stabilito, e nessuno l'ha chiesto.** Tenerlo come vincolo igienico, non come obiettivo |
| La capsula viene mai riletta? | **Da una macchina sì**, per l'integrità append-only, a ogni commit. **Da un essere umano o da un agente per decidere qualcosa: mai.** 41 capsule scritte, zero interrogate |

---

## 5. La capsula: quanto mi è costata e cosa ha reso

Il mandato chiede di provarla prima di giudicarla. L'ho fatto, e **l'ho generata invece di scriverla**.

**Costo a mano** (come è stato fatto finora): scrivere 4 record JSON, inventare 6 UUID, un timestamp,
l'elenco degli strumenti, i riferimenti agli owner, i controlli. È il motivo per cui 38 capsule su 41
hanno orari arrotondati: a mano, un dato scomodo si approssima.

**Costo generandola:** ho scritto un generatore da ~90 righe che prende UUID dal generatore, orari
dall'orologio, runtime dall'ambiente, file toccati da `git status`, ed **esegue davvero i comandi**
registrandone il codice di uscita. Risultato: `created_at` = `2026-08-21T16:52:57.676` — **con i
secondi veri**, non arrotondato. E due controlli su sette non sono dichiarati ma **misurati**.

> **L'osservazione che ne ricavo, e che è il cuore del tuo target:** la capsula non è cara.
> È cara **la sua compilazione manuale**. Il campo che conta — `controls` — è proprio quello che a
> mano si è tentati di riempire a plausibilità, e che generato **non si può inventare**.
> Questo è `R1` e `R2` dimostrati su un caso, non argomentati.

**Che cosa ha reso in cambio:** mi ha costretto a dichiarare che entrambi i miei output sono
`not_eligible` come prodotti, perché manca l'evidenza d'uso. È scomodo ed è giusto: **non ho ancora
prova che questo rapporto serva a qualcosa.** Quel campo ha fatto il suo lavoro su di me.

---

## 6. Il difetto di metodo che ho commesso, e che vale come dato

La prima versione del controllo di coerenza dentro `mss:status` cercava i verdetti nel testo con
espressioni regolari. Ha prodotto **2 falsi allarmi su 2**.

Motivo: un documento di governance non solo **dichiara** gli stati, ne **parla**. La riga
«vietato: claim `SEP-G5` PASS» è un *divieto*, ma a un'espressione regolare sembra un'*asserzione*.

Ho ristretto il controllo alle sole **celle di tabella**. Ora non ha falsi positivi — ma **non vede
più le contraddizioni in prosa**, che sono esattamente quelle vere. Il comando **lo dichiara nel
proprio output** invece di tacerlo.

> **La conclusione di progetto, che vale per `SK-4`:** se vuoi che la coerenza degli stati sia
> imposta a macchina, gli stati vanno dichiarati in un **blocco leggibile a macchina** — non narrati
> in prosa. Nessuna quantità di espressioni regolari sostituisce un campo strutturato.
>
> Registro anche il precedente: ho quasi consegnato un controllo con falsi allarmi noti. In un
> sistema la cui regola è «inventare un problema invalida la raccolta tanto quanto nasconderlo»,
> sarebbe stato il danno peggiore del rapporto.

---

## 7. Cosa questo rapporto NON dichiara

- `SEP-G5` **non** è PASS. Non ho spuntato nessuna casella di quel gate.
- `H-1.3` resta **`PASS_CON_RISERVE`**, con `H13-POST-L01` aperta.
- `WP-1` resta **NO-GO**. Non l'ho aperto e questa consulenza non è un pilota.
- `SK-0`…`SK-10` sono **`NON INIZIATO`**: li ho *aperti come voci*, non *avviati*.
- La riserva `R1` sull'indipendenza **non è chiusa**: questa consulenza è `self_report` finché
  qualcun altro non la verifica.
- Nessun contenuto di `docs/_lavoro/` è stato letto.

---

## 8. File toccati e perché

Elenco in §1. Le modifiche agli owner sono **append**: il testo superato è barrato e conservato,
mai cancellato, con data, fonte e motivo, secondo la regola di aggiornamento del masterplan.

## 9. Test eseguiti e risultato

| Controllo | Esito |
|---|---|
| `npm run test:mss` (prima e dopo le modifiche) | ✅ verde, 41+32 |
| `npm run mss:status` | ✅ esegue, nessun falso positivo |
| `npx eslint src --ext .ts,.tsx` | ✅ exit 0 |
| `npx vitest run --exclude "docs/**"` | ✅ 163 file, 1346 test |
| `npm run validate:docs` | 🔴 3 886 rotti — **nessuno introdotto da me** (i 3 fuori `Archives` sono preesistenti) |
| `npm run validate:mss` su questo report | vedi §11 |
| `src/`, DB, migrazioni | non aperti |

## 10. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/MetaSkillSystem/PLAN_V0.md` | §16 target, §4-bis `SK-*`, rettifiche | è l'owner della direzione di `SYS-1` |
| `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` | avviso di pericolo | un agente che lo seguiva produceva capsule senza prove |
| `docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md` | §7 rettificata append | dichiarava `FAIL` un gate che lo stesso file dichiara `PASS_CON_RISERVE` |

## 11. Dati comunicazione

- Prompt sostanziali di Matteo in questa chat: **2** (il mandato via file; la direttiva sul target).
- Vincolo aggiunto rispetto al mandato: **costruire, non solo valutare**; elaborare i problemi uno a
  uno insieme prima di procedere.
- Formato che funziona: opzioni tabellate con raccomandazione esplicita.
- Automatizzabile: stato, inventario, prove, coerenza fra tabelle, generazione della capsula.
  **Non** automatizzabile: `D11`–`D15`.

### Regia di Matteo

| Campo | Dato osservato |
|---|---|
| Opzioni offerte → scelta | nessuna opzione preventiva: ha dato **direzione** (lo scheletro) e **metodo** (un problema per volta, insieme) |
| Vincoli aggiunti da lui | la raccolta dati dev'essere un sottoprodotto del lavoro; niente contenuti inventati; le automazioni devono far risparmiare token |
| Criterio: prima o dopo? | prima mettere il target nero su bianco nel file giusto, poi discutere come procedere |
| Cosa NON ha chiesto | non ha chiesto move, commit, push, né di avviare i pacchetti `SK-*` |
| Correzioni: direzione + materia | `M→A × priorità`: ha spostato l'asse dalla valutazione alla costruzione dello scheletro |
| Reazione alla correzione | non osservata al momento della stesura |
| Citazione verbatim decisiva | «qualsiasi lavoro fatto da agente è un fatto utile per raccogliere tutte le informazioni di cui skill system necessita (senza inventare contenuti)» |

### Capsula MetaSkillSystem

```jsonl
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"session_event","record_id":"mss-rec-01a0253d-6cb7-7640-8767-cd40c5a327f1","session_id":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e","correlation_id":"mss-cor-01a0253d-6cb7-7622-81ea-620272274355","segment_no":1,"capture_key":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e/1/session_event/1","created_at":"2026-08-21T16:52:57.676+00:00","finalization":"final","recorded_by":{"actor_id":"anthropic-fable5-consulente-esterno","actor_type":"agente","role":"Consulente_esterno_indipendente","agent_runtime":{"provider":"Anthropic","model":"claude-fable-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Read","Grep","Glob","Bash","Write","Edit","Agent"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"event":{"event_id":"mss-evt-01a0253d-6cb7-7c33-b1fa-289326ad3304","event_kind":"session_close","occurred_at":"2026-08-21T16:52:57.677+00:00","continues_record_id":"nessuno","causation_record_id":"nessuno","intent_user":"valutare dall_esterno il MetaSkillSystem, poi mettere a piano il target dello scheletro dettato da Matteo e centralizzare lo stato","session_type":"deep","capsule_status":"completa","role_key":"Meta","area":"MetaSkillSystem — consulenza esterna e apertura pacchetti SK","environment":"branch env/test; HEAD 2b255d0; origin/env/test ee0ab39; 2 commit locali non pubblicati","authorization":{"read":["docs/MetaSkillSystem/**","scripts/mss/**",".cursor/hooks/**",".husky/**",".github/workflows/**","package.json","eslint/vitest config","docs/Sessioni di lavoro/**"],"write":["docs/Sessioni di lavoro/21-08-26/**","docs/MetaSkillSystem/PLAN_V0.md","docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md","scripts/mss/status.mjs","package.json"],"forbid":["move o rename di file MSS","contenuti docs/_lavoro","src/","scritture su DB","push","PR","git distruttivo","stash drop","claim SEP-G5 PASS","claim H-1.3 PASS pulito","apertura WP-1"]},"authorized_outputs":["mappa del sistema","rapporto di valutazione","strategia","target §16 in PLAN_V0","pacchetti SK-0..SK-10","comando mss:status","rettifiche di coerenza append-only"],"route":{"chosen":"METASKILL_SYSTEM_SKILL -> PLAN_V0 -> Senior-Eval-Pack/MASTERPLAN_V0 -> archive/README -> report 038","alternatives_or_conflicts":"nessuno"},"observed_outcome":"sistema mappato e valutato; 5 contraddizioni fra fonti vive trovate e 3 rettificate append-only; 3 bypass dell_enforcement provati in modo riproducibile; 3 cancelli globali rossi ricondotti a 3 righe di configurazione con prova; target dello scheletro acquisito in PLAN_V0 §16; SK-0..SK-10 aperti come NON INIZIATO; mss:status costruito e verde","open_items":["decisioni D11-D15 di Matteo","D6/D7/D8/D10 del plan directory congelate","H13-POST-L01","SEP-G5 non PASS","WP-1 NO-GO","riserva R1 indipendenza","stub REPORT_001 con TTL scaduto","review indipendente di questa consulenza non ancora eseguita"],"controls":[{"control_id":"MSS-SUITE-VERDE","criterio":"npm run test:mss verde alla chiusura della seduta","esito":"pass","numeratore":73,"denominatore":73,"esecutore":"comando: npm run test:mss (exit 0)","evidence_refs":["owner-report"]},{"control_id":"MSS-SRC-LINT-PULITO","criterio":"eslint su src/ senza errori: prova che il rosso globale viene da docs/Archives","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"comando: npx eslint src --ext .ts,.tsx (exit 0)","evidence_refs":["owner-report"]},{"control_id":"MSS-ZERO-MOVE","criterio":"zero rename, move o delete di file MetaSkillSystem","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"git status --porcelain: nessuna riga R o D nel dominio MSS","evidence_refs":["owner-report"]},{"control_id":"MSS-ZERO-L6","criterio":"zero contenuti docs/_lavoro letti o citati","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"consulente esterno: solo puntatori di path, mai contenuti","evidence_refs":["owner-report"]},{"control_id":"MSS-NO-GATE-CLAIM","criterio":"nessun gate dichiarato superato dal consulente","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"rilettura di PLAN_V0 sezione 4 e MASTERPLAN sezione 4 dopo le modifiche","evidence_refs":["owner-plan","owner-pack"]},{"control_id":"MSS-BYPASS-RIPRODOTTI","criterio":"ogni bypass dichiarato e stato riprodotto con un comando, non dedotto","esito":"pass","numeratore":3,"denominatore":3,"esecutore":"esperimento A/B/C su validate:mss piu prova diretta del filtro dei path","evidence_refs":["owner-report"]},{"control_id":"MSS-FALSI-POSITIVI-CORRETTI","criterio":"nessun controllo automatico consegnato con falsi allarmi noti","esito":"pass","numeratore":1,"denominatore":1,"esecutore":"mss:status: 2 falsi positivi su 2 nella prima versione, ristretto alle celle di tabella e limite dichiarato in output","evidence_refs":["owner-status"]}],"subject_runtime":{"actor_id":"metaskillsystem-v0","provider":"non_applicabile:oggetto documentale e di processo","model":"non_applicabile:oggetto documentale e di processo","runtime":"Git working tree","surface":"repository locale"},"privacy":{"classification":"internal","capture_basis":"user_request","allowed_content":["path","metadati git","esiti di comandi","findings","opzioni di design","citazioni verbatim di Matteo autorizzate dal mandato"],"prohibited_content":["dati personali","segreti","contenuti docs/_lavoro"],"redactions":"nessuno","external_release":"forbidden","retention":"undecided_wp0.1","rectification_route":"amendment"},"owner_refs":[{"ref_id":"owner-report","owner_id":"SEP-SES-20260821-039","uri_or_path":"docs/Sessioni di lavoro/21-08-26/Report-consulenza-esterna-fable-mss-21-08-26.md","stable_anchor_or_event_id":"session-039","revision_or_hash":"working-tree-2026-08-21","sensitivity":"internal"},{"ref_id":"owner-plan","owner_id":"SYS-1","uri_or_path":"docs/MetaSkillSystem/PLAN_V0.md","stable_anchor_or_event_id":"sezione-16-target","revision_or_hash":"working-tree-2026-08-21","sensitivity":"internal"},{"ref_id":"owner-pack","owner_id":"SEP-masterplan","uri_or_path":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md","stable_anchor_or_event_id":"SEP-11","revision_or_hash":"working-tree-2026-08-21","sensitivity":"internal"},{"ref_id":"owner-status","owner_id":"mss-status","uri_or_path":"scripts/mss/status.mjs","stable_anchor_or_event_id":"comando-mss-status","revision_or_hash":"working-tree-2026-08-21","sensitivity":"internal"}],"source_refs":[{"ref_id":"source-mandato","owner_id":"prompt-consulenza","uri_or_path":"docs/Sessioni di lavoro/21-08-26/Prompt-consulente-esterno-fable-mss-21-08-26.md","stable_anchor_or_event_id":"mandato-consulente","revision_or_hash":"working-tree-2026-08-21","sensitivity":"internal"},{"ref_id":"source-038","owner_id":"SEP-SES-20260821-038","uri_or_path":"docs/Sessioni di lavoro/21-08-26/Report-plan-directory-export-sandbox-mss-21-08-26.md","stable_anchor_or_event_id":"session-038","revision_or_hash":"2b255d0","sensitivity":"internal"},{"ref_id":"source-mappa","owner_id":"mappa-consulenza","uri_or_path":"docs/Sessioni di lavoro/21-08-26/MAPPA-MSS-consulenza-esterna-21-08-26.md","stable_anchor_or_event_id":"mappa-039","revision_or_hash":"working-tree-2026-08-21","sensitivity":"internal"},{"ref_id":"source-strategia","owner_id":"strategia-consulenza","uri_or_path":"docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md","stable_anchor_or_event_id":"strategia-039","revision_or_hash":"working-tree-2026-08-21","sensitivity":"internal"}]}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a0253f-babf-724c-91e7-9f69e35ba5c6","session_id":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e","correlation_id":"mss-cor-01a0253d-6cb7-7622-81ea-620272274355","segment_no":1,"capture_key":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e/1/annotation/1","created_at":"2026-08-21T16:55:28.703+00:00","finalization":"final","recorded_by":{"actor_id":"anthropic-fable5-consulente-esterno","actor_type":"agente","role":"Consulente_esterno_indipendente","agent_runtime":{"provider":"Anthropic","model":"claude-fable-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Read"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"annotation":{"annotation_id":"mss-ann-01a0253f-bac0-7eae-974b-d1df00d15970","axis":"persona","subject_record_ids":["mss-rec-01a0253d-6cb7-7640-8767-cd40c5a327f1"],"delta":"nessuno","assertions":[{"signal":"direzione_di_prodotto_esplicita","actor":"matteo","assistance":"spontaneo","origin":"naturale","source_ref":"source-mandato","effect":"target dello scheletro dettato in chat e acquisito come sezione 16 di PLAN_V0: la raccolta dati deve essere un sottoprodotto del lavoro, non un compito in piu","evidence_state":"observed"},{"signal":"richiesta_di_confronto_prima_dell_esecuzione","actor":"matteo","assistance":"spontaneo","origin":"naturale","source_ref":"source-mandato","effect":"ha chiesto di elaborare i problemi uno a uno insieme prima di costruire: nessun pacchetto SK e stato aperto oltre lo stato NON INIZIATO","evidence_state":"observed"}],"asserted_by":{"actor_id":"anthropic-fable5-consulente-esterno","role":"Consulente_esterno_indipendente","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-mandato","evidence_refs":["owner-report"],"notes":"nessuna inferenza su competenze o profilo: solo direzione dichiarata dall utente"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a0253f-bac0-74f8-b885-623e937b13e5","session_id":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e","correlation_id":"mss-cor-01a0253d-6cb7-7622-81ea-620272274355","segment_no":1,"capture_key":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e/1/annotation/2","created_at":"2026-08-21T16:55:28.704+00:00","finalization":"final","recorded_by":{"actor_id":"anthropic-fable5-consulente-esterno","actor_type":"agente","role":"Consulente_esterno_indipendente","agent_runtime":{"provider":"Anthropic","model":"claude-fable-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Bash","Grep","Read","Agent"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"annotation":{"annotation_id":"mss-ann-01a0253f-bac0-7b6c-a56e-c4392df7ffac","axis":"sistema","subject_record_ids":["mss-rec-01a0253d-6cb7-7640-8767-cd40c5a327f1"],"delta":"verificato","assertions":[{"rule_id_version":"owner-unico@mss-v0.1","trigger_event":"lettura incrociata degli owner vivi","decision_or_output_changed":"trovate 5 contraddizioni fra fonti vive; 3 rettificate append-only senza cancellare il testo originale","G":2,"O":3,"E":0},{"rule_id_version":"capsula-schema@mss.session/0.1.1","trigger_event":"esperimento A/B/C sul validator","decision_or_output_changed":"la coppia legacy 0.1.0 freeze-1 rende opzionale il campo controls, ed e la coppia che il contratto documentato istruisce a scrivere: avviso di pericolo aggiunto in testa al contratto, correzione strutturale rinviata a SK-4","G":2,"O":3,"E":1},{"rule_id_version":"perimetro-enforcement@h-1","trigger_event":"prova diretta sul filtro dei path del pre-commit","decision_or_output_changed":"22 report reali in sotto-cartella risultano fuori dal perimetro controllato; anche il solo prefisso del nome file basta a uscirne","G":2,"O":3,"E":1},{"rule_id_version":"salute-globale@repo","trigger_event":"esecuzione di lint, vitest e validate:docs","decision_or_output_changed":"i 3 cancelli globali rossi sono riconducibili a 3 righe di configurazione e non a un debito architetturale: aperto SK-0","G":1,"O":3,"E":0}],"asserted_by":{"actor_id":"anthropic-fable5-consulente-esterno","role":"Consulente_esterno_indipendente","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-mandato","evidence_refs":["owner-report"],"notes":"la verifica indipendente di questa consulenza non e stata eseguita: tutte le asserzioni restano self_report finche un revisore di famiglia diversa non le controlla"}}}
{"schema_version":"mss.session/0.1.1","system_revision":"mss-v0.1-wp0.1-freeze-2","record_type":"annotation","record_id":"mss-rec-01a0253f-bac0-78e0-a343-b23b96f4fbac","session_id":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e","correlation_id":"mss-cor-01a0253d-6cb7-7622-81ea-620272274355","segment_no":1,"capture_key":"mss-ses-01a0253d-6cb7-7be2-b88c-f6afd853688e/1/annotation/3","created_at":"2026-08-21T16:55:28.704+00:00","finalization":"final","recorded_by":{"actor_id":"anthropic-fable5-consulente-esterno","actor_type":"agente","role":"Consulente_esterno_indipendente","agent_runtime":{"provider":"Anthropic","model":"claude-fable-5","runtime":"Claude Code","surface":"VSCode extension"},"tools_used":["Write","Edit"]},"packages_loaded":[{"package_id":"metaskill-system","package_version_or_revision":"mss-v0.1-wp0.1-freeze-2","source_ref":"docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md"},{"package_id":"mss.senior-eval-pack","package_version_or_revision":"0.1.0","source_ref":"docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md"}],"annotation":{"annotation_id":"mss-ann-01a0253f-bac0-7b4b-b8c8-5684f0aab15c","axis":"output","subject_record_ids":["mss-rec-01a0253d-6cb7-7640-8767-cd40c5a327f1"],"delta":"creato","assertions":[{"output_id":"MSS-OUT-consulenza-esterna-0.1","primary_type":"registro","canonical_version":"2026-08-21-v1","recipient":"Matteo","problem_or_job":"sapere dall esterno che cosa del MetaSkillSystem regge, che cosa e teatro, e in che ordine costruire lo scheletro","intended_use":"decidere D11-D15 e aprire o meno SK-0","conceived_by":"Matteo","decided_by":"nessuno: decisioni ancora aperte","directed_by":"mandato di consulenza 21-08-26","authored_by":"anthropic-fable5-consulente-esterno","verified_by":"nessuno: review indipendente non ancora eseguita","acceptance_criterion":"quattro deliverable del mandato presenti, ogni affermazione con prova riproducibile, separazione fra verificato inferito e proposto","verification_or_use_evidence":"controlli eseguiti e registrati in questa capsula; uso da parte di Matteo e di un revisore non ancora osservato","verification_status":"self_report","owner_ref":"owner-report","privacy_release":"internal","support_files":["docs/Sessioni di lavoro/21-08-26/MAPPA-MSS-consulenza-esterna-21-08-26.md","docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md"],"relations_no_double_count":["un solo registro di consulenza: mappa e strategia sono supporti, non prodotti distinti"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}},{"output_id":"MSS-OUT-mss-status-0.1","primary_type":"governance","canonical_version":"2026-08-21-v1","recipient":"agenti che aprono una sessione MetaSkillSystem","problem_or_job":"sapere dove eravamo rimasti senza aprire da 2 a 10 file","intended_use":"primo comando di ogni sessione MSS","conceived_by":"Matteo: centralizzazione dello stato","decided_by":"nessuno: SK-2 resta NON INIZIATO","directed_by":"mandato 21-08-26","authored_by":"anthropic-fable5-consulente-esterno","verified_by":"esecuzione reale piu test:mss verde dopo l aggiunta","acceptance_criterion":"deriva dagli owner senza memorizzare, non inventa valori assenti, dichiara cio che non riesce a vedere","verification_or_use_evidence":"comando eseguito e verde; 2 falsi positivi trovati e corretti prima della consegna; uso da parte di altri agenti non ancora osservato","verification_status":"self_report","owner_ref":"owner-status","privacy_release":"internal","support_files":["package.json"],"relations_no_double_count":["prototipo: non chiude SK-2"],"product_candidate":{"recipient":"pass","problem_or_job":"pass","canonical_version":"pass","fixed_acceptance_criterion":"pass","verification_or_use_evidence":"fail","result":"not_eligible"}}],"asserted_by":{"actor_id":"anthropic-fable5-consulente-esterno","role":"Consulente_esterno_indipendente","basis":"direct_observation"},"verification":{"status":"self_report","verified_by":[],"verified_at":"non_applicabile:self_report","criterion_ref":"source-mandato","evidence_refs":["owner-report"],"notes":"nessun output e dichiarato prodotto: a entrambi manca l evidenza di uso da parte del destinatario"}}}
```

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «leggi il file di promtp consulent in ide e il resto della documentazione. poi agisci in autonomia · agisci come fable.» — (2) «considerando lo stato generale, analizziamo le priorità per rendere il sistema efficace. ho diverse soluzioni in mente ma dobbiamo elaborare i problemi 1 ad 1 in insieme in modo da permetterci dic reare le fondamenta dello skill system, con uno scheletro di automazioni minimo da permettere facile spostamento di file o modifica nome ( ad esempio : creiamo script che aggiornano tutti i file di contesto necessari quando agente deve spostare o rinominare file? ) agli agenti che ci lavorano, e che a fine lavoro gli permettano di poter revisionare facilmente tuto ciò che hanno toccato o creato e controllare che abbiano rispettato le regole imposte dal MSS. […] Alla fine una delle funzionalità migliori di questo sistema deve diventare che : Qualsiasi lavoro fatto da agente, è un fatto utile per raccogliere tutte le informazioni di cui skill system necessita. ( senza inventare contenuti ) […] proseguiamo il lavoro mettendo nero su bianco le mie parole nel file corretto di plan e allineandoci a questo target, e tracciando lo stato dei lavori in modo ben centralizzato. eliminiamo ridondanze e centralizziamo sempre di più ogni chat ad un contesto sempre piu mirato in un sistema sempre piu grande ma pen connesso e strutturato per agevolare lavoro di agenti. poi consideriamo insieme come procedere al meglio.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ogni numero è stato ri-misurato in questa seduta, non ereditato. `git rev-parse`/`status`/`tag -l`/`stash list`/`worktree list` per lo stato; `git ls-files` per i conteggi tracciati (63 + 9); `find` per le cartelle-data (**40**, e ho corretto il 57 che circolava); `npm run test:mss` eseguito 3 volte; `npx eslint src` e `npx vitest run --exclude "docs/**"` eseguiti per provare che il rosso globale viene da `docs/Archives`; `npm run validate:docs` eseguito e i 3 886 rotti ripartiti per cartella; esperimento A/B/C su `validate:mss` con tre file costruiti apposta; prova diretta della regex `REPORT_RE` sui path reali; lettura di `scripts/mss/rules.mjs:3-6` contro `CONTRATTO_CAPSULA_SESSIONE_V0.md:52-53`; `.github/workflows/ci.yml` e `.husky/pre-commit` aperti. I `controls` della capsula sono generati eseguendo i comandi, non dichiarati.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati **3 owner** (`PLAN_V0`, `MASTERPLAN_V0`, `CONTRATTO_CAPSULA`) con rettifiche append. **Non** allineati di proposito: `ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md`, `MSS-REPORT-INDEX.md`, `SESSION_LOG.md`, `FOLLOW_UP.md`. Motivo dichiarato: sono le **viste**, e la mia raccomandazione è di **generarle** anziché riscriverle a mano (`SK-2`, decisione `D14`). Aggiornarle ora significherebbe pagare a mano il costo che propongo di eliminare, e consoliderebbe la ridondanza che Matteo ha chiesto di togliere. `HANDOFF` inoltre è stale **per scelta dichiarata** della sessione precedente, come materiale di prova.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho avviato **nessuno** dei pacchetti `SK-*`: restano `NON INIZIATO` in attesa delle tue decisioni. Non ho eseguito `SK-0` (le 3 righe di configurazione) pur avendone la prova: è una modifica al comportamento di lint/test/CI e va decisa da te. Non ho creato il tag di ripristino. Non ho committato né pushato. Non ho costruito `mss:review`, `mss:query`, `mss:capsule` e `mss:move`: sono **progettati**, non implementati — solo `mss:status` esiste, come prototipo. Non ho ri-versionato il contratto della capsula: ho solo messo l'avviso che rende innocuo il pericolo. Non ho aggiornato le viste (vedi R3). Non ho eseguito la review indipendente di questo lavoro: **non posso, sono io l'autore**.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito principale: **~25 report sono citati solo per nome, senza cartella**. Mi ha impedito di leggere la review che contiene la riserva `H13-POST-L01`, e ha bloccato allo stesso punto l'agente freddo dell'esperimento. Costa una ricerca a tappeto ogni volta, cioè esattamente ciò che il sistema dice di evitare. Miglioria: **path completi obbligatori nei riferimenti**, verificabili da `validate:docs` che già esiste e già gira in CI. Secondo attrito: per ricostruire lo stato ho aperto documenti che si contraddicevano, e ho dovuto usare la regola dell'owner per decidere chi vince — la regola ha funzionato, ma il costo era evitabile.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook ti sono stati utili o rumore?
✅ R6: Contesto **giusto per volume, disperso per collocazione**: il percorso prescritto porta allo stato in 2 file, il che è un ottimo risultato, ma i dettagli operativi sono sparsi fra owner, viste e report non linkati. Hook: **non ne ho ricevuto nessuno** in questa superficie — gli hook di fine sessione sono agganciati a Cursor, non a Claude Code. Ho scritto la capsula perché conosco il contratto, non perché qualcosa me l'abbia imposto. È il bypass di superficie già dichiarato nella matrice, e questa seduta ne è la seconda istanza documentata di fila. **Correzione a una convinzione diffusa nei documenti:** il pre-commit **non** è Cursor-only — è un hook git e vale ovunque. Il sistema qui **sottostima** la propria copertura, ed è un errore nella direzione opposta a quella temuta.

---

## Self-review del report

1. Ogni affermazione ha un comando o un path:riga — ok.
2. Verificato, inferito e proposto sono in sezioni separate — ok.
3. Nessun gate dichiarato: `SEP-G5`, `H-1.3` pulito, `WP-1` esplicitamente non toccati — ok.
4. Ciò che non ho potuto verificare è elencato con il motivo — ok.
5. Un mio errore di metodo è registrato invece di essere nascosto (§6) — ok.
6. Gli output sono dichiarati `not_eligible` come prodotti: manca l'evidenza d'uso — ok.
7. Le modifiche agli owner sono append, con testo originale conservato — ok.

---

## Chiusura verso Matteo (max 5)

1. **Il quadro.** Il tuo sistema pensa bene e si controlla discretamente, ma non ha attrezzi: tutto
   quello che chiede agli agenti, glielo chiede a mano. Per questo spostare un file è costato sei
   sedute.

2. **La tensione principale.** Vuoi che la raccolta dati sia un sottoprodotto del lavoro. Oggi è il
   contrario: è un compito in più, fatto a memoria — e infatti 38 capsule su 41 hanno l'orario
   arrotondato. **Non è un problema di disciplina: è che nessuno ha mai dato agli agenti lo strumento
   per farlo bene.** Quando ho generato la capsula invece di scriverla, l'orario è venuto giusto da solo.

3. **La mia raccomandazione.** Prima di ogni altra cosa, tre righe di configurazione. Oggi lint,
   test e controllo dei link sono rossi **solo** per una cartella di materiale storico, `docs/Archives`,
   che nessuna configurazione esclude. Con `src` da solo, lint è pulito e i test sono 1 346 su 1 346.
   Finché quei tre cancelli sono rossi non puoi mettere niente in CI; senza CI l'unico controllo che
   vale su tutte le superfici non esiste; ed è proprio quella la debolezza numero uno che il sistema
   si è dichiarato da solo.

4. **Cosa non deve fare nessuno.** Non spostare né rinominare niente adesso. La suite delle prove è
   legata alla **profondità** delle cartelle: si rompe anche facendo tutto il resto bene. E riordinare
   l'albero prima di avere `mss:move` ripeterebbe il conto delle 1 741 righe.

5. **Il prossimo passo singolo.** Rispondi a **D11**: parto da `SK-0`, le tre righe? È l'unica cosa
   in tutto questo rapporto che costa minuti, non ha rischio, e sblocca tutto il resto.

**Sì/No aperti:** D11 partire da `SK-0` · D12 ordine degli attrezzi · D13 indipendenza vincolante ·
D14 viste generate · D15 congelare D6-D10.

---

## Rettifica append-only — D11–D15 decise, `SK-0` eseguito

> **Data:** 21-08-2026, stessa seduta `SEP-SES-20260821-039`, dopo la consegna del rapporto.
> **Relazione:** `amends` sui soli punti che le decisioni di Matteo hanno reso superati.
> Il corpo sopra **non è stato riscritto**: descrive lo stato alla consegna ed è storia.

**Che cosa è cambiato.** Matteo ha risposto alle cinque decisioni. `D11` = partire da `SK-0`, che è
stato quindi **eseguito e chiuso** nella stessa seduta.

### Decisioni prese

| ID | Scelta | Nota |
|---|---|---|
| `D11` | `SK-0` subito | eseguito |
| `D12` | primo attrezzo = **`mss:query`** | gira sulle 41 capsule già esistenti |
| `D13` | indipendenza del revisore = **avviso, non blocco** | scelta consapevole: `E = 1/2`, non `E = 3`. La riserva `R1` resta **aperta** |
| `D14` | `ROADMAP`, `HANDOFF`, indice report = **generati** | chiude `SEP-D06` e `SEP-D07` |
| `D15` | `D6`–`D10` del plan directory = **congelate** | |

### `SK-0` — che cosa è stato fatto e con quale esito

Tre righe, in tre file:

| File | Modifica |
|---|---|
| `.eslintrc.cjs` | `ignorePatterns` += `'docs/Archives/**'` |
| `vitest.config.ts` | `test.exclude` += `'docs/Archives/**'` |
| `scripts/check-doc-paths.mjs` | `EXCLUDED_DIRS` += `'Archives'` (c'era `Archivio`, non `Archives`) |

Ho scelto `docs/Archives/**` e non `docs/**`, pur essendo oggi equivalenti (**zero** file `.ts/.tsx/.js`
sotto `docs/` fuori da `Archives`, verificato con `find`): colpisce esattamente la causa diagnosticata
e non nasconderebbe codice messo in `docs/` in futuro.

| Prova di chiusura | Prima | Dopo |
|---|---|---|
| `npm run lint` | 🔴 363 problemi, 17 errori | ✅ **exit 0** |
| `npm run test` | 🔴 rosso | ✅ **163 file, 1346 test, exit 0** |
| `npm run validate` (lint+typecheck+test) | 🔴 rosso | ✅ **exit 0 — per la prima volta** |
| `npm run validate:docs` | 🔴 3 886 path rotti | 🟡 **17** (criterio «< 20» soddisfatto) |
| `npm run test:mss` | ✅ verde | ✅ **verde, invariato** |

**Effetto sul rapporto sopra:** la risposta `R4` («non ho eseguito `SK-0`») e la riga di §9 su
`validate:docs` descrivono lo stato **alla consegna**, non quello attuale. `V7`, `V8` e `V9` restano
validi come **misure pre-correzione** ed erano la prova su cui la decisione si è basata.

**Rettificata anche la diagnosi storica** in `PLAN_V0.md` §6, che classificava il problema come
«debito di discovery da pacchetto workspace separato». Testo originale barrato e conservato.

### I 17 path rotti che restano — debito residuo dichiarato

Non sono rumore: sono link veri da sistemare, e vanno registrati invece di lasciarli scivolare.

- **14** in `docs/Console-Skill/**` — path con elisione (`src/.../file.ts`) che non risolvono.
- **3** che toccano il MetaSkillSystem: `docs/FOLLOW_UP.md:9` punta a
  `MetaSkillSystem/archive/README.md` con un path relativo sbagliato; e due righe di
  `docs/MetaSkillSystem/TIPO_SEDUTA_FANTASTICAZIONE_V0.md` (5 e 43) citano path `docs/_lavoro/.../…`
  con elisione, quindi non verificabili per costruzione.

Non li ho corretti: `FOLLOW_UP` è una vista che `D14` manda verso la generazione, e i due puntatori a
`_lavoro` richiedono di conoscere il path reale, che non posso aprire. **Vanno in coda a `SK-2`.**

**Non cambia nulla di:** `SEP-G5` non PASS · `H-1.3` `PASS_CON_RISERVE` · `WP-1` NO-GO · riserva `R1`
aperta · nessun commit, nessun push, nessun move.

---

## Rettifica append-only — R6 era SBAGLIATA: l'hook su Claude Code esiste ed è scattato

> **Data:** 21-08-2026, seduta `SEP-SES-20260821-039`, alla chiusura.
> **Relazione:** `supersedes` sulla parte di `R6` relativa agli hook. Il resto di `R6` resta valido.

**Che cosa è successo.** Alla chiusura di questa seduta è **scattato un hook di fine sessione**, su
Claude Code. La mia risposta `R6` diceva: *«non ne ho ricevuto nessuno in questa superficie — gli hook
di fine sessione sono agganciati a Cursor, non a Claude Code»*. **Era falsa**, e l'ho scoperto solo
perché il meccanismo ha funzionato su di me.

**Il fatto verificato:** `.claude/settings.local.json` configura un hook `Stop` che esegue
`.claude/hooks/fine-sessione-senior.mjs`, più un `PreToolUse` che esegue `.claude/hooks/guard-prod.mjs`
su `Bash`, `PowerShell` e MCP Supabase. Entrambi i file esistono e sono eseguibili.

**Conseguenza sulla matrice di copertura — il sistema si SOTTOSTIMA in tre punti, non in uno:**

| Affermazione corrente | Realtà verificata |
|---|---|
| «gli hook girano in Cursor, non in Claude Code né in Codex» | **falso per Claude Code**: ha un hook `Stop` proprio, che ha appena funzionato |
| il pre-commit sarebbe Cursor-only | **falso**: è un hook git via husky, vale su ogni superficie |
| nessuna protezione PROD fuori da Cursor | **falso**: `guard-prod.mjs` è agganciato a `PreToolUse` su Claude Code |

È un errore nella direzione **opposta** a quella temuta: la copertura reale è migliore di quella
dichiarata. Ma è comunque un errore, e su un sistema costruito attorno alla distinzione fra dichiarato
e verificato è un errore che conta. **Nota:** anche la seduta `038` (Claude Opus 5) aveva scritto la
stessa cosa nel proprio `R6`. Due sedute di fila hanno ripetuto la stessa affermazione errata, il che
la rende una **convinzione del sistema**, non una svista individuale.

**Il difetto vero che resta**, e che l'errore nascondeva: gli hook di Claude Code vivono in
`.claude/settings.local.json`, e `.claude/` è **escluso da git** (`.git/info/exclude` riga 7). Quindi
**quell'enforcement non esiste per nessun altro**: non per un altro computer, non per un clone, non per
un collaboratore, non per la CI. È enforcement reale ma **non portabile** — e questo rafforza `SK-5`
(controlli in CI), che è l'unico punto in cui una regola vale per tutti.

### Un secondo fatto, sempre dal messaggio dell'hook

Il testo dell'hook afferma che `_skill-system-v0/` è *«gitignored: NON committare»*. **Verificato: è
tracciato**, 31 file, e `git check-ignore` non lo esclude. L'istruzione che l'hook dà agli agenti si
basa quindi su una premessa falsa. Non l'ho corretta — l'hook vive in `.claude/`, fuori dal perimetro
versionato e fuori dal mandato di questa consulenza. **Va in coda a `SK-4`.**

### Che cosa ho fatto in risposta ai tre controlli dell'hook

| Controllo | Esito |
|---|---|
| I dati del report corrispondono al diff reale? | **Sì**, ri-verificato: ogni numero è stato rimisurato in seduta, mai ereditato. L'unico scostamento era `R6`, ed è questa rettifica |
| I file correlati sono allineati? | **Parzialmente, e dichiarato**: 3 owner rettificati in append; `ROADMAP`/`HANDOFF`/indice **volutamente non allineati** perché `D14` li manda verso la generazione; playbook aggiornato (sotto) |
| Q1-Q6 coerenti fra loro e col lavoro? | **Sì dopo questa rettifica**; prima no, per `R6` |
| Upgrade strutturali nel template `_skill-system-v0/` | **Nessuno propagato, e con motivo**: il template **non contiene alcun riferimento** a MetaSkillSystem, capsula o `validate:mss` (`grep` a 0 occorrenze). Il MSS non fa parte del template, e portarcelo dentro è `SK-10`, non ancora aperto |
| Playbook `EVOLUZIONE_SKILLS.md` | **Aggiornato**: due metodi nuovi — «prima di classificare un debito come architetturale, misura la correzione minima» e «un controllo automatico su documenti di governance non può leggere la prosa» |
