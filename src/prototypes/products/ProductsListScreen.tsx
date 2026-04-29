import { useState, useRef, useEffect } from 'react'
import { OverviewLayout } from './OverviewLayout'
import { useProductState } from './productStore'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { Checkbox } from '@ds/shared/Checkbox'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { DropdownMenu, DropdownItem, DropdownSeparator } from '@ds/shared/Dropdown'
import {
  PlusIcon,
  SearchIcon,
  ChevronDownIcon,
  EllipsisIcon,
  ImageIcon,
  BoxIcon,
  BottleWineIcon,
  BeerIcon,
  MartiniIcon,
  PartyPopperIcon,
  ShirtIcon,
  HandHeartIcon,
  WineIcon,
  SandwichIcon,
  CalendarIcon,
  PackageOpenIcon,
  GiftIcon,
  NotebookPenIcon,
  TicketIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExportIcon,
  XIcon,
} from '@ds/icons/Icons'

type ProductFilter =
  | 'all' | 'wines' | 'beer' | 'spirits' | 'events'
  | 'merch' | 'experiences' | 'tastings' | 'food'
  | 'bookings' | 'bundles' | 'gifts' | 'vouchers' | 'tickets'

const TYPE_FILTER_OPTIONS = [
  { value: 'all'         as ProductFilter, label: 'All',          icon: <BoxIcon          className="w-3.5 h-3.5" /> },
  { value: 'wines'       as ProductFilter, label: 'Wines',        icon: <BottleWineIcon   className="w-3.5 h-3.5" /> },
  { value: 'beer'        as ProductFilter, label: 'Beer',         icon: <BeerIcon         className="w-3.5 h-3.5" /> },
  { value: 'spirits'     as ProductFilter, label: 'Spirits',      icon: <MartiniIcon      className="w-3.5 h-3.5" /> },
  { value: 'events'      as ProductFilter, label: 'Events',       icon: <PartyPopperIcon  className="w-3.5 h-3.5" /> },
  { value: 'merch'       as ProductFilter, label: 'Merchandise',  icon: <ShirtIcon        className="w-3.5 h-3.5" /> },
  { value: 'experiences' as ProductFilter, label: 'Experiences',  icon: <HandHeartIcon    className="w-3.5 h-3.5" /> },
  { value: 'tastings'    as ProductFilter, label: 'Tastings',     icon: <WineIcon         className="w-3.5 h-3.5" /> },
  { value: 'food'        as ProductFilter, label: 'Food',         icon: <SandwichIcon     className="w-3.5 h-3.5" /> },
  { value: 'bookings'    as ProductFilter, label: 'Bookings',     icon: <CalendarIcon     className="w-3.5 h-3.5" /> },
  { value: 'bundles'     as ProductFilter, label: 'Bundles',      icon: <PackageOpenIcon  className="w-3.5 h-3.5" /> },
  { value: 'gifts'       as ProductFilter, label: 'Gifts',        icon: <GiftIcon         className="w-3.5 h-3.5" /> },
  { value: 'vouchers'    as ProductFilter, label: 'Vouchers',     icon: <NotebookPenIcon  className="w-3.5 h-3.5" /> },
  { value: 'tickets'     as ProductFilter, label: 'Tickets',      icon: <TicketIcon       className="w-3.5 h-3.5" /> },
]

// ─── Reusable hook: close on outside click ─────────────────────────────────

function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])
  return ref
}

// ─── Status filter dropdown ────────────────────────────────────────────────

