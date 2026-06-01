# Report — Follow-up: rimozione 2 icone Lucide Menù QR (01-06-26)

> ⚠️ **Stato revisione report finale:** bozza **non applicata** al codice su `env/test` (commit `a25f02c`). Il picker ha ancora **22** icone incluso `lucide_soup` e `lucide_egg_fried`. Trattare questo file come intento/documentazione; eseguire il diff sotto solo se Matteo conferma.

- **Cosa avrebbe cambiato (se implementato):** rimuovere Zuppa e Uova dal picker → **20** icone (12 + 8 Lucide).
- **Cosa resta:** implementazione codice + commit, oppure annullare il follow-up.

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

`npm run validate` — **236** test verdi.

## Dati comunicazione

- Matteo ha identificato le icone via **ping DOM** (`lucide-soup`, `lucide-egg-fried`) — stesso metodo della sessione Lucide precedente; efficace.
- «lavoro ok» senza altre correzioni.

## Stato

**Non mergiato** — solo report scritto; `src/features/public-menu/categoryIcons.ts` su branch ha ancora le 10 Lucide originali.
