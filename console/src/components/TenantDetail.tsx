/**
 * Scheda azienda per un singolo tenant (F9 — REQ-002, tappa 1).
 *
 * NAVIGAZIONE (DEC-045 coerente):
 *   Usa lo stesso switch-di-stato di AppShell. La scheda riceve il tenantId via prop
 *   e un callback onBack per tornare alla vista precedente. Niente react-router.
 *
 * PANNELLI RIUSATI:
 *   EditionSelector, FeatureFlagsPanel, RestaurantSettingsPanel — gli stessi montati in
 *   RestaurantList per ogni OrgCard, ora racccolti qui per un solo tenant.
 *
 * GATE SANDBOX (RULE-2 / DEC-037):
 *   isSandboxTenant NON viene toccato in F9. I pannelli mostrano "sola lettura" per i
 *   tenant non-sandbox esattamente come in RestaurantList. Il gate sarà sbloccato in F10.
 *   Una nota visibile spiega questo limite in fondo alla scheda.
 *
 * MAPPA DI COPERTURA INTERVISTA:
 *   Sezione 0 (anagrafica/versione) e Sez.2 (funzioni) e Sez.4 parziale (5 chiavi settings)
 *   sono già gestite dai pannelli esistenti → stato dinamico ✅/⬜.
 *   Sezioni 1/3/5/6/7/8 non hanno ancora editor nella Console → 🔒 con nota FU-CONSOLE-9.
 *   Lo stato ✅/⬜ per Sez.0 viene calcolato dai campi base di organizations.
 *
 * FETCH organizations:
 *   Fetch diretto per id (select singola riga). I campi base (name, slug, plan,
 *   max_bookings_per_year, max_booking_requests_per_year, is_active, edition)
 *   vengono mostrati in sola lettura — la modifica è nei pannelli dedicati.
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
import { EditionSelector } from './EditionSelector'
import { FeatureFlagsPanel } from './FeatureFlagsPanel'
import { RestaurantSettingsPanel } from './RestaurantSettingsPanel'

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

interface OrgDetail {
  id: string
  name: string
  slug: string
  edition: Edition
  is_active: boolean
  plan: string | null
  max_bookings_per_year: number | null
  max_booking_requests_per_year: number | null
}

interface OrgDetailRow {
  id: string
  name: string
  slug: string
  edition: string | null
  is_active: boolean
  plan: string | null
  max_bookings_per_year: number | null
  max_booking_requests_per_year: number | null
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; org: OrgDetail }

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TenantDetailProps {
  /** ID del tenant da mostrare. */
  tenantId: string
  /** Callback per tornare alla vista precedente (breadcrumb "← Torna"). */
  onBack: () => void
}

// ---------------------------------------------------------------------------
// Componente principale
// ---------------------------------------------------------------------------

