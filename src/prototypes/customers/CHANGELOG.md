# Customers — Changelog

## 2026-07-16 — Fedja + Claude: Delivery picker bug fix + shared editor

Follow-up to the Jul 15 combined-delivery work.

- **Fixed the duplicate/both-selected bug.** The seed had two byte-identical saved addresses, and the picker selected by address *text*, so both rows rendered as selected. The seed now carries two distinct addresses (**Home** — 1210 Lakeview, Bellingham WA · **Work** — 500 Market St, San Francisco CA), state stored as the two-letter abbreviation (`WA`/`CA`).
- **"Change delivery" now opens the shared `DeliveryMethodModal`** (`@ds/shared/DeliveryMethodPicker`) — the same tiles + "Shipping Address" dropdown as the Add Membership form — in place of the local combined `DeliveryDestinationModal`, which was removed. "Add new address" writes through `customerActions.addAddress` (now returns the new id).

`CustomerMembershipsScreen.tsx`, `membershipEditModals.tsx`, `customerStore.ts`.

## 2026-07-15 — Fedja + Claude: Memberships — condensed card + full page + combined delivery (Jul 15 review)

Reworked the Memberships tab per the Jul 15 review.

- **Condensed card** carries the essentials only: **delivery** (combined), **payment** (change card), **join date + commitment/renewal**, **preferred shipping**, **shipping notes + gift message**, **order review**, and an **"order waiting for pickup"** alert when one exists.
- **Removed the "Your next shipment" block** (bottles, charge/ship dates, min–max) from the card — that lives in Club processing. No shipment info in the collapsed summary either.
- **"View full membership →"** links to the existing **Clubs membership page** (`#/web/clubs/memberships/{clubMemberId}`) — the canonical deep view (orders, history, addresses, payment, holds) — instead of duplicating it under Customers. Per the Jul 15 decision, membership deep-detail lives in Club processing. The customer's Curators Club maps to club member `1001` (Jane Davis) via a new `clubMemberId`.
- **Combined delivery method** (`DeliveryDestinationModal`) — one picker listing **pickup locations *and* saved addresses together**; one tap sets method + destination (no two-step). Replaces the separate ship-to + delivery modals. Same paradigm to hand to Vantage.

`CustomerMembershipsScreen.tsx`, `MembershipDetailPage.tsx` (new), `membershipEditModals.tsx`, `membershipsData.ts`, route in `prototype.config.ts`.

## 2026-07-10 — Fedja + Claude: Digital Pass lifecycle + Send Invite

