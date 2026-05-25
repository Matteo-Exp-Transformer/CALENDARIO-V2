import React from 'react'
import { CalendarDays, Clock, Users, UtensilsCrossed, Phone } from 'lucide-react'
import type { BookingRequestInput, BookingType } from '@/types/booking'
import type { BookingMode, SubTab } from '@/features/booking/constants/bookingPublicFormConfig'

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
}) => {
  const hasMenu = formData.booking_type !== 'tavolo'
  const items = formData.menu_selection?.items ?? []
  const totalPerPerson = formData.menu_total_per_person ?? 0
  const totalBooking = formData.menu_total_booking ?? 0

  return (
    <aside
      className="order-2 lg:order-none rounded-2xl bg-white/30 backdrop-blur-[16px] shadow-xl px-4 py-5 space-y-4 lg:sticky lg:top-6 self-start"
      data-testid="booking-summary-sidebar"
    >
      <h3 className="font-serif text-warm-wood font-bold text-base leading-tight">
        Riepilogo Prenotazione
      </h3>

      <div className="space-y-3">
        {/* Data */}
        <div className="flex items-start gap-2.5">
          <CalendarDays className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Data</p>
            <p className="text-sm font-bold text-warm-wood leading-tight">
              {formData.desired_date ? formatDate(formData.desired_date) : '—'}
            </p>
          </div>
        </div>

        {/* Ora */}
        <div className="flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Orario</p>
            <p className="text-sm font-bold text-warm-wood">{formData.desired_time || '—'}</p>
          </div>
        </div>

        {/* Ospiti */}
        <div className="flex items-start gap-2.5">
          <Users className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Ospiti</p>
            <p className="text-sm font-bold text-warm-wood">
              {formData.num_guests > 0 ? `${formData.num_guests} persone` : '—'}
            </p>
          </div>
        </div>

        {/* Modalità */}
        <div className="flex items-start gap-2.5">
          <UtensilsCrossed className="h-4 w-4 text-warm-orange mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Tipo</p>
            <p className="text-sm font-bold text-warm-wood">
              {getModeLabelByType(modes, formData.booking_type)}
            </p>
          </div>
        </div>

        {/* Sottotab selezionata (opzione manuale o con prezzo indicato) */}
        {activeSubTab &&
          (activeSubTab.type === 'manual' ||
            (activeSubTab.price_per_person != null && activeSubTab.price_per_person > 0)) && (
            <div className="border-t border-black/10 pt-3">
              <p className="text-xs text-warm-wood-dark/60 font-semibold uppercase tracking-wide">
                Opzione menu
              </p>
              <p className="text-sm font-bold text-warm-wood leading-tight mt-0.5">
                {activeSubTab.label}
                {activeSubTab.price_per_person != null && activeSubTab.price_per_person > 0 && (
                  <span className="text-warm-wood-dark/80 font-semibold">
                    {' '}
                    — {formatCurrency(activeSubTab.price_per_person)}/persona
                  </span>
                )}
              </p>
            </div>
          )}

        {/* Menu voci */}
        {hasMenu && items.length > 0 && (
          <div className="border-t border-black/10 pt-3 space-y-1.5">
            <p className="text-xs text-warm-wood-dark/60 font-semibold uppercase tracking-wide">Menu selezionato</p>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-warm-wood font-medium leading-tight min-w-0 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-warm-wood-dark/70 font-semibold shrink-0">
                    {formatCurrency(item.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Totali */}
        {hasMenu && totalPerPerson > 0 && (
          <div className="border-t border-black/10 pt-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-warm-wood-dark/70 font-semibold">A persona</span>
              <span className="text-sm font-bold text-warm-wood">{formatCurrency(totalPerPerson)}</span>
            </div>
            {formData.num_guests > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-wood-dark/70 font-semibold">Totale stimato</span>
                <span className="text-base font-bold text-warm-orange">{formatCurrency(totalBooking)}</span>
              </div>
            )}
          </div>
        )}

        {/* Telefono contatto */}
        {contactPhone && (
          <div className="border-t border-black/10 pt-3 flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-warm-orange shrink-0" />
            <span className="text-xs text-warm-wood-dark font-medium">{contactPhone}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
