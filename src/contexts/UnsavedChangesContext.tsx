import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type UnsavedEntry = {
  label: string
  dirty: boolean
}

type UnsavedChangesContextValue = {
  hasUnsavedChanges: boolean
  registerUnsavedSource: (id: string, label: string, dirty: boolean) => void
  clearUnsavedSource: (id: string) => void
  guardNavigation: () => boolean
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null)

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Record<string, UnsavedEntry>>({})

  const registerUnsavedSource = useCallback((id: string, label: string, dirty: boolean) => {
    setEntries((prev) => ({ ...prev, [id]: { label, dirty } }))
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

  const guardNavigation = useCallback(() => {
    if (!hasUnsavedChanges) return true
    window.alert('Hai modifiche non salvate. Salva o annulla le modifiche prima di cambiare pagina.')
    return false
  }, [hasUnsavedChanges])

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
