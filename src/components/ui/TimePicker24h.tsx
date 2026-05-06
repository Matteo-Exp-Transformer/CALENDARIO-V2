import React from 'react'
import { cn } from '@/lib/utils'

const pad = (n: number) => n.toString().padStart(2, '0')

export interface TimePicker24hProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  id?: string
  /** Valore "HH:mm" in 24 ore (valore inviato al form) */
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  hasError?: boolean
  hourAriaLabel?: string
  minuteAriaLabel?: string
}

function splitParts(raw: string): { hour: number | null; minute: number | null } {
  const s = raw?.trim()
  if (!s) return { hour: null, minute: null }
  const parts = s.split(':').map((p) => p.trim())
  if (parts.length < 2) return { hour: null, minute: null }
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (Number.isNaN(h) || Number.isNaN(m)) return { hour: null, minute: null }
  return {
    hour: Math.min(23, Math.max(0, h)),
    minute: Math.min(59, Math.max(0, m)),
  }
}

export const TimePicker24h = React.forwardRef<HTMLDivElement, TimePicker24hProps>(
  (
    {
      id,
      value,
      onChange,
      required = false,
      disabled = false,
      hasError = false,
      hourAriaLabel = 'Ora (formato 24 ore)',
      minuteAriaLabel = 'Minuti',
      className,
      style,
      ...divProps
    },
    ref
  ) => {
    const { hour, minute } = splitParts(value)
    const hourVal = hour === null ? '' : pad(hour)
    const minuteVal = hour === null ? '' : pad(minute ?? 0)

    const emit = (h: number | null, m: number | null) => {
      if (h === null) {
        onChange('')
        return
      }
      const mm = m === null ? 0 : m
      onChange(`${pad(h)}:${pad(mm)}`)
    }

    const selectBase =
      'min-w-0 flex-1 cursor-pointer rounded-md border-0 bg-white py-2 text-sm font-medium text-slate-900 outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-75'

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: '#ffffff',
          colorScheme: 'light',
          ...(style as React.CSSProperties | undefined),
        }}
        className={cn(
          '[color-scheme:light] isolate flex min-h-[3.5rem] w-full items-center gap-2 rounded-[1.25rem] border-2 border-slate-200 !bg-white px-4 py-3 text-sm text-slate-900 shadow-sm',
          '[&_select]:!bg-white [&_select]:text-slate-900',
          'focus-within:border-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500',
          hasError && '!border-red-500 focus-within:!ring-red-500',
          disabled && '!cursor-not-allowed',
          className
        )}
        {...divProps}
      >
        <select
          id={id}
          aria-label={hourAriaLabel}
          className={selectBase}
          value={hourVal}
          disabled={disabled}
          required={required}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') {
              emit(null, null)
              return
            }
            const h = parseInt(v, 10)
            emit(h, hour === null ? 0 : minute ?? 0)
          }}
        >
          <option value="">{required ? '—' : ''}</option>
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={pad(i)}>
              {pad(i)}
            </option>
          ))}
        </select>
        <span className="select-none font-medium text-slate-400" aria-hidden="true">
          :
        </span>
        <select
          id={id ? `${id}-minute` : undefined}
          aria-label={minuteAriaLabel}
          className={selectBase}
          value={minuteVal}
          disabled={disabled || hour === null}
          required={required}
          onChange={(e) => {
            if (hour === null) return
            const v = e.target.value
            const m = v === '' ? 0 : parseInt(v, 10)
            emit(hour, m)
          }}
        >
          {hour === null ? (
            <option value="">—</option>
          ) : (
            Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={pad(i)}>
                {pad(i)}
              </option>
            ))
          )}
        </select>
      </div>
    )
  }
)

TimePicker24h.displayName = 'TimePicker24h'
