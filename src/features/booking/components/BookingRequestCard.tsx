import React, { useState } from 'react'
import type { CSSProperties } from 'react'
import type { BookingRequest } from '@/types/booking'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Calendar, Clock, Users, Tag, MessageSquare, CheckCircle, XCircle, UtensilsCrossed, ChevronDown, User, Mail, Phone } from 'lucide-react'
import { getBookingEventTypeLabel } from '../utils/eventTypeLabels'
import { getPresetMenuLabel } from '../constants/presetMenus'
import type { PresetMenuType } from '../constants/presetMenus'
import { getMenuPriceDisplayFromBooking, getResolvedMenuPriceDisplay } from '../utils/menuPricing'
import { formatBookingDateTime } from '../utils/formatDateTime'
import { ADMIN_WARM_BORDER, ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { cn } from '@/lib/utils'

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

/** Digest calendario `#digest-with-menu-heading` — strip chiusa con dati principali. Inline = ok su tutti i browser. */
const DIGEST_BOOKING_HEADER_SURFACE: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgba(45, 212, 191, 0.38) 0%, rgba(204, 251, 241, 0.9) 50%, rgb(255, 255, 255) 100%)',
}

/** Cornice contenitore — movimento/sat hover in `.booking-request-card-shell` (`index.css`). */
const BOOKING_REQUEST_CARD_SHELL =
  'booking-request-card-shell overflow-hidden rounded-lg border'

/** Padding fascia digest + pannello espanso; py include ancora fattore 6/7 (−1/7 altezza) */
const CARD_INNER_PADDING = 'px-[1.6875rem] py-[calc(1.6875rem_*_0.81_*_6_/7)]'

/** Spazio dopo «:» (EN SPACE ≈ metà di EM) */
const AFTER_COLON = '\u2002'

// InfoItem component was removed as it's not used

