// ─── Delivery method — shared types + data ────────────────────────────────────
// Data-only companion to DeliveryMethodPicker.tsx (kept separate so the picker
// file only exports components and stays fast-refresh-safe).

export interface DeliveryPickupLocation { value: string; label: string }
export interface DeliverySavedAddress { value: string; label: string }
export interface DeliveryNewAddress { street: string; city: string; state: string; zip: string }

/** Result of the editor — a display-ready method + destination. */
export interface DeliveryResult { method: 'pickup' | 'ship'; destination: string }

/** Canonical pickup locations — same labels the Add Membership form has always shown. */
export const DELIVERY_PICKUP_LOCATIONS: DeliveryPickupLocation[] = [
  { value: 'estate',       label: 'Estate' },
  { value: 'tasting-room', label: 'Tasting Room' },
]

export const EMPTY_NEW_ADDRESS: DeliveryNewAddress = { street: '', city: '', state: '', zip: '' }
