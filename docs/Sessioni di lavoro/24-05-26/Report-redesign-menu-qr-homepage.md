# Report — Redesign Homepage Menu QR Pubblico

**Sessione**: 24-05-26  
**Branch**: Sviluppo-Dashboard-laterale  
**Commit principale**: `c56ae58`

---

## Cosa è stato fatto

### 1. Migrazione DB 032 — `menu_homepage_config`

Nuova tabella nel DB di test (`docnnernvp`) per salvare la configurazione visiva della homepage del menu pubblico:
- `carousel_items` (jsonb): array di foto per il carosello "Specialità della casa", ognuna con URL, didascalia opzionale e ordinamento
- `category_images` (jsonb): mappa `{categoryKey → image_url}` per le foto delle card categoria
- Un solo record per tenant (vincolo UNIQUE su `tenant_id`)
- RLS: admin CRUD sul proprio tenant; anon SELECT pubblica

File: `supabase/migrations/032_menu_homepage_config.sql`

### 2. Tipi TypeScript

Aggiunti `CarouselItem`, `MenuHomepageConfig`, `MenuHomepageConfigInput` in `src/types/menu.ts`.  
Aggiornato `src/types/database.ts` con la nuova tabella `menu_homepage_config`.

### 3. Hook `useMenuHomepageConfig`

Nuovo file `src/features/booking/hooks/useMenuHomepageConfig.ts` con:
- `usePublicMenuHomepageConfig(tenantId)` — letto via `supabasePublic` (pagina pubblica)
- `useMenuHomepageConfig()` — letto via `supabase` autenticato (admin)
- `useUpsertMenuHomepageConfig()` — salva/aggiorna la config del tenant

### 4. Pannello admin "Aspetto homepage" — `MenuHomepageConfigPanel`

Nuovo componente `src/features/booking/components/MenuHomepageConfigPanel.tsx` con:
- **Sezione Carosello**: aggiunta/rimozione/riordino foto (frecce su/giù), campo didascalia opzionale per ogni slide, compressione canvas prima dell'upload (riusa la stessa logica di `menuPhotoUpload.ts`)
- **Sezione Foto categorie**: una riga per ogni categoria del menu → carica/cambia/rimuovi la foto che apparirà nella card homepage
- Salvataggio tramite upsert — il pulsante si attiva solo quando ci sono modifiche non salvate

Integrato in `MenuQrManager` con un tab switcher "I miei QR / Aspetto homepage".

### 5. Homepage menu pubblico — `PublicMenuPage`

Riscritta `src/pages/PublicMenuPage.tsx` con nuovo layout:

**Struttura visiva:**
```
[Header sticky: logo app + nome ristorante — sfondo stone-800]
[Carosello "Specialità della casa"] ← visibile solo se l'admin ha caricato foto
[Pill orizzontali per ogni categoria — scrollabili]
[Grid/lista categorie con card]
```

- **Carosello**: scroll snap CSS, pallini indicatori, drag nativo su mobile
- **Pill categoria**: scorribili orizzontalmente, cliccando filtrano la vista (nascondono le altre categorie)
- **Card categoria**: se la categoria ha una foto → card 2-col con immagine; se no → card testuale con emoji
- **Tema**: stone-50 body, stone-800 header, stone-700 accenti (rimpiazza amber)

### 6. Pagina dettaglio categoria — `PublicMenuCategoryPage`

- Tema stone-800 nell'header (coerente con homepage)
- Back button bianco su sfondo semi-trasparente
- Prezzi `text-stone-700`
- **Ordinamento**: piatti con foto mostrati prima di quelli senza

### 7. Header pubblico — `PublicMenuPageHeader`

Aggiornato da `bg-amber-400` a `bg-stone-800` con testo bianco.

---

## File toccati

| File | Azione |
|------|--------|
| `supabase/migrations/032_menu_homepage_config.sql` | NUOVO |
| `src/types/database.ts` | Aggiunto `menu_homepage_config` |
| `src/types/menu.ts` | Aggiunti `CarouselItem`, `MenuHomepageConfig`, `MenuHomepageConfigInput` |
| `src/features/booking/hooks/useMenuHomepageConfig.ts` | NUOVO |
| `src/features/booking/components/MenuHomepageConfigPanel.tsx` | NUOVO |
| `src/features/booking/components/MenuQrManager.tsx` | Tab switcher + import `MenuHomepageConfigPanel` |
| `src/pages/PublicMenuPage.tsx` | Riscritto — nuovo layout completo |
| `src/pages/PublicMenuCategoryPage.tsx` | Tema stone + ordinamento foto |
| `src/features/booking/components/PublicMenuPageHeader.tsx` | Tema stone-800 |

---

## Test

`npm run validate` — **137/137 test passati**, lint e typecheck puliti.

---

## Piano fix per la prossima sessione (già preparato)

Dopo test visivo sono stati identificati 5 fix da fare nella sessione successiva:

1. **Carosello non scorre su desktop** — serve drag-to-scroll con mouse events
2. **Pill senza icone** — installare `@phosphor-icons/react` e mappare icone per key categoria
3. **Pill navigano invece di filtrare** ← da ridiscutere: l'utente vuole che i pill portino direttamente alla pagina della categoria (come i link) non che filtrino. Il comportamento attuale di filtro va invertito in navigazione
4. **Hero section** — wrapper sfondo bianco (placeholder) con logo + nome sopra al carosello
5. **Card categoria split 50/50** — metà sinistra immagine, metà destra titolo + description; richiede anche migrazione 033 per aggiungere colonna `description` a `menu_categories`

Il piano dettagliato è salvato in `.claude/plans/`.
