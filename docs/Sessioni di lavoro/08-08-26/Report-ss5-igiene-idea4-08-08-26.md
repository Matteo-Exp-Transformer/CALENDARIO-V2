# Report — SS-5 igiene punti divergenti (IDEA-4)

**Data:** 08-08-26 · **Branch:** `env/test` (file `_lavoro` gitignored; cartella B Io-Claude modificata) · **Profilo:** Redattore (igiene `SS-5`)  
**Modalità:** standard · **Esito:** `SS-5` ✅ chiuso · documentazione restante allineata · prossimo = Blocco 7

> **Cosa è cambiato:** i numeri e gli stati che mentivano (contatore `MET-2`, «prossima seduta Blocco 1», conteggi file morti, stato WP di `IDEA-4`) ora coincidono col proprietario.
> **Cosa resta:** Blocco 7 da condurre · `PAO-1…PAO-4` · `SS-4`/`WP-6` hook (fuori) · voci di log storiche intatte di proposito.
> **Serve una tua azione:** sì — aprire la chat Conduttore Blocco 7 (bussola linkata), quando vuoi.

---

## 1. Cappello (effetto)

Ora un agente che apre handoff/`12`/protocollo non trova più tre risposte diverse alla stessa domanda («quanti `MET-2`?», «prossima seduta?», «quanti file?»). `IDEA-4` risulta chiuso fino a `SS-5`. Il binario è pronto per riprendere l’interrogazione sul Blocco 7.

---

## 2. Cosa è stato fatto (cronologico)

1. Orientamento da bussola: punto = igiene `SS-5` dopo `WP-5`.
2. Tre parole fissate (proposte + «procedi»): **Dodici** · **Blocco 7** · **A comando**.
3. Contatore `MET-2` vivi → **12** + nota n.3 nel proprietario `REGISTRO_RIGHE_APERTE`.
4. `12_Handoff` allineato: Fase 2 in corso · mossi 3 · prossima = Blocco 7.
5. Conteggi file vivi → «a comando»; `PLAN_REVISIONE` §8 stesso trattamento.
6. Stato `IDEA-4`: plan + registro fonti + handoff §0 → `WP-0…WP-5` + `SS-5` chiusi.
7. «9 righe nuove» in handoff §4 → **10 (larga) / 6 (stretta)** dal proprietario.
8. Riga di log in roadmap §7; report di questa sessione.

---

## 3. File toccati e perché

| File | Perché |
|---|---|
| `…\Contesto\INT_00_PROTOCOLLO.md` | §9.4: Otto → **Dodici** (+ rimando proprietario) |
| `…\00_HANDOFF_UNIFICATO.md` | Contatore · materiale cartella B · righe nuove · stato WP · header data |
| `…\REGISTRO_FONTI_DI_VERITA.md` | Tabella divergenze → ✅ allineate; controprova aggiornata |
| `…\REGISTRO_RIGHE_APERTE.md` | **Nota n.3** — totale ufficiale 12 |
| `…\PLAN_IDEA-4_SKILL_SYSTEM_08-08-26.md` | Riquadro STATO: WP-0…WP-5 + SS-5 chiusi |
| `…\PLAN_REVISIONE_METODO_08-08-26.md` | §8: «14 file» → a comando |
| `Io-Claude\…\12_Handoff_Interrogazione.md` | Stato + mandato → Blocco 7 |
| `Io-Claude\…\13_Roadmap_Complessiva.md` | §8 contatore · §7 log `SS-5` |
| `docs\Sessioni di lavoro\08-08-26\Report-ss5-igiene-idea4-08-08-26.md` | Questo report |

**Non toccati (di proposito):** verbali / `INT_04` (snapshot «Otto»/«quattro») · «decimo caso» in `INT_00` §9.8 (nome del caso 10) · voci di log roadmap precedenti · mining LOCK · rubrica · codice app.

---

## 4. Test eseguiti e risultato

| Test | Esito |
|---|---|
| `rg "Otto casi documentati"` nei vivi | ✅ solo verbale congelato (+ pattern nel registro) |
| `rg "Dodici casi"` | ✅ `INT_00` §9.4 · handoff · (roadmap §8) |
| Diff `12_Handoff` vs HEAD | ✅ +10/−11, solo stato/mandato, nessuna sezione persa |
| Conteggio A/B (shell) | A=31 · B=16 (non scritto nei file — regola a comando) |
| `npm run validate` | non applicabile (solo docs binario privato) |

---

## 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| nessuno (skill area app) | — | task solo binario crescita/valutazione; nessuna skill Prenota/Menu/Admin |
| bussola / registro fonti | già esistenti; registro aggiornato | contromisura `MET-2`, non skill prodotto |

