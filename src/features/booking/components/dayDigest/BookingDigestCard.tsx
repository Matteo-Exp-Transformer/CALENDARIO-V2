import React from 'react'
import type { BookingRequest } from '@/types/booking'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'
import { getAccurateStartTime } from '../../utils/dateUtils'
import { getResolvedMenuPriceDisplay } from '../../utils/menuPricing'
import { resolveSubTabFromBooking } from '../../utils/buildBookingEmailSummary'
import { getModeLabelByType } from '../../utils/bookingModeLabels'
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
  /** Pro: mostrare lo stato tavolo. */
  hasTurns?: boolean
  bookingModes?: BookingMode[]
  customStaffPresets?: CustomStaffPreset[]
  /** Pro: click sullo stato tavolo → apre modal assegnazione rapida. */
  onDotClick?: (booking: BookingRequest, e: React.MouseEvent) => void
}

type DigestBadge = {
  key: string
  label: string
  variant: React.ComponentProps<typeof Badge>['variant']
}

function cleanBadgeLabel(value: string | null | undefined): string | null {
  const label = value?.trim()
  return label ? label : null
}

function addUniqueBadge(
  badges: DigestBadge[],
  seen: Set<string>,
  badge: DigestBadge,
): void {
  const normalized = badge.label.trim().toLocaleLowerCase('it-IT')
  if (!normalized || seen.has(normalized)) return
  seen.add(normalized)
  badges.push(badge)
}

function buildDigestBadges({
  booking,
  bookingModes = [],
  customStaffPresets = [],
}: {
  booking: BookingRequest
  bookingModes?: BookingMode[]
  customStaffPresets?: CustomStaffPreset[]
}): DigestBadge[] {
  const badges: DigestBadge[] = []
  const seen = new Set<string>()

  const mode = bookingModes.find((m) => m.booking_type === booking.booking_type && m.enabled)
  const modeLabel =
    cleanBadgeLabel(mode?.booking_badge_label) ||
    cleanBadgeLabel(mode?.label) ||
    cleanBadgeLabel(getModeLabelByType(bookingModes, booking.booking_type))
  if (modeLabel) {
    addUniqueBadge(badges, seen, {
      key: 'booking-type',
      label: modeLabel,
      variant: 'default',
    })
  }

  const subTab = resolveSubTabFromBooking(booking, mode, customStaffPresets)
  const subTabLabel =
    subTab?.display === 'cards'
      ? cleanBadgeLabel(subTab.booking_badge_label) || cleanBadgeLabel(subTab.label)
      : null
  if (subTabLabel) {
    addUniqueBadge(badges, seen, {
      key: 'sub-tab',
      label: subTabLabel,
      variant: 'outline',
    })
  }

  return badges.slice(0, 3)
}

export function BookingDigestCard({
  booking,
  onOpen,
  showMenuPricing = false,
  compactGrid: _compactGrid,
  unassigned = false,
  hasTurns = false,
  bookingModes = [],
  customStaffPresets = [],
  onDotClick,
}: BookingDigestCardProps) {
  const menuPriceRow = showMenuPricing ? getResolvedMenuPriceDisplay(booking) : null
  const bookingTimeLabel =
    booking.desired_time || booking.confirmed_start ? getAccurateStartTime(booking) : null
  const badges = buildDigestBadges({ booking, bookingModes, customStaffPresets })

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
        'is-clickable relative w-full min-w-0 rounded-lg border text-left',
        'bg-surface border-(--color-border) shadow-sm',
        'transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      )}
    >
      {/* DA ASSEGNARE — agganciato fuori bordo, top-right (PRO) */}
      {hasTurns && unassigned && (
        <span
          role="button"
          tabIndex={0}
          className="is-clickable absolute right-3 top-0 z-10 inline-flex -translate-y-full"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onDotClick?.(booking, e)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              e.preventDefault()
              onDotClick?.(booking, e as unknown as React.MouseEvent)
            }
          }}
          aria-label="Assegna tavolo"
        >
          <Badge
            variant="warning"
            className="whitespace-nowrap rounded-b-none border-(--color-border)! bg-surface! text-[0.6875rem]! font-semibold shadow-sm"
          >
            DA ASSEGNARE
          </Badge>
        </span>
      )}

      <div className="flex flex-col gap-2.5 px-4 py-4 md:px-5">
        {/* Nome cliente */}
        <div className="min-w-0 truncate text-base font-bold leading-snug text-primary-900 sm:text-[1.125rem]">
          {booking.client_name}
        </div>

        {/* Numero ospiti + orario */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[0.9375rem] font-normal leading-none tabular-nums text-gray-900 sm:text-base">
            {booking.num_guests}
          </span>
          <span className="text-[0.9375rem] font-normal leading-snug text-gray-900">
            {booking.num_guests === 1 ? 'ospite' : 'ospiti'}
          </span>
          {bookingTimeLabel && (
            <>
              <span className="text-[0.9375rem] leading-snug text-(--color-text-muted)">·</span>
              <span className="text-[0.9375rem] font-normal leading-snug tabular-nums text-primary-900">
                {bookingTimeLabel}
              </span>
            </>
          )}
        </div>

        {/* Badge tipologia prenotazione + card scorrevole (sotto i dati prenotazione) */}
        {badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {badges.map((badge) => (
              <Badge
                key={badge.key}
                variant={badge.variant}
                className="max-w-40 truncate text-label! font-normal"
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Prezzo menù (opzionale) */}
        {menuPriceRow && (
          <div className="flex items-baseline justify-between gap-3 border-t border-(--color-border) pt-2">
            <span className="min-w-0 text-title-subtitle font-normal text-primary-900">
              {menuPriceRow.prezzoMenuLabel}
            </span>
            {menuPriceRow.prezzoTotaleLabel && (
              <span className="shrink-0 text-value font-normal text-(--color-text-muted)">
                Tot. {menuPriceRow.prezzoTotaleLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
