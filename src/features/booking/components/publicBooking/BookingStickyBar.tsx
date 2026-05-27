import React, { useState } from 'react'
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Euro,
  Send,
  User,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BookingType } from '@/types/booking'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import { getModeLabelByType } from '../../utils/bookingModeLabels'
import { cn } from '@/lib/utils'
import { BookingCrossShineSubmitButton } from './BookingCrossShineSubmitButton'

interface BookingStickyBarProps {
  formData: {
    client_name?: string
    desired_date?: string
    desired_time?: string
    num_guests: number
    booking_type?: BookingType
  }
  modes: BookingMode[]
  totalBooking?: number
  isSubmitDisabled: boolean
  /** Riepilogo completo da mostrare nell'overlay quando l'utente clicca la barra. */
  summaryContent: React.ReactNode
  /** Controlla se la barra deve essere visibile (il riepilogo è fuori dalla viewport). */
  visible: boolean
}

/** Data compatta per mini-riepilogo: gg/mm/aa */
function formatStickyDate(dateStr?: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map((part) => Number.parseInt(part, 10))
  if (!year || !month || !day) return ''
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  const yy = String(year % 100).padStart(2, '0')
  return `${dd}/${mm}/${yy}`
}

function formatCurrency(amount?: number): string {
  if (!amount) return ''
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}

function StickySummaryChip({
  icon: Icon,
  children,
  className,
}: {
  icon: LucideIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 min-w-0', className)}>
      <Icon className="h-3.5 w-3.5 shrink-0 text-warm-orange" aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  )
}

