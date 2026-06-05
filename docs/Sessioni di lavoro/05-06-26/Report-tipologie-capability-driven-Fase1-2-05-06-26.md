# Report — Tipologie prenotazione capability-driven (Fase 1 + Fase 2)

**Data:** 05-06-26
**Branch:** env/test
**Area:** Pagina Prenota (pubblica + config admin)
**Stato:** Fase 1 e Fase 2 completate, testate, revisionate. Fase 3 e 4 NON eseguite (per scelta).

---

## 0. Cappello

- **Cosa è cambiato:** in pagina Prenota, la tipologia "Prenota un tavolo" con un menù collegato ora
  mostra le card delle categorie ingredienti (prima non mostrava nulla).
- **Cosa resta:** Fase 3/4 non richieste; gancio intolleranze pronto ma non cablato; allineamento
  skill PRENOTA sul deprecato e finding feature `category_order_keys` da gestire al commit.
- **Serve una tua azione:** sì — decidere come committare separando questo lavoro dalla feature
  `category_order_keys` già presente nel working tree.

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| (nessuno in questa chiusura) | — | La skill PRENOTA cita `bookingTypeUsesMenuSelections` (ora shim deprecato) come verifica per nuove modalità (data flow §5, riga 211). Andrebbe allineata a `modeUsesMenu`, MA i file di contesto Prenota sono già nel working tree con modifiche della feature `category_order_keys`: non li tocco ora per non mescolare due lavori. Allineamento da fare al commit della feature capabilities (vedi §11 R3). |
| `docs/Sessioni di lavoro/05-06-26/Report-...md` | creato | Questo report. |

---

## 1. Il problema (in parole semplici)

Sulla pagina pubblica `/prenota`, scegliendo la tipologia **"Prenota un tavolo"** con una card
scorrevole collegata a un menù preselezionato, **le card delle categorie ingredienti non
comparivano**. Il cliente non vedeva niente da comporre.

**Causa:** una regola scritta sul *nome* della tipologia. Il codice mostrava il menù solo per
"rinfresco di laurea" e "menù a prezzo fisso". "Tavolo" era escluso a priori, prima ancora di
controllare se ci fosse davvero un menù collegato.

**Decisione di prodotto (Matteo):** la tipologia è concettualmente una sola; i nomi sono etichette.
Il comportamento deve dipendere da **cosa è configurato** (capacità), non dal nome.

---

## 2. Cosa è stato fatto

### Fase 1 — sblocco del bug (solo pagina pubblica, nessun tocco admin)
- **BookingRequestForm.tsx**: rimosso il filtro per nome dal gate `showMenuSelectionSection`.
  Ora la sezione menù compare in base a **card scorrevole + preset collegato e risolto**, per
  qualsiasi tipologia. Allineata la validazione submit (l'obbligo di scegliere una card vale per
  ogni tipologia con card configurate, non più solo per i tipi-menù).
- **MenuSelection.tsx**: una card con preset mostra **solo** gli ingredienti del preset, per ogni
  tipologia (rimette in regola la LOCK "Ingredienti preset custom", che il bug violava per "tavolo").

### Fase 2 — fondamenta scalabili (comportamento invariato)
- Nuovo **bookingCapabilities.ts**: funzioni pure che decidono "usa menù / usa intolleranze" per
  **capacità** invece che per nome, con risoluzione a cascata (esplicito → dati → default per tipo).
  Contiene anche `isMenuItemVisibleForSelection` (la fonte unica del filtro ingredienti).
- **bookingTypeMenu.ts**: ora è uno *shim deprecato* che delega al nuovo layer (semantica identica).
- **bookingPublicFormConfig.ts** + **restaurantSettingRegistry.ts**: aggiunto il campo opzionale
  `capabilities` su BookingMode, con parse difensivo e preservazione (LOCK Parser/normalizer).
  Le config vecchie senza il campo continuano a funzionare identiche.

---

## 3. Il flusso utente dopo il fix (invariato nello scheletro)

1. Admin genera ingredienti/categorie (tab Menu).
2. Admin crea un menù preselezionato (preset).
3. Admin collega il preset a una card scorrevole in "Personalizza form".
4. Admin può personalizzare la card *solo per la vetrina* (titolo, descrizione, prezzo, ingredienti
   nascosti, ordine categorie) — il meccanismo "live vs congelato" del resolver è intatto.
