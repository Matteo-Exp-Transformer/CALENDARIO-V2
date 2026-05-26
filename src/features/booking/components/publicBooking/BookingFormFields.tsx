import React from 'react'
import { Input } from '@/components/ui'
import { DateInput } from '@/components/ui/DateInput'
import { TimePicker24h } from '@/components/ui'
import type { BookingRequestInput } from '@/types/booking'
import type { BusinessHours } from '@/lib/businessHours'
import { isValidBookingDateTime, getDayOfWeek, formatHours } from '@/lib/businessHours'
import {
  BOOKING_PUBLIC_CONTENT_WIDTH,
  BOOKING_PUBLIC_LABEL_CLASS,
} from '@/features/booking/constants/bookingPublicFieldStyles'

const ROW3_LABEL_CLASS =
  'block text-center text-xs font-bold text-warm-wood sm:text-sm md:text-[0.8125rem] leading-tight mb-1'

interface BookingFormFieldsProps {
  formData: Pick<
    BookingRequestInput,
    | 'client_name'
    | 'client_email'
    | 'client_phone'
    | 'desired_date'
    | 'desired_time'
    | 'num_guests'
  >
  errors: Record<string, string>
  businessHours?: BusinessHours | null
  isLoadingHours?: boolean
  hoursError?: unknown
  frostedInputCn: string
  onFieldChange: (field: string, value: string | number) => void
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onNumGuestsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNumGuestsKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  resetAvailability: () => void
  setErrors: (errors: Record<string, string>) => void
}

function FieldWrap({ children }: { children: React.ReactNode }) {
  return <div className={BOOKING_PUBLIC_CONTENT_WIDTH}>{children}</div>
}

export const BookingFormFields: React.FC<BookingFormFieldsProps> = ({
  formData,
  errors,
  businessHours,
  isLoadingHours,
  hoursError,
  frostedInputCn,
  onFieldChange,
  onDateChange,
  onTimeChange,
  onNumGuestsChange,
  onNumGuestsKeyPress,
  resetAvailability,
  setErrors,
}) => {
  const validateBusinessHours = (date: string, time: string): string | null => {
    if (!date || !time || !businessHours || isLoadingHours || hoursError) return null
    if (!isValidBookingDateTime(date, time, businessHours)) {
      const dayName = getDayOfWeek(date)
      const dayHours = businessHours[dayName]
      if (!dayHours || dayHours.length === 0) return 'Il ristorante è chiuso in questo giorno'
      return `Orario non valido. Orari disponibili: ${formatHours(dayHours)}`
    }
    return null
  }

  const inputCn = (hasError: boolean) =>
    `${frostedInputCn} w-full ${hasError ? 'border-red-500!' : ''}`

  return (
    <div className="w-full space-y-5">
      <div className="space-y-1">
        <label htmlFor="client_name" className={BOOKING_PUBLIC_LABEL_CLASS}>
          Nome Completo *
        </label>
        <FieldWrap>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => {
              onFieldChange('client_name', e.target.value)
              setErrors({ ...errors, client_name: '' })
            }}
            required
            className={inputCn(!!errors.client_name)}
          />
        </FieldWrap>
        {errors.client_name && (
          <p className="text-center text-sm text-red-500">{errors.client_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="client_email" className={BOOKING_PUBLIC_LABEL_CLASS}>
            Email (Opzionale)
          </label>
          <FieldWrap>
            <Input
              id="client_email"
              type="email"
              value={formData.client_email}
              onChange={(e) => {
                onFieldChange('client_email', e.target.value)
                setErrors({ ...errors, client_email: '' })
              }}
              className={inputCn(!!errors.client_email)}
            />
          </FieldWrap>
          {errors.client_email && (
            <p className="text-center text-sm text-red-500">{errors.client_email}</p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="client_phone" className={BOOKING_PUBLIC_LABEL_CLASS}>
            Telefono *
          </label>
          <FieldWrap>
            <Input
              id="client_phone"
              type="tel"
              value={formData.client_phone ?? ''}
              onChange={(e) => {
                onFieldChange('client_phone', e.target.value)
                setErrors({ ...errors, client_phone: '' })
              }}
              required
              className={inputCn(!!errors.client_phone)}
            />
          </FieldWrap>
          {errors.client_phone && (
            <p className="text-center text-sm text-red-500">{errors.client_phone}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start md:gap-3">
        <div className="min-w-0 space-y-1">
          <label htmlFor="desired_date" className={ROW3_LABEL_CLASS}>
            Data prenotazione *
          </label>
          <FieldWrap>
            <DateInput
              id="desired_date"
              compact
              bookingForm
              className="w-full min-w-0"
              value={formData.desired_date}
              onChange={(newDate) => {
                onDateChange(newDate)
                resetAvailability()
                const timeError = newDate && formData.desired_time
                  ? validateBusinessHours(newDate, formData.desired_time)
                  : null
                if (timeError) {
                  const dayName = businessHours ? getDayOfWeek(newDate) : null
                  const dayHours = businessHours && dayName ? businessHours[dayName] : null
                  if (dayHours === null || (Array.isArray(dayHours) && dayHours.length === 0)) {
                    setErrors({ ...errors, desired_date: timeError, desired_time: '' })
                  } else {
                    setErrors({ ...errors, desired_date: '', desired_time: timeError })
                  }
                } else {
                  setErrors({ ...errors, desired_date: '', desired_time: '' })
                }
              }}
              required
              hasError={!!errors.desired_date}
            />
          </FieldWrap>
          {errors.desired_date && (
            <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 border border-red-200">
              {errors.desired_date}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <label htmlFor="desired_time" className={ROW3_LABEL_CLASS}>
            Ora prenotazione *
          </label>
          <FieldWrap>
            <TimePicker24h
              id="desired_time"
              compact
              bookingForm
              className="w-full min-w-0"
              value={formData.desired_time || '16:00'}
              onChange={(newTime) => {
                onTimeChange(newTime)
                resetAvailability()
                const timeError = formData.desired_date && newTime
                  ? validateBusinessHours(formData.desired_date, newTime)
                  : null
                if (timeError) {
                  const dayName = businessHours && formData.desired_date ? getDayOfWeek(formData.desired_date) : null
                  const dayHours = businessHours && dayName ? businessHours[dayName] : null
                  if (dayHours === null || (Array.isArray(dayHours) && dayHours.length === 0)) {
                    setErrors({ ...errors, desired_date: timeError, desired_time: '' })
                  } else {
                    setErrors({ ...errors, desired_date: '', desired_time: timeError })
                  }
                } else {
                  setErrors({ ...errors, desired_date: '', desired_time: '' })
                }
              }}
              required
              hasError={!!errors.desired_time}
            />
          </FieldWrap>
          {errors.desired_time && (
            <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 border border-red-200">
              {errors.desired_time}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <label htmlFor="num_guests" className={ROW3_LABEL_CLASS}>
            Numero Ospiti * (es: 15)
          </label>
          <FieldWrap>
            <Input
              id="num_guests"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={formData.num_guests > 0 ? formData.num_guests.toString() : ''}
              onChange={onNumGuestsChange}
              onKeyPress={onNumGuestsKeyPress}
              required
              className={inputCn(!!errors.num_guests)}
            />
          </FieldWrap>
          {errors.num_guests && (
            <p className="text-center text-sm text-red-500">{errors.num_guests}</p>
          )}
        </div>
      </div>
    </div>
  )
}
