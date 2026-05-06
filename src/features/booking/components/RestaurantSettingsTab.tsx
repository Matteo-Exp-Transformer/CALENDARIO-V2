import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Store, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { TimePicker24h } from '@/components/ui/TimePicker24h'
import { useTenantContext } from '@/contexts/TenantContext'
import type { BusinessHours } from '@/lib/businessHours'
import { getDefaultBusinessHours } from '@/lib/businessHours'
import { stripDirectionalFormattingChars } from '@/lib/utils'
import { ADMIN_WARM_BORDER, ADMIN_WARM_GRADIENT_SURFACE } from '@/lib/adminWarmGradientSurface'
import { BusinessHoursEditor } from './BusinessHoursEditor'
import { toast } from 'react-toastify'
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'
import {
  DEFAULT_BOOKING_TIME_SLOTS,
  getBookingTimeSlotLabel,
  slotRangesOverlap,
  type BookingTimeSlots,
} from '@/features/booking/utils/bookingTimeSlots'

type SlotFieldKey =
  | 'morningStart'
  | 'morningEnd'
  | 'afternoonStart'
  | 'afternoonEnd'
  | 'eveningStart'
  | 'eveningEnd'

const RESTAURANT_NAME_MAX_LENGTH = 40

function validateBookingTimeSlotsDetailed(config: BookingTimeSlots): {
  message: string | null
  fields: SlotFieldKey[]
} {
  const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/
  const allFields: SlotFieldKey[] = [
    'morningStart',
    'morningEnd',
    'afternoonStart',
    'afternoonEnd',
    'eveningStart',
    'eveningEnd',
  ]

  for (const field of allFields) {
    if (!HH_MM.test(config[field])) {
      return { message: 'Ogni orario deve essere nel formato HH:mm', fields: [field] }
    }
  }

  if (config.morningStart === config.morningEnd) {
    return {
      message: 'La fascia Mattina non e valida: inizio e fine coincidono',
      fields: ['morningStart', 'morningEnd'],
    }
  }
  if (config.afternoonStart === config.afternoonEnd) {
    return {
      message: 'La fascia Pomeriggio non e valida: inizio e fine coincidono',
      fields: ['afternoonStart', 'afternoonEnd'],
    }
  }
  if (config.eveningStart === config.eveningEnd) {
    return {
      message: 'La fascia Sera non e valida: inizio e fine coincidono',
      fields: ['eveningStart', 'eveningEnd'],
    }
  }
  if (
    slotRangesOverlap(
      config.morningStart,
      config.morningEnd,
      config.afternoonStart,
      config.afternoonEnd
    )
  ) {
    return {
      message: 'Le fasce Mattina e Pomeriggio si sovrappongono',
      fields: ['morningEnd', 'afternoonStart'],
    }
  }
  if (
    slotRangesOverlap(
      config.afternoonStart,
      config.afternoonEnd,
      config.eveningStart,
      config.eveningEnd
    )
  ) {
    return {
      message: 'Le fasce Pomeriggio e Sera si sovrappongono',
      fields: ['afternoonEnd', 'eveningStart'],
    }
  }
  if (
    slotRangesOverlap(
      config.morningStart,
      config.morningEnd,
      config.eveningStart,
      config.eveningEnd
    )
  ) {
    return {
      message: 'Le fasce Mattina e Sera si sovrappongono',
      fields: ['morningStart', 'eveningEnd'],
    }
  }

  return { message: null, fields: [] }
}

