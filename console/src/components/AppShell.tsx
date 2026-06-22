// App shell con elenco ristoranti (F2).
// F3: auth reale — per ora isAuthenticated è hardcoded true in App.tsx.
import { RestaurantList } from './RestaurantList'

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
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>· F2 elenco ristoranti</span>
      </header>

      {/* Main content area */}
      <main style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <RestaurantList />
      </main>
    </div>
  )
}
