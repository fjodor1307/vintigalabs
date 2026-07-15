import { useState, useEffect, type ReactNode } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { CardBrandLogo } from '@ds/shared/CardBrandLogo'
import { AlertSoft } from '@ds/shared/AlertSoft'
import { Toast } from '@ds/shared/Toast'
import {
  GemIcon,
  MailIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  TruckIcon,
  MapPinIcon,
  IdCardIcon,
} from '@ds/icons/Icons'
import {
  DIGITAL_PASS,
  MEMBERSHIPS,
  CLUB_OPTIONS,
  type DigitalPass,
  type Membership,
  type MembershipStatus,
  type NextShipment,
} from './membershipsData'
import { AddEditMembershipModal, CancelMembershipModal, type MembershipFormValue } from './membershipModals'
import { ShippingAddressModal, CardOnFileModal, DeliveryMethodModal, type CardRef } from './membershipEditModals'
import { useAddresses } from './customerStore'

// ─── CustomerMembershipsScreen ────────────────────────────────────────────────
// Redesign of Figma 2015:6618 per the Jul 1 review. Digital Pass is its own
// compact card; each club is an expandable card that combines the club with its
// next shipment (mirrors the customer portal). Add / Edit / Cancel / Put-on-hold
// mutate a local memberships list so the flow is clickable end-to-end.

const STATUS_META: Record<MembershipStatus, { label: string; tone: 'success' | 'danger' | 'orange' }> = {
  active:      { label: 'Active',    tone: 'success' },
  cancelled:   { label: 'Cancelled', tone: 'danger' },
  'on-hold':   { label: 'On Hold',   tone: 'orange' },
}

function StatusTag({ status }: { status: MembershipStatus }) {
  const m = STATUS_META[status]
  return <Tag variant="filled" tone={m.tone} size="sm">{m.label}</Tag>
}

function Pair({ label, value, edit }: { label: string; value: ReactNode; edit?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="typo-caption uppercase tracking-wide text-vintiga-slate-400">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-900">{value}</span>
      {edit && (
        <button type="button" onClick={edit.onClick} className="typo-caption font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 bg-transparent border-none p-0 cursor-pointer text-left w-fit">
          {edit.label}
        </button>
      )}
    </div>
  )
}

// ─── Digital Pass — standalone compact card ───────────────────────────────────

// Derive the displayed state from which dates are present — most-advanced wins,
// so re-sending an invite on an active pass never downgrades what's shown.
function passStatus(p: DigitalPass): { active: boolean; label: string } {
  if (p.lastUsedOn)           return { active: true,  label: `Last Used: ${p.lastUsedOn}` }
  if (p.invitationAcceptedOn) return { active: true,  label: `Invitation Accepted: ${p.invitationAcceptedOn}` }
  if (p.invitationSentOn)     return { active: false, label: `Invitation Sent: ${p.invitationSentOn}` }
  return { active: false, label: 'Invitation Sent: Not Sent' }
}

// A pass ID is minted the first time an invite is sent (dev may instead mint it
// at record creation — either way the display has no value until first send).
function mintPassId(): string {
  return `VA${Math.floor(10000000 + Math.random() * 89999999)}`
}

