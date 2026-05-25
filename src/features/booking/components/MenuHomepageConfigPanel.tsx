import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { ImagePlus, Trash2, ChevronUp, ChevronDown, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { useMenuCategories } from '../hooks/useMenuCategories'
import { MENU_THEMES, type MenuThemeKey } from '@/features/public-menu/menuThemes'
import type { CarouselItem } from '@/types/menu'
import type { MenuCategoryRecord } from '../hooks/useMenuCategories'
import { menuQrStoragePrefix, menuQrStorageSegment } from '../utils/menuQrStorage'

const BUCKET = 'menu-photos'
const MAX_SIDE_PX = 1200
const MAX_BYTES = 450_000

export const CAROUSEL_SLIDE_TITLE_MAX = 60
export const CAROUSEL_SLIDE_DESCRIPTION_MAX = 125
export const CAROUSEL_SLIDE_EYEBROW_MAX = 40
const DEFAULT_CAROUSEL_EYEBROW = 'Specialità della casa'

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, MAX_SIDE_PX / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      let quality = 0.82
      const tryEncode = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compressione fallita'))
            if (blob.size <= MAX_BYTES || quality <= 0.4) return resolve(blob)
            quality -= 0.12
            tryEncode()
          },
          'image/webp',
          quality,
        )
      }
      tryEncode()
    }
    img.onerror = () => reject(new Error('Impossibile leggere immagine'))
    img.src = url
  })
}

async function uploadToStorage(file: File, path: string): Promise<string> {
  const blob = await compressImage(file)
  const { error } = await (supabase.storage.from(BUCKET) as any).upload(path, blob, {
    contentType: 'image/webp',
    upsert: true,
  })
  if (error) throw new Error((error as any).message ?? 'Upload fallito')
  const { data } = (supabase.storage.from(BUCKET) as any).getPublicUrl(path)
  return (data as { publicUrl: string }).publicUrl
}

async function removeFromStorage(path: string): Promise<void> {
  await (supabase.storage.from(BUCKET) as any).remove([path])
}

export function MenuQrThemeSection({
  value,
  onChange,
}: {
  value: MenuThemeKey
  onChange: (k: MenuThemeKey) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {Object.values(MENU_THEMES).map((theme) => (
        <label
          key={theme.key}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
        >
          <input
            type="radio"
            name="menu-theme"
            value={theme.key}
            checked={value === theme.key}
            onChange={() => onChange(theme.key)}
            className="h-4 w-4 shrink-0"
          />
          <span
            className="h-5 w-5 shrink-0 rounded-full border border-gray-200"
            style={{ background: theme.accentColor }}
          />
          <span className="text-sm text-gray-800">{theme.label}</span>
        </label>
      ))}
    </div>
  )
}

