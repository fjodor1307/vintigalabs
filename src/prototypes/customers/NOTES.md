# Customers — Notes

Designer scratchpad. Anything strange, unclear, or worth improving goes here. Keep entries short. Link to files/screens where relevant.

**Status key:** 🔴 open · 🟡 investigating · 🟢 resolved · ⚪ deferred

---

## Open questions

- **🔴 Notes vs Reminders vs Flags** — three visual variants in the rail, but the workflow difference isn't defined. Do Reminders have due dates / assignees? Do Flags escalate? · `CustomerOverviewScreen.tsx` · raised 2026-05-07 by Fedja
- **🔴 What does "Update" open?** — drawer, modal, or full edit screen? · `CustomerOverviewScreen.tsx` · raised 2026-05-07 by Fedja

## Improvements

- **🔴 Customers list page is a stub** — Figma only covers the detail page, so the list is hard-coded sample rows. Replace once the index design lands. · `CustomersScreen.tsx` · raised 2026-05-07 by Fedja
- **🔴 Tabs other than Overview are dead** — keeping the segmented control visible so the journey reads correctly, but the other seven tabs route nowhere. · `CustomerViewLayout.tsx` · raised 2026-05-07 by Fedja

## Unclear / to investigate

- **🔴 Verification badge on avatar** — the small shield-check on the avatar implies a "verified" / ID-checked state. Source of truth? · `CustomerOverviewScreen.tsx` · raised 2026-05-07 by Fedja
