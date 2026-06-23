/**
 * Modale "Crea azienda" (F12 — REQ-003).
 *
 * COSA FA:
 *   Form con: nome, slug (proposto automaticamente dal nome — lowercase, spazi→trattini,
 *   senza caratteri speciali — modificabile), edition (classic/pro/enterprise), e
 *   sezione opzionale admin (email + password) per creare l'utente admin contestualmente
 *   (DEC-041). Chiama create_tenant via useTenantMutations. Dopo successo notifica il
 *   genitore (refetch lista ristoranti).
 *
 * SLUG AUTO:
 *   Generato dal nome in tempo reale (toLowerCase, spazi→trattini, solo [a-z0-9-]).
 *   Modificabile manualmente. Validazione client: non vuoto + formato corretto.
 *   L'unicità è validata lato server (risponde 409 con messaggio chiaro).
 *
 * SEZIONE ADMIN OPZIONALE (DEC-041):
 *   Toggle "Aggiungi admin" che mostra email + password. Se non compilato, non viene
 *   passato al server. Se compilato, il server crea auth user + riga admin_users in
 *   un unico passaggio.
 *
 * GESTIONE FUNCTION NON DEPLOYATA:
 *   Se callConsoleAdmin ritorna errore (URL non configurata o Edge non deployata),
 *   il messaggio è mostrato inline senza crash — stesso pattern di RestaurantSettingsPanel.
 *
 * STILE:
 *   Palette coerente con CreateUserModal/DeleteUserModal/UserList.
 *   Inline styles, nessuna dipendenza da ../src.
 */

import { useState, useCallback, useEffect } from 'react'
import type { UseTenantMutationsReturn } from '@console/hooks/useTenantMutations'

// ---------------------------------------------------------------------------
// Helper: genera uno slug dal nome
// ---------------------------------------------------------------------------

/**
 * Genera uno slug dal nome:
 * - Tutto lowercase
 * - Spazi e trattini multipli → singolo trattino
 * - Rimuove tutto ciò che non è [a-z0-9-]
 * - Rimuove trattini iniziali/finali
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')          // spazi/underscore → trattino
    .replace(/[^a-z0-9-]/g, '')       // rimuove caratteri non consentiti
    .replace(/-{2,}/g, '-')           // trattini multipli → singolo
    .replace(/^-+|-+$/g, '')          // rimuove trattini iniziali/finali
}

/** Valida il formato dello slug: solo [a-z0-9-], non vuoto, non inizia/finisce con trattino. */
function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug) || /^[a-z0-9]$/.test(slug)
}

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

interface CreateTenantModalProps {
  mutations: UseTenantMutationsReturn
  onSuccess: () => void
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function CreateTenantModal({
  mutations,
  onSuccess,
  onClose,
}: CreateTenantModalProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [edition, setEdition] = useState<'classic' | 'pro' | 'enterprise'>('classic')
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminName, setAdminName] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const { state, createTenant, resetCreate } = mutations
  const createState = state.create
  const isLoading = createState.status === 'loading'

