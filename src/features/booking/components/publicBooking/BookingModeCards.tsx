import React from 'react'
import { Utensils, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import type { BookingType } from '@/types/booking'
import { BOOKING_PUBLIC_WIDE_CARDS_WIDTH } from '@/features/booking/constants/bookingPublicFieldStyles'

interface BookingModeCardsProps {
  modes: BookingMode[]
  activeModeId: string
  onChange: (modeId: string, bookingType: BookingType) => void
}

function ModeIcon({ icon, className }: { icon: BookingMode['icon']; className?: string }) {
  if (icon === 'utensils') return <Utensils className={className} />
  if (icon === 'chef-hat') return <ChefHat className={className} />
  // 'cloche' — usiamo Utensils come fallback (Lucide non ha cloche)
  return <Utensils className={className} />
}

export const BookingModeCards: React.FC<BookingModeCardsProps> = ({ modes, activeModeId, onChange }) => {
  const enabledModes = modes.filter((m) => m.enabled)
  if (enabledModes.length === 0) return null

  return (
    <div className={cn('w-full space-y-2', BOOKING_PUBLIC_WIDE_CARDS_WIDTH)} data-testid="booking-mode-cards">
      <div
        className={cn(
          'flex w-full gap-1.5 sm:gap-2',
          enabledModes.length === 1 ? 'flex-col' : 'flex-row',
        )}
      >
        {enabledModes.map((mode) => {
          const isActive = mode.id === activeModeId
          return (
            <button
              key={mode.id}
              type="button"
              data-testid={`booking-mode-card-${mode.id}`}
              onClick={() => onChange(mode.id, mode.booking_type)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition-all duration-200',
                'min-h-20 sm:min-h-22 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-4',
                'bg-white/85 backdrop-blur-[1px] shadow-sm',
                isActive
                  ? 'border-warm-orange ring-2 ring-warm-orange/30 shadow-md'
                  : 'border-black/15 hover:border-warm-orange/50 hover:shadow-md',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10',
                  isActive
                    ? 'bg-linear-to-br from-terracotta to-warm-orange text-white shadow-md'
                    : 'bg-warm-wood/10 text-warm-wood',
                )}
              >
                <ModeIcon icon={mode.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 w-full">
                <p
                  className={cn(
                    'text-[11px] font-bold leading-tight sm:text-sm',
                    isActive ? 'text-warm-orange' : 'text-warm-wood',
                  )}
                >
                  {mode.label}
                </p>
                {mode.description && (
                  <p className="mt-0.5 hidden text-xs leading-tight text-warm-wood-dark/70 line-clamp-2 sm:block">
                    {mode.description}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
