# Clubs — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

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
