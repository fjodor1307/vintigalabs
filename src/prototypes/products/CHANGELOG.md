# Products — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

## 2026-05-27 — Fedja + Claude: Experience editor refresh (May 27 design review)

**Source-aware editing.** New `product.source: 'vintiga' | 'commerce7'`, seeded on each catalogue row. Commerce 7-sourced experiences render the Experience Details card with an explanatory "Synced from Commerce 7" banner and every form control disabled (via a single `<fieldset disabled>` wrapper, including the toggle switches). The Vintiga editor never writes back to Commerce 7, so we lock the surface to avoid the illusion that you can.

**Charge Type narrowed for Vintiga.** Native charges support "On Booking", "On Checkin", "No Charge". The "48 hours advance" option only appears for Commerce 7-synced rows (we don't run the cron yet); this prevents the demo from losing data on a synced row.

**Summary tidy-up.**
- Removed the "Redeemable with Loyalty Points" toggle entirely — Commerce 7's loyalty points are an opt-in add-on that doesn't map to anything in Vintiga, and we'll model member spend differently when we get there.
- "Reclassify as" → **"Categorize as"** with rewritten helper text — the local override is a Vintiga categorisation, not an upstream rewrite.
- Product Type chip drops the "Commerce7 type: Wine" / "synced from Commerce7" tail. When overridden, it now reads simply `Spirits (Wine)` — keeps the source visible without naming the integration.

**Schedule — Weekly grid.**
- New top-of-grid **Delete all** action (with confirm) — wipes every day's generated slots so the operator can regenerate from scratch when "Generate slots" landed on the wrong open/close.
- Each day card now shows an inline **"Closed this {day} · {reason}"** pill when a blackout covers that weekday in the *current* calendar week — amber-tinted card border + filled tag, so the operator doesn't have to scroll down to the blackout table to see what's actually closed this week.

**Schedule — Blackouts.**
- Removed the *Export to .ics* button — not a current ask, and it was wired to nothing.
- Blackouts split into **Upcoming / Past** tabs with counts, so historical entries stay accessible without crowding the next few closures.
- Blackout type `Custom` → `Other` (`BlackoutType` updated in the store).

## 2026-05-20 — Fedja + Claude: Single-variant inline view, beer/spirits attributes + Schedule tab

Design-sync follow-ups for the product editor.

**General (`GeneralScreen.tsx`):**
- When a product has **exactly one variant**, the pricing/measurement fields render **inline** on the General page (Variant, Price, SKU, UPC, Compare-At, Tax Type, Cost of Good, Alcohol %, Weight, Volume, Physical Product) instead of a table — matching Commerce7. A second variant flips back to the table.
- **Product Type** is always shown (e.g. "Beer · Commerce7 type: Wine") with a separate **Reclassify as** field for the Wine→Beer/Spirits override.
- Spirits show an auto-calculated **Proof** (2 × ABV) next to alcohol percentage (inline form + `VariantModal`).

**Schedule tab (was "Time Slots"):**
- Renamed tab to **Schedule** (`ProductLayout.tsx`).
- New **Booking settings** card — Duration, **Booking interval** (granularity), Min/Max guests per time slot, Bookable from/until — moved off the General "Experience Details" card (which now points to the Schedule tab).
- Per-day **Generate slots** fills start times from operating hours at the booking interval; slots stay individually editable / online-toggleable.
- **Blackout Dates** rebuilt as the modal + table version (Reason · Type tag · date range · closed-days total), ported from the matrix prototype. Store `Blackout` model is now `{ reason, type, start, end }`.

## 2026-05-14 — fedja + Claude: Reservation Time Slots tab + Experience editor polish

Continued the experience editor cleanup. Compared the General tab against the
production app and an older Figma design, then folded the missing pieces in.

**Store (`productStore.ts`):**
- Adds `Weekday`, `TimeSlot`, and `timeSlotsByDay: Record<Weekday, TimeSlot[]>`
  with three actions (`addTimeSlot` / `updateTimeSlot` / `removeTimeSlot`).
- Monday is seeded with 10:00 AM + 2:00 PM Online so the editor renders a
  meaningful default; other weekdays open empty.

**Tabs (`ProductLayout.tsx`):**
- New experience-only **Time Slots** tab between General and POS.
- **Modifiers** tab now hides for experiences — the spec defines bookable
  options via Variants, not modifiers (same treatment Advanced got last round).

**New screen (`TimeSlotsScreen.tsx`):** weekday cards (Mon → Sun) each with an
`Add Time` button; rows take time text, AM/PM, an Online checkbox, and a
delete affordance.

**General tab (`GeneralScreen.tsx`):**
- Variants section renames to **Options** for experiences (matches production
  + the older design); columns expanded to `Title · SKU · Price · COGS · Tax
  Type`. Wine products still see "Variants & Pricing".
- **Email/Customer Instructions** now uses `RichTextEditor` instead of a plain
  textarea — label stays "Customer Instructions" per the latest spec.

## 2026-05-13 — fedja + Claude: Experience fields on the first page

Client feedback: the experience editor "looks the same as a wine product with
tasting profile etc." and the required experience fields needed to live on the
first (General) page rather than buried under Advanced.

**Store (`productStore.ts`):** adds `startDate`, `endDate`, `seatingType`
(Communal / Table), `chargeType` (On Booking / 48 hours advance / On Checkin /
No Charge), `allowCancelOnline` (default `true`), and `customerInstructions`.

**General tab:** new **Experience Details** card, shown only when
`productType === 'Experience'`, between Media and Variants & Pricing. Surfaces
the full spec on the first page: Start Date + End Date, Experience Type +
Seating Type, Location + Default Location, Duration + Lead Time, Charge Type,
Requires Host, Allow customers to cancel online, Customer Instructions.

**Advanced tab:** the Experience Properties card was removed (it lived here
previously) so the experience-specific fields now have a single home on
General. Wine Properties + Taste Profile continue to hide for experiences as
before.

## 2026-05-05 — fedja + Claude: Experience product editor + cross-type field cleanup

Branches the existing five-tab editor on `productType === 'Experience'` so
clicking any experience row (`#/web/products/general?id=e1` … `e8`) opens an
Experience-shaped editor while wine / beer / etc. keep their wine-shaped one.

**Store (`productStore.ts`):**

- Adds top-level fields: `status`, `webStatus`, `loyaltyPoints`, `subtitle`,
  `teaser`, `metaTitle`, `metaDescription`, `slug`, plus `metaTitleAuto` /
  `slugAuto` flags so we can replace the auto-filled values silently while the
  user hasn't taken ownership.
- Adds Experience-specific fields: `experienceType` (Tasting / Tour / Other),
  `location`, `defaultLocation`, `durationMinutes`, `leadTimeHours`,
  `requiresHost`.
- Adds `sortOrder` to `Variant`.
- New `slugify(value)` helper — `setName` mirrors the name into Meta Title +
  Slug whenever the auto flag is on; direct edits to either field flip the flag
  off so future name changes don't overwrite the user's value.
- `loadFromCatalogue` now sets `department = product.type`, seeds Meta Title +
  Slug from the loaded name, and seeds the first variant with type-appropriate
  defaults (`Standard` + `Experience` tax for experiences vs `Standard Bottle`
  + matching tax for everything else).

**Advanced tab:** Department change now also updates `productType`, so swapping
to Experience flips the rest of the editor in one move. When Experience:
hides Vendor, hides Wine Properties + Taste Profile entirely, and shows a new
**Experience Properties** card (Experience Type, Location, Default Location,
Duration in min, Lead Time in hrs, Requires Host switch).

**Variant modal:** reads `productType` and, for Experience, hides UPC Code,
Compare At Price, Weight, Volume, Alcohol Percentage, and the Physical Product
checkbox; force-sets `physicalProduct = false`; offers Experience-flavored Tax
Type options (Experience / Service / Tax-Exempt). Adds a Sort Order numeric
field for every variant (lower numbers first), defaulting to the next free
slot.

**General tab:** new Status select (Available / Not Available) + Redeemable
with Loyalty Points switch in the Summary card.

**Website tab:** Web Status options corrected to Available / Not Available;
Subtitle and Teaser bound to the store; SEO Meta Title + Slug bound and show a
helper line ("Defaults to the product name…") while still auto-filled.

**POS tab:** "Promotion" → "Promotions" to match the Experience spec.

**Known gaps deferred:** Collections picker is still rail-only (search box, no
list / add / remove). Worth a follow-up.

## 2026-05-05 — fedja + Claude: Adopt DS Page Template

Refactored `ProductLayout` to follow the canonical `PageTemplate` pattern from the design system:

- Title is now a plain string (the product name) rendered with `typo-title-screen` by the template — dropped the custom thumbnail / meta / tags header that lived inside the title slot.
- Actions cluster is `Save` + kebab `IconButton` (Duplicate / Archive popover), matching the `ClubEditorLayout` pattern and the DS demo.
- Rail content is passed directly to `PageTemplate` (`Status` / `Collections` / `Availability` `RailSection`s) — removed the `<RightRail>` wrapper that was double-padding the aside.

Result: the Products and Clubs editors now share pixel-aligned rail spacing, and the rail stacks below the body on tablet/mobile via the updated `PageTemplate`.

## YYYY-MM-DD — {Name} + Claude: {short title}

What changed (files, screens, behaviour).

Why: {one or two lines on the motivation}.
