import type { DietaryRestriction } from '@/types/booking'

/** Testo libero mostrato nel form pubblico, ricostruito da JSON salvato. */
export function dietaryRestrictionsToText(
  restrictions: DietaryRestriction[] | undefined | null
): string {
  if (!restrictions?.length) return ''
  return restrictions
    .map((r) => (r.restriction === 'Altro' && r.notes ? r.notes : r.restriction))
    .join(', ')
}

/** Salva il testo libero come singola voce in dietary_restrictions (JSONB). */
export function dietaryTextToRestrictions(text: string): DietaryRestriction[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  return [{ restriction: trimmed, guest_count: 1 }]
}
