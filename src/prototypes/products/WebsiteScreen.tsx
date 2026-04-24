import { ProductLayout, SectionCard, Field, TextInput, TextArea } from './ProductLayout'

export function WebsiteScreen() {
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

        <Field label="Subtitle">
          <TextInput placeholder="Enter subtitle" />
        </Field>

        <Field label="Teaser" helper="Displayed on the product collection page online">
          <TextArea placeholder="Enter teaser" />
        </Field>
      </SectionCard>

      <SectionCard title="SEO">
        <Field label="Meta Tag Title">
          <TextInput placeholder="Enter title" />
        </Field>

        <Field label="Meta Tag Description">
          <TextArea placeholder="Enter description" />
        </Field>

        <Field label="Slug">
          <TextInput placeholder="Enter slug" />
        </Field>
      </SectionCard>
    </ProductLayout>
  )
}
