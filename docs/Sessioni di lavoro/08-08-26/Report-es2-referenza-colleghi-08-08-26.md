# Report — Conferma dichiarata + foglio referenza + ES-2

**Data:** 08-08-26 · **Branch app:** n/d (lavoro in `docs/_lavoro/` gitignored + cartella B Io-Claude) · **Profilo:** Conduttore (§10) + Redattore  
**Modalità:** standard (non abbassata) · **Esito:** Fase 0–1 chiuse · `ES-2` **FALLISCE** · capitolo chiusura report

> **Cosa è cambiato:** bancone/organico sono segnati come «i colleghi lo confermerebbero» (dichiarato da te, non ancora firmato); esiste una bozza corta da far firmare a Paolo, Elena e Andrea; l’esercizio ES-2 è stato fatto e non ha reso dichiarabile la skill «vedo un problema e lo trasformo in prodotto».
> **Cosa resta:** far convalidare di persona il foglio · Blocco 2 (dopo riformulare `B-07`) · niente `ES-3` aperto qui.
> **Serve una tua azione:** sì — far leggere/firmare la bozza a Paolo, Elena, Andrea.

---

## 1. Cappello (effetto)

Per te: hai un foglio concreto da far firmare (non più solo «quando chiamo Paolo»). Per la valutazione: la prova «bisogno non dichiarato → prodotto» **non** passa (falso positivo sulla scena che stava bene), anche se sulle due scene rotte hai visto i punti giusti.

---

## 2. Cosa è stato fatto (cronologico)

1. Apertura su bussola + protocollo §9.8 / §10 / §10.4bis + ES-2 + verbali Al Ritrovo + INT_03 §8 + registro fonti.
2. **Fase 0:** stato «CONFERMA DICHIARATA DA MATTEO» su bancone / schema / organico · Andrea nominato · niente «PROVA piena / già firmato».
3. **Fase 1:** bullet Sì/No → bozza referenza con i tuoi Sì (formazione, drink, problem solving, strumenti AI-assisted in uso, fornitori).
4. Privacy: rimossi cognomi di Elena e Lucrezia dai file della seduta.
5. **Fase 2:** chiave ES-2 sigillata **prima** delle scene · tre scene fuori ristorazione · una alla volta · carta e testa.
6. Esito ES-2 scritto (registro, verbale, chiave, roadmap, handoff).

---

## 3. File toccati e perché

| File | Perché |
|---|---|
| `…/Verbali/Verbale-Blocco-7-AlRitrovo-08-08-26.md` | Conferma dichiarata · Andrea · verifica assegnata · coda ES-2 chiusa |
| `…/Verbali/Verbale-Prova-Metodo-AlRitrovo-08-08-26.md` | Organico: conferma dichiarata ≠ PROVA piena |
| `…/REGISTRO_RIGHE_APERTE.md` | Righe 11/23/nomi/31 stato |
| `…/Referenze/BOZZA_Referenza-Colleghi-AlRitrovo-08-08-26.md` | **Nuovo** — foglio fatti da convalidare |
| `…/Esercizi/ES-2_CHIAVE_SIGILLATA.md` | **Nuovo** — chiave + esito |
| `…/Esercizi/INT_05_ESERCIZI.md` | Riga registro ES-2 |
| `…/Verbali/Verbale-ES-2-08-08-26.md` | **Nuovo** — verbale esercizio |
| `…/00_HANDOFF_UNIFICATO.md` | ES-2 fatto · prossima = Blocco 2 |
| `…/REGISTRO_FONTI_DI_VERITA.md` | ES-2 non più «in coda» |
| `Io-Claude/…/13_Roadmap_Complessiva.md` §7 | Riga movimento ES-2 (+ log SS-5/B7 già pending) |
| `Io-Claude/…/00_Profilo_Matteo.md` | Riga NOTE DI EVOLUZIONE sessione ES-2 |

---

## 4. Test eseguiti e risultato

Nessun `npm run validate` — regime carta/testa, niente codice app.  
Controllo fatto: riapertura chiave vs risposte · denominatore 2/2 · 1/1 FP · esito FALLISCE allineato a `INT_05`.

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| nessuno (skill area app) | — | Binario crescita/valutazione: non tocca Prenota/QR/Admin skill |
| `INT_05` / handoff / bussola (puntatori) | stati ES-2 | Proprietari del binario, non skill prodotto |

---

## 6. Dati comunicazione

- Frasi ricorrenti: «confermato dai colleghi» · «non sto mentendo» · Sì sui bullet · «rimuovi i cognomi» · «lavoro ok e fai report finale» · «otttima sessione».
- Formato che ha funzionato: scene una alla volta · compito ES-2 verbatim · chiusura in tre punti semplici.
- Prompt sostanziali: mandato lungo Fase 0→1→2 · risposte ES-2 lunghe stile PDR/agente · privacy cognomi.

