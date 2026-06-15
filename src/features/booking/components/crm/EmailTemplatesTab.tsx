import type { FC } from 'react'
import { useState } from 'react'
import { CollapsibleCard } from '@/components/ui'
import { EmailTemplateEditor } from './EmailTemplateEditor'
import { CampaignsManager } from './CampaignsManager'
import { useEmailTemplates } from '@/features/booking/hooks/useEmailTemplates'
import {
  DEFAULT_ACCEPTED_SUBJECT,
  DEFAULT_ACCEPTED_INTRO,
  DEFAULT_ACCEPTED_CLOSING,
  DEFAULT_REJECTED_SUBJECT,
  DEFAULT_REJECTED_INTRO,
  DEFAULT_REJECTED_CLOSING,
} from '@/lib/emailTemplates'

export const EmailTemplatesTab: FC = () => {
  const { data: templates = [], isLoading } = useEmailTemplates()

  // Stato controllato: la card resta aperta indipendentemente da re-render/refetch
  const [acceptedExpanded, setAcceptedExpanded] = useState(false)
  const [rejectedExpanded, setRejectedExpanded] = useState(false)

  const savedAccepted = templates.find((t) => t.template_key === 'booking_accepted')
  const savedRejected = templates.find((t) => t.template_key === 'booking_rejected')

  if (isLoading) {
    return <p className="text-body text-(--color-text-muted)">Caricamento template…</p>
  }

  return (
    <div className="space-y-8">
      {/* ── Email automatiche ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Email automatiche
        </h2>

        <CollapsibleCard
          title="Accetta prenotazione"
          expanded={acceptedExpanded}
          onExpandedChange={setAcceptedExpanded}
          contentClassName="p-5"
        >
          <EmailTemplateEditor
            templateKey="booking_accepted"
            saved={savedAccepted}
            defaultSubject={DEFAULT_ACCEPTED_SUBJECT}
            defaultIntro={DEFAULT_ACCEPTED_INTRO}
            defaultClosing={DEFAULT_ACCEPTED_CLOSING}
            label="Accetta prenotazione"
            bare
          />
        </CollapsibleCard>

        <CollapsibleCard
          title="Rifiuta prenotazione"
          expanded={rejectedExpanded}
          onExpandedChange={setRejectedExpanded}
          contentClassName="p-5"
        >
          <EmailTemplateEditor
            templateKey="booking_rejected"
            saved={savedRejected}
            defaultSubject={DEFAULT_REJECTED_SUBJECT}
            defaultIntro={DEFAULT_REJECTED_INTRO}
            defaultClosing={DEFAULT_REJECTED_CLOSING}
            label="Rifiuta prenotazione"
            bare
          />
        </CollapsibleCard>
      </section>

      <hr className="border-slate-200" />

      {/* ── Email personalizzate ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Email personalizzate
        </h2>
        <CampaignsManager />
      </section>
    </div>
  )
}
