import React, { useState } from 'react'
import type { CSSProperties } from 'react'
import { useAllBookings } from '../hooks/useBookingQueries'
import { useRestoreBooking, useRequeueRejectedBooking } from '../hooks/useBookingMutations'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Calendar, Clock, Users, Tag, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, User, UtensilsCrossed, Wine, PartyPopper, GraduationCap, Archive, CheckCircle, XCircle, Trash2, RotateCcw } from 'lucide-react'
import { extractTimeFromISO } from '../utils/dateUtils'
import { getBookingEventTypeLabel } from '../utils/eventTypeLabels'
import { ADMIN_WARM_BORDER, ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { cn } from '@/lib/utils'

const AFTER_COLON = '\u2002'

type ArchiveFilter = 'all' | 'accepted' | 'rejected' | 'deleted'
type SortOrder = 'created_at' | 'booking_date'

const EVENT_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  cena: { label: 'Cena', icon: UtensilsCrossed, color: 'bg-booking-cena' },
  aperitivo: { label: 'Aperitivo', icon: Wine, color: 'bg-booking-aperitivo' },
  evento: { label: 'Evento Privato', icon: PartyPopper, color: 'bg-booking-evento' },
  laurea: { label: 'Laurea', icon: GraduationCap, color: 'bg-booking-laurea' },
}

