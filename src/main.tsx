import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'

// Solo dev: nasconde il messaggio informativo di React DevTools (non è un errore).
if (import.meta.env.DEV) {
  const stripReactDevtoolsBanner =
    (original: (...args: unknown[]) => void) =>
    (...args: unknown[]) => {
      const first = args[0]
      if (
        typeof first === 'string' &&
        first.includes('Download the React DevTools')
      ) {
        return
      }
      original(...args)
    }
  // eslint-disable-next-line no-console
  console.log = stripReactDevtoolsBanner(console.log.bind(console))
  // eslint-disable-next-line no-console
  console.info = stripReactDevtoolsBanner(console.info.bind(console))
}

const updateSW = registerSW({
  onNeedRefresh() {
    const shouldUpdate = window.confirm('E disponibile una nuova versione dell app. Vuoi ricaricare ora?')
    if (shouldUpdate) {
      updateSW(true)
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
