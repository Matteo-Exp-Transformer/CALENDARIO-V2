import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Store, Loader2, Plus, Edit, Trash2, Save, X, Eye, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { TimePicker24h } from '@/components/ui/TimePicker24h'
import { useTenantContext } from '@/contexts/TenantContext'
import type { BusinessHours } from '@/lib/businessHours'
import { getDefaultBusinessHours } from '@/lib/businessHours'
import { cn, stripDirectionalFormattingChars } from '@/lib/utils'
import { ADMIN_WARM_BORDER } from '@/lib/adminWarmGradientSurface'
import { BusinessHoursEditor } from './BusinessHoursEditor'
import { toast } from 'react-toastify'
import { logger } from '@/lib/logger'
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'
import { useFeatures } from '@/hooks/useFeatures'
import {
  OVERNIGHT_TIME_END_HINT,
  slotCrossesMidnight,
  slotRangesOverlap,
  toBookingTimeSlots,
  type BookingTimeSlots,
} from '@/features/booking/utils/bookingTimeSlots'
import {
  useServiceSlots,
  useUpdateServiceSlot,
  SERVICE_SLOTS_QUERY_KEY,
} from '@/features/booking/hooks/useServiceSlots'
import {
  BOOKING_PAGE_GRADIENT_PRESETS,
  BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
  BOOKING_PAGE_TILE_IDS,
  DEFAULT_BOOKING_PAGE_BACKGROUND,
  bookingPageGradientPreviewCss,
  bookingPageTilePublicHref,
  isBookingPageGradientId,
  isBookingPageTilePlaceholder,
  type BookingPageBackgroundId,
} from '@/features/booking/constants/bookingPageBackground'
import {
  APP_THEME_OPTIONS,
  DEFAULT_APP_THEME,
  type AppThemeId,
} from '@/features/booking/constants/appTheme'

type SlotFieldKey =
  | 'morningStart'
  | 'morningEnd'
  | 'afternoonStart'
  | 'afternoonEnd'
  | 'eveningStart'
  | 'eveningEnd'

const RESTAURANT_NAME_MAX_LENGTH = 40
const DEFAULT_PLACEMENT_AREAS = ['Sala A', 'Sala B', 'Deorr'] as const
const PLACEMENT_AREA_MAX_LENGTH = 40

const normalizePlacementAreas = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [...DEFAULT_PLACEMENT_AREAS]
  const cleaned = value
    .map((item) => stripDirectionalFormattingChars(String(item ?? '')).trim())
    .filter((item) => item.length > 0)
    .map((item) => item.slice(0, PLACEMENT_AREA_MAX_LENGTH))
  const unique = cleaned.filter((item, index) => cleaned.indexOf(item) === index)
  return unique.length > 0 ? unique : [...DEFAULT_PLACEMENT_AREAS]
}

function validateBookingTimeSlotsDetailed(config: BookingTimeSlots): {
  message: string | null
  fields: SlotFieldKey[]
} {
  const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/
  const allFields: SlotFieldKey[] = [
    'morningStart',
    'morningEnd',
    'afternoonStart',
    'afternoonEnd',
    'eveningStart',
    'eveningEnd',
  ]

  for (const field of allFields) {
    if (!HH_MM.test(config[field])) {
      return { message: 'Ogni orario deve essere nel formato HH:mm', fields: [field] }
    }
  }

  if (config.morningStart === config.morningEnd) {
    return {
      message: 'La fascia Colazione non e valida: inizio e fine coincidono',
      fields: ['morningStart', 'morningEnd'],
    }
  }
  if (config.afternoonStart === config.afternoonEnd) {
    return {
      message: 'La fascia Pranzo non e valida: inizio e fine coincidono',
      fields: ['afternoonStart', 'afternoonEnd'],
    }
  }
  if (config.eveningStart === config.eveningEnd) {
    return {
      message: 'La fascia Cena non e valida: inizio e fine coincidono',
      fields: ['eveningStart', 'eveningEnd'],
    }
  }
  if (
    slotRangesOverlap(
      config.morningStart,
      config.morningEnd,
      config.afternoonStart,
      config.afternoonEnd
    )
  ) {
    return {
      message: 'Le fasce Colazione e Pranzo si sovrappongono',
      fields: ['morningEnd', 'afternoonStart'],
    }
  }
  if (
    slotRangesOverlap(
      config.afternoonStart,
      config.afternoonEnd,
      config.eveningStart,
      config.eveningEnd
    )
  ) {
    return {
      message: 'Le fasce Pranzo e Cena si sovrappongono',
      fields: ['afternoonEnd', 'eveningStart'],
    }
  }
  if (
    slotRangesOverlap(
      config.morningStart,
      config.morningEnd,
      config.eveningStart,
      config.eveningEnd
    )
  ) {
    return {
      message: 'Le fasce Colazione e Cena si sovrappongono',
      fields: ['morningStart', 'eveningEnd'],
    }
  }

  return { message: null, fields: [] }
}

const restaurantSettingsIntroCardClass =
  'admin-warm-surface w-full max-w-2xl mx-auto space-y-4 rounded-xl border p-5 md:p-7 shadow-md text-center flex flex-col items-center gap-3 sm:flex-row sm:justify-center'

/** Titolo introduttivo spostabile nello sticky header della dashboard */
type AppThemePreviewPickProps = {
  previewSrc: string
  previewModalSrc: string
  label: string
  selected: boolean
  disabled: boolean
  pickButtonClass: (selected: boolean) => string
  onPick: () => void
}

const themePreviewFocusRingClass =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 sm:focus-visible:ring-offset-2'

