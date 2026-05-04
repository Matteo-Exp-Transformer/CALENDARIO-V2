# Piano: UI admin **Menu** (S2.10) — audit e linee guida implementative

**Stato:** documento di piano (nessun codice applicativo in questa fase).  
**Riferimento prompt:** [PROMPT_plan_UI_menu_ingredienti_admin.md](../../Knowledge%20Base/PROMPT_plan_UI_menu_ingredienti_admin.md)  
**Commit di partenza:** `803a634` — *docs: baseline prompt piano UI menu e impostazioni ristorante*

---

## 1. Audit sintetico (repo vs assunzioni del prompt)

| Area | Atteso (prompt) | Stato reale nel repo | Note / divergenze |
|------|-----------------|----------------------|-------------------|
| CRUD UI menu | `MenuPricesTab` con lista/create/edit/delete + validazione | **Confermato** in `src/features/booking/components/MenuPricesTab.tsx` | Validazione con `alert` righe 79–86; delete con `confirm` 97–100 |
| Hook dati | `useMenuItems`, mutazioni, `tenantId` da contesto | **Confermato** in `src/features/booking/hooks/useMenuItems.ts` | Toast su mutazioni; `invalidateQueries({ queryKey: ['menu-items'] })` su create/update/delete |
| Raggiungibilità da `AdminDashboard` | Tab solo `calendar \| pending \| archive` | **Confermato** in `src/pages/AdminDashboard.tsx` (tipo `Tab` riga 11, nav 121–123) | Nessuna tab `menu` |
| Raggiungibilità via `SettingsTab` | Modale “Prezzi Menu” | **Parzialmente fuorviante:** `SettingsTab.tsx` monta la modale con `MenuPricesTab`, ma **`SettingsTab` non è importato da alcun file sotto `src/`** (solo definizione nel proprio file) | Il CRUD menu è **irraggiungibile da qualsiasi route attuale**, non solo dalla dashboard |
| Schema DB `menu_items` | Enum PostgreSQL `MenuCategory` | **Divergenza:** in `001_schema_completo.sql` la colonna è `category TEXT NOT NULL` (nessun `CREATE TYPE` per menu) | I valori ammessi sono enforced lato **TypeScript** in `src/types/menu.ts` (`MenuCategory` union) |
| Tabella `ingredients` / `slug` | Assenti | **Confermato** nello schema `menu_items` citato | — |
| RLS admin su `menu_items` | Policy unica `admin_manage_menu_items FOR ALL` | **Confermato** in `002_rls_admin_users.sql` (righe 93–96); `tenant_manage_menu_items` droppata | `anon_select_menu_items` resta in `001_schema_completo.sql` (SELECT anon per form pubblico) — non toccata da 002 per anon |
| `useMenuItemsByCategory` | Usato nel codice | **Definito ma non referenziato** altrove in `src/` (solo nel prompt / questo file) | Cambio query key è a basso rischio regressioni |
| Form pubblico | `MenuSelection` + `useMenuItems` | **Confermato:** `MenuSelection.tsx` usa `useMenuItems()` | Coerenza post-mutazione admin = stessa query key `['menu-items', tenantId]` risolta via `TenantContext` sul dominio pubblico (slug) |

---

## 2. Posizionamento (decisione già chiusa → traduzione in modifiche)

- **Scelta:** tab **`menu` standalone** in `AdminDashboard`, etichetta **"Menu"**, nessun accorpamento sotto Settings.
- **Navigazione:** estendere `type Tab = ...` con `'menu'`; aggiungere `NavItem` (icona coerente con le altre, es. `UtensilsCrossed` come in `SettingsTab` per il bottone menu).
- **Contenuto:** render condizionale `{activeTab === 'menu' && <MenuPricesTab />}` (o wrapper sottile se servisse padding/titolo “Menu” — il prompt fissa titolo pagina “Menu”; oggi `MenuPricesTab` ha H2 “Gestione Prezzi Menu”: in implementazione allineare copy a **"Menu"** nel titolo principale e sottotitolo breve, senza rinominare il file/componente).
- **Deep link:** non in questa iterazione (`useState` come oggi).
- **Nota implementativa:** valutare se mantenere il bottone modale in `SettingsTab` per chi in futuro montasse di nuovo quel componente; non è richiesto dal piano e `SettingsTab` oggi è orfano — si può documentare come debito o lasciare invariato fino al task “impostazioni”.

---

## 3. Flusso dati (React Query)

| Query / azione | Query key attuale | Comportamento |
|----------------|-------------------|---------------|
| `useMenuItems` | `['menu-items', tenantId]` | Lista completa ordinata per `category`, `sort_order` |
| `useMenuItemsByCategory` | `['menu-items', 'by-category', category, tenantId]` | Filtro opzionale per `category` |
| Post-mutation (create/update/delete) | `invalidateQueries({ queryKey: ['menu-items'] })` | In TanStack Query, prefisso **`['menu-items']`** invalida **entrambe** le varianti di key sotto lo stesso prefisso → coerenza dati ok |

