import { useState } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Tag } from '@ds/shared/Tag'
import { Avatar } from '@ds/shared/Avatar'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@ds/shared/Table'
import { IconButton } from '@ds/shared/IconButton'
import { FlaggedFlag } from './FlaggedFlag'
import {
  SearchIcon,
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@ds/icons/Icons'

// ─── ClubViewMembersScreen ────────────────────────────────────────────────────
// Members tab on the View Club detail page. Toolbar (search + delivery + status
// filters) above a sortable members table with status pills, avatars, and
// row-level actions. Hold-Until date renders inline beneath the On Hold pill.

type Status = 'Active' | 'Pending' | 'On Hold' | 'Cancelled'

interface Member {
  id: string
  name: string
  photo?: string
  delivery: 'Delivery' | 'Pickup'
  city: string
  status: Status
  holdUntil?: string
  /** Flagged for manual admin review — auto processing will skip orders. */
  flagged?: boolean
}

const MEMBERS: Member[] = [
  { id: '1001', name: 'Jane Davis',         photo: 'https://i.pravatar.cc/64?img=47', delivery: 'Delivery', city: 'San Francisco, CA', status: 'Active',  flagged: true },
  { id: '1002', name: 'Leslie Alexander',   photo: 'https://i.pravatar.cc/64?img=12', delivery: 'Pickup',   city: 'Oakland, CA',       status: 'Pending', flagged: true },
  { id: '1003', name: 'Phoenix Baker',      photo: 'https://i.pravatar.cc/64?img=22', delivery: 'Delivery', city: 'Portland, OR',      status: 'Active' },
  { id: '1004', name: 'Ms Dorothy Ladner',  photo: 'https://i.pravatar.cc/64?img=32', delivery: 'Delivery', city: 'Seattle, WA',       status: 'On Hold', holdUntil: '22 Jan, 2026' },
  { id: '1005', name: 'Robert Fox',                                                   delivery: 'Pickup',   city: 'Napa, CA',          status: 'Active' },
  { id: '1006', name: 'Jacob Jones',                                                  delivery: 'Delivery', city: 'Sonoma, CA',        status: 'Cancelled', flagged: true },
  { id: '1007', name: 'Albert Flores',      photo: 'https://i.pravatar.cc/64?img=15', delivery: 'Delivery', city: 'Berkeley, CA',      status: 'Active' },
  { id: '1008', name: 'Guy Hawkins',                                                  delivery: 'Pickup',   city: 'San Jose, CA',      status: 'Pending' },
  { id: '1009', name: 'Bessie Cooper',      photo: 'https://i.pravatar.cc/64?img=44', delivery: 'Delivery', city: 'Sacramento, CA',    status: 'Active' },
  { id: '1010', name: 'Jerome Bell',        photo: 'https://i.pravatar.cc/64?img=8',  delivery: 'Delivery', city: 'Santa Rosa, CA',    status: 'Active' },
]

const STATUS_TONE: Record<Status, { tone: 'success' | 'orange' | 'default' | 'danger'; variant: 'filled' | 'outline' | 'neutral-light' }> = {
  Active:    { tone: 'success', variant: 'filled' },
  Pending:   { tone: 'orange',  variant: 'filled' },
  'On Hold': { tone: 'default', variant: 'neutral-light' },
  Cancelled: { tone: 'danger',  variant: 'filled' },
}

// Initial status filter — picked up from `?status=Active` (etc.) on the
// hash so the Overview's KPI cards can deep-link into a pre-filtered list.
function initialStatusFromHash(): 'all' | Status {
  const q = window.location.hash.split('?')[1]
  if (!q) return 'all'
  const v = new URLSearchParams(q).get('status')
  if (v === 'Active' || v === 'Pending' || v === 'On Hold' || v === 'Cancelled') return v
  return 'all'
}

export function ClubViewMembersScreen() {
  const [search, setSearch]       = useState('')
  const [delivery, setDelivery]   = useState<'all' | 'Delivery' | 'Pickup'>('all')
  const [statusFilter, setStatus] = useState<'all' | Status>(initialStatusFromHash)

  const filtered = MEMBERS.filter((m) =>
    (delivery === 'all' || m.delivery === delivery) &&
    (statusFilter === 'all' || m.status === statusFilter) &&
    (search === '' || m.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <ClubViewLayout activeTab="members">
      <SectionCard
        title={
          <div className="flex flex-col gap-1">
            <span>Members ({MEMBERS.length})</span>
            <span className="typo-body-sm font-normal text-vintiga-slate-500">
              View, filter, and manage every member of this club.
            </span>
          </div>
        }
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
          <div className="flex-1 min-w-[240px] max-w-md">
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Members"
              leftIcon={<SearchIcon className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-center gap-vintiga-sm">
            <Select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value as typeof delivery)}
              options={[
                { value: 'all',      label: 'Delivery Method' },
                { value: 'Delivery', label: 'Delivery' },
                { value: 'Pickup',   label: 'Pickup' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value as typeof statusFilter)}
              options={[
                { value: 'all',       label: 'Status' },
                { value: 'Active',    label: 'Active' },
                { value: 'Pending',   label: 'Pending' },
                { value: 'On Hold',   label: 'On Hold' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>
                <span className="inline-flex items-center gap-1.5">
                  Member
                  <ArrowUpDownIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />
                </span>
              </TableHeader>
              <TableHeader>Delivery</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="w-12" />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((m) => {
              const tone = STATUS_TONE[m.status]
              return (
                <TableRow
                  key={m.id}
                  onClick={() => { window.location.hash = `#/web/clubs/memberships/${m.id}` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-vintiga-sm">
                      <Avatar name={m.name} src={m.photo} size="sm" />
                      <span className="font-medium text-vintiga-slate-900">{m.name}</span>
                      {m.flagged && <FlaggedFlag memberName={m.name} />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-vintiga-slate-900">{m.delivery}</span>
                      <span className="typo-caption text-vintiga-slate-500">{m.city}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <Tag variant={tone.variant} tone={tone.tone} size="sm">{m.status}</Tag>
                      {m.holdUntil && (
                        <span className="typo-caption text-vintiga-slate-500">Hold Until {m.holdUntil}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className="inline-flex"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        variant="outline"
                        size="sm"
                        icon={<EllipsisVerticalIcon />}
                        aria-label={`${m.name} actions`}
                        onClick={() => {}}
                      />
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-vintiga-md pt-vintiga-sm">
          <div className="flex items-center gap-vintiga-sm">
            <span className="typo-body-sm text-vintiga-slate-500">Rows per page</span>
            <Select defaultValue="50" options={['10', '25', '50', '100']} className="!w-[88px]" />
          </div>
          <div className="flex items-center gap-vintiga-sm typo-body-sm text-vintiga-slate-700">
            <IconButton variant="outline" size="sm" icon={<ChevronLeftIcon />} aria-label="Previous page" onClick={() => {}} />
            <span>Page 1 of 5</span>
            <IconButton variant="outline" size="sm" icon={<ChevronRightIcon />} aria-label="Next page" onClick={() => {}} />
          </div>
        </div>
      </SectionCard>
    </ClubViewLayout>
  )
}
