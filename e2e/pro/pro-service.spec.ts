/**
 * @admin-blindatura: servizio
 * Copre: accesso Pro a Servizio da sidebar, controlli principali della pagina,
 * ritorno alla dashboard, e Fase 2 piano senior §4 riga 4 (validazioni editor
 * fasce: nome duplicato, inizio=fine, sovrapposizione) + riga 11 (modali
 * Servizio responsive 375/834/1280: sala, tavolo, walk-in, briefing, assegna
 * multi-tavolo).
 *
 * Test E2E — Admin Pro: smoke Servizio + validazioni fasce.
 *
 * Verifica che la sezione Servizio si apra dalla sidebar Pro, mostri il titolo
 * e i controlli principali, e che il pulsante X riporti alla dashboard. La
 * copertura sulle fasce e sulle modali semina risorse temporanee su TEST con
 * prefisso E2E-SRV- e le ripulisce in finally.
 *
 * Richiede staging Supabase con:
 *   E2E_PRO_ADMIN_EMAIL / E2E_PRO_ADMIN_PASSWORD → admin di un tenant pro
 * Configurare in .env.local.test (vedi playwright.config.ts).
 */

import { test, expect, type Locator, type Page } from '@playwright/test'
import {
  E2E_SERVIZIO_PREFIX,
  deleteBookingsByPrefix,
  deleteRoomsByPrefix,
  deleteServiceSlotsByPrefix,
  deleteTablesByPrefix,
  getTenantIdBySlug,
  insertBooking,
  insertRoom,
  insertServiceSlot,
  insertTable,
  isoStartEnd,
  offsetIsoDate,
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

async function goToServizio(page: Page) {
  await page.goto('/admin/servizio', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: /^Servizio$/i })).toBeVisible({ timeout: 10000 })
}

async function goToHome(page: Page) {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: /^Home$/i })).toBeVisible({ timeout: 10000 })
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

async function expectPanelInViewport(page: Page, dialog: Locator, label: string) {
  const viewport = page.viewportSize()
  expect(viewport, `viewport per ${label}`).not.toBeNull()
  const panel = dialog.locator('[role="document"]')
  await expect(panel, `pannello modale ${label}`).toBeVisible()
  const box = await panel.boundingBox()
  expect(box, `bounding box modale ${label}`).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1)
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height + 1)
}

async function expectDialogButtonInViewport(page: Page, dialog: Locator, name: RegExp | string) {
  const viewport = page.viewportSize()
  expect(viewport).not.toBeNull()
  const button = dialog.getByRole('button', { name }).first()
  await expect(button).toBeVisible()
  await button.scrollIntoViewIfNeeded()
  const box = await button.boundingBox()
  expect(box, `bounding box bottone ${String(name)}`).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1)
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height + 1)
}

