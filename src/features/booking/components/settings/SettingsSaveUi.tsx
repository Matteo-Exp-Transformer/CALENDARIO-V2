import React from 'react'
import { Loader2 } from 'lucide-react'
import { SpinnerGapIcon } from '@phosphor-icons/react/dist/csr/SpinnerGap'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const saveFooterShellClass =
  'restaurant-settings-save-footer admin-warm-surface flex min-h-[4.75rem] w-full max-w-2xl mx-auto flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-xl border px-6 py-6 shadow-sm md:min-h-[5.25rem] md:px-8 md:py-7'

const cancelAllButtonClass =
  'restaurant-settings-cancel-all min-h-[3.75rem] border-2 border-slate-300 bg-white px-8 py-5 text-base font-semibold text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 focus:ring-primary-300'

const saveSubmitButtonClass =
  'restaurant-settings-save-submit min-h-[3.75rem] border-2 border-primary-700 bg-primary-600 px-10 py-5 text-base shadow-md hover:bg-primary-500 hover:border-primary-600 hover:shadow-lg focus:ring-primary-300 disabled:pointer-events-none disabled:border-primary-700 disabled:bg-primary-600'

/** Salva / annulla sopra la card, allineati a destra con spazio sotto i pulsanti. */
export function FormSectionFloatingActions({
  actions,
  children,
}: {
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      {actions != null && <div className="flex w-full justify-end">{actions}</div>}
      {children}
    </div>
  )
}

const SectionSaveButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  pending?: boolean
}> = ({ onClick, disabled, pending }) => (
  <Button
    type="button"
    size="sm"
    onClick={onClick}
    disabled={disabled || pending}
    className="border-2 border-primary-700 bg-primary-600 px-4 py-1.5 text-sm shadow-sm hover:bg-primary-500 hover:border-primary-600 disabled:opacity-60"
  >
    {pending ? (
      <span className="flex items-center gap-1.5">
        <SpinnerGapIcon weight="regular" className="h-3.5 w-3.5 animate-spin" />
        Salvataggio…
      </span>
    ) : (
      'Salva'
    )}
  </Button>
)

/** Annulla + Salva per una sola sezione (card/modulo). */
export const SectionActionBar: React.FC<{
  onCancel: () => void
  onSave: () => void
  cancelDisabled?: boolean
  saveDisabled?: boolean
  pending?: boolean
}> = ({ onCancel, onSave, cancelDisabled, saveDisabled, pending }) => (
  <div className="flex flex-wrap items-center justify-end gap-2">
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onCancel}
      disabled={cancelDisabled || pending}
    >
      Annulla modifiche
    </Button>
    <SectionSaveButton onClick={onSave} disabled={saveDisabled} pending={pending} />
  </div>
)

export type SettingsSaveFooterProps = {
  onCancel: () => void
  onSave: () => void
  pending?: boolean
  cancelDisabled?: boolean
  saveDisabled?: boolean
  className?: string
}

/** Footer globale Impostazioni locale: Annulla tutte + Salva modifiche (Anagrafica e Personalizza form). */
export function SettingsSaveFooter({
  onCancel,
  onSave,
  pending = false,
  cancelDisabled = false,
  saveDisabled = false,
  className,
}: SettingsSaveFooterProps) {
  return (
    <div className={cn(saveFooterShellClass, className)}>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={onCancel}
        disabled={cancelDisabled || pending}
        className={cancelAllButtonClass}
      >
        Annulla tutte le modifiche
      </Button>
      <Button
        type="button"
        onClick={onSave}
        disabled={saveDisabled || pending}
        className={saveSubmitButtonClass}
      >
        {pending ? (
          <>
            <Loader2 className="h-6 w-6 shrink-0 animate-spin" />
            Salvataggio…
          </>
        ) : (
          'Salva modifiche'
        )}
      </Button>
      {!pending && (
        <span
          className="restaurant-settings-save-footer-msg max-w-xl text-center text-base font-semibold leading-snug text-slate-900"
          style={{ color: 'var(--color-text)', WebkitTextFillColor: 'var(--color-text)' }}
        >
          Modifiche non salvate.
        </span>
      )}
    </div>
  )
}
