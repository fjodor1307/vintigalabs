import { useState } from 'react'
import { Button } from '@ds/shared/Button'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { Select } from '@ds/shared/Select'
import { Tag } from '@ds/shared/Tag'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@ds/shared/Table'
import { ExternalLinkIcon, ArrowLeftRightIcon } from '@ds/icons/Icons'
import { LOCATIONS, type Location } from './locationsSample'

// ─── TaxesTab ────────────────────────────────────────────────────────────────
// Body of Settings · Taxes. Two stacked sections:
//   1. On-site Tax Rates — per-location fallback rates used by the POS so
//      checkout works offline. Most wineries have one location; multi-location
//      wineries (e.g. tasting rooms in different states) get one row each.
//   2. Shipping Tax Rates — pulled in from Commerce 7 by state. Read-only in
//      Vintiga; the action buttons jump back to C7 or re-sync.

const SHIPPING_STATE_ROWS: { state: string }[] = [
  { state: 'California' },
  { state: 'Maine' },
]

export function TaxesTab() {
  const physical = LOCATIONS.filter((l) => l.kind === 'physical')

  const [country, setCountry] = useState('US')
  const [rates, setRates] = useState<Record<string, string>>(
    Object.fromEntries(physical.map((l) => [l.id, ''])),
  )

  const setRate = (id: string, value: string) =>
    setRates((prev) => ({ ...prev, [id]: value }))

  return (
    <div className="flex flex-col gap-vintiga-lg">
      <div className="flex items-center justify-end gap-vintiga-sm">
        <label className="typo-body-sm text-vintiga-slate-700">Country</label>
        <div className="w-40">
          <Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={[
              { value: 'US', label: 'USA' },
              { value: 'CA', label: 'Canada' },
            ]}
          />
        </div>
      </div>

      <OnSiteRatesCard rows={physical} rates={rates} onChange={setRate} />

      <ShippingRatesCard rows={SHIPPING_STATE_ROWS} />
    </div>
  )
}

// ─── On-site rates (per location, used by POS) ───────────────────────────────

function OnSiteRatesCard({
  rows,
  rates,
  onChange,
}: {
  rows: Location[]
  rates: Record<string, string>
  onChange: (id: string, value: string) => void
}) {
  return (
    <RecordsCard
      title="On-site Tax Rates"
      subtitle="Fallback tax rates used by the POS for each physical location. Stored locally so checkout works while offline."
      divider={false}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Location</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader className="w-48">Tax Rate</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium text-vintiga-slate-900">{l.name}</TableCell>
              <TableCell className="text-vintiga-slate-700">
                {[l.city, l.state, l.zip].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>
                <RateInput
                  value={rates[l.id] ?? ''}
                  onChange={(v) => onChange(l.id, v)}
                  ariaLabel={`Tax rate for ${l.name}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </RecordsCard>
  )
}

function RateInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <div className="flex items-center gap-2 h-10 w-32 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white transition-colors hover:border-vintiga-slate-300 focus-within:border-vintiga-indigo-600 focus-within:ring-2 focus-within:ring-vintiga-indigo-100">
      <input
        aria-label={ariaLabel}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder="0.00"
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        className="flex-1 min-w-0 bg-transparent border-none outline-none typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400"
      />
      <span className="typo-body-sm text-vintiga-slate-500">%</span>
    </div>
  )
}

// ─── Shipping rates (synced from C7) ─────────────────────────────────────────

function ShippingRatesCard({ rows }: { rows: { state: string }[] }) {
  return (
    <RecordsCard
      title={
        <span className="inline-flex items-center gap-vintiga-sm">
          Shipping Tax Rates
          <Tag variant="neutral-light" size="sm">Synced from C7</Tag>
        </span>
      }
      subtitle="Tax rates are automatically pulled from your C7 system."
      action={
        <div className="flex items-center gap-vintiga-sm">
          <Button variant="outline" size="sm" leftIcon={<ExternalLinkIcon />} onClick={() => {}}>
            Edit in C7
          </Button>
          <Button variant="outline" size="sm" leftIcon={<ArrowLeftRightIcon />} onClick={() => {}}>
            Get Rates
          </Button>
        </div>
      }
      divider={false}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>State</TableHeader>
            <TableHeader>Wine</TableHeader>
            <TableHeader>Merchandise</TableHeader>
            <TableHeader>Food</TableHeader>
            <TableHeader>Freight</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.state}>
              <TableCell className="font-medium text-vintiga-slate-900">{r.state}</TableCell>
              <TableCell className="text-vintiga-slate-400">--</TableCell>
              <TableCell className="text-vintiga-slate-400">--</TableCell>
              <TableCell className="text-vintiga-slate-400">--</TableCell>
              <TableCell className="text-vintiga-slate-400">--</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </RecordsCard>
  )
}
