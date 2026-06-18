# Prompt batch 2 — fix UX/bug post-controtest (18-06-26)

> Documento di **prepara-prompt**: prompt pronti da incollare agli agenti, in ordine. Profilo
> Esecuzione per i fix, profilo Verifica per il revisore. Lavorare su `env/test`, nessun deploy su
> PROD (`rwuxgvld`) senza conferma esplicita di Matteo.
>
> **Contesto:** il batch precedente (nuovo modello limiti coperti A, descrizione header C, card
> calendario D, consenso marketing E1/E2) è stato **controtestato da Matteo** e funziona. Questi 5 fix
> nascono dalla controtest: rifiniture sul modello capienza + alcuni bug. Per i nomi reali delle chiavi
> capienza vedi [`Report-limiti-coperti-nuovo-modello-18-06-26.md`](Report-limiti-coperti-nuovo-modello-18-06-26.md).

## Ordine e revisione

| # | Fix | Area | Peso | Revisione |
|---|-----|------|------|-----------|
| P1 | Nome fascia precompilato · toggle anche in Pro · stop falso alert capienza | Impostazioni fasce/capienza | deep | Accurata (esterno) |
| P2 | Orario notturno (oltre mezzanotte) non riconosciuto in Prenota | Prenota + orari §4b | deep | Accurata (esterno) |
| P3 | Campagne email: selezionabili clienti SENZA consenso marketing (bug) | CRM email | deep | Accurata (esterno) |
| P4 | Privacy policy: tornare indietro deve chiudere la pagina | Prenota/routing | standard | Rapida (prepara-prompt) |
| P5 | Annotare in skill DB il cambio Supabase (GRANT Data API) | Doc DB | light | Nessuna (doc) |

Sequenza consigliata: **P1, P2, P3, P4, P5 in parallelo** (aree diverse). Poi **Revisore** (in fondo)
su P1+P2+P3; P4 la reviso io; P5 è doc.

---

## P1 — Fasce orarie & capienza: rifiniture

```
Profilo: Esecuzione
Modalità: deep (LOCK RestaurantSettingsTab + useCapacityCheck/AdminBookingForm; tocca il modello capienza appena introdotto). Non abbassare; segnala se sali.
Skill da leggere: docs/ADMIN_CLASSIC_SKILL.md + docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md + docs/Sessioni di lavoro/18-06-26/Report-limiti-coperti-nuovo-modello-18-06-26.md (nomi reali delle chiavi) + APP_CONTEXT_SKILL.md §4 (RULE edition/useFeatures).
Output attesi (ESATTAMENTE questi, niente extra senza chiedere Sì/No):
  1. Modifica fascia oraria: nel modale «Imposta Fasce Orarie» il campo nome (input #slot-name) deve PRECOMPILARSI con il nome già salvato della fascia che si sta modificando (oggi non compare il nome esistente).
  2. I due interruttori «Attiva limiti coperti per fascia» (slot_limit_enabled) e «Rifiuta richieste fuori dalle fasce» (booking_reject_out_of_slot) devono essere visibili e funzionanti ANCHE in edition Pro: oggi compaiono solo in Classic.
  3. L'avviso capienza per-fascia in fase di ACCETTAZIONE admin (useCapacityCheck, AdminBookingForm) NON deve comparire quando le fasce orarie sono DISATTIVATE, anche se il toggle è attivo e c'è un limite coperti impostato nella fascia.

Dettaglio #3 (ripro Matteo): imposto limite coperti per fascia in Classic → attivo il toggle «rifiuta» → DISATTIVO le fasce orarie. Dal pubblico riesco a prenotare correttamente (giusto: fasce off = nessun vincolo). Ma quando accetto la prenotazione da admin arriva COMUNQUE l'alert «superi la capacità della fascia». Atteso: se le fasce sono disattivate, nessun alert per-fascia in admin. In plan/diagnosi: mappa il flag reale che «disattiva le fasce» e allinea useCapacityCheck alla STESSA condizione di abilitazione usata da edge/pubblico (coerenza client↔server: se il pubblico non blocca, l'admin non deve nemmeno avvisare).

Vincoli:
- Principio MORBIDO invariato: admin non è mai bloccato; ma l'avviso non deve essere un FALSO POSITIVO quando il vincolo è spento.
- Edition gating SEMPRE con useFeatures(), mai hardcoded (RULE §4).
- LOCK: RestaurantSettingsTab, AdminBookingForm, useCapacityCheck/useBookingMutations — leggere INTERI i file + collegati prima di toccare; preservare i contratti.
- Solo TEST (docnnernvp); get_project_url prima di ogni write. Niente PROD.

Superfici: Impostazioni → «Imposta Fasce Orarie» (modale fascia + toggle) in Classic E Pro; accettazione prenotazione admin. Verifica 375 / 834 / 1280.

Criterio di fatto: in modifica fascia il nome è precompilato; i 2 toggle sono presenti e funzionanti in Pro; nessun alert capienza per-fascia in admin quando le fasce sono disattivate (con limite impostato + toggle attivo). `npm run validate` verde.

Chiusura verso Matteo: al termine, consegnare una checklist in linguaggio semplice (senza sigle, abbreviazioni o termini tecnici) di cosa verificare in app se le modifiche sono più di una; se la modifica è una sola, una breve spiegazione.

Chiusura (APP_CONTEXT §7): report deep + allineamento skill §7.2 (ADMIN_SETTINGS_CONTEXT) + aggiornare la memoria/decisione del modello capienza se cambia un comportamento documentato.
```

