import { useState } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { KpiCard } from '@ds/shared/KpiCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Checkbox } from '@ds/shared/Checkbox'
import { Textarea } from '@ds/shared/Textarea'
import { Media } from '@ds/shared/Media'
import { TaxCodePicker } from './TaxCodePicker'
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
  const [description, setDescription]  = useState('')
  const [duration, setDuration]        = useState('12 Months')
  const [fee, setFee]                  = useState('0')
  const [sku, setSku]                  = useState('1234-1234')
  const [taxCode, setTaxCode]          = useState('V-1234')
  const [requireTerms, setRequireTerms] = useState(true)
  const [terms, setTerms]              = useState('')
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
          <KpiCard size="sm" label="Active Members"   value="10" icon={<CheckCircleIcon />} />
          <KpiCard size="sm" label="On-hold Members"  value="2"  icon={<HandIcon />} />
          <KpiCard size="sm" label="New Members"      value="2"  icon={<UserIcon />} />
          <KpiCard size="sm" label="Canceled Members" value="1"  icon={<UserXIcon />} />
          <KpiCard size="sm" label="Total Releases"   value="28" icon={<PackageIcon />} />
        </div>

        {/* Basic Info */}
        <SectionCard
          title={
            <div className="flex flex-col gap-1">
              <span>Basic Info</span>
              <span className="typo-body-sm font-normal text-vintiga-slate-500">
                Set the main information and public-facing details for this club.
              </span>
            </div>
          }
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

          <Field label="Description" required>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this club special?"
              className="min-h-[96px]"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
            <Field label="Duration of Membership">
              <Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                options={['3 Months', '6 Months', '12 Months', 'Indefinite']}
              />
            </Field>
            <Field label="Membership Fee">
              <TextField
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                rightIcon={<span className="typo-body-sm text-vintiga-slate-400">$</span>}
              />
            </Field>
          </div>

          {/* SKU + Tax Code — Curated club only (Figma 5079:33614). Mirrors the
              new-club editor: signup creates a real order against this SKU so
              accounting can reconcile revenue. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
            <Field label="SKU">
              <TextField
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="1234-1234"
              />
            </Field>
            <Field label="Tax Code">
              <TaxCodePicker value={taxCode} onChange={setTaxCode} />
            </Field>
          </div>

          <Field label="Images">
            <Media
              variant="bare"
              items={images}
              onUpload={(files) =>
                setImages((prev) => [
                  ...prev,
                  ...files.map((f) => ({ id: `img-${Date.now()}-${f.name}`, url: URL.createObjectURL(f), name: f.name })),
                ])
              }
              onRemove={(id) => setImages((prev) => prev.filter((i) => i.id !== id))}
            />
          </Field>
        </SectionCard>

        {/* Terms & Conditions — matches Figma 5304:7762 */}
        <SectionCard
          title={
            <div className="flex flex-col gap-1">
              <span>Terms &amp; Conditions</span>
              <span className="typo-body-sm font-normal text-vintiga-slate-500">
                Set the rules and commitments members agree to upon signup.
              </span>
            </div>
          }
        >
          <div className="-mx-vintiga-lg border-t border-vintiga-slate-200" />

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
            <Textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              disabled={!requireTerms}
              placeholder="Enter terms and conditions that members must agree to..."
              className="min-h-[160px]"
            />
          </Field>
        </SectionCard>

        {/* SEO */}
        <SectionCard title="SEO">
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
        </SectionCard>
      </div>
    </ClubViewLayout>
  )
}
