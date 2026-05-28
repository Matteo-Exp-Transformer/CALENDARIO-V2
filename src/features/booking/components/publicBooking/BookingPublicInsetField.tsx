import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui'

type InsetInputProps = React.ComponentProps<typeof Input>

import {
  BOOKING_PUBLIC_CONTENT_WIDTH,
  BOOKING_PUBLIC_FIELD_BOX,
  BOOKING_PUBLIC_FIELD_BOX_MULTILINE,
  BOOKING_PUBLIC_FIELD_INNER_INPUT,
  BOOKING_PUBLIC_FIELD_INNER_LABEL,
  BOOKING_PUBLIC_FIELD_INNER_LABEL_MULTILINE,
  BOOKING_PUBLIC_FIELD_INNER_TEXTAREA,
} from '@/features/booking/constants/bookingPublicFieldStyles'

const MULTILINE_MIN_HEIGHT_PX = 24

function syncTextareaHeight(el: HTMLTextAreaElement | null) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.max(el.scrollHeight, MULTILINE_MIN_HEIGHT_PX)}px`
}

export type BookingPublicInsetFieldProps = InsetInputProps & {
  label: string
  hasError?: boolean
  /** Testo libero a capo: la casella cresce in altezza (mobile / tablet / desktop). */
  multiline?: boolean
}

export const BookingPublicInsetField: React.FC<BookingPublicInsetFieldProps> = ({
  label,
  hasError = false,
  className,
  id,
  multiline = false,
  value,
  onChange,
  ...inputProps
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const stringValue = typeof value === 'string' || typeof value === 'number' ? String(value) : ''

  const adjustTextareaHeight = useCallback(() => {
    syncTextareaHeight(textareaRef.current)
  }, [])

  useLayoutEffect(() => {
    if (!multiline) return
    adjustTextareaHeight()
  }, [multiline, stringValue, adjustTextareaHeight])

  if (multiline) {
    const {
      type: _type,
      ...textareaProps
    } = inputProps as InsetInputProps

    return (
      <div className={BOOKING_PUBLIC_CONTENT_WIDTH}>
        <div className={cn(BOOKING_PUBLIC_FIELD_BOX_MULTILINE, hasError && 'border-red-500!')}>
          <label htmlFor={id} className={BOOKING_PUBLIC_FIELD_INNER_LABEL_MULTILINE}>
            {label}
          </label>
          <textarea
            ref={textareaRef}
            id={id}
            rows={1}
            value={value}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError && id ? `${id}-error` : undefined}
            className={cn(BOOKING_PUBLIC_FIELD_INNER_TEXTAREA, className)}
            onChange={(e) => {
              onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
              requestAnimationFrame(() => syncTextareaHeight(textareaRef.current))
            }}
            {...(textareaProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={BOOKING_PUBLIC_CONTENT_WIDTH}>
      <div className={cn(BOOKING_PUBLIC_FIELD_BOX, hasError && 'border-red-500!')}>
        <label htmlFor={id} className={BOOKING_PUBLIC_FIELD_INNER_LABEL}>
          {label}
        </label>
        <Input
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError && id ? `${id}-error` : undefined}
          className={cn(BOOKING_PUBLIC_FIELD_INNER_INPUT, className)}
          value={value}
          onChange={onChange}
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
        <div className="w-full min-w-0 flex-1 text-right">{children}</div>
      </div>
    </div>
  )
}
