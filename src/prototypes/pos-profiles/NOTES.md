# Pos Profiles — Notes

Designer scratchpad. Anything strange, unclear, or worth improving goes here. Keep entries short. Link to files/screens where relevant.

**Status key:** 🔴 open · 🟡 investigating · 🟢 resolved · ⚪ deferred

**Relationship to `OPEN-QUESTIONS.md`:** this file is the raw scratchpad — anything goes. Entries get promoted to `OPEN-QUESTIONS.md` only when they're ready for formal PM / stakeholder review.

---

## Open questions
Things that need an answer from PM, research, or a stakeholder.

- **🔴 Inventory UI is undesigned** — ticket borrows C7's Carry-out / Shipping / Pickup inventory locations and proposes Vintiga map *physical location → inventory location*. Showing 3 location pickers as a placeholder · raised 2026-07-02 by Fedja
- **🔴 "Get Profiles" (C7 stores) result state** — assumed to re-pull profiles from C7; no design for the result. Showing button + toast · raised 2026-07-02 by Fedja
- **🔴 Supported device / printer types** — using a representative list (Ingenico, Star Cloud, Epson Cloud). Confirm real supported set · raised 2026-07-02 by Fedja
- **🔴 Default Sales Attribute values** — defaults to "POS"; other allowed values unknown, free text for now · raised 2026-07-02 by Fedja

## Improvements
Things that work but could be better. Not blockers.

- **⚪ Drag-to-reorder collections** — ticket lists per-collection "Sort Order"; reorder handle would beat a number field · raised 2026-07-02 by Fedja
- **⚪ Hex color validation** — inline validation on the color fields · raised 2026-07-02 by Fedja

## Unclear / to investigate
Things that felt off, inconsistent, or where work got stuck. May turn into open questions or improvements once understood.

- **🟡 Sync rules have no screen** — C7 ⇄ Vintiga overwrite / create-in-C7 is backend behaviour. Demoing read-only vs editable via a faked **store-mode toggle** on the list · raised 2026-07-02 by Fedja
