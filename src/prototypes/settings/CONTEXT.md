# Settings — Context

> Vintiga Settings surface — the catch-all area where operators configure
> store-wide policies. The first cut focuses on **Locations** because TailGunner
> needs business hours + pickup instructions before they can sell 6-packs
> online with website-side pickup.

**Source of truth:** [Figma — Dashboard / Settings index](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=1696-16175) · [Figma — Locations](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=1812-4936)
**Linear ticket:** 517 — *Allow Website Order to Choose Pickup Location for Delivery*
**Last synced:** 2026-05-09 by Fedja Djukic
**Owner:** Fedja Djukic (djukicfedja@gmail.com)
**Status:** in-progress

---

## Why this exists

Operators need a single home for all their store-wide configuration —
identity, money, fulfilment, comms — without having to dig through tabs
scattered across Customers / Clubs / Products. The first prototype slice
focuses on **Locations** because the website + POS both need each location's
business hours and pickup instructions to render the new pickup-on-checkout
flow (LIN-517).

## Who it's for

- **Primary persona:** Tasting room manager / store admin (Donna, Jim) — the
  person who runs the day-to-day and updates store info when a holiday hits.
- Secondary: Owner / brand operator who configures a new location at signup.

## Pillars this advances

- [ ] Pillar 1 — *Operator productivity* (one place to manage store config).
- [ ] Pillar 2 — *Direct-to-consumer commerce* (website pickup unblocks
      TailGunner's 6-pack online sales).

---

## Scope of this prototype slice

In scope:
1. **Settings index** — top-level navigation listing every settings group
   (General, Locations, Tax, Shipping, Email, Payments, etc.) with a short
   description and click-through.
2. **Locations list** — every location the merchant operates, with status,
   address, and pickup-availability flag. Add Location CTA in the header.
3. **Location editor** — single-location detail with:
   - Identity (name, address, phone, email)
   - **Business hours table** — Mon-Sun rows, open/close times, per-day
     notes (for split hours like "9-12 then 2-5"), Closed toggle.
   - **Pickup instructions** — optional free-text rendered to the website
     and shown to customers who pick "Pickup" at checkout.
   - Save / archive actions.

Out of scope (other prototypes / later iterations):
- Website checkout pickup flow (separate website prototype).
- Order processing path for `delivery=pickup` (lives in Orders).
- Tax / shipping / payments editors (other settings groups).

## Source notes — May 7 Account Balance meeting (Fedja + Jim)

LIN-517 came up at the end of the May 7 call. Verbatim ask:
*"Allow Website Order to Choose Pickup Location for Delivery — when an order
is placed on the website, the customer should be able to choose between
delivery or pickup. If Pickup is selected, the user should be prompted to
choose between the available pickup locations and be able to view the
location's business hours."*

Implementation requirement called out for this prototype:
*"Allow editing of business hours and pickup instructions in
Vintiga / Settings / Locations."* — Per Jim: a small table of Mon-Sat with
open/close times, plus a notes field per day, plus an optional pickup-
instructions field. "Maybe even a notes section so we can be rendered on
the website or something." TailGunner is the trigger customer (6-packs
online).
