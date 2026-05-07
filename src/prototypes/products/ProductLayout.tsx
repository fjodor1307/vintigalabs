import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { ChevronDownIcon, SearchIcon, EllipsisVerticalIcon } from '@ds/icons/Icons'
import { useProductState, productActions } from './productStore'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { TextField } from '@ds/shared/TextField'
import { RailSection } from '@ds/shared/RightRail'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { SectionCard as DSSectionCard } from '@ds/shared/SectionCard'
import { Field as DSField } from '@ds/shared/Field'

type TabKey = 'general' | 'pos' | 'website' | 'advanced' | 'modifiers'

function ProductActions() {
  return (
    <>
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
    <>
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
    </>
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
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  // If the URL carries ?id=pX (set by row-click on the catalogue), pre-fill the
  // editor with that catalogue product. Runs once per id change.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
    const id = params.get('id')
    if (id) productActions.loadFromCatalogue(id)
  }, [])

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Products"
      />

      {/* `fixed` Navbar pattern (see DS Navbar.tsx header):
          parent is `relative`, navbar uses `fixed`, scroll sibling has `pt-16`. */}
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
              { label: product.name || 'New product' },
            ]}
            title={product.name || 'New product'}
            actions={<ProductActions />}
            tabs={<Tabs active={activeTab} />}
            rail={<RightPanel />}
          >
            {children}
          </PageTemplate>
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

// `TextArea` is kept here as a thin re-export from `@ds/shared/Textarea` so
// existing call sites under `prototypes/products/` keep working. New code
// should import the DS component directly.
export { Textarea as TextArea } from '@ds/shared/Textarea'

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
