# Handoff S4 — per il prossimo agente senior (Opus)

> Scritto il 02-08-2026, **aggiornato il 03-08-2026 sera**. Branch `env/test`. Nessuna scrittura
> su PROD. Il tuo ruolo è **supervisione**: Matteo controverifica, non testa attivamente. Tu mandi
> avanti i giri di lavoro, leggi i report degli agenti e ti fidi solo di quello che è dimostrato.
>
> **Aggiornamento 03-08-2026:** le due revisioni di §0 sono **chiuse**. FIX-5/FIX-6 committati il
> 02-08 (`432436c`, report `Report-fix5-fix6-servizio-02-08-26.md`). Il giro 4 (FIX-4A/4B/4C/4D,
> restato uncommitted dopo §0.1) **e** un nuovo round di 7 fix layout ("Servizio-UI FIX-1..7", vedi
> `Report-7fix-servizio-ui-03-08-26.md`) sono stati validati insieme e **committati il 03-08 in
> `c299a65`** — Matteo ha testato a video i 7 punti del secondo round e confermato ok. §0.1/§0.2
> restano sotto come **registro storico** di cosa è stato controllato; §1/§4-bis sono la fonte
> aggiornata sullo stato attuale.
>
> **Aggiornamento 03-08-2026 sera — cantiere "tavoli e assegnazione" (punto 5 di §4-bis, di seguito):**
> scoping fatto con Matteo (tre fronti scelti insieme, non uno solo) e portato a termine in tre wave,
> ciascuna con un agente dedicato + revisione indipendente. **Tre commit su `env/test`, non ancora
> pushati:** `3e9fa2c` (chiusura fascia → pubblico, **chiude il buco di §3-bis sotto**), `ae4e7ae`
> (nome tavolo unico a DB + walk-in atomico via RPC, chiude i due debiti citati in §4-bis punto 4),
> `5780717` (nuova copertura e2e sulle voci mai collaudate + **un bug reale trovato e non ancora
> corretto**, vedi subito sotto). Report completo:
> [Report-cantiere-tavoli-assegnazione-servizio-03-08-26.md](../03-08-26/Report-cantiere-tavoli-assegnazione-servizio-03-08-26.md).
> Migrazioni **068** (nome tavolo) e **069** (RPC walk-in) applicate solo su TEST.
>
> **Bug nuovo, aperto:** l'avviso "Tavolo a fine turno" non sopravvive a un reload della pagina dopo
> aver premuto "Ancora occupato" — l'avviso ritorna per lo stesso tavolo. Causa:
> `handledReleaseTableIds` in `AssignmentMapPanel.tsx` è uno stato React locale, mai persistito.
> Registrato come `FU-SERV-RELEASE-NOTICE-1` in `docs/FOLLOW_UP.md`. **Non corretto qui**: serve
> prima una decisione di Matteo su come persistere la conferma (localStorage di sessione? colonna
> DB?). Il test che lo cattura (`e2e/pro/pro-service-tables-lifecycle.spec.ts`) resta rosso di
> proposito, deterministico (6 passed / 1 failed).
>
> ---
>
> ## ⛳ AGGIORNAMENTO 03-08-2026 (tarda sera) — **PARTI DA QUI**
>
> Il tuo punto d'ingresso non è più questo file, è
> **[PIANO_SENIOR_TEST_E_SALUTE_CODICE.md](../03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md)**.
> Questo handoff resta la mappa d'insieme della pagina Servizio (§4-bis) e il registro storico.
>
> **Cos'è successo:** audit di allineamento skill/codice con 5 agenti Sonnet su fronti disgiunti +
> controverifica personale di ogni voce grave. Esito in
> [Report-audit-allineamento-e-checklist-test-03-08-26.md](../03-08-26/Report-audit-allineamento-e-checklist-test-03-08-26.md),
> che contiene **due checklist**: §5 le prove a mano che spettano a Matteo, §6 il lavoro per gli agenti e2e.
>
> **Trovato un bug BLOCCANTE mai visto prima:** elimini un tavolo **occupato** e la prenotazione resta
> appesa — senza tavolo e **senza il pulsante «Togli tavolo»**, quindi senza uscita da interfaccia
> (`useDeleteTable`, `useServizioTables.ts:148-175`, nessuna guardia in `ServizioPage.tsx:158`).
> L'eliminazione **sala** fa invece la cosa giusta (`useRooms.ts:205-238`): è il modello da copiare.
>
> **Quattro decisioni di Matteo, tutte chiuse** — vedi §3-ter sotto. Sbloccano `FU-SERV-RELEASE-NOTICE-1`
> e tre bug nuovi (`FU-SERV-DELETE-TABLE-1`, `FU-SERV-TURN-MOVE-1`, `FU-SERV-SLOT-VALIDATION-1`,
> tutti in `docs/FOLLOW_UP.md`). Sono la **Fase 0** del piano: falli prima di toccare i test.
>
> **Due allarmi di questo handoff sono da considerare superati:**
> 1. Il re-merge `main` → `env/test` per `f617077` **non è un cancello al rollout**: la fix è già dentro
>    `env/test` per contenuto (`create-booking/index.ts:66` e `:534-545`, col suo test). Serve solo per
>    igiene git. Il §6 qui sotto lo dà per bloccante: è un'informazione superata.
> 2. La presunta contraddizione su FIX-6 (fasce accavallate ancora accettate) **è smentita**: il blocco
>    esiste, `ServiceSlotsManager.tsx:561-570`. Le riprove erano anteriori al commit del fix.
>
> **Attenzione al metodo:** su 5 voci di agenti controverificate, 1 confermata con precisazione, 1
> corretta in entrambe le direzioni, 1 smentita, 1 con errore di perimetro — e i due problemi più gravi
> non li aveva visto nessun agente. **Non pubblicare una voce d'agente senza averla riaperta.**

