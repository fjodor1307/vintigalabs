import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Textarea } from '@ds/shared/Textarea'
import { Checkbox } from '@ds/shared/Checkbox'
import { Button } from '@ds/shared/Button'
import { SearchIcon, CalendarIcon } from '@ds/icons/Icons'
import { CLUB_OPTIONS, CANCEL_REASONS, type Membership } from './membershipsData'

// ─── Membership modals ────────────────────────────────────────────────────────
// Add / Edit / Cancel for the customer Memberships tab (Figma designs, Jul 9).
// Local-state prototype: the screen owns the memberships array and applies the
// result of each modal.

// ─── Add / Edit ───────────────────────────────────────────────────────────────

export interface MembershipFormValue {
  salesAssociate: string
  club: string
  signupDate: string
  notify: boolean
}

export function AddEditMembershipModal({
  open,
  mode,
  initial,
  onClose,
  onSave,
}: {
  open: boolean
  mode: 'add' | 'edit'
  initial?: Membership
  onClose: () => void
  onSave: (value: MembershipFormValue) => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <AddEditForm mode={mode} initial={initial} onClose={onClose} onSave={onSave} />}
    </Modal>
  )
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function AddEditForm({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: 'add' | 'edit'
  initial?: Membership
  onClose: () => void
  onSave: (value: MembershipFormValue) => void
}) {
  const [salesAssociate, setSalesAssociate] = useState(initial?.salesAssociate && initial.salesAssociate !== 'None' ? initial.salesAssociate : '')
  const [club, setClub] = useState(initial?.clubName ?? CLUB_OPTIONS[0].name)
  const [signupDate, setSignupDate] = useState(initial?.joined ?? todayLabel())
  const [notify, setNotify] = useState(false)

  function handleSave() {
    onSave({ salesAssociate: salesAssociate.trim() || 'None', club, signupDate, notify })
    onClose()
  }

  return (
    <>
      <ModalHeader title={mode === 'add' ? 'Add Membership' : 'Edit Membership'} onClose={onClose} />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <Field label="Sales Associate">
            <TextField
              value={salesAssociate}
              onChange={(e) => setSalesAssociate(e.target.value)}
              placeholder="Search Accounts…"
              leftIcon={<SearchIcon className="w-4 h-4" />}
            />
          </Field>
          <Field label="Club">
            <Select
              value={club}
              onChange={(e) => setClub(e.target.value)}
              disabled={mode === 'edit'}
              options={CLUB_OPTIONS.map((c) => ({ value: c.name, label: c.name }))}
            />
          </Field>
          <Field label="Signup Date">
            <TextField
              value={signupDate}
              onChange={(e) => setSignupDate(e.target.value)}
              placeholder="Select a date"
              leftIcon={<CalendarIcon className="w-4 h-4" />}
            />
          </Field>
          <Checkbox checked={notify} onChange={setNotify} label="Send email notification to customer" />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </ModalFooter>
    </>
  )
}

// ─── Cancel ───────────────────────────────────────────────────────────────────

export function CancelMembershipModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string, comment: string) => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <CancelForm onClose={onClose} onConfirm={onConfirm} />}
    </Modal>
  )
}

function CancelForm({ onClose, onConfirm }: { onClose: () => void; onConfirm: (reason: string, comment: string) => void }) {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [notify, setNotify] = useState(false)

  const canSave = reason.length > 0

  function handleSave() {
    if (!canSave) return
    onConfirm(reason, comment.trim())
    onClose()
  }

  return (
    <>
      <ModalHeader title="Cancel Membership" onClose={onClose} />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <Field label="Cancellation Reason" required>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={[
                { value: '', label: 'Select a reason' },
                ...CANCEL_REASONS.map((r) => ({ value: r, label: r })),
              ]}
            />
          </Field>
          <Field label="Comment">
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Add an internal note (optional)" />
          </Field>
          <Checkbox checked={notify} onChange={setNotify} label="Send email notification to customer" />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!canSave}>Save</Button>
      </ModalFooter>
    </>
  )
}
