# Report — Rev-A (verifica blindatura) Area A: FIX 1, 5, 8 (16-06-26)

**Data:** 16-06-26
**Branch:** `env/test`
**Tipo sessione:** **verifica** (profilo Verifica, revisore imparziale) — non esecuzione
**Plan di riferimento:** `analizza-questo-prompt-che-streamed-kettle.md` § Rev-A
**Esecutore verificato:** Claude (sessione 16-06-26), report
[Report-area-a-quick-wins-prenota-16-06-26.md](Report-area-a-quick-wins-prenota-16-06-26.md)

---

## 1. Cappello

Ho rieseguito tutti i gate del cancello di blindatura (MANUALE_BLINDATURA §4) per Area A invece di
fidarmi del verde dichiarato, e ho provato attivamente a rompere i 3 fix sui 4 fronti.
**Verdetto: Area A BLINDATA — SÌ.** Nessun fix di prodotto necessario: solo 1 nit di codice (non
bloccante) e 1 gap d'infrastruttura test (locale, non di prodotto) annotati sotto.

**Effetto concreto:** quanto dichiarato dall'esecutore è vero — il form Modifica Ingrediente si chiude,
il testo delle card tipologia è più grande senza rompersi, il carosello categorie si centra prima di
aprirsi su desktop. Ho anche verificato dal vero (E2E + screenshot Playwright reali, non solo
ragionamento sulle classi) cose che l'esecutore non aveva potuto controllare per mancanza di
credenziali/browser in quella sessione.

---

## 2. Cosa ho verificato

### Diff reale vs dichiarato
- `git diff --name-only main..env/test -- src/` da solo è ingannevole (mostra storico già committato
  su `env/test`, non il lavoro di Area A): il diff vero di Area A è **non commesso** in working tree.
  Confermato con `git status --short` + `git diff` puntuale: esattamente 3 file `src/` —
  `MenuPricesTab.tsx`, `BookingMenuCategoryCard.tsx`, `BookingModeCards.tsx` — uguali a quanto
  dichiarato. Famiglia "rompi" corretta: F1-leggero (FIX 1, FIX 8) + F2 (FIX 5, solo classi Tailwind
  statiche statiche — verificato nessuna classe dinamica template-string che il JIT non genererebbe).

### Fase B — `npm run validate`
- Rieseguito da zero: **745/745 verde** (lint + typecheck + Vitest), conferma il numero dichiarato.

