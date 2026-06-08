import { expect, type Page } from '@playwright/test'

/** Sidebar Pro: `<aside aria-label="Navigazione principale">` → role complementary */
export function proSidebar(page: Page) {
  return page.getByRole('complementary', { name: /navigazione principale/i })
}

export async function assertProSidebarVisible(page: Page, timeout = 15000) {
  await expect(proSidebar(page)).toBeVisible({ timeout })
}

export async function assertNoProSidebar(page: Page, timeout = 10000) {
  await expect(proSidebar(page)).not.toBeVisible({ timeout })
}

/** Tab interne dashboard (header desktop) */
export function dashboardHeaderNav(page: Page) {
  return page.locator('header nav')
}

/** Card richiesta pending nel tab Prenotazioni (Classic): pulsante digest, non righe tabella. */
export function firstPendingRequestCard(page: Page) {
  return page.locator('main').getByRole('button', { name: /^Pendente\b/i }).first()
}

export async function loginAdminFromRoute(page: Page, email: string, password: string) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  await expect(page).toHaveURL(/\/admin(?:\/|$)/, { timeout: 15000 })
  await expect(page.getByLabel(/^email$/i)).not.toBeVisible({ timeout: 5000 })
}

export async function loginAsClassicAdmin(page: Page, email: string, password: string) {
  await loginAdminFromRoute(page, email, password)
  await assertNoProSidebar(page)
  await expect(dashboardHeaderNav(page)).toBeVisible({ timeout: 10000 })
}

export async function loginAsProAdmin(page: Page, email: string, password: string) {
  await loginAdminFromRoute(page, email, password)
  await assertProSidebarVisible(page)
}
