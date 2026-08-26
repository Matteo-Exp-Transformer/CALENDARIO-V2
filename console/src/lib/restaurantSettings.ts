/**
 * Registro locale delle impostazioni ristorante per la Console.
 *
 * PERCHÉ ESISTE QUESTO FILE:
 *   La fonte di verità è src/features/booking/lib/restaurantSettingRegistry.ts nell'app di
 *   Matteo. La Console NON può importare da ../src (RULE-4). Questo file ricrea — senza
 *   duplicare logica complessa — solo le chiavi e i metadati necessari per:
 *     a) sapere quali chiavi sono nel registro ufficiale (RESTAURANT_SETTING_KEYS_V1)
 *     b) validare lato client i valori prima di inviare callConsoleAdmin
 *     c) mostrare label e default nell'UI
 *
 * CHIAVI DEL REGISTRO UFFICIALE (RESTAURANT_SETTING_KEYS_V1, sola lettura):
 *   restaurant_name, timezone, booking_window_days, slot_guest_capacities,
 *   slot_limit_enabled, booking_reject_out_of_slot, business_hours,
 *   contact_email, contact_phone, contact_address,
 *   public_booking_page_background, public_booking_strip_photo,
 *   booking_staff_presets_visible, booking_custom_staff_presets,
 *   booking_menu_promos, booking_placement_areas, app_theme,
 *   restaurant_default_duration, booking_time_slots_enabled, booking_public_form_config
 *
 * SUBSET ESPOSTO IN UI (F7):
 *   La Console espone un sottoinsieme delle chiavi "numeri tecnici" — quelle la cui
 *   modifica ha effetto immediato e non richiede editor complessi (nessun nested array/object).
 *   Aggiungere altre chiavi = aggiungere una entry in EXPOSED_SETTINGS qui sotto.
 *
 *   Chiavi esposte:
 *   - booking_window_days   : intero 1–365, default 60 — finestra prenotazione pubblica
 *   - slot_limit_enabled    : boolean, default false — interruttore limiti coperti per-fascia
 *   - booking_reject_out_of_slot : boolean, default false — rifiuta prenotazioni fuori fascia
 *   - restaurant_default_duration : intero 30–360, default 90 — durata base prenotazioni admin
 *   - booking_time_slots_enabled : boolean, default true — raggruppa digest in fasce (solo Classic)
 *
 *   Chiavi NON esposte (richiedono editor specializzati, troppo complessi per F7):
 *   - business_hours, slot_guest_capacities, booking_public_form_config,
 *     booking_custom_staff_presets, booking_menu_promos, booking_placement_areas,
 *     public_booking_page_background, public_booking_strip_photo, app_theme,
 *     restaurant_name, timezone, contact_*
 *
 * AGGIUNGERE UNA CHIAVE:
 *   1. Verificare che sia in RESTAURANT_SETTING_KEYS_V1 (src/features/booking/lib/restaurantSettingRegistry.ts).
 *   2. Aggiungere una entry in EXPOSED_SETTINGS con type, label, default e validate.
 *   3. Aggiungere il tipo corrispondente in ExposedSettingValue e il case nell'editor (RestaurantSettingsPanel).
 */

// ---------------------------------------------------------------------------
// Elenco completo delle chiavi del registro ufficiale (RESTAURANT_SETTING_KEYS_V1).
// Aggiornare se Matteo aggiunge chiavi al registro — non aggiungere chiavi inventate.
// ---------------------------------------------------------------------------

export const RESTAURANT_SETTING_KEYS_V1 = [
  'restaurant_name',
  'timezone',
  'booking_window_days',
  'slot_guest_capacities',
  'slot_limit_enabled',
  'booking_reject_out_of_slot',
  'business_hours',
  'contact_email',
  'contact_phone',
  'contact_address',
  'public_booking_page_background',
  'public_booking_strip_photo',
  'booking_staff_presets_visible',
  'booking_custom_staff_presets',
  'booking_menu_promos',
  'booking_placement_areas',
  'app_theme',
  'restaurant_default_duration',
  'booking_time_slots_enabled',
  'booking_public_form_config',
] as const

export type RestaurantSettingKeyV1 = (typeof RESTAURANT_SETTING_KEYS_V1)[number]

/** Verifica che una stringa sia una chiave del registro ufficiale. */
export function isValidSettingKey(key: string): key is RestaurantSettingKeyV1 {
  return (RESTAURANT_SETTING_KEYS_V1 as readonly string[]).includes(key)
}

// ---------------------------------------------------------------------------
// Subset esposto in UI: solo le chiavi con editor semplici (numero intero o boolean).
// ---------------------------------------------------------------------------

/** Definizione di un'impostazione intera. */
interface IntSetting {
  key: RestaurantSettingKeyV1
  type: 'int'
  label: string
  description: string
  defaultValue: number
  /** Validatore: restituisce null se ok, stringa di errore se non valido. */
  validate: (value: unknown) => string | null
}

