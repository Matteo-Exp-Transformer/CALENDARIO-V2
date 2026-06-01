import { describe, it, expect } from 'vitest'
import {
  getCarouselStickyMiniPanelLine,
  getShowOfferDetailsInSummary,
  normalizeBookingPublicFormConfig,
  parseSubTabFromUnknown,
  resolveCarouselSummaryDisplay,
  type BookingPublicFormConfig,
} from '../bookingPublicFormConfig'

describe('icone Prenota — migrate-on-read', () => {
  it('card scorrevole: legacy utensils → fork_knife in memoria', () => {
    const tab = parseSubTabFromUnknown({
      id: 'c1',
      label: 'Menu',
      display: 'cards',
      icon: 'utensils',
    })
    expect(tab!.icon).toBe('fork_knife')
  })

  it('slide carosello: legacy chef-hat → lucide_chef_hat', () => {
    const tab = parseSubTabFromUnknown({
      id: 'car1',
      label: 'Offerta',
      display: 'carousel',
      carousel_items: [
        {
          image_url: 'https://example.com/a.jpg',
          icon: 'chef-hat',
        },
      ],
    })
    expect(tab!.carousel_items![0].icon).toBe('lucide_chef_hat')
  })

  it('normalize al salvataggio admin scrive chiavi catalogo QR', () => {
    const config: BookingPublicFormConfig = {
      page_title: 'Prenota',
      page_description: 'Desc',
      header_styles: {
        restaurant_name: { font: 'playfair', color: '#6b4226' },
        page_title: { font: 'playfair', color: '#6b4226' },
        page_description: { font: 'montserrat', color: '#4a2d19' },
      },
      booking_modes: [
        {
          id: 'm1',
          booking_type: 'tavolo',
          enabled: true,
          label: 'Tavolo',
          description: 'D',
          icon: 'utensils' as unknown as BookingPublicFormConfig['booking_modes'][0]['icon'],
          sub_tabs_enabled: true,
          sub_tabs_presentation: 'cards',
          sub_tabs: [
            {
              id: 's1',
              display: 'cards',
              label: 'Card',
              icon: 'star' as unknown as BookingPublicFormConfig['booking_modes'][0]['sub_tabs'][0]['icon'],
            },
          ],
        },
      ],
    }
    const normalized = normalizeBookingPublicFormConfig(config)
    expect(normalized.booking_modes[0].icon).toBe('fork_knife')
    expect(normalized.booking_modes[0].sub_tabs[0].icon).toBe('lucide_salad')
  })
})

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
