# Report — SettingsSaveUi e salvataggio immediato sottotab

**Data:** 26-05-26  
**Area:** Admin → Impostazioni locale → Personalizza form / Anagrafica

## Obiettivo

Allineare footer e barre sezione tra Anagrafica e Personalizza form; evitare doppio salvataggio quando l’utente usa **Salva** dentro l’editor di una sottotab.

## Cosa vede il ristoratore

| Azione | Effetto |
|--------|---------|
| Modifica sottotab → **Salva** in fondo al riquadro | Modifiche subito sulla pagina Prenota pubblica; editor si chiude; non serve un secondo Salva sulla card «Modalità» |
| Modifica intestazione/sfondo senza salvare sezione | Footer in fondo: «Annulla tutte le modifiche» + «Salva modifiche» |
| Tab Anagrafica con dati cambiati | Stesso stile footer in fondo |

## Modifiche tecniche

### `SettingsSaveUi.tsx` (nuovo)

- `FormSectionFloatingActions`, `SectionActionBar`, `SettingsSaveFooter` — riuso Anagrafica + Personalizza form.

### `BookingFormConfigPanel.tsx`

- `persistModesSection` / `commitSubTabEditor`: upsert `booking_public_form_config.booking_modes` al Salva sottotab.
- Rimosso `saveDraftSubTab` (logica in `commitSubTabEditor`).

### `RestaurantSettingsTab.tsx`

- Footer Anagrafica via `SettingsSaveFooter`.

### Documentazione

- `docs/APP_CONTEXT_SKILL.md` (RULE Personalizza form, §3, tabella allineamento)
- `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`
- `docs/SESSION_LOG.md`
- `.cursor/skills/calendarbackup-app-context/SKILL.md`

## Storage (Supabase)

| Azione Salva sottotab | Chiave `restaurant_settings` | Campo JSON |
|----------------------|------------------------------|------------|
| Editor sottotab | `booking_public_form_config` | `booking_modes` (incl. `sub_tabs[]`) |

## Verifica

- `npm run typecheck` — OK
