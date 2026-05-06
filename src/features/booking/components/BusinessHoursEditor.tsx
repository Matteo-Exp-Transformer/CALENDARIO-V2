import React, { useState } from 'react'
import { cn } from '@/lib/utils'
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
  /** Slot mostrati (non editabili) quando il giorno è chiuso: non persistono nel valore salvato (`null`). */
  const [closedDaySnapshots, setClosedDaySnapshots] = useState<
    Partial<Record<keyof BusinessHours, BusinessHourSlot[]>>
  >({})

  const setDay = (day: keyof BusinessHours, slots: BusinessHourSlot[] | null) => {
    onChange({ ...value, [day]: slots })
  }

  const toggleClosed = (day: keyof BusinessHours, closed: boolean) => {
    if (closed) {
      const current = value[day]
      const snapshot =
        current && current.length > 0 ? current.map((s) => ({ ...s })) : [defaultSlot()]
      setClosedDaySnapshots((prev) => ({ ...prev, [day]: snapshot }))
      setDay(day, null)
    } else {
      const snap = closedDaySnapshots[day]
      setDay(day, snap && snap.length > 0 ? snap.map((s) => ({ ...s })) : [defaultSlot()])
      setClosedDaySnapshots((prev) => {
        const next = { ...prev }
        delete next[day]
        return next
      })
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
    <div className="flex w-full flex-col items-center gap-5">
      {DAY_ORDER.map((day) => {
        const slots = value[day]
        const closed = isDayClosed(slots)
        const rowSlots: BusinessHourSlot[] = closed
          ? closedDaySnapshots[day] ?? [defaultSlot()]
          : slots ?? [defaultSlot()]

        return (
          <div
            key={day}
            className="w-full space-y-3 rounded-xl border border-slate-300/60 bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
          >
            <div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-between gap-x-12 gap-y-3 px-5 sm:px-10 md:px-14 lg:px-20 xl:px-24">
              <strong className="shrink-0 text-sm font-extrabold !font-extrabold text-slate-900 tracking-tight">
                {DAY_LABEL[day]}
              </strong>
              <label className="flex shrink-0 cursor-pointer select-none items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={closed}
                  disabled={disabled}
                  onChange={(e) => toggleClosed(day, e.target.checked)}
                  className="rounded-md border-slate-300"
                />
                Chiuso
              </label>
            </div>

            <div
              className={cn(
                'flex flex-col items-center gap-3 transition-opacity duration-150',
                closed && 'pointer-events-none select-none opacity-[0.34] saturate-0'
              )}
            >
              {rowSlots.map((slot, index) => (
                <div
                  key={`${day}-${index}`}
                  className="flex flex-wrap items-end justify-center gap-3"
                >
                  <div className="space-y-1 text-center">
                    <span className="block text-xs font-medium text-slate-500">Apertura</span>
                    <TimeInput
                      value={slot.open}
                      onChange={(v) => updateSlot(day, index, { open: v })}
                      disabled={disabled || closed}
                      id={`${day}-open-${index}`}
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="block text-xs font-medium text-slate-500">Chiusura</span>
                    <TimeInput
                      value={slot.close}
                      onChange={(v) => updateSlot(day, index, { close: v })}
                      disabled={disabled || closed}
                      id={`${day}-close-${index}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled || closed || rowSlots.length <= 1}
                    onClick={() => removeSlot(day, index)}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Rimuovi fascia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex w-full min-w-0 justify-end self-stretch">
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  disabled={disabled || closed}
                  onClick={() => addSlot(day)}
                  className="gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi fascia
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
