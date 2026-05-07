import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Button } from '@ds/shared/Button'
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

function AdjustForm({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const [direction, setDirection] = useState<Direction>('add')
  const [amount, setAmount]       = useState('')
  const [orderNumber, setOrderNum] = useState('')
  const [description, setDesc]    = useState('')

  const isPoints   = mode === 'points'
  const title      = isPoints ? 'Adjust Loyalty Points' : 'Adjust Account Balance'
  const unit       = isPoints ? 'points' : 'dollars'
  const placeholder = isPoints ? '0' : '0.00'

  const numericAmount = parseFloat(amount)
  const canSubmit     = !Number.isNaN(numericAmount) && numericAmount > 0

  function handleSubmit() {
    if (!canSubmit) return
    const signed = direction === 'subtract' ? -numericAmount : numericAmount
    const entry = {
      source: 'user' as LedgerSource,
      sourceName: CURRENT_STAFF.name,
      sourceUserId: CURRENT_STAFF.id,
      orderNumber: orderNumber.trim() || undefined,
      description:  description.trim() || undefined,
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

        <Field label="Order Number" helper="Optional — reference an order this adjustment relates to.">
          <TextField
            value={orderNumber}
            onChange={(e) => setOrderNum(e.target.value)}
            placeholder="#ORD-1234"
          />
        </Field>

        <Field label="Description" helper="Optional — internal note explaining the adjustment.">
          <Textarea
            value={description}
            onChange={(e) => setDesc(e.target.value)}
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
