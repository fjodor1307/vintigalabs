import { useMemo, useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput, InputWithAdornment } from './ProductLayout'
import { Checkbox } from '@ds/shared/Checkbox'
import { Radio } from '@ds/shared/Radio'
import { Button } from '@ds/shared/Button'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Tag } from '@ds/shared/Tag'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@ds/shared/Table'
import { useActiveSeason, useProductState, productActions, WEEKDAYS, type Blackout, type BlackoutType, type ExperienceSeason, type TimeSlot, type Weekday } from './productStore'
import { useGlobalBlackouts, globalBlackoutsActions, type GlobalBlackout } from '../_shared/globalBlackoutsStore'
import { useStoreSeasons, type StoreSeason } from '../_shared/storeSeasonsStore'
import { Switch } from '@ds/shared/Switch'
import { PlusIcon, TrashIcon, SettingsIcon } from '@ds/icons/Icons'

type Period = 'AM' | 'PM'

const TYPE_LABEL: Record<BlackoutType, string> = {
  holiday: 'Holiday',
  event:   'Event',
  ops:     'Ops',
  other:   'Other',
}

type BlackoutWindow = 'upcoming' | 'past'

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

function BookingSettings({ season }: { season: ExperienceSeason }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Duration" required helper="Total length of a single booking.">
          <InputWithAdornment
            adornment="min"
            placeholder="e.g. 30"
            value={season.durationMinutes}
            onChange={(e) => productActions.setSeasonField('durationMinutes', e.target.value)}
          />
        </Field>
        <Field label="Booking interval" helper="How often a start time can be reserved.">
          <select
            value={season.bookingInterval}
            onChange={(e) => productActions.setBookingInterval(Number(e.target.value))}
            className="h-10 w-full px-3 pr-8 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors cursor-pointer"
          >
            {INTERVAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Min guests per time slot" helper="Smallest party size that can book a slot.">
          <TextInput type="number" min={0} placeholder="e.g. 1" value={season.minGuestsPerSlot} onChange={(e) => productActions.setSeasonField('minGuestsPerSlot', e.target.value)} />
        </Field>
        <Field label="Max guests per time slot" helper="Total shared capacity at one slot.">
          <TextInput type="number" min={0} placeholder="e.g. 8" value={season.maxGuestsPerSlot} onChange={(e) => productActions.setSeasonField('maxGuestsPerSlot', e.target.value)} />
        </Field>
      </div>
    </div>
  )
}

// ─── Weekly time slots ────────────────────────────────────────────────────────

const TIME_INPUT = 'h-9 w-24 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 text-center tabular-nums focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors'
const PERIOD_SELECT = 'h-9 px-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors cursor-pointer'

