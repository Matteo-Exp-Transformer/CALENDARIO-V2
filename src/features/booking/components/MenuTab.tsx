import React, { useMemo } from 'react'
import { CollapsibleSection } from './CollapsibleSection'
import { MenuSelection } from './MenuSelection'
import type { SelectedMenuItem } from '@/types/menu'
import type { BookingType } from '@/types/booking'
import { bookingTypeUsesMenuSelections } from '../utils/bookingTypeMenu'
import { getPresetMenuLabel, type CustomStaffPreset, type PresetMenuType } from '../constants/presetMenus'
import { MenuPromoBannerCards } from './MenuPromoBannerCards'

interface MenuTabProps {
  booking: any
  /** Tipologia effettiva in modifica (es. menù a prezzo fisso); default da `booking.booking_type`. */
  menuFlowBookingType?: BookingType
  isEditMode: boolean
  menuSelection?: {
    items: SelectedMenuItem[]
    tiramisu_total?: number
    tiramisu_kg?: number
  }
  numGuests: number
  presetMenu?: string | null
  staffPresetsDropdownVisible?: boolean
  customStaffPresets?: CustomStaffPreset[]
  /** Testi promo per la tipologia in modifica (stesse card del form pubblico). */
  menuPromoMessages?: string[]
  isMenuExpanded: boolean
  onMenuExpandToggle: () => void
  onMenuChange: (payload: {
    items: SelectedMenuItem[]
    totalPerPerson: number
    tiramisuTotal: number
    tiramisuKg: number
  }) => void
  onPresetMenuChange?: (preset: PresetMenuType) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  bevande: '🍹',
  pizza: '🍕',
  antipasti: '🥗',
  fritti: '🍟',
  primi: '🍝',
  secondi: '🥩',
  dolci: '🍰'
}

const CATEGORY_LABELS: Record<string, string> = {
  bevande: 'BEVANDE',
  pizza: 'PIZZA',
  antipasti: 'ANTIPASTI',
  fritti: 'FRITTI',
  primi: 'PRIMI',
  secondi: 'SECONDI',
  dolci: 'DOLCI'
}

