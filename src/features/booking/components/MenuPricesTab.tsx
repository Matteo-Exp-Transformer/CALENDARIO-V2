import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { Button, Input } from '@/components/ui'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '../hooks/useMenuItems'
import type { MenuItem, MenuItemInput, MenuCategory } from '@/types/menu'

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  bevande: 'Bevande',
  pizza: 'Pizza',
  antipasti: 'Antipasti',
  fritti: 'Fritti',
  primi: 'Primi Piatti',
  secondi: 'Secondi Piatti',
  dolci: 'Dolci'
}

export const MenuPricesTab: React.FC = () => {
  const { data: menuItems = [], isLoading } = useMenuItems()
  const createMutation = useCreateMenuItem()
  const updateMutation = useUpdateMenuItem()
  const deleteMutation = useDeleteMenuItem()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  /** Stringa controllata per l’input prezzo: evita lo 0 “incollato” con `parseFloat(...) || 0` su campo vuoto. */
  const [priceInput, setPriceInput] = useState('')
  const [formData, setFormData] = useState<MenuItemInput>({
    name: '',
    category: 'bevande',
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
  }, {} as Record<MenuCategory, MenuItem[]>)

  const handleStartEdit = (item: MenuItem) => {
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
    setIsAdding(true)
    setEditingId(null)
    setPriceInput('')
    setFormData({
      name: '',
      category: 'bevande',
      price: 0,
      description: '',
      sort_order: 0
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setPriceInput('')
    setFormData({
      name: '',
      category: 'bevande',
      price: 0,
      description: '',
      sort_order: 0
    })
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
        className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl border shadow-sm px-4 py-2 md:gap-x-5 md:px-5 md:py-2"
        style={ADMIN_WARM_GRADIENT_SURFACE}
      >
        <h2
          id="menu-prices-heading"
          className="justify-self-start font-serif text-base font-bold leading-none text-warm-wood sm:text-lg"
        >
          Menu
        </h2>
        <p
          className="min-w-0 justify-self-center px-1 text-center text-xs leading-snug text-gray-600 sm:px-2 sm:text-sm"
          title="Aggiungi, modifica o elimina le voci del menu e i prezzi"
        >
          Aggiungi, modifica o elimina le voci del menu e i prezzi
        </p>
        <div className="justify-self-end">
          <Button
            variant="success"
            size="sm"
            onClick={handleStartAdd}
            className="h-8 shrink-0 gap-1.5 px-3 py-0 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Aggiungi Prodotto
          </Button>
        </div>
      </section>

      {/* Form Aggiunta/Modifica */}
      {(isAdding || editingId) && (
        <div className="bg-gradient-to-br from-warm-cream/50 to-warm-beige/30 rounded-2xl p-6 border-2 border-warm-beige shadow-lg">
          <h3 className="text-xl font-bold text-warm-wood mb-4">
            {editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Prodotto *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="es: Pizza Margherita"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const category = e.target.value as MenuCategory
                  setFormData({
                    ...formData,
                    category
                  })
                }}
                className="flex rounded-full border bg-white/50 backdrop-blur-[6px] shadow-sm transition-all text-gray-600 w-full"
                style={{ 
                  borderColor: 'rgba(0,0,0,0.2)', 
                  height: '56px',
                  padding: '16px',
                  fontSize: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(6px)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B6914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.2)'}
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prezzo (€) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="es: 4.50"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione (opzionale)
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="es: 2 tranci a persona"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-warm-wood to-warm-wood-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-warm-wood/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {editingId ? 'Salva Modifiche' : 'Aggiungi'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 border-2 border-warm-wood text-warm-wood font-semibold rounded-xl transition-all duration-300 hover:bg-warm-wood hover:text-white focus:outline-none focus:ring-4 focus:ring-warm-wood/30"
            >
              <X className="h-4 w-4" />
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Lista prodotti per categoria */}
      <div className="menu-prices-category-list-wrap flex flex-col items-center gap-[28px]">
      {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
        const items = itemsByCategory[category as MenuCategory] || []
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
    </div>
  )
}
