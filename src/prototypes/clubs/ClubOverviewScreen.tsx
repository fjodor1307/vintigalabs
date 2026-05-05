import { ClubEditorLayout } from './ClubEditorLayout'
import { useClubState, clubActions, type ClubDraft } from './clubStore'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Checkbox } from '@ds/shared/Checkbox'
import { Media } from '@ds/shared/Media'

// ─── ClubOverviewScreen ───────────────────────────────────────────────────────
// First (and primary) tab of the club editor. Field set is shared across all
// three club types — Curated, Account Credit, Membership — minor differences:
//   • Curated / Membership → Duration of Membership + Membership Fee
//   • Account Credit → Levels live on a separate tab; Overview shows core only
//
// Terms & Conditions: the textarea only renders once the operator opts in via
// the "Require members to accept" checkbox (defaults off). Auto-renew has been
// removed for every club type.

export function ClubOverviewScreen() {
  const club = useClubState()
  const showMembershipFields = club.type === 'curated' || club.type === 'membership'
  const showCadenceField     = club.type === 'account-credit'

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

        {showCadenceField && (
          <Field label="Contribution Cadence" required>
            <Select
              value={club.contributionCadence}
              onChange={(e) => clubActions.patch('contributionCadence', e.target.value as ClubDraft['contributionCadence'])}
              options={['Monthly', 'Quarterly', 'Annually']}
            />
          </Field>
        )}

        <Field label="Description" required>
          <textarea
            placeholder=""
            value={club.description}
            onChange={(e) => clubActions.patch('description', e.target.value)}
            className="px-3 py-2.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors min-h-[96px] resize-y"
          />
        </Field>

        {showMembershipFields && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
              <Field label="Duration of Membership">
                <Select
                  value={club.durationOfMembership}
                  onChange={(e) => clubActions.patch('durationOfMembership', e.target.value as ClubDraft['durationOfMembership'])}
                  options={['3 Months', '6 Months', '12 Months', 'Indefinite']}
                />
              </Field>
              <Field label="Membership Fee">
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
          </>
        )}

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
            <textarea
              placeholder="Enter terms and conditions that members must agree to…"
              value={club.termsBody}
              onChange={(e) => clubActions.patch('termsBody', e.target.value)}
              className="px-3 py-2.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors min-h-[96px] resize-y"
            />
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
          <textarea
            placeholder="Enter description"
            value={club.metaDescription}
            onChange={(e) => clubActions.patch('metaDescription', e.target.value)}
            className="px-3 py-2.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors min-h-[72px] resize-y"
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