---

## 6. Dati comunicazione

- Frasi ricorrenti: «2 chiudiamo igiene» · «procedi pure e allinea anche la documentazione rimanente» · «poi fai report».
- Formato che ha funzionato: tabella a 3 parole (Dodici / Blocco 7 / A comando) prima del tocco su `INT_00`.
- Automatizzabile: controprova `rg` del registro dopo ogni allineamento numeri.
- Non automatizzato: decisione della cifra del contatore (serve la parola di Matteo).

### Analisi flusso prompt / statistiche

- Prompt sostanziali Matteo: 3 (orientamento · scelta 2 igiene · procedi+report).
- Correzioni dopo 1ª risposta: 0 sulla sostanza; una richiesta di conferma a 3 parole prima di editare `INT_00`.
- Modalità: standard (igiene documentale, non seduta).
- Replicare: «una parola per punto» prima di toccare file LOCK/vincolanti.

---

## 7. Analisi flusso prompt, efficienza e statistiche

Vedi §6. Attrito principale: lo stato dichiarato in handoff/plan era già stale rispetto ai file (`WP-2` in corso mentre WP-5 era passato) — si chiude solo aprendo i file, non le sintesi.

---

## 8. La TUA lettura della sessione

- **Impressioni:** la bussola ha instradato bene (igiene ≠ interrogazione). Il registro fonti ha reso `SS-5` eseguibile senza inventare proprietari.
- **Difficoltà:** contatore `MET-2` mescola totale corrente e etichette storiche («decimo caso»); risolto tenendo le etichette e aggiornando solo i totali vivi.
- **Migliorie (dato, non modifica):** aggiungere in bussola §2 una riga «igiene `SS-5` / allineamento numeri» → Redattore + registro, così non si confonde con Metodo.

---

## 9. Derivazione errori

| Cosa | Classe | Come si evita |
|---|---|---|
| Handoff/plan dicevano ancora «WP-2 in corso» a WP-5 fatto | **bug preesistente** (stesso tipo del 12° `MET-2`) | proprietario stato WP = solo riquadro plan; handoff = rimando |
| Rischio di riscrivere verbali «Otto» | **evitato** (vincolo strutturale + scelta) | congelati = snapshot; totale solo nei vivi |

Nessun errore agente sul tocco: conferma a 3 parole prima di `INT_00`.

---

## 10. Cosa resta per la prossima sessione

1. ⭐ **Condurre Blocco 7** — `AR-02…AR-11` + `ES-2` in coda (bussola linkata).
2. Decisioni `PAO-1…PAO-4` (frase Paolo) quando vuoi, fuori seduta.
3. `SS-4` / `WP-6` hook: solo se dopo qualche seduta il bootstrap senza path fallisce ancora.
4. Verifiche `VER-1`/`VER-2` in coda (non alzano livelli finché non fatte).

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «sei agente senior. parti da …00_BUSSOLA… e dimmi come dobbiamo proseguire seguendo ordine generale e a che punto siamo» · (2) «2 chiudiamo igene.» · (3) «procedi pure e allinea anche la documentazione rimanente. poi fai report del lavoro che hai svolto e proseguiamo»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato: `INT_00` §9.4 = Dodici; handoff contatore + materiale + righe 10/6 + stato WP; `12_Handoff` diff +10/−11; registro fonti tabella ✅; nota n.3 in `REGISTRO_RIGHE_APERTE`; roadmap §7 riga SS-5; `rg Otto casi` = solo verbale congelato.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati i citatori vivi del registro (INT_00, handoff, 12_Handoff, plan IDEA-4, plan revisione, roadmap). Nessuna skill area app — il task non tocca prodotto. Congelati lasciati volutamente.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho riscritto le voci di log roadmap che ancora raccontano «WP-2 in corso» o «14 file» (regola §6: niente riscritture silenziose). Non ho toccato `PAO-*`, Blocco 7, `SS-4`/hook. Non ho committato (non richiesto).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito = «Dodici» mescola totale e storie di caso; miglioria = in registro fonti una colonna esplicita «totale da citare» vs «etichetta storica ok».

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto (bussola → handoff → plan → registro). Hook fine-sessione non ancora scattato al momento della scrittura; utile la regola Q/R del report.

---

## 12. Self-review del report

1. Dati = diff: sì, riaperti i file chiave.  
2. Correlati: vivi sì · congelati no (voluto).  
3. Q1–Q6 compilate con sostanza.  
4. Prossimo passo chiaro: Blocco 7.
