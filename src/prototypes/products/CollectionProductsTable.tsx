import { useMemo, useRef, useState } from 'react'
import { Tag } from '@ds/shared/Tag'
import { TextField } from '@ds/shared/TextField'
import { Checkbox } from '@ds/shared/Checkbox'
import { Dropdown, DropdownItem } from '@ds/shared/Dropdown'
import { useRowDrag } from './useRowDrag'
import {
  SearchIcon,
  TrashIcon,
  ImageIcon,
  GripVerticalIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
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

function ProductThumb({ name }: { name: string }) {
  const hue = (name.charCodeAt(0) * 31) % 360
  return (
    <div
      className="w-10 h-10 rounded-vintiga-md border border-vintiga-slate-200 overflow-hidden flex items-center justify-center shrink-0"
      style={{ background: `hsl(${hue}, 30%, 96%)` }}
    >
      <ImageIcon className="w-4 h-4 text-vintiga-slate-300" />
    </div>
  )
}

function AddProductsSearch({
  alreadyAddedIds,
  onAdd,
}: {
  alreadyAddedIds: Set<string>
  onAdd: (id: string) => void
}) {
  const { catalogue } = useProductState()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useMemo(() => {
    if (typeof document === 'undefined') return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catalogue.filter((p) => !alreadyAddedIds.has(p.id)).slice(0, 8)
    return catalogue
      .filter((p) => !alreadyAddedIds.has(p.id))
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, catalogue, alreadyAddedIds])

  return (
    <div ref={containerRef} className="relative flex-1" onFocus={() => setOpen(true)}>
      <TextField
        placeholder="Add products"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        leftIcon={<SearchIcon className="w-4 h-4" />}
      />
      {open && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-10">
          <Dropdown className="w-full max-h-[320px] overflow-y-auto">
            {matches.map((p) => (
              <DropdownItem
                key={p.id}
                onClick={() => { onAdd(p.id); setQuery(''); setOpen(false) }}
                leftIcon={<PlusIcon className="w-4 h-4" />}
              >
                <div className="flex items-center gap-2 w-full">
                  <ProductThumb name={p.name} />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="typo-body-sm text-vintiga-slate-900 truncate">{p.name}</span>
                    <span className="typo-caption text-vintiga-slate-500">{p.sku}</span>
                  </div>
                  <span className="typo-body-sm text-vintiga-slate-500 shrink-0">${p.price}</span>
                </div>
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      )}
      {open && matches.length === 0 && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 z-10">
          <Dropdown className="w-full">
            <DropdownItem disabled>No products match "{query}"</DropdownItem>
          </Dropdown>
        </div>
      )}
    </div>
  )
}

export function CollectionProductsTable({ products, onRemove, onAdd, onReorder }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
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

  function toggleAll() {
    setSelected(selected.size === products.length ? new Set() : new Set(products.map((p) => p.id)))
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
        <button
          type="button"
          disabled={selected.size === 0}
          className="w-8 h-8 rounded-vintiga-md flex items-center justify-center text-vintiga-slate-500 hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Bulk delete"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
        <div className="grid grid-cols-[28px_28px_1fr_120px_40px] items-center gap-3 px-vintiga-md py-vintiga-sm bg-vintiga-slate-50 border-b border-vintiga-slate-200">
          <span />
          <Checkbox
            size="sm"
            checked={selected.size === products.length && products.length > 0}
            indeterminate={selected.size > 0 && selected.size < products.length}
            onChange={toggleAll}
          />
          <span className="typo-body-sm font-semibold text-vintiga-slate-700">Item ({products.length})</span>
          <span className="typo-body-sm font-semibold text-vintiga-slate-700">Price</span>
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
              'grid grid-cols-[28px_28px_1fr_120px_40px] items-center gap-3 px-vintiga-md py-vintiga-sm border-b border-vintiga-slate-100 last:border-b-0 hover:bg-vintiga-slate-50 transition-colors',
              onReorder && drag.overIndex === i ? 'bg-vintiga-indigo-50 ring-2 ring-inset ring-vintiga-indigo-500' : '',
            ].join(' ')}
          >
            <button
              type="button"
              {...(onReorder ? drag.handleProps(i) : {})}
              className={`w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-slate-600 bg-transparent border-none ${onReorder ? 'cursor-grab active:cursor-grabbing' : 'cursor-default opacity-50'}`}
              aria-label={onReorder ? `Drag to reorder ${p.name}` : 'Reorder'}
            >
              <GripVerticalIcon className="w-4 h-4" />
            </button>
            <Checkbox
              size="sm"
              checked={selected.has(p.id)}
              onChange={() => toggle(p.id)}
            />
            <div className="flex items-center gap-3 min-w-0">
              <ProductThumb name={p.name} />
              <div className="flex flex-col min-w-0 gap-1">
                <span className="typo-body-sm font-medium text-vintiga-slate-900 truncate">{p.name}</span>
                <span className="typo-caption text-vintiga-slate-500">{p.sku}</span>
                <div className="flex items-center gap-1">
                  {p.channels.map((c) => (
                    <Tag key={c} variant="filled" tone="info" size="sm">{c}</Tag>
                  ))}
                </div>
              </div>
            </div>
            <span className="typo-body-sm text-vintiga-slate-900">${p.price}</span>
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
          <span className="typo-body-sm text-vintiga-slate-500">{selected.size} of {products.length} row(s) selected.</span>
          <div className="flex items-center gap-vintiga-md">
            <span className="typo-body-sm text-vintiga-slate-700">Rows per page</span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-700 cursor-pointer"
            >
              50
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </button>
            <span className="typo-body-sm text-vintiga-slate-700">Page 1 of 1</span>
            <div className="flex items-center gap-1">
              <button type="button" disabled className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-500 disabled:opacity-50 cursor-pointer">
                <ChevronLeftIcon className="w-4 h-4" />
                <ChevronLeftIcon className="w-4 h-4 -ml-2" />
              </button>
              <button type="button" disabled className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-500 disabled:opacity-50 cursor-pointer">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button type="button" className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-700 cursor-pointer">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
              <button type="button" className="w-8 h-8 rounded-vintiga-md flex items-center justify-center border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-700 cursor-pointer">
                <ChevronRightIcon className="w-4 h-4" />
                <ChevronRightIcon className="w-4 h-4 -ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
