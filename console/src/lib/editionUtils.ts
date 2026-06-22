// Helper edition locale della Console — NON importato da ../src.
// Ricrea la logica minima di cui la Console ha bisogno: label e colore badge per edition.
// Fonte di verità dei valori validi: organizations.edition nel DB TEST (classic | pro | enterprise).

export type Edition = 'classic' | 'pro' | 'enterprise'

/**
 * Normalizza un valore edition grezzo dal DB.
 * Se il valore non è riconosciuto restituisce 'classic' come fallback
 * (stesso comportamento di normalizeTenantEdition nell'app di Matteo).
 */
export function normalizeEdition(raw: string | null | undefined): Edition {
  if (raw === 'pro' || raw === 'enterprise') return raw
  return 'classic'
}

/** Etichetta leggibile per l'edition. */
export function editionLabel(edition: Edition): string {
  switch (edition) {
    case 'pro':        return 'Pro'
    case 'enterprise': return 'Enterprise'
    case 'classic':    return 'Classic'
  }
}

/** Colore badge per l'edition (sfondo, testo). */
export function editionBadgeColors(edition: Edition): { bg: string; text: string } {
  switch (edition) {
    case 'enterprise': return { bg: '#7c3aed', text: '#ede9fe' }
    case 'pro':        return { bg: '#0369a1', text: '#e0f2fe' }
    case 'classic':    return { bg: '#374151', text: '#d1d5db' }
  }
}
