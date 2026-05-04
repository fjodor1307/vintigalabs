import { useState, type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { KpiCard } from '@ds/shared/KpiCard'
import { Widget } from '@ds/shared/Widget'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import {
  UsersIcon,
  UserIcon,
  UsersGroupIcon,
  GemIcon,
  UserXIcon,
} from '@ds/icons/Icons'

// ─── Clubs layout ─────────────────────────────────────────────────────────────
// Shared chrome for every Clubs tab. Renders the Vintiga shell, the page
// header, the KPI strip, then a Widget that hosts the active tab's content.
// Each tab screen passes its own `children` in.

export type ClubsTab = 'clubs' | 'memberships' | 'emails'

const TAB_OPTIONS = [
  { value: 'clubs'       as ClubsTab, label: 'Clubs',       href: '#/web/clubs' },
  { value: 'memberships' as ClubsTab, label: 'Memberships', href: '#/web/clubs/memberships' },
  { value: 'emails'      as ClubsTab, label: 'Club Emails', href: '#/web/clubs/emails' },
]

// Static demo numbers — wire these up to a store later if a real prototype calls for it.
const KPIS = [
  { label: 'Active Members',   value: '95', icon: <UsersIcon /> },
  { label: 'On-hold Members',  value: '12', icon: <UserIcon /> },
  { label: 'Pending',          value: '14', icon: <UsersGroupIcon /> },
  { label: 'New Members',      value: '50', icon: <GemIcon /> },
  { label: 'Canceled Members', value: '10', icon: <UserXIcon /> },
]

export function ClubsLayout({
  activeTab,
  children,
}: {
  activeTab: ClubsTab
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar collapsed={collapsed} activeNav="Clubs" />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="desktop"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={() => setCollapsed((c) => !c)}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <main className="flex-1 overflow-y-auto flex flex-col pt-16 bg-vintiga-slate-50">
          <div className="p-vintiga-xl flex flex-col gap-vintiga-xl flex-1 min-h-0">
            {/* Page header */}
            <div>
              <h1 className="typo-title-screen font-semibold text-vintiga-slate-900">Clubs</h1>
              <p className="typo-body-sm text-vintiga-slate-500 mt-1">
                Manage club offerings and memberships. New and cancelled memberships show activity from the past 30 days.
              </p>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-vintiga-md">
              {KPIS.map((k) => (
                <KpiCard key={k.label} label={k.label} value={k.value} icon={k.icon} />
              ))}
            </div>

            {/* Tabbed widget */}
            <Widget>
              <SegmentedControl<ClubsTab>
                value={activeTab}
                options={TAB_OPTIONS}
                aria-label="Clubs section"
              />
              {children}
            </Widget>
          </div>
        </main>
      </div>
    </div>
  )
}
