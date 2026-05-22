import { ClubEditorLayout } from './ClubEditorLayout'
import { useClubState, clubActions, type ClubDraft } from './clubStore'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Checkbox } from '@ds/shared/Checkbox'
import { Textarea } from '@ds/shared/Textarea'
import { RichTextEditor } from '@ds/shared/RichTextEditor'
import { Tag } from '@ds/shared/Tag'
import { Media } from '@ds/shared/Media'
// ─── ClubOverviewScreen ───────────────────────────────────────────────────────
// First (and primary) tab of the club editor. Field set varies by type:
//   • Curated / Membership → Has Membership Fee checkbox gates Fee + Tax Rate;
//     Duration is always shown. Membership SKU is required for every type.
//   • Account Credit → inline default Level row (Name / Dollar / Cadence) —
//                      additional levels live on the Levels tab.
//
// Terms & Conditions: the textarea only renders once the operator opts in via
// the "Require members to accept" checkbox (defaults off).

const TAX_RATE_OPTIONS = ['Wine', 'Beer', 'Spirits', 'Food', 'Merchandise']

export function ClubOverviewScreen() {
  const club = useClubState()
  const showFeeToggle   = club.type === 'curated' || club.type === 'membership'
  const showInlineLevel = club.type === 'account-credit'
  const defaultLevel    = showInlineLevel ? club.levels.find((l) => l.isDefault) ?? club.levels[0] : null

  return (
    <ClubEditorLayout activeTab="overview">
      {/* Section: Overview */}
      <SectionCard title={
        <div className="flex flex-col gap-1">
          <span>Overview</span>
          <span className="typo-body-sm font-normal text-vintiga-slate-500">
            Set the main information and public-facing details for this club.
          </span>
        </div>
      }>
        <Field label="Title" required>
          <TextField
            placeholder="Enter club name"
            value={club.name}
            onChange={(e) => clubActions.patch('name', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
          <Field label="Status" required>
            <Select
              value={club.status}
              onChange={(e) => clubActions.patch('status', e.target.value as ClubDraft['status'])}
              options={[
                { value: 'inactive', label: 'Inactive' },
                { value: 'active',   label: 'Active' },
              ]}
            />
          </Field>
          <Field label="Available on Website" required>
            <Select
              value={club.availableOnWebsite ? 'yes' : 'no'}
              onChange={(e) => clubActions.patch('availableOnWebsite', e.target.value === 'yes')}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no',  label: 'No' },
              ]}
            />
          </Field>
        </div>

        {/* Account Credit (Figma 5079:43825): Membership SKU (full width) +
            inline default Level (Name + Amount). */}
        {showInlineLevel && defaultLevel && (
          <>
            <Field label="Membership SKU" required>
              <TextField
                placeholder="Enter SKU"
                value={club.sku}
                onChange={(e) => clubActions.patch('sku', e.target.value)}
              />
            </Field>

            <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md flex flex-col gap-vintiga-md">
              <div className="flex items-center gap-vintiga-sm">
                <h3 className="typo-body-sm font-semibold text-vintiga-slate-900">Level 1</h3>
                <Tag variant="filled" tone="default" size="sm">Default</Tag>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                <Field label="Level Name" required>
                  <TextField
                    placeholder="e.g., Silver, Gold, Platinum"
                    value={defaultLevel.name}
                    onChange={(e) => clubActions.patchLevel(defaultLevel.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Dollar Amount" required>
                  <div className="relative">
                    <input
                      type="number"
                      value={defaultLevel.amount}
                      onChange={(e) => clubActions.patchLevel(defaultLevel.id, { amount: Number(e.target.value) })}
                      className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">$</span>
                  </div>
                </Field>
              </div>
            </div>
          </>
        )}

        {/* Curated / Rewards (Figma 5079:33614, 5079:44506): SKU + Tax Rate,
            then Has Membership Fee → Duration + Fee. */}
        {showFeeToggle && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
              <Field label="Membership SKU" required>
                <TextField
                  placeholder="Enter SKU"
                  value={club.sku}
                  onChange={(e) => clubActions.patch('sku', e.target.value)}
                />
              </Field>
              <Field label="Membership Fee Tax Rate">
                <Select
                  value={club.taxRate}
                  onChange={(e) => clubActions.patch('taxRate', e.target.value)}
                  options={[{ value: '', label: 'Select tax rate' }, ...TAX_RATE_OPTIONS.map((o) => ({ value: o, label: o }))]}
                />
              </Field>
            </div>

            <Checkbox
              checked={club.hasMembershipFee}
              onChange={(next) => clubActions.patch('hasMembershipFee', next)}
              label="Has Membership Fee"
            />

            {club.hasMembershipFee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                <Field label="Duration of Membership">
                  <Select
                    value={club.durationOfMembership}
                    onChange={(e) => clubActions.patch('durationOfMembership', e.target.value as ClubDraft['durationOfMembership'])}
                    options={['3 Months', '6 Months', '12 Months', 'Indefinite']}
                  />
                </Field>
                <Field label="Membership Fee" required>
                  <div className="relative">
                    <input
                      type="number"
                      value={club.membershipFee}
                      onChange={(e) => clubActions.patch('membershipFee', Number(e.target.value))}
                      className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">$</span>
                  </div>
                </Field>
              </div>
            )}
          </>
        )}

        {/* Description — HTML content shown on the website. Last field in the
            Overview card, immediately before Images (per design). */}
        <Field label="Description" required helper="Displayed on the website — supports rich formatting.">
          <RichTextEditor placeholder="Describe what's available in this club…" />
        </Field>

      </SectionCard>

      {/* Section: Media */}
      <Media
        items={club.images}
        onUpload={(files) => clubActions.addImages(files)}
        onRemove={(id) => clubActions.removeImage(id)}
      />

      {/* Section: Terms & Conditions */}
      <SectionCard title={
        <div className="flex flex-col gap-1">
          <span>Terms &amp; Conditions</span>
          <span className="typo-body-sm font-normal text-vintiga-slate-500">
            Set the rules and commitments members agree to upon signup.
          </span>
        </div>
      }>
        <Checkbox
          checked={club.requireAcceptTerms}
          onChange={(next) => clubActions.patch('requireAcceptTerms', next)}
          label="Require members to accept terms & conditions"
        />
        {club.requireAcceptTerms && (
          <Field label="Terms & Conditions" required helper="These terms will be displayed to members during the signup process and they must accept to continue.">
            <RichTextEditor placeholder="Enter terms and conditions that members must agree to…" />
          </Field>
        )}
      </SectionCard>

      {/* Section: SEO */}
      <SectionCard title="SEO">
        <Field label="Meta Tag Title">
          <TextField
            placeholder="Enter title"
            value={club.metaTitle}
            onChange={(e) => clubActions.patch('metaTitle', e.target.value)}
          />
        </Field>
        <Field label="Meta Tag Description" helper={`${Math.max(0, 5 - club.metaDescription.length)} characters remaining`}>
          <Textarea
            placeholder="Enter description"
            value={club.metaDescription}
            onChange={(e) => clubActions.patch('metaDescription', e.target.value)}
          />
        </Field>
        <Field label="Slug">
          <TextField
            placeholder="club-name"
            value={club.slug}
            onChange={(e) => clubActions.patch('slug', e.target.value)}
          />
        </Field>
      </SectionCard>
    </ClubEditorLayout>
  )
}
