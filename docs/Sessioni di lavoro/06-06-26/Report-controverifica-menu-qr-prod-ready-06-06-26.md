# Report — Controverifica prod-ready Menu QR (cliente nuovo) — 06-06-26

> Orchestratore Opus + 3 sub-agent read-only. Branch `audit/menu-qr-prod-ready` (da `env/test`).
> Modalità **deep** (tocca DB PROD + fix codice + coerenza admin↔pubblico).

**Cosa è cambiato:** l'area Menu QR è ora pulita da dati di test/altre aziende sia in pagina pubblica
sia nel modale admin — bonificati carosello e nomi spazzatura su PROD e TEST, centralizzato un default
tema nel codice.
**Cosa resta:** 1 follow-up nuovo (chiave categoria malformata `secondi_piattie` su PROD da-tommaso —
solo chiave interna, label già corretta) + codice morto QR opzionale (6 export orfani) tracciato.
**Serve una tua azione:** no — fix codice validato (419 test verdi), dati PROD/TEST bonificati come
autorizzato. Resta da committare/mergiare se vuoi portarlo in produzione.

---

## 1. Obiettivo

Replicare sull'area Menu QR l'audit «cliente nuovo» già fatto su Pagina Prenota: nessun dato di
test/demo, nessun nome/foto di altre aziende, nessun mock o fallback non neutro — né in pagina pubblica
`/menu/:slug/qr/:shortCode` né nel modale admin «Impostazione Menù QR». Più: trovare elementi compilati
in admin ma non mostrati al cliente, e codice hardcoded.

Perimetro: **solo Menu QR** (pagine pubbliche + modale/lista admin + hook/utils/temi). Anagrafica e
Personalizza form NON riaperti (già blindati ieri su Prenota).

## 2. Metodo

