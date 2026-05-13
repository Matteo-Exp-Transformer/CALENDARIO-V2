import type { FC } from 'react'
import { Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Room } from '@/features/booking/hooks/useRooms'

interface RoomTabsProps {
  rooms: Room[]
  selectedRoomId: string | null
  onSelectRoom: (id: string) => void
  onAddRoom: () => void
  onConfigureRoom: (room: Room) => void
}

export const RoomTabs: FC<RoomTabsProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onAddRoom,
  onConfigureRoom,
}) => {
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null

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
              : 'bg-(--color-surface) text-(--color-text) border border-(--color-border) hover:bg-primary-50',
          )}
        >
          {room.name}
        </button>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onAddRoom}
        className="shrink-0"
        title="Nuova sala"
      >
        <Plus className="h-4 w-4" />
        Nuova sala
      </Button>

      {selectedRoom && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onConfigureRoom(selectedRoom)}
          title="Configura sala corrente"
          className="shrink-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
