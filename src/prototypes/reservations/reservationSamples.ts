// ─── reservationSamples ──────────────────────────────────────────────────────
// Mock reservations for a single day (Tue, Jun 23, 2026), modelled on the
// legacy Reservations list. Rebuilt in Vintiga tokens — drives the table, the
// header count, and the footer summary.

export type ReservationStatus =
  | 'Paid'
  | 'Unpaid'
  | 'Confirmed'
  | 'Checked In'
  | 'Cancelled'
  | 'No Show'

export interface Reservation {
  id: string
  /** Display time, e.g. "11:00 am". */
  time: string
  /** Sortable 24h key, e.g. "11:00". */
  sortKey: string
  guests: number
  name: string
  initials: string
  avatarUrl?: string
  /** Booked experience, e.g. "Lunch". */
  experience: string
  /** Sub-area within the venue, e.g. "Dining Room". */
  area: string
  location: string
  /** Table / seating reference. */
  table: string
  status: ReservationStatus
  /** Guest contact + loyalty — shown in the "Get To Know" side panel. */
  email: string
  phone: string
  country: string
  loyaltyTier: number
  orders: number
  ltv: string
}

export const RESERVATION_DATE = 'Tue, Jun 23, 2026'

export const RESERVATIONS: Reservation[] = [
  {
    id: 'r1', time: '11:00 am', sortKey: '11:00', guests: 3,
    name: 'Charles DeWitte', initials: 'CD',
    experience: 'Lunch', area: 'Dining Room',
    location: 'Estate Tasting Room', table: '1', status: 'Paid',
    email: 'hilton@vantagehq.com', phone: '(778) 625-7816', country: 'US', loyaltyTier: 5, orders: 0, ltv: '$0.00',
  },
  {
    id: 'r2', time: '11:30 am', sortKey: '11:30', guests: 2,
    name: 'Maria Alvarez', initials: 'MA',
    experience: 'Wine Tasting', area: 'Tasting Bar',
    location: 'Estate Tasting Room', table: '4', status: 'Confirmed',
    email: 'maria.alvarez@gmail.com', phone: '(415) 555-0142', country: 'US', loyaltyTier: 3, orders: 4, ltv: '$1,240.00',
  },
  {
    id: 'r3', time: '12:00 pm', sortKey: '12:00', guests: 6,
    name: 'Harper Party', initials: 'HP',
    experience: 'Vineyard Picnic', area: 'Terrace',
    location: 'Estate Tasting Room', table: '2', status: 'Unpaid',
    email: 'harper.party@gmail.com', phone: '(503) 555-0119', country: 'US', loyaltyTier: 2, orders: 1, ltv: '$320.00',
  },
  {
    id: 'r4', time: '1:00 pm', sortKey: '13:00', guests: 2,
    name: 'Devon Lee', initials: 'DL',
    experience: 'Cellar Tour', area: 'Cellar',
    location: 'Downtown Cellar', table: '3', status: 'Paid',
    email: 'devon.lee@gmail.com', phone: '(510) 555-0188', country: 'US', loyaltyTier: 4, orders: 12, ltv: '$4,580.00',
  },
  {
    id: 'r5', time: '2:30 pm', sortKey: '14:30', guests: 4,
    name: 'Priya Nair', initials: 'PN',
    experience: 'Private Tasting', area: 'Library',
    location: 'Estate Tasting Room', table: '5', status: 'Confirmed',
    email: 'priya.nair@gmail.com', phone: '(408) 555-0164', country: 'US', loyaltyTier: 6, orders: 8, ltv: '$3,120.00',
  },
  {
    id: 'r6', time: '4:00 pm', sortKey: '16:00', guests: 8,
    name: 'Okafor Family', initials: 'OF',
    experience: 'Sunset Flight', area: 'Patio',
    location: 'Estate Tasting Room', table: '6', status: 'Checked In',
    email: 'okafor.family@gmail.com', phone: '(707) 555-0145', country: 'US', loyaltyTier: 1, orders: 2, ltv: '$640.00',
  },
]

/** Tag tone per status — maps to the DS Tag filled palette. */
export const STATUS_TONE: Record<ReservationStatus, 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'default'> = {
  Paid:         'success',
  Unpaid:       'warning',
  Confirmed:    'info',
  'Checked In': 'teal',
  Cancelled:    'danger',
  'No Show':    'default',
}
