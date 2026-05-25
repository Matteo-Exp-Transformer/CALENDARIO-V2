import React from 'react'
import type { CustomStaffPreset, PresetMenuType } from '@/features/booking/constants/presetMenus'
import type { BookingType } from '@/types/booking'
import { BookingSubTabStrip } from './BookingSubTabStrip'

interface BookingPresetPickerProps {
  presets: CustomStaffPreset[]
  bookingType: BookingType
  activePreset: PresetMenuType
  onPresetChange: (preset: PresetMenuType) => void
  staffPresetsDropdownVisible: boolean
}

export const BookingPresetPicker: React.FC<BookingPresetPickerProps> = ({
  presets,
  bookingType,
  activePreset,
  onPresetChange,
  staffPresetsDropdownVisible,
}) => {
  if (!staffPresetsDropdownVisible) return null

  // Ricava l'id del preset attivo (null se null o built-in)
  const activeCustomPresetId =
    activePreset && typeof activePreset === 'string' && activePreset.startsWith('custom-')
      ? activePreset.replace('custom-', '')
      : null

  const handleChange = (presetId: string | null) => {
    if (presetId === null) {
      onPresetChange(null)
    } else {
      onPresetChange(`custom-${presetId}` as PresetMenuType)
    }
  }

  return (
    <div className="w-full space-y-2">
      <p className="text-xs font-semibold text-warm-wood-dark bg-white/70 backdrop-blur-[1px] px-3 py-1.5 rounded-lg inline-block">
        Menu consigliati
      </p>
      <BookingSubTabStrip
        presets={presets}
        bookingType={bookingType}
        activePresetId={activeCustomPresetId}
        onChange={handleChange}
      />
    </div>
  )
}
