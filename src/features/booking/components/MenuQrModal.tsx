import { useEffect, useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'react-toastify'
import { Modal } from '@/components/ui/Modal'
import { Button, Input } from '@/components/ui'
import { generateShortCode } from '@/lib/shortCodeGenerator'
import { useTenantContext } from '@/contexts/TenantContext'
import { useMenuQrcodeCategoriesForQr } from '../hooks/useMenuQrcodeCategories'
import { useMenuItems } from '../hooks/useMenuItems'
import { groupMenuItemsByCategory } from '../utils/menuCatalogGrouping'
import {
  MenuQrCarouselSection,
  MenuQrCategoryCardsSection,
  MenuQrThemeSection,
  buildCategoryOverrideDrafts,
  type CategoryOverrideDraft,
} from './MenuHomepageConfigPanel'
import { DEFAULT_THEME_KEY, MENU_THEMES, type MenuThemeKey } from '@/features/public-menu/menuThemes'

function normalizeThemeKey(key: string | undefined | null): MenuThemeKey {
  if (key && key in MENU_THEMES) return key as MenuThemeKey
  return DEFAULT_THEME_KEY
}
import type { CarouselItem, MenuItem, MenuQrCode, MenuQrSettingsSavePayload } from '@/types/menu'
import type { MenuCategoryRecord } from '../hooks/useMenuCategories'
import type { CustomStaffPreset } from '../constants/presetMenus'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: MenuQrSettingsSavePayload) => void
  isPending: boolean
  editing: MenuQrCode | null
  categories: MenuCategoryRecord[]
  presets: CustomStaffPreset[]
  tenantSlug: string | null
}

function resolveCategoryFilterForUi(
  raw: string[] | null,
  keysWithItems: string[],
): string[] {
  if (raw === null) return [...keysWithItems]
  return raw
}

function pruneHiddenItemIds(
  hiddenIds: string[],
  itemsByCategory: Record<string, MenuItem[]>,
  selectedKeys: string[],
): string[] {
  const allowedIds = new Set<string>()
  for (const key of selectedKeys) {
    for (const item of itemsByCategory[key] ?? []) {
      allowedIds.add(item.id)
    }
  }
  return hiddenIds.filter((id) => allowedIds.has(id))
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Link copiato')
  } catch {
    toast.error('Impossibile copiare')
  }
}

