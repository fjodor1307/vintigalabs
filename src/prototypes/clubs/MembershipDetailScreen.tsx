import { useState, type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import { Avatar } from '@ds/shared/Avatar'
import { CustomerCard } from '@ds/shared/CustomerCard'
import { AlertSoft } from '@ds/shared/AlertSoft'
import { CardBrandLogo } from '@ds/shared/CardBrandLogo'
import { RecordsCard, RecordsCardEmpty } from '@ds/shared/RecordsCard'
import { RailSection } from '@ds/shared/RightRail'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@ds/shared/Table'
import {
  EllipsisVerticalIcon,
  EllipsisIcon,
  IdCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  StoreIcon,
} from '@ds/icons/Icons'
import { Switch } from '@ds/shared/Switch'
import { Textarea } from '@ds/shared/Textarea'
import { AgeVerifiedBadge } from '@ds/shared/AgeVerifiedBadge'
import { BlindEnthusiasmLogo } from './BlindEnthusiasmLogo'
import { getMember, type Member } from './memberSamples'
import { CLUBS_CATALOG, type ClubKey } from './clubsCatalog'
import {
  deriveMembershipState,
  formatHoldDate,
  formatHoldRange,
  TODAY_ISO,
  type MembershipHold,
  type MembershipState,
} from './holdStatus'
import { MembershipStatusTag } from './MembershipStatusTag'
import { HoldModal } from './HoldModal'

// ─── MembershipDetailScreen ──────────────────────────────────────────────────
// Drill-down from the Memberships table (Figma 5078:5161). Reads the member id
// from the location hash (`#/web/clubs/memberships/{id}`) and looks the record
// up in `memberSamples`. Orders / history are shared mock fixtures — only the
// member-specific fields (name, photo, club, etc.) vary by id.

const DELIVERY_LABEL: Record<Member['delivery'], string> = {
  shipping: 'Shipping',
  pickup:   'Pickup',
}

interface HistoryEntry {
  date: string
  change: string
  by: string
  notes: string
}

const ORDERS = [
  { id: '#ORD-5289', date: 'Mar 15, 2025', total: '$1,245.00', status: 'Processing' as OrderStatus },
  { id: '#ORD-5288', date: 'Mar 15, 2025', total: '$205.00',   status: 'Pending'    as OrderStatus },
  { id: '#ORD-4823', date: 'Mar 15, 2025', total: '$99.00',    status: 'Completed'  as OrderStatus },
  { id: '#ORD-4120', date: 'Mar 13, 2025', total: '$79.00',    status: 'Completed'  as OrderStatus },
  { id: '#ORD-3866', date: 'Mar 11, 2025', total: '$2,200.00', status: 'Completed'  as OrderStatus },
  { id: '#ORD-3743', date: 'Mar 11, 2025', total: '$3,200.00', status: 'Completed'  as OrderStatus },
  { id: '#ORD-3501', date: 'Dec 14, 2024', total: '$1,120.00', status: 'Completed'  as OrderStatus },
  { id: '#ORD-3210', date: 'Sep 12, 2024', total: '$980.00',   status: 'Completed'  as OrderStatus },
  { id: '#ORD-2988', date: 'Jun 13, 2024', total: '$1,540.00', status: 'Completed'  as OrderStatus },
  { id: '#ORD-2742', date: 'Mar 14, 2024', total: '$760.00',   status: 'Completed'  as OrderStatus },
]

const ORDERS_PER_PAGE = 6

type OrderStatus = 'Processing' | 'Pending' | 'Completed'
const ORDER_STATUS_TONE: Record<OrderStatus, { tone: 'success' | 'orange' | 'default'; variant: 'filled' | 'neutral-light' }> = {
  Processing: { tone: 'default', variant: 'neutral-light' },
  Pending:    { tone: 'orange',  variant: 'filled' },
  Completed:  { tone: 'success', variant: 'filled' },
}

const BASE_HISTORY: HistoryEntry[] = [
  { date: 'Mar 15, 2025', change: 'Re-Activated', by: 'Jim Secord',    notes: '—' },
  { date: 'Mar 13, 2025', change: 'Cancelled',    by: 'Donna Ataman',  notes: 'Other; new partner objects to drinking (Reason + Cancellation Notes)' },
  { date: 'Mar 11, 2025', change: 'Put on Hold',  by: 'Donna Ataman',  notes: "Customer isn't sure they want to keep membership" },
  { date: 'Mar 11, 2025', change: 'Re-Activated', by: 'System',        notes: 'Hold expired' },
  { date: 'Mar 10, 2025', change: 'Put on Hold',  by: 'Jim Secord',    notes: 'Until 2020-01-10. Will be out of town, and wants to skip the next release...' },
  { date: 'Mar 08, 2025', change: 'Activated',    by: 'Geoff Spears',  notes: '—' },
  { date: 'Mar 08, 2025', change: 'Pending',      by: 'System',        notes: 'Outstanding Requirements' },
]

const CURRENT_USER = 'Tom Cook'

/** Today, formatted for a freshly-written history row. */
function todayLabel(): string {
  return formatHoldDate(TODAY_ISO)
}

/** Build the history note + change label for a hold mutation. */
function holdHistoryEntry(prev: MembershipHold | undefined, next: MembershipHold | undefined): HistoryEntry {
  const base = { date: todayLabel(), by: CURRENT_USER }
  if (!next) {
    return { ...base, change: 'Hold Lifted', notes: 'Hold removed — membership resumed.' }
  }
  const range = next.end
    ? `${formatHoldDate(next.start)} → ${formatHoldDate(next.end)}`
    : `from ${formatHoldDate(next.start)} (indefinite)`
  const future = next.start > TODAY_ISO
  if (!prev) {
    return {
      ...base,
      change: future ? 'Future Hold Scheduled' : 'Put on Hold',
      notes: range,
    }
  }
  const prevRange = prev.end
    ? `${formatHoldDate(prev.start)} → ${formatHoldDate(prev.end)}`
    : `from ${formatHoldDate(prev.start)} (indefinite)`
  return { ...base, change: 'Hold Updated', notes: `${prevRange}  ⟶  ${range}` }
}

// ─── Page ────────────────────────────────────────────────────────────────────

function getMemberFromHash(): Member {
  const m = window.location.hash.match(/^#\/web\/clubs\/memberships\/([^/?]+)/)
  return (m && getMember(m[1])) || (getMember('1004') as Member)
}

export function MembershipDetailScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const member = getMemberFromHash()

  // Hold + history are local state so editing the hold updates the title tag,
  // the Hold card, and the history table live.
  const [hold, setHold] = useState<MembershipHold | undefined>(member.hold)
  const [history, setHistory] = useState<HistoryEntry[]>(BASE_HISTORY)
  const [holdModalOpen, setHoldModalOpen] = useState(false)

  const state = deriveMembershipState(member.status, hold, { cancelledDate: member.statusDate })

  function commitHold(next: MembershipHold | undefined) {
    setHistory((h) => [holdHistoryEntry(hold, next), ...h])
    setHold(next)
    setHoldModalOpen(false)
  }

  const club = CLUBS_CATALOG[member.club]
  const onHold = !!hold
  const cancelled = state.kind === 'cancelled'

  // Lead the title with the club + membership number so "Membership" doesn't
  // repeat across breadcrumb → title; the member's name lives on the card below.
  const titleNode = (
    <h1 className="typo-title-screen font-semibold text-vintiga-slate-900 inline-flex items-center gap-vintiga-sm">
      {club.name} #{member.id}
      <MembershipStatusTag state={state} size="md" showFutureHold={false} />
    </h1>
  )

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Clubs"
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="responsive"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={onMenuToggle}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <div className="flex-1 overflow-y-auto pt-16 bg-vintiga-white">
          <PageTemplate
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/clubs' },
              { label: 'Clubs',       href: '#/web/clubs' },
              { label: 'Memberships', href: '#/web/clubs/memberships' },
              { label: `${club.name} #${member.id}` },
            ]}
            title={titleNode}
            actions={
              <>
                <Button onClick={() => {}}>Save</Button>
                <PopoverMenu
                  align="right"
                  width="w-44"
                  trigger={(_open, toggle) => (
                    <IconButton
                      variant="outline"
                      size="md"
                      icon={<EllipsisVerticalIcon />}
                      onClick={toggle}
                      aria-label="More actions"
                    />
                  )}
                  items={[
                    ...(!cancelled
                      ? [{ label: onHold ? 'Edit hold' : 'Hold membership', onClick: () => setHoldModalOpen(true) }]
                      : []),
                    ...(onHold ? [{ label: 'Lift hold', onClick: () => commitHold(undefined) }] : []),
                    { label: 'Cancel membership', onClick: () => {}, danger: true },
                  ]}
                />
              </>
            }
            rail={<ClubOverviewRail member={member} />}
          >
            <div className="flex flex-col gap-vintiga-lg">
              <MembershipAlerts
                state={state}
                hold={hold}
                flagged={member.flagged}
                onEditHold={() => setHoldModalOpen(true)}
              />
              <CustomerHeaderCard member={member} />
              <OrderReviewCard member={member} />
              {member.delivery === 'pickup'
                ? <PickupDeliveryCard />
                : <AddressCard title="Shipping Address" />}
              <AddressCard title="Billing Address" />
              <PaymentMethodCard member={member} />
              <ClubOrdersCard />
              <MembershipHistoryCard history={history} />
            </div>
          </PageTemplate>
        </div>
      </div>

      <HoldModal
        open={holdModalOpen}
        hold={hold}
        onClose={() => setHoldModalOpen(false)}
        onSave={(next) => commitHold(next)}
        onRemove={() => commitHold(undefined)}
      />
    </div>
  )
}

