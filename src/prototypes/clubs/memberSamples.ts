import type { ClubKey } from './clubsCatalog'
import type { BaseStatus, MembershipHold } from './holdStatus'

// ─── memberSamples ──────────────────────────────────────────────────────────
// Shared member data for the Memberships table, the per-club Members tab, and
// the Membership detail screen. Stable string ids keep cross-screen navigation
// honest — clicking a row in any list opens the detail with that member's
// data, not a hard-coded sample.
//
// Hold handling: the stored `status` is the BASE lifecycle (pending / active /
// cancelled). "On hold" is NOT stored — it's derived from the `hold` dates
// against today (see `holdStatus.ts`). An active membership can carry a
// future-dated hold and still show as Active until the start date arrives.

export type Delivery = 'shipping' | 'pickup'
/** Kept for the filter dropdowns, which still offer an "On Hold" bucket. */
export type MemberStatus = 'pending' | 'active' | 'on-hold' | 'cancelled'

export interface Member {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  club: ClubKey
  delivery: Delivery
  city: string
  zip: string
  email: string
  /** Base lifecycle only. On-hold is derived from `hold`, never stored here. */
  status: BaseStatus
  /** Hold request (start + optional end). Drives the On Hold / Hold Until /
   *  future-hold display. Absent = no hold. */
  hold?: MembershipHold
  /** Cancellation date — only set on `cancelled` rows. */
  statusDate?: string
  /** Flagged for manual admin review — auto processing will skip orders. */
  flagged?: boolean
  audienceTags: string[]
  ageVerified: boolean
  signupDate: string
  activatedDate: string
  salesAssociate: string
  totalOrders: number
  lastVisit: string
}

