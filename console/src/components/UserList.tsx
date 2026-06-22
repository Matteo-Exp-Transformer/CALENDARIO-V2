/**
 * Vista "Tutti gli utenti" (F8 + F11 — REQ-001).
 *
 * F8: legge admin_users con join su organizations, ricerca per email, sola lettura.
 * F11: collega le azioni Edge create/update/delete (useAdminUserMutations).
 *
 * GESTIONE RLS NON ATTIVA (PLAN-DB-005):
 *   Se la policy SELECT su admin_users non è ancora attiva, la query torna 0 righe.
 *   Mostriamo un messaggio chiaro senza crash.
 *
 * GESTIONE FUNCTION NON DEPLOYATA:
 *   Se VITE_CONSOLE_ADMIN_FUNCTION_URL non è impostata o la Edge Function non è
 *   ancora deployata, callConsoleAdmin restituisce un errore esplicito. I modali
 *   mostrano quel messaggio senza crash — stesso pattern di RestaurantSettingsPanel.
 *
 * DEC-037: le azioni valgono su TUTTE le aziende del progetto TEST (non solo sandbox).
 * DEC-038: eliminazione richiede riscrittura email esatta + avviso irreversibilità.
 * DEC-041: creazione con email + password impostati da Matteo.
 *
 * PERCHÉ UN FETCH SEPARATO PER LE ORGANIZATIONS (dropdown):
 *   Il dropdown crea/modifica ha bisogno della lista completa di organizations.
 *   La carichiamo una volta sola all'apertura del modale (non al mount del componente
 *   principale) per non appesantire il rendering iniziale.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'
import {
  normalizeEdition,
  editionLabel,
  editionBadgeColors,
  type Edition,
} from '@console/lib/editionUtils'
import { useAdminUserMutations } from '@console/hooks/useAdminUserMutations'
import { CreateUserModal, type OrgOption } from '@console/components/CreateUserModal'
import { EditUserModal, type EditUserTarget } from '@console/components/EditUserModal'
import { DeleteUserModal, type DeleteUserTarget } from '@console/components/DeleteUserModal'

// ---------------------------------------------------------------------------
// Tipi locali
// ---------------------------------------------------------------------------

interface AdminUser {
  id: string
  email: string
  name: string | null
  tenant_id: string
  organization: {
    name: string
    slug: string
    edition: Edition
    is_active: boolean
  } | null
}

// Riga grezza dal DB: organization può essere null se il tenant_id non corrisponde.
interface AdminUserRow {
  id: string
  email: string
  name: string | null
  tenant_id: string
  organizations: {
    name: string
    slug: string
    edition: string | null
    is_active: boolean
  } | null
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: AdminUser[] }

// Modale attivo: null = nessuno aperto.
type ActiveModal =
  | { type: 'create' }
  | { type: 'edit'; user: EditUserTarget }
  | { type: 'delete'; user: DeleteUserTarget }

// ---------------------------------------------------------------------------
// Componente principale
// ---------------------------------------------------------------------------

interface UserListProps {
  /** Callback per aprire la scheda di un tenant (F9). */
  onOpenTenantDetail: (tenantId: string) => void
}

