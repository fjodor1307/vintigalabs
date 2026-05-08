// ─── Releases — shared sample data ───────────────────────────────────────────
// Single source of truth for the Releases tab list and the Release detail
// drill-down. Keeping it module-level (vs in-component state) means both
// screens read the same fixture and a simple `releaseIdFromName` slugifier
// gives us stable URL ids without adding an explicit id field per row.

export type Status = 'Active' | 'Archived' | 'Planning'

export interface Release {
  name: string
  draftOrders: number
  date: string
  status: Status
}

export const RELEASES: Release[] = [
  { name: 'January Release',   draftOrders: 2, date: 'Mar 15, 2025', status: 'Active' },
  { name: 'February Release',  draftOrders: 4, date: 'Mar 13, 2025', status: 'Active' },
  { name: 'March Release',     draftOrders: 5, date: 'Mar 11, 2025', status: 'Active' },
  { name: 'April Release',     draftOrders: 6, date: 'Mar 09, 2025', status: 'Active' },
  { name: 'May Release',       draftOrders: 8, date: 'Mar 07, 2025', status: 'Archived' },
  { name: 'June Release',      draftOrders: 9, date: 'Mar 05, 2025', status: 'Archived' },
  { name: 'July Release',      draftOrders: 3, date: 'Mar 03, 2025', status: 'Planning' },
  { name: 'August Release',    draftOrders: 1, date: 'Mar 01, 2025', status: 'Planning' },
  { name: 'September Release', draftOrders: 0, date: 'Feb 27, 2025', status: 'Planning' },
  { name: 'October Release',   draftOrders: 0, date: 'Feb 25, 2025', status: 'Planning' },
  { name: 'November Release',  draftOrders: 0, date: 'Feb 23, 2025', status: 'Planning' },
  { name: 'December Release',  draftOrders: 0, date: 'Feb 21, 2025', status: 'Planning' },
]

export function releaseIdFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
