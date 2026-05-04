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
  { icon: <MessageIcon />,  label: 'Sales Chat' },
  { icon: <SendIcon />,     label: 'Campaigns' },
  { icon: <TagIcon />,      label: 'Promotions' },
  { icon: <GlobeIcon />,    label: 'Website', external: true },
  { icon: <StarIcon />,     label: 'Reviews' },
  { icon: <CalendarIcon />, label: 'Events' },
  { icon: <ChartIcon />,    label: 'Reports' },
]

const NAV_BOTTOM_GROUP: NavItemDef[] = [
  { icon: <UsersIcon />,        label: 'Customers' },
  { icon: <PackageIcon />,      label: 'Products', href: '#/web/products/list' },
  { icon: <ShoppingCartIcon />, label: 'Orders' },
  { icon: <CalendarIcon />,     label: 'Reservations' },
  { icon: <BookmarkIcon />,     label: 'Clubs' },
]

const NAV_FOOTER: NavItemDef[] = [
  { icon: <UserIcon />,     label: 'POS Profiles' },
  { icon: <SettingsIcon />, label: 'Settings' },
]

export interface AppSidebarProps {
  /** When true, the sidebar shrinks to icon-only (72px). */
  collapsed?: boolean
  /**
   * Label of the currently selected top-level nav item. Sub-flows that don't
   * have their own entry should pass the parent's label so the right item
   * stays highlighted.
   */
  activeNav?: string
}

export function AppSidebar({ collapsed = false, activeNav = 'Products' }: AppSidebarProps) {
  return (
    <Sidebar collapsed={collapsed}>
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
          />
        ))}
        <SidebarFooter>
          {NAV_FOOTER.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </SidebarFooter>
      </SidebarBody>
    </Sidebar>
  )
}
