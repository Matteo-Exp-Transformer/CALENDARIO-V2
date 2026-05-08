import { cn } from '@/lib/utils'

/** Pulsanti CTA blu nelle superfici warm admin (tab Menu, “Aggiungi fascia”, footer, ecc.) */
export const adminBlueCtaSurfaceClass = cn(
  'rounded-lg border-2 border-[#2563eb] bg-[#3b82f6] px-3 py-1.5 text-xs font-medium text-white shadow-none',
  'transition-colors hover:bg-[#60a5fa] hover:border-[#3b82f6] hover:shadow-none',
  'focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:ring-offset-2 active:scale-[0.98]',
  '[&_svg]:shrink-0 [&_svg]:text-white'
)
