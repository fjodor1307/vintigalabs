import type { ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { RailSection } from '@ds/shared/RightRail'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { EllipsisVerticalIcon } from '@ds/icons/Icons'

// ─── Shared Experience product-page shell ────────────────────────────────────
// Wraps content in the full Experience editor frame (sidebar + navbar +
// breadcrumb + title + tabs + right rail). Used by the time-slot prototypes
// so we can test how each design looks inside the real layout.

type TabKey = 'general' | 'timeslots' | 'pos' | 'website'

interface ExperienceShellProps {
  /** Product name shown in breadcrumb + page title. */
  title: string
  /** Which tab is currently active. */
  activeTab: TabKey
  /** Hash-route hrefs for the four tabs. */
  tabHrefs: Record<TabKey, string>
  /** Main content rendered under the title row. */
  children: ReactNode
}

function ExperienceTabs({ active, hrefs }: { active: TabKey; hrefs: Record<TabKey, string> }) {
  const options = [
    { value: 'general'   as TabKey, label: 'General',    href: hrefs.general },
    { value: 'timeslots' as TabKey, label: 'Schedule', href: hrefs.timeslots },
    { value: 'pos'       as TabKey, label: 'POS',        href: hrefs.pos },
    { value: 'website'   as TabKey, label: 'Website',    href: hrefs.website },
  ]
  return (
    <SegmentedControl<TabKey>
      value={active}
      aria-label="Product editor tabs"
      options={options}
    />
  )
}

function ProductActions() {
  return (
    <>
      <Button variant="outline" onClick={() => {}}>Cancel</Button>
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
          { label: 'Duplicate', onClick: () => {} },
          { label: 'Archive',   onClick: () => {}, danger: true },
        ]}
      />
    </>
  )
}

function ExperienceRail() {
  return (
    <>
      <RailSection title="Status">
        <span className="typo-body-sm text-vintiga-slate-500">Available</span>
      </RailSection>
      <RailSection title="Availability">
        <span className="typo-body-sm text-vintiga-slate-500">Secure To: Public</span>
      </RailSection>
    </>
  )
}

export function ExperienceShell({ title, activeTab, tabHrefs, children }: ExperienceShellProps) {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Products"
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
        <div className="flex-1 overflow-y-auto pt-16">
          <PageTemplate
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/products/list' },
              { label: 'Products', href: '#/web/products/list' },
              { label: title },
            ]}
            title={title}
            actions={<ProductActions />}
            tabs={<ExperienceTabs active={activeTab} hrefs={tabHrefs} />}
            rail={<ExperienceRail />}
          >
            {children}
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}
