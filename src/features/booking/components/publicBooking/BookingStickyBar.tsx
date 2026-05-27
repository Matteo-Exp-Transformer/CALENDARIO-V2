import React, { useState } from 'react'
import { ChevronUp, ChevronDown, Send } from 'lucide-react'
import type { BookingType } from '@/types/booking'
import type { BookingMode } from '@/features/booking/constants/bookingPublicFormConfig'
import { cn } from '@/lib/utils'
import { BookingCrossShineSubmitButton } from './BookingCrossShineSubmitButton'

interface BookingStickyBarProps {
  formData: {
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

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatCurrency(amount?: number): string {
  if (!amount) return ''
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}

function getModeLabelByType(modes: BookingMode[], bookingType?: BookingType): string {
  const mode = modes.find((m) => m.booking_type === bookingType && m.enabled)
  if (mode) return mode.label
  const map: Record<string, string> = {
    tavolo: 'Tavolo',
    menu_prezzo_fisso: 'Menu Fisso',
    rinfresco_laurea: 'Rinfresco',
  }
  return map[bookingType ?? ''] ?? ''
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

  const tipoLabel = getModeLabelByType(modes, formData.booking_type)
  const dataStr = formatDate(formData.desired_date)
  const orarioStr = formData.desired_time || ''
  const ospiti = formData.num_guests > 0 ? `${formData.num_guests} pers.` : ''
  const totaleStr = totalBooking && totalBooking > 0 ? formatCurrency(totalBooking) : ''

  // Almeno un valore da mostrare
  const hasData = tipoLabel || dataStr || orarioStr || ospiti

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
          {/* Valori chiave */}
          {hasData && (
            <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 min-w-0">
              {tipoLabel && (
                <span className="text-sm font-bold text-warm-wood">{tipoLabel}</span>
              )}
              {dataStr && (
                <span className="text-sm text-warm-wood-dark/70">{dataStr}</span>
              )}
              {orarioStr && (
                <span className="text-sm text-warm-wood-dark/70">{orarioStr}</span>
              )}
              {ospiti && (
                <span className="text-sm text-warm-wood-dark/70">{ospiti}</span>
              )}
              {totaleStr && (
                <span className="text-sm font-bold text-warm-orange">{totaleStr}</span>
              )}
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
