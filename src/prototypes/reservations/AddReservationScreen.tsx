import { useMemo, useState } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Avatar } from '@ds/shared/Avatar'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Textarea } from '@ds/shared/Textarea'
import { SearchIcon, PlusIcon, XIcon, IdCardIcon } from '@ds/icons/Icons'
import { Select, Stepper, TimeField, TextInput, type Option } from './ResControls'

// ─── AddReservationScreen ─────────────────────────────────────────────────────
// New reservation form (Figma 4783-39358 / 40812). Customer picker → reservation
// details → live Reservation Summary rail. Built with Vintiga components.

interface Customer { id: string; name: string; initials: string; club?: string; email: string; avatarUrl?: string }

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Ms Dorothy Ladner', initials: 'DL', club: 'Curators Club', email: 'dorothyladner@gmail.com', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=faces' },
  { id: 'c2', name: 'Charles DeWitte', initials: 'CD', email: 'hilton@vantagehq.com' },
  { id: 'c3', name: 'Maria Alvarez', initials: 'MA', club: 'Vintiga Signature', email: 'maria.alvarez@gmail.com' },
  { id: 'c4', name: 'Devon Lee', initials: 'DL', email: 'devon.lee@gmail.com' },
]

const EXPERIENCES: Option[] = [
  { value: 'private-tasting', label: 'Private Tasting Experience (30mins)' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'wine-tasting', label: 'Wine Tasting' },
  { value: 'vineyard-picnic', label: 'Vineyard Picnic' },
]
const OPTIONS: (Option & { price: number; short: string })[] = [
  { value: 'tasting-35', label: 'Tasting ($35.00 / guest)', price: 35, short: 'Tasting' },
  { value: 'premium-55', label: 'Premium Tasting ($55.00 / guest)', price: 55, short: 'Premium Tasting' },
  { value: 'reserve-75', label: 'Reserve Flight ($75.00 / guest)', price: 75, short: 'Reserve Flight' },
]
const HOSTS: Option[] = [
  { value: 'jim', label: 'Jim Secord' },
  { value: 'donna', label: 'Donna Ataman' },
  { value: 'geoff', label: 'Geoff Spears' },
]
const TABLES: Option[] = [
  { value: '10', label: '10 (1-30)' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
]
const LOCATIONS: Option[] = [
  { value: 'downtown', label: 'Downtown Tasting Room' },
  { value: 'estate', label: 'Estate Tasting Room' },
]

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function AddReservationScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [search, setSearch] = useState('')
  const [experience, setExperience] = useState('private-tasting')
  const [option, setOption] = useState('premium-55')
  const [date, setDate] = useState('Jan 15, 2025')
  const [time, setTime] = useState('2:00')
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM')
  const [guests, setGuests] = useState(2)
  const [host, setHost] = useState('jim')
  const [table, setTable] = useState('10')
  const [location, setLocation] = useState('downtown')
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')

  const opt = OPTIONS.find((o) => o.value === option)
  const total = (opt?.price ?? 0) * guests
  const locLabel = LOCATIONS.find((l) => l.value === location)?.label

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  }, [search])

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileClose={closeMobile} activeNav="Reservations" />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar device="responsive" fixed user={{ name: 'Tom Cook', initials: 'TC' }} onMenuToggle={onMenuToggle} onUserClick={() => {}} onNotificationClick={() => {}} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-vintiga-white">
          <PageTemplate
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/reservations' },
              { label: 'Reservations', href: '#/web/reservations' },
              { label: 'Add Reservation' },
            ]}
            title={
              <div className="flex flex-col gap-0.5">
                <span className="typo-title-screen font-semibold text-vintiga-slate-900">Reservation #1004</span>
                <span className="typo-caption text-vintiga-slate-500 uppercase tracking-wide">Apr 13, 2025 at 5:20 PM</span>
              </div>
            }
            rail={
              <SummaryRail
                customer={customer?.name}
                experience={opt ? `${opt.short} • ${money(opt.price)} per guest` : undefined}
                dateTime={`${date} / ${time} ${period}`}
                guests={`${guests} guest${guests === 1 ? '' : 's'}, ${money(total)}`}
                location={locLabel}
                total={total}
                onCancel={() => { window.location.hash = '#/web/reservations' }}
              />
            }
          >
            <div className="flex flex-col gap-vintiga-lg">
              {/* Customer */}
              {customer ? (
                <div className="flex items-center gap-vintiga-md border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md">
                  <Avatar name={customer.name} initials={customer.initials} src={customer.avatarUrl} size="lg" />
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="typo-body font-semibold text-vintiga-slate-900">{customer.name}</span>
                    {customer.club && (
                      <span className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-indigo-600">
                        <IdCardIcon className="w-4 h-4" />{customer.club}
                      </span>
                    )}
                    <span className="typo-body-sm text-vintiga-slate-700">{customer.email} <span className="text-vintiga-slate-500">| Preferred</span></span>
                  </div>
                  <IconButton variant="outline" size="sm" icon={<XIcon />} aria-label="Clear customer" onClick={() => setCustomer(null)} />
                </div>
              ) : (
                <div className="flex flex-col gap-vintiga-sm">
                  <div className="relative">
                    <TextField placeholder="Search Customers…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<SearchIcon className="w-4 h-4" />} />
                    {results.length > 0 && (
                      <div className="absolute z-20 top-full mt-1 w-full bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-md shadow-vintiga-md overflow-hidden">
                        {results.map((c) => (
                          <button key={c.id} type="button" onClick={() => { setCustomer(c); setSearch('') }}
                            className="w-full flex items-center gap-vintiga-sm px-vintiga-md py-vintiga-sm text-left hover:bg-vintiga-slate-50 transition-colors">
                            <Avatar name={c.name} initials={c.initials} src={c.avatarUrl} size="sm" />
                            <span className="flex flex-col">
                              <span className="typo-body-sm font-medium text-vintiga-slate-900">{c.name}</span>
                              <span className="typo-caption text-vintiga-slate-500">{c.email}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-vintiga-sm">
                    <Button variant="outline" size="sm" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => setCustomer(CUSTOMERS[0])}>Add new customer</Button>
                    <Button variant="outline" size="sm" onClick={() => setCustomer({ id: 'walkin', name: 'Walk-in', initials: 'WI', email: '—' })}>Continue as walk-in</Button>
                  </div>
                </div>
              )}

              {/* Reservation details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                <Field label="Experience"><Select value={experience} onChange={setExperience} options={EXPERIENCES} /></Field>
                <Field label="Option"><Select value={option} onChange={setOption} options={OPTIONS} /></Field>
              </div>

              <div className="flex flex-col md:flex-row gap-vintiga-md md:items-end">
                <div className="flex-1"><Field label="Date"><TextInput value={date} onChange={(e) => setDate(e.target.value)} /></Field></div>
                <Field label="Time"><TimeField time={time} period={period} onTime={setTime} onPeriod={setPeriod} /></Field>
                <Field label="Guests"><Stepper value={guests} onChange={setGuests} /></Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                <Field label="Set Host"><Select value={host} onChange={setHost} options={HOSTS} placeholder="None" /></Field>
                <Field label="Table"><Select value={table} onChange={setTable} options={TABLES} /></Field>
              </div>

              <Field label="Location"><Select value={location} onChange={setLocation} options={LOCATIONS} /></Field>

              <Field label="What's the occasion?" helper="Optional"><TextInput value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="Birthday, Anniversary, etc." /></Field>

              <Field label="Internal Notes"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal Notes (not visible to customer)" /></Field>
            </div>
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}

function SummaryRail({
  customer, experience, dateTime, guests, location, total, onCancel,
}: {
  customer?: string; experience?: string; dateTime?: string; guests?: string; location?: string; total: number; onCancel: () => void
}) {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-lg flex flex-col gap-vintiga-md">
      <h3 className="typo-title-subsection font-semibold text-vintiga-slate-900">Reservation Summary</h3>
      <div className="flex flex-col gap-vintiga-md">
        <SummaryRow label="Customer">{customer}</SummaryRow>
        <SummaryRow label="Experience">{experience}</SummaryRow>
        <SummaryRow label="Date & Time">{dateTime}</SummaryRow>
        <SummaryRow label="Guests">{guests}</SummaryRow>
        <SummaryRow label="Location">{location}</SummaryRow>
      </div>
      <div className="flex items-center justify-end gap-vintiga-sm pt-vintiga-sm border-t border-vintiga-slate-200">
        <span className="typo-body font-semibold text-vintiga-slate-900">Total: {money(total)}</span>
      </div>
      <div className="rounded-vintiga-md bg-vintiga-slate-50 p-vintiga-md flex flex-col gap-vintiga-sm">
        <div className="flex items-center justify-between typo-caption text-vintiga-slate-600">
          <span>Guest Capacity</span><span>30 / 40 guests</span>
        </div>
        <div className="h-2 rounded-full bg-vintiga-slate-200 overflow-hidden">
          <div className="h-full bg-vintiga-primary rounded-full" style={{ width: '75%' }} />
        </div>
      </div>
      <div className="flex flex-col gap-vintiga-sm">
        <Button fullWidth onClick={() => {}}>Reserve {money(total)}</Button>
        <Button variant="outline" fullWidth onClick={onCancel}>Cancel</Button>
      </div>
    </section>
  )
}

function SummaryRow({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="typo-caption text-vintiga-slate-500">{label}</span>
      <span className="typo-body-sm font-medium text-vintiga-slate-900">{children || '—'}</span>
    </div>
  )
}
