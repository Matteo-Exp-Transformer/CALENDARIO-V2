import React from 'react'
import type { BookingRequest } from '@/types/booking'
import { getAccurateStartTime } from '../../utils/dateUtils'
import { getResolvedMenuPriceDisplay } from '../../utils/menuPricing'
import { digestBookingHasMenuContext } from '../../utils/digestBookingUtils'
import { DigestBookingTypeIcon } from '../DigestBookingTypeIcon'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface BookingDigestCardProps {
  booking: BookingRequest
  onOpen: (b: BookingRequest) => void
  showMenuPricing?: boolean
  /** Accettato per compatibilità con i call-site esistenti; ignorato nel layout carta. */
  compactGrid?: boolean
  /** Pro: prenotazione accettata senza tavolo assegnato. */
  unassigned?: boolean
  /** Pro: prenotazione con tavolo già assegnato. */
  assigned?: boolean
  /** Pro: mostrare il pallino di stato. */
  hasTurns?: boolean
  /** Pro: click sul pallino → apre modal assegnazione rapida. */
  onDotClick?: (booking: BookingRequest, e: React.MouseEvent) => void
}

export function BookingDigestCard({
  booking,
  onOpen,
  showMenuPricing = false,
  compactGrid: _compactGrid,
  unassigned = false,
  assigned = false,
  hasTurns = false,
  onDotClick,
}: BookingDigestCardProps) {
  const menuPriceRow = showMenuPricing ? getResolvedMenuPriceDisplay(booking) : null
  const bookingTimeLabel =
    booking.desired_time || booking.confirmed_start ? getAccurateStartTime(booking) : null
  const hasMenuContext = digestBookingHasMenuContext(booking)
  const hasSpecialNote = !!booking.special_requests?.trim()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(booking)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(booking)
        }
      }}
      className={cn(
        'is-clickable relative min-h-0 w-full min-w-0 rounded-lg border text-left',
        'bg-surface border-(--color-border) shadow-sm',
        'transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      )}
    >
      <div className="flex flex-col gap-2 px-4 py-3.5">
        {/* (1) Nome cliente — elemento più evidente */}
        <div className="flex min-w-0 items-center gap-2 pr-5">
          <DigestBookingTypeIcon booking={booking} className="h-5 w-5 shrink-0 text-primary-500" />
          <span className="min-w-0 truncate text-title-section font-semibold leading-snug text-primary-900">
            {booking.client_name}
          </span>
        </div>

        {/* (2) Numero ospiti — nero, grande; (3) orario preciso */}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-title-section font-bold leading-none tabular-nums text-primary-900">
            {booking.num_guests}
          </span>
          <span className="text-body text-(--color-text-muted)">
            {booking.num_guests === 1 ? 'ospite' : 'ospiti'}
          </span>
          {bookingTimeLabel && (
            <>
              <span className="text-body text-(--color-text-muted)">·</span>
              <span className="text-value font-medium text-primary-900">{bookingTimeLabel}</span>
            </>
          )}
        </div>

        {/* (4) Stato assegnazione — solo PRO */}
        {hasTurns && (unassigned || assigned) && (
          <div>
            {unassigned && <Badge variant="warning" className="text-label!">DA ASSEGNARE</Badge>}
            {assigned && <Badge variant="success" className="text-label!">ASSEGNATO</Badge>}
          </div>
        )}

        {/* (5) Badge contesto: MENU / TAVOLO / NOTE */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {hasMenuContext ? (
            <Badge variant="primary" className="text-label!">MENU</Badge>
          ) : (
            <Badge variant="neutral" className="text-label!">TAVOLO</Badge>
          )}
          {hasSpecialNote && <Badge variant="outline" className="text-label!">NOTE</Badge>}
        </div>

        {/* Prezzo menù (opzionale, se showMenuPricing=true) */}
        {menuPriceRow && (
          <div className="flex items-baseline justify-between gap-3 border-t border-(--color-border) pt-2">
            <span className="min-w-0 text-value font-semibold text-primary-900">
              {menuPriceRow.prezzoMenuLabel}
            </span>
            {menuPriceRow.prezzoTotaleLabel && (
              <span className="shrink-0 text-body font-normal text-(--color-text-muted)">
                Tot. {menuPriceRow.prezzoTotaleLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* PRO: pallino di stato assegnazione (top-right) */}
      {hasTurns && (
        <span
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onDotClick?.(booking, e)
          }}
          aria-label={assigned ? 'Tavolo assegnato' : 'Assegna tavolo'}
          className={cn(
            'absolute right-2 top-2 z-10 h-2.5 w-2.5 rounded-full',
            assigned ? 'bg-(--color-status-accepted)' : 'bg-primary-300',
          )}
        />
      )}
    </div>
  )
}
