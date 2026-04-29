import { useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput, TextArea } from './ProductLayout'
import { AiSuggestButton } from './AiSuggestButton'

export function PosScreen() {
  const [generating, setGenerating] = useState(false)
  const fakeGen = () => { setGenerating(true); setTimeout(() => setGenerating(false), 500) }

  return (
    <ProductLayout activeTab="pos" onGenerate={fakeGen} generating={generating}>
      <SectionCard title="POS">
        <Field label="Title" helper="Leave blank to inherit the main product title. Edit to use a shorter label that fits POS screens.">
          <TextInput placeholder="Inherits main title (e.g. 26 Cab S)" />
        </Field>

        <Field
          label="Hook"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} />}
        >
          <TextInput placeholder="Enter hook" />
        </Field>

        <Field
          label="Product pairings"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} />}
        >
          <TextArea placeholder="Add food pairings (e.g., cheese, meats, dishes)" />
        </Field>

        <Field
          label="Tasting suggestions"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} />}
        >
          <TextArea placeholder="Describe how to serve or taste this product" />
        </Field>

        <Field
          label="Upsell"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} />}
        >
          <TextArea placeholder="Suggest related products or upgrades" />
        </Field>

        <Field label="Promotion">
          <TextArea placeholder="Add any discount, bundle, or promo details" />
        </Field>
      </SectionCard>
    </ProductLayout>
  )
}
