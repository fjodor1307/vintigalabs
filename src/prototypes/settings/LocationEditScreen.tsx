import { useState } from 'react'
import { SettingsLayout } from './SettingsLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { Switch } from '@ds/shared/Switch'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import {
  EllipsisVerticalIcon,
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
// Single-location editor. Identity card on top, then the Business Hours
// table (one row per day, open/close time inputs, per-day notes, and a
// per-day Closed toggle), then the Pickup Instructions card. Direct surface
// for LIN-517 — the website pulls hours + pickup instructions from here.

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

  const [name, setName]         = useState(seed.name)
  const [street, setStreet]     = useState(seed.street)
  const [city, setCity]         = useState(seed.city)
  const [stateProv, setState]   = useState(seed.state)
  const [zip, setZip]           = useState(seed.zip)
  const [country, setCountry]   = useState(seed.country)
  const [phone, setPhone]       = useState(seed.phone)
  const [email, setEmail]       = useState(seed.email)
  const [pickupEnabled, setPickupEnabled] = useState(seed.pickupEnabled)
  const [pickupInstructions, setPickupInstructions] = useState(seed.pickupInstructions)
  const [hours, setHours]       = useState<Record<DayKey, BusinessHours>>(seed.hours)

  function patchDay(day: DayKey, patch: Partial<BusinessHours>) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }))
  }

  return (
    <SettingsLayout
      breadcrumbs={[
        { label: 'Settings',  href: '#/web/settings' },
        { label: 'Locations', href: '#/web/settings/locations' },
        { label: seed.name },
      ]}
      title={
        <span className="inline-flex items-center gap-vintiga-sm">
          <span>{name || seed.name}</span>
          {seed.status === 'active'
            ? <Tag variant="filled" tone="success" size="md">Active</Tag>
            : <Tag variant="neutral-light" tone="default" size="md">Inactive</Tag>}
        </span>
      }
      actions={
        <>
          <Button onClick={() => { window.location.hash = '/web/settings/locations' }}>Save</Button>
          <PopoverMenu
            align="right"
            width="w-44"
            trigger={(_open, toggle) => (
              <IconButton
                variant="outline"
                size="md"
                icon={<EllipsisVerticalIcon />}
                onClick={toggle}
                aria-label="Location actions"
              />
            )}
            items={[
              { label: 'Duplicate', onClick: () => {} },
              { label: 'Archive',   onClick: () => {}, danger: true },
            ]}
          />
        </>
      }
    >
      <div className="flex flex-col gap-vintiga-lg">
        <SectionCard title="Identity" icon={<MapPinIcon />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
            <Field label="Location name" required>
              <TextField value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Phone">
              <TextField value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Email">
              <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          </div>
          <Field label="Street address" required>
            <TextField value={street} onChange={(e) => setStreet(e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-vintiga-md">
            <Field label="City"     required><TextField value={city} onChange={(e) => setCity(e.target.value)} /></Field>
            <Field label="State"    required><TextField value={stateProv} onChange={(e) => setState(e.target.value)} /></Field>
            <Field label="ZIP"      required><TextField value={zip} onChange={(e) => setZip(e.target.value)} /></Field>
            <Field label="Country"  required><TextField value={country} onChange={(e) => setCountry(e.target.value)} /></Field>
          </div>
        </SectionCard>

        <SectionCard
          title="Business Hours"
          icon={<ClockIcon />}
          action={
            <span className="typo-caption text-vintiga-slate-500">
              Times shown to customers on the website checkout pickup picker.
            </span>
          }
        >
          <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
            <div className="grid grid-cols-[140px_1fr_1fr_56px] items-center gap-vintiga-md px-vintiga-md py-vintiga-sm bg-vintiga-slate-50 border-b border-vintiga-slate-200 typo-caption font-semibold text-vintiga-slate-700 uppercase tracking-wider">
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
                    'flex flex-col gap-vintiga-sm px-vintiga-md py-vintiga-sm',
                    idx > 0 ? 'border-t border-vintiga-slate-200' : '',
                  ].join(' ')}
                >
                  <div className="grid grid-cols-[140px_1fr_1fr_56px] items-center gap-vintiga-md">
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
        </SectionCard>

        <SectionCard
          title="Pickup"
          icon={<PackageIcon />}
          action={
            <Switch
              checked={pickupEnabled}
              onChange={setPickupEnabled}
              label="Allow pickup at this location"
            />
          }
        >
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
      </div>
    </SettingsLayout>
  )
}
