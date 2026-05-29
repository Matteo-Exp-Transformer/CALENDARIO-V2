# PWA / aggiornamento app — context

> Mappa di dettaglio della Progressive Web App e della strategia di aggiornamento (service worker).
> Caricala quando il task tocca `vite.config.ts` (VitePWA), `src/main.tsx` (registerSW),
> `index.html` (splash), `vercel.json` (cache header) o `src/vite-env.d.ts` (globali build).

> **Trigger di routing:** «PWA» · «service worker» · «aggiornamento app» · «cache» → questo file.

---

## Strategia

**App sempre aggiornata all'apertura, mai reload/popup durante la sessione.** Mario non deve essere
interrotto mentre compila.

## Invarianti da NON violare

- `registerType: 'prompt'` + `workbox.skipWaiting: false` + `clientsClaim: false`. **MAI tornare a
  `autoUpdate`**: attiverebbe il nuovo SW da solo durante la sessione. In `prompt` il SW resta in
  `waiting` e `skipWaiting()` parte solo al messaggio `SKIP_WAITING`.
- In `src/main.tsx`: `onNeedRefresh` resta **vuoto** (niente `window.confirm`, niente reload in
  sessione). `onRegisteredSW` controlla `registration.waiting` all'avvio → mostra splash
  `#sw-update-splash` + `updateSW(true)` (skipWaiting + reload una tantum). Usare l'helper
  `updateSW` di `registerSW`, **non** `postMessage`/`controllerchange` manuali (fragili: il SW
  generato non ascolta messaggi custom).
- Cache `vercel.json`: `/assets/*` = `immutable` (nomi con hash → sicuri); `index.html` / `sw.js` /
  `manifest.webmanifest` = `no-cache` (sempre rivalidati). Non rimuovere i security header esistenti.
  L'hash dei file è automatico Vite — nessuna config nomi output.
- **Mai cacheare richieste `supabase.co`** (escluse in `workbox.runtimeCaching` — mantenere).
- Versione build: `__APP_VERSION__` (da `package.json` `version`, bump manuale per pubblicare es.
  `2.1.0`) + `__BUILD_COMMIT__` + `__BUILD_DATE__`, iniettati via `define` in `vite.config.ts`,
  loggati con `logger.info` all'avvio. Tipi in `src/vite-env.d.ts`.

## Lezione operativa (incident)

Migrazione DB + fix client devono viaggiare insieme su `main`; verificare main + Vercel prima di
applicare migrazioni che restringono permessi. Vedi report incident in `SESSION_LOG.md`.

## Report di sessione collegati

- `docs/Sessioni di lavoro/28-05-26/Report-pwa-update-strategy-sessione-28-05-26.md`
