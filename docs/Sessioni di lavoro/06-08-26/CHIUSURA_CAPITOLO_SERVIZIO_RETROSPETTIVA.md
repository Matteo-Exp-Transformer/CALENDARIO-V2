# Chiusura capitolo Servizio — retrospettiva e stato corrente

> **Data di fotografia:** 06-08-2026
> **Branch:** `env/test` · **HEAD di partenza:** `4e84fe7` · fotografia prima della pubblicazione
> finale. La chiusura viene committata e pubblicata esclusivamente su `origin/env/test`; nessun
> merge su `main`, DB/PROD o rilascio applicativo.
> **Verdetto product manager:** il capitolo **Servizio / S4 è chiuso tecnicamente su TEST**. Il
> piano senior del 03-08 ha completato le Fasi 0–3 e non deve essere riaperto. Questo non significa
> che la build sia già in PROD né che i cantieri successivi (Live, ordine da QR, atomicità
> cross-area) siano compresi nella chiusura.

Questo documento è la fonte di verità retrospettiva del capitolo. Per il comportamento operativo
vivo prevalgono, nell'ordine: codice e migrazioni correnti, `ADMIN_SERVIZIO_CONTEXT.md`, questo
documento; i vecchi report e prompt servono soltanto a ricostruire le decisioni.

## 1. Perché il capitolo può essere chiuso

| Cancello | Evidenza finale | Stato |
|---|---|---|
| Piano senior | Fase 0 fix strutturali; Fase 1 base test; Fase 2 tutte le 13 righe; Fase 3 salute codice | ✅ completo |
| Flussi Servizio reali | ciclo tavoli 13/13; smoke/modali responsive 6/6; inclusi dati TEST e verifiche DB | ✅ protetti |
| Regressione applicazione | Playwright completo su server E2E isolato: **118/118**, 6,4 min, un worker | ✅ verde |
| Qualità statica/unit | `npm run validate` finale: vedi §8 | ✅ verde |
| Build | `npm run build` finale: vedi §8 | ✅ verde |
| Contesto agenti | skill, piano Admin, indice test e checklist riallineati in questa chiusura | ✅ allineato |

La chiusura è **tecnica e strutturale su TEST**: funzionalità, regressioni critiche e istruzioni per
gli agenti hanno un punto di partenza coerente. Il rollout PROD e l'accettazione manuale di Matteo
sono cancelli successivi autonomi, non motivi per lasciare aperto questo piano.

## 2. Retrospettiva delle sessioni

| Periodo | Passaggio | Risultato che resta nel prodotto |
|---|---|---|
| 12–19 giugno — prerequisiti Admin | Guard modifiche Servizio, tipizzazione walk-in, toggle/capienza fasce e riordino `display_order` | Base UI e salvataggi coerenti prima del masterplan |
| 21–22 giugno — masterplan e S0 | Definizione D1–D52, mappa AS-IS, correzione override fascia Edge, eliminazione di residui morti | Fondamenta dichiarate; override più specifico funzionante; area mappata prima della build |
| 23 giugno — S1 | Durata configurabile su tipologia/card | Config 30–360 minuti in `restaurant_settings`, senza migrazione |
| 23 giugno — S2 | Resolver unico della durata e snapshot | Durata storicizzata sulla prenotazione; cambi futuri di config non riscrivono il passato |
| 23 giugno — S3 | Intervalli di arrivo e validazione pubblica | Arrivi 5–120 minuti, regole server/client coerenti; rollout S1–S3 eseguito allora separatamente |
| 24–25 giugno — S4 A/B e post-QA | Sale morbide, briefing tavolo, modalità tavoli, finestre occupazione, cinque stati, capienza, walk-in, multi-tavolo e overbooking guidato | Motore Servizio integrato su TEST; migrazioni 063–065; Edge TEST aggiornata |
| 2 agosto — ripresa S4 | Due viste mappa, fine turno, tavolate, turni esauriti, archiviazione `served_at`, sostituzione guidata, layout | Uso operativo più leggibile; migrazione 066; regole D22/D23/D39/D48 rese concrete |
| 3 agosto — hardening dati | Fascia chiusa anche sul pubblico, nome tavolo unico, walk-in atomico | Migrazioni 067–069; niente walk-in orfano; unicità protetta anche a DB |
| 3–4 agosto — Fase 0 senior | Spostamento senza consumo turno, delete tavolo occupato, validatore fasce unico, avviso fine turno persistente | D48 corretta; migrazione 070; quattro regressioni strutturali chiuse |
| 4 agosto — Fase 1 | Riparazione suite E2E obsoleta, self-skip e test che potevano passare senza verificare l'effetto | Base E2E affidabile e seriale; i verdi tornano a significare comportamento osservato |
| 4–5 agosto — Fase 2 | Tredici ondate di copertura: Servizio, pubblico Classic, Calendario, Impostazioni e CRM | Flussi critici esercitati dal browser, inclusi 375/834/1280 e verifiche DB |
| 5 agosto — Fase 3 | Audit skill/codice, dead code, atomicità, `max_turns`, timezone, auth e loop Prenota | Divergenze sanate; D41 registrata; codice morto rimosso; auth con retry; migrazione 071 su TEST |
| 6 agosto — chiusura | Batteria completa su ambiente controllato; correzione di due difetti della prova, non del prodotto | Data passata deterministica; Playwright non riusa più il server personale su 5173; **118/118** |

