import { useState, type ReactNode } from 'react'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Sidebar, SidebarHeader, SidebarBody, SidebarItem, SidebarDivider, SidebarFooter, SidebarBadge } from '@ds/shared/Sidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { Widget } from '@ds/shared/Widget'
import { EmptyState } from '@ds/shared/EmptyState'
import { VintigaIconIndigo } from '@ds/shared/VintigaLogo'
import {
  HomeIcon, MessagesSquareIcon, MailIcon, GiftIcon, GlobeIcon, StarIcon,
  CalendarIcon, TrendUpIcon, UsersIcon, PackageIcon, ShoppingCartIcon,
  CalendarCheckIcon, IdCardIcon, MapPinIcon, SettingsIcon,
  ChevronDownIcon, EllipsisIcon, DollarIcon, GoalIcon, ChartColumnIcon,
  PercentIcon,
} from '@ds/icons/Icons'
import { WelcomeModal } from './WelcomeModal'

const WELCOME_DISMISSED_KEY = 'vintiga-onboarding-welcome-dismissed'

// ─── KPI card with goal progress (first-run, no data yet) ─────────────────────

interface GoalKpiProps {
  label: string
  value: string
  status: string
  goalLabel?: string
  goalPercent?: number
  icon: ReactNode
}

function GoalKpi({ label, value, status, goalLabel = 'No goal set', goalPercent = 0, icon }: GoalKpiProps) {
  return (
    <div className="bg-vintiga-white border border-vintiga-slate-200 rounded-2xl p-vintiga-lg flex flex-col gap-vintiga-md">
      <div className="flex items-start justify-between gap-vintiga-sm">
        <span className="typo-body-sm font-medium text-vintiga-slate-900">{label}</span>
        <div className="w-10 h-10 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between gap-vintiga-sm">
        <p className="text-2xl leading-8 font-semibold text-vintiga-slate-900">{value}</p>
        <span className="typo-caption text-vintiga-slate-500">{status}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between typo-caption text-vintiga-slate-500">
          <span>{goalLabel}</span>
          <span>{goalPercent}%</span>
        </div>
        <div className="h-1.5 bg-vintiga-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-vintiga-indigo-500 rounded-full" style={{ width: `${goalPercent}%` }} />
        </div>
      </div>
    </div>
  )
}

// ─── Page-level dropdown trigger (Woodinville · Today) ───────────────────────

