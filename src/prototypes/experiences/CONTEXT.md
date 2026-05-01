# Experiences — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** Vintiga product brief — Product Experience (2026-04-30)
**Last synced:** 2026-04-30 by Fedja
**Owner:** Fedja
**Status:** in-progress

---

## Why this exists

An experience is a non-physical product — a tasting, tour, workshop, or other bookable event — with attributes and value unique to the experience (location, duration, lead time, host requirement) and not shared with physical products. Operators currently have to use the generic product editor for experiences, which surfaces fields they don't need (UPC, weight, kitchen prep, vendor) and hides fields they do (lead time, host requirement, default location).

This prototype takes the products editor as a base and pares it down to what an experience actually needs: clearer required fields on General, an Experience Properties card on Advanced, simplified variants without physical-goods cruft, and POS / Website / SEO copy specific to a bookable experience.

Success: an operator can publish a complete experience — title, image, content, one variant, location, duration, lead time, host requirement — without leaving the editor or filling in fields that don't apply.

## Who it's for

- **Primary persona:** internal staff / operators publishing experiences (tasting room manager, hospitality lead).
- **Secondary persona:** Vinta Connect import users mapping external experience listings into Vintiga.

## Key user stories

- As an operator, I want all required fields for an experience surfaced on the first tab — title, image, content, at least one variant.
- As an operator, I want the variant title to default to "each" so a single-tier experience publishes without thinking.
- As an operator, I want experience-specific fields (Type, Location, Default Location, Duration, Lead Time, Requires Host) on the Advanced tab — not hidden under wine / beer profiles.
- As an operator, I want the POS tab to surface the fields the host actually uses at the till — POS Title, Hook, Pairings, Tasting Suggestions, Upsell, Promotions.
- As an operator, I want to flag whether an experience is redeemable with loyalty points at the variant level.
- As an operator, I want SEO meta + slug to default from the experience title.

## Requirements & constraints

**Shared with all product types:**
- Title · Content · Subtitle · Teaser · Image(s) · Status · Web Status
- Variants (≥1 required)

**Experience-specific (Advanced tab):**
- Experience Type — Tasting | Tour | Other
- Location · Default Location
- Duration (minutes)
- Lead time (hours)
- Requires Host (yes/no)

**Variant fields (subset of physical-product variants):**
- Variant Title (defaults to "each")
- SKU · Price · Cost · Sort Order · Tax Type · Department (optional)
- Redeemable with Loyalty Points (TRUE/FALSE)
- _Not used:_ UPC Code, Weight, Compare-at Price

**Hidden for experiences (don't render):**
- Physical Product · Kitchen Tickets · Kitchen Ticket Location · Vendor · Website Product Template · Compliance Override Operating Countries

**Vintiga-only POS fields (not in C7):**
- POS Title · POS Hook · Product Pairings · Tasting Suggestions · Upsell · Promotions

**Associations:**
- Collections (one or many)

**Defaults:**
- SEO Meta Tag → Product Title
- SEO Slug → Product Title with hyphens

## Open dependencies

- Confirm whether modifier groups apply to experiences (the products prototype has them — this version drops them; revisit if upgrades / add-ons emerge as a real need).
- Booking calendar / availability — out of scope for this editor. Lead Time is captured here; the actual schedule lives elsewhere.
- Vinta Connect mapping for experiences — which source fields populate Type / Location / Duration / etc.
- AI generation scope — placeholder buttons for Hook, Pairings, Tasting Suggestions, Upsell are wired but stubbed.

## Sources

- **Product brief:** Product Experience (Fedja, 2026-04-30) — pasted below under `## Raw paste`.
- **Sibling prototype:** [`src/prototypes/products/`](../products/) — this prototype was cloned from products and adapted; structural decisions (header, right rail, tab layout, image upload) are inherited.

## Deeper materials → `_context/` subfolder

Drop any field-mapping spreadsheets, Figma frames, or Vinta Connect references for experiences into `src/prototypes/experiences/_context/`.

---

## Raw paste (original brief from Fedja, 2026-04-30)

### Product Experience

An experience is a type of non-physical product that has attributes and value unique to the experience, and not shared with other products.

**The experience is defined by**

Attributes Shared with all product types:

- Title
- Content
- SubTitle
- Teaser
- Image(s)
- Status (Available | Not Available)
- Web Status (Available | Not Available)
- Variants (1 required)
  - Variant Title
  - SKU
  - Price
  - Cost
  - Sort Order
  - Tax Type
  - Compare at Price (not used)
  - UPC Code (not used)
  - Weight (not used)
  - Redeemable with Loyalty Points (TRUE|FALSE)
  - Department (optional)
  - SEO Meta Tag (at creation, use Product Title)
  - SEO Meta Tag Description
  - SEO Slug (at creation, use Product Title with "-" for spaces)

Attributes specific to Experiences:

- Experience Type (Tasting | Tour | Other)
- Location
- Default Location
- Duration (in minutes)
- Lead time (in hours)
- Requires Host (yes/no)

Attributes common to all products, but not used/displayed for experiences:

- Physical Product (FALSE)
- Kitchen Tickets Requires Prep (FALSE)
- Kitchen Ticket Location (NULL)
- Vendor (NULL)
- Website Product Template (NULL)
- Compliance Override Operating Countries (FALSE)

Attributes only provided in Vintiga Experiences (not C7):

- POS Title
- POS Hook
- Product Pairings
- Tasting Suggestions
- Upsell
- Promotions

Associated Objects:

- Collection(s). Can be associated with one or many
