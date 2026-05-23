import React, { useState, useEffect, useMemo } from 'react'
import { useFeatures } from '@/hooks/useFeatures'
import { createPortal } from 'react-dom'
import { X, Edit, Trash2, Save } from 'lucide-react'
import { useUpdateBooking, useCancelBooking, useMarkNoShow } from '../hooks/useBookingMutations'
import { useAcceptedBookings } from '../hooks/useBookingQueries'
import type { BookingRequest, BookingType } from '@/types/booking'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'
import {
  extractDateFromISO,
  createBookingDateTime,
  getAccurateStartTime,
  getAccurateEndTime,
  calculateEndTimeFromStart,
  isWallClockStartBeforeNow,
  trimTimeToHHmm,
} from '../utils/dateUtils'
import { getSlotsOccupiedByBookingV2 } from '../utils/capacityCalculator'
import { DEFAULT_SLOT_GUEST_CAPACITIES } from '../lib/restaurantSettingRegistry'
import { toast } from 'react-toastify'
import { DetailsTab } from './DetailsTab'
import { MenuTab } from './MenuTab'
import { DietaryTab } from './DietaryTab'
import type { SelectedMenuItem } from '@/types/menu'
import type { PresetMenuType } from '../constants/presetMenus'
import { useMenuItems } from '../hooks/useMenuItems'
import { useRestaurantSetting } from '../hooks/useRestaurantSetting'
import { useDigestSlotConfigs, useServiceSlots } from '../hooks/useServiceSlots'
import { useServiceSlotOverrides, resolveSlotOverride } from '../hooks/useServiceSlotOverrides'
import {
  applyPresetTypeToBookingFormPayload,
  computeMenuTotalsFromItems,
  presetSelectionStillMatchesStoredPreset,
} from '../utils/buildPresetMenuSelection'
import {
  listMenuPromoMessagesForBookingType,
} from '../constants/menuPromo'
import { CapacityWarningModal } from './CapacityWarningModal'
import { PastStartTimeWarningModal } from './PastStartTimeWarningModal'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'
import { adminBlueCtaSurfaceClass } from '@/lib/adminBlueCtaClass'

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
  const [showPastStartWarning, setShowPastStartWarning] = useState(false)

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

  const features = useFeatures()
  const updateMutation = useUpdateBooking()
  const cancelMutation = useCancelBooking()
  const markNoShowMutation = useMarkNoShow()

  // Visibile se: accepted, non walk-in, confirmed_start nel passato, no_show=false
  const canMarkNoShow =
    booking.status === 'accepted' &&
    booking.source !== 'walk_in' &&
    !booking.no_show &&
    !!booking.confirmed_start &&
    new Date(booking.confirmed_start) < new Date()
  const { data: acceptedBookings = [] } = useAcceptedBookings()
  const { data: menuItems = [] } = useMenuItems()
  const { data: staffPresetsDropdownVisible = true } = useRestaurantSetting('booking_staff_presets_visible')
  const { data: customStaffPresets = [] } = useRestaurantSetting('booking_custom_staff_presets')
  const { data: menuPromos = [] } = useRestaurantSetting('booking_menu_promos')
  const { data: digestSlots = [] } = useDigestSlotConfigs()
  const { data: serviceSlots = [] } = useServiceSlots()
  const { data: slotOverrides = [] } = useServiceSlotOverrides()
  const { data: slotGuestCapacities = DEFAULT_SLOT_GUEST_CAPACITIES } =
    useRestaurantSetting('slot_guest_capacities')
  const { data: timeSlotsEnabledRaw = true } = useRestaurantSetting('booking_time_slots_enabled')
  const timeSlotsEnabled = features.servizio ? true : timeSlotsEnabledRaw

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
      logger.error('[BookingDetailsModal] Error initializing form data:', error)
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
      logger.error('[BookingDetailsModal] Error updating form data:', error)
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

  const menuPromoMessagesForTab = useMemo(
    () => listMenuPromoMessagesForBookingType(formData.booking_type, menuPromos),
    [formData.booking_type, menuPromos],
  )

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

  // Capacita per slot: service_slots.max_guests > override > slot_guest_capacities
  const getSlotCap = (slotId: string, date: string): number | null => {
    const svcSlot = serviceSlots.find((s) => s.id === slotId)
    if (svcSlot) {
      const ov = resolveSlotOverride(slotOverrides, slotId, date)
      if (ov) return ov.max_guests
      if (svcSlot.max_guests != null) return svcSlot.max_guests
    }
    return slotGuestCapacities[slotId] ?? null
  }

  // Occupazione per-slot delle prenotazioni gia accettate nel giorno (escluso booking corrente)
  const buildOccupied = (date: string): Record<string, number> => {
    const result: Record<string, number> = {}
    for (const slot of digestSlots) result[slot.id] = 0
    const dayBookings = acceptedBookings.filter((b) => {
      if (b.id === booking.id) return false
      if (!b.confirmed_start) return false
      return extractDateFromISO(b.confirmed_start) === date
    })
    for (const b of dayBookings) {
      if (!b.confirmed_start || !b.confirmed_end) continue
      for (const slotId of getSlotsOccupiedByBookingV2(b.confirmed_start, b.confirmed_end, digestSlots)) {
        if (slotId in result) result[slotId] += b.num_guests ?? 0
      }
    }
    return result
  }

  const checkCapacity = (date: string, startTime: string, endTime: string, numGuests: number): boolean => {
    if (!timeSlotsEnabled || digestSlots.length === 0) return true
    const confirmedStart = `${date}T${startTime}:00+00:00`
    const confirmedEnd = `${date}T${endTime}:00+00:00`
    const newSlotIds = getSlotsOccupiedByBookingV2(confirmedStart, confirmedEnd, digestSlots)
    const occupied = buildOccupied(date)
    for (const slotId of newSlotIds) {
      const cap = getSlotCap(slotId, date)
      if (cap == null) continue
      if ((occupied[slotId] ?? 0) + numGuests > cap) return false
    }
    return true
  }

  const getExceededSlotInfo = (
    date: string,
    startTime: string,
    endTime: string,
    numGuests: number
  ): { slotName: string; totalOccupied: number; capacity: number; exceededBy: number } | null => {
    if (!timeSlotsEnabled || digestSlots.length === 0) return null
    const confirmedStart = `${date}T${startTime}:00+00:00`
    const confirmedEnd = `${date}T${endTime}:00+00:00`
    const newSlotIds = getSlotsOccupiedByBookingV2(confirmedStart, confirmedEnd, digestSlots)
    const occupied = buildOccupied(date)
    for (const slotId of newSlotIds) {
      const slot = digestSlots.find((s) => s.id === slotId)
      if (!slot) continue
      const cap = getSlotCap(slotId, date)
      if (cap == null) continue
      const totalOccupied = (occupied[slotId] ?? 0) + numGuests
      if (totalOccupied > cap) {
        return { slotName: slot.name, totalOccupied, capacity: cap, exceededBy: totalOccupied - cap }
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
          logger.error('❌ [BookingDetailsModal] Save failed:', error)
        },
      }
    )
  }

  const runCapacityCheckAndSave = () => {
    const hasCapacity = checkCapacity(formData.date, formData.startTime, formData.endTime, formData.numGuests)

    if (!hasCapacity) {
      const exceededInfo = getExceededSlotInfo(formData.date, formData.startTime, formData.endTime, formData.numGuests)
      if (exceededInfo) {
        setOverbookingSlotInfo(exceededInfo)
        setShowOverbookingConfirm(true)
        return
      }
      // No slot details available, but never block — proceed with warning
      logger.warn('⚠️ [BookingDetailsModal] Capacity exceeded but no slot details, proceeding anyway')
      toast.warn(`⚠️ Attenzione: la capienza potrebbe essere superata. La modifica verrà comunque salvata.`)
    }

    performSave()
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

    const startNorm = trimTimeToHHmm(formData.startTime)
    if (isWallClockStartBeforeNow(formData.date, startNorm)) {
      setShowPastStartWarning(true)
      return
    }

    runCapacityCheckAndSave()
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
      <PastStartTimeWarningModal
        isOpen={showPastStartWarning}
        variant="edit_booking"
        desiredDate={formData.date}
        startTimeHHmm={trimTimeToHHmm(formData.startTime)}
        onClose={() => setShowPastStartWarning(false)}
        onCancel={() => setShowPastStartWarning(false)}
        onConfirm={() => {
          setShowPastStartWarning(false)
          runCapacityCheckAndSave()
        }}
      />
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
          className="flex flex-col overflow-x-hidden bg-[var(--color-surface)] shadow-2xl"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '100%',
            maxWidth: modalMaxWidth,
            pointerEvents: showCancelConfirm ? 'none' : 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Sticky */}
          <div
            className="flex-shrink-0 border-b-2 border-[var(--color-border)] bg-primary-50"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '12px', paddingBottom: '12px', overflow: 'hidden' }}
          >
            <div style={{ width: '100%' }}>
              <div className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-2">
                <span aria-hidden="true" />
                <h2 className="truncate text-center text-sm font-bold text-primary-900 sm:text-lg">
                  Dettagli Prenotazione
                </h2>
                <button
                  onClick={onClose}
                  className="flex flex-shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5 shadow-sm transition-all hover:bg-[var(--color-surface-2)]"
                  aria-label="Chiudi"
                  style={{ width: '32px', height: '32px' }}
                >
                  <X className="h-4 w-4 text-[var(--color-text-muted)]" />
                </button>
              </div>
              <div className="mt-1 mb-3 flex items-center justify-between gap-2">
                  {/* Badge origine prenotazione */}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      booking.booking_source === 'admin'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-primary-100 text-primary-800',
                    )}
                  >
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
          <div
            className="flex-shrink-0 border-b-2 border-[var(--color-border)] bg-[var(--color-bg)]"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
          >
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={cn(
                    'flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition-all sm:min-h-[44px] sm:px-3 sm:text-sm',
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md hover:bg-primary-500'
                      : 'border border-transparent bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
                  )}
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
            className="flex-1 bg-[var(--color-bg)]"
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
                menuPromoMessages={menuPromoMessagesForTab}
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
            <div
              className="flex-shrink-0 border-t-2 border-[var(--color-border)] bg-[var(--color-surface)]"
              style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              <div className="flex gap-1.5">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-2 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/35 hover:from-emerald-400 hover:to-emerald-500 hover:border-emerald-600 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:brightness-100 disabled:hover:from-emerald-500 disabled:hover:to-emerald-600 disabled:hover:border-emerald-700 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base"
                      disabled={updateMutation.isPending}
                    >
                      <Save className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">{updateMutation.isPending ? 'Salvataggio...' : 'Salva'}</span>
                    </button>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="flex-1 px-2 sm:px-6 py-2.5 sm:py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Annulla</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className={cn(
                        adminBlueCtaSurfaceClass,
                        'flex flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2.5 font-semibold text-xs shadow-md hover:shadow-lg sm:gap-2 sm:px-6 sm:py-3 sm:text-base min-h-[44px] sm:min-h-[56px]'
                      )}
                    >
                      <Edit className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Modifica</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelConfirm(true)
                      }}
                      className="flex-1 px-2 sm:px-6 py-2.5 sm:py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base min-h-[44px] sm:min-h-[56px]"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Elimina</span>
                    </button>
                    {features.noShow && canMarkNoShow && (
                      <button
                        type="button"
                        onClick={() => markNoShowMutation.mutate(booking.id)}
                        disabled={markNoShowMutation.isPending}
                        className="flex-1 px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-amber-500 text-amber-700 font-semibold rounded-xl transition-all duration-300 hover:bg-amber-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/30 shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm min-h-[44px] sm:min-h-[56px] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span className="truncate">{markNoShowMutation.isPending ? '…' : 'No-show'}</span>
                      </button>
                    )}
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
          <div className="relative mx-4 max-w-lg w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900">Attenzione!</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">Cambio tipo prenotazione</p>
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
                type="button"
                onClick={() => setShowTypeChangeWarning(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-surface-2)] px-6 py-4 text-lg font-bold text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)]/40"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={confirmBookingTypeChange}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-red-700"
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
        className="relative z-[1] mx-4 max-w-lg w-full rounded-2xl border-2 border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(24, 50, 74, 0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icona e titolo */}
        <div className="mb-6 flex items-center gap-4 border-b-2 border-[var(--color-border)] pb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-primary-900">Elimina Prenotazione Accettata</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Potrà essere reinserita dall&apos;archivio</p>
          </div>
        </div>

        {/* Messaggio di conferma */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
            Sei sicuro di voler eliminare questa prenotazione?
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            La prenotazione verrà spostata nell'archivio e potrà essere reinserita in seguito.
          </p>
        </div>

        {/* Textarea per motivazione */}
        <div className="mb-6">
          <label htmlFor="cancellation-reason" className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
            Motivazione eliminazione{' '}
            <span className="font-normal text-[var(--color-text-muted)]">(facoltativa)</span>
          </label>
          <textarea
            id="cancellation-reason"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Esempio: Cliente ha richiesto cancellazione, cambio programma..."
            className="min-h-[100px] w-full resize-y rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
          />
        </div>

        {/* Bottoni azione */}
        <div className="flex gap-4 border-t-2 border-[var(--color-border)] pt-4">
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
