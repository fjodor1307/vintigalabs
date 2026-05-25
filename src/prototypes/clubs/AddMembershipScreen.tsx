import { useMemo, useState, type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { SectionCard } from '@ds/shared/SectionCard'
import { RailSection } from '@ds/shared/RightRail'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Radio } from '@ds/shared/Radio'
import { Button } from '@ds/shared/Button'
import { Tag } from '@ds/shared/Tag'
import { InfoIcon, CalendarIcon, TruckIcon, StoreIcon } from '@ds/icons/Icons'
import { CLUBS_CATALOG, CLUB_KEYS, type ClubKey, type ClubKind } from './clubsCatalog'

// ─── AddMembershipScreen ──────────────────────────────────────────────────────
// Full page (not a modal) launched from the "Add" button on the Memberships tab
// — promoted to a page so that after creating, the operator lands on the new
// membership in edit mode and so we have room to add on-the-fly customer/address
// creation later. Enrols a customer into a club:
//   • pick customer + club + join date
//   • choose delivery method (shipping → address, pickup → location)
//   • pick an existing address or add a new one
// Every membership creates an order for tracking — a fee club creates a paid
// order, a fee-free club a $0 order. The prototype has no backend, so submit
// just returns to the list.

// Sample customers an operator can enrol. In production this is a typeahead
// against the customer directory.
const CUSTOMERS = [
  { id: 'c-jane',    name: 'Jane Davis' },
  { id: 'c-leslie',  name: 'Leslie Alexander' },
  { id: 'c-phoenix', name: 'Phoenix Baker' },
  { id: 'c-marvin',  name: 'Marvin McKinney' },
]

// Per-club initial fee. Clubs absent from this map have no fee — a $0 order is
// still created for tracking.
const CLUB_FEES: Partial<Record<ClubKey, { fee: number; taxRate: number }>> = {
  'vintiga-signature': { fee: 120, taxRate: 8 },
  'curators':          { fee: 50,  taxRate: 0 },
}

const SAVED_ADDRESSES = [
  { value: 'home',   label: '1210 Lakeview Street, Bellingham, WA 98229' },
  { value: 'office', label: '500 Market Street, San Francisco, CA 94110' },
]

const PICKUP_LOCATIONS = [
  { value: 'tasting-room', label: 'Vintiga Tasting Room — Bellingham' },
  { value: 'downtown',     label: 'Vintiga Downtown — Seattle' },
]

const CLUB_OPTIONS = [
  { value: '', label: 'Select a club' },
  ...CLUB_KEYS.map((k) => ({ value: k, label: CLUBS_CATALOG[k].name })),
]

const MEMBERSHIPS_HASH = '#/web/clubs/memberships'
const todayISO = new Date().toISOString().slice(0, 10)

function clubTagTone(kind: ClubKind): 'violet' | 'teal' | 'orange' | 'default' {
  switch (kind) {
    case 'curated':        return 'violet'
    case 'account-credit': return 'teal'
    case 'membership':     return 'orange'
    default:               return 'default'
  }
}

function formatJoinDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function AddMembershipScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  const [customer, setCustomer]       = useState('')
  const [club, setClub]               = useState<ClubKey | ''>('')
  const [joinDate, setJoinDate]       = useState('')
  const [delivery, setDelivery]       = useState<'shipping' | 'pickup'>('shipping')
  const [shipAddress, setShipAddress] = useState('home')
  const [pickupLoc, setPickupLoc]     = useState('tasting-room')
  const [newStreet, setNewStreet]     = useState('')
  const [newCity, setNewCity]         = useState('')
  const [newState, setNewState]       = useState('')
  const [newZip, setNewZip]           = useState('')

  const feeInfo = club ? CLUB_FEES[club] : undefined
  const fee     = feeInfo?.fee ?? 0
  const taxRate = feeInfo?.taxRate ?? 0
  // Tasting-credit clubs charge the customer on the join date, so the join date
  // can't be backdated — it must be today or later. Curated / membership clubs
  // allow any date (incl. the past) for backfilling historical signups.
  const isTastingCredit = !!club && CLUBS_CATALOG[club].kind === 'account-credit'

  const total = useMemo(() => fee + (fee * taxRate) / 100, [fee, taxRate])

  function close() { window.location.hash = MEMBERSHIPS_HASH }
  function createMembership() {
    // In production: create the order (paid if there's a fee, $0 otherwise) +
    // the membership, then route to the new membership in edit mode. Prototype
    // just returns to the list.
    close()
  }

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Clubs"
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
        <div className="flex-1 overflow-y-auto pt-16 bg-vintiga-white">
          <PageTemplate
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/clubs' },
              { label: 'Clubs',       href: '#/web/clubs' },
              { label: 'Memberships', href: MEMBERSHIPS_HASH },
              { label: 'Add Membership' },
            ]}
            title="Add Membership"
            actions={
              <>
                <Button variant="outline" onClick={close}>Cancel</Button>
                <Button onClick={createMembership}>Create Membership</Button>
              </>
            }
            rail={
              <MembershipDetailsRail
                clubKey={club || null}
                joinDate={joinDate}
                delivery={delivery}
              />
            }
          >
            <div className="flex flex-col gap-vintiga-lg">
              <SectionCard title="Membership">
                <Field label="Customer" required>
                  <Select
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    options={[{ value: '', label: 'Select a customer' }, ...CUSTOMERS.map((c) => ({ value: c.id, label: c.name }))]}
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
                  <Field label="Club" required>
                    <Select
                      value={club}
                      onChange={(e) => setClub(e.target.value as ClubKey | '')}
                      options={CLUB_OPTIONS}
                    />
                  </Field>
                  <Field
                    label="Join Date"
                    required
                    helper={isTastingCredit
                      ? 'Tasting Credit clubs are charged on the join date, so it must be today or later.'
                      : 'Can be backdated to record an existing signup.'}
                  >
                    <input
                      type="date"
                      value={joinDate}
                      min={isTastingCredit ? todayISO : undefined}
                      onChange={(e) => setJoinDate(e.target.value)}
                      className="h-10 w-full px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Delivery Method">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
                  <DeliveryOption
                    selected={delivery === 'shipping'}
                    onClick={() => setDelivery('shipping')}
                    icon={<TruckIcon />}
                    label="Shipping"
                  />
                  <DeliveryOption
                    selected={delivery === 'pickup'}
                    onClick={() => setDelivery('pickup')}
                    icon={<StoreIcon />}
                    label="Pickup"
                  />
                </div>

                {delivery === 'shipping' ? (
                  <>
                    <Field label="Shipping Address" required>
                      <Select
                        value={shipAddress}
                        onChange={(e) => setShipAddress(e.target.value)}
                        options={[...SAVED_ADDRESSES, { value: 'new', label: '+ Add new address' }]}
                      />
                    </Field>
                    <div className="flex items-start gap-vintiga-sm rounded-vintiga-md bg-vintiga-slate-50 px-vintiga-md py-vintiga-sm">
                      <InfoIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0 mt-0.5" />
                      <span className="typo-caption text-vintiga-slate-500">
                        If the customer has no saved address, add one below or switch to Pickup.
                      </span>
                    </div>
                  </>
                ) : (
                  <Field label="Pickup Location" required>
                    <Select
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      options={PICKUP_LOCATIONS}
                    />
                  </Field>
                )}

                {delivery === 'shipping' && shipAddress === 'new' && (
                  <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md flex flex-col gap-vintiga-md">
                    <Field label="Street Address" required>
                      <TextField value={newStreet} onChange={(e) => setNewStreet(e.target.value)} placeholder="123 Main Street" />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
                      <Field label="City" required>
                        <TextField value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="City" />
                      </Field>
                      <Field label="State" required>
                        <TextField value={newState} onChange={(e) => setNewState(e.target.value)} placeholder="State" />
                      </Field>
                      <Field label="ZIP" required>
                        <TextField value={newZip} onChange={(e) => setNewZip(e.target.value)} placeholder="ZIP" />
                      </Field>
                    </div>
                  </div>
                )}
              </SectionCard>

              {/* Order Summary — always shown. Fee-free clubs create a $0 order
                  so the signup is still tracked in sales reporting + the POS. */}
              <SectionCard title="Order Summary">
                <div className="flex flex-col gap-vintiga-sm">
                  <SummaryRow label="Membership Fee" value={fee > 0 ? `$${fee.toFixed(2)}` : 'No fee'} />
                  <SummaryRow label={`Tax (${taxRate}%)`} value={`$${((fee * taxRate) / 100).toFixed(2)}`} />
                  <div className="border-t border-vintiga-slate-200 pt-vintiga-sm">
                    <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
                  </div>
                </div>
                <div className="flex items-start gap-vintiga-sm rounded-vintiga-md bg-vintiga-indigo-50 px-vintiga-md py-vintiga-sm">
                  <InfoIcon className="w-4 h-4 text-vintiga-indigo-500 shrink-0 mt-0.5" />
                  <span className="typo-body-sm text-vintiga-indigo-700">
                    {fee > 0
                      ? 'This club has an initial membership fee — a paid order is created with the membership.'
                      : 'No membership fee — a $0 order is still created so the signup is tracked.'}
                  </span>
                </div>
              </SectionCard>
            </div>
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}

