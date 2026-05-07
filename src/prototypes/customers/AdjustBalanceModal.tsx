import { useEffect, useMemo, useRef, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Button } from '@ds/shared/Button'
import { DropdownMenu } from '@ds/shared/Dropdown'
import { SearchIcon, XIcon } from '@ds/icons/Icons'
import { customerActions, type LedgerSource } from './customerStore'

// ─── AdjustBalanceModal ───────────────────────────────────────────────────────
// One modal for both Account Balance and Loyalty Points adjustments — the only
// thing that changes is the unit (currency vs integer points) and which store
// action fires. Captures the audit fields the spec calls out:
//
//   • Timestamp     — auto, recorded on save
//   • Input By      — currently always "user" (the staff member adjusting)
//                     Integration / Vintiga sources arrive via API/automation,
//                     not this modal. Surfaced here as a read-only Source row
//                     so the audit shape matches the eventual API.
//   • Source name   — auto, current logged-in user (Tom Cook / STAFF-104)
//   • Order number  — optional reference
//   • Description   — optional internal note
//   • Amount        — signed; toggle picks Add (credit) or Subtract (debit)

const CURRENT_STAFF = { name: 'Tom Cook', id: 'STAFF-104' }

type Mode = 'balance' | 'points'

type Direction = 'add' | 'subtract'

const DIRECTION_OPTIONS: { value: Direction; label: string }[] = [
  { value: 'add',      label: 'Add' },
  { value: 'subtract', label: 'Subtract' },
]

export function AdjustBalanceModal({
  open,
  mode,
  onClose,
}: {
  open: boolean
  mode: Mode
  onClose: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <AdjustForm mode={mode} onClose={onClose} />}
    </Modal>
  )
}

// Sample orders the picker searches against. Real wiring loads from the order
// API — for the prototype this is enough to demonstrate the typeahead.
const RECENT_ORDERS = [
  { number: '#124444', label: 'May 4, 2026 · $52.87 · Wine Club Q2' },
  { number: '#124501', label: 'Apr 18, 2026 · $148.20 · Tasting Room' },
  { number: '#124298', label: 'Mar 22, 2026 · $76.50 · POS Sale' },
  { number: '#124102', label: 'Feb 10, 2026 · $312.40 · Online Order' },
  { number: '#123998', label: 'Jan 28, 2026 · $94.00 · Wine Club Q1' },
  { number: '#123871', label: 'Dec 14, 2025 · $58.10 · Tasting Room' },
]

function AdjustForm({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const [direction, setDirection] = useState<Direction>('add')
  const [amount, setAmount]       = useState('')
  const [orderNumber, setOrderNum] = useState('')
  const [reason, setReason]       = useState('')

  const isPoints   = mode === 'points'
  const title      = isPoints ? 'Adjust Loyalty Points' : 'Adjust Account Balance'
  const unit       = isPoints ? 'points' : 'dollars'
  const placeholder = isPoints ? '0' : '0.00'

  const numericAmount = parseFloat(amount)
  const canSubmit     = !Number.isNaN(numericAmount) && numericAmount > 0 && reason.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    const signed = direction === 'subtract' ? -numericAmount : numericAmount
    const entry = {
      source: 'user' as LedgerSource,
      sourceName: CURRENT_STAFF.name,
      sourceUserId: CURRENT_STAFF.id,
      orderNumber: orderNumber.trim() || undefined,
      description:  reason.trim(),
      amount: isPoints ? Math.round(signed) : signed,
    }
    if (isPoints) {
      customerActions.adjustPoints(entry)
    } else {
      customerActions.adjustBalance(entry)
    }
    onClose()
  }

  return (
    <>
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        {/* Source — read-only audit row */}
        <Field label="Input By">
          <div className="h-10 px-3 flex items-center justify-between rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-slate-50">
            <span className="typo-body-sm text-vintiga-slate-900">{CURRENT_STAFF.name}</span>
            <span className="typo-caption text-vintiga-slate-500">{CURRENT_STAFF.id}</span>
          </div>
        </Field>

        {/* Direction toggle */}
        <Field label="Action">
          <SegmentedControl<Direction>
            value={direction}
            onChange={setDirection}
            options={DIRECTION_OPTIONS}
            aria-label="Adjustment direction"
          />
        </Field>

        {/* Amount */}
        <Field label={`Amount (${unit})`} required>
          <TextField
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={placeholder}
            leftIcon={isPoints ? undefined : <span className="typo-body-sm text-vintiga-slate-500">$</span>}
          />
        </Field>

        <Field label="Order Number" helper="Optional — search and link an existing order.">
          <OrderPicker value={orderNumber} onChange={setOrderNum} />
        </Field>

        <Field label="Reason" required helper="Why this adjustment is being made — required for audit.">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Goodwill credit — shipping delay"
            rows={3}
          />
        </Field>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {direction === 'add' ? 'Add' : 'Subtract'}
        </Button>
      </ModalFooter>
    </>
  )
}

// ─── OrderPicker ─────────────────────────────────────────────────────────────
// Searchable typeahead over `RECENT_ORDERS`. Selecting a row stores the order
// number; the chip shows the linked order with a clear-button to detach.

function OrderPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
    if (!q) return RECENT_ORDERS
    return RECENT_ORDERS.filter((o) => o.number.toLowerCase().includes(q) || o.label.toLowerCase().includes(q))
  }, [query])

  const selected = RECENT_ORDERS.find((o) => o.number === value)

  if (selected) {
    return (
      <div className="h-10 px-3 flex items-center justify-between rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-indigo-50/40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="typo-body-sm font-medium text-vintiga-slate-900">{selected.number}</span>
          <span className="typo-caption text-vintiga-slate-500 truncate">{selected.label}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear order"
          className="w-6 h-6 inline-flex items-center justify-center rounded-vintiga-sm text-vintiga-slate-500 hover:text-vintiga-slate-700 hover:bg-vintiga-slate-100 bg-transparent border-none cursor-pointer shrink-0"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative" onFocus={() => setOpen(true)}>
      <TextField
        placeholder="Search orders by number or date"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        leftIcon={<SearchIcon className="w-4 h-4" />}
      />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-30">
          <DropdownMenu className="w-full max-h-[280px] overflow-y-auto p-1">
            {matches.length === 0 ? (
              <div className="px-vintiga-md py-vintiga-md text-center">
                <p className="typo-body-sm text-vintiga-slate-500">No orders match "{query}"</p>
              </div>
            ) : (
              matches.map((o) => (
                <button
                  key={o.number}
                  type="button"
                  onClick={() => { onChange(o.number); setQuery(''); setOpen(false) }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-vintiga-md hover:bg-vintiga-slate-100 transition-colors text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="typo-body-sm font-medium text-vintiga-slate-900 shrink-0">{o.number}</span>
                  <span className="typo-caption text-vintiga-slate-500 truncate">{o.label}</span>
                </button>
              ))
            )}
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