export function MenuQrModal({
  isOpen,
  onClose,
  onSave,
  isPending,
  editing,
  categories,
  presets,
  tenantSlug,
}: Props) {
  const { tenantId } = useTenantContext()
  const menuQrCodeId = editing?.id ?? null
  const { data: overrides = [] } = useMenuQrcodeCategoriesForQr(menuQrCodeId)
  const { data: menuItems = [] } = useMenuItems()

  const [draftShortCode, setDraftShortCode] = useState(() => generateShortCode())
  const [name, setName] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [presetIds, setPresetIds] = useState<string[]>([])
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const [themeKey, setThemeKey] = useState<MenuThemeKey>(DEFAULT_THEME_KEY)
  const [overrideDrafts, setOverrideDrafts] = useState<CategoryOverrideDraft>({})
  const [hiddenItemIds, setHiddenItemIds] = useState<string[]>([])

  const categoriesWithItems = useMemo(() => {
    const keysWithItems = new Set(menuItems.map((i) => i.category))
    return categories.filter((c) => keysWithItems.has(c.key))
  }, [categories, menuItems])

  const categoryKeysWithItems = useMemo(
    () => categoriesWithItems.map((c) => c.key),
    [categoriesWithItems],
  )

  const itemsByCategory = useMemo(
    () => groupMenuItemsByCategory(menuItems, categoryKeysWithItems),
    [menuItems, categoryKeysWithItems],
  )

  const selectedCategories = useMemo(
    () => categoriesWithItems.filter((c) => categoryFilter.includes(c.key)),
    [categoriesWithItems, categoryFilter],
  )

  const activeShortCode = editing?.short_code ?? draftShortCode

  useEffect(() => {
    if (!isOpen) return
    if (editing) {
      setName(editing.name)
      setCategoryFilter(resolveCategoryFilterForUi(editing.category_filter, categoryKeysWithItems))
      setPresetIds(editing.preset_ids ?? [])
      setCarouselItems(editing.carousel_items ?? [])
      setCategoryImages(editing.category_images ?? {})
      setThemeKey(normalizeThemeKey(editing.theme_key))
      setHiddenItemIds(editing.hidden_menu_item_ids ?? [])
    } else {
      setDraftShortCode(generateShortCode())
      setName('')
      setCategoryFilter([])
      setPresetIds([])
      setCarouselItems([])
      setCategoryImages({})
      setThemeKey(DEFAULT_THEME_KEY)
      setHiddenItemIds([])
      setOverrideDrafts(buildCategoryOverrideDrafts(categories, []))
    }
  }, [isOpen, editing, categoryKeysWithItems, categories])

  useEffect(() => {
    if (!isOpen || !editing) return
    setOverrideDrafts(buildCategoryOverrideDrafts(categories, overrides))
  }, [isOpen, editing, categories, overrides])

  useEffect(() => {
    if (!isOpen || editing) return
    setOverrideDrafts(buildCategoryOverrideDrafts(categories, []))
  }, [isOpen, editing, categories])

  const allCatsSelected =
    categoryKeysWithItems.length > 0 &&
    categoryKeysWithItems.every((k) => categoryFilter.includes(k))

  const toggleAllCategories = () => {
    setCategoryFilter(allCatsSelected ? [] : [...categoryKeysWithItems])
  }

  const toggleCategory = (key: string) => {
    setCategoryFilter((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const togglePreset = (id: string) => {
    setPresetIds((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id],
    )
  }

  const buildPayload = (): MenuQrSettingsSavePayload | null => {
    const trimmed = name.trim()
    if (!trimmed) return null

    const shortCode = activeShortCode
    const prunedHidden = pruneHiddenItemIds(hiddenItemIds, itemsByCategory, categoryFilter)

    const filteredCategoryImages = Object.fromEntries(
      Object.entries(categoryImages).filter(([key]) => categoryFilter.includes(key)),
    )

    const categoryOverrides = selectedCategories.map((cat) => {
      const d = overrideDrafts[cat.key] ?? { title: cat.label, description: cat.description ?? '' }
      return {
        category_key: cat.key,
        title: d.title.trim() || null,
        description: d.description.trim() || null,
      }
    })

    return {
      shortCode,
      qrId: editing?.id ?? null,
      draftShortCode: editing ? null : draftShortCode,
      input: {
        name: trimmed,
        content_type: editing?.content_type ?? 'a_la_carte',
        category_filter: categoryFilter,
        preset_ids: presetIds.length > 0 ? presetIds : null,
        is_active: editing?.is_active ?? true,
        theme_key: themeKey,
        carousel_items: carouselItems,
        category_images: filteredCategoryImages,
        hidden_menu_item_ids: prunedHidden,
      },
      categoryOverrides,
    }
  }

  const handleSave = () => {
    const payload = buildPayload()
    if (payload) onSave(payload)
  }

  const previewUrl =
    tenantSlug && activeShortCode
      ? `${window.location.origin}/menu/${tenantSlug}/qr/${activeShortCode}`
      : null

  const headerBelow = previewUrl ? (
    <div className="flex items-center gap-2">
      <p className="min-w-0 flex-1 truncate rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs text-gray-500">
        {previewUrl}
      </p>
      <button
        type="button"
        className="is-clickable shrink-0 rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
        aria-label="Copia link menu QR"
        title="Copia link"
        onClick={() => void copyToClipboard(previewUrl)}
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  ) : null

  const bottomBar = (
    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
      <Button variant="ghost" onClick={onClose} disabled={isPending}>
        Annulla
      </Button>
      <Button variant="primary" onClick={handleSave} disabled={isPending || !name.trim()}>
        {isPending ? 'Salvataggio…' : 'Salva'}
      </Button>
    </div>
  )

  if (!tenantId) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Impostazione Menù QR"
      headerBelow={headerBelow}
      size="lg"
      showCloseButton
      closeOnOverlayClick={!isPending}
      closeOnEscape={!isPending}
    >
      <div className="flex max-h-[min(80vh,720px)] flex-col gap-4 overflow-y-auto">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <label className="text-sm font-medium text-gray-700">Nome QR *</label>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isPending || !name.trim()}>
              {isPending ? 'Salvataggio…' : 'Salva'}
            </Button>
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Tavoli sala, Menu eventi…"
            maxLength={80}
          />
        </div>

        {categoryKeysWithItems.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-700">Categorie di prodotti visibili</p>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5"
                  checked={allCatsSelected}
                  onChange={toggleAllCategories}
                />
                Attiva tutte
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoriesWithItems.map((cat) => (
                <label
                  key={cat.key}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 shrink-0"
                    checked={categoryFilter.includes(cat.key)}
                    onChange={() => toggleCategory(cat.key)}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Nessuna categoria con prodotti — aggiungi ingredienti nella tab Menu.
          </p>
        )}

        {presets.length > 0 && (
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">
              Menù eventi visibili{' '}
              <span className="font-normal text-gray-500">(lascia vuoto = tutti)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <label
                  key={preset.id}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 shrink-0"
                    checked={presetIds.includes(preset.id)}
                    onChange={() => togglePreset(preset.id)}
                  />
                  {preset.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Carosello specialità
          </h4>
          <MenuQrCarouselSection
            tenantId={tenantId}
            menuQrCodeId={menuQrCodeId}
            draftShortCode={editing ? null : draftShortCode}
            items={carouselItems}
            onChange={setCarouselItems}
          />
        </section>

        <section>
          <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            Titoli e descrizioni categorie
          </h4>
          <p className="mb-3 text-xs text-gray-500">
            Titolo e descrizione visibili solo nella pagina di questo Menù QR che vedranno i clienti.
          </p>
          <MenuQrCategoryCardsSection
            tenantId={tenantId}
            menuQrCodeId={menuQrCodeId}
            draftShortCode={editing ? null : draftShortCode}
            categories={selectedCategories}
            categoryImages={categoryImages}
            overrideDrafts={overrideDrafts}
            onCategoryImagesChange={setCategoryImages}
            onOverrideDraftsChange={setOverrideDrafts}
            itemsByCategory={itemsByCategory}
            hiddenItemIds={hiddenItemIds}
            onHiddenItemIdsChange={setHiddenItemIds}
          />
        </section>

        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Tema homepage</h4>
          <MenuQrThemeSection value={themeKey} onChange={setThemeKey} />
        </section>

        {bottomBar}
      </div>
    </Modal>
  )
}
