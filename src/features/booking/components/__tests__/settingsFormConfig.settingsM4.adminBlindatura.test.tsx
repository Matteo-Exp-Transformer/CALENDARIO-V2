// @admin-blindatura: settings-form-config
// Copre: modale conferma delete card/carosello (riga collassata + editor), annulla non rimuove, conferma alza dirty

import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  DEFAULT_BOOKING_FORM_CONFIG,
  normalizeBookingPublicFormConfig,
  type BookingPublicFormConfig,
  type SubTab,
} from '@/features/booking/constants/bookingPublicFormConfig'
import { UnsavedChangesProvider } from '@/contexts/UnsavedChangesContext'
import { BookingFormConfigPanel } from '../settings/BookingFormConfigPanel'

const MODE_ID = 'tavolo'
const CARD_ID_1 = 'card-aaaa-1111-1111-111111111111'
const CARD_ID_2 = 'card-bbbb-2222-2222-222222222222'
const CAROUSEL_ID = 'carousel-cccc-3333-3333-333333333333'

const restaurantSettingsData = vi.hoisted(() => ({
  booking_public_form_config: null as BookingPublicFormConfig | null,
  restaurant_name: 'Locale Test',
  booking_custom_staff_presets: [] as unknown[],
  booking_menu_promos: [] as unknown[],
}))

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), warn: vi.fn(), success: vi.fn() },
}))

vi.mock('@/config/settingsAutosave', () => ({
  SETTINGS_AUTOSAVE_ENABLED: false,
}))

vi.mock('@/contexts/TenantContext', () => ({
  useTenantContext: () => ({
    tenantId: 'tenant-test',
    organizationName: 'Org Test',
  }),
}))

