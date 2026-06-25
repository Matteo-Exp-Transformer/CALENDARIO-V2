import type { FC } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { RestaurantTable } from '@/features/booking/hooks/useServizioTables'
import type { TableLiveStatus } from '@/features/booking/hooks/useTableStatuses'

interface TableShapeProps {
  table: RestaurantTable
  onEdit: (table: RestaurantTable) => void
  /** Drag disabilitato su mobile */
  dragDisabled?: boolean
  /**
   * Stato live del tavolo (D24). Opzionale: se assente o 'free', usa i colori
   * verdi di default (zero regressioni per i chiamanti che non passano lo stato).
   */
  status?: TableLiveStatus
}

/**
 * Mappa colori SVG per i 5 stati live (fill/stroke).
 * Il colore 'free' coincide con i valori hard-coded pre-S4 → nessuna regressione.
 */
const STATUS_COLORS: Record<TableLiveStatus, { fill: string; stroke: string; text: string; cap: string }> = {
  free:     { fill: '#4ade80', stroke: '#16a34a', text: '#14532d', cap: '#166534' },
  upcoming: { fill: '#67e8f9', stroke: '#0891b2', text: '#164e63', cap: '#155e75' },
  occupied: { fill: '#fcd34d', stroke: '#d97706', text: '#78350f', cap: '#92400e' },
  late:     { fill: '#fca5a5', stroke: '#dc2626', text: '#7f1d1d', cap: '#991b1b' },
  leaving:  { fill: '#e9d5ff', stroke: '#7c3aed', text: '#3b0764', cap: '#4c1d95' },
}

export const TABLE_NAME_MAX_LENGTH = 10

const SHAPE_SIZE = 64
const SHAPE_SIZE_RECT_W = 96

export const TableShape: FC<TableShapeProps> = ({ table, onEdit, dragDisabled = false, status }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: table.id,
    disabled: dragDisabled,
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    left: table.position_x,
    top: table.position_y,
    transform: CSS.Translate.toString(transform),
    cursor: dragDisabled ? 'pointer' : isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  const w = table.shape === 'rect' ? SHAPE_SIZE_RECT_W : SHAPE_SIZE
  const h = SHAPE_SIZE

  // Deriva i colori dallo stato live. 'free' (o assenza di prop) coincide con i
  // colori verdi storici → zero regressioni per i chiamanti che non passano status.
  const colors = STATUS_COLORS[status ?? 'free']
  const fillColor = colors.fill
  const strokeColor = colors.stroke

  function handleClick(e: React.MouseEvent) {
    // Non aprire il modal se stiamo finendo un drag
    if (isDragging) return
    e.stopPropagation()
    onEdit(table)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(dragDisabled ? {} : listeners)}
      {...(dragDisabled ? {} : attributes)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${table.name}, ${table.capacity} posti`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEdit(table)
        }
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {table.shape === 'round' ? (
          <circle
            cx={w / 2}
            cy={h / 2}
            r={h / 2 - 2}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
        ) : (
          <rect
            x={2}
            y={2}
            width={w - 4}
            height={h - 4}
            rx={table.shape === 'square' ? 6 : 4}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
        )}

        {/* Etichetta nome + capienza al centro */}
        <text
          x={w / 2}
          y={h / 2 - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight="700"
          fill={colors.text}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {table.name}
        </text>
        <text
          x={w / 2}
          y={h / 2 + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight="600"
          fill={colors.cap}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {table.capacity}p
        </text>
      </svg>
    </div>
  )
}
