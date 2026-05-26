import React from 'react'
import type { BookingRequestInput } from '@/types/booking'
import type { BusinessHours } from '@/lib/businessHours'
import { isValidBookingDateTime, getDayOfWeek, formatHours } from '@/lib/businessHours'
import { BookingPublicInsetField } from './BookingPublicInsetField'
import {
  BookingPublicDatePickerField,
  BookingPublicTimePickerField,
} from './BookingPublicDateTimePickers'

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
  frostedInputCn?: string
  onFieldChange: (field: string, value: string | number) => void
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onNumGuestsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNumGuestsKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  resetAvailability: () => void
  setErrors: (errors: Record<string, string>) => void
}

export const BookingFormFields: React.FC<BookingFormFieldsProps> = ({
  formData,
  errors,
  businessHours,
  isLoadingHours,
  hoursError,
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

  const handleDateChange = (newDate: string) => {
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
  }

  const handleTimeChange = (newTime: string) => {
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
  }

  return (
    <div className="w-full space-y-5">
      <div className="space-y-1">
        <BookingPublicInsetField
          id="client_name"
          label="Nome Completo *"
          value={formData.client_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange('client_name', e.target.value)
            setErrors({ ...errors, client_name: '' })
          }}
          required
          hasError={!!errors.client_name}
        />
        {errors.client_name && (
          <p className="text-center text-sm text-red-500">{errors.client_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <BookingPublicInsetField
            id="client_email"
            label="Email"
            type="email"
            value={formData.client_email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onFieldChange('client_email', e.target.value)
              setErrors({ ...errors, client_email: '' })
            }}
            hasError={!!errors.client_email}
          />
          {errors.client_email && (
            <p className="text-center text-sm text-red-500">{errors.client_email}</p>
          )}
        </div>
        <div className="space-y-1">
          <BookingPublicInsetField
            id="client_phone"
            label="Telefono *"
            type="tel"
            value={formData.client_phone ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onFieldChange('client_phone', e.target.value)
              setErrors({ ...errors, client_phone: '' })
            }}
            required
            hasError={!!errors.client_phone}
          />
          {errors.client_phone && (
            <p className="text-center text-sm text-red-500">{errors.client_phone}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start md:gap-3">
        <div className="min-w-0 space-y-1">
          <BookingPublicDatePickerField
            id="desired_date"
            label="Data prenotazione *"
            value={formData.desired_date}
            onChange={handleDateChange}
            required
            hasError={!!errors.desired_date}
          />
          {errors.desired_date && (
            <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 border border-red-200">
              {errors.desired_date}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <BookingPublicTimePickerField
            id="desired_time"
            label="Ora prenotazione *"
            value={formData.desired_time || '16:00'}
            onChange={handleTimeChange}
            required
            hasError={!!errors.desired_time}
          />
          {errors.desired_time && (
            <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 border border-red-200">
              {errors.desired_time}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <BookingPublicInsetField
            id="num_guests"
            label="Numero Ospiti *"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={formData.num_guests > 0 ? formData.num_guests.toString() : ''}
            onChange={onNumGuestsChange}
            onKeyPress={onNumGuestsKeyPress}
            required
            hasError={!!errors.num_guests}
          />
          {errors.num_guests && (
            <p className="text-center text-sm text-red-500">{errors.num_guests}</p>
          )}
        </div>
      </div>
    </div>
  )
}
