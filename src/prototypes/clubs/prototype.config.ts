import type { ComponentType } from 'react'
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
import { ClubViewLevelsScreen } from './ClubViewLevelsScreen'
import { CLUBS_CATALOG, CLUB_KEYS } from './clubsCatalog'
import { MEMBERS } from './memberSamples'

const baseRoutes: Record<string, ComponentType> = {
  // Page-level
  '#/web/clubs':                       ClubsScreen,
  '#/web/clubs/memberships':           MembershipsScreen,
  '#/web/clubs/emails':                ClubEmailsScreen,
  // Club editor (new club)
  '#/web/clubs/new/overview':          ClubOverviewScreen,
  '#/web/clubs/new/releases':          ClubReleasesScreen,
  '#/web/clubs/new/releases/add':      AddReleaseScreen,
  '#/web/clubs/new/levels':            ClubLevelsScreen,
  '#/web/clubs/new/emails':            ClubEditorEmailsScreen,
  // View club — legacy (no slug) routes default to Blind Enthusiasm
  '#/web/clubs/view/overview':         ClubViewOverviewScreen,
  '#/web/clubs/view/members':          ClubViewMembersScreen,
  '#/web/clubs/view/releases':         ClubViewReleasesScreen,
  '#/web/clubs/view/emails':           ClubViewEmailsScreen,
  '#/web/clubs/view/releases/add':     AddReleaseExistingScreen,
}

// Per-club view routes — `#/web/clubs/view/{slug}/{tab}` so each club opens
// with its own name in the header / breadcrumb / rail. Tab set varies by kind:
//   • curated / traditional  → Overview / Members / Releases / Emails
//   • membership             → Overview / Members / Emails
//   • account-credit         → Overview / Members / Levels / Emails
for (const slug of CLUB_KEYS) {
  const { kind } = CLUBS_CATALOG[slug]
  baseRoutes[`#/web/clubs/view/${slug}/overview`] = ClubViewOverviewScreen
  baseRoutes[`#/web/clubs/view/${slug}/members`]  = ClubViewMembersScreen
  baseRoutes[`#/web/clubs/view/${slug}/emails`]   = ClubViewEmailsScreen
  if (kind === 'curated' || kind === 'traditional') {
    baseRoutes[`#/web/clubs/view/${slug}/releases`]     = ClubViewReleasesScreen
    baseRoutes[`#/web/clubs/view/${slug}/releases/add`] = AddReleaseExistingScreen
  }
  if (kind === 'account-credit') {
    baseRoutes[`#/web/clubs/view/${slug}/levels`] = ClubViewLevelsScreen
  }
}

// Per-member detail routes — every member id resolves to the same screen,
// which reads the id from the hash and looks up the matching record.
for (const m of MEMBERS) {
  baseRoutes[`#/web/clubs/memberships/${m.id}`] = MembershipDetailScreen
}

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
  routes: baseRoutes,
}
