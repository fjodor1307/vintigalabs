import { useEffect, useState } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { KpiCard } from '@ds/shared/KpiCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Checkbox } from '@ds/shared/Checkbox'
import { Textarea } from '@ds/shared/Textarea'
import { RichTextEditor } from '@ds/shared/RichTextEditor'
import { Media } from '@ds/shared/Media'
import { LevelsEditor } from './LevelsEditor'
import { CLUBS_CATALOG, getCurrentClubSlug } from './clubsCatalog'
import {
  useClubState,
  clubActions,
  DURATION_OPTIONS,
  TAX_RATE_OPTIONS,
  CADENCE_OPTIONS,
  slugify,
  type ClubDuration,
  type ContributionCadence,
} from './clubStore'
import {
  PackageIcon,
  CheckCircleIcon,
  HandIcon,
  UserIcon,
  UserXIcon,
} from '@ds/icons/Icons'

// ─── ClubViewOverviewScreen ───────────────────────────────────────────────────
// Overview tab on the View Club detail page. Mirrors the new-club editor field
// layout (Figma 5078:4191) so the same spec applies to creating and editing.
// Type-aware: Tasting Credit (account-credit) shows Cadence + a Level card;
// Curated / Rewards (membership) show SKU + Duration + Has-Fee block.

const SAMPLE_TASTING_LEVELS = [
  { name: 'Bronze', amount: 50,  sku: 'TC-BRZ' },
  { name: 'Silver', amount: 100, sku: 'TC-SLV' },
]