## 3. Decisioni di prodotto e logiche canoniche

| Tema | Decisione stabile | Implicazione da non rompere |
|---|---|---|
| Attivazione modalità tavoli | Solo Pro/Enterprise con almeno un tavolo attivo | Classic non deve ereditare tavoli eventualmente presenti in cache |
| Durata | Snapshot per prenotazione; card vince sulla tipologia; fallback standard | Una modifica di configurazione non cambia occupazioni storiche |
| Finestra tavolo | Arrivo + durata + buffer, con overnight/DST e ora a muro | Lo stato e la capienza devono derivare dallo stesso resolver |
| Stati tavolo | Libero, In arrivo, Occupato, In ritardo, In uscita | Mappa, elenco e modali condividono etichette e colori |
| `max_turns` (D41) | `0` chiude la fascia; `>0` limita i turni per tavolo/fascia/data | Non trasformarlo in semplice interruttore: regge “Turni esauriti” e “Assegna comunque” |
| Storico turni (D48) | Append-only solo per turni realmente serviti | Checkout timbra; undo, spostamento e liberazione forzata cancellano la riga e non consumano turno |
| Checkout | `served_at` solo quando termina l'ultima assegnazione attiva | Una tavolata multi-tavolo si archivia all'ultimo tavolo, non al primo |
| Multi-tavolo | Una prenotazione può usare N tavoli; inserimento della selezione in un'unica operazione client | Posti mancanti visibili; undo rimuove tutte le righe appena create |
| Tavolo occupato | Sostituzione esplicita: sposta, archivia oppure riporta in attesa | Nessun drop silenzioso; scelta e motivazione devono restare auditabili |
| Walk-in | Tavolo obbligatorio quando esistono tavoli; limiti morbidi; fallback durata 90 min | Creazione booking+assignment è atomica via RPC 069; nessun rollback simulato |
| Fine turno | “Libero” chiude; “Ancora occupato” persiste sul DB e torna dopo 30 min; “Decido dopo” è locale | Non rendere permanente “Decido dopo”: è un rinvio della vista corrente, non una conferma |
| Capienza D38 | OFF: fisica dei tavoli; ON: minore fra fisica e cap fascia | Il badge Calendario Classic continua a usare la capienza per fascia |
| Fasce | Unico validatore: formato, nome duplicato, inizio=fine, overlap overnight | I due editor non devono tornare a validazioni divergenti |
| Ora | `confirmed_start`/`desired_time` sono trattati come ora a muro dal dominio | La RPC 071 evita lo scarto estivo nel conteggio disponibilità pubblico |
| E2E | Un worker e server dedicato `127.0.0.1:4173` | Non riusare il dev server di Matteo su 5173 e non alzare i worker senza isolare tenant/rate limit |

## 4. Stato attuale del codice

Il perimetro vivo ruota attorno a `ServizioPage`, `AssignmentMapPanel`, `ServicePlanMap`, gli editor
sale/tavoli/fasce, `useTableAssignments`, `useTableStatuses`, `useServizioTables`, `useRooms`,
`useWalkInMutation`, `resolveOccupancy` e `tableTurnLimits`.