  // Aggiorna lo slug automaticamente dal nome (solo se non è stato modificato manualmente).
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(generateSlug(name))
    }
  }, [name, slugManuallyEdited])

  // Dopo successo: notifica genitore e chiudi.
  useEffect(() => {
    if (createState.status === 'success') {
      onSuccess()
      onClose()
      resetCreate()
    }
  }, [createState.status, onSuccess, onClose, resetCreate])

  // Chiudi con Escape.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isLoading, onClose])

  const handleSlugChange = useCallback((value: string) => {
    setSlug(value)
    setSlugManuallyEdited(true)
  }, [])

  const validate = useCallback((): string | null => {
    if (!name.trim()) return 'Nome azienda obbligatorio.'
    if (!slug.trim()) return 'Slug obbligatorio.'
    if (!isValidSlugFormat(slug.trim())) {
      return 'Slug non valido: solo lettere minuscole, numeri e trattini (es. "ristorante-da-mario").'
    }
    if (showAdmin) {
      if (!adminEmail.trim()) return 'Email admin obbligatoria se la sezione admin è attiva.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail.trim()))
        return 'Formato email admin non valido.'
      if (adminPassword.length < 8)
        return 'La password admin deve avere almeno 8 caratteri.'
    }
    return null
  }, [name, slug, showAdmin, adminEmail, adminPassword])

  const handleSubmit = useCallback(async () => {
    const err = validate()
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)
    await createTenant({
      name: name.trim(),
      slug: slug.trim(),
      edition,
      admin: showAdmin
        ? {
            email: adminEmail.trim(),
            password: adminPassword,
            name: adminName.trim() || undefined,
          }
        : undefined,
    })
  }, [validate, createTenant, name, slug, edition, showAdmin, adminEmail, adminPassword, adminName])

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="create-tenant-title">
      <div style={modalStyle}>
        {/* Intestazione */}
        <div style={modalStyles.header}>
          <h3 id="create-tenant-title" style={modalStyles.title}>Nuova azienda</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={modalStyles.closeBtn}
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div style={modalStyles.body}>

          {/* ── Sezione azienda ── */}
          <p style={modalStyles.sectionLabel}>Dati azienda</p>

          {/* Nome */}
          <label style={modalStyles.label} htmlFor="ct-name">Nome *</label>
          <input
            id="ct-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            placeholder="Ristorante da Mario"
            style={modalStyles.input}
            autoComplete="off"
            autoFocus
          />

          {/* Slug */}
          <label style={modalStyles.label} htmlFor="ct-slug">
            Slug * (identificatore unico nel DB)
          </label>
          <div style={modalStyles.slugRow}>
            <span style={modalStyles.slugPrefix}>/</span>
            <input
              id="ct-slug"
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              disabled={isLoading}
              placeholder="ristorante-da-mario"
              style={{ ...modalStyles.input, flex: 1 }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {slug.length > 0 && !isValidSlugFormat(slug) && (
            <p style={modalStyles.slugHintError}>
              Solo minuscole, numeri e trattini. Senza spazi o caratteri speciali.
            </p>
          )}
          {slug.length > 0 && isValidSlugFormat(slug) && (
            <p style={modalStyles.slugHintOk}>Formato slug valido (l'unicità è verificata dal server).</p>
          )}

          {/* Edition */}
          <label style={modalStyles.label} htmlFor="ct-edition">Edition *</label>
          <select
            id="ct-edition"
            value={edition}
            onChange={(e) => setEdition(e.target.value as 'classic' | 'pro' | 'enterprise')}
            disabled={isLoading}
            style={modalStyles.select}
          >
            <option value="classic">Classic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          {/* ── Sezione admin opzionale (DEC-041) ── */}
          <div style={modalStyles.adminToggleRow}>
            <label style={modalStyles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showAdmin}
                onChange={(e) => setShowAdmin(e.target.checked)}
                disabled={isLoading}
                style={modalStyles.checkbox}
              />
              Aggiungi utente admin (opzionale)
            </label>
            <span style={modalStyles.adminToggleHint}>
              Se attivo, crea l'accesso admin contestualmente (DEC-041).
            </span>
          </div>

          {showAdmin && (
            <div style={modalStyles.adminSection}>
              <p style={modalStyles.sectionLabel}>Credenziali admin</p>

              <label style={modalStyles.label} htmlFor="ct-admin-email">Email admin *</label>
              <input
                id="ct-admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@ristorante.it"
                style={modalStyles.input}
                autoComplete="off"
              />

              <label style={modalStyles.label} htmlFor="ct-admin-password">
                Password admin * (min 8 caratteri)
              </label>
              <input
                id="ct-admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                style={modalStyles.input}
                autoComplete="new-password"
              />

              <label style={modalStyles.label} htmlFor="ct-admin-name">Nome admin (opzionale)</label>
              <input
                id="ct-admin-name"
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                disabled={isLoading}
                placeholder="Mario Rossi"
                style={modalStyles.input}
              />
            </div>
          )}

          {/* Errore di validazione client */}
          {validationError && (
            <div style={modalStyles.validationError}>{validationError}</div>
          )}

          {/* Errore dal server (409 slug duplicato, email admin già usata, ecc.) */}
          {createState.status === 'error' && (
            <div style={modalStyles.serverError}>
              <strong>Errore:</strong> {createState.message}
              {createState.message.includes('slug') && (
                <span style={modalStyles.serverErrorHint}>
                  {' '}Prova a cambiare lo slug.
                </span>
              )}
              {/* In creazione l'altro 409 tipico è l'email admin già registrata in Auth. */}
              {createState.message.toLowerCase().includes('già') && (
                <span style={modalStyles.serverErrorHint}>
                  {' '}Usa un'altra email per l'admin (questa è già registrata).
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer pulsanti */}
        <div style={modalStyles.footer}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={modalStyles.cancelBtn}
          >
            Annulla
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={isLoading}
            style={{
              ...modalStyles.confirmBtn,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creazione…' : 'Crea azienda'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — palette coerente con CreateUserModal/DeleteUserModal/UserList.
// ---------------------------------------------------------------------------

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
}

const modalStyle: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '480px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
}

const modalStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem 0.75rem',
    borderBottom: '1px solid #1e293b',
    position: 'sticky' as const,
    top: 0,
    background: '#0f172a',
    zIndex: 1,
  } as React.CSSProperties,

  title: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#f1f5f9',
  } as React.CSSProperties,

  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '1.2rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  body: {
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
  } as React.CSSProperties,

  sectionLabel: {
    margin: '0.5rem 0 0.1rem',
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#475569',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  label: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.03em',
    marginTop: '0.35rem',
  } as React.CSSProperties,

  input: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '0.8375rem',
    padding: '0.45rem 0.65rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  } as React.CSSProperties,

  slugRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  } as React.CSSProperties,

  slugPrefix: {
    color: '#475569',
    fontSize: '0.9rem',
    fontFamily: 'monospace',
    flexShrink: 0,
  } as React.CSSProperties,

  slugHintError: {
    margin: 0,
    fontSize: '0.7rem',
    color: '#f87171',
    lineHeight: 1.5,
  } as React.CSSProperties,

  slugHintOk: {
    margin: 0,
    fontSize: '0.7rem',
    color: '#86efac',
    lineHeight: 1.5,
  } as React.CSSProperties,

  select: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '0.8375rem',
    padding: '0.45rem 0.65rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    cursor: 'pointer',
  } as React.CSSProperties,

  adminToggleRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.15rem',
    marginTop: '0.75rem',
    padding: '0.6rem 0.75rem',
    background: '#111827',
    borderRadius: '6px',
    border: '1px solid #1e293b',
  } as React.CSSProperties,

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontWeight: 500,
  } as React.CSSProperties,

  checkbox: {
    cursor: 'pointer',
    accentColor: '#2563eb',
    width: '14px',
    height: '14px',
    flexShrink: 0,
  } as React.CSSProperties,

  adminToggleHint: {
    fontSize: '0.68rem',
    color: '#475569',
    lineHeight: 1.5,
    marginLeft: '1.4rem',
  } as React.CSSProperties,

  adminSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
    padding: '0.75rem',
    background: '#0a0f1a',
    borderRadius: '6px',
    border: '1px solid #1e2d3d',
  } as React.CSSProperties,

  validationError: {
    background: '#1c0505',
    border: '1px solid #7f1d1d',
    borderRadius: '5px',
    padding: '0.35rem 0.6rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    marginTop: '0.2rem',
  } as React.CSSProperties,

  serverError: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '5px',
    padding: '0.45rem 0.6rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    lineHeight: 1.5,
    marginTop: '0.2rem',
  } as React.CSSProperties,

  serverErrorHint: {
    color: '#fcd34d',
    fontStyle: 'italic' as const,
  } as React.CSSProperties,

  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem 1rem',
    borderTop: '1px solid #1e293b',
    position: 'sticky' as const,
    bottom: 0,
    background: '#0f172a',
  } as React.CSSProperties,

  cancelBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#94a3b8',
    fontSize: '0.8rem',
    padding: '0.4rem 0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  confirmBtn: {
    background: '#1e3a5f',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    color: '#93c5fd',
    fontSize: '0.8rem',
    fontWeight: 700,
    padding: '0.4rem 0.9rem',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  } as React.CSSProperties,
} as const
