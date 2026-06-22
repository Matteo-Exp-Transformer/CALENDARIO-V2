import { AppShell } from './components/AppShell'
import { LoginPlaceholder } from './components/LoginPlaceholder'

// Placeholder di fase F1: auth reale verrà in F3.
// Per ora mostriamo sempre la schermata di login-placeholder + shell vuota.
// In F3 qui andrà la logica di routing autenticato (ProtectedRoute).
function App() {
  // F1: nessuna sessione reale — mostriamo placeholder
  const isAuthenticated = false

  if (!isAuthenticated) {
    return <LoginPlaceholder />
  }

  return <AppShell />
}

export default App
