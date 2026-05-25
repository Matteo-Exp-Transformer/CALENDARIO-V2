import React, { useEffect, useState } from 'react'
import { Utensils, ChefHat, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'
import {
  DEFAULT_BOOKING_FORM_CONFIG,
  type BookingMode,
  type BookingPublicFormConfig,
} from '@/features/booking/constants/bookingPublicFormConfig'
import type { BookingType } from '@/types/booking'
import { toast } from 'react-toastify'

const BOOKING_TYPE_OPTIONS: { value: BookingType; label: string }[] = [
  { value: 'tavolo', label: 'Prenota un Tavolo' },
  { value: 'menu_prezzo_fisso', label: 'Menu a Prezzo Fisso' },
  { value: 'rinfresco_laurea', label: 'Rinfresco di Laurea' },
]

const ICON_OPTIONS: { value: BookingMode['icon']; label: string }[] = [
  { value: 'utensils', label: 'Posate' },
  { value: 'cloche', label: 'Cloche' },
  { value: 'chef-hat', label: 'Chef' },
]

function ModeIcon({ icon, className }: { icon: BookingMode['icon']; className?: string }) {
  if (icon === 'chef-hat') return <ChefHat className={className} />
  return <Utensils className={className} />
}

export const BookingFormConfigPanel: React.FC = () => {
  const { data: savedConfig } = useRestaurantSetting('booking_public_form_config')
  const upsert = useUpsertRestaurantSetting()

  const [config, setConfig] = useState<BookingPublicFormConfig>(DEFAULT_BOOKING_FORM_CONFIG)
  const [dirty, setDirty] = useState(false)
  const [expandedMode, setExpandedMode] = useState<string | null>(null)

  useEffect(() => {
    if (savedConfig) {
      setConfig(savedConfig)
      setDirty(false)
    }
  }, [savedConfig])

  const markDirty = () => setDirty(true)

  const updateField = (field: keyof Pick<BookingPublicFormConfig, 'page_title' | 'page_description'>, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    markDirty()
  }

  const updateMode = (modeId: string, patch: Partial<BookingMode>) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => (m.id === modeId ? { ...m, ...patch } : m)),
    }))
    markDirty()
  }

  const handleSave = () => {
    upsert.mutate(
      [{ key: 'booking_public_form_config', value: config }],
      {
        onSuccess: () => {
          setDirty(false)
        },
        onError: () => {
          toast.error('Errore nel salvataggio configurazione form')
        },
      },
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Blocco 1 — Intestazione pagina */}
      <section className="admin-warm-surface rounded-xl border p-5 space-y-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800">Intestazione pagina Prenota</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="page_title" className="block mb-1 text-sm">Titolo</Label>
            <Input
              id="page_title"
              value={config.page_title}
              onChange={(e) => updateField('page_title', e.target.value)}
              placeholder="es. Richiesta Prenotazione"
              maxLength={80}
            />
          </div>
          <div>
            <Label htmlFor="page_description" className="block mb-1 text-sm">Descrizione</Label>
            <textarea
              id="page_description"
              value={config.page_description}
              onChange={(e) => updateField('page_description', e.target.value)}
              placeholder="Breve descrizione mostrata sotto il titolo"
              maxLength={300}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Blocco 2 — Le modalità */}
      <section className="admin-warm-surface rounded-xl border p-5 space-y-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800">Modalità di prenotazione</h3>
        <div className="space-y-3">
          {config.booking_modes.map((mode) => {
            const isOpen = expandedMode === mode.id
            return (
              <div key={mode.id} className="rounded-lg border border-slate-200 overflow-hidden">
                {/* Header accordion */}
                <button
                  type="button"
                  onClick={() => setExpandedMode(isOpen ? null : mode.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center',
                        mode.enabled ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-400',
                      )}
                    >
                      <ModeIcon icon={mode.icon} className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{mode.label}</span>
                    {!mode.enabled && (
                      <span className="text-xs text-slate-400 font-normal">(disabilitata)</span>
                    )}
                  </div>
                  <span className="text-slate-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="px-4 py-4 space-y-4 border-t border-slate-200 bg-white">
                    {/* Toggle attiva */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`mode-enabled-${mode.id}`}
                        checked={mode.enabled}
                        onChange={(e) => updateMode(mode.id, { enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`mode-enabled-${mode.id}`} className="text-sm font-medium text-slate-700">
                        Modalità attiva
                      </label>
                    </div>

                    {/* Label */}
                    <div>
                      <Label htmlFor={`mode-label-${mode.id}`} className="block mb-1 text-sm">Etichetta</Label>
                      <Input
                        id={`mode-label-${mode.id}`}
                        value={mode.label}
                        onChange={(e) => updateMode(mode.id, { label: e.target.value })}
                        maxLength={60}
                        placeholder="Nome della modalità"
                      />
                    </div>

                    {/* Descrizione */}
                    <div>
                      <Label htmlFor={`mode-desc-${mode.id}`} className="block mb-1 text-sm">Descrizione breve</Label>
                      <Input
                        id={`mode-desc-${mode.id}`}
                        value={mode.description}
                        onChange={(e) => updateMode(mode.id, { description: e.target.value })}
                        maxLength={120}
                        placeholder="Una riga descrittiva"
                      />
                    </div>

                    {/* Icona */}
                    <div>
                      <Label className="block mb-1 text-sm">Icona</Label>
                      <div className="flex gap-2">
                        {ICON_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateMode(mode.id, { icon: opt.value })}
                            className={cn(
                              'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
                              mode.icon === opt.value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300',
                            )}
                          >
                            <ModeIcon icon={opt.value} className="h-3.5 w-3.5" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tipologia */}
                    <div>
                      <Label htmlFor={`mode-type-${mode.id}`} className="block mb-1 text-sm">Tipologia prenotazione</Label>
                      <select
                        id={`mode-type-${mode.id}`}
                        value={mode.booking_type}
                        onChange={(e) => updateMode(mode.id, { booking_type: e.target.value as BookingType })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300"
                      >
                        {BOOKING_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle sottotab */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`mode-subtabs-${mode.id}`}
                        checked={mode.sub_tabs_enabled}
                        onChange={(e) => updateMode(mode.id, { sub_tabs_enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`mode-subtabs-${mode.id}`} className="text-sm font-medium text-slate-700">
                        Abilita sottotab (menu consigliati)
                      </label>
                    </div>

                    {/* Info sottotab */}
                    {mode.sub_tabs_enabled && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        Le card dei menu consigliati derivano dai <strong>Menù consigliati</strong> configurati nella tab Prenotazione → Menu.
                      </div>
                    )}

                    {/* Radio stile sottotab */}
                    {mode.sub_tabs_enabled && (
                      <div className="space-y-2">
                        <Label className="block text-sm">Stile sottotab</Label>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <input type="radio" checked readOnly className="h-4 w-4 text-primary-600" />
                            Card orizzontali
                          </label>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-400 cursor-not-allowed">
                            <input type="radio" disabled className="h-4 w-4" />
                            Carosello
                            <span className="text-xs text-slate-400">(prossimamente)</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer salva */}
      <div className="flex items-center justify-between gap-4 rounded-xl border admin-warm-surface px-5 py-4 shadow-sm">
        {dirty && !upsert.isPending && (
          <span className="text-sm font-semibold text-slate-600">Modifiche non salvate</span>
        )}
        <div className="ml-auto">
          <Button
            type="button"
            onClick={handleSave}
            disabled={upsert.isPending || !dirty}
            className="border-2 border-primary-700 bg-primary-600 px-8 py-3 text-sm shadow-md hover:bg-primary-500 hover:border-primary-600 disabled:opacity-60"
          >
            {upsert.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvataggio…
              </span>
            ) : (
              'Salva'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