### Cosa automatizzare vs manuale
- Automatizzabile: template chiave sigillata + registro INT_05 + checklist §10.3.
- Manuale: convalida referenza di persona · giudizio grado 1/2 sulle risposte · scelta scene fuori dominio.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: ~6 (mandato · bullet · privacy · 3 risposte ES-2 · chiusura).
- Correzioni dopo 1ª risposta: 1 (cognomi).
- Modalità alzata: no.
- Anatomia: mandato molto preciso (evita MET-2 sul «PROVA piena»); risposte ES-2 ricche di prodotto — sulla sana spingono al FP proprio perché il «prompt all’agente» è il riflesso abituale.

---

## 8. La TUA lettura della sessione

- **Impressioni:** ordine Fase 0→1→2 rispettato; chiave prima delle scene rispettata; il falso positivo sulla 3 è esattamente il bordo MILE-1 (timbrare anche i negativi) applicato a lui.
- **Difficoltà:** encoding/path su file `_lavoro` (Glob/Grep ciechi; fix via Python); tension INT_03 «non autonomia / Menu QR» vs bullet 7 approvato → formulato come consegna/uso.
- **Migliorie (dato, non modifica):** in ES-2 aggiungere in somministrazione una riga tipo «se la giornata regge già, puoi dire che non serve software» — senza rivelare quante scene sono sane — per ridurre FP da abitudine «sempre un PDR».

---

## 9. Derivazione errori

| Cosa | Classe | Evitabile così |
|---|---|---|
| Cognomi in chat/file | errore agente (privacy non anticipata) | default solo nomi di battesimo per terzi non firmatari |
| StrReplace falliti su em-dash/· | vincolo strutturale / tooling | script Python su path gitignored |
| FP scena 3 | non è bug — è esito di prova | (nessuno: è il dato) |

---

## 10. Cosa resta per la prossima sessione

- Convalidare bozza referenza (Paolo · Elena · Andrea).
- Blocco 2 dopo riformulare `B-07`.
- ⛔ Non `ES-3` finché non scelto esplicitamente.
- Nessun FU-NNN app: fuori prodotto.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Mandato lungo Conduttore+Redattore Fase 0 conferma dichiarata → Fase 1 bozza referenza → Fase 2 ES-2. (2) Approvazione bullet 4–8 con riformulazioni (formazione; drink; problem solving; strumenti AI-assisted agenda/menu QR/prenota; fornitori). (3) «rimuovi i cognomi di elena e di lucrezia». (4–6) Tre risposte ES-2 (gestionale magazzino multi-terminale; pagina prenota fisio; automazione officina bici + richiesta chiarimenti ricambi). (7) «lavoro ok e fai report finale. otttima sessione».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti `INT_05` riga ES-2 · `ES-2_CHIAVE` esito · `Verbale-ES-2` · handoff header «ES-2 FALLISCE» · roadmap §7 riga ES-2 · bozza Referenze esiste · `check-ignore` conferma `_lavoro` ignorato. Denominatore 2/2 e 1/1 FP coerenti tra chiave/verbale/INT_05.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area prodotto (Prenota/QR/Admin) — sessione solo binario valutazione. Allineati i proprietari del binario: INT_05 · verbali · registro · handoff · REGISTRO_FONTI · roadmap §7 · profilo log. Rubrica 7 criteri non toccata (LOCK).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho fatto firmare il foglio (è azione tua). Non ho aperto Blocco 2 / ES-3 / B-07. Non ho aggiornato INT_03 §8 con la bozza nuova come frase definitiva (resta BOZZA da definire; il foglio Referenze è l’artefatto operativo). Non committo `docs/_lavoro/` (gitignore). Non includo nel commit app `EVOLUZIONE_SKILLS.md` né Report-ss5 di altre chat.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito = tool di search ciechi su gitignore + rischio MET-2 su «PROVA» vs «conferma dichiarata». Miglioria = in bussola/routing una riga «terzi in chat = solo nome» e in ES-2 una frase consentita «può non servire software» senza rivelare il conteggio dei negativi.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto (bussola → INT_00 §10 → INT_05 → verbali → INT_03 §8 → fonti). Hook fine-sessione utile sul blocco Q/R; rumore nullo su PROD/app perché non toccati.

---

## 12. Self-review del report

1. Dati = file riaperti (chiave/INT_05/handoff/roadmap).  
2. Correlati binario allineati; skill app N/A.  
3. Q1–Q6 coerenti con FALLISCE e Fase 0/1.  
4. Tono: effetto concreto (foglio da firmare · skill non dichiarabile).

**Report pronto** per «report finale» (commit selettivo sotto).
