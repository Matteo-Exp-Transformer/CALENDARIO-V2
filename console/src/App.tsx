import { AppShell } from './components/AppShell'
import { LoginPlaceholder } from './components/LoginPlaceholder'

// F2: mostriamo l'AppShell con l'elenco ristoranti (sola lettura dal DB TEST).
// isAuthenticated è hardcoded a true per questa fase — il login reale (Magic Link / OTP)
// arriverà in F3 e qui gestirà la sessione Supabase reale (ProtectedRoute).
function App() {
  // TODO F3: sostituire con la sessione reale da supabase.auth.getSession()
  const isAuthenticated = true

  if (!isAuthenticated) {
    return <LoginPlaceholder />
  }

  return <AppShell />
}

export default App
