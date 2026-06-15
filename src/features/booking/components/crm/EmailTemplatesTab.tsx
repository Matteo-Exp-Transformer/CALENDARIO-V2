import type { FC } from 'react'
import { useState } from 'react'
import { Button, Modal, Input, Label, Textarea } from '@/components/ui'
import { toast } from 'react-toastify'
import { EmailTemplateEditor } from './EmailTemplateEditor'
import { PromoRecipientPicker } from './PromoRecipientPicker'
import { useEmailTemplates } from '@/features/booking/hooks/useEmailTemplates'
import { useUpsertEmailTemplate } from '@/features/booking/hooks/useEmailTemplateMutations'
import { useDeleteEmailTemplate } from '@/features/booking/hooks/useEmailTemplateMutations'
import { useSendPromoEmail } from '@/features/booking/hooks/useSendPromoEmail'
import {
  DEFAULT_ACCEPTED_SUBJECT,
  DEFAULT_ACCEPTED_INTRO,
  DEFAULT_ACCEPTED_CLOSING,
  DEFAULT_REJECTED_SUBJECT,
  DEFAULT_REJECTED_INTRO,
  DEFAULT_REJECTED_CLOSING,
} from '@/lib/emailTemplates'
import { areEmailNotificationsEnabled } from '@/features/booking/hooks/useEmailNotifications'

export const EmailTemplatesTab: FC = () => {
  const { data: templates = [], isLoading } = useEmailTemplates()

  const savedAccepted = templates.find((t) => t.template_key === 'booking_accepted')
  const savedRejected = templates.find((t) => t.template_key === 'booking_rejected')
  const savedPromo = templates.find((t) => t.template_key === 'promo')

  // Stato promo
  const [promoSubject, setPromoSubject] = useState(savedPromo?.subject ?? '')
  const [promoBody, setPromoBody] = useState(savedPromo?.intro ?? '')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)

  const upsertPromo = useUpsertEmailTemplate()
  const deletePromo = useDeleteEmailTemplate()
  const sendPromo = useSendPromoEmail()

  const emailsEnabled = areEmailNotificationsEnabled()

  const handleSavePromo = () => {
    upsertPromo.mutate(
      {
        template_key: 'promo',
        subject: promoSubject.trim() || null,
        intro: promoBody.trim() || null,
        closing: null,
      },
      {
        onSuccess: () => toast.success('Bozza promo salvata'),
        onError: (e) => toast.error(`Errore: ${e.message}`),
      },
    )
  }

  const handleResetPromo = () => {
    deletePromo.mutate('promo', {
      onSuccess: () => {
        setPromoSubject('')
        setPromoBody('')
        toast.success('Promo ripristinata ai valori vuoti')
      },
      onError: (e) => toast.error(`Errore: ${e.message}`),
    })
  }

  const handleRecipientsConfirmed = (recipients: string[]) => {
    setSelectedRecipients(recipients)
    if (recipients.length > 0) setConfirmOpen(true)
  }

  const handleSendPromo = () => {
    setConfirmOpen(false)
    sendPromo.mutate(
      {
        subject: promoSubject.trim(),
        body: promoBody.trim(),
        recipients: selectedRecipients,
      },
      {
        onSuccess: ({ sent, failed }) => {
          if (failed === 0) {
            toast.success(`${sent} email inviata${sent !== 1 ? 'e' : ''} con successo`)
          } else {
            toast.warn(`${sent} inviate, ${failed} fallite`)
          }
          setSelectedRecipients([])
        },
        onError: (e) => toast.error(e.message),
      },
    )
  }

  if (isLoading) {
    return <p className="text-body text-(--color-text-muted)">Caricamento template…</p>
  }

  return (
    <div className="space-y-8">
      {/* ── Accetta ── */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
          Email — Accetta prenotazione
        </h2>
        <EmailTemplateEditor
          templateKey="booking_accepted"
          saved={savedAccepted}
          defaultSubject={DEFAULT_ACCEPTED_SUBJECT}
          defaultIntro={DEFAULT_ACCEPTED_INTRO}
          defaultClosing={DEFAULT_ACCEPTED_CLOSING}
          label="Accetta prenotazione"
        />
      </section>

      {/* ── Rifiuta ── */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
          Email — Rifiuta prenotazione
        </h2>
        <EmailTemplateEditor
          templateKey="booking_rejected"
          saved={savedRejected}
          defaultSubject={DEFAULT_REJECTED_SUBJECT}
          defaultIntro={DEFAULT_REJECTED_INTRO}
          defaultClosing={DEFAULT_REJECTED_CLOSING}
          label="Rifiuta prenotazione"
        />
      </section>

      {/* ── Promo ── */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
          Email promo / offerte
        </h2>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          {!emailsEnabled && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Invio disabilitato — imposta <code>VITE_ENABLE_SEND_EMAIL=true</code> in{' '}
              <code>.env.local</code> per attivare l'invio reale.
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="promo-subject">Oggetto</Label>
            <Input
              id="promo-subject"
              value={promoSubject}
              onChange={(e) => setPromoSubject(e.target.value)}
              placeholder="Es: Speciale fine settimana — prenota ora!"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="promo-body">Corpo del messaggio</Label>
            <Textarea
              id="promo-body"
              value={promoBody}
              onChange={(e) => setPromoBody(e.target.value)}
              placeholder="Scrivi il messaggio promo…"
              rows={5}
            />
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500">
            In fondo all'email verrà aggiunta automaticamente la nota:{' '}
            <em>
              "Hai ricevuto questa email perché sei nostro cliente. Per non riceverne più,
              contattaci."
            </em>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setPickerOpen(true)}
              disabled={!promoSubject.trim() || !promoBody.trim() || sendPromo.isPending}
            >
              Scegli destinatari e invia…
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSavePromo}
              disabled={upsertPromo.isPending}
            >
              {upsertPromo.isPending ? 'Salvataggio…' : 'Salva bozza'}
            </Button>
            {savedPromo && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleResetPromo}
                disabled={deletePromo.isPending}
              >
                Svuota bozza
              </Button>
            )}
          </div>

          {sendPromo.isPending && (
            <p className="text-sm text-slate-500 animate-pulse">
              Invio in corso… ({selectedRecipients.length} destinatari)
            </p>
          )}
        </div>
      </section>

      {/* Picker destinatari */}
      <PromoRecipientPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleRecipientsConfirmed}
      />

      {/* Modale conferma invio */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Conferma invio promo">
        <div className="space-y-4">
          <p className="text-slate-700">
            Stai per inviare la promo a{' '}
            <strong>{selectedRecipients.length}</strong> destinatar
            {selectedRecipients.length === 1 ? 'io' : 'i'}.
          </p>
          <p className="text-sm text-slate-500">
            Oggetto: <em>{promoSubject}</em>
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setConfirmOpen(false)}
            >
              Annulla
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSendPromo}>
              Invia ora
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
