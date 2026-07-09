import type { CardBrand } from './customerStore'

// ─── Memberships data ─────────────────────────────────────────────────────────
// Backs the customer Memberships tab. Redesigned per the Jul 1 review:
//   • Digital Pass sits at the top, condensed, so it + a membership fit on screen.
//   • Each membership only shows the fields that matter for its club kind — the
//     billing/shipping address (always the customer's) is tucked behind an
//     "advanced" disclosure instead of taking two blocks per card.
//
// Club kinds map to the five real types (our three + Commerce 7's two):
//   curated       → Curated Bottle Club   — ships; has an order-review toggle
//   traditional   → Traditional (C7)      — ships
//   rewards       → Rewards Club          — no shipments; shows commitment expiry
//   member-choice → Member Choice Club    — no shipments; shows level ($/mo) + end

export type MembershipKind = 'curated' | 'traditional' | 'rewards' | 'member-choice'
export type MembershipStatus = 'active' | 'cancelled' | 'on-hold'
export type MembershipSource = 'vintiga' | 'commerce7'

export interface DigitalPass {
  passId: string
  loyaltyPoints: number
  invitationAccepted: string
}

export interface Membership {
  id: string
  clubName: string
  /** Display type, e.g. "Curated Bottle Club". */
  clubType: string
  kind: MembershipKind
  source: MembershipSource
  status: MembershipStatus
  joined: string
  salesAssociate?: string
  /** Only shipment clubs (curated / traditional). */
  delivery?: { method: 'pickup' | 'ship'; location?: string; address?: string }
  /** Curated only. */
  orderReview?: boolean
  /** Member Choice only. */
  level?: { name: string; monthly: number }
  /** Member Choice + Rewards — end of commitment / expiry. */
  commitmentEnds?: string
  payment?: { brand: CardBrand; last4: string; expiresMonth: string; expiresYear: string }
  cancelledOn?: string
  cancelReason?: string
  onHoldSince?: string
  holdExpires?: string
  /** Advanced view only — assumed to be the customer's addresses. */
  billingAddress?: string
  shippingAddress?: string
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
    billingAddress: HOME_ADDRESS,
    shippingAddress: HOME_ADDRESS,
  },
  {
    id: 'mbr-rewards',
    clubName: 'Vintiga Signature',
    clubType: 'Rewards Club',
    kind: 'rewards',
    source: 'vintiga',
    status: 'active',
    joined: 'Feb 02, 2024',
    commitmentEnds: 'Feb 02, 2026',
    payment: { brand: 'mastercard', last4: '0044', expiresMonth: '08', expiresYear: '2028' },
    billingAddress: HOME_ADDRESS,
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
    commitmentEnds: 'May 10, 2026',
    payment: { brand: 'mastercard', last4: '0092', expiresMonth: '07', expiresYear: '2027' },
    billingAddress: HOME_ADDRESS,
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
    billingAddress: HOME_ADDRESS,
    shippingAddress: HOME_ADDRESS,
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
    billingAddress: HOME_ADDRESS,
    shippingAddress: HOME_ADDRESS,
  },
]
