# Report debug - Sfondo pagina Prenota: striscia laterale e pagina intera

**Data report:** 28-05-26  
**Obiettivo:** documentare il vecchio stato funzionante della pagina Prenota con striscia laterale, il conflitto tra le due feature, il fix applicato e le fonti verificate.  
**Regola usata:** non inventare stati non dimostrati. Ogni dettaglio sotto deriva da codice corrente, report locali, commit Git o asset presenti nel workspace.

---

## Risultato funzionale atteso

Nella sezione admin **Sfondo pagina Prenota** l'utente deve prima scegliere la tipologia di pagina:

1. **Striscia laterale**
   - La pagina Prenota usa la foto verticale sulla sinistra.
   - Le foto disponibili sono quelle della striscia, in `public/asset/strip/`.
   - Il setting che decide la presenza della striscia e la foto iniziale e `public_booking_strip_photo`.
   - La pagina pubblica mostra la div laterale solo quando `public_booking_strip_photo` non e `null`.

2. **Pagina intera**
   - La pagina Prenota non mostra la div laterale.
   - Lo sfondo occupa tutta la pagina.
   - Le foto disponibili sono quelle in `public/asset/sfondo intero/`.
   - Il setting usato e `public_booking_page_background`, con ID `full-01` ... `full-06`.
   - Il setting `public_booking_strip_photo` viene salvato a `null`, perche in questa modalita la striscia non deve esistere.

Questo separa le due feature che si erano accavallate: foto verticali per la striscia laterale e foto wide/full per lo sfondo a pagina intera.

---

## Vecchio stato verificato: pagina Prenota con striscia laterale

Fonti principali:

- `docs/Sessioni di lavoro/27-05-26/mini report agente lavoro svolto.md`
- `docs/Sessioni di lavoro/27-05-26/Report-footer-striscia-foto-layout-27-05-26.md`
- commit `f85fc08` - `feat(prenota): BookingPhotoStrip con parallax - pronta per foto reali`
- commit `c2453ab` - `feat(prenota): foto striscia da DB + pannello admin selezione foto`
- commit `8e234d3` - `fix(prenota): striscia foto sx 20vw su mobile, 25vw da 900px`
- commit `9cae868` - `fix(prenota): footer a larghezza piena + striscia foto copre form lunghi`

La vecchia pagina finita con striscia laterale funzionante aveva queste caratteristiche verificate:

- `BookingRequestPage` importava e renderizzava `BookingPhotoStrip`.
- La pagina leggeva `public_booking_strip_photo` tramite `useRestaurantSetting`.
- La griglia esterna era a due colonne: `grid-cols-[20vw_1fr] min-[900px]:grid-cols-[25vw_1fr]`.
- La striscia era nella prima colonna della griglia, non dentro la colonna del form.
- La griglia non doveva avere `mx-auto` o `max-w-*`, perche avrebbe staccato la foto dal bordo sinistro su desktop.
- `BookingPhotoStrip` era `sticky top-0 h-screen overflow-hidden`.
- Ogni immagine della striscia era `object-cover`, larga tutta la colonna, alta circa `120vh`.
- Le 6 foto venivano ripetute 3 volte: 18 immagini totali, per evitare buchi grigi su form lunghi.
- La foto selezionata dall'admin veniva messa per prima, poi seguivano le altre.
- Il parallax aveva velocita `PARALLAX_SPEED = 0.4`.
- Gli asset striscia erano in `public/asset/strip/` con nome `foto sfondo  Pagina prenota (N).png`.
- Gli ID striscia erano `strip-01` ... `strip-06`.
- Il default verificato era `strip-01`.
- Nel DB, `public_booking_strip_photo = null` significava: nessuna selezione esplicita; la striscia partiva dalla prima foto.

Il report del 28-05 gia presente conferma anche la struttura desiderata del footer:

- footer Orari/Contatti fuori dalla griglia principale;
- footer a larghezza piena, non limitato da `max-w-7xl`;
- footer sotto striscia e form, non solo sotto la colonna destra;
- pagina esterna come `min-h-screen flex flex-col`.

---

## Nota importante sul responsive storico

Qui c'e una differenza verificata tra fonti storiche:

- Il codice del commit `9cae868` mostrava la striscia anche sotto 900px con `grid-cols-[20vw_1fr]`.
- Alcune note di contesto successive in `APP_CONTEXT_SKILL.md` descrivevano invece la striscia nascosta sotto 900px (`hidden min-[900px]:block`).

