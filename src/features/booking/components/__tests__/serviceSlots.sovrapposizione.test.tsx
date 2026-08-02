// S4-FIX-6 — una fascia di servizio non deve poter accavallarsi su un'altra.
// Copre: ServiceSlotsManager, ramo "Modifica permanente" del submit fascia.
// Riusa validateSlotConfigs/slotRangesOverlap (bookingTimeSlots.ts) — non ne scrive una seconda.

import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UnsavedChangesProvider } from '@/contexts/UnsavedChangesContext'

const createSlotSpy = vi.fn()
const updateSlotSpy = vi.fn()

const slotsState = vi.hoisted(() => ({
  slots: [] as Array<{
    id: string
    tenant_id: string
    name: string
    start_time: string
    end_time: string
    max_turns: number | null
    max_guests: number | null
    display_order: number
    is_canonical: boolean
    created_at: string
    updated_at: string
    max_turns_resume?: number | null
    arrival_step_minutes: number
    min_duration: number | null
    turnover_buffer_minutes: number
  }>,
}))

vi.mock('@/features/booking/hooks/useServiceSlots', () => ({
  useServiceSlots: () => ({ data: slotsState.slots, isLoading: false, error: null }),
  useUpdateServiceSlot: () => ({ mutate: updateSlotSpy, mutateAsync: updateSlotSpy, isPending: false }),
  useCreateServiceSlot: () => ({ mutate: createSlotSpy, isPending: false }),
  useDeleteServiceSlot: () => ({ mutate: vi.fn(), isPending: false }),
  isServiceSlotClosed: (slot: { max_turns: number | null }) => slot.max_turns === 0,
  SERVICE_SLOTS_QUERY_KEY: 'service_slots',
}))

vi.mock('@/features/booking/hooks/useServiceSlotOverrides', () => ({
  useServiceSlotOverrides: () => ({ data: [] }),
  useCreateServiceSlotOverride: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteServiceSlotOverride: () => ({ mutate: vi.fn(), isPending: false }),
  getActiveOverrides: () => [],
  hasActiveOverride: () => null,
  resolveSlotOverride: () => null,
  todayLocalISODate: () => '2026-08-02',
  resolveScopeDateRange: () => null,
  classifyOverrideScope: () => 'today',
  findActiveOverrideOfScope: () => null,
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: () => ({ tenantId: 'tenant-test', organizationName: 'Test' }),
}))

vi.mock('@/hooks/useBusinessHours', () => ({
  useBusinessHours: () => ({ data: null }),
}))

vi.mock('@/features/booking/hooks/useRestaurantSetting', () => ({
  useRestaurantSetting: () => ({ data: false }),
  useUpsertRestaurantSetting: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), warn: vi.fn(), success: vi.fn() },
}))

// bookingTimeSlots NON è mockato: serve slotRangesOverlap vero (riuso, non duplicazione).

import { ServiceSlotsManager } from '../servizio/ServiceSlotsManager'

function makeSlot(id: string, name: string, startTime: string, endTime: string, displayOrder: number) {
  return {
    id,
    tenant_id: 'tenant-test',
    name,
    start_time: startTime,
    end_time: endTime,
    max_turns: null,
    max_guests: null,
    display_order: displayOrder,
    is_canonical: true,
    created_at: '',
    updated_at: '',
    arrival_step_minutes: 30,
    min_duration: null,
    turnover_buffer_minutes: 0,
  }
}

function renderManager() {
  return render(
    <UnsavedChangesProvider>
      <ServiceSlotsManager />
    </UnsavedChangesProvider>,
  )
}

/** TimePicker24h = due <select> nativi; l'id sul primo (ora) è quello legato alla label del campo. */
async function setTime(user: ReturnType<typeof userEvent.setup>, fieldId: string, value: string) {
  const [hh, mm] = value.split(':')
  const hourSelect = document.getElementById(fieldId) as HTMLSelectElement
  const minuteSelect = document.getElementById(`${fieldId}-minute`) as HTMLSelectElement
  await user.selectOptions(hourSelect, hh)
  await user.selectOptions(minuteSelect, mm)
}

describe('S4-FIX-6 — fasce di Servizio non si accavallano', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    createSlotSpy.mockResolvedValue(undefined)
    updateSlotSpy.mockResolvedValue(undefined)
    slotsState.slots = [
      makeSlot('slot-cena', 'Cena', '19:00:00', '22:00:00', 0),
    ]
  })

  it('nuova fascia accavallata su Cena → il salvataggio si rifiuta e nomina le due fasce', async () => {
    const user = userEvent.setup()
    renderManager()

    await user.click(screen.getByRole('button', { name: /aggiungi fascia/i }))
    await user.type(screen.getByLabelText('Nome fascia'), 'Serale')
    await setTime(user, 'slot-start', '20:00')
    await setTime(user, 'slot-end', '23:00')

    await user.click(screen.getByRole('button', { name: /^aggiungi$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Le fasce "Serale" e "Cena" si sovrappongono',
    )
    expect(createSlotSpy).not.toHaveBeenCalled()
  })

  it('nuova fascia adiacente (fine di una = inizio dell\'altra) → si salva', async () => {
    const user = userEvent.setup()
    renderManager()

    await user.click(screen.getByRole('button', { name: /aggiungi fascia/i }))
    await user.type(screen.getByLabelText('Nome fascia'), 'Dopocena')
    await setTime(user, 'slot-start', '22:00')
    await setTime(user, 'slot-end', '23:30')

    await user.click(screen.getByRole('button', { name: /^aggiungi$/i }))

    await waitFor(() => expect(createSlotSpy).toHaveBeenCalledTimes(1))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('modifica di una fascia esistente senza spostare gli orari → si salva (non si accavalla con se stessa)', async () => {
    const user = userEvent.setup()
    renderManager()

    await user.click(await screen.findByRole('button', { name: /modifica cena/i }))
    await user.click(screen.getByRole('button', { name: /salva modifiche/i }))

    await waitFor(() => expect(updateSlotSpy).toHaveBeenCalledTimes(1))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
