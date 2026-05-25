import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { BookingRequestInput } from '@/types/booking'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'
import { useCreateBookingRequest } from '../hooks/useBookingRequests'
import { useCheckSlotAvailability } from '../hooks/useCheckSlotAvailability'
import { useRateLimit } from '@/hooks/useRateLimit'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { MenuSelection } from './MenuSelection'
import { DietaryRestrictionsSection } from './DietaryRestrictionsSection'
import {
  dietaryRestrictionsToText,
  dietaryTextToRestrictions,
} from '../utils/dietaryRestrictionsText'
import { useBusinessHours } from '@/hooks/useBusinessHours'
import { isValidBookingDateTime, getDayOfWeek, formatHours } from '@/lib/businessHours'
import { toast } from 'react-toastify'
import type { PresetMenuType } from '../constants/presetMenus'
import { customPresetStorageId, enrichPresetSubTabsFromStaffPresets } from '../constants/presetMenus'
import { useMenuItems } from '../hooks/useMenuItems'
import { useRestaurantSetting } from '../hooks/useRestaurantSetting'
import {
  applyPresetTypeToBookingFormPayload,
  computeMenuTotalsFromItems,
  presetSelectionStillMatchesStoredPreset,
} from '../utils/buildPresetMenuSelection'
import {
  listMenuPromoMessagesForBookingType,
  listMenuPromoLabelsForBookingType,
} from '../constants/menuPromo'
import { MenuPromoBannerCards } from './MenuPromoBannerCards'
import { BookingModeCards } from './publicBooking/BookingModeCards'
import { BookingFormFields } from './publicBooking/BookingFormFields'
import type { BookingPublicFormConfig, SubTab } from '../constants/bookingPublicFormConfig'
import { DEFAULT_BOOKING_FORM_CONFIG } from '../constants/bookingPublicFormConfig'
import { BookingSubTabCards } from './publicBooking/BookingSubTabCards'


interface BookingRequestFormProps {
  onSubmit?: () => void
  tenantSlug?: string
  formConfig?: BookingPublicFormConfig
  onFormDataChange?: (data: Partial<BookingRequestInput>) => void
  onActiveSubTabChange?: (subTab: SubTab | null) => void
}

