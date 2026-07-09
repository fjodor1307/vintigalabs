import { useMemo, useState, type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { TextField } from '@ds/shared/TextField'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Avatar } from '@ds/shared/Avatar'
import { FilterDropdown } from '@ds/shared/FilterDropdown'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@ds/shared/Table'
import {
  CalendarIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  MessageIcon,
  SparklesIcon,
  MapPinIcon,
  FileTextIcon,
  CircleXIcon,
  CheckIcon,
  PencilIcon,
} from '@ds/icons/Icons'
import { Popover } from './Popover'
import { MiniCalendar } from './MiniCalendar'
import { ReservationCalendar } from './ReservationCalendar'
import { GuestPanel } from './GuestPanel'
import { BlockTimeModal } from './ReservationModals'
import {
  RESERVATIONS,
  STATUS_TONE,
  type Reservation,
  type ReservationStatus,
} from './reservationSamples'

// The day the sample bookings belong to (and the prototype's "today").
const DATA_DATE = new Date(2026, 5, 23)
type ViewMode = 'List View' | 'Day View' | 'Week View'
const VIEWS: ViewMode[] = ['List View', 'Day View', 'Week View']

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

// ─── ReservationsScreen ──────────────────────────────────────────────────────
// Day-view reservations list, rebuilt from the legacy Commerce 7 screen in
// Vintiga tokens + components. Header (title · date · view/add/more), a search +
// filter toolbar, the reservation table, and a footer summary bar. "Check In"
// flips a row to Checked In live.

const EXPERIENCE_OPTIONS = Array.from(new Set(RESERVATIONS.map((r) => r.experience)))
  .map((e) => ({ value: e, label: e }))

const STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: 'Paid',       label: 'Paid' },
  { value: 'Unpaid',     label: 'Unpaid' },
  { value: 'Confirmed',  label: 'Confirmed' },
  { value: 'Checked In', label: 'Checked In' },
  { value: 'Cancelled',  label: 'Cancelled' },
  { value: 'No Show',    label: 'No Show' },
]

/** Outline pill that opens a menu — for "List View" and "More". */
function DropdownButton({
  label,
  items,
  width = 'w-44',
}: {
  label: string
  items: { label: ReactNode; onClick?: () => void; danger?: boolean; icon?: ReactNode }[]
  width?: string
}) {
  return (
    <PopoverMenu
      align="right"
      width={width}
      trigger={(_open, toggle) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors"
        >
          {label}
          <ChevronDownIcon className="w-4 h-4 text-vintiga-slate-400" />
        </button>
      )}
      items={items}
    />
  )
}