Quindi non va scritto che "storicamente era sicuramente nascosta su mobile". Il dato verificato dal commit finale del fix striscia/footer e: due colonne anche sotto 900px. Il codice corrente, dopo il fix di separazione tipologie, usa invece la scelta piu recente gia presente nel workspace: la striscia laterale viene renderizzata solo da 900px in su (`hidden min-[900px]:block`) e la griglia passa a `min-[900px]:grid-cols-[25vw_1fr]` quando la modalita striscia e attiva.

Questo punto e importante per futuri ripristini: se serve tornare esattamente al commit `9cae868`, va ripristinata anche la colonna `20vw` sotto 900px. Se invece si mantiene il comportamento corrente del progetto, la striscia resta una feature desktop/tablet largo.

---

## Conflitto trovato

Le due feature si erano mescolate:

- la selezione dello sfondo pagina Prenota continuava a mostrare vecchie texture/gradienti;
- la modalita striscia laterale non riportava la pagina al layout con foto laterale;
- la modalita pagina intera non era separata in modo netto dalla presenza della striscia;
- le immagini full-page dovevano arrivare da `public/asset/sfondo intero/`, non dalla cartella strip e non dalle vecchie texture.

Il punto tecnico chiave e questo: la presenza della striscia non deve essere dedotta dal valore di `public_booking_page_background`. Deve essere dedotta da `public_booking_strip_photo`.

---

## Fix applicato

### Costanti e asset

File: `src/features/booking/constants/bookingPageBackground.ts`

- Mantenuti gli ID striscia `strip-01` ... `strip-06`.
- Mantenuto `DEFAULT_BOOKING_STRIP_PHOTO = 'strip-01'`.
- Mantenuto `bookingStripPhotoPublicHref`, che punta a:

```text
public/asset/strip/foto sfondo  Pagina prenota (N).png
```

- Aggiunti gli ID pagina intera `full-01` ... `full-06`.
- Aggiunto `DEFAULT_BOOKING_FULL_PAGE_BACKGROUND = 'full-01'`.
- Aggiunto `bookingFullPageBackgroundPublicHref`, che punta a:

```text
public/asset/sfondo intero/sfondo intero pagina prenota (N).png
```

- `BookingPageBackgroundId` ora comprende anche gli ID `full-*`.
- Texture e gradienti vecchi restano supportati come fallback legacy, ma non sono piu la scelta principale nel pannello.

Asset verificati nel workspace:

```text
public/asset/sfondo intero/sfondo intero pagina prenota (1).png
public/asset/sfondo intero/sfondo intero pagina prenota (2).png
public/asset/sfondo intero/sfondo intero pagina prenota (3).png
public/asset/sfondo intero/sfondo intero pagina prenota (4).png
public/asset/sfondo intero/sfondo intero pagina prenota (5).png
public/asset/sfondo intero/sfondo intero pagina prenota (6).png
```

Nota Git: la cartella `public/asset/sfondo intero/` risulta non tracciata nello stato corrente. Se questo lavoro viene committato o deployato, va inclusa.

### Pagina pubblica Prenota

File: `src/pages/BookingRequestPage.tsx`

- La pagina legge sia `public_booking_page_background` sia `public_booking_strip_photo`.
- `showPhotoStrip = stripPhotoId != null`.
- Se `public_booking_page_background` e `full-*`, lo sfondo pagina usa:
  - `backgroundImage: url(...)`;
  - `backgroundSize: cover`;
  - `backgroundPosition: center`;
  - `backgroundRepeat: no-repeat`.
- Se il valore e ancora una vecchia texture o gradiente, il codice la gestisce come fallback legacy.
- La griglia pubblica ora e:
  - una colonna quando non c'e striscia;
  - `min-[900px]:grid-cols-[25vw_1fr]` quando `showPhotoStrip` e vero.
- `BookingPhotoStrip` viene renderizzato solo quando `showPhotoStrip` e vero.
- La classe corrente della striscia e `hidden min-[900px]:block`.
- Il footer resta fuori dalla griglia e a larghezza piena.

Questa e la parte che corregge il bug segnalato: scegliendo "Striscia laterale" la pagina torna ad avere la striscia; scegliendo "Pagina intera" la striscia sparisce.

