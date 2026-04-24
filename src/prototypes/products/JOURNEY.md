# Products — User Journey

## Source

- **Requirements:** [`./CONTEXT.md`](./CONTEXT.md)
- **Meeting notes:** 2026-04-23 workflow-optimisation session (see NOTES.md)
- **Figma frames:**
  - General (original): https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=4803-39955
  - POS: https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=4856-15519
  - Website: https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=4856-16047
  - Edit-mode header + images on right: https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5483-128263
  - Advanced (combined layout): https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5483-131320
  - Modifiers: https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5483-132168

---

## Journey Steps

| # | Step | Tab | Route | Status |
|---|------|-----|-------|--------|
| 1 | Operator opens the editor on an empty product | General | `#/web/products/general` | Done |
| 2 | Enter name (updates header live); upload images (right rail → header thumbnail) | General | `#/web/products/general` | Done |
| 3 | Write content (rich-text editor) or use "Generate content with AI" | General | `#/web/products/general` | Done |
| 4 | Edit variants in the table (title / SKU / price) or add new variants | General | `#/web/products/general` | Done |
| 5 | Customise POS copy — short title, hook, pairings, upsell, promotion | POS | `#/web/products/pos` | Done |
| 6 | Customise website copy — subtitle, teaser, SEO | Website | `#/web/products/website` | Done |
| 7 | Set Global properties + Wine properties + Taste profile (1–5 sliders) | Advanced | `#/web/products/advanced` | Done |
| 8 | Configure modifier groups (size, packaging, gift wrap…) | Modifiers | `#/web/products/modifiers` | Done |
| 9 | Save product → return to catalogue | — | `--` | Gap |

**Status values:**
- **Done** — screen built and linked
- **In Progress** — screen partially built
- **Gap** — no screen exists yet
- **Blocked** — waiting on a decision or dependency

---

## Gaps & Open Questions

- **Catalogue / listing screen** — entry point before the editor.
- **Product-type switch** — Advanced tab is hard-coded to "Wine Properties" + wine taste profile. When Department changes to Beer / Food / Experience, the second card should swap (flagged with an in-UI warning banner). Variants on General should probably change labels too.
- **Image reorder / primary** — right-rail thumbnails have drag handles and a delete, but reorder drag-and-drop isn't wired. First image is treated as primary by convention (shown in header thumbnail).
- **Modifier group editor** — the Modifiers tab lists groups but doesn't open a group editor yet. Pencil icon is a stub.
- **Variants table interactions** — inline edit works, but no validation, no duplication, no reorder.
- **AI generation wiring** — the "Generate content with AI" button is a stub.
- **POS title inheritance** — UI says POS title is optional and falls back to main title. Backend must implement the fallback.
- **Save / Cancel behaviour** — Save is a no-op for now. Kebab menu on the header is a placeholder (likely holds Delete, Duplicate, Archive).

---

## Decisions (running log)

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-23 | Edit-mode header (thumbnail + title + type + tags) is always on, even when product is empty | Creates a visible target for data as the operator fills fields. |
| 2026-04-23 | Images moved from Summary card to right-rail thumbnail grid | More space, primary image doubles as the header thumbnail. |
| 2026-04-23 | Local image upload via File API + blob URLs stored in `productStore` | No backend needed for prototype. State persists across tabs in-session. |
| 2026-04-23 | Variants repositioned as a table with Add Variant button | Matches the new Figma; inline editing on title / SKU / price. |
| 2026-04-23 | Content field stays on General only (removed from Website and POS) | Confirmed in 2026-04-23 meeting. AI summary handles POS copy downstream. |
| 2026-04-23 | POS Title not required on form (no asterisk); backend falls back to main title | Variant of the meeting decision. |
| 2026-04-23 | Variant (Size / Unit) default is "each" | Blank default was a common gotcha. |
| 2026-04-23 | Advanced tab combines Global Properties + Wine Properties + Taste Profile | Merged Fedja's new Figma layout with the draft fields. Taste uses 1–5 sliders. |
| 2026-04-23 | Fifth tab added: Modifiers | New requirement from Figma frame 5483-132168. |
| 2026-04-23 | Tab order: General / POS / Website / Advanced / Modifiers | Matches Figma. |
