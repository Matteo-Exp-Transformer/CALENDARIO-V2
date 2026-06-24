import type { FC, FormEvent } from 'react'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Modal, Button, Input } from '@/components/ui'
import { useWalkInMutation } from '@/features/booking/hooks/useWalkInMutation'
import { useTables } from '@/features/booking/hooks/useServizioTables'
import { useRooms } from '@/features/booking/hooks/useRooms'
import { useAcceptedBookings } from '@/features/booking/hooks/useBookingQueries'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'
import { useCapacityCheck } from '@/features/booking/hooks/useCapacityCheck'
import { useServiceSlots } from '@/features/booking/hooks/useServiceSlots'

interface WalkInModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Verifica se un tavolo è occupato ora: almeno una prenotazione accepted
 * con confirmed_start ≤ now < confirmed_end E placement uguale al NOME del tavolo.
 *
 * Perché il NOME e non l'id: booking_requests non ha colonna table_id —
 * il walk-in (e le prenotazioni manual) salvano placement = nome del tavolo.
 * L'identità per id arriverà con il modello assignment (B3/B4).
 */
function isBusy(
  tableName: string,
  acceptedBookings: { placement?: string | null; confirmed_start?: string | null; confirmed_end?: string | null }[],
): boolean {
  const now = new Date()
  return acceptedBookings.some((b) => {
    if (b.placement !== tableName) return false
    if (!b.confirmed_start || !b.confirmed_end) return false
    return new Date(b.confirmed_start) <= now && now < new Date(b.confirmed_end)
  })
}

