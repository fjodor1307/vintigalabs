# POS / Products — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

---

## 2026-06-25 — Fedja + Claude: New prototype — POS Products catalog

First POS (mobile) prototype, built from the POS design-system components. The **Products** screen (Figma [2768:1906](https://www.figma.com/design/V8VUTuLgW2cCCUnJh2xJkN/06.-POS-App?node-id=2768-1906)):

- Status bar → `PosNavbar` (search) → "Current Release" 2-up grid of `PosProductCard`s → floating `PosCartButton` + `PosTabBar`.
- **First interaction:** tapping any product adds it to the cart and bumps the live counter (1, 2, 3 …); the counter starts at 0, so the badge appears on the first add.
- `posSamples.ts` — eight Current Release wines (name · price · 750ml), Unsplash photos.

Registered as `frame: 'mobile'` → surfaces under the **POS** category.
