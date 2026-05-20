import { useMemo, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Radio } from '@ds/shared/Radio'
import { Button } from '@ds/shared/Button'
import { CalendarIcon, TruckIcon, StoreIcon } from '@ds/icons/Icons'
import { CLUBS_CATALOG, CLUB_KEYS, type ClubKey } from './clubsCatalog'

// ─── AddMembershipModal ───────────────────────────────────────────────────────
// Launched from the "Add" button on the Memberships tab. Enrols a customer into
// a club:
//   • pick customer + club + join date
//   • choose delivery method (shipping → address, pickup → location)
//   • pick an existing address or add a new one
// On submit, clubs that carry an initial membership fee create an order for that
// fee (surfaced in the Order Summary section); fee-free clubs just create the
// membership. The prototype has no backend, so submit just closes the modal.

// Sample customers an operator can enrol. In production this is a typeahead
// against the customer directory.
const CUSTOMERS = [
  { id: 'c-jane',    name: 'Jane Davis' },
  { id: 'c-leslie',  name: 'Leslie Alexander' },
  { id: 'c-phoenix', name: 'Phoenix Baker' },
  { id: 'c-marvin',  name: 'Marvin McKinney' },
]

// Per-club initial fee. Clubs absent from this map have no fee — submit just
// creates the membership with no order.
const CLUB_FEES: Partial<Record<ClubKey, { fee: number; taxRate: number }>> = {
  'vintiga-signature': { fee: 120, taxRate: 8 },
  'curators':          { fee: 50,  taxRate: 0 },
}

const SAVED_ADDRESSES = [
  { value: 'home',   label: '1210 Lakeview Street, Bellingham, WA 98229' },
  { value: 'office', label: '500 Market Street, San Francisco, CA 94110' },
]

const PICKUP_LOCATIONS = [
  { value: 'tasting-room', label: 'Vintiga Tasting Room — Bellingham' },
  { value: 'downtown',     label: 'Vintiga Downtown — Seattle' },
]

const CLUB_OPTIONS = [
  { value: '', label: 'Select a club' },
  ...CLUB_KEYS.map((k) => ({ value: k, label: CLUBS_CATALOG[k].name })),
]

