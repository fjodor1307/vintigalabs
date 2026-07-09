# Reservations — Notes

Designer scratchpad — open questions, improvements, unclear items.

- The legacy "lightbulb" row icon → rendered as a Sparkles "Insights" action; confirm its real purpose (notes? AI suggestion?).
- Two header icons (clipboard + chat in the legacy screen) → rendered as Insights + Messages. Confirm what they open.
- Status palette is assumed — needs PM confirmation (esp. Unpaid vs Confirmed vs Paid ordering).
- Date is a single static day; multi-day nav + calendar picker is a follow-up.

## From Jul 9 design review — Add-reservation flow (next)

- **🔴 Quick-create (AI) vs manual** — after "Add", offer *"type or say what you want"* (e.g. "reservation for Geoff Spears, 2pm next Tuesday") or *"set it up manually."* NL path fills known defaults for anything unsaid (guests, location, host = none, first table). Still must pick an experience. · `AddReservationScreen.tsx`
- **🟢 Experience → Option (variants)** — DONE (one combined dropdown; see CHANGELOG). Original ask: hide the Option selector when an experience has a single variant; when 2+, flatten them into the experience picker ("Lunch – Patio", "Lunch – Dining room"). Seed one experience with a variant + one without. · Donna, Jul 9
- **🔴 Host list excludes departed staff** — only active users appear as host (e.g. Melanie, who left, shouldn't show). Ties to Settings → user accounts. · Donna, Jul 9
- **🔴 Free vs paid reservation** — label a zero-cost reservation **"No charge"** (don't leave blank). Paid experiences ($30 lunch): on Reserve, show an order created + charged to the card on file; a walk-in/ad-hoc with a charge → error "needs an existing customer with a card." Display first, paid flow next sprint. · Donna, Jul 9
- **⚪ Dev/API (Geoff)** — reservations need POST + PUT endpoints (create/update from POS); separate delete (real delete) from cancel (status via PUT). Not prototype work. · Jul 9
- **⚪ VinoCheck compliance** — Settings → Integrations, like C7's automatic tax rates. After reservations. · Jul 9
- **🟡 Tasks removed / Notes naming** — Tasks dropped from the header (no task mgmt yet). Notes popover kept; Donna leaned toward calling it "daily notes" and was unsure how Schedule vs Staff notes differ — confirm before wiring real note data. · Jul 9
