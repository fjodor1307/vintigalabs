import type { PrototypeConfig } from '../_registry'
import { ProductsListScreen } from './ProductsListScreen'
import { CollectionsScreen } from './CollectionsScreen'
import { AddCollectionScreen } from './AddCollectionScreen'
import { GeneralScreen } from './GeneralScreen'
import { TimeSlotsScreen } from './TimeSlotsScreen'
import { BeerScreen } from './BeerScreen'
import { SpiritsScreen } from './SpiritsScreen'
import { PosScreen } from './PosScreen'
import { WebsiteScreen } from './WebsiteScreen'
import { AdvancedScreen } from './AdvancedScreen'
import { ModifiersScreen } from './ModifiersScreen'

export const config: PrototypeConfig = {
  slug: 'products',
  frame: 'web',
  tags: ['dashboard', 'product-editor', 'collections'],
  entries: [
    {
      name: 'Products',
      description: 'Catalogue overview, collections page, add-collection editor, and the five-tab product editor (General / POS / Website / Advanced / Modifiers).',
      path: '#/web/products/list',
      screens: 8,
    },
  ],
  routes: {
    // Overview pages
    '#/web/products/list':            ProductsListScreen,
    '#/web/products/collections':     CollectionsScreen,
    '#/web/products/collections/new': AddCollectionScreen,
    // Product editor (5 tabs)
    '#/web/products/general':         GeneralScreen,
    '#/web/products/timeslots':       TimeSlotsScreen,
    '#/web/products/beer':            BeerScreen,
    '#/web/products/spirits':         SpiritsScreen,
    '#/web/products/pos':             PosScreen,
    '#/web/products/website':         WebsiteScreen,
    '#/web/products/advanced':        AdvancedScreen,
    '#/web/products/modifiers':       ModifiersScreen,
  },
}
