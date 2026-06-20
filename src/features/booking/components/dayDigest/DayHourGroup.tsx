import React from 'react'

interface DayHourGroupProps {
  /** Es. "13:00" */
  hourLabel: string
  children: React.ReactNode
}

export function DayHourGroup({ hourLabel, children }: DayHourGroupProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-4">
      <div className="shrink-0 md:w-20 md:pt-1">
        <span className="text-value font-semibold tabular-nums text-(--color-text-muted)">{hourLabel}</span>
      </div>
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {children}
      </div>
    </div>
  )
}