---

## 0. La prima cosa che fai all'avvio — **due revisioni, in quest'ordine** *(chiuse il 02/03-08-26, storico)*

Quando prendi in mano questa sessione, due lavori sono partiti in parallelo e **nessuno dei due è
stato revisionato**. Non lanciare altro finché non li hai chiusi.

### 0.1 — Revisiona i due fix della vista Servizio (FIX-5 e FIX-6)

Piano approvato da Matteo: **[Piano-fix5-fix6-servizio-02-08-26.md](Piano-fix5-fix6-servizio-02-08-26.md)**.
Lanciato in parallelo con gli agenti del giro 4 la sera del 02-08.

- **FIX-5 — sostituzione guidata su tavolo occupato.** Al posto del pulsante unico «Libera e
  assegna» il riquadro deve chiedere *cosa fai di chi è seduto?* con tre risposte: **spostalo** su un
  altro tavolo (nuova, oggi non esiste), **ha finito** → libera e archivia, **torna in attesa**.
- **FIX-6 — fasce di servizio accavallate.** Il salvataggio deve rifiutarle riusando
  `validateSlotConfigs` (`src/features/booking/utils/bookingTimeSlots.ts`), che già esiste e già
  funziona sull'altro editor di fasce.

Cosa guardare con attenzione, perché è la parte che si rompe in silenzio:
1. **Il conteggio dei turni.** Spostare o rimettere in attesa **non deve** consumare un turno del
   tavolo conteso (riga cancellata); archiviare **sì** (riga timbrata). Provalo a video: dopo una
   sostituzione i turni residui del tavolo devono calare di **uno solo**.
2. **L'ordine delle tre scritture** nel caso «sposta»: prima si siede chi viene spostato sul tavolo
   nuovo, poi si libera il vecchio, poi entra la prenotazione nuova. Non ci sono transazioni: con
   l'ordine sbagliato un errore a metà lascia dei clienti senza tavolo.
