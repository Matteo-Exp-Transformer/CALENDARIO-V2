# Report — Personalizza form: editor carosello, help Card/Carosello

**Data:** 26-05-26  
**Area:** Admin → Impostazioni locale → Personalizza form → Modalità di prenotazione

## Obiettivo

Semplificare l’editor admin delle sottotab **Carosello** sulla Pagina Prenota, aggiungere un pannello help collassabile sotto «Abilita Card o Carosello», e allineare upload foto senza duplicare l’UI del Menu QR.

## Cosa vede il ristoratore

| Schermata / azione | Effetto |
|--------------------|---------|
| Modalità espansa → toggle «Abilita Card o Carosello» | Sotto al toggle compare sempre **? Dettagli** (chiuso di default): spiega differenza tra **Card scorrevole** e Carosello |
| Toggle on → aggiungi sottotab | Due pulsanti affiancati **+ Card scorrevole** / **+ Carosello** sopra l’editor; altezza che cresce con lo schermo; sfondo azzurro chiaro fisso |
| Clic su **? Dettagli** | Il pulsante si espande nello stesso riquadro e mostra l’elenco; chiuso mostra solo **?** + «Dettagli» |
| Toggle **off** | Restano visibili toggle + help; spariscono bottoni `+ Card` / `+ Carosello` e gli editor sottotab |
| Toggle **off** (da on) | Si chiudono bozze/editor sottotab aperti |
| Editor **Carosello** | Campi: etichetta card, titolo slide, Aggiungi foto + anteprima, icona, prezzo, descrizione breve — **senza** sezione «Categorie e ingredienti visibili» e **senza** import menù preselezionato |
| Editor **Card** con `preset_id` | Resta la sezione categorie/ingredienti nascibili (solo `display === 'cards'`) |

## Modifiche tecniche

### `BookingFormConfigPanel.tsx`

- `SubTabsDisplayHelpPanel`: pulsante unico collassabile (`aria-expanded`), sempre sotto il toggle; bottoni aggiunta sottotab solo se `sub_tabs_enabled`.
- Rimosso dropdown import preset staff e logica `importPresetIntoSubTab` / `importPresetIntoDraftSubTab`.
- Editor carosello: `CarouselAddPhotoBlock` + titolo slide su `carousel_items[0].title`; `pendingSlideTitleByTabRef` se il titolo è digitato prima della prima foto.
- «Categorie e ingredienti visibili» solo se `display === 'cards'` && `preset_id`.
- `AdminFieldWithCharCount` con contatore `n/max` su campi testo sottotab.
- `getSubTabEditorTitle`: titoli «Carosello N» / «Card N» / «Nuova Card N».

### `MenuHomepageConfigPanel.tsx`

- Estratto hook `useCarouselPhotoUpload` condiviso.
- Nuovo export `CarouselAddPhotoBlock` (pulsante + griglia anteprime) per Personalizza form Prenota.
- `MenuQrCarouselSection` invariato per Menu QR / homepage (toolbar opzionale `hideToolbarLabel`).

### Documentazione skill

- `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` — editor carosello, help panel, regole visibilità categorie.
- `docs/APP_CONTEXT_SKILL.md` — RULE Personalizza form aggiornata.
- `docs/SESSION_LOG.md` — voce sessione.
- `.cursor/skills/calendarbackup-app-context/SKILL.md` — puntatore report.

## Storage (Supabase)

| Dato | Chiave `restaurant_settings` | Campo JSON |
|------|------------------------------|------------|
| Config form Prenota | `booking_public_form_config` | `booking_modes[].sub_tabs[]` — `display`, `label`, `carousel_items`, `hidden_*` (solo card preset) |
| Foto carosello Prenota | bucket `menu-photos` | path `…/carousel/{uuid}.webp` (segmento draft `booking-form-{modeId}-{tabId}`) |

Nessuna migrazione DB.

### `BookingFormConfigPanel.tsx` (seguito)

- Rename UI **Card scorrevole** (ex «Card a scorrimento») in help, label default e pulsante aggiunta.
- `SubTabAddButtons`: griglia 2 colonne responsive, sopra editor sottotab; `bg-primary-50` / hover `bg-primary-100`; altezza `md` allineata al toggle.

## Verifica

- `npm run typecheck` — da eseguire pre-merge se non già fatto in sessione.