**Correzione difensiva (scope approvato):**  
`useMenuItemsByCategory` → `['menu-items', 'by-category', category, tenantId]`  
Motivo: chiarezza in DevTools e distinzione esplicita dalla lista “full”; nessun bug noto.

**Form pubblico:** stesso hook `useMenuItems` e stessa invalidazione; anon non esegue mutazioni — nessun cambiamento RLS richiesto per questa user story.

---

## 4. Checklist test manuali (S2.10)

Eseguire dopo implementazione (una PR, checklist in description), tenant noto.

1. **Admin — CRUD**
   - Aprire dashboard → tab **Menu**.
   - **Crea** voce (nome, categoria, prezzo ≥ 0) → toast successo (mutazione); lista aggiornata.
   - **Modifica** prezzo e nome → salva → lista coerente.
   - **Elimina** → `confirm` nativa → voce rimossa; toast successo.
   - **F5** sulla tab Menu → stato persistente coerente con DB.

2. **Pubblico — coerenza nomi/prezzi (solo `MenuSelection`)**
   - Stesso `tenant` (stesso slug usato dal form pubblico).
   - Aprire pagina prenotazione che monta `MenuSelection` (via `BookingRequestForm` se è il flusso reale).
   - Verificare che **nomi e prezzi** delle voci modificate coincidano con quanto visto in admin dopo **F5** sul form pubblico.
   - **Fuori scope:** ordine categorie, disponibilità, immagini.

3. **RLS (non bloccante)**
   - **Lettura policy:** `admin_manage_menu_items` in `002_rls_admin_users.sql` — `USING` / `WITH CHECK` su `tenant_id = current_admin_tenant_id()`.
   - **Due tenant:** lo script [setup_test_data.sql](./setup_test_data.sql) crea organizzazioni `al-ritrovo` e `tenant-b-qa` con admin `admin.a.rls@example.com` e `admin.b.rls@example.com` (utenti da creare in Auth come da commenti script). Se disponibili, test opzionale: login come admin A, verificare che non si vedano/modifichino righe `menu_items` del tenant B (e viceversa). Se non si dispone dei due utenti Auth, **documentare** in PR che la copertura è policy + smoke su un tenant.

---

## 5. Naming e copy (implementazione)

- Nav + titolo pagina: **"Menu"**.
- Nessuna entità “ingredienti” nello schema; nessun tooltip esplicativo (KISS).
- Allineare titolo interno attuale “Gestione Prezzi Menu” / modale “Prezzi Menu” in `SettingsTab` solo se quel file viene toccato nello stesso PR; priorità: vista **AdminDashboard → Menu**.

---

## 6. Rifiniture in scope (implementazione, una PR)

| Voce | Azione |
|------|--------|
| Validazione in `MenuPricesTab` | Sostituire `alert(...)` con `toast.error` (pattern già usato in `useMenuItems.ts`) |
| Delete | Mantenere `confirm` nativo |
| `useMenuItemsByCategory` | Nuova query key `['menu-items', 'by-category', category, tenantId]` |
| Service role | Nessuna chiave service nel frontend (invariato) |

---

## 7. File toccati previsti (implementazione — checklist sviluppatore)

- `src/pages/AdminDashboard.tsx` — tipo tab, nav, contenuto `menu`.
- `src/features/booking/components/MenuPricesTab.tsx` — toast al posto degli `alert`; titoli/copy verso “Menu” se necessario.
- `src/features/booking/hooks/useMenuItems.ts` — queryKey in `useMenuItemsByCategory`; messaggio dedicato per `23505` (UNIQUE) in create/update.

Nessuna migration DB attesa per questa user story.

---

## 8. Rischi e debiti

| Rischio | Mitigazione |
|---------|-------------|
| `SettingsTab` orfano | Accettato per ora; ripresa con task “impostazioni ristorante / sistema” |
| Copy misti “Prezzi” / “Menu” | Allineare nella stessa PR nella vista principale admin |
| `useMenuItemsByCategory` non usato | Cambio key a rischio zero funzionale se nessun consumer |
| **Basso — UNIQUE `(tenant_id, name, category)`** (`001_schema_completo.sql:139`): create/update con coppia duplicata → Postgres `23505`; senza gestione l’utente vede solo il toast generico da `handleSupabaseError` | In `useCreateMenuItem` / `useUpdateMenuItem`, se `error.code === '23505'`, mostrare messaggio leggibile: *«Esiste già un prodotto con lo stesso nome in questa categoria»* |

---

*Piano approvato; implementazione nella PR applicativa associata.*
