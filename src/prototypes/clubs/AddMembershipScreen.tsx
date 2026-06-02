import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { RailSection } from '@ds/shared/RightRail'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Radio } from '@ds/shared/Radio'
import { Button } from '@ds/shared/Button'
import { Tag } from '@ds/shared/Tag'
import { type CardBrand } from '@ds/shared/CardBrandLogo'
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
  { value: 'estate',       label: 'Estate' },
  { value: 'tasting-room', label: 'Tasting Room' },
]

// Tasting Credit clubs expose their contribution levels as nested options in
// the club select. Selecting a level resolves to a value like
// `blind-enthusiasm:silver` so the membership row remembers which tier the
// member picked.
interface ClubLevel {
  id: string
  name: string
  amount: number
  cadence: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual'
}
const CLUB_LEVELS: Partial<Record<ClubKey, ClubLevel[]>> = {
  'blind-enthusiasm': [
    { id: 'silver',   name: 'Silver',   amount: 50,  cadence: 'Monthly' },
    { id: 'gold',     name: 'Gold',     amount: 100, cadence: 'Monthly' },
    { id: 'platinum', name: 'Platinum', amount: 250, cadence: 'Monthly' },
  ],
}

/** Parse a club-select value (`"curators"` or `"blind-enthusiasm:silver"`) into
 *  its parts. Returns `null` when the value is the empty placeholder. */
function parseClubSelection(value: string): { clubKey: ClubKey; levelId: string | null } | null {
  if (!value) return null
  const [clubKey, levelId] = value.split(':') as [ClubKey, string | undefined]
  return { clubKey, levelId: levelId ?? null }
}

/** Saved cards a customer might pay with. Mocked — every customer sees the
 *  same two cards for the prototype. */
interface SavedCard {
  id: string
  brand: CardBrand
  last4: string
  expires: string
}
const SAVED_CARDS: SavedCard[] = [
  { id: 'card-92', brand: 'mastercard', last4: '0092', expires: '07/27' },
  { id: 'card-44', brand: 'mastercard', last4: '0044', expires: '08/28' },
]

const MEMBERSHIPS_HASH = '#/web/clubs/memberships'

interface LaunchParams {
  /** Customer pre-selected — Add Membership launched from the customer's view. */
  customerId: string | null
  /** Club pre-selected — Add Membership launched from a specific club's view.
   *  Matches the format used by the club select: `clubKey` or `clubKey:levelId`. */
  clubSelection: string | null
}