// ─── Membership alerts ───────────────────────────────────────────────────────
// Top-of-page status banners — the back-office equivalent of the POS "pay
// attention to this" note. Only render when there's something to surface, so
// the ~90% of memberships in good standing don't carry an empty hold section
// hogging real estate. Stacks most-urgent-first: cancelled · pending · manual
// review · hold. The hold banner replaces the old always-on Hold card; you can
// edit the hold straight from it (or from the header action).
function MembershipAlerts({
  state,
  hold,
  flagged,
  onEditHold,
}: {
  state: MembershipState
  hold?: MembershipHold
  flagged?: boolean
  onEditHold: () => void
}) {
  const alerts: ReactNode[] = []

  if (state.kind === 'cancelled') {
    alerts.push(
      <AlertSoft
        key="cancelled"
        variant="error"
        title="Membership cancelled"
        subtitle={`This membership was cancelled${state.caption ? ` on ${state.caption}` : ''}. No further releases will be charged.`}
      />,
    )
  }

  if (state.kind === 'pending') {
    alerts.push(
      <AlertSoft
        key="pending"
        variant="warning"
        title="Pending activation"
        subtitle="The member signed up but the membership isn't active yet — activate it to start releases."
      />,
    )
  }

  if (flagged && state.kind !== 'cancelled') {
    alerts.push(
      <AlertSoft
        key="review"
        variant="info"
        title="Manual processing required"
        subtitle="This member's club orders are held for manual review instead of auto-batching."
      />,
    )
  }

  if (hold && state.kind !== 'cancelled') {
    const future = hold.start > TODAY_ISO
    alerts.push(
      future ? (
        <AlertSoft
          key="hold"
          variant="info"
          title={`Hold scheduled · ${formatHoldRange(hold)}`}
          subtitle={`Stays Active until ${formatHoldDate(hold.start)}, then pauses${hold.end ? ` and resumes ${formatHoldDate(hold.end)}` : ' until lifted'}.`}
          actionLabel="Edit"
          onAction={onEditHold}
        />
      ) : (
        <AlertSoft
          key="hold"
          variant="warning"
          title={hold.end ? `On hold until ${formatHoldDate(hold.end)}` : 'On hold indefinitely'}
          subtitle={`On hold since ${formatHoldDate(hold.start)}${hold.end ? ' · resumes automatically on the end date' : ' · lift the hold to resume releases'}.`}
          actionLabel="Edit"
          onAction={onEditHold}
        />
      ),
    )
  }

  if (alerts.length === 0) return null
  return <div className="flex flex-col gap-vintiga-sm">{alerts}</div>
}

