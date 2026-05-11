import { useState } from 'react'
import { SettingsLayout } from './SettingsLayout'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { Select } from '@ds/shared/Select'
import { Switch } from '@ds/shared/Switch'
import { Checkbox } from '@ds/shared/Checkbox'
import { Button } from '@ds/shared/Button'
import { SectionCard } from '@ds/shared/SectionCard'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@ds/shared/Table'
import {
  MapPinIcon,
  ClockIcon,
  PackageIcon,
} from '@ds/icons/Icons'
import {
  DAY_KEYS,
  DAY_LABELS,
  LOCATIONS,
  type BusinessHours,
  type DayKey,
  type Location,
} from './locationsSample'

// ─── LocationEditScreen ──────────────────────────────────────────────────────
// Dedicated edit page for a single location (Figma 5736:41353). Two-column
// layout: Identity + Business Hours stacked in the main column, Pickup
// anchored to the right rail. Identity matches the Figma field set —
// Name, Address, Address Line 2, then a 4-up Country / State / City / Zip,
// Phone, and Lat/Lng with the "Get from address" auto-geocode CTA. Business
// Hours is now a flat 5-column table per day (Day · Open · Close ·
// Description · Closed) instead of stacked per-day note rows. Pickup is a
// compact rail card with a checkbox toggle and the website-rendered
// instructions textarea.

const COUNTRIES = ['United States', 'Canada', 'Mexico', 'United Kingdom']

function getLocationFromHash(): Location {
  const m = window.location.hash.match(/^#\/web\/settings\/locations\/([^/?]+)/)
  if (m) {
    const id = decodeURIComponent(m[1])
    const found = LOCATIONS.find((l) => l.id === id)
    if (found) return found
  }
  return LOCATIONS[0]
}

export function LocationEditScreen() {
  const seed = getLocationFromHash()

  const [name, setName]                 = useState(seed.name)
  const [address, setAddress]           = useState(seed.address)
  const [addressLine2, setAddressLine2] = useState(seed.addressLine2)
  const [country, setCountry]           = useState(seed.country)
  const [state, setState]               = useState(seed.state)
  const [city, setCity]                 = useState(seed.city)
  const [zip, setZip]                   = useState(seed.zip)
  const [phone, setPhone]               = useState(seed.phone)
  const [latitude, setLatitude]         = useState(seed.latitude)
  const [longitude, setLongitude]       = useState(seed.longitude)
  const [pickupEnabled, setPickupEnabled]           = useState(seed.pickupEnabled)
  const [pickupInstructions, setPickupInstructions] = useState(seed.pickupInstructions)
  const [hours, setHours] = useState<Record<DayKey, BusinessHours>>(seed.hours)

  function patchDay(day: DayKey, patch: Partial<BusinessHours>) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }))
  }

  function handleSave()   { window.location.hash = '/web/settings' }
  function handleCancel() { window.location.hash = '/web/settings' }

  return (
    <SettingsLayout
      breadcrumbs={[
        { label: 'Locations', href: '#/web/settings' },
        { label: seed.name },
      ]}
      title={name || seed.name}
      actions={
        <>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </>
      }
      rail={
        <SectionCard title="Pickup" icon={<PackageIcon />}>
          <Checkbox
            checked={pickupEnabled}
            onChange={setPickupEnabled}
            label="Allow pickup at this location"
          />
          <Field
            label="Pickup instructions"
            helper="Shown to customers who choose pickup at checkout. Include parking, door, and ID details."
          >
            <Textarea
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              placeholder="e.g. Park in the rear lot, use the side door marked Pickup, bring photo ID."
              disabled={!pickupEnabled}
              className="min-h-[120px]"
            />
          </Field>
        </SectionCard>
      }
    >
      <div className="flex flex-col gap-vintiga-lg">
        <SectionCard title="Identity" icon={<MapPinIcon />}>
          <Field label="Name" required>
            <TextField value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field label="Address">
            <TextField value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>

          <Field label="Address Line 2">
            <TextField value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-vintiga-md">
            <Field label="Country">
              <Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                options={COUNTRIES}
              />
            </Field>
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

          <div>
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
                  // service. Here we stamp plausible values so the button has
                  // observable behaviour.
                  if (!latitude)  setLatitude('47.7544')
                  if (!longitude) setLongitude('-122.1635')
                }}
              >
                Get from address
              </Button>
            </div>
            <p className="typo-caption text-vintiga-slate-500 mt-vintiga-xs">
              Leave blank to automatically generate coordinates when saving.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Business Hours" icon={<ClockIcon />}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="w-32">Day</TableHeader>
                <TableHeader className="w-28">Open</TableHeader>
                <TableHeader className="w-28">Close</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader className="w-20 text-right">Closed</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {DAY_KEYS.map((day) => {
                const h = hours[day]
                return (
                  <TableRow key={day}>
                    <TableCell className="font-medium text-vintiga-slate-900">{DAY_LABELS[day]}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <TextField
                          value={h.open}
                          onChange={(e) => patchDay(day, { open: e.target.value })}
                          placeholder="09:00"
                          disabled={h.closed}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <TextField
                          value={h.close}
                          onChange={(e) => patchDay(day, { close: e.target.value })}
                          placeholder="17:00"
                          disabled={h.closed}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={h.notes ?? ''}
                        onChange={(e) => patchDay(day, { notes: e.target.value })}
                        placeholder="Notes"
                        disabled={h.closed}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={h.closed}
                        onChange={(closed) => patchDay(day, { closed })}
                        aria-label={`${DAY_LABELS[day]} closed all day`}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <p className="typo-caption text-vintiga-slate-500 mt-vintiga-xs">
            Times shown to customers on the website checkout pickup picker.
          </p>
        </SectionCard>
      </div>
    </SettingsLayout>
  )
}
