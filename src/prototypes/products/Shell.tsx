import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  HomeIcon,
  MenuIcon,
  XIcon,
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
  BellIcon,
  SidebarIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
} from '@ds/icons/Icons'
import { VintigaLogo } from '@ds/shared/VintigaLogo'

// Nav items can carry an `href` to navigate. Items without `href` are visual placeholders.
interface NavItemDef {
  icon: typeof HomeIcon
  label: string
  href?: string
  external?: boolean
}

const NAV_TOP: NavItemDef[] = [
  { icon: HomeIcon,     label: 'Dashboard' },
  { icon: MessageIcon,  label: 'Sales Chat' },
  { icon: SendIcon,     label: 'Campaigns' },
  { icon: TagIcon,      label: 'Promotions' },
  { icon: GlobeIcon,    label: 'Website', external: true },
  { icon: StarIcon,     label: 'Reviews' },
  { icon: CalendarIcon, label: 'Events' },
  { icon: ChartIcon,    label: 'Reports' },
]

const NAV_BOTTOM_GROUP: NavItemDef[] = [
  { icon: UsersIcon,        label: 'Customers' },
  { icon: PackageIcon,      label: 'Products', href: '#/web/products/list' },
  { icon: ShoppingCartIcon, label: 'Orders' },
  { icon: CalendarIcon,     label: 'Reservations' },
  { icon: BookmarkIcon,     label: 'Clubs' },
]

const NAV_FOOTER: NavItemDef[] = [
  { icon: UserIcon,     label: 'POS Profiles' },
  { icon: SettingsIcon, label: 'Settings' },
]

function NavItem({ icon: Icon, label, href, external, active }: NavItemDef & { active?: boolean }) {
  const cls = [
    'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-vintiga-md transition-colors cursor-pointer border-none typo-body-sm no-underline',
    active
      ? 'bg-vintiga-indigo-50 text-vintiga-indigo-700 font-semibold'
      : 'bg-transparent text-vintiga-slate-700 hover:bg-vintiga-slate-50',
  ].join(' ')
  const iconCls = `w-4 h-4 shrink-0 ${active ? 'text-vintiga-indigo-600' : 'text-vintiga-slate-500'}`

  const inner = (
    <>
      <Icon className={iconCls} />
      <span className="flex-1">{label}</span>
      {external && <ExternalLinkIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />}
    </>
  )

  if (href) {
    return <a href={href} className={cls}>{inner}</a>
  }
  return <button type="button" className={cls}>{inner}</button>
}

function SidebarBody({ activeNav, onItemClick }: { activeNav?: string; onItemClick?: () => void }) {
  return (
    <>
      <div className="h-16 shrink-0 flex items-center gap-2 px-4 border-b border-vintiga-slate-200">
        <VintigaLogo size={24} />
        <span className="typo-body-sm font-semibold text-vintiga-slate-900">Vintiga Labs, LLC</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1" onClick={onItemClick}>
        {NAV_TOP.map((item) => <NavItem key={item.label} {...item} active={activeNav === item.label} />)}
        <div className="h-px bg-vintiga-slate-200 my-2" />
        {NAV_BOTTOM_GROUP.map((item) => <NavItem key={item.label} {...item} active={activeNav === item.label} />)}
      </nav>
      <div className="px-2 py-3 flex flex-col gap-1" onClick={onItemClick}>
        {NAV_FOOTER.map((item) => <NavItem key={item.label} {...item} active={activeNav === item.label} />)}
      </div>
    </>
  )
}

function Sidebar({ activeNav }: { activeNav?: string }) {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 bg-vintiga-white border-r border-vintiga-slate-200 flex-col h-full">
      <SidebarBody activeNav={activeNav} />
    </aside>
  )
}

function MobileSidebar({ open, onClose, activeNav }: { open: boolean; onClose: () => void; activeNav?: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <aside className="absolute inset-y-0 left-0 w-72 bg-vintiga-white border-r border-vintiga-slate-200 flex flex-col shadow-vintiga-xl animate-slide-in-left">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-3 right-3 w-9 h-9 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-0 cursor-pointer"
        >
          <XIcon className="w-4 h-4 text-vintiga-slate-700" />
        </button>
        <SidebarBody activeNav={activeNav} onItemClick={onClose} />
      </aside>
    </div>
  )
}

function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-vintiga-slate-200 bg-vintiga-white">
      <button
        type="button"
        onClick={onMenuToggle}
        className="w-9 h-9 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
        aria-label="Open menu"
      >
        <MenuIcon className="w-5 h-5 text-vintiga-slate-700 lg:hidden" />
        <SidebarIcon className="w-5 h-5 text-vintiga-slate-700 hidden lg:inline" />
      </button>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
          aria-label="Notifications"
        >
          <BellIcon className="w-4 h-4 text-vintiga-slate-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-vintiga-slate-200 flex items-center justify-center overflow-hidden">
            <span className="typo-caption font-semibold text-vintiga-slate-600">TC</span>
          </div>
          <span className="typo-body-sm font-semibold text-vintiga-slate-900">Tom Cook</span>
          <ChevronDownIcon className="w-4 h-4 text-vintiga-slate-500" />
        </div>
      </div>
    </header>
  )
}

export function Shell({
  children,
  bg = 'white',
  activeNav = 'Products',
}: {
  children: ReactNode
  bg?: 'white' | 'slate'
  activeNav?: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex h-full bg-vintiga-white">
      <Sidebar activeNav={activeNav} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} activeNav={activeNav} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setMobileOpen(true)} />
        <main className={`flex-1 overflow-y-auto flex flex-col ${bg === 'slate' ? 'bg-vintiga-slate-50' : 'bg-vintiga-white'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
