import { useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput, TextArea } from './ProductLayout'
import { AiSuggestButton } from './AiSuggestButton'

export function PosScreen() {
  const [generating, setGenerating] = useState(false)
  const fakeGen = () => { setGenerating(true); setTimeout(() => setGenerating(false), 500) }

  return (
    <ProductLayout activeTab="pos">
      <SectionCard title="POS">
        <Field label="POS Title" helper="Leave blank to inherit the main experience title. Use a shorter label when the full name won't fit on the POS.">
          <TextInput placeholder="Inherits main title (e.g. Reserve Tasting)" />
        </Field>

        <Field
          label="POS Hook"
          helper="A one-liner the host can lead with at the till."
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextInput placeholder="Enter hook" />
        </Field>

        <Field
          label="Product Pairings"
          helper="Wines, food, or merch that go well alongside this experience."
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextArea placeholder="Add pairings (e.g. estate Cab, cheese plate, take-home magnum)" />
        </Field>

        <Field
          label="Tasting Suggestions"
          helper="What the host should pour, when, and why."
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextArea placeholder="Describe how to taste, pace, or guide guests through the experience" />
        </Field>

        <Field
          label="Upsell"
          helper="Add-ons or upgrades to offer at the till."
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextArea placeholder="Suggest upgrades (e.g. premium flight, private guide, take-home bottle)" />
        </Field>

        <Field label="Promotions">
          <TextArea placeholder="Add any discount, bundle, or seasonal promo to surface on POS" />
        </Field>
      </SectionCard>
    </ProductLayout>
  )
}
