import React from 'react'
import { Input } from '@/components/ui'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { BookingPublicInsetField } from './publicBooking/BookingPublicInsetField'

interface DietaryRestrictionsSectionProps {
  dietaryText: string
  onDietaryTextChange: (value: string) => void
  specialRequests: string
  onSpecialRequestsChange: (value: string) => void
  privacyAccepted?: boolean
  onPrivacyChange?: (value: boolean) => void
  privacyError?: string
  /** Nasconde il blocco "Altre Richieste" (es. renderizzato sotto la griglia in AdminBookingForm) */
  omitSpecialRequestsSection?: boolean
  /** Layout /prenota: campi al 75% larghezza, stessa altezza e font delle card sottotab */
  publicFormFields?: boolean
}

const FIELD_LABEL_CLASS =
  'block text-left text-sm font-bold text-warm-wood md:text-base mb-1'

const CONTROL_CLASS =
  'w-full min-h-[50px] h-[50px] rounded-lg border border-slate-200 bg-white px-4 text-sm sm:text-base font-medium text-warm-wood focus:border-warm-wood focus:outline-none focus:ring-2 focus:ring-warm-wood/40'

/** Form pubblico Prenota: intolleranze come testo libero + altre richieste + privacy. */
export const DietaryRestrictionsSection: React.FC<DietaryRestrictionsSectionProps> = ({
  dietaryText,
  onDietaryTextChange,
  specialRequests,
  onSpecialRequestsChange,
  privacyAccepted,
  onPrivacyChange,
  privacyError,
  omitSpecialRequestsSection = false,
  publicFormFields = false,
}) => {
  return (
    <div className={publicFormFields ? 'w-full space-y-5' : 'space-y-5'}>
      <div className="space-y-1">
        {publicFormFields ? (
          <BookingPublicInsetField
            id="dietary-notes"
            label="Intolleranze o esigenze alimentari"
            value={dietaryText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDietaryTextChange(e.target.value)}
          />
        ) : (
          <>
            <label htmlFor="dietary-notes" className={FIELD_LABEL_CLASS}>
              Intolleranze o esigenze alimentari
            </label>
            <Input
              id="dietary-notes"
              value={dietaryText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDietaryTextChange(e.target.value)}
              className={CONTROL_CLASS}
            />
          </>
        )}
      </div>

      {!omitSpecialRequestsSection && (
        <div className="space-y-1">
          {publicFormFields ? (
            <BookingPublicInsetField
              id="special_requests"
              label="Altre Richieste"
              value={specialRequests}
              onChange={(e) => onSpecialRequestsChange(e.target.value)}
            />
          ) : (
            <>
              <label htmlFor="special_requests" className={FIELD_LABEL_CLASS}>
                Altre Richieste
              </label>
              <Input
                id="special_requests"
                value={specialRequests}
                onChange={(e) => onSpecialRequestsChange(e.target.value)}
                className={CONTROL_CLASS}
              />
            </>
          )}
        </div>
      )}

      {privacyAccepted !== undefined && onPrivacyChange && (
        <div className="space-y-2 pt-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="group relative size-5 shrink-0">
                <input
                  type="checkbox"
                  id="privacy-consent-dietary"
                  checked={privacyAccepted}
                  onChange={(e) => onPrivacyChange(e.target.checked)}
                  required
                  className="peer absolute inset-0 z-10 size-5 cursor-pointer appearance-none opacity-0 focus:outline-none"
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded border-2 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md peer-checked:border-warm-orange peer-checked:bg-warm-orange peer-checked:shadow-lg peer-focus-visible:ring-4 peer-focus-visible:ring-warm-wood/20 ${
                    privacyError
                      ? 'border-red-500 group-hover:border-red-600'
                      : 'border-warm-wood/40 group-hover:border-warm-wood'
                  }`}
                >
                  <Check
                    className={`h-3.5 w-3.5 text-white transition-all duration-300 ${
                      privacyAccepted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                    strokeWidth={3}
                  />
                </div>
              </div>
              <label htmlFor="privacy-consent-dietary" className="cursor-pointer text-base text-warm-wood-dark">
                Accetto la{' '}
                <Link
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-warm-orange underline decoration-warm-orange hover:text-warm-orange"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
                {' '}*
              </label>
            </div>
            <p className="text-sm font-semibold text-warm-wood-dark/80 sm:text-base">
              * I campi contrassegnati sono obbligatori
            </p>
          </div>
          {privacyError && <p className="text-sm text-red-500 ml-8">{privacyError}</p>}
        </div>
      )}
    </div>
  )
}
