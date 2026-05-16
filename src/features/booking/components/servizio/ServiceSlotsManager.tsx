import type { FC, FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, AlertCircle, Clock, Users } from 'lucide-react'
import { Modal, Button, Input } from '@/components/ui'
import { toast } from 'react-toastify'
import {
  useServiceSlots,
  useCreateServiceSlot,
  useUpdateServiceSlot,
  useDeleteServiceSlot,
  slotCrossesMidnight,
  type ServiceSlot,
} from '@/features/booking/hooks/useServiceSlots'
import { useBusinessHours } from '@/hooks/useBusinessHours'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function maxTurnsLabel(maxTurns: number | null): string {
  if (maxTurns === null) return 'Illimitata'
  if (maxTurns === 0) return 'Chiusa'
  return `${maxTurns} ${maxTurns === 1 ? 'turno' : 'turni'}`
}

function maxTurnsBadgeClass(maxTurns: number | null): string {
  if (maxTurns === null) return 'bg-emerald-100 text-emerald-800'
  if (maxTurns === 0) return 'bg-red-100 text-red-800'
  return 'bg-blue-100 text-blue-800'
}

/** Verifica se uno slot (start_time, end_time) ricade negli orari di apertura per almeno un giorno */
function isSlotOutsideBusinessHours(
  startTime: string,
  businessHours: ReturnType<typeof useBusinessHours>['data'],
): boolean {
  if (!businessHours) return false

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

  const startInAnyOpenDay = days.some((day) => {
    const slots = businessHours[day]
    if (!slots || slots.length === 0) return false
    return slots.some((slot) => {
      const [sh, sm] = startTime.split(':').map(Number)
      const [oh, om] = slot.open.split(':').map(Number)
      const [ch, cm] = slot.close.split(':').map(Number)
      const startMin = sh * 60 + sm
      const openMin = oh * 60 + om
      let closeMin = ch * 60 + cm
      if (closeMin === 0) closeMin = 1440
      if (closeMin < openMin) closeMin += 1440
      return startMin >= openMin && startMin < closeMin
    })
  })

  return !startInAnyOpenDay
}

// ─────────────────────────────────────────────
// Modal CRUD
// ─────────────────────────────────────────────

interface SlotModalProps {
  isOpen: boolean
  onClose: () => void
  initial: ServiceSlot | null
}

