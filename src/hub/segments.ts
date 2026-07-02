// Hub category tabs — shared so the navbar can be reused across hub pages.

import type { PrototypeFrame } from '../prototypes/_registry'

export type Category = 'CRM' | 'POS'

/** Which hub category a prototype's frame maps to. */
export function categoryForFrame(frame: PrototypeFrame): Category {
  return frame === 'mobile' ? 'POS' : 'CRM'
}
export const CATEGORY_OPTIONS = ['CRM', 'POS', 'Brand', 'Design System', 'Presentations'] as const
export type Segment = 'all' | (typeof CATEGORY_OPTIONS)[number]

export const SEGMENTS: { value: Segment; label: string }[] = [
  { value: 'all', label: 'All' },
  ...CATEGORY_OPTIONS.map((c) => ({ value: c as Segment, label: c })),
]
