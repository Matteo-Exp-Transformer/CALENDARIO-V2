/**
 * Script di test ONE-SHOT per la edge function send-email.
 * Esegui: node scripts/_test-email-once.mjs
 * Elimina dopo il test.
 */
import { createClient } from '@supabase/supabase-js'
import { createCliLogger } from './_cliLog.mjs'

const { log, ok, fail } = createCliLogger('_test-email-once')

const SUPABASE_URL = 'https://docnnernvpyrbwuzzach.supabase.co'
const ANON_KEY = 'sb_publishable_K2xia0LzCfG3tJFlFYL3Jg_gtqZmjtg'
const ADMIN_EMAIL = 'testc@c.com'
const ADMIN_PASSWORD = '123456'
const TENANT_ID = 'c97a2fa5-3675-4578-ad23-654ae71d06a7' // test-classic

const TEST_RECIPIENT_DEFAULT = 'matteo.cavallaro.work@gmail.com'
const RECIPIENT_EMAIL = process.env.TEST_RECIPIENT_EMAIL || TEST_RECIPIENT_DEFAULT

async function main() {
  log('=== Test send-email edge function ===')
  log('Target edge function', { url: SUPABASE_URL })
  log('Recipient configurato', { email: RECIPIENT_EMAIL })
  log('')

  const supabase = createClient(SUPABASE_URL, ANON_KEY)

  // 1. Login via SDK (gestisce sb_publishable_* correttamente)
  log('1. Login account TEST (test-classic)...')
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })

  if (loginErr || !loginData?.session?.access_token) {
    fail('Login fallito', loginErr ?? loginData, 1)
  }

  const token = loginData.session.access_token
  ok('Login', { email: loginData.user?.email })
  log('')

  const TEMPLATES = [
    {
      label: 'booking_accepted',
      subject: '[TEST] Prenotazione confermata',
      html: `<p>Ciao <strong>Mario Rossi</strong>,</p><p>La tua prenotazione del <strong>20 Giugno 2026 alle ore 20:00</strong> è stata confermata.</p><p>A presto,<br><strong>Lo staff</strong><br><strong>Al Ritrovo</strong></p>`,
    },
    {
      label: 'booking_rejected',
      subject: '[TEST] Prenotazione non disponibile',
      html: `<p>Ciao <strong>Mario Rossi</strong>,</p><p>Purtroppo la tua richiesta per il <strong>20 Giugno 2026</strong> non può essere confermata.</p><p>Cordiali saluti,<br><strong>Lo staff</strong></p>`,
    },
  ]

  let allOk = true

  for (const tpl of TEMPLATES) {
    log(`2. Invio template: ${tpl.label}`)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': ANON_KEY,
        },
        body: JSON.stringify({
          tenantId: TENANT_ID,
          to: RECIPIENT_EMAIL,
          subject: tpl.subject,
          html: tpl.html,
          emailType: tpl.label,
        }),
      })

      const rawText = await res.text()
      log('Risposta edge function', { status: res.status, body: rawText.slice(0, 200) })

      let data = {}
      try { data = JSON.parse(rawText) } catch { data = { parseError: rawText } }

      if (res.ok && data.success) {
        ok('Invio completato', { messageId: data.messageId ?? 'n/a' })
      } else {
        fail('Invio fallito', { body: data })
        allOk = false
      }
    } catch (err) {
      fail('Eccezione durante l\'invio', err)
      allOk = false
    }
    log('')
    // piccolo delay tra chiamate per evitare rate limiting Brevo
    await new Promise(r => setTimeout(r, 1000))
  }

  log('=== Risultato ===')
  if (allOk) {
    ok('Tutti e 2 i template inviati con successo (conferma + rifiuto).')
    log('Controlla la casella di posta configurata', { email: RECIPIENT_EMAIL })
    log('Poi imposta VITE_ENABLE_SEND_EMAIL=false in .env.local')
  } else {
    fail('Uno o più invii falliti. Controlla il log sopra.', 1)
  }

  await supabase.auth.signOut()
}

main().catch(err => {
  fail('Errore inatteso', err, 1)
})
