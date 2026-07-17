import type { PrototypeConfig } from '../_registry'
import { ReservationsScreen } from './ReservationsScreen'
import { AddReservationScreen } from './AddReservationScreen'
import { ReservationViewScreen } from './ReservationViewScreen'

export const config: PrototypeConfig = {
  slug: 'reservations',
  frame: 'web',
  tags: ['dashboard', 'reservations', 'experiences'],
  entries: [
    {
      name: 'Reservations',
      description: 'Day-view reservations list (date · view · filters · live Check In), an Add Reservation form with a live summary, and a Reservation detail view. Rebuilt from the legacy Commerce 7 + Figma designs in Vintiga tokens.',
      path: '#/web/reservations',
      screens: 3,
    },
  ],
  routes: {
    '#/web/reservations':      ReservationsScreen,
    '#/web/reservations/add':  AddReservationScreen,
    '#/web/reservations/view': ReservationViewScreen,
  },
}
