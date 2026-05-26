import { describe, expect, it } from 'vitest'
import {
  customPresetStorageId,
  resolvePresetDisplayTitle,
  shouldShowComposeMenuHeader,
  type CustomStaffPreset,
} from '../presetMenus'

const composablePreset: CustomStaffPreset = {
  id: 'preset-a',
  name: 'Menù Pranzo o Cena',
  description: 'menu pranzo o cena a partire da 18 € !',
  item_ids: ['item-1'],
  booking_types: ['menu_prezzo_fisso', 'rinfresco_laurea'],
  is_fixed_menu: false,
}

const fixedPreset: CustomStaffPreset = {
  ...composablePreset,
  id: 'preset-b',
  name: 'Menù Aperitivo',
  is_fixed_menu: true,
}

describe('shouldShowComposeMenuHeader', () => {
  it('shows compose title for personalizzabile staff preset on any booking tab', () => {
    const storageId = customPresetStorageId(composablePreset.id)
    expect(
      shouldShowComposeMenuHeader(storageId, composablePreset, 'menu_prezzo_fisso'),
    ).toBe(true)
    expect(
      shouldShowComposeMenuHeader(storageId, composablePreset, 'rinfresco_laurea'),
    ).toBe(true)
  })

  it('shows preset title branch for fixed staff preset even on rinfresco tab', () => {
    const storageId = customPresetStorageId(fixedPreset.id)
    expect(
      shouldShowComposeMenuHeader(storageId, fixedPreset, 'rinfresco_laurea'),
    ).toBe(false)
    expect(
      shouldShowComposeMenuHeader(storageId, fixedPreset, 'menu_prezzo_fisso'),
    ).toBe(false)
  })

  it('shows compose title on rinfresco only when no preset selected yet', () => {
    expect(shouldShowComposeMenuHeader(null, undefined, 'rinfresco_laurea')).toBe(true)
    expect(shouldShowComposeMenuHeader(null, undefined, 'menu_prezzo_fisso')).toBe(false)
  })
})

describe('resolvePresetDisplayTitle', () => {
  it('prefers sub tab label override over preset name', () => {
    const storageId = customPresetStorageId(composablePreset.id)
    expect(
      resolvePresetDisplayTitle(storageId, [composablePreset], [
        { preset_id: composablePreset.id, custom_label: 'Etichetta card' },
      ]),
    ).toBe('Etichetta card')
  })
})
