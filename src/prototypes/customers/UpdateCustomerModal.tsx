import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Checkbox } from '@ds/shared/Checkbox'
import { Button } from '@ds/shared/Button'
import { customerActions, useCustomerProfile, type CustomerProfile } from './customerStore'

// ─── UpdateCustomerModal ──────────────────────────────────────────────────────
// Triggered by the "Update" button on the customer header card. Mirrors Figma
// modal `519:18498` — full profile form: salutation, name, email, phone, DOB,
// country, addresses, company, zip, marketing opt-in.

const SALUTATIONS = [
  { value: '',    label: 'None' },
  { value: 'mr',  label: 'Mr.' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'ms',  label: 'Ms.' },
  { value: 'mx',  label: 'Mx.' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France']

export function UpdateCustomerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      {/* Mount the form fresh each time the modal opens so a cancelled edit
          doesn't leak into the next open — `useState(profile)` snapshots the
          live profile at mount. */}
      {open && <UpdateCustomerForm onClose={onClose} />}
    </Modal>
  )
}

function UpdateCustomerForm({ onClose }: { onClose: () => void }) {
  const profile = useCustomerProfile()
  const [draft, setDraft] = useState<CustomerProfile>(profile)

  function patch<K extends keyof CustomerProfile>(key: K, value: CustomerProfile[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function handleSubmit() {
    customerActions.updateProfile(draft)
    onClose()
  }

  return (
    <>
      <ModalHeader title="Update Customer" onClose={onClose} />

      <ModalBody className="overflow-y-auto max-h-[70vh]">
        {/* Row 1: Salutation · First Name · Last Name */}
        <div className="grid grid-cols-[88px_1fr_1fr] gap-vintiga-sm">
          <Field label="Sal.">
            <Select
              value={draft.salutation}
              onChange={(e) => patch('salutation', e.target.value)}
              options={SALUTATIONS}
            />
          </Field>
          <Field label="First Name" required>
            <TextField
              value={draft.firstName}
              onChange={(e) => patch('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </Field>
          <Field label="Last Name" required>
            <TextField
              value={draft.lastName}
              onChange={(e) => patch('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </Field>
        </div>

        <Field label="Email" required>
          <TextField
            type="email"
            value={draft.email}
            onChange={(e) => patch('email', e.target.value)}
            placeholder="Enter a valid email"
          />
        </Field>

        <Field label="Phone Number" required>
          <TextField
            type="tel"
            value={draft.phone}
            onChange={(e) => patch('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </Field>

        {/* DOB — Month / Day / Year */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-vintiga-sm">
          <Field label="Month">
            <Select
              value={draft.dobMonth}
              onChange={(e) => patch('dobMonth', e.target.value)}
              options={['', ...MONTHS].map((m) => ({ value: m, label: m || 'Month' }))}
            />
          </Field>
          <Field label="Day">
            <TextField
              value={draft.dobDay}
              onChange={(e) => patch('dobDay', e.target.value)}
              placeholder="DD"
            />
          </Field>
          <Field label="Year">
            <TextField
              value={draft.dobYear}
              onChange={(e) => patch('dobYear', e.target.value)}
              placeholder="YYYY"
            />
          </Field>
        </div>

        <Field label="Country">
          <Select
            value={draft.country}
            onChange={(e) => patch('country', e.target.value)}
            options={COUNTRIES}
          />
        </Field>

        <Field label="Address">
          <TextField
            value={draft.address}
            onChange={(e) => patch('address', e.target.value)}
            placeholder="Street address, Apt, suite, unit, etc."
          />
        </Field>

        <Field label="Address 2">
          <TextField
            value={draft.address2}
            onChange={(e) => patch('address2', e.target.value)}
            placeholder="Street address, Apt, suite, unit, etc."
          />
        </Field>

        <Field label="Company">
          <TextField
            value={draft.company}
            onChange={(e) => patch('company', e.target.value)}
            placeholder="Company name"
          />
        </Field>

        <Field label="Zip Code">
          <TextField
            value={draft.zipCode}
            onChange={(e) => patch('zipCode', e.target.value)}
            placeholder="Enter Zip Code for City and State"
          />
        </Field>

        {/* Email Marketing Status — radio-style checkboxes per Figma */}
        <Field label="Email Marketing Status">
          <div className="flex flex-col gap-vintiga-xs">
            <Checkbox
              checked={draft.emailMarketing === 'subscribed'}
              onChange={(c) => patch('emailMarketing', c ? 'subscribed' : null)}
              label="Subscribed"
            />
            <Checkbox
              checked={draft.emailMarketing === 'not-subscribed'}
              onChange={(c) => patch('emailMarketing', c ? 'not-subscribed' : null)}
              label="Not Subscribed"
            />
          </div>
        </Field>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </ModalFooter>
    </>
  )
}