### Fase C — controtest "rompi" (attivo, non solo letto)
- **FIX 1** (`MenuPricesTab.tsx`): letto `handleSave()` per intero. La chiusura EDIT non chiama
  `resetProductFormState()` esistente ma duplica il reset inline, e **non** azzera `is_available` né
  `ingredientEditMode` — verificato che è **voluto/coerente**: `is_available` è opzionale nel tipo
  `MenuItemInput` e non è mai letto da quel reset (il toggle disponibilità è un'altra mutation);
  `ingredientEditMode` governa l'intera sotto-sezione "Modifica Ingredienti", non il form riga, e il
  ramo ADD pre-esistente (non toccato da questo fix) ha **lo stesso pattern** — nessuna regressione,
  solo duplicazione di codice minore (nit, non bloccante, non vale la pena un fix isolato).
  - Letto il nuovo test `menuPricesEditClose.adminBlindatura.test.tsx`: copre chiusura form +
    "Modifica → Annulla → Modifica" senza residui. Coerente con quanto verificato a mano nel codice.
- **FIX 8** (`BookingMenuCategoryCard.tsx` + `BookingMenuComposeGrid.tsx`): verificato che il sospetto
  del piano ("`horizontalScrollRef` passato ma forse non creato dal genitore") **non è un problema**:
  `BookingMenuComposeGrid.tsx` crea `scrollRef = useRef<HTMLDivElement>(null)`, lo assegna realmente al
  `div` con `overflow-x-auto` (il contenitore scrollabile vero) e lo passa giù come `horizontalScrollRef`
  — wiring reale, non solo prop-drilling vuoto.
  - Letto il nuovo test `bookingModeCardsAndCategoryCard.prenotaM0.adminBlindatura.test.tsx`: copre
    scroll su desktop, nessuno scroll su mobile (`layout='grid'`), e il controtest "rompi" click rapidi
    multipli (scrollIntoView chiamato una sola volta, perché il bottone chiuso si smonta appena
    `expanded` diventa `true` — confermato leggendo il render condizionale).
- **FIX 5**: confermato Famiglia F2 — solo QA responsive richiesta, nessun controtest "rompi" dovuto.

### Fase D — QA responsive REALE (non solo ragionamento)
L'esecutore aveva dichiarato di non avere un browser disponibile e di aver verificato "per
ragionamento sulle classi Tailwind". Io **ho potuto eseguire QA reale**:
- Scritto uno script Playwright ad-hoc (poi rimosso, non è rimasto nel repo) che naviga
  `/prenota/<slug>` a 375/700/900/1256px, controlla assenza di errori console e fa screenshot.
- **Risultato:** nessun errore console, nessun overflow visivo, descrizione card nascosta sotto 700px
  come da regola voluta (`min-[700px]:block`), proporzioni invariate. Il gap noto `lg`-vs-`sm`
  (PRENOTA_LAYOUT_CONTEXT §5) è migliorato: ora 2px di salto (17→19) invece di peggiorare.
- **FIX 8 in browser reale: gap di fixture, non di codice.** Nessun tenant staging oggi (`test-classic`,
  `test-pro`, `da-tommaso`) ha un carosello categorie configurato con overflow orizzontale sufficiente
  per uno screenshot dal vivo dello scroll-centratura. Coperto solo a livello componente (Vitest) +
  lettura del wiring reale del ref. Non bloccante per il cancello (la logica è testata e il wiring è
  verificato), ma resta una lacuna se Matteo vuole vederlo "con i suoi occhi" in staging.

### E2E su staging TEST — la parte più interessante
Il comando del gate (`npx playwright test e2e/public-booking.spec.ts e2e/public-booking-smoke.spec.ts
e2e/admin-menu-magazzino-blindatura.spec.ts --workers=1`) ha dato **6 failed / 13 passed** alla prima
esecuzione. Prima di considerarlo un sintomo di rottura ho isolato la causa:
1. `git stash` dei 3 file di Area A, stesso test rieseguito → **fallisce identico** anche su codice
   pre-fix. Conferma: **non è una regressione introdotta da FIX 1/5/8.**
2. Causa reale: `.env.local.test` locale (gitignored, non in repo) referenzia slug ormai cancellati dal
   DB TEST (`trattoria-da-tommaso`, `test`) — drift già noto e tracciato (FU-052,
   `Report-allineamento-account-e2e-test-16-06-26.md`, sessione separata del 16-06 che ha già
   aggiornato i file di config **in repo**, ma `.env.local.test` è locale-personale e non viene toccato
   da quel lavoro).
3. Query diretta `organizations` su TEST (`docnnernvp`, confermato `get_project_url`): slug reali oggi
   sono `test-classic`, `test-pro`, `da-tommaso`.
4. Rieseguito con `E2E_TENANT_SLUG` corretto → **19/19 E2E verdi**:
   `public-booking.spec.ts` 5/5, `public-booking-smoke.spec.ts` 11/11 (quest'ultimo è già
   self-healing: prova in automatico `da-tommaso`/`test-classic`/`test-pro` se lo slug preferito non
   esiste — design robusto), `admin-menu-magazzino-blindatura.spec.ts` 3/3.

**Non ho modificato `.env.local.test`** (file locale-personale, fuori dal mandato di questa verifica) —
solo segnalato.

---

## 3. Tabella finding

| # | Finding | Fronte | Decisione | Motivazione |
|---|---------|--------|-----------|--------------|
| 1 | EDIT-branch `MenuPricesTab` non riusa `resetProductFormState()`, reset duplicato a mano | dati | **voluto/nit** | Funzionalmente equivalente al ramo ADD pre-esistente (stesso pattern, stesso omesso `ingredientEditMode`); nessuna regressione. Migliorabile in futuro (DRY) ma non vale un fix isolato ora. |
| 2 | Edit concorrente su due ingredienti scarta la bozza del primo senza avviso | utente | **voluto** (pre-esistente) | Confermato dall'esecutore e da me: struttura pre-esistente, non toccata da questo batch. |
| 3 | Più card categoria possono restare espanse insieme (no auto-collapse reciproco) | utente | **voluto** (pre-esistente) | Idem, non legato all'aggiunta dello scroll FIX 8. |
| 4 | E2E del gate falliscono con `.env.local.test` di default (slug stale) | infrastruttura | **follow-up locale** (non di prodotto) | Causa isolata e confermata con `git stash` A/B: identica prima e dopo il diff. File gitignored personale, fuori scope di questo fix. Da riallineare ai nuovi slug TEST (`test-classic`/`test-pro`/`da-tommaso`) quando si lancia il gate. |
| 5 | FIX 8 scroll-centratura non verificabile con screenshot reale su staging oggi | responsive | **follow-up** (gap fixture dati) | Nessun tenant TEST ha un carosello categorie con overflow orizzontale configurato. Coperto da Vitest + lettura wiring; non bloccante per il cancello. |

Nessun finding richiede un fix di prodotto.

---

## 4. Gate di chiusura (MANUALE_BLINDATURA §4)

- [x] Intervistata + mappata (piano Matteo, sessione 16-06-26).
- [x] Test di copertura sui flussi mappati, marcatore `@admin-blindatura`/`@prenota-blindatura`, verdi.
- [x] `npm run validate` verde — **rieseguito da me**, 745/745.
- [x] Controtest "rompi" eseguito (dovuto su FIX 1/8) — **eseguito attivamente da me**, non solo letto.
- [x] QA responsive 375/700/900/1256 — **eseguita da me con Playwright reale** (screenshot + bounding
      box), non solo per ragionamento.
- [x] Doc allineata: `PRENOTA_TEST_SUITE_INDEX.md`, `ADMIN_TEST_SUITE_INDEX.md` (già fatto
      dall'esecutore, verificato corretto), riga Area A della Tracciabilità nel plan aggiornata da me.
- [x] Report sessione con tabella esiti + decisioni (questo file).

**Verdetto: Area A — BLINDATA SÌ.**

---

## 5. Cosa resta a Matteo

- Conferma visiva personale della checklist manuale (righe Area A nel plan) — non sostituisce, ma
  conferma quanto già verificato in automatico qui.
- Se vuole vedere FIX 8 scrollare dal vivo in staging: serve un tenant con ≥4-5 categorie menù in
  carosello orizzontale configurate (oggi nessuno dei 3 tenant TEST le ha).
- `.env.local.test` locale da riallineare ai nuovi slug quando rilancia i gate E2E a mano (non urgente,
  non blocca nulla: i comandi funzionano passando `E2E_TENANT_SLUG` a mano).

---

## 6. Nessuna modifica di prodotto

Come da mandato, non ho implementato nessun fix di prodotto non concordato con Matteo: solo test letti/
eseguiti (nessun test nuovo scritto — quelli dell'esecutore erano già sufficienti e corretti), QA
eseguita, doc aggiornata (Tracciabilità del plan), e questo report.

---

## 7. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Un solo prompt sostanziale, il blocco "Rev-A" copiato dal plan: profilo Verifica, edition
Classic, riferimento al piano `analizza-questo-prompt-che-streamed-kettle.md` (sezioni "Area A",
"Tracciabilità staffetta", "Checklist verifica Matteo"), skill da caricare (MANUALE_BLINDATURA §2-4,
ADMIN_SKILL FIX1, PRENOTA_SKILL+PRENOTA_LAYOUT_CONTEXT FIX5/8), mandato "non ti fidi del verde
dichiarato, riesegui i gate e prova ATTIVAMENTE a rompere i 3 fix", dettaglio per-fix (FIX1 fronti
dati/utente/confronto ADD; FIX5 solo QA responsive; FIX8 fronti click/mobile/overlay/wiring ref), gate
di chiusura (validate + E2E specifici + QA 375/900/1256), output richiesto (tabella finding, verdetto,
aggiornamento doc se SÌ, no commit). Nessun secondo giro di prompt: ho lavorato in autonomia fino al
verdetto.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca
cosa hai ri-verificato aprendo i file.
✅ R2: Riaperto ora `git diff -- src/features/booking/components/MenuPricesTab.tsx
src/features/booking/components/publicBooking/BookingMenuCategoryCard.tsx
src/features/booking/components/publicBooking/BookingModeCards.tsx`: confermo che sono esattamente i 3
hunk descritti nel report (EDIT-branch `handleSave` reset inline senza `is_available`/
`ingredientEditMode`; `handleExpand` con `scrollIntoView({behavior:'smooth', block:'nearest',
inline:'center'})` condizionato a `layout==='scroll' && horizontalScrollRef?.current`; classi testo
`text-[16px] … sm:text-[19px] lg:text-[17px] xl:text-[19px]` + descrizione `text-sm`). Rilanciato
`git status --short` ora: working tree torna a contenere solo i file attesi (i 3 `src/` modificati, i 2
nuovi test, i 2 indici doc, questo report + quello dell'esecutore) — nessuna modifica residua dai miei
script ad-hoc di QA (rimossi). Il numero 745/745 di `npm run validate` è quello dell'ultimo run reale
in questa sessione (non copiato dal report dell'esecutore), e i conteggi E2E (19/19 con slug corretto,
6 failed/13 passed con slug stale) sono gli output letterali dei comandi Playwright eseguiti.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test,
tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Riaperti ora `docs/Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md` e
`docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md`: entrambi contengono già la riga sui nuovi file
di test di Area A (FIX1 in ADMIN_TEST_SUITE_INDEX §4, FIX5/8 in PRENOTA_TEST_SUITE_INDEX fronte
`flusso-utente`) — corretti, non li ho dovuti toccare. Riaperto anche
`docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` §5 punto 1: nel frattempo (sessione parallela,
non mia) è stata aggiunta la nota sulle nuove classi titolo/descrizione FIX 5 — verificato corretta e
coerente col codice reale, non l'ho duplicata. `docs/STATO_BLINDATURA_CHECKLIST.md` non l'ho toccato:
le sue righe Prenota/Admin restano valide a livello di area (✅ blindato M0/M3), e questo batch 9-fix è
un ciclo post-merge tracciato solo nel plan locale (coerente con quanto già annotato dall'esecutore).
Ho invece aggiornato io la riga "Area A" della Tracciabilità nel plan
(`C:\Users\matte.MIO\.claude\plans\analizza-questo-prompt-che-streamed-kettle.md`) con l'esito Rev-A.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto
ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho potuto fare uno screenshot reale del comportamento FIX 8 (scroll-centratura del
carosello) in staging: nessuno dei 3 tenant TEST disponibili (`test-classic`, `test-pro`, `da-tommaso`)
ha oggi un carosello categorie menù con overflow orizzontale configurato — l'ho segnalato come
follow-up #5 in tabella, non l'ho nascosto né dichiarato fatto. Non ho corretto `.env.local.test`
locale (file gitignored, fuori mandato di una sessione di verifica) — solo segnalato come follow-up #4.
Non ho aggiunto nessun test nuovo: quelli scritti dall'esecutore erano già corretti e sufficienti per i
4 fronti richiesti, riscriverli sarebbe stato lavoro duplicato non richiesto dal mandato.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo
miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più
probabile.)
✅ R5: Attrito reale: il comando del gate (`git diff --name-only main..env/test -- src/`) suggerito nel
prompt è ingannevole quando l'area in verifica non è ancora committata (mostra lo storico già su
`env/test`, non il lavoro da revisionare) — ho dovuto capire da solo di guardare invece `git status
--short` + `git diff` working-tree. Miglioria: il prompt-template Rev-* potrebbe specificare
esplicitamente «se l'area non è committata, classifica il diff sul working tree, non su
`main..env/test`» per evitare che un revisore futuro si fidi del comando sbagliato e dichiari un'area
vuota o un'area enorme non sua per errore.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E
gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto. MANUALE_BLINDATURA + ADMIN_SKILL + PRENOTA_SKILL (letti interi come richiesto) sono stati
sufficienti per classificare la famiglia "rompi" e sapere dove cercare i context di dettaglio
(PRENOTA_LAYOUT_CONTEXT per il gap `lg:text-sm`); non ho dovuto apri altri file skill. L'hook di
chiusura su questa sezione 11 è stato utile: mi ha fermato prima di consegnare un report di verifica
senza la parte "dati per il sistema" — coerente col principio che la sezione la chiede apposta perché
altrimenti si salta.
