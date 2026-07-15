import { useMemo, useState, type ReactNode } from 'react'
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
import { Button } from '@ds/shared/Button'
import { DeliveryPicker } from '@ds/shared/DeliveryPicker'
import { PICKUP_LOCATIONS, deliveryLabel, formatAddressLine, type DeliveryAddress, type DeliveryValue } from '@ds/shared/delivery'
import { Tag } from '@ds/shared/Tag'
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalAlertHeader } from '@ds/shared/Modal'
import { type CardBrand } from '@ds/shared/CardBrandLogo'
import { InfoIcon, CalendarIcon, TruckIcon, StoreIcon, PlusIcon, CreditCardIcon } from '@ds/icons/Icons'
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

// The customer's saved addresses. Same set + order as the customer memberships
// surface so delivery looks identical wherever it's edited. PICKUP_LOCATIONS
// comes from the design system (@ds/shared/delivery).
const CLUB_ADDRESSES: DeliveryAddress[] = [
  { id: 'home',   label: 'Home', line: '1210 Lakeview Street, Bellingham, WA 98229' },
  { id: 'office', label: 'Work', line: '500 Market Street, San Francisco, CA 94110' },
]

// Member Choice clubs expose their contribution levels as nested options in
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

/** Saved cards a customer might pay with. Mocked per customer so the operator
 *  sees a realistic "cards on file" list that changes with the selected
 *  customer — picking Marvin (no cards) exercises the no-card → pending path. */
interface SavedCard {
  id: string
  brand: CardBrand
  last4: string
  expires: string
}
const CUSTOMER_CARDS: Record<string, SavedCard[]> = {
  'c-jane':    [
    { id: 'jane-1',   brand: 'mastercard', last4: '0092', expires: '07/27' },
    { id: 'jane-2',   brand: 'mastercard', last4: '0044', expires: '08/28' },
  ],
  'c-leslie':  [{ id: 'leslie-1',  brand: 'visa',       last4: '4242', expires: '05/27' }],
  'c-phoenix': [{ id: 'phoenix-1', brand: 'mastercard', last4: '0044', expires: '08/28' }],
  'c-marvin':  [],
}

// A declined-on-charge test card. Picking the ****0044 card and creating a
// Member Choice membership demonstrates the card-declined → pending landing.
const DECLINE_CARD_LAST4 = '0044'

function cardsForCustomer(id: string): SavedCard[] {
  return CUSTOMER_CARDS[id] ?? []
}

function formatCardLabel(c: SavedCard): string {
  return `${c.brand[0].toUpperCase() + c.brand.slice(1)} **** ${c.last4} — Expires ${c.expires}`
}

