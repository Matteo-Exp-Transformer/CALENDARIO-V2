# Piano multi-agente — chiusura dei lavori aperti dopo il capitolo Servizio

> **Data:** 06-08-2026 · **Branch:** `env/test` · **Ambiente:** solo TEST (`docnnernvp`)
> **Come si usa:** alleghi questo file all'agente e gli scrivi *«esegui il prompt P3»*. Ogni prompt
> è autosufficiente: contiene mandato, fatti già verificati, criterio di uscita e confini.
> **Fonte delle decisioni:** intervista a Matteo del 06-08-2026, §1.
> **Collaudo manuale collegato:** [`COLLAUDO_MANUALE_OBBLIGATORIO.md`](../../Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md)

---

## 1. Decisioni prese da Matteo (06-08-2026) — non riaprirle

| # | Domanda | Decisione |
|---|---|---|
| D-1 | Primo cantiere dopo il collaudo | **Atomicità** delle scritture multiple |
| D-2 | Quante scritture non atomiche chiudiamo | **Solo le 2 più rischiose**: sostituzione guidata tavolo occupato + salvataggio Menu QR. Le altre 6 restano censite in `FU-ALL-ATOMICITA-1` |
| D-3 | Rollout in produzione | **Solo dopo collaudo umano verde**, con autorizzazione esplicita a parte |
| D-4 | Soglia ritardo / buffer riassetto / durata walk-in | **Valori attuali confermati** (15' / 0' / 90'). Nuovo lavoro: renderli modificabili dalla **console super-admin** (verificato: oggi **non** lo sono) |
| D-5 | Elimina tavolo non consuma il turno, elimina sala sì | **Vince il tavolo**: anche eliminare una sala **non deve consumare** il turno |
| D-6 | Badge capienza in Calendario | **Sempre i posti fisici** quando la sala è configurata; **ripiego sui coperti delle fasce** quando non lo è. L'app deve avere obbligatoriamente A (limiti fascia) **o** B (sala configurata) |
| D-7 | Fix piccoli inclusi | PDF con colonna Tavolo · nomi e messaggi incoerenti · 14 link rotti nei documenti |
| D-8 | Legale Brevo | **Prepara tutto**: bozze pronte da portare al professionista e da pubblicare |

### Nota di progetto su D-6 — come l'app capisce che la sala è configurata

Non per deduzione («esiste almeno un tavolo»): un locale configurato a metà mostrerebbe «8 / 12» e
sembrerebbe pieno. Serve un **interruttore esplicito** che Matteo accende dalla console quando ha
finito di configurare quel cliente. Nuova chiave `service_layout_confirmed` (booleana, default
`false`), creata da **P5** ed esposta nella console dallo stesso prompt; **P6** la consuma.

Cascata risultante:

| Situazione | Denominatore del badge (Giorno **e** Mese) |
|---|---|
| `service_layout_confirmed = true` | **Posti fisici** dei tavoli attivi |
| `service_layout_confirmed = false` ma limiti fascia impostati | **Somma dei coperti massimi** delle fasce (comportamento attuale del Mese) |
| Nessuno dei due | **Nessun badge** + messaggio che dice all'admin cosa configurare |

---

## 2. I lavori e le onde

| Prompt | Lavoro | Onda | Dimensione | Migrazione |
|---|---|---|---|---|
| **P1** | Sostituzione guidata tavolo occupato → operazione unica | A | L | `072` |
| **P2** | Fix piccoli: PDF colonna Tavolo, nomi incoerenti, 14 link rotti | A | S | — |
| **P3** | Fascicolo legale Brevo pronto da firmare/pubblicare | A | M | — |
| **P4** | Salvataggio Menu QR → operazione unica | B | M | `073` |
| **P5** | Console super-admin: 3 manopole + interruttore «sala configurata» | B | M | `074` |
| **P6** | Elimina sala non consuma turno + badge capienza a cascata | C | M | — |
| **P7** | Rollout in produzione | 🔒 cancello | L | — |

```
ONDA A ─ P1 ─┐
             ├─ P2 ─┐          (in parallelo, ma vedi §3)
             └─ P3 ─┘
                    ↓
ONDA B ─ P4 ─┐
             └─ P5 ─┘          (P5 crea l'interruttore che serve a P6)
                    ↓
ONDA C ─ P6

  🔒 P7 ROLLOUT — si sblocca solo con: collaudo T1-T16 verde
                  + P1..P6 chiusi + tua autorizzazione scritta
```

Il **collaudo manuale** (T1-T16) puoi farlo in qualsiasi momento: non blocca P1-P6, blocca solo P7.
Anzi, **T9 è la prova esatta del difetto che P1 chiude**: se la fai prima, P1 parte con la prova in mano.

---

## 3. Regole se lanci più agenti insieme

Tre agenti sullo stesso repo si pestano i piedi sui file condivisi. Ownership assegnata:

| File | Proprietario unico |
|---|---|
| `src/features/booking/hooks/useTableAssignments.ts` | P1 |
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | P1 (onda A), poi P6 (onda C) |
| `docs/FOLLOW_UP.md` | P1 in onda A · P5 in onda B · P6 in onda C |
| `src/lib/shiftBriefingPdf.ts`, `ShiftBriefingModal.tsx`, `AdminHomePage.tsx`, `TableMap.tsx`, `ServiceSlotsManager.tsx`, `docs/Console-Skill/**` | P2 |
| `docs/Legal-Production-Skill/**`, `docs/legal/**`, `src/pages/PrivacyPolicyPage.tsx` | P3 |
| `src/features/booking/hooks/useMenuQrCodes.ts` | P4 |
| `console/**`, `src/features/booking/lib/restaurantSettingRegistry.ts` | P5 |
| `src/features/booking/hooks/useRooms.ts`, `BookingCalendar.tsx`, `useCapacityCheck.ts` | P6 |

**Regola pratica:** puoi tenere tre chat aperte, ma **fai committare un agente alla volta**, in ordine
di numero. Ogni agente deve fare `git add` **solo dei propri percorsi**, mai `git add -A`.

---

## 4. Vincoli validi per TUTTI i prompt

Copiali mentalmente in ogni giro; sono già dentro ogni prompt.

- **Ambiente:** si lavora **solo su TEST** (`docnnernvp`). Prima di qualsiasi scrittura DB via MCP:
  `get_project_url` → se risponde `rwuxgvld` (PROD) **fermati e chiedi**. Migrazioni via
  `npm run db:apply`. `supabase db push --include-all` è **vietato per sempre**.
- **Branch:** `env/test`. Mai merge su `main`, mai release PrenotaZen.
- **Il repo non ha prettier:** mai `npx prettier --write` (riscriverebbe tutto in doppi apici).
- **Cancello di uscita:** `npm run validate` deve tornare **verde** (lint + typecheck + Vitest).
- **Routing skill:** parti da `.claude/CLAUDE.md` → `docs/APP_CONTEXT_SKILL.md` §0 → skill d'area.
  Leggi la skill **intera** prima di aprire i file.
- **Non spuntare** `COLLAUDO_MANUALE_OBBLIGATORIO.md` né `COLLAUDO_S4_CHECKLIST.md`: quelle sono
  prove di Matteo, un test automatico non le sostituisce.
- **Perimetro:** se trovi un altro difetto fuori mandato, **registralo in `docs/FOLLOW_UP.md` e vai
  avanti**. Non allargare il lavoro.
- **Report finale:** scrivi tu il report in `docs/Sessioni di lavoro/<data>/`; i sotto-agenti non
  possono scrivere file, restituiscono solo testo.

---

# PROMPT DA ESEGUIRE

---

## P1 — La sostituzione guidata diventa un'operazione unica

**Onda A · dimensione L · migrazione `072` · è il lavoro più delicato del piano**

```
Sei un agente senior su CalendarBackup-v2, branch env/test, ambiente TEST (docnnernvp).
Leggi prima .claude/CLAUDE.md, poi docs/APP_CONTEXT_SKILL.md §0, poi la skill Admin e
docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md. Leggile intere.

## Il problema, in parole di sala
Quando lo staff assegna una prenotazione a un tavolo già occupato, l'app chiede cosa fare del
cliente che c'era prima: spostarlo, archiviarlo, o rimetterlo in attesa. Qualunque scelta faccia,
l'app esegue FINO A CINQUE scritture separate sul database, una dopo l'altra, senza rete di
sicurezza. Se la connessione cade a metà, il cliente precedente può risultare seduto a DUE tavoli
contemporaneamente, oppure il tavolo resta vuoto e la nuova prenotazione non arriva da nessuna parte.
È il punto più pericoloso dell'intera area Servizio.

## Fatti già verificati — NON ri-derivarli, parti da qui
- Il percorso è `useForceReplaceBookingOnTable` in
  src/features/booking/hooks/useTableAssignments.ts:489
- Le cinque scritture, nell'ordine reale: insert sul tavolo di destinazione (:526-539) → delete della
  riga contesa (:542-547) → insert della nuova prenotazione (:579-593) → update di clearBookingServedAt
  (:230-238, chiamata a :597) → update di writeOccupancySnapshot (:267-303, chiamata a :598).
- Non c'è nessuna .rpc() in questo percorso.
- Esiste GIÀ un precedente positivo da imitare: la migrazione 069 ha reso atomico il walk-in con la
  RPC `create_walk_in_with_assignment`. Studia quella migrazione e quell'hook PRIMA di progettare.
- I tre esiti da preservare esattamente come sono oggi: "Sposta e assegna", "Archivia e assegna",
  "Rimetti in attesa e assegna" (etichette in AssignmentMapPanel.tsx:911-919).
- Regola di prodotto D48 da non rompere: consuma un turno SOLO chi ha davvero servito. Spostamento,
  rimessa in attesa e liberazione forzata fanno DELETE fisico e NON bruciano il turno; il checkout
  timbra. I campi di audit della forzatura (migrazione 065) devono continuare a essere valorizzati.

## Cosa devi fare
1. Progetta UNA sola funzione lato database (RPC) che esegua tutta la sostituzione in una
   transazione, con i tre esiti come parametro. Scrivila nella migrazione `supabase/migrations/072_*`.
   Nome file coerente con lo stile delle 063-071.
2. Applicala su TEST con `npm run db:apply`. Verifica prima l'ambiente: deve essere docnnernvp.
3. Riscrivi `useForceReplaceBookingOnTable` perché chiami la RPC invece delle cinque scritture.
   L'interfaccia verso i componenti NON deve cambiare: nessuna modifica a AssignmentMapPanel.tsx.
4. Rigenera i tipi con `npm run db:types:linked`.
5. Scrivi i test che rendono visibile la decisione:
   - un test che dimostra che i tre esiti producono lo stesso stato finale di prima (non-regressione);
   - un test che dimostra che un fallimento a metà NON lascia il cliente su due tavoli;
   - verifica che i test esistenti in AssignmentMapPanel.sostituzioneGuidata.test.tsx restino verdi.
6. Fai girare gli E2E dell'area: `npx playwright test e2e/pro/pro-service-tables-lifecycle.spec.ts`.
   Devono restare tutti verdi. Se un test cade, NON abbassare l'asserzione: diagnostica.
7. Aggiorna docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md (sezione atomicità) e la riga
   FU-ALL-ATOMICITA-1 in docs/FOLLOW_UP.md, che scende da 8 percorsi a 7.

## Criterio di uscita
- `npm run validate` verde.
- `pro-service-tables-lifecycle.spec.ts` verde.
- La migrazione 072 applicata su TEST e verificata.
- Un test che fallirebbe se qualcuno rimettesse le scritture separate.

## Confini
- Solo TEST. Mai PROD, mai main, mai release.
- Il repo NON ha prettier: mai `npx prettier --write`.
- `git add` solo dei tuoi percorsi (useTableAssignments.ts, migrations/072_*, types, i tuoi test,
  ADMIN_SERVIZIO_CONTEXT.md, FOLLOW_UP.md). Mai `git add -A`.
- Non toccare gli altri 7 percorsi non atomici: sono di altri prompt o restano censiti.
- Non toccare le checklist di collaudo.

## Consegna
Report in docs/Sessioni di lavoro/<data odierna>/Report-P1-atomicita-sostituzione.md con: cosa hai
cambiato e perché, la prova che l'operazione è davvero unica, i comandi eseguiti con l'esito reale,
e cosa NON hai fatto.
```

---

## P2 — I fix piccoli: PDF, nomi incoerenti, link rotti

**Onda A · dimensione S · nessuna migrazione**

```
Sei un agente esecutore su CalendarBackup-v2, branch env/test.
Leggi .claude/CLAUDE.md e docs/APP_CONTEXT_SKILL.md §0 prima di aprire i file.
Sono tre lavori indipendenti e piccoli. Falli tutti e tre, in questo ordine.

## Lavoro 1 — Il foglio stampato deve dire a che tavolo va il cliente
Oggi il briefing a video mostra la colonna Tavolo, ma il PDF che lo staff stampa e porta in sala NO.
Il dato è già disponibile, va solo propagato.
Fatto verificato: `generateBriefingPdf` in src/lib/shiftBriefingPdf.ts:42 ha intestazione
['Orario', 'Cliente', 'Coperti', 'Note']. Il modale usa già `getTablePlacement`
(src/features/booking/components/home/ShiftBriefingModal.tsx:14-18) che produce "T12" in mono-sala,
"Sala · T12" in multi-sala e "—" se non assegnato.
Da fare: aggiungi la colonna Tavolo al PDF usando ESATTAMENTE la stessa funzione di formato del
modale (estraila in un punto condiviso se serve, non duplicarla). Verifica che il PDF resti leggibile
in larghezza con cinque colonne. Aggiungi un test sulla riga di intestazione e su una riga con e
senza tavolo.

## Lavoro 2 — Quattro incoerenze di testo che confondono chi usa l'app
Tutti fatti verificati sul codice:
a) Il pulsante in Home dice "Briefing turno" (AdminHomePage.tsx:130) ma la finestra che si apre si
   intitola "Briefing pre-turno" (ShiftBriefingModal.tsx:45) e il PDF "Briefing Pre-Turno"
   (shiftBriefingPdf.ts:26). Scegli UN nome solo e usalo nei tre posti. Proponi "Briefing turno"
   (è quello che l'utente clicca) ma se la skill di comunicazione indica altro, segui quella.
b) Nel modale il filtro si chiama "Turno:" (ShiftBriefingModal.tsx:49) mentre in tutto il resto
   dell'app quelle si chiamano "fasce orarie". Allinealo a "Fascia:".
c) Esistono DUE messaggi diversi per la stessa cosa quando si apre la modifica sala da telefono:
   TableMap.tsx:65 ("Modifica layout disponibile da desktop...") è di fatto irraggiungibile perché
   ServizioPage.tsx:400-403 nasconde già tutto il blocco con un messaggio diverso. Rimuovi il testo
   morto, tieni quello visibile.
d) A card aperta il titolo "Fasce orarie" compare due volte: una dal CollapsibleCard esterno
   (ServizioPage.tsx:335-342) e una dall'intestazione interna (ServiceSlotsManager.tsx:1415-1418).
   Togline uno. È già registrato come costo cosmetico noto in ADMIN_SERVIZIO_CONTEXT.md §9.11.
Per ognuno aggiorna o aggiungi il test che blocca il ritorno del testo vecchio, se un test toccava
quella stringa.

## Lavoro 3 — Il controllo dei documenti torna verde
`npm run validate:docs` è rosso per 14 percorsi, tutti nell'area Console, tutti falsi allarmi.
Fatti verificati:
- docs/Console-Skill/MASTERPLAN_CONSOLE.md:367 e la sua copia in
  sessioni/2026-06-22-masterplan-console-F1-F7/tracciabilita/MASTERPLAN_CONSOLE.md:367 scrivono
  `src/.../restaurantSettingRegistry.ts` con un'ellissi che il controllo legge come percorso vero.
- docs/Console-Skill/sessioni/PHASE_AUDIT.md:31 e la sua copia elencano sei file (src/App.ts,
  src/main.ts, src/lib/supabaseClient.ts, src/components/LoginPlaceholder.ts,
  src/components/AppShell.ts, src/styles/global.css) senza ripetere il prefisso `console/` già
  dichiarato nella frase.
Da fare: riscrivi le frasi con i percorsi completi e corretti (NON aggiungere niente
all'allowlist: si sistema la causa, non si nasconde il sintomo). `npm run validate:docs` deve tornare
a zero errori.

## Criterio di uscita
- `npm run validate` verde e `npm run validate:docs` a zero errori.
- Il PDF generato ha cinque colonne ed è leggibile (allega come lo hai verificato).

## Confini
- Solo TEST, branch env/test. Nessuna migrazione, nessuna scrittura DB.
- Il repo NON ha prettier.
- `git add` solo dei tuoi percorsi. NON toccare useTableAssignments.ts, useMenuQrCodes.ts,
  useRooms.ts, BookingCalendar.tsx, console/**, docs/legal/** (sono di altri prompt).
- NON toccare ADMIN_SERVIZIO_CONTEXT.md: è di P1/P6. Se hai una nota per quel file, scrivila nel
  tuo report e segnalala.

## Consegna
Report in docs/Sessioni di lavoro/<data odierna>/Report-P2-fix-piccoli.md, con i tre lavori separati
e cosa NON hai fatto.
```

---

## P3 — Il fascicolo legale Brevo, pronto da firmare e pubblicare

**Onda A · dimensione M · nessun codice applicativo tranne la Privacy Policy**

```
Sei un agente su CalendarBackup-v2, branch env/test. Questo lavoro è di redazione, non di codice.
Leggi docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md per intero prima di scrivere.

## La situazione, in parole semplici
Dal 15 giugno l'app manda email VERE a clienti VERI dalla produzione, usando un fornitore esterno
(Brevo). Quel fornitore tratta dati di persone reali per conto nostro. Tre atti mancano:
1. il contratto che regola quel trattamento (DPA) con Brevo;
2. la riga «Brevo» nella lista pubblica dei fornitori a cui passiamo dati;
3. il nome Brevo nella Privacy Policy del sito, che oggi cita solo Supabase e Vercel.
Matteo ha deciso: prepari TU tutto il materiale, lui lo porta al professionista e lo pubblica.

## Fatti già verificati
- docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md:95-126 ha già la tabella dei sub-responsabili
  e una sezione "Da decidere con l'avvocato": è aggiornata e corretta, partì da lì.
- docs/legal/sub-processors.md esiste come bozza v0.1, mai pubblicata.
- src/pages/PrivacyPolicyPage.tsx nomina Supabase e Vercel, NON Brevo.
- Non risulta documentato nessun tempo di conservazione per unsubscribe_tokens, log email e campagne.
- Le tabelle email_templates/email_campaigns e la migrazione 055 unsubscribe_tokens sono in PROD.

## Cosa devi consegnare
1. **Checklist da portare a Brevo**: cosa chiedere esattamente per il DPA (moduli, dove si firma,
   trasferimenti fuori dall'Unione Europea, misure di sicurezza dichiarate). Deve essere una lista di
   domande concrete, non un testo teorico.
2. **docs/legal/sub-processors.md portato a versione pubblicabile**: riga Brevo completa (chi è, che
   dati tratta, dove, per quanto), insieme alle righe già presenti. Scritto in italiano piano.
3. **Paragrafo pronto per la Privacy Policy** che nomina Brevo come responsabile del trattamento per
   l'invio delle email, con i tempi di conservazione proposti. Applicalo a
   src/pages/PrivacyPolicyPage.tsx mantenendo lo stile e la struttura esistente.
4. **Proposta di tempi di conservazione** per unsubscribe_tokens, log invii ed email di campagna, con
   il motivo di ogni scelta. Sono proposte da far validare, dichiarale come tali.
5. **Aggiorna LEGAL_STATE_CONTEXT.md** con lo stato reale: cosa è pronto, cosa aspetta la firma, cosa
   aspetta la pubblicazione.

## Regola non negoziabile
Non sei un avvocato e non devi fingere di esserlo. Ogni testo che produci va marcato come BOZZA DA
VALIDARE. Non scrivere che qualcosa "è conforme": scrivi cosa fa il sistema e cosa manca. Se una
domanda richiede una valutazione legale, mettila nella lista di cosa chiedere al professionista.

## Criterio di uscita
- `npm run validate` verde (tocchi un file .tsx, quindi conta).
- Matteo ha in mano: una lista di cose da chiedere a Brevo, un file pubblicabile, un paragrafo
  pronto e una proposta sui tempi di conservazione.

## Confini
- Solo TEST, branch env/test. Nessuna migrazione, nessuna scrittura DB, nessun invio email.
- `git add` solo dei tuoi percorsi: docs/Legal-Production-Skill/**, docs/legal/**,
  src/pages/PrivacyPolicyPage.tsx. Mai `git add -A`.
- Non toccare l'Edge send-email né la sua configurazione.

## Consegna
Report in docs/Sessioni di lavoro/<data odierna>/Report-P3-legale-brevo.md.
```

---

## P4 — Il salvataggio del Menu QR diventa un'operazione unica

**Onda B · dimensione M · migrazione `073`**

```
Sei un agente su CalendarBackup-v2, branch env/test, ambiente TEST (docnnernvp).
Leggi .claude/CLAUDE.md, docs/APP_CONTEXT_SKILL.md §0 e la skill Menu QR
(docs/Menu-QR-Skill/MENU_QR_SKILL.md) per intera prima di toccare il codice.

## Il problema, in parole di sala
Quando il ristoratore salva le impostazioni di un Menu QR, l'app scrive fino a QUATTRO volte di fila
sul database senza rete di sicurezza. Se salta a metà, il QR appeso al tavolo mostra una pagina
incoerente: per esempio il menù aggiornato ma le categorie con nomi e icone vecchi. È il secondo
percorso più rischioso censito, dopo la sostituzione guidata già chiusa da P1.

## Fatti già verificati — NON ri-derivarli
- Il percorso è `useSaveMenuQrSettings` in src/features/booking/hooks/useMenuQrCodes.ts:91.
- Le scritture: update/insert della riga QR (:112-141) → update opzionale degli asset dopo la
  migrazione della bozza (:157-163) → upsert dei categoryOverrides (:178-182).
- Il precedente positivo da imitare è la migrazione 069 (RPC atomica del walk-in). Se P1 ha già
  chiuso la sostituzione guidata con la 072, studia ANCHE quella: è il modello più recente.
- P1 usa il numero 072. Tu usi `supabase/migrations/073_*`.

## Cosa devi fare
1. Studia il modello della 069 (e della 072 se esiste già) prima di progettare.
2. Scrivi la RPC che esegue tutto il salvataggio in una transazione. Migrazione 073, nome coerente
   con lo stile delle precedenti. Ricorda la regola GRANT: ogni nuovo oggetto in `public` richiede
   GRANT espliciti e RLS coerente.
3. Applica su TEST con `npm run db:apply` dopo aver verificato l'ambiente (docnnernvp).
4. Riscrivi l'hook perché chiami la RPC. L'interfaccia verso i componenti non deve cambiare.
5. `npm run db:types:linked` per rigenerare i tipi.
6. Test: non-regressione del salvataggio completo, più un test che dimostra che un fallimento a metà
   non lascia il QR pubblico incoerente.
7. Fai girare `npx playwright test e2e/public-menu-qr.spec.ts` e le spec Menu QR presenti: verdi.
8. Aggiorna docs/Menu-QR-Skill/ (file di contesto mappato dalla skill) e la riga FU-ALL-ATOMICITA-1
   in docs/FOLLOW_UP.md, che scende da 7 a 6 percorsi.

## Criterio di uscita
- `npm run validate` verde. Spec Menu QR verdi. Migrazione 073 su TEST verificata.

## Confini
- Solo TEST. Mai PROD, mai main, mai release. Mai `--include-all`.
- Il repo NON ha prettier.
- `git add` solo dei tuoi percorsi. NON toccare useTableAssignments.ts, console/**, useRooms.ts,
  BookingCalendar.tsx, restaurantSettingRegistry.ts (sono di altri prompt).
- Non toccare gli altri percorsi non atomici: restano censiti.

## Consegna
Report in docs/Sessioni di lavoro/<data odierna>/Report-P4-atomicita-menuqr.md.
```

---

## P5 — Console super-admin: le tre manopole e l'interruttore «sala configurata»

**Onda B · dimensione M · migrazione `074`**

```
Sei un agente su CalendarBackup-v2, branch env/test, ambiente TEST (docnnernvp).
Leggi .claude/CLAUDE.md, docs/APP_CONTEXT_SKILL.md §0 e la skill Console
(docs/Console-Skill/) prima di toccare il codice.

## Il problema, in parole semplici
Quattro comportamenti dell'app si possono cambiare SOLO scrivendo a mano nel database. Matteo, che
configura i clienti uno per uno, non ha nessuna schermata dove farlo. Serve esporli nella console
super-admin, che ha già il pannello e già il modo di modificare numeri e interruttori.

## Fatti già verificati — NON ri-derivarli
- La console esiste: console/src/components/RestaurantSettingsPanel.tsx, con la logica in
  console/src/lib/restaurantSettings.ts, che oggi espone OTTO chiavi e ha già l'editor per interi
  (validazione + clamp, vedi il caso walk_in_max_guests a :130 e :200) e per booleani
  (slot_limit_enabled).
- Le tre manopole NON sono esposte oggi:
  · `table_late_threshold_minutes` — default 15, range 0-120
    (src/features/booking/hooks/useTableStatuses.ts:35;
     src/features/booking/lib/restaurantSettingRegistry.ts:772-789)
  · `table_release_notice_recall_minutes` — default 30, range 1-240 (registry :796-819)
  · durata di ripiego del walk-in — oggi 90 minuti, letta in
    src/features/booking/components/home/WalkInModal.tsx:49 come ripiego di `min_duration`
- ⚠️ ATTENZIONE, caso diverso dagli altri: `turnover_buffer_minutes` NON sta in restaurant_settings,
  è una COLONNA di service_slots, quindi è PER FASCIA
  (supabase/migrations/057_service_slots_duration_buffer.sql:7, default 0 minuti).
  Non forzarlo nel pannello globale. Valuta e proponi: o un campo nel modale della fascia in
  Servizio, o un default globale che le fasce ereditano. Se scegli di rimandarlo, registralo in
  FOLLOW_UP.md con la motivazione. NON inventare una soluzione che mescola i due livelli.
- Matteo ha CONFERMATO i valori attuali (15 / 0 / 90): non cambiarli, rendili solo modificabili.

## Cosa devi fare
1. Crea la nuova chiave `service_layout_confirmed` — booleana, default `false`. Serve a P6: significa
   «ho finito di configurare sale e tavoli di questo cliente, il conteggio dei posti è affidabile».
   Registrala in src/features/booking/lib/restaurantSettingRegistry.ts con lo stesso stile delle
   altre e, se serve una migrazione per il default, usa `supabase/migrations/074_*`.
2. Esponi nella console super-admin, con l'editor già esistente:
   - `table_late_threshold_minutes` (intero 0-120)
   - `table_release_notice_recall_minutes` (intero 1-240)
   - la durata di ripiego del walk-in (intero, proponi il range e motivalo)
   - `service_layout_confirmed` (interruttore)
   Ogni voce deve avere una descrizione in italiano piano che dica COSA CAMBIA IN SALA, non il nome
   tecnico. Esempio del tono: «Dopo quanti minuti un tavolo prenotato diventa rosso se il cliente non
   è arrivato».
3. Decidi e documenta il caso `turnover_buffer_minutes` come scritto sopra.
4. Test: i valori si salvano, i limiti si rispettano, un valore fuori range viene rifiutato.
5. Aggiorna il file di contesto della skill Console e registra in docs/FOLLOW_UP.md la chiusura del
   follow-up «manopole non configurabili» chiesto da Matteo il 06-08-26.

## Criterio di uscita
- `npm run validate` verde. La console mostra e salva le quattro voci nuove su TEST.
- `service_layout_confirmed` esiste, default false, ed è documentata: P6 la userà.

## Confini
- Solo TEST. Mai PROD. Mai `--include-all`.
- Il repo NON ha prettier.
- `git add` solo dei tuoi percorsi: console/**, restaurantSettingRegistry.ts, migrations/074_*,
  i tuoi test, docs/Console-Skill/**, FOLLOW_UP.md. Mai `git add -A`.
- NON cambiare i valori di default confermati da Matteo. NON toccare BookingCalendar.tsx né
  useCapacityCheck.ts: sono di P6.

## Consegna
Report in docs/Sessioni di lavoro/<data odierna>/Report-P5-manopole-console.md, includendo la tua
proposta motivata su turnover_buffer_minutes.
```

---

## P6 — Elimina sala senza bruciare il turno + badge capienza a cascata

**Onda C · dimensione M · dipende da P5 · nessuna migrazione nuova**

```
Sei un agente su CalendarBackup-v2, branch env/test, ambiente TEST (docnnernvp).
Leggi .claude/CLAUDE.md, docs/APP_CONTEXT_SKILL.md §0, la skill Admin e
docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md per intere.
PREREQUISITO: P5 deve essere chiuso — usi la chiave `service_layout_confirmed` che ha creato lui.
Se non esiste, fermati e segnalalo.

Sono due lavori collegati dal tema «il conteggio dei posti dice la verità».

## Lavoro 1 — Eliminare una sala non deve consumare il turno
Situazione in sala: se togli il posto a un cliente che non ha ancora finito, quel turno non è stato
servito e non va bruciato. Oggi l'app si comporta in due modi diversi per la stessa situazione.
Fatti verificati:
- `useDeleteTable` (src/features/booking/hooks/useServizioTables.ts:219-223) fa DELETE FISICO delle
  assegnazioni attive → NON consuma il turno. È il comportamento corretto (regole D-A / D48).
- `useDeleteRoom` (src/features/booking/hooks/useRooms.ts:222-226) fa invece UPDATE di
  `checked_out_at` → CONSUMA il turno. È l'incoerenza.
- L'incoerenza era segnalata come «S-3» in ADMIN_SERVIZIO_CONTEXT.md §9.14 e promessa alla Fase 3,
  ma la Fase 3 non l'ha affrontata e non è mai finita in FOLLOW_UP.md.
DECISIONE DI MATTEO (06-08-26): vince il tavolo. Anche eliminare una sala NON deve consumare il turno.
Da fare: allinea `useDeleteRoom` al comportamento di `useDeleteTable`. Le prenotazioni attive dei
tavoli di quella sala devono tornare nel cassetto «da assegnare», senza bruciare il turno.
Attenzione: `useDeleteRoom` è anche uno dei percorsi multi-scrittura censiti (2 scritture). NON è nel
perimetro di questo prompt renderlo atomico — resta in FU-ALL-ATOMICITA-1. Cambia solo il
comportamento del turno.
Scrivi il test che rende visibile la decisione: eliminare una sala con un cliente ancora seduto NON
incrementa il conteggio dei turni serviti.

## Lavoro 2 — Il badge del Calendario conta sempre nello stesso modo
Situazione: oggi il badge di occupazione conta in DUE modi diversi. In vista Giorno, con i tavoli
attivi, usa i posti fisici. In vista Mese somma i coperti massimi delle fasce e SPARISCE se quei
limiti non sono impostati. Chi guarda non sa quale numero sta leggendo.
Fatti verificati: `resolveDayDenominator` in
src/features/booking/components/BookingCalendar.tsx:482-514; comportamento confermato dal test
calendario.adminBlindatura.test.tsx:367-392 (con tavoli e limite spento, il Mese non mostra nulla).
DECISIONE DI MATTEO (06-08-26) — cascata da implementare, uguale in Giorno e in Mese:
  1. `service_layout_confirmed = true`  → denominatore = POSTI FISICI dei tavoli attivi
  2. altrimenti, se ci sono limiti di coperti sulle fasce → denominatore = SOMMA DEI COPERTI FASCIA
  3. se manca tutto → NESSUN badge, e un messaggio che dice all'admin cosa configurare
Il motivo della scelta 1-poi-2: la configurazione per fasce è semplice e la fa l'admin dall'app; la
configurazione di sale e tavoli la fa Matteo a mano sull'azienda, e quando ha finito accende
l'interruttore in console. L'interruttore è ESPLICITO apposta: dedurlo da «esiste almeno un tavolo»
farebbe mostrare «8 / 12» a un locale configurato a metà, che sembrerebbe pieno.
Da fare: implementa la cascata, uguale nelle due viste. Il messaggio del caso 3 va scritto con il
tono di docs/COMUNICAZIONE_UTENTE_SKILL.md: dire cosa fare, non cosa manca.
Non rompere il Classic: senza tavoli il Classic finisce sempre nel caso 2 o 3, mai nel caso 1.

## Criterio di uscita
- `npm run validate` verde.
- `npx playwright test e2e/pro/pro-service-tables-lifecycle.spec.ts` verde.
- Tre test nuovi: sala eliminata non consuma turno; badge con interruttore acceso mostra i posti
  fisici in ENTRAMBE le viste; badge senza interruttore e senza limiti non compare e mostra il
  messaggio.
- Test di non-regressione Classic aggiornato, non indebolito.

## Confini
- Solo TEST. Mai PROD, mai main.
- Il repo NON ha prettier.
- `git add` solo dei tuoi percorsi: useRooms.ts, BookingCalendar.tsx, useCapacityCheck.ts, i tuoi
  test, ADMIN_SERVIZIO_CONTEXT.md, FOLLOW_UP.md. Mai `git add -A`.
- NON rendere atomico useDeleteRoom: resta censito.
- NON cambiare i default confermati da Matteo.

## Consegna
Report in docs/Sessioni di lavoro/<data odierna>/Report-P6-turni-sala-badge-capienza.md.
```

---

## P7 — 🔒 Rollout in produzione — NON LANCIARE ORA

**Cancello · si sblocca solo quando tutte le condizioni sotto sono vere**

**Condizioni di sblocco:**
1. Collaudo manuale T1-T16 **verde** (o con i KO risolti);
2. P1..P6 chiusi, `npm run validate` verde, batteria E2E completa verde;
3. **autorizzazione scritta di Matteo, in quel momento**, non questa.

```
Sei un agente di rilascio su CalendarBackup-v2. Questo è il prompt più pericoloso del piano: tocca
i dati dei clienti veri.

## Prima di qualunque cosa
1. Verifica l'ambiente: `get_project_url`. Se risponde `rwuxgvld` sei su PRODUZIONE.
2. FERMATI e chiedi a Matteo conferma esplicita, mostrandogli cosa stai per applicare.
3. NON usare la CLI per scrivere su PROD. Mai `supabase db push --include-all`.

## Il principio da non rompere
Migrazioni, Edge Function e client devono viaggiare INSIEME. La lezione registrata in memoria (23-05,
migrazione 026) è che una migrazione che restringe i permessi senza il client aggiornato rompe la
produzione. Vale ancora.

## Cosa comprende il treno
- Migrazioni 063-071 (contratto S4) più quelle create da P1 (072), P4 (073), P5 (074).
- Edge Function create-booking: su TEST risulta v29 o v30 a seconda del documento
  (ADMIN_SERVIZIO_CONTEXT.md §9.1 dice v29, PIANO_SENIOR §6 dice v30); in PROD risulta ferma
  attorno a v20/v21. ⚠️ QUESTO DATO VA RIVERIFICATO DAL VIVO prima di toccare qualsiasi cosa: i
  documenti si contraddicono e nessuno ha potuto controllare il 06-08 (la CLI rispose 401).
- Il client corrispondente, mergiato su main.

## Cosa devi fare
1. Riverifica dal vivo: quali migrazioni risultano davvero applicate su PROD, e quale versione
   dell'Edge gira. Scrivi il confronto TEST vs PROD PRIMA di proporre qualsiasi azione.
2. Prepara la sequenza esatta, passo per passo, con il punto di non ritorno segnato.
3. Prepara il piano di rientro: cosa fare se una migrazione fallisce a metà.
4. Presenta tutto a Matteo e ASPETTA. Non eseguire.
5. Solo dopo il suo «vai»: esegui nell'ordine, verificando dopo ogni passo.

## Confini
- Nessuna scrittura su PROD senza conferma per QUEL passo specifico.
- Se un passo fallisce, fermati e chiedi. Mai un secondo tentativo alla cieca.

## Consegna
Report con: stato reale TEST vs PROD prima, cosa hai applicato, esito di ogni passo, stato dopo.
```

---

## 5. Cosa resta fuori da questo piano

| Lavoro | Perché è fuori |
|---|---|
| Gli altri 6 percorsi non atomici | Decisione D-2: modifica/elimina cliente, elimina tavolo, elimina sala, rinomina/elimina categoria menu restano censiti in `FU-ALL-ATOMICITA-1` |
| Capienza pubblica allineata ai tavoli (D38 online) | Cantiere a sé: tocca l'Edge in produzione. Oggi il form pubblico guarda solo il limite di fascia — è voluto e dichiarato |
| S4-LIVE, accesso staff, conto leggero, ordine da QR, ruoli fini | Prodotto futuro, capitoli autonomi |
| Peso del primo caricamento (`FU-PERF-BUNDLE`) | Sessione dedicata con misurazione, non un fix |
| Merge su `main` e release PrenotaZen | Cambio di stato più ampio, mandato separato |
