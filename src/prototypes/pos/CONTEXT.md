# POS / Products — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** Figma — [06. POS App](https://www.figma.com/design/V8VUTuLgW2cCCUnJh2xJkN/06.-POS-App?node-id=2768-1906)
**Last synced:** 2026-06-25 by Fedja
**Owner:** Fedja (djukicfedja@gmail.com)
**Status:** in-progress  <!-- in-progress | approved -->

---

## Why this exists

First POS (mobile) prototype — the iPad/iOS register floor staff use to ring up wine. This is the **Products** catalog screen, built entirely from the POS design-system components.

## What's here

- **Products screen** (`#/web/pos`, Figma `2768:1906`) — status bar → search navbar → "Current Release" product grid → floating cart + tab bar.
- **First interaction:** tap any product → it's added to the cart and the cart counter climbs live (1, 2, 3 …). The counter starts at 0 (badge hidden until the first add).

## Building blocks (from the Design System → Mobile Patterns)

- `PosNavbar` — product search.
- `PosProductCard` — square photo tile + frosted name/price/volume panel.
- `PosTabBar` — floating glass tab bar.
- `PosCartButton` — floating cart with the live-count badge.

## Notes

- `frame: 'mobile'`, so it lives under the **POS** category on the home page.
- Product photos are Unsplash wine imagery (prototype-only); the Figma uses Vintiga product shots.
