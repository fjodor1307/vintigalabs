import { ProductLayout, SectionCard, Field, Select, TextInput } from './ProductLayout'
import { TagPicker } from './TagPicker'
import { useProductState, productActions, BEER_STYLES_BY_FAMILY, BEER_TAGS, type BeerFamily } from './productStore'

const ALL_BEER_STYLES: string[] = (Object.keys(BEER_STYLES_BY_FAMILY) as BeerFamily[])
  .flatMap((family) => BEER_STYLES_BY_FAMILY[family])

export function BeerScreen() {
  const product = useProductState()

  return (
    <ProductLayout activeTab="beer">
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

      <SectionCard title="Attribute tags">
        <p className="typo-body-sm text-vintiga-slate-500">
          Pick any descriptors that apply. Used for filtering and recommendations.
        </p>
        <TagPicker tags={BEER_TAGS} selected={product.beerTags} onToggle={productActions.toggleBeerTag} />
      </SectionCard>
    </ProductLayout>
  )
}
