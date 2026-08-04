/**
 * Helper REST Supabase staging per seed/cleanup E2E (service role).
 * Usare SOLO con progetto TEST (docnnernvp) — mai PROD.
 */

import fs from 'fs'

export const E2E_BOOKING_PREFIX = 'E2E-FU043-'
export const E2E_MENU_PREFIX = 'E2E-M3-'

function ensureStagingEnvLoaded() {
  if (process.env.VITE_SUPABASE_URL && serviceKey()) return
  if (fs.existsSync('.env.local.test')) {
    process.loadEnvFile('.env.local.test')
  }
}

type RestHeaders = Record<string, string>

function stagingUrl(): string {
  return process.env.VITE_SUPABASE_URL ?? ''
}

function serviceKey(): string {
  return process.env.E2E_SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
}

function requireStagingConfig() {
  ensureStagingEnvLoaded()
  if (!stagingUrl() || !serviceKey()) {
    throw new Error('VITE_SUPABASE_URL e E2E_SUPABASE_SERVICE_KEY richiesti in .env.local.test')
  }
  if (!stagingUrl().includes('docnnernvp')) {
    throw new Error('E2E staging bloccato: VITE_SUPABASE_URL non punta al progetto TEST docnnernvp')
  }
}

function restHeaders(extra?: RestHeaders): RestHeaders {
  const key = serviceKey()
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  requireStagingConfig()
  const resp = await fetch(`${stagingUrl()}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...restHeaders(),
      ...(init?.headers as RestHeaders | undefined),
    },
  })
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Supabase REST ${init?.method ?? 'GET'} ${path} → ${resp.status}: ${body}`)
  }
  if (resp.status === 204) return undefined as T
  const text = await resp.text()
  return (text ? JSON.parse(text) : undefined) as T
}

type MenuCategoryE2eInput = {
  tenantId: string
  key: string
  label: string
  description?: string | null
  isAvailable?: boolean
  sortOrder?: number
}

export type MenuCategoryE2eRow = {
  id: string
  key: string
  label: string
  is_available: boolean | null
}

type MenuItemE2eInput = {
  tenantId: string
  categoryKey: string
  name: string
  price?: number
  description?: string | null
  isAvailable?: boolean
  sortOrder?: number
  bookingTypes?: string[]
}

export type MenuItemE2eRow = {
  id: string
  name: string
  category: string
  is_available: boolean | null
}

type MenuQrE2eInput = {
  tenantId: string
  shortCode: string
  name: string
  categoryFilter: string[]
  hiddenMenuItemIds?: string[]
  themeKey?: string
  carouselItems?: unknown[]
  categoryImages?: Record<string, string>
}

export type MenuQrE2eRow = {
  id: string
  short_code: string
  category_filter: string[] | null
  hidden_menu_item_ids: string[] | null
  is_active: boolean
}

export type RestaurantSettingSnapshot = {
  exists: boolean
  value: unknown
}

