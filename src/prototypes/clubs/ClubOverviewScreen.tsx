import { ClubEditorLayout } from './ClubEditorLayout'
import { useClubState, clubActions, DURATION_OPTIONS, TAX_RATE_OPTIONS, CADENCE_OPTIONS, type ClubDraft, type ClubDuration, type ContributionCadence } from './clubStore'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Checkbox } from '@ds/shared/Checkbox'
import { Textarea } from '@ds/shared/Textarea'
import { RichTextEditor } from '@ds/shared/RichTextEditor'
import { Media } from '@ds/shared/Media'
import { LevelsEditor } from './LevelsEditor'
// ─── ClubOverviewScreen ───────────────────────────────────────────────────────
// First (and primary) tab of the club editor. Field set varies by type:
//   • Curated / Membership → Has Membership Fee checkbox gates Fee + Tax Rate;
//     Duration is always shown. Membership SKU is required for every type.
//   • Account Credit → inline default Level row (Name / Dollar / Cadence) —
//                      additional levels live on the Levels tab.
//
// Terms & Conditions: the textarea only renders once the operator opts in via
// the "Require members to accept" checkbox (defaults off).

export function ClubOverviewScreen() {
  const club = useClubState()
  const showFeeToggle   = club.type === 'curated' || club.type === 'membership'
  const showInlineLevel = club.type === 'account-credit'

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
        <Field label="Title" required helper="Only field required to save — Meta Title and Slug auto-fill from this.">
          <TextField
            placeholder="Enter club name"
            value={club.name}
            onChange={(e) => clubActions.setName(e.target.value)}
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

        {/* Tasting Credit (account-credit): Cadence (club-wide) + inline default
            Level (Name + Amount + SKU). No Membership SKU at club level — SKU
            lives per level. No Tax Rate (always non-taxable, not displayed). */}
        {showInlineLevel && (
          // Tasting Credit (account-credit) — club-wide Cadence sits in the
          // Overview card; the full per-level editor (Add Level + Level rows)
          // is rendered as its own card below.
          <Field label="Cadence" required helper="How often members are charged. Applies to every level.">
            <Select
              value={club.cadence}
              onChange={(e) => clubActions.patch('cadence', e.target.value as ContributionCadence)}
              options={CADENCE_OPTIONS}
            />
          </Field>
        )}

        {/* Curated / Rewards: SKU + Duration are required at the top.
            Has Membership Fee defaults Off; when On, Amount + Membership Duration
            (months) + Tax Rate show. */}
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
              <Field label="Duration" required helper="How long each membership runs.">
                <Select
                  value={club.duration}
                  onChange={(e) => clubActions.patch('duration', e.target.value as ClubDuration)}
                  options={[{ value: '', label: 'Select duration' }, ...DURATION_OPTIONS.map((o) => ({ value: o, label: o }))]}
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
                <Field label="Membership Amount" required helper="Must be greater than $0.">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={club.membershipFee}
                      onChange={(e) => clubActions.patch('membershipFee', Number(e.target.value))}
                      className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">$</span>
                  </div>
                </Field>
                <Field label="Membership Fee Tax Rate" helper="Pulled from the store's tax rates.">
                  <Select
                    value={club.taxRate}
                    onChange={(e) => clubActions.patch('taxRate', e.target.value)}
                    options={TAX_RATE_OPTIONS.map((o) => ({ value: o, label: o }))}
                  />
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

      {/* Section: Levels — Tasting Credit only. Full per-level editor (Add
          Level + Level rows + Set as Default + delete) lives inline now that
          the Levels tab has been retired. */}
      {showInlineLevel && <LevelsEditor />}

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
        <Field label="Meta Tag Title" helper={club.metaTitleAuto ? 'Auto-filled from Title. Edit to take ownership.' : undefined}>
          <TextField
            placeholder="Enter title"
            value={club.metaTitle}
            onChange={(e) => clubActions.setMetaTitle(e.target.value)}
          />
        </Field>
        <Field label="Meta Tag Description" helper={`${Math.max(0, 5 - club.metaDescription.length)} characters remaining`}>
          <Textarea
            placeholder="Enter description"
            value={club.metaDescription}
            onChange={(e) => clubActions.patch('metaDescription', e.target.value)}
          />
        </Field>
        <Field label="Slug" helper={club.slugAuto ? 'Auto-filled from Title (spaces become hyphens).' : undefined}>
          <TextField
            placeholder="club-name"
            value={club.slug}
            onChange={(e) => clubActions.setSlug(e.target.value)}
          />
        </Field>
      </SectionCard>
    </ClubEditorLayout>
  )
}
