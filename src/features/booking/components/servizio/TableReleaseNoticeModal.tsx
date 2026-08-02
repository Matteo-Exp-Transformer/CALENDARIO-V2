import type { FC } from 'react'
import { BellRing, Clock, Users } from 'lucide-react'
import { Button, Modal } from '@/components/ui'

/**
 * TableReleaseNoticeModal — avviso di fine turno con conferma staff (D22/D23/D48).
 *
 * PERCHÉ esiste: la capienza si libera da sola a fine finestra di occupazione
 * (arrivo + durata + buffer, vedi resolveOccupancy) — il posto è già
 * riprenotabile. Lo stato FISICO del tavolo però non può essere dedotto da un
 * orologio: solo lo staff sa se i clienti sono davvero usciti. Questa finestra
 * è il ponte fra i due mondi: notifica il fine turno e chiede la conferma.
 *
 * "Ancora occupato" NON scrive su DB: silenzia l'avviso per quel tavolo fino al
 * cambio di fascia/data. "Libero" esegue il checkout append-only (checked_out_at).
 */

export interface PendingTableRelease {
  tableId: string
  tableName: string
  roomName: string | null
  bookingName: string | null
  guests: number | null
  /** Orario di fine turno già formattato HH:mm, se calcolabile. */
  endedAtLabel: string | null
}

interface TableReleaseNoticeModalProps {
  isOpen: boolean
  releases: PendingTableRelease[]
  isConfirming: boolean
  onConfirmFree: (tableId: string) => void
  onKeepOccupied: (tableId: string) => void
  onClose: () => void
}

export const TableReleaseNoticeModal: FC<TableReleaseNoticeModalProps> = ({
  isOpen,
  releases,
  isConfirming,
  onConfirmFree,
  onKeepOccupied,
  onClose,
}) => {
  if (releases.length === 0) return null

  const isPlural = releases.length > 1

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPlural ? `${releases.length} tavoli a fine turno` : 'Tavolo a fine turno'}
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5">
          <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" aria-hidden />
          <p className="text-sm text-violet-900">
            Il tempo di permanenza è finito, quindi i posti sono già tornati disponibili per le nuove
            prenotazioni. Conferma se {isPlural ? 'i tavoli sono' : 'il tavolo è'} davvero{' '}
            {isPlural ? 'liberi' : 'libero'}.
          </p>
        </div>

        <ul className="space-y-2">
          {releases.map((release) => (
            <li
              key={release.tableId}
              className="rounded-xl border border-(--color-border) bg-surface px-3 py-2.5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary-900">
                    {release.roomName ? `${release.roomName} · ${release.tableName}` : release.tableName}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-(--color-text-muted)">
                    {release.bookingName && <span className="truncate">{release.bookingName}</span>}
                    {release.guests !== null && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" aria-hidden />
                        {release.guests} coperti
                      </span>
                    )}
                    {release.endedAtLabel && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden />
                        fine turno {release.endedAtLabel}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isConfirming}
                    onClick={() => onConfirmFree(release.tableId)}
                  >
                    Libero
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onKeepOccupied(release.tableId)}
                  >
                    Ancora occupato
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Decido dopo
          </Button>
        </div>
      </div>
    </Modal>
  )
}
