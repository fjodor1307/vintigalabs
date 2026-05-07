import { useState } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { Avatar } from '@ds/shared/Avatar'
import { Tag, type TagTone } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { KpiCard } from '@ds/shared/KpiCard'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@ds/shared/Table'
import {
  ShieldCheckIcon,
  IdCardIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PackageIcon,
  DollarIcon,
  GemIcon,
  WalletIcon,
  UsersIcon,
  TrendUpIcon,
} from '@ds/icons/Icons'
import { CUSTOMER, type OrderStatus } from './customerSample'
import {
  useCustomerProfile,
  useCustomerDisplayName,
  useAccountBalance,
  useLoyaltyPoints,
} from './customerStore'
import { UpdateCustomerModal } from './UpdateCustomerModal'
import { DeleteCustomerModal } from './DeleteCustomerModal'

// ─── Customer Overview screen (Figma 5678:24811) ─────────────────────────────
// Header card → six-up Customer Insights → Recent Orders table → Purchased
// Products grid. Right rail (Notes + Tags) is rendered by the layout.

const ORDER_STATUS_TONE: Record<OrderStatus, { tone: TagTone; label: string }> = {
  processing: { tone: 'info',    label: 'Processing' },
  pending:    { tone: 'warning', label: 'Pending' },
  completed:  { tone: 'success', label: 'Completed' },
}

function HeaderCard() {
  const profile = useCustomerProfile()
  const displayName = useCustomerDisplayName()

  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const location = [profile.city, profile.state, profile.zipCode].filter(Boolean).join(', ')

  return (
    <>
      <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-lg flex items-start gap-vintiga-lg">
        {/* Avatar with verified badge */}
        <div className="relative shrink-0">
          <Avatar name={displayName} src={CUSTOMER.avatarUrl} size="xl" />
          {CUSTOMER.verified && (
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-vintiga-indigo-500 border-2 border-vintiga-white flex items-center justify-center text-vintiga-white [&>svg]:w-3.5 [&>svg]:h-3.5"
              aria-label="Verified"
            >
              <ShieldCheckIcon />
            </span>
          )}
        </div>

        {/* Identity + meta */}
        <div className="flex-1 min-w-0 flex flex-col gap-vintiga-sm">
          <div className="flex flex-col gap-1">
            <h2 className="typo-title-section font-semibold text-vintiga-slate-900">{displayName}</h2>
            <span className="inline-flex items-center gap-1.5 typo-body-sm text-vintiga-indigo-600 font-medium">
              <IdCardIcon className="w-4 h-4" />
              {CUSTOMER.club}
            </span>
          </div>

          <div className="flex flex-wrap gap-vintiga-xs">
            {CUSTOMER.tags.map((t) => (
              <Tag key={t} variant="outline" size="md">{t}</Tag>
            ))}
          </div>

          <dl className="flex flex-col gap-1 typo-body-sm text-vintiga-slate-700">
            <div>
              {profile.email}
              {profile.emailPreferred && (
                <span className="text-vintiga-slate-400"> | Preferred</span>
              )}
            </div>
            {location && <div>{location}</div>}
            <div>Last Visit: {CUSTOMER.lastVisit}</div>
            <div>Club Status: {CUSTOMER.clubStatus}</div>
          </dl>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-vintiga-sm shrink-0">
          <Button leftIcon={<PencilIcon />} onClick={() => setUpdateOpen(true)}>Update</Button>
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
              { label: 'View History', onClick: () => {} },
              { label: 'Delete', onClick: () => setDeleteOpen(true), danger: true },
            ]}
          />
        </div>
      </section>

      <UpdateCustomerModal open={updateOpen} onClose={() => setUpdateOpen(false)} />
      <DeleteCustomerModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  )
}

function CustomerInsights() {
  const i = CUSTOMER.insights
  const balance = useAccountBalance()
  const points  = useLoyaltyPoints()

  return (
    <section className="flex flex-col gap-vintiga-md">
      <h3 className="typo-title-section font-semibold text-vintiga-slate-900">Customer Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
        <KpiCard size="sm" label="Purchased Products" value={i.purchasedProducts} icon={<PackageIcon />} />
        <KpiCard size="sm" label="LTV"                value={i.ltv}                icon={<DollarIcon />} />
        <KpiCard size="sm" label="AOV"                value={i.aov}                icon={<TrendUpIcon />} />
        <KpiCard size="sm" label="Total Visits"       value={i.totalVisits}        icon={<UsersIcon />} />
        <KpiCard
          size="sm"
          label="Account Balance"
          value={`$${balance.toFixed(2)}`}
          icon={<WalletIcon />}
          href="#/web/customers/view/billing/balance"
        />
        <KpiCard
          size="sm"
          label="Loyalty Points"
          value={points.toLocaleString()}
          icon={<GemIcon />}
          href="#/web/customers/view/billing/points"
        />
      </div>
    </section>
  )
}

function RecentOrders() {
  return (
    <section className="flex flex-col gap-vintiga-md">
      <div className="flex items-center justify-between">
        <h3 className="typo-title-section font-semibold text-vintiga-slate-900">Recent Orders</h3>
        <Button variant="outline" size="md" onClick={() => {}}>View All</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Order ID</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Total</TableHeader>
            <TableHeader className="w-12" />
          </TableRow>
        </TableHead>
        <TableBody>
          {CUSTOMER.recentOrders.map((o) => {
            const meta = ORDER_STATUS_TONE[o.status]
            return (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell className="text-vintiga-slate-500">{o.date}</TableCell>
                <TableCell>
                  <Tag variant="filled" tone={meta.tone} size="sm">{meta.label}</Tag>
                </TableCell>
                <TableCell className="text-right font-medium">{o.total}</TableCell>
                <TableCell className="text-right">
                  <IconButton
                    variant="outline"
                    size="sm"
                    icon={<EllipsisVerticalIcon />}
                    onClick={() => {}}
                    aria-label={`More options for ${o.id}`}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

function PurchasedProducts() {
  return (
    <section className="flex flex-col gap-vintiga-md">
      <div className="flex items-center justify-between">
        <h3 className="typo-title-section font-semibold text-vintiga-slate-900">Purchased Products</h3>
        <div className="flex items-center gap-vintiga-xs">
          <IconButton
            variant="outline"
            size="sm"
            icon={<ChevronLeftIcon />}
            onClick={() => {}}
            aria-label="Previous products"
          />
          <IconButton
            variant="outline"
            size="sm"
            icon={<ChevronRightIcon />}
            onClick={() => {}}
            aria-label="Next products"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-vintiga-md">
        {CUSTOMER.purchasedProducts.map((p) => (
          <article
            key={p.id}
            className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden bg-vintiga-white flex flex-col"
          >
            <div className="aspect-square bg-vintiga-slate-50">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-vintiga-md flex flex-col gap-vintiga-xs">
              <p className="typo-body-sm font-semibold text-vintiga-slate-900 truncate">{p.name}</p>
              <div className="flex items-center justify-between typo-caption text-vintiga-slate-500">
                <span>{p.quantity}×</span>
                <span className="font-semibold text-vintiga-slate-900">{p.price}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function CustomerOverviewScreen() {
  return (
    <CustomerViewLayout activeTab="overview" hideTitle actions={<></>}>
      <div className="flex flex-col gap-vintiga-xl">
        <HeaderCard />
        <CustomerInsights />
        <RecentOrders />
        <PurchasedProducts />
      </div>
    </CustomerViewLayout>
  )
}
