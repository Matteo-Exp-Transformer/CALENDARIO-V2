# Piano di test manuale

Checklist da completare prima di ogni consegna o deploy in produzione. Tempo stimato: ~30 minuti.

Prerequisiti: un'organizzazione attiva nel DB, un utente admin registrato, il server di dev o preview Vercel disponibile.

---

## 1. Setup iniziale

- [ ] `npm run build` completa senza errori
- [ ] `npm run preview` o URL Vercel preview accessibile
- [ ] DB ha almeno un'organizzazione con `is_active = true`

---

## 2. Pagina prenotazione pubblica (`/prenota/<slug>`)

- [ ] La pagina si carica con il nome del ristorante nell'header
- [ ] Il form mostra i campi richiesti (nome, data, numero ospiti)
- [ ] Inviare una prenotazione valida → messaggio di conferma
- [ ] Il record appare nella tabella `booking_requests` con `status = 'pending'`
- [ ] Inviare senza nome → errore di validazione inline (non submit)
- [ ] Inviare con email in formato non valido → errore di validazione inline
- [ ] Accedere a `/prenota/slug-inesistente` → pagina "Ristorante non trovato"
- [ ] Accedere a `/prenota` (senza slug) → pagina `TenantNotFound`

**Nota:** L'invio email di conferma al cliente non funziona (send-email mancante). Questo è un issue noto, non bloccante.

---

## 3. Login admin (`/login`)

- [ ] Accedere a `/admin` senza sessione → redirect a `/login`
- [ ] Login con email/password corrette → redirect a `/admin`
- [ ] Login con password errata → messaggio di errore (non redirect)
- [ ] Dopo il login, aggiornare la pagina → sessione mantenuta, rimane su `/admin`

---

## 4. Dashboard admin (`/admin`)

### Tab prenotazioni pendenti

- [ ] Le prenotazioni create nel punto 2 appaiono come card
- [ ] Clic su "Accetta" → modale di conferma → prenotazione passa a `accepted`
- [ ] Clic su "Rifiuta" → modale con campo motivo → prenotazione passa a `rejected`
- [ ] Prenotazione accettata appare nel calendario (tab Calendario)
- [ ] Prenotazione rifiutata non appare nel calendario

### Tab calendario

- [ ] Il calendario mostra le prenotazioni accettate nelle date corrette
- [ ] Cambiare vista (mese/settimana/lista) funziona senza errori

### Tab archivio

- [ ] Le prenotazioni accettate e rifiutate appaiono nell'archivio

### Creazione prenotazione da admin

- [ ] Il form "Nuova prenotazione" crea una prenotazione con `booking_source = 'admin'`
- [ ] La nuova prenotazione appare nelle pendenti

---

## 5. Gestione menu (`/admin` → tab Menu)

- [ ] Le categorie esistenti sono visibili
- [ ] Creare una nuova categoria → appare nella lista
- [ ] Aggiungere un item a una categoria → appare con nome e prezzo
- [ ] Modificare il prezzo di un item → la modifica persiste dopo refresh
- [ ] Eliminare un item → sparisce dalla lista

---

## 6. Impostazioni ristorante (`/admin` → tab Impostazioni)

- [ ] Gli orari di apertura sono visualizzati correttamente
- [ ] Modificare un orario e salvare → la modifica persiste dopo refresh
- [ ] Il nome ristorante nell'header riflette `organizationName` dal context

---

## 7. Flusso invito admin (`/invite/<token>`)

Per testare questo flusso, crea manualmente un token nel DB:

```sql
INSERT INTO invite_tokens (organization_id, token, expires_at)
VALUES ('<id-org>', gen_random_uuid()::text, NOW() + INTERVAL '1 hour');
```

- [ ] Aprire `/invite/<token>` → form di registrazione con nome ristorante
- [ ] Completare la registrazione con email e password → redirect a `/login`
- [ ] Login con le credenziali appena create → accesso a `/admin`
- [ ] Aprire `/invite/<token-scaduto>` → messaggio "Link scaduto o non valido"
- [ ] Aprire `/invite/token-inesistente` → messaggio di errore

---

## 8. PWA e build

- [ ] Aprire la build su un dispositivo mobile o Chrome DevTools (mobile view)
- [ ] Il banner "Installa app" appare (o l'icona nella barra indirizzi)
- [ ] `manifest.webmanifest` è accessibile su `/manifest.webmanifest`
- [ ] Le icone in `public/icons/` sono visibili

---

## 9. Privacy e pagine statiche

- [ ] `/privacy` carica la pagina senza errori
- [ ] Rotta inesistente (es. `/foo/bar`) → redirect a `/login`

---

## 10. Logout

- [ ] Clic su "Esci" dalla dashboard → redirect a `/login`
- [ ] Accedere a `/admin` dopo il logout → redirect a `/login`

---

## Issue noti (non bloccanti per la consegna)

- **Email non inviate**: la Edge Function `send-email` non esiste. Le prenotazioni vengono salvate correttamente ma il cliente non riceve email. Vedi `docs/EDGE_FUNCTIONS.md`.
- **Doppio prefisso 003_\***: due migrazioni con lo stesso prefisso numerico. Già applicate al remoto, nessun impatto funzionale. Documentato in `docs/DATABASE.md`.
