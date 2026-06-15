import { ProductLayout, SectionCard, Field, Select, TextInput } from './ProductLayout'
import { TagPicker } from './TagPicker'
import {
  useProductState,
  productActions,
  BEER_STYLES_BY_FAMILY,
  BEER_TASTE,
  BEER_QUALIFIERS,
  type BeerFamily,
} from './productStore'

const ALL_BEER_STYLES: string[] = (Object.keys(BEER_STYLES_BY_FAMILY) as BeerFamily[])
  .flatMap((family) => BEER_STYLES_BY_FAMILY[family])

// Sales attribute mirrors Commerce 7's per-product classification.
const SALES_ATTRIBUTES = ['', 'Retail', 'Restaurant', 'Wholesale', 'Club', 'Event']

export function BeerScreen() {
  const product = useProductState()

  return (
    <ProductLayout activeTab="beer">
      {/* Commerce 7 fields that live on every product, regardless of type. */}
      <SectionCard title="Global properties">
        <p className="typo-body-sm text-vintiga-slate-500">
          Synced with Commerce 7 — used for accounting, reporting, and POS routing.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department">
            <Select
              value={product.department}
              onChange={(v) => productActions.setAdvanced({ department: v })}
              options={['Wine', 'Beer', 'Spirits', 'Food', 'Merchandise']}
            />
          </Field>
          <Field label="Vendor">
            <Select
              value={product.vendor}
              onChange={(v) => productActions.setAdvanced({ vendor: v })}
              options={['Wine', 'House', 'Imported', 'Local']}
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

      <SectionCard title="Beer classification">
        <p className="typo-body-sm text-vintiga-slate-500">
          Commerce7 sees this as Wine — these fields live only in Vintiga and drive filtering, POS display, and merchandising.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Beer Style" required helper="Picks the family for you.">
            <Select
              value={product.beerStyle || ''}
              onChange={(v) => productActions.setBeerStyle(v)}
              options={['', ...ALL_BEER_STYLES]}
            />
          </Field>
          <Field label="Beer Family" helper="Auto-assigned from the selected Style.">
            <TextInput value={product.beerFamily} readOnly placeholder="—" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Tasting Profile">
        <p className="typo-body-sm text-vintiga-slate-500">
          How it tastes. Drives website filtering and recommendations. Pick any that apply.
        </p>
        <TagPicker tags={BEER_TASTE} selected={product.beerTags} onToggle={productActions.toggleBeerTag} />
      </SectionCard>

      <SectionCard title="Tags">
        <p className="typo-body-sm text-vintiga-slate-500">
          Release and serve qualifiers — e.g. seasonal, barrel-aged, nitro.
        </p>
        <TagPicker tags={BEER_QUALIFIERS} selected={product.beerTags} onToggle={productActions.toggleBeerTag} />
      </SectionCard>
    </ProductLayout>
  )
}
