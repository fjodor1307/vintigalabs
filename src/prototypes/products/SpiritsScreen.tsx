import { ProductLayout, SectionCard, Field, Select, TextInput } from './ProductLayout'
import { TagPicker } from './TagPicker'
import {
  useProductState,
  productActions,
  SPIRITS_STYLES_BY_FAMILY,
  SPIRITS_TASTE,
  SPIRITS_QUALIFIERS,
  type SpiritsFamily,
} from './productStore'

const ALL_SPIRITS_STYLES: string[] = (Object.keys(SPIRITS_STYLES_BY_FAMILY) as SpiritsFamily[])
  .flatMap((family) => SPIRITS_STYLES_BY_FAMILY[family])

const SALES_ATTRIBUTES = ['', 'Retail', 'Restaurant', 'Wholesale', 'Club', 'Event']

export function SpiritsScreen() {
  const product = useProductState()

  return (
    <ProductLayout activeTab="spirits">
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

      <SectionCard title="Spirits classification">
        <p className="typo-body-sm text-vintiga-slate-500">
          Commerce7 sees this as Wine — these fields live only in Vintiga and drive filtering, POS display, and merchandising.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Spirits Style" required helper="Picks the family for you.">
            <Select
              value={product.spiritsStyle || ''}
              onChange={(v) => productActions.setSpiritsStyle(v)}
              options={['', ...ALL_SPIRITS_STYLES]}
            />
          </Field>
          <Field label="Spirits Family" helper="Auto-assigned from the selected Style.">
            <TextInput value={product.spiritsFamily} readOnly placeholder="—" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Tasting Profile">
        <p className="typo-body-sm text-vintiga-slate-500">
          How it tastes. Drives website filtering and recommendations. Pick any that apply.
        </p>
        <TagPicker tags={SPIRITS_TASTE} selected={product.spiritsTags} onToggle={productActions.toggleSpiritsTag} />
      </SectionCard>

      <SectionCard title="Tags">
        <p className="typo-body-sm text-vintiga-slate-500">
          Release and production qualifiers — e.g. small batch, cask strength, limited release.
        </p>
        <TagPicker tags={SPIRITS_QUALIFIERS} selected={product.spiritsTags} onToggle={productActions.toggleSpiritsTag} />
      </SectionCard>
    </ProductLayout>
  )
}
