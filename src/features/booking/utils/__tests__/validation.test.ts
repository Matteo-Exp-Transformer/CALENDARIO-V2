import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPhone } from '../validation'

describe('isValidEmail', () => {
  it('accetta email standard', () => {
    expect(isValidEmail('mario.rossi@example.com')).toBe(true)
    expect(isValidEmail('a@b.io')).toBe(true)
    expect(isValidEmail('user+tag@sub.example.co.uk')).toBe(true)
  })

  it('trimma whitespace prima del check', () => {
    expect(isValidEmail('  test@dom.it  ')).toBe(true)
  })

  it('rifiuta email senza @', () => {
    expect(isValidEmail('mariorossi.example.com')).toBe(false)
  })

  it('rifiuta email senza dominio', () => {
    expect(isValidEmail('mario@')).toBe(false)
  })

  it('rifiuta TLD troppo corto', () => {
    expect(isValidEmail('mario@dom.i')).toBe(false)
  })

  it('rifiuta stringa vuota', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('   ')).toBe(false)
  })

  it('rifiuta spazi nel local-part o dominio', () => {
    expect(isValidEmail('mario rossi@example.com')).toBe(false)
    expect(isValidEmail('mario@ex ample.com')).toBe(false)
  })
})

describe('isValidPhone', () => {
  it('accetta numeri italiani semplici', () => {
    expect(isValidPhone('3331234567')).toBe(true)
    expect(isValidPhone('06 1234567')).toBe(true)
  })

  it('accetta prefisso internazionale e separatori', () => {
    expect(isValidPhone('+39 333 123 4567')).toBe(true)
    expect(isValidPhone('(02) 1234-5678')).toBe(true)
  })

  it('rifiuta meno di 6 cifre', () => {
    expect(isValidPhone('12345')).toBe(false)
    expect(isValidPhone('+39 1')).toBe(false)
  })

  it('rifiuta stringa vuota o solo spazi', () => {
    expect(isValidPhone('')).toBe(false)
    expect(isValidPhone('   ')).toBe(false)
  })

  it('rifiuta solo lettere', () => {
    expect(isValidPhone('abcdefg')).toBe(false)
  })
})