export const BookingStickyBar: React.FC<BookingStickyBarProps> = ({
  formData,
  modes,
  totalBooking,
  isSubmitDisabled,
  summaryContent,
  visible,
}) => {
  const [overlayOpen, setOverlayOpen] = useState(false)

  const clientName = formData.client_name?.trim() ?? ''
  const guestsSummary =
    formData.num_guests > 0
      ? formData.num_guests === 1
        ? '1 persona'
        : `${formData.num_guests} persone`
      : ''
  const orarioStr = formData.desired_time?.trim() ?? ''
  const dataStr = formatStickyDate(formData.desired_date)
  const tipoLabel = getModeLabelByType(modes, formData.booking_type, 'short')
  const totaleStr = totalBooking && totalBooking > 0 ? formatCurrency(totalBooking) : ''

  const showNameRow = Boolean(clientName)
  const showGuestDateTimeRow = Boolean(guestsSummary || dataStr || orarioStr)
  const showBookingRow = Boolean(tipoLabel || totaleStr)

  return (
    <>
      {/* Sticky bar — solo mobile, solo quando il riepilogo è fuori dalla viewport */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-200 min-[900px]:hidden',
          'border-t border-warm-wood/15 shadow-[0_-4px_24px_rgba(0,0,0,0.13)]',
          'px-4 pt-2.5 pb-3 flex flex-col gap-2',
          'transition-transform duration-300 ease-out',
          visible ? 'translate-y-0' : 'translate-y-full pointer-events-none',
        )}
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-warm-wood) 5%, white), color-mix(in srgb, var(--color-warm-orange) 4%, white))' }}
      >
        {/* Mini-panel riepilogo cliccabile */}
        <button
          type="button"
          onClick={() => setOverlayOpen(true)}
          className="flex flex-col gap-1.5 w-full text-left min-h-14 py-1"
          aria-label="Apri riepilogo prenotazione"
        >
          {/* Titolo + freccia */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-warm-wood/60">
              Riepilogo Prenotazione
            </span>
            <ChevronUp className="h-3.5 w-3.5 text-warm-wood-dark/40 shrink-0" />
          </div>
          {showNameRow && (
            <StickySummaryChip icon={User} className="text-sm font-bold text-warm-wood">
              {clientName}
            </StickySummaryChip>
          )}
          {showGuestDateTimeRow && (
            <div className="flex w-full items-center gap-2 min-w-0">
              <div className="flex min-w-0 flex-1 justify-start">
                {guestsSummary ? (
                  <StickySummaryChip icon={Users} className="text-sm text-warm-wood-dark/70">
                    {guestsSummary}
                  </StickySummaryChip>
                ) : null}
              </div>
              <div className="flex shrink-0 justify-center">
                {dataStr ? (
                  <StickySummaryChip icon={CalendarDays} className="text-sm text-warm-wood-dark/70">
                    {dataStr}
                  </StickySummaryChip>
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 justify-end">
                {orarioStr ? (
                  <StickySummaryChip icon={Clock} className="text-sm text-warm-wood-dark/70">
                    {orarioStr}
                  </StickySummaryChip>
                ) : null}
              </div>
            </div>
          )}
          {showBookingRow && (
            <div className="flex w-full items-center justify-between gap-2 min-w-0">
              {tipoLabel ? (
                <StickySummaryChip icon={UtensilsCrossed} className="min-w-0 text-sm font-bold text-warm-wood">
                  {tipoLabel}
                </StickySummaryChip>
              ) : (
                <span className="min-w-0 flex-1" aria-hidden />
              )}
              {totaleStr ? (
                <StickySummaryChip
                  icon={Euro}
                  className="shrink-0 text-sm font-bold text-warm-orange"
                >
                  {totaleStr}
                </StickySummaryChip>
              ) : null}
            </div>
          )}
        </button>

        <BookingCrossShineSubmitButton
          form="booking-request-form"
          disabled={isSubmitDisabled}
          className="w-full py-2.5 text-sm shadow-lg hover:shadow-[0_12px_28px_rgba(34,197,94,0.35)] hover:-translate-y-0.5 disabled:hover:shadow-lg"
        >
          Invia Prenotazione
        </BookingCrossShineSubmitButton>
      </div>

      {/* Overlay riepilogo — si apre al clic sulla barra */}
      {overlayOpen && (
        <div className="fixed inset-0 z-300 min-[900px]:hidden flex flex-col">
          {/* Sfondo semi-trasparente cliccabile per chiudere */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOverlayOpen(false)}
          />
          {/* Pannello dal basso — flex column per tenere il pulsante sempre visibile */}
          <div className="relative mt-auto flex flex-col max-h-[90vh] rounded-t-2xl overflow-hidden"
            style={{ background: 'white' }}
          >
            {/* Header tematico cliccabile per chiudere */}
            <button
              type="button"
              onClick={() => setOverlayOpen(false)}
              aria-label="Chiudi riepilogo"
              className="w-full flex flex-col items-center gap-1 px-4 pt-4 pb-3 border-b border-warm-wood/10 transition-colors hover:bg-warm-wood/5 active:bg-warm-wood/10 shrink-0"
              style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-warm-wood) 6%, white), color-mix(in srgb, var(--color-warm-orange) 4%, white))' }}
            >
              {/* Pill handle */}
              <div className="w-10 h-1 rounded-full bg-warm-wood/20 mb-1" />
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-warm-wood text-base leading-tight">
                  Riepilogo Prenotazione
                </h3>
                <ChevronDown className="h-4 w-4 text-warm-wood/50" />
              </div>
            </button>

            {/* Contenuto scrollabile */}
            <div className="overflow-y-auto flex-1 px-4 py-4">
              {summaryContent}
            </div>

            {/* Pulsante submit fisso in fondo — sempre visibile */}
            <div
              className="shrink-0 px-4 pt-3 pb-5 border-t border-warm-wood/10"
              style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-warm-wood) 4%, white), color-mix(in srgb, var(--color-warm-orange) 3%, white))' }}
            >
              <BookingCrossShineSubmitButton
                form="booking-request-form"
                disabled={isSubmitDisabled}
                onClick={() => setOverlayOpen(false)}
                className="w-full py-3 text-sm shadow-lg hover:shadow-[0_12px_28px_rgba(34,197,94,0.35)] hover:-translate-y-0.5 disabled:hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
                Invia Prenotazione
              </BookingCrossShineSubmitButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