---

## P2 — Orario notturno (oltre mezzanotte) non riconosciuto in Prenota

```
Profilo: Esecuzione (diagnosi + fix)
Modalità: deep (LOCK logica orari §4b + Prenota). Non abbassare.
Skill da leggere: docs/ADMIN_CLASSIC_SKILL.md §4b (createBookingDateTime/extractTimeFromISO, logica orari) + docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md + RULE OVERNIGHT_TIME_END_HINT in bookingTimeSlots.ts (avviso orario notturno fine < inizio).
Output attesi (niente extra senza chiedere Sì/No): il fix della validazione orario pubblica per le fasce che attraversano la mezzanotte. Nessun refactor collaterale.

Obiettivo (BUG): con orario di chiusura OLTRE la mezzanotte (es. domenica aperta fino alle 04:00), provando a prenotare dalla Pagina Prenota a un orario serale valido (es. 23:00) l'app risponde «orario non valido», pur vedendo correttamente l'orario di chiusura (04:00 del giorno dopo) oltre l'orario richiesto. La validazione lato cliente non gestisce le fasce notturne (fine < inizio).

Come: la validazione orario pubblica deve riconoscere le fasce overnight (fine < inizio ⇒ l'intervallo copre [inizio→24:00) ∪ [00:00→fine]). Un orario 23:00 deve risultare DENTRO una fascia 17:30→04:00; così come 03:00. Riusa la logica overnight già presente (slotRangesOverlap / OVERNIGHT_TIME_END_HINT) invece di duplicarla. Allinea l'interpretazione a come admin/edge trattano l'overnight.

Vincoli:
- Non toccare il submit (useCreateBookingRequest) oltre alla validazione orario.
- LOCK orari §4b: leggere prima i punti di verità (dateUtils, bookingTimeSlots) — non reintrodurre input nativo type="time" (RULE TimePicker24h).
- Solo TEST.

Superfici: Pagina Prenota, modale/campo «ora» del cliente. Verifica 375 / 834 / 1280.

Criterio di fatto: con chiusura 04:00, prenotazione alle 23:00 accettata, alle 03:00 accettata, alle 05:00 rifiutata; le fasce diurne normali NON regrediscono (es. 12:00–15:00 invariata). `npm run validate` verde.

Chiusura (APP_CONTEXT §7): report deep + allineamento skill §7.2 (PRENOTA_LAYOUT_CONTEXT / ADMIN_CLASSIC §4b se tocchi i punti orario).
```

---

## P3 — Campagne email: filtro consenso marketing (BUG, regressione E2)

