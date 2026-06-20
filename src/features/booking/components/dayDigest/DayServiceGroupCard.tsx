import React from 'react'
import type { BookingRequest } from '@/types/booking'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'
import { CollapsibleCard } from '@/components/ui/CollapsibleCard'
import type { DayServiceGroup } from '../../utils/dayDigestModel'
import { digestBookingHasMenuContext } from '../../utils/digestBookingUtils'
import { DayHourGroup } from './DayHourGroup'
import { BookingDigestCard } from './BookingDigestCard'
import { cn } from '@/lib/utils'

interface DayServiceGroupCardProps {
  group: DayServiceGroup
  isPro: boolean
  assignedBookingIds: Set<string>
  filterByTurn: (list: BookingRequest[]) => BookingRequest[]
  bookingModes?: BookingMode[]
  customStaffPresets?: CustomStaffPreset[]
  onOpenBooking: (booking: BookingRequest) => void
  onDotClick?: (booking: BookingRequest, e: React.MouseEvent) => void
}

export function DayServiceGroupCard({
  group,
  isPro,
  assignedBookingIds,
  filterByTurn,
  bookingModes = [],
  customStaffPresets = [],
  onOpenBooking,
  onDotClick,
}: DayServiceGroupCardProps) {
  const subtitle = buildSummary(group, isPro)
  const title = group.timeRange ? `${group.label}\u00a0\u00a0\u00a0\u00a0${group.timeRange}` : group.label
  const visibleHourGroups = group.hourGroups
    .map((hourGroup) => ({ hourGroup, visibleBookings: filterByTurn(hourGroup.bookings) }))
    .filter(({ visibleBookings }) => visibleBookings.length > 0)

  return (
    <CollapsibleCard
      title={title}
      subtitle={subtitle}
      defaultExpanded={false}
      titleClassName="text-title-section font-bold leading-snug text-gray-900"
      headerClassName="gap-3 bg-gray-50 px-4 py-4 hover:bg-gray-100 border-b border-gray-200 sm:px-6 sm:py-5"
      className={cn(group.isOutOfSlot && 'border-amber-300 bg-amber-50/30')}
    >
      {group.isOutOfSlot && (
        <p className="px-4 pt-4 text-body italic text-amber-700">
          Prenotazioni non coperte dalle fasce orarie configurate.
        </p>
      )}
      {group.totalBookings === 0 ? (
        <p className="py-7 text-center text-value italic text-(--color-text-muted)">
          Nessuna prenotazione
        </p>
      ) : (
        <div className="space-y-4 p-4 md:p-5">
          {visibleHourGroups.map(({ hourGroup, visibleBookings }, index) => (
            <DayHourGroup
              key={hourGroup.hourLabel}
              hourLabel={hourGroup.hourLabel}
              withDivider={index > 0}
            >
              {visibleBookings.map((booking) => (
                <BookingDigestCard
                  key={booking.id}
                  booking={booking}
                  onOpen={onOpenBooking}
                  showMenuPricing={digestBookingHasMenuContext(booking)}
                  unassigned={isPro && !assignedBookingIds.has(booking.id)}
                  assigned={isPro && assignedBookingIds.has(booking.id)}
                  hasTurns={isPro}
                  bookingModes={bookingModes}
                  customStaffPresets={customStaffPresets}
                  onDotClick={onDotClick}
                />
              ))}
            </DayHourGroup>
          ))}
        </div>
      )}
    </CollapsibleCard>
  )
}

function buildSummary(group: DayServiceGroup, isPro: boolean): React.ReactNode {
  const parts: string[] = []
  if (group.totalBookings === 0) {
    parts.push('Nessuna prenotazione')
    return <span className="text-[1.0625rem] font-semibold leading-snug">{parts.join(' · ')}</span>
  }
  parts.push(
    `${group.totalBookings} ${group.totalBookings === 1 ? 'prenotazione' : 'prenotazioni'}`,
  )
  parts.push(`${group.totalGuests} ${group.totalGuests === 1 ? 'coperto' : 'coperti'}`)
  if (isPro && group.pendingAssignments > 0) {
    parts.push(`${group.pendingAssignments} da assegnare`)
  }
  return <span className="text-[1.0625rem] font-semibold leading-snug">{parts.join(' · ')}</span>
}
