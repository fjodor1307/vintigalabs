import { useState } from 'react'
import { ExperienceShell } from '../_shared/ExperienceShell'
import { SectionCard } from '@ds/shared/SectionCard'
import { Button } from '@ds/shared/Button'
import { Checkbox } from '@ds/shared/Checkbox'
import { Radio } from '@ds/shared/Radio'
import { PlusIcon, TrashIcon } from '@ds/icons/Icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type Weekday = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
const WEEKDAYS: Weekday[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface TimeRange {
  id: string
  /** "HH:MM" 24-hour. We render in 12-hour with an AM/PM select. */
  startTime: string
  startPeriod: 'AM' | 'PM'
  endTime: string
  endPeriod: 'AM' | 'PM'
}

interface DaySchedule {
  enabled: boolean
  ranges: TimeRange[]
}

interface Override {
  id: string
  /** ISO yyyy-mm-dd */
  date: string
  mode: 'closed' | 'custom'
  startTime: string
  startPeriod: 'AM' | 'PM'
  endTime: string
  endPeriod: 'AM' | 'PM'
}

const MAX_RANGES_PER_DAY = 2

function uid(prefix = 'r'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function defaultRange(): TimeRange {
  return { id: uid(), startTime: '9:00', startPeriod: 'AM', endTime: '5:00', endPeriod: 'PM' }
}

function initialSchedule(): Record<Weekday, DaySchedule> {
  return {
    Sun: { enabled: false, ranges: [] },
    Mon: { enabled: true,  ranges: [defaultRange()] },
    Tue: { enabled: true,  ranges: [defaultRange()] },
    Wed: { enabled: true,  ranges: [defaultRange()] },
    Thu: { enabled: true,  ranges: [defaultRange()] },
    Fri: { enabled: true,  ranges: [defaultRange()] },
    Sat: { enabled: false, ranges: [] },
  }
}

// ─── Building blocks ──────────────────────────────────────────────────────────

function TimeInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      {...props}
      className={[
        'h-9 w-20 px-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white',
        'typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 text-center tabular-nums',
        'focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

function PeriodSelect({ value, onChange, ariaLabel }: { value: 'AM' | 'PM'; onChange: (v: 'AM' | 'PM') => void; ariaLabel: string }) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value as 'AM' | 'PM')}
      className="h-9 px-2 pr-7 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors cursor-pointer appearance-none bg-[length:14px] bg-no-repeat bg-[right_8px_center]"
      style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")" }}
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  )
}