/** Short card label for confirmation copy — no expiry. */
function shortCardLabel(c: SavedCard): string {
  return `${c.brand[0].toUpperCase() + c.brand.slice(1)} **** ${c.last4}`
}

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
  // Delivery: one shared model (pickup location OR a saved-address id). Defaults
  // to the first pickup location — most operators enrol someone collecting their
  // first shipment in person. Saved addresses (and a "new address" flow) live in
  // the shared DeliveryPicker below.
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(CLUB_ADDRESSES)
  const [delivery, setDelivery]   = useState<DeliveryValue>({ kind: 'pickup', location: PICKUP_LOCATIONS[0] })
  const isShipping = delivery.kind === 'ship'
  // Cards on file for the selected customer — reloaded whenever the customer
  // changes. Held in local state so the operator can add a card from the inline
  // "Add Payment Method" affordance when the customer has nothing on record;
  // newly-added cards become the default selection so they're charged on submit.
  const initialCards = cardsForCustomer(launchParams.customerId ?? '')
  const [savedCards, setSavedCards] = useState<SavedCard[]>(initialCards)
  const [paymentCardId, setPaymentCardId] = useState<string>(initialCards[0]?.id ?? '')
  const [addCardOpen, setAddCardOpen] = useState(false)
  // Member Choice clubs charge the first contribution the moment you create the
  // membership — this confirmation gates that charge (or warns when there's no
  // card and the membership will land pending).
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Reload the selected customer's cards on file when the customer changes —
  // the render-time "adjust state on prop change" pattern (guarded by a stored
  // previous value) rather than an effect. Adding a card via the modal doesn't
  // change `customer`, so newly-added cards survive.
  const [prevCustomer, setPrevCustomer] = useState(customer)
  if (customer !== prevCustomer) {
    setPrevCustomer(customer)
    const cards = cardsForCustomer(customer)
    setSavedCards(cards)
    setPaymentCardId(cards[0]?.id ?? '')
  }

  // Customer / club deep-link context is read straight into the initial state
  // above (useState initialisers), so no mount effect is needed to sync it.

  const selection = parseClubSelection(clubSelection)
  const clubKey = selection?.clubKey ?? null
  const selectedLevel = selection && selection.levelId
    ? CLUB_LEVELS[selection.clubKey]?.find((l) => l.id === selection.levelId) ?? null
    : null
  const feeInfo = clubKey ? CLUB_FEES[clubKey] : undefined
  // Member Choice: the first charge is the chosen level's contribution amount.
  // Curated / Rewards: the static club fee from CLUB_FEES (or zero).
  const fee     = selectedLevel ? selectedLevel.amount : (feeInfo?.fee ?? 0)
  const taxRate = feeInfo?.taxRate ?? 0

  const total = useMemo(() => fee + (fee * taxRate) / 100, [fee, taxRate])

  const clubKind = clubKey ? CLUBS_CATALOG[clubKey].kind : null
  // Member Choice (account-credit) is the one club that charges on create.
  const isMemberChoice = clubKind === 'account-credit'
  const selectedCard = savedCards.find((c) => c.id === paymentCardId) ?? null
  const hasCard = savedCards.length > 0
  // Shipping needs an address; a "new" address counts only once its fields are
  // filled in. Pickup never needs one.
  // Shipping needs a concrete saved address selected; the picker guarantees one
  // (you can't pick "ship" without choosing an address). Pickup never needs one.
  const hasShippingAddress = !isShipping || (delivery.kind === 'ship' && !!delivery.addressId)
  // Non-charge clubs land Active only when every requirement is met.
  const wouldBeActive = hasCard && hasShippingAddress

  function close() { window.location.hash = MEMBERSHIPS_HASH }

  // Route to the freshly-created membership in edit mode. The detail screen
  // synthesises the record from these params + shows a "just created" banner,
  // so the operator lands on the real customer/club they just enrolled.
  function goToCreated(outcome: 'active' | 'pending' | 'declined' | 'nocard') {
    if (!clubKey) return
    const name = CUSTOMERS.find((c) => c.id === customer)?.name ?? ''
    const params = new URLSearchParams({
      created:  outcome,
      club:     clubKey,
      customer: name,
      delivery: isShipping ? 'shipping' : 'pickup',
    })
    if (selectedLevel) params.set('level', `${selectedLevel.name} · $${selectedLevel.amount}/${selectedLevel.cadence.toLowerCase()}`)
    if (fee) params.set('fee', fee.toFixed(2))
    if (selectedCard) params.set('card', shortCardLabel(selectedCard))
    window.location.hash = `#/web/clubs/memberships/new?${params.toString()}`
  }

  function createMembership() {
    if (!clubKey) return
    // Member Choice charges the first contribution immediately — confirm first.
    if (isMemberChoice) { setCreateModalOpen(true); return }
    // Curated / Rewards: no charge on create. Active or Pending by requirements.
    goToCreated(wouldBeActive ? 'active' : 'pending')
  }

  // Confirmed the Member Choice charge. With a card we attempt it now — the
  // ****0044 test card declines (→ pending) while any other card succeeds
  // (→ active). With no card the membership lands pending.
  function confirmMemberChoiceCreate() {
    setCreateModalOpen(false)
    if (!hasCard) { goToCreated('nocard'); return }
    const declined = selectedCard?.last4 === DECLINE_CARD_LAST4
    goToCreated(declined ? 'declined' : 'active')
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
                deliveryText={deliveryLabel(delivery, addresses)}
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
                      /* Flat dropdown — Member Choice levels are listed as
                         individual options ("Blind Enthusiasm — Silver
                         $50/month") so the operator picks the tier in one go
                         without a second step. Every option names the club
                         *type* so the operator knows what kind of club a fancy
                         name is. Commerce 7 / traditional clubs are excluded —
                         you can't enrol into a C7 store club through Vintiga. */
                      <Select
                        value={clubSelection}
                        onChange={(e) => setClubSelection(e.target.value)}
                      >
                        <option value="">Select a club</option>
                        {CLUB_KEYS.filter((k) => CLUBS_CATALOG[k].kind !== 'traditional').flatMap((k) => {
                          const info = CLUBS_CATALOG[k]
                          const levels = CLUB_LEVELS[k]
                          if (levels && levels.length > 0) {
                            return levels.map((lvl) => (
                              <option key={`${k}:${lvl.id}`} value={`${k}:${lvl.id}`}>
                                {info.name} ({info.type}) — {lvl.name} (${lvl.amount}/{lvl.cadence.toLowerCase()})
                              </option>
                            ))
                          }
                          return [<option key={k} value={k}>{info.name} ({info.type})</option>]
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
                {/* Pickup locations first — most operators creating a membership
                    are doing it for a customer who'll grab their first shipment
                    in person — then the customer's saved addresses. The shared
                    DeliveryPicker is the same control used to edit delivery on
                    the customer and member detail screens. */}
                <DeliveryPicker
                  addresses={addresses}
                  value={delivery}
                  onChange={setDelivery}
                  onAddAddress={(a) => {
                    const id = `addr-new-${addresses.length + 1}`
                    setAddresses((prev) => [...prev, { id, label: 'New address', line: formatAddressLine(a) }])
                    return id
                  }}
                />
              </RecordsCard>

              {/* Payment Method — only after a customer is picked. A dropdown
                  keeps the surface compact even when the customer has 4–5
                  cards on file, and once a card is chosen we don't want the
                  other ones cluttering the row. Pre-selected to the
                  customer's default card (the first saved card here). */}
              {customer && (
                <RecordsCard
                  title="Payment Method"
                  divider={false}
                  action={
                    <Button
                      variant="outline"
                      size="md"
                      leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
                      onClick={() => setAddCardOpen(true)}
                    >
                      Add Payment Method
                    </Button>
                  }
                >
                  {hasCard ? (
                    <Field label="Card on file" required>
                      <Select
                        value={paymentCardId}
                        onChange={(e) => setPaymentCardId(e.target.value)}
                        options={savedCards.map((c) => ({
                          value: c.id,
                          label: formatCardLabel(c),
                        }))}
                      />
                    </Field>
                  ) : (
                    <div className="flex flex-col items-center text-center gap-vintiga-sm py-vintiga-sm">
                      <div className="w-10 h-10 rounded-full bg-vintiga-slate-100 inline-flex items-center justify-center text-vintiga-slate-400">
                        <CreditCardIcon className="w-5 h-5" />
                      </div>
                      <span className="typo-body-sm font-semibold text-vintiga-slate-900">No card on file</span>
                      <span className="typo-caption text-vintiga-slate-500 max-w-xs">
                        Add a card to charge the membership now, or create it in a pending state and add one later.
                      </span>
                    </div>
                  )}
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

      <AddPaymentMethodModal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onAdd={(card) => {
          setSavedCards((prev) => [...prev, card])
          setPaymentCardId(card.id)
          setAddCardOpen(false)
        }}
      />

      {/* Member Choice charges the first contribution the instant the membership
          is created — so creating it is a money-moving action and must be
          confirmed. With a card we confirm the charge; with none we warn that
          the membership lands pending. */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} size="sm">
        {hasCard && selectedCard ? (
          <>
            <ModalAlertHeader
              icon={<CreditCardIcon />}
              iconColor="green"
              title={`Charge ${shortCardLabel(selectedCard)} and create this membership?`}
              description={`This charges the first contribution of $${fee.toFixed(2)} to ${shortCardLabel(selectedCard)} right now. If the card declines, the membership is still created — in a pending state.`}
            />
            <ModalFooter shaded>
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
              <Button onClick={confirmMemberChoiceCreate}>Charge ${fee.toFixed(2)} &amp; create</Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalAlertHeader
              icon={<CreditCardIcon />}
              iconColor="orange"
              title="Create in a pending state?"
              description="No card is on file for this customer, so the membership is created in a pending state. Add a card on the membership and save to charge the first contribution and activate."
            />
            <ModalFooter shaded>
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
              <Button onClick={confirmMemberChoiceCreate}>Create pending membership</Button>
            </ModalFooter>
          </>
        )}
      </Modal>
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
  deliveryText,
}: {
  clubKey: ClubKey | null
  levelLabel: string | null
  joinDate: string
  isShipping: boolean
  /** Human-readable delivery summary — "Pickup · Estate Tasting Room" / "Ship · …". */
  deliveryText: string
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
            {deliveryText}
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

// ─── AddPaymentMethodModal ───────────────────────────────────────────────────
// Inline-only-in-prototype card capture. Real implementation will use the
// payment processor's hosted fields — we'd never collect raw PAN here in
// production. The modal is just enough to make the membership flow feel
// complete when a customer has no card on file (per the Jun 4 review:
// "if the card they have on if they don't have a card associated with this
// customer record they would need to add a payment method").
function AddPaymentMethodModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (card: SavedCard) => void
}) {
  const [cardNumber, setCardNumber] = useState('')
  const [expires, setExpires]       = useState('')
  const [cvc, setCvc]               = useState('')
  const [name, setName]             = useState('')
  const [zip, setZip]               = useState('')

  function reset() {
    setCardNumber('')
    setExpires('')
    setCvc('')
    setName('')
    setZip('')
  }

  function handleClose() { reset(); onClose() }

  function detectBrand(num: string): CardBrand {
    const digits = num.replace(/\D/g, '')
    if (/^4/.test(digits))       return 'visa'
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard'
    if (/^3[47]/.test(digits))   return 'amex'
    if (/^6/.test(digits))       return 'discover'
    return 'mastercard'
  }

  const digits = cardNumber.replace(/\D/g, '')
  const last4  = digits.slice(-4)
  // Accept either "MM/YY" or the date-input "YYYY-MM" — normalise to MM/YY.
  const expiresPretty = (() => {
    if (/^\d{4}-\d{2}$/.test(expires)) {
      const [yyyy, mm] = expires.split('-')
      return `${mm}/${yyyy.slice(2)}`
    }
    return expires
  })()

  const valid =
    digits.length >= 13 &&
    /^(\d{2}\/\d{2}|\d{4}-\d{2})$/.test(expires) &&
    cvc.length >= 3 &&
    name.trim().length > 0

  function handleAdd() {
    if (!valid) return
    const card: SavedCard = {
      id: `card-${Date.now()}`,
      brand: detectBrand(digits),
      last4,
      expires: expiresPretty,
    }
    onAdd(card)
    reset()
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader
        title="Add Payment Method"
        description="Card details are tokenised by the payment processor on save — Vintiga never stores the full number."
        onClose={handleClose}
      />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <Field label="Card number" required>
            <TextField
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
            />
          </Field>

          <div className="grid grid-cols-2 gap-vintiga-md">
            <Field label="Expires" required>
              <TextField
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                placeholder="MM/YY"
              />
            </Field>
            <Field label="CVC" required>
              <TextField
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="•••"
              />
            </Field>
          </div>

          <Field label="Cardholder name" required>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name on card"
            />
          </Field>

          <Field label="Billing ZIP">
            <TextField
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="98229"
            />
          </Field>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd} disabled={!valid}>Save card</Button>
      </ModalFooter>
    </Modal>
  )
}
