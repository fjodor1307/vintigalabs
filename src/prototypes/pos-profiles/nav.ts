// POS Profiles — navigation helpers. The detail route carries the profile id
// (and an optional `edit` intent) as query params, which App strips before the
// exact-match route lookup — so one route serves every profile.

export const listHref = '#/web/pos-profiles/list'

export function profileHref(id: string, edit?: string) {
  const base = `#/web/pos-profiles/profile?id=${encodeURIComponent(id)}`
  return edit ? `${base}&edit=${edit}` : base
}

export function goToProfile(id: string, edit?: string) {
  window.location.hash = profileHref(id, edit)
}

export function goToList() {
  window.location.hash = listHref
}
