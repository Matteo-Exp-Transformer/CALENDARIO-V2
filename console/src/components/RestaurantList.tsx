/**
 * Lista ristoranti — card compatte (REQ-004, DEC-A…DEC-F).
 *
 * Ogni card mostra SOLO: nome azienda + nome utente associato + etichetta versione +
 * stato attivo/sospeso + pulsante "Apri scheda". I pannelli EditionSelector /
 * FeatureFlagsPanel / RestaurantSettingsPanel sono stati spostati in TenantDetail
 * (DEC-D): la configurazione si fa esclusivamente dalla scheda.
 *
 * QUERY UTENTI (DEC-F): select annidata admin_users(name, email) via FK
 * admin_users.tenant_id → organizations.id (policy PLAN-DB-005 già attiva su TEST).
 *
 * RICERCA (DEC-C): filtro lato client case-insensitive su nome azienda O nome/email utente.
 *
 * onDataReady: callback chiamato al primo render 'ok' dopo il mount; AppShell lo usa
 * per ripristinare la posizione di scorrimento dopo il rientro dalla scheda (DEC-E.2, DEC-055).
 *
 * REFETCH senza lampeggio (DEC-E.3 / punto 3 di DEC-E): fetchOrgs mantiene i dati
 * visibili durante il re-fetch (es. dopo "+ Nuova azienda"), evitando il salto in cima.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'
import {
  normalizeEdition,
  editionLabel,
  editionBadgeColors,
  type Edition,
} from '@console/lib/editionUtils'
import { isSandboxTenant } from '@console/lib/sandbox'
import { useTenantMutations } from '@console/hooks/useTenantMutations'
import { CreateTenantModal } from './CreateTenantModal'

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

interface AdminUserBasic {
  name: string | null
  email: string
}

// Tipo minimo che la Console legge da organizations (sola lettura).
interface Organization {
  id: string
  slug: string
  name: string
  edition: Edition
  is_active: boolean
  admin_users: AdminUserBasic[]
}

// Riga grezza dal DB (edition può arrivare come stringa generica, admin_users come array o null).
interface OrgRow {
  id: string
  slug: string
  name: string
  edition: string | null
  is_active: boolean
  admin_users: Array<{ name: string | null; email: string }> | null
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: Organization[] }

// ---------------------------------------------------------------------------
// Componente principale
// ---------------------------------------------------------------------------

interface RestaurantListProps {
  /** Callback per aprire la scheda di un tenant (F9). */
  onOpenTenantDetail: (tenantId: string) => void
  /**
   * Chiamato al primo caricamento 'ok' dopo il mount.
   * AppShell lo usa per ripristinare la posizione di scorrimento salvata
   * quando si era aperta la scheda (DEC-055).
   */
  onDataReady?: () => void
}