```
Profilo: Verifica → Esecuzione
Modalità: deep (consenso/marketing = dato sensibile + conformità). Non abbassare.
Skill da leggere: docs/Admin-Skill/ADMIN_SKILL.md → contesto/ADMIN_CRM_CONTEXT.md (campagne/picker/invio email) + docs/Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md.
Output attesi (niente extra senza chiedere Sì/No): il fix del filtro consenso nel picker e nell'invio. Nessuna feature nuova.

Obiettivo (BUG): nel picker destinatari delle campagne / email personalizzate admin è ancora possibile SELEZIONARE clienti che NON hanno spuntato il consenso al trattamento marketing. Va corretto: clienti senza consenso non devono comparire né poter ricevere email personalizzate (problema di conformità).

Come: filtrare per consenso marketing = true sia nella LISTA del picker sia come GUARD all'INVIO (difesa a due livelli: anche se un id senza consenso arrivasse al payload, l'invio lo scarta). Mantieni il filtro source==='booking' già presente. Verifica che il campo consenso letto sia quello scritto da E1 (colonna consenso su cliente/prenotazione).

Vincoli:
- Distinzione netta: email TRANSAZIONALI (accetta/rifiuta) NON filtrate; email PERSONALIZZATE/campagne filtrate per consenso.
- Non esporre dati sensibili in whitelist anon.
- Solo TEST.

Superfici: CRM → «Personalizza email» / campagne: picker destinatari + flusso invio.

Criterio di fatto: un cliente senza consenso non compare nel picker e, se forzato nel payload, viene scartato all'invio; un cliente con consenso riceve regolarmente. `npm run validate` verde.

Chiusura (APP_CONTEXT §7): report deep + allineamento skill §7.2 (ADMIN_CRM_CONTEXT) + nota di collegamento a FU-EMAIL-8 (opt-out/conformità campagne).
```

---

## P4 — Privacy policy: tornare indietro chiude la pagina

```
Profilo: Esecuzione
Modalità: standard
Skill da leggere: docs/Prenota-Skill/PRENOTA_SKILL.md (link privacy dal form) + src/router.tsx (solo contesto/lettura) + src/pages/PrivacyPolicyPage.tsx.
Output attesi (niente extra senza chiedere Sì/No): il fix navigazione «indietro». Nessun redesign della pagina.

Obiettivo: dalla Pagina Prenota si apre la privacy policy (/privacy?from=/prenota/:slug). Quando il cliente torna indietro, la pagina privacy deve CHIUDERSI e riportare alla Prenota SENZA lasciare/duplicare schede o entry di cronologia inutili. Oggi tornando indietro resta una scheda/entry duplicata.

Come: usare una navigazione che NON impila una nuova entry al ritorno — preferire history back se l'utente è arrivato dalla Prenota, oppure navigate(from, { replace: true }). Se il link privacy apre una NUOVA scheda (target _blank) ma l'intento è restare nella stessa scheda, allinearlo al comportamento «una sola scheda». Non rompere il deep-link diretto a /privacy (accesso esterno senza `from`).

Vincoli: il parametro `from` esiste già e va preservato. Solo TEST.

Superfici: Pagina Prenota → link privacy → /privacy → «indietro».

Criterio di fatto: apro la privacy dalla Prenota, torno indietro → sono sulla Prenota, nessuna scheda/entry duplicata; accesso diretto a /privacy (senza `from`) continua a funzionare. `npm run validate` verde.

Chiusura (APP_CONTEXT §7): report standard + §7.2 se tocchi routing/PRENOTA.
```

---

## P5 — Annotare in skill DB il cambio Supabase (GRANT Data API)

```
Profilo: Esecuzione (documentazione)
Modalità: light
Skill da leggere: docs/Database-Skill/DB_SKILL.md + docs/DATABASE.md.
Output attesi: SOLO annotazione doc (nota guardrail in DB_SKILL.md + riga in DATABASE.md). Nessun codice, nessuna migrazione.

Obiettivo: annotare nello skill DB il cambiamento Supabase comunicato a Matteo:
- Dal 30-05-2026 i NUOVI progetti Supabase NON espongono di default le tabelle dello schema `public` alla Data API. Ogni nuova tabella creata in `public` richiede un GRANT esplicito prima di essere accessibile via PostgREST / GraphQL / supabase-js.
- I progetti ESISTENTI mantengono il comportamento attuale fino al 30-10-2026.
- Azione: aggiungere GRANT espliciti nel flusso di creazione tabella (oltre alle policy RLS).

Come: aggiungi una nota guardrail (≤3 righe, stile anti-storia §8) nella sezione creazione tabelle/migrazioni di DB_SKILL.md, con le due date e il promemoria «ogni migrazione che crea tabelle in public deve includere i GRANT necessari + RLS coerente». Aggiungi una riga di rimando in DATABASE.md. Non duplicare: una nota sintetica con le date.

Criterio di fatto: la nota è presente, con date corrette, trovabile da chi crea tabelle. Niente altro modificato.

Chiusura: 1 riga in docs/SESSION_LOG.md (modalità light, nessun report dedicato).
```