### Pannello admin

File: `src/features/booking/components/RestaurantSettingsTab.tsx`

- La sezione **Sfondo pagina Prenota** ora ha due pulsanti:
  - `Striscia laterale`;
  - `Pagina intera`.
- Lo stato locale `bookingBgMode` decide quale griglia di immagini mostrare.
- In modalita `Striscia laterale`:
  - vengono mostrate solo le foto `BOOKING_STRIP_PHOTO_IDS`;
  - la preview usa aspect ratio verticale `aspect-[1/3]`;
  - scegliendo una foto si valorizza `public_booking_strip_photo`;
  - se non c'e una foto salvata, viene usato `strip-01`.
- In modalita `Pagina intera`:
  - vengono mostrate solo le foto `BOOKING_FULL_PAGE_BACKGROUND_IDS`;
  - la preview usa `aspect-[4/3]`;
  - scegliendo una foto si valorizza `public_booking_page_background`;
  - `public_booking_strip_photo` viene portato a `null`.
- Il salvataggio della sezione salva insieme:
  - `public_booking_page_background`;
  - `public_booking_strip_photo`.

---

## Skill e documentazione aggiornata

File aggiornati per allineare il comportamento al sistema skill:

- `docs/APP_CONTEXT_SKILL.md`
  - documentata la separazione tra striscia laterale e pagina intera;
  - documentato che `public_booking_strip_photo` decide la presenza della striscia;
  - documentato che le foto pagina intera arrivano da `public/asset/sfondo intero/`;
  - documentati i fallback legacy texture/gradienti.

- `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`
  - aggiornata la nota della sezione **Sfondo pagina Prenota** con i due pulsanti e le due famiglie di immagini.

---

## Verifiche eseguite dopo il fix

Comandi eseguiti:

```text
npm run typecheck
npm run lint
```

Esito:

- typecheck passato;
- lint passato.

Non e stato rieseguito `npm run test` completo in questa sessione di fix. Il report storico del 27-05 riportava 186/186 test passati per la versione con striscia/footer.

Dev server: era gia attivo su porta `5173`.

---

## Dettagli aggiuntivi utili per ripristini futuri

1. **Non usare `public_booking_page_background` per decidere la striscia.**  
   La striscia e governata da `public_booking_strip_photo`. Questo evita che uno sfondo full-page faccia comparire la colonna laterale.

2. **Non mischiare le cartelle asset.**  
   Striscia: `public/asset/strip/`.  
   Pagina intera: `public/asset/sfondo intero/`.

3. **Non rimettere texture/gradienti nel pannello principale.**  
   Sono ancora accettati dal parser come fallback legacy, ma il comportamento richiesto ora e scegliere tra foto striscia e foto full-page.

4. **Se si ripristina la vecchia striscia esatta da commit storico, controllare il mobile.**  
   Il commit `9cae868` aveva `20vw` sotto 900px. Il codice corrente la nasconde sotto 900px.

5. **Per configurazione DB manuale:**
   - striscia laterale: `public_booking_strip_photo = 'strip-01'` ... `'strip-06'`;
   - pagina intera: `public_booking_strip_photo = null` e `public_booking_page_background = 'full-01'` ... `'full-06'`.

6. **Default corrente:**
   - full-page: `full-01`;
   - striscia: quando si entra in modalita striscia senza selezione, viene impostato `strip-01`.

---

## File codice toccati dal fix

- `src/features/booking/constants/bookingPageBackground.ts`
- `src/pages/BookingRequestPage.tsx`
- `src/features/booking/components/RestaurantSettingsTab.tsx`
- `docs/APP_CONTEXT_SKILL.md`
- `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`

---

## Stato finale documentato

Il comportamento allineato alla richiesta e:

- la scelta **Striscia laterale** mostra solo foto verticali della striscia e salva una foto in `public_booking_strip_photo`;
- la pagina Prenota pubblica torna al layout con `BookingPhotoStrip` quando `public_booking_strip_photo` e valorizzato;
- la scelta **Pagina intera** mostra solo foto in `public/asset/sfondo intero/`, salva `full-*` in `public_booking_page_background` e cancella la striscia salvando `public_booking_strip_photo = null`;
- la pagina Prenota pubblica usa lo sfondo full-page senza div laterale quando `public_booking_strip_photo` e `null`.
