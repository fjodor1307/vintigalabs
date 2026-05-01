# Experiences — User Journey

## Source

- **Requirements:** [`./CONTEXT.md`](./CONTEXT.md)
- **Sibling prototype:** [`src/prototypes/products/`](../products/) — structural reference (the layout, right rail, tabs, image upload, and rich-text editor were inherited from products and trimmed for experiences).

---

## Journey Steps

| # | Step | Tab | Route | Status |
|---|------|-----|-------|--------|
| 1 | Operator opens the catalogue and lands on the experiences list | — | `#/web/experiences/list` | Done |
| 2 | Operator clicks Add Experience → editor opens on an empty experience | General | `#/web/experiences/general` | Done |
| 3 | Enter title (updates header live); upload a hero image | General | `#/web/experiences/general` | Done |
| 4 | Write content — manually or via "Generate content with AI" | General | `#/web/experiences/general` | Done |
| 5 | Confirm the default variant ("each") or add tiers (e.g. Standard / Premium) | General | `#/web/experiences/general` | Done |
| 6 | Customise POS copy — title, hook, pairings, tasting suggestions, upsell, promotions | POS | `#/web/experiences/pos` | Done |
| 7 | Customise website copy — subtitle, teaser, SEO meta + slug | Website | `#/web/experiences/website` | Done |
| 8 | Set Experience Properties — type, location, default location, duration, lead time, host requirement | Advanced | `#/web/experiences/advanced` | Done |
| 9 | Save experience → return to catalogue | — | `--` | Gap |
| 10 | Open Collections tab → group experiences (Tastings / Tours / Workshops / Seasonal / Private) | — | `#/web/experiences/collections` | Done |

**Status values:**
- **Done** — screen built and linked
- **In Progress** — screen partially built
- **Gap** — no screen exists yet
- **Blocked** — waiting on a decision or dependency

---

## Gaps & Open Questions

- **Save / Cancel behaviour** — Save is a no-op for now. Kebab on the header is a placeholder (likely Delete, Duplicate, Archive).
- **Booking schedule** — Lead Time captures the booking-window constraint; the actual calendar / availability lives elsewhere and is out of scope for this editor.
- **Modifiers** — dropped from this prototype (the products editor has a Modifiers tab; experiences in the brief don't list modifier groups). Reopen if upgrades / add-ons emerge as a real need.
- **POS Title inheritance** — UI implies POS Title is optional and inherits from main title. Backend must implement the fallback.
- **AI generation wiring** — "Generate with AI" buttons on Content / Hook / Pairings / Tasting Suggestions / Upsell are stubs.
- **Status / Web Status** — Status lives in the right rail (read-only label); Web Status is a Select on the Website tab. Both should be wired to the same store field once the model settles.
- **SEO defaults** — brief says SEO Meta Title and Slug should default from Product Title; current screens have placeholders only and do not auto-populate.
- **Image reorder / primary** — drag-to-reorder in the right-rail thumbnails isn't wired. First image is treated as primary.
- **Vinta Connect mapping** — open question on which external fields populate Experience Type / Location / Duration / Lead Time / Requires Host.

---

## Decisions (running log)

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-30 | Cloned from `products` prototype, dropped Modifiers tab | Brief lists no modifier groups for experiences; revisit if needed. |
| 2026-04-30 | Variant default title is "each" | Matches the brief; matches the products prototype convention. |
| 2026-04-30 | Variant fields: Title, Price, SKU, Cost, Sort Order, Tax Type, Department, Redeemable with Loyalty Points | Brief explicitly excludes UPC Code, Weight, Compare-at Price. |
| 2026-04-30 | Advanced tab: Global Properties (Department) + Experience Properties (Type, Location, Default Location, Duration, Lead Time, Requires Host) | Replaces the wine-specific Wine Properties + Taste Profile cards from the products prototype. |
| 2026-04-30 | Catalogue list filter is by experience subtype (Tastings / Tours / Workshops / Seasonal / Private) derived from the row's collections | Replaces the multi-product-type filter from the products list, which was irrelevant here. |
| 2026-04-30 | Add Experience skips the SelectProductTypeModal and routes straight to the General tab | Single product type (Experience), so the type-picker added a step with no decision behind it. |