3. **Le tavolate su più tavoli**: si agisce solo sul tavolo conteso, gli altri restano.
4. Il ramo **«Turni esauriti»** (tavolo libero ma turni finiti) non doveva essere toccato.
5. FIX-6 non doveva toccare il database: solo controllo lato app.

### 0.2 — Revisiona l'esecuzione del piano di allineamento migrazioni

Report: **[Report-allineamento-migrazioni-supabase-test-02-08-26.md](Report-allineamento-migrazioni-supabase-test-02-08-26.md)**,
commit `8a93882`. Foto del registro prima e dopo in `REGISTRO_PRIMA.json` / `REGISTRO_DOPO.json`.

Da controllare:
- `npx supabase migration list --linked` → ogni file locale ha la sua riga, nessuna riga data-ora
  residua, nessuna riga senza file (tranne il doppio prefisso `003`, falso positivo noto).
- `npx supabase db push --linked --dry-run` → **niente in attesa**.
- La colonna `booking_requests.served_at` ha anche il suo **commento**: era il pezzo che mancava
  dall'applicazione a mano della `066`, ed è la prova che la catena funziona davvero.
- **I quattro file che non risultavano registrati** (`018`, `020`, `057`, `058`): l'agente doveva
  dimostrare oggetto per oggetto che erano davvero già applicati, non archiviarli al buio. Se il
  report non lo dimostra, quella è la cosa da rifare.
- `npm run db:apply` con il progetto giusto funziona; simulando un altro ref si rifiuta.
- `npm run validate` verde.

> Nota: `.claude/hooks/guard-prod.mjs` è escluso da git (`.git/info/exclude`) e resta **solo locale**;
> la copia versionata è `.cursor/hooks/guard-prod.mjs`. Non è una dimenticanza dell'agente.

---

## 1. Dove siamo

**S4 Servizio è completo e committato su `env/test` (non ancora pushato — vedi nota push sotto). Mai
andato in PROD.**

| Giro | Cosa | Stato |
|------|------|-------|
| 1 | Collaudo e2e a 4 corsie (Playwright MCP) | ✅ fatto — 52 voci: 32 OK, 7 KO, 9 bloccate |
| 2 | FIX-1 orologio · FIX-2 assegnazioni/archiviazione · FIX-3 indagine | ✅ fatto, revisionato |
| — | Revisione d'insieme + layout vista Servizio | ✅ fatto |
| 3 | RIPROVA-B, RIPROVA-D | ✅ eseguite 02-08 sera — report in `E2E-Report/` |
| 4 | FIX-4A card assegnate · FIX-4B/4C testata · FIX-4D tavoli più grandi | ✅ fatto, committato `c299a65` (03-08) |
| — | **S4-FIX-5** sostituzione guidata · **S4-FIX-6** fasce accavallate | ✅ revisionato e committato `432436c` (02-08) |
| — | **Servizio-UI FIX-1..7** — collapse fasce, header sale, piantina senza fascia, badge tavolo su digest Home, strip Assegnate senza duplicati | ✅ testato da Matteo (7/7 ok), committato `c299a65` (03-08) — report `Report-7fix-servizio-ui-03-08-26.md` |
| 5 | **Cantiere "tavoli e assegnazione"** — chiusura fascia→pubblico, nome tavolo unico a DB, walk-in atomico via RPC, e2e su voci mai collaudate | ✅ fatto, committato `3e9fa2c`/`ae4e7ae`/`5780717` (03-08 sera), **non pushato** — report `Report-cantiere-tavoli-assegnazione-servizio-03-08-26.md` (cartella `03-08-26`). Trovato 1 bug nuovo (`FU-SERV-RELEASE-NOTICE-1`), non corretto |
| 6 | **Audit allineamento skill/codice + due checklist di test** | ✅ fatto 03-08 tarda sera — 5 agenti su fronti disgiunti + controverifica. Trovato **1 bug bloccante** + ~15 divergenze skill/codice. Report e piano nella cartella `03-08-26` |
| 7 | Consolidamento | ⏳ prossimo: **Fase 0 del piano** (i 4 fix decisi), poi Fase 1 (riparare i test che passano senza verificare nulla), poi Fase 2 (13 test nuovi). Push quando Matteo lo chiede |

