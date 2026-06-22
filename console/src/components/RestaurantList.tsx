import { useEffect, useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'
import {
  normalizeEdition,
  editionLabel,
  editionBadgeColors,
  type Edition,
} from '@console/lib/editionUtils'

// Tipo minimo che la Console legge da organizations (sola lettura).
// Colonne: quelle visibili con la policy anon_select_active_organizations.
interface Organization {
  id: string
  slug: string
  name: string
  edition: Edition
  is_active: boolean
}

// Riga grezza dal DB (edition può arrivare come stringa generica).
interface OrgRow {
  id: string
  slug: string
  name: string
  edition: string | null
  is_active: boolean
}

// Stati possibili del caricamento.
type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: Organization[] }

export function RestaurantList() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function fetchOrgs() {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, slug, name, edition, is_active')
        .order('name')

      if (cancelled) return

      if (error) {
        setState({ status: 'error', message: error.message })
        return
      }

      const rows: Organization[] = (data as OrgRow[]).map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        edition: normalizeEdition(row.edition),
        is_active: row.is_active,
      }))

      setState({ status: 'ok', data: rows })
    }

    fetchOrgs()
    return () => { cancelled = true }
  }, [])

  return (
    <section>
      <h2 style={styles.sectionTitle}>Ristoranti</h2>

      {state.status === 'loading' && (
        <p style={styles.statusText}>Caricamento in corso…</p>
      )}

      {state.status === 'error' && (
        <div style={styles.errorBox}>
          <strong>Errore nel caricamento</strong>
          <br />
          {state.message}
        </div>
      )}

      {state.status === 'ok' && state.data.length === 0 && (
        <p style={styles.statusText}>Nessun ristorante trovato.</p>
      )}

      {state.status === 'ok' && state.data.length > 0 && (
        <div style={styles.grid}>
          {state.data.map((org) => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </section>
  )
}

function OrgCard({ org }: { org: Organization }) {
  const badge = editionBadgeColors(org.edition)

  return (
    <div style={styles.card}>
      {/* Nome e stato attivo */}
      <div style={styles.cardHeader}>
        <span style={styles.orgName}>{org.name}</span>
        <span style={org.is_active ? styles.activePill : styles.inactivePill}>
          {org.is_active ? 'Attivo' : 'Sospeso'}
        </span>
      </div>

      {/* Slug */}
      <span style={styles.slug}>/{org.slug}</span>

      {/* Edition badge */}
      <span
        style={{
          ...styles.editionBadge,
          background: badge.bg,
          color: badge.text,
        }}
      >
        {editionLabel(org.edition)}
      </span>
    </div>
  )
}

// Stili inline — nessuna dipendenza da file CSS dell'app di Matteo.
const styles = {
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#f8fafc',
    marginBottom: '1rem',
  } as React.CSSProperties,

  statusText: {
    color: '#64748b',
    fontSize: '0.875rem',
  } as React.CSSProperties,

  errorBox: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '8px',
    padding: '1rem',
    color: '#fca5a5',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  // Griglia responsive: 1 colonna su mobile, 2 su tablet, 3 su desktop.
  // Usiamo minmax per colonne fluide senza media queries JS.
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '0.75rem',
  } as React.CSSProperties,

  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  } as React.CSSProperties,

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
  } as React.CSSProperties,

  orgName: {
    fontWeight: 600,
    fontSize: '0.9375rem',
    color: '#f1f5f9',
    // Tronca se il nome è molto lungo su mobile
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  activePill: {
    flexShrink: 0,
    background: '#14532d',
    color: '#86efac',
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  inactivePill: {
    flexShrink: 0,
    background: '#1c1917',
    color: '#a8a29e',
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  slug: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontFamily: 'monospace',
  } as React.CSSProperties,

  editionBadge: {
    alignSelf: 'flex-start',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
} as const
