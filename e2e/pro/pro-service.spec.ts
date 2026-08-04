/**
 * @admin-blindatura: servizio
 * Copre: accesso Pro a Servizio da sidebar, controlli principali della pagina,
 * ritorno alla dashboard, e Fase 2 piano senior §4 riga 4 (validazioni editor
 * fasce: nome duplicato, inizio=fine, sovrapposizione).
 *
 * Test E2E — Admin Pro: smoke Servizio + validazioni fasce.
 *
 * Verifica che la sezione Servizio si apra dalla sidebar Pro, mostri il titolo
 * e i controlli principali, e che il pulsante X riporti alla dashboard. La
 * copertura sulle fasce semina una fascia temporanea su TEST con prefisso
 * E2E-SRV- e la ripulisce in finally.
 *
 * Richiede staging Supabase con:
 *   E2E_PRO_ADMIN_EMAIL / E2E_PRO_ADMIN_PASSWORD → admin di un tenant pro
 * Configurare in .env.local.test (vedi playwright.config.ts).
 */

import { test, expect, type Page } from '@playwright/test'
import {
  E2E_SERVIZIO_PREFIX,
  deleteServiceSlotsByPrefix,
  getTenantIdBySlug,
  insertServiceSlot,
} from '../helpers/supabaseStaging'

test.skip(!process.env.E2E_PRO_ADMIN_EMAIL, 'richiede staging Pro configurato (E2E_PRO_ADMIN_EMAIL non impostato)')

const PRO_EMAIL = process.env.E2E_PRO_ADMIN_EMAIL ?? ''
const PRO_PASSWORD = process.env.E2E_PRO_ADMIN_PASSWORD ?? ''
const TENANT_SLUG = 'da-tommaso'

function sidebarNav(page: Page) {
  return page.getByRole('complementary', { name: /navigazione principale/i })
}

function collectBrowserErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    if (/Failed to load resource|favicon/i.test(text)) return
    errors.push(text)
  })
  return errors
}

async function loginAsProAdmin(page: Page) {
  await page.goto('/admin')
  await page.getByLabel(/email/i).fill(PRO_EMAIL)
  await page.getByLabel(/password/i).fill(PRO_PASSWORD)
  await page.getByRole('button', { name: /accedi|login/i }).click()
  await expect(sidebarNav(page)).toBeVisible({ timeout: 15000 })
}

async function openServizio(page: Page) {
  await loginAsProAdmin(page)
  await sidebarNav(page).getByRole('button', { name: /servizio/i }).click()
  await expect(page.getByRole('heading', { name: /^Servizio$/i })).toBeVisible({ timeout: 10000 })
}

async function openFasceOrarie(page: Page) {
  await expect(page.getByRole('heading', { name: /^Fasce orarie$/i })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /^Fasce orarie$/i }).click()
}

async function setSlotTime(page: Page, fieldId: string, value: string) {
  const [hh, mm] = value.split(':')
  await page.locator(`#${fieldId}`).selectOption(hh)
  await page.locator(`#${fieldId}-minute`).selectOption(mm)
}

async function submitInvalidNewSlot(
  page: Page,
  input: {
    name: string
    startTime: string
    endTime: string
    expectedError: RegExp
  },
) {
  await page.getByRole('button', { name: /aggiungi fascia/i }).click()
  const dialog = page.getByRole('dialog', { name: /nuova fascia oraria/i })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Nome fascia').fill(input.name)
  await setSlotTime(page, 'slot-start', input.startTime)
  await setSlotTime(page, 'slot-end', input.endTime)

  await dialog.getByRole('button', { name: /^Aggiungi$/i }).click()

  await expect(dialog.getByRole('alert')).toHaveText(input.expectedError)

  await dialog.getByRole('button', { name: /^Annulla$/i }).click()
  await page.getByRole('button', { name: /^Annulla modifiche$/i }).click()
  await expect(dialog).toBeHidden()
}

test.describe('Admin Pro — Servizio', () => {
  test('Intervallo di arrivo resta raggiungibile nei tre viewport', async ({ page }) => {
    await openServizio(page)
    await openFasceOrarie(page)

    for (const viewport of [
      { width: 375, height: 812 },
      { width: 834, height: 1194 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(viewport)
      const slotsSection = page.getByRole('heading', { name: /^Fasce orarie$/i }).locator('../../..')
      await slotsSection.getByRole('button', { name: /^Modifica /i }).first().click()
      const field = page.getByLabel('Intervallo di arrivo')
      await expect(field).toBeVisible()
      await expect(field).toHaveValue(/15|30|60|custom/)
      const box = await field.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1)
      await page.getByRole('button', { name: /^Annulla$/i }).click()
    }
  })

  test('smoke Servizio dalla sidebar e ritorno alla dashboard', async ({ page }) => {
    const errors = collectBrowserErrors(page)

    await loginAsProAdmin(page)
    await sidebarNav(page).getByRole('button', { name: /servizio/i }).click()

    await expect(page).toHaveURL(/\/admin\/servizio/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /^Servizio$/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /^Lista$/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /^Mappa$/i })).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: /^Mappa$/i }).click()
    await expect(page.getByRole('button', { name: /^Aggiungi sala$/i })).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: /torna alla dashboard/i }).click()
    await expect(page).toHaveURL(/\/admin\/(calendario|prenotazioni)/, { timeout: 10000 })
    await expect(page.locator('header nav')).toBeVisible({ timeout: 10000 })

    expect(errors, 'errori console/browser').toEqual([])
  })

  test('validazioni editor fasce bloccano duplicato, inizio=fine e sovrapposizione', async ({ page }) => {
    const tenantId = await getTenantIdBySlug(TENANT_SLUG)
    const prefix = `${E2E_SERVIZIO_PREFIX}Validazioni-${Date.now()}-`
    const baseName = `${prefix}Base`

    try {
      await insertServiceSlot({
        tenantId,
        name: baseName,
        startTime: '03:00',
        endTime: '04:00',
        displayOrder: -10000,
      })

      await openServizio(page)
      await openFasceOrarie(page)
      await expect(page.getByText(baseName, { exact: true })).toBeVisible({ timeout: 10000 })

      await submitInvalidNewSlot(page, {
        name: `  ${baseName.toUpperCase()}  `,
        startTime: '04:30',
        endTime: '05:00',
        expectedError: /nome fascia duplicato/i,
      })

      await submitInvalidNewSlot(page, {
        name: `${prefix}StessoOrario`,
        startTime: '05:15',
        endTime: '05:15',
        expectedError: /inizio e fine coincidono/i,
      })

      await submitInvalidNewSlot(page, {
        name: `${prefix}Overlap`,
        startTime: '03:30',
        endTime: '04:30',
        expectedError: /si sovrappongono/i,
      })
    } finally {
      await deleteServiceSlotsByPrefix(tenantId, prefix)
    }
  })
})
