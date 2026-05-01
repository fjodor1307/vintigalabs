import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDownIcon, SearchIcon } from '@ds/icons/Icons'
import { useProductState, productActions } from './productStore'
import { Thumbnail } from '@ds/shared/Thumbnail'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { RightRail, RailSection } from '@ds/shared/RightRail'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Breadcrumb, BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { SectionCard as DSSectionCard } from '@ds/shared/SectionCard'
import { Field as DSField } from '@ds/shared/Field'

type TabKey = 'general' | 'pos' | 'website' | 'advanced'

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
  const displayName = product.name || 'New experience'

  return (
    <div className="flex items-start gap-5">
      {/* Thumbnail */}
      <div className="w-[128px] h-[128px] shrink-0 rounded-vintiga-lg border border-vintiga-slate-200 overflow-hidden flex items-center justify-center">
        <Thumbnail src={primaryImage?.url} alt="" className="w-full h-full object-cover" />
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
        { value: 'general',   label: 'General',   href: '#/web/experiences/general' },
        { value: 'pos',       label: 'POS',       href: '#/web/experiences/pos' },
        { value: 'website',   label: 'Website',   href: '#/web/experiences/website' },
        { value: 'advanced',  label: 'Advanced',  href: '#/web/experiences/advanced' },
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
  const [collapsed, setCollapsed] = useState(false)

  // ?id=eX  — pre-fill the editor with that catalogue experience.
  // ?new=1  — start a clean editor (used when "Add Experience" is picked from
  //           the products prototype's Add Product modal).
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
    const id = params.get('id')
    if (id) productActions.loadFromCatalogue(id)
    else if (params.get('new')) productActions.startNewProduct('Experience')
  }, [])

  return (
    <div className="flex h-full bg-vintiga-white">
      {/* Experiences live under Products in the IA — keep "Products" highlighted
          here so the sidebar doesn't jump when an experience opens from the
          products catalogue. */}
      <AppSidebar collapsed={collapsed} activeNav="Products" />

      {/* `fixed` Navbar pattern (see DS Navbar.tsx header):
          parent is `relative`, navbar uses `fixed`, scroll sibling has `pt-16`. */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="desktop"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={() => setCollapsed((c) => !c)}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <div className="flex-1 overflow-y-auto pt-16">
          <div className="flex">
            <main className="flex-1 flex flex-col">
              <div className="p-vintiga-xl flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <Breadcrumb
                  items={[
                    { icon: <BreadcrumbHomeIcon />, href: '#/web/experiences/list' },
                    { label: 'Experiences', href: '#/web/experiences/list' },
                    { label: product.name || 'New experience' },
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
