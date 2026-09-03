# MENU QR — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per l'area **Menu Digitale Pubblico via QR**
> (`/menu/:slug/qr/:shortCode`): trigger, cosa caricare subito, divieti frequenti, mappa file, LOCK
> (solo link). **Non duplica** i LOCK: per il testo pieno apri `MENU_QR_SKILL.md` e i file di
> `contesto/`. Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«Menu QR» · «Impostazione Menù QR» · «/menu/:slug/qr/:shortCode» · «PublicMenuPage» · «MenuQrModal» ·
«carosello specialità QR» · «categorie visibili QR» · «ingredienti nascosti QR» · «tema homepage
menu» · «feature qrMenu».

## 2. Carica subito
- **`MENU_QR_SKILL.md`** (skill d'area — leggila intera) — senso + flusso + divieti + mappa.
- **`contesto/MENU_QR_DATA_FLOW_CONTEXT.md`** — **OBBLIGATORIO** prima di toccare i dati
  (`category_filter`, `category_images`, `hidden_menu_item_ids`, rename/delete chiave categoria).

## 3. Divieti top-3
1. **Menu QR ≠ Pagina Prenota ≠ tab Menu (magazzino).** Il QR sceglie una **vista** del magazzino
   condiviso (`menu_categories`/`menu_items`); **non** scrive mai sul magazzino. Foto categoria QR
   (`category_images`, per-QR) ≠ foto Prenota (`menu_categories.image_url`).
2. **Non reintrodurre `content_type`/`preset_ids`/menù-evento nel QR** — RIMOSSO blindatura 06-06-26
   (migr. 043). Il caso «evento» si copre con carosello + nome QR (`MENU_QR_SKILL.md` §3-bis).
3. **Pagine `/menu/*` → solo `supabasePublic`** (Anna è anonima); `tenantReady` prima del lookup QR;
   nome QR è interno (mai mostrato al cliente); niente dato hardcoded (`MENU_QR_SKILL.md` §3).

## 4. Mappa file
| Se il task tocca… | Apri (intero) |
|---|---|
| Layout pubblico (homepage/categoria), griglia categorie, carosello, pill categoria in basso, temi, icone | `contesto/MENU_QR_LAYOUT_CONTEXT.md` |
| Flusso dati admin ↔ pubblico, `category_filter`/`category_images`/`hidden_menu_item_ids`, rename/delete chiave | `contesto/MENU_QR_DATA_FLOW_CONTEXT.md` **(OBBLIGATORIO)** |
| Cappature/limiti testo (carosello, nome QR, titoli categoria), contatori | `contesto/MENU_QR_TEXT_LIMITS_MAP.md` |
| Form crea/modifica QR, validazione/messaggi-requisito, salvataggio modale | `MENU_QR_SKILL.md` §4 + `MenuQrModal.tsx`, `menuQrValidation.ts` |
| Migrazioni DB, path storage foto, short code, hook, RULE operative | `contesto/MENU_QR_REFERENCE.md` |
| Test dell'area (cosa è blindato, dove aggiungere) | `contesto/MENU_QR_TEST_SUITE_INDEX.md` |
| Magazzino menu admin / Pagina Prenota — **altre aree** | `../Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` · `../Prenota-Skill/PRENOTA_SKILL.md` |

## 5. LOCK (solo link)
- **`category_filter` semantica** (`null`=legacy tutte, `[]`=nessuna, `[keys]`=ordine) →
  `contesto/MENU_QR_DATA_FLOW_CONTEXT.md` §4.
- **Carosello obbligatorio (≥1 foto; testi slide facoltativi dal 03-09-26) + ≥1 categoria con ≥1
  ingrediente visibile** (requisiti Salva) →
  `MENU_QR_SKILL.md` §4.
- **`shortCode` non trovato → «Menù QR non trovato», nessun redirect** → `MENU_QR_SKILL.md` §3.
