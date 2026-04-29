import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
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
  BellIcon,
  SidebarIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  SearchIcon,
  ImageIcon,
  MenuIcon,
  XIcon,
} from '@ds/icons/Icons'
import { useProductState, productActions } from './productStore'
import { VintigaLogo } from '@ds/shared/VintigaLogo'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { RightRail, RailSection } from '@ds/shared/RightRail'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Breadcrumb, BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { SectionCard as DSSectionCard } from '@ds/shared/SectionCard'
import { Field as DSField } from '@ds/shared/Field'

type TabKey = 'general' | 'pos' | 'website' | 'advanced' | 'modifiers'

const NAV_TOP = [
  { icon: HomeIcon,          label: 'Dashboard' },
  { icon: MessageIcon,       label: 'Sales Chat' },
  { icon: SendIcon,          label: 'Campaigns' },
  { icon: TagIcon,           label: 'Promotions' },
  { icon: GlobeIcon,         label: 'Website', external: true },
  { icon: StarIcon,          label: 'Reviews' },
  { icon: CalendarIcon,      label: 'Events' },
  { icon: ChartIcon,         label: 'Reports' },
] as const

const NAV_BOTTOM_GROUP = [
  { icon: UsersIcon,         label: 'Customers' },
  { icon: PackageIcon,       label: 'Products', active: true, href: '#/web/products/list' },
  { icon: ShoppingCartIcon,  label: 'Orders' },
  { icon: CalendarIcon,      label: 'Reservations' },
  { icon: BookmarkIcon,      label: 'Clubs' },
] as const

const NAV_FOOTER = [
  { icon: UserIcon,     label: 'POS Profiles' },
  { icon: SettingsIcon, label: 'Settings' },
] as const

function SidebarBody({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <>
      <div className="h-16 shrink-0 flex items-center gap-2 px-4 border-b border-vintiga-slate-200">
        <VintigaLogo size={24} />
        <span className="typo-body-sm font-semibold text-vintiga-slate-900">Vintiga Labs, LLC</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1" onClick={onItemClick}>
        {NAV_TOP.map((item) => <NavItem key={item.label} {...item} />)}
        <div className="h-px bg-vintiga-slate-200 my-2" />
        {NAV_BOTTOM_GROUP.map((item) => <NavItem key={item.label} {...item} />)}
      </nav>
      <div className="px-2 py-3 flex flex-col gap-1" onClick={onItemClick}>
        {NAV_FOOTER.map((item) => <NavItem key={item.label} {...item} />)}
      </div>
    </>
  )
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 bg-vintiga-white border-r border-vintiga-slate-200 flex-col h-full">
      <SidebarBody />
    </aside>
  )
}

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="absolute inset-y-0 left-0 w-72 bg-vintiga-white border-r border-vintiga-slate-200 flex flex-col shadow-vintiga-xl animate-slide-in-left">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-3 right-3 w-9 h-9 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-0 cursor-pointer"
        >
          <XIcon className="w-4 h-4 text-vintiga-slate-700" />
        </button>
        <SidebarBody onItemClick={onClose} />
      </aside>
    </div>
  )
}

function NavItem({
  icon: Icon,
  label,
  active,
  external,
  href,
}: {
  icon: typeof HomeIcon
  label: string
  active?: boolean
  external?: boolean
  href?: string
}) {
  const cls = [
    'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-vintiga-md transition-colors cursor-pointer border-none no-underline',
    'typo-body-sm',
    active
      ? 'bg-vintiga-indigo-50 text-vintiga-indigo-700 font-semibold'
      : 'bg-transparent text-vintiga-slate-700 hover:bg-vintiga-slate-50',
  ].join(' ')
  const inner = (
    <>
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-vintiga-indigo-600' : 'text-vintiga-slate-500'}`} />
      <span className="flex-1">{label}</span>
      {external && <ExternalLinkIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />}
    </>
  )
  return href
    ? <a href={href} className={cls}>{inner}</a>
    : <button type="button" className={cls}>{inner}</button>
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
        {/* Burger on mobile, sidebar-collapse glyph on desktop */}
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

function ProductActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="lg">Cancel</Button>
      <Button size="lg">Save</Button>
    </div>
  )
}