function PageDropdown({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-vintiga-sm px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-300 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 hover:shadow-sm transition-colors cursor-pointer"
    >
      <span className="text-vintiga-slate-500 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      {label}
      <ChevronDownIcon className="w-4 h-4 text-vintiga-slate-500" />
    </button>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardSidebar({ collapsed, onItemClick }: { collapsed: boolean; onItemClick?: () => void }) {
  return (
    <Sidebar collapsed={collapsed} className="h-full">
      <SidebarHeader
        logo={<VintigaIconIndigo size={40} />}
        title={collapsed ? undefined : 'Vintiga Labs, LLC'}
      />
      <SidebarBody>
        <SidebarItem icon={<HomeIcon />}            label="Dashboard"     selected onClick={onItemClick} />
        <SidebarItem icon={<MessagesSquareIcon />}  label="Sales Chat"    onClick={onItemClick} />
        <SidebarItem icon={<MailIcon />}            label="Campaigns"     onClick={onItemClick} />
        <SidebarItem icon={<GiftIcon />}            label="Promotions"    onClick={onItemClick} />
        <SidebarItem icon={<GlobeIcon />}           label="Website" external onClick={onItemClick} />
        <SidebarItem icon={<StarIcon />}            label="Reviews"       onClick={onItemClick} />
        <SidebarItem icon={<CalendarIcon />}        label="Events"        onClick={onItemClick} />
        <SidebarItem icon={<TrendUpIcon />}         label="Reports"       onClick={onItemClick} />
        <SidebarDivider />
        <SidebarItem icon={<UsersIcon />}           label="Customers"     onClick={onItemClick} />
        <SidebarItem icon={<PackageIcon />}         label="Products"
                     href="#/web/products/list"     onClick={onItemClick} />
        <SidebarItem icon={<ShoppingCartIcon />}    label="Orders"        onClick={onItemClick} />
        <SidebarItem icon={<CalendarCheckIcon />}   label="Reservations"
                     badge={!collapsed ? <SidebarBadge>Coming Soon</SidebarBadge> : undefined}
                     onClick={onItemClick} />
        <SidebarItem icon={<IdCardIcon />}          label="Clubs" disabled
                     badge={!collapsed ? <SidebarBadge>Available soon</SidebarBadge> : undefined} />
        <SidebarFooter>
          <SidebarItem icon={<MapPinIcon />}  label="POS Profiles" onClick={onItemClick} />
          <SidebarItem icon={<SettingsIcon />} label="Settings"    onClick={onItemClick} />
        </SidebarFooter>
      </SidebarBody>
    </Sidebar>
  )
}

export function DashboardScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  // Show welcome modal on first visit; remember dismissal in sessionStorage
  // so it doesn't keep popping up while clicking around the prototype.
  // Lazy initial state avoids a redundant render after mount.
  const [welcomeOpen, setWelcomeOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(WELCOME_DISMISSED_KEY) !== '1'
  })

  const closeWelcome = () => {
    sessionStorage.setItem(WELCOME_DISMISSED_KEY, '1')
    setWelcomeOpen(false)
  }

  return (
    <div className="h-screen flex bg-vintiga-slate-50 overflow-hidden">
      <WelcomeModal open={welcomeOpen} onClose={closeWelcome} />

      {/* Desktop sidebar (md+) — inline, takes layout space */}
      <div className="hidden md:flex">
        <DashboardSidebar collapsed={collapsed} />
      </div>

      {/* Mobile sidebar (<md) — fixed overlay drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} aria-hidden="true" />
          <div className="relative h-full animate-slide-in-left">
            <DashboardSidebar collapsed={false} onItemClick={closeMobile} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          device="responsive"
          user={{ name: 'Tom Cook', initials: 'TC' }}
          hasNotifications
          onMenuToggle={onMenuToggle}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />

        <div className="flex-1 overflow-y-auto p-vintiga-xl flex flex-col gap-vintiga-lg">
          {/* Page header */}
          <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
            <h1 className="typo-title-section font-semibold text-vintiga-slate-900">Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setWelcomeOpen(true)}>Replay welcome</Button>
              <PageDropdown icon={<MapPinIcon />}  label="Woodinville" />
              <PageDropdown icon={<CalendarIcon />} label="Today" />
            </div>
          </div>

          {/* KPIs widget */}
          <Widget
            title="KPIs"
            description="Key metrics for today's tasting room performance."
            actions={<Button size="sm" leftIcon={<GoalIcon />}>Set Goals</Button>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-vintiga-md">
              <GoalKpi label="Total Revenue"  value="$0" status="Awaiting first sale"   icon={<DollarIcon />} />
              <GoalKpi label="Orders"         value="0"  status="Awaiting first guest"  icon={<ShoppingCartIcon />} />
              <GoalKpi label="Guests"         value="0"  status="Awaiting first guest"  icon={<UsersIcon />} />
              <GoalKpi label="Club Sign-ups"  value="0"  status="Awaiting first sign-up" icon={<TrendUpIcon />} />
            </div>
          </Widget>

          {/* Staff Performance */}
          <Widget
            title="Staff Performance"
            description="Sales and club sign-ups per staff member."
            actions={<IconButton variant="outline" size="sm" icon={<EllipsisIcon />} aria-label="More" />}
          >
            <EmptyState
              bordered={false}
              icon={<TrendUpIcon />}
              title="No activity yet"
              description="Metrics will appear once service begins."
            />
          </Widget>

          {/* Sales by day */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-vintiga-md">
            <Widget title="Sales pace" description="Last 7 days vs your goal.">
              <EmptyState
                bordered={false}
                icon={<ChartColumnIcon />}
                title="No sales yet"
                description="Once you ring up your first ticket, the daily breakdown will appear here."
              />
            </Widget>
            <div className="lg:col-span-2">
              <Widget title="Daily breakdown" description="Channel mix across the week.">
                {/* Bar chart placeholder — 7 days */}
                <div className="w-full h-[280px] flex items-end justify-between gap-vintiga-sm border-b border-vintiga-slate-200 px-vintiga-sm">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                    <div key={d} className="flex-1 flex flex-col items-center gap-vintiga-sm">
                      <div className="w-full max-w-[52px] flex flex-col-reverse rounded-t-vintiga-sm overflow-hidden bg-vintiga-slate-50 h-full" />
                      <span className="typo-caption text-vintiga-slate-500">{d}</span>
                    </div>
                  ))}
                </div>
                <p className="typo-caption text-vintiga-slate-400 text-center">Bars populate once you have orders for each day.</p>
              </Widget>
            </div>
          </div>

          {/* Three first-run empty cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-md">
            <Widget title="Conversion" description="From visit to order.">
              <EmptyState
                bordered={false}
                icon={<PercentIcon />}
                title="No conversions yet"
                description="We'll start tracking once visitors begin checking out."
              />
            </Widget>
            <Widget title="Top products" description="Best sellers this period.">
              <EmptyState
                bordered={false}
                icon={<TrendUpIcon />}
                title="No top sellers yet"
                description="Your bestsellers will rank here once orders flow in."
              />
            </Widget>
            <Widget title="Inventory" description="Low-stock alerts.">
              <EmptyState
                bordered={false}
                icon={<PackageIcon />}
                title="Inventory looks good"
                description="No low-stock items to flag right now."
              />
            </Widget>
          </div>

          {/* Reviews + Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-vintiga-md">
            <Widget title="Reviews" description="Guest sentiment.">
              <EmptyState
                bordered={false}
                icon={<StarIcon />}
                title="No reviews yet"
                description="Once your first guests check out you'll see ratings and quotes here."
              />
            </Widget>
            <div className="lg:col-span-2">
              <Widget title="Customers" description="New and returning guests.">
                <EmptyState
                  bordered={false}
                  icon={<UsersIcon />}
                  title="No customers yet"
                  description="Add your first customer or import from a previous platform to get started."
                  action={<Button size="sm">Add customer</Button>}
                  secondaryAction={<Button variant="outline" size="sm">Import</Button>}
                />
              </Widget>
            </div>
          </div>

          {/* Bottom KPI strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-md">
            <GoalKpi label="Avg. ticket"   value="$0" status="Awaiting first sale"  icon={<DollarIcon />} />
            <GoalKpi label="Repeat guests" value="0%" status="Awaiting first guest" icon={<UsersIcon />} />
            <GoalKpi label="Club tier mix" value="—"  status="No members yet"       icon={<IdCardIcon />} />
          </div>
        </div>
      </div>
    </div>
  )
}