export function ClubViewOverviewScreen() {
  const slug = getCurrentClubSlug()
  const clubInfo = CLUBS_CATALOG[slug]
  const kind = clubInfo.kind
  const isAccountCredit = kind === 'account-credit'
  const showFeeToggle   = kind === 'curated' || kind === 'membership'

  // Local state — seeded from the catalogue. SEO Meta Title + Slug auto-fill
  // from Title until the operator takes ownership of those fields.
  const [name, setName]                   = useState(clubInfo.name)
  const [status, setStatus]               = useState<'active' | 'inactive'>('active')
  const [webStatus, setWebStatus]         = useState<'available' | 'not-available'>('available')
  const [sku, setSku]                     = useState('1234-1234')
  const [duration, setDuration]           = useState<ClubDuration>('12 Months')
  const [hasFee, setHasFee]               = useState(false)
  const [fee, setFee]                     = useState('0')
  const [taxRate, setTaxRate]             = useState('Non-Taxable')
  const [requireTerms, setRequireTerms]   = useState(true)
  const [metaTitle, setMetaTitle]         = useState(clubInfo.name)
  const [metaTitleAuto, setMetaTitleAuto] = useState(true)
  const [metaDesc, setMetaDesc]           = useState('')
  const [slugSeo, setSlugSeo]             = useState(slugify(clubInfo.name))
  const [slugAuto, setSlugAuto]           = useState(true)
  const [images, setImages]               = useState<{ id: string; url: string; name: string }[]>([])

  // Tasting Credit shares Cadence + levels with the Levels tab via the store.
  const { cadence, levels } = useClubState()
  useEffect(() => {
    if (!isAccountCredit) return
    if (levels.length === 0) {
      SAMPLE_TASTING_LEVELS.forEach((sample, i) => {
        clubActions.addLevel()
        const id = i === 0 ? 'l1' : `l${i + 1}`
        clubActions.patchLevel(id, { name: sample.name, amount: sample.amount, sku: sample.sku })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountCredit])

  function onTitleChange(value: string) {
    setName(value)
    if (metaTitleAuto) setMetaTitle(value)
    if (slugAuto) setSlugSeo(slugify(value))
  }

  const metaRemaining = Math.max(0, 160 - metaDesc.length)
  const membersHref  = (s: string) => `#/web/clubs/view/${slug}/members?status=${encodeURIComponent(s)}`
  const releasesHref = `#/web/clubs/view/${slug}/releases`

  return (
    <ClubViewLayout activeTab="overview">
      <div className="flex flex-col gap-vintiga-lg">
        {/* KPI grid — Total Releases is hidden for Tasting Credit (no releases tab). */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
          <KpiCard size="sm" label="Active Members"   value="10" icon={<CheckCircleIcon />} href={membersHref('Active')}    />
          <KpiCard size="sm" label="On-hold Members"  value="2"  icon={<HandIcon />}        href={membersHref('On Hold')}   />
          <KpiCard size="sm" label="New Members"      value="2"  icon={<UserIcon />}        href={membersHref('Pending')}   />
          <KpiCard size="sm" label="Canceled Members" value="1"  icon={<UserXIcon />}       href={membersHref('Cancelled')} />
          {!isAccountCredit && (
            <KpiCard size="sm" label="Total Releases" value="28" icon={<PackageIcon />} href={releasesHref} />
          )}
        </div>

        <RecordsCard
          title="Overview"
          subtitle="Set the main information and public-facing details for this club."
          divider={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
            <Field label="Title" required helper="Only field required to save — Meta Title and Slug auto-fill from this.">
              <TextField value={name} onChange={(e) => onTitleChange(e.target.value)} />
            </Field>
            <Field label="Status" required>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                options={[
                  { value: 'active',   label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            </Field>
          </div>

          <Field label="Available on Website">
            <Select
              value={webStatus}
              onChange={(e) => setWebStatus(e.target.value as 'available' | 'not-available')}
              options={[
                { value: 'available',     label: 'Available' },
                { value: 'not-available', label: 'Not Available' },
              ]}
            />
          </Field>

          {/* Tasting Credit: Cadence (club-wide) lives in Overview; full
              per-level editor renders as its own card below the Media block. */}
          {isAccountCredit && (
            <Field label="Cadence" required helper="How often members are charged. Applies to every level.">
              <Select
                value={cadence}
                onChange={(e) => clubActions.patch('cadence', e.target.value as ContributionCadence)}
                options={CADENCE_OPTIONS}
              />
            </Field>
          )}

          {/* Curated / Rewards: SKU + Duration top-level. Has Membership Fee
              toggle (default off); when on, Amount + Membership Duration + Tax Rate. */}
          {showFeeToggle && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                <Field label="Membership SKU" required>
                  <TextField
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Enter SKU"
                  />
                </Field>
                <Field label="Duration" required helper="How long each membership runs.">
                  <Select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as ClubDuration)}
                    options={[{ value: '', label: 'Select duration' }, ...DURATION_OPTIONS.map((o) => ({ value: o, label: o }))]}
                  />
                </Field>
              </div>

              <Checkbox
                checked={hasFee}
                onChange={setHasFee}
                label="Has Membership Fee"
              />

              {hasFee && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                  <Field label="Membership Amount" required helper="Must be greater than $0.">
                    <TextField
                      type="number"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      rightIcon={<span className="typo-body-sm text-vintiga-slate-400">$</span>}
                    />
                  </Field>
                  <Field label="Membership Fee Tax Rate" helper="Pulled from the store's tax rates.">
                    <Select
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      options={TAX_RATE_OPTIONS.map((o) => ({ value: o, label: o }))}
                    />
                  </Field>
                </div>
              )}
            </>
          )}

          {/* Description — rich-text HTML shown on the website. Always last. */}
          <Field label="Description" required helper="Displayed on the website — supports rich formatting.">
            <RichTextEditor placeholder="What makes this club special?" />
          </Field>
        </RecordsCard>

        {/* Media */}
        <Media
          items={images}
          onUpload={(files) =>
            setImages((prev) => [
              ...prev,
              ...files.map((f) => ({ id: `img-${Date.now()}-${f.name}`, url: URL.createObjectURL(f), name: f.name })),
            ])
          }
          onRemove={(id) => setImages((prev) => prev.filter((i) => i.id !== id))}
        />

        {/* Levels — Tasting Credit only. Full per-level editor (Add Level +
            Level rows + Set as Default + delete) lives inline now that the
            Levels tab has been retired. */}
        {isAccountCredit && <LevelsEditor />}

        {/* Terms & Conditions */}
        <RecordsCard
          title="Terms & Conditions"
          subtitle="Set the rules and commitments members agree to upon signup."
          divider={false}
        >
          <Checkbox
            checked={requireTerms}
            onChange={setRequireTerms}
            label="Require members to accept terms &amp; conditions"
          />

          <Field
            label="Terms & Conditions"
            required={requireTerms}
            helper="These terms will be displayed to members during the signup process and they must accept to continue."
          >
            <RichTextEditor
              disabled={!requireTerms}
              placeholder="Enter terms and conditions that members must agree to..."
            />
          </Field>
        </RecordsCard>

        {/* SEO */}
        <RecordsCard title="SEO" divider={false}>
          <Field label="Meta Tag Title" helper={metaTitleAuto ? 'Auto-filled from Title. Edit to take ownership.' : undefined}>
            <TextField
              value={metaTitle}
              onChange={(e) => { setMetaTitle(e.target.value); setMetaTitleAuto(false) }}
              placeholder="Page title shown in search results"
            />
          </Field>
          <Field label="Meta Tag Description" helper={`${metaRemaining} characters remaining`}>
            <Textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value.slice(0, 160))}
              placeholder="Page description shown in search results"
              className="min-h-[96px]"
            />
          </Field>
          <Field label="Slug" helper={slugAuto ? 'Auto-filled from Title (spaces become hyphens).' : undefined}>
            <TextField
              value={slugSeo}
              onChange={(e) => { setSlugSeo(e.target.value); setSlugAuto(false) }}
            />
          </Field>
        </RecordsCard>
      </div>
    </ClubViewLayout>
  )
}
