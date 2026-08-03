
/**
 * Configurazione di una fascia oraria dinamica (N fasce, non più 3 fisse).
 * Usa `id` (service_slots.id) come chiave nei calcoli capacity.
 */
export type SlotConfig = {
  id: string
  name: string
  start_time: string  // HH:mm
  end_time: string    // HH:mm
  display_order: number
  is_canonical: boolean
  slot_color?: string | null
}

/** Ritorna l'etichetta UI di una fascia: "Nome HH:mm - HH:mm" */
export function getSlotLabel(slot: Pick<SlotConfig, 'name' | 'start_time' | 'end_time'>): string {
  return `${slot.name} ${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`
}

/**
 * Forma minima richiesta da validateSlotConfigs: solo i campi che la validazione usa
 * davvero. Permette a un editor che lavora su un array più ricco (o più povero, purché
 * abbia questi tre campi) di passarlo senza costruire un SlotConfig completo — es. la
 * "fascia in bozza" di ServiceSlotsManager non ha ancora un id reale.
 */
export type SlotValidationInput = Pick<SlotConfig, 'name' | 'start_time' | 'end_time'>

export interface ValidateSlotConfigsOptions {
  /**
   * Indice della fascia "in bozza" nell'array (revisione senior FIX C, 03-08-26).
   *
   * Senza `focusIndex` (Impostazioni → Imposta Fasce Orarie): l'intero array è editabile
   * nella stessa schermata, quindi TUTTE le fasce vengono validate — sia i controlli
   * per-singola-fascia (formato, inizio≠fine) sia quelli fra coppie (nome duplicato,
   * sovrapposizione). Un errore lì è sempre azionabile dall'utente.
   *
   * Con `focusIndex` (Servizio → Fasce orarie, un editor per fascia): chi apre "Modifica
   * fascia" non è responsabile delle ALTRE fasce già a DB — che possono essere legacy e
   * invalide proprio perché fino a stasera Servizio non le bloccava (nomi duplicati,
   * inizio==fine: nessun editor li controllava prima del FIX C). Senza questo parametro,
   * una fascia legacy rotta impedirebbe di salvare QUALSIASI altra fascia con un errore
   * che nomina una fascia non modificabile da quella modale — sembrerebbe il fix rotto.
   * Con `focusIndex`: i controlli per-singola-fascia valgono SOLO sulla bozza; i controlli
   * fra coppie valgono SOLO per le coppie che coinvolgono la bozza. Le altre fasce
   * dell'array non vengono validate per conto proprio.
   */
  focusIndex?: number
}

/**
 * Valida un array di fasce: formato orari, nomi univoci, no inizio=fine, no sovrapposizioni.
 * Ritorna stringa di errore o null.
 *
 * FIX C (03-08-26, D-C): unica fonte di verità per Impostazioni → Imposta Fasce Orarie
 * (RestaurantSettingsTab) E Servizio → Fasce orarie (ServiceSlotsManager). Prima ognuno
 * reimplementava un sottoinsieme diverso di questi controlli — Servizio non bloccava
 * nome duplicato né inizio==fine. Chi valida una fascia sola (non un array intero, come
 * l'editor di Servizio) costruisce "l'array come sarebbe dopo il salvataggio" e lo passa
 * qui, con `options.focusIndex` — non duplicare questa logica nel componente.
 */
export function validateSlotConfigs(
  slots: SlotValidationInput[],
  options?: ValidateSlotConfigsOptions,
): string | null {
  if (slots.length === 0) return 'Almeno una fascia oraria è richiesta'
  const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/
  const focusIndex = options?.focusIndex

  if (focusIndex === undefined) {
    // Modalità array intero (Impostazioni): invariata rispetto a prima del FIX C.
    const names = new Set<string>()
    for (const slot of slots) {
      if (!HH_MM.test(slot.start_time)) return `Fascia "${slot.name}": orario inizio non valido`
      if (!HH_MM.test(slot.end_time)) return `Fascia "${slot.name}": orario fine non valido`
      if (slot.start_time === slot.end_time) return `Fascia "${slot.name}": inizio e fine coincidono`
      const key = slot.name.trim().toLowerCase()
      if (names.has(key)) return `Nome fascia duplicato: "${slot.name}"`
      names.add(key)
    }
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (slotRangesOverlap(slots[i].start_time, slots[i].end_time, slots[j].start_time, slots[j].end_time)) {
          return `Le fasce "${slots[i].name}" e "${slots[j].name}" si sovrappongono`
        }
      }
    }
    return null
  }

  // Modalità "bozza" (Servizio): valida SOLO la fascia a focusIndex e le sue coppie con
  // le altre — mai le altre fasce fra loro (potrebbero essere dati legacy invalidi che
  // questa schermata non può correggere).
  const focus = slots[focusIndex]
  if (!focus) return null
  if (!HH_MM.test(focus.start_time)) return `Fascia "${focus.name}": orario inizio non valido`
  if (!HH_MM.test(focus.end_time)) return `Fascia "${focus.name}": orario fine non valido`
  if (focus.start_time === focus.end_time) return `Fascia "${focus.name}": inizio e fine coincidono`

  const focusKey = focus.name.trim().toLowerCase()
  for (let i = 0; i < slots.length; i++) {
    if (i === focusIndex) continue
    const other = slots[i]
    if (other.name.trim().toLowerCase() === focusKey) {
      return `Nome fascia duplicato: "${focus.name}"`
    }
    if (slotRangesOverlap(focus.start_time, focus.end_time, other.start_time, other.end_time)) {
      return `Le fasce "${focus.name}" e "${other.name}" si sovrappongono`
    }
  }
  return null
}

