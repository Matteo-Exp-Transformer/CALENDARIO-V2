import React, { useState } from 'react'
import type { BookingRequest } from '@/types/booking'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Wine,
  PartyPopper,
  GraduationCap,
  CalendarClock,
} from 'lucide-react'
import { getBookingEventTypeLabel } from '../utils/eventTypeLabels'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'
import { getPresetMenuLabel } from '../constants/presetMenus'
import type { PresetMenuType } from '../constants/presetMenus'
import { getMenuPriceDisplayFromBooking, getResolvedMenuPriceDisplay } from '../utils/menuPricing'
import { formatBookingDateTime } from '../utils/formatDateTime'
import { cn } from '@/lib/utils'
import { useRestaurantSetting } from '../hooks/useRestaurantSetting'

interface BookingRequestCardProps {
  booking: BookingRequest
  onAccept: (booking: BookingRequest) => void
  onReject: (booking: BookingRequest) => void
}

const STATUS_CONFIG: Record<string, { label: string; bgColor: string; textColor: string }> = {
  pending: { label: 'In Attesa', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
  accepted: { label: 'Accettata', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  rejected: { label: 'Rifiutata', bgColor: 'bg-red-50', textColor: 'text-red-700' },
}


/** Stesso aspetto della strip digest calendario / ArchiveTab. */
const DIGEST_MENU_HEADING_GRADIENT_BG =
  'bg-gradient-to-r from-[rgba(45,212,191,0.38)] via-teal-100/90 to-white'

const EVENT_TYPE_CONFIG: Record<string, { icon: typeof UtensilsCrossed }> = {
  cena: { icon: UtensilsCrossed },
  aperitivo: { icon: Wine },
  evento: { icon: PartyPopper },
  laurea: { icon: GraduationCap },
}

/** Spazio dopo «:» (EN SPACE ≈ metà di EM) */
const AFTER_COLON = '\u2002'

export const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  booking,
  onAccept,
  onReject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: customStaffPresets = [] } = useRestaurantSetting('booking_custom_staff_presets')

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMMM yyyy', { locale: it })
    } catch {
      return dateStr
    }
  }

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return 'Non specificato'
    // Rimuovi i secondi se presenti (formato HH:MM:SS -> HH:MM)
    return timeStr.split(':').slice(0, 2).join(':')
  }

  const eventTypeLabel = getBookingEventTypeLabel(booking)
  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
  const menuPriceDisplay = getMenuPriceDisplayFromBooking(booking)
  const digestMenuPrice =
    bookingTypeUsesMenuSelections(booking.booking_type) ? getResolvedMenuPriceDisplay(booking) : null
  const creationDateLabel = formatBookingDateTime(booking.created_at)

  const formatRequestSubmittedAt = (dateStr?: string | null) => {
    if (!dateStr) return ''
    try {
      return format(new Date(dateStr), 'd MMMM yyyy, HH:mm', { locale: it })
    } catch {
      return String(dateStr)
    }
  }

  const eventConfig =
    booking.event_type && EVENT_TYPE_CONFIG[booking.event_type] ? EVENT_TYPE_CONFIG[booking.event_type] : null
  const EventIcon = eventConfig?.icon ?? UtensilsCrossed

  const showDigestStrip = Boolean(eventTypeLabel)

  return (
    <div className="relative">
      {showDigestStrip && (
        <div className="mb-2">
          <span
            className={`inline-block max-w-full whitespace-normal rounded-lg border-0 px-4 py-2 text-xs font-semibold text-slate-800 shadow-none transition-all duration-300 ${DIGEST_MENU_HEADING_GRADIENT_BG}`}
          >
            <span className="block text-sm font-semibold text-slate-900">{eventTypeLabel}</span>
          </span>
        </div>
      )}

      <div className="booking-request-card-shell overflow-hidden rounded-2xl border-0 border-b-[3px] border-solid border-b-[rgba(253,186,116,0.55)] shadow-none">
        <div
          className={cn(
            'booking-request-collapse-header',
            !isExpanded ? 'rounded-2xl' : 'rounded-t-2xl',
          )}
        >
          <div
            className={cn(
              'booking-request-collapse-header-gradient admin-teal-surface',
              !isExpanded ? 'rounded-2xl' : 'rounded-t-2xl',
            )}
          >
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'booking-request-digest-trigger relative z-0 w-full cursor-pointer border-0 bg-transparent p-6 text-left outline-none ring-0',
                'transition-colors duration-[220ms] hover:bg-white/55 active:scale-[0.995]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                !isExpanded ? 'rounded-2xl' : 'rounded-t-2xl',
              )}
            >
              <div className="relative w-full min-w-0">
                {/* Badge+chevron fuori dal flusso: il testo digest usa tutta la larghezza e può andare sotto quest’area */}
                <div className="pointer-events-none absolute right-0 top-0 z-10 flex flex-col items-end gap-2">
                  <span
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                  >
                    {statusConfig.label}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-6 w-6 text-warm-wood" aria-hidden />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-warm-wood" aria-hidden />
                  )}
                </div>

                <div className="flex w-full min-w-0 flex-col gap-3">
                  {/* Riserva spazio in alto a destra così le prime righe non si sovrappongono al badge */}
                  <div className="flex min-w-0 w-full items-start gap-4 pr-[7.25rem]">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-orange-200/90 bg-white shadow-md">
                      <EventIcon className="h-4 w-4 text-warm-orange" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-3 min-[659px]:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <User className="h-4 w-4 flex-shrink-0 text-warm-orange" />
                            <span className="min-w-0 break-words text-base font-semibold text-warm-wood-dark">
                              {booking.client_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 flex-shrink-0 text-warm-orange" />
                            <span className="text-base font-semibold text-warm-wood-dark">
                              {formatDate(booking.desired_date)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 flex-shrink-0 text-warm-orange" />
                            <span className="text-base font-semibold text-warm-wood-dark">
                              {formatTime(booking.desired_time)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 flex-shrink-0 text-warm-orange" />
                            <span className="text-base font-semibold text-warm-wood-dark">
                              {booking.num_guests} ospiti
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0 space-y-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Mail className="h-4 w-4 flex-shrink-0 text-warm-orange" />
                            <span className="min-w-0 break-words text-sm text-gray-600">{booking.client_email}</span>
                          </div>

                          {booking.client_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 flex-shrink-0 text-warm-orange" />
                              <span className="text-sm text-gray-600">{booking.client_phone}</span>
                            </div>
                          )}

                          {booking.special_requests && (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-warm-orange" />
                              <span className="line-clamp-2 text-sm italic text-gray-600">
                                {booking.special_requests}
                              </span>
                            </div>
                          )}

                          {digestMenuPrice && (
                            <div className="flex min-w-0 w-full items-center gap-2">
                              <UtensilsCrossed className="h-4 w-4 shrink-0 text-warm-orange" aria-hidden />
                              <span className="min-w-0 flex-1 break-words text-sm leading-snug text-gray-700">
                                Menù :{AFTER_COLON}
                                {digestMenuPrice.prezzoMenuLabel}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.created_at && (
                    <div className="flex min-w-0 w-full items-start gap-2">
                      <CalendarClock
                        className="mt-0.5 h-4 w-4 shrink-0 text-warm-orange"
                        aria-hidden
                      />
                      {/* basis-0 + min-w-0: il flex misura tutta la larghezza utile così il testo non va a capo “a metà card” */}
                      <div className="min-w-0 flex-1 basis-0 text-sm leading-normal break-normal text-gray-600">
                        <span className="font-medium text-gray-500">
                          Ricevuta il :{AFTER_COLON}
                        </span>
                        <span className="text-gray-600">{formatRequestSubmittedAt(booking.created_at)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

      {/* Pannello espanso = strip brand dashboard (ADMIN_WARM_GRADIENT_SURFACE) */}
      {isExpanded && (
        <div className="booking-request-expanded-panel admin-warm-surface rounded-b-2xl border-t border-t-slate-200 p-4 transition-all duration-300 ease-in-out md:p-6">
          {!booking.created_at && creationDateLabel && (
            <p className="pb-3 text-[1em] leading-normal">
              <span className="font-medium text-gray-500">Richiesta di prenotazione effettuata il :</span>
              {AFTER_COLON}
              <span className="font-medium text-gray-900">{creationDateLabel}</span>
            </p>
          )}

          {/* Menu Info - Solo per Rinfresco di Laurea */}
          {bookingTypeUsesMenuSelections(booking.booking_type) && booking.menu_selection && (
            <div className="pt-6 mt-6 border-t border-t-[rgba(253,186,116,0.55)]">
              <p className="mb-3 text-[0.82em] font-semibold tracking-wide text-gray-500 uppercase">Menu Selezionato</p>
              
              {/* Mostra Menu Predefinito se presente */}
              {booking.preset_menu && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-700">
                    📋 Menu Predefinito:{AFTER_COLON}
                    {getPresetMenuLabel(booking.preset_menu as PresetMenuType, customStaffPresets)}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                {menuPriceDisplay && (
                  <>
                    <p className="font-bold text-warm-wood">
                      <span className="text-[0.82em] font-semibold tracking-wide text-gray-500 uppercase">
                        Prezzo Menù:
                      </span>
                      {AFTER_COLON}
                      <span className="text-warm-wood">
                        {menuPriceDisplay.prezzoMenuLabel}
                        {menuPriceDisplay.breakdownLabel && (
                          <span className="text-gray-600 ml-2">{menuPriceDisplay.breakdownLabel}</span>
                        )}
                      </span>
                    </p>
                    {menuPriceDisplay.prezzoTotaleLabel && (
                      <p className="font-bold text-warm-wood">
                        <span className="text-[0.82em] font-semibold tracking-wide text-gray-500 uppercase">
                          Prezzo Totale:
                        </span>
                        {AFTER_COLON}
                        <span className="text-warm-wood">{menuPriceDisplay.prezzoTotaleLabel}</span>
                      </p>
                    )}
                  </>
                )}
                {Array.isArray(booking.menu_selection?.items) && booking.menu_selection.items.length > 0 && (
                  <div className="text-gray-700">
                    <p className="mb-1 font-semibold">Prodotti:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {booking.menu_selection.items.map((item: any, idx: number) => {
                        const quantityLabel = item.quantity ? ` - ${item.quantity} Kg` : ''
                        const priceValue =
                          typeof item.totalPrice === 'number' && item.totalPrice > 0
                            ? item.totalPrice
                            : item.price

                        return (
                          <li key={idx}>
                            {item.name}
                            {quantityLabel}
                            {' - €'}
                            {priceValue?.toFixed ? priceValue.toFixed(2) : Number(priceValue || 0).toFixed(2)}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Intolleranze - Solo per Rinfresco di Laurea */}
          {bookingTypeUsesMenuSelections(booking.booking_type) && booking.dietary_restrictions && Array.isArray(booking.dietary_restrictions) && booking.dietary_restrictions.length > 0 && (
            <div className="pt-6 mt-6 border-t border-t-[rgba(253,186,116,0.55)]">
              <p className="mb-3 text-[0.82em] font-semibold tracking-wide text-gray-500 uppercase">Intolleranze Alimentari</p>
              <div className="space-y-2">
                {booking.dietary_restrictions.map((restriction: any, idx: number) => (
                  <p key={idx} className="text-gray-700">
                    <span className="font-semibold">{restriction.restriction}</span>
                    {restriction.restriction === 'Altro' && restriction.notes && ` (${restriction.notes})`}
                    {' - '}
                    {restriction.guest_count} {restriction.guest_count === 1 ? 'ospite' : 'ospiti'}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Note Richieste Speciali - Fuori dalla griglia */}
          {booking.special_requests && (
            <div className="pt-6 mt-6 border-t border-t-[rgba(253,186,116,0.55)]">
              <p className="mb-3 text-[0.82em] font-semibold tracking-wide text-gray-500 uppercase">Richieste Speciali</p>
              <p className="leading-snug text-gray-700">
                {booking.special_requests}
              </p>
            </div>
          )}

          {/* Azioni con Bottoni Moderni */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-t-[rgba(253,186,116,0.55)]">
            <button
              type="button"
              onClick={() => onAccept(booking)}
              className="flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-[1em] font-medium text-white shadow-sm transition-all duration-200 active:scale-95 bg-[var(--color-success)] hover:bg-[#059669] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)] focus-visible:ring-offset-2"
            >
              <CheckCircle className="h-6 w-6" />
              Accetta Prenotazione
            </button>
            <button
              type="button"
              onClick={() => onReject(booking)}
              className="booking-request-reject-booking-btn flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-[1em] font-semibold shadow-sm transition-colors duration-200 active:scale-[0.98] focus:outline-none"
            >
              <XCircle className="h-6 w-6" />
              Rifiuta
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}






