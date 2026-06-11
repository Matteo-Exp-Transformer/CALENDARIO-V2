/**
 * Helper REST Supabase staging per seed/cleanup E2E (service role).
 * Usare SOLO con progetto TEST (docnnernvp) — mai PROD.
 */

import fs from 'fs'

export const E2E_BOOKING_PREFIX = 'E2E-FU043-'

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

export async function getTenantIdBySlug(slug: string): Promise<string> {
  const rows = await rest<Array<{ id: string }>>(
    `organizations?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
  )
  const id = rows[0]?.id
  if (!id) throw new Error(`Tenant non trovato per slug: ${slug}`)
  return id
}

export type ServiceSlotRow = {
  id: string
  name: string
  start_time: string
  end_time: string
  max_guests: number | null
}

export async function getServiceSlots(tenantId: string): Promise<ServiceSlotRow[]> {
  return rest<ServiceSlotRow[]>(
    `service_slots?tenant_id=eq.${tenantId}&select=id,name,start_time,end_time,max_guests&order=display_order`,
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

export async function deleteBookingsByPrefix(tenantId: string, prefix = E2E_BOOKING_PREFIX): Promise<void> {
  await rest(
    `booking_requests?tenant_id=eq.${tenantId}&client_name=like.${encodeURIComponent(prefix)}*`,
    {
      method: 'DELETE',
      headers: restHeaders({ Prefer: 'return=minimal' }),
    },
  )
}

export async function getBookingStatus(bookingId: string): Promise<string | null> {
  const rows = await rest<Array<{ status: string }>>(
    `booking_requests?id=eq.${bookingId}&select=status&limit=1`,
  )
  return rows[0]?.status ?? null
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
