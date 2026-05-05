import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'

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
