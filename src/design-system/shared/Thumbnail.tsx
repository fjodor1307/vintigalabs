import { useState } from 'react'
import { NoImageArt } from './NoImageArt'

// Image with a graceful no-image fallback. Used wherever a product, collection
// row, or editor header might have a missing or broken `imageUrl`. Renders the
// shared `NoImageArt` SVG when:
//   • `src` is empty / undefined, OR
//   • the browser fails to load the image (404, CORS, blob URL revoked, etc.)
//
// Pass the same className you'd give an <img> — it's forwarded to whichever
// element is rendered, so the parent's fixed-size + rounded-clip wrapper keeps
// working unchanged.

export interface ThumbnailProps {
  src?: string
  alt?: string
  className?: string
  /** Lazy-loading hint for the underlying <img>. Default: 'lazy'. */
  loading?: 'eager' | 'lazy'
}

export function Thumbnail({ src, alt = '', className = '', loading = 'lazy' }: ThumbnailProps) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return <NoImageArt className={className} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setErrored(true)}
      className={className}
    />
  )
}