// ─── Customer header card ────────────────────────────────────────────────────

function CustomerHeaderCard({ member }: { member: Member }) {
  const club = CLUBS_CATALOG[member.club]
  return (
    <CustomerCard
      avatar={
        <div className="relative">
          <Avatar name={member.name} src={member.avatarUrl} size="lg" />
          {member.ageVerified && <AgeVerifiedBadge customerName={member.name} />}
        </div>
      }
      name={member.name}
      subtitle={
        <a
          href={`#/web/clubs/view/${club.slug}/overview`}
          className="inline-flex items-center gap-1.5 typo-body font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline w-fit"
        >
          <IdCardIcon className="w-5 h-5 shrink-0" />
          {club.name}
        </a>
      }
      tags={
        member.audienceTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {member.audienceTags.map((t) => (
              <Tag key={t} variant="outline" tone="default" size="sm">{t}</Tag>
            ))}
          </div>
        )
      }
      details={
        <>
          <span>
            {member.email}
            <span className="text-vintiga-slate-500"> | Preferred</span>
          </span>
          <span>{member.phone}</span>
        </>
      }
      actions={
        <>
          <Button variant="outline" onClick={() => {}}>Customer Details</Button>
          <PopoverMenu
            align="right"
            width="w-44"
            trigger={(_open, toggle) => (
              <IconButton
                variant="outline"
                size="md"
                icon={<EllipsisVerticalIcon />}
                onClick={toggle}
                aria-label="Customer actions"
              />
            )}
            items={[
              { label: 'Edit customer',  onClick: () => {} },
              { label: 'View orders',    onClick: () => {} },
            ]}
          />
        </>
      }
    />
  )
}

