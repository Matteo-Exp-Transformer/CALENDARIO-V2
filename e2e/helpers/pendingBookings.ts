import { expect, test, type Page } from '@playwright/test'
import { dashboardHeaderNav } from './adminShell'

export async function openPendingTab(page: Page) {
  await dashboardHeaderNav(page).getByRole('button', { name: /prenotazioni/i }).click()
  await expect(
    page.getByRole('heading', { name: /richieste in attesa|nessuna richiesta in attesa/i }),
  ).toBeVisible({ timeout: 15000 })
}

export async function skipIfNoPendingBookings(page: Page) {
  if (await page.getByRole('heading', { name: /nessuna richiesta in attesa/i }).isVisible()) {
    test.skip(true, 'nessuna prenotazione pending nel DB staging')
  }
}

export async function acceptFirstPendingBooking(page: Page): Promise<string> {
  await openPendingTab(page)
  await skipIfNoPendingBookings(page)

  const firstCard = page.locator('.booking-request-card-shell').first()
  await expect(firstCard).toBeVisible({ timeout: 10000 })
  const digestTrigger = firstCard.locator('.booking-request-digest-trigger')
  const clientLabel =
    (await digestTrigger.innerText()).split('\n').find((line) => /E2E Test/i.test(line))?.trim() ??
    (await digestTrigger.innerText()).trim().split('\n')[0]?.trim() ??
    'E2E Test'

  await digestTrigger.click()
  await firstCard.getByRole('button', { name: /accetta prenotazione/i }).click()

  const pastStartConfirm = page.getByRole('button', { name: /conferma comunque|procedi/i })
  if (await pastStartConfirm.isVisible({ timeout: 2000 }).catch(() => false)) {
    await pastStartConfirm.click()
  }

  const capacityConfirm = page.getByRole('button', { name: /^conferma$/i }).last()
  if (await capacityConfirm.isVisible({ timeout: 2000 }).catch(() => false)) {
    await capacityConfirm.click()
  }

  await expect(page.locator('.Toastify__toast--success').first()).toBeVisible({ timeout: 12000 })
  return clientLabel
}

export async function openCalendarTab(page: Page) {
  await dashboardHeaderNav(page).getByRole('button', { name: /calendario/i }).click()
  await expect(page.locator('.fc-view')).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /^oggi$/i }).click()
}

/** BookingDetailsModal è uno slide-over senza role=dialog: attendi azione Elimina. */
export async function openFirstCalendarBookingModal(page: Page, clientName?: string) {
  const namePattern = clientName ? new RegExp(clientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : /E2E Test/

  const digestButton = page
    .locator('main')
    .getByRole('button')
    .filter({ hasText: namePattern })
    .first()

  if (await digestButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await digestButton.click()
  } else {
    const gridEvent = page.locator('.fc-event').filter({ hasText: namePattern }).first()
    await expect(gridEvent).toBeVisible({ timeout: 10000 })
    await gridEvent.click()
  }

  await expect(page.getByRole('button', { name: /^elimina$/i }).first()).toBeVisible({
    timeout: 15000,
  })
}
