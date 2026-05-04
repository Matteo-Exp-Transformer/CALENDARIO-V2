# Prompt per agente — Piano: UI admin per **menu / ingredienti** (CRUD su `menu_items` e coerenza tenant)

## Contesto

Oggi il listino e le voci usate dal form “Rinfresco di Laurea” possono essere curate **solo da Supabase** (tabella `public.menu_items`, eventuali dati collegati). La checklist S2.10 (crea / modifica / elimina voce) non è eseguibile dall’interfaccia.

Serve un **pannello admin** che permetta al titolare di gestire il proprio menù (prezzi, nomi, categorie se previste) **solo per il proprio tenant**, in linea con RLS.

## Obiettivo

1. Mappare lo schema attuale: colonne `menu_items`, relazioni, come `BookingRequestForm` / `useMenuItems` leggono i dati.
2. Progettare una UI nel tab esistente **Menu / prezzi** (o route dedicata) con: elenco, creazione, modifica prezzo/nome, eliminazione soft o hard secondo schema.
3. Garantire che le policy `admin_manage_menu_items` (o equivalenti in migrazione `002`) coprano insert/update/delete **solo** per `tenant_id` dell’admin.
4. Prevedere validazione (prezzo ≥ 0, nome non vuoto, slug univoco per tenant se applicabile).

## Vincoli

- Nessuna chiave service nel frontend.
- Riutilizzare componenti UI del progetto (tabella, modali, toast).
- Dopo il piano, implementazione in PR piccole: prima lista + edit, poi create, poi delete.

## Output atteso dal piano

1. File e hook toccati (`useMenuItems`, componenti tab menu).
2. Flusso dati: React Query keys, invalidazione dopo mutazione.
3. Checklist di test manuali allineata a S2.10.
4. Note su ingredienti: se gli “ingredienti” sono solo voci `menu_items` categorizzate, chiarire naming in UI per non confondere l’operatore.

Esplora il repo con grep `menu_items` e `MenuPricesTab`, poi restituisci il piano strutturato.
