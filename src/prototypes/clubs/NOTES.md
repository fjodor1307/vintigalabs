# Clubs — Notes

Designer scratchpad. Anything strange, unclear, or worth improving goes here. Keep entries short. Link to files/screens where relevant.

**Status key:** 🔴 open · 🟡 investigating · 🟢 resolved · ⚪ deferred

**Relationship to `OPEN-QUESTIONS.md`:** this file is the raw scratchpad — anything goes. Entries get promoted to `OPEN-QUESTIONS.md` only when they're ready for formal PM / stakeholder review.

---

## Open questions
Things that need an answer from PM, research, or a stakeholder.

- **🔴 Membership lifecycle gaps** — when a membership is created Pending vs Active, how cancel/on-hold transition, future-join behaviour. Full spec + 6 open PM questions in [`MEMBERSHIP-LIFECYCLE.md`](MEMBERSHIP-LIFECYCLE.md) · raised 2026-06-13 by Dejan (dev)
- **🔴 Example question title** — why it matters · `ScreenName.tsx:line` · raised YYYY-MM-DD by {name}

## Improvements
Things that work but could be better. Not blockers.

- **⚪ Club income forecasting (deferred)** — show expected recurring-club income per cycle. Review leaned toward an expandable section on the club view (path to Reports later) rather than a new top tab. Not yet built · raised 2026-06-24 by Donna/Fedja
- **⚪ Member Choice contributions in account balance (deferred)** — surface each Member Choice contribution as a row in the customer's [`BalanceTransactionsScreen.tsx`](../customers/BalanceTransactionsScreen.tsx). Source names already renamed; the linkage isn't wired · raised 2026-06-24
- **🔴 Example improvement title** — what's wrong / what could be better · `ScreenName.tsx:line` · raised YYYY-MM-DD by {name}

## Unclear / to investigate
Things that felt off, inconsistent, or where work got stuck. May turn into open questions or improvements once understood.

- **🟡 "Curated Bottle Club" name not 100% locked** — review went back and forth between keeping "Curated Club" and adding "Bottle" for clarity (Jim pushed descriptive). Shipped as **Curated Bottle Club**; confirm with the group · raised 2026-06-24
- **🟢 How to demo the create-charge paths** — Member Choice create has three outcomes. In the prototype: **`****0044`** card → declined; customer **Marvin McKinney** (no cards) → no-card pending; any other card → active. Documented for reviewers · [`AddMembershipScreen.tsx`](AddMembershipScreen.tsx) · 2026-06-24
- **🟡 Show payment method before a customer is picked?** — Donna noted the card section only appears once a customer is selected. Kept it gated on customer (whose cards otherwise?) but it now populates from the selected customer's cards on file. Revisit if it feels hidden · `AddMembershipScreen.tsx` · raised 2026-06-24
- **🔴 Example unclear title** — what's unclear · `ScreenName.tsx:line` · raised YYYY-MM-DD by {name}
