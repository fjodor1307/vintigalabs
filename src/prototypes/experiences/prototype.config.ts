import type { PrototypeConfig } from '../_registry'
import { ProductsListScreen } from './ProductsListScreen'
import { CollectionsScreen } from './CollectionsScreen'
import { AddCollectionScreen } from './AddCollectionScreen'
import { GeneralScreen } from './GeneralScreen'
import { PosScreen } from './PosScreen'
import { WebsiteScreen } from './WebsiteScreen'
import { AdvancedScreen } from './AdvancedScreen'

export const config: PrototypeConfig = {
  slug: 'experiences',
  frame: 'web',
  tags: ['dashboard', 'product-editor', 'experiences', 'collections'],
  entries: [
    {
      name: 'Experiences',
      description: 'Catalogue of bookable tastings, tours, and workshops. Four-tab editor (General / POS / Website / Advanced) with experience-specific fields — type, location, duration, lead time, host requirement.',
      path: '#/web/experiences/list',
      screens: 7,
    },
  ],
  routes: {
    // Overview pages
    '#/web/experiences/list':            ProductsListScreen,
    '#/web/experiences/collections':     CollectionsScreen,
    '#/web/experiences/collections/new': AddCollectionScreen,
    // Experience editor (4 tabs — no Modifiers, experiences don't use add-on groups)
    '#/web/experiences/general':         GeneralScreen,
    '#/web/experiences/pos':             PosScreen,
    '#/web/experiences/website':         WebsiteScreen,
    '#/web/experiences/advanced':        AdvancedScreen,
  },
}
