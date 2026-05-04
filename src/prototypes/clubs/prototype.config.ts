import type { PrototypeConfig } from '../_registry'
import { ClubsScreen } from './ClubsScreen'
import { MembershipsScreen } from './MembershipsScreen'
import { ClubEmailsScreen } from './ClubEmailsScreen'
import { ClubOverviewScreen } from './ClubOverviewScreen'
import { ClubReleasesScreen } from './ClubReleasesScreen'
import { AddReleaseScreen } from './AddReleaseScreen'
import { ClubLevelsScreen } from './ClubLevelsScreen'
import { ClubEditorEmailsScreen } from './ClubEditorEmailsScreen'

export const config: PrototypeConfig = {
  slug: 'clubs',
  frame: 'web',
  tags: ['dashboard', 'clubs', 'memberships'],
  entries: [
    {
      name: 'Clubs',
      description: 'Club offerings and memberships — KPIs + tabbed list of clubs, plus a full club editor (Overview / Releases / Levels / Emails) for Curated, Account Credit and Membership clubs.',
      path: '#/web/clubs',
      screens: 8,
    },
  ],
  routes: {
    // Page-level
    '#/web/clubs':                       ClubsScreen,
    '#/web/clubs/memberships':           MembershipsScreen,
    '#/web/clubs/emails':                ClubEmailsScreen,
    // Club editor
    '#/web/clubs/new/overview':          ClubOverviewScreen,
    '#/web/clubs/new/releases':          ClubReleasesScreen,
    '#/web/clubs/new/releases/add':      AddReleaseScreen,
    '#/web/clubs/new/levels':            ClubLevelsScreen,
    '#/web/clubs/new/emails':            ClubEditorEmailsScreen,
  },
}
