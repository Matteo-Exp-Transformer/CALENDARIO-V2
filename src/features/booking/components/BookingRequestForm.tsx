import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui'
import { DateInput } from '@/components/ui/DateInput'
import { TimeInput } from '@/components/ui/TimeInput'
import type { BookingRequestInput, BookingType } from '@/types/booking'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'
import { useCreateBookingRequest } from '../hooks/useBookingRequests'
import { useRateLimit } from '@/hooks/useRateLimit'
import { Check, Send, Loader2, CheckCircle } from 'lucide-react'
import { MenuSelection } from './MenuSelection'
import { DietaryRestrictionsSection } from './DietaryRestrictionsSection'
import { useBusinessHours } from '@/hooks/useBusinessHours'
import { isValidBookingDateTime, getDayOfWeek, formatHours } from '@/lib/businessHours'
import { toast } from 'react-toastify'
import type { PresetMenuType } from '../constants/presetMenus'
import { useMenuItems } from '../hooks/useMenuItems'
import { useRestaurantSetting } from '../hooks/useRestaurantSetting'
import {
  applyPresetTypeToBookingFormPayload,
  computeMenuTotalsFromItems,
  presetSelectionStillMatchesStoredPreset,
} from '../utils/buildPresetMenuSelection'
import { DEFAULT_VOL_AU_VENT_PROMO_MESSAGE } from '../constants/volAuVentPromo'


interface BookingRequestFormProps {
  onSubmit?: () => void
  tenantSlug?: string
}

