# Plan fix 7 — BookingDetailsModal menu admin

## Obiettivo

Nel dettaglio prenotazione admin, la tab **Menu e Prezzi** non deve piu replicare la vista cliente della Pagina Prenota quando Mario entra in modifica. Deve diventare una vista admin coerente col resto del modal, pensata per cambiare il menu scelto tra quelli disponibili e per rimuovere singoli ingredienti o intere categorie dalla prenotazione.

La sezione **Intolleranze e Note** resta fuori scope e non va riscritta.

## Contesto letto

- `BookingDetailsModal` e un file LOCK admin classica: non cambiare bottoni core, signature pubbliche o guard esistenti.
- `MenuTab` oggi usa `MenuSelection` in edit mode: questo porta dentro il layout pubblico, con card/compose pensati per il cliente.
- Il salvataggio passa gia da `useUpdateBooking` tramite `formData.menu_selection`, `preset_menu`, `menu_total_per_person`, `menu_total_booking`: la nuova UI deve alimentare questi stessi campi, non introdurre una mutation nuova.
- Le prenotazioni conservano uno snapshot in `booking_requests.menu_selection`; modificare il magazzino non deve riscrivere prenotazioni storiche. Qui invece Mario sta modificando esplicitamente la singola prenotazione aperta.

## Piano operativo

1. **Mappare le viste vecchie dentro il modal**
   - Elencare cosa c'e oggi nella tab `details`, `menu`, `dietary`.
   - Identificare nel codice quali pezzi della tab menu sono stile cliente (`MenuSelection`, riepilogo pubblico, dropdown staff preset).
   - Mantenere invariata `DietaryTab` salvo eventuali classi condivise strettamente necessarie.

2. **Creare una vista admin dedicata per Menu e Prezzi**
   - Sostituire l'edit mode di `MenuTab` con un componente/ramo admin, non con `MenuSelection`.
   - Usare uno stile coerente col drawer: sezioni bianche, bordi slate/primary, pulsanti piccoli con icone, layout denso e leggibile.
   - Mostrare:
     - menu preselezionato corrente;
     - menu disponibili configurati per la tipologia prenotazione;
     - ingredienti raggruppati per categoria;
     - totali a persona e totale prenotazione.

3. **Cambio menu preselezionato**
   - Riutilizzare `customStaffPresets`, `presetMenu`, `onPresetMenuChange`, `applyPresetTypeToBookingFormPayload` gia cablati dal parent.
   - Il select/lista deve mostrare solo preset coerenti con la tipologia prenotazione, come oggi fa il flusso esistente.
   - Cambio preset aggiorna `preset_menu` e `menu_selection.items` usando la pipeline gia presente nel parent.

4. **Rimozione ingredienti e categorie dalla prenotazione**
   - Singolo ingrediente: rimuove solo quell'item da `menu_selection.items`.
   - Intera categoria: rimuove tutti gli item di quella categoria dalla prenotazione aperta.
   - Non eliminare nulla dal magazzino (`menu_items`, `menu_categories`): e una modifica snapshot della prenotazione.
   - Dopo ogni rimozione ricalcolare totali tramite la logica gia presente in `BookingDetailsModal.performSave`.

5. **Stati vuoti e guard**
   - Se il menu resta senza ingredienti, mostra stato vuoto chiaro nella tab menu e lascia decidere a Mario se salvare o scegliere un altro menu.
   - La dirty detection esistente deve scattare per cambio preset, rimozione ingrediente e rimozione categoria.
   - Salva/Annulla/chiusura drawer devono continuare a usare il guard attuale.

6. **Controregressioni**
   - Non toccare `useCreateBookingRequest`.
   - Non cambiare `DietaryTab`.
   - Non cambiare la logica oraria/date.
   - Non introdurre hard-delete o scritture DB fuori dalla mutation booking esistente.
   - Non usare emoji nuove come struttura principale della UI admin; se restano emoji legacy in view mode, mapparle ma non e obbligatorio rimuoverle in questo fix.

## Test attesi

- Test mirato su `MenuTab` o `BookingDetailsModal` per:
  - cambio preset in edit mode aggiorna lista ingredienti;
  - rimozione singolo ingrediente aggiorna lista/totali;
  - rimozione categoria svuota solo quella categoria;
  - view mode resta leggibile.
- `npm run validate` prima di chiudere.
- QA manuale consigliata su drawer dettagli a 375 / 834 / 1280: apri prenotazione con menu, entra in modifica, cambia menu, rimuovi ingrediente/categoria, annulla, poi ripeti e salva.

## Fuori scope

- Riscrivere la Pagina Prenota.
- Cambiare magazzino menu o preset staff.
- Cambiare Intolleranze e Note.
- Aggiungere nuove tabelle, migrazioni o policy.
- Riprogettare tutto il drawer oltre alla tab menu e a eventuali micro-allineamenti necessari per coerenza visiva.
