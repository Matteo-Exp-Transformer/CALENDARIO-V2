/**
 * Pannello impostazioni ristorante per un tenant (F7).
 *
 * COMPORTAMENTO:
 *   - Legge restaurant_settings dal DB tramite useRestaurantSettings.
 *   - Mostra ogni impostazione esposta con: label, valore corrente vs default, editor.
 *   - Per i tenant SANDBOX: editor abilitato con validazione inline; salvataggio via
 *     callConsoleAdmin('upsert_restaurant_setting').
 *   - Per i tenant NON-SANDBOX: tutto in sola lettura (editor disabilitati).
 *
 * CHIAVI ESPOSTE (subset da EXPOSED_SETTINGS):
 *   booking_window_days, restaurant_default_duration (interi), slot_limit_enabled,
 *   booking_reject_out_of_slot, booking_time_slots_enabled (boolean).
 *   Aggiungere chiavi = aggiungere entry in restaurantSettings.ts.
 *
 * GESTIONE FUNCTION NON DEPLOYATA:
 *   Se VITE_CONSOLE_ADMIN_FUNCTION_URL non è impostata, callConsoleAdmin restituisce
 *   un errore esplicito. Il salvataggio mostra quel messaggio senza crash dell'app.
 *
 * GESTIONE RLS BLOCCATA:
 *   Se la policy SELECT su restaurant_settings non è configurata per il client
 *   autenticato, l'hook restituisce status 'rls-blocked' con messaggio esplicativo.
 *
 * VALIDAZIONE:
 *   Prima di inviare, il componente chiama setting.validate(value). Se il validator
 *   restituisce una stringa di errore, mostra l'errore inline e NON chiama callConsoleAdmin.
 *   I validator sono coerenti con quelli dell'app di Matteo (stessa logica, ricreata localmente).
 *
 * REFETCH POST-SALVATAGGIO:
 *   Dopo un salvataggio riuscito, il componente incrementa refetchKey per rileggere
 *   le impostazioni dal DB e confermare visivamente il nuovo valore.
 */

import { useState, useCallback, useEffect } from 'react'
import { useRestaurantSettings } from '@console/hooks/useRestaurantSettings'
import { useSettingSave } from '@console/hooks/useSettingSave'
import { isSandboxTenant } from '@console/lib/sandbox'
import type { ExposedSetting, ExposedSettingValue } from '@console/lib/restaurantSettings'
import type { SettingState } from '@console/hooks/useRestaurantSettings'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RestaurantSettingsPanelProps {
  tenantId: string
}

// ---------------------------------------------------------------------------
// Componente principale
// ---------------------------------------------------------------------------