const SlotModal: FC<SlotModalProps> = ({ isOpen, onClose, initial }) => {
  const isEdit = Boolean(initial)
  const { data: businessHours } = useBusinessHours()

  const [name, setName] = useState(initial?.name ?? '')
  const [startTime, setStartTime] = useState(initial?.start_time ?? '12:00')
  const [endTime, setEndTime] = useState(initial?.end_time ?? '15:00')
  const [maxTurnsStr, setMaxTurnsStr] = useState(
    initial?.max_turns === null ? '' : String(initial?.max_turns ?? ''),
  )
  const [maxGuestsStr, setMaxGuestsStr] = useState(
    initial?.max_guests == null ? '' : String(initial.max_guests),
  )
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName(initial?.name ?? '')
      setStartTime(initial?.start_time?.slice(0, 5) ?? '12:00')
      setEndTime(initial?.end_time?.slice(0, 5) ?? '15:00')
      setMaxTurnsStr(initial?.max_turns === null || initial?.max_turns === undefined ? '' : String(initial.max_turns))
      setMaxGuestsStr(initial?.max_guests == null ? '' : String(initial.max_guests))
      setValidationError(null)
    }
  }, [isOpen, initial])

  const create = useCreateServiceSlot()
  const update = useUpdateServiceSlot()
  const isPending = create.isPending || update.isPending

  const showOutsideAlert =
    name !== '' &&
    startTime !== '' &&
    isSlotOutsideBusinessHours(startTime, businessHours)

  const crossesMidnight = startTime && endTime && endTime < startTime

  function validate(): string | null {
    if (!name.trim()) return 'Il nome della fascia è obbligatorio.'
    if (!startTime) return "L'orario di inizio è obbligatorio."
    if (!endTime) return "L'orario di fine è obbligatorio."
    if (maxTurnsStr !== '' && (isNaN(Number(maxTurnsStr)) || Number(maxTurnsStr) < 0))
      return 'I turni massimi devono essere un numero ≥ 0 (0 = fascia chiusa, vuoto = illimitato).'
    if (maxGuestsStr !== '' && (isNaN(Number(maxGuestsStr)) || Number(maxGuestsStr) < 1))
      return 'I coperti massimi devono essere un numero ≥ 1 (vuoto = nessun limite).'
    return null
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setValidationError(err); return }
    setValidationError(null)

    const payload = {
      name: name.trim(),
      start_time: startTime,
      end_time: endTime,
      max_turns: maxTurnsStr === '' ? null : Number(maxTurnsStr),
      max_guests: maxGuestsStr === '' ? null : Number(maxGuestsStr),
      display_order: initial?.display_order ?? 0,
    }

    const guestsChanged = payload.max_guests !== (initial?.max_guests ?? null)

    const handleSuccess = () => {
      if (guestsChanged && payload.max_guests != null) {
        toast.success(`Limite coperti per "${payload.name}" impostato a ${payload.max_guests}.`)
      } else if (guestsChanged && payload.max_guests == null) {
        toast.success(`Limite coperti per "${payload.name}" rimosso.`)
      }
      onClose()
    }

    if (isEdit && initial) {
      update.mutate({ id: initial.id, ...payload }, { onSuccess: handleSuccess })
    } else {
      create.mutate(payload, { onSuccess: handleSuccess })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Modifica fascia oraria' : 'Nuova fascia oraria'}
      size="sm"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="slot-name" className="block text-sm font-medium text-primary-900">
            Nome fascia
          </label>
          <Input
            id="slot-name"
            type="text"
            placeholder="Es. Pranzo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="slot-start" className="block text-sm font-medium text-primary-900">
              Inizio
            </label>
            <Input
              id="slot-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="slot-end" className="block text-sm font-medium text-primary-900">
              Fine
            </label>
            <Input
              id="slot-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        {crossesMidnight && (
          <p className="flex items-center gap-1.5 text-xs text-amber-700">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Fascia notturna — l'orario di fine cade nel giorno successivo.
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="slot-maxturns" className="block text-sm font-medium text-primary-900">
            Turni massimi per tavolo
          </label>
          <Input
            id="slot-maxturns"
            type="number"
            min={0}
            step={1}
            placeholder="Illimitato"
            value={maxTurnsStr}
            onChange={(e) => setMaxTurnsStr(e.target.value)}
            disabled={isPending}
          />
          <p className="text-xs text-(--color-text-muted)">
            Lascia vuoto = illimitato · 0 = fascia chiusa
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="slot-maxguests" className="block text-sm font-medium text-primary-900">
            Coperti massimi per fascia
          </label>
          <Input
            id="slot-maxguests"
            type="number"
            min={1}
            step={1}
            placeholder="Nessun limite"
            value={maxGuestsStr}
            onChange={(e) => setMaxGuestsStr(e.target.value)}
            disabled={isPending}
          />
          <p className="text-xs text-(--color-text-muted)">
            Lascia vuoto = nessun limite
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">
          <Users className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Impostando i coperti massimi, le prenotazioni dei clienti che superano il limite verranno rifiutate automaticamente dal sistema.
          </span>
        </div>

        {showOutsideAlert && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              Questa fascia è fuori dall'orario di apertura comunicato ai clienti.
            </span>
          </div>
        )}

        {validationError && (
          <p className="text-sm text-red-600" role="alert">
            {validationError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
            Annulla
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isPending}>
            {isPending ? 'Salvataggio…' : isEdit ? 'Salva modifiche' : 'Aggiungi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Riga fascia
// ─────────────────────────────────────────────

interface SlotRowProps {
  slot: ServiceSlot
  onEdit: (slot: ServiceSlot) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

const SlotRow: FC<SlotRowProps> = ({ slot, onEdit, onDelete, isDeleting }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const crossesMidnight = slotCrossesMidnight(slot)

  return (
    <div className="flex items-center justify-between rounded-xl border border-(--color-border) bg-surface px-4 py-3 shadow-sm">
      <div>
        <p className="font-semibold text-primary-900">{slot.name}</p>
        <p className="mt-0.5 text-sm text-(--color-text-muted)">
          {slot.start_time.slice(0, 5)} → {slot.end_time.slice(0, 5)}
          {crossesMidnight && (
            <span className="ml-1.5 text-xs text-amber-600">(notturna +1)</span>
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {slot.max_guests != null && (
          <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
            <Users className="h-3 w-3 shrink-0" aria-hidden />
            {slot.max_guests} cop.
          </span>
        )}
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${maxTurnsBadgeClass(slot.max_turns)}`}>
          {maxTurnsLabel(slot.max_turns)}
        </span>

        {confirmDelete ? (
          <>
            <span className="text-xs text-red-600">Eliminare?</span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isDeleting}
              onClick={() => { onDelete(slot.id); setConfirmDelete(false) }}
            >
              Sì
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(false)}
            >
              No
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Modifica ${slot.name}`}
              onClick={() => onEdit(slot)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Elimina ${slot.name}`}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Componente principale
// ─────────────────────────────────────────────

export const ServiceSlotsManager: FC = () => {
  const { data: slots = [], isLoading, error } = useServiceSlots()
  const deleteSlot = useDeleteServiceSlot()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceSlot | null>(null)

  function openAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(slot: ServiceSlot) {
    setEditing(slot)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-primary-900">Fasce orarie</h2>
          <p className="mt-0.5 text-sm text-(--color-text-muted)">
            Organizza i turni in sala per il servizio al cliente.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" aria-hidden />
          Aggiungi fascia
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          Impossibile caricare le fasce orarie.
        </div>
      )}

      {isLoading && !error && (
        <div className="flex h-24 items-center justify-center rounded-xl border border-(--color-border) bg-surface">
          <span className="text-sm text-(--color-text-muted)">Caricamento…</span>
        </div>
      )}

      {!isLoading && !error && slots.length === 0 && (
        <div className="rounded-xl border border-dashed border-(--color-border) bg-surface px-6 py-8 text-center">
          <p className="font-semibold text-primary-900">Nessuna fascia configurata.</p>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            Aggiungi la prima fascia oraria con il pulsante in alto.
          </p>
        </div>
      )}

      {!isLoading && !error && slots.length > 0 && (
        <div className="space-y-2">
          {slots.map((slot) => (
            <SlotRow
              key={slot.id}
              slot={slot}
              onEdit={openEdit}
              onDelete={(id) => deleteSlot.mutate(id)}
              isDeleting={deleteSlot.isPending}
            />
          ))}
        </div>
      )}

      <SlotModal isOpen={modalOpen} onClose={closeModal} initial={editing} />
    </div>
  )
}
