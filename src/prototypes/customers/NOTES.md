# Customers — Notes

Designer scratchpad. Anything strange, unclear, or worth improving goes here. Keep entries short. Link to files/screens where relevant.

**Status key:** 🔴 open · 🟡 investigating · 🟢 resolved · ⚪ deferred

---

## Open questions

- **🔴 Notes vs Reminders vs Flags** — three visual variants in the rail, but the workflow difference isn't defined. Do Reminders have due dates / assignees? Do Flags escalate? · `CustomerOverviewScreen.tsx` · raised 2026-05-07 by Fedja
- **🔴 What does "Update" open?** — drawer, modal, or full edit screen? · `CustomerOverviewScreen.tsx` · raised 2026-05-07 by Fedja

## Improvements

- **🔴 Customers list page is a stub** — Figma only covers the detail page, so the list is hard-coded sample rows. Replace once the index design lands. · `CustomersScreen.tsx` · raised 2026-05-07 by Fedja
- **🟡 Tabs other than Overview** — Overview, Billing and now Memberships are live; the remaining five still route to Overview as placeholders. · `CustomerViewLayout.tsx` · raised 2026-05-07 by Fedja

## From Jul 1 design review

- **🔴 Member Choice level not selectable at signup** — during Add Membership for a Member Choice club you can't pick the level. Fix lives in the clubs Add Membership flow, not here. · `clubs/AddMembershipScreen.tsx` · raised 2026-07-01 by Donna
- **⚪ Segments on the customer record** — show which segments a customer belongs to on the profile. Blocked: PocketFlows has no API yet. · raised 2026-07-01 by Jim
- **⚪ Multi-select customers → send email** — wherever there's a customer / member / filtered list, allow multi-select and send an email. Then surface campaign / email history on the individual customer view (currently shows nothing). Blocked on APIs. · raised 2026-07-01 by Jim
- **🟢 Add / Edit / Cancel / Put-on-hold** — wired to modals (Figma designs), mutate the local memberships list. Skip/Unskip works too. · `CustomerMembershipsScreen.tsx` · `membershipModals.tsx` · done 2026-07-09
- **🔴 Inline "Change …" links are placeholders** — the expanded card's *Change address / card / delivery / level* links are still visual only. Wire to the portal-style shipping-address / delivery-method / card-on-file modals next. · `CustomerMembershipsScreen.tsx` · raised 2026-07-09 by Fedja

## Unclear / to investigate

- **🔴 Verification badge on avatar** — the small shield-check on the avatar implies a "verified" / ID-checked state. Source of truth? · `CustomerOverviewScreen.tsx` · raised 2026-05-07 by Fedja
