# Products — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** Figma — *05. Dashboard* file (see links in Sources)
**Last synced:** 2026-04-23 by Fedja
**Owner:** Fedja
**Status:** in-progress

---

## Why this exists

The current product-creation flow in Vintiga is confusing for new users. Required fields are scattered across tabs, the variant title defaults to blank, SEO fields go untouched, and the experience is poor whether the operator is entering a product manually or importing one via Vinta Connect. This redesign consolidates required fields on the first tab, simplifies titles from three to two, and introduces tab-level scoping (POS / Website / Advanced) so operators can focus on what matters for the channel they care about.

Success: a new operator can create a complete product — wine, beer, food, or experience — without backtracking between tabs or hitting a blank-title edge case.

## Who it's for

- **Primary persona:** internal staff / operators managing a Vintiga venue's catalogue. Persona file TBD — add to `_context/personas/` once defined.
- **Secondary persona:** Vinta Connect import users, who get the same redesigned form populated from an external source.

## Pillars this advances

- [ ] Product setup friction — cuts confusion for first-time product creation
- [ ] Channel-specific UX — splits POS / Website / Advanced into tabs scoped to each surface
- [ ] AI-ready data model — fields feed downstream AI (summaries, pairings, recommendations) rather than being display-only

## Key user stories

- As an operator creating a new product, I want all required fields surfaced on the first tab so I don't have to hunt through tabs or miss fields.
- As an operator, I want the variant title to default to "each" so I don't have to remember to fill it in.
- As an operator, I want one main product title (used on web and as the default POS title) instead of three separate title fields.
- As an operator editing a POS title, I want a shorter variant to fit POS display constraints, editable independently of the main title.
- As an operator, I want advanced fields (wine tasting profile, beer profile, kitchen printer, experience dates) only when they apply to the product type.
- As an operator, I want AI to help generate content teasers, product pairings, and descriptions from the data I've already entered.

## Requirements & constraints

**General tab (consolidated required fields):**
- Product name (main title) — required
- Images (right-aligned) — required
- Price — required
- SKU — required
- Content description — required (moved here from Website tab)
- Variant title — pre-populated with "each"

**POS tab:**
- POS title — shorter, defaults to main title but editable
- Product pairings — free-form / tag-based
- Tasting suggestions — free-form
- Hooks — free-form
- Notes: these fields feed AI summary generation downstream

**Website tab:**
- Subtitle
- Teaser
- SEO (meta title, meta description, URL slug)
- Content field **removed** — lives on General tab now
- Website inherits the main product title automatically

**Advanced tab (product-type-specific):**
- Wine → tasting profile (region, appellation, varietals, tasting notes)
- Beer → beer profile (style, ABV, IBU, hops, etc.)
- Food → kitchen printer assignments
- Experience → dates, location, duration

**Title management:**
- Two titles only: main product title + POS title
- POS title is pre-populated from main title and editable separately
- Website inherits main title automatically — no separate field

**AI integration opportunities (not necessarily in this prototype):**
- Auto-generate content teasers and descriptions
- Suggest product pairings from wine region / appellation / varietals
- Backend AI recommendations for related products
- Treat current fields as data inputs for AI, not just display copy

## Open dependencies

- Persona file not written yet — capture operator persona in `_context/personas/` when defined
- Wine / beer / food / experience product-type data model needs confirming (what fields belong in each Advanced section)
- Vinta Connect import mapping — which source fields populate which redesigned fields
- AI integration scope for this prototype — is AI generation in-scope for the first iteration or later?

## Sources

- **Figma — Dashboard file:**
  - Overview: https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=4803-39955
  - Frame 2:   https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=4856-15519
  - Frame 3:   https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=4856-16047
- **Raw brief:** see `## Raw paste` below

## Deeper materials → `_context/` subfolder

Drop Figma frame exports, AI prompt experiments, wine/beer reference data, Vinta Connect field mapping, and anything else prototype-specific into `src/prototypes/products/_context/`.

---

## Raw paste (original brief from Fedja, 2026-04-23)

### Product Setup Workflow Issues

- Current product creation flow is problematic for new users
  - Users get confused navigating between required fields
  - Variant title defaults to blank instead of "each"
  - SEO fields remain empty
  - Poor experience for both manual entry and Vinta Connect imports
- Fedja's latest design addresses major pain points
  - Moves images to right side for better space utilization
  - Consolidates required fields on first tab
  - Reduces white space and content area size

### Redesigned Product Page Structure

- General tab contains all required fields
  - Product name, images (right-aligned), price, SKU
  - Content description (kept here, removed from website tab)
  - Variant title pre-populated with "each" as default
- POS tab for point-of-sale customization
  - POS-specific title (shorter for space constraints)
  - Product pairings, tasting suggestions, hooks
  - Fields inform AI summary generation
- Website tab for online presentation
  - Subtitle, teaser, SEO optimization
  - Content field removed (handled in General tab)
- Advanced tab for product-specific fields
  - Wine: tasting profiles
  - Beer: beer profiles
  - Food: kitchen printer assignments
  - Experience: dates, locations, duration

### Title Management Simplification

- Reduced from three titles to two
  - Main product title (shared with website)
  - POS title (abbreviated for display constraints)
- POS title pre-filled with main title, editable separately
- Website inherits main product title automatically
- Eliminates confusion around multiple title fields

### AI Integration Opportunities

- Generate content teasers and descriptions automatically
- Product pairing suggestions based on entered details
- Leverage wine region, appellation data for richer descriptions
- Backend AI recommendations for related products
- Current fields become data inputs for AI rather than display fields