export const BookingRequestForm: React.FC<BookingRequestFormProps> = ({
  onSubmit,
  tenantSlug,
  formConfig = DEFAULT_BOOKING_FORM_CONFIG,
  onFormDataChange,
  onActiveSubTabChange,
}) => {
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
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(null)
  const [touchCrossBurst, setTouchCrossBurst] = useState(0)

  // Trova il modo attivo in base a booking_type
  const activeMode = formConfig.booking_modes.find(
    (m) => m.enabled && m.booking_type === formData.booking_type,
  ) ?? formConfig.booking_modes.find((m) => m.enabled)

  const activeModeId = activeMode?.id ?? 'tavolo'

  const { data: customStaffPresets = [] } = useRestaurantSetting('booking_custom_staff_presets')

  const activeModeSubTabs = useMemo(() => {
    if (!activeMode?.sub_tabs_enabled || (activeMode.sub_tabs?.length ?? 0) === 0) {
      return []
    }
    return enrichPresetSubTabsFromStaffPresets(activeMode.sub_tabs ?? [], customStaffPresets)
  }, [activeMode, customStaffPresets])

  const activeSubTab = activeModeSubTabs.find((t) => t.id === activeSubTabId) ?? null

  const activeSubTabOverrides = useMemo(() => {
    if (activeModeSubTabs.length > 0) {
      return activeModeSubTabs
        .filter((t): t is typeof t & { preset_id: string } => t.type === 'preset' && !!t.preset_id)
        .map((t) => ({ preset_id: t.preset_id, custom_label: t.label }))
    }
    return activeMode?.sub_tabs_overrides ?? []
  }, [activeMode, activeModeSubTabs])

  /** Con sottotab orizzontali: griglia menù solo dopo click su card tipo preset (menù consigliato). */
  const showMenuSelectionSection = useMemo(() => {
    if (!bookingTypeUsesMenuSelections(formData.booking_type)) return false
    if (activeModeSubTabs.length === 0) return true
    return activeSubTab?.type === 'preset' && !!activeSubTab.preset_id
  }, [formData.booking_type, activeModeSubTabs.length, activeSubTab])

  // Notifica il parent ad ogni cambio formData (per sidebar riepilogo)
  useEffect(() => {
    onFormDataChange?.(formData)
  }, [formData, onFormDataChange])

  useEffect(() => {
    onActiveSubTabChange?.(activeSubTab)
  }, [activeSubTab, onActiveSubTabChange])

  const frostedInputCn =
    'bg-white px-4 rounded-lg border border-slate-200 text-left text-sm sm:text-base font-medium text-warm-wood focus:border-warm-wood focus:ring-2 focus:ring-warm-wood/40'
  
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
      resetAvailability()
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
  const { check: checkSlotAvailability, isChecking: isCheckingAvailability, reset: resetAvailability } = useCheckSlotAvailability()
  const { checkRateLimit, isBlocked } = useRateLimit({
    maxAttempts: 3,
    timeWindow: 60000 // 1 minuto
  })
  const { data: menuItems = [] } = useMenuItems()
  const { data: staffPresetsDropdownVisible = true } = useRestaurantSetting('booking_staff_presets_visible')
  const { data: menuPromos = [] } = useRestaurantSetting('booking_menu_promos')

  const menuPromoBannerMessages = useMemo(
    () => listMenuPromoMessagesForBookingType(formData.booking_type ?? 'tavolo', menuPromos),
    [formData.booking_type, menuPromos],
  )

  // Fetch business hours (non-blocking - form works even if loading/fails)
  const { data: businessHours, isLoading: isLoadingHours, error: hoursError } = useBusinessHours()

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

    let fieldId = fieldIdMap[errorKey]
    if (errorKey === 'menu' && fieldId && !document.getElementById(fieldId)) {
      fieldId = 'booking-sub-tabs-section'
    }
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

    // Sottotab menù: obbligo scelta card prima del submit
    if (
      bookingTypeUsesMenuSelections(formData.booking_type) &&
      activeModeSubTabs.length > 0 &&
      !activeSubTab
    ) {
      newErrors.menu = 'Seleziona un\'opzione menù tra le card sopra'
      isValid = false
      if (!firstErrorKey) firstErrorKey = 'menu'
    }

    // Menu validation (Rinfresco di Laurea / menù a prezzo fisso)
    if (showMenuSelectionSection) {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Validazione form
    if (!validate()) {
      releaseGlobalLock(lockId)
      return
    }

    // Imposta tutti i flag per prevenire doppi submit
    isSubmittingRef.current = true
    setIsSubmitting(true)

    // Check disponibilità fascia (client-side pre-submit)
    if (tenantSlug && formData.desired_date && formData.desired_time && formData.num_guests > 0) {
      const availability = await checkSlotAvailability({
        tenantSlug,
        desired_date: formData.desired_date,
        desired_time: formData.desired_time,
        num_guests: formData.num_guests,
      })
      if (!availability.available) {
        isSubmittingRef.current = false
        setIsSubmitting(false)
        releaseGlobalLock(lockId)
        setErrors((prev) => ({ ...prev, slot_availability: availability.message ?? 'Fascia non disponibile per questa data.' }))
        toast.error(availability.message ?? 'Fascia non disponibile per questa data.', {
          position: 'top-center',
          autoClose: 6000,
        })
        const el = document.getElementById('desired_time')
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }

    // Chiama mutate — il guard server-side in create-booking è la garanzia definitiva
    const menuPromoLabels = listMenuPromoLabelsForBookingType(formData.booking_type ?? 'tavolo', menuPromos)

    let specialRequests = formData.special_requests?.trim() ?? ''
    if (activeSubTab?.type === 'manual' && activeSubTab.label.trim()) {
      const subTabNote = activeSubTab.price_per_person
        ? `[${activeSubTab.label.trim()} - €${activeSubTab.price_per_person}/p]`
        : `[${activeSubTab.label.trim()}]`
      if (!specialRequests.includes(subTabNote)) {
        specialRequests = specialRequests ? `${subTabNote} ${specialRequests}` : subTabNote
      }
    }

    mutate(
      {
        ...formData,
        special_requests: specialRequests,
        tenantSlug,
        menu_promo_labels: menuPromoLabels.length > 0 ? menuPromoLabels : null,
      },
      {
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
        setActiveSubTabId(null)
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
        },
      },
    )
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="w-full px-2 md:px-4 space-y-6 font-bold booking-form-mobile">

      {/* Dati e dettagli — prima sezione sotto header (come pagina prenota attuale) */}
      <div className="space-y-3">
        <BookingFormFields
          formData={{
            client_name: formData.client_name,
            client_email: formData.client_email,
            client_phone: formData.client_phone,
            desired_date: formData.desired_date,
            desired_time: formData.desired_time,
            num_guests: formData.num_guests,
          }}
          errors={errors}
          businessHours={businessHours}
          isLoadingHours={isLoadingHours}
          hoursError={hoursError}
          frostedInputCn={frostedInputCn}
          onFieldChange={(field, value) => {
            setFormData({ ...formData, [field]: value })
          }}
          onDateChange={(newDate) => {
            setFormData({ ...formData, desired_date: newDate })
          }}
          onTimeChange={(newTime) => {
            setFormData({ ...formData, desired_time: newTime })
          }}
          onNumGuestsChange={handleNumGuestsChange}
          onNumGuestsKeyPress={handleNumGuestsKeyPress}
          resetAvailability={resetAvailability}
          setErrors={(newErrors) => setErrors(newErrors)}
        />
        {errors.slot_availability && (
          <div className="text-sm text-red-700 font-semibold p-4 rounded-lg bg-red-50 border border-red-200 text-left">
            {errors.slot_availability}
          </div>
        )}
        {/* Intolleranze e richieste — sempre sotto data/ora/ospiti, per ogni tipologia */}
        <div className="space-y-6 pt-2">
          <DietaryRestrictionsSection
            dietaryText={dietaryRestrictionsToText(formData.dietary_restrictions)}
            onDietaryTextChange={(text) => {
              setFormData({
                ...formData,
                dietary_restrictions: dietaryTextToRestrictions(text),
              })
            }}
            specialRequests={formData.special_requests || ''}
            onSpecialRequestsChange={(value) => {
              setFormData({ ...formData, special_requests: value })
            }}
            privacyAccepted={privacyAccepted}
            onPrivacyChange={(newValue) => {
              setPrivacyAccepted(newValue)
              if (newValue && errors.privacyAccepted) {
                setErrors({ ...errors, privacyAccepted: '' })
              }
            }}
            privacyError={errors.privacyAccepted}
          />
        </div>
      </div>

      {/* Tipologia di prenotazione — card sotto data/ora/ospiti */}
      <div className="space-y-3" id="booking-sub-tabs-section">
        <BookingModeCards
          modes={formConfig.booking_modes}
          activeModeId={activeModeId}
          onChange={(_modeId, bookingType) => {
            setActiveSubTabId(null)
            if (bookingType === 'tavolo') {
              setSelectedPreset(null)
              setFormData({
                ...formData,
                booking_type: bookingType,
                preset_menu: null,
                menu_selection: { items: [], tiramisu_total: 0, tiramisu_kg: 0 },
                menu_total_per_person: undefined,
                menu_total_booking: undefined,
                dietary_restrictions: [],
              })
            } else {
              setFormData({ ...formData, booking_type: bookingType })
            }
            setErrors({ ...errors, booking_type: '', menu: '' })
          }}
        />
        {errors.booking_type && (
          <p className="text-sm text-red-500">{errors.booking_type}</p>
        )}
        {menuPromoBannerMessages.length > 0 && (
          <MenuPromoBannerCards messages={menuPromoBannerMessages} className="mt-3" />
        )}
        {activeModeSubTabs.length > 0 && (
          <BookingSubTabCards
            subTabs={activeModeSubTabs}
            activeSubTabId={activeSubTabId}
            onChange={(tab) => {
              setActiveSubTabId(tab?.id ?? null)
              if (!tab) {
                handlePresetMenuChange(null)
                return
              }
              if (tab.type === 'preset' && tab.preset_id) {
                handlePresetMenuChange(customPresetStorageId(tab.preset_id))
                return
              }
              if (tab.type === 'manual') {
                setSelectedPreset(null)
                const price = tab.price_per_person ?? 0
                const numGuests = formData.num_guests || 0
                setFormData({
                  ...formData,
                  preset_menu: null,
                  menu_selection: { items: [], tiramisu_total: 0, tiramisu_kg: 0 },
                  menu_total_per_person: price > 0 ? price : undefined,
                  menu_total_booking: price > 0 ? price * numGuests : undefined,
                })
              }
            }}
          />
        )}
        {!showMenuSelectionSection && errors.menu && activeModeSubTabs.length > 0 && (
          <p className="text-sm text-red-500 text-center">{errors.menu}</p>
        )}
      </div>

      {/* Menu Selection — visibile solo dopo card preset (se ci sono sottotab) */}
      {showMenuSelectionSection && (
        <div id="menu-section" className="space-y-6 pt-6">
          <MenuSelection
            selectedItems={formData.menu_selection?.items || []}
            numGuests={formData.num_guests || 0}
            bookingType={formData.booking_type}
            presetMenu={selectedPreset}
            staffPresetsDropdownVisible={
              activeModeSubTabs.length > 0 ? false : staffPresetsDropdownVisible
            }
            customStaffPresets={customStaffPresets}
            hideSummary={true}
            variant={formData.booking_type === 'rinfresco_laurea' ? 'compose' : 'default'}
            hideMenuGrid={activeSubTab?.type === 'manual'}
            subTabOverrides={activeSubTabOverrides}
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

      {/* Submit Button */}
      <div className="flex w-full justify-center items-center mt-12">
        <button
            type="submit"
            disabled={isPending || isBlocked || isSubmitting || isCheckingAvailability}
            className="booking-cross-shine-btn group relative overflow-hidden px-12 md:px-20 py-7 text-xl md:text-2xl uppercase tracking-wide font-bold text-white rounded-full bg-green-600 hover:bg-green-700 shadow-2xl hover:shadow-[0_20px_40px_rgba(34,197,94,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-2xl w-full md:w-auto max-w-md md:max-w-2xl"
            onPointerDown={(e) => {
              if (isPending || isBlocked || isSubmitting || isCheckingAvailability) return
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
              {isCheckingAvailability ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-base md:text-lg">Verifica disponibilità...</span>
                </>
              ) : isPending ? (
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
