# Report sessione — Intervista di sezione S4 + plan build (24-06-26)

**Tipo:** chat senior (orchestratore) con Matteo. **Esito:** intervista S4 chiusa (decisioni D44–D52),
documentazione allineata, plan di build a 2 tracce parallele pronto + 2 prompt di avvio.
**Codice toccato:** nessuno (solo documentazione). **Branch doc:** `env/test`.

---

## 1. Punto di partenza (ricostruzione stato reale)

Matteo aveva aperto `S0_ORCHESTRATOR_HANDOFF.md` chiedendo il "prossimo prompt esecutore". Verifica:
quell'handoff era **stale** (diceva "prossimo = S1"). Stato reale al 24-06-26:

- **S0, S1, S2, S3 tutti chiusi e IN PRODUZIONE** (S3 rollout PROD 23-06: edge `create-booking` v22,
  mig. 057→062, PrenotaZen rilasciata).
- Il prossimo per sequenza è **S4** (Motore turni automatici, Pro), che però **parte da un'intervista
  con Matteo** sulle 6 domande di design "materiale S4" (lista C: C1/C3/C4/C5/C7/C8).

Decisione di Matteo: **fare l'intervista subito, IO + lui.**

## 2. Intervista S4 — domande e decisioni di Matteo

| # | Domanda (lista C) | Decisione di Matteo |
|---|---|---|
| **D44** (C1) | Forma tavolo: selettore in UI o forma fissa? | **Forma fissa, default = QUADRATO** (non più tondo). Niente selettore (disciplina vendi-semplice). Il codice delle 3 forme resta e si riusa in futuro se i clienti si lamentano. |
| **D45** (C3) | Walk-in senza tavolo: voluto o bug? | **È un bug → si fixa.** Modello binario: utente CON tavoli-servizio → walk-in tiene conto dei tavoli; utente SENZA → walk-in tiene conto solo delle disponibilità per fascia. Il walk-in **conta sempre** nel conteggio complessivo. Interruttore unico "modalità-tavoli" condiviso con C5. |
| **D46** | (emersa da C3) Come si calcola la capienza sala? | **Capienza sala = somma dei coperti dei tavoli.** Sala da 20 = "10×2" oppure "1×20"; l'utente carica i coperti per tavolo, la pienezza si deduce. Conteggio fatto **col cliente in onboarding**. |
| **D47** | (emersa da C3) Durata di default del walk-in? | **Manopola di console super-admin:** da console Matteo vede le fasce del cliente e imposta il default-walk-in per quell'azienda. Passa dal risolutore S2. |
| **D48** (C4) | Checkout: timbro o cancellazione fisica? | **Sempre timbro (append-only), mai cancellazione fisica.** Coerente con conto append-only (D27) e statistiche (D32). |
| **D49** (C5) | Pannello assegnazioni: guard o sempre visibile? | **Predicato unico "modalità-tavoli" = (edizione Pro) E (≥1 tavolo configurato).** Classic non vede il motore tavoli; Pro-senza-tavoli → **stato-vuoto invitante (opzione A)**; Pro-con-tavoli → mappa viva. |
| **D50** (C7) | Eliminazione sala: orfani accettabili? | **A + C con conferma esplicita.** Cancellazione morbida; sala "scarica" → diretta, sala "viva" (prenotazioni/sessioni) → **non bloccata ma conferma esplicita** con reminder ("dovrai riassegnare + ricreare"); le **prenotazioni tornano nel cassetto "da assegnare", mai perse**. (Sintesi delegata a me, approvata da Matteo.) |
| **D51** | (idea di Matteo su C7) Conservazione dati | **Conservazione a livelli monetizzata da Analytics:** Analytics attivo → dati storici migrano/aggregano in Analytics; non attivo → potatura oltre la finestra operativa (risparmio storage). **Follow-up** (`FU-SERV-ANALYTICS-RETENTION-1`); S4 rende solo i dati *archiviabili*. |
| **D52** (C8) | Briefing: sala+tavolo o solo tavolo? | **Sala + tavolo solo se più di una sala** (opzione C). Mono-sala = "T12"; multi-sala = "Sala · T12"; non assegnate = "—". |

### Correzione esplicita di Matteo — vincolo GTM
Il masterplan §9 conteneva un freno di una review esterna: *"non costruire S4/S6 prima di avere 10-15
clienti Classic"*. **Matteo ha dichiarato di non averlo mai richiesto e di non adottarlo.** Marcato in §9
come parere esterno NON adottato; **S4 è libero di partire ora**.