**Cosa hanno detto le riprove del giro 3.** La corsia B conferma i fix del giro 2 su tutto ciò che ha
potuto provare (orologio allineato, turni residui, «Fascia chiusa» distinta, annullamento che non
brucia turni, `served_at` scritto). Quattro voci sono rimaste **bloccate dall'orario, non dal
codice**: l'agente ha creato una fascia dalle 19 con durata pasto 3 ore, quindi «In uscita» non
poteva scattare prima delle 22. La corsia D ha trovato **un buco vero** — vedi §3-bis.

Tutti i report stanno in [E2E-Report/](E2E-Report/); l'indice è il `README.md` di quella cartella.
La sintesi con gli ID dei difetti (S4-BUG-1 … S4-NOTE-11) è
[SINTESI.md](E2E-Report/SINTESI.md); la revisione del giro 2 è
[REVISIONE_FIX.md](E2E-Report/REVISIONE_FIX.md).

---

## 2. ✅ Il blocco è caduto — e con lui il problema che lo causava

La migrazione `066_booking_requests_served_at.sql` è **applicata sul TEST** (`docnnernvp`): Matteo ha
incollato l'`ALTER TABLE` a mano il 02-08, e il resto del file è passato dal canale nuovo.

Soprattutto: **gli agenti ora possono scrivere sul database di test da soli.** Il registro migrazioni
era annotato in due grafie diverse e non combaciava più con i file del repo — per questo `db push`
era vietato in blocco. Riallineato il registro, la regola è cambiata:

> `supabase db push --include-all` **vietato per sempre** (doppio prefisso `003`).
> `db push` normale **ammesso solo su TEST**, preferibilmente con **`npm run db:apply`**, che si
> rifiuta di partire se il progetto collegato non è `docnnernvp`.
> Su **PROD** nessun push: migrazioni a mano, con conferma esplicita di Matteo ogni volta.

Il lavoro è nel commit `8a93882` ed **è da revisionare** (§0.2).

---

## 3. Decisioni di Matteo del 02-08 — chiuse, non riaprirle

| Questione | Decisione | Conseguenza |
|-----------|-----------|-------------|
| Capienza pubblica allineata ai tavoli / D38 (S4-BUG-5) | **Sì, ma dopo il collaudo** | Direzione confermata, cantiere separato. Non è un KO: oggi online comanda solo il cap fascia, ed è il comportamento atteso. Tocca RPC `get_available_arrival_times` + Edge `create-booking`: rischio PROD alto, va fatto con migrazione + deploy + client insieme. |
| Denominatore del badge % in Calendario (S4-BUG-6) | **Tutto il locale, com'è** | Nessun lavoro. La voce §4-5 della checklist va **riscritta**, non segnata KO. |
| Walk-in «solo coperti» (S4-BUG-4) | **No: sala e tavolo restano obbligatori** | Nessun lavoro. Va tolta la voce §5-1 dalla checklist e allineato il masterplan (D45 parlava di walk-in senza tavoli). |
| Badge Classic senza limite (S4-BUG-7) | **Va bene così** | Chiusa come non-difetto: FIX-3 ha dimostrato col confronto su `main` che non è una regressione S4. |
| Sostituzione su tavolo occupato | **Tre scelte, e la prima sposta chi è seduto** | FIX-5, §0.1. La scelta 1 riguarda chi è già a tavola, non la prenotazione trascinata. |
| Turno bruciato dalla sostituzione | **No, se il cliente viene spostato o rimesso in attesa** | Vale anche per la scelta «torna in attesa», che oggi il turno lo consuma: è un cambio di comportamento esistente, voluto. Archiviare invece consuma il turno: lì il pasto c'è stato. |
| Fasce di servizio accavallate | **È un difetto, va bloccato** | FIX-6, §0.1. Solo controllo lato app. |

