// ─── clubsCatalog ───────────────────────────────────────────────────────────
// Single source of truth for the clubs in the prototype. Both `ClubViewLayout`
// (per-club view) and `MembershipDetailScreen` (rail tile + link-through) read
// from this catalog so a click-through always lands on the matching club.

export type ClubKey =
  | 'curators'
  | 'vintiga-signature'
  | 'vintiga-heritage'
  | 'blind-enthusiasm'
  | 'c7'

/** What kind of club it is — drives which tabs render in `ClubViewLayout`,
 *  mirroring the editor side (see `ClubEditorLayout`):
 *    • curated         → Overview / Members / Releases / Emails
 *    • membership      → Overview / Members / Emails
 *    • account-credit  → Overview / Members / Levels / Emails
 *    • traditional     → Overview / Members / Releases / Emails (read-only) */
export type ClubKind = 'curated' | 'membership' | 'account-credit' | 'traditional'

export interface ClubInfo {
  slug: ClubKey
  name: string
  /** Tag rendered on the rail tile (e.g. "Curated Bottle Club", "Member Choice Club"). */
  type: string
  kind: ClubKind
}

export const CLUBS_CATALOG: Record<ClubKey, ClubInfo> = {
  'curators':           { slug: 'curators',          name: 'Curators Club',     type: 'Curated Bottle Club', kind: 'curated'        },
  'vintiga-signature':  { slug: 'vintiga-signature', name: 'Vintiga Signature', type: 'Rewards Club',         kind: 'membership'     },
  'vintiga-heritage':   { slug: 'vintiga-heritage',  name: 'Vintiga Heritage',  type: 'Curated Bottle Club', kind: 'curated'        },
  'blind-enthusiasm':   { slug: 'blind-enthusiasm',  name: 'Blind Enthusiasm',  type: 'Member Choice Club',  kind: 'account-credit' },
  'c7':                 { slug: 'c7',                name: 'C7',                type: 'Traditional',         kind: 'traditional'    },
}

export const CLUB_KEYS = Object.keys(CLUBS_CATALOG) as ClubKey[]

/** Read the active club slug from the location hash. Routes are
 *  `#/web/clubs/view/{slug}/{tab}`; legacy routes without a slug
 *  (e.g. `#/web/clubs/view/overview`) fall back to Blind Enthusiasm. */
export function getCurrentClubSlug(): ClubKey {
  const m = window.location.hash.match(/^#\/web\/clubs\/view\/([^/?]+)/)
  if (m && (m[1] in CLUBS_CATALOG)) return m[1] as ClubKey
  return 'blind-enthusiasm'
}

export function getCurrentClub(): ClubInfo {
  return CLUBS_CATALOG[getCurrentClubSlug()]
}
