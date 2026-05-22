import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Store, Loader2, Eye, Clock, Plus, Trash2 } from 'lucide-react'
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
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'
import { useFeatures } from '@/hooks/useFeatures'
import {
  OVERNIGHT_TIME_END_HINT,
  slotCrossesMidnight,
  slotRangesOverlap,
} from '@/features/booking/utils/bookingTimeSlots'
import {
  useServiceSlots,
  useUpdateServiceSlot,
  useCreateServiceSlot,
  useDeleteServiceSlot,
  SERVICE_SLOTS_QUERY_KEY,
  type SlotConfig,
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

const RESTAURANT_NAME_MAX_LENGTH = 40
const SLOT_NAME_MAX_LENGTH = 40
const TEMP_SLOT_ID_PREFIX = 'temp-'
const isTempSlotId = (id: string) => id.startsWith(TEMP_SLOT_ID_PREFIX)

type EditingSlot = {
  id: string
  name: string
  start_time: string
  end_time: string
  display_order: number
}

function validateEditingSlots(slots: EditingSlot[]): string | null {
  const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/
  for (const s of slots) {
    if (!HH_MM.test(s.start_time) || !HH_MM.test(s.end_time)) {
      return `Fascia "${s.name}": orari nel formato HH:mm richiesti`
    }
    if (s.start_time === s.end_time) {
      return `Fascia "${s.name}": inizio e fine coincidono`
    }
  }
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (slotRangesOverlap(slots[i].start_time, slots[i].end_time, slots[j].start_time, slots[j].end_time)) {
        return `Le fasce "${slots[i].name}" e "${slots[j].name}" si sovrappongono`
      }
    }
  }
  return null
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
  const timeSlotsEnabledQuery = useRestaurantSetting('booking_time_slots_enabled')
  const serviceSlotsQuery = useServiceSlots()
  const updateServiceSlot = useUpdateServiceSlot()
  const createServiceSlot = useCreateServiceSlot()
  const deleteServiceSlot = useDeleteServiceSlot()
  const hoursQuery = useRestaurantSetting('business_hours')
  const contactEmailQuery = useRestaurantSetting('contact_email')
  const contactPhoneQuery = useRestaurantSetting('contact_phone')
  const contactAddressQuery = useRestaurantSetting('contact_address')
  const publicBookingPageBgQuery = useRestaurantSetting('public_booking_page_background')
  const appThemeQuery = useRestaurantSetting('app_theme')
  const walkInMaxGuestsQuery = useRestaurantSetting('walk_in_max_guests')

  const upsert = useUpsertRestaurantSetting()

  const [dirty, setDirty] = useState(false)
  const [restaurantName, setRestaurantName] = useState('')
  const [dailyGuestLimit, setDailyGuestLimit] = useState<number | ''>('')
  const [walkInMaxGuests, setWalkInMaxGuests] = useState<number | ''>(20)
  const [slotCapacities, setSlotCapacities] = useState<Record<string, number | ''>>({})
  const [editingSlots, setEditingSlots] = useState<EditingSlot[]>([])
  /** Snapshot degli id delle fasce caricate dal DB al primo hydrate. Serve a rilevare le fasce
   *  rimosse dall'utente: id presenti qui ma assenti in editingSlots al Salva → DELETE su DB. */
  const [initialSlotIds, setInitialSlotIds] = useState<string[]>([])
  const [deleteConfirmSlot, setDeleteConfirmSlot] = useState<EditingSlot | null>(null)
  const tempSlotCounterRef = useRef(0)
  const [timeSlotsEnabled, setTimeSlotsEnabled] = useState(true)
  const [slotValidationError, setSlotValidationError] = useState<string | null>(null)
  const [businessHours, setBusinessHours] = useState<BusinessHours>(() => getDefaultBusinessHours())
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [bookingPageBackground, setBookingPageBackground] =
    useState<BookingPageBackgroundId>(DEFAULT_BOOKING_PAGE_BACKGROUND)
  const [bookingBgTextureTab, setBookingBgTextureTab] = useState<'images' | 'gradients'>('images')
  /** Dopo «Conferma» la griglia resta bloccata finche non si cambia selezione o non va a buon fine «Salva modifiche». */
  const [bookingBgSelectionLocked, setBookingBgSelectionLocked] = useState(false)
  const [appTheme, setAppTheme] = useState<AppThemeId>(DEFAULT_APP_THEME)

  const hydratedRef = useRef(false)

  useEffect(() => {
    hydratedRef.current = false
    setDirty(false)
    setBookingBgSelectionLocked(false)
  }, [tenantId])

  const allSuccess =
    nameQuery.isSuccess &&
    dailyGuestLimitQuery.isSuccess &&
    slotGuestCapacitiesQuery.isSuccess &&
    timeSlotsEnabledQuery.isSuccess &&
    serviceSlotsQuery.isSuccess &&
    hoursQuery.isSuccess &&
    contactEmailQuery.isSuccess &&
    contactPhoneQuery.isSuccess &&
    contactAddressQuery.isSuccess &&
    publicBookingPageBgQuery.isSuccess &&
    appThemeQuery.isSuccess &&
    walkInMaxGuestsQuery.isSuccess

  useEffect(() => {
    if (!allSuccess || hydratedRef.current) return
    setRestaurantName(
      stripDirectionalFormattingChars(String(nameQuery.data ?? '')).slice(0, RESTAURANT_NAME_MAX_LENGTH)
    )
    setDailyGuestLimit(dailyGuestLimitQuery.data ?? '')
    const sg = slotGuestCapacitiesQuery.data ?? {}
    const caps: Record<string, number | ''> = {}
    for (const [k, v] of Object.entries(sg)) {
      caps[k] = v == null ? '' : (v as number)
    }
    setSlotCapacities(caps)
    setTimeSlotsEnabled(timeSlotsEnabledQuery.data ?? true)
    const slots = (serviceSlotsQuery.data ?? [])
      .slice()
      .sort((a: SlotConfig, b: SlotConfig) => a.display_order - b.display_order)
    // Postgres TIME ritorna 'HH:mm:ss'; il form e validateEditingSlots usano 'HH:mm'.
    setEditingSlots(slots.map((s: SlotConfig) => ({
      id: s.id,
      name: s.name,
      start_time: s.start_time.slice(0, 5),
      end_time: s.end_time.slice(0, 5),
      display_order: s.display_order,
    })))
    setInitialSlotIds(slots.map((s: SlotConfig) => s.id))
    setBusinessHours(hoursQuery.data)
    setContactEmail(stripDirectionalFormattingChars(contactEmailQuery.data ?? ''))
    setContactPhone(stripDirectionalFormattingChars(contactPhoneQuery.data ?? ''))
    setContactAddress(stripDirectionalFormattingChars(contactAddressQuery.data ?? ''))
    const resolvedBg = publicBookingPageBgQuery.data ?? DEFAULT_BOOKING_PAGE_BACKGROUND
    setBookingPageBackground(resolvedBg)
    setBookingBgTextureTab(isBookingPageGradientId(resolvedBg) ? 'gradients' : 'images')
    setBookingBgSelectionLocked(false)
    setAppTheme(appThemeQuery.data ?? DEFAULT_APP_THEME)
    setWalkInMaxGuests(walkInMaxGuestsQuery.data ?? 20)
    hydratedRef.current = true
  }, [
    allSuccess,
    nameQuery.data,
    dailyGuestLimitQuery.data,
    slotGuestCapacitiesQuery.data,
    timeSlotsEnabledQuery.data,
    serviceSlotsQuery.data,
    hoursQuery.data,
    contactEmailQuery.data,
    contactPhoneQuery.data,
    contactAddressQuery.data,
    publicBookingPageBgQuery.data,
    appThemeQuery.data,
    walkInMaxGuestsQuery.data,
  ])

  const loading =
    nameQuery.isPending ||
    dailyGuestLimitQuery.isPending ||
    slotGuestCapacitiesQuery.isPending ||
    timeSlotsEnabledQuery.isPending ||
    serviceSlotsQuery.isPending ||
    hoursQuery.isPending ||
    contactEmailQuery.isPending ||
    contactPhoneQuery.isPending ||
    contactAddressQuery.isPending ||
    publicBookingPageBgQuery.isPending ||
    appThemeQuery.isPending

  const loadError =
    nameQuery.error ||
    dailyGuestLimitQuery.error ||
    slotGuestCapacitiesQuery.error ||
    timeSlotsEnabledQuery.error ||
    serviceSlotsQuery.error ||
    hoursQuery.error ||
    contactEmailQuery.error ||
    contactPhoneQuery.error ||
    contactAddressQuery.error ||
    publicBookingPageBgQuery.error ||
    appThemeQuery.error

  const markDirty = () => setDirty(true)

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

  // ---- Gestione fasce orarie (solo Classic) ----------------------------------
  const handleAddSlot = () => {
    markDirty()
    const nextOrder = editingSlots.length === 0
      ? 0
      : Math.max(...editingSlots.map((s) => s.display_order)) + 1
    const baseName = 'Nuova fascia'
    const existingNames = new Set(editingSlots.map((s) => s.name))
    let candidateName = baseName
    let counter = 2
    while (existingNames.has(candidateName)) {
      candidateName = `${baseName} ${counter}`
      counter += 1
    }
    tempSlotCounterRef.current += 1
    const tempId = `${TEMP_SLOT_ID_PREFIX}${tempSlotCounterRef.current}-${Date.now()}`
    setEditingSlots((prev) => [
      ...prev,
      { id: tempId, name: candidateName, start_time: '12:00', end_time: '14:00', display_order: nextOrder },
    ])
  }

  const handleSlotNameChange = (slotId: string, raw: string) => {
    markDirty()
    const safe = stripDirectionalFormattingChars(raw).slice(0, SLOT_NAME_MAX_LENGTH)
    setEditingSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, name: safe } : s)))
  }

  const handleRequestRemoveSlot = (slot: EditingSlot) => {
    setDeleteConfirmSlot(slot)
  }

  const handleConfirmRemoveSlot = () => {
    if (!deleteConfirmSlot) return
    markDirty()
    const removedId = deleteConfirmSlot.id
    setEditingSlots((prev) => prev.filter((s) => s.id !== removedId))
    // Pulisce anche la capacity associata se presente
    setSlotCapacities((prev) => {
      if (!(removedId in prev)) return prev
      const next = { ...prev }
      delete next[removedId]
      return next
    })
    setDeleteConfirmSlot(null)
  }

  const handleSave = async () => {
    if (!features.servizio && timeSlotsEnabled) {
      const validationError = validateEditingSlots(editingSlots)
      if (validationError) {
        setSlotValidationError(validationError)
        toast.error(validationError)
        return
      }
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

      let createdSlotIdMap: Record<string, string> = {}
      if (!features.servizio) {
        // 1) DELETE: fasce caricate dal DB e poi rimosse dall'utente.
        const currentIds = new Set(editingSlots.map((s) => s.id))
        const toDelete = initialSlotIds.filter((id) => !currentIds.has(id))
        if (toDelete.length > 0) {
          await Promise.all(toDelete.map((id) => deleteServiceSlot.mutateAsync(id)))
        }

        // 2) CREATE/UPDATE con display_order ricalcolato sequenzialmente
        //    (la posizione nell'array editingSlots, ordinato per inserimento).
        const orderedSlots = editingSlots.map((s, idx) => ({ ...s, display_order: idx }))
        for (const s of orderedSlots) {
          const safeName = stripDirectionalFormattingChars(s.name).trim().slice(0, SLOT_NAME_MAX_LENGTH) || 'Fascia'
          if (isTempSlotId(s.id)) {
            const created = await createServiceSlot.mutateAsync({
              name: safeName,
              start_time: s.start_time,
              end_time: s.end_time,
              max_turns: null,
              max_guests: null,
              display_order: s.display_order,
            })
            // Rimappa eventuali capacity temporanee dal tempId al vero uuid
            createdSlotIdMap[s.id] = created.id
          } else {
            await updateServiceSlot.mutateAsync({
              id: s.id,
              name: safeName,
              start_time: s.start_time,
              end_time: s.end_time,
              display_order: s.display_order,
              skipToast: true,
            })
          }
        }
        await queryClient.invalidateQueries({ queryKey: [SERVICE_SLOTS_QUERY_KEY] })
      }

      const slotCapValue: Record<string, number | null> = {}
      for (const [k, v] of Object.entries(slotCapacities)) {
        // Se la capacity era associata a un id temporaneo, rimappala al vero uuid creato.
        const targetId = createdSlotIdMap[k] ?? k
        // Scarta le capacity di slot che sono stati eliminati (id non più presente in editingSlots).
        const stillExists = editingSlots.some((s) => s.id === k || createdSlotIdMap[s.id] === targetId)
        if (!stillExists) continue
        slotCapValue[targetId] = v === '' ? null : (v as number)
      }

      await upsert.mutateAsync([
        { key: 'restaurant_name', value: safeName },
        { key: 'daily_guest_limit', value: dailyGuestLimit === '' ? null : dailyGuestLimit },
        { key: 'slot_guest_capacities', value: slotCapValue },
        { key: 'booking_time_slots_enabled', value: timeSlotsEnabled },
        { key: 'business_hours', value: businessHours },
        { key: 'contact_email', value: safeEmail },
        { key: 'contact_phone', value: safePhone },
        { key: 'contact_address', value: safeAddress },
        { key: 'public_booking_page_background', value: bookingPageBackground },
        { key: 'app_theme', value: appTheme },
        { key: 'walk_in_max_guests', value: walkInMaxGuests === '' ? 20 : walkInMaxGuests },
      ])
      await queryClient.refetchQueries({ queryKey: ['restaurant_settings'], type: 'active' })

      // Rimappa state locale dopo create/delete: ricarica gli id dal nuovo array slots.
      if (!features.servizio) {
        const refreshedSlots = (await serviceSlotsQuery.refetch()).data ?? []
        const orderedRefreshed = [...refreshedSlots].sort(
          (a: SlotConfig, b: SlotConfig) => a.display_order - b.display_order,
        )
        setEditingSlots(orderedRefreshed.map((s: SlotConfig) => ({
          id: s.id,
          name: s.name,
          start_time: s.start_time.slice(0, 5),
          end_time: s.end_time.slice(0, 5),
          display_order: s.display_order,
        })))
        setInitialSlotIds(orderedRefreshed.map((s: SlotConfig) => s.id))
        // Rimappa anche slotCapacities locali sui veri uuid (per id temp- creati ora)
        setSlotCapacities((prev) => {
          const next: Record<string, number | ''> = {}
          for (const [k, v] of Object.entries(prev)) {
            const targetId = createdSlotIdMap[k] ?? k
            if (orderedRefreshed.some((s: SlotConfig) => s.id === targetId)) {
              next[targetId] = v
            }
          }
          return next
        })
      }

      setSlotValidationError(null)
      setDirty(false)
      setBookingBgSelectionLocked(false)
    } catch {
      /* toast gestito da useUpsertRestaurantSetting.onError */
    }
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

        {/* Checkbox abilita raggruppamento per fasce */}
        <label className="mx-auto flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={timeSlotsEnabled}
            disabled={upsert.isPending}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            onChange={(e) => {
              markDirty()
              setTimeSlotsEnabled(e.target.checked)
            }}
          />
          Abilita raggruppamento per fasce orarie
        </label>

        <div className={cn('flex w-full flex-col items-center gap-4 transition-opacity', !timeSlotsEnabled && 'pointer-events-none opacity-50')}>
          {slotValidationError && (
            <div className="mx-auto w-full max-w-[14rem] rounded-[1.25rem] border-2 border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-sm">
              {slotValidationError}
            </div>
          )}

          {/* Bottone Aggiungi fascia */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddSlot}
            disabled={upsert.isPending}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Aggiungi fascia
          </Button>

          {editingSlots.length === 0 ? (
            <p className="text-sm italic text-slate-500">
              Nessuna fascia configurata. Aggiungi la prima fascia con il pulsante sopra.
            </p>
          ) : null}

          {editingSlots.map((slot, idx) => {
            const crossesMidnight = slotCrossesMidnight({ start_time: slot.start_time, end_time: slot.end_time })
            return (
              <div
                key={slot.id}
                className="w-full rounded-xl border bg-white/75 p-4 text-center shadow-md backdrop-blur-[2px]"
                style={{ borderColor: ADMIN_WARM_BORDER }}
              >
                {/* Riga nome fascia + bottone elimina */}
                <div className="mb-3 flex items-center justify-center gap-2">
                  <Input
                    aria-label={`Nome fascia ${idx + 1}`}
                    value={slot.name}
                    maxLength={SLOT_NAME_MAX_LENGTH}
                    disabled={upsert.isPending}
                    placeholder="Nome fascia"
                    className="max-w-xs rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 text-center text-sm font-semibold text-slate-900 shadow-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500"
                    onChange={(e) => handleSlotNameChange(slot.id, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRequestRemoveSlot(slot)}
                    disabled={upsert.isPending}
                    aria-label={`Rimuovi fascia ${slot.name}`}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>

                <p className="mb-1 text-xs text-slate-500">
                  {slot.start_time} - {slot.end_time}
                </p>
                {crossesMidnight && (
                  <p className="mb-2 flex items-center justify-center gap-1.5 text-xs text-amber-700">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {OVERNIGHT_TIME_END_HINT}
                  </p>
                )}
                <div className="flex w-full flex-row flex-nowrap items-end justify-center gap-4 overflow-x-auto py-1 [scrollbar-width:thin] md:gap-8">
                  <div className="w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center">
                    <Label htmlFor={`slot_start_${idx}`} className="block w-full text-center">
                      Inizio
                    </Label>
                    <TimePicker24h
                      id={`slot_start_${idx}`}
                      value={slot.start_time}
                      disabled={upsert.isPending}
                      onChange={(v) => {
                        markDirty()
                        setEditingSlots((prev) =>
                          prev.map((s, i) => i === idx ? { ...s, start_time: v } : s)
                        )
                      }}
                    />
                  </div>
                  <div className="w-[11.5rem] max-w-none shrink-0 space-y-1.5 text-center">
                    <Label htmlFor={`slot_end_${idx}`} className="block w-full text-center">
                      Fine
                    </Label>
                    <TimePicker24h
                      id={`slot_end_${idx}`}
                      value={slot.end_time}
                      disabled={upsert.isPending}
                      onChange={(v) => {
                        markDirty()
                        setEditingSlots((prev) =>
                          prev.map((s, i) => i === idx ? { ...s, end_time: v } : s)
                        )
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Label htmlFor={`slot_cap_${idx}`} className="text-sm text-slate-600 whitespace-nowrap">
                    Coperti max:
                  </Label>
                  <Input
                    id={`slot_cap_${idx}`}
                    type="number"
                    min={1}
                    max={5000}
                    value={slotCapacities[slot.id] ?? ''}
                    disabled={upsert.isPending}
                    placeholder="Nessun limite"
                    className="w-32 rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 text-center text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    onChange={(e) => {
                      markDirty()
                      const raw = e.target.value
                      setSlotCapacities((prev) => ({
                        ...prev,
                        [slot.id]: raw === '' ? '' : parseInt(raw, 10),
                      }))
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal di conferma eliminazione fascia */}
        {deleteConfirmSlot && (
          <Modal
            isOpen
            onClose={() => setDeleteConfirmSlot(null)}
            title="Elimina fascia oraria"
            size="sm"
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Vuoi eliminare la fascia{' '}
                <strong className="font-semibold">{deleteConfirmSlot.name}</strong>
                {' '}({deleteConfirmSlot.start_time} – {deleteConfirmSlot.end_time})?
              </p>
              <p className="text-xs text-slate-500">
                Le prenotazioni che cadono in questa fascia non avranno più raggruppamento dedicato:
                verranno mostrate nella sezione &laquo;Fuori fascia&raquo; del calendario.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeleteConfirmSlot(null)}
                  disabled={deleteServiceSlot.isPending}
                >
                  Annulla
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleConfirmRemoveSlot}
                  disabled={deleteServiceSlot.isPending}
                >
                  Elimina
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </section>
      )}

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
