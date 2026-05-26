import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

type UnsavedEntry = {
  label: string
  dirty: boolean
}

export type UnsavedChangesGuardOptions = {
  /** Consente di tornare alla dashboard prenotazioni (es. da Home overlay o CRM) pur con modifiche aperte. */
  allowPrenotazioniDashboard?: boolean
}

type UnsavedChangesContextValue = {
  hasUnsavedChanges: boolean
  registerUnsavedSource: (id: string, label: string, dirty: boolean) => void
  clearUnsavedSource: (id: string) => void
  guardNavigation: (options?: UnsavedChangesGuardOptions) => boolean
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null)

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Record<string, UnsavedEntry>>({})

  const registerUnsavedSource = useCallback((id: string, label: string, dirty: boolean) => {
    setEntries((prev) => {
      if (!dirty) {
        if (!(id in prev)) return prev
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: { label, dirty: true } }
    })
  }, [])

  const clearUnsavedSource = useCallback((id: string) => {
    setEntries((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const dirtyEntries = useMemo(
    () => Object.values(entries).filter((entry) => entry.dirty),
    [entries],
  )
  const hasUnsavedChanges = dirtyEntries.length > 0

  const guardNavigation = useCallback((options?: UnsavedChangesGuardOptions) => {
    if (!hasUnsavedChanges) return true
    if (options?.allowPrenotazioniDashboard) return true
    const sections = dirtyEntries.map((entry) => entry.label).filter(Boolean)
    const sectionHint =
      sections.length > 0 ? ` Sezioni con modifiche: ${sections.join(', ')}.` : ''
    toast.warn(
      `Hai modifiche non salvate. Salva o annulla le modifiche prima di cambiare pagina.${sectionHint}`,
      { autoClose: 5000 },
    )
    return false
  }, [dirtyEntries, hasUnsavedChanges])

  useEffect(() => {
    if (!hasUnsavedChanges) return
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const value = useMemo(
    () => ({
      hasUnsavedChanges,
      registerUnsavedSource,
      clearUnsavedSource,
      guardNavigation,
    }),
    [hasUnsavedChanges, registerUnsavedSource, clearUnsavedSource, guardNavigation],
  )

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  )
}

export function useUnsavedChangesGuard() {
  const ctx = useContext(UnsavedChangesContext)
  if (!ctx) {
    throw new Error('useUnsavedChangesGuard must be used inside UnsavedChangesProvider')
  }
  return ctx
}
