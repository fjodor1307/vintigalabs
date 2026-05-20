import { useMemo, useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput, InputWithAdornment } from './ProductLayout'
import { Checkbox } from '@ds/shared/Checkbox'
import { Radio } from '@ds/shared/Radio'
import { Button } from '@ds/shared/Button'
import { Tag } from '@ds/shared/Tag'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@ds/shared/Table'
import { useProductState, productActions, WEEKDAYS, type Blackout, type BlackoutType, type TimeSlot, type Weekday } from './productStore'
import { PlusIcon, TrashIcon } from '@ds/icons/Icons'

type Period = 'AM' | 'PM'

const TYPE_LABEL: Record<BlackoutType, string> = {
  holiday: 'Holiday',
  event:   'Event',
  ops:     'Ops',
  custom:  'Custom',
}

function blackoutUid() { return `bl-${Math.random().toString(36).slice(2, 8)}` }

const INTERVAL_OPTIONS: { value: number; label: string }[] = [
  { value: 15,  label: 'Every 15 minutes' },
  { value: 30,  label: 'Every 30 minutes' },
  { value: 60,  label: 'Every hour' },
  { value: 90,  label: 'Every 90 minutes' },
  { value: 120, label: 'Every 2 hours' },
]

function uid() { return `ts-${Math.random().toString(36).slice(2, 8)}` }

// ── Time math (12-hour "h:mm" + AM/PM) ───────────────────────────────────────
function toMinutes(time: string, period: Period): number | null {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  let h = Number(m[1]) % 12
  if (period === 'PM') h += 12
  return h * 60 + Number(m[2])
}
function fromMinutes(total: number): { time: string; period: Period } {
  const t = ((total % 1440) + 1440) % 1440
  const h24 = Math.floor(t / 60)
  const period: Period = h24 >= 12 ? 'PM' : 'AM'
  let hr = h24 % 12
  if (hr === 0) hr = 12
  return { time: `${hr}:${String(t % 60).padStart(2, '0')}`, period }
}
function buildSlots(open: { time: string; period: Period }, close: { time: string; period: Period }, interval: number): TimeSlot[] {
  const start = toMinutes(open.time, open.period)
  const end = toMinutes(close.time, close.period)
  if (start == null || end == null || end <= start || interval <= 0) return []
  const out: TimeSlot[] = []
  for (let t = start; t < end; t += interval) {
    out.push({ ...fromMinutes(t), id: uid(), online: true })
  }
  return out
}

// ─── Booking settings — duration, granularity, capacity ──────────────────────
// These drive what the website renders: a 30-minute experience booked "every 15
// minutes" shows 9:00, 9:15, 9:30… on the calendar.

function BookingSettings() {
  const product = useProductState()
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Duration" required helper="Total length of a single booking.">
          <InputWithAdornment
            adornment="min"
            placeholder="e.g. 30"
            value={product.durationMinutes}
            onChange={(e) => productActions.setAdvanced({ durationMinutes: e.target.value })}
          />
        </Field>
        <Field label="Booking interval" helper="How often a start time can be reserved.">
          <select
            value={product.bookingInterval}
            onChange={(e) => productActions.setBookingInterval(Number(e.target.value))}
            className="h-10 w-full px-3 pr-8 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors cursor-pointer"
          >
            {INTERVAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Min guests per time slot" helper="Smallest party size that can book a slot.">
          <TextInput type="number" min={0} placeholder="e.g. 1" value={product.minGuestsPerSlot} onChange={(e) => productActions.setAdvanced({ minGuestsPerSlot: e.target.value })} />
        </Field>
        <Field label="Max guests per time slot" helper="Total shared capacity at one slot.">
          <TextInput type="number" min={0} placeholder="e.g. 8" value={product.maxGuestsPerSlot} onChange={(e) => productActions.setAdvanced({ maxGuestsPerSlot: e.target.value })} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Bookable from">
          <TextInput type="date" value={product.startDate} onChange={(e) => productActions.setAdvanced({ startDate: e.target.value })} />
        </Field>
        <Field label="Bookable until" helper="Leave empty to keep the schedule open-ended.">
          <TextInput type="date" value={product.endDate} onChange={(e) => productActions.setAdvanced({ endDate: e.target.value })} />
        </Field>
      </div>
    </div>
  )
}

// ─── Weekly time slots ────────────────────────────────────────────────────────