### Osservazioni senior emerse durante l'intervista (registrate nelle decisioni)
- Walk-in senza tavolo deve comunque **togliere posti al pubblico** o si genera sovrapprenotazione.
- Serve **un solo predicato "modalità-tavoli"** condiviso (walk-in + capienza + guard) — non interruttori diversi.
- In modalità-tavoli resta il **cassetto "da assegnare"** (prenotazioni online accettate ma non ancora piazzate).
- "Cancella da servizio" della conservazione dati **non deve mai toccare sessioni/conti aperti**; downgrade
  Analytics = conserva-e-nascondi, non distruggere.
- Il cancello-conferma di D50 dovrà, in S4-LIVE, contare anche i **conti aperti**.

## 3. Documentazione aggiornata

- `docs/MASTERPLAN_SERVIZIO.md`: §3 nuove decisioni **D44–D52**; §7 stato S4 (intervista fatta, design-ready);
  §9 nota correzione vincolo GTM; §13 nuovo follow-up `FU-SERV-ANALYTICS-RETENTION-1`.
- `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md`: nuova §9 (decisioni design S4, non ancora implementate).
- `docs/Sessioni di lavoro/22-06-26/S0_ORCHESTRATOR_HANDOFF.md`: corretto (non dice più "prossimo = S1").
- `docs/Sessioni di lavoro/24-06-26/S4_PLAN.md`: **nuovo** — plan di build a 2 tracce parallele.
- Questo report.

## 4. Plan di build — due orchestratori in parallelo (richiesta di Matteo)

Diviso in **due tracce file-disgiunte**, ciascuna su branch separato, con numeri di migrazione riservati,
per non collidere su git:

- **Traccia A — Strutturale** (`s4/track-a-strutturale`, basso rischio, Haiku-friendly): D44 forma quadrata,
  D50 elimina-sala morbida (mig. 063), D52 briefing join.
- **Traccia B — Motore** (`s4/track-b-motore`, alto rischio, Sonnet): D49/D46 predicato modalità-tavoli +
  capienza, D45 walk-in, D48/D24/D23 checkout append-only + stati tavolo, finestre di occupazione/turni/Edge
  (D37/D22/Q19/D39/D25/D40), mig. 064–069.

**Workflow:** ogni orchestratore (Opus) prepara i prompt esecutore con la skill "prepara prompt", lancia
subagent (**Haiku quando basta, Sonnet al massimo**) e fa lui la revisione a checkpoint/fine.

**Mandato di autonomia (Matteo):** l'intervista è fatta, il lavoro va chiuso. Gli orchestratori lavorano
**fino a completare tutta la traccia + auto-revisione**, correggono i fix che trovano e proseguono, **senza
chiedere autorizzazioni**. **Unico muro = `main` e PROD** (testa Matteo prima): niente merge su main, niente
scritture PROD `rwuxgvld`, niente `release:prenotazen`. Tutto il resto (branch di traccia + TEST
`docnnernvp`) è pre-autorizzato.

## 5. Prossimi passi

1. Matteo lancia **2 chat Opus** con i due prompt di avvio (forniti in sessione) → gli orchestratori girano
   in parallelo fino a chiudere le tracce.
2. **Integrazione finale** (passo separato, con Matteo): merge Traccia A → `env/test`, poi Traccia B; blindatura
   congiunta (archetipi §11); rollout PROD (mig. 063→069 + Edge + client insieme) **solo con ok di Matteo**.
3. A S4 chiuso: aggiornare masterplan §7 (S4 → ✅) e handoff.

---

## 6. Domande di chiusura

❓ Q1 — Prompt ricevuti (verbatim i sostanziali).
✅ R1: (1) «prepara prompt — leggi handoff orchestrator e aiutami a proseguire con prossimo prompt per
esecutore (dimmi anche modello che eseguirà)». (2) «facciamo io e te». (3) C1: «dico B ma con tavoli
quadrati. e in futuro se clienti si lamentano riusiamo codice per forme». (4) C3: «è un bug, dobbiamo
sistemarlo… o utente ha versione con tavoli servizio configurata, o non ce l'ha… cosa ne pensi ci sono
problemi in merito che non stiamo considerando??». (5) C3-seguito: «si fixiamo walkin contano nel conteggio
complessivo / ok / ogni persona ha un tavolo… capienza dedotta dai coperti tavolo / walkin default
configurato in console / siamo daccordo». (6) C4 «A confermo». (7) C5 «A». (8) C7: «lo risolviamo furbamente
in base a se cliente ha attivo o no pacchetto analytics…». (9) C7-seguito: «A e C con richiesta di conferma
esplicita… utente può farlo ma dovrà riassegnare… scegli tu». (10) C8 «C». (11) «aggiorna tutta
documentazione e handoff, e crea il plan dedicato… il vincolo di 10 15 clienti io non l'ho chiesto… plan
dedicato ad hoc che gestira orchestrator lanciando subagent con skill prepara prompt». (12) «dividi il plan
in modo che possa lanciare 2 orchestrator che potranno lavorare in parallelo… dai a me i 2 prompt di avvio».
(13) «agenti dovranno continuare finché non avranno finito… unica cosa che non fanno è merge su main e prod…
possono svolgere TUTTO senza chiedermi autorizzazioni». (14) «fai report finale lavoro svolto e intervista
fatta a me con mie decisioni e commit».

