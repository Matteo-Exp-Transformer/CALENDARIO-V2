/** Canonicalizzazione JSON: ordine chiavi e spaziatura non sono semantici nel contratto MSS. */

function sortJson(value) {
  if (Array.isArray(value)) return value.map(sortJson)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortJson(value[key])]),
  )
}

export function canonicalJson(value) {
  return JSON.stringify(sortJson(value))
}

/** Decodifica al confine senza sostituire byte invalidi con U+FFFD. */
export function decodeUtf8(value) {
  if (typeof value === 'string') return value
  if (value == null) return value
  if (value instanceof ArrayBuffer) value = new Uint8Array(value)
  if (ArrayBuffer.isView(value)) {
    return new TextDecoder('utf-8', { fatal: true }).decode(value)
  }
  return String(value)
}
