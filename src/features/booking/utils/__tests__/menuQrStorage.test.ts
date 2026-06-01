import { describe, expect, it } from 'vitest'
import {
  isBookingCategoryPhotoUrl,
  menuQrCategoryPhotoPath,
  menuQrStoragePrefix,
  storagePathFromPublicUrl,
} from '../menuQrStorage'

const TENANT = 'tenant-abc'
const BASE = `https://example.supabase.co/storage/v1/object/public/menu-photos`

describe('menuQrStorage path helpers', () => {
  it('parses public URL to storage path', () => {
    const url = `${BASE}/${TENANT}/booking-cat/cat-1.webp?v=1`
    expect(storagePathFromPublicUrl(url)).toBe(`${TENANT}/booking-cat/cat-1.webp`)
  })

  it('detects booking-cat catalog URLs', () => {
    const url = `${BASE}/${TENANT}/booking-cat/uuid-here.webp`
    expect(isBookingCategoryPhotoUrl(url, TENANT)).toBe(true)
    expect(isBookingCategoryPhotoUrl(url, 'other-tenant')).toBe(false)
  })

  it('builds QR category photo path', () => {
    expect(menuQrCategoryPhotoPath(TENANT, 'qr-id-1', 'antipasti')).toBe(
      `${menuQrStoragePrefix(TENANT, 'qr-id-1')}/cat/antipasti.webp`,
    )
    expect(menuQrCategoryPhotoPath(TENANT, 'draft/sc7abc', 'dolci')).toBe(
      `${TENANT}/qr/draft/sc7abc/cat/dolci.webp`,
    )
  })
})
