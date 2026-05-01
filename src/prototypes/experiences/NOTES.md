# Experiences — Notes

Designer scratchpad. Anything strange, unclear, or worth improving goes here. Keep entries short. Link to files/screens where relevant.

**Status key:** 🔴 open · 🟡 investigating · 🟢 resolved · ⚪ deferred

---

## Open questions

- 🔴 Modifiers — keep, drop, or reintroduce as upgrades? Brief doesn't list modifier groups; this prototype dropped the tab. If hospitality wants add-ons (extra glass, take-home bottle, host upgrade), this becomes "Upgrades" rather than "Modifiers".
- 🔴 SEO defaults — brief says Meta Title / Slug default from Product Title at creation. Should that be a one-time copy (editable later) or a live binding (slug always tracks title)? Live feels safer for brand-new experiences but breaks if anyone has shared a link mid-edit.
- 🔴 Status vs. Web Status — both exist in the brief (Available / Not Available). They live in different places (right rail Status / Website tab Web Status). Should they be combined, or is the split intentional (a private booking that's still bookable on POS)?
- 🟡 Vinta Connect import — which source fields map to Experience Type, Location, Duration, Lead Time, Requires Host?
- ⚪ Booking calendar — out of scope for this prototype. Lead Time is the only schedule field captured here.

## Improvements (post-MVP)

- Auto-fill SEO Meta Title and Slug from the Title field on first edit, with a "regenerate" link if the title changes later.
- Surface the experience's Department / Type / Duration as small summary chips under the title in the header (right now only the type name shows).
- "Requires Host" could expand into a host-picker once a roster exists.
- A duration field that supports common presets (30 / 60 / 90 / 120 min) plus a custom input would save typing.

## Unclear / ambiguous

- Brief lists Department both at variant level (optional) and as a Global Property at product level. Right now both exist — Global on Advanced, optional on the Variant modal. Confirm whether they're the same field or separate.
- "Compare at Price (not used)" — kept out of the Variant modal entirely. If billing later wants strikethrough pricing for an experience promo, this would need to come back.
