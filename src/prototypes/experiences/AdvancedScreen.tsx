import { ProductLayout, SectionCard, Field, Select, TextInput } from './ProductLayout'
import { Checkbox } from '@ds/shared/Checkbox'
import { useProductState, productActions, type ExperienceType } from './productStore'
import { GlobeIcon, CalendarIcon } from '@ds/icons/Icons'

const EXPERIENCE_TYPES: ExperienceType[] = ['Tasting', 'Tour', 'Other']

const LOCATIONS = [
  'Estate Tasting Room',
  'Barrel Room',
  'Vineyard',
  'Garden Patio',
  'Private Cellar',
  'Off-site',
]

export function AdvancedScreen() {
  const product = useProductState()

  return (
    <ProductLayout activeTab="advanced">
      {/* ── Global Properties ── */}
      <SectionCard title="Global Properties" icon={<GlobeIcon className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department">
            <Select
              value={product.department}
              onChange={(v) => productActions.setAdvanced({ department: v })}
              options={['Experience', 'Hospitality', 'Tasting Room', 'Events']}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Experience Properties ── */}
      <SectionCard title="Experience Properties" icon={<CalendarIcon className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Experience Type" required>
            <Select
              value={product.experienceType}
              onChange={(v) => productActions.setAdvanced({ experienceType: v as ExperienceType })}
              options={EXPERIENCE_TYPES}
            />
          </Field>
          <Field label="Default Location" helper="Pre-fills new bookings.">
            <Select
              value={product.defaultLocation}
              onChange={(v) => productActions.setAdvanced({ defaultLocation: v })}
              options={LOCATIONS}
            />
          </Field>
        </div>

        <Field label="Location" helper="Where this experience takes place. Override per-booking if needed.">
          <Select
            value={product.location}
            onChange={(v) => productActions.setAdvanced({ location: v })}
            options={LOCATIONS}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Duration" required helper="How long the experience runs, in minutes.">
            <div className="relative">
              <TextInput
                placeholder="60"
                inputMode="numeric"
                value={product.durationMinutes}
                onChange={(e) => productActions.setAdvanced({ durationMinutes: e.target.value })}
                className="w-full pr-16"
              />
              <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">minutes</span>
            </div>
          </Field>
          <Field label="Lead Time" helper="How far in advance bookings must be made.">
            <div className="relative">
              <TextInput
                placeholder="24"
                inputMode="numeric"
                value={product.leadTimeHours}
                onChange={(e) => productActions.setAdvanced({ leadTimeHours: e.target.value })}
                className="w-full pr-16"
              />
              <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">hours</span>
            </div>
          </Field>
        </div>

        <Field label="Requires Host">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={product.requiresHost}
              onChange={(next) => productActions.setAdvanced({ requiresHost: next })}
            />
            <span className="typo-body-sm text-vintiga-slate-700">A host must be assigned to each booking.</span>
          </label>
        </Field>
      </SectionCard>
    </ProductLayout>
  )
}
