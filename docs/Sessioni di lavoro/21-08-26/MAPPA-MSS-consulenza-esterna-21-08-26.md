# Mappa del MetaSkillSystem — stato reale al 21-08-2026

> **Che cos'è questo file.** La fotografia del sistema fatta da fuori, da un consulente che non
> l'ha costruito. Serve a un agente che apre il repository e deve capire **dove si trova** prima di
> toccare qualcosa.
>
> **Che cosa NON è.** Non è un owner di stato. Se una riga qui contraddice `docs/MetaSkillSystem/PLAN_V0.md`
> (stato globale) o `docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md` (stato del pacchetto),
> **vincono loro**. Questo file è una vista, e le viste invecchiano.
>
> **Come è stata fatta.** Ogni numero qui sotto è stato ri-misurato in questa seduta con un comando,
> non ripreso da un documento. Dove ho ereditato un numero senza poterlo verificare, lo dico.

---

## 1. Il sistema in un paragrafo

Nello stesso repository convivono due cose. La prima è **PrenotaZen**, un'applicazione di prenotazioni
per ristoranti, in produzione, con clienti veri. La seconda è il **MetaSkillSystem** (MSS): il tentativo
di governare *come gli agenti AI lavorano su quella applicazione* — che contesto caricano, chi possiede
quale informazione, come si passano il lavoro fra una sessione e l'altra, e soprattutto come si distingue
una cosa **dichiarata** da una cosa **verificata**.

Il MSS non è codice dell'applicazione. È un insieme di documenti che stabiliscono regole, più un
piccolo motore di controllo che ne impone meccanicamente una parte.

---

## 2. Le tre idee portanti

| Idea | In una frase | Dove è scritta |
|---|---|---|
| **Tre assi che non si fondono** | Ogni osservazione riguarda *Persona* (cosa decide Matteo), *Sistema* (cosa fanno regole e agenti) o *Output* (cosa viene prodotto). Vietato usare un successo del sistema per dire che la persona è cresciuta, o viceversa. | `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` |
| **G / O / E** | Per ogni regola si misurano separatamente **G**overnance (è scritta?), **O**sservazione (viene seguita?), **E**nforcement (qualcosa la impedisce tecnicamente?). Per una regola critica vale **il più debole dei tre**, mai la media. | `docs/MetaSkillSystem/PARAMETRI_MACRO_V0.md` §5 |
| **Owner unico** | Ogni valore che cambia nel tempo ha **un solo** proprietario. Tutto il resto sono viste che puntano a lui. | `docs/MetaSkillSystem/PLAN_V0.md` §2 |

A queste si aggiunge la **capsula di sessione**: un blocco `JSONL` in fondo a ogni report, con schema
versionato, che registra chi ha fatto cosa, con quale autorizzazione, con quali prove e con quale stato
di verifica (`self_report` contro `independently_verified`).

---

## 3. Dove vivono fisicamente le cose

I sei livelli sono definiti in `docs/MetaSkillSystem/archive/README.md`. Questa è la loro **realtà
misurata**, non la loro descrizione.

| Liv. | Cosa | Dove sta davvero | Misura verificata |
|---|---|---|---|
| **L1** Kernel | router, masterplan, contratto capsula, parametri, protocollo pilota, 2 tipi di seduta | 8 file *piatti* nella root `docs/MetaSkillSystem/` | — |
| **L2** Pacchetti | `Senior-Eval-Pack/` — un sotto-sistema con **suo** masterplan e **suoi** 5 gate | `docs/MetaSkillSystem/Senior-Eval-Pack/` | 6 file |
| **L3** Viste/indici | `archive/README.md`, `archive/indices/`, più `ROADMAP`, `HANDOFF`, `SESSION_LOG`, `FOLLOW_UP` sparsi fuori | misto | — |
| **L4** Storia | i report di ogni sessione, nelle cartelle-data | `docs/Sessioni di lavoro/GG-MM-AA/` | **40 cartelle-data**, 636 file `.md`, di cui ~54 del dominio MSS |
| **L5** Prove | il motore di controllo e i suoi casi di prova | **spezzato in 3 posti**: `scripts/mss/` (9 moduli, 2 801 righe) · `docs/MetaSkillSystem/{fixtures,tests}/` (2 349 righe di suite) · 2 hook in `.cursor/hooks/` | 41 fixture + 32 gruppi, **verdi in 11 secondi** |
| **L6** Privato | materiale personale di Matteo | `docs/_lavoro/` — **gitignored, intangibile** | non aperto |