Restano **operative**, non decisioni: rieseguire la corsia D su una fascia larga (la prima volta era
50 minuti in un buco di 59, quindi zero orari pubblici validi) e la spunta Privacy non cliccabile da
automazione, che resta un debito di collaudo Classic.

## 3-ter. Decisioni di Matteo del 03-08 — chiuse, non riaprirle

| # | Questione | Decisione | Dove si esegue |
|---|---|---|---|
| **D-A** | Eliminare un tavolo **occupato** | Come l'eliminazione di una sala: **avvisare prima**, mai in silenzio. La liberazione **non brucia un turno** | Piano §0.1 |
| **D-B** | Spostare un cliente consuma un turno? | **No, mai** — nemmeno dal percorso «Modifica tavolo» del Calendario. Archiviare invece **sì** | Piano §0.2 |
| **D-C** | Validazioni dell'editor fasce | **Logica convalidata**, nessun conflitto di prodotto: far convergere i due editor su un'unica fonte, **nomi doppi bloccati in entrambi** | Piano §0.3 |
| **D-D** | Avviso «Tavolo a fine turno» dopo «Ancora occupato» | Conferma **persistita sul record di assegnazione** (vale per tutti i dispositivi, resiste al reload) **+ l'avviso torna una volta** dopo un intervallo di richiamo — **30' proposti, non contestati**. Scartato localStorage: in servizio si lavora da più schermi | Piano §0.4 |

> **Come chiedergli le cose:** la prima formulazione di D-D era tecnica («localStorage o colonna DB?») e
> ha prodotto «non mi è chiaro cosa devo decidere». Riformulata in termini di sala — *cosa deve fare
> l'app quando il cameriere preme «Ancora occupato»* — con le due domande nascoste separate e le opzioni
> descritte per conseguenza, ha deciso subito **e ha scelto l'opzione più ricca, non la più semplice**.
> Se Matteo non risponde, sospetta la lingua della domanda prima di segnarla «in attesa».

**Manopole ancora da confermare (nessuna blocca il lavoro):** intervallo di richiamo 30' · soglia di
ritardo 15' · buffer di riassetto 10' — questi due sono **default assunti da un agente a giugno e mai
confermati**, già in uso · durata walk-in D47 · posizione del pulsante «Aggiungi tavolo». Sono tutte
«ogni quanto tempo l'app fa una cosa»: chiedile **in blocco**, quando hai qualcosa da mostrare a video.

---

## 3-bis. Il buco trovato dalla corsia D — ✅ **RISOLTO SU TEST il 03-08-26 sera**

> Chiuso nel cantiere "tavoli e assegnazione" (§4-bis punto 5, aggiornamento in cima al file).
> Commit `3e9fa2c`, migrazione `067`, `create-booking` deployata come **v30 su TEST**. Il testo
> sotto resta come registro storico del bug com'era.

~~Chiudi una fascia dall'admin («Chiudi servizio»), vai sul form pubblico: **gli orari di quella
fascia sono ancora lì e ancora cliccabili**, e il cliente prenota dentro un servizio che tu hai
chiuso.~~ Riproduzione e prova originali in [RIPROVA_D.md](E2E-Report/RIPROVA_D.md), bug 1.

Verificato leggendo il codice: `max_turns` — il campo che si azzera quando chiudi — non compariva in
nessuna Edge Function né in nessuna RPC pubblica. Non era una regressione di S4: la chiusura fascia
non era mai stata collegata al percorso del cliente.

