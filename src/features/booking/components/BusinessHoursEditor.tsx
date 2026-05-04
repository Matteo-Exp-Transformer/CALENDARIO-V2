import React from 'react'
import type { BusinessHours, BusinessHourSlot } from '@/lib/businessHours'
import { Button } from '@/components/ui/Button'
import { TimeInput } from '@/components/ui/TimeInput'
import { Plus, Trash2 } from 'lucide-react'

const DAY_ORDER: (keyof BusinessHours)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

const DAY_LABEL: Record<keyof BusinessHours, string> = {
  monday: 'Lunedì',
  tuesday: 'Martedì',
  wednesday: 'Mercoledì',
  thursday: 'Giovedì',
  friday: 'Venerdì',
  saturday: 'Sabato',
  sunday: 'Domenica',
}

const defaultSlot = (): BusinessHourSlot => ({ open: '11:00', close: '00:00' })

function isDayClosed(slots: BusinessHourSlot[] | null): boolean {
  return slots == null || slots.length === 0
}

export interface BusinessHoursEditorProps {
  value: BusinessHours
  onChange: (next: BusinessHours) => void
  disabled?: boolean
}

export const BusinessHoursEditor: React.FC<BusinessHoursEditorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const setDay = (day: keyof BusinessHours, slots: BusinessHourSlot[] | null) => {
    onChange({ ...value, [day]: slots })
  }

  const toggleClosed = (day: keyof BusinessHours, closed: boolean) => {
    if (closed) {
      setDay(day, null)
    } else {
      setDay(day, [defaultSlot()])
    }
  }

  const updateSlot = (
    day: keyof BusinessHours,
    index: number,
    patch: Partial<BusinessHourSlot>
  ) => {
    const slots = value[day]
    if (!slots || !slots[index]) return
    const next = slots.map((s, i) => (i === index ? { ...s, ...patch } : s))
    setDay(day, next)
  }

  const addSlot = (day: keyof BusinessHours) => {
    const slots = value[day] && value[day]!.length > 0 ? [...value[day]!] : [defaultSlot()]
    slots.push(defaultSlot())
    setDay(day, slots)
  }

  const removeSlot = (day: keyof BusinessHours, index: number) => {
    const slots = value[day]
    if (!slots) return
    const next = slots.filter((_, i) => i !== index)
    setDay(day, next.length ? next : null)
  }

  return (
    <div className="space-y-5">
      {DAY_ORDER.map((day) => {
        const slots = value[day]
        const closed = isDayClosed(slots)

        return (
          <div
            key={day}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">{DAY_LABEL[day]}</span>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={closed}
                  disabled={disabled}
                  onChange={(e) => toggleClosed(day, e.target.checked)}
                  className="rounded border-slate-300"
                />
                Chiuso
              </label>
            </div>

            {!closed && slots && (
              <div className="space-y-3">
                {slots.map((slot, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-slate-500">Apertura</span>
                      <TimeInput
                        value={slot.open}
                        onChange={(v) => updateSlot(day, index, { open: v })}
                        disabled={disabled}
                        id={`${day}-open-${index}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-slate-500">Chiusura</span>
                      <TimeInput
                        value={slot.close}
                        onChange={(v) => updateSlot(day, index, { close: v })}
                        disabled={disabled}
                        id={`${day}-close-${index}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={disabled || slots.length <= 1}
                      onClick={() => removeSlot(day, index)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Rimuovi fascia"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => addSlot(day)}
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi fascia
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
