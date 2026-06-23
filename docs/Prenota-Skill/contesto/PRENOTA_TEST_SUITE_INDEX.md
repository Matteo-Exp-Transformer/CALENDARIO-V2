# Indice suite di blindatura — Pagina Prenota

> Mappa «cosa è già protetto da test, dove sta, come girarlo». Pensata per gli agenti:
> prima di toccare la Pagina Prenota, guarda qui quale flusso è coperto e dove aggiungere
> il test nuovo. Collegata dalla skill entry point [`PRENOTA_SKILL.md`](../PRENOTA_SKILL.md) §6.

## In parole semplici

### S3 — intervalli arrivo

- `deriveArrivalTimes.s3.test.ts`: 18 casi su step relativo, cutoff, durata, tardivo, overnight,
  confini e input malformati.
- `useArrivalSlots.s3.test.tsx`: gate capacità, fascia piena e nessuna lettura anon diretta di setting.
- `edgeArrivalValidation.s3.test.ts` + `bookingDurationSnapshot.s3.test.ts`: Edge e snapshot admin.
- `public-booking-smoke.spec.ts`: picker e submit a 375×812, 834×1194 e 1280×800.

I test della Pagina Prenota sono divisi per **fronte** (di cosa si occupano), non per file.
Ogni test della rete di blindatura ha in cima un **marcatore** in commento:

```
// @prenota-blindatura: <fronte>
```

I tre fronti:

| Fronte | Domanda a cui risponde | A cosa serve |
|--------|------------------------|--------------|
| `flusso-dati` | I dati dal DB (preset, override, ordine categorie, config) arrivano puliti alla vetrina anche se «sporchi»/legacy? | Blinda parser, resolver, funzioni pure che decidono *cosa mostrare* |
| `flusso-utente` | Il cliente che compila il form vede/calcola le cose giuste (totali, reset al cambio tipologia, cap testo)? | Blinda la logica di stato del form pubblico |
| `server-config` | I limiti del client coincidono con la difesa server (edge `create-booking`) e i serializer non scrivono valori illegali in DB? | Blinda il contratto client ↔ edge ↔ DB |

## Come girarli

```bash
# tutta la suite
npm run test

# solo i test di un fronte (marcatore in header)
npx vitest run -t @prenota-blindatura          # nessun -t: usa grep sul sorgente
# in pratica: filtra per cartella/nome file dei fronti elencati sotto
```

Per fronte, i file sono elencati qui sotto: lancia `npx vitest run <path>` sul singolo file.

---

## E2E Playwright smoke (2 file)

| File | Cosa protegge |
|------|---------------|
| `e2e/public-booking.spec.ts` | Submit completo su staging TEST: form valido → conferma invio reale. |
| `e2e/public-booking-smoke.spec.ts` | Gap documentati ma automatizzabili: slug inesistente, submit invalido con alert sul primo campo, link Privacy + ritorno, submit raggiungibile a 375/834/1280; riepilogo con label `Totale` e non `Totale stimato`; XOR card/carosello e card senza titolo non renderizzata; visual checklist sfondo striscia/full-page/crema + footer Orari assente quando tutti i giorni sono chiusi; EmptyState con recapiti quando manca `booking_public_form_config`. |
| `e2e/public-booking-fix9-compilable.spec.ts` | **FIX 9 fase pubblica** `compilable_category_keys`: categoria non compilabile visibile senza checkbox (caso 3) a 375/900/1256; categoria compilabile con checkbox (caso 3+); item non compilabile assente dal riepilogo (caso 4); submit non include item non compilabili (caso 5). Seed/cleanup su staging TEST. |

```bash
npx playwright test e2e/public-booking.spec.ts e2e/public-booking-smoke.spec.ts --workers=1
```

---

## Fronte `flusso-dati` (4 file)

| File | Cosa protegge |
|------|---------------|
| `src/features/booking/services/__tests__/bookingFormResolver.flusso-dati.test.ts` | Resolver «live vs congelato»: preset cancellato/svuotato dopo il collegamento, override con valore mancante, prezzo card vs carosello, menù personalizzabile. LOCK Resolver puro / Owner `field_overrides` / Cancellazione preset / Card senza preset / Carosello singolo. |
| `src/features/booking/constants/__tests__/bookingPublicFormConfig.malformed.flusso-dati.test.ts` | Parser/normalizer contro input JSONB malformati/legacy (campo assente, tipo errato, array al posto di oggetto) → mai crash, mai valori sballati. Antipattern §6 (parser non risolve il preset). |
| `src/features/booking/utils/__tests__/buildPresetMenuSelection.flusso-dati.test.ts` | Funzioni pure preset durante `isLoading` (catalogo vuoto → vuoto/null, non inventano voci): il chiamante DEVE distinguere loading da preset-mancante. LOCK Ingredienti preset custom. |
| `src/features/booking/utils/__tests__/orderCategoryKeys.staleKeys.flusso-dati.test.ts` | Ordine categorie con chiavi stale/orfane/duplicate → lettura pubblica mostra solo chiavi vive, deduplicate, senza crash. Valori magici sort (999 / 1000+index). Include il blocco reorder del **bug riordino frecce** (FU-036). |