**Fix:** la migrazione `067` esclude le fasce chiuse (`max_turns=0`) da `get_public_slot_config` e
`get_available_arrival_times` (le due RPC pubbliche che alimentano gli orari sul form); l'Edge
`create-booking` aggiunge un controllo server-side in più (409 `SLOT_CLOSED`) come difesa in
profondità, nel caso qualcuno bypassasse la RPC. Verificato su TEST con chiamate dirette: fascia
chiusa sparisce dall'elenco pubblico e viene rifiutata se si prova comunque a prenotarci. **Solo
TEST** — il deploy su PROD (dove gira ancora `create-booking` v21, senza questo fix, quindi lo stesso
buco è presumibilmente **ancora aperto in produzione**) resta da fare con autorizzazione esplicita di
Matteo, insieme al resto del rollout S4 (§6).

Sempre dalla corsia D, rimasto in sospeso: l'invio completo di una prenotazione Classic (oltre la
spunta Privacy, altri campi obbligatori bloccano il submit da automazione) e la controprova
«oltre il limite di coperti». Da fare a mano.

---

## 4. Cosa è stato corretto e va tenuto d'occhio nelle riprove

- **Stati dei tavoli e ora di punta**: confronto ora-a-muro contro ora-a-muro, senza costanti «+2».
  Novità da ricordare nel collaudo: **«In uscita» ora scatta a fine pasto + buffer di riassetto**,
  non a fine pasto. Se una fascia ha 10' di buffer, l'avviso arriva 10' più tardi di quanto scriveva
  la checklist originale.
- **Turni**: un turno concluso continua a consumare (semantica invariata); a cambiare è che l'avviso
  arriva **prima**, sul tavolo. L'**annullamento** ora cancella fisicamente la riga e non brucia un
  turno — verificato che il permesso di DELETE esista (`admin_delete_bta`, mig. 014 + GRANT 026).
- **Fascia chiusa** (`max_turns = 0`) ha un messaggio suo, non più «turni esauriti».
- **Archiviazione al checkout**: solo il checkout archivia; annullamento, «Libera e assegna» e
  release da Calendario no; la tavolata archivia solo all'ultimo tavolo. Non fa più fallire il
  checkout se la scrittura non riesce.
- **Layout vista Servizio**: prenotazioni in testata (striscia orizzontale), sale a due colonne da
  desktop, **una sola sala sotto 1024px** — quella scelta nelle linguette.

---

## 4-bis. Quadro generale della pagina Servizio — cosa c'è, cosa si muove, cosa manca

Questa è la mappa da avere in testa prima di toccare qualsiasi cosa. La pagina è **completa e viva su
`env/test`, mai andata in produzione**: i ristoratori veri, oggi, la pagina Servizio non ce l'hanno.

**Cosa fa già la pagina (S3 + S4, tutto su TEST):**

| Pezzo | Stato |
|---|---|
| Sale e piantina dei tavoli (crea, sposta, ridimensiona, griglia 10px) | ✅ in piedi |
| Due viste: elenco a schede e piantina della sala | ✅ in piedi |
| Assegnazione trascinando la prenotazione sul tavolo | ✅ in piedi |
| Tavolate su più tavoli (una prenotazione, due tavoli piccoli) | ✅ in piedi |
| 5 stati del tavolo: libero, in arrivo, occupato, in ritardo, in uscita | ✅ in piedi, orologio corretto |
| Turni per fascia, «turni residui», «turni esauriti», fascia chiusa | ✅ in piedi |
| Forzatura con motivo registrato (chi ha forzato e perché) | ✅ in piedi |
| Annulla assegnazione (non brucia turni) · Libera tavolo (archivia) | ✅ in piedi |
| Avviso di fine turno che si apre da solo | ✅ in piedi, **collaudato 03-08-26 sera** — trovato `FU-SERV-RELEASE-NOTICE-1` (non sopravvive a un reload) |
| Walk-in (cliente senza prenotazione) | ✅ in piedi, sala e tavolo obbligatori |
| Briefing PDF del servizio | ✅ in piedi |

