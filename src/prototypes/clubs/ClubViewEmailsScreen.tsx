import { useState } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { Switch } from '@ds/shared/Switch'
import { MailIcon } from '@ds/icons/Icons'

// ─── ClubViewEmailsScreen ─────────────────────────────────────────────────────
// Emails tab on the View Club detail page. Vertical list of email-template
// cards — each row shows title, "Sent when…" descriptor and a "Use global
// email template" Switch. Toggling the switch off reveals the Subject + Body
// editor for an override. Differs from the editor's accordion (one-open) by
// keeping every card visible and using per-card switches.

interface EmailTemplate {
  id: string
  title: string
  description: string
}

const TEMPLATES: EmailTemplate[] = [
  { id: 'application-pending',     title: 'Application Pending',            description: 'Sent when a member applies to join the club' },
  { id: 'signup-confirmation',     title: 'Signup Confirmation',            description: 'Sent when a member completes signup' },
  { id: 'cancellation',            title: 'Cancellation Confirmation',      description: 'Sent when a membership is cancelled' },
  { id: 'hold-confirmation',       title: 'Hold Confirmation',              description: 'Sent when a membership is placed on hold' },
  { id: 'reactivation',            title: 'Re-activation Confirmation',     description: 'Sent when a membership is reactivated' },
  { id: 'membership-update',       title: 'Membership Update Confirmation', description: 'Sent when membership details are updated' },
  { id: 'club-order-shipped',      title: 'Club Order Shipped',             description: 'Sent when a club order is shipped' },
  { id: 'club-order-pickup',       title: 'Club Order Ready for Pickup',    description: 'Sent when an order is ready for pickup' },
  { id: 'club-order-processed',    title: 'Club Order Processed',           description: 'Sent when an order is processed' },
  { id: 'upcoming-club-order',     title: 'Upcoming Club Order',            description: 'Sent before an upcoming club order' },
]

const DEFAULT_SUBJECTS: Record<string, string> = {
  'application-pending': 'Your Application is Pending',
}

interface EmailDraft {
  useGlobal: boolean
  subject: string
  body: string
}

export function ClubViewEmailsScreen() {
  const [drafts, setDrafts] = useState<Record<string, EmailDraft>>(() =>
    Object.fromEntries(
      TEMPLATES.map((t) => [
        t.id,
        // First template starts customised so the override panel is visible
        // on first land — matches the Figma reference state.
        { useGlobal: t.id !== 'application-pending', subject: DEFAULT_SUBJECTS[t.id] ?? '', body: '' },
      ]),
    ),
  )

  function patch(id: string, partial: Partial<EmailDraft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...partial } }))
  }

  return (
    <ClubViewLayout activeTab="emails">
      <SectionCard
        title={
          <div className="flex flex-col gap-1">
            <span>Emails</span>
            <span className="typo-body-sm font-normal text-vintiga-slate-500">
              Edit the emails members receive at each stage of their club membership.
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-vintiga-md">
          {TEMPLATES.map((tmpl) => {
            const draft = drafts[tmpl.id]
            const overridden = !draft.useGlobal

            return (
              <div
                key={tmpl.id}
                className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-vintiga-md px-vintiga-md py-vintiga-sm">
                  <div className="flex items-center gap-vintiga-md min-w-0">
                    <span className="w-9 h-9 rounded-vintiga-md bg-vintiga-indigo-50 text-vintiga-indigo-600 flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                      <MailIcon />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="typo-body-sm font-semibold text-vintiga-slate-900 truncate">
                        {tmpl.title}
                      </span>
                      <span className="typo-caption text-vintiga-slate-500 truncate">
                        {tmpl.description}
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={draft.useGlobal}
                    onChange={(next) => patch(tmpl.id, { useGlobal: next })}
                    labelPosition="right"
                    label={<span className="typo-body-sm text-vintiga-slate-700">Use global email template</span>}
                  />
                </div>

                {/* Override editor */}
                {overridden && (
                  <div className="px-vintiga-md pb-vintiga-md pt-0 flex flex-col gap-vintiga-md border-t border-vintiga-slate-100">
                    <Field label="Subject" required className="pt-vintiga-sm">
                      <TextField
                        value={draft.subject}
                        onChange={(e) => patch(tmpl.id, { subject: e.target.value })}
                        placeholder="Email subject"
                      />
                    </Field>
                    <Field label="Body" required>
                      <Textarea
                        value={draft.body}
                        onChange={(e) => patch(tmpl.id, { body: e.target.value })}
                        placeholder="Email body"
                        className="min-h-[120px]"
                      />
                    </Field>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>
    </ClubViewLayout>
  )
}
