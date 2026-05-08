import { useEffect, useMemo, useRef, useState } from 'react'
import { Thumbnail } from '@ds/shared/Thumbnail'
import { SelectAllCheckbox } from '@ds/shared/SelectAllCheckbox'
import { Tag } from '@ds/shared/Tag'
import { TextField } from '@ds/shared/TextField'
import { Checkbox } from '@ds/shared/Checkbox'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { DropdownItem, DropdownMenu } from '@ds/shared/Dropdown'
import { useRowDrag } from './useRowDrag'
import {
  SearchIcon,
  GripVerticalIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlusIcon,
  TrashIcon,
} from '@ds/icons/Icons'
import { useProductState, type CatalogueProduct } from './productStore'

interface Props {
  products: CatalogueProduct[]
  onRemove: (productId: string) => void
  /** Optional — pass to allow searching the catalogue and adding new products. */
  onAdd?: (productId: string) => void
  /** Optional — pass to allow drag-reordering. Indices are relative to the displayed list. */
  onReorder?: (fromIndex: number, toIndex: number) => void
}

function ProductThumb({ name, imageUrl, size = 64 }: { name: string; imageUrl?: string; size?: number }) {
  return (
    <div
      className="rounded-vintiga-md border border-vintiga-slate-200 overflow-hidden flex items-center justify-center shrink-0 bg-vintiga-slate-50"
      style={{ width: size, height: size }}
    >
      <Thumbnail src={imageUrl} alt={name} className="w-full h-full object-cover" />
    </div>
  )
}

export function AddProductsSearch({
  alreadyAddedIds,
  onAdd,
}: {
  alreadyAddedIds: Set<string>
  onAdd: (id: string) => void
}) {
  const { catalogue } = useProductState()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside (and discard picks if user clicks away)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setPicked(new Set())
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = catalogue.filter((p) => !alreadyAddedIds.has(p.id))
    if (!q) return pool.slice(0, 8)
    return pool.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 8)
  }, [query, catalogue, alreadyAddedIds])

  const togglePicked = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const commit = () => {
    picked.forEach((id) => onAdd(id))
    setPicked(new Set())
    setQuery('')
    setOpen(false)
  }

  const cancel = () => {
    setPicked(new Set())
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex-1" onFocus={() => setOpen(true)}>
      <TextField
        placeholder="Add products"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        leftIcon={<SearchIcon className="w-4 h-4" />}
      />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-30">
          <DropdownMenu className="w-full max-h-[420px] overflow-hidden flex flex-col p-0">
            {/* Scrollable rows */}
            <div className="flex-1 overflow-y-auto p-1">
              {matches.length === 0 ? (
                <div className="px-vintiga-md py-vintiga-lg text-center">
                  <p className="typo-body-sm text-vintiga-slate-500">
                    {query.trim() ? `No products match "${query}"` : 'No more products to add'}
                  </p>
                </div>
              ) : (
                matches.map((p) => {
                  const isPicked = picked.has(p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePicked(p.id)}
                      className={[
                        'flex items-center gap-vintiga-sm w-full px-2 py-1.5 rounded-vintiga-md transition-colors text-left bg-transparent border-0 cursor-pointer',
                        isPicked ? 'bg-vintiga-indigo-50' : 'hover:bg-vintiga-slate-100',
                      ].join(' ')}
                    >
                      <Checkbox size="sm" checked={isPicked} />
                      <ProductThumb name={p.name} imageUrl={p.imageUrl} size={40} />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="typo-body-sm font-medium text-vintiga-slate-900 truncate">{p.name}</span>
                        <span className="typo-caption text-vintiga-slate-500">{p.sku}</span>
                      </div>
                      <span className="typo-body-sm text-vintiga-slate-500 shrink-0">${p.price}</span>
                    </button>
                  )
                })
              )}
            </div>

            {/* Sticky footer */}
            <div className="flex items-center justify-between gap-vintiga-sm px-vintiga-sm py-vintiga-sm border-t border-vintiga-slate-200 bg-vintiga-white">
              <span className="typo-caption text-vintiga-slate-500">
                {picked.size > 0 ? `${picked.size} selected` : 'Pick one or more'}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={cancel}>Cancel</Button>
                <Button size="sm" onClick={commit} disabled={picked.size === 0} leftIcon={<PlusIcon />}>
                  Add{picked.size > 0 ? ` ${picked.size}` : ''}
                </Button>
              </div>
            </div>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

// ─── Rows-per-page dropdown ───────────────────────────────────────────────────

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30, 40, 50] as const

