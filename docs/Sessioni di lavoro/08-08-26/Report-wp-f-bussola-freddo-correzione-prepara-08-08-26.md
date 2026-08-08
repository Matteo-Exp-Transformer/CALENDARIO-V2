# Report — WP-F rilettura a freddo bussola + correzione + prepara WP-G

**Data:** 08-08-26 · **Branch:** `env/test` (file `_lavoro` gitignored; cartella B Io-Claude modificata) · **Profilo:** Esecuzione → poi filtro «prepara»  
**Modalità:** light (alzata di fatto a report standard su richiesta «fai report») · **Esito:** `WP-F` ✅ · bussola allineata ai 3 «no» · prompt WP-G consegnato · niente commit

> **Cosa è cambiato:** ora sai se la bussola mentiva su altri numeri/stati (sì: tre), e quei tre punti sono stati sistemati a tua parola. Il prompt per la prossima chat (riga playbook nel registro idee) è pronto da incollare.
> **Cosa resta:** `WP-G` (meccanico) · `WP-A2` bloccato finché non dici «Quattordici» · 4 reperti in bussola senza proprietario (non toccati).
> **Serve una tua azione:** sì — (1) incollare il prompt WP-G in una chat nuova, oppure (2) se vuoi chiudere il caso 14 del contatore, dire «Quattordici» e aprire `WP-A2`.

---

## 1. Cappello (effetto)

Un agente che apre la bussola non legge più «collaudata» quando il collaudo non vale, non confonde «sospeso» con «fermo» sui tre cantieri fermi, e non crede che la domanda scomoda B-07 sia ancora da riscrivere. `WP-F` è chiuso sul plan; la correzione è stata tua decisione, non dell’agente di confronto.

---

## 2. Cosa è stato fatto (cronologico)

1. **WP-F (confronto, zero correzioni):** estratti da bussola numeri/stati/path; confrontati coi proprietari del registro fonti; path routing §2 verificati sul disco; tabella in chat (**28** valori · **3** «no» · **4** reperti).
2. **Chiusura ritmo WP-F:** riquadro STATO plan → `WP-F` ✅; una riga in roadmap §7 (Io-Claude).
3. **Tua decisione «correggi bussola»:** applicati i 3 «no» + il rimando a «righe 11-14» (reperto di drift).
4. **«prepara prompt»:** prompt auto-contenuto per **solo `WP-G`** (append in `EVOLUZIONE_SKILLS.md`, no commit); `WP-A2` escluso (bloccato).
5. **Questo report** su «fai report del tuo lavoro svolto» (no commit/push).

---

## 3. File toccati e perché

| File | Perché |
|---|---|
| `…\Valutazione Personale\PLAN_IDEA-5_TRACCIAMENTO_METODO_08-08-26.md` | STATO: `WP-F` ✅ CHIUSO |
| `…\Io-Claude\Crescita professionale\13_Roadmap_Complessiva.md` | §7: riga log WP-F |
| `…\Valutazione Personale\00_BUSSOLA_VALUTAZIONE.md` | Correzione post-WP-F (3 «no» + rimando §0/§4) |
| `docs/Sessioni di lavoro/08-08-26/Report-wp-f-bussola-freddo-correzione-prepara-08-08-26.md` | Questo report |

**Solo letti (confronto WP-F):** registro fonti · handoff §4 · roadmap §3/§4/§7 · plan IDEA-4 STATO · `11_Valutazioni` (rubrica 7) · path sul disco. ⛔ Non aperti: `INT_00` intero, `INT_02`, verbali, `INT_04`/`INT_05`, mining (vincolo sessione).

---

## 4. Test eseguiti e risultato

Nessun `npm run validate` (binario crescita/valutazione, zero codice app).  
Verifica: `Test-Path` sui path routing §2 → tutti risolvibili; conteggio a comando cartelle A/B = **40** / **16** md (bussola non riporta un numero di file — coerente).

---

## 5. File di skill aggiornati

| file | modifica | perché |
|---|---|---|
| nessuno | — | nessuna skill area dell’app copre la bussola privata; `EVOLUZIONE_SKILLS` non toccato (è `WP-G`) |

---

## 6. Dati comunicazione

- **Frasi ricorrenti:** «correggi…» dopo elenco divergenze (1) · «prepara prompt» subito dopo (1) · «fai report…» (1). Stesso schema di `SS-5`: prima elenco, poi parola/correzione, poi chiusura.
- **Formato che ha funzionato:** tabella confronto con `file:riga` entrambe le parti · chiusura in parole semplici senza sigle.
- **Prompt annotati (verbatim):**
  1. Prompt lungo WP-F (Profilo Esecuzione · Modalità light · solo WP-F · tabella obbligatoria · zero correzioni · chiusura ritmo plan+roadmap).
  2. «correggi bussola, poi prepara prompt per prossima sessione»
  3. «fai report del tuo lavoro svolto.»
- **Automatizzabile:** checklist WP-F (estrai → proprietario → path → tabella) è ripetibile.  
  **Manuale:** quali «no» correggere e in che ordine (tua decisione, una per punto).