const TIME_INPUT = 'h-9 w-24 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 text-center tabular-nums focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors'
const PERIOD_SELECT = 'h-9 px-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors cursor-pointer'

function DaySchedule({ day }: { day: Weekday }) {
  const { timeSlotsByDay, bookingInterval } = useProductState()
  const slots = timeSlotsByDay[day]
  // Operating window used by "Generate slots" — local to the editor.
  const [open, setOpen] = useState<{ time: string; period: Period }>({ time: '9:00', period: 'AM' })
  const [close, setClose] = useState<{ time: string; period: Period }>({ time: '5:00', period: 'PM' })

  return (
    <div className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-vintiga-md">
        <span className="typo-body-sm font-semibold text-vintiga-slate-900">{day}</span>
        <button
          type="button"
          onClick={() => productActions.addTimeSlot(day)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add slot
        </button>
      </div>

      {/* Generate from operating hours */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="typo-caption text-vintiga-slate-500">Open</span>
        <input className={TIME_INPUT} value={open.time} placeholder="9:00" onChange={(e) => setOpen({ ...open, time: e.target.value })} aria-label={`${day} open time`} />
        <select className={PERIOD_SELECT} value={open.period} onChange={(e) => setOpen({ ...open, period: e.target.value as Period })} aria-label={`${day} open period`}>
          <option value="AM">AM</option><option value="PM">PM</option>
        </select>
        <span className="typo-caption text-vintiga-slate-500">to</span>
        <input className={TIME_INPUT} value={close.time} placeholder="5:00" onChange={(e) => setClose({ ...close, time: e.target.value })} aria-label={`${day} close time`} />
        <select className={PERIOD_SELECT} value={close.period} onChange={(e) => setClose({ ...close, period: e.target.value as Period })} aria-label={`${day} close period`}>
          <option value="AM">AM</option><option value="PM">PM</option>
        </select>
        <Button variant="outline" size="sm" onClick={() => productActions.setTimeSlots(day, buildSlots(open, close, bookingInterval))}>
          Generate slots
        </Button>
      </div>

      {slots.length === 0 ? (
        <span className="typo-caption text-vintiga-slate-400">Closed — generate from hours or add a slot.</span>
      ) : (
        <div className="flex flex-col gap-2">
          {slots.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="9:00"
                value={s.time}
                onChange={(e) => productActions.updateTimeSlot(day, s.id, { time: e.target.value })}
                className={TIME_INPUT}
                aria-label={`Time for ${day}`}
              />
              <select
                className={PERIOD_SELECT}
                value={s.period}
                onChange={(e) => productActions.updateTimeSlot(day, s.id, { period: e.target.value as Period })}
                aria-label={`Period for ${day}`}
              >
                <option value="AM">AM</option><option value="PM">PM</option>
              </select>
              <div className="w-44">
                <Checkbox
                  checked={s.online}
                  onChange={(next) => productActions.updateTimeSlot(day, s.id, { online: next })}
                  label="Display on website"
                />
              </div>
              <button
                type="button"
                onClick={() => productActions.removeTimeSlot(day, s.id)}
                className="w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-red-600 bg-transparent border-none cursor-pointer"
                aria-label={`Remove time slot from ${day}`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReservationTimeSlots() {
  return (
    <div className="flex flex-col gap-3">
      {WEEKDAYS.map((day) => <DaySchedule key={day} day={day} />)}
    </div>
  )
}

// ─── Blackout dates — modal + table (ported from the matrix prototype) ────────

function toneFor(t: BlackoutType): 'violet' | 'orange' | 'teal' | 'default' {
  switch (t) {
    case 'holiday': return 'violet'
    case 'event':   return 'orange'
    case 'ops':     return 'teal'
    case 'custom':  return 'default'
  }
}

function humanRange(startIso: string, endIso: string): number {
  const start = new Date(startIso + 'T00:00:00').getTime()
  const end = new Date(endIso + 'T00:00:00').getTime()
  return Math.round((end - start) / 86_400_000) + 1
}

function formatDateShort(startIso: string, endIso: string): string {
  const fmt = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleString('en-US', { month: 'short', day: 'numeric' })
  if (!endIso || endIso === startIso) return fmt(startIso)
  return `${fmt(startIso)} – ${fmt(endIso)}`
}

function BlackoutDatesCard() {
  const { blackouts } = useProductState()
  const [modalOpen, setModalOpen] = useState(false)

  const totalClosedDays = useMemo(() => {
    return blackouts.reduce((sum, b) => {
      if (!b.start) return sum
      if (!b.end || b.end === b.start) return sum + 1
      return sum + humanRange(b.start, b.end)
    }, 0)
  }, [blackouts])

  return (
    <SectionCard
      title="Blackout Dates"
      action={
        <Button variant="outline" size="sm" onClick={() => setModalOpen(true)} leftIcon={<PlusIcon className="w-3.5 h-3.5" />}>Add dates</Button>
      }
    >
      <p className="typo-body-sm text-vintiga-slate-500">{blackouts.length} entries · closed even when the weekly schedule allows</p>

      {blackouts.length === 0 ? (
        <p className="typo-body-sm text-vintiga-slate-400 py-vintiga-md">No blackouts yet. Click "Add dates" to block out a holiday or event.</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Reason</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader className="w-12" />
            </TableRow>
          </TableHead>
          <TableBody>
            {blackouts.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-vintiga-slate-900">{b.reason}</span>
                    <span className="typo-caption text-vintiga-slate-500">
                      {b.end && b.end !== b.start ? `${humanRange(b.start, b.end)} days` : '1 day'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Tag variant="filled" tone={toneFor(b.type)}>{TYPE_LABEL[b.type]}</Tag>
                </TableCell>
                <TableCell className="text-vintiga-slate-700">{formatDateShort(b.start, b.end)}</TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => productActions.removeBlackout(b.id)}
                    aria-label="Remove blackout"
                    className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-100 transition-colors cursor-pointer bg-transparent border border-transparent"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="typo-caption text-vintiga-slate-500">{totalClosedDays} closed days total</span>
        <button type="button" className="typo-caption font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 transition-colors cursor-pointer bg-transparent border-none">
          Export to .ics
        </button>
      </div>

      <AddBlackoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(b) => { productActions.addBlackout(b); setModalOpen(false) }}
      />
    </SectionCard>
  )
}

function AddBlackoutModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (b: Blackout) => void }) {
  const [reason, setReason] = useState('')
  const [type, setType] = useState<BlackoutType>('custom')
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10))
  const [end, setEnd] = useState('')

  const reset = () => {
    setReason('')
    setType('custom')
    setStart(new Date().toISOString().slice(0, 10))
    setEnd('')
  }

  const handleClose = () => { reset(); onClose() }
  const handleSave = () => {
    onSave({ id: blackoutUid(), reason: reason || TYPE_LABEL[type], type, start, end: end && end !== start ? end : '' })
    reset()
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader title="Add blackout date" description="Block out a specific date or range — overrides the weekly schedule." onClose={handleClose} />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <label className="flex flex-col gap-1.5">
            <span className="typo-body-sm font-medium text-vintiga-slate-700">Reason</span>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Memorial Day, Private event"
              className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="typo-body-sm font-medium text-vintiga-slate-700">Type</span>
            <div className="grid grid-cols-2 gap-2">
              {(['holiday', 'event', 'ops', 'custom'] as BlackoutType[]).map((t) => (
                <Radio key={t} checked={type === t} onChange={() => setType(t)} label={TYPE_LABEL[t]} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-vintiga-md">
            <label className="flex flex-col gap-1.5">
              <span className="typo-body-sm font-medium text-vintiga-slate-700">Start date</span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="typo-body-sm font-medium text-vintiga-slate-700">End date <span className="typo-caption text-vintiga-slate-400 font-normal">(optional)</span></span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                min={start}
                className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
              />
            </label>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!start}>Add blackout</Button>
      </ModalFooter>
    </Modal>
  )
}

export function TimeSlotsScreen() {
  return (
    <ProductLayout activeTab="timeslots">
      <SectionCard title="Booking settings">
        <p className="typo-body-sm text-vintiga-slate-500">
          These apply to every time slot below. Duration sets how long a booking runs; the booking interval sets how often a start time can be reserved.
        </p>
        <BookingSettings />
      </SectionCard>

      <SectionCard title="Weekly schedule">
        <p className="typo-body-sm text-vintiga-slate-500">
          Set the operating hours and tap “Generate slots” to fill in start times at your booking interval — then tweak, remove, or hide individual slots from the website.
        </p>
        <ReservationTimeSlots />
      </SectionCard>

      <BlackoutDatesCard />
    </ProductLayout>
  )
}
