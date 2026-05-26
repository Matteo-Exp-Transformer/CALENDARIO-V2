import React, { useEffect, useRef, useState } from 'react'
import { ForkKnifeIcon } from '@phosphor-icons/react/dist/csr/ForkKnife'
import { CallBellIcon } from '@phosphor-icons/react/dist/csr/CallBell'
import { ChefHatIcon } from '@phosphor-icons/react/dist/csr/ChefHat'
import { WineIcon } from '@phosphor-icons/react/dist/csr/Wine'
import { CoffeeIcon } from '@phosphor-icons/react/dist/csr/Coffee'
import { PizzaIcon } from '@phosphor-icons/react/dist/csr/Pizza'
import { HamburgerIcon } from '@phosphor-icons/react/dist/csr/Hamburger'
import { BowlSteamIcon } from '@phosphor-icons/react/dist/csr/BowlSteam'
import { CakeIcon } from '@phosphor-icons/react/dist/csr/Cake'
import { MartiniIcon } from '@phosphor-icons/react/dist/csr/Martini'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { LeafIcon } from '@phosphor-icons/react/dist/csr/Leaf'
import { CaretUpIcon } from '@phosphor-icons/react/dist/csr/CaretUp'
import { CaretDownIcon } from '@phosphor-icons/react/dist/csr/CaretDown'
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash'
import { EyeIcon } from '@phosphor-icons/react/dist/csr/Eye'
import { EyeSlashIcon } from '@phosphor-icons/react/dist/csr/EyeSlash'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'
import { useMenuItems } from '@/features/booking/hooks/useMenuItems'
import { useMenuCategories } from '@/features/booking/hooks/useMenuCategories'
import {
  CAROUSEL_SLIDE_TITLE_MAX,
  CarouselAddPhotoBlock,
} from '@/features/booking/components/MenuHomepageConfigPanel'
import type { CarouselItem } from '@/types/menu'
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'
import { useTenantContext } from '@/contexts/TenantContext'
import { useUnsavedChangesGuard } from '@/contexts/UnsavedChangesContext'
import {
  BOOKING_HEADER_FONT_OPTIONS,
  applyLegacySubTabLabelOverrides,
  DEFAULT_BOOKING_FORM_CONFIG,
  getBookingHeaderTextStyle,
  normalizeBookingHeaderColor,
  normalizeBookingPublicFormConfig,
  type BookingHeaderTextStyle,
  type BookingHeaderTextTarget,
  type BookingModeIcon,
  type BookingMode,
  type BookingPublicFormConfig,
  type SubTab,
  type SubTabIcon,
} from '@/features/booking/constants/bookingPublicFormConfig'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'
import { normalizeMenuItemBookingTypes, type MenuItem } from '@/types/menu'
import { toast } from 'react-toastify'
import {
  FormSectionFloatingActions,
  SectionActionBar,
  SettingsSaveFooter,
} from '@/features/booking/components/settings/SettingsSaveUi'

const ICON_OPTIONS: { value: BookingModeIcon; label: string }[] = [
  { value: 'utensils', label: 'Posate' },
  { value: 'cloche', label: 'Cloche' },
  { value: 'chef-hat', label: 'Chef' },
  { value: 'wine', label: 'Calice' },
  { value: 'coffee', label: 'Caffe' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'hamburger', label: 'Burger' },
  { value: 'bowl-steam', label: 'Piatto caldo' },
  { value: 'cake', label: 'Dolce' },
  { value: 'martini', label: 'Cocktail' },
]

const SUB_TAB_LABEL_MAX = 60
const SUB_TAB_DESCRIPTION_MAX = 80

const charCountClass = 'text-right text-[11px] text-slate-400 tabular-nums'

function AdminFieldWithCharCount({
  id,
  label,
  value,
  maxLength,
  onChange,
  placeholder,
  className,
}: {
  id?: string
  label: string
  value: string
  maxLength: number
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('w-full min-w-0 space-y-1.5', className)}>
      <Label htmlFor={id} className="block text-sm">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full"
      />
      <p className={charCountClass}>
        {value.length}/{maxLength}
      </p>
    </div>
  )
}

const SUB_TAB_ICON_OPTIONS: { value: SubTabIcon; label: string }[] = [
  { value: 'utensils', label: 'Posate' },
  { value: 'cloche', label: 'Cloche' },
  { value: 'chef-hat', label: 'Chef' },
  { value: 'star', label: 'Stella' },
  { value: 'leaf', label: 'Foglia' },
]

function ModeIcon({ icon, className }: { icon: BookingMode['icon']; className?: string }) {
  if (icon === 'utensils') return <ForkKnifeIcon weight="light" className={className} />
  if (icon === 'chef-hat') return <ChefHatIcon weight="light" className={className} />
  if (icon === 'wine') return <WineIcon weight="light" className={className} />
  if (icon === 'coffee') return <CoffeeIcon weight="light" className={className} />
  if (icon === 'pizza') return <PizzaIcon weight="light" className={className} />
  if (icon === 'hamburger') return <HamburgerIcon weight="light" className={className} />
  if (icon === 'bowl-steam') return <BowlSteamIcon weight="light" className={className} />
  if (icon === 'cake') return <CakeIcon weight="light" className={className} />
  if (icon === 'martini') return <MartiniIcon weight="light" className={className} />
  return <CallBellIcon weight="light" className={className} />
}

