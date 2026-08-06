# Report — revisione senior del blocco Sintesi (S1–S6)

**Data:** 06-08-26 (sera) · **Branch:** `env/test` · **Profilo:** Verifica / Meta (nessun file `src/`)
**Capitolo:** chiusura del mining + riscrittura dei prompt di sintesi · **Squadra:** 1 senior + 3 revisori Sonnet in parallelo

---

## 1. Cosa è stato fatto

1. **Ricognizione dello stato reale.** Il tracking diceva 22 ondate da fare; su disco erano **tutte
   fatte**: 39 report di mining + 39 file di stato. Il file era fermo a C2.
2. **Tre revisori Sonnet in parallelo**, ognuno su un pezzo del materiale vero, con mandato di sola
   lettura: S1/S2 (conformità e volumi delle Sezioni 1-2), S3/S5 (skill signals e citazioni),
   S4/S6 (contro-evidenze, copertura, handoff). Nessuno ha toccato il repo.
3. **Verifica indipendente del senior** sui numeri portanti prima di usarli (conteggi riga per riga,
   `_stato/` contro tabelle, classi di messaggi in P0-EX, presenza della tripla colonna).
4. **Riscrittura del blocco Sintesi**: dieci regole comuni nuove per le ondate S, sei prompt riscritti
   sul materiale reale, precondizioni bloccanti, regia a lotti per S1.
5. **Allineamento del tracking** (ondata AGG): le 39 righe di mining passano da checkbox a tabella con
   decisioni, agency e nome del report.
6. **Igiene del cantiere**: 3,0 MB di scarti di lavoro delle ondate H spostati fuori da git.

---

## 2. Deliverable

| File | Ruolo |
|------|-------|
| `01_INPUT_SINTESI.md` (nuovo) | Materiale d'ingresso delle S: numeri misurati, mappa di normalizzazione, trappole di lettura, 16 cluster di dedup verificati, tassonomia a 10 rami, timeline corretta, handoff per destinatario |
| `00_PROMPTS_SEQUENZA_TRACKING.md` (riscritto in parte) | «Dove siamo», stato allineato, regole comuni delle S, prompt S1–S6 riscritti, regia a lotti per S1 |
| Questo report | Chiusura di sessione |

**Non toccati di proposito:** i 39 report di mining (nemmeno per correggere l'errore di conteggio di
M1: va registrato da S2 come divergenza, non nascosto), `PIANO_INDAGINE.md`, e il report della chat di
progettazione — che resta com'è, come memoria di quella sessione (decisione di Matteo, 06-08-26).

---

## 3. Cosa la revisione ha trovato (le correzioni che contano)

| # | Problema nei prompt S originali | Perché contava |
|---|--------------------------------|----------------|
| 1 | S3 chiedeva una timeline **già smentita** dal piano §2.2 | avrebbe scritto nel dossier una storia falsa: il trading è parallelo a CB-v2, non successivo |
| 2 | S5 non elencava **H5** | è l'unica fonte sul buco 22-06 → 02-08 e sull'export del metodo verso gli altri progetti |
| 3 | Nessuna S raccoglieva il lavoro **già verbalizzato fuori dalle Sezioni 1/2** | si perdevano la tabella divergenze di H2, `J1 §5.b`, i cataloghi dei piani abbandonati di I1/I2 |
| 4 | Nessuna S avvisava del **volume** né imponeva di ricontare | tre report non tornano col proprio stato (M1 dichiara 42 agency, ne ha 38) |
| 5 | Nessuna normalizzazione | 63 righe usano valori fuori vocabolario; `A→A` è gestito in modo opposto da due report |
| 6 | S3 non aveva una tassonomia | 1.313 etichette distinte su 1.826 decisioni, 72% usate una volta sola |
| 7 | Bias L4 non dichiarato | M1 e M4 producono metà delle L4 del corpus perché leggono regole già scritte: circolarità |
| 8 | La tripla colonna «PARLATA» era un placeholder in tutti e 9 i report che la abbozzano | va compilata da zero: quando le ondate A furono scritte, le H non esistevano ancora |
| 9 | S6 assumeva domande senior già pronte | non ne esiste nemmeno una nei 39 report: la banca va scritta da zero |
| 10 | Collisione di nomi `S4`/`M2`/`M3` (ondata vs milestone) | un grep cieco avrebbe mescolato falsificazione e capitolo Servizio |

---

## 4. Test eseguiti

