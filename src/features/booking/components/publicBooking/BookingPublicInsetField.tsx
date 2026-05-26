import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui'

type InsetInputProps = React.ComponentProps<typeof Input>
import {
  BOOKING_PUBLIC_CONTENT_WIDTH,
  BOOKING_PUBLIC_FIELD_BOX,
  BOOKING_PUBLIC_FIELD_INNER_INPUT,
  BOOKING_PUBLIC_FIELD_INNER_LABEL,
} from '@/features/booking/constants/bookingPublicFieldStyles'

export type BookingPublicInsetFieldProps = InsetInputProps & {
  label: string
  hasError?: boolean
}

export const BookingPublicInsetField: React.FC<BookingPublicInsetFieldProps> = ({
  label,
  hasError = false,
  className,
  id,
  ...inputProps
}) => {
  return (
    <div className={BOOKING_PUBLIC_CONTENT_WIDTH}>
      <div className={cn(BOOKING_PUBLIC_FIELD_BOX, hasError && 'border-red-500!')}>
        <label htmlFor={id} className={BOOKING_PUBLIC_FIELD_INNER_LABEL}>
          {label}
        </label>
        <Input
          id={id}
          className={cn(BOOKING_PUBLIC_FIELD_INNER_INPUT, className)}
          {...inputProps}
        />
      </div>
    </div>
  )
}

export function BookingPublicInsetFieldShell({
  label,
  htmlFor,
  hasError = false,
  children,
}: {
  label: string
  htmlFor?: string
  hasError?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={BOOKING_PUBLIC_CONTENT_WIDTH}>
      <div className={cn(BOOKING_PUBLIC_FIELD_BOX, hasError && 'border-red-500!')}>
        <label htmlFor={htmlFor} className={BOOKING_PUBLIC_FIELD_INNER_LABEL}>
          {label}
        </label>
        <div className="mt-0.5 w-full min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
