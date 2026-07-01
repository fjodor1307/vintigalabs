import { useState, type FormEvent } from 'react'

const PASSWORD = 'vintiga2026'
const STORAGE_KEY = 'vintiga-proto-auth'

// A fresh browser tab opened for a Figma capture has no session auth. Detect the
// capture params (same convention as the ?figmaroute= router bypass in App.tsx)
// and skip the gate so the actual screen — not the password prompt — is captured.
function isFigmaCapture() {
  return (
    window.location.hash.includes('figmacapture') ||
    new URLSearchParams(window.location.search).has('figmaroute')
  )
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'ok' || isFigmaCapture(),
  )
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'ok')
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-screen bg-vintiga-surface flex items-center justify-center p-vintiga-lg">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm flex flex-col gap-vintiga-lg"
      >
        <div>
          <h1 className="typo-title-screen font-light text-vintiga-foreground">
            Vintiga Prototypes
          </h1>
          <p className="typo-body text-vintiga-foreground-muted mt-vintiga-sm">
            Enter the password to continue.
          </p>
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
              error
                ? 'border-vintiga-danger'
                : 'border-transparent focus:border-vintiga-primary'
            }`}
          />
          {error && (
            <p className="typo-caption text-vintiga-danger">Incorrect password.</p>
          )}
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
