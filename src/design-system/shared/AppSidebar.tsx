import {
  HomeIcon,
  MessageIcon,
  SendIcon,
  TagIcon,
  GlobeIcon,
  StarIcon,
  CalendarIcon,
  ChartIcon,
  UsersIcon,
  PackageIcon,
  ShoppingCartIcon,
  BookmarkIcon,
  UserIcon,
  SettingsIcon,
} from '@ds/icons/Icons'
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarItem,
  SidebarDivider,
  SidebarFooter,
} from '@ds/shared/Sidebar'
import { VintigaIconIndigo } from '@ds/shared/VintigaLogo'
import type { ReactNode } from 'react'

// ─── Vintiga app sidebar ──────────────────────────────────────────────────────
// Single source of truth for the Vintiga dashboard's sidebar navigation. Used
// by every prototype that lives inside the Vintiga app shell — so the chrome
// can't drift between flows.
//
// Usage:
//   <AppSidebar collapsed={collapsed} activeNav="Products" />
//
// `activeNav` is matched against the item label. Sub-flows that don't have
// their own top-level nav entry should pass the parent label so the right
// item stays highlighted.

interface NavItemDef {
  icon: ReactNode
  label: string
  href?: string
  external?: boolean
}

const NAV_TOP: NavItemDef[] = [
  { icon: <HomeIcon />,     label: 'Dashboard' },
  { icon: <MessageIcon />,  label: 'Sales Chat', href: '#/web/sales-chat' },
  { icon: <SendIcon />,     label: 'Campaigns' },
  { icon: <TagIcon />,      label: 'Promotions' },
  { icon: <GlobeIcon />,    label: 'Website', external: true },
  { icon: <StarIcon />,     label: 'Reviews' },
  { icon: <CalendarIcon />, label: 'Events' },
  { icon: <ChartIcon />,    label: 'Reports' },
]

const NAV_BOTTOM_GROUP: NavItemDef[] = [
  { icon: <UsersIcon />,        label: 'Customers', href: '#/web/customers' },
  { icon: <PackageIcon />,      label: 'Products',  href: '#/web/products/list' },
  { icon: <ShoppingCartIcon />, label: 'Orders' },
  { icon: <CalendarIcon />,     label: 'Reservations', href: '#/web/reservations' },
  { icon: <BookmarkIcon />,     label: 'Clubs',     href: '#/web/clubs' },
]

const NAV_FOOTER: NavItemDef[] = [
  { icon: <UserIcon />,     label: 'POS Profiles', href: '#/web/pos-profiles/list' },
  { icon: <SettingsIcon />, label: 'Settings', href: '#/web/settings' },
]

export interface AppSidebarProps {
  /** When true (and md+), the sidebar shrinks to icon-only (72px). */
  collapsed?: boolean
  /**
   * Mobile drawer state. When true (sub-md), the sidebar slides in as a
   * fixed overlay with a backdrop. Ignored md+ — the inline desktop sidebar
   * is always visible there.
   */
  mobileOpen?: boolean
  /** Called when the mobile backdrop or any nav item is tapped. */
  onMobileClose?: () => void
  /**
   * Label of the currently selected top-level nav item. Sub-flows that don't
   * have their own entry should pass the parent's label so the right item
   * stays highlighted.
   */
  activeNav?: string
}

/** Internal — the same nav contents render in both the inline desktop sidebar
 *  and the mobile overlay drawer, so extract once. */
function AppSidebarInner({
  collapsed,
  activeNav,
  onItemClick,
}: {
  collapsed: boolean
  activeNav: string
  onItemClick?: () => void
}) {
  return (
    <Sidebar collapsed={collapsed} className="h-full">
      <SidebarHeader
        logo={<VintigaIconIndigo size={40} />}
        title={collapsed ? undefined : 'Vintiga Labs, LLC'}
      />
      <SidebarBody>
        {NAV_TOP.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            external={item.external}
            selected={activeNav === item.label}
            href={item.href}
            onClick={onItemClick}
          />
        ))}
        <SidebarDivider />
        {NAV_BOTTOM_GROUP.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            selected={activeNav === item.label}
            href={item.href}
            onClick={onItemClick}
          />
        ))}
        <SidebarFooter>
          {NAV_FOOTER.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              selected={activeNav === item.label}
              href={item.href}
              onClick={onItemClick}
            />
          ))}
        </SidebarFooter>
      </SidebarBody>
    </Sidebar>
  )
}

export function AppSidebar({
  collapsed = false,
  mobileOpen = false,
  onMobileClose,
  activeNav = 'Products',
}: AppSidebarProps) {
  return (
    <>
      {/* Desktop (md+) — inline sidebar that takes layout space. */}
      <div className="hidden md:flex">
        <AppSidebarInner collapsed={collapsed} activeNav={activeNav} />
      </div>

      {/* Mobile (<md) — fixed overlay drawer. Backdrop dismisses; tapping a
          nav item also dismisses so the user lands on their target without
          the drawer left open. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative h-full animate-slide-in-left">
            <AppSidebarInner collapsed={false} activeNav={activeNav} onItemClick={onMobileClose} />
          </div>
        </div>
      )}
    </>
  )
}
