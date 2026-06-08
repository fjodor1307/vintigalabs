import { useMemo, useState } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { KpiCard } from '@ds/shared/KpiCard'
import { Avatar } from '@ds/shared/Avatar'
import { Tag } from '@ds/shared/Tag'
import { Select } from '@ds/shared/Select'
import { TextField } from '@ds/shared/TextField'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@ds/shared/Table'
import {
  DollarIcon,
  CalendarIcon,
  UserIcon,
  TrendUpIcon,
  SearchIcon,
} from '@ds/icons/Icons'
import { getCurrentClubSlug } from './clubsCatalog'

// ─── ClubViewChargesScreen ───────────────────────────────────────────────────
// "What revenue is this club generating?" Per the Jun 4 design review, a
// Tasting Credit club needs a per-club charge history that's separate from
// the customer's account-balance view (which mixes every credit-card hit
// across products + clubs + adjustments). This tab answers Donna's question:
// how much has this specific club brought in over its lifetime, month by
// month, with returns/credits backed out.
//
// Per-membership "how many months has this member been charged + total" is
// reachable by tapping a row → MembershipDetailScreen (built later). The
// data model is intentionally simple — `Charge[]` keyed by month + member +
// level, so we can roll up by level / month / member without precomputing.

type ChargeStatus = 'charged' | 'failed' | 'refunded'

interface Charge {
  id: string
  date: string            // ISO yyyy-mm-dd — the day the card was hit
  memberId: string
  memberName: string
  memberPhoto?: string
  level: string           // 'Silver' | 'Gold' | 'Platinum' — denormalised for display
  amount: number          // contribution amount in dollars
  status: ChargeStatus
}

