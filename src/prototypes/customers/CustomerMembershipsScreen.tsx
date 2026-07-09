import { useState, type ReactNode } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { CardBrandLogo } from '@ds/shared/CardBrandLogo'
import { AlertSoft } from '@ds/shared/AlertSoft'
import {
  GemIcon,
  MailIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  TruckIcon,
  MapPinIcon,
} from '@ds/icons/Icons'
import {
  DIGITAL_PASS,
  MEMBERSHIPS,
  type Membership,
  type MembershipStatus,
  type NextShipment,
} from './membershipsData'

// ─── CustomerMembershipsScreen ────────────────────────────────────────────────
// Redesign of Figma 2015:6618 per the Jul 1 review. Digital Pass is its own
// compact card; each club is an expandable card that combines the club with its
// next shipment (mirrors the customer portal) — collapsed to a one-line summary
// so the whole list stays scannable. Clubs that don't ship (Rewards, Member
// Choice) expand to their type-specific detail instead.

// ─── Status tag ───────────────────────────────────────────────────────────────

const STATUS_META: Record<MembershipStatus, { label: string; tone: 'success' | 'danger' | 'orange' }> = {
  active:      { label: 'Active',    tone: 'success' },
  cancelled:   { label: 'Cancelled', tone: 'danger' },
  'on-hold':   { label: 'On Hold',   tone: 'orange' },
}

function StatusTag({ status }: { status: MembershipStatus }) {
  const m = STATUS_META[status]
  return <Tag variant="filled" tone={m.tone} size="sm">{m.label}</Tag>
}

// ─── Inline label/value pair ──────────────────────────────────────────────────

function Pair({ label, value, edit }: { label: string; value: ReactNode; edit?: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="typo-caption uppercase tracking-wide text-vintiga-slate-400">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-900">{value}</span>
      {edit && (
        <button type="button" onClick={() => {}} className="typo-caption font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 bg-transparent border-none p-0 cursor-pointer text-left w-fit">
          {edit}
        </button>
      )}
    </div>
  )
}

// ─── Digital Pass — standalone compact card ───────────────────────────────────

function DigitalPassCard() {
  const p = DIGITAL_PASS
  return (
    <section className="border border-vintiga-border rounded-vintiga-card bg-vintiga-white p-vintiga-md flex items-center gap-vintiga-md">
      <span className="w-10 h-10 rounded-full bg-vintiga-indigo-50 text-vintiga-indigo-600 inline-flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
        <MailIcon />
      </span>
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-vintiga-xl gap-y-1">
        <div className="flex items-center gap-vintiga-sm">
          <span className="typo-body-sm font-semibold text-vintiga-slate-900">Digital Pass</span>
          <Tag variant="filled" tone="success" size="sm">Active</Tag>
        </div>
        <span className="typo-body-sm text-vintiga-slate-500">Pass ID {p.passId}</span>
        <span className="typo-body-sm text-vintiga-slate-500">{p.loyaltyPoints} loyalty points</span>
        <span className="typo-body-sm text-vintiga-slate-500">Accepted {p.invitationAccepted}</span>
      </div>
    </section>
  )
}

// ─── Membership summary line (collapsed) ──────────────────────────────────────

function summaryLine(m: Membership): string {
  if (m.status === 'cancelled') return `Cancelled ${m.cancelledOn} · ${m.cancelReason}`
  if (m.nextShipment) {
    const total = m.nextShipment.wines.reduce((n, w) => n + w.qty, 0)
    return `Next shipment ${m.nextShipment.date} · ${total} bottle${total === 1 ? '' : 's'}`
  }
  if (m.kind === 'member-choice' && m.level) return `${m.level.name} · $${m.level.monthly}/mo`
  if (m.kind === 'rewards' && m.renews) return `Renews ${m.renews}`
  return m.clubType
}

// ─── Next-shipment block (shipment clubs) ─────────────────────────────────────

function deliveryValue(m: Membership): ReactNode {
  if (!m.delivery) return '—'
  const icon = m.delivery.method === 'pickup' ? <MapPinIcon /> : <TruckIcon />
  const label = m.delivery.method === 'pickup' ? `Pickup · ${m.delivery.location}` : 'Ship'
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-vintiga-slate-400 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      {label}
    </span>
  )
}

