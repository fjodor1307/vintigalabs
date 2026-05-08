// ─── Settings · Locations — sample data ──────────────────────────────────────
// Two categories — Physical (tasting rooms / pickup points the customer
// physically walks into) and Inventory (warehouses / fulfilment centres
// that ship online orders). The list page renders one table per category;
// the Edit Location modal handles every field and (per LIN-517) also the
// Business Hours table + Pickup instructions that the website pulls into
// the checkout pickup picker.

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

export type LocationKind = 'physical' | 'inventory'

export interface Location {
  id: string
  kind: LocationKind
  name: string
  pickupEnabled: boolean
  address: string
  addressLine2: string
  country: string
  state: string
  city: string
  zip: string
  phone: string
  latitude: string
  longitude: string
  pickupInstructions: string
  hours: Record<DayKey, BusinessHours>
}

const closed: BusinessHours = { closed: true, open: '', close: '' }

export const LOCATIONS: Location[] = [
  {
    id: 'woodinville',
    kind: 'physical',
    name: 'Woodinville',
    pickupEnabled: true,
    address: '14525 148th Ave NE',
    addressLine2: '',
    country: 'United States',
    state: 'WA',
    city: 'Woodinville',
    zip: '98072',
    phone: '(555) 123-4567',
    latitude:  '47.7544',
    longitude: '-122.1635',
    pickupInstructions:
      'Park in the rear lot off 148th Ave. Use the side door marked "Pickup" — bring photo ID for orders containing alcohol.',
    hours: {
      mon: { closed: false, open: '11:00', close: '19:00' },
      tue: { closed: false, open: '11:00', close: '19:00' },
      wed: { closed: false, open: '11:00', close: '19:00' },
      thu: { closed: false, open: '11:00', close: '20:00' },
      fri: { closed: false, open: '11:00', close: '21:00' },
      sat: { closed: false, open: '10:00', close: '21:00', notes: 'Live music 7 pm — pickups welcome until 8 pm.' },
      sun: { closed: false, open: '10:00', close: '18:00' },
    },
  },
  {
    id: 'napa-tasting-room',
    kind: 'physical',
    name: 'Napa Tasting Room',
    pickupEnabled: true,
    address: '1325 1st St',
    addressLine2: 'Suite 200',
    country: 'United States',
    state: 'CA',
    city: 'Napa',
    zip: '94558',
    phone: '(555) 123-4569',
    latitude:  '38.2975',
    longitude: '-122.2869',
    pickupInstructions: 'Pickups handled at the bar — mention your order number to staff.',
    hours: {
      mon: closed,
      tue: { closed: false, open: '12:00', close: '20:00' },
      wed: { closed: false, open: '12:00', close: '20:00' },
      thu: { closed: false, open: '12:00', close: '21:00' },
      fri: { closed: false, open: '12:00', close: '22:00' },
      sat: { closed: false, open: '11:00', close: '22:00' },
      sun: { closed: false, open: '11:00', close: '19:00' },
    },
  },
  {
    id: 'vineyard-bellingham',
    kind: 'inventory',
    name: 'Vineyard Bellingham',
    pickupEnabled: false,
    address: '123 Main Street',
    addressLine2: '',
    country: 'United States',
    state: 'WA',
    city: 'Bellingham',
    zip: '98225',
    phone: '(555) 123-4567',
    latitude:  '48.7519',
    longitude: '-122.4787',
    pickupInstructions: '',
    hours: {
      mon: { closed: false, open: '08:00', close: '17:00' },
      tue: { closed: false, open: '08:00', close: '17:00' },
      wed: { closed: false, open: '08:00', close: '17:00' },
      thu: { closed: false, open: '08:00', close: '17:00' },
      fri: { closed: false, open: '08:00', close: '15:00' },
      sat: closed,
      sun: closed,
    },
  },
]

export function getLocation(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id)
}

export const LOCATION_KIND_LABEL: Record<LocationKind, string> = {
  physical:  'Physical Locations',
  inventory: 'Inventory Locations',
}

export const LOCATION_KIND_DESCRIPTION: Record<LocationKind, string> = {
  physical:  'Tasting rooms and pickup points open to customers. Hours and pickup instructions render on website checkout.',
  inventory: 'Warehouses and fulfilment centres that ship online orders. Not shown to customers.',
}
