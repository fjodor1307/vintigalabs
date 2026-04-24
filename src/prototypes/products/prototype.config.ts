import type { PrototypeConfig } from '../_registry'
import { GeneralScreen } from './GeneralScreen'
import { PosScreen } from './PosScreen'
import { WebsiteScreen } from './WebsiteScreen'
import { AdvancedScreen } from './AdvancedScreen'
import { ModifiersScreen } from './ModifiersScreen'

export const config: PrototypeConfig = {
  slug: 'products',
  frame: 'web',
  tags: ['dashboard', 'product-editor'],
  entries: [
    {
      name: 'Products',
      description: 'Five-tab product editor with live image upload: General, POS, Website, Advanced, Modifiers.',
      path: '#/web/products/general',
      screens: 5,
    },
  ],
  routes: {
    '#/web/products/general':   GeneralScreen,
    '#/web/products/pos':       PosScreen,
    '#/web/products/website':   WebsiteScreen,
    '#/web/products/advanced':  AdvancedScreen,
    '#/web/products/modifiers': ModifiersScreen,
  },
}
