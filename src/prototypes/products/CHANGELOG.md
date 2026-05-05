# Products — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

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
