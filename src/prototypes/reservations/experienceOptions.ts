// Combined Experience + Option (Jul 9 review). Instead of two dropdowns
// (Experience, then Option), variants are flattened into a single "Experience"
// picker — "Wine Tasting · Premium Tasting — $55 / guest". Single-variant
// experiences show just their name (no separate option). Free experiences read
// "No charge". Used by both the Add and View reservation screens.

export interface ExperienceOption {
  value: string
  experience: string
  /** Only set when the experience has more than one variant. */
  variant?: string
  /** Per-guest price; 0 = no charge. */
  price: number
}

// Jul 9 review: we only handle zero-charge reservations right now — every
// experience is "No charge" (paid reservations create an order at reserve time,
// a deferred flow — see NOTES.md). Prices stay modelled (0 today) so the paid
// labelling lights up automatically once a charged experience is added.
export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  // Single-variant experiences → one entry, no separate option.
  { value: 'private-tasting',        experience: 'Private Tasting Experience (30 mins)', price: 0 },
  { value: 'vineyard-picnic',        experience: 'Vineyard Picnic',                      price: 0 },
  // Multi-variant → one entry per variant.
  { value: 'wine-tasting:tasting',   experience: 'Wine Tasting', variant: 'Tasting',         price: 0 },
  { value: 'wine-tasting:premium',   experience: 'Wine Tasting', variant: 'Premium Tasting', price: 0 },
  { value: 'wine-tasting:reserve',   experience: 'Wine Tasting', variant: 'Reserve Flight',  price: 0 },
  { value: 'lunch:patio',            experience: 'Lunch',        variant: 'Patio',            price: 0 },
  { value: 'lunch:dining',           experience: 'Lunch',        variant: 'Dining Room',      price: 0 },
]

export const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** "Wine Tasting · Premium Tasting" — experience with its variant, if any. */
export function experienceName(o: ExperienceOption): string {
  return o.variant ? `${o.experience} · ${o.variant}` : o.experience
}

/** Full dropdown label — name plus price or "No charge". */
export function experienceLabel(o: ExperienceOption): string {
  return `${experienceName(o)} — ${o.price > 0 ? `${money(o.price)} / guest` : 'No charge'}`
}

export function experienceSelectOptions() {
  return EXPERIENCE_OPTIONS.map((o) => ({ value: o.value, label: experienceLabel(o) }))
}

export function findExperience(value: string): ExperienceOption | undefined {
  return EXPERIENCE_OPTIONS.find((o) => o.value === value)
}
