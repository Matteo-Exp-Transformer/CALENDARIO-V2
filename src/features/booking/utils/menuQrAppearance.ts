import type { CarouselItem, MenuQrCode } from '@/types/menu'

export function parseCarouselItems(raw: unknown): CarouselItem[] {
  const carouselRaw = Array.isArray(raw) ? raw : []
  return carouselRaw
    .filter((x): x is Record<string, unknown> => typeof x === 'object' && x !== null)
    .map((x) => ({
      image_url: String(x.image_url ?? ''),
      eyebrow: x.eyebrow != null ? String(x.eyebrow) : undefined,
      title: x.title != null ? String(x.title) : undefined,
      description: x.description != null ? String(x.description) : undefined,
      label: x.label != null ? String(x.label) : undefined,
      sort_order: typeof x.sort_order === 'number' ? x.sort_order : 0,
    }))
    .filter((x) => x.image_url)
}

export function parseHiddenMenuItemIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is string => typeof x === 'string' && x.length > 0)
}

export function parseCategoryImages(raw: unknown): Record<string, string> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'string' && v) out[k] = v
  }
  return out
}

export function parseMenuQrCodeRow(raw: Record<string, unknown>): MenuQrCode {
  return {
    id: String(raw.id),
    tenant_id: String(raw.tenant_id),
    short_code: String(raw.short_code),
    name: String(raw.name),
    content_type: raw.content_type as MenuQrCode['content_type'],
    category_filter: Array.isArray(raw.category_filter)
      ? (raw.category_filter as string[])
      : null,
    preset_ids: Array.isArray(raw.preset_ids) ? (raw.preset_ids as string[]) : null,
    is_active: Boolean(raw.is_active),
    sort_order: typeof raw.sort_order === 'number' ? raw.sort_order : 0,
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    theme_key: typeof raw.theme_key === 'string' ? raw.theme_key : 'mediterranean_teal',
    carousel_items: parseCarouselItems(raw.carousel_items),
    category_images: parseCategoryImages(raw.category_images),
    hidden_menu_item_ids: parseHiddenMenuItemIds(raw.hidden_menu_item_ids),
  }
}