export function ReservationsScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  const [rows, setRows] = useState<Reservation[]>(RESERVATIONS)
  const [date, setDate] = useState<Date>(DATA_DATE)
  const [view, setView] = useState<ViewMode>('List View')
  const [query, setQuery] = useState('')
  const [experience, setExperience] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<Set<ReservationStatus>>(new Set())
  // The reservation whose "Get To Know" guest panel is open (bulb action).
  const [guest, setGuest] = useState<Reservation | null>(null)
  const [blockOpen, setBlockOpen] = useState(false)

  // Toolbar filters (search · experience · status), applied regardless of date.
  const matched = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (q && !(r.name.toLowerCase().includes(q) || r.experience.toLowerCase().includes(q))) return false
      if (experience.size > 0 && !experience.has(r.experience)) return false
      if (status.size > 0 && !status.has(r.status)) return false
      return true
    })
  }, [rows, query, experience, status])

  // The sample bookings belong to DATA_DATE only — other days read empty.
  const onDataDate = sameDay(date, DATA_DATE)
  // The Sun–Sat week containing the active date (for Week View).
  const weekDays = useMemo(() => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    start.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [date])
  const weekHasData = weekDays.some((d) => sameDay(d, DATA_DATE))

  // What's visible depends on the view's date scope: a single day (List / Day)
  // or the whole week (Week). A text search overrides the date scope — searching
  // spans every reservation, not just the day in view (Jul 9 review).
  const searching = query.trim() !== ''
  const visible = searching
    ? matched
    : view === 'Week View' ? (weekHasData ? matched : []) : onDataDate ? matched : []

  const guestCount = visible.reduce((sum, r) => sum + r.guests, 0)
  const hasFilters = query.trim() !== '' || experience.size > 0 || status.size > 0

  function checkIn(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'Checked In' } : r)))
  }

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Reservations"
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="responsive"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={onMenuToggle}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <div className="flex-1 overflow-y-auto pt-16 bg-vintiga-white">
          <div className="px-vintiga-lg pb-vintiga-lg pt-vintiga-lg flex flex-col gap-vintiga-lg">
            {/* Header */}
            <div className="flex items-start justify-between gap-vintiga-md flex-wrap">
              <div className="flex items-center gap-vintiga-md flex-wrap">
                <div className="flex flex-col">
                  <h1 className="typo-title-screen font-semibold text-vintiga-slate-900">Reservations</h1>
                  <span className="typo-body-sm text-vintiga-slate-500">
                    {visible.length} reservation{visible.length === 1 ? '' : 's'}, {guestCount} guest{guestCount === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex items-center gap-vintiga-sm">
                  <Popover
                    align="left"
                    width="w-72"
                    trigger={(_open, toggle) => (
                      <button
                        type="button"
                        onClick={toggle}
                        className="inline-flex items-center gap-vintiga-sm h-10 px-3 rounded-vintiga-input border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-medium text-vintiga-slate-900 hover:bg-vintiga-slate-50 transition-colors"
                      >
                        <CalendarIcon className="w-4 h-4 text-vintiga-slate-500" />
                        {formatDate(date)}
                      </button>
                    )}
                  >
                    {(close) => (
                      <MiniCalendar selected={date} onSelect={(d) => { setDate(d); close() }} />
                    )}
                  </Popover>
                  <Button variant="outline" className="h-10" onClick={() => setDate(DATA_DATE)}>Today</Button>
                </div>
              </div>

              <div className="flex items-center gap-vintiga-sm">
                {/* Notes */}
                <Popover
                  align="right"
                  width="w-96"
                  trigger={(_open, toggle) => (
                    <IconButton variant="outline" size="md" icon={<MessageIcon />} aria-label="Notes" onClick={toggle} />
                  )}
                >
                  {() => (
                    <div className="flex flex-col gap-vintiga-md">
                      <div className="flex flex-col gap-vintiga-xs">
                        <div className="flex items-center justify-between gap-vintiga-md">
                          <h3 className="typo-body-lg font-semibold text-vintiga-slate-900">Schedule Notes</h3>
                          <IconButton variant="outline" size="sm" icon={<PencilIcon />} aria-label="Edit schedule notes" onClick={() => {}} />
                        </div>
                        <p className="typo-body-sm text-vintiga-slate-500">No notes entered.</p>
                      </div>
                      <div className="flex flex-col gap-vintiga-xs">
                        <h3 className="typo-body-lg font-semibold text-vintiga-slate-900">Staff Notes</h3>
                        <p className="typo-body-sm text-vintiga-slate-500">No notes entered.</p>
                      </div>
                    </div>
                  )}
                </Popover>

                <DropdownButton
                  label={view}
                  items={VIEWS.map((v) => ({
                    label: v,
                    icon: v === view ? <CheckIcon className="w-4 h-4 text-vintiga-primary" /> : undefined,
                    onClick: () => setView(v),
                  }))}
                />
                <Button className="h-10" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => { window.location.hash = '#/web/reservations/add' }}>Add</Button>
                <DropdownButton
                  label="More"
                  width="w-60"
                  items={[
                    { label: 'Block Time', icon: <CircleXIcon className="w-4 h-4" />, onClick: () => setBlockOpen(true) },
                    { label: 'Print List', icon: <FileTextIcon className="w-4 h-4" />, onClick: () => {} },
                  ]}
                />
              </div>
            </div>

            {/* Search + filters */}
            <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
              <div className="flex-1 min-w-[260px] max-w-xl">
                <TextField
                  placeholder="Search Reservations"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leftIcon={<SearchIcon className="w-4 h-4" />}
                />
              </div>
              <div className="flex items-center gap-vintiga-sm">
                <FilterDropdown
                  label="Experience"
                  options={EXPERIENCE_OPTIONS}
                  value={experience}
                  onChange={setExperience}
                />
                <FilterDropdown
                  label="More Filters"
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={setStatus}
                />
              </div>
            </div>

            {/* Calendar views — Day (single column) / Week (Sun–Sat). */}
            {view !== 'List View' && (
              <ReservationCalendar
                days={view === 'Week View' ? weekDays : [date]}
                reservations={visible}
                reservationDay={DATA_DATE}
                selectedDate={date}
                onOpen={() => { window.location.hash = '#/web/reservations/view' }}
                onSelectDay={(d) => { setDate(d); setView('Day View') }}
              />
            )}

            {/* List view — the reservation table + footer summary. */}
            {view === 'List View' && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader className="w-24">Time</TableHeader>
                  <TableHeader className="w-20">Guests</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Experience</TableHeader>
                  <TableHeader>Location</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="w-40 text-right">{''}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer hover:bg-vintiga-slate-50 transition-colors"
                    onClick={() => { window.location.hash = '#/web/reservations/view' }}
                  >
                    <TableCell className="font-medium text-vintiga-slate-900 whitespace-nowrap">{r.time}</TableCell>
                    <TableCell className="text-vintiga-slate-700">{r.guests}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-vintiga-sm">
                        <Avatar name={r.name} initials={r.initials} src={r.avatarUrl} size="sm" />
                        <span className="typo-body-sm font-medium text-vintiga-slate-900">{r.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TwoLine primary={r.experience} secondary={r.area} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 mt-0.5 text-vintiga-slate-400 shrink-0" />
                        <TwoLine primary={r.location} secondary={`Table ${r.table}`} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tag variant="filled" tone={STATUS_TONE[r.status]} size="sm">{r.status}</Tag>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-vintiga-sm" onClick={(e) => e.stopPropagation()}>
                        <IconButton variant="outline" size="sm" icon={<SparklesIcon />} aria-label={`Get to know ${r.name}`} onClick={() => setGuest(r)} />
                        {r.status === 'Checked In' ? (
                          <span className="typo-body-sm font-medium text-vintiga-success">Checked In</span>
                        ) : (
                          <Button size="sm" onClick={() => checkIn(r.id)}>Check In</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} className="typo-body-sm text-vintiga-slate-500 px-vintiga-lg py-vintiga-2xl text-center">
                      {hasFilters ? 'No reservations match your search.' : `No reservations on ${formatDate(date)}.`}
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
            )}

            {/* Footer summary — list view only */}
            {view === 'List View' && (
              <div className="rounded-vintiga-md bg-vintiga-slate-700 text-white px-vintiga-md py-vintiga-sm typo-body-sm font-medium">
                Reservations: {visible.length}, Guests: {guestCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {guest && <GuestPanel guest={guest} onClose={() => setGuest(null)} />}
      <BlockTimeModal open={blockOpen} onClose={() => setBlockOpen(false)} />
    </div>
  )
}

function TwoLine({ primary, secondary }: { primary: ReactNode; secondary: ReactNode }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="typo-body-sm text-vintiga-slate-900">{primary}</span>
      <span className="typo-caption text-vintiga-slate-500">{secondary}</span>
    </div>
  )
}
