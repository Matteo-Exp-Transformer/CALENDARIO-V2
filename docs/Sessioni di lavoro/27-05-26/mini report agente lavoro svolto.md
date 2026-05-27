Modifiche apportate in questa sessione
1. Layout pagina Prenota (BookingRequestPage.tsx)
La pagina Prenota ora ha un layout a 2 colonne sempre attive (anche mobile):

Colonna sinistra: striscia foto verticale sticky — 20vw su mobile, 25vw da 900px — controllata da grid-cols-[20vw_1fr] min-[900px]:grid-cols-[25vw_1fr] nel wrapper griglia in BookingRequestPage.tsx. Per cambiare la larghezza basta modificare questi valori.
Colonna destra: header + form + sticky bar (comportamento responsive invariato)
Footer Orari+Contatti: fuori dalla griglia, larghezza intera pagina senza padding laterali
2. Componente BookingPhotoStrip (src/features/booking/components/publicBooking/BookingPhotoStrip.tsx)
Nuovo componente. Mostra le foto impilate verticalmente con parallax leggero (0.4×). Riceve selectedPhotoId (da DB) e viteBase. La foto selezionata appare per prima; le altre scorrono sotto. Le foto vengono ripetute in coda per scroll lunghi.

3. Foto reali collegate
Le 6 foto sono in public/asset/strip/ con nomi foto sfondo  Pagina prenota (N).png (N = 1..6). Gli ID sono strip-01..strip-06 definiti in bookingPageBackground.ts insieme agli helper bookingStripPhotoPublicHref e allBookingStripPhotoHrefs.

4. Campo DB public_booking_strip_photo
Nuovo campo in restaurantSettingRegistry.ts (tipo BookingStripPhotoId | null). Salva l'ID della foto selezionata dall'admin (strip-01..strip-06). null = prima foto come default. Letto da BookingRequestPage via useRestaurantSetting('public_booking_strip_photo').

5. Pannello admin selezione foto (RestaurantSettingsTab.tsx)
In Impostazioni → Personalizza form, dopo la sezione "Sfondo pagina Prenota", c'è la nuova sezione "Foto striscia pagina Prenota". Mostra le 6 foto come card con aspect-[1/3] (verticale). Selezione + SectionActionBar salva/annulla indipendente. Salva su public_booking_strip_photo. Stato locale: stripPhoto, stripPhotoDirty, savedStripPhoto.

6. Validazione data/ora passata (BookingFormFields.tsx)
desired_time non parte più da 16:00 fisso — parte dalla prossima ora intera futura (getDefaultTime() in BookingRequestForm.tsx)
Nuova funzione validateDateTime blocca: data nel passato, ora passata quando la data è oggi
Prop minTime aggiunta a BookingPublicTimePickerField (pronta per futuro blocco visivo nel picker)