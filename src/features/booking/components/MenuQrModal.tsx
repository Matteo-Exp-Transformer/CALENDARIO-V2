import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button, Input } from '@/components/ui'
import { generateShortCode } from '@/lib/shortCodeGenerator'
import type { MenuQrCode, MenuQrCodeInput } from '@/types/menu'
import type { MenuCategoryRecord } from '../hooks/useMenuCategories'
import type { CustomStaffPreset } from '../constants/presetMenus'

type ContentType = 'a_la_carte' | 'preset_menus' | 'mixed'

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

const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string; desc: string }[] = [
  { value: 'a_la_carte', label: 'Solo carta', desc: 'Mostra le categorie del menu alla carta' },
  { value: 'preset_menus', label: 'Solo menù eventi', desc: 'Mostra i menù preselezionati (lauree, ecc.)' },
  { value: 'mixed', label: 'Entrambi', desc: 'Carta + Menù eventi nella stessa pagina' },
]

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
  const [contentType, setContentType] = useState<ContentType>('a_la_carte')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [presetIds, setPresetIds] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) return
    if (editing) {
      setName(editing.name)
      setContentType(editing.content_type)
      setCategoryFilter(editing.category_filter ?? [])
      setPresetIds(editing.preset_ids ?? [])
    } else {
      setName('')
      setContentType('a_la_carte')
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

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    const shortCode = editing?.short_code ?? generateShortCode()
    const input: MenuQrCodeInput = {
      name: trimmed,
      content_type: contentType,
      category_filter: categoryFilter.length > 0 ? categoryFilter : null,
      preset_ids: presetIds.length > 0 ? presetIds : null,
      is_active: editing?.is_active ?? true,
    }
    onSave(shortCode, input)
  }

  const showCategoryFilter = contentType === 'a_la_carte' || contentType === 'mixed'
  const showPresetFilter = contentType === 'preset_menus' || contentType === 'mixed'

  const previewUrl = editing ? `${baseUrl}/menu/[slug]/qr/${editing.short_code}` : null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Modifica QR' : 'Nuovo QR menu'}
      size="md"
      showCloseButton
      closeOnOverlayClick={!isPending}
      closeOnEscape={!isPending}
    >
      <div className="flex flex-col gap-5">
        {/* Nome */}
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

        {/* Tipo contenuto */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Cosa mostrare *</p>
          <div className="flex flex-col gap-2">
            {CONTENT_TYPE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3"
              >
                <input
                  type="radio"
                  name="content-type"
                  value={opt.value}
                  checked={contentType === opt.value}
                  onChange={() => setContentType(opt.value)}
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Filtro categorie */}
        {showCategoryFilter && categories.length > 0 && (
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">
              Categorie visibili{' '}
              <span className="font-normal text-gray-500">(lascia vuoto = tutte)</span>
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
                    checked={categoryFilter.includes(cat.key)}
                    onChange={() => toggleCategory(cat.key)}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filtro preset */}
        {showPresetFilter && presets.length > 0 && (
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

        {/* Azioni */}
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
      </div>
    </Modal>
  )
}