export const MenuTab: React.FC<MenuTabProps> = ({
  booking,
  menuFlowBookingType,
  isEditMode,
  menuSelection,
  numGuests,
  presetMenu,
  staffPresetsDropdownVisible = true,
  customStaffPresets = [],
  menuPromoMessages = [],
  isMenuExpanded,
  onMenuExpandToggle,
  onMenuChange,
  onPresetMenuChange
}) => {
  const resolvedMenuBookingType: BookingType =
    menuFlowBookingType ??
    (bookingTypeUsesMenuSelections(booking?.booking_type) ? booking.booking_type : 'rinfresco_laurea')
  // Group menu items by category
  const groupedItems = useMemo(() => {
    if (!menuSelection?.items) return {}

    const grouped: Record<string, SelectedMenuItem[]> = {}
    menuSelection.items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    return grouped
  }, [menuSelection?.items])

  // Calculate totals
  const { totalPerPerson, totalBooking, itemCount, baseTotal, tiramisuTotal, tiramisuKg } = useMemo(() => {
    if (!menuSelection?.items) return {
      totalPerPerson: 0,
      totalBooking: 0,
      itemCount: 0,
      baseTotal: 0,
      tiramisuTotal: 0,
      tiramisuKg: 0
    }

    const baseTotal = menuSelection.items
      .filter((item) => !item.name.toLowerCase().includes('tiramis'))
      .reduce((sum, item) => sum + item.price, 0)

    const tiramisuTotal = menuSelection.tiramisu_total || 0
    const tiramisuKg = menuSelection.tiramisu_kg || 0
    const totalBooking = baseTotal * numGuests + tiramisuTotal

    return {
      totalPerPerson: baseTotal,
      totalBooking,
      itemCount: menuSelection.items.length,
      baseTotal,
      tiramisuTotal,
      tiramisuKg
    }
  }, [menuSelection, numGuests, booking.booking_type])

  // Menu summary (always visible)
  const menuSummary = (
    <div className="space-y-1 text-sm">
      <p className="font-semibold text-gray-700">
        {itemCount} {itemCount === 1 ? 'item selezionato' : 'items selezionati'}
      </p>
      <p className="text-gray-600">
        Totale a persona: <span className="font-bold text-gray-900">€{totalPerPerson.toFixed(2)}</span>
      </p>
      <p className="text-gray-600">
        Totale prenotazione: <span className="font-bold text-gray-900">€{totalBooking.toFixed(2)}</span>
        {' '}<span className="text-xs">({numGuests} ospiti)</span>
      </p>
    </div>
  )

  // Menu expanded content (view mode)
  const menuContent = isEditMode ? (
    <>
      {menuPromoMessages.length > 0 && (
        <MenuPromoBannerCards messages={menuPromoMessages} className="mb-4" />
      )}
      <MenuSelection
        selectedItems={menuSelection?.items || []}
        numGuests={numGuests}
        onMenuChange={onMenuChange}
        presetMenu={presetMenu as PresetMenuType}
        staffPresetsDropdownVisible={staffPresetsDropdownVisible}
        customStaffPresets={customStaffPresets}
        onPresetMenuChange={onPresetMenuChange}
        bookingType={resolvedMenuBookingType}
      />
    </>
  ) : (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([category, items]) => {
        const categoryTotal = items.reduce((sum, item) => {
          if (item.name.toLowerCase().includes('tiramis')) {
            return sum + (item.totalPrice || 0)
          }
          return sum + item.price
        }, 0)

        return (
          <div key={category} className="space-y-2">
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>{CATEGORY_ICONS[category] || '📦'}</span>
              <span>{CATEGORY_LABELS[category] || category.toUpperCase()}</span>
              <span className="text-sm text-gray-600">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              <span className="ml-auto text-sm font-bold text-gray-700">€{categoryTotal.toFixed(2)}</span>
            </h4>
            <ul className="space-y-1 pl-6">
              {items.map((item, idx) => {
                const isTiramisu = item.name.toLowerCase().includes('tiramis')
                const displayPrice = isTiramisu && item.totalPrice
                  ? `€${item.totalPrice.toFixed(2)}`
                  : `€${item.price.toFixed(2)}`
                const quantityLabel = isTiramisu && item.quantity
                  ? ` ${item.quantity} Kg -`
                  : ''

                return (
                  <li key={`${item.id}-${idx}`} className="text-sm text-gray-700 flex items-center justify-between">
                    <span>
                      • {item.name}{quantityLabel}
                    </span>
                    <span className="font-semibold">{displayPrice}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}

      {/* Cost Breakdown Summary */}
      {(() => {
        const prezzoPersonaTotal = baseTotal * numGuests
        const totalRinfresco = prezzoPersonaTotal + tiramisuTotal

        return (
          <div className="mt-6 pt-4 border-t-2 border-gray-300">
            <h4 className="text-base font-bold text-gray-900 mb-3">RIEPILOGO COSTI</h4>

            {/* Prezzo a persona × ospiti */}
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-700">
                Prezzo a persona: €{baseTotal.toFixed(2)} × {numGuests} ospiti
              </span>
              <span className="font-bold text-gray-900">€{prezzoPersonaTotal.toFixed(2)}</span>
            </div>

            {/* Tiramisù (only if selected) */}
            {tiramisuTotal > 0 && (
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-700">
                  Tiramisù ({tiramisuKg} Kg)
                </span>
                <span className="font-bold text-gray-900">€{tiramisuTotal.toFixed(2)}</span>
              </div>
            )}

            {/* TOTALE RINFRESCO */}
            <div className="flex justify-between items-center text-base font-bold mt-3 pt-3 border-t border-gray-300">
              <span className="text-gray-900">TOTALE RINFRESCO</span>
              <span className="text-gray-900">€{totalRinfresco.toFixed(2)}</span>
            </div>
          </div>
        )
      })()}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Preset Menu Label (if applicable) */}
      {presetMenu && (
        <div>
          <p className="text-sm font-semibold text-gray-900">
            📋 Menu Predefinito:{' '}
            <span>{getPresetMenuLabel(presetMenu as PresetMenuType, customStaffPresets)}</span>
          </p>
        </div>
      )}

      {/* Collapsible Menu Section */}
      {isEditMode ? (
        // In edit mode, always show MenuSelection (even if no items selected)
        menuContent
      ) : menuSelection?.items && menuSelection.items.length > 0 ? (
        <CollapsibleSection
          title="Menu Selezionato"
          icon="🍽️"
          summary={menuSummary}
          isExpanded={isMenuExpanded}
          onToggle={onMenuExpandToggle}
        >
          {menuContent}
        </CollapsibleSection>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 italic">Nessun menu selezionato</p>
        </div>
      )}
    </div>
  )
}
