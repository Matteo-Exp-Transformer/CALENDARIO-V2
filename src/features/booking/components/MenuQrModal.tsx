import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button, Input } from '@/components/ui'
import { generateShortCode } from '@/lib/shortCodeGenerator'
import { MenuHomepageConfigPanel } from './MenuHomepageConfigPanel'
import type { MenuQrCode, MenuQrCodeInput } from '@/types/menu'
import type { MenuCategoryRecord } from '../hooks/useMenuCategories'
import type { CustomStaffPreset } from '../constants/presetMenus'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (shortCode: string, input: MenuQrCodeInput) => void
  isPending: boolean
  editing: MenuQrCode | null
  categories: MenuCategoryRecord[]
  presets: CustomStaffPreset[]
  baseUrl: string
}

export function MenuQrModal({
  isOpen,
  onClose,
  onSave,
  isPending,
  editing,
  categories,
  presets,
  baseUrl,
}: Props) {
  const [name, setName] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [presetIds, setPresetIds] = useState<string[]>([])
  const allCategoryKeys = categories.map((c) => c.key)

  useEffect(() => {
    if (!isOpen) return
    if (editing) {
      setName(editing.name)
      setCategoryFilter(editing.category_filter ?? [])
      setPresetIds(editing.preset_ids ?? [])
    } else {
      setName('')
      setCategoryFilter([])
      setPresetIds([])
    }
  }, [isOpen, editing])

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

  const allCatsSelected =
    categoryFilter.length === 0 || categoryFilter.length === allCategoryKeys.length

  const toggleAllCategories = () => {
    setCategoryFilter(allCatsSelected ? [] : allCategoryKeys)
  }

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    const shortCode = editing?.short_code ?? generateShortCode()
    const input: MenuQrCodeInput = {
      name: trimmed,
      content_type: 'a_la_carte',
      category_filter: categoryFilter.length > 0 ? categoryFilter : null,
      preset_ids: presetIds.length > 0 ? presetIds : null,
      is_active: editing?.is_active ?? true,
    }
    onSave(shortCode, input)
  }

  const previewUrl = editing ? `${baseUrl}/menu/[slug]/qr/${editing.short_code}` : null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Modifica QR' : 'Nuovo QR menu'}
      size="lg"
      showCloseButton
      closeOnOverlayClick={!isPending}
      closeOnEscape={!isPending}
    >
      <div className="flex flex-col gap-6">
        {/* Nome QR */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nome QR *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Tavoli sala, Menu eventi…"
            maxLength={80}
          />
        </div>

        {/* Categorie visibili */}
        {categories.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-700">
                Categorie visibili
              </p>
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
            <p className="mb-2 text-xs text-gray-400">
              Nessuna selezione = tutte le categorie visibili
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <label
                  key={cat.key}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 shrink-0"
                    checked={categoryFilter.length === 0 || categoryFilter.includes(cat.key)}
                    onChange={() => toggleCategory(cat.key)}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filtro preset */}
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

        {/* Preview link */}
        {previewUrl && (
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 break-all">
            {previewUrl}
          </p>
        )}

        {/* Azioni QR */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isPending || !name.trim()}
          >
            {isPending ? 'Salvataggio…' : editing ? 'Salva modifiche' : 'Crea QR'}
          </Button>
        </div>

        {/* Separatore + pannello aspetto homepage */}
        <div className="border-t border-gray-200 pt-4">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
            Aspetto homepage menu
          </p>
          <p className="mb-4 text-xs text-amber-700 rounded-lg bg-amber-50 px-3 py-2">
            L'aspetto è condiviso tra tutti i QR del ristorante.
          </p>
          <MenuHomepageConfigPanel />
        </div>
      </div>
    </Modal>
  )
}