export const MEMBERS: Member[] = [
  {
    id: '1001', name: 'Jane Davis', initials: 'JD',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces',
    club: 'curators', delivery: 'pickup', city: 'San Francisco, CA', zip: '94110',
    email: 'janedavis@gmail.com', status: 'active', flagged: true,
    audienceTags: ['Wine Lover', 'VIP'], ageVerified: true,
    signupDate: 'February 3, 2026 at 09:41 PM', activatedDate: 'February 3, 2026 at 09:41 PM',
    salesAssociate: 'Geoff Spears', totalOrders: 8, lastVisit: 'Mar 22, 2025',
  },
  {
    id: '1002', name: 'Leslie Alexander', initials: 'LA',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=faces',
    club: 'vintiga-signature', delivery: 'shipping', city: 'Oakland, CA', zip: '94607',
    email: 'lesliealex@gmail.com', status: 'pending', flagged: true,
    audienceTags: ['New Member'], ageVerified: true,
    signupDate: 'January 18, 2026 at 02:15 PM', activatedDate: 'January 18, 2026 at 02:15 PM',
    salesAssociate: 'Donna Ataman', totalOrders: 1, lastVisit: 'Jan 18, 2026',
  },
  {
    // Case 2 — hold start in the PAST, no end → "On Hold" (indefinite).
    id: '1003', name: 'Phoenix Baker', initials: 'PB',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces',
    club: 'vintiga-heritage', delivery: 'shipping', city: 'Portland, OR', zip: '97205',
    email: 'phoenixb@gmail.com', status: 'active', hold: { start: '2026-05-20' },
    audienceTags: ['Investor'], ageVerified: true,
    signupDate: 'November 9, 2025 at 11:02 AM', activatedDate: 'November 12, 2025 at 04:30 PM',
    salesAssociate: 'Jim Secord', totalOrders: 4, lastVisit: 'Feb 04, 2026',
  },
  {
    // Case 3 — hold start in the FUTURE, with an end → still "Active",
    // future-hold indicator shows the scheduled range.
    id: '1004', name: 'Ms Dorothy Ladner', initials: 'DL',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=faces',
    club: 'blind-enthusiasm', delivery: 'pickup', city: 'Seattle, WA', zip: '98107',
    email: 'dorothyladner@gmail.com', status: 'active', hold: { start: '2026-08-01', end: '2026-10-01' },
    audienceTags: ['Dog Owner', 'Investor'], ageVerified: true,
    signupDate: 'February 3, 2026 at 09:41 PM', activatedDate: 'February 3, 2026 at 09:41 PM',
    salesAssociate: 'Geoff Spears', totalOrders: 6, lastVisit: 'Mar 15, 2025',
  },
  {
    id: '1005', name: 'Robert Fox', initials: 'RF',
    club: 'vintiga-heritage', delivery: 'pickup', city: 'Napa, CA', zip: '94558',
    email: 'robertfox@gmail.com', status: 'active',
    audienceTags: ['Local'], ageVerified: true,
    signupDate: 'August 14, 2025 at 03:18 PM', activatedDate: 'August 14, 2025 at 03:18 PM',
    salesAssociate: 'Geoff Spears', totalOrders: 12, lastVisit: 'Apr 02, 2026',
  },
  {
    id: '1006', name: 'Jacob Jones', initials: 'JJ',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces',
    club: 'curators', delivery: 'shipping', city: 'Sonoma, CA', zip: '95476',
    email: 'jacobjones@gmail.com', status: 'cancelled', flagged: true,
    audienceTags: [], ageVerified: false,
    signupDate: 'May 5, 2024 at 10:00 AM', activatedDate: 'May 5, 2024 at 10:00 AM',
    salesAssociate: 'Donna Ataman', totalOrders: 3, lastVisit: 'Dec 10, 2025',
  },
  {
    // Case 1 — hold start in the PAST, with an end → "Hold Until {end}".
    id: '1007', name: 'Albert Flores', initials: 'AF',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces',
    club: 'vintiga-signature', delivery: 'pickup', city: 'Berkeley, CA', zip: '94704',
    email: 'albertf@gmail.com', status: 'active', hold: { start: '2026-04-15', end: '2026-07-15' },
    audienceTags: ['Sommelier'], ageVerified: true,
    signupDate: 'June 22, 2025 at 06:45 PM', activatedDate: 'June 22, 2025 at 06:45 PM',
    salesAssociate: 'Jim Secord', totalOrders: 7, lastVisit: 'Jan 22, 2026',
  },
  {
    id: '1008', name: 'Guy Hawkins', initials: 'GH',
    avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=128&h=128&fit=crop&crop=faces',
    club: 'curators', delivery: 'shipping', city: 'San Jose, CA', zip: '95113',
    email: 'guyhawkins@gmail.com', status: 'pending',
    audienceTags: ['Newsletter'], ageVerified: false,
    signupDate: 'April 30, 2026 at 08:11 AM', activatedDate: 'April 30, 2026 at 08:11 AM',
    salesAssociate: 'Donna Ataman', totalOrders: 0, lastVisit: 'Apr 30, 2026',
  },
  {
    id: '1009', name: 'Bessie Cooper', initials: 'BC',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=128&h=128&fit=crop&crop=faces',
    club: 'vintiga-heritage', delivery: 'shipping', city: 'Sacramento, CA', zip: '95814',
    email: 'bessiecooper@gmail.com', status: 'cancelled', statusDate: '22 Jan, 2026',
    audienceTags: ['Long-term'], ageVerified: true,
    signupDate: 'July 14, 2023 at 12:30 PM', activatedDate: 'July 14, 2023 at 12:30 PM',
    salesAssociate: 'Jim Secord', totalOrders: 14, lastVisit: 'Jan 22, 2026',
  },
  {
    // Case 4 — hold start in the FUTURE, no end → still "Active",
    // future-hold indicator shows "from {start}".
    id: '1010', name: 'Jerome Bell', initials: 'JB',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=128&h=128&fit=crop&crop=faces',
    club: 'vintiga-signature', delivery: 'shipping', city: 'Santa Rosa, CA', zip: '95401',
    email: 'jeromebell@gmail.com', status: 'active', hold: { start: '2026-09-15' },
    audienceTags: ['Repeat Buyer'], ageVerified: true,
    signupDate: 'October 8, 2025 at 05:00 PM', activatedDate: 'October 8, 2025 at 05:00 PM',
    salesAssociate: 'Geoff Spears', totalOrders: 9, lastVisit: 'Mar 28, 2026',
  },
]

export function getMember(id: string): Member | undefined {
  return MEMBERS.find((m) => m.id === id)
}
