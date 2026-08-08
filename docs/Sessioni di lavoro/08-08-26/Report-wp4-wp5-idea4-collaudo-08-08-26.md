# Report — IDEA-4 WP-4 + WP-5 (mappa, collaudo, fix bussola)

**Data:** 08-08-26 · **Branch:** `env/test` · **Profilo:** Esecuzione (WP-4) + prepara-prompt (WP-5) + Verifica collaudo + patch bussola  
**Modalità:** standard · **Esito:** WP-4 ✅ · WP-5 K=1 fallisce · controprova dopo FASE PIANO passa (5/5, M=2) · lezione «linka bussola» annotata

> **Cosa è cambiato:** c’è una mappa che dice cosa dello strumento regge su un’altra persona; il collaudo a freddo ha fallito la prima volta e passato dopo un freno in cima alla bussola; per ogni chat di crescita/valutazione va **linkata la bussola in apertura**.
> **Cosa resta:** SS-5 (numeri divergenti / stato `12_Handoff`); bootstrap «frase ambigua senza path» in sospeso; ripresa senior con bussola linkata.
> **Serve una tua azione:** sì — aprire chat senior con `@`/`path` bussola; decidere quando aprire SS-5.

---

## 1. Cappello (effetto)

Ora, per il binario crescita/valutazione: (1) sai cosa è riusabile su un’altra persona (mappa), (2) un agente che parte dalla bussola con path esplicito fa la **fase piano** prima di interrogarti, (3) senza link alla bussola all’inizio chat l’instradamento non è garantito — ed è scritto nero su bianco.

---

## 2. Cosa è stato fatto (cronologico)

1. **WP-4 eseguito:** conteggio del giorno A=30 · B=16 · tot=46; creata solo `MAPPA_STRUMENTO_SOGGETTO.md` (41 righe), due assi (portabilità + regola provenienza dichiarata, non a ritroso).
2. **Prepara prompt WP-5** (scelta A: frase fredda + osservatore); consegnati due blocchi.
3. **Collaudo K=1:** agente freddo ha saltato al Blocco 7 (AR-01) senza piano; MET-2→registro **ok**; score **1/5 → fallisce**; riga in roadmap §7; osservatore indipendente ha **concordato**.
4. **Analisi + idee** (fermo header / due fasi / frase stretta); controprova frase stretta lasciata incompleta / senza path.
5. **Patch bussola:** header **FASE PIANO** (punti 1–4 + stop domande).
6. **Controprova con frase reale** («conduci…» + path bussola): piano completo, zero domande, 5/5, M=2 (`00_HANDOFF` + `_MODELLO`) → **passa**.
7. **Annotazioni:** lezione «linka bussola in apertura» in roadmap §7, testa bussola, `CLAUDE.md` (cartella B). Bootstrap ambiguo senza path: **lasciato stare**.
8. **Questo report** + commit/push di ciò che è in git (file `_lavoro` restano gitignored).

---

## 3. File toccati e perché

| File | Perché |
|---|---|
| `…\Valutazione Personale\MAPPA_STRUMENTO_SOGGETTO.md` | **NUOVO** WP-4 — classificazione 46 file (gitignored) |
| `…\Valutazione Personale\00_BUSSOLA_VALUTAZIONE.md` | Header FASE PIANO + nota link apertura (gitignored) |
| `Io-Claude\…\13_Roadmap_Complessiva.md` | §7: WP-5 fallisce + controprova passa + lezione link |
| `Io-Claude\…\CLAUDE.md` | Nota fondamentale: linka bussola a inizio chat |
| `CalendarBackup-v2\AGENTS.md` · `.claude/CLAUDE.md` · `.cursor/rules/comandi-base.mdc` | Bootstrap WP-3 (da sessione precedente, inclusi in chiusura capitolo) |
| `Io-Claude\…\12_Handoff_Interrogazione.md` · `CONTESTO_Progetto.md` | Bootstrap WP-3 (riquadro + riga) |
| `docs/Sessioni di lavoro/08-08-26/Report-wp4-wp5-idea4-collaudo-08-08-26.md` | Questo report |

**Non toccati:** `INT_00`, rubrica, mining, registro fonti (contenuto), plan/prompt IDEA-4, `src/`, seduta reale Blocco 7.

---

## 4. Test eseguiti e risultato

| Test | Esito |
|---|---|
| Conteggio `.md` A/B prima WP-4 | 30 / 16 = 46 |
| Criteri WP-4 (mappa ≤90, elenco=conteggio) | 41 righe, 46 file classati ✅ |
| WP-5 K=1 (frase «conduci» + path) | **fallisce** 1/5 |
| Controprova osservatore | accordo fallisce 1/5 |
| Controprova post-header FASE PIANO | **passa** 5/5, M=2 |
| `npm run validate` | non applicabile (solo docs binario privato) |

---

## 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| nessuno (skill area app) | — | task solo binario crescita/valutazione gitignored + Io-Claude; nessuna skill Prenota/Menu/Admin da allineare |
| `AGENTS.md` / `comandi-base.mdc` / `.claude/CLAUDE.md` | puntatori già WP-3 | bootstrap binario — non skill prodotto |

---

## 6. Dati comunicazione

- Frasi ricorrenti: «prepara prompt» · «spiegamelo semplice / più semplice» · «cosa ne pensi?» · «Sì/No» su patch · «fai report finale».
- Formato che ha funzionato: tabelle score 5 controlli; testo copia-incolla per l’osservatore; header bussola corto.
- Prompt annotati: vedi Q1.
- Automatizzabile: header FASE PIANO (già fatto); link bussola = **gesto manuale Matteo** (annotato come fondamentale).
- Non automatizzato ora: smoke bootstrap senza path; SS-5.