/** end_time < start_time → fascia che attraversa la mezzanotte */
export function slotCrossesMidnight(slot: Pick<SlotConfig, 'start_time' | 'end_time'>): boolean {
  return slot.end_time.slice(0, 5) < slot.start_time.slice(0, 5)
}

/** Avviso UI quando fine < inizio (orario nel giorno successivo). */
export const OVERNIGHT_TIME_END_HINT =
  "Orario notturno — l'orario di fine cade nel giorno successivo."

export function parseHmToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

type MinuteRange = [number, number]

function toDaySegments(start: number, end: number): MinuteRange[] {
  // Fascia che attraversa la mezzanotte: es. 18:00 -> 03:00
  if (end < start) return [[start, 24 * 60], [0, end]]
  return [[start, end]]
}

function rangesOverlap(a: MinuteRange, b: MinuteRange): boolean {
  return a[0] < b[1] && b[0] < a[1]
}

export function slotRangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  const aSegments = toDaySegments(parseHmToMinutes(aStart), parseHmToMinutes(aEnd))
  const bSegments = toDaySegments(parseHmToMinutes(bStart), parseHmToMinutes(bEnd))
  for (const a of aSegments) {
    for (const b of bSegments) {
      if (rangesOverlap(a, b)) return true
    }
  }
  return false
}

export function isTimeInsideSlot(time: string, slotStart: string, slotEnd: string): boolean {
  const t = parseHmToMinutes(time)
  const start = parseHmToMinutes(slotStart)
  const end = parseHmToMinutes(slotEnd)
  if (end < start) {
    return t >= start || t <= end
  }
  return t >= start && t <= end
}

// ─── S3: Intervalli di arrivo ─────────────────────────────────────────────────

export interface ArrivalSlotConfig {
  slot_start: string
  slot_end: string
  arrival_step_minutes: number
  /** Durata card/tipologia risolta — usata per filtro "ultimo arrivo utile" */
  card_duration_minutes?: number
  /** Pavimento fascia (min_duration) — fallback se card non ha durata */
  slot_min_duration?: number
  /** Anticipo minimo dalla ora corrente (default 60 min, D20) */
  cutoff_minutes?: number
  /** Toggle tardivo (default false, D16) */
  late_arrival_allowed?: boolean
  /** Pavimento tardivo: min di ordine garantito (default 45, D16) */
  min_order_time_minutes?: number
}

export interface ArrivalTime {
  time: string
  /** false → slot da nascondere (cutoff scaduto o durata insufficiente) */
  isValid: boolean
}

/**
 * Genera gli slot di arrivo step-aligned per una fascia.
 * Pura e deterministica: zero import Supabase, testabile in isolamento (S3/D18).
 *
 * @param nowMinutes  Minuti dalla mezzanotte dell'ora corrente (per cutoff oggi).
 * @param isToday     true se la data scelta è oggi (attiva il filtro cutoff).
 */
export function deriveArrivalTimes(
  config: ArrivalSlotConfig,
  nowMinutes: number,
  isToday: boolean,
): ArrivalTime[] {
  const {
    slot_start,
    slot_end,
    arrival_step_minutes: step,
    card_duration_minutes,
    slot_min_duration,
    cutoff_minutes = 60,
    late_arrival_allowed = false,
    min_order_time_minutes = 45,
  } = config

  const hhmm = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/
  if (!hhmm.test(slot_start) || !hhmm.test(slot_end)) return []
  if (!Number.isInteger(step) || step < 5 || step > 120) return []
  if (!Number.isFinite(nowMinutes) || !Number.isFinite(cutoff_minutes)) return []
  if (card_duration_minutes != null && (!Number.isFinite(card_duration_minutes) || card_duration_minutes < 0)) return []
  if (slot_min_duration != null && (!Number.isFinite(slot_min_duration) || slot_min_duration < 0)) return []
  if (!Number.isFinite(min_order_time_minutes) || min_order_time_minutes < 0) return []

  const startMin = parseHmToMinutes(slot_start)
  let endMin = parseHmToMinutes(slot_end)

  // Overnight: end <= start → aggiunge 24h per confronti lineari
  if (endMin <= startMin) endMin += 24 * 60

  const effectiveDuration = card_duration_minutes ?? slot_min_duration ?? 0

  const times: ArrivalTime[] = []
  let current = startMin

  while (current < endMin) {
    const displayMin = current % (24 * 60)
    const h = Math.floor(displayMin / 60)
    const m = displayMin % 60
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

    // Cutoff: solo oggi, l'orario deve essere almeno cutoff_minutes nel futuro
    const cutoffOk = !isToday || current >= nowMinutes + cutoff_minutes

    // Durata: il cliente deve avere abbastanza tempo nel slot
    // Con tardivo ON: basta che arrivi entro (slot_end - min_order_time)
    const durationOk = late_arrival_allowed
      ? current + min_order_time_minutes <= endMin
      : current + effectiveDuration <= endMin

    times.push({ time, isValid: cutoffOk && durationOk })
    current += step
  }

  return times
}
