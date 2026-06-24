import type { PrototypeConfig } from '../_registry'
import { ReservationsScreen } from './ReservationsScreen'

export const config: PrototypeConfig = {
  slug: 'reservations',
  frame: 'web',
  tags: ['dashboard', 'reservations', 'experiences'],
  entries: [
    {
      name: 'Reservations',
      description: 'Day-view reservations list — header (date · view · add), search + Experience/status filters, the reservation table, and live Check In. Rebuilt from the legacy Commerce 7 screen in Vintiga tokens.',
      path: '#/web/reservations',
      screens: 1,
    },
  ],
  routes: {
    '#/web/reservations': ReservationsScreen,
  },
}
