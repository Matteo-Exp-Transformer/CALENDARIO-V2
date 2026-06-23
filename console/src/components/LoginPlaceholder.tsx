// Schermata placeholder per la fase F1.
// Il login reale (Magic Link / OTP Supabase) sarà implementato in F3.
export function LoginPlaceholder() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      fontFamily: 'system-ui, sans-serif',
      padding: '1rem',
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        color: '#f1f5f9',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧</div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
          Console super-admin
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Solo per Matteo · Area privata
        </p>
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e40af',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.8rem',
          color: '#93c5fd',
          lineHeight: 1.6,
        }}>
          <strong>Login reale in F3</strong>
          <br />
          Fase attuale: F1 — scaffolding &amp; setup.<br />
          L'autenticazione (Magic Link / OTP) sarà implementata nella fase F3 del masterplan.
        </div>
      </div>
    </div>
  )
}