const STATUS_LABELS: Record<string, { label: string; bgColor: string; textColor: string }> = {
  pending: { label: 'Pendente', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  accepted: { label: 'Accettata', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  rejected: { label: 'Rifiutata', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  deleted: { label: 'Rimossa', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
}

interface ArchiveBookingCardProps {
  booking: any
  onViewInCalendar?: (date: string) => void
  onRestore?: (bookingId: string) => void
  onRequeueToPending?: (bookingId: string) => void
}

/** Stesso aspetto della strip digest calendario (`#digest-with-menu-heading`). */
const DIGEST_MENU_HEADING_GRADIENT_BG =
  'bg-gradient-to-r from-[rgba(45,212,191,0.38)] via-teal-100/90 to-white'

/** Come `BookingRequestCard` DIGEST_BOOKING_HEADER_SURFACE — hover saturate in `.booking-request-collapse-header-gradient`. */
const ARCHIVE_CARD_DIGEST_SURFACE: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgba(45, 212, 191, 0.38) 0%, rgba(204, 251, 241, 0.9) 50%, rgb(255, 255, 255) 100%)',
}

const ArchiveBookingCard: React.FC<ArchiveBookingCardProps> = ({
  booking,
  onViewInCalendar,
  onRestore,
  onRequeueToPending,
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
    return timeStr.split(':').slice(0, 2).join(':')
  }

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'Non disponibile'
    try {
      return format(new Date(dateStr), 'd MMM yyyy, HH:mm', { locale: it })
    } catch {
      return dateStr
    }
  }

  const formatRequestSubmittedAt = (dateStr?: string) => {
    if (!dateStr) return 'Non disponibile'
    try {
      return format(new Date(dateStr), 'd MMMM yyyy, HH:mm', { locale: it })
    } catch {
      return dateStr
    }
  }


  const eventTypeLabel = getBookingEventTypeLabel(booking)
  // Usa eventConfig solo se event_type è valido, altrimenti usa valori di default
  const eventConfig = booking.event_type && EVENT_TYPE_CONFIG[booking.event_type] 
    ? EVENT_TYPE_CONFIG[booking.event_type] 
    : null
  const EventIcon = eventConfig?.icon || UtensilsCrossed
  const eventIconColor = eventConfig?.color || 'bg-gray-500'
  const statusConfig = STATUS_LABELS[booking.status] || STATUS_LABELS.pending

  const displayDate = booking.confirmed_start || booking.desired_date
  // ✅ FIX: Per prenotazioni accettate, usa confirmed_start invece di desired_time
  // Questo preserva l'orario esatto inserito dall'utente senza conversioni timezone
  const displayTime = booking.confirmed_start
    ? extractTimeFromISO(booking.confirmed_start)
    : booking.desired_time || 'Non specificato'

  return (
    <div className="relative">
      {/* Badge Data Creazione - Esterno, in alto a sinistra, completamente fuori dalla card */}
      {booking.created_at && (
        <div className="mb-2">
          <span
            className={`inline-block whitespace-nowrap rounded-lg border-0 px-4 py-2 text-xs font-semibold text-slate-800 shadow-none transition-all duration-300 ${DIGEST_MENU_HEADING_GRADIENT_BG}`}
          >
            Richiesta effettuata il :{AFTER_COLON}
            {formatRequestSubmittedAt(booking.created_at)}
          </span>
        </div>
      )}
      <div
        className="booking-request-card-shell overflow-hidden rounded-2xl border-0 border-b-[3px] border-solid shadow-none"
        style={{ borderBottomColor: ADMIN_WARM_BORDER }}
      >
        <div
          className={cn('booking-request-collapse-header', !isExpanded ? 'rounded-2xl' : 'rounded-t-2xl')}
        >
          <div
            className={cn(
              'booking-request-collapse-header-gradient',
              !isExpanded ? 'rounded-2xl' : 'rounded-t-2xl'
            )}
            style={ARCHIVE_CARD_DIGEST_SURFACE}
          >
      {/* Header Collapsible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'booking-request-digest-trigger relative z-0 w-full cursor-pointer border-0 bg-transparent p-6 text-left outline-none ring-0',
          'transition-colors duration-[220ms] hover:bg-white/55 active:scale-[0.995]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          !isExpanded ? 'rounded-2xl' : 'rounded-t-2xl'
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Icona Tipo Evento */}
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${eventIconColor} shadow-md flex-shrink-0`}>
              <EventIcon className="w-8 h-8 text-white" />
            </div>

            {/* Layout 2 colonne come BookingRequestCard */}
            <div className="text-left flex-1">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {/* Colonna Sinistra */}
                <div className="space-y-3">
                  {/* Tipo Evento - Mostra solo se esiste un valore valido */}
                  {eventTypeLabel && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-warm-orange flex-shrink-0" />  
                      <span className="text-base font-bold text-warm-wood">{eventTypeLabel}</span>                                                             
                    </div>
                  )}

                  {/* Nome Cliente */}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-warm-orange flex-shrink-0" />
                    <span className="text-base font-semibold text-warm-wood-dark">{booking.client_name}</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-warm-orange flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{booking.client_email}</span>
                  </div>

                  {/* Telefono */}
                  {booking.client_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-warm-orange flex-shrink-0" />
                      <span className="text-sm text-gray-600">{booking.client_phone}</span>
                    </div>
                  )}
                </div>

                {/* Colonna Destra */}
                <div className="space-y-3">
                  {/* Data */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-warm-orange flex-shrink-0" />
                    <span className="text-base font-semibold text-warm-wood-dark">{formatDate(displayDate)}</span>
                  </div>

                  {/* Ora */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warm-orange flex-shrink-0" />
                    <span className="text-base font-semibold text-warm-wood-dark">{formatTime(displayTime)}</span>
                  </div>

                  {/* Ospiti */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-warm-orange flex-shrink-0" />
                    <span className="text-base font-semibold text-warm-wood-dark">{booking.num_guests} ospiti</span>
                  </div>

                  {/* Note preview se presenti */}
                  {booking.special_requests && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-warm-orange flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 line-clamp-2 italic">
                        {booking.special_requests}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Badge Status + Chevron */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${statusConfig.bgColor} ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-warm-wood" />
            ) : (
              <ChevronDown className="w-6 h-6 text-warm-wood" />
            )}
          </div>
        </div>
      </button>
          </div>
        </div>

      {/* Contenuto Espandibile */}
      {isExpanded && (
        <div className="animate-slideDown rounded-b-2xl border-t-2 border-warm-orange/10 bg-white p-4 md:p-6">
          {/* Dati Organizzati - Responsive: 1 colonna su mobile, 2 su desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 md:gap-y-3">
            {/* Nome */}
            <div className="flex flex-row items-start gap-3 py-1.5 md:py-2">
              <span className="text-xs text-gray-500 w-24 md:w-28 font-medium uppercase tracking-wide flex-shrink-0">Nome:</span>
              <span className="text-sm md:text-base font-semibold text-warm-wood-dark break-words">{booking.client_name}</span>
            </div>

            {/* Email */}
            <div className="flex flex-row items-start gap-3 py-1.5 md:py-2">
              <span className="text-xs text-gray-500 w-24 md:w-28 font-medium uppercase tracking-wide flex-shrink-0">Email:</span>
              <span className="text-sm md:text-base font-semibold text-warm-wood-dark break-all">{booking.client_email}</span>
            </div>

            {/* Telefono */}
            {booking.client_phone && (
              <div className="flex flex-row items-start gap-3 py-1.5 md:py-2">
                <span className="text-xs text-gray-500 w-24 md:w-28 font-medium uppercase tracking-wide flex-shrink-0">Telefono:</span>
                <span className="text-sm md:text-base font-semibold text-warm-wood-dark">{booking.client_phone}</span>
              </div>
            )}

            {/* Data */}
            <div className="flex flex-row items-start gap-3 py-1.5 md:py-2">
              <span className="text-xs text-gray-500 w-24 md:w-28 font-medium uppercase tracking-wide flex-shrink-0">Data:</span>
              <span className="text-sm md:text-base font-semibold text-warm-wood-dark">{formatDate(displayDate)}</span>
            </div>

            {/* Orario */}
            <div className="flex flex-row items-start gap-3 py-1.5 md:py-2">
              <span className="text-xs text-gray-500 w-24 md:w-28 font-medium uppercase tracking-wide flex-shrink-0">Orario:</span>
              <span className="text-sm md:text-base font-semibold text-warm-wood-dark">{formatTime(displayTime)}</span>
            </div>

            {/* Pax */}
            <div className="flex flex-row items-start gap-3 py-1.5 md:py-2">
              <span className="text-xs text-gray-500 w-24 md:w-28 font-medium uppercase tracking-wide flex-shrink-0">Pax:</span>
              <span className="text-sm md:text-base font-semibold text-warm-wood-dark">{booking.num_guests}</span>
            </div>

                        {/* Tipo - Mostra solo se esiste un valore valido */}
            {eventTypeLabel && (
              <div className="flex flex-row items-start gap-3 py-1.5 md:py-2">  
                <span className="text-xs text-gray-500 w-24 md:w-28 font-medium uppercase tracking-wide flex-shrink-0">Tipo:</span>
                <span className="text-sm md:text-base font-semibold text-warm-wood-dark">{eventTypeLabel}</span>
              </div>
            )}

          </div>

          {/* Note Richieste Speciali - Fuori dalla griglia */}
          {booking.special_requests && (
            <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-warm-orange/20">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 md:mb-3">Richieste Speciali</p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words">
                {booking.special_requests}
              </p>
            </div>
          )}

          {/* Motivo rifiuto se presente */}
          {booking.rejection_reason && (
            <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-red-300/30">
              <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-2 md:mb-3">Motivo Rifiuto</p>
              <p className="text-sm md:text-base text-red-700 leading-relaxed break-words">
                {booking.rejection_reason}
              </p>
            </div>
          )}

          {/* Motivo cancellazione se presente */}
          {booking.status === 'deleted' && booking.cancellation_reason && (
            <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-300/30">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2 md:mb-3">Motivo Eliminazione</p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words">
                {booking.cancellation_reason}
              </p>
            </div>
          )}

          {/* Data cancellazione se presente */}
          {booking.status === 'deleted' && booking.cancelled_at && (
            <div className="pt-2">
              <p className="text-xs text-gray-500 italic">
                Eliminata il: {formatDateTime(booking.cancelled_at)}
              </p>
            </div>
          )}

          {/* Pulsante Reinserisci — solo eliminate (torna accepted in calendario se ha slot confermati) */}
          {booking.status === 'deleted' && onRestore && (
            <div className="flex gap-2 md:gap-4 pt-3 md:pt-4 border-t border-warm-orange/20 mt-4 md:mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRestore(booking.id)
                }}
                style={{ backgroundColor: '#0891b2', color: 'white' }}
                className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 hover:bg-cyan-700 font-bold text-sm md:text-lg shadow-xl rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                <span>Reinserisci</span>
              </button>
            </div>
          )}

          {/* Rifiutata → pending (richieste in attesa), stesso look del Reinserisci */}
          {booking.status === 'rejected' && onRequeueToPending && (
            <div className="flex gap-2 md:gap-4 pt-3 md:pt-4 border-t border-warm-orange/20 mt-4 md:mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRequeueToPending(booking.id)
                }}
                style={{ backgroundColor: '#0891b2', color: 'white' }}
                className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 hover:bg-cyan-700 font-bold text-sm md:text-lg shadow-xl rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                <span>Riporta in attesa</span>
              </button>
            </div>
          )}

          {/* Pulsante Visualizza nel Calendario - Solo per prenotazioni accettate */}
          {booking.status === 'accepted' && booking.confirmed_start && onViewInCalendar && (() => {
            // Estrai data da confirmed_start senza conversioni timezone
            const dateMatch = booking.confirmed_start.match(/(\d{4})-(\d{2})-(\d{2})/)
            const dateStr = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : null

            if (!dateStr) return null

            return (
              <div className="flex gap-2 md:gap-4 pt-3 md:pt-4 border-t border-warm-orange/20 mt-4 md:mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewInCalendar(dateStr)
                  }}
                  style={{ backgroundColor: '#059669', color: 'white' }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 hover:bg-green-700 font-bold text-sm md:text-lg shadow-xl rounded-xl transition-all"
                >
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Visualizza nel Calendario</span>
                  <span className="sm:hidden">Calendario</span>
                </button>
              </div>
            )
          })()}
        </div>
      )}
      </div>
    </div>
  )
}

interface ArchiveTabProps {
  onViewInCalendar?: (date: string) => void
}

export const ArchiveTab: React.FC<ArchiveTabProps> = ({ onViewInCalendar }) => {
  const { data: allBookings, isLoading, error } = useAllBookings()
  const [filter, setFilter] = useState<ArchiveFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('booking_date')
  const restoreBooking = useRestoreBooking()
  const requeueRejectedBooking = useRequeueRejectedBooking()

  const handleRestore = async (bookingId: string) => {
    if (!confirm('Sei sicuro di voler reinserire questa prenotazione?')) return

    try {
      await restoreBooking.mutateAsync(bookingId)
    } catch (error) {
      console.error('Error restoring booking:', error)
    }
  }

  const handleRequeueToPending = async (bookingId: string) => {
    if (!confirm('Riportare questa prenotazione tra le richieste in attesa?')) return

    try {
      await requeueRejectedBooking.mutateAsync(bookingId)
    } catch (error) {
      console.error('Error requeueing rejected booking:', error)
    }
  }

  const filteredBookings = React.useMemo(() => {
    if (!allBookings) return []

    let filtered = []
    switch (filter) {
      case 'accepted':
        filtered = allBookings.filter((b) => b.status === 'accepted')
        break
      case 'rejected':
        filtered = allBookings.filter((b) => b.status === 'rejected')
        break
      case 'deleted':
        filtered = allBookings.filter((b) => b.status === 'deleted')
        break
      default:
        filtered = allBookings
    }

    // Ordina in base al tipo di ordinamento selezionato
    return filtered.sort((a, b) => {
      if (sortOrder === 'created_at') {
        // Ordina per data/ora di creazione (più recente in alto)
        const dateA = a.created_at ? new Date(a.created_at) : null
        const dateB = b.created_at ? new Date(b.created_at) : null
        
        if (!dateA && !dateB) return 0
        if (!dateA) return 1  // Metti quelle senza data in fondo
        if (!dateB) return -1
        
        // Confronta i timestamp completi (decrescente: più recente prima)
        return dateB.getTime() - dateA.getTime()
      } else {
        // Ordina per data della prenotazione (più recente in alto)
        const dateA = a.confirmed_start || a.desired_date
        const dateB = b.confirmed_start || b.desired_date
        
        if (!dateA && !dateB) return 0
        if (!dateA) return 1  // Metti quelle senza data in fondo
        if (!dateB) return -1
        
        // Confronta le date (decrescente: più recente prima)
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      }
    })
  }, [allBookings, filter, sortOrder])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento archivio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">Errore nel caricamento dell'archivio</p>
        <p className="text-red-600 text-sm mt-2">{String(error)}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters — bordi chiari (no ombre nere), coerenti col digest teal */}
      <div
        className={`rounded-2xl p-6 space-y-6 shadow-none ${DIGEST_MENU_HEADING_GRADIENT_BG}`}
      >
        {/* Filtro per Status */}
        <div className="border-0 shadow-none outline-none">
          <label
            className="mb-4 flex min-h-[4.5rem] w-full items-center justify-center rounded-xl border-2 border-solid px-4 text-center text-base font-bold uppercase tracking-wide text-warm-wood shadow-none outline-none"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            Filtra per Status
          </label>

          <div className="flex gap-4 border-0 shadow-none outline-none">
            {(['all', 'accepted', 'rejected', 'deleted'] as ArchiveFilter[]).map((f) => (
              <button
                type="button"
                key={f}
                data-filter={f}
                onClick={() => setFilter(f)}
                className={`
                  archive-tab-filter-btn flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold uppercase tracking-wide rounded-xl transition-[border-color,box-shadow] duration-150
                  ${DIGEST_MENU_HEADING_GRADIENT_BG} text-slate-800
                  ${filter === f ? 'archive-tab-filter-btn--selected' : 'archive-tab-filter-btn--idle'}
                `}
              >
                {f === 'all' && <Archive className="w-5 h-5" />}
                {f === 'accepted' && <CheckCircle className="w-5 h-5" />}
                {f === 'rejected' && <XCircle className="w-5 h-5" />}
                {f === 'deleted' && <Trash2 className="w-5 h-5" />}
                {f === 'all' ? 'Tutte' : f === 'accepted' ? 'Accettate' : f === 'rejected' ? 'Rifiutate' : 'Rimosse'}
              </button>
            ))}
          </div>
        </div>

        {/* Selettore Ordinamento */}
        <div className="border-0 shadow-none outline-none">
          <label
            className="mb-4 flex min-h-[4.5rem] w-full items-center justify-center rounded-xl border-2 border-solid px-4 text-center text-base font-bold uppercase tracking-wide text-warm-wood shadow-none outline-none"
            style={ADMIN_WARM_GRADIENT_SURFACE}
          >
            Ordina per
          </label>

          <div className="flex gap-4 border-0 shadow-none outline-none">
            {([
              { value: 'booking_date' as SortOrder, label: 'Data Prenotazione', icon: Calendar },
              { value: 'created_at' as SortOrder, label: 'Data Creazione', icon: Clock }
            ]).map((option) => {
              const Icon = option.icon
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setSortOrder(option.value)}
                  className={`
                    archive-tab-filter-btn flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold uppercase tracking-wide rounded-xl transition-[border-color,box-shadow] duration-150
                    ${DIGEST_MENU_HEADING_GRADIENT_BG} text-slate-800
                    ${sortOrder === option.value ? 'archive-tab-filter-btn--selected' : 'archive-tab-filter-btn--idle'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="mb-4">
          <p className="text-sm font-bold text-indigo-900 bg-indigo-50 rounded-lg px-4 py-2 inline-block">
            📊 Mostrando {filteredBookings.length} prenotazioni
          </p>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-12 text-center border-2 border-purple-100">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2">
              Nessuna prenotazione {filter !== 'all' && `con status "${filter}"`}
            </h3>
            <p className="text-gray-600 font-medium">
              {filter === 'all'
                ? 'Nessuna prenotazione presente nell\'archivio.'
                : 'Prova a cambiare il filtro.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-[30px]">
            {filteredBookings.map((booking) => {
              return (
                <ArchiveBookingCard
                  key={booking.id}
                  booking={booking}
                  onViewInCalendar={onViewInCalendar}
                  onRestore={handleRestore}
                  onRequeueToPending={handleRequeueToPending}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

