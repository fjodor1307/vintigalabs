import type { ComponentType } from 'react'
import type { PrototypeConfig } from '../_registry'
import { SettingsScreen } from './SettingsScreen'
import { LocationEditScreen } from './LocationEditScreen'
import { LOCATIONS } from './locationsSample'

const baseRoutes: Record<string, ComponentType> = {
  '#/web/settings': SettingsScreen,
}

// Per-location edit page — every location id resolves to the same screen,
// which reads the id from the hash and pre-fills the form.
for (const l of LOCATIONS) {
  baseRoutes[`#/web/settings/locations/${l.id}`] = LocationEditScreen
}

export const config: PrototypeConfig = {
  slug: 'settings',
  frame: 'web',
  tags: ['dashboard', 'settings', 'locations'],
  entries: [
    {
      name: 'Settings',
      description:
        'Tabbed Settings page (Figma 1696:16175) — General · Tax Settings · Billing · Integrations · Users & Permissions · Locations. The Locations tab (Figma 1812:4936) splits Physical vs Inventory locations and edits each on a dedicated sub-page that, per LIN-517, also captures Mon–Sun business hours and the pickup instructions the website pulls into the checkout pickup picker.',
      path: '#/web/settings',
      screens: 2,
    },
  ],
  routes: baseRoutes,
}
