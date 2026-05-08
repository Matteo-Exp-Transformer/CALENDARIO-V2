import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookingRequestForm } from '@/features/booking/components/BookingRequestForm'
import { MapPin, Clock, Phone, Mail, ChevronDown } from 'lucide-react'
import { useBusinessHours } from '@/hooks/useBusinessHours'
import { useRestaurantName } from '@/hooks/useRestaurantName'
import { formatHours, getDefaultBusinessHours } from '@/lib/businessHours'
import { useTenantContext } from '@/contexts/TenantContext'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'
import {
  BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
  DEFAULT_BOOKING_PAGE_BACKGROUND,
  bookingPageGradientCss,
  bookingPageTilePublicHref,
  isBookingPageGradientId,
  type BookingPageBackgroundId,
} from '@/features/booking/constants/bookingPageBackground'

export const BookingRequestPage: React.FC = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>()
  const { tenantId, isLoading: isTenantLoading, setTenantFromSlug } = useTenantContext()
  const restaurantName = useRestaurantName()

  useEffect(() => {
    if (tenantSlug) {
      setTenantFromSlug(tenantSlug)
    }
  }, [tenantSlug, setTenantFromSlug])

  const { data: businessHours, isLoading } = useBusinessHours()
  const [mobileInfoOpen, setMobileInfoOpen] = useState<'hours' | 'contacts'>('hours')
  const hours = businessHours || getDefaultBusinessHours()
  const { data: contactEmail } = useRestaurantSetting('contact_email')
  const { data: contactPhone } = useRestaurantSetting('contact_phone')
  const { data: contactAddress } = useRestaurantSetting('contact_address')
  const { data: publicBookingBg, isPending: isPublicBookingBgPending } = useRestaurantSetting(
    'public_booking_page_background'
  )

  // Imposta il background su :root e rende il body trasparente perché il body
  // di default è opaco e coprirebbe lo sfondo dinamico impostato qui.
  useEffect(() => {
    if (isTenantLoading || !tenantId) return

    const root = document.documentElement
    const body = document.body
    const bgId: BookingPageBackgroundId = isPublicBookingBgPending
      ? DEFAULT_BOOKING_PAGE_BACKGROUND
      : (publicBookingBg ?? DEFAULT_BOOKING_PAGE_BACKGROUND)
    const prevBodyBg = body.style.backgroundColor
    body.style.backgroundColor = 'transparent'

    if (isBookingPageGradientId(bgId)) {
      root.style.backgroundColor = BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR
      root.style.backgroundImage = bookingPageGradientCss(bgId)
      root.style.backgroundSize = 'cover'
      root.style.backgroundPosition = 'center'
      root.style.backgroundRepeat = 'no-repeat'
      root.style.backgroundAttachment = 'scroll'
    } else {
      const tileUrl = bookingPageTilePublicHref(bgId, import.meta.env.BASE_URL, String(Date.now()))
      root.style.backgroundColor = BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR
      root.style.backgroundImage = `url("${tileUrl}")`
      root.style.backgroundSize = '100% auto'
      root.style.backgroundPosition = 'top center'
      root.style.backgroundRepeat = 'repeat-y'
      root.style.backgroundAttachment = 'scroll'
    }

    return () => {
      body.style.backgroundColor = prevBodyBg
      root.style.backgroundColor = ''
      root.style.backgroundImage = ''
      root.style.backgroundSize = ''
      root.style.backgroundPosition = ''
      root.style.backgroundRepeat = ''
      root.style.backgroundAttachment = ''
    }
  }, [isTenantLoading, tenantId, isPublicBookingBgPending, publicBookingBg])

  const formatDayName = (day: string): string => {
    const dayMap: Record<string, string> = {
      monday: 'Lunedi',
      tuesday: 'Martedi',
      wednesday: 'Mercoledi',
      thursday: 'Giovedi',
      friday: 'Venerdi',
      saturday: 'Sabato',
      sunday: 'Domenica',
    }
    return dayMap[day] || day
  }

  const dayOrder: (keyof typeof hours)[] = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  ]

  type WeekdayKey = (typeof dayOrder)[number]
  const openingHoursColumns: [WeekdayKey[], WeekdayKey[]] = [
    dayOrder.slice(0, 4),
    dayOrder.slice(4),
  ]

  // clamp usato 3 volte: mantiene allineamento simmetrico tra colonna Orari e Contatti
  const hoursInset = 'clamp(0.4rem, 2vw, 1rem)'

  const displayName = restaurantName || 'Al Ritrovo'
  const displayContactEmail = (contactEmail ?? '').trim()
  const displayContactPhone = (contactPhone ?? '').trim()
  const displayContactAddress = (contactAddress ?? '').trim()

  if (isTenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent" />
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Prenotazioni temporaneamente non disponibili</h1>
          <p className="text-gray-600">Il ristorante richiesto non esiste, e&apos;inattivo o l&apos;indirizzo non e&apos;corretto.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative font-bold">
      <div className="fixed inset-0 z-0 bg-black/15" />

      <div className="relative z-10 min-h-screen">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pb-1.5">

          <div className="py-1.5">
            <div className="bg-white/30 backdrop-blur-[16px] py-[7px] px-[13px] md:py-2 md:px-[29px] rounded-lg shadow-md animate-fade-in">
              <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                <h1
                  className="font-serif text-warm-wood font-bold leading-tight m-0"
                  style={{ fontSize: 'clamp(1.4rem, calc(2.8vw * 4 / 3), 1.8rem)' }}
                >
                  {displayName}
                </h1>
                <h2
                  className="font-serif text-warm-wood font-bold leading-tight m-0"
                  style={{ fontSize: 'clamp(1.27rem, calc(2.5vw * 4 / 3), 1.53rem)' }}
                >
                  Richiesta Prenotazione Tavolo
                </h2>
                <p className="text-warm-wood-dark opacity-90 font-bold text-[0.917rem] leading-[1.42] m-0 px-1.5 max-w-[42rem]">
                  Compilando questo form invierai una richiesta allo staff. Ti contatteremo al pi&ugrave; presto per comunicarti l&apos;esito della richiesta!
                </p>
              </div>
            </div>
          </div>

          <BookingRequestForm tenantSlug={tenantSlug} />

          <div className="rounded-2xl shadow-xl px-3 md:px-5 bg-white/30 backdrop-blur-[16px] pt-[clamp(0.4rem,1.2vw,0.7rem)] pb-[clamp(0.5rem,1.6vmin,0.9rem)] mt-[clamp(2rem,6vmin,3.5rem)] animate-fade-in">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 md:gap-x-4 items-start max-[480px]:hidden">

              <div className="min-w-0 w-full space-y-1 text-left pr-1.5">
                <div className="flex items-center gap-1.5 mb-1" style={{ paddingLeft: hoursInset }}>
                  <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-md">
                    <Clock className="w-[14px] h-[14px] text-white" />
                  </div>
                  <h3 className="text-xs md:text-sm font-serif text-warm-wood leading-tight font-bold bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-md inline-block">
                    Orari
                  </h3>
                </div>
                <div
                  className="flex flex-wrap items-start gap-y-0 leading-tight"
                  style={{ paddingLeft: hoursInset, columnGap: 'clamp(1.2rem, 6.4vw, 3.2rem)' }}
                >
                  {isLoading ? (
                    <div className="w-full font-medium text-xs text-warm-wood-dark">
                      Caricamento orari...
                    </div>
                  ) : (
                    openingHoursColumns.map((columnDays, colIdx) => (
                      <div key={colIdx} className="shrink-0 space-y-0">
                        {columnDays.map((day) => {
                          const dayHours = hours[day]
                          const isOpen = !!dayHours && dayHours.length > 0
                          return (
                            <div key={day} className="font-medium text-xs text-warm-wood-dark leading-tight">
                              {formatDayName(day)}: {isOpen ? formatHours(dayHours) : 'Chiuso'}
                            </div>
                          )
                        })}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="min-w-0 space-y-0.5 justify-self-end text-right" style={{ paddingRight: hoursInset }}>
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-md">
                    <MapPin className="w-[14px] h-[14px] text-white" />
                  </div>
                  <h3 className="text-xs md:text-sm font-serif text-warm-wood leading-tight font-bold bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-md inline-block">
                    Contatti e Indirizzo
                  </h3>
                </div>
                {displayContactEmail && (
                  <div className="flex min-w-0 items-center justify-end gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-warm-orange flex-shrink-0" />
                    <span className="min-w-0 break-all text-right text-xs text-warm-wood-dark font-medium leading-tight">
                      {displayContactEmail}
                    </span>
                  </div>
                )}
                {displayContactPhone && (
                  <div className="flex items-center justify-end gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-warm-orange flex-shrink-0" />
                    <span className="text-xs text-warm-wood-dark font-medium leading-tight">{displayContactPhone}</span>
                  </div>
                )}
                {displayContactAddress && (
                  <div className="flex items-center justify-end gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-warm-orange flex-shrink-0" />
                    <span className="text-xs text-warm-wood-dark font-bold leading-tight">{displayContactAddress}</span>
                  </div>
                )}
              </div>

            </div>

            <div className="hidden max-[480px]:block space-y-2">
              <div className="rounded-xl bg-white/35 backdrop-blur-sm">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2"
                  onClick={() => setMobileInfoOpen('hours')}
                  aria-expanded={mobileInfoOpen === 'hours'}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-md">
                      <Clock className="w-[14px] h-[14px] text-white" />
                    </div>
                    <h3 className="text-xs font-serif text-warm-wood leading-tight font-bold bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-md inline-block">
                      Orari
                    </h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-warm-wood transition-transform ${mobileInfoOpen === 'hours' ? 'rotate-180' : ''}`} />
                </button>
                {mobileInfoOpen === 'hours' && (
                  <div className="px-3 pb-2 space-y-0.5">
                    {isLoading ? (
                      <div className="font-medium text-xs text-warm-wood-dark">Caricamento orari...</div>
                    ) : (
                      dayOrder.map((day) => {
                        const dayHours = hours[day]
                        const isOpen = !!dayHours && dayHours.length > 0
                        return (
                          <div key={day} className="font-medium text-xs text-warm-wood-dark leading-tight">
                            {formatDayName(day)}: {isOpen ? formatHours(dayHours) : 'Chiuso'}
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-white/35 backdrop-blur-sm">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2"
                  onClick={() => setMobileInfoOpen('contacts')}
                  aria-expanded={mobileInfoOpen === 'contacts'}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-md">
                      <MapPin className="w-[14px] h-[14px] text-white" />
                    </div>
                    <h3 className="text-xs font-serif text-warm-wood leading-tight font-bold bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-md inline-block">
                      Contatti e Indirizzo
                    </h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-warm-wood transition-transform ${mobileInfoOpen === 'contacts' ? 'rotate-180' : ''}`} />
                </button>
                {mobileInfoOpen === 'contacts' && (
                  <div className="px-3 pb-2 space-y-0.5 text-left">
                    {displayContactEmail && (
                      <div className="flex min-w-0 items-center justify-start gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-warm-orange shrink-0" />
                        <span className="min-w-0 break-all text-left text-xs text-warm-wood-dark font-medium leading-tight">
                          {displayContactEmail}
                        </span>
                      </div>
                    )}
                    {displayContactPhone && (
                      <div className="flex items-center justify-start gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-warm-orange shrink-0" />
                        <span className="text-xs text-warm-wood-dark font-medium leading-tight">{displayContactPhone}</span>
                      </div>
                    )}
                    {displayContactAddress && (
                      <div className="flex items-center justify-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-warm-orange shrink-0" />
                        <span className="text-xs text-warm-wood-dark font-bold leading-tight">{displayContactAddress}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
