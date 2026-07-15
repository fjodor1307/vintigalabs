import { useState, type ReactNode } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Button } from '@ds/shared/Button'
import { Radio } from '@ds/shared/Radio'
import { StoreIcon, TruckIcon, PlusIcon } from '@ds/icons/Icons'
import {
  PICKUP_LOCATIONS,
  type DeliveryAddress,
  type DeliveryValue,
} from '@ds/shared/delivery'

// ─── DeliveryPicker ───────────────────────────────────────────────────────────
// The one delivery-method control for the whole app. A flat list of radio cards:
// pickup locations first (operators usually enrol someone collecting in person),
// then the customer's saved addresses, then an optional "add new address" row.
//
// Selection is keyed by a unique id (`pickup:{location}` / `ship:{addressId}`),
// so two identically-formatted addresses can never both read as selected — the
// bug the old content-keyed picker had.

const key = (v: DeliveryValue): string =>
  v.kind === 'pickup' ? `pickup:${v.location}` : `ship:${v.addressId}`

function RadioCard({ selected, onSelect, icon, children }: {
  selected: boolean
  onSelect: () => void
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() } }}
      className={`cursor-pointer w-full rounded-vintiga-card border p-vintiga-md flex items-center gap-vintiga-md transition-colors ${
        selected ? 'border-vintiga-indigo-600 bg-vintiga-indigo-50/40' : 'border-vintiga-border hover:border-vintiga-slate-300'
      }`}
    >
      <Radio checked={selected} onChange={onSelect} aria-label="Select delivery option" />
      <span className="text-vintiga-slate-400 shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export interface DeliveryPickerProps {
  addresses: DeliveryAddress[]
  value: DeliveryValue
  onChange: (v: DeliveryValue) => void
  /** Defaults to the winery's canonical tasting rooms. */
  pickupLocations?: string[]
  /**
   * Enables the inline "add new address" row. Receives the flattened parts,
   * must persist the address and return its new id, which is then selected.
   */
  onAddAddress?: (addr: { street: string; city: string; state: string; zip: string }) => string
}

export function DeliveryPicker({
  addresses,
  value,
  onChange,
  pickupLocations = PICKUP_LOCATIONS,
  onAddAddress,
}: DeliveryPickerProps) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ street: '', city: '', state: '', zip: '' })
  const selectedKey = key(value)

  function saveNew() {
    if (!onAddAddress || !draft.street.trim()) return
    const id = onAddAddress(draft)
    onChange({ kind: 'ship', addressId: id })
    setDraft({ street: '', city: '', state: '', zip: '' })
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-vintiga-sm">
      {pickupLocations.map((loc) => {
        const v: DeliveryValue = { kind: 'pickup', location: loc }
        return (
          <RadioCard key={key(v)} selected={selectedKey === key(v)} onSelect={() => onChange(v)} icon={<StoreIcon />}>
            <p className="typo-body-sm font-semibold text-vintiga-slate-900">Pickup · {loc}</p>
          </RadioCard>
        )
      })}

      {addresses.map((a) => {
        const v: DeliveryValue = { kind: 'ship', addressId: a.id }
        return (
          <RadioCard key={key(v)} selected={selectedKey === key(v)} onSelect={() => onChange(v)} icon={<TruckIcon />}>
            <p className="typo-body-sm font-semibold text-vintiga-slate-900">Ship · {a.label}</p>
            <p className="typo-body-sm text-vintiga-slate-500 truncate">{a.line}</p>
          </RadioCard>
        )
      })}

      {onAddAddress && !adding && (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="cursor-pointer w-full rounded-vintiga-card border border-dashed border-vintiga-border hover:border-vintiga-slate-300 p-vintiga-md flex items-center gap-vintiga-sm transition-colors"
        >
          <PlusIcon className="w-4 h-4 text-vintiga-slate-500" />
          <span className="typo-body-sm font-semibold text-vintiga-slate-900">Add new address</span>
        </button>
      )}

      {onAddAddress && adding && (
        <div className="rounded-vintiga-card bg-vintiga-surface-secondary p-vintiga-md flex flex-col gap-vintiga-md">
          <Field label="Street address"><TextField value={draft.street} onChange={(e) => setDraft({ ...draft, street: e.target.value })} placeholder="123 Main St" /></Field>
          <div className="grid grid-cols-2 gap-vintiga-md">
            <Field label="City"><TextField value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} placeholder="City" /></Field>
            <Field label="State"><TextField value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} placeholder="CA" /></Field>
          </div>
          <Field label="ZIP"><TextField value={draft.zip} onChange={(e) => setDraft({ ...draft, zip: e.target.value })} placeholder="94954" /></Field>
          <div className="flex justify-end gap-vintiga-sm">
            <Button variant="outline" size="sm" onClick={() => { setAdding(false); setDraft({ street: '', city: '', state: '', zip: '' }) }}>Cancel</Button>
            <Button size="sm" onClick={saveNew} disabled={!draft.street.trim()}>Add address</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DeliveryMethodModal ──────────────────────────────────────────────────────
// Editing entry point used by summary cards (customer memberships, club member
// detail). Wraps the picker with staged local state + a Save action.

export function DeliveryMethodModal({
  open,
  current,
  addresses,
  pickupLocations,
  onClose,
  onSave,
  onAddAddress,
}: {
  open: boolean
  current: DeliveryValue
  addresses: DeliveryAddress[]
  pickupLocations?: string[]
  onClose: () => void
  onSave: (v: DeliveryValue) => void
  onAddAddress?: (addr: { street: string; city: string; state: string; zip: string }) => string
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && (
        <DeliveryMethodForm
          current={current}
          addresses={addresses}
          pickupLocations={pickupLocations}
          onClose={onClose}
          onSave={onSave}
          onAddAddress={onAddAddress}
        />
      )}
    </Modal>
  )
}

function DeliveryMethodForm({
  current,
  addresses,
  pickupLocations,
  onClose,
  onSave,
  onAddAddress,
}: {
  current: DeliveryValue
  addresses: DeliveryAddress[]
  pickupLocations?: string[]
  onClose: () => void
  onSave: (v: DeliveryValue) => void
  onAddAddress?: (addr: { street: string; city: string; state: string; zip: string }) => string
}) {
  const [value, setValue] = useState<DeliveryValue>(current)
  return (
    <>
      <ModalHeader title="Delivery method" description="Pick up at a tasting room, or ship to an address." onClose={onClose} />
      <ModalBody>
        <DeliveryPicker
          addresses={addresses}
          value={value}
          onChange={setValue}
          pickupLocations={pickupLocations}
          onAddAddress={onAddAddress}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { onSave(value); onClose() }}>Save</Button>
      </ModalFooter>
    </>
  )
}
