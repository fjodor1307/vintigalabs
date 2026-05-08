// ─── Settings · Locations — sample data ──────────────────────────────────────
// One canonical sample (TailGunner Brewing — the trigger customer for
// LIN-517) plus a couple of additional locations so the list reads as a real
// multi-location merchant. All data lives module-level so the list and editor
// stay in sync without prop drilling.

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export interface BusinessHours {
  closed: boolean
  open:   string
  close:  string
  notes?: string
}

export type LocationStatus = 'active' | 'inactive'

export interface Location {
  id: string
  name: string
  status: LocationStatus
  pickupEnabled: boolean
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  email: string
  pickupInstructions: string
  hours: Record<DayKey, BusinessHours>
}

const closed: BusinessHours = { closed: true, open: '', close: '' }

export const LOCATIONS: Location[] = [
  {
    id: 'tailgunner-main',
    name: 'TailGunner Brewing — Main',
    status: 'active',
    pickupEnabled: true,
    street: '1218 Walker Ave',
    city: 'Edmonton',
    state: 'AB',
    zip: 'T6E 4J5',
    country: 'Canada',
    phone: '(780) 555-0142',
    email: 'main@tailgunner.example',
    pickupInstructions:
      'Park in the rear lot off 121 St. Use the side door marked "Pickup" — bring photo ID for orders containing alcohol.',
    hours: {
      mon: { closed: false, open: '11:00', close: '21:00' },
      tue: { closed: false, open: '11:00', close: '21:00' },
      wed: { closed: false, open: '11:00', close: '21:00' },
      thu: { closed: false, open: '11:00', close: '22:00' },
      fri: { closed: false, open: '11:00', close: '23:00' },
      sat: { closed: false, open: '10:00', close: '23:00', notes: 'Live music 8 pm — pickups welcome until 9 pm.' },
      sun: { closed: false, open: '10:00', close: '20:00' },
    },
  },
  {
    id: 'tailgunner-south',
    name: 'TailGunner Brewing — South',
    status: 'active',
    pickupEnabled: true,
    street: '9824 76 Ave NW',
    city: 'Edmonton',
    state: 'AB',
    zip: 'T6E 1L2',
    country: 'Canada',
    phone: '(780) 555-0188',
    email: 'south@tailgunner.example',
    pickupInstructions: 'Pickups handled at the bar — please mention the order number to staff.',
    hours: {
      mon: closed,
      tue: { closed: false, open: '12:00', close: '21:00' },
      wed: { closed: false, open: '12:00', close: '21:00' },
      thu: { closed: false, open: '12:00', close: '22:00' },
      fri: { closed: false, open: '12:00', close: '23:00' },
      sat: { closed: false, open: '11:00', close: '23:00' },
      sun: { closed: false, open: '11:00', close: '20:00' },
    },
  },
  {
    id: 'tailgunner-warehouse',
    name: 'Warehouse Pickup',
    status: 'inactive',
    pickupEnabled: false,
    street: '4011 102 Ave NW',
    city: 'Edmonton',
    state: 'AB',
    zip: 'T6A 0L8',
    country: 'Canada',
    phone: '(780) 555-0166',
    email: 'warehouse@tailgunner.example',
    pickupInstructions: '',
    hours: {
      mon: { closed: false, open: '08:00', close: '16:00' },
      tue: { closed: false, open: '08:00', close: '16:00' },
      wed: { closed: false, open: '08:00', close: '16:00' },
      thu: { closed: false, open: '08:00', close: '16:00' },
      fri: { closed: false, open: '08:00', close: '13:00' },
      sat: closed,
      sun: closed,
    },
  },
]

export function getLocation(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id)
}
