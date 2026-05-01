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
        <Field label="Variant Title" required helper="Defaults to “each”. Use a label like “Premium” or “Group of 6” when an experience has multiple options.">
          <TextInput
            placeholder="each"
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="Cost">
            <InputWithAdornment
              adornment="$"
              placeholder="0.00"
              value={v.cost}
              onChange={(e) => patch('cost', e.target.value)}
            />
          </Field>
          <Field label="Sort Order">
            <TextInput
              placeholder="0"
              value={v.sortOrder}
              onChange={(e) => patch('sortOrder', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tax Type" required>
            <Select
              value={v.taxType}
              onChange={(x) => patch('taxType', x)}
              options={['Experience', 'Service', 'Tour', 'Tasting', 'Non-Taxable']}
            />
          </Field>
          <Field label="Department" helper="Optional.">
            <TextInput
              placeholder="e.g. Hospitality"
              value={v.department}
              onChange={(e) => patch('department', e.target.value)}
            />
          </Field>
        </div>

        <CheckboxField
          checked={v.redeemableWithLoyalty}
          onChange={(next) => patch('redeemableWithLoyalty', next)}
        >
          Redeemable with Loyalty Points
        </CheckboxField>
      </div>
    </Modal>
  )
}
