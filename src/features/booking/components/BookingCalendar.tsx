import React, { useState, useEffect, useMemo, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Calendar, Users, Tag, PenLine } from 'lucide-react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import type { BookingRequest } from '@/types/booking'
import {
  transformBookingsToCalendarEvents,
  transformBookingToCalendarEvent,
} from '../utils/bookingEventTransform'
import { BookingDetailsModal } from './BookingDetailsModal'
import { calculateDailyCapacity, getStartSlotForBooking } from '../utils/capacityCalculator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

import {
  extractDateFromISO,
  getAccurateStartTime,
  startTimeToMinutesSinceMidnight,
} from '../utils/dateUtils'
import { getResolvedMenuPriceDisplay } from '../utils/menuPricing'
import {
  DEFAULT_BOOKING_TIME_SLOTS,
  getBookingTimeSlotLabel,
} from '../utils/bookingTimeSlots'
import { useRestaurantSetting } from '../hooks/useRestaurantSetting'

/** Sfondo sezione calendario: arancio chiarissimo → giallo chiarissimo, più tenue del top bar admin */
const CALENDAR_SECTION_WARM_SURFACE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgb(255 241 232) 0%, rgb(255 247 240) 48%, rgb(255 252 236) 100%)',
  borderColor: 'rgba(251, 191, 160, 0.32)',
}

/** True se la prenotazione prevede menù / rinfresco (non “solo tavolo”). */
function digestBookingHasMenuContext(booking: BookingRequest): boolean {
  if (booking.menu?.trim()) return true
  if (booking.booking_type === 'rinfresco_laurea') return true
  if (booking.preset_menu) return true
  if ((booking.menu_total_per_person ?? 0) > 0) return true
  return !!(booking.menu_selection?.items && booking.menu_selection.items.length > 0)
}