export function RestaurantSettingsPanel({ tenantId }: RestaurantSettingsPanelProps) {
  const [refetchKey, setRefetchKey] = useState(0)
  const sandbox = isSandboxTenant(tenantId)

  const { state: settingsState } = useRestaurantSettings(tenantId, refetchKey)
  const { state: saveState, saveSetting, reset: resetSave } = useSettingSave()

  // Quando il salvataggio ha successo per questo tenant, forza il re-fetch.
  const isSuccessForThisTenant =
    saveState.status === 'success' && saveState.tenantId === tenantId
  useEffect(() => {
    if (isSuccessForThisTenant) {
      setRefetchKey((k) => k + 1)
    }
  }, [isSuccessForThisTenant])

  const handleSave = useCallback(
    (settingKey: string, value: unknown) => {
      if (!sandbox) return
      void saveSetting(tenantId, settingKey, value)
    },
    [sandbox, tenantId, saveSetting],
  )

  const isSavingKey = (key: string) =>
    saveState.status === 'loading' &&
    saveState.tenantId === tenantId &&
    saveState.settingKey === key

  const isErrorKey = (key: string) =>
    saveState.status === 'error' &&
    saveState.tenantId === tenantId &&
    saveState.settingKey === key

  const isSuccessKey = (key: string) =>
    saveState.status === 'success' &&
    saveState.tenantId === tenantId &&
    saveState.settingKey === key

  const anyLoading = saveState.status === 'loading' && saveState.tenantId === tenantId

  return (
    <div style={panelStyles.container}>
      <p style={panelStyles.sectionLabel}>Impostazioni ristorante</p>

      {/* Loading */}
      {settingsState.status === 'loading' && (
        <p style={panelStyles.dimText}>Caricamento impostazioni…</p>
      )}

      {/* RLS bloccata */}
      {settingsState.status === 'rls-blocked' && (
        <div style={panelStyles.warnBox}>
          <strong>RLS bloccata — lettura restaurant_settings</strong>
          <br />
          {settingsState.message}
        </div>
      )}

      {/* Errore generico */}
      {settingsState.status === 'error' && (
        <div style={panelStyles.errorBox}>
          <strong>Errore lettura impostazioni</strong>
          <br />
          {settingsState.message}
        </div>
      )}

      {/* Lista impostazioni */}
      {settingsState.status === 'ok' && (
        <div style={panelStyles.settingList}>
          {settingsState.settings.map((s) => (
            <SettingRow
              key={s.setting.key}
              settingState={s}
              sandbox={sandbox}
              saving={isSavingKey(s.setting.key)}
              anyLoading={anyLoading}
              showError={isErrorKey(s.setting.key)}
              errorMessage={
                isErrorKey(s.setting.key) && saveState.status === 'error'
                  ? saveState.message
                  : ''
              }
              showSuccess={isSuccessKey(s.setting.key)}
              onSave={handleSave}
              onResetFeedback={resetSave}
            />
          ))}
        </div>
      )}

      {/* Badge sola lettura (non sandbox) */}
      {!sandbox && settingsState.status === 'ok' && (
        <p style={panelStyles.readOnlyHint}>
          Solo lettura — modifica disponibile solo sui tenant sandbox
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Riga singola impostazione
// ---------------------------------------------------------------------------

interface SettingRowProps {
  settingState: SettingState
  sandbox: boolean
  saving: boolean
  anyLoading: boolean
  showError: boolean
  errorMessage: string
  showSuccess: boolean
  onSave: (settingKey: string, value: unknown) => void
  onResetFeedback: () => void
}

function SettingRow({
  settingState,
  sandbox,
  saving,
  anyLoading,
  showError,
  errorMessage,
  showSuccess,
  onSave,
  onResetFeedback,
}: SettingRowProps) {
  const { setting, currentValue, storedInDb, updatedAt } = settingState

  return (
    <div style={panelStyles.settingBlock}>
      <div style={panelStyles.settingHeader}>
        {/* Label + badge default/salvato */}
        <span style={panelStyles.settingLabel}>{setting.label}</span>
        {storedInDb ? (
          <span style={panelStyles.savedBadge} title={updatedAt ? `Aggiornato: ${updatedAt}` : undefined}>
            salvato
          </span>
        ) : (
          <span style={panelStyles.defaultBadge}>default</span>
        )}
      </div>

      {/* Descrizione */}
      <p style={panelStyles.settingDesc}>{setting.description}</p>

      {/* Editor + azione */}
      {setting.type === 'bool' ? (
        <BoolEditor
          setting={setting}
          value={currentValue as boolean}
          sandbox={sandbox}
          saving={saving}
          anyLoading={anyLoading}
          onSave={onSave}
        />
      ) : (
        <IntEditor
          setting={setting}
          value={currentValue as number}
          sandbox={sandbox}
          saving={saving}
          anyLoading={anyLoading}
          onSave={onSave}
        />
      )}

      {/* Feedback errore inline */}
      {showError && (
        <div style={panelStyles.inlineError}>
          <span style={{ flex: 1 }}>{errorMessage}</span>
          <button onClick={onResetFeedback} style={panelStyles.closeFeedback} aria-label="Chiudi errore">
            ×
          </button>
        </div>
      )}

      {/* Feedback successo inline */}
      {showSuccess && (
        <div style={panelStyles.inlineSuccess}>
          <span style={{ flex: 1 }}>Salvato</span>
          <button onClick={onResetFeedback} style={panelStyles.closeFeedback} aria-label="Chiudi">
            ×
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Editor booleano (toggle ON/OFF)
// ---------------------------------------------------------------------------

interface BoolEditorProps {
  setting: ExposedSetting
  value: boolean
  sandbox: boolean
  saving: boolean
  anyLoading: boolean
  onSave: (settingKey: string, value: unknown) => void
}

function BoolEditor({ setting, value, sandbox, saving, anyLoading, onSave }: BoolEditorProps) {
  const handleToggle = useCallback(() => {
    if (!sandbox || saving || anyLoading) return
    const newValue = !value
    // Validazione (per boolean è sempre ok, ma chiamiamo per coerenza col registro).
    const err = setting.validate(newValue)
    if (err) return // non dovrebbe mai succedere per boolean
    onSave(setting.key, newValue)
  }, [sandbox, saving, anyLoading, value, setting, onSave])

  return (
    <div style={panelStyles.editorRow}>
      <span style={panelStyles.currentValueText}>
        Valore corrente:{' '}
        <span style={{ color: value ? '#86efac' : '#94a3b8', fontWeight: 600 }}>
          {value ? 'ON' : 'OFF'}
        </span>
        {' '}
        <span style={panelStyles.dimSmall}>(default: {setting.defaultValue ? 'ON' : 'OFF'})</span>
      </span>

      {sandbox && (
        <button
          onClick={handleToggle}
          disabled={saving || anyLoading}
          style={{
            ...panelStyles.toggleBtn,
            background: value ? '#1e3a5f' : '#1a2a1a',
            borderColor: value ? '#2563eb' : '#374151',
            color: value ? '#93c5fd' : '#6b7280',
            cursor: saving || anyLoading ? 'not-allowed' : 'pointer',
            opacity: anyLoading && !saving ? 0.5 : 1,
          }}
          aria-label={value ? `Spegni ${setting.label}` : `Accendi ${setting.label}`}
          aria-pressed={value}
        >
          {saving ? '…' : value ? 'ON → OFF' : 'OFF → ON'}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Editor intero (input numerico con validazione)
// ---------------------------------------------------------------------------

interface IntEditorProps {
  setting: ExposedSetting
  value: number
  sandbox: boolean
  saving: boolean
  anyLoading: boolean
  onSave: (settingKey: string, value: unknown) => void
}

function IntEditor({ setting, value, sandbox, saving, anyLoading, onSave }: IntEditorProps) {
  // inputValue è la stringa nel campo; inizializzata dal valore corrente.
  const [inputValue, setInputValue] = useState<string>(String(value))
  // validationError: null = ok, stringa = messaggio errore.
  const [validationError, setValidationError] = useState<string | null>(null)

  // Sincronizza inputValue quando il valore esterno cambia (es. dopo refetch).
  // Usiamo un useEffect per non perdere l'input dell'utente mentre sta scrivendo.
  const prevValueRef = useState<ExposedSettingValue>(value)
  useEffect(() => {
    if (prevValueRef[0] !== value) {
      setInputValue(String(value))
      setValidationError(null)
      prevValueRef[1](value)
    }
  }, [value, prevValueRef])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)
    // Validazione live (solo se non vuoto).
    if (raw.trim() !== '') {
      const parsed = parseInt(raw.trim(), 10)
      const err = setting.validate(Number.isNaN(parsed) ? raw : parsed)
      setValidationError(err)
    } else {
      setValidationError(null)
    }
  }, [setting])

  const handleSave = useCallback(() => {
    if (!sandbox || saving || anyLoading) return
    const parsed = parseInt(inputValue.trim(), 10)
    if (Number.isNaN(parsed)) {
      setValidationError('Inserisci un numero intero valido')
      return
    }
    const err = setting.validate(parsed)
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)
    onSave(setting.key, parsed)
  }, [sandbox, saving, anyLoading, inputValue, setting, onSave])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSave()
    },
    [handleSave],
  )

  const hasChange = inputValue.trim() !== String(value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div style={panelStyles.editorRow}>
        <span style={panelStyles.currentValueText}>
          Valore corrente:{' '}
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{value}</span>
          {' '}
          <span style={panelStyles.dimSmall}>(default: {String((setting as { defaultValue: number }).defaultValue)})</span>
        </span>
      </div>

      {sandbox && (
        <div style={panelStyles.intEditorRow}>
          <input
            type="number"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={saving || anyLoading}
            style={{
              ...panelStyles.numberInput,
              borderColor: validationError ? '#ef4444' : '#334155',
              opacity: anyLoading && !saving ? 0.5 : 1,
            }}
            aria-label={`Nuovo valore per ${setting.label}`}
            aria-invalid={validationError !== null}
          />
          <button
            onClick={handleSave}
            disabled={saving || anyLoading || !hasChange || validationError !== null}
            style={{
              ...panelStyles.saveBtn,
              opacity: saving || anyLoading || !hasChange || validationError !== null ? 0.4 : 1,
              cursor:
                saving || anyLoading || !hasChange || validationError !== null
                  ? 'not-allowed'
                  : 'pointer',
            }}
            aria-label={`Salva ${setting.label}`}
          >
            {saving ? '…' : 'Salva'}
          </button>
        </div>
      )}

      {/* Errore di validazione lato client */}
      {validationError && (
        <p style={panelStyles.validationError}>{validationError}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — nessuna dipendenza da file CSS dell'app di Matteo.
// ---------------------------------------------------------------------------

const panelStyles = {
  container: {
    marginTop: '0.5rem',
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: '0.7rem',
    color: '#64748b',
    margin: '0 0 0.5rem',
    fontWeight: 500,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  dimText: {
    fontSize: '0.75rem',
    color: '#475569',
    fontStyle: 'italic',
    margin: '0.25rem 0',
  } as React.CSSProperties,

  warnBox: {
    background: '#1c1400',
    border: '1px solid #854d0e',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#fcd34d',
    fontSize: '0.75rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  errorBox: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  settingList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  } as React.CSSProperties,

  settingBlock: {
    background: '#0f1e30',
    border: '1px solid #1e3a5f',
    borderRadius: '6px',
    padding: '0.6rem 0.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  } as React.CSSProperties,

  settingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,

  settingLabel: {
    flex: 1,
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#cbd5e1',
  } as React.CSSProperties,

  savedBadge: {
    flexShrink: 0,
    fontSize: '0.6rem',
    fontWeight: 700,
    background: '#14532d',
    color: '#86efac',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  defaultBadge: {
    flexShrink: 0,
    fontSize: '0.6rem',
    fontWeight: 700,
    background: '#1e293b',
    color: '#475569',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  settingDesc: {
    fontSize: '0.7rem',
    color: '#475569',
    margin: '0',
    lineHeight: 1.5,
  } as React.CSSProperties,

  editorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  currentValueText: {
    flex: 1,
    fontSize: '0.75rem',
    color: '#64748b',
  } as React.CSSProperties,

  dimSmall: {
    fontSize: '0.65rem',
    color: '#374151',
  } as React.CSSProperties,

  toggleBtn: {
    flexShrink: 0,
    border: '1px solid',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '0.2rem 0.55rem',
    fontFamily: 'monospace',
    transition: 'opacity 0.15s',
    minWidth: '64px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  intEditorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  } as React.CSSProperties,

  numberInput: {
    background: '#0f172a',
    border: '1px solid',
    borderRadius: '4px',
    color: '#f1f5f9',
    fontSize: '0.8rem',
    padding: '0.25rem 0.5rem',
    width: '80px',
    fontFamily: 'monospace',
    outline: 'none',
  } as React.CSSProperties,

  saveBtn: {
    background: '#1e3a5f',
    border: '1px solid #2563eb',
    borderRadius: '4px',
    color: '#93c5fd',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    fontFamily: 'monospace',
    transition: 'opacity 0.15s',
    cursor: 'pointer',
  } as React.CSSProperties,

  validationError: {
    fontSize: '0.7rem',
    color: '#f87171',
    margin: '0',
  } as React.CSSProperties,

  inlineError: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    color: '#fca5a5',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    marginTop: '0.2rem',
  } as React.CSSProperties,

  inlineSuccess: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#14532d',
    border: '1px solid #166534',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    color: '#86efac',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    marginTop: '0.2rem',
  } as React.CSSProperties,

  closeFeedback: {
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: '0.9rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0',
    opacity: 0.7,
    fontFamily: 'inherit',
  } as React.CSSProperties,

  readOnlyHint: {
    fontSize: '0.65rem',
    color: '#374151',
    marginTop: '0.5rem',
    fontStyle: 'italic',
  } as React.CSSProperties,
} as const