function ProductHeader() {
  const product = useProductState()
  const primaryImage = product.images[0]
  const displayName = product.name || 'New product'

  return (
    <div className="flex items-start gap-5">
      {/* Thumbnail */}
      <div className="w-[128px] h-[128px] shrink-0 rounded-vintiga-lg bg-vintiga-slate-50 border border-vintiga-slate-200 overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img src={primaryImage.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-8 h-8 text-vintiga-slate-300" />
        )}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <h1 className="typo-title-section font-semibold text-vintiga-slate-900 truncate">{displayName}</h1>
        <p className="typo-body-sm text-vintiga-slate-500">Product Type: {product.productType}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.collections.map((c) => (
            <span
              key={c}
              className="inline-flex items-center px-2.5 py-1 rounded-full border border-vintiga-slate-200 bg-vintiga-white typo-caption text-vintiga-slate-700"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Tabs({ active }: { active: TabKey }) {
  return (
    <SegmentedControl<TabKey>
      value={active}
      aria-label="Product editor tabs"
      options={[
        { value: 'general',   label: 'General',   href: '#/web/products/general' },
        { value: 'pos',       label: 'POS',       href: '#/web/products/pos' },
        { value: 'website',   label: 'Website',   href: '#/web/products/website' },
        { value: 'advanced',  label: 'Advanced',  href: '#/web/products/advanced' },
        { value: 'modifiers', label: 'Modifiers', href: '#/web/products/modifiers' },
      ]}
    />
  )
}


function RightPanel() {
  return (
    <RightRail>
      <RailSection title="Status">
        <span className="typo-body-sm text-vintiga-slate-500">Available</span>
      </RailSection>

      <RailSection
        title="Collections"
        action={<Button variant="outline" size="sm">Create</Button>}
      >
        <TextField placeholder="Search" leftIcon={<SearchIcon className="w-4 h-4" />} />
      </RailSection>

      <RailSection title="Availability">
        <span className="typo-body-sm text-vintiga-slate-500">Secure To: Public</span>
      </RailSection>
    </RightRail>
  )
}

export function ProductLayout({
  children,
  activeTab,
}: {
  children: ReactNode
  activeTab: TabKey
}) {
  const product = useProductState()
  const [mobileOpen, setMobileOpen] = useState(false)

  // If the URL carries ?id=pX (set by row-click on the catalogue), pre-fill the
  // editor with that catalogue product. Runs once per id change.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
    const id = params.get('id')
    if (id) productActions.loadFromCatalogue(id)
  }, [])

  return (
    <div className="flex h-full bg-vintiga-white">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setMobileOpen(true)} />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-vintiga-xl flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <Breadcrumb
                  items={[
                    { icon: <BreadcrumbHomeIcon />, href: '#/web/products/list' },
                    { label: 'Products', href: '#/web/products/list' },
                    { label: product.name || 'New product' },
                  ]}
                />
                <ProductActions />
              </div>

              <ProductHeader />

              <Tabs active={activeTab} />

              <div className="flex flex-col gap-6 pb-12">{children}</div>
            </div>

            {/* Mobile: right rail stacks under content (hidden on desktop) */}
            <div className="lg:hidden">
              <RightPanel />
            </div>
          </main>

          {/* Desktop: right rail sits beside main */}
          <div className="hidden lg:flex">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

// Shared primitives ──────────────────────────────────────────────────────────
// `SectionCard` and `Field` now live in the design system. Re-exported here so
// existing imports (`from './ProductLayout'`) keep working.
export const SectionCard = DSSectionCard
export const Field = DSField

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white',
        'typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400',
        'focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'px-3 py-2.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white',
        'typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400',
        'focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors',
        'min-h-[72px] resize-y',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function InputWithAdornment({
  adornment,
  side = 'right',
  ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement> & { adornment: ReactNode; side?: 'left' | 'right' }) {
  return (
    <div className="relative">
      <input
        {...inputProps}
        className={[
          'h-10 w-full rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white',
          'typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400',
          'focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors',
          side === 'right' ? 'pl-3 pr-9' : 'pl-9 pr-3',
          inputProps.className ?? '',
        ].join(' ')}
      />
      <span
        className={[
          'absolute top-1/2 -translate-y-1/2 typo-body-sm text-vintiga-slate-400 pointer-events-none',
          side === 'right' ? 'right-3' : 'left-3',
        ].join(' ')}
      >
        {adornment}
      </span>
    </div>
  )
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full px-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 appearance-none focus:outline-none focus:border-vintiga-indigo-500"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDownIcon className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-vintiga-slate-400 pointer-events-none" />
    </div>
  )
}