**Cosa si è mosso ed è ora chiuso (aggiornato 03-08-26 sera):**
FIX-4A card espandibile + lampeggio · FIX-4B striscia prenotazioni in testata · FIX-4C orario sulla
card · FIX-4D tavoli più grandi in piantina · S4-FIX-5 sostituzione guidata · S4-FIX-6 fasce
accavallate (committato prima, `432436c`) · **Servizio-UI FIX-1..7** (testato da Matteo, committato
in `c299a65`): fasce orarie chiuse di default, header con unica CTA "Aggiungi sala", walk-in sotto le
fasce, piantina visibile senza fascia scelta, tavolo assegnato sul digest Home/Calendario, card
"Assegnate" senza duplicazione tavolo/posti (note staff + intolleranze al loro posto). Dettaglio
tecnico in `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` §9.9–§9.11. **Cantiere "tavoli e
assegnazione" (tre commit `3e9fa2c`/`ae4e7ae`/`5780717`, non pushati):** chiusura fascia → pubblico
(§3-bis, sopra), nome tavolo unico a DB, walk-in atomico via RPC, nuova copertura e2e sulle voci di
collaudo mai completate. Dettaglio in `ADMIN_SERVIZIO_CONTEXT.md` §9.12–§9.13 e nel
[report di sessione](../03-08-26/Report-cantiere-tavoli-assegnazione-servizio-03-08-26.md).

**Cosa manca ancora, in ordine di peso:**
1. ~~La chiusura di una fascia non arriva al cliente~~ — ✅ risolto su TEST (§3-bis), **PROD non
   ancora deployata** (v21 attuale non ha il fix — il buco è presumibilmente ancora aperto lì).
2. La capienza pubblica non guarda i tavoli veri, guarda solo il tetto della fascia (decisione §3:
   sì, ma dopo il collaudo) — resta aperto, non toccato dal cantiere del 03-08-26 sera.
3. ~~Voci di collaudo mai completate: avviso fine turno, tavolata liberata a metà, stato «in uscita»,
   pulsanti a 375px~~ — ✅ collaudate 03-08-26 sera con test e2e deterministici (`page.clock`, niente
   più bloccate dagli orari di prova). Tavolata a metà/stati/375px confermati corretti; **l'avviso di
   fine turno ha invece un bug reale** (`FU-SERV-RELEASE-NOTICE-1`, sopra), non ancora corretto.
