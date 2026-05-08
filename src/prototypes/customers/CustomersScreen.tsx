import { useMemo, useState } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Avatar } from '@ds/shared/Avatar'
import { Checkbox } from '@ds/shared/Checkbox'
import { SelectAllCheckbox } from '@ds/shared/SelectAllCheckbox'
import { KpiCard } from '@ds/shared/KpiCard'
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
  SearchIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  IdCardIcon,
  UsersIcon,
  DollarIcon,
  CircleAlertIcon,
  AlertTriangleIcon,
  CircleXIcon,
} from '@ds/icons/Icons'
import {
  CUSTOMER_LIST,
  CUSTOMER_LIST_TOTAL,
  CUSTOMER_LIST_MEMBER_TOTAL,
  type CustomerListEntry,
  type CustomerAlert,
} from './customerSample'

// ─── CustomersScreen ──────────────────────────────────────────────────────────
// Customers index — Figma `Customers` (2040:15777). Page header + 4-up KPI
// strip + a widget card containing search + Tags/Actions toolbar, customer
// table (checkbox / avatar+identity / phone+email / lifetime spend / last
// purchase / customer since / kebab) and a pagination footer.
//
// Only the canonical Jane Davis row deep-links into the detail flow. Filters
// and bulk actions are no-ops at the prototype stage — the rest of the chrome
// is wired so the page reads correctly.

// ─── Row alert icon ──────────────────────────────────────────────────────────

const ALERT_META: Record<CustomerAlert, { icon: React.ReactNode; cls: string; label: string }> = {
  info:    { icon: <CircleAlertIcon />,   cls: 'text-vintiga-orange-500', label: 'Needs follow-up' },
  warning: { icon: <AlertTriangleIcon />, cls: 'text-vintiga-red-500',    label: 'Compliance flag' },
  danger:  { icon: <CircleXIcon />,       cls: 'text-vintiga-red-500',    label: 'Account cancelled' },
}

function AlertIcon({ kind }: { kind: CustomerAlert }) {
  const meta = ALERT_META[kind]
  return (
    <span
      className={`inline-flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 ${meta.cls}`}
      aria-label={meta.label}
      title={meta.label}
    >
      {meta.icon}
    </span>
  )
}

// ─── Table row ───────────────────────────────────────────────────────────────

function CustomerRow({
  customer,
  selected,
  onSelectedChange,
}: {
  customer: CustomerListEntry
  selected: boolean
  onSelectedChange: (next: boolean) => void
}) {
  const goDetail = customer.href
    ? () => { window.location.hash = customer.href!.slice(1) }
    : undefined

  return (
    <TableRow onClick={goDetail}>
      {/* Customer + identity (icon-row inside the cell uses the same height as the avatar). */}
      <TableCell className="py-vintiga-sm">
        <div className="flex items-center gap-vintiga-sm">
          <span onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selected}
              onChange={onSelectedChange}
              aria-label={`Select ${customer.name}`}
              size="sm"
            />
          </span>
          <div className="relative shrink-0">
            <Avatar name={customer.name} src={customer.avatarUrl} initials={customer.initials} size="md" />
            {customer.isMember && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-vintiga-indigo-500 border-2 border-vintiga-white flex items-center justify-center text-vintiga-white [&>svg]:w-3 [&>svg]:h-3"
                aria-label="Club member"
                title="Club member"
              >
                <IdCardIcon />
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-vintiga-slate-900 truncate">{customer.name}</span>
            <span className="typo-caption text-vintiga-slate-500 truncate">
              {customer.city}, {customer.state}
            </span>
          </div>
          {customer.alert && (
            <span className="ml-auto pl-vintiga-sm shrink-0">
              <AlertIcon kind={customer.alert} />
            </span>
          )}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col">
          <span className="text-vintiga-slate-900">{customer.email}</span>
          <span className="typo-caption text-vintiga-slate-500">{customer.phone}</span>
        </div>
      </TableCell>

      <TableCell className="text-right font-medium whitespace-nowrap">{customer.lifetimeSpend}</TableCell>
      <TableCell className="text-vintiga-slate-500 whitespace-nowrap">{customer.lastPurchase}</TableCell>
      <TableCell className="text-vintiga-slate-500 whitespace-nowrap">{customer.customerSince}</TableCell>

      <TableCell className="text-right">
        <span onClick={(e) => e.stopPropagation()} className="inline-flex">
          <PopoverMenu
            align="right"
            width="w-44"
            trigger={(_open, toggle) => (
              <IconButton
                variant="outline"
                size="sm"
                icon={<EllipsisVerticalIcon />}
                onClick={toggle}
                aria-label={`More options for ${customer.name}`}
              />
            )}
            items={[
              ...(customer.href ? [{ label: 'View', onClick: goDetail! }] : []),
              { label: 'Add tag',  onClick: () => {} },
              { label: 'Send email', onClick: () => {} },
              { label: 'Delete',   onClick: () => {}, danger: true },
            ]}
          />
        </span>
      </TableCell>
    </TableRow>
  )
}

// ─── Pagination ──────────────────────────────────────────────────────────────

