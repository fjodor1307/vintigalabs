import { useState } from 'react'
import { SettingsLayout } from './SettingsLayout'
import { LocationsTab } from './LocationsTab'
import { Button } from '@ds/shared/Button'
import { SegmentedControl } from '@ds/shared/SegmentedControl'

// ─── SettingsScreen ──────────────────────────────────────────────────────────
// Top-level Settings page (Figma 1696:16175). Header carries the title +
// short subtitle and a "Save Changes" CTA on the right. Below it sits a
// segmented tab strip (General · Tax Settings · Billing · Integrations ·
// Users & Permissions · Locations). Locations is the only tab that's wired
// through; the others render a friendly placeholder so the surface reads as
// complete without front-loading every editor.

type SettingsTab =
  | 'general'
  | 'tax-settings'
  | 'billing'
  | 'integrations'
  | 'users-permissions'
  | 'locations'

const TABS: { value: SettingsTab; label: string }[] = [
  { value: 'general',           label: 'General' },
  { value: 'tax-settings',      label: 'Tax Settings' },
  { value: 'billing',           label: 'Billing' },
  { value: 'integrations',      label: 'Integrations' },
  { value: 'users-permissions', label: 'Users & Permissions' },
  { value: 'locations',         label: 'Locations' },
]

const TAB_DESCRIPTION: Record<SettingsTab, string> = {
  general:             'Store identity, branding, contact details, and time zone.',
  'tax-settings':      'Default tax codes, regional overrides, and exemption rules.',
  billing:             'Subscription, invoices, and payment method on file.',
  integrations:        'Connections to accounting, marketing, and fulfilment partners.',
  'users-permissions': 'Team members, roles, and access permissions.',
  locations:           '',
}

export function SettingsScreen() {
  const [tab, setTab] = useState<SettingsTab>('locations')

  return (
    <SettingsLayout
      breadcrumbs={[{ label: 'Settings' }]}
      title={
        <div className="flex flex-col gap-1">
          <span className="typo-title-screen font-semibold text-vintiga-slate-900">Settings</span>
          <span className="typo-body-sm font-normal text-vintiga-slate-500">
            Manage your account settings and preferences
          </span>
        </div>
      }
      actions={<Button onClick={() => {}}>Save Changes</Button>}
    >
      <div className="flex flex-col gap-vintiga-lg">
        <SegmentedControl<SettingsTab>
          value={tab}
          onChange={setTab}
          aria-label="Settings tabs"
          options={TABS}
        />

        {tab === 'locations' ? (
          <LocationsTab />
        ) : (
          <PlaceholderTab label={TABS.find((t) => t.value === tab)!.label} description={TAB_DESCRIPTION[tab]} />
        )}
      </div>
    </SettingsLayout>
  )
}

function PlaceholderTab({ label, description }: { label: string; description: string }) {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-xl text-center">
      <p className="typo-body font-semibold text-vintiga-slate-900">{label}</p>
      <p className="typo-body-sm text-vintiga-slate-500 mt-1 max-w-md mx-auto">{description}</p>
      <p className="typo-caption text-vintiga-slate-400 mt-vintiga-md">Editor not wired up in this prototype.</p>
    </section>
  )
}
