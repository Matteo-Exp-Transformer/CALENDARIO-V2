/**
 * Crea una prenotazione "Rinfresco di Laurea" con tutti i `menu_items` del tenant selezionato.
 *
 * Data fissa predefinita: 2026-05-08 (override: FIXED_BOOKING_DATE=YYYY-MM-DD).
 *
 * Uso (dalla root del repo):
 *   node --env-file=.env.local scripts/seed-full-menu-booking.mjs
 *
 * Variabili obbligatorie:
 *   - VITE_SUPABASE_URL (o SUPABASE_URL)
 *   - VITE_SUPABASE_ANON_KEY — per leggere organizations + menu_items e (senza service role)
 *       chiamare l'edge function `create-booking`
 *   - TENANT_SLUG (o VITE_TENANT_SLUG) — slug in organizations.slug (= parte URL /prenota/<slug>)
 *
 * Opzionale (consigliato per QA calendario: prenotazione subito ACCEPTED):
 *   - SUPABASE_SERVICE_ROLE_KEY — INSERT diretta come admin (status accepted + confirmed_*)
 *
 * Altri override opzionali:
 *   - NUM_GUESTS (default 12)
 *   - DESIRED_TIME (default 20:00)
 *   - CLIENT_NAME, CLIENT_EMAIL, CLIENT_PHONE
 */

import { readFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const FIXED_BOOKING_DATE = process.env.FIXED_BOOKING_DATE || '2026-05-08'

/** Legge TENANT_SLUG da .env.local / .env nella root del repo (priorità sulla sessione shell / Node --env-file). */
function parseTenantSlugFromProjectRoot() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  for (const name of ['.env.local', '.env']) {
    const p = join(root, name)
    if (!existsSync(p)) continue
    let text = readFileSync(p, 'utf8')
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
    for (let line of text.split(/\r?\n/)) {
      line = line.trim()
      if (!line || line.startsWith('#')) continue
      const m = /^(?:export\s+)?(TENANT_SLUG|VITE_TENANT_SLUG)\s*=\s*(.*)$/.exec(line)
      if (!m) continue
      let v = m[2].trim()
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1)
      }
      const slug = v.trim()
      if (slug) return slug
    }
  }
  return null
}

function createBookingDateTime(dateStr, timeStr, isStart = true, startTime) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hours, minutes] = timeStr.split(':').map(Number)
  let finalYear = year
  let finalMonth = month
  let finalDay = day
  let finalHours = hours
  let finalMinutes = minutes
  if (!isStart && startTime) {
    const [startHours] = startTime.split(':').map(Number)
    if (hours < startHours || (hours === startHours && startHours >= 22)) {
      const d = new Date(year, month - 1, day)
      d.setDate(d.getDate() + 1)
      finalYear = d.getFullYear()
      finalMonth = d.getMonth() + 1
      finalDay = d.getDate()
    }
  }
  return `${String(finalYear).padStart(4, '0')}-${String(finalMonth).padStart(2, '0')}-${String(finalDay).padStart(2, '0')}T${String(finalHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}:00+00:00`
}