### Analisi flusso prompt / statistiche

- Prompt sostanziali Matteo: ~12 (WP-4 esec · prepara WP-5 · transcript · score · idee · patch · controprova · annota · report finale).
- Correzioni dopo 1ª risposta: 1 (chiedere di parlare più semplice all’osservatore).
- Follow-up generati: ripresa senior con bussola; SS-5; bootstrap ambiguo sospeso.
- Modalità alzata: no.

---

## 7. La TUA lettura della sessione

- **Impressioni:** WP-4 pulito e chiuso. WP-5 ha fatto il suo mestiere: ha **falsificato** la copertura «bussola basta» — senza FASE PIANO l’agente conduceva subito. Dopo 6 righe in header, stesso collaudo passa. Il registro MET-2 ha retto anche nel fallimento.
- **Difficoltà:** due chat parallele (fredda + osservatore) hanno creato rischio doppia riga §7; risolto con «non scrivere §7, già fatto». Linguaggio troppo tecnico verso Matteo → corretto su richiesta.
- **Migliorie (dato, non modifica):** (1) nel prompt WP-5 mettere subito il blocco «cosa dire all’osservatore se lo score è già fatto altrove»; (2) collaudo ufficiale = sempre frase «conduci» + path; frase morbida solo come esperimento etichettato; (3) reminder UI/Cursor «@ bussola» non ancora esiste — per ora regola umana.

---

## 8. Derivazione errori

| Cosa | Causa | Evitato come |
|---|---|---|
| WP-5 K=1 fallisce (salta alle domande) | **vincolo strutturale** / bussola senza freno procedurale in testa | Header FASE PIANO |
| Orientamento non misurabile K=1 | **errore agente** freddo (nessun elenco) + assenza obbligo in bussola | Punto 1 FASE PIANO |
| Confusione doppio score / doppia riga §7 | **prompt ambiguo** (due ruoli A senza protocollo «score già fatto») | Istruzione esplicita a Matteo + osservatore |
| Frase «prepara piano» senza path | **prompt incompleto** (test diverso da WP-5) | Etichettare smoke bootstrap vs WP-5 |

Nessun bug app. Pattern utile per `ERRORI_PROCESSO` (candidati): «ingresso skill senza gate procedurale in testa» · «due osservatori sullo stesso collaudo».

---

## 9. Cosa resta per la prossima sessione

- Ripresa **senior / Blocco 7**: linkare bussola in apertura, poi mandato.
- **SS-5** (WP separato): allineare contatore MET-2, stato `12_Handoff`, conteggi file.
- Bootstrap «frase ambigua senza path»: sospeso (decisione Matteo).
- Non aprire FU app: fuori perimetro.

---

## 10. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt esecutore WP-4 intero (Profilo Esecuzione, solo MAPPA, conteggio giorno, scelta 2 due assi). (2) «prepara prompt per wp 5». (3) «a» (struttura due blocchi). (4) Transcript chat fredda K=1 + domanda MET-2. (5) «scrivilo tu» (riga roadmap) + messaggio osservatore fermo + «come proseguiamo?». (6) «devi parlarmi piu semplice…». (7) Verbale osservatore in accordo + «elaboriamo un idea…». (8) Controprova punto 3 / tenere WP-0…4. (9) Transcript frase stretta / «irrigidire header bussola…». (10) «modifica bussola, io avvio agente subito dopo». (11) Transcript controprova post-header + MET-2. (12) «facciamo altro cold test… o test inutile?». (13) «lasciamo stare… annotiamo linkare bussola… posso riprendere chat senior?». (14) «fai report finale di tutto e compila i file privato…».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato: MAPPA esiste; bussola ha FASE PIANO + riga link Matteo in testa (Read/Get-Content); roadmap §7 ha due righe WP-5 (fallisce + passa); CLAUDE.md cartella B ha nota link; git CalendarBackup mostra +12 righe su AGENTS/CLAUDE/comandi-base; Io-Claude mostra 12_Handoff/CONTESTO/roadmap + CLAUDE untracked; conteggio WP-4 era 30+16=46 (comando PowerShell in sessione). File `_lavoro` non in `git status` (gitignore) — corretto.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area app da aggiornare (binario privato). Allineati i tre posti della lezione operativa: bussola · CLAUDE.md B · roadmap §7. Plan IDEA-4 non riscritto (vietato a ritroso; stato WP-5 resta nelle righe §7). Registro fonti non modificato.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non eseguito smoke bootstrap senza path (lasciato stare su decisione tua). Non riscritto WP-5 nel plan. Non aperto SS-5. Non condotta seduta Blocco 7. Non aggiornato stato in testa al plan IDEA-4. Non commit dei file gitignored `_lavoro` (impossibile/non previsto). Controverifica sub-agente: da lanciare dopo questo report finale.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito = WP-5 a due chat (fredda/osservatore) senza regola «chi scrive §7»; miglioria = una riga fissa nel prompt osservatore «se score già in altra chat → solo verbale, zero §7». Secondo attrito = spiegazioni troppo dense verso Matteo; miglioria = default «copia-incolla da dire all’altro agente» quando ci sono due chat.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto per WP-4/5 (plan + registro citazione + bussola). APP_CONTEXT/src correttamente esclusi. Hook fine-sessione non ancora scattato in questa chiusura; utile il vincolo Q1–Q6 per non chiudere a vuoto.

---

## 11. Self-review del report

1. Dati = file/righe riaperte ✅  
2. Skill app: nessuno dovuto ✅  
3. Q1–Q6 compilate con sostanza ✅  
4. Cappello in linguaggio effetto utente ✅  

**Report pronto per controverifica / commit.**
