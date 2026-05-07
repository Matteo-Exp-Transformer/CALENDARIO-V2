import { defineConfig, devices } from '@playwright/test'

/**
 * I test e2e richiedono un progetto Supabase staging separato.
 * Credenziali da impostare in .env.local.test (gitignored):
 *   VITE_SUPABASE_URL=https://<staging-project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<staging-anon-key>
 *   E2E_ADMIN_EMAIL=admin@test.it
 *   E2E_ADMIN_PASSWORD=password-staging
 *   E2E_TENANT_SLUG=test-ristorante
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
