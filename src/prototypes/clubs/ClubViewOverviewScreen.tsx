import { useState } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { SectionCard } from '@ds/shared/SectionCard'
import { KpiCard } from '@ds/shared/KpiCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Switch } from '@ds/shared/Switch'
import { Media } from '@ds/shared/Media'
import {
  PackageIcon,
  UsersGroupIcon,
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
  const [available, setAvailable]      = useState(true)
  const [description, setDescription]  = useState('')
  const [duration, setDuration]        = useState('12 Months')
  const [fee, setFee]                  = useState('0')
  const [autoRenew, setAutoRenew]      = useState(true)
  const [terms, setTerms]              = useState('')
  const [metaTitle, setMetaTitle]      = useState('')
  const [metaDesc, setMetaDesc]        = useState('')
  const [slug, setSlug]                = useState('blind-enthusiasm')
  const [images, setImages]            = useState<{ id: string; url: string; name: string }[]>([])

  const metaRemaining = Math.max(0, 160 - metaDesc.length)

  return (
    <ClubViewLayout activeTab="overview">
      <div className="flex flex-col gap-vintiga-lg">
        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-vintiga-md">
          <KpiCard label="Total Releases"   value="28" icon={<PackageIcon />} />
          <KpiCard label="Total Members"    value="15" icon={<UsersGroupIcon />} />
          <KpiCard label="Active Members"   value="10" icon={<CheckCircleIcon />} />
          <KpiCard label="On-hold Members"  value="2"  icon={<HandIcon />} />
          <KpiCard label="New Members"      value="2"  icon={<UserIcon />} />
          <KpiCard label="Canceled Members" value="1"  icon={<UserXIcon />} />
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
            <Switch checked={available} onChange={setAvailable} labelPosition="right" label={available ? 'Yes' : 'No'} />
          </Field>

          <Field label="Description" required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this club special?"
              className="min-h-[96px] w-full rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white px-3 py-2.5 typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors resize-y"
            />
          </Field>

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

          <Field label="Auto-renew membership">
            <Switch checked={autoRenew} onChange={setAutoRenew} labelPosition="right" label={autoRenew ? 'On' : 'Off'} />
          </Field>
        </SectionCard>

        {/* Terms */}
        <SectionCard
          title={
            <div className="flex flex-col gap-1">
              <span>Terms</span>
              <span className="typo-body-sm font-normal text-vintiga-slate-500">
                Set the rules and commitments members agree to upon signup.
              </span>
            </div>
          }
        >
          <Field
            label="Terms & Conditions"
            helper="These terms will be displayed to members during the signup process and they must accept to continue."
          >
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Enter terms and conditions"
              className="min-h-[160px] w-full rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white px-3 py-2.5 typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors resize-y"
            />
          </Field>
        </SectionCard>

        {/* SEO */}
        <SectionCard title="SEO">
          <Field label="Meta Tag Title">
            <TextField value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Page title shown in search results" />
          </Field>
          <Field label="Meta Tag Description" helper={`${metaRemaining} characters remaining`}>
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value.slice(0, 160))}
              placeholder="Page description shown in search results"
              className="min-h-[96px] w-full rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white px-3 py-2.5 typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors resize-y"
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