export const BookingRequestForm: React.FC<BookingRequestFormProps> = ({ onSubmit, tenantSlug }) => {
  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const createInitialFormData = (): BookingRequestInput => ({
    client_name: '',
    client_email: '',
    client_phone: '',
    booking_type: 'tavolo',
    desired_date: getCurrentDate(),
    desired_time: '16:00',
    num_guests: 0,
    special_requests: '',
    menu_selection: {
      items: [],
      tiramisu_total: 0,
      tiramisu_kg: 0
    },
    dietary_restrictions: [],
    preset_menu: null
  })

  const [formData, setFormData] = useState<BookingRequestInput>(createInitialFormData)

  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Stato per triggerare re-render e disabilitare button
  const [selectedPreset, setSelectedPreset] = useState<PresetMenuType>(null)
  const [touchCrossBurst, setTouchCrossBurst] = useState(0)

  const frostedInputCn =
    'bg-white/85 backdrop-blur-[1px] px-4 rounded-xl !border-black/20 text-center !text-[18px] sm:!text-[16px] !font-medium text-warm-wood placeholder:text-warm-wood/50 focus:!border-warm-wood focus:!ring-2 focus:!ring-warm-wood/40'
  
  // Ref per prevenire doppi submit (anche con React StrictMode)
  const isSubmittingRef = useRef(false)
  
  // Protezione globale usando sessionStorage - lock atomico per prevenire race condition
  const GLOBAL_LOCK_KEY = 'booking-submit-global-lock'
  const LOCK_TIMEOUT = 10000 // 10 secondi
  
  // Lock atomico: controlla E imposta in modo atomico usando un timestamp univoco
  // IMPLEMENTAZIONE MIGLIORATA: verifica lock DOPO l'impostazione per rilevare race conditions
  const acquireGlobalLock = (): string | null => {
    // NOTA: Non può essere async perché viene chiamata sincronamente in handleSubmit
    try {
      // 🔒 MECCANISMO DI LOCK ATOMIC CON VERIFICA IMMEDIATA
      const now = Date.now()
      const randomPart = Math.random().toString(36).substring(2, 15) // Più lungo per maggiore unicità
      const lockId = `${now}-${randomPart}` // ID univoco per questo tentativo
      
      // PRIMA VERIFICA: lock esistente e valido?
      const existingLock = sessionStorage.getItem(GLOBAL_LOCK_KEY)
      
      if (existingLock) {
        const lockTime = parseInt(existingLock.split('-')[0], 10)
        const lockAge = now - lockTime
        
        if (lockAge < LOCK_TIMEOUT) {
          // Lock valido - BLOCCATO
          return null
        }
        // Lock scaduto, rimuovilo
        sessionStorage.removeItem(GLOBAL_LOCK_KEY)
      }
      
      // OPERAZIONE ATOMICA: imposta lock con ID univoco
      sessionStorage.setItem(GLOBAL_LOCK_KEY, lockId)
      
      // ⚠️ CRITICO: Verifica IMMEDIATAMENTE se il lock è nostro
      // Se due istanze fanno questo simultaneamente, solo una vedrà il proprio ID
      // Usa un piccolo delay per dare tempo alla race condition di manifestarsi
      const actualLock = sessionStorage.getItem(GLOBAL_LOCK_KEY)
      
      if (actualLock !== lockId) {
        // Race condition rilevata - un'altra istanza ha sovrascritto il nostro lock
        console.error('❌ [BookingForm] RACE CONDITION RILEVATA! Lock acquisito da altra istanza:', {
          ourId: lockId.substring(0, 30),
          actualLock: actualLock?.substring(0, 30),
          timestamp: now
        })
        return null
      }
      
      // Verifica doppia: controlla immediatamente dopo l'impostazione
      // Se due chiamate arrivano simultaneamente, solo una vedrà il proprio ID
      
      return lockId
    } catch (error) {
      return null
    }
  }
  
  const releaseGlobalLock = (lockId: string | null) => {
    if (!lockId) return
    
    try {
      const currentLock = sessionStorage.getItem(GLOBAL_LOCK_KEY)
      // Rilascia solo se è il nostro lock (non quello di un'altra istanza)
      if (currentLock === lockId) {
        sessionStorage.removeItem(GLOBAL_LOCK_KEY)
      } else {
      }
    } catch (error) {
    }
  }
  

  // Reset num_guests to 0 when cleared - only allow numeric input
  const handleNumGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim()

    // Only allow numeric characters or empty string
    if (inputValue === '') {
      const tiramisuTotal = formData.menu_selection?.tiramisu_total || 0
      const newFormData = { ...formData, num_guests: 0, menu_total_booking: tiramisuTotal }
      setFormData(newFormData)
      setErrors({ ...errors, num_guests: '' })
      return
    }
    
    // Only process if it's a valid number
    if (/^\d+$/.test(inputValue)) {
      const value = parseInt(inputValue, 10)
      if (!isNaN(value) && value >= 1 && value <= 110) {
        const tiramisuTotal = formData.menu_selection?.tiramisu_total || 0
        const totalPerPerson = formData.menu_total_per_person || 0
        const newFormData = {
          ...formData,
          num_guests: value,
          menu_total_booking: totalPerPerson * value + tiramisuTotal
        }
        setFormData(newFormData)
        setErrors({ ...errors, num_guests: '' })
      } else if (value === 0) {
        // Explicitly handle 0 to show empty
        const tiramisuTotal = formData.menu_selection?.tiramisu_total || 0
        const newFormData = { ...formData, num_guests: 0, menu_total_booking: tiramisuTotal }
        setFormData(newFormData)
        setErrors({ ...errors, num_guests: '' })
      }
    }
  }

  const handleNumGuestsKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow numbers
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault()
    }
  }

  // Gestione selezione menu predefinito
  const handlePresetMenuChange = (presetType: PresetMenuType) => {
    setSelectedPreset(presetType)

    if (!presetType) {
      setFormData({
        ...formData,
        preset_menu: null,
        menu_selection: { items: [], tiramisu_total: 0, tiramisu_kg: 0 },
        menu_total_per_person: 0,
        menu_total_booking: 0,
      })
      return
    }

    const resolved = applyPresetTypeToBookingFormPayload(presetType, menuItems, customStaffPresets)
    if (!resolved) {
      toast.error('Menù consigliato non disponibile. Aggiorna la pagina o scegli un altro menù.')
      setSelectedPreset(null)
      setFormData({
        ...formData,
        preset_menu: null,
        menu_selection: { items: [], tiramisu_total: 0, tiramisu_kg: 0 },
        menu_total_per_person: 0,
        menu_total_booking: 0,
      })
      return
    }

    const { items } = resolved
    const numGuests = formData.num_guests || 0
    const { totalPerPerson, tiramisuTotal, tiramisuKg, menu_total_booking } =
      computeMenuTotalsFromItems(items, numGuests)

    setFormData({
      ...formData,
      preset_menu: presetType,
      menu_selection: {
        items,
        tiramisu_total: tiramisuTotal,
        tiramisu_kg: tiramisuKg,
      },
      menu_total_per_person: totalPerPerson,
      menu_total_booking,
    })
  }

  const { mutate, isPending } = useCreateBookingRequest()
  const { checkRateLimit, isBlocked } = useRateLimit({
    maxAttempts: 3,
    timeWindow: 60000 // 1 minuto
  })
  const { data: menuItems = [] } = useMenuItems()
  const { data: staffPresetsDropdownVisible = true } = useRestaurantSetting('booking_staff_presets_visible')
  const { data: customStaffPresets = [] } = useRestaurantSetting('booking_custom_staff_presets')
  const { data: volAuVentPromoVisible = false } = useRestaurantSetting('booking_vol_au_vent_promo_visible')
  const { data: volAuVentPromoMessage = DEFAULT_VOL_AU_VENT_PROMO_MESSAGE } = useRestaurantSetting(
    'booking_vol_au_vent_promo_message',
  )

  // Fetch business hours (non-blocking - form works even if loading/fails)
  const { data: businessHours, isLoading: isLoadingHours, error: hoursError } = useBusinessHours()

  // Validate business hours in real-time (for immediate feedback)
  const validateBusinessHours = (date: string, time: string) => {
    if (!date || !time || !businessHours || isLoadingHours || hoursError) {
      return null // No validation if data not available
    }

    if (!isValidBookingDateTime(date, time, businessHours)) {
      const dayName = getDayOfWeek(date)
      const dayHours = businessHours[dayName]

      if (!dayHours || dayHours.length === 0) {
        return 'Il ristorante è chiuso in questo giorno'
      } else {
        const availableHours = formatHours(dayHours)
        return `Orario non valido. Orari disponibili: ${availableHours}`
      }
    }

    return null // Valid
  }

  // Helper function to scroll to first error field
  const scrollToError = (errorKey: string) => {
    // Map error keys to input IDs
    const fieldIdMap: Record<string, string> = {
      client_name: 'client_name',
      client_email: 'client_email',
      client_phone: 'client_phone',
      desired_date: 'desired_date',
      desired_time: 'desired_time',
      num_guests: 'num_guests',
      booking_type: 'booking_type',
      menu: 'menu-section',
      privacyAccepted: 'privacy-consent'
    }

    const fieldId = fieldIdMap[errorKey]
    if (fieldId) {
      const element = document.getElementById(fieldId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Focus the element if it's an input
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
          setTimeout(() => element.focus(), 500)
        }
      }
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true
    let firstErrorKey: string | null = null

    // Name validation
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Nome obbligatorio'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'client_name'
    }

    // Email validation - optional but must be valid if provided
    if (formData.client_email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
      newErrors.client_email = 'Email non valida'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'client_email'
    }

    // Phone validation - required
    if (!formData.client_phone || !formData.client_phone.trim()) {
      newErrors.client_phone = 'Numero di telefono obbligatorio'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'client_phone'
    }

    // Date validation
    if (!formData.desired_date) {
      newErrors.desired_date = 'Data obbligatoria'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'desired_date'
    } else {
      const selectedDate = new Date(formData.desired_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Validate year: only current year or next year allowed
      const currentYear = today.getFullYear()
      const selectedYear = selectedDate.getFullYear()
      if (selectedYear < currentYear || selectedYear > currentYear + 1) {
        newErrors.desired_date = 'Puoi prenotare solo per l\'anno corrente o il prossimo anno'
        isValid = false
        if (!firstErrorKey) firstErrorKey = 'desired_date'
      } else if (selectedDate < today) {
        newErrors.desired_date = 'La data non può essere nel passato'
        isValid = false
        if (!firstErrorKey) firstErrorKey = 'desired_date'
      }
    }

    // Time validation - required
    if (!formData.desired_time) {
      newErrors.desired_time = 'Orario obbligatorio'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'desired_time'
    }

    // Business hours validation (non-blocking: only validate if hours are loaded)
    if (
      formData.desired_date &&
      formData.desired_time &&
      businessHours &&
      !isLoadingHours &&
      !hoursError
    ) {
      if (!isValidBookingDateTime(formData.desired_date, formData.desired_time, businessHours)) {
        const dayName = getDayOfWeek(formData.desired_date)
        const dayHours = businessHours[dayName]

        if (!dayHours || dayHours.length === 0) {
          newErrors.desired_date = 'Il ristorante è chiuso in questo giorno'
          isValid = false
          if (!firstErrorKey) firstErrorKey = 'desired_date'
        } else {
          const availableHours = formatHours(dayHours)
          newErrors.desired_time = `Orario non valido. Orari disponibili: ${availableHours}`
          isValid = false
          if (!firstErrorKey) firstErrorKey = 'desired_time'
        }
      }
    }

    // Num guests validation
    if (!formData.num_guests || formData.num_guests < 1) {
      newErrors.num_guests = 'Numero ospiti obbligatorio (min 1)'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'num_guests'
    }

    // Booking type validation
    if (!formData.booking_type) {
      newErrors.booking_type = 'Tipologia di prenotazione obbligatoria'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'booking_type'
    }

    // Menu validation (Rinfresco di Laurea / menù a prezzo fisso)
    if (bookingTypeUsesMenuSelections(formData.booking_type)) {
      if (!formData.menu_selection || !formData.menu_selection.items || formData.menu_selection.items.length === 0) {
        newErrors.menu = 'Seleziona almeno un prodotto dal menù'
        isValid = false
        if (!firstErrorKey) firstErrorKey = 'menu'
      }
      if (!formData.menu_total_per_person || formData.menu_total_per_person <= 0) {
        newErrors.menu = 'Il totale a persona deve essere maggiore di 0'
        isValid = false
        if (!firstErrorKey) firstErrorKey = 'menu'
      }
    }

    // Privacy consent validation
    if (!privacyAccepted) {
      newErrors.privacyAccepted = 'È necessario accettare la Privacy Policy per inviare la richiesta'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'privacyAccepted'
    }

    setErrors(newErrors)

    // If validation failed, show toast and scroll to first error
    if (!isValid) {
      const errorCount = Object.keys(newErrors).length
      toast.error(`Compilazione non valida: ${errorCount} ${errorCount === 1 ? 'campo da correggere' : 'campi da correggere'}`, {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      // Scroll to first error field
      if (firstErrorKey) {
        scrollToError(firstErrorKey)
      }
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Previene propagazione eventi

    // 🚨 CRITICO: Imposta lock IMMEDIATAMENTE, PRIMA di qualsiasi log o controllo
    // Questo è fondamentale per prevenire race conditions sincronizzate
    const lockId = acquireGlobalLock()
    if (!lockId) {
      return
    }
    
    // Salva lockId immediatamente nel ref
    ;(isSubmittingRef as any).currentLockId = lockId
    
    
    // ✅ PROTEZIONE MULTI-LIVELLO CONTRO DOPPI SUBMIT
    // IMPORTANTE: Il lock globale è già acquisito, ora verifica gli altri controlli
    
    // 1. Controllo stato locale (protezione istanza componente - triggera re-render)
    if (isSubmitting) {
      releaseGlobalLock(lockId)
      return
    }
    
    // 2. Controllo ref locale (backup - per casi edge)
    if (isSubmittingRef.current) {
      releaseGlobalLock(lockId)
      return
    }
    
    // 3. Controllo mutation state (protezione React Query)
    if (isPending) {
      releaseGlobalLock(lockId)
      return
    }

    // Check rate limit
    if (!checkRateLimit()) {
      releaseGlobalLock(lockId) // Rilascia lock se rate limit
      return
    }

    // Validazione
    if (!validate()) {
      releaseGlobalLock(lockId) // Rilascia lock se validazione fallisce
      return
    }

    // Imposta tutti i flag per prevenire doppi submit
    // IMPORTANTE: Imposta flag PRIMA di chiamare mutate
    isSubmittingRef.current = true
    setIsSubmitting(true) // Triggera re-render per disabilitare button immediatamente
    
    
    // Chiama mutate - il lock globale e la mutation lock prevengono doppi insert
    mutate({ ...formData, tenantSlug }, {
      onSuccess: () => {
        
        // Reset form (keep default date and time)
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          booking_type: 'tavolo',
          desired_date: getCurrentDate(),
          desired_time: '16:00',
          num_guests: 0,
          special_requests: '',
          menu_selection: {
            items: [],
            tiramisu_total: 0,
            tiramisu_kg: 0
          },
          dietary_restrictions: [],
          preset_menu: null
        })
        setSelectedPreset(null)
        setPrivacyAccepted(false)
        
        // Reset tutti i flag di submit e rilascia lock
        const savedLockId = (isSubmittingRef as any).currentLockId
        isSubmittingRef.current = false
        setIsSubmitting(false)
        if (savedLockId) {
          releaseGlobalLock(savedLockId)
        }
        
        // Mostra la modal di conferma invece del toast
        setShowSuccessModal(true)
        onSubmit?.()
      },
      onError: (error) => {
        console.error('❌ [BookingForm] Mutation error:', error)
        // Reset tutti i flag in caso di errore per permettere nuovo tentativo
        const savedLockId = (isSubmittingRef as any).currentLockId
        isSubmittingRef.current = false
        setIsSubmitting(false)
        if (savedLockId) {
          releaseGlobalLock(savedLockId)
        }
      }
    })
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="w-full max-w-[55vw] mx-auto px-2 md:px-6 space-y-8 font-bold booking-form-mobile">
      {/* Sezione: Dati Personali */}
      <div className="space-y-6">
        <h2 className="text-lg md:text-xl font-serif font-bold text-warm-wood mb-4 bg-white/85 backdrop-blur-[1px] px-6 py-3 rounded-2xl">
          Dati Personali
        </h2>

        {/* Nome */}
        <div className="space-y-3">
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => {
              setFormData({ ...formData, client_name: e.target.value })
              setErrors({ ...errors, client_name: '' })
            }}
            placeholder="Nome Completo *"
            required
            className={`${frostedInputCn} ${errors.client_name ? 'border-red-500!' : ''}`}
          />
          {errors.client_name && (
            <p className="text-sm text-red-500">{errors.client_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-3 pt-2">
          <Input
            id="client_email"
            type="email"
            value={formData.client_email}
            onChange={(e) => {
              setFormData({ ...formData, client_email: e.target.value })
              setErrors({ ...errors, client_email: '' })
            }}
            placeholder="Email (Opzionale)"
            className={`${frostedInputCn} ${errors.client_email ? 'border-red-500!' : ''}`}
          />
          {errors.client_email && (
            <p className="text-sm text-red-500">{errors.client_email}</p>
          )}
        </div>

        {/* Telefono */}
        <div className="space-y-3 pt-2">
          <Input
            id="client_phone"
            type="tel"
            value={formData.client_phone}
            onChange={(e) => {
              setFormData({ ...formData, client_phone: e.target.value })
              setErrors({ ...errors, client_phone: '' })
            }}
            placeholder="Telefono *"
            required
            className={`${frostedInputCn} ${errors.client_phone ? 'border-red-500!' : ''}`}
          />
          {errors.client_phone && (
            <p className="text-sm text-red-500">{errors.client_phone}</p>
          )}
        </div>
      </div>

      {/* Sezione: Dettagli Prenotazione */}
      <div className="space-y-6">
        <h2 className="text-lg md:text-xl font-serif font-bold text-warm-wood mb-4 bg-white/85 backdrop-blur-[1px] px-6 py-3 rounded-2xl">
          Dettagli Prenotazione
        </h2>

        {/* Numero Ospiti */}
        <div className="space-y-3">
          <div>
            <Input
              id="num_guests"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={formData.num_guests > 0 ? formData.num_guests.toString() : ''}
              onChange={handleNumGuestsChange}
              onKeyPress={handleNumGuestsKeyPress}
              required
              placeholder="Numero Ospiti * (es: 15)"
              className={`${frostedInputCn} ${errors.num_guests ? 'border-red-500!' : ''}`}
            />
          </div>
          {errors.num_guests && (
            <p className="text-sm text-red-500">{errors.num_guests}</p>
          )}
        </div>

        {/* Data */}
        <div className="space-y-3 pt-2">
          <label
            htmlFor="desired_date"
            className="inline-block text-base md:text-lg font-bold text-warm-wood bg-white/85 backdrop-blur-[1px] px-4 py-2 rounded-xl mb-2"
          >
            Data prenotazione *
          </label>
          <DateInput
            id="desired_date"
            value={formData.desired_date}
            onChange={(newDate) => {
              setFormData({ ...formData, desired_date: newDate })

              // Real-time validation for business hours
              const timeError = newDate && formData.desired_time
                ? validateBusinessHours(newDate, formData.desired_time)
                : null

              if (timeError) {
                // Check if it's a day closure error
                const dayName = businessHours ? getDayOfWeek(newDate) : null
                const dayHours = businessHours && dayName ? businessHours[dayName] : null

                if (dayHours === null || (Array.isArray(dayHours) && dayHours.length === 0)) {
                  setErrors({ ...errors, desired_date: timeError, desired_time: '' })
                } else {
                  setErrors({ ...errors, desired_date: '', desired_time: timeError })
                }
              } else {
                setErrors({ ...errors, desired_date: '', desired_time: '' })
              }
            }}
            required
            hasError={!!errors.desired_date}
          />
          {errors.desired_date && (
            <div className="text-sm text-red-600 p-3 rounded-lg bg-white/85 backdrop-blur-[1px] border border-red-500/30">
              {errors.desired_date}
            </div>
          )}
        </div>

        {/* Ora */}
        <div className="space-y-3 pb-8 pt-2">
          <label
            htmlFor="desired_time"
            className="inline-block text-base md:text-lg font-bold text-warm-wood bg-white/85 backdrop-blur-[1px] px-4 py-2 rounded-xl mb-2"
          >
            Ora prenotazione *
          </label>
          <TimeInput
            id="desired_time"
            value={formData.desired_time || '16:00'}
            onChange={(newTime) => {
              setFormData({ ...formData, desired_time: newTime })

              // Real-time validation for business hours
              const timeError = formData.desired_date && newTime
                ? validateBusinessHours(formData.desired_date, newTime)
                : null

              if (timeError) {
                // Check if it's a day closure error
                const dayName = businessHours && formData.desired_date ? getDayOfWeek(formData.desired_date) : null
                const dayHours = businessHours && dayName ? businessHours[dayName] : null

                if (dayHours === null || (Array.isArray(dayHours) && dayHours.length === 0)) {
                  setErrors({ ...errors, desired_date: timeError, desired_time: '' })
                } else {
                  setErrors({ ...errors, desired_date: '', desired_time: timeError })
                }
              } else {
                setErrors({ ...errors, desired_date: '', desired_time: '' })
              }
            }}
            required
            hasError={!!errors.desired_time}
          />
          {errors.desired_time && (
            <div className="text-sm text-red-600 p-3 rounded-lg bg-white/85 backdrop-blur-[1px] border border-red-500/30">
              {errors.desired_time}
            </div>
          )}
        </div>

        {/* Tipologia di prenotazione (sotto Data / Ora) */}
        <div className="mt-7">
          <label
            htmlFor="booking_type"
            className="inline-block text-base md:text-lg font-bold text-warm-wood bg-white/85 backdrop-blur-[1px] px-4 py-2 rounded-xl mb-2"
          >
            Tipologia di Prenotazione *
          </label>
          <select
            id="booking_type"
            value={formData.booking_type}
            onChange={(e) => {
              const booking_type = e.target.value as BookingType
              if (booking_type === 'tavolo') {
                setSelectedPreset(null)
                setFormData({
                  ...formData,
                  booking_type,
                  preset_menu: null,
                  menu_selection: { items: [], tiramisu_total: 0, tiramisu_kg: 0 },
                  menu_total_per_person: undefined,
                  menu_total_booking: undefined,
                  dietary_restrictions: []
                })
              } else {
                setFormData({ ...formData, booking_type })
              }
              setErrors({ ...errors, booking_type: '', menu: '' })
            }}
            className="block w-full h-14 rounded-full border border-black/20 shadow-sm transition-all px-4 text-base font-bold bg-white/85 backdrop-blur-[1px] text-black focus:border-warm-wood focus:outline-none"
          >
            <option value="tavolo">Prenota un tavolo</option>
            <option value="rinfresco_laurea">Rinfresco di Laurea</option>
            <option value="menu_prezzo_fisso">Menu a prezzo fisso</option>
          </select>
          {errors.booking_type && (
            <p className="text-sm text-red-500">{errors.booking_type}</p>
          )}
        </div>

      </div>
      {/* Menu Selection - Solo per Rinfresco di Laurea */}
      {bookingTypeUsesMenuSelections(formData.booking_type) && (
        <div id="menu-section" className="space-y-6 pt-6">
          <MenuSelection
            selectedItems={formData.menu_selection?.items || []}
            numGuests={formData.num_guests || 0}
            bookingType={formData.booking_type}
            presetMenu={selectedPreset}
            staffPresetsDropdownVisible={staffPresetsDropdownVisible}
            customStaffPresets={customStaffPresets}
            volAuVentPromoVisible={volAuVentPromoVisible}
            volAuVentPromoMessage={volAuVentPromoMessage}
            onPresetMenuChange={handlePresetMenuChange}
            onMenuChange={({ items, totalPerPerson, tiramisuTotal, tiramisuKg }) => {
              const numGuests = formData.num_guests || 0
              // Mantieni preset_menu se gli items corrispondono ancora al preset
              const currentPreset = selectedPreset
              let updatedPreset: PresetMenuType = currentPreset
              
              // Verifica se gli items corrispondono ancora al preset selezionato
              if (
                currentPreset &&
                !presetSelectionStillMatchesStoredPreset(currentPreset, items, customStaffPresets)
              ) {
                updatedPreset = null
                setSelectedPreset(null)
              }
              
              setFormData({
                ...formData,
                preset_menu: updatedPreset,
                menu_selection: {
                  items,
                  tiramisu_total: tiramisuTotal,
                  tiramisu_kg: tiramisuKg
                },
                menu_total_per_person: totalPerPerson,
                menu_total_booking: totalPerPerson * numGuests + tiramisuTotal
              })
              setErrors({ ...errors, menu: '' })
            }}
          />
          {errors.menu && (
            <p className="text-sm text-red-500">{errors.menu}</p>
          )}
        </div>
      )}

      {/* Intolleranze Alimentari - Solo per Rinfresco di Laurea */}
      {/* NOTA: I guest_count nelle intolleranze sono separati da num_guests.
          Il num_guests è il totale ospiti della prenotazione.
          I guest_count nelle intolleranze indicano solo quante persone hanno quella specifica intolleranza.
          NON vengono sommati al totale. */}
      {bookingTypeUsesMenuSelections(formData.booking_type) && (
        <div className="space-y-6">
          <DietaryRestrictionsSection
            restrictions={formData.dietary_restrictions || []}
            onRestrictionsChange={(restrictions) => {
              setFormData({
                ...formData,
                dietary_restrictions: restrictions
                // NOTA: num_guests non viene modificato quando si aggiungono intolleranze
              })
            }}
            specialRequests={formData.special_requests || ''}
            onSpecialRequestsChange={(value) => {
              setFormData({ ...formData, special_requests: value })
            }}
            privacyAccepted={privacyAccepted}
            onPrivacyChange={setPrivacyAccepted}
          />
        </div>
      )}

      {/* Privacy Policy - Solo per Prenota un Tavolo (per Rinfresco di Laurea è dentro DietaryRestrictionsSection) */}
      {!bookingTypeUsesMenuSelections(formData.booking_type) && (
        <div className="space-y-2 mt-10">
          <div className="flex items-center gap-3">
            <div className="group relative size-5 shrink-0">
              <input
                type="checkbox"
                id="privacy-consent"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked)
                  // Rimuovi errore quando viene selezionata
                  if (e.target.checked && errors.privacyAccepted) {
                    setErrors({ ...errors, privacyAccepted: '' })
                  }
                }}
                required
                className="peer absolute inset-0 z-10 size-5 cursor-pointer appearance-none opacity-0 focus:outline-none"
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded border-2 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md peer-checked:border-warm-orange peer-checked:bg-warm-orange peer-checked:shadow-lg peer-focus-visible:ring-4 peer-focus-visible:ring-warm-wood/20 ${
                  errors.privacyAccepted
                    ? 'border-red-500 group-hover:border-red-600'
                    : 'border-warm-wood/40 group-hover:border-warm-wood'
                }`}
              >
                <Check
                  className={`h-3.5 w-3.5 text-white transition-all duration-300 ${
                    privacyAccepted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                  strokeWidth={3}
                />
              </div>
            </div>
            <label
              htmlFor="privacy-consent"
              className="cursor-pointer text-sm text-warm-wood-dark font-medium leading-relaxed bg-white/85 backdrop-blur-[1px] px-4 py-2 rounded-xl max-w-[600px]"
            >
              Accetto la{' '}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-warm-orange underline decoration-warm-orange decoration-2 underline-offset-2 hover:text-warm-orange hover:decoration-warm-orange transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </Link>
              {' '}di Al Ritrovo *
            </label>
          </div>
          {errors.privacyAccepted && (
            <p className="text-sm text-red-500 ml-8 mt-2">{errors.privacyAccepted}</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex w-full justify-center items-center mt-12">
        <button
            type="submit"
            disabled={isPending || isBlocked || isSubmitting}
            className="booking-cross-shine-btn group relative overflow-hidden px-12 md:px-20 py-7 text-xl md:text-2xl uppercase tracking-wide font-bold text-white rounded-full bg-green-600 hover:bg-green-700 shadow-2xl hover:shadow-[0_20px_40px_rgba(34,197,94,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-2xl w-full md:w-auto max-w-md md:max-w-2xl"
            onPointerDown={(e) => {
              if (isPending || isBlocked || isSubmitting) return
              if (
                typeof window !== 'undefined' &&
                (e.pointerType === 'touch' || window.matchMedia('(hover: none)').matches)
              ) {
                setTouchCrossBurst((v) => v + 1)
              }
            }}
          >
            <div className="booking-cross-shine-mount pointer-events-none absolute inset-0 z-[7] overflow-hidden rounded-[inherit]" aria-hidden>
              <div className="booking-cross-shine-beam booking-cross-shine-beam-desktop" />
              {touchCrossBurst > 0 ? (
                <div
                  key={touchCrossBurst}
                  className="booking-cross-shine-beam booking-cross-shine-touch-burst"
                />
              ) : null}
            </div>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-base md:text-lg">Invio in corso...</span>
                </>
              ) : isBlocked ? (
                <span className="text-base md:text-lg">Limite richieste raggiunto</span>
              ) : (
                <>
                  <span className="text-xl md:text-2xl">Invia Prenotazione</span>
                  <Send className="h-6 w-6 md:h-7 md:w-7 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </div>

            {/* Animated border glow */}
            <div className="absolute inset-0 z-0 pointer-events-none rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-green-600 blur-sm"></div>
            </div>
          </button>
        </div>
    </form>

    {/* Modal di Conferma Successo */}
    {showSuccessModal && (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
        <div className="bg-white p-10 rounded-lg max-w-[500px] text-center">
          <div className="flex justify-center mb-5">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4">
            Richiesta di Prenotazione Inviata!
          </h3>
          <p className="text-lg mb-5">
            La tua richiesta di prenotazione è stata inoltrata correttamente.<br />
            Ti contatteremo a breve per confermare i dettagli.
          </p>
          <button
            onClick={() => {
              setShowSuccessModal(false)
              setFormData(createInitialFormData())
              setPrivacyAccepted(false)
              setErrors({})
              setSelectedPreset(null)
              // Redirect disabilitato su richiesta:
              // window.location.href = 'https://alritrovobologna.wixsite.com/alritrovobologna'
            }}
            className="py-3 px-8 text-lg font-bold text-white bg-green-500 rounded-full cursor-pointer border-none"
          >
            Chiudi
          </button>
        </div>
      </div>
    )}
    </>
  )
}
