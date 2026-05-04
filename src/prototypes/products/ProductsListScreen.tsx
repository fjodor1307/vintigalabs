import { useEffect, useMemo, useState } from 'react'
import { OverviewLayout } from './OverviewLayout'
import { useProductState, productActions } from './productStore'
import { SelectProductTypeModal, type ProductType } from './SelectProductTypeModal'
import { Thumbnail } from '@ds/shared/Thumbnail'
import { SelectAllCheckbox } from './SelectAllCheckbox'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { TextField } from '@ds/shared/TextField'
import { Checkbox } from '@ds/shared/Checkbox'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { FilterDropdown } from '@ds/shared/FilterDropdown'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import {
  PlusIcon,
  SearchIcon,
  ChevronDownIcon,
  EllipsisIcon,
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
  DownloadIcon,
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

type StatusFilter = 'active' | 'inactive'

const STATUS_FILTER_OPTIONS = [
  { value: 'active'   as StatusFilter, label: 'Active' },
  { value: 'inactive' as StatusFilter, label: 'Inactive' },
]

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
  return (
    <PopoverMenu
      align="right"
      width="w-44"
      trigger={(_open, toggle) => (
        <Button variant="outline" size="md" rightIcon={<ChevronDownIcon />} onClick={toggle}>
          Actions
        </Button>
      )}
      items={[
        { label: 'Export Products', onClick: onExport },
        { label: 'Duplicate',       onClick: () => {} },
      ]}
    />
  )
}

// ─── Type filter dropdown (multi-select checkbox list) ────────────────────

const PRODUCT_CATEGORIES = TYPE_FILTER_OPTIONS
  .filter((o) => o.value !== 'all')
  .map((o) => ({ value: o.value, label: o.label, icon: o.icon }))

// ─── Product thumbnail ─────────────────────────────────────────────────────