---

## Revisore — revisione completa P1 + P2 + P3 (eseguire DOPO gli esecutori)

```
Profilo: Verifica
Modalità: deep — revisione completa dei fix P1/P2/P3 su env/test (solo revisione + segnalazione; fix solo se difetto chiaro e circoscritto, previa nota).
Skill da leggere: docs/Testing-Skill/TESTING_SKILL.md (§7 QA manuale: npm run validate + verifica funzionale su 375/834/1280 + tabella esiti) + docs/ADMIN_CLASSIC_SKILL.md + docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md + docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md + docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md + docs/Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md + docs/Sessioni di lavoro/18-06-26/Report-limiti-coperti-nuovo-modello-18-06-26.md + APP_CONTEXT_SKILL.md §1b/§4.

Per ogni punto: ✅ ok / ⚠️ dubbio / ❌ difetto, con file:riga.

P1 — fasce/capienza:
- In modifica fascia il nome è precompilato col valore salvato.
- I toggle slot_limit_enabled e booking_reject_out_of_slot sono visibili e funzionanti in Pro (gating via useFeatures, non hardcoded) oltre che in Classic.
- useCapacityCheck NON produce alert per-fascia in admin quando le fasce sono disattivate (con limite impostato + toggle attivo): la condizione di abilitazione admin combacia con quella di edge/pubblico (nessun falso positivo).
- Principio morbido preservato (admin mai bloccato).

P2 — orario notturno:
- Fasce overnight (fine < inizio) gestite: 23:00 e 03:00 dentro una fascia 17:30→04:00; 05:00 fuori; fasce diurne non regredite.
- Nessuna duplicazione della logica overnight; submit pubblico non toccato oltre la validazione; nessun input nativo type="time" reintrodotto.

P3 — campagne consenso:
- Clienti senza consenso marketing assenti dal picker E scartati all'invio (difesa a due livelli).
- Email transazionali (accetta/rifiuta) NON filtrate; personalizzate filtrate. Nessun dato sensibile esposto.

Trasversale:
- npm run validate verde (lint + typecheck + test); nessun console.log (usare logger); import in cima; nessuna RULE/LOCK violata (§4); PROD intatto (nessun deploy edge/migrazione su rwuxgvld).
- Verifica funzionale UI su 375/834/1280 dei flussi toccati, con tabella esiti.
- Allineamento doc/skill §7.2 fatto dagli esecutori.
- Nessuna regressione sul modello capienza appena rilasciato (badge calendario, blocco pubblico per-fascia, EmptyState).

Output: report di revisione con verdetto per fix (Approva / Approva con riserve / Richiede fix), difetti con file:riga, e punti che restano da verificare a mano da Matteo (specie ciò che dipende da staging/PROD edge). Non deployare nulla su PROD.

Chiusura verso Matteo: al termine, consegnare una checklist in linguaggio semplice (senza sigle, abbreviazioni o termini tecnici) di cosa verificare in app se le modifiche revisionate sono più di una; se il fix è uno solo, una breve spiegazione.

dammi checklist per controverificare in dev modifiche corrette quando hai finito. 
```

---

### Note per Matteo (fuori dai prompt)
- **P4** la reviso io con un controllo rapido quando l'esecutore finisce; **P5** è solo documentazione, nessuna revisione.
- **P3** è una **falla di conformità** (consenso marketing): trattala come prioritaria prima di qualsiasi invio reale di campagne.
- Tutto su `env/test`. L'edge `create-booking` del nuovo modello capienza è su **TEST v21**, **PROD non ancora deployata**: il go-live PROD resta un passo separato con tua conferma.
