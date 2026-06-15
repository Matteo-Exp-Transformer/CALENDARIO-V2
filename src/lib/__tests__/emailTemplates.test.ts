import { describe, expect, it } from 'vitest'
import {
  getBookingAcceptedEmail,
  getBookingRejectedEmail,
  getPromoEmail,
  DEFAULT_ACCEPTED_SUBJECT,
  DEFAULT_ACCEPTED_INTRO,
  DEFAULT_ACCEPTED_CLOSING,
  DEFAULT_REJECTED_SUBJECT,
  DEFAULT_REJECTED_INTRO,
  DEFAULT_REJECTED_CLOSING,
} from '@/lib/emailTemplates'
import type { BookingRequest } from '@/types/booking'

const FAKE_BOOKING: BookingRequest = {
  id: 'b1',
  tenant_id: 't1',
  client_name: 'Mario Rossi',
  client_email: 'mario@test.com',
  client_phone: '333111000',
  num_guests: 2,
  desired_date: '2026-07-01',
  desired_time: '20:00',
  status: 'accepted',
  notes: null,
  created_at: '2026-07-01T10:00:00Z',
  updated_at: '2026-07-01T10:00:00Z',
  booking_mode: null,
  selected_menu: null,
  confirmed_start: null,
  table_id: null,
  rejected_reason: null,
  archived_at: null,
  confirmed_at: null,
} as unknown as BookingRequest

describe('getBookingAcceptedEmail — default testo cablato', () => {
  it('usa il subject default quando nessun override', () => {
    const { subject } = getBookingAcceptedEmail(FAKE_BOOKING)
    expect(subject).toBe(DEFAULT_ACCEPTED_SUBJECT)
  })

  it('override subject viene usato', () => {
    const { subject } = getBookingAcceptedEmail(FAKE_BOOKING, undefined, undefined, {
      subject: 'Oggetto personalizzato',
    })
    expect(subject).toBe('Oggetto personalizzato')
  })

  it('override intro compare nell HTML', () => {
    const { html } = getBookingAcceptedEmail(FAKE_BOOKING, undefined, undefined, {
      intro: 'Benvenuto nel nostro locale!',
    })
    expect(html).toContain('Benvenuto nel nostro locale!')
    // Il default non deve comparire
    expect(html).not.toContain(DEFAULT_ACCEPTED_INTRO)
  })

  it('mantiene il saluto "Ciao" con il nome cliente', () => {
    const { html } = getBookingAcceptedEmail(FAKE_BOOKING, undefined, undefined, {
      intro: 'Testo custom',
    })
    expect(html).toContain('Mario Rossi')
    expect(html).toContain('Ciao')
  })

  it('subject vuoto nell override → usa il default', () => {
    const { subject } = getBookingAcceptedEmail(FAKE_BOOKING, undefined, undefined, {
      subject: '   ',
    })
    expect(subject).toBe(DEFAULT_ACCEPTED_SUBJECT)
  })
})

describe('getBookingRejectedEmail — default testo cablato', () => {
  it('usa il subject default quando nessun override', () => {
    const { subject } = getBookingRejectedEmail(FAKE_BOOKING)
    expect(subject).toBe(DEFAULT_REJECTED_SUBJECT)
  })

  it('override soggetto + intro vengono usati', () => {
    const { subject, html } = getBookingRejectedEmail(FAKE_BOOKING, undefined, undefined, {
      subject: 'Mi dispiace molto',
      intro: 'Purtroppo non possiamo accoglierti.',
    })
    expect(subject).toBe('Mi dispiace molto')
    expect(html).toContain('Purtroppo non possiamo accoglierti.')
    expect(html).not.toContain(DEFAULT_REJECTED_INTRO)
  })

  it('nessun summaryBlock nel rifiuto (timing=rejected)', () => {
    const { html } = getBookingRejectedEmail(FAKE_BOOKING)
    // summaryBlock non viene generato per rifiuto
    expect(html).not.toContain('PRENOTAZIONE CONFERMATA')
    expect(html).not.toContain('success-badge')
  })
})

describe('getPromoEmail', () => {
  it('include il testo del corpo', () => {
    const { html } = getPromoEmail({
      subject: 'Offerta estate',
      body: 'Sconto 20% questo weekend!',
    })
    expect(html).toContain('Sconto 20% questo weekend!')
  })

  it('include il footer privacy fisso', () => {
    const { html } = getPromoEmail({ subject: 'Promo', body: 'Testo' })
    expect(html).toContain('Hai ricevuto questa email perché sei nostro cliente')
  })

  it('NON contiene riepilogo prenotazione', () => {
    const { html } = getPromoEmail({ subject: 'Promo', body: 'Testo' })
    expect(html).not.toContain('success-badge')
    expect(html).not.toContain('PRENOTAZIONE CONFERMATA')
    // summary-block è specifico del riepilogo booking, non del template promo
    expect(html).not.toContain('summary-block')
  })

  it('include la firma se tenantInfo fornito', () => {
    const { html } = getPromoEmail(
      { subject: 'Promo', body: 'Testo' },
      { name: 'Ristorante Bello', phone: '02-1234567' },
    )
    expect(html).toContain('Ristorante Bello')
    expect(html).toContain('02-1234567')
    expect(html).toContain('Lo staff')
  })

  it('restituisce il subject corretto', () => {
    const { subject } = getPromoEmail({ subject: 'Weekend promo', body: 'Corpo' })
    expect(subject).toBe('Weekend promo')
  })
})

describe('DEFAULT_* costanti esportate', () => {
  it('le costanti default sono stringhe non vuote', () => {
    expect(DEFAULT_ACCEPTED_SUBJECT.length).toBeGreaterThan(0)
    expect(DEFAULT_ACCEPTED_INTRO.length).toBeGreaterThan(0)
    expect(DEFAULT_ACCEPTED_CLOSING.length).toBeGreaterThan(0)
    expect(DEFAULT_REJECTED_SUBJECT.length).toBeGreaterThan(0)
    expect(DEFAULT_REJECTED_INTRO.length).toBeGreaterThan(0)
    expect(DEFAULT_REJECTED_CLOSING.length).toBeGreaterThan(0)
  })
})