/** Definizione di un'impostazione booleana. */
interface BoolSetting {
  key: RestaurantSettingKeyV1
  type: 'bool'
  label: string
  description: string
  defaultValue: boolean
  validate: (value: unknown) => string | null
}

export type ExposedSetting = IntSetting | BoolSetting

/** Valore tipizzato per le impostazioni esposte. */
export type ExposedSettingValue = number | boolean

/**
 * Impostazioni esposte nell'UI F7.
 * L'ordine determina l'ordine di visualizzazione nel pannello.
 */
export const EXPOSED_SETTINGS: ExposedSetting[] = [
  {
    key: 'booking_window_days',
    type: 'int',
    label: 'Finestra prenotazione (giorni)',
    description: 'Quanti giorni nel futuro il cliente può prenotare. Min 1, max 365.',
    defaultValue: 60,
    validate: (value) => {
      const n = Number(value)
      if (!Number.isInteger(n)) return 'Deve essere un numero intero'
      if (n < 1) return 'Minimo 1 giorno'
      if (n > 365) return 'Massimo 365 giorni'
      return null
    },
  },
  {
    key: 'restaurant_default_duration',
    type: 'int',
    label: 'Durata base prenotazione (minuti)',
    description: 'Usata quando una prenotazione admin non ha una durata da card, preset o tipologia. Min 30, max 360.',
    defaultValue: 90,
    validate: (value) => {
      const n = Number(value)
      if (!Number.isInteger(n)) return 'Deve essere un numero intero'
      if (n < 30) return 'Minimo 30 minuti'
      if (n > 360) return 'Massimo 360 minuti'
      return null
    },
  },
  {
    key: 'slot_limit_enabled',
    type: 'bool',
    label: 'Limiti coperti per fascia (attivi)',
    description:
      'Se ON: il sistema blocca la prenotazione pubblica quando i coperti della fascia sono esauriti. ' +
      'I limiti per fascia vanno configurati in slot_guest_capacities (editor avanzato, non esposto qui).',
    defaultValue: false,
    validate: (value) => (typeof value === 'boolean' ? null : 'Deve essere true o false'),
  },
  {
    key: 'booking_reject_out_of_slot',
    type: 'bool',
    label: 'Rifiuta prenotazioni fuori fascia',
    description:
      'Se ON: rifiuta la richiesta pubblica il cui orario non cade in nessuna fascia oraria configurata.',
    defaultValue: false,
    validate: (value) => (typeof value === 'boolean' ? null : 'Deve essere true o false'),
  },
  {
    key: 'booking_time_slots_enabled',
    type: 'bool',
    label: 'Raggruppa digest per fasce orarie (Classic)',
    description:
      'Solo per edition Classic: se ON raggruppa le prenotazioni in digest per fasce. ' +
      'In edition Pro è sempre attivo indipendentemente da questa impostazione.',
    defaultValue: true,
    validate: (value) => (typeof value === 'boolean' ? null : 'Deve essere true o false'),
  },
]

/** Mappa chiave → definizione per lookup O(1). */
export const EXPOSED_SETTINGS_MAP: Record<string, ExposedSetting> = Object.fromEntries(
  EXPOSED_SETTINGS.map((s) => [s.key, s]),
)

// ---------------------------------------------------------------------------
// Helper parse dal DB: converte il valore jsonb raw nel tipo atteso per il subset esposto.
// Specchia la logica di parseFromDb dell'app di Matteo per le chiavi esposte.
// ---------------------------------------------------------------------------

/**
 * Converte un valore raw dal DB (jsonb) nel tipo corretto per la setting esposta.
 * Se il valore è null/undefined/non valido, restituisce il default.
 */
export function parseExposedSettingFromDb(
  setting: ExposedSetting,
  raw: unknown,
): ExposedSettingValue {
  if (setting.type === 'int') {
    if (raw == null) return setting.defaultValue
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      const n = Math.floor(raw)
      // Per booking_window_days: clamp 1–365
      if (setting.key === 'booking_window_days') {
        return n >= 1 && n <= 365 ? n : setting.defaultValue
      }
      // Per restaurant_default_duration: clamp 30–360
      if (setting.key === 'restaurant_default_duration') {
        return n >= 30 && n <= 360 ? n : setting.defaultValue
      }
      return n
    }
    if (typeof raw === 'string') {
      const n = parseInt(raw.trim(), 10)
      if (!Number.isNaN(n)) return n
    }
    return setting.defaultValue
  }

  // type === 'bool'
  if (raw == null) return setting.defaultValue
  if (raw === true || raw === 'true') return true
  if (raw === false || raw === 'false') return false
  return setting.defaultValue
}
