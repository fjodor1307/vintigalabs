import type { PrototypeConfig } from '../_registry'
import { ClubsScreen } from './ClubsScreen'
import { MembershipsScreen } from './MembershipsScreen'
import { MembershipDetailScreen } from './MembershipDetailScreen'
import { ClubEmailsScreen } from './ClubEmailsScreen'
import { ClubOverviewScreen } from './ClubOverviewScreen'
import { ClubReleasesScreen } from './ClubReleasesScreen'
import { AddReleaseScreen, AddReleaseExistingScreen } from './AddReleaseScreen'
import { ClubLevelsScreen } from './ClubLevelsScreen'
import { ClubEditorEmailsScreen } from './ClubEditorEmailsScreen'
import { ClubViewOverviewScreen } from './ClubViewOverviewScreen'
import { ClubViewMembersScreen } from './ClubViewMembersScreen'
import { ClubViewReleasesScreen } from './ClubViewReleasesScreen'
import { ClubViewEmailsScreen } from './ClubViewEmailsScreen'

export const config: PrototypeConfig = {
  slug: 'clubs',
  frame: 'web',
  tags: ['dashboard', 'clubs', 'memberships'],
  entries: [
    {
      name: 'Clubs',
      description: 'Club offerings and memberships — KPIs + tabbed list of clubs, a full club editor (Overview / Releases / Levels / Emails) for each club type, plus the View Club detail flow with Overview / Members / Releases / Emails tabs.',
      path: '#/web/clubs',
      screens: 13,
    },
  ],
  routes: {
    // Page-level
    '#/web/clubs':                       ClubsScreen,
    '#/web/clubs/memberships':           MembershipsScreen,
    '#/web/clubs/memberships/1004':      MembershipDetailScreen,
    '#/web/clubs/emails':                ClubEmailsScreen,
    // Club editor (new club)
    '#/web/clubs/new/overview':          ClubOverviewScreen,
    '#/web/clubs/new/releases':          ClubReleasesScreen,
    '#/web/clubs/new/releases/add':      AddReleaseScreen,
    '#/web/clubs/new/levels':            ClubLevelsScreen,
    '#/web/clubs/new/emails':            ClubEditorEmailsScreen,
    // View club (existing club detail flow)
    '#/web/clubs/view/overview':         ClubViewOverviewScreen,
    '#/web/clubs/view/members':          ClubViewMembersScreen,
    '#/web/clubs/view/releases':         ClubViewReleasesScreen,
    '#/web/clubs/view/emails':           ClubViewEmailsScreen,
    '#/web/clubs/view/releases/add':     AddReleaseExistingScreen,
  },
}