export function RestaurantList({ onOpenTenantDetail, onDataReady }: RestaurantListProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  // refetchCounter: incrementato da handleTenantCreated per forzare il re-fetch.
  const [refetchCounter, setRefetchCounter] = useState(0)
  const [search, setSearch] = useState('')
  // Ref per prevenire aggiornamenti di stato dopo lo smontaggio del componente.
  const mountedRef = useRef(true)
  // Garantisce che onDataReady venga chiamato al massimo una volta per mount.
  const dataReadyFired = useRef(false)
  // Stato modale "Nuova azienda" (F12).
  const [showCreateModal, setShowCreateModal] = useState(false)
  const tenantMutations = useTenantMutations()

  const fetchOrgs = useCallback(async () => {
    // Mantieni i dati correnti visibili durante il re-fetch: evita il salto in cima
    // e il "lampeggio" di caricamento su ogni aggiornamento (es. dopo "Nuova azienda").
    setState((prev) => (prev.status === 'ok' ? prev : { status: 'loading' }))

    const { data, error } = await supabase
      .from('organizations')
      // Relazione 1→N via FK admin_users.tenant_id. Richiede PLAN-DB-005 su TEST.
      .select('id, slug, name, edition, is_active, admin_users(name, email)')
      .order('name')

    if (!mountedRef.current) return

    if (error) {
      setState({ status: 'error', message: error.message })
      return
    }

    const rows: Organization[] = (data as unknown as OrgRow[]).map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      edition: normalizeEdition(row.edition),
      is_active: row.is_active,
      admin_users: row.admin_users ?? [],
    }))

    setState({ status: 'ok', data: rows })
  }, [])

  // Fetch iniziale + re-fetch quando refetchCounter cambia (post creazione tenant).
  useEffect(() => {
    mountedRef.current = true
    fetchOrgs()
    return () => {
      mountedRef.current = false
    }
  // fetchOrgs è stabile (useCallback senza dipendenze variabili).
  // refetchCounter forza il re-run quando CreateTenantModal segnala un successo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchCounter])

  // Notifica AppShell al primo caricamento riuscito, per ripristinare lo scorrimento.
  useEffect(() => {
    if (state.status === 'ok' && !dataReadyFired.current) {
      dataReadyFired.current = true
      onDataReady?.()
    }
  }, [state.status, onDataReady])

  // Callback per CreateTenantModal: chiude il modale e forza un re-fetch.
  const handleTenantCreated = useCallback(() => {
    setShowCreateModal(false)
    setRefetchCounter((c) => c + 1)
  }, [])

  // Filtro lato client: nome azienda O nome/email utente, case-insensitive (DEC-C / DEC-F).
  const filtered =
    state.status === 'ok'
      ? state.data.filter((org) => {
          const q = search.toLowerCase()
          if (!q) return true
          if (org.name.toLowerCase().includes(q)) return true
          return org.admin_users.some(
            (u) =>
              (u.name ?? '').toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q),
          )
        })
      : []

  return (
    <section>
      {/* Header: titolo + ricerca + "+ Nuova azienda" */}
      <div style={styles.topBar}>
        <h2 style={styles.sectionTitle}>Ristoranti</h2>
        <input
          type="search"
          placeholder="Cerca azienda o utente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
          aria-label="Cerca ristorante per nome azienda o nome utente"
        />
        <button
          onClick={() => setShowCreateModal(true)}
          style={styles.newTenantBtn}
          aria-label="Crea una nuova azienda"
        >
          + Nuova azienda
        </button>
      </div>

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

      {state.status === 'ok' && state.data.length > 0 && filtered.length === 0 && (
        <p style={styles.statusText}>Nessun ristorante corrisponde alla ricerca.</p>
      )}

      {state.status === 'ok' && filtered.length > 0 && (
        <div style={styles.grid}>
          {filtered.map((org) => (
            <OrgCard
              key={org.id}
              org={org}
              onOpenDetail={() => onOpenTenantDetail(org.id)}
            />
          ))}
        </div>
      )}

      {/* Modale "Nuova azienda" (F12 — REQ-003) */}
      {showCreateModal && (
        <CreateTenantModal
          mutations={tenantMutations}
          onSuccess={handleTenantCreated}
          onClose={() => {
            setShowCreateModal(false)
            tenantMutations.resetCreate()
          }}
        />
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Card singola — compatta (DEC-B): nome + utente + versione + stato + "Apri scheda".
// Nessun pannello inline: EditionSelector / FeatureFlagsPanel / RestaurantSettingsPanel
// sono stati spostati in TenantDetail (DEC-D).
// ---------------------------------------------------------------------------

interface OrgCardProps {
  org: Organization
  /** Apre la scheda di questo tenant (F9). */
  onOpenDetail: () => void
}

function OrgCard({ org, onOpenDetail }: OrgCardProps) {
  const badge = editionBadgeColors(org.edition)
  // isSandboxTenant: solo etichetta visiva (bordo diverso), non gate di scrittura (DEC-052).
  const sandbox = isSandboxTenant(org.id)
  const { text: userText, faint: userFaint } = resolveUserLabel(org.admin_users)

  return (
    <div
      style={{
        ...styles.card,
        borderColor: sandbox ? '#3b5268' : '#334155',
      }}
    >
      {/* Riga 1: nome + edition badge + stato */}
      <div style={styles.cardHeader}>
        <span style={styles.orgName}>{org.name}</span>
        <span
          style={{
            ...styles.editionBadge,
            background: badge.bg,
            color: badge.text,
          }}
        >
          {editionLabel(org.edition)}
        </span>
        <span style={org.is_active ? styles.activePill : styles.inactivePill}>
          {org.is_active ? 'Attivo' : 'Sospeso'}
        </span>
      </div>

      {/* Riga 2: nome utente associato (DEC-F) */}
      <span style={userFaint ? styles.userLabelFaint : styles.userLabel}>
        {userText}
      </span>

      {/* Riga 3: pulsante "Apri scheda" */}
      <button onClick={onOpenDetail} style={styles.openDetailBtn}>
        Apri scheda →
      </button>
    </div>
  )
}

/**
 * Determina il testo da mostrare per l'utente associato e se deve essere tenue.
 * 0 utenti → "nessun utente" (tenue); 1 → nome o email; più di 1 → primo +N.
 */
function resolveUserLabel(users: AdminUserBasic[]): { text: string; faint: boolean } {
  if (users.length === 0) return { text: 'nessun utente', faint: true }
  const first = users[0]
  const name = first.name?.trim() || first.email
  if (users.length === 1) return { text: name, faint: false }
  return { text: `${name} +${users.length - 1}`, faint: false }
}

// ---------------------------------------------------------------------------
// Stili inline — nessuna dipendenza da file CSS dell'app di Matteo.
// Palette coerente con UserList/AppShell.
// ---------------------------------------------------------------------------

const styles = {
  // Header sezione: titolo + ricerca + "+ Nuova azienda" in riga.
  topBar: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '0.75rem',
    marginBottom: '1rem',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#f8fafc',
    margin: 0,
    flex: '1 1 auto',
  } as React.CSSProperties,

  // Barra di ricerca — stesso stile di UserList (DEC-C).
  searchInput: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '0.8125rem',
    padding: '0.35rem 0.65rem',
    outline: 'none',
    width: '220px',
    maxWidth: '100%',
  } as React.CSSProperties,

  // Pulsante "+ Nuova azienda" — blu per azione positiva (F12).
  newTenantBtn: {
    background: '#1e3a5f',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    color: '#93c5fd',
    fontSize: '0.8rem',
    fontWeight: 700,
    padding: '0.4rem 0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap' as const,
    transition: 'opacity 0.15s',
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

  // Griglia più densa rispetto a prima: colonne più strette, gap più stretto.
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '0.6rem',
  } as React.CSSProperties,

  // Card compatta: meno padding, meno gap interno, nessuna sezione/divisore.
  card: {
    background: '#1e293b',
    border: '1px solid',
    borderRadius: '10px',
    padding: '0.65rem 0.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
  } as React.CSSProperties,

  // Riga header: nome (flex:1, troncato) + badge edition + pill stato.
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  orgName: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#f1f5f9',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    flex: '1 1 0',
    minWidth: 0,
  } as React.CSSProperties,

  editionBadge: {
    flexShrink: 0,
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '0.15rem 0.5rem',
    borderRadius: '5px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  activePill: {
    flexShrink: 0,
    background: '#14532d',
    color: '#86efac',
    fontSize: '0.65rem',
    fontWeight: 600,
    padding: '0.1rem 0.45rem',
    borderRadius: '999px',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  inactivePill: {
    flexShrink: 0,
    background: '#1c1917',
    color: '#a8a29e',
    fontSize: '0.65rem',
    fontWeight: 600,
    padding: '0.1rem 0.45rem',
    borderRadius: '999px',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  // Nome utente visibile.
  userLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  // "nessun utente" — testo tenue per segnalare assenza senza bloccare la lettura.
  userLabelFaint: {
    fontSize: '0.75rem',
    color: '#475569',
    fontStyle: 'italic',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  // Pulsante "Apri scheda" — apre TenantDetail per questo tenant (F9).
  openDetailBtn: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#93c5fd',
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '0.25rem 0.6rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap' as const,
    marginTop: '0.1rem',
  } as React.CSSProperties,
} as const