export const WalkInModal: FC<WalkInModalProps> = ({ isOpen, onClose }) => {
  const [clientName, setClientName] = useState('')
  const [numGuests, setNumGuests] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')
  const [selectedTableId, setSelectedTableId] = useState<string>('')
  const [validationError, setValidationError] = useState<string | null>(null)
  // D25: flag per forzare l'inserimento nonostante avvisi morbidi
  const [forceOverCapacity, setForceOverCapacity] = useState(false)
  const [forceBusyTable, setForceBusyTable] = useState(false)

  const walkIn = useWalkInMutation()
  const { data: tables = [] } = useTables()
  const { data: rooms = [] } = useRooms()
  const { data: acceptedBookings = [] } = useAcceptedBookings()
  const { data: maxGuests = 20 } = useRestaurantSetting('walk_in_max_guests', { authenticated: true })
  const { data: serviceSlots = [] } = useServiceSlots()

  // Fascia corrente: la prima fascia il cui intervallo contiene "ora"
  const now = new Date()
  const nowHm = format(now, 'HH:mm')
  const todayDate = format(now, 'yyyy-MM-dd')
  const activeSlot = useMemo(() => {
    return serviceSlots.find((s) => s.start_time.slice(0, 5) <= nowHm && nowHm < s.end_time.slice(0, 5)) ?? null
  }, [serviceSlots, nowHm])

  // Orario di fine stimato in base al resolver: lo calcoliamo qui per stimare la finestra
  // e passarla a useCapacityCheck. Il valore effettivo lo risolve useWalkInMutation.
  // Se non c'è durata configurata usiamo 90 min (fallback identico alla mutation).
  const slotMinDuration = activeSlot?.min_duration ?? undefined
  // useCapacityCheck richiede endTime come stringa HH:mm
  const estimatedEndMinutes = now.getMinutes() + now.getHours() * 60 + (slotMinDuration ?? 90)
  const estimatedEndHm = `${String(Math.floor(estimatedEndMinutes / 60) % 24).padStart(2, '0')}:${String(estimatedEndMinutes % 60).padStart(2, '0')}`

  // D45.1: usa useCapacityCheck per la fascia che contiene "ora".
  // Il walk-in (accepted + confirmed_start/end) è già incluso in acceptedBookings,
  // quindi viene conteggiato automaticamente da useCapacityCheck senza duplicazioni.
  const capacityCheck = useCapacityCheck({
    date: todayDate,
    startTime: nowHm,
    endTime: estimatedEndHm,
    numGuests: Number(numGuests) || 0,
    acceptedBookings,
  })

  // Capienza fascia corrente superata?
  const isOverCapacity = !capacityCheck.isAvailable && Number(numGuests) > 0

  const tablesInRoom = useMemo(() => {
    if (!selectedRoomId) return []
    return tables.filter((t) => t.room_id === selectedRoomId)
  }, [tables, selectedRoomId])

  const tableOptions = useMemo(() => {
    return tablesInRoom.map((t) => ({
      ...t,
      // Bug #6 fix: confronta per NOME perché placement = nome (non id) nel DB.
      // Vedi commento su isBusy per il perché.
      busy: isBusy(t.name, acceptedBookings),
    }))
  }, [tablesInRoom, acceptedBookings])

  const selectedTable = tables.find((t) => t.id === selectedTableId) ?? null
  // Tavolo selezionato risulta occupato?
  const isSelectedTableBusy = selectedTable ? isBusy(selectedTable.name, acceptedBookings) : false

  function resetForm() {
    setClientName('')
    setNumGuests('')
    setSelectedRoomId('')
    setSelectedTableId('')
    setValidationError(null)
    setForceOverCapacity(false)
    setForceBusyTable(false)
  }

  function validate(): string | null {
    const n = Number(numGuests)
    if (!numGuests || isNaN(n) || n < 1 || !Number.isInteger(n)) {
      return 'Il numero di coperti deve essere un intero di almeno 1.'
    }
    if (rooms.length > 0 && !selectedRoomId) {
      return 'Seleziona una sala.'
    }
    if (selectedRoomId && tablesInRoom.length > 0 && !selectedTableId) {
      return 'Seleziona un tavolo.'
    }
    return null
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)

    // D25: avvisi morbidi — se l'operatore non ha ancora confermato, mostra l'avviso
    // e blocca solo il primo tentativo (non l'invio definitivo).
    if (isOverCapacity && !forceOverCapacity) {
      setForceOverCapacity(true)
      return
    }
    if (isSelectedTableBusy && !forceBusyTable) {
      setForceBusyTable(true)
      return
    }

    walkIn.mutate(
      {
        client_name: clientName,
        num_guests: Number(numGuests),
        placement: selectedTable?.name ?? undefined,
        slot_min_duration: slotMinDuration,
      },
      {
        onSuccess: () => {
          resetForm()
          onClose()
        },
      },
    )
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Aggiungi walk-in" size="sm">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Nome cliente */}
        <div className="space-y-1">
          <label htmlFor="walkin-name" className="block text-sm font-medium text-primary-900">
            Nome cliente <span className="text-(--color-text-muted)">(opzionale)</span>
          </label>
          <Input
            id="walkin-name"
            type="text"
            placeholder="Es. Rossi"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            disabled={walkIn.isPending}
            autoFocus
          />
        </div>

        {/* Numero coperti */}
        <div className="space-y-1">
          <label htmlFor="walkin-guests" className="block text-sm font-medium text-primary-900">
            Numero coperti <span className="text-red-500">*</span>
          </label>
          <Input
            id="walkin-guests"
            type="number"
            min={1}
            max={maxGuests}
            step={1}
            placeholder="Es. 2"
            value={numGuests}
            onChange={(e) => {
              setNumGuests(e.target.value)
              // Resetta la forzatura capienza quando l'operatore cambia i coperti
              setForceOverCapacity(false)
            }}
            disabled={walkIn.isPending}
          />
        </div>

        {/* Sala */}
        {rooms.length > 0 && (
          <div className="space-y-1">
            <label htmlFor="walkin-room" className="block text-sm font-medium text-primary-900">
              Sala <span className="text-red-500">*</span>
            </label>
            <select
              id="walkin-room"
              value={selectedRoomId}
              onChange={(e) => {
                setSelectedRoomId(e.target.value)
                setSelectedTableId('')
                setForceBusyTable(false)
              }}
              disabled={walkIn.isPending}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">— Seleziona sala —</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tavolo — mostrato solo se sala selezionata e ha tavoli */}
        {selectedRoomId && tablesInRoom.length > 0 && (
          <div className="space-y-1">
            <label htmlFor="walkin-table" className="block text-sm font-medium text-primary-900">
              Tavolo <span className="text-red-500">*</span>
            </label>
            <select
              id="walkin-table"
              value={selectedTableId}
              onChange={(e) => {
                setSelectedTableId(e.target.value)
                // Resetta la forzatura tavolo occupato quando l'operatore cambia selezione
                setForceBusyTable(false)
              }}
              disabled={walkIn.isPending}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">— Seleziona tavolo —</option>
              {tableOptions.map((t) => (
                // D25: tavolo "occupato" non è più disabled — l'operatore può sempre selezionarlo.
                // La segnalazione avviene via avviso forzabile sotto il select.
                <option key={t.id} value={t.id}>
                  {t.name} ({t.capacity} posti){t.busy ? ' — occupato' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedRoomId && tablesInRoom.length === 0 && (
          <p className="text-sm text-amber-700 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            Nessun tavolo configurato in questa sala.
          </p>
        )}

        {/* D25 — Avviso morbido: capienza fascia superata */}
        {isOverCapacity && (
          <p className="text-sm text-amber-700 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2" role="alert" data-testid="capacity-warning">
            {forceOverCapacity
              ? 'Stai aggiungendo il walk-in oltre la capienza della fascia. Premi "Aggiungi walk-in" per confermare.'
              : 'La fascia è al completo. Puoi comunque aggiungere il walk-in — premi di nuovo per confermare.'}
          </p>
        )}

        {/* D25 — Avviso morbido: tavolo occupato */}
        {isSelectedTableBusy && (
          <p className="text-sm text-amber-700 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2" role="alert" data-testid="busy-table-warning">
            {forceBusyTable
              ? 'Stai assegnando un tavolo già occupato. Premi "Aggiungi walk-in" per confermare.'
              : 'Questo tavolo risulta già occupato. Puoi comunque procedere — premi di nuovo per confermare.'}
          </p>
        )}

        {validationError && (
          <p className="text-sm text-red-600" role="alert">
            {validationError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={handleClose} disabled={walkIn.isPending}>
            Annulla
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={walkIn.isPending}>
            {walkIn.isPending ? 'Aggiunta…' : 'Aggiungi walk-in'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