function DeliveryOption({ selected, onClick, icon, label }: { selected: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className={[
        'flex items-center gap-vintiga-md p-vintiga-md rounded-vintiga-lg border text-left transition-colors cursor-pointer',
        selected
          ? 'border-vintiga-indigo-500 bg-vintiga-indigo-50'
          : 'border-vintiga-slate-200 hover:border-vintiga-slate-300',
      ].join(' ')}
    >
      <Radio checked={selected} aria-label={label} />
      <span className="text-vintiga-slate-500 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
    </div>
  )
}

// Right-rail summary that mirrors the live form state: club tag + join date +
// delivery method. Fields show "—" until the operator picks a value.
function MembershipDetailsRail({
  clubKey,
  joinDate,
  delivery,
}: {
  clubKey: ClubKey | null
  joinDate: string
  delivery: 'shipping' | 'pickup'
}) {
  const club = clubKey ? CLUBS_CATALOG[clubKey] : null
  return (
    <RailSection title="Membership Details">
      <div className="flex flex-col gap-vintiga-md">
        <RailRow label="Club">
          {club ? (
            <Tag variant="filled" tone={clubTagTone(club.kind)} size="sm">{club.type}</Tag>
          ) : (
            <span className="text-vintiga-slate-400">—</span>
          )}
        </RailRow>
        <RailRow label="Join Date">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-vintiga-slate-400" />
            {formatJoinDate(joinDate)}
          </span>
        </RailRow>
        <RailRow label="Delivery Method">
          <span className="inline-flex items-center gap-1.5">
            {delivery === 'shipping' ? <TruckIcon className="w-4 h-4 text-vintiga-slate-400" /> : <StoreIcon className="w-4 h-4 text-vintiga-slate-400" />}
            {delivery === 'shipping' ? 'Shipping' : 'Pickup'}
          </span>
        </RailRow>
      </div>
    </RailSection>
  )
}

function RailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-vintiga-xs">
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-700">{children}</span>
    </div>
  )
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-vintiga-md">
      <span className={`typo-body-sm ${bold ? 'font-semibold text-vintiga-slate-900' : 'text-vintiga-slate-600'}`}>{label}</span>
      <span className={`typo-body-sm ${bold ? 'font-semibold text-vintiga-slate-900' : 'text-vintiga-slate-900'}`}>{value}</span>
    </div>
  )
}
