# Clubs — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

## 2026-07-16 — Fedja + Claude: Uniform delivery picker (shared DS control)

Aligned the two clubs delivery UIs with the customer memberships surface using the new shared `@ds/shared/DeliveryPicker`.

- **Member detail** (`MembershipDetailScreen.tsx`): the pickup/shipping split cards are now one **editable** `Delivery Method` card — the ⋯ opens the shared `DeliveryMethodModal` (previously a dead `onClick`). Pickup and shipping both render through the same control.
- **Add Membership** (`AddMembershipScreen.tsx`): replaced the bespoke `DeliveryOption` tiles + separate "Shipping Address" dropdown + inline new-address fields with the shared `DeliveryPicker` (one radio list: pickup locations, saved addresses, "Add new address"). Delivery state collapsed to a single `DeliveryValue`; the live right-rail preview and submit payload read from it.
- Pickup location names + address set now match the customer surface exactly (canonical `PICKUP_LOCATIONS` from the DS; Home/Work addresses).

## 2026-06-24 — Fedja + Claude: Design-review follow-ups — club renames, create-time charge, save-driven activation

From the Jun 24 design review (Fedja, Donna, Jim, Geoff). Six changes:

**1. Club type renames.** Settled the naming, dropping "Flex"/"Tasting Credit" and deliberately avoiding "subscription" (collides with Commerce 7's bottle-subscription):
- **Member Flex Club / Tasting Credit → Member Choice Club**
- **Membership Club → Rewards Club**
- **Curated Club → Curated Bottle Club**

Updated everywhere user-facing: [AddClubModal.tsx](AddClubModal.tsx), [clubsCatalog.ts](clubsCatalog.ts), [clubStore.ts](clubStore.ts), [ClubsScreen.tsx](ClubsScreen.tsx), [ClubViewChargesScreen.tsx](ClubViewChargesScreen.tsx), plus customer balance source names, the sales-chat tag, and the style-guide demo. Internal `kind` keys (`account-credit` / `membership` / `curated`) are unchanged.

**2. Member Choice charges on create.** Member Choice is the one club that charges the moment you create the membership ([AddMembershipScreen.tsx](AddMembershipScreen.tsx)). **Create Membership** now opens a confirmation modal:
- **Card on file →** "Charge {card} {amount} and create this membership?" On confirm, the charge is attempted and you land on the new membership.
- **No card →** "Create in a pending state?" — creates the membership Pending.

Commerce 7 / traditional clubs are now excluded from the club picker (you can't enrol into a C7 store club through Vintiga), and every club option names its **type** in parentheses so operators know what kind a fancy club name is.

**3. Create → landing states.** After create you land on the membership detail with a one-time confirmation banner ([MembershipDetailScreen.tsx](MembershipDetailScreen.tsx)):
- charge succeeded → **Active** (success banner)
- card declined → **Pending** with the card still on file, "update the card and save to activate" (error banner)
- no card → **Pending**, "add a card and save to activate" (warning banner)

The just-created record is synthesised from query params (real customer + club + outcome) since there's no backend. Decline is demoable via the **`****0044`** test card; no-card via customer **Marvin McKinney** (no cards on file). Cards on file now vary by selected customer.

**4. Activation is driven by Save.** On a pending membership, adding a card no longer auto-prompts activation — it just makes the membership "ready". Hitting **Save** opens the charge-&-activate confirmation ("Charge {amount} & activate" / "No, leave as pending"), keeping the money-moving action on the top Save button, consistent with every other flow.

**5. Add vs View stay distinct.** Confirmed the membership detail is a view (no club-type dropdown) — flagged for dev, whose first build still allowed changing the club in edit.

**6. Billing visibility.** Recurring memberships (Member Choice / Rewards) now show **Next Billing Date** and **Collected to Date** in the Club Overview rail.

Deferred to a later pass: club income **forecasting** and surfacing Member Choice contributions in the customer's account-balance transactions (see [NOTES.md](NOTES.md)).

---

## 2026-06-24 — Fedja + Claude: First-installment charge on activation + "Member Flex Club" rename

**First installment.** Activating a **recurring-fee** club (Member Flex / Membership) now takes the first payment as part of activation, so the charge is a deliberate, confirmed step rather than a silent side-effect of Save:

- The activation modal is now charge-aware. For recurring clubs with a card on file it reads **"Activate and charge the first installment?"** and the CTA is **"Charge {amount} & activate"** (e.g. `$75.00`), naming the card (`Mastercard **** 0092`). On confirm → status flips to **Active** and a history row lands: **"Activated · First installment charged · $75.00 · Mastercard **** 0092"**.
- No card yet on a recurring club → the modal blocks with **"Add a card to activate"** (add the card first, then charge).
- Per-release clubs (Curated / Traditional) are unchanged — they keep the plain "Yes, activate now" copy and take no activation charge.
- The kebab **Activate membership** item now routes through the same confirmation instead of activating instantly.
- Amounts live in `FIRST_INSTALLMENT` (per club); Guy Hawkins (1008) moved to **Blind Enthusiasm** so there's a pending Member Flex membership to demo the charge on.

**Rename.** "Tasting Credit" → **"Member Flex Club"** across the rendered UI (club catalog type, club rail tag, Add-Club type picker, kind→label map, Charges-log copy). The internal `account-credit` kind is unchanged.

## 2026-06-18 — Fedja + Claude: Membership list — declutter the hold text

On the membership lists, a future hold now shows only **"Hold Starts {start}"** (start date only) instead of the full range — the end date lives on the membership detail. Current holds show **"Until {end}"**. Keeps the list less cluttered.

## 2026-06-17 — Fedja + Claude: Pending membership → activation prompt

When a staff member supplies the missing info on a **pending** membership (adding the card via Payment Method → "Add Card"), a modal now asks **"Would you like to activate this membership?"** with **Yes, activate now** / **No, leave as pending**:

- **Yes** → membership flips to **Active** (local `baseStatus`); the pending message clears.
- **No** → stays pending, but the message changes from "Requires information to activate: {info}" to **"Membership is ready for activation."**
- The kebab menu on a pending membership now offers **Activate membership** (· Cancel Membership).

Payment-method state + activation are lifted to the screen so the message, the card, and the modal stay in sync.

## 2026-06-17 — Fedja + Claude: Membership detail — copy spec pass

Implemented the client's copy/structure spec for the membership detail:

- **Breadcrumb** last crumb is now the **customer name** (Clubs / Memberships / {name}).
- **Header** = club name + membership ID + status tag; the status tag is now bare (no date caption) — dates live in the messaging area.
- **Hold messaging** rewritten to the exact date matrix in `holdStatus.ts` + a `holdMessage()` helper:
  - start past, no end → **On Hold** / "Hold started on {start}"
  - start past, end future → **On Hold until {end}** / "Hold started on {start}"
  - start future, end future → **Hold scheduled for {start}** / "Hold ends on {end}"
  - start future, no end → **Hold scheduled for {start}**
  - start past, **end past** → hold has expired → membership is **Active** again (new derivation in `deriveMembershipState`; previously stayed "Hold Until"). "Hold Until" label retired in favour of **On Hold**.
- **Menu options**: no hold → *Hold Membership · Cancel Membership*; has hold → *Remove Hold · Edit Hold · Cancel Membership*.
- **Cancellation message**: "Membership Cancelled on {date}" / "{reason}" (added `cancelReason` to samples).
- **Pending message**: "Pending Activation" / "Created on {created}. Requires information to activate: {info}" (added `activationInfo`).
- **Order Review message** now surfaces under the header ("Order Review Required" + instructions) — order-review state lifted to the screen so the messaging and the body toggle stay in sync.

## 2026-06-16 — Fedja + Claude: Membership detail — hold as a top banner, not an always-on card

Reworked the membership detail screen from the Jun 16 review:

- **Hold card removed.** The big "Membership Hold" card rendered on every membership (including a "Place on Hold" CTA), eating real estate on the ~90% that are never held. Gone.
- **Hold lives in the kebab menu.** The "More actions" dropdown carries **Hold membership** (no hold) / **Edit hold** (held) + **Lift hold** (when held) + **Cancel membership**; hold items hidden when cancelled. The header stays clean — just **Save** + the kebab. The hold banner also has its own inline **Edit**.
- **Order Review moved above the delivery method** section (matches the club-order layout convention).
- **Customer tile trimmed** (Jim's feedback): shows only tags + email + phone now — dropped city/zip, last visit, and club status. For the rest, go to the customer record. Added a `phone` field to `memberSamples`.
- **Order Review made compact** with our DS `Switch`: the card is now a title row + toggle; the instructions textarea only appears when the toggle is on. Replaces the old checkbox + always-visible description.
- **Hold + status now surface as a top alert stack** (`MembershipAlerts`, built on `AlertSoft`), rendered at the top of the content below the breadcrumbs — only when there's something to say. Stacks most-urgent-first: **cancelled** (error) · **pending activation** (warning) · **manual processing required** (info, from `flagged`) · **hold** (future → indigo info "Hold scheduled · {range}", current → amber "On hold until {end}"). The hold banner carries an inline **Edit** action.
- **Title leads with the club + number** (e.g. "Blind Enthusiasm #1004") instead of repeating "Membership" across breadcrumb → title; the member's name stays on the customer card below. Last breadcrumb matches.

Verified in preview across no-hold, future-hold, current-hold, and cancelled members.

**Phase 2 (not done):** read-only membership *View* with the name in the header instead of a grayed-out edit-form field.

## 2026-06-13 — Fedja + Claude: Membership hold with start + end dates

Holds now carry a **start** and an optional **end** date, and the displayed status is derived from where today sits between them (single source of truth in `holdStatus.ts`):

| Start | End | Shows as | Filter bucket |
|-------|-----|----------|---------------|
| Past | set | **Hold Until {end}** | On Hold |
| Past | — | **On Hold** | On Hold |
| Future | set | **Active** + "Hold scheduled {range}" | Active |
| Future | — | **Active** + "Hold from {start}" | Active |

A future-dated hold keeps the membership **Active** until the start date arrives — the list + detail flag the scheduled hold so staff aren't surprised.

**Data model (`memberSamples.ts`)** — `Member.status` narrowed to the base lifecycle (`pending | active | cancelled`); on-hold is never stored, only derived. New `Member.hold?: { start; end? }`. Sample rows cover all four cases (Phoenix = On Hold, Albert = Hold Until, Dorothy = future hold w/ end, Jerome = future hold indefinite).

**Shared helper (`holdStatus.ts`)** — `deriveMembershipState(base, hold, …)` returns label/tone/variant/kind + filter bucket + caption + `futureHold`/`activeHold`. `MembershipStatusTag` renders it consistently across all three surfaces.

**Lists** — the cross-club Memberships table and the per-club Members tab both derive their status cell + status filter from the helper. The On Hold filter returns current holds *and* hold-untils; future holds stay under Active.

**Detail page (`MembershipDetailScreen.tsx`)** — title tag is derived; new **Membership Hold card** shows the current/scheduled hold (indigo future-hold treatment) with an **Edit Hold / Place on Hold** button. `HoldModal` edits the start/end with a live preview of the resulting status and a **Lift hold** action. Every change is captured in the **Membership History** table ("Put on Hold", "Future Hold Scheduled", "Hold Updated", "Hold Lifted") with the before→after dates.

## 2026-06-04 — Fedja + Claude: Add Payment Method + Tasting Credit Charges tab (Jun 4 design review)

Two changes from the Jun 4 design review:

**Add Membership → Add Payment Method.** The Payment Method card now has a trailing **+ Add Payment Method** button (matches the screenshot Donna ran by Jim/Geoff). Opens a modal that captures card number / expires / CVC / cardholder / ZIP. Saved cards become local state — the new card auto-selects on save so it's the one charged on submit. Prototype only — production uses processor-hosted fields.

> *Jim (Jun 4):* "If the card they have on… if they don't have a card associated with this customer record, they would need to add a payment method."

**View Tasting Credit Club → Charges tab.** New tab on `account-credit` clubs only (Overview / Members / **Charges** / Emails). Surfaces *per-club* revenue distinct from the customer-side account-balance history — which is what Donna asked for: "how much revenue is *this club* generating without any sort of returns or store credits or anything." KPI strip (Total charged net · Months active · Avg per month · Contributing members), a **By month** roll-up table (gross / refunds / net / failed count), and a filterable **Charge log** (date / member / level / amount / status). Refunds back out of "net" so the headline matches the framing; failed charges surface as a follow-up nudge without polluting the totals.

> *Geoff (Jun 4):* "After this you're in the club so when you go to view your club and it's a tasting credit club we want to see how many months you've been charged and what the total amount was."

Wires `#/web/clubs/view/{slug}/charges` for every account-credit club via `prototype.config.ts`; tab set in `ClubViewLayout.tsx` updated to include it. New screen file: `ClubViewChargesScreen.tsx` with mocked 6-month data for Blind Enthusiasm.

## 2026-05-27 — Fedja + Claude: Add Membership UX (May 27 design review)

- **Club dropdown is flat.** Tasting Credit levels render as siblings ("Blind Enthusiasm — Silver ($50/monthly)") instead of an `<optgroup>` tree, so the operator picks the tier in one step.
- **Delivery method defaults to Pickup.** Operator-created memberships are mostly first-shipment-at-the-tasting-room flows.
- **Payment Method is a dropdown.** Replaces the side-by-side card tiles — collapses cleanly when the customer has 4–5 cards on file, and once a card's chosen the others go away. Pre-selects the customer's default card.
- **Join Date is fully backdate-able.** Dropped the today-or-later restriction for Tasting Credit clubs; helper copy now reads "Pick any past or future date".
- **Contextual launchers pre-fill the form.** `#/web/clubs/memberships/add?customerId=...&club=...` locks the Customer / Club fields when launched from a customer view or a specific club view (no point making the operator re-pick what they already chose).

## 2026-05-25 — Fedja + Claude: Align club editor to VIN-496 spec (Figma 5078:4191)

Reconciled the club editor and clubs list against the latest spec.

**Store (`clubStore.ts`):**
- Defaults: `status` → **active**, `hasMembershipFee` → **false** for all types, `taxRate` → **Non-Taxable**.
- New top-level `duration: '' | '1 Month' | '3 Months' | '6 Months' | '12 Months'` for Curated / Rewards (required, no default).
- New `membershipDurationMonths` (string, default `'12'`) shown under Has-Fee=Yes.
- `ClubLevel` gains `sku` (per-level SKU for Tasting Credit, treated like a variant for the cart).
- Tax-rate options now `['Non-Taxable', 'Wine', 'Beer', 'Spirits', 'Food', 'Merchandise']`.
- SEO auto-fill: `metaTitleAuto` / `slugAuto` flags + `setName`, `setMetaTitle`, `setSlug` actions + `slugify` helper. Title auto-fills Meta Title and Slug until the user takes ownership of those fields.

**`ClubOverviewScreen`:**
- Curated / Rewards: **SKU + Duration** at the top (both required); Has Membership Fee toggle; when Yes shows **Membership Amount + Membership Duration (months)** then **Tax Rate**.
- Tasting Credit: **Cadence** (Monthly / Quarterly / Semi-Annual / Annual, default Monthly); inline Level card now **Name + Amount + SKU** (3-col). No club-level Membership SKU and no Tax Rate (always non-taxable, hidden).
- Title field uses `setName` → auto-fills Meta Title + Slug; Meta Title / Slug fields use the corresponding setters so manual edits stop the auto-fill.

**`LevelsEditor`:** per-level row is now Name + Amount + **SKU** (3 cols).

**`ClubsScreen` list:**
- Vintiga 3-dot menu: "View" → **"Edit"** (opens General tab).
- Commerce7-sourced (Vintiga-Connect) rows: 3-dot menu **hidden entirely** (was disabled + tooltip).

## 2026-05-20 — Fedja + Claude: Club editor General tab — match Figma + rich-text Description

Reconciled the club editor Overview against the Figma designs (5079:33614 Curated, 5079:43825 Tasting Credit, 5079:44506 Rewards).

- **Field order now matches the designs.** Curated/Rewards: Title → Status / Available → Membership SKU | Membership Fee Tax Rate → Has Membership Fee → Duration | Membership Fee → Description → Images. Tasting Credit: Title → Status / Available → Membership SKU → Level (Name + Amount) → Description → Images.
- **Description and Terms & Conditions are now `RichTextEditor`** (HTML content shown on the website), replacing plain textareas — in both `ClubOverviewScreen` (new club) and `ClubViewOverviewScreen` (existing club).
- **Tasting Credit Contribution Levels = Level Name + Amount only** (per VIN-496); the per-level cadence/SKU/tax fields were removed from `LevelsEditor`. Cadence is no longer shown on the Tasting Credit Overview (not in the design).
- `ContributionCadence` options are Monthly / Quarterly / Semi-Annual / Annual.

## 2026-05-20 — Fedja + Claude: Add Membership page + membership detail polish

Followed the design-sync decisions for the clubs flow.

- **Add Membership is now a full page** (`AddMembershipScreen.tsx`, route `#/web/clubs/memberships/add`), replacing the modal — so after creating you land on the membership in edit mode, and there's room to add on-the-fly customer/address creation later. Join Date accepts any date (backdatable); Tasting-Credit clubs are restricted to today-or-later. The **Order Summary always shows** — fee clubs show the fee, fee-free clubs a $0 order "for tracking". (`AddMembershipModal.tsx` removed.)
- **Membership detail (`MembershipDetailScreen.tsx`)** — addresses + payment method moved **above** the club orders; address card subtitles dropped; club orders **paginated** (6/page). Added an **Order Review** card (checkbox + instructions, pre-checked for flagged members). Pickup memberships show a Delivery Method card; pending memberships show a "No card on file" empty state. All these surfaces now use the shared **`RecordsCard`** DS component.

## 2026-05-20 — Fedja + Claude: Add Membership modal

New operator flow for enrolling a customer into a club, opened as a **modal** from a new **Add** button on the Memberships tab.

- **`AddMembershipModal.tsx`** — `Modal` (size `lg`, scrollable body) with three sections:
  - **Membership** — Customer select, Club select, Join Date.
  - **Delivery Method** — Shipping / Pickup selectable cards. Shipping reveals a saved-address picker with an "+ Add new address" option that expands inline Street / City / State / ZIP fields; Pickup reveals a pickup-location select.
  - **Order Summary** — renders only when the chosen club carries an initial fee (Fee + Tax + Total). Per the requirement: fee clubs create an order at membership creation, fee-free clubs just create the membership. (Order creation is mocked — submit closes the modal.)
- **`MembershipsScreen`** — `Add` button (PlusIcon) in the filter row opens the modal via local state (no route).

## 2026-05-19 — Fedja + Claude: Membership fee + SKU restructure

Reshuffled the Overview field set per the latest spec.

- **Membership SKU is now required for every club type** — not just Curated. Moved out of the curated-only block, renamed `SKU` → `Membership SKU`, and marked it required.
- **Has Membership Fee** checkbox added above Duration / Fee. Only the Fee amount and Tax Rate are gated by it; Duration of Membership stays visible for Curated and Membership regardless.
- **Tax Code** replaced with **Membership Fee Tax Rate** — same dropdown taxonomy Products uses for variant tax types (Wine / Beer / Spirits / Food / Merchandise).
- Deleted `TaxCodePicker.tsx` (no longer referenced). Renamed the store field `taxCode` → `taxRate` and added `hasMembershipFee` (defaults true for Curated/Membership).
- Mirrored all of the above on the View tab so the editor and the read-only view stay in sync.
- Reordered the Overview fields: Membership SKU + Duration of Membership now sit above the Has Membership Fee checkbox and always render; Fee + Tax Rate appear below the checkbox only when it's on.
- Fixed Media placement on the View tab: it was nested inside the Overview `RecordsCard` as a `Field`, which collapsed it visually. Lifted it to a top-level section like the editor uses.

## 2026-05-07 — Fedja + Claude: May 7 review pass

Aligned the Clubs prototype with the May 7 alignment meeting + 7 newly shared Figma frames (Curated `5079:33614` / `5079:57000`, Account Credit `5079:43825` / `5079:46371` / `5079:55546`, Membership `5079:44506` / `5079:58010`).

**Curated club**
- New `SKU` + `Tax Code` row under Membership Fee on the Overview tab. Per the meeting: a Curated club membership signup creates a real order against the SKU so accounting can reconcile revenue. US membership fees are usually non-taxable so Tax Code stays empty by default.

**Account Credit (Tasting Credit)**
- Overview: the old Duration / Fee row is gone. In its place, an inline **default Level** card with `Level Name` / `Dollar Amount` / `Contribution Cadence` (3-col). Edits the canonical `isDefault` level on the Levels tab.
- Levels tab: every level now carries its own `cadence` (`Monthly` / `Quarterly` / `Annually`). Cadence used to be a single per-club setting; per Figma it's per-level.

**Membership**
- Rail now surfaces **Auto Renew: Yes** below Membership Fee (Membership clubs always auto-renew — flag is read-only by design).

**Emails tab — across editor + view**
- Replaced the accordion-with-inline-editor with a clean list of email template rows (envelope icon · title · description · right chevron · hover state). Per the meeting, the per-template editor is **deferred** pending pocket-flow investigation; rows are inert for now but the tab + IA stay so the journey reads correctly.

**KPI unification (across the prototype)**
- All club KPI strips switched from large `md` cards in 3-/5-col grids to the compact `KpiCard sm` (KPI-small) in a 2-col grid, matching the customers index pattern set on May 7.
- `ClubsLayout` (top page): 5 KPIs (Active / On-hold / Pending / New / Canceled) → 2-col → 3 rows (2-2-1).
- `ClubViewOverviewScreen`: removed `Total Members` per the meeting (operators sum Active + On-hold + New). Kept Active / On-hold / New / Canceled, with **Total Releases pinned bottom-right** as the least-important metric (curated only; column 2 of row 3).
- `ClubViewReleasesScreen`: 6 release-stats KPIs → 2-col grid (was 3-col).

**Store**
- `ClubLevel` gained `cadence: ContributionCadence` and `ClubDraft` gained `sku`, `taxCode`, `autoRenew`. The top-level `contributionCadence` field is gone — moved into `ClubLevel`.
- `addLevel()` seeds new levels with `cadence: 'Monthly'`. `autoRenew` defaults to `true` for membership type and `false` for the others.

Verified across all club routes (`#/web/clubs`, `#/web/clubs/new/overview?type=curated|account-credit|membership`, `#/web/clubs/new/levels`, `#/web/clubs/new/emails`, `#/web/clubs/view/overview`, `#/web/clubs/view/releases`, `#/web/clubs/view/emails`).

## 2026-05-05 — fedja + Claude: View Club detail flow + refreshed Add Release

End-to-end "view a club" detail flow, reachable by clicking any row on the
Clubs list (or the row's "View" menu item). Mirrors the editor shell so users
moving between create / edit get a consistent layout, but with a richer rail
and the four-tab navigation that real existing clubs need.

- **`ClubViewLayout.tsx`** — shared shell: AppSidebar + Navbar + PageTemplate
  with breadcrumbs, club-name H1 (`titleOverride`-able), Save + kebab actions,
  segmented tabs (Overview / Members / Releases / Emails), and the
  `ClubSummaryRail` (Type, Email Templates, Total Releases, Members, Date
  Created, Manual Review). `hideRail` and `extraCrumbs` mirror the editor.
- **`clubViewSample.ts`** — sample data for the canonical "Blind Enthusiasm"
  club used across the four tabs. Lives separately from the layout so HMR /
  fast-refresh stays clean.
- **`ClubViewOverviewScreen.tsx`** — six-tile member-stats KPI grid
  (KpiCard) above Basic Info, Terms, and SEO cards. Matches the editor's
  Overview structure but surfaces read-only KPIs for the existing club.
- **`ClubViewMembersScreen.tsx`** — search + Delivery Method + Status filters
  over a sortable members table (Avatar, Delivery + city, status pills with
  inline "Hold Until" date, kebab actions, pagination footer).
- **`ClubViewReleasesScreen.tsx`** — five-tile KPI strip (Total / Estimated
  Revenue / Qualified Members / Processed Orders / Draft Orders Finalized)
  above the Club Releases card with toolbar, sortable table, status pills,
  pagination, and an "Add Release" CTA in the card header.
- **`ClubViewEmailsScreen.tsx`** — vertical list of email-template cards.
  Each card shows title + "Sent when…" descriptor + a `Use global email
  template` Switch; toggling the switch off reveals an inline Subject + Body
  override editor (different from the editor's accordion model).

**Refreshed `AddReleaseScreen`** now matches the new Figma — and powers both
flows from one component:

- New `AddReleaseExistingScreen` export wraps the same form in
  `ClubViewLayout` (route `#/web/clubs/view/releases/add`) while
  `AddReleaseScreen` keeps the editor wrapper (`#/web/clubs/new/releases/add`).
- Header now carries a "Planning" status `Tag` inline with the H1 (via the
  new `titleOverride` prop on both layouts).
- Main column: `Overview` card with Title input, Add Product search, and a
  populated products `Table` (drag handle · image+name+SKU · Default · Min /
  Max Qty · Price · trash row action).
- Right Settings card: qty rules, Manual / Auto **radio group** for order
  processing (selecting Auto reveals an `Auto Process Date` field with
  helper text), a `KEY DATES` section (Available to Customer / Estimated
  Shipping Date / Pickup Available Date), and the "skip shipment" switch.

**Wiring & shared updates:**

- `ClubsScreen.tsx` row click + "View" menu item now navigate to
  `#/web/clubs/view/overview`.
- `ClubViewLayout` and `ClubEditorLayout` both gain `titleOverride?` so
  sub-pages can render a status pill alongside the H1.
- `Icons.tsx` adds `FlagIcon` (rail flag count) and `ArrowUpDownIcon`
  (sortable table headers).
- `prototype.config.ts` registers the five new routes; the Clubs entry
  card screens count is bumped from 8 to 13.

## 2026-05-05 — fedja + Claude: Align rail with DS Page Template pattern

`ClubDetailsRail` no longer wraps its `RailSection` in `<RightRail>` — the section is passed directly to `PageTemplate`'s `rail` slot. Removes the double-aside top padding so Clubs and Products editors share identical rail alignment.

## 2026-05-04 — fedja + Claude: Full Club editor (Overview / Releases / Levels / Emails)

End-to-end editor flow from the Add Club modal:

- **`clubStore.ts`** — module-scope draft store (matches the `productStore` pattern). Holds the in-progress club: type, name, status, fields, levels, releases, terms, SEO. Survives navigation between tabs; `clubActions.startNew(type)` resets it.
- **`ClubEditorLayout.tsx`** — shared editor shell: sidebar + navbar + breadcrumb + page title + Save / kebab + tab strip + main + RightRail "Club Details". Tabs are driven by club type:
  - Curated → Overview / **Releases** / Emails
  - Account Credit → Overview / **Levels** / Emails
  - Membership → Overview / Emails
- **`ClubOverviewScreen.tsx`** — primary editor tab (Title / Status / Available on Website / Description / Duration / Fee / Auto-renew / Images upload / Terms & Conditions / SEO).
- **`ClubReleasesScreen.tsx`** — Curated only. Empty state + list of releases.
- **`AddReleaseScreen.tsx`** — sub-page. Two-column: Products + Shipment (rich-text editor stub) on the left, Settings panel on the right (replaces the rail). Save writes back to the store and navigates to `/releases`.
- **`ClubLevelsScreen.tsx`** — Account Credit only. Stack of editable levels with Default / Set as Default toggles + delete + Add Level.
- **`ClubEditorEmailsScreen.tsx`** — accordion of 11 email templates. First row expanded by default, others click to expand. Per-row "Use global email template" disables Subject + Body inputs.
- **`AddClubModal`** — now navigates to `#/web/clubs/new/overview?type=<kind>` on pick. The editor reads `?type=` on first land and primes the store via `clubActions.startNew()`.

**DS additions:**
- New shared component `@ds/shared/Select` — native styled select that matches Vintiga `TextField` chrome (h-10, slate-200 border, rounded-md, indigo focus ring). Promoted from the inline `Select` that lived in `products/ProductLayout.tsx`.

## 2026-05-04 — fedja + Claude: ClubCard, Add Club modal, Unsplash images, single-select filter

- Switched club rows to the new DS `ClubCard` component (each row is its own bordered card with hover state, matches Figma 5636:24752).
- Replaced gradient placeholders with real Unsplash photos (winery / vineyard imagery) on every club row.
- Added `AddClubModal.tsx` — opens from the "+ Add Club" button. Lists three club types (Curated / Account Credit / Membership) as `SelectionCard`s, with the description copy from Figma 5078:8564.
- Replaced the multi-select `FilterDropdown` with an inline single-select dropdown (Active / Inactive). Trigger reads "Active Clubs (4) ▾" with no applied-filter highlight, popup shows a checkmark on the picked option — matches the design.

## 2026-05-04 — fedja + Claude: KpiCard variants

Updated the KPI strip to take advantage of the refreshed `KpiCard` (now supports plain / goal / status-pill variants). Current Clubs only uses the plain variant, but the icon container is now 36 px (matches Figma) and icons no longer need explicit `w-4 h-4` classes — sizing is handled by the DS component.

See repo-level CHANGELOG for the full KpiCard change.

## 2026-05-04 — fedja + Claude: First pass on Clubs from Figma

Initial implementation of the Clubs surface from Figma node `5079-44185`:

- **`ClubsLayout.tsx`** — shared chrome (sidebar + navbar + page header + KPI strip + tabbed Widget). All three tabs reuse this so the page header and KPIs stay locked.
- **`ClubsScreen.tsx`** — main "Clubs" tab. `FilterDropdown` for status filter (defaults to Active), `Button` for Add Club, list of clubs as `MediaListItem` rows inside a divided container, kebab → `PopoverMenu` (View / Duplicate / Archive).
- **`MembershipsScreen.tsx`** / **`ClubEmailsScreen.tsx`** — placeholder screens with `EmptyState` so tab navigation works.

**DS additions:**

- New shared component **`MediaListItem`** at `@ds/shared/MediaListItem` — generic catalogue list row (96 px thumb + title + tags + meta + trailing action). Showcased in the style guide under "Media List Item". Listed in `_context/vocabulary.md`.

Why: the design relies on a row pattern that didn't exist in the DS. Building it as a generic shared component keeps it reusable for other catalogue surfaces (Campaigns, Curated Collections, Gift Boxes) and keeps prototypes free of inline list rows.