// ─── Club Orders card ────────────────────────────────────────────────────────

function ClubOrdersCard() {
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(ORDERS.length / ORDERS_PER_PAGE)
  const start = page * ORDERS_PER_PAGE
  const rows = ORDERS.slice(start, start + ORDERS_PER_PAGE)
  return (
    <div className="flex flex-col gap-vintiga-md">
      <div className="flex items-center justify-between gap-vintiga-md">
        <h3 className="typo-title-section font-semibold text-vintiga-slate-900">Club Orders</h3>
        <Button variant="outline" size="sm" onClick={() => {}}>View All</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Order ID</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="w-12" />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((o) => {
            const tone = ORDER_STATUS_TONE[o.status]
            return (
              <TableRow key={o.id}>
                <TableCell className="font-medium text-vintiga-slate-900">{o.id}</TableCell>
                <TableCell className="text-vintiga-slate-700">{o.date}</TableCell>
                <TableCell className="text-vintiga-slate-900">{o.total}</TableCell>
                <TableCell>
                  <Tag variant={tone.variant} tone={tone.tone} size="sm">{o.status}</Tag>
                </TableCell>
                <TableCell className="text-right">
                  <IconButton
                    variant="outline"
                    size="sm"
                    icon={<EllipsisIcon />}
                    aria-label={`${o.id} actions`}
                    onClick={() => {}}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-vintiga-md">
          <span className="typo-caption text-vintiga-slate-500">
            Showing {start + 1}–{Math.min(start + ORDERS_PER_PAGE, ORDERS.length)} of {ORDERS.length} orders
          </span>
          <div className="flex items-center gap-vintiga-sm">
            <IconButton
              variant="outline"
              size="sm"
              icon={<ChevronLeftIcon />}
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            />
            <span className="typo-body-sm text-vintiga-slate-700">{page + 1} / {pageCount}</span>
            <IconButton
              variant="outline"
              size="sm"
              icon={<ChevronRightIcon />}
              aria-label="Next page"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Payment Method card ─────────────────────────────────────────────────────

function PaymentMethodCard({ member }: { member: Member }) {
  // Pending memberships haven't had a card vaulted yet — show the empty state.
  const hasCard = member.status !== 'pending'
  return (
    <RecordsCard
      title="Payment Method"
      empty={!hasCard ? (
        <div className="flex flex-col items-center text-center gap-vintiga-sm">
          <div className="w-10 h-10 rounded-full bg-vintiga-slate-100 inline-flex items-center justify-center text-vintiga-slate-400">
            <CreditCardIcon className="w-5 h-5" />
          </div>
          <RecordsCardEmpty
            title="No card on file"
            hint="Add a card to charge membership fees and club releases. The member can also pay in person."
          />
          <Button variant="outline" size="sm" onClick={() => {}}>Add Card</Button>
        </div>
      ) : undefined}
    >
      {hasCard ? (
        <div className="flex items-center gap-vintiga-md">
          <CardBrandLogo brand="mastercard" />
          <div className="flex flex-col">
            <span className="typo-caption text-vintiga-slate-500">Expires 07/27</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-900">Mastercard **** 0092</span>
          </div>
          <div className="flex-1" />
          <Tag variant="neutral-dark" size="md">Default Card</Tag>
          <IconButton
            variant="outline"
            size="sm"
            icon={<EllipsisVerticalIcon />}
            aria-label="Card actions"
            onClick={() => {}}
          />
        </div>
      ) : null}
    </RecordsCard>
  )
}

// Pickup memberships have no shipping address — the customer collects releases
// at the winery. We surface the delivery method + pickup location instead.
function PickupDeliveryCard() {
  return (
    <RecordsCard title="Delivery Method">
      <div className="flex items-center gap-vintiga-md">
        <div className="w-10 h-10 rounded-full bg-vintiga-slate-100 inline-flex items-center justify-center text-vintiga-slate-500 shrink-0">
          <StoreIcon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="typo-body-sm font-semibold text-vintiga-slate-900">Pickup</span>
          <span className="typo-caption text-vintiga-slate-500">Estate Tasting Room · 1210 Lakeview Street, Napa</span>
        </div>
        <div className="flex-1" />
        <IconButton
          variant="outline"
          size="sm"
          icon={<EllipsisVerticalIcon />}
          aria-label="Delivery method actions"
          onClick={() => {}}
        />
      </div>
    </RecordsCard>
  )
}

// ─── Order Review Required card ──────────────────────────────────────────────
// VIP / finicky members whose club orders must be held for manual review before
// they batch-process. The admin types the reason into the instructions field.
function OrderReviewCard({ member }: { member: Member }) {
  const [required, setRequired] = useState(member.flagged ?? false)
  const [instructions, setInstructions] = useState(
    member.flagged
      ? 'Call before each release — customer reviews the bottle selection and may swap. Do not auto-batch.'
      : '',
  )
  // Toggle in the header keeps this compact: off → just the title row; on →
  // reveals the instructions field. Saves vertical space on the ~majority of
  // members who don't need manual review.
  return (
    <RecordsCard
      title="Order Review"
      action={
        <Switch
          checked={required}
          onChange={setRequired}
          aria-label="Order review required"
        />
      }
      divider={false}
    >
      {required ? (
        <div className="flex flex-col gap-vintiga-xs">
          <label className="typo-caption font-semibold text-vintiga-slate-600">Order review instructions</label>
          <Textarea
            rows={3}
            placeholder="Explain why this member's orders need review (e.g. always call to confirm the selection)."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
      ) : null}
    </RecordsCard>
  )
}

// ─── Address card (Shipping or Billing) ──────────────────────────────────────

function AddressCard({ title }: { title: string }) {
  return (
    <RecordsCard title={title}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
        <div>
          <h4 className="typo-body-sm font-semibold text-vintiga-slate-900 mb-1">Address</h4>
          <p className="typo-body-sm text-vintiga-slate-700 leading-relaxed">
            1210 Lakeview Street<br />
            Bellingham, Washington 98229<br />
            United States
          </p>
        </div>
        <div className="flex items-start gap-vintiga-md">
          <div className="flex-1">
            <h4 className="typo-body-sm font-semibold text-vintiga-slate-900 mb-1">Contact</h4>
            <p className="typo-body-sm text-vintiga-slate-700 leading-relaxed">
              Phone: (555) 123-4567<br />
              Email: janedavis@gmail.com
            </p>
          </div>
          <IconButton
            variant="outline"
            size="sm"
            icon={<EllipsisVerticalIcon />}
            aria-label={`${title} actions`}
            onClick={() => {}}
          />
        </div>
      </div>
    </RecordsCard>
  )
}

// ─── Membership History card ─────────────────────────────────────────────────

function MembershipHistoryCard({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="flex flex-col gap-vintiga-md">
      <h3 className="typo-title-section font-semibold text-vintiga-slate-900">Membership History</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="w-32">Date</TableHeader>
            <TableHeader className="w-40">Status Change</TableHeader>
            <TableHeader className="w-40">Changed by</TableHeader>
            <TableHeader>Notes</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((h, i) => (
            <TableRow key={i}>
              <TableCell className="text-vintiga-slate-700 whitespace-nowrap">{h.date}</TableCell>
              <TableCell className="text-vintiga-slate-900">{h.change}</TableCell>
              <TableCell className="text-vintiga-slate-700">{h.by}</TableCell>
              <TableCell className="text-vintiga-slate-700">{h.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ─── Right rail — Club Overview ──────────────────────────────────────────────

function ClubLogoTile({ slug, size = 48 }: { slug: ClubKey; size?: number }) {
  if (slug === 'blind-enthusiasm') {
    return <BlindEnthusiasmLogo size={size} className="shrink-0 rounded-vintiga-md" />
  }
  const initial = CLUBS_CATALOG[slug].name.charAt(0)
  return (
    <div
      className="shrink-0 rounded-vintiga-md bg-vintiga-indigo-600 text-white inline-flex items-center justify-center font-semibold"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.5) }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

function ClubOverviewRail({ member }: { member: Member }) {
  const club = CLUBS_CATALOG[member.club]
  return (
    <RailSection title="Club Overview">
      <div className="flex flex-col gap-vintiga-md">
        {/* Club identity — clickable card linking through to the club view */}
        <a
          href={`#/web/clubs/view/${club.slug}/overview`}
          className="flex items-center gap-vintiga-sm no-underline group"
        >
          <ClubLogoTile slug={member.club} />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="typo-body font-semibold text-vintiga-slate-900 inline-flex items-center gap-1 group-hover:text-vintiga-indigo-700 transition-colors">
              {club.name}
              <span className="text-vintiga-slate-400">›</span>
            </span>
            <span className="inline-flex">
              <Tag variant="filled" tone="violet" size="sm">{club.type}</Tag>
            </span>
          </div>
        </a>

        <RailRow label="Signup Date">{member.signupDate}</RailRow>
        <RailRow label="Activated Date">{member.activatedDate}</RailRow>
        <RailRow label="Sales Associate">{member.salesAssociate}</RailRow>
        <RailRow label="Membership ID">#{member.id}</RailRow>
        <RailRow label="Delivery Method">{DELIVERY_LABEL[member.delivery]}</RailRow>
        <RailRow label="Total Orders">{member.totalOrders}</RailRow>
      </div>
    </RailSection>
  )
}

function RailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-vintiga-xs">
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-700">{children}</span>
    </div>
  )
}
