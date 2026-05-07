import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BookingRequestForm } from '@/features/booking/components/BookingRequestForm'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
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

  // Resolve tenant from URL slug on mount
  useEffect(() => {
    if (tenantSlug) {
      setTenantFromSlug(tenantSlug)
    }
  }, [tenantSlug, setTenantFromSlug])

  // Fetch business hours for display (fallback to defaults if unavailable)
  const { data: businessHours, isLoading } = useBusinessHours()
  const hours = businessHours || getDefaultBusinessHours()
  const { data: contactEmail } = useRestaurantSetting('contact_email')
  const { data: contactPhone } = useRestaurantSetting('contact_phone')
  const { data: contactAddress } = useRestaurantSetting('contact_address')
  const { data: publicBookingBg, isPending: isPublicBookingBgPending } = useRestaurantSetting(
    'public_booking_page_background'
  )

  /**
   * Texture verticale da impostazioni (`public/booking/tiles/tile-XX.png`).
   * Il body di default e opaco e coprirebbe lo sfondo su :root → qui lo rendiamo trasparente.
   */
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
      const tileUrl = bookingPageTilePublicHref(bgId, import.meta.env.BASE_URL)
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

  // Format day name for display
  const formatDayName = (day: string): string => {
    const dayMap: Record<string, string> = {
      monday: 'Lunedi',
      tuesday: 'Martedi',
      wednesday: 'Mercoledi',
      thursday: 'Giovedi',
      friday: 'Venerdi',
      saturday: 'Sabato',
      sunday: 'Domenica'
    }
    return dayMap[day] || day
  }

  const dayOrder: (keyof typeof hours)[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  /** Prima colonna 4 giorni, seconda colonna 3 — layout affiancato */
  type WeekdayKey = (typeof dayOrder)[number]
  const openingHoursColumns: [WeekdayKey[], WeekdayKey[]] = [
    dayOrder.slice(0, 4),
    dayOrder.slice(4),
  ]

  /** Rientro simmetrico nella card info: sinistra Orari, destra Contatti */
  const openingHoursInsetLeft = 'clamp(0.4rem, 2vw, 1rem)'

  // Display name: prefer restaurant_settings.restaurant_name, fallback a organizations.name → "Al Ritrovo"
  const displayName = restaurantName || 'Al Ritrovo'
  const displayContactEmail = contactEmail || 'Alritrovobologna@gmail.com'
  const displayContactPhone = contactPhone || '3505362538'
  const displayContactAddress = contactAddress || 'Via Centotrecento 1/1B - Bologna, 40126'

  // Show loading while resolving tenant
  if (isTenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-al-ritrovo-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  // Show error if tenant not found or tenant is inactive
  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Prenotazioni temporaneamente non disponibili</h1>
          <p className="text-gray-600">Il ristorante richiesto non esiste, e&apos; inattivo o l&apos;indirizzo non e&apos; corretto.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-request-page min-h-screen relative font-bold">
      <style>{`
        .booking-request-header-inner {
          box-sizing: border-box;
          padding: 7px 13px !important;
        }
        @media (min-width: 768px) {
          .booking-request-header-inner {
            padding: 8px 29px !important;
          }
        }
      `}</style>
      {/* Overlay scuro per leggibilita */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      />

      {/* Immagine vintage in fondo - Solo Mobile */}
      <div
        className="fixed bottom-0 left-0 right-0 z-0 md:hidden"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(63, 40, 22, 0.55) 0%, rgba(22, 14, 8, 0.8) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          top: '100vh'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div
          className="w-full max-w-6xl mx-auto px-4 md:px-8"
          style={{
            /* Come il wrapper dell’header (`paddingTop: 6`): stesso inset dal bordo inferiore della colonna */
            paddingBottom: 6,
          }}
        >

          {/* Header compatto */}
          <div style={{ paddingTop: 6, paddingBottom: 6 }}>
            <div
              className="booking-request-header-inner rounded-lg shadow-md animate-fade-in"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(16px)',
                maxWidth: '100%',
              }}
            >
              <div
                className="text-center"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <h1
                  className="font-serif text-warm-wood"
                  style={{
                    fontWeight: 700,
                    fontSize: 'clamp(1.4rem, calc(2.8vw * 4 / 3), 1.8rem)',
                    lineHeight: 1.2,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {displayName}
                </h1>

                <h2
                  className="font-serif text-warm-wood"
                  style={{
                    fontWeight: 700,
                    fontSize: 'clamp(1.27rem, calc(2.5vw * 4 / 3), 1.53rem)',
                    lineHeight: 1.2,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Richiesta Prenotazione Tavolo
                </h2>

                <p
                  className="text-warm-wood-dark opacity-90"
                  style={{
                    fontWeight: 700,
                    fontSize: '0.917rem',
                    lineHeight: 1.42,
                    margin: 0,
                    padding: '0 6px',
                    maxWidth: '42rem',
                  }}
                >
                  Compilando questo form invierai una richiesta allo staff. Ti contatteremo al pi&ugrave; presto per comunicarti l&apos;esito della richiesta!
                </p>
              </div>
            </div>
          </div>

          {/* Form Card con Glassmorphism e Layout 2 Colonne */}
          <div className="bg-white/30 md:bg-white/95 backdrop-blur-xl md:backdrop-blur-md shadow-2xl rounded-modern p-8 md:p-12 mb-8 animate-slide-in-up">
            <BookingRequestForm tenantSlug={tenantSlug} />
          </div>

          {/* Info Box Ridisegnata */}
          <div
            className="rounded-2xl shadow-xl px-3 md:px-5 animate-fade-in"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(16px)',
              paddingTop: 'clamp(0.4rem, 1.2vw, 0.7rem)',
              paddingBottom: 'clamp(0.5rem, 1.6vmin, 0.9rem)',
              /* Card più in basso sul flusso; il margine esterno sotto è sul contenitore (6px come sopra l’header) */
              marginTop: 'clamp(2rem, 6vmin, 3.5rem)',
              marginBottom: 0,
            }}
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 md:gap-x-4 items-start">
              {/* Colonna 1: Orari — w-full evita shrink-wrap da justify-self-start che incollava tutto a sinistra */}
              <div className="min-w-0 w-full space-y-1 text-left pr-1.5">
                <div
                  className="flex items-center gap-1.5 mb-1"
                  style={{ paddingLeft: openingHoursInsetLeft }}
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-md">
                    <Clock className="w-[14px] h-[14px] text-white" />
                  </div>
                  <div className="text-left">
                    <h3
                      className="text-xs md:text-sm font-serif text-warm-wood leading-tight"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(6px)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        fontWeight: '700'
                      }}
                    >
                      Orari
                    </h3>
                  </div>
                </div>
                <div
                  className="flex flex-wrap items-start gap-y-0 leading-tight"
                  style={{
                    paddingLeft: openingHoursInsetLeft,
                    columnGap: 'clamp(1.2rem, 6.4vw, 3.2rem)',
                  }}
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

              {/* Colonna 2: Contatti */}
              <div
                className="min-w-0 space-y-0.5 justify-self-end text-right"
                style={{ paddingRight: openingHoursInsetLeft }}
              >
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-md">
                    <MapPin className="w-[14px] h-[14px] text-white" />
                  </div>
                  <div className="text-right">
                    <h3
                      className="text-xs md:text-sm font-serif text-warm-wood leading-tight"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(6px)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        fontWeight: '700'
                      }}
                    >
                      Contatti e Indirizzo
                    </h3>
                  </div>
                </div>
                <div className="flex min-w-0 items-center justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-warm-orange flex-shrink-0" />
                  <span className="min-w-0 break-all text-right text-xs text-warm-wood-dark font-medium leading-tight">
                    {displayContactEmail}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-warm-orange flex-shrink-0" />
                  <span className="text-xs text-warm-wood-dark font-medium leading-tight">{displayContactPhone}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-warm-orange flex-shrink-0" />
                  <span className="text-xs text-warm-wood-dark font-bold leading-tight" style={{ fontWeight: '700' }}>{displayContactAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