export function MenuQrCarouselSection({
  tenantId,
  menuQrCodeId,
  draftShortCode,
  items,
  onChange,
}: {
  tenantId: string
  menuQrCodeId: string | null
  draftShortCode: string | null
  items: CarouselItem[]
  onChange: (items: CarouselItem[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const storageSegment = menuQrStorageSegment(menuQrCodeId, draftShortCode)
  const canUpload = !!storageSegment

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !storageSegment) return
    setUploading(true)
    try {
      const uuid = crypto.randomUUID()
      const path = `${menuQrStoragePrefix(tenantId, storageSegment)}/carousel/${uuid}.webp`
      const url = await uploadToStorage(file, path)
      onChange([...items, { image_url: url, sort_order: items.length }])
      toast.success('Foto aggiunta')
    } catch {
      toast.error('Errore caricamento foto')
    } finally {
      setUploading(false)
    }
  }

  const moveUp = (i: number) => {
    if (i === 0) return
    const next = [...items]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next.map((x, idx) => ({ ...x, sort_order: idx })))
  }

  const moveDown = (i: number) => {
    if (i === items.length - 1) return
    const next = [...items]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next.map((x, idx) => ({ ...x, sort_order: idx })))
  }

  const remove = async (i: number) => {
    const item = items[i]
    const match = item.image_url.match(/menu-photos\/(.+)$/)
    if (match) await removeFromStorage(match[1])
    onChange(items.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, sort_order: idx })))
  }

  const updateField = (i: number, field: 'eyebrow' | 'title' | 'description', value: string) => {
    const maxLen =
      field === 'title'
        ? CAROUSEL_SLIDE_TITLE_MAX
        : field === 'description'
          ? CAROUSEL_SLIDE_DESCRIPTION_MAX
          : CAROUSEL_SLIDE_EYEBROW_MAX
    const clipped = value.slice(0, maxLen)
    onChange(items.map((x, idx) => (idx === i ? { ...x, [field]: clipped || undefined } : x)))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">Specialità della casa</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/webp,image/jpeg,image/png,image/avif"
          className="hidden"
          onChange={handleAddFile}
        />
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={uploading || !canUpload}
          onClick={() => fileRef.current?.click()}
          className="gap-1.5 text-xs"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          {uploading ? 'Caricamento…' : 'Aggiungi foto'}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 py-6 text-center text-xs text-gray-400">
          Nessuna foto. Nella homepage il carosello mostrerà uno spazio vuoto con il colore del tema.
        </p>
      )}

      {items.map((item, i) => (
        <div
          key={item.image_url}
          className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3"
        >
          <div className="flex items-center gap-3">
            <img src={item.image_url} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
            <div className="flex shrink-0 flex-col gap-0.5">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => moveUp(i)}
                className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                aria-label="Sposta su"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => moveDown(i)}
                className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                aria-label="Sposta giù"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => void remove(i)}
              className="ml-auto shrink-0 rounded p-1 text-red-400 hover:text-red-600"
              aria-label="Rimuovi"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div>
            <input
              type="text"
              value={item.eyebrow ?? ''}
              maxLength={CAROUSEL_SLIDE_EYEBROW_MAX}
              onChange={(e) => updateField(i, 'eyebrow', e.target.value)}
              placeholder={`Etichetta sopra il titolo (default: ${DEFAULT_CAROUSEL_EYEBROW})`}
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
            />
            <p className="mt-0.5 text-right text-[11px] text-gray-400 tabular-nums">
              {(item.eyebrow ?? '').length}/{CAROUSEL_SLIDE_EYEBROW_MAX}
            </p>
          </div>
          <div>
            <input
              type="text"
              value={item.title ?? ''}
              maxLength={CAROUSEL_SLIDE_TITLE_MAX}
              onChange={(e) => updateField(i, 'title', e.target.value)}
              placeholder="Titolo slide (es. Tonno in crosta)"
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
            />
            <p className="mt-0.5 text-right text-[11px] text-gray-400 tabular-nums">
              {(item.title ?? '').length}/{CAROUSEL_SLIDE_TITLE_MAX}
            </p>
          </div>
          <div>
            <input
              type="text"
              value={item.description ?? ''}
              maxLength={CAROUSEL_SLIDE_DESCRIPTION_MAX}
              onChange={(e) => updateField(i, 'description', e.target.value)}
              placeholder="Testo breve (opzionale)"
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
            />
            <p className="mt-0.5 text-right text-[11px] text-gray-400 tabular-nums">
              {(item.description ?? '').length}/{CAROUSEL_SLIDE_DESCRIPTION_MAX}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export type CategoryOverrideDraft = Record<string, { title: string; description: string }>