5. Il cliente vede il menù del preset e compone.

**Unica differenza:** prima "tavolo" si fermava al passo 5 mostrando nulla; ora arriva fino in fondo
come le altre tipologie.

---

## 4. Verifiche eseguite

- **typecheck**: zero errori.
- **lint**: zero warning.
- **test booking**: 269 verdi (erano 241; +28 nuovi tra filtro preset, capabilities, round-trip legacy).
- **Test manuale (Matteo)**: `/prenota` "Prenota un tavolo" mostra le 3 card categoria; funziona anche
  responsive.
- **Verifica dati DB TEST (sola lettura)**: nessuna modalità ha card senza preset
  (`cards_without_preset = 0`). Quindi la nuova validazione submit non rende inviabile nessun form
  esistente.

---

## 5. Revisione (sub-agent) — esiti

Tutte le invarianti di competenza di questo lavoro **RISPETTATE**:
- LOCK Ingredienti preset custom — ordine del filtro corretto.
- LOCK Card senza preset — nessuna griglia.
- LOCK Parser/normalizer — capabilities parsate, preservate, fallback su legacy.
- LOCK Caricamento async — gestito (anzi rafforzato in `menuComposeVisibility`).

**Finding accolto e corretto:** il test del filtro replicava la logica a mano (rischio di divergenza).
Risolto estraendo `isMenuItemVisibleForSelection` come funzione pura importata sia da MenuSelection
sia dal test → ora il test verifica il codice vero.

**Finding NON di questo lavoro (erano già nel working tree, feature `category_order_keys` di sessione
precedente):** modifica additiva al resolver, bug indici frecce su/giù nel pannello admin quando
l'ordine salvato contiene chiavi "stale", dedup mancante in scrittura. → Da valutare separatamente,
non toccati in questa sessione.

---

## 6. Cosa NON è stato fatto (per scelta)

- **Fase 3** (interruttori admin "Usa menù / Usa intolleranze"): Matteo non li vuole ora.
- **Fase 4** (multi-settore): rimandata.

### Nota per la futura modifica "togliere intolleranze via codice"
Richiesta di Matteo: poter disattivare la sezione intolleranze per una tipologia comodamente da
codice, senza interruttori UI. È già pronto il gancio: `modeUsesDietary(mode)` in
`bookingCapabilities.ts`. Oggi la sezione intolleranze segue ancora il vecchio aggancio; per attivare
il controllo via capability basta leggere `modeUsesDietary` davanti alla sezione nel form (un punto
solo). Da fare quando Matteo deciderà.

---

## 7. File toccati (questa sessione)

**Modificati:**
- `src/features/booking/components/BookingRequestForm.tsx`
- `src/features/booking/components/MenuSelection.tsx`
- `src/features/booking/utils/bookingTypeMenu.ts`
- `src/features/booking/constants/bookingPublicFormConfig.ts`
- `src/features/booking/lib/restaurantSettingRegistry.ts`

**Aggiunti:**
- `src/features/booking/utils/bookingCapabilities.ts`
- `src/features/booking/utils/__tests__/bookingCapabilities.test.ts`
- `src/features/booking/components/__tests__/MenuSelectionCategoryEntries.test.ts`

**NON toccati (per LOCK):** `bookingFormResolver.ts` (in questa sessione), migrazioni DB,
`useCreateBookingRequest`.

> **Nota diff intrecciato:** `BookingRequestForm.tsx` (96 righe nel diff) e `MenuSelection.tsx`
> contengono SIA le modifiche di questa sessione (capabilities/gate/validazione/filtro) SIA quelle
> della feature `category_order_keys` di una sessione precedente (righe `category_order_keys` /
> `categoryOrderKeys`). I due lavori condividono questi file. Vedi Q2/Q3.

---

## 8. La mia lettura della sessione (versione agente)

- **Cosa ha funzionato:** il piano in `.cursor/plans` era dettagliato (righe esatte, LOCK citate,
  fasi a rischio crescente). Questo ha reso l'esecuzione lineare: leggere il codice reale ai 3 punti
  chiave, confermare il piano, applicare. La separazione Fase 1 (sblocco) / Fase 2 (fondamenta) ha
  permesso di chiudere il bug con rischio minimo prima di costruire l'astrazione.