function StatusFilter() {
  const [open, setOpen]           = useState(false)
  const [active, setActive]       = useState(true)
  const [inactive, setInactive]   = useState(false)
  const [applied, setApplied]     = useState({ active: true, inactive: false })
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

  const hasFilter = applied.active || applied.inactive
  const count = (applied.active ? 1 : 0) + (applied.inactive ? 1 : 0)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'inline-flex items-center gap-1.5 px-3 py-2 rounded-vintiga-md border typo-body-sm transition-colors cursor-pointer',
          hasFilter
            ? 'bg-vintiga-indigo-50 border-vintiga-indigo-200 text-vintiga-indigo-700'
            : 'bg-vintiga-white border-vintiga-slate-200 text-vintiga-slate-700 hover:bg-vintiga-slate-50',
        ].join(' ')}
      >
        Status
        {hasFilter && (
          <span className="w-4 h-4 rounded-full bg-vintiga-indigo-600 text-vintiga-white text-[10px] font-semibold flex items-center justify-center">
            {count}
          </span>
        )}
        <ChevronDownIcon className="w-3.5 h-3.5" />
      </button>

      {open && (
        <DropdownMenu className="absolute top-full mt-1.5 right-0 z-50 w-48 gap-1 p-3">
          <p className="typo-body-sm font-medium text-vintiga-slate-900 px-1 pb-1">Filter by Status</p>
          <label className="flex items-center gap-2 cursor-pointer px-2 py-1">
            <Checkbox size="sm" checked={active} onChange={() => setActive((v) => !v)} />
            <span className="typo-body-sm font-medium text-vintiga-slate-900">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer px-2 py-1">
            <Checkbox size="sm" checked={inactive} onChange={() => setInactive((v) => !v)} />
            <span className="typo-body-sm font-medium text-vintiga-slate-900">Inactive</span>
          </label>
          <DropdownSeparator />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setActive(false); setInactive(false); setApplied({ active: false, inactive: false }); setOpen(false) }}
              className="flex-1 px-2.5 py-1.5 rounded-[4px] border border-vintiga-slate-300 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => { setApplied({ active, inactive }); setOpen(false) }}
              className="flex-1 px-2.5 py-1.5 rounded-[4px] border border-vintiga-slate-300 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </DropdownMenu>
      )}
    </div>
  )
}

// ─── Export modal ──────────────────────────────────────────────────────────

