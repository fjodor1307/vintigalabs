import { Field, TextInput, InputWithAdornment, Select } from './ProductLayout'
import { CheckboxField } from './Modal'
import { proofFromAbv, type Variant } from './productStore'

// The single source of truth for a variant's form fields — rendered by both
// the Add/Edit Variant modal and the inline single-variant form on the
// General tab, so the two surfaces can't drift apart. Experiences hide the
// UPC / compare-at / alcohol / shipping fields and get their own tax types,
// mirroring the spec.
interface VariantFieldsProps {
  v: Variant
  patch: <K extends keyof Variant>(key: K, value: Variant[K]) => void
  isExperience: boolean
  isSpirits: boolean
  /** Sort order only matters when there's more than one variant — the modal
   *  shows it, the inline single-variant form leaves it out. */
  showSortOrder?: boolean
  autoFocusTitle?: boolean
}

export function VariantFields({ v, patch, isExperience, isSpirits, showSortOrder = false, autoFocusTitle = false }: VariantFieldsProps) {
  return (
    <>
      <Field label="Variant Title" required>
        <TextInput
          placeholder={isExperience ? 'e.g. For 2, For 4, Private Tour' : 'e.g. 750ml, Bottle, Medium, Glass'}
          value={v.title}
          onChange={(e) => patch('title', e.target.value)}
          autoFocus={autoFocusTitle}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price" required>
          <InputWithAdornment adornment="$" placeholder="0.00" value={v.price} onChange={(e) => patch('price', e.target.value)} />
        </Field>
        <Field label="SKU" required>
          <TextInput placeholder="Enter SKU" value={v.sku} onChange={(e) => patch('sku', e.target.value)} />
        </Field>
      </div>

      {/* UPC, Compare At, Alcohol %, Weight, Volume — hidden for Experiences (spec). */}
      {!isExperience && (
        <Field label="UPC Code">
          <TextInput placeholder="Enter UPC code" value={v.upcCode} onChange={(e) => patch('upcCode', e.target.value)} />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-4">
        {!isExperience && (
          <Field label="Compare At Price">
            <InputWithAdornment adornment="$" placeholder="0.00" value={v.compareAtPrice} onChange={(e) => patch('compareAtPrice', e.target.value)} />
          </Field>
        )}
        <Field label="Tax Type" required>
          <Select
            value={v.taxType}
            onChange={(x) => patch('taxType', x)}
            options={isExperience
              ? ['Experience', 'Service', 'Tax-Exempt']
              : ['Wine', 'Beer', 'Spirits', 'Food', 'Merchandise']}
          />
        </Field>
      </div>

      {/* Cost Of Good pairs with Sort Order in the modal; without Sort Order
          (inline form) Alcohol Percentage moves up beside it so neither field
          sits on a half-empty row. */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cost Of Good" required>
          <InputWithAdornment adornment="$" placeholder="0.00" value={v.costOfGood} onChange={(e) => patch('costOfGood', e.target.value)} />
        </Field>
        {showSortOrder ? (
          <Field label="Sort Order" helper="Lower numbers appear first.">
            <input
              type="number"
              min={0}
              value={v.sortOrder}
              onChange={(e) => patch('sortOrder', Number(e.target.value) || 0)}
              className="h-10 w-full px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
            />
          </Field>
        ) : !isExperience && (
          <Field label="Alcohol Percentage" required>
            <InputWithAdornment adornment="%" placeholder="0.00" value={v.alcoholPercentage} onChange={(e) => patch('alcoholPercentage', e.target.value)} />
          </Field>
        )}
      </div>

      {!isExperience && (showSortOrder || isSpirits) && (
        <div className="grid grid-cols-2 gap-4">
          {showSortOrder && (
            <Field label="Alcohol Percentage" required>
              <InputWithAdornment adornment="%" placeholder="0.00" value={v.alcoholPercentage} onChange={(e) => patch('alcoholPercentage', e.target.value)} />
            </Field>
          )}
          {isSpirits && (
            <Field label="Proof" helper="Calculated automatically as 2 × alcohol percentage.">
              <InputWithAdornment adornment="proof" placeholder="0" value={proofFromAbv(v.alcoholPercentage)} readOnly />
            </Field>
          )}
        </div>
      )}

      {/* Physical Product gates Weight + Volume — those are only needed for
          shipping (Commerce 7 calls the flag "shipping" under the covers).
          Putting the checkbox first means turning it off hides the fields
          rather than discarding values the operator was forced to fill in.
          Experiences are never shipped, so the whole block disappears. */}
      {!isExperience && (
        <div className="flex flex-col gap-1.5">
          <CheckboxField checked={v.physicalProduct} onChange={(next) => patch('physicalProduct', next)}>
            Physical Product
          </CheckboxField>
          <p className="typo-caption text-vintiga-slate-500 pl-[26px]">
            Turn on for anything you ship — weight and volume are required to calculate shipping. Leave off for tasting-room-only items (a glass pour, a plate of food).
          </p>
        </div>
      )}

      {!isExperience && v.physicalProduct && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Weight" required>
            <InputWithAdornment adornment="lbs" placeholder="0.00" value={v.weight} onChange={(e) => patch('weight', e.target.value)} />
          </Field>
          <Field label="Volume" required>
            <InputWithAdornment adornment="ml" placeholder="0.00" value={v.volume} onChange={(e) => patch('volume', e.target.value)} />
          </Field>
        </div>
      )}
    </>
  )
}
