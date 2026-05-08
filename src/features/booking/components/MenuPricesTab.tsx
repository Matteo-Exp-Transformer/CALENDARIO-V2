import React, { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_WARM_BORDER, ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { Button, Input, Textarea } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '../hooks/useMenuItems'
import {
  useCreateMenuCategory,
  useDeleteMenuCategory,
  useMenuCategories,
  useUpdateMenuCategory
} from '../hooks/useMenuCategories'
import type { MenuItem, MenuItemInput } from '@/types/menu'
import type { SelectedMenuItem } from '@/types/menu'
import type { CustomStaffPreset } from '../constants/presetMenus'
import { useRestaurantSetting, useUpsertRestaurantSetting } from '../hooks/useRestaurantSetting'
import { selectedItemsFromMenuItemIds } from '../utils/buildPresetMenuSelection'
import { PresetMenuBuilder } from './PresetMenuBuilder'
import {
  DEFAULT_VOL_AU_VENT_PROMO_MESSAGE,
  VOL_AU_VENT_PROMO_PLACEHOLDER,
} from '../constants/volAuVentPromo'
import { cn } from '@/lib/utils'

/** Fascia lista categorie: griglia 2 colonne da sm — classi Tailwind qui (STYLING_AGENT_CONTEXT §4). */
const menuPricesCategoryListWrapClass = cn(
  'menu-prices-category-list-wrap grid grid-cols-1 items-start gap-[28px] sm:grid-cols-2'
)

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

const adminMenuCategoryTitleStyle: React.CSSProperties = {
  color: '#6B4226',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(1px)',
  padding: '8px 16px',
  borderRadius: '12px',
  width: '100%',
  maxWidth: `min(${MENU_CARD_MAX_WIDTH_PX}px, calc(100% - 16px))`,
  margin: '0 auto',
  boxSizing: 'border-box',
  fontWeight: '700',
}

type AdminMenuIngredientCardProps = {
  item: MenuItem
  onEdit: () => void
  onDelete: () => void
  /** Es. nome categoria (vista elenco prodotti) */
  metaLine?: string
}

const AdminMenuIngredientCard: React.FC<AdminMenuIngredientCardProps> = ({
  item,
  onEdit,
  onDelete,
  metaLine,
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
          </div>
        </div>
      </div>
      {metaLine ? (
        <p className="px-1 text-center text-xs text-slate-500 sm:text-left">{metaLine}</p>
      ) : null}
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

type MenuViewMode = 'menu' | 'products' | 'categories' | 'preset_menus'

export const MenuPricesTab: React.FC = () => {
  const { data: menuItems = [], isLoading, refetch: refetchMenuItems } = useMenuItems()
  const { data: dbCategories = [], refetch: refetchCategories } = useMenuCategories()
  const createMutation = useCreateMenuItem()
  const createCategoryMutation = useCreateMenuCategory()
  const updateCategoryMutation = useUpdateMenuCategory()
  const deleteCategoryMutation = useDeleteMenuCategory()
  const updateMutation = useUpdateMenuItem()
  const deleteMutation = useDeleteMenuItem()

  const { data: staffPresetsVisible = true, isLoading: staffPresetVisibleLoading } = useRestaurantSetting(
    'booking_staff_presets_visible',
  )
  const { data: customStaffPresets = [] } = useRestaurantSetting('booking_custom_staff_presets')
  const { data: volAuVentPromoVisible = false, isLoading: volAuVentVisLoading } = useRestaurantSetting(
    'booking_vol_au_vent_promo_visible',
  )
  const { data: volAuVentPromoMessage = DEFAULT_VOL_AU_VENT_PROMO_MESSAGE, isLoading: volAuVentMsgLoading } =
    useRestaurantSetting('booking_vol_au_vent_promo_message')
  const upsertRestaurantSetting = useUpsertRestaurantSetting()
  const volAuVentPromoLoading = volAuVentVisLoading || volAuVentMsgLoading

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
  const [promoDraft, setPromoDraft] = useState('')
  const volAuVentMsgLoadingPrev = useRef(volAuVentMsgLoading)
  const promoEditorPanelRef = useRef<HTMLDivElement>(null)

  /** Se il pannello è aperto e il messaggio arriva dopo dal server, aggiorna il testo in bozza. */
  useEffect(() => {
    const finishedLoading =
      promoEditorOpen && volAuVentMsgLoadingPrev.current && !volAuVentMsgLoading
    volAuVentMsgLoadingPrev.current = volAuVentMsgLoading
    if (finishedLoading) {
      setPromoDraft(volAuVentPromoMessage)
    }
  }, [promoEditorOpen, volAuVentMsgLoading, volAuVentPromoMessage])

  const openPromoEditor = () => {
    setPromoDraft(volAuVentPromoMessage)
    setPromoEditorOpen(true)
    queueMicrotask(() =>
      promoEditorPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
    )
  }

  const resetPresetEditor = () => {
    setPresetEditorMode('list')
    setPresetName('')
    setPresetSelectedItems([])
    setEditingCustomPresetId(null)
  }

  const openPresetMenusSection = () => {
    resetPresetEditor()
    setPresetEditorMode('list')
    setViewMode('preset_menus')
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
        : [...customStaffPresets, { id: crypto.randomUUID(), name, item_ids: ids }]

    try {
      await upsertRestaurantSetting.mutateAsync([{ key: 'booking_custom_staff_presets', value: next }])
      resetPresetEditor()
      setPresetEditorMode('list')
    } catch {
      //
    }
  }

  const handleSaveVolAuVentPromoMessage = async () => {
    const trimmed = promoDraft.trim()
    try {
      await upsertRestaurantSetting.mutateAsync([
        { key: 'booking_vol_au_vent_promo_message', value: trimmed },
      ])
      setPromoEditorOpen(false)
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

  // Raggruppa per categoria
  const itemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const handleStartEdit = (item: MenuItem) => {
    setViewMode('products')
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
  }

  const handleStartAdd = () => {
    setViewMode('products')
    setIsAddingCategory(false)
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
  }

  const handleCancel = () => {
    setViewMode('menu')
    setIsAdding(false)
    setEditingId(null)
    setPriceInput('')
    setFormData({
      name: '',
      category: categoryKeys[0] ?? '',
      price: 0,
      description: '',
      sort_order: 0
    })
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
      setViewMode('menu')
      setIsAddingCategory(false)
      setNewCategoryLabel('')
      setEditingCategoryId(null)
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
    setIsAdding(false)
    setEditingId(null)
    setIsAddingCategory(true)
    setEditingCategoryId(null)
    setNewCategoryLabel('')
  }

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
      } else {
        await createMutation.mutateAsync(payload)
      }

      await refetchMenuItems()
      await refetchCategories()
      handleCancel()
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

  if (isLoading) {
    return <div className="text-center py-8">Caricamento menu...</div>
  }

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      <section
        aria-labelledby="menu-prices-heading"
        className="flex w-full min-w-0 flex-col gap-4 rounded-xl shadow-sm px-4 py-4 md:gap-5 md:px-5 md:py-5 min-h-[148px]"
        style={ADMIN_WARM_GRADIENT_SURFACE}
      >
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <h2
            id="menu-prices-heading"
            className="shrink-0 font-serif text-base font-bold leading-tight text-warm-wood sm:text-lg"
          >
            Menu
          </h2>
          <p
            className="min-w-0 flex-1 px-1 text-center text-xs leading-snug text-gray-600 sm:px-2 sm:text-sm max-[729px]:hidden"
            title="Aggiungi, modifica o elimina le voci del menu e i prezzi"
          >
            Aggiungi, modifica o elimina le voci del menu e i prezzi
          </p>
        </div>

        <div className="w-full border-t border-[color:var(--admin-warm-wrap-border)] pt-3">
          <div className="grid w-full grid-cols-1 gap-2 min-[560px]:grid-cols-2 xl:grid-cols-4">
            <Button
              variant="success"
              size="sm"
              type="button"
              onClick={handleStartAdd}
              className="h-9 min-h-9 w-full shrink-0 gap-1.5 px-2 py-0 text-xs"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              Crea / Modifica Prodotto
            </Button>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleStartAddCategory}
              className="h-9 min-h-9 w-full shrink-0 gap-1.5 px-2 py-0 text-xs"
              style={{ backgroundColor: '#60a5fa', borderColor: '#3b82f6', color: '#000000' }}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              Crea / Modifica Categoria
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={openPresetMenusSection}
              aria-label="Crea / Modifica Menù preselezionati"
              title="Crea / Modifica Menù preselezionati"
              className="h-9 min-h-9 w-full shrink-0 gap-1.5 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-r from-[rgba(45,212,191,0.38)] via-teal-100/90 to-white px-2 py-0 text-center text-xs font-semibold text-amber-950 shadow-sm truncate hover:bg-transparent hover:brightness-[0.97]"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              Crea / Modifica Menù preselezionati
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={openPromoEditor}
              disabled={volAuVentPromoLoading || upsertRestaurantSetting.isPending}
              aria-label="Crea / Modifica promo menù"
              title="Crea / Modifica promo menù"
              className="h-9 min-h-9 w-full shrink-0 gap-1.5 whitespace-normal rounded-lg border border-slate-200 bg-gradient-to-r from-[rgba(45,212,191,0.38)] via-teal-100/90 to-white px-2 py-0 text-center text-xs font-semibold leading-snug text-amber-950 shadow-sm hover:bg-transparent hover:brightness-[0.97] disabled:opacity-60"
            >
              <Edit className="h-3.5 w-3.5 shrink-0" />
              Crea / Modifica promo menù
            </Button>
          </div>
        </div>

        {viewMode === 'menu' && (
          <div className="mt-auto flex flex-col gap-3 border-t border-[color:var(--admin-warm-wrap-border)] pt-3">
            <label className="flex cursor-pointer items-start gap-2.5 text-left text-xs font-semibold leading-snug text-gray-800 sm:items-center sm:text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-400 sm:mt-0"
                checked={staffPresetsVisible}
                disabled={staffPresetVisibleLoading || upsertRestaurantSetting.isPending}
                onChange={(e) =>
                  upsertRestaurantSetting.mutate([
                    { key: 'booking_staff_presets_visible', value: e.target.checked },
                  ])
                }
              />
              Mostra nella pagina prenota i menù consigliati dallo staff
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-left text-xs font-semibold leading-snug text-gray-800 sm:items-center sm:text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-400 sm:mt-0"
                checked={volAuVentPromoVisible}
                disabled={volAuVentPromoLoading || upsertRestaurantSetting.isPending}
                onChange={(e) =>
                  upsertRestaurantSetting.mutate([
                    { key: 'booking_vol_au_vent_promo_visible', value: e.target.checked },
                  ])
                }
              />
              Mostra nella pagina prenota un&apos;offerta per incentivare la scelta di più ingredienti nel menù
            </label>
          </div>
        )}
      </section>
      {viewMode === 'categories' && isAddingCategory && (
        <>
          <div
            className="w-full"
            style={{
              height: '24px',
              backgroundImage: ADMIN_WARM_GRADIENT_SURFACE.backgroundImage
            }}
          />
          <div
            className="relative w-full rounded-2xl border-t-2 p-4 shadow-lg"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            <button
              type="button"
              onClick={() => {
                setViewMode('menu')
                setIsAddingCategory(false)
                setNewCategoryLabel('')
                setEditingCategoryId(null)
              }}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-warm-wood/40 bg-white/90 text-warm-wood shadow-sm transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-warm-wood/40"
              aria-label="Chiudi inserimento categoria"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto w-[60%] sm:w-2/3">
              <Input
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                placeholder="Nuova categoria ingredienti"
                className="h-14 w-full rounded-2xl pl-6"
                style={{ height: '56px', borderRadius: '18px', paddingLeft: '24px' }}
              />
            </div>
            <Button
              variant="success"
              size="md"
              onClick={handleSaveCategory}
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              className="absolute top-1/2 -translate-y-1/2 shrink-0"
              style={{
                position: 'absolute',
                left: 'auto',
                right: 'clamp(8px, 2vw, 16px)',
                height: '50px',
                minWidth: '74px',
                backgroundColor: '#16a34a',
                color: '#ffffff'
              }}
            >
              <Save className="h-4 w-4" />
              Salva
            </Button>
          </div>
        </>
      )}

      {/* Form Aggiunta/Modifica */}
      {viewMode === 'products' && (isAdding || editingId) && (
        <div
          className="relative w-full rounded-2xl border-2 p-6 shadow-lg"
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
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#16a34a', color: '#ffffff', borderColor: '#15803d' }}
              >
                <Save className="h-4 w-4" />
                Salva
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                style={{ borderColor: '#dc2626', color: '#dc2626' }}
              >
                <X className="h-4 w-4" />
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'menu' && (
      <>
      {promoEditorOpen && (
        <div
          ref={promoEditorPanelRef}
          className="mt-4 w-full rounded-xl border-2 bg-white p-4 shadow-sm md:p-5"
          style={{ borderColor: ADMIN_WARM_BORDER }}
          role="region"
          aria-label="Editor testo promo pagina prenotazione"
        >
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-base font-semibold text-slate-800 md:text-lg">
              Testo della promo sulla pagina prenotazione
            </h3>
            <button
              type="button"
              onClick={() => setPromoEditorOpen(false)}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Chiudi editor promo"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {!volAuVentPromoVisible && (
            <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
              La checkbox &quot;Mostra nella pagina prenota un&apos;offerta…&quot; è disattivata: questo testo non sarà
              visibile finché non la riattivi.
            </p>
          )}
          <label
            htmlFor="vol-au-vent-promo-textarea"
            className="mb-1 mt-2 block text-xs font-semibold text-gray-700"
          >
            Inserisci il testo della promozione
          </label>
          <Textarea
            id="vol-au-vent-promo-textarea"
            value={promoDraft}
            onChange={(e) => setPromoDraft(e.target.value)}
            placeholder={VOL_AU_VENT_PROMO_PLACEHOLDER}
            rows={6}
            maxLength={500}
            className="min-h-[140px] resize-y border-slate-300 bg-white text-slate-900"
            aria-label="Inserisci il testo della promozione"
          />
          <p className="mt-1 text-xs text-gray-500">{promoDraft.length}/500</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              disabled={upsertRestaurantSetting.isPending}
              onClick={() => void handleSaveVolAuVentPromoMessage()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: '#16a34a', color: '#ffffff', borderColor: '#15803d' }}
            >
              <Save className="h-4 w-4" />
              Salva
            </button>
          </div>
        </div>
      )}

      <div className={menuPricesCategoryListWrapClass}>
      {categoryEntries.map(([category, label]) => {
        const items = itemsByCategory[category] || []
        if (items.length === 0 && !isAdding && !editingId) return null

        return (
          <div
            key={category}
            className="menu-prices-category-block flex w-full flex-col items-center px-1 sm:px-2"
          >
            <h3
              className="booking-section-title-mobile booking-mobile-subheading flex w-full items-center justify-center border-b border-gray-300 pb-2 text-center text-lg md:text-xl"
              style={adminMenuCategoryTitleStyle}
            >
              {label}
            </h3>
            <div
              className="mx-auto flex w-full max-w-5xl flex-col items-stretch gap-4"
              style={{ marginTop: '0', paddingTop: '0.5rem' }}
            >
              {items.length === 0 ? (
                <p className="py-4 text-center text-gray-500">Nessun prodotto in questa categoria</p>
              ) : (
                items.map((item) => (
                  <AdminMenuIngredientCard
                    key={item.id}
                    item={item}
                    onEdit={() => handleStartEdit(item)}
                    onDelete={() => handleDelete(item.id, item.name)}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
      </div>
      </>
      )}

      {viewMode === 'preset_menus' && (
        <>
          <div
            className="w-full"
            style={{
              height: '24px',
              backgroundImage: ADMIN_WARM_GRADIENT_SURFACE.backgroundImage,
            }}
          />
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
                Compila un nome, seleziona gli ingredienti come in prenotazione e salva: compariranno nel menu a
                tendina insieme ai quattro menù classici (se la casella sopra è attiva).
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
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: '#16a34a', color: '#ffffff', borderColor: '#15803d' }}
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
                      className="flex items-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                      style={{ borderColor: '#dc2626', color: '#dc2626' }}
                    >
                      <X className="h-4 w-4" />
                      Indietro
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {viewMode === 'products' && (
        <div className={menuPricesCategoryListWrapClass}>
          <div className="menu-prices-category-block flex w-full flex-col items-center px-1 sm:px-2 md:col-span-2">
            <h3
              className="booking-section-title-mobile booking-mobile-subheading flex w-full items-center justify-center border-b border-gray-300 pb-2 text-center text-lg md:text-xl"
              style={adminMenuCategoryTitleStyle}
            >
              Prodotti Menu
            </h3>
            <div
              className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2"
              style={{ marginTop: '0', paddingTop: '0.5rem' }}
            >
              {menuItems.length === 0 ? (
                <p className="col-span-full py-4 text-center text-gray-500">Nessun prodotto inserito</p>
              ) : (
                menuItems.map((item) => (
                  <AdminMenuIngredientCard
                    key={item.id}
                    item={item}
                    onEdit={() => handleStartEdit(item)}
                    onDelete={() => handleDelete(item.id, item.name)}
                    metaLine={
                      categoryEntries.find(([key]) => key === item.category)?.[1] ?? item.category
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {viewMode === 'categories' && (
        <div className={menuPricesCategoryListWrapClass}>
          <div className="menu-prices-category-block flex w-full flex-col items-center px-1 sm:px-2 md:col-span-2">
            <h3
              className="booking-section-title-mobile booking-mobile-subheading flex w-full items-center justify-center border-b border-gray-300 pb-2 text-center text-lg md:text-xl"
              style={adminMenuCategoryTitleStyle}
            >
              Categorie Menu
            </h3>
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
      )}
    </div>
  )
}
