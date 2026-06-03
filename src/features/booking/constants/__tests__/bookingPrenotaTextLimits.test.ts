import { describe, expect, it } from 'vitest'
import {
  BOOKING_PUBLIC_CLIENT_TEXT_LIMITS,
  clampBookingText,
  getDietaryRestrictionsTextLength,
  isWithinBookingTextLimit,
  normalizeBookingHeaderFontSizeForTarget,
} from '../bookingPrenotaTextLimits'

describe('bookingPrenotaTextLimits', () => {
  it('clampBookingText tronca oltre max', () => {
    expect(clampBookingText('abcdef', 4)).toBe('abcd')
  })

  it('isWithinBookingTextLimit', () => {
    expect(isWithinBookingTextLimit('a', BOOKING_PUBLIC_CLIENT_TEXT_LIMITS.clientName)).toBe(true)
    expect(isWithinBookingTextLimit('x'.repeat(66), BOOKING_PUBLIC_CLIENT_TEXT_LIMITS.clientName)).toBe(
      false,
    )
  })

  it('getDietaryRestrictionsTextLength somma restriction e notes', () => {
    expect(
      getDietaryRestrictionsTextLength([{ restriction: 'Glutine', notes: ' leggero' }]),
    ).toBe('Glutine'.length + 'leggero'.length)
  })

  it('page_description fontSize max 22', () => {
    expect(
      normalizeBookingHeaderFontSizeForTarget(50, 'page_description', 16),
    ).toBe(22)
    expect(
      normalizeBookingHeaderFontSizeForTarget(50, 'page_title', 30),
    ).toBe(38)
  })
})