Nessuno: zero codice applicativo. Verifiche fatte, tutte di lettura: conteggi riga per riga sui 39
report, confronto con i `_stato/`, bilanciamento dei blocchi del file riscritto, scansione anti-segreti
sui file messi in commit (due match, entrambi falsi positivi: un prefisso senza chiave in A8 e il
regex di rilevamento dentro `tools/estrai_prompt.py`).

---

## 5. Igiene e sicurezza

- `_stato/` conteneva **23 file `_tmp_*` per 3,0 MB**: dump grezzi dei transcript delle ondate H4/H5,
  dentro una cartella tracciata da git. Un `git add` di fine sessione li avrebbe committati, contro il
  piano §5.2 (il corpus grezzo sta fuori da git). Spostati in
  `docs/_lavoro/Indagine-Corpus/_scarti-ondate-H/`, verificato che il `.gitignore` li copra.
- Commit limitato al cantiere: `docs/Archives/` (958 md mai tracciati) e le modifiche pendenti di altre
  sessioni non sono state toccate.

---

## 6. Cosa resta

1. **S1** — pronta, con la regia a lotti. È l'ondata più pesante: 1.826 righe da 39 fonti.
2. Poi S2 → S3 → S4 → S6 in catena; **S5** si può parallelizzare appena S2 è chiusa.
3. Dopo S6: chat di interrogazione senior, che è un capitolo a parte.

Due questioni che le S erediteranno e non devono chiudere a caso: il prezzo del carosello (aperto da
A2, non risolto né da H2 né da H3) e la riconciliazione dei 91 messaggi di scarto sul conteggio di
peso 1.

---

## 7. Domande di chiusura

❓ **Q1 — Prompt ricevuti (verbatim, sostanziali)**
✅ (1) «sei agente senior. occupati del blocco "sintesi" nel file che vedi "00_prompts..". usa sub
agent e revisiona lavoro svolto e perfezionalo in vista di completamento plan. (sonnet come subagent)»;
(2) «1. sposta in lavoro i 3,0 mb di scarti. 2. lascialo come report di lavoro progettazione / prepara
prompt per far lavorare prossimo agente senior a S1 utilizzando sub agents sonnet. Avvio io nuova chat
senior con prompt per proseguire i lavori dopo che hai finito di aggiornare la documentazione e fatto
commit.»

❓ **Q2 — I dati del report corrispondono al diff reale?**
✅ Sì. 80 file nel commit, tutti sotto `Indagine-Skill-Matteo/`: 1 file modificato (tracking), 1 nuovo
(`01_INPUT_SINTESI.md`), questo report, più i 39 report di mining e i 39 file di stato che erano su
disco ma non ancora versionati. Verificato che nulla fuori dal cantiere sia entrato in stage.

❓ **Q3 — File correlati / skill allineati?**
✅ Nessuna skill d'area toccata: il cantiere è meta/personale, non cambia comportamento dell'app.
Il piano (`PIANO_INDAGINE.md`) resta la fonte di verità del metodo e non aveva bisogno di correzioni:
le sue §2.2 e §3.1 sono anzi ciò che ha permesso di trovare gli errori nei prompt S.

❓ **Q4 — Cosa NON è stato fatto**
✅ Non è stata eseguita nessuna ondata S. Non è stato corretto l'errore di conteggio di M1 dentro il
suo report (deve registrarlo S2). Non sono stati riaperti i corpora grezzi. Nessun push.

❓ **Q5 — Attrito + miglioria**
✅ Attrito: le sei ondate S erano state scritte prima del mining, e tre di esse contenevano istruzioni
che il materiale ha smentito — un difetto strutturale, non un errore di chi le ha scritte. Miglioria di
processo: quando un piano prevede ondate di sintesi a valle, i loro prompt vanno **ri-verificati sul
materiale vero** prima di lanciarli, non solo scritti bene in partenza.

❓ **Q6 — Lettura della sessione**
✅ Sessione di controllo qualità su un cantiere quasi finito. Il valore non è aver aggiunto materiale
ma aver evitato che sei ondate costose lavorassero su premesse sbagliate e buttassero via lavoro già
fatto e già pagato.

---

## 8. Chiusura verso Matteo

- La parte di scavo è **finita**: 39 letture su 39, tutto quello che serviva è stato estratto.
- Le sei sintesi finali erano scritte «alla cieca»: le ho ricontrollate contro il materiale vero e
  corrette, così non ripartono da zero e non raccontano una storia sbagliata sui tuoi mesi di lavoro.
- I dump grezzi delle tue chat non sono più in una cartella che finisce su GitHub.
