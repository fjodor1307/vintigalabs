import { useState } from 'react'
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
import { getCurrentClubSlug } from './clubsCatalog'
import {
  PackageIcon,
  CheckCircleIcon,
  HandIcon,
  UserIcon,
  UserXIcon,
} from '@ds/icons/Icons'

// ─── ClubViewOverviewScreen ───────────────────────────────────────────────────
// Overview tab on the View Club detail page. Six-tile member-stats grid sits
// above the editable Basic Info / Terms / SEO cards. Mirrors the editor's
// Overview structure but with read-only KPIs surfaced for an existing club.

export function ClubViewOverviewScreen() {
  const [name, setName]                = useState('Blind Enthusiasm')
  const [status, setStatus]            = useState<'active' | 'inactive'>('inactive')
  const [webStatus, setWebStatus]      = useState<'available' | 'not-available'>('available')
  const [duration, setDuration]        = useState('12 Months')
  const [hasFee, setHasFee]            = useState(true)
  const [fee, setFee]                  = useState('0')
  const [sku, setSku]                  = useState('1234-1234')
  const [taxRate, setTaxRate]          = useState('')
  const [requireTerms, setRequireTerms] = useState(true)
  const [metaTitle, setMetaTitle]      = useState('')
  const [metaDesc, setMetaDesc]        = useState('')
  const [slug, setSlug]                = useState('blind-enthusiasm')
  const [images, setImages]            = useState<{ id: string; url: string; name: string }[]>([])

  const metaRemaining = Math.max(0, 160 - metaDesc.length)

  return (
    <ClubViewLayout activeTab="overview">
      <div className="flex flex-col gap-vintiga-lg">
        {/* KPI grid — compact KPI-small in a 2-col grid (May 7 alignment).
            Active / On-hold paired on top, New / Canceled paired below, then
            Total Releases pinned to the bottom-right as the least-important
            metric (curated club always has releases). Removed Total Members
            per the meeting — operators can sum Active + On-hold + New. */}
        {(() => {
          const slug = getCurrentClubSlug()
          const membersHref  = (status: string) => `#/web/clubs/view/${slug}/members?status=${encodeURIComponent(status)}`
          const releasesHref = `#/web/clubs/view/${slug}/releases`
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
              <KpiCard size="sm" label="Active Members"   value="10" icon={<CheckCircleIcon />} href={membersHref('Active')}    />
              <KpiCard size="sm" label="On-hold Members"  value="2"  icon={<HandIcon />}        href={membersHref('On Hold')}   />
              <KpiCard size="sm" label="New Members"      value="2"  icon={<UserIcon />}        href={membersHref('Pending')}   />
              <KpiCard size="sm" label="Canceled Members" value="1"  icon={<UserXIcon />}       href={membersHref('Cancelled')} />
              <KpiCard size="sm" label="Total Releases"   value="28" icon={<PackageIcon />}     href={releasesHref}             />
            </div>
          )
        })()}

        {/* Overview (Figma 5079:33614) */}
        <RecordsCard
          title="Overview"
          subtitle="Set the main information and public-facing details for this club."
          divider={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
            <Field label="Title" required>
              <TextField value={name} onChange={(e) => setName(e.target.value)} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
            <Field label="Membership SKU" required>
              <TextField
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Enter SKU"
              />
            </Field>
            <Field label="Membership Fee Tax Rate">
              <Select
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                options={[
                  { value: '',            label: 'Select tax rate' },
                  { value: 'Wine',        label: 'Wine' },
                  { value: 'Beer',        label: 'Beer' },
                  { value: 'Spirits',     label: 'Spirits' },
                  { value: 'Food',        label: 'Food' },
                  { value: 'Merchandise', label: 'Merchandise' },
                ]}
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
              <Field label="Duration of Membership">
                <Select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  options={['3 Months', '6 Months', '12 Months', 'Indefinite']}
                />
              </Field>
              <Field label="Membership Fee" required>
                <TextField
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  rightIcon={<span className="typo-body-sm text-vintiga-slate-400">$</span>}
                />
              </Field>
            </div>
          )}

          <Field label="Description" required helper="Displayed on the website — supports rich formatting.">
            <RichTextEditor placeholder="What makes this club special?" />
          </Field>

        </RecordsCard>

        {/* Media — top-level section like the editor (Figma 5079:33614) */}
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

        {/* Terms & Conditions (Figma 5079:33614) */}
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

        {/* SEO (Figma 5079:33614) */}
        <RecordsCard title="SEO" divider={false}>
          <Field label="Meta Tag Title">
            <TextField value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Page title shown in search results" />
          </Field>
          <Field label="Meta Tag Description" helper={`${metaRemaining} characters remaining`}>
            <Textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value.slice(0, 160))}
              placeholder="Page description shown in search results"
              className="min-h-[96px]"
            />
          </Field>
          <Field label="Slug">
            <TextField value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Field>
        </RecordsCard>
      </div>
    </ClubViewLayout>
  )
}
