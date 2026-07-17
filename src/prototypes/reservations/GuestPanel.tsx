import { type ReactNode } from 'react'
import { Avatar } from '@ds/shared/Avatar'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import {
  WineIcon,
  StoreIcon,
  SmileIcon,
  StarIcon,
  SearchIcon,
  PlusIcon,
  XIcon,
} from '@ds/icons/Icons'
import type { Reservation } from './reservationSamples'

// ─── GuestPanel ───────────────────────────────────────────────────────────────
// "Get To Know {guest}" — the slide-in customer-insight panel opened from a
// reservation's bulb action. Identity + loyalty, four preference cards, a
// Most-Purchased section, and Notes. Rebuilt from the legacy panel in Vintiga
// tokens.

export function GuestPanel({ guest, onClose }: { guest: Reservation; onClose: () => void }) {
  const first = guest.name.split(' ')[0]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <aside className="relative w-[640px] max-w-full h-full bg-vintiga-white shadow-vintiga-xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-vintiga-md p-vintiga-lg">
          <h2 className="typo-title-section font-semibold text-vintiga-slate-900">Get To Know {first}</h2>
          <IconButton variant="outline" size="sm" icon={<XIcon />} aria-label="Close" onClick={onClose} />
        </div>

        <div className="px-vintiga-lg pb-vintiga-lg flex flex-col gap-vintiga-lg">
          {/* Identity + loyalty */}
          <div className="flex items-start justify-between gap-vintiga-lg">
            <div className="flex items-start gap-vintiga-md min-w-0">
              <Avatar name={guest.name} initials={guest.initials} src={guest.avatarUrl} size="xl" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="typo-body-lg font-semibold text-vintiga-slate-900">{guest.name}</span>
                <a href={`mailto:${guest.email}`} className="typo-body-sm font-medium text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline truncate">
                  {guest.email}
                </a>
                <span className="typo-body-sm text-vintiga-slate-700">{guest.phone}</span>
                <span className="typo-body-sm text-vintiga-slate-500">{guest.country}</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 text-right shrink-0">
              <span className="typo-body-sm text-vintiga-slate-700">Loyalty Tier {guest.loyaltyTier} · Customer</span>
              <span className="typo-body-sm text-vintiga-slate-700">{guest.orders} Orders</span>
              <span className="typo-body-sm text-vintiga-slate-700">LTV {guest.ltv}</span>
            </div>
          </div>

          {/* Preference cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
            <InsightCard icon={<WineIcon />} tone="indigo">
              {first}'s preferences are unknown. Ask them about their preferences.
            </InsightCard>
            <InsightCard icon={<StoreIcon />} tone="slate">
              We don't have any visits on file. This might be {first}'s first time here.
            </InsightCard>
            <InsightCard icon={<SmileIcon />} tone="slate">
              {first} hasn't rated any likes yet.
            </InsightCard>
            <InsightCard icon={<StarIcon />} tone="slate">
              {first} hasn't rated any dislikes yet.
            </InsightCard>
          </div>

          {/* Most purchased */}
          <section className="flex flex-col gap-vintiga-md">
            <h3 className="typo-title-subsection font-semibold text-vintiga-slate-900">Most Purchased</h3>
            <div className="flex flex-col items-center text-center gap-vintiga-sm py-vintiga-lg">
              <div className="w-12 h-12 rounded-full bg-vintiga-slate-100 inline-flex items-center justify-center text-vintiga-slate-400">
                <SearchIcon className="w-5 h-5" />
              </div>
              <span className="typo-body-sm text-vintiga-slate-500">No products found</span>
            </div>
          </section>

          {/* Notes */}
          <section className="flex flex-col gap-vintiga-md">
            <div className="flex items-center justify-between gap-vintiga-md">
              <h3 className="typo-title-subsection font-semibold text-vintiga-slate-900">Notes</h3>
              <Button variant="outline" size="sm" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => {}}>Add</Button>
            </div>
            <p className="typo-body-sm text-vintiga-slate-500">You don't have any notes on the customer.</p>
          </section>
        </div>
      </aside>
    </div>
  )
}

function InsightCard({ icon, tone, children }: { icon: ReactNode; tone: 'indigo' | 'slate'; children: ReactNode }) {
  return (
    <div className="flex items-start gap-vintiga-md border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md">
      <div
        className={[
          'w-10 h-10 rounded-full inline-flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5',
          tone === 'indigo' ? 'bg-vintiga-indigo-50 text-vintiga-indigo-600' : 'bg-vintiga-slate-100 text-vintiga-slate-400',
        ].join(' ')}
      >
        {icon}
      </div>
      <p className="typo-body-sm text-vintiga-slate-700">{children}</p>
    </div>
  )
}