function NextShipmentBlock({ m, s }: { m: Membership; s: NextShipment }) {
  const [skipped, setSkipped] = useState(s.skipped)
  const total = s.wines.reduce((n, w) => n + w.qty, 0)
  const shipTo =
    m.delivery?.method === 'pickup' ? m.delivery.location : m.delivery?.address

  return (
    <div className="flex flex-col gap-vintiga-md">
      <div className="rounded-vintiga-card bg-vintiga-surface-secondary p-vintiga-md flex flex-col gap-vintiga-md">
        <p className="typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500">Your next shipment</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
          <Pair label={m.delivery?.method === 'pickup' ? 'Pickup at' : 'Ships to'} value={shipTo} edit={m.delivery?.method === 'pickup' ? 'Change pickup' : 'Change address'} />
          <Pair
            label="Paid with"
            value={m.payment ? <span className="inline-flex items-center gap-1.5"><CardBrandLogo brand={m.payment.brand} /> •••• {m.payment.last4}</span> : 'No card on file'}
            edit={m.payment ? 'Change card' : 'Add a card'}
          />
          <Pair label="Delivery" value={deliveryValue(m)} edit="Change delivery" />
        </div>
        <div className="flex flex-wrap gap-x-vintiga-xl gap-y-1 pt-vintiga-sm border-t border-vintiga-border">
          <span className="typo-body-sm text-vintiga-slate-500"><span className="font-medium text-vintiga-slate-700">Charges on:</span> {s.chargesOn}</span>
          <span className="typo-body-sm text-vintiga-slate-500"><span className="font-medium text-vintiga-slate-700">Ships on:</span> {s.shipsOn}</span>
          <span className="typo-body-sm text-vintiga-slate-500"><span className="font-medium text-vintiga-slate-700">Requirements:</span> {s.minBottles}–{s.maxBottles} bottles</span>
        </div>
      </div>

      {/* In your box */}
      <div>
        <div className="flex items-center justify-between mb-vintiga-sm">
          <div className="flex items-center gap-vintiga-sm">
            <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500">In this shipment</span>
            {skipped && <Tag variant="filled" tone="orange" size="sm">Skipped</Tag>}
          </div>
          <div className="flex items-center gap-vintiga-sm">
            <span className="typo-body-sm text-vintiga-slate-500 tabular-nums">{total} bottles · ${s.price.toFixed(2)}</span>
            <Button variant="outline" size="sm" onClick={() => setSkipped((v) => !v)}>
              {skipped ? 'Unskip' : 'Skip'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-sm">
          {s.wines.map((w) => (
            <div key={w.name} className="flex items-start gap-vintiga-sm rounded-vintiga-md border border-vintiga-border p-vintiga-sm">
              <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-vintiga-surface-element text-vintiga-slate-500 inline-flex items-center justify-center typo-caption font-semibold tabular-nums">×{w.qty}</span>
              <div className="min-w-0">
                <p className="typo-body-sm font-medium text-vintiga-slate-900">{w.name}</p>
                <p className="typo-caption text-vintiga-slate-500">{w.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Rewards / Member-Choice expanded detail (no shipment) ────────────────────

function NonShipmentDetail({ m }: { m: Membership }) {
  return (
    <div className="flex flex-col gap-vintiga-md">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
        {m.level && <Pair label="Level" value={`${m.level.name} · $${m.level.monthly}/mo`} edit="Change level" />}
        {m.accountCredit !== undefined && <Pair label="Account credit" value={`$${m.accountCredit.toFixed(2)}`} />}
        {m.commitmentEnds && <Pair label="Commitment ends" value={m.commitmentEnds} />}
        {m.payment && (
          <Pair
            label="Paid with"
            value={<span className="inline-flex items-center gap-1.5"><CardBrandLogo brand={m.payment.brand} /> •••• {m.payment.last4}</span>}
            edit="Change card"
          />
        )}
      </div>
      {m.benefits && (
        <div>
          <p className="typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500 mb-vintiga-sm">Member benefits</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-vintiga-lg gap-y-1.5">
            {m.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 typo-body-sm text-vintiga-slate-700">
                <GemIcon className="w-3.5 h-3.5 mt-1 text-vintiga-indigo-500 shrink-0" />{b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Membership card (expandable) ─────────────────────────────────────────────

function MembershipCard({ m, defaultOpen }: { m: Membership; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  const canExpand = m.status !== 'cancelled'

  return (
    <div className="rounded-vintiga-card border border-vintiga-border overflow-hidden">
      {/* Header — click to expand */}
      <div className="flex items-center gap-vintiga-md p-vintiga-md">
        <button
          type="button"
          onClick={() => canExpand && setOpen((v) => !v)}
          className={`flex items-center gap-vintiga-md flex-1 min-w-0 text-left bg-transparent border-none p-0 ${canExpand ? 'cursor-pointer' : 'cursor-default'}`}
          aria-expanded={open}
        >
          <span className="w-10 h-10 rounded-full bg-vintiga-surface-element text-vintiga-slate-500 inline-flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
            <GemIcon />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-vintiga-sm flex-wrap">
              <span className="typo-body-sm font-semibold text-vintiga-slate-900">{m.clubName}</span>
              <StatusTag status={m.status} />
              {m.source === 'commerce7' && <Tag variant="neutral-light" size="sm">Saved in Commerce 7</Tag>}
            </div>
            <span className="typo-caption text-vintiga-slate-500">{summaryLine(m)}</span>
          </div>
          {canExpand && (
            <ChevronDownIcon className={`w-5 h-5 text-vintiga-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </button>
        <PopoverMenu
          align="right"
          width="w-44"
          trigger={(_o, toggle) => (
            <IconButton variant="outline" size="sm" icon={<EllipsisVerticalIcon />} onClick={toggle} aria-label={`More options for ${m.clubName}`} />
          )}
          items={[
            { label: 'View membership', onClick: () => {} },
            ...(m.status === 'active' ? [{ label: 'Put on hold', onClick: () => {} }] : []),
            { label: 'Cancel membership', onClick: () => {}, danger: true },
          ]}
        />
      </div>

      {/* Expanded body */}
      {open && canExpand && (
        <div className="border-t border-vintiga-border p-vintiga-md flex flex-col gap-vintiga-md">
          {m.status === 'on-hold' && (
            <AlertSoft variant="warning" title="Membership on hold" subtitle={`On hold since ${m.onHoldSince}. Resumes ${m.holdExpires}.`} />
          )}
          {m.payment === undefined && m.nextShipment && (
            <AlertSoft variant="warning" title="No card on file" subtitle="Add a card to keep the club active." actionLabel="Add a card" onAction={() => {}} />
          )}
          {m.nextShipment ? (
            <NextShipmentBlock m={m} s={m.nextShipment} />
          ) : (
            <NonShipmentDetail m={m} />
          )}
          {m.kind === 'curated' && m.orderReview !== undefined && (
            <div className="flex items-center gap-vintiga-sm typo-body-sm text-vintiga-slate-500 pt-vintiga-sm border-t border-vintiga-border">
              <span className="font-medium text-vintiga-slate-700">Order review</span>
              <Tag variant={m.orderReview ? 'filled' : 'neutral-light'} tone={m.orderReview ? 'success' : 'default'} size="sm">
                {m.orderReview ? 'On' : 'Off'}
              </Tag>
              <span>Member confirms each box before it charges.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function CustomerMembershipsScreen() {
  return (
    <CustomerViewLayout activeTab="memberships" hideTitle actions={<></>}>
      <div className="flex flex-col gap-vintiga-lg">
        <DigitalPassCard />
        <RecordsCard
          title="Memberships"
          subtitle="Manage your customer memberships"
          action={
            <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={() => {}}>
              Add
            </Button>
          }
          divider={false}
        >
          {MEMBERSHIPS.map((m, i) => <MembershipCard key={m.id} m={m} defaultOpen={i === 0} />)}
        </RecordsCard>
      </div>
    </CustomerViewLayout>
  )
}