async function expectServiceModalUsable(page: Page, dialog: Locator, label: string, actions: Array<RegExp | string>) {
  await expectPanelInViewport(page, dialog, label)
  for (const action of actions) {
    await expectDialogButtonInViewport(page, dialog, action)
  }
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

test.describe('Admin Pro — modali Servizio responsive', () => {
  for (const viewport of [
    { label: 'mobile-375', width: 375, height: 812 },
    { label: 'tablet-834', width: 834, height: 1194 },
    { label: 'desktop-1280', width: 1280, height: 800 },
  ]) {
    test(`sala, tavolo, walk-in, briefing e assegna multi-tavolo restano usabili (${viewport.label})`, async ({
      page,
    }, testInfo) => {
      testInfo.setTimeout(90_000)
      const tenantId = await getTenantIdBySlug(TENANT_SLUG)
      const prefix = `${E2E_SERVIZIO_PREFIX}Resp-${viewport.label}-${Date.now()}-`
      const roomName = `${prefix}Sala`
      const table1Name = `${prefix}T1`
      const table2Name = `${prefix}T2`
      const clientName = `${prefix}Cliente`
      const date = offsetIsoDate(120)
      const { start, end } = isoStartEnd(date, '20:00')

      try {
        const slot = await insertServiceSlot({
          tenantId,
          name: `${prefix}Slot`,
          startTime: '00:00',
          endTime: '23:59',
          displayOrder: -10000,
        })
        const room = await insertRoom({ tenantId, name: roomName })
        await insertTable({
          tenantId,
          roomId: room.id,
          name: table1Name,
          capacity: 2,
          positionX: 20,
          positionY: 20,
        })
        await insertTable({
          tenantId,
          roomId: room.id,
          name: table2Name,
          capacity: 2,
          positionX: 150,
          positionY: 20,
        })
        await insertBooking({
          tenantId,
          clientName,
          status: 'accepted',
          desiredDate: date,
          desiredTime: '20:00',
          numGuests: 4,
          confirmedStart: start,
          confirmedEnd: end,
        })

        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await loginAsProAdmin(page)

        await goToServizio(page)
        await page.getByRole('button', { name: /^Lista$/i }).click()
        await page.getByRole('button', { name: /^Aggiungi sala$/i }).click()
        const roomDialog = page.getByRole('dialog', { name: /^Aggiungi sala$/i })
        await expectServiceModalUsable(page, roomDialog, 'Aggiungi sala', [/Annulla/i, /Crea sala/i])
        await roomDialog.getByRole('button', { name: /^Annulla$/i }).click()
        await expect(roomDialog).not.toBeVisible()

        const roomSection = page.locator('section', { hasText: roomName }).first()
        await expect(roomSection).toBeVisible({ timeout: 10000 })
        await roomSection.getByRole('button', { name: /Aggiungi tavolo in questa sala/i }).click()
        const tableDialog = page.getByRole('dialog', { name: /^Aggiungi tavolo$/i })
        await expectServiceModalUsable(page, tableDialog, 'Aggiungi tavolo', [/Annulla/i, /^Aggiungi$/i])
        await tableDialog.getByRole('button', { name: /^Annulla$/i }).click()
        await expect(tableDialog).not.toBeVisible()

        await page.getByRole('button', { name: /^Mappa$/i }).click()
        await page.getByLabel('Data', { exact: true }).fill(date)
        await page.getByLabel('Fascia oraria', { exact: true }).selectOption(slot.id)
        await expect(page.getByText('Prenotazioni (1)', { exact: true })).toBeVisible({ timeout: 10000 })
        await page.getByRole('button', { name: 'Assegna', exact: true }).click()
        const assignDialog = page.getByRole('dialog', { name: /^Assegna tavolo$/i })
        await expect(assignDialog).toBeVisible({ timeout: 10000 })
        await assignDialog.locator('button', { hasText: table1Name }).click()
        await assignDialog.locator('button', { hasText: table2Name }).click()
        await expect(assignDialog.getByText(/Selezionati 2 tavoli/)).toBeVisible()
        await expectServiceModalUsable(page, assignDialog, 'Assegna multi-tavolo', [
          /Annulla/i,
          /Assegna 2 tavoli/i,
        ])
        await assignDialog.getByRole('button', { name: /^Annulla$/i }).click()
        await expect(assignDialog).not.toBeVisible()

        await goToHome(page)
        await page.getByRole('button', { name: /Aggiungi walk-in/i }).click()
        const walkInDialog = page.getByRole('dialog', { name: /^Aggiungi walk-in$/i })
        await expectServiceModalUsable(page, walkInDialog, 'Aggiungi walk-in', [/Annulla/i, /^Aggiungi walk-in$/i])
        await walkInDialog.getByRole('button', { name: /^Annulla$/i }).click()
        await expect(walkInDialog).not.toBeVisible()

        await page.getByRole('button', { name: /Briefing turno/i }).click()
        const briefingDialog = page.getByRole('dialog', { name: /^Briefing pre-turno$/i })
        await expectPanelInViewport(page, briefingDialog, 'Briefing pre-turno')
        await expectDialogButtonInViewport(page, briefingDialog, /^Chiudi$/i)
        await briefingDialog.getByRole('button', { name: /^Chiudi$/i }).click()
        await expect(briefingDialog).not.toBeVisible()
      } finally {
        await deleteBookingsByPrefix(tenantId, prefix).catch(() => {})
        await deleteTablesByPrefix(tenantId, prefix).catch(() => {})
        await deleteRoomsByPrefix(tenantId, prefix).catch(() => {})
        await deleteServiceSlotsByPrefix(tenantId, prefix).catch(() => {})
      }
    })
  }
})
