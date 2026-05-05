// ─── clubViewSample ───────────────────────────────────────────────────────────
// Sample data for the canonical "View Club" prototype. Lives in its own
// module so screens importing it stay separate from the layout component
// (keeps `react-refresh` happy — components-only files only).

export const VIEW_CLUB = {
  id: 'blind-enthusiasm',
  name: 'Blind Enthusiasm',
  type: 'Curated Club',
  totalReleases: 28,
  members: { total: 15, active: 10, onHold: 2, new: 2, canceled: 1 },
  emailTemplates: { customized: 0, global: 10 },
  dateCreated: 'Mar 15, 2025',
  flagged: 3,
}
