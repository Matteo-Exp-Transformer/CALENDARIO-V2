import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Edit, Trash2, Save } from 'lucide-react'
import { useUpdateBooking, useCancelBooking } from '../hooks/useBookingMutations'
import { useAcceptedBookings } from '../hooks/useBookingQueries'
import type { BookingRequest, BookingType } from '@/types/booking'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'
import { extractDateFromISO, createBookingDateTime, getAccurateStartTime, getAccurateEndTime, calculateEndTimeFromStart } from '../utils/dateUtils'
import { getSlotsOccupiedByBooking } from '../utils/capacityCalculator'
import { CAPACITY_CONFIG } from '../constants/capacity'
import { toast } from 'react-toastify'
import { DetailsTab } from './DetailsTab'
import { MenuTab } from './MenuTab'
import { DietaryTab } from './DietaryTab'
import type { SelectedMenuItem } from '@/types/menu'
import type { PresetMenuType } from '../constants/presetMenus'
import { useMenuItems } from '../hooks/useMenuItems'
import { useRestaurantSetting } from '../hooks/useRestaurantSetting'
import {
  applyPresetTypeToBookingFormPayload,
  computeMenuTotalsFromItems,
  presetSelectionStillMatchesStoredPreset,
} from '../utils/buildPresetMenuSelection'
import { DEFAULT_VOL_AU_VENT_PROMO_MESSAGE } from '../constants/volAuVentPromo'
import { CapacityWarningModal } from './CapacityWarningModal'


interface BookingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingRequest
}

type TabId = 'details' | 'menu' | 'dietary'

interface Tab {
  id: TabId
  label: string
  icon: string
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {

  const [isEditMode, setIsEditMode] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showTypeChangeWarning, setShowTypeChangeWarning] = useState(false)
  const [pendingBookingType, setPendingBookingType] = useState<BookingType>('tavolo')
  const [activeTab, setActiveTab] = useState<TabId>('details')
  const [isMenuExpanded, setIsMenuExpanded] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [endTimeManuallyModified, setEndTimeManuallyModified] = useState(false)
  const [mouseDownTarget, setMouseDownTarget] = useState<EventTarget | null>(null)
  const [showOverbookingConfirm, setShowOverbookingConfirm] = useState(false)
  const [overbookingSlotInfo, setOverbookingSlotInfo] = useState<{
    slotName: string
    totalOccupied: number
    capacity: number
    exceededBy: number
  } | null>(null)

  // Ref to track previous booking ID to prevent unnecessary recalculations
  const previousBookingIdRef = React.useRef<string>(booking.id)

  // Responsive width calculation
  const getResponsiveMaxWidth = () => {
    if (typeof window === 'undefined') return '28rem' // SSR fallback

    const width = window.innerWidth

    // Mobile: full width (< 640px)
    if (width < 640) return '100%'

    // Tablet: 90% width (640px - 1024px)
    if (width < 1024) return '90%'

    // Desktop: large modal (>= 1024px)
    return '56rem' // 896px (max-w-4xl in Tailwind)
  }

  const [modalMaxWidth, setModalMaxWidth] = useState(getResponsiveMaxWidth())

