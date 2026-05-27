/**
 * BookingPhotoStrip
 * Striscia verticale sinistra nella pagina Prenota.
 * Mostra N foto impilate verticalmente con effetto parallax leggero (0.4×).
 * La striscia è sticky top-0 h-screen; le foto scorrono internamente
 * più lentamente della pagina, creando profondità senza librerie esterne.
 *
 * LARGHEZZA: controllata dalla griglia padre in BookingRequestPage
 *   - mobile:  20vw  (~ 72px su 360px, ~ 78px su 390px)
 *   - ≥900px:  25vw  (~ 225px su 900px, 360px su 1440px)
 *
 * FOTO: passare array di URL via prop `photos`.
 * Se vuoto mostra il placeholder scuro (bg-black/10).
 * Le foto devono essere verticali strettissime (ratio ~1:4) e progettate
 * per essere visualizzate in una fascia di ~20% dello schermo.
 *
 * Per aggiungere le foto reali: passare l'array da BookingRequestPage.
 * Esempio:
 *   const STRIP_PHOTOS = [
 *     '/assets/strip/tavoli.jpg',
 *     '/assets/strip/cucina.jpg',
 *     '/assets/strip/pasta.jpg',
 *     '/assets/strip/ingredienti.jpg',
 *     '/assets/strip/attrezzi.jpg',
 *     '/assets/strip/natura.jpg',
 *   ]
 */

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface BookingPhotoStripProps {
  /** URL delle foto da mostrare in sequenza verticale. Se vuoto: placeholder. */
  photos?: string[]
  className?: string
}

/** Velocità parallax: 0 = ferme, 1 = scorrono con la pagina, 0.4 = lente */
const PARALLAX_SPEED = 0.4

export const BookingPhotoStrip: React.FC<BookingPhotoStripProps> = ({
  photos = [],
  className,
}) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.scrollY * PARALLAX_SPEED)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hasPhotos = photos.length > 0

  return (
    <div
      className={cn(
        // Sticky: rimane ancorata in cima mentre la pagina scorre
        'sticky top-0 h-screen overflow-hidden',
        // Placeholder quando non ci sono foto
        !hasPhotos && 'bg-black/10',
        className,
      )}
    >
      {hasPhotos ? (
        <div
          ref={innerRef}
          className="flex flex-col will-change-transform"
          style={{ transform: `translateY(-${offset}px)` }}
        >
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full object-cover block"
              // Ogni foto copre 120vh: assicura continuità anche su schermi alti
              style={{ height: '120vh', minHeight: '120vh' }}
            />
          ))}
          {/* Ripete le ultime 2 foto in coda per pagine molto lunghe */}
          {photos.slice(-2).map((src, i) => (
            <img
              key={`repeat-${i}`}
              src={src}
              alt=""
              aria-hidden
              loading="lazy"
              className="w-full object-cover block"
              style={{ height: '120vh', minHeight: '120vh' }}
            />
          ))}
        </div>
      ) : (
        /* Placeholder visivo: gradiente caldo che simula la presenza della foto */
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-warm-wood) 18%, transparent) 0%, color-mix(in srgb, var(--color-terracotta) 12%, transparent) 40%, color-mix(in srgb, var(--color-warm-orange) 10%, transparent) 80%, color-mix(in srgb, var(--color-warm-wood) 20%, transparent) 100%)',
          }}
        />
      )}
    </div>
  )
}
