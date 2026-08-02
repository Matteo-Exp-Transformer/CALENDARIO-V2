import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { TableFormModal } from '@/features/booking/components/servizio/TableFormModal'
import { RoomTabs } from '@/features/booking/components/servizio/RoomTabs'
import { RoomConfigModal } from '@/features/booking/components/servizio/RoomConfigModal'
import { TableMap } from '@/features/booking/components/servizio/TableMap'
import { ServiceSlotsManager } from '@/features/booking/components/servizio/ServiceSlotsManager'
import { WalkInLimitCard } from '@/features/booking/components/servizio/WalkInLimitCard'
import { useFeatures } from '@/hooks/useFeatures'
import { AssignmentMapPanel } from '@/features/booking/components/servizio/AssignmentMapPanel'
import { useTables, useDeleteTable, type RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import { useRooms, type Room } from '@/features/booking/hooks/useRooms'
import { useTableMode } from '@/features/booking/hooks/useTableMode'
import { cn } from '@/lib/utils'

type ViewMode = 'list' | 'map'

/**
 * Le due viste della mappa.
 *   'service' → sala confermata: nessuna griglia, stati live e occupanti, si assegna.
 *   'edit'    → editor: griglia di allineamento, tavoli trascinabili, CRUD.
 * Default 'service': chi apre la mappa a servizio aperto vuole vedere la sala,
 * non l'editor; la disposizione si cambia molto più di rado.
 */
type MapMode = 'service' | 'edit'

interface ModalState {
  open: boolean
  initial: { id: string; name: string; capacity: number; room_id: string } | null
  defaultRoomId?: string
}

interface RoomModalState {
  open: boolean
  initial: Room | null
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
    <div className="flex items-start justify-between gap-3 rounded-xl border border-(--color-border) bg-surface p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-body truncate font-semibold text-primary-900">{table.name}</p>
        <p className="text-micro mt-0.5 text-(--color-text-muted)">{table.capacity} posti</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {confirmDelete ? (
          <>
            <span className="text-micro mr-1 text-red-600">Eliminare?</span>
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
  const features = useFeatures()
  const { data: tables = [], isLoading: loadingTables, error } = useTables()
  const { data: rooms = [], isLoading: loadingRooms } = useRooms()
  const deleteTable = useDeleteTable()
  // Predicato unico "modalità-tavoli" (D49): mostra AssignmentMapPanel solo se Pro+tavoli attivi
  const { isTableMode } = useTableMode()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [mapMode, setMapMode] = useState<MapMode>('service')
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>({ open: false, initial: null })
  const [roomModal, setRoomModal] = useState<RoomModalState>({ open: false, initial: null })

  const isLoading = loadingTables || loadingRooms

  // Seleziona automaticamente la prima sala disponibile quando le sale cambiano
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id)
    }
    // Se la sala selezionata è stata eliminata, reset alla prima
    if (selectedRoomId && rooms.length > 0 && !rooms.find((r) => r.id === selectedRoomId)) {
      setSelectedRoomId(rooms[0].id)
    }
    if (rooms.length === 0) setSelectedRoomId(null)
  }, [rooms, selectedRoomId])

  function openAdd(defaultRoomId?: string) {
    setModal({ open: true, initial: null, defaultRoomId })
  }

  function openEdit(table: RestaurantTable) {
    setModal({
      open: true,
      initial: {
        id: table.id,
        name: table.name,
        capacity: table.capacity,
        room_id: table.room_id ?? '',
      },
    })
  }

  function closeModal() {
    setModal({ open: false, initial: null })
  }

  function handleDelete(id: string) {
    deleteTable.mutate(id)
  }

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null

  // Conteggio tavoli per sala selezionata (per soft-block eliminazione sala)
  const tablesInSelectedRoom = selectedRoom
    ? tables.filter((t) => t.room_id === selectedRoom.id).length
    : 0

  return (
    <div className="min-h-0 flex-1 bg-(--color-bg) px-4 py-5 md:px-6 md:py-7">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header con tab Lista / Mappa */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-title-page font-bold text-primary-900">Servizio</h1>
            <p className="text-body mt-0.5 text-(--color-text-muted)">Gestisci i tavoli del ristorante per sala</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle Lista / Mappa */}
            <div className="flex rounded-lg border border-(--color-border) bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'text-(--color-text) hover:text-primary-600',
                )}
              >
                Lista
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  viewMode === 'map'
                    ? 'bg-primary-600 text-white'
                    : 'text-(--color-text) hover:text-primary-600',
                )}
              >
                Mappa
              </button>
            </div>
            {viewMode === 'list' && (
              <Button type="button" variant="primary" size="sm" onClick={() => openAdd()}>
                <Plus className="h-4 w-4" aria-hidden />
                Aggiungi tavolo
              </Button>
            )}
          </div>
        </div>

        {features.walkIn && <WalkInLimitCard />}

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

        {/* ========================= TAB LISTA ========================= */}
        {!isLoading && !error && viewMode === 'list' && (
          <>
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-(--color-border) bg-surface px-6 py-10 text-center shadow-sm">
                <p className="text-title-section font-semibold text-primary-900">Nessuna sala configurata.</p>
                <p className="text-body mt-2 text-(--color-text-muted)">
                  Passa alla tab <strong>Mappa</strong> e crea la prima sala con il pulsante "Nuova sala".
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {rooms.map((room) => {
                  const roomTables = tables.filter((t) => t.room_id === room.id)
                  return (
                    <section key={room.id}>
                      <h2 className="text-title-section mb-3 font-semibold text-primary-900">{room.name}</h2>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {roomTables.length === 0 && (
                          <p className="text-body col-span-full text-(--color-text-muted)">
                            Nessun tavolo in questa sala.
                          </p>
                        )}
                        {roomTables.map((table) => (
                          <TableCard
                            key={table.id}
                            table={table}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            isDeleting={deleteTable.isPending}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => openAdd(room.id)}
                          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) px-4 py-4 text-sm text-(--color-text-muted) transition-colors hover:border-primary-400 hover:text-primary-600"
                        >
                          <Plus className="h-4 w-4" aria-hidden />
                          Aggiungi tavolo in questa sala
                        </button>
                      </div>
                    </section>
                  )
                })}

                {/* Tavoli orfani: room_id null o sala eliminata */}
                {(() => {
                  const roomIds = new Set(rooms.map((r) => r.id))
                  const orphaned = tables.filter((t) => !t.room_id || !roomIds.has(t.room_id))
                  if (orphaned.length === 0) return null
                  return (
                    <section>
                      <h2 className="text-title-section mb-3 font-semibold text-primary-900">Senza sala</h2>
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
          </>
        )}

        {/* Fasce orarie — visibili in entrambe le view */}
        {!isLoading && !error && viewMode === 'list' && (
          <div className="border-t border-(--color-border) pt-6">
            <ServiceSlotsManager />
          </div>
        )}

        {/* ========================= TAB MAPPA ========================= */}
        {!isLoading && !error && viewMode === 'map' && (
          <div className="space-y-4">
            {/* Toggle fra la sala a servizio e l'editor della disposizione */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-lg border border-(--color-border) bg-surface p-0.5">
                <button
                  type="button"
                  onClick={() => setMapMode('service')}
                  className={cn(
                    'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                    mapMode === 'service'
                      ? 'bg-primary-600 text-white'
                      : 'text-(--color-text) hover:text-primary-600',
                  )}
                >
                  Servizio
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('edit')}
                  className={cn(
                    'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                    mapMode === 'edit'
                      ? 'bg-primary-600 text-white'
                      : 'text-(--color-text) hover:text-primary-600',
                  )}
                >
                  Modifica
                </button>
              </div>
              <p className="text-micro text-(--color-text-muted)">
                {mapMode === 'service'
                  ? 'Sala a servizio: stato dei tavoli e assegnazione delle prenotazioni.'
                  : 'Modifica disposizione: sposta i tavoli sulla griglia e gestiscili.'}
              </p>
            </div>

            <RoomTabs
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
              onAddRoom={() => setRoomModal({ open: true, initial: null })}
              onConfigureRoom={(room) => setRoomModal({ open: true, initial: room })}
            />

            {rooms.length === 0 && (
              <div className="rounded-xl border border-(--color-border) bg-surface px-6 py-10 text-center shadow-sm">
                <p className="text-title-section font-semibold text-primary-900">Nessuna sala creata.</p>
                <p className="text-body mt-2 text-(--color-text-muted)">
                  Usa il pulsante "Nuova sala" per creare la prima sala.
                </p>
              </div>
            )}

            {mapMode === 'edit' && selectedRoom && (
              <>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 md:hidden">
                  Da mobile la modifica della sala è nascosta: passa alla vista Servizio per assegnare
                  i tavoli.
                </div>
                <div className="hidden md:block">
                  <TableMap
                    room={selectedRoom}
                    tables={tables}
                    onEditTable={openEdit}
                    onAddTable={() => openAdd(selectedRoom.id)}
                  />
                </div>
              </>
            )}

            {/* Vista Servizio: sala confermata (piantina senza griglia) + assegnazioni.
                Guard D49: pannello visibile solo se Pro con almeno un tavolo attivo. */}
            {mapMode === 'service' && (
              isTableMode ? (
                <AssignmentMapPanel
                  rooms={rooms}
                  tables={tables}
                  layout="plan"
                  selectedRoomId={selectedRoomId}
                />
              ) : (
                <div className="rounded-xl border border-(--color-border) bg-surface px-6 py-10 text-center shadow-sm">
                  <p className="text-title-section font-semibold text-primary-900">
                    Attiva la mappa delle assegnazioni
                  </p>
                  <p className="text-body mt-2 text-(--color-text-muted)">
                    Crea la prima sala e i primi tavoli per assegnare le prenotazioni dal vivo.
                  </p>
                </div>
              )
            )}

            <div className="mt-8 border-t border-(--color-border) pt-6">
              <ServiceSlotsManager />
            </div>
          </div>
        )}
      </div>

      {/* Modal aggiungi/modifica tavolo */}
      <TableFormModal
        isOpen={modal.open}
        onClose={closeModal}
        rooms={rooms}
        tables={tables}
        defaultRoomId={modal.defaultRoomId}
        initial={modal.initial}
      />

      {/* Modal configura/crea sala */}
      <RoomConfigModal
        isOpen={roomModal.open}
        onClose={() => setRoomModal({ open: false, initial: null })}
        initial={roomModal.initial}
        tableCount={tablesInSelectedRoom}
      />
    </div>
  )
}
