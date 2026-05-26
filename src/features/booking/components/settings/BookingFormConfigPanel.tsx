import React, { useEffect, useState } from 'react'
import { ForkKnifeIcon } from '@phosphor-icons/react/dist/csr/ForkKnife'
import { CallBellIcon } from '@phosphor-icons/react/dist/csr/CallBell'
import { ChefHatIcon } from '@phosphor-icons/react/dist/csr/ChefHat'
import { WineIcon } from '@phosphor-icons/react/dist/csr/Wine'
import { CoffeeIcon } from '@phosphor-icons/react/dist/csr/Coffee'
import { PizzaIcon } from '@phosphor-icons/react/dist/csr/Pizza'
import { HamburgerIcon } from '@phosphor-icons/react/dist/csr/Hamburger'
import { BowlSteamIcon } from '@phosphor-icons/react/dist/csr/BowlSteam'
import { CakeIcon } from '@phosphor-icons/react/dist/csr/Cake'
import { MartiniIcon } from '@phosphor-icons/react/dist/csr/Martini'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { LeafIcon } from '@phosphor-icons/react/dist/csr/Leaf'
import { SpinnerGapIcon } from '@phosphor-icons/react/dist/csr/SpinnerGap'
import { CaretUpIcon } from '@phosphor-icons/react/dist/csr/CaretUp'
import { CaretDownIcon } from '@phosphor-icons/react/dist/csr/CaretDown'
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'
import {
  useRestaurantSetting,
  useUpsertRestaurantSetting,
} from '@/features/booking/hooks/useRestaurantSetting'
import { useTenantContext } from '@/contexts/TenantContext'
import {
  BOOKING_HEADER_FONT_OPTIONS,
  DEFAULT_BOOKING_FORM_CONFIG,
  getBookingHeaderFontFamily,
  normalizeBookingHeaderColor,
  normalizeBookingPublicFormConfig,
  type BookingHeaderTextStyle,
  type BookingHeaderTextTarget,
  type BookingModeIcon,
  type BookingMode,
  type BookingPublicFormConfig,
  type SubTab,
  type SubTabIcon,
} from '@/features/booking/constants/bookingPublicFormConfig'
import type { CustomStaffPreset } from '@/features/booking/constants/presetMenus'
import { toast } from 'react-toastify'

const ICON_OPTIONS: { value: BookingModeIcon; label: string }[] = [
  { value: 'utensils', label: 'Posate' },
  { value: 'cloche', label: 'Cloche' },
  { value: 'chef-hat', label: 'Chef' },
  { value: 'wine', label: 'Calice' },
  { value: 'coffee', label: 'Caffe' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'hamburger', label: 'Burger' },
  { value: 'bowl-steam', label: 'Piatto caldo' },
  { value: 'cake', label: 'Dolce' },
  { value: 'martini', label: 'Cocktail' },
]

const SUB_TAB_ICON_OPTIONS: { value: SubTabIcon; label: string }[] = [
  { value: 'utensils', label: 'Posate' },
  { value: 'cloche', label: 'Cloche' },
  { value: 'chef-hat', label: 'Chef' },
  { value: 'star', label: 'Stella' },
  { value: 'leaf', label: 'Foglia' },
]

function ModeIcon({ icon, className }: { icon: BookingMode['icon']; className?: string }) {
  if (icon === 'utensils') return <ForkKnifeIcon weight="light" className={className} />
  if (icon === 'chef-hat') return <ChefHatIcon weight="light" className={className} />
  if (icon === 'wine') return <WineIcon weight="light" className={className} />
  if (icon === 'coffee') return <CoffeeIcon weight="light" className={className} />
  if (icon === 'pizza') return <PizzaIcon weight="light" className={className} />
  if (icon === 'hamburger') return <HamburgerIcon weight="light" className={className} />
  if (icon === 'bowl-steam') return <BowlSteamIcon weight="light" className={className} />
  if (icon === 'cake') return <CakeIcon weight="light" className={className} />
  if (icon === 'martini') return <MartiniIcon weight="light" className={className} />
  return <CallBellIcon weight="light" className={className} />
}