function DigestBookingListRow({
  booking,
  onOpen,
  showMenuPricing = false,
  compactGrid = false,
  slot,
}: {
  booking: BookingRequest
  onOpen: (b: BookingRequest) => void
  showMenuPricing?: boolean
  /** Card strette per griglia a 3 colonie (digest calendario). */
  compactGrid?: boolean
  slot?: 'morning' | 'afternoon' | 'evening'
}) {
  const calEv = transformBookingToCalendarEvent(booking)
  const menuPriceRow = showMenuPricing ? getResolvedMenuPriceDisplay(booking) : null
  const hasSpecialNote = !!booking.special_requests?.trim()
  const [showNoteHint, setShowNoteHint] = useState(false)
  const slotColors =
    slot === 'morning'
      ? { backgroundColor: 'rgb(16, 185, 129)', borderColor: 'rgb(5, 150, 105)' }
      : slot === 'afternoon'
        ? { backgroundColor: 'rgb(251, 146, 60)', borderColor: 'rgb(234, 88, 12)' }
        : slot === 'evening'
          ? { backgroundColor: 'rgb(147, 197, 253)', borderColor: 'rgb(96, 165, 250)' }
          : null

  return (
    <button
      type="button"
      onClick={() => onOpen(booking)}
      className={`relative min-h-0 w-full min-w-0 rounded-lg border-2 text-left transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-warm-wood focus:ring-offset-2 ${
        compactGrid ? 'flex w-full min-h-[2.938775rem] flex-col shadow-sm' : ''
      }`}
      style={{
        backgroundColor: slotColors?.backgroundColor ?? calEv.backgroundColor,
        borderColor: slotColors?.borderColor ?? calEv.borderColor,
        color: calEv.textColor ?? '#fff',
      }}
    >
      <div
        className={`flex min-h-0 flex-col ${compactGrid ? 'overflow-visible items-stretch justify-center gap-0.5 px-2 py-1 text-center text-[16px] leading-tight sm:text-[18px]' : 'overflow-hidden flex-1 px-2 py-1.5 text-xs'}`}
      >
        {!compactGrid ? (
          <div className="mb-1 flex w-full items-center gap-1.5 truncate font-semibold leading-snug">
            <Users className="flex-shrink-0 h-3 w-3" />
            <span className="min-w-0 truncate">{booking.client_name}</span>
          </div>
        ) : (
          <div className="relative w-full min-h-[1.25rem]">
            <Users
              className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-90 sm:h-4 sm:w-4"
              style={{ left: 0 }}
              aria-hidden
            />
            <div className="flex w-full items-center justify-center text-center leading-tight">
              <span className={`block max-w-full truncate px-1 ${hasSpecialNote ? 'pr-6' : ''}`}>
                <span className="font-semibold">{booking.client_name}</span>
                <span className="font-normal opacity-90">
                  {' - '}
                  {booking.num_guests} osp.
                  {(booking.desired_time || booking.confirmed_start) && (
                    <>
                      {' - '}
                      <span className="font-medium">{getAccurateStartTime(booking)}</span>
                    </>
                  )}
                </span>
              </span>
            </div>
          </div>
        )}
        {!compactGrid ? (
          <div className="flex items-center gap-2 text-xs opacity-90 truncate">
            <span>{booking.num_guests} ospiti</span>
            {booking.menu && (
              <>
                <span>•</span>
                <span className="truncate">{booking.menu}</span>
              </>
            )}
            {(booking.desired_time || booking.confirmed_start) && (
              <>
                <span>•</span>
                <span>{getAccurateStartTime(booking)}</span>
              </>
            )}
          </div>
        ) : (
          <>
            {menuPriceRow && (
              <div className="relative w-full min-h-[1.25rem] opacity-90 text-[0.98em]">
                <Tag
                  className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-90 sm:h-4 sm:w-4"
                  style={{ left: 0 }}
                  aria-hidden
                />
                <div className="flex w-full items-center justify-center text-center font-semibold opacity-95">
                  <span className="block max-w-full truncate px-1">
                    {menuPriceRow.prezzoMenuLabel}
                    {menuPriceRow.prezzoTotaleLabel && <> • Tot. {menuPriceRow.prezzoTotaleLabel}</>}
                  </span>
                </div>
              </div>
            )}
            {booking.menu && (
              <p className="line-clamp-2 w-full break-words text-center opacity-85 text-[0.98em]" title={booking.menu}>
                {booking.menu}
              </p>
            )}
          </>
        )}
        {menuPriceRow && !compactGrid && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/25 pt-1.5 text-xs font-semibold leading-snug opacity-95">
            <span className="inline-flex min-w-0 items-center gap-0.5">
              <Tag className="h-3.5 w-3.5 flex-shrink-0 opacity-90" aria-hidden />
              <span className="truncate">{menuPriceRow.prezzoMenuLabel}</span>
            </span>
            {menuPriceRow.prezzoTotaleLabel && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <span className="opacity-75">·</span>
                <span className="truncate">Tot. {menuPriceRow.prezzoTotaleLabel}</span>
              </span>
            )}
          </div>
        )}
      </div>
      {hasSpecialNote && compactGrid && (
        <>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation()
              setShowNoteHint((prev) => !prev)
            }}
            onMouseEnter={() => setShowNoteHint(true)}
            onMouseLeave={() => setShowNoteHint(false)}
            onBlur={() => setShowNoteHint(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                setShowNoteHint((prev) => !prev)
              }
            }}
            className="absolute top-1 z-20 cursor-pointer text-slate-800/95"
            style={{ right: 2, left: 'auto' }}
            aria-label="Questa prenotazione ha una nota salvata"
          >
            <PenLine className="h-3 w-3" />
          </span>
          {showNoteHint && (
            <div
              className="absolute z-[80] max-w-[min(calc(100vw-16px),20rem)] rounded-md bg-slate-900 px-2.5 py-1.5 text-white shadow-lg sm:max-w-none sm:whitespace-nowrap"
              style={{
                right: 2,
                bottom: 'calc(100% + 2px)',
                fontSize: '0.875rem',
                lineHeight: 1.35,
                fontWeight: 500,
              }}
              role="tooltip"
            >
              C&apos;è una nota salvata
            </div>
          )}
        </>
      )}
    </button>
  )
}