function PaginationBar({
  totalRows,
  selectedCount,
  pageSize,
  onPageSizeChange,
  page,
  totalPages,
  onPageChange,
}: {
  totalRows: number
  selectedCount: number
  pageSize: number
  onPageSizeChange: (next: number) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-vintiga-md flex-wrap pt-vintiga-md">
      <span className="typo-body-sm text-vintiga-slate-500">
        {selectedCount} of {totalRows} row(s) selected.
      </span>
      <div className="flex items-center gap-vintiga-lg flex-wrap">
        <div className="flex items-center gap-vintiga-sm">
          <label htmlFor="rows-per-page" className="typo-body-sm text-vintiga-slate-700">Rows per page</label>
          <Select
            id="rows-per-page"
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            options={['10', '25', '50']}
            className="w-20 h-9"
          />
        </div>
        <span className="typo-body-sm text-vintiga-slate-700">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-vintiga-xs">
          <IconButton
            variant="outline"
            size="md"
            icon={<ChevronsLeftIcon />}
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            aria-label="First page"
          />
          <IconButton
            variant="outline"
            size="md"
            icon={<ChevronLeftIcon />}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          />
          <IconButton
            variant="outline"
            size="md"
            icon={<ChevronRightIcon />}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          />
          <IconButton
            variant="outline"
            size="md"
            icon={<ChevronsRightIcon />}
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            aria-label="Last page"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export function CustomersScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const [query, setQuery]       = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return CUSTOMER_LIST.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      `${c.city}, ${c.state}`.toLowerCase().includes(q),
    )
  }, [query])

  // Page size and counts — the visible page count uses the seeded "320" total
  // so pagination feels real even though only 10 fixture rows exist.
  const totalPages = Math.max(1, Math.ceil(CUSTOMER_LIST_TOTAL / pageSize))

  function selectPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const c of filtered) next.add(c.id)
      return next
    })
  }

  function selectAll() {
    // The fixture only ships 10 rows but the toolbar advertises 320 — selecting
    // "all" marks every available id. Future-pages would be virtual.
    setSelected(new Set(CUSTOMER_LIST.map((c) => c.id)))
  }

  function clearSelection() {
    setSelected(new Set())
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Customers"
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
        <main className="flex-1 overflow-y-auto pt-16 bg-vintiga-slate-50">
          <div className="p-vintiga-xl flex flex-col gap-vintiga-xl">
            {/* Page header */}
            <div>
              <h1 className="typo-title-screen font-semibold text-vintiga-slate-900">Customers</h1>
              <p className="typo-body-sm text-vintiga-slate-500 mt-1">
                Manage your customers and relationships.
              </p>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-vintiga-md">
              <KpiCard label="Total Customers" value={CUSTOMER_LIST_TOTAL.toLocaleString()} icon={<UsersIcon />} />
              <KpiCard label="Total Members"   value={CUSTOMER_LIST_MEMBER_TOTAL.toLocaleString()} icon={<IdCardIcon />} />
              <KpiCard label="AOV"             value="$132" icon={<DollarIcon />} />
              <KpiCard label="ALV"             value="$450" icon={<DollarIcon />} />
            </div>

            {/* Customers widget */}
            <section className="border border-vintiga-slate-200 rounded-vintiga-2xl bg-vintiga-white p-vintiga-lg flex flex-col gap-vintiga-lg">
              {/* Toolbar */}
              <div className="flex items-center gap-vintiga-md flex-wrap">
                <div className="flex-1 min-w-[240px] max-w-sm">
                  <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Customers"
                    leftIcon={<SearchIcon />}
                  />
                </div>
                <div className="flex items-center gap-vintiga-sm ml-auto">
                  <PopoverMenu
                    align="right"
                    width="w-44"
                    trigger={(_open, toggle) => (
                      <Button variant="outline" size="md" rightIcon={<ChevronDownIcon />} onClick={toggle}>
                        Tags
                      </Button>
                    )}
                    items={[
                      { label: 'Dog Owner', onClick: () => {} },
                      { label: 'Investor',  onClick: () => {} },
                      { label: 'VIP',       onClick: () => {} },
                      { label: 'Lapsed',    onClick: () => {} },
                    ]}
                  />
                  <PopoverMenu
                    align="right"
                    width="w-48"
                    trigger={(_open, toggle) => (
                      <Button variant="outline" size="md" rightIcon={<ChevronDownIcon />} onClick={toggle}>
                        Actions
                      </Button>
                    )}
                    items={[
                      { label: 'Export CSV',     onClick: () => {} },
                      { label: 'Send Campaign',  onClick: () => {} },
                      { label: 'Add to Club',    onClick: () => {} },
                      { label: 'Delete',         onClick: () => {}, danger: true, disabled: selected.size === 0 },
                    ]}
                  />
                </div>
              </div>

              {/* Table */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>
                      <div className="flex items-center gap-vintiga-sm">
                        <SelectAllCheckbox
                          selectedCount={selected.size}
                          totalOnPage={filtered.length}
                          totalAll={CUSTOMER_LIST_TOTAL}
                          onSelectPage={selectPage}
                          onSelectAll={selectAll}
                          onClear={clearSelection}
                        />
                        <span>Customers ({CUSTOMER_LIST_TOTAL})</span>
                        <ArrowUpDownIcon className="w-4 h-4 text-vintiga-slate-400 ml-auto" />
                      </div>
                    </TableHeader>
                    <TableHeader>Phone and Email</TableHeader>
                    <TableHeader className="text-right">Lifetime Spend</TableHeader>
                    <TableHeader>Last Purchase</TableHeader>
                    <TableHeader>Customer Since</TableHeader>
                    <TableHeader className="w-12" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((c) => (
                    <CustomerRow
                      key={c.id}
                      customer={c}
                      selected={selected.has(c.id)}
                      onSelectedChange={(next) => toggleRow(c.id, next)}
                    />
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <PaginationBar
                totalRows={pageSize}
                selectedCount={selected.size}
                pageSize={pageSize}
                onPageSizeChange={(n) => { setPageSize(n); setPage(1) }}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
