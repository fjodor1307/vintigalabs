import { type ReactNode } from 'react'
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
} from '@ds/icons/Icons'
import { AgeVerifiedBadge } from '@ds/shared/AgeVerifiedBadge'
import { BlindEnthusiasmLogo } from './BlindEnthusiasmLogo'
import { getMember, type Member } from './memberSamples'
import { CLUBS_CATALOG, type ClubKey } from './clubsCatalog'

// ─── MembershipDetailScreen ──────────────────────────────────────────────────
// Drill-down from the Memberships table (Figma 5078:5161). Reads the member id
// from the location hash (`#/web/clubs/memberships/{id}`) and looks the record
// up in `memberSamples`. Orders / history are shared mock fixtures — only the
// member-specific fields (name, photo, club, etc.) vary by id.

const STATUS_LABEL: Record<Member['status'], string> = {
  active:    'Active',
  pending:   'Pending',
  'on-hold': 'On Hold',
  cancelled: 'Cancelled',
}

const STATUS_TAG_TONE: Record<Member['status'], { tone: 'success' | 'orange' | 'default' | 'danger'; variant: 'filled' | 'neutral-light' }> = {
  active:    { tone: 'success', variant: 'filled' },
  pending:   { tone: 'orange',  variant: 'filled' },
  'on-hold': { tone: 'default', variant: 'neutral-light' },
  cancelled: { tone: 'danger',  variant: 'filled' },
}

const DELIVERY_LABEL: Record<Member['delivery'], string> = {
  shipping: 'Shipping',
  pickup:   'Pickup',
}

const ORDERS = [
  { id: '#ORD-5289', date: 'Mar 15, 2025', total: '$1,245.00', status: 'Processing' as OrderStatus },
  { id: '#ORD-5288', date: 'Mar 15, 2025', total: '$205.00',   status: 'Pending'    as OrderStatus },
  { id: '#ORD-4823', date: 'Mar 15, 2025', total: '$99.00',    status: 'Completed'  as OrderStatus },
  { id: '#ORD-4120', date: 'Mar 13, 2025', total: '$79.00',    status: 'Completed'  as OrderStatus },
  { id: '#ORD-3866', date: 'Mar 11, 2025', total: '$2,200.00', status: 'Completed'  as OrderStatus },
  { id: '#ORD-3743', date: 'Mar 11, 2025', total: '$3,200.00', status: 'Completed'  as OrderStatus },
]

type OrderStatus = 'Processing' | 'Pending' | 'Completed'
const ORDER_STATUS_TONE: Record<OrderStatus, { tone: 'success' | 'orange' | 'default'; variant: 'filled' | 'neutral-light' }> = {
  Processing: { tone: 'default', variant: 'neutral-light' },
  Pending:    { tone: 'orange',  variant: 'filled' },
  Completed:  { tone: 'success', variant: 'filled' },
}

const HISTORY = [
  { date: 'Mar 15, 2025', change: 'Re-Activated', by: 'Jim Secord',    notes: '—' },
  { date: 'Mar 13, 2025', change: 'Cancelled',    by: 'Donna Ataman',  notes: 'Other; new partner objects to drinking (Reason + Cancellation Notes)' },
  { date: 'Mar 11, 2025', change: 'Put on Hold',  by: 'Donna Ataman',  notes: "Customer isn't sure they want to keep membership" },
  { date: 'Mar 11, 2025', change: 'Re-Activated', by: 'System',        notes: 'Hold expired' },
  { date: 'Mar 10, 2025', change: 'Put on Hold',  by: 'Jim Secord',    notes: 'Until 2020-01-10. Will be out of town, and wants to skip the next release...' },
  { date: 'Mar 08, 2025', change: 'Activated',    by: 'Geoff Spears',  notes: '—' },
  { date: 'Mar 08, 2025', change: 'Pending',      by: 'System',        notes: 'Outstanding Requirements' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

function getMemberFromHash(): Member {
  const m = window.location.hash.match(/^#\/web\/clubs\/memberships\/([^/?]+)/)
  return (m && getMember(m[1])) || (getMember('1004') as Member)
}

export function MembershipDetailScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const member = getMemberFromHash()
  const statusTone = STATUS_TAG_TONE[member.status]

  const titleNode = (
    <h1 className="typo-title-screen font-semibold text-vintiga-slate-900 inline-flex items-center gap-vintiga-sm">
      Membership #{member.id}
      <Tag variant={statusTone.variant} tone={statusTone.tone} size="md">{STATUS_LABEL[member.status]}</Tag>
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
              { label: `Membership #${member.id}` },
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
                    { label: 'Cancel membership', onClick: () => {}, danger: true },
                  ]}
                />
              </>
            }
            rail={<ClubOverviewRail member={member} />}
          >
            <div className="flex flex-col gap-vintiga-lg">
              <CustomerHeaderCard member={member} />
              <ClubOrdersCard />
              <PaymentMethodCard />
              <AddressCard
                title="Shipping Address"
                subtitle="Manage customer address information"
              />
              <AddressCard
                title="Billing Address"
                subtitle="Manage customer address information"
              />
              <MembershipHistoryCard />
            </div>
          </PageTemplate>
        </div>
      </div>
    </div>
  )
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
          <span>{member.city} {member.zip}</span>
          <span className="text-vintiga-slate-500">Last Visit: {member.lastVisit}</span>
          <span className="text-vintiga-slate-500">Club Status: {STATUS_LABEL[member.status]}</span>
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
          {ORDERS.map((o) => {
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
    </div>
  )
}

// ─── Payment Method card ─────────────────────────────────────────────────────

function PaymentMethodCard() {
  return (
    <Card>
      <h3 className="typo-title-section font-semibold text-vintiga-slate-900 mb-vintiga-md">Payment Method</h3>
      <div className="border-t border-vintiga-slate-200 pt-vintiga-md flex items-center gap-vintiga-md">
        <MastercardLogo />
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
    </Card>
  )
}

function MastercardLogo() {
  // Two interlocking circles — red, yellow, with orange in the intersection
  // (clipped from the right circle) — wrapped in a card-shaped surface.
  return (
    <svg width="56" height="36" viewBox="0 0 56 36" aria-label="Mastercard" role="img">
      <rect x="0.5" y="0.5" width="55" height="35" rx="5" fill="white" stroke="#E5E7EB" />
      <defs>
        <clipPath id="mc-left-circle">
          <circle cx="24" cy="18" r="9" />
        </clipPath>
      </defs>
      <circle cx="24" cy="18" r="9" fill="#EB001B" />
      <circle cx="32" cy="18" r="9" fill="#F79E1B" />
      <circle cx="32" cy="18" r="9" fill="#FF5F00" clipPath="url(#mc-left-circle)" />
    </svg>
  )
}

// ─── Address card (Shipping or Billing) ──────────────────────────────────────

function AddressCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card>
      <div className="flex flex-col gap-1 mb-vintiga-md">
        <h3 className="typo-title-section font-semibold text-vintiga-slate-900">{title}</h3>
        <p className="typo-body-sm text-vintiga-slate-500">{subtitle}</p>
      </div>
      <div className="border-t border-vintiga-slate-200 pt-vintiga-md grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
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
    </Card>
  )
}

// ─── Membership History card ─────────────────────────────────────────────────

function MembershipHistoryCard() {
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
          {HISTORY.map((h, i) => (
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

// ─── Card primitive ──────────────────────────────────────────────────────────

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-lg">
      {children}
    </section>
  )
}
