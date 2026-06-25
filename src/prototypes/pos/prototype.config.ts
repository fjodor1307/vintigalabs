import type { PrototypeConfig } from '../_registry'
import { PosProductsScreen } from './PosProductsScreen'

export const config: PrototypeConfig = {
  slug: 'pos',
  frame: 'mobile',
  tags: ['pos', 'mobile', 'products', 'register', 'ios'],
  entries: [
    {
      name: 'Products',
      description:
        'POS product catalog (Current Release). Built from the POS design-system components — search navbar, product cards, floating tab bar + cart. Tap any product to add it to the cart; the cart counter climbs live (1, 2, 3 …).',
      path: '#/web/pos',
      screens: 1,
    },
  ],
  routes: {
    '#/web/pos': PosProductsScreen,
  },
}
