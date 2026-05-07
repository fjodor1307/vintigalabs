import { CLUBS_CATALOG, getCurrentClubSlug } from './clubsCatalog'

// ─── clubViewSample ───────────────────────────────────────────────────────────
// Sample stats for the "View Club" prototype. Identity (slug, name, type)
// comes from `clubsCatalog` based on the active hash, so navigating to a
// different club shows that club's name throughout the layout. Stats are
// shared sample data — same numbers across clubs in the prototype.

const SAMPLE_STATS = {
  totalReleases: 28,
  members: { total: 15, active: 10, onHold: 2, new: 2, canceled: 1 },
  emailTemplates: { customized: 0, global: 10 },
  dateCreated: 'Mar 15, 2025',
  flagged: 3,
}

export function getViewClub() {
  const info = CLUBS_CATALOG[getCurrentClubSlug()]
  return {
    id: info.slug,
    name: info.name,
    type: info.type,
    ...SAMPLE_STATS,
  }
}