// Six months of charges across five members. Mocked — real data lives on
// the membership store. Order doesn't matter; the table sorts by date desc.
const SAMPLE_CHARGES: Charge[] = [
  // June
  { id: 'ch-2026-06-1001', date: '2026-06-01', memberId: '1001', memberName: 'Jane Davis',       memberPhoto: 'https://i.pravatar.cc/64?img=47', level: 'Gold',     amount: 100, status: 'charged'  },
  { id: 'ch-2026-06-1002', date: '2026-06-01', memberId: '1002', memberName: 'Leslie Alexander', memberPhoto: 'https://i.pravatar.cc/64?img=12', level: 'Platinum', amount: 250, status: 'charged'  },
  { id: 'ch-2026-06-1003', date: '2026-06-01', memberId: '1003', memberName: 'Phoenix Baker',    memberPhoto: 'https://i.pravatar.cc/64?img=22', level: 'Silver',   amount: 50,  status: 'charged'  },
  { id: 'ch-2026-06-1005', date: '2026-06-01', memberId: '1005', memberName: 'Robert Fox',                                                       level: 'Gold',     amount: 100, status: 'failed'   },

  // May
  { id: 'ch-2026-05-1001', date: '2026-05-01', memberId: '1001', memberName: 'Jane Davis',       memberPhoto: 'https://i.pravatar.cc/64?img=47', level: 'Gold',     amount: 100, status: 'charged'  },
  { id: 'ch-2026-05-1002', date: '2026-05-01', memberId: '1002', memberName: 'Leslie Alexander', memberPhoto: 'https://i.pravatar.cc/64?img=12', level: 'Platinum', amount: 250, status: 'charged'  },
  { id: 'ch-2026-05-1003', date: '2026-05-01', memberId: '1003', memberName: 'Phoenix Baker',    memberPhoto: 'https://i.pravatar.cc/64?img=22', level: 'Silver',   amount: 50,  status: 'charged'  },
  { id: 'ch-2026-05-1005', date: '2026-05-01', memberId: '1005', memberName: 'Robert Fox',                                                       level: 'Gold',     amount: 100, status: 'refunded' },

  // April
  { id: 'ch-2026-04-1001', date: '2026-04-01', memberId: '1001', memberName: 'Jane Davis',       memberPhoto: 'https://i.pravatar.cc/64?img=47', level: 'Gold',     amount: 100, status: 'charged'  },
  { id: 'ch-2026-04-1002', date: '2026-04-01', memberId: '1002', memberName: 'Leslie Alexander', memberPhoto: 'https://i.pravatar.cc/64?img=12', level: 'Platinum', amount: 250, status: 'charged'  },
  { id: 'ch-2026-04-1003', date: '2026-04-01', memberId: '1003', memberName: 'Phoenix Baker',    memberPhoto: 'https://i.pravatar.cc/64?img=22', level: 'Silver',   amount: 50,  status: 'charged'  },
  { id: 'ch-2026-04-1004', date: '2026-04-01', memberId: '1004', memberName: 'Dorothy Ladner',   memberPhoto: 'https://i.pravatar.cc/64?img=32', level: 'Silver',   amount: 50,  status: 'charged'  },
  { id: 'ch-2026-04-1005', date: '2026-04-01', memberId: '1005', memberName: 'Robert Fox',                                                       level: 'Gold',     amount: 100, status: 'charged'  },

  // March
  { id: 'ch-2026-03-1001', date: '2026-03-01', memberId: '1001', memberName: 'Jane Davis',       memberPhoto: 'https://i.pravatar.cc/64?img=47', level: 'Gold',     amount: 100, status: 'charged'  },
  { id: 'ch-2026-03-1002', date: '2026-03-01', memberId: '1002', memberName: 'Leslie Alexander', memberPhoto: 'https://i.pravatar.cc/64?img=12', level: 'Platinum', amount: 250, status: 'charged'  },
  { id: 'ch-2026-03-1003', date: '2026-03-01', memberId: '1003', memberName: 'Phoenix Baker',    memberPhoto: 'https://i.pravatar.cc/64?img=22', level: 'Silver',   amount: 50,  status: 'charged'  },
  { id: 'ch-2026-03-1004', date: '2026-03-01', memberId: '1004', memberName: 'Dorothy Ladner',   memberPhoto: 'https://i.pravatar.cc/64?img=32', level: 'Silver',   amount: 50,  status: 'charged'  },

  // February
  { id: 'ch-2026-02-1001', date: '2026-02-01', memberId: '1001', memberName: 'Jane Davis',       memberPhoto: 'https://i.pravatar.cc/64?img=47', level: 'Gold',     amount: 100, status: 'charged' },
  { id: 'ch-2026-02-1002', date: '2026-02-01', memberId: '1002', memberName: 'Leslie Alexander', memberPhoto: 'https://i.pravatar.cc/64?img=12', level: 'Platinum', amount: 250, status: 'charged' },
  { id: 'ch-2026-02-1003', date: '2026-02-01', memberId: '1003', memberName: 'Phoenix Baker',    memberPhoto: 'https://i.pravatar.cc/64?img=22', level: 'Silver',   amount: 50,  status: 'charged' },

  // January (kickoff month — fewer members)
  { id: 'ch-2026-01-1001', date: '2026-01-01', memberId: '1001', memberName: 'Jane Davis',       memberPhoto: 'https://i.pravatar.cc/64?img=47', level: 'Gold',     amount: 100, status: 'charged' },
  { id: 'ch-2026-01-1002', date: '2026-01-01', memberId: '1002', memberName: 'Leslie Alexander', memberPhoto: 'https://i.pravatar.cc/64?img=12', level: 'Platinum', amount: 250, status: 'charged' },
]

type MonthFilter = 'all' | '6m' | '3m' | 'this-month'
const TODAY = new Date('2026-06-12') // mock "now" so the demo stays deterministic