La catena dati S4 versionata è:

| Migrazione | Contratto introdotto |
|---|---|
| 063 | soft-delete sale |
| 064 | snapshot occupazione e metadati prenotazione forzata |
| 065 | audit assegnazione forzata |
| 066 | `booking_requests.served_at` |
| 067 | fascia chiusa esclusa dal pubblico |
| 068 | nome tavolo unico per tenant |
| 069 | RPC atomica walk-in + assegnazione |
| 070 | conferma persistente dell'avviso fine turno |
| 071 | conteggio disponibilità sull'ora a muro |

Le migrazioni 063–071 e il client corrispondente sono nel repository. La 071 è certificata dai
report come applicata solo su TEST; **non dichiarare parità PROD**. Il 06-08 la verifica read-only
del registro remoto via CLI non è stata ripetibile perché l'autenticazione Supabase locale ha
risposto `401 Unauthorized`; nessuna scrittura DB è stata tentata. Il comportamento TEST è stato
comunque esercitato dalla suite E2E autenticata e dai test di non-regressione della 071.

## 5. Regressioni protette

| Flusso protetto | Copertura principale | Se diventa rosso, sospettare |
|---|---|---|
| Ciclo di vita tavoli, cinque stati, fine turno e reload | `pro-service-tables-lifecycle.spec.ts` (13 scenari) | resolver temporale, polling, persistenza 070, checkout |
| Tavolata 3+ tavoli, posti mancanti e undo | stessa spec + component test multi-tavolo | inserimento multiplo, cancellazione righe appena create |
| Tavolo occupato e walk-in forzato | stessa spec + `useWalkInMutation.rpc.test.tsx` | sostituzione guidata, reset conferma, RPC 069 |
| Turni esauriti e forzatura auditata | stessa spec + `tableTurnLimits.test.ts` | D41, `turn_number`, campi force 065 |
| Delete tavolo occupato e spostamento senza turno | E2E lifecycle + test hook/pagina Fase 0 | D48 o sequenze multi-write |
| Chiusura fascia → form pubblico | E2E lifecycle + `public-booking-classic.spec.ts` | 067, editor fasce, disponibilità pubblica |
| Modali Servizio reali 375/834/1280 | `pro-service.spec.ts` (6 scenari) | overflow, azioni fuori viewport, seed dati |
| Validazione fasce | `pro-service.spec.ts` + test `bookingTimeSlots` | duplicazione delle regole fra editor |
| Mappa/lista/briefing/assegnazione | `pro-service.spec.ts` + component/hook test Servizio | routing, responsive, join tavolo/sala |
| Capienza Pro/Classic e D38 | `calendario.adminBlindatura.test.tsx`, `useCapacityCheck` | contaminazione Classic o denominatore errato |
| Ora a muro e mezzanotte | lifecycle con timezone pilotato + `public-booking-classic` | `new Date()` applicato a valori dominio wall-clock |
| Sistema circostante | suite Playwright completa **118/118** | regressione cross-area, auth, tenant, rate limit, server E2E |

I test unit/component più rilevanti sono indicizzati in `ADMIN_TEST_SUITE_INDEX.md`; il numero totale
di test Vitest non è congelato qui perché cambia con gli altri cantieri. Il gate è `npm run validate`,
non un numero storico copiato da un report.

## 6. Cosa è chiuso e cosa è trasferito

### Chiuso in questo capitolo

- S0–S4 tecnico su TEST e Fasi senior 0–3.
- Decisioni D41/D48, walk-in atomico, fasce coerenti, fine turno persistente, responsive automatico.
- Base E2E deterministica: un worker, date locali esplicite, server dedicato.
- Divergenze note fra skill e codice relative al capitolo.

### Trasferito, non bloccante per questa chiusura

1. **Rollout PROD:** migrazioni 063–071 + Edge + client devono viaggiare insieme, solo dopo verifica
   ambiente e autorizzazione esplicita di Matteo.
2. **Accettazione manuale di prodotto:** `COLLAUDO_S4_CHECKLIST.md` resta a 4/62 spunte umane. Molte
   voci sono protette automaticamente, ma non vanno spuntate fingendo un collaudo di Matteo.
