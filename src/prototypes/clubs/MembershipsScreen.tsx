import { useMemo, useState } from 'react'
import { ClubsLayout } from './ClubsLayout'
import { TextField } from '@ds/shared/TextField'
import { Tag } from '@ds/shared/Tag'
import { IconButton } from '@ds/shared/IconButton'
import { FilterDropdown } from '@ds/shared/FilterDropdown'
import { FlaggedFlag } from './FlaggedFlag'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@ds/shared/Table'
import {
  SearchIcon,
  TruckIcon,
  StoreIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  IdCardIcon,
} from '@ds/icons/Icons'

// ─── Memberships tab ─────────────────────────────────────────────────────────
// Cross-club members table (Figma 5078:4277). Search on the left, filter chips
// on the right (Delivery Method · Status · Club — all multi-select via the
// shared `FilterDropdown` "checkbox list + Clear All / Apply" pattern), then
// a paginated table with member, club, delivery method, and status.

type Delivery = 'shipping' | 'pickup'
type MemberStatus = 'pending' | 'active' | 'on-hold' | 'cancelled'
type ClubKey = 'curators' | 'vintiga-signature' | 'vintiga-heritage' | 'blind-enthusiasm' | 'c7'

interface Member {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  club: ClubKey
  delivery: Delivery
  city: string
  status: MemberStatus
  /** Optional date for `on-hold` / `cancelled` rows. */
  statusDate?: string
  /** Flagged for manual admin review — auto processing will skip orders. */
  flagged?: boolean
}

const CLUB_LABEL: Record<ClubKey, string> = {
  'curators':           'Curators Club',
  'vintiga-signature':  'Vintiga Signature',
  'vintiga-heritage':   'Vintiga Heritage',
  'blind-enthusiasm':   'Blind Enthusiasm',
  'c7':                 'C7',
}

