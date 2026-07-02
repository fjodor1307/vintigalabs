import type { PrototypeConfig } from '../_registry'
import { ProfilesListScreen } from './ProfilesListScreen'
import { ProfileDetailScreen } from './ProfileDetailScreen'

export const config: PrototypeConfig = {
  slug: 'pos-profiles',
  frame: 'web',
  tags: ['dashboard', 'pos', 'settings'],
  entries: [
    {
      name: 'POS Profiles',
      description: 'List, add and edit POS profiles in a stand-alone store.',
      path: '#/web/pos-profiles/list',
      screens: 2,
    },
  ],
  routes: {
    '#/web/pos-profiles/list': ProfilesListScreen,
    // Detail carries the profile id as a query param (?id=…), which App strips
    // before the exact-match route lookup — so one route serves every profile,
    // including newly-added / duplicated ones.
    '#/web/pos-profiles/profile': ProfileDetailScreen,
  },
}
