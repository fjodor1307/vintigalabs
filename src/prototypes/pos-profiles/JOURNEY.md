# Pos Profiles — User Journey

## Source

- **Requirements:** [`_context/requirements.md`](./_context/requirements.md) — Vintiga ticket "Manage POS Profiles in Stand-Alone Store"
- **CONTEXT.md:** [`./CONTEXT.md`](./CONTEXT.md)
- **Figma:** [05. Dashboard](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=1626-5128)

---

## Journey Steps

| # | Step | Route | Status |
|---|------|-------|--------|
| 1 | See all POS profiles in the store (table: name·color, location, default) | `#/web/pos-profiles/list` | Done |
| 2 | Toggle store mode (Stand-Alone ↔ C7-connected) to demo Add vs Get Profiles + edit permissions | `#/web/pos-profiles/list` | Done |
| 3 | Add a new profile (stand-alone only) → lands on the new profile's detail | `#/web/pos-profiles/list` → detail | Done |
| 4 | Open a profile — read view, two panels (Details, Collections, Inventory, Tips / Advanced Settings, Chip & PIN, Printers) | `#/web/pos-profiles/profile` | Done |
| 5 | Row / title **⋮** menu: Edit Details · Edit Collections · Duplicate | modal | Done |
| 6 | Edit **Details** (name, operational location) — General fields | modal | Done |
| 7 | Edit **Collections** (add, color hex, images on/off, sort, delete) — editable even in C7 | modal | Done |
| 8 | Edit **Tips** (on/off, type, options, display on EMV) | modal | Done |
| 9 | Edit **Advanced Settings** (PINs, additional-order-info, kitchen, table mgmt) | modal | Done |
| 10 | Edit **Printers** (title, ID, type, delete) | modal | Done |
| 11 | Edit **Chip & PIN devices** (title, terminal ID, type, delete) | modal | Done |
| 12 | Edit **Inventory** (carry-out / shipping / pickup locations) | modal | Done |
| 13 | Read-only behaviour in C7-connected store (only images on/off + collection colors editable) | all edit surfaces | Done |

**Status values:** Done · In Progress · Gap · Blocked

---

## Gaps & Open Questions

- Inventory UI is undesigned — placeholder location pickers (see NOTES).
- Sync (C7 ⇄ Vintiga) is backend behaviour, no screen — demoed via the store-mode toggle.
- "Get Profiles" result state undesigned — button + toast.

For free-form observations and improvements, use [`./NOTES.md`](./NOTES.md).

---

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-07-02 | Detail = read view + per-card Edit modals (not one big form) | Matches Figma `1637-7618` |
| 2026-07-02 | Fake a store-mode toggle on the list to demo Stand-Alone vs C7 permissions | Sync has no screen; reviewers still need to see both states |
