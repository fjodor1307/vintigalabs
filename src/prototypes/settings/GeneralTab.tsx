import { useState } from 'react'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Switch } from '@ds/shared/Switch'
import { ImageIcon } from '@ds/icons/Icons'

// ─── GeneralTab ──────────────────────────────────────────────────────────────
// Body of Settings · General (Figma 3471:89875). Two side-by-side cards:
//   1. Business Information — store identity, branding and contact details the
//      POS and receipts read from (name, type, receipt logo name, logo upload,
//      phone / email, website).
//   2. System Information — account-wide defaults (time zone, date format,
//      currency) plus the read-only lifecycle timestamps C7 stamps on the
//      account (created / updated / activated / cancelled / inactivated).
// Stacks to one column below lg.

const BUSINESS_TYPES = [
  { value: 'winery',     label: 'Winery' },
  { value: 'distillery', label: 'Distillery' },
  { value: 'brewery',    label: 'Brewery' },
  { value: 'cidery',     label: 'Cidery' },
  { value: 'meadery',    label: 'Meadery' },
]

const TIME_ZONES = [
  { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT)' },
  { value: 'America/Denver',      label: 'America/Denver (MST/MDT)' },
  { value: 'America/Chicago',     label: 'America/Chicago (CST/CDT)' },
  { value: 'America/New_York',    label: 'America/New York (EST/EDT)' },
]

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
]

// Read-only lifecycle timestamps — owned by C7, surfaced here for the audit
// trail. `null` renders as a muted "Not set".
const SYSTEM_TIMESTAMPS: { label: string; value: string | null }[] = [
  { label: 'Created At',     value: '1/15/2024, 11:30:00 AM' },
  { label: 'Updated At',     value: '12/20/2024, 3:22:00 PM' },
  { label: 'Activated At',   value: '1/20/2024, 10:15:00 AM' },
  { label: 'Cancelled At',   value: null },
  { label: 'Inactivated At', value: null },
]

export function GeneralTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-vintiga-lg items-start">
      <BusinessInformationCard />
      <SystemInformationCard />
    </div>
  )
}

// ─── Business Information ─────────────────────────────────────────────────────

function BusinessInformationCard() {
  const [name, setName]         = useState('Vintiga Winery')
  const [type, setType]         = useState('winery')
  const [logoName, setLogoName] = useState('Vintiga Winery')
  const [logoOn, setLogoOn]     = useState(true)
  const [phone, setPhone]       = useState('(555) 123-4567')
  const [email, setEmail]       = useState('info@vintigawinery.com')
  const [website, setWebsite]   = useState('https://www.vintiga.com')

  return (
    <RecordsCard
      title="Business Information"
      subtitle="Update your business details and contact information"
      divider={false}
    >
      <Field label="Business Name">
        <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="Business name" />
      </Field>

      <Field label="Business Type">
        <Select value={type} onChange={(e) => setType(e.target.value)} options={BUSINESS_TYPES} />
      </Field>

      <Field label="Logo Name (for receipts)">
        <TextField value={logoName} onChange={(e) => setLogoName(e.target.value)} placeholder="Name printed on receipts" />
      </Field>

      <Field
        label="Business Logo"
        action={<Switch checked={logoOn} onChange={setLogoOn} aria-label="Show business logo" />}
      >
        {logoOn ? (
          <LogoDropzone />
        ) : (
          <p className="typo-body-sm text-vintiga-slate-500">Logo hidden from receipts and checkout.</p>
        )}
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
        <Field label="Phone">
          <TextField value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
        </Field>
        <Field label="Email">
          <TextField value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </Field>
      </div>

      <Field label="Website">
        <TextField value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://www.example.com" />
      </Field>
    </RecordsCard>
  )
}

function LogoDropzone() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-vintiga-md border border-dashed border-vintiga-slate-300 bg-vintiga-slate-50 px-vintiga-lg py-vintiga-xl text-center">
      <span className="text-vintiga-slate-400 [&>svg]:w-8 [&>svg]:h-8"><ImageIcon /></span>
      <p className="typo-body-sm text-vintiga-slate-500">
        <button
          type="button"
          onClick={() => {}}
          className="font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 bg-transparent border-none p-0 cursor-pointer"
        >
          Upload
        </button>{' '}
        a file or drag and drop
      </p>
      <p className="typo-caption text-vintiga-slate-400">PNG, JPG, GIF up to 2MB</p>
    </div>
  )
}

// ─── System Information ───────────────────────────────────────────────────────

function SystemInformationCard() {
  const [timeZone, setTimeZone]     = useState('America/Los_Angeles')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [currency, setCurrency]     = useState('USD')

  return (
    <RecordsCard
      title="System Information"
      subtitle="Configure system-wide settings and defaults"
      divider={false}
    >
      <Field label="Time Zone">
        <Select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} options={TIME_ZONES} />
      </Field>

      <Field label="Date Format">
        <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} options={DATE_FORMATS} />
      </Field>

      <Field label="Currency">
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)} options={CURRENCIES} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md pt-vintiga-sm border-t border-vintiga-slate-100">
        {SYSTEM_TIMESTAMPS.map((t) => (
          <ReadOnlyField key={t.label} label={t.label} value={t.value} />
        ))}
      </div>
    </RecordsCard>
  )
}

// Read-only audit row — muted label + a disabled-looking value box. A `null`
// value renders as a lighter "Not set".
function ReadOnlyField({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="typo-body-sm font-medium text-vintiga-slate-400">{label}</span>
      <div className="h-10 px-3 flex items-center rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-slate-50">
        <span className={`typo-body-sm ${value ? 'text-vintiga-slate-500' : 'text-vintiga-slate-400'}`}>
          {value ?? 'Not set'}
        </span>
      </div>
    </div>
  )
}