function IconButton({ onClick, ariaLabel, danger, children }: { onClick: () => void; ariaLabel: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        'w-8 h-8 inline-flex items-center justify-center rounded-vintiga-md transition-colors cursor-pointer bg-transparent border border-vintiga-slate-200 hover:bg-vintiga-slate-50',
        danger ? 'text-vintiga-slate-400 hover:text-vintiga-red-600' : 'text-vintiga-slate-600',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// ─── Weekly schedule ──────────────────────────────────────────────────────────

function RangeRow({
  range,
  onChange,
  onRemove,
  isFirstRange,
  canAddRange,
  onAddRange,
}: {
  range: TimeRange
  onChange: (next: TimeRange) => void
  onRemove: () => void
  isFirstRange: boolean
  canAddRange: boolean
  onAddRange: () => void
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <TimeInput
        value={range.startTime}
        placeholder="9:00"
        onChange={(e) => onChange({ ...range, startTime: e.target.value })}
        aria-label="Start time"
      />
      <PeriodSelect value={range.startPeriod} onChange={(v) => onChange({ ...range, startPeriod: v })} ariaLabel="Start period" />
      <span className="typo-body-sm text-vintiga-slate-400 px-1">–</span>
      <TimeInput
        value={range.endTime}
        placeholder="5:00"
        onChange={(e) => onChange({ ...range, endTime: e.target.value })}
        aria-label="End time"
      />
      <PeriodSelect value={range.endPeriod} onChange={(v) => onChange({ ...range, endPeriod: v })} ariaLabel="End period" />

      {/* Inline actions, right-aligned via spacer */}
      <div className="ml-auto flex items-center gap-2">
        {isFirstRange && canAddRange && (
          <IconButton onClick={onAddRange} ariaLabel="Add another range">
            <PlusIcon className="w-3.5 h-3.5" />
          </IconButton>
        )}
        <IconButton onClick={onRemove} ariaLabel="Remove range" danger>
          <TrashIcon className="w-3.5 h-3.5" />
        </IconButton>
      </div>
    </div>
  )
}

function DayRow({
  day,
  schedule,
  onChange,
}: {
  day: Weekday
  schedule: DaySchedule
  onChange: (next: DaySchedule) => void
}) {
  const updateRange = (rangeId: string, patch: Partial<TimeRange>) =>
    onChange({ ...schedule, ranges: schedule.ranges.map((r) => (r.id === rangeId ? { ...r, ...patch } : r)) })
  const removeRange = (rangeId: string) =>
    onChange({ ...schedule, ranges: schedule.ranges.filter((r) => r.id !== rangeId) })
  const addRange = () =>
    onChange({ ...schedule, ranges: [...schedule.ranges, defaultRange()] })

  const toggleEnabled = (next: boolean) => {
    if (next && schedule.ranges.length === 0) {
      onChange({ enabled: true, ranges: [defaultRange()] })
    } else {
      onChange({ ...schedule, enabled: next })
    }
  }

  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-4 py-3 border-b border-vintiga-slate-100 last:border-b-0">
      {/* Day label + checkbox */}
      <Checkbox
        checked={schedule.enabled}
        onChange={toggleEnabled}
        label={<span className="typo-body-sm font-semibold text-vintiga-slate-900">{day}</span>}
      />

      {/* Ranges or "Closed" */}
      <div className="flex flex-col gap-2 min-h-[36px] justify-center">
        {!schedule.enabled ? (
          <span className="typo-body-sm text-vintiga-slate-400">Closed</span>
        ) : schedule.ranges.length === 0 ? (
          <button
            type="button"
            onClick={addRange}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 self-start rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add hours
          </button>
        ) : (
          schedule.ranges.map((range, i) => (
            <RangeRow
              key={range.id}
              range={range}
              onChange={(next) => updateRange(range.id, next)}
              onRemove={() => removeRange(range.id)}
              isFirstRange={i === 0}
              canAddRange={schedule.ranges.length < MAX_RANGES_PER_DAY}
              onAddRange={addRange}
            />
          ))
        )}
      </div>
    </div>
  )
}

function WeeklyScheduleCard() {
  const [schedule, setSchedule] = useState<Record<Weekday, DaySchedule>>(initialSchedule)
  const updateDay = (day: Weekday, next: DaySchedule) => setSchedule((prev) => ({ ...prev, [day]: next }))

  return (
    <SectionCard title="Weekly schedule">
      <p className="typo-body-sm text-vintiga-slate-500">
        Tick the days this experience is bookable and set the hours. Add a second range for split shifts (e.g. AM tours and PM tastings).
      </p>
      <div>
        {WEEKDAYS.map((day) => (
          <DayRow key={day} day={day} schedule={schedule[day]} onChange={(next) => updateDay(day, next)} />
        ))}
      </div>
    </SectionCard>
  )
}

// ─── Date overrides ───────────────────────────────────────────────────────────

function OverrideRow({ o, onChange, onRemove }: { o: Override; onChange: (next: Override) => void; onRemove: () => void }) {
  return (
    <div className="flex flex-col gap-3 p-3 border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="date"
          value={o.date}
          onChange={(e) => onChange({ ...o, date: e.target.value })}
          aria-label="Override date"
          className="h-9 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
        />
        <div className="flex items-center gap-3">
          <Radio
            checked={o.mode === 'closed'}
            onChange={() => onChange({ ...o, mode: 'closed' })}
            label="Closed"
          />
          <Radio
            checked={o.mode === 'custom'}
            onChange={() => onChange({ ...o, mode: 'custom' })}
            label="Custom hours"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove override"
          className="ml-auto w-8 h-8 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-50 transition-colors cursor-pointer bg-transparent border border-vintiga-slate-200"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {o.mode === 'custom' && (
        <div className="flex items-center gap-2 flex-wrap pl-1">
          <TimeInput value={o.startTime} placeholder="10:00" onChange={(e) => onChange({ ...o, startTime: e.target.value })} aria-label="Start time" />
          <PeriodSelect value={o.startPeriod} onChange={(v) => onChange({ ...o, startPeriod: v })} ariaLabel="Start period" />
          <span className="typo-body-sm text-vintiga-slate-400 px-1">–</span>
          <TimeInput value={o.endTime} placeholder="2:00" onChange={(e) => onChange({ ...o, endTime: e.target.value })} aria-label="End time" />
          <PeriodSelect value={o.endPeriod} onChange={(v) => onChange({ ...o, endPeriod: v })} ariaLabel="End period" />
        </div>
      )}
    </div>
  )
}

function DateOverridesCard() {
  const [overrides, setOverrides] = useState<Override[]>([
    { id: uid('o'), date: '2026-07-04', mode: 'closed',  startTime: '',     startPeriod: 'AM', endTime: '',     endPeriod: 'PM' },
    { id: uid('o'), date: '2026-06-15', mode: 'custom',  startTime: '10:00', startPeriod: 'AM', endTime: '2:00', endPeriod: 'PM' },
  ])

  const add = () => setOverrides((prev) => [
    ...prev,
    { id: uid('o'), date: new Date().toISOString().slice(0, 10), mode: 'closed', startTime: '10:00', startPeriod: 'AM', endTime: '2:00', endPeriod: 'PM' },
  ])
  const update = (id: string, next: Override) => setOverrides((prev) => prev.map((o) => (o.id === id ? next : o)))
  const remove = (id: string) => setOverrides((prev) => prev.filter((o) => o.id !== id))

  return (
    <SectionCard
      title="Date overrides"
      action={
        <Button variant="outline" size="sm" onClick={add} leftIcon={<PlusIcon className="w-3.5 h-3.5" />}>
          Add date override
        </Button>
      }
    >
      <p className="typo-body-sm text-vintiga-slate-500">
        Close a specific date (holiday, private event) or set different hours for it. Overrides win over the weekly schedule.
      </p>
      {overrides.length === 0 ? (
        <p className="typo-body-sm text-vintiga-slate-400">No overrides yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {overrides.map((o) => (
            <OverrideRow key={o.id} o={o} onChange={(next) => update(o.id, next)} onRemove={() => remove(o.id)} />
          ))}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function EditorScreen() {
  return (
    <ExperienceShell
      title="Reserve Cellar Tasting"
      activeTab="timeslots"
      tabHrefs={{
        general:   '#/web/experience-timeslots/editor',
        timeslots: '#/web/experience-timeslots/editor',
        pos:       '#/web/experience-timeslots/editor',
        website:   '#/web/experience-timeslots/editor',
      }}
    >
      <p className="typo-body-sm text-vintiga-slate-500 -mt-2">
        Set when guests can book this experience. Operators see only what they need: the weekly hours, and any date exceptions.
      </p>
      <WeeklyScheduleCard />
      <DateOverridesCard />
    </ExperienceShell>
  )
}
