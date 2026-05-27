import React, { useMemo } from 'react'
import { CalendarDays, Clock, Users, UtensilsCrossed, Phone, ChevronLeft } from 'lucide-react'
import type { BookingRequestInput, BookingType } from '@/types/booking'
import type { BookingMode, SubTab } from '@/features/booking/constants/bookingPublicFormConfig'
import { useMenuCategories } from '@/features/booking/hooks/useMenuCategories'
import { computeMenuTotalsFromItems } from '@/features/booking/utils/buildPresetMenuSelection'
import { cn } from '@/lib/utils'

interface BookingSummarySidebarProps {
  formData: {
    desired_date?: string
    desired_time?: string
    num_guests: number
    booking_type?: BookingRequestInput['booking_type']
    menu_selection?: BookingRequestInput['menu_selection']
    menu_total_per_person?: number
    menu_total_booking?: number
    preset_menu?: BookingRequestInput['preset_menu']
  }
  modes: BookingMode[]
  contactPhone?: string
  activeSubTab?: SubTab | null
  collapsed?: boolean
  onExpand?: () => void
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatCurrency(amount?: number): string {
  if (!amount) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}

function getModeLabelByType(modes: BookingMode[], bookingType?: BookingType): string {
  const mode = modes.find((m) => m.booking_type === bookingType && m.enabled)
  if (mode) return mode.label
  const map: Record<string, string> = {
    tavolo: 'Prenota un Tavolo',
    menu_prezzo_fisso: 'Menu a Prezzo Fisso',
    rinfresco_laurea: 'Rinfresco di Laurea',
  }
  return map[bookingType ?? ''] ?? '—'
}

export const BookingSummarySidebar: React.FC<BookingSummarySidebarProps> = ({
  formData,
  modes,
  contactPhone,
  activeSubTab,
  collapsed = false,
  onExpand,
}) => {
  const { data: menuCategories = [] } = useMenuCategories()
  const hasMenu = formData.booking_type !== 'tavolo'
  const items = formData.menu_selection?.items ?? []
  const totalPerPerson = formData.menu_total_per_person ?? 0
  const totalBooking = formData.menu_total_booking ?? 0
  const hasPresetPrice =
    activeSubTab?.price_per_person != null &&
    activeSubTab.price_per_person > 0 &&
    activeSubTab.is_fixed_menu !== false
  const showMenuPrices = hasPresetPrice || totalPerPerson > 0

  const categoryLabelByKey = useMemo(() => {
    const map = new Map<string, string>()
    for (const cat of menuCategories) {
      map.set(cat.key, cat.label)
    }
    return map
  }, [menuCategories])

  const categoryOrder = useMemo(
    () => new Map(menuCategories.map((c, i) => [c.key, c.sort_order ?? i])),
    [menuCategories],
  )

  const sortedMenuItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const orderA = categoryOrder.get(a.category) ?? 999
      const orderB = categoryOrder.get(b.category) ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name, 'it')
    })
  }, [items, categoryOrder])

  const menuItemsTotalWithoutPreset = useMemo(
    () => computeMenuTotalsFromItems(items, formData.num_guests).menu_total_booking,
    [items, formData.num_guests],
  )

  return (
    <div className="order-2 w-full max-w-full self-start md:sticky md:top-4 lg:order-none">
      {collapsed ? (
        <button
          type="button"
          aria-label="Mostra riepilogo prenotazione"
          onClick={onExpand}
          className="ml-auto hidden h-12 w-12 items-center justify-center rounded-l-full border border-slate-100 bg-white/90 text-warm-wood shadow-xl backdrop-blur-sm transition hover:bg-white hover:text-warm-orange lg:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}
      <aside
        className={cn(
          'w-full max-w-full rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-xl transition-all duration-300 ease-out',
          'space-y-4',
          collapsed && 'pointer-events-none translate-x-[120%] opacity-0',
        )}
        data-testid="booking-summary-sidebar"
      >
      <h3 className="font-serif text-warm-wood font-bold text-lg leading-tight">
        Riepilogo Prenotazione
      </h3>

      <div className="space-y-3">
        {/* Data */}
        <div className="flex items-start gap-2.5">
          <CalendarDays className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Data</p>
            <p className="text-base font-bold text-warm-wood leading-tight">
              {formData.desired_date ? formatDate(formData.desired_date) : '—'}
            </p>
          </div>
        </div>

        {/* Ora */}
        <div className="flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Orario</p>
            <p className="text-base font-bold text-warm-wood">{formData.desired_time || '—'}</p>
          </div>
        </div>

        {/* Ospiti */}
        <div className="flex items-start gap-2.5">
          <Users className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Ospiti</p>
            <p className="text-base font-bold text-warm-wood">
              {formData.num_guests > 0 ? `${formData.num_guests} persone` : '—'}
            </p>
          </div>
        </div>

        {/* Modalità */}
        <div className="flex items-start gap-2.5">
          <UtensilsCrossed className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Tipo</p>
            <p className="text-base font-bold text-warm-wood">
              {getModeLabelByType(modes, formData.booking_type)}
            </p>
          </div>
        </div>

        {/* Sottotab selezionata */}
        {activeSubTab &&
          (activeSubTab.label.trim() ||
            (activeSubTab.price_per_person != null && activeSubTab.price_per_person > 0)) && (
            <div className="border-t border-black/10 pt-3">
              <p className="text-[13px] text-warm-wood-dark/60 font-semibold uppercase tracking-wide">
                Opzione menu
              </p>
              <p className="text-base font-bold text-warm-wood leading-tight mt-0.5">
                {activeSubTab.label}
                {hasPresetPrice && (
                  <span className="text-warm-wood-dark/80 font-semibold">
                    {' '}
                    — {formatCurrency(activeSubTab.price_per_person)}/persona
                  </span>
                )}
              </p>
            </div>
          )}

        {/* IL TUO MENU */}
        {hasMenu && sortedMenuItems.length > 0 && (
          <div className="border-t border-black/10 pt-3 space-y-1.5">
            <p className="text-[13px] text-warm-wood-dark/60 font-semibold uppercase tracking-wide">
              Il tuo menu
            </p>
            <ul className="space-y-1.5">
              {sortedMenuItems.map((item) => {
                const catLabel = categoryLabelByKey.get(item.category)
                return (
                  <li key={item.id} className="flex items-start justify-between gap-2">
                    <span className="text-sm text-warm-wood font-medium leading-tight min-w-0">
                      {catLabel ? (
                        <>
                          <span className="text-warm-wood-dark/55">{catLabel}: </span>
                          {item.name}
                        </>
                      ) : (
                        item.name
                      )}
                    </span>
                    {showMenuPrices ? (
                      <span className="text-sm text-warm-wood-dark/70 font-semibold shrink-0 tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ul>
            {hasPresetPrice && menuItemsTotalWithoutPreset > 0 && (
              <div className="flex items-center justify-between gap-2 pt-1.5">
                <span className="text-xs font-semibold text-warm-wood-dark/55">
                  Totale senza menù preselezionato
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-warm-wood-dark/45 line-through">
                  {formatCurrency(menuItemsTotalWithoutPreset)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Totali */}
        {hasMenu && showMenuPrices && totalPerPerson > 0 && (
          <div className="border-t border-black/10 pt-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-wood-dark/70 font-semibold">A persona</span>
              <span className="text-base font-bold text-warm-wood">{formatCurrency(totalPerPerson)}</span>
            </div>
            {formData.num_guests > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-warm-wood-dark/70 font-semibold">Totale stimato</span>
                <span className="text-lg font-bold text-warm-orange">{formatCurrency(totalBooking)}</span>
              </div>
            )}
          </div>
        )}

        {/* Telefono contatto */}
        {contactPhone && (
          <div className="border-t border-black/10 pt-3 flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-warm-orange shrink-0" />
            <span className="text-sm text-warm-wood-dark font-medium">{contactPhone}</span>
          </div>
        )}
      </div>
      </aside>
    </div>
  )
}
