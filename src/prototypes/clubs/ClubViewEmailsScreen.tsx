import { ClubViewLayout } from './ClubViewLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { MailIcon, ArrowRightIcon } from '@ds/icons/Icons'

// ─── ClubViewEmailsScreen ─────────────────────────────────────────────────────
// Emails tab on the View Club detail page. Mirrors the simplified template
// list from the editor (Figma 5079:57000) — clicking a row would open the
// per-template editor in a future revision (deferred per the May 7 meeting
// pending pocket-flow investigation).

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

export function ClubViewEmailsScreen() {
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
        <div className="flex flex-col gap-vintiga-sm">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => {}}
              className="w-full bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-lg px-vintiga-md py-vintiga-sm flex items-center gap-vintiga-md text-left hover:border-vintiga-slate-300 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              <span className="w-9 h-9 rounded-md bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
                <MailIcon />
              </span>
              <span className="flex-1 min-w-0 flex flex-col">
                <span className="typo-body-sm font-semibold text-vintiga-slate-900 truncate">{tmpl.title}</span>
                <span className="typo-caption text-vintiga-slate-500 truncate">{tmpl.description}</span>
              </span>
              <ArrowRightIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </SectionCard>
    </ClubViewLayout>
  )
}