❓ Q2 — Dati = diff reale?
✅ R2: Sessione solo-documentazione. Ogni domanda d'intervista è stata ancorata a **codice reale letto**:
`TableShape.tsx`/`TableFormModal.tsx`/`useServizioTables.ts` (forma, D44), `tableCheckout.ts`+
`useTableAssignments.ts` (checkout DELETE/UPDATE, D48), `useRooms.ts` (DELETE fisico sala, D50),
`useShiftBriefing.ts` (join TODO, D52), `ServizioPage.tsx:332` (AssignmentMapPanel senza guard, D49),
`database.ts` (verificato: `tables.active` esiste, **`rooms.active` NO** → serve mig. 063). I file/righe citati
nel plan corrispondono al codice attuale. Le decisioni nel masterplan §3 corrispondono parola-per-parola alle
risposte di Matteo qui sopra.

❓ Q3 — File correlati allineati?
✅ R3: `MASTERPLAN_SERVIZIO.md` (§3 D44–D52, §7, §9 nota GTM, §13 FU), `ADMIN_SERVIZIO_CONTEXT.md` (§9),
`S0_ORCHESTRATOR_HANDOFF.md` (corretto), `S4_PLAN.md` (nuovo), questo report. Memoria
`project-servizio-s3-stato` aggiornata allo stato S0-S3-in-PROD + S4-intervista-fatta + plan 2 tracce.

❓ Q4 — Cosa NON ho fatto / lasciato a metà.
✅ R4: (a) **Nessun codice** — per design (intervista + regia, non implementazione). (b) **Non ho lanciato i 2
orchestratori** (è azione di Matteo). (c) **Integrazione + rollout PROD** rimandati (passo separato con ok di
Matteo). (d) Durante il commit ho trovato una modifica **in-flight non mia** in `useServizioTables.ts` (il
default `shape:'square'` = D44, già iniziata dalla Traccia A): **lasciata fuori dal mio commit**, non l'ho
toccata. (e) Non ho forzato l'allineamento dei branch di traccia su `env/test` aggiornato (vedi nota workflow).

❓ Q5 — Attrito + miglioria nel workflow.
✅ R5: Attrito 1: i due orchestratori paralleli sembrano girare nella **stessa working directory** (è apparsa
una modifica D44 non mia mentre committavo) → rischio di pestarsi su git/working tree. **Miglioria: ogni
orchestratore in un git worktree/clone separato**, non la stessa cartella — altrimenti la divisione
file-disgiunta non basta a evitare collisioni sul working tree condiviso. Attrito 2: confusione di nomi — il
file `S4_REPORT.md` del 23-06 in realtà conteneva i **4 fix UI di S3**, non la sotto-area S4 (annotato in
memoria per non trarre in inganno la prossima sessione).

❓ Q6 — Contesto & hook: troppo / giusto / poco?
✅ R6: Giusto. Il `VOCABOLARIO`/CLAUDE.md ha guidato i grilletti chiave: «prepara prompt» (modalità filtro),
«fai report finale» (= commit+push). Il masterplan §3 + baseline-map S0 hanno dato le 6 domande verbatim,
evitando di inventarle. Hook fine-sessione **utile**: ha (giustamente) bloccato il commit finché il report non
aveva le domande di chiusura — questa sezione.

---

## 7. Self-review del report

1. **Decisioni = parole di Matteo** — D44–D52 ricalcano le sue risposte (Q1), non interpretazioni.
2. **Ancoraggio al codice** — ogni domanda verificata su file reali (Q2); `rooms.active` mancante confermato.
3. **Limiti dichiarati** — Q4 ammette: nessun codice, orchestratori non lanciati, modifica in-flight D44 lasciata fuori.
4. **Tono utente** — sintesi per flussi concreti (walk-in, mappa-sala, briefing), non nomi-file isolati.

---

*Report finale sessione 24-06-26. Nessun codice modificato; solo documentazione e regia del build S4.*
