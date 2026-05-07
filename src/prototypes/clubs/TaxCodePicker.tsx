import { useEffect, useMemo, useRef, useState } from 'react'
import { TextField } from '@ds/shared/TextField'
import { DropdownMenu } from '@ds/shared/Dropdown'
import { SearchIcon, XIcon } from '@ds/icons/Icons'

// ─── TaxCodePicker ───────────────────────────────────────────────────────────
// Searchable typeahead over a curated list of common winery tax codes. Used
// by both the new-club editor and the view-club overview so SKU + Tax Code
// behave the same in either flow. Picking a code shows the chip with a clear
// button; freeform values still work — anything the operator types is stored
// even if it doesn't match the catalogue (covers custom jurisdiction codes).

interface TaxCode {
  code: string
  label: string
}

// Sample catalogue. Real wiring loads from the accounting integration —
// matches the C7 / Avalara conventions the team has been mapping against.
const TAX_CODES: TaxCode[] = [
  { code: 'P0000000', label: 'Non-taxable (default for US membership fees)' },
  { code: 'PC040100', label: 'General merchandise — taxable' },
  { code: 'PC040133', label: 'Wine — alcohol excise + sales tax' },
  { code: 'PC040156', label: 'Tasting fees — service taxable' },
  { code: 'PC040200', label: 'Shipping & handling — taxable' },
  { code: 'PC040201', label: 'Shipping & handling — non-taxable' },
  { code: 'V-1234',   label: 'Vintiga membership (legacy code)' },
]

export function TaxCodePicker({
  value,
  onChange,
  placeholder = 'Search tax codes',
}: {
  value: string
  onChange: (next: string) => void
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TAX_CODES
    return TAX_CODES.filter((t) =>
      t.code.toLowerCase().includes(q) || t.label.toLowerCase().includes(q),
    )
  }, [query])

  const selected = TAX_CODES.find((t) => t.code === value)

  // Selected state: chip with clear button.
  if (selected) {
    return (
      <div className="h-10 px-3 flex items-center justify-between rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-indigo-50/40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="typo-body-sm font-medium text-vintiga-slate-900">{selected.code}</span>
          <span className="typo-caption text-vintiga-slate-500 truncate">{selected.label}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear tax code"
          className="w-6 h-6 inline-flex items-center justify-center rounded-vintiga-sm text-vintiga-slate-500 hover:text-vintiga-slate-700 hover:bg-vintiga-slate-100 bg-transparent border-none cursor-pointer shrink-0"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  // Custom/freeform value — operator typed something the catalogue doesn't
  // know about. Show it as a chip so it's clearly applied, with the same
  // clear action.
  if (value) {
    return (
      <div className="h-10 px-3 flex items-center justify-between rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white">
        <span className="typo-body-sm font-medium text-vintiga-slate-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear tax code"
          className="w-6 h-6 inline-flex items-center justify-center rounded-vintiga-sm text-vintiga-slate-500 hover:text-vintiga-slate-700 hover:bg-vintiga-slate-100 bg-transparent border-none cursor-pointer shrink-0"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onFocus={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && query.trim()) {
          onChange(query.trim())
          setQuery('')
          setOpen(false)
        }
      }}
    >
      <TextField
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        leftIcon={<SearchIcon className="w-4 h-4" />}
      />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-30">
          <DropdownMenu className="w-full max-h-[280px] overflow-y-auto p-1">
            {matches.length === 0 ? (
              <button
                type="button"
                onClick={() => { onChange(query.trim()); setQuery(''); setOpen(false) }}
                className="flex flex-col gap-0.5 w-full px-2 py-1.5 rounded-vintiga-md hover:bg-vintiga-slate-100 transition-colors text-left bg-transparent border-0 cursor-pointer"
              >
                <span className="typo-body-sm font-medium text-vintiga-slate-900">Use "{query}"</span>
                <span className="typo-caption text-vintiga-slate-500">No catalogue match — apply as a custom code</span>
              </button>
            ) : (
              matches.map((t) => (
                <button
                  key={t.code}
                  type="button"
                  onClick={() => { onChange(t.code); setQuery(''); setOpen(false) }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-vintiga-md hover:bg-vintiga-slate-100 transition-colors text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="typo-body-sm font-medium text-vintiga-slate-900 shrink-0">{t.code}</span>
                  <span className="typo-caption text-vintiga-slate-500 truncate">{t.label}</span>
                </button>
              ))
            )}
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
