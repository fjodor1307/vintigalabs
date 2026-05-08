import type { ComponentType } from 'react'
import type { PrototypeConfig } from '../_registry'
import { SettingsScreen } from './SettingsScreen'
import { LocationsScreen } from './LocationsScreen'
import { LocationEditScreen } from './LocationEditScreen'
import { LOCATIONS } from './locationsSample'

const baseRoutes: Record<string, ComponentType> = {
  '#/web/settings':                 SettingsScreen,
  '#/web/settings/locations':       LocationsScreen,
}

// Per-location editor — every location id resolves to the same screen, which
// reads the id from the hash and pre-fills the form.
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
        'Top-level Settings index, plus the Locations editor (LIN-517) — Mon–Sun business hours, pickup-availability toggle, and pickup instructions that the website pulls into the checkout pickup picker.',
      path: '#/web/settings',
      screens: 3,
    },
  ],
  routes: baseRoutes,
}