export async function upsertMenuCategory(input: MenuCategoryE2eInput): Promise<MenuCategoryE2eRow> {
  const existing = await rest<MenuCategoryE2eRow[]>(
    `menu_categories?tenant_id=eq.${input.tenantId}&key=eq.${encodeURIComponent(input.key)}&select=id,key,label,is_available&limit=1`,
  )
  const row = {
    tenant_id: input.tenantId,
    key: input.key,
    label: input.label,
    description: input.description ?? null,
    is_available: input.isAvailable ?? true,
    sort_order: input.sortOrder ?? 9000,
    updated_at: new Date().toISOString(),
  }

  if (existing[0]?.id) {
    const updated = await rest<MenuCategoryE2eRow[]>(
      `menu_categories?id=eq.${existing[0].id}`,
      {
        method: 'PATCH',
        headers: restHeaders({ Prefer: 'return=representation' }),
        body: JSON.stringify(row),
      },
    )
    return updated[0]
  }

  const created = await rest<MenuCategoryE2eRow[]>('menu_categories', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  return created[0]
}

export async function upsertMenuItem(input: MenuItemE2eInput): Promise<MenuItemE2eRow> {
  const existing = await rest<MenuItemE2eRow[]>(
    `menu_items?tenant_id=eq.${input.tenantId}&category=eq.${encodeURIComponent(input.categoryKey)}&name=eq.${encodeURIComponent(input.name)}&select=id,name,category,is_available&limit=1`,
  )
  const row = {
    tenant_id: input.tenantId,
    name: input.name,
    category: input.categoryKey,
    price: input.price ?? 9.5,
    description: input.description ?? 'Prodotto E2E per blindatura Menu',
    is_available: input.isAvailable ?? true,
    sort_order: input.sortOrder ?? 9000,
    booking_types: input.bookingTypes ?? ['rinfresco_laurea', 'menu_prezzo_fisso'],
    updated_at: new Date().toISOString(),
  }

  if (existing[0]?.id) {
    const updated = await rest<MenuItemE2eRow[]>(`menu_items?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      headers: restHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(row),
    })
    return updated[0]
  }

  const created = await rest<MenuItemE2eRow[]>('menu_items', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  return created[0]
}

export async function setMenuCategoryAvailability(
  tenantId: string,
  categoryId: string,
  isAvailable: boolean,
): Promise<void> {
  await rest(`menu_categories?id=eq.${categoryId}&tenant_id=eq.${tenantId}`, {
    method: 'PATCH',
    headers: restHeaders({ Prefer: 'return=minimal' }),
    body: JSON.stringify({ is_available: isAvailable, updated_at: new Date().toISOString() }),
  })
}

export async function setMenuItemAvailability(
  tenantId: string,
  itemId: string,
  isAvailable: boolean,
): Promise<void> {
  await rest(`menu_items?id=eq.${itemId}&tenant_id=eq.${tenantId}`, {
    method: 'PATCH',
    headers: restHeaders({ Prefer: 'return=minimal' }),
    body: JSON.stringify({ is_available: isAvailable, updated_at: new Date().toISOString() }),
  })
}

export async function getMenuCategoryAvailability(categoryId: string): Promise<boolean | null> {
  const rows = await rest<Array<{ is_available: boolean | null }>>(
    `menu_categories?id=eq.${categoryId}&select=is_available&limit=1`,
  )
  return rows[0]?.is_available ?? null
}

export async function getMenuItemAvailability(itemId: string): Promise<boolean | null> {
  const rows = await rest<Array<{ is_available: boolean | null }>>(
    `menu_items?id=eq.${itemId}&select=is_available&limit=1`,
  )
  return rows[0]?.is_available ?? null
}

export async function upsertMenuQrCode(input: MenuQrE2eInput): Promise<MenuQrE2eRow> {
  const existing = await rest<MenuQrE2eRow[]>(
    `menu_qr_codes?tenant_id=eq.${input.tenantId}&short_code=eq.${encodeURIComponent(input.shortCode)}&select=id,short_code,category_filter,hidden_menu_item_ids,is_active&limit=1`,
  )
  const row = {
    tenant_id: input.tenantId,
    short_code: input.shortCode,
    name: input.name,
    category_filter: input.categoryFilter,
    hidden_menu_item_ids: input.hiddenMenuItemIds ?? [],
    is_active: true,
    sort_order: 9000,
    theme_key: input.themeKey ?? 'mediterranean_teal',
    carousel_items: input.carouselItems ?? [],
    category_images: input.categoryImages ?? {},
    updated_at: new Date().toISOString(),
  }

  if (existing[0]?.id) {
    const updated = await rest<MenuQrE2eRow[]>(`menu_qr_codes?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      headers: restHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(row),
    })
    return updated[0]
  }

  const created = await rest<MenuQrE2eRow[]>('menu_qr_codes', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  return created[0]
}

export async function deleteMenuE2eData(
  tenantId: string,
  categoryKey: string,
  shortCode?: string,
): Promise<void> {
  if (shortCode) {
    await rest(
      `menu_qr_codes?tenant_id=eq.${tenantId}&short_code=eq.${encodeURIComponent(shortCode)}`,
      {
        method: 'DELETE',
        headers: restHeaders({ Prefer: 'return=minimal' }),
      },
    )
  }
  await rest(
    `menu_items?tenant_id=eq.${tenantId}&category=eq.${encodeURIComponent(categoryKey)}`,
    {
      method: 'DELETE',
      headers: restHeaders({ Prefer: 'return=minimal' }),
    },
  )
  await rest(
    `menu_categories?tenant_id=eq.${tenantId}&key=eq.${encodeURIComponent(categoryKey)}`,
    {
      method: 'DELETE',
      headers: restHeaders({ Prefer: 'return=minimal' }),
    },
  )
}

export async function getRestaurantSettingSnapshot(
  tenantId: string,
  settingKey: string,
): Promise<RestaurantSettingSnapshot> {
  const rows = await rest<Array<{ setting_value: unknown }>>(
    `restaurant_settings?tenant_id=eq.${tenantId}&setting_key=eq.${encodeURIComponent(settingKey)}&select=setting_value&limit=1`,
  )
  if (!rows[0]) return { exists: false, value: null }
  return { exists: true, value: rows[0].setting_value }
}

export async function upsertRestaurantSettingValue(
  tenantId: string,
  settingKey: string,
  value: unknown,
): Promise<void> {
  const existing = await rest<Array<{ id: string }>>(
    `restaurant_settings?tenant_id=eq.${tenantId}&setting_key=eq.${encodeURIComponent(settingKey)}&select=id&limit=1`,
  )
  const row = {
    tenant_id: tenantId,
    setting_key: settingKey,
    setting_value: value,
    updated_at: new Date().toISOString(),
  }
  if (existing[0]?.id) {
    await rest(`restaurant_settings?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      headers: restHeaders({ Prefer: 'return=minimal' }),
      body: JSON.stringify(row),
    })
    return
  }
  await rest('restaurant_settings', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  })
}

export async function restoreRestaurantSettingSnapshot(
  tenantId: string,
  settingKey: string,
  snapshot: RestaurantSettingSnapshot,
): Promise<void> {
  if (snapshot.exists) {
    await upsertRestaurantSettingValue(tenantId, settingKey, snapshot.value)
    return
  }
  await rest(
    `restaurant_settings?tenant_id=eq.${tenantId}&setting_key=eq.${encodeURIComponent(settingKey)}`,
    {
      method: 'DELETE',
      headers: restHeaders({ Prefer: 'return=minimal' }),
    },
  )
}

export async function getTenantIdBySlug(slug: string): Promise<string> {
  const rows = await rest<Array<{ id: string }>>(
    `organizations?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
  )
  const id = rows[0]?.id
  if (!id) throw new Error(`Tenant non trovato per slug: ${slug}`)
  return id
}

export async function getExistingTenantSlug(
  preferredSlug: string,
  fallbacks: string[] = ['da-tommaso', 'test-classic', 'test-pro'],
): Promise<string> {
  const rows = await rest<Array<{ slug: string }>>(
    `organizations?select=slug&order=slug`,
  )
  const available = new Set(rows.map((row) => row.slug))
  if (available.has(preferredSlug)) return preferredSlug
  const fallback = fallbacks.find((slug) => available.has(slug)) ?? rows[0]?.slug
  if (!fallback) throw new Error('Nessun tenant disponibile su staging TEST')
  return fallback
}

export type ServiceSlotRow = {
  id: string
  name: string
  start_time: string
  end_time: string
  max_guests: number | null
}

export type ServiceSlotFullRow = {
  id: string
  tenant_id: string
  name: string
  start_time: string
  end_time: string
  display_order: number
  is_canonical: boolean
  max_guests: number | null
  max_turns: number | null
  max_turns_resume: number | null
  slot_color: string | null
  turnover_buffer_minutes?: number
  arrival_step_minutes?: number
  created_at?: string
  updated_at?: string
}

export type ServiceSlotsSnapshot = {
  slots: ServiceSlotFullRow[]
}

export async function getServiceSlots(tenantId: string): Promise<ServiceSlotRow[]> {
  return rest<ServiceSlotRow[]>(
    `service_slots?tenant_id=eq.${tenantId}&select=id,name,start_time,end_time,max_guests&order=display_order`,
  )
}

export async function getServiceSlotMaxTurns(slotId: string): Promise<number | null> {
  const rows = await rest<Array<{ max_turns: number | null }>>(
    `service_slots?id=eq.${slotId}&select=max_turns&limit=1`,
  )
  if (!rows[0]) throw new Error(`Service slot non trovata: ${slotId}`)
  return rows[0].max_turns
}

export async function getServiceSlotsSnapshot(tenantId: string): Promise<ServiceSlotsSnapshot> {
  const slots = await rest<ServiceSlotFullRow[]>(
    `service_slots?tenant_id=eq.${tenantId}&select=*&order=display_order`,
  )
  return { slots }
}

export async function deleteAllServiceSlots(tenantId: string): Promise<void> {
  await rest(`service_slots?tenant_id=eq.${tenantId}`, {
    method: 'DELETE',
    headers: restHeaders({ Prefer: 'return=minimal' }),
  })
}

export async function insertServiceSlots(
  slots: Array<Omit<ServiceSlotFullRow, 'created_at' | 'updated_at'>>,
): Promise<void> {
  if (slots.length === 0) return
  const now = new Date().toISOString()
  await rest('service_slots', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=minimal' }),
    body: JSON.stringify(
      slots.map((slot) => ({
        ...slot,
        created_at: now,
        updated_at: now,
      })),
    ),
  })
}

export async function restoreServiceSlotsSnapshot(
  tenantId: string,
  snapshot: ServiceSlotsSnapshot,
): Promise<void> {
  await deleteAllServiceSlots(tenantId)
  if (snapshot.slots.length === 0) return
  await insertServiceSlots(
    snapshot.slots.map((slot) => ({
      ...slot,
      tenant_id: tenantId,
    })),
  )
}

export async function getSlotGuestCapacities(tenantId: string): Promise<Record<string, number | null>> {
  const rows = await rest<Array<{ setting_value: Record<string, number | null> }>>(
    `restaurant_settings?tenant_id=eq.${tenantId}&setting_key=eq.slot_guest_capacities&select=setting_value`,
  )
  return rows[0]?.setting_value ?? {}
}

export async function upsertSlotGuestCapacities(
  tenantId: string,
  capacities: Record<string, number | null>,
): Promise<void> {
  const existing = await rest<Array<{ id: string }>>(
    `restaurant_settings?tenant_id=eq.${tenantId}&setting_key=eq.slot_guest_capacities&select=id&limit=1`,
  )
  if (existing[0]?.id) {
    await rest(`restaurant_settings?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      headers: restHeaders({ Prefer: 'return=minimal' }),
      body: JSON.stringify({ setting_value: capacities }),
    })
    return
  }
  await rest('restaurant_settings', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=minimal' }),
    body: JSON.stringify({
      tenant_id: tenantId,
      setting_key: 'slot_guest_capacities',
      setting_value: capacities,
    }),
  })
}

export type SeedBookingInput = {
  tenantId: string
  clientName: string
  status: 'pending' | 'accepted'
  desiredDate: string
  desiredTime: string
  numGuests: number
  confirmedStart?: string
  confirmedEnd?: string
}

export async function insertBooking(input: SeedBookingInput): Promise<string> {
  const row = {
    tenant_id: input.tenantId,
    client_name: input.clientName,
    client_email: `${input.clientName.replace(/\s+/g, '.').toLowerCase()}@e2e.test`,
    status: input.status,
    desired_date: input.desiredDate,
    desired_time: input.desiredTime,
    num_guests: input.numGuests,
    booking_source: 'public',
    source: 'public_form',
    confirmed_start: input.confirmedStart ?? null,
    confirmed_end: input.confirmedEnd ?? null,
  }
  const created = await rest<Array<{ id: string }>>('booking_requests', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  const id = created[0]?.id
  if (!id) throw new Error('insertBooking: nessun id restituito')
  return id
}

export async function patchBookingById(
  bookingId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  await rest(`booking_requests?id=eq.${bookingId}`, {
    method: 'PATCH',
    headers: restHeaders({ Prefer: 'return=minimal' }),
    body: JSON.stringify({
      ...patch,
      updated_at: new Date().toISOString(),
    }),
  })
}

export async function deleteBookingsByPrefix(tenantId: string, prefix = E2E_BOOKING_PREFIX): Promise<void> {
  await rest(
    `booking_requests?tenant_id=eq.${tenantId}&client_name=like.${encodeURIComponent(prefix)}*`,
    {
      method: 'DELETE',
      headers: restHeaders({ Prefer: 'return=minimal' }),
    },
  )
}

/**
 * Prenotazioni di un tenant il cui nome cliente inizia col prefisso dato.
 *
 * Serve ai test del form pubblico per dimostrare che il submit ha davvero creato la
 * riga: senza questa lettura l'unica prova disponibile è un elemento a schermo, e un
 * locator generoso (`[role="status"]`, `[class*="toast"]`) diventa verde anche quando
 * la prenotazione non è mai partita — è successo davvero su `public-booking.spec.ts`.
 */
export async function getBookingsByNamePrefix(
  tenantId: string,
  prefix: string,
): Promise<Array<{ id: string; client_name: string; status: string; num_guests: number }>> {
  return rest<Array<{ id: string; client_name: string; status: string; num_guests: number }>>(
    `booking_requests?tenant_id=eq.${tenantId}&client_name=like.${encodeURIComponent(prefix)}*` +
      `&select=id,client_name,status,num_guests&order=created_at.desc`,
  )
}

export async function getBookingStatus(bookingId: string): Promise<string | null> {
  const rows = await rest<Array<{ status: string }>>(
    `booking_requests?id=eq.${bookingId}&select=status&limit=1`,
  )
  return rows[0]?.status ?? null
}

// ─────────────────────────────────────────────
// Rooms / Tables / Table assignments (Servizio — piantina, avviso fine turno)
// ─────────────────────────────────────────────

export const E2E_SERVIZIO_PREFIX = 'E2E-SRV-'

export type RoomE2eRow = {
  id: string
  name: string
  width: number
  height: number
}

export async function insertRoom(input: {
  tenantId: string
  name: string
  width?: number
  height?: number
  displayOrder?: number
}): Promise<RoomE2eRow> {
  const row = {
    tenant_id: input.tenantId,
    name: input.name,
    width: input.width ?? 800,
    height: input.height ?? 600,
    display_order: input.displayOrder ?? 0,
  }
  const created = await rest<RoomE2eRow[]>('rooms', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  const room = created[0]
  if (!room) throw new Error('insertRoom: nessuna riga restituita')
  return room
}

export type TableE2eRow = {
  id: string
  name: string
  capacity: number
  room_id: string | null
}

export async function insertTable(input: {
  tenantId: string
  roomId: string
  name: string
  capacity: number
  positionX?: number
  positionY?: number
  shape?: 'round' | 'square' | 'rect'
}): Promise<TableE2eRow> {
  const row = {
    tenant_id: input.tenantId,
    room_id: input.roomId,
    name: input.name,
    capacity: input.capacity,
    position_x: input.positionX ?? 20,
    position_y: input.positionY ?? 20,
    shape: input.shape ?? 'square',
  }
  const created = await rest<TableE2eRow[]>('tables', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  const table = created[0]
  if (!table) throw new Error('insertTable: nessuna riga restituita')
  return table
}

export type TableAssignmentE2eRow = {
  id: string
  table_id: string
  booking_id: string
  service_slot_id: string
  date: string
  turn_number: number
  checked_out_at: string | null
}

export async function insertTableAssignment(input: {
  tenantId: string
  bookingId: string
  tableId: string
  serviceSlotId: string
  date: string
  turnNumber?: number
  checkedOutAt?: string | null
}): Promise<TableAssignmentE2eRow> {
  const row = {
    tenant_id: input.tenantId,
    booking_id: input.bookingId,
    table_id: input.tableId,
    service_slot_id: input.serviceSlotId,
    date: input.date,
    turn_number: input.turnNumber ?? 1,
    checked_out_at: input.checkedOutAt ?? null,
  }
  const created = await rest<TableAssignmentE2eRow[]>('booking_table_assignments', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  const assignment = created[0]
  if (!assignment) throw new Error('insertTableAssignment: nessuna riga restituita')
  return assignment
}

export async function getTableAssignmentsForBooking(
  bookingId: string,
): Promise<Array<{
  id: string
  table_id: string
  checked_out_at: string | null
  forced_by_admin?: boolean | null
  force_reason?: string | null
  turn_number?: number
}>> {
  return rest(
    `booking_table_assignments?booking_id=eq.${bookingId}&select=id,table_id,checked_out_at,forced_by_admin,force_reason,turn_number`,
  )
}

export async function getBookingServedAt(bookingId: string): Promise<string | null> {
  const rows = await rest<Array<{ served_at: string | null }>>(
    `booking_requests?id=eq.${bookingId}&select=served_at&limit=1`,
  )
  return rows[0]?.served_at ?? null
}

export async function getTableActive(tableId: string): Promise<boolean | null> {
  const rows = await rest<Array<{ active: boolean }>>(
    `tables?id=eq.${tableId}&select=active&limit=1`,
  )
  return rows[0]?.active ?? null
}

/**
 * Cleanup: le assignment hanno FK ON DELETE CASCADE su booking_id e table_id
 * (mig. 011), quindi cancellare le prenotazioni e i tavoli seminati basta a far
 * sparire anche le righe di booking_table_assignments — nessun DELETE separato
 * necessario. rooms→tables è ON DELETE SET NULL (mig. 008): la sala si può
 * cancellare in qualunque ordine rispetto ai tavoli.
 */
export async function deleteTablesByPrefix(
  tenantId: string,
  prefix = E2E_SERVIZIO_PREFIX,
): Promise<void> {
  await rest(`tables?tenant_id=eq.${tenantId}&name=like.${encodeURIComponent(prefix)}*`, {
    method: 'DELETE',
    headers: restHeaders({ Prefer: 'return=minimal' }),
  })
}

export async function deleteRoomsByPrefix(
  tenantId: string,
  prefix = E2E_SERVIZIO_PREFIX,
): Promise<void> {
  await rest(`rooms?tenant_id=eq.${tenantId}&name=like.${encodeURIComponent(prefix)}*`, {
    method: 'DELETE',
    headers: restHeaders({ Prefer: 'return=minimal' }),
  })
}

/**
 * Fascia temporanea usa-e-getta: gli scenari sul ciclo di vita dei tavoli non
 * dipendono dall'orario configurato della fascia (solo da confirmed_start/end
 * della prenotazione, vedi commento di testata di pro-service-tables-lifecycle.spec.ts),
 * quindi ogni test crea la propria invece di riusare una fascia reale del
 * tenant (es. "Cena") — la finestra "Tavolo a fine turno" raggruppa per
 * tenant+data+service_slot_id, e più test che condividono la stessa fascia
 * sulla data di oggi si vedrebbero a vicenda i tavoli in uscita se eseguiti
 * in parallelo (fullyParallel:true in playwright.config.ts). Una fascia per
 * test elimina la collisione alla radice, senza bisogno di serializzare nulla.
 */
export async function insertServiceSlot(input: {
  tenantId: string
  name: string
  startTime?: string
  endTime?: string
  displayOrder?: number
  maxTurns?: number | null
}): Promise<{ id: string; name: string }> {
  const row = {
    tenant_id: input.tenantId,
    name: input.name,
    start_time: input.startTime ?? '00:00',
    end_time: input.endTime ?? '23:59',
    display_order: input.displayOrder ?? 9000,
    max_turns: input.maxTurns ?? null,
  }
  const created = await rest<Array<{ id: string; name: string }>>('service_slots', {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  const slot = created[0]
  if (!slot) throw new Error('insertServiceSlot: nessuna riga restituita')
  return slot
}

/** Cascade su booking_table_assignments.service_slot_id (mig. 011) — nessun ordine di cleanup richiesto. */
export async function deleteServiceSlotsByPrefix(
  tenantId: string,
  prefix = E2E_SERVIZIO_PREFIX,
): Promise<void> {
  await rest(`service_slots?tenant_id=eq.${tenantId}&name=like.${encodeURIComponent(prefix)}*`, {
    method: 'DELETE',
    headers: restHeaders({ Prefer: 'return=minimal' }),
  })
}

export function todayIsoDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Data ISO locale a N giorni da oggi (per prenotazioni «future» in E2E). */
export function offsetIsoDate(daysFromToday: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromToday)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isoStartEnd(date: string, timeHHmm: string): { start: string; end: string } {
  const [h, min] = timeHHmm.split(':').map(Number)
  const endH = h + 3
  const endTime = `${String(endH).padStart(2, '0')}:${String(min).padStart(2, '0')}`
  return {
    start: `${date}T${timeHHmm}:00+00:00`,
    end: `${date}T${endTime}:00+00:00`,
  }
}