function calculateEndTimeFromStart(startTime, hoursToAdd = 3) {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + hoursToAdd * 60
  const wrapped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const endH = Math.floor(wrapped / 60)
  const endM = wrapped % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

function normalizeTime(t) {
  if (!t) return '20:00'
  return t.split(':').slice(0, 2).join(':')
}

function buildMenuSelection(menuRows) {
  let tiramisuKg = 0
  let tiramisuTotal = 0
  let tiramisuDone = false
  const items = []

  for (const row of menuRows) {
    const price = Number(row.price)
    const name = row.name
    const isTiramisu = name.toLowerCase().includes('tiramis')

    if (isTiramisu) {
      if (tiramisuDone) continue
      const kg = 1
      const lineTotal = price * kg
      tiramisuKg = kg
      tiramisuTotal = lineTotal
      tiramisuDone = true
      items.push({
        id: row.id,
        name: row.name,
        price,
        category: row.category,
        quantity: kg,
        totalPrice: lineTotal,
      })
      continue
    }

    items.push({
      id: row.id,
      name: row.name,
      price,
      category: row.category,
      quantity: 1,
      totalPrice: price,
    })
  }

  const basePerPerson = items
    .filter((i) => !i.name.toLowerCase().includes('tiramis'))
    .reduce((s, i) => s + (i.totalPrice ?? i.price), 0)

  return {
    menu_selection: {
      items,
      tiramisu_total: tiramisuTotal,
      tiramisu_kg: tiramisuKg,
    },
    menu_total_per_person: basePerPerson,
  }
}

const PLACEHOLDER_SLUGS = new Set([
  'nome-del-tuo-slug',
  'il-tuo-slug',
  'your-slug',
  'YOUR_SLUG_HERE',
])

async function main() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const slugFromFile = parseTenantSlugFromProjectRoot()
  const tenantSlug = (
    slugFromFile ||
    process.env.TENANT_SLUG ||
    process.env.VITE_TENANT_SLUG ||
    ''
  ).trim()

  console.log('[seed-full-menu-booking] slug risolto:', JSON.stringify(tenantSlug || '(vuoto)'))
  if (slugFromFile) {
    console.log('[seed-full-menu-booking] (tenant da .env.local / .env nel repo, ignora TENANT_SLUG ereditato dalla shell)')
  }

  if (PLACEHOLDER_SLUGS.has(tenantSlug)) {
    console.error(`
[seed-full-menu-booking] Stai usando un placeholder (${tenantSlug}), non lo slug vero dell’organizzazione.
Per Al Ritrovo usa: TENANT_SLUG=al-ritrovo

Se hai già aggiornato .env.local ma vedi ancora il placeholder:
  • In PowerShell potresti avere $env:TENANT_SLUG impostato in sessione → Node NON sovrascrive con il file.
  • Risoluzione: chiudi il terminale, aprine uno nuovo, oppure:
      Remove-Item Env:TENANT_SLUG -ErrorAction SilentlyContinue
    poi rilanci npm run seed:booking-menu-full
`)
    process.exit(1)
  }

  if (!supabaseUrl || !anonKey) {
    console.error('Mancano VITE_SUPABASE_URL e/o VITE_SUPABASE_ANON_KEY (o equivalenti SUPABASE_*).')
    process.exit(1)
  }
  if (!tenantSlug) {
    console.error(`
[seed-full-menu-booking] Manca lo slug dell’organizzazione.

Aggiungi in .env.local (stesso folder del progetto) una di queste righe:
  TENANT_SLUG=il-tuo-slug

oppure:
  VITE_TENANT_SLUG=il-tuo-slug

Il valore è il campo slug in Supabase → Table Editor → organizations,
(o la parte dopo /prenota/ nell’URL pubblico di prenotazione).

Esempio solo per questa shell (PowerShell):
  $env:TENANT_SLUG="nome-slug"; npm run seed:booking-menu-full
`)
    process.exit(1)
  }

  const supabaseAnon = createClient(supabaseUrl, anonKey)

  const { data: org, error: orgErr } = await supabaseAnon
    .from('organizations')
    .select('id, name')
    .eq('slug', tenantSlug)
    .maybeSingle()

  if (orgErr || !org) {
    console.error('Organizzazione non trovata per slug:', tenantSlug, orgErr?.message || '')
    process.exit(1)
  }

  const { data: menuRows, error: menuErr } = await supabaseAnon
    .from('menu_items')
    .select('id,name,price,category,sort_order')
    .eq('tenant_id', org.id)
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })

  if (menuErr) {
    console.error('Errore lettura menu_items:', menuErr.message)
    process.exit(1)
  }

  if (!menuRows?.length) {
    console.error('Nessun menu_items per questo tenant. Aggiungi prodotti dall’admin prima di eseguire lo script.')
    process.exit(1)
  }

  const numGuests = Math.max(1, parseInt(process.env.NUM_GUESTS || '12', 10))
  const desiredTime = normalizeTime(process.env.DESIRED_TIME || '20:00')
  const clientName =
    process.env.CLIENT_NAME ||
    `[Script] Rinfresco menù completo ${new Date().toISOString().slice(0, 19)}`
  const clientEmail = (process.env.CLIENT_EMAIL || 'script-menu-test@example.invalid').trim()
  const clientPhone = process.env.CLIENT_PHONE || '3400000000'

  const { menu_selection, menu_total_per_person } = buildMenuSelection(menuRows)
  const menu_total_booking = menu_total_per_person * numGuests + (menu_selection.tiramisu_total || 0)

  const menuDescription = menuRows
    .map((r) => r.name)
    .slice(0, 25)
    .join(', ')
    .concat(menuRows.length > 25 ? ` … (+${menuRows.length - 25} voci)` : '')

  const basePayload = {
    client_name: clientName,
    client_email: clientEmail,
    client_phone: clientPhone,
    desired_date: FIXED_BOOKING_DATE,
    desired_time: desiredTime,
    num_guests: numGuests,
    special_requests: `Generato da scripts/seed-full-menu-booking.mjs — ${menuRows.length} voci menù.`,
    booking_type: 'rinfresco_laurea',
    event_type: 'laurea',
    menu: menuDescription,
    menu_selection,
    menu_total_per_person,
    menu_total_booking,
    preset_menu: null,
    dietary_restrictions: [],
    placement: 'Script QA',
  }

  if (serviceKey) {
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)
    const startTime = desiredTime
    const endTime = calculateEndTimeFromStart(startTime, 3)
    const confirmed_start = createBookingDateTime(FIXED_BOOKING_DATE, startTime, true)
    const confirmed_end = createBookingDateTime(FIXED_BOOKING_DATE, endTime, false, startTime)

    const insertData = {
      tenant_id: org.id,
      ...basePayload,
      booking_source: 'admin',
      status: 'accepted',
      confirmed_start,
      confirmed_end,
    }

    const { data: row, error: insErr } = await supabaseAdmin
      .from('booking_requests')
      .insert(insertData)
      .select('id,status,desired_date,menu_total_per_person,menu_total_booking')
      .single()

    if (insErr) {
      console.error('Insert fallita:', insErr.message)
      process.exit(1)
    }

    console.log('OK — prenotazione ACCEPTED (service role):', JSON.stringify(row, null, 2))
    return
  }

  const anonForFn = anonKey
  const res = await fetch(`${supabaseUrl}/functions/v1/create-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anonForFn}`,
      apikey: anonForFn,
    },
    body: JSON.stringify({
      tenantSlug,
      ...basePayload,
    }),
  })

  const bodyText = await res.text()
  let parsed
  try {
    parsed = JSON.parse(bodyText)
  } catch {
    parsed = bodyText
  }

  if (!res.ok) {
    console.error('create-booking fallita:', res.status, parsed)
    process.exit(1)
  }

  const booking = typeof parsed === 'object' ? parsed.booking ?? parsed : parsed
  console.log('OK — creata tramite Edge Function:', JSON.stringify(booking, null, 2))
  console.log(`
--- Calendario admin ---
Il calendario mostra solo prenotazioni ACCEPTED (con orari confermati).
Questa richiesta è PENDING: la vedi in «Richieste in sospeso» / approvazione, non nel calendario finché non la accetti.

Per generarne una già visibile il giorno ${FIXED_BOOKING_DATE}:
  • aggiungi SUPABASE_SERVICE_ROLE_KEY in .env.local (Dashboard Supabase → Settings → API), poi rilancia lo script,
  oppure
  • accetta manualmente questa richiesta dall’admin dopo il seed.
`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
