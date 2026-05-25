import React from 'react'
import { cn } from '@/lib/utils'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'
import type { BookingType } from '@/types/booking'

interface BookingSubTabStripProps {
  presets: CustomStaffPreset[]
  bookingType: BookingType
  activePresetId: string | null
  onChange: (presetId: string | null) => void
}

export const BookingSubTabStrip: React.FC<BookingSubTabStripProps> = ({
  presets,
  bookingType,
  activePresetId,
  onChange,
}) => {
  const visible = presets.filter(
    (p) =>
      p.visible_on_booking !== false &&
      Array.isArray(p.booking_types) &&
      p.booking_types.includes(bookingType as 'rinfresco_laurea' | 'menu_prezzo_fisso'),
  )

  if (visible.length === 0) return null

  return (
    <div className="w-full overflow-x-auto pb-1" data-testid="booking-sub-tab-strip">
      <div className="flex gap-2 min-w-max">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={cn(
            'rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap',
            'bg-white/85 backdrop-blur-[1px]',
            activePresetId === null
              ? 'border-warm-orange text-warm-orange shadow-md'
              : 'border-black/15 text-warm-wood hover:border-warm-orange/50',
          )}
        >
          Componi tu
        </button>
        {visible.map((preset) => {
          const isActive = activePresetId === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              data-testid={`booking-sub-tab-${preset.id}`}
              onClick={() => onChange(preset.id)}
              className={cn(
                'rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap',
                'bg-white/85 backdrop-blur-[1px]',
                isActive
                  ? 'border-warm-orange text-warm-orange shadow-md'
                  : 'border-black/15 text-warm-wood hover:border-warm-orange/50',
              )}
            >
              {preset.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
