import { useMemo, useState } from 'react'
import { ExperienceShell } from '../_shared/ExperienceShell'
import { SectionCard } from '@ds/shared/SectionCard'
import { Button } from '@ds/shared/Button'
import { Switch } from '@ds/shared/Switch'
import { Tag } from '@ds/shared/Tag'
import { PlusIcon, TrashIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@ds/icons/Icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type WeekdayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'
const WEEKDAYS: WeekdayKey[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const WEEKDAY_SET = new Set<WeekdayKey>(['MON', 'TUE', 'WED', 'THU', 'FRI'])
const WEEKEND_SET = new Set<WeekdayKey>(['SAT', 'SUN'])

interface TimeSlot {
  id: string
  /** "5:00" — 12-hour clock, paired with `period`. */
  startTime: string
  period: 'AM' | 'PM'
  online: boolean
  /** Which weekdays this slot runs on. */
  days: Set<WeekdayKey>
}

type BlackoutType = 'holiday' | 'event' | 'ops' | 'custom'

interface Blackout {
  id: string
  /** Display reason. */
  reason: string
  type: BlackoutType
  /** ISO yyyy-mm-dd start. */
  start: string
  /** ISO yyyy-mm-dd end. Empty = single day. */
  end: string
}

const START_TIME_OPTIONS = [
  '12:00', '12:30',
  '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30',
  '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
]
const PERIOD_OPTIONS = ['AM', 'PM']

const TYPE_COLOR: Record<BlackoutType, string> = {
  holiday: 'bg-vintiga-indigo-500',
  event:   'bg-vintiga-amber-500',
  ops:     'bg-vintiga-teal-500',
  custom:  'bg-vintiga-slate-500',
}
const TYPE_LABEL: Record<BlackoutType, string> = {
  holiday: 'Holiday',
  event:   'Event',
  ops:     'Ops',
  custom:  'Custom',
}

function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

// ─── Seed data ────────────────────────────────────────────────────────────────

function initialSlots(): TimeSlot[] {
  return [
    { id: uid('s'), startTime: '5:00',  period: 'PM', online: true,  days: new Set(['SAT']) },
    { id: uid('s'), startTime: '6:00',  period: 'PM', online: true,  days: new Set(['FRI']) },
    { id: uid('s'), startTime: '7:00',  period: 'PM', online: true,  days: new Set(['THU', 'SAT']) },
    { id: uid('s'), startTime: '8:00',  period: 'PM', online: true,  days: new Set(['FRI']) },
    { id: uid('s'), startTime: '9:00',  period: 'PM', online: true,  days: new Set(['MON', 'SAT']) },
    { id: uid('s'), startTime: '10:00', period: 'PM', online: false, days: new Set(['MON', 'FRI']) },
    { id: uid('s'), startTime: '7:00',  period: 'PM', online: true,  days: new Set(['MON']) },
  ]
}

function initialBlackouts(): Blackout[] {
  return [
    { id: uid('b'), reason: 'Memorial Day',     type: 'holiday', start: '2026-05-26', end: '' },
    { id: uid('b'), reason: 'Private event',    type: 'event',   start: '2026-05-27', end: '2026-05-28' },
    { id: uid('b'), reason: 'Staff training',   type: 'ops',     start: '2026-06-04', end: '' },
    { id: uid('b'), reason: 'Juneteenth',       type: 'holiday', start: '2026-06-19', end: '' },
    { id: uid('b'), reason: 'Independence Day', type: 'holiday', start: '2026-07-04', end: '' },
    { id: uid('b'), reason: 'Custom date',      type: 'custom',  start: '2026-06-20', end: '' },
  ]
}

// ─── Building blocks ──────────────────────────────────────────────────────────

function SmallSelect({ value, onChange, options, ariaLabel }: { value: string; onChange: (v: string) => void; options: string[]; ariaLabel: string }) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full px-2 pr-6 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors cursor-pointer appearance-none bg-no-repeat bg-[length:12px] bg-[right_6px_center]"
      style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")" }}
    >
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  )
}