const AppThemePreviewPick: React.FC<AppThemePreviewPickProps> = ({
  previewSrc,
  previewModalSrc,
  label,
  selected,
  disabled,
  pickButtonClass,
  onPick,
}) => {
  const [imgFailed, setImgFailed] = useState(false)
  const [modalImgFailed, setModalImgFailed] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (previewOpen) setModalImgFailed(false)
  }, [previewOpen])

  return (
    <>
      <div className={cn(pickButtonClass(selected), 'group')}>
        <div className="relative aspect-[5/3] w-full overflow-hidden rounded-md border border-slate-200/80 bg-slate-100">
          {imgFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 px-2 text-center text-[0.625rem] font-semibold leading-snug text-slate-500 sm:text-[11px]">
              Anteprima in arrivo
            </div>
          ) : (
            <img
              src={previewSrc}
              alt=""
              className={cn(
                'h-full w-full object-cover transition-transform duration-300 ease-out',
                '[@media(hover:hover)]:group-hover:scale-105',
              )}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          )}

          {!imgFailed && (
            <div
              className="pointer-events-none absolute inset-0 z-[5] bg-black/35 opacity-0 transition-opacity duration-200 [@media(hover:hover)]:group-hover:opacity-100"
              aria-hidden
            />
          )}

          <button
            type="button"
            disabled={disabled}
            className={cn(
              'absolute inset-0 z-[1] cursor-pointer border-0 bg-transparent p-0',
              themePreviewFocusRingClass,
              disabled && 'cursor-not-allowed',
            )}
            aria-label={`Seleziona tema usando anteprima: ${label}`}
            onClick={onPick}
          />

          {!imgFailed && (
            <button
              type="button"
              disabled={disabled}
              className={cn(
                'absolute left-1/2 top-1/2 z-[10] flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black/50 text-white shadow-md transition-opacity duration-200 sm:min-h-[3rem] sm:min-w-[3rem]',
                themePreviewFocusRingClass,
                /* Desktop con hover: occhio e hit solo sopra hover (il centro altrimenti seleziona via layer sotto) */
                'pointer-events-none opacity-0 [@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:opacity-100',
                /* Touch (telefono/tablet): occhio sempre visibile anche sopra breakpoint sm */
                'max-sm:pointer-events-auto max-sm:opacity-100 max-sm:bg-black/45 [@media(pointer:coarse)]:pointer-events-auto [@media(pointer:coarse)]:opacity-100 [@media(pointer:coarse)]:bg-black/45',
                disabled && 'cursor-not-allowed opacity-40',
              )}
              aria-haspopup="dialog"
              aria-expanded={previewOpen}
              aria-label={`Ingrandisci anteprima: ${label}`}
              onClick={(e) => {
                e.stopPropagation()
                setPreviewOpen(true)
              }}
            >
              <Eye
                className="size-3 shrink-0 sm:size-5 [@media(pointer:coarse)]:size-3"
                strokeWidth={2}
                aria-hidden
              />
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={disabled}
          className={cn(
            'line-clamp-2 min-h-[1.5em] w-full cursor-pointer border-0 bg-transparent px-px text-center text-[0.625rem] font-semibold leading-snug text-slate-700 sm:text-[11px]',
            themePreviewFocusRingClass,
            disabled && 'cursor-not-allowed opacity-65',
          )}
          aria-label={`Seleziona tema: ${label}`}
          onClick={onPick}
        >
          {label}
        </button>
      </div>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={label}
        size="2xl"
        showCloseButton
        closeOnOverlayClick
        closeOnEscape
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Anteprima a schermo intero. Puoi applicare il tema dalla finestra o chiudere e sceglierne un altro.
          </p>
          <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {modalImgFailed ? (
              <div className="flex min-h-[12rem] w-full items-center justify-center px-4 py-10 text-center text-sm font-semibold text-slate-500">
                Anteprima non disponibile
              </div>
            ) : (
              <img
                src={previewModalSrc}
                alt=""
                className="max-h-[min(78vh,880px)] w-full object-contain"
                loading="eager"
                onError={() => setModalImgFailed(true)}
              />
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setPreviewOpen(false)}>
              Chiudi
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={disabled}
              onClick={() => {
                onPick()
                setPreviewOpen(false)
              }}
            >
              Usa questo tema
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export function RestaurantSettingsIntro() {
  return (
    <div className={restaurantSettingsIntroCardClass}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-primary-700 bg-primary-600 shadow-lg">
        <Store className="h-7 w-7 text-white" />
      </div>
      <div className="min-w-0 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Impostazioni locale</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Modifica i dati visualizzati nella pagina Prenotazioni e nel Calendario.
        </p>
      </div>
    </div>
  )
}

export const RestaurantSettingsTab: React.FC = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()
  const features = useFeatures()

  const nameQuery = useRestaurantSetting('restaurant_name')
  const dailyGuestLimitQuery = useRestaurantSetting('daily_guest_limit')
  const slotGuestCapacitiesQuery = useRestaurantSetting('slot_guest_capacities')
  const serviceSlotsQuery = useServiceSlots()
  const updateServiceSlot = useUpdateServiceSlot()
  const hoursQuery = useRestaurantSetting('business_hours')
  const contactEmailQuery = useRestaurantSetting('contact_email')
  const contactPhoneQuery = useRestaurantSetting('contact_phone')
  const contactAddressQuery = useRestaurantSetting('contact_address')
  const publicBookingPageBgQuery = useRestaurantSetting('public_booking_page_background')
  const placementAreasQuery = useRestaurantSetting('booking_placement_areas')
  const appThemeQuery = useRestaurantSetting('app_theme')
  const walkInMaxGuestsQuery = useRestaurantSetting('walk_in_max_guests')

  const upsert = useUpsertRestaurantSetting()

  const [dirty, setDirty] = useState(false)
  const [restaurantName, setRestaurantName] = useState('')
  const [dailyGuestLimit, setDailyGuestLimit] = useState<number | ''>('')
  const [walkInMaxGuests, setWalkInMaxGuests] = useState<number | ''>(20)
  const [slotCapMorning, setSlotCapMorning] = useState<number | ''>('')
  const [slotCapAfternoon, setSlotCapAfternoon] = useState<number | ''>('')
  const [slotCapEvening, setSlotCapEvening] = useState<number | ''>('')
  // canonicalSlotIds: id delle 3 righe canonical in service_slots, per salvataggio
  const [canonicalSlotIds, setCanonicalSlotIds] = useState<[string, string, string] | null>(null)
  const [bookingTimeSlots, setBookingTimeSlots] = useState<BookingTimeSlots>(() =>
    toBookingTimeSlots([])
  )
  const [slotValidationError, setSlotValidationError] = useState<string | null>(null)
  const [slotFieldsAttention, setSlotFieldsAttention] = useState<Record<SlotFieldKey, boolean>>({
    morningStart: false,
    morningEnd: false,
    afternoonStart: false,
    afternoonEnd: false,
    eveningStart: false,
    eveningEnd: false,
  })
  const [businessHours, setBusinessHours] = useState<BusinessHours>(() => getDefaultBusinessHours())
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [bookingPageBackground, setBookingPageBackground] =
    useState<BookingPageBackgroundId>(DEFAULT_BOOKING_PAGE_BACKGROUND)
  const [bookingBgTextureTab, setBookingBgTextureTab] = useState<'images' | 'gradients'>('images')
  /** Dopo «Conferma» la griglia resta bloccata finche non si cambia selezione o non va a buon fine «Salva modifiche». */
  const [bookingBgSelectionLocked, setBookingBgSelectionLocked] = useState(false)
  const [placementAreas, setPlacementAreas] = useState<string[]>([...DEFAULT_PLACEMENT_AREAS])
  const [editingPlacementAreaIndex, setEditingPlacementAreaIndex] = useState<number | null>(null)
  const [editingPlacementAreaDraft, setEditingPlacementAreaDraft] = useState('')
  const [appTheme, setAppTheme] = useState<AppThemeId>(DEFAULT_APP_THEME)

  const hydratedRef = useRef(false)
  const slotFieldRefs = useRef<Record<SlotFieldKey, HTMLDivElement | null>>({
    morningStart: null,
    morningEnd: null,
    afternoonStart: null,
    afternoonEnd: null,
    eveningStart: null,
    eveningEnd: null,
  })

  useEffect(() => {
    hydratedRef.current = false
    setDirty(false)
    setBookingBgSelectionLocked(false)
  }, [tenantId])

  const allSuccess =
    nameQuery.isSuccess &&
    dailyGuestLimitQuery.isSuccess &&
    slotGuestCapacitiesQuery.isSuccess &&
    serviceSlotsQuery.isSuccess &&
    hoursQuery.isSuccess &&
    contactEmailQuery.isSuccess &&
    contactPhoneQuery.isSuccess &&
    contactAddressQuery.isSuccess &&
    publicBookingPageBgQuery.isSuccess &&
    placementAreasQuery.isSuccess &&
    appThemeQuery.isSuccess &&
    walkInMaxGuestsQuery.isSuccess

  useEffect(() => {
    if (!allSuccess || hydratedRef.current) return
    setRestaurantName(
      stripDirectionalFormattingChars(String(nameQuery.data ?? '')).slice(0, RESTAURANT_NAME_MAX_LENGTH)
    )
    setDailyGuestLimit(dailyGuestLimitQuery.data ?? '')
    const sg = slotGuestCapacitiesQuery.data
    setSlotCapMorning(sg?.morning ?? '')
    setSlotCapAfternoon(sg?.afternoon ?? '')
    setSlotCapEvening(sg?.evening ?? '')
    const canonicals = (serviceSlotsQuery.data ?? [])
      .filter((s) => s.is_canonical)
      .sort((a, b) => a.display_order - b.display_order)
    if (canonicals.length >= 3) {
      setCanonicalSlotIds([canonicals[0].id, canonicals[1].id, canonicals[2].id])
    }
    setBookingTimeSlots(toBookingTimeSlots(canonicals))
    setBusinessHours(hoursQuery.data)
    setContactEmail(stripDirectionalFormattingChars(contactEmailQuery.data ?? ''))
    setContactPhone(stripDirectionalFormattingChars(contactPhoneQuery.data ?? ''))
    setContactAddress(stripDirectionalFormattingChars(contactAddressQuery.data ?? ''))
    setPlacementAreas(normalizePlacementAreas(placementAreasQuery.data))
    const resolvedBg = publicBookingPageBgQuery.data ?? DEFAULT_BOOKING_PAGE_BACKGROUND
    setBookingPageBackground(resolvedBg)
    setBookingBgTextureTab(isBookingPageGradientId(resolvedBg) ? 'gradients' : 'images')
    setBookingBgSelectionLocked(false)
    setEditingPlacementAreaIndex(null)
    setEditingPlacementAreaDraft('')
    setAppTheme(appThemeQuery.data ?? DEFAULT_APP_THEME)
    setWalkInMaxGuests(walkInMaxGuestsQuery.data ?? 20)
    hydratedRef.current = true
  }, [
    allSuccess,
    nameQuery.data,
    dailyGuestLimitQuery.data,
    slotGuestCapacitiesQuery.data,
    serviceSlotsQuery.data,
    hoursQuery.data,
    contactEmailQuery.data,
    contactPhoneQuery.data,
    contactAddressQuery.data,
    placementAreasQuery.data,
    publicBookingPageBgQuery.data,
    appThemeQuery.data,
    walkInMaxGuestsQuery.data,
  ])

  const loading =
    nameQuery.isPending ||
    dailyGuestLimitQuery.isPending ||
    slotGuestCapacitiesQuery.isPending ||
    serviceSlotsQuery.isPending ||
    hoursQuery.isPending ||
    contactEmailQuery.isPending ||
    contactPhoneQuery.isPending ||
    contactAddressQuery.isPending ||
    publicBookingPageBgQuery.isPending ||
    placementAreasQuery.isPending ||
    appThemeQuery.isPending

  const loadError =
    nameQuery.error ||
    dailyGuestLimitQuery.error ||
    slotGuestCapacitiesQuery.error ||
    serviceSlotsQuery.error ||
    hoursQuery.error ||
    contactEmailQuery.error ||
    contactPhoneQuery.error ||
    contactAddressQuery.error ||
    publicBookingPageBgQuery.error ||
    placementAreasQuery.error ||
    appThemeQuery.error

  const markDirty = () => setDirty(true)

  // Nomi dinamici delle 3 fasce canoniche (Colazione / Pranzo / Cena dal DB)
  const canonicalNames = (serviceSlotsQuery.data ?? [])
    .filter((s) => s.is_canonical)
    .sort((a, b) => a.display_order - b.display_order)
    .map((s) => s.name)
  const morningName = canonicalNames[0] ?? 'Colazione'
  const afternoonName = canonicalNames[1] ?? 'Pranzo'
  const eveningName = canonicalNames[2] ?? 'Cena'
  const morningCrossesMidnight = slotCrossesMidnight({
    start_time: bookingTimeSlots.morningStart,
    end_time: bookingTimeSlots.morningEnd,
  })
  const afternoonCrossesMidnight = slotCrossesMidnight({
    start_time: bookingTimeSlots.afternoonStart,
    end_time: bookingTimeSlots.afternoonEnd,
  })
  const eveningCrossesMidnight = slotCrossesMidnight({
    start_time: bookingTimeSlots.eveningStart,
    end_time: bookingTimeSlots.eveningEnd,
  })

  const savedBookingPageBackground = publicBookingPageBgQuery.data ?? DEFAULT_BOOKING_PAGE_BACKGROUND
  /** Selezione diversa dal valore gia salvato su DB (solo «Salva modifiche» aggiorna il DB). */
  const bookingBgHasUnsavedChoice = bookingPageBackground !== savedBookingPageBackground

  const handleBookingBgConfirmOrCancel = () => {
    if (!tenantId || upsert.isPending) return
    if (bookingBgSelectionLocked) {
      setBookingBgSelectionLocked(false)
      return
    }
    if (!bookingBgHasUnsavedChoice) return
    setBookingBgSelectionLocked(true)
    toast.success(
      'Selezione confermata e bloccata. Usa «Salva modifiche» in fondo per pubblicarla sulla pagina Prenota.'
    )
  }

  const handleRestaurantNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    markDirty()
    setRestaurantName(
      stripDirectionalFormattingChars(event.target.value).slice(0, RESTAURANT_NAME_MAX_LENGTH)
    )
  }

  const handleSave = async () => {
    const slotsValidation = validateBookingTimeSlotsDetailed(bookingTimeSlots)
    if (slotsValidation.message) {
      setSlotValidationError(slotsValidation.message)
      setSlotFieldsAttention((prev) => {
        const next = { ...prev }
        for (const k of Object.keys(next) as SlotFieldKey[]) next[k] = false
        for (const f of slotsValidation.fields) next[f] = true
        return next
      })
      const firstField = slotsValidation.fields[0]
      if (firstField) {
        slotFieldRefs.current[firstField]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
      toast.error(slotsValidation.message)
      return
    }

    if (bookingPageBackground !== savedBookingPageBackground && !bookingBgSelectionLocked) {
      toast.error(
        'Conferma la selezione dello sfondo con il pulsante dedicato, poi usa Salva modifiche in fondo.'
      )
      return
    }

    try {
      const safeName = stripDirectionalFormattingChars(restaurantName).slice(0, RESTAURANT_NAME_MAX_LENGTH)
      const safeEmail = stripDirectionalFormattingChars(contactEmail)
      const safePhone = stripDirectionalFormattingChars(contactPhone)
      const safeAddress = stripDirectionalFormattingChars(contactAddress)

      setRestaurantName(safeName)
      setContactEmail(safeEmail)
      setContactPhone(safePhone)
      setContactAddress(safeAddress)

      // Aggiorna le 3 fasce canoniche in service_slots (unica fonte di verità).
      // !features.servizio = Classic: la sezione fasce è visibile → salva solo se le righe canoniche esistono.
      // In Pro/Enterprise questa sezione è nascosta → canonicalSlotIds è sempre null, skip corretto.
      if (!features.servizio && canonicalSlotIds) {
        const [idMorning, idAfternoon, idEvening] = canonicalSlotIds
        await Promise.all([
          updateServiceSlot.mutateAsync({ id: idMorning, start_time: bookingTimeSlots.morningStart, end_time: bookingTimeSlots.morningEnd }),
          updateServiceSlot.mutateAsync({ id: idAfternoon, start_time: bookingTimeSlots.afternoonStart, end_time: bookingTimeSlots.afternoonEnd }),
          updateServiceSlot.mutateAsync({ id: idEvening, start_time: bookingTimeSlots.eveningStart, end_time: bookingTimeSlots.eveningEnd }),
        ])
        // Invalida la cache service_slots per allineare calendario e capacity
        await queryClient.invalidateQueries({ queryKey: [SERVICE_SLOTS_QUERY_KEY] })
      } else if (!features.servizio && !canonicalSlotIds) {
        logger.warn('[RestaurantSettingsTab] nessuna fascia canonica trovata — fasce non salvate (tenant pre-migrazione 016)')
      }

      await upsert.mutateAsync([
        { key: 'restaurant_name', value: safeName },
        { key: 'daily_guest_limit', value: dailyGuestLimit === '' ? null : dailyGuestLimit },
        {
          key: 'slot_guest_capacities',
          value: {
            morning: slotCapMorning === '' ? null : slotCapMorning,
            afternoon: slotCapAfternoon === '' ? null : slotCapAfternoon,
            evening: slotCapEvening === '' ? null : slotCapEvening,
          },
        },
        { key: 'business_hours', value: businessHours },
        { key: 'contact_email', value: safeEmail },
        { key: 'contact_phone', value: safePhone },
        { key: 'contact_address', value: safeAddress },
        { key: 'public_booking_page_background', value: bookingPageBackground },
        { key: 'booking_placement_areas', value: placementAreas },
        { key: 'app_theme', value: appTheme },
        { key: 'walk_in_max_guests', value: walkInMaxGuests === '' ? 20 : walkInMaxGuests },
      ])
      // Keep local form state as source of truth after save.
      // Resetting hydration before refetch can reapply stale cached values.
      await queryClient.refetchQueries({
        queryKey: ['restaurant_settings'],
        type: 'active',
      })
      setSlotValidationError(null)
      setSlotFieldsAttention({
        morningStart: false,
        morningEnd: false,
        afternoonStart: false,
        afternoonEnd: false,
        eveningStart: false,
        eveningEnd: false,
      })
      setDirty(false)
      setBookingBgSelectionLocked(false)
      setEditingPlacementAreaIndex(null)
      setEditingPlacementAreaDraft('')
    } catch {
      /* toast gestito da useUpsertRestaurantSetting.onError */
    }
  }

  const handleAddPlacementArea = () => {
    markDirty()
    const candidateBase = 'Nuova area'
    const nextLabel =
      placementAreas.includes(candidateBase)
        ? `${candidateBase} ${placementAreas.length + 1}`
        : candidateBase
    setPlacementAreas((prev) => [...prev, nextLabel])
    setEditingPlacementAreaIndex(placementAreas.length)
    setEditingPlacementAreaDraft(nextLabel)
  }

  const handleStartEditPlacementArea = (index: number) => {
    setEditingPlacementAreaIndex(index)
    setEditingPlacementAreaDraft(placementAreas[index] ?? '')
  }

  const handleCancelEditPlacementArea = () => {
    setEditingPlacementAreaIndex(null)
    setEditingPlacementAreaDraft('')
  }

  const handleSavePlacementArea = (index: number) => {
    const nextValue = stripDirectionalFormattingChars(editingPlacementAreaDraft).trim()
    if (!nextValue) {
      toast.error('Il nome dell area non puo essere vuoto')
      return
    }
    const capped = nextValue.slice(0, PLACEMENT_AREA_MAX_LENGTH)
    markDirty()
    setPlacementAreas((prev) => prev.map((item, itemIndex) => (itemIndex === index ? capped : item)))
    setEditingPlacementAreaIndex(null)
    setEditingPlacementAreaDraft('')
  }

  const handleRemovePlacementArea = (index: number) => {
    if (placementAreas.length <= 1) {
      toast.warn("Serve almeno un'area di posizionamento")
      return
    }
    markDirty()
    const wasEditingThis = editingPlacementAreaIndex === index
    setPlacementAreas((prev) => prev.filter((_, i) => i !== index))
    setEditingPlacementAreaIndex((current) => {
      if (current === null) return null
      if (current === index) return null
      if (current > index) return current - 1
      return current
    })
    if (wasEditingThis) setEditingPlacementAreaDraft('')
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

  const clearSlotAttention = (field: SlotFieldKey) => {
    setSlotFieldsAttention((prev) => ({ ...prev, [field]: false }))
  }

  const slotFieldClass = (field: SlotFieldKey) =>
    slotFieldsAttention[field] ? 'rounded-[1.25rem]' : ''
  const slotFieldStyle = (field: SlotFieldKey): React.CSSProperties | undefined =>
    slotFieldsAttention[field]
      ? {
          boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55)',
          animation: 'slotErrorBlink 0.85s ease-in-out infinite',
        }
      : undefined

  const sectionSurfaceClass =
    'admin-warm-surface w-full max-w-2xl mx-auto space-y-4 rounded-xl border p-5 md:p-7 shadow-md text-center'
  /** Larghezza campi anagrafica: base 14rem, due incrementi +1/3 → ×(4/3)² = ×16/9 */
  const anagraficaFieldWrapClass =
    'mx-auto w-full min-w-0 max-w-[calc(14rem_*_16_/_9)] space-y-2'
  /** Spazio verticale tra i blocchi (inline: non dipende dalle utilities Tailwind arbitrary). */
  const anagraficaFieldStackStyle: React.CSSProperties = { marginTop: '1.75rem' }
  /** text-xl (1.25rem) ridotto di 1/6 → calc(1.25rem * 5/6) */
  const anagraficaInputClassName =
    'block w-full min-h-[3.667rem] rounded-[1.25rem] border-2 border-slate-200 bg-white px-4 py-2.5 text-center text-[calc(1.25rem_*_5_/_6)] font-medium leading-snug text-slate-900 shadow-sm outline-none placeholder:text-slate-400 placeholder:text-[calc(1.25rem_*_5_/_6)] transition-colors duration-150 focus:border-primary-400 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-500 disabled:opacity-80'

  const bookingBgBase = import.meta.env.BASE_URL

  const bookingBgPickButtonClass = (selected: boolean) =>
    [
      'flex min-h-0 flex-col gap-1 rounded-lg border-2 bg-white/85 p-1.5 text-center shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 sm:focus-visible:ring-offset-2',
      selected ? 'border-emerald-600 ring-2 ring-emerald-600/80 ring-offset-1 sm:ring-offset-2' : 'border-slate-200 hover:border-slate-300',
      upsert.isPending ? 'pointer-events-none opacity-65' : '',
    ]
      .filter(Boolean)
      .join(' ')

  const bookingBgNavyToggleButtonStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    paddingInline: 'calc(0.875rem * 4 / 3)',
    paddingBlock: 'calc(0.5rem * 5 / 4)',
    minWidth: 'calc(4.375rem * 4 / 3)',
    minHeight: 'calc(2.25rem * 5 / 4)',
    color: '#ffffff',
    WebkitTextFillColor: '#ffffff',
  }

  const bookingBgNavyToggleClass = (active: boolean) =>
    [
      'rounded-lg text-sm font-semibold shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-300 disabled:pointer-events-none disabled:opacity-65',
      active
        ? 'bg-primary-600 ring-2 ring-white/70 hover:bg-primary-700'
        : 'bg-primary-900 hover:bg-primary-800',
    ].join(' ')

  const bookingBgSectionClass =
    'admin-warm-surface w-full max-w-3xl mx-auto space-y-4 rounded-xl border p-5 md:p-7 shadow-md text-center'
  const bookingBgGridTopSpacingStyle: React.CSSProperties = { marginTop: '1.375rem' }
  const bookingBgTextureTabRowStyle: React.CSSProperties = { gap: '1rem' }
  const bookingBgAvailableTileIds = BOOKING_PAGE_TILE_IDS.filter((id) => !isBookingPageTilePlaceholder(id))

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <style>{`
        @keyframes slotErrorBlink {
          0% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55); }
          50% { box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.65), 0 0 4px rgba(239, 68, 68, 0.25); }
          100% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.55); }
        }
      `}</style>
      <section className={sectionSurfaceClass}>
        <h3 className="text-lg font-semibold text-slate-800">Anagrafica e prenotazioni</h3>
        <div className="flex w-full flex-col items-center">
          <div className={anagraficaFieldWrapClass}>
            <Label htmlFor="restaurant_name" className="block w-full text-center">
              Nome ristorante
            </Label>
            <input
              id="restaurant_name"
              name="restaurant_name"
              type="text"
              maxLength={RESTAURANT_NAME_MAX_LENGTH}
              dir="ltr"
              autoComplete="off"
              value={typeof restaurantName === 'string' ? restaurantName : ''}
              disabled={upsert.isPending}
              onChange={handleRestaurantNameChange}
              placeholder="Nome del locale"
              className={anagraficaInputClassName}
              style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="daily_guest_limit" className="block w-full text-center">
              Limite coperti giornaliero
            </Label>
            <Input
              id="daily_guest_limit"
              type="number"
              min={1}
              max={1000}
              value={dailyGuestLimit}
              disabled={upsert.isPending}
              placeholder="Nessun limite"
              className={`${anagraficaInputClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              onChange={(e) => {
                markDirty()
                const raw = e.target.value
                if (raw === '') {
                  setDailyGuestLimit('')
                  return
                }
                const n = parseInt(raw, 10)
                if (!Number.isNaN(n)) setDailyGuestLimit(n)
              }}
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="walk_in_max_guests" className="block w-full text-center">
              Limite coperti walk-in
            </Label>
            <Input
              id="walk_in_max_guests"
              type="number"
              min={1}
              max={200}
              value={walkInMaxGuests}
              disabled={upsert.isPending}
              placeholder="20"
              className={`${anagraficaInputClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              onChange={(e) => {
                markDirty()
                const raw = e.target.value
                if (raw === '') {
                  setWalkInMaxGuests('')
                  return
                }
                const n = parseInt(raw, 10)
                if (!Number.isNaN(n)) setWalkInMaxGuests(n)
              }}
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <p className="mx-auto max-w-md text-center text-sm text-slate-600">
              Coperti massimi per fascia oraria (opzionale). Vuoto = nessun tetto sulla fascia.
            </p>
            <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="slot_cap_morning" className="block w-full text-center text-sm">
                  Mattina
                </Label>
                <Input
                  id="slot_cap_morning"
                  type="number"
                  min={1}
                  max={5000}
                  value={slotCapMorning}
                  disabled={upsert.isPending}
                  placeholder="Nessun limite"
                  className={`${anagraficaInputClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  onChange={(e) => {
                    markDirty()
                    const raw = e.target.value
                    if (raw === '') {
                      setSlotCapMorning('')
                      return
                    }
                    const n = parseInt(raw, 10)
                    if (!Number.isNaN(n)) setSlotCapMorning(n)
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="slot_cap_afternoon" className="block w-full text-center text-sm">
                  Pomeriggio
                </Label>
                <Input
                  id="slot_cap_afternoon"
                  type="number"
                  min={1}
                  max={5000}
                  value={slotCapAfternoon}
                  disabled={upsert.isPending}
                  placeholder="Nessun limite"
                  className={`${anagraficaInputClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  onChange={(e) => {
                    markDirty()
                    const raw = e.target.value
                    if (raw === '') {
                      setSlotCapAfternoon('')
                      return
                    }
                    const n = parseInt(raw, 10)
                    if (!Number.isNaN(n)) setSlotCapAfternoon(n)
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="slot_cap_evening" className="block w-full text-center text-sm">
                  Sera
                </Label>
                <Input
                  id="slot_cap_evening"
                  type="number"
                  min={1}
                  max={5000}
                  value={slotCapEvening}
                  disabled={upsert.isPending}
                  placeholder="Nessun limite"
                  className={`${anagraficaInputClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  onChange={(e) => {
                    markDirty()
                    const raw = e.target.value
                    if (raw === '') {
                      setSlotCapEvening('')
                      return
                    }
                    const n = parseInt(raw, 10)
                    if (!Number.isNaN(n)) setSlotCapEvening(n)
                  }}
                />
              </div>
            </div>
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="contact_email" className="block w-full text-center">
              Email contatto
            </Label>
            <Input
              id="contact_email"
              type="email"
              value={contactEmail}
              disabled={upsert.isPending}
              className={anagraficaInputClassName}
              onChange={(e) => {
                markDirty()
                setContactEmail(stripDirectionalFormattingChars(e.target.value))
              }}
              placeholder="ristorante@example.com"
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="contact_phone" className="block w-full text-center">
              Telefono contatto
            </Label>
            <Input
              id="contact_phone"
              value={contactPhone}
              disabled={upsert.isPending}
              className={anagraficaInputClassName}
              onChange={(e) => {
                markDirty()
                setContactPhone(stripDirectionalFormattingChars(e.target.value))
              }}
              placeholder="+39 ..."
            />
          </div>
          <div className={anagraficaFieldWrapClass} style={anagraficaFieldStackStyle}>
            <Label htmlFor="contact_address" className="block w-full text-center">
              Indirizzo contatto
            </Label>
            <Input
              id="contact_address"
              value={contactAddress}
              disabled={upsert.isPending}
              className={anagraficaInputClassName}
              onChange={(e) => {
                markDirty()
                setContactAddress(stripDirectionalFormattingChars(e.target.value))
              }}
              placeholder="Via ..., Citta, CAP"
            />
          </div>
        </div>
      </section>

      <section className={sectionSurfaceClass}>
        <h3 className="text-lg font-semibold text-slate-800">Orari di apertura</h3>
        <p className="text-sm text-slate-600">
          Modifica gli orari visibili al pubblico nella pagina di Prenotazione.
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

      {!features.servizio && (
      <section className={sectionSurfaceClass}>
        <h3 className="text-lg font-semibold text-slate-800">Imposta Fasce Orarie</h3>
        <p className="text-sm text-slate-600">
          Cambia le fasce orarie in cui vengono raggruppate le prenotazioni nel calendario.
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          {slotValidationError && (
            <div className="mx-auto w-full max-w-[14rem] rounded-[1.25rem] border-2 border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-sm">
              {slotValidationError}
            </div>
          )}
          <div
            className="w-full rounded-xl border bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
            style={{ borderColor: ADMIN_WARM_BORDER }}
          >
            <p className="mb-1 text-sm font-semibold text-emerald-900">
              {morningName} · {bookingTimeSlots.morningStart} - {bookingTimeSlots.morningEnd}
            </p>
            {morningCrossesMidnight && (
              <p className="mb-2 flex items-center justify-center gap-1.5 text-xs text-amber-700">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {OVERNIGHT_TIME_END_HINT}
              </p>
            )}
            <div className="flex w-full flex-row flex-nowrap items-end justify-center gap-4 overflow-x-auto py-1 [scrollbar-width:thin] md:gap-8">
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('morningStart')}`}
                style={slotFieldStyle('morningStart')}
                ref={(el) => {
                  slotFieldRefs.current.morningStart = el
                }}
                onClick={() => clearSlotAttention('morningStart')}
              >
                <Label htmlFor="slot_morning_start" className="block w-full text-center">
                  Inizio {morningName}
                </Label>
                <TimePicker24h
                  id="slot_morning_start"
                  value={bookingTimeSlots.morningStart}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, morningStart: e }))
                  }}
                />
              </div>
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('morningEnd')}`}
                style={slotFieldStyle('morningEnd')}
                ref={(el) => {
                  slotFieldRefs.current.morningEnd = el
                }}
                onClick={() => clearSlotAttention('morningEnd')}
              >
                <Label htmlFor="slot_morning_end" className="block w-full text-center">
                  Fine {morningName}
                </Label>
                <TimePicker24h
                  id="slot_morning_end"
                  value={bookingTimeSlots.morningEnd}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, morningEnd: e }))
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="w-full rounded-xl border bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
            style={{ borderColor: ADMIN_WARM_BORDER }}
          >
            <p className="mb-1 text-sm font-semibold text-orange-900">
              {afternoonName} · {bookingTimeSlots.afternoonStart} - {bookingTimeSlots.afternoonEnd}
            </p>
            {afternoonCrossesMidnight && (
              <p className="mb-2 flex items-center justify-center gap-1.5 text-xs text-amber-700">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {OVERNIGHT_TIME_END_HINT}
              </p>
            )}
            <div className="flex w-full flex-row flex-nowrap items-end justify-center gap-4 overflow-x-auto py-1 [scrollbar-width:thin] md:gap-8">
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('afternoonStart')}`}
                style={slotFieldStyle('afternoonStart')}
                ref={(el) => {
                  slotFieldRefs.current.afternoonStart = el
                }}
                onClick={() => clearSlotAttention('afternoonStart')}
              >
                <Label htmlFor="slot_afternoon_start" className="block w-full text-center">
                  Inizio {afternoonName}
                </Label>
                <TimePicker24h
                  id="slot_afternoon_start"
                  value={bookingTimeSlots.afternoonStart}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, afternoonStart: e }))
                  }}
                />
              </div>
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('afternoonEnd')}`}
                style={slotFieldStyle('afternoonEnd')}
                ref={(el) => {
                  slotFieldRefs.current.afternoonEnd = el
                }}
                onClick={() => clearSlotAttention('afternoonEnd')}
              >
                <Label htmlFor="slot_afternoon_end" className="block w-full text-center">
                  Fine {afternoonName}
                </Label>
                <TimePicker24h
                  id="slot_afternoon_end"
                  value={bookingTimeSlots.afternoonEnd}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, afternoonEnd: e }))
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="w-full rounded-xl border bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
            style={{ borderColor: ADMIN_WARM_BORDER }}
          >
            <p className="mb-1 text-sm font-semibold text-sky-900">
              {eveningName} · {bookingTimeSlots.eveningStart} - {bookingTimeSlots.eveningEnd}
            </p>
            {eveningCrossesMidnight && (
              <p className="mb-2 flex items-center justify-center gap-1.5 text-xs text-amber-700">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {OVERNIGHT_TIME_END_HINT}
              </p>
            )}
            <div className="flex w-full flex-row flex-nowrap items-end justify-center gap-4 overflow-x-auto py-1 [scrollbar-width:thin] md:gap-8">
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('eveningStart')}`}
                style={slotFieldStyle('eveningStart')}
                ref={(el) => {
                  slotFieldRefs.current.eveningStart = el
                }}
                onClick={() => clearSlotAttention('eveningStart')}
              >
                <Label htmlFor="slot_evening_start" className="block w-full text-center">
                  Inizio {eveningName}
                </Label>
                <TimePicker24h
                  id="slot_evening_start"
                  value={bookingTimeSlots.eveningStart}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, eveningStart: e }))
                  }}
                />
              </div>
              <div
                className={`w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center ${slotFieldClass('eveningEnd')}`}
                style={slotFieldStyle('eveningEnd')}
                ref={(el) => {
                  slotFieldRefs.current.eveningEnd = el
                }}
                onClick={() => clearSlotAttention('eveningEnd')}
              >
                <Label htmlFor="slot_evening_end" className="block w-full text-center">
                  Fine {eveningName}
                </Label>
                <TimePicker24h
                  id="slot_evening_end"
                  value={bookingTimeSlots.eveningEnd}
                  disabled={upsert.isPending}
                  onChange={(e) => {
                    markDirty()
                    setBookingTimeSlots((prev) => ({ ...prev, eveningEnd: e }))
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      <section className={bookingBgSectionClass} aria-labelledby="placement-areas-heading">
        <h3 id="placement-areas-heading" className="text-lg font-semibold text-slate-800">
          Aree di posizionamento
        </h3>
        <p className="text-sm text-slate-600">
          Inserisci o modifica aree della tua attività per indicare il posizionamento delle prenotazioni.
        </p>
        <div className="mx-auto flex w-full max-w-[280px] flex-col items-stretch">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddPlacementArea}
            disabled={upsert.isPending}
            className={cn(
              'h-16 w-full shrink-0 gap-2 rounded-lg border-2 border-primary-700 bg-primary-600 px-3 py-0 text-sm font-medium text-white shadow-none transition-colors hover:bg-primary-500 hover:border-primary-600 hover:shadow-none focus:ring-primary-300'
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            Aggiungi nuova area
          </Button>
        </div>

        <div className="flex w-full flex-col items-center gap-[28px]">
          {placementAreas.map((area, index) => {
            const isEditing = editingPlacementAreaIndex === index
            return (
              <React.Fragment key={`${area}-${index}`}>
                {isEditing ? (
                  <div className="flex w-full max-w-md flex-col items-center gap-3">
                    <Input
                      value={editingPlacementAreaDraft}
                      onChange={(event) =>
                        setEditingPlacementAreaDraft(
                          stripDirectionalFormattingChars(event.target.value).slice(
                            0,
                            PLACEMENT_AREA_MAX_LENGTH
                          )
                        )
                      }
                      maxLength={PLACEMENT_AREA_MAX_LENGTH}
                      className="w-full rounded-xl border border-slate-300 text-center focus-visible:outline-none focus:ring-1 focus:ring-primary-300 focus:border-primary-500"
                      placeholder="Nome area"
                      autoFocus
                    />
                    <div className="flex w-full flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSavePlacementArea(index)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl border-2 border-emerald-700 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                        style={{ background: '#16a34a', color: '#ffffff', borderColor: '#15803d' }}
                      >
                        <Save className="h-4 w-4" />
                        Salva
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditPlacementArea}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-500/30"
                        style={{ borderColor: '#dc2626', color: '#dc2626' }}
                      >
                        <X className="h-4 w-4" />
                        Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="menu-prices-item-row w-full max-w-md">
                    <div className="menu-prices-item-text overflow-hidden">
                      <h4 className="font-semibold text-gray-900">{area}</h4>
                    </div>
                    <div className="menu-prices-item-actions shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditPlacementArea(index)}
                        disabled={upsert.isPending}
                        className="menu-prices-icon-btn menu-prices-icon-btn--edit"
                        aria-label={`Modifica ${area}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePlacementArea(index)}
                        disabled={upsert.isPending || placementAreas.length <= 1}
                        className="menu-prices-icon-btn menu-prices-icon-btn--delete"
                        aria-label={`Elimina ${area}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </section>

      <section className={bookingBgSectionClass}>
        <h3 className="text-lg font-semibold text-slate-800">Sfondo pagina Prenota</h3>
        <p className="text-sm text-slate-600">
          Scegli una texture, conferma la tua scelta e salva le modifiche.
        </p>
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-end">
            <div
              className="flex flex-shrink-0 flex-row flex-nowrap items-center"
              style={bookingBgTextureTabRowStyle}
            >
              <button
                type="button"
                disabled={upsert.isPending}
                className={bookingBgNavyToggleClass(bookingBgTextureTab === 'images')}
                style={bookingBgNavyToggleButtonStyle}
                onClick={() => setBookingBgTextureTab('images')}
              >
                Immagini
              </button>
              <button
                type="button"
                disabled={upsert.isPending}
                className={bookingBgNavyToggleClass(bookingBgTextureTab === 'gradients')}
                style={bookingBgNavyToggleButtonStyle}
                onClick={() => setBookingBgTextureTab('gradients')}
              >
                Gradienti
              </button>
            </div>
          </div>

          {bookingBgTextureTab === 'images' ? (
            <div
              className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-2 sm:gap-2.5"
              style={bookingBgGridTopSpacingStyle}
            >
              {bookingBgAvailableTileIds.map((id) => {
                const overallIndex = BOOKING_PAGE_TILE_IDS.indexOf(id)
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={upsert.isPending || bookingBgSelectionLocked}
                    className={bookingBgPickButtonClass(bookingPageBackground === id)}
                    onClick={() => {
                      setBookingPageBackground(id)
                      markDirty()
                    }}
                  >
                    <img
                      src={bookingPageTilePublicHref(id, bookingBgBase)}
                      alt=""
                      className="pointer-events-none aspect-[4/3] h-auto w-full rounded-md border border-slate-200/80 object-cover"
                      loading="lazy"
                    />
                    <span className="line-clamp-2 min-h-[1.5em] px-px text-[0.625rem] font-semibold leading-snug text-slate-700 sm:text-[11px]">
                      Texture {overallIndex + 1}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
          <div
            className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-2 sm:gap-2.5"
            style={bookingBgGridTopSpacingStyle}
          >
            {BOOKING_PAGE_GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                disabled={upsert.isPending || bookingBgSelectionLocked}
                className={bookingBgPickButtonClass(bookingPageBackground === preset.id)}
                onClick={() => {
                  setBookingPageBackground(preset.id)
                  markDirty()
                }}
              >
                <div
                  className="pointer-events-none aspect-[4/3] w-full rounded-md border border-slate-200/80"
                  style={{
                    backgroundColor: BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR,
                    backgroundImage: bookingPageGradientPreviewCss(preset.id),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <span className="line-clamp-2 min-h-[1.5em] px-px text-[0.625rem] font-semibold leading-snug text-slate-700 sm:text-[11px]">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
          )}
        </div>

        {(bookingBgHasUnsavedChoice || bookingBgSelectionLocked) && (
          <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2 pt-1">
            <Button
              type="button"
              variant="primary"
              onClick={handleBookingBgConfirmOrCancel}
              disabled={upsert.isPending || !tenantId}
              style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
              className="min-h-[2.875rem] w-full max-w-xs border-0 bg-primary-800 px-6 py-2.5 text-white shadow-md transition-colors duration-150 hover:bg-primary-700 hover:shadow-lg focus:ring-primary-400 disabled:pointer-events-none disabled:bg-primary-800 [&_svg]:text-white"
            >
              {bookingBgSelectionLocked ? 'Annulla selezione sfondo' : 'Conferma selezione sfondo'}
            </Button>
            {bookingBgSelectionLocked && bookingBgHasUnsavedChoice && (
              <p className="text-xs font-semibold leading-snug text-emerald-800">
                Selezione confermata. Salva modifiche in fondo per pubblicarla sulla pagina Prenota.
              </p>
            )}
          </div>
        )}
      </section>

      <section className={bookingBgSectionClass} aria-labelledby="app-theme-heading">
        <h3 id="app-theme-heading" className="text-lg font-semibold text-slate-800">
          Selezione tema app
        </h3>
        <p className="text-sm text-slate-600">
          Tocca l&apos;immagine o il nome del tema per selezionarlo subito. Tocca l&apos;icona occhio al centro per l&apos;anteprima
          grande (su desktop compare passando il mouse sull&apos;immagine). Nella finestra puoi usare «Usa questo tema», poi
          salva in fondo per applicare alla dashboard.
        </p>
        <div
          className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-2 sm:gap-2.5"
          style={bookingBgGridTopSpacingStyle}
        >
          {APP_THEME_OPTIONS.map((opt) => (
            <AppThemePreviewPick
              key={opt.id}
              previewSrc={opt.previewSrc}
              previewModalSrc={opt.previewModalSrc}
              label={opt.label}
              selected={appTheme === opt.id}
              disabled={upsert.isPending}
              pickButtonClass={bookingBgPickButtonClass}
              onPick={() => {
                setAppTheme(opt.id)
                markDirty()
              }}
            />
          ))}
        </div>
      </section>

      <div className="restaurant-settings-save-footer admin-warm-surface flex min-h-[4.75rem] w-full max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-xl border px-6 py-6 shadow-sm md:min-h-[5.25rem] md:px-8 md:py-7">
        <Button
          type="button"
          onClick={handleSave}
          disabled={upsert.isPending || !tenantId}
          className="restaurant-settings-save-submit min-h-[3.75rem] border-2 border-primary-700 bg-primary-600 px-10 py-5 text-base shadow-md hover:bg-primary-500 hover:border-primary-600 hover:shadow-lg focus:ring-primary-300 disabled:pointer-events-none disabled:border-primary-700 disabled:bg-primary-600"
        >
          {upsert.isPending ? (
            <>
              <Loader2 className="h-6 w-6 shrink-0 animate-spin" />
              Salvataggio…
            </>
          ) : (
            'Salva modifiche'
          )}
        </Button>
        {dirty && !upsert.isPending && (
          <span
            className="restaurant-settings-save-footer-msg max-w-xl text-center text-base font-semibold leading-snug text-slate-900"
            style={{ color: 'var(--color-text)', WebkitTextFillColor: 'var(--color-text)' }}
          >
            Modifiche non salvate.
          </span>
        )}
      </div>
    </div>
  )
}
