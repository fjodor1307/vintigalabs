import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Radio } from '@ds/shared/Radio'
import { Button } from '@ds/shared/Button'
import { InfoIcon, StoreIcon, TruckIcon } from '@ds/icons/Icons'
import {
  DELIVERY_PICKUP_LOCATIONS,
  EMPTY_NEW_ADDRESS,
  type DeliveryPickupLocation,
  type DeliverySavedAddress,
  type DeliveryNewAddress,
  type DeliveryResult,
} from '@ds/shared/deliveryMethod'

// ─── Delivery method picker (tiles) ───────────────────────────────────────────
// The one delivery-method control for the app. Extracted verbatim from the Add
// Membership form so every surface (Add Membership, club member detail, customer
// memberships) shows the identical tiles + "Shipping Address" dropdown.
//
// `deliveryOption` is `pickup:{value}` for a pickup location, or `shipping`.
// When shipping, `shipAddress` is a saved-address value or `new` (which reveals
// the inline new-address fields).

function DeliveryOption({ selected, onClick, icon, label }: { selected: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className={[
        'flex items-center gap-vintiga-md p-vintiga-md rounded-vintiga-lg border text-left transition-colors cursor-pointer',
        selected
          ? 'border-vintiga-indigo-500 bg-vintiga-indigo-50'
          : 'border-vintiga-slate-200 hover:border-vintiga-slate-300',
      ].join(' ')}
    >
      <span className={[
        '[&>svg]:w-5 [&>svg]:h-5',
        selected ? 'text-vintiga-indigo-600' : 'text-vintiga-slate-500',
      ].join(' ')}>{icon}</span>
      <span className={[
        'typo-body-sm font-semibold flex-1',
        selected ? 'text-vintiga-indigo-700' : 'text-vintiga-slate-900',
      ].join(' ')}>{label}</span>
      <Radio checked={selected} aria-label={label} />
    </div>
  )
}

export interface DeliveryMethodFieldsProps {
  pickupLocations?: DeliveryPickupLocation[]
  savedAddresses: DeliverySavedAddress[]
  deliveryOption: string
  onDeliveryOptionChange: (v: string) => void
  shipAddress: string
  onShipAddressChange: (v: string) => void
  newAddress: DeliveryNewAddress
  onNewAddressChange: (a: DeliveryNewAddress) => void
}

