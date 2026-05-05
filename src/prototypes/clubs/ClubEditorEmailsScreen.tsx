import { useState } from 'react'
import { ClubEditorLayout } from './ClubEditorLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { Checkbox } from '@ds/shared/Checkbox'
import { MailIcon, ChevronDownIcon } from '@ds/icons/Icons'

// ─── ClubEditorEmailsScreen ───────────────────────────────────────────────────
// Shared by all club types — accordion list of email templates members receive
// at each stage of their membership. One row expands at a time to edit subject
// + body.

interface EmailTemplate {
  id: string
  title: string
  description: string
}

const TEMPLATES: EmailTemplate[] = [
  { id: 'application-pending',     title: 'Application Pending',          description: 'Sent when a member applies to join the club' },
  { id: 'signup-confirmation',     title: 'Signup Confirmation',          description: 'Sent when a member completes signup' },
  { id: 'cancellation',            title: 'Cancellation Confirmation',    description: 'Sent when a membership is cancelled' },
  { id: 'hold-confirmation',       title: 'Hold Confirmation',            description: 'Sent when a membership is placed on hold' },
  { id: 'reactivation',            title: 'Re-activation Confirmation',   description: 'Sent when a membership is reactivated' },
  { id: 'membership-update',       title: 'Membership Update Confirmation', description: 'Sent when membership details are updated' },
  { id: 'club-order-shipped',      title: 'Club Order Shipped',           description: 'Sent when a club order is shipped' },
  { id: 'club-order-pickup',       title: 'Club Order Ready for Pickup',  description: 'Sent when an order is ready for pickup' },
  { id: 'club-order-processed-1',  title: 'Club Order Processed',         description: 'Sent when an order is processed' },
  { id: 'club-order-processed-2',  title: 'Club Order Processed',         description: 'Sent when an order is processed' },
  { id: 'upcoming-club-order',     title: 'Upcoming Club Order',          description: 'Sent before an upcoming club order' },
]

interface EmailDraft {
  useGlobal: boolean
  subject: string
  body: string
}

const DEFAULT_SUBJECTS: Record<string, string> = {
  'application-pending': 'Your Application is Pending',
}

export function ClubEditorEmailsScreen() {
  // First template is expanded by default — matches the Figma reference.
  const [openId, setOpenId] = useState<string>('application-pending')
  const [drafts, setDrafts] = useState<Record<string, EmailDraft>>(() =>
    Object.fromEntries(
      TEMPLATES.map((t) => [
        t.id,
        { useGlobal: false, subject: DEFAULT_SUBJECTS[t.id] ?? '', body: '' },
      ]),
    ),
  )

  function patch(id: string, partial: Partial<EmailDraft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...partial } }))
  }

  return (
    <ClubEditorLayout activeTab="emails">
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
        <div className="flex flex-col">
          {TEMPLATES.map((tmpl, idx) => {
            const isOpen = tmpl.id === openId
            const draft  = drafts[tmpl.id]

            return (
              <div
                key={tmpl.id + idx}
                className={[
                  'border-b border-vintiga-slate-200 last:border-b-0',
                  isOpen ? 'bg-vintiga-slate-50' : 'bg-vintiga-white',
                ].join(' ')}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : tmpl.id)}
                  className="w-full flex items-center justify-between gap-vintiga-md px-vintiga-md py-vintiga-sm bg-transparent border-none cursor-pointer text-left hover:bg-vintiga-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
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
                  <ChevronDownIcon
                    className={[
                      'w-4 h-4 text-vintiga-slate-500 shrink-0 transition-transform',
                      isOpen ? 'rotate-180' : '',
                    ].join(' ')}
                  />
                </button>

                {/* Body */}
                {isOpen && (
                  <div className="px-vintiga-md pt-vintiga-sm pb-vintiga-md flex flex-col gap-vintiga-md">
                    <Checkbox
                      checked={draft.useGlobal}
                      onChange={(next) => patch(tmpl.id, { useGlobal: next })}
                      label="Use global email template"
                    />
                    <Field label="Subject" required>
                      <TextField
                        value={draft.subject}
                        onChange={(e) => patch(tmpl.id, { subject: e.target.value })}
                        disabled={draft.useGlobal}
                      />
                    </Field>
                    <Field label="Body" required>
                      <Textarea
                        value={draft.body}
                        onChange={(e) => patch(tmpl.id, { body: e.target.value })}
                        disabled={draft.useGlobal}
                        className="min-h-[80px]"
                      />
                    </Field>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>
    </ClubEditorLayout>
  )
}
