import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookingRequestForm } from '@/features/booking/components/BookingRequestForm'
import { BookingSummarySidebar } from '@/features/booking/components/publicBooking/BookingSummarySidebar'
import { BookingStickyBar } from '@/features/booking/components/publicBooking/BookingStickyBar'
import { BookingPhotoStrip } from '@/features/booking/components/publicBooking/BookingPhotoStrip'
import { MapPin, Clock, Phone, Mail, ChevronDown, Send } from 'lucide-react'
import { useBusinessHours } from '@/hooks/useBusinessHours'
import { useRestaurantName } from '@/hooks/useRestaurantName'
import { formatHours, getDefaultBusinessHours } from '@/lib/businessHours'
import { useTenantContext } from '@/contexts/TenantContext'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'
import { cn } from '@/lib/utils'
import {
  BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
  DEFAULT_BOOKING_PAGE_BACKGROUND,
  bookingFullPageBackgroundPublicHref,
  bookingPageGradientCss,
  bookingPageTilePublicHref,
  isBookingFullPageBackgroundId,
  isBookingPageGradientId,
  type BookingPageBackgroundId,
} from '@/features/booking/constants/bookingPageBackground'
import {
  DEFAULT_BOOKING_FORM_CONFIG,
  getBookingHeaderTextStyle,
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
  const { data: stripPhotoId } = useRestaurantSetting('public_booking_strip_photo')
  const { data: formConfig } = useRestaurantSetting('booking_public_form_config')
  const resolvedConfig = formConfig ?? DEFAULT_BOOKING_FORM_CONFIG
  const headerStyles = resolvedConfig.header_styles ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles

  // Stato form condiviso tra BookingRequestForm e BookingSummarySidebar
  const [sharedFormData, setSharedFormData] = useState<Partial<BookingRequestInput>>({})
  const [activeSubTab, setActiveSubTab] = useState<SubTab | null>(null)
  // Stato disabled del pulsante submit (sincronizzato da BookingRequestForm)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  // Visibilità del riepilogo nella viewport (per sticky bar mobile)
  const [isSummaryVisible, setIsSummaryVisible] = useState(false)

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
  const showPhotoStrip = stripPhotoId != null
  // Quando la striscia laterale è attiva, il resto della pagina deve restare uniforme
  // chiaro (crema/avorio): l'immagine full-page o legacy viene applicata SOLO senza striscia.
  const STRIP_MODE_PAGE_BG = '#faf7f1'
  const fullPagePhotoId = !showPhotoStrip && isBookingFullPageBackgroundId(bookingPageBackground)
    ? bookingPageBackground
    : null
  const legacyTileId = !showPhotoStrip && !isBookingFullPageBackgroundId(bookingPageBackground) && !isBookingPageGradientId(bookingPageBackground)
    ? bookingPageBackground
    : null
  const isFullPagePhoto = fullPagePhotoId != null
  const fullPagePhotoLandscapeUrl = fullPagePhotoId
    ? bookingFullPageBackgroundPublicHref(fullPagePhotoId, import.meta.env.BASE_URL, 'landscape')
    : null
  const fullPagePhotoPortraitUrl = fullPagePhotoId
    ? bookingFullPageBackgroundPublicHref(fullPagePhotoId, import.meta.env.BASE_URL, 'portrait')
    : null
  // Foto full-page: applicate come `background-image` su un wrapper interno che cambia
  // url via media query (vedi sotto). Quando la foto è attiva, il root NON imposta
  // backgroundColor scuro: serve un fondo crema chiaro come fallback se la foto tarda
  // a caricare (un marrone scuro produrrebbe l'effetto "tutto buio" segnalato).
  const FULL_PAGE_FALLBACK_BG = STRIP_MODE_PAGE_BG
  // Colore di fallback sul root (primo paint + bordi footer). Tile/gradiente su layer
  // `absolute` che segue l'altezza del documento — NON `fixed` (sfondo deve scrollare col contenuto).
  const pageRootFallbackStyle: React.CSSProperties = showPhotoStrip
    ? { backgroundColor: STRIP_MODE_PAGE_BG }
    : isFullPagePhoto
      ? { backgroundColor: FULL_PAGE_FALLBACK_BG }
      : { backgroundColor: BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR }

  const scrollablePageBackgroundStyle: React.CSSProperties | null =
    !showPhotoStrip && !isFullPagePhoto
      ? isBookingPageGradientId(bookingPageBackground)
        ? {
            backgroundColor: BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
            backgroundImage: bookingPageGradientCss(bookingPageBackground),
            // `100% 100%` sul layer alto quanto il documento evita ricalcoli `cover` vs viewport in scroll.
            backgroundSize: '100% 100%',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
          }
        : legacyTileId
          ? {
              backgroundColor: BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
              backgroundImage: `url("${bookingPageTilePublicHref(legacyTileId, import.meta.env.BASE_URL)}")`,
              backgroundSize: '100% auto',
              backgroundPosition: 'top center',
              backgroundRepeat: 'repeat-y',
            }
          : null
      : null

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
    <div className="min-h-screen font-bold relative isolate" style={pageRootFallbackStyle}>
      {scrollablePageBackgroundStyle && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={scrollablePageBackgroundStyle}
        />
      )}
      {/*
        Foto full-page in due varianti (responsive):
        - portrait (9:16) per viewport mobile <768px
        - landscape (16:9) per viewport ≥768px
        Stacking: root con `relative isolate` crea uno stacking context locale.
        Le foto sono `z-0` (sotto), il wrapper contenuto è `relative z-10` (sopra).
      */}
      {isFullPagePhoto && fullPagePhotoPortraitUrl && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 md:hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${fullPagePhotoPortraitUrl}")` }}
        />
      )}
      {isFullPagePhoto && fullPagePhotoLandscapeUrl && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 hidden md:block bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${fullPagePhotoLandscapeUrl}")` }}
        />
      )}
      {/*
        Layout pagina Prenota — flex colonna:
        1. Griglia [striscia foto sx | contenuto form dx] — flex-1 si espande con il form
        2. Footer Orari+Contatti — larghezza piena pagina, copre anche la zona striscia foto
        La striscia foto è sticky top-0 h-screen: rimane visibile durante tutto lo scroll.
        Le foto si ripetono internamente per coprire form lunghi (es. 10 categorie ingredienti).
      */}
      <div className="min-h-screen flex flex-col relative z-10 w-full">

        {/* Griglia [striscia foto | form] — full viewport: la foto resta ancorata al bordo sinistro.
            Mobile/tablet: striscia 20vw. Desktop ≥900px: striscia 25vw. */}
        <div
          className={cn(
            'flex-1 w-full grid grid-cols-1 items-start',
            showPhotoStrip && 'grid-cols-[20vw_1fr] min-[900px]:grid-cols-[25vw_1fr]',
          )}
        >

          {/*
            Striscia foto laterale sinistra.
            sticky top-0 h-screen: rimane ancorata in cima mentre il form scorre.
            Le foto si ripetono per coprire qualsiasi lunghezza di form.
            Per cambiare larghezza: modificare i valori 20vw/25vw in grid-cols sopra.
            Non aggiungere mx-auto/max-w-* a questa griglia: staccherebbe la foto dal bordo sinistro desktop.
          */}
          {showPhotoStrip && (
            <BookingPhotoStrip
              selectedPhotoId={stripPhotoId}
              viteBase={import.meta.env.BASE_URL}
            />
          )}

          {/* Colonna contenuto destra
              Padding laterale: mobile px-6 (più sfondo foto ai lati), tablet md:px-10,
              desktop ≥900px px-6 / lg:px-8 invariati (già OK con larghezza maggiore). */}
          <div className="w-full min-w-0 px-6 md:px-10 min-[900px]:px-6 lg:px-8">

            {/* Header — allineamento controllato da header_styles.textAlign per ogni elemento */}
            <div className="flex w-full flex-col gap-1.5 py-1.5 animate-fade-in -mx-6 md:-mx-10 min-[900px]:-mx-6 lg:-mx-8">
              <h1
                className="font-bold m-0 w-full px-2"
                style={getBookingHeaderTextStyle('restaurant_name', headerStyles)}
              >
                {displayName}
              </h1>
              <div className="flex w-full flex-col gap-1.5 px-2">
                <h2
                  className="font-bold m-0 w-full"
                  style={getBookingHeaderTextStyle('page_title', headerStyles)}
                >
                  {resolvedConfig.page_title}
                </h2>
                <p
                  className="opacity-90 font-bold m-0 w-full"
                  style={getBookingHeaderTextStyle('page_description', headerStyles)}
                >
                  {resolvedConfig.page_description}
                </p>
              </div>
            </div>

            <BookingRequestForm
              tenantSlug={tenantSlug}
              formConfig={resolvedConfig}
              publicFormLightTextOnDarkBackground={!showPhotoStrip && isFullPagePhoto}
              onFormDataChange={setSharedFormData}
              onActiveSubTabChange={setActiveSubTab}
              onIsDisabledChange={setIsSubmitDisabled}
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
                  onVisibilityChange={setIsSummaryVisible}
                  submitButton={
                    <button
                      type="submit"
                      form="booking-request-form"
                      disabled={isSubmitDisabled}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 text-sm font-bold text-white rounded-full bg-green-600 hover:bg-green-700 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide transition-colors duration-200"
                    >
                      <Send className="h-4 w-4" />
                      Invia Prenotazione
                    </button>
                  }
                />
              }
            />

            {/* Sticky bar mobile — visibile quando il riepilogo è fuori dalla viewport */}
            <BookingStickyBar
              formData={{
                client_name: sharedFormData.client_name,
                desired_date: sharedFormData.desired_date,
                desired_time: sharedFormData.desired_time,
                num_guests: sharedFormData.num_guests ?? 0,
                booking_type: sharedFormData.booking_type,
              }}
              modes={resolvedConfig.booking_modes}
              totalBooking={sharedFormData.menu_total_booking}
              isSubmitDisabled={isSubmitDisabled}
              visible={!isSummaryVisible}
              activeSubTab={activeSubTab}
              summaryContent={
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

          {/* Spacer: riserva spazio per sticky bar (<1256px) + gap uniforme prima del footer. */}
          <div className="h-20 min-[1256px]:h-4" aria-hidden />

          </div>{/* fine colonna contenuto destra */}
        </div>{/* fine griglia [striscia foto | contenuto] */}

        {/* Footer Orari+Contatti — fuori dalla griglia, a tutta larghezza viewport */}
        <div className="w-full px-0">
          <div className="rounded-none shadow-xl px-6 md:px-10 bg-white border-t border-slate-100 py-5 md:py-7 mt-0 animate-fade-in">

            {/* Layout desktop/tablet (≥480px): 2 colonne Orari | Contatti */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:gap-x-10 items-start max-[480px]:hidden">

              <div className="min-w-0 w-full space-y-2 text-left pr-1.5">
                <div className="flex items-center gap-2 mb-2" style={{ paddingLeft: hoursInset }}>
                  <div className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center bg-linear-to-br from-terracotta to-warm-orange shadow-md">
                    <Clock className="w-[18px] h-[18px] text-white" />
                  </div>
                  <h3 className="text-sm md:text-base font-serif text-warm-wood leading-tight font-bold">
                    Orari
                  </h3>
                </div>
                <div
                  className="flex flex-wrap items-start gap-y-0.5 leading-snug"
                  style={{ paddingLeft: hoursInset, columnGap: 'clamp(1.2rem, 6.4vw, 3.2rem)' }}
                >
                  {isLoading ? (
                    <div className="w-full font-medium text-sm text-warm-wood-dark">
                      Caricamento orari...
                    </div>
                  ) : (
                    openingHoursColumns.map((columnDays, colIdx) => (
                      <div key={colIdx} className="shrink-0 space-y-0.5">
                        {columnDays.map((day) => {
                          const dayHours = hours[day]
                          const isOpen = !!dayHours && dayHours.length > 0
                          return (
                            <div key={day} className="font-medium text-sm text-warm-wood-dark leading-snug">
                              {formatDayName(day)}: {isOpen ? formatHours(dayHours) : 'Chiuso'}
                            </div>
                          )
                        })}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="min-w-0 space-y-1 justify-self-end text-right" style={{ paddingRight: hoursInset }}>
                <div className="flex items-center justify-end gap-2 mb-2">
                  <div className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center bg-linear-to-br from-terracotta to-warm-orange shadow-md">
                    <MapPin className="w-[18px] h-[18px] text-white" />
                  </div>
                  <h3 className="text-sm md:text-base font-serif text-warm-wood leading-tight font-bold">
                    Contatti e Indirizzo
                  </h3>
                </div>
                {displayContactEmail && (
                  <div className="flex min-w-0 items-center justify-end gap-2">
                    <Mail className="w-4 h-4 text-warm-orange shrink-0" />
                    <span className="min-w-0 break-all text-right text-sm text-warm-wood-dark font-medium leading-snug">
                      {displayContactEmail}
                    </span>
                  </div>
                )}
                {displayContactPhone && (
                  <div className="flex items-center justify-end gap-2">
                    <Phone className="w-4 h-4 text-warm-orange shrink-0" />
                    <span className="text-sm text-warm-wood-dark font-medium leading-snug">{displayContactPhone}</span>
                  </div>
                )}
                {displayContactAddress && (
                  <div className="flex items-center justify-end gap-2">
                    <MapPin className="w-4 h-4 text-warm-orange shrink-0" />
                    <span className="text-sm text-warm-wood-dark font-bold leading-snug">{displayContactAddress}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Layout mobile (<480px): accordion Orari / Contatti */}
            <div className="hidden max-[480px]:block space-y-2">
              <div className="rounded-xl bg-white border border-slate-100">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2"
                  onClick={() => setMobileInfoOpen('hours')}
                  aria-expanded={mobileInfoOpen === 'hours'}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-linear-to-br from-terracotta to-warm-orange shadow-md">
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
                    <div className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-linear-to-br from-terracotta to-warm-orange shadow-md">
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
        </div>{/* fine footer */}

      </div>
    </div>
  )
}