export const RestaurantSettingsTab: React.FC = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  const nameQuery = useRestaurantSetting('restaurant_name')
  const dailyGuestLimitQuery = useRestaurantSetting('daily_guest_limit')
  const bookingTimeSlotsQuery = useRestaurantSetting('booking_time_slots')
  const hoursQuery = useRestaurantSetting('business_hours')
  const contactEmailQuery = useRestaurantSetting('contact_email')
  const contactPhoneQuery = useRestaurantSetting('contact_phone')
  const contactAddressQuery = useRestaurantSetting('contact_address')

  const upsert = useUpsertRestaurantSetting()

  const [dirty, setDirty] = useState(false)
  const [restaurantName, setRestaurantName] = useState('')
  const [dailyGuestLimit, setDailyGuestLimit] = useState<number | ''>(75)
  const [bookingTimeSlots, setBookingTimeSlots] = useState<BookingTimeSlots>(DEFAULT_BOOKING_TIME_SLOTS)
  const [slotValidationError, setSlotValidationError] = useState<string | null>(null)
  const [slotFieldsAttention, setSlotFieldsAttention] = useState<Record<SlotFieldKey, boolean>>({
    morningStart: false,
    morningEnd: false,
    afternoonStart: false,
    afternoonEnd: false,
    eveningStart: false,
    eveningEnd: false,
  })
  const [businessHours, setBusinessHours] = useState<BusinessHours>(() => getDefaultBusinessHours())
  const [contactEmail, setContactEmail] = useState('Alritrovobologna@gmail.com')
  const [contactPhone, setContactPhone] = useState('3505362538')
  const [contactAddress, setContactAddress] = useState('Via Centotrecento 1/1B - Bologna, 40126')

  const hydratedRef = useRef(false)
  const slotFieldRefs = useRef<Record<SlotFieldKey, HTMLDivElement | null>>({
    morningStart: null,
    morningEnd: null,
    afternoonStart: null,
    afternoonEnd: null,
    eveningStart: null,
    eveningEnd: null,
  })

  useEffect(() => {
    hydratedRef.current = false
    setDirty(false)
  }, [tenantId])

  const allSuccess =
    nameQuery.isSuccess &&
    dailyGuestLimitQuery.isSuccess &&
    bookingTimeSlotsQuery.isSuccess &&
    hoursQuery.isSuccess &&
    contactEmailQuery.isSuccess &&
    contactPhoneQuery.isSuccess &&
    contactAddressQuery.isSuccess

  useEffect(() => {
    if (!allSuccess || hydratedRef.current) return
    setRestaurantName(
      stripDirectionalFormattingChars(String(nameQuery.data ?? '')).slice(0, RESTAURANT_NAME_MAX_LENGTH)
    )
    setDailyGuestLimit(dailyGuestLimitQuery.data)
    setBookingTimeSlots(bookingTimeSlotsQuery.data)
    setBusinessHours(hoursQuery.data)
    setContactEmail(
      stripDirectionalFormattingChars(contactEmailQuery.data || 'Alritrovobologna@gmail.com')
    )
    setContactPhone(stripDirectionalFormattingChars(contactPhoneQuery.data || '3505362538'))
    setContactAddress(
      stripDirectionalFormattingChars(
        contactAddressQuery.data || 'Via Centotrecento 1/1B - Bologna, 40126'
      )
    )
    hydratedRef.current = true
  }, [
    allSuccess,
    nameQuery.data,
    dailyGuestLimitQuery.data,
    bookingTimeSlotsQuery.data,
    hoursQuery.data,
    contactEmailQuery.data,
    contactPhoneQuery.data,
    contactAddressQuery.data,
  ])

  const loading =
    nameQuery.isPending ||
    dailyGuestLimitQuery.isPending ||
    bookingTimeSlotsQuery.isPending ||
    hoursQuery.isPending ||
    contactEmailQuery.isPending ||
    contactPhoneQuery.isPending ||
    contactAddressQuery.isPending

  const loadError =
    nameQuery.error ||
    dailyGuestLimitQuery.error ||
    bookingTimeSlotsQuery.error ||
    hoursQuery.error ||
    contactEmailQuery.error ||
    contactPhoneQuery.error ||
    contactAddressQuery.error

  const markDirty = () => setDirty(true)
  const handleRestaurantNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    markDirty()
    setRestaurantName(
      stripDirectionalFormattingChars(event.target.value).slice(0, RESTAURANT_NAME_MAX_LENGTH)
    )
  }

  const handleSave = async () => {
    const slotsValidation = validateBookingTimeSlotsDetailed(bookingTimeSlots)
    if (slotsValidation.message) {
      setSlotValidationError(slotsValidation.message)
      setSlotFieldsAttention((prev) => {
        const next = { ...prev }
        for (const k of Object.keys(next) as SlotFieldKey[]) next[k] = false
        for (const f of slotsValidation.fields) next[f] = true
        return next
      })
      const firstField = slotsValidation.fields[0]
      if (firstField) {
        slotFieldRefs.current[firstField]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
      toast.error(slotsValidation.message)
      return
    }

    try {
      const safeName = stripDirectionalFormattingChars(restaurantName).slice(0, RESTAURANT_NAME_MAX_LENGTH)
      const safeEmail = stripDirectionalFormattingChars(contactEmail)
      const safePhone = stripDirectionalFormattingChars(contactPhone)
      const safeAddress = stripDirectionalFormattingChars(contactAddress)

      setRestaurantName(safeName)
      setContactEmail(safeEmail)
      setContactPhone(safePhone)
      setContactAddress(safeAddress)

      await upsert.mutateAsync([
        { key: 'restaurant_name', value: safeName },
        { key: 'daily_guest_limit', value: dailyGuestLimit },
        { key: 'booking_time_slots', value: bookingTimeSlots },
        { key: 'business_hours', value: businessHours },
        { key: 'contact_email', value: safeEmail },
        { key: 'contact_phone', value: safePhone },
        { key: 'contact_address', value: safeAddress },
      ])
      // Keep local form state as source of truth after save.
      // Resetting hydration before refetch can reapply stale cached values.
      await queryClient.refetchQueries({
        queryKey: ['restaurant_settings'],
        type: 'active',
      })
      setSlotValidationError(null)
      setSlotFieldsAttention({
        morningStart: false,
        morningEnd: false,
        afternoonStart: false,
        afternoonEnd: false,
        eveningStart: false,
        eveningEnd: false,
      })
      setDirty(false)
    } catch {
      /* toast gestito da useUpsertRestaurantSetting.onError */
    }
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {(loadError as Error).message || 'Errore nel caricamento delle impostazioni.'}
      </div>
    )
  }

  if (loading && !allSuccess) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-slate-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        Caricamento impostazioni…
      </div>
    )
  }

  const clearSlotAttention = (field: SlotFieldKey) => {
    setSlotFieldsAttention((prev) => ({ ...prev, [field]: false }))
  }

  const slotFieldClass = (field: SlotFieldKey) =>
    slotFieldsAttention[field] ? 'rounded-[1.25rem]' : ''
  const slotFieldStyle = (field: SlotFieldKey): React.CSSProperties | undefined =>
    slotFieldsAttention[field]
      ? {
          boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55)',
          animation: 'slotErrorBlink 0.85s ease-in-out infinite',
        }
      : undefined

  const sectionSurfaceClass =
    'w-full max-w-2xl mx-auto space-y-4 rounded-xl border p-5 md:p-7 shadow-md text-center'
  const sectionSurfaceStyle: React.CSSProperties = ADMIN_WARM_GRADIENT_SURFACE
  /** Circa 1/3 della larghezza massima della card sezione (~max-w-2xl / 3) */
  const anagraficaFieldWrapClass = 'mx-auto w-full min-w-0 max-w-[14rem] space-y-2'
  /** Spazio verticale tra i blocchi (inline: non dipende dalle utilities Tailwind arbitrary). */
  const anagraficaFieldStackStyle: React.CSSProperties = { marginTop: '1.75rem' }
  const anagraficaInputClassName =
    'block w-full min-h-[3.667rem] rounded-[1.25rem] border-2 border-slate-200 bg-white px-4 py-2.5 text-center text-xl font-medium leading-snug text-slate-900 shadow-sm outline-none placeholder:text-slate-400 placeholder:text-xl transition-colors duration-150 focus:border-primary-400 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-500 disabled:opacity-80'

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <style>{`
        @keyframes slotErrorBlink {
          0% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55); }
          50% { box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.65), 0 0 4px rgba(239, 68, 68, 0.25); }
          100% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55); }
        }
      `}</style>
      <div
        className={`${sectionSurfaceClass} flex flex-col items-center gap-3 sm:flex-row sm:justify-center`}
        style={sectionSurfaceStyle}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg">
          <Store className="h-7 w-7 text-white" />
        </div>
        <div className="min-w-0 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Impostazioni locale</h2>
          <p className="text-sm text-slate-600">
            Modifica i dati visualizzati nella pagina Prenotazioni e nel Calendario.
          </p>
        </div>
      </div>

      <section className={sectionSurfaceClass} style={sectionSurfaceStyle}>
        <h3 className="text-lg font-semibold text-slate-800">Anagrafica e prenotazioni</h3>
        <div className="flex w-full flex-col items-center">
          <div className={anagraficaFieldWrapClass}>
            <Label htmlFor="restaurant_name" className="block w-full text-center">
              Nome ristorante
            </Label>
            <input
              id="restaurant_name"
              name="restaurant_name"
              type="text"
              maxLength={RESTAURANT_NAME_MAX_LENGTH}
              dir="ltr"
              autoComplete="off"
              value={typeof restaurantName === 'string' ? restaurantName : ''}
              disabled={upsert.isPending}
              onChange={handleRestaurantNameChange}
              placeholder="Nome del locale"
              className={anagraficaInputClassName}
              style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="daily_guest_limit" className="block w-full text-center">
              Limite coperti giornaliero
            </Label>
            <Input
              id="daily_guest_limit"
              type="number"
              min={1}
              max={1000}
              value={dailyGuestLimit}
              disabled={upsert.isPending}
              className={`${anagraficaInputClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              onChange={(e) => {
                markDirty()
                const raw = e.target.value
                if (raw === '') {
                  setDailyGuestLimit('')
                  return
                }
                const n = parseInt(raw, 10)
                if (!Number.isNaN(n)) setDailyGuestLimit(n)
              }}
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="contact_email" className="block w-full text-center">
              Email contatto
            </Label>
            <Input
              id="contact_email"
              type="email"
              value={contactEmail}
              disabled={upsert.isPending}
              className={anagraficaInputClassName}
              onChange={(e) => {
                markDirty()
                setContactEmail(stripDirectionalFormattingChars(e.target.value))
              }}
              placeholder="ristorante@example.com"
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="contact_phone" className="block w-full text-center">
              Telefono contatto
            </Label>
            <Input
              id="contact_phone"
              value={contactPhone}
              disabled={upsert.isPending}
              className={anagraficaInputClassName}
              onChange={(e) => {
                markDirty()
                setContactPhone(stripDirectionalFormattingChars(e.target.value))
              }}
              placeholder="+39 ..."
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="contact_address" className="block w-full text-center">
              Indirizzo contatto
            </Label>
            <Input
              id="contact_address"
              value={contactAddress}
              disabled={upsert.isPending}
              className={anagraficaInputClassName}
              onChange={(e) => {
                markDirty()
                setContactAddress(stripDirectionalFormattingChars(e.target.value))
              }}
              placeholder="Via ..., Citta, CAP"
            />
          </div>
        </div>
      </section>

      <section className={sectionSurfaceClass} style={sectionSurfaceStyle}>
        <h3 className="text-lg font-semibold text-slate-800">Imposta Fasce Orarie</h3>
        <p className="text-sm text-slate-600">
          Cambia le fasce orarie in cui vengono raggruppate le prenotazioni nel calendario.
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          {slotValidationError && (
            <div className="mx-auto w-full max-w-[14rem] rounded-[1.25rem] border-2 border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-sm">
              {slotValidationError}
            </div>
          )}
          <div
            className="w-full rounded-xl border bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
            style={{ borderColor: ADMIN_WARM_BORDER }}
          >
            <p className="mb-3 text-sm font-semibold text-emerald-900">
              {getBookingTimeSlotLabel('morning', bookingTimeSlots)}
            </p>
            <div className="flex w-full flex-row flex-nowrap items-end justify-center gap-4 overflow-x-auto py-1 [scrollbar-width:thin] md:gap-8">
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('morningStart')}`}
                style={slotFieldStyle('morningStart')}
                ref={(el) => {
                  slotFieldRefs.current.morningStart = el
                }}
                onClick={() => clearSlotAttention('morningStart')}
              >
                <Label htmlFor="slot_morning_start" className="block w-full text-center">
                  Inizio mattina
                </Label>
                <TimePicker24h
                  id="slot_morning_start"
                  value={bookingTimeSlots.morningStart}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, morningStart: e }))
                  }}
                />
              </div>
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('morningEnd')}`}
                style={slotFieldStyle('morningEnd')}
                ref={(el) => {
                  slotFieldRefs.current.morningEnd = el
                }}
                onClick={() => clearSlotAttention('morningEnd')}
              >
                <Label htmlFor="slot_morning_end" className="block w-full text-center">
                  Fine mattina
                </Label>
                <TimePicker24h
                  id="slot_morning_end"
                  value={bookingTimeSlots.morningEnd}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, morningEnd: e }))
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="w-full rounded-xl border bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
            style={{ borderColor: ADMIN_WARM_BORDER }}
          >
            <p className="mb-3 text-sm font-semibold text-orange-900">
              {getBookingTimeSlotLabel('afternoon', bookingTimeSlots)}
            </p>
            <div className="flex w-full flex-row flex-nowrap items-end justify-center gap-4 overflow-x-auto py-1 [scrollbar-width:thin] md:gap-8">
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('afternoonStart')}`}
                style={slotFieldStyle('afternoonStart')}
                ref={(el) => {
                  slotFieldRefs.current.afternoonStart = el
                }}
                onClick={() => clearSlotAttention('afternoonStart')}
              >
                <Label htmlFor="slot_afternoon_start" className="block w-full text-center">
                  Inizio pomeriggio
                </Label>
                <TimePicker24h
                  id="slot_afternoon_start"
                  value={bookingTimeSlots.afternoonStart}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, afternoonStart: e }))
                  }}
                />
              </div>
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('afternoonEnd')}`}
                style={slotFieldStyle('afternoonEnd')}
                ref={(el) => {
                  slotFieldRefs.current.afternoonEnd = el
                }}
                onClick={() => clearSlotAttention('afternoonEnd')}
              >
                <Label htmlFor="slot_afternoon_end" className="block w-full text-center">
                  Fine pomeriggio
                </Label>
                <TimePicker24h
                  id="slot_afternoon_end"
                  value={bookingTimeSlots.afternoonEnd}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, afternoonEnd: e }))
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="w-full rounded-xl border bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
            style={{ borderColor: ADMIN_WARM_BORDER }}
          >
            <p className="mb-3 text-sm font-semibold text-sky-900">
              {getBookingTimeSlotLabel('evening', bookingTimeSlots)}
            </p>
            <div className="flex w-full flex-row flex-nowrap items-end justify-center gap-4 overflow-x-auto py-1 [scrollbar-width:thin] md:gap-8">
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('eveningStart')}`}
                style={slotFieldStyle('eveningStart')}
                ref={(el) => {
                  slotFieldRefs.current.eveningStart = el
                }}
                onClick={() => clearSlotAttention('eveningStart')}
              >
                <Label htmlFor="slot_evening_start" className="block w-full text-center">
                  Inizio sera
                </Label>
                <TimePicker24h
                  id="slot_evening_start"
                  value={bookingTimeSlots.eveningStart}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, eveningStart: e }))
                  }}
                />
              </div>
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('eveningEnd')}`}
                style={slotFieldStyle('eveningEnd')}
                ref={(el) => {
                  slotFieldRefs.current.eveningEnd = el
                }}
                onClick={() => clearSlotAttention('eveningEnd')}
              >
                <Label htmlFor="slot_evening_end" className="block w-full text-center">
                  Fine sera
                </Label>
                <TimePicker24h
                  id="slot_evening_end"
                  value={bookingTimeSlots.eveningEnd}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, eveningEnd: e }))
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionSurfaceClass} style={sectionSurfaceStyle}>
        <h3 className="text-lg font-semibold text-slate-800">Orari di apertura</h3>
        <p className="text-sm text-slate-600">
          Modifica gli orari visibili al pubblico nella pagina di Prenotazione.
        </p>
        <BusinessHoursEditor
          value={businessHours}
          disabled={upsert.isPending}
          onChange={(next) => {
            markDirty()
            setBusinessHours(next)
          }}
        />
      </section>

      <div
        className="restaurant-settings-save-footer flex min-h-[4.75rem] w-full max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-xl border px-6 py-6 shadow-sm md:min-h-[5.25rem] md:px-8 md:py-7"
        style={{
          ...ADMIN_WARM_GRADIENT_SURFACE,
        }}
      >
        <Button
          type="button"
          onClick={handleSave}
          disabled={upsert.isPending || !tenantId}
          className="restaurant-settings-save-submit min-h-[3.75rem] bg-[#1e3a8a] px-10 py-5 text-base shadow-md hover:bg-[#1e40af] hover:shadow-lg focus:ring-[#3b82f6] disabled:pointer-events-none disabled:bg-[#1e3a8a]"
        >
          {upsert.isPending ? (
            <>
              <Loader2 className="h-6 w-6 shrink-0 animate-spin" />
              Salvataggio…
            </>
          ) : (
            'Salva modifiche'
          )}
        </Button>
        {dirty && !upsert.isPending && (
          <span
            className="restaurant-settings-save-footer-msg max-w-xl text-center text-base font-semibold leading-snug text-slate-900"
            style={{ color: 'var(--color-text)', WebkitTextFillColor: 'var(--color-text)' }}
          >
            Modifiche non salvate.
          </span>
        )}
      </div>
    </div>
  )
}
