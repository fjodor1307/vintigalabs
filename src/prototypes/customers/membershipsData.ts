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

export interface DigitalPass {
  passId: string
  loyaltyPoints: number
  invitationAccepted: string
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

  // Rewards
  benefits?: string[]
  renews?: string

  // Member Choice
  level?: { name: string; monthly: number }
  accountCredit?: number

  // Member Choice + Rewards
  commitmentEnds?: string
}

const HOME_ADDRESS = '1210 Lakeview Street, Bellingham, WA 98229'

export const DIGITAL_PASS: DigitalPass = {
  passId: 'VA12345678',
  loyaltyPoints: 210,
  invitationAccepted: 'Jan 18, 2026',
}

// One of every club type so the layout can be checked for consistency (Jul 1).
export const MEMBERSHIPS: Membership[] = [
  {
    id: 'mbr-curated',
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