Reworked the **Digital Pass** on the Memberships tab from a static "Active" row into the ticketed lifecycle. Every customer record has a pass (its own card, separate from the addable clubs — a pass can't be "added").

- **State is derived from dates** (`passStatus`), most-advanced wins:
  - `Inactive · Invitation Sent: Not Sent` — new-customer starting state (seeded), **no Pass ID shown**.
  - `Inactive · Invitation Sent: {date}` after an invite goes out.
  - `Active · Invitation Accepted: {date}` once accepted.
  - `Active · Last Used: {date}` once used. All states except "Not Sent" show their date.
- **Send Invite** replaces "View pass" as the 3-dot action — sends the email invite (toast), stamps `invitationSentOn`, and **mints the Pass ID on first send** (dev may instead mint at record creation). "View pass" returns as a second item once a Pass ID exists.
- **Re-send never downgrades** — resending updates `invitationSentOn` internally but the display follows the precedence, so an already-active/used pass keeps showing `Active · Last Used: {date}`.

`membershipsData.ts` (new `DigitalPass` shape), `CustomerMembershipsScreen.tsx`.

## 2026-07-09 — Fedja + Claude: Memberships tab — expandable club + next-order model (Jul 1 review)

Built the **Memberships** tab (was a placeholder that bounced to Overview). Reworked per Donna's Jul 1 feedback on Figma 2015:6618 and the customer-portal reference, which combines the club and its next shipment into one card:

- **Digital Pass is its own compact card** at the top — it's a loyalty/identity object, not a subscription club, so it reads separately from the memberships list.
- **Expandable club cards** — collapsed shows a one-line summary (`Next shipment {date} · N bottles` for shipment clubs, `Level · $X/mo` for Member Choice, `Renews {date}` for Rewards). Expanding reveals the type-specific body:
  - **Shipment clubs (Curated / Traditional)** → a "Your next shipment" block (ships-to · paid-with · delivery · charge/ship dates · min–max requirements) and an "In this shipment" bottle list with a working **Skip / Unskip** toggle — mirroring the portal, with staff-side edit affordances (Change address / card / delivery).
  - **Rewards** → member benefits + commitment expiry (no shipment).
  - **Member Choice** → level ($/mo) + account credit + commitment (no shipment).
- **On-hold** cards show a hold alert; **cancelled** cards don't expand and show the cancellation reason inline.
- Seeded Jane Davis with **one of every club type** across active / on-hold / cancelled and both sources.

`CustomerMembershipsScreen.tsx` + `membershipsData.ts` (new); route `#/web/customers/view/memberships` wired; the tab no longer points at Overview. The inline edit affordances (Change address / card / delivery / level, Add) are visual placeholders for now — see `NOTES.md`.


> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

## 2026-07-08 — Fedja + Claude: Add card modal with real number validation

The Payment Methods `+ Add` button was a no-op. Wired it to a new `AddCardModal` (card number · expires · CVC · cardholder name) that saves through `customerActions.addPaymentMethod` — brand is detected from the number, and the row shows up immediately.

- `AddCardModal.tsx` — new. Validates the card number client-side (Luhn checksum + 13–19 digit length) before the form can submit. An invalid number is caught here with an inline, actionable message — `Credit card number can't be validated. Check the number and re-enter.` — shown in the field's destructive state, instead of the opaque `Payment Method ID is required` the processor returns downstream. The number is grouped into 4s as you type; the error clears the moment you edit the field.
- `CustomerBillingScreen.tsx` — `PaymentMethodsCard` now owns the modal open state and renders `<AddCardModal>`.

Copy note: the ticket specified `Credit Card number entered can not be validated. Check the number and re-enter`; shipped house-styled per `vintiga-tov` (sentence case, contraction, filler trimmed) with the same meaning and recovery action.

Verified in preview: invalid number keeps the modal open and shows the red message; a valid Luhn number (4242…) adds a Visa row and closes the modal. tsc clean, lint clean for these files.

## 2026-05-27 — Fedja + Claude: Surface Commerce 7-only cards (May 27 design review)

`PaymentMethod` gained `source: 'vintiga' | 'commerce7'`. Commerce 7-vaulted cards render muted with a `Saved in Commerce 7` tag instead of the Vintiga `Default Card` flag — they can't be used by the POS or our clubs, so the row signals "look, don't touch". The row menu drops the "Set as default" item for those cards (Commerce 7 owns its own default).

Seed data now has one of each so the difference is visible at a glance.

## 2026-05-11 — Fedja + Claude: Billing stat rows use DS KpiCard

- `CustomerBillingScreen.tsx` — replaced the inline `StatRow` component (Account Balance + Loyalty Points) with `KpiCard size="sm"` from `@ds/shared/KpiCard`. Same visual, no local reimplementation.

Why: the DS already had the exact compact KPI tile we'd duplicated inline. Removing the local copy keeps the pattern owned by the design system.

---

## 2026-05-07 — Fedja + Claude: Customers index rebuilt to match Figma (2040:15777)

The Customers list page was a stub — table only, no header, no KPIs, no toolbar. Rebuilt to match the canonical `Customers` Figma frame.

- `CustomersScreen.tsx` — full redo. Page header (title + subtitle) → 4-up `KpiCard` strip (Total Customers · Total Members · AOV · ALV) → widget card containing: search input + `Tags` / `Actions` `PopoverMenu` dropdowns → `Table` with checkbox + `Customers (320)` sortable header + Phone/Email + Lifetime Spend (right-aligned) + Last Purchase + Customer Since + kebab menu → `PaginationBar` footer with selected count, rows-per-page Select, Page X of Y, and first/prev/next/last `IconButton`s.
- Per-row identity cell: `Avatar` + name + city/state, with a small indigo `IdCardIcon` chip pinned bottom-right of the avatar when the customer is a club member, plus an optional alert icon (orange `CircleAlertIcon` for follow-up, red `AlertTriangleIcon` for compliance, red `CircleXIcon` for cancelled) on the right.
- Row clicks deep-link into the detail flow when an `href` is set; only Jane Davis is wired. Kebab actions cover View / Add tag / Send email / Delete (placeholders).
- Bulk-select state lifted to the screen — header checkbox shows `indeterminate` when the page is partially selected, full when all rows on the page are checked. Select count surfaces in the footer + disables the bulk Delete action when zero.
- `customerSample.ts` — `CustomerListEntry` extended with `city / state / phone / lifetimeSpend / lastPurchase / customerSince / isMember / alert` and 10 fixture customers seeded to match the Figma names + amounts. Added `CUSTOMER_LIST_TOTAL` (320) and `CUSTOMER_LIST_MEMBER_TOTAL` (212) so the KPI counts and pagination feel real.

Why: the index was the missing first step in the journey — customers landed on a placeholder before reaching Jane Davis. Now the entry experience reads as a real CRM page.

Verified at 1400×900 (desktop) and 375×812 (mobile): all sections render, KPI cards stack 1-col on mobile, table scrolls horizontally, row click into Jane Davis routes to the detail page, sidebar collapses to drawer below md (using the new `useResponsiveSidebar` hook).

## 2026-05-07 — Fedja + Claude: Billing aligned with Figma + transactions become sub-pages

Reworked Billing after the Figma `Customer - Payments` (1948:14816) was shared. Billing is a **management** page (Payment Methods + Addresses + at-a-glance Balance/Points), not a transactions log. The transactions UI moved to dedicated drill-in screens.

- `CustomerBillingScreen.tsx` — rebuilt Figma-accurate. Top of the column: 2-up grid of compact stat rows (Balance · Loyalty Points) — both clickable, route to the sub-pages, with hover state + chevron affordance. Below: `Payment Methods` section card with stacked card rows (brand logo + expiry + masked number + "Default Card" tag + kebab — Set as default / Delete). Below that: `Address` section card with stacked address rows (label / street / city·state·zip / country / phone / email + kebab — Edit / Delete).
- `BalanceTransactionsScreen.tsx` + `PointsTransactionsScreen.tsx` — new screens at `#/web/customers/view/billing/balance` and `…/points`. Each has a "← Back to Billing" link, a hero card (running total + Adjust button + kebab), and the full transactions table. Billing tab stays active throughout the drill-in (verified — no tab swap).
- `TransactionsTable.tsx` + `transactionsFormat.ts` — extracted the shared ledger table + currency/points formatters so both sub-screens reuse the same shape (Timestamp · Source · Source Name · Order # · Description · Amount).
- Inline Mastercard logo as small SVG (two overlapping circles with the orange merge band) so the prototype is self-contained — Visa/Amex/Discover fall back to a neutral chip with the brand name.
- `customerStore.ts` — added `paymentMethods` + `addresses` arrays with seed data matching the Figma (two Mastercards, two duplicate addresses), plus actions: `addPaymentMethod`, `setDefaultPaymentMethod`, `deletePaymentMethod`, `addAddress`, `updateAddress`, `deleteAddress`. Single-default invariant enforced.
- Overview KPI hrefs now point straight at the transactions sub-pages (`…/billing/balance` and `…/billing/points`), skipping the Billing index. The `?focus=` query-param scroll fallback on the old Billing screen is gone.
- Routes registered: `…/billing` (index), `…/billing/balance` (balance transactions), `…/billing/points` (points transactions). Five screens total in the Customers prototype.

Why: the user pointed at the actual Figma design which is unambiguously a management page. Keeping the transactions UI as drill-ins under Billing satisfies the audit-trail requirement without bloating the page or adding a new top-level tab.

Add Payment Method / Edit Address modals — Figma doesn't have designs for these yet. Header `+ Add` buttons are wired to no-ops; the delete / set-default actions on the kebab work. Will come back when designs land. _(Update 2026-07-08: the Payment Methods `+ Add` modal now exists — see the top entry. Edit Address is still a no-op.)_

## 2026-05-07 — Fedja + Claude: Billing tab — Account Balance + Loyalty Points ledgers

Stood up Option C from the Account Balance flow discussion: the Overview KPIs deep-link into a new Billing tab that hosts the actual transaction history.

- `CustomerBillingScreen.tsx` — new screen at `#/web/customers/view/billing`. Two stacked sections (Account Balance + Loyalty Points), each with: hero card (running total + Adjust button) and a Transactions table (Timestamp · Source · Source Name · Order # · Description · Amount). Source tags: `User` (default), `Integration` (info / blue), `Vintiga` (violet). Signed amounts render green for credits / red for debits.
- `AdjustBalanceModal.tsx` — single modal serves both Balance and Points (parameterised by `mode`). Captures the audit fields the spec calls out: auto Timestamp, auto Source = current user (read-only "Tom Cook · STAFF-104" row), Add/Subtract direction toggle, signed Amount, optional Order Number, optional Description (internal note).
- `customerStore.ts` — extended with `accountBalance`, `loyaltyPoints`, two ledgers (`balanceLedger` / `pointsLedger`), and `adjustBalance` / `adjustPoints` actions that append a new entry and recompute the running total. Seeded with 4 balance entries + 3 points entries so the Billing tab has something to render on first visit.
- `prototype.config.ts` — registers `#/web/customers/view/billing`. Layout's `Billing` tab now points to the real route instead of bouncing back to Overview.
- KPIs **Account Balance** and **Loyalty Points** on the Overview now render as anchors with a hover state (border darkens, indigo tint). Clicking deep-links to `#/web/customers/view/billing?focus=balance` (or `?focus=points`) — the Billing screen reads `focus` and scrolls the matching section into view.

DS change in support of this: `KpiCard` gained an optional `href` prop. When set, the card renders as `<a>` and gets the interactive hover state. Other KPIs stay flat. Same prop works on the `sm` size.

Why: the Account Balance KPI was a dead-end on the Overview. Operators need to see the transaction history (debits, credits, source, order ref) and need a way to make manual adjustments with an auditable trail. Putting both on a dedicated Billing tab gives Loyalty Points the same home (the eventual Commerce7 mapping is a parallel ledger), keeps the Overview tight, and gives the existing inert "Billing" segmented-control entry a real reason to exist.

## 2026-05-07 — Fedja + Claude: Update Customer + Delete + Notes flows

Wired the first two interactive flows from the Figma `Customer - Single Page - Overview` section:

- `UpdateCustomerModal.tsx` — full profile form (salutation, name, email, phone, DOB Mo/Day/Yr, country, addresses, company, zip, marketing opt-in). Triggered from the **Update** button on the header card. Saves through the new store; the breadcrumb + header h1 + email line all reflect updates live.
- `DeleteCustomerModal.tsx` — alert-style confirmation. Triggered from the header card's kebab (`More actions → Delete`). Prototype-only — no backend wiring.
- `NoteModal.tsx` — single component covers both **Add Note** and **Update Note** modals (same Figma shape). Type select (`Note` / `Reminder` / `Flag`), description textarea, "Flag this Note" checkbox that upgrades the kind regardless of the type select. Add CTA appears in the rail header; Edit fires from each note's kebab.
- `customerStore.ts` — `useSyncExternalStore` pattern matching `clubStore` / `productStore`. Holds the editable customer profile + notes list. Add/edit/delete actions update the rail in place; new notes carry timestamp formatted as `Mon DD, YYYY at h:mm AM/PM` and are attributed to the logged-in user (Tom Cook).
- Header card kebab now uses `PopoverMenu` with `View History` (placeholder) + `Delete`. Per-note kebab uses `PopoverMenu` with `Edit` + `View History` (placeholder) + `Delete`.

Why: the Customer Overview screen had buttons / kebabs that did nothing. The Figma section spells out six modal flows; this lands the two highest-value ones (profile edit + notes CRUD) and leaves View History, Add Tag, and the empty-state variants for follow-up.

## 2026-05-07 — Fedja + Claude: Initial Customers prototype

Scaffolded the Customers prototype from Figma — `Customer - Overview` frame (`5678:24811`) on the `05. Dashboard` page.

Files added:

- `customerSample.ts` — single canonical customer (Jane Davis) plus orders, products, notes, tags fixtures.
- `CustomersScreen.tsx` — list page stub (placeholder rows + link into the detail flow). Replace once the index design lands.
- `CustomerViewLayout.tsx` — shared chrome for the detail flow: AppSidebar (`Customers` active) + Navbar + `PageTemplate` with breadcrumb (Home › Customers › {name}), eight tabs, and right rail (Notes + Tags).
- `CustomerOverviewScreen.tsx` — Overview tab body: header card with avatar / club / tag chips / metadata / Update button, six-up `KpiCard` grid (Purchased Products, LTV, AOV, Loyalty Points, Account Balance, Total Visits), Recent Orders `Table`, Purchased Products grid.
- `prototype.config.ts` — registers `#/web/customers` and `#/web/customers/view/overview`.

Why: stand up the customer 360° profile so wineries can prep for tasting-room visits and segment members for releases. Only the Overview tab is built — the seven other tabs are placeholders pending design.