4. ~~Debiti noti: e2e quasi assenti su questa pagina, walk-in non transazionale, nome tavolo unico
   solo lato app~~ — walk-in e nome tavolo ✅ chiusi (§4-bis sopra); la copertura e2e resta parziale
   (7 test nuovi sul ciclo di vita tavoli, non un'esaustività dell'intera pagina — es. mancano ancora
   e2e sul flusso walk-in via UI e sull'assegnazione con conflitto di turno).
5. **Nuovo cantiere annunciato da Matteo (03-08-26):** pagina Servizio → tavoli e assegnazione
   prenotazioni — ✅ scoping fatto e portato a termine il 03-08-26 sera (punti 1, 3 parziale, 4 di
   questa lista). Resta il bug trovato al punto 3 e la decisione su come correggerlo.

---

## 5. Ordine di lavoro consigliato *(§0-2 e cantiere tavoli/assegnazione chiusi il 03-08-26 — storico, sotto il prossimo passo reale)*

1. ~~Le due revisioni della §0~~ — **fatto**: FIX-5/FIX-6 committati `432436c`, allineamento
   migrazioni chiuso (registro riallineato, vedi §2).
2. ~~Giro 4 per ondate~~ — **fatto**: FIX-4A/4B/4C/4D + Servizio-UI FIX-1..7 committati insieme in
   `c299a65` (03-08-26), Matteo ha testato il secondo round a video.
3. ~~Cantiere «tavoli e assegnazione prenotazioni»~~ — **fatto** il 03-08-26 sera: scoping con
   Matteo (tre fronti scelti insieme) + tre wave eseguite e revisionate, committate in
   `3e9fa2c`/`ae4e7ae`/`5780717` (§4-bis, §3-bis, report dedicato).
4. ~~**Prossimo passo reale:** push dei tre commit su `origin/env/test`; poi decisione con Matteo su
   come correggere `FU-SERV-RELEASE-NOTICE-1`.~~ ⛳ **SUPERATO il 03-08-26 notte:** la decisione c'è
   (D-D, §3-ter) **ed è stata implementata** — `FU-SERV-RELEASE-NOTICE-1` è chiuso insieme agli altri
   tre bug della Fase 0 (mig. **070**, report
   [Report-fase0-quattro-fix-03-08-26.md](../03-08-26/Report-fase0-quattro-fix-03-08-26.md)). Il push
   resta **non fatto e non chiesto**: ora sono **5** i commit locali, più il lavoro della Fase 0 nel
   working tree. Il prossimo passo reale è la **Fase 1** del piano (riparare i test che passano senza
   verificare nulla).
5. Resta in coda, non urgente: la copertura e2e sul resto della pagina Servizio (walk-in via UI,
   assegnazione con conflitto di turno) e riscrivi le voci di checklist toccate dalle decisioni
   della §3.

---

## 6. Dopo S4 — quello che resta in coda

- **I 4 fix decisi (§3-ter)** — Fase 0 del piano. `FU-SERV-RELEASE-NOTICE-1` non è più bloccato:
  la decisione D-D c'è.
- ~~**Re-merge `main` → `env/test`** per recuperare `f617077`: da fare **prima** di qualsiasi rollout.~~
  ⚠️ **Superato:** la fix è già dentro `env/test` per contenuto (verificato 03-08 tarda sera). Il
  re-merge serve solo per igiene git, **non è un cancello al rollout**.
- **Rollout PROD**: migrazioni 063→**069** (+ quella nuova di D-D) + Edge `create-booking` (**v30 su
  TEST**, PROD ancora a v21 — include anche il fix chiusura fascia→pubblico di §3-bis) + client
  **insieme**, con autorizzazione esplicita di Matteo chiesta ogni volta. Lezione del 23-05: migrazione
  che restringe permessi e fix client viaggiano insieme, mai separati.
  ⚠️ Finché non si fa, **in produzione la chiusura di una fascia non blocca il form pubblico**.
- **Cantiere capienza pubblica / D38** (decisione §3, rimandata).
- Poi il **cantiere Fable** — mandato in [STATO_APP_E_MANDATO_FABLE.md](STATO_APP_E_MANDATO_FABLE.md).

---

## 7. Come lavorare con Matteo

- Non è tecnico: parla per **schermate e flussi concreti** («apri Servizio, clicchi il tavolo,
  compare…»), non per nomi di file isolati. Breve di default.
- **Grilletti**: «prepara» = solo il prompt, non eseguire; «lavoro ok» = report completo senza
  commit; «fai report finale» = commit + push; «ragioniamo» = fermarsi a ragionare;
  «spiegamelo semplice» = effetto concreto, breve. Fonte:
  [VOCABOLARIO.md](../../Comunicazione-Skill/VOCABOLARIO.md).
- Quando un agente riporta un risultato, **non prenderlo per buono**: il caso del badge Classic era
  un falso KO su un giorno vuoto, e il caso dei turni esauriti l'ha trovato Matteo a mano perché
  l'agente aveva (correttamente) scritto BLOCCATO invece di inventarsi un esito.
- **Mai** commit o push senza richiesta esplicita. **Mai** scritture su PROD senza conferma chiesta
  ogni singola volta. Le migrazioni già applicate non si toccano.
  Sul database: `db push --include-all` **vietato per sempre**; su TEST usa **`npm run db:apply`**
  (§2); su PROD nessun push, mai.
- ⚠️ **Il repo non ha prettier**: `npx prettier --write` riscrive tutto in doppi apici con punto e
  virgola. Lo stile è single-quote / no-semi, garantito da ESLint.
