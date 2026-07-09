import { useState, type ReactNode } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { CardBrandLogo } from '@ds/shared/CardBrandLogo'
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
} from './membershipsData'

// ─── CustomerMembershipsScreen ────────────────────────────────────────────────
// Condensed Memberships tab (redesign of Figma 2015:6618, per Jul 1 review).
// Digital Pass sits first so it + a membership fit above the fold. Each card
// shows only the fields relevant to its club kind, with inline (wrapping) pairs
// instead of stacked blocks. Billing / shipping — always the customer's own —
// hide behind an "advanced" disclosure to reclaim the vertical space Donna
// flagged.

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

// ─── Inline label/value pair — wraps horizontally to save vertical space ──────

function Pair({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="typo-caption text-vintiga-slate-400">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-900">{value}</span>
    </div>
  )
}

// ─── Digital Pass — compact single card at the top ────────────────────────────

function DigitalPassRow() {
  const p = DIGITAL_PASS
  return (
    <div className="flex items-center gap-vintiga-md">
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
    </div>
  )
}

// ─── Membership card ──────────────────────────────────────────────────────────

function deliveryLabel(m: Membership): string | null {
  if (!m.delivery) return null
  return m.delivery.method === 'pickup'
    ? `Pickup · ${m.delivery.location}`
    : `Ship to ${m.delivery.address}`
}

function MembershipCard({ m }: { m: Membership }) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const isShipment = m.kind === 'curated' || m.kind === 'traditional'
  const delivery = deliveryLabel(m)

  return (
    <div className="rounded-vintiga-card border border-vintiga-border p-vintiga-md flex flex-col gap-vintiga-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-vintiga-md">
        <div className="flex items-center gap-vintiga-md min-w-0">
          <span className="w-10 h-10 rounded-full bg-vintiga-surface-element text-vintiga-slate-500 inline-flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
            <GemIcon />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-vintiga-sm flex-wrap">
              <span className="typo-body-sm font-semibold text-vintiga-slate-900">{m.clubName}</span>
              <StatusTag status={m.status} />
              {m.source === 'commerce7' && <Tag variant="neutral-light" size="sm">Saved in Commerce 7</Tag>}
            </div>
            <span className="typo-caption text-vintiga-slate-500">
              {m.clubType} · Joined {m.joined}
            </span>
          </div>
        </div>
        <PopoverMenu
          align="right"
          width="w-44"
          trigger={(_open, toggle) => (
            <IconButton variant="outline" size="sm" icon={<EllipsisVerticalIcon />} onClick={toggle} aria-label={`More options for ${m.clubName}`} />
          )}
          items={[
            { label: 'View membership', onClick: () => {} },
            ...(m.status === 'active' ? [{ label: 'Put on hold', onClick: () => {} }] : []),
            { label: 'Cancel membership', onClick: () => {}, danger: true },
          ]}
        />
      </div>

      {/* Type-specific detail — inline pairs wrap to save vertical space */}
      <div className="flex flex-wrap gap-x-vintiga-xl gap-y-vintiga-sm pl-[52px]">
        {m.level && <Pair label="Level" value={`${m.level.name} · $${m.level.monthly}/mo`} />}
        {m.commitmentEnds && <Pair label="Commitment ends" value={m.commitmentEnds} />}
        {isShipment && delivery && (
          <Pair
            label="Delivery"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className="text-vintiga-slate-400 [&>svg]:w-4 [&>svg]:h-4">
                  {m.delivery!.method === 'pickup' ? <MapPinIcon /> : <TruckIcon />}
                </span>
                {delivery}
              </span>
            }
          />
        )}
        {m.kind === 'curated' && m.orderReview !== undefined && (
          <Pair label="Order review" value={m.orderReview ? 'On' : 'Off'} />
        )}
        {m.payment && (
          <Pair
            label="Payment"
            value={
              <span className="inline-flex items-center gap-1.5">
                <CardBrandLogo brand={m.payment.brand} />
                •••• {m.payment.last4}
              </span>
            }
          />
        )}
        {m.salesAssociate && <Pair label="Sales associate" value={m.salesAssociate} />}
        {m.status === 'on-hold' && m.holdExpires && <Pair label="Hold expires" value={m.holdExpires} />}
        {m.status === 'cancelled' && (
          <>
            {m.cancelledOn && <Pair label="Cancelled" value={m.cancelledOn} />}
            {m.cancelReason && <Pair label="Reason" value={m.cancelReason} />}
          </>
        )}
      </div>

      {/* Advanced — billing / shipping (assumed = customer's own address) */}
      {(m.billingAddress || m.shippingAddress) && (
        <div className="pl-[52px]">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-1 typo-caption font-semibold text-vintiga-slate-500 hover:text-vintiga-slate-700 bg-transparent border-none p-0 cursor-pointer"
          >
            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Billing &amp; shipping
          </button>
          {showAdvanced && (
            <div className="mt-vintiga-sm grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
              {m.billingAddress && <Pair label="Billing address" value={m.billingAddress} />}
              {m.shippingAddress && <Pair label="Shipping address" value={m.shippingAddress} />}
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
        <DigitalPassRow />
        {MEMBERSHIPS.map((m) => <MembershipCard key={m.id} m={m} />)}
      </RecordsCard>
    </CustomerViewLayout>
  )
}
