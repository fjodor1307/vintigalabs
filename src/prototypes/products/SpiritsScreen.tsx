import { ProductLayout, SectionCard, Field, Select, TextInput } from './ProductLayout'
import { TagPicker } from './TagPicker'
import { useProductState, productActions, SPIRITS_STYLES_BY_FAMILY, SPIRITS_TAGS, type SpiritsFamily } from './productStore'

const ALL_SPIRITS_STYLES: string[] = (Object.keys(SPIRITS_STYLES_BY_FAMILY) as SpiritsFamily[])
  .flatMap((family) => SPIRITS_STYLES_BY_FAMILY[family])

export function SpiritsScreen() {
  const product = useProductState()

  return (
    <ProductLayout activeTab="spirits">
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

      <SectionCard title="Attribute tags">
        <p className="typo-body-sm text-vintiga-slate-500">
          Pick any descriptors that apply. Used for filtering and recommendations.
        </p>
        <TagPicker tags={SPIRITS_TAGS} selected={product.spiritsTags} onToggle={productActions.toggleSpiritsTag} />
      </SectionCard>
    </ProductLayout>
  )
}
