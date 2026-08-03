import type { FC } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Room } from '@/features/booking/hooks/useRooms'

interface RoomTabsProps {
  rooms: Room[]
  selectedRoomId: string | null
  onSelectRoom: (id: string) => void
  onConfigureRoom: (room: Room) => void
}

export const RoomTabs: FC<RoomTabsProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onConfigureRoom,
}) => {
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? null

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {rooms.map((room) => (
        <button
          key={room.id}
          type="button"
          onClick={() => onSelectRoom(room.id)}
          className={cn(
            'shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            room.id === selectedRoomId
              ? 'bg-primary-600 text-white'
              : 'bg-surface text-(--color-text) border border-(--color-border) hover:bg-primary-50',
          )}
        >
          {room.name}
        </button>
      ))}

      {/* La creazione sala passa solo dall'header ("Aggiungi sala", FIX-2/FIX-4):
          niente CTA duplicata qui. Modifica direttamente la sala selezionata:
          nessun picker sopra la mappa. */}
      {selectedRoom && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onConfigureRoom(selectedRoom)}
          title={`Modifica ${selectedRoom.name}`}
          className="shrink-0 gap-1"
        >
          <Settings className="h-4 w-4" />
          Modifica sala
        </Button>
      )}
    </div>
  )
}
