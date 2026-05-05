import { useEffect, useState } from 'react'
import { Modal, ModalButtonSecondary, ModalButtonPrimary, CheckboxField } from './Modal'
import { Field, TextInput, InputWithAdornment, Select } from './ProductLayout'
import { productActions, useProductState, emptyVariant, type Variant } from './productStore'

interface VariantModalProps {
  open: boolean
  onClose: () => void
  initial?: Variant | null
}

export function VariantModal({ open, onClose, initial }: VariantModalProps) {
  const product = useProductState()
  const isExperience = product.productType === 'Experience' || product.department === 'Experience'

  const [v, setV] = useState<Variant>(() => {
    const seed = initial ?? emptyVariant('', product.variants.length)
    // Force physicalProduct = false for experiences (spec) — non-physical product.
    return isExperience ? { ...seed, physicalProduct: false } : seed
  })

  useEffect(() => {
    if (open) {
      const seed = initial ?? emptyVariant('', product.variants.length)
      setV(isExperience ? { ...seed, physicalProduct: false } : seed)
    }
  }, [open, initial, isExperience, product.variants.length])

  function patch<K extends keyof Variant>(key: K, value: Variant[K]) {
    setV((prev) => ({ ...prev, [key]: value }))
  }

  function save() {
    productActions.upsertVariant(v)
    onClose()
  }

  const title = initial ? 'Edit Variant' : 'Add Variant'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex items-center gap-3 ml-auto">
          <ModalButtonSecondary onClick={onClose}>Cancel</ModalButtonSecondary>
          <ModalButtonPrimary onClick={save}>Save</ModalButtonPrimary>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <Field label="Variant Title" required>
          <TextInput
            placeholder="Enter title"
            value={v.title}
            onChange={(e) => patch('title', e.target.value)}
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price" required>
            <InputWithAdornment
              adornment="$"
              placeholder="0.00"
              value={v.price}
              onChange={(e) => patch('price', e.target.value)}
            />
          </Field>
          <Field label="SKU" required>
            <TextInput
              placeholder="Enter SKU"
              value={v.sku}
              onChange={(e) => patch('sku', e.target.value)}
            />
          </Field>
        </div>

        {/* UPC, Compare At, Weight, Volume, Alcohol % — hidden for Experiences (spec). */}
        {!isExperience && (
          <Field label="UPC Code">
            <TextInput
              placeholder="Enter UPC code"
              value={v.upcCode}
              onChange={(e) => patch('upcCode', e.target.value)}
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          {!isExperience && (
            <Field label="Compare At Price">
              <InputWithAdornment
                adornment="$"
                placeholder="0.00"
                value={v.compareAtPrice}
                onChange={(e) => patch('compareAtPrice', e.target.value)}
              />
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="Cost Of Good" required>
            <InputWithAdornment
              adornment="$"
              placeholder="0.00"
              value={v.costOfGood}
              onChange={(e) => patch('costOfGood', e.target.value)}
            />
          </Field>
          <Field label="Sort Order" helper="Lower numbers appear first.">
            <input
              type="number"
              min={0}
              value={v.sortOrder}
              onChange={(e) => patch('sortOrder', Number(e.target.value) || 0)}
              className="h-10 w-full px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
            />
          </Field>
        </div>

        {!isExperience && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Alcohol Percentage" required>
              <InputWithAdornment
                adornment="%"
                placeholder="0.00"
                value={v.alcoholPercentage}
                onChange={(e) => patch('alcoholPercentage', e.target.value)}
              />
            </Field>
            <Field label="Weight" required>
              <InputWithAdornment
                adornment="lbs"
                placeholder="0.00"
                value={v.weight}
                onChange={(e) => patch('weight', e.target.value)}
              />
            </Field>
          </div>
        )}

        {!isExperience && (
          <Field label="Volume" required>
            <InputWithAdornment
              adornment="ml"
              placeholder="0.00"
              value={v.volume}
              onChange={(e) => patch('volume', e.target.value)}
            />
          </Field>
        )}

        {!isExperience && (
          <CheckboxField
            checked={v.physicalProduct}
            onChange={(next) => patch('physicalProduct', next)}
          >
            Physical Product
          </CheckboxField>
        )}
      </div>
    </Modal>
  )
}