function DayToggle({ active, onClick, ariaLabel }: { active: boolean; onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={[
        'w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md transition-colors cursor-pointer',
        active
          ? 'bg-vintiga-indigo-500 text-vintiga-white border border-transparent hover:bg-vintiga-indigo-600'
          : 'bg-vintiga-white text-vintiga-slate-300 border border-vintiga-slate-200 hover:bg-vintiga-slate-50',
      ].join(' ')}
    >
      {active ? <CheckIcon className="w-3.5 h-3.5" /> : <span aria-hidden="true" className="typo-caption">—</span>}
    </button>
  )
}

// ─── Reservation Time Slots card ──────────────────────────────────────────────

function ReservationTimeSlotsCard() {
  const [slots, setSlots] = useState<TimeSlot[]>(initialSlots)

  const counts: Record<WeekdayKey, number> = useMemo(() => {
    const acc: Record<WeekdayKey, number> = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 }
    slots.forEach((s) => {
      if (!s.online) return
      s.days.forEach((d) => { acc[d] += 1 })
    })
    return acc
  }, [slots])

  const totalBookable = useMemo(() => slots.filter((s) => s.online).reduce((sum, s) => sum + s.days.size, 0), [slots])

  const update = (id: string, patch: Partial<TimeSlot>) =>
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  const remove = (id: string) => setSlots((prev) => prev.filter((s) => s.id !== id))
  const add = () => setSlots((prev) => [...prev, { id: uid('s'), startTime: '5:00', period: 'PM', online: true, days: new Set() }])

  const toggleDay = (id: string, day: WeekdayKey) => {
    const slot = slots.find((s) => s.id === id)
    if (!slot) return
    const next = new Set(slot.days)
    if (next.has(day)) next.delete(day); else next.add(day)
    update(id, { days: next })
  }

  return (
    <SectionCard title="Reservation Time Slots">
      <p className="typo-body-sm text-vintiga-slate-500">{slots.length} times · {totalBookable} bookable slots per week</p>
      {/* Quick-apply chips header */}
      <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
        <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wider">Reservation grid</span>
        <div className="flex items-center gap-2">
          <span className="typo-body-sm text-vintiga-slate-500">Apply to:</span>
          <QuickApplyChips onApply={(scope) => {
            const fillSet: Set<WeekdayKey> =
              scope === 'weekdays' ? new Set(WEEKDAY_SET) :
              scope === 'weekends' ? new Set(WEEKEND_SET) :
              new Set(WEEKDAYS)
            // No selected slot context — apply to ALL slots' day sets (union).
            setSlots((prev) => prev.map((s) => ({ ...s, days: new Set([...s.days, ...fillSet]) })))
          }} />
        </div>
      </div>

      {/* Grid — horizontally scrollable on narrow viewports */}
      <div className="-mx-vintiga-md overflow-x-auto">
        <div className="min-w-[640px] px-vintiga-md">
          {/* Header row */}
          <div className="grid grid-cols-[96px_68px_56px_repeat(7,32px)_32px] items-end gap-2 px-2 pb-2 border-b border-vintiga-slate-200">
            <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wider">Start time</span>
            <span />
            <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wider">Online</span>
            {WEEKDAYS.map((d) => (
              <div key={d} className="flex flex-col items-center leading-tight">
                <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase">{d}</span>
                <span className="typo-caption text-vintiga-slate-400 tabular-nums">{counts[d]}</span>
              </div>
            ))}
            <span />
          </div>

          {/* Slot rows */}
          <div className="flex flex-col">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="grid grid-cols-[96px_68px_56px_repeat(7,32px)_32px] items-center gap-2 px-2 py-1.5 border-b border-vintiga-slate-100 last:border-b-0 hover:bg-vintiga-slate-50/40 transition-colors"
              >
                <SmallSelect
                  ariaLabel="Start time"
                  value={slot.startTime}
                  onChange={(v) => update(slot.id, { startTime: v })}
                  options={START_TIME_OPTIONS}
                />
                <SmallSelect
                  ariaLabel="AM or PM"
                  value={slot.period}
                  onChange={(v) => update(slot.id, { period: v as 'AM' | 'PM' })}
                  options={PERIOD_OPTIONS}
                />
                <div className="flex items-center">
                  <Switch checked={slot.online} onChange={(next) => update(slot.id, { online: next })} />
                </div>
                {WEEKDAYS.map((d) => (
                  <DayToggle
                    key={d}
                    active={slot.days.has(d)}
                    onClick={() => toggleDay(slot.id, d)}
                    ariaLabel={`Toggle ${d} for ${slot.startTime} ${slot.period}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => remove(slot.id)}
                  aria-label="Remove time slot"
                  className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-50 transition-colors cursor-pointer bg-transparent border border-transparent"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add row */}
          <button
            type="button"
            onClick={add}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-vintiga-md border border-dashed border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 hover:border-vintiga-slate-300 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add time slot
          </button>
        </div>
      </div>

    </SectionCard>
  )
}

function QuickApplyChips({ onApply }: { onApply: (scope: 'weekdays' | 'weekends' | 'all') => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onApply('weekdays')}
        className="inline-flex items-center px-3 py-1.5 rounded-vintiga-button border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-medium text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
      >
        Weekdays
      </button>
      <button
        type="button"
        onClick={() => onApply('weekends')}
        className="inline-flex items-center px-3 py-1.5 rounded-vintiga-button border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-medium text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
      >
        Weekends
      </button>
      <button
        type="button"
        onClick={() => onApply('all')}
        className="inline-flex items-center px-3 py-1.5 rounded-vintiga-button border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-medium text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
      >
        All days
      </button>
    </div>
  )
}

// ─── Blackout Dates card ──────────────────────────────────────────────────────

function pad(n: number): string { return n < 10 ? `0${n}` : `${n}` }
function isoOf(year: number, monthZeroBased: number, day: number): string {
  return `${year}-${pad(monthZeroBased + 1)}-${pad(day)}`
}

function MonthGrid({
  year,
  monthZeroBased,
  closedDates,
  onToggle,
}: {
  year: number
  monthZeroBased: number
  closedDates: Set<string>
  onToggle: (iso: string) => void
}) {
  const monthName = new Date(year, monthZeroBased, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const firstDow = new Date(year, monthZeroBased, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, monthZeroBased + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-center typo-body-sm font-semibold text-vintiga-slate-900">{monthName}</div>
      <div className="grid grid-cols-7 gap-0.5 typo-caption text-vintiga-slate-400 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={`${d}-${i}`} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (d === null) return <span key={`pad-${i}`} className="w-7 h-7" />
          const iso = isoOf(year, monthZeroBased, d)
          const closed = closedDates.has(iso)
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onToggle(iso)}
              aria-pressed={closed}
              className={[
                'w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md typo-caption tabular-nums transition-colors cursor-pointer',
                closed
                  ? 'bg-vintiga-indigo-500 text-vintiga-white border border-transparent hover:bg-vintiga-indigo-600'
                  : 'bg-vintiga-white text-vintiga-slate-700 border border-transparent hover:bg-vintiga-slate-100',
              ].join(' ')}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BlackoutDatesCard() {
  const [blackouts, setBlackouts] = useState<Blackout[]>(initialBlackouts)
  // The calendar pivots on a "current month + next month" view.
  const [pivot, setPivot] = useState(() => {
    const today = new Date(2026, 4, 1) // May 2026 to match the screenshot
    return { year: today.getFullYear(), month: today.getMonth() }
  })

  // Closed days = the union of all single-day blackouts + each multi-day range expanded.
  const closedDates = useMemo(() => {
    const s = new Set<string>()
    blackouts.forEach((b) => {
      if (!b.start) return
      const start = new Date(b.start + 'T00:00:00')
      const end = b.end ? new Date(b.end + 'T00:00:00') : start
      for (let t = start.getTime(); t <= end.getTime(); t += 86_400_000) {
        const d = new Date(t)
        s.add(isoOf(d.getFullYear(), d.getMonth(), d.getDate()))
      }
    })
    return s
  }, [blackouts])

  const totalClosedDays = closedDates.size

  // Toggle a single ISO date: if already covered by a blackout, remove the blackout(s) covering it.
  // If not covered, add a single-day 'custom' blackout for that date.
  const toggleDate = (iso: string) => {
    setBlackouts((prev) => {
      const covering = prev.filter((b) => {
        const start = b.start
        const end = b.end || b.start
        return start && iso >= start && iso <= end
      })
      if (covering.length > 0) return prev.filter((b) => !covering.includes(b))
      return [...prev, { id: uid('b'), reason: 'Custom date', type: 'custom', start: iso, end: '' }]
    })
  }

  const removeBlackout = (id: string) => setBlackouts((prev) => prev.filter((b) => b.id !== id))

  return (
    <SectionCard
      title="Blackout Dates"
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<PlusIcon className="w-3.5 h-3.5" />}>Import holidays</Button>
          <Button size="sm" leftIcon={<PlusIcon className="w-3.5 h-3.5" />}>Add dates</Button>
        </div>
      }
    >
      <p className="typo-body-sm text-vintiga-slate-500">{blackouts.length} entries · closed even when the weekly schedule allows</p>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-vintiga-lg">
        {/* Calendar */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wider">Click a day to toggle</span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setPivot(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 })}
                aria-label="Previous month"
                className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-600 hover:bg-vintiga-slate-50 transition-colors cursor-pointer bg-transparent border border-vintiga-slate-200"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPivot(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 })}
                aria-label="Next month"
                className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-600 hover:bg-vintiga-slate-50 transition-colors cursor-pointer bg-transparent border border-vintiga-slate-200"
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <MonthGrid year={pivot.year} monthZeroBased={pivot.month} closedDates={closedDates} onToggle={toggleDate} />
        </div>

        {/* List */}
        <div className="flex flex-col min-w-0">
          <div className="grid grid-cols-[1fr_80px_110px_24px] items-center gap-3 px-2 pb-2 border-b border-vintiga-slate-200">
            <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wider">Reason</span>
            <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wider">Type</span>
            <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wider">Date</span>
            <span />
          </div>
          {blackouts.length === 0 ? (
            <p className="typo-body-sm text-vintiga-slate-400 px-2 py-3">No blackouts yet.</p>
          ) : blackouts.map((b) => (
            <div key={b.id} className="grid grid-cols-[1fr_80px_110px_24px] items-center gap-3 px-2 py-1.5 border-b border-vintiga-slate-100 last:border-b-0 hover:bg-vintiga-slate-50/40 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_COLOR[b.type]}`} aria-hidden="true" />
                <div className="flex flex-col min-w-0">
                  <span className="typo-body-sm font-medium text-vintiga-slate-900 truncate">{b.reason}</span>
                  <span className="typo-caption text-vintiga-slate-500">
                    {b.end && b.end !== b.start ? `${humanRange(b.start, b.end)} days` : '1 day'}
                  </span>
                </div>
              </div>
              <Tag variant="filled" tone={toneFor(b.type)} size="sm">{TYPE_LABEL[b.type]}</Tag>
              <span className="typo-body-sm text-vintiga-slate-700 truncate">{formatDateShort(b.start, b.end)}</span>
              <button
                type="button"
                onClick={() => removeBlackout(b.id)}
                aria-label="Remove blackout"
                className="w-6 h-6 inline-flex items-center justify-center rounded-full text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-100 transition-colors cursor-pointer bg-transparent border-none"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between px-2 pt-3">
            <span className="typo-caption text-vintiga-slate-500">{totalClosedDays} closed days total</span>
            <button type="button" className="typo-caption font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 transition-colors cursor-pointer bg-transparent border-none">
              Export to .ics
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ─── helpers ──────────────────────────────────────────────────────────────────

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

// ─── Screen ───────────────────────────────────────────────────────────────────

export function EditorScreen() {
  return (
    <ExperienceShell
      title="Reserve Cellar Tasting"
      activeTab="timeslots"
      tabHrefs={{
        general:   '#/web/experience-timeslots-matrix/editor',
        timeslots: '#/web/experience-timeslots-matrix/editor',
        pos:       '#/web/experience-timeslots-matrix/editor',
        website:   '#/web/experience-timeslots-matrix/editor',
      }}
    >
      <p className="typo-body-sm text-vintiga-slate-500 -mt-2">
        Dense grid: every row is a bookable time, every column a weekday. Tap a cell to enable that slot on that day. Blackouts work off a calendar.
      </p>
      <ReservationTimeSlotsCard />
      <BlackoutDatesCard />
    </ExperienceShell>
  )
}