Orchestratore + 3 sub-agent read-only in parallelo (riportano, non fixano), esiti **riverificati riga
per riga** dal parent prima di qualsiasi modifica:
1. Audit codice hardcoded/mock/fallback non neutri.
2. Coerenza admin→pubblico (ogni campo salvato ha un consumatore? c'è roba compilata ma non mostrata?)
   + codice morto.
3. Flusso utente + responsive 375/834/1280 + stati vuoti/errore.

Letture DB su TEST (`docnnernvp`) e PROD (`rwuxgvld`) — `get_project_url` prima di ogni blocco.

## 3. Esito sub-agent (riverificato dall'orchestratore)

- **Codice**: area QR **pulita**. Nessun nome/foto/slug di altra azienda, nessun mock, nessun URL
  stock; tutte le letture pubbliche usano `supabasePublic` (non c'è il bug-gemello di Prenota). Unico
  finding **MINOR confermato**: magic-string `'mediterranean_teal'` ripetuta 3× invece della costante
  `DEFAULT_THEME_KEY` già esistente.
- **Coerenza admin→pubblico**: **solida**. Ogni campo del modale ha un consumatore pubblico (Nome QR
  assente dal pubblico è invariante voluto). Isolamento tenant sulla copia foto catalogo→QR corretto
  (filtro `${tenantId}/booking-cat/`, nessuna copia cross-tenant). Propagazione rename/delete categoria
  completa. **6 finding MINOR di codice morto** (export orfani — vedi §6).
- **Flusso + responsive**: **prod-ready**. Stati vuoto/errore tutti neutri (nessun leak di altri
  tenant); il fetch piatti è bloccato per categoria fuori `category_filter` (niente leak). Griglia/
  carosello/tab/line-clamp conformi su 375/834/1280.

Verdetto unanime: **zero BLOCKER, zero MAJOR nel codice**. Il vero rischio cliente-nuovo era sui **dati**.

## 4. Fix codice applicato

| Fix | File | Cosa |
|---|---|---|
| QR-1 | `src/features/booking/utils/menuQrAppearance.ts`, `src/features/booking/hooks/useMenuQrCodes.ts` | 3 letterali `'mediterranean_teal'` → import `DEFAULT_THEME_KEY` da `menuThemes.ts` (default centralizzato). Nessun cambio di comportamento. |

`npm run validate`: **lint + typecheck + 419 test (48 file) verdi**. Warning `act(...)` su
`menuQrCategoryFieldCap.test.tsx` pre-esistenti (già notati nella blindatura del 06-06-26), fuori scope.

## 5. Bonifica dati

Cosa vede un cliente che scansiona = `restaurant_name` (hero), `carousel_items` (titoli/eyebrow),
`menu_categories.label` + `menu_qrcode_categories.title/description` (nomi categoria). Lì stava la
spazzatura.

### TEST (`docnnernvp`) — riscrittura pulita (autorizzata)
Tenant `trattoria-da-tommaso`:
- QR `ypyayc6`: carosello `21e12e2121e`/`asdadsasdqwd21`/`2e` → testi realistici; nome QR `wqeqw` →
  «Menu pranzo».
- Override categoria: title `cazzarollli` → «Primi piatti»; description placeholder
  (`asdsadsa`, `asdasdasdasdasdada`, `qqwewqewqe…`) → `NULL`.

### PROD (`rwuxgvld`) — bonifica (autorizzata: nessun cliente attivo)
| Tenant | Cosa | Da → A |
|---|---|---|
| al-ritrovo | carosello QR `eyam4pt` (ATTIVO), 3 slide | titoli `hdhhdur`/`jrkek`/`jdjdud`/`odoeoei`/… → testi neutri puliti (immagini mantenute) |
| da-tommaso | `restaurant_name` | `"Matteo Cavallaro"` → `"Trattoria Da Tommaso"` |
| da-tommaso | org `name` | trim spazio finale |
| da-tommaso | label «Secondi piattie» (refuso) | `menu_categories.label` + 2× `menu_qrcode_categories.title` → «Secondi piatti» |

Verifica finale PROD read-only: **0 residui** di testo spazzatura nell'area QR visibile al cliente.

> Scelta da revisore: la **chiave** categoria `secondi_piattie` (malformata) è stata **lasciata
> invariata** — è interna, mai mostrata, e legava 3 piatti + 2 QR + 2 override; rinominarla a mano via
> SQL avrebbe rischiato di orfanare i piatti. Corretta solo la label visibile. La rinomina pulita della
> chiave va fatta dal modale admin (che usa `syncMenuCategoryKeyRename` per coordinare tutte le
> tabelle). → follow-up FU-MQR-3.

## 6. Follow-up aperti

- **FU-MQR-3 (NUOVO)** — chiave categoria `secondi_piattie` su PROD `da-tommaso`: rinominare a
  `secondi_piatti` dall'admin (overlay «Categorie ingredienti» → salva con conferma rename), così il
  sync propaga su `menu_items`, `category_filter`, override e storage. Solo igiene interna (label già
  corretta, cliente non vede la chiave).
- **Codice morto QR — RIMOSSO (06-06-26, su richiesta di Matteo a fine sessione).** 6 export orfani
  verificati senza chiamanti, ora eliminati: `MenuHomepageConfigPanel()` (componente deprecato vuoto)
  + import `useMenuCategories`/`cn` resi orfani; `useMenuQrcodeCategories()`,
  `useUpsertMenuQrcodeCategoriesBatch()` (+ import `useMutation`/`useQueryClient`/`handleSupabaseError`/
  tipo `MenuQrcodeCategoryOverrideDraft` resi orfani nell'hook — il tipo resta VIVO in `menu.ts`,
  usato da `MenuQrSettingsSavePayload.categoryOverrides`); `CarouselAddPhotoBlock`;
  `getMenuQrValidationMessage`; prop `hideToolbarLabel` di `MenuQrCarouselSection`. File toccati:
  `useMenuQrcodeCategories.ts`, `menuQrValidation.ts`, `MenuHomepageConfigPanel.tsx`. `npm run validate`
  verde (lint 0 warning → nessun import orfano residuo, 419 test).

## 7. Stato finale

Area Menu QR resa prod-ready per un cliente nuovo: codice senza dati altrui (1 default centralizzato),
coerenza admin→pubblico confermata, dati PROD e TEST bonificati da spazzatura visibile. Fix codice su
branch `audit/menu-qr-prod-ready` validato; bonifiche dati già applicate sui DB (non versionate, sono
dati).

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «pagina Qr menu clienti e lato admin per configuare (crea modifica QR code in tab menù), sono tecnicamente blindati. controlla documenti di contesto in skill system e report di lavori svolti. sii approfondito. quando hai il contesto necessario e ti è chiaro il senso, leggi i report e readme nelle cartelle di sessioni di lavoro inerenti. poi lancia un sistema di sub agent per testare e controverificare e trovare bug o elementi che non vengono mostrati anche se compilati in lato admin, o se ci sono elementi hardcoded o mock data inutili. considera che se vendo l'app a cliente nuovo, non ci devono essere elementi di test o di altre aziende hadcodate ne in pagina prenota ne in pannello admin per modificarla ovvero personalizza form e anagrafica aziende. tu agisci come revisore del lavoro dei sub agent e terrai le file del lavoor che c'è da svolgere. se hai dubbu fammi domande prima di iniziare. prendi spunto anche da vecchi test con sitemi sub agent usati per pagina prenota. incomincia con un plan di lavoro. tu rimarrai orchestrator e revisore del lavoro. sub agent lavorano e verificano.» (2) Risposte alle 3 domande di scope: «Lettura DB + bonifica TEST» / «Solo Menu QR» / «3 sub-agent paralleli». (3) Sulla bonifica TEST: «Sostituisci con dati realistici puliti». (4) Sui dati PROD: «al momento non clienti attivi su prod. possiamo modificarlo».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Riaperto `git diff src/`: il diff codice tocca **esattamente 2 file**, entrambi citati nel report §4 — `useMenuQrCodes.ts` (2 righe: `theme_key: input.theme_key ?? 'mediterranean_teal'` → `?? DEFAULT_THEME_KEY` alle linee 61 e 162, + 1 riga import) e `menuQrAppearance.ts` (1 riga: `: 'mediterranean_teal'` → `: DEFAULT_THEME_KEY` al parse + 1 riga import). Nessun altro file `src/` toccato — coerente col report che dichiara «1 sola correzione codice (QR-1)». Le 3 magic-string citate corrispondono ai 3 punti del diff. I 419 test e l'esito `validate` verde li ho dal run reale di `npm run validate`. I valori-dato citati (carosello `hdhhdur/jrkek/…`, `restaurant_name` «Matteo Cavallaro», refuso «Secondi piattie») provengono dalle SELECT eseguite e dai RETURNING degli UPDATE, non dalla memoria.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: (a) **Skill area** `docs/Menu-QR-Skill/MENU_QR_SKILL.md` §5 — aggiornato in questa chiusura con **FU-MQR-3** (chiave `secondi_piattie` da rinominare via UI). Verificato nel diff doc. (b) **Tipi/test**: il fix QR-1 NON cambia comportamento (stesso valore `'mediterranean_teal'`, solo riferito alla costante già esistente in `menuThemes.ts:89`), quindi nessun tipo né test andava aggiornato; i test esistenti dell'area QR (menuQrValidation, menuQrCategoryKeySync, categoryIcons, menuQrStorage, menuQrCategoryOrder, menuQrCategoryFieldCap) restano verdi senza modifiche. (c) `MENU_QR_DATA_FLOW_CONTEXT.md` / `MENU_QR_REFERENCE.md`: NON modificati perché nessun flusso o regola cambia (la centralizzazione è interna; il valore di default resta lo stesso già documentato). (d) Memoria `project_menu_qr_mappatura.md` aggiornata con esito controverifica + FU-MQR-3.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Tre cose, tutte consapevoli: (1) **Non rimosso il codice morto QR** (6 export orfani verificati senza chiamanti) — fuori dal tema «dati cliente» e tocca file con export ancora vivi (`MenuHomepageConfigPanel`), richiede un giro di test dedicato; tracciato in §6. (2) **Non rinominato la chiave** `secondi_piattie` su PROD — scelta deliberata (legava 3 piatti + 2 QR; la rinomina va fatta dal modale admin che coordina via `syncMenuCategoryKeyRename`, non SQL a mano); corretta solo la label visibile; tracciato come FU-MQR-3. (3) **Non committato/mergiato** i fix codice — lasciato a decisione di Matteo (branch `audit/menu-qr-prod-ready`), come da sua abitudine di stage selettivo.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: la skill Menu QR è ottima sul «cosa è voluto» (§3 invarianti, decisivi per scartare falsi-positivi dei sub-agent) ma **non distingue esplicitamente «audit codice» da «audit dati DB»** — ho dovuto io capire che in quest'area i finding stanno quasi tutti sui DB, non nel codice. Miglioria: aggiungere allo skill (o a un FU) una riga «per la prod-readiness cliente-nuovo del QR, il rischio primario è sui DATI tenant (restaurant_name, carousel_items, label categoria), non nel codice — partire dalle SELECT», così il prossimo agente non rifà l'esplorazione da zero. È il gemello della lezione già emersa su Prenota.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto**: la catena APP_CONTEXT §0 → MENU_QR_SKILL → contesto/* + il report blindatura gemello Prenota mi ha dato tutto il necessario senza eccesso; gli invarianti §3 sono stati il filtro che ha evitato di segnalare come bug il nome QR interno, l'eyebrow placeholder, il fallback «Menu». Hook **utile, non rumore**: lo `stop` mi ha correttamente bloccato per la sezione 11 mancante — senza, avrei chiuso con un report privo della parte contabile. Il reminder TodoWrite ripetuto è stato lievemente ridondante (avevo già la lista attiva) ma innocuo.
