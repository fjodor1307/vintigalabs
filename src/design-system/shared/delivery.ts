// ─── Delivery method — shared model ───────────────────────────────────────────
// One canonical way to describe "where does this club's wine go": either a
// pickup at one of the winery's tasting rooms, or a shipment to a saved address.
// Kept data-only (no components) so it's fast-refresh-safe and can be imported
// anywhere — the picker UI lives in DeliveryPicker.tsx.
//
// Selection is always keyed by a UNIQUE id (the address id, or the pickup
// location string), never by the rendered label. Two addresses that happen to
// format to the same text still resolve to different ids, so exactly one option
// can ever be selected. See DeliveryPicker.

/** A shippable address, flattened to what the picker needs. */
export interface DeliveryAddress {
  id: string
  /** Friendly label — "Home", "Work", "Address 1". */
  label: string
  /** One-line rendering — "1210 Lakeview Street, Bellingham, WA 98229". */
  line: string
}

export type DeliveryValue =
  | { kind: 'pickup'; location: string }
  | { kind: 'ship'; addressId: string }

/** The winery's pickup locations, in the order operators expect to see them. */
export const PICKUP_LOCATIONS = ['Estate Tasting Room', 'Downtown Tasting Room']

/** Collapse an address record into the single line the picker/labels render. */
export function formatAddressLine(a: { street: string; city: string; state: string; zip: string }): string {
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`
}

/** Human summary of a delivery choice — "Pickup · Estate Tasting Room" / "Ship · 1210 …". */
export function deliveryLabel(value: DeliveryValue, addresses: DeliveryAddress[]): string {
  if (value.kind === 'pickup') return `Pickup · ${value.location}`
  const a = addresses.find((x) => x.id === value.addressId)
  return a ? `Ship · ${a.line}` : 'Ship'
}
