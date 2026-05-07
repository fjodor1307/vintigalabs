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
import { BlindEnthusiasmLogo } from './BlindEnthusiasmLogo'
import { AgeVerifiedBadge } from './AgeVerifiedBadge'

// ─── MembershipDetailScreen ──────────────────────────────────────────────────
// Drill-down from the Memberships table (Figma 5078:5161). Single canonical
// example: Membership #1004 — Ms Dorothy Ladner, Blind Enthusiasm club. Real
// wiring would load by id; the prototype hard-codes the sample so the page
// reads end-to-end.

const MEMBER = {
  id: '1004',
  name: 'Ms Dorothy Ladner',
  photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=faces',
  club: 'Blind Enthusiasm',
  status: 'Active' as 'Active' | 'Cancelled',
  audienceTags: ['Dog Owner', 'Investor'],
  email: 'dorothyladner@gmail.com',
  emailPreferred: true,
  city: 'Seattle, WA',
  zip: '98107',
  lastVisit: 'Mar 15, 2025',
  clubStatus: 'Active',
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

export function MembershipDetailScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  const titleNode = (
    <h1 className="typo-title-screen font-semibold text-vintiga-slate-900 inline-flex items-center gap-vintiga-sm">
      Membership #{MEMBER.id}
      <Tag variant="filled" tone="success" size="md">{MEMBER.status}</Tag>
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
              { label: `Membership #${MEMBER.id}` },
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
            rail={<ClubOverviewRail />}
          >
            <div className="flex flex-col gap-vintiga-lg">
              <CustomerHeaderCard />
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

function CustomerHeaderCard() {
  return (
    <Card>
      <div className="flex items-start gap-vintiga-md">
        <div className="relative shrink-0">
          <Avatar name={MEMBER.name} src={MEMBER.photo} size="lg" />
          <AgeVerifiedBadge memberName={MEMBER.name} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-vintiga-sm">
          <h2 className="typo-title-section font-semibold text-vintiga-slate-900">{MEMBER.name}</h2>

          {/* Club link — IdCard icon prefix (consistent across the app) */}
          <a
            href="#/web/clubs/view/overview"
            className="inline-flex items-center gap-1.5 typo-body font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline w-fit"
          >
            <IdCardIcon className="w-5 h-5 shrink-0" />
            {MEMBER.club}
          </a>

          {/* Audience tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {MEMBER.audienceTags.map((t) => (
              <Tag key={t} variant="outline" tone="default" size="sm">{t}</Tag>
            ))}
          </div>

          {/* Contact + status */}
          <div className="flex flex-col typo-body-sm text-vintiga-slate-700 leading-relaxed pt-vintiga-xs">
            <span>
              {MEMBER.email}
              {MEMBER.emailPreferred && <span className="text-vintiga-slate-500"> | Preferred</span>}
            </span>
            <span>{MEMBER.city}, {MEMBER.zip}</span>
            <span className="text-vintiga-slate-500">Last Visit: {MEMBER.lastVisit}</span>
            <span className="text-vintiga-slate-500">Club Status: {MEMBER.clubStatus}</span>
          </div>
        </div>

        <Button variant="outline" onClick={() => {}} className="shrink-0">Customer Details</Button>
      </div>
    </Card>
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

function ClubOverviewRail() {
  return (
    <RailSection title="Club Overview">
      <div className="flex flex-col gap-vintiga-md">
        {/* Club identity — clickable card linking through to the club view */}
        <a
          href="#/web/clubs/view/overview"
          className="flex items-center gap-vintiga-sm no-underline group"
        >
          <BlindEnthusiasmLogo size={48} className="shrink-0 rounded-vintiga-md" />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="typo-body font-semibold text-vintiga-slate-900 inline-flex items-center gap-1 group-hover:text-vintiga-indigo-700 transition-colors">
              Blind Enthusiasm
              <span className="text-vintiga-slate-400">›</span>
            </span>
            <span className="inline-flex">
              <Tag variant="filled" tone="violet" size="sm">Curated Club</Tag>
            </span>
          </div>
        </a>

        <RailRow label="Signup Date">February 3, 2026 at 09:41 PM</RailRow>
        <RailRow label="Activated Date">February 3, 2026 at 09:41 PM</RailRow>
        <RailRow label="Sales Associate">Geoff Spears</RailRow>
        <RailRow label="Membership ID">#{MEMBER.id}</RailRow>
        <RailRow label="Delivery Method">Pickup</RailRow>
        <RailRow label="Total Orders">6</RailRow>
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