export const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  booking,
  onAccept,
  onReject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

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
    booking.booking_type === 'rinfresco_laurea' ? getResolvedMenuPriceDisplay(booking) : null
  const creationDateLabel = formatBookingDateTime(booking.created_at)

  return (
    <div
      className={BOOKING_REQUEST_CARD_SHELL}
      style={{
        borderColor: 'var(--admin-warm-wrap-border)',
        borderWidth: 'var(--admin-warm-wrap-border-width)',
        borderStyle: 'solid',
      }}
    >
      {/* Header chiuso = digest teal; con pannello aperto rimane fascia superiore teal. */}
      <div
        className={cn('booking-request-collapse-header', !isExpanded ? 'rounded-lg' : 'rounded-t-lg')}
      >
        <div
          className={cn('booking-request-collapse-header-gradient', !isExpanded ? 'rounded-lg' : 'rounded-t-lg')}
          style={DIGEST_BOOKING_HEADER_SURFACE}
        >
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'booking-request-digest-trigger w-full cursor-pointer border-0 text-left bg-transparent transition-colors duration-[220ms] hover:bg-white/55 active:scale-[0.995]',
            CARD_INNER_PADDING,
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
            !isExpanded ? 'rounded-lg' : 'rounded-t-lg'
          )}
        >
        <div className="flex items-start justify-between gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-6">
            {/* Digest: due metà affiancate (flex-1 basis-0); sotto ~480px colonna singola */}
            <div className="w-full min-w-0 flex-1 text-left">
              <div className="flex w-full flex-col gap-x-8 gap-y-[calc(1.75rem_*_4_/9_*_0.81_*_6_/7)] min-[480px]:flex-row min-[480px]:items-start min-[480px]:gap-y-0 min-[480px]:gap-x-[calc(1.25rem_*_4_/9_*_0.81_*_6_/7)]">
                <div className="booking-request-digest-row-stack min-w-0 flex-1 basis-0">
                  {eventTypeLabel && (
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Tag className="h-5 w-5 flex-shrink-0 text-gray-500" />
                      <span className="truncate font-semibold text-gray-900">{eventTypeLabel}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <User className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <span className="truncate font-medium text-gray-900">{booking.client_name}</span>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Calendar className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <span className="truncate font-medium text-gray-900">
                      {formatDate(booking.desired_date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Clock className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <span className="truncate font-medium text-gray-900">
                      {formatTime(booking.desired_time)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Users className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <span className="truncate font-medium text-gray-900">
                      {booking.num_guests} ospiti
                    </span>
                  </div>
                </div>

                <div className="booking-request-digest-row-stack min-w-0 flex-1 basis-0" aria-label="Contatti e note">
                  {booking.client_phone && (
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Phone className="h-5 w-5 flex-shrink-0 text-gray-500" />
                      <span className="truncate text-gray-600">{booking.client_phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <span className="min-w-0 truncate text-gray-600">{booking.client_email}</span>
                  </div>

                  {booking.special_requests && (
                    <div className="flex items-start gap-2.5 min-w-0">
                      <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
                      <span className="line-clamp-3 min-w-0 break-words text-[1em] italic leading-snug text-gray-600">
                        {booking.special_requests}
                      </span>
                    </div>
                  )}

                  {digestMenuPrice && (
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UtensilsCrossed className="h-5 w-5 shrink-0 text-gray-500" aria-hidden />
                      <span className="min-w-0 translate-y-[1px] break-words text-[1em] leading-none text-gray-700">
                        Menù :{AFTER_COLON}
                        {digestMenuPrice.prezzoMenuLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Badge Status + Icona Expand */}
          <div className="flex flex-shrink-0 flex-col items-end gap-3">
            <span
              className={cn(
                'rounded px-4 py-1.5 text-[0.95em] font-medium whitespace-nowrap',
                statusConfig.bgColor,
                statusConfig.textColor
              )}
            >
              {statusConfig.label}
            </span>
            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown className="h-7 w-7 text-gray-500" />
            </div>
          </div>
        </div>
        </button>
        </div>
      </div>

      {/* Pannello espanso = strip brand dashboard (ADMIN_WARM_GRADIENT_SURFACE) */}
      {isExpanded && (
        <div
          className={cn(
            'booking-request-expanded-panel rounded-b-lg border-t transition-all duration-300 ease-in-out',
            CARD_INNER_PADDING
          )}
          style={{
            ...ADMIN_WARM_GRADIENT_SURFACE,
            borderTopColor: 'rgb(226 232 240)',
          }}
        >
          {/* Dati anagrafici solo nel digest; qui resta quando è stata inviata la richiesta */}
          <p className="pb-3 text-[1em] leading-normal">
            <span className="font-medium text-gray-500">Richiesta di prenotazione effettuata il :</span>
            {AFTER_COLON}
            <span className="font-medium text-gray-900">{creationDateLabel}</span>
          </p>

          {/* Menu Info - Solo per Rinfresco di Laurea */}
          {booking.booking_type === 'rinfresco_laurea' && booking.menu_selection && (
            <div className="pt-6 mt-6 border-t" style={{ borderTopColor: ADMIN_WARM_BORDER }}>
              <p className="mb-3 text-[0.82em] font-semibold tracking-wide text-gray-500 uppercase">Menu Selezionato</p>
              
              {/* Mostra Menu Predefinito se presente */}
              {booking.preset_menu && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-700">
                    📋 Menu Predefinito:{AFTER_COLON}
                    {getPresetMenuLabel(booking.preset_menu as PresetMenuType)}
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
          {booking.booking_type === 'rinfresco_laurea' && booking.dietary_restrictions && Array.isArray(booking.dietary_restrictions) && booking.dietary_restrictions.length > 0 && (
            <div className="pt-6 mt-6 border-t" style={{ borderTopColor: ADMIN_WARM_BORDER }}>
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
            <div className="pt-6 mt-6 border-t" style={{ borderTopColor: ADMIN_WARM_BORDER }}>
              <p className="mb-3 text-[0.82em] font-semibold tracking-wide text-gray-500 uppercase">Richieste Speciali</p>
              <p className="leading-snug text-gray-700">
                {booking.special_requests}
              </p>
            </div>
          )}

          {/* Azioni con Bottoni Moderni */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t" style={{ borderTopColor: ADMIN_WARM_BORDER }}>
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
  )
}






