import type { FC, FormEvent } from 'react'
import { useState } from 'react'
import { Modal, Button, Input } from '@/components/ui'
import { useWalkInMutation } from '@/features/booking/hooks/useWalkInMutation'
import { useTables } from '@/features/booking/hooks/useServizioTables'

interface WalkInModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WalkInModal: FC<WalkInModalProps> = ({ isOpen, onClose }) => {
  const [clientName, setClientName] = useState('')
  const [numGuests, setNumGuests] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const walkIn = useWalkInMutation()
  const { data: tables = [] } = useTables()

  function validate(): string | null {
    const n = Number(numGuests)
    if (!numGuests || isNaN(n) || n < 1 || n > 20 || !Number.isInteger(n)) {
      return 'Il numero di coperti deve essere un intero tra 1 e 20.'
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

    walkIn.mutate(
      { client_name: clientName, num_guests: Number(numGuests) },
      {
        onSuccess: () => {
          setClientName('')
          setNumGuests('')
          onClose()
        },
      },
    )
  }

  function handleClose() {
    setClientName('')
    setNumGuests('')
    setValidationError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Aggiungi walk-in" size="sm">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="walkin-name" className="block text-sm font-medium text-primary-900">
            Nome cliente <span className="text-(--color-text-muted)">(opzionale)</span>
          </label>
          <Input
            id="walkin-name"
            type="text"
            placeholder="Es. Tavolo 3"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            disabled={walkIn.isPending}
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="walkin-guests" className="block text-sm font-medium text-primary-900">
            Numero coperti <span className="text-red-500">*</span>
          </label>
          <Input
            id="walkin-guests"
            type="number"
            min={1}
            max={20}
            step={1}
            placeholder="Es. 2"
            value={numGuests}
            onChange={(e) => setNumGuests(e.target.value)}
            disabled={walkIn.isPending}
          />
        </div>

        {/* Info tavoli disponibili (sola lettura, per riferimento operativo) */}
        {tables.length > 0 && (
          <p className="text-xs text-(--color-text-muted)">
            Tavoli attivi: {tables.map((t) => t.name).join(', ')}
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
