import { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ImagePlus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { useTenantContext } from '@/contexts/TenantContext'
import { useMenuCategories } from '../hooks/useMenuCategories'
import { useMenuHomepageConfig, useUpsertMenuHomepageConfig } from '../hooks/useMenuHomepageConfig'
import { useMenuQrcodeCategories, useUpsertMenuQrcodeCategory } from '../hooks/useMenuQrcodeCategories'
import { MENU_THEMES, DEFAULT_THEME_KEY, type MenuThemeKey } from '@/features/public-menu/menuThemes'
import type { CarouselItem } from '@/types/menu'

const BUCKET = 'menu-photos'
const MAX_SIDE_PX = 1200
const MAX_BYTES = 450_000

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

// ── Selettore tema ────────────────────────────────────────────────────────────

function ThemeSelector({
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
          {/* Swatch colore */}
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

const CAROUSEL_SLIDE_TITLE_MAX = 60
const CAROUSEL_SLIDE_DESCRIPTION_MAX = 125

// ── Sezione Carosello ─────────────────────────────────────────────────────────

function CarouselSection({
  tenantId,
  items,
  onChange,
}: {
  tenantId: string
  items: CarouselItem[]
  onChange: (items: CarouselItem[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const uuid = crypto.randomUUID()
      const path = `${tenantId}/carousel/${uuid}.webp`
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

  const updateField = (i: number, field: 'title' | 'description', value: string) => {
    const maxLen = field === 'title' ? CAROUSEL_SLIDE_TITLE_MAX : CAROUSEL_SLIDE_DESCRIPTION_MAX
    const clipped = value.slice(0, maxLen)
    const next = items.map((x, idx) =>
      idx === i ? { ...x, [field]: clipped || undefined } : x,
    )
    onChange(next)
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
          disabled={uploading}
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
            <img
              src={item.image_url}
              alt=""
              className="h-16 w-24 shrink-0 rounded-lg object-cover"
            />
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

// ── Sezione foto categorie ────────────────────────────────────────────────────

function CategoryImagesSection({
  tenantId,
  categoryImages,
  onChange,
}: {
  tenantId: string
  categoryImages: Record<string, string>
  onChange: (images: Record<string, string>) => void
}) {
  const { data: categories = [] } = useMenuCategories()
  const [uploading, setUploading] = useState<string | null>(null)

  const handleFile = async (catKey: string, file: File) => {
    setUploading(catKey)
    try {
      const path = `${tenantId}/cat/${catKey}.webp`
      const url = await uploadToStorage(file, path)
      onChange({ ...categoryImages, [catKey]: url })
      toast.success('Foto categoria salvata')
    } catch {
      toast.error('Errore caricamento foto')
    } finally {
      setUploading(null)
    }
  }

  const removeCategory = async (catKey: string) => {
    await removeFromStorage(`${tenantId}/cat/${catKey}.webp`)
    const next = { ...categoryImages }
    delete next[catKey]
    onChange(next)
  }

  if (categories.length === 0) {
    return <p className="text-xs text-gray-400">Nessuna categoria trovata.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => {
        const imgUrl = categoryImages[cat.key]
        const isUp = uploading === cat.key
        return (
          <div
            key={cat.key}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2"
          >
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={cat.label}
                className="h-12 w-16 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                No foto
              </div>
            )}
            <span className="min-w-0 flex-1 text-sm font-medium text-gray-800">{cat.label}</span>
            <label className="is-clickable shrink-0">
              <input
                type="file"
                accept="image/webp,image/jpeg,image/png,image/avif"
                className="hidden"
                disabled={isUp}
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
            {imgUrl && (
              <button
                type="button"
                onClick={() => void removeCategory(cat.key)}
                className="shrink-0 rounded p-1 text-red-400 hover:text-red-600"
                aria-label={`Rimuovi foto ${cat.label}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Sezione titoli/descrizioni QR card ───────────────────────────────────────
// Override separati da menu_categories: non impattano la pagina Prenota

function QrCategoryOverridesSection() {
  const { data: categories = [] } = useMenuCategories()
  const { data: overrides = [] } = useMenuQrcodeCategories()
  const upsert = useUpsertMenuQrcodeCategory()
  const [drafts, setDrafts] = useState<Record<string, { title: string; description: string }>>({})

  useEffect(() => {
    const overrideMap = Object.fromEntries(overrides.map((o) => [o.category_key, o]))
    const initial: Record<string, { title: string; description: string }> = {}
    for (const cat of categories) {
      const ov = overrideMap[cat.key]
      initial[cat.key] = {
        title: ov?.title ?? cat.label ?? '',
        description: ov?.description ?? cat.description ?? '',
      }
    }
    setDrafts(initial)
  }, [categories, overrides])

  const handleSave = (catKey: string) => {
    const d = drafts[catKey]
    upsert.mutate(
      {
        category_key: catKey,
        title: d.title.trim() || null,
        description: d.description.trim() || null,
      },
      { onSuccess: () => toast.success('Salvato') },
    )
  }

  if (categories.length === 0) {
    return <p className="text-xs text-gray-400">Nessuna categoria trovata.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400">
        Titolo e descrizione visibili solo nella homepage QR — separati dal nome usato nel form prenotazione.
      </p>
      {categories.map((cat) => (
        <div
          key={cat.key}
          className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3"
        >
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{cat.label}</span>
          <input
            type="text"
            value={drafts[cat.key]?.title ?? ''}
            onChange={(e) =>
              setDrafts((prev) => ({ ...prev, [cat.key]: { ...prev[cat.key], title: e.target.value } }))
            }
            placeholder={`Titolo card (default: "${cat.label}")`}
            className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="text"
            value={drafts[cat.key]?.description ?? ''}
            onChange={(e) =>
              setDrafts((prev) => ({ ...prev, [cat.key]: { ...prev[cat.key], description: e.target.value } }))
            }
            placeholder="Descrizione breve (opzionale)"
            className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={upsert.isPending}
              onClick={() => handleSave(cat.key)}
              className="text-xs"
            >
              Salva
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Pannello principale ───────────────────────────────────────────────────────

export function MenuHomepageConfigPanel() {
  const { tenantId } = useTenantContext()
  const { data: saved, isLoading } = useMenuHomepageConfig()
  const upsert = useUpsertMenuHomepageConfig()

  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const [themeKey, setThemeKey] = useState<MenuThemeKey>(DEFAULT_THEME_KEY)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (saved) {
      setCarouselItems(saved.carousel_items)
      setCategoryImages(saved.category_images)
      setThemeKey((saved.theme_key as MenuThemeKey) ?? DEFAULT_THEME_KEY)
      setDirty(false)
    }
  }, [saved])

  const handleCarouselChange = (items: CarouselItem[]) => {
    setCarouselItems(items)
    setDirty(true)
  }

  const handleCategoryImagesChange = (images: Record<string, string>) => {
    setCategoryImages(images)
    setDirty(true)
  }

  const handleThemeChange = (k: MenuThemeKey) => {
    setThemeKey(k)
    setDirty(true)
  }

  const handleSave = () => {
    upsert.mutate(
      { carousel_items: carouselItems, category_images: categoryImages, theme_key: themeKey },
      {
        onSuccess: () => {
          toast.success('Aspetto homepage salvato')
          setDirty(false)
        },
        onError: () => toast.error('Errore salvataggio'),
      },
    )
  }

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-gray-500">Caricamento…</p>
  }

  if (!tenantId) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Tema */}
      <section>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Tema homepage
        </h4>
        <ThemeSelector value={themeKey} onChange={handleThemeChange} />
      </section>

      <hr className="border-gray-200" />

      {/* Carosello */}
      <section>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Carosello specialità della casa
        </h4>
        <CarouselSection
          tenantId={tenantId}
          items={carouselItems}
          onChange={handleCarouselChange}
        />
      </section>

      <hr className="border-gray-200" />

      {/* Foto categorie */}
      <section>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Foto categorie
        </h4>
        <p className="mb-3 text-xs text-gray-400">
          Le foto appaiono come thumbnail nelle card categoria.
        </p>
        <CategoryImagesSection
          tenantId={tenantId}
          categoryImages={categoryImages}
          onChange={handleCategoryImagesChange}
        />
      </section>

      <div className="flex justify-end border-t border-gray-100 pt-4">
        <Button
          variant="primary"
          type="button"
          disabled={!dirty || upsert.isPending}
          onClick={handleSave}
        >
          {upsert.isPending ? 'Salvataggio…' : 'Salva aspetto homepage'}
        </Button>
      </div>

      <hr className="border-gray-200" />

      {/* Titoli e descrizioni card QR */}
      <section>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Titoli e descrizioni card categorie (homepage QR)
        </h4>
        <QrCategoryOverridesSection />
      </section>
    </div>
  )
}