interface BookingCalendarProps {
  bookings: BookingRequest[]
  initialDate?: string | null
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, initialDate }) => {
  const bookingSlotsQuery = useRestaurantSetting('booking_time_slots')
  const bookingSlots = bookingSlotsQuery.data ?? DEFAULT_BOOKING_TIME_SLOTS

  const splitDigestBySlot = (digestBookings: BookingRequest[]) => {
    const morning: BookingRequest[] = []
    const afternoon: BookingRequest[] = []
    const evening: BookingRequest[] = []

    for (const booking of digestBookings) {
      const startTime = getAccurateStartTime(booking)
      const fakeISOStart = `2025-01-01T${startTime}:00`
      const startSlot = getStartSlotForBooking(fakeISOStart, bookingSlots)

      if (startSlot === 'morning') morning.push(booking)
      else if (startSlot === 'afternoon') afternoon.push(booking)
      else if (startSlot === 'evening') evening.push(booking)
    }

    return { morning, afternoon, evening }
  }

  const calendarRef = useRef<FullCalendar>(null)
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentDateLabel = format(new Date(), 'dd/MM/yy')
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Set today's date as default, or initialDate if provided
    return initialDate || new Date().toISOString().split('T')[0]
  })
  const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth')

  // Aggiorna il selectedBooking quando i bookings cambiano (dopo modifica)
  useEffect(() => {
    if (selectedBooking && isModalOpen) {
      const updatedBooking = bookings.find(b => b.id === selectedBooking.id)
      if (updatedBooking) {
        // Aggiorna sempre selectedBooking quando viene trovato un booking aggiornato
        // Questo assicura che il modal mostri sempre i dati più recenti
        setSelectedBooking(updatedBooking)
      }
    }
  }, [bookings, isModalOpen])

  // Navigate to initialDate when it changes (from Archive)
  useEffect(() => {
    if (initialDate && calendarRef.current) {
      try {
        const calendarApi = calendarRef.current.getApi()
        const [year, month, day] = initialDate.split('-').map(Number)
        const targetDate = new Date(year, month - 1, day)
        calendarApi.gotoDate(targetDate)
        setSelectedDate(initialDate)
      } catch (error) {
        console.error('Error navigating to calendar date:', error)
      }
    }
  }, [initialDate])

  const events = transformBookingsToCalendarEvents(bookings)

  const handleEventClick = (clickInfo: any) => {
    const booking = clickInfo.event.extendedProps as BookingRequest
    
    if (!booking) {
      return
    }
    
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleDateClick = (clickInfo: any) => {
    // ✅ Fix: Normalizza la data per evitare problemi di timezone
    // Ignora dateStr e forza l'estrazione locale dai metodi get* dell'oggetto Date
    const d = new Date(clickInfo.date)
    
    // Usa i metodi locali per evitare conversioni UTC
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const date = `${year}-${month}-${day}`

    setSelectedDate(date)
  }

  // Get bookings and capacity for selected date
  const selectedDateData = useMemo(() => {
    const acceptedBookings = bookings.filter(b => b.status === 'accepted')
    const dayCapacity = calculateDailyCapacity(selectedDate, acceptedBookings, bookingSlots)
    
    const dayBookings = acceptedBookings.filter((booking) => {
      if (!booking.confirmed_start) return false
      const bookingDate = extractDateFromISO(booking.confirmed_start)
      return bookingDate === selectedDate
    })

    // Group bookings by time slot
    const morningBookings: BookingRequest[] = []
    const afternoonBookings: BookingRequest[] = []
    const eveningBookings: BookingRequest[] = []

    for (const booking of dayBookings) {
      if (!booking.confirmed_start || !booking.confirmed_end) continue

      // ✅ Use centralized helper to avoid timezone discrepancies
      const startTime = getAccurateStartTime(booking)

      // Create a fake ISO string with the correct local time for getStartSlotForBooking
      const fakeISOStart = `2025-01-01T${startTime}:00`

      // Display booking only in the slot where it STARTS
      const startSlot = getStartSlotForBooking(fakeISOStart, bookingSlots)

      if (startSlot === 'morning') morningBookings.push(booking)
      else if (startSlot === 'afternoon') afternoonBookings.push(booking)
      else if (startSlot === 'evening') eveningBookings.push(booking)
    }

    return {
      date: selectedDate,
      capacity: dayCapacity,
      morningBookings,
      afternoonBookings,
      eveningBookings,
    }
  }, [selectedDate, bookings, bookingSlots])

  /** Stessi criteri del calendario: accettate con inizio/fine; ordinate per ora di inizio; divise menù vs solo tavolo */
  const { selectedDayDigestBookings, digestWithMenu, digestTableOnly } = useMemo(() => {
    const sorted = bookings
      .filter((b) => b.status === 'accepted' && b.confirmed_start && b.confirmed_end)
      .filter((b) => extractDateFromISO(b.confirmed_start!) === selectedDate)
      .sort((a, b) => {
        const ma = startTimeToMinutesSinceMidnight(getAccurateStartTime(a)) ?? 24 * 60
        const mb = startTimeToMinutesSinceMidnight(getAccurateStartTime(b)) ?? 24 * 60
        return ma - mb
      })
    return {
      selectedDayDigestBookings: sorted,
      digestWithMenu: sorted.filter(digestBookingHasMenuContext),
      digestTableOnly: sorted.filter((b) => !digestBookingHasMenuContext(b)),
    }
  }, [bookings, selectedDate])
  const digestWithMenuBySlot = useMemo(() => splitDigestBySlot(digestWithMenu), [digestWithMenu, bookingSlots])
  const digestTableOnlyBySlot = useMemo(() => splitDigestBySlot(digestTableOnly), [digestTableOnly, bookingSlots])

  const openDigestBooking = (booking: BookingRequest) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const config = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: currentView,
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next',
    },
    height: 'auto',
    locale: 'it',
    firstDay: 1, // Monday
    slotMinTime: '08:00:00',
    slotMaxTime: '24:00:00',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
      startTime: '08:00',
      endTime: '22:00',
    },
    eventClick: handleEventClick,
    dateClick: handleDateClick,
    eventDisplay: 'block',
    eventTextColor: '#fff',
    eventTimeFormat: {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
    },
    // Ensure events don't overflow to other days in month view
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    // Highlight today and selected date with stable CSS classes
    dayCellClassNames: (arg: any) => {
      const d = new Date(arg.date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const cellDateStr = `${year}-${month}-${day}`

      const today = new Date()
      const todayYear = today.getFullYear()
      const todayMonth = String(today.getMonth() + 1).padStart(2, '0')
      const todayDay = String(today.getDate()).padStart(2, '0')
      const todayStr = `${todayYear}-${todayMonth}-${todayDay}`

      return [
        cellDateStr === todayStr ? 'calendar-day-today' : '',
        cellDateStr === selectedDate ? 'calendar-day-selected' : '',
      ].filter(Boolean)
    },
    // Custom event rendering per card eventi migliorate
    eventContent: (arg: any) => {
      const booking = arg.event.extendedProps as BookingRequest

      return (
        <div className="px-2 py-1.5 rounded-lg text-white text-xs hover:opacity-90 transition-opacity cursor-pointer overflow-hidden">
          {/* Nome cliente */}
          <div className="flex items-center gap-1.5 font-semibold truncate mb-1">
            <Users className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{booking.client_name}</span>
          </div>
          
          {/* Dati in fila sotto */}
          <div className="flex items-center gap-2 text-xs opacity-90 truncate">
            <span>{booking.num_guests} ospiti</span>
            {booking.menu && (
              <>
                <span>•</span>
                <span className="truncate">{booking.menu}</span>
              </>
            )}
            {(booking.desired_time || booking.confirmed_start) && (
              <>
                <span>•</span>
                <span>{getAccurateStartTime(booking)}</span>
              </>
            )}
          </div>
        </div>
      )
    },
  }

  const handleViewChange = (view: typeof currentView) => {
    setCurrentView(view)
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.changeView(view)
    }
  }

  const handleGoToToday = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    setSelectedDate(todayStr)

    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.gotoDate(today)
    }
  }

  const viewButtonClass = (view: typeof currentView) => {
    const isActive = currentView === view
    return `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-warm-wood text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`
  }

  return (
    <>
      <div
        className="space-y-6 rounded-xl border p-4 shadow-sm md:p-6"
        style={CALENDAR_SECTION_WARM_SURFACE}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-warm-beige">
          {/* Header Responsive — stesso warm del top bar AdminDashboard */}
          <div
            className="mb-6 flex flex-col items-center gap-3 rounded-xl border px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4"
            style={CALENDAR_SECTION_WARM_SURFACE}
          >
            {/* Icona + Titolo */}
            <div
              className="relative flex w-full items-center py-3 sm:flex-1"
              style={{ minHeight: 'calc(48px * 6 / 5 * 6 / 5)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warm-wood to-warm-orange flex items-center justify-center shadow-md">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <span className="ml-3 text-sm font-semibold text-warm-wood sm:text-base">
                {currentDateLabel}
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 text-center">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warm-wood">
                  Calendario Prenotazioni
                </h2>
              </div>
              <div className="ml-auto md:hidden">
                <Select value={currentView} onValueChange={handleViewChange}>
                  <SelectTrigger
                    className={[
                      'w-[calc(70px*4/3*6/5)] min-w-0 max-w-[calc(70px*4/3*6/5)] shrink-0 px-2 !border-[var(--color-primary)] !bg-[var(--color-primary)] !text-white shadow-sm [&>span]:!truncate [&>span]:!text-white [&_[data-placeholder]]:!text-white',
                      'hover:!border-[var(--color-primary-dark)] hover:!bg-[var(--color-primary-dark)] hover:shadow-md',
                      'focus:!border-[var(--color-primary-dark)] focus:ring-4 focus:ring-white/30 focus:ring-offset-0',
                      '[&_svg]:!text-white/90 disabled:!opacity-60',
                    ].join(' ')}
                    style={{ color: '#ffffff' }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white !bg-white bg-opacity-100"
                    style={{ backgroundColor: '#ffffff', opacity: 1, zIndex: 9999 }}
                  >
                    <SelectItem value="dayGridMonth">Mese</SelectItem>
                    <SelectItem value="timeGridWeek">Settimana</SelectItem>
                    <SelectItem value="timeGridDay">Giorno</SelectItem>
                    <SelectItem value="listWeek">Lista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* View Controls */}
            <div className="hidden md:flex items-center justify-end w-full sm:w-auto">
              {/* Pulsanti Vista - Desktop only */}
              <div className="flex gap-2">
                <button onClick={() => handleViewChange('dayGridMonth')} className={viewButtonClass('dayGridMonth')}>
                  Mese
                </button>
                <button onClick={() => handleViewChange('timeGridWeek')} className={viewButtonClass('timeGridWeek')}>
                  Settimana
                </button>
                <button onClick={() => handleViewChange('timeGridDay')} className={viewButtonClass('timeGridDay')}>
                  Giorno
                </button>
                <button onClick={() => handleViewChange('listWeek')} className={viewButtonClass('listWeek')}>
                  Lista
                </button>
              </div>
            </div>
          </div>

          <div className="booking-calendar-fc relative [&_.fc-event]:cursor-pointer">
            <button
              type="button"
              onClick={handleGoToToday}
              className="absolute left-0 top-0 z-20 inline-flex items-center justify-center rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] text-sm font-medium leading-none text-white shadow-sm transition-colors hover:border-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
              style={{ height: 40, minHeight: 40, minWidth: 88, padding: '0 14px', borderRadius: 12, color: '#ffffff' }}
            >
              Oggi
            </button>
            <FullCalendar ref={calendarRef} {...config} events={events} />
          </div>
        </div>

        {/* Giornata selezionata: elenco prenotazioni e fasce */}
        <div>
          <div className="mb-8 w-full max-w-7xl mx-auto">
            <h4 className="text-center text-base font-semibold text-warm-wood mb-3 leading-snug">
              Prenotazioni del giorno:{' '}
              <span className="font-normal text-gray-600">
                {format(new Date(selectedDateData.date), 'EEEE, dd MMMM yyyy', { locale: it })} ={' '}
                {selectedDayDigestBookings.length}{' '}
                {selectedDayDigestBookings.length === 1 ? 'Prenotazione' : 'Prenotazioni'}
              </span>
            </h4>
            {selectedDayDigestBookings.length > 0 ? (
              <div className="space-y-8">
                <section aria-labelledby="digest-with-menu-heading">
                  <div
                    id="digest-with-menu-heading"
                    className="mb-3 rounded-lg border border-slate-200 bg-gradient-to-r from-[rgba(45,212,191,0.38)] via-teal-100/90 to-white px-3 py-2 text-center shadow-sm"
                  >
                    <h5 className="!text-[19px] font-semibold tracking-wide text-amber-950">
                      Prenotazioni con menù
                    </h5>
                  </div>
                  {digestWithMenu.length > 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white/80 p-2 shadow-inner">
                      <div className="hidden min-[819px]:grid grid-cols-3 gap-2">
                        <h6
                          className="flex items-center justify-center px-3 text-center shadow-sm"
                          style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(16, 185, 129)', border: '1px solid rgb(5, 150, 105)', color: '#ffffff' }}
                        >
                          {getBookingTimeSlotLabel('morning', bookingSlots)}
                        </h6>
                        <h6
                          className="flex items-center justify-center px-3 text-center shadow-sm"
                          style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(249, 115, 22)', border: '1px solid rgb(194, 65, 12)', color: '#ffffff' }}
                        >
                          {getBookingTimeSlotLabel('afternoon', bookingSlots)}
                        </h6>
                        <h6
                          className="flex items-center justify-center px-3 text-center shadow-sm"
                          style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(56, 189, 248)', border: '1px solid rgb(2, 132, 199)', color: '#ffffff' }}
                        >
                          {getBookingTimeSlotLabel('evening', bookingSlots)}
                        </h6>
                      </div>
                      <div className="mt-2 hidden min-[819px]:block">
                        <div className="grid grid-cols-3 gap-2 [grid-auto-rows:minmax(0,_auto)] items-start">
                          <div className="flex min-w-0 w-full flex-col gap-2">
                            {digestWithMenuBySlot.morning.map((booking) => (
                              <div key={booking.id} className="flex min-w-0 w-full flex-col">
                                <DigestBookingListRow
                                  booking={booking}
                                  onOpen={openDigestBooking}
                                  showMenuPricing
                                  compactGrid
                                  slot="morning"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex min-w-0 w-full flex-col gap-2">
                            {digestWithMenuBySlot.afternoon.map((booking) => (
                              <div key={booking.id} className="flex min-w-0 w-full flex-col">
                                <DigestBookingListRow
                                  booking={booking}
                                  onOpen={openDigestBooking}
                                  showMenuPricing
                                  compactGrid
                                  slot="afternoon"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex min-w-0 w-full flex-col gap-2">
                            {digestWithMenuBySlot.evening.map((booking) => (
                              <div key={booking.id} className="flex min-w-0 w-full flex-col">
                                <DigestBookingListRow
                                  booking={booking}
                                  onOpen={openDigestBooking}
                                  showMenuPricing
                                  compactGrid
                                  slot="evening"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="min-[819px]:hidden space-y-3">
                        <div className="space-y-2">
                          <h6
                            className="flex items-center justify-center px-3 text-center shadow-sm"
                            style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(16, 185, 129)', border: '1px solid rgb(5, 150, 105)', color: '#ffffff' }}
                          >
                            {getBookingTimeSlotLabel('morning', bookingSlots)}
                          </h6>
                          {digestWithMenuBySlot.morning.map((booking) => (
                            <div key={booking.id} className="flex min-w-0 w-full flex-col">
                              <DigestBookingListRow
                                booking={booking}
                                onOpen={openDigestBooking}
                                showMenuPricing
                                compactGrid
                                slot="morning"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h6
                            className="flex items-center justify-center px-3 text-center shadow-sm"
                            style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(249, 115, 22)', border: '1px solid rgb(194, 65, 12)', color: '#ffffff' }}
                          >
                            {getBookingTimeSlotLabel('afternoon', bookingSlots)}
                          </h6>
                          {digestWithMenuBySlot.afternoon.map((booking) => (
                            <div key={booking.id} className="flex min-w-0 w-full flex-col">
                              <DigestBookingListRow
                                booking={booking}
                                onOpen={openDigestBooking}
                                showMenuPricing
                                compactGrid
                                slot="afternoon"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h6
                            className="flex items-center justify-center px-3 text-center shadow-sm"
                            style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(56, 189, 248)', border: '1px solid rgb(2, 132, 199)', color: '#ffffff' }}
                          >
                            {getBookingTimeSlotLabel('evening', bookingSlots)}
                          </h6>
                          {digestWithMenuBySlot.evening.map((booking) => (
                            <div key={booking.id} className="flex min-w-0 w-full flex-col">
                              <DigestBookingListRow
                                booking={booking}
                                onOpen={openDigestBooking}
                                showMenuPricing
                                compactGrid
                                slot="evening"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500 italic py-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80">
                      Nessuna prenotazione con menù per questa data.
                    </p>
                  )}
                </section>

                <div className="border-t-2 border-slate-200 pt-8 mt-2" aria-hidden />

                <section aria-labelledby="digest-table-only-heading">
                  <div
                    id="digest-table-only-heading"
                    className="mb-3 rounded-lg border border-slate-200 bg-gradient-to-r from-[rgba(45,212,191,0.38)] via-teal-100/90 to-white px-3 py-2 text-center shadow-sm"
                  >
                    <h5 className="!text-[19px] font-semibold tracking-wide text-slate-800">
                      Solo tavolo
                    </h5>
                  </div>
                  {digestTableOnly.length > 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white/80 p-2 shadow-inner">
                      <div className="hidden min-[819px]:grid grid-cols-3 gap-2">
                        <h6
                          className="flex items-center justify-center px-3 text-center shadow-sm"
                          style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(16, 185, 129)', border: '1px solid rgb(5, 150, 105)', color: '#ffffff' }}
                        >
                          {getBookingTimeSlotLabel('morning', bookingSlots)}
                        </h6>
                        <h6
                          className="flex items-center justify-center px-3 text-center shadow-sm"
                          style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(249, 115, 22)', border: '1px solid rgb(194, 65, 12)', color: '#ffffff' }}
                        >
                          {getBookingTimeSlotLabel('afternoon', bookingSlots)}
                        </h6>
                        <h6
                          className="flex items-center justify-center px-3 text-center shadow-sm"
                          style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(56, 189, 248)', border: '1px solid rgb(2, 132, 199)', color: '#ffffff' }}
                        >
                          {getBookingTimeSlotLabel('evening', bookingSlots)}
                        </h6>
                      </div>
                      <div className="mt-2 hidden min-[819px]:block">
                        <div className="grid grid-cols-3 gap-2 [grid-auto-rows:minmax(0,_auto)] items-start">
                          <div className="flex min-w-0 w-full flex-col gap-2">
                            {digestTableOnlyBySlot.morning.map((booking) => (
                              <div key={booking.id} className="flex min-w-0 w-full flex-col">
                                <DigestBookingListRow
                                  booking={booking}
                                  onOpen={openDigestBooking}
                                  compactGrid
                                  slot="morning"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex min-w-0 w-full flex-col gap-2">
                            {digestTableOnlyBySlot.afternoon.map((booking) => (
                              <div key={booking.id} className="flex min-w-0 w-full flex-col">
                                <DigestBookingListRow
                                  booking={booking}
                                  onOpen={openDigestBooking}
                                  compactGrid
                                  slot="afternoon"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex min-w-0 w-full flex-col gap-2">
                            {digestTableOnlyBySlot.evening.map((booking) => (
                              <div key={booking.id} className="flex min-w-0 w-full flex-col">
                                <DigestBookingListRow
                                  booking={booking}
                                  onOpen={openDigestBooking}
                                  compactGrid
                                  slot="evening"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="min-[819px]:hidden space-y-3">
                        <div className="space-y-2">
                          <h6
                            className="flex items-center justify-center px-3 text-center shadow-sm"
                            style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(16, 185, 129)', border: '1px solid rgb(5, 150, 105)', color: '#ffffff' }}
                          >
                            {getBookingTimeSlotLabel('morning', bookingSlots)}
                          </h6>
                          {digestTableOnlyBySlot.morning.map((booking) => (
                            <div key={booking.id} className="flex min-w-0 w-full flex-col">
                              <DigestBookingListRow
                                booking={booking}
                                onOpen={openDigestBooking}
                                compactGrid
                                slot="morning"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h6
                            className="flex items-center justify-center px-3 text-center shadow-sm"
                            style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(249, 115, 22)', border: '1px solid rgb(194, 65, 12)', color: '#ffffff' }}
                          >
                            {getBookingTimeSlotLabel('afternoon', bookingSlots)}
                          </h6>
                          {digestTableOnlyBySlot.afternoon.map((booking) => (
                            <div key={booking.id} className="flex min-w-0 w-full flex-col">
                              <DigestBookingListRow
                                booking={booking}
                                onOpen={openDigestBooking}
                                compactGrid
                                slot="afternoon"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h6
                            className="flex items-center justify-center px-3 text-center shadow-sm"
                            style={{ height: 56, borderRadius: 16, fontSize: 18, fontWeight: 800, lineHeight: 1, backgroundColor: 'rgb(56, 189, 248)', border: '1px solid rgb(2, 132, 199)', color: '#ffffff' }}
                          >
                            {getBookingTimeSlotLabel('evening', bookingSlots)}
                          </h6>
                          {digestTableOnlyBySlot.evening.map((booking) => (
                            <div key={booking.id} className="flex min-w-0 w-full flex-col">
                              <DigestBookingListRow
                                booking={booking}
                                onOpen={openDigestBooking}
                                compactGrid
                                slot="evening"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500 italic py-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80">
                      Nessuna prenotazione solo tavolo per questa data.
                    </p>
                  )}
                </section>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 italic py-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80">
                Nessuna prenotazione accettata per questa data.
              </p>
            )}
          </div>

        </div>


      </div>

      {/* Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedBooking(null)
          }}
          booking={selectedBooking}
        />
      )}
    </>
  )
}