vi.mock('@/features/booking/hooks/useRestaurantSetting', () => ({
  useRestaurantSetting: (key: string) => ({
    data: restaurantSettingsData[key as keyof typeof restaurantSettingsData] ?? null,
    isSuccess: true,
    isPending: false,
    error: null,
  }),
  useUpsertRestaurantSetting: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('@/features/booking/hooks/useMenuItems', () => ({
  useMenuItems: () => ({ data: [] }),
}))

vi.mock('@/features/booking/hooks/useMenuCategories', () => ({
  useMenuCategories: () => ({ data: [] }),
}))

vi.mock('@/features/booking/hooks/useDebouncedSettingsAutosave', () => ({
  useDebouncedSettingsAutosave: () => ({
    notifyFieldChange: vi.fn(),
    flushField: vi.fn(),
    cancelPending: vi.fn(),
    fieldStatus: {},
  }),
}))

vi.mock('@/features/booking/components/settings/BookingFormCarouselEditor', () => ({
  BookingFormCarouselEditor: () => <div data-testid="carousel-editor-stub" />,
}))

function makeCard(id: string, label: string): SubTab {
  return {
    id,
    display: 'cards',
    label,
    icon: 'fork_knife',
    hidden_category_keys: [],
    hidden_item_ids: [],
  }
}

function makeCarousel(id: string, label: string): SubTab {
  return {
    id,
    display: 'carousel',
    label,
    icon: 'fork_knife',
    carousel_items: [{ image_url: 'https://example.com/photo.webp', title: 'Slide 1', sort_order: 0 }],
  }
}

function makeConfig(presentation: 'cards' | 'carousel', subTabs: SubTab[]): BookingPublicFormConfig {
  return normalizeBookingPublicFormConfig({
    ...DEFAULT_BOOKING_FORM_CONFIG,
    booking_modes: DEFAULT_BOOKING_FORM_CONFIG.booking_modes.map((mode) =>
      mode.id === MODE_ID
        ? {
            ...mode,
            enabled: true,
            sub_tabs_enabled: true,
            sub_tabs_presentation: presentation,
            sub_tabs: subTabs,
          }
        : mode,
    ),
  })
}

function renderPanel(onDirtyChange = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return {
    onDirtyChange,
    ...render(
      <QueryClientProvider client={client}>
        <UnsavedChangesProvider>
          <BookingFormConfigPanel hideSaveUi onDirtyChange={onDirtyChange} />
        </UnsavedChangesProvider>
      </QueryClientProvider>,
    ),
  }
}

async function expandMode(user: ReturnType<typeof userEvent.setup>, modeId = MODE_ID) {
  const modeButton = document.querySelector(`[data-mode-id="${modeId}"]`)
  expect(modeButton).toBeTruthy()
  await user.click(modeButton as HTMLElement)
  await waitFor(() => {
    expect(screen.getByText(/abilita card o carosello/i)).toBeInTheDocument()
  })
}

function deleteButtonLabel(summary: string): RegExp {
  return new RegExp(`elimina ${summary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
}

describe('settings-form-config delete card/carosello', () => {
  const card1 = makeCard(CARD_ID_1, 'Pranzo domenicale')
  const card2 = makeCard(CARD_ID_2, 'Cena speciale')

  beforeEach(() => {
    restaurantSettingsData.booking_public_form_config = makeConfig('cards', [card1, card2])
  })

  it('mostra modale sulla riga collassata: annulla non rimuove, conferma alza dirty', async () => {
    const user = userEvent.setup()
    const onDirtyChange = vi.fn()
    renderPanel(onDirtyChange)

    await expandMode(user)
    await waitFor(() => {
      expect(screen.getByText(/pranzo domenicale · card 1/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: deleteButtonLabel('Pranzo domenicale · Card 1') }))

    const dialog = await screen.findByRole('dialog', { name: /eliminare card\/carosello/i })
    expect(within(dialog).getByText(/pranzo domenicale · card 1/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/salva modifiche/i)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /^annulla$/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /eliminare card\/carosello/i })).not.toBeInTheDocument()
    })
    expect(screen.getByText(/pranzo domenicale · card 1/i)).toBeInTheDocument()
    expect(onDirtyChange).not.toHaveBeenCalledWith(true)

    await user.click(screen.getByRole('button', { name: deleteButtonLabel('Pranzo domenicale · Card 1') }))
    const dialogAgain = await screen.findByRole('dialog', { name: /eliminare card\/carosello/i })
    await user.click(within(dialogAgain).getByRole('button', { name: /^elimina$/i }))

    await waitFor(() => {
      expect(screen.queryByText(/pranzo domenicale · card 1/i)).not.toBeInTheDocument()
      expect(screen.getByText(/cena speciale · card 1/i)).toBeInTheDocument()
    })
    expect(onDirtyChange).toHaveBeenCalledWith(true)
  })

  it('mostra modale dal cestino nell’editor (spostato in headerActions quando espanso)', async () => {
    const user = userEvent.setup()
    const onDirtyChange = vi.fn()
    renderPanel(onDirtyChange)

    await expandMode(user)
    await waitFor(() => {
      expect(screen.getByText(/cena speciale · card 2/i)).toBeInTheDocument()
    })

    await user.click(screen.getByText(/cena speciale · card 2/i))
    expect(screen.getByLabelText(/titolo card/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: deleteButtonLabel('Cena speciale · Card 2') })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: deleteButtonLabel('Cena speciale · Card 2') }))

    const dialog = await screen.findByRole('dialog', { name: /eliminare card\/carosello/i })
    expect(within(dialog).getByText(/cena speciale · card 2/i)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /^elimina$/i }))

    await waitFor(() => {
      expect(screen.queryByText(/cena speciale · card 2/i)).not.toBeInTheDocument()
      expect(screen.getByText(/pranzo domenicale · card 1/i)).toBeInTheDocument()
    })
    expect(onDirtyChange).toHaveBeenCalledWith(true)
  })

  it('copre anche il carosello sulla riga collassata', async () => {
    const carousel = makeCarousel(CAROUSEL_ID, 'Offerte estate')
    restaurantSettingsData.booking_public_form_config = makeConfig('carousel', [carousel])

    const user = userEvent.setup()
    const onDirtyChange = vi.fn()
    renderPanel(onDirtyChange)

    await expandMode(user)
    await waitFor(() => {
      expect(screen.getByText(/offerte estate/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: deleteButtonLabel('Offerte estate') }))

    const dialog = await screen.findByRole('dialog', { name: /eliminare card\/carosello/i })
    await user.click(within(dialog).getByRole('button', { name: /^elimina$/i }))

    await waitFor(() => {
      expect(screen.queryByText(/offerte estate/i)).not.toBeInTheDocument()
    })
    expect(onDirtyChange).toHaveBeenCalledWith(true)
  })
})
