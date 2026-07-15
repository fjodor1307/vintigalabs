import { useState } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { CardBrandLogo } from '@ds/shared/CardBrandLogo'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@ds/shared/Table'
import { GemIcon, BackArrowIcon, ChevronLeftIcon, ChevronRightIcon, TruckIcon, MapPinIcon, PlusIcon } from '@ds/icons/Icons'
import { MEMBERSHIPS, type Membership, type MembershipStatus } from './membershipsData'

// ─── Full membership page ─────────────────────────────────────────────────────
// The deep view behind a membership card's "View full membership →" — everything
// too heavy for the condensed card: paginated past club orders, membership-level
// tags + notes (kept separate from the customer's tags/notes), custom fields.

const STATUS_META: Record<MembershipStatus, { label: string; tone: 'success' | 'danger' | 'orange' }> = {
  active: { label: 'Active', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
  'on-hold': { label: 'On Hold', tone: 'orange' },
}

function Pair({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="typo-caption uppercase tracking-wide text-vintiga-slate-400">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-900">{value}</span>
    </div>
  )
}

const PAGE_SIZE = 4

export function MembershipDetailPage() {
  const id = window.location.hash.split('/').pop()
  const m: Membership | undefined = MEMBERSHIPS.find((x) => x.id === id)
  const [page, setPage] = useState(0)

  if (!m) {
    return (
      <CustomerViewLayout activeTab="memberships" hideTitle actions={<></>}>
        <p className="typo-body text-vintiga-slate-500">Membership not found.</p>
      </CustomerViewLayout>
    )
  }

  const status = STATUS_META[m.status]
  const delivery = m.delivery
  const deliveryText = delivery
    ? `${delivery.method === 'pickup' ? 'Pickup' : 'Ship'} · ${delivery.method === 'pickup' ? delivery.location : delivery.address}`
    : '—'
  const orders = m.pastOrders ?? []
  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const pageOrders = orders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <CustomerViewLayout activeTab="memberships" hideTitle actions={<></>}>
      <div className="flex flex-col gap-vintiga-lg">
        <a href="#/web/customers/view/memberships" className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline w-fit">
          <BackArrowIcon className="w-4 h-4" /> Back to memberships
        </a>

        {/* Header */}
        <div className="flex items-start gap-vintiga-md">
          <span className="w-11 h-11 rounded-full bg-vintiga-surface-element text-vintiga-slate-500 inline-flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5"><GemIcon /></span>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-vintiga-sm flex-wrap">
              <h1 className="typo-title-screen font-semibold text-vintiga-slate-900">{m.clubName}</h1>
              <Tag variant="filled" tone={status.tone} size="md">{status.label}</Tag>
              {m.source === 'commerce7' && <Tag variant="neutral-light" size="md">Saved in Commerce 7</Tag>}
            </div>
            <span className="typo-body-sm text-vintiga-slate-500">{m.clubType} · Joined {m.joined}</span>
          </div>
        </div>

        {/* Overview */}
        <RecordsCard title="Overview" divider={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-lg">
            <Pair label="Delivery" value={<span className="inline-flex items-center gap-1.5"><span className="text-vintiga-slate-400 [&>svg]:w-4 [&>svg]:h-4">{delivery?.method === 'pickup' ? <MapPinIcon /> : <TruckIcon />}</span>{deliveryText}</span>} />
            <Pair label="Paid with" value={m.payment ? <span className="inline-flex items-center gap-1.5"><CardBrandLogo brand={m.payment.brand} /> •••• {m.payment.last4}</span> : 'No card on file'} />
            <Pair label="Preferred shipping" value={m.preferredShipping ?? '—'} />
            <Pair label="Sales associate" value={m.salesAssociate ?? '—'} />
            {(m.renews || m.commitmentEnds) && <Pair label={m.renews ? 'Renews' : 'Commitment ends'} value={(m.renews ?? m.commitmentEnds) as string} />}
            {m.level && <Pair label="Level" value={`${m.level.name} · $${m.level.monthly}/mo`} />}
            <Pair label="Shipping notes" value={m.shippingNotes || <span className="text-vintiga-slate-400">None</span>} />
            <Pair label="Gift message" value={m.giftMessage || <span className="text-vintiga-slate-400">None</span>} />
          </div>
        </RecordsCard>

        {/* Membership tags + notes — distinct from the customer's */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-vintiga-lg items-start">
          <RecordsCard title="Membership tags" subtitle="Tags on this club, not the customer" divider={false} action={<Button variant="outline" size="sm" leftIcon={<PlusIcon />} onClick={() => {}}>Add</Button>}>
            {m.membershipTags && m.membershipTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {m.membershipTags.map((t) => <Tag key={t} variant="outline" size="sm">{t}</Tag>)}
              </div>
            ) : <p className="typo-body-sm text-vintiga-slate-500">No membership tags.</p>}
          </RecordsCard>
          <RecordsCard title="Membership notes" subtitle="Notes on this club, not the customer" divider={false}>
            <p className="typo-body-sm text-vintiga-slate-700">{m.membershipNotes || <span className="text-vintiga-slate-400">No membership notes.</span>}</p>
          </RecordsCard>
        </div>

        {/* Past club orders — paginated */}
        <RecordsCard title="Past club orders" subtitle={`${orders.length} order${orders.length === 1 ? '' : 's'}`} divider={false}>
          {orders.length === 0 ? (
            <p className="typo-body-sm text-vintiga-slate-500">No past orders yet.</p>
          ) : (
            <div className="flex flex-col gap-vintiga-md">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Bottles</TableHeader>
                    <TableHeader>Total</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageOrders.map((o, k) => (
                    <TableRow key={k}>
                      <TableCell className="font-medium text-vintiga-slate-900">{o.date}</TableCell>
                      <TableCell className="text-vintiga-slate-700 tabular-nums">{o.bottles}</TableCell>
                      <TableCell className="text-vintiga-slate-700 tabular-nums">${o.total.toFixed(2)}</TableCell>
                      <TableCell><Tag variant="neutral-light" size="sm">{o.status}</Tag></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pageCount > 1 && (
                <div className="flex items-center justify-end gap-vintiga-sm">
                  <span className="typo-body-sm text-vintiga-slate-500">Page {page + 1} of {pageCount}</span>
                  <IconButton variant="outline" size="sm" icon={<ChevronLeftIcon />} aria-label="Previous page" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} />
                  <IconButton variant="outline" size="sm" icon={<ChevronRightIcon />} aria-label="Next page" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page === pageCount - 1} />
                </div>
              )}
            </div>
          )}
        </RecordsCard>
      </div>
    </CustomerViewLayout>
  )
}