function SubTabIconOption({ icon, className }: { icon: SubTabIcon; className?: string }) {
  if (icon === 'utensils') return <ForkKnifeIcon weight="light" className={className} />
  if (icon === 'cloche') return <CallBellIcon weight="light" className={className} />
  if (icon === 'chef-hat') return <ChefHatIcon weight="light" className={className} />
  if (icon === 'star') return <StarIcon weight="light" className={className} />
  if (icon === 'leaf') return <LeafIcon weight="light" className={className} />
  return <ForkKnifeIcon weight="light" className={className} />
}

function newSubTab(type: SubTab['type']): SubTab {
  return {
    id: crypto.randomUUID(),
    type,
    label: type === 'preset' ? 'Menu consigliato' : 'Opzione menu',
    icon: 'utensils',
  }
}

export const BookingFormConfigPanel: React.FC = () => {
  const { organizationName } = useTenantContext()
  const { data: savedConfig } = useRestaurantSetting('booking_public_form_config')
  const { data: restaurantName } = useRestaurantSetting('restaurant_name')
  const { data: customPresetsRaw } = useRestaurantSetting('booking_custom_staff_presets')
  const upsert = useUpsertRestaurantSetting()

  const displayRestaurantName =
    (typeof restaurantName === 'string' ? restaurantName.trim() : '') ||
    organizationName?.trim() ||
    ''

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

  const updateField = (
    field: keyof Pick<BookingPublicFormConfig, 'page_title' | 'page_description'>,
    value: string,
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    markDirty()
  }

  const updateHeaderTextStyle = (
    target: BookingHeaderTextTarget,
    patch: Partial<BookingHeaderTextStyle>,
  ) => {
    setConfig((prev) => {
      const currentStyles = prev.header_styles ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles
      const currentTarget = currentStyles[target] ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles[target]
      return {
        ...prev,
        header_styles: {
          ...currentStyles,
          [target]: {
            ...currentTarget,
            ...patch,
            color: patch.color
              ? normalizeBookingHeaderColor(patch.color, currentTarget.color)
              : currentTarget.color,
          },
        },
      }
    })
    markDirty()
  }

  const updateMode = (modeId: string, patch: Partial<BookingMode>) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => (m.id === modeId ? { ...m, ...patch } : m)),
    }))
    markDirty()
  }

  const updateSubTab = (modeId: string, subTabId: string, patch: Partial<SubTab>) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => {
        if (m.id !== modeId) return m
        return {
          ...m,
          sub_tabs: (m.sub_tabs ?? []).map((t) => (t.id === subTabId ? { ...t, ...patch } : t)),
        }
      }),
    }))
    markDirty()
  }

  const addSubTab = (modeId: string, type: SubTab['type']) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => {
        if (m.id !== modeId) return m
        return { ...m, sub_tabs: [...(m.sub_tabs ?? []), newSubTab(type)] }
      }),
    }))
    markDirty()
  }

  const removeSubTab = (modeId: string, subTabId: string) => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => {
        if (m.id !== modeId) return m
        return { ...m, sub_tabs: (m.sub_tabs ?? []).filter((t) => t.id !== subTabId) }
      }),
    }))
    markDirty()
  }

  const moveSubTab = (modeId: string, subTabId: string, direction: 'up' | 'down') => {
    setConfig((prev) => ({
      ...prev,
      booking_modes: prev.booking_modes.map((m) => {
        if (m.id !== modeId) return m
        const tabs = [...(m.sub_tabs ?? [])]
        const idx = tabs.findIndex((t) => t.id === subTabId)
        if (idx < 0) return m
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= tabs.length) return m
        ;[tabs[idx], tabs[swapIdx]] = [tabs[swapIdx], tabs[idx]]
        return { ...m, sub_tabs: tabs }
      }),
    }))
    markDirty()
  }

  const handleSave = () => {
    const normalized = normalizeBookingPublicFormConfig(config)
    upsert.mutate(
      [{ key: 'booking_public_form_config', value: normalized }],
      {
        onSuccess: () => {
          setConfig(normalized)
          setDirty(false)
        },
        onError: () => {
          toast.error('Errore nel salvataggio configurazione form')
        },
      },
    )
  }

  const allPresets: CustomStaffPreset[] = Array.isArray(customPresetsRaw) ? customPresetsRaw : []
  const headerStyles = config.header_styles ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles
  const headerControlClass =
    'rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300'

  const renderHeaderStyleControls = (target: BookingHeaderTextTarget) => {
    const style = headerStyles[target] ?? DEFAULT_BOOKING_FORM_CONFIG.header_styles[target]
    return (
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_3rem] gap-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-slate-500">Font</span>
          <select
            value={style.font}
            onChange={(e) =>
              updateHeaderTextStyle(target, {
                font: e.target.value as BookingHeaderTextStyle['font'],
              })
            }
            className={headerControlClass}
          >
            {BOOKING_HEADER_FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-slate-500">Colore</span>
          <input
            type="color"
            value={style.color}
            onChange={(e) => updateHeaderTextStyle(target, { color: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
          />
        </label>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Blocco 1 — Intestazione pagina */}
      <section className="admin-warm-surface rounded-xl border p-5 space-y-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800">Intestazione pagina Prenota</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="page_restaurant_name" className="block mb-1 text-sm">
              Nome azienda
            </Label>
            <Input
              id="page_restaurant_name"
              value={displayRestaurantName || '—'}
              readOnly
              disabled
              className="cursor-default bg-slate-50/90 text-slate-800 disabled:opacity-100"
              style={{
                fontFamily: getBookingHeaderFontFamily(headerStyles.restaurant_name.font),
                color: headerStyles.restaurant_name.color,
              }}
              aria-describedby="page_restaurant_name_hint"
            />
            <p id="page_restaurant_name_hint" className="mt-1 text-xs text-slate-500">
              Per modificare nome azienda usa la scheda{' '}
              <span className="font-medium text-slate-700">&quot;Anagrafica Azienda&quot;</span> nelle
              Impostazioni.
            </p>
            {renderHeaderStyleControls('restaurant_name')}
          </div>
          <div>
            <Label htmlFor="page_title" className="block mb-1 text-sm">Titolo</Label>
            <Input
              id="page_title"
              value={config.page_title}
              onChange={(e) => updateField('page_title', e.target.value)}
              placeholder="es. Richiesta Prenotazione"
              maxLength={80}
              style={{
                fontFamily: getBookingHeaderFontFamily(headerStyles.page_title.font),
                color: headerStyles.page_title.color,
              }}
            />
            {renderHeaderStyleControls('page_title')}
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
              className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{
                fontFamily: getBookingHeaderFontFamily(headerStyles.page_description.font),
                color: headerStyles.page_description.color,
              }}
            />
            {renderHeaderStyleControls('page_description')}
          </div>
        </div>
      </section>

      {/* Blocco 2 — Le modalità */}
      <section className="admin-warm-surface rounded-xl border p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-800">Modalità di prenotazione</h3>
          <p className="text-sm text-slate-600">
            Scegli quali modalità di prenotazioni sono disponibili, e cosa mostrano.
          </p>
        </div>
        <div className="space-y-3">
          {config.booking_modes.map((mode) => {
            const isOpen = expandedMode === mode.id

            const relevantPresets = allPresets.filter(
              (p) =>
                p.visible_on_booking !== false &&
                Array.isArray(p.booking_types) &&
                (p.booking_types as string[]).includes(mode.booking_type),
            )

            const subTabs = mode.sub_tabs ?? []

            return (
              <div key={mode.id} className="rounded-lg border border-slate-200 overflow-hidden">
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

                    <div>
                      <Label className="block mb-1 text-sm">Icona</Label>
                      <div className="flex gap-2 flex-wrap">
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

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`mode-subtabs-${mode.id}`}
                        checked={mode.sub_tabs_enabled}
                        onChange={(e) => updateMode(mode.id, { sub_tabs_enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`mode-subtabs-${mode.id}`} className="text-sm font-medium text-slate-700">
                        Abilita sottotab (card orizzontali sul form pubblico)
                      </label>
                    </div>

                    {mode.sub_tabs_enabled && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                          Le card compaiono sotto la tipologia scelta dal cliente. Puoi collegare un{' '}
                          <strong>menù consigliato</strong> (griglia ingredienti) oppure un&apos;opzione{' '}
                          <strong>manuale</strong> (solo etichetta e prezzo nel riepilogo).
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSubTab(mode.id, 'preset')}
                          >
                            + Sottotab preset
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSubTab(mode.id, 'manual')}
                          >
                            + Sottotab manuale
                          </Button>
                        </div>

                        {subTabs.length === 0 ? (
                          <p className="text-xs text-slate-500">
                            Nessuna sottotab: aggiungine almeno una o disattiva l&apos;opzione sopra.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {subTabs.map((tab, tabIdx) => (
                              <div
                                key={tab.id}
                                className="rounded-lg border border-slate-200 p-4 space-y-3 bg-slate-50/50"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-slate-600 uppercase">
                                    Sottotab {tabIdx + 1}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      title="Sposta su"
                                      disabled={tabIdx === 0}
                                      onClick={() => moveSubTab(mode.id, tab.id, 'up')}
                                      className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40"
                                    >
                                      <CaretUpIcon weight="regular" className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      title="Sposta giù"
                                      disabled={tabIdx === subTabs.length - 1}
                                      onClick={() => moveSubTab(mode.id, tab.id, 'down')}
                                      className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40"
                                    >
                                      <CaretDownIcon weight="regular" className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      title="Elimina"
                                      onClick={() => removeSubTab(mode.id, tab.id)}
                                      className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      <TrashIcon weight="regular" className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  {(['preset', 'manual'] as const).map((t) => (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() =>
                                        updateSubTab(mode.id, tab.id, {
                                          type: t,
                                          preset_id: t === 'manual' ? undefined : tab.preset_id,
                                        })
                                      }
                                      className={cn(
                                        'rounded-lg border px-3 py-1.5 text-xs font-semibold',
                                        tab.type === t
                                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                                          : 'border-slate-200 text-slate-600',
                                      )}
                                    >
                                      {t === 'preset' ? 'Preset' : 'Manuale'}
                                    </button>
                                  ))}
                                </div>

                                <div>
                                  <Label className="block mb-1 text-sm">Etichetta card</Label>
                                  <Input
                                    value={tab.label}
                                    onChange={(e) =>
                                      updateSubTab(mode.id, tab.id, { label: e.target.value })
                                    }
                                    maxLength={60}
                                    placeholder="Nome mostrato al cliente"
                                  />
                                </div>

                                <div>
                                  <Label className="block mb-1 text-sm">Icona</Label>
                                  <div className="flex gap-2 flex-wrap">
                                    {SUB_TAB_ICON_OPTIONS.map((opt) => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() =>
                                          updateSubTab(mode.id, tab.id, { icon: opt.value })
                                        }
                                        className={cn(
                                          'flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold',
                                          tab.icon === opt.value
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 text-slate-600',
                                        )}
                                      >
                                        <SubTabIconOption icon={opt.value} className="h-3 w-3" />
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {tab.type === 'preset' && (
                                  <div>
                                    <Label className="block mb-1 text-sm">Menù consigliato collegato</Label>
                                    {relevantPresets.length > 0 ? (
                                      <select
                                        value={tab.preset_id ?? ''}
                                        onChange={(e) =>
                                          updateSubTab(mode.id, tab.id, {
                                            preset_id: e.target.value || undefined,
                                          })
                                        }
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                      >
                                        <option value="">— Seleziona —</option>
                                        {relevantPresets.map((p) => (
                                          <option key={p.id} value={p.id}>
                                            {p.name}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <p className="text-xs text-slate-500">
                                        Nessun menù consigliato per questa modalità (tab Menu in admin).
                                      </p>
                                    )}
                                  </div>
                                )}

                                <div>
                                  <Label className="block mb-1 text-sm">Prezzo a persona (opzionale)</Label>
                                  <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={tab.price_per_person ?? ''}
                                    onChange={(e) => {
                                      const v = e.target.value
                                      updateSubTab(mode.id, tab.id, {
                                        price_per_person:
                                          v === '' ? undefined : Math.max(0, parseFloat(v) || 0),
                                      })
                                    }}
                                    placeholder="es. 45"
                                  />
                                </div>

                                <div>
                                  <Label className="block mb-1 text-sm">Descrizione breve (opzionale)</Label>
                                  <Input
                                    value={tab.description ?? ''}
                                    onChange={(e) =>
                                      updateSubTab(mode.id, tab.id, {
                                        description:
                                          e.target.value === '' ? undefined : e.target.value,
                                      })
                                    }
                                    maxLength={80}
                                    placeholder="Sottotitolo sulla card"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-4 pt-1">
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
                <SpinnerGapIcon weight="regular" className="h-4 w-4 animate-spin" />
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
