import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'

// Carica .env.local.test se presente (staging Supabase per E2E).
// Non sovrascrive variabili già impostate (es. in CI).
if (fs.existsSync('.env.local.test')) {
  process.loadEnvFile('.env.local.test')
}
// Worker Playwright: allinea alias service key
if (!process.env.E2E_SUPABASE_SERVICE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.E2E_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
}

/**
 * I test e2e richiedono un progetto Supabase staging separato.
 * Credenziali da impostare in .env.local.test (gitignored):
 *   VITE_SUPABASE_URL=https://<staging-project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<staging-anon-key>
 *   E2E_ADMIN_EMAIL=testc@c.com
 *   E2E_ADMIN_PASSWORD=123456
 *   E2E_TENANT_SLUG=test-classic
 *   E2E_CLASSIC_TENANT_ID=c97a2fa5-3675-4578-ad23-654ae71d06a7
 *   E2E_SUPABASE_SERVICE_KEY=<service-role-key-staging>
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // UN SOLO WORKER, SEMPRE — scelta misurata (05-08-26), non prudenza generica.
  // Prima era `undefined` in locale, cioè ~12 worker sulla macchina di sviluppo.
  //  1. Misura 04-08-26 sullo stesso commit: 12 worker → 51 verdi / 31 rossi;
  //     `--workers=1` → 71 verdi / 12 rossi. Due terzi dei rossi erano CONTESA, non
  //     difetti: tre sessioni di seguito hanno perso tempo a indagare rossi finti.
  //  2. L'isolamento non esiste a livello di dati: 17 spec su 25 lavorano sullo STESSO
  //     tenant TEST (`da-tommaso`) con lo STESSO account admin, e si scrivono addosso
  //     `restaurant_settings`, menù e assegnazioni.
  //  3. `waitForCreateBookingRateLimitWindow()` (e2e/helpers/supabaseStaging.ts) è un
  //     controlla-poi-agisci: in parallelo due worker leggono "c'è posto" insieme e
  //     inviano insieme → 429; e 6 richieste in 10 minuti mettono l'IP in `ip_blacklist`
  //     per 24 ORE. Sbagliare qui costa una giornata di macchina ferma, non un rosso.
  // Costo della serialità, misurato: 7,0 minuti per 117 test (05-08-26).
  // Per rimettere in discussione la scelta serve PRIMA l'isolamento per-tenant delle
  // spec; finché non c'è, alzare i worker riporta i rossi finti. `E2E_WORKERS` resta
  // come manopola per esperimenti consapevoli (attenzione al punto 3).
  workers: Number(process.env.E2E_WORKERS) || 1,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Fuso del BROWSER, normalmente quello della macchina (undefined = nessun override).
    // Serve per provare gli scenari a orologio (pro-service-tables-lifecycle) a un'ora
    // del giorno diversa da quella reale: `safeAnchorNow()` gira in Node e legge l'ora
    // LOCALE del processo, quindi per una prova onesta i due orologi devono coincidere.
    //   $env:TZ='Asia/Kabul'; $env:E2E_TIMEZONE='Asia/Kabul'; npx playwright test ...
    // (TZ sposta Node, E2E_TIMEZONE sposta il browser: su Windows Chromium legge il fuso
    // dal sistema operativo, non da TZ, quindi senza questa riga i due divergono.)
    timezoneId: process.env.E2E_TIMEZONE || undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@viewport:(mobile-375|tablet-834)/,
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
      },
      grep: /@viewport:mobile-375/,
    },
    {
      name: 'tablet-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 834, height: 1194 },
      },
      grep: /@viewport:tablet-834/,
    },
  ],
  webServer: {
    // Autosave OFF in E2E: il guard logout/dirty su anagrafica segue il comportamento prod (FU-004).
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    env: {
      VITE_SETTINGS_AUTOSAVE: 'false',
    },
  },
})