export function UserList({ onOpenTenantDetail }: UserListProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [search, setSearch] = useState('')
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null)
  const [organizations, setOrganizations] = useState<OrgOption[]>([])
  const mountedRef = useRef(true)

  // Mutazioni CRUD: un unico hook per le 3 azioni (create/update/delete).
  const mutations = useAdminUserMutations()

  // -------------------------------------------------------------------------
  // Fetch utenti
  // -------------------------------------------------------------------------

  const fetchUsers = useCallback(async () => {
    setState({ status: 'loading' })

    const { data, error } = await supabase
      .from('admin_users')
      // join lato server: PostgREST restituisce organizations come oggetto annidato.
      .select('id, email, name, tenant_id, organizations(name, slug, edition, is_active)')
      .order('email')

    if (!mountedRef.current) return

    if (error) {
      setState({ status: 'error', message: error.message })
      return
    }

    const rows: AdminUser[] = (data as unknown as AdminUserRow[]).map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      tenant_id: row.tenant_id,
      organization: row.organizations
        ? {
            name: row.organizations.name,
            slug: row.organizations.slug,
            edition: normalizeEdition(row.organizations.edition),
            is_active: row.organizations.is_active,
          }
        : null,
    }))

    setState({ status: 'ok', data: rows })
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchUsers()
    return () => {
      mountedRef.current = false
    }
  }, [fetchUsers])

  // -------------------------------------------------------------------------
  // Fetch organizations (per il dropdown create/edit)
  // Caricato una volta sola quando si apre un modale che ne ha bisogno.
  // -------------------------------------------------------------------------

  const fetchOrganizations = useCallback(async () => {
    // Se già caricato, non ri-fetchiamo.
    if (organizations.length > 0) return
    const { data } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .order('name')
    if (data) {
      setOrganizations(data as OrgOption[])
    }
  }, [organizations.length])

  // -------------------------------------------------------------------------
  // Gestione apertura modali
  // -------------------------------------------------------------------------

  const openCreate = useCallback(async () => {
    await fetchOrganizations()
    mutations.resetCreate()
    setActiveModal({ type: 'create' })
  }, [fetchOrganizations, mutations])

  const openEdit = useCallback(async (user: AdminUser) => {
    await fetchOrganizations()
    mutations.resetUpdate()
    setActiveModal({
      type: 'edit',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenant_id: user.tenant_id,
      },
    })
  }, [fetchOrganizations, mutations])

  const openDelete = useCallback((user: AdminUser) => {
    mutations.resetDelete()
    setActiveModal({
      type: 'delete',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  }, [mutations])

  const closeModal = useCallback(() => {
    setActiveModal(null)
  }, [])

  // Dopo una mutazione riuscita: chiude il modale e rifetch la lista.
  const handleMutationSuccess = useCallback(() => {
    setActiveModal(null)
    fetchUsers()
  }, [fetchUsers])

  // -------------------------------------------------------------------------
  // Filtro lato client
  // -------------------------------------------------------------------------

  const filtered =
    state.status === 'ok'
      ? state.data.filter((u) =>
          u.email.toLowerCase().includes(search.toLowerCase()),
        )
      : []

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <section>
      {/* Barra superiore: titolo + ricerca + pulsante "Nuovo utente" */}
      <div style={styles.topBar}>
        <h2 style={styles.sectionTitle}>Utenti admin</h2>
        <input
          type="search"
          placeholder="Cerca per email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
          aria-label="Cerca utente per email"
        />
        <button
          onClick={() => void openCreate()}
          style={styles.newUserBtn}
          title="Crea un nuovo utente admin"
        >
          + Nuovo utente
        </button>
      </div>

      {state.status === 'loading' && (
        <p style={styles.statusText}>Caricamento in corso…</p>
      )}

      {state.status === 'error' && (
        <div style={styles.errorBox}>
          <strong>Errore nel caricamento utenti</strong>
          <br />
          {state.message}
        </div>
      )}

      {state.status === 'ok' && state.data.length === 0 && (
        // Questo caso si verifica se PLAN-DB-005 non è stato ancora eseguito su TEST:
        // la policy SELECT su admin_users non esiste e il client autenticato vede 0 righe.
        <div style={styles.warningBox}>
          <strong>Nessun utente visibile</strong>
          <br />
          La policy di lettura su <code style={styles.code}>admin_users</code> per la Console
          potrebbe non essere ancora attiva.
          <br />
          Verifica che <strong>PLAN-DB-005</strong> sia stato eseguito su TEST (
          <code style={styles.code}>docnnernvp</code>) da Matteo.
        </div>
      )}

      {state.status === 'ok' && state.data.length > 0 && filtered.length === 0 && (
        <p style={styles.statusText}>Nessun utente corrisponde alla ricerca.</p>
      )}

      {state.status === 'ok' && filtered.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Azienda</th>
                <th style={styles.th}>Edition</th>
                <th style={styles.th}>Stato</th>
                <th style={styles.th}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onOpenTenantDetail={onOpenTenantDetail}
                  onEdit={() => void openEdit(user)}
                  onDelete={() => openDelete(user)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modali CRUD — montati solo quando attivi */}
      {activeModal?.type === 'create' && (
        <CreateUserModal
          organizations={organizations}
          mutations={mutations}
          onSuccess={handleMutationSuccess}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === 'edit' && (
        <EditUserModal
          user={activeModal.user}
          organizations={organizations}
          mutations={mutations}
          onSuccess={handleMutationSuccess}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === 'delete' && (
        <DeleteUserModal
          user={activeModal.user}
          mutations={mutations}
          onSuccess={handleMutationSuccess}
          onClose={closeModal}
        />
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Riga singola
// ---------------------------------------------------------------------------

interface UserRowProps {
  user: AdminUser
  onOpenTenantDetail: (tenantId: string) => void
  onEdit: () => void
  onDelete: () => void
}

function UserRow({ user, onOpenTenantDetail, onEdit, onDelete }: UserRowProps) {
  const org = user.organization
  const edition = org?.edition ?? 'classic'
  const badge = editionBadgeColors(edition)

  return (
    <tr style={styles.tr}>
      {/* Email */}
      <td style={styles.td}>
        <span style={styles.email}>{user.email}</span>
      </td>

      {/* Nome */}
      <td style={styles.td}>
        <span style={styles.nameCell}>{user.name ?? '—'}</span>
      </td>

      {/* Azienda (nome + slug) */}
      <td style={styles.td}>
        {org ? (
          <div>
            <span style={styles.orgName}>{org.name}</span>
            <br />
            <span style={styles.orgSlug}>/{org.slug}</span>
          </div>
        ) : (
          <span style={styles.noData}>—</span>
        )}
      </td>

      {/* Edition badge */}
      <td style={styles.td}>
        {org ? (
          <span
            style={{
              ...styles.editionBadge,
              background: badge.bg,
              color: badge.text,
            }}
          >
            {editionLabel(edition)}
          </span>
        ) : (
          <span style={styles.noData}>—</span>
        )}
      </td>

      {/* Stato attivo dell'azienda */}
      <td style={styles.td}>
        {org ? (
          <span style={org.is_active ? styles.activePill : styles.inactivePill}>
            {org.is_active ? 'Attivo' : 'Sospeso'}
          </span>
        ) : (
          <span style={styles.noData}>—</span>
        )}
      </td>

      {/* Azioni: "Apri scheda" (F9 abilitato), "Modifica" e "Elimina" (F11 cablati) */}
      <td style={styles.td}>
        <div style={styles.actionsRow}>
          {/* "Apri scheda" è abilitato se l'utente ha un tenant associato. */}
          <button
            onClick={() => onOpenTenantDetail(user.tenant_id)}
            disabled={!user.tenant_id}
            title={user.tenant_id ? `Apri scheda per tenant ${user.tenant_id}` : 'Nessun tenant associato'}
            style={user.tenant_id ? styles.actionBtnActive : styles.actionBtnDisabled}
          >
            Apri scheda
          </button>

          {/* Modifica: apre il modale edit (F11) */}
          <button
            onClick={onEdit}
            title="Modifica utente"
            style={styles.actionBtnActive}
          >
            Modifica
          </button>

          {/* Elimina: apre il modale delete con conferma email (DEC-038, F11) */}
          <button
            onClick={onDelete}
            title="Elimina utente (richiede conferma)"
            style={{ ...styles.actionBtnActive, ...styles.actionBtnDangerActive }}
          >
            Elimina
          </button>
        </div>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — nessuna dipendenza da file CSS dell'app di Matteo.
// Palette e convenzioni coerenti con RestaurantList.tsx.
// ---------------------------------------------------------------------------

const styles = {
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

  newUserBtn: {
    background: '#1e3a5f',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    color: '#93c5fd',
    fontSize: '0.8rem',
    fontWeight: 700,
    padding: '0.35rem 0.75rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap' as const,
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

  // Warning distinto dall'errore: non è un errore tecnico, è una situazione attesa
  // finché PLAN-DB-005 non è stato eseguito da Matteo.
  warningBox: {
    background: '#1c1400',
    border: '1px solid #713f12',
    borderRadius: '8px',
    padding: '1rem',
    color: '#fde68a',
    fontSize: '0.875rem',
    lineHeight: 1.7,
  } as React.CSSProperties,

  code: {
    fontFamily: 'monospace',
    fontSize: '0.8em',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '3px',
    padding: '0 0.25em',
  } as React.CSSProperties,

  // Wrapper con overflow-x per scorrimento orizzontale su mobile (~375px).
  tableWrapper: {
    overflowX: 'auto' as const,
    borderRadius: '10px',
    border: '1px solid #334155',
  } as React.CSSProperties,

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.8125rem',
    minWidth: '600px', // scorrimento orizzontale su schermi stretti
  } as React.CSSProperties,

  th: {
    background: '#1e293b',
    color: '#94a3b8',
    fontWeight: 600,
    textAlign: 'left' as const,
    padding: '0.6rem 0.75rem',
    borderBottom: '1px solid #334155',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  tr: {
    borderBottom: '1px solid #1e293b',
  } as React.CSSProperties,

  td: {
    padding: '0.6rem 0.75rem',
    verticalAlign: 'top' as const,
    color: '#e2e8f0',
  } as React.CSSProperties,

  email: {
    fontFamily: 'monospace',
    fontSize: '0.8em',
    color: '#93c5fd',
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,

  nameCell: {
    color: '#f1f5f9',
  } as React.CSSProperties,

  orgName: {
    color: '#f1f5f9',
    fontWeight: 500,
  } as React.CSSProperties,

  orgSlug: {
    fontFamily: 'monospace',
    fontSize: '0.75em',
    color: '#64748b',
  } as React.CSSProperties,

  noData: {
    color: '#475569',
  } as React.CSSProperties,

  editionBadge: {
    display: 'inline-block',
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  activePill: {
    display: 'inline-block',
    background: '#14532d',
    color: '#86efac',
    fontSize: '0.68rem',
    fontWeight: 600,
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  inactivePill: {
    display: 'inline-block',
    background: '#1c1917',
    color: '#a8a29e',
    fontSize: '0.68rem',
    fontWeight: 600,
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  actionsRow: {
    display: 'flex',
    gap: '0.35rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  // Pulsante azione attivo (abilitato).
  actionBtnActive: {
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '5px',
    color: '#93c5fd',
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    fontFamily: 'inherit',
  } as React.CSSProperties,

  actionBtnDisabled: {
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '5px',
    color: '#475569',
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    cursor: 'not-allowed',
    opacity: 0.5,
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  // Variante danger attiva per "Elimina" — tono rosso, cursore pointer (F11).
  actionBtnDangerActive: {
    borderColor: '#7f1d1d',
    color: '#f87171',
  } as React.CSSProperties,
} as const