export function TenantDetail({ tenantId, onBack }: TenantDetailProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  // refetchCounter: incrementato dopo un cambio edition per aggiornare i campi base.
  const [refetchCounter, setRefetchCounter] = useState(0)
  const mountedRef = useRef(true)

  const fetchOrg = useCallback(async () => {
    setState({ status: 'loading' })

    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, slug, edition, is_active, plan, max_bookings_per_year, max_booking_requests_per_year')
      .eq('id', tenantId)
      .single()

    if (!mountedRef.current) return

    if (error) {
      setState({ status: 'error', message: error.message })
      return
    }

    const row = data as OrgDetailRow
    setState({
      status: 'ok',
      org: {
        id: row.id,
        name: row.name,
        slug: row.slug,
        edition: normalizeEdition(row.edition),
        is_active: row.is_active,
        plan: row.plan,
        max_bookings_per_year: row.max_bookings_per_year,
        max_booking_requests_per_year: row.max_booking_requests_per_year,
      },
    })
  }, [tenantId])

  // Dipende da fetchOrg (stabile su tenantId) e da refetchCounter (forza il re-fetch
  // dopo un cambio edition). Includere fetchOrg rende il componente corretto anche se
  // in futuro tenantId cambiasse senza smontaggio del componente.
  useEffect(() => {
    mountedRef.current = true
    void fetchOrg()
    return () => {
      mountedRef.current = false
    }
  }, [fetchOrg, refetchCounter])

  // Callback per EditionSelector: rilegge i campi base dopo cambio edition.
  const handleEditionSuccess = useCallback(() => {
    setRefetchCounter((c) => c + 1)
  }, [])

  return (
    <div style={styles.page}>
      {/* Breadcrumb / torna indietro */}
      <div style={styles.breadcrumb}>
        <button onClick={onBack} style={styles.backBtn} aria-label="Torna alla vista precedente">
          ← Torna
        </button>
        <span style={styles.breadcrumbSep}>/</span>
        <span style={styles.breadcrumbCurrent}>
          {state.status === 'ok' ? state.org.name : 'Scheda azienda'}
        </span>
      </div>

      {/* Loading */}
      {state.status === 'loading' && (
        <p style={styles.statusText}>Caricamento in corso…</p>
      )}

      {/* Errore fetch */}
      {state.status === 'error' && (
        <div style={styles.errorBox}>
          <strong>Errore nel caricamento</strong>
          <br />
          {state.message}
        </div>
      )}

      {/* Contenuto scheda */}
      {state.status === 'ok' && (
        <div style={styles.content}>
          {/* ── Header scheda ── */}
          <OrgHeader org={state.org} />

          {/* ── Campi base organizations (sola lettura) ── */}
          <Section title="Dati base (organizations)">
            <OrgFieldsGrid org={state.org} />
          </Section>

          {/* ── Pannello Edition ── */}
          <Section title="Versione venduta">
            {isSandboxTenant(tenantId) ? (
              <EditionSelector
                tenantId={tenantId}
                currentEdition={state.org.edition}
                onSuccess={handleEditionSuccess}
              />
            ) : (
              <ReadOnlyEditionBlock edition={state.org.edition} />
            )}
          </Section>

          {/* ── Pannello Feature Flags ── */}
          <Section title="Feature flags (funzioni accese)">
            <FeatureFlagsPanel tenantId={tenantId} edition={state.org.edition} />
          </Section>

          {/* ── Pannello Impostazioni ristorante ── */}
          <Section title="Impostazioni ristorante">
            <RestaurantSettingsPanel tenantId={tenantId} />
          </Section>

          {/* ── Mappa di copertura intervista ── */}
          <Section title="Copertura intervista nuovo cliente">
            <InterviewCoverageMap org={state.org} />
          </Section>

          {/* ── Nota gate sandbox ── */}
          <SandboxGateNote isSandbox={isSandboxTenant(tenantId)} />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header scheda
// ---------------------------------------------------------------------------

interface OrgHeaderProps {
  org: OrgDetail
}

function OrgHeader({ org }: OrgHeaderProps) {
  const badge = editionBadgeColors(org.edition)
  return (
    <div style={styles.orgHeader}>
      <div style={styles.orgHeaderMain}>
        <h1 style={styles.orgTitle}>{org.name}</h1>
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
      <span style={styles.orgSlug}>/{org.slug}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Griglia campi base
// ---------------------------------------------------------------------------

interface OrgFieldsGridProps {
  org: OrgDetail
}

function OrgFieldsGrid({ org }: OrgFieldsGridProps) {
  return (
    <div style={styles.fieldsGrid}>
      <FieldRow label="ID" value={org.id} mono />
      <FieldRow label="Slug" value={`/${org.slug}`} mono />
      <FieldRow label="Piano commerciale" value={org.plan ?? '—'} />
      <FieldRow
        label="Max prenotazioni/anno"
        value={org.max_bookings_per_year != null ? String(org.max_bookings_per_year) : '—'}
      />
      <FieldRow
        label="Max richieste prenotazione/anno"
        value={org.max_booking_requests_per_year != null ? String(org.max_booking_requests_per_year) : '—'}
      />
    </div>
  )
}

interface FieldRowProps {
  label: string
  value: string
  mono?: boolean
}

function FieldRow({ label, value, mono }: FieldRowProps) {
  return (
    <div style={styles.fieldRow}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={{ ...styles.fieldValue, ...(mono ? styles.fieldValueMono : {}) }}>{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Edition read-only (per tenant non-sandbox)
// ---------------------------------------------------------------------------

function ReadOnlyEditionBlock({ edition }: { edition: Edition }) {
  const badge = editionBadgeColors(edition)
  return (
    <div style={styles.readOnlyEdition}>
      <span style={styles.readOnlyEditionLabel}>Edition corrente:</span>
      <span
        style={{
          ...styles.editionBadge,
          background: badge.bg,
          color: badge.text,
        }}
      >
        {editionLabel(edition)}
      </span>
      <span style={styles.readOnlyHintInline}>(sola lettura — modificabile solo sui sandbox)</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sezione con titolo
// ---------------------------------------------------------------------------

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mappa di copertura intervista
// ---------------------------------------------------------------------------

interface InterviewCoverageMapProps {
  org: OrgDetail
}

function InterviewCoverageMap({ org }: InterviewCoverageMapProps) {
  // Sez.0: anagrafica/versione
  // Consideriamo "configurato" se name, slug e edition sono presenti.
  const sez0ok = Boolean(org.name && org.slug && org.edition)

  const rows: Array<{
    sez: string
    title: string
    status: '✅' | '⬜' | '🔒'
    note: string
  }> = [
    {
      sez: 'Sez.0',
      title: 'Anagrafica e versione venduta',
      status: sez0ok ? '✅' : '⬜',
      note: sez0ok
        ? 'name, slug, edition, is_active, plan, max_* presenti'
        : 'Alcuni campi base mancanti (name/slug/edition)',
    },
    {
      sez: 'Sez.1',
      title: 'Dati del locale e contatti',
      status: '🔒',
      note: 'Editor contatti in arrivo (FU-CONSOLE-9) — campi: contact_email, contact_phone, contact_address, timezone',
    },
    {
      sez: 'Sez.2',
      title: 'Funzioni accese (feature / add-on)',
      status: '✅',
      note: 'Gestita dal pannello Feature flags — toggle on/off per tenant sandbox',
    },
    {
      sez: 'Sez.3',
      title: 'Orari di apertura e fasce di servizio',
      status: '🔒',
      note: 'Editor business_hours/service_slots in arrivo (FU-CONSOLE-9)',
    },
    {
      sez: 'Sez.4',
      title: 'Regole di prenotazione (numeri tecnici)',
      // Parzialmente supportata: 5 chiavi esposte nel pannello impostazioni.
      status: '✅',
      note: 'Parziale: 5 chiavi esposte (booking_window_days, walk_in_max_guests, slot_limit_enabled, booking_reject_out_of_slot, booking_time_slots_enabled). Editor avanzati (business_hours, slot_guest_capacities) in arrivo (FU-CONSOLE-9)',
    },
    {
      sez: 'Sez.5',
      title: 'Sala e tavoli (solo Pro)',
      status: '🔒',
      note: 'Editor sale/tavoli in arrivo (FU-CONSOLE-9) — tabelle rooms/tables',
    },
    {
      sez: 'Sez.6',
      title: 'Menu, card ed esperienze / Menu QR',
      status: '🔒',
      note: 'Editor menu/card in arrivo (FU-CONSOLE-9) — menu_categories, menu_items, booking_menu_promos',
    },
    {
      sez: 'Sez.7',
      title: 'Aspetto pagina pubblica «Prenota»',
      status: '🔒',
      note: 'Editor aspetto in arrivo (FU-CONSOLE-9) — public_booking_page_background, booking_public_form_config, app_theme',
    },
    {
      sez: 'Sez.8',
      title: 'Accessi / utenti admin',
      status: '🔒',
      note: 'Gestione utenti in arrivo con il write-block (F11) — admin_users / Supabase Auth',
    },
  ]

  return (
    <div style={styles.coverageTable}>
      {rows.map((row) => (
        <CoverageRow key={row.sez} {...row} />
      ))}
    </div>
  )
}

interface CoverageRowProps {
  sez: string
  title: string
  status: '✅' | '⬜' | '🔒'
  note: string
}

function CoverageRow({ sez, title, status, note }: CoverageRowProps) {
  const rowBg =
    status === '✅' ? '#0a1f0f' :
    status === '🔒' ? '#131216' :
    '#1a1500'

  const rowBorder =
    status === '✅' ? '#166534' :
    status === '🔒' ? '#374151' :
    '#854d0e'

  const statusColor =
    status === '✅' ? '#86efac' :
    status === '🔒' ? '#6b7280' :
    '#fcd34d'

  return (
    <div
      style={{
        ...styles.coverageRow,
        background: rowBg,
        borderColor: rowBorder,
      }}
    >
      <span style={styles.coverageSez}>{sez}</span>
      <span style={styles.coverageTitle}>{title}</span>
      <span style={{ ...styles.coverageStatus, color: statusColor }}>{status}</span>
      <span style={styles.coverageNote}>{note}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Nota gate sandbox
// ---------------------------------------------------------------------------

function SandboxGateNote({ isSandbox }: { isSandbox: boolean }) {
  if (isSandbox) {
    return (
      <div style={styles.sandboxNote}>
        <strong>Tenant sandbox:</strong> scritture edition / feature / impostazioni abilitate.
      </div>
    )
  }
  return (
    <div style={styles.gateNote}>
      <strong>Scritture disabilitate su questo tenant.</strong>
      <br />
      I pannelli edition, feature flag e impostazioni sono in sola lettura perché questo tenant
      non è un sandbox. La scrittura su tutte le aziende arriva con il{' '}
      <strong>write-block (F10/DEC-037)</strong>: gate allowlist + Edge service-role.
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — nessuna dipendenza da file CSS dell'app di Matteo.
// Palette coerente con RestaurantList/UserList/AppShell.
// ---------------------------------------------------------------------------

const styles = {
  page: {
    maxWidth: '860px',
    margin: '0 auto',
  } as React.CSSProperties,

  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  backBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#93c5fd',
    fontSize: '0.8rem',
    padding: '0.3rem 0.65rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  } as React.CSSProperties,

  breadcrumbSep: {
    color: '#334155',
    fontSize: '0.875rem',
  } as React.CSSProperties,

  breadcrumbCurrent: {
    color: '#f1f5f9',
    fontSize: '0.875rem',
    fontWeight: 500,
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

  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  } as React.CSSProperties,

  // ── Header scheda ──
  orgHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
  } as React.CSSProperties,

  orgHeaderMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  orgTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#f1f5f9',
    flex: '1 1 auto',
  } as React.CSSProperties,

  editionBadge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    flexShrink: 0,
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

  orgSlug: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: '#64748b',
  } as React.CSSProperties,

  // ── Campi base ──
  fieldsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  } as React.CSSProperties,

  fieldRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'baseline',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  fieldLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    minWidth: '220px',
    flexShrink: 0,
  } as React.CSSProperties,

  fieldValue: {
    fontSize: '0.8125rem',
    color: '#e2e8f0',
  } as React.CSSProperties,

  fieldValueMono: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: '#94a3b8',
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,

  // ── Edition read-only ──
  readOnlyEdition: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  readOnlyEditionLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
  } as React.CSSProperties,

  readOnlyHintInline: {
    fontSize: '0.7rem',
    color: '#374151',
    fontStyle: 'italic',
  } as React.CSSProperties,

  // ── Section ──
  section: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
  } as React.CSSProperties,

  sectionTitle: {
    margin: '0 0 0.75rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    borderBottom: '1px solid #334155',
    paddingBottom: '0.5rem',
  } as React.CSSProperties,

  sectionBody: {} as React.CSSProperties,

  // ── Mappa copertura intervista ──
  coverageTable: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  } as React.CSSProperties,

  coverageRow: {
    display: 'grid',
    gridTemplateColumns: '52px 1fr 28px',
    gridTemplateRows: 'auto auto',
    gap: '0.1rem 0.6rem',
    alignItems: 'start',
    border: '1px solid',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
  } as React.CSSProperties,

  coverageSez: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#475569',
    fontFamily: 'monospace',
    letterSpacing: '0.03em',
    gridColumn: '1',
    gridRow: '1',
    paddingTop: '0.1rem',
  } as React.CSSProperties,

  coverageTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#cbd5e1',
    gridColumn: '2',
    gridRow: '1',
  } as React.CSSProperties,

  coverageStatus: {
    fontSize: '1rem',
    gridColumn: '3',
    gridRow: '1',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  coverageNote: {
    fontSize: '0.7rem',
    color: '#64748b',
    lineHeight: 1.5,
    gridColumn: '1 / -1',
    gridRow: '2',
  } as React.CSSProperties,

  // ── Note gate sandbox ──
  sandboxNote: {
    background: '#0a1f0f',
    border: '1px solid #166534',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#86efac',
    fontSize: '0.8rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  gateNote: {
    background: '#1a1325',
    border: '1px solid #4c1d95',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#c4b5fd',
    fontSize: '0.8rem',
    lineHeight: 1.6,
  } as React.CSSProperties,
} as const
