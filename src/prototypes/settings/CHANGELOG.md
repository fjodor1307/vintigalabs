# Settings — Changelog

## 2026-07-08 — Fedja + Claude: General tab (Figma 3471:89875)

Wired up the **Settings → General** tab (was a placeholder). Two side-by-side cards, stacking to one column below lg:

- **Business Information** — Business Name, Business Type (select), Logo Name (for receipts), Business Logo (toggle + upload dropzone that shows/hides with the toggle), Phone / Email, Website.
- **System Information** — Time Zone, Date Format, Currency (selects) plus the read-only C7 lifecycle timestamps (Created / Updated / Activated / Cancelled / Inactivated At), rendered muted with `Not set` for empty values.

`GeneralTab.tsx` (new), wired into `SettingsScreen.tsx`. General is now the default tab on first load (matching the Figma landing view) instead of Locations.

## 2026-06-04 — Fedja + Claude: Drop the Seasons tab (Jun 4 design review)

Decided in the Jun 4 review that there's no separate **Seasons** settings page — seasons are managed entirely from each experience's Schedule tab (same pattern as blackout dates: create locally, optionally promote to a tenant-wide season via a switch). The Seasons tab + `SeasonsTab.tsx` are gone; the `'seasons'` tab union, deep-link param, and route branch are removed from `SettingsScreen.tsx`. The shared `storeSeasonsStore` stays — it now only writes through the experience-side modal.

> *Jim (Jun 4):* "I think we can simplify it by not even having a setup-seasons page. Every season is either for this experience or for anybody to use, just like we did with the blackout dates."

## 2026-05-28 — Fedja + Claude: Seasons tab (PR 1 of 2 for Chain Reaction's seasons ask)

New **Settings → Seasons** tab — tenant-wide reusable date ranges (Spring · Summer · Fall · Harvest · Holiday seeded). Tables sort chronologically by start date; modal-driven add/edit; delete confirms with a warning that experiences pointing at the season will lose the reference. Overlap is allowed by design at this level — the spec calls these "operational calendars", and the no-overlap rule lives on the per-experience seasons (PR 2).

Data lives in a new shared store `src/prototypes/_shared/storeSeasonsStore.ts` (same `useSyncExternalStore` pattern as `globalBlackoutsStore`), so the upcoming Schedule-tab restructure can read it without a settings dependency.

## 2026-05-27 — Fedja + Claude: Tax Settings tab (May 27 design review)

- **On-site Tax Rates** — per-location fallback rate (POS uses these so checkout works offline). One row per physical location, % input each.
- **Shipping Tax Rates** — read-only state table synced from Commerce 7, with `Edit in C7` + `Get Rates` actions and a `Synced from C7` tag on the header.

Why: this is the table-stakes tax setup discussed with Jim and Donna. Per-location rates live under Tax Settings rather than under Locations because most wineries only have one location — putting it next to the synced C7 table keeps "all things tax" in one place.

## 2026-05-09 — Fedja Djukic

- Scaffolded the prototype with three screens: Settings index, Locations list,
  Location editor.
- Locations editor includes the Mon-Sun business hours table + pickup
  instructions field per LIN-517 (May 7 Jim ask). TailGunner is the trigger
  customer.
