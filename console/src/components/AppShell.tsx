// App shell con navigazione a tab (switch di stato) tra le viste della Console.
// Gestisce: header (titolo + email + logout) + nav tab + rendering della vista attiva.
//
// NAVIGAZIONE: switch di stato locale (useState) invece di react-router-dom.
// Motivo: la Console ha oggi due viste flat (Ristoranti / Utenti); BrowserRouter
// aggiungerebbe complessità di setup (history, basename) e dipendenze non ancora
// necessarie. Se le viste cresceranno a > 4 o servirà link-sharing/deep-link,
// migrare a react-router-dom è immediato. (Candidata DEC — vedi report F8.)
//
// F9: aggiunto stato 'tenant-detail' con selectedTenantId per la scheda azienda.
// La scheda è apribile da Ristoranti e da Utenti; il breadcrumb "← Torna" riporta
// alla vista precedente (DEC-046).
//
// F12: aggiunto restaurantListKey per forzare il remount di RestaurantList dopo
// che un tenant viene eliminato dalla TenantDetail (refetch della lista).

import type { User } from '@supabase/supabase-js'
import { useRef, useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'
import { RestaurantList } from './RestaurantList'
import { UserList } from './UserList'
import { TenantDetail } from './TenantDetail'

// Viste disponibili nella Console. 'tenant-detail' è una vista drill-down che sovrappone
// le tab (le tab restano visibili ma non attive durante la scheda).
type ActiveView = 'restaurants' | 'users' | 'tenant-detail'

interface AppShellProps {
  /** Utente autenticato (da useAuth). Usato per mostrare l'email in header. */
  user: User
}

export function AppShell({ user }: AppShellProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const [activeView, setActiveView] = useState<ActiveView>('restaurants')
  // selectedTenantId: presente solo quando activeView === 'tenant-detail'.
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  // previousView: la vista da cui è stata aperta la scheda (per il "← Torna").
  const [previousView, setPreviousView] = useState<'restaurants' | 'users'>('restaurants')
  // restaurantListKey: incrementato dopo eliminazione tenant per forzare il remount di RestaurantList (F12).
  const [restaurantListKey, setRestaurantListKey] = useState(0)
  // savedScrollY: posizione di scorrimento salvata quando si apre la scheda dalla lista ristoranti.
  const savedScrollY = useRef<number | null>(null)
  // pendingScrollRestore: true finché la lista non ha caricato i dati e ripristinato lo scroll (DEC-055).
  const pendingScrollRestore = useRef(false)

  /** Apre la scheda di un tenant, ricordando da quale vista si viene. */
  function openTenantDetail(tenantId: string, from: 'restaurants' | 'users') {
    if (from === 'restaurants') {
      // Salva la posizione corrente per ripristinarla al rientro nella lista (DEC-055).
      savedScrollY.current = window.scrollY
      pendingScrollRestore.current = true
    }
    setSelectedTenantId(tenantId)
    setPreviousView(from)
    setActiveView('tenant-detail')
  }

  /**
   * Chiamato da RestaurantList quando i dati sono pronti per la prima volta dopo il mount.
   * Ripristina la posizione di scorrimento salvata prima di aprire la scheda (DEC-055).
   */
  function handleRestaurantListReady() {
    if (pendingScrollRestore.current && savedScrollY.current !== null) {
      window.scrollTo(0, savedScrollY.current)
      savedScrollY.current = null
      pendingScrollRestore.current = false
    }
  }

  /** Torna alla vista precedente alla scheda. */
  function closeTenantDetail() {
    setSelectedTenantId(null)
    setActiveView(previousView)
  }

  /**
   * Chiamato da TenantDetail.onTenantDeleted (F12): forza il remount di RestaurantList
   * incrementando la key, così la lista si ricarica dopo l'eliminazione di un tenant.
   */
  function handleTenantDeleted() {
    setRestaurantListKey((k) => k + 1)
  }

  /** Cambia tab principale: se si è in tenant-detail, chiude la scheda prima. */
  function handleTabChange(view: 'restaurants' | 'users') {
    setSelectedTenantId(null)
    setActiveView(view)
  }

  async function handleLogout() {
    setLoggingOut(true)
    // signOut() invalida il token localmente e chiama l'endpoint Supabase.
    // onAuthStateChange in useAuth riceverà SIGNED_OUT e aggiornerà lo stato.
    await supabase.auth.signOut()
    // Non serve setLoggingOut(false): dopo signOut il componente viene smontato
    // perché App.tsx tornerà a mostrare LoginScreen.
  }

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
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>Console super-admin</span>

        {/* Email utente autenticato */}
        <span style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </span>

        {/* Pulsante logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            background: 'transparent',
            border: '1px solid #475569',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            cursor: loggingOut ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap' as const,
            opacity: loggingOut ? 0.5 : 1,
          }}
        >
          {loggingOut ? 'Uscita…' : 'Esci'}
        </button>
      </header>

      {/* Nav tab — switch tra le viste della Console */}
      <nav
        style={{
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          gap: '0',
          padding: '0 1rem',
        }}
        aria-label="Navigazione Console"
      >
        <NavTab
          label="Ristoranti"
          active={activeView === 'restaurants' || (activeView === 'tenant-detail' && previousView === 'restaurants')}
          onClick={() => handleTabChange('restaurants')}
        />
        <NavTab
          label="Utenti"
          active={activeView === 'users' || (activeView === 'tenant-detail' && previousView === 'users')}
          onClick={() => handleTabChange('users')}
        />
      </nav>

      {/* Main content area */}
      <main style={{ padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
        {activeView === 'restaurants' && (
          <RestaurantList
            key={restaurantListKey}
            onOpenTenantDetail={(id) => openTenantDetail(id, 'restaurants')}
            onDataReady={handleRestaurantListReady}
          />
        )}
        {activeView === 'users' && (
          <UserList onOpenTenantDetail={(id) => openTenantDetail(id, 'users')} />
        )}
        {activeView === 'tenant-detail' && selectedTenantId && (
          <TenantDetail
            tenantId={selectedTenantId}
            onBack={closeTenantDetail}
            onTenantDeleted={handleTenantDeleted}
          />
        )}
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab di navigazione (componente interno — non esportato)
// ---------------------------------------------------------------------------

interface NavTabProps {
  label: string
  active: boolean
  onClick: () => void
}

function NavTab({ label, active, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
        color: active ? '#f1f5f9' : '#64748b',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 400,
        padding: '0.65rem 1rem',
        transition: 'color 0.15s, border-bottom-color 0.15s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </button>
  )
}
