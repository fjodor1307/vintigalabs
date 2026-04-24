import { ProductLayout, SectionCard, Field, TextInput, TextArea } from './ProductLayout'

export function PosScreen() {
  return (
    <ProductLayout activeTab="pos">
      <SectionCard title="POS">
        <Field label="Title" helper="Leave blank to inherit the main product title. Edit to use a shorter label that fits POS screens.">
          <TextInput placeholder="Inherits main title (e.g. 26 Cab S)" />
        </Field>

        <Field label="Hook">
          <TextInput placeholder="Enter hook" />
        </Field>

        <Field label="Product pairings">
          <TextArea placeholder="Add food pairings (e.g., cheese, meats, dishes)" />
        </Field>

        <Field label="Tasting suggestions">
          <TextArea placeholder="Describe how to serve or taste this product" />
        </Field>

        <Field label="Upsell">
          <TextArea placeholder="Suggest related products or upgrades" />
        </Field>

        <Field label="Promotion">
          <TextArea placeholder="Add any discount, bundle, or promo details" />
        </Field>
      </SectionCard>
    </ProductLayout>
  )
}
