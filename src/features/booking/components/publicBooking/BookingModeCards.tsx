import React from 'react'
import { ForkKnifeIcon } from '@phosphor-icons/react/dist/csr/ForkKnife'
import { CallBellIcon } from '@phosphor-icons/react/dist/csr/CallBell'
import { ChefHatIcon } from '@phosphor-icons/react/dist/csr/ChefHat'
import { WineIcon } from '@phosphor-icons/react/dist/csr/Wine'
import { CoffeeIcon } from '@phosphor-icons/react/dist/csr/Coffee'
import { PizzaIcon } from '@phosphor-icons/react/dist/csr/Pizza'
import { HamburgerIcon } from '@phosphor-icons/react/dist/csr/Hamburger'
import { BowlSteamIcon } from '@phosphor-icons/react/dist/csr/BowlSteam'
import { CakeIcon } from '@phosphor-icons/react/dist/csr/Cake'
import { MartiniIcon } from '@phosphor-icons/react/dist/csr/Martini'
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
  if (icon === 'utensils') return <ForkKnifeIcon weight="light" className={className} />
  if (icon === 'chef-hat') return <ChefHatIcon weight="light" className={className} />
  if (icon === 'wine') return <WineIcon weight="light" className={className} />
  if (icon === 'coffee') return <CoffeeIcon weight="light" className={className} />
  if (icon === 'pizza') return <PizzaIcon weight="light" className={className} />
  if (icon === 'hamburger') return <HamburgerIcon weight="light" className={className} />
  if (icon === 'bowl-steam') return <BowlSteamIcon weight="light" className={className} />
  if (icon === 'cake') return <CakeIcon weight="light" className={className} />
  if (icon === 'martini') return <MartiniIcon weight="light" className={className} />
  return <CallBellIcon weight="light" className={className} />
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
                'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition-all duration-200',
                'min-h-[100px] sm:min-h-[110px] sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-4 lg:px-16',
                'bg-white/85 backdrop-blur-[1px] shadow-sm',
                isActive
                  ? 'border-warm-orange ring-2 ring-warm-orange/30 shadow-md'
                  : 'border-black/15 hover:border-warm-orange/50 hover:shadow-md',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center transition-colors sm:h-10 sm:w-10 lg:absolute lg:left-4 lg:top-1/2 lg:-translate-y-1/2',
                  isActive ? 'text-warm-orange' : 'text-warm-wood/80',
                )}
              >
                <ModeIcon icon={mode.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0 w-full text-center">
                <p
                  className={cn(
                    'text-[13px] font-bold leading-tight sm:text-base lg:text-sm xl:text-base',
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