function RowsPerPageDropdown({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-vintiga-md border border-vintiga-slate-300 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
      >
        {value}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {open && (
        <DropdownMenu className="absolute bottom-full mb-1.5 right-0 z-50 w-24">
          {ROWS_PER_PAGE_OPTIONS.map((opt) => (
            <DropdownItem
              key={opt}
              selected={opt === value}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </div>
  )
}


export function CollectionProductsTable({ products, onRemove, onAdd, onReorder }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [rowsPerPage, setRowsPerPage] = useState<number>(50)
  const drag = useRowDrag({ onReorder: onReorder ?? (() => { /* noop */ }) })
  const alreadyAddedIds = useMemo(() => new Set(products.map((p) => p.id)), [products])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }


  return (
    <div className="flex flex-col gap-vintiga-md">
      {/* Search row */}
      <div className="flex items-center gap-vintiga-md">
        {onAdd ? (
          <AddProductsSearch alreadyAddedIds={alreadyAddedIds} onAdd={onAdd} />
        ) : (
          <div className="flex-1">
            <TextField placeholder="Add products" leftIcon={<SearchIcon className="w-4 h-4" />} />
          </div>
        )}
        <span className="typo-body-sm text-vintiga-slate-500 shrink-0">{selected.size} products selected</span>
        <IconButton
          variant="outline"
          size="md"
          icon={<TrashIcon />}
          aria-label="Bulk delete"
          disabled={selected.size === 0}
        />
      </div>

      {/* Table */}
      <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
        <div className="grid grid-cols-[24px_24px_1fr_100px_44px] items-center gap-3 px-vintiga-md h-12 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
          <span />
          <SelectAllCheckbox
            selectedCount={selected.size}
            totalOnPage={products.length}
            totalAll={products.length}
            onSelectPage={() => setSelected(new Set(products.map((p) => p.id)))}
            onSelectAll={() => setSelected(new Set(products.map((p) => p.id)))}
            onClear={() => setSelected(new Set())}
          />
          <span className="typo-body-sm font-semibold text-vintiga-slate-700">Item ({products.length})</span>
          <span className="typo-body-sm font-semibold text-vintiga-slate-700 text-right">Price</span>
          <span />
        </div>

        {products.length === 0 && (
          <div className="px-vintiga-md py-vintiga-2xl text-center">
            <p className="typo-body-sm text-vintiga-slate-500">No products yet. Use the search above to add one.</p>
          </div>
        )}

        {products.map((p, i) => (
          <div
            key={p.id}
            {...(onReorder ? drag.rowProps(i) : {})}
            className={[
              'grid grid-cols-[24px_24px_1fr_100px_44px] items-center gap-3 px-vintiga-md py-vintiga-md border-b border-vintiga-slate-100 last:border-b-0 hover:bg-vintiga-slate-50 transition-colors',
              onReorder && drag.overIndex === i ? 'bg-vintiga-indigo-50 ring-2 ring-inset ring-vintiga-indigo-500' : '',
            ].join(' ')}
          >
            <button
              type="button"
              {...(onReorder ? drag.handleProps(i) : {})}
              className={`w-5 h-5 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-slate-600 bg-transparent border-none ${onReorder ? 'cursor-grab active:cursor-grabbing' : 'cursor-default opacity-50'}`}
              aria-label={onReorder ? `Drag to reorder ${p.name}` : 'Reorder'}
            >
              <GripVerticalIcon className="w-5 h-5" />
            </button>
            <Checkbox
              size="sm"
              checked={selected.has(p.id)}
              onChange={() => toggle(p.id)}
            />
            <div className="flex items-center gap-3 min-w-0">
              <ProductThumb name={p.name} imageUrl={p.imageUrl} />
              <div className="flex flex-col min-w-0 gap-1.5">
                <div className="flex flex-col">
                  <span className="typo-body-sm font-medium text-vintiga-slate-900 truncate">{p.name}</span>
                  <span className="typo-caption text-vintiga-slate-500">{p.sku}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.channels.map((c) => (
                    <Tag
                      key={c}
                      variant="filled"
                      tone={c.toLowerCase() === 'pos' ? 'blue' : 'violet'}
                      size="sm"
                    >
                      {c}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
            <span className="typo-body-sm font-medium text-vintiga-slate-900 text-right">${Number(p.price).toFixed(2)}</span>
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              className="w-8 h-8 rounded-vintiga-md flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-50 transition-colors bg-transparent border-none cursor-pointer"
              aria-label={`Remove ${p.name}`}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex items-center justify-between gap-vintiga-md">
          <span className="typo-body-sm text-vintiga-slate-500">
            {selected.size} of {products.length} row(s) selected.
          </span>
          <div className="flex items-center gap-vintiga-lg">
            <div className="flex items-center gap-vintiga-sm">
              <span className="typo-body-sm text-vintiga-slate-700">Rows per page</span>
              <RowsPerPageDropdown value={rowsPerPage} onChange={setRowsPerPage} />
            </div>
            <span className="typo-body-sm text-vintiga-slate-700">Page 1 of 1</span>
            <div className="flex items-center gap-1">
              <IconButton variant="outline" size="md" icon={<ChevronsLeftIcon />}  aria-label="First page"    disabled />
              <IconButton variant="outline" size="md" icon={<ChevronLeftIcon />}   aria-label="Previous page" disabled />
              <IconButton variant="outline" size="md" icon={<ChevronRightIcon />}  aria-label="Next page" />
              <IconButton variant="outline" size="md" icon={<ChevronsRightIcon />} aria-label="Last page" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
