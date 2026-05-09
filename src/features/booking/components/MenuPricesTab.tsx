import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'react-toastify'
import { ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { Button, CollapsibleCard, Input, Textarea } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '../hooks/useMenuItems'
import {
  useCreateMenuCategory,
  useDeleteMenuCategory,
  useMenuCategories,
  useUpdateMenuCategory
} from '../hooks/useMenuCategories'
import { normalizeMenuItemBookingTypes, type MenuItem, type MenuItemInput } from '@/types/menu'
import type { SelectedMenuItem } from '@/types/menu'
import type { BookingType } from '@/types/booking'
import { type CustomStaffPreset, isStaffPresetVisibleOnBooking } from '../constants/presetMenus'
import { useRestaurantSetting, useUpsertRestaurantSetting } from '../hooks/useRestaurantSetting'
import { selectedItemsFromMenuItemIds } from '../utils/buildPresetMenuSelection'
import { PresetMenuBuilder } from './PresetMenuBuilder'
import {
  DEFAULT_VOL_AU_VENT_PROMO_MESSAGE,
  VOL_AU_VENT_PROMO_BOOKING_TYPE_OPTIONS,
  VOL_AU_VENT_PROMO_PLACEHOLDER,
  type VolAuVentPromo,
  isVolAuVentPromoVisibleOnBooking,
} from '../constants/volAuVentPromo'
import { cn } from '@/lib/utils'
import { adminBlueCtaSurfaceClass } from '@/lib/adminBlueCtaClass'

/** Fascia lista categorie: griglia 2 colonne da sm — classi Tailwind qui (STYLING_AGENT_CONTEXT §4). */
const menuPricesCategoryListWrapClass = cn(
  'menu-prices-category-list-wrap grid grid-cols-1 items-start gap-[28px] sm:grid-cols-2'
)

const menuPricesHeaderCtaButtonClass = cn(
  adminBlueCtaSurfaceClass,
  'h-9 min-h-9 w-full shrink-0 gap-1.5 min-w-0'
)

function bookingTypeLabelsJoined(types: BookingType[]): string {
  return types
    .map((t) => VOL_AU_VENT_PROMO_BOOKING_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t)
    .join(', ')
}

function promoMessageSummary(message: string): string {
  const line = message.trim().split(/\n/)[0] ?? ''
  if (!line) return 'Promo senza testo'
  return line.length > 72 ? `${line.slice(0, 72)}…` : line
}

type StaffPresetsVisibilityIconButtonProps = {
  visible: boolean
  disabled: boolean
  onToggle: () => void
  /** `volPromo`: testi per singola riga promo (non preset staff). */
  variant?: 'staffPresets' | 'volPromo'
}

/** Occhio tra Modifica ed Elimina nella lista menù preselezionati — stessa hit-area degli altri `.menu-prices-icon-btn`. */
function StaffPresetsVisibilityIconButton({
  visible,
  disabled,
  onToggle,
  variant = 'staffPresets',
}: StaffPresetsVisibilityIconButtonProps) {
  const title =
    variant === 'volPromo'
      ? visible
        ? 'Promo visibile in Prenota: clic per nascondere'
        : 'Promo nascosta in Prenota: clic per mostrare'
      : visible
        ? 'Visibili nella pagina Prenota: clic per nascondere'
        : 'Nascosti nella pagina Prenota: clic per mostrare'
  const ariaLabel =
    variant === 'volPromo'
      ? visible
        ? 'Nascondi questa promo nella pagina Prenota'
        : 'Mostra questa promo nella pagina Prenota'
      : visible
        ? 'Nascondi i menù consigliati nella pagina Prenota'
        : 'Mostra i menù consigliati nella pagina Prenota'

  return (
    <button
      type="button"
      aria-pressed={visible}
      title={title}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'menu-prices-icon-btn',
        visible ? 'menu-prices-icon-btn--visibility-visible' : 'menu-prices-icon-btn--visibility-hidden',
      )}
    >
      {visible ? <Eye className="h-4 w-4 shrink-0" aria-hidden /> : <EyeOff className="h-4 w-4 shrink-0" aria-hidden />}
    </button>
  )
}

export type MenuPricesHeroToolbarProps = {
  promoDisabled: boolean
  onAddProduct: () => void
  onAddCategory: () => void
  onPresetMenus: () => void
  onPromo: () => void
}

/** Fascia «Menu» con CTA: riutilizzabile nello sticky header della dashboard. */
export function MenuPricesHeroToolbar({
  promoDisabled,
  onAddProduct,
  onAddCategory,
  onPresetMenus,
  onPromo,
}: MenuPricesHeroToolbarProps) {
  return (
    <section
      aria-label="Gestione menu e prezzi"
      className="flex w-full min-w-0 flex-col gap-4 rounded-xl shadow-sm px-4 py-4 md:gap-5 md:px-5 md:py-5 min-h-[148px]"
      style={ADMIN_WARM_GRADIENT_SURFACE}
    >
      <p
        className="min-w-0 w-full px-1 text-center text-sm leading-snug text-gray-600 sm:px-2 sm:text-base max-[729px]:hidden"
        title="Aggiungi, modifica, nascondi o elimina gli elementi del menù"
      >
        Aggiungi, modifica, nascondi o elimina gli elementi del menù
      </p>
      <div className="w-full border-t border-[color:var(--admin-warm-wrap-border)] pt-3">
        <div className="grid w-full grid-cols-1 gap-2 min-[560px]:grid-cols-2 xl:grid-cols-4">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onAddProduct}
            className={cn(menuPricesHeaderCtaButtonClass)}
          >
            <Plus className="h-3.5 w-3.5" />
            Crea / Modifica Prodotto
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onAddCategory}
            className={cn(menuPricesHeaderCtaButtonClass)}
          >
            <Plus className="h-3.5 w-3.5" />
            Crea / Modifica Categoria
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onPresetMenus}
            aria-label="Crea / Modifica Menù Preselezionati"
            title="Crea / Modifica Menù Preselezionati"
            className={cn(menuPricesHeaderCtaButtonClass, 'truncate')}
          >
            <Plus className="h-3.5 w-3.5" />
            Crea / Modifica Menù Preselezionati
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onPromo}
            disabled={promoDisabled}
            aria-label="Crea / Modifica Promo Menù"
            title="Crea / Modifica Promo Menù"
            className={cn(menuPricesHeaderCtaButtonClass, 'whitespace-normal leading-snug')}
          >
            <Edit className="h-3.5 w-3.5" />
            Crea / Modifica Promo Menù
          </Button>
        </div>
      </div>
    </section>
  )
}

