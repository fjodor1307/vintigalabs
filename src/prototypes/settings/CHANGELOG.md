# Settings — Changelog

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
