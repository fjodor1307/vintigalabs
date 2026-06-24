# Reservations — Journey

> Source of truth for what's built vs missing. Update status as screens land.

## Steps

| # | Step | Story | Route | Status |
|---|------|-------|-------|--------|
| 1 | View the day's reservations | Host scans bookings | `#/web/reservations` | ✅ built |
| 2 | Search + filter (Experience / status) | Host narrows the list | `#/web/reservations` | ✅ built |
| 3 | Check a party in | Host marks arrival | `#/web/reservations` (live) | ✅ built |
| 4 | Change date / Today | Host moves between days | `#/web/reservations` | 🔸 visual only |
| 5 | View switcher (List / Timeline / Floor Plan) | Host picks a layout | -- | 🔸 menu only |
| 6 | Add reservation | Host books a party | -- | 🔸 button only |
| 7 | Open a reservation detail | Host edits a booking | -- | -- not built |

## Gaps / open questions

- Date control is static (single day). Real prev/next + calendar picker → later.
- "Add" and the detail/edit flow are out of scope for this first pass.
- Status set assumed (Paid / Unpaid / Confirmed / Checked In / Cancelled / No Show) — confirm with PM.