3. **Otto percorsi multi-write non atomici:** priorità massima `useForceReplaceBookingOnTable`
   (fino a 5 scritture), poi Menu QR, update/delete clienti, delete tavolo, delete sala e i due
   percorsi rename/delete categorie menu. È un cantiere cross-area autonomo; il walk-in è già il
   precedente positivo chiuso dalla RPC 069. Il report Fase 3 scrive “sette” in una frase, ma la
   sua tabella e la rilettura del codice del 06-08 ne contano otto: qui prevale il dato verificato.
4. **Prodotto futuro:** S4-LIVE, accesso staff dedicato, conto leggero, ordine da QR, ruoli fini,
   retention/Analytics e ripristino sala.
5. **Decisioni di configurazione:** confermare in una sessione prodotto soglia ritardo 15 min,
   buffer 10 min e fallback walk-in 90 min prima di presentarli come policy commerciale definitiva.
6. **Briefing PDF:** resta senza colonna Tavolo; la modale la mostra già.
7. **D38 pubblico:** l'allineamento della capienza pubblica ai tavoli resta un cantiere separato.
8. **Documentazione legale email:** fotografia tecnica aggiornata; DPA Brevo, sub-processor pubblico
   e Privacy Policy richiedono chiusura con professionista.
9. **Documentazione generale:** `npm run validate:docs` resta rosso per 14 path preesistenti nella
   sola area Console; non è un difetto Servizio.

## 7. Regole per il prossimo senior

- Non usare i prompt del 03–05 agosto come mandato: sono storico e risultano superati.
- Per Servizio partire da `AGENTS.md` → `APP_CONTEXT_SKILL.md` §0 → `ADMIN_SKILL.md` →
  `ADMIN_SERVIZIO_CONTEXT.md`; aprire questo documento per storia, decisioni e confini.
- Non riaprire Fasi 0–3 per “completare il piano”: sono complete.
- Se il nuovo lavoro riguarda uno dei punti trasferiti, creare un piano autonomo con un proprio
  criterio di uscita e la propria skill d'area.
- Non dichiarare “in produzione”: dire **blindato tecnicamente su TEST** finché il treno 063–071,
  Edge e client non è rilasciato con autorizzazione.
- Prima di cambiare D41, D48, ora a muro o atomicità walk-in, aggiungere o aggiornare il test che
  rende visibile la decisione.

## 8. Verifiche della sessione di chiusura

| Comando/prova | Esito |
|---|---|
| `npm run test:e2e` su server controllato 4173 | ✅ **118/118**, 6,4 min |
| Avvio Playwright senza server esterno | ✅ smoke Servizio **1/1**; server 4173 avviato e chiuso automaticamente, 5173/5174 lasciati intatti |
| Due precedenti rossi riprodotti e classificati | ✅ test data “passata” reso indipendente dalla mezzanotte; settings eseguito col corretto autosave OFF |
| Supabase CLI read-only su TEST | ⚠️ ref locale corretto, ma `projects list` → 401; nessun retry cieco e nessuna scrittura |
| `npm run validate` | ✅ exit 0 in 45 s; lint, typecheck e Vitest verdi. Restano warning React `act(...)` già noti nell'output dei test Settings |
| `npm run build` | ✅ exit 0 in 102,9 s. Restano warning non bloccanti già visibili su CSS generato, import misto Supabase e chunk principale >500 kB |
| `npm run validate:docs` | ⚠️ 14 path rotti preesistenti, tutti `docs/Console-Skill/` |

## 9. Affermazioni sicure per una futura pagina di prodotto

Si può dire che il sistema gestisce sale e tavoli, assegnazioni multi-tavolo, turni con forzatura
auditata, cinque stati operativi, fine turno confermato dallo staff, walk-in atomici, briefing e
layout responsive. Si può dire che i flussi critici sono coperti da test browser su TEST.

Non si deve ancora dire che Servizio è rilasciato in PROD, che è un POS, che supporta già ordini da
QR o una console Live multi-ruolo, che ogni flusso multi-write è transazionale, oppure che il
collaudo umano 62/62 è stato completato.
