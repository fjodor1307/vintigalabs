import { useMemo, useState } from 'react'
import { Tag } from '@ds/shared/Tag'
import { IconButton } from '@ds/shared/IconButton'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@ds/shared/Table'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from '@ds/icons/Icons'
import type { LedgerEntry, LedgerSource } from './customerStore'

// ─── TransactionsTable ───────────────────────────────────────────────────────
// Shared ledger table used by `BalanceTransactionsScreen` and
// `PointsTransactionsScreen`. Column order (per May 7 review):
//
//   Date · Reason · Order # · Amount · Source
//
// Source merges the old "type pill + actor name" pair into one cell so the
// table stays narrow. Manual `user` entries get a left-edge accent so staff
// adjustments stand out from system/integration entries at a glance.

const SOURCE_TONE: Record<LedgerSource, 'default' | 'info' | 'violet'> = {
  user:        'default',
  integration: 'info',
  vintiga:     'violet',
}

const SOURCE_LABEL: Record<LedgerSource, string> = {
  user:        'Manual',
  integration: 'Integration',
  vintiga:     'Vintiga',
}

const PAGE_SIZE = 10

function formatTimestamp(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  return { date, time }
}

export function TransactionsTable({
  entries,
  amountLabel,
  format,
}: {
  entries: LedgerEntry[]
  amountLabel: 'Amount' | 'Points'
  format: (n: number) => string
}) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const paged = useMemo(
    () => entries.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [entries, page],
  )

  return (
    <div className="flex flex-col gap-vintiga-md">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="w-32">Date</TableHeader>
            <TableHeader>Reason</TableHeader>
            <TableHeader className="w-28">Order #</TableHeader>
            <TableHeader className="text-right w-28">{amountLabel}</TableHeader>
            <TableHeader className="w-48">Source</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {paged.map((entry) => {
            const negative = entry.amount < 0
            const isManual = entry.source === 'user'
            const ts = formatTimestamp(entry.timestamp)
            return (
              <TableRow
                key={entry.id}
                className={isManual ? 'bg-vintiga-amber-50/40' : undefined}
              >
                <TableCell className="whitespace-nowrap align-top">
                  <div className="flex flex-col leading-tight">
                    <span className="typo-body-sm font-medium text-vintiga-slate-900">{ts.date}</span>
                    <span className="typo-caption text-vintiga-slate-500">{ts.time}</span>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  {entry.description ?? <span className="text-vintiga-slate-400">—</span>}
                </TableCell>
                <TableCell className="whitespace-nowrap align-top">
                  {entry.orderNumber ? (
                    <span className="font-medium text-vintiga-slate-900">{entry.orderNumber}</span>
                  ) : (
                    <span className="text-vintiga-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium whitespace-nowrap align-top">
                  <span className={negative ? 'text-vintiga-red-700' : 'text-vintiga-green-700'}>
                    {format(entry.amount)}
                  </span>
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Tag variant="filled" tone={SOURCE_TONE[entry.source]} size="sm">
                      {SOURCE_LABEL[entry.source]}
                    </Tag>
                    <span className="typo-body-sm text-vintiga-slate-700 truncate">
                      {entry.sourceName}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {entries.length > PAGE_SIZE && (
        <div className="flex items-center justify-between gap-vintiga-md">
          <span className="typo-body-sm text-vintiga-slate-500">
            Showing {page * PAGE_SIZE + 1}–{Math.min(entries.length, (page + 1) * PAGE_SIZE)} of {entries.length}
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
      )}
    </div>
  )
}

export function TransactionsEmpty({ message }: { message: string }) {
  return (
    <div className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white py-vintiga-xl flex flex-col items-center justify-center text-center gap-1">
      <p className="typo-body-sm font-semibold text-vintiga-slate-900">No transactions</p>
      <p className="typo-caption text-vintiga-slate-500">{message}</p>
    </div>
  )
}