---

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **3** (WP-F · correggi+prepara · report).
- Correzioni dopo 1ª risposta: **0** sul confronto; la correzione bussola era mandato esplicito, non ritocco.
- Follow-up generati: **1** (prompt WP-G).
- Modalità alzata: sì — light → report completo su richiesta.
- **Anatomia:** il prompt WP-F era stretto (vincoli «non caricare», un WP, zero correzione) e ha tenuto lo scope. «correggi + prepara» in un messaggio ha funzionato perché i «no» erano già in tabella.

---

## 8. La TUA lettura della sessione

- **Impressioni:** il vincolo «confronto ≠ correzione» ha retto: la tabella in chat era l’unico deliverable di WP-F; la correzione è arrivata solo dopo la tua parola. Utile. Il plan nel frattempo aveva già `WP-A2` e la riga senior in roadmap: il riquadro STATO andava aggiornato con cautela (tenere `WP-A2` DA FARE).
- **Difficoltà:** (1) proprietari `INT_02`/`INT_05` vietati in sessione → stati blocco letti da handoff (proprietario ufficiale «stato blocchi») e registro «Stato oggi» dove serviva; (2) path corti tipo `Referenze/…` vs root vs `Interrogazioni Valutative\` — risolti come `Esercizi/`.
- **Migliorie (dato, non modifica):** dopo una correzione post-WP stile `SS-5`, una riga di log in roadmap §7 «bussola allineata ai N no di WP-F» eviterebbe che il log dica solo «zero correzioni» mentre la chat ha corretto subito dopo. Non l’ho aggiunta (non era nel mandato).

---

## 9. Derivazione errori

| Cosa | Classifica | Da cosa / come evitarlo |
|---|---|---|
| Bussola diceva «B-07 va riformulata» mentre handoff aveva già `B-07bis` | **bug preesistente** (copia stale, stessa famiglia del «restano 11») | WP-F esiste per questo; correzione solo su tua parola |
| «collaudato» in testa bussola vs WP-5 non misurabile | **bug preesistente** + decisione senior («nessun doc dice bussola collaudata») | non scrivere esiti di collaudo sull’oggetto testato |
| Plan STATO cambiato mentre leggevo (apparso `WP-A2`) | **vincolo strutturale** (file vivo condiviso) | ri-leggere il riquadro prima di scrivere; non sovrascrivere voci nuove |
| Nessuna difficoltà di esecuzione sul prompt WP-F | — | — |

---

## 10. Cosa resta per la prossima sessione

- **WP-G** — prompt già consegnato in chat precedente (append riga playbook in `EVOLUZIONE_SKILLS.md`, no commit).
- **WP-A2** — bloccato su parola **«Quattordici»** (contatore `MET-2` 14 nel proprietario vs 13 nei vivi).
- Reperti lasciati in bussola: «sei posti» / «dieci sessioni» / aritmetica 1+5 (senza proprietario in registro) — non corretti di proposito.
- ⛔ Nessuna riga nuova in `docs/FOLLOW_UP.md` app: fuori perimetro prodotto.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt WP-F completo: Profilo Esecuzione · Modalità light · solo WP-F · tabella confronto obbligatoria · zero correzioni · STATO plan + riga roadmap · non fare WP-G. (2) «correggi bussola, poi prepara prompt per prossima sessione». (3) «fai report del tuo lavoro svolto.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti: bussola riga 9 (no «collaudata») · riga 36 (§0+§4) · riga 56 (C5/C6/C7 etichette) · riga 115 (B-07bis) · plan riga 9 (`WP-F` ✅ · `WP-G`/`WP-A2` DA FARE) · roadmap §7 riga WP-F (28 · 3 «no»). Confermati.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: nessuno skill area app — bussola/plan/roadmap sono binario privato; handoff resta proprietario dello stato blocchi (bussola §6 ora allineata a handoff su B-07bis). `EVOLUZIONE_SKILLS` non toccato (WP-G).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho corretto i 4 reperti (sei posti, dieci sessioni, 1+5, e il drift era già sistemato nel quarto). Non ho scritto riga roadmap sulla correzione post-WP-F. Non ho eseguito WP-G né WP-A2. Non commit/push. Certo perché fuori dal mandato o bloccati.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito = plan vivo aggiornato da altre chat mentre WP-F era in corso (STATO con WP-A2 apparso a metà). Miglioria: nel prompt WP «rileggi STATO subito prima di scrivere» come passo obbligatorio di chiusura ritmo.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto (bussola + plan WP-F/§4/§5 + registro + soli proprietari). Vincolo «non caricare INT_02/verbali» ha stretto bene. Nessun hook stop in questa fase; il report Q/R è compilato per non farlo scattare a vuoto.

---

## 12. Self-review del report

1. **Dati = diff reale:** sì, riaperti i file sopra.  
2. **File correlati:** nessun skill app da allineare.  
3. **Q1–Q6:** coerenti col lavoro.  
4. **Tono:** cappello e chiusura in effetti per te, non solo path.

**Report pronto.** Niente commit (non è «fai report finale»).
