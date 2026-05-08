import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { SectionCard } from '@ds/shared/SectionCard'
import { RailSection } from '@ds/shared/RightRail'
import { Tag, type TagTone } from '@ds/shared/Tag'
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
  PackageIcon,
  DollarIcon,
} from '@ds/icons/Icons'
import { CUSTOMER, type OrderStatus } from './customerSample'
import { useCustomerDisplayName } from './customerStore'

// ─── OrderDetailScreen ────────────────────────────────────────────────────────
// Drilled down from the customer Overview's Recent Orders table. The route
// resolves the order id from the hash (`#/web/customers/view/orders/{id}`)
// against the canonical customer's `recentOrders` fixture.

const ORDER_STATUS_TONE: Record<OrderStatus, { tone: TagTone; label: string }> = {
  processing: { tone: 'info',    label: 'Processing' },
  pending:    { tone: 'warning', label: 'Pending' },
  completed:  { tone: 'success', label: 'Completed' },
}

function getOrderIdFromHash(): string {
  const m = window.location.hash.match(/^#\/web\/customers\/view\/orders\/([^/?]+)/)
  // Routes drop the leading `#` from the order id; restore it for fixture lookup.
  return m ? `#${decodeURIComponent(m[1])}` : CUSTOMER.recentOrders[0].id
}

export function OrderDetailScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const customerName = useCustomerDisplayName()

  const orderId = getOrderIdFromHash()
  const order = CUSTOMER.recentOrders.find((o) => o.id === orderId) ?? CUSTOMER.recentOrders[0]
  const statusMeta = ORDER_STATUS_TONE[order.status]

  // Order items are not in the fixture — synthesise a small line set from the
  // first few `purchasedProducts` so the screen has plausible content.
  const items = CUSTOMER.purchasedProducts.slice(0, 3)
  const subtotal = items.reduce((sum, p) => sum + p.quantity * Number(p.price.replace(/[^0-9.]/g, '')), 0)

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Customers"
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
              { icon: <BreadcrumbHomeIcon />, href: '#/web/customers' },
              { label: 'Customers',  href: '#/web/customers' },
              { label: customerName, href: '#/web/customers/view/overview' },
              { label: `Order ${order.id}` },
            ]}
            title={
              <h1 className="typo-title-screen font-semibold text-vintiga-slate-900 inline-flex items-center gap-vintiga-sm">
                Order {order.id}
                <Tag variant="filled" tone={statusMeta.tone} size="md">{statusMeta.label}</Tag>
              </h1>
            }
            actions={
              <>
                <Button variant="outline" onClick={() => {}}>Print Receipt</Button>
                <PopoverMenu
                  align="right"
                  width="w-44"
                  trigger={(_open, toggle) => (
                    <IconButton
                      variant="outline"
                      size="md"
                      icon={<EllipsisVerticalIcon />}
                      onClick={toggle}
                      aria-label="Order actions"
                    />
                  )}
                  items={[
                    { label: 'Refund order',    onClick: () => {} },
                    { label: 'Resend receipt',  onClick: () => {} },
                    { label: 'Cancel order',    onClick: () => {}, danger: true },
                  ]}
                />
              </>
            }
            rail={
              <RailSection title="Order Info">
                <div className="flex flex-col gap-vintiga-md">
                  <RailRow label="Customer">{customerName}</RailRow>
                  <RailRow label="Order Date">{order.date}</RailRow>
                  <RailRow label="Total">{order.total}</RailRow>
                  <RailRow label="Sales Channel">Web</RailRow>
                  <RailRow label="Sales Associate">Geoff Spears</RailRow>
                </div>
              </RailSection>
            }
          >
            <div className="flex flex-col gap-vintiga-lg">
              <SectionCard title="Order Items" icon={<PackageIcon />}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader className="w-16">QTY</TableHeader>
                      <TableHeader>Product</TableHeader>
                      <TableHeader className="text-right">Price</TableHeader>
                      <TableHeader className="text-right">Ext</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((p) => {
                      const price = Number(p.price.replace(/[^0-9.]/g, ''))
                      return (
                        <TableRow key={p.id}>
                          <TableCell>{p.quantity}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-vintiga-sm">
                              <div className="w-10 h-10 rounded-vintiga-sm bg-vintiga-surface-element overflow-hidden shrink-0">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                              </div>
                              <span className="typo-body-sm font-semibold text-vintiga-slate-900">{p.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{p.price}</TableCell>
                          <TableCell className="text-right font-medium">${(p.quantity * price).toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </SectionCard>

              <SectionCard title="Order Summary" icon={<DollarIcon />}>
                <div className="flex flex-col gap-vintiga-xs">
                  <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                  <SummaryRow label="Shipping" value="$0.00" />
                  <SummaryRow label="Tax (8.8%)" value={`$${(subtotal * 0.088).toFixed(2)}`} />
                  <div className="flex justify-between border-t border-vintiga-slate-200 pt-vintiga-sm mt-vintiga-xs typo-body font-semibold text-vintiga-slate-900">
                    <span>Total</span><span>{order.total}</span>
                  </div>
                </div>
              </SectionCard>
            </div>
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}

function RailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-vintiga-xs">
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-700">{children}</span>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between typo-body-sm text-vintiga-slate-700">
      <span>{label}</span><span>{value}</span>
    </div>
  )
}
