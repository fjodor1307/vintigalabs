# Experiences — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

## 2026-04-30 — Fedja + Claude: scaffold from `products`

Cloned `src/prototypes/products/` into `src/prototypes/experiences/` and adapted for the Product Experience brief:

- `prototype.config.ts` — renamed entry to "Experiences", dropped the Modifiers route (4 tabs instead of 5).
- `productStore.ts` — replaced wine-specific state (wineType, varietal, vintage, taste profile, modifier groups) with experience-specific state (`experienceType`, `location`, `defaultLocation`, `durationMinutes`, `leadTimeHours`, `requiresHost`). New variant shape drops UPC, Weight, Compare-at, Alcohol %, Volume, Physical Product; adds Cost, Sort Order, Department, Redeemable with Loyalty Points. Catalogue reseeded with ten sample experiences. Default variant title is "each".
- `VariantModal.tsx` — fields reduced to Variant Title, Price, SKU, Cost, Sort Order, Tax Type, Department (optional), Redeemable with Loyalty Points.
- `AdvancedScreen.tsx` — replaced Wine Properties + Taste Profile cards with a single Experience Properties card (Type / Location / Default Location / Duration / Lead Time / Requires Host). Global Properties now only shows Department.
- `GeneralScreen.tsx` — replaced the wine-specific copy generator with an experience-flavoured one (tasting / tour / workshop). Variant table empty-state copy adjusted.
- `PosScreen.tsx`, `WebsiteScreen.tsx` — copy and helpers retuned for experiences (slug default note, teaser placement on listing page, POS field labels).
- `ProductsListScreen.tsx` — rewrote the catalogue. Title "Experiences", Add Experience button, search placeholder, type filter shows experience subtypes (Tastings / Tours / Workshops / Seasonal / Private) derived from the row's collections. Removed the SelectProductTypeModal — Add Experience routes straight to the editor.
- `CollectionsScreen.tsx`, `AddCollectionScreen.tsx` — replaced wine/beer/spirit collection types with Experience Type / Tasting / Tour / Workshop / Seasonal / Custom. Sample collections rewritten.
- `ProductLayout.tsx`, `Shell.tsx`, `OverviewLayout.tsx` — sidebar / breadcrumb / segmented-control labels now read "Experiences" (was "Products"). Tabs reduced to General / POS / Website / Advanced.
- Removed: `ModifiersScreen.tsx`, `ModifierGroupModal.tsx`, `SelectProductTypeModal.tsx`.
- Docs — `CONTEXT.md`, `JOURNEY.md`, `NOTES.md` rewritten for the experiences brief.

Why: experiences are a distinct product type with its own model (location, duration, lead time, host) and explicitly *don't* use a chunk of the physical-product fields (UPC, weight, kitchen prep, vendor). The products editor was the closest starting point; this prototype trims and renames rather than rebuilding from scratch.

## 2026-04-30 — Cloned from `products`

Created as an iteration clone via `npm run clone-prototype`.
