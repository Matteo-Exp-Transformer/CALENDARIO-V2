import type { FC, FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Modal, Button, Input } from '@/components/ui'
import { useCreateTable, useUpdateTable } from '@/features/booking/hooks/useServizioTables'

export interface TableFormModalProps {
  isOpen: boolean
  onClose: () => void
  placements: string[]
  /** Sala preselezionata alla apertura in modalità "aggiungi" (ignorata in edit). */
  defaultPlacement?: string
  initial?: { id: string; name: string; capacity: number; placement: string } | null
}

export const TableFormModal: FC<TableFormModalProps> = ({ isOpen, onClose, placements, defaultPlacement, initial }) => {
  const isEdit = Boolean(initial)

  const [name, setName] = useState(initial?.name ?? '')
  const [capacity, setCapacity] = useState(String(initial?.capacity ?? ''))
  const [placement, setPlacement] = useState(initial?.placement ?? defaultPlacement ?? placements[0] ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)

  // Sincronizzo i campi quando `initial` o `defaultPlacement` cambiano (modal riutilizzato)
  useEffect(() => {
    if (isOpen) {
      setName(initial?.name ?? '')
      setCapacity(String(initial?.capacity ?? ''))
      setPlacement(initial?.placement ?? defaultPlacement ?? placements[0] ?? '')
      setValidationError(null)
    }
  }, [isOpen, initial, defaultPlacement, placements])

  const createTable = useCreateTable()
  const updateTable = useUpdateTable()

  const isPending = createTable.isPending || updateTable.isPending

  function validate(): string | null {
    if (!name.trim()) return 'Il nome del tavolo è obbligatorio.'
    const cap = Number(capacity)
    if (!capacity || isNaN(cap) || cap <= 0 || !Number.isInteger(cap)) return 'La capienza deve essere un intero maggiore di zero.'
    if (placements.length > 0 && !placements.includes(placement)) return 'Seleziona una sala valida.'
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

    const input = {
      name: name.trim(),
      capacity: Number(capacity),
      placement,
    }

    if (isEdit && initial) {
      updateTable.mutate(
        { id: initial.id, input },
        { onSuccess: onClose },
      )
    } else {
      createTable.mutate(input, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Modifica tavolo' : 'Aggiungi tavolo'}
      size="sm"
    >
      {placements.length === 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Nessuna sala configurata. Puoi aggiungere il tavolo senza sala e assegnarlo in seguito
            tramite <strong>Impostazioni → Aree di posizionamento</strong>.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Nome tavolo */}
        <div className="space-y-1">
          <label htmlFor="table-name" className="block text-sm font-medium text-slate-700">
            Nome tavolo
          </label>
          <Input
            id="table-name"
            type="text"
            placeholder="Es. Tavolo 1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            autoFocus
          />
        </div>

        {/* Capienza */}
        <div className="space-y-1">
          <label htmlFor="table-capacity" className="block text-sm font-medium text-slate-700">
            Capienza (posti)
          </label>
          <Input
            id="table-capacity"
            type="number"
            min={1}
            step={1}
            placeholder="Es. 4"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* Sala */}
        {placements.length > 0 && (
          <div className="space-y-1">
            <label htmlFor="table-placement" className="block text-sm font-medium text-slate-700">
              Sala
            </label>
            <select
              id="table-placement"
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              disabled={isPending}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            >
              {placements.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Errore validazione */}
        {validationError && (
          <p className="text-sm text-red-600" role="alert">
            {validationError}
          </p>
        )}

        {/* Azioni */}
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
