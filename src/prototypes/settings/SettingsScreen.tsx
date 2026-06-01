import { useState } from 'react'
import { SettingsLayout } from './SettingsLayout'
import { LocationsTab } from './LocationsTab'
import { TaxesTab } from './TaxesTab'
import { SeasonsTab } from './SeasonsTab'
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
  | 'seasons'

const TABS: { value: SettingsTab; label: string }[] = [
  { value: 'general',           label: 'General' },
  { value: 'tax-settings',      label: 'Tax Settings' },
  { value: 'billing',           label: 'Billing' },
  { value: 'integrations',      label: 'Integrations' },
  { value: 'users-permissions', label: 'Users & Permissions' },
  { value: 'locations',         label: 'Locations' },
  { value: 'seasons',           label: 'Seasons' },
]

const TAB_DESCRIPTION: Record<SettingsTab, string> = {
  general:             'Store identity, branding, contact details, and time zone.',
  'tax-settings':      'Default tax codes, regional overrides, and exemption rules.',
  billing:             'Subscription, invoices, and payment method on file.',
  integrations:        'Connections to accounting, marketing, and fulfilment partners.',
  'users-permissions': 'Team members, roles, and access permissions.',
  locations:           '',
  seasons:             '',
}

/** Read the hash query string once at module evaluation. */
function readHashParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams()
  const hash = window.location.hash
  const qIdx = hash.indexOf('?')
  if (qIdx === -1) return new URLSearchParams()
  return new URLSearchParams(hash.slice(qIdx + 1))
}

/** Read `?tab=…` off the hash query string. Lets other surfaces deep-link
 *  to a specific Settings tab — e.g. the Schedule tab's "Edit in Settings"
 *  affordance on Shared seasons routes to `#/web/settings?tab=seasons`. */
function readInitialTab(): SettingsTab {
  const params = readHashParams()
  const t = params.get('tab') as SettingsTab | null
  return t && TABS.some((row) => row.value === t) ? t : 'locations'
}

/**
 * Parses `?from=…&productId=…&productName=…` off the hash so Settings can
 * render a launcher-aware breadcrumb trail back to the surface that opened
 * it. Today only `from=experience` is wired — the Schedule tab routes back
 * to its `#/web/products/timeslots?id=<id>` page.
 */
interface LauncherContext {
  fromExperience: boolean
  productId: string | null
  productName: string
}
function readLauncherContext(): LauncherContext {
  const params = readHashParams()
  return {
    fromExperience: params.get('from') === 'experience',
    productId:      params.get('productId'),
    productName:    params.get('productName') ?? 'Experience',
  }
}

export function SettingsScreen() {
  const [tab, setTab] = useState<SettingsTab>(readInitialTab)
  // Captured once at mount — doesn't change as the user navigates inside Settings.
  const [launcher] = useState<LauncherContext>(readLauncherContext)

  return (
    <SettingsLayout
      breadcrumbs={
        launcher.fromExperience && launcher.productId
          ? [
              {
                label: launcher.productName,
                href: `#/web/products/timeslots?id=${encodeURIComponent(launcher.productId)}`,
              },
              { label: TABS.find((t) => t.value === tab)?.label ?? 'Settings' },
            ]
          : undefined
      }
      breadcrumbHomeHref={
        launcher.fromExperience && launcher.productId
          ? `#/web/products/timeslots?id=${encodeURIComponent(launcher.productId)}`
          : undefined
      }
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
        ) : tab === 'tax-settings' ? (
          <TaxesTab />
        ) : tab === 'seasons' ? (
          <SeasonsTab />
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
