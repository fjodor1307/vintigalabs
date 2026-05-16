import type { PrototypeConfig } from '../_registry'
import { EditorScreen } from './EditorScreen'

export const config: PrototypeConfig = {
  slug: 'experience-timeslots-matrix',
  frame: 'web',
  tags: ['products', 'experiences', 'reservations'],
  entries: [
    {
      name: 'Experience Time Slots — Matrix',
      description: 'Dense table-grid alternative to the Calendly-style editor. Rows = bookable times, columns = weekdays. Blackouts driven by a 2-month calendar.',
      path: '#/web/experience-timeslots-matrix/editor',
      screens: 1,
    },
  ],
  routes: {
    '#/web/experience-timeslots-matrix/editor': EditorScreen,
  },
}