function SubTabIconOption({ icon, className }: { icon: SubTabIcon; className?: string }) {
  if (icon === 'utensils') return <ForkKnifeIcon weight="light" className={className} />
  if (icon === 'cloche') return <CallBellIcon weight="light" className={className} />
  if (icon === 'chef-hat') return <ChefHatIcon weight="light" className={className} />
  if (icon === 'star') return <StarIcon weight="light" className={className} />
  if (icon === 'leaf') return <LeafIcon weight="light" className={className} />
  return <ForkKnifeIcon weight="light" className={className} />
}

function newSubTab(display: SubTab['display']): SubTab {
  return {
    id: crypto.randomUUID(),
    display,
    label: display === 'carousel' ? 'Carosello' : 'Card scorrevole',
    icon: 'utensils',
    ...(display === 'cards'
      ? { hidden_category_keys: [], hidden_item_ids: [] }
      : {}),
  }
}

function bookingTypeUsesMenuItems(bookingType: BookingMode['booking_type'], items: MenuItem[]): boolean {
  return items.some((item) => normalizeMenuItemBookingTypes(item.booking_types).includes(bookingType))
}

function SubTabsDisplayHelpPanel() {
  const [open, setOpen] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      aria-expanded={open}
      className={cn(
        'flex w-full rounded-lg border border-blue-200 bg-blue-50 text-left text-blue-800',
        open
          ? 'items-start gap-2 px-4 py-3 text-sm'
          : 'items-center gap-2 px-3 py-2 text-sm font-semibold',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border border-blue-300 bg-white text-xs font-bold text-blue-700',
          open ? 'mt-0.5 h-5 w-5' : 'h-5 w-5',
        )}
      >
        ?
      </span>
      {!open ? (
        <span>Dettagli</span>
      ) : (
        <span className="min-w-0 space-y-2">
          <span className="block font-medium">Scegli se mostrare:</span>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Card scorrevole, per descrivere offerte al cliente</li>
            <li>Carosello, per mostrare immagini con testo ai clienti</li>
          </ul>
        </span>
      )}
    </button>
  )
}

const SUB_TAB_ADD_BUTTON_CLASS =
  'min-w-0 w-full bg-primary-50 px-2 py-1.5 text-xs leading-tight hover:bg-primary-100 active:bg-primary-100/90 sm:min-h-11 sm:px-3 sm:py-2 sm:text-sm md:min-h-[3.125rem] md:px-3 md:py-2.5 md:text-sm'

function SubTabAddButtons({
  onAddCards,
  onAddCarousel,
}: {
  onAddCards: () => void
  onAddCarousel: () => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddCards}
        className={SUB_TAB_ADD_BUTTON_CLASS}
      >
        + Card scorrevole
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddCarousel}
        className={SUB_TAB_ADD_BUTTON_CLASS}
      >
        + Carosello
      </Button>
    </div>
  )
}

type BookingFormConfigPanelProps = {
  /** Es. sezione «Sfondo pagina Prenota» subito sotto le modalità. */
  afterBookingModesSection?: React.ReactNode
  /** Sfondo pagina Prenota: modifiche non ancora su DB. */
  bookingBgDirty?: boolean
  onSaveBookingBackground?: () => void | Promise<void>
  onCancelBookingBackground?: () => void
}

export { FormSectionFloatingActions } from '@/features/booking/components/settings/SettingsSaveUi'

