import { useState } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { KpiCard } from '@ds/shared/KpiCard'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@ds/shared/Table'
import {
  PackageIcon,
  DollarIcon,
  UserCheckIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  PlusIcon,
  SearchIcon,
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@ds/icons/Icons'

// ─── ClubViewReleasesScreen ───────────────────────────────────────────────────
// Releases tab on the View Club detail page. KPI strip + Club Releases card
// with toolbar, sortable table, and pagination. CTA "Add Release" sits in the
// card header — routes to the existing club's add-release sub-page.

type Status = 'Active' | 'Archived' | 'Planning'

interface Release {
  name: string
  draftOrders: number
  date: string
  status: Status
}

const RELEASES: Release[] = [
  { name: 'January Release',   draftOrders: 2, date: 'Mar 15, 2025', status: 'Active' },
  { name: 'February Release',  draftOrders: 4, date: 'Mar 13, 2025', status: 'Active' },
  { name: 'March Release',     draftOrders: 5, date: 'Mar 11, 2025', status: 'Active' },
  { name: 'April Release',     draftOrders: 6, date: 'Mar 09, 2025', status: 'Active' },
  { name: 'May Release',       draftOrders: 8, date: 'Mar 07, 2025', status: 'Archived' },
  { name: 'June Release',      draftOrders: 9, date: 'Mar 05, 2025', status: 'Archived' },
  { name: 'July Release',      draftOrders: 3, date: 'Mar 03, 2025', status: 'Planning' },
  { name: 'August Release',    draftOrders: 1, date: 'Mar 01, 2025', status: 'Planning' },
  { name: 'September Release', draftOrders: 0, date: 'Feb 27, 2025', status: 'Planning' },
  { name: 'October Release',   draftOrders: 0, date: 'Feb 25, 2025', status: 'Planning' },
  { name: 'November Release',  draftOrders: 0, date: 'Feb 23, 2025', status: 'Planning' },
  { name: 'December Release',  draftOrders: 0, date: 'Feb 21, 2025', status: 'Planning' },
]

const STATUS_TONE: Record<Status, { tone: 'success' | 'default' | 'info'; variant: 'filled' | 'neutral-light' }> = {
  Active:   { tone: 'success', variant: 'filled' },
  Archived: { tone: 'default', variant: 'neutral-light' },
  Planning: { tone: 'info',    variant: 'neutral-light' },
}

export function ClubViewReleasesScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | Status>('all')

  const filtered = RELEASES.filter(
    (r) =>
      (status === 'all' || r.status === status) &&
      (search === '' || r.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <ClubViewLayout activeTab="releases">
      <div className="flex flex-col gap-vintiga-lg">
        {/* KPI grid — compact KPI-small in a 2-col grid (May 7 alignment). */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
          <KpiCard size="sm" label="Total releases"         value="12"       icon={<PackageIcon />} />
          <KpiCard size="sm" label="Estimated revenue"      value="$12,500"  icon={<DollarIcon />} />
          <KpiCard size="sm" label="Revenue"                value="$7,400"   icon={<DollarIcon />} />
          <KpiCard size="sm" label="Qualified members"      value="14"       icon={<UserCheckIcon />} />
          <KpiCard size="sm" label="Processed orders"       value="32"       icon={<ShoppingCartIcon />} />
          <KpiCard size="sm" label="Draft orders finalized" value="32"       icon={<CheckCircleIcon />} />
        </div>

        {/* Releases card */}
        <SectionCard
          title={
            <div className="flex flex-col gap-1">
              <span>Club Releases</span>
              <span className="typo-body-sm font-normal text-vintiga-slate-500">
                View and manage all your club releases.
              </span>
            </div>
          }
          action={
            <Button
              variant="outline"
              size="md"
              leftIcon={<PlusIcon />}
              as="a"
              href="#/web/clubs/view/releases/add"
            >
              Add Release
            </Button>
          }
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-vintiga-md flex-wrap">
            <div className="flex-1 min-w-[240px] max-w-md">
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Release"
                leftIcon={<SearchIcon className="w-4 h-4" />}
              />
            </div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              options={[
                { value: 'all',      label: 'Status' },
                { value: 'Active',   label: 'Active' },
                { value: 'Archived', label: 'Archived' },
                { value: 'Planning', label: 'Planning' },
              ]}
            />
          </div>

          {/* Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <span className="inline-flex items-center gap-1.5">
                    Release name
                    <ArrowUpDownIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />
                  </span>
                </TableHeader>
                <TableHeader>Draft Orders</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader className="w-12" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((r) => {
                const tone = STATUS_TONE[r.status]
                return (
                  <TableRow key={r.name}>
                    <TableCell className="font-medium text-vintiga-slate-900">{r.name}</TableCell>
                    <TableCell>{r.draftOrders}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <Tag variant={tone.variant} tone={tone.tone} size="sm">{r.status}</Tag>
                    </TableCell>
                    <TableCell className="text-right">
                      <IconButton
                        variant="outline"
                        size="sm"
                        icon={<EllipsisVerticalIcon />}
                        aria-label={`${r.name} actions`}
                        onClick={() => {}}
                      />
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
      </div>
    </ClubViewLayout>
  )
}