- **Difficoltà:** il working tree conteneva già un lavoro non committato (feature `category_order_keys`).
  Questo ha confuso la revisione (il sub-agent ha attribuito a questa sessione bug che erano della
  feature precedente). Risolto verificando il diff file per file e smistando i finding. Da qui in poi
  ho distinto sempre «mio» vs «già lì».
- **Migliorìa suggerita (come dato, non applicata):** quando una sessione parte con un working tree
  già sporco di altro lavoro, conviene che il prompt iniziale lo dichiari esplicitamente, così la
  revisione finale parte già sapendo cosa NON è in scope. Senza questo, il sub-agent revisore spreca
  budget a indagare codice non pertinente.

---

## 9. Derivazione errori

- **Test che replicava la logica (MINOR 4)** — *errore agente (lieve, evitabile).* Avevo scritto il
  test del filtro ricopiando il `.filter` a mano invece di testare il codice reale: sarebbe rimasto
  verde anche cambiando il filtro vero. Derivava dalla fretta di coprire l'invariante senza prima
  estrarre una funzione pura. Evitabile estraendo subito `isMenuItemVisibleForSelection`. Corretto.
- **Test capabilities malformate fallito al primo giro** — *errore agente.* Lo spread `...mode` nel
  normalizer ricopiava il `capabilities` grezzo prima della mia aggiunta condizionata. Derivava dal
  non aver considerato che lo spread porta con sé il campo malformato. Risolto con destructuring
  esplicito (`const { capabilities: raw, ...rest } = mode`).
- **Finding revisione non pertinenti** — *vincolo strutturale (working tree condiviso).* Vedi §8.
- Nessun bug preesistente introdotto da questo lavoro; le invarianti LOCK di competenza sono rispettate.

---

## 9-bis. Analisi post-revisione (richiesta Matteo: «Prenota è LOCK? altri bug analoghi?»)

Analisi su codice + 3 file di contesto Prenota. Esiti:

**Pagina Prenota NON è ancora LOCK.** Il flusso pubblico (cliente) è coerente e testato, ma admin e
pubblico **non condividono ancora la stessa logica**: restano 7 call-site che decidono per NOME
(`bookingTypeUsesMenuSelections`) invece che per capacità. Finché la migrazione allo shim/capability
non è completata, la zona è un cantiere a metà, non bloccabile come consolidata.

**Bug gemello latente trovato E FIXATO (commit `08b2bb4`):**
`isStaffPresetSelectableForBookingType` in `src/features/booking/constants/presetMenus.ts` —
stessa identica causa del bug principale: escludeva `tavolo` PER NOME, in contraddizione col proprio
commento. **Fix applicato** (sub-agent + verifica chiamante): ora delega a
`defaultModeCapabilities(bookingType).uses_menu` (Livello C del layer capability), eliminando la
duplicazione. Comportamento storico preservato byte-per-byte (rinfresco/menu_fisso selezionabili,
tavolo no), cambia solo la fonte della decisione. Test `presetMenuDisplay.test.ts` aggiornati con
casi capability-driven. Verifica indipendente: 271 test verdi, typecheck+lint puliti.
**Correzione del chiamante (me):** il sub-agent aveva lasciato un commento che reintroduceva la
contraddizione codice/commento («tavolo torna selezionabile» mentre il codice dà false) → riscritto
per dire il vero e documentare come abilitarlo in futuro (passare la BookingMode + modeUsesMenu).

**Gli altri 6 call-site sono corretti per design** (calendario, BookingRequestCard, AdminBookingForm,
BookingDetailsModal, menuPricing): usano lo shim su prenotazioni GIÀ SALVATE, dove il `booking_type`
è il tipo storico del record — lì il nome è la fonte giusta, non un bug.

### Indagine «vincoli nascosti» (sub-agent + verifica chiamante) → FU-036

Richiesta Matteo: stanare regole/vincoli che lui non conosce (come il filtro-per-nome). Indagine
sub-agent su tutto il codice Prenota, findings verificati sul codice reale. Esito: **3 residui dello
stesso anti-pattern «decidi per nome» sopravvivono nel pubblico** —
`BookingSummarySidebar.tsx:60` (`hasMenu = booking_type !== 'tavolo'`),
`BookingRequestForm.tsx:1055` (reset intolleranze solo per `tavolo`),
`presetMenus.ts:227` (`shouldShowComposeMenuHeader === 'rinfresco_laurea'`). Inoltre il **Livello A**
del layer capability (interruttori admin) non ha UI → comportamento ancora deciso dai nomi via
Livello C; `modeUsesDietary` è codice morto nel pubblico (sezione intolleranze sempre visibile).
**Azioni di questa sessione:** documentato tutto in skill PRENOTA §3-bis (così non è più nascosto) +
aperto **FU-036** per la rimozione. Il resto (edge `create-booking`, promo, resolver) verificato
name-agnostic, nessuna sorpresa. Commit `6c67f9d`.