function ExportModal({ count, onClose }: { count: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Dialog */}
      <div className="relative bg-vintiga-white rounded-vintiga-xl shadow-vintiga-xl w-full max-w-md mx-4 p-vintiga-lg flex flex-col gap-vintiga-md">
        <div className="flex items-center justify-between gap-vintiga-md">
          <h2 className="typo-title-section font-semibold text-vintiga-slate-900">Export Products</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Close"
          >
            <XIcon className="w-4 h-4 text-vintiga-slate-500" />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="typo-body-sm font-semibold text-vintiga-slate-900">Export CSV ({count} Wines)</p>
          <p className="typo-body-sm text-vintiga-slate-500">You'll receive an email when the export is ready.</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-vintiga-sm border-t border-vintiga-slate-100">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Export {count} Wines</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Actions dropdown ──────────────────────────────────────────────────────

function ActionsDropdown({ onExport }: { onExport: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
      >
        Actions
        <ChevronDownIcon className="w-3.5 h-3.5" />
      </button>

      {open && (
        <DropdownMenu className="absolute top-full mt-1.5 right-0 z-50 w-44">
          <DropdownItem
            leftIcon={<ExportIcon className="w-4 h-4" />}
            onClick={() => { setOpen(false); onExport() }}
          >
            Export Products
          </DropdownItem>
          <DropdownItem
            leftIcon={<ExportIcon className="w-4 h-4 scale-x-[-1]" />}
            onClick={() => setOpen(false)}
          >
            Duplicate
          </DropdownItem>
        </DropdownMenu>
      )}
    </div>
  )
}

// ─── Product thumbnail ─────────────────────────────────────────────────────

function ProductThumb({ name }: { name: string }) {
  const hue = (name.charCodeAt(0) * 31) % 360
  return (
    <div
      className="w-12 h-12 rounded-vintiga-md border border-vintiga-slate-200 overflow-hidden flex items-center justify-center shrink-0"
      style={{ background: `hsl(${hue}, 30%, 96%)` }}
    >
      <ImageIcon className="w-5 h-5 text-vintiga-slate-300" />
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────

export function ProductsListScreen() {
  const { catalogue } = useProductState()
  const [selected, setSelected]       = useState<Set<string>>(new Set())
  const [filterType, setFilterType]   = useState<ProductFilter>('wines')
  const [showExport, setShowExport]   = useState(false)

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function toggleAll() {
    setSelected((prev) => prev.size === catalogue.length ? new Set() : new Set(catalogue.map((p) => p.id)))
  }

  return (
    <OverviewLayout title="Products" description="Manage your inventory, wines, and merchandise" activeTab="products">
      <div className="bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-2xl p-vintiga-lg flex flex-col gap-vintiga-md">

        {/* Top filter rail + Add Product */}
        <div className="flex items-center justify-between gap-vintiga-md">
          <SegmentedControl<ProductFilter>
            value={filterType}
            onChange={setFilterType}
            options={TYPE_FILTER_OPTIONS}
            collapseInactive
            aria-label="Filter by product type"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="w-9 h-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white flex items-center justify-center hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
              aria-label="Export products"
            >
              <ExportIcon className="w-4 h-4 text-vintiga-slate-600" />
            </button>
            <Button leftIcon={<PlusIcon />} as="a" href="#/web/products/general">Add Product</Button>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-vintiga-sm">
          <div className="flex-1 max-w-sm">
            <TextField placeholder="Search Products" leftIcon={<SearchIcon className="w-4 h-4" />} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              Type
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </button>
            <StatusFilter />
            <ActionsDropdown onExport={() => setShowExport(true)} />
          </div>
        </div>

        {/* Table */}
        <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_120px_100px_120px_220px_40px] items-center gap-4 px-vintiga-md py-vintiga-sm bg-vintiga-slate-50 border-b border-vintiga-slate-200">
            <Checkbox
              size="sm"
              checked={selected.size === catalogue.length && catalogue.length > 0}
              indeterminate={selected.size > 0 && selected.size < catalogue.length}
              onChange={toggleAll}
            />
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Wines ({catalogue.length})</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Price</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Type</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Availability</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Collection</span>
            <span />
          </div>

          {catalogue.map((p) => (
            <div
              key={p.id}
              role="link"
              tabIndex={0}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-row-stop]')) return
                window.location.hash = `#/web/products/general?id=${p.id}`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') window.location.hash = `#/web/products/general?id=${p.id}`
              }}
              className="grid grid-cols-[40px_1fr_120px_100px_120px_220px_40px] items-center gap-4 px-vintiga-md py-vintiga-sm border-b border-vintiga-slate-100 last:border-b-0 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              <span data-row-stop onClick={(e) => e.stopPropagation()}>
                <Checkbox size="sm" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
              </span>
              <div className="flex items-center gap-3 min-w-0">
                <ProductThumb name={p.name} />
                <div className="flex flex-col min-w-0">
                  <span className="typo-body-sm font-medium text-vintiga-slate-900 truncate">{p.name}</span>
                  <span className="typo-caption text-vintiga-slate-500">{p.sku}</span>
                </div>
              </div>
              <span className="typo-body-sm text-vintiga-slate-900">${p.price}</span>
              <span className="typo-body-sm text-vintiga-slate-700">{p.type}</span>
              <span className="typo-body-sm text-vintiga-slate-700">{p.availability}</span>
              <div className="flex flex-wrap gap-1 items-center">
                {p.collections.slice(0, 2).map((c) => (
                  <Tag key={c} variant="outline" size="sm">{c}</Tag>
                ))}
                {p.collections.length > 2 && (
                  <Tag variant="outline" size="sm">+{p.collections.length - 2}</Tag>
                )}
              </div>
              <button
                data-row-stop
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
                aria-label="Row actions"
              >
                <EllipsisIcon className="w-4 h-4 text-vintiga-slate-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-vintiga-md">
          <span className="typo-body-sm text-vintiga-slate-500">{selected.size} of {catalogue.length} row(s) selected.</span>
          <div className="flex items-center gap-vintiga-md">
            <span className="typo-body-sm text-vintiga-slate-700">Rows per page</span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              50
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </button>
            <span className="typo-body-sm text-vintiga-slate-700">Page 1 of 3</span>
            <div className="flex items-center gap-1">
              <button type="button" className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-500 hover:bg-vintiga-slate-50 transition-colors cursor-pointer disabled:opacity-50" disabled>
                <ChevronLeftIcon className="w-4 h-4" />
                <ChevronLeftIcon className="w-4 h-4 -ml-2" />
              </button>
              <button type="button" className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-500 hover:bg-vintiga-slate-50 transition-colors cursor-pointer disabled:opacity-50" disabled>
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button type="button" className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
              <button type="button" className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer">
                <ChevronRightIcon className="w-4 h-4" />
                <ChevronRightIcon className="w-4 h-4 -ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export modal */}
      {showExport && (
        <ExportModal count={catalogue.length} onClose={() => setShowExport(false)} />
      )}
    </OverviewLayout>
  )
}
