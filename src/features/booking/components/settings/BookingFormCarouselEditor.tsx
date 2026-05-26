import { ImagePlus, ChevronUp, ChevronDown, Trash2, Pencil } from 'lucide-react'
import { useRef } from 'react'
import { ForkKnifeIcon } from '@phosphor-icons/react/dist/csr/ForkKnife'
import { CallBellIcon } from '@phosphor-icons/react/dist/csr/CallBell'
import { ChefHatIcon } from '@phosphor-icons/react/dist/csr/ChefHat'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { LeafIcon } from '@phosphor-icons/react/dist/csr/Leaf'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'
import { useCarouselPhotoUpload } from '@/features/booking/components/MenuHomepageConfigPanel'
import type { CarouselItem, CarouselSlideIcon } from '@/types/menu'
import type { SubTab, SubTabIcon } from '@/features/booking/constants/bookingPublicFormConfig'

/** Limiti testi slide carosello in Personalizza form (Pagina Prenota). */
const BOOKING_CAROUSEL_EYEBROW_MAX = 30
const BOOKING_CAROUSEL_TITLE_MAX = 22
const BOOKING_CAROUSEL_DESCRIPTION_MAX = 77

const SUB_TAB_ICON_OPTIONS: { value: SubTabIcon; label: string }[] = [
  { value: 'utensils', label: 'Posate' },
  { value: 'cloche', label: 'Cloche' },
  { value: 'chef-hat', label: 'Chef' },
  { value: 'star', label: 'Stella' },
  { value: 'leaf', label: 'Foglia' },
]

function SubTabIconOption({ icon, className }: { icon: SubTabIcon; className?: string }) {
  if (icon === 'utensils') return <ForkKnifeIcon weight="light" className={className} />
  if (icon === 'cloche') return <CallBellIcon weight="light" className={className} />
  if (icon === 'chef-hat') return <ChefHatIcon weight="light" className={className} />
  if (icon === 'star') return <StarIcon weight="light" className={className} />
  if (icon === 'leaf') return <LeafIcon weight="light" className={className} />
  return <ForkKnifeIcon weight="light" className={className} />
}

function AdminFieldWithCharCount({
  id,
  label,
  value,
  maxLength,
  onChange,
  placeholder,
  singleLine = false,
}: {
  id?: string
  label: string
  value: string
  maxLength: number
  onChange: (value: string) => void
  placeholder?: string
  singleLine?: boolean
}) {
  return (
    <div className="w-full min-w-0 space-y-1.5">
      <Label htmlFor={id} className="block text-sm">
        {label}
      </Label>
      {singleLine ? (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onBlur={(e) => {
            const trimmed = e.target.value.trim()
            if (trimmed !== value) onChange(trimmed)
          }}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full"
        />
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onBlur={(e) => {
            const trimmed = e.target.value.trim()
            if (trimmed !== value) onChange(trimmed)
          }}
          maxLength={maxLength}
          rows={3}
          placeholder={placeholder}
          className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      )}
      <p
        className={cn(
          'text-right text-[11px] tabular-nums',
          value.length >= maxLength ? 'text-red-500' : 'text-slate-400',
        )}
      >
        {value.length}/{maxLength}
      </p>
    </div>
  )
}

function syncCarouselSubTabFields(tab: SubTab, items: CarouselItem[]): Partial<SubTab> {
  const first = items[0]
  return {
    carousel_items: items,
    price_per_person: undefined,
    description: undefined,
    icon: undefined,
    label: first?.eyebrow?.trim() || first?.title?.trim() || tab.label,
  }
}