export type MenuPricesTabHandle = {
  startAddProduct: () => void
  startAddCategory: () => void
  openPresetMenus: () => void
  openPromo: () => void
}

export type MenuPricesTabProps = {
  /** Toolbar principale spostata nello sticky header AdminDashboard */
  omitHeroSection?: boolean
  onToolbarPromoDisabled?: (disabled: boolean) => void
}

const slugifyCategory = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

/** Allineato a MenuSelection — larghezza massima card ingredienti */
const MENU_CARD_MAX_WIDTH_PX = 746

type AdminMenuIngredientCardProps = {
  item: MenuItem
  onEdit: () => void
  onDelete: () => void
  /** Es. nome categoria (vista elenco prodotti) */
  metaLine?: string
  /** Sotto la card bianca (es. tipologie prenotazione in modifica prodotto). */
  footer?: ReactNode
  /** Vista menu senza «Crea / Modifica Prodotto»: solo nome/prezzo, senza icone azione. */
  showActions?: boolean
}

const AdminMenuIngredientCard: React.FC<AdminMenuIngredientCardProps> = ({
  item,
  onEdit,
  onDelete,
  metaLine,
  footer,
  showActions = true,
}) => {
  const hasDesc = Boolean(item.description?.trim())
  return (
    <div
      className="flex w-full flex-col items-stretch gap-2"
      style={{
        maxWidth: `min(${MENU_CARD_MAX_WIDTH_PX}px, calc(100% - 16px))`,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div
        className="flex w-full items-center rounded-xl border-2 text-left menu-card-mobile transition-all duration-200"
        style={{
          minHeight: '80px',
          maxHeight: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(1px)',
          borderColor: 'rgba(0,0,0,0.2)',
          paddingTop: '6px',
          paddingBottom: '6px',
          paddingLeft: '8px',
          paddingRight: '8px',
          borderRadius: '16px',
          marginBottom: '4px',
          width: '100%',
          maxWidth: `${MENU_CARD_MAX_WIDTH_PX}px`,
          height: hasDesc ? 'auto' : '80px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          className={`flex min-w-0 flex-1 flex-row flex-wrap items-center gap-x-2 gap-y-1 sm:flex-nowrap sm:gap-x-3 ${!hasDesc ? 'justify-between' : ''}`}
          style={{
            paddingLeft: '4px',
            paddingRight: '12px',
            paddingTop: '0px',
            paddingBottom: '0px',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <span
            className={`booking-mobile-card-title font-bold text-base md:text-lg text-gray-700 ${hasDesc ? 'min-w-0 max-w-[40%] shrink sm:max-w-[13rem]' : 'min-w-0 flex-1'}`}
            style={{
              fontWeight: '700',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {item.name}
          </span>
          {hasDesc ? (
            <p
              className="booking-mobile-card-description min-w-0 flex-1 basis-0 text-center text-base font-bold leading-snug text-gray-600 md:text-lg"
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.3',
                margin: 0,
                hyphens: 'auto',
              }}
            >
              {item.description}
            </p>
          ) : null}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              className="booking-mobile-price text-sm font-bold text-warm-wood whitespace-nowrap md:text-lg"
              style={{ fontWeight: '700', textAlign: 'right' }}
            >
              €{item.price.toFixed(2)}
            </span>
            {showActions ? (
              <div className="menu-prices-item-actions flex gap-2">
                <button
                  type="button"
                  onClick={onEdit}
                  className="menu-prices-icon-btn menu-prices-icon-btn--edit"
                  aria-label={`Modifica ${item.name}`}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="menu-prices-icon-btn menu-prices-icon-btn--delete"
                  aria-label={`Elimina ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {footer}
      {metaLine ? (
        <p className="px-1 text-center text-xs text-slate-500 sm:text-left">{metaLine}</p>
      ) : null}
    </div>
  )
}

type MenuItemBookingTypesPanelProps = {
  item: MenuItem
  disabled: boolean
  onToggle: (item: MenuItem, bt: BookingType, checked: boolean) => void | Promise<void>
}

function MenuItemBookingTypesPanel({ item, disabled, onToggle }: MenuItemBookingTypesPanelProps) {
  const bookingTypes = normalizeMenuItemBookingTypes(item.booking_types)
  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-3">
      <span className="mx-auto mb-2 block w-full text-center text-xs font-bold text-warm-wood sm:text-sm">
        Tipologie di prenotazione
      </span>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        {VOL_AU_VENT_PROMO_BOOKING_TYPE_OPTIONS.map(({ value, label: btLabel }) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm"
          >
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0 rounded border-gray-400"
              checked={bookingTypes.includes(value)}
              disabled={disabled}
              onChange={(e) => void onToggle(item, value, e.target.checked)}
            />
            {btLabel}
          </label>
        ))}
      </div>
    </div>
  )
}

type AdminMenuCategoryLabelCardProps = {
  label: string
  onEdit: () => void
  onDelete: () => void
}

const AdminMenuCategoryLabelCard: React.FC<AdminMenuCategoryLabelCardProps> = ({
  label,
  onEdit,
  onDelete,
}) => (
  <div
    className="flex w-full flex-col items-stretch gap-2"
    style={{
      maxWidth: `min(${MENU_CARD_MAX_WIDTH_PX}px, calc(100% - 16px))`,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}
  >
    <div
      className="flex w-full min-h-[80px] items-center rounded-xl border-2 text-left menu-card-mobile transition-all duration-200"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(1px)',
        borderColor: 'rgba(0,0,0,0.2)',
        paddingTop: '6px',
        paddingBottom: '6px',
        paddingLeft: '8px',
        paddingRight: '8px',
        borderRadius: '16px',
        marginBottom: '4px',
        width: '100%',
        maxWidth: `${MENU_CARD_MAX_WIDTH_PX}px`,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex min-w-0 w-full flex-1 items-center justify-between gap-3"
        style={{
          paddingLeft: '4px',
          paddingRight: '12px',
        }}
      >
        <span
          className="booking-mobile-card-title min-w-0 flex-1 font-bold text-base text-gray-700 md:text-lg"
          style={{
            fontWeight: '700',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {label}
        </span>
        <div className="menu-prices-item-actions flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="menu-prices-icon-btn menu-prices-icon-btn--edit"
            aria-label={`Modifica ${label}`}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="menu-prices-icon-btn menu-prices-icon-btn--delete"
            aria-label={`Elimina ${label}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
)

type MenuViewMode = 'menu' | 'categories' | 'preset_menus'

export const MenuPricesTab = forwardRef<MenuPricesTabHandle, MenuPricesTabProps>(function MenuPricesTab(
  { omitHeroSection = false, onToolbarPromoDisabled },
  ref,
) {
  const { data: menuItems = [], isLoading, refetch: refetchMenuItems } = useMenuItems()
  const { data: dbCategories = [], refetch: refetchCategories } = useMenuCategories()
  const createMutation = useCreateMenuItem()
  const createCategoryMutation = useCreateMenuCategory()
  const updateCategoryMutation = useUpdateMenuCategory()
  const deleteCategoryMutation = useDeleteMenuCategory()
  const updateMutation = useUpdateMenuItem()
  const deleteMutation = useDeleteMenuItem()

  const { data: customStaffPresets = [] } = useRestaurantSetting('booking_custom_staff_presets')
  const { data: volAuVentPromoVisible = false, isLoading: volAuVentVisLoading } = useRestaurantSetting(
    'booking_vol_au_vent_promo_visible',
  )
  const { data: volAuVentPromoMessage = DEFAULT_VOL_AU_VENT_PROMO_MESSAGE, isLoading: volAuVentMsgLoading } =
    useRestaurantSetting('booking_vol_au_vent_promo_message')
  const { data: volAuVentPromos = [], isLoading: volAuVentPromosLoading } = useRestaurantSetting(
    'booking_vol_au_vent_promos',
  )
  const upsertRestaurantSetting = useUpsertRestaurantSetting()
  const volAuVentPromoLoading = volAuVentVisLoading || volAuVentMsgLoading || volAuVentPromosLoading

  const [viewMode, setViewMode] = useState<MenuViewMode>('menu')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryLabel, setNewCategoryLabel] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  /** Stringa controllata per l’input prezzo: evita lo 0 “incollato” con `parseFloat(...) || 0` su campo vuoto. */
  const [priceInput, setPriceInput] = useState('')
  const [presetEditorMode, setPresetEditorMode] = useState<'list' | 'editor'>('list')
  const [presetName, setPresetName] = useState('')
  const [presetSelectedItems, setPresetSelectedItems] = useState<SelectedMenuItem[]>([])
  const [editingCustomPresetId, setEditingCustomPresetId] = useState<string | null>(null)
  const [promoEditorOpen, setPromoEditorOpen] = useState(false)
  const [promoEditorMode, setPromoEditorMode] = useState<'list' | 'editor'>('list')
  const [editingVolAuVentPromoId, setEditingVolAuVentPromoId] = useState<string | null>(null)
  const [promoDraftMessage, setPromoDraftMessage] = useState('')
  const [promoDraftBookingTypes, setPromoDraftBookingTypes] = useState<BookingType[]>([
    'rinfresco_laurea',
    'menu_prezzo_fisso',
  ])
  const promoEditorPanelRef = useRef<HTMLDivElement>(null)
  const productFormCardRef = useRef<HTMLDivElement>(null)
  const scrollProductFormIntoViewAfterEditRef = useRef(false)

  /** Attivo dopo «Crea / Modifica Prodotto» (toolbar): form sopra la lista e ingredienti con azioni + tipologie. */
  const [productToolbarFlowActive, setProductToolbarFlowActive] = useState(false)

  const resetVolAuVentPromoEditorDraft = () => {
    setPromoEditorMode('list')
    setEditingVolAuVentPromoId(null)
    setPromoDraftMessage('')
    setPromoDraftBookingTypes(['rinfresco_laurea', 'menu_prezzo_fisso'])
  }

  useLayoutEffect(() => {
    if (!promoEditorOpen || viewMode !== 'menu') return
    promoEditorPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [promoEditorOpen, viewMode])

  const startNewVolAuVentPromo = () => {
    setEditingVolAuVentPromoId(null)
    setPromoDraftMessage('')
    setPromoDraftBookingTypes(['rinfresco_laurea', 'menu_prezzo_fisso'])
    setPromoEditorMode('editor')
  }

  const startEditVolAuVentPromo = (row: VolAuVentPromo) => {
    setEditingVolAuVentPromoId(row.id)
    setPromoDraftMessage(row.message)
    setPromoDraftBookingTypes([...row.booking_types])
    setPromoEditorMode('editor')
  }

  const togglePromoDraftBookingType = (bt: BookingType) => {
    setPromoDraftBookingTypes((prev) =>
      prev.includes(bt) ? prev.filter((x) => x !== bt) : [...prev, bt],
    )
  }

  const handleSaveVolAuVentPromoRow = async () => {
    const trimmed = promoDraftMessage.trim()
    if (!trimmed) {
      toast.error('Inserisci il testo della promozione')
      return
    }
    if (promoDraftBookingTypes.length === 0) {
      toast.error('Seleziona almeno una tipologia di prenotazione')
      return
    }

    const existing =
      editingVolAuVentPromoId !== null
        ? volAuVentPromos.find((p) => p.id === editingVolAuVentPromoId)
        : undefined
    if (editingVolAuVentPromoId !== null && !existing) {
      toast.error('Promo non trovata')
      return
    }

    const nextRow: VolAuVentPromo =
      editingVolAuVentPromoId !== null && existing
        ? { ...existing, message: trimmed, booking_types: promoDraftBookingTypes }
        : {
            id: crypto.randomUUID(),
            message: trimmed,
            booking_types: promoDraftBookingTypes,
            visible_on_booking: true,
          }

    const next: VolAuVentPromo[] =
      editingVolAuVentPromoId !== null
        ? volAuVentPromos.map((p) => (p.id === editingVolAuVentPromoId ? nextRow : p))
        : [...volAuVentPromos, nextRow]

    try {
      await upsertRestaurantSetting.mutateAsync([{ key: 'booking_vol_au_vent_promos', value: next }])
      setPromoEditorMode('list')
      setEditingVolAuVentPromoId(null)
      setPromoDraftMessage('')
    } catch {
      //
    }
  }

  const handleDeleteVolAuVentPromo = (promoId: string, summary: string) => {
    if (!confirm(`Eliminare la promo "${summary}"?`)) {
      return
    }
    const next = volAuVentPromos.filter((p) => p.id !== promoId)
    upsertRestaurantSetting.mutate([{ key: 'booking_vol_au_vent_promos', value: next }])
  }

  const toggleVolAuVentPromoBookingVisibility = (promoId: string) => {
    const next = volAuVentPromos.map((p) =>
      p.id === promoId ? { ...p, visible_on_booking: !isVolAuVentPromoVisibleOnBooking(p) } : p,
    )
    upsertRestaurantSetting.mutate([{ key: 'booking_vol_au_vent_promos', value: next }])
  }

  const resetPresetEditor = () => {
    setPresetEditorMode('list')
    setPresetName('')
    setPresetSelectedItems([])
    setEditingCustomPresetId(null)
  }

  const closePresetMenusSection = () => {
    resetPresetEditor()
    setViewMode('menu')
  }

  const startNewCustomPreset = () => {
    setEditingCustomPresetId(null)
    setPresetName('')
    setPresetSelectedItems([])
    setPresetEditorMode('editor')
  }

  const startEditCustomPreset = (preset: CustomStaffPreset) => {
    setEditingCustomPresetId(preset.id)
    setPresetName(preset.name)
    setPresetSelectedItems(selectedItemsFromMenuItemIds(menuItems, preset.item_ids))
    setPresetEditorMode('editor')
  }

  const handleSaveCustomPreset = async () => {
    const name = presetName.trim()
    if (!name) {
      toast.error('Inserisci il nome del menù')
      return
    }
    const ids = presetSelectedItems.map((i) => i.id).filter(Boolean)
    if (!ids.length) {
      toast.error('Seleziona almeno un ingrediente')
      return
    }

    const next: CustomStaffPreset[] =
      editingCustomPresetId !== null
        ? customStaffPresets.map((p) =>
            p.id === editingCustomPresetId ? { ...p, name, item_ids: ids } : p,
          )
        : [...customStaffPresets, { id: crypto.randomUUID(), name, item_ids: ids, visible_on_booking: true }]

    try {
      await upsertRestaurantSetting.mutateAsync([{ key: 'booking_custom_staff_presets', value: next }])
      resetPresetEditor()
      setPresetEditorMode('list')
    } catch {
      //
    }
  }

  const handleDeleteCustomPreset = (presetId: string, label: string) => {
    if (!confirm(`Eliminare il menù preselezionato "${label}"?`)) {
      return
    }
    const next = customStaffPresets.filter((p) => p.id !== presetId)
    upsertRestaurantSetting.mutate([{ key: 'booking_custom_staff_presets', value: next }])
  }

  const toggleStaffPresetBookingVisibility = (presetId: string) => {
    const next = customStaffPresets.map((p) =>
      p.id === presetId ? { ...p, visible_on_booking: !isStaffPresetVisibleOnBooking(p) } : p,
    )
    upsertRestaurantSetting.mutate([{ key: 'booking_custom_staff_presets', value: next }])
  }

  const categoryEntries = useMemo(
    () => dbCategories.map((category) => [category.key, category.label] as const),
    [dbCategories]
  )


  const categoryKeys = useMemo(
    () => categoryEntries.map(([key]) => key),
    [categoryEntries]
  )
  const dbCategoryByKey = useMemo(
    () => new Map(dbCategories.map((category) => [category.key, category])),
    [dbCategories]
  )

  const [formData, setFormData] = useState<MenuItemInput>({
    name: '',
    category: categoryKeys[0] ?? '',
    price: 0,
    description: '',
    sort_order: 0
  })

  const resetProductFormState = () => {
    setProductToolbarFlowActive(false)
    setIsAdding(false)
    setEditingId(null)
    setPriceInput('')
    setFormData({
      name: '',
      category: categoryKeys[0] ?? '',
      price: 0,
      description: '',
      sort_order: 0,
    })
  }

  const openPromoEditor = () => {
    resetVolAuVentPromoEditorDraft()
    resetPresetEditor()
    setViewMode('menu')
    resetProductFormState()
    setIsAddingCategory(false)
    setEditingCategoryId(null)
    setNewCategoryLabel('')
    setPromoEditorOpen(true)
    setPromoEditorMode('list')
  }

  const openPresetMenusSection = () => {
    resetPresetEditor()
    resetProductFormState()
    setPresetEditorMode('list')
    setViewMode('preset_menus')
  }

  // Raggruppa per categoria
  const itemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categoryEntriesWithItems = useMemo(
    () => categoryEntries.filter(([key]) => (itemsByCategory[key]?.length ?? 0) > 0),
    [categoryEntries, itemsByCategory],
  )

  const handleStartEdit = (item: MenuItem) => {
    setProductToolbarFlowActive(true)
    setEditingId(item.id)
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      sort_order: item.sort_order
    })
    setPriceInput(item.price === 0 ? '' : String(item.price))
    setIsAdding(false)
    scrollProductFormIntoViewAfterEditRef.current = true
  }

  const handleStartAdd = () => {
    setViewMode('menu')
    setPromoEditorOpen(false)
    resetVolAuVentPromoEditorDraft()
    setIsAddingCategory(false)
    setProductToolbarFlowActive(true)
    setIsAdding(true)
    setEditingId(null)
    setPriceInput('')
    setFormData({
      name: '',
      category: categoryKeys[0] ?? '',
      price: 0,
      description: '',
      sort_order: 0
    })
    scrollProductFormIntoViewAfterEditRef.current = true
  }

  const handleCancel = () => {
    setViewMode('menu')
    resetProductFormState()
  }

  const handleSaveCategory = async () => {
    const rawLabel = newCategoryLabel.trim()
    if (!rawLabel) {
      toast.error('Inserisci il nome della categoria')
      return
    }

    try {
      if (editingCategoryId) {
        const editingCategory = dbCategories.find((category) => category.id === editingCategoryId)
        if (!editingCategory) {
          toast.error('Categoria non trovata')
          return
        }

        const newKey = slugifyCategory(rawLabel)
        if (!newKey) {
          toast.error('Nome categoria non valido')
          return
        }

        const duplicateCategory = dbCategories.find(
          (category) => category.key === newKey && category.id !== editingCategoryId
        )
        if (duplicateCategory) {
          toast.error('Categoria già presente')
          return
        }

        await updateCategoryMutation.mutateAsync({
          id: editingCategoryId,
          key: newKey,
          previousKey: editingCategory.key,
          label: rawLabel
        })
      } else {
        const key = slugifyCategory(rawLabel)
        if (!key) {
          toast.error('Nome categoria non valido')
          return
        }

        if (categoryKeys.includes(key)) {
          toast.error('Categoria già presente')
          return
        }

        await createCategoryMutation.mutateAsync({ key, label: rawLabel, sort_order: 999 })
        setFormData((prev) => ({ ...prev, category: key }))
      }

      await refetchCategories()
      await refetchMenuItems()
      cancelCategoryForm()
    } catch {
      // errore già gestito dalla mutation con toast
    }
  }

  const handleEditCategory = (categoryKey: string, currentLabel: string) => {
    const dbCategory = dbCategoryByKey.get(categoryKey)
    if (!dbCategory) {
      toast.error('Categoria non modificabile')
      return
    }
    resetProductFormState()
    setViewMode('categories')
    setIsAddingCategory(true)
    setEditingCategoryId(dbCategory.id)
    setNewCategoryLabel(currentLabel)
  }

  const handleDeleteCategory = (categoryKey: string, label: string) => {
    const dbCategory = dbCategoryByKey.get(categoryKey)
    if (!dbCategory) {
      toast.error('Categoria non eliminabile')
      return
    }

    const itemsInCategory = itemsByCategory[categoryKey]?.length ?? 0
    if (itemsInCategory > 0) {
      toast.error('Elimina prima i prodotti presenti in questa categoria')
      return
    }

    if (!confirm(`Sei sicuro di voler eliminare la categoria "${label}"?`)) {
      return
    }

    deleteCategoryMutation.mutate(dbCategory.id)
  }

  const handleStartAddCategory = () => {
    setViewMode('categories')
    resetProductFormState()
    setIsAddingCategory(true)
    setEditingCategoryId(null)
    setNewCategoryLabel('')
  }

  const cancelCategoryForm = () => {
    setIsAddingCategory(false)
    setNewCategoryLabel('')
    setEditingCategoryId(null)
  }

  useImperativeHandle(
    ref,
    () => ({
      startAddProduct: handleStartAdd,
      startAddCategory: handleStartAddCategory,
      openPresetMenus: openPresetMenusSection,
      openPromo: openPromoEditor,
    }),
    [handleStartAdd, handleStartAddCategory, openPresetMenusSection, openPromoEditor],
  )

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Il nome è obbligatorio')
      return
    }
    if (!formData.category) {
      toast.error('Seleziona una categoria')
      return
    }

    const rawPrice = priceInput.trim().replace(',', '.')
    if (rawPrice === '') {
      toast.error('Il prezzo è obbligatorio')
      return
    }
    const parsedPrice = parseFloat(rawPrice)
    if (Number.isNaN(parsedPrice)) {
      toast.error('Inserisci un prezzo valido')
      return
    }
    if (parsedPrice < 0) {
      toast.error('Il prezzo non può essere negativo')
      return
    }

    const payload = { ...formData, price: parsedPrice }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload })
        await refetchMenuItems()
        await refetchCategories()
        setFormData({
          ...formData,
          ...payload,
        })
        setPriceInput(parsedPrice === 0 ? '' : String(parsedPrice))
      } else {
        await createMutation.mutateAsync(payload)
        await refetchMenuItems()
        await refetchCategories()
        setPriceInput('')
        setFormData({
          name: '',
          category: categoryKeys[0] ?? '',
          price: 0,
          description: '',
          sort_order: 0,
        })
        setIsAdding(true)
        setEditingId(null)
      }
    } catch {
      // errore già gestito dalla mutation con toast
    }
  }

  const handlePriceInputChange = (value: string) => {
    // Consente solo cifre con separatore decimale opzionale (max 2 decimali).
    if (/^\d*([.,]\d{0,2})?$/.test(value)) {
      setPriceInput(value)
    }
  }

  const handlePriceInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Blocca notazione scientifica e segni su input numerico.
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault()
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Sei sicuro di voler eliminare "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggleMenuItemBookingType = async (
    item: MenuItem,
    bookingType: BookingType,
    checked: boolean,
  ) => {
    const current = normalizeMenuItemBookingTypes(item.booking_types)
    const next = checked
      ? current.includes(bookingType)
        ? current
        : [...current, bookingType]
      : current.filter((t) => t !== bookingType)
    if (next.length === 0) {
      toast.error('Seleziona almeno una tipologia di prenotazione')
      return
    }
    try {
      await updateMutation.mutateAsync({ id: item.id, booking_types: next })
    } catch {
      //
    }
  }

  useLayoutEffect(() => {
    if (!scrollProductFormIntoViewAfterEditRef.current) return
    if (viewMode !== 'menu' || promoEditorOpen) return
    if (!editingId && !isAdding) return
    scrollProductFormIntoViewAfterEditRef.current = false
    productFormCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [viewMode, promoEditorOpen, isAdding, editingId])

  useEffect(() => {
    onToolbarPromoDisabled?.(volAuVentPromoLoading || upsertRestaurantSetting.isPending)
  }, [onToolbarPromoDisabled, volAuVentPromoLoading, upsertRestaurantSetting.isPending])

  if (isLoading) {
    return <div className="text-center py-8">Caricamento menu...</div>
  }

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {!omitHeroSection && (
      <section
        aria-label="Gestione menu e prezzi"
        className="flex w-full min-w-0 flex-col gap-4 rounded-xl shadow-sm px-4 py-4 md:gap-5 md:px-5 md:py-5 min-h-[148px]"
        style={ADMIN_WARM_GRADIENT_SURFACE}
      >
        <p
          className="min-w-0 w-full px-1 text-center text-sm leading-snug text-gray-600 sm:px-2 sm:text-base max-[729px]:hidden"
          title="Aggiungi, modifica, nascondi o elimina gli elementi del menù"
        >
          Aggiungi, modifica, nascondi o elimina gli elementi del menù
        </p>
        <div className="w-full border-t border-[color:var(--admin-warm-wrap-border)] pt-3">
          <div className="grid w-full grid-cols-1 gap-2 min-[560px]:grid-cols-2 xl:grid-cols-4">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleStartAdd}
              className={cn(menuPricesHeaderCtaButtonClass)}
            >
              <Plus className="h-3.5 w-3.5" />
              Crea / Modifica Prodotto
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleStartAddCategory}
              className={cn(menuPricesHeaderCtaButtonClass)}
            >
              <Plus className="h-3.5 w-3.5" />
              Crea / Modifica Categoria
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={openPresetMenusSection}
              aria-label="Crea / Modifica Menù Preselezionati"
              title="Crea / Modifica Menù Preselezionati"
              className={cn(menuPricesHeaderCtaButtonClass, 'truncate')}
            >
              <Plus className="h-3.5 w-3.5" />
              Crea / Modifica Menù Preselezionati
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={openPromoEditor}
              disabled={volAuVentPromoLoading || upsertRestaurantSetting.isPending}
              aria-label="Crea / Modifica Promo Menù"
              title="Crea / Modifica Promo Menù"
              className={cn(menuPricesHeaderCtaButtonClass, 'whitespace-normal leading-snug')}
            >
              <Edit className="h-3.5 w-3.5" />
              Crea / Modifica Promo Menù
            </Button>
          </div>
        </div>
      </section>
      )}
      {viewMode === 'menu' && promoEditorOpen && (
        <div className="w-full">
          <div
            ref={promoEditorPanelRef}
            className="relative w-full scroll-mt-24 rounded-2xl border-2 p-4 md:p-6 shadow-lg md:scroll-mt-28"
            style={ADMIN_WARM_GRADIENT_SURFACE}
            role="region"
            aria-label="Editor promozioni menù pagina prenotazione"
          >
            <button
              type="button"
              onClick={() => {
                setPromoEditorOpen(false)
                resetVolAuVentPromoEditorDraft()
              }}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-wood/40 bg-white/90 text-warm-wood shadow-sm transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-warm-wood/40"
              aria-label="Chiudi promozioni menù"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto max-w-3xl pb-12 pr-10">
              <h3 className="text-center font-serif text-lg font-bold text-warm-wood md:text-xl">
                Promozioni Menù
              </h3>
              <p className="mt-2 text-center text-xs text-gray-600 sm:text-sm">
                Crea una o più promo e associale alle tipologie di prenotazione del form pubblico.
              </p>

              {!volAuVentPromoVisible && (
                <p className="mb-3 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                  La visibilità promo in pagina Prenota è disattivata a livello di impostazione: le promo non saranno
                  mostrate nel form pubblico finché resta così.
                </p>
              )}

              {volAuVentPromoMessage.trim().length > 0 && volAuVentPromos.length === 0 && (
                <p className="mb-3 mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-xs text-slate-700">
                  È ancora salvato un messaggio dalla versione precedente dell&apos;editor: viene usato in pagina Prenota
                  finché non aggiungi promo in questa lista.
                </p>
              )}

              {promoEditorMode === 'list' && (
                <div className="mt-8 flex flex-col items-stretch gap-4">
                  <Button
                    variant="success"
                    size="sm"
                    type="button"
                    onClick={startNewVolAuVentPromo}
                    disabled={volAuVentPromoLoading || upsertRestaurantSetting.isPending}
                    className="h-9 shrink-0 gap-1.5 px-4 py-0 text-xs self-center sm:self-end"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nuova Promo Menù
                  </Button>
                  {volAuVentPromos.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-12 text-center text-sm text-gray-600">
                      Nessuna promo. Creane una con il pulsante sopra.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {volAuVentPromos.map((row) => (
                        <div
                          key={row.id}
                          className="menu-prices-item-row flex-wrap gap-y-3"
                          style={{ padding: '0.75rem 1rem', minHeight: '72px' }}
                        >
                          <div className="menu-prices-item-text min-w-[120px]">
                            <h4 className="text-left font-semibold text-gray-900">
                              {promoMessageSummary(row.message)}
                            </h4>
                            <p className="text-left text-xs text-gray-500">
                              {bookingTypeLabelsJoined(row.booking_types)}
                            </p>
                          </div>
                          <div className="menu-prices-item-actions shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditVolAuVentPromo(row)}
                              className="menu-prices-icon-btn menu-prices-icon-btn--edit"
                              aria-label={`Modifica promo`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <StaffPresetsVisibilityIconButton
                              variant="volPromo"
                              visible={isVolAuVentPromoVisibleOnBooking(row)}
                              disabled={upsertRestaurantSetting.isPending}
                              onToggle={() => toggleVolAuVentPromoBookingVisibility(row.id)}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteVolAuVentPromo(row.id, promoMessageSummary(row.message))
                              }
                              className="menu-prices-icon-btn menu-prices-icon-btn--delete"
                              aria-label={`Elimina promo`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {promoEditorMode === 'editor' && (
                <div className="mt-8 space-y-6">
                  <div>
                    <label
                      htmlFor="vol-au-vent-promo-textarea"
                      className="mb-1 block text-xs font-semibold text-gray-700"
                    >
                      Inserisci il testo della promozione
                    </label>
                    <Textarea
                      id="vol-au-vent-promo-textarea"
                      value={promoDraftMessage}
                      onChange={(e) => setPromoDraftMessage(e.target.value)}
                      placeholder={VOL_AU_VENT_PROMO_PLACEHOLDER}
                      rows={6}
                      maxLength={500}
                      className="min-h-[140px] resize-y border-slate-300 bg-white text-slate-900"
                      aria-label="Inserisci il testo della promozione"
                    />
                    <p className="mt-1 text-xs text-gray-500">{promoDraftMessage.length}/500</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white/80 p-4">
                    <span className="mx-auto mb-3 block w-fit max-w-full text-center text-sm font-bold text-warm-wood md:text-base">
                      Tipologia di Prenotazione *
                    </span>
                    <p className="mb-3 text-center text-xs text-gray-600">
                      Seleziona una o più tipologie: il testo comparirà quando il cliente sceglie una di queste opzioni
                      (come nel form pubblico).
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                      {VOL_AU_VENT_PROMO_BOOKING_TYPE_OPTIONS.map(({ value, label }) => (
                        <label
                          key={value}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 shrink-0 rounded border-gray-400"
                            checked={promoDraftBookingTypes.includes(value)}
                            onChange={() => togglePromoDraftBookingType(value)}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      disabled={upsertRestaurantSetting.isPending}
                      onClick={() => void handleSaveVolAuVentPromoRow()}
                      className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/35 hover:from-emerald-400 hover:to-emerald-500 hover:border-emerald-600 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:brightness-100 disabled:hover:from-emerald-500 disabled:hover:to-emerald-600 disabled:hover:border-emerald-700"
                    >
                      <Save className="h-4 w-4" />
                      Salva promo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPromoEditorMode('list')
                        setEditingVolAuVentPromoId(null)
                        setPromoDraftMessage('')
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                    >
                      <X className="h-4 w-4 flex-shrink-0" />
                      Indietro
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {viewMode === 'menu' && (
      <>
      {!promoEditorOpen && (
      <>
      {(isAdding || editingId) && (
          <div
            ref={productFormCardRef}
            className="relative w-full scroll-mt-24 rounded-2xl border-2 p-6 shadow-lg md:scroll-mt-28"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            <button
              type="button"
              onClick={handleCancel}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-wood/40 bg-white/90 text-warm-wood shadow-sm transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-warm-wood/40"
              aria-label="Chiudi inserimento prodotto"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto w-2/3 text-center">
              <h3 className="text-xl font-bold text-warm-wood mb-4">
                {editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col items-center">
                  <label className="mb-1 block text-center text-sm font-medium text-gray-700">
                    Nome Prodotto *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="es: Pizza Margherita"
                    className="mx-auto w-2/3 rounded-2xl pl-6"
                    style={{ height: '56px', borderRadius: '18px', paddingLeft: '24px' }}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="mb-1 block text-center text-sm font-medium text-gray-700">
                    Categoria *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category: value
                      })
                    }
                  >
                    <SelectTrigger
                      className="mx-auto h-14 w-2/3 rounded-2xl border text-gray-600 shadow-sm"
                      style={{
                        borderColor: 'rgba(0,0,0,0.2)',
                        height: '56px',
                        minHeight: '56px',
                        fontSize: '16px',
                        backgroundColor: '#ffffff',
                        borderRadius: '18px',
                        paddingLeft: '24px',
                        paddingRight: '24px'
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {categoryEntries.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col items-center">
                  <label className="mb-1 block text-center text-sm font-medium text-gray-700">
                    Prezzo (€) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceInput}
                    onChange={(e) => handlePriceInputChange(e.target.value)}
                    onKeyDown={handlePriceInputKeyDown}
                    placeholder="es: 4.50"
                    className="mx-auto w-2/3 rounded-2xl pl-6"
                    style={{ height: '56px', borderRadius: '18px', paddingLeft: '24px' }}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="mb-1 block text-center text-sm font-medium text-gray-700">
                    Descrizione (opzionale)
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="es: 2 tranci a persona"
                    className="mx-auto w-2/3 rounded-2xl pl-6"
                    style={{ height: '56px', borderRadius: '18px', paddingLeft: '24px' }}
                  />
                </div>
              </div>
              <div className="mt-10 flex justify-center gap-3" style={{ marginTop: '40px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/35 hover:from-emerald-400 hover:to-emerald-500 hover:border-emerald-600 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:brightness-100 disabled:hover:from-emerald-500 disabled:hover:to-emerald-600 disabled:hover:border-emerald-700"
                >
                  <Save className="h-4 w-4 flex-shrink-0" />
                  Salva
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                >
                  <X className="h-4 w-4 flex-shrink-0" />
                  Annulla
                </button>
              </div>
            </div>
          </div>
      )}
      <div
        className="relative w-full rounded-2xl border-2 p-4 md:p-6 shadow-lg"
        style={ADMIN_WARM_GRADIENT_SURFACE}
        role="region"
        aria-labelledby="menu-prices-ingredient-overview-heading"
      >
        <h3
          id="menu-prices-ingredient-overview-heading"
          className="text-center font-serif text-lg font-bold leading-tight text-warm-wood md:text-xl"
        >
          Menu
        </h3>
        {productToolbarFlowActive ? (
          <p className="mt-2 text-center text-xs text-gray-600 sm:text-sm">
            Per ogni ingrediente: modifica, elimina o scegli per quali tipologie di prenotazione è disponibile nel menu
            pubblico.
          </p>
        ) : null}
        {menuItems.length === 0 ? (
          <p
            className={cn(
              'py-8 text-center text-sm text-gray-600',
              productToolbarFlowActive ? 'mt-8' : 'mt-6',
            )}
          >
            Nessun ingrediente ancora.
          </p>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
              productToolbarFlowActive ? 'mt-8' : 'mt-6',
            )}
          >
            {categoryEntriesWithItems.map(([categoryKey, categoryLabel]) => (
              <CollapsibleCard
                key={categoryKey}
                title={categoryLabel}
                subtitle={`${itemsByCategory[categoryKey]?.length ?? 0} ingredienti`}
                defaultExpanded={false}
                className="h-fit border-amber-200/80 shadow-md"
                headerClassName="min-h-[48px] bg-white/85 hover:bg-white border-amber-100"
                contentClassName="bg-transparent p-0"
              >
                <div className="flex flex-col gap-3 px-2 pb-4 pt-1 sm:px-3">
                  {(itemsByCategory[categoryKey] ?? []).map((item) => (
                    <AdminMenuIngredientCard
                      key={item.id}
                      item={item}
                      onEdit={() => handleStartEdit(item)}
                      onDelete={() => handleDelete(item.id, item.name)}
                      showActions={productToolbarFlowActive}
                      footer={
                        productToolbarFlowActive ? (
                          <MenuItemBookingTypesPanel
                            item={item}
                            disabled={updateMutation.isPending}
                            onToggle={handleToggleMenuItemBookingType}
                          />
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              </CollapsibleCard>
            ))}
          </div>
        )}
      </div>
      </>
      )}
      </>
      )}

      {viewMode === 'preset_menus' && (
        <>
          <div
            className="relative w-full rounded-2xl border-2 p-4 md:p-6 shadow-lg"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            <button
              type="button"
              onClick={closePresetMenusSection}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-wood/40 bg-white/90 text-warm-wood shadow-sm transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-warm-wood/40"
              aria-label="Chiudi menù preselezionati"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto max-w-3xl pb-12 pr-10">
              <h3 className="text-center font-serif text-lg font-bold text-warm-wood md:text-xl">
                Menù preselezionati
              </h3>
              <p className="mt-2 text-center text-xs text-gray-600 sm:text-sm">
                Compila un nome, seleziona gli ingredienti come in prenotazione e salva: in pagina Prenota comparirà
                solo se l&apos;occhio su quella riga è aperto (visibilità per singolo menù).
              </p>

              {presetEditorMode === 'list' && (
                <div className="mt-8 flex flex-col items-stretch gap-4">
                  <Button
                    variant="success"
                    size="sm"
                    type="button"
                    onClick={startNewCustomPreset}
                    className="h-9 shrink-0 gap-1.5 px-4 py-0 text-xs self-center sm:self-end"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nuovo menù preselezionato
                  </Button>
                  {customStaffPresets.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-12 text-center text-sm text-gray-600">
                      Nessun menù personalizzato. Crea il primo con il pulsante sopra.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {customStaffPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="menu-prices-item-row flex-wrap gap-y-3"
                          style={{ padding: '0.75rem 1rem', minHeight: '72px' }}
                        >
                          <div className="menu-prices-item-text min-w-[120px]">
                            <h4 className="text-left font-semibold text-gray-900">{preset.name}</h4>
                            <p className="text-left text-xs text-gray-500">
                              {preset.item_ids.length}{' '}
                              {preset.item_ids.length === 1 ? 'ingrediente' : 'ingredienti'}
                            </p>
                          </div>
                          <div className="menu-prices-item-actions shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditCustomPreset(preset)}
                              className="menu-prices-icon-btn menu-prices-icon-btn--edit"
                              aria-label={`Modifica ${preset.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <StaffPresetsVisibilityIconButton
                              visible={isStaffPresetVisibleOnBooking(preset)}
                              disabled={upsertRestaurantSetting.isPending}
                              onToggle={() => toggleStaffPresetBookingVisibility(preset.id)}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomPreset(preset.id, preset.name)}
                              className="menu-prices-icon-btn menu-prices-icon-btn--delete"
                              aria-label={`Elimina ${preset.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {presetEditorMode === 'editor' && (
                <div className="mt-8 space-y-6">
                  <div className="mx-auto flex w-full max-w-md flex-col gap-2">
                    <label className="text-center text-sm font-medium text-gray-700">
                      Nome menù consigliato *
                    </label>
                    <Input
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="es. Menù laurea Vegan"
                      className="mx-auto h-14 w-full rounded-2xl pl-6 text-center sm:text-left"
                      style={{ height: '56px', borderRadius: '18px', paddingLeft: '24px' }}
                    />
                  </div>
                  <div className="rounded-xl bg-white/50 p-4">
                    <PresetMenuBuilder
                      selectedItems={presetSelectedItems}
                      onSelectionChange={setPresetSelectedItems}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      disabled={upsertRestaurantSetting.isPending}
                      onClick={handleSaveCustomPreset}
                      className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/35 hover:from-emerald-400 hover:to-emerald-500 hover:border-emerald-600 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:brightness-100 disabled:hover:from-emerald-500 disabled:hover:to-emerald-600 disabled:hover:border-emerald-700"
                    >
                      <Save className="h-4 w-4" />
                      Salva menù
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetPresetEditor()
                        setPresetEditorMode('list')
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                    >
                      <X className="h-4 w-4 flex-shrink-0" />
                      Indietro
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {viewMode === 'categories' && (
        <div
          className="relative w-full rounded-2xl border-2 p-4 md:p-6 shadow-lg"
          style={ADMIN_WARM_GRADIENT_SURFACE}
        >
          <button
            type="button"
            onClick={() => {
              setViewMode('menu')
              cancelCategoryForm()
            }}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-wood/40 bg-white/90 text-warm-wood shadow-sm transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-warm-wood/40"
            aria-label="Chiudi gestione categorie"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mx-auto max-w-3xl pb-12 pr-10">
            <h3 className="text-center font-serif text-lg font-bold text-warm-wood md:text-xl">
              Categorie Menu
            </h3>
            <p className="mt-2 text-center text-xs text-gray-600 sm:text-sm">
              Aggiungi, rinomina o elimina le categorie degli ingredienti. Per eliminare una categoria non devono esserci
              prodotti al suo interno.
            </p>

            {isAddingCategory ? (
              <div className="mt-8 flex flex-col gap-4">
                <div className="mx-auto w-full max-w-3xl">
                  <Input
                    value={newCategoryLabel}
                    onChange={(e) => setNewCategoryLabel(e.target.value)}
                    placeholder="Nuova categoria ingredienti"
                    className="h-14 w-full rounded-2xl pl-6"
                    style={{ height: '56px', borderRadius: '18px', paddingLeft: '24px' }}
                  />
                </div>
                <div className="mt-10 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleSaveCategory()}
                    disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/35 hover:from-emerald-400 hover:to-emerald-500 hover:border-emerald-600 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:brightness-100 disabled:hover:from-emerald-500 disabled:hover:to-emerald-600 disabled:hover:border-emerald-700"
                  >
                    <Save className="h-4 w-4 shrink-0" />
                    Salva
                  </button>
                  <button
                    type="button"
                    onClick={cancelCategoryForm}
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                  >
                    <X className="h-4 w-4 shrink-0" />
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-stretch gap-4">
                <Button
                  variant="success"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(true)
                    setEditingCategoryId(null)
                    setNewCategoryLabel('')
                  }}
                  className="h-9 shrink-0 gap-1.5 px-4 py-0 text-xs self-center sm:self-end"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Nuova Categoria Ingredienti
                </Button>
              </div>
            )}

            <div className={cn(menuPricesCategoryListWrapClass, 'mt-8')}>
              <div className="menu-prices-category-block flex w-full flex-col items-center px-1 sm:px-2 md:col-span-2">
                <div
                  className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2"
                  style={{ marginTop: '0', paddingTop: '0.5rem' }}
                >
                  {categoryEntries.map(([key, label]) => (
                    <AdminMenuCategoryLabelCard
                      key={key}
                      label={label}
                      onEdit={() => handleEditCategory(key, label)}
                      onDelete={() => handleDeleteCategory(key, label)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

MenuPricesTab.displayName = 'MenuPricesTab'
