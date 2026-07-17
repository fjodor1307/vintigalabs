import { useEffect, useState } from 'react'
import { Modal, ModalButtonSecondary, ModalButtonPrimary } from './Modal'
import { VariantFields } from './VariantFields'
import { productActions, useProductState, emptyVariant, type Variant } from './productStore'

interface VariantModalProps {
  open: boolean
  onClose: () => void
  initial?: Variant | null
}

export function VariantModal({ open, onClose, initial }: VariantModalProps) {
  const product = useProductState()
  const isExperience = product.productType === 'Experience' || product.department === 'Experience'
  const isSpirits = product.productTypeOverride === 'Spirits'

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
        <VariantFields v={v} patch={patch} isExperience={isExperience} isSpirits={isSpirits} showSortOrder autoFocusTitle />
      </div>
    </Modal>
  )
}