  // Update maxWidth on window resize
  useEffect(() => {
    const handleResize = () => {
      setModalMaxWidth(getResponsiveMaxWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock body scroll when modal is open to prevent horizontal scroll from underlying page
  useEffect(() => {
    if (isOpen) {
      // Save current overflow values
      const originalBodyOverflow = document.body.style.overflow
      const originalBodyOverflowX = document.body.style.overflowX
      const originalHtmlOverflow = document.documentElement.style.overflow
      const originalHtmlOverflowX = document.documentElement.style.overflowX

      // Lock scroll on both body and html (but keep position static to avoid content cut-off)
      document.body.style.overflow = 'hidden'
      document.body.style.overflowX = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.overflowX = 'hidden'

      // Restore on cleanup
      return () => {
        document.body.style.overflow = originalBodyOverflow
        document.body.style.overflowX = originalBodyOverflowX
        document.documentElement.style.overflow = originalHtmlOverflow
        document.documentElement.style.overflowX = originalHtmlOverflowX
      }
    }
  }, [isOpen])

  const updateMutation = useUpdateBooking()
  const cancelMutation = useCancelBooking()
  const { data: acceptedBookings = [] } = useAcceptedBookings()
  const { data: menuItems = [] } = useMenuItems()
  const { data: staffPresetsDropdownVisible = true } = useRestaurantSetting('booking_staff_presets_visible')
  const { data: customStaffPresets = [] } = useRestaurantSetting('booking_custom_staff_presets')
  const { data: volAuVentPromoVisible = true } = useRestaurantSetting('booking_vol_au_vent_promo_visible')
  const { data: volAuVentPromoMessage = DEFAULT_VOL_AU_VENT_PROMO_MESSAGE } = useRestaurantSetting(
    'booking_vol_au_vent_promo_message',
  )

  // Initialize form data from booking
  const [formData, setFormData] = useState(() => {
    try {
      const startTime = getAccurateStartTime(booking)
      const endTime = getAccurateEndTime(booking)

      return {
        booking_type: (booking.booking_type || 'tavolo') as BookingType,
        client_name: booking.client_name || '',
        client_email: booking.client_email || '',
        client_phone: booking.client_phone || '',
        date: extractDateFromISO(booking.confirmed_start || booking.desired_date || ''),
        startTime,
        endTime,
        numGuests: booking.num_guests || 0,
        specialRequests: booking.special_requests || '',
        menu_selection: booking.menu_selection,
        dietary_restrictions: booking.dietary_restrictions || [],
        preset_menu: booking.preset_menu,
        placement: booking.placement || ''
      }
    } catch (error) {
      console.error('[BookingDetailsModal] Error initializing form data:', error)
      // Return default values if initialization fails
      return {
        booking_type: 'tavolo' as BookingType,
        client_name: booking.client_name || '',
        client_email: booking.client_email || '',
        client_phone: booking.client_phone || '',
        date: '',
        startTime: '12:00',
        endTime: '15:00',
        numGuests: booking.num_guests || 0,
        specialRequests: booking.special_requests || '',
        menu_selection: booking.menu_selection,
        dietary_restrictions: booking.dietary_restrictions || [],
        preset_menu: booking.preset_menu,
        placement: booking.placement || ''
      }
    }
  })

  // Update form data when booking changes
  // IMPORTANTE: Non aggiornare i campi se siamo in edit mode per non sovrascrivere le modifiche dell'utente
  useEffect(() => {
    // Se siamo in edit mode, non aggiornare formData (l'utente sta modificando)
    if (isEditMode) {
      return
    }

    // GUARD AGGIUNTIVO: Non ricalcolare se l'ID booking non è cambiato
    // Questo previene ricalcoli non necessari su aggiornamenti di stato come placement
    if (formData.date && booking.id === previousBookingIdRef.current) {
      return
    }

    try {
      const startTime = getAccurateStartTime(booking)
      const endTime = getAccurateEndTime(booking)

      setFormData({
        booking_type: (booking.booking_type || 'tavolo') as BookingType,
        client_name: booking.client_name || '',
        client_email: booking.client_email || '', // Può essere null/undefined, quindi stringa vuota
        client_phone: booking.client_phone || '',
        date: extractDateFromISO(booking.confirmed_start || booking.desired_date || ''),
        startTime,
        endTime,
        numGuests: booking.num_guests || 0,
        specialRequests: booking.special_requests || '',
        menu_selection: booking.menu_selection,
        dietary_restrictions: booking.dietary_restrictions || [],
        preset_menu: booking.preset_menu,
        placement: booking.placement || ''
      })
    } catch (error) {
      console.error('[BookingDetailsModal] Error updating form data:', error)
    }
  }, [booking, isEditMode])

  // Update ref to track current booking ID
  useEffect(() => {
    previousBookingIdRef.current = booking.id
  }, [booking.id])

  // Dynamic tabs based on booking_type
  const tabs = useMemo<Tab[]>(() => {
    const baseTabs: Tab[] = [
      { id: 'details', label: 'Dettagli', icon: '📋' }
    ]

    if (bookingTypeUsesMenuSelections(formData.booking_type)) {
      baseTabs.push(
        { id: 'menu', label: 'Menu e Prezzi', icon: '🍽️' },
        { id: 'dietary', label: 'Intolleranze e Note', icon: '⚠️' }
      )
    }

    return baseTabs
  }, [formData.booking_type])

  // Auto-reset active tab if no longer available
  useEffect(() => {
    const tabExists = tabs.some(t => t.id === activeTab)
    if (!tabExists) {
      setActiveTab('details')
    }
  }, [tabs, activeTab])

  // Auto-expand menu in edit mode
  useEffect(() => {
    if (isEditMode && activeTab === 'menu') {
      setIsMenuExpanded(true)
    }
  }, [isEditMode, activeTab])

  // Reset endTimeManuallyModified when entering edit mode or when booking changes
  useEffect(() => {
    if (isEditMode) {
      setEndTimeManuallyModified(false)
    }
  }, [isEditMode, booking.id])

  // Reset cancellation reason when cancel confirm modal closes
  useEffect(() => {
    if (!showCancelConfirm) {
      setCancellationReason('')
    }
  }, [showCancelConfirm])

  // Handle ESC key for cancel confirmation modal
  useEffect(() => {
    if (!showCancelConfirm) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCancelConfirm(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showCancelConfirm])

  // Capacity check function
  const checkCapacity = (date: string, startTime: string, endTime: string, numGuests: number): boolean => {
    const dayBookings = acceptedBookings.filter((b) => {
      if (b.id === booking.id) return false
      if (!b.confirmed_start) return false
      const bookingDate = extractDateFromISO(b.confirmed_start)
      return bookingDate === date
    })

    const confirmedStart = `${date}T${startTime}:00`
    const confirmedEnd = `${date}T${endTime}:00`
    const newBookingSlots = getSlotsOccupiedByBooking(confirmedStart, confirmedEnd)
    
    const morning = { capacity: CAPACITY_CONFIG.MORNING_CAPACITY, occupied: 0 }
    const afternoon = { capacity: CAPACITY_CONFIG.AFTERNOON_CAPACITY, occupied: 0 }
    const evening = { capacity: CAPACITY_CONFIG.EVENING_CAPACITY, occupied: 0 }

    for (const existingBooking of dayBookings) {
      if (!existingBooking.confirmed_start || !existingBooking.confirmed_end) continue
      
      const slots = getSlotsOccupiedByBooking(existingBooking.confirmed_start, existingBooking.confirmed_end)
      const guests = existingBooking.num_guests || 0

      for (const slot of slots) {
        if (slot === 'morning') morning.occupied += guests
        else if (slot === 'afternoon') afternoon.occupied += guests
        else if (slot === 'evening') evening.occupied += guests
      }
    }

    for (const slot of newBookingSlots) {
      let available: number
      
      if (slot === 'morning') {
        available = morning.capacity - morning.occupied
      } else if (slot === 'afternoon') {
        available = afternoon.capacity - afternoon.occupied
      } else if (slot === 'evening') {
        available = evening.capacity - evening.occupied
      } else {
        continue
      }

      if (available < numGuests) {
        return false
      }
    }

    return true
  }

  // Returns first exceeded slot info for CapacityWarningModal when editing leads to overbooking
  const getExceededSlotInfo = (
    date: string,
    startTime: string,
    endTime: string,
    numGuests: number
  ): { slotName: string; totalOccupied: number; capacity: number; exceededBy: number } | null => {
    const dayBookings = acceptedBookings.filter((b) => {
      if (b.id === booking.id) return false
      if (!b.confirmed_start) return false
      const bookingDate = extractDateFromISO(b.confirmed_start)
      return bookingDate === date
    })

    const confirmedStart = `${date}T${startTime}:00`
    const confirmedEnd = `${date}T${endTime}:00`
    const newBookingSlots = getSlotsOccupiedByBooking(confirmedStart, confirmedEnd)

    const morning = { capacity: CAPACITY_CONFIG.MORNING_CAPACITY, occupied: 0 }
    const afternoon = { capacity: CAPACITY_CONFIG.AFTERNOON_CAPACITY, occupied: 0 }
    const evening = { capacity: CAPACITY_CONFIG.EVENING_CAPACITY, occupied: 0 }

    for (const existingBooking of dayBookings) {
      if (!existingBooking.confirmed_start || !existingBooking.confirmed_end) continue

      const slots = getSlotsOccupiedByBooking(existingBooking.confirmed_start, existingBooking.confirmed_end)
      const guests = existingBooking.num_guests || 0

      for (const slot of slots) {
        if (slot === 'morning') morning.occupied += guests
        else if (slot === 'afternoon') afternoon.occupied += guests
        else if (slot === 'evening') evening.occupied += guests
      }
    }

    for (const slot of newBookingSlots) {
      let occupied: number
      let capacity: number
      let slotName: string

      if (slot === 'morning') {
        occupied = morning.occupied
        capacity = morning.capacity
        slotName = 'mattina'
      } else if (slot === 'afternoon') {
        occupied = afternoon.occupied
        capacity = afternoon.capacity
        slotName = 'pomeriggio'
      } else if (slot === 'evening') {
        occupied = evening.occupied
        capacity = evening.capacity
        slotName = 'sera'
      } else {
        continue
      }

      const totalOccupied = occupied + numGuests
      if (totalOccupied > capacity) {
        return {
          slotName,
          totalOccupied,
          capacity,
          exceededBy: totalOccupied - capacity
        }
      }
    }

    return null
  }

  const handleFormDataChange = (field: string, value: any) => {
    if (field === 'startTime') {
      // Quando cambia startTime, ricalcola automaticamente endTime se non è stato modificato manualmente
      setFormData(prev => {
        const newStartTime = value
        let newEndTime = prev.endTime
        
        if (!endTimeManuallyModified) {
          // Calcola endTime = startTime + 3 ore usando helper centralizzato
          newEndTime = calculateEndTimeFromStart(newStartTime)
        }
        
        return { ...prev, [field]: value, endTime: newEndTime }
      })
    } else if (field === 'endTime') {
      // Quando l'utente modifica manualmente endTime, segna che è stato modificato
      setEndTimeManuallyModified(true)
      setFormData(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleBookingTypeChange = (newType: BookingType) => {
    if (bookingTypeUsesMenuSelections(formData.booking_type) && newType === 'tavolo') {
      setShowTypeChangeWarning(true)
      setPendingBookingType(newType)
    } else {
      // Tipologie con menù: inizializza menu_selection se non esiste
      if (bookingTypeUsesMenuSelections(newType) && !formData.menu_selection) {
        setFormData(prev => ({
          ...prev,
          booking_type: newType,
          menu_selection: {
            items: [],
            tiramisu_total: 0,
            tiramisu_kg: 0
          }
        }))
      } else {
        setFormData(prev => ({ ...prev, booking_type: newType }))
      }
    }
  }

  const confirmBookingTypeChange = () => {
    setFormData(prev => ({
      ...prev,
      booking_type: pendingBookingType,
      menu_selection: undefined,
      dietary_restrictions: [],
      preset_menu: undefined
    }))
    setShowTypeChangeWarning(false)
    setActiveTab('details')
  }

  const handleMenuChange = (payload: {
    items: SelectedMenuItem[]
    totalPerPerson: number
    tiramisuTotal: number
    tiramisuKg: number
  }) => {
    setFormData((prev) => {
      const currentPreset = prev.preset_menu as PresetMenuType | undefined | null
      let preset_menu: PresetMenuType | undefined | null = currentPreset ?? null
      if (
        currentPreset &&
        !presetSelectionStillMatchesStoredPreset(currentPreset, payload.items, customStaffPresets)
      ) {
        preset_menu = null
      }
      return {
        ...prev,
        preset_menu,
        menu_selection: {
          items: payload.items,
          tiramisu_total: payload.tiramisuTotal,
          tiramisu_kg: payload.tiramisuKg,
        },
      }
    })
  }

  const handlePresetMenuChange = (presetType: PresetMenuType) => {
    if (!presetType) {
      setFormData((prev) => ({
        ...prev,
        preset_menu: null,
        menu_selection: {
          items: [],
          tiramisu_total: 0,
          tiramisu_kg: 0,
        },
      }))
      return
    }

    const resolved = applyPresetTypeToBookingFormPayload(presetType, menuItems, customStaffPresets)
    if (!resolved) {
      toast.error('Menù consigliato non disponibile.')
      setFormData((prev) => ({
        ...prev,
        preset_menu: null,
        menu_selection: { items: [], tiramisu_total: 0, tiramisu_kg: 0 },
      }))
      return
    }

    const numGuests = formData.numGuests
    const totals = computeMenuTotalsFromItems(resolved.items, numGuests)

    setFormData((prev) => ({
      ...prev,
      preset_menu: presetType,
      menu_selection: {
        items: resolved.items,
        tiramisu_total: totals.tiramisuTotal,
        tiramisu_kg: totals.tiramisuKg,
      },
    }))
  }

  const performSave = () => {
    const confirmedStart = createBookingDateTime(formData.date, formData.startTime, true)
    const confirmedEnd = createBookingDateTime(formData.date, formData.endTime, false, formData.startTime)

    let menuTotalPerPerson = undefined
    let menuTotalBooking = undefined
    if (bookingTypeUsesMenuSelections(formData.booking_type) && formData.menu_selection) {
      const baseTotal = formData.menu_selection.items
        .filter((item: any) => !item.name.toLowerCase().includes('tiramis'))
        .reduce((sum: number, item: any) => sum + item.price, 0)
      const tiramisuTotal = formData.menu_selection.tiramisu_total || 0
      menuTotalPerPerson = baseTotal
      menuTotalBooking = baseTotal * formData.numGuests + tiramisuTotal
    }

    updateMutation.mutate(
      {
        bookingId: booking.id,
        booking_type: formData.booking_type,
        client_name: formData.client_name,
        client_email: (formData.client_email ?? '').trim(),
        client_phone: formData.client_phone?.trim() === '' ? null : (formData.client_phone || null),
        confirmedStart,
        confirmedEnd,
        numGuests: formData.numGuests,
        specialRequests: formData.specialRequests?.trim() === '' ? null : (formData.specialRequests || null),
        desiredTime: formData.startTime,
        menu_selection: bookingTypeUsesMenuSelections(formData.booking_type) ? formData.menu_selection : undefined,
        menu_total_per_person: menuTotalPerPerson,
        menu_total_booking: menuTotalBooking,
        dietary_restrictions: bookingTypeUsesMenuSelections(formData.booking_type)
          ? formData.dietary_restrictions
          : undefined,
        preset_menu: bookingTypeUsesMenuSelections(formData.booking_type)
          ? (formData.preset_menu || undefined)
          : undefined,
        placement: formData.placement?.trim() === '' ? null : (formData.placement || null)
      },
      {
        onSuccess: () => {
          setIsEditMode(false)
          setEndTimeManuallyModified(false)
          setShowOverbookingConfirm(false)
          setOverbookingSlotInfo(null)
          toast.success('Prenotazione modificata con successo!')
        },
        onError: (error) => {
          console.error('❌ [BookingDetailsModal] Save failed:', error)
        },
      }
    )
  }

  const handleSave = () => {
    if (!booking.confirmed_start) return

    // Validation
    if (!formData.client_name || formData.client_name.length < 2) {
      toast.error('Il nome deve contenere almeno 2 caratteri')
      return
    }

    if (formData.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
      toast.error('Inserisci un indirizzo email valido')
      return
    }

    if (formData.numGuests < 1 || formData.numGuests > 110) {
      toast.error('Inserisci un numero valido di ospiti (minimo 1, massimo 110)')
      return
    }

    const hasCapacity = checkCapacity(formData.date, formData.startTime, formData.endTime, formData.numGuests)

    if (!hasCapacity) {
      const exceededInfo = getExceededSlotInfo(formData.date, formData.startTime, formData.endTime, formData.numGuests)
      if (exceededInfo) {
        setOverbookingSlotInfo(exceededInfo)
        setShowOverbookingConfirm(true)
        return
      }
      // No slot details available, but never block — proceed with warning
      console.warn('⚠️ [BookingDetailsModal] Capacity exceeded but no slot details, proceeding anyway')
      toast.warn(`⚠️ Attenzione: la capienza potrebbe essere superata. La modifica verrà comunque salvata.`)
    }

    performSave()
  }

  const handleCancelBooking = () => {
    cancelMutation.mutate(
      {
        bookingId: booking.id,
        cancellationReason: cancellationReason || 'Cancellato dall\'amministratore',
      },
      {
        onSuccess: () => {
          setCancellationReason('')
          setShowCancelConfirm(false)
          onClose()
        },
      }
    )
  }

  if (!isOpen) {
    return null
  }

  const modalContent = (
    <>
      {overbookingSlotInfo && (
        <CapacityWarningModal
          isOpen={showOverbookingConfirm}
          onClose={() => {
            setShowOverbookingConfirm(false)
            setOverbookingSlotInfo(null)
          }}
          onConfirm={() => {
            performSave()
            setShowOverbookingConfirm(false)
            setOverbookingSlotInfo(null)
          }}
          onCancel={() => {
            setShowOverbookingConfirm(false)
            setOverbookingSlotInfo(null)
          }}
          exceededBy={overbookingSlotInfo.exceededBy}
          slotName={overbookingSlotInfo.slotName}
          totalOccupied={overbookingSlotInfo.totalOccupied}
          capacity={overbookingSlotInfo.capacity}
          variant="edit_booking"
        />
      )}
      {/* Main Modal */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
          // Oscurare ulteriormente quando cancel confirmation è aperto
          backgroundColor: showCancelConfirm ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
          width: '100vw',
          height: '100vh',
          // Disable pointer events when cancel confirmation modal is open
          pointerEvents: showCancelConfirm ? 'none' : 'auto',
          // Transizione smooth per il cambio di opacità
          transition: 'background-color 0.2s ease-in-out'
        }}
        onMouseDown={(e) => setMouseDownTarget(e.target)}
        onClick={(e) => {
          if (e.target === mouseDownTarget) {
            onClose()
          }
          setMouseDownTarget(null)
        }}
      >
        {/* Modal Content */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '100%',
            maxWidth: modalMaxWidth,
            backgroundColor: '#fef3c7',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            // Disable pointer events when cancel confirmation modal is open
            pointerEvents: showCancelConfirm ? 'none' : 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Sticky */}
          <div className="bg-blue-50 border-b-2 border-blue-200 flex-shrink-0" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '12px', paddingBottom: '12px', overflow: 'hidden' }}>
            <div style={{ width: '100%' }}>
              <div className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-2">
                <span aria-hidden="true" />
                <h2 className="text-center text-sm sm:text-lg font-bold text-gray-900 truncate">
                  Dettagli Prenotazione
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-all shadow-sm border border-gray-300 bg-white flex-shrink-0"
                  aria-label="Chiudi"
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="mt-1 mb-3 flex items-center justify-between gap-2">
                  {/* Badge origine prenotazione */}
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    booking.booking_source === 'admin' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {booking.booking_source === 'admin'
                      ? '👤 Prenotazione inserita da Admin'
                      : '📞 Prenotazione arrivata da cliente'}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    ✓ Confermata
                  </span>
              </div>
            </div>

          </div>

          {/* Tab Navigation - Sticky */}
          <div className="bg-white border-b-2 border-gray-200 flex-shrink-0" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}>
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[40px] sm:min-h-[44px] flex items-center justify-center gap-1 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={tab.label}
                >
                  <span className="text-base flex-shrink-0">{tab.icon}</span>
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area - Scrollable */}
          <div
            className="flex-1 bg-amber-100"
            style={{
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '16px',
              paddingBottom: '16px',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {activeTab === 'details' && (
              <DetailsTab
                booking={booking}
                isEditMode={isEditMode}
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onBookingTypeChange={handleBookingTypeChange}
              />
            )}

            {activeTab === 'menu' && bookingTypeUsesMenuSelections(formData.booking_type) && (
              <MenuTab
                booking={booking}
                isEditMode={isEditMode}
                menuSelection={formData.menu_selection}
                numGuests={formData.numGuests}
                presetMenu={formData.preset_menu}
                menuFlowBookingType={formData.booking_type}
                staffPresetsDropdownVisible={staffPresetsDropdownVisible}
                customStaffPresets={customStaffPresets}
                volAuVentPromoVisible={volAuVentPromoVisible}
                volAuVentPromoMessage={volAuVentPromoMessage}
                isMenuExpanded={isMenuExpanded}
                onMenuExpandToggle={() => setIsMenuExpanded(!isMenuExpanded)}
                onMenuChange={handleMenuChange}
                onPresetMenuChange={handlePresetMenuChange}
              />
            )}

            {activeTab === 'dietary' && bookingTypeUsesMenuSelections(formData.booking_type) && (
              <DietaryTab
                booking={booking}
                isEditMode={isEditMode}
                dietaryRestrictions={formData.dietary_restrictions}
                specialRequests={formData.specialRequests}
                onDietaryRestrictionsChange={(restrictions) => handleFormDataChange('dietary_restrictions', restrictions)}
                onSpecialRequestsChange={(value) => handleFormDataChange('specialRequests', value)}
              />
            )}
          </div>

          {/* Footer Actions - Sticky */}
          {!showCancelConfirm && (
            <div className="border-t-2 border-gray-200 bg-amber-100 flex-shrink-0" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}>
              <div className="flex gap-1.5">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-2 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base"
                      style={{ background: '#16a34a', color: '#ffffff', borderColor: '#15803d' }}
                      disabled={updateMutation.isPending}
                    >
                      <Save className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">{updateMutation.isPending ? 'Salvataggio...' : 'Salva'}</span>
                    </button>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="flex-1 px-2 sm:px-6 py-2.5 sm:py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base"
                      style={{ borderColor: '#dc2626', color: '#dc2626' }}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Annulla</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="flex-1 px-2 sm:px-6 py-2.5 sm:py-3 bg-[#244a9e] rounded-xl transition-colors shadow-md hover:shadow-lg hover:bg-[#2b57b6] flex items-center justify-center gap-1 sm:gap-2 font-semibold text-xs sm:text-base min-h-[44px] sm:min-h-[56px]"
                      style={{ color: '#ffffff' }}
                    >
                      <Edit className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Modifica</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelConfirm(true)
                      }}
                      className="flex-1 px-2 sm:px-6 py-2.5 sm:py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base min-h-[44px] sm:min-h-[56px]"
                      style={{ borderColor: '#dc2626', color: '#dc2626' }}
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Elimina</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Type Change Warning Modal */}
      {showTypeChangeWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/75" onClick={() => setShowTypeChangeWarning(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 border-2 border-gray-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Attenzione!</h3>
                <p className="text-sm text-gray-600 mt-1">Cambio tipo prenotazione</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-medium">
                Cambiando il tipo di prenotazione a "Tavolo", i seguenti dati verranno rimossi:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                <li>Menu selezionato</li>
                <li>Intolleranze e allergie</li>
              </ul>
              <p className="text-sm text-yellow-800 font-medium mt-2">
                Sei sicuro di voler procedere?
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowTypeChangeWarning(false)}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Annulla
              </button>
              <button
                onClick={confirmBookingTypeChange}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )

  // Render cancel confirmation modal separately to avoid z-index/overflow issues
  const cancelConfirmationPortal = showCancelConfirm ? createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 60,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      {/* Overlay scuro con blur per distinguere dal modal sottostante */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        onClick={() => setShowCancelConfirm(false)} 
      />
      {/* Dialog box con ombra forte e bordo marcato */}
      <div 
        className="relative rounded-2xl p-8 max-w-lg w-full mx-4" 
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(0, 0, 0, 0.15)',
          zIndex: 1,
          opacity: 1
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icona e titolo */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900">Elimina Prenotazione Accettata</h3>
            <p className="text-sm text-gray-600 mt-1">Potrà essere reinserita dall'archivio</p>
          </div>
        </div>

        {/* Messaggio di conferma */}
        <div className="mb-6">
          <p className="text-sm text-gray-800 font-medium mb-2">
            Sei sicuro di voler eliminare questa prenotazione?
          </p>
          <p className="text-sm text-gray-600">
            La prenotazione verrà spostata nell'archivio e potrà essere reinserita in seguito.
          </p>
        </div>

        {/* Textarea per motivazione */}
        <div className="mb-6">
          <label htmlFor="cancellation-reason" className="block text-sm font-semibold text-gray-700 mb-2">
            Motivazione eliminazione <span className="text-gray-500 font-normal">(facoltativa)</span>
          </label>
          <textarea
            id="cancellation-reason"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Esempio: Cliente ha richiesto cancellazione, cambio programma..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-vertical min-h-[100px] transition-all"
            rows={4}
          />
        </div>

        {/* Bottoni azione */}
        <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
          <button
            onClick={() => setShowCancelConfirm(false)}
            className="flex-1 px-6 py-4 bg-green-600 text-white hover:bg-green-700 font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <X className="h-5 w-5" />
            Annulla
          </button>
          <button
            onClick={handleCancelBooking}
            className="flex-1 px-6 py-4 text-white hover:bg-red-700 font-bold text-lg rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#dc2626' }}
            disabled={cancelMutation.isPending}
          >
            <Trash2 className="h-5 w-5" />
            {cancelMutation.isPending ? 'Eliminazione...' : 'Elimina Prenotazione'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      {createPortal(modalContent, document.body)}
      {cancelConfirmationPortal}
    </>
  )
}