function DigitalPassCard() {
  const [pass, setPass] = useState<DigitalPass>(DIGITAL_PASS)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  const { active, label } = passStatus(pass)

  function sendInvite() {
    setPass((prev) => ({
      ...prev,
      passId: prev.passId ?? mintPassId(), // created on the first send
      invitationSentOn: formatToday(),     // updated internally even when already active
    }))
    setToast(pass.invitationSentOn ? 'Invitation re-sent to the customer.' : 'Invitation sent to the customer.')
  }

  return (
    <RecordsCard title="Digital Passes" subtitle="Manage your customer digital passes" divider={false}>
      <div className="flex items-center gap-vintiga-md rounded-vintiga-card border border-vintiga-border p-vintiga-md">
        <span className="w-10 h-10 rounded-full bg-vintiga-indigo-50 text-vintiga-indigo-600 inline-flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
          <MailIcon />
        </span>
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-vintiga-xl gap-y-1">
          <div className="flex items-center gap-vintiga-sm">
            <span className="typo-body-sm font-semibold text-vintiga-slate-900">Digital Pass</span>
            {active
              ? <Tag variant="filled" tone="success" size="sm">Active</Tag>
              : <Tag variant="neutral-light" size="sm">Inactive</Tag>}
          </div>
          <span className="typo-body-sm font-medium text-vintiga-slate-700">{label}</span>
          {pass.passId && <span className="typo-body-sm text-vintiga-slate-500">Pass ID {pass.passId}</span>}
          <span className="typo-body-sm text-vintiga-slate-500">{pass.loyaltyPoints} loyalty points</span>
          <span className="typo-body-sm text-vintiga-slate-500">Created {pass.created}</span>
        </div>
        <PopoverMenu
          align="right"
          width="w-44"
          trigger={(_o, toggle) => (
            <IconButton variant="outline" size="sm" icon={<EllipsisVerticalIcon />} onClick={toggle} aria-label="More options for Digital Pass" />
          )}
          items={[
            { label: 'Send Invite', onClick: sendInvite },
            ...(pass.passId ? [{ label: 'View pass', onClick: () => {} }] : []),
          ]}
        />
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-[fadeUp_0.3s_ease-out]">
          <Toast title={toast} description="They'll get an email to add the pass to their wallet." variant="success" onClose={() => setToast(null)} />
        </div>
      )}
    </RecordsCard>
  )
}

// ─── Collapsed summary line ───────────────────────────────────────────────────

function summaryLine(m: Membership): string {
  if (m.status === 'cancelled') return `Cancelled ${m.cancelledOn} · ${m.cancelReason}`
  if (m.nextShipment) {
    const total = m.nextShipment.wines.reduce((n, w) => n + w.qty, 0)
    return `Next shipment ${m.nextShipment.date} · ${total} bottle${total === 1 ? '' : 's'}`
  }
  if (m.kind === 'member-choice' && m.level) return `${m.level.name} · $${m.level.monthly}/mo`
  if (m.kind === 'rewards' && m.renews) return `Renews ${m.renews}`
  return `${m.clubType} · Joined ${m.joined}`
}

// ─── Next-shipment block (shipment clubs) ─────────────────────────────────────

const PICKUP_LOCATION = 'Downtown Tasting Room'

function deliveryDisplay(method: 'ship' | 'pickup'): ReactNode {
  const icon = method === 'pickup' ? <MapPinIcon /> : <TruckIcon />
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-vintiga-slate-400 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      {method === 'pickup' ? 'Pickup' : 'Ship'}
    </span>
  )
}

