# Prompt per agente — Piano: UI admin per **menu** (integrazione + rifiniture su CRUD già esistente)

## Contesto

⚠️ **Premessa importante: il CRUD UI esiste già.** Verificare prima di pianificare:

- [MenuPricesTab.tsx](src/features/booking/components/MenuPricesTab.tsx) implementa lista + create + edit + delete con conferma, validazione (prezzo ≥ 0, nome non vuoto) e categorie predefinite.
- [useMenuItems.ts](src/features/booking/hooks/useMenuItems.ts) espone `useMenuItems`, `useMenuItemsByCategory`, `useCreateMenuItem`, `useUpdateMenuItem`, `useDeleteMenuItem`, tutte filtrate per `tenantId` da [TenantContext](src/contexts/TenantContext.tsx) e con invalidazione di `['menu-items']`.
- Lo schema in [001_schema_completo.sql](supabase/migrations/001_schema_completo.sql) usa l'enum `MenuCategory` = `bevande | pizza | antipasti | fritti | primi | secondi | dolci`. **Non esiste tabella `ingredients`** né colonna `slug`.
- Le policy in [002_rls_admin_users.sql](supabase/migrations/002_rls_admin_users.sql) sono coperte da **una sola** `admin_manage_menu_items FOR ALL` su `tenant_id = current_admin_tenant_id()`. Insert/update/delete sono già coperti.

Il **vero gap** rispetto a S2.10:

1. `MenuPricesTab` è raggiungibile solo come **modale** dentro [SettingsTab.tsx](src/features/booking/components/SettingsTab.tsx) (bottone "🍽️ Prezzi Menu").
2. [AdminDashboard.tsx](src/pages/AdminDashboard.tsx) non monta `SettingsTab` (tab attive: `calendar | pending | archive`). **Quindi da UI il CRUD menu è di fatto irraggiungibile.**

## Output del task

⚠️ **Questo è un prompt di PIANO, non di implementazione.** L'agente consegna **solo il documento di piano** (audit + decisione + flusso dati + checklist test). L'implementazione è un task successivo, dopo approvazione.

## Obiettivo del piano

1. **Mappare** lo stato reale: confermare quanto sopra (file, hook, policy, schema) e segnalare ogni divergenza prima di proporre cambi.
2. **Integrazione**: rendere `MenuPricesTab` raggiungibile dall'`AdminDashboard` come **tab `menu` standalone** (decisione presa: gestione menu è operatività quotidiana, non configurazione → niente raggruppamento sotto Settings).
   - Etichetta nav e titolo pagina: **"Menu"** (non "Voci di menu", non "Prezzi menu", non "Prodotti").
   - Nome del componente interno: resta `MenuPricesTab` (non rinominarlo, evita rumore in git history).
   - Navigazione: **solo stato React** (`useState<Tab>`) come le tab esistenti. Niente deep-link / hash / query: fuori scope, da trattare come task separato per tutte le tab insieme.
3. **Rifiniture mirate** in scope:
   - Sostituire `alert(...)` di validazione (`MenuPricesTab` linee ~80–86) con toast (`react-toastify` è già dipendenza usata negli hook).
   - **Lasciare la `confirm()` nativa per il delete**: no modale custom in questa iterazione.
   - `useMenuItemsByCategory` cambia query key in `['menu-items', 'by-category', category, tenantId]` per disambiguare da `['menu-items', tenantId]`. Correzione difensiva, non ci sono bug riportati.
   - Confermare che gli hook continuino a funzionare con utente authenticated admin (RLS) e che il form pubblico (anon) non sia toccato.
4. **Naming**: il prompt originale parlava di "ingredienti". Nello schema **non esistono**: in UI usare **"Menu"** (nav + titolo), non "ingredienti". **Solo rinaming, niente tooltip/help** (KISS).

## Vincoli

- Nessuna chiave service nel frontend.
- Riutilizzare componenti UI del progetto (Button, Input, toast `react-toastify` già usato negli hook).
- **Una sola PR** (nella fase di **implementazione** dopo approvazione del piano) con checklist in description: nav+montaggio + rifiniture sopra elencate + test manuali documentati. Non spaccare in tre PR: scope troppo piccolo.
- Non riscrivere `MenuPricesTab` se non strettamente necessario.

## Output atteso dal piano

1. **Audit** dei file/hook elencati sopra: cosa è effettivamente implementato vs cosa risulta mancante. Tabella sintetica.
2. **Conferma posizionamento**: tab `menu` standalone in `AdminDashboard`, etichetta "Menu", solo stato React (no deep-link). Nessuna alternativa da soppesare — la decisione è presa, il piano la traduce in modifiche concrete a `AdminDashboard`.
3. **Flusso dati**: query keys attuali (`['menu-items', tenantId]`, `['menu-items', category, tenantId]`), conferma invalidazioni post-mutation, correzione difensiva di `useMenuItemsByCategory` a `['menu-items', 'by-category', category, tenantId]`.
4. **Checklist test manuali S2.10**:
   - Crea voce → modifica prezzo → elimina → F5 → la lista admin riflette lo stato finale.
   - Coerenza nel form pubblico: verificare in [MenuSelection.tsx](src/features/booking/components/MenuSelection.tsx) **solo lista, nomi e prezzi** dopo F5 (ordine categorie, disponibilità, immagini: fuori scope; immagini non esistono nello schema). `BookingRequestForm` solo se è il contesto di navigazione al form, senza espandere lo scope oltre nomi/prezzi in `MenuSelection`.
   - **Test RLS tenant-diverso non bloccante**: se in [setup_test_data.sql](Lavoro/Sessioni di lavoro/04-05-26/setup_test_data.sql) ci sono già due tenant con admin separati, eseguire la verifica; altrimenti documentare nell'audit la sola lettura della policy `admin_manage_menu_items` come copertura.
5. **Note naming**: confermare l'assenza di "ingredienti" come entità separata e fissare la terminologia UI: **"Menu"** per nav e titolo pagina; nessun tooltip esplicativo.

## Decisioni chiuse (non riaprire nel piano)

| Area | Scelta |
|------|--------|
| Posizionamento | Tab `menu` standalone in `AdminDashboard`; niente sotto Settings |
| Deep link | No (solo `useState` come oggi); task separato per tutte le tab |
| Etichetta UI | **"Menu"** ovunque (nav + titolo); componente resta `MenuPricesTab` |
| PR | Una sola PR + checklist in description |
| Rifiniture | Toast per errori di validazione (`alert` → pattern esistente); `confirm` delete nativa |
| Query keys | `useMenuItemsByCategory` → `['menu-items', 'by-category', category, tenantId]` |
| Test RLS cross-tenant | Non bloccante: policy + 1 tenant reale; due tenant solo se già in `setup_test_data.sql` |
| Form pubblico (test) | Solo nomi/prezzi in `MenuSelection` dopo F5 |
| Deliverable fase | Solo documento piano; implementazione dopo approvazione |

Esplora il repo con grep `menu_items`, `MenuPricesTab`, `useMenuItems`, e leggi [AdminDashboard.tsx](src/pages/AdminDashboard.tsx) per capire dove agganciare la tab. Poi restituisci il piano strutturato. **Non scrivere codice in questa fase.**