function CarouselSlideEditorCard({
  item,
  index,
  total,
  onPatch,
  onMoveUp,
  onMoveDown,
  onRemove,
  onReplacePhoto,
  replaceDisabled,
  hideMobileSlideLabel = false,
}: {
  item: CarouselItem
  index: number
  total: number
  onPatch: (patch: Partial<CarouselItem>) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onReplacePhoto: (e: React.ChangeEvent<HTMLInputElement>) => void
  replaceDisabled?: boolean
  /** Su mobile la prima slide mostra l'etichetta nella riga titolo del genitore (es. CAROSELLO 1). */
  hideMobileSlideLabel?: boolean
}) {
  const replaceFileRef = useRef<HTMLInputElement>(null)
  const slideIcon = (item.icon ?? 'utensils') as SubTabIcon
  const slideLabel = `Foto N° ${index + 1}`

  return (
    <div
      className={cn(
        'w-full min-w-0 space-y-4',
        index > 0 && 'border-t border-slate-200 pt-5',
      )}
    >
      {!hideMobileSlideLabel ? (
        <div className="flex justify-end sm:hidden">
          <span className="text-xs font-semibold text-slate-600">{slideLabel}</span>
        </div>
      ) : null}

      <div className="flex w-full min-w-0 items-start gap-2 sm:items-center sm:gap-3">
        <img
          src={item.image_url}
          alt=""
          className="h-20 w-28 shrink-0 rounded-lg border border-slate-200 object-cover sm:h-24 sm:w-32"
        />
        <span className="hidden min-w-0 flex-1 text-left text-sm font-semibold text-slate-600 sm:block">
          {slideLabel}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:ml-0">
          <div className="flex shrink-0 flex-col gap-0.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="rounded p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
            aria-label="Sposta su"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="rounded p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
            aria-label="Sposta giù"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
          <div className="flex shrink-0 items-center gap-0.5">
          <input
            ref={replaceFileRef}
            type="file"
            accept="image/webp,image/jpeg,image/png,image/avif"
            className="hidden"
            onChange={onReplacePhoto}
          />
          <button
            type="button"
            disabled={replaceDisabled}
            onClick={() => replaceFileRef.current?.click()}
            className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Modifica foto"
            title="Modifica foto"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={replaceDisabled}
            className="rounded p-1 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Rimuovi foto"
            title="Rimuovi foto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          </div>
        </div>
      </div>

      <AdminFieldWithCharCount
        label="Testo Etichetta"
        value={item.eyebrow ?? ''}
        maxLength={BOOKING_CAROUSEL_EYEBROW_MAX}
        onChange={(eyebrow) => onPatch({ eyebrow: eyebrow || undefined })}
        placeholder="Nome mostrato al cliente"
        singleLine
      />

      <AdminFieldWithCharCount
        label="Testo Titolo"
        value={item.title ?? ''}
        maxLength={BOOKING_CAROUSEL_TITLE_MAX}
        onChange={(title) => onPatch({ title: title || undefined })}
        placeholder="es. Tonno in crosta"
        singleLine
      />

      <div className="w-full min-w-0 space-y-1.5">
        <Label className="block text-sm">Scegli Icona</Label>
        <div className="flex flex-wrap gap-2">
          {SUB_TAB_ICON_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPatch({ icon: opt.value as CarouselSlideIcon })}
              className={cn(
                'flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
                slideIcon === opt.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600',
              )}
            >
              <SubTabIconOption icon={opt.value} className="h-3 w-3" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <AdminFieldWithCharCount
        label="Testo Descrizione"
        value={item.description ?? ''}
        maxLength={BOOKING_CAROUSEL_DESCRIPTION_MAX}
        onChange={(description) => onPatch({ description: description || undefined })}
        placeholder="Sottotitolo sulla card"
      />
    </div>
  )
}

export function BookingFormCarouselEditor({
  tenantId,
  modeId,
  tab,
  onPatchTab,
  firstSlideLabelInParentHeader = false,
}: {
  tenantId: string
  modeId: string
  tab: SubTab
  onPatchTab: (patch: Partial<SubTab>) => void
  /** Su mobile la prima slide mostra «Foto N° 1» nella riga titolo del genitore. */
  firstSlideLabelInParentHeader?: boolean
}) {
  const items = tab.carousel_items ?? []

  const applyItems = (next: CarouselItem[]) => {
    onPatchTab(syncCarouselSubTabFields(tab, next))
  }

  const { fileRef, uploading, canUpload, handleAddFile, removeAt, replaceAt } = useCarouselPhotoUpload({
    tenantId,
    menuQrCodeId: null,
    draftShortCode: `booking-form-${modeId}-${tab.id}`,
    items,
    onChange: (next) => {
      const merged = next.map((it, idx) => {
        const prev = items.find((p) => p.image_url === it.image_url) ?? items[idx]
        if (prev) return { ...prev, image_url: it.image_url, sort_order: idx }
        return { ...it, icon: it.icon ?? 'utensils', sort_order: idx }
      })
      applyItems(merged)
    },
  })

  const patchItem = (index: number, patch: Partial<CarouselItem>) => {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it))
    applyItems(next)
  }

  const moveUp = (i: number) => {
    if (i === 0) return
    const next = [...items]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    applyItems(next.map((x, idx) => ({ ...x, sort_order: idx })))
  }

  const moveDown = (i: number) => {
    if (i === items.length - 1) return
    const next = [...items]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    applyItems(next.map((x, idx) => ({ ...x, sort_order: idx })))
  }

  return (
    <div className="w-full min-w-0 space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/webp,image/jpeg,image/png,image/avif"
        className="hidden"
        onChange={handleAddFile}
      />

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-white/80 px-3 py-4 text-center text-xs text-slate-500">
          Carica una foto per compilare etichetta, titolo, icona e descrizione della slide.
        </p>
      ) : (
        <div className="flex w-full min-w-0 flex-col gap-5">
          {items.map((item, i) => (
            <CarouselSlideEditorCard
              key={`${item.image_url}-${i}`}
              item={item}
              index={i}
              total={items.length}
              onPatch={(patch) => patchItem(i, patch)}
              onMoveUp={() => moveUp(i)}
              onMoveDown={() => moveDown(i)}
              onRemove={() => void removeAt(i)}
              onReplacePhoto={(e) => void replaceAt(i, e)}
              replaceDisabled={uploading || !canUpload}
              hideMobileSlideLabel={firstSlideLabelInParentHeader && i === 0}
            />
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        type="button"
        disabled={uploading || !canUpload}
        onClick={() => fileRef.current?.click()}
        className="gap-1.5 self-start text-xs"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        {uploading ? 'Caricamento…' : items.length === 0 ? 'Aggiungi foto' : 'Aggiungi altra foto'}
      </Button>
    </div>
  )
}
