# Products — Notes

Designer scratchpad. Anything strange, unclear, or worth improving goes here. Keep entries short. Link to files/screens where relevant.

**Status key:** 🔴 open · 🟡 investigating · 🟢 resolved · ⚪ deferred

---

## Open questions
Things that need an answer from PM, research, or a stakeholder.

- **🔴 Catalogue listing screen** — no entry point currently. Need a list of products with a "New product" CTA that lands on General. Raised 2026-04-23 by Fedja.
- **🔴 Edit mode vs. add mode** — in the meeting Jim suggested "under edit, the product name should be obvious front and center" at the top. Not yet designed as a separate screen state. Raised 2026-04-23.
- **🔴 Product-type selection** — Advanced tab currently hard-coded to wine. When the tax type / department changes, the Advanced tab content should swap (beer profile, food kitchen-printer, experience dates / location / duration). How does the switch happen? Raised 2026-04-23.
- **🔴 AI generate scope** — added a placeholder "Generate content with AI" button under the Content editor on General. Real implementation (prompt, which fields feed it, how results flow back) not yet wired. Raised 2026-04-23.
- **⚪ POS title empty-state policy** — backend must fall back to the main product title when POS title is blank. Currently our POS form UI removes the asterisk and adds helper text, but the data-layer change is backend work. Deferred until backend ticket.

## Improvements
Things that work but could be better. Not blockers.

- **🔴 POS pairings as tag input** — `PosScreen.tsx` currently renders pairings / upsell / tasting suggestions as free-form textareas. Meeting note: ideally these become multi-select tag inputs that pull from the product catalogue (for upsell / pairings) and a free-tag field for food pairings. Keeping as textareas for now because "these are data inputs for the LLM" was the compromise.
- **🔴 Image upload** — only supports single-file placeholder. Real version needs: multi-image, drag-drop reorder, set-primary, alt text. `GeneralScreen.tsx` · raised 2026-04-23.
- **🔴 Variant editor** — "multiple variants can be added after the product is created" per the InfoBanner. No variant editor built yet. `GeneralScreen.tsx` · raised 2026-04-23.

## Unclear / to investigate
Things that felt off, inconsistent, or where work got stuck. May turn into open questions or improvements once understood.

- **🟡 Subtitle / Teaser distinction on Website tab** — Figma has both. Are they for different surfaces (e.g. subtitle on product page hero, teaser on collection page listing)? Helper text says teaser is "displayed on the product collection page online" — subtitle purpose unconfirmed.
- **🟡 Tax Type vs. Department** — both exist (Tax Type on General in Variants & Pricing, Department on Advanced). Are these redundant? Or does Tax Type drive tax calculation while Department drives catalogue organisation?
