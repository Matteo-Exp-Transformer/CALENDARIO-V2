# Report — Menu QR: filtri ingredienti, UI modale, tipografia e fix produzione

**Data:** 25-05-26  
**Ambienti DB:** TEST (`docnnernvp`) + **produzione** (`rwuxgvld`) allineati per migrazioni 036–037

---

## Cosa è stato fatto (ordine)

1. **Commit lavoro precedente** — bozza Storage pre-salvataggio QR, eyebrow carosello, lookup pubblico affidabile (`tenantReady`, QR non trovato).
2. **Piano filtri ingredienti** (`menu_qr_filtri_ingredienti`) — migrazione `037`, visibilità per-QR, categorie con prodotti, rimozione tema Wine Bistrot.
3. **UI picker ingredienti nascosti** — disclosure compatto allineato agli input (stessa altezza/stile dei campi «Descrizione breve»).
4. **Tipografia modale** — «Specialità della casa» senza grassetto; etichette «Nome QR», «Categorie…» e titoli sezione h4 più marcati.
5. **Fix produzione (segnalazione utente)** — applicate migrazioni **036** e **037** su DB prod; rimossa sezione «Menù eventi visibili» dal modale.

---

## Effetto per il ristoratore

| Schermata | Cosa vede / cosa cambia |
|-----------|-------------------------|
| **Menu → QR Code → Impostazione Menù QR** | Solo categorie con almeno un ingrediente; card titoli/foto solo per categorie spuntate; riga collassabile per nascondere singoli piatti (occhio). **Niente più** blocco «Menù eventi visibili» tra categorie e carosello. |
| **Salvataggio senza foto carosello** | In produzione ora funziona (prima errore schema); carosello vuoto = placeholder sulla pagina cliente come in locale. |
| **Scan QR → categoria** | Piatti con occhio chiuso non compaiono. |

---

## Perché c’era la sezione «Menù eventi visibili»

Il modale leggeva `booking_custom_staff_presets` (menù precompilati per lo **staff in Prenota**). Se il ristorante ne aveva almeno uno in DB, compariva un filtro `preset_ids` sul QR — legacy del primo design QR. Non serve al flusso attuale: rimossa la UI; in salvataggio si mantiene solo il valore già salvato su QR esistenti.

---

## Storage (Supabase)

**Tabella `menu_qr_codes`** (post-037):

| Campo | Contenuto |
|--------|-----------|
| `theme_key`, `carousel_items`, `category_images` | Aspetto homepage **per questo QR** (036) |
| `hidden_menu_item_ids` | UUID ingredienti da **non** mostrare (037) |
| `category_filter` | Categorie visibili nel QR |
| `preset_ids` | Opzionale, non editabile dal modale |

Migrazioni file: `036_menu_qr_per_qr_appearance.sql`, `037_menu_qr_hidden_items_and_theme.sql`.

---

## Commit principali (branch `main`)

| Commit | Contenuto |
|--------|-----------|
| `2a89aa0` | Bozza Storage, eyebrow, lookup QR pubblico |
| `a08c3fb` | Filtri categorie + ingredienti nascosti + 037 TEST |
| `be95dfc` | Tipografia modale + picker compatto + report |
| `b5912a6` | Rimozione preset dal modale + skill |

---

## File toccati (ultima tornata)

- `MenuQrModal.tsx`, `MenuQrManager.tsx` — rimozione preset UI
- `PUBLIC_MENU_SKILL.md`, `APP_CONTEXT_SKILL.md`, `DB_MIGRATIONS_CONTEXT.md`
- Questo report

---

## Test

- `npm run validate` — 137/137 OK
- `npm run build` — OK (sessione deploy)

---

## Prossima sessione

- Verifica manuale in **produzione** dopo deploy: salva QR senza slide carosello; modale senza «Menù eventi».
- Checklist plan: 2 QR, nascondi piatti, scan e riapertura modale.
