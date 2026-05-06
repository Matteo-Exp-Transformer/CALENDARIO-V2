import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { Button, Input } from '@/components/ui'
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

const DEFAULT_CATEGORY_LABELS: Record<string, string> = {
  bevande: 'Bevande',
  pizza: 'Pizza',
  antipasti: 'Antipasti',
  fritti: 'Fritti',
  primi: 'Primi Piatti',
  secondi: 'Secondi Piatti',
  dolci: 'Dolci'
}

const DEFAULT_CATEGORY_ORDER = Object.keys(DEFAULT_CATEGORY_LABELS)

const slugifyCategory = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

type MenuViewMode = 'menu' | 'products' | 'categories'

export const MenuPricesTab: React.FC = () => {
  const { data: menuItems = [], isLoading } = useMenuItems()
  const { data: dbCategories = [] } = useMenuCategories()
  const createMutation = useCreateMenuItem()
  const createCategoryMutation = useCreateMenuCategory()
  const updateCategoryMutation = useUpdateMenuCategory()
  const deleteCategoryMutation = useDeleteMenuCategory()
  const updateMutation = useUpdateMenuItem()
  const deleteMutation = useDeleteMenuItem()

  const [viewMode, setViewMode] = useState<MenuViewMode>('menu')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryLabel, setNewCategoryLabel] = useState('')
  /** Stringa controllata per l’input prezzo: evita lo 0 “incollato” con `parseFloat(...) || 0` su campo vuoto. */
  const [priceInput, setPriceInput] = useState('')
  const mergedCategoryEntries = useMemo(() => {
    const map = new Map<string, string>()
    DEFAULT_CATEGORY_ORDER.forEach((key) => {
      map.set(key, DEFAULT_CATEGORY_LABELS[key])
    })
    dbCategories.forEach((category) => {
      map.set(category.key, category.label)
    })
    return Array.from(map.entries())
  }, [dbCategories])


  const categoryKeys = useMemo(
    () => mergedCategoryEntries.map(([key]) => key),
    [mergedCategoryEntries]
  )
  const dbCategoryByKey = useMemo(
    () => new Map(dbCategories.map((category) => [category.key, category])),
    [dbCategories]
  )

  const [formData, setFormData] = useState<MenuItemInput>({
    name: '',
    category: categoryKeys[0] ?? 'bevande',
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
      category: categoryKeys[0] ?? 'bevande',
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
      category: categoryKeys[0] ?? 'bevande',
      price: 0,
      description: '',
      sort_order: 0
    })
  }

  const handleAddCategory = () => {
    const rawLabel = newCategoryLabel.trim()
    if (!rawLabel) {
      toast.error('Inserisci il nome della categoria')
      return
    }

    const key = slugifyCategory(rawLabel)
    if (!key) {
      toast.error('Nome categoria non valido')
      return
    }

    if (categoryKeys.includes(key)) {
      toast.error('Categoria già presente')
      return
    }

    createCategoryMutation.mutate(
      { key, label: rawLabel, sort_order: 999 },
      {
        onSuccess: () => {
          setViewMode('menu')
          setIsAddingCategory(false)
          setNewCategoryLabel('')
          setFormData((prev) => ({ ...prev, category: key }))
        }
      }
    )
  }

  const handleEditCategory = (categoryKey: string, currentLabel: string) => {
    const dbCategory = dbCategoryByKey.get(categoryKey)
    if (!dbCategory) {
      toast.error('Categoria non modificabile')
      return
    }

    const newLabel = prompt('Nuovo nome categoria', currentLabel)?.trim()
    if (!newLabel || newLabel === currentLabel) {
      return
    }

    updateCategoryMutation.mutate({ id: dbCategory.id, label: newLabel })
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

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Il nome è obbligatorio')
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

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload })
    } else {
      createMutation.mutate(payload)
    }

    handleCancel()
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
        className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl shadow-sm px-4 py-2 md:gap-x-5 md:px-5 md:py-2 min-h-[88px]"
        style={ADMIN_WARM_GRADIENT_SURFACE}
      >
        <h2
          id="menu-prices-heading"
          className="justify-self-start font-serif text-base font-bold leading-none text-warm-wood sm:text-lg"
        >
          Menu
        </h2>
        <p
          className="min-w-0 justify-self-center px-1 text-center text-xs leading-snug text-gray-600 max-[729px]:hidden sm:px-2 sm:text-sm"
          title="Aggiungi, modifica o elimina le voci del menu e i prezzi"
        >
          Aggiungi, modifica o elimina le voci del menu e i prezzi
        </p>
        <div className="justify-self-end flex flex-col items-end gap-4" style={{ rowGap: '16px' }}>
          <Button
            variant="success"
            size="sm"
            onClick={handleStartAdd}
            className="h-8 shrink-0 gap-1.5 px-3 py-0 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Aggiungi / Modifica Prodotto
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setViewMode('categories')
              setIsAdding(false)
              setEditingId(null)
              setIsAddingCategory(true)
            }}
            className="h-8 shrink-0 gap-1.5 px-3 py-0 text-xs"
            style={{ marginTop: '8px', backgroundColor: '#60a5fa', borderColor: '#3b82f6', color: '#000000' }}
          >
            <Plus className="h-3.5 w-3.5" />
            Aggiungi / Modifica Categoria
          </Button>
        </div>
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
              onClick={handleAddCategory}
              disabled={createCategoryMutation.isPending}
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
                    {mergedCategoryEntries.map(([value, label]) => (
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
                  onChange={(e) => setPriceInput(e.target.value)}
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#16a34a', color: '#000000' }}
              >
                <Save className="h-4 w-4" />
                {editingId ? 'Salva Modifiche' : 'Aggiungi'}
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
      <div className="menu-prices-category-list-wrap flex flex-col items-center gap-[28px]">
      {mergedCategoryEntries.map(([category, label]) => {
        const items = itemsByCategory[category] || []
        if (items.length === 0 && !isAdding && !editingId) return null

        return (
          <div key={category} className="menu-prices-category-card bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-warm-wood to-warm-wood-dark px-6 py-4 text-center">
              <h3 className="text-xl font-serif font-bold text-white">{label}</h3>
            </div>
            <div className="flex flex-col items-center p-6 text-center">
              {items.length === 0 ? (
                <p className="text-gray-500 py-4">Nessun prodotto in questa categoria</p>
              ) : (
                <div className="flex w-full max-w-full flex-col items-center gap-[12px]">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="menu-prices-item-row"
                    >
                      <div className="menu-prices-item-text overflow-hidden">
                        <div className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-warm-wood">
                            €{item.price.toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                      <div className="menu-prices-item-actions shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="menu-prices-icon-btn menu-prices-icon-btn--edit"
                          aria-label={`Modifica ${item.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="menu-prices-icon-btn menu-prices-icon-btn--delete"
                          aria-label={`Elimina ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
      </div>
      )}
      {viewMode === 'products' && (
        <div className="menu-prices-category-list-wrap flex flex-col items-center gap-[28px]">
          <div className="menu-prices-category-card bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-warm-wood to-warm-wood-dark px-6 py-4 text-center">
              <h3 className="text-xl font-serif font-bold text-white">Prodotti Menu</h3>
            </div>
            <div className="flex flex-col items-center p-6 text-center">
              {menuItems.length === 0 ? (
                <p className="text-gray-500 py-4">Nessun prodotto inserito</p>
              ) : (
                <div className="flex w-full max-w-full flex-col items-center gap-[12px]">
                  {menuItems.map((item) => (
                    <div key={item.id} className="menu-prices-item-row">
                      <div className="menu-prices-item-text overflow-hidden">
                        <div className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-warm-wood">
                            €{item.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {mergedCategoryEntries.find(([key]) => key === item.category)?.[1] ?? item.category}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                      <div className="menu-prices-item-actions shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="menu-prices-icon-btn menu-prices-icon-btn--edit"
                          aria-label={`Modifica ${item.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="menu-prices-icon-btn menu-prices-icon-btn--delete"
                          aria-label={`Elimina ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {viewMode === 'categories' && (
        <div className="menu-prices-category-list-wrap flex flex-col items-center gap-[28px]">
          <div className="menu-prices-category-card bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-warm-wood to-warm-wood-dark px-6 py-4 text-center">
              <h3 className="text-xl font-serif font-bold text-white">Categorie Menu</h3>
            </div>
            <div className="flex flex-col items-center p-6 text-center">
              <div className="flex w-full max-w-full flex-col items-center gap-[12px]">
                {mergedCategoryEntries.map(([key, label]) => (
                  <div
                    key={key}
                    className="menu-prices-item-row"
                    style={{ padding: '0.5rem 1rem', minHeight: '72px' }}
                  >
                    <div className="menu-prices-item-text overflow-hidden">
                      <div className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-1">
                        <h4 className="font-semibold text-gray-900">{label}</h4>
                      </div>
                    </div>
                    <div className="menu-prices-item-actions shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(key, label)}
                        className="menu-prices-icon-btn menu-prices-icon-btn--edit"
                        aria-label={`Modifica ${label}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(key, label)}
                        className="menu-prices-icon-btn menu-prices-icon-btn--delete"
                        aria-label={`Elimina ${label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
