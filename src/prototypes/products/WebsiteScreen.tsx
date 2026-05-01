import { useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput, TextArea } from './ProductLayout'
import { AiSuggestButton } from './AiSuggestButton'

export function WebsiteScreen() {
  const [generating, setGenerating] = useState(false)
  const fakeGen = () => { setGenerating(true); setTimeout(() => setGenerating(false), 500) }

  return (
    <ProductLayout activeTab="website">
      <SectionCard title="Website">
        <Field label="Web Status">
          <div className="relative">
            <select
              defaultValue="Available"
              className="h-10 w-full px-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 appearance-none focus:outline-none focus:border-vintiga-indigo-500"
            >
              <option>Available</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <span className="absolute top-1/2 -translate-y-1/2 right-3 text-vintiga-slate-400 pointer-events-none">▾</span>
          </div>
        </Field>

        <Field
          label="Subtitle"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextInput placeholder="Enter subtitle" />
        </Field>

        <Field
          label="Teaser"
          helper="Displayed on the product collection page online"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextArea placeholder="Enter teaser" />
        </Field>
      </SectionCard>

      <SectionCard title="SEO">
        <Field
          label="Meta Tag Title"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextInput placeholder="Enter title" />
        </Field>

        <Field
          label="Meta Tag Description"
          action={<AiSuggestButton onClick={fakeGen} generating={generating} iconOnly />}
        >
          <TextArea placeholder="Enter description" />
        </Field>

        <Field label="Slug">
          <TextInput placeholder="Enter slug" />
        </Field>
      </SectionCard>
    </ProductLayout>
  )
}
