# Customers — User Journey

## Source

- **Requirements:** Figma — `Customer - Overview` (`5678:24811`)
- **Stories:** TBD — story IDs to be back-filled
- **CONTEXT.md:** [`./CONTEXT.md`](./CONTEXT.md)

---

## Journey Steps

| # | Step | Story | Route | Status |
|---|------|-------|-------|--------|
| 1 | DTC manager opens the Customers list from the sidebar | TBD | `#/web/customers` | In Progress |
| 2 | They click into a customer ("Jane Davis") | TBD | `#/web/customers/view/overview` | Done |
| 3 | They scan the header (club, tags, last visit, club status) | TBD | `#/web/customers/view/overview` | Done |
| 4 | They review the six Customer Insights tiles | TBD | `#/web/customers/view/overview` | Done |
| 5 | They review Recent Orders + Purchased Products | TBD | `#/web/customers/view/overview` | Done |
| 6 | They read the right-rail Notes (Flag / Reminder / Note) | TBD | `#/web/customers/view/overview` | Done |
| 7 | They add or remove a tag from the right-rail Tags section | TBD | `#/web/customers/view/overview` | Gap |
| 8 | They open Orders / Billing / Memberships / Important Dates / Relationships / Reservations / Chats tabs | TBD | -- | Gap |
| 9 | They hit "Update" to edit the customer profile | TBD | -- | Gap |

**Status values:**
- **Done** — screen built and linked
- **In Progress** — screen partially built
- **Gap** — no screen exists yet
- **Blocked** — waiting on a decision or dependency

---

## Gaps & Open Questions

- What does the Customers list look like? The Figma we have starts at the detail page, so the list is a placeholder for now.
- What does "Update" open — an inline drawer, a modal, or a separate edit screen?
- What's the difference between a Flag, a Reminder, and a Note? Right now they're three visually-distinct entries in the rail; we treat them as types but the workflow (assignment, due dates, follow-up) is unclear.
- Tags: who creates them, are they segment-driven, can they be coloured?

---

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-05-07 | Build only the Overview tab in v1 | The other seven tabs aren't designed yet — placeholders would be noise. |
| 2026-05-07 | Render the Notes rail inline rather than promoting a `<NoteCard>` to the DS | Pattern exists only here for now; promote once a second prototype reuses it. |