export function AddMembershipModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [customer, setCustomer]       = useState('')
  const [club, setClub]               = useState<ClubKey | ''>('')
  const [joinDate, setJoinDate]       = useState('')
  const [delivery, setDelivery]       = useState<'shipping' | 'pickup'>('shipping')
  const [shipAddress, setShipAddress] = useState('home')
  const [pickupLoc, setPickupLoc]     = useState('tasting-room')
  const [newStreet, setNewStreet]     = useState('')
  const [newCity, setNewCity]         = useState('')
  const [newState, setNewState]       = useState('')
  const [newZip, setNewZip]           = useState('')

  const feeInfo = club ? CLUB_FEES[club] : undefined
  const hasFee  = !!feeInfo && feeInfo.fee > 0

  const total = useMemo(() => {
    if (!feeInfo) return 0
    return feeInfo.fee + (feeInfo.fee * feeInfo.taxRate) / 100
  }, [feeInfo])

  function createMembership() {
    // In production: if `hasFee`, POST an order for the fee, then create the
    // membership; otherwise create the membership directly. Prototype just
    // closes the modal.
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader
        title="Add Membership"
        description="Enrol a customer into a club."
        onClose={onClose}
      />
      <ModalBody className="max-h-[70vh] overflow-y-auto">
        {/* Membership — section title omitted; the modal header already says
            "Add Membership". */}
        <Section>
          <Field label="Customer" required>
            <Select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              options={[{ value: '', label: 'Select a customer' }, ...CUSTOMERS.map((c) => ({ value: c.id, label: c.name }))]}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
            <Field label="Club" required>
              <Select
                value={club}
                onChange={(e) => setClub(e.target.value as ClubKey | '')}
                options={CLUB_OPTIONS}
              />
            </Field>
            <Field label="Join Date" required>
              <div className="relative">
                <input
                  type="text"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  placeholder="dd.mm.yyyy"
                  className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                />
                <CalendarIcon className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-vintiga-slate-400 pointer-events-none" />
              </div>
            </Field>
          </div>
        </Section>

        {/* Delivery Method */}
        <Section title="Delivery Method">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
            <DeliveryOption
              selected={delivery === 'shipping'}
              onClick={() => setDelivery('shipping')}
              icon={<TruckIcon />}
              label="Shipping"
            />
            <DeliveryOption
              selected={delivery === 'pickup'}
              onClick={() => setDelivery('pickup')}
              icon={<StoreIcon />}
              label="Pickup"
            />
          </div>

          {delivery === 'shipping' ? (
            <Field label="Shipping Address" required>
              <Select
                value={shipAddress}
                onChange={(e) => setShipAddress(e.target.value)}
                options={[...SAVED_ADDRESSES, { value: 'new', label: '+ Add new address' }]}
              />
            </Field>
          ) : (
            <Field label="Pickup Location" required>
              <Select
                value={pickupLoc}
                onChange={(e) => setPickupLoc(e.target.value)}
                options={PICKUP_LOCATIONS}
              />
            </Field>
          )}

          {delivery === 'shipping' && shipAddress === 'new' && (
            <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md flex flex-col gap-vintiga-md">
              <Field label="Street Address" required>
                <TextField value={newStreet} onChange={(e) => setNewStreet(e.target.value)} placeholder="123 Main Street" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
                <Field label="City" required>
                  <TextField value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="City" />
                </Field>
                <Field label="State" required>
                  <TextField value={newState} onChange={(e) => setNewState(e.target.value)} placeholder="State" />
                </Field>
                <Field label="ZIP" required>
                  <TextField value={newZip} onChange={(e) => setNewZip(e.target.value)} placeholder="ZIP" />
                </Field>
              </div>
            </div>
          )}
        </Section>

        {/* Order Summary — only when the chosen club carries a fee */}
        {hasFee && feeInfo && (
          <Section
            title="Order Summary"
            subtitle="This club has an initial membership fee — an order is created when the membership is created."
          >
            <div className="flex flex-col gap-vintiga-sm">
              <SummaryRow label="Membership Fee" value={`$${feeInfo.fee.toFixed(2)}`} />
              <SummaryRow label={`Tax (${feeInfo.taxRate}%)`} value={`$${((feeInfo.fee * feeInfo.taxRate) / 100).toFixed(2)}`} />
              <div className="border-t border-vintiga-slate-200 pt-vintiga-sm">
                <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
              </div>
            </div>
          </Section>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={createMembership}>Create Membership</Button>
      </ModalFooter>
    </Modal>
  )
}

function Section({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-vintiga-md">
      {(title || subtitle) && (
        <div className="flex flex-col gap-1">
          {title && <h3 className="typo-title-section font-semibold text-vintiga-slate-900">{title}</h3>}
          {subtitle && <p className="typo-body-sm text-vintiga-slate-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

function DeliveryOption({ selected, onClick, icon, label }: { selected: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-vintiga-md p-vintiga-md rounded-vintiga-lg border text-left transition-colors',
        selected
          ? 'border-vintiga-indigo-500 bg-vintiga-indigo-50'
          : 'border-vintiga-slate-200 hover:border-vintiga-slate-300',
      ].join(' ')}
    >
      <Radio checked={selected} aria-label={label} />
      <span className="text-vintiga-slate-500 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
    </button>
  )
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-vintiga-md">
      <span className={`typo-body-sm ${bold ? 'font-semibold text-vintiga-slate-900' : 'text-vintiga-slate-600'}`}>{label}</span>
      <span className={`typo-body-sm ${bold ? 'font-semibold text-vintiga-slate-900' : 'text-vintiga-slate-900'}`}>{value}</span>
    </div>
  )
}
