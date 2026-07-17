import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Button } from '@ds/shared/Button'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { SearchIcon } from '@ds/icons/Icons'
import { Select, TimeField, TextInput, type Option } from './ResControls'

// ─── Reservation modals ───────────────────────────────────────────────────────
// "Hold Location" (4781-19418) and "Block a Reservation Time" (4781-19163) — the
// More-menu actions on the Reservations list. Built with the DS Modal.

const EXPERIENCES: Option[] = [
  { value: 'lunch', label: 'Lunch' },
  { value: 'private-tasting', label: 'Private Tasting Experience' },
  { value: 'wine-tasting', label: 'Wine Tasting' },
]
const LOCATIONS: Option[] = [
  { value: 'demo', label: 'Demo Location' },
  { value: 'estate', label: 'Estate Tasting Room' },
  { value: 'downtown', label: 'Downtown Tasting Room' },
]
const TABLES: Option[] = [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }]

export function HoldLocationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [exp, setExp] = useState('lunch')
  const [date, setDate] = useState('Jan 15, 2025')
  const [resTime, setResTime] = useState(''); const [resPeriod, setResPeriod] = useState<'AM' | 'PM'>('AM')
  const [guests, setGuests] = useState('2')
  const [closeTime, setCloseTime] = useState(''); const [closePeriod, setClosePeriod] = useState<'AM' | 'PM'>('PM')
  const [loc, setLoc] = useState('demo')
  const [table, setTable] = useState('1')
  const [notes, setNotes] = useState('')

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title="Hold Location" onClose={onClose} />
      <ModalBody>
        <Field label="Experience"><Select value={exp} onChange={setExp} options={EXPERIENCES} /></Field>
        <div className="grid grid-cols-2 gap-vintiga-md">
          <Field label="Date"><TextInput value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Reservation Time"><TimeField time={resTime} period={resPeriod} onTime={setResTime} onPeriod={setResPeriod} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-vintiga-md">
          <Field label="Guest Count"><TextInput value={guests} onChange={(e) => setGuests(e.target.value)} /></Field>
          <Field label="Close Out Time"><TimeField time={closeTime} period={closePeriod} onTime={setCloseTime} onPeriod={setClosePeriod} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-vintiga-md">
          <Field label="Location"><Select value={loc} onChange={setLoc} options={LOCATIONS} /></Field>
          <Field label="Table"><Select value={table} onChange={setTable} options={TABLES} /></Field>
        </div>
        <Field label="Host"><TextField placeholder="Search Host…" leftIcon={<SearchIcon className="w-4 h-4" />} /></Field>
        <Field label="Notes"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Save</Button>
      </ModalFooter>
    </Modal>
  )
}

// Edits the day's Schedule + Staff notes shown in the reservations header
// popover (Jul 9 review). The title names the day being edited — the header has
// a date picker, so "Today" would be wrong on any other day.
export function NotesModal({
  open,
  date,
  scheduleNotes,
  staffNotes,
  onClose,
  onSave,
}: {
  open: boolean
  /** The day whose notes are being edited. */
  date: Date
  scheduleNotes: string
  staffNotes: string
  onClose: () => void
  onSave: (schedule: string, staff: string) => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <NotesForm date={date} scheduleNotes={scheduleNotes} staffNotes={staffNotes} onClose={onClose} onSave={onSave} />}
    </Modal>
  )
}

function NotesForm({ date, scheduleNotes, staffNotes, onClose, onSave }: { date: Date; scheduleNotes: string; staffNotes: string; onClose: () => void; onSave: (s: string, st: string) => void }) {
  const [schedule, setSchedule] = useState(scheduleNotes)
  const [staff, setStaff] = useState(staffNotes)
  const title = `Notes for ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  return (
    <>
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <Field label="Schedule Notes"><Textarea rows={3} value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="e.g. Vintiga is coming around 12." /></Field>
        <Field label="Staff Notes"><Textarea rows={3} value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="e.g. Slushy machine is broken; Sam is out sick." /></Field>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { onSave(schedule.trim(), staff.trim()); onClose() }}>Save Notes</Button>
      </ModalFooter>
    </>
  )
}

export function BlockTimeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [exp, setExp] = useState('lunch')
  const [date, setDate] = useState('Jan 15, 2025')
  const [fromTime, setFromTime] = useState(''); const [fromPeriod, setFromPeriod] = useState<'AM' | 'PM'>('PM')
  const [toTime, setToTime] = useState(''); const [toPeriod, setToPeriod] = useState<'AM' | 'PM'>('PM')

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title="Block a Reservation Time" onClose={onClose} />
      <ModalBody>
        <div className="grid grid-cols-2 gap-vintiga-md">
          <Field label="Experience"><Select value={exp} onChange={setExp} options={EXPERIENCES} /></Field>
          <Field label="Date"><TextInput value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-vintiga-md">
          <Field label="From Time"><TimeField time={fromTime} period={fromPeriod} onTime={setFromTime} onPeriod={setFromPeriod} /></Field>
          <Field label="To Time"><TimeField time={toTime} period={toPeriod} onTime={setToTime} onPeriod={setToPeriod} /></Field>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Save</Button>
      </ModalFooter>
    </Modal>
  )
}
