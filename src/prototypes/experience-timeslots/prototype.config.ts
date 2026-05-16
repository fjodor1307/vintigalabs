import type { PrototypeConfig } from '../_registry'
import { EditorScreen } from './EditorScreen'

export const config: PrototypeConfig = {
  slug: 'experience-timeslots',
  frame: 'web',
  tags: ['products', 'experiences', 'reservations'],
  entries: [
    {
      name: 'Experience Time Slots',
      description: 'Simplified weekly schedule + date overrides for an experience product. Calendly-style. Replaces the multi-card editor in the Products prototype.',
      path: '#/web/experience-timeslots/editor',
      screens: 1,
    },
  ],
  routes: {
    '#/web/experience-timeslots/editor': EditorScreen,
  },
}
