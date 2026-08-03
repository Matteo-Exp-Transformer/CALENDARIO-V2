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
| 5 | Consolidamento | ⏳ prossimo: push + eventuale re-merge `main`, poi nuovo cantiere tavoli/assegnazione (§6) |

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

---

## 3-bis. Il buco trovato dalla corsia D — **non toccarlo senza via libera**

Chiudi una fascia dall'admin («Chiudi servizio»), vai sul form pubblico: **gli orari di quella fascia
sono ancora lì e ancora cliccabili**, e il cliente prenota dentro un servizio che tu hai chiuso.
Riproduzione e prova in [RIPROVA_D.md](E2E-Report/RIPROVA_D.md), bug 1.

Verificato leggendo il codice: `max_turns` — il campo che si azzera quando chiudi — **non compare in
nessuna Edge Function né in nessuna RPC pubblica**. Non è una regressione di S4: la chiusura fascia
non è mai stata collegata al percorso del cliente.

Sistemarlo tocca l'Edge `create-booking` e la generazione degli orari pubblici, cioè il pezzo che
gira **già online per i clienti veri**. È un cantiere separato, con autorizzazione esplicita di
Matteo, non una rifinitura da infilare nel giro 4.

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
| Avviso di fine turno che si apre da solo | ✅ in piedi, **collaudo mai completato** |
| Walk-in (cliente senza prenotazione) | ✅ in piedi, sala e tavolo obbligatori |
| Briefing PDF del servizio | ✅ in piedi |

**Cosa si è mosso ed è ora chiuso (aggiornato 03-08-26, tutto committato in `c299a65`):**
FIX-4A card espandibile + lampeggio · FIX-4B striscia prenotazioni in testata · FIX-4C orario sulla
card · FIX-4D tavoli più grandi in piantina · S4-FIX-5 sostituzione guidata · S4-FIX-6 fasce
accavallate (committato prima, `432436c`) · **Servizio-UI FIX-1..7** (round nuovo 03-08-26, testato
da Matteo): fasce orarie chiuse di default, header con unica CTA "Aggiungi sala", walk-in sotto le
fasce, piantina visibile senza fascia scelta, tavolo assegnato sul digest Home/Calendario, card
"Assegnate" senza duplicazione tavolo/posti (note staff + intolleranze al loro posto). Dettaglio
tecnico in `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` §9.9–§9.11.

**Cosa manca ancora, in ordine di peso:**
1. La chiusura di una fascia non arriva al cliente (§3-bis) — l'unico che tocca la produzione.
2. La capienza pubblica non guarda i tavoli veri, guarda solo il tetto della fascia (decisione §3:
   sì, ma dopo il collaudo).
3. Voci di collaudo mai completate: avviso fine turno, tavolata liberata a metà, stato «in uscita»,
   pulsanti a 375px. Sono bloccate dagli orari di prova, non da difetti.
4. Debiti noti: e2e quasi assenti su questa pagina, walk-in non transazionale, nome tavolo unico solo
   lato app.
5. **Nuovo cantiere annunciato da Matteo (03-08-26):** pagina Servizio → tavoli e assegnazione
   prenotazioni — ancora da scoping, non iniziato (vedi §6).

---

## 5. Ordine di lavoro consigliato *(§0-2 chiuse il 03-08-26 — storico, sotto il prossimo passo reale)*

1. ~~Le due revisioni della §0~~ — **fatto**: FIX-5/FIX-6 committati `432436c`, allineamento
   migrazioni chiuso (registro riallineato, vedi §2).
2. ~~Giro 4 per ondate~~ — **fatto**: FIX-4A/4B/4C/4D + Servizio-UI FIX-1..7 committati insieme in
   `c299a65` (03-08-26), Matteo ha testato il secondo round a video.
3. **Prossimo passo reale:** push di `c299a65` su `origin/env/test` (non ancora fatto — chiedi
   conferma a Matteo se non esplicita), poi il nuovo cantiere «tavoli e assegnazione prenotazioni»
   che Matteo ha annunciato in chiusura del round Servizio-UI (§4-bis punto 5) — ancora da scoping.
4. Resta in coda, non urgente: ricollauda a mano quello che le riprove non hanno potuto provare
   (§4-bis, punto 3: serve una fascia lunga o una durata pasto corta, non un fix) e riscrivi le voci
   di checklist toccate dalle decisioni della §3.

---

## 6. Dopo S4 — quello che resta in coda

- **Re-merge `main` → `env/test`** per recuperare `f617077`: da fare **prima** di qualsiasi rollout.
- **Rollout PROD**: migrazioni 063→066 + Edge `create-booking` + client **insieme**, con
  autorizzazione esplicita di Matteo chiesta ogni volta. Lezione del 23-05: migrazione che restringe
  permessi e fix client viaggiano insieme, mai separati.
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