// Avatar URLs are public Unsplash portraits — same set used by the Customers prototype.
const MEMBERS: Member[] = [
  { id: 'm1',  name: 'Jane Davis',       initials: 'JD', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces', club: 'curators',          delivery: 'pickup',   city: 'San Francisco, CA', status: 'active', flagged: true },
  { id: 'm2',  name: 'Leslie Alexander', initials: 'LA', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces', club: 'vintiga-signature', delivery: 'shipping', city: 'San Francisco, CA', status: 'pending', flagged: true },
  { id: 'm3',  name: 'Phoenix Baker',    initials: 'PB', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces', club: 'vintiga-heritage',  delivery: 'shipping', city: 'San Francisco, CA', status: 'on-hold' },
  { id: 'm4',  name: 'Ms Dorothy Ladner',initials: 'DL', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces', club: 'curators',          delivery: 'pickup',   city: 'San Francisco, CA', status: 'active' },
  { id: 'm5',  name: 'Robert Fox',       initials: 'RF',                                                                                                          club: 'vintiga-heritage',  delivery: 'pickup',   city: 'San Francisco, CA', status: 'active' },
  { id: 'm6',  name: 'Jacob Jones',      initials: 'JJ', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces', club: 'curators',          delivery: 'shipping', city: 'San Francisco, CA', status: 'active', flagged: true },
  { id: 'm7',  name: 'Albert Flores',    initials: 'AF', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces', club: 'vintiga-signature', delivery: 'pickup',   city: 'San Francisco, CA', status: 'on-hold', statusDate: 'Hold Until 22 Jan, 2026' },
  { id: 'm8',  name: 'Guy Hawkins',      initials: 'GH', avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=64&h=64&fit=crop&crop=faces', club: 'curators',          delivery: 'shipping', city: 'San Francisco, CA', status: 'pending' },
  { id: 'm9',  name: 'Bessie Cooper',    initials: 'BC', avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=faces', club: 'vintiga-heritage',  delivery: 'shipping', city: 'San Francisco, CA', status: 'cancelled', statusDate: '22 Jan, 2026' },
  { id: 'm10', name: 'Jerome Bell',      initials: 'JB', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&h=64&fit=crop&crop=faces', club: 'vintiga-signature', delivery: 'shipping', city: 'San Francisco, CA', status: 'active' },
]

// Status palette unified with `ClubViewMembersScreen` (per Figma 5078:4277).
// Active = green-success · Pending = orange · On Hold = neutral-light gray
// · Cancelled = red-danger.
const STATUS_TONE: Record<MemberStatus, { tone: 'success' | 'orange' | 'default' | 'danger'; variant: 'filled' | 'neutral-light' }> = {
  active:    { tone: 'success', variant: 'filled' },
  pending:   { tone: 'orange',  variant: 'filled' },
  'on-hold': { tone: 'default', variant: 'neutral-light' },
  cancelled: { tone: 'danger',  variant: 'filled' },
}

const STATUS_LABEL: Record<MemberStatus, string> = {
  active:    'Active',
  pending:   'Pending',
  'on-hold': 'On Hold',
  cancelled: 'Cancelled',
}

// ─── Filter options ───────────────────────────────────────────────────────────

const DELIVERY_OPTIONS = [
  { value: 'shipping' as Delivery, label: 'Shipping', icon: <TruckIcon /> },
  { value: 'pickup'   as Delivery, label: 'Pickup',   icon: <StoreIcon /> },
]

const STATUS_OPTIONS = [
  { value: 'pending'   as MemberStatus, label: 'Pending' },
  { value: 'active'    as MemberStatus, label: 'Active' },
  { value: 'on-hold'   as MemberStatus, label: 'On Hold' },
  { value: 'cancelled' as MemberStatus, label: 'Cancelled' },
]

const CLUB_OPTIONS = (Object.entries(CLUB_LABEL) as [ClubKey, string][]).map(
  ([value, label]) => ({ value, label }),
)

// ─── Screen ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50

export function MembershipsScreen() {
  const [query, setQuery]       = useState('')
  const [delivery, setDelivery] = useState<Set<Delivery>>(new Set())
  const [status, setStatus]     = useState<Set<MemberStatus>>(new Set())
  const [club, setClub]         = useState<Set<ClubKey>>(new Set())
  const [page, setPage]         = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MEMBERS.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q)) return false
      if (delivery.size > 0 && !delivery.has(m.delivery)) return false
      if (status.size > 0 && !status.has(m.status)) return false
      if (club.size > 0 && !club.has(m.club)) return false
      return true
    })
  }, [query, delivery, status, club])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <ClubsLayout activeTab="memberships">
      {/* Search + filter row */}
      <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
        <div className="w-72 max-w-full">
          <TextField
            placeholder="Search Members"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0) }}
            leftIcon={<SearchIcon className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-vintiga-sm">
          <FilterDropdown
            label="Delivery Method"
            options={DELIVERY_OPTIONS}
            value={delivery}
            onChange={(next) => { setDelivery(next); setPage(0) }}
          />
          <FilterDropdown
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(next) => { setStatus(next); setPage(0) }}
          />
          <FilterDropdown
            label="Club"
            options={CLUB_OPTIONS}
            value={club}
            onChange={(next) => { setClub(next); setPage(0) }}
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Members ({filtered.length})</TableHeader>
            <TableHeader>Membership</TableHeader>
            <TableHeader>Delivery</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {paged.map((m) => (
            <TableRow
              key={m.id}
              className="cursor-pointer hover:bg-vintiga-slate-50 transition-colors"
              onClick={() => { window.location.hash = '#/web/clubs/memberships/1004' }}
            >
              <TableCell>
                <div className="flex items-center gap-vintiga-sm">
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-vintiga-indigo-100 text-vintiga-indigo-700 flex items-center justify-center typo-caption font-semibold">
                      {m.initials}
                    </div>
                  )}
                  <span className="typo-body-sm font-medium text-vintiga-slate-900">{m.name}</span>
                  {m.flagged && <FlaggedFlag memberName={m.name} />}
                </div>
              </TableCell>
              <TableCell>
                <Tag
                  variant="outline"
                  tone="default"
                  size="sm"
                  leftIcon={<IdCardIcon className="w-3.5 h-3.5 text-vintiga-indigo-600" />}
                >
                  {CLUB_LABEL[m.club]}
                </Tag>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-vintiga-slate-500 [&>svg]:w-3.5 [&>svg]:h-3.5">
                    {m.delivery === 'shipping' ? <TruckIcon /> : <StoreIcon />}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="typo-body-sm text-vintiga-slate-900">
                      {m.delivery === 'shipping' ? 'Shipping' : 'Pickup'}
                    </span>
                    <span className="typo-caption text-vintiga-slate-500">{m.city}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-0.5">
                  <Tag variant={STATUS_TONE[m.status].variant} tone={STATUS_TONE[m.status].tone} size="sm">
                    {STATUS_LABEL[m.status]}
                  </Tag>
                  {m.statusDate && (
                    <span className="typo-caption text-vintiga-slate-500">{m.statusDate}</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination footer */}
      <div className="flex items-center justify-between gap-vintiga-md">
        <span className="typo-body-sm text-vintiga-slate-500">
          0 of {filtered.length} row(s) selected.
        </span>
        <div className="flex items-center gap-vintiga-md">
          <span className="typo-body-sm text-vintiga-slate-700">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <IconButton variant="outline" size="md" icon={<ChevronsLeftIcon />}  aria-label="First page"    onClick={() => setPage(0)}                            disabled={page === 0} />
            <IconButton variant="outline" size="md" icon={<ChevronLeftIcon />}   aria-label="Previous page" onClick={() => setPage((p) => Math.max(0, p - 1))}    disabled={page === 0} />
            <IconButton variant="outline" size="md" icon={<ChevronRightIcon />}  aria-label="Next page"     onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} />
            <IconButton variant="outline" size="md" icon={<ChevronsRightIcon />} aria-label="Last page"     onClick={() => setPage(totalPages - 1)}               disabled={page >= totalPages - 1} />
          </div>
        </div>
      </div>
    </ClubsLayout>
  )
}
