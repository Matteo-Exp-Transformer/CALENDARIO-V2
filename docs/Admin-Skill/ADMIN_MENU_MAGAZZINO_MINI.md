# TAB MENU (MAGAZZINO) — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per il **tab Menu / magazzino** (`MenuPricesTab`): la fonte di
> verità unica di categorie, prodotti, prezzi, foto, preset, QR. **Non duplica** i dettagli: per il
> testo pieno apri `ADMIN_MENU_MAGAZZINO_CONTEXT.md`.
> Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«menù fonte di verità» · «menu pagina impostazioni» · «tab Menu» · «MenuPricesTab» · «magazzino
menu» · «categorie/ingredienti/prezzi» · «preset staff» · «QR manager» · «promo testuali» · «toggle
disponibilità» · «limiti magazzino».

## 2. Carica subito
- **`contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`** (intero) — scopo, tabelle, flusso, decisioni M3 §9.
- `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` se tocchi il flusso dati resolver.
- `../Database-Skill/DB_SKILL.md` se tocchi lo schema.

## 3. Divieti top-3
1. **Tre famiglie foto categoria NON si mischiano:** Prenota (`menu_categories.image_url`) ≠ per-QR
   (`menu_qr_codes`/`menu_qrcode_categories`) ≠ homepage QR legacy
   (`menu_homepage_config.category_images`). Il QR **non** scrive mai sul magazzino.
2. **SNAPSHOT prenotazioni intatto:** modificare/eliminare nel magazzino aggiorna SUBITO Prenota+QR,
   ma `booking_requests.menu_selection` resta congelato (il cliente vede ciò che ha scelto). Non
   «far rileggere il magazzino» alle prenotazioni esistenti.
3. **Limiti duri solo su NUOVI inserimenti** (6 preset / 6 QR,
   `MENU_MAGAZZINO_HARD_LIMITS`; **nessun tetto** categorie/prodotti): tenant già oltre soglia non si rompe né si svuota. Toggle
   `is_available` spento = nascosto OVUNQUE (Prenota + QR + modal config), distinto da
   `visible_on_booking`/`hidden_menu_item_ids`.

## 4. Mappa file
| Se il task tocca… | Apri |
|---|---|
| Tabelle/storage/foto, layout categorie/overlay, form prodotto, promo, preset, icone QR | `contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` §§3-7 |
| Decisioni intervista M3, limiti, propagazione, snapshot, da-costruire | `contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` §9 |
| Flusso resolver vetrina Prenota, `field_overrides` | `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` |
| Vista QR pubblica, rename/delete chiave categoria sync | `../Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md` |
| Cap testo compose Prenota (numeri ↔ codice) | `../Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` §E |
| Schema/migrazioni/RLS | `../Database-Skill/DB_SKILL.md` |

## 5. LOCK (solo link)
- **Rename/delete categoria = sync multi-risorsa NON transazionale** (no rollback automatico) →
  `contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` §5 + §9.4.
- **Preset QR rimossi (`content_type`/`preset_ids`)** — non reintrodurre →
  `../Menu-QR-Skill/MENU_QR_SKILL.md` §3-bis.
- **`CollapsibleCard` LOCK** (57 test) — non modificare il componente.
- Modali in-app per ogni delete (mai `window.confirm`) → §5.
