import type { CardBrand } from './customerStore'

// ─── Memberships data ─────────────────────────────────────────────────────────
// Backs the customer Memberships tab. Redesigned per the Jul 1 review:
//   • Digital Pass is its own compact card (it's a loyalty/identity object, not
//     a subscription club).
//   • Each club is an expandable card — collapsed shows a one-line summary; the
//     expanded body combines the club with its next shipment (mirrors the
//     customer portal), or, for clubs that don't ship, the type-specific detail.
//
// Club kinds map to the five real types (our three + Commerce 7's two):
//   curated       → Curated Bottle Club   — ships; order-review toggle
//   traditional   → Traditional (C7)      — ships
//   rewards       → Rewards Club          — no shipments; benefits + expiry
//   member-choice → Member Choice Club    — no shipments; level ($/mo) + credit

export type MembershipKind = 'curated' | 'traditional' | 'rewards' | 'member-choice'
export type MembershipStatus = 'active' | 'cancelled' | 'on-hold'
export type MembershipSource = 'vintiga' | 'commerce7'

// Every customer record gets a Digital Pass automatically. The lifecycle is
// derived from which dates are present (see `passStatus` in the screen):
//   nothing set                → Inactive · Invitation Sent: Not Sent  (new customer)
//   invitationSentOn           → Inactive · Invitation Sent: {date}
//   invitationAcceptedOn       → Active   · Invitation Accepted: {date}
//   lastUsedOn                 → Active   · Last Used: {date}
// The most-advanced state wins, so re-sending an invite on an already-active
// pass updates invitationSentOn internally but never downgrades the display.
// passId is null until the pass is first created (on the first Send Invite).
export interface DigitalPass {
  passId: string | null
  loyaltyPoints: number
  created: string
  invitationSentOn: string | null
  invitationAcceptedOn: string | null
  lastUsedOn: string | null
}

export interface ShipmentWine {
  name: string
  note: string
  qty: number
}

/** The upcoming club order — only shipment clubs (curated / traditional). */
export interface NextShipment {
  date: string
  chargesOn: string
  shipsOn: string
  minBottles: number
  maxBottles: number
  skipped: boolean
  price: number
  wines: ShipmentWine[]
}

export interface Membership {
  id: string
  clubMemberId?: string // links to the full membership page in the Clubs prototype (#/web/clubs/memberships/{id})
  clubName: string
  clubType: string
  kind: MembershipKind
  source: MembershipSource
  status: MembershipStatus
  joined: string
  salesAssociate?: string
  payment?: { brand: CardBrand; last4: string; expiresMonth: string; expiresYear: string }
  cancelledOn?: string
  cancelReason?: string
  onHoldSince?: string
  holdExpires?: string

  // Shipment clubs (curated / traditional)
  delivery?: { method: 'pickup' | 'ship'; location?: string; address?: string }
  orderReview?: boolean // curated only
  nextShipment?: NextShipment

  // Jul 15 review: the card carries these; the shipment itself lives in Club processing.
  shippingNotes?: string
  giftMessage?: string
  preferredShipping?: string        // future, with shipping tie-ins
  outstandingPickup?: string        // date an order has been waiting for pickup, if any
  // Deep detail — shown on the full membership page.
  membershipTags?: string[]
  membershipNotes?: string
  pastOrders?: { date: string; bottles: number; total: number; status: string }[]

  // Rewards
  benefits?: string[]
  renews?: string

  // Member Choice
  level?: { name: string; monthly: number }
  accountCredit?: number

  // Member Choice + Rewards
  commitmentEnds?: string
}

// Clubs a staff member can enrol a customer into (Add Membership modal).
export const CLUB_OPTIONS: { name: string; type: string; kind: MembershipKind }[] = [
  { name: 'Curators Club',    type: 'Curated Bottle Club', kind: 'curated' },
  { name: 'Vintiga Signature', type: 'Rewards Club',        kind: 'rewards' },
  { name: 'Blind Enthusiasm',  type: 'Member Choice Club',  kind: 'member-choice' },
  { name: 'Cellar Direct',     type: 'Traditional',         kind: 'traditional' },
]

export const CANCEL_REASONS = [
  'Too much wine',
  'Financial reasons',
  'Health reasons',
  'Pregnant',
  'Moving',
  'Switching to another club',
  'Other',
]

// Canonical pickup locations live in the design system so every surface
// (customer memberships, clubs) shows the same tasting rooms in the same order.
export { PICKUP_LOCATIONS } from '@ds/shared/delivery'

const HOME_ADDRESS = '1210 Lakeview Street, Bellingham, WA 98229'

// Seeded in the "new customer" starting state: the pass exists but no invite has
// been sent yet, so there is no passId and the status reads "Not Sent".
export const DIGITAL_PASS: DigitalPass = {
  passId: null,
  loyaltyPoints: 0,
  created: 'Jan 15, 2026',
  invitationSentOn: null,
  invitationAcceptedOn: null,
  lastUsedOn: null,
}