export const BookingFormConfigPanel: React.FC<BookingFormConfigPanelProps> = ({
  afterBookingModesSection,
  bookingBgDirty = false,
  onSaveBookingBackground,
  onCancelBookingBackground,
}) => {
  const { organizationName, tenantId } = useTenantContext()
  const { registerUnsavedSource, clearUnsavedSource } = useUnsavedChangesGuard()
  const { data: savedConfig } = useRestaurantSetting('booking_public_form_config')
  const { data: restaurantName } = useRestaurantSetting('restaurant_name')
  const { data: customPresetsRaw } = useRestaurantSetting('booking_custom_staff_presets')
  const { data: menuItems = [] } = useMenuItems()
  const { data: menuCategories = [] } = useMenuCategories()
  const upsert = useUpsertRestaurantSetting()

  const displayRestaurantName =
    (typeof restaurantName === 'string' ? restaurantName.trim() : '') ||
    organizationName?.trim() ||
    ''

  const [config, setConfig] = useState<BookingPublicFormConfig>(DEFAULT_BOOKING_FORM_CONFIG)
  const [headerDirty, setHeaderDirty] = useState(false)
  const [modesDirty, setModesDirty] = useState(false)
  const headerDirtyRef = useRef(false)
  const modesDirtyRef = useRef(false)
  headerDirtyRef.current = headerDirty
  modesDirtyRef.current = modesDirty
  const formConfigDirty = headerDirty || modesDirty
  const [expandedMode, setExpandedMode] = useState<string | null>(null)
  const [draftSubTabsByMode, setDraftSubTabsByMode] = useState<Record<string, SubTab | null>>({})
  const [expandedSubTabByMode, setExpandedSubTabByMode] = useState<Record<string, string | null>>({})
  /** Titolo slide digitato prima della prima foto (poi applicato al primo item). */
  const pendingSlideTitleByTabRef = useRef<Record<string, string>>({})

  const allPresets: CustomStaffPreset[] = Array.isArray(customPresetsRaw) ? customPresetsRaw : []

  const withMergedSubTabLabels = (cfg: BookingPublicFormConfig): BookingPublicFormConfig => ({
    ...cfg,
    booking_modes: cfg.booking_modes.map((m) => ({
      ...m,
      sub_tabs: applyLegacySubTabLabelOverrides(
        m.sub_tabs ?? [],
        m.sub_tabs_overrides,
        allPresets,
      ),
    })),
  })

  useEffect(() => {
    if (savedConfig && !headerDirty && !modesDirty) {
      setConfig(withMergedSubTabLabels(savedConfig))
    }
  }, [savedConfig, headerDirty, modesDirty, customPresetsRaw])

  useEffect(() => {
    registerUnsavedSource('booking-form-config', 'Personalizza form', formConfigDirty)
    return () => {
      if (!headerDirtyRef.current && !modesDirtyRef.current) {
        clearUnsavedSource('booking-form-config')
      }
    }
  }, [clearUnsavedSource, formConfigDirty, registerUnsavedSource])

  const markHeaderDirty = () => setHeaderDirty(true)
  const markModesDirty = () => setModesDirty(true)

  const getSavedBaseline = () => savedConfig ?? DEFAULT_BOOKING_FORM_CONFIG

  const updateField = (
    field: keyof Pick<BookingPublicFormConfig, 'page_title' | 'page_description'>,
    value: string,
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    markHeaderDirty()
  }

  const updateHeaderTextStyle = (
    target: BookingHeaderTextTarget,
    patch: Partial<BookingHeaderTextStyle>,
  ) => {
    setConfig((prev) => {
      const currentStyles = prev.header_styles ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles
      const currentTarget = currentStyles[target] ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles[target]
      return {
        ...prev,
        header_styles: {
          ...currentStyles,
          [target]: {
            ...currentTarget,
            ...patch,
            color: patch.color
              ? normalizeBookingHeaderColor(patch.color, currentTarget.color)
              : currentTarget.color,
          },
        },
      }
    })
    markHeaderDirty()
  }

  const updateMode = (modeId: string, patch: Partial<BookingMode>) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => (m.id === modeId ? { ...m, ...patch } : m)),
    }))
    markModesDirty()
  }

  const updateSubTab = (modeId: string, subTabId: string, patch: Partial<SubTab>) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => {
        if (m.id !== modeId) return m
        return {
          ...m,
          sub_tabs: (m.sub_tabs ?? []).map((t) => (t.id === subTabId ? { ...t, ...patch } : t)),
        }
      }),
    }))
    markModesDirty()
  }

  const addSubTab = (modeId: string, display: SubTab['display']) => {
    setDraftSubTabsByMode((prev) => ({ ...prev, [modeId]: newSubTab(display) }))
  }

  const updateDraftSubTab = (modeId: string, patch: Partial<SubTab>) => {
    setDraftSubTabsByMode((prev) => {
      const current = prev[modeId]
      if (!current) return prev
      return { ...prev, [modeId]: { ...current, ...patch } }
    })
  }

  const cancelDraftSubTab = (modeId: string) => {
    setDraftSubTabsByMode((prev) => ({ ...prev, [modeId]: null }))
  }

  const shouldKeepSubTabLabelOnPresetImport = (
    current: SubTab | undefined,
    nextPreset: CustomStaffPreset,
  ): string | undefined => {
    const customized = current?.label?.trim()
    if (!customized) return undefined
    const previousPresetName = current?.preset_id
      ? allPresets.find((p) => p.id === current.preset_id)?.name?.trim()
      : undefined
    if (previousPresetName && customized !== previousPresetName) return customized
    if (!previousPresetName && customized !== nextPreset.name.trim()) return customized
    return undefined
  }

  const importPresetIntoSubTab = (modeId: string, subTabId: string, presetId: string) => {
    const preset = allPresets.find((p) => p.id === presetId)
    if (!preset) return
    const current = config.booking_modes
      .find((m) => m.id === modeId)
      ?.sub_tabs?.find((t) => t.id === subTabId)
    const keepLabel = shouldKeepSubTabLabelOnPresetImport(current, preset)
    updateSubTab(modeId, subTabId, {
      preset_id: preset.id,
      label: keepLabel ?? preset.name,
      description: preset.description?.trim() || undefined,
      price_per_person: preset.price_per_person && preset.price_per_person > 0 ? preset.price_per_person : undefined,
      hidden_item_ids: menuItems
        .filter((item) => !preset.item_ids.includes(item.id))
        .map((item) => item.id),
      hidden_category_keys: [],
    })
  }

  const importPresetIntoDraftSubTab = (modeId: string, presetId: string) => {
    const preset = allPresets.find((p) => p.id === presetId)
    if (!preset) return
    const current = draftSubTabsByMode[modeId] ?? undefined
    const keepLabel = shouldKeepSubTabLabelOnPresetImport(current, preset)
    updateDraftSubTab(modeId, {
      preset_id: preset.id,
      label: keepLabel ?? preset.name,
      description: preset.description?.trim() || undefined,
      price_per_person: preset.price_per_person && preset.price_per_person > 0 ? preset.price_per_person : undefined,
      hidden_item_ids: menuItems
        .filter((item) => !preset.item_ids.includes(item.id))
        .map((item) => item.id),
      hidden_category_keys: [],
    })
  }

  const removeSubTab = (modeId: string, subTabId: string) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => {
        if (m.id !== modeId) return m
        return { ...m, sub_tabs: (m.sub_tabs ?? []).filter((t) => t.id !== subTabId) }
      }),
    }))
    markModesDirty()
  }

  const moveSubTab = (modeId: string, subTabId: string, direction: 'up' | 'down') => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => {
        if (m.id !== modeId) return m
        const tabs = [...(m.sub_tabs ?? [])]
        const idx = tabs.findIndex((t) => t.id === subTabId)
        if (idx < 0) return m
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= tabs.length) return m
        ;[tabs[idx], tabs[swapIdx]] = [tabs[swapIdx], tabs[idx]]
        return { ...m, sub_tabs: tabs }
      }),
    }))
    markModesDirty()
  }

  const mergeConfigAfterPartialSave = (
    normalized: BookingPublicFormConfig,
    savedPart: 'header' | 'modes',
  ) => {
    setConfig((prev) => {
      if (savedPart === 'header' && modesDirty) {
        return { ...normalized, booking_modes: prev.booking_modes }
      }
      if (savedPart === 'modes' && headerDirty) {
        return {
          ...normalized,
          page_title: prev.page_title,
          page_description: prev.page_description,
          header_styles: prev.header_styles,
        }
      }
      return normalized
    })
  }

  const saveHeaderSection = async () => {
    const saved = getSavedBaseline()
    const normalized = normalizeBookingPublicFormConfig({
      ...saved,
      page_title: config.page_title,
      page_description: config.page_description,
      header_styles: config.header_styles,
    })
    await upsert.mutateAsync([{ key: 'booking_public_form_config', value: normalized }])
    mergeConfigAfterPartialSave(normalized, 'header')
    setHeaderDirty(false)
  }

  const persistModesSection = async (bookingModes: BookingPublicFormConfig['booking_modes']) => {
    const saved = getSavedBaseline()
    const modesForDb = bookingModes.map((m) => ({
      ...m,
      sub_tabs_overrides: undefined,
    }))
    const normalized = normalizeBookingPublicFormConfig({
      ...saved,
      booking_modes: modesForDb,
    })
    await upsert.mutateAsync([{ key: 'booking_public_form_config', value: normalized }])
    mergeConfigAfterPartialSave(normalized, 'modes')
    setModesDirty(false)
  }

  const saveModesSection = async () => {
    await persistModesSection(config.booking_modes)
  }

  /** Salva su DB le modalità (incl. sottotab appena modificate) e chiude l'editor — niente secondo Salva sulla card. */
  const commitSubTabEditor = async (modeId: string, isDraft: boolean) => {
    let bookingModes = config.booking_modes
    if (isDraft) {
      const draft = draftSubTabsByMode[modeId]
      if (!draft) return
      bookingModes = config.booking_modes.map((m) =>
        m.id === modeId ? { ...m, sub_tabs: [...(m.sub_tabs ?? []), draft] } : m,
      )
      setDraftSubTabsByMode((prev) => ({ ...prev, [modeId]: null }))
      setConfig((prev) => ({ ...prev, booking_modes: bookingModes }))
    }
    setExpandedSubTabByMode((prev) => ({ ...prev, [modeId]: null }))
    try {
      await persistModesSection(bookingModes)
    } catch {
      markModesDirty()
      toast.error('Errore nel salvataggio sottotab')
    }
  }

  const handleCancelHeaderSection = () => {
    const baseline = getSavedBaseline()
    setConfig((prev) => ({
      ...prev,
      page_title: baseline.page_title,
      page_description: baseline.page_description,
      header_styles: baseline.header_styles,
    }))
    setHeaderDirty(false)
  }

  const handleCancelModesSection = () => {
    const baseline = getSavedBaseline()
    setConfig((prev) => ({
      ...prev,
      booking_modes: withMergedSubTabLabels(baseline).booking_modes,
    }))
    setDraftSubTabsByMode({})
    setExpandedSubTabByMode({})
    setModesDirty(false)
  }

  const handleCancelFormChanges = () => {
    const baseline = getSavedBaseline()
    if (headerDirty && modesDirty) {
      setConfig(baseline)
    } else if (headerDirty) {
      setConfig((prev) => ({
        ...prev,
        page_title: baseline.page_title,
        page_description: baseline.page_description,
        header_styles: baseline.header_styles,
      }))
    } else if (modesDirty) {
      setConfig((prev) => ({ ...prev, booking_modes: baseline.booking_modes }))
    }
    setDraftSubTabsByMode({})
    setExpandedSubTabByMode({})
    setHeaderDirty(false)
    setModesDirty(false)
  }

  const pageHasUnsaved = formConfigDirty || bookingBgDirty

  const handleSaveAllPage = async () => {
    try {
      if (headerDirty) await saveHeaderSection()
      if (modesDirty) await saveModesSection()
      if (bookingBgDirty && onSaveBookingBackground) await onSaveBookingBackground()
    } catch {
      toast.error('Errore nel salvataggio')
    }
  }

  const handleCancelAllPage = () => {
    handleCancelFormChanges()
    onCancelBookingBackground?.()
  }

  const headerStyles = config.header_styles ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles

  const getSubTabEditorTitle = (tab: SubTab, number: number, isDraft: boolean) => {
    if (tab.display === 'carousel') return `Carosello ${number}`
    if (isDraft) return `Nuova Card ${number}`
    return `Card ${number}`
  }
  const headerControlClass =
    'rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300'

  const renderHeaderStyleControls = (target: BookingHeaderTextTarget) => {
    const style = headerStyles[target] ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles[target]
    return (
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_3rem] gap-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-slate-500">Font</span>
          <select
            value={style.font}
            onChange={(e) =>
              updateHeaderTextStyle(target, {
                font: e.target.value as BookingHeaderTextStyle['font'],
              })
            }
            className={headerControlClass}
          >
            {BOOKING_HEADER_FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-slate-500">Colore</span>
          <input
            type="color"
            value={style.color}
            onChange={(e) => updateHeaderTextStyle(target, { color: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
          />
        </label>
      </div>
    )
  }

  const headerSectionActions = (
    <SectionActionBar
      onCancel={handleCancelHeaderSection}
      onSave={() => {
        void saveHeaderSection().catch(() => toast.error('Errore nel salvataggio intestazione'))
      }}
      cancelDisabled={!headerDirty}
      saveDisabled={!headerDirty}
      pending={upsert.isPending}
    />
  )

  const modesSectionActions = (
    <SectionActionBar
      onCancel={handleCancelModesSection}
      onSave={() => {
        void saveModesSection().catch(() => toast.error('Errore nel salvataggio modalità'))
      }}
      cancelDisabled={!modesDirty}
      saveDisabled={!modesDirty}
      pending={upsert.isPending}
    />
  )

  const backgroundSectionActions =
    onSaveBookingBackground != null && onCancelBookingBackground != null ? (
      <SectionActionBar
        onCancel={onCancelBookingBackground}
        onSave={() => {
          void Promise.resolve(onSaveBookingBackground()).catch(() =>
            toast.error('Errore nel salvataggio sfondo'),
          )
        }}
        cancelDisabled={!bookingBgDirty}
        saveDisabled={!bookingBgDirty}
        pending={upsert.isPending}
      />
    ) : null

  const renderSubTabEditor = ({
    mode,
    tab,
    relevantPresets,
    subTabNumber,
    isDraft,
    headerActions,
  }: {
    mode: BookingMode
    tab: SubTab
    relevantPresets: CustomStaffPreset[]
    subTabNumber: number
    isDraft: boolean
    headerActions?: React.ReactNode
  }) => {
    const patchTab = (patch: Partial<SubTab>) => {
      if (isDraft) updateDraftSubTab(mode.id, patch)
      else updateSubTab(mode.id, tab.id, patch)
    }
    const toggleCategory = (categoryKey: string) => {
      const hidden = new Set(tab.hidden_category_keys ?? [])
      if (hidden.has(categoryKey)) hidden.delete(categoryKey)
      else hidden.add(categoryKey)
      patchTab({ hidden_category_keys: Array.from(hidden) })
    }
    const toggleItem = (itemId: string) => {
      const hidden = new Set(tab.hidden_item_ids ?? [])
      if (hidden.has(itemId)) hidden.delete(itemId)
      else hidden.add(itemId)
      patchTab({ hidden_item_ids: Array.from(hidden) })
    }

    const editorTitle = getSubTabEditorTitle(tab, subTabNumber, isDraft)

    return (
      <div className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/50 p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-600 uppercase">{editorTitle}</span>
          {headerActions ??
            (!isDraft ? (
              <button
                type="button"
                title="Elimina"
                onClick={() => removeSubTab(mode.id, tab.id)}
                className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"
              >
                <TrashIcon weight="regular" className="h-4 w-4" />
              </button>
            ) : null)}
        </div>

        <AdminFieldWithCharCount
          label="Etichetta card"
          value={tab.label}
          maxLength={SUB_TAB_LABEL_MAX}
          onChange={(label) => patchTab({ label })}
          placeholder="Nome mostrato al cliente"
        />

        {tab.display === 'carousel' && (
          <AdminFieldWithCharCount
            label="Titolo slide"
            value={
              tab.carousel_items?.[0]?.title ??
              pendingSlideTitleByTabRef.current[tab.id] ??
              ''
            }
            maxLength={CAROUSEL_SLIDE_TITLE_MAX}
            onChange={(title) => {
              const clipped = title.slice(0, CAROUSEL_SLIDE_TITLE_MAX)
              const items = tab.carousel_items ?? []
              if (items.length === 0) {
                pendingSlideTitleByTabRef.current[tab.id] = clipped
                return
              }
              delete pendingSlideTitleByTabRef.current[tab.id]
              const next: CarouselItem[] = items.map((it, i) =>
                i === 0 ? { ...it, title: clipped || undefined } : it,
              )
              patchTab({ carousel_items: next })
            }}
            placeholder="es. Tonno in crosta"
          />
        )}

        {tab.display === 'carousel' && tenantId && (
          <CarouselAddPhotoBlock
            tenantId={tenantId}
            menuQrCodeId={null}
            draftShortCode={`booking-form-${mode.id}-${tab.id}`}
            items={tab.carousel_items ?? []}
            onChange={(items) => {
              const pending = pendingSlideTitleByTabRef.current[tab.id]?.trim()
              let next = items
              if (pending && items.length > 0 && !items[0].title?.trim()) {
                next = items.map((it, i) =>
                  i === 0 ? { ...it, title: pending } : it,
                )
                delete pendingSlideTitleByTabRef.current[tab.id]
              }
              patchTab({ carousel_items: next })
            }}
          />
        )}

        <div className="w-full min-w-0 space-y-1.5">
          <Label className="block text-sm">Icona</Label>
          <div className="flex flex-wrap gap-2">
            {SUB_TAB_ICON_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => patchTab({ icon: opt.value })}
                className={cn(
                  'flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
                  tab.icon === opt.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600',
                )}
              >
                <SubTabIconOption icon={opt.value} className="h-3 w-3" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {tab.display === 'cards' && (
          <div className="w-full min-w-0 space-y-1.5">
            <Label className="block text-sm">Importa menù preselezionato</Label>
            {relevantPresets.length > 0 ? (
              <select
                value={tab.preset_id ?? ''}
                onChange={(e) => {
                  const presetId = e.target.value
                  if (presetId) {
                    if (isDraft) importPresetIntoDraftSubTab(mode.id, presetId)
                    else importPresetIntoSubTab(mode.id, tab.id, presetId)
                  } else {
                    patchTab({
                      preset_id: undefined,
                      hidden_category_keys: [],
                      hidden_item_ids: [],
                    })
                  }
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Compila manualmente</option>
                {relevantPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-slate-500">
                Nessun menù preselezionato per questa modalità (tab Menu in admin).
              </p>
            )}
          </div>
        )}

        <div className="w-full min-w-0 space-y-1.5">
          <Label className="block text-sm">Prezzo a persona (opzionale)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={tab.price_per_person ?? ''}
            onChange={(e) => {
              const v = e.target.value
              patchTab({
                price_per_person: v === '' ? undefined : Math.max(0, parseFloat(v) || 0),
              })
            }}
            placeholder="es. 45"
            className="w-full max-w-xs"
          />
        </div>

        <AdminFieldWithCharCount
          label="Descrizione breve (opzionale)"
          value={tab.description ?? ''}
          maxLength={SUB_TAB_DESCRIPTION_MAX}
          onChange={(description) =>
            patchTab({
              description: description === '' ? undefined : description,
            })
          }
          placeholder="Sottotitolo sulla card"
        />

        {tab.display === 'cards' &&
          tab.preset_id &&
          bookingTypeUsesMenuItems(mode.booking_type, menuItems) && (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Categorie e ingredienti visibili
            </p>
            <div className="space-y-2">
              {menuCategories.map((cat) => {
                const itemsForCat = menuItems.filter(
                  (item) =>
                    item.category === cat.key &&
                    normalizeMenuItemBookingTypes(item.booking_types).includes(mode.booking_type),
                )
                if (itemsForCat.length === 0) return null
                const catHidden = (tab.hidden_category_keys ?? []).includes(cat.key)
                return (
                  <details key={cat.key} className="rounded-lg border border-slate-200 bg-slate-50">
                    <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2">
                      <button
                        type="button"
                        aria-label={catHidden ? `Mostra ${cat.label}` : `Nascondi ${cat.label}`}
                        onClick={(e) => {
                          e.preventDefault()
                          toggleCategory(cat.key)
                        }}
                        className={cn(
                          'rounded-md border p-1.5',
                          catHidden
                            ? 'border-slate-300 text-slate-400'
                            : 'border-primary-200 bg-primary-50 text-primary-700',
                        )}
                      >
                        {catHidden ? (
                          <EyeSlashIcon weight="regular" className="h-4 w-4" />
                        ) : (
                          <EyeIcon weight="regular" className="h-4 w-4" />
                        )}
                      </button>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
                        {cat.label}
                      </span>
                      <span className="text-xs text-slate-500">{itemsForCat.length}</span>
                    </summary>
                    {!catHidden && (
                      <div className="grid grid-cols-1 gap-1 border-t border-slate-200 p-2 sm:grid-cols-2">
                        {itemsForCat.map((item) => {
                          const hidden = (tab.hidden_item_ids ?? []).includes(item.id)
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleItem(item.id)}
                              className={cn(
                                'flex min-w-0 items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs',
                                hidden
                                  ? 'border-slate-200 bg-slate-100 text-slate-400'
                                  : 'border-slate-200 bg-white text-slate-700',
                              )}
                            >
                              {hidden ? (
                                <EyeSlashIcon weight="regular" className="h-3.5 w-3.5 shrink-0" />
                              ) : (
                                <EyeIcon weight="regular" className="h-3.5 w-3.5 shrink-0" />
                              )}
                              <span className="min-w-0 truncate">{item.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </details>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {isDraft && (
            <Button type="button" variant="ghost" size="sm" onClick={() => cancelDraftSubTab(mode.id)}>
              Annulla
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            disabled={upsert.isPending}
            onClick={() => void commitSubTabEditor(mode.id, isDraft)}
          >
            Salva
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Blocco 1 — Intestazione pagina */}
      <FormSectionFloatingActions actions={headerSectionActions}>
        <section className="admin-warm-surface rounded-xl border p-5 space-y-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800">Intestazione pagina Prenota</h3>
          <div className="space-y-3">
          <div>
            <Label htmlFor="page_restaurant_name" className="block mb-1 text-sm">
              Nome azienda
            </Label>
            <Input
              id="page_restaurant_name"
              value={displayRestaurantName || '—'}
              readOnly
              disabled
              className="min-h-[3.25rem] cursor-default bg-slate-50/90 py-3 font-bold leading-tight text-slate-800 disabled:opacity-100 sm:min-h-[3rem] sm:py-2.5"
              style={getBookingHeaderTextStyle('restaurant_name', headerStyles)}
              aria-describedby="page_restaurant_name_hint"
            />
            <p id="page_restaurant_name_hint" className="mt-1 text-xs text-slate-500">
              Per modificare nome azienda usa la scheda{' '}
              <span className="font-medium text-slate-700">&quot;Anagrafica Azienda&quot;</span> nelle
              Impostazioni.
            </p>
            {renderHeaderStyleControls('restaurant_name')}
          </div>
          <div>
            <Label htmlFor="page_title" className="block mb-1 text-sm">Titolo</Label>
            <Input
              id="page_title"
              value={config.page_title}
              onChange={(e) => updateField('page_title', e.target.value)}
              placeholder="es. Richiesta Prenotazione"
              maxLength={80}
              className="min-h-[3rem] py-3 font-bold leading-tight sm:min-h-[2.625rem] sm:py-2.5"
              style={getBookingHeaderTextStyle('page_title', headerStyles)}
            />
            {renderHeaderStyleControls('page_title')}
          </div>
          <div>
            <Label htmlFor="page_description" className="block mb-1 text-sm">Descrizione</Label>
            <textarea
              id="page_description"
              value={config.page_description}
              onChange={(e) => updateField('page_description', e.target.value)}
              placeholder="Breve descrizione mostrata sotto il titolo"
              maxLength={300}
              rows={3}
              className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:py-2.5"
              style={getBookingHeaderTextStyle('page_description', headerStyles)}
            />
            {renderHeaderStyleControls('page_description')}
          </div>
        </div>
      </section>
      </FormSectionFloatingActions>

      {/* Blocco 2 — Le modalità */}
      <FormSectionFloatingActions actions={modesSectionActions}>
      <section className="admin-warm-surface rounded-xl border p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-800">Modalità di prenotazione</h3>
          <p className="text-sm text-slate-600">
            Scegli quali modalità di prenotazioni sono disponibili, e cosa mostrano.
          </p>
        </div>
        <div className="space-y-3">
          {config.booking_modes.map((mode) => {
            const isOpen = expandedMode === mode.id

            const relevantPresets = allPresets.filter(
              (p) =>
                p.visible_on_booking !== false &&
                Array.isArray(p.booking_types) &&
                (p.booking_types as string[]).includes(mode.booking_type),
            )

            const subTabs = mode.sub_tabs ?? []
            const draftSubTab = draftSubTabsByMode[mode.id] ?? null
            const expandedSubTabId = expandedSubTabByMode[mode.id] ?? null

            return (
              <div key={mode.id} className="rounded-lg border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedMode(isOpen ? null : mode.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center',
                        mode.enabled ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-400',
                      )}
                    >
                      <ModeIcon icon={mode.icon} className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{mode.label}</span>
                    {!mode.enabled && (
                      <span className="text-xs text-slate-400 font-normal">(disabilitata)</span>
                    )}
                  </div>
                  <span className="text-slate-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="px-4 py-4 space-y-4 border-t border-slate-200 bg-white">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`mode-enabled-${mode.id}`}
                        checked={mode.enabled}
                        onChange={(e) => updateMode(mode.id, { enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`mode-enabled-${mode.id}`} className="text-sm font-medium text-slate-700">
                        Modalità attiva
                      </label>
                    </div>

                    <div>
                      <Label htmlFor={`mode-label-${mode.id}`} className="block mb-1 text-sm">Titolo Card</Label>
                      <Input
                        id={`mode-label-${mode.id}`}
                        value={mode.label}
                        onChange={(e) => updateMode(mode.id, { label: e.target.value })}
                        maxLength={60}
                        placeholder="Nome della modalità"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`mode-desc-${mode.id}`} className="block mb-1 text-sm">Descrizione breve</Label>
                      <Input
                        id={`mode-desc-${mode.id}`}
                        value={mode.description}
                        onChange={(e) => updateMode(mode.id, { description: e.target.value })}
                        maxLength={120}
                        placeholder="Una riga descrittiva"
                      />
                    </div>

                    <div>
                      <Label className="block mb-1 text-sm">Icona</Label>
                      <div className="flex gap-2 flex-wrap">
                        {ICON_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateMode(mode.id, { icon: opt.value })}
                            className={cn(
                              'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
                              mode.icon === opt.value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300',
                            )}
                          >
                            <ModeIcon icon={opt.value} className="h-3.5 w-3.5" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <span className="text-sm font-medium text-slate-700">
                        Abilita Card o Carosello
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={mode.sub_tabs_enabled}
                        onClick={() => {
                          const nextEnabled = !mode.sub_tabs_enabled
                          if (!nextEnabled) {
                            cancelDraftSubTab(mode.id)
                            setExpandedSubTabByMode((prev) => ({ ...prev, [mode.id]: null }))
                          }
                          updateMode(mode.id, { sub_tabs_enabled: nextEnabled })
                        }}
                        className={cn(
                          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400',
                          mode.sub_tabs_enabled
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-slate-300 bg-slate-200',
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
                            mode.sub_tabs_enabled ? 'translate-x-5' : 'translate-x-1',
                          )}
                        />
                      </button>
                    </div>

                    <div className="-mt-2">
                      <SubTabsDisplayHelpPanel />
                    </div>

                    {mode.sub_tabs_enabled && (
                      <div className="mt-5 space-y-3">
                        <SubTabAddButtons
                          onAddCards={() => addSubTab(mode.id, 'cards')}
                          onAddCarousel={() => addSubTab(mode.id, 'carousel')}
                        />

                        {draftSubTab && (
                          <div className="w-full min-w-0">
                            {renderSubTabEditor({
                              mode,
                              tab: draftSubTab,
                              relevantPresets,
                              subTabNumber: subTabs.length + 1,
                              isDraft: true,
                            })}
                          </div>
                        )}

                        {subTabs.length === 0 && !draftSubTab ? (
                          <p className="text-xs text-slate-500">
                            Nessuna sottotab: aggiungine almeno una o disattiva l&apos;opzione sopra.
                          </p>
                        ) : (
                          <div className="w-full min-w-0 space-y-3">
                            {subTabs.map((tab, tabIdx) => {
                              const savedOpen = expandedSubTabId === tab.id
                              if (!savedOpen) {
                                return (
                                  <div
                                    key={tab.id}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedSubTabByMode((prev) => ({ ...prev, [mode.id]: tab.id }))
                                      }
                                      className="flex w-full min-w-0 items-center justify-between gap-3 text-left"
                                    >
                                      <span className="min-w-0">
                                        <span className="block text-xs font-semibold uppercase text-slate-500">
                                          {getSubTabEditorTitle(tab, tabIdx + 1, false)}
                                        </span>
                                        <span className="block truncate text-sm font-semibold text-slate-800">
                                          {tab.label || 'Senza etichetta'}
                                        </span>
                                      </span>
                                      <span className="shrink-0 text-xs font-semibold text-primary-700">
                                        Modifica
                                      </span>
                                    </button>
                                  </div>
                                )
                              }
                              return (
                                <div key={tab.id} className="w-full min-w-0">
                                  {renderSubTabEditor({
                                    mode,
                                    tab,
                                    relevantPresets,
                                    subTabNumber: tabIdx + 1,
                                    isDraft: false,
                                    headerActions: (
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          title="Sposta su"
                                          disabled={tabIdx === 0}
                                          onClick={() => moveSubTab(mode.id, tab.id, 'up')}
                                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40"
                                        >
                                          <CaretUpIcon weight="regular" className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Sposta giù"
                                          disabled={tabIdx === subTabs.length - 1}
                                          onClick={() => moveSubTab(mode.id, tab.id, 'down')}
                                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40"
                                        >
                                          <CaretDownIcon weight="regular" className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Elimina"
                                          onClick={() => removeSubTab(mode.id, tab.id)}
                                          className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"
                                        >
                                          <TrashIcon weight="regular" className="h-4 w-4" />
                                        </button>
                                      </div>
                                    ),
                                  })}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
      </FormSectionFloatingActions>

      {afterBookingModesSection != null && (
        <FormSectionFloatingActions actions={backgroundSectionActions}>
          {afterBookingModesSection}
        </FormSectionFloatingActions>
      )}

      {pageHasUnsaved && (
        <SettingsSaveFooter
          onCancel={handleCancelAllPage}
          onSave={() => void handleSaveAllPage()}
          pending={upsert.isPending}
          cancelDisabled={upsert.isPending}
          saveDisabled={upsert.isPending}
        />
      )}
    </div>
  )
}
