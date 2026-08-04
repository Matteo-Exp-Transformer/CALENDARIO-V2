/**
 * // @admin-blindatura: crm
 * // Copre: apertura CRM Pro, tab Rubrica clienti, tab Personalizza email, sezioni Email automatiche / Email personalizzate e stati vuoti stabili.
 *
 * Test E2E — Admin Pro: CRM con sidebar Pro e tab interne.
 *
 * Richiede staging Supabase con:
 *   E2E_PRO_ADMIN_EMAIL / E2E_PRO_ADMIN_PASSWORD → admin del tenant Pro
 * Configurare in .env.local.test (vedi playwright.config.ts).
 *
 * La Rubrica clienti (CustomerDirectoryTab → CustomerCardList) non è una
 * tabella: è una lista di schede (<ul><li>), col messaggio "Nessun cliente
 * trovato." quando è vuota. Il tenant Pro (da-tommaso) ha già clienti reali
 * in TEST, quindi il test non può contare su uno stato vuoto stabile né deve
 * dipendere da quanti clienti reali esistono in un dato momento: semina un
 * cliente proprio (prenotazione con nome a prefisso unico E2E-CRM-<ts>-<rnd>
 * via insertBooking, che entra nella Rubrica tramite useCustomers/mergeProfiles)
 * e verifica che la SUA scheda sia visibile, poi lo ripulisce in finally con
 * deleteBookingsByPrefix — indipendente dal resto della rubrica.
 */

import { test, expect } from '@playwright/test'
import { getTenantIdBySlug, insertBooking, deleteBookingsByPrefix, todayIsoDate } from '../helpers/supabaseStaging'

test.skip(!process.env.E2E_PRO_ADMIN_EMAIL, 'richiede staging Pro configurato (E2E_PRO_ADMIN_EMAIL non impostato)')

const PRO_EMAIL = process.env.E2E_PRO_ADMIN_EMAIL ?? ''
const PRO_PASSWORD = process.env.E2E_PRO_ADMIN_PASSWORD ?? ''
const TENANT_SLUG = 'da-tommaso'

async function loginAsProAdmin(page: import('@playwright/test').Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(PRO_EMAIL)
  await page.getByLabel(/password/i).fill(PRO_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  await expect(page.getByRole('complementary', { name: /navigazione principale/i })).toBeVisible({
    timeout: 15000,
  })
}

function proSidebar(page: import('@playwright/test').Page) {
  return page.getByRole('complementary', { name: /navigazione principale/i })
}

test.describe('Admin Pro — CRM Clienti', () => {
  test('apre CRM, passa tra Rubrica e Personalizza email e mostra stati stabili', async ({ page }) => {
    const tenantId = await getTenantIdBySlug(TENANT_SLUG)
    const uniquePrefix = `E2E-CRM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const clientName = `${uniquePrefix} Cliente Rubrica`
    const clientEmail = `${clientName.replace(/\s+/g, '.').toLowerCase()}@e2e.test`

    // Seed PRIMA del login: la Rubrica fa fetch al mount, quindi il cliente deve
    // già esistere quando CustomerDirectoryTab monta, senza bisogno di un reload.
    await insertBooking({
      tenantId,
      clientName,
      status: 'accepted',
      desiredDate: todayIsoDate(),
      desiredTime: '20:00',
      numGuests: 2,
    })

    try {
      await loginAsProAdmin(page)

      await proSidebar(page).getByRole('button', { name: /crm clienti/i }).click()
      await expect(page.getByRole('heading', { name: /crm clienti/i })).toBeVisible({ timeout: 5000 })

      await expect(page.getByRole('button', { name: /rubrica clienti/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /personalizza email/i })).toBeVisible()

      await page.getByRole('button', { name: /rubrica clienti/i }).click()
      await expect(page.getByLabel(/cerca/i)).toBeVisible()
      await expect(page.getByLabel(/filtra data ultima prenotazione/i)).toBeVisible()

      // Rubrica = lista di schede (<ul><li>), non una tabella: verifichiamo che
      // la scheda del cliente seminato sia davvero renderizzata, non uno stato
      // vuoto generico intercambiabile con "ci sono clienti".
      const seededCard = page.getByRole('listitem').filter({ hasText: clientName })
      await expect(seededCard).toBeVisible({ timeout: 10000 })
      await expect(seededCard).toContainText(clientEmail)

      await page.getByRole('button', { name: /personalizza email/i }).click()
      await expect(page.getByRole('heading', { name: /email automatiche/i })).toBeVisible()
      await expect(page.getByRole('heading', { name: /email personalizzate/i })).toBeVisible()
      await expect(page.getByText(/accetta prenotazione/i)).toBeVisible()
      await expect(page.getByText(/rifiuta prenotazione/i)).toBeVisible()
      await expect(
        page
          .getByText(/nessuna campagna ancora/i)
          .or(page.getByRole('button', { name: /\+ nuova campagna/i }))
          .or(page.getByRole('button', { name: /invia ora/i }))
          .first(),
      ).toBeVisible()
    } finally {
      await deleteBookingsByPrefix(tenantId, uniquePrefix)
    }
  })
})
