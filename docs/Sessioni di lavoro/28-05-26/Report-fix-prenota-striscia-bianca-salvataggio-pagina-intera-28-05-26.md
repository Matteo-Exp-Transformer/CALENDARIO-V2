# Report — Fix pagina Prenota: striscia con sfondo uniforme + salvataggio "Pagina intera"

**Data:** 28-05-26
**Sessione:** debug e fix dei due bug ereditati dal lavoro parallelo agenti sulla v2 di Prenota.

---

## Cosa Mario vedeva prima del fix

1. **Modalità "Striscia laterale"** — Mario apriva la pagina Prenota e *non* vedeva la colonna foto a sinistra come prima. In realtà il componente foto veniva montato, ma sotto e dietro si vedeva ancora l'ultima immagine "a pagina intera" salvata in precedenza (oppure il vecchio gradiente/texture), che copriva tutta la viewport. Il risultato era una pagina con la striscia "sporca" da uno sfondo full-page sovrapposto, e in alcuni casi sembrava proprio che la striscia non si vedesse.
2. **Modalità "Pagina intera"** — quando Mario sceglieva una delle 6 foto a tutto schermo e dava Salva, compariva un alert con messaggio:
   `null value in column "setting_value" of relation "restaurant_settings" violates not-null constraint`.
   Il salvataggio non andava a buon fine.

---

## Cosa Mario vede ora

1. **Striscia laterale**: scegliendo una delle 6 foto della striscia e salvando, la pagina Prenota su desktop torna ad avere la colonna fotografica ancorata al bordo sinistro (25vw da 900px in su). Il resto della pagina è una tinta crema chiara uniforme (`#faf7f1`): le card del form restano bianche e nitide, niente immagine sovrapposta dietro al form. Il footer Orari+Contatti chiude la pagina come prima, full-width.
2. **Pagina intera**: scegliendo una delle 6 foto in `public/asset/sfondo intero/` e salvando, la pagina pubblica usa quella foto come sfondo dell'intera viewport e nessuna striscia laterale viene renderizzata. Il salvataggio mostra il toast "Impostazioni salvate" senza più errori.

Lo switch tra le due modalità avviene cliccando i due pulsanti "Striscia laterale" / "Pagina intera" nella sezione **Sfondo pagina Prenota** dentro **Personalizza Form**, esattamente come previsto.

---

## File toccati e perché

| File | Cosa è cambiato | Perché |
|------|-----------------|--------|
| `src/features/booking/lib/restaurantSettingRegistry.ts` | Il serializer di `public_booking_strip_photo` ora converte `null` JS in stringa vuota `''` invece che in SQL `NULL`. | Risolve il violation `NOT NULL` sulla colonna `setting_value`. Il parser già ritornava `null` JS quando la stringa è vuota, quindi nessun lettore va aggiornato. |
| `src/pages/BookingRequestPage.tsx` | Il root della pagina pubblica usa `{ backgroundColor: '#faf7f1' }` quando la striscia è attiva. L'immagine full-page o i fallback legacy si applicano solo quando non c'è striscia. | Risolve il bug visivo dove la modalità striscia ereditava lo sfondo full-page o legacy precedente. Costante `STRIP_MODE_PAGE_BG` definita localmente nel componente. |
| `docs/APP_CONTEXT_SKILL.md` | Aggiunte due note nella `RULE Pagina Prenota v2`: regola "striscia attiva ⇒ tinta crema uniforme, niente immagine viewport" e vincolo `NOT NULL` su `setting_value` con il pattern stringa-vuota-come-null. | Mantiene la skill allineata al comportamento attuale e documenta il pattern per i prossimi setting "scalari opzionali". |
| `docs/SESSION_LOG.md` | Nuova riga in cima alla tabella 2026-05 che punta a questo report. | Cronologia sessioni sempre allineata. |

---

## Domande poste all'utente e risposte

- **Tinta sfondo in modalità striscia** → "Crema/avorio leggero" (scelto `#faf7f1`).
- **Testo errore al salvataggio Pagina intera** → "Errore nel salvataggio: `null value in column 'setting_value' of relation 'restaurant_settings' violates not-null constraint`" → identificata la causa esatta.
- **Asset Git** → al momento di test: foto striscia in `/strip`, foto pagina intera distribuite in cartelle dentro `/sfondo intero`. Le 6 foto principali `full-01..06` sono direttamente nella radice della cartella (le sottocartelle sono materiale di test e restano fuori dal pannello finché non ci sarà una decisione di setup).

---

## Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm run typecheck` | OK, 0 errori |
| `npm run lint` | OK, 0 warning |

Test manuale del flusso admin/pubblico atteso (da svolgere nel browser sul dev server attivo `:5173`):
1. Tab Impostazioni → Personalizza Form → "Sfondo pagina Prenota".
2. Click "Pagina intera" → seleziona una foto `full-*` → Salva → toast verde "Impostazioni salvate", nessun alert rosso.
3. Apri `/prenota/<slug>` su desktop: foto a tutto schermo, nessuna colonna laterale.
4. Torna in admin → click "Striscia laterale" → seleziona `strip-01` → Salva.
5. Apri `/prenota/<slug>` su desktop ≥1024px: striscia foto a sinistra (ancorata al bordo viewport), resto della pagina su tinta crema chiara, card del form bianche, footer full-width.

---

## File di skill aggiornati

| Skill | Cosa è cambiato |
|-------|-----------------|
| `docs/APP_CONTEXT_SKILL.md` | §4 RULE Pagina Prenota v2 — aggiunta nota su sfondo viewport in modalità striscia (`#faf7f1`) e nota sul pattern stringa-vuota-come-null per il vincolo `NOT NULL` di `restaurant_settings.setting_value`. |
| `docs/SESSION_LOG.md` | Nuova riga 28-05-26 in cima alla tabella 2026-05. |

---

## Cosa resta per la prossima sessione

- Verifica visiva nel browser delle due modalità (test manuale sopra).
- Eventuale commit asset `public/asset/sfondo intero/` se le 6 foto attuali sono quelle definitive (al momento sono materiale di test secondo l'utente).
- Decidere se promuovere `STRIP_MODE_PAGE_BG` da costante locale in `BookingRequestPage` a costante esportata da `bookingPageBackground.ts` (utile se la tinta verrà ritoccata o riutilizzata altrove).

---

## Deviazioni dal plan

Nessuna. Il fix è esattamente quello descritto nel plan: due edit chirurgici (serializer + sfondo condizionale) + allineamento skill + report.
