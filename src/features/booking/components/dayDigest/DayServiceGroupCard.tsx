import React from 'react'
import type { BookingRequest } from '@/types/booking'
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
  onOpenBooking: (booking: BookingRequest) => void
  onDotClick?: (booking: BookingRequest, e: React.MouseEvent) => void
}

export function DayServiceGroupCard({
  group,
  isPro,
  assignedBookingIds,
  filterByTurn,
  onOpenBooking,
  onDotClick,
}: DayServiceGroupCardProps) {
  const subtitle = buildSubtitle(group, isPro)

  return (
    <CollapsibleCard
      title={group.label}
      subtitle={subtitle}
      defaultExpanded={false}
      titleClassName="text-title-section font-semibold text-gray-900"
      headerClassName="bg-gray-50 px-6 py-5 hover:bg-gray-100 border-b border-gray-200"
      className={cn(group.isOutOfSlot && 'border-amber-300 bg-amber-50/30')}
    >
      {group.isOutOfSlot && (
        <p className="px-4 pt-4 text-body italic text-amber-700">
          Prenotazioni non coperte dalle fasce orarie configurate.
        </p>
      )}
      {group.totalBookings === 0 ? (
        <p className="py-7 text-center text-body italic text-(--color-text-muted)">
          Nessuna prenotazione
        </p>
      ) : (
        <div className="space-y-4 p-4">
          {group.hourGroups.map((hg) => {
            const visible = filterByTurn(hg.bookings)
            if (!visible.length) return null
            return (
              <DayHourGroup key={hg.hourLabel} hourLabel={hg.hourLabel}>
                {visible.map((booking) => (
                  <BookingDigestCard
                    key={booking.id}
                    booking={booking}
                    onOpen={onOpenBooking}
                    showMenuPricing={digestBookingHasMenuContext(booking)}
                    unassigned={isPro && !assignedBookingIds.has(booking.id)}
                    assigned={isPro && assignedBookingIds.has(booking.id)}
                    hasTurns={isPro}
                    onDotClick={onDotClick}
                  />
                ))}
              </DayHourGroup>
            )
          })}
        </div>
      )}
    </CollapsibleCard>
  )
}

function buildSubtitle(group: DayServiceGroup, isPro: boolean): React.ReactNode {
  const parts: string[] = []
  if (group.timeRange) parts.push(group.timeRange)
  if (group.totalBookings === 0) {
    parts.push('Nessuna prenotazione')
    return <span className="text-body">{parts.join(' · ')}</span>
  }
  parts.push(
    `${group.totalBookings} ${group.totalBookings === 1 ? 'prenotazione' : 'prenotazioni'}`,
  )
  parts.push(`${group.totalGuests} ${group.totalGuests === 1 ? 'coperto' : 'coperti'}`)
  if (isPro && group.pendingAssignments > 0) {
    parts.push(`${group.pendingAssignments} da assegnare`)
  }
  return <span className="text-body">{parts.join(' · ')}</span>
}
