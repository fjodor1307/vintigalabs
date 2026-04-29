import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
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
  ChevronRightIcon,
  SidebarIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  XIcon,
  SearchIcon,
  EllipsisIcon,
  UploadIcon,
  ImageIcon,
} from '@ds/icons/Icons'
import { useProductState, productActions } from './productStore'
import { VintigaLogo } from '@ds/shared/VintigaLogo'
import { SegmentedControl } from '@ds/shared/SegmentedControl'

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

function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-vintiga-white border-r border-vintiga-slate-200 flex flex-col h-screen">
      <div className="h-[57px] flex items-center gap-2 px-4 border-b border-vintiga-slate-200">
        <VintigaLogo size={24} />
        <span className="typo-body-sm font-semibold text-vintiga-slate-900">Vintiga Labs, LLC</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">
        {NAV_TOP.map((item) => <NavItem key={item.label} {...item} />)}
        <div className="h-px bg-vintiga-slate-200 my-2" />
        {NAV_BOTTOM_GROUP.map((item) => <NavItem key={item.label} {...item} />)}
      </nav>

      <div className="border-t border-vintiga-slate-200 px-2 py-3 flex flex-col gap-1">
        {NAV_FOOTER.map((item) => <NavItem key={item.label} {...item} />)}
      </div>
    </aside>
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

function TopBar() {
  return (
    <header className="h-[57px] shrink-0 flex items-center justify-between px-6 border-b border-vintiga-slate-200 bg-vintiga-white">
      <button
        type="button"
        className="w-8 h-8 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <SidebarIcon className="w-4 h-4 text-vintiga-slate-500" />
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

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav className="flex items-center gap-1.5 typo-body-sm" aria-label="Breadcrumb">
      <a href="#/web/products/list" className="text-vintiga-slate-500 hover:text-vintiga-slate-700 no-underline flex items-center">
        <HomeIcon className="w-4 h-4" />
      </a>
      <ChevronRightIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />
      <a href="#/web/products/list" className="text-vintiga-slate-500 hover:text-vintiga-slate-700 no-underline">Products</a>
      <ChevronRightIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />
      <span className="text-vintiga-slate-900 font-semibold">{name || 'New product'}</span>
    </nav>
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

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-vintiga-md bg-vintiga-indigo-600 typo-body-sm font-semibold text-vintiga-white hover:bg-vintiga-indigo-700 transition-colors border-none cursor-pointer shadow-vintiga-sm"
        >
          Save
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white flex items-center justify-center hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
          aria-label="More actions"
        >
          <EllipsisIcon className="w-4 h-4 text-vintiga-slate-600" />
        </button>
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

function ImagesPanel() {
  const product = useProductState()
  const fileInput = useRef<HTMLInputElement>(null)

  function openPicker() { fileInput.current?.click() }
  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach((f) => productActions.addImage(f))
    // reset so re-selecting the same file still triggers change
    e.target.value = ''
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="typo-body-sm font-semibold text-vintiga-slate-900">Images</h3>
      <div className="grid grid-cols-3 gap-2">
        {product.images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-slate-50 overflow-hidden group"
          >
            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => productActions.removeImage(img.id)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-vintiga-white/90 border border-vintiga-slate-200 flex items-center justify-center cursor-pointer"
              aria-label={`Remove ${img.name}`}
            >
              <XIcon className="w-3 h-3 text-vintiga-slate-700" />
            </button>
            <div className="absolute top-1 left-1 w-5 h-5 rounded-sm bg-vintiga-white/90 border border-vintiga-slate-200 flex items-center justify-center text-vintiga-slate-400">
              <EllipsisIcon className="w-3 h-3" />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={openPicker}
          className="aspect-square rounded-vintiga-md border border-dashed border-vintiga-slate-300 bg-vintiga-white flex flex-col items-center justify-center gap-1 hover:border-vintiga-indigo-500 hover:bg-vintiga-indigo-50 transition-colors cursor-pointer"
        >
          <UploadIcon className="w-4 h-4 text-vintiga-slate-500" />
          <span className="typo-caption text-vintiga-slate-500 text-center leading-tight">Upload<br />Image</span>
        </button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFiles}
      />
    </section>
  )
}

function RightPanel() {
  return (
    <aside className="w-[260px] shrink-0 p-vintiga-xl flex flex-col gap-8">
      <ImagesPanel />

      <section className="flex flex-col gap-2">
        <h3 className="typo-body-sm font-semibold text-vintiga-slate-900">Status</h3>
        <span className="typo-body-sm text-vintiga-slate-500">Available</span>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="typo-body-sm font-semibold text-vintiga-slate-900">Collections</h3>
          <button
            type="button"
            className="typo-body-sm font-medium text-vintiga-slate-700 border border-vintiga-slate-200 rounded-vintiga-md px-3 py-1 hover:bg-vintiga-slate-50 transition-colors bg-vintiga-white cursor-pointer"
          >
            Create
          </button>
        </div>
        <label className="flex items-center gap-2 border border-vintiga-slate-200 rounded-vintiga-md px-3 h-9 focus-within:border-vintiga-indigo-500 transition-colors cursor-text bg-vintiga-white">
          <SearchIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0" />
          <input
            type="search"
            placeholder="Search"
            className="flex-1 bg-transparent typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 outline-none min-w-0 border-none"
          />
        </label>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="typo-body-sm font-semibold text-vintiga-slate-900">Availability</h3>
        <span className="typo-body-sm text-vintiga-slate-500">Secure To: Public</span>
      </section>
    </aside>
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

  // If the URL carries ?id=pX (set by row-click on the catalogue), pre-fill the
  // editor with that catalogue product. Runs once per id change.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
    const id = params.get('id')
    if (id) productActions.loadFromCatalogue(id)
  }, [])

  return (
    <div className="flex h-screen bg-vintiga-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-vintiga-xl flex flex-col gap-6">
            <Breadcrumb name={product.name} />

            <ProductHeader />

            <Tabs active={activeTab} />

            <div className="flex flex-col gap-6 pb-12">{children}</div>
          </main>

          <RightPanel />
        </div>
      </div>
    </div>
  )
}

// Shared primitives ──────────────────────────────────────────────────────────

export function SectionCard({ title, icon, action, children }: { title: string; icon?: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-vintiga-slate-500">{icon}</span>}
          <h2 className="typo-body-lg font-semibold text-vintiga-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Field({
  label,
  required,
  helper,
  children,
}: {
  label: string
  required?: boolean
  helper?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="typo-body-sm font-medium text-vintiga-slate-700">
        {label}
        {required && <span className="text-vintiga-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {helper && <p className="typo-caption text-vintiga-slate-500">{helper}</p>}
    </div>
  )
}

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
