# Report esecuzione checklist PWA + gating

Data esecuzione: 2026-05-05  
Checklist di riferimento: `Lavoro/Sessioni di lavoro/05-05-26/CHECKLIST_test_pwa_e_gating.md`

## Scope e metodo

- Eseguiti test runtime su ambiente locale (`http://localhost:4173`) con preview build.
- Eseguiti test DB runtime via MCP Supabase (`user-supabase`) con toggle reale del campo `organizations.is_active`.
- Eseguiti test UI/navigation con browser automation Playwright MCP.
- Verificato il punto attenzione richiesto `F3` e pre-verificato `G2` in locale.

## Risultato sintetico

- Test passati: **20 / 28**
- Test non passati/non conclusivi: **8 / 28**
  - 1 fallito funzionale/UX da chiarire (`D2`)
  - 7 non eseguiti (dipendono da deploy prod o device reali)

## Evidenze principali

### A) Build e PWA locale

- `npm run build`: OK.
- Artefatti presenti: `manifest.webmanifest`, `sw.js`, `workbox-*.js`, icone in `dist/icons/`.
- Service Worker attivo e registrato (`sw.js`) su `localhost`.
- Cache trovate: `workbox-precache-*` e `static-assets`.
- Verifica cache: **0 URL Supabase in cache**.
- Manifest runtime letto dal browser:
  - `name: CalendarBackup`
  - `short_name: CalBackup`
  - `start_url: /admin`
  - `display: standalone`
  - icone presenti.

### B/C/D/E) Gating licenza

- Con tenant attivo: login/refresh/logout/re-login OK.
- Con tenant disattivato a sessione attiva:
  - refresh su `/admin` porta a `/login` (OK),
  - banner persistente visibile (OK),
  - banner one-shot al reload (OK).
- Con tenant disattivato a login fresco:
  - nessun redirect su `/admin` (OK),
  - localStorage Supabase pulito (OK),
  - **toast rosso non catturato** (KO/non conclusivo su `D2`, da verificare manualmente in browser umano).
- Riattivazione tenant: accesso ripristinato (OK).

### F) Pagina pubblica `/prenota/:tenantSlug`

- Tenant attivo: form visibile (OK).
- Tenant disattivato: fallback "Prenotazioni temporaneamente non disponibili" (OK).
- Slug inesistente: stesso fallback (OK).
- Riattivazione: form torna visibile (OK).

## Punti richiesti da tenere d'occhio

### F3

Confermato runtime: fallback identico per
- slug inesistente
- tenant disattivato.

Comportamento coerente con limite noto/accettato.

### G2

Pre-verifica locale completata:
- `GET /sw.js` -> `200`, `Content-Type: text/javascript`
- `GET /manifest.webmanifest` -> `200`, `Content-Type: application/manifest+json`

Quindi non viene servito `index.html` in locale su queste route statiche.
Resta da confermare su dominio Vercel di produzione dopo deploy (`G2` checklist).

## Test non eseguiti in questo round

- `A5` installazione desktop via pulsante install.
- `G1` deploy prod.
- `G3-G7` installabilita e aggiornamento su prod / device reali (desktop/mobile/PWA installata).

## Stato DB finale al termine test

Ripristino eseguito:
- `al-ritrovo` -> `is_active = true`
- `tenant-b-qa` -> `is_active = true`

## Raccomandazione operativa

Prima del go-live:
1. Eseguire round manuale in produzione per `G2-G7`.
2. Verificare manualmente `D2` (toast errore login su tenant inattivo) e, se assente, aprire fix mirato UX in `AdminLoginPage`/`toast container`.
