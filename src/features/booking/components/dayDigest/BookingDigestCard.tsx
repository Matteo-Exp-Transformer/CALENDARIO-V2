import React from 'react'
import type { BookingRequest } from '@/types/booking'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'
import { getAccurateStartTime } from '../../utils/dateUtils'
import { getResolvedMenuPriceDisplay } from '../../utils/menuPricing'
import { resolveSubTabFromBooking } from '../../utils/buildBookingEmailSummary'
import { getModeLabelByType } from '../../utils/bookingModeLabels'
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
  interactive?: boolean
  ariaLabel?: string
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
  unassigned,
  hasTurns,
  bookingModes = [],
  customStaffPresets = [],
}: {
  booking: BookingRequest
  unassigned: boolean
  hasTurns: boolean
  bookingModes?: BookingMode[]
  customStaffPresets?: CustomStaffPreset[]
}): DigestBadge[] {
  const badges: DigestBadge[] = []
  const seen = new Set<string>()

  if (hasTurns && unassigned) {
    addUniqueBadge(badges, seen, {
      key: 'unassigned',
      label: 'DA ASSEGNARE',
      variant: 'warning',
      interactive: true,
      ariaLabel: 'Assegna tavolo',
    })
  }

  const mode = bookingModes.find((m) => m.booking_type === booking.booking_type && m.enabled)
  const modeLabel =
    cleanBadgeLabel(mode?.booking_badge_label) ||
    cleanBadgeLabel(mode?.label) ||
    cleanBadgeLabel(getModeLabelByType(bookingModes, booking.booking_type))
  if (modeLabel) {
    addUniqueBadge(badges, seen, {
      key: 'booking-type',
      label: modeLabel,
      variant: 'primary',
    })
  }

  const subTab = resolveSubTabFromBooking(booking, mode, customStaffPresets)
  const subTabLabel = cleanBadgeLabel(subTab?.booking_badge_label) || cleanBadgeLabel(subTab?.label)
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
  const badges = buildDigestBadges({
    booking,
    unassigned,
    hasTurns,
    bookingModes,
    customStaffPresets,
  })

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
      <div className="flex flex-col gap-2.5 px-4 py-4 md:px-5">
        {/* (1) Nome cliente — elemento più evidente */}
        <div className="flex min-w-0 items-center pr-8">
          <span className="min-w-0 truncate text-[1.125rem] font-bold leading-snug text-primary-900 sm:text-[1.25rem]">
            {booking.client_name}
          </span>
        </div>

        {/* (2) Numero ospiti — nero, grande; (3) orario preciso */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[1rem] font-normal leading-none tabular-nums text-gray-900 sm:text-[1.125rem]">
            {booking.num_guests}
          </span>
          <span className="text-[1.0625rem] font-normal leading-snug text-gray-900">
            {booking.num_guests === 1 ? 'ospite' : 'ospiti'}
          </span>
          {bookingTimeLabel && (
            <>
              <span className="text-[1.0625rem] leading-snug text-(--color-text-muted)">·</span>
              <span className="text-[1.0625rem] font-normal leading-snug tabular-nums text-primary-900">
                {bookingTimeLabel}
              </span>
            </>
          )}
        </div>

        {/* (4) Badge: stato PRO + tipologia + card sulla stessa riga visiva */}
        <div className="flex max-w-full flex-wrap items-center gap-1.5 pt-0.5">
          {badges.map((badge) =>
            badge.interactive ? (
              <span
                key={badge.key}
                role="button"
                tabIndex={0}
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
                aria-label={badge.ariaLabel}
                className="is-clickable inline-flex min-w-0 shrink-0"
              >
                <Badge variant={badge.variant} className="max-w-full shrink-0 truncate text-label! font-normal">
                  {badge.label}
                </Badge>
              </span>
            ) : (
              <Badge
                key={badge.key}
                variant={badge.variant}
                className="max-w-full shrink-0 truncate text-label! font-normal"
              >
                {badge.label}
              </Badge>
            )
          )}
        </div>

        {/* Prezzo menù (opzionale, se showMenuPricing=true) */}
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

      <DigestBookingTypeIcon
        booking={booking}
        className="pointer-events-none absolute right-2 top-2 z-10 h-5 w-5 text-primary-500"
      />
    </div>
  )
}
