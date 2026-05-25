import React from 'react'
import { Utensils, ChefHat, Star, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubTab, SubTabIcon } from '@/features/booking/constants/bookingPublicFormConfig'

interface BookingSubTabCardsProps {
  subTabs: SubTab[]
  activeSubTabId: string | null
  onChange: (subTab: SubTab | null) => void
}

function SubTabIconGraphic({ icon, className }: { icon?: SubTabIcon; className?: string }) {
  if (icon === 'chef-hat') return <ChefHat className={className} />
  if (icon === 'star') return <Star className={className} />
  if (icon === 'leaf') return <Leaf className={className} />
  return <Utensils className={className} />
}

function formatPricePerPerson(price?: number): string | null {
  if (price == null || price <= 0) return null
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

export const BookingSubTabCards: React.FC<BookingSubTabCardsProps> = ({
  subTabs,
  activeSubTabId,
  onChange,
}) => {
  if (subTabs.length === 0) return null

  return (
    <div className="w-full overflow-x-auto pb-1" data-testid="booking-sub-tab-cards">
      <div className="mx-auto flex w-max max-w-full gap-3">
        {subTabs.map((tab) => {
          const isActive = activeSubTabId === tab.id
          const priceLabel = formatPricePerPerson(tab.price_per_person)
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`booking-sub-tab-card-${tab.id}`}
              onClick={() => onChange(isActive ? null : tab)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-2xl border-2 px-5 py-4 min-w-[140px] text-center transition-all',
                'bg-white/85 backdrop-blur-[1px]',
                isActive
                  ? 'border-warm-orange ring-2 ring-warm-orange/30 shadow-md'
                  : 'border-black/15 hover:border-warm-orange/50',
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full',
                  isActive
                    ? 'bg-gradient-to-br from-terracotta to-warm-orange text-white'
                    : 'bg-warm-wood/10 text-warm-wood',
                )}
              >
                <SubTabIconGraphic icon={tab.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-sm font-bold leading-tight',
                    isActive ? 'text-warm-orange' : 'text-warm-wood',
                  )}
                >
                  {tab.label}
                </p>
                {tab.description && (
                  <p className="mt-0.5 text-xs text-warm-wood-dark/70 leading-tight line-clamp-2">
                    {tab.description}
                  </p>
                )}
                {priceLabel && (
                  <p className="mt-1 text-xs font-semibold text-warm-wood-dark/80">{priceLabel}/persona</p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
