import { useProductState, productActions } from './productStore'
import { SectionCard, Field, Select } from './ProductLayout'

// ─── GlobalPropertiesCard ─────────────────────────────────────────────────────
// The Commerce 7 fields that live on every product regardless of type
// (Department · Brand / Vendor · Sales Attribute). Shared by the Beer and
// Spirits Details tabs so they stay in lock-step. None of these are required —
// every dropdown leads with a non-selection ("—") option.

const DEPARTMENTS = ['', 'Wine', 'Beer', 'Spirits', 'Food', 'Merchandise']

// "Brand / Vendor" is the label a wine is sold under — a single winery often
// carries several brands. So this is a brand picker, not a supplier list.
const BRANDS = ['', 'Vintiga Estate', 'Willow Glen', 'Cedar & Stone', 'Lakeview Cellars', 'Old Vine Reserve']

const SALES_ATTRIBUTES = ['', 'Retail', 'Restaurant', 'Wholesale', 'Club', 'Event']

export function GlobalPropertiesCard() {
  const product = useProductState()
  return (
    <SectionCard title="Global properties">
      <p className="typo-body-sm text-vintiga-slate-500">
        Synced with Commerce 7 — used for accounting, reporting, and POS routing. All optional.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Department">
          <Select
            value={product.department}
            onChange={(v) => productActions.setAdvanced({ department: v })}
            options={DEPARTMENTS}
          />
        </Field>
        <Field label="Brand / Vendor" helper="The label this wine is sold under. A winery may carry several brands.">
          <Select
            value={product.vendor}
            onChange={(v) => productActions.setAdvanced({ vendor: v })}
            options={BRANDS}
          />
        </Field>
        <Field label="Sales Attribute" helper="How this product is classified for sales reporting.">
          <Select
            value={product.salesAttribute}
            onChange={(v) => productActions.setAdvanced({ salesAttribute: v })}
            options={SALES_ATTRIBUTES}
          />
        </Field>
      </div>
    </SectionCard>
  )
}
