import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DietaryRestrictionsSection } from '../DietaryRestrictionsSection'

const renderSection = (props: Partial<React.ComponentProps<typeof DietaryRestrictionsSection>> = {}) =>
  render(
    <MemoryRouter>
      <DietaryRestrictionsSection
        dietaryText=""
        onDietaryTextChange={vi.fn()}
        specialRequests=""
        onSpecialRequestsChange={vi.fn()}
        {...props}
      />
    </MemoryRouter>,
  )

describe('DietaryRestrictionsSection — checkbox consenso dietary', () => {
  it('non mostra la checkbox se il campo dietary è vuoto', () => {
    renderSection({
      dietaryConsentAccepted: false,
      onDietaryConsentChange: vi.fn(),
    })
    expect(screen.queryByLabelText(/acconsento al trattamento/i)).toBeNull()
  })

  it('mostra la checkbox se il campo dietary è non vuoto', () => {
    renderSection({
      dietaryText: 'glutine',
      dietaryConsentAccepted: false,
      onDietaryConsentChange: vi.fn(),
    })
    expect(screen.getByLabelText(/acconsento al trattamento/i)).toBeTruthy()
  })

  it('la checkbox risulta spuntata quando dietaryConsentAccepted=true', () => {
    renderSection({
      dietaryText: 'glutine',
      dietaryConsentAccepted: true,
      onDietaryConsentChange: vi.fn(),
    })
    expect((screen.getByLabelText(/acconsento al trattamento/i) as HTMLInputElement).checked).toBe(true)
  })

  it('chiama onDietaryConsentChange al click', () => {
    const onChange = vi.fn()
    renderSection({
      dietaryText: 'glutine',
      dietaryConsentAccepted: false,
      onDietaryConsentChange: onChange,
    })
    fireEvent.click(screen.getByLabelText(/acconsento al trattamento/i))
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('non mostra la checkbox se le props non sono passate (contesto admin)', () => {
    renderSection({ dietaryText: 'glutine' })
    expect(screen.queryByLabelText(/acconsento al trattamento/i)).toBeNull()
  })
})
