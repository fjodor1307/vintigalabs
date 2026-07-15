import { useState, type ReactNode } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Button } from '@ds/shared/Button'
import { Radio } from '@ds/shared/Radio'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { CardBrandLogo } from '@ds/shared/CardBrandLogo'
import { TruckIcon, MapPinIcon, PlusIcon } from '@ds/icons/Icons'
import { useAddresses, usePaymentMethods, type CardBrand } from './customerStore'
import { PICKUP_LOCATIONS } from './membershipsData'

// ─── Membership shipment edit modals ──────────────────────────────────────────
// Change address / card / delivery for a club's next shipment. DS-styled
// (Modal + Radio + SegmentedControl), reading the customer's saved addresses and
// cards from the shared store so they match the Billing tab.

export interface CardRef { brand: CardBrand; last4: string; expiresMonth: string; expiresYear: string }

// Clickable radio row — the whole card toggles selection.
function RadioCard({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: ReactNode }) {
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
      <Radio checked={selected} onChange={onSelect} aria-label="Select option" />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

// ─── Shipping address ─────────────────────────────────────────────────────────

function formatAddress(a: { street: string; city: string; state: string; zip: string }): string {
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`
}

export function ShippingAddressModal({
  open,
  current,
  onClose,
  onSave,
}: {
  open: boolean
  current?: string
  onClose: () => void
  onSave: (address: string) => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <ShippingAddressForm current={current} onClose={onClose} onSave={onSave} />}
    </Modal>
  )
}

function ShippingAddressForm({ current, onClose, onSave }: { current?: string; onClose: () => void; onSave: (a: string) => void }) {
  const addresses = useAddresses()
  const [tab, setTab] = useState<'saved' | 'new'>('saved')
  const initialId = addresses.find((a) => formatAddress(a) === current)?.id ?? addresses[0]?.id ?? ''
  const [selectedId, setSelectedId] = useState(initialId)
  const [draft, setDraft] = useState({ street: '', city: '', state: '', zip: '' })

  function handleSave() {
    if (tab === 'saved') {
      const a = addresses.find((x) => x.id === selectedId)
      if (a) onSave(formatAddress(a))
    } else if (draft.street.trim()) {
      onSave(formatAddress(draft))
    }
    onClose()
  }

  return (
    <>
      <ModalHeader title="Shipping address" onClose={onClose} />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <SegmentedControl<'saved' | 'new'>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'saved', label: 'Use a saved address' },
              { value: 'new', label: 'Enter a new address' },
            ]}
          />
          {tab === 'saved' ? (
            <div className="flex flex-col gap-vintiga-sm">
              {addresses.map((a) => (
                <RadioCard key={a.id} selected={selectedId === a.id} onSelect={() => setSelectedId(a.id)}>
                  <p className="typo-body-sm font-semibold text-vintiga-slate-900">{a.label}</p>
                  <p className="typo-body-sm text-vintiga-slate-500">{formatAddress(a)}</p>
                </RadioCard>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-vintiga-md">
              <Field label="Street address">
                <TextField value={draft.street} onChange={(e) => setDraft({ ...draft, street: e.target.value })} placeholder="123 Main St" />
              </Field>
              <div className="grid grid-cols-2 gap-vintiga-md">
                <Field label="City"><TextField value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} placeholder="City" /></Field>
                <Field label="State"><TextField value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} placeholder="CA" /></Field>
              </div>
              <Field label="ZIP"><TextField value={draft.zip} onChange={(e) => setDraft({ ...draft, zip: e.target.value })} placeholder="94954" /></Field>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </ModalFooter>
    </>
  )
}

// ─── Card on file ─────────────────────────────────────────────────────────────

export function CardOnFileModal({
  open,
  current,
  onClose,
  onSave,
}: {
  open: boolean
  current?: CardRef
  onClose: () => void
  onSave: (card: CardRef) => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <CardOnFileForm current={current} onClose={onClose} onSave={onSave} />}
    </Modal>
  )
}

function CardOnFileForm({ current, onClose, onSave }: { current?: CardRef; onClose: () => void; onSave: (c: CardRef) => void }) {
  const cards = usePaymentMethods()
  const initialId = cards.find((c) => c.last4 === current?.last4)?.id ?? cards[0]?.id ?? 'new'
  const [selectedId, setSelectedId] = useState(initialId)
  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')

  const isNew = selectedId === 'new'
  const canSave = isNew ? num.replace(/\D/g, '').length >= 13 && /^\d{2}\/\d{2}$/.test(exp.trim()) && cvc.trim().length >= 3 : true

  function handleSave() {
    if (!canSave) return
    if (isNew) {
      const [mm, yy] = exp.trim().split('/')
      onSave({ brand: 'visa', last4: num.replace(/\D/g, '').slice(-4), expiresMonth: mm, expiresYear: `20${yy}` })
    } else {
      const c = cards.find((x) => x.id === selectedId)
      if (c) onSave({ brand: c.brand, last4: c.last4, expiresMonth: c.expiresMonth, expiresYear: c.expiresYear })
    }
    onClose()
  }

  return (
    <>
      <ModalHeader title="Card on file" onClose={onClose} />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-sm">
          {cards.map((c) => (
            <RadioCard key={c.id} selected={selectedId === c.id} onSelect={() => setSelectedId(c.id)}>
              <div className="flex items-center gap-vintiga-md">
                <CardBrandLogo brand={c.brand} />
                <span className="typo-body-sm font-medium text-vintiga-slate-900">•••• {c.last4}</span>
                <span className="typo-caption text-vintiga-slate-500 ml-auto">{c.expiresMonth}/{c.expiresYear.slice(-2)}</span>
              </div>
            </RadioCard>
          ))}
          <RadioCard selected={isNew} onSelect={() => setSelectedId('new')}>
            <span className="inline-flex items-center gap-vintiga-sm typo-body-sm font-semibold text-vintiga-slate-900">
              <PlusIcon className="w-4 h-4" /> Add a new card
            </span>
          </RadioCard>
          {isNew && (
            <div className="rounded-vintiga-card bg-vintiga-surface-secondary p-vintiga-md flex flex-col gap-vintiga-md mt-1">
              <Field label="Card number">
                <TextField value={num} onChange={(e) => setNum(e.target.value)} placeholder="4242 4242 4242 4242" />
              </Field>
              <div className="grid grid-cols-2 gap-vintiga-md">
                <Field label="Expiry (MM/YY)"><TextField value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM/YY" /></Field>
                <Field label="CVC"><TextField value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" /></Field>
              </div>
              <p className="typo-caption text-vintiga-slate-500">Securely processed — card details never touch our servers.</p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!canSave}>Use this card</Button>
      </ModalFooter>
    </>
  )
}

// ─── Delivery method + destination (combined) ─────────────────────────────────
// Jul 15 review: one control that combines the "ship or pickup" choice with the
// destination. Since most customers have one pickup location + one address, we
// list pickup locations AND saved addresses together — one tap sets both the
// method and where it goes. Same paradigm to hand to Vantage.

export interface DeliveryChoice { method: 'ship' | 'pickup'; destination: string }

export function DeliveryDestinationModal({
  open,
  current,
  onClose,
  onSave,
}: {
  open: boolean
  current: DeliveryChoice
  onClose: () => void
  onSave: (choice: DeliveryChoice) => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <DeliveryDestinationForm current={current} onClose={onClose} onSave={onSave} />}
    </Modal>
  )
}

function DeliveryDestinationForm({ current, onClose, onSave }: { current: DeliveryChoice; onClose: () => void; onSave: (c: DeliveryChoice) => void }) {
  const addresses = useAddresses()
  // A flat list of every destination the customer can choose — pickups then addresses.
  const options: DeliveryChoice[] = [
    ...PICKUP_LOCATIONS.map((loc) => ({ method: 'pickup' as const, destination: loc })),
    ...addresses.map((a) => ({ method: 'ship' as const, destination: formatAddress(a) })),
  ]
  const key = (c: DeliveryChoice) => `${c.method}:${c.destination}`
  const [selected, setSelected] = useState(key(current))
  const [tab, setTab] = useState<'pick' | 'new'>('pick')
  const [draft, setDraft] = useState({ street: '', city: '', state: '', zip: '' })

  function handleSave() {
    if (tab === 'new' && draft.street.trim()) {
      onSave({ method: 'ship', destination: formatAddress(draft) })
    } else {
      const chosen = options.find((o) => key(o) === selected) ?? options[0]
      if (chosen) onSave(chosen)
    }
    onClose()
  }

  return (
    <>
      <ModalHeader title="Delivery" description="Pick up at a tasting room, or ship to an address." onClose={onClose} />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <SegmentedControl<'pick' | 'new'>
            value={tab}
            onChange={setTab}
            options={[{ value: 'pick', label: 'Pickup or saved address' }, { value: 'new', label: 'New address' }]}
          />
          {tab === 'pick' ? (
            <div className="flex flex-col gap-vintiga-sm">
              {options.map((o) => (
                <RadioCard key={key(o)} selected={selected === key(o)} onSelect={() => setSelected(key(o))}>
                  <div className="flex items-center gap-vintiga-md">
                    <span className="text-vintiga-slate-400 shrink-0 [&>svg]:w-4 [&>svg]:h-4">{o.method === 'pickup' ? <MapPinIcon /> : <TruckIcon />}</span>
                    <div className="min-w-0">
                      <p className="typo-body-sm font-semibold text-vintiga-slate-900">{o.method === 'pickup' ? 'Pickup' : 'Ship'} · {o.destination}</p>
                    </div>
                  </div>
                </RadioCard>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-vintiga-md">
              <Field label="Street address"><TextField value={draft.street} onChange={(e) => setDraft({ ...draft, street: e.target.value })} placeholder="123 Main St" /></Field>
              <div className="grid grid-cols-2 gap-vintiga-md">
                <Field label="City"><TextField value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} placeholder="City" /></Field>
                <Field label="State"><TextField value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} placeholder="CA" /></Field>
              </div>
              <Field label="ZIP"><TextField value={draft.zip} onChange={(e) => setDraft({ ...draft, zip: e.target.value })} placeholder="94954" /></Field>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </ModalFooter>
    </>
  )
}
