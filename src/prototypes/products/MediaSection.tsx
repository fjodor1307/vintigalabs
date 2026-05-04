import { useProductState, productActions } from './productStore'
import { Media } from '@ds/shared/Media'

// ─── MediaSection (products) ──────────────────────────────────────────────────
// Thin wrapper over the shared `@ds/shared/Media` component, wired up to the
// products store. The Media component itself was promoted out of this file —
// keep this shim only as long as old imports `from './MediaSection'` exist.

export function MediaSection() {
  const product = useProductState()
  return (
    <Media
      items={product.images}
      onUpload={(files) => productActions.addImages(files)}
      onRemove={(id) => productActions.removeImage(id)}
    />
  )
}
