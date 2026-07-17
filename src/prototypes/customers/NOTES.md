# Customers — Notes

Designer scratchpad. Anything strange, unclear, or worth improving goes here. Keep entries short. Link to files/screens where relevant.

**Status key:** 🔴 open · 🟡 investigating · 🟢 resolved · ⚪ deferred

---

## Open questions

- **⚪ Digital Pass — active/used states are display-only in the demo** — the pass is seeded in the *new customer* state (`Inactive · Invitation Sent: Not Sent`, no passId) so the reviewer sees the starting point + **Send Invite** forward step. `Active · Invitation Accepted` and `Active · Last Used` are the same `passStatus()` precedence but can't be reached from the winery UI (they're customer-side: accept / tap-to-use). The **don't-downgrade-on-resend** rule is implemented via that precedence (lastUsed > accepted > sent > not-sent) but only *visible* if seeded active. Can seed a second active example customer if we want to show it. · `CustomerMembershipsScreen.tsx` · 2026-07-10
- **⚪ passId creation timing** — ticket leaves it to dev: at record creation vs first Send Invite. Prototype mints it on first send (so the display has no passId until then), matching the "no value until first created/sent" note. · 2026-07-10
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
- **🟢 Inline "Change …" links** — *Change address / card / delivery* now open DS-styled modals (`membershipEditModals.tsx`) reading the customer's saved addresses + cards from the store; selections apply to the shipment card locally. *Change level* affordance removed pending a level-picker design. · done 2026-07-09

## Unclear / to investigate

- **🔴 Verification badge on avatar** — the small shield-check on the avatar implies a "verified" / ID-checked state. Source of truth? · `CustomerOverviewScreen.tsx` · raised 2026-05-07 by Fedja
