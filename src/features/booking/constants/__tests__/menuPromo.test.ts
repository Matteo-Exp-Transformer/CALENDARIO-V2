import { describe, expect, it } from 'vitest'
import {
  listMenuPromoLabelsForBookingType,
  listMenuPromoMessagesForBookingType,
  resolveMenuPromoLabelsForBooking,
  type MenuPromo,
} from '../menuPromo'

const promoA: MenuPromo = {
  id: '11111111-1111-1111-1111-111111111111',
  label: 'Promo Laurea',
  message: 'Testo lungo mostrato al cliente',
  booking_types: ['rinfresco_laurea'],
  visible_on_booking: true,
}

const promoHidden: MenuPromo = {
  id: '22222222-2222-2222-2222-222222222222',
  label: 'Promo nascosta',
  message: 'Non visibile',
  booking_types: ['rinfresco_laurea'],
  visible_on_booking: false,
}

const promoLegacyNoLabel: MenuPromo = {
  id: '33333333-3333-3333-3333-333333333333',
  label: '',
  message: 'Solo testo senza nome admin',
  booking_types: ['menu_prezzo_fisso'],
}

describe('menuPromo labels', () => {
  it('listMenuPromoMessagesForBookingType returns message text only', () => {
    expect(listMenuPromoMessagesForBookingType('rinfresco_laurea', [promoA, promoHidden])).toEqual([
      'Testo lungo mostrato al cliente',
    ])
  })

  it('listMenuPromoLabelsForBookingType returns admin labels, not message text', () => {
    expect(listMenuPromoLabelsForBookingType('rinfresco_laurea', [promoA, promoHidden])).toEqual([
      'Promo Laurea',
    ])
  })

  it('skips promos without label when snapshotting booking', () => {
    expect(listMenuPromoLabelsForBookingType('menu_prezzo_fisso', [promoLegacyNoLabel])).toEqual([])
  })

  it('resolveMenuPromoLabelsForBooking uses snapshot when present', () => {
    expect(
      resolveMenuPromoLabelsForBooking(
        { booking_type: 'tavolo', menu_promo_labels: ['Promo salvata'] },
        [promoA],
      ),
    ).toEqual(['Promo salvata'])
  })

  it('resolveMenuPromoLabelsForBooking falls back to current promos when snapshot missing', () => {
    expect(
      resolveMenuPromoLabelsForBooking({ booking_type: 'rinfresco_laurea', menu_promo_labels: null }, [promoA]),
    ).toEqual(['Promo Laurea'])
  })
})
