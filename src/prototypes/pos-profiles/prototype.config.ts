import type { PrototypeConfig } from '../_registry'
import { WelcomeScreen } from './WelcomeScreen'

export const config: PrototypeConfig = {
  slug: 'pos-profiles',
  frame: 'mobile',
  tags: [],
  entries: [
    {
      name: 'Pos Profiles',
      description: 'TODO — describe the flow in one sentence.',
      path: '#/web/pos-profiles/welcome',
      screens: 1,
    },
  ],
  routes: {
    '#/web/pos-profiles/welcome': WelcomeScreen,
  },
}