**Totale tracciato nel dominio MSS:** 63 file sotto `docs/MetaSkillSystem/` + 9 sotto `scripts/mss/`.

> ⚠️ **Correzione a un numero che circola.** Vari documenti — e il prompt stesso della consulenza —
> dicono «57 cartelle data». **Sono 40.** Il 57 è quello che restituisce `find … -type d | wc -l`,
> che conta anche la cartella radice e le 16 sotto-cartelle annidate. Il numero è stato scritto una
> volta e ricopiato senza essere ri-derivato. È un errore innocuo in sé, ma è **esattamente la classe
> di errore che questo sistema esiste per impedire**, ed è sopravvissuto a tre passaggi documentali.

---

## 4. Chi possiede che cosa (mappa degli owner)

| Valore che cambia nel tempo | Owner unico | Viste che lo rimandano |
|---|---|---|
| Stato globale, work package, gate di `SYS-1` | `docs/MetaSkillSystem/PLAN_V0.md` | — |
| Stato, gate, debiti del pacchetto senior | `docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md` | `ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md` |
| Schema e semantica della capsula | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` ⚠️ *(vedi §7 — oggi non è vero)* | `scripts/mss/rules.mjs` |
| I 5 gate «candidato prodotto» | `docs/MetaSkillSystem/PARAMETRI_MACRO_V0.md` | — |
| Policy di archiviazione e livelli | `docs/MetaSkillSystem/archive/README.md` | — |
| Indice dei report MSS | `docs/MetaSkillSystem/archive/indices/MSS-REPORT-INDEX.md` | — |

**Regola di conflitto, verificata sul campo:** i due masterplan non si sovrappongono per costruzione.
Su un fatto globale vince `PLAN_V0.md`; dentro il pacchetto l'ordine è *masterplan → handoff → roadmap*.
Un agente freddo che ha trovato una contraddizione in questa seduta **è riuscito a risolverla da solo**
applicando questa regola. È il singolo risultato più forte del sistema.

---

## 5. Dove siamo adesso

| Campo | Valore verificato in questa seduta |
|---|---|
| Branch | `env/test` |
| `HEAD` locale | `2b255d0` |
| `origin/env/test` | `ee0ab39` — **2 commit locali non pubblicati** |
| Punto di ripristino di riferimento | `ee0ab39` (baseline H-1.3). **Non esiste alcun tag**: `git tag -l` è vuoto |
| Suite del motore | `npm run test:mss` → **verde**, 41 fixture + 32 gruppi, 11 s |
| Worktree | 1 solo (il principale) |
| Stash | **8**, alcuni con lavoro non replicabile — non toccare |

### Cantieri

| Cantiere | Stato | Nota |
|---|---|---|
| `WP-0`, `WP-0.1` | chiusi nel disegno | efficacia mai osservata |
| `H-1` | **chiusura invalidata** | resta storia |
| `H-1.1` | chiuso nel disegno | |
| `H-1.3` | **`PASS_CON_RISERVE`** | riserva `H13-POST-L01` aperta. **Non è un PASS pulito** |
| `WP-1` piloti reali | **NON INIZIATO — NO-GO** | il sistema non è **mai** stato osservato all'opera su un caso vero |
| `WP-2` … `WP-6` | non iniziati / bloccati | |
| `SEP-11` | `IN_CORSO` | è **qui** che avviene tutta l'attività reale |
| `SEP-G5` migrazione | **NON PASS** | nessuna migrazione autorizzata |

### Vietato adesso, senza un nuovo mandato

Dichiarare `H-1.3` PASS pulito · dichiarare `SEP-G5` PASS · aprire `WP-1` o `SEP-5` · qualunque
`move`/rename di file MSS · toccare `docs/_lavoro/` · `stash drop` · push.

---

## 6. Che cosa è davvero imposto, e dove non lo è

Questa è la parte che i documenti descrivono in modo ottimista. Ecco la misura reale.

| Superficie | Che cosa controlla | Effetto | Verificato |
|---|---|---|---|
| `npm run validate:mss` | validator completo su un file | esce **1** se fallisce, **0** se passa | ✅ provato |
| `npm run test:mss` | 41 fixture + 32 gruppi | verde | ✅ provato |
| **pre-commit** (`.husky/pre-commit`) | report incompleti + artefatti MSS staged | blocca il commit | ✅ è un hook **git**: vale su **qualunque** superficie, non solo Cursor |
| hook di fine sessione | nudge a fine chat | avviso | ⚠️ **solo Cursor** |
| **CI** (`.github/workflows/ci.yml`) | lint, typecheck, test, link dei doc | — | ❌ **zero riferimenti a MSS**, e gira **solo su `main`**, mentre il lavoro MSS vive su `env/test` |

### I buchi, provati uno per uno

1. **La versione «legacy» della capsula disattiva la prova.** Dichiarando `mss.session/0.1.0` +
   `mss-v0.1-wp0.1-freeze-1`, il campo `controls` — quello che registra *che cosa è stato davvero
   verificato*, con numeratore, denominatore ed esecutore — **non è più obbligatorio**.
   Prova A/B/C eseguita in questa seduta, unica variabile le due stringhe di versione:

   | Variante | `controls` | Esito reale |
   |---|---|---|
   | schema `0.1.1` | presenti | `validate:mss OK` |
   | schema `0.1.1` | **rimossi** | `FAIL` — `MSS-VITAL-MISSING :: event.controls` |
   | schema **`0.1.0`** | **rimossi** | **`validate:mss OK`** |

   Il punto grave: `CONTRATTO_CAPSULA_SESSIONE_V0.md` — il documento dichiarato **owner dello schema** —
   alle righe 52-53 istruisce a scrivere esattamente `0.1.0` / `freeze-1`. **Chi segue la
   documentazione ufficiale produce una capsula senza prove, e il validator dice OK.**

2. **Un report in una sotto-cartella è invisibile all'enforcement.** Il filtro è
   `^docs/Sessioni di lavoro/[^/]+/Report-.*\.md$`: un solo livello di cartella. Oggi **22 report reali
   vivono in sotto-cartelle** e non vengono controllati da nulla — inclusi `Report-B1-…` e `Report-B2-…`,
   cioè proprio i due che il sistema porta a esempio del proprio metodo.

3. **Basta cambiare il prefisso del nome.** Un file chiamato `Verbale-…md` invece di `Report-…md`
   esce dal perimetro.

4. **Il blocco pre-commit si supera committando due volte.** Il controllo «a mente fredda» registra la
   firma dello staged e lascia passare il tentativo successivo identico. È un dosso, non un cancello —
   corretto come disegno, ma va chiamato col suo nome.

> **Lettura d'insieme:** l'enforcement esiste, è scritto bene ed è meccanicamente onesto (i codici di
> uscita sono giusti, i messaggi sono azionabili). Ma il suo **perimetro** è definito da una convenzione
> di nomi e da un livello di cartella, e la sua **versione** ha una porta di servizio aperta.

---

## 7. Contraddizioni vive nei documenti

Il sistema classifica «lo stesso stato scritto a mano in due fonti vive» come **falsificatore duro**,
cioè qualcosa che *invalida la seduta* (`PARAMETRI_MACRO_V0.md` §6). Al momento della mappatura ce ne
sono almeno cinque, e nessuna viene rilevata da niente.

| # | Dove | Dice | Ma la realtà è | Gravità |
|---|---|---|---|---|
| 1 | `Senior-Eval-Pack/MASTERPLAN_V0.md` §7 | «Il verdetto corrente H-1.3 resta **FAIL**» | lo **stesso file**, §4 e §6, dice `PASS_CON_RISERVE` | **alta** — è un verdetto di gate |
| 2 | `Senior-Eval-Pack/MASTERPLAN_V0.md` §7 | «`PLAN_V0.md` descrive ancora uno stato precedente a H-1.3» | `PLAN_V0.md` **è aggiornato**. La nota di debito si è fossilizzata | media |
| 3 | `PLAN_V0.md`, intestazione | «Ultimo movimento: 10-08-26 `H-1.1` … **Nessun commit/push**» | il **corpo dello stesso file** arriva a H-1.3, e `ee0ab39` è pushato. È la **prima cosa** che un agente legge | **alta** |
| 4 | `PLAN_V0.md` §6 | «H-1 è **chiuso nel disegno**» + 10 punti affermativi | la tabella §4 dice «chiusura **invalidata**» | media |
| 5 | `CONTRATTO_CAPSULA_SESSIONE_V0.md` | schema `0.1.0` / `freeze-1` | il motore impone `0.1.1` / `freeze-2` (`scripts/mss/rules.mjs:3-6`) | **alta** — apre il buco §6.1 |

**Sono tutte lo stesso difetto:** un documento aggiornato **solo** nella sezione «prossimo passo», e
lasciato vecchio in una sezione secondaria che nessuno rilegge. Il difetto era già stato diagnosticato
correttamente dal sistema stesso in una seduta precedente, ma la cura proposta non è mai diventata una
regola — quindi il difetto è ancora vivo, in cinque punti.

> Una di queste incoerenze (`HANDOFF_SENIOR_V0.md` stale) è stata **lasciata apposta** come materiale
> di prova per questa consulenza, ed è dichiarata nel report che la produce. Quella non conta come
> difetto: conta come onestà.

---

## 8. Il percorso di lettura — quanto costa sapere dove siamo

Prova eseguita in questa seduta con un agente che partiva **davvero** da zero, autorizzato ad aprire
solo i file a cui era stato rimandato esplicitamente:

| Metrica | Risultato |
|---|---|
| File aperti per sapere **stato e prossimo passo** | **2** |
| File aperti per una risposta **completa e datata** | 6 |
| File aperti in totale (6 domande) | 8, ≈1 100 righe |
| Risposte corrette | 6 su 6 |
| Cose inventate per riempire un buco | **0** |
| Contraddizioni trovate e **risolte da solo** con le regole del sistema | 4 |

**Questo è il risultato più importante della mappatura.** Il gate di `WP-1` chiede letteralmente
«un agente freddo che ricostruisce lo stato senza perdita né invenzione, senza leggere tutta la
narrativa». Con questo campione, **il sistema quel test lo supera**.

Le due cose che l'hanno rallentato sono meccaniche, non architetturali:
- ~25 report sono citati **solo per nome**, senza cartella: impossibile aprirli senza cercare;
- la «Bussola» del binario personale è citata **senza path** e non è raggiungibile dall'ingresso.

---

## 9. Il costo della cerimonia — numeri, non impressioni

| Grandezza | Misura |
|---|---|
| Documentazione MSS (kernel) | 3 312 righe |
| Report di sessione del dominio MSS | **10 149 righe** su 54 file |
| Codice che impone qualcosa | 5 507 righe |
| **Rapporto documentazione : enforcement** | **≈ 2,5 : 1** |
| Vita del sistema | **3 giorni di lavoro reale** (09-08, 10-08, 21-08) |

### Il caso del file spostato

Spostare **un solo file** da `docs/MetaSkillSystem/` a `docs/MetaSkillSystem/archive/osservazioni/`
è costato, misurato: **6 sessioni · 7 documenti nuovi · 3 commit · 2 review · ≈1 741 righe** di
documentazione — per un `git mv` di un file da 301 righe. Circa **5,8 righe scritte per ogni riga
spostata**. E il file al path vecchio c'è ancora, come stub di redirect con TTL scaduto dal 09-09.

Questo non è di per sé una condanna: era il primo move e il prezzo comprendeva l'invenzione del metodo.
Ma non è replicabile, ed è **esattamente il problema che l'automazione richiesta deve risolvere**.

---

## 10. Le cinque cose da sapere prima di toccare qualcosa

1. **La suite è legata alla profondità delle cartelle**, non solo ai nomi: `tests/h1/run.mjs` calcola
   la radice del repo risalendo un numero fisso di livelli. Spostare la cartella di un solo livello
   rompe tutto anche facendo ogni altra cosa correttamente.
2. **`docs/_lavoro/` non si apre mai.** Si può citare il path, mai il contenuto.
3. **I FAIL storici non si cancellano.** Si corregge aggiungendo, mai sovrascrivendo.
4. **Nessun gate si dichiara superato** da chi ha fatto il lavoro.
5. **`origin` è indietro di 2 commit** rispetto al locale, e non esiste un tag di ripristino.

---

## 11. Che cosa questa mappa non ha potuto verificare

- Il contenuto di `docs/_lavoro/` — vietato, per progetto.
- Il piano operativo di SEP-10, che vive in `.cursor/plans/` ed è **gitignored**: è citato come
  «tenere, non rifare» ma non esisterà mai in git.
- I 41 riferimenti `conversation:this-session` presenti nelle capsule: puntano a chat non risolvibili.
  Non sono un difetto del disegno, ma **nessuno potrà mai aprirli**.
- Se qualche commit sia passato con `--no-verify`: git non lo registra.
- La durata reale delle sedute: i timestamp delle capsule sono in gran parte arrotondati a mano
  (38 su 41 cadono su multipli esatti di 5 minuti), quindi **sono dichiarati, non misurati**.
