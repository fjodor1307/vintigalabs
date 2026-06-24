import { type Reservation } from './reservationSamples'

// ─── ReservationCalendar ─────────────────────────────────────────────────────
// Time-grid calendar for the Day View / Week View toggle, rebuilt from the
// legacy Commerce 7 reservations calendar in Vintiga tokens. A fixed business-
// hours window (9am–6pm, 30-min slots) runs down a left time gutter; one column
// per day. Reservations render as absolutely-positioned blocks placed by start
// time + a default duration, with side-by-side lanes when they overlap.
//
// The sample bookings all belong to one day (`reservationDay`), so only that
// column populates — but the overlap layout is general, so any day with
// multiple concurrent reservations splits into lanes automatically.

const DAY_START = 9 * 60 // 9:00 am
const DAY_END = 18 * 60 // 6:00 pm
const SLOT_MIN = 30
const SLOT_H = 60 // px per 30-min slot
const DEFAULT_DURATION = 90 // minutes — bookings carry no end time in the sample

const SLOT_COUNT = (DAY_END - DAY_START) / SLOT_MIN
const GRID_H = SLOT_COUNT * SLOT_H

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

function toMinutes(sortKey: string): number {
  const [h, m] = sortKey.split(':').map(Number)
  return h * 60 + m
}

function fmtSlot(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  const ap = h >= 12 ? 'pm' : 'am'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${m.toString().padStart(2, '0')}${ap}`
}

interface Placed {
  r: Reservation
  start: number
  end: number
  col: number
  cols: number
}

// Classic calendar overlap layout: walk events by start time, packing each into
// the first free lane; a lane is "free" once its last event has ended. A run of
// transitively-overlapping events forms a cluster that shares a lane count.
function layout(events: Reservation[]): Placed[] {
  const evs = events
    .map((r) => {
      const start = toMinutes(r.sortKey)
      return { r, start, end: start + DEFAULT_DURATION, col: 0, cols: 1 }
    })
    .sort((a, b) => a.start - b.start || a.end - b.end)

  const result: Placed[] = []
  let cluster: typeof evs = []
  let colEnds: number[] = []
  let clusterEnd = -1

  const finalize = () => {
    const total = colEnds.length || 1
    cluster.forEach((e) => result.push({ ...e, cols: total }))
    cluster = []
    colEnds = []
    clusterEnd = -1
  }

  for (const e of evs) {
    if (clusterEnd !== -1 && e.start >= clusterEnd) finalize()
    let col = colEnds.findIndex((end) => end <= e.start)
    if (col === -1) {
      col = colEnds.length
      colEnds.push(e.end)
    } else {
      colEnds[col] = e.end
    }
    e.col = col
    cluster.push(e)
    clusterEnd = Math.max(clusterEnd, e.end)
  }
  finalize()
  return result
}

function ReservationBlock({ p, onOpen }: { p: Placed; onOpen: (r: Reservation) => void }) {
  const top = ((p.start - DAY_START) / SLOT_MIN) * SLOT_H
  const height = ((p.end - p.start) / SLOT_MIN) * SLOT_H
  const widthPct = 100 / p.cols
  const leftPct = p.col * widthPct
  return (
    <button
      type="button"
      onClick={() => onOpen(p.r)}
      className="absolute text-left rounded-vintiga-sm bg-vintiga-slate-50 border border-vintiga-slate-200 hover:border-vintiga-primary hover:bg-vintiga-white transition-colors overflow-hidden p-vintiga-sm"
      style={{
        top: top + 2,
        height: height - 4,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
      }}
    >
      <span className="block typo-body-sm font-semibold text-vintiga-slate-900 truncate">{p.r.name}</span>
      <span className="block typo-caption text-vintiga-slate-700 truncate">{p.r.experience}</span>
      <span className="block typo-caption text-vintiga-slate-500 truncate">{p.r.area}</span>
      <span className="block typo-caption text-vintiga-slate-500">{p.r.guests} guest{p.r.guests === 1 ? '' : 's'}</span>
    </button>
  )
}

export function ReservationCalendar({
  days,
  reservations,
  reservationDay,
  selectedDate,
  onOpen,
  onSelectDay,
}: {
  /** 1 column (Day View) or 7 columns (Week View). */
  days: Date[]
  /** Already filtered by the toolbar; placed into the column matching `reservationDay`. */
  reservations: Reservation[]
  /** The single day the sample bookings belong to. */
  reservationDay: Date
  /** Highlighted day header. */
  selectedDate: Date
  onOpen: (r: Reservation) => void
  onSelectDay: (d: Date) => void
}) {
  const slots = Array.from({ length: SLOT_COUNT + 1 }, (_, i) => DAY_START + i * SLOT_MIN)

  return (
    <div className="border border-vintiga-slate-200 rounded-vintiga-card overflow-hidden">
      {/* Day header row */}
      <div className="flex border-b border-vintiga-slate-200 bg-vintiga-white">
        <div className="w-16 shrink-0" />
        {days.map((d) => {
          const active = sameDay(d, selectedDate)
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onSelectDay(d)}
              className={[
                'flex-1 flex flex-col items-center py-vintiga-sm border-l border-vintiga-slate-100 transition-colors hover:bg-vintiga-slate-50',
                active ? 'bg-vintiga-slate-50' : '',
              ].join(' ')}
            >
              <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500">
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span
                className={[
                  'typo-title-section font-semibold',
                  active ? 'text-vintiga-primary' : 'text-vintiga-slate-900',
                ].join(' ')}
              >
                {d.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="flex" style={{ height: GRID_H }}>
        {/* Time gutter */}
        <div className="w-16 shrink-0 relative">
          {slots.slice(0, SLOT_COUNT).map((min, i) => (
            <div
              key={min}
              className="absolute right-2 typo-caption text-vintiga-slate-400 -translate-y-1/2"
              style={{ top: i * SLOT_H }}
            >
              {fmtSlot(min)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((d) => {
          const dayEvents = sameDay(d, reservationDay) ? reservations : []
          const placed = layout(dayEvents)
          return (
            <div key={d.toISOString()} className="flex-1 relative border-l border-vintiga-slate-100">
              {/* Slot lines */}
              {slots.map((min, i) => (
                <div
                  key={min}
                  className={[
                    'absolute left-0 right-0 border-t',
                    min % 60 === 0 ? 'border-vintiga-slate-200' : 'border-vintiga-slate-100',
                  ].join(' ')}
                  style={{ top: i * SLOT_H }}
                />
              ))}
              {/* Reservation blocks */}
              {placed.map((p) => (
                <ReservationBlock key={p.r.id} p={p} onOpen={onOpen} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
