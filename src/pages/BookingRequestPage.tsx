import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookingRequestForm } from '@/features/booking/components/BookingRequestForm'
import { BookingSummarySidebar } from '@/features/booking/components/publicBooking/BookingSummarySidebar'
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
import {
  DEFAULT_BOOKING_FORM_CONFIG,
  getBookingHeaderFontFamily,
  type SubTab,
} from '@/features/booking/constants/bookingPublicFormConfig'
import type { BookingRequestInput } from '@/types/booking'

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
  const { data: publicBookingBg } = useRestaurantSetting('public_booking_page_background')
  const { data: formConfig } = useRestaurantSetting('booking_public_form_config')
  const resolvedConfig = formConfig ?? DEFAULT_BOOKING_FORM_CONFIG
  const headerStyles = resolvedConfig.header_styles ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles

  // Stato form condiviso tra BookingRequestForm e BookingSummarySidebar
  const [sharedFormData, setSharedFormData] = useState<Partial<BookingRequestInput>>({})
  const [activeSubTab, setActiveSubTab] = useState<SubTab | null>(null)

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
  const bookingPageBackground: BookingPageBackgroundId =
    publicBookingBg ?? DEFAULT_BOOKING_PAGE_BACKGROUND
  const bookingPageBackgroundStyle: React.CSSProperties = isBookingPageGradientId(bookingPageBackground)
    ? {
        backgroundColor: BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
        backgroundImage: bookingPageGradientCss(bookingPageBackground),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        backgroundColor: BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
        backgroundImage: `url("${bookingPageTilePublicHref(bookingPageBackground, import.meta.env.BASE_URL)}")`,
        backgroundSize: '100% auto',
        backgroundPosition: 'top center',
        backgroundRepeat: 'repeat-y',
      }

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
    <div className="min-h-screen font-bold" style={bookingPageBackgroundStyle}>
      <div className="min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 pb-1.5">

          {/* Header — solo testo sullo sfondo pagina */}
          <div className="flex flex-col items-center justify-center gap-1.5 py-1.5 text-center animate-fade-in">
            <h1
              className="font-bold leading-tight m-0"
              style={{
                fontSize: 'clamp(1.4rem, 3.733vw, 1.8rem)',
                fontFamily: getBookingHeaderFontFamily(headerStyles.restaurant_name.font),
                color: headerStyles.restaurant_name.color,
              }}
            >
              {displayName}
            </h1>
            <h2
              className="font-bold leading-tight m-0"
              style={{
                fontSize: 'clamp(1.4rem, 3.733vw, 1.8rem)',
                fontFamily: getBookingHeaderFontFamily(headerStyles.page_title.font),
                color: headerStyles.page_title.color,
              }}
            >
              {resolvedConfig.page_title}
            </h2>
            <p
              className="opacity-90 font-bold text-[0.917rem] leading-[1.42] m-0 px-1.5 max-w-[42rem]"
              style={{
                fontFamily: getBookingHeaderFontFamily(headerStyles.page_description.font),
                color: headerStyles.page_description.color,
              }}
            >
              {resolvedConfig.page_description}
            </p>
          </div>

          <BookingRequestForm
            tenantSlug={tenantSlug}
            formConfig={resolvedConfig}
            onFormDataChange={setSharedFormData}
            onActiveSubTabChange={setActiveSubTab}
            summarySidebar={
              <BookingSummarySidebar
                formData={{
                  desired_date: sharedFormData.desired_date,
                  desired_time: sharedFormData.desired_time,
                  num_guests: sharedFormData.num_guests ?? 0,
                  booking_type: sharedFormData.booking_type,
                  menu_selection: sharedFormData.menu_selection,
                  menu_total_per_person: sharedFormData.menu_total_per_person,
                  menu_total_booking: sharedFormData.menu_total_booking,
                  preset_menu: sharedFormData.preset_menu,
                }}
                modes={resolvedConfig.booking_modes}
                contactPhone={displayContactPhone || undefined}
                activeSubTab={activeSubTab}
              />
            }
          />

          {/* Footer orari + contatti */}
          <div className="rounded-2xl shadow-xl px-3 md:px-5 bg-white border border-slate-100 pt-[clamp(0.4rem,1.2vw,0.7rem)] pb-[clamp(0.5rem,1.6vmin,0.9rem)] mt-[clamp(2rem,6vmin,3.5rem)] animate-fade-in">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 md:gap-x-4 items-start max-[480px]:hidden">

              <div className="min-w-0 w-full space-y-1 text-left pr-1.5">
                <div className="flex items-center gap-1.5 mb-1" style={{ paddingLeft: hoursInset }}>
                  <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-md">
                    <Clock className="w-[14px] h-[14px] text-white" />
                  </div>
                  <h3 className="text-xs md:text-sm font-serif text-warm-wood leading-tight font-bold">
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
                  <h3 className="text-xs md:text-sm font-serif text-warm-wood leading-tight font-bold">
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
              <div className="rounded-xl bg-white border border-slate-100">
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
                    <h3 className="text-xs font-serif text-warm-wood leading-tight font-bold">
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

              <div className="rounded-xl bg-white border border-slate-100">
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
                    <h3 className="text-xs font-serif text-warm-wood leading-tight font-bold">
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
