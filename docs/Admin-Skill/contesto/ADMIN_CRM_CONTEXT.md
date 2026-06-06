# ADMIN — CRM Context

> Area Pro/Enterprise per gestione clienti. Il CRM fonde dati manuali e prenotazioni usando email
> normalizzata, non una FK diretta.

## 1. Flussi utente

- Sidebar -> `CRM Clienti`.
- Cerca per nome/email/telefono.
- Filtra per ultima prenotazione: tutte, settimana, mese, anno.
- Ordina tabella.
- Seleziona riga e apre dettaglio.
- Crea cliente manuale.
- Modifica contatti/note.
- Elimina cliente.

## 2. Componenti

- `CrmPage`
- `CustomerSearchBar`
- `CustomerListTable`
- `CustomerDetailPanel`
- `CustomerFormModal`
- `CustomerDeleteConfirm`

## 3. Hook e dati

- `useCustomers` legge `customers` e `booking_requests`.
- `useCustomerMutations` crea/aggiorna/elimina.
- `useAdminAuth` fornisce admin id per alcune mutazioni.

## 4. Data flow

Relazione logica:

```text
booking_requests.client_email -> normalize(trim/lowercase) -> customers.email
```

Non c'e FK diretta. `useCustomers`:

1. legge clienti manuali/synced;
2. legge booking non `deleted`;
3. raggruppa per email;
4. sovrappone dati manuali a dati booking;
5. calcola count e ultima prenotazione.

`create-booking` pubblico inserisce booking e poi upserta `customers` con `source='synced'`.

## 5. Mutazioni

| Azione | Scrittura |
|---|---|
| Crea cliente | insert `customers source='manual'` |
| Modifica cliente | update `customers`; se solo booking, crea riga synced; patch booking collegate |
| Elimina cliente | soft-delete booking collegate e delete fisico riga `customers` |

## 6. Vincoli

- `customers.email` unico per tenant su email normalizzata.
- Email vuota vietata da trigger.
- CRM gated da `features.crm` e edition Pro/Enterprise.

## 7. Rischi

- Prenotazioni senza email non entrano nel CRM.
- Filtro data diverso da `all` nasconde clienti manuali senza booking.
- Update/delete multi-step client-side non transazionali.
- Cambio email puo fallire per duplicato.
- E2E CRM usa selettori deboli: servira attenzione nella blindatura.

## 8. Domande per Matteo

- Eliminare cliente deve davvero archiviare tutte le sue prenotazioni?
- Lo staff puo modificare note/contatti?
- Clienti senza email devono comparire in qualche vista alternativa?