// One of every club type so the layout can be checked for consistency (Jul 1).
export const MEMBERSHIPS: Membership[] = [
  {
    id: 'mbr-curated',
    clubMemberId: '1001', // Jane Davis in the Clubs prototype
    clubName: 'Curators Club',
    clubType: 'Curated Bottle Club',
    kind: 'curated',
    source: 'vintiga',
    status: 'active',
    joined: 'Mar 15, 2023',
    salesAssociate: 'None',
    delivery: { method: 'ship', address: HOME_ADDRESS },
    orderReview: true,
    payment: { brand: 'mastercard', last4: '0092', expiresMonth: '07', expiresYear: '2027' },
    commitmentEnds: 'Mar 15, 2026',
    outstandingPickup: 'Jul 09, 2026',
    shippingNotes: 'Leave with the front-desk concierge if not home.',
    giftMessage: '',
    preferredShipping: 'UPS Ground',
    membershipTags: ['VIP', 'Bordeaux lover'],
    membershipNotes: 'Prefers reds; skip whites when possible. Anniversary shipment always a gift.',
    pastOrders: [
      { date: 'Apr 16, 2026', bottles: 4, total: 168, status: 'Delivered' },
      { date: 'Jan 16, 2026', bottles: 3, total: 132, status: 'Delivered' },
      { date: 'Oct 16, 2025', bottles: 6, total: 246, status: 'Delivered' },
      { date: 'Jul 16, 2025', bottles: 4, total: 168, status: 'Picked up' },
      { date: 'Apr 16, 2025', bottles: 3, total: 132, status: 'Delivered' },
      { date: 'Jan 16, 2025', bottles: 4, total: 168, status: 'Delivered' },
    ],
    nextShipment: {
      date: 'Jul 16, 2026',
      chargesOn: 'Jul 12, 2026',
      shipsOn: 'Jul 16, 2026',
      minBottles: 3,
      maxBottles: 6,
      skipped: false,
      price: 168,
      wines: [
        { name: '2021 Estate Pinot Noir', note: 'Black cherry, forest floor, silk tannins.', qty: 2 },
        { name: '2021 Reserve Chardonnay', note: 'Meyer lemon, hazelnut, a long mineral finish.', qty: 1 },
        { name: '2019 Cabernet Sauvignon', note: 'Cassis, graphite, cedar — built to age.', qty: 1 },
      ],
    },
  },
  {
    id: 'mbr-rewards',
    clubName: 'Vintiga Signature',
    clubType: 'Rewards Club',
    kind: 'rewards',
    source: 'vintiga',
    status: 'active',
    joined: 'Feb 02, 2024',
    renews: 'Feb 02, 2026',
    commitmentEnds: 'Feb 02, 2026',
    payment: { brand: 'mastercard', last4: '0044', expiresMonth: '08', expiresYear: '2028' },
    benefits: [
      '15% off all wine purchases',
      'Complimentary tastings for two, monthly',
      'Early access to new releases',
      'Waived shipping on orders of 6+',
    ],
  },
  {
    id: 'mbr-member-choice',
    clubName: 'Blind Enthusiasm',
    clubType: 'Member Choice Club',
    kind: 'member-choice',
    source: 'vintiga',
    status: 'active',
    joined: 'May 10, 2024',
    level: { name: 'Enthusiast', monthly: 75 },
    accountCredit: 150,
    commitmentEnds: 'May 10, 2026',
    payment: { brand: 'mastercard', last4: '0092', expiresMonth: '07', expiresYear: '2027' },
  },
  {
    id: 'mbr-traditional',
    clubName: 'Cellar Direct',
    clubType: 'Traditional',
    kind: 'traditional',
    source: 'commerce7',
    status: 'on-hold',
    joined: 'Aug 21, 2023',
    onHoldSince: 'Apr 04, 2026',
    holdExpires: 'Jul 04, 2026',
    delivery: { method: 'pickup', location: 'Downtown Tasting Room' },
    payment: { brand: 'mastercard', last4: '0092', expiresMonth: '07', expiresYear: '2027' },
    nextShipment: {
      date: 'Jul 04, 2026',
      chargesOn: 'Jun 30, 2026',
      shipsOn: 'Jul 04, 2026',
      minBottles: 6,
      maxBottles: 12,
      skipped: true,
      price: 240,
      wines: [
        { name: '2022 Rosé of Grenache', note: 'Watermelon, citrus zest, crisp and dry.', qty: 6 },
      ],
    },
  },
  {
    id: 'mbr-c7-curated',
    clubName: 'Heritage Selections',
    clubType: 'Curated Bottle Club',
    kind: 'curated',
    source: 'commerce7',
    status: 'cancelled',
    joined: 'Jan 09, 2023',
    cancelledOn: 'Mar 15, 2025',
    cancelReason: 'Too much wine',
    salesAssociate: 'None',
    delivery: { method: 'ship', address: HOME_ADDRESS },
    orderReview: false,
  },
]