function ProductThumb({ name, imageUrl }: { name: string; imageUrl?: string }) {
  return (
    <div className="w-16 h-16 rounded-vintiga-md border border-vintiga-slate-200 overflow-hidden flex items-center justify-center shrink-0 bg-vintiga-slate-50">
      <Thumbnail src={imageUrl} alt={name} className="w-full h-full object-cover" />
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────

// ─── Map a product type string → SegmentedControl filter key ──────────────

function categoryKeyFor(p: { type: string }): ProductFilter {
  switch (p.type.toLowerCase()) {
    case 'wine':       return 'wines'
    case 'beer':       return 'beer'
    case 'spirit':     return 'spirits'
    case 'event':      return 'events'
    case 'merch':      return 'merch'
    case 'experience': return 'experiences'
    case 'tasting':    return 'tastings'
    case 'food':       return 'food'
    case 'booking':    return 'bookings'
    case 'bundle':     return 'bundles'
    case 'gift':       return 'gifts'
    case 'voucher':    return 'vouchers'
    case 'ticket':     return 'tickets'
    default:           return 'wines'
  }
}

// Read `?type=…` off the hash query string. Lets breadcrumbs / inbound links
// land on a specific category tab (e.g. `#/web/products/list?type=experiences`
// from the experience editor's breadcrumb). Falls back to 'all'.
function initialFilterFromHash(): ProductFilter {
  if (typeof window === 'undefined') return 'all'
  const query = window.location.hash.split('?')[1] ?? ''
  const value = new URLSearchParams(query).get('type')
  const valid: ProductFilter[] = ['all', 'wines', 'beer', 'spirits', 'events', 'merch', 'experiences', 'tastings', 'food', 'bookings', 'bundles', 'gifts', 'vouchers', 'tickets']
  return value && (valid as string[]).includes(value) ? (value as ProductFilter) : 'all'
}

export function ProductsListScreen() {
  const { catalogue } = useProductState()
  const [selected, setSelected]       = useState<Set<string>>(new Set())
  const [filterType, setFilterType]   = useState<ProductFilter>(() => initialFilterFromHash())
  const [typeFilter, setTypeFilter]   = useState<Set<ProductFilter>>(new Set())
  const [statusFilter, setStatusFilter] = useState<Set<StatusFilter>>(new Set())
  const [search, setSearch]           = useState('')
  const [showExport, setShowExport]   = useState(false)
  const [showAddType, setShowAddType] = useState(false)

  // Re-sync the segmented control if the user navigates here from another
  // hash route (e.g. clicking a breadcrumb link to a different ?type=…).
  useEffect(() => {
    const onHash = () => setFilterType(initialFilterFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const onSelectType = (type: ProductType) => {
    setShowAddType(false)
    // Map the modal's ProductType slug to the human-readable label that
    // ProductState.productType expects.
    const label: Record<ProductType, string> = {
      wine: 'Wine', beer: 'Beer', spirit: 'Spirit',
      experience: 'Experience', merchandise: 'Merchandise', 'drink-token': 'Drink Token',
      food: 'Food', tasting: 'Tasting', reservation: 'Reservation',
      bundle: 'Bundle', 'gift-card': 'Gift Card', collateral: 'Collateral',
      'event-ticket': 'Event Ticket',
    }
    // Start a clean editor — no name, no images, no content, no variants —
    // pre-filled with the picked product type.
    productActions.startNewProduct(label[type])
    window.location.hash = '#/web/products/general'
  }

  // Derived: visible products after segmented tab + filter chips + search
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return catalogue.filter((p) => {
      // Segmented control tab (exclusive: 'all' shows all, otherwise match)
      if (filterType !== 'all' && categoryKeyFor(p) !== filterType) return false
      // Type chip filter (additive: show if any picked type matches)
      if (typeFilter.size > 0 && !typeFilter.has(categoryKeyFor(p))) return false
      // Status chip filter — products in the catalogue are all "active" placeholders;
      // a real impl would read p.status. For now: 'inactive' filter hides everything.
      if (statusFilter.size > 0 && !statusFilter.has('active')) return false
      // Search by name or SKU
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
      return true
    })
  }, [catalogue, filterType, typeFilter, statusFilter, search])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <OverviewLayout title="Products" description="Manage your inventory, wines, and merchandise" activeTab="products">
      <div className="bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-2xl p-vintiga-lg flex flex-col gap-vintiga-md">

        {/* Top filter rail + Add Product */}
        <div className="flex items-center justify-between gap-vintiga-md">
          <SegmentedControl<ProductFilter>
            value={filterType}
            onChange={(next) => {
              setFilterType(next)
              // Type chips are only available on the "All" tab — clear any
              // residual selection when switching to a specific category so
              // the chips don't keep silently filtering things out.
              if (next !== 'all') setTypeFilter(new Set())
            }}
            options={TYPE_FILTER_OPTIONS}
            collapseInactive
            aria-label="Filter by product type"
          />
          <div className="flex items-center gap-2">
            <Button leftIcon={<PlusIcon />} onClick={() => setShowAddType(true)}>Add Product</Button>
            <IconButton
              variant="outline"
              size="md"
              icon={<DownloadIcon />}
              aria-label="Export CSV"
              onClick={() => setShowExport(true)}
            />
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-vintiga-sm">
          <div className="flex-1 max-w-sm">
            <TextField
              placeholder="Search Products"
              leftIcon={<SearchIcon className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Type filter is only relevant on the "All" tab — every other
                segmented tab already narrows the catalogue to a single type. */}
            {filterType === 'all' && (
              <FilterDropdown<ProductFilter>
                label="Type"
                options={PRODUCT_CATEGORIES}
                value={typeFilter}
                onChange={setTypeFilter}
              />
            )}
            <FilterDropdown<StatusFilter>
              label="Status"
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <ActionsDropdown onExport={() => setShowExport(true)} />
          </div>
        </div>

        {/* Table */}
        <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_120px_100px_120px_220px_40px] items-center gap-4 px-vintiga-md h-12 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
            <SelectAllCheckbox
              selectedCount={selected.size}
              totalOnPage={visible.length}
              totalAll={catalogue.length}
              onSelectPage={() => setSelected(new Set(visible.map((p) => p.id)))}
              onSelectAll={() => setSelected(new Set(catalogue.map((p) => p.id)))}
              onClear={() => setSelected(new Set())}
            />
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Items ({visible.length})</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Price</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Type</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Availability</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-700">Collection</span>
            <span />
          </div>

          {visible.length === 0 && (
            <div className="px-vintiga-md py-vintiga-2xl text-center">
              <p className="typo-body-sm text-vintiga-slate-500">
                {search.trim()
                  ? `No products match "${search}"`
                  : 'No products match these filters'}
              </p>
            </div>
          )}

          {visible.map((p) => {
            const editorHref = `#/web/products/general?id=${p.id}`
            return (
            <div
              key={p.id}
              role="link"
              tabIndex={0}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-row-stop]')) return
                window.location.hash = editorHref
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') window.location.hash = editorHref
              }}
              className="grid grid-cols-[40px_1fr_120px_100px_120px_220px_40px] items-center gap-4 px-vintiga-md h-24 border-b border-vintiga-slate-100 last:border-b-0 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              <span data-row-stop onClick={(e) => e.stopPropagation()}>
                <Checkbox size="sm" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
              </span>
              <div className="flex items-center gap-3 min-w-0">
                <ProductThumb name={p.name} imageUrl={p.imageUrl} />
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
              <span data-row-stop onClick={(e) => e.stopPropagation()}>
                <PopoverMenu
                  align="right"
                  width="w-40"
                  trigger={(_open, t) => (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); t() }}
                      className="w-8 h-8 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
                      aria-label={`${p.name} actions`}
                    >
                      <EllipsisIcon className="w-4 h-4 text-vintiga-slate-500" />
                    </button>
                  )}
                  items={[
                    { label: 'View',      onClick: () => { window.location.hash = editorHref } },
                    { label: 'Duplicate', onClick: () => {} },
                  ]}
                />
              </span>
            </div>
            )
          })}
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

      {/* Select product type modal */}
      <SelectProductTypeModal
        open={showAddType}
        onClose={() => setShowAddType(false)}
        onSelect={onSelectType}
      />
    </OverviewLayout>
  )
}
