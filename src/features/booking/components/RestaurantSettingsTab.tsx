import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Store, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useTenantContext } from '@/contexts/TenantContext'
import type { BusinessHours } from '@/lib/businessHours'
import { getDefaultBusinessHours } from '@/lib/businessHours'
import { BusinessHoursEditor } from './BusinessHoursEditor'
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'

export const RestaurantSettingsTab: React.FC = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  const nameQuery = useRestaurantSetting('restaurant_name')
  const windowQuery = useRestaurantSetting('booking_window_days')
  const hoursQuery = useRestaurantSetting('business_hours')
  const contactEmailQuery = useRestaurantSetting('contact_email')
  const contactPhoneQuery = useRestaurantSetting('contact_phone')
  const contactAddressQuery = useRestaurantSetting('contact_address')

  const upsert = useUpsertRestaurantSetting()

  const [dirty, setDirty] = useState(false)
  const [restaurantName, setRestaurantName] = useState('')
  const [bookingWindowDays, setBookingWindowDays] = useState<number | ''>(60)
  const [businessHours, setBusinessHours] = useState<BusinessHours>(() => getDefaultBusinessHours())
  const [contactEmail, setContactEmail] = useState('Alritrovobologna@gmail.com')
  const [contactPhone, setContactPhone] = useState('3505362538')
  const [contactAddress, setContactAddress] = useState('Via Centotrecento 1/1B - Bologna, 40126')

  const hydratedRef = useRef(false)

  useEffect(() => {
    hydratedRef.current = false
    setDirty(false)
  }, [tenantId])

  const allSuccess =
    nameQuery.isSuccess &&
    windowQuery.isSuccess &&
    hoursQuery.isSuccess &&
    contactEmailQuery.isSuccess &&
    contactPhoneQuery.isSuccess &&
    contactAddressQuery.isSuccess

  useEffect(() => {
    if (!allSuccess || hydratedRef.current) return
    setRestaurantName(nameQuery.data)
    setBookingWindowDays(windowQuery.data)
    setBusinessHours(hoursQuery.data)
    setContactEmail(contactEmailQuery.data || 'Alritrovobologna@gmail.com')
    setContactPhone(contactPhoneQuery.data || '3505362538')
    setContactAddress(contactAddressQuery.data || 'Via Centotrecento 1/1B - Bologna, 40126')
    hydratedRef.current = true
  }, [
    allSuccess,
    nameQuery.data,
    windowQuery.data,
    hoursQuery.data,
    contactEmailQuery.data,
    contactPhoneQuery.data,
    contactAddressQuery.data,
  ])

  const loading =
    nameQuery.isPending ||
    windowQuery.isPending ||
    hoursQuery.isPending ||
    contactEmailQuery.isPending ||
    contactPhoneQuery.isPending ||
    contactAddressQuery.isPending

  const loadError =
    nameQuery.error ||
    windowQuery.error ||
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
    try {
      await upsert.mutateAsync([
        { key: 'restaurant_name', value: restaurantName },
        { key: 'booking_window_days', value: bookingWindowDays },
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

  return (
    <div className="space-y-8">
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
            <Label htmlFor="booking_window_days">Finestra prenotazione (giorni)</Label>
            <Input
              id="booking_window_days"
              type="number"
              min={1}
              max={365}
              value={bookingWindowDays}
              disabled={upsert.isPending}
              onChange={(e) => {
                markDirty()
                const raw = e.target.value
                if (raw === '') {
                  setBookingWindowDays('')
                  return
                }
                const n = parseInt(raw, 10)
                if (!Number.isNaN(n)) setBookingWindowDays(n)
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
