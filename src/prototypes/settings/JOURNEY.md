# Settings — User Journey

## Source

- **Requirements:** Linear LIN-517
- **CONTEXT.md:** [./CONTEXT.md](./CONTEXT.md)

---

## Journey Steps

| # | Step | Story | Route | Status |
|---|------|-------|-------|--------|
| 1 | Operator clicks Settings in the global sidebar | -- | `#/web/settings` | Done |
| 2 | Operator scans the index and clicks "Locations" | -- | `#/web/settings/locations` | Done |
| 3 | Operator picks the location they want to edit | LIN-517 | `#/web/settings/locations/{id}` | Done |
| 4 | Operator updates business hours + pickup instructions and saves | LIN-517 | `#/web/settings/locations/{id}` | Done |
| 5 | Operator goes back to the list and confirms the new pickup-availability indicator | -- | `#/web/settings/locations` | Done |

---

## Gaps / open questions

- **Holiday hours / temporary overrides** — the May 7 transcript hinted at
  split-day hours ("9-12 then 2-5"). Notes field handles the messaging side;
  do we need a structured override later? (Out of scope for v1.)
- **Pickup eligibility per club** — does a release that's pickup-only need
  to be cross-checked against location pickup-availability? (Out of scope.)
- **Map / lat-lng surface** — the website needs lat-lng to render a map.
  Do we expose those fields here or assume geocoding from address? (Likely
  fine to just store address; the website team can geocode.)
