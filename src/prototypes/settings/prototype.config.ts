import type { PrototypeConfig } from '../_registry'
import { SettingsScreen } from './SettingsScreen'

export const config: PrototypeConfig = {
  slug: 'settings',
  frame: 'web',
  tags: ['dashboard', 'settings', 'locations'],
  entries: [
    {
      name: 'Settings',
      description:
        'Tabbed Settings page (Figma 1696:16175) — General · Tax Settings · Billing · Integrations · Users & Permissions · Locations. The Locations tab (Figma 1812:4936) splits Physical vs Inventory locations and edits each via a modal that, per LIN-517, also captures Mon–Sun business hours and the pickup instructions the website pulls into the checkout pickup picker.',
      path: '#/web/settings',
      screens: 1,
    },
  ],
  routes: {
    '#/web/settings': SettingsScreen,
  },
}
