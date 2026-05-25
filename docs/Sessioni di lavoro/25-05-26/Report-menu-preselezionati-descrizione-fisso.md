# Report sessione — Menù preselezionati: descrizione e menù fisso

**Data:** 25-05-26  
**Richiesta:** campi admin per menù preselezionati (nome, descrizione opzionale, checkbox menù fisso/personalizzabile) allineati a DB e card pagina Prenota.

---

## Cosa è stato fatto (ordine cronologico)

1. **Modello dati** — `CustomStaffPreset` esteso con `description?` (max 300) e `is_fixed_menu?` (default menù fisso se omesso). Helper `isStaffPresetFixedMenu`, `staffPresetDescriptionForCards`, `enrichPresetSubTabsFromStaffPresets` in `presetMenus.ts`.

2. **Persistenza** — `restaurantSettingRegistry.ts`: schema Zod e `parseBookingCustomStaffPresetsFromDb` per i nuovi campi su chiave `booking_custom_staff_presets` (nessuna migrazione SQL).

3. **Admin tab Menu** — `MenuPricesTab.tsx`, sezione «Menù preselezionati»: textarea descrizione, checkbox «Menù fisso o personalizzabile da cliente?» (spuntata = fisso), anteprima in lista (badge Fisso/Personalizzabile + descrizione).

4. **Pagina Prenota** — `BookingRequestForm.tsx`: descrizione preset propagata alle card sottotab se `sub_tabs[].description` è vuota. `MenuSelection.tsx`: con menù fisso, griglia ingredienti in sola lettura + messaggio informativo.

5. **Menu QR pubblico** — `PublicMenuPage.tsx` / `PublicMenuPresetPage.tsx`: query preset allineata a colonne reali `setting_key` / `setting_value` (fix caricamento da `restaurant_settings`).

6. **Skill** — `docs/APP_CONTEXT_SKILL.md` RULE Menu Prenota aggiornata.

---

## Effetto per il ristoratore

| Dove | Prima | Dopo |
|------|--------|------|
| **Admin → Menu → Menù preselezionati** | Solo nome, ingredienti, tipologie | Anche descrizione per le card Prenota e scelta se il cliente può modificare il pacchetto |
| **Pagina Prenota** | Card sottotab senza testo dal preset | Sottotitolo dalla descrizione del menù (se non sovrascritta in Personalizza Form) |
| **Pagina Prenota — menù fisso** | Poteva cambiare ingredienti dopo aver scelto un pacchetto | Ingredienti bloccati; messaggio «Menù fisso» |
| **Menu QR (preset)** | Rischio preset non caricati (colonne DB errate) | Lettura corretta da impostazioni ristorante |

---

## Storage — `restaurant_settings.booking_custom_staff_presets`

JSON array per tenant. Esempio riga:

```json
{
  "id": "uuid",
  "name": "Menù Laurea",
  "description": "Pacchetto completo",
  "is_fixed_menu": false,
  "item_ids": ["..."],
  "booking_types": ["menu_prezzo_fisso"],
  "visible_on_booking": true
}
```

- `is_fixed_menu` salvato solo come `false` se personalizzabile; omesso = fisso.
- Priorità descrizione card: `booking_public_form_config` → `sub_tabs[].description` se presente, altrimenti `description` del preset.

---

## File toccati

| File | Ruolo |
|------|--------|
| `presetMenus.ts` | Tipo + helper |
| `restaurantSettingRegistry.ts` | Validazione/parse DB |
| `MenuPricesTab.tsx` | Editor admin |
| `BookingRequestForm.tsx` | Card sottotab con descrizione |
| `MenuSelection.tsx` | Blocco modifica menù fisso |
| `PublicMenuPage.tsx` / `PublicMenuPresetPage.tsx` | Fix query preset QR |
| `docs/APP_CONTEXT_SKILL.md` | RULE aggiornata |

---

## Test eseguiti

- `npm run typecheck` — OK

---

## Prossima sessione (opzionale)

- Anteprima live descrizione/fisso in `BookingFormConfigPanel` quando si collega un preset alle sottotab.
- Deriva automatica card sottotab da `booking_custom_staff_presets` quando `sub_tabs` è vuoto (già prevista nei plan, non in questa sessione).
