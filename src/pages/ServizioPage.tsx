import type { FC } from 'react'
import { useState } from 'react'
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { TableFormModal } from '@/features/booking/components/servizio/TableFormModal'
import { useTables, useDeleteTable, type RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import { useRestaurantSetting } from '@/features/booking/hooks/useRestaurantSetting'

interface ModalState {
  open: boolean
  initial: { id: string; name: string; capacity: number; placement: string } | null
  defaultPlacement?: string
}

interface TableCardProps {
  table: RestaurantTable
  onEdit: (t: RestaurantTable) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

const TableCard: FC<TableCardProps> = ({ table, onEdit, onDelete, isDeleting }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="flex items-start justify-between rounded-xl border border-(--color-border) bg-surface p-4 shadow-sm">
      <div>
        <p className="font-semibold text-primary-900">{table.name}</p>
        <p className="mt-0.5 text-sm text-(--color-text-muted)">{table.capacity} posti</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {confirmDelete ? (
          <>
            <span className="mr-1 text-xs text-red-600">Eliminare?</span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isDeleting}
              onClick={() => {
                onDelete(table.id)
                setConfirmDelete(false)
              }}
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
              aria-label={`Modifica ${table.name}`}
              onClick={() => onEdit(table)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Elimina ${table.name}`}
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

export const ServizioPage: FC = () => {
  const { data: placementsRaw = [], isLoading: loadingPlacements } = useRestaurantSetting('booking_placement_areas')
  const { data: tables = [], isLoading: loadingTables, error } = useTables()
  const deleteTable = useDeleteTable()

  const [modal, setModal] = useState<ModalState>({ open: false, initial: null })

  const isLoading = loadingPlacements || loadingTables
  const placementList: string[] = Array.isArray(placementsRaw) ? (placementsRaw as string[]) : []

  function openAdd(defaultPlacement?: string) {
    setModal({ open: true, initial: null, defaultPlacement })
  }

  function openEdit(table: RestaurantTable) {
    setModal({
      open: true,
      initial: {
        id: table.id,
        name: table.name,
        capacity: table.capacity,
        placement: table.placement,
      },
    })
  }

  function closeModal() {
    setModal({ open: false, initial: null })
  }

  function handleDelete(id: string) {
    deleteTable.mutate(id)
  }

  return (
    <div className="min-h-0 flex-1 bg-(--color-bg) px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary-900 md:text-2xl">Servizio</h1>
            <p className="mt-0.5 text-sm text-(--color-text-muted)">Gestisci i tavoli del ristorante per sala</p>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={() => openAdd()}>
            <Plus className="h-4 w-4" aria-hidden />
            Aggiungi tavolo
          </Button>
        </div>

        {/* Errore */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-800">
            <p className="font-semibold">Impossibile caricare i tavoli.</p>
            <p className="mt-1">{(error as Error).message}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && !error && (
          <div
            className="flex h-48 items-center justify-center rounded-xl border border-(--color-border) bg-surface"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" aria-hidden />
            <span className="sr-only">Caricamento tavoli</span>
          </div>
        )}

        {/* Nessuna sala configurata */}
        {!isLoading && !error && placementList.length === 0 && (
          <div className="rounded-xl border border-(--color-border) bg-surface px-6 py-10 text-center shadow-sm">
            <p className="font-semibold text-primary-900">Nessuna sala configurata.</p>
            <p className="mt-2 text-sm text-(--color-text-muted)">
              Vai in <strong>Impostazioni → Aree di posizionamento</strong> per aggiungere le sale.
            </p>
          </div>
        )}

        {/* Sezioni per sala */}
        {!isLoading && !error && placementList.length > 0 && (
          <div className="space-y-8">
            {placementList.map((placement) => {
              const sectionTables = tables.filter((t) => t.placement === placement)

              return (
                <section key={placement}>
                  <h2 className="mb-3 text-base font-semibold text-primary-900">{placement}</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {sectionTables.length === 0 && (
                      <p className="col-span-full text-sm text-(--color-text-muted)">
                        Nessun tavolo in questa sala.
                      </p>
                    )}
                    {sectionTables.map((table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        isDeleting={deleteTable.isPending}
                      />
                    ))}
                    {/* Bottone inline per aggiungere tavolo precompilato con questa sala */}
                    <button
                      type="button"
                      onClick={() => openAdd(placement)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) px-4 py-4 text-sm text-(--color-text-muted) transition-colors hover:border-primary-400 hover:text-primary-600"
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                      Aggiungi tavolo in questa sala
                    </button>
                  </div>
                </section>
              )
            })}

            {/* Tavoli orfani: placement non più presente nella lista sale */}
            {(() => {
              const orphaned = tables.filter((t) => t.placement === '' || !placementList.includes(t.placement))
              if (orphaned.length === 0) return null
              return (
                <section>
                  <h2 className="mb-3 text-base font-semibold text-primary-900">Senza sala</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {orphaned.map((table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        isDeleting={deleteTable.isPending}
                      />
                    ))}
                  </div>
                </section>
              )
            })()}
          </div>
        )}
      </div>

      {/* Modal aggiungi/modifica */}
      <TableFormModal
        isOpen={modal.open}
        onClose={closeModal}
        placements={placementList}
        defaultPlacement={modal.defaultPlacement}
        initial={modal.initial}
      />
    </div>
  )
}
