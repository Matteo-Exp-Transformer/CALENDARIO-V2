import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { BookingRequestPage } from './pages/BookingRequestPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminShell } from './components/layout/AdminShell'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { InvitePage } from './pages/InvitePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TenantProvider } from './contexts/TenantContext'

const RootLayout = () => (
  <TenantProvider>
    <Outlet />
  </TenantProvider>
)

const TenantNotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center max-w-sm px-6">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Pagina non trovata</h1>
      <p className="text-slate-500">Il ristorante richiesto non esiste o l&apos;indirizzo non è corretto.</p>
    </div>
  </div>
)

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />
      },
      // Route pubblica prenotazione (per slug tenant)
      {
        path: '/prenota/:tenantSlug',
        element: <BookingRequestPage />
      },
      {
        path: '/prenota',
        element: <TenantNotFound />
      },
      // Route invito admin (nuova — token nel path)
      {
        path: '/invite/:token',
        element: <InvitePage />
      },
      // Retrocompatibilità: vecchio link /register?token=...
      {
        path: '/register',
        element: <InvitePage />
      },
      // Privacy
      {
        path: '/privacy',
        element: <PrivacyPolicyPage />
      },
      // Auth
      {
        path: '/login',
        element: <AdminLoginPage />
      },
      // Dashboard admin (protetta)
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <AdminShell />
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <Navigate to="/login" replace />
      }
    ]
  }
])
