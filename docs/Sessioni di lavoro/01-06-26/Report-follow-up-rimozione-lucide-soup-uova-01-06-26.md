# Report — Follow-up: rimozione 2 icone Lucide Menù QR (01-06-26)

- **Cosa è cambiato:** rimosse **Zuppa** (`lucide_soup`) e **Uova / brunch** (`lucide_egg_fried`) dal picker «Altre icone». Restano **20** icone (12 Phosphor + 8 Lucide). Chiavi ancora in DB → fallback visivo pentola/posate.
- **Chiusura report finale (01-06-26):** diff applicato; validate **237** test; commit su `env/test`.
- **Nota:** sessione precedente aveva solo il report su carta — Matteo ha segnalato che le icone erano ancora visibili; corretto in questo commit.

---

## Contesto

- **Profilo:** Esecuzione · **modalità:** standard (follow-up post [Report Lucide](Report-menu-qr-lucide-icone-01-06-26.md)).
- **Turni Matteo:** ping DOM su 2 icone da togliere + «lavoro ok».

## Cosa è stato fatto

1. Rimosso da `categoryIcons.ts`: `lucide_soup`, `lucide_egg_fried` (import `Soup`, `EggFried`).
2. Test: 20 preset; legacy `lucide_soup` su `zuppe` → `cooking_pot`; `lucide_egg_fried` → `fork_knife`.
3. `PUBLIC_MENU_SKILL.md`: 8 Lucide, nota chiavi rimosse.

## File toccati

| File | Modifica |
|------|----------|
| `src/features/public-menu/categoryIcons.ts` | −2 voci Lucide |
| `src/features/public-menu/__tests__/categoryIcons.test.ts` | Conteggi + fallback legacy |
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | 20 icone, elenco Lucide |

## Effetto per il ristoratore

- **Dove:** Menu → I miei QR → categoria senza foto → sezione «Altre icone».
- **Dati:** `menu_qrcode_categories.icon` — chiavi rimosse non più selezionabili; valori già salvati non mostrano più quell’icona finché non risalvi (fallback visivo su pubblico).

## Test

`npm run validate` — **237** test verdi (report finale).

## Dati comunicazione

- Matteo ha identificato le icone via **ping DOM** (`lucide-soup`, `lucide-egg-fried`) — stesso metodo della sessione Lucide precedente; efficace.
- «lavoro ok» senza altre correzioni.

## Revisione report finale

| Check | Esito |
|-------|--------|
| `lucide_soup` / `lucide_egg_fried` assenti dal picker | ✅ |
| 20 icone totali (12 + 8) | ✅ test |
| Fallback DB `lucide_soup` → `cooking_pot`, `lucide_egg_fried` → `fork_knife` | ✅ |
| Skill `PUBLIC_MENU_SKILL.md` | ✅ |
| `npm run validate` | ✅ 237/237 |

## Stato

- Codice + docs: **committati** su `env/test` (report finale).
- QR con chiavi vecchie in DB: riapri modale e Salva con altra icona se vuoi aggiornare il valore salvato (il pubblico intanto usa il fallback).