### Mappa test ↔ codice consolidato (riferimenti)

| Comportamento consolidato | Test di riferimento | Stato |
|---|---|---|
| Gate visibilità menù (capability Livello B) | `utils/__tests__/bookingCapabilities.test.ts` (`activeSubTabShowsMenu`) | ✅ testato |
| Filtro ingredienti card+preset (LOCK preset custom) | `components/__tests__/MenuSelectionCategoryEntries.test.ts` (`isMenuItemVisibleForSelection`) | ✅ testato |
| Capabilities risoluzione A→C + parse difensivo | `utils/__tests__/bookingCapabilities.test.ts` | ✅ testato |
| Round-trip capabilities legacy (parser/normalizer) | `constants/__tests__/bookingPublicFormConfig.test.ts` | ✅ testato |
| Resolver field_overrides (live vs congelato) | `services/__tests__/bookingFormResolver.test.ts` | ✅ testato |
| Ordine categorie ingredienti | `utils/__tests__/orderCategoryKeys.test.ts` | ✅ testato (feature `category_order_keys`) |

---

## 10. Cosa resta per la prossima sessione

- **Fase 3** (interruttori admin Usa menù/Usa intolleranze): non richiesta ora da Matteo.
- **Collegamento `modeUsesDietary`** alla sezione intolleranze del form (gancio già pronto) — quando
  Matteo vorrà disattivare le intolleranze via codice.
- **Finding della feature `category_order_keys`** (non di questa sessione): bug indici frecce su/giù
  nel pannello admin con chiavi stale, dedup mancante in scrittura, LOCK resolver da formalizzare.
  Da gestire separatamente con chi ha fatto quella feature.
- ~~Bug gemello `isStaffPresetSelectableForBookingType`~~ → **FATTO** in questa sessione (commit
  `08b2bb4`), vedi §9-bis.
- **Completare la migrazione allo shim/capability** dei call-site pubblici/admin che hanno la
  `BookingMode` disponibile (prerequisito per poter dichiarare Pagina Prenota «LOCK»).
- **Allineare le skill PRENOTA** sul deprecato `bookingTypeUsesMenuSelections` → `modeUsesMenu`
  (da fare al commit della feature capabilities, vedi §5/R3).

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1:
- «analizza questo plan. e parliamo di cosa cambia e come. voglio sapere tutot a livello di lfusso
  utente e come funzionerà miglioramenti rispetot ora o possibili conflitti che genererà. parlaimo del plan»
- «leggi anche file e skil di contesto per capire senso di pagine e lfusso per capire se creiamo danni»
- «prima di eseguire tu il plan, dimmi cos'è usa intolleranze legato a interrutori? e spiegami in breve
  se il flusso dati mantiene questo allinemento : generazione menu da utente in pagina admin, generazione
  di menu preselezionato, inserimento di menu preselezionato in card scorrevole, possibilità di editare
  il menu SOLO per visualizzazione pagina prenota, e poi dati mostrati in ui cliente che prenota. corretto?
  sarà cosi il flusso?»
