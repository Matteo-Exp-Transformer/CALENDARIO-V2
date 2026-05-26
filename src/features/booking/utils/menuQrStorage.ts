import { supabase } from '@/lib/supabase'
import type { CarouselItem } from '@/types/menu'

const BUCKET = 'menu-photos'

/** Segmento path Storage: id QR salvato oppure `draft/{shortCode}` per bozze pre-salvataggio. */
export function menuQrStorageSegment(menuQrCodeId: string | null, draftShortCode: string | null): string | null {
  if (menuQrCodeId) return menuQrCodeId
  if (draftShortCode) return `draft/${draftShortCode}`
  return null
}

export function menuQrStoragePrefix(tenantId: string, segment: string) {
  return `${tenantId}/qr/${segment}`
}

function storagePathFromPublicUrl(url: string): string | null {
  const match = url.match(/menu-photos\/([^?]+)/)
  return match ? match[1] : null
}

async function copyStorageObject(fromPath: string, toPath: string): Promise<void> {
  const { error } = await (supabase.storage.from(BUCKET) as any).copy(fromPath, toPath)
  if (error) throw error
}

function publicUrlForPath(path: string): string {
  const { data } = (supabase.storage.from(BUCKET) as any).getPublicUrl(path)
  return (data as { publicUrl: string }).publicUrl
}

/** Dopo il primo insert, sposta file da `qr/draft/{shortCode}/` a `qr/{savedId}/`. */
export async function migrateMenuQrDraftAssets(
  tenantId: string,
  draftShortCode: string,
  savedId: string,
  carouselItems: CarouselItem[],
  categoryImages: Record<string, string>,
): Promise<{ carousel_items: CarouselItem[]; category_images: Record<string, string> }> {
  const draftSeg = `draft/${draftShortCode}`
  const draftPrefix = `${tenantId}/qr/${draftSeg}/`

  const migrateUrl = async (url: string): Promise<string> => {
    const path = storagePathFromPublicUrl(url)
    if (!path || !path.startsWith(draftPrefix)) return url
    const suffix = path.slice(draftPrefix.length)
    const destPath = `${menuQrStoragePrefix(tenantId, savedId)}/${suffix}`
    await copyStorageObject(path, destPath)
    return publicUrlForPath(destPath)
  }

  const carousel_items = await Promise.all(
    carouselItems.map(async (item) => ({
      ...item,
      image_url: await migrateUrl(item.image_url),
    })),
  )

  const category_images: Record<string, string> = {}
  for (const [key, url] of Object.entries(categoryImages)) {
    category_images[key] = await migrateUrl(url)
  }

  return { carousel_items, category_images }
}
