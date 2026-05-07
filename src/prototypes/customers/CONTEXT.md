# Customers — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** [Figma — 05. Dashboard / Customer overview](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5678-24811)
**Last synced:** 2026-05-07 by Fedja
**Owner:** Fedja Djukic (djukicfedja@gmail.com)
**Status:** in-progress

---

## Why this exists

Wineries treat each customer as a long-term relationship — not a transaction. Operators need a single page that surfaces who the customer is (club, tags, location, last visit), what they're worth (LTV, AOV, points, balance), and what's happening with them right now (recent orders, purchased products, internal notes/reminders). Today that information is fragmented across club tooling, POS, and ad-hoc spreadsheets.

The Customers prototype proves out the unified profile — a 360° view that makes the next conversation, next reach-out, or next club decision obvious at a glance.

## Who it's for

- **Primary persona:** winery DTC manager / tasting-room lead — splits time between front-of-house and back-office work, needs to walk into a member conversation already up-to-speed.
- Secondary: marketing / club managers planning campaigns or release allocations from segments of customers.

## Pillars this advances

To be filled in once `_context/programme.md` lands.

- [ ] Pillar 1 — TBD
- [ ] Pillar 2 — TBD
- [ ] Pillar 3 — TBD
- [ ] Pillar 4 — TBD

## Key user stories

Source: requirements doc — story IDs to be back-filled once linked.

- As a DTC manager I want to see a customer's lifetime value, AOV, and visit count at a glance so I know how to prioritise the relationship.
- As a tasting-room lead I want to see a customer's club, tags, and last visit before they walk in so the visit feels personal.
- As a club manager I want to flag delivery / payment / engagement issues against a customer so the next person picking up the file has the same context I do.
- As a DTC manager I want to see recent orders and most-purchased products so I can recommend the right release at the next touchpoint.

## Requirements & constraints

- Header card must show: avatar + verified badge, name, club, tag chips, email + preferred flag, location, last visit, club status.
- Customer Insights must surface: Purchased Products, LTV, AOV, Loyalty Points, Account Balance, Total Visits. Empty / zero states are valid (new customer).
- Right rail hosts collaborative content: typed Notes (Flag / Reminder / Note) and free-form Tags. Notes must show author + timestamp.
- Tabs in scope for v1: Overview · Orders · Billing · Memberships · Important Dates · Relationships · Reservations · Chats. Only Overview is built first.

## Open dependencies

- Pillars + persona docs not yet written — see top-level `_context/`. Stories will be linked back to GitHub once the requirements doc lands.

## Sources

- **Requirements:** Figma frame `Customer - Overview` (`5678:24811`).
- **Cross-feature research:** none yet.
- **Decisions log:** see [`JOURNEY.md`](./JOURNEY.md).
