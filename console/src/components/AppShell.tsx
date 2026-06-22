// App shell vuota — verrà popolata nelle fasi successive del masterplan.
// F2: elenco tenant + cambio edition. F3: auth reale.
export function AppShell() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0f172a',
      fontFamily: 'system-ui, sans-serif',
      color: '#f1f5f9',
    }}>
      {/* Header */}
      <header style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>Console super-admin</span>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>· F1 scaffold</span>
      </header>

      {/* Main content area — placeholder */}
      <main style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          App shell. I pannelli di gestione tenant verranno aggiunti nelle fasi successive.
        </p>
      </main>
    </div>
  )
}