/** The controlled tiles + shipping-address section. Layout matches Add Membership. */
export function DeliveryMethodFields({
  pickupLocations = DELIVERY_PICKUP_LOCATIONS,
  savedAddresses,
  deliveryOption,
  onDeliveryOptionChange,
  shipAddress,
  onShipAddressChange,
  newAddress,
  onNewAddressChange,
}: DeliveryMethodFieldsProps) {
  const isShipping = deliveryOption === 'shipping'
  return (
    <>
      {/* Pickup tiles first — most operators are enrolling someone who'll grab
          their first shipment in person. Shipping sits at the bottom. */}
      <div className="grid grid-cols-1 gap-vintiga-sm">
        {pickupLocations.map((loc) => {
          const value = `pickup:${loc.value}`
          return (
            <DeliveryOption
              key={value}
              selected={deliveryOption === value}
              onClick={() => onDeliveryOptionChange(value)}
              icon={<StoreIcon />}
              label={`Pickup - ${loc.label}`}
            />
          )
        })}
        <DeliveryOption
          selected={isShipping}
          onClick={() => onDeliveryOptionChange('shipping')}
          icon={<TruckIcon />}
          label="Shipping"
        />
      </div>

      {isShipping && (
        <>
          <Field label="Shipping Address" required>
            <Select
              value={shipAddress}
              onChange={(e) => onShipAddressChange(e.target.value)}
              options={[...savedAddresses, { value: 'new', label: '+ Add new address' }]}
            />
          </Field>
          <div className="flex items-start gap-vintiga-sm rounded-vintiga-md bg-vintiga-slate-50 px-vintiga-md py-vintiga-sm">
            <InfoIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0 mt-0.5" />
            <span className="typo-caption text-vintiga-slate-500">
              If the customer has no saved address, add one below or pick a Pickup location.
            </span>
          </div>
        </>
      )}

      {isShipping && shipAddress === 'new' && (
        <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md flex flex-col gap-vintiga-md">
          <Field label="Street Address" required>
            <TextField value={newAddress.street} onChange={(e) => onNewAddressChange({ ...newAddress, street: e.target.value })} placeholder="123 Main Street" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
            <Field label="City" required>
              <TextField value={newAddress.city} onChange={(e) => onNewAddressChange({ ...newAddress, city: e.target.value })} placeholder="City" />
            </Field>
            <Field label="State" required>
              <TextField value={newAddress.state} onChange={(e) => onNewAddressChange({ ...newAddress, state: e.target.value })} placeholder="State" />
            </Field>
            <Field label="ZIP" required>
              <TextField value={newAddress.zip} onChange={(e) => onNewAddressChange({ ...newAddress, zip: e.target.value })} placeholder="ZIP" />
            </Field>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Editing modal ────────────────────────────────────────────────────────────
// Opened from a delivery summary card (member detail, customer memberships). Same
// fields as above, staged in local state, with a Save action.

function pickupLabel(pickupLocations: DeliveryPickupLocation[], deliveryOption: string): string {
  const v = deliveryOption.slice('pickup:'.length)
  return pickupLocations.find((l) => l.value === v)?.label ?? 'Pickup'
}

export function DeliveryMethodModal({
  open,
  pickupLocations = DELIVERY_PICKUP_LOCATIONS,
  savedAddresses,
  initialOption,
  initialShipAddress,
  onClose,
  onSave,
  onAddAddress,
}: {
  open: boolean
  pickupLocations?: DeliveryPickupLocation[]
  savedAddresses: DeliverySavedAddress[]
  /** `pickup:{value}` or `shipping`. */
  initialOption: string
  /** Saved-address value selected when shipping. */
  initialShipAddress: string
  onClose: () => void
  onSave: (result: DeliveryResult) => void
  /** Persist a brand-new address; returns its saved value + display label. */
  onAddAddress?: (a: DeliveryNewAddress) => DeliverySavedAddress
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && (
        <DeliveryMethodModalForm
          pickupLocations={pickupLocations}
          savedAddresses={savedAddresses}
          initialOption={initialOption}
          initialShipAddress={initialShipAddress}
          onClose={onClose}
          onSave={onSave}
          onAddAddress={onAddAddress}
        />
      )}
    </Modal>
  )
}

function DeliveryMethodModalForm({
  pickupLocations,
  savedAddresses,
  initialOption,
  initialShipAddress,
  onClose,
  onSave,
  onAddAddress,
}: {
  pickupLocations: DeliveryPickupLocation[]
  savedAddresses: DeliverySavedAddress[]
  initialOption: string
  initialShipAddress: string
  onClose: () => void
  onSave: (result: DeliveryResult) => void
  onAddAddress?: (a: DeliveryNewAddress) => DeliverySavedAddress
}) {
  const [deliveryOption, setDeliveryOption] = useState(initialOption)
  const [shipAddress, setShipAddress] = useState(initialShipAddress || savedAddresses[0]?.value || 'new')
  const [newAddress, setNewAddress] = useState<DeliveryNewAddress>(EMPTY_NEW_ADDRESS)

  const isShipping = deliveryOption === 'shipping'
  const isNew = isShipping && shipAddress === 'new'
  const newFilled = !!(newAddress.street && newAddress.city && newAddress.state && newAddress.zip)
  const canSave = !isShipping || (shipAddress !== 'new') || newFilled

  function handleSave() {
    if (!canSave) return
    if (!isShipping) {
      onSave({ method: 'pickup', destination: pickupLabel(pickupLocations, deliveryOption) })
      onClose()
      return
    }
    if (isNew) {
      const line = `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.zip}`
      const added = onAddAddress?.(newAddress)
      onSave({ method: 'ship', destination: added?.label ?? line })
      onClose()
      return
    }
    const addr = savedAddresses.find((a) => a.value === shipAddress)
    onSave({ method: 'ship', destination: addr?.label ?? '' })
    onClose()
  }

  return (
    <>
      <ModalHeader title="Delivery Method" onClose={onClose} />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <DeliveryMethodFields
            pickupLocations={pickupLocations}
            savedAddresses={savedAddresses}
            deliveryOption={deliveryOption}
            onDeliveryOptionChange={setDeliveryOption}
            shipAddress={shipAddress}
            onShipAddressChange={setShipAddress}
            newAddress={newAddress}
            onNewAddressChange={setNewAddress}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!canSave}>Save</Button>
      </ModalFooter>
    </>
  )
}
