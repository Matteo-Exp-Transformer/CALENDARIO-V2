import React, {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
} from 'react'

import { cn } from '@/lib/utils'

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string
  borderRadius?: string
  /** Durata ciclo shimmer (ripetuta su --speed per keyframe) */
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

/**
 * Magic UI–style shimmer; uso previsto: tab attiva nav admin (`AdminDashboard`).
 * `style` per custom properties / `container-type` — eccezione consapevole, vedi `docs/STYLING_AGENT_CONTEXT.md`.
 */
export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerDuration = '3s',
      borderRadius = '100px',
      background = 'rgba(0, 0, 0, 1)',
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        type="button"
        style={
          {
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--bg': background,
            ...style,
          } as CSSProperties
        }
        className={cn(
          'group relative isolate z-0 flex cursor-pointer items-center justify-center overflow-hidden px-6 py-3 text-slate-900 whitespace-nowrap [border-radius:var(--radius)] [background:var(--bg)]',
          'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Highlight sotto l’anello: altrimenti copriva il bagliore sul bordo (z-auto > z-4). */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-[2] size-full [border-radius:var(--radius)] px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',
            'transform-gpu transition-all duration-300 ease-in-out',
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]'
          )}
        />

        {/*
          Bagliore sul perimetro: conico che ruota, visibile solo nella corona (mask exclude).
        */}
        <span
          className="shimmer-perimeter-ring pointer-events-none absolute inset-0 z-[8] rounded-[inherit]"
          aria-hidden
        />

        {children}
      </button>
    )
  }
)

ShimmerButton.displayName = 'ShimmerButton'
