// Hub category tabs — shared so the navbar can be reused across hub pages.

export type Category = 'CRM' | 'POS'
export const CATEGORY_OPTIONS = ['CRM', 'POS', 'Brand', 'Design System', 'Presentations'] as const
export type Segment = 'all' | (typeof CATEGORY_OPTIONS)[number]

export const SEGMENTS: { value: Segment; label: string }[] = [
  { value: 'all', label: 'All' },
  ...CATEGORY_OPTIONS.map((c) => ({ value: c as Segment, label: c })),
]