function NextShipmentBlock({ m, s }: { m: Membership; s: NextShipment }) {
  const addresses = useAddresses()
  const homeAddress = addresses[0] ? `${addresses[0].street}, ${addresses[0].city}, ${addresses[0].state} ${addresses[0].zip}` : ''

  const [method, setMethod] = useState<'ship' | 'pickup'>(m.delivery?.method ?? 'ship')
  const [addr, setAddr] = useState<string>(m.delivery?.method === 'pickup' ? (m.delivery.location ?? PICKUP_LOCATION) : (m.delivery?.address ?? homeAddress))
  const [card, setCard] = useState<CardRef | undefined>(m.payment)
  const [modal, setModal] = useState<'address' | 'card' | 'delivery' | null>(null)
  const [skipped, setSkipped] = useState(s.skipped)
  const total = s.wines.reduce((n, w) => n + w.qty, 0)

  return (
    <div className="flex flex-col gap-vintiga-md">
      <div className="rounded-vintiga-card bg-vintiga-surface-secondary p-vintiga-md flex flex-col gap-vintiga-md">
        <p className="typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500">Your next shipment</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
          <Pair
            label={method === 'pickup' ? 'Pickup at' : 'Ships to'}
            value={addr}
            edit={method === 'pickup' ? { label: 'Change delivery', onClick: () => setModal('delivery') } : { label: 'Change address', onClick: () => setModal('address') }}
          />
          <Pair
            label="Paid with"
            value={card ? <span className="inline-flex items-center gap-1.5"><CardBrandLogo brand={card.brand} /> •••• {card.last4}</span> : 'No card on file'}
            edit={{ label: card ? 'Change card' : 'Add a card', onClick: () => setModal('card') }}
          />
          <Pair label="Delivery" value={deliveryDisplay(method)} edit={{ label: 'Change delivery', onClick: () => setModal('delivery') }} />
        </div>
        <div className="flex flex-wrap gap-x-vintiga-xl gap-y-1 pt-vintiga-sm border-t border-vintiga-border">
          <span className="typo-body-sm text-vintiga-slate-500"><span className="font-medium text-vintiga-slate-700">Charges on:</span> {s.chargesOn}</span>
          <span className="typo-body-sm text-vintiga-slate-500"><span className="font-medium text-vintiga-slate-700">Ships on:</span> {s.shipsOn}</span>
          <span className="typo-body-sm text-vintiga-slate-500"><span className="font-medium text-vintiga-slate-700">Requirements:</span> {s.minBottles}–{s.maxBottles} bottles</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-vintiga-sm">
          <div className="flex items-center gap-vintiga-sm">
            <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500">In this shipment</span>
            {skipped && <Tag variant="filled" tone="orange" size="sm">Skipped</Tag>}
          </div>
          <div className="flex items-center gap-vintiga-sm">
            <span className="typo-body-sm text-vintiga-slate-500 tabular-nums">{total} bottles · ${s.price.toFixed(2)}</span>
            <Button variant="outline" size="sm" onClick={() => setSkipped((v) => !v)}>{skipped ? 'Unskip' : 'Skip'}</Button>
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

      <ShippingAddressModal open={modal === 'address'} current={addr} onClose={() => setModal(null)} onSave={setAddr} />
      <CardOnFileModal open={modal === 'card'} current={card} onClose={() => setModal(null)} onSave={setCard} />
      <DeliveryMethodModal
        open={modal === 'delivery'}
        current={method}
        onClose={() => setModal(null)}
        onSave={(mth) => { setMethod(mth); setAddr(mth === 'pickup' ? PICKUP_LOCATION : homeAddress) }}
      />
    </div>
  )
}

