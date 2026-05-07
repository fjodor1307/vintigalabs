import type { ReactNode } from 'react'
import { ClubEditorLayout } from './ClubEditorLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { MailIcon, ArrowRightIcon } from '@ds/icons/Icons'

// ─── ClubEditorEmailsScreen ───────────────────────────────────────────────────
// Shared by all club types — list of email templates members receive at each
// stage of their membership (Figma 5079:57000 / 5079:55546 / 5079:58010).
//
// The editor for an individual template is **deferred** — per the May 7
// meeting, "email configuration will be developed in a subsequent issue
// pending pocket-flow investigation". For now the rows are inert; clicking
// would open the editor in a future revision.

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
  { id: 'club-order-processed-1', title: 'Club Order Processed',           description: 'Sent when an order is processed' },
  { id: 'club-order-processed-2', title: 'Club Order Processed',           description: 'Sent when an order is processed' },
  { id: 'upcoming-club-order',     title: 'Upcoming Club Order',            description: 'Sent before an upcoming club order' },
]

function EmailTemplateRow({ template }: { template: EmailTemplate }) {
  return (
    <button
      type="button"
      onClick={() => {}}
      className="w-full bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-lg px-vintiga-md py-vintiga-sm flex items-center gap-vintiga-md text-left hover:border-vintiga-slate-300 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
    >
      <span className="w-9 h-9 rounded-md bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
        <MailIcon />
      </span>
      <span className="flex-1 min-w-0 flex flex-col">
        <span className="typo-body-sm font-semibold text-vintiga-slate-900 truncate">{template.title}</span>
        <span className="typo-caption text-vintiga-slate-500 truncate">{template.description}</span>
      </span>
      <ArrowRightIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0" aria-hidden="true" />
    </button>
  )
}

function EmailsList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-vintiga-sm">{children}</div>
}

export function ClubEditorEmailsScreen() {
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
        <EmailsList>
          {TEMPLATES.map((t) => (
            <EmailTemplateRow key={t.id} template={t} />
          ))}
        </EmailsList>
      </SectionCard>
    </ClubEditorLayout>
  )
}
