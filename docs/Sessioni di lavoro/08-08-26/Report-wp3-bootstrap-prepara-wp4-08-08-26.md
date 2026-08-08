# Report — WP-3 bootstrap binario + prepara prompt WP-4

**Data:** 08-08-26 · **Branch:** `env/test` · **Profilo:** Esecuzione (WP-3) + prepara-prompt (WP-4)
**Modalità:** standard · **Esito:** WP-3 ✅ controprove 1–3; prova a freddo usata ma filename letterale grigio; prompt WP-4 pronto (scelta 2)

> **Cosa è cambiato:** un agente che apre i canali del binario crescita/valutazione trova un puntatore alla bussola; il prompt per WP-4 (mappa strumento/soggetto) è pronto con la regola «due assi».
> **Cosa resta:** eseguire WP-4 in chat nuova; riga di log roadmap WP-1…WP-3 non scritta di iniziativa; SS-5 e WP-5 dopo.
> **Serve una tua azione:** sì — incollare il prompt WP-4 in una chat nuova; (opzionale) ripetere prova a freddo se vuoi il PASS letterale sul filename.

---

## 1. Cappello (effetto)

Ora, aprendo la cartella «Crescita professionale» o i bootstrap del repo app, l’agente è dirottato sulla bussola invece di navigare a tappeto. Il prossimo pezzo (mappa strumento/soggetto) ha un prompt chiuso con la tua scelta 2.

---

## 2. Cosa è stato fatto (cronologico)

1. **Eseguito solo WP-3** del plan IDEA-4/REV-10: creato `CLAUDE.md` in cartella B; aggiunti puntatori in `.claude/CLAUDE.md`, `AGENTS.md`, `comandi-base.mdc`, `CONTESTO_Progetto.md`; riquadro anti-trappola in testa a `12_Handoff_Interrogazione.md` (stato scaduto dichiarato, non corretto).
2. **Controprove git:** CalendarBackup-v2 = 3 file, solo aggiunte, 12 righe; Io-Claude = 1 nuovo + 2 modificati, zero rimozioni; tabella «Stato al 07-08-26» intatta.
3. **Prova a freddo** con Claude Code in cartella B: ha caricato e usato la bussola; nel testo ha detto «la bussola» senza la stringa `00_BUSSOLA_VALUTAZIONE.md`.
4. **Prepara prompt WP-4:** una domanda di classificazione (A/B/C) sui file nuovi IDEA-4; discussione sul framing «strumento che raccoglie dati»; scelta **2** (MISTO dove c’è istanza + provenienza solo su plan/prompt).
5. **Prompt WP-4 aggiornato** consegnato in chat (blocco copia-incolla sotto, stessa sessione).
6. **Questo report.**

---

## 3. File toccati e perché

| File | Perché |
|---|---|
| `Io-Claude\Crescita professionale\CLAUDE.md` | File 1 WP-3 — unico contenuto bootstrap cartella B |
| `CalendarBackup-v2\.claude\CLAUDE.md` | Puntatore binario sotto «Dettaglio operativo» |
| `CalendarBackup-v2\AGENTS.md` | Puntatore dopo instradamento area |
| `CalendarBackup-v2\.cursor\rules\comandi-base.mdc` | Puntatore sotto grilletti |
| `Io-Claude\…\CONTESTO_Progetto.md` | Riga tabella «Due modalità» |
| `Io-Claude\…\12_Handoff_Interrogazione.md` | Riquadro in testa — disarma trappola Blocco 1 |
| `docs/Sessioni di lavoro/08-08-26/Report-wp3-bootstrap-prepara-wp4-08-08-26.md` | Questo report |

**Non toccati (esplicito):** registro, bussola, `00_HANDOFF_UNIFICATO`, `INT_00`, `04_Handoff`, roadmap §7, Archives, `src/`, Indagine-Corpus, MAPPA, WP-4/5, sedute, SS-5, nessun commit.

---

## 4. Test eseguiti e risultato

| Test | Esito |
|---|---|
| `git diff --stat` CalendarBackup-v2 (3 file puntatori) | ✅ 12 insertions, 0 deletions (≤14) |
| `git status` / `diff --numstat` Io-Claude | ✅ `?? CLAUDE.md`, CONTESTO +1, 12_Handoff +6, 0 rimozioni |
| Trappola 12_Handoff dall’alto | ✅ riquadro prima di qualsiasi mandato Blocco 1 |
| `claude -p "cosa devo fare in questa cartella?"` cwd = cartella B | ⚠️ usa la bussola; filename letterale non nominato → grigio se criterio stretto |
| `npm run validate` | non applicabile (nessun codice app) |

Nota: `CLAUDE.md` cartella B = **16 righe** (copia letterale del blocco plan); tetto dichiarato ≤15 contraddice il blocco integrale nel plan.

---

## 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| `.claude/CLAUDE.md` | + voce binario crescita/valutazione | bootstrap Claude Code sul repo |
| `AGENTS.md` | + punto 4 instradamento | bootstrap Codex/agenti |
| `.cursor/rules/comandi-base.mdc` | + grilletto sotto avvio | bootstrap Cursor always-on |
| nessuno altro skill area app | — | WP-3 = solo puntatori bootstrap; nessun layout/comportamento Prenota/QR/Admin |

---

## 6. Dati comunicazione