function DaySchedule({ day, season }: { day: Weekday; season: ExperienceSeason }) {
  const { timeSlotsByDay, bookingInterval, blackouts } = season
  const globalBlackouts = useGlobalBlackouts()
  const slots = timeSlotsByDay[day]
  // Operating window used by "Generate slots" — local to the editor.
  const [open, setOpen] = useState<{ time: string; period: Period }>({ time: '9:00', period: 'AM' })
  const [close, setClose] = useState<{ time: string; period: Period }>({ time: '5:00', period: 'PM' })

  // Actual calendar date for this weekday in the current Mon-anchored week,
  // formatted "May 25". Pinned next to the day name so the operator knows
  // which specific date the pill / schedule lines up against.
  const targetDate = dateForDayInCurrentWeek(day)
  const dateLabel = targetDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })

  // Current-week closure indicator — scans both per-experience and global
  // blackouts. The pill shows the source ("Global" / "This experience") so
  // the operator knows where the entry lives.
  const thisWeekHit = findCurrentWeekClosure(day, blackouts, globalBlackouts)

  return (
    <div className={[
      'border rounded-vintiga-lg bg-vintiga-white px-4 py-3 flex flex-col gap-3',
      thisWeekHit ? 'border-vintiga-amber-200 bg-vintiga-amber-50/30' : 'border-vintiga-slate-200',
    ].join(' ')}>
      <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
        <div className="flex items-center gap-vintiga-sm flex-wrap">
          <span className="typo-body-sm font-semibold text-vintiga-slate-900">{day}</span>
          <span className="typo-caption text-vintiga-slate-500 tabular-nums">{dateLabel}</span>
          {thisWeekHit && (
            <Tag variant="filled" tone={toneFor(thisWeekHit.type)} size="sm">
              {thisWeekHit.scope === 'global' ? 'Global · ' : 'This experience · '}
              {thisWeekHit.reason}
            </Tag>
          )}
        </div>
        <div className="flex items-center gap-vintiga-sm">
          {slots.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<TrashIcon className="w-3.5 h-3.5" />}
              onClick={() => {
                if (window.confirm(`Delete every slot on ${day}? You can regenerate from operating hours.`)) {
                  productActions.setTimeSlots(day, [])
                }
              }}
            >
              Delete all
            </Button>
          )}
          <button
            type="button"
            onClick={() => productActions.addTimeSlot(day)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add slot
          </button>
        </div>
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

function ReservationTimeSlots({ season }: { season: ExperienceSeason }) {
  return (
    <div className="flex flex-col gap-3">
      {WEEKDAYS.map((day) => <DaySchedule key={day} day={day} season={season} />)}
    </div>
  )
}

/**
 * Find a blackout (if any) covering `day` in the **current calendar week**
 * (Mon-anchored). Scans both per-experience and global lists; returns a
 * normalised row tagged with its scope so the pill can call out the source.
 */
interface DayClosure {
  reason: string
  type: BlackoutType
  scope: 'experience' | 'global'
}
function findCurrentWeekClosure(
  day: Weekday,
  perExperience: Blackout[],
  globals: GlobalBlackout[],
): DayClosure | null {
  const targetISO = toLocalISODate(dateForDayInCurrentWeek(day))
  const covers = (b: { start: string; end: string }) => {
    const end = b.end || b.start
    return b.start <= targetISO && targetISO <= end
  }
  const ownHit = perExperience.find(covers)
  if (ownHit) return { reason: ownHit.reason, type: ownHit.type, scope: 'experience' }
  const globalHit = globals.find(covers)
  if (globalHit) return { reason: globalHit.reason, type: globalHit.type, scope: 'global' }
  return null
}

/** yyyy-mm-dd in the *local* timezone. `toISOString()` uses UTC and can
 *  shift the date by a day in non-UTC zones, which mis-aligns "today's
 *  weekday" against blackout ISO strings (which are local-date semantics). */
function toLocalISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Map a weekday name to its date inside the *current* Mon-anchored week. */
function dateForDayInCurrentWeek(day: Weekday): Date {
  const order: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // JS Sunday=0, Monday=1, … Saturday=6. Convert to Mon=0…Sun=6.
  const jsDay = today.getDay()
  const isoTodayIdx = jsDay === 0 ? 6 : jsDay - 1
  const targetIdx = order.indexOf(day)
  const monday = new Date(today)
  monday.setDate(today.getDate() - isoTodayIdx)
  monday.setDate(monday.getDate() + targetIdx)
  return monday
}

// ─── Blackout dates — modal + table (ported from the matrix prototype) ────────

function toneFor(t: BlackoutType): 'violet' | 'orange' | 'teal' | 'default' {
  switch (t) {
    case 'holiday': return 'violet'
    case 'event':   return 'orange'
    case 'ops':     return 'teal'
    case 'other':   return 'default'
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

/** Merged-list row — flatten Blackout / GlobalBlackout into one shape so the
 *  table can render both with a Scope column and a per-source delete handler. */
interface MergedBlackout {
  id: string
  reason: string
  type: BlackoutType
  start: string
  end: string
  scope: 'experience' | 'global'
}

function BlackoutDatesCard({ season }: { season: ExperienceSeason }) {
  const { blackouts } = season
  const globalBlackouts = useGlobalBlackouts()
  const [modalOpen, setModalOpen] = useState(false)
  const [windowTab, setWindowTab] = useState<BlackoutWindow>('upcoming')

  const todayISO = new Date().toISOString().slice(0, 10)

  const merged: MergedBlackout[] = useMemo(() => [
    ...blackouts.map((b): MergedBlackout => ({ ...b, scope: 'experience' })),
    ...globalBlackouts.map((b): MergedBlackout => ({ ...b, scope: 'global' })),
  ], [blackouts, globalBlackouts])

  const { upcoming, past } = useMemo(() => {
    const upcoming: MergedBlackout[] = []
    const past: MergedBlackout[] = []
    for (const b of merged) {
      const lastDay = b.end || b.start
      if (lastDay < todayISO) past.push(b)
      else upcoming.push(b)
    }
    upcoming.sort((a, b) => a.start.localeCompare(b.start))
    past.sort((a, b) => b.start.localeCompare(a.start))
    return { upcoming, past }
  }, [merged, todayISO])

  const visible = windowTab === 'upcoming' ? upcoming : past
  const totalClosedDays = useMemo(() => {
    return upcoming.reduce((sum, b) => {
      if (!b.start) return sum
      if (!b.end || b.end === b.start) return sum + 1
      return sum + humanRange(b.start, b.end)
    }, 0)
  }, [upcoming])

  const handleRemove = (b: MergedBlackout) => {
    if (b.scope === 'global') {
      if (!window.confirm(`"${b.reason}" is a global closure — removing it deletes it from every experience. Continue?`)) return
      globalBlackoutsActions.remove(b.id)
    } else {
      productActions.removeBlackout(b.id)
    }
  }

  return (
    <SectionCard
      title="Blackout Dates"
      action={
        <Button variant="outline" size="sm" onClick={() => setModalOpen(true)} leftIcon={<PlusIcon className="w-3.5 h-3.5" />}>Add dates</Button>
      }
    >
      <p className="typo-body-sm text-vintiga-slate-500">
        {upcoming.length} upcoming · {upcoming.filter((b) => b.scope === 'global').length} global, {upcoming.filter((b) => b.scope === 'experience').length} this experience
      </p>

      <SegmentedControl<BlackoutWindow>
        className="self-start"
        size="md"
        aria-label="Blackout window"
        value={windowTab}
        onChange={setWindowTab}
        options={[
          { value: 'upcoming', label: <WindowLabel label="Upcoming" count={upcoming.length} active={windowTab === 'upcoming'} /> },
          { value: 'past',     label: <WindowLabel label="Past"     count={past.length}     active={windowTab === 'past'} /> },
        ]}
      />

      {visible.length === 0 ? (
        <p className="typo-body-sm text-vintiga-slate-400 py-vintiga-md">
          {windowTab === 'upcoming'
            ? 'No upcoming blackouts. Click "Add dates" to block out a holiday or event.'
            : 'No past blackouts on record.'}
        </p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Reason</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Scope</TableHeader>
              <TableHeader className="w-12" />
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((b) => (
              <TableRow key={`${b.scope}-${b.id}`}>
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
                <TableCell>
                  <ScopeTag scope={b.scope} />
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => handleRemove(b)}
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

      <span className="typo-caption text-vintiga-slate-500 pt-1">{totalClosedDays} upcoming closed days</span>

      <AddBlackoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload, isGlobal) => {
          if (isGlobal) {
            globalBlackoutsActions.add(payload)
          } else {
            productActions.addBlackout({ ...payload, id: blackoutUid() })
          }
          setModalOpen(false)
        }}
      />
    </SectionCard>
  )
}

// Color-coded scope chip — sky/blue for global (tenant-wide), neutral for
// experience-local. Using outline + neutral-dark variants to differentiate
// the scope tag from the type tag (Holiday / Event / Ops / Other) without
// clashing on tone.
function ScopeTag({ scope }: { scope: 'experience' | 'global' }) {
  if (scope === 'global') {
    return <Tag variant="filled" tone="info" size="md">Global</Tag>
  }
  return <Tag variant="outline" size="md">This experience</Tag>
}

// Segment label with a trailing numeric count, muted relative to the label
// text. Same shape as the rest of the DS (e.g. tab counts on inboxes).
function WindowLabel({ label, count, active }: { label: string; count: number; active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <span className={['typo-caption tabular-nums', active ? 'text-vintiga-slate-500' : 'text-vintiga-slate-400'].join(' ')}>{count}</span>
    </span>
  )
}

function AddBlackoutModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  /** Receives a payload + whether this should be saved as a global tenant-wide
   *  closure (true) or kept local to this experience (false). */
  onSave: (payload: { reason: string; type: BlackoutType; start: string; end: string }, isGlobal: boolean) => void
}) {
  const [reason, setReason] = useState('')
  const [type, setType] = useState<BlackoutType>('other')
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10))
  const [end, setEnd] = useState('')
  const [isGlobal, setIsGlobal] = useState(false)

  const reset = () => {
    setReason('')
    setType('other')
    setStart(new Date().toISOString().slice(0, 10))
    setEnd('')
    setIsGlobal(false)
  }

  const handleClose = () => { reset(); onClose() }
  const handleSave = () => {
    onSave(
      { reason: reason || TYPE_LABEL[type], type, start, end: end && end !== start ? end : '' },
      isGlobal,
    )
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
              {(['holiday', 'event', 'ops', 'other'] as BlackoutType[]).map((t) => (
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

          <div className="flex items-start justify-between gap-vintiga-md pt-vintiga-sm border-t border-vintiga-slate-100">
            <div className="flex flex-col">
              <span className="typo-body-sm font-medium text-vintiga-slate-900">Apply to all experiences</span>
              <span className="typo-caption text-vintiga-slate-500">Saves this as a tenant-wide closure (e.g. national holiday). Off keeps it local to this experience only.</span>
            </div>
            <Switch checked={isGlobal} onChange={setIsGlobal} />
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
  const { seasons, activeSeasonId, name: productName, editingId } = useProductState()
  const storeSeasons = useStoreSeasons()
  const activeSeason = useActiveSeason()
  const [addOpen, setAddOpen] = useState(false)

  function resolveSeasonName(season: ExperienceSeason): string {
    if (season.source === 'custom') return season.customName ?? 'Custom season'
    const store = storeSeasons.find((s) => s.id === season.storeSeasonId)
    return store?.name ?? 'Unknown season'
  }

  return (
    <ProductLayout activeTab="timeslots">
      <SeasonsStrip
        seasons={seasons}
        activeSeasonId={activeSeasonId}
        resolveName={resolveSeasonName}
        onAdd={() => setAddOpen(true)}
        launcherProductId={editingId}
        launcherProductName={productName}
      />

      {activeSeason ? (
        <>
          <SectionCard
            title="Booking settings"
            action={
              <SeasonHeaderActions
                season={activeSeason}
                onRemove={() => {
                  if (window.confirm(`Remove "${resolveSeasonName(activeSeason)}" from this experience? Slots and blackouts for this season will be deleted.`)) {
                    productActions.removeSeason(activeSeason.id)
                  }
                }}
              />
            }
          >
            <p className="typo-body-sm text-vintiga-slate-500">
              Duration sets how long a booking runs; the booking interval sets how often a start time can be reserved. Each season can have its own values.
            </p>
            <BookingSettings season={activeSeason} />
          </SectionCard>

          <SectionCard title="Weekly schedule">
            <p className="typo-body-sm text-vintiga-slate-500">
              Set the operating hours and tap “Generate slots” to fill in start times at your booking interval — then tweak, remove, or hide individual slots from the website.
            </p>
            <ReservationTimeSlots season={activeSeason} />
          </SectionCard>

          <BlackoutDatesCard season={activeSeason} />
        </>
      ) : (
        <SectionCard title="No seasons yet">
          <p className="typo-body-sm text-vintiga-slate-500">
            Add an availability season to start setting hours and time slots for this experience.
          </p>
          <Button onClick={() => setAddOpen(true)} leftIcon={<PlusIcon className="w-3.5 h-3.5" />}>
            Add season
          </Button>
        </SectionCard>
      )}

      <AddSeasonModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        seasons={seasons}
        storeSeasons={storeSeasons}
      />
    </ProductLayout>
  )
}

// ─── Seasons strip — tab list of this experience's seasons ──────────────────

function SeasonsStrip({
  seasons,
  activeSeasonId,
  resolveName,
  onAdd,
  launcherProductId,
  launcherProductName,
}: {
  seasons: ExperienceSeason[]
  activeSeasonId: string
  resolveName: (s: ExperienceSeason) => string
  onAdd: () => void
  /** When set, the gear-icon shortcut on Shared pills carries these as a
   *  launcher context so Settings can render a "back to this product"
   *  breadcrumb trail. */
  launcherProductId: string | null
  launcherProductName: string
}) {
  if (seasons.length === 0) return null
  return (
    <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
      <div className="flex items-center gap-vintiga-sm flex-wrap">
        {seasons.map((s) => {
          const active = s.id === activeSeasonId
          // `<button>` can't nest a `<button>`, so the gear is a sibling
          // inside a shared border. The outer span owns the rounded chrome;
          // the pill button + gear button divide the click surface.
          return (
            <span
              key={s.id}
              className={[
                'inline-flex items-stretch rounded-vintiga-md border transition-colors overflow-hidden',
                active
                  ? 'bg-vintiga-white border-vintiga-slate-300 shadow-sm'
                  : 'bg-vintiga-slate-50 border-vintiga-slate-200 hover:border-vintiga-slate-300',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => productActions.setActiveSeasonId(s.id)}
                aria-pressed={active}
                className={[
                  'inline-flex items-center gap-vintiga-sm px-vintiga-md py-1.5 transition-colors cursor-pointer bg-transparent border-none',
                  active
                    ? 'text-vintiga-slate-900'
                    : 'text-vintiga-slate-600 hover:text-vintiga-slate-900',
                ].join(' ')}
              >
                <span className="typo-body-sm font-semibold">{resolveName(s)}</span>
                <Tag
                  variant="filled"
                  tone={s.source === 'store' ? 'info' : 'default'}
                  size="sm"
                >
                  {s.source === 'store' ? 'Shared' : 'Custom'}
                </Tag>
              </button>
              {/* Shortcut to Settings → Seasons with this season's edit
                  modal pre-opened. Only shown on Shared (store) seasons —
                  Custom seasons live on this experience, no Settings to
                  jump to. */}
              {s.source === 'store' && s.storeSeasonId && (
                <a
                  href={
                    launcherProductId
                      ? `#/web/settings?tab=seasons&edit=${s.storeSeasonId}&from=experience&productId=${encodeURIComponent(launcherProductId)}&productName=${encodeURIComponent(launcherProductName)}`
                      : `#/web/settings?tab=seasons&edit=${s.storeSeasonId}`
                  }
                  aria-label={`Edit ${resolveName(s)} in Settings`}
                  title="Edit dates in Settings"
                  className="inline-flex items-center justify-center px-vintiga-sm border-l border-vintiga-slate-200 text-vintiga-slate-400 hover:text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors cursor-pointer"
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </span>
          )
        })}
      </div>
      <Button variant="outline" size="sm" leftIcon={<PlusIcon className="w-3.5 h-3.5" />} onClick={onAdd}>
        Add season
      </Button>
    </div>
  )
}

// ─── Season header actions (next to the section card titles) ────────────────

function SeasonHeaderActions({
  season,
  onRemove,
}: {
  season: ExperienceSeason
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-vintiga-sm">
      <span className="typo-caption text-vintiga-slate-500 tabular-nums">
        {formatDateShort(season.start, season.end)}
      </span>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<TrashIcon className="w-3.5 h-3.5" />}
        onClick={onRemove}
      >
        Remove season
      </Button>
    </div>
  )
}

// ─── Add Season modal ────────────────────────────────────────────────────────

function AddSeasonModal({
  open,
  onClose,
  seasons,
  storeSeasons,
}: {
  open: boolean
  onClose: () => void
  seasons: ExperienceSeason[]
  storeSeasons: StoreSeason[]
}) {
  const [mode, setMode] = useState<'store' | 'custom'>('store')
  const [storeId, setStoreId] = useState<string>('')
  const [customName, setCustomName] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  // Filter the store-season dropdown to ones not already used here.
  const availableStoreSeasons = useMemo(
    () => storeSeasons.filter((ss) => !seasons.some((es) => es.storeSeasonId === ss.id)),
    [storeSeasons, seasons],
  )

  function reset() {
    setMode(availableStoreSeasons.length > 0 ? 'store' : 'custom')
    setStoreId(availableStoreSeasons[0]?.id ?? '')
    setCustomName('')
    setStart('')
    setEnd('')
  }

  // Re-seed when modal opens / available list changes.
  useMemo(() => {
    if (open) reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function handleClose() { reset(); onClose() }

  // Resolve the candidate range based on selected mode.
  const candidateStart = mode === 'store'
    ? (storeSeasons.find((s) => s.id === storeId)?.start ?? '')
    : start
  const candidateEnd = mode === 'store'
    ? (storeSeasons.find((s) => s.id === storeId)?.end ?? '')
    : end

  // Per-experience overlap detection — store-level overlap is fine, but two
  // seasons covering the same day on ONE experience is the spec's "critical
  // constraint" (booking engine wouldn't know whose schedule wins).
  const overlap = useMemo(() => {
    if (!candidateStart || !candidateEnd) return null
    return seasons.find((s) => {
      const sEnd = s.end || s.start
      const cEnd = candidateEnd || candidateStart
      return s.start <= cEnd && candidateStart <= sEnd
    }) ?? null
  }, [seasons, candidateStart, candidateEnd])

  function resolveExistingName(s: ExperienceSeason): string {
    if (s.source === 'custom') return s.customName ?? 'Custom season'
    return storeSeasons.find((x) => x.id === s.storeSeasonId)?.name ?? 'Unknown season'
  }

  const canSubmit =
    !overlap &&
    (mode === 'store'
      ? !!storeId
      : customName.trim().length > 0 && start.length > 0 && end.length > 0 && start <= end)

  function handleSubmit() {
    const id = `es-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const blank: Pick<ExperienceSeason, 'durationMinutes' | 'bookingInterval' | 'minGuestsPerSlot' | 'maxGuestsPerSlot' | 'timeSlotsByDay' | 'blackouts' | 'excludedGlobalBlackoutIds'> = {
      durationMinutes: '',
      bookingInterval: 30,
      minGuestsPerSlot: '',
      maxGuestsPerSlot: '',
      timeSlotsByDay: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] },
      blackouts: [],
      excludedGlobalBlackoutIds: [],
    }
    if (mode === 'store') {
      const store = storeSeasons.find((s) => s.id === storeId)
      if (!store) return
      productActions.addSeason({
        id,
        source: 'store',
        storeSeasonId: store.id,
        start: store.start,
        end:   store.end,
        ...blank,
      })
    } else {
      productActions.addSeason({
        id,
        source: 'custom',
        customName: customName.trim(),
        start,
        end,
        ...blank,
      })
    }
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader
        title="Add availability season"
        description="Pull a season from the store-wide list or define a one-off range for this experience only."
        onClose={handleClose}
      />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <div className="flex flex-col gap-vintiga-sm">
            <Radio
              checked={mode === 'store'}
              onChange={() => setMode('store')}
              disabled={availableStoreSeasons.length === 0}
              label={availableStoreSeasons.length === 0
                ? 'Use existing store season (all already used)'
                : 'Use existing store season'}
            />
            <Radio
              checked={mode === 'custom'}
              onChange={() => setMode('custom')}
              label="Create experience-only season"
            />
          </div>

          {mode === 'store' && availableStoreSeasons.length > 0 && (
            <Field label="Store season" required>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="h-10 w-full px-3 pr-8 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors cursor-pointer"
              >
                <option value="">Select a season…</option>
                {availableStoreSeasons.map((ss) => (
                  <option key={ss.id} value={ss.id}>
                    {ss.name} — {formatDateShort(ss.start, ss.end)}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {mode === 'custom' && (
            <>
              <Field label="Season name" required>
                <TextInput
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Annual Availability, VIP Winter Schedule"
                />
              </Field>
              <div className="grid grid-cols-2 gap-vintiga-md">
                <Field label="Start" required>
                  <TextInput type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                </Field>
                <Field label="End" required>
                  <TextInput type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} />
                </Field>
              </div>
            </>
          )}

          {overlap && (
            <div className="border border-vintiga-red-200 bg-vintiga-red-50 rounded-vintiga-md p-vintiga-md">
              <p className="typo-body-sm font-semibold text-vintiga-red-700">
                This season overlaps an existing availability season for this experience.
              </p>
              <p className="typo-body-sm text-vintiga-red-700 mt-1">
                Existing: <span className="font-semibold">{resolveExistingName(overlap)}</span> — {formatDateShort(overlap.start, overlap.end)}
              </p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>Add season</Button>
      </ModalFooter>
    </Modal>
  )
}
