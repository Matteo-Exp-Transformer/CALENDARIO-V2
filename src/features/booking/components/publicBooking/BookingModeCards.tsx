import React from 'react'
import { Utensils, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import type { BookingType } from '@/types/booking'

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
    <div className="w-full space-y-2" data-testid="booking-mode-cards">
      <div
        className={cn(
          'grid gap-3',
          enabledModes.length === 1 && 'grid-cols-1',
          enabledModes.length === 2 && 'grid-cols-2',
          enabledModes.length >= 3 && 'grid-cols-1 sm:grid-cols-3',
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
                'flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 text-center transition-all duration-200',
                'bg-white/85 backdrop-blur-[1px] shadow-sm',
                isActive
                  ? 'border-warm-orange ring-2 ring-warm-orange/30 shadow-md'
                  : 'border-black/15 hover:border-warm-orange/50 hover:shadow-md',
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                  isActive
                    ? 'bg-gradient-to-br from-terracotta to-warm-orange text-white shadow-md'
                    : 'bg-warm-wood/10 text-warm-wood',
                )}
              >
                <ModeIcon icon={mode.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-sm font-bold leading-tight',
                    isActive ? 'text-warm-orange' : 'text-warm-wood',
                  )}
                >
                  {mode.label}
                </p>
                {mode.description && (
                  <p className="mt-0.5 text-xs text-warm-wood-dark/70 leading-tight line-clamp-2">
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
