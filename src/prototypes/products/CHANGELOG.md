# Products — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

## 2026-07-05 — Fedja + Claude: Experiences get the inline single-variant form

Client feedback: an experience with one variant was still showing the variant *table*, while wines already switched to the inline form.

- **`GeneralScreen.tsx`** — dropped the `!isExperience` gate on `showInlineVariant`, so any product with exactly one variant gets the inline form. `SingleVariantForm` now takes `isExperience` and mirrors the `VariantModal` field rules: no UPC / Compare At / Alcohol % / Physical Product-Weight-Volume, experience tax types (Experience, Service, Tax-Exempt), and experience copy for the info banner + variant title field ("Variant (Package / Party Size)", placeholder "e.g. For 2, For 4, Private Tour"). Adding a second variant still flips back to the table.
- **`productStore.ts`** — `loadFromCatalogue` treats the store's initial blank variant as "no variants", so opening a catalogue product now actually seeds the variant from the row (title / SKU / price / tax type). Before, the blank placeholder blocked the seed and experiences opened with an untitled wine-default variant.

## 2026-06-17 — Fedja + Claude: Global Properties — optional dropdowns + Brand / Vendor

Beer/Spirits Details → **Global properties** updates from client feedback:

- **None of Department / Brand-Vendor / Sales Attribute are required.** Every dropdown now leads with a non-selection **"—"** option (the shared `Select` renders `''` as "—").
- **"Vendor" renamed to "Brand / Vendor"** — it's the label a wine is sold under (a winery may carry several brands), not a supplier. Options are now winery brand names (Vintiga Estate, Willow Glen, Cedar & Stone, Lakeview Cellars, Old Vine Reserve) and it **defaults to non-selection** (store default `vendor: ''`).
- Extracted the block into a shared **`GlobalPropertiesCard`** so Beer and Spirits stay in lock-step for the upcoming override-spec changes.

Department still shows "Wine" by default (Commerce 7 syncs beer/spirits as Wine) but is now clearable.

## 2026-06-04 — Fedja + Claude: "Make global" switch on Choose Season (Jun 4 review)

Per the Jun 4 design review, season management moves entirely to the experience Schedule tab (the Settings → Seasons page is gone in the same PR). The `AddSeasonModal`'s **Create experience-only season** mode now ends with a "Make available to all experiences" switch — mirrors the **Apply to all experiences** pattern on the blackouts modal. When on, the custom range is also written to `storeSeasonsStore`, so other experiences see it in their store-season dropdown immediately.

Also removed the now-dead "View all seasons in Settings →" link from the modal, since there's nothing to deep-link to.

## 2026-06-01 — Fedja + Claude: Experience Seasons on the Schedule tab (PR 2 of 2)

The Chain Reaction follow-up: each experience now keeps **one or more availability seasons**, and the existing booking-settings + weekly-schedule + blackouts cards live *inside* the active season. Pairs with the Settings → Seasons tab from PR 1.

**Data model (productStore.ts)** — flat schedule fields gone, replaced by a `seasons: ExperienceSeason[]` array + `activeSeasonId`. Each `ExperienceSeason` carries either a `storeSeasonId` (shared) or a `customName + start + end` (one-off), plus its own `durationMinutes`, `bookingInterval`, `minGuestsPerSlot`, `maxGuestsPerSlot`, `timeSlotsByDay`, `blackouts`, and `excludedGlobalBlackoutIds`. All schedule actions (`addTimeSlot`, `addBlackout`, `toggleExcludedGlobalBlackout`, …) now route through a new `patchActiveSeason` helper so the UI never needs to know which season-id is mutating. New `useActiveSeason()` hook is the canonical read.

**Schedule tab UI (TimeSlotsScreen.tsx)** — new top-of-page **Seasons strip**: clickable pill per season showing its name + a `Shared` / `Custom` badge, with **+ Add season** on the right. The season's date range surfaces inline next to *Booking settings* with a **Remove season** action.

**Add Season modal** — radio between *Use existing store season* (dropdown of un-used store seasons, sourced from `useStoreSeasons()`) and *Create experience-only season* (name + start + end). Overlap is validated against this experience's other seasons; on conflict the spec-wording error renders inline: *"This season overlaps an existing availability season for this experience. Existing: {name} — {dates}"*. The Add button stays disabled until the conflict is resolved.

**Migration** — every experience now seeds with one default *Year-round 2026* custom season wrapping the previous demo data (Monday 10am / 2pm slots, Private event + Staff training blackouts) so existing demos still work. Removing the last season drops to an empty state that surfaces an *Add season* CTA.

**Bookable-from / Bookable-until removed** — those inputs no longer live in Booking settings; the season's own start/end replaces them.

## 2026-05-27 — Fedja + Claude: Global blackouts + scoped table on Schedule tab

The Schedule tab's blackouts now merge tenant-wide closures with per-experience ones into a single source-tagged table — landed after the client follow-up asking for clearer date labelling and inline global authoring.

**Weekly grid:**
- Each day card now writes the actual date next to the weekday name (e.g. `Monday May 25`) so the operator sees which calendar date the pill refers to.
- The current-week pill calls out the source: `Global · Memorial Day` vs `This experience · Private event`.

**Blackouts table:**
- One table, one Upcoming/Past control. Each row gets a **Scope** column with a `Global` filled tag (info tone) or `This experience` outline tag.
- Header line summarises counts: *X upcoming · Y global, Z this experience*.

**Add modal:**
- New **Apply to all experiences** switch. On → saves to the global store; off → keeps the closure local. The same modal authors both, so admins don't have to go to Settings to create a tenant-wide closure.
- Deleting a global from the merged table prompts for confirmation since it affects every experience.

**Data:**
- New `src/prototypes/_shared/globalBlackoutsStore.ts` for the tenant-wide list (seeded with Memorial Day, July 4, Thanksgiving). `useSyncExternalStore` pattern, matching the rest of the codebase.
- Per-experience seed dropped Memorial Day / Independence Day to avoid double-listing.

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