function parseLaunchParams(): LaunchParams {
  if (typeof window === 'undefined') return { customerId: null, clubSelection: null }
  const hash = window.location.hash
  const qIdx = hash.indexOf('?')
  if (qIdx === -1) return { customerId: null, clubSelection: null }
  const search = new URLSearchParams(hash.slice(qIdx + 1))
  return {
    customerId:    search.get('customerId'),
    clubSelection: search.get('club'),
  }
}

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

  // Pre-fill customer / club when the operator arrived via a contextual launcher
  // (Customer view → Add Membership, Club view → Add Membership). The query
  // string lives after the hash fragment, e.g. `#/web/clubs/memberships/add?customerId=c-jane`.
  const launchParams = parseLaunchParams()

  const [customer, setCustomer]       = useState(launchParams.customerId ?? '')
  // Club selection holds a flat value matching one of the dropdown options —
  // a club key (`curators`) or `clubKey:levelId` for Tasting Credit levels.
  const [clubSelection, setClubSelection] = useState(launchParams.clubSelection ?? '')
  const [joinDate, setJoinDate]       = useState('')
  // Defaults to the first pickup location — most operators creating a
  // membership are doing it for a customer who'll grab their first
  // shipment in the tasting room. `'shipping'` flips the address picker on.
  // Per-pickup-location options expanded into the radio (no second
  // dropdown) so the operator picks the destination in one step.
  const [deliveryOption, setDeliveryOption] = useState<string>(`pickup:${PICKUP_LOCATIONS[0].value}`)
  const [shipAddress, setShipAddress]       = useState('home')
  const isShipping = deliveryOption === 'shipping'
  const pickedPickupId = isShipping ? null : deliveryOption.slice('pickup:'.length)
  const [newStreet, setNewStreet]     = useState('')
  const [newCity, setNewCity]         = useState('')
  const [newState, setNewState]       = useState('')
  const [newZip, setNewZip]           = useState('')
  const [paymentCardId, setPaymentCardId] = useState<string>(SAVED_CARDS[0].id)

  // Keep the customer / club in sync with hash query params so deep-linking
  // from another tab (e.g. /customers/.../memberships → add) lands here with
  // the right context pre-filled.
  useEffect(() => {
    if (launchParams.customerId)     setCustomer(launchParams.customerId)
    if (launchParams.clubSelection)  setClubSelection(launchParams.clubSelection)
    // We only want this to run for the params captured at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selection = parseClubSelection(clubSelection)
  const clubKey = selection?.clubKey ?? null
  const selectedLevel = selection && selection.levelId
    ? CLUB_LEVELS[selection.clubKey]?.find((l) => l.id === selection.levelId) ?? null
    : null
  const feeInfo = clubKey ? CLUB_FEES[clubKey] : undefined
  // Tasting Credit: the first charge is the chosen level's contribution amount.
  // Curated / Rewards: the static club fee from CLUB_FEES (or zero).
  const fee     = selectedLevel ? selectedLevel.amount : (feeInfo?.fee ?? 0)
  const taxRate = feeInfo?.taxRate ?? 0

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
                clubKey={clubKey}
                levelLabel={selectedLevel ? `${selectedLevel.name} · $${selectedLevel.amount}/${selectedLevel.cadence.toLowerCase()}` : null}
                joinDate={joinDate}
                isShipping={isShipping}
                pickedPickupLabel={pickedPickupId ? PICKUP_LOCATIONS.find((l) => l.value === pickedPickupId)?.label ?? null : null}
              />
            }
          >
            <div className="flex flex-col gap-vintiga-lg">
              <RecordsCard title="Membership" divider={false}>
                <Field label="Customer" required>
                  {launchParams.customerId ? (
                    /* Customer locked when arrived from a customer's view — no
                       reason to re-pick the customer here. */
                    <LockedFieldValue>
                      {CUSTOMERS.find((c) => c.id === launchParams.customerId)?.name ?? launchParams.customerId}
                    </LockedFieldValue>
                  ) : (
                    <Select
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      options={[{ value: '', label: 'Select a customer' }, ...CUSTOMERS.map((c) => ({ value: c.id, label: c.name }))]}
                    />
                  )}
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
                  <Field label="Club" required>
                    {launchParams.clubSelection ? (
                      /* Club locked when arrived from a specific club's view. */
                      <LockedFieldValue>
                        {(() => {
                          const sel = parseClubSelection(launchParams.clubSelection!)
                          if (!sel) return launchParams.clubSelection
                          const club = CLUBS_CATALOG[sel.clubKey]
                          const lvl = sel.levelId ? CLUB_LEVELS[sel.clubKey]?.find((l) => l.id === sel.levelId) : null
                          return lvl ? `${club.name} — ${lvl.name} ($${lvl.amount}/${lvl.cadence.toLowerCase()})` : club.name
                        })()}
                      </LockedFieldValue>
                    ) : (
                      /* Flat dropdown — Tasting Credit levels are listed as
                         individual options ("Blind Enthusiasm — Silver
                         $50/month") so the operator picks the tier in one go
                         without a second step. */
                      <Select
                        value={clubSelection}
                        onChange={(e) => setClubSelection(e.target.value)}
                      >
                        <option value="">Select a club</option>
                        {CLUB_KEYS.flatMap((k) => {
                          const info = CLUBS_CATALOG[k]
                          const levels = CLUB_LEVELS[k]
                          if (levels && levels.length > 0) {
                            return levels.map((lvl) => (
                              <option key={`${k}:${lvl.id}`} value={`${k}:${lvl.id}`}>
                                {info.name} — {lvl.name} (${lvl.amount}/{lvl.cadence.toLowerCase()})
                              </option>
                            ))
                          }
                          return [<option key={k} value={k}>{info.name}</option>]
                        })}
                      </Select>
                    )}
                  </Field>
                  <Field
                    label="Join Date"
                    required
                    helper="Pick any past or future date — backdated signups still create a record on the chosen date."
                  >
                    <input
                      type="date"
                      value={joinDate}
                      onChange={(e) => setJoinDate(e.target.value)}
                      className="h-10 w-full px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                    />
                  </Field>
                </div>
              </RecordsCard>

              <RecordsCard title="Delivery Method" divider={false}>
                {/* One tile per destination. Stacked vertically so each row
                    has room for the full "Pickup — Vintiga Tasting Room
                    (Bellingham)" label without truncation. */}
                <div className="grid grid-cols-1 gap-vintiga-sm">
                  <DeliveryOption
                    selected={isShipping}
                    onClick={() => setDeliveryOption('shipping')}
                    icon={<TruckIcon />}
                    label="Shipping"
                  />
                  {PICKUP_LOCATIONS.map((loc) => {
                    const value = `pickup:${loc.value}`
                    return (
                      <DeliveryOption
                        key={value}
                        selected={deliveryOption === value}
                        onClick={() => setDeliveryOption(value)}
                        icon={<StoreIcon />}
                        label={`Pickup - ${loc.label}`}
                      />
                    )
                  })}
                </div>

                {isShipping && (
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
                        If the customer has no saved address, add one below or pick a Pickup location.
                      </span>
                    </div>
                  </>
                )}

                {isShipping && shipAddress === 'new' && (
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
              </RecordsCard>

              {/* Payment Method — only after a customer is picked. A dropdown
                  keeps the surface compact even when the customer has 4–5
                  cards on file, and once a card is chosen we don't want the
                  other ones cluttering the row. Pre-selected to the
                  customer's default card (the first saved card here). */}
              {customer && (
                <RecordsCard title="Payment Method" divider={false}>
                  <Field label="Card on file" required>
                    <Select
                      value={paymentCardId}
                      onChange={(e) => setPaymentCardId(e.target.value)}
                      options={SAVED_CARDS.map((c) => ({
                        value: c.id,
                        label: `${c.brand[0].toUpperCase() + c.brand.slice(1)} **** ${c.last4} — Expires ${c.expires}`,
                      }))}
                    />
                  </Field>
                </RecordsCard>
              )}

              {/* Order Summary — always shown. Fee-free clubs create a $0 order
                  so the signup is still tracked in sales reporting + the POS. */}
              <RecordsCard title="Order Summary" divider={false}>
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
              </RecordsCard>
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
      <span className={[
        '[&>svg]:w-5 [&>svg]:h-5',
        selected ? 'text-vintiga-indigo-600' : 'text-vintiga-slate-500',
      ].join(' ')}>{icon}</span>
      <span className={[
        'typo-body-sm font-semibold flex-1',
        selected ? 'text-vintiga-indigo-700' : 'text-vintiga-slate-900',
      ].join(' ')}>{label}</span>
      <Radio checked={selected} aria-label={label} />
    </div>
  )
}

// Right-rail summary that mirrors the live form state: club tag + join date +
// delivery method. Fields show "—" until the operator picks a value.
function MembershipDetailsRail({
  clubKey,
  levelLabel,
  joinDate,
  isShipping,
  pickedPickupLabel,
}: {
  clubKey: ClubKey | null
  levelLabel: string | null
  joinDate: string
  isShipping: boolean
  /** When pickup is selected, the human-readable location label. Null when
   *  shipping is selected. */
  pickedPickupLabel: string | null
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
        {levelLabel && (
          <RailRow label="Level">
            <span className="typo-body-sm text-vintiga-slate-700">{levelLabel}</span>
          </RailRow>
        )}
        <RailRow label="Join Date">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-vintiga-slate-400" />
            {formatJoinDate(joinDate)}
          </span>
        </RailRow>
        <RailRow label="Delivery Method">
          <span className="inline-flex items-center gap-1.5">
            {isShipping
              ? <TruckIcon className="w-4 h-4 text-vintiga-slate-400" />
              : <StoreIcon className="w-4 h-4 text-vintiga-slate-400" />}
            {isShipping ? 'Shipping' : (pickedPickupLabel ? `Pickup - ${pickedPickupLabel}` : 'Pickup')}
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

// Read-only field display for locked Customer / Club when the operator
// arrives via a contextual launcher — slightly muted chrome that signals "not
// editable" without showing a disabled-looking input.
function LockedFieldValue({ children }: { children: ReactNode }) {
  return (
    <div className="h-10 px-3 rounded-vintiga-md bg-vintiga-slate-50 border border-vintiga-slate-200 flex items-center typo-body-sm text-vintiga-slate-900">
      {children}
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
