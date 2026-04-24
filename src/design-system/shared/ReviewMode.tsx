/* eslint-disable react-refresh/only-export-components */
import { useMemo, useState, useEffect } from 'react'
import { configBySlug } from '../../prototypes/_registry'

// Shareable review links:
//   #/review/<slug>         — all screens in that prototype
//   #/review/<slug>/<flow>  — only routes starting with "#/web/<slug>/<flow>/"
//
// Comments are persisted to localStorage under `vintiga-review:<slug>` and can
// be encoded into the URL via the "Copy share link" button — the recipient
// opens the link, sees the comments pre-filled, and can reply in the same
// textarea. No backend.

const PHONE_W = 390
const PHONE_H = 844
const WEB_W = 1440
const WEB_H = 900

type Comments = Record<string, string>

function storageKey(slug: string) {
  return `vintiga-review:${slug}`
}

function loadComments(slug: string): Comments {
  try {
    const raw = localStorage.getItem(storageKey(slug))
    return raw ? (JSON.parse(raw) as Comments) : {}
  } catch {
    return {}
  }
}

function saveComments(slug: string, comments: Comments) {
  try {
    localStorage.setItem(storageKey(slug), JSON.stringify(comments))
  } catch {
    // quota or disabled — swallow, review still works in-memory
  }
}

function encodeComments(comments: Comments): string {
  const trimmed: Comments = {}
  for (const [k, v] of Object.entries(comments)) if (v.trim()) trimmed[k] = v
  if (Object.keys(trimmed).length === 0) return ''
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(trimmed))))
  } catch {
    return ''
  }
}

function decodeComments(encoded: string | null): Comments | null {
  if (!encoded) return null
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded)))) as Comments
  } catch {
    return null
  }
}

function prettyScreenName(path: string, prefix: string): string {
  const slug = path.startsWith(prefix) ? path.substring(prefix.length) : path.split('/').pop() ?? path
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

type Props = {
  slug: string
  flow?: string
  sharedComments?: Comments | null
}

export function ReviewMode({ slug, flow, sharedComments }: Props) {
  const config = configBySlug(slug)
  const paths = useMemo(() => {
    if (!config) return []
    const all = Object.keys(config.routes)
    if (!flow) return all
    const prefix = `#/web/${slug}/${flow}/`
    return all.filter((p) => p.startsWith(prefix))
  }, [config, slug, flow])

  const prefix = useMemo(() => {
    if (flow) return `#/web/${slug}/${flow}/`
    return paths[0]?.substring(0, paths[0].lastIndexOf('/') + 1) ?? ''
  }, [paths, slug, flow])

  const [comments, setComments] = useState<Comments>(() => ({
    ...loadComments(slug),
    ...(sharedComments ?? {}),
  }))

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    saveComments(slug, comments)
  }, [slug, comments])

  useEffect(() => {
    if (sharedComments) saveComments(slug, { ...loadComments(slug), ...sharedComments })
  }, [slug, sharedComments])

  if (!config) {
    return (
      <div className="min-h-screen bg-vintiga-surface flex items-center justify-center p-vintiga-lg">
        <p className="typo-body text-vintiga-foreground-muted">
          No prototype matches slug <code>{slug}</code>.
        </p>
      </div>
    )
  }

  const isMobile = config.frame === 'mobile'
  const thumbScale = isMobile ? 0.45 : 320 / WEB_W
  const thumbW = isMobile ? Math.round(PHONE_W * thumbScale) : 320
  const thumbH = isMobile ? Math.round(PHONE_H * thumbScale) : Math.round(WEB_H * thumbScale)
  const innerW = isMobile ? PHONE_W : WEB_W
  const innerH = isMobile ? PHONE_H : WEB_H

  function setComment(path: string, value: string) {
    setComments((prev) => ({ ...prev, [path]: value }))
  }

  async function copyShareLink() {
    const encoded = encodeComments(comments)
    const base = `${window.location.origin}${window.location.pathname}#/review/${slug}${flow ? `/${flow}` : ''}`
    const url = encoded ? `${base}?c=${encoded}` : base
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  function clearComments() {
    if (!window.confirm('Clear all comments for this review?')) return
    setComments({})
  }

  const commentCount = Object.values(comments).filter((v) => v.trim()).length

  return (
    <div className="min-h-screen bg-vintiga-surface-secondary pb-vintiga-2xl">
      <header className="sticky top-0 z-30 bg-vintiga-surface border-b border-vintiga-border px-vintiga-lg py-vintiga-md flex items-center gap-vintiga-md flex-wrap">
        <a
          href="#/"
          className="typo-body-sm font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground no-underline"
        >
          ← Back
        </a>
        <div className="flex flex-col">
          <h1 className="typo-title-subsection font-semibold text-vintiga-foreground">
            Review · {slug}
            {flow ? ` / ${flow}` : ''}
          </h1>
          <p className="typo-caption text-vintiga-foreground-muted">
            {paths.length} screen{paths.length === 1 ? '' : 's'} · {commentCount} comment
            {commentCount === 1 ? '' : 's'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-vintiga-sm">
          <button
            type="button"
            onClick={clearComments}
            className="typo-body-sm font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground px-3 py-1.5"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={copyShareLink}
            className="typo-body-sm font-semibold bg-vintiga-primary text-vintiga-primary-foreground rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity"
          >
            {copied ? 'Copied ✓' : 'Copy share link'}
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-vintiga-lg py-vintiga-xl">
        <div className="flex flex-col gap-vintiga-xl">
          {paths.map((p) => {
            const src = `${window.location.pathname}${p}?thumbnail=1`
            return (
              <article
                key={p}
                className="bg-vintiga-surface border border-vintiga-border rounded-vintiga-card p-vintiga-lg grid grid-cols-1 md:grid-cols-[auto_1fr] gap-vintiga-lg"
              >
                <div
                  className="relative bg-vintiga-surface rounded-[20px] overflow-hidden shadow-vintiga-sm ring-1 ring-vintiga-border shrink-0"
                  style={{ width: thumbW, height: thumbH }}
                >
                  <iframe
                    src={src}
                    title={p}
                    tabIndex={-1}
                    style={{
                      width: innerW,
                      height: innerH,
                      transform: `scale(${thumbScale})`,
                      transformOrigin: '0 0',
                      border: 0,
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <div className="flex flex-col gap-vintiga-sm min-w-0">
                  <div className="flex items-center justify-between gap-vintiga-sm">
                    <h2 className="typo-title-subsection font-semibold text-vintiga-foreground">
                      {prettyScreenName(p, prefix)}
                    </h2>
                    <a
                      href={p}
                      className="typo-body-sm font-semibold text-vintiga-primary no-underline hover:underline"
                    >
                      Open screen →
                    </a>
                  </div>
                  <code className="typo-caption text-vintiga-foreground-muted break-all">{p}</code>
                  <label className="flex flex-col gap-1 mt-vintiga-sm">
                    <span className="typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wide">
                      Feedback
                    </span>
                    <textarea
                      value={comments[p] ?? ''}
                      onChange={(e) => setComment(p, e.target.value)}
                      placeholder="What should change on this screen?"
                      className="bg-vintiga-surface-element rounded-vintiga-input border border-transparent focus:border-vintiga-primary focus:outline-none p-vintiga-sm typo-body-sm min-h-[96px] resize-y"
                    />
                  </label>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { decodeComments }
