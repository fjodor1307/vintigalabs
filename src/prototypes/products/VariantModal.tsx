import { useEffect, useState } from 'react'
import { Modal, ModalButtonSecondary, ModalButtonPrimary, CheckboxField } from './Modal'
import { Field, TextInput, InputWithAdornment, Select } from './ProductLayout'
import { productActions, emptyVariant, type Variant } from './productStore'

interface VariantModalProps {
  open: boolean
  onClose: () => void
  initial?: Variant | null
}

export function VariantModal({ open, onClose, initial }: VariantModalProps) {
  const [v, setV] = useState<Variant>(() => initial ?? emptyVariant())

  useEffect(() => {
    if (open) setV(initial ?? emptyVariant())
  }, [open, initial])

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

        <Field label="UPC Code">
          <TextInput
            placeholder="Enter UPC code"
            value={v.upcCode}
            onChange={(e) => patch('upcCode', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Compare At Price">
            <InputWithAdornment
              adornment="$"
              placeholder="0.00"
              value={v.compareAtPrice}
              onChange={(e) => patch('compareAtPrice', e.target.value)}
            />
          </Field>
          <Field label="Tax Type" required>
            <Select
              value={v.taxType}
              onChange={(x) => patch('taxType', x)}
              options={['Wine', 'Beer', 'Spirits', 'Food', 'Merchandise']}
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
          <Field label="Alcohol Percentage" required>
            <InputWithAdornment
              adornment="%"
              placeholder="0.00"
              value={v.alcoholPercentage}
              onChange={(e) => patch('alcoholPercentage', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Weight" required>
            <InputWithAdornment
              adornment="lbs"
              placeholder="0.00"
              value={v.weight}
              onChange={(e) => patch('weight', e.target.value)}
            />
          </Field>
          <Field label="Volume" required>
            <InputWithAdornment
              adornment="ml"
              placeholder="0.00"
              value={v.volume}
              onChange={(e) => patch('volume', e.target.value)}
            />
          </Field>
        </div>

        <CheckboxField
          checked={v.physicalProduct}
          onChange={(next) => patch('physicalProduct', next)}
        >
          Physical Product
        </CheckboxField>
      </div>
    </Modal>
  )
}