function monthKey(iso: string) { return iso.slice(0, 7) }
function monthLabel(yyyyMm: string): string {
  const [yyyy, mm] = yyyyMm.split('-')
  return new Date(Number(yyyy), Number(mm) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatMoney(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function statusTag(s: ChargeStatus) {
  if (s === 'charged')  return <Tag tone="success" size="sm">Charged</Tag>
  if (s === 'failed')   return <Tag tone="danger"  size="sm">Failed</Tag>
  return <Tag tone="default" size="sm">Refunded</Tag>
}

export function ClubViewChargesScreen() {
  const slug = getCurrentClubSlug()
  const memberHref = (id: string) => `#/web/clubs/memberships/${id}`

  const [monthFilter, setMonthFilter] = useState<MonthFilter>('6m')
  const [statusFilter, setStatusFilter] = useState<'all' | ChargeStatus>('all')
  const [query, setQuery] = useState('')

  // Apply filters in order: window → status → name search.
  const filtered = useMemo(() => {
    const cutoff = (() => {
      const d = new Date(TODAY)
      if (monthFilter === '3m')         d.setMonth(d.getMonth() - 3)
      else if (monthFilter === '6m')    d.setMonth(d.getMonth() - 6)
      else if (monthFilter === 'this-month') d.setDate(1)
      else                              return null
      return d.toISOString().slice(0, 10)
    })()
    return SAMPLE_CHARGES
      .filter((c) => (cutoff ? c.date >= cutoff : true))
      .filter((c) => (statusFilter === 'all' ? true : c.status === statusFilter))
      .filter((c) => (query.trim() ? c.memberName.toLowerCase().includes(query.trim().toLowerCase()) : true))
      .sort((a, b) => (b.date.localeCompare(a.date) || a.memberName.localeCompare(b.memberName)))
  }, [monthFilter, statusFilter, query])

  // Roll-ups for the KPI strip — gross is every successful charge, net backs
  // out refunds (so the headline matches the "without store credits or
  // returns" framing from the review).
  const stats = useMemo(() => {
    const gross   = filtered.filter((c) => c.status === 'charged').reduce((s, c) => s + c.amount, 0)
    const refunds = filtered.filter((c) => c.status === 'refunded').reduce((s, c) => s + c.amount, 0)
    const net     = gross - refunds
    const months  = new Set(filtered.map((c) => monthKey(c.date))).size
    const members = new Set(filtered.filter((c) => c.status !== 'failed').map((c) => c.memberId)).size
    const avgPerMonth = months > 0 ? Math.round(net / months) : 0
    return { gross, refunds, net, months, members, avgPerMonth }
  }, [filtered])

  // By-month breakdown — supports "5 months charged · total amount" per Jim's
  // line. Iterates the filtered set, groups by month, sums net.
  const byMonth = useMemo(() => {
    const map = new Map<string, { gross: number; refunded: number; chargedCount: number; failedCount: number }>()
    for (const c of filtered) {
      const key = monthKey(c.date)
      const row = map.get(key) ?? { gross: 0, refunded: 0, chargedCount: 0, failedCount: 0 }
      if (c.status === 'charged')  { row.gross += c.amount; row.chargedCount += 1 }
      if (c.status === 'refunded') { row.refunded += c.amount }
      if (c.status === 'failed')   { row.failedCount += 1 }
      map.set(key, row)
    }
    return Array.from(map.entries())
      .map(([k, v]) => ({ month: k, ...v, net: v.gross - v.refunded }))
      .sort((a, b) => b.month.localeCompare(a.month))
  }, [filtered])

  // Failed charges deserve a head-of-page nudge — operators need to chase
  // these so the club doesn't bleed members silently.
  const failedCount = filtered.filter((c) => c.status === 'failed').length

  return (
    <ClubViewLayout activeTab="charges">
      <div className="flex flex-col gap-vintiga-lg">

        {/* ── KPI strip ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
          <KpiCard
            size="sm"
            label="Total charged (net)"
            value={formatMoney(stats.net)}
            icon={<DollarIcon />}
          />
          <KpiCard
            size="sm"
            label="Months active"
            value={String(stats.months)}
            icon={<CalendarIcon />}
          />
          <KpiCard
            size="sm"
            label="Avg per month"
            value={formatMoney(stats.avgPerMonth)}
            icon={<TrendUpIcon />}
          />
          <KpiCard
            size="sm"
            label="Contributing members"
            value={String(stats.members)}
            icon={<UserIcon />}
            href={`#/web/clubs/view/${slug}/members`}
          />
        </div>

        {/* ── By-month breakdown ─────────────────────────────────────── */}
        <RecordsCard
          title="By month"
          subtitle="Net = gross charges minus refunds. Excludes failed charges from the totals (they show as a count for follow-up)."
          divider={false}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Month</TableHeader>
                <TableHeader>Successful charges</TableHeader>
                <TableHeader>Gross</TableHeader>
                <TableHeader>Refunds</TableHeader>
                <TableHeader>Net</TableHeader>
                <TableHeader>Failed</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {byMonth.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium text-vintiga-slate-900">{monthLabel(row.month)}</TableCell>
                  <TableCell className="text-vintiga-slate-700">{row.chargedCount}</TableCell>
                  <TableCell className="text-vintiga-slate-700">{formatMoney(row.gross)}</TableCell>
                  <TableCell className="text-vintiga-slate-700">
                    {row.refunded > 0
                      ? <span className="text-vintiga-red-700">−{formatMoney(row.refunded)}</span>
                      : <span className="text-vintiga-slate-400">—</span>}
                  </TableCell>
                  <TableCell className="font-semibold text-vintiga-slate-900">{formatMoney(row.net)}</TableCell>
                  <TableCell>
                    {row.failedCount > 0
                      ? <Tag tone="danger" size="sm">{row.failedCount} failed</Tag>
                      : <span className="text-vintiga-slate-400">—</span>}
                  </TableCell>
                </TableRow>
              ))}
              {byMonth.length === 0 && (
                <TableRow>
                  <TableCell className="text-vintiga-slate-500 py-vintiga-md">
                    No charges in this window.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </RecordsCard>

        {/* ── Charge log ─────────────────────────────────────────────── */}
        <RecordsCard
          title="Charge log"
          subtitle={
            failedCount > 0
              ? `${failedCount} failed ${failedCount === 1 ? 'charge needs' : 'charges need'} follow-up. Tap a member to open their membership.`
              : 'Every charge against a Tasting Credit level. Tap a member to open their membership.'
          }
          divider={false}
        >
          <div className="flex flex-wrap items-center gap-vintiga-sm">
            <div className="flex-1 min-w-[220px]">
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search member name"
                leftIcon={<SearchIcon className="w-4 h-4" />}
              />
            </div>
            <Select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value as MonthFilter)}
              options={[
                { value: 'this-month', label: 'This month' },
                { value: '3m',         label: 'Last 3 months' },
                { value: '6m',         label: 'Last 6 months' },
                { value: 'all',        label: 'All time' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | ChargeStatus)}
              options={[
                { value: 'all',      label: 'All statuses' },
                { value: 'charged',  label: 'Charged' },
                { value: 'failed',   label: 'Failed' },
                { value: 'refunded', label: 'Refunded' },
              ]}
            />
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Date</TableHeader>
                <TableHeader>Member</TableHeader>
                <TableHeader>Level</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} onClick={() => { window.location.hash = memberHref(c.memberId) }}>
                  <TableCell className="text-vintiga-slate-700">{monthLabel(monthKey(c.date))}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-vintiga-sm">
                      <Avatar name={c.memberName} src={c.memberPhoto} size="sm" />
                      <span className="font-medium text-vintiga-slate-900">{c.memberName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tag tone="violet" size="sm">{c.level}</Tag>
                  </TableCell>
                  <TableCell className={
                    c.status === 'refunded'
                      ? 'text-vintiga-red-700'
                      : c.status === 'failed'
                        ? 'text-vintiga-slate-400 line-through'
                        : 'font-semibold text-vintiga-slate-900'
                  }>
                    {c.status === 'refunded' ? `−${formatMoney(c.amount)}` : formatMoney(c.amount)}
                  </TableCell>
                  <TableCell>{statusTag(c.status)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell className="text-vintiga-slate-500 py-vintiga-md">
                    No charges match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </RecordsCard>
      </div>
    </ClubViewLayout>
  )
}
