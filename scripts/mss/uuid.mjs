import { randomBytes } from 'node:crypto'

/**
 * Genera un UUID versione 7 (RFC 9562) — non usare crypto.randomUUID() che emette v4.
 * @param {number} [nowMs] timestamp Unix in millisecondi (iniettabile per test)
 * @param {Buffer} [entropy] 10 byte casuali (iniettabili per test golden)
 */
export function generateUuidV7(nowMs = Date.now(), entropy = randomBytes(10)) {
  if (entropy.length < 10) {
    throw new Error('UUIDv7 entropy must be at least 10 bytes')
  }
  const bytes = Buffer.alloc(16)
  const timestamp = BigInt(nowMs) & 0xffffffffffffn
  bytes[0] = Number((timestamp >> 40n) & 0xffn)
  bytes[1] = Number((timestamp >> 32n) & 0xffn)
  bytes[2] = Number((timestamp >> 24n) & 0xffn)
  bytes[3] = Number((timestamp >> 16n) & 0xffn)
  bytes[4] = Number((timestamp >> 8n) & 0xffn)
  bytes[5] = Number(timestamp & 0xffn)
  bytes[6] = (entropy[0] & 0x0f) | 0x70
  bytes[7] = entropy[1]
  bytes[8] = (entropy[2] & 0x3f) | 0x80
  bytes[9] = entropy[3]
  bytes[10] = entropy[4]
  bytes[11] = entropy[5]
  bytes[12] = entropy[6]
  bytes[13] = entropy[7]
  bytes[14] = entropy[8]
  bytes[15] = entropy[9]
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** Prefissi contrattuali: mss-rec-, mss-ses-, mss-cor-, mss-evt-, mss-ann- */
export function prefixedId(prefix, uuid) {
  return `${prefix}${uuid}`
}

export function newMssIds({ nowMs, entropy, ids = {} } = {}) {
  const make = (prefix, key) => prefixedId(prefix, ids[key] || generateUuidV7(nowMs, entropy))
  return {
    session_id: make('mss-ses-', 'session'),
    correlation_id: make('mss-cor-', 'correlation'),
    record_event: make('mss-rec-', 'recordEvent'),
    record_persona: make('mss-rec-', 'recordPersona'),
    record_sistema: make('mss-rec-', 'recordSistema'),
    record_output: make('mss-rec-', 'recordOutput'),
    event_id: make('mss-evt-', 'event'),
    ann_persona: make('mss-ann-', 'annPersona'),
    ann_sistema: make('mss-ann-', 'annSistema'),
    ann_output: make('mss-ann-', 'annOutput'),
  }
}
