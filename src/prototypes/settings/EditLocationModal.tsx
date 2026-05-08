import { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { Select } from '@ds/shared/Select'
import { Switch } from '@ds/shared/Switch'
import { Button } from '@ds/shared/Button'
import {
  DAY_KEYS,
  DAY_LABELS,
  type BusinessHours,
  type DayKey,
  type Location,
} from './locationsSample'

// ─── EditLocationModal ───────────────────────────────────────────────────────
// Modal-form for editing a single location. Identity fields match Figma
// 1812:4936 verbatim — Name, Address (+ Address Line 2), Country, then
// State / City / Zip, Phone, and Latitude / Longitude with the "Get from
// address" auto-geocode CTA.
//
// LIN-517 additions surfaced below the existing fields:
//   • Business Hours table — Mon–Sun rows, open/close, per-day notes,
//     Closed switch.
//   • Pickup section — toggle the location's pickup-availability and edit
//     the free-text instructions the website renders to checkout.

const COUNTRIES = ['United States', 'Canada', 'Mexico', 'United Kingdom']

export interface EditLocationModalProps {
  open: boolean
  location: Location | null
  onClose: () => void
  onSave: (next: Location) => void
}

export function EditLocationModal({ open, location, onClose, onSave }: EditLocationModalProps) {
  const [name, setName]                 = useState('')
  const [address, setAddress]           = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [country, setCountry]           = useState('United States')
  const [state, setState]               = useState('')
  const [city, setCity]                 = useState('')
  const [zip, setZip]                   = useState('')
  const [phone, setPhone]               = useState('')
  const [latitude, setLatitude]         = useState('')
  const [longitude, setLongitude]       = useState('')
  const [pickupEnabled, setPickupEnabled]             = useState(false)
  const [pickupInstructions, setPickupInstructions]   = useState('')
  const [hours, setHours] = useState<Record<DayKey, BusinessHours>>(() => emptyHours())

  // Re-seed every time we open the modal with a new location.
  useEffect(() => {
    if (!location) return
    setName(location.name)
    setAddress(location.address)
    setAddressLine2(location.addressLine2)
    setCountry(location.country)
    setState(location.state)
    setCity(location.city)
    setZip(location.zip)
    setPhone(location.phone)
    setLatitude(location.latitude)
    setLongitude(location.longitude)
    setPickupEnabled(location.pickupEnabled)
    setPickupInstructions(location.pickupInstructions)
    setHours(location.hours)
  }, [location])

  function patchDay(day: DayKey, patch: Partial<BusinessHours>) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }))
  }

  function handleSave() {
    if (!location) return
    onSave({
      ...location,
      name, address, addressLine2, country, state, city, zip, phone,
      latitude, longitude, pickupEnabled, pickupInstructions, hours,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Edit Location" onClose={onClose} />
      <ModalBody className="flex flex-col gap-vintiga-md">
        <Field label="Name" required>
          <TextField value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="Address">
          <TextField value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>

        <Field label="Address Line 2">
          <TextField value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
        </Field>

        <Field label="Country">
          <Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={COUNTRIES}
          />
        </Field>

        <div className="grid grid-cols-3 gap-vintiga-md">
          <Field label="State">
            <TextField value={state} onChange={(e) => setState(e.target.value)} />
          </Field>
          <Field label="City">
            <TextField value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="Zip Code">
            <TextField value={zip} onChange={(e) => setZip(e.target.value)} />
          </Field>
        </div>

        <Field label="Phone Number">
          <TextField value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>

        <div className="grid grid-cols-[1fr_1fr_auto] gap-vintiga-md items-end">
          <Field label="Latitude">
            <TextField type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </Field>
          <Field label="Longitude">
            <TextField type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </Field>
          <Button
            variant="outline"
            onClick={() => {
              // Placeholder geocode — in production this calls the geocoding
              // service; here we just stamp a plausible value so the button
              // demonstrates the affordance.
              if (!latitude)  setLatitude('47.7544')
              if (!longitude) setLongitude('-122.1635')
            }}
          >
            Get from address
          </Button>
        </div>
        <p className="typo-caption text-vintiga-slate-500 -mt-vintiga-sm">
          Leave blank to automatically generate coordinates when saving.
        </p>

        {/* ── Business Hours (LIN-517) ─────────────────────────────────── */}
        <div className="flex flex-col gap-vintiga-sm pt-vintiga-md border-t border-vintiga-slate-200">
          <div className="flex items-center justify-between gap-vintiga-md">
            <h3 className="typo-body font-semibold text-vintiga-slate-900">Business Hours</h3>
            <span className="typo-caption text-vintiga-slate-500">Shown on website checkout pickup picker.</span>
          </div>
          <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
            <div className="grid grid-cols-[112px_1fr_1fr_56px] items-center gap-vintiga-sm px-vintiga-md py-vintiga-xs bg-vintiga-slate-50 border-b border-vintiga-slate-200 typo-caption font-semibold text-vintiga-slate-700 uppercase tracking-wider">
              <span>Day</span>
              <span>Open</span>
              <span>Close</span>
              <span className="text-right">Closed</span>
            </div>
            {DAY_KEYS.map((day, idx) => {
              const h = hours[day]
              return (
                <div
                  key={day}
                  className={[
                    'flex flex-col gap-vintiga-xs px-vintiga-md py-vintiga-sm',
                    idx > 0 ? 'border-t border-vintiga-slate-200' : '',
                  ].join(' ')}
                >
                  <div className="grid grid-cols-[112px_1fr_1fr_56px] items-center gap-vintiga-sm">
                    <span className="typo-body-sm font-semibold text-vintiga-slate-900">{DAY_LABELS[day]}</span>
                    <TextField
                      value={h.open}
                      onChange={(e) => patchDay(day, { open: e.target.value })}
                      placeholder="09:00"
                      disabled={h.closed}
                    />
                    <TextField
                      value={h.close}
                      onChange={(e) => patchDay(day, { close: e.target.value })}
                      placeholder="17:00"
                      disabled={h.closed}
                    />
                    <div className="flex justify-end">
                      <Switch
                        checked={h.closed}
                        onChange={(closed) => patchDay(day, { closed })}
                        aria-label={`${DAY_LABELS[day]} closed all day`}
                      />
                    </div>
                  </div>
                  <TextField
                    value={h.notes ?? ''}
                    onChange={(e) => patchDay(day, { notes: e.target.value })}
                    placeholder="Notes (e.g. closed 12–2 for lunch)"
                    disabled={h.closed}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Pickup (LIN-517) ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-vintiga-sm pt-vintiga-md border-t border-vintiga-slate-200">
          <div className="flex items-center justify-between gap-vintiga-md">
            <h3 className="typo-body font-semibold text-vintiga-slate-900">Pickup</h3>
            <Switch
              checked={pickupEnabled}
              onChange={setPickupEnabled}
              label="Allow pickup at this location"
            />
          </div>
          <Field
            label="Pickup instructions"
            helper="Shown to customers who choose pickup at checkout. Include parking, door, and ID details."
          >
            <Textarea
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              placeholder="e.g. Park in the rear lot, use the side door marked Pickup, bring photo ID."
              disabled={!pickupEnabled}
              className="min-h-[96px]"
            />
          </Field>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </ModalFooter>
    </Modal>
  )
}

function emptyHours(): Record<DayKey, BusinessHours> {
  const empty: Record<DayKey, BusinessHours> = {} as Record<DayKey, BusinessHours>
  for (const k of DAY_KEYS) empty[k] = { closed: false, open: '', close: '' }
  return empty
}
