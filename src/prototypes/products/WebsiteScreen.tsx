import { useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput, TextArea, Select } from './ProductLayout'
import { AiSuggestButton } from './AiSuggestButton'
import { useProductState, productActions } from './productStore'

// ─── WebsiteScreen ────────────────────────────────────────────────────────────
// Web-channel fields. Web Status options match the Experience spec
// (Available / Not Available). Subtitle / Teaser are bound to the store. SEO
// Meta Tag Title and Slug auto-populate from the product Name until the user
// types into them — see `productActions.setName` for the cascade.

export function WebsiteScreen() {
  const product = useProductState()
  const [generating, setGenerating] = useState(false)
  const fakeGen = () => { setGenerating(true); setTimeout(() => setGenerating(false), 500) }

  return (
    <ProductLayout activeTab="website">
      <SectionCard title="Website">
        <Field label="Web Status">
          <Select
            value={product.webStatus}
            onChange={(v) => productActions.setWebStatus(v as typeof product.webStatus)}
            options={['Available', 'Not Available']}
          />
        </Field>

        <Field
          label="Subtitle"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextInput
            placeholder="Enter subtitle"
            value={product.subtitle}
            onChange={(e) => productActions.setSubtitle(e.target.value)}
          />
        </Field>

        <Field
          label="Teaser"
          helper="Displayed on the product collection page online"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextArea
            placeholder="Enter teaser"
            value={product.teaser}
            onChange={(e) => productActions.setTeaser(e.target.value)}
          />
        </Field>
      </SectionCard>

      <SectionCard title="SEO">
        <Field
          label="Meta Tag Title"
          helper={product.metaTitleAuto ? 'Defaults to the product name. Edit to override.' : undefined}
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextInput
            placeholder="Enter title"
            value={product.metaTitle}
            onChange={(e) => productActions.setMetaTitle(e.target.value)}
          />
        </Field>

        <Field
          label="Meta Tag Description"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextArea
            placeholder="Enter description"
            value={product.metaDescription}
            onChange={(e) => productActions.setMetaDescription(e.target.value)}
          />
        </Field>

        <Field
          label="Slug"
          helper={product.slugAuto ? 'Defaults to the product name with spaces replaced by "-". Edit to override.' : undefined}
        >
          <TextInput
            placeholder="Enter slug"
            value={product.slug}
            onChange={(e) => productActions.setSlug(e.target.value)}
          />
        </Field>
      </SectionCard>
    </ProductLayout>
  )
}