- «perfetto procedi col plan anche fase due se va tutto liscio»
- «testo e tutto funziona. anche responsive. per ora non mis ervono interrutori per disattivare
  intolleranze. l'importante è che si possa togliere per me che facico una modifica al codice, comodamente.
  sembra tutto ok. lancia sub agent per revisione. e fai report intanto.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato con `git diff --stat` e `git diff`. Confermato: 5 file modificati (BookingRequestForm
+96, MenuSelection +47, bookingPublicFormConfig +25, restaurantSettingRegistry +7, bookingTypeMenu +8)
e 3 file nuovi (bookingCapabilities.ts, 2 test). **Correzione importante emersa dalla riverifica:**
`BookingRequestForm.tsx` e `MenuSelection.tsx` contengono ANCHE modifiche della feature
`category_order_keys` (righe `category_order_keys`/`categoryOrderKeys` nel diff), non solo le mie. Ho
aggiunto la nota «diff intrecciato» in §7 per non attribuirmi codice altrui. Il conteggio test (269,
+28) corrisponde all'ultima esecuzione vitest. La verifica DB TEST (`cards_without_preset = 0`) è
reale, eseguita via MCP Supabase_test in sola lettura su docnnernvp.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: File correlati riletti/verificati:
- `docs/Prenota-Skill/PRENOTA_SKILL.md` e `.../contesto/PRENOTA_DATA_FLOW_CONTEXT.md`: letti interi
  per validare le LOCK. **Da valutare un aggiornamento:** la skill §5/«Come estendere» cita
  `bookingTypeUsesMenuSelections` come funzione di verifica per nuove modalità (riga 211 del data flow);
  ora è uno shim deprecato e la fonte è `modeUsesMenu`. NON l'ho modificato in questa chiusura perché
  i due file di contesto sono già nel working tree con modifiche altrui (`category_order_keys`) e non
  voglio mescolare; lo segnalo come allineamento da fare quando si committa la feature capabilities.
- Tipi: `src/types/booking.ts` (BookingType) riletto — nessuna modifica necessaria.
- Test: `bookingFormResolver.test.ts`, `menuComposeVisibility.test.ts` risultano modificati nel working
  tree ma dalla feature `category_order_keys`, NON da me.
- Nuovi test miei allineati al codice reale (importano la funzione, non la replicano — vedi MINOR 4 corretto).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho fatto: (1) Fase 3 e 4 (per scelta esplicita di Matteo). (2) Il collegamento di
`modeUsesDietary` alla sezione intolleranze: l'ho lasciato come gancio pronto, non cablato, perché
Matteo ha detto «per ora non mi servono interruttori». (3) Allineamento skill PRENOTA sul deprecato
`bookingTypeUsesMenuSelections` → `modeUsesMenu`: NON fatto in questa chiusura, resta follow-up
(§10). (4) Migrazione completa dei restanti call-site allo shim: non necessaria ora, sono corretti per
design (record storici). *Aggiornamento fine sessione:* committato tutto (feat `67d3df9`, docs
`852f0a7`, fix gemello `08b2bb4`) e fixato il bug gemello — quindi (3 della versione precedente
«non committato») è superato.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito principale: il working tree partiva già sporco di un altro lavoro non committato, e né
il prompt né lo skill system me lo segnalavano in modo strutturato — l'ho scoperto solo facendo
`git status`/`git diff` dopo la revisione. Miglioria: un controllo di pre-sessione (hook o riga nel
prompt) che dichiari «attenzione: working tree contiene N file modificati non da te» con la lista,
così l'esecuzione e soprattutto la revisione partono sapendo cosa è in scope. Secondo attrito minore:
i sub-agent vanno verificati non solo nel codice ma anche nei COMMENTI — quello del bug gemello aveva
lasciato un commento che contraddiceva il codice (stesso difetto che doveva risolvere); l'ho corretto
io. Metodo confermato: dopo ogni sub-agent rileggo diff reale + rieseguo i test, non mi fido del report.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto**: i due file della skill Prenota (entry + data flow) contenevano esattamente
le LOCK che servivano a giudicare se il piano creava danni; non ho dovuto cercare altrove. Il principio
«pochi file letti interi» ha funzionato. Hook: il nudge di fine-sessione è stato **utile** — il report
era effettivamente incompleto (mancavano §8, §9, §11) e l'avrei chiuso troppo magro. Non rumore: ha
intercettato un report sotto-soglia.

---

## 12. Self-review

1. **Dati = diff reale:** ✅ riaperto il diff, corretta l'attribuzione (nota diff intrecciato in §7, Q2).
2. **File correlati:** ⚠️ skill PRENOTA da allineare sul deprecato `bookingTypeUsesMenuSelections`,
   rimandato per non mescolare col diff altrui — motivato in R3/R4 (non è un follow-up nascosto, è un
   vincolo del working tree condiviso).
3. **Q1-Q6 coerenti:** ✅ sostanza in ognuna, Q2/Q3 con file riaperti.
4. **Tono utente:** ✅ cappello e §2/§3 per flussi e schermate.
Sistemato durante la self-review: aggiunta la nota «diff intrecciato» e l'attribuzione corretta dei
finding di revisione.
