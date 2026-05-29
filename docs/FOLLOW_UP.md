# Follow-up post-sessione

Debiti e controlli differiti collegati ai report di sessione.

| ID | Stato | Follow-up | Report sessione |
|----|-------|-----------|-----------------|
| FU-001 | Aperto | Verificare modal dettaglio prenotazione in calendario — promo/offerte viste dal cliente, UI corretta (polish elenco promo in `BookingDetailsModal` / card calendario). | [Report promo Personalizza form 29-05-26](Sessioni%20di%20lavoro/29-05-26/Report-promo-personalizza-form-29-05-26.md) |
| FU-002 | Aperto | **Salvataggio admin — form intelligenti con autosave:** ridurre al minimo i pulsanti **Salva** / **Annulla** per sezione. Obiettivo: persistenza automatica quando l’utente aggiunge o modifica elementi (nuova promo, nuova card/sottotab, ingrediente, fascia, ecc.) senza passaggio esplicito «Applica → Salva sezione». Partire da aree con più frizione: **Personalizza form** (`BookingFormConfigPanel`, `BookingFormPromoSection`), poi **Impostazioni** (`RestaurantSettingsTab`, `SettingsSaveUi` / `FormSectionFloatingActions`). Definire regole: cosa si salva subito su DB, cosa resta draft locale, come gestire errori di rete e undo. Aggiornare skill/doc (`BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`, RULE Personalizza form in `APP_CONTEXT_SKILL.md`) quando il pattern è scelto. | Richiesta Matteo 29-05-26 (post-revisione promo) |
| FU-003 | Aperto | **Conferma prima di eliminare dal DB:** su ogni azione distruttiva (icona cestino, «Elimina», rimozione da lista che persiste su Supabase) mostrare un **alert di conferma** («Sei sicuro di voler eliminare …?») prima della chiamata delete. Obiettivo: safe check uniforme in tutta l’admin, non solo in alcune schermate. Audit: mappare delete senza conferma; riusare pattern esistente dove già presente (es. `window.confirm` su promo in `BookingFormPromoSection`, reset presentazione in `BookingFormConfigPanel`). Valutare componente condiviso (`ConfirmDialog` / hook) al posto di `window.confirm` sparsi. | Richiesta Matteo 29-05-26 (post-revisione promo) |

## Note FU-002 / FU-003 (contesto prodotto)

- **Per il ristoratore oggi:** in Personalizza form e Impostazioni spesso deve **Applica** un elemento, poi **Salva** la sezione, a volte anche **Salva modifiche** in fondo — rischio di perdere lavoro o dimenticare il secondo passo.
- **Obiettivo UX:** «inserisco → è salvato»; il pulsante Salva diventa eccezione (es. batch raro o impostazioni globali non ancora migrate).
- **Storage:** invariato (`restaurant_settings`, `booking_public_form_config`, tabelle menu, ecc.) — cambia solo **quando** e **come** il client scrive su DB, non il modello dati.
- **FU-003 non sostituisce** conferme già presenti su operazioni bulk (es. reset tutte le sottotab): estendere la copertura alle delete singole mancanti.
