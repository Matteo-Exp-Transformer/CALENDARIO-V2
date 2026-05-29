import { describe, it, expect } from 'vitest'
import {
  getCarouselStickyMiniPanelLine,
  getShowOfferDetailsInSummary,
  parseSubTabFromUnknown,
  resolveCarouselSummaryDisplay,
} from '../bookingPublicFormConfig'

describe('parseSubTabFromUnknown — show_offer_details_in_summary', () => {
  const baseCarousel = {
    id: 'tab-1',
    label: 'Offerta estate',
    display: 'carousel',
    carousel_items: [{ image_url: 'https://example.com/a.jpg' }],
  }

  it('tratta assenza campo come dettaglio ON (legacy)', () => {
    const tab = parseSubTabFromUnknown(baseCarousel)
    expect(tab).not.toBeNull()
    expect(tab!.show_offer_details_in_summary).toBeUndefined()
    expect(getShowOfferDetailsInSummary(tab)).toBe(true)
  })

  it('legge false esplicito su carosello', () => {
    const tab = parseSubTabFromUnknown({
      ...baseCarousel,
      show_offer_details_in_summary: false,
    })
    expect(tab!.show_offer_details_in_summary).toBe(false)
    expect(getShowOfferDetailsInSummary(tab)).toBe(false)
  })

  it('non persiste il campo sulle card scorrevoli', () => {
    const tab = parseSubTabFromUnknown({
      id: 'card-1',
      label: 'Menu fisso',
      display: 'cards',
      show_offer_details_in_summary: false,
    })
    expect(tab).not.toBeNull()
    expect(tab!.show_offer_details_in_summary).toBeUndefined()
  })

  it('accetta label vuoto sulle card scorrevoli', () => {
    const tab = parseSubTabFromUnknown({
      id: 'card-empty',
      label: '',
      display: 'cards',
    })
    expect(tab).not.toBeNull()
    expect(tab!.label).toBe('')
  })

  it('rifiuta carosello senza label', () => {
    expect(
      parseSubTabFromUnknown({
        id: 'carousel-empty',
        label: '',
        display: 'carousel',
        carousel_items: [{ image_url: 'https://example.com/a.jpg' }],
      }),
    ).toBeNull()
  })
})

describe('resolveCarouselSummaryDisplay / sticky mini-pannello', () => {
  const base = {
    id: 'c1',
    label: 'Carosello',
    display: 'carousel' as const,
    carousel_items: [
      { image_url: 'https://example.com/1.jpg', title: 'Prima offerta' },
      { image_url: 'https://example.com/2.jpg', title: 'Seconda' },
    ],
  }

  it('toggle ON con titoli → lista titoli', () => {
    const tab = parseSubTabFromUnknown(base)
    expect(resolveCarouselSummaryDisplay(tab)?.kind).toBe('titles')
    expect(getCarouselStickyMiniPanelLine(tab)).toBe('Prima offerta')
  })

  it('toggle OFF con prezzo → solo prezzo', () => {
    const tab = parseSubTabFromUnknown({
      ...base,
      show_offer_details_in_summary: false,
      price_per_person: 45,
    })
    expect(resolveCarouselSummaryDisplay(tab)?.kind).toBe('price')
    expect(getCarouselStickyMiniPanelLine(tab)).toMatch(/45.*persona/i)
  })

  it('toggle ON senza titoli ma con prezzo → prezzo', () => {
    const tab = parseSubTabFromUnknown({
      ...base,
      carousel_items: [{ image_url: 'https://example.com/1.jpg' }],
      price_per_person: 30,
    })
    expect(resolveCarouselSummaryDisplay(tab)?.kind).toBe('price')
  })

  it('toggle OFF senza prezzo → null', () => {
    const tab = parseSubTabFromUnknown({
      ...base,
      show_offer_details_in_summary: false,
    })
    expect(resolveCarouselSummaryDisplay(tab)).toBeNull()
    expect(getCarouselStickyMiniPanelLine(tab)).toBeNull()
  })
})
