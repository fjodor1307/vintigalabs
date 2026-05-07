import { Tag } from '@ds/shared/Tag'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@ds/shared/Table'
import type { LedgerEntry, LedgerSource } from './customerStore'

// ─── TransactionsTable ───────────────────────────────────────────────────────
// Shared ledger table used by `BalanceTransactionsScreen` and
// `PointsTransactionsScreen`. Same column shape (Timestamp · Source ·
// Source Name · Order # · Description · Amount) — only the formatter for
// the trailing column changes (currency vs integer points).

const SOURCE_TONE: Record<LedgerSource, 'default' | 'info' | 'violet'> = {
  user:        'default',
  integration: 'info',
  vintiga:     'violet',
}

const SOURCE_LABEL: Record<LedgerSource, string> = {
  user:        'User',
  integration: 'Integration',
  vintiga:     'Vintiga',
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  return `${date} · ${time}`
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
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Source</TableHeader>
          <TableHeader>Source Name</TableHeader>
          <TableHeader>Order #</TableHeader>
          <TableHeader>Description</TableHeader>
          <TableHeader className="text-right">{amountLabel}</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map((entry) => {
          const negative = entry.amount < 0
          return (
            <TableRow key={entry.id}>
              <TableCell className="whitespace-nowrap">{formatTimestamp(entry.timestamp)}</TableCell>
              <TableCell>
                <Tag variant="filled" tone={SOURCE_TONE[entry.source]} size="sm">
                  {SOURCE_LABEL[entry.source]}
                </Tag>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-vintiga-slate-900">{entry.sourceName}</span>
                  {entry.sourceUserId && (
                    <span className="typo-caption text-vintiga-slate-500">{entry.sourceUserId}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {entry.orderNumber ? (
                  <span className="font-medium text-vintiga-slate-900">{entry.orderNumber}</span>
                ) : (
                  <span className="text-vintiga-slate-400">—</span>
                )}
              </TableCell>
              <TableCell>
                {entry.description ?? <span className="text-vintiga-slate-400">—</span>}
              </TableCell>
              <TableCell className="text-right font-medium whitespace-nowrap">
                <span className={negative ? 'text-vintiga-red-700' : 'text-vintiga-green-700'}>
                  {format(entry.amount)}
                </span>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
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
