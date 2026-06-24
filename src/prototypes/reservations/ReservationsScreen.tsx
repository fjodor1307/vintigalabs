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
} from '@ds/icons/Icons'
import {
  RESERVATIONS,
  RESERVATION_DATE,
  STATUS_TONE,
  type Reservation,
  type ReservationStatus,
} from './reservationSamples'

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
function DropdownButton({ label, items }: { label: string; items: { label: string; onClick?: () => void; danger?: boolean }[] }) {
  return (
    <PopoverMenu
      align="right"
      width="w-44"
      trigger={(_open, toggle) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-vintiga-button border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors"
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
  const [query, setQuery] = useState('')
  const [experience, setExperience] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<Set<ReservationStatus>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (q && !(r.name.toLowerCase().includes(q) || r.experience.toLowerCase().includes(q))) return false
      if (experience.size > 0 && !experience.has(r.experience)) return false
      if (status.size > 0 && !status.has(r.status)) return false
      return true
    })
  }, [rows, query, experience, status])

  const guestCount = filtered.reduce((sum, r) => sum + r.guests, 0)

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
                    {filtered.length} reservation{filtered.length === 1 ? '' : 's'}, {guestCount} guest{guestCount === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex items-center gap-vintiga-sm">
                  <button
                    type="button"
                    className="inline-flex items-center gap-vintiga-sm h-10 px-3 rounded-vintiga-input border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-medium text-vintiga-slate-900 hover:bg-vintiga-slate-50 transition-colors"
                  >
                    <CalendarIcon className="w-4 h-4 text-vintiga-slate-500" />
                    {RESERVATION_DATE}
                  </button>
                  <Button variant="outline" onClick={() => {}}>Today</Button>
                </div>
              </div>

              <div className="flex items-center gap-vintiga-sm">
                <IconButton variant="outline" size="md" icon={<SparklesIcon />} aria-label="Insights" onClick={() => {}} />
                <IconButton variant="outline" size="md" icon={<MessageIcon />} aria-label="Messages" onClick={() => {}} />
                <DropdownButton
                  label="List View"
                  items={[
                    { label: 'List View' },
                    { label: 'Timeline' },
                    { label: 'Floor Plan' },
                  ]}
                />
                <Button leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => {}}>Add</Button>
                <DropdownButton
                  label="More"
                  items={[
                    { label: 'Print run sheet' },
                    { label: 'Export CSV' },
                    { label: 'Reservation settings' },
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

            {/* Table */}
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
                {filtered.map((r) => (
                  <TableRow key={r.id} className="hover:bg-vintiga-slate-50 transition-colors">
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
                      <div className="inline-flex items-center justify-end gap-vintiga-sm">
                        <IconButton variant="outline" size="sm" icon={<SparklesIcon />} aria-label={`Insights for ${r.name}`} onClick={() => {}} />
                        {r.status === 'Checked In' ? (
                          <span className="typo-body-sm font-medium text-vintiga-success">Checked In</span>
                        ) : (
                          <Button size="sm" onClick={() => checkIn(r.id)}>Check In</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="typo-body-sm text-vintiga-slate-500 px-vintiga-lg py-vintiga-2xl text-center">
                      No reservations match your search.
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>

            {/* Footer summary */}
            <div className="rounded-vintiga-md bg-vintiga-slate-700 text-white px-vintiga-md py-vintiga-sm typo-body-sm font-medium">
              Reservations: {filtered.length}, Guests: {guestCount}
            </div>
          </div>
        </div>
      </div>
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