export function MenuQrCategoryCardsSection({
  tenantId,
  menuQrCodeId,
  draftShortCode,
  categories,
  categoryImages,
  overrideDrafts,
  onCategoryImagesChange,
  onOverrideDraftsChange,
}: {
  tenantId: string
  menuQrCodeId: string | null
  draftShortCode: string | null
  categories: MenuCategoryRecord[]
  categoryImages: Record<string, string>
  overrideDrafts: CategoryOverrideDraft
  onCategoryImagesChange: (images: Record<string, string>) => void
  onOverrideDraftsChange: (drafts: CategoryOverrideDraft) => void
}) {
  const [uploading, setUploading] = useState<string | null>(null)
  const storageSegment = menuQrStorageSegment(menuQrCodeId, draftShortCode)
  const canUpload = !!storageSegment

  const handleFile = async (catKey: string, file: File) => {
    if (!storageSegment) return
    setUploading(catKey)
    try {
      const path = `${menuQrStoragePrefix(tenantId, storageSegment)}/cat/${catKey}.webp`
      const url = await uploadToStorage(file, path)
      onCategoryImagesChange({ ...categoryImages, [catKey]: url })
      toast.success('Foto categoria salvata')
    } catch {
      toast.error('Errore caricamento foto')
    } finally {
      setUploading(null)
    }
  }

  const removeCategoryPhoto = async (catKey: string) => {
    if (!storageSegment) return
    await removeFromStorage(`${menuQrStoragePrefix(tenantId, storageSegment)}/cat/${catKey}.webp`)
    const next = { ...categoryImages }
    delete next[catKey]
    onCategoryImagesChange(next)
  }

  if (categories.length === 0) {
    return <p className="text-xs text-gray-400">Nessuna categoria trovata.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {categories.map((cat) => {
        const imgUrl = categoryImages[cat.key]
        const isUp = uploading === cat.key
        const draft = overrideDrafts[cat.key] ?? { title: cat.label, description: cat.description ?? '' }
        return (
          <div
            key={cat.key}
            className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{cat.label}</span>
            <div className="flex items-center gap-3">
              {imgUrl ? (
                <img src={imgUrl} alt={cat.label} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
              ) : (
                <div
                  className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400"
                  aria-hidden
                >
                  <ArrowUp className="h-5 w-5" strokeWidth={2} />
                </div>
              )}
              <label className={canUpload ? 'is-clickable shrink-0' : 'shrink-0 opacity-50'}>
                <input
                  type="file"
                  accept="image/webp,image/jpeg,image/png,image/avif"
                  className="hidden"
                  disabled={isUp || !canUpload}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    e.target.value = ''
                    if (f) void handleFile(cat.key, f)
                  }}
                />
                <span className="rounded-full border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-500">
                  {isUp ? 'Upload…' : imgUrl ? 'Cambia' : 'Carica'}
                </span>
              </label>
              {imgUrl && canUpload && (
                <button
                  type="button"
                  onClick={() => void removeCategoryPhoto(cat.key)}
                  className="shrink-0 rounded p-1 text-red-400 hover:text-red-600"
                  aria-label={`Rimuovi foto ${cat.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={draft.title}
              onChange={(e) =>
                onOverrideDraftsChange({
                  ...overrideDrafts,
                  [cat.key]: { ...draft, title: e.target.value },
                })
              }
              placeholder={`Titolo card (default: "${cat.label}")`}
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
            />
            <input
              type="text"
              value={draft.description}
              onChange={(e) =>
                onOverrideDraftsChange({
                  ...overrideDrafts,
                  [cat.key]: { ...draft, description: e.target.value },
                })
              }
              placeholder="Descrizione breve (opzionale)"
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
            />
          </div>
        )
      })}
    </div>
  )
}

/** Hook helper per inizializzare draft override da categorie DB + override salvati. */
export function buildCategoryOverrideDrafts(
  categories: MenuCategoryRecord[],
  overrides: { category_key: string; title: string | null; description: string | null }[],
): CategoryOverrideDraft {
  const overrideMap = Object.fromEntries(overrides.map((o) => [o.category_key, o]))
  const initial: CategoryOverrideDraft = {}
  for (const cat of categories) {
    const ov = overrideMap[cat.key]
    initial[cat.key] = {
      title: ov?.title ?? cat.label ?? '',
      description: ov?.description ?? cat.description ?? '',
    }
  }
  return initial
}

/** @deprecated Usare sezioni controllate nel modale MenuQrModal */
export function MenuHomepageConfigPanel() {
  const { data: categories = [] } = useMenuCategories()
  void categories
  return (
    <p className="text-xs text-gray-500">
      Le impostazioni homepage sono nel modale di ogni Menù QR.
    </p>
  )
}