- **Frasi ricorrenti:** «prepara prompt» (1); «scelta 2 consigliata»; «crea report»; vincolo «un WP per sessione» ereditato dal plan.
- **Formato che ha funzionato:** opzioni A/B/C + discussione breve prima del lock; tabellina due assi (portabilità vs provenienza).
- **Prompt Matteo (annotati):**
  - Esecuzione WP-3 (prompt lungo auto-contenuto con file esatti, tetti, controprove).
  - «prepara prompt per prossimo agente w4».
  - Discussione classificazione + «strumento che raccoglie dati su utente».
  - «scelta 2 consigliata. crea report … dopo aver aggiornato il prompt».
- **Automatizzabile:** controprove git WP-3 (diff --stat / zero rimozioni).
- **Manuale:** giudizio PASS letterale prova a freddo; scelta classificazione file nuovi.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **4** (WP-3 esecutivo · prepara WP-4 · discussione classificazione · scelta 2 + report).
- Correzioni dopo 1ª risposta prepara: **1 ciclo** (domanda A/B/C → discussione → scelta 2).
- Follow-up generati: prompt WP-4 per chat nuova.
- Modalità alzata: no.
- **Efficace:** prompt WP-3 con «copia letterale» + tetti numerici; prepara che ferma su classificazione ambigua.
- **Ambiguo / attrito:** tetto ≤15 vs blocco letterale a 16 in `CLAUDE.md`; prova a freddo «nominare il file» vs «usare la bussola».
- **Replicare:** decisione di disegno (assi) *prima* del prompt di mappa.
- **Migliorare:** nei plan, allineare tetto e blocco «integrale» prima dell’approvazione.

---

## 8. La tua lettura della sessione

- **Impressioni:** WP-3 eseguibile alla lettera ha tenuto basso lo scope creep. Il momento di valore è stato il dialogo sulla classificazione: senza quella domanda il prompt WP-4 avrebbe congelato «tutti strumento» e indebolito il criterio di accettazione della mappa.
- **Difficoltà:** (1) tetto vs letterale su `CLAUDE.md` — risolto tenendo il letterale e dichiarando l’incoerenza; (2) +7 righe su 12_Handoff per blank — tolto blank per ≤6; (3) prova a freddo semi-PASS.
- **Migliorie (dato, non modifica):** aggiungere nel plan un check «conteggio righe del blocco letterale ≤ tetto»; criterio prova a freddo: «nomina bussola *o* path» invece di solo filename.

---

## 9. Derivazione errori

| Cosa | Classe | Evitabile come |
|---|---|---|
| `CLAUDE.md` 16 vs tetto ≤15 | prompt/plan incoerente (preesistente nel plan) | allineare tetto e blocco integrale in REV |
| Blank extra → +7 su file con tetto ≤6 | errore agente (markdown spacing) | contare `diff --numstat` prima di chiudere |
| Prova a freddo senza stringa filename | criterio stretto vs comportamento utile | riformulare criterio in WP-3/§11 |

Nessun bug app. Pattern da tenere d’occhio: **costanti di tetto che contraddicono i blocchi «copia letterale»**.

---

## 10. Cosa resta per la prossima sessione

- Eseguire **WP-4** con il prompt aggiornato (scelta 2) in chat nuova.
- Non scrivere di iniziativa le righe di log roadmap mancanti (WP-1…WP-3).
- Dopo WP-4: **WP-5** collaudo; poi SS-5 (correzione divergenze) solo con parola tua.
- Nessuna riga nuova in `FOLLOW_UP.md` app (fuori prodotto).

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt lungo «Profilo: Esecuzione … Esegui SOLO WP-3 …» con file 1–6, controprove e divieti. (2) «prepara prompt per prossimo agente w4». (3) Discussione: tutti strumento + obbligo indicare in plan/prompt cosa è idea sua vs agente; «parliamone se non ne sei convinto». (4) «scelta 2 consigliata. crea report id lavoro dove parli del lavoro che hai svolto in questa chat dopo aver aggiornato il prompt».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato in sessione: `git diff --numstat` CB-v2 = 6+3+3=12, 0 del; Io-Claude 12_Handoff 6/0, CONTESTO 1/0; testa 12_Handoff = riquadro; tabella Stato alle righe ~48–59 intatta; CLAUDE.md B = 16 righe (Get-Content Count).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati i tre bootstrap tracciati (CLAUDE/AGENTS/comandi-base) come da WP-3. Nessuna skill Prenota/QR/Admin da aggiornare: nessun comportamento UI. Bussola/registro non toccati (corretto). Prompt WP-4 solo in chat + questo report — non un file prompt separato su disco.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non eseguito WP-4/WP-5; non corretto SS-5; non scritta riga log roadmap; non commit/push; non dichiarato PASS stretto sulla prova a freddo; non creato secondo file di contenuto. Voluto e saltato di proposito per mandato «un WP / niente di iniziativa».

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito = tetto numerico vs blocco «integrale» nello stesso WP del plan. Miglioria = in prepara/REV, un controllo meccanico `wc -l` del blocco letterale contro il tetto prima di approvare il plan.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto per WP-3 (plan intero + path bussola, senza src/APP_CONTEXT intero). Prepara ha caricato PREPARA_PROMPT + pezzo WP-4 — adeguato. Nessun hook stop ricevuto in questa chat prima del report; il vincolo Q/R è stato applicato proattivamente.

---

## 12. Self-review del report

1. Dati allineati ai numstat di sessione.  
2. Skill bootstrap elencate in §5; niente skill area UI.  
3. Q1–Q6 compilate con sostanza.  
4. Tono: effetto «agente trova la bussola» / «prossimo = mappa», non dump di path.

**Report pronto.** Nessun commit proposto (regime: 3 file repo tracciati + cartella B git locale — aspetta richiesta esplicita).
