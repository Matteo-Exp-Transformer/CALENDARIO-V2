import { cn } from '@/lib/utils'
import { MenuQrCategoryIconGlyph } from '@/features/public-menu/MenuQrCategoryIconGlyph'
import {
  MENU_QR_LUCIDE_ICON_OPTIONS,
  MENU_QR_PHOSPHOR_ICON_OPTIONS,
  type MenuQrCategoryIconKey,
} from '@/features/public-menu/categoryIcons'

type MenuCategoryIconPickerProps = {
  value: MenuQrCategoryIconKey
  onChange: (key: MenuQrCategoryIconKey) => void
  /** Etichetta accessibile del gruppo (es. «Icona tipologia Tavolo»). */
  ariaLabel?: string
  className?: string
}

/** Griglia admin condivisa (Personalizza form + Menù QR): Phosphor + sezione Lucide. */
export function MenuCategoryIconPicker({
  value,
  onChange,
  ariaLabel = 'Scegli icona',
  className,
}: MenuCategoryIconPickerProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn('space-y-2', className)}>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {MENU_QR_PHOSPHOR_ICON_OPTIONS.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              aria-label={opt.label}
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
                selected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400',
              )}
            >
              <MenuQrCategoryIconGlyph iconKey={opt.value} className="h-5 w-5" />
            </button>
          )
        })}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        Altre icone
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {MENU_QR_LUCIDE_ICON_OPTIONS.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              aria-label={opt.label}
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
                selected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400',
              )}
            >
              <MenuQrCategoryIconGlyph iconKey={opt.value} className="h-5 w-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
