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
import { BusinessHoursEditor } from './BusinessHoursEditor'
import { toast } from 'react-toastify'
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'
import {
  DEFAULT_BOOKING_TIME_SLOTS,
  getBookingTimeSlotLabel,
  parseHmToMinutes,
  type BookingTimeSlots,
} from '@/features/booking/utils/bookingTimeSlots'

type SlotFieldKey =
  | 'morningStart'
  | 'morningEnd'
  | 'afternoonStart'
  | 'afternoonEnd'
  | 'eveningStart'
  | 'eveningEnd'

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

  const morningStart = parseHmToMinutes(config.morningStart)
  const morningEnd = parseHmToMinutes(config.morningEnd)
  const afternoonStart = parseHmToMinutes(config.afternoonStart)
  const afternoonEnd = parseHmToMinutes(config.afternoonEnd)
  const eveningStart = parseHmToMinutes(config.eveningStart)
  const eveningEnd = parseHmToMinutes(config.eveningEnd)

  if (morningStart >= morningEnd) {
    return {
      message: 'La fascia Mattina non e valida: inizio deve essere prima della fine',
      fields: ['morningStart', 'morningEnd'],
    }
  }
  if (afternoonStart >= afternoonEnd) {
    return {
      message: 'La fascia Pomeriggio non e valida: inizio deve essere prima della fine',
      fields: ['afternoonStart', 'afternoonEnd'],
    }
  }
  if (eveningStart >= eveningEnd) {
    return {
      message: 'La fascia Sera non e valida: inizio deve essere prima della fine',
      fields: ['eveningStart', 'eveningEnd'],
    }
  }
  if (afternoonStart <= morningEnd) {
    return {
      message: 'Le fasce Mattina e Pomeriggio si sovrappongono',
      fields: ['morningEnd', 'afternoonStart'],
    }
  }
  if (eveningStart <= afternoonEnd) {
    return {
      message: 'Le fasce Pomeriggio e Sera si sovrappongono',
      fields: ['afternoonEnd', 'eveningStart'],
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
    setRestaurantName(nameQuery.data)
    setDailyGuestLimit(dailyGuestLimitQuery.data)
    setBookingTimeSlots(bookingTimeSlotsQuery.data)
    setBusinessHours(hoursQuery.data)
    setContactEmail(contactEmailQuery.data || 'Alritrovobologna@gmail.com')
    setContactPhone(contactPhoneQuery.data || '3505362538')
    setContactAddress(contactAddressQuery.data || 'Via Centotrecento 1/1B - Bologna, 40126')
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
    setRestaurantName(event.target.value)
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
      await upsert.mutateAsync([
        { key: 'restaurant_name', value: restaurantName },
        { key: 'daily_guest_limit', value: dailyGuestLimit },
        { key: 'booking_time_slots', value: bookingTimeSlots },
        { key: 'business_hours', value: businessHours },
        { key: 'contact_email', value: contactEmail },
        { key: 'contact_phone', value: contactPhone },
        { key: 'contact_address', value: contactAddress },
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
    slotFieldsAttention[field]
      ? 'rounded-lg'
      : ''
  const slotFieldStyle = (field: SlotFieldKey): React.CSSProperties | undefined =>
    slotFieldsAttention[field]
      ? {
          boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55)',
          animation: 'slotErrorBlink 0.85s ease-in-out infinite',
        }
      : undefined

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes slotErrorBlink {
          0% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55); }
          50% { box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.65), 0 0 4px rgba(239, 68, 68, 0.25); }
          100% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55); }
        }
      `}</style>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
          <Store className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Impostazioni locale</h2>
          <p className="text-sm text-slate-500">
            Nome, prenotazioni e orari salvati in Supabase per questo tenant.
          </p>
        </div>
      </div>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Anagrafica e prenotazioni</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="restaurant_name">Nome ristorante (visualizzato)</Label>
            <input
              id="restaurant_name"
              name="restaurant_name"
              type="text"
              dir="ltr"
              autoComplete="off"
              value={typeof restaurantName === 'string' ? restaurantName : ''}
              disabled={upsert.isPending}
              onChange={handleRestaurantNameChange}
              placeholder="Nome del locale"
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-colors duration-150"
              style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily_guest_limit">Limite coperti giornaliero</Label>
            <Input
              id="daily_guest_limit"
              type="number"
              min={1}
              max={1000}
              value={dailyGuestLimit}
              disabled={upsert.isPending}
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
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email contatto (pagina prenota)</Label>
            <Input
              id="contact_email"
              type="email"
              value={contactEmail}
              disabled={upsert.isPending}
              onChange={(e) => {
                markDirty()
                setContactEmail(e.target.value)
              }}
              placeholder="ristorante@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telefono contatto (pagina prenota)</Label>
            <Input
              id="contact_phone"
              value={contactPhone}
              disabled={upsert.isPending}
              onChange={(e) => {
                markDirty()
                setContactPhone(e.target.value)
              }}
              placeholder="+39 ..."
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contact_address">Indirizzo contatto (pagina prenota)</Label>
            <Input
              id="contact_address"
              value={contactAddress}
              disabled={upsert.isPending}
              onChange={(e) => {
                markDirty()
                setContactAddress(e.target.value)
              }}
              placeholder="Via ..., Citta, CAP"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Imposta Fasce Orarie</h3>
        <p className="text-sm text-slate-500">
          Personalizza le fasce usate nel calendario (Mattina/Pomeriggio/Sera). Le fasce non possono sovrapporsi.
        </p>

        <div className="grid gap-4">
          {slotValidationError && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
              {slotValidationError}
            </div>
          )}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="mb-3 text-sm font-semibold text-emerald-900">
              {getBookingTimeSlotLabel('morning', bookingTimeSlots)}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className={`space-y-1.5 ${slotFieldClass('morningStart')}`}
                style={slotFieldStyle('morningStart')}
                ref={(el) => {
                  slotFieldRefs.current.morningStart = el
                }}
                onClick={() => clearSlotAttention('morningStart')}
              >
                <Label htmlFor="slot_morning_start">Inizio mattina</Label>
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
                className={`space-y-1.5 ${slotFieldClass('morningEnd')}`}
                style={slotFieldStyle('morningEnd')}
                ref={(el) => {
                  slotFieldRefs.current.morningEnd = el
                }}
                onClick={() => clearSlotAttention('morningEnd')}
              >
                <Label htmlFor="slot_morning_end">Fine mattina</Label>
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

          <div className="rounded-lg border border-orange-200 bg-orange-50/60 p-4">
            <p className="mb-3 text-sm font-semibold text-orange-900">
              {getBookingTimeSlotLabel('afternoon', bookingTimeSlots)}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className={`space-y-1.5 ${slotFieldClass('afternoonStart')}`}
                style={slotFieldStyle('afternoonStart')}
                ref={(el) => {
                  slotFieldRefs.current.afternoonStart = el
                }}
                onClick={() => clearSlotAttention('afternoonStart')}
              >
                <Label htmlFor="slot_afternoon_start">Inizio pomeriggio</Label>
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
                className={`space-y-1.5 ${slotFieldClass('afternoonEnd')}`}
                style={slotFieldStyle('afternoonEnd')}
                ref={(el) => {
                  slotFieldRefs.current.afternoonEnd = el
                }}
                onClick={() => clearSlotAttention('afternoonEnd')}
              >
                <Label htmlFor="slot_afternoon_end">Fine pomeriggio</Label>
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

          <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-4">
            <p className="mb-3 text-sm font-semibold text-sky-900">
              {getBookingTimeSlotLabel('evening', bookingTimeSlots)}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className={`space-y-1.5 ${slotFieldClass('eveningStart')}`}
                style={slotFieldStyle('eveningStart')}
                ref={(el) => {
                  slotFieldRefs.current.eveningStart = el
                }}
                onClick={() => clearSlotAttention('eveningStart')}
              >
                <Label htmlFor="slot_evening_start">Inizio sera</Label>
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
                className={`space-y-1.5 ${slotFieldClass('eveningEnd')}`}
                style={slotFieldStyle('eveningEnd')}
                ref={(el) => {
                  slotFieldRefs.current.eveningEnd = el
                }}
                onClick={() => clearSlotAttention('eveningEnd')}
              >
                <Label htmlFor="slot_evening_end">Fine sera</Label>
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

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Orari di apertura</h3>
        <p className="text-sm text-slate-500">
          Modifiche visibili sul form pubblico dopo il salvataggio (stesso tenant).
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

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={upsert.isPending || !tenantId}
        >
          {upsert.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvataggio…
            </>
          ) : (
            'Salva modifiche'
          )}
        </Button>
        {dirty && !upsert.isPending && (
          <span className="text-sm text-amber-700">Modifiche non salvate</span>
        )}
      </div>
    </div>
  )
}