function NonShipmentDetail({ m }: { m: Membership }) {
  const [card, setCard] = useState<CardRef | undefined>(m.payment)
  const [cardModal, setCardModal] = useState(false)
  const hasRows = m.level || m.accountCredit !== undefined || m.commitmentEnds || card || m.benefits
  if (!hasRows) return <p className="typo-body-sm text-vintiga-slate-500">No additional details yet.</p>
  return (
    <div className="flex flex-col gap-vintiga-md">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
        {m.level && <Pair label="Level" value={`${m.level.name} · $${m.level.monthly}/mo`} />}
        {m.accountCredit !== undefined && <Pair label="Account credit" value={`$${m.accountCredit.toFixed(2)}`} />}
        {m.commitmentEnds && <Pair label="Commitment ends" value={m.commitmentEnds} />}
        {card && (
          <Pair
            label="Paid with"
            value={<span className="inline-flex items-center gap-1.5"><CardBrandLogo brand={card.brand} /> •••• {card.last4}</span>}
            edit={{ label: 'Change card', onClick: () => setCardModal(true) }}
          />
        )}
      </div>
      <CardOnFileModal open={cardModal} current={card} onClose={() => setCardModal(false)} onSave={setCard} />
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

function MembershipCard({
  m,
  defaultOpen,
  onEdit,
  onHold,
  onCancel,
}: {
  m: Membership
  defaultOpen?: boolean
  onEdit: () => void
  onHold: () => void
  onCancel: () => void
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const canExpand = m.status !== 'cancelled'
  const isShipmentKind = m.kind === 'curated' || m.kind === 'traditional'

  return (
    <div className="rounded-vintiga-card border border-vintiga-border">
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
            { label: 'Edit membership', onClick: onEdit },
            ...(m.status === 'active' ? [{ label: 'Put on hold', onClick: onHold }] : []),
            ...(m.status !== 'cancelled' ? [{ label: 'Cancel membership', onClick: onCancel, danger: true }] : []),
          ]}
        />
      </div>

      {open && canExpand && (
        <div className="border-t border-vintiga-border p-vintiga-md flex flex-col gap-vintiga-md">
          {m.status === 'on-hold' && (
            <AlertSoft variant="warning" title="Membership on hold" subtitle={`On hold since ${m.onHoldSince}${m.holdExpires ? `. Resumes ${m.holdExpires}` : ''}.`} />
          )}
          {m.nextShipment ? (
            <NextShipmentBlock m={m} s={m.nextShipment} />
          ) : isShipmentKind ? (
            <p className="typo-body-sm text-vintiga-slate-500">No upcoming shipment scheduled yet.</p>
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

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function addMonths(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

type ModalState =
  | { kind: 'add' }
  | { kind: 'edit'; id: string }
  | { kind: 'cancel'; id: string }
  | null

let seq = 0

export function CustomerMembershipsScreen() {
  const [memberships, setMemberships] = useState<Membership[]>(MEMBERSHIPS)
  const [modal, setModal] = useState<ModalState>(null)

  const editing = modal?.kind === 'edit' ? memberships.find((m) => m.id === modal.id) : undefined

  function handleAdd(v: MembershipFormValue) {
    const club = CLUB_OPTIONS.find((c) => c.name === v.club) ?? CLUB_OPTIONS[0]
    setMemberships((prev) => [
      ...prev,
      {
        id: `mbr-new-${++seq}`,
        clubName: club.name,
        clubType: club.type,
        kind: club.kind,
        source: 'vintiga',
        status: 'active',
        joined: v.signupDate,
        salesAssociate: v.salesAssociate,
      },
    ])
  }

  function handleEdit(id: string, v: MembershipFormValue) {
    setMemberships((prev) => prev.map((m) => (m.id === id ? { ...m, joined: v.signupDate, salesAssociate: v.salesAssociate } : m)))
  }

  function handleHold(id: string) {
    setMemberships((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'on-hold', onHoldSince: formatToday(), holdExpires: addMonths(3) } : m)))
  }

  function handleCancel(id: string, reason: string) {
    setMemberships((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'cancelled', cancelReason: reason, cancelledOn: formatToday() } : m)))
  }

  return (
    <CustomerViewLayout activeTab="memberships" hideTitle actions={<></>}>
      <div className="flex flex-col gap-vintiga-lg">
        <DigitalPassCard />
        <RecordsCard
          title="Memberships"
          subtitle="Manage your customer memberships"
          action={
            <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={() => setModal({ kind: 'add' })}>
              Add
            </Button>
          }
          divider={false}
          empty={
            <div className="flex flex-col items-center text-center gap-vintiga-md py-vintiga-lg">
              <span className="w-12 h-12 rounded-full bg-vintiga-surface-element text-vintiga-slate-400 inline-flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6">
                <IdCardIcon />
              </span>
              <div>
                <p className="typo-body font-semibold text-vintiga-slate-900">No memberships yet</p>
                <p className="typo-body-sm text-vintiga-slate-500 mt-1">This customer isn't in any clubs yet.</p>
              </div>
              <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={() => setModal({ kind: 'add' })}>
                Add
              </Button>
            </div>
          }
        >
          {memberships.map((m, i) => (
            <MembershipCard
              key={m.id}
              m={m}
              defaultOpen={i === 0}
              onEdit={() => setModal({ kind: 'edit', id: m.id })}
              onHold={() => handleHold(m.id)}
              onCancel={() => setModal({ kind: 'cancel', id: m.id })}
            />
          ))}
        </RecordsCard>
      </div>

      <AddEditMembershipModal
        open={modal?.kind === 'add' || modal?.kind === 'edit'}
        mode={modal?.kind === 'edit' ? 'edit' : 'add'}
        initial={editing}
        onClose={() => setModal(null)}
        onSave={(v) => {
          if (modal?.kind === 'edit') handleEdit(modal.id, v)
          else handleAdd(v)
        }}
      />
      <CancelMembershipModal
        open={modal?.kind === 'cancel'}
        onClose={() => setModal(null)}
        onConfirm={(reason) => {
          if (modal?.kind === 'cancel') handleCancel(modal.id, reason)
        }}
      />
    </CustomerViewLayout>
  )
}