## Fronte `flusso-utente` (3 file)

| File | Cosa protegge |
|------|---------------|
| `src/features/booking/utils/__tests__/bookingTotals.flussoUtente.test.ts` | Calcolo totali: menù componibile (somma piatti × ospiti), menù fisso (prezzo × ospiti), ospiti 0/negativi, prezzo preset 0. |
| `src/features/booking/components/__tests__/BookingRequestForm.flussoUtente.test.tsx` | Submit a form vuoto → niente POST + attenzione primo campo; cambio tipologia → reset menù/preset/totali + reset intolleranze **per capacità**; cap testo cliente silenzioso. |
| `src/features/booking/components/__tests__/BookingSummarySidebar.capability.test.tsx` | Riepilogo mostra/nasconde i totali per **capacità** (`modeUsesMenu(activeMode)`), non per nome tipologia (FU-036 #1). **+1 test FIX 9:** esclusione automatica totale item non compilabili (mai in `menu_selection.items` → totale corretto senza logica aggiuntiva). |
| `src/features/booking/components/__tests__/BookingSummarySidebar.clientPhone.adminBlindatura.test.tsx` | Riepilogo mostra `client_phone` digitato da Anna, non `contact_phone` del ristorante (17-06-26). |
| `src/features/booking/components/__tests__/bookingPublicFieldLabelFocus.adminBlindatura.test.tsx` | Label interne caselle cliente (inset + data/ora) portano focus al controllo via `htmlFor` (17-06-26). |
| `src/features/booking/components/__tests__/MenuSelectionCategoryEntries.test.ts` | Regressione card categorie + filtro preset per ogni `booking_type` (LOCK ingredienti). **+5 test FIX 9** (`compilable_category_keys`): backward compat campo assente, array vuoto, parziale, locked globale, mix compilabile+non. |
| `src/features/booking/utils/__tests__/privacyPolicyNavigation.test.ts` | Link privacy → ritorno Pagina Prenota: build `?from=/prenota/:slug`, validazione anti-open-redirect, resolve da query/state. |
| `src/features/booking/components/publicBooking/__tests__/bookingModeCardsAndCategoryCard.prenotaM0.adminBlindatura.test.tsx` | FIX 5: classi testo card tipologia ingrandite (+20%, no peggioramento gap lg-vs-sm); FIX 8: `BookingMenuCategoryCard` scrolla al centro dello strip prima di espandersi solo su desktop (`layout="scroll"` + `horizontalScrollRef`), non su mobile (`layout="grid"`); accordion desktop (16-06-26): una sola categoria aperta, collasso se shell fuori viewport carosello; rompi: click rapidi multipli scrollano una sola volta. **6 test.** |

## Fronte `server-config` (3 file)

| File | Cosa protegge |
|------|---------------|
| `src/features/booking/constants/__tests__/bookingClientEdgeLimitsSync.test.ts` | I cap testo/numerici del client restano allineati ai valori ri-validati dall'edge `create-booking` (name 65, email 65, phone 30, dietary 550, special 550, ospiti 110). |
| `src/features/booking/lib/__tests__/restaurantSettingRegistry.stripPhoto.test.ts` | LOCK «striscia foto mai NULL»: `public_booking_strip_photo` serializza `null → ''` (colonna NOT NULL), round-trip `null → '' → null`. |
| `src/features/booking/constants/__tests__/presetMenuDisplay.test.ts` *(aggiornato)* | `shouldShowComposeMenuHeader` capability-driven (include `menu_prezzo_fisso`) — FU-036 #3. |

---

## Dove aggiungere un test nuovo

1. Scegli il fronte giusto (tabella in alto).
2. Metti il file accanto agli altri dello stesso fronte (stessa cartella `__tests__`).
3. Prima riga: `// @prenota-blindatura: <fronte>` + 2-3 righe che dicono *cosa caccia*.
4. Testa il **codice vero** (importa la funzione pura), non una replica della logica.
5. Aggiorna questo indice con una riga nella tabella del fronte.

## Riferimenti

- Report di nascita della suite: [`Sessioni di lavoro/05-06-26/Report-blindatura-prenota-multiagent-FU-036-05-06-26.md`](../../Sessioni%20di%20lavoro/05-06-26/Report-blindatura-prenota-multiagent-FU-036-05-06-26.md)
- Skill area: [`PRENOTA_SKILL.md`](../PRENOTA_SKILL.md) · flusso dati: [`PRENOTA_DATA_FLOW_CONTEXT.md`](./PRENOTA_DATA_FLOW_CONTEXT.md)
