import { useState, useEffect, type FormEvent } from 'react'

// Full-prototype access.
const MAIN_PASSWORD = 'vintiga2026'
const MAIN_KEY = 'vintiga-proto-auth'

// Presentations-only access. Share a deck link with this password and the viewer
// can open the presentations but nothing else in the prototype. It's a separate,
// harder-to-guess secret so the main prototype stays private.
//
// NOTE: this is a client-side gate — the password ships in the bundle, so it
// deters casual access, it is NOT real security. For anything sensitive, gate it
// server-side. To change it, edit the constant below.
const PRESENTATION_PASSWORD = 'Vintiga-Deck-4K9Qm7'
const PRESENTATION_KEY = 'vintiga-presentation-auth'

// A fresh browser tab opened for a Figma capture has no session auth. Detect the
// capture params (same convention as the ?figmaroute= router bypass in App.tsx)
// and skip the gate so the actual screen — not the password prompt — is captured.
function isFigmaCapture() {
  return (
    window.location.hash.includes('figmacapture') ||
    new URLSearchParams(window.location.search).has('figmaroute')
  )
}

// Exact deck routes the presentation password unlocks. NOT a `startsWith`
// prefix — the bare `#/presentations/` (and any unknown sub-path) falls through
// to the prototype hub, so a prefix match would let the presentation password
// into the whole app. Keep this list in sync with the presentation routes
// registered in App.tsx.
const PRESENTATION_ROUTES = [
  '#/presentations/vintiga-overview',
  '#/presentations/vintiga-overview-slides',
]

function isPresentationHash(hash: string) {
  // Normalise away any query string / trailing slash before matching.
  const base = hash.split('?')[0].replace(/\/+$/, '')
  return PRESENTATION_ROUTES.includes(base)
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [hash, setHash] = useState(() => window.location.hash)
  const [mainAuthed, setMainAuthed] = useState(() => sessionStorage.getItem(MAIN_KEY) === 'ok')
  const [presAuthed, setPresAuthed] = useState(() => sessionStorage.getItem(PRESENTATION_KEY) === 'ok')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  // Re-evaluate access as the route changes — a presentations-only viewer who
  // navigates to a prototype route gets re-gated.
  useEffect(() => {
    const onHash = () => { setHash(window.location.hash); setValue(''); setError(false) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const presentationRoute = isPresentationHash(hash)
  const allowed = isFigmaCapture() || (presentationRoute ? mainAuthed || presAuthed : mainAuthed)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (value === MAIN_PASSWORD) {
      sessionStorage.setItem(MAIN_KEY, 'ok')
      setMainAuthed(true)
    } else if (presentationRoute && value === PRESENTATION_PASSWORD) {
      sessionStorage.setItem(PRESENTATION_KEY, 'ok')
      setPresAuthed(true)
    } else {
      setError(true)
    }
  }

  if (allowed) return <>{children}</>

  const title = presentationRoute ? 'Vintiga Presentation' : 'Vintiga Prototypes'
  const subtitle = presentationRoute
    ? 'Enter the password to view this presentation.'
    : 'Enter the password to continue.'

  return (
    <div className="min-h-screen bg-vintiga-surface flex items-center justify-center p-vintiga-lg">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-vintiga-lg">
        <div>
          <h1 className="typo-title-screen font-light text-vintiga-foreground">{title}</h1>
          <p className="typo-body text-vintiga-foreground-muted mt-vintiga-sm">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-vintiga-xs">
          <label htmlFor="pw" className="typo-caption font-semibold text-vintiga-foreground">
            Password
          </label>
          <input
            id="pw"
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            className={`bg-vintiga-surface-element rounded-vintiga-input border px-vintiga-md py-vintiga-sm typo-body focus:outline-none ${
              error ? 'border-vintiga-danger' : 'border-transparent focus:border-vintiga-primary'
            }`}
          />
          {error && <p className="typo-caption text-vintiga-danger">Incorrect password.</p>}
        </div>
        <button
          type="submit"
          className="rounded-vintiga-button bg-vintiga-primary text-vintiga-primary-foreground typo-body-sm font-semibold px-vintiga-lg py-vintiga-sm hover:opacity-90 transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  )
}
