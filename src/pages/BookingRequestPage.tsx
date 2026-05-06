import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BookingRequestForm } from '@/features/booking/components/BookingRequestForm'
import { UtensilsCrossed, MapPin, Clock, Phone, Mail } from 'lucide-react'
import { useBusinessHours } from '@/hooks/useBusinessHours'
import { useRestaurantName } from '@/hooks/useRestaurantName'
import { formatHours, getDefaultBusinessHours } from '@/lib/businessHours'
import { useTenantContext } from '@/contexts/TenantContext'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'

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

  // Set a deterministic background (no missing local assets)
  useEffect(() => {
    if (isTenantLoading || !tenantId) return

    document.documentElement.style.backgroundImage = 'linear-gradient(135deg, #2d2013 0%, #5a3c24 45%, #8b5f3c 100%)';
    document.documentElement.style.backgroundSize = 'cover';
    document.documentElement.style.backgroundPosition = 'center';
    document.documentElement.style.backgroundRepeat = 'no-repeat';
    document.documentElement.style.backgroundAttachment = 'fixed';

    return () => {
      document.documentElement.style.backgroundImage = '';
      document.documentElement.style.backgroundSize = '';
      document.documentElement.style.backgroundPosition = '';
      document.documentElement.style.backgroundRepeat = '';
      document.documentElement.style.backgroundAttachment = '';
    };
  }, [isTenantLoading, tenantId]);

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
    <div className="min-h-screen relative font-bold">
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
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">

          {/* Header semi-trasparente in alto */}
          <div className="pt-2 md:pt-3 pb-2">
            <div
              className="rounded-lg shadow-md px-4 py-2 md:px-8 md:py-2 animate-fade-in"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                {/* In alto: Nome ristorante con icona */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-warm-cream shadow-md">
                    <UtensilsCrossed className="w-3 h-3 md:w-3.5 md:h-3.5 text-warm-wood" />
                  </div>
                  <h1
                    className="text-2xl md:text-3xl font-serif text-warm-wood"
                    style={{ fontWeight: '700' }}
                  >
                    {displayName}
                  </h1>
                </div>

                {/* Sotto: Richiesta Prenotazione Tavolo */}
                <div className="flex items-center justify-center">
                  <h2
                    className="text-xl md:text-2xl font-serif text-warm-wood"
                    style={{ fontWeight: '700' }}
                  >
                    Richiesta Prenotazione Tavolo
                  </h2>
                </div>

                {/* Nota esplicativa */}
                <p
                  className="text-sm md:text-base text-warm-wood-dark leading-relaxed max-w-3xl md:max-w-4xl px-3 md:px-8 opacity-90"
                  style={{ fontWeight: 700 }}
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
            className="rounded-2xl shadow-xl px-6 md:px-8 py-6 md:py-8 animate-fade-in"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="grid grid-cols-2 gap-6 items-start">
              {/* Colonna 1: Orari */}
              <div className="space-y-3 justify-self-start text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3
                      className="text-lg md:text-xl font-serif text-warm-wood"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(6px)',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        display: 'inline-block',
                        fontWeight: '700'
                      }}
                    >
                      Orari
                    </h3>
                  </div>
                </div>
                <div className="space-y-1">
                  {isLoading ? (
                    <div className="font-medium text-base text-warm-wood-dark ml-8">Caricamento orari...</div>
                  ) : (
                    dayOrder.map((day) => {
                      const dayHours = hours[day]
                      const isOpen = !!dayHours && dayHours.length > 0
                      return (
                        <div key={day} className="font-medium text-base text-warm-wood-dark ml-8">
                          {formatDayName(day)}: {isOpen ? formatHours(dayHours) : 'Chiuso'}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Colonna 2: Contatti */}
              <div className="space-y-3 justify-self-end text-right">
                <div className="flex items-center justify-end gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-terracotta to-warm-orange shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <h3
                      className="text-lg md:text-xl font-serif text-warm-wood"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(6px)',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        display: 'inline-block',
                        fontWeight: '700'
                      }}
                    >
                      Contatti e Indirizzo
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Mail className="w-5 h-5 text-warm-orange flex-shrink-0" />
                  <span className="text-base text-warm-wood-dark font-medium">{displayContactEmail}</span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Phone className="w-5 h-5 text-warm-orange flex-shrink-0" />
                  <span className="text-base text-warm-wood-dark font-medium">{displayContactPhone}</span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <MapPin className="w-5 h-5 text-warm-orange flex-shrink-0" />
                  <span className="text-base text-warm-wood-dark font-bold" style={{ fontWeight: '700' }}>{displayContactAddress}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
